'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'

const ACC = '#6366f1'
const GOOD = '#22c55e', WARN = '#f59e0b', BAD = '#ef4444', MUTED = '#94a3b8', DIM = '#64748b'

interface Job {
  id: string
  ticket_number: string
  status: string
  customer_name: string | null
  customer_phone: string | null
  device_model: string | null
  device_serial: string | null
  device_description: string | null
  fault_description: string | null
  engineer_notes: string | null
  quoted_price: number | null
  intake_photo_url: string | null
  checkout_photo_url: string | null
  created_at: string
  estimated_minutes: number | null
  assigned_staff?: { id: string; name: string; role: string } | null
}

interface HistoryEntry { id: string; from_status: string | null; to_status: string; notes: string | null; created_at: string }
interface Part { id: string; name: string; qty: number; unit_cost: number; line_total: number }

// Columns map to the real API statuses
const COLUMNS: { key: string; label: string }[] = [
  { key: 'intake', label: 'Intake' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Ready' },
  { key: 'collected', label: 'Collected' },
]
const STATUS_COLOR: Record<string, string> = {
  intake: MUTED, quoted: WARN, accepted: ACC, in_progress: '#8b5cf6',
  completed: GOOD, collected: GOOD, cancelled: BAD,
}
const STATUS_LABEL: Record<string, string> = {
  intake: 'Intake', quoted: 'Quoted', accepted: 'Accepted',
  in_progress: 'In Progress', completed: 'Ready', collected: 'Collected', cancelled: 'Cancelled',
}
// Valid forward transitions (mirrors the API)
const NEXT_STATUS: Record<string, { value: string; label: string }[]> = {
  intake: [{ value: 'quoted', label: 'Send Quote' }, { value: 'cancelled', label: 'Cancel' }],
  quoted: [{ value: 'accepted', label: 'Accept' }, { value: 'cancelled', label: 'Cancel' }],
  accepted: [{ value: 'in_progress', label: 'Start Repair' }, { value: 'cancelled', label: 'Cancel' }],
  in_progress: [{ value: 'completed', label: 'Mark Ready' }],
  completed: [{ value: 'collected', label: 'Collect' }, { value: 'in_progress', label: 'Re-open' }],
  collected: [],
  cancelled: [{ value: 'intake', label: 'Re-open' }],
}

function daysOpen(iso: string) { return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)) }
function fmtDate(iso: string) { return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }

export default function RepairTickets() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const [sym, setSym] = useState('£')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'board' | 'list'>('board')

  // detail
  const [selected, setSelected] = useState<Job | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [parts, setParts] = useState<Part[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [detailError, setDetailError] = useState('')

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: { ...session.headers } }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
      if (c.staff_sector && c.staff_sector !== 'repair') router.push('/pos')
    }).catch(() => {})
  }, [authReady, session])

  const loadJobs = useCallback(async () => {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch('/api/pos/service-jobs?limit=500', { headers: { ...session.headers } })
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (e) { console.error('Tickets load error:', e) }
    finally { setLoading(false) }
  }, [session])

  useEffect(() => {
    if (!authReady || !session) return
    loadJobs()
    const interval = setInterval(loadJobs, 30000)
    return () => clearInterval(interval)
  }, [authReady, session, loadJobs])

  const openDetail = async (job: Job) => {
    setSelected(job); setHistory([]); setParts([]); setDetailError('')
    setDetailLoading(true)
    try {
      const [hRes, pRes] = await Promise.all([
        fetch(`/api/pos/service-jobs/history?job_id=${job.id}`, { headers: { ...session?.headers } }).catch(() => null),
        fetch(`/api/pos/service-jobs/parts?job_id=${job.id}`, { headers: { ...session?.headers } }).catch(() => null),
      ])
      if (hRes && hRes.ok) { const h = await hRes.json(); setHistory(h.history || []) }
      if (pRes && pRes.ok) { const p = await pRes.json(); setParts(p.parts || []) }
    } catch {}
    setDetailLoading(false)
  }

  const changeStatus = async (status: string) => {
    if (!selected) return
    setUpdating(true); setDetailError('')
    try {
      const res = await fetch('/api/pos/service-jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({ id: selected.id, status }),
      })
      const data = await res.json()
      if (!res.ok) { setDetailError(data.error || 'Failed to update'); setUpdating(false); return }
      setSelected(data.job)
      setJobs(prev => prev.map(j => j.id === data.job.id ? { ...j, ...data.job } : j))
      openDetail(data.job)
    } catch { setDetailError('Failed to update. Check connection.') }
    setUpdating(false)
  }

  const filtered = jobs.filter(j => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [j.ticket_number, j.customer_name, j.device_model, j.device_serial, j.customer_phone]
      .filter(Boolean).some(v => (v as string).toLowerCase().includes(q))
  })

  const card: React.CSSProperties = { background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }

  if (!authReady) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: MUTED, fontFamily: 'system-ui, sans-serif' }}>Loading…</div>

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/repair')} style={{ background: '#334155', border: 'none', color: MUTED, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: ACC }}>🔧 Tickets</div>
          <div style={{ fontSize: 12, color: MUTED }}>{filtered.length} repair ticket{filtered.length === 1 ? '' : 's'}</div>
        </div>
        <div style={{ display: 'flex', background: '#0f172a', borderRadius: 8, padding: 3, gap: 2 }}>
          {(['board', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: view === v ? ACC : 'transparent', color: view === v ? '#fff' : MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {v === 'board' ? 'Board' : 'List'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '14px 20px 0' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer, device, serial or ticket #…"
          style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }} />
      </div>

      <div style={{ padding: 20 }}>
        {loading && jobs.length === 0 && <div style={{ color: DIM, fontSize: 13 }}>Loading tickets…</div>}
        {!loading && filtered.length === 0 && <div style={{ color: DIM, fontSize: 13, textAlign: 'center', padding: '40px 0' }}>No tickets match. <button onClick={() => router.push('/repair/intake')} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13 }}>Start a new intake →</button></div>}

        {/* BOARD VIEW */}
        {view === 'board' && filtered.length > 0 && (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {COLUMNS.map(col => {
              const colJobs = filtered.filter(j => j.status === col.key)
              return (
                <div key={col.key} style={{ minWidth: 240, flex: '0 0 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[col.key] }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{col.label}</span>
                    <span style={{ fontSize: 12, color: DIM }}>{colJobs.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {colJobs.map((j, idx) => (
                      <button key={j.id} onClick={() => openDetail(j)} className="pos-item" style={{ ...card, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{j.device_model || 'Unknown device'}</div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{j.customer_name || 'Walk-in'} · #{j.ticket_number}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: DIM }}>
                          <span>{daysOpen(j.created_at)}d open</span>
                          {j.quoted_price ? <span style={{ color: ACC }}>{sym}{Number(j.quoted_price).toFixed(2)}</span> : null}
                        </div>
                        {j.assigned_staff && <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>👤 {j.assigned_staff.name}</div>}
                      </button>
                    ))}
                    {colJobs.length === 0 && <div style={{ fontSize: 11, color: DIM, textAlign: 'center', padding: '12px 0' }}>No tickets here</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((j, idx) => (
              <button key={j.id} onClick={() => openDetail(j)} className="pos-item" style={{ ...card, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{j.device_model || 'Unknown device'} <span style={{ color: DIM, fontWeight: 400 }}>#{j.ticket_number}</span></div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{j.customer_name || 'Walk-in'} · {j.fault_description?.slice(0, 60) || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: (STATUS_COLOR[j.status] || DIM) + '22', color: STATUS_COLOR[j.status] || DIM }}>{STATUS_LABEL[j.status] || j.status}</span>
                  <div style={{ fontSize: 11, color: DIM, marginTop: 4 }}>{daysOpen(j.created_at)}d · {j.assigned_staff?.name || 'unassigned'}{j.quoted_price ? ` · ${sym}${Number(j.quoted_price).toFixed(2)}` : ''}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} className="pos-sheet" style={{ width: 'min(480px, 100%)', height: '100%', background: '#0f172a', borderLeft: '1px solid #334155', overflowY: 'auto' }}>
            {/* drawer header */}
            <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 2 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selected.device_model || 'Unknown device'}</div>
                <div style={{ fontSize: 12, color: MUTED }}>#{selected.ticket_number}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: '#334155', border: 'none', color: MUTED, width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* status + actions */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 20, background: (STATUS_COLOR[selected.status] || DIM) + '22', color: STATUS_COLOR[selected.status] || DIM }}>{STATUS_LABEL[selected.status] || selected.status}</span>
                {detailError && <div style={{ color: BAD, fontSize: 13, marginTop: 10 }}>{detailError}</div>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {(NEXT_STATUS[selected.status] || []).map(t => (
                    <button key={t.value} onClick={() => changeStatus(t.value)} disabled={updating}
                      className={t.value === 'cancelled' ? undefined : 'pos-btn-primary'}
                      style={{ padding: '9px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', opacity: updating ? 0.6 : 1, background: t.value === 'cancelled' ? '#334155' : ACC, color: t.value === 'cancelled' ? MUTED : '#fff' }}>
                      {t.label}
                    </button>
                  ))}
                  {(NEXT_STATUS[selected.status] || []).length === 0 && <span style={{ fontSize: 12, color: DIM }}>No further actions</span>}
                </div>
              </div>

              {/* info */}
              <div style={{ ...card, padding: 16 }}>
                <Row label="Customer" value={selected.customer_name || 'Walk-in'} />
                <Row label="Phone" value={selected.customer_phone || '—'} />
                <Row label="Serial / IMEI" value={selected.device_serial || '—'} />
                <Row label="Device" value={selected.device_description || '—'} />
                <Row label="Engineer" value={selected.assigned_staff?.name || 'Unassigned'} />
                <Row label="Quote" value={selected.quoted_price != null ? `${sym}${Number(selected.quoted_price).toFixed(2)}` : 'TBC'} />
                <Row label="Opened" value={`${fmtDate(selected.created_at)} (${daysOpen(selected.created_at)}d ago)`} />
              </div>

              {/* fault */}
              <div style={{ ...card, padding: 16 }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>Fault description</div>
                <div style={{ fontSize: 13, color: '#f1f5f9', lineHeight: 1.5 }}>{selected.fault_description || '—'}</div>
                {selected.engineer_notes && <>
                  <div style={{ fontSize: 12, color: MUTED, margin: '12px 0 6px' }}>Engineer notes</div>
                  <div style={{ fontSize: 13, color: '#f1f5f9', lineHeight: 1.5 }}>{selected.engineer_notes}</div>
                </>}
              </div>

              {/* photos */}
              {(selected.intake_photo_url || selected.checkout_photo_url) && (
                <div style={{ ...card, padding: 16 }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Photos</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selected.intake_photo_url && <img src={selected.intake_photo_url} alt="intake" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #334155' }} />}
                    {selected.checkout_photo_url && <img src={selected.checkout_photo_url} alt="checkout" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #334155' }} />}
                  </div>
                </div>
              )}

              {/* parts */}
              <div style={{ ...card, padding: 16 }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Parts used</div>
                {parts.length === 0 ? <div style={{ fontSize: 13, color: DIM }}>No parts logged</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {parts.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span>{p.name} ×{p.qty}</span>
                        <span style={{ color: MUTED }}>{sym}{Number(p.line_total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* timeline */}
              <div style={{ ...card, padding: 16 }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Timeline</div>
                {detailLoading && <div style={{ fontSize: 13, color: DIM }}>Loading…</div>}
                {!detailLoading && history.length === 0 && <div style={{ fontSize: 13, color: DIM }}>No history yet</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {history.map(h => (
                    <div key={h.id} style={{ display: 'flex', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLOR[h.to_status] || DIM, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: '#f1f5f9' }}>{STATUS_LABEL[h.to_status] || h.to_status}{h.notes ? ` — ${h.notes}` : ''}</div>
                        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{fmtDate(h.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '5px 0', fontSize: 13 }}>
      <span style={{ color: MUTED, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#f1f5f9', textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}
