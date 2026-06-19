'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getRoleHomeRoute, isManagerOrAboveLevel } from '@/lib/pos-role-client'

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
interface TransactionItem {
  name: string; qty: number; unit_price: number; inventory_id: string | null
}
interface Transaction {
  id: string; total: number; payment_type: string
  status: string; created_at: string
  cashier?: { name: string; role?: string } | null
  pos_items?: TransactionItem[] | null
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
    <div style={{ background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', borderRadius: 14, padding: '18px 20px', ...style }}>
      {children}
    </div>
  )
}

function StatTile({ label, value, color = 'var(--pos-ink)', sub }: { label: string; value: string | number; color?: string; sub?: string }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: 'var(--pos-muted)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 4 }}>{sub}</div>}
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
        {loading ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>Loading…</div> : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--pos-muted)', fontSize: 14 }}>No jobs assigned to you yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.map((job, idx) => (
              <div key={job.id} className="pos-item" style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid var(--pos-border)', background: 'var(--pos-bg)', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: ACC }}>#{job.ticket_number}</span>
                      <Badge status={job.status} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{job.device_model || 'Unknown device'}</div>
                    <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 2 }}>{job.fault_description}</div>
                    {job.customer_name && <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>👤 {job.customer_name}</div>}
                    <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 2 }}>{timeAgo(job.created_at)}</div>
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
              style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter === s ? ACC : 'var(--pos-border)'}`, background: filter === s ? ACC_LIGHT : 'transparent', color: filter === s ? ACC : 'var(--pos-muted)', textTransform: 'capitalize' }}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        {loading ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>Loading…</div> : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--pos-muted)', fontSize: 13 }}>No jobs found for this filter</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {jobs.map((job, idx) => (
              <div key={job.id} className="pos-item" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--pos-border)', background: 'var(--pos-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: ACC, fontSize: 13 }}>#{job.ticket_number}</span>
                    <Badge status={job.status} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{job.device_model || '—'}</div>
                  <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{job.customer_name || 'No customer'} · {timeAgo(job.created_at)}</div>
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

// ── Supervisor dashboard (legacy `supervisor` role — factory context) ─
// Shows ONLY factory capture approvals — no service jobs, no retail.
function SupervisorDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [captures, setCaptures] = useState<FactoryCapture[]>([])
  const [loading, setLoading]   = useState(true)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actioning, setActioning] = useState<string | null>(null)

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`${API}/api/pos/factory/capture?status=pending&limit=50`, { headers: h })
    const d = await r.json()
    setCaptures(d.captures || [])
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
        <StatTile label="Pending Approvals" value={captures.length} color={captures.length > 0 ? AMBER : GREEN} />
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Pending Captures</span>
          <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
        </div>
        {loading ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>Loading…</div> : captures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: GREEN, fontSize: 14 }}>✓ All captures reviewed</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {captures.map((cap, idx) => (
              <div key={cap.id} className="pos-item" style={{ borderRadius: 10, border: '1px solid var(--pos-border)', overflow: 'hidden', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
                  {cap.storage === 'supabase' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cap.photo_url} alt="capture" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--pos-border)' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize', color: ACC }}>{cap.type}</span>
                      {cap.product_name && <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{cap.product_name}</span>}
                      {cap.batch_ref && <span style={{ fontSize: 11, color: 'var(--pos-muted)', background: '#f0ede8', padding: '1px 6px', borderRadius: 4 }}>Batch: {cap.batch_ref}</span>}
                    </div>
                    {cap.quantity != null && <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>Qty: {cap.quantity}</div>}
                    {cap.notes && <div style={{ fontSize: 12, color: 'var(--pos-muted)', fontStyle: 'italic' }}>{cap.notes}</div>}
                    <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 4 }}>
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
                  <div style={{ padding: '0 14px 12px', borderTop: '1px solid var(--pos-border)', paddingTop: 10 }}>
                    <input placeholder="Reason for rejection…" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--pos-border)', fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button disabled={!rejectReason.trim() || actioning === cap.id}
                        onClick={() => actOnCapture(cap.id, 'rejected', rejectReason)}
                        style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: RED, color: '#fff', fontSize: 12, fontWeight: 700, cursor: !rejectReason.trim() ? 'not-allowed' : 'pointer', opacity: !rejectReason.trim() ? 0.5 : 1 }}>
                        Reject
                      </button>
                      <button onClick={() => setRejectId(null)}
                        style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', color: 'var(--pos-muted)', fontSize: 12, cursor: 'pointer' }}>
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
    </div>
  )
}

// ── Retail Manager dashboard ───────────────────────────────
function RetailManagerDashboard({ session }: { session: StaffSession }) {
  const [txns, setTxns]               = useState<Transaction[]>([])
  const [yesterdayRev, setYesterdayRev] = useState<number | null>(null)
  const [inventory, setInventory]     = useState<InventoryItem[]>([])
  const [loading, setLoading]         = useState(true)
  const router = useRouter()

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    // Use correct `from`/`to` params — the API ignores unknown params
    const todayMid = new Date(); todayMid.setHours(0, 0, 0, 0)
    const ydMid    = new Date(todayMid.getTime() - 86400000)
    const fromToday = todayMid.toISOString()
    const fromYd    = ydMid.toISOString()
    const toNow     = new Date().toISOString()

    const [txR, ydR, invR] = await Promise.all([
      fetch(`${API}/api/pos/transactions?from=${fromToday}&to=${toNow}`,          { headers: h }),
      fetch(`${API}/api/pos/transactions?from=${fromYd}&to=${fromToday}`,         { headers: h }),
      fetch(`${API}/api/pos/inventory?limit=500`,                                  { headers: h }),
    ])
    const [txD, ydD, invD] = await Promise.all([txR.json(), ydR.json(), invR.json()])
    setTxns(txD.transactions || [])
    const ydCompleted = (ydD.transactions || []).filter((t: Transaction) => t.status === 'completed')
    setYesterdayRev(ydCompleted.reduce((s: number, t: Transaction) => s + t.total, 0))
    setInventory(invD.inventory || [])
    setLoading(false)
  }, [session.id, session.owner_id])

  useEffect(() => { load() }, [load])

  const sym       = session.currency_symbol || 'KSh'
  const completed = txns.filter(t => t.status === 'completed')
  const refunded  = txns.filter(t => t.status === 'refunded')
  const revenue   = completed.reduce((s, t) => s + t.total, 0)
  const saleCount = completed.length
  const avgTicket = saleCount > 0 ? revenue / saleCount : 0
  const refundAmt = refunded.reduce((s, t) => s + t.total, 0)

  // Revenue delta vs yesterday
  const revDelta = yesterdayRev != null && yesterdayRev > 0
    ? ((revenue - yesterdayRev) / yesterdayRev * 100)
    : null

  // Low stock
  const lowStock   = inventory.filter(i => i.low_stock_threshold > 0 && i.stock_qty <= i.low_stock_threshold)
  const outOfStock = lowStock.filter(i => i.stock_qty <= 0)

  // Staff leaderboard
  const staffMap: Record<string, { name: string; revenue: number; sales: number }> = {}
  completed.forEach(t => {
    const name = t.cashier?.name || 'Unknown'
    if (!staffMap[name]) staffMap[name] = { name, revenue: 0, sales: 0 }
    staffMap[name].revenue += t.total
    staffMap[name].sales   += 1
  })
  const staffLeader = Object.values(staffMap).sort((a, b) => b.revenue - a.revenue)

  // Top sellers from line items
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {}
  completed.forEach(t => {
    (t.pos_items || []).forEach(item => {
      if (!productMap[item.name]) productMap[item.name] = { name: item.name, qty: 0, revenue: 0 }
      productMap[item.name].qty     += item.qty
      productMap[item.name].revenue += item.qty * item.unit_price
    })
  })
  const topSellers = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  // Hourly sales (6am–10pm)
  const hourBuckets = Array.from({ length: 17 }, (_, i) => {
    const hr = i + 6
    const hrs = completed.filter(t => new Date(t.created_at).getHours() === hr)
    return { hr, rev: hrs.reduce((s, t) => s + t.total, 0), count: hrs.length }
  })
  const maxHourRev = Math.max(...hourBuckets.map(b => b.rev), 1)

  // Payment type split
  const payTypes: Record<string, number> = {}
  completed.forEach(t => {
    const p = t.payment_type || 'other'
    payTypes[p] = (payTypes[p] || 0) + t.total
  })
  const payEntries = Object.entries(payTypes).sort((a, b) => b[1] - a[1])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Camera-first quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { emoji: '📷', label: 'New Sale',    sub: 'scan to sell',    route: '/sell' },
          { emoji: '📦', label: 'Restock',     sub: 'scan to restock', route: '/inventory' },
          { emoji: '🔢', label: 'Stock Count', sub: 'scan & count',    route: '/retail/stocktake' },
        ].map(a => (
          <button key={a.route} onClick={() => router.push(a.route)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '14px 8px', borderRadius: 14, border: `1px solid ${ACC_BORDER}`, background: ACC_LIGHT, cursor: 'pointer', minHeight: 80 }}>
            <span style={{ fontSize: 26 }}>{a.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: ACC }}>{a.label}</span>
            <span style={{ fontSize: 10, color: 'var(--pos-muted)' }}>{a.sub}</span>
          </button>
        ))}
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        <Card style={{ gridColumn: 'span 2' }}>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)', fontWeight: 500, marginBottom: 4 }}>Today's Revenue</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: GREEN, lineHeight: 1 }}>{fmt(sym, revenue)}</div>
            {revDelta != null && (
              <div style={{ fontSize: 13, fontWeight: 700, color: revDelta >= 0 ? GREEN : RED, marginBottom: 3 }}>
                {revDelta >= 0 ? '↑' : '↓'} {Math.abs(revDelta).toFixed(0)}% vs yesterday
              </div>
            )}
            {loading && <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 3 }}>Loading…</div>}
          </div>
          {refunded.length > 0 && (
            <div style={{ fontSize: 11, color: RED, marginTop: 4 }}>
              {refunded.length} refund{refunded.length !== 1 ? 's' : ''} — {fmt(sym, refundAmt)}
            </div>
          )}
        </Card>
        <StatTile label="Sales Today"  value={saleCount}           sub={`avg ${fmt(sym, avgTicket)}`} />
        <StatTile label="Low Stock"    value={lowStock.length}
          color={outOfStock.length > 0 ? RED : lowStock.length > 0 ? AMBER : GREEN}
          sub={outOfStock.length > 0 ? `${outOfStock.length} out of stock` : lowStock.length > 0 ? 'needs restocking' : 'all good'} />
      </div>

      {/* Hourly sales bar chart */}
      {completed.length > 0 && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Sales by Hour</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
            {hourBuckets.map(b => (
              <div key={b.hr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div title={`${b.count} sale${b.count !== 1 ? 's' : ''} · ${fmt(sym, b.rev)}`}
                  style={{ width: '100%', height: `${Math.max((b.rev / maxHourRev) * 48, b.rev > 0 ? 6 : 0)}px`, borderRadius: 3, background: b.rev > 0 ? ACC : 'var(--pos-border)', transition: 'height .3s' }} />
                <div style={{ fontSize: 9, color: 'var(--pos-muted)', lineHeight: 1 }}>
                  {b.hr > 12 ? `${b.hr - 12}p` : b.hr === 12 ? '12p' : `${b.hr}a`}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top sellers */}
      {topSellers.length > 0 && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Top Sellers Today</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topSellers.map((p, i) => {
              const pct = Math.round((p.revenue / revenue) * 100)
              return (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? ACC : 'var(--pos-border)', color: i === 0 ? '#fff' : 'var(--pos-muted)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--pos-border)', marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? ACC : 'var(--pos-muted)', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{fmt(sym, p.revenue)}</div>
                    <div style={{ fontSize: 11, color: 'var(--pos-muted)' }}>{p.qty} sold</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Payment type split */}
      {payEntries.length > 1 && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Payment Methods</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {payEntries.map(([type, amt]) => {
              const pct = Math.round((amt / revenue) * 100)
              return (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 70, fontSize: 12, fontWeight: 700, color: 'var(--pos-muted)', textTransform: 'uppercase', flexShrink: 0 }}>{type}</div>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--pos-border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: ACC, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', flexShrink: 0, minWidth: 80, textAlign: 'right' }}>{fmt(sym, amt)}</div>
                  <div style={{ fontSize: 11, color: 'var(--pos-muted)', flexShrink: 0, width: 32, textAlign: 'right' }}>{pct}%</div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <Card style={{ borderColor: outOfStock.length > 0 ? RED + '40' : AMBER + '40' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: outOfStock.length > 0 ? RED : AMBER }}>
              {outOfStock.length > 0 ? `🚨 ${outOfStock.length} out of stock` : `⚠ ${lowStock.length} running low`}
            </div>
            <button onClick={() => router.push('/inventory')}
              style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${ACC}`, background: ACC_LIGHT, color: ACC, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              View all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lowStock.slice(0, 5).map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: item.stock_qty <= 0 ? RED_BG : AMBER_BG, border: `1px solid ${item.stock_qty <= 0 ? RED : AMBER}30` }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos-ink)' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: item.stock_qty <= 0 ? RED : AMBER, fontWeight: 600, marginTop: 1 }}>
                    {item.stock_qty <= 0 ? 'Out of stock' : `${item.stock_qty} left (min ${item.low_stock_threshold})`}
                  </div>
                </div>
                <button onClick={() => router.push('/inventory')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: 'none', background: ACC, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  📷 Restock
                </button>
              </div>
            ))}
            {lowStock.length > 5 && (
              <div style={{ fontSize: 12, color: 'var(--pos-muted)', textAlign: 'center' }}>+{lowStock.length - 5} more — tap View all</div>
            )}
          </div>
        </Card>
      )}

      {/* Staff leaderboard */}
      {staffLeader.length > 0 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>👥 Staff Today</span>
            <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {staffLeader.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: i === 0 ? ACC_LIGHT : 'var(--pos-bg)', border: `1px solid ${i === 0 ? ACC_BORDER : 'var(--pos-border)'}` }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? ACC : 'var(--pos-border)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos-ink)' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{s.sales} sale{s.sales !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: i === 0 ? ACC : 'var(--pos-ink)' }}>{fmt(sym, s.revenue)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent sales */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Recent Sales</span>
          <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻</button>
        </div>
        {txns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--pos-muted)', fontSize: 14 }}>No sales yet today — tap 📷 New Sale to start</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {txns.slice(0, 8).map((t, idx) => (
              <div key={t.id} className="pos-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'var(--pos-bg)', border: '1px solid var(--pos-border)', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t.payment_type?.toUpperCase()}</span>
                    {t.cashier?.name && <span style={{ fontSize: 11, color: 'var(--pos-muted)' }}>· {t.cashier.name}</span>}
                  </div>
                  {(t.pos_items?.length ?? 0) > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 1 }}>
                      {t.pos_items!.slice(0, 2).map(i => i.name).join(', ')}{(t.pos_items!.length > 2) ? ` +${t.pos_items!.length - 2}` : ''}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 1 }}>{timeAgo(t.created_at)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge status={t.status} />
                  <span style={{ fontWeight: 700, color: t.status === 'refunded' ? RED : GREEN, fontSize: 13 }}>{fmt(sym, t.total)}</span>
                </div>
              </div>
            ))}
            {txns.length > 8 && <div style={{ fontSize: 12, color: 'var(--pos-muted)', textAlign: 'center' }}>+{txns.length - 8} more today</div>}
          </div>
        )}
      </Card>
    </div>
  )
}

// ── Repair sector dashboard ────────────────────────────────
// Used by repair-manager, repair-supervisor, repair-technician, etc.
// Shows ONLY repair/service data — no factory, no retail.
function RepairSectorDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [jobs, setJobs]     = useState<ServiceJob[]>([])
  const [txns, setTxns]     = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const today = new Date().toISOString().slice(0, 10)
    const params = new URLSearchParams({ limit: '100' })
    if (filter !== 'all') params.set('status', filter)
    const [jobR, txR] = await Promise.all([
      fetch(`${API}/api/pos/service-jobs?${params}`, { headers: h }),
      fetch(`${API}/api/pos/transactions?start=${today}&limit=100`, { headers: h }),
    ])
    const [jobD, txD] = await Promise.all([jobR.json(), txR.json()])
    setJobs(jobD.jobs || [])
    setTxns(txD.transactions || [])
    setLoading(false)
  }, [session.id, session.owner_id, filter])

  useEffect(() => { load() }, [load])

  const allJobs  = jobs
  const counts   = allJobs.reduce((acc: Record<string, number>, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc }, {})
  const revenue  = txns.filter(t => t.status === 'completed').reduce((s, t) => s + t.total, 0)
  const openJobs = (counts.intake || 0) + (counts.quoted || 0) + (counts.accepted || 0) + (counts.in_progress || 0)
  const sym      = session.currency_symbol || 'KSh'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
        <StatTile label="Today's Revenue"    value={fmt(sym, revenue)} color={GREEN} />
        <StatTile label="Open Jobs"          value={openJobs} color={openJobs > 0 ? AMBER : 'var(--pos-muted)'} />
        <StatTile label="Completed"          value={counts.completed || 0} color={GREEN} />
        <StatTile label="Awaiting Pickup"    value={counts.collected || 0} color={BLUE} />
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Service Jobs</span>
          <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {['all', 'intake', 'in_progress', 'completed', 'collected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter === s ? ACC : 'var(--pos-border)'}`, background: filter === s ? ACC_LIGHT : 'transparent', color: filter === s ? ACC : 'var(--pos-muted)', textTransform: 'capitalize' }}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        {loading ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>Loading…</div> : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--pos-muted)', fontSize: 14 }}>No jobs found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {jobs.map((job, idx) => (
              <div key={job.id} className="pos-item" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--pos-border)', background: 'var(--pos-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: ACC, fontSize: 13 }}>#{job.ticket_number}</span>
                    <Badge status={job.status} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{job.device_model || '—'}</div>
                  <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{job.customer_name || 'No customer'} · {timeAgo(job.created_at)}</div>
                </div>
                {job.quoted_price != null && (
                  <div style={{ fontWeight: 700, fontSize: 14, color: GREEN }}>{fmt(sym, job.quoted_price)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Today's Payments</div>
        {txns.length === 0 ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>No payments yet today</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {txns.slice(0, 6).map((t, idx) => (
              <div key={t.id} className="pos-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--pos-bg)', border: '1px solid var(--pos-border)', animationDelay: `${Math.min(idx, 6) * 40}ms` }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.payment_type?.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: 'var(--pos-muted)', marginLeft: 8 }}>{timeAgo(t.created_at)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge status={t.status} />
                  <span style={{ fontWeight: 700, color: t.status === 'refunded' ? RED : GREEN, fontSize: 13 }}>{fmt(sym, t.total)}</span>
                </div>
              </div>
            ))}
            {txns.length > 6 && <div style={{ fontSize: 12, color: 'var(--pos-muted)', textAlign: 'center' }}>+{txns.length - 6} more today</div>}
          </div>
        )}
      </Card>
    </div>
  )
}

// ── Factory sector dashboard ───────────────────────────────
// Used by factory-manager, factory-supervisor, factory-production-manager, etc.
// Shows ONLY factory capture data — no service jobs, no retail.
function FactorySectorDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [pending, setPending]   = useState<FactoryCapture[]>([])
  const [recent, setRecent]     = useState<FactoryCapture[]>([])
  const [loading, setLoading]   = useState(true)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actioning, setActioning] = useState<string | null>(null)

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const [pendR, recR] = await Promise.all([
      fetch(`${API}/api/pos/factory/capture?status=pending&limit=50`, { headers: h }),
      fetch(`${API}/api/pos/factory/capture?limit=30`, { headers: h }),
    ])
    const [pendD, recD] = await Promise.all([pendR.json(), recR.json()])
    setPending(pendD.captures || [])
    setRecent((recD.captures || []).filter((c: FactoryCapture) => c.status !== 'pending'))
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

  const approvedToday = recent.filter(c => c.status === 'approved').length
  const rejectedToday = recent.filter(c => c.status === 'rejected').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
        <StatTile label="Pending Review"  value={pending.length} color={pending.length > 0 ? AMBER : GREEN} />
        <StatTile label="Approved Today"  value={approvedToday}  color={GREEN} />
        <StatTile label="Rejected Today"  value={rejectedToday}  color={rejectedToday > 0 ? RED : 'var(--pos-muted)'} />
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            {pending.length > 0 ? `⚠ ${pending.length} capture${pending.length !== 1 ? 's' : ''} awaiting review` : '✓ All captures reviewed'}
          </span>
          <button onClick={load} style={{ background: 'none', border: 'none', color: ACC, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
        </div>
        {loading ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>Loading…</div> : pending.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: GREEN, fontSize: 14 }}>✓ Nothing waiting for your approval</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map((cap, idx) => (
              <div key={cap.id} className="pos-item" style={{ borderRadius: 10, border: '1px solid var(--pos-border)', overflow: 'hidden', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'flex-start' }}>
                  {cap.storage === 'supabase' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cap.photo_url} alt="capture" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--pos-border)' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize', color: ACC }}>{cap.type}</span>
                      {cap.product_name && <span style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{cap.product_name}</span>}
                      {cap.batch_ref && <span style={{ fontSize: 11, color: 'var(--pos-muted)', background: '#f0ede8', padding: '1px 6px', borderRadius: 4 }}>Batch: {cap.batch_ref}</span>}
                    </div>
                    {cap.quantity != null && <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>Qty: {cap.quantity}</div>}
                    {cap.notes && <div style={{ fontSize: 12, color: 'var(--pos-muted)', fontStyle: 'italic' }}>{cap.notes}</div>}
                    <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 4 }}>
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
                  <div style={{ padding: '0 14px 12px', borderTop: '1px solid var(--pos-border)', paddingTop: 10 }}>
                    <input placeholder="Reason for rejection…" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--pos-border)', fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button disabled={!rejectReason.trim() || actioning === cap.id}
                        onClick={() => actOnCapture(cap.id, 'rejected', rejectReason)}
                        style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: RED, color: '#fff', fontSize: 12, fontWeight: 700, cursor: !rejectReason.trim() ? 'not-allowed' : 'pointer', opacity: !rejectReason.trim() ? 0.5 : 1 }}>
                        Reject
                      </button>
                      <button onClick={() => setRejectId(null)}
                        style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', color: 'var(--pos-muted)', fontSize: 12, cursor: 'pointer' }}>
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

      {recent.length > 0 && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Production Log</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.slice(0, 8).map((cap, idx) => (
              <div key={cap.id} className="pos-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--pos-bg)', border: '1px solid var(--pos-border)', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{cap.type}</span>
                  {cap.product_name && <span style={{ fontSize: 12, color: 'var(--pos-muted)', marginLeft: 8 }}>{cap.product_name}</span>}
                  <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 1 }}>By {cap.captured_by_staff?.name || '—'} · {timeAgo(cap.created_at)}</div>
                </div>
                <Badge status={cap.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// ── Manager dashboard (legacy `manager` role — repair shop context) ─
// Repair service jobs + revenue only. No factory captures.
function ManagerDashboard({ session, notify }: { session: StaffSession; notify: (m: string, ok?: boolean) => void }) {
  const [jobs, setJobs]     = useState<ServiceJob[]>([])
  const [txns, setTxns]     = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const h = { 'Content-Type': 'application/json', 'x-staff-id': session.id, 'x-owner-id': session.owner_id }

  const load = useCallback(async () => {
    setLoading(true)
    const today = new Date().toISOString().slice(0, 10)
    const [jobR, txR] = await Promise.all([
      fetch(`${API}/api/pos/service-jobs?limit=100`, { headers: h }),
      fetch(`${API}/api/pos/transactions?start=${today}&limit=100`, { headers: h }),
    ])
    const [jobD, txD] = await Promise.all([jobR.json(), txR.json()])
    setJobs(jobD.jobs || [])
    setTxns(txD.transactions || [])
    setLoading(false)
  }, [session.id, session.owner_id])

  useEffect(() => { load() }, [load])

  const revenue   = txns.filter(t => t.status === 'completed').reduce((s, t) => s + t.total, 0)
  const jobCounts = jobs.reduce((acc: Record<string, number>, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc }, {})
  const sym       = session.currency_symbol || 'KSh'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
        <StatTile label="Today's Revenue" value={fmt(sym, revenue)} color={GREEN} />
        <StatTile label="Active Jobs"     value={(jobCounts.accepted || 0) + (jobCounts.in_progress || 0)} color={ACC} />
        <StatTile label="Completed"       value={jobCounts.completed || 0} color={GREEN} />
        <StatTile label="Awaiting Pickup" value={jobCounts.collected || 0} color={BLUE} />
      </div>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Jobs by Status</div>
        {loading ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>Loading…</div> : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['intake', 'quoted', 'accepted', 'in_progress', 'completed', 'collected', 'cancelled'].map(status => {
              const n = jobCounts[status] || 0
              return (
                <div key={status} style={{ padding: '8px 14px', borderRadius: 10, background: STATUS_COLOR[status] + '12', border: `1px solid ${STATUS_COLOR[status]}25`, textAlign: 'center', minWidth: 56 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: STATUS_COLOR[status] }}>{n}</div>
                  <div style={{ fontSize: 10, color: 'var(--pos-muted)', textTransform: 'capitalize', marginTop: 2 }}>{status.replace('_', ' ')}</div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Today's Transactions</div>
        {txns.length === 0 ? <div style={{ color: 'var(--pos-muted)', fontSize: 13 }}>No transactions yet today</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {txns.slice(0, 8).map((t, idx) => (
              <div key={t.id} className="pos-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--pos-bg)', border: '1px solid var(--pos-border)', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.payment_type?.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: 'var(--pos-muted)', marginLeft: 8 }}>{timeAgo(t.created_at)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge status={t.status} />
                  <span style={{ fontWeight: 700, color: t.status === 'refunded' ? RED : GREEN, fontSize: 13 }}>{fmt(sym, t.total)}</span>
                </div>
              </div>
            ))}
            {txns.length > 8 && <div style={{ fontSize: 12, color: 'var(--pos-muted)', textAlign: 'center' }}>+{txns.length - 8} more</div>}
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
      // Only manager-level roles belong on /dashboard — others go to their home
      if (!isManagerOrAboveLevel(s.role)) {
        router.replace(getRoleHomeRoute(s.role))
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pos-bg)' }}>
      <div style={{ color: 'var(--pos-muted)', fontSize: 14 }}>Loading…</div>
    </div>
  )

  const ROLE_LABEL: Record<string, string> = {
    manager: 'Manager', supervisor: 'Supervisor', repair: 'Repair Tech', engineer: 'Engineer',
    'retail-manager': 'Retail Manager', 'retail-inventory-manager': 'Inventory Manager',
    'retail-cashier': 'Cashier', 'retail-supervisor': 'Retail Supervisor',
  }
  const ROLE_COLOR: Record<string, string> = {
    manager: ACC, supervisor: BLUE, repair: '#0891b2', engineer: '#0891b2',
    'retail-manager': ACC, 'retail-supervisor': BLUE, 'retail-inventory-manager': GREEN,
  }

  const friendlyLabel = (role: string) => {
    if (ROLE_LABEL[role]) return ROLE_LABEL[role]
    // Convert template role e.g. "retail-head-cashier" → "Head Cashier"
    const m = role.match(/^(?:retail|factory|repair|salon|logistics)-(.+)$/)
    if (m) return m[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    return role.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  const renderDashboard = () => {
    const role = session.role
    // Template roles — sector prefix wins, completely isolated
    if (role.startsWith('retail-'))   return <RetailManagerDashboard  session={session} />
    if (role.startsWith('repair-'))   return <RepairSectorDashboard   session={session} notify={notify} />
    if (role.startsWith('factory-'))  return <FactorySectorDashboard  session={session} notify={notify} />
    // salon/restaurant/logistics route to their own pages via getRoleHomeRoute and should never land here
    // Legacy roles (no sector prefix) — repair/factory focused as originally designed
    switch (role) {
      case 'engineer':   return <EngineerDashboard   session={session} notify={notify} />
      case 'repair':     return <RepairDashboard     session={session} notify={notify} />
      case 'supervisor': return <SupervisorDashboard session={session} notify={notify} />
      case 'manager':
      default:           return <ManagerDashboard    session={session} notify={notify} />
    }
  }

  const roleColor = ROLE_COLOR[session.role] || ACC
  const roleLabel = friendlyLabel(session.role)

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)', lineHeight: 1.2 }}>{session.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: roleColor, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: roleColor, fontWeight: 600 }}>{roleLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={logout}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', color: 'var(--pos-muted)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 60px' }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--pos-ink)' }}>{roleLabel} Dashboard</h1>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        {renderDashboard()}
      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />}
    </div>
  )
}
