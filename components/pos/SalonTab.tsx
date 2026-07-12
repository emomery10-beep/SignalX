'use client'
import { useState, useMemo, useCallback } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { formatMoney } from '@/lib/pos-format'

// ── Color constants ──────────────────────────────────────────────────────────
const GREEN  = '#16a34a'
const RED    = '#dc2626'
const AMBER  = '#ca8a04'
const PINK   = '#ec4899' // salon accent
const PINK_BG = 'rgba(236,72,153,.1)'
const BLUE   = '#3b82f6'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'

// Donut / category palette (pink-led)
const CHART_COLORS = [PINK, PURPLE, BLUE, TEAL, AMBER, GREEN, '#f97316', '#64748b']

// ── Types ────────────────────────────────────────────────────────────────────
type SubTab = 'overview' | 'bookings' | 'clients' | 'staff' | 'products' | 'marketing'

interface PosItem {
  name?: string
  qty?: number
  unit_price?: number
  cost_price?: number
}

interface PosCustomer {
  phone?: string
  name?: string
  birthday?: string // optional ISO / MM-DD if present
}

interface Transaction {
  id?: string | number
  pos_items?: PosItem[]
  pos_customers?: PosCustomer | null
  cashier?: { name?: string } | null
  created_at?: string
  total?: number
  status?: string
  payment_type?: string
}

interface StaffMember {
  id?: string | number
  name?: string
  role?: string
}

interface InventoryItem {
  id?: string | number
  name?: string
  category?: string
  stock?: number
  qty?: number
  price?: number
  unit_price?: number
  cost_price?: number
  cost?: number
}

interface SalonTabProps {
  currencySymbol: string
  selectedLocation: string
  transactions: any[]
  staff: any[]
  inventory: any[]
}

type ClientSegment = 'new' | 'regular' | 'vip' | 'lapsed'

interface ClientRecord {
  key: string
  name: string
  phone: string
  visits: number
  totalSpend: number
  lastVisit: number // epoch ms
  firstVisit: number
  avgSpend: number
  favouriteService: string
  segment: ClientSegment
  health: number // 0-100
  history: { date: number; services: string[]; total: number }[]
  birthdayMonth: number | null
}

interface StylistRecord {
  name: string
  appointments: number
  revenue: number
  avgTicket: number
  uniqueClients: number
  returningClients: number
  retention: number // %
  productAttach: number // %
  clients: { name: string; date: number; services: string[]; total: number }[]
}

interface ProductRecord {
  name: string
  stock: number
  price: number
  cost: number
  margin: number // %
  unitsSold: number
  revenue: number
}

// ── Service categorisation ────────────────────────────────────────────────────
const SERVICE_KEYWORDS: Record<string, string[]> = {
  'Haircut':    ['haircut', 'cut', 'trim', 'fringe', 'clipper', 'fade', 'shave', 'beard'],
  'Colour':     ['colour', 'color', 'dye', 'highlight', 'balayage', 'tint', 'bleach', 'toner'],
  'Treatment':  ['treatment', 'keratin', 'mask', 'olaplex', 'conditioning', 'scalp'],
  'Styling':    ['blow', 'blowdry', 'style', 'updo', 'curl', 'straighten', 'wash'],
  'Nails':      ['nail', 'manicure', 'pedicure', 'gel', 'acrylic'],
  'Wax/Brows':  ['wax', 'brow', 'lash', 'threading', 'tint brow'],
}

const RETAIL_KEYWORDS = ['shampoo', 'conditioner', 'serum', 'spray', 'oil', 'gel', 'wax product', 'product', 'pomade', 'mousse', 'cream']
const SALON_PRODUCT_CATEGORIES = ['salon', 'haircare', 'hair care', 'retail', 'beauty', 'cosmetic', 'styling', 'product']

function categoriseService(name: string): string {
  const n = (name || '').toLowerCase()
  for (const [cat, kws] of Object.entries(SERVICE_KEYWORDS)) {
    if (kws.some(kw => n.includes(kw))) return cat
  }
  return 'Other'
}

function isRetailItem(name: string): boolean {
  const n = (name || '').toLowerCase()
  return RETAIL_KEYWORDS.some(kw => n.includes(kw))
}

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmtMoney(sym: string, n: number): string {
  return formatMoney(sym, n, { space: false })
}

function fmtMoneyShort(sym: string, n: number): string {
  const v = Number.isFinite(n) ? n : 0
  if (Math.abs(v) >= 1000) return sym + (v / 1000).toFixed(1) + 'k'
  return sym + v.toFixed(0)
}

function fmtPct(n: number): string {
  return (Number.isFinite(n) ? n : 0).toFixed(0) + '%'
}

function fmtDate(epoch: number): string {
  if (!epoch) return '—'
  const d = new Date(epoch)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: '2-digit' })
}

function fmtTime(epoch: number): string {
  if (!epoch) return '—'
  const d = new Date(epoch)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function daysAgo(epoch: number): number {
  if (!epoch) return Infinity
  return Math.floor((Date.now() - epoch) / 86400000)
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// Estimate service duration from items (heuristic minutes)
function estimateDuration(items: PosItem[]): number {
  let mins = 0
  for (const it of items || []) {
    const cat = categoriseService(it.name || '')
    const qty = Number(it.qty) || 1
    const per = cat === 'Colour' ? 90
      : cat === 'Treatment' ? 45
      : cat === 'Haircut' ? 30
      : cat === 'Styling' ? 30
      : cat === 'Nails' ? 45
      : cat === 'Wax/Brows' ? 20
      : cat === 'Other' ? 15
      : 15
    if (!isRetailItem(it.name || '')) mins += per * qty
  }
  return Math.max(15, mins)
}

// ── Reusable: sortable header ─────────────────────────────────────────────────
type SortDir = 'asc' | 'desc'

function useSort<T extends string>(initial: T, initDir: SortDir = 'desc') {
  const [sortKey, setSortKey] = useState<T>(initial)
  const [sortDir, setSortDir] = useState<SortDir>(initDir)
  const toggle = useCallback((key: T) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
        return prev
      }
      setSortDir('desc')
      return key
    })
  }, [])
  return { sortKey, sortDir, toggle }
}

// ── Sub-tab builder ───────────────────────────────────────────────────────────
function buildSubTabs(tc: (key: string) => string): { id: SubTab; label: string }[] {
  return [
    { id: 'overview', label: tc('pos_salon.tabOverview') },
    { id: 'bookings', label: tc('pos_salon.tabBookings') },
    { id: 'clients', label: tc('pos_salon.tabClients') },
    { id: 'staff', label: tc('pos_salon.tabStaff') },
    { id: 'products', label: tc('pos_salon.tabProducts') },
    { id: 'marketing', label: tc('pos_salon.tabMarketing') },
  ]
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SalonTab({
  currencySymbol,
  selectedLocation,
  transactions,
  staff,
  inventory,
}: SalonTabProps) {
  const sym = currencySymbol || '$'
  const { tc } = useLang()
  const [subTab, setSubTab] = useState<SubTab>('overview')

  // Normalise transactions defensively
  const txs: Transaction[] = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions]
  )
  const staffArr: StaffMember[] = useMemo(
    () => (Array.isArray(staff) ? staff : []),
    [staff]
  )
  const invArr: InventoryItem[] = useMemo(
    () => (Array.isArray(inventory) ? inventory : []),
    [inventory]
  )

  // Completed/valid transactions only for revenue
  const validTxs = useMemo(
    () => txs.filter(t => {
      const s = (t.status || '').toLowerCase()
      return s !== 'refunded' && s !== 'voided' && s !== 'cancelled'
    }),
    [txs]
  )

  // ── Derived: client database ────────────────────────────────────────────────
  const clients: ClientRecord[] = useMemo(() => {
    const map = new Map<string, ClientRecord>()
    for (const t of validTxs) {
      const cust = t.pos_customers
      if (!cust) continue
      const phone = (cust.phone || '').trim()
      const name = (cust.name || '').trim()
      const key = phone || name
      if (!key) continue
      const epoch = t.created_at ? new Date(t.created_at).getTime() : 0
      const total = Number(t.total) || 0
      const services = (t.pos_items || [])
        .filter(i => !isRetailItem(i.name || ''))
        .map(i => categoriseService(i.name || ''))
      let bMonth: number | null = null
      if (cust.birthday) {
        const bd = new Date(cust.birthday)
        if (!isNaN(bd.getTime())) bMonth = bd.getMonth()
      }
      let rec = map.get(key)
      if (!rec) {
        rec = {
          key,
          name: name || phone || 'Unknown',
          phone,
          visits: 0,
          totalSpend: 0,
          lastVisit: 0,
          firstVisit: epoch || Date.now(),
          avgSpend: 0,
          favouriteService: '—',
          segment: 'new',
          health: 0,
          history: [],
          birthdayMonth: bMonth,
        }
        map.set(key, rec)
      }
      rec.visits += 1
      rec.totalSpend += total
      if (epoch > rec.lastVisit) rec.lastVisit = epoch
      if (epoch && epoch < rec.firstVisit) rec.firstVisit = epoch
      if (bMonth !== null) rec.birthdayMonth = bMonth
      rec.history.push({ date: epoch, services, total })
    }
    // Finalise computed fields
    const out: ClientRecord[] = []
    for (const rec of Array.from(map.values())) {
      rec.avgSpend = rec.visits ? rec.totalSpend / rec.visits : 0
      // favourite service
      const counts = new Map<string, number>()
      for (const h of rec.history) for (const s of h.services) counts.set(s, (counts.get(s) || 0) + 1)
      let fav = '—', favN = 0
      for (const [s, c] of Array.from(counts.entries())) if (c > favN && s !== 'Other') { fav = s; favN = c }
      rec.favouriteService = fav
      // segment
      const recency = daysAgo(rec.lastVisit)
      if (recency > 60) rec.segment = 'lapsed'
      else if (rec.visits >= 6) rec.segment = 'vip'
      else if (rec.visits >= 2) rec.segment = 'regular'
      else rec.segment = 'new'
      // health score: recency (40), frequency (30), spend (30)
      const recencyScore = recency <= 30 ? 40 : recency <= 60 ? 25 : recency <= 120 ? 10 : 0
      const freqScore = Math.min(30, rec.visits * 6)
      const spendScore = Math.min(30, (rec.avgSpend / 100) * 30)
      rec.health = Math.round(recencyScore + freqScore + spendScore)
      rec.history.sort((a, b) => b.date - a.date)
      out.push(rec)
    }
    return out
  }, [validTxs])

  // Segment counts
  const segmentCounts = useMemo(() => {
    const c = { new: 0, regular: 0, vip: 0, lapsed: 0 }
    for (const cl of clients) c[cl.segment] += 1
    return c
  }, [clients])

  // Retention: % of clients with a return visit within 60 days of a prior visit
  const retentionRate = useMemo(() => {
    let returned = 0, eligible = 0
    for (const cl of clients) {
      if (cl.visits < 1) continue
      eligible += 1
      const dates = cl.history.map(h => h.date).filter(Boolean).sort((a, b) => a - b)
      for (let i = 1; i < dates.length; i++) {
        if (dates[i] - dates[i - 1] <= 60 * 86400000) { returned += 1; break }
      }
    }
    return eligible ? (returned / eligible) * 100 : 0
  }, [clients])

  // ── Derived: stylists ─────────────────────────────────────────────────────────
  const stylists: StylistRecord[] = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000
    const map = new Map<string, StylistRecord>()
    // clientSeen per stylist
    const clientCount = new Map<string, Map<string, number>>()
    for (const t of validTxs) {
      const name = (t.cashier?.name || 'Unassigned').trim() || 'Unassigned'
      const epoch = t.created_at ? new Date(t.created_at).getTime() : 0
      if (epoch && epoch < cutoff) continue
      const total = Number(t.total) || 0
      const items = t.pos_items || []
      const services = items.filter(i => !isRetailItem(i.name || '')).map(i => i.name || '')
      const hasRetail = items.some(i => isRetailItem(i.name || ''))
      const hasService = services.length > 0
      let rec = map.get(name)
      if (!rec) {
        rec = {
          name, appointments: 0, revenue: 0, avgTicket: 0,
          uniqueClients: 0, returningClients: 0, retention: 0,
          productAttach: 0, clients: [],
        }
        map.set(name, rec)
        clientCount.set(name, new Map())
      }
      rec.appointments += 1
      rec.revenue += total
      const custKey = (t.pos_customers?.phone || t.pos_customers?.name || '').trim()
      if (custKey) {
        const cc = clientCount.get(name)!
        cc.set(custKey, (cc.get(custKey) || 0) + 1)
      }
      // product attachment counted on service transactions
      ;(rec as any)._svcTx = ((rec as any)._svcTx || 0) + (hasService ? 1 : 0)
      ;(rec as any)._svcWithRetail = ((rec as any)._svcWithRetail || 0) + (hasService && hasRetail ? 1 : 0)
      rec.clients.push({
        name: t.pos_customers?.name || t.pos_customers?.phone || 'Walk-in',
        date: epoch,
        services: services.length ? services : ['Service'],
        total,
      })
    }
    const out: StylistRecord[] = []
    for (const rec of Array.from(map.values())) {
      rec.avgTicket = rec.appointments ? rec.revenue / rec.appointments : 0
      const cc = clientCount.get(rec.name)!
      rec.uniqueClients = cc.size
      let returning = 0
      for (const v of Array.from(cc.values())) if (v >= 2) returning += 1
      rec.returningClients = returning
      rec.retention = cc.size ? (returning / cc.size) * 100 : 0
      const svcTx = (rec as any)._svcTx || 0
      const svcRetail = (rec as any)._svcWithRetail || 0
      rec.productAttach = svcTx ? (svcRetail / svcTx) * 100 : 0
      rec.clients.sort((a, b) => b.date - a.date)
      out.push(rec)
    }
    out.sort((a, b) => b.revenue - a.revenue)
    return out
  }, [validTxs])

  // ── Derived: products (retail) ──────────────────────────────────────────────
  const products: ProductRecord[] = useMemo(() => {
    // Units sold from transaction items (last 30d)
    const cutoff = Date.now() - 30 * 86400000
    const sold = new Map<string, { units: number; rev: number }>()
    for (const t of validTxs) {
      const epoch = t.created_at ? new Date(t.created_at).getTime() : 0
      if (epoch && epoch < cutoff) continue
      for (const it of t.pos_items || []) {
        if (!isRetailItem(it.name || '')) continue
        const key = (it.name || '').toLowerCase()
        const qty = Number(it.qty) || 1
        const rev = (Number(it.unit_price) || 0) * qty
        const cur = sold.get(key) || { units: 0, rev: 0 }
        cur.units += qty
        cur.rev += rev
        sold.set(key, cur)
      }
    }
    const out: ProductRecord[] = []
    const seen = new Set<string>()
    // From inventory with salon-relevant categories or retail-keyword names
    for (const inv of invArr) {
      const name = inv.name || ''
      const cat = (inv.category || '').toLowerCase()
      const relevant = SALON_PRODUCT_CATEGORIES.some(c => cat.includes(c)) || isRetailItem(name)
      if (!relevant) continue
      const key = name.toLowerCase()
      seen.add(key)
      const price = Number(inv.price ?? inv.unit_price) || 0
      const cost = Number(inv.cost_price ?? inv.cost) || 0
      const stock = Number(inv.stock ?? inv.qty) || 0
      const s = sold.get(key) || { units: 0, rev: 0 }
      const margin = price > 0 ? ((price - cost) / price) * 100 : 0
      out.push({ name: name || 'Unnamed', stock, price, cost, margin, unitsSold: s.units, revenue: s.rev })
    }
    // Retail items sold but not matched in inventory
    for (const [key, s] of Array.from(sold.entries())) {
      if (seen.has(key)) continue
      out.push({ name: key, stock: 0, price: s.units ? s.rev / s.units : 0, cost: 0, margin: 0, unitsSold: s.units, revenue: s.rev })
    }
    out.sort((a, b) => b.revenue - a.revenue)
    return out
  }, [validTxs, invArr])

  // ── Derived: today's metrics ─────────────────────────────────────────────────
  const today = useMemo(() => {
    const start = startOfToday()
    const list = validTxs.filter(t => {
      const e = t.created_at ? new Date(t.created_at).getTime() : 0
      return e >= start
    })
    return list
  }, [validTxs])

  // Overview KPIs
  const overviewStats = useMemo(() => {
    const appts = today.length
    // walk-in estimate: transactions with no customer record
    const walkins = today.filter(t => !t.pos_customers || (!t.pos_customers.phone && !t.pos_customers.name)).length
    const revenue = today.reduce((s, t) => s + (Number(t.total) || 0), 0)
    // avg service value across all-time service transactions
    const svcTxs = validTxs.filter(t => (t.pos_items || []).some(i => !isRetailItem(i.name || '')))
    const avgService = svcTxs.length
      ? svcTxs.reduce((s, t) => s + (Number(t.total) || 0), 0) / svcTxs.length
      : 0
    const returnRate = clients.length
      ? (clients.filter(c => c.visits >= 2).length / clients.length) * 100
      : 0
    // top service by revenue (all time)
    const svcRev = new Map<string, number>()
    for (const t of validTxs) {
      for (const it of t.pos_items || []) {
        if (isRetailItem(it.name || '')) continue
        const cat = categoriseService(it.name || '')
        const rev = (Number(it.unit_price) || 0) * (Number(it.qty) || 1)
        svcRev.set(cat, (svcRev.get(cat) || 0) + rev)
      }
    }
    let topService = '—', topRev = 0
    for (const [c, r] of Array.from(svcRev.entries())) if (r > topRev && c !== 'Other') { topService = c; topRev = r }
    return { appts, walkins, revenue, avgService, returnRate, topService }
  }, [today, validTxs, clients])

  // Revenue by hour (today)
  const hourlyRevenue = useMemo(() => {
    const arr = new Array(24).fill(0)
    for (const t of today) {
      const e = t.created_at ? new Date(t.created_at) : null
      if (!e) continue
      arr[e.getHours()] += Number(t.total) || 0
    }
    return arr
  }, [today])

  // Service category revenue breakdown (all time)
  const serviceBreakdown = useMemo(() => {
    const m = new Map<string, number>()
    for (const t of validTxs) {
      for (const it of t.pos_items || []) {
        if (isRetailItem(it.name || '')) continue
        const cat = categoriseService(it.name || '')
        const rev = (Number(it.unit_price) || 0) * (Number(it.qty) || 1)
        m.set(cat, (m.get(cat) || 0) + rev)
      }
    }
    const arr = Array.from(m.entries()).map(([name, value]) => ({ name, value }))
    arr.sort((a, b) => b.value - a.value)
    return arr
  }, [validTxs])

  // Occupancy: % of business hours (9-19) today with at least one tx
  const occupancy = useMemo(() => {
    const open = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    const active = new Set<number>()
    for (const t of today) {
      const e = t.created_at ? new Date(t.created_at) : null
      if (e) active.add(e.getHours())
    }
    const hit = open.filter(h => active.has(h)).length
    return (hit / open.length) * 100
  }, [today])

  // Quick stats
  const quickStats = useMemo(() => {
    const dayRev = new Array(7).fill(0)
    const hourCount = new Array(24).fill(0)
    for (const t of validTxs) {
      const e = t.created_at ? new Date(t.created_at) : null
      if (!e) continue
      dayRev[e.getDay()] += Number(t.total) || 0
      hourCount[e.getHours()] += 1
    }
    let busiestDay = 0, maxDay = -1
    dayRev.forEach((v, i) => { if (v > maxDay) { maxDay = v; busiestDay = i } })
    let peakHour = 0, maxHour = -1
    hourCount.forEach((v, i) => { if (v > maxHour) { maxHour = v; peakHour = i } })
    const totalServices = validTxs.reduce(
      (s, t) => s + (t.pos_items || []).filter(i => !isRetailItem(i.name || '')).length, 0
    )
    const clientVisits = clients.reduce((s, c) => s + c.visits, 0)
    const avgServicesPerClient = clientVisits ? totalServices / clientVisits : 0
    return {
      busiestDay: maxDay > 0 ? DAY_NAMES[busiestDay] : '—',
      peakHour: maxHour > 0 ? `${peakHour}:00` : '—',
      avgServicesPerClient,
    }
  }, [validTxs, clients])

  // Product attachment rate (all time)
  const attachmentRate = useMemo(() => {
    const svcTxs = validTxs.filter(t => (t.pos_items || []).some(i => !isRetailItem(i.name || '')))
    if (!svcTxs.length) return 0
    const withRetail = svcTxs.filter(t => (t.pos_items || []).some(i => isRetailItem(i.name || ''))).length
    return (withRetail / svcTxs.length) * 100
  }, [validTxs])

  const isEmpty = txs.length === 0

  // ── Sub-tab bar ───────────────────────────────────────────────────────────────
  const subTabs = buildSubTabs(tc)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes salonPulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>💇</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>{tc('pos_salon.salonAnalytics')}</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)' }}>
            {selectedLocation || tc('pos_salon.allLocations')} {tc('pos_salon.derivedFromPos')}
          </div>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--b)', paddingBottom: 8 }}>
        {subTabs.map(st => {
          const active = subTab === st.id
          return (
            <button
              key={st.id}
              onClick={() => setSubTab(st.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                border: `1px solid ${active ? PINK : 'var(--b)'}`,
                background: active ? PINK_BG : 'var(--sf)',
                color: active ? PINK : 'var(--tx2)',
                fontWeight: active ? 700 : 500,
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              {st.label}
            </button>
          )
        })}
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {subTab === 'overview' && (
            <OverviewSub
              sym={sym}
              stats={overviewStats}
              hourlyRevenue={hourlyRevenue}
              serviceBreakdown={serviceBreakdown}
              occupancy={occupancy}
              quickStats={quickStats}
            />
          )}
          {subTab === 'bookings' && (
            <BookingsSub sym={sym} txs={validTxs} stylists={stylists} />
          )}
          {subTab === 'clients' && (
            <ClientsSub sym={sym} clients={clients} retentionRate={retentionRate} />
          )}
          {subTab === 'staff' && (
            <StaffSub sym={sym} stylists={stylists} />
          )}
          {subTab === 'products' && (
            <ProductsSub sym={sym} products={products} attachmentRate={attachmentRate} />
          )}
          {subTab === 'marketing' && (
            <MarketingSub sym={sym} clients={clients} segmentCounts={segmentCounts} />
          )}
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRESENTATION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState() {
  const { tc } = useLang()
  return (
    <div style={{
      border: '1px dashed var(--b)',
      borderRadius: 12,
      padding: '48px 24px',
      textAlign: 'center',
      background: 'var(--sf)',
    }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>💇</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>
        {tc('pos_salon.emptyTitle')}
      </div>
      <div style={{ fontSize: 11, color: 'var(--tx3)', maxWidth: 420, margin: '0 auto' }}>
        {tc('pos_salon.emptyBody')}
      </div>
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      border: '1px solid var(--b)',
      borderRadius: 12,
      background: 'var(--sf)',
      padding: 16,
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 12 }}>
      {children}
    </div>
  )
}

interface KpiProps {
  label: string
  value: string
  sub?: string
  highlight?: boolean
  active?: boolean
  onClick?: () => void
}
function Kpi({ label, value, sub, highlight, active, onClick }: KpiProps) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        border: `1px solid ${active ? PINK : 'var(--b)'}`,
        borderRadius: 12,
        background: active ? PINK_BG : 'var(--sf)',
        padding: 14,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all .15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: .4, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{
        fontSize: 20,
        fontWeight: 800,
        color: highlight ? PINK : 'var(--tx)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{sub}</div>}
    </button>
  )
}

function SortHeader<T extends string>({
  label, k, sortKey, sortDir, onSort, align = 'left',
}: {
  label: string; k: T; sortKey: T; sortDir: SortDir; onSort: (k: T) => void; align?: 'left' | 'right'
}) {
  const active = sortKey === k
  return (
    <th
      onClick={() => onSort(k)}
      style={{
        textAlign: align,
        padding: '8px 10px',
        fontSize: 9,
        fontWeight: 700,
        color: active ? PINK : 'var(--tx3)',
        textTransform: 'uppercase',
        letterSpacing: .3,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        borderBottom: '1px solid var(--b)',
      }}
    >
      {label}{active ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
    </th>
  )
}

function Td({ children, align = 'left', mono, color }: {
  children: React.ReactNode; align?: 'left' | 'right'; mono?: boolean; color?: string
}) {
  return (
    <td style={{
      padding: '9px 10px',
      fontSize: 11,
      color: color || 'var(--tx2)',
      textAlign: align,
      fontVariantNumeric: mono ? 'tabular-nums' : undefined,
      borderBottom: '1px solid var(--b)',
    }}>
      {children}
    </td>
  )
}

function SegmentBadge({ segment }: { segment: ClientSegment }) {
  const { tc } = useLang()
  const cfg: Record<ClientSegment, { c: string; key: string }> = {
    new:     { c: BLUE,   key: 'pos_salon.segNew' },
    regular: { c: GREEN,  key: 'pos_salon.segRegular' },
    vip:     { c: PINK,   key: 'pos_salon.segVip' },
    lapsed:  { c: AMBER,  key: 'pos_salon.segLapsed' },
  }
  const { c, key } = cfg[segment]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 9999,
      fontSize: 9,
      fontWeight: 700,
      color: c,
      background: `${c}1a`,
      border: `1px solid ${c}55`,
    }}>
      {tc(key)}
    </span>
  )
}

function HealthBar({ score }: { score: number }) {
  const c = score >= 70 ? GREEN : score >= 40 ? AMBER : RED
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
      <div style={{ width: 50, height: 6, borderRadius: 3, background: 'var(--ev)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, score)}%`, height: '100%', background: c }} />
      </div>
      <span style={{ fontSize: 10, color: c, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{score}</span>
    </div>
  )
}

// ── SVG: vertical bar chart ─────────────────────────────────────────────────────
function BarChartHours({ data, sym, color = PINK }: { data: number[]; sym: string; color?: string }) {
  const W = 640, H = 180, padB = 24, padL = 8
  const open = data.map((v, h) => ({ h, v })).filter(d => d.h >= 7 && d.h <= 20)
  const max = Math.max(1, ...open.map(d => d.v))
  const bw = (W - padL * 2) / open.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} role="img" aria-label="Revenue by hour">
      {open.map((d, i) => {
        const bh = (d.v / max) * (H - padB - 10)
        const x = padL + i * bw
        const y = H - padB - bh
        return (
          <g key={d.h}>
            <rect
              x={x + 2} y={y} width={bw - 4} height={Math.max(0, bh)}
              rx={3} fill={d.v > 0 ? color : 'var(--b)'} opacity={d.v > 0 ? 0.9 : 0.4}
            />
            {d.v > 0 && (
              <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize="9" fill="var(--tx3)">
                {fmtMoneyShort(sym, d.v)}
              </text>
            )}
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--tx3)">
              {d.h}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── SVG: donut chart ────────────────────────────────────────────────────────────
function DonutChart({ data, sym }: { data: { name: string; value: number }[]; sym: string }) {
  const { tc } = useLang()
  const total = data.reduce((s, d) => s + d.value, 0)
  const size = 160, r = 64, cx = size / 2, cy = size / 2, sw = 26
  if (total <= 0) {
    return <div style={{ fontSize: 11, color: 'var(--tx3)', padding: 20 }}>{tc('pos_salon.noServiceRevenue')}</div>
  }
  let acc = 0
  const circ = 2 * Math.PI * r
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ev)" strokeWidth={sw} />
        {data.map((d, i) => {
          const frac = d.value / total
          const dash = frac * circ
          const offset = -acc * circ
          acc += frac
          return (
            <circle
              key={d.name}
              cx={cx} cy={cy} r={r} fill="none"
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
            />
          )
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 160 }}>
        {data.map((d, i) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span style={{ color: 'var(--tx2)', flex: 1 }}>{d.name}</span>
            <span style={{ color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
              {fmtMoney(sym, d.value)} · {((d.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SVG: horizontal bar chart ───────────────────────────────────────────────────
function HBarChart({ data, sym, color = PINK }: {
  data: { label: string; value: number }[]; sym: string; color?: string
}) {
  const { tc } = useLang()
  if (!data.length) return <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_salon.noData')}</div>
  const max = Math.max(1, ...data.map(d => d.value))
  const rowH = 30
  const H = data.length * rowH + 8
  const labelW = 120
  const W = 640
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const y = i * rowH + 4
        const bw = (d.value / max) * (W - labelW - 80)
        return (
          <g key={d.label + i}>
            <text x={0} y={y + rowH / 2 + 4} fontSize="11" fill="var(--tx2)">
              {d.label.length > 16 ? d.label.slice(0, 15) + '…' : d.label}
            </text>
            <rect x={labelW} y={y + 4} width={W - labelW - 80} height={rowH - 12} rx={4} fill="var(--ev)" />
            <rect x={labelW} y={y + 4} width={Math.max(2, bw)} height={rowH - 12} rx={4} fill={color} opacity={0.9} />
            <text x={W - 4} y={y + rowH / 2 + 4} fontSize="11" fill="var(--tx3)" textAnchor="end" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtMoney(sym, d.value)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW SUB-TAB
// ─────────────────────────────────────────────────────────────────────────────
function OverviewSub({
  sym, stats, hourlyRevenue, serviceBreakdown, occupancy, quickStats,
}: {
  sym: string
  stats: { appts: number; walkins: number; revenue: number; avgService: number; returnRate: number; topService: string }
  hourlyRevenue: number[]
  serviceBreakdown: { name: string; value: number }[]
  occupancy: number
  quickStats: { busiestDay: string; peakHour: string; avgServicesPerClient: number }
}) {
  const { tc } = useLang()
  const [activeKpi, setActiveKpi] = useState<string | null>(null)
  const k = (id: string) => () => setActiveKpi(prev => (prev === id ? null : id))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <Kpi label={tc('pos_salon.kpiTodayAppts')} value={String(stats.appts)} sub={tc('pos_salon.kpiTransactionsToday')} active={activeKpi === 'appts'} onClick={k('appts')} highlight />
        <Kpi label={tc('pos_salon.kpiWalkins')} value={String(stats.walkins)} sub={tc('pos_salon.kpiEstNoRecord')} active={activeKpi === 'walk'} onClick={k('walk')} />
        <Kpi label={tc('pos_salon.kpiRevenue')} value={fmtMoney(sym, stats.revenue)} sub={tc('pos_salon.kpiToday')} active={activeKpi === 'rev'} onClick={k('rev')} highlight />
        <Kpi label={tc('pos_salon.kpiAvgServiceValue')} value={fmtMoney(sym, stats.avgService)} sub={tc('pos_salon.kpiPerServiceTicket')} active={activeKpi === 'avg'} onClick={k('avg')} />
        <Kpi label={tc('pos_salon.kpiReturnClientRate')} value={fmtPct(stats.returnRate)} sub={tc('pos_salon.kpiClientsWith2Visits')} active={activeKpi === 'ret'} onClick={k('ret')} />
        <Kpi label={tc('pos_salon.kpiTopService')} value={stats.topService} sub={tc('pos_salon.kpiByRevenue')} active={activeKpi === 'top'} onClick={k('top')} highlight />
      </div>

      <Card>
        <SectionTitle>{tc('pos_salon.revenueByHourToday')}</SectionTitle>
        {hourlyRevenue.some(v => v > 0)
          ? <BarChartHours data={hourlyRevenue} sym={sym} />
          : <div style={{ fontSize: 11, color: 'var(--tx3)', padding: 16 }}>{tc('pos_salon.noTransactionsToday')}</div>}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <Card>
          <SectionTitle>{tc('pos_salon.serviceMixByRevenue')}</SectionTitle>
          <DonutChart data={serviceBreakdown} sym={sym} />
        </Card>
        <Card>
          <SectionTitle>{tc('pos_salon.chairOccupancyToday')}</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <OccupancyRing pct={occupancy} />
            <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.6 }}>
              {tc('pos_salon.occupancyNote')}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>{tc('pos_salon.quickStats')}</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <MiniStat label={tc('pos_salon.busiestDay')} value={quickStats.busiestDay} />
          <MiniStat label={tc('pos_salon.peakHour')} value={quickStats.peakHour} />
          <MiniStat label={tc('pos_salon.avgServicesPerClient')} value={quickStats.avgServicesPerClient.toFixed(1)} />
        </div>
      </Card>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 10, background: 'var(--ev)', border: '1px solid var(--b)' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: PINK }}>{value}</div>
    </div>
  )
}

function OccupancyRing({ pct }: { pct: number }) {
  const size = 110, r = 44, cx = size / 2, cy = size / 2, sw = 12
  const circ = 2 * Math.PI * r
  const dash = (Math.min(100, pct) / 100) * circ
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ev)" strokeWidth={sw} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={PINK} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} />
      </g>
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="20" fontWeight="800" fill="var(--tx)">
        {pct.toFixed(0)}%
      </text>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKINGS SUB-TAB
// ─────────────────────────────────────────────────────────────────────────────
function BookingsSub({ sym, txs, stylists }: {
  sym: string; txs: Transaction[]; stylists: StylistRecord[]
}) {
  const { tc } = useLang()
  const [dateFilter, setDateFilter] = useState<string>('') // yyyy-mm-dd
  const [stylistFilter, setStylistFilter] = useState<string>('')
  const [serviceFilter, setServiceFilter] = useState<string>('')

  const serviceCats = ['Haircut', 'Colour', 'Treatment', 'Styling', 'Nails', 'Wax/Brows', 'Other']

  const appointments = useMemo(() => {
    return txs
      .map(t => {
        const epoch = t.created_at ? new Date(t.created_at).getTime() : 0
        const items = t.pos_items || []
        const serviceItems = items.filter(i => !isRetailItem(i.name || ''))
        const cats = Array.from(new Set(serviceItems.map(i => categoriseService(i.name || ''))))
        return {
          epoch,
          client: t.pos_customers?.name || t.pos_customers?.phone || 'Walk-in',
          serviceNames: serviceItems.map(i => i.name || 'Service'),
          cats,
          stylist: t.cashier?.name || 'Unassigned',
          duration: estimateDuration(items),
          total: Number(t.total) || 0,
          payment: t.payment_type || '—',
        }
      })
      .sort((a, b) => b.epoch - a.epoch)
  }, [txs])

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (dateFilter) {
        const d = new Date(a.epoch)
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        if (ds !== dateFilter) return false
      }
      if (stylistFilter && a.stylist !== stylistFilter) return false
      if (serviceFilter && !a.cats.includes(serviceFilter)) return false
      return true
    })
  }, [appointments, dateFilter, stylistFilter, serviceFilter])

  // today's timeline
  const todayAppts = useMemo(() => {
    const start = startOfToday()
    return appointments.filter(a => a.epoch >= start)
  }, [appointments])

  const selectStyle: React.CSSProperties = {
    padding: '7px 10px', borderRadius: 8, border: '1px solid var(--b)',
    background: 'var(--sf)', color: 'var(--tx2)', fontSize: 11,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <SectionTitle>{tc('pos_salon.todayTimeline')}</SectionTitle>
        {todayAppts.length
          ? <TimelineSVG appts={todayAppts.map(a => ({ epoch: a.epoch, duration: a.duration, label: a.client }))} />
          : <div style={{ fontSize: 11, color: 'var(--tx3)', padding: 12 }}>{tc('pos_salon.noAppointmentsToday')}</div>}
      </Card>

      <Card>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={selectStyle} />
          <select value={stylistFilter} onChange={e => setStylistFilter(e.target.value)} style={selectStyle}>
            <option value="">{tc('pos_salon.allStylists')}</option>
            {stylists.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} style={selectStyle}>
            <option value="">{tc('pos_salon.allServices')}</option>
            {serviceCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(dateFilter || stylistFilter || serviceFilter) && (
            <button
              onClick={() => { setDateFilter(''); setStylistFilter(''); setServiceFilter('') }}
              style={{ ...selectStyle, cursor: 'pointer', color: PINK, borderColor: PINK }}
            >
              {tc('pos_salon.clear')}
            </button>
          )}
          <div style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 10, color: 'var(--tx3)' }}>
            {tc('pos_salon.appointmentCount', { n: filtered.length })}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr>
                {[
                  tc('pos_salon.colTime'),
                  tc('pos_salon.colClient'),
                  tc('pos_salon.colServices'),
                  tc('pos_salon.colStylist'),
                  tc('pos_salon.colDuration'),
                  tc('pos_salon.colTotal'),
                  tc('pos_salon.colPayment'),
                ].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i >= 4 && i !== 6 ? 'right' : 'left',
                    padding: '8px 10px', fontSize: 9, fontWeight: 700, color: 'var(--tx3)',
                    textTransform: 'uppercase', letterSpacing: .3, borderBottom: '1px solid var(--b)',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--tx3)', fontSize: 11 }}>{tc('pos_salon.noAppointmentsMatch')}</td></tr>
              )}
              {filtered.slice(0, 200).map((a, i) => (
                <tr key={i}>
                  <Td mono>{fmtTime(a.epoch)}<div style={{ fontSize: 9, color: 'var(--tx3)' }}>{fmtDate(a.epoch)}</div></Td>
                  <Td color="var(--tx)">{a.client}</Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {a.cats.length ? a.cats.map(c => (
                        <span key={c} style={{ fontSize: 9, padding: '1px 7px', borderRadius: 9999, background: PINK_BG, color: PINK }}>{c}</span>
                      )) : <span style={{ color: 'var(--tx3)' }}>—</span>}
                    </div>
                  </Td>
                  <Td>{a.stylist}</Td>
                  <Td align="right" mono>{a.duration}m</Td>
                  <Td align="right" mono color="var(--tx)">{fmtMoney(sym, a.total)}</Td>
                  <Td>{a.payment}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ borderStyle: 'dashed' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>{tc('pos_salon.noShowComingSoonTitle')}</div>
        <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.6 }}>
          {tc('pos_salon.noShowComingSoonBody')}
        </div>
      </Card>
    </div>
  )
}

function TimelineSVG({ appts }: { appts: { epoch: number; duration: number; label: string }[] }) {
  const startHour = 8, endHour = 20
  const W = 720, H = 90, padL = 40, padR = 10
  const span = endHour - startHour
  const usable = W - padL - padR
  const xFor = (h: number) => padL + ((h - startHour) / span) * usable
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} role="img" aria-label="Today timeline">
      {Array.from({ length: span + 1 }, (_, i) => startHour + i).map(h => (
        <g key={h}>
          <line x1={xFor(h)} y1={20} x2={xFor(h)} y2={H - 20} stroke="var(--b)" strokeWidth={1} />
          <text x={xFor(h)} y={14} textAnchor="middle" fontSize="9" fill="var(--tx3)">{h}</text>
        </g>
      ))}
      {appts.map((a, i) => {
        const d = new Date(a.epoch)
        const startH = d.getHours() + d.getMinutes() / 60
        const x = xFor(Math.max(startHour, startH))
        const w = Math.max(6, (a.duration / 60 / span) * usable)
        const y = 28 + (i % 3) * 16
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={12} rx={3} fill={PINK} opacity={0.85} />
            <title>{a.label} · {fmtTime(a.epoch)} · {a.duration}m</title>
          </g>
        )
      })}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS SUB-TAB
// ─────────────────────────────────────────────────────────────────────────────
type ClientSortKey = 'name' | 'visits' | 'totalSpend' | 'lastVisit' | 'avgSpend' | 'health'

function ClientsSub({ sym, clients, retentionRate }: {
  sym: string; clients: ClientRecord[]; retentionRate: number
}) {
  const { tc } = useLang()
  const { sortKey, sortDir, toggle } = useSort<ClientSortKey>('totalSpend')
  const [segFilter, setSegFilter] = useState<ClientSegment | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const rows = useMemo(() => {
    let list = segFilter === 'all' ? clients : clients.filter(c => c.segment === segFilter)
    list = [...list].sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break
        case 'visits': av = a.visits; bv = b.visits; break
        case 'totalSpend': av = a.totalSpend; bv = b.totalSpend; break
        case 'lastVisit': av = a.lastVisit; bv = b.lastVisit; break
        case 'avgSpend': av = a.avgSpend; bv = b.avgSpend; break
        case 'health': av = a.health; bv = b.health; break
        default: av = 0; bv = 0
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [clients, segFilter, sortKey, sortDir])

  const segChips: { id: ClientSegment | 'all'; label: string }[] = [
    { id: 'all', label: tc('pos_salon.segChipAll', { n: clients.length }) },
    { id: 'new', label: tc('pos_salon.segChipNew', { n: clients.filter(c => c.segment === 'new').length }) },
    { id: 'regular', label: tc('pos_salon.segChipRegular', { n: clients.filter(c => c.segment === 'regular').length }) },
    { id: 'vip', label: tc('pos_salon.segChipVip', { n: clients.filter(c => c.segment === 'vip').length }) },
    { id: 'lapsed', label: tc('pos_salon.segChipLapsed', { n: clients.filter(c => c.segment === 'lapsed').length }) },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <Kpi label={tc('pos_salon.kpiTotalClients')} value={String(clients.length)} highlight />
        <Kpi label={tc('pos_salon.kpi60DayRetention')} value={fmtPct(retentionRate)} sub={tc('pos_salon.kpiReturnedWithin60d')} />
        <Kpi label={tc('pos_salon.kpiVipClients')} value={String(clients.filter(c => c.segment === 'vip').length)} sub={tc('pos_salon.kpi6PlusVisits')} />
        <Kpi label={tc('pos_salon.kpiLapsed')} value={String(clients.filter(c => c.segment === 'lapsed').length)} sub={tc('pos_salon.kpi60DaysInactive')} />
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {segChips.map(s => {
            const active = segFilter === s.id
            return (
              <button key={s.id} onClick={() => setSegFilter(s.id)} style={{
                padding: '5px 12px', borderRadius: 9999, fontSize: 10, fontWeight: active ? 700 : 500,
                border: `1px solid ${active ? PINK : 'var(--b)'}`,
                background: active ? PINK_BG : 'var(--sf)', color: active ? PINK : 'var(--tx2)', cursor: 'pointer',
              }}>{s.label}</button>
            )
          })}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr>
                <SortHeader label={tc('pos_salon.colName')} k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggle} />
                <th style={thStyle('left')}>{tc('pos_salon.colPhone')}</th>
                <SortHeader label={tc('pos_salon.colVisits')} k="visits" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colTotalSpend')} k="totalSpend" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colLastVisit')} k="lastVisit" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colAvgSpend')} k="avgSpend" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <th style={thStyle('left')}>{tc('pos_salon.colFavourite')}</th>
                <th style={thStyle('left')}>{tc('pos_salon.colSegment')}</th>
                <SortHeader label={tc('pos_salon.colHealth')} k="health" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: 'var(--tx3)', fontSize: 11 }}>{tc('pos_salon.noClientsInSegment')}</td></tr>
              )}
              {rows.slice(0, 300).map(c => {
                const open = expanded === c.key
                return (
                  <>
                    <tr key={c.key} onClick={() => setExpanded(open ? null : c.key)} style={{ cursor: 'pointer' }}>
                      <Td color="var(--tx)">{open ? '▾ ' : '▸ '}{c.name}</Td>
                      <Td>{c.phone || '—'}</Td>
                      <Td align="right" mono>{c.visits}</Td>
                      <Td align="right" mono color="var(--tx)">{fmtMoney(sym, c.totalSpend)}</Td>
                      <Td align="right">{fmtDate(c.lastVisit)}</Td>
                      <Td align="right" mono>{fmtMoney(sym, c.avgSpend)}</Td>
                      <Td>{c.favouriteService}</Td>
                      <Td><SegmentBadge segment={c.segment} /></Td>
                      <Td align="right"><HealthBar score={c.health} /></Td>
                    </tr>
                    {open && (
                      <tr key={c.key + '-exp'}>
                        <td colSpan={9} style={{ padding: 0, background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
                          <div style={{ padding: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>
                              {tc('pos_salon.visitHistory', { n: c.history.length })}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {c.history.slice(0, 20).map((h, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10 }}>
                                  <span style={{ color: 'var(--tx3)', width: 90, fontVariantNumeric: 'tabular-nums' }}>{fmtDate(h.date)}</span>
                                  <span style={{ flex: 1, color: 'var(--tx2)' }}>
                                    {h.services.length ? Array.from(new Set(h.services)).join(', ') : 'Service'}
                                  </span>
                                  <span style={{ color: 'var(--tx)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(sym, h.total)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function thStyle(align: 'left' | 'right'): React.CSSProperties {
  return {
    textAlign: align, padding: '8px 10px', fontSize: 9, fontWeight: 700,
    color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: .3,
    borderBottom: '1px solid var(--b)', whiteSpace: 'nowrap',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF SUB-TAB
// ─────────────────────────────────────────────────────────────────────────────
type StylistSortKey = 'name' | 'appointments' | 'revenue' | 'avgTicket' | 'retention' | 'productAttach'

function StaffSub({ sym, stylists }: { sym: string; stylists: StylistRecord[] }) {
  const { tc } = useLang()
  const { sortKey, sortDir, toggle } = useSort<StylistSortKey>('revenue')
  const [expanded, setExpanded] = useState<string | null>(null)

  const rows = useMemo(() => {
    return [...stylists].sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break
        case 'appointments': av = a.appointments; bv = b.appointments; break
        case 'revenue': av = a.revenue; bv = b.revenue; break
        case 'avgTicket': av = a.avgTicket; bv = b.avgTicket; break
        case 'retention': av = a.retention; bv = b.retention; break
        case 'productAttach': av = a.productAttach; bv = b.productAttach; break
        default: av = 0; bv = 0
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [stylists, sortKey, sortDir])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <SectionTitle>{tc('pos_salon.revenuePerStylist')}</SectionTitle>
        <HBarChart data={stylists.map(s => ({ label: s.name, value: s.revenue }))} sym={sym} />
      </Card>

      <Card>
        <SectionTitle>{tc('pos_salon.stylistPerformance')}</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr>
                <SortHeader label={tc('pos_salon.colStylistName')} k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggle} />
                <SortHeader label={tc('pos_salon.colAppts30d')} k="appointments" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colRevenue')} k="revenue" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colAvgTicket')} k="avgTicket" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colRetention')} k="retention" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colProductAttach')} k="productAttach" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--tx3)', fontSize: 11 }}>{tc('pos_salon.noStylistActivity')}</td></tr>
              )}
              {rows.map(s => {
                const open = expanded === s.name
                return (
                  <>
                    <tr key={s.name} onClick={() => setExpanded(open ? null : s.name)} style={{ cursor: 'pointer' }}>
                      <Td color="var(--tx)">{open ? '▾ ' : '▸ '}{s.name}</Td>
                      <Td align="right" mono>{s.appointments}</Td>
                      <Td align="right" mono color="var(--tx)">{fmtMoney(sym, s.revenue)}</Td>
                      <Td align="right" mono>{fmtMoney(sym, s.avgTicket)}</Td>
                      <Td align="right" mono color={s.retention >= 50 ? GREEN : 'var(--tx2)'}>{fmtPct(s.retention)}</Td>
                      <Td align="right" mono color={s.productAttach >= 30 ? GREEN : 'var(--tx2)'}>{fmtPct(s.productAttach)}</Td>
                    </tr>
                    {open && (
                      <tr key={s.name + '-exp'}>
                        <td colSpan={6} style={{ padding: 0, background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
                          <div style={{ padding: 14 }}>
                            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 12, fontSize: 10, color: 'var(--tx3)' }}>
                              <span>{tc('pos_salon.uniqueClients')} <b style={{ color: 'var(--tx)' }}>{s.uniqueClients}</b></span>
                              <span>{tc('pos_salon.returning')} <b style={{ color: 'var(--tx)' }}>{s.returningClients}</b></span>
                              <span>{tc('pos_salon.utilisation')} <b style={{ color: 'var(--tx)' }}>—</b> <span style={{ fontStyle: 'italic' }}>({tc('pos_salon.needsShiftData')})</span></span>
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx2)', marginBottom: 8 }}>{tc('pos_salon.recentClients')}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {s.clients.slice(0, 15).map((cl, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 10 }}>
                                  <span style={{ color: 'var(--tx3)', width: 90, fontVariantNumeric: 'tabular-nums' }}>{fmtDate(cl.date)}</span>
                                  <span style={{ flex: 1, color: 'var(--tx2)' }}>{cl.name}</span>
                                  <span style={{ color: 'var(--tx3)', flex: 1 }}>{Array.from(new Set(cl.services)).join(', ')}</span>
                                  <span style={{ color: 'var(--tx)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(sym, cl.total)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ borderStyle: 'dashed' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>{tc('pos_salon.commissionComingSoonTitle')}</div>
        <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.6 }}>
          {tc('pos_salon.commissionComingSoonBody')}
        </div>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS SUB-TAB
// ─────────────────────────────────────────────────────────────────────────────
type ProductSortKey = 'name' | 'stock' | 'price' | 'cost' | 'margin' | 'unitsSold' | 'revenue'

function ProductsSub({ sym, products, attachmentRate }: {
  sym: string; products: ProductRecord[]; attachmentRate: number
}) {
  const { tc } = useLang()
  const { sortKey, sortDir, toggle } = useSort<ProductSortKey>('revenue')
  const LOW_STOCK = 5

  const rows = useMemo(() => {
    return [...products].sort((a, b) => {
      let av: number | string, bv: number | string
      switch (sortKey) {
        case 'name': av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break
        case 'stock': av = a.stock; bv = b.stock; break
        case 'price': av = a.price; bv = b.price; break
        case 'cost': av = a.cost; bv = b.cost; break
        case 'margin': av = a.margin; bv = b.margin; break
        case 'unitsSold': av = a.unitsSold; bv = b.unitsSold; break
        case 'revenue': av = a.revenue; bv = b.revenue; break
        default: av = 0; bv = 0
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [products, sortKey, sortDir])

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK)
  const topSelling = [...products].filter(p => p.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <Kpi label={tc('pos_salon.kpiRetailProducts')} value={String(products.length)} highlight />
        <Kpi label={tc('pos_salon.kpiProductAttachRate')} value={fmtPct(attachmentRate)} sub={tc('pos_salon.kpiServicesWithRetailAddon')} highlight />
        <Kpi label={tc('pos_salon.kpiLowStock')} value={String(lowStock.length)} sub={tc('pos_salon.kpiLowStockUnits', { n: LOW_STOCK })} />
        <Kpi label={tc('pos_salon.kpiRetailRevenue')} value={fmtMoney(sym, products.reduce((s, p) => s + p.revenue, 0))} />
      </div>

      {lowStock.length > 0 && (
        <Card style={{ borderColor: AMBER, background: 'rgba(202,138,4,.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: AMBER, marginBottom: 8 }}>{tc('pos_salon.lowStockAlerts')}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {lowStock.map(p => (
              <span key={p.name} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 9999, background: 'var(--sf)', border: `1px solid ${AMBER}55`, color: 'var(--tx2)' }}>
                {p.name} · <b style={{ color: AMBER }}>{p.stock} {tc('pos_salon.left')}</b>
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle>{tc('pos_salon.topSellingProducts')}</SectionTitle>
        {topSelling.length
          ? <HBarChart data={topSelling.map(p => ({ label: p.name, value: p.revenue }))} sym={sym} color={PURPLE} />
          : <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_salon.noRetailSales')}</div>}
      </Card>

      <Card>
        <SectionTitle>{tc('pos_salon.retailCatalogue')}</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr>
                <SortHeader label={tc('pos_salon.colProduct')} k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggle} />
                <SortHeader label={tc('pos_salon.colStock')} k="stock" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colPrice')} k="price" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colCost')} k="cost" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colMargin')} k="margin" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colUnitsSold')} k="unitsSold" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
                <SortHeader label={tc('pos_salon.colRevenue')} k="revenue" sortKey={sortKey} sortDir={sortDir} onSort={toggle} align="right" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--tx3)', fontSize: 11 }}>{tc('pos_salon.noRetailProducts')}</td></tr>
              )}
              {rows.map((p, i) => (
                <tr key={p.name + i}>
                  <Td color="var(--tx)">{p.name}</Td>
                  <Td align="right" mono color={p.stock > 0 && p.stock <= LOW_STOCK ? AMBER : 'var(--tx2)'}>{p.stock}</Td>
                  <Td align="right" mono>{fmtMoney(sym, p.price)}</Td>
                  <Td align="right" mono>{fmtMoney(sym, p.cost)}</Td>
                  <Td align="right" mono color={p.margin >= 50 ? GREEN : p.margin > 0 ? 'var(--tx2)' : 'var(--tx3)'}>{p.margin > 0 ? fmtPct(p.margin) : '—'}</Td>
                  <Td align="right" mono>{p.unitsSold}</Td>
                  <Td align="right" mono color="var(--tx)">{fmtMoney(sym, p.revenue)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKETING SUB-TAB
// ─────────────────────────────────────────────────────────────────────────────
function MarketingSub({ sym, clients, segmentCounts }: {
  sym: string
  clients: ClientRecord[]
  segmentCounts: { new: number; regular: number; vip: number; lapsed: number }
}) {
  const { tc } = useLang()
  // Rebooking: avg days between visits per client (only those with 2+ visits)
  const rebooking = useMemo(() => {
    const gaps: number[] = []
    for (const c of clients) {
      const dates = c.history.map(h => h.date).filter(Boolean).sort((a, b) => a - b)
      for (let i = 1; i < dates.length; i++) gaps.push((dates[i] - dates[i - 1]) / 86400000)
    }
    if (!gaps.length) return 0
    return gaps.reduce((s, g) => s + g, 0) / gaps.length
  }, [clients])

  // CLV: avg total spend × estimated future visits (assume 4 more visits / yr scaled by avg gap)
  const clv = useMemo(() => {
    const active = clients.filter(c => c.segment !== 'lapsed')
    if (!active.length) return 0
    const avgSpend = active.reduce((s, c) => s + c.avgSpend, 0) / active.length
    const avgVisits = active.reduce((s, c) => s + c.visits, 0) / active.length
    // estimate future visits = current loyalty proxy + projected year ahead
    const projected = avgVisits + 4
    return avgSpend * projected
  }, [clients])

  // Birthday list (this month)
  const month = new Date().getMonth()
  const birthdays = clients.filter(c => c.birthdayMonth === month)

  const segData = [
    { name: tc('pos_salon.segNew'), value: segmentCounts.new, c: BLUE },
    { name: tc('pos_salon.segRegular'), value: segmentCounts.regular, c: GREEN },
    { name: tc('pos_salon.segVip'), value: segmentCounts.vip, c: PINK },
    { name: tc('pos_salon.segLapsed'), value: segmentCounts.lapsed, c: AMBER },
  ]
  const segTotal = segData.reduce((s, d) => s + d.value, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <Kpi label={tc('pos_salon.kpiAvgRebookingGap')} value={rebooking > 0 ? `${rebooking.toFixed(0)}d` : '—'} sub={tc('pos_salon.kpiDaysBetweenVisits')} highlight />
        <Kpi label={tc('pos_salon.kpiEstClientLtv')} value={fmtMoney(sym, clv)} sub={tc('pos_salon.kpiAvgSpendProjected')} highlight />
        <Kpi label={tc('pos_salon.kpiVipPlusRegular')} value={String(segmentCounts.vip + segmentCounts.regular)} sub={tc('pos_salon.kpiLoyalClientBase')} />
        <Kpi label={tc('pos_salon.kpiWinBackTargets')} value={String(segmentCounts.lapsed)} sub={tc('pos_salon.kpiLapsedClients')} />
      </div>

      <Card>
        <SectionTitle>{tc('pos_salon.clientSegments')}</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {segData.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 70, fontSize: 10, color: 'var(--tx2)' }}>{s.name}</span>
              <div style={{ flex: 1, height: 16, borderRadius: 8, background: 'var(--ev)', overflow: 'hidden' }}>
                <div style={{ width: segTotal ? `${(s.value / segTotal) * 100}%` : '0%', height: '100%', background: s.c }} />
              </div>
              <span style={{ width: 70, textAlign: 'right', fontSize: 10, color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
                {s.value} · {segTotal ? ((s.value / segTotal) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>{tc('pos_salon.birthdaysThisMonth')}</SectionTitle>
        {birthdays.length ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {birthdays.map(c => (
              <span key={c.key} style={{ fontSize: 10, padding: '4px 12px', borderRadius: 9999, background: PINK_BG, color: PINK, border: `1px solid ${PINK}55` }}>
                {c.name}{c.phone ? ` · ${c.phone}` : ''}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.6 }}>
            {tc('pos_salon.noBirthdays')}
          </div>
        )}
      </Card>

      <Card style={{ borderStyle: 'dashed' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 4 }}>{tc('pos_salon.loyaltyComingSoonTitle')}</div>
        <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.6 }}>
          {tc('pos_salon.loyaltyComingSoonBody', { lapsed: segmentCounts.lapsed, vip: segmentCounts.vip })}
        </div>
      </Card>
    </div>
  )
}
