'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { fetchInventory } from '@/lib/pos-inventory-fetch'
import { Button, Input } from '@/components/ui'

type Tc = (key: string, vars?: Record<string, string | number>) => string

// ── Design tokens (from CSS variables in globals.css) ──────────────────────
const tokens = {
  bg:        'var(--pos-bg)',
  surface:   'var(--pos-surface)',
  border:    'var(--pos-border)',
  ink:       'var(--pos-ink)',
  muted:     'var(--pos-muted)',
  hint:      'var(--pos-hint)',
  accent:    'var(--pos-accent)',
  danger:    'var(--pos-danger)',
  success:   'var(--pos-success)',
  warning:   'var(--pos-warning)',
}

const ACC = tokens.accent
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface InvItem {
  id: string; name: string; sku?: string; sale_price?: number; cost_price?: number
  stock_qty?: number; low_stock_threshold?: number; category?: string; last_sold_at?: string
}

type Stage = 'idle' | 'camera' | 'scanning' | 'review' | 'saving' | 'done' | 'error'

interface Draft {
  name: string; category: string; sku: string
  sale_price: string; cost_price: string; stock_qty: string; low_stock_threshold: string
}

const emptyDraft: Draft = { name: '', category: '', sku: '', sale_price: '', cost_price: '', stock_qty: '0', low_stock_threshold: '5' }

export default function RetailProductsPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: tokens.bg }} />}><RetailProducts /></Suspense>
}

function RetailProducts() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const { tc } = useLang()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<InvItem[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [lowOnly, setLowOnly] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [editStock, setEditStock] = useState('')

  // Add / camera flow
  const [showAdd, setShowAdd] = useState(false)
  const [stage, setStage] = useState<Stage>('idle')
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [camError, setCamError] = useState('')
  const [scanMsg, setScanMsg] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [staffHeaders, setStaffHeaders] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pos_staff')
      if (raw) {
        const s = JSON.parse(raw)
        if (s?.id && s?.owner_id) {
          const h = { 'x-staff-id': s.id, 'x-owner-id': s.owner_id }
          setStaffHeaders(h)
          if (s.currency_symbol) setSym(s.currency_symbol)
          setReady(true)
          if (params.get('low') === '1') setLowOnly(true)
          return
        }
      }
    } catch {}
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
    if (params.get('low') === '1') setLowOnly(true)
  }, [])

  useEffect(() => { if (ready) load() }, [ready])
  useEffect(() => () => stopCamera(), [])

  async function load() {
    setLoading(true)
    try {
      const data = await fetchInventory({ ownerId: staffHeaders['x-owner-id'] || '', staffId: staffHeaders['x-staff-id'] || '' })
      setItems(data.inventory || [])
    } catch (e) { console.error('inventory load error', e) }
    finally { setLoading(false) }
  }

  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean))) as string[]

  const filtered = items.filter(i => {
    if (search && !(`${i.name} ${i.sku || ''}`.toLowerCase().includes(search.toLowerCase()))) return false
    if (catFilter !== 'all' && i.category !== catFilter) return false
    if (lowOnly && !(typeof i.stock_qty === 'number' && i.stock_qty <= (i.low_stock_threshold ?? 5))) return false
    return true
  })

  function margin(i: InvItem): number | null {
    if (!i.sale_price || !i.cost_price) return null
    if (i.sale_price <= 0) return null
    return Math.round(((i.sale_price - i.cost_price) / i.sale_price) * 100)
  }

  // ---- Camera handling ----
  async function startCamera() {
    setCamError(''); setStage('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) }
    } catch (e: any) {
      console.error('camera error', e)
      setCamError(tc('retail_products.camera_unavailable'))
      // fall back to file input automatically
      fileRef.current?.click()
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  async function captureFrame() {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 1280, h = video.videoHeight || 720
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    stopCamera()
    await scan(dataUrl)
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => scan(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function scan(dataUrl: string) {
    setStage('scanning'); setScanMsg(tc('retail_products.scan_analysing'))
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
    try {
      const res = await fetch(`${API}/api/pos/scan-product-full`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ image: base64 }),
      })
      if (!res.ok) throw new Error(`scan failed ${res.status}`)
      const data = await res.json()
      const p = data.product || data || {}
      setDraft({
        name: p.name || '',
        category: p.category || '',
        sku: p.sku || p.barcode || '',
        sale_price: p.suggested_price != null ? String(p.suggested_price) : (p.sale_price != null ? String(p.sale_price) : ''),
        cost_price: p.cost_price != null ? String(p.cost_price) : '',
        stock_qty: '0',
        low_stock_threshold: '5',
      })
      setStage('review')
    } catch (e) {
      console.error('scan error', e)
      setScanMsg(tc('retail_products.scan_failed'))
      setDraft(emptyDraft)
      setStage('review')
    }
  }

  async function saveDraft() {
    if (!draft.name.trim()) { setScanMsg(tc('retail_products.name_required')); return }
    setStage('saving')
    try {
      const res = await fetch(`${API}/api/pos/inventory`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({
          name: draft.name.trim(),
          category: draft.category.trim() || null,
          sku: draft.sku.trim() || null,
          sale_price: parseFloat(draft.sale_price) || 0,
          cost_price: parseFloat(draft.cost_price) || 0,
          stock_qty: parseInt(draft.stock_qty) || 0,
          low_stock_threshold: parseInt(draft.low_stock_threshold) || 5,
        }),
      })
      if (!res.ok) throw new Error(`save failed ${res.status}`)
      setStage('done')
      await load()
    } catch (e) {
      console.error('save error', e)
      setScanMsg(tc('retail_products.save_failed'))
      setStage('review')
    }
  }

  function closeAdd() {
    stopCamera(); setShowAdd(false); setStage('idle'); setDraft(emptyDraft); setCamError(''); setScanMsg('')
  }

  // ---- Inline edit ----
  function beginEdit(i: InvItem) {
    setEditId(i.id); setEditPrice(String(i.sale_price ?? '')); setEditStock(String(i.stock_qty ?? ''))
  }
  async function saveEdit(i: InvItem) {
    try {
      await fetch(`${API}/api/pos/inventory`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ id: i.id, sale_price: parseFloat(editPrice) || 0, stock_qty: parseInt(editStock) || 0 }),
      })
    } catch (e) { console.error('edit save error', e) }
    setEditId(null)
    await load()
  }

  const inp: React.CSSProperties = { background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 8, color: tokens.ink, padding: '10px 12px', fontSize: 14, width: '100%', boxSizing: 'border-box' }
  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${tokens.border}` }
  const td: React.CSSProperties = { padding: '12px', fontSize: 13, borderBottom: `1px solid ${tokens.border}` }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/retail')} style={{ background: tokens.border, border: 'none', color: tokens.muted, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>📦 {tc('retail_products.header_title')}</div>
            <div style={{ fontSize: 12, color: tokens.muted }}>{tc('retail_products.header_subtitle')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => { setShowAdd(true); setDraft(emptyDraft); setScanMsg(''); setStage('review') }}>
            ✏️ {tc('retail_products.add_manually')}
          </Button>
          <Button variant="primary" onClick={() => { setShowAdd(true); setStage('idle') }}>
            📷 {tc('retail_products.add_by_photo')}
          </Button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input placeholder={tc('retail_products.search_placeholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 260 }} />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inp, width: 'auto' }}>
            <option value="all">{tc('retail_products.all_categories')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setLowOnly(v => !v)} style={{ background: lowOnly ? tokens.warning : tokens.border, border: 'none', color: lowOnly ? tokens.bg : tokens.muted, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ⚠️ {tc('retail_products.low_stock')}
          </button>
          <div style={{ marginLeft: 'auto', color: tokens.hint, fontSize: 13 }}>{tc('retail_products.count_of', { shown: filtered.length, total: items.length })}</div>
        </div>

        {/* Table */}
        <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>{tc('retail_products.col_name')}</th><th style={th}>{tc('retail_products.col_sku')}</th><th style={th}>{tc('retail_products.col_category')}</th>
              <th style={th}>{tc('retail_products.col_stock')}</th><th style={th}>{tc('retail_products.col_price')}</th><th style={th}>{tc('retail_products.col_cost')}</th><th style={th}>{tc('retail_products.col_margin')}</th><th style={th}></th>
            </tr></thead>
            <tbody>
              {loading && <tr><td style={td} colSpan={8}><span style={{ color: tokens.hint }}>{tc('retail_products.loading')}</span></td></tr>}
              {!loading && filtered.length === 0 && <tr><td style={td} colSpan={8}><span style={{ color: tokens.hint }}>{tc('retail_products.no_products')}</span></td></tr>}
              {filtered.map((i, idx) => {
                const low = typeof i.stock_qty === 'number' && i.stock_qty <= (i.low_stock_threshold ?? 5)
                const m = margin(i)
                const editing = editId === i.id
                return (
                  <tr key={i.id} className="pos-item" style={{ background: low ? 'rgba(245,158,11,0.06)' : 'transparent', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <td style={{ ...td, fontWeight: 600 }}>{i.name}</td>
                    <td style={{ ...td, color: tokens.muted }}>{i.sku || '—'}</td>
                    <td style={{ ...td, color: tokens.muted }}>{i.category || '—'}</td>
                    <td style={td}>
                      {editing
                        ? <input value={editStock} onChange={e => setEditStock(e.target.value)} style={{ ...inp, width: 70, padding: '6px 8px' }} />
                        : <span style={{ fontWeight: 700, color: low ? (i.stock_qty! <= 0 ? tokens.danger : tokens.warning) : tokens.ink }}>{i.stock_qty ?? '—'}</span>}
                    </td>
                    <td style={td}>
                      {editing
                        ? <input value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ ...inp, width: 80, padding: '6px 8px' }} />
                        : <span>{i.sale_price != null ? `${sym}${i.sale_price.toFixed(2)}` : '—'}</span>}
                    </td>
                    <td style={{ ...td, color: tokens.muted }}>{i.cost_price != null ? `${sym}${i.cost_price.toFixed(2)}` : '—'}</td>
                    <td style={td}>{m != null ? <span style={{ color: m >= 50 ? tokens.success : m >= 25 ? tokens.warning : tokens.danger, fontWeight: 700 }}>{m}%</span> : '—'}</td>
                    <td style={td}>
                      {editing
                        ? <span style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => saveEdit(i)} style={{ background: ACC, border: 'none', color: '#fff', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>{tc('retail_products.save')}</button>
                            <button onClick={() => setEditId(null)} style={{ background: tokens.border, border: 'none', color: tokens.muted, padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>✕</button>
                          </span>
                        : <button onClick={() => beginEdit(i)} style={{ background: tokens.border, border: 'none', color: tokens.muted, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>{tc('retail_products.edit')}</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden helpers */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />

      {/* Add / Camera modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }} onClick={closeAdd}>
          <div className="pos-sheet" onClick={e => e.stopPropagation()} style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: ACC }}>{tc('retail_products.add_product')}</div>
              <Button variant="ghost" onClick={closeAdd} style={{ fontSize: 20, padding: 4 }}>✕</Button>
            </div>

            {/* Stage progress */}
            {stage !== 'idle' && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {['camera', 'scanning', 'review', 'done'].map(s => {
                  const order = ['camera', 'scanning', 'review', 'saving', 'done']
                  const cur = order.indexOf(stage === 'saving' ? 'review' : stage)
                  const idx = order.indexOf(s === 'review' ? 'review' : s)
                  const active = cur >= idx
                  return <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: active ? ACC : tokens.border }} />
                })}
              </div>
            )}

            {stage === 'idle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button variant="primary" size="lg" onClick={startCamera} style={{ width: '100%' }}>
                  📷 {tc('retail_products.take_photo')}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => fileRef.current?.click()} style={{ width: '100%' }}>
                  🖼️ {tc('retail_products.choose_photo')}
                </Button>
                <div style={{ textAlign: 'center', color: tokens.hint, fontSize: 12, margin: '4px 0' }}>{tc('retail_products.or_divider')}</div>
                <Button variant="secondary" size="lg" onClick={() => { setDraft(emptyDraft); setStage('review') }} style={{ width: '100%' }}>
                  ✏️ {tc('retail_products.enter_manually')}
                </Button>
                <div style={{ color: tokens.hint, fontSize: 12, textAlign: 'center', marginTop: 4 }}>{tc('retail_products.snap_hint')}</div>
              </div>
            )}

            {stage === 'camera' && (
              <div>
                <video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 12, background: '#000', maxHeight: 360, objectFit: 'cover' }} />
                {camError && <div style={{ color: tokens.warning, fontSize: 13, marginTop: 10 }}>{camError}</div>}
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <Button variant="primary" size="lg" onClick={captureFrame} style={{ flex: 1 }}>{tc('retail_products.capture')}</Button>
                  <Button variant="secondary" size="lg" onClick={() => { stopCamera(); setStage('idle') }}>{tc('retail_products.cancel')}</Button>
                </div>
              </div>
            )}

            {stage === 'scanning' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ color: tokens.ink, fontWeight: 600 }}>{scanMsg || tc('retail_products.analysing')}</div>
                <div style={{ color: tokens.hint, fontSize: 12, marginTop: 6 }}>{tc('retail_products.reading_details')}</div>
              </div>
            )}

            {(stage === 'review' || stage === 'saving') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {scanMsg && <div style={{ color: tokens.warning, fontSize: 13, marginBottom: 8 }}>{scanMsg}</div>}
                <Input label={tc('retail_products.field_name')} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label={tc('retail_products.field_category')} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} />
                  <Input label={tc('retail_products.field_sku')} value={draft.sku} onChange={e => setDraft({ ...draft, sku: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label={tc('retail_products.field_sale_price', { sym })} value={draft.sale_price} onChange={e => setDraft({ ...draft, sale_price: e.target.value })} inputMode="decimal" />
                  <Input label={tc('retail_products.field_cost_price', { sym })} value={draft.cost_price} onChange={e => setDraft({ ...draft, cost_price: e.target.value })} inputMode="decimal" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label={tc('retail_products.field_stock_qty')} value={draft.stock_qty} onChange={e => setDraft({ ...draft, stock_qty: e.target.value })} inputMode="numeric" />
                  <Input label={tc('retail_products.field_low_stock_alert')} value={draft.low_stock_threshold} onChange={e => setDraft({ ...draft, low_stock_threshold: e.target.value })} inputMode="numeric" />
                </div>
                <Button variant="primary" size="lg" onClick={saveDraft} loading={stage === 'saving'} loadingLabel={tc('retail_products.saving')} style={{ width: '100%' }}>
                  {tc('retail_products.save_product')}
                </Button>
              </div>
            )}

            {stage === 'done' && (
              <div className="pos-reveal" style={{ textAlign: 'center', padding: '30px 0' }}>
                <div className="pos-success-icon" style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{tc('retail_products.product_added')}</div>
                <div style={{ color: tokens.hint, fontSize: 13, marginTop: 6, marginBottom: 20 }}>{tc('retail_products.product_added_detail', { name: draft.name })}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button variant="primary" onClick={() => { setDraft(emptyDraft); setScanMsg(''); setStage('idle') }} style={{ flex: 1 }}>{tc('retail_products.add_another')}</Button>
                  <Button variant="secondary" onClick={closeAdd}>{tc('retail_products.done')}</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
