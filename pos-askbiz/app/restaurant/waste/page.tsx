'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

const ACC = '#d08a59'

const NS = 'restaurant_waste.'

const REASON_VALUES = ['overcooked','expired','dropped','returned','spoiled','overproduced','trimming','other']

const buildReasons = (tc: (key: string, vars?: Record<string, string | number>) => string) =>
  REASON_VALUES.map(value => ({ value, label: tc(NS + 'reason_' + value) }))

const UNITS = ['portion','kg','g','litre','item']

interface WasteLog {
  id: string; item_name: string; qty: number; unit: string
  cost_per_unit: number; total_cost: number; reason: string; created_at: string
}

interface Summary {
  total_cost: number; total_entries: number
  by_reason: { reason: string; count: number; total_cost: number }[]
  top_wasted_items: { item_name: string; count: number; total_cost: number; total_qty: number }[]
}

type Stage = 'list' | 'add' | 'camera' | 'recognize' | 'review'

const inp: React.CSSProperties = {
  background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
  color: '#f1f5f9', padding: '8px 10px', fontSize: 13,
  boxSizing: 'border-box', width: '100%',
}

const REASON_COLORS: Record<string, string> = {
  overcooked: '#ef4444', expired: '#f59e0b', dropped: '#3b82f6',
  returned: '#8b5cf6', spoiled: '#ef4444', overproduced: '#f97316',
  trimming: '#94a3b8', other: '#64748b',
}

export default function WastePage() {
  const router   = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const REASONS = buildReasons(tc)
  const [sym, setSym]     = useState('£')
  const [period, setPeriod] = useState(7)
  const [stage, setStage] = useState<Stage>('list')
  const [logs, setLogs]   = useState<WasteLog[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  // Camera / recognition
  const videoRef    = useRef<HTMLVideoElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const streamRef   = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview]     = useState<string | null>(null)
  const [recognizing, setRecog]   = useState(false)
  const [recognized, setRecognized] = useState<any>(null)

  // Manual / review form
  const [form, setForm] = useState({
    item_name: '', menu_item_id: '', qty: '1', unit: 'portion',
    cost_per_unit: '', reason: 'overcooked', notes: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: session.headers }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
    }).catch(() => {})
  }, [authReady, session])

  const load = useCallback(async () => {
    if (!session) return
    setLoading(true)
    const res  = await fetch(`/api/pos/restaurant/waste?days=${period}`, { headers: session.headers })
    const data = await res.json()
    setLogs(data.logs || [])
    setSummary(data.summary || null)
    setLoading(false)
  }, [period, session])

  useEffect(() => { if (authReady && session) load() }, [authReady, session, load])

  // Camera
  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setStage('camera')
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}) } }, 100)
    } catch {
      fileInputRef.current?.click()
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  async function captureAndRecognize() {
    if (!videoRef.current || !canvasRef.current) return
    const v = videoRef.current
    canvasRef.current.width  = v.videoWidth
    canvasRef.current.height = v.videoHeight
    canvasRef.current.getContext('2d')?.drawImage(v, 0, 0)
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.82)
    closeCamera()
    await recognizeImage(dataUrl)
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => { await recognizeImage(ev.target?.result as string) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function recognizeImage(dataUrl: string) {
    if (!session) return
    setPreview(dataUrl)
    setStage('recognize')
    setRecog(true)
    const base64 = dataUrl.split(',')[1]
    try {
      const res  = await fetch('/api/pos/restaurant/waste', {
        method: 'PUT', headers: { ...session.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, media_type: 'image/jpeg' }),
      })
      const data = await res.json()
      if (data.recognized) {
        setRecognized(data.recognized)
        setForm(f => ({
          ...f,
          item_name:     data.recognized.item_name     || '',
          menu_item_id:  data.recognized.menu_item_id  || '',
          qty:           String(data.recognized.qty    || 1),
          unit:          data.recognized.unit           || 'portion',
          reason:        data.recognized.reason         || 'other',
          cost_per_unit: data.recognized.cost_per_unit > 0 ? String(data.recognized.cost_per_unit) : '',
          notes:         data.recognized.notes          || '',
        }))
        setStage('review')
      } else {
        setStage('add')
      }
    } catch {
      setStage('add')
    } finally {
      setRecog(false)
    }
  }

  async function save() {
    if (!form.item_name || !form.qty || !session) return
    setSaving(true)
    await fetch('/api/pos/restaurant/waste', {
      method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name:     form.item_name,
        menu_item_id:  form.menu_item_id || null,
        qty:           parseFloat(form.qty) || 1,
        unit:          form.unit,
        cost_per_unit: parseFloat(form.cost_per_unit) || 0,
        reason:        form.reason,
        notes:         form.notes,
      }),
    })
    setSaving(false)
    setStage('list')
    setPreview(null)
    setRecognized(null)
    setForm({ item_name: '', menu_item_id: '', qty: '1', unit: 'portion', cost_per_unit: '', reason: 'overcooked', notes: '' })
    await load()
  }

  function cancelAdd() {
    closeCamera()
    setStage('list')
    setPreview(null)
    setRecognized(null)
  }

  const estCost = (parseFloat(form.cost_per_unit) || 0) * (parseFloat(form.qty) || 1)

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>{tc(NS + 'header_title')}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{tc(NS + 'header_subtitle')}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {[7, 30].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              style={{ background: period === d ? ACC : '#1e293b', border: `1px solid ${period === d ? ACC : '#334155'}`, color: period === d ? '#fff' : '#64748b', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              {tc(NS + 'days_short', { days: d })}
            </button>
          ))}
          {stage === 'list' && (
            <button onClick={() => setStage('add')}
              style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              {tc(NS + 'log_waste_btn')}
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px' }}>

        {/* ── LIST VIEW ── */}
        {stage === 'list' && (
          <>
            {/* KPI strip */}
            {summary && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
                {[
                  { label: tc(NS + 'kpi_total_waste_cost'),  value: `${sym}${summary.total_cost.toFixed(2)}`,    color: '#ef4444' },
                  { label: tc(NS + 'kpi_log_entries'),        value: String(summary.total_entries),               color: '#94a3b8' },
                  { label: tc(NS + 'kpi_top_reason'),         value: summary.by_reason[0] ? (REASONS.find(x => x.value === summary.by_reason[0].reason)?.label || summary.by_reason[0].reason) : '—', color: '#f59e0b' },
                  { label: tc(NS + 'kpi_top_wasted_item'),     value: summary.top_wasted_items[0]?.item_name || '—', color: ACC    },
                ].map(k => (
                  <div key={k.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: k.color, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* By-reason breakdown */}
            {summary && summary.by_reason.length > 0 && (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>{tc(NS + 'waste_by_reason')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {summary.by_reason.map(r => {
                    const pct = summary.total_cost > 0 ? (r.total_cost / summary.total_cost) * 100 : 0
                    const color = REASON_COLORS[r.reason] || '#64748b'
                    const label = REASONS.find(x => x.value === r.reason)?.label || r.reason
                    return (
                      <div key={r.reason}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span>{label}</span>
                          <span style={{ color, fontWeight: 600 }}>{sym}{r.total_cost.toFixed(2)} · {tc(NS + (r.count === 1 ? 'logs_count_one' : 'logs_count_other'), { count: r.count })}</span>
                        </div>
                        <div style={{ background: '#0f172a', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Top wasted items */}
            {summary && summary.top_wasted_items.length > 0 && (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13, color: '#94a3b8' }}>{tc(NS + 'most_wasted_items')}</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {[tc(NS + 'th_item'), tc(NS + 'th_times'), tc(NS + 'th_qty'), tc(NS + 'th_cost')].map(h => (
                        <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.top_wasted_items.map((item, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #0f172a' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600, fontSize: 14 }}>{item.item_name}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: '#94a3b8' }}>{item.count}×</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: '#94a3b8' }}>{item.total_qty}</td>
                        <td style={{ padding: '10px 16px', fontSize: 14, fontWeight: 700, color: '#ef4444' }}>{sym}{item.total_cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Log entries */}
            {!loading && logs.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🗑️</div>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{tc(NS + 'empty_title')}</div>
                <div style={{ fontSize: 13 }}>{tc(NS + 'empty_blurb')}</div>
              </div>
            )}

            {logs.length > 0 && (
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#64748b', marginBottom: 10 }}>{tc(NS + 'recent_entries')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {logs.slice(0, 30).map((log, idx) => {
                    const reasonLabel = REASONS.find(r => r.value === log.reason)?.label || log.reason
                    const color = REASON_COLORS[log.reason] || '#64748b'
                    return (
                      <div key={log.id} className="pos-item" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                        <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: color, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{log.item_name}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                            {log.qty} {log.unit} · {reasonLabel} · {new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>
                          {log.total_cost > 0 ? `${sym}${log.total_cost.toFixed(2)}` : '—'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ADD MANUALLY ── */}
        {(stage === 'add' || stage === 'review') && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              {stage === 'review' ? tc(NS + 'review_title') : tc(NS + 'add_title')}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
              {stage === 'review' ? tc(NS + 'review_blurb') : tc(NS + 'add_blurb')}
            </div>

            {/* Photo option when in manual-add mode */}
            {stage === 'add' && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button onClick={openCamera}
                  style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  {tc(NS + 'take_photo')}
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                  {tc(NS + 'upload')}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </div>
            )}

            {preview && stage === 'review' && (
              <img src={preview} alt={tc(NS + 'img_alt_waste')} style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 16, border: '1px solid #334155' }} />
            )}

            {recognized && stage === 'review' && (
              <div className="pos-reveal" style={{ background: 'rgba(208,138,89,0.08)', border: '1px solid rgba(208,138,89,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
                {tc(NS + 'claude_says')} <strong>{recognized.item_name}</strong> · {tc(NS + 'confidence_pct', { confidence: recognized.confidence })}
                {recognized.notes && <div style={{ color: '#94a3b8', marginTop: 2 }}>{recognized.notes}</div>}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_item_name')}</label>
                <input value={form.item_name} onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))}
                  placeholder={tc(NS + 'placeholder_item_name')} style={inp} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_quantity')}</label>
                  <input type="number" step="0.1" min="0" value={form.qty}
                    onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_unit')}</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} style={inp}>
                    {UNITS.map(u => <option key={u} value={u}>{tc(NS + 'unit_' + u)}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_reason')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {REASONS.map(r => (
                    <button key={r.value} onClick={() => setForm(f => ({ ...f, reason: r.value }))}
                      style={{ background: form.reason === r.value ? REASON_COLORS[r.value] || '#334155' : '#0f172a', border: `1px solid ${form.reason === r.value ? REASON_COLORS[r.value] || '#334155' : '#334155'}`, color: '#f1f5f9', padding: '7px 4px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: form.reason === r.value ? 700 : 400, textAlign: 'center' }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_cost_per_unit', { sym })}</label>
                <input type="number" step="0.01" min="0" value={form.cost_per_unit}
                  onChange={e => setForm(f => ({ ...f, cost_per_unit: e.target.value }))}
                  placeholder={tc(NS + 'placeholder_cost_per_unit')} style={inp} />
                {estCost > 0 && (
                  <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>
                    {tc(NS + 'estimated_waste_cost')} <strong>{sym}{estCost.toFixed(2)}</strong>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_notes')}</label>
                <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder={tc(NS + 'placeholder_notes')} style={inp} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={cancelAdd}
                style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '11px', borderRadius: 8, cursor: 'pointer' }}>
                {tc(NS + 'cancel')}
              </button>
              <button onClick={save} disabled={saving || !form.item_name} className="pos-btn-primary"
                style={{ flex: 2, background: '#ef4444', border: 'none', color: '#fff', padding: '11px', borderRadius: 8, cursor: saving || !form.item_name ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, opacity: saving || !form.item_name ? 0.5 : 1 }}>
                {saving ? tc(NS + 'saving') : tc(NS + 'log_waste_submit')}
              </button>
            </div>
          </div>
        )}

        {/* ── CAMERA ── */}
        {stage === 'camera' && (
          <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => { closeCamera(); setStage('add') }}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                {tc(NS + 'camera_cancel')}
              </button>
              <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: 13 }}>{tc(NS + 'camera_point')}</div>
            </div>
            <video ref={videoRef} playsInline muted style={{ flex: 1, objectFit: 'cover', width: '100%' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
              <button onClick={captureAndRecognize}
                style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', border: '4px solid rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                📷
              </button>
            </div>
          </div>
        )}

        {/* ── RECOGNIZING ── */}
        {stage === 'recognize' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            {preview && (
              <img src={preview} alt={tc(NS + 'img_alt_waste')} style={{ maxWidth: 240, borderRadius: 12, marginBottom: 24, border: '2px solid #334155', maxHeight: 180, objectFit: 'cover' }} />
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{tc(NS + 'recognize_heading')}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{tc(NS + 'recognize_blurb')}</div>
          </div>
        )}
      </div>
    </div>
  )
}
