'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { useLang } from '@/components/LanguageProvider'

// ── Color constants ──────────────────────────────────────────────────────────
const ACC    = '#d08a59'   // restaurant accent
const GREEN  = '#16a34a'
const RED    = '#dc2626'
const AMBER  = '#ca8a04'
const TEAL   = '#0891b2'
const INDIGO = '#6366f1'

// Menu-engineering classification colors
const C_STAR      = '#22C55E'
const C_PUZZLE    = '#6366F1'
const C_PLOWHORSE = '#F59E0B'
const C_DOG       = '#EF4444'

// ── Types ────────────────────────────────────────────────────────────────────
interface RestaurantTabProps {
  currencySymbol: string
  selectedLocation: string   // 'all' or location ID
  transactions: any[]        // POS transactions already loaded by parent
  staff: any[]               // Staff already loaded by parent
  inventory: any[]           // Inventory already loaded by parent
}

type SubTab = 'overview' | 'orders' | 'menu' | 'floor' | 'staff' | 'kitchen'
type SortDir = 'asc' | 'desc'

type PosItem = {
  name?:       string
  qty?:        number
  unit_price?: number
  cost_price?: number
  modifiers?:  any[]
  category?:   string
}

type Tx = {
  id?:              string
  total?:           number
  subtotal?:        number
  discount_amount?: number
  payment_type?:    string
  status?:          string
  created_at?:      string
  notes?:           string
  order_type?:      string
  table?:           string | number
  completed_at?:    string
  tip_amount?:      number
  void_reason?:     string
  comp_amount?:     number
  cashier?:         { name?: string } | null
  pos_customers?:   { phone?: string; name?: string } | null
  pos_items?:       PosItem[]
}

type Classification = 'Star' | 'Puzzle' | 'Plowhorse' | 'Dog'

type MenuRow = {
  name:           string
  category:       string
  units:          number
  revenue:        number
  foodCost:       number
  margin:         number   // contribution margin total
  marginPct:      number   // margin as % of revenue
  unitMargin:     number   // contribution margin per unit
  classification: Classification
}

type ServerRow = {
  id:          string
  name:        string
  orders:      number
  revenue:     number
  avgTicket:   number
  voids:       number
  tips:        number
}

// ── Sub-tab config ─────────────────────────────────────────────────────────────
function buildSubTabs(tc: (key: string) => string): { id: SubTab; label: string }[] {
  return [
    { id: 'overview', label: tc('pos_restaurant.tabOverview') },
    { id: 'orders',   label: tc('pos_restaurant.tabOrders') },
    { id: 'menu',     label: tc('pos_restaurant.tabMenu') },
    { id: 'floor',    label: tc('pos_restaurant.tabFloor') },
    { id: 'staff',    label: tc('pos_restaurant.tabStaff') },
    { id: 'kitchen',  label: tc('pos_restaurant.tabKitchen') },
  ]
}

function buildOrderCols(tc: (key: string) => string): { id: string; label: string; align?: 'right' | 'left' }[] {
  return [
    { id: 'order',   label: tc('pos_restaurant.colOrder') },
    { id: 'time',    label: tc('pos_restaurant.colTime') },
    { id: 'server',  label: tc('pos_restaurant.colServer') },
    { id: 'items',   label: tc('pos_restaurant.colItems'), align: 'right' },
    { id: 'total',   label: tc('pos_restaurant.colTotal'), align: 'right' },
    { id: 'payment', label: tc('pos_restaurant.colPayment') },
    { id: 'status',  label: tc('pos_restaurant.colStatus') },
  ]
}

function buildMenuCols(tc: (key: string) => string): { id: string; label: string; align?: 'right' | 'left' }[] {
  return [
    { id: 'name',     label: tc('pos_restaurant.colItem') },
    { id: 'category', label: tc('pos_restaurant.colCategory') },
    { id: 'units',    label: tc('pos_restaurant.colUnits'), align: 'right' },
    { id: 'revenue',  label: tc('pos_restaurant.colRevenue'), align: 'right' },
    { id: 'foodCost', label: tc('pos_restaurant.colFoodCost'), align: 'right' },
    { id: 'marginPct',label: tc('pos_restaurant.colMarginPct'), align: 'right' },
    { id: 'class',    label: tc('pos_restaurant.colClassification') },
  ]
}

function buildStaffCols(tc: (key: string) => string): { id: string; label: string; align?: 'right' | 'left' }[] {
  return [
    { id: 'name',      label: tc('pos_restaurant.colServer') },
    { id: 'orders',    label: tc('pos_restaurant.colOrders'), align: 'right' },
    { id: 'revenue',   label: tc('pos_restaurant.colRevenue'), align: 'right' },
    { id: 'avgTicket', label: tc('pos_restaurant.colAvgTicket'), align: 'right' },
    { id: 'voids',     label: tc('pos_restaurant.colVoids'), align: 'right' },
    { id: 'tips',      label: tc('pos_restaurant.colTips'), align: 'right' },
  ]
}

const CLASSIFICATION_COLOR: Record<Classification, string> = {
  Star:      C_STAR,
  Puzzle:    C_PUZZLE,
  Plowhorse: C_PLOWHORSE,
  Dog:       C_DOG,
}

const CLASSIFICATION_ICON: Record<Classification, string> = {
  Star:      '⭐',
  Puzzle:    '🧩',
  Plowhorse: '🐴',
  Dog:       '🐕',
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function pctChange(today: number, prev: number): number | null {
  if (prev === 0) return today === 0 ? 0 : null
  return ((today - prev) / prev) * 100
}

function fmtMoney(sym: string, n: number): string {
  return `${sym}${(Number.isFinite(n) ? n : 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function fmtTime(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

function txTotal(t: Tx): number {
  return Number(t.total ?? 0)
}

function orderTypeOf(t: Tx): 'dine-in' | 'takeaway' | 'online' {
  const raw = (t.order_type ?? '').toString().toLowerCase()
  if (raw.includes('online') || raw.includes('delivery') || raw.includes('web')) return 'online'
  if (raw.includes('take') || raw.includes('togo') || raw.includes('to-go') || raw.includes('pickup')) return 'takeaway'
  if (raw.includes('dine')) return 'dine-in'
  // Fallback heuristic: online orders usually have a customer record
  if (t.pos_customers && t.pos_customers.phone) return 'online'
  return 'dine-in'
}

function statusOf(t: Tx): string {
  return (t.status ?? 'completed').toString().toLowerCase()
}

// ── Sort indicator caret ───────────────────────────────────────────────────────
function caret(active: boolean, dir: SortDir): string {
  if (!active) return ''
  return dir === 'asc' ? ' ▲' : ' ▼'
}

// ── Reusable shared styles ─────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  borderRadius: 12,
  border: '1px solid var(--b)',
  background: 'var(--sf)',
  padding: 16,
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--tx3)',
  textTransform: 'uppercase',
  letterSpacing: '.04em',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--b)',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 13,
  color: 'var(--tx)',
  borderBottom: '1px solid var(--b)',
  verticalAlign: 'top',
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ h = 14, w = '100%' }: { h?: number; w?: number | string }) {
  return (
    <div style={{
      width: w,
      height: h,
      borderRadius: 6,
      background: 'var(--b)',
      animation: 'pulse 1.5s infinite ease-in-out',
    }} />
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton h={10} w="50%" />
            <Skeleton h={22} w="70%" />
            <Skeleton h={10} w="35%" />
          </div>
        ))}
      </div>
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton h={12} w="30%" />
        <Skeleton h={180} w="100%" />
      </div>
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div style={{
      ...cardStyle,
      padding: '48px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-sora)' }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--tx3)', maxWidth: 380 }}>{sub}</div>}
    </div>
  )
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-sora)', marginBottom: 12 }}>
      {children}
    </div>
  )
}

// ── KPI card ───────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  change,
  onClick,
}: {
  label: string
  value: string
  change: number | null
  onClick: () => void
}) {
  const { tc } = useLang()
  const hasChange = change !== null && Number.isFinite(change)
  const up = (change ?? 0) >= 0
  const changeColor = !hasChange ? 'var(--tx3)' : up ? GREEN : RED
  return (
    <button
      onClick={onClick}
      style={{
        ...cardStyle,
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: 'inherit',
        transition: 'border-color .15s, transform .1s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = ACC }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--b)' }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx)', fontFamily: 'var(--font-sora)', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: changeColor }}>
        {hasChange
          ? (up ? '▲' : '▼') + ' ' + Math.abs(change as number).toFixed(1) + '% ' + tc('pos_restaurant.vsYesterday')
          : tc('pos_restaurant.noPriorData')}
      </div>
    </button>
  )
}

// ── Sub-tab strip ──────────────────────────────────────────────────────────────
function SubTabStrip({ active, onChange }: { active: SubTab; onChange: (t: SubTab) => void }) {
  const { tc } = useLang()
  const tabs = buildSubTabs(tc)
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--b)',
      overflowX: 'auto',
      flexWrap: 'nowrap',
    }}>
      {tabs.map((t) => {
        const isActive = t.id === active
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: isActive ? `2.5px solid ${ACC}` : '2.5px solid transparent',
              background: 'transparent',
              color: isActive ? ACC : 'var(--tx2)',
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-sora)',
              whiteSpace: 'nowrap',
              transition: 'color .15s, border-color .15s',
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Classification badge ───────────────────────────────────────────────────────
function ClassBadge({ c }: { c: Classification }) {
  const color = CLASSIFICATION_COLOR[c]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 9999,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: `${color}1a`,
      border: `1px solid ${color}55`,
      whiteSpace: 'nowrap',
    }}>
      <span>{CLASSIFICATION_ICON[c]}</span>{c}
    </span>
  )
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let color = GREEN
  if (s.includes('refund')) color = AMBER
  else if (s.includes('void')) color = RED
  else if (s.includes('pending') || s.includes('open')) color = TEAL
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 9999,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: `${color}1a`,
      border: `1px solid ${color}44`,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function RestaurantTab({
  currencySymbol,
  selectedLocation,
  transactions,
  staff,
  inventory,
}: RestaurantTabProps) {
  const { tc } = useLang()
  const [subTab, setSubTab]             = useState<SubTab>('overview')
  const [searchQuery, setSearchQuery]   = useState('')
  const [sortField, setSortField]       = useState<string>('time')
  const [sortDir, setSortDir]           = useState<SortDir>('desc')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // Orders sub-tab filters
  const [statusFilter, setStatusFilter]   = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [serverFilter, setServerFilter]   = useState<string>('all')
  const [dateFilter, setDateFilter]       = useState<string>('')

  // Menu engineering sort
  const [menuSortField, setMenuSortField] = useState<string>('units')
  const [menuSortDir, setMenuSortDir]     = useState<SortDir>('desc')

  // Staff sort + expansion
  const [staffSortField, setStaffSortField] = useState<string>('revenue')
  const [staffSortDir, setStaffSortDir]     = useState<SortDir>('desc')
  const [expandedServer, setExpandedServer] = useState<string | null>(null)

  const txs = (transactions ?? []) as Tx[]
  const loading = false // parent loads data; show empty states rather than spinner

  // ── Generic sort toggle handler ──────────────────────────────────────────────
  const toggleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }, [sortField])

  // ──────────────────────────────────────────────────────────────────────────────
  // DERIVED DATA (computed client-side from transactions)
  // ──────────────────────────────────────────────────────────────────────────────

  const now = useMemo(() => new Date(), [])
  const todayStart = useMemo(() => startOfDay(now), [now])
  const yesterdayStart = useMemo(() => {
    const d = new Date(todayStart)
    d.setDate(d.getDate() - 1)
    return d
  }, [todayStart])

  // Split transactions into today / yesterday buckets
  const { todayTx, yesterdayTx } = useMemo(() => {
    const tToday: Tx[] = []
    const tYesterday: Tx[] = []
    for (const t of txs) {
      if (!t.created_at) continue
      const d = new Date(t.created_at)
      if (isNaN(d.getTime())) continue
      if (isSameDay(d, todayStart)) tToday.push(t)
      else if (isSameDay(d, yesterdayStart)) tYesterday.push(t)
    }
    return { todayTx: tToday, yesterdayTx: tYesterday }
  }, [txs, todayStart, yesterdayStart])

  // KPI aggregates
  const kpis = useMemo(() => {
    const sum = (arr: Tx[], pred: (t: Tx) => boolean, val: (t: Tx) => number) =>
      arr.filter(pred).reduce((a, t) => a + val(t), 0)

    const completed = (t: Tx) => statusOf(t) === 'completed' || statusOf(t) === 'paid'

    const revToday = sum(todayTx, completed, txTotal)
    const revYest  = sum(yesterdayTx, completed, txTotal)

    const coversToday = todayTx.filter(completed).length
    const coversYest  = yesterdayTx.filter(completed).length

    const avgTicketToday = coversToday ? revToday / coversToday : 0
    const avgTicketYest  = coversYest ? revYest / coversYest : 0

    const refundToday = todayTx.filter((t) => statusOf(t).includes('refund')).length
    const refundYest  = yesterdayTx.filter((t) => statusOf(t).includes('refund')).length

    const voidToday = todayTx.filter((t) => statusOf(t).includes('void')).length
    const voidYest  = yesterdayTx.filter((t) => statusOf(t).includes('void')).length

    // Top seller today by units
    const unitMap = new Map<string, number>()
    for (const t of todayTx) {
      if (!completed(t)) continue
      for (const it of t.pos_items ?? []) {
        const nm = it.name ?? 'Unknown'
        unitMap.set(nm, (unitMap.get(nm) ?? 0) + Number(it.qty ?? 0))
      }
    }
    let topSeller = '—'
    let topSellerUnits = 0
    for (const [nm, u] of unitMap.entries()) {
      if (u > topSellerUnits) { topSellerUnits = u; topSeller = nm }
    }

    return {
      revToday, revYest,
      coversToday, coversYest,
      avgTicketToday, avgTicketYest,
      refundToday, refundYest,
      voidToday, voidYest,
      topSeller, topSellerUnits,
    }
  }, [todayTx, yesterdayTx])

  // Hourly revenue (today vs yesterday) for SVG bar chart
  const hourly = useMemo(() => {
    const todayHours = new Array(24).fill(0)
    const yestHours = new Array(24).fill(0)
    for (const t of todayTx) {
      if (!t.created_at) continue
      const h = new Date(t.created_at).getHours()
      todayHours[h] += txTotal(t)
    }
    for (const t of yesterdayTx) {
      if (!t.created_at) continue
      const h = new Date(t.created_at).getHours()
      yestHours[h] += txTotal(t)
    }
    return { todayHours, yestHours }
  }, [todayTx, yesterdayTx])

  // Order type breakdown (today)
  const orderTypes = useMemo(() => {
    let dineIn = 0, takeaway = 0, online = 0
    for (const t of todayTx) {
      const ty = orderTypeOf(t)
      if (ty === 'dine-in') dineIn++
      else if (ty === 'takeaway') takeaway++
      else online++
    }
    const total = dineIn + takeaway + online || 1
    return {
      dineIn, takeaway, online,
      dineInPct: (dineIn / total) * 100,
      takeawayPct: (takeaway / total) * 100,
      onlinePct: (online / total) * 100,
    }
  }, [todayTx])

  // Voids & comps summary (today)
  const voidsComps = useMemo(() => {
    let voidTotal = 0, compTotal = 0
    const reasonMap = new Map<string, number>()
    for (const t of todayTx) {
      if (statusOf(t).includes('void')) {
        voidTotal += txTotal(t)
        const reason = (t.void_reason ?? t.notes ?? 'Unspecified').toString()
        reasonMap.set(reason, (reasonMap.get(reason) ?? 0) + 1)
      }
      compTotal += Number(t.comp_amount ?? 0)
    }
    let topVoidReason = '—'
    let topVoidCount = 0
    for (const [r, c] of reasonMap.entries()) {
      if (c > topVoidCount) { topVoidCount = c; topVoidReason = r }
    }
    return { voidTotal, compTotal, topVoidReason, topVoidCount }
  }, [todayTx])

  // ── ORDERS: filtered + sorted list ──────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    let list = [...txs]

    if (statusFilter !== 'all') {
      list = list.filter((t) => statusOf(t).includes(statusFilter))
    }
    if (paymentFilter !== 'all') {
      list = list.filter((t) => (t.payment_type ?? '').toLowerCase() === paymentFilter.toLowerCase())
    }
    if (serverFilter !== 'all') {
      list = list.filter((t) => (t.cashier?.name ?? '') === serverFilter)
    }
    if (dateFilter) {
      list = list.filter((t) => (t.created_at ?? '').slice(0, 10) === dateFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter((t) =>
        (t.id ?? '').toLowerCase().includes(q) ||
        (t.cashier?.name ?? '').toLowerCase().includes(q) ||
        (t.payment_type ?? '').toLowerCase().includes(q) ||
        (t.pos_items ?? []).some((it) => (it.name ?? '').toLowerCase().includes(q))
      )
    }

    const dir = sortDir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      let av: any, bv: any
      switch (sortField) {
        case 'order':   av = a.id ?? ''; bv = b.id ?? ''; break
        case 'time':    av = a.created_at ?? ''; bv = b.created_at ?? ''; break
        case 'server':  av = a.cashier?.name ?? ''; bv = b.cashier?.name ?? ''; break
        case 'items':   av = (a.pos_items ?? []).length; bv = (b.pos_items ?? []).length; break
        case 'total':   av = txTotal(a); bv = txTotal(b); break
        case 'payment': av = a.payment_type ?? ''; bv = b.payment_type ?? ''; break
        case 'status':  av = statusOf(a); bv = statusOf(b); break
        default:        av = a.created_at ?? ''; bv = b.created_at ?? ''
      }
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
    return list
  }, [txs, statusFilter, paymentFilter, serverFilter, dateFilter, searchQuery, sortField, sortDir])

  // Distinct filter option values
  const paymentOptions = useMemo(() => {
    const s = new Set<string>()
    for (const t of txs) if (t.payment_type) s.add(t.payment_type)
    return Array.from(s)
  }, [txs])

  const serverOptions = useMemo(() => {
    const s = new Set<string>()
    for (const t of txs) if (t.cashier?.name) s.add(t.cashier.name)
    return Array.from(s)
  }, [txs])

  // ── MENU ENGINEERING: per-item aggregation + classification ─────────────────
  const menuRows = useMemo<MenuRow[]>(() => {
    // Build a cost lookup from inventory by name
    const costByName = new Map<string, number>()
    const categoryByName = new Map<string, string>()
    for (const inv of inventory ?? []) {
      const nm = (inv?.name ?? '').toString()
      if (!nm) continue
      const cost = Number(inv?.cost_price ?? inv?.cost ?? 0)
      if (cost) costByName.set(nm.toLowerCase(), cost)
      if (inv?.category) categoryByName.set(nm.toLowerCase(), inv.category)
    }

    const agg = new Map<string, { units: number; revenue: number; foodCost: number; category: string }>()
    for (const t of txs) {
      if (statusOf(t).includes('void')) continue
      for (const it of t.pos_items ?? []) {
        const nm = (it.name ?? 'Unknown').toString()
        const key = nm
        const qty = Number(it.qty ?? 0)
        const unitPrice = Number(it.unit_price ?? 0)
        const cost = Number(it.cost_price ?? costByName.get(nm.toLowerCase()) ?? 0)
        const cur = agg.get(key) ?? {
          units: 0, revenue: 0, foodCost: 0,
          category: it.category ?? categoryByName.get(nm.toLowerCase()) ?? 'Uncategorized',
        }
        cur.units += qty
        cur.revenue += qty * unitPrice
        cur.foodCost += qty * cost
        agg.set(key, cur)
      }
    }

    const rows: MenuRow[] = []
    for (const [name, v] of agg.entries()) {
      const margin = v.revenue - v.foodCost
      const marginPct = v.revenue ? (margin / v.revenue) * 100 : 0
      const unitMargin = v.units ? margin / v.units : 0
      rows.push({
        name,
        category: v.category,
        units: v.units,
        revenue: v.revenue,
        foodCost: v.foodCost,
        margin,
        marginPct,
        unitMargin,
        classification: 'Dog', // placeholder, set below
      })
    }

    // Classification thresholds: median units (popularity) & median unit margin
    const medUnits = median(rows.map((r) => r.units))
    const medMargin = median(rows.map((r) => r.unitMargin))
    for (const r of rows) {
      const highPop = r.units >= medUnits
      const highMargin = r.unitMargin >= medMargin
      if (highPop && highMargin) r.classification = 'Star'
      else if (!highPop && highMargin) r.classification = 'Puzzle'
      else if (highPop && !highMargin) r.classification = 'Plowhorse'
      else r.classification = 'Dog'
    }
    return rows
  }, [txs, inventory])

  const menuMedians = useMemo(() => ({
    units: median(menuRows.map((r) => r.units)),
    margin: median(menuRows.map((r) => r.unitMargin)),
  }), [menuRows])

  const sortedMenuRows = useMemo(() => {
    const dir = menuSortDir === 'asc' ? 1 : -1
    const list = [...menuRows]
    list.sort((a, b) => {
      let av: any, bv: any
      switch (menuSortField) {
        case 'name':     av = a.name; bv = b.name; break
        case 'category': av = a.category; bv = b.category; break
        case 'units':    av = a.units; bv = b.units; break
        case 'revenue':  av = a.revenue; bv = b.revenue; break
        case 'foodCost': av = a.foodCost; bv = b.foodCost; break
        case 'marginPct':av = a.marginPct; bv = b.marginPct; break
        case 'class':    av = a.classification; bv = b.classification; break
        default:         av = a.units; bv = b.units
      }
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
    return list
  }, [menuRows, menuSortField, menuSortDir])

  const toggleMenuSort = useCallback((field: string) => {
    if (menuSortField === field) setMenuSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setMenuSortField(field); setMenuSortDir('desc') }
  }, [menuSortField])

  // ── STAFF: server leaderboard ───────────────────────────────────────────────
  const serverRows = useMemo<ServerRow[]>(() => {
    const map = new Map<string, ServerRow>()
    // Seed from staff prop so 0-order servers still show
    for (const s of staff ?? []) {
      const nm = (s?.name ?? '').toString()
      if (!nm) continue
      map.set(nm, { id: s?.id ?? nm, name: nm, orders: 0, revenue: 0, avgTicket: 0, voids: 0, tips: 0 })
    }
    for (const t of txs) {
      const nm = (t.cashier?.name ?? '').toString()
      if (!nm) continue
      const row = map.get(nm) ?? { id: nm, name: nm, orders: 0, revenue: 0, avgTicket: 0, voids: 0, tips: 0 }
      if (statusOf(t).includes('void')) {
        row.voids++
      } else {
        row.orders++
        row.revenue += txTotal(t)
        row.tips += Number(t.tip_amount ?? 0)
      }
      map.set(nm, row)
    }
    const rows = Array.from(map.values())
    for (const r of rows) r.avgTicket = r.orders ? r.revenue / r.orders : 0
    return rows
  }, [txs, staff])

  const sortedServerRows = useMemo(() => {
    const dir = staffSortDir === 'asc' ? 1 : -1
    const list = [...serverRows]
    list.sort((a, b) => {
      let av: any, bv: any
      switch (staffSortField) {
        case 'name':      av = a.name; bv = b.name; break
        case 'orders':    av = a.orders; bv = b.orders; break
        case 'revenue':   av = a.revenue; bv = b.revenue; break
        case 'avgTicket': av = a.avgTicket; bv = b.avgTicket; break
        case 'voids':     av = a.voids; bv = b.voids; break
        case 'tips':      av = a.tips; bv = b.tips; break
        default:          av = a.revenue; bv = b.revenue
      }
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
    return list
  }, [serverRows, staffSortField, staffSortDir])

  const toggleStaffSort = useCallback((field: string) => {
    if (staffSortField === field) setStaffSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setStaffSortField(field); setStaffSortDir('desc') }
  }, [staffSortField])

  const ordersByServer = useCallback((name: string) =>
    txs.filter((t) => (t.cashier?.name ?? '') === name)
      .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      .slice(0, 10),
  [txs])

  // ── FLOOR: table utilization ────────────────────────────────────────────────
  const floorStats = useMemo(() => {
    const tableSet = new Set<string>()
    let occupied = 0
    let totalTurnMs = 0
    let turnCount = 0
    const tableSpend = new Map<string, number>()
    for (const t of todayTx) {
      const tbl = t.table != null ? String(t.table) : ''
      if (tbl) {
        tableSet.add(tbl)
        tableSpend.set(tbl, (tableSpend.get(tbl) ?? 0) + txTotal(t))
      }
      if (statusOf(t) === 'open' || statusOf(t) === 'pending') occupied++
      if (t.created_at && t.completed_at) {
        const ms = new Date(t.completed_at).getTime() - new Date(t.created_at).getTime()
        if (ms > 0 && ms < 1000 * 60 * 60 * 6) { totalTurnMs += ms; turnCount++ }
      }
    }
    const spends = Array.from(tableSpend.values())
    const avgSpend = spends.length ? spends.reduce((a, b) => a + b, 0) / spends.length : 0
    const avgTurnMin = turnCount ? Math.round(totalTurnMs / turnCount / 60000) : 0
    return {
      totalTables: tableSet.size,
      occupied,
      avgTurnMin,
      avgSpend,
    }
  }, [todayTx])

  // ── KITCHEN: prep time + most ordered today ─────────────────────────────────
  const kitchenStats = useMemo(() => {
    let totalPrepMs = 0
    let prepCount = 0
    for (const t of todayTx) {
      if (t.created_at && t.completed_at) {
        const ms = new Date(t.completed_at).getTime() - new Date(t.created_at).getTime()
        if (ms > 0 && ms < 1000 * 60 * 60 * 3) { totalPrepMs += ms; prepCount++ }
      }
    }
    const avgPrepMin = prepCount ? Math.round(totalPrepMs / prepCount / 60000) : 0

    const unitMap = new Map<string, number>()
    for (const t of todayTx) {
      if (statusOf(t).includes('void')) continue
      for (const it of t.pos_items ?? []) {
        const nm = it.name ?? 'Unknown'
        unitMap.set(nm, (unitMap.get(nm) ?? 0) + Number(it.qty ?? 0))
      }
    }
    const topItems = Array.from(unitMap.entries())
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10)
    return { avgPrepMin, prepCount, topItems }
  }, [todayTx])

  // ──────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return <LoadingSkeleton />
  }

  const noData = txs.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 20 }}>🍴</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)', fontFamily: 'var(--font-sora)' }}>
          {tc('pos_restaurant.restaurantAnalytics')}
        </div>
        {selectedLocation !== 'all' && (
          <span style={{
            padding: '2px 10px',
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 700,
            color: ACC,
            background: `${ACC}1a`,
            border: `1px solid ${ACC}44`,
          }}>
            {selectedLocation}
          </span>
        )}
      </div>

      <SubTabStrip active={subTab} onChange={setSubTab} />

      {/* ──────────────────────── OVERVIEW ──────────────────────── */}
      {subTab === 'overview' && (
        noData ? (
          <EmptyState icon="🍴" title={tc('pos_restaurant.noTransactionsTitle')} sub={tc('pos_restaurant.noTransactionsSub')} />
        ) : (
          <OverviewPanel
            currencySymbol={currencySymbol}
            kpis={kpis}
            hourly={hourly}
            orderTypes={orderTypes}
            voidsComps={voidsComps}
            onNavigate={setSubTab}
          />
        )
      )}

      {/* ──────────────────────── ORDERS ──────────────────────── */}
      {subTab === 'orders' && (
        <OrdersPanel
          currencySymbol={currencySymbol}
          orders={filteredOrders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
          serverFilter={serverFilter}
          setServerFilter={setServerFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          paymentOptions={paymentOptions}
          serverOptions={serverOptions}
          sortField={sortField}
          sortDir={sortDir}
          onSort={toggleSort}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
        />
      )}

      {/* ──────────────────────── MENU ENGINEERING ──────────────────────── */}
      {subTab === 'menu' && (
        menuRows.length === 0 ? (
          <EmptyState icon="🧩" title={tc('pos_restaurant.noMenuDataTitle')} sub={tc('pos_restaurant.noMenuDataSub')} />
        ) : (
          <MenuEngineeringPanel
            currencySymbol={currencySymbol}
            rows={sortedMenuRows}
            allRows={menuRows}
            medians={menuMedians}
            sortField={menuSortField}
            sortDir={menuSortDir}
            onSort={toggleMenuSort}
          />
        )
      )}

      {/* ──────────────────────── FLOOR ──────────────────────── */}
      {subTab === 'floor' && (
        <FloorPanel currencySymbol={currencySymbol} stats={floorStats} todayTx={todayTx} />
      )}

      {/* ──────────────────────── STAFF ──────────────────────── */}
      {subTab === 'staff' && (
        serverRows.length === 0 ? (
          <EmptyState icon="🧑‍🍳" title={tc('pos_restaurant.noServerDataTitle')} sub={tc('pos_restaurant.noServerDataSub')} />
        ) : (
          <StaffPanel
            currencySymbol={currencySymbol}
            rows={sortedServerRows}
            sortField={staffSortField}
            sortDir={staffSortDir}
            onSort={toggleStaffSort}
            expandedServer={expandedServer}
            setExpandedServer={setExpandedServer}
            ordersByServer={ordersByServer}
          />
        )
      )}

      {/* ──────────────────────── KITCHEN ──────────────────────── */}
      {subTab === 'kitchen' && (
        <KitchenPanel currencySymbol={currencySymbol} stats={kitchenStats} />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// OVERVIEW PANEL
// ══════════════════════════════════════════════════════════════════════════════
function OverviewPanel({
  currencySymbol,
  kpis,
  hourly,
  orderTypes,
  voidsComps,
  onNavigate,
}: {
  currencySymbol: string
  kpis: any
  hourly: { todayHours: number[]; yestHours: number[] }
  orderTypes: any
  voidsComps: any
  onNavigate: (t: SubTab) => void
}) {
  const { tc } = useLang()
  const maxHourly = Math.max(1, ...hourly.todayHours, ...hourly.yestHours)

  // SVG chart geometry
  const chartW = 720
  const chartH = 220
  const padL = 40
  const padB = 24
  const padT = 12
  const innerW = chartW - padL - 8
  const innerH = chartH - padB - padT
  const barGroupW = innerW / 24
  const barW = barGroupW * 0.38

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiCard
          label={tc('pos_restaurant.kpiRevenueToday')}
          value={fmtMoney(currencySymbol, kpis.revToday)}
          change={pctChange(kpis.revToday, kpis.revYest)}
          onClick={() => onNavigate('orders')}
        />
        <KpiCard
          label={tc('pos_restaurant.kpiCovers')}
          value={String(kpis.coversToday)}
          change={pctChange(kpis.coversToday, kpis.coversYest)}
          onClick={() => onNavigate('orders')}
        />
        <KpiCard
          label={tc('pos_restaurant.kpiAvgTicket')}
          value={fmtMoney(currencySymbol, kpis.avgTicketToday)}
          change={pctChange(kpis.avgTicketToday, kpis.avgTicketYest)}
          onClick={() => onNavigate('orders')}
        />
        <KpiCard
          label={tc('pos_restaurant.kpiRefunds')}
          value={String(kpis.refundToday)}
          change={pctChange(kpis.refundToday, kpis.refundYest)}
          onClick={() => onNavigate('orders')}
        />
        <KpiCard
          label={tc('pos_restaurant.kpiVoids')}
          value={String(kpis.voidToday)}
          change={pctChange(kpis.voidToday, kpis.voidYest)}
          onClick={() => onNavigate('orders')}
        />
        <KpiCard
          label={tc('pos_restaurant.kpiTopSeller')}
          value={kpis.topSeller}
          change={null}
          onClick={() => onNavigate('menu')}
        />
      </div>

      {/* Hourly revenue chart */}
      <div style={cardStyle}>
        <SectionTitle>{tc('pos_restaurant.hourlyRevenueSectionTitle')}</SectionTitle>
        <div style={{ display: 'flex', gap: 16, marginBottom: 8, fontSize: 12, color: 'var(--tx2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: ACC, display: 'inline-block' }} /> {tc('pos_restaurant.legendToday')}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--tx3)', display: 'inline-block', opacity: 0.5 }} /> {tc('pos_restaurant.legendYesterday')}
          </span>
        </div>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" style={{ minWidth: 520, display: 'block' }}>
            {/* Y gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
              const y = padT + innerH - innerH * f
              return (
                <g key={i}>
                  <line x1={padL} y1={y} x2={chartW - 8} y2={y} stroke="var(--b)" strokeWidth={1} strokeDasharray="2 3" />
                  <text x={padL - 6} y={y + 3} fontSize={9} fill="var(--tx3)" textAnchor="end">
                    {currencySymbol}{Math.round(maxHourly * f)}
                  </text>
                </g>
              )
            })}
            {/* Bars */}
            {hourly.todayHours.map((v, h) => {
              const groupX = padL + h * barGroupW
              const yH = (hourly.yestHours[h] / maxHourly) * innerH
              const tH = (v / maxHourly) * innerH
              return (
                <g key={h}>
                  <rect
                    x={groupX + barGroupW / 2 - barW - 1}
                    y={padT + innerH - yH}
                    width={barW}
                    height={Math.max(0, yH)}
                    fill="var(--tx3)"
                    opacity={0.4}
                    rx={1}
                  />
                  <rect
                    x={groupX + barGroupW / 2 + 1}
                    y={padT + innerH - tH}
                    width={barW}
                    height={Math.max(0, tH)}
                    fill={ACC}
                    rx={1}
                  >
                    <title>{`${h}:00 — ${currencySymbol}${v.toFixed(0)}`}</title>
                  </rect>
                  {h % 3 === 0 && (
                    <text x={groupX + barGroupW / 2} y={chartH - 8} fontSize={8} fill="var(--tx3)" textAnchor="middle">
                      {h}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Order type + voids/comps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Order type breakdown */}
        <div style={cardStyle}>
          <SectionTitle>{tc('pos_restaurant.orderTypeBreakdownTitle')}</SectionTitle>
          <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ width: `${orderTypes.dineInPct}%`, background: ACC }} title={tc('pos_restaurant.dineIn')} />
            <div style={{ width: `${orderTypes.takeawayPct}%`, background: TEAL }} title={tc('pos_restaurant.takeaway')} />
            <div style={{ width: `${orderTypes.onlinePct}%`, background: INDIGO }} title={tc('pos_restaurant.online')} />
          </div>
          {[
            { label: tc('pos_restaurant.dineIn'), count: orderTypes.dineIn, pct: orderTypes.dineInPct, color: ACC },
            { label: tc('pos_restaurant.takeaway'), count: orderTypes.takeaway, pct: orderTypes.takeawayPct, color: TEAL },
            { label: tc('pos_restaurant.online'), count: orderTypes.online, pct: orderTypes.onlinePct, color: INDIGO },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: row.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--tx)', flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{row.count}</span>
              <span style={{ fontSize: 12, color: 'var(--tx3)', width: 48, textAlign: 'right' }}>{row.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>

        {/* Voids & comps */}
        <div style={cardStyle}>
          <SectionTitle>{tc('pos_restaurant.voidsCompsSectionTitle')}</SectionTitle>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, padding: 12, borderRadius: 10, background: 'var(--ev)' }}>
              <div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', fontWeight: 700 }}>{tc('pos_restaurant.voided')}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: RED, fontFamily: 'var(--font-sora)' }}>
                {fmtMoney(currencySymbol, voidsComps.voidTotal)}
              </div>
            </div>
            <div style={{ flex: 1, padding: 12, borderRadius: 10, background: 'var(--ev)' }}>
              <div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', fontWeight: 700 }}>{tc('pos_restaurant.comped')}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: AMBER, fontFamily: 'var(--font-sora)' }}>
                {fmtMoney(currencySymbol, voidsComps.compTotal)}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--tx2)' }}>
            {tc('pos_restaurant.topVoidReason')}{' '}
            <span style={{ fontWeight: 700, color: 'var(--tx)' }}>{voidsComps.topVoidReason}</span>
            {voidsComps.topVoidCount > 0 && (
              <span style={{ color: 'var(--tx3)' }}> ({voidsComps.topVoidCount})</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS PANEL
// ══════════════════════════════════════════════════════════════════════════════
function OrdersPanel({
  currencySymbol,
  orders,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  serverFilter,
  setServerFilter,
  dateFilter,
  setDateFilter,
  paymentOptions,
  serverOptions,
  sortField,
  sortDir,
  onSort,
  expandedOrder,
  setExpandedOrder,
}: {
  currencySymbol: string
  orders: Tx[]
  searchQuery: string
  setSearchQuery: (s: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  paymentFilter: string
  setPaymentFilter: (s: string) => void
  serverFilter: string
  setServerFilter: (s: string) => void
  dateFilter: string
  setDateFilter: (s: string) => void
  paymentOptions: string[]
  serverOptions: string[]
  sortField: string
  sortDir: SortDir
  onSort: (f: string) => void
  expandedOrder: string | null
  setExpandedOrder: (id: string | null) => void
}) {
  const { tc } = useLang()
  const cols = buildOrderCols(tc)

  const selectStyle: React.CSSProperties = {
    padding: '7px 10px',
    borderRadius: 8,
    border: '1px solid var(--b)',
    background: 'var(--sf)',
    color: 'var(--tx)',
    fontSize: 12,
    fontFamily: 'inherit',
    cursor: 'pointer',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={tc('pos_restaurant.searchPlaceholder')}
          style={{
            flex: '1 1 220px',
            minWidth: 180,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--b)',
            background: 'var(--sf)',
            color: 'var(--tx)',
            fontSize: 13,
            fontFamily: 'inherit',
          }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">{tc('pos_restaurant.allStatuses')}</option>
          <option value="completed">{tc('pos_restaurant.statusCompleted')}</option>
          <option value="refund">{tc('pos_restaurant.statusRefunded')}</option>
          <option value="void">{tc('pos_restaurant.statusVoided')}</option>
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} style={selectStyle}>
          <option value="all">{tc('pos_restaurant.allPayments')}</option>
          {paymentOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={serverFilter} onChange={(e) => setServerFilter(e.target.value)} style={selectStyle}>
          <option value="all">{tc('pos_restaurant.allServers')}</option>
          {serverOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={selectStyle}
        />
      </div>

      <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos_restaurant.ordersCount', { n: orders.length })}</div>

      {orders.length === 0 ? (
        <EmptyState icon="🧾" title={tc('pos_restaurant.noMatchingOrdersTitle')} sub={tc('pos_restaurant.noMatchingOrdersSub')} />
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th
                    key={c.id}
                    onClick={() => onSort(c.id)}
                    style={{ ...thStyle, textAlign: c.align ?? 'left' }}
                  >
                    {c.label}{caret(sortField === c.id, sortDir)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((t, idx) => {
                const id = t.id ?? `idx-${idx}`
                const isExpanded = expandedOrder === id
                return (
                  <React.Fragment key={id}>
                    <tr
                      onClick={() => setExpandedOrder(isExpanded ? null : id)}
                      style={{ cursor: 'pointer', background: isExpanded ? 'var(--ev)' : 'transparent' }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 700 }}>
                        #{(t.id ?? '').slice(0, 8) || idx + 1}
                      </td>
                      <td style={tdStyle}>{fmtTime(t.created_at)}</td>
                      <td style={tdStyle}>{t.cashier?.name ?? '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{(t.pos_items ?? []).length}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{fmtMoney(currencySymbol, txTotal(t))}</td>
                      <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{t.payment_type ?? '—'}</td>
                      <td style={tdStyle}><StatusBadge status={statusOf(t)} /></td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={cols.length} style={{ padding: 0, borderBottom: '1px solid var(--b)', background: 'var(--ev)' }}>
                          <OrderDetail currencySymbol={currencySymbol} t={t} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function OrderDetail({ currencySymbol, t }: { currencySymbol: string; t: Tx }) {
  const { tc } = useLang()
  const items = t.pos_items ?? []
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {tc('pos_restaurant.lineItems')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.length === 0 && <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_restaurant.noLineItems')}</div>}
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--tx)' }}>
              <span>
                <span style={{ fontWeight: 700 }}>{it.qty ?? 1}×</span> {it.name ?? 'Item'}
              </span>
              <span style={{ fontWeight: 600 }}>
                {fmtMoney(currencySymbol, Number(it.qty ?? 1) * Number(it.unit_price ?? 0))}
              </span>
            </div>
            {Array.isArray(it.modifiers) && it.modifiers.length > 0 && (
              <div style={{ fontSize: 12, color: 'var(--tx3)', paddingLeft: 18 }}>
                + {it.modifiers.map((m: any) => (typeof m === 'string' ? m : m?.name ?? '')).filter(Boolean).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ borderTop: '1px solid var(--b)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <DetailRow label={tc('pos_restaurant.subtotal')} value={fmtMoney(currencySymbol, Number(t.subtotal ?? 0))} />
        {Number(t.discount_amount ?? 0) > 0 && (
          <DetailRow label={tc('pos_restaurant.discount')} value={`-${fmtMoney(currencySymbol, Number(t.discount_amount))}`} color={GREEN} />
        )}
        {Number(t.tip_amount ?? 0) > 0 && (
          <DetailRow label={tc('pos_restaurant.tip')} value={fmtMoney(currencySymbol, Number(t.tip_amount))} />
        )}
        <DetailRow label={tc('pos_restaurant.total')} value={fmtMoney(currencySymbol, txTotal(t))} bold />
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 12, color: 'var(--tx2)' }}>
        <span>{tc('pos_restaurant.paymentLabel')} <strong style={{ color: 'var(--tx)', textTransform: 'capitalize' }}>{t.payment_type ?? '—'}</strong></span>
        {t.pos_customers?.name && <span>{tc('pos_restaurant.customerLabel')} <strong style={{ color: 'var(--tx)' }}>{t.pos_customers.name}</strong></span>}
        {t.table != null && <span>{tc('pos_restaurant.tableLabel')} <strong style={{ color: 'var(--tx)' }}>{String(t.table)}</strong></span>}
      </div>

      {statusOf(t).includes('void') && (t.void_reason || t.notes) && (
        <div style={{ fontSize: 12, color: RED, background: `${RED}14`, padding: '8px 12px', borderRadius: 8 }}>
          <strong>{tc('pos_restaurant.voidReason')}</strong> {t.void_reason ?? t.notes}
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 14 : 13 }}>
      <span style={{ color: 'var(--tx2)', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ color: color ?? 'var(--tx)', fontWeight: bold ? 800 : 600 }}>{value}</span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MENU ENGINEERING PANEL
// ══════════════════════════════════════════════════════════════════════════════
function MenuEngineeringPanel({
  currencySymbol,
  rows,
  allRows,
  medians,
  sortField,
  sortDir,
  onSort,
}: {
  currencySymbol: string
  rows: MenuRow[]
  allRows: MenuRow[]
  medians: { units: number; margin: number }
  sortField: string
  sortDir: SortDir
  onSort: (f: string) => void
}) {
  const { tc } = useLang()
  const [hovered, setHovered] = useState<string | null>(null)
  const cols = buildMenuCols(tc)

  // Chart geometry
  const W = 720
  const H = 420
  const padL = 56
  const padR = 16
  const padT = 28
  const padB = 44
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const maxUnits = Math.max(1, ...allRows.map((r) => r.units))
  const maxMargin = Math.max(1, ...allRows.map((r) => r.unitMargin))
  const minMargin = Math.min(0, ...allRows.map((r) => r.unitMargin))
  const marginRange = maxMargin - minMargin || 1

  const xOf = (units: number) => padL + (units / maxUnits) * plotW
  const yOf = (margin: number) => padT + plotH - ((margin - minMargin) / marginRange) * plotH

  const crossX = xOf(medians.units)
  const crossY = yOf(medians.margin)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={cardStyle}>
        <SectionTitle>{tc('pos_restaurant.menuEngineeringTitle')}</SectionTitle>
        <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 12 }}>
          {tc('pos_restaurant.menuEngineeringDesc')}
        </div>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 560, display: 'block' }}>
            {/* Quadrant background tints */}
            <rect x={crossX} y={padT} width={padL + plotW - crossX} height={crossY - padT} fill={C_STAR} opacity={0.05} />
            <rect x={padL} y={padT} width={crossX - padL} height={crossY - padT} fill={C_PUZZLE} opacity={0.05} />
            <rect x={crossX} y={crossY} width={padL + plotW - crossX} height={padT + plotH - crossY} fill={C_PLOWHORSE} opacity={0.05} />
            <rect x={padL} y={crossY} width={crossX - padL} height={padT + plotH - crossY} fill={C_DOG} opacity={0.05} />

            {/* Axes box */}
            <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke="var(--b)" strokeWidth={1} />

            {/* Crosshairs at medians */}
            <line x1={crossX} y1={padT} x2={crossX} y2={padT + plotH} stroke="var(--tx3)" strokeWidth={1} strokeDasharray="4 4" />
            <line x1={padL} y1={crossY} x2={padL + plotW} y2={crossY} stroke="var(--tx3)" strokeWidth={1} strokeDasharray="4 4" />

            {/* Quadrant labels */}
            <text x={padL + plotW - 8} y={padT + 16} fontSize={13} fill={C_STAR} fontWeight={700} textAnchor="end">{tc('pos_restaurant.quadrantStars')}</text>
            <text x={padL + 8} y={padT + 16} fontSize={13} fill={C_PUZZLE} fontWeight={700} textAnchor="start">{tc('pos_restaurant.quadrantPuzzles')}</text>
            <text x={padL + plotW - 8} y={padT + plotH - 8} fontSize={13} fill={C_PLOWHORSE} fontWeight={700} textAnchor="end">{tc('pos_restaurant.quadrantPlowhorses')}</text>
            <text x={padL + 8} y={padT + plotH - 8} fontSize={13} fill={C_DOG} fontWeight={700} textAnchor="start">{tc('pos_restaurant.quadrantDogs')}</text>

            {/* Axis titles */}
            <text x={padL + plotW / 2} y={H - 8} fontSize={11} fill="var(--tx2)" textAnchor="middle">{tc('pos_restaurant.axisPopularity')}</text>
            <text x={14} y={padT + plotH / 2} fontSize={11} fill="var(--tx2)" textAnchor="middle" transform={`rotate(-90 14 ${padT + plotH / 2})`}>
              {tc('pos_restaurant.axisMargin')}
            </text>

            {/* Y axis ticks */}
            {[0, 0.5, 1].map((f, i) => {
              const val = minMargin + marginRange * f
              const y = yOf(val)
              return (
                <text key={i} x={padL - 6} y={y + 3} fontSize={9} fill="var(--tx3)" textAnchor="end">
                  {currencySymbol}{val.toFixed(1)}
                </text>
              )
            })}

            {/* Data dots */}
            {allRows.map((r, i) => {
              const cx = xOf(r.units)
              const cy = yOf(r.unitMargin)
              const color = CLASSIFICATION_COLOR[r.classification]
              const isHovered = hovered === r.name
              return (
                <g key={r.name + i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 8 : 5}
                    fill={color}
                    opacity={isHovered ? 1 : 0.78}
                    stroke="var(--sf)"
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer', transition: 'r .1s' }}
                    onMouseEnter={() => setHovered(r.name)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <title>{`${r.name}\n${r.units} units · ${currencySymbol}${r.unitMargin.toFixed(2)}/unit · ${r.classification}`}</title>
                  </circle>
                  {isHovered && (
                    <text x={cx + 10} y={cy - 8} fontSize={11} fill="var(--tx)" fontWeight={700}>
                      {r.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Sortable table */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.id} onClick={() => onSort(c.id)} style={{ ...thStyle, textAlign: c.align ?? 'left' }}>
                  {c.label}{caret(sortField === c.id, sortDir)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name + i}>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{r.name}</td>
                <td style={{ ...tdStyle, color: 'var(--tx2)' }}>{r.category}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{r.units}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtMoney(currencySymbol, r.revenue)}</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx2)' }}>{fmtMoney(currencySymbol, r.foodCost)}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: r.marginPct >= 60 ? GREEN : r.marginPct >= 30 ? AMBER : RED }}>
                  {r.marginPct.toFixed(1)}%
                </td>
                <td style={tdStyle}><ClassBadge c={r.classification} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// FLOOR PANEL
// ══════════════════════════════════════════════════════════════════════════════
function FloorPanel({
  currencySymbol,
  stats,
  todayTx,
}: {
  currencySymbol: string
  stats: { totalTables: number; occupied: number; avgTurnMin: number; avgSpend: number }
  todayTx: Tx[]
}) {
  const { tc } = useLang()

  // Section performance (group by t.notes-derived section if present; else skip)
  const sections = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>()
    for (const t of todayTx) {
      const sec = (t as any).section ?? (t as any).floor_section
      if (!sec) continue
      const cur = map.get(sec) ?? { count: 0, revenue: 0 }
      cur.count++
      cur.revenue += txTotal(t)
      map.set(sec, cur)
    }
    return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }))
  }, [todayTx])

  const tiles = [
    { label: tc('pos_restaurant.totalTables'), value: String(stats.totalTables), color: ACC },
    { label: tc('pos_restaurant.occupiedNow'), value: String(stats.occupied), color: TEAL },
    { label: tc('pos_restaurant.avgTurnTime'), value: stats.avgTurnMin + ' ' + tc('pos_restaurant.min'), color: INDIGO },
    { label: tc('pos_restaurant.avgSpendPerTable'), value: fmtMoney(currencySymbol, stats.avgSpend), color: GREEN },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {tiles.map((t) => (
          <div key={t.label} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{t.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.color, fontFamily: 'var(--font-sora)' }}>{t.value}</div>
          </div>
        ))}
      </div>

      {sections.length > 0 ? (
        <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>{tc('pos_restaurant.colSection')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{tc('pos_restaurant.colOrders')}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{tc('pos_restaurant.colRevenue')}</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.name}>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{s.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{s.count}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{fmtMoney(currencySymbol, s.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ ...cardStyle, fontSize: 13, color: 'var(--tx2)' }}>
          {tc('pos_restaurant.noSectionData')}
        </div>
      )}

      <a
        href="https://pos.askbiz.co/restaurant/floor"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...cardStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textDecoration: 'none',
          color: ACC,
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        <span>{tc('pos_restaurant.floorManagementLink')}</span>
        <span>→</span>
      </a>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STAFF PANEL
// ══════════════════════════════════════════════════════════════════════════════
function StaffPanel({
  currencySymbol,
  rows,
  sortField,
  sortDir,
  onSort,
  expandedServer,
  setExpandedServer,
  ordersByServer,
}: {
  currencySymbol: string
  rows: ServerRow[]
  sortField: string
  sortDir: SortDir
  onSort: (f: string) => void
  expandedServer: string | null
  setExpandedServer: (n: string | null) => void
  ordersByServer: (name: string) => Tx[]
}) {
  const { tc } = useLang()
  const totalRevenue = rows.reduce((a, r) => a + r.revenue, 0)
  const activeStaff = rows.filter((r) => r.orders > 0).length
  const revPerStaff = activeStaff ? totalRevenue / activeStaff : 0
  const cols = buildStaffCols(tc)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('pos_restaurant.activeStaff')}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: ACC, fontFamily: 'var(--font-sora)' }}>{activeStaff}</div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('pos_restaurant.revenuePerStaff')}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: GREEN, fontFamily: 'var(--font-sora)' }}>{fmtMoney(currencySymbol, revPerStaff)}</div>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.id} onClick={() => onSort(c.id)} style={{ ...thStyle, textAlign: c.align ?? 'left' }}>
                  {c.label}{caret(sortField === c.id, sortDir)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isExpanded = expandedServer === r.name
              return (
                <React.Fragment key={r.name}>
                  <tr
                    onClick={() => setExpandedServer(isExpanded ? null : r.name)}
                    style={{ cursor: 'pointer', background: isExpanded ? 'var(--ev)' : 'transparent' }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{r.name}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{r.orders}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{fmtMoney(currencySymbol, r.revenue)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtMoney(currencySymbol, r.avgTicket)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: r.voids > 0 ? RED : 'var(--tx3)' }}>{r.voids}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtMoney(currencySymbol, r.tips)}</td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={cols.length} style={{ padding: 16, background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 10 }}>
                          {tc('pos_restaurant.recentOrders')}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {ordersByServer(r.name).map((t, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--tx2)' }}>
                              <span>#{(t.id ?? '').slice(0, 8) || i + 1} · {fmtTime(t.created_at)}</span>
                              <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <StatusBadge status={statusOf(t)} />
                                <strong style={{ color: 'var(--tx)' }}>{fmtMoney(currencySymbol, txTotal(t))}</strong>
                              </span>
                            </div>
                          ))}
                          {ordersByServer(r.name).length === 0 && (
                            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_restaurant.noRecentOrders')}</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// KITCHEN PANEL
// ══════════════════════════════════════════════════════════════════════════════
function KitchenPanel({
  currencySymbol: _currencySymbol,
  stats,
}: {
  currencySymbol: string
  stats: { avgPrepMin: number; prepCount: number; topItems: { name: string; units: number }[] }
}) {
  const { tc } = useLang()
  const maxUnits = Math.max(1, ...stats.topItems.map((i) => i.units))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' }}>{tc('pos_restaurant.avgPrepTime')}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: ACC, fontFamily: 'var(--font-sora)' }}>
            {stats.prepCount ? stats.avgPrepMin + ' ' + tc('pos_restaurant.min') : '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
            {stats.prepCount ? tc('pos_restaurant.fromCompletedOrders', { n: stats.prepCount }) : tc('pos_restaurant.noCompletionTimestamps')}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <SectionTitle>{tc('pos_restaurant.mostOrderedToday')}</SectionTitle>
        {stats.topItems.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos_restaurant.noItemsSoldToday')}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.topItems.map((it) => (
              <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 140, fontSize: 13, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {it.name}
                </div>
                <div style={{ flex: 1, height: 18, background: 'var(--ev)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${(it.units / maxUnits) * 100}%`, height: '100%', background: ACC, borderRadius: 6 }} />
                </div>
                <div style={{ width: 40, textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{it.units}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <a
        href="https://pos.askbiz.co/restaurant/kitchen"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...cardStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textDecoration: 'none',
          color: ACC,
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        <span>{tc('pos_restaurant.kitchenDisplayLink')}</span>
        <span>→</span>
      </a>
    </div>
  )
}
