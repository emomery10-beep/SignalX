'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import ServiceJobsTab from '@/components/pos/ServiceJobsTab'
import RepairMetrics from '@/components/pos/RepairMetrics'
import RestaurantSnapshot from '@/components/pos/RestaurantSnapshot'

const API = process.env.NEXT_PUBLIC_API_URL || ''

const ACC = '#d08a59'
const ACC_BG = 'rgba(208,138,89,.08)'
const ACC_BORDER = 'rgba(208,138,89,.2)'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'

// ── Toast system ─────────────────────────────────────────
function Toast({ msg, ok, onDone }: { msg: string; ok: boolean; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, padding: '12px 20px', borderRadius: 12, background: ok ? 'rgba(22,163,74,.95)' : 'rgba(220,38,38,.95)', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,.18)', animation: 'fadeIn .2s ease', maxWidth: 360 }}>
      {msg}
    </div>
  )
}

// ── Skeleton loader ──────────────────────────────────────
function Skeleton({ w, h, r = 8 }: { w: string | number; h: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: 'var(--b)', animation: 'pulse 1.5s infinite ease-in-out' }} />
}

function SkeletonCard() {
  return (
    <div style={{ padding: 16, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
      <Skeleton w={80} h={12} />
      <div style={{ marginTop: 10 }}><Skeleton w={100} h={28} /></div>
    </div>
  )
}

// ── Mini bar chart (pure CSS, no chart.js needed) ────────
function MiniBarChart({ data, color = ACC, height = 80 }: { data: { label: string; value: number }[]; color?: string; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height, width: '100%' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', maxWidth: 32, height: Math.max(2, (d.value / max) * (height - 18)), background: color, borderRadius: '4px 4px 0 0', transition: 'height .3s ease', opacity: d.value === 0 ? 0.2 : 1 }} title={`${d.label}: ${d.value}`} />
          <span style={{ fontSize: 9, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Types ────────────────────────────────────────────────
interface StaffMember {
  id: string; name: string; phone: string; email?: string; role: string; active: boolean; last_login_at: string | null; has_pin?: boolean
  location_id?: string | null; location?: { id: string; name: string } | null
}
interface BranchOption { id: string; name: string }

// Roles offered when adding/editing staff, grouped for the dropdown
const buildRoleOptions = (tc: (key: string) => string): { group: string; roles: { value: string; label: string }[] }[] => [
  { group: tc('pos.role_group_retail'), roles: [
    { value: 'cashier', label: tc('pos.role_cashier') },
    { value: 'inventory', label: tc('pos.role_inventory') },
    { value: 'repair', label: tc('pos.role_repair') },
    { value: 'engineer', label: tc('pos.role_engineer') },
    { value: 'manager', label: tc('pos.role_manager') },
    { value: 'supervisor', label: tc('pos.role_supervisor') },
  ] },
  { group: tc('pos.role_group_logistics'), roles: [
    { value: 'logistics-counter-clerk', label: tc('pos.role_logistics_counter_clerk') },
    { value: 'logistics-handler', label: tc('pos.role_logistics_handler') },
    { value: 'logistics-driver', label: tc('pos.role_logistics_driver') },
    { value: 'logistics-dispatcher', label: tc('pos.role_logistics_dispatcher') },
    { value: 'logistics-branch-manager', label: tc('pos.role_logistics_branch_manager') },
  ] },
]
// Roles that operate at a specific branch — branch selection matters for these
const BRANCH_ROLES = new Set(['logistics-counter-clerk', 'logistics-handler', 'logistics-driver', 'logistics-dispatcher', 'logistics-branch-manager', 'manager', 'supervisor'])
interface Transaction {
  id: string; total: number; subtotal?: number; payment_type: string; status: string; created_at: string; notes?: string
  cashier: { id?: string; name: string; role?: string } | null
  pos_items: { name: string; qty: number; unit_price: number; cost_price?: number; inventory_id?: string }[]
  pos_customers?: { phone: string; name?: string } | null
}
interface InventoryItem {
  id: string; name: string; sku?: string; sale_price: number; cost_price: number; stock_qty: number; low_stock_threshold: number; unit?: string; last_sold_at: string | null; category?: string; active: boolean
}
type Tab = 'overview' | 'services' | 'staff' | 'inventory' | 'audit' | 'map'
type DateRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom'
type FilterModalType = { type: 'sales' | 'refunds' | 'low_stock' | 'cashier_detail'; title: string; cashier_id?: string } | null
type TxDetailType = Transaction | null

export default function POSPage() {
  const supabase = createClient()
  const { tc } = useLang()
  const ROLE_OPTIONS = useMemo(() => buildRoleOptions(tc), [tc])
  const [tab, setTab] = useState<Tab>('overview')
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [prevTransactions, setPrevTransactions] = useState<Transaction[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currencySymbol, setCurrencySymbol] = useState('£')
  const [posEnabled, setPosEnabled] = useState<boolean | null>(null)
  const [seatCount, setSeatCount] = useState(0)
  const [businessType, setBusinessType] = useState('retail')
  const [sectorOverride, setSectorOverride] = useState<string | null>(null)
  const [staffSector, setStaffSector] = useState<string | null>(null) // set when a staff member is logged in

  const detectedSector = useMemo(() => {
    const bt = (businessType || '').toLowerCase()
    return ['restaurant','cafe','café','bar','pub','takeaway','food','catering','food stall','bistro','diner'].some(k => bt.includes(k)) ? 'restaurant'
      : ['repair','phone','mobile','electronic','watch','laptop','computer'].some(k => bt.includes(k)) ? 'repair'
      : ['salon','barber','barbershop','spa','beauty','clinic','nail'].some(k => bt.includes(k)) ? 'salon'
      : 'retail'
  }, [businessType])
  const currentSector = sectorOverride || detectedSector

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const notify = useCallback((msg: string, ok = true) => setToast({ msg, ok }), [])

  // Date range
  const [dateRange, setDateRange] = useState<DateRange>('today')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Modals
  const [filterModal, setFilterModal] = useState<FilterModalType>(null)
  const [txDetail, setTxDetail] = useState<TxDetailType>(null)
  const [refundTx, setRefundTx] = useState<Transaction | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [refunding, setRefunding] = useState(false)

  // Staff forms
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState<string>('cashier')
  const [newLocation, setNewLocation] = useState('')
  const [newPin, setNewPin] = useState('')
  const [addingStaff, setAddingStaff] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState<string>('cashier')
  const [editLocation, setEditLocation] = useState('')
  const [editPin, setEditPin] = useState('')
  const [editingSubmitting, setEditingSubmitting] = useState(false)
  const [locations, setLocations] = useState<BranchOption[]>([])

  // Inventory
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5', category: '' })
  const [addingProduct, setAddingProduct] = useState(false)
  const [invSearch, setInvSearch] = useState('')
  const [invCategory, setInvCategory] = useState('all')
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null)
  const [editProduct, setEditProduct] = useState({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '', category: '' })
  const [editingProductSubmitting, setEditingProductSubmitting] = useState(false)
  const [restockId, setRestockId] = useState<string | null>(null)
  const [restockQty, setRestockQty] = useState('')
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [bulkCsv, setBulkCsv] = useState('')
  const [importingBulk, setImportingBulk] = useState(false)
  const csvInputRef    = useRef<HTMLInputElement>(null)
  const mapDivRef      = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const mapMarkersRef  = useRef<any[]>([])

  // Camera
  const [recognizing, setRecognizing] = useState(false)
  const [recognizedProducts, setRecognizedProducts] = useState<any[]>([])
  const [editingRecognizedIndex, setEditingRecognizedIndex] = useState<number | null>(null)
  const [editingRecognizedData, setEditingRecognizedData] = useState<any>({})
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCameraMenu, setShowCameraMenu] = useState(false)
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Pagination
  const [txPage, setTxPage] = useState(0)
  const TX_PER_PAGE = 15

  // P&L view
  const [plView, setPlView] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  // ── Date range helpers ─────────────────────────────────
  const getDateRange = useCallback((range: DateRange): { start: Date; end: Date; label: string } => {
    const now = new Date()
    const s = new Date()
    switch (range) {
      case 'today': s.setHours(0, 0, 0, 0); return { start: s, end: now, label: tc('pos.range_today_label', { date: now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) }) }
      case 'yesterday': s.setDate(s.getDate() - 1); s.setHours(0, 0, 0, 0); const ye = new Date(s); ye.setHours(23, 59, 59, 999); return { start: s, end: ye, label: tc('pos.range_yesterday_label', { date: s.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) }) }
      case 'last7': s.setDate(s.getDate() - 7); s.setHours(0, 0, 0, 0); return { start: s, end: now, label: tc('pos.range_last7') }
      case 'last30': s.setDate(s.getDate() - 30); s.setHours(0, 0, 0, 0); return { start: s, end: now, label: tc('pos.range_last30') }
      case 'custom': return { start: customStart ? new Date(customStart) : s, end: customEnd ? new Date(customEnd + 'T23:59:59') : now, label: tc('pos.range_custom_label', { start: customStart || tc('pos.range_custom_unset'), end: customEnd || tc('pos.range_custom_unset') }) }
    }
  }, [customStart, customEnd, tc])

  const getPrevRange = useCallback((range: DateRange): { start: Date; end: Date } => {
    const { start, end } = getDateRange(range)
    const dur = end.getTime() - start.getTime()
    return { start: new Date(start.getTime() - dur), end: new Date(start.getTime() - 1) }
  }, [getDateRange])

  // ── Fetch data ─────────────────────────────────────────
  const fetchTransactions = useCallback(async (from: string, to: string) => {
    const res = await fetch(`/api/pos/transactions?from=${from}&to=${to}`)
    const data = await res.json()
    return data.transactions || []
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('currency_symbol, pos_enabled, pos_seat_count, business_type, sector_hints')
        .eq('id', user.id)
        .single()
      if (profile?.currency_symbol) setCurrencySymbol(profile.currency_symbol)
      setPosEnabled(profile?.pos_enabled ?? false)
      setSeatCount((profile as any)?.pos_seat_count ?? 0)
      setBusinessType((profile as any)?.business_type || 'retail')

      // Check if this is a staff session and lock to their assigned sector
      const configRes = await fetch(`${API}/api/pos/config`)
      const config = configRes.ok ? await configRes.json() : {}
      if (config.staff_sector) {
        setStaffSector(config.staff_sector)
        setSectorOverride(config.staff_sector)
      }

      const { start, end } = getDateRange(dateRange)
      const prev = getPrevRange(dateRange)

      const [staffRes, txData, prevTxData, invRes, locRes] = await Promise.all([
        fetch('/api/pos/staff'),
        fetchTransactions(start.toISOString(), end.toISOString()),
        fetchTransactions(prev.start.toISOString(), prev.end.toISOString()),
        fetch('/api/pos/inventory'),
        fetch('/api/pos/locations'),
      ])
      const staffData = await staffRes.json()
      const invData = await invRes.json()
      const locData = locRes.ok ? await locRes.json() : { locations: [] }

      setStaff(staffData.staff || [])
      setTransactions(txData)
      setPrevTransactions(prevTxData)
      setInventory(invData.inventory || [])
      setLocations(locData.locations || [])
      setLoading(false)
    }
    init()
  }, [])

  // Re-fetch when date range changes
  useEffect(() => {
    if (loading) return
    const refetch = async () => {
      const { start, end } = getDateRange(dateRange)
      const prev = getPrevRange(dateRange)
      const [txData, prevTxData] = await Promise.all([
        fetchTransactions(start.toISOString(), end.toISOString()),
        fetchTransactions(prev.start.toISOString(), prev.end.toISOString()),
      ])
      setTransactions(txData)
      setPrevTransactions(prevTxData)
      setTxPage(0)
    }
    refetch()
  }, [dateRange, customStart, customEnd])

  // ── Realtime subscription ──────────────────────────────
  useEffect(() => {
    const channel = supabase.channel('pos-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pos_transactions' }, (payload) => {
        const newTx = payload.new as any
        if (newTx) {
          setTransactions(prev => [{ ...newTx, cashier: newTx.pos_staff ?? null, pos_items: [] }, ...prev])
          notify(tc('pos.toast_new_sale', { amount: currencySymbol + (newTx.total || 0).toFixed(2) }))
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory' }, (payload) => {
        const updated = payload.new as any
        if (updated) setInventory(prev => prev.map(i => i.id === updated.id ? { ...i, ...updated } : i))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [currencySymbol, tc])

  // ── Derived stats ──────────────────────────────────────
  const dateRangeDetails = getDateRange(dateRange)
  const completedTx = useMemo(() => transactions.filter(t => t.status === 'completed'), [transactions])
  const prevCompletedTx = useMemo(() => prevTransactions.filter(t => t.status === 'completed'), [prevTransactions])

  const todayRevenue = completedTx.reduce((s, t) => s + t.total, 0)
  const prevRevenue = prevCompletedTx.reduce((s, t) => s + t.total, 0)
  const todaySales = completedTx.length
  const prevSales = prevCompletedTx.length
  const refundedTx = useMemo(() => transactions.filter(t => t.status === 'refunded' || t.status === 'partially_refunded'), [transactions])
  const refundCount = refundedTx.length
  const prevRefunds = prevTransactions.filter(t => t.status === 'refunded' || t.status === 'partially_refunded').length
  const lowStock = inventory.filter(i => i.stock_qty <= i.low_stock_threshold && i.stock_qty > 0)
  const outOfStock = inventory.filter(i => i.stock_qty === 0)
  const alertCount = lowStock.length + outOfStock.length

  // Profit calc
  const totalCost = completedTx.reduce((s, t) => s + (t.pos_items || []).reduce((is, i) => is + (i.cost_price || 0) * i.qty, 0), 0)
  const grossProfit = todayRevenue - totalCost
  const margin = todayRevenue > 0 ? (grossProfit / todayRevenue * 100) : 0

  // Comparison helper
  // Geo-tagged sales for map tab
  const geoPoints = useMemo(() => {
    const pts: any[] = []
    for (const t of transactions) {
      if (!t.notes) continue
      const m = t.notes.match(/\|__geo:([-\d.]+),([-\d.]+)/)
      if (!m) continue
      pts.push({
        id: t.id, lat: parseFloat(m[1]), lng: parseFloat(m[2]),
        total: t.total, payment_type: t.payment_type, created_at: t.created_at,
        cashier_name: t.cashier?.name || '',
        cleanNotes: t.notes.replace(/\s*\|__geo:[^\s|]+/, '').trim(),
      })
    }
    return pts
  }, [transactions])

  const pctChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0
    return ((curr - prev) / prev * 100)
  }

  // Per-cashier stats
  const cashierStats = useMemo(() =>
    staff.filter(s => s.role === 'cashier').map(s => {
      const txs = completedTx.filter(t => t.cashier?.name === s.name)
      return { ...s, sales: txs.length, revenue: txs.reduce((sum, t) => sum + t.total, 0), avgSale: txs.length > 0 ? txs.reduce((sum, t) => sum + t.total, 0) / txs.length : 0 }
    }).sort((a, b) => b.revenue - a.revenue)
  , [staff, completedTx])

  // Hourly breakdown
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ label: `${i}`, value: 0 }))
    completedTx.forEach(t => { const h = new Date(t.created_at).getHours(); hours[h].value += t.total })
    const firstActive = hours.findIndex(h => h.value > 0)
    const lastActive = hours.findLastIndex(h => h.value > 0)
    if (firstActive === -1) return hours.slice(8, 20).map(h => ({ ...h, label: `${h.label}:00` }))
    const s = Math.max(0, firstActive - 1)
    const e = Math.min(23, lastActive + 1)
    return hours.slice(s, e + 1).map(h => ({ ...h, label: `${h.label}:00` }))
  }, [completedTx])

  // Payment breakdown
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {}
    completedTx.forEach(t => {
      const method = t.payment_type || 'other'
      if (!map[method]) map[method] = { count: 0, total: 0 }
      map[method].count++
      map[method].total += t.total
    })
    return Object.entries(map).map(([method, d]) => ({ method, ...d })).sort((a, b) => b.total - a.total)
  }, [completedTx])

  // Top products
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {}
    completedTx.forEach(t => (t.pos_items || []).forEach(i => {
      if (!map[i.name]) map[i.name] = { name: i.name, qty: 0, revenue: 0 }
      map[i.name].qty += i.qty
      map[i.name].revenue += i.qty * i.unit_price
    }))
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
  }, [completedTx])

  // Inventory categories
  const categories = useMemo(() => {
    const cats = new Set(inventory.map(i => i.category || 'Uncategorised'))
    return ['all', ...Array.from(cats).sort()]
  }, [inventory])

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    let items = inventory
    if (invSearch) items = items.filter(i => i.name.toLowerCase().includes(invSearch.toLowerCase()) || (i.sku && i.sku.toLowerCase().includes(invSearch.toLowerCase())))
    if (invCategory !== 'all') items = items.filter(i => (i.category || 'Uncategorised') === invCategory)
    return items
  }, [inventory, invSearch, invCategory])

  // P&L data
  const plData = useMemo(() => {
    const buckets: Record<string, { revenue: number; cost: number; count: number }> = {}
    completedTx.forEach(t => {
      const d = new Date(t.created_at)
      let key: string
      if (plView === 'daily') key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      else if (plView === 'weekly') { const w = new Date(d); w.setDate(w.getDate() - w.getDay()); key = tc('pos.pl_week_commencing', { date: w.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }) }
      else { key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }) }
      if (!buckets[key]) buckets[key] = { revenue: 0, cost: 0, count: 0 }
      buckets[key].revenue += t.total
      buckets[key].cost += (t.pos_items || []).reduce((s, i) => s + (i.cost_price || 0) * i.qty, 0)
      buckets[key].count++
    })
    return Object.entries(buckets).map(([period, d]) => ({ period, ...d, profit: d.revenue - d.cost }))
  }, [completedTx, plView, tc])

  // ── Handlers ───────────────────────────────────────────
  const handleRefund = async (full: boolean) => {
    if (!refundTx || !refundReason) return
    setRefunding(true)
    try {
      await fetch('/api/pos/refund', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transaction_id: refundTx.id, full_refund: full, reason: refundReason }) })
      setTransactions(prev => prev.map(t => t.id === refundTx.id ? { ...t, status: full ? 'refunded' : 'partially_refunded' } : t))
      notify(tc('pos.toast_refund_processed', { amount: currencySymbol + refundTx.total.toFixed(2) }))
    } catch { notify(tc('pos.toast_refund_failed'), false) }
    setRefundTx(null); setRefundReason(''); setRefunding(false)
  }

  const handleExport = () => {
    const { start, end } = getDateRange(dateRange)
    window.open(`/api/pos/export?from=${start.toISOString()}&to=${end.toISOString()}`, '_blank')
  }
  const handleExportVAT = () => window.open('/api/pos/vat', '_blank')

  const handleAddStaff = async () => {
    if ((!newPhone && !newEmail) || !newName) return
    if (newPin && (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin))) { notify(tc('pos.toast_pin_digits'), false); return }
    setAddingStaff(true)
    try {
      const res = await fetch('/api/pos/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: newPhone || undefined, email: newEmail || undefined, name: newName, role: newRole, pin: newPin || undefined, location_id: newLocation || undefined }) })
      const data = await res.json()
      if (data.staff) { setStaff(prev => [...prev, data.staff]); setNewPhone(''); setNewEmail(''); setNewName(''); setNewRole('cashier'); setNewLocation(''); setNewPin(''); setShowAddStaff(false); notify(tc('pos.toast_staff_added', { name: data.staff.name })) }
      else if (data.seat_limit) notify(data.error, false)
      else if (data.error) notify(data.error, false)
    } catch { notify(tc('pos.toast_add_staff_failed'), false) }
    setAddingStaff(false)
  }

  const handleToggleStaff = async (member: StaffMember) => {
    try {
      const res = await fetch('/api/pos/staff', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: member.id, active: !member.active }) })
      const data = await res.json()
      if (data.staff) { setStaff(prev => prev.map(s => s.id === member.id ? data.staff : s)); notify(member.active ? tc('pos.toast_staff_deactivated', { name: member.name }) : tc('pos.toast_staff_reactivated', { name: member.name })) }
      else if (data.seat_limit) notify(data.error, false)
    } catch { notify(tc('pos.toast_update_staff_failed'), false) }
  }

  const handleEditStaff = async () => {
    if (!editingStaff || (!editPhone && !editEmail) || !editName) return
    if (editPin && (editPin.length < 4 || editPin.length > 6 || !/^\d+$/.test(editPin))) { notify(tc('pos.toast_pin_digits'), false); return }
    setEditingSubmitting(true)
    try {
      const res = await fetch('/api/pos/staff', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingStaff.id, phone: editPhone || undefined, email: editEmail || undefined, name: editName, role: editRole, location_id: editLocation || null, pin: editPin || undefined }) })
      const data = await res.json()
      if (data.staff) { setStaff(prev => prev.map(s => s.id === editingStaff.id ? data.staff : s)); setEditingStaff(null); notify(tc('pos.toast_staff_updated')) }
      else if (data.error) notify(data.error, false)
    } catch { notify(tc('pos.toast_update_staff_failed'), false) }
    setEditingSubmitting(false)
  }

  const handleOpenEditStaff = (member: StaffMember) => {
    setEditingStaff(member); setEditName(member.name); setEditPhone(member.phone || ''); setEditEmail(member.email || ''); setEditPin('')
    setEditRole(member.role || 'cashier'); setEditLocation(member.location_id || '')
  }

  // Camera handlers
  useEffect(() => {
    if (showCameraPreview && videoRef.current && streamRef.current) { videoRef.current.srcObject = streamRef.current; videoRef.current.play().catch(() => {}) }
  }, [showCameraPreview])

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream; setShowCameraPreview(true); setShowCameraMenu(false)
    } catch (err: any) { notify(tc('pos.toast_camera_denied', { message: err.message }), false) }
  }

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    canvasRef.current.width = videoRef.current.videoWidth; canvasRef.current.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)
    canvasRef.current.toBlob(async (blob) => {
      if (blob) { handleImageCapture(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })); handleCloseCamera() }
    }, 'image/jpeg', 0.9)
  }

  const handleCloseCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null }
    setShowCameraPreview(false)
  }

  const handleImageCapture = async (file: File) => {
    setRecognizing(true)
    try {
      const formData = new FormData(); formData.append('image', file)
      const res = await fetch('/api/pos/recognize-inventory', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.products?.length > 0) {
        setRecognizedProducts(data.products)
        // Auto-open modal for first product
        const firstProduct = data.products[0]
        setEditingRecognizedIndex(0)
        setEditingRecognizedData({
          ...firstProduct,
          sale_price: firstProduct.sale_price || '',
          cost_price: firstProduct.cost_price || '',
          stock_qty: (firstProduct.quantity || 1).toString()
        })
      }
      else notify(tc('pos.toast_recognise_failed'), false)
    } catch (err) { notify(tc('pos.toast_image_recognition_failed'), false) }
    setRecognizing(false)
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sale_price) return
    setAddingProduct(true)
    try {
      const res = await fetch('/api/pos/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newProduct.name, sale_price: parseFloat(newProduct.sale_price), cost_price: parseFloat(newProduct.cost_price || '0'), stock_qty: parseInt(newProduct.stock_qty || '0'), low_stock_threshold: parseInt(newProduct.low_stock_threshold || '5') }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => [...prev, data.product]); setNewProduct({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5', category: '' }); setShowAddProduct(false); notify(tc('pos.toast_product_added', { name: data.product.name })) }
    } catch { notify(tc('pos.toast_add_product_failed'), false) }
    setAddingProduct(false)
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return
    setEditingProductSubmitting(true)
    try {
      const updates: any = {}
      if (editProduct.name) updates.name = editProduct.name
      if (editProduct.sale_price) updates.sale_price = parseFloat(editProduct.sale_price)
      if (editProduct.cost_price) updates.cost_price = parseFloat(editProduct.cost_price)
      if (editProduct.stock_qty) updates.stock_qty = parseInt(editProduct.stock_qty)
      if (editProduct.low_stock_threshold) updates.low_stock_threshold = parseInt(editProduct.low_stock_threshold)
      const res = await fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingProduct.id, ...updates }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => prev.map(i => i.id === editingProduct.id ? data.product : i)); setEditingProduct(null); notify(tc('pos.toast_product_updated')) }
      else notify(data.error || tc('pos.toast_update_failed'), false)
    } catch { notify(tc('pos.toast_update_product_failed'), false) }
    setEditingProductSubmitting(false)
  }

  const handleDeleteProduct = async (item: InventoryItem) => {
    if (!confirm(tc('pos.confirm_remove_product', { name: item.name }))) return
    try {
      const res = await fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, active: false }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => prev.filter(i => i.id !== item.id)); notify(tc('pos.toast_product_removed', { name: item.name })) }
    } catch { notify(tc('pos.toast_remove_product_failed'), false) }
  }

  const handleRestock = async (id: string) => {
    const qty = parseInt(restockQty)
    if (!qty || qty <= 0) { notify(tc('pos.toast_valid_quantity'), false); return }
    try {
      const res = await fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, restock_qty: qty }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => prev.map(i => i.id === id ? data.product : i)); setRestockId(null); setRestockQty(''); notify(tc('pos.toast_restocked', { qty })) }
      else notify(data.error || tc('pos.toast_restock_failed'), false)
    } catch { notify(tc('pos.toast_restock_failed'), false) }
  }

  const handleBulkImport = async () => {
    if (!bulkCsv.trim()) return
    setImportingBulk(true)
    try {
      const lines = bulkCsv.trim().split('\n').filter(l => l.trim())
      const items = lines.map(line => {
        const parts = line.split(',').map(p => p.trim())
        return { name: parts[0], sale_price: parseFloat(parts[1]) || 0, stock_qty: parseInt(parts[2]) || 0, unit: parts[3] || 'item' }
      }).filter(i => i.name)
      const res = await fetch('/api/pos/inventory', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) })
      const data = await res.json()
      if (data.products) { setInventory(prev => [...prev, ...data.products]); setShowBulkImport(false); setBulkCsv(''); notify(tc('pos.toast_products_imported', { count: data.products.length })) }
      else notify(data.error || tc('pos.toast_import_failed'), false)
    } catch { notify(tc('pos.toast_import_failed'), false) }
    setImportingBulk(false)
  }

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setBulkCsv(ev.target?.result as string || '') }
    reader.readAsText(file)
  }

  // ── Styles ─────────────────────────────────────────────
  const inputStyle: React.CSSProperties = { padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }
  const btnPrimary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }
  const btnSecondary: React.CSSProperties = { padding: '9px 16px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }
  const cardStyle: React.CSSProperties = { padding: 16, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }
  const sectionLabel: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 12 }
  const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100 }
  const modalBox: React.CSSProperties = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: 'var(--sf)', borderRadius: 20, padding: 28, width: '90%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,.2)', maxHeight: '85vh', overflowY: 'auto' }

  // ── Comparison badge ───────────────────────────────────
  const CompBadge = ({ curr, prev }: { curr: number; prev: number }) => {
    const pct = pctChange(curr, prev)
    if (pct === 0 && prev === 0 && curr === 0) return null
    const up = pct >= 0
    return (
      <span style={{ fontSize: 11, fontWeight: 600, color: up ? GREEN : RED, display: 'inline-flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transform: up ? 'none' : 'rotate(180deg)' }}><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        {tc('pos.comp_vs_prev', { pct: Math.abs(pct).toFixed(0) })}
      </span>
    )
  }

  // ── Leaflet map lifecycle ──────────────────────────────
  useEffect(() => {
    if (tab !== 'map') {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      return
    }
    if (!document.getElementById('lf-css')) {
      const link = document.createElement('link')
      link.id = 'lf-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const doInit = () => {
      const L = (window as any).L
      if (!L || !mapDivRef.current || mapRef.current) return
      const map = L.map(mapDivRef.current, { center: [20, 0], zoom: 2 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map)
      mapRef.current = map
      mapMarkersRef.current = []
    }
    requestAnimationFrame(() => {
      if (document.getElementById('lf-js')) { doInit(); return }
      const script = document.createElement('script')
      script.id = 'lf-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true; script.onload = doInit
      document.head.appendChild(script)
    })
  }, [tab])

  useEffect(() => {
    const L   = (window as any).L
    const map = mapRef.current
    if (!L || !map) return
    mapMarkersRef.current.forEach(m => map.removeLayer(m))
    mapMarkersRef.current = []
    const bounds: [number, number][] = []
    geoPoints.forEach((p: any) => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 10, fillColor: ACC, color: '#fff', weight: 2.5, fillOpacity: 0.9,
      }).addTo(map)
      const dt  = new Date(p.created_at)
      const lbl = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' +
                  dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      marker.bindPopup(`
        <div style="font-family:-apple-system,sans-serif;min-width:150px;padding:2px 0">
          <div style="font-weight:800;font-size:16px;color:#1a1916">${currencySymbol}${p.total.toFixed(2)}</div>
          <div style="font-size:12px;color:#6b6760;margin-top:2px">${lbl}</div>
          ${p.cashier_name ? `<div style="font-size:12px;color:#6b6760">by ${p.cashier_name}</div>` : ''}
          <div style="font-size:12px;color:#6b6760;text-transform:capitalize">${p.payment_type}</div>
          ${p.cleanNotes ? `<div style="font-size:11px;color:#a39e97;margin-top:2px">${p.cleanNotes}</div>` : ''}
        </div>
      `)
      mapMarkersRef.current.push(marker)
      bounds.push([p.lat, p.lng])
    })
    if (bounds.length > 0) {
      try { map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 }) } catch {}
    }
  }, [geoPoints, tab])

  // ── LOADING STATE ──────────────────────────────────────
  if (loading || posEnabled === null) return (
    <div className="page-shell">
      <div className="page-shell-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Skeleton w={32} h={32} r={9} />
          <div><Skeleton w={120} h={16} /><div style={{ marginTop: 4 }}><Skeleton w={160} h={11} /></div></div>
        </div>
      </div>
      <div className="page-shell-body">
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>{[1,2,3,4].map(i => <div key={i} style={{ flex: 1 }}><SkeletonCard /></div>)}</div>
        <Skeleton w="100%" h={200} r={12} />
      </div>
    </div>
  )

  // ── POS NOT ENABLED ────────────────────────────────────
  if (!posEnabled) return (
    <div className="page-shell">
      <div className="page-shell-header"><div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>{tc('pos.not_enabled_title')}</div></div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: ACC_BG, border: `1px solid ${ACC_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{tc('pos.not_enabled_title')}</div>
          <p style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.7, marginBottom: 28 }}>
            {tc('pos.not_enabled_intro')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginBottom: 28 }}>
            {[tc('pos.feature_roles'), tc('pos.feature_camera'), tc('pos.feature_stock'), tc('pos.feature_receipts'), tc('pos.feature_vat'), tc('pos.feature_bi')].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--tx2)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                {f}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-sora)', fontSize: 28, fontWeight: 800 }}>{tc('pos.price_amount')}</span>
            <span style={{ fontSize: 14, color: 'var(--tx3)', marginLeft: 4 }}>{tc('pos.price_unit')}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 20 }}>{tc('pos.price_note')}</p>
          <a href="/billing" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 12, background: ACC, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(208,138,89,.3)' }}>
            {tc('pos.add_seats_cta')}
          </a>
        </div>
      </div>
    </div>
  )

  // ── MAIN POS DASHBOARD ─────────────────────────────────
  return (
    <div className="page-shell">
      {toast && <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />}

      {/* Header */}
      <div className="page-shell-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>{tc('pos.header_title')}</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{dateRangeDetails.label}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleExportVAT} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {tc('pos.btn_mtd_vat')}
          </button>
          <button onClick={handleExport} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {tc('pos.btn_export_csv')}
          </button>
          <a href="/intelligence" style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx2)', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="11" r="3"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/></svg>
            {tc('pos.btn_sales_map')}
          </a>
          <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 14px', borderRadius: 9, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            {tc('pos.btn_open_till')}
          </a>
        </div>
      </div>

      <div className="page-shell-body">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--b)', paddingBottom: 0, overflowX: 'auto' }}>
          {(['overview', 'services', 'staff', 'inventory', 'audit', 'map'] as Tab[]).map(t => {
            const bt = (businessType || '').toLowerCase()
            const _detected = ['restaurant','cafe','café','bar','pub','takeaway','food','catering','food stall','bistro','diner'].some(k => bt.includes(k)) ? 'restaurant'
              : ['repair','phone','mobile','electronic','watch','laptop','computer'].some(k => bt.includes(k)) ? 'repair'
              : ['salon','barber','barbershop','spa','beauty','clinic','nail'].some(k => bt.includes(k)) ? 'salon'
              : 'retail'
            const _sector = sectorOverride || _detected
            const sectorLabel = _sector === 'restaurant' ? tc('pos.sector_label_restaurant')
              : _sector === 'repair' ? tc('pos.sector_label_repair')
              : _sector === 'salon'  ? tc('pos.sector_label_salon')
              : tc('pos.sector_label_operations')

            const tabLabel = t === 'services'
              ? sectorLabel
              : t === 'map' ? tc('pos.tab_map')
              : tc('pos.tab_' + t)

            return (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', whiteSpace: 'nowrap',
                background: tab === t ? 'var(--sf)' : 'transparent', color: tab === t ? 'var(--tx)' : 'var(--tx3)',
                fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: tab === t ? `2px solid ${ACC}` : '2px solid transparent',
              }}>
                {tabLabel}
                {t === 'inventory' && alertCount > 0 && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#fff', background: RED, borderRadius: 9999, padding: '1px 6px', verticalAlign: 'top' }}>{alertCount}</span>}
              </button>
            )
          })}
        </div>

        {/* ── Date Range Selector ── */}
        {(tab === 'overview' || tab === 'map') && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {(['today', 'yesterday', 'last7', 'last30'] as DateRange[]).map(range => (
              <button key={range} onClick={() => { setDateRange(range); setCustomStart(''); setCustomEnd('') }}
                style={{ padding: '6px 12px', borderRadius: 8, border: dateRange === range ? `1.5px solid ${ACC}` : '1px solid var(--b)', background: dateRange === range ? ACC_BG : 'var(--sf)', color: dateRange === range ? ACC : 'var(--tx2)', fontSize: 12, fontWeight: dateRange === range ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
                {range === 'today' ? tc('pos.range_today') : range === 'yesterday' ? tc('pos.range_yesterday') : range === 'last7' ? tc('pos.range_last7') : tc('pos.range_last30')}
              </button>
            ))}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="date" value={customStart} onChange={e => { setCustomStart(e.target.value); setDateRange('custom') }} style={{ ...inputStyle, padding: '6px 10px', fontSize: 12 }} />
              <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos.to')}</span>
              <input type="date" value={customEnd} onChange={e => { setCustomEnd(e.target.value); setDateRange('custom') }} style={{ ...inputStyle, padding: '6px 10px', fontSize: 12 }} />
            </div>
          </div>
        )}

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {tab === 'overview' && (
          <div style={{ maxWidth: 900 }}>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { label: tc('pos.kpi_revenue'), value: `${currencySymbol}${todayRevenue.toLocaleString()}`, color: GREEN, prev: prevRevenue, curr: todayRevenue, type: 'sales' as const },
                { label: tc('pos.kpi_sales'), value: todaySales.toString(), color: ACC, prev: prevSales, curr: todaySales, type: 'sales' as const },
                { label: tc('pos.kpi_refunds'), value: refundCount.toString(), color: refundCount > 0 ? RED : 'var(--tx)', prev: prevRefunds, curr: refundCount, type: 'refunds' as const },
                { label: tc('pos.kpi_low_stock'), value: alertCount.toString(), color: alertCount > 0 ? RED : GREEN, prev: 0, curr: alertCount, type: 'low_stock' as const },
              ].map((kpi, i) => (
                <div key={i} onClick={() => setFilterModal({ type: kpi.type, title: kpi.label })}
                  style={{ ...cardStyle, cursor: 'pointer', transition: 'all 200ms' }}
                  onMouseEnter={e => { (e.currentTarget.style as any).borderColor = ACC; e.currentTarget.style.transform = 'scale(1.02)' }}
                  onMouseLeave={e => { (e.currentTarget.style as any).borderColor = 'var(--b)'; e.currentTarget.style.transform = 'scale(1)' }}>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{kpi.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color, letterSpacing: '-.02em' }}>{kpi.value}</div>
                  {kpi.type !== 'low_stock' && <CompBadge curr={kpi.curr} prev={kpi.prev} />}
                </div>
              ))}
            </div>

            {/* Profit / margin row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{tc('pos.gross_profit')}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: grossProfit >= 0 ? GREEN : RED }}>{currencySymbol}{grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div style={cardStyle}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{tc('pos.margin')}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: margin >= 20 ? GREEN : margin >= 10 ? AMBER : RED }}>{margin.toFixed(1)}%</div>
              </div>
              <div style={cardStyle}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{tc('pos.avg_sale')}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx)' }}>{currencySymbol}{todaySales > 0 ? (todayRevenue / todaySales).toFixed(2) : '0.00'}</div>
              </div>
            </div>

            {currentSector === 'repair' && (
              <RepairMetrics currencySymbol={currencySymbol} selectedLocation={'all'} />
            )}

            {/* Sales chart (hourly) */}
            {completedTx.length > 0 && (
              <div style={{ ...cardStyle, marginBottom: 24 }}>
                <div style={sectionLabel}>{tc('pos.sales_by_hour')}</div>
                <MiniBarChart data={hourlyData} color={ACC} height={100} />
              </div>
            )}

            {/* Payment & product breakdown side-by-side */}
            {completedTx.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 24 }}>
                {/* Payment breakdown */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>{tc('pos.by_payment_method')}</div>
                  {paymentBreakdown.map(p => (
                    <div key={p.method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)', textTransform: 'capitalize' }}>{p.method}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{p.count !== 1 ? tc('pos.sales_count_other', { count: p.count }) : tc('pos.sales_count_one', { count: p.count })}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{currencySymbol}{p.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                {/* Top products */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>{tc('pos.top_products')}</div>
                  {topProducts.slice(0, 5).map((p, i) => (
                    <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{i + 1}. {p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.qty_sold', { qty: p.qty })}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{currencySymbol}{p.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff performance */}
            {cashierStats.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={sectionLabel}>{tc('pos.staff_performance')}</div>
                {/* Mini bar chart for staff */}
                <div style={{ ...cardStyle, marginBottom: 12 }}>
                  <MiniBarChart data={cashierStats.map(c => ({ label: c.name.split(' ')[0], value: c.revenue }))} color={ACC} height={70} />
                </div>
                <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  {cashierStats.map((c, i) => (
                    <div key={c.id} onClick={() => setFilterModal({ type: 'cashier_detail', title: tc('pos.cashier_transactions_title', { name: c.name }), cashier_id: c.name })}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < cashierStats.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', cursor: 'pointer', transition: 'background 200ms' }}
                      onMouseEnter={e => { (e.currentTarget.style as any).background = 'rgba(208,138,89,.04)' }} onMouseLeave={e => { (e.currentTarget.style as any).background = 'var(--sf)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: ACC_BG, border: `1px solid ${ACC_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: ACC }}>{c.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.cashier_summary', { count: c.sales, amount: currencySymbol + c.avgSale.toFixed(2) })}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>{currencySymbol}{c.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock alerts */}
            {(lowStock.length > 0 || outOfStock.length > 0) && (
              <div style={{ marginBottom: 24 }}>
                <div style={sectionLabel}>{tc('pos.stock_alerts')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {outOfStock.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{item.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>{tc('pos.out_of_stock')}</span>
                    </div>
                  ))}
                  {lowStock.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(234,179,8,.06)', border: '1px solid rgba(234,179,8,.25)' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{item.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{tc('pos.stock_left', { count: item.stock_qty })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* P&L summary */}
            {completedTx.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={sectionLabel}>{tc('pos.profit_and_loss')}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['daily', 'weekly', 'monthly'] as const).map(v => (
                      <button key={v} onClick={() => setPlView(v)} style={{ padding: '4px 10px', borderRadius: 6, border: plView === v ? `1px solid ${ACC}` : '1px solid var(--b)', background: plView === v ? ACC_BG : 'transparent', color: plView === v ? ACC : 'var(--tx3)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {tc('pos.pl_' + v)}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    <span>{tc('pos.pl_period')}</span><span style={{ textAlign: 'right' }}>{tc('pos.pl_revenue')}</span><span style={{ textAlign: 'right' }}>{tc('pos.pl_cost')}</span><span style={{ textAlign: 'right' }}>{tc('pos.pl_profit')}</span>
                  </div>
                  {plData.map((row, i) => (
                    <div key={row.period} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{row.period} <span style={{ fontSize: 11, color: 'var(--tx3)' }}>({row.count})</span></div>
                      <div style={{ fontSize: 13, fontWeight: 600, textAlign: 'right', color: 'var(--tx)' }}>{currencySymbol}{row.revenue.toFixed(2)}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, textAlign: 'right', color: 'var(--tx3)' }}>{currencySymbol}{row.cost.toFixed(2)}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: row.profit >= 0 ? GREEN : RED }}>{currencySymbol}{row.profit.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent transactions */}
            <div>
              <div style={sectionLabel}>{tc('pos.recent_transactions')}</div>
              {transactions.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: ACC_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{tc('pos.no_sales_yet')}</div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }} dangerouslySetInnerHTML={{ __html: tc('pos.no_sales_hint', { brand: '<strong>pos.askbiz.co</strong>' }) }} />
                </div>
              ) : (
                <>
                  <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                    {transactions.slice(txPage * TX_PER_PAGE, (txPage + 1) * TX_PER_PAGE).map((tx, i, arr) => (
                      <div key={tx.id} onClick={() => setTxDetail(tx)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', cursor: 'pointer', transition: 'background 150ms' }}
                        onMouseEnter={e => { (e.currentTarget.style as any).background = 'rgba(208,138,89,.03)' }} onMouseLeave={e => { (e.currentTarget.style as any).background = 'var(--sf)' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>
                            {(tx.pos_items || []).slice(0, 2).map(i => i.name).join(', ')}
                            {(tx.pos_items?.length ?? 0) > 2 && ' ' + tc('pos.more_items', { count: tx.pos_items.length - 2 })}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                            {tx.cashier?.name || tc('pos.owner')} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {tx.payment_type}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {tx.status !== 'completed' && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: RED, background: 'rgba(220,38,38,.08)', padding: '2px 7px', borderRadius: 9999 }}>{tx.status.replace('_', ' ')}</span>
                          )}
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{currencySymbol}{tx.total.toFixed(2)}</div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Pagination */}
                  {transactions.length > TX_PER_PAGE && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
                      <button onClick={() => setTxPage(p => Math.max(0, p - 1))} disabled={txPage === 0} style={{ ...btnSecondary, opacity: txPage === 0 ? 0.4 : 1, padding: '6px 12px', fontSize: 12 }}>{tc('pos.pagination_previous')}</button>
                      <span style={{ fontSize: 12, color: 'var(--tx3)', alignSelf: 'center' }}>{tc('pos.pagination_of', { current: txPage + 1, total: Math.ceil(transactions.length / TX_PER_PAGE) })}</span>
                      <button onClick={() => setTxPage(p => Math.min(Math.ceil(transactions.length / TX_PER_PAGE) - 1, p + 1))} disabled={(txPage + 1) * TX_PER_PAGE >= transactions.length} style={{ ...btnSecondary, opacity: (txPage + 1) * TX_PER_PAGE >= transactions.length ? 0.4 : 1, padding: '6px 12px', fontSize: 12 }}>{tc('pos.pagination_next')}</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ SECTOR TAB (adapts per business_type) ══════════════ */}
        {tab === 'services' && (() => {
          const sector = currentSector

          const isRestaurant = sector === 'restaurant'
          const isRepair     = sector === 'repair'

          const sectorPicker = staffSector ? (
            // Staff session — show locked sector badge, no switching
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ padding: '5px 14px', borderRadius: 20, background: ACC, color: '#fff', fontSize: 12, fontWeight: 600 }}>
                {sector === 'restaurant' ? tc('pos.sector_restaurant') : sector === 'repair' ? tc('pos.sector_repair') : sector === 'salon' ? tc('pos.sector_salon') : tc('pos.sector_retail')}
              </span>
              <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos.sector_assigned_note')}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { id: 'restaurant', label: tc('pos.sector_restaurant') },
                { id: 'repair',     label: tc('pos.sector_repair') },
                { id: 'salon',      label: tc('pos.sector_salon') },
                { id: 'retail',     label: tc('pos.sector_retail') },
              ].map(s => (
                <button key={s.id} onClick={() => setSectorOverride(s.id === detectedSector ? null : s.id)}
                  style={{ padding: '5px 14px', borderRadius: 20, border: `1.5px solid ${sector === s.id ? ACC : 'var(--b)'}`,
                    background: sector === s.id ? ACC : 'var(--sf)', color: sector === s.id ? '#fff' : 'var(--tx3)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {s.label}
                </button>
              ))}
            </div>
          )

          // ── RESTAURANT sector gateway ─────────────────────────────
          if (isRestaurant) return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{tc('pos.restaurant_ops_title')}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos.restaurant_ops_desc')}</div>
              </div>

              {/* Quick-link tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
                {[
                  { label: tc('pos.tile_floor_plan'),    href: '/restaurant/floor',         desc: tc('pos.tile_floor_plan_desc') },
                  { label: tc('pos.tile_orders'),        href: '/restaurant/orders',        desc: tc('pos.tile_orders_desc') },
                  { label: tc('pos.tile_kitchen'),       href: '/restaurant/kitchen',       desc: tc('pos.tile_kitchen_desc') },
                  { label: tc('pos.tile_menu'),          href: '/restaurant/menu',          desc: tc('pos.tile_menu_desc') },
                  { label: tc('pos.tile_labour'),        href: '/restaurant/labor',         desc: tc('pos.tile_labour_desc') },
                  { label: tc('pos.tile_online_orders'), href: '/restaurant/online-orders', desc: tc('pos.tile_online_orders_desc') },
                  { label: tc('pos.tile_reservations'),  href: '/restaurant/reservations',  desc: tc('pos.tile_reservations_desc') },
                  { label: tc('pos.tile_deliveries'),    href: '/restaurant/deliveries',    desc: tc('pos.tile_deliveries_desc') },
                  { label: tc('pos.tile_waste'),         href: '/restaurant/waste',         desc: tc('pos.tile_waste_desc') },
                ].map(tile => (
                  <a key={tile.href} href={tile.href}
                    style={{ display: 'block', background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: '16px 14px', textDecoration: 'none', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b)')}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{tile.label.split(' ')[0]}</div>
                    <div style={{ fontWeight: 600, color: 'var(--tx)', fontSize: 14 }}>{tile.label.split(' ').slice(1).join(' ')}</div>
                    <div style={{ color: 'var(--tx3)', fontSize: 12, marginTop: 2 }}>{tile.desc}</div>
                  </a>
                ))}
              </div>

              {/* Live snapshot — fetched client-side */}
              <RestaurantSnapshot currencySymbol={currencySymbol} />
            </div>
          )

          // ── REPAIR sector ───
          if (isRepair) return (
            <div style={{ maxWidth: 900 }}>
              {sectorPicker}
              <ServiceJobsTab currencySymbol={currencySymbol} selectedLocation={'all'} staff={staff} notify={notify} />
            </div>
          )

          // ── SALON sector ───
          if (sector === 'salon') return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{tc('pos.salon_title')}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos.salon_desc')}</div>
              </div>
              <div style={{ color: 'var(--tx3)', fontSize: 13 }}>{tc('pos.salon_coming_soon')}</div>
            </div>
          )

          // ── RETAIL / DEFAULT ───
          return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{tc('pos.retail_ops_title')}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos.retail_ops_desc')}</div>
              </div>
              <div style={{ color: 'var(--tx3)', fontSize: 13 }}>
                {tc('pos.retail_inventory_hint_1')} <strong>{tc('pos.retail_inventory_hint_inventory')}</strong> {tc('pos.retail_inventory_hint_2')}{' '}
                {tc('pos.retail_inventory_hint_3')}{' '}
                <a href="/pos/settings" style={{ color: ACC }}>{tc('pos.retail_settings')}</a>.
              </div>
            </div>
          )
        })()}

        {/* ══════════════ STAFF TAB ══════════════ */}
        {tab === 'staff' && (
          <div style={{ maxWidth: 700 }}>
            {(() => {
              const activeStaff = staff.filter(s => s.active).length
              const atLimit = activeStaff >= seatCount
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>
                    {seatCount !== 1 ? tc('pos.seats_used_other', { used: activeStaff, total: seatCount }) : tc('pos.seats_used_one', { used: activeStaff, total: seatCount })}
                    {atLimit && <span style={{ marginLeft: 8, color: RED, fontWeight: 600 }}>· <a href="/billing" style={{ color: RED }}>{tc('pos.add_seats_link')}</a></span>}
                  </div>
                  <button onClick={() => atLimit ? window.location.href = '/billing' : setShowAddStaff(true)} style={{ ...btnPrimary, background: atLimit ? RED : ACC }}>
                    {atLimit ? tc('pos.upgrade_seats') : tc('pos.add_staff')}
                  </button>
                </div>
              )
            })()}

            {/* Add staff form */}
            {showAddStaff && (
              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{tc('pos.new_staff_member')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input placeholder={tc('pos.ph_full_name')} value={newName} onChange={e => setNewName(e.target.value)} style={inputStyle} />
                  <input placeholder={tc('pos.ph_phone_example')} value={newPhone} onChange={e => setNewPhone(e.target.value)} style={inputStyle} />
                  <div style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center' }}>{tc('pos.or_separator')}</div>
                  <input placeholder={tc('pos.ph_email_alt')} value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" style={inputStyle} />
                  <select value={newRole} onChange={e => setNewRole(e.target.value)} style={inputStyle}>
                    {ROLE_OPTIONS.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  {locations.length > 0 && (
                    <select value={newLocation} onChange={e => setNewLocation(e.target.value)} style={{ ...inputStyle, borderColor: BRANCH_ROLES.has(newRole) && !newLocation ? 'rgba(202,138,4,.5)' : undefined }}>
                      <option value="">{BRANCH_ROLES.has(newRole) ? tc('pos.branch_required_select') : tc('pos.branch_optional')}</option>
                      {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  )}
                  {BRANCH_ROLES.has(newRole) && !newLocation && <div style={{ fontSize: 11, color: '#ca8a04' }}>{tc('pos.branch_warning_logistics')}</div>}
                  <input placeholder={tc('pos.ph_pin_required')} value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} type="text" inputMode="numeric" maxLength={6} style={{ ...inputStyle, letterSpacing: '0.15em', borderColor: newPin && newPin.length >= 4 ? 'rgba(22,163,74,.4)' : undefined }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleAddStaff} disabled={addingStaff} style={btnPrimary}>{addingStaff ? tc('pos.adding') : tc('pos.add_staff_member')}</button>
                    <button onClick={() => setShowAddStaff(false)} style={btnSecondary}>{tc('pos.cancel')}</button>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }} dangerouslySetInnerHTML={{ __html: tc('pos.staff_login_note', { brand: '<strong>pos.askbiz.co</strong>' }) }} />
                </div>
              </div>
            )}

            {/* Staff list */}
            {staff.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: ACC_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{tc('pos.no_staff_yet')}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos.no_staff_hint')}</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                {staff.map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < staff.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', opacity: s.active ? 1 : 0.5, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.active ? ACC_BG : 'var(--ev)', border: `1px solid ${s.active ? ACC_BORDER : 'var(--b)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: s.active ? ACC : 'var(--tx3)', flexShrink: 0 }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span>{s.role}</span>
                          {s.location?.name && <span style={{ color: ACC, fontWeight: 600 }}>· 📍 {s.location.name}</span>}
                          {s.phone && <span>· {s.phone}</span>}
                          {s.has_pin ? <span style={{ color: GREEN, fontWeight: 600 }}>· {tc('pos.pin_set')}</span> : <span style={{ color: RED, fontWeight: 600 }}>· {tc('pos.no_pin')}</span>}
                          {s.last_login_at && <span>· {tc('pos.last_login', { date: new Date(s.last_login_at).toLocaleDateString('en-GB') })}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleOpenEditStaff(s)} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)' }}>{tc('pos.edit')}</button>
                      <button onClick={() => handleToggleStaff(s)} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: s.active ? 'rgba(220,38,38,.08)' : 'rgba(22,163,74,.08)', color: s.active ? RED : GREEN }}>
                        {s.active ? tc('pos.deactivate') : tc('pos.reactivate')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit staff inline */}
            {editingStaff && (
              <div style={{ ...cardStyle, marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{tc('pos.edit_staff', { name: editingStaff.name })}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  <input placeholder={tc('pos.ph_full_name')} value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
                  <input placeholder={tc('pos.ph_phone')} value={editPhone} onChange={e => setEditPhone(e.target.value)} style={inputStyle} />
                  <div style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center' }}>{tc('pos.or_separator')}</div>
                  <input placeholder={tc('pos.ph_email')} value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" style={inputStyle} />
                  <select value={editRole} onChange={e => setEditRole(e.target.value)} style={inputStyle}>
                    {ROLE_OPTIONS.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  {locations.length > 0 && (
                    <select value={editLocation} onChange={e => setEditLocation(e.target.value)} style={{ ...inputStyle, borderColor: BRANCH_ROLES.has(editRole) && !editLocation ? 'rgba(202,138,4,.5)' : undefined }}>
                      <option value="">{BRANCH_ROLES.has(editRole) ? tc('pos.branch_required_select') : tc('pos.no_branch')}</option>
                      {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  )}
                  {BRANCH_ROLES.has(editRole) && !editLocation && <div style={{ fontSize: 11, color: '#ca8a04' }}>{tc('pos.branch_warning_role')}</div>}
                  <input placeholder={editingStaff.has_pin ? tc('pos.ph_new_pin_keep') : tc('pos.ph_new_pin')} value={editPin} onChange={e => setEditPin(e.target.value.replace(/\D/g, '').slice(0, 6))} type="text" inputMode="numeric" maxLength={6} style={{ ...inputStyle, letterSpacing: '0.15em', borderColor: editPin && editPin.length >= 4 ? 'rgba(22,163,74,.4)' : undefined }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleEditStaff} disabled={editingSubmitting} style={btnPrimary}>{editingSubmitting ? tc('pos.saving') : tc('pos.save_changes')}</button>
                  <button onClick={() => setEditingStaff(null)} style={btnSecondary}>{tc('pos.cancel')}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ INVENTORY TAB ══════════════ */}
        {tab === 'inventory' && (
          <div style={{ maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{filteredInventory.length !== 1 ? tc('pos.products_count_other', { count: filteredInventory.length }) : tc('pos.products_count_one', { count: filteredInventory.length })}</div>
              <div style={{ display: 'flex', gap: 8, position: 'relative', flexWrap: 'wrap' }}>
                <input ref={cameraInputRef} type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleImageCapture(e.target.files[0]) }} style={{ display: 'none' }} capture="environment" />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleImageCapture(e.target.files[0]) }} style={{ display: 'none' }} />
                <button onClick={() => setShowCameraMenu(!showCameraMenu)} disabled={recognizing} style={{ ...btnSecondary, opacity: recognizing ? 0.6 : 1, fontSize: 12 }}>
                  {recognizing ? tc('pos.reading') : tc('pos.scan_products')}
                </button>
                {showCameraMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', zIndex: 10, minWidth: 160 }}>
                    <button onClick={handleOpenCamera} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--tx)', borderBottom: '1px solid var(--b)', fontFamily: 'inherit' }}>{tc('pos.take_photo')}</button>
                    <button onClick={() => { fileInputRef.current?.click(); setShowCameraMenu(false) }} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--tx)', fontFamily: 'inherit' }}>{tc('pos.upload_file')}</button>
                  </div>
                )}
                <button onClick={() => setShowBulkImport(true)} style={{ ...btnSecondary, fontSize: 12 }}>{tc('pos.csv_import')}</button>
                <button onClick={() => setShowAddProduct(true)} style={{ ...btnPrimary, fontSize: 12 }}>{tc('pos.add_product')}</button>
              </div>
            </div>

            {/* Search & category filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <input placeholder={tc('pos.ph_search_products')} value={invSearch} onChange={e => setInvSearch(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
              {categories.length > 2 && (
                <select value={invCategory} onChange={e => setInvCategory(e.target.value)} style={{ ...inputStyle, minWidth: 140 }}>
                  {categories.map(c => <option key={c} value={c}>{c === 'all' ? tc('pos.all_categories') : c}</option>)}
                </select>
              )}
            </div>

            {/* Camera preview modal */}
            {showCameraPreview && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 600, borderRadius: 12, marginBottom: 16 }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={handleCapturePhoto} disabled={recognizing} style={{ ...btnPrimary, padding: '12px 28px', fontSize: 14, fontWeight: 700 }}>{recognizing ? tc('pos.processing') : tc('pos.capture_photo')}</button>
                  <button onClick={handleCloseCamera} disabled={recognizing} style={{ padding: '12px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{tc('pos.cancel')}</button>
                </div>
              </div>
            )}

            {/* Recognized products */}
            {/* Edit modal for recognized products */}
            {editingRecognizedIndex !== null && recognizedProducts.length > 0 && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setEditingRecognizedIndex(null)}>
                <div style={{ background: 'var(--sf)', borderRadius: 16, padding: 24, maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', marginBottom: 20, marginTop: 0 }}>{tc('pos.edit_product_details')}</h3>

                  {/* Product name (read-only) */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('pos.label_product_name')}</label>
                    <input type="text" value={editingRecognizedData.name || ''} disabled style={{ ...inputStyle, background: 'var(--ev)', opacity: 0.6, width: '100%' }} />
                  </div>

                  {/* SKU / Barcode */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('pos.label_sku_barcode')} {editingRecognizedData.barcode_number ? tc('pos.auto_detected') : ''}</label>
                    <input type="text" placeholder={tc('pos.ph_barcode_example')} value={editingRecognizedData.sku || editingRecognizedData.barcode_number || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, sku: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
                    {editingRecognizedData.barcode_detected && <div style={{ fontSize: 11, color: 'var(--acc)', marginTop: 4 }}>{tc('pos.barcode_detected')}</div>}
                  </div>

                  {/* Cost price */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('pos.label_cost_price')}</label>
                    <input type="number" placeholder="0.00" value={editingRecognizedData.cost_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, cost_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
                  </div>

                  {/* Sale price */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('pos.label_sale_price')}</label>
                    <input type="number" placeholder="0.00" value={editingRecognizedData.sale_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, sale_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
                  </div>

                  {/* Quantity */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('pos.label_starting_stock')}</label>
                    <input type="number" value={editingRecognizedData.stock_qty || 1} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, stock_qty: e.target.value })} style={{ ...inputStyle, width: '100%' }} min="1" />
                  </div>

                  {/* Margin preview */}
                  {editingRecognizedData.cost_price && editingRecognizedData.sale_price && (
                    <div style={{ background: 'var(--ev)', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 12 }}>
                      <div style={{ color: 'var(--tx2)', marginBottom: 4 }}>{tc('pos.margin_label')} <strong style={{ color: 'var(--acc)' }}>{((parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)) / parseFloat(editingRecognizedData.sale_price || 1) * 100).toFixed(1)}%</strong></div>
                      <div style={{ color: 'var(--tx3)', fontSize: 11 }}>{tc('pos.profit_per_unit', { amount: (parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)).toFixed(2) })}</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={async () => {
                      if (!editingRecognizedData.sale_price) return
                      setAddingProduct(true)
                      try {
                        const res = await fetch('/api/pos/inventory', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: editingRecognizedData.name,
                            sale_price: parseFloat(editingRecognizedData.sale_price),
                            cost_price: parseFloat(editingRecognizedData.cost_price || '0'),
                            stock_qty: parseInt(editingRecognizedData.stock_qty || '1'),
                            low_stock_threshold: 5,
                            category: editingRecognizedData.category || 'General'
                          })
                        })
                        const data = await res.json()
                        if (data.product) {
                          setInventory(prev => [...prev, data.product])
                          notify(tc('pos.toast_product_added', { name: data.product.name }))
                          // Remove from recognized list
                          const newRecognized = recognizedProducts.filter((_, idx) => idx !== editingRecognizedIndex)
                          setRecognizedProducts(newRecognized)
                          // If more products, move to next one
                          if (newRecognized.length > 0) {
                            const nextProduct = newRecognized[0]
                            setEditingRecognizedIndex(0)
                            setEditingRecognizedData({
                              ...nextProduct,
                              sale_price: nextProduct.sale_price || '',
                              cost_price: nextProduct.cost_price || '',
                              stock_qty: (nextProduct.quantity || 1).toString()
                            })
                          } else {
                            setEditingRecognizedIndex(null)
                          }
                        }
                      } catch (err) {
                        notify(tc('pos.toast_add_product_failed'), false)
                      }
                      setAddingProduct(false)
                    }} disabled={!editingRecognizedData.sale_price || addingProduct} style={{ ...btnPrimary, flex: 1, opacity: !editingRecognizedData.sale_price || addingProduct ? 0.5 : 1 }}>{addingProduct ? tc('pos.adding') : tc('pos.add_to_inventory')}</button>
                    <button onClick={() => { setEditingRecognizedIndex(null); setRecognizedProducts([]) }} style={btnSecondary}>{tc('pos.done')}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk CSV import */}
            {showBulkImport && (
              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{tc('pos.bulk_import_title')}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10 }}>{tc('pos.bulk_import_format')}<code>name, price, stock_qty, unit</code>{tc('pos.bulk_import_format_suffix')}</div>
                <input ref={csvInputRef} type="file" accept=".csv,.txt" onChange={handleCsvFile} style={{ display: 'none' }} />
                <button onClick={() => csvInputRef.current?.click()} style={{ ...btnSecondary, marginBottom: 8, fontSize: 12 }}>{tc('pos.choose_csv_file')}</button>
                <textarea value={bulkCsv} onChange={e => setBulkCsv(e.target.value)} placeholder={tc('pos.ph_bulk_csv')} rows={5} style={{ ...inputStyle, width: '100%', resize: 'vertical', marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleBulkImport} disabled={importingBulk || !bulkCsv.trim()} style={{ ...btnPrimary, opacity: !bulkCsv.trim() ? 0.5 : 1 }}>{importingBulk ? tc('pos.importing') : tc('pos.import_products')}</button>
                  <button onClick={() => { setShowBulkImport(false); setBulkCsv('') }} style={btnSecondary}>{tc('pos.cancel')}</button>
                </div>
              </div>
            )}

            {/* Add product form */}
            {showAddProduct && (
              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{tc('pos.new_product')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input placeholder={tc('pos.ph_product_name')} value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, gridColumn: '1/-1' }} />
                  <input placeholder={tc('pos.ph_sale_price')} type="number" value={newProduct.sale_price} onChange={e => setNewProduct(p => ({ ...p, sale_price: e.target.value }))} style={inputStyle} />
                  <input placeholder={tc('pos.ph_cost_price_optional')} type="number" value={newProduct.cost_price} onChange={e => setNewProduct(p => ({ ...p, cost_price: e.target.value }))} style={inputStyle} />
                  <input placeholder={tc('pos.ph_starting_stock_qty')} type="number" value={newProduct.stock_qty} onChange={e => setNewProduct(p => ({ ...p, stock_qty: e.target.value }))} style={inputStyle} />
                  <input placeholder={tc('pos.ph_low_stock_alert')} type="number" value={newProduct.low_stock_threshold} onChange={e => setNewProduct(p => ({ ...p, low_stock_threshold: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={handleAddProduct} disabled={addingProduct} style={btnPrimary}>{addingProduct ? tc('pos.adding') : tc('pos.add_product_submit')}</button>
                  <button onClick={() => setShowAddProduct(false)} style={btnSecondary}>{tc('pos.cancel')}</button>
                </div>
              </div>
            )}

            {/* Edit product modal */}
            {editingProduct && (
              <div style={{ ...cardStyle, marginBottom: 16, border: `1px solid ${ACC}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{tc('pos.edit_product', { name: editingProduct.name })}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input placeholder={tc('pos.ph_name')} value={editProduct.name} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, gridColumn: '1/-1' }} />
                  <input placeholder={tc('pos.ph_sale_price')} type="number" value={editProduct.sale_price} onChange={e => setEditProduct(p => ({ ...p, sale_price: e.target.value }))} style={inputStyle} />
                  <input placeholder={tc('pos.ph_cost_price')} type="number" value={editProduct.cost_price} onChange={e => setEditProduct(p => ({ ...p, cost_price: e.target.value }))} style={inputStyle} />
                  <input placeholder={tc('pos.ph_stock_qty')} type="number" value={editProduct.stock_qty} onChange={e => setEditProduct(p => ({ ...p, stock_qty: e.target.value }))} style={inputStyle} />
                  <input placeholder={tc('pos.ph_low_stock_threshold')} type="number" value={editProduct.low_stock_threshold} onChange={e => setEditProduct(p => ({ ...p, low_stock_threshold: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={handleEditProduct} disabled={editingProductSubmitting} style={btnPrimary}>{editingProductSubmitting ? tc('pos.saving') : tc('pos.save')}</button>
                  <button onClick={() => setEditingProduct(null)} style={btnSecondary}>{tc('pos.cancel')}</button>
                </div>
              </div>
            )}

            {/* Inventory table */}
            {filteredInventory.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: ACC_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{invSearch || invCategory !== 'all' ? tc('pos.no_matching_products') : tc('pos.no_products_yet')}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{invSearch || invCategory !== 'all' ? tc('pos.no_matching_hint') : tc('pos.no_products_hint')}</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 70px 110px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  <span>{tc('pos.col_product')}</span><span style={{ textAlign: 'right' }}>{tc('pos.col_price')}</span><span style={{ textAlign: 'right' }}>{tc('pos.col_cost')}</span><span style={{ textAlign: 'right' }}>{tc('pos.col_stock')}</span><span style={{ textAlign: 'right' }}>{tc('pos.col_actions')}</span>
                </div>
                {filteredInventory.map((item, i) => {
                  const isOut = item.stock_qty === 0
                  const isLow = !isOut && item.stock_qty <= item.low_stock_threshold
                  const profitPer = item.sale_price - (item.cost_price || 0)
                  return (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 70px 110px', padding: '12px 16px', borderTop: i === 0 ? 'none' : '1px solid var(--b)', background: 'var(--sf)', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>
                          {item.name}
                          {isOut && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: RED, background: 'rgba(220,38,38,.08)', padding: '1px 6px', borderRadius: 9999 }}>{tc('pos.badge_out')}</span>}
                          {isLow && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: AMBER, background: 'rgba(234,179,8,.08)', padding: '1px 6px', borderRadius: 9999 }}>{tc('pos.badge_low')}</span>}
                        </div>
                        {item.sku && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.sku_prefix', { sku: item.sku })}</div>}
                        {item.last_sold_at && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.last_sold', { date: new Date(item.last_sold_at).toLocaleDateString('en-GB') })}</div>}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', textAlign: 'right' }}>{currencySymbol}{item.sale_price.toFixed(2)}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx3)' }}>{currencySymbol}{(item.cost_price || 0).toFixed(2)}</div>
                        {profitPer > 0 && <div style={{ fontSize: 10, color: GREEN }}>+{currencySymbol}{profitPer.toFixed(2)}</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {restockId === item.id ? (
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                            <input value={restockQty} onChange={e => setRestockQty(e.target.value.replace(/\D/g, ''))} placeholder={tc('pos.ph_qty')} style={{ ...inputStyle, width: 50, padding: '4px 6px', fontSize: 12, textAlign: 'center' }} autoFocus onKeyDown={e => { if (e.key === 'Enter') handleRestock(item.id); if (e.key === 'Escape') setRestockId(null) }} />
                            <button onClick={() => handleRestock(item.id)} style={{ padding: '4px 6px', borderRadius: 4, background: GREEN, color: '#fff', border: 'none', fontSize: 10, cursor: 'pointer' }}>+</button>
                          </div>
                        ) : (
                          <div onClick={() => { setRestockId(item.id); setRestockQty('') }} style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', cursor: 'pointer' }} title={tc('pos.restock_title')}>
                            {item.stock_qty}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => { setEditingProduct(item); setEditProduct({ name: item.name, sale_price: item.sale_price.toString(), cost_price: (item.cost_price || 0).toString(), stock_qty: item.stock_qty.toString(), low_stock_threshold: item.low_stock_threshold.toString(), category: item.category || '' }) }} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }}>{tc('pos.edit')}</button>
                        <button onClick={() => handleDeleteProduct(item)} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: 'rgba(220,38,38,.08)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: RED }}>{tc('pos.remove')}</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ AUDIT TAB ══════════════ */}
        {tab === 'audit' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16 }}>{tc('pos.audit_intro')}</div>
            {transactions.filter(t => t.status !== 'completed').length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(22,163,74,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{tc('pos.clean_record')}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('pos.clean_record_hint')}</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                {transactions.filter(t => t.status !== 'completed').map((tx, i, arr) => (
                  <div key={tx.id} style={{ padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', cursor: 'pointer' }} onClick={() => setTxDetail(tx)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: tx.status === 'refunded' ? RED : AMBER, background: tx.status === 'refunded' ? 'rgba(220,38,38,.08)' : 'rgba(234,179,8,.08)', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase' }}>{tx.status.replace('_', ' ')}</span>
                        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos.sale_number', { id: tx.id.slice(0, 8) })}</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: RED }}>-{currencySymbol}{tx.total.toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tx.cashier?.name || tc('pos.owner')} · {new Date(tx.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'map' && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--tx3)' }}>
                {geoPoints.length > 0
                  ? (geoPoints.length !== 1 ? tc('pos.geo_count_other', { count: geoPoints.length }) : tc('pos.geo_count_one', { count: geoPoints.length }))
                  : tc('pos.geo_empty')}
              </div>
            </div>
            <div style={{ position: 'relative', height: 520, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--b)' }}>
              <div ref={mapDivRef} style={{ position: 'absolute', inset: 0 }} />
              {geoPoints.length === 0 && (
                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 20 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{tc('pos.map_no_pins')}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.map_no_pins_hint')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Transaction detail modal */}
      {txDetail && (
        <>
          <div onClick={() => setTxDetail(null)} style={modalOverlay} />
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>{tc('pos.transaction_details')}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos.tx_meta', { id: txDetail.id.slice(0, 8), date: new Date(txDetail.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) })}</div>
              </div>
              {txDetail.status !== 'completed' && <span style={{ fontSize: 11, fontWeight: 700, color: RED, background: 'rgba(220,38,38,.08)', padding: '4px 10px', borderRadius: 9999, textTransform: 'uppercase' }}>{txDetail.status.replace('_', ' ')}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos.cashier')}<div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginTop: 2 }}>{txDetail.cashier?.name || tc('pos.owner')}</div></div>
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('pos.payment')}<div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginTop: 2, textTransform: 'capitalize' }}>{txDetail.payment_type}</div></div>
            </div>
            {txDetail.pos_customers?.phone && <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 12 }}>{tc('pos.customer', { name: txDetail.pos_customers.name || txDetail.pos_customers.phone })}</div>}
            <div style={{ border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 70px 70px', padding: '8px 14px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' }}>
                <span>{tc('pos.col_item')}</span><span style={{ textAlign: 'center' }}>{tc('pos.col_qty')}</span><span style={{ textAlign: 'right' }}>{tc('pos.col_unit')}</span><span style={{ textAlign: 'right' }}>{tc('pos.col_total')}</span>
              </div>
              {(txDetail.pos_items || []).map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 50px 70px 70px', padding: '10px 14px', borderTop: '1px solid var(--b)', fontSize: 13 }}>
                  <span style={{ color: 'var(--tx)', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ textAlign: 'center', color: 'var(--tx3)' }}>{item.qty}</span>
                  <span style={{ textAlign: 'right', color: 'var(--tx3)' }}>{currencySymbol}{item.unit_price.toFixed(2)}</span>
                  <span style={{ textAlign: 'right', fontWeight: 600 }}>{currencySymbol}{(item.qty * item.unit_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid var(--b)', fontSize: 16, fontWeight: 800 }}>
              <span>{tc('pos.total')}</span>
              <span>{currencySymbol}{txDetail.total.toFixed(2)}</span>
            </div>
            {txDetail.notes && <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 8 }}>{tc('pos.note', { note: txDetail.notes })}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {txDetail.status === 'completed' && (
                <button onClick={() => { setRefundTx(txDetail); setTxDetail(null); setRefundReason('') }} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(220,38,38,.25)', background: 'rgba(220,38,38,.06)', color: RED, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{tc('pos.process_refund')}</button>
              )}
              <button onClick={() => setTxDetail(null)} style={btnSecondary}>{tc('pos.close')}</button>
            </div>
          </div>
        </>
      )}

      {/* Filter/drill-down modal */}
      {filterModal && (
        <>
          <div onClick={() => setFilterModal(null)} style={modalOverlay} />
          <div style={modalBox}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{filterModal.title}</div>
            {filterModal.type === 'sales' && (
              <div>
                {completedTx.length === 0 ? <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>{tc('pos.no_completed_sales')}</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                    {completedTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || tc('pos.sale')}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tx.cashier?.name || tc('pos.owner')} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{currencySymbol}{tx.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {filterModal.type === 'refunds' && (
              <div>
                {refundedTx.length === 0 ? <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>{tc('pos.no_refunds')}</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                    {refundedTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'rgba(220,38,38,.2)' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || tc('pos.refund')}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tx.cashier?.name || tc('pos.owner')} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: RED }}>-{currencySymbol}{tx.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {filterModal.type === 'low_stock' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                {outOfStock.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>{tc('pos.out_of_stock')}</span>
                  </div>
                ))}
                {lowStock.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(234,179,8,.06)', border: '1px solid rgba(234,179,8,.25)' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{tc('pos.stock_left', { count: item.stock_qty })}</span>
                  </div>
                ))}
                {alertCount === 0 && <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>{tc('pos.all_stock_healthy')}</div>}
              </div>
            )}
            {filterModal.type === 'cashier_detail' && (() => {
              const cashierTx = completedTx.filter(t => t.cashier?.name === filterModal.cashier_id)
              const cashierRevenue = cashierTx.reduce((s, t) => s + t.total, 0)
              const avgSale = cashierTx.length > 0 ? cashierRevenue / cashierTx.length : 0
              const cashierHourly = Array.from({ length: 24 }, (_, i) => ({ label: `${i}:00`, value: 0 }))
              cashierTx.forEach(t => { const h = new Date(t.created_at).getHours(); cashierHourly[h].value += t.total })
              const activeHours = cashierHourly.filter(h => h.value > 0)
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.kpi_sales')}</div><div style={{ fontSize: 20, fontWeight: 800, color: ACC }}>{cashierTx.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.kpi_revenue')}</div><div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>{currencySymbol}{cashierRevenue.toFixed(2)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos.avg_sale')}</div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--tx)' }}>{currencySymbol}{avgSale.toFixed(2)}</div></div>
                  </div>
                  {activeHours.length > 0 && (
                    <div style={{ ...cardStyle, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>{tc('pos.sales_by_hour')}</div>
                      <MiniBarChart data={activeHours} color={ACC} height={60} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                    {cashierTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || tc('pos.sale')}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {tx.payment_type}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{currencySymbol}{tx.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
            <button onClick={() => setFilterModal(null)} style={{ ...btnSecondary, marginTop: 16 }}>{tc('pos.close')}</button>
          </div>
        </>
      )}

      {/* Refund modal */}
      {refundTx && (
        <>
          <div onClick={() => setRefundTx(null)} style={modalOverlay} />
          <div style={modalBox}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tc('pos.process_refund')}</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 20 }}>{tc('pos.refund_sale_meta', { id: refundTx.id.slice(0, 8), amount: currencySymbol + refundTx.total.toFixed(2), cashier: refundTx.cashier?.name || tc('pos.owner') })}</div>
            <div style={{ border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              {(refundTx.pos_items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < refundTx.pos_items.length - 1 ? '1px solid var(--b)' : 'none', fontSize: 13 }}>
                  <span style={{ color: 'var(--tx)' }}>{item.name} x{item.qty}</span>
                  <span style={{ fontWeight: 600 }}>{currencySymbol}{item.unit_price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{tc('pos.reason_required')}</div>
              <select value={refundReason} onChange={e => setRefundReason(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                <option value="">{tc('pos.reason_select')}</option>
                <option value="Customer changed mind">{tc('pos.reason_changed_mind')}</option>
                <option value="Wrong item scanned">{tc('pos.reason_wrong_item')}</option>
                <option value="Defective product">{tc('pos.reason_defective')}</option>
                <option value="Duplicate charge">{tc('pos.reason_duplicate')}</option>
                <option value="Other">{tc('pos.reason_other')}</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleRefund(true)} disabled={!refundReason || refunding} style={{ flex: 1, padding: 12, borderRadius: 10, background: RED, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: !refundReason || refunding ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: !refundReason ? 0.5 : 1 }}>
                {refunding ? tc('pos.processing') : tc('pos.full_refund')}
              </button>
              <button onClick={() => setRefundTx(null)} style={{ flex: 1, ...btnSecondary, padding: 12, fontSize: 14 }}>{tc('pos.cancel')}</button>
            </div>
          </div>
        </>
      )}

      {/* Inject keyframes for animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: .5; } 50% { opacity: .8; } }
      `}</style>
    </div>
  )
}
