'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ACC        = '#d08a59'
const ACC_LIGHT  = 'rgba(208,138,89,.12)'
const ACC_BORDER = 'rgba(208,138,89,.25)'
const GREEN      = '#16a34a'
const GREEN_BG   = 'rgba(22,163,74,.1)'
const RED        = '#dc2626'
const RED_BG     = 'rgba(220,38,38,.1)'
const AMBER      = '#ca8a04'
const AMBER_BG   = 'rgba(202,138,4,.1)'
const BLUE       = '#2563eb'

const API = process.env.NEXT_PUBLIC_API_URL || ''

// ── Types ──────────────────────────────────────────────────
interface StaffSession {
  id: string; name: string; role: string
  owner_id: string; location_id: string | null; currency_symbol: string
}
interface ServiceJob {
  id: string; ticket_number: string; status: string
  device_model: string | null; fault_description: string
  customer_name: string | null; quoted_price: number | null
  assigned_to: string | null; created_at: string
}
interface FactoryCapture {
  id: string; type: string; status: string; photo_url: string; storage: string
  product_name: string | null; batch_ref: string | null; quantity: number | null
  notes: string | null; created_at: string
  captured_by_staff?: { id: string; name: string; role: string } | null
}
interface InventoryItem {
  id: string; name: string; stock_qty: number
  low_stock_threshold: number; sale_price: number; category: string | null
}
interface Transaction {
  id: string; total: number; payment_type: string
  status: string; created_at: string
  cashier?: { name: string } | null
}

// ── Helpers ────────────────────────────────────────────────
function fmt(sym: string, n: number) {
  return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString()
}
const STATUS_COLOR: Record<string, string> = {
  intake: AMBER, quoted: BLUE, accepted: BLUE, in_progress: ACC,
  completed: GREEN, collected: '#6b7280', cancelled: RED,
  pending: AMBER, approved: GREEN, rejected: RED,
}

// ── Toast ──────────────────────────────────────────────────
function Toast({ msg, ok, onDone }: { msg: string; ok: boolean; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, padding: '12px 20px', borderRadius: 12, background: ok ? 'rgba(22,163,74,.95)' : 'rgba(220,38,38,.95)', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,.18)', maxWidth: 360 }}>
      {msg}
    </div>
  )
}

function Badge({ status }: { status: string }) {
  const color = STATUS_COLOR[status] || '#6b7280'
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + '20', color, textTransform: 'uppercase', letterSpacing: '.04em' }}>
      {status.replace('_', ' ')}
    </span>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e2dc', borderRadius: 14, padding: '18px 20px', ...style }}>
      {children}
    </div>
  )
}

function StatTile({ label, value, color = '#1a1916', sub }: { label: string; value: string | number; color?: string; sub?: string }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: '#6b6760', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#6b6760', marginTop: 4 }}>{sub}</div>}
    </Card>
  )
}

// ── Engineer dashboard ─────────────────────────────────────
function EngineerDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [jobs, setJobs] = useState<ServiceJob[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`${API}/api/pos/service-jobs?assigned_to=${session.id}&limit=50`, { headers: h })
    const d = await r.json()
    setJobs(d.jobs || [])
    setLoading(false)
  }, [session.id, session.owner_id])

  useEffect(() => { load() }, [load])

  const updateStatus = async (job: ServiceJob, newStatus: string) => {
    setUpdating(job.id)
    const r = await fetch(`${API}/api/pos/service-jobs`, {
      method: 'PATCH', headers: h,
      body: JSON.stringify({ id: job.id, status: newStatus }),
    })
    const d = await r.json()
    if (d.job) { notify(`#${job.ticket_number} → ${newStatus.replace('_', ' ')}`); load() }
    else notify(d.error || 'Update failed', false)
    setUpdating(null)
  }

  const active = jobs.filter(j => ['accepted', 'in_progress'].includes(j.status))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
        <StatTile label="Active Jobs" value={active.length} color={ACC} />
        <StatTile label="Total Assigned" value={jobs.length} />
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>My Jobs</span>
          <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
        </div>
        {loading ? <div style={{ color: '#6b6760', fontSize: 13 }}>Loading…</div> : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b6760', fontSize: 14 }}>No jobs assigned to you</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.map(job => (
              <div key={job.id} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e5e2dc', background: '#f9f8f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: ACC }}>#{job.ticket_number}</span>
                      <Badge status={job.status} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{job.device_model || 'Unknown device'}</div>
                    <div style={{ fontSize: 12, color: '#6b6760', marginBottom: 2 }}>{job.fault_description}</div>
                    {job.customer_name && <div style={{ fontSize: 11, color: '#6b6760' }}>👤 {job.customer_name}</div>}
                    <div style={{ fontSize: 11, color: '#6b6760', marginTop: 2 }}>{timeAgo(job.created_at)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {job.status === 'accepted' && (
                      <button disabled={updating === job.id} onClick={() => updateStatus(job, 'in_progress')}
                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: updating === job.id ? 0.6 : 1 }}>
                        Start
                      </button>
                    )}
                    {job.status === 'in_progress' && (
                      <button disabled={updating === job.id} onClick={() => updateStatus(job, 'completed')}
                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: updating === job.id ? 0.6 : 1 }}>
                        Complete ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// ── Repair dashboard ───────────────────────────────────────
function RepairDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [jobs, setJobs] = useState<ServiceJob[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '50' })
    if (filter !== 'all') params.set('status', filter)
    const r = await fetch(`${API}/api/pos/service-jobs?${params}`, { headers: h })
    const d = await r.json()
    setJobs(d.jobs || [])
    setLoading(false)
  }, [session.id, session.owner_id, filter])

  useEffect(() => { load() }, [load])

  const counts = jobs.reduce((acc: Record<string, number>, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10 }}>
        <StatTile label="Intake"      value={counts.intake || 0}      color={AMBER} />
        <StatTile label="In Progress" value={counts.in_progress || 0} color={ACC} />
        <StatTile label="Completed"   value={counts.completed || 0}   color={GREEN} />
        <StatTile label="Total"       value={jobs.length} />
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Service Jobs</span>
          <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {['all', 'intake', 'quoted', 'accepted', 'in_progress', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter === s ? ACC : '#e5e2dc'}`, background: filter === s ? ACC_LIGHT : 'transparent', color: filter === s ? ACC : '#6b6760', textTransform: 'capitalize' }}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        {loading ? <div style={{ color: '#6b6760', fontSize: 13 }}>Loading…</div> : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: '#6b6760', fontSize: 13 }}>No jobs found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {jobs.map(job => (
              <div key={job.id} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #e5e2dc', background: '#f9f8f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: ACC, fontSize: 13 }}>#{job.ticket_number}</span>
                    <Badge status={job.status} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{job.device_model || '—'}</div>
                  <div style={{ fontSize: 12, color: '#6b6760' }}>{job.customer_name || 'No customer'} · {timeAgo(job.created_at)}</div>
                </div>
                {job.quoted_price != null && (
                  <div style={{ fontWeight: 700, fontSize: 14, color: GREEN }}>{fmt(session.currency_symbol, job.quoted_price)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// ── Supervisor dashboard ───────────────────────────────────
function SupervisorDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [captures, setCaptures] = useState<FactoryCapture[]>([])
  const [jobs, setJobs] = useState<ServiceJob[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actioning, setActioning] = useState<string | null>(null)

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const [capR, jobR] = await Promise.all([
      fetch(`${API}/api/pos/factory/capture?status=pending&limit=50`, { headers: h }),
      fetch(`${API}/api/pos/service-jobs?limit=30`, { headers: h }),
    ])
    const [capD, jobD] = await Promise.all([capR.json(), jobR.json()])
    setCaptures(capD.captures || [])
    setJobs(jobD.jobs || [])
    setLoading(false)
  }, [session.id, session.owner_id])

  useEffect(() => { load() }, [load])

  const actOnCapture = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    setActioning(id)
    const r = await fetch(`${API}/api/pos/factory/capture`, {
      method: 'PATCH', headers: h,
      body: JSON.stringify({ id, status, rejection_reason: reason }),
    })
    const d = await r.json()
    if (d.capture) { notify(`Capture ${status}`); load() }
    else notify(d.error || 'Action failed', false)
    setActioning(null); setRejectId(null); setRejectReason('')
  }

  const jobCounts = jobs.reduce((acc: Record<string, number>, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
        <StatTile label="Pending Approvals" value={captures.length} color={captures.length > 0 ? AMBER : GREEN} />
        <StatTile label="In Progress"       value={jobCounts.in_progress || 0} color={ACC} />
        <StatTile label="Completed"         value={jobCounts.completed || 0}   color={GREEN} />
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Pending Captures</span>
          <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
        </div>
        {loading ? <div style={{ color: '#6b6760', fontSize: 13 }}>Loading…</div> : captures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: GREEN, fontSize: 14 }}>✓ All captures reviewed</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {captures.map(cap => (
              <div key={cap.id} style={{ borderRadius: 10, border: '1px solid #e5e2dc', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
                  {cap.storage === 'supabase' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cap.photo_url} alt="capture" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid #e5e2dc' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize', color: ACC }}>{cap.type}</span>
                      {cap.product_name && <span style={{ fontSize: 12, color: '#6b6760' }}>{cap.product_name}</span>}
                      {cap.batch_ref && <span style={{ fontSize: 11, color: '#6b6760', background: '#f0ede8', padding: '1px 6px', borderRadius: 4 }}>Batch: {cap.batch_ref}</span>}
                    </div>
                    {cap.quantity != null && <div style={{ fontSize: 12, color: '#6b6760' }}>Qty: {cap.quantity}</div>}
                    {cap.notes && <div style={{ fontSize: 12, color: '#6b6760', fontStyle: 'italic' }}>{cap.notes}</div>}
                    <div style={{ fontSize: 11, color: '#6b6760', marginTop: 4 }}>
                      By {cap.captured_by_staff?.name || 'Unknown'} · {timeAgo(cap.created_at)}
                    </div>
                  </div>
                  {rejectId !== cap.id && (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button disabled={actioning === cap.id} onClick={() => actOnCapture(cap.id, 'approved')}
                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: actioning === cap.id ? 0.6 : 1 }}>✓</button>
                      <button disabled={actioning === cap.id} onClick={() => { setRejectId(cap.id); setRejectReason('') }}
                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: RED_BG, color: RED, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                </div>
                {rejectId === cap.id && (
                  <div style={{ padding: '0 14px 12px', borderTop: '1px solid #e5e2dc', paddingTop: 10 }}>
                    <input placeholder="Reason for rejection…" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e2dc', fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button disabled={!rejectReason.trim() || actioning === cap.id}
                        onClick={() => actOnCapture(cap.id, 'rejected', rejectReason)}
                        style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: RED, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: (!rejectReason.trim() || actioning === cap.id) ? 0.5 : 1 }}>
                        Reject
                      </button>
                      <button onClick={() => setRejectId(null)}
                        style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', color: '#6b6760', fontSize: 12, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Jobs Overview</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(jobCounts).map(([status, count]) => (
            <div key={status} style={{ padding: '8px 14px', borderRadius: 10, background: (STATUS_COLOR[status] || '#6b7280') + '12', border: `1px solid ${STATUS_COLOR[status] || '#6b7280'}25`, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: STATUS_COLOR[status] || '#6b7280' }}>{count}</div>
              <div style={{ fontSize: 10, color: '#6b6760', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── Manager dashboard ──────────────────────────────────────
function ManagerDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [jobs, setJobs]         = useState<ServiceJob[]>([])
  const [captures, setCaptures] = useState<FactoryCapture[]>([])
  const [txns, setTxns]         = useState<Transaction[]>([])
  const [loading, setLoading]   = useState(true)

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const today = new Date().toISOString().slice(0, 10)
    const [jobR, capR, txR] = await Promise.all([
      fetch(`${API}/api/pos/service-jobs?limit=100`, { headers: h }),
      fetch(`${API}/api/pos/factory/capture?status=pending&limit=50`, { headers: h }),
      fetch(`${API}/api/pos/transactions?start=${today}&limit=100`, { headers: h }),
    ])
    const [jobD, capD, txD] = await Promise.all([jobR.json(), capR.json(), txR.json()])
    setJobs(jobD.jobs || [])
    setCaptures(capD.captures || [])
    setTxns(txD.transactions || [])
    setLoading(false)
  }, [session.id, session.owner_id])

  useEffect(() => { load() }, [load])

  const revenue   = txns.filter(t => t.status === 'completed').reduce((s, t) => s + t.total, 0)
  const jobCounts = jobs.reduce((acc: Record<string, number>, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
        <StatTile label="Today's Revenue"   value={fmt(session.currency_symbol, revenue)} color={GREEN} />
        <StatTile label="Pending Approvals" value={captures.length} color={captures.length > 0 ? AMBER : GREEN} />
        <StatTile label="Active Jobs"       value={(jobCounts.accepted || 0) + (jobCounts.in_progress || 0)} color={ACC} />
        <StatTile label="Completed"         value={jobCounts.completed || 0} color={GREEN} />
      </div>

      {captures.length > 0 && (
        <Card style={{ borderColor: AMBER + '50' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: AMBER, marginBottom: 8 }}>⚠ {captures.length} captures awaiting approval</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['intake', 'output', 'wastage', 'dispatch'] as const).map(type => {
              const n = captures.filter(c => c.type === type).length
              if (!n) return null
              return <span key={type} style={{ padding: '3px 10px', borderRadius: 20, background: AMBER_BG, color: AMBER, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{n} {type}</span>
            })}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Jobs by Status</div>
        {loading ? <div style={{ color: '#6b6760', fontSize: 13 }}>Loading…</div> : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['intake', 'quoted', 'accepted', 'in_progress', 'completed', 'collected', 'cancelled'].map(status => {
              const n = jobCounts[status] || 0
              return (
                <div key={status} style={{ padding: '8px 14px', borderRadius: 10, background: STATUS_COLOR[status] + '12', border: `1px solid ${STATUS_COLOR[status]}25`, textAlign: 'center', minWidth: 56 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: STATUS_COLOR[status] }}>{n}</div>
                  <div style={{ fontSize: 10, color: '#6b6760', textTransform: 'capitalize', marginTop: 2 }}>{status.replace('_', ' ')}</div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Today's Transactions</div>
        {txns.length === 0 ? <div style={{ color: '#6b6760', fontSize: 13 }}>No transactions today</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {txns.slice(0, 8).map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: '#f9f8f6', border: '1px solid #e5e2dc' }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.payment_type?.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: '#6b6760', marginLeft: 8 }}>{timeAgo(t.created_at)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge status={t.status} />
                  <span style={{ fontWeight: 700, color: t.status === 'refunded' ? RED : GREEN, fontSize: 13 }}>{fmt(session.currency_symbol, t.total)}</span>
                </div>
              </div>
            ))}
            {txns.length > 8 && <div style={{ fontSize: 12, color: '#6b6760', textAlign: 'center' }}>+{txns.length - 8} more</div>}
          </div>
        )}
      </Card>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────
export default function DashboardPage() {
  const router  = useRouter()
  const [session, setSession] = useState<StaffSession | null>(null)
  const [ready, setReady]     = useState(false)
  const [toast, setToast]     = useState<{ msg: string; ok: boolean } | null>(null)
  const notify = useCallback((msg: string, ok = true) => setToast({ msg, ok }), [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pos_staff')
      if (!raw) { router.replace('/'); return }
      const s = JSON.parse(raw) as StaffSession
      if (!s.id || !s.owner_id) { router.replace('/'); return }
      // Only roles that should be here — others redirect to their own pages
      if (!['engineer', 'repair', 'supervisor', 'manager'].includes(s.role)) {
        router.replace(s.role === 'inventory' ? '/inventory' : '/sell')
        return
      }
      setSession(s)
    } catch { router.replace('/') }
    setReady(true)
  }, [router])

  const logout = () => {
    localStorage.removeItem('pos_staff')
    router.replace('/')
  }

  if (!ready || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f8f6' }}>
      <div style={{ color: '#6b6760', fontSize: 14 }}>Loading…</div>
    </div>
  )

  const ROLE_LABEL: Record<string, string> = {
    manager: 'Manager', supervisor: 'Supervisor', repair: 'Repair Tech', engineer: 'Engineer',
  }
  const ROLE_COLOR: Record<string, string> = {
    manager: ACC, supervisor: BLUE, repair: '#0891b2', engineer: '#0891b2',
  }

  const renderDashboard = () => {
    switch (session.role) {
      case 'engineer':   return <EngineerDashboard   session={session} notify={notify} />
      case 'repair':     return <RepairDashboard     session={session} notify={notify} />
      case 'supervisor': return <SupervisorDashboard session={session} notify={notify} />
      case 'manager':
      default:           return <ManagerDashboard    session={session} notify={notify} />
    }
  }

  const roleColor = ROLE_COLOR[session.role] || ACC
  const roleLabel = ROLE_LABEL[session.role] || session.role

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e2dc', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1916', lineHeight: 1.2 }}>{session.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: roleColor, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: roleColor, fontWeight: 600 }}>{roleLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={logout}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', color: '#6b6760', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 60px' }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1916' }}>{roleLabel} Dashboard</h1>
          <div style={{ fontSize: 13, color: '#6b6760', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        {renderDashboard()}
      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />}
    </div>
  )
}
