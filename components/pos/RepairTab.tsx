'use client'
import { useState, useEffect, useMemo, Fragment } from 'react'

// ── Color constants ──────────────────────────────────────────────────────────
const GREEN  = '#16a34a'
const RED     = '#dc2626'
const AMBER  = '#ca8a04'
const INDIGO = '#6366f1'

// ── Types ────────────────────────────────────────────────────────────────────
type JobStatus =
  | 'pending'
  | 'diagnosed'
  | 'in_progress'
  | 'waiting_parts'
  | 'quality_check'
  | 'ready'
  | 'collected'
  | 'warranty'

interface ServiceJob {
  id: string
  device_type?: string
  device_model?: string
  issue_description?: string
  status: JobStatus
  engineer_id?: string
  engineer?: string
  customer_name?: string
  customer_phone?: string
  estimated_cost?: number
  final_cost?: number
  parts_cost?: number
  created_at?: string
  updated_at?: string
  completed_at?: string
  warranty_until?: string
  priority?: string
  notes?: string
  photos?: string[]
  warranty_job_id?: string
  estimated_completion?: string
}

interface PartRecord {
  id: string
  name?: string
  sku?: string
  stock_qty?: number
  cost?: number
  reorder_point?: number
  usage_30d?: number
  supplier?: string
  used_in_jobs?: string[]
}

interface WarrantyRecord {
  id: string
  job_id?: string
  customer_name?: string
  device_model?: string
  repair_type?: string
  warranty_until?: string
  is_claim?: boolean
  original_job_id?: string
}

interface RepairTabProps {
  currencySymbol: string
  selectedLocation: string
  transactions: any[]
  staff: any[]
  inventory: any[]
  /** Preview/dev only: inject jobs to bypass the authed fetch. */
  previewJobs?: any[]
}

type SubTab = 'overview' | 'tickets' | 'engineers' | 'parts' | 'customers' | 'warranty'

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'engineers', label: 'Engineers' },
  { id: 'parts', label: 'Parts' },
  { id: 'customers', label: 'Customers' },
  { id: 'warranty', label: 'Warranty' },
]

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_META: Record<JobStatus, { label: string; color: string }> = {
  pending:       { label: 'Pending',       color: '#94a3b8' },
  diagnosed:     { label: 'Diagnosed',     color: '#0ea5e9' },
  in_progress:   { label: 'In Progress',   color: INDIGO },
  waiting_parts: { label: 'Waiting Parts', color: AMBER },
  quality_check: { label: 'Quality Check', color: '#8b5cf6' },
  ready:         { label: 'Ready',         color: GREEN },
  collected:     { label: 'Collected',     color: '#64748b' },
  warranty:      { label: 'Warranty',      color: RED },
}

const STATUS_ORDER: JobStatus[] = [
  'pending', 'diagnosed', 'in_progress', 'waiting_parts', 'quality_check', 'ready', 'collected', 'warranty',
]

const PRIORITY_COLOR: Record<string, string> = {
  urgent: RED,
  high: AMBER,
  normal: 'var(--tx3)',
  low: 'var(--tx3)',
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(symbol: string, amount: number): string {
  const num = (amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const needsSpace = symbol.length > 1 && /[a-zA-Z]$/.test(symbol)
  return `${symbol}${needsSpace ? ' ' : ''}${num}`
}

function daysBetween(a?: string, b?: string): number {
  if (!a) return 0
  const start = new Date(a).getTime()
  const end = b ? new Date(b).getTime() : Date.now()
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)))
}

function daysUntil(d?: string): number {
  if (!d) return 0
  return Math.round((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function shortDate(d?: string): string {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
  } catch {
    return '—'
  }
}

function dateTime(d?: string): string {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

function jobRevenue(j: ServiceJob): number {
  return j.final_cost ?? j.estimated_cost ?? 0
}

function isActive(j: ServiceJob): boolean {
  return j.status !== 'collected'
}

function isCompleted(j: ServiceJob): boolean {
  return j.status === 'collected' || !!j.completed_at
}

function startOfToday(): number {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime()
}

// ── Shared style fragments ───────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  padding: '16px 18px',
  borderRadius: 12,
  border: '1px solid var(--b)',
  background: 'var(--sf)',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--tx3)',
  textTransform: 'uppercase',
  letterSpacing: '.04em',
  padding: '8px 12px',
  borderBottom: '1px solid var(--b)',
  cursor: 'pointer',
  userSelect: 'none',
}

const tdStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--tx)',
  padding: '10px 12px',
  borderBottom: '1px solid var(--b)',
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: JobStatus }) {
  const meta = STATUS_META[status] ?? { label: status, color: 'var(--tx3)' }
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        color: meta.color,
        background: `${meta.color}1a`,
        border: `1px solid ${meta.color}55`,
        whiteSpace: 'nowrap',
      }}
    >
      {meta.label}
    </span>
  )
}

// ── Sort indicator helper ────────────────────────────────────────────────────
function sortArrow(active: boolean, dir: 'asc' | 'desc'): string {
  if (!active) return ''
  return dir === 'asc' ? ' ▲' : ' ▼'
}

// ── Main component ───────────────────────────────────────────────────────────
export default function RepairTab({
  currencySymbol,
  selectedLocation,
  transactions,
  staff,
  inventory,
  previewJobs,
}: RepairTabProps) {
  const [jobs, setJobs] = useState<ServiceJob[]>([])
  const [parts, setParts] = useState<PartRecord[]>([])
  const [warranties, setWarranties] = useState<WarrantyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subTab, setSubTab] = useState<SubTab>('overview')

  useEffect(() => {
    // Preview/dev: use injected jobs and skip the authed fetch entirely.
    if (previewJobs) {
      setJobs(previewJobs as ServiceJob[])
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      // Primary: service jobs (required)
      try {
        const params = new URLSearchParams({ limit: '500' })
        if (selectedLocation && selectedLocation !== 'all') params.set('location_id', selectedLocation)
        const res = await fetch(`/api/pos/service-jobs?${params}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) setJobs(Array.isArray(data?.jobs) ? data.jobs : [])
      } catch (err: any) {
        if (!cancelled) {
          setJobs([])
          setError(err?.message || 'Failed to load service jobs')
        }
      }
      // Optional: parts
      try {
        const res = await fetch('/api/pos/service-jobs/parts')
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data?.parts) ? data.parts : Array.isArray(data) ? data : []
          if (!cancelled) setParts(list)
        }
      } catch {
        /* optional — ignore */
      }
      // Optional: warranty
      try {
        const res = await fetch('/api/pos/service-jobs/warranty')
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data?.warranties) ? data.warranties : Array.isArray(data) ? data : []
          if (!cancelled) setWarranties(list)
        }
      } catch {
        /* optional — ignore */
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [selectedLocation, previewJobs])

  // Derive engineer roster from jobs + staff prop
  const engineers = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>()
    ;(staff || []).forEach((s: any) => {
      const id = String(s.id ?? s.staff_id ?? s.name ?? '')
      if (id) map.set(id, { id, name: s.name ?? s.full_name ?? 'Unknown' })
    })
    jobs.forEach((j) => {
      const id = String(j.engineer_id ?? j.engineer ?? '')
      if (id && !map.has(id)) map.set(id, { id, name: j.engineer ?? 'Unknown' })
    })
    return Array.from(map.values())
  }, [staff, jobs])

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--tx3)', fontSize: 14 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🔧</div>
        Loading repair analytics…
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>🔧</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)' }}>Repair Shop Analytics</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
            {jobs.length} tickets tracked
            {selectedLocation && selectedLocation !== 'all' ? ' · filtered by location' : ''}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            ...cardStyle,
            borderColor: `${RED}55`,
            background: `${RED}0d`,
            color: RED,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          ⚠️ {error}. Showing whatever data is available.
        </div>
      )}

      {/* Sub-tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid var(--b)',
          marginBottom: 20,
          overflowX: 'auto',
        }}
      >
        {SUB_TABS.map((t) => {
          const active = subTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              style={{
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? INDIGO : 'var(--tx2)',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${active ? INDIGO : 'transparent'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Sub-tab content */}
      {subTab === 'overview' && <OverviewSub jobs={jobs} currencySymbol={currencySymbol} />}
      {subTab === 'tickets' && <TicketsSub jobs={jobs} parts={parts} currencySymbol={currencySymbol} engineers={engineers} />}
      {subTab === 'engineers' && <EngineersSub jobs={jobs} engineers={engineers} staff={staff} currencySymbol={currencySymbol} />}
      {subTab === 'parts' && <PartsSub parts={parts} jobs={jobs} inventory={inventory} currencySymbol={currencySymbol} />}
      {subTab === 'customers' && <CustomersSub jobs={jobs} currencySymbol={currencySymbol} />}
      {subTab === 'warranty' && <WarrantySub jobs={jobs} warranties={warranties} currencySymbol={currencySymbol} />}
    </div>
  )
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  color,
  active,
  onClick,
}: {
  label: string
  value: string
  sub?: string
  color?: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        ...cardStyle,
        cursor: onClick ? 'pointer' : 'default',
        outline: active ? `2px solid ${INDIGO}` : 'none',
        transition: 'outline .1s',
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || 'var(--tx)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const size = 180
  const stroke = 28
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  let offset = 0

  if (total === 0) {
    return <div style={{ fontSize: 13, color: 'var(--tx3)', padding: 20 }}>No jobs to chart.</div>
  }

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ev)" strokeWidth={stroke} />
        {segments
          .filter((s) => s.value > 0)
          .map((s, i) => {
            const frac = s.value / total
            const len = frac * circ
            const el = (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            )
            offset += len
            return el
          })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--tx)">
          {total}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="11" fill="var(--tx3)">
          jobs
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {segments
          .filter((s) => s.value > 0)
          .map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, display: 'inline-block' }} />
              <span style={{ color: 'var(--tx2)' }}>{s.label}</span>
              <span style={{ color: 'var(--tx)', fontWeight: 700, marginLeft: 'auto' }}>{s.value}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

// ── Line chart (turnaround trend) ────────────────────────────────────────────
function LineChart({ points, color, unit }: { points: { label: string; value: number }[]; color: string; unit?: string }) {
  const w = 520
  const h = 160
  const padL = 36
  const padB = 22
  const padT = 12
  const padR = 12
  const innerW = w - padL - padR
  const innerH = h - padT - padB
  const valid = points.filter((p) => p.value > 0)

  if (valid.length < 2) {
    return <div style={{ fontSize: 13, color: 'var(--tx3)', padding: 20 }}>Not enough completed jobs to chart a trend.</div>
  }

  const max = Math.max(...points.map((p) => p.value), 1)
  const stepX = innerW / (points.length - 1)
  const x = (i: number) => padL + i * stepX
  const y = (v: number) => padT + innerH - (v / max) * innerH

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(' ')

  const gridLines = [0, 0.5, 1].map((f) => ({ y: padT + innerH - f * innerH, v: Math.round(max * f) }))

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: w }}>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={padL} y1={g.y} x2={w - padR} y2={g.y} stroke="var(--b)" strokeWidth={1} />
          <text x={padL - 6} y={g.y + 3} textAnchor="end" fontSize="9" fill="var(--tx3)">
            {g.v}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {points.map((p, i) =>
        p.value > 0 ? <circle key={i} cx={x(i)} cy={y(p.value)} r={2.5} fill={color} /> : null
      )}
      {points.map((p, i) =>
        i % Math.ceil(points.length / 6) === 0 ? (
          <text key={`l${i}`} x={x(i)} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--tx3)">
            {p.label}
          </text>
        ) : null
      )}
      {unit && (
        <text x={padL} y={padT - 2} fontSize="9" fill="var(--tx3)">
          {unit}
        </text>
      )}
    </svg>
  )
}

// ── Comparison bars (revenue vs parts) ───────────────────────────────────────
function CompareBars({
  rows,
  currencySymbol,
}: {
  rows: { label: string; revenue: number; parts: number }[]
  currencySymbol: string
}) {
  const max = Math.max(...rows.map((r) => Math.max(r.revenue, r.parts)), 1)
  if (rows.every((r) => r.revenue === 0 && r.parts === 0)) {
    return <div style={{ fontSize: 13, color: 'var(--tx3)', padding: 20 }}>No revenue data yet.</div>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--tx3)' }}>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: GREEN, borderRadius: 2, marginRight: 4 }} />Revenue</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: AMBER, borderRadius: 2, marginRight: 4 }} />Parts cost</span>
      </div>
      {rows.map((r, i) => (
        <div key={i}>
          <div style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 4 }}>{r.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <div style={{ flex: 1, height: 14, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(r.revenue / max) * 100}%`, height: '100%', background: GREEN }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--tx2)', width: 90, textAlign: 'right' }}>{fmt(currencySymbol, r.revenue)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 14, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(r.parts / max) * 100}%`, height: '100%', background: AMBER }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--tx2)', width: 90, textAlign: 'right' }}>{fmt(currencySymbol, r.parts)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Overview sub-tab ─────────────────────────────────────────────────────────
function OverviewSub({ jobs, currencySymbol }: { jobs: ServiceJob[]; currencySymbol: string }) {
  const [activeKpi, setActiveKpi] = useState<string | null>(null)
  const todayStart = startOfToday()

  const stats = useMemo(() => {
    const active = jobs.filter(isActive)
    const completedToday = jobs.filter(
      (j) => isCompleted(j) && new Date(j.completed_at || j.updated_at || 0).getTime() >= todayStart
    )
    const completedAll = jobs.filter(isCompleted)
    let avgDays = 0
    if (completedAll.length) {
      avgDays =
        completedAll.reduce((s, j) => s + daysBetween(j.created_at, j.completed_at || j.updated_at), 0) /
        completedAll.length
    }
    const revenueToday = completedToday.reduce((s, j) => s + jobRevenue(j), 0)
    const partsToday = completedToday.reduce((s, j) => s + (j.parts_cost || 0), 0)
    const warrantyReturns = jobs.filter((j) => j.status === 'warranty' || !!j.warranty_job_id).length
    const warrantyRate = completedAll.length ? (warrantyReturns / completedAll.length) * 100 : 0

    return {
      active: active.length,
      completedToday: completedToday.length,
      avgDays,
      revenueToday,
      partsToday,
      warrantyRate,
    }
  }, [jobs, todayStart])

  const statusSegments = useMemo(
    () =>
      STATUS_ORDER.map((s) => ({
        label: STATUS_META[s].label,
        value: jobs.filter((j) => j.status === s).length,
        color: STATUS_META[s].color,
      })),
    [jobs]
  )

  const trend = useMemo(() => {
    const buckets: { label: string; total: number; count: number }[] = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      buckets.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, total: 0, count: 0 })
    }
    jobs.forEach((j) => {
      if (!isCompleted(j)) return
      const c = j.completed_at || j.updated_at
      if (!c) return
      const cd = new Date(c)
      const diffDays = Math.floor((todayStart - new Date(cd.getFullYear(), cd.getMonth(), cd.getDate()).getTime()) / 86400000)
      const idx = 29 - diffDays
      if (idx >= 0 && idx < 30) {
        buckets[idx].total += daysBetween(j.created_at, c)
        buckets[idx].count += 1
      }
    })
    return buckets.map((b) => ({ label: b.label, value: b.count ? Math.round((b.total / b.count) * 10) / 10 : 0 }))
  }, [jobs, todayStart])

  const compareRows = useMemo(() => {
    // Last 4 weeks
    const rows: { label: string; revenue: number; parts: number }[] = []
    const now = Date.now()
    for (let w = 3; w >= 0; w--) {
      const end = now - w * 7 * 86400000
      const start = end - 7 * 86400000
      const inWeek = jobs.filter((j) => {
        const t = new Date(j.completed_at || j.updated_at || 0).getTime()
        return isCompleted(j) && t > start && t <= end
      })
      rows.push({
        label: w === 0 ? 'This week' : `${w}w ago`,
        revenue: inWeek.reduce((s, j) => s + jobRevenue(j), 0),
        parts: inWeek.reduce((s, j) => s + (j.parts_cost || 0), 0),
      })
    }
    return rows
  }, [jobs])

  const overdue = useMemo(
    () =>
      jobs
        .filter((j) => {
          if (!isActive(j)) return false
          const due = j.estimated_completion
          if (!due) return false
          return new Date(due).getTime() < Date.now()
        })
        .sort((a, b) => new Date(a.estimated_completion || 0).getTime() - new Date(b.estimated_completion || 0).getTime()),
    [jobs]
  )

  if (jobs.length === 0) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: 48, color: 'var(--tx3)' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🔧</div>
        No repair tickets yet. Jobs will appear here once created.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        <KpiCard label="Active Jobs" value={String(stats.active)} color={stats.active > 0 ? INDIGO : 'var(--tx)'} active={activeKpi === 'active'} onClick={() => setActiveKpi('active')} sub="not yet collected" />
        <KpiCard label="Completed Today" value={String(stats.completedToday)} color={GREEN} active={activeKpi === 'done'} onClick={() => setActiveKpi('done')} />
        <KpiCard label="Avg Turnaround" value={`${stats.avgDays.toFixed(1)}d`} color={stats.avgDays <= 2 ? GREEN : stats.avgDays <= 5 ? AMBER : RED} active={activeKpi === 'turn'} onClick={() => setActiveKpi('turn')} sub="days to complete" />
        <KpiCard label="Revenue Today" value={fmt(currencySymbol, stats.revenueToday)} color={GREEN} active={activeKpi === 'rev'} onClick={() => setActiveKpi('rev')} />
        <KpiCard label="Parts Cost Today" value={fmt(currencySymbol, stats.partsToday)} color={AMBER} active={activeKpi === 'parts'} onClick={() => setActiveKpi('parts')} />
        <KpiCard label="Warranty Return Rate" value={`${stats.warrantyRate.toFixed(1)}%`} color={stats.warrantyRate <= 5 ? GREEN : stats.warrantyRate <= 12 ? AMBER : RED} active={activeKpi === 'warr'} onClick={() => setActiveKpi('warr')} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 14 }}>Jobs by Status</div>
          <DonutChart segments={statusSegments} />
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 14 }}>Avg Turnaround (last 30 days)</div>
          <LineChart points={trend} color={INDIGO} unit="days" />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 14 }}>Revenue vs Parts Cost</div>
        <CompareBars rows={compareRows} currencySymbol={currencySymbol} />
      </div>

      {/* Overdue alert */}
      <div style={{ ...cardStyle, borderColor: overdue.length ? `${RED}55` : 'var(--b)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: overdue.length ? RED : 'var(--tx)', marginBottom: 12 }}>
          {overdue.length ? `⚠️ ${overdue.length} Overdue Job${overdue.length > 1 ? 's' : ''}` : '✓ No Overdue Jobs'}
        </div>
        {overdue.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {overdue.slice(0, 8).map((j) => (
              <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, paddingBottom: 8, borderBottom: '1px solid var(--b)' }}>
                <span style={{ color: 'var(--tx)', fontWeight: 600 }}>{j.device_model || j.device_type || 'Device'}</span>
                <span style={{ color: 'var(--tx3)' }}>{j.customer_name || '—'}</span>
                <StatusBadge status={j.status} />
                <span style={{ marginLeft: 'auto', color: RED, fontWeight: 700 }}>
                  {Math.abs(daysUntil(j.estimated_completion))}d overdue
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Ticket detail (expanded) ─────────────────────────────────────────────────
function TicketDetail({ job, parts, currencySymbol }: { job: ServiceJob; parts: PartRecord[]; currencySymbol: string }) {
  const usedParts = parts.filter((p) => (p.used_in_jobs || []).includes(job.id))
  const timeline: { label: string; date?: string }[] = [
    { label: 'Created', date: job.created_at },
    { label: `Status: ${STATUS_META[job.status]?.label || job.status}`, date: job.updated_at },
  ]
  if (job.completed_at) timeline.push({ label: 'Completed', date: job.completed_at })

  const labor = jobRevenue(job) - (job.parts_cost || 0)

  return (
    <div style={{ padding: '14px 16px', background: 'var(--ev)', borderTop: '1px solid var(--b)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {/* Timeline */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: INDIGO, display: 'inline-block' }} />
                <span style={{ color: 'var(--tx)' }}>{t.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--tx3)' }}>{dateTime(t.date)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Cost breakdown */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>Cost Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
            <Row k="Estimated" v={fmt(currencySymbol, job.estimated_cost || 0)} />
            <Row k="Parts" v={fmt(currencySymbol, job.parts_cost || 0)} />
            <Row k="Labor" v={fmt(currencySymbol, Math.max(0, labor))} />
            <Row k="Final" v={fmt(currencySymbol, job.final_cost || 0)} bold />
          </div>
        </div>
        {/* Parts used */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>Parts Used</div>
          {usedParts.length ? (
            usedParts.map((p) => (
              <div key={p.id} style={{ fontSize: 12, color: 'var(--tx)', marginBottom: 3 }}>
                • {p.name} {p.sku ? <span style={{ color: 'var(--tx3)' }}>({p.sku})</span> : null}
              </div>
            ))
          ) : (
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>No parts recorded.</div>
          )}
        </div>
      </div>
      {job.notes && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 4 }}>Notes</div>
          <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{job.notes}</div>
        </div>
      )}
      {Array.isArray(job.photos) && job.photos.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 6 }}>Photos</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {job.photos.map((p, i) => (
              <img key={i} src={p} alt={`photo ${i + 1}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--b)' }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--tx3)' }}>{k}</span>
      <span style={{ color: 'var(--tx)', fontWeight: bold ? 800 : 500 }}>{v}</span>
    </div>
  )
}

// ── Tickets sub-tab ──────────────────────────────────────────────────────────
type TicketSortKey = 'id' | 'device' | 'customer' | 'status' | 'engineer' | 'days' | 'cost' | 'priority'

function TicketsSub({
  jobs,
  parts,
  currencySymbol,
  engineers,
}: {
  jobs: ServiceJob[]
  parts: PartRecord[]
  currencySymbol: string
  engineers: { id: string; name: string }[]
}) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')
  const [fStatus, setFStatus] = useState<string>('all')
  const [fEngineer, setFEngineer] = useState<string>('all')
  const [fDevice, setFDevice] = useState<string>('all')
  const [fPriority, setFPriority] = useState<string>('all')
  const [fFrom, setFFrom] = useState<string>('')
  const [fTo, setFTo] = useState<string>('')
  const [sortKey, setSortKey] = useState<TicketSortKey>('days')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)

  const deviceTypes = useMemo(() => {
    const set = new Set<string>()
    jobs.forEach((j) => j.device_type && set.add(j.device_type))
    return Array.from(set).sort()
  }, [jobs])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return jobs.filter((j) => {
      if (fStatus !== 'all' && j.status !== fStatus) return false
      if (fEngineer !== 'all' && String(j.engineer_id ?? j.engineer) !== fEngineer) return false
      if (fDevice !== 'all' && j.device_type !== fDevice) return false
      if (fPriority !== 'all' && (j.priority || 'normal') !== fPriority) return false
      if (fFrom && new Date(j.created_at || 0).getTime() < new Date(fFrom).getTime()) return false
      if (fTo && new Date(j.created_at || 0).getTime() > new Date(fTo).getTime() + 86400000) return false
      if (q) {
        const hay = `${j.id} ${j.customer_name || ''} ${j.device_model || ''} ${j.device_type || ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [jobs, search, fStatus, fEngineer, fDevice, fPriority, fFrom, fTo])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      let av: any
      let bv: any
      switch (sortKey) {
        case 'id': av = a.id; bv = b.id; break
        case 'device': av = a.device_model || a.device_type || ''; bv = b.device_model || b.device_type || ''; break
        case 'customer': av = a.customer_name || ''; bv = b.customer_name || ''; break
        case 'status': av = STATUS_ORDER.indexOf(a.status); bv = STATUS_ORDER.indexOf(b.status); break
        case 'engineer': av = a.engineer || ''; bv = b.engineer || ''; break
        case 'days': av = daysBetween(a.created_at, isCompleted(a) ? a.completed_at || a.updated_at : undefined); bv = daysBetween(b.created_at, isCompleted(b) ? b.completed_at || b.updated_at : undefined); break
        case 'cost': av = a.estimated_cost || 0; bv = b.estimated_cost || 0; break
        case 'priority': av = a.priority || ''; bv = b.priority || ''; break
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return arr
  }, [filtered, sortKey, sortDir])

  function toggleSort(k: TicketSortKey) {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setSortDir('asc') }
  }

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--b)',
    background: 'var(--sf)', color: 'var(--tx)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--b)' }}>
          {(['kanban', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: view === v ? INDIGO : 'var(--sf)', color: view === v ? '#fff' : 'var(--tx2)',
              }}
            >
              {v === 'kanban' ? 'Kanban' : 'List'}
            </button>
          ))}
        </div>
        <input
          placeholder="Search customer, device, ticket…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...selectStyle, flex: 1, minWidth: 180 }}
        />
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} style={selectStyle}>
          <option value="all">All statuses</option>
          {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
        <select value={fEngineer} onChange={(e) => setFEngineer(e.target.value)} style={selectStyle}>
          <option value="all">All engineers</option>
          {engineers.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <select value={fDevice} onChange={(e) => setFDevice(e.target.value)} style={selectStyle}>
          <option value="all">All devices</option>
          {deviceTypes.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={fPriority} onChange={(e) => setFPriority(e.target.value)} style={selectStyle}>
          <option value="all">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <input type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} style={selectStyle} />
        <input type="date" value={fTo} onChange={(e) => setFTo(e.target.value)} style={selectStyle} />
      </div>

      <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{sorted.length} ticket{sorted.length !== 1 ? 's' : ''}</div>

      {sorted.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 36, color: 'var(--tx3)' }}>No tickets match your filters.</div>
      ) : view === 'kanban' ? (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {STATUS_ORDER.map((status) => {
            const col = sorted.filter((j) => j.status === status)
            return (
              <div key={status} style={{ minWidth: 220, width: 220, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: STATUS_META[status].color }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{STATUS_META[status].label}</span>
                  <span style={{ fontSize: 11, color: 'var(--tx3)', marginLeft: 'auto' }}>{col.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => setExpanded(expanded === j.id ? null : j.id)}
                      style={{
                        ...cardStyle, padding: 12, cursor: 'pointer',
                        borderLeft: `3px solid ${STATUS_META[status].color}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>
                        {j.device_model || j.device_type || 'Device'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 6 }}>{j.customer_name || '—'}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--tx2)' }}>
                        <span>{j.engineer || 'Unassigned'}</span>
                        <span>{daysBetween(j.created_at, isCompleted(j) ? j.completed_at || j.updated_at : undefined)}d</span>
                      </div>
                      {expanded === j.id && <TicketDetail job={j} parts={parts} currencySymbol={currencySymbol} />}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle} onClick={() => toggleSort('id')}>Ticket #{sortArrow(sortKey === 'id', sortDir)}</th>
                  <th style={thStyle} onClick={() => toggleSort('device')}>Device{sortArrow(sortKey === 'device', sortDir)}</th>
                  <th style={thStyle} onClick={() => toggleSort('customer')}>Customer{sortArrow(sortKey === 'customer', sortDir)}</th>
                  <th style={thStyle} onClick={() => toggleSort('status')}>Status{sortArrow(sortKey === 'status', sortDir)}</th>
                  <th style={thStyle} onClick={() => toggleSort('engineer')}>Engineer{sortArrow(sortKey === 'engineer', sortDir)}</th>
                  <th style={thStyle} onClick={() => toggleSort('days')}>Days Open{sortArrow(sortKey === 'days', sortDir)}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => toggleSort('cost')}>Est. Cost{sortArrow(sortKey === 'cost', sortDir)}</th>
                  <th style={thStyle} onClick={() => toggleSort('priority')}>Priority{sortArrow(sortKey === 'priority', sortDir)}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((j) => (
                  <Fragment key={j.id}>
                    <tr onClick={() => setExpanded(expanded === j.id ? null : j.id)} style={{ cursor: 'pointer' }}>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11, color: 'var(--tx3)' }}>#{String(j.id).slice(0, 8)}</td>
                      <td style={tdStyle}>{j.device_model || j.device_type || '—'}</td>
                      <td style={tdStyle}>{j.customer_name || '—'}</td>
                      <td style={tdStyle}><StatusBadge status={j.status} /></td>
                      <td style={tdStyle}>{j.engineer || 'Unassigned'}</td>
                      <td style={tdStyle}>{daysBetween(j.created_at, isCompleted(j) ? j.completed_at || j.updated_at : undefined)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, j.estimated_cost || 0)}</td>
                      <td style={{ ...tdStyle, color: PRIORITY_COLOR[j.priority || 'normal'] || 'var(--tx3)', fontWeight: 600, textTransform: 'capitalize' }}>{j.priority || 'normal'}</td>
                    </tr>
                    {expanded === j.id && (
                      <tr>
                        <td colSpan={8} style={{ padding: 0 }}><TicketDetail job={j} parts={parts} currencySymbol={currencySymbol} /></td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Engineers sub-tab ────────────────────────────────────────────────────────
type EngSortKey = 'name' | 'active' | 'completed' | 'turnaround' | 'revenue' | 'warranty'

function EngineersSub({
  jobs,
  engineers,
  staff,
  currencySymbol,
}: {
  jobs: ServiceJob[]
  engineers: { id: string; name: string }[]
  staff: any[]
  currencySymbol: string
}) {
  const [sortKey, setSortKey] = useState<EngSortKey>('active')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)
  const cutoff = Date.now() - 30 * 86400000

  const rows = useMemo(() => {
    return engineers.map((e) => {
      const theirs = jobs.filter((j) => String(j.engineer_id ?? j.engineer) === e.id)
      const active = theirs.filter(isActive)
      const completed30 = theirs.filter(
        (j) => isCompleted(j) && new Date(j.completed_at || j.updated_at || 0).getTime() >= cutoff
      )
      const completedAll = theirs.filter(isCompleted)
      const avgTurn = completedAll.length
        ? completedAll.reduce((s, j) => s + daysBetween(j.created_at, j.completed_at || j.updated_at), 0) / completedAll.length
        : 0
      const revenue = completedAll.reduce((s, j) => s + jobRevenue(j), 0)
      const warrantyReturns = theirs.filter((j) => j.status === 'warranty' || !!j.warranty_job_id).length
      const warrantyRate = completedAll.length ? (warrantyReturns / completedAll.length) * 100 : 0
      const skills = (staff || []).find((s: any) => String(s.id ?? s.staff_id ?? s.name) === e.id)?.skills
      return {
        ...e,
        active: active.length,
        completed30: completed30.length,
        avgTurn,
        revenue,
        warrantyRate,
        recent: completedAll
          .sort((a, b) => new Date(b.completed_at || b.updated_at || 0).getTime() - new Date(a.completed_at || a.updated_at || 0).getTime())
          .slice(0, 6),
        skills: Array.isArray(skills) ? skills : [],
      }
    })
  }, [engineers, jobs, staff, cutoff])

  const sorted = useMemo(() => {
    const arr = [...rows]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      let av: any, bv: any
      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break
        case 'active': av = a.active; bv = b.active; break
        case 'completed': av = a.completed30; bv = b.completed30; break
        case 'turnaround': av = a.avgTurn; bv = b.avgTurn; break
        case 'revenue': av = a.revenue; bv = b.revenue; break
        case 'warranty': av = a.warrantyRate; bv = b.warrantyRate; break
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return arr
  }, [rows, sortKey, sortDir])

  function toggleSort(k: EngSortKey) {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setSortDir('desc') }
  }

  const maxActive = Math.max(...rows.map((r) => r.active), 1)

  if (engineers.length === 0) {
    return <div style={{ ...cardStyle, textAlign: 'center', padding: 36, color: 'var(--tx3)' }}>No engineers found.</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Leaderboard */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => toggleSort('name')}>Engineer{sortArrow(sortKey === 'name', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('active')}>Active{sortArrow(sortKey === 'active', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('completed')}>Completed (30d){sortArrow(sortKey === 'completed', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('turnaround')}>Avg Turnaround{sortArrow(sortKey === 'turnaround', sortDir)}</th>
                <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => toggleSort('revenue')}>Revenue{sortArrow(sortKey === 'revenue', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('warranty')}>Warranty Rate{sortArrow(sortKey === 'warranty', sortDir)}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <Fragment key={e.id}>
                  <tr onClick={() => setExpanded(expanded === e.id ? null : e.id)} style={{ cursor: 'pointer' }}>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{e.name}{e.active > 10 && <span style={{ color: RED, fontSize: 11, marginLeft: 6 }}>⚠ overloaded</span>}</td>
                    <td style={tdStyle}>{e.active}</td>
                    <td style={tdStyle}>{e.completed30}</td>
                    <td style={{ ...tdStyle, color: e.avgTurn <= 2 ? GREEN : e.avgTurn <= 5 ? AMBER : RED }}>{e.avgTurn.toFixed(1)}d</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, e.revenue)}</td>
                    <td style={{ ...tdStyle, color: e.warrantyRate <= 5 ? GREEN : e.warrantyRate <= 12 ? AMBER : RED }}>{e.warrantyRate.toFixed(1)}%</td>
                  </tr>
                  {expanded === e.id && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div style={{ padding: '14px 16px', background: 'var(--ev)', borderTop: '1px solid var(--b)' }}>
                          {e.skills.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginRight: 8 }}>Skills:</span>
                              {e.skills.map((s: string, i: number) => (
                                <span key={i} style={{ fontSize: 11, color: INDIGO, background: `${INDIGO}1a`, padding: '2px 8px', borderRadius: 999, marginRight: 6 }}>{s}</span>
                              ))}
                            </div>
                          )}
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>Recent Completed Jobs</div>
                          {e.recent.length ? e.recent.map((j) => (
                            <div key={j.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid var(--b)', marginBottom: 6 }}>
                              <span style={{ color: 'var(--tx)', fontWeight: 600 }}>{j.device_model || j.device_type}</span>
                              <span style={{ color: 'var(--tx3)' }}>{j.customer_name || '—'}</span>
                              <StatusBadge status={j.status} />
                              <span style={{ marginLeft: 'auto', color: 'var(--tx2)' }}>{fmt(currencySymbol, jobRevenue(j))}</span>
                              <span style={{ color: 'var(--tx3)' }}>{shortDate(j.completed_at || j.updated_at)}</span>
                            </div>
                          )) : <div style={{ fontSize: 12, color: 'var(--tx3)' }}>No completed jobs.</div>}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workload distribution */}
      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 14 }}>Workload Distribution (active jobs)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map((e) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 120, fontSize: 12, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
              <div style={{ flex: 1, height: 16, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(e.active / maxActive) * 100}%`, height: '100%', background: e.active > 10 ? RED : INDIGO }} />
              </div>
              <span style={{ width: 32, textAlign: 'right', fontSize: 12, fontWeight: 700, color: e.active > 10 ? RED : 'var(--tx)' }}>{e.active}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Parts sub-tab ────────────────────────────────────────────────────────────
type PartSortKey = 'name' | 'sku' | 'stock' | 'cost' | 'reorder' | 'usage' | 'supplier'

function PartsSub({
  parts,
  jobs,
  inventory,
  currencySymbol,
}: {
  parts: PartRecord[]
  jobs: ServiceJob[]
  inventory: any[]
  currencySymbol: string
}) {
  const [sortKey, setSortKey] = useState<PartSortKey>('usage')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)

  // Fall back to inventory prop if no dedicated parts endpoint data
  const effectiveParts: PartRecord[] = useMemo(() => {
    if (parts.length) return parts
    return (inventory || [])
      .filter((it: any) => it && (it.is_part || it.category === 'parts' || it.type === 'part') )
      .map((it: any) => ({
        id: String(it.id ?? it.sku ?? it.name),
        name: it.name,
        sku: it.sku,
        stock_qty: it.stock_qty ?? it.quantity ?? it.qty,
        cost: it.cost ?? it.unit_cost,
        reorder_point: it.reorder_point ?? it.reorder_level,
        usage_30d: it.usage_30d,
        supplier: it.supplier,
        used_in_jobs: [],
      }))
  }, [parts, inventory])

  const sorted = useMemo(() => {
    const arr = [...effectiveParts]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      let av: any, bv: any
      switch (sortKey) {
        case 'name': av = a.name || ''; bv = b.name || ''; break
        case 'sku': av = a.sku || ''; bv = b.sku || ''; break
        case 'stock': av = a.stock_qty || 0; bv = b.stock_qty || 0; break
        case 'cost': av = a.cost || 0; bv = b.cost || 0; break
        case 'reorder': av = a.reorder_point || 0; bv = b.reorder_point || 0; break
        case 'usage': av = a.usage_30d || 0; bv = b.usage_30d || 0; break
        case 'supplier': av = a.supplier || ''; bv = b.supplier || ''; break
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return arr
  }, [effectiveParts, sortKey, sortDir])

  function toggleSort(k: PartSortKey) {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setSortDir('desc') }
  }

  // Parts cost trend per week (from job parts_cost)
  const weekTrend = useMemo(() => {
    const weeks: { label: string; value: number }[] = []
    const now = Date.now()
    for (let w = 7; w >= 0; w--) {
      const end = now - w * 7 * 86400000
      const start = end - 7 * 86400000
      const spend = jobs
        .filter((j) => {
          const t = new Date(j.completed_at || j.updated_at || 0).getTime()
          return t > start && t <= end
        })
        .reduce((s, j) => s + (j.parts_cost || 0), 0)
      weeks.push({ label: w === 0 ? 'now' : `-${w}w`, value: Math.round(spend) })
    }
    return weeks
  }, [jobs])

  function jobsUsingPart(id: string): ServiceJob[] {
    const p = effectiveParts.find((x) => x.id === id)
    const ids = new Set(p?.used_in_jobs || [])
    return jobs.filter((j) => ids.has(j.id))
  }

  if (effectiveParts.length === 0) {
    return <div style={{ ...cardStyle, textAlign: 'center', padding: 36, color: 'var(--tx3)' }}>No parts data available.</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => toggleSort('name')}>Name{sortArrow(sortKey === 'name', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('sku')}>SKU{sortArrow(sortKey === 'sku', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('stock')}>Stock{sortArrow(sortKey === 'stock', sortDir)}</th>
                <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => toggleSort('cost')}>Cost{sortArrow(sortKey === 'cost', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('reorder')}>Reorder Pt{sortArrow(sortKey === 'reorder', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('usage')}>Usage (30d){sortArrow(sortKey === 'usage', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('supplier')}>Supplier{sortArrow(sortKey === 'supplier', sortDir)}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const low = (p.stock_qty ?? 0) <= (p.reorder_point ?? 0)
                return (
                  <Fragment key={p.id}>
                    <tr onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ cursor: 'pointer', background: low ? `${RED}0d` : undefined }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{p.name || '—'}{low && <span style={{ color: RED, fontSize: 11, marginLeft: 6 }}>● low</span>}</td>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11, color: 'var(--tx3)' }}>{p.sku || '—'}</td>
                      <td style={{ ...tdStyle, color: low ? RED : 'var(--tx)', fontWeight: low ? 700 : 400 }}>{p.stock_qty ?? '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, p.cost || 0)}</td>
                      <td style={tdStyle}>{p.reorder_point ?? '—'}</td>
                      <td style={tdStyle}>{p.usage_30d ?? '—'}</td>
                      <td style={tdStyle}>{p.supplier || '—'}</td>
                    </tr>
                    {expanded === p.id && (
                      <tr>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <div style={{ padding: '14px 16px', background: 'var(--ev)', borderTop: '1px solid var(--b)' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>Recently used in</div>
                            {jobsUsingPart(p.id).length ? jobsUsingPart(p.id).slice(0, 8).map((j) => (
                              <div key={j.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, marginBottom: 5 }}>
                                <span style={{ color: 'var(--tx)' }}>{j.device_model || j.device_type}</span>
                                <span style={{ color: 'var(--tx3)' }}>{j.customer_name || '—'}</span>
                                <StatusBadge status={j.status} />
                                <span style={{ marginLeft: 'auto', color: 'var(--tx3)' }}>{shortDate(j.created_at)}</span>
                              </div>
                            )) : <div style={{ fontSize: 12, color: 'var(--tx3)' }}>No linked jobs recorded.</div>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parts cost trend */}
      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 14 }}>Parts Spend per Week</div>
        <LineChart points={weekTrend} color={AMBER} unit={currencySymbol} />
      </div>
    </div>
  )
}

// ── Customers sub-tab ────────────────────────────────────────────────────────
type CustSortKey = 'name' | 'devices' | 'spend' | 'last' | 'claims'

interface CustomerAgg {
  key: string
  name: string
  phone: string
  devices: number
  spend: number
  last: string | undefined
  claims: number
  history: ServiceJob[]
}

function CustomersSub({ jobs, currencySymbol }: { jobs: ServiceJob[]; currencySymbol: string }) {
  const [sortKey, setSortKey] = useState<CustSortKey>('spend')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const customers = useMemo<CustomerAgg[]>(() => {
    const map = new Map<string, CustomerAgg>()
    jobs.forEach((j) => {
      const key = (j.customer_phone || j.customer_name || j.id).toLowerCase()
      if (!map.has(key)) {
        map.set(key, {
          key, name: j.customer_name || 'Unknown', phone: j.customer_phone || '—',
          devices: 0, spend: 0, last: undefined, claims: 0, history: [],
        })
      }
      const c = map.get(key)!
      c.devices += 1
      c.spend += jobRevenue(j)
      if (j.status === 'warranty' || j.warranty_job_id) c.claims += 1
      c.history.push(j)
      const t = j.created_at
      if (t && (!c.last || new Date(t).getTime() > new Date(c.last).getTime())) c.last = t
    })
    map.forEach((c) => c.history.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()))
    return Array.from(map.values())
  }, [jobs])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) => `${c.name} ${c.phone}`.toLowerCase().includes(q))
  }, [customers, search])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      let av: any, bv: any
      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break
        case 'devices': av = a.devices; bv = b.devices; break
        case 'spend': av = a.spend; bv = b.spend; break
        case 'last': av = new Date(a.last || 0).getTime(); bv = new Date(b.last || 0).getTime(); break
        case 'claims': av = a.claims; bv = b.claims; break
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return arr
  }, [filtered, sortKey, sortDir])

  function toggleSort(k: CustSortKey) {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setSortDir('desc') }
  }

  const topByCustomer = useMemo(() => [...customers].sort((a, b) => b.spend - a.spend).slice(0, 5), [customers])

  if (customers.length === 0) {
    return <div style={{ ...cardStyle, textAlign: 'center', padding: 36, color: 'var(--tx3)' }}>No customers yet.</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top customers */}
      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 12 }}>Top Customers by Spend</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topByCustomer.map((c) => {
            const max = topByCustomer[0]?.spend || 1
            return (
              <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 140, fontSize: 12, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                <div style={{ flex: 1, height: 14, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(c.spend / max) * 100}%`, height: '100%', background: INDIGO }} />
                </div>
                <span style={{ width: 90, textAlign: 'right', fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, c.spend)}</span>
              </div>
            )
          })}
        </div>
      </div>

      <input
        placeholder="Search customers…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx)' }}
      />

      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => toggleSort('name')}>Name{sortArrow(sortKey === 'name', sortDir)}</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle} onClick={() => toggleSort('devices')}>Devices Repaired{sortArrow(sortKey === 'devices', sortDir)}</th>
                <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => toggleSort('spend')}>Total Spend{sortArrow(sortKey === 'spend', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('last')}>Last Visit{sortArrow(sortKey === 'last', sortDir)}</th>
                <th style={thStyle} onClick={() => toggleSort('claims')}>Warranty Claims{sortArrow(sortKey === 'claims', sortDir)}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <Fragment key={c.key}>
                  <tr onClick={() => setExpanded(expanded === c.key ? null : c.key)} style={{ cursor: 'pointer' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{c.name}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{c.phone}</td>
                    <td style={tdStyle}>{c.devices}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{fmt(currencySymbol, c.spend)}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{shortDate(c.last)}</td>
                    <td style={{ ...tdStyle, color: c.claims > 0 ? RED : 'var(--tx3)' }}>{c.claims}</td>
                  </tr>
                  {expanded === c.key && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div style={{ padding: '14px 16px', background: 'var(--ev)', borderTop: '1px solid var(--b)' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>Repair History ({c.history.length})</div>
                          {c.history.map((j) => (
                            <div key={j.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid var(--b)', marginBottom: 6 }}>
                              <span style={{ color: 'var(--tx)', fontWeight: 600 }}>{j.device_model || j.device_type}</span>
                              <span style={{ color: 'var(--tx3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.issue_description || ''}</span>
                              <StatusBadge status={j.status} />
                              <span style={{ color: 'var(--tx2)' }}>{fmt(currencySymbol, jobRevenue(j))}</span>
                              <span style={{ color: 'var(--tx3)' }}>{shortDate(j.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Warranty sub-tab ─────────────────────────────────────────────────────────
function WarrantySub({
  jobs,
  warranties,
  currencySymbol,
}: {
  jobs: ServiceJob[]
  warranties: WarrantyRecord[]
  currencySymbol: string
}) {
  // Active warranties — prefer dedicated endpoint, else derive from jobs with warranty_until
  const active = useMemo(() => {
    const fromEndpoint = warranties.filter((w) => !w.is_claim && w.warranty_until && daysUntil(w.warranty_until) >= 0)
    if (fromEndpoint.length) {
      return fromEndpoint.map((w) => ({
        id: w.job_id || w.id,
        customer: w.customer_name || '—',
        device: w.device_model || '—',
        repairType: w.repair_type || '—',
        expiry: w.warranty_until,
      }))
    }
    return jobs
      .filter((j) => j.warranty_until && daysUntil(j.warranty_until) >= 0)
      .map((j) => ({
        id: j.id,
        customer: j.customer_name || '—',
        device: j.device_model || j.device_type || '—',
        repairType: j.issue_description || '—',
        expiry: j.warranty_until,
      }))
  }, [warranties, jobs])

  const claims = useMemo(() => {
    const fromEndpoint = warranties.filter((w) => w.is_claim)
    if (fromEndpoint.length) {
      return fromEndpoint.map((w) => ({
        id: w.job_id || w.id,
        customer: w.customer_name || '—',
        device: w.device_model || '—',
        repairType: w.repair_type || '—',
        original: w.original_job_id,
      }))
    }
    return jobs
      .filter((j) => j.status === 'warranty' || !!j.warranty_job_id)
      .map((j) => ({
        id: j.id,
        customer: j.customer_name || '—',
        device: j.device_model || j.device_type || '—',
        repairType: j.issue_description || '—',
        original: j.warranty_job_id,
      }))
  }, [warranties, jobs])

  // Warranty rate by repair type
  const byType = useMemo(() => {
    const totals = new Map<string, { total: number; returns: number }>()
    jobs.forEach((j) => {
      const type = (j.device_type || 'Other')
      if (!totals.has(type)) totals.set(type, { total: 0, returns: 0 })
      const t = totals.get(type)!
      if (isCompleted(j)) t.total += 1
      if (j.status === 'warranty' || j.warranty_job_id) t.returns += 1
    })
    return Array.from(totals.entries())
      .map(([type, v]) => ({ type, rate: v.total ? (v.returns / v.total) * 100 : 0, returns: v.returns, total: v.total }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.rate - a.rate)
  }, [jobs])

  const expiringSoon = useMemo(
    () => active.filter((w) => { const d = daysUntil(w.expiry); return d >= 0 && d <= 30 }).sort((a, b) => daysUntil(a.expiry) - daysUntil(b.expiry)),
    [active]
  )

  const maxRate = Math.max(...byType.map((x) => x.rate), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Warranty rate by repair type */}
      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 14 }}>Warranty Return Rate by Repair Type</div>
        {byType.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byType.map((x) => (
              <div key={x.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 130, fontSize: 12, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.type}</span>
                <div style={{ flex: 1, height: 14, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(x.rate / maxRate) * 100}%`, height: '100%', background: x.rate > 12 ? RED : x.rate > 5 ? AMBER : GREEN }} />
                </div>
                <span style={{ width: 100, textAlign: 'right', fontSize: 12, color: 'var(--tx2)' }}>{x.rate.toFixed(1)}% ({x.returns}/{x.total})</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>No completed repairs to analyze yet.</div>
        )}
      </div>

      {/* Expiring soon */}
      <div style={{ ...cardStyle, borderColor: expiringSoon.length ? `${AMBER}55` : 'var(--b)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: expiringSoon.length ? AMBER : 'var(--tx)', marginBottom: 12 }}>
          Expiring in Next 30 Days ({expiringSoon.length})
        </div>
        {expiringSoon.length ? expiringSoon.map((w) => (
          <div key={w.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid var(--b)', marginBottom: 6 }}>
            <span style={{ color: 'var(--tx)', fontWeight: 600 }}>{w.device}</span>
            <span style={{ color: 'var(--tx3)' }}>{w.customer}</span>
            <span style={{ marginLeft: 'auto', color: AMBER, fontWeight: 700 }}>{daysUntil(w.expiry)}d left</span>
          </div>
        )) : <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Nothing expiring soon.</div>}
      </div>

      {/* Active warranties */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', padding: '14px 16px 8px' }}>Active Warranties ({active.length})</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Ticket #</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Device</th>
                <th style={thStyle}>Repair Type</th>
                <th style={thStyle}>Expiry</th>
                <th style={thStyle}>Days Remaining</th>
              </tr>
            </thead>
            <tbody>
              {active.length ? active.map((w) => {
                const d = daysUntil(w.expiry)
                return (
                  <tr key={w.id}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11, color: 'var(--tx3)' }}>#{String(w.id).slice(0, 8)}</td>
                    <td style={tdStyle}>{w.customer}</td>
                    <td style={tdStyle}>{w.device}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx2)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.repairType}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{shortDate(w.expiry)}</td>
                    <td style={{ ...tdStyle, color: d <= 30 ? AMBER : GREEN, fontWeight: 600 }}>{d}d</td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: 'var(--tx3)' }}>No active warranties.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warranty claims */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', padding: '14px 16px 8px' }}>Warranty Claims / Returns ({claims.length})</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Ticket #</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Device</th>
                <th style={thStyle}>Repair Type</th>
                <th style={thStyle}>Original Ticket</th>
              </tr>
            </thead>
            <tbody>
              {claims.length ? claims.map((w) => (
                <tr key={w.id}>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11, color: 'var(--tx3)' }}>#{String(w.id).slice(0, 8)}</td>
                  <td style={tdStyle}>{w.customer}</td>
                  <td style={tdStyle}>{w.device}</td>
                  <td style={{ ...tdStyle, color: 'var(--tx2)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.repairType}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11, color: INDIGO }}>{w.original ? `#${String(w.original).slice(0, 8)}` : '—'}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: 'var(--tx3)' }}>No warranty claims recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
