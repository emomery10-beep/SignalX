'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { Button, Banner, Input } from '@/components/ui'

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
  stock_qty?: number; low_stock_threshold?: number; category?: string
}
interface CountRow { item: InvItem; counted: string }

type Stage = 'idle' | 'camera' | 'scanning' | 'error'

export default function RetailStocktake() {
  const router = useRouter()
  const { tc } = useLang()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<InvItem[]>([])
  const [rows, setRows] = useState<CountRow[]>([])
  const [search, setSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  // camera
  const [showScan, setShowScan] = useState(false)
  const [stage, setStage] = useState<Stage>('idle')
  const [camError, setCamError] = useState('')
  const [scanMsg, setScanMsg] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [staffHeaders, setStaffHeaders] = useState<Record<string, string>>({})
  const { sym } = usePosConfig({ headers: staffHeaders }, ready)

  useEffect(() => {
    // Support both staff PIN-auth (localStorage) and owner Supabase auth
    try {
      const raw = localStorage.getItem('pos_staff')
      if (raw) {
        const s = JSON.parse(raw)
        if (s?.id && s?.owner_id) {
          setStaffHeaders({ 'x-staff-id': s.id, 'x-owner-id': s.owner_id })
          setReady(true)
          return
        }
      }
    } catch {}
    // Fall back to Supabase owner session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/'); return }
      setReady(true)
    })
  }, [])

  useEffect(() => { if (ready) load() }, [ready])
  useEffect(() => () => stopCamera(), [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/inventory`, { headers: staffHeaders })
      const data = res.ok ? await res.json() : {}
      const inv: InvItem[] = data.items || data.inventory || (Array.isArray(data) ? data : [])
      setItems(inv)
    } catch (e) { console.error('inventory load error', e) }
    finally { setLoading(false) }
  }

  function addRow(item: InvItem) {
    setRows(prev => prev.some(r => r.item.id === item.id) ? prev : [...prev, { item, counted: '' }])
  }
  function removeRow(id: string) { setRows(prev => prev.filter(r => r.item.id !== id)) }
  function setCount(id: string, v: string) { setRows(prev => prev.map(r => r.item.id === id ? { ...r, counted: v } : r)) }

  const candidates = items
    .filter(i => !rows.some(r => r.item.id === i.id))
    .filter(i => search && (`${i.name} ${i.sku || ''}`.toLowerCase().includes(search.toLowerCase())))
    .slice(0, 8)

  // summary
  const countedRows = rows.filter(r => r.counted !== '')
  let varianceValue = 0, varianceUnits = 0
  rows.forEach(r => {
    if (r.counted === '') return
    const sys = r.item.stock_qty ?? 0
    const cnt = parseInt(r.counted)
    if (isNaN(cnt)) return
    const diff = cnt - sys
    varianceUnits += diff
    varianceValue += diff * (r.item.cost_price ?? r.item.sale_price ?? 0)
  })

  // ---- Camera ----
  async function startCamera() {
    setCamError(''); setStage('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) }
    } catch (e) {
      console.error('camera error', e)
      setCamError(tc('retail_stocktake.camera_unavailable'))
      fileRef.current?.click()
    }
  }
  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null
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
    await recognize(dataUrl)
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => recognize(reader.result as string)
    reader.readAsDataURL(file)
  }
  async function recognize(dataUrl: string) {
    setStage('scanning'); setScanMsg(tc('retail_stocktake.scan_identifying'))
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
    try {
      const res = await fetch(`${API}/api/pos/recognize-inventory`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ image: base64 }),
      })
      if (!res.ok) throw new Error(`recognize failed ${res.status}`)
      const data = await res.json()
      const matches: any[] = data.products || data.matches || []
      let added = 0
      matches.forEach(m => {
        // match against catalog by id, sku or name
        const found = items.find(i =>
          (m.id && i.id === m.id) ||
          (m.sku && i.sku && i.sku.toLowerCase() === String(m.sku).toLowerCase()) ||
          (m.name && i.name.toLowerCase() === String(m.name).toLowerCase())
        )
        if (found) { addRow(found); added++ }
      })
      setScanMsg(added ? (added > 1 ? tc('retail_stocktake.scan_added_plural', { count: added }) : tc('retail_stocktake.scan_added', { count: added })) : tc('retail_stocktake.scan_no_matches'))
      setShowScan(false); setStage('idle')
    } catch (e) {
      console.error('recognize error', e)
      setCamError(tc('retail_stocktake.scan_error'))
      setStage('error')
    }
  }
  function closeScan() { stopCamera(); setShowScan(false); setStage('idle'); setCamError('') }

  async function submitAdjustments() {
    setSubmitting(true); setSubmitMsg('')
    try {
      const counts = countedRows
        .map(r => ({ id: r.item.id, counted_qty: parseInt(r.counted) }))
        .filter(a => !isNaN(a.counted_qty))
      // Dedicated stocktake endpoint: sets counted quantities, computes variance,
      // and writes a pos_stock_adjustments trail.
      const res = await fetch(`${API}/api/pos/stocktake`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...staffHeaders },
        body: JSON.stringify({ counts }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data) {
        const vv = Number(data.total_variance_value) || 0
        const sign = vv >= 0 ? '+' : '−'
        setSubmitMsg(tc('retail_stocktake.submit_success', { adjusted: data.adjusted, total: data.total, variance: sign + sym + Math.abs(vv).toLocaleString(undefined, { maximumFractionDigits: 2 }) }))
        setRows([])
        await load()
      } else {
        setSubmitMsg(data?.error || tc('retail_stocktake.submit_save_error'))
      }
    } catch (e) {
      console.error('submit error', e)
      setSubmitMsg(tc('retail_stocktake.submit_failed'))
    } finally { setSubmitting(false) }
  }

  const inp: React.CSSProperties = { background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 8, color: tokens.ink, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box' }
  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${tokens.border}` }
  const td: React.CSSProperties = { padding: '12px', fontSize: 13, borderBottom: `1px solid ${tokens.border}` }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="secondary" onClick={() => router.push('/retail')}>←</Button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>📦 {tc('retail_stocktake.header_title')}</div>
            <div style={{ fontSize: 12, color: tokens.muted }}>{tc('retail_stocktake.header_subtitle')}</div>
          </div>
        </div>
        <Button variant="primary" onClick={() => { setShowScan(true); setStage('idle'); setScanMsg('') }}>
          📷 {tc('retail_stocktake.scan_shelf_btn')}
        </Button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Summary cards */}
        <div className="pos-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
          <SummaryCard label={tc('retail_stocktake.summary_items_in_count')} value={`${rows.length}`} />
          <SummaryCard label={tc('retail_stocktake.summary_counted')} value={`${countedRows.length}`} />
          <SummaryCard label={tc('retail_stocktake.summary_variance_units')} value={`${varianceUnits > 0 ? '+' : ''}${varianceUnits}`} status={varianceUnits === 0 ? 'good' : 'warn'} />
          <SummaryCard label={tc('retail_stocktake.summary_variance_value')} value={`${varianceValue < 0 ? '-' : ''}${sym}${Math.abs(varianceValue).toFixed(2)}`} status={varianceValue === 0 ? 'good' : 'bad'} />
        </div>

        {scanMsg && <Banner tone="info">{scanMsg}</Banner>}

        {/* Add products */}
        <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>{tc('retail_stocktake.add_products_title')}</div>
          <Input placeholder={tc('retail_stocktake.search_placeholder')} value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {candidates.length === 0 && <div style={{ color: tokens.hint, fontSize: 13 }}>{tc('retail_stocktake.search_no_matches')}</div>}
              {candidates.map((i, idx) => (
                <button key={i.id} className="pos-item" onClick={() => { addRow(i); setSearch('') }} style={{ textAlign: 'left', background: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', color: tokens.ink, display: 'flex', justifyContent: 'space-between', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <span>{i.name} <span style={{ color: tokens.hint }}>{i.sku || ''}</span></span>
                  <span style={{ color: ACC }}>{tc('retail_stocktake.add_btn')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Count table */}
        <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>{tc('retail_stocktake.col_product')}</th><th style={th}>{tc('retail_stocktake.col_system')}</th><th style={th}>{tc('retail_stocktake.col_counted')}</th><th style={th}>{tc('retail_stocktake.col_variance')}</th><th style={th}></th>
            </tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td style={td} colSpan={5}><span style={{ color: tokens.hint }}>{loading ? tc('retail_stocktake.loading') : tc('retail_stocktake.empty_rows')}</span></td></tr>}
              {rows.map((r, idx) => {
                const sys = r.item.stock_qty ?? 0
                const cnt = r.counted === '' ? null : parseInt(r.counted)
                const diff = cnt == null || isNaN(cnt) ? null : cnt - sys
                const mismatch = diff != null && diff !== 0
                return (
                  <tr key={r.item.id} className="pos-item" style={{ background: mismatch ? 'var(--pos-danger-pale)' : 'transparent', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <td style={{ ...td, fontWeight: 600 }}>{r.item.name}<div style={{ fontSize: 11, color: tokens.hint, fontWeight: 400 }}>{r.item.sku || r.item.category || ''}</div></td>
                    <td style={td}>{sys}</td>
                    <td style={td}><input value={r.counted} onChange={e => setCount(r.item.id, e.target.value)} placeholder="—" inputMode="numeric" style={{ ...inp, width: 80, padding: '6px 8px' }} /></td>
                    <td style={td}>{diff == null ? <span style={{ color: tokens.hint }}>—</span> : <span style={{ fontWeight: 700, color: diff === 0 ? tokens.success : tokens.danger }}>{diff > 0 ? '+' : ''}{diff}</span>}</td>
                    <td style={td}><Button variant="secondary" size="md" onClick={() => removeRow(r.item.id)} style={{ padding: '6px 10px', fontSize: 12 }}>{tc('retail_stocktake.remove_btn')}</Button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {submitMsg && <Banner tone={submitMsg.includes('✓') ? 'success' : 'warning'}>{submitMsg}</Banner>}

        <Button variant="primary" size="lg" onClick={submitAdjustments} disabled={submitting || countedRows.length === 0} loading={submitting} loadingLabel={tc('retail_stocktake.saving')} style={{ width: '100%' }}>
          {tc('retail_stocktake.submit_adjustments', { count: countedRows.length })}
        </Button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />

      {/* Scan modal */}
      {showScan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }} onClick={closeScan}>
          <div className="pos-sheet" onClick={e => e.stopPropagation()} style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: ACC }}>{tc('retail_stocktake.scan_modal_title')}</div>
              <Button variant="ghost" onClick={closeScan} style={{ fontSize: 20, padding: 4 }}>✕</Button>
            </div>

            {stage === 'idle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button variant="primary" size="lg" onClick={startCamera} style={{ width: '100%' }}>📷 {tc('retail_stocktake.open_camera')}</Button>
                <Button variant="secondary" size="lg" onClick={() => fileRef.current?.click()} style={{ width: '100%' }}>🖼️ {tc('retail_stocktake.choose_photo')}</Button>
                <div style={{ color: tokens.hint, fontSize: 12, textAlign: 'center', marginTop: 4 }}>{tc('retail_stocktake.scan_hint')}</div>
              </div>
            )}

            {stage === 'camera' && (
              <div>
                <video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 12, background: '#000', maxHeight: 360, objectFit: 'cover' }} />
                {camError && <div style={{ color: tokens.warning, fontSize: 13, marginTop: 10 }}>{camError}</div>}
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <Button variant="primary" size="lg" onClick={captureFrame} style={{ flex: 1 }}>{tc('retail_stocktake.capture')}</Button>
                  <Button variant="secondary" size="lg" onClick={() => { stopCamera(); setStage('idle') }}>{tc('retail_stocktake.cancel')}</Button>
                </div>
              </div>
            )}

            {stage === 'scanning' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ color: tokens.ink, fontWeight: 600 }}>{scanMsg || tc('retail_stocktake.scanning_fallback')}</div>
              </div>
            )}

            {stage === 'error' && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                <div style={{ color: tokens.warning, fontSize: 14, marginBottom: 16 }}>{camError}</div>
                <Button variant="primary" onClick={() => setStage('idle')}>{tc('retail_stocktake.try_again')}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, status }: { label: string; value: string; status?: 'good' | 'warn' | 'bad' }) {
  const colors: Record<string, string> = { good: tokens.success, warn: tokens.warning, bad: tokens.danger }
  const col = status ? colors[status] : tokens.ink
  return (
    <div style={{ background: tokens.surface, border: `1px solid ${status ? col + '40' : tokens.border}`, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: tokens.hint, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: col, margin: '4px 0' }}>{value}</div>
    </div>
  )
}
