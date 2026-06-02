'use client'
import { useState, useMemo } from 'react'

const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'
const ACC = '#22c55e'
const ACC_BG = 'rgba(34,197,94,.08)'
const ACC_BORDER = 'rgba(34,197,94,.25)'

type SubTab = 'overview' | 'transactions' | 'products' | 'customers' | 'promotions' | 'returns'

interface RetailTabProps {
  currencySymbol: string
  selectedLocation: string
  transactions: any[]
  staff: any[]
  inventory: any[]
}

// ---------- helpers ----------
function fmt(symbol: string, amount: number): string {
  const n = (amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const needsSpace = symbol.length > 1 && /[a-zA-Z]$/.test(symbol)
  return `${symbol}${needsSpace ? ' ' : ''}${n}`
}

function fmtInt(amount: number): string {
  return (amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function pct(n: number): string {
  if (!isFinite(n)) return '0.0%'
  return `${n.toFixed(1)}%`
}

function timeAgo(date: string): string {
  if (!date) return '—'
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function daysSince(date: string): number {
  if (!date) return 9999
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

function shortId(id: string): string {
  if (!id) return '—'
  return id.slice(0, 8).toUpperCase()
}

function fmtDate(date: string): string {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtDateTime(date: string): string {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function isRefunded(tx: any): boolean {
  return tx?.status === 'refunded' || tx?.status === 'returned' || (tx?.total || 0) < 0
}

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// ---------- shared UI ----------
function KpiCard({
  label, value, sub, accent, onClick, active,
}: { label: string; value: string; sub?: string; accent?: string; onClick?: () => void; active?: boolean }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16, borderRadius: 12, background: 'var(--sf)',
        border: `1px solid ${active ? ACC_BORDER : 'var(--b)'}`,
        boxShadow: active ? `0 0 0 1px ${ACC_BORDER}` : 'none',
        cursor: onClick ? 'pointer' : 'default', transition: 'all .15s',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent || 'var(--tx)', marginTop: 6, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function ABCBadge({ cls }: { cls: 'A' | 'B' | 'C' }) {
  const map = {
    A: { c: GREEN, bg: 'rgba(22,163,74,.12)' },
    B: { c: AMBER, bg: 'rgba(202,138,4,.12)' },
    C: { c: RED, bg: 'rgba(220,38,38,.12)' },
  }
  const s = map[cls]
  return (
    <span style={{ fontSize: 11, fontWeight: 800, color: s.c, background: s.bg, padding: '2px 8px', borderRadius: 6 }}>{cls}</span>
  )
}

function StatusPill({ refunded }: { refunded: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase',
      color: refunded ? RED : GREEN, background: refunded ? 'rgba(220,38,38,.1)' : 'rgba(22,163,74,.1)',
    }}>
      {refunded ? 'Refunded' : 'Completed'}
    </span>
  )
}

function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--tx3)' }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx2)' }}>{title}</div>
      {hint && <div style={{ fontSize: 13, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function SortHeader({
  label, col, sortKey, sortDir, onSort, align,
}: { label: string; col: string; sortKey: string; sortDir: 'asc' | 'desc'; onSort: (c: string) => void; align?: 'left' | 'right' }) {
  const active = sortKey === col
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        padding: '10px 12px', textAlign: align || 'left', fontSize: 11, fontWeight: 700, color: active ? ACC : 'var(--tx3)',
        textTransform: 'uppercase', letterSpacing: '.03em', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
      }}
    >
      {label}{active ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
    </th>
  )
}

// ---------- SVG charts ----------
function BarChart({ data, compare, symbol, color }: { data: number[]; compare?: number[]; symbol: string; color: string }) {
  const w = 720, h = 180, pad = 24
  const max = Math.max(1, ...data, ...(compare || []))
  const bw = (w - pad * 2) / data.length
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Hourly sales">
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad} x2={w - pad} y1={h - pad - (h - pad * 2) * g} y2={h - pad - (h - pad * 2) * g} stroke="var(--b)" strokeWidth={1} />
      ))}
      {data.map((v, i) => {
        const bh = ((h - pad * 2) * v) / max
        const cv = compare ? compare[i] : 0
        const ch = ((h - pad * 2) * cv) / max
        const x = pad + i * bw
        return (
          <g key={i}>
            {compare && <rect x={x + bw * 0.15} y={h - pad - ch} width={bw * 0.7} height={ch} fill={color} opacity={0.25} rx={2} />}
            <rect x={x + bw * 0.2} y={h - pad - bh} width={bw * 0.6} height={bh} fill={color} rx={2}>
              <title>{`${i}:00 — ${fmt(symbol, v)}`}</title>
            </rect>
            {i % 3 === 0 && <text x={x + bw / 2} y={h - 8} fontSize={9} fill="var(--tx3)" textAnchor="middle">{i}</text>}
          </g>
        )
      })}
    </svg>
  )
}

function DonutChart({ segments, size = 160 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = size / 2 - 12
  const cx = size / 2, cy = size / 2
  let acc = 0
  const stroke = 22
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--b)" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const frac = seg.value / total
        const dash = 2 * Math.PI * r
        const offset = dash * (1 - frac)
        const rot = (acc / total) * 360 - 90
        acc += seg.value
        if (seg.value <= 0) return null
        return (
          <circle
            key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={dash} strokeDashoffset={offset}
            transform={`rotate(${rot} ${cx} ${cy})`}
          >
            <title>{`${seg.label}: ${seg.value}`}</title>
          </circle>
        )
      })}
      <text x={cx} y={cy - 2} fontSize={20} fontWeight={800} fill="var(--tx)" textAnchor="middle">{fmtInt(total)}</text>
      <text x={cx} y={cy + 16} fontSize={10} fill="var(--tx3)" textAnchor="middle">TOTAL</text>
    </svg>
  )
}

function HBars({ data, symbol }: { data: { label: string; value: number; color?: string }[]; symbol: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
            <span style={{ color: 'var(--tx2)', fontWeight: 600 }}>{d.label}</span>
            <span style={{ color: 'var(--tx3)' }}>{fmt(symbol, d.value)}</span>
          </div>
          <div style={{ height: 10, background: 'var(--ev)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: '100%', background: d.color || ACC, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function StackedBar({ a, b, c }: { a: number; b: number; c: number }) {
  const total = a + b + c || 1
  const w = 100
  return (
    <svg viewBox={`0 0 ${w} 14`} width="100%" height={20}>
      <rect x={0} y={0} width={(a / total) * w} height={14} fill={GREEN} rx={2} />
      <rect x={(a / total) * w} y={0} width={(b / total) * w} height={14} fill={AMBER} />
      <rect x={((a + b) / total) * w} y={0} width={(c / total) * w} height={14} fill={RED} rx={2} />
    </svg>
  )
}

function LineChart({ points, symbol, color }: { points: number[]; symbol: string; color: string }) {
  const w = 480, h = 120, pad = 20
  const max = Math.max(1, ...points)
  const step = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0
  const coords = points.map((v, i) => [pad + i * step, h - pad - ((h - pad * 2) * v) / max])
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c[0]} cy={c[1]} r={3} fill={color}>
          <title>{`Week ${i + 1}: ${fmt(symbol, points[i])}`}</title>
        </circle>
      ))}
    </svg>
  )
}

function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: it.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--tx2)', flex: 1 }}>{it.label}</span>
          {it.value && <span style={{ color: 'var(--tx3)', fontWeight: 600 }}>{it.value}</span>}
        </div>
      ))}
    </div>
  )
}

function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ padding: 18, borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  )
}

// ===================================================================
export default function RetailTab({ currencySymbol, selectedLocation, transactions, staff, inventory }: RetailTabProps) {
  const [subTab, setSubTab] = useState<SubTab>('overview')

  const txns = useMemo(() => Array.isArray(transactions) ? transactions : [], [transactions])
  const inv = useMemo(() => Array.isArray(inventory) ? inventory : [], [inventory])

  // ---- derived: line items flattened across all completed txns ----
  const completedTxns = useMemo(() => txns.filter((t) => !isRefunded(t)), [txns])
  const refundedTxns = useMemo(() => txns.filter((t) => isRefunded(t)), [txns])

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Sub-tab nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--b)', flexWrap: 'wrap' }}>
        {([
          ['overview', 'Overview'],
          ['transactions', 'Transactions'],
          ['products', 'Products'],
          ['customers', 'Customers'],
          ['promotions', 'Promotions'],
          ['returns', 'Returns'],
        ] as [SubTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            style={{
              padding: '10px 16px', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: subTab === key ? ACC : 'var(--tx3)',
              borderBottom: `2px solid ${subTab === key ? ACC : 'transparent'}`,
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'overview' && <OverviewSub symbol={currencySymbol} txns={txns} completedTxns={completedTxns} refundedTxns={refundedTxns} inv={inv} />}
      {subTab === 'transactions' && <TransactionsSub symbol={currencySymbol} txns={txns} staff={staff} />}
      {subTab === 'products' && <ProductsSub symbol={currencySymbol} completedTxns={completedTxns} inv={inv} />}
      {subTab === 'customers' && <CustomersSub symbol={currencySymbol} txns={txns} />}
      {subTab === 'promotions' && <PromotionsSub symbol={currencySymbol} txns={txns} />}
      {subTab === 'returns' && <ReturnsSub symbol={currencySymbol} refundedTxns={refundedTxns} txns={txns} />}
    </div>
  )
}

// ===================================================================
// OVERVIEW
// ===================================================================
function OverviewSub({ symbol, txns, completedTxns, refundedTxns, inv }: {
  symbol: string; txns: any[]; completedTxns: any[]; refundedTxns: any[]; inv: any[]
}) {
  const m = useMemo(() => {
    const todayStart = startOfToday()
    const todayTxns = completedTxns.filter((t) => new Date(t.created_at).getTime() >= todayStart)
    const todaySales = todayTxns.reduce((s, t) => s + (t.total || 0), 0)

    let totalItems = 0, totalRevenue = 0, totalCost = 0
    const sellerCount: Record<string, number> = {}
    const customers = new Set<string>()
    const payments: Record<string, number> = { cash: 0, card: 0, mobile: 0, other: 0 }
    const categoryRev: Record<string, number> = {}
    const hourly = new Array(24).fill(0)
    const hourlyPrev = new Array(24).fill(0)
    const dayStart = startOfToday()
    const prevDayStart = dayStart - 86400000

    completedTxns.forEach((t) => {
      const items = Array.isArray(t.pos_items) ? t.pos_items : []
      items.forEach((it: any) => {
        const qty = it.qty || 0
        totalItems += qty
        const lineRev = (it.unit_price || 0) * qty
        const lineCost = (it.cost_price || 0) * qty
        totalRevenue += lineRev
        totalCost += lineCost
        sellerCount[it.name] = (sellerCount[it.name] || 0) + qty
        const invItem = inv.find((iv) => iv.name === it.name || iv.sku === it.sku)
        const cat = invItem?.category || 'Uncategorized'
        categoryRev[cat] = (categoryRev[cat] || 0) + lineRev
      })
      const phone = t.pos_customers?.phone
      if (phone) customers.add(phone)
      const pt = (t.payment_type || 'other').toLowerCase()
      if (pt.includes('cash')) payments.cash += t.total || 0
      else if (pt.includes('card')) payments.card += t.total || 0
      else if (pt.includes('mobile') || pt.includes('wallet')) payments.mobile += t.total || 0
      else payments.other += t.total || 0

      const ts = new Date(t.created_at).getTime()
      const hr = new Date(t.created_at).getHours()
      if (ts >= dayStart) hourly[hr] += t.total || 0
      else if (ts >= prevDayStart && ts < dayStart) hourlyPrev[hr] += t.total || 0
    })

    const basket = completedTxns.length ? completedTxns.reduce((s, t) => s + (t.total || 0), 0) / completedTxns.length : 0
    const itemsPerTx = completedTxns.length ? totalItems / completedTxns.length : 0
    const grossMargin = totalRevenue ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0
    const refundRate = txns.length ? (refundedTxns.length / txns.length) * 100 : 0
    const topSeller = Object.entries(sellerCount).sort((a, b) => b[1] - a[1])[0]

    return {
      todaySales, basket, itemsPerTx, grossMargin, refundRate,
      topSeller: topSeller ? topSeller[0] : '—', topSellerQty: topSeller ? topSeller[1] : 0,
      totalItems, uniqueCustomers: customers.size, payments,
      categoryRev: Object.entries(categoryRev).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8),
      hourly, hourlyPrev, todayCount: todayTxns.length,
    }
  }, [completedTxns, refundedTxns, txns, inv])

  if (!txns.length) return <EmptyState icon="📦" title="No retail transactions yet" hint="Sales will appear here once the POS records transactions." />

  const cashCard = m.payments.cash + m.payments.card
  const cashRatio = cashCard ? (m.payments.cash / cashCard) * 100 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiCard label="Today's Sales" value={fmt(symbol, m.todaySales)} sub={`${m.todayCount} transactions`} accent={ACC} />
        <KpiCard label="Avg Basket Size" value={fmt(symbol, m.basket)} sub="per transaction" />
        <KpiCard label="Items / Transaction" value={m.itemsPerTx.toFixed(1)} sub="units" />
        <KpiCard label="Gross Margin" value={pct(m.grossMargin)} accent={m.grossMargin >= 30 ? GREEN : AMBER} sub="across all sales" />
        <KpiCard label="Refund Rate" value={pct(m.refundRate)} accent={m.refundRate > 5 ? RED : GREEN} sub={`${refundedTxns.length} refunds`} />
        <KpiCard label="Top Seller" value={m.topSeller.length > 14 ? m.topSeller.slice(0, 14) + '…' : m.topSeller} sub={`${fmtInt(m.topSellerQty)} units sold`} accent={ACC} />
      </div>

      <Card title="Hourly Sales — Today vs Yesterday">
        <BarChart data={m.hourly} compare={m.hourlyPrev} symbol={symbol} color={ACC} />
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--tx3)', marginTop: 8 }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: ACC, borderRadius: 2, marginRight: 5 }} />Today</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: ACC, opacity: 0.25, borderRadius: 2, marginRight: 5 }} />Yesterday</span>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        <Card title="Payment Methods">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <DonutChart segments={[
              { label: 'Cash', value: Math.round(m.payments.cash), color: GREEN },
              { label: 'Card', value: Math.round(m.payments.card), color: '#3b82f6' },
              { label: 'Mobile', value: Math.round(m.payments.mobile), color: '#a855f7' },
              { label: 'Other', value: Math.round(m.payments.other), color: AMBER },
            ]} />
            <div style={{ flex: 1, minWidth: 130 }}>
              <Legend items={[
                { label: 'Cash', color: GREEN, value: fmt(symbol, m.payments.cash) },
                { label: 'Card', color: '#3b82f6', value: fmt(symbol, m.payments.card) },
                { label: 'Mobile', color: '#a855f7', value: fmt(symbol, m.payments.mobile) },
                { label: 'Other', color: AMBER, value: fmt(symbol, m.payments.other) },
              ]} />
            </div>
          </div>
        </Card>

        <Card title="Category Revenue">
          {m.categoryRev.length
            ? <HBars data={m.categoryRev} symbol={symbol} />
            : <EmptyState icon="🏷️" title="No category data" />}
        </Card>
      </div>

      <Card title="Quick Stats">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <QuickStat label="Total Items Sold" value={fmtInt(m.totalItems)} />
          <QuickStat label="Unique Customers" value={fmtInt(m.uniqueCustomers)} />
          <QuickStat label="Cash vs Card" value={`${cashRatio.toFixed(0)}% / ${(100 - cashRatio).toFixed(0)}%`} />
          <QuickStat label="Completed Sales" value={fmtInt(completedTxns.length)} />
        </div>
      </Card>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 10, background: 'var(--ev)', border: '1px solid var(--b)' }}>
      <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.03em' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--tx)', marginTop: 4 }}>{value}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)',
  color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
}
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }
const thStyle: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--tx3)',
  textTransform: 'uppercase', letterSpacing: '.03em', whiteSpace: 'nowrap',
}
const tdStyle: React.CSSProperties = { padding: '10px 12px', fontSize: 13, color: 'var(--tx2)', borderTop: '1px solid var(--b)' }

// ===================================================================
// TRANSACTIONS
// ===================================================================
function TransactionsSub({ symbol, txns, staff }: { symbol: string; txns: any[]; staff: any[] }) {
  const [search, setSearch] = useState('')
  const [payFilter, setPayFilter] = useState('all')
  const [cashierFilter, setCashierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const cashiers = useMemo(() => {
    const set = new Set<string>()
    txns.forEach((t) => { if (t.cashier?.name) set.add(t.cashier.name) })
    return Array.from(set)
  }, [txns])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return txns.filter((t) => {
      if (payFilter !== 'all' && (t.payment_type || '').toLowerCase() !== payFilter) return false
      if (cashierFilter !== 'all' && t.cashier?.name !== cashierFilter) return false
      if (statusFilter === 'completed' && isRefunded(t)) return false
      if (statusFilter === 'refunded' && !isRefunded(t)) return false
      const ts = new Date(t.created_at).getTime()
      if (fromDate && ts < new Date(fromDate).getTime()) return false
      if (toDate && ts > new Date(toDate).getTime() + 86400000) return false
      if (q) {
        const inId = shortId(t.id).toLowerCase().includes(q) || (t.id || '').toLowerCase().includes(q)
        const inCust = (t.pos_customers?.name || '').toLowerCase().includes(q) || (t.pos_customers?.phone || '').includes(q)
        const inProd = (Array.isArray(t.pos_items) ? t.pos_items : []).some((it: any) => (it.name || '').toLowerCase().includes(q))
        if (!inId && !inCust && !inProd) return false
      }
      return true
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [txns, search, payFilter, cashierFilter, statusFilter, fromDate, toDate])

  const z = useMemo(() => {
    let sales = 0, refunds = 0, cash = 0, card = 0
    filtered.forEach((t) => {
      if (isRefunded(t)) refunds += Math.abs(t.total || 0)
      else sales += t.total || 0
      const pt = (t.payment_type || '').toLowerCase()
      if (pt.includes('cash')) cash += t.total || 0
      else if (pt.includes('card')) card += t.total || 0
    })
    return { sales, refunds, cash, card, net: sales - refunds }
  }, [filtered])

  if (!txns.length) return <EmptyState icon="🧾" title="No transactions" hint="Recorded sales will be listed here." />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search receipt, product, customer…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 220 }} />
        <select value={payFilter} onChange={(e) => setPayFilter(e.target.value)} style={selectStyle}>
          <option value="all">All payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="mobile">Mobile</option>
        </select>
        <select value={cashierFilter} onChange={(e) => setCashierFilter(e.target.value)} style={selectStyle}>
          <option value="all">All cashiers</option>
          {cashiers.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
        </select>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
      </div>

      <Card title="Z-Report — End of Day Summary" right={<span style={{ fontSize: 12, color: 'var(--tx3)' }}>{filtered.length} txns</span>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <ZStat label="Total Sales" value={fmt(symbol, z.sales)} accent={GREEN} />
          <ZStat label="Total Refunds" value={fmt(symbol, z.refunds)} accent={RED} />
          <ZStat label="Net" value={fmt(symbol, z.net)} accent={ACC} />
          <ZStat label="Cash Expected" value={fmt(symbol, z.cash)} />
          <ZStat label="Card Totals" value={fmt(symbol, z.card)} />
        </div>
      </Card>

      <div style={{ borderRadius: 12, border: '1px solid var(--b)', overflow: 'hidden', background: 'var(--sf)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ev)' }}>
                <th style={thStyle}>Receipt #</th>
                <th style={thStyle}>Date / Time</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Items</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
                <th style={thStyle}>Payment</th>
                <th style={thStyle}>Cashier</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const items = Array.isArray(t.pos_items) ? t.pos_items : []
                const itemCount = items.reduce((s: number, it: any) => s + (it.qty || 0), 0)
                const open = expanded === t.id
                return (
                  <FragmentRow key={t.id} open={open}>
                    <tr onClick={() => setExpanded(open ? null : t.id)} style={{ cursor: 'pointer' }}>
                      <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--tx)' }}>{shortId(t.id)}</td>
                      <td style={tdStyle}>{fmtDateTime(t.created_at)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{itemCount}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: isRefunded(t) ? RED : 'var(--tx)' }}>{fmt(symbol, t.total || 0)}</td>
                      <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{t.payment_type || '—'}</td>
                      <td style={tdStyle}>{t.cashier?.name || '—'}</td>
                      <td style={tdStyle}><StatusPill refunded={isRefunded(t)} /></td>
                    </tr>
                    {open && (
                      <tr>
                        <td colSpan={7} style={{ padding: 0, borderTop: '1px solid var(--b)', background: 'var(--ev)' }}>
                          <TxnDetail t={t} symbol={symbol} />
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                )
              })}
            </tbody>
          </table>
        </div>
        {!filtered.length && <EmptyState icon="🔍" title="No matching transactions" hint="Try adjusting your filters." />}
      </div>
    </div>
  )
}

function FragmentRow({ children }: { children: React.ReactNode; open: boolean }) {
  return <>{children}</>
}

function ZStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 10, background: 'var(--ev)', border: '1px solid var(--b)' }}>
      <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: accent || 'var(--tx)', marginTop: 3 }}>{value}</div>
    </div>
  )
}

function TxnDetail({ t, symbol }: { t: any; symbol: string }) {
  const items = Array.isArray(t.pos_items) ? t.pos_items : []
  return (
    <div style={{ padding: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, padding: '6px 8px' }}>Item</th>
            <th style={{ ...thStyle, padding: '6px 8px', textAlign: 'right' }}>Qty</th>
            <th style={{ ...thStyle, padding: '6px 8px', textAlign: 'right' }}>Unit</th>
            <th style={{ ...thStyle, padding: '6px 8px', textAlign: 'right' }}>Cost</th>
            <th style={{ ...thStyle, padding: '6px 8px', textAlign: 'right' }}>Margin</th>
            <th style={{ ...thStyle, padding: '6px 8px', textAlign: 'right' }}>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it: any, i: number) => {
            const qty = it.qty || 0
            const lineTotal = (it.unit_price || 0) * qty
            const lineCost = (it.cost_price || 0) * qty
            const margin = lineTotal ? ((lineTotal - lineCost) / lineTotal) * 100 : 0
            return (
              <tr key={i}>
                <td style={{ ...tdStyle, padding: '6px 8px', color: 'var(--tx)' }}>{it.name}</td>
                <td style={{ ...tdStyle, padding: '6px 8px', textAlign: 'right' }}>{qty}</td>
                <td style={{ ...tdStyle, padding: '6px 8px', textAlign: 'right' }}>{fmt(symbol, it.unit_price || 0)}</td>
                <td style={{ ...tdStyle, padding: '6px 8px', textAlign: 'right' }}>{fmt(symbol, it.cost_price || 0)}</td>
                <td style={{ ...tdStyle, padding: '6px 8px', textAlign: 'right', color: margin >= 30 ? GREEN : margin >= 15 ? AMBER : RED, fontWeight: 600 }}>{pct(margin)}</td>
                <td style={{ ...tdStyle, padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--tx)' }}>{fmt(symbol, lineTotal)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: 'var(--tx2)' }}>
        <span>Subtotal: <b style={{ color: 'var(--tx)' }}>{fmt(symbol, t.subtotal || 0)}</b></span>
        <span>Discount: <b style={{ color: t.discount_amount ? RED : 'var(--tx)' }}>{fmt(symbol, t.discount_amount || 0)}</b></span>
        <span>Tax: <b style={{ color: 'var(--tx)' }}>{fmt(symbol, t.tax_amount || 0)}</b></span>
        <span>Payment: <b style={{ color: 'var(--tx)', textTransform: 'capitalize' }}>{t.payment_type || '—'}</b></span>
        <span>Total: <b style={{ color: ACC }}>{fmt(symbol, t.total || 0)}</b></span>
        {t.pos_customers?.name && <span>Customer: <b style={{ color: 'var(--tx)' }}>{t.pos_customers.name}</b></span>}
      </div>
    </div>
  )
}

// ===================================================================
// PRODUCTS — the crown jewel
// ===================================================================
interface ProductRow {
  id: string; name: string; sku: string; category: string
  stock: number; price: number; cost: number; margin: number
  unitsSold30: number; revenue30: number; sellThrough: number
  gmroi: number; daysSinceSold: number; deadStock: boolean
  abc: 'A' | 'B' | 'C'; carryingCost: number; revenueAll: number
}

function ProductsSub({ symbol, completedTxns, inv }: { symbol: string; completedTxns: any[]; inv: any[] }) {
  const [sortKey, setSortKey] = useState('revenue30')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const onSort = (col: string) => {
    if (sortKey === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(col); setSortDir('desc') }
  }

  const { rows, abcDist, valuation, deadStock } = useMemo(() => {
    const cutoff30 = Date.now() - 30 * 86400000
    const sold30: Record<string, { qty: number; rev: number; cost: number }> = {}
    const soldAll: Record<string, number> = {}

    completedTxns.forEach((t) => {
      const ts = new Date(t.created_at).getTime()
      const items = Array.isArray(t.pos_items) ? t.pos_items : []
      items.forEach((it: any) => {
        const key = it.sku || it.name
        const qty = it.qty || 0
        const rev = (it.unit_price || 0) * qty
        soldAll[key] = (soldAll[key] || 0) + rev
        if (ts >= cutoff30) {
          if (!sold30[key]) sold30[key] = { qty: 0, rev: 0, cost: 0 }
          sold30[key].qty += qty
          sold30[key].rev += rev
          sold30[key].cost += (it.cost_price || 0) * qty
        }
      })
    })

    let prelim: ProductRow[] = inv.map((iv) => {
      const key = iv.sku || iv.name
      const s30 = sold30[key] || { qty: 0, rev: 0, cost: 0 }
      const price = iv.sale_price || 0
      const cost = iv.cost_price || 0
      const stock = iv.stock_qty || 0
      const margin = price ? ((price - cost) / price) * 100 : 0
      const grossMarginDollar = s30.rev - s30.cost
      const avgInvCost = (stock * cost) || (cost || 1)
      const gmroi = avgInvCost ? grossMarginDollar / avgInvCost : 0
      const totalAvail = stock + s30.qty
      const sellThrough = totalAvail ? (s30.qty / totalAvail) * 100 : 0
      const daysSinceSold = daysSince(iv.last_sold_at)
      const deadStockFlag = daysSinceSold >= 90 && stock > 0
      return {
        id: iv.id, name: iv.name, sku: iv.sku || '—', category: iv.category || 'Uncategorized',
        stock, price, cost, margin, unitsSold30: s30.qty, revenue30: s30.rev,
        sellThrough, gmroi, daysSinceSold, deadStock: deadStockFlag, abc: 'C' as const,
        carryingCost: stock * cost, revenueAll: soldAll[key] || 0,
      }
    })

    // ABC classification by all-time revenue
    const byRev = [...prelim].sort((a, b) => b.revenueAll - a.revenueAll)
    const totalRev = byRev.reduce((s, r) => s + r.revenueAll, 0) || 1
    let cum = 0
    const cls: Record<string, 'A' | 'B' | 'C'> = {}
    byRev.forEach((r) => {
      cum += r.revenueAll
      const cumPct = (cum / totalRev) * 100
      if (cumPct <= 80) cls[r.id] = 'A'
      else if (cumPct <= 95) cls[r.id] = 'B'
      else cls[r.id] = 'C'
    })
    prelim = prelim.map((r) => ({ ...r, abc: cls[r.id] || 'C' }))

    const abcDist = { A: 0, B: 0, C: 0 }
    prelim.forEach((r) => { abcDist[r.abc] += 1 })

    const valuation = {
      cost: prelim.reduce((s, r) => s + r.stock * r.cost, 0),
      retail: prelim.reduce((s, r) => s + r.stock * r.price, 0),
      units: prelim.reduce((s, r) => s + r.stock, 0),
    }

    const deadStock = prelim.filter((r) => r.deadStock).sort((a, b) => b.daysSinceSold - a.daysSinceSold)

    return { rows: prelim, abcDist, valuation, deadStock }
  }, [completedTxns, inv])

  const categories = useMemo(() => Array.from(new Set(rows.map((r) => r.category))), [rows])

  const display = useMemo(() => {
    const q = search.trim().toLowerCase()
    let r = rows.filter((row) => {
      if (catFilter !== 'all' && row.category !== catFilter) return false
      if (q && !row.name.toLowerCase().includes(q) && !row.sku.toLowerCase().includes(q)) return false
      return true
    })
    r = [...r].sort((a, b) => {
      const av = (a as any)[sortKey], bv = (b as any)[sortKey]
      let cmp: number
      if (typeof av === 'string') cmp = av.localeCompare(bv)
      else cmp = (av || 0) - (bv || 0)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return r
  }, [rows, search, catFilter, sortKey, sortDir])

  if (!inv.length) return <EmptyState icon="📦" title="No inventory" hint="Add products to the catalog to unlock analytics." />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        <Card title="ABC Analysis">
          <StackedBar a={abcDist.A} b={abcDist.B} c={abcDist.C} />
          <div style={{ marginTop: 12 }}>
            <Legend items={[
              { label: 'A — top revenue (~80%)', color: GREEN, value: `${abcDist.A} SKUs` },
              { label: 'B — mid revenue', color: AMBER, value: `${abcDist.B} SKUs` },
              { label: 'C — long tail', color: RED, value: `${abcDist.C} SKUs` },
            ]} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 10, lineHeight: 1.5 }}>
            Focus reorder budget on A items — they drive most of your revenue. Trim C-class slow movers.
          </div>
        </Card>

        <Card title="Inventory Valuation">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ValRow label="At Cost" value={fmt(symbol, valuation.cost)} accent={AMBER} />
            <ValRow label="At Retail" value={fmt(symbol, valuation.retail)} accent={ACC} />
            <ValRow label="Potential Margin" value={fmt(symbol, valuation.retail - valuation.cost)} accent={GREEN} />
            <ValRow label="Units in Stock" value={fmtInt(valuation.units)} />
          </div>
        </Card>

        <Card title="Dead Stock Alert" right={<span style={{ fontSize: 12, color: deadStock.length ? RED : GREEN, fontWeight: 700 }}>{deadStock.length}</span>}>
          {deadStock.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
              {deadStock.slice(0, 8).map((r) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 8, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.18)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{r.daysSinceSold === 9999 ? 'never sold' : `${r.daysSinceSold}d since last sale`} · {r.stock} in stock</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: RED }}>{fmt(symbol, r.carryingCost)}</div>
                </div>
              ))}
            </div>
          ) : <EmptyState icon="✅" title="No dead stock" hint="Everything is moving." />}
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search product or SKU…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 220 }} />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selectStyle}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{display.length} products</span>
      </div>

      <div style={{ borderRadius: 12, border: '1px solid var(--b)', overflow: 'hidden', background: 'var(--sf)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ev)' }}>
                <th style={{ ...thStyle, width: 44 }}>ABC</th>
                <SortHeader label="Name" col="name" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="SKU" col="sku" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Category" col="category" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Stock" col="stock" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Price" col="price" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Cost" col="cost" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Margin %" col="margin" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Sold 30d" col="unitsSold30" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Rev 30d" col="revenue30" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Sell-Thru" col="sellThrough" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="GMROI" col="gmroi" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Stock Age" col="daysSinceSold" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              </tr>
            </thead>
            <tbody>
              {display.map((r) => {
                const lowStock = r.stock <= (inv.find((i) => i.id === r.id)?.low_stock_threshold || 0) && r.stock > 0
                return (
                  <tr key={r.id} style={{ background: r.deadStock ? 'rgba(220,38,38,.05)' : 'transparent' }}>
                    <td style={tdStyle}><ABCBadge cls={r.abc} /></td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--tx)' }}>
                      {r.name}
                      {lowStock && <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, marginLeft: 6 }}>LOW</span>}
                      {r.deadStock && <span style={{ fontSize: 10, fontWeight: 700, color: RED, marginLeft: 6 }}>DEAD</span>}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)', fontFamily: 'monospace', fontSize: 12 }}>{r.sku}</td>
                    <td style={tdStyle}>{r.category}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: lowStock ? AMBER : 'var(--tx2)', fontWeight: lowStock ? 700 : 400 }}>{r.stock}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(symbol, r.price)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(symbol, r.cost)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: r.margin >= 30 ? GREEN : r.margin >= 15 ? AMBER : RED, fontWeight: 600 }}>{pct(r.margin)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(r.unitsSold30)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: 'var(--tx)' }}>{fmt(symbol, r.revenue30)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{pct(r.sellThrough)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: r.gmroi >= 2 ? GREEN : r.gmroi >= 1 ? AMBER : RED, fontWeight: 600 }}>{r.gmroi.toFixed(2)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: r.daysSinceSold >= 90 ? RED : r.daysSinceSold >= 30 ? AMBER : 'var(--tx3)' }}>{r.daysSinceSold === 9999 ? 'never' : `${r.daysSinceSold}d`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!display.length && <EmptyState icon="🔍" title="No matching products" />}
      </div>

      <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.6, padding: '0 4px' }}>
        <b style={{ color: 'var(--tx2)' }}>GMROI</b> = gross margin $ ÷ average inventory cost. Above 2.0 (green) is healthy; below 1.0 (red) means inventory isn't earning its keep.
        <b style={{ color: 'var(--tx2)' }}> Sell-through</b> = units sold ÷ (units sold + stock on hand) over the last 30 days.
      </div>
    </div>
  )
}

function ValRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--b)' }}>
      <span style={{ fontSize: 13, color: 'var(--tx2)' }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: accent || 'var(--tx)' }}>{value}</span>
    </div>
  )
}

// ===================================================================
// CUSTOMERS
// ===================================================================
interface CustomerRow {
  phone: string; name: string; orders: number; spend: number; ltv: number
  lastVisit: string; avgBasket: number; segment: 'New' | 'Returning' | 'Loyal' | 'Lapsed'
  history: { id: string; date: string; total: number; items: number }[]
}

function CustomersSub({ symbol, txns }: { symbol: string; txns: any[] }) {
  const [sortKey, setSortKey] = useState('spend')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [segFilter, setSegFilter] = useState('all')

  const onSort = (col: string) => {
    if (sortKey === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(col); setSortDir('desc') }
  }

  const { customers, segments } = useMemo(() => {
    const map: Record<string, CustomerRow> = {}
    txns.forEach((t) => {
      const phone = t.pos_customers?.phone
      if (!phone || isRefunded(t)) return
      if (!map[phone]) {
        map[phone] = {
          phone, name: t.pos_customers?.name || 'Guest', orders: 0, spend: 0, ltv: 0,
          lastVisit: t.created_at, avgBasket: 0, segment: 'New', history: [],
        }
      }
      const c = map[phone]
      c.orders += 1
      c.spend += t.total || 0
      if (new Date(t.created_at).getTime() > new Date(c.lastVisit).getTime()) c.lastVisit = t.created_at
      const items = Array.isArray(t.pos_items) ? t.pos_items : []
      c.history.push({ id: t.id, date: t.created_at, total: t.total || 0, items: items.reduce((s: number, it: any) => s + (it.qty || 0), 0) })
    })

    const list = Object.values(map).map((c) => {
      c.avgBasket = c.orders ? c.spend / c.orders : 0
      c.ltv = c.spend
      const lapsedDays = daysSince(c.lastVisit)
      if (lapsedDays > 90) c.segment = 'Lapsed'
      else if (c.orders >= 6) c.segment = 'Loyal'
      else if (c.orders >= 2) c.segment = 'Returning'
      else c.segment = 'New'
      c.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return c
    })

    const segments = { New: 0, Returning: 0, Loyal: 0, Lapsed: 0 }
    list.forEach((c) => { segments[c.segment] += 1 })

    return { customers: list, segments }
  }, [txns])

  const display = useMemo(() => {
    let r = customers.filter((c) => segFilter === 'all' || c.segment === segFilter)
    r = [...r].sort((a, b) => {
      const av = (a as any)[sortKey], bv = (b as any)[sortKey]
      let cmp: number
      if (sortKey === 'lastVisit') cmp = new Date(av).getTime() - new Date(bv).getTime()
      else if (typeof av === 'string') cmp = av.localeCompare(bv)
      else cmp = (av || 0) - (bv || 0)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return r
  }, [customers, segFilter, sortKey, sortDir])

  const topSpenders = useMemo(() => [...customers].sort((a, b) => b.spend - a.spend).slice(0, 5), [customers])

  if (!customers.length) return <EmptyState icon="👥" title="No customer data" hint="Attach customers to transactions to build profiles." />

  const segColors: Record<string, string> = { New: ACC, Returning: '#3b82f6', Loyal: GREEN, Lapsed: RED }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        <Card title="Customer Segments">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <DonutChart segments={[
              { label: 'New', value: segments.New, color: ACC },
              { label: 'Returning', value: segments.Returning, color: '#3b82f6' },
              { label: 'Loyal', value: segments.Loyal, color: GREEN },
              { label: 'Lapsed', value: segments.Lapsed, color: RED },
            ]} />
            <div style={{ flex: 1, minWidth: 130 }}>
              <Legend items={[
                { label: 'New (1 order)', color: ACC, value: `${segments.New}` },
                { label: 'Returning (2-5)', color: '#3b82f6', value: `${segments.Returning}` },
                { label: 'Loyal (6+)', color: GREEN, value: `${segments.Loyal}` },
                { label: 'Lapsed (90d+)', color: RED, value: `${segments.Lapsed}` },
              ]} />
            </div>
          </div>
        </Card>

        <Card title="Top Spenders">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topSpenders.map((c, i) => (
              <div key={c.phone} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, background: 'var(--ev)' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: ACC, width: 20 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{c.phone} · {c.orders} orders</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>{fmt(symbol, c.spend)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={segFilter} onChange={(e) => setSegFilter(e.target.value)} style={selectStyle}>
          <option value="all">All segments</option>
          <option value="New">New</option>
          <option value="Returning">Returning</option>
          <option value="Loyal">Loyal</option>
          <option value="Lapsed">Lapsed</option>
        </select>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{display.length} customers</span>
      </div>

      <div style={{ borderRadius: 12, border: '1px solid var(--b)', overflow: 'hidden', background: 'var(--sf)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ev)' }}>
                <SortHeader label="Name" col="name" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Segment</th>
                <SortHeader label="Orders" col="orders" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Total Spend" col="spend" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Avg Basket" col="avgBasket" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortHeader label="Last Visit" col="lastVisit" align="right" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              </tr>
            </thead>
            <tbody>
              {display.map((c) => {
                const open = expanded === c.phone
                return (
                  <FragmentRow key={c.phone} open={open}>
                    <tr onClick={() => setExpanded(open ? null : c.phone)} style={{ cursor: 'pointer' }}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--tx)' }}>{c.name}</td>
                      <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{c.phone}</td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: segColors[c.segment], background: `${segColors[c.segment]}1a`, padding: '2px 8px', borderRadius: 6 }}>{c.segment}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{c.orders}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: 'var(--tx)' }}>{fmt(symbol, c.spend)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(symbol, c.avgBasket)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx3)' }}>{timeAgo(c.lastVisit)}</td>
                    </tr>
                    {open && (
                      <tr>
                        <td colSpan={7} style={{ padding: 16, borderTop: '1px solid var(--b)', background: 'var(--ev)' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>Purchase History — LTV {fmt(symbol, c.ltv)}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {c.history.map((h) => (
                              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                                <span style={{ color: 'var(--tx3)' }}>{shortId(h.id)} · {fmtDateTime(h.date)}</span>
                                <span style={{ color: 'var(--tx2)' }}>{h.items} items · <b style={{ color: 'var(--tx)' }}>{fmt(symbol, h.total)}</b></span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// PROMOTIONS
// ===================================================================
function PromotionsSub({ symbol, txns }: { symbol: string; txns: any[] }) {
  const m = useMemo(() => {
    const completed = txns.filter((t) => !isRefunded(t))
    let totalDiscount = 0, discountedRev = 0, nonDiscountedRev = 0, discountedCount = 0
    const itemDiscounts: Record<string, number> = {}
    completed.forEach((t) => {
      const disc = t.discount_amount || 0
      if (disc > 0) {
        discountedCount += 1
        totalDiscount += disc
        discountedRev += t.total || 0
        const items = Array.isArray(t.pos_items) ? t.pos_items : []
        items.forEach((it: any) => { itemDiscounts[it.name] = (itemDiscounts[it.name] || 0) + disc / (items.length || 1) })
      } else {
        nonDiscountedRev += t.total || 0
      }
    })
    const subtotalSum = completed.reduce((s, t) => s + (t.subtotal || t.total || 0), 0)
    const avgDiscountPct = subtotalSum ? (totalDiscount / subtotalSum) * 100 : 0
    const mostDiscounted = Object.entries(itemDiscounts).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6)
    return { totalDiscount, avgDiscountPct, discountedCount, discountedRev, nonDiscountedRev, mostDiscounted, completedCount: completed.length }
  }, [txns])

  if (!txns.length) return <EmptyState icon="🏷️" title="No promotion data" hint="Discounts applied at checkout will be analyzed here." />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiCard label="Total Discounts" value={fmt(symbol, m.totalDiscount)} accent={AMBER} />
        <KpiCard label="Avg Discount %" value={pct(m.avgDiscountPct)} />
        <KpiCard label="Discounted Txns" value={fmtInt(m.discountedCount)} sub={`of ${m.completedCount} sales`} />
        <KpiCard label="Discount Rate" value={pct(m.completedCount ? (m.discountedCount / m.completedCount) * 100 : 0)} accent={ACC} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        <Card title="Discount Impact">
          <HBars data={[
            { label: 'Discounted revenue', value: m.discountedRev, color: AMBER },
            { label: 'Full-price revenue', value: m.nonDiscountedRev, color: ACC },
          ]} symbol={symbol} />
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 12, lineHeight: 1.5 }}>
            Compares revenue from transactions that used a discount against full-price sales.
          </div>
        </Card>

        <Card title="Most Discounted Items">
          {m.mostDiscounted.length ? <HBars data={m.mostDiscounted} symbol={symbol} /> : <EmptyState icon="🏷️" title="No discounted items" />}
        </Card>
      </div>

      <Card title="Create a Promotion">
        <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed var(--b)', borderRadius: 10, background: ACC_BG }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>✨</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>Promotion builder coming soon</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>Schedule percentage, fixed-amount, and BOGO offers across products and categories.</div>
        </div>
      </Card>
    </div>
  )
}

// ===================================================================
// RETURNS
// ===================================================================
function ReturnsSub({ symbol, refundedTxns, txns }: { symbol: string; refundedTxns: any[]; txns: any[] }) {
  const m = useMemo(() => {
    const totalRefund = refundedTxns.reduce((s, t) => s + Math.abs(t.total || 0), 0)
    const returnRate = txns.length ? (refundedTxns.length / txns.length) * 100 : 0

    const productReturns: Record<string, { qty: number; amount: number }> = {}
    const reasons: Record<string, number> = {}
    refundedTxns.forEach((t) => {
      const items = Array.isArray(t.pos_items) ? t.pos_items : []
      items.forEach((it: any) => {
        if (!productReturns[it.name]) productReturns[it.name] = { qty: 0, amount: 0 }
        productReturns[it.name].qty += Math.abs(it.qty || 0)
        productReturns[it.name].amount += Math.abs((it.unit_price || 0) * (it.qty || 0))
      })
      const note = (t.notes || t.refund_reason || '').toLowerCase()
      let reason = 'Unspecified'
      if (note.includes('defect') || note.includes('faulty') || note.includes('broken')) reason = 'Defective'
      else if (note.includes('wrong') || note.includes('size') || note.includes('fit')) reason = 'Wrong item / size'
      else if (note.includes('change') || note.includes('mind')) reason = 'Changed mind'
      else if (note.includes('damage')) reason = 'Damaged'
      reasons[reason] = (reasons[reason] || 0) + 1
    })

    const topReturned = Object.entries(productReturns).map(([label, v]) => ({ label, value: v.amount, qty: v.qty })).sort((a, b) => b.value - a.value).slice(0, 6)
    const reasonList = Object.entries(reasons).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)

    // weekly trend last 8 weeks
    const weekly = new Array(8).fill(0)
    const now = Date.now()
    refundedTxns.forEach((t) => {
      const weeksAgo = Math.floor((now - new Date(t.created_at).getTime()) / (7 * 86400000))
      if (weeksAgo >= 0 && weeksAgo < 8) weekly[7 - weeksAgo] += Math.abs(t.total || 0)
    })

    return { totalRefund, returnRate, topReturned, reasonList, weekly }
  }, [refundedTxns, txns])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiCard label="Total Refunds" value={fmt(symbol, m.totalRefund)} accent={RED} />
        <KpiCard label="Return Rate" value={pct(m.returnRate)} accent={m.returnRate > 5 ? RED : GREEN} />
        <KpiCard label="Refunded Txns" value={fmtInt(refundedTxns.length)} />
      </div>

      <Card title="Refund Trend — Last 8 Weeks">
        {refundedTxns.length ? <LineChart points={m.weekly} symbol={symbol} color={RED} /> : <EmptyState icon="📉" title="No refund history" />}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        <Card title="Most Returned Products">
          {m.topReturned.length ? <HBars data={m.topReturned} symbol={symbol} /> : <EmptyState icon="📦" title="No returned products" />}
        </Card>
        <Card title="Return Reasons">
          {m.reasonList.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {m.reasonList.map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                  <span style={{ color: 'var(--tx2)' }}>{r.label}</span>
                  <b style={{ color: 'var(--tx)' }}>{r.value}</b>
                </div>
              ))}
            </div>
          ) : <EmptyState icon="📝" title="No reason data" hint="Capture reasons at refund time to populate this." />}
        </Card>
      </div>

      <div style={{ borderRadius: 12, border: '1px solid var(--b)', overflow: 'hidden', background: 'var(--sf)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)', fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>Refunded Transactions</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ev)' }}>
                <th style={thStyle}>Date</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Items Returned</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Refund Amount</th>
                <th style={thStyle}>Payment</th>
                <th style={thStyle}>Cashier</th>
              </tr>
            </thead>
            <tbody>
              {refundedTxns.map((t) => {
                const items = Array.isArray(t.pos_items) ? t.pos_items : []
                const itemCount = items.reduce((s: number, it: any) => s + Math.abs(it.qty || 0), 0)
                return (
                  <tr key={t.id}>
                    <td style={tdStyle}>{fmtDateTime(t.created_at)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{itemCount}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: RED }}>{fmt(symbol, Math.abs(t.total || 0))}</td>
                    <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{t.payment_type || '—'}</td>
                    <td style={tdStyle}>{t.cashier?.name || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {!refundedTxns.length && <EmptyState icon="✅" title="No returns" hint="Refunded transactions will appear here." />}
      </div>
    </div>
  )
}
