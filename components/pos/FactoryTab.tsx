'use client'
import { useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import { useLang } from '@/components/LanguageProvider'

// ── Color constants ──────────────────────────────────────────
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'
const ACC = '#f59e0b' // factory accent (amber/yellow)
const ACC_BG = 'rgba(245,158,11,.08)'
const ACC_BORDER = 'rgba(245,158,11,.25)'

// ── Types ────────────────────────────────────────────────────
type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'
type CaptureStatus = 'pending' | 'approved' | 'rejected'
type SubTab = 'overview' | 'production' | 'quality' | 'inventory' | 'dispatch' | 'costing'
type SortDir = 'asc' | 'desc'

interface FactoryCapture {
  id: string
  type: CaptureType
  product: string
  quantity: number
  unit: string
  notes?: string | null
  photos?: string[] | null
  status: CaptureStatus
  approved_by?: string | null
  operator?: string | null
  staff_id?: string | null
  cost_per_unit?: number | null
  destination?: string | null
  created_at: string
}

interface InventoryItem {
  id?: string
  name: string
  category?: string // 'raw' | 'finished' | other
  quantity?: number
  stock?: number
  unit?: string
  cost?: number
  cost_price?: number
  price?: number
  selling_price?: number
  reorder_point?: number
  reorder_level?: number
}

interface StaffMember {
  id: string
  name: string
  role?: string
}

interface FactoryTabProps {
  currencySymbol: string
  selectedLocation: string
  transactions: any[]
  staff: any[]
  inventory: any[]
  /** Preview/dev only: inject captures to bypass the authed fetch. */
  previewCaptures?: any[]
}

// ── Helpers ──────────────────────────────────────────────────
function fmt(symbol: string, amount: number): string {
  const num = (isFinite(amount) ? amount : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const needsSpace = symbol.length > 1 && /[a-zA-Z]$/.test(symbol)
  return `${symbol}${needsSpace ? ' ' : ''}${num}`
}

function fmtInt(n: number): string {
  return (isFinite(n) ? Math.round(n) : 0).toLocaleString()
}

function pct(n: number): string {
  return `${(isFinite(n) ? n : 0).toFixed(1)}%`
}

function dayKey(date: string | Date): string {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function shortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function fullDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function weekKey(date: string | Date): string {
  const d = new Date(date)
  const onejan = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

function getQty(item: InventoryItem): number {
  return Number(item.quantity ?? item.stock ?? 0) || 0
}
function getCost(item: InventoryItem): number {
  return Number(item.cost ?? item.cost_price ?? 0) || 0
}
function getSell(item: InventoryItem): number {
  return Number(item.selling_price ?? item.price ?? 0) || 0
}
function getReorder(item: InventoryItem): number {
  return Number(item.reorder_point ?? item.reorder_level ?? 0) || 0
}
function isRaw(item: InventoryItem): boolean {
  return (item.category || '').toLowerCase().includes('raw')
}
function isFinished(item: InventoryItem): boolean {
  return (item.category || '').toLowerCase().includes('finish')
}

// categorize a free-text note into a coarse waste reason
function wasteReason(note?: string | null): string {
  const n = (note || '').toLowerCase()
  if (!n) return 'Uncategorised'
  if (/(broke|crack|damag|defect|fault)/.test(n)) return 'Damage / Defect'
  if (/(expir|spoil|stale|rot|mould|mold)/.test(n)) return 'Expiry / Spoilage'
  if (/(spill|drop|leak)/.test(n)) return 'Spillage'
  if (/(setup|calibrat|test|trial|sample)/.test(n)) return 'Setup / Testing'
  if (/(over|excess|surplus)/.test(n)) return 'Overproduction'
  if (/(contaminat|dirty|foreign)/.test(n)) return 'Contamination'
  return 'Other'
}

// ── Status / type badges ─────────────────────────────────────
const STATUS_STYLE: Record<CaptureStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'rgba(202,138,4,.12)', text: AMBER, label: 'Pending' },
  approved: { bg: 'rgba(22,163,74,.12)', text: GREEN, label: 'Approved' },
  rejected: { bg: 'rgba(220,38,38,.12)', text: RED, label: 'Rejected' },
}
const TYPE_STYLE: Record<CaptureType, { bg: string; text: string; label: string }> = {
  intake: { bg: 'rgba(59,130,246,.12)', text: '#3b82f6', label: 'Intake' },
  output: { bg: 'rgba(245,158,11,.12)', text: ACC, label: 'Output' },
  wastage: { bg: 'rgba(220,38,38,.12)', text: RED, label: 'Wastage' },
  dispatch: { bg: 'rgba(168,85,247,.12)', text: '#a855f7', label: 'Dispatch' },
}

function StatusBadge({ status }: { status: CaptureStatus }) {
  const { tc } = useLang()
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending
  const label = tc('pos_factory.status' + (status === 'pending' ? 'Pending' : status === 'approved' ? 'Approved' : 'Rejected'))
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: s.text, background: s.bg, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}
function TypeBadge({ type }: { type: CaptureType }) {
  const { tc } = useLang()
  const s = TYPE_STYLE[type] || TYPE_STYLE.intake
  const label = tc('pos_factory.type' + (type === 'intake' ? 'Intake' : type === 'output' ? 'Output' : type === 'wastage' ? 'Wastage' : 'Dispatch'))
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: s.text, background: s.bg, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

// ── KPI card ─────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent, onClick, active }: {
  label: string; value: string; sub?: string; accent?: string; onClick?: () => void; active?: boolean
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16, borderRadius: 12, background: 'var(--sf)',
        border: active ? `1.5px solid ${accent || ACC}` : '1px solid var(--b)',
        cursor: onClick ? 'pointer' : 'default', transition: 'border-color .15s',
        boxShadow: active ? `0 0 0 3px ${ACC_BG}` : 'none',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = accent || ACC }}
      onMouseLeave={e => { if (onClick && !active) e.currentTarget.style.borderColor = 'var(--b)' }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent || 'var(--tx)', fontFamily: 'var(--font-sora)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ── Section heading ──────────────────────────────────────────
function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  )
}

// ── Empty / loading ──────────────────────────────────────────
function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx3)' }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>{title}</div>
      {hint && <div style={{ fontSize: 13, marginTop: 8, maxWidth: 320, margin: '8px auto 0' }}>{hint}</div>}
    </div>
  )
}

// ── SVG: combined output bars + wastage overlay line ─────────
function OutputBarChart({ days, currencySymbol }: { days: { key: string; output: number; wastage: number }[]; currencySymbol: string }) {
  const { tc } = useLang()
  const W = 760, H = 220, padL = 36, padR = 16, padT = 16, padB = 28
  const innerW = W - padL - padR, innerH = H - padT - padB
  const maxOut = Math.max(1, ...days.map(d => d.output))
  const maxWaste = Math.max(1, ...days.map(d => d.wastage))
  const bw = innerW / Math.max(1, days.length)
  const linePts = days.map((d, i) => {
    const x = padL + i * bw + bw / 2
    const y = padT + innerH - (d.wastage / maxWaste) * innerH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ minWidth: 600 }}>
        {[0, 0.25, 0.5, 0.75, 1].map((g, i) => {
          const y = padT + innerH - g * innerH
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--b)" strokeWidth={1} />
              <text x={4} y={y + 3} fontSize={9} fill="var(--tx3)">{fmtInt(maxOut * g)}</text>
            </g>
          )
        })}
        {days.map((d, i) => {
          const h = (d.output / maxOut) * innerH
          const x = padL + i * bw + bw * 0.18
          const y = padT + innerH - h
          return (
            <g key={d.key}>
              <rect x={x} y={y} width={bw * 0.64} height={Math.max(0, h)} fill={ACC} opacity={0.85} rx={2} />
              {i % 5 === 0 && <text x={padL + i * bw + bw / 2} y={H - 8} fontSize={9} fill="var(--tx3)" textAnchor="middle">{shortDate(d.key)}</text>}
            </g>
          )
        })}
        {days.length > 1 && <polyline points={linePts} fill="none" stroke={RED} strokeWidth={1.8} />}
        {days.map((d, i) => {
          const x = padL + i * bw + bw / 2
          const y = padT + innerH - (d.wastage / maxWaste) * innerH
          return <circle key={`c${d.key}`} cx={x} cy={y} r={2.2} fill={RED} />
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: ACC, borderRadius: 2, marginRight: 4 }} />{tc('pos_factory.unitsProduced')}</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 2, background: RED, marginRight: 4, verticalAlign: 'middle' }} />{tc('pos_factory.wastageUnits')}</span>
      </div>
    </div>
  )
}

// ── SVG: horizontal bars (waste by product etc.) ─────────────
function HBarChart({ data, color, currencySymbol, valueIsMoney }: {
  data: { label: string; value: number }[]; color: string; currencySymbol: string; valueIsMoney?: boolean
}) {
  const { tc } = useLang()
  const max = Math.max(1, ...data.map(d => d.value))
  if (data.length === 0) return <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noData')}</div>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(d => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 130, fontSize: 12, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
          <div style={{ flex: 1, height: 18, background: 'var(--ev)', borderRadius: 4, position: 'relative' }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: '100%', background: color, borderRadius: 4, minWidth: 2 }} />
          </div>
          <div style={{ width: 80, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>
            {valueIsMoney ? fmt(currencySymbol, d.value) : fmtInt(d.value)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── SVG: line chart (trends) ─────────────────────────────────
function LineChart({ points, color, yLabel, formatY }: {
  points: { label: string; value: number }[]; color: string; yLabel?: string; formatY?: (n: number) => string
}) {
  const { tc } = useLang()
  const W = 760, H = 200, padL = 40, padR = 16, padT = 16, padB = 28
  const innerW = W - padL - padR, innerH = H - padT - padB
  const max = Math.max(1, ...points.map(p => p.value))
  if (points.length === 0) return <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noData')}</div>
  const step = innerW / Math.max(1, points.length - 1)
  const poly = points.map((p, i) => {
    const x = padL + i * step
    const y = padT + innerH - (p.value / max) * innerH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const fmtY = formatY || ((n: number) => fmtInt(n))
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ minWidth: 600 }}>
        {[0, 0.5, 1].map((g, i) => {
          const y = padT + innerH - g * innerH
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--b)" strokeWidth={1} />
              <text x={4} y={y + 3} fontSize={9} fill="var(--tx3)">{fmtY(max * g)}</text>
            </g>
          )
        })}
        <polyline points={poly} fill="none" stroke={color} strokeWidth={2} />
        {points.map((p, i) => {
          const x = padL + i * step
          const y = padT + innerH - (p.value / max) * innerH
          return (
            <g key={p.label}>
              <circle cx={x} cy={y} r={2.6} fill={color} />
              {(i % Math.max(1, Math.ceil(points.length / 8)) === 0) && (
                <text x={x} y={H - 8} fontSize={9} fill="var(--tx3)" textAnchor="middle">{p.label}</text>
              )}
            </g>
          )
        })}
      </svg>
      {yLabel && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>{yLabel}</div>}
    </div>
  )
}

// ── SVG: pie chart (cost breakdown) ──────────────────────────
function PieChart({ slices, currencySymbol }: { slices: { label: string; value: number; color: string }[]; currencySymbol: string }) {
  const { tc } = useLang()
  const total = slices.reduce((s, x) => s + x.value, 0)
  if (total <= 0) return <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noCostData')}</div>
  const R = 80, C = 100
  let acc = 0
  const arcs = slices.map(s => {
    const frac = s.value / total
    const start = acc * 2 * Math.PI
    acc += frac
    const end = acc * 2 * Math.PI
    const x1 = C + R * Math.sin(start), y1 = C - R * Math.cos(start)
    const x2 = C + R * Math.sin(end), y2 = C - R * Math.cos(end)
    const large = end - start > Math.PI ? 1 : 0
    return { d: `M${C},${C} L${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`, ...s, frac }
  })
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 200 200" width={180} height={180}>
        {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} stroke="var(--sf)" strokeWidth={1} />)}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {arcs.map(a => (
          <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ width: 12, height: 12, background: a.color, borderRadius: 3, display: 'inline-block' }} />
            <span style={{ color: 'var(--tx2)', minWidth: 120 }}>{a.label}</span>
            <span style={{ fontWeight: 700 }}>{fmt(currencySymbol, a.value)}</span>
            <span style={{ color: 'var(--tx3)' }}>({pct(a.frac * 100)})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sortable header cell ─────────────────────────────────────
function Th({ label, col, sortCol, sortDir, onSort, align }: {
  label: string; col?: string; sortCol?: string; sortDir?: SortDir; onSort?: (c: string) => void; align?: 'left' | 'right' | 'center'
}) {
  const sortable = !!col && !!onSort
  return (
    <th
      onClick={() => sortable && onSort!(col!)}
      style={{
        textAlign: align || 'left', padding: '8px 10px', fontSize: 11, fontWeight: 700, color: 'var(--tx3)',
        textTransform: 'uppercase', borderBottom: '1px solid var(--b)', cursor: sortable ? 'pointer' : 'default',
        whiteSpace: 'nowrap', userSelect: 'none',
      }}
    >
      {label}{sortable && sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </th>
  )
}

const tdStyle: React.CSSProperties = { padding: '8px 10px', fontSize: 13, borderBottom: '1px solid var(--b)', verticalAlign: 'top' }

// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════
export default function FactoryTab({ currencySymbol, selectedLocation, transactions, staff, inventory, previewCaptures }: FactoryTabProps) {
  const { tc } = useLang()
  const [subTab, setSubTab] = useState<SubTab>('overview')
  const [captures, setCaptures] = useState<FactoryCapture[]>([])
  const [loading, setLoading] = useState(true)

  // ── Fetch factory captures ─────────────────────────────────
  const fetchCaptures = useCallback(async () => {
    // Preview/dev: use injected captures and skip the authed fetch.
    if (previewCaptures) {
      setCaptures(previewCaptures as FactoryCapture[])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedLocation && selectedLocation !== 'all') params.set('location_id', selectedLocation)
      const res = await fetch(`/api/pos/factory/capture?${params}`)
      const data = await res.json()
      const list: FactoryCapture[] = Array.isArray(data) ? data : (data.captures || data.data || [])
      setCaptures(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to fetch factory captures:', err)
      setCaptures([])
    } finally {
      setLoading(false)
    }
  }, [selectedLocation, previewCaptures])

  useEffect(() => { fetchCaptures() }, [fetchCaptures])

  // ── Normalise props ────────────────────────────────────────
  const inv: InventoryItem[] = useMemo(() => Array.isArray(inventory) ? inventory : [], [inventory])
  const staffList: StaffMember[] = useMemo(() => Array.isArray(staff) ? staff : [], [staff])
  const txns: any[] = useMemo(() => Array.isArray(transactions) ? transactions : [], [transactions])

  const staffName = useCallback((id?: string | null) => {
    if (!id) return null
    return staffList.find(s => s.id === id)?.name || null
  }, [staffList])

  // ── Derived: typed capture groups ──────────────────────────
  const outputs = useMemo(() => captures.filter(c => c.type === 'output'), [captures])
  const intakes = useMemo(() => captures.filter(c => c.type === 'intake'), [captures])
  const wastages = useMemo(() => captures.filter(c => c.type === 'wastage'), [captures])
  const dispatches = useMemo(() => captures.filter(c => c.type === 'dispatch'), [captures])

  // ── Core KPIs ──────────────────────────────────────────────
  const todayKey = dayKey(new Date())
  const unitsToday = useMemo(() => outputs.filter(c => dayKey(c.created_at) === todayKey).reduce((s, c) => s + (Number(c.quantity) || 0), 0), [outputs, todayKey])
  const totalOutput = useMemo(() => outputs.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [outputs])
  const totalIntake = useMemo(() => intakes.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [intakes])
  const totalWaste = useMemo(() => wastages.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [wastages])
  const wastagePct = totalOutput + totalWaste > 0 ? (totalWaste / (totalOutput + totalWaste)) * 100 : 0
  const pendingCount = useMemo(() => captures.filter(c => c.status === 'pending').length, [captures])
  const efficiency = totalIntake > 0 ? (totalOutput / totalIntake) * 100 : 0
  const salesRevenue = useMemo(() => txns.reduce((s, t) => s + (Number(t.total ?? t.amount ?? 0) || 0), 0), [txns])

  // ── Daily series (last 30 days) ────────────────────────────
  const dailySeries = useMemo(() => {
    const out: { key: string; output: number; wastage: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const k = dayKey(d)
      out.push({ key: k, output: 0, wastage: 0 })
    }
    const idx = new Map(out.map((o, i) => [o.key, i]))
    for (const c of outputs) { const i = idx.get(dayKey(c.created_at)); if (i != null) out[i].output += Number(c.quantity) || 0 }
    for (const c of wastages) { const i = idx.get(dayKey(c.created_at)); if (i != null) out[i].wastage += Number(c.quantity) || 0 }
    return out
  }, [outputs, wastages])

  // ── Status breakdown ───────────────────────────────────────
  const statusBreakdown = useMemo(() => {
    const b: Record<CaptureStatus, number> = { pending: 0, approved: 0, rejected: 0 }
    for (const c of captures) b[c.status] = (b[c.status] || 0) + 1
    return b
  }, [captures])

  // ── KPI focus filter (clicking a KPI filters production view) ─
  const [kpiFocus, setKpiFocus] = useState<string | null>(null)
  const focusKpi = (key: string, tab?: SubTab) => {
    setKpiFocus(prev => prev === key ? null : key)
    if (tab) setSubTab(tab)
  }

  // ── Inventory cost lookup by product name ──────────────────
  const costByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const it of inv) {
      const c = getCost(it)
      if (c > 0) m.set((it.name || '').toLowerCase(), c)
    }
    return m
  }, [inv])
  const sellByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const it of inv) {
      const c = getSell(it)
      if (c > 0) m.set((it.name || '').toLowerCase(), c)
    }
    return m
  }, [inv])
  const costForCapture = useCallback((c: FactoryCapture): number => {
    if (c.cost_per_unit != null && Number(c.cost_per_unit) > 0) return Number(c.cost_per_unit)
    return costByProduct.get((c.product || '').toLowerCase()) || 0
  }, [costByProduct])

  // ═══════════════════ SUB-TAB BAR ════════════════════════════
  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'overview', label: tc('pos_factory.tabOverview') },
    { id: 'production', label: tc('pos_factory.tabProduction') },
    { id: 'quality', label: tc('pos_factory.tabQuality') },
    { id: 'inventory', label: tc('pos_factory.tabInventory') },
    { id: 'dispatch', label: tc('pos_factory.tabDispatch') },
    { id: 'costing', label: tc('pos_factory.tabCosting') },
  ]

  // ═══════════════════ RENDER ════════════════════════════════
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, flex: 1 }}>
          <span style={{ marginRight: 8 }}>🏭</span>{tc('pos_factory.factoryAnalytics')}
        </div>
        <button onClick={fetchCaptures} style={{ padding: '8px 16px', borderRadius: 10, background: 'transparent', color: 'var(--tx)', fontSize: 13, fontWeight: 600, border: `1px solid ${ACC_BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}>
          {tc('pos_factory.refresh')}
        </button>
      </div>

      {/* Sub-tab navigation */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', borderBottom: '1px solid var(--b)', paddingBottom: 12 }}>
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            padding: '7px 16px', borderRadius: 9999,
            border: subTab === t.id ? `1.5px solid ${ACC}` : '1px solid var(--b)',
            background: subTab === t.id ? ACC_BG : 'var(--sf)',
            color: subTab === t.id ? ACC : 'var(--tx2)',
            fontSize: 13, fontWeight: subTab === t.id ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: 'var(--tx3)', padding: 20 }}>{tc('pos_factory.loadingFactoryData')}</div>
      ) : (
        <>
          {subTab === 'overview' && (
            <OverviewView
              currencySymbol={currencySymbol}
              unitsToday={unitsToday} wastagePct={wastagePct} dispatchCount={dispatches.length}
              pendingCount={pendingCount} efficiency={efficiency} salesRevenue={salesRevenue}
              dailySeries={dailySeries} totalOutput={totalOutput} statusBreakdown={statusBreakdown}
              kpiFocus={kpiFocus} focusKpi={focusKpi}
              captures={captures}
            />
          )}
          {subTab === 'production' && (
            <ProductionView captures={captures} staffName={staffName} currencySymbol={currencySymbol} />
          )}
          {subTab === 'quality' && (
            <QualityView captures={captures} wastages={wastages} costForCapture={costForCapture} totalWaste={totalWaste} currencySymbol={currencySymbol} staffName={staffName} />
          )}
          {subTab === 'inventory' && (
            <InventoryView inv={inv} intakes={intakes} currencySymbol={currencySymbol} />
          )}
          {subTab === 'dispatch' && (
            <DispatchView dispatches={dispatches} staffName={staffName} currencySymbol={currencySymbol} />
          )}
          {subTab === 'costing' && (
            <CostingView
              intakes={intakes} outputs={outputs} wastages={wastages}
              costForCapture={costForCapture} sellByProduct={sellByProduct}
              totalOutput={totalOutput} currencySymbol={currencySymbol}
            />
          )}
        </>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// OVERVIEW SUB-TAB
// ═════════════════════════════════════════════════════════════
function OverviewView(props: {
  currencySymbol: string
  unitsToday: number; wastagePct: number; dispatchCount: number; pendingCount: number; efficiency: number; salesRevenue: number
  dailySeries: { key: string; output: number; wastage: number }[]
  totalOutput: number
  statusBreakdown: Record<CaptureStatus, number>
  kpiFocus: string | null; focusKpi: (k: string, t?: SubTab) => void
  captures: FactoryCapture[]
}) {
  const { tc } = useLang()
  const { currencySymbol, unitsToday, wastagePct, dispatchCount, pendingCount, efficiency, salesRevenue, dailySeries, statusBreakdown, kpiFocus, focusKpi, captures } = props
  const totalStatus = statusBreakdown.pending + statusBreakdown.approved + statusBreakdown.rejected
  const periodOutput = dailySeries.reduce((s, d) => s + d.output, 0)
  const periodDispatch = props.captures.filter(c => c.type === 'dispatch').reduce((s, c) => s + (Number(c.quantity) || 0), 0)

  return (
    <div>
      {/* 6 KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.unitsTodayLabel')} value={fmtInt(unitsToday)} sub={tc('pos_factory.fromOutputCaptures')} accent={ACC} onClick={() => focusKpi('output', 'production')} active={kpiFocus === 'output'} />
        <KpiCard label={tc('pos_factory.wastagePctLabel')} value={pct(wastagePct)} sub={tc('pos_factory.ofTotalOutput')} accent={wastagePct > 5 ? RED : GREEN} onClick={() => focusKpi('wastage', 'quality')} active={kpiFocus === 'wastage'} />
        <KpiCard label={tc('pos_factory.dispatchCountLabel')} value={fmtInt(dispatchCount)} sub={tc('pos_factory.shipmentsLogged')} accent="#a855f7" onClick={() => focusKpi('dispatch', 'dispatch')} active={kpiFocus === 'dispatch'} />
        <KpiCard label={tc('pos_factory.pendingApprovalsLabel')} value={fmtInt(pendingCount)} sub={tc('pos_factory.awaitingSignOff')} accent={pendingCount > 0 ? AMBER : GREEN} onClick={() => focusKpi('pending', 'production')} active={kpiFocus === 'pending'} />
        <KpiCard label={tc('pos_factory.productionEfficiencyLabel')} value={pct(efficiency)} sub={tc('pos_factory.outputDivIntake')} accent={efficiency >= 80 ? GREEN : AMBER} onClick={() => focusKpi('efficiency', 'costing')} active={kpiFocus === 'efficiency'} />
        <KpiCard label={tc('pos_factory.revenueFromSalesLabel')} value={fmt(currencySymbol, salesRevenue)} sub={tc('pos_factory.allTransactions')} accent={GREEN} />
      </div>

      {/* Daily output + wastage chart */}
      <Section title={tc('pos_factory.dailyOutputTitle')} right={<span style={{ fontSize: 12, color: 'var(--tx3)' }}>{fmtInt(periodOutput)} units total</span>}>
        {periodOutput === 0 ? (
          <EmptyState icon="📊" title={tc('pos_factory.noProductionTitle')} hint={tc('pos_factory.noProductionHint')} />
        ) : (
          <OutputBarChart days={dailySeries} currencySymbol={currencySymbol} />
        )}
      </Section>

      {/* Production vs Dispatch */}
      <Section title={tc('pos_factory.productionVsDispatch')}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <HBarChart
              data={[{ label: tc('pos_factory.produced'), value: periodOutput }, { label: tc('pos_factory.dispatched'), value: periodDispatch }]}
              color={ACC} currencySymbol={currencySymbol}
            />
          </div>
          <div style={{ minWidth: 200 }}>
            {periodOutput >= periodDispatch ? (
              <div style={{ fontSize: 13, color: 'var(--tx2)' }}>
                {tc('pos_factory.producingMore', { n: fmtInt(periodOutput - periodDispatch) })}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--tx2)' }}>
                {tc('pos_factory.shippingMore', { n: fmtInt(periodDispatch - periodOutput) })}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Work status breakdown */}
      <Section title={tc('pos_factory.workStatusBreakdown')}>
        {totalStatus === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noCapturesRecorded')}</div>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(['approved', 'pending', 'rejected'] as CaptureStatus[]).map(s => (
              <div key={s} style={{ flex: 1, minWidth: 140, padding: 14, borderRadius: 10, background: 'var(--ev)', border: '1px solid var(--b)' }}>
                <div style={{ marginBottom: 6 }}><StatusBadge status={s} /></div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-sora)' }}>{statusBreakdown[s]}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{pct((statusBreakdown[s] / totalStatus) * 100)} {tc('pos_factory.ofAll')}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// PRODUCTION SUB-TAB
// ═════════════════════════════════════════════════════════════
function ProductionView({ captures, staffName, currencySymbol }: {
  captures: FactoryCapture[]; staffName: (id?: string | null) => string | null; currencySymbol: string
}) {
  const { tc } = useLang()
  const [typeFilter, setTypeFilter] = useState<'all' | 'intake' | 'output'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | CaptureStatus>('all')
  const [productFilter, setProductFilter] = useState('')
  const [operatorFilter, setOperatorFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)

  const onSort = (c: string) => {
    if (sortCol === c) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(c); setSortDir('asc') }
  }

  // production = intake + output
  const base = useMemo(() => captures.filter(c => c.type === 'intake' || c.type === 'output'), [captures])

  const operators = useMemo(() => {
    const set = new Set<string>()
    for (const c of base) {
      const name = c.operator || staffName(c.staff_id)
      if (name) set.add(name)
    }
    return Array.from(set).sort()
  }, [base, staffName])

  const filtered = useMemo(() => {
    let rows = base
    if (typeFilter !== 'all') rows = rows.filter(c => c.type === typeFilter)
    if (statusFilter !== 'all') rows = rows.filter(c => c.status === statusFilter)
    if (productFilter) rows = rows.filter(c => c.product === productFilter)
    if (operatorFilter !== 'all') rows = rows.filter(c => (c.operator || staffName(c.staff_id)) === operatorFilter)
    if (search) rows = rows.filter(c => (c.product || '').toLowerCase().includes(search.toLowerCase()))
    if (fromDate) rows = rows.filter(c => new Date(c.created_at) >= new Date(fromDate))
    if (toDate) rows = rows.filter(c => new Date(c.created_at) <= new Date(toDate + 'T23:59:59'))
    const sorted = [...rows].sort((a, b) => {
      let av: any, bv: any
      switch (sortCol) {
        case 'product': av = a.product || ''; bv = b.product || ''; break
        case 'type': av = a.type; bv = b.type; break
        case 'quantity': av = Number(a.quantity) || 0; bv = Number(b.quantity) || 0; break
        case 'status': av = a.status; bv = b.status; break
        default: av = new Date(a.created_at).getTime(); bv = new Date(b.created_at).getTime()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [base, typeFilter, statusFilter, productFilter, operatorFilter, search, fromDate, toDate, sortCol, sortDir, staffName])

  const products = useMemo(() => Array.from(new Set(base.map(c => c.product).filter(Boolean))).sort(), [base])

  // Yield per product (output / intake)
  const yields = useMemo(() => {
    const m = new Map<string, { intake: number; output: number }>()
    for (const c of base) {
      const k = c.product || 'Unknown'
      const e = m.get(k) || { intake: 0, output: 0 }
      if (c.type === 'intake') e.intake += Number(c.quantity) || 0
      if (c.type === 'output') e.output += Number(c.quantity) || 0
      m.set(k, e)
    }
    return Array.from(m.entries())
      .map(([product, v]) => ({ product, ...v, yield: v.intake > 0 ? (v.output / v.intake) * 100 : 0 }))
      .filter(y => y.intake > 0 || y.output > 0)
      .sort((a, b) => b.yield - a.yield)
  }, [base])

  // Batch tracking: group by date+product
  const batches = useMemo(() => {
    const m = new Map<string, { date: string; product: string; intake: number; output: number; count: number }>()
    for (const c of base) {
      const dk = dayKey(c.created_at)
      const k = `${dk}|${c.product}`
      const e = m.get(k) || { date: dk, product: c.product || 'Unknown', intake: 0, output: 0, count: 0 }
      if (c.type === 'intake') e.intake += Number(c.quantity) || 0
      if (c.type === 'output') e.output += Number(c.quantity) || 0
      e.count += 1
      m.set(k, e)
    }
    return Array.from(m.values()).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
  }, [base])

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px', borderRadius: 8, border: active ? `1.5px solid ${ACC}` : '1px solid var(--b)',
    background: active ? ACC_BG : 'var(--sf)', color: active ? ACC : 'var(--tx3)',
    fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
  })
  const inputStyle: React.CSSProperties = { padding: '7px 10px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit' }

  return (
    <div>
      {/* Filters */}
      <Section title={tc('pos_factory.productionLog')}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['all', 'intake', 'output'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={filterBtn(typeFilter === t)}>
              {t === 'all' ? tc('pos_factory.allTypes') : tc('pos_factory.type' + (t === 'intake' ? 'Intake' : 'Output'))}
            </button>
          ))}
          <span style={{ width: 1, background: 'var(--b)', margin: '0 4px' }} />
          {(['all', 'approved', 'pending', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={filterBtn(statusFilter === s)}>
              {s === 'all' ? tc('pos_factory.allStatus') : tc('pos_factory.status' + (s === 'pending' ? 'Pending' : s === 'approved' ? 'Approved' : 'Rejected'))}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tc('pos_factory.searchProductPlaceholder')} style={{ ...inputStyle, flex: 1, minWidth: 160 }} />
          <select value={productFilter} onChange={e => setProductFilter(e.target.value)} style={inputStyle}>
            <option value="">{tc('pos_factory.allProducts')}</option>
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={operatorFilter} onChange={e => setOperatorFilter(e.target.value)} style={inputStyle}>
            <option value="all">{tc('pos_factory.allOperators')}</option>
            {operators.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🛠️" title={tc('pos_factory.noProductionRecords')} hint={tc('pos_factory.noProductionRecordsHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  <Th label={tc('pos_factory.colDate')} col="created_at" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colType')} col="type" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colProduct')} col="product" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colQty')} col="quantity" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                  <Th label={tc('pos_factory.colUnit')} />
                  <Th label={tc('pos_factory.colOperator')} />
                  <Th label={tc('pos_factory.colStatus')} col="status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colNotes')} />
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const op = c.operator || staffName(c.staff_id) || '—'
                  const isOpen = expanded === c.id
                  return (
                    <Fragment key={c.id}>
                      <tr onClick={() => setExpanded(isOpen ? null : c.id)} style={{ cursor: 'pointer' }}>
                        <td style={tdStyle}>{shortDate(c.created_at)}</td>
                        <td style={tdStyle}><TypeBadge type={c.type} /></td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{c.product || '—'}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{fmtInt(Number(c.quantity) || 0)}</td>
                        <td style={tdStyle}>{c.unit || '—'}</td>
                        <td style={tdStyle}>{op}</td>
                        <td style={tdStyle}><StatusBadge status={c.status} /></td>
                        <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--tx3)' }}>{c.notes || '—'}</td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={8} style={{ padding: 14, background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', marginBottom: 4 }}>{tc('pos_factory.detailsLabel')}</div>
                                <div style={{ fontSize: 13 }}>{tc('pos_factory.capturedLabel')} {fullDateTime(c.created_at)}</div>
                                <div style={{ fontSize: 13 }}>{tc('pos_factory.typeLabel')} {tc('pos_factory.type' + (c.type === 'intake' ? 'Intake' : c.type === 'output' ? 'Output' : c.type === 'wastage' ? 'Wastage' : 'Dispatch'))} · {tc('pos_factory.statusLabel')} {tc('pos_factory.status' + (c.status === 'pending' ? 'Pending' : c.status === 'approved' ? 'Approved' : 'Rejected'))}</div>
                                <div style={{ fontSize: 13 }}>{tc('pos_factory.quantityLabel')} {fmtInt(Number(c.quantity) || 0)} {c.unit || ''}</div>
                                {c.notes && <div style={{ fontSize: 13, marginTop: 6, color: 'var(--tx2)' }}>{c.notes}</div>}
                              </div>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', marginBottom: 4 }}>{tc('pos_factory.approvalLabel')}</div>
                                <div style={{ fontSize: 13 }}>{c.approved_by ? tc('pos_factory.approvedBy', { name: staffName(c.approved_by) || c.approved_by }) : tc('pos_factory.notYetApproved')}</div>
                                {c.photos && c.photos.length > 0 && (
                                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                                    {c.photos.map((p, i) => (
                                      <img key={i} src={p} alt={tc('pos_factory.capturePhoto', { n: i + 1 })} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--b)' }} />
                                    ))}
                                  </div>
                                )}
                              </div>
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
        )}
      </Section>

      {/* Yield per product */}
      <Section title={tc('pos_factory.yieldByProduct')}>
        {yields.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noYieldData')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colIntake')} align="right" /><Th label={tc('pos_factory.colOutput')} align="right" /><Th label={tc('pos_factory.colYield')} align="right" />
              </tr></thead>
              <tbody>
                {yields.map(y => (
                  <tr key={y.product}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{y.product}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(y.intake)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(y.output)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: y.yield >= 90 ? GREEN : y.yield >= 70 ? AMBER : RED }}>{pct(y.yield)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Batch tracking */}
      <Section title={tc('pos_factory.batchTrackingTitle')}>
        {batches.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noBatches')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colDate')} /><Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colCaptures')} align="right" /><Th label={tc('pos_factory.colIntake')} align="right" /><Th label={tc('pos_factory.colOutput')} align="right" /><Th label={tc('pos_factory.colYield')} align="right" />
              </tr></thead>
              <tbody>
                {batches.map(b => {
                  const y = b.intake > 0 ? (b.output / b.intake) * 100 : 0
                  return (
                    <tr key={`${b.date}-${b.product}`}>
                      <td style={tdStyle}>{shortDate(b.date)}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{b.product}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{b.count}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(b.intake)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(b.output)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx3)' }}>{b.intake > 0 ? pct(y) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// QUALITY SUB-TAB
// ═════════════════════════════════════════════════════════════
function QualityView({ captures, wastages, costForCapture, totalWaste, currencySymbol, staffName }: {
  captures: FactoryCapture[]; wastages: FactoryCapture[]; costForCapture: (c: FactoryCapture) => number
  totalWaste: number; currencySymbol: string; staffName: (id?: string | null) => string | null
}) {
  const { tc } = useLang()
  const totalCaptures = captures.length
  const rejected = useMemo(() => captures.filter(c => c.status === 'rejected'), [captures])
  const rejectionRate = totalCaptures > 0 ? (rejected.length / totalCaptures) * 100 : 0
  // first pass yield: approved / (approved + rejected)
  const approvedCount = captures.filter(c => c.status === 'approved').length
  const decided = approvedCount + rejected.length
  const firstPassYield = decided > 0 ? (approvedCount / decided) * 100 : 0

  const wasteByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of wastages) m.set(c.product || 'Unknown', (m.get(c.product || 'Unknown') || 0) + (Number(c.quantity) || 0))
    return Array.from(m.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [wastages])

  const wasteByReason = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of wastages) { const r = wasteReason(c.notes); m.set(r, (m.get(r) || 0) + (Number(c.quantity) || 0)) }
    return Array.from(m.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }, [wastages])

  // weekly rejection rate trend
  const rejectionTrend = useMemo(() => {
    const m = new Map<string, { total: number; rej: number }>()
    for (const c of captures) {
      const k = weekKey(c.created_at)
      const e = m.get(k) || { total: 0, rej: 0 }
      e.total += 1
      if (c.status === 'rejected') e.rej += 1
      m.set(k, e)
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ label: k.split('-W')[1] ? `W${k.split('-W')[1]}` : k, value: v.total > 0 ? (v.rej / v.total) * 100 : 0 }))
  }, [captures])

  const costOfWaste = useMemo(() => wastages.reduce((s, c) => s + (Number(c.quantity) || 0) * costForCapture(c), 0), [wastages, costForCapture])

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.rejectionRateLabel')} value={pct(rejectionRate)} sub={tc('pos_factory.rejectionRateSub', { rejected: rejected.length, total: totalCaptures })} accent={rejectionRate > 5 ? RED : GREEN} />
        <KpiCard label={tc('pos_factory.firstPassYieldLabel')} value={pct(firstPassYield)} sub={tc('pos_factory.approvedFirstDecision')} accent={firstPassYield >= 90 ? GREEN : AMBER} />
        <KpiCard label={tc('pos_factory.totalWastageLabel')} value={fmtInt(totalWaste)} sub={tc('pos_factory.unitsWasted')} accent={RED} />
        <KpiCard label={tc('pos_factory.costOfWasteLabel')} value={fmt(currencySymbol, costOfWaste)} sub={tc('pos_factory.wastedMaterialValue')} accent={RED} />
      </div>

      <Section title={tc('pos_factory.wastageByProduct')}>
        <HBarChart data={wasteByProduct} color={RED} currencySymbol={currencySymbol} />
      </Section>

      <Section title={tc('pos_factory.wastageByReason')}>
        {wasteByReason.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noWastageRecorded')}</div>
        ) : (
          <HBarChart data={wasteByReason} color={AMBER} currencySymbol={currencySymbol} />
        )}
      </Section>

      <Section title={tc('pos_factory.rejectionRateTrend')}>
        {rejectionTrend.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.notEnoughTrendData')}</div>
        ) : (
          <LineChart points={rejectionTrend} color={RED} yLabel={tc('pos_factory.pctRejectedPerWeek')} formatY={(n) => pct(n)} />
        )}
      </Section>

      <Section title={tc('pos_factory.nonConformanceLog')}>
        {rejected.length === 0 ? (
          <EmptyState icon="✅" title={tc('pos_factory.noRejectionsTitle')} hint={tc('pos_factory.noRejectionsHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colDate')} /><Th label={tc('pos_factory.colType')} /><Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colQty')} align="right" /><Th label={tc('pos_factory.colReason')} /><Th label={tc('pos_factory.colCorrectiveAction')} />
              </tr></thead>
              <tbody>
                {rejected.map(c => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{shortDate(c.created_at)}</td>
                    <td style={tdStyle}><TypeBadge type={c.type} /></td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{c.product || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(Number(c.quantity) || 0)}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx2)' }}>{c.notes || wasteReason(c.notes)}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{c.approved_by ? tc('pos_factory.reviewedBy', { name: staffName(c.approved_by) || c.approved_by }) : tc('pos_factory.pendingReview')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// INVENTORY SUB-TAB
// ═════════════════════════════════════════════════════════════
function InventoryView({ inv, intakes, currencySymbol }: {
  inv: InventoryItem[]; intakes: FactoryCapture[]; currencySymbol: string
}) {
  const { tc } = useLang()
  const [sortCol, setSortCol] = useState('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const onSort = (c: string) => {
    if (sortCol === c) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(c); setSortDir('asc') }
  }

  // usage rate estimate from intake captures (units consumed per day over 30d)
  const usageByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of intakes) m.set((c.product || '').toLowerCase(), (m.get((c.product || '').toLowerCase()) || 0) + (Number(c.quantity) || 0))
    const out = new Map<string, number>()
    m.forEach((v, k) => out.set(k, v / 30))
    return out
  }, [intakes])

  const rows = useMemo(() => {
    const mapped = inv.map(it => {
      const qty = getQty(it)
      const cost = getCost(it)
      const reorder = getReorder(it)
      const usage = usageByProduct.get((it.name || '').toLowerCase()) || 0
      const daysOfStock = usage > 0 ? qty / usage : Infinity
      return {
        name: it.name || 'Unnamed',
        category: isRaw(it) ? 'Raw' : isFinished(it) ? 'Finished' : (it.category || '—'),
        qty, unit: it.unit || '—', cost, reorder, daysOfStock,
        value: qty * cost,
        low: reorder > 0 && qty <= reorder,
      }
    })
    return [...mapped].sort((a, b) => {
      let av: any = (a as any)[sortCol], bv: any = (b as any)[sortCol]
      if (sortCol === 'daysOfStock') { av = isFinite(a.daysOfStock) ? a.daysOfStock : 1e9; bv = isFinite(b.daysOfStock) ? b.daysOfStock : 1e9 }
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [inv, usageByProduct, sortCol, sortDir])

  const stockValue = useMemo(() => rows.reduce((s, r) => s + r.value, 0), [rows])
  const lowStock = useMemo(() => rows.filter(r => r.low), [rows])
  const rawValue = rows.filter(r => r.category === 'Raw').reduce((s, r) => s + r.value, 0)
  const finishedValue = rows.filter(r => r.category === 'Finished').reduce((s, r) => s + r.value, 0)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.stockValueLabel')} value={fmt(currencySymbol, stockValue)} sub={tc('pos_factory.itemsCount', { n: rows.length })} accent={ACC} />
        <KpiCard label={tc('pos_factory.rawMaterialsValueLabel')} value={fmt(currencySymbol, rawValue)} sub={tc('pos_factory.rawInventory')} accent="#3b82f6" />
        <KpiCard label={tc('pos_factory.finishedGoodsValueLabel')} value={fmt(currencySymbol, finishedValue)} sub={tc('pos_factory.finishedInventory')} accent={GREEN} />
        <KpiCard label={tc('pos_factory.lowStockItemsLabel')} value={fmtInt(lowStock.length)} sub={tc('pos_factory.atBelowReorderPoint')} accent={lowStock.length > 0 ? RED : GREEN} />
      </div>

      {lowStock.length > 0 && (
        <Section title={tc('pos_factory.reorderSuggestions')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lowStock.map(r => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(220,38,38,.06)', border: `1px solid ${RED}33` }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos_factory.reorderHint', { qty: fmtInt(r.qty), unit: r.unit, reorder: fmtInt(r.reorder) })}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title={tc('pos_factory.inventoryTitle')}>
        {rows.length === 0 ? (
          <EmptyState icon="📦" title={tc('pos_factory.noInventoryTitle')} hint={tc('pos_factory.noInventoryHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colName')} col="name" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colCategory')} col="category" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colStock')} col="qty" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colUnit')} />
                <Th label={tc('pos_factory.colCost')} col="cost" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colValue')} col="value" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colReorder')} col="reorder" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colDaysOfStock')} col="daysOfStock" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
              </tr></thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.name} style={{ background: r.low ? 'rgba(220,38,38,.05)' : 'transparent' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.low && <span style={{ color: RED, marginRight: 4 }}>●</span>}{r.name}</td>
                    <td style={tdStyle}>{r.category}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(r.qty)}</td>
                    <td style={tdStyle}>{r.unit}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, r.cost)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{fmt(currencySymbol, r.value)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx3)' }}>{r.reorder > 0 ? fmtInt(r.reorder) : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: isFinite(r.daysOfStock) ? (r.daysOfStock < 7 ? RED : 'var(--tx2)') : 'var(--tx3)' }}>
                      {isFinite(r.daysOfStock) ? `${Math.round(r.daysOfStock)}d` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// DISPATCH SUB-TAB
// ═════════════════════════════════════════════════════════════
function DispatchView({ dispatches, staffName, currencySymbol }: {
  dispatches: FactoryCapture[]; staffName: (id?: string | null) => string | null; currencySymbol: string
}) {
  const { tc } = useLang()
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const onSort = (c: string) => {
    if (sortCol === c) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(c); setSortDir('asc') }
  }

  const rows = useMemo(() => {
    return [...dispatches].sort((a, b) => {
      let av: any, bv: any
      switch (sortCol) {
        case 'product': av = a.product || ''; bv = b.product || ''; break
        case 'quantity': av = Number(a.quantity) || 0; bv = Number(b.quantity) || 0; break
        case 'status': av = a.status; bv = b.status; break
        default: av = new Date(a.created_at).getTime(); bv = new Date(b.created_at).getTime()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [dispatches, sortCol, sortDir])

  const pending = dispatches.filter(d => d.status === 'pending')
  const totalDispatched = dispatches.reduce((s, c) => s + (Number(c.quantity) || 0), 0)

  // weekly dispatch volume
  const weekly = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of dispatches) m.set(weekKey(c.created_at), (m.get(weekKey(c.created_at)) || 0) + (Number(c.quantity) || 0))
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ label: k.split('-W')[1] ? `W${k.split('-W')[1]}` : k, value: v }))
  }, [dispatches])

  const weeklyMax = Math.max(1, ...weekly.map(w => w.value))

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.totalShipmentsLabel')} value={fmtInt(dispatches.length)} sub={tc('pos_factory.dispatchCaptures')} accent="#a855f7" />
        <KpiCard label={tc('pos_factory.unitsDispatchedLabel')} value={fmtInt(totalDispatched)} sub={tc('pos_factory.acrossAllShipments')} accent={ACC} />
        <KpiCard label={tc('pos_factory.pendingDispatchesLabel')} value={fmtInt(pending.length)} sub={tc('pos_factory.awaitingApproval')} accent={pending.length > 0 ? AMBER : GREEN} />
        <KpiCard label={tc('pos_factory.onTimeRateLabel')} value="—" sub={tc('pos_factory.trackingComingSoon')} accent="var(--tx3)" />
      </div>

      <Section title={tc('pos_factory.dispatchVolumeWeekly')}>
        {weekly.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noDispatchesRecorded')}</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, padding: '0 4px' }}>
            {weekly.map(w => (
              <div key={w.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{fmtInt(w.value)}</div>
                <div style={{ width: '70%', maxWidth: 48, background: '#a855f7', borderRadius: '4px 4px 0 0', height: `${(w.value / weeklyMax) * 110}px`, minHeight: 2 }} />
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4 }}>{w.label}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {pending.length > 0 && (
        <Section title={tc('pos_factory.pendingDispatchesTitle')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pending.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: ACC_BG, border: `1px solid ${ACC_BORDER}` }}>
                <span style={{ fontSize: 14 }}>⏳</span>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{d.product || 'Unknown'} — {fmtInt(Number(d.quantity) || 0)} {d.unit || ''}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{d.destination || d.notes || tc('pos_factory.noDestination')}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title={tc('pos_factory.shipmentsTitle')}>
        {rows.length === 0 ? (
          <EmptyState icon="🚚" title={tc('pos_factory.noDispatchesTitle')} hint={tc('pos_factory.noDispatchesHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colDate')} col="created_at" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colProduct')} col="product" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colQty')} col="quantity" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colUnit')} />
                <Th label={tc('pos_factory.colDestination')} />
                <Th label={tc('pos_factory.colStatus')} col="status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colApprovedBy')} />
              </tr></thead>
              <tbody>
                {rows.map(d => (
                  <tr key={d.id}>
                    <td style={tdStyle}>{shortDate(d.created_at)}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{d.product || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(Number(d.quantity) || 0)}</td>
                    <td style={tdStyle}>{d.unit || '—'}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx2)' }}>{d.destination || d.notes || '—'}</td>
                    <td style={tdStyle}><StatusBadge status={d.status} /></td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{staffName(d.approved_by) || d.approved_by || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// COSTING SUB-TAB — crown jewel
// ═════════════════════════════════════════════════════════════
function CostingView({ intakes, outputs, wastages, costForCapture, sellByProduct, totalOutput, currencySymbol }: {
  intakes: FactoryCapture[]; outputs: FactoryCapture[]; wastages: FactoryCapture[]
  costForCapture: (c: FactoryCapture) => number
  sellByProduct: Map<string, number>
  totalOutput: number; currencySymbol: string
}) {
  const { tc } = useLang()
  // assumptions — editable estimates for labor + overhead
  const [laborPerUnit, setLaborPerUnit] = useState(0.5)
  const [overheadPct, setOverheadPct] = useState(15)

  const totalMaterialCost = useMemo(() => intakes.reduce((s, c) => s + (Number(c.quantity) || 0) * costForCapture(c), 0), [intakes, costForCapture])
  const totalLabor = totalOutput * laborPerUnit
  const totalOverhead = (totalMaterialCost + totalLabor) * (overheadPct / 100)
  const totalProductionCost = totalMaterialCost + totalLabor + totalOverhead
  const costPerUnit = totalOutput > 0 ? totalProductionCost / totalOutput : 0
  const wasteCost = useMemo(() => wastages.reduce((s, c) => s + (Number(c.quantity) || 0) * costForCapture(c), 0), [wastages, costForCapture])

  const pieSlices = [
    { label: tc('pos_factory.pieMaterials'), value: totalMaterialCost, color: ACC },
    { label: tc('pos_factory.pieLabor'), value: totalLabor, color: '#3b82f6' },
    { label: tc('pos_factory.pieOverhead'), value: totalOverhead, color: '#a855f7' },
  ].filter(s => s.value > 0)

  // standard vs actual material usage per product
  const stdVsActual = useMemo(() => {
    const m = new Map<string, { actualCost: number; outputQty: number }>()
    for (const c of intakes) {
      const k = c.product || 'Unknown'
      const e = m.get(k) || { actualCost: 0, outputQty: 0 }
      e.actualCost += (Number(c.quantity) || 0) * costForCapture(c)
      m.set(k, e)
    }
    for (const c of outputs) {
      const k = c.product || 'Unknown'
      const e = m.get(k) || { actualCost: 0, outputQty: 0 }
      e.outputQty += Number(c.quantity) || 0
      m.set(k, e)
    }
    return Array.from(m.entries()).map(([product, v]) => {
      const actualPerUnit = v.outputQty > 0 ? v.actualCost / v.outputQty : 0
      const std = sellByProduct.get(product.toLowerCase()) || 0
      return { product, actualPerUnit, standard: std, variance: std > 0 ? actualPerUnit - std : 0 }
    }).filter(r => r.actualPerUnit > 0 || r.standard > 0)
  }, [intakes, outputs, costForCapture, sellByProduct])

  // cost-per-unit trend over time (weekly)
  const costTrend = useMemo(() => {
    const intakeByWeek = new Map<string, number>()
    const outputByWeek = new Map<string, number>()
    for (const c of intakes) intakeByWeek.set(weekKey(c.created_at), (intakeByWeek.get(weekKey(c.created_at)) || 0) + (Number(c.quantity) || 0) * costForCapture(c))
    for (const c of outputs) outputByWeek.set(weekKey(c.created_at), (outputByWeek.get(weekKey(c.created_at)) || 0) + (Number(c.quantity) || 0))
    const weeks = Array.from(new Set([...Array.from(intakeByWeek.keys()), ...Array.from(outputByWeek.keys())])).sort()
    return weeks.map(w => {
      const mat = intakeByWeek.get(w) || 0
      const out = outputByWeek.get(w) || 0
      const labor = out * laborPerUnit
      const oh = (mat + labor) * (overheadPct / 100)
      const cpu = out > 0 ? (mat + labor + oh) / out : 0
      return { label: w.split('-W')[1] ? `W${w.split('-W')[1]}` : w, value: cpu }
    })
  }, [intakes, outputs, costForCapture, laborPerUnit, overheadPct])

  // margin analysis per product
  const margins = useMemo(() => {
    const outByProduct = new Map<string, { cost: number; qty: number }>()
    for (const c of intakes) {
      const k = c.product || 'Unknown'
      const e = outByProduct.get(k) || { cost: 0, qty: 0 }
      e.cost += (Number(c.quantity) || 0) * costForCapture(c)
      outByProduct.set(k, e)
    }
    for (const c of outputs) {
      const k = c.product || 'Unknown'
      const e = outByProduct.get(k) || { cost: 0, qty: 0 }
      e.qty += Number(c.quantity) || 0
      outByProduct.set(k, e)
    }
    return Array.from(outByProduct.entries()).map(([product, v]) => {
      const matPerUnit = v.qty > 0 ? v.cost / v.qty : 0
      const fullCost = matPerUnit + laborPerUnit + (matPerUnit + laborPerUnit) * (overheadPct / 100)
      const sell = sellByProduct.get(product.toLowerCase()) || 0
      const margin = sell > 0 ? ((sell - fullCost) / sell) * 100 : 0
      return { product, fullCost, sell, margin, hasSell: sell > 0 }
    }).filter(r => r.fullCost > 0).sort((a, b) => b.margin - a.margin)
  }, [intakes, outputs, costForCapture, sellByProduct, laborPerUnit, overheadPct])

  const inputStyle: React.CSSProperties = { width: 90, padding: '6px 8px', borderRadius: 8, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit' }

  return (
    <div>
      {/* Assumptions */}
      <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${ACC_BORDER}`, background: ACC_BG, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: ACC }}>{tc('pos_factory.costingAssumptions')}</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ fontSize: 12, color: 'var(--tx2)' }}>
            {tc('pos_factory.laborPerUnit', { symbol: currencySymbol })}
            <input type="number" step="0.01" value={laborPerUnit} onChange={e => setLaborPerUnit(Number(e.target.value) || 0)} style={{ ...inputStyle, marginLeft: 8 }} />
          </label>
          <label style={{ fontSize: 12, color: 'var(--tx2)' }}>
            {tc('pos_factory.overheadPct')}
            <input type="number" step="1" value={overheadPct} onChange={e => setOverheadPct(Number(e.target.value) || 0)} style={{ ...inputStyle, marginLeft: 8 }} />
          </label>
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.adjustToRecompute')}</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.productionCostPerUnit')} value={fmt(currencySymbol, costPerUnit)} sub={tc('pos_factory.materialsLaborOverhead')} accent={ACC} />
        <KpiCard label={tc('pos_factory.totalProductionCost')} value={fmt(currencySymbol, totalProductionCost)} sub={tc('pos_factory.totalOutputUnits', { n: fmtInt(totalOutput) })} accent="var(--tx)" />
        <KpiCard label={tc('pos_factory.materialCostLabel')} value={fmt(currencySymbol, totalMaterialCost)} sub={tc('pos_factory.fromIntakeCaptures')} accent="#3b82f6" />
        <KpiCard label={tc('pos_factory.wastageCostLabel')} value={fmt(currencySymbol, wasteCost)} sub={tc('pos_factory.valueOfWastedMaterials')} accent={RED} />
      </div>

      {/* Material cost breakdown pie */}
      <Section title={tc('pos_factory.costComponentBreakdown')}>
        <PieChart slices={pieSlices} currencySymbol={currencySymbol} />
      </Section>

      {/* Cost per unit trend */}
      <Section title={tc('pos_factory.costPerUnitTrend')}>
        {costTrend.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noTrendData')}</div>
        ) : (
          <LineChart points={costTrend} color={ACC} yLabel={tc('pos_factory.costPerUnitLabel', { symbol: currencySymbol })} formatY={(n) => fmt(currencySymbol, n)} />
        )}
      </Section>

      {/* Standard vs Actual */}
      <Section title={tc('pos_factory.stdVsActualTitle')}>
        {stdVsActual.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noMaterialCostData')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colStandardSellRef')} align="right" /><Th label={tc('pos_factory.colActualPerUnit')} align="right" /><Th label={tc('pos_factory.colVariance')} align="right" />
              </tr></thead>
              <tbody>
                {stdVsActual.map(r => (
                  <tr key={r.product}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.product}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{r.standard > 0 ? fmt(currencySymbol, r.standard) : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, r.actualPerUnit)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: r.standard === 0 ? 'var(--tx3)' : r.variance <= 0 ? GREEN : RED }}>
                      {r.standard === 0 ? '—' : `${r.variance > 0 ? '+' : ''}${fmt(currencySymbol, r.variance)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Margin analysis */}
      <Section title={tc('pos_factory.marginAnalysisTitle')}>
        {margins.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_factory.noMarginData')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colFullCostPerUnit')} align="right" /><Th label={tc('pos_factory.colSellingPrice')} align="right" /><Th label={tc('pos_factory.colMargin')} align="right" />
              </tr></thead>
              <tbody>
                {margins.map(r => (
                  <tr key={r.product}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.product}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, r.fullCost)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{r.hasSell ? fmt(currencySymbol, r.sell) : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: !r.hasSell ? 'var(--tx3)' : r.margin >= 30 ? GREEN : r.margin >= 0 ? AMBER : RED }}>
                      {r.hasSell ? pct(r.margin) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Overhead allocation placeholder */}
      <div style={{ padding: 16, borderRadius: 12, border: '1px dashed var(--b)', background: 'var(--ev)', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx2)', marginBottom: 4 }}>{tc('pos_factory.overheadComingSoonTitle')}</div>
        <div style={{ fontSize: 12, color: 'var(--tx3)', maxWidth: 460, margin: '0 auto' }}>
          {tc('pos_factory.overheadComingSoonDesc', { pct: overheadPct })}
        </div>
      </div>
    </div>
  )
}
