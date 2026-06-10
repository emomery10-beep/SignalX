'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#22c55e'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface InvItem {
  id: string; name: string; sku?: string; sale_price?: number; cost_price?: number
  stock_qty?: number; low_stock_threshold?: number; category?: string
}
interface CountRow { item: InvItem; counted: string }

type Stage = 'idle' | 'camera' | 'scanning' | 'error'

export default function RetailStocktake() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [sym, setSym] = useState('£')
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  useEffect(() => { if (ready) load() }, [ready])
  useEffect(() => () => stopCamera(), [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/inventory`)
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
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
    } catch (e) {
      console.error('camera error', e)
      setCamError('Camera unavailable — use "Choose photo" instead.')
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
    setStage('scanning'); setScanMsg('Identifying products…')
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
    try {
      const res = await fetch(`${API}/api/pos/recognize-inventory`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
      setScanMsg(added ? `Added ${added} product${added > 1 ? 's' : ''} to count` : 'No matching catalog products found')
      setShowScan(false); setStage('idle')
    } catch (e) {
      console.error('recognize error', e)
      setCamError('Could not identify products. Try again or add manually.')
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data) {
        const vv = Number(data.total_variance_value) || 0
        const sign = vv >= 0 ? '+' : '−'
        setSubmitMsg(`${data.adjusted}/${data.total} adjusted ✓ · variance ${sign}${sym}${Math.abs(vv).toLocaleString(undefined, { maximumFractionDigits: 2 })}`)
        setRows([])
        await load()
      } else {
        setSubmitMsg(data?.error || 'Could not save adjustments — please try again.')
      }
    } catch (e) {
      console.error('submit error', e)
      setSubmitMsg('Submit failed. Please try again.')
    } finally { setSubmitting(false) }
  }

  const inp: React.CSSProperties = { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box' }
  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #334155' }
  const td: React.CSSProperties = { padding: '12px', fontSize: 13, borderBottom: '1px solid #1e293b' }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/retail')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>📦 Stocktake</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Camera-assisted counting</div>
          </div>
        </div>
        <button onClick={() => { setShowScan(true); setStage('idle'); setScanMsg('') }} style={{ background: ACC, border: 'none', color: '#fff', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          📷 Scan Shelf
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Summary cards */}
        <div className="pos-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
          <SummaryCard label="Items in Count" value={`${rows.length}`} />
          <SummaryCard label="Counted" value={`${countedRows.length}`} />
          <SummaryCard label="Variance Units" value={`${varianceUnits > 0 ? '+' : ''}${varianceUnits}`} status={varianceUnits === 0 ? 'good' : 'warn'} />
          <SummaryCard label="Variance Value" value={`${varianceValue < 0 ? '-' : ''}${sym}${Math.abs(varianceValue).toFixed(2)}`} status={varianceValue === 0 ? 'good' : 'bad'} />
        </div>

        {scanMsg && <div className="pos-banner" style={{ background: '#1e293b', border: `1px solid ${ACC}40`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#e2e8f0' }}>{scanMsg}</div>}

        {/* Add products */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Add products to count</div>
          <input placeholder="Search to add an item…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: '100%' }} />
          {search && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {candidates.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>No matches — try a different name or SKU</div>}
              {candidates.map(i => (
                <button key={i.id} onClick={() => { addRow(i); setSearch('') }} style={{ textAlign: 'left', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', color: '#f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{i.name} <span style={{ color: '#64748b' }}>{i.sku || ''}</span></span>
                  <span style={{ color: ACC }}>+ Add</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Count table */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>Product</th><th style={th}>System</th><th style={th}>Counted</th><th style={th}>Variance</th><th style={th}></th>
            </tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td style={td} colSpan={5}><span style={{ color: '#64748b' }}>{loading ? 'Loading…' : 'No items yet — scan a shelf or search to add products.'}</span></td></tr>}
              {rows.map((r, idx) => {
                const sys = r.item.stock_qty ?? 0
                const cnt = r.counted === '' ? null : parseInt(r.counted)
                const diff = cnt == null || isNaN(cnt) ? null : cnt - sys
                const mismatch = diff != null && diff !== 0
                return (
                  <tr key={r.item.id} className="pos-item" style={{ background: mismatch ? 'rgba(239,68,68,0.07)' : 'transparent', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <td style={{ ...td, fontWeight: 600 }}>{r.item.name}<div style={{ fontSize: 11, color: '#64748b', fontWeight: 400 }}>{r.item.sku || r.item.category || ''}</div></td>
                    <td style={td}>{sys}</td>
                    <td style={td}><input value={r.counted} onChange={e => setCount(r.item.id, e.target.value)} placeholder="—" inputMode="numeric" style={{ ...inp, width: 80, padding: '6px 8px' }} /></td>
                    <td style={td}>{diff == null ? <span style={{ color: '#64748b' }}>—</span> : <span style={{ fontWeight: 700, color: diff === 0 ? '#22c55e' : '#ef4444' }}>{diff > 0 ? '+' : ''}{diff}</span>}</td>
                    <td style={td}><button onClick={() => removeRow(r.item.id)} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Remove</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {submitMsg && <div className="pos-banner" style={{ marginBottom: 12, fontSize: 13, color: submitMsg.includes('✓') ? '#22c55e' : '#f59e0b' }}>{submitMsg}</div>}

        <button className="pos-btn-primary" onClick={submitAdjustments} disabled={submitting || countedRows.length === 0} style={{ width: '100%', background: countedRows.length === 0 ? '#334155' : ACC, border: 'none', color: '#fff', padding: '14px', borderRadius: 12, cursor: countedRows.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15, opacity: submitting || countedRows.length === 0 ? 0.5 : 1 }}>
          {submitting ? 'Saving…' : `Submit Adjustments (${countedRows.length})`}
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />

      {/* Scan modal */}
      {showScan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }} onClick={closeScan}>
          <div className="pos-sheet" onClick={e => e.stopPropagation()} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: ACC }}>Scan Shelf</div>
              <button onClick={closeScan} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {stage === 'idle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={startCamera} style={{ background: ACC, border: 'none', color: '#fff', padding: '16px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>📷 Open Camera</button>
                <button onClick={() => fileRef.current?.click()} style={{ background: '#334155', border: 'none', color: '#f1f5f9', padding: '14px', borderRadius: 12, cursor: 'pointer', fontSize: 14 }}>🖼️ Choose Photo</button>
                <div style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginTop: 4 }}>Point at a shelf — recognised items are added to your count.</div>
              </div>
            )}

            {stage === 'camera' && (
              <div>
                <video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 12, background: '#000', maxHeight: 360, objectFit: 'cover' }} />
                {camError && <div style={{ color: '#f59e0b', fontSize: 13, marginTop: 10 }}>{camError}</div>}
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button onClick={captureFrame} style={{ flex: 1, background: ACC, border: 'none', color: '#fff', padding: '14px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>Capture</button>
                  <button onClick={() => { stopCamera(); setStage('idle') }} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '14px 20px', borderRadius: 12, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}

            {stage === 'scanning' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{scanMsg || 'Identifying…'}</div>
              </div>
            )}

            {stage === 'error' && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                <div style={{ color: '#f59e0b', fontSize: 14, marginBottom: 16 }}>{camError}</div>
                <button onClick={() => setStage('idle')} style={{ background: ACC, border: 'none', color: '#fff', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Try Again</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, status }: { label: string; value: string; status?: 'good' | 'warn' | 'bad' }) {
  const colors: Record<string, string> = { good: '#22c55e', warn: '#f59e0b', bad: '#ef4444' }
  const col = status ? colors[status] : '#f1f5f9'
  return (
    <div style={{ background: '#1e293b', border: `1px solid ${status ? col + '40' : '#334155'}`, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: col, margin: '4px 0' }}>{value}</div>
    </div>
  )
}
