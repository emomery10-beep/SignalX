'use client'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ServiceJobsTab from '@/components/pos/ServiceJobsTab'
import RepairMetrics from '@/components/pos/RepairMetrics'
import AuditTab from '@/components/pos/AuditTab'
import RestaurantTab from '@/components/pos/RestaurantTab'
import RepairTab from '@/components/pos/RepairTab'
import SalonTab from '@/components/pos/SalonTab'
import RetailTab from '@/components/pos/RetailTab'
import FactoryTab from '@/components/pos/FactoryTab'
import PaymentsTab from '@/components/pos/PaymentsTab'
import StaffTemplatesTab from '@/components/pos/StaffTemplatesTab'
import { getTemplateById } from '@/lib/staff-templates'

const ACC = '#d08a59'
const ACC_BG = 'rgba(208,138,89,.08)'
const ACC_BORDER = 'rgba(208,138,89,.2)'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'

function fmt(symbol: string, amount: number, decimals = 2): string {
  const num = amount.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  const needsSpace = symbol.length > 1 && /[a-zA-Z]$/.test(symbol)
  return `${symbol}${needsSpace ? ' ' : ''}${num}`
}

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
  id: string; name: string; phone: string; email?: string; role: 'cashier' | 'inventory' | 'repair' | 'engineer' | 'supervisor' | 'manager' | 'handler' | 'driver' | 'dispatcher' | 'branch_manager'; sector: string; sector_edit_count: number; active: boolean; last_login_at: string | null; has_pin?: boolean; location_id?: string; location?: { id: string; name: string } | null
}
interface Transaction {
  id: string; total: number; subtotal?: number; discount_amount?: number | null; amount_tendered?: number | null; payment_type: string; status: string; created_at: string; notes?: string; pos_location_id?: string | null
  cashier: { id?: string; name: string; role?: string } | null
  pos_items: { name: string; qty: number; unit_price: number; cost_price?: number; inventory_id?: string }[]
  pos_customers?: { phone: string; name?: string } | null
}
interface InventoryItem {
  id: string; name: string; sku?: string; sale_price: number; cost_price: number; stock_qty: number; low_stock_threshold: number; unit?: string; last_sold_at: string | null; category?: string; sector?: string | null; active: boolean; location_id?: string; location?: { id: string; name: string } | null;
  expiry_date?: string | null; batch_number?: string | null; supplier?: string | null; brand?: string | null;
}
interface Location {
  id: string; name: string; address?: string; phone?: string; is_active: boolean
}
type Tab = 'overview' | 'services' | 'staff' | 'staff_templates' | 'inventory' | 'branches' | 'audit' | 'map' | 'operations' | 'captures' | 'approvals' | 'intelligence' | 'logistics' | 'customers' | 'promotions' | 'loyalty' | 'returns' | 'reports' | 'purchase_orders' | 'gift_cards' | 'integrations' | 'restaurant' | 'repair' | 'salon' | 'retail' | 'factory' | 'payments'
type DateRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom'
type FilterModalType = { type: 'sales' | 'refunds' | 'low_stock' | 'cashier_detail' | 'gross_profit' | 'margin' | 'avg_sale' | 'staff_overview' | 'stock_item' | 'payment_breakdown' | 'branch_detail' | 'customer_history' | 'product_history'; title: string; cashier_id?: string; item_id?: string; payment_type?: string; branch_id?: string; customer_phone?: string; product_name?: string } | null
type TxDetailType = Transaction | null

const SECTOR_BADGE_COLOR: Record<string, string> = { restaurant: '#d08a59', repair: '#6366f1', salon: '#ec4899', retail: '#22c55e', logistics: '#0891b2' }

export default function POSPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read tab from URL (?tab=payments), default to 'overview'
  const urlTab = searchParams.get('tab') as Tab | null
  const [tab, setTab] = useState<Tab>(urlTab || 'overview')

  // Keep URL in sync when tab changes
  const handleSetTab = useCallback((t: Tab) => {
    setTab(t)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', t)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [searchParams, router])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [prevTransactions, setPrevTransactions] = useState<Transaction[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currencySymbol, setCurrencySymbol] = useState('£')
  const [posEnabled, setPosEnabled] = useState<boolean | null>(null)
  const [seatCount, setSeatCount] = useState(0)
  const [businessType, setBusinessType] = useState('')
  const [sectorOverride, setSectorOverride] = useState<string | null>(null)

  // Locations (multi-branch)
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedSector, setSelectedSector] = useState<string>('all')

  // Reorder suggestions from stock replenishment agent
  const [reorderSuggestions, setReorderSuggestions] = useState<any[]>([])
  const [dismissingId, setDismissingId] = useState<string | null>(null)
  const [reorderRestockId, setReorderRestockId] = useState<string | null>(null)
  const [reorderRestockQty, setReorderRestockQty] = useState('')
  const [reorderRestocking, setReorderRestocking] = useState(false)
  const [archivingStockId, setArchivingStockId] = useState<string | null>(null)

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
  const [lastTxDetail, setLastTxDetail] = useState<TxDetailType>(null)
  const [refundTx, setRefundTx] = useState<Transaction | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [refunding, setRefunding] = useState(false)

  // Staff forms
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState<'cashier' | 'inventory' | 'repair' | 'engineer' | 'supervisor' | 'manager' | 'handler' | 'driver' | 'dispatcher' | 'branch_manager'>('cashier')
  const [newPin, setNewPin] = useState('')
  const [newLocationId, setNewLocationId] = useState('')
  const [addingStaff, setAddingStaff] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editName, setEditName] = useState('')
  const [editPin, setEditPin] = useState('')
  const [editRole, setEditRole] = useState<'cashier' | 'inventory' | 'repair' | 'engineer' | 'supervisor' | 'manager' | 'handler' | 'driver' | 'dispatcher' | 'branch_manager'>('cashier')
  const [editLocationId, setEditLocationId] = useState('')
  const [editSector, setEditSector] = useState('retail')
  const [editingSubmitting, setEditingSubmitting] = useState(false)

  // Inventory
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5', category: '', sku: '', sector: '', expiry_date: '', batch_number: '', supplier: '', brand: '', unit: 'pcs' })
  const [addingProduct, setAddingProduct] = useState(false)
  const [invSearch, setInvSearch] = useState('')
  const [invCategory, setInvCategory] = useState('all')
  const [invSector, setInvSector] = useState('all')
  const [invStockFilter, setInvStockFilter] = useState<'all' | 'low' | 'out' | 'expiring'>('all')
  const [bulkTagging, setBulkTagging] = useState(false)
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null)
  const [editProduct, setEditProduct] = useState({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '', category: '', sector: '', expiry_date: '', batch_number: '', supplier: '', brand: '', unit: 'pcs' })
  const [editingProductSubmitting, setEditingProductSubmitting] = useState(false)
  const [restockId, setRestockId] = useState<string | null>(null)
  const [restockQty, setRestockQty] = useState('')
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [bulkCsv, setBulkCsv] = useState('')
  const [importingBulk, setImportingBulk] = useState(false)
  const csvInputRef = useRef<HTMLInputElement>(null)

  // Map
  const mapDivRef      = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const mapMarkersRef  = useRef<any[]>([])

  // Camera (existing — recognize for sell)
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

  // Dual-photo product scan (add product)
  const [showScanModal, setShowScanModal] = useState(false)
  const [scanFront, setScanFront] = useState<string | null>(null)   // base64
  const [scanBack, setScanBack]   = useState<string | null>(null)   // base64
  const [scanFrontThumb, setScanFrontThumb] = useState<string | null>(null)
  const [scanBackThumb, setScanBackThumb]   = useState<string | null>(null)
  const [scanning, setScanning]   = useState(false)
  const [scanStep, setScanStep]   = useState<'front' | 'back' | null>(null)  // which slot is being captured
  const scanFrontRef = useRef<HTMLInputElement>(null)
  const scanBackRef  = useRef<HTMLInputElement>(null)
  const scanVideoRef  = useRef<HTMLVideoElement>(null)
  const scanCanvasRef = useRef<HTMLCanvasElement>(null)
  const scanStreamRef = useRef<MediaStream | null>(null)
  const [scanCameraOpen, setScanCameraOpen] = useState(false)

  // Pagination
  const [txPage, setTxPage] = useState(0)
  const TX_PER_PAGE = 15

  // P&L view
  const [plView, setPlView] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  // Factory captures
  const [factoryCaptures, setFactoryCaptures] = useState<any[]>([])
  const [factoryLoading, setFactoryLoading] = useState(false)
  const [factoryIntelligence, setFactoryIntelligence] = useState<any>(null)
  const [factoryIntelLoading, setFactoryIntelLoading] = useState(false)

  // Logistics
  const [logParcels, setLogParcels] = useState<any[]>([])
  const [logTrucks, setLogTrucks] = useState<any[]>([])
  const [logRoutes, setLogRoutes] = useState<any[]>([])
  const [logLoading, setLogLoading] = useState(false)
  const [logTab, setLogTab] = useState<'overview' | 'parcels' | 'fleet' | 'routes' | 'revenue' | 'drivers'>('overview')
  const [logSearch, setLogSearch] = useState('')
  const [logStatusFilter, setLogStatusFilter] = useState('')
  const [logSelectedParcel, setLogSelectedParcel] = useState<any>(null)
  const [logParcelPhotos, setLogParcelPhotos] = useState<any[]>([])
  const [logParcelPhotosLoading, setLogParcelPhotosLoading] = useState(false)

  // ── Date range helpers ─────────────────────────────────
  const getDateRange = useCallback((range: DateRange): { start: Date; end: Date; label: string } => {
    const now = new Date()
    const s = new Date()
    switch (range) {
      case 'today': s.setHours(0, 0, 0, 0); return { start: s, end: now, label: `Today · ${now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}` }
      case 'yesterday': s.setDate(s.getDate() - 1); s.setHours(0, 0, 0, 0); const ye = new Date(s); ye.setHours(23, 59, 59, 999); return { start: s, end: ye, label: `Yesterday · ${s.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}` }
      case 'last7': s.setDate(s.getDate() - 7); s.setHours(0, 0, 0, 0); return { start: s, end: now, label: 'Last 7 days' }
      case 'last30': s.setDate(s.getDate() - 30); s.setHours(0, 0, 0, 0); return { start: s, end: now, label: 'Last 30 days' }
      case 'custom': return { start: customStart ? new Date(customStart) : s, end: customEnd ? new Date(customEnd + 'T23:59:59') : now, label: `${customStart || '?'} to ${customEnd || '?'}` }
    }
  }, [customStart, customEnd])

  const getPrevRange = useCallback((range: DateRange): { start: Date; end: Date } => {
    const { start, end } = getDateRange(range)
    const dur = end.getTime() - start.getTime()
    return { start: new Date(start.getTime() - dur), end: new Date(start.getTime() - 1) }
  }, [getDateRange])

  // ── Fetch data ─────────────────────────────────────────
  const fetchTransactions = useCallback(async (from: string, to: string, locId?: string) => {
    const loc = locId || selectedLocation
    const locParam = loc && loc !== 'all' ? `&location_id=${loc}` : ''
    const res = await fetch(`/api/pos/transactions?from=${from}&to=${to}${locParam}`)
    const data = await res.json()
    return data.transactions || []
  }, [selectedLocation])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('currency_symbol, pos_enabled, pos_seat_count, business_type')
        .eq('id', user.id)
        .single()
      if (profile?.currency_symbol) setCurrencySymbol(profile.currency_symbol)
      setPosEnabled(profile?.pos_enabled ?? false)
      setSeatCount((profile as any)?.pos_seat_count ?? 0)
      setBusinessType((profile as any)?.business_type || '')

      const { start, end } = getDateRange(dateRange)
      const prev = getPrevRange(dateRange)

      const [staffRes, txData, prevTxData, invRes, locRes, reorderRes] = await Promise.all([
        fetch('/api/pos/staff'),
        fetchTransactions(start.toISOString(), end.toISOString(), 'all'),
        fetchTransactions(prev.start.toISOString(), prev.end.toISOString(), 'all'),
        fetch('/api/pos/inventory'),
        fetch('/api/pos/locations'),
        fetch('/api/pos/reorder-suggestions').catch(() => null),
      ])
      const staffData = await staffRes.json()
      const invData = await invRes.json()
      const locData = await locRes.json()
      const reorderData = reorderRes ? await reorderRes.json().catch(() => ({ suggestions: [] })) : { suggestions: [] }

      setStaff(staffData.staff || [])
      setTransactions(txData)
      setPrevTransactions(prevTxData)
      setInventory(invData.inventory || [])
      setLocations(locData.locations || [])
      setReorderSuggestions(reorderData.suggestions || [])
      setLoading(false)
    }
    init()
  }, [])

  // Re-fetch when date range or location changes
  useEffect(() => {
    if (loading) return
    const refetch = async () => {
      const { start, end } = getDateRange(dateRange)
      const prev = getPrevRange(dateRange)
      const locParam = selectedLocation !== 'all' ? `&location_id=${selectedLocation}` : ''
      const [txData, prevTxData, invRes] = await Promise.all([
        fetchTransactions(start.toISOString(), end.toISOString()),
        fetchTransactions(prev.start.toISOString(), prev.end.toISOString()),
        fetch(`/api/pos/inventory?${locParam ? `location_id=${selectedLocation}` : ''}`),
      ])
      const invData = await invRes.json()
      setTransactions(txData)
      setPrevTransactions(prevTxData)
      setInventory(invData.inventory || [])
      setTxPage(0)
    }
    refetch()
  }, [dateRange, customStart, customEnd, selectedLocation])

  // ── Realtime subscription ──────────────────────────────
  useEffect(() => {
    const channel = supabase.channel('pos-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pos_transactions' }, (payload) => {
        const newTx = payload.new as any
        if (newTx) {
          setTransactions(prev => [{ ...newTx, cashier: newTx.pos_staff ?? null, pos_items: [] }, ...prev])
          notify(`New sale: ${fmt(currencySymbol, newTx.total || 0)}`)
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory' }, (payload) => {
        const updated = payload.new as any
        if (updated) setInventory(prev => prev.map(i => i.id === updated.id ? { ...i, ...updated } : i))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [currencySymbol])

  // ── Derived stats ──────────────────────────────────────
  const dateRangeDetails = getDateRange(dateRange)

  // Build cashier→sector lookup — use assigned sector, fall back to role-derived sector
  const cashierSectorMap = useMemo(() => {
    const m: Record<string, string> = {}
    for (const s of staff) {
      const roleFallback = ['repair','engineer'].includes(s.role) ? 'repair'
        : ['handler','driver','dispatcher','branch_manager'].includes(s.role) ? 'logistics'
        : s.role === 'inventory' ? 'retail' : 'retail'
      m[s.id] = s.sector || roleFallback
    }
    return m
  }, [staff])

  // Sync selectedSector → sectorOverride so Operations tab auto-switches
  useEffect(() => {
    if (selectedSector !== 'all') setSectorOverride(selectedSector)
    // Sector-specific tabs only exist while their sector is selected. If the
    // active tab is a sector tab that no longer matches, fall back to Overview
    // so we never render a sector view with its tab button hidden.
    const sectorTabs: Tab[] = ['restaurant', 'repair', 'salon', 'retail', 'factory']
    setTab(prev => (sectorTabs.includes(prev) && prev !== selectedSector ? 'overview' : prev))
    setTxPage(0)
  }, [selectedSector])

  // Sector-filtered staff list
  const filteredStaff = useMemo(() =>
    selectedSector === 'all' ? staff : staff.filter(s => (s.sector || 'retail') === selectedSector),
    [staff, selectedSector])

  const txMatchesSector = (t: Transaction) => {
    if (selectedSector === 'all') return true
    const cid = t.cashier?.id
    return cid ? cashierSectorMap[cid] === selectedSector : selectedSector === 'retail'
  }

  const completedTx = useMemo(() =>
    transactions.filter(t => t.status === 'completed' && txMatchesSector(t)),
    [transactions, selectedSector, cashierSectorMap])
  const prevCompletedTx = useMemo(() =>
    prevTransactions.filter(t => t.status === 'completed' && (selectedSector === 'all' || (t.cashier?.id ? cashierSectorMap[t.cashier.id] === selectedSector : selectedSector === 'retail'))),
    [prevTransactions, selectedSector, cashierSectorMap])

  const todayRevenue = completedTx.reduce((s, t) => s + t.total, 0)
  const prevRevenue = prevCompletedTx.reduce((s, t) => s + t.total, 0)
  const todaySales = completedTx.length
  const prevSales = prevCompletedTx.length
  const refundedTx = useMemo(() =>
    transactions.filter(t => (t.status === 'refunded' || t.status === 'partially_refunded') && txMatchesSector(t)),
    [transactions, selectedSector, cashierSectorMap])
  const refundCount = refundedTx.length
  // All transactions for the selected sector (any status) — fed to the dedicated
  // sector analytics tabs so each one only sees its own sector's data.
  const sectorTransactions = useMemo(() =>
    transactions.filter(txMatchesSector),
    [transactions, selectedSector, cashierSectorMap])
  const prevRefunds = prevTransactions.filter(t => (t.status === 'refunded' || t.status === 'partially_refunded') && (selectedSector === 'all' || (t.cashier?.id ? cashierSectorMap[t.cashier.id] === selectedSector : selectedSector === 'retail'))).length
  // Each sector is fully isolated — only items explicitly tagged to the sector are visible.
  // 'all' shows everything so the owner gets a full cross-sector stock view.
  const sectorFilteredInventory = selectedSector === 'all' ? inventory : inventory.filter(i => i.sector === selectedSector)
  const lowStock = sectorFilteredInventory.filter(i => i.stock_qty <= i.low_stock_threshold && i.stock_qty > 0)
  const outOfStock = sectorFilteredInventory.filter(i => i.stock_qty === 0)
  const alertCount = lowStock.length + outOfStock.length

  // Profit calc
  const totalCost = completedTx.reduce((s, t) => s + (t.pos_items || []).reduce((is, i) => is + (i.cost_price || 0) * i.qty, 0), 0)
  const grossProfit = todayRevenue - totalCost
  const margin = todayRevenue > 0 ? (grossProfit / todayRevenue * 100) : 0

  // Geo-tagged sales for map tab — filtered by sector
  const geoPoints = useMemo(() => {
    const pts: any[] = []
    for (const t of transactions) {
      if (!t.notes) continue
      if (!txMatchesSector(t)) continue
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
  }, [transactions, selectedSector, cashierSectorMap])

  // Comparison helper
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

  // Filtered inventory — base off sectorFilteredInventory so sector isolation is enforced
  const filteredInventory = useMemo(() => {
    const todayMs = new Date().setHours(0,0,0,0)
    let items = sectorFilteredInventory
    if (invSearch) items = items.filter(i => i.name.toLowerCase().includes(invSearch.toLowerCase()) || (i.sku && i.sku.toLowerCase().includes(invSearch.toLowerCase())))
    if (invCategory !== 'all') items = items.filter(i => (i.category || 'Uncategorised') === invCategory)
    if (invSector !== 'all') items = items.filter(i => i.sector === invSector)
    if (invStockFilter === 'low') items = items.filter(i => i.stock_qty > 0 && i.stock_qty <= i.low_stock_threshold)
    if (invStockFilter === 'out') items = items.filter(i => i.stock_qty === 0)
    if (invStockFilter === 'expiring') items = items.filter(i => {
      if (!i.expiry_date) return false
      const days = Math.floor((new Date(i.expiry_date).getTime() - todayMs) / 86400000)
      return days <= 30
    })
    return items
  }, [sectorFilteredInventory, invSearch, invCategory, invSector, invStockFilter])

  // P&L data
  const plData = useMemo(() => {
    const buckets: Record<string, { revenue: number; cost: number; count: number }> = {}
    completedTx.forEach(t => {
      const d = new Date(t.created_at)
      let key: string
      if (plView === 'daily') key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      else if (plView === 'weekly') { const w = new Date(d); w.setDate(w.getDate() - w.getDay()); key = `W/c ${w.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` }
      else { key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }) }
      if (!buckets[key]) buckets[key] = { revenue: 0, cost: 0, count: 0 }
      buckets[key].revenue += t.total
      buckets[key].cost += (t.pos_items || []).reduce((s, i) => s + (i.cost_price || 0) * i.qty, 0)
      buckets[key].count++
    })
    return Object.entries(buckets).map(([period, d]) => ({ period, ...d, profit: d.revenue - d.cost }))
  }, [completedTx, plView])

  // ── Handlers ───────────────────────────────────────────
  const handleRefund = async (full: boolean) => {
    if (!refundTx || !refundReason) return
    setRefunding(true)
    try {
      await fetch('/api/pos/refund', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transaction_id: refundTx.id, full_refund: full, reason: refundReason }) })
      setTransactions(prev => prev.map(t => t.id === refundTx.id ? { ...t, status: full ? 'refunded' : 'partially_refunded' } : t))
      notify(`Refund processed for ${fmt(currencySymbol, refundTx.total)}`)
    } catch { notify('Refund failed', false) }
    setRefundTx(null); setRefundReason(''); setRefunding(false)
  }

  const handleExport = () => {
    const { start, end } = getDateRange(dateRange)
    window.open(`/api/pos/export?from=${start.toISOString()}&to=${end.toISOString()}`, '_blank')
  }
  const handleExportVAT = () => window.open('/api/pos/vat', '_blank')

  const handleAddStaff = async () => {
    if ((!newPhone && !newEmail) || !newName) return
    if (newPin && (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin))) { notify('PIN must be 4-6 digits', false); return }
    setAddingStaff(true)
    try {
      // Check if using a staff template (ID contains dash)
      if (newRole.includes('-')) {
        // Extract business type from template ID (e.g., "factory-line-operator" → "factory")
        const businessType = newRole.split('-')[0] as any
        const res = await fetch('/api/pos/staff-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newName,
            email: newEmail || undefined,
            phone: newPhone || undefined,
            pin: newPin || undefined,
            templateId: newRole,
            businessType: businessType,
            location_id: newLocationId || undefined,
            sector: selectedSector !== 'all' ? selectedSector : undefined,
          })
        })
        const data = await res.json()
        if (data.staff) {
          setStaff(prev => [...prev, data.staff])
          setNewPhone('')
          setNewEmail('')
          setNewName('')
          setNewRole('factory-line-operator')
          setNewPin('')
          setNewLocationId('')
          setShowAddStaff(false)
          notify(`${data.staff.name} added with ${data.staff.template?.name} permissions`)
        } else {
          notify(data.error || 'Failed to add staff', false)
        }
      }
    } catch { notify('Failed to add staff', false) }
    setAddingStaff(false)
  }

  const handleToggleStaff = async (member: StaffMember) => {
    try {
      const res = await fetch('/api/pos/staff', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: member.id, active: !member.active }) })
      const data = await res.json()
      if (data.staff) { setStaff(prev => prev.map(s => s.id === member.id ? data.staff : s)); notify(`${member.name} ${member.active ? 'deactivated' : 'reactivated'}`) }
      else if (data.seat_limit) notify(data.error, false)
    } catch { notify('Failed to update staff', false) }
  }

  const handleEditStaff = async () => {
    if (!editingStaff || (!editPhone && !editEmail) || !editName) return
    if (editPin && (editPin.length < 4 || editPin.length > 6 || !/^\d+$/.test(editPin))) { notify('PIN must be 4-6 digits', false); return }
    setEditingSubmitting(true)
    try {
      const res = await fetch('/api/pos/staff', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingStaff.id, phone: editPhone || undefined, email: editEmail || undefined, name: editName, role: editRole, pin: editPin || undefined, location_id: editLocationId || undefined, sector: editSector }) })
      const data = await res.json()
      if (data.staff) { setStaff(prev => prev.map(s => s.id === editingStaff.id ? data.staff : s)); setEditingStaff(null); notify('Staff updated') }
      else if (data.error) notify(data.error, false)
    } catch { notify('Failed to update staff', false) }
    setEditingSubmitting(false)
  }

  const handleOpenEditStaff = (member: StaffMember) => {
    setEditingStaff(member); setEditName(member.name); setEditPhone(member.phone || ''); setEditEmail(member.email || ''); setEditPin(''); setEditRole(member.role || 'cashier'); setEditLocationId(member.location_id || ''); setEditSector(member.sector || 'retail')
  }

  // Camera handlers
  useEffect(() => {
    if (showCameraPreview && videoRef.current && streamRef.current) { videoRef.current.srcObject = streamRef.current; videoRef.current.play().catch(() => {}) }
  }, [showCameraPreview])

  useEffect(() => {
    if (scanCameraOpen && scanVideoRef.current && scanStreamRef.current) { scanVideoRef.current.srcObject = scanStreamRef.current; scanVideoRef.current.play().catch(() => {}) }
  }, [scanCameraOpen])

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream; setShowCameraPreview(true); setShowCameraMenu(false)
    } catch (err: any) { notify('Camera access denied: ' + err.message, false) }
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
      console.log('🔍 Recognition response:', data)
      if (data.products?.length > 0) {
        console.log('✅ Opening modal for product:', data.products[0].name)
        setRecognizedProducts(data.products)
        // Automatically open edit modal for first product
        const firstProduct = data.products[0]
        setEditingRecognizedIndex(0)
        setEditingRecognizedData({
          ...firstProduct,
          sale_price: firstProduct.sale_price || '',
          cost_price: firstProduct.cost_price || '',
          stock_qty: (firstProduct.quantity || 1).toString()
        })
      }
      else notify('Could not recognise products from image', false)
    } catch (err) {
      console.error('❌ Error:', err)
      notify('Image recognition failed', false)
    }
    setRecognizing(false)
  }

  // ── Dual-photo scan helpers ──────────────────────────────────
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve((r.result as string).split(',')[1])
      r.onerror = reject
      r.readAsDataURL(file)
    })

  const fileToThumb = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.onerror = reject
      r.readAsDataURL(file)
    })

  const handleScanFileSelected = async (file: File, slot: 'front' | 'back') => {
    const [b64, thumb] = await Promise.all([fileToBase64(file), fileToThumb(file)])
    if (slot === 'front') { setScanFront(b64); setScanFrontThumb(thumb) }
    else                  { setScanBack(b64);  setScanBackThumb(thumb)  }
  }

  const openScanCamera = async (slot: 'front' | 'back') => {
    setScanStep(slot)
    setScanCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      scanStreamRef.current = stream
      if (scanVideoRef.current) scanVideoRef.current.srcObject = stream
    } catch { notify('Camera access denied', false); setScanCameraOpen(false) }
  }

  const closeScanCamera = () => {
    if (scanStreamRef.current) { scanStreamRef.current.getTracks().forEach(t => t.stop()); scanStreamRef.current = null }
    setScanCameraOpen(false)
  }

  const captureScanPhoto = () => {
    if (!scanVideoRef.current || !scanCanvasRef.current || !scanStep) return
    const ctx = scanCanvasRef.current.getContext('2d')!
    scanCanvasRef.current.width  = scanVideoRef.current.videoWidth
    scanCanvasRef.current.height = scanVideoRef.current.videoHeight
    ctx.drawImage(scanVideoRef.current, 0, 0)
    scanCanvasRef.current.toBlob(async blob => {
      if (!blob) return
      const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' })
      await handleScanFileSelected(file, scanStep)
      closeScanCamera()
    }, 'image/jpeg', 0.9)
  }

  const runFullScan = async () => {
    if (!scanFront) return
    setScanning(true)
    try {
      const body: any = { front: scanFront }
      if (scanBack) body.back = scanBack
      const res = await fetch('/api/pos/scan-product-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!data.product) { notify(data.error || 'Could not read product', false); setScanning(false); return }

      const p = data.product
      // Auto-fill the add-product form and open it
      setNewProduct({
        name:                p.name        || '',
        sale_price:          p.sale_price != null ? String(p.sale_price) : '',
        cost_price:          '',
        stock_qty:           '',
        low_stock_threshold: '5',
        category:            p.category    || '',
        sku:                 p.sku         || '',
        sector:              '',
        expiry_date:         p.expiry_date || '',
        batch_number:        p.batch_number || '',
        supplier:            p.supplier    || '',
        brand:               p.brand       || '',
        unit:                p.unit        || 'pcs',
      })
      setShowAddProduct(true)
      setShowScanModal(false)
      // Reset scan state
      setScanFront(null); setScanBack(null)
      setScanFrontThumb(null); setScanBackThumb(null)
      notify(`Scanned: ${p.name || 'product'} — review and save`)
    } catch { notify('Scan failed', false) }
    setScanning(false)
  }
  // ────────────────────────────────────────────────────────────

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sale_price) return
    setAddingProduct(true)
    try {
      const res = await fetch('/api/pos/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newProduct.name, sale_price: parseFloat(newProduct.sale_price), cost_price: parseFloat(newProduct.cost_price || '0'), stock_qty: parseInt(newProduct.stock_qty || '0'), low_stock_threshold: parseInt(newProduct.low_stock_threshold || '5'), category: newProduct.category, sku: newProduct.sku, sector: newProduct.sector || (selectedSector !== 'all' ? selectedSector : null), expiry_date: newProduct.expiry_date || null, batch_number: newProduct.batch_number || null, supplier: newProduct.supplier || null, brand: newProduct.brand || null, unit: newProduct.unit || 'pcs' }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => [...prev, data.product]); setNewProduct({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5', category: '', sku: '', sector: '', expiry_date: '', batch_number: '', supplier: '', brand: '', unit: 'pcs' }); setShowAddProduct(false); notify(`${data.product.name} added`) }
    } catch { notify('Failed to add product', false) }
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
      updates.sector = editProduct.sector || null
      updates.expiry_date = editProduct.expiry_date || null
      updates.batch_number = editProduct.batch_number || null
      updates.supplier = editProduct.supplier || null
      updates.brand = editProduct.brand || null
      updates.category = editProduct.category || null
      updates.unit = editProduct.unit || 'pcs'
      const res = await fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingProduct.id, ...updates }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => prev.map(i => i.id === editingProduct.id ? data.product : i)); setEditingProduct(null); notify('Product updated') }
      else notify(data.error || 'Update failed', false)
    } catch { notify('Failed to update product', false) }
    setEditingProductSubmitting(false)
  }

  const handleDeleteProduct = async (item: InventoryItem) => {
    if (!confirm(`Remove "${item.name}" from inventory?`)) return
    try {
      const res = await fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, active: false }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => prev.filter(i => i.id !== item.id)); notify(`${item.name} removed`) }
    } catch { notify('Failed to remove product', false) }
  }

  const handleRestock = async (id: string) => {
    const qty = parseInt(restockQty)
    if (!qty || qty <= 0) { notify('Enter a valid quantity', false); return }
    try {
      const res = await fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, restock_qty: qty }) })
      const data = await res.json()
      if (data.product) { setInventory(prev => prev.map(i => i.id === id ? data.product : i)); setRestockId(null); setRestockQty(''); notify(`Restocked +${qty} units`) }
      else notify(data.error || 'Restock failed', false)
    } catch { notify('Restock failed', false) }
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
      const itemsWithSector = selectedSector !== 'all'
        ? items.map((item: any) => ({ ...item, sector: item.sector || selectedSector }))
        : items
      const res = await fetch('/api/pos/inventory', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: itemsWithSector }) })
      const data = await res.json()
      if (data.products) { setInventory(prev => [...prev, ...data.products]); setShowBulkImport(false); setBulkCsv(''); notify(`${data.products.length} products imported`) }
      else notify(data.error || 'Import failed', false)
    } catch { notify('Import failed', false) }
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
  const sectionLabel: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 12 }
  const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100 }
  const modalBox: React.CSSProperties = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: 'var(--sf)', borderRadius: 14, padding: 28, width: '90%', maxWidth: 520, boxShadow: '0 8px 32px rgba(0,0,0,.14)', maxHeight: '85vh', overflowY: 'auto' }

  // ── Comparison badge ───────────────────────────────────
  const CompBadge = ({ curr, prev, inverse }: { curr: number; prev: number; inverse?: boolean }) => {
    const pct = pctChange(curr, prev)
    if (pct === 0 && prev === 0 && curr === 0) return null
    const up = pct >= 0
    const good = inverse ? !up : up
    return (
      <span style={{ fontSize: 11, fontWeight: 600, color: good ? GREEN : RED, display: 'inline-flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transform: up ? 'none' : 'rotate(180deg)' }}><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        {Math.abs(pct).toFixed(0)}% vs prev
      </span>
    )
  }

  // ── Leaflet map lifecycle ──────────────────────────────
  useEffect(() => {
    if (tab !== 'map' || loading) {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      return
    }
    if (!mapDivRef.current || mapRef.current) return
    let cancelled = false
    const init = async () => {
      const mod = await import('leaflet')
      const L = mod.default || mod
      if (cancelled || !mapDivRef.current || mapRef.current) return
      const map = L.map(mapDivRef.current, { center: [20, 0], zoom: 2 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map)
      mapRef.current = map
      mapMarkersRef.current = []
      ;(window as any).L = L
    }
    init()
    return () => { cancelled = true }
  }, [tab, loading])

  // ── Render map markers whenever geo points change ──────
  useEffect(() => {
    // If Leaflet hasn't loaded yet (async), retry once after the init delay
    if (tab === 'map' && !mapRef.current) {
      const retry = setTimeout(() => {
        const L = (window as any).L; const map = mapRef.current
        if (!L || !map) return
        renderMarkers(L, map)
      }, 200)
      return () => clearTimeout(retry)
    }
    const L   = (window as any).L
    const map = mapRef.current
    if (!L || !map) return
    renderMarkers(L, map)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoPoints, tab])

  // Load factory captures when switching to captures or approvals tab
  useEffect(() => {
    if (tab !== 'captures' && tab !== 'approvals') return
    setFactoryLoading(true)
    fetch('/api/pos/factory/capture')
      .then(r => r.json())
      .then(d => { setFactoryCaptures(d.captures || []); setFactoryLoading(false) })
      .catch(() => setFactoryLoading(false))
  }, [tab])

  // Load logistics data when switching to logistics tab
  useEffect(() => {
    if (tab !== 'logistics') return
    setLogLoading(true)
    Promise.all([
      fetch('/api/pos/parcels?limit=200').then(r => r.json()),
      fetch('/api/pos/trucks').then(r => r.json()),
      fetch('/api/pos/routes').then(r => r.json()),
    ]).then(([pData, tData, rData]) => {
      setLogParcels(pData.parcels || [])
      setLogTrucks(tData.trucks || [])
      setLogRoutes(rData.routes || [])
    }).catch(() => {})
      .finally(() => setLogLoading(false))
  }, [tab])

  const renderMarkers = (L: any, map: any) => {
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
  }

  // ── LOADING STATE ──────────────────────────────────────
  if (loading || posEnabled === null) return (
    <div className="page-shell">
      <div className="page-shell-body">
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>{[1,2,3,4].map(i => <div key={i} style={{ flex: 1 }}><SkeletonCard /></div>)}</div>
        <Skeleton w="100%" h={200} r={12} />
      </div>
    </div>
  )

  // ── POS NOT ENABLED ────────────────────────────────────
  if (!posEnabled) return (
    <div className="page-shell">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 14, background: ACC_BG, border: `1px solid ${ACC_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Point of Sale</div>
          <p style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.7, marginBottom: 28 }}>
            Turn any phone into a till. Add cashier and inventory staff seats to unlock the POS system — camera price scanning, WhatsApp receipts, live stock tracking, and BI insights all in one place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginBottom: 28 }}>
            {['Cashier & inventory roles with WhatsApp OTP login', 'Camera price scanning powered by Claude AI', 'Auto stock deduction + restock alerts', 'WhatsApp receipts to customers', 'MTD-compatible VAT export', 'Sales feed directly into your BI dashboard'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--tx2)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                {f}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-sora)', fontSize: 28, fontWeight: 800 }}>£5</span>
            <span style={{ fontSize: 14, color: 'var(--tx3)', marginLeft: 4 }}>/seat/month</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 20 }}>Owner dashboard always included — seats are for cashier and inventory staff only</p>
          <a href="/billing" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 12, background: ACC, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(208,138,89,.3)' }}>
            Add seats in billing →
          </a>
        </div>
      </div>
    </div>
  )

  // ── MAIN POS DASHBOARD ─────────────────────────────────
  return (
    <div className="page-shell">
      {toast && <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />}

      <div className="page-shell-body">
        {/* Tabs + action icons in one flush row */}
        <div className="tab-strip" style={{ gap: 0, marginBottom: 24, borderBottom: '1px solid var(--b)', paddingBottom: 0, alignItems: 'stretch' }}>
          {(['overview', 'services', 'staff', 'branches', 'map', 'audit', 'payments'] as Tab[]).filter(Boolean).map(t => (
            <button key={t} onClick={() => handleSetTab(t)} style={{
              padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none', whiteSpace: 'nowrap',
              background: tab === t ? 'var(--sf)' : 'transparent', color: tab === t ? 'var(--tx)' : 'var(--tx3)',
              fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: tab === t ? `2px solid ${ACC}` : '2px solid transparent',
              flexShrink: 0,
            }}>
              {t === 'map' ? '🗺️ Map' : t === 'services' ? (() => {
                const bt = (businessType || '').toLowerCase()
                const d = ['restaurant','cafe','café','bar','pub','takeaway','food','catering','food stall','bistro','diner'].some(k => bt.includes(k)) ? 'restaurant'
                  : ['repair','phone','mobile','electronic','watch','laptop','computer'].some(k => bt.includes(k)) ? 'repair'
                  : ['salon','barber','barbershop','spa','beauty','clinic','nail'].some(k => bt.includes(k)) ? 'salon' : 'retail'
                const s = sectorOverride || d
                return s === 'restaurant' ? '🍴 Restaurant' : s === 'repair' ? '🔧 Repairs' : s === 'salon' ? '💇 Bookings' : '📦 Operations'
              })() : t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'inventory' && alertCount > 0 && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#fff', background: RED, borderRadius: 9999, padding: '1px 6px', verticalAlign: 'top' }}>{alertCount}</span>}
            </button>
          ))}
          {(selectedSector === 'all' || selectedSector === 'logistics') && (
            <button onClick={() => handleSetTab('logistics')} style={{
              padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none', whiteSpace: 'nowrap',
              background: tab === 'logistics' ? 'var(--sf)' : 'transparent', color: tab === 'logistics' ? '#0891b2' : 'var(--tx3)',
              fontSize: 13, fontWeight: tab === 'logistics' ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: tab === 'logistics' ? '2px solid #0891b2' : '2px solid transparent',
              flexShrink: 0,
            }}>🚛 Logistics</button>
          )}
          {([
            { id: 'restaurant' as Tab, label: '🍴 Restaurant', color: '#d08a59' },
            { id: 'repair' as Tab,     label: '🔧 Repair',     color: '#6366f1' },
            { id: 'salon' as Tab,      label: '💇 Salon',      color: '#ec4899' },
            { id: 'retail' as Tab,     label: '📦 Retail',     color: '#22c55e' },
            { id: 'factory' as Tab,    label: '🏭 Factory',    color: '#f59e0b' },
          ]).filter(s => selectedSector === s.id).map(s => (
            <button key={s.id} onClick={() => handleSetTab(s.id)} style={{
              padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none', whiteSpace: 'nowrap',
              background: tab === s.id ? 'var(--sf)' : 'transparent', color: tab === s.id ? s.color : 'var(--tx3)',
              fontSize: 13, fontWeight: tab === s.id ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: tab === s.id ? `2px solid ${s.color}` : '2px solid transparent',
              flexShrink: 0,
            }}>{s.label}</button>
          ))}
          {/* Push action icons to the far right of the tab strip */}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 2, alignItems: 'center', paddingBottom: 2 }}>
            <button onClick={handleExportVAT} title="MTD VAT export" style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--tx3)', opacity: 0.4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </button>
            <button onClick={handleExport} title="Export CSV" style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--tx3)', opacity: 0.4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" title="Open till" style={{ width: 28, height: 28, borderRadius: 7, background: 'transparent', color: 'var(--tx3)', opacity: 0.4, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </a>
          </div>
        </div>

        {/* ── Branch + Sector filters ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--tx3)', fontWeight: 500 }}>Branch:</span>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', color: 'var(--tx)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="all">All Branches</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--tx3)', fontWeight: 500 }}>Sector:</span>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', color: 'var(--tx)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="all">All Sectors</option>
              <option value="restaurant">🍴 Restaurant</option>
              <option value="repair">🔧 Repair</option>
              <option value="salon">💇 Salon</option>
              <option value="retail">📦 Retail</option>
              <option value="factory">🏭 Factory</option>
              <option value="logistics">🚛 Logistics</option>
            </select>
          </div>
        </div>

        {/* ── Date Range Selector ── */}
        {(tab === 'overview' || tab === 'map') && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {(['today', 'yesterday', 'last7', 'last30'] as DateRange[]).map(range => (
              <button key={range} onClick={() => { setDateRange(range); setCustomStart(''); setCustomEnd('') }}
                style={{ padding: '6px 12px', borderRadius: 8, border: dateRange === range ? `1.5px solid ${ACC}` : '1px solid var(--b)', background: dateRange === range ? ACC_BG : 'var(--sf)', color: dateRange === range ? ACC : 'var(--tx2)', fontSize: 12, fontWeight: dateRange === range ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
                {range === 'today' ? 'Today' : range === 'yesterday' ? 'Yesterday' : range === 'last7' ? 'Last 7 days' : 'Last 30 days'}
              </button>
            ))}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="date" value={customStart} onChange={e => { setCustomStart(e.target.value); setDateRange('custom') }} style={{ ...inputStyle, padding: '6px 10px', fontSize: 12 }} />
              <span style={{ fontSize: 12, color: 'var(--tx3)' }}>to</span>
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
                { label: 'Revenue', value: `${fmt(currencySymbol, todayRevenue)}`, color: GREEN, prev: prevRevenue, curr: todayRevenue, type: 'sales' as const, inverse: false },
                { label: 'Sales', value: todaySales.toString(), color: ACC, prev: prevSales, curr: todaySales, type: 'sales' as const, inverse: false },
                { label: 'Refunds', value: refundCount.toString(), color: refundCount > 0 ? RED : 'var(--tx)', prev: prevRefunds, curr: refundCount, type: 'refunds' as const, inverse: true },
                { label: 'Low stock', value: alertCount.toString(), color: alertCount > 0 ? RED : GREEN, prev: 0, curr: alertCount, type: 'low_stock' as const, inverse: true },
              ].map((kpi, i) => (
                <div key={i} onClick={() => setFilterModal({ type: kpi.type, title: kpi.label })}
                  style={{ ...cardStyle, cursor: 'pointer', transition: 'all 200ms' }}
                  onMouseEnter={e => { (e.currentTarget.style as any).borderColor = ACC; e.currentTarget.style.transform = 'scale(1.02)' }}
                  onMouseLeave={e => { (e.currentTarget.style as any).borderColor = 'var(--b)'; e.currentTarget.style.transform = 'scale(1)' }}>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{kpi.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color, letterSpacing: '-.02em' }}>{kpi.value}</div>
                  {kpi.type !== 'low_stock' && <CompBadge curr={kpi.curr} prev={kpi.prev} inverse={kpi.inverse} />}
                </div>
              ))}
            </div>

            {/* Profit / margin row — clickable */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              <div onClick={() => setFilterModal({ type: 'gross_profit', title: 'Gross Profit Analysis' })}
                style={{ ...cardStyle, cursor: 'pointer', transition: 'all 200ms' }}
                onMouseEnter={e => { (e.currentTarget.style as any).borderColor = ACC; e.currentTarget.style.transform = 'scale(1.02)' }}
                onMouseLeave={e => { (e.currentTarget.style as any).borderColor = 'var(--b)'; e.currentTarget.style.transform = 'scale(1)' }}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Gross profit</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: grossProfit >= 0 ? GREEN : RED }}>{fmt(currencySymbol, grossProfit)}</div>
              </div>
              <div onClick={() => setFilterModal({ type: 'margin', title: 'Margin Breakdown' })}
                style={{ ...cardStyle, cursor: 'pointer', transition: 'all 200ms' }}
                onMouseEnter={e => { (e.currentTarget.style as any).borderColor = ACC; e.currentTarget.style.transform = 'scale(1.02)' }}
                onMouseLeave={e => { (e.currentTarget.style as any).borderColor = 'var(--b)'; e.currentTarget.style.transform = 'scale(1)' }}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Margin</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: margin >= 20 ? GREEN : margin >= 10 ? AMBER : RED }}>{margin.toFixed(1)}%</div>
              </div>
              <div onClick={() => setFilterModal({ type: 'avg_sale', title: 'Average Sale Analysis' })}
                style={{ ...cardStyle, cursor: 'pointer', transition: 'all 200ms' }}
                onMouseEnter={e => { (e.currentTarget.style as any).borderColor = ACC; e.currentTarget.style.transform = 'scale(1.02)' }}
                onMouseLeave={e => { (e.currentTarget.style as any).borderColor = 'var(--b)'; e.currentTarget.style.transform = 'scale(1)' }}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Avg sale</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, todaySales > 0 ? todayRevenue / todaySales : 0)}</div>
              </div>
            </div>

            {/* Ask AskBiz about POS data */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {[
                { label: '📊 Analyse today', query: `My POS today: ${fmt(currencySymbol, todayRevenue)} revenue, ${todaySales} sales, ${margin.toFixed(1)}% margin, ${refundCount} refunds. Analyse this — is it a good day? What should I focus on?` },
                { label: '⭐ Top products', query: 'What are my top 10 selling POS products this week by revenue and quantity?' },
                { label: '👥 Staff ranking', query: 'Rank my POS staff by sales performance — revenue per cashier, transaction count, and average sale value.' },
                { label: '📦 Stock alerts', query: 'Which products are running low on stock or have expiry warnings? Show items I need to reorder.' },
              ].map(btn => (
                <button key={btn.label} onClick={() => { router.push('/ask'); setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: btn.query })), 400) }}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx2)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACC; e.currentTarget.style.color = ACC; e.currentTarget.style.background = ACC_BG }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--tx2)'; e.currentTarget.style.background = 'var(--sf)' }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Repair metrics */}
            <RepairMetrics currencySymbol={currencySymbol} selectedLocation={selectedLocation} />

            {/* Sales chart (hourly) */}
            {completedTx.length > 0 && (
              <div style={{ ...cardStyle, marginBottom: 24 }}>
                <div style={sectionLabel}>Sales by hour</div>
                <MiniBarChart data={hourlyData} color={ACC} height={100} />
              </div>
            )}

            {/* Payment & product breakdown side-by-side — retail only */}
            {completedTx.length > 0 && selectedSector === 'retail' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 24 }}>
                {/* Payment breakdown */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>By payment method</div>
                  {paymentBreakdown.map(p => (
                    <div key={p.method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)', textTransform: 'capitalize' }}>{p.method}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{p.count} sale{p.count !== 1 ? 's' : ''}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, p.total)}</div>
                    </div>
                  ))}
                </div>

                {/* Top products */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>Top products</div>
                  {topProducts.slice(0, 5).map((p, i) => (
                    <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{i + 1}. {p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{p.qty} sold</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, p.revenue)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff performance */}
            {cashierStats.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div onClick={() => setFilterModal({ type: 'staff_overview', title: 'Staff Performance Overview' })} style={{ ...sectionLabel, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Staff performance <span style={{ fontSize: 10, color: ACC, fontWeight: 600 }}>View all →</span></div>
                {/* Mini bar chart for staff */}
                <div style={{ ...cardStyle, marginBottom: 12 }}>
                  <MiniBarChart data={cashierStats.map(c => ({ label: c.name.split(' ')[0], value: c.revenue }))} color={ACC} height={70} />
                </div>
                <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  {cashierStats.map((c, i) => (
                    <div key={c.id} onClick={() => setFilterModal({ type: 'cashier_detail', title: `${c.name}'s transactions`, cashier_id: c.name })}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < cashierStats.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', cursor: 'pointer', transition: 'background 200ms' }}
                      onMouseEnter={e => { (e.currentTarget.style as any).background = 'rgba(208,138,89,.04)' }} onMouseLeave={e => { (e.currentTarget.style as any).background = 'var(--sf)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: ACC_BG, border: `1px solid ${ACC_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: ACC }}>{c.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{c.sales} sales · avg {fmt(currencySymbol, c.avgSale)}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, c.revenue)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock alerts — clickable items */}
            {(lowStock.length > 0 || outOfStock.length > 0) && (
              <div style={{ marginBottom: 24 }}>
                <div style={sectionLabel}>Stock alerts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {outOfStock.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', cursor: 'pointer', transition: 'all 150ms', opacity: archivingStockId === item.id ? 0.4 : 1 }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,.2)' }}>
                      <span onClick={() => setFilterModal({ type: 'stock_item', title: item.name, item_id: item.id })} style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)', flex: 1 }}>{item.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>OUT OF STOCK</span>
                        <button
                          title="Archive — hide this item from inventory"
                          disabled={archivingStockId === item.id}
                          onClick={async (e) => {
                            e.stopPropagation()
                            setArchivingStockId(item.id)
                            try {
                              const res = await fetch('/api/pos/inventory', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: item.id, active: false }),
                              })
                              if (res.ok) {
                                setInventory(prev => prev.filter(i => i.id !== item.id))
                                setToast({ msg: `${item.name} archived`, ok: true })
                              } else {
                                setToast({ msg: 'Failed to archive item', ok: false })
                              }
                            } catch { setToast({ msg: 'Failed to archive item', ok: false }) }
                            setArchivingStockId(null)
                          }}
                          style={{ fontSize: 11, color: 'var(--tx3)', background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 6, cursor: 'pointer', padding: '3px 8px', fontFamily: 'inherit', fontWeight: 500, transition: 'all 150ms' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.15)'; e.currentTarget.style.color = RED }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,.08)'; e.currentTarget.style.color = 'var(--tx3)' }}
                        >Archive</button>
                      </div>
                    </div>
                  ))}
                  {lowStock.map(item => (
                    <div key={item.id} onClick={() => setFilterModal({ type: 'stock_item', title: item.name, item_id: item.id })}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(234,179,8,.06)', border: '1px solid rgba(234,179,8,.25)', cursor: 'pointer', transition: 'all 150ms' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.borderColor = 'rgba(234,179,8,.5)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(234,179,8,.25)' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{item.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{item.stock_qty} left</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Smart reorder suggestions from AI agent */}
            {reorderSuggestions.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={sectionLabel}>
                  <span>🤖 Reorder suggestions</span>
                  <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--tx3)', marginLeft: 8 }}>AI-powered</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {reorderSuggestions.slice(0, 10).map((s: any) => {
                    const urgColors = { critical: { bg: 'rgba(220,38,38,.06)', border: 'rgba(220,38,38,.2)', text: '#dc2626', label: 'URGENT' }, high: { bg: 'rgba(245,158,11,.06)', border: 'rgba(245,158,11,.25)', text: '#d97706', label: 'ORDER SOON' }, medium: { bg: 'rgba(59,130,246,.06)', border: 'rgba(59,130,246,.2)', text: '#2563eb', label: 'PLAN AHEAD' } }
                    const uc = urgColors[s.urgency as keyof typeof urgColors] || urgColors.medium
                    const isRestocking = reorderRestockId === s.inventory_id
                    return (
                      <div key={s.id} style={{ padding: '12px 14px', borderRadius: 10, background: uc.bg, border: `1px solid ${uc.border}`, position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{s.name}</span>
                            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: uc.text, color: '#fff', letterSpacing: '.5px' }}>{uc.label}</span>
                            {s.sales_trend === 'rising' && <span style={{ fontSize: 10, color: '#16a34a' }}>↑ rising</span>}
                            {s.sales_trend === 'falling' && <span style={{ fontSize: 10, color: '#94a3b8' }}>↓ slowing</span>}
                          </div>
                          <button onClick={async () => { setDismissingId(s.id); await fetch('/api/pos/reorder-suggestions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'dismiss', id: s.id }) }); setReorderSuggestions(prev => prev.filter(x => x.id !== s.id)); setDismissingId(null) }}
                            disabled={dismissingId === s.id}
                            style={{ fontSize: 10, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontFamily: 'inherit', opacity: dismissingId === s.id ? 0.4 : 1 }}>✕</button>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 8 }}>{s.reason}</div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                          <div><span style={{ fontSize: 10, color: 'var(--tx3)' }}>Current stock</span><div style={{ fontSize: 13, fontWeight: 600, color: s.current_stock === 0 ? '#dc2626' : 'var(--tx)' }}>{s.current_stock} {s.unit}s</div></div>
                          <div><span style={{ fontSize: 10, color: 'var(--tx3)' }}>Sells</span><div style={{ fontSize: 13, fontWeight: 600 }}>{s.avg_daily_sales}/day</div></div>
                          <div><span style={{ fontSize: 10, color: 'var(--tx3)' }}>Order</span><div style={{ fontSize: 13, fontWeight: 700, color: uc.text }}>{s.suggested_qty} {s.unit}s</div></div>
                          {s.estimated_cost > 0 && <div><span style={{ fontSize: 10, color: 'var(--tx3)' }}>Est. cost</span><div style={{ fontSize: 13, fontWeight: 600 }}>{currencySymbol}{s.estimated_cost.toLocaleString()}</div></div>}
                          {s.supplier && <div><span style={{ fontSize: 10, color: 'var(--tx3)' }}>Supplier</span><div style={{ fontSize: 13, fontWeight: 500 }}>{s.supplier}</div></div>}
                        </div>
                        {/* Restock action row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${uc.border}` }}>
                          {isRestocking ? (
                            <>
                              <input type="number" placeholder={String(s.suggested_qty)} value={reorderRestockQty}
                                onChange={e => setReorderRestockQty(e.target.value)}
                                autoFocus
                                style={{ width: 70, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }} />
                              <button disabled={reorderRestocking} onClick={async () => {
                                const qty = parseInt(reorderRestockQty) || s.suggested_qty
                                setReorderRestocking(true)
                                try {
                                  const res = await fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.inventory_id, restock_qty: qty }) })
                                  const data = await res.json()
                                  if (data.product) {
                                    setInventory(prev => prev.map(i => i.id === s.inventory_id ? data.product : i))
                                    // Dismiss this suggestion after restocking
                                    await fetch('/api/pos/reorder-suggestions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'dismiss', id: s.id }) })
                                    setReorderSuggestions(prev => prev.filter(x => x.id !== s.id))
                                    notify(`Restocked ${s.name} +${qty} ${s.unit}s`)
                                  } else { notify(data.error || 'Restock failed', false) }
                                } catch { notify('Restock failed', false) }
                                setReorderRestocking(false); setReorderRestockId(null); setReorderRestockQty('')
                              }}
                                style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#16a34a', color: '#fff', fontSize: 12, fontWeight: 600, cursor: reorderRestocking ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: reorderRestocking ? 0.6 : 1 }}>
                                {reorderRestocking ? 'Restocking...' : `Restock +${reorderRestockQty || s.suggested_qty}`}
                              </button>
                              <button onClick={() => { setReorderRestockId(null); setReorderRestockQty('') }}
                                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                            </>
                          ) : (
                            <button onClick={() => { setReorderRestockId(s.inventory_id); setReorderRestockQty(String(s.suggested_qty)) }}
                              style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#16a34a', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                              Restock
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* P&L summary — retail only */}
            {completedTx.length > 0 && selectedSector === 'retail' && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={sectionLabel}>Profit & loss</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['daily', 'weekly', 'monthly'] as const).map(v => (
                      <button key={v} onClick={() => setPlView(v)} style={{ padding: '4px 10px', borderRadius: 6, border: plView === v ? `1px solid ${ACC}` : '1px solid var(--b)', background: plView === v ? ACC_BG : 'transparent', color: plView === v ? ACC : 'var(--tx3)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    <span>Period</span><span style={{ textAlign: 'right' }}>Revenue</span><span style={{ textAlign: 'right' }}>Cost</span><span style={{ textAlign: 'right' }}>Profit</span>
                  </div>
                  {plData.map((row, i) => (
                    <div key={row.period} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{row.period} <span style={{ fontSize: 11, color: 'var(--tx3)' }}>({row.count})</span></div>
                      <div style={{ fontSize: 13, fontWeight: 600, textAlign: 'right', color: 'var(--tx)' }}>{fmt(currencySymbol, row.revenue)}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, textAlign: 'right', color: 'var(--tx3)' }}>{fmt(currencySymbol, row.cost)}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: row.profit >= 0 ? GREEN : RED }}>{fmt(currencySymbol, row.profit)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory intelligence — Retail only */}
            {selectedSector === 'retail' && inventory.length > 0 && (() => {
              const todayMs = new Date().setHours(0,0,0,0)
              const stockValue = inventory.reduce((s, i) => s + (i.cost_price || 0) * i.stock_qty, 0)
              const retailValue = inventory.reduce((s, i) => s + i.sale_price * i.stock_qty, 0)
              const expiredItems = inventory.filter(i => i.expiry_date && new Date(i.expiry_date).getTime() < todayMs)
              const expiringSoon = inventory.filter(i => {
                if (!i.expiry_date) return false
                const d = Math.floor((new Date(i.expiry_date).getTime() - todayMs) / 86400000)
                return d >= 0 && d <= 30
              })
              const deadStock = inventory.filter(i => !i.last_sold_at || (new Date().getTime() - new Date(i.last_sold_at).getTime()) > 90 * 86400000)
              return (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ ...sectionLabel, marginBottom: 12 }}>Inventory intelligence</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <div style={{ ...cardStyle, padding: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600, marginBottom: 4 }}>STOCK VALUE (COST)</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, stockValue)}</div>
                    </div>
                    <div style={{ ...cardStyle, padding: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600, marginBottom: 4 }}>RETAIL VALUE</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>{fmt(currencySymbol, retailValue)}</div>
                    </div>
                    {expiredItems.length > 0 && (
                      <div style={{ ...cardStyle, padding: 16, border: `1px solid ${RED}` }}>
                        <div style={{ fontSize: 11, color: RED, fontWeight: 600, marginBottom: 4 }}>EXPIRED</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: RED }}>{expiredItems.length}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>item{expiredItems.length !== 1 ? 's' : ''} need removing</div>
                      </div>
                    )}
                    {expiringSoon.length > 0 && (
                      <div style={{ ...cardStyle, padding: 16, border: `1px solid ${AMBER}` }}>
                        <div style={{ fontSize: 11, color: AMBER, fontWeight: 600, marginBottom: 4 }}>EXPIRING SOON</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: AMBER }}>{expiringSoon.length}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>within 30 days</div>
                      </div>
                    )}
                    {deadStock.length > 0 && (
                      <div style={{ ...cardStyle, padding: 16 }}>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600, marginBottom: 4 }}>SLOW / DEAD STOCK</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx)' }}>{deadStock.length}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>not sold in 90+ days</div>
                      </div>
                    )}
                  </div>
                  {expiredItems.length > 0 && (
                    <div style={{ background: 'rgba(220,38,38,.06)', border: `1px solid ${RED}`, borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: RED, marginBottom: 6 }}>⚠ Expired products — action required</div>
                      {expiredItems.slice(0, 5).map(i => (
                        <div key={i.id} style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 2 }}>
                          {i.name} — expired {new Date(i.expiry_date!).toLocaleDateString('en-GB')} ({i.stock_qty} {i.unit || 'units'} in stock)
                        </div>
                      ))}
                      {expiredItems.length > 5 && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>+{expiredItems.length - 5} more — check Inventory tab</div>}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Recent transactions */}
            <div>
              <div style={sectionLabel}>Recent transactions</div>
              {sectorTransactions.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: ACC_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>No sales yet</div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Share <strong>pos.askbiz.co</strong> with your cashiers to get started.</div>
                </div>
              ) : (
                <>
                  <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                    {sectorTransactions.slice(txPage * TX_PER_PAGE, (txPage + 1) * TX_PER_PAGE).map((tx, i, arr) => (
                      <div key={tx.id} onClick={() => setTxDetail(tx)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', cursor: 'pointer', transition: 'background 150ms' }}
                        onMouseEnter={e => { (e.currentTarget.style as any).background = 'rgba(208,138,89,.03)' }} onMouseLeave={e => { (e.currentTarget.style as any).background = 'var(--sf)' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>
                            {(tx.pos_items || []).length > 0
                              ? <>
                                  {tx.pos_items.slice(0, 2).map(i => i.name).filter(Boolean).join(', ') || 'Sale'}
                                  {tx.pos_items.length > 2 && ` +${tx.pos_items.length - 2} more`}
                                </>
                              : 'Sale'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                            {tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {tx.payment_type}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {tx.status !== 'completed' && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: RED, background: 'rgba(220,38,38,.08)', padding: '2px 7px', borderRadius: 9999 }}>{tx.status.replace('_', ' ')}</span>
                          )}
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, tx.total)}</div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Pagination */}
                  {sectorTransactions.length > TX_PER_PAGE && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
                      <button onClick={() => setTxPage(p => Math.max(0, p - 1))} disabled={txPage === 0} style={{ ...btnSecondary, opacity: txPage === 0 ? 0.4 : 1, padding: '6px 12px', fontSize: 12 }}>Previous</button>
                      <span style={{ fontSize: 12, color: 'var(--tx3)', alignSelf: 'center' }}>{txPage + 1} of {Math.ceil(sectorTransactions.length / TX_PER_PAGE)}</span>
                      <button onClick={() => setTxPage(p => Math.min(Math.ceil(sectorTransactions.length / TX_PER_PAGE) - 1, p + 1))} disabled={(txPage + 1) * TX_PER_PAGE >= sectorTransactions.length} style={{ ...btnSecondary, opacity: (txPage + 1) * TX_PER_PAGE >= sectorTransactions.length ? 0.4 : 1, padding: '6px 12px', fontSize: 12 }}>Next</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ SERVICES TAB ══════════════ */}
        {tab === 'services' && (() => {
          const bt = (businessType || '').toLowerCase()
          const detectedSector = ['restaurant','cafe','café','bar','pub','takeaway','food','catering','food stall','bistro','diner'].some(k => bt.includes(k)) ? 'restaurant'
            : ['repair','phone','mobile','electronic','watch','laptop','computer'].some(k => bt.includes(k)) ? 'repair'
            : ['salon','barber','barbershop','spa','beauty','clinic','nail'].some(k => bt.includes(k)) ? 'salon'
            : ['factory','manufactur','production','warehouse','processing','packaging'].some(k => bt.includes(k)) ? 'factory'
            : 'retail'
          const sector = sectorOverride || detectedSector

          // Badge count: only items explicitly tagged to this sector (untagged items
          // are "shared" and would otherwise inflate every sector's badge identically).
          // For retail/all — the default home — also include untagged items.
          const isDefaultSector = sector === 'retail' || !sector
          const sectorInventory = inventory.filter(i =>
            isDefaultSector ? (!i.sector || i.sector === 'retail') : i.sector === sector
          )
          const sectorAlertCount = sectorInventory.filter(i => i.stock_qty <= i.low_stock_threshold).length

          const ACC = '#d08a59'

          // ── Shared tile card renderer ──────────────────────────────────────
          const tileStyle: React.CSSProperties = {
            background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12,
            padding: '16px 14px', textAlign: 'left', textDecoration: 'none',
            transition: 'border-color 0.15s', fontFamily: 'inherit',
            position: 'relative', display: 'flex', flexDirection: 'column',
            minHeight: 110, cursor: 'pointer',
          }
          const renderTile = (tile: { icon: string; label: string; desc: string; badge?: number | null; tab?: Tab; href?: string; comingSoon?: boolean }, idx: number) => {
            const inner = (
              <>
                {tile.badge ? <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, color: '#fff', background: RED, borderRadius: 9999, padding: '1px 6px' }}>{tile.badge}</span> : null}
                {tile.comingSoon ? <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, fontWeight: 700, color: AMBER, background: 'rgba(202,138,4,.1)', borderRadius: 9999, padding: '2px 7px' }}>Soon</span> : null}
                <div style={{ fontSize: 22, marginBottom: 8, lineHeight: 1, opacity: tile.comingSoon ? 0.5 : 1 }}>{tile.icon}</div>
                <div style={{ fontWeight: 600, color: 'var(--tx)', fontSize: 13, lineHeight: 1.3, opacity: tile.comingSoon ? 0.6 : 1 }}>{tile.label}</div>
                <div style={{ color: 'var(--tx3)', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>{tile.desc}</div>
              </>
            )
            if (tile.href) return (
              <a key={idx} href={`https://pos.askbiz.co${tile.href}`} style={tileStyle}
                onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b)')}>{inner}</a>
            )
            return (
              <button key={idx} onClick={() => handleSetTab(tile.tab!)} style={tileStyle}
                onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b)')}>{inner}</button>
            )
          }
          const tileGrid = (tiles: Parameters<typeof renderTile>[0][]) => (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 12 }}>
              {tiles.map((t, i) => renderTile(t, i))}
            </div>
          )

          const sectorPicker = (
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { id: 'restaurant', label: '🍴 Restaurant' },
                { id: 'repair',     label: '🔧 Repair' },
                { id: 'salon',      label: '💇 Salon' },
                { id: 'retail',     label: '📦 Retail' },
                { id: 'factory',    label: '🏭 Factory' },
                { id: 'logistics',  label: '🚛 Logistics' },
              ].map(s => (
                <button key={s.id} onClick={() => setSectorOverride(s.id === detectedSector ? null : s.id)}
                  style={{ padding: '5px 14px', borderRadius: 8, border: `1.5px solid ${sector === s.id ? ACC : 'var(--b)'}`,
                    background: sector === s.id ? ACC : 'var(--sf)', color: sector === s.id ? '#fff' : 'var(--tx3)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {s.label}
                </button>
              ))}
            </div>
          )

          if (sector === 'restaurant') return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🍴 Restaurant Operations</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Floor plan, kitchen, orders, menu and labour — all in one place.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {[
                  { label: '🏠 Hub',           href: '/restaurant',              desc: 'Live operations dashboard' },
                  { label: '🗺️ Floor Plan',    href: '/restaurant/floor',        desc: 'Table status & seating' },
                  { label: '📋 Orders',        href: '/restaurant/orders',       desc: 'Take & manage orders' },
                  { label: '🍳 Kitchen',       href: '/restaurant/kitchen',      desc: 'Live KDS display' },
                  { label: '🍽️ Menu',          href: '/restaurant/menu',         desc: 'Edit items & pricing' },
                  { label: '⏱️ Labour',        href: '/restaurant/labor',        desc: 'Clock in/out & costs' },
                  { label: '📱 Online Orders', href: '/restaurant/online-orders',desc: 'Accept & manage online orders' },
                  { label: '📅 Reservations',  href: '/restaurant/reservations', desc: 'Bookings & covers management' },
                  { label: '📦 Deliveries',    href: '/restaurant/deliveries',   desc: 'Scan invoices & food costs' },
                  { label: '🗑️ Waste',         href: '/restaurant/waste',        desc: 'Log & track food waste' },
                  { label: '👥 Staff',         href: '/restaurant/staff',        desc: 'Server revenue & shifts' },
                ].map(tile => (
                  <a key={tile.href} href={`https://pos.askbiz.co${tile.href}`}
                    style={{ display: 'block', background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: '16px 14px', textDecoration: 'none', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b)')}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{tile.label.split(' ')[0]}</div>
                    <div style={{ fontWeight: 600, color: 'var(--tx)', fontSize: 14 }}>{tile.label.split(' ').slice(1).join(' ')}</div>
                    <div style={{ color: 'var(--tx3)', fontSize: 12, marginTop: 2 }}>{tile.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          )

          if (sector === 'repair') return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🔧 Repair Operations</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Service jobs, engineer assignments, parts and customer collection.</div>
              </div>
              {tileGrid([
                { icon: '🔧', label: 'Service Jobs',  tab: 'services' as Tab,  desc: 'All jobs by status' },
                { icon: '👥', label: 'Staff',         tab: 'staff' as Tab,     desc: 'Engineers & repair roles' },
                { icon: '🛒', label: 'Sales',         tab: 'overview' as Tab,  desc: 'Revenue & transactions' },
                { icon: '📦', label: 'Parts & Stock', tab: 'inventory' as Tab, desc: 'Inventory levels',        badge: sectorAlertCount > 0 ? sectorAlertCount : null },
                { icon: '🔍', label: 'Audit',         tab: 'audit' as Tab,     desc: 'Every action logged' },
              ])}
              <div style={{ marginTop: 28 }}>
                <ServiceJobsTab
                  currencySymbol={currencySymbol}
                  selectedLocation={selectedLocation}
                  staff={staff.map(s => ({ id: s.id, name: s.name, role: s.role || 'cashier', active: s.active, location_id: s.location_id }))}
                  notify={notify}
                />
              </div>
            </div>
          )

          if (sector === 'factory') return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🏭 Factory Operations</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Production captures, intake/output tracking, wastage logs and dispatch.</div>
              </div>
              {tileGrid([
                { icon: '📷', label: 'Captures',     tab: 'captures' as Tab,     desc: 'Intake, output, wastage & dispatch' },
                { icon: '✅', label: 'Approvals',    tab: 'approvals' as Tab,    desc: 'Pending sign-offs' },
                { icon: '🧠', label: 'Intelligence', tab: 'intelligence' as Tab, desc: 'AI anomaly detection & production insights' },
                { icon: '👥', label: 'Staff',        tab: 'staff' as Tab,        desc: 'Supervisors & floor workers' },
                { icon: '📦', label: 'Inventory',    tab: 'inventory' as Tab,    desc: 'Raw materials & finished goods', badge: sectorAlertCount > 0 ? sectorAlertCount : null },
                { icon: '🔍', label: 'Audit',        tab: 'audit' as Tab,        desc: 'Every capture & approval logged' },
              ])}
            </div>
          )

          if (sector === 'salon') return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>💇 Salon & Bookings</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Appointments, walk-ins, stylist management, and client history.</div>
              </div>
              {tileGrid([
                { icon: '🛒', label: 'Sales',      tab: 'overview' as Tab,   desc: 'Revenue & transactions' },
                { icon: '👥', label: 'Staff',       tab: 'staff' as Tab,      desc: 'Stylists & roles' },
                { icon: '📦', label: 'Products',    tab: 'inventory' as Tab,  desc: 'Retail products & supplies', badge: sectorAlertCount > 0 ? sectorAlertCount : null },
                { icon: '👤', label: 'Clients',     tab: 'customers' as Tab,  desc: 'Client profiles & history' },
                { icon: '🏪', label: 'Branches',    tab: 'branches' as Tab,   desc: 'Locations & stock' },
                { icon: '🔍', label: 'Audit',       tab: 'audit' as Tab,      desc: 'Every action logged' },
              ])}
            </div>
          )

          if (sector === 'logistics') return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🚛 Logistics Operations</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Parcels, fleet, routes & revenue across all branches.</div>
              </div>
              {tileGrid([
                { icon: '📦', label: 'Parcels',   tab: 'logistics' as Tab, desc: 'Track & manage parcels' },
                { icon: '🚛', label: 'Fleet',     tab: 'logistics' as Tab, desc: 'Vehicles & maintenance' },
                { icon: '🗺️', label: 'Routes',    tab: 'logistics' as Tab, desc: 'Delivery route planning' },
                { icon: '💰', label: 'Revenue',   tab: 'logistics' as Tab, desc: 'Delivery income & invoices' },
                { icon: '👥', label: 'Staff',     tab: 'staff' as Tab,     desc: 'Drivers & dispatchers' },
                { icon: '🔍', label: 'Audit',     tab: 'audit' as Tab,     desc: 'Every action logged' },
              ])}
            </div>
          )

          return (
            <div style={{ maxWidth: 860 }}>
              {sectorPicker}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>📦 Retail Operations</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Stock management, sales tracking, and supplier orders.</div>
              </div>
              {tileGrid([
                { icon: '📦', label: 'Inventory',       tab: 'inventory' as Tab,       desc: 'Stock levels & products',       badge: sectorAlertCount > 0 ? sectorAlertCount : null },
                { icon: '🛒', label: 'Sales',           tab: 'overview' as Tab,        desc: 'Revenue & transactions' },
                { icon: '👤', label: 'Customers',       tab: 'customers' as Tab,       desc: 'Profiles, history & segments' },
                { icon: '🏷️', label: 'Promotions',      tab: 'promotions' as Tab,      desc: 'Discounts, coupons & deals' },
                { icon: '⭐', label: 'Loyalty',          tab: 'loyalty' as Tab,         desc: 'Points, rewards & tiers' },
                { icon: '↩️', label: 'Returns',          tab: 'returns' as Tab,         desc: 'Refunds, exchanges & credits' },
                { icon: '📊', label: 'Reports',         tab: 'reports' as Tab,         desc: 'Sales, margins & insights' },
                { icon: '📋', label: 'Purchase Orders', tab: 'purchase_orders' as Tab, desc: 'Supplier orders & receiving', comingSoon: true },
                { icon: '🎁', label: 'Gift Cards',      tab: 'gift_cards' as Tab,      desc: 'Issue, redeem & balances', comingSoon: true },
                { icon: '👥', label: 'Staff',           tab: 'staff' as Tab,           desc: 'Cashiers & permissions' },
                { icon: '🏪', label: 'Branches',        tab: 'branches' as Tab,        desc: 'Locations & stock by branch' },
                { icon: '🗺️', label: 'Map',             tab: 'map' as Tab,             desc: 'Branch locations on map' },
                { icon: '🔗', label: 'Integrations',    tab: 'integrations' as Tab,    desc: 'Xero, payments & more' },
                { icon: '🔍', label: 'Audit',           tab: 'audit' as Tab,           desc: 'Transaction & change log' },
              ])}
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
                    {activeStaff} of {seatCount} seat{seatCount !== 1 ? 's' : ''} used
                    {atLimit && <span style={{ marginLeft: 8, color: RED, fontWeight: 600 }}>· <a href="/billing" style={{ color: RED }}>Add seats →</a></span>}
                  </div>
                  <button onClick={() => atLimit ? window.location.href = '/billing' : setShowAddStaff(true)} style={{ ...btnPrimary, background: atLimit ? RED : ACC }}>
                    {atLimit ? 'Upgrade seats →' : '+ Add staff'}
                  </button>
                </div>
              )
            })()}

            {/* Add staff form */}
            {showAddStaff && (
              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New staff member</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input placeholder="Full name" value={newName} onChange={e => setNewName(e.target.value)} style={inputStyle} />
                  <input placeholder="Phone number (e.g. +447911123456)" value={newPhone} onChange={e => setNewPhone(e.target.value)} style={inputStyle} />
                  <div style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center' }}>— or —</div>
                  <input placeholder="Email address (alternative to WhatsApp)" value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" style={inputStyle} />
                  <select value={newRole} onChange={e => setNewRole(e.target.value as any)} style={inputStyle}>
                    <optgroup label="🏭 FACTORY">
                      <option value="factory-line-operator">👷 Line Operator</option>
                      <option value="factory-quality-inspector">🔍 Quality Inspector</option>
                      <option value="factory-shift-supervisor">👔 Shift Supervisor</option>
                      <option value="factory-production-manager">🎯 Production Manager</option>
                      <option value="factory-inventory-manager">📦 Inventory Manager</option>
                    </optgroup>
                    <optgroup label="🍽️ RESTAURANT">
                      <option value="restaurant-server">🍽️ Server</option>
                      <option value="restaurant-lead-server">⭐ Lead Server</option>
                      <option value="restaurant-host">🎫 Host</option>
                      <option value="restaurant-head-chef">👨‍🍳 Head Chef</option>
                      <option value="restaurant-kitchen-manager">🍳 Kitchen Manager</option>
                      <option value="restaurant-line-cook">🔪 Line Cook</option>
                      <option value="restaurant-operations-manager">🎯 Ops Manager</option>
                      <option value="restaurant-cashier">💳 Cashier</option>
                    </optgroup>
                    <optgroup label="🔧 REPAIR">
                      <option value="repair-intake-specialist">📋 Intake Specialist</option>
                      <option value="repair-technician">🔧 Technician</option>
                      <option value="repair-quality-checker">✓ Quality Checker</option>
                      <option value="repair-manager">🎯 Repair Manager</option>
                    </optgroup>
                    <optgroup label="💅 SALON">
                      <option value="salon-receptionist">📞 Receptionist</option>
                      <option value="salon-stylist">💇 Stylist</option>
                      <option value="salon-esthetician">💄 Esthetician</option>
                      <option value="salon-manager">🎯 Salon Manager</option>
                    </optgroup>
                    <optgroup label="🏪 RETAIL">
                      <option value="retail-cashier">💳 Cashier</option>
                      <option value="retail-floor-staff">🏪 Floor Associate</option>
                      <option value="retail-inventory-manager">📦 Inventory Manager</option>
                      <option value="retail-shift-supervisor">👔 Shift Supervisor</option>
                      <option value="retail-manager">🎯 Store Manager</option>
                    </optgroup>
                    <optgroup label="🚛 LOGISTICS">
                      <option value="logistics-handler">📦 Handler</option>
                      <option value="logistics-driver">🚛 Driver</option>
                      <option value="logistics-dispatcher">📍 Dispatcher</option>
                      <option value="logistics-branch-manager">🎯 Branch Manager</option>
                    </optgroup>
                  </select>
                  {locations.length > 0 && (
                    <select value={newLocationId} onChange={e => setNewLocationId(e.target.value)} style={inputStyle}>
                      <option value="">No branch (can work anywhere)</option>
                      {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                  )}
                  <input placeholder="PIN (4–6 digits) — required for POS login" value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} type="text" inputMode="numeric" maxLength={6} style={{ ...inputStyle, letterSpacing: '0.15em', borderColor: newPin && newPin.length >= 4 ? 'rgba(22,163,74,.4)' : undefined }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleAddStaff} disabled={addingStaff} style={btnPrimary}>{addingStaff ? 'Adding...' : 'Add staff member'}</button>
                    <button onClick={() => setShowAddStaff(false)} style={btnSecondary}>Cancel</button>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>They'll log in at <strong>pos.askbiz.co</strong> using their phone (WhatsApp code) or email address.</div>
                </div>
              </div>
            )}

            {/* Staff list */}
            {selectedSector !== 'all' && (
              <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10 }}>
                Showing {filteredStaff.length} of {staff.length} staff · filtered by {selectedSector}
              </div>
            )}
            {filteredStaff.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: ACC_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{staff.length === 0 ? 'No staff added yet' : `No ${selectedSector} staff`}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{staff.length === 0 ? 'Add your first cashier or inventory manager above.' : `No staff assigned to the ${selectedSector} sector yet.`}</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                {filteredStaff.map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < filteredStaff.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', opacity: s.active ? 1 : 0.5, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.active ? ACC_BG : 'var(--ev)', border: `1px solid ${s.active ? ACC_BORDER : 'var(--b)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: s.active ? ACC : 'var(--tx3)', flexShrink: 0 }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {s.name}
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 9999, background: `${SECTOR_BADGE_COLOR[s.sector||'retail']}20`, color: SECTOR_BADGE_COLOR[s.sector||'retail'] }}>
                            {s.sector || 'retail'}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span>{s.role}</span>
                          {s.location?.name && <span style={{ color: ACC, fontWeight: 600 }}>· {s.location.name}</span>}
                          {s.phone && <span>· {s.phone}</span>}
                          {s.has_pin ? <span style={{ color: GREEN, fontWeight: 600 }}>· PIN set</span> : <span style={{ color: RED, fontWeight: 600 }}>· No PIN</span>}
                          {s.last_login_at && <span>· Last login {new Date(s.last_login_at).toLocaleDateString('en-GB')}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleOpenEditStaff(s)} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)' }}>Edit</button>
                      <button onClick={() => handleToggleStaff(s)} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: s.active ? 'rgba(220,38,38,.08)' : 'rgba(22,163,74,.08)', color: s.active ? RED : GREEN }}>
                        {s.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit staff inline */}
            {editingStaff && (
              <div style={{ ...cardStyle, marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Edit {editingStaff.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  <input placeholder="Full name" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
                  <input placeholder="Phone number" value={editPhone} onChange={e => setEditPhone(e.target.value)} style={inputStyle} />
                  <div style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center' }}>— or —</div>
                  <input placeholder="Email address" value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" style={inputStyle} />
                  <input placeholder={`New PIN (4–6 digits)${editingStaff.has_pin ? ' — leave blank to keep current' : ''}`} value={editPin} onChange={e => setEditPin(e.target.value.replace(/\D/g, '').slice(0, 6))} type="text" inputMode="numeric" maxLength={6} style={{ ...inputStyle, letterSpacing: '0.15em', borderColor: editPin && editPin.length >= 4 ? 'rgba(22,163,74,.4)' : undefined }} />
                  <select value={editRole} onChange={e => setEditRole(e.target.value as any)} style={inputStyle}>
                    <optgroup label="🏭 FACTORY">
                      <option value="factory-line-operator">👷 Line Operator</option>
                      <option value="factory-quality-inspector">🔍 Quality Inspector</option>
                      <option value="factory-shift-supervisor">👔 Shift Supervisor</option>
                      <option value="factory-production-manager">🎯 Production Manager</option>
                      <option value="factory-inventory-manager">📦 Inventory Manager</option>
                    </optgroup>
                    <optgroup label="🍽️ RESTAURANT">
                      <option value="restaurant-server">🍽️ Server</option>
                      <option value="restaurant-lead-server">⭐ Lead Server</option>
                      <option value="restaurant-host">🎫 Host</option>
                      <option value="restaurant-head-chef">👨‍🍳 Head Chef</option>
                      <option value="restaurant-kitchen-manager">🍳 Kitchen Manager</option>
                      <option value="restaurant-line-cook">🔪 Line Cook</option>
                      <option value="restaurant-operations-manager">🎯 Ops Manager</option>
                      <option value="restaurant-cashier">💳 Cashier</option>
                    </optgroup>
                    <optgroup label="🔧 REPAIR">
                      <option value="repair-intake-specialist">📋 Intake Specialist</option>
                      <option value="repair-technician">🔧 Technician</option>
                      <option value="repair-quality-checker">✓ Quality Checker</option>
                      <option value="repair-manager">🎯 Repair Manager</option>
                    </optgroup>
                    <optgroup label="💅 SALON">
                      <option value="salon-receptionist">📞 Receptionist</option>
                      <option value="salon-stylist">💇 Stylist</option>
                      <option value="salon-esthetician">💄 Esthetician</option>
                      <option value="salon-manager">🎯 Salon Manager</option>
                    </optgroup>
                    <optgroup label="🏪 RETAIL">
                      <option value="retail-cashier">💳 Cashier</option>
                      <option value="retail-floor-staff">🏪 Floor Associate</option>
                      <option value="retail-inventory-manager">📦 Inventory Manager</option>
                      <option value="retail-shift-supervisor">👔 Shift Supervisor</option>
                      <option value="retail-manager">🎯 Store Manager</option>
                    </optgroup>
                    <optgroup label="🚛 LOGISTICS">
                      <option value="logistics-handler">📦 Handler</option>
                      <option value="logistics-driver">🚛 Driver</option>
                      <option value="logistics-dispatcher">📍 Dispatcher</option>
                      <option value="logistics-branch-manager">🎯 Branch Manager</option>
                    </optgroup>
                  </select>
                  {locations.length > 0 && (
                    <select value={editLocationId} onChange={e => setEditLocationId(e.target.value)} style={inputStyle}>
                      <option value="">No branch (can work anywhere)</option>
                      {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                  )}
                  {/* Sector assignment with 2-edit limit */}
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>
                      Sector — what this staff member can access
                      {(editingStaff.sector_edit_count ?? 0) >= 2
                        ? <span style={{ marginLeft: 6, color: '#ef4444', fontWeight: 600 }}>· Edit limit reached (purchase a new seat to change)</span>
                        : <span style={{ marginLeft: 6, color: 'var(--tx3)' }}>· {2 - (editingStaff.sector_edit_count ?? 0)} change{2 - (editingStaff.sector_edit_count ?? 0) !== 1 ? 's' : ''} remaining</span>
                      }
                    </div>
                    <select
                      value={editSector}
                      onChange={e => setEditSector(e.target.value)}
                      disabled={(editingStaff.sector_edit_count ?? 0) >= 2 && editSector !== editingStaff.sector}
                      style={{ ...inputStyle, opacity: (editingStaff.sector_edit_count ?? 0) >= 2 ? 0.5 : 1, cursor: (editingStaff.sector_edit_count ?? 0) >= 2 ? 'not-allowed' : 'pointer' }}
                    >
                      <option value="restaurant">🍴 Restaurant</option>
                      <option value="repair">🔧 Repair</option>
                      <option value="salon">💇 Salon</option>
                      <option value="retail">📦 Retail</option>
                      <option value="logistics">🚛 Logistics</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleEditStaff} disabled={editingSubmitting} style={btnPrimary}>{editingSubmitting ? 'Saving...' : 'Save changes'}</button>
                  <button onClick={() => setEditingStaff(null)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ STAFF TEMPLATES TAB ══════════════ */}
        {tab === 'staff_templates' && (
          <StaffTemplatesTab
            businessType={businessType === 'restaurant' ? 'restaurant' : 'factory'}
            onSelectTemplate={(template) => {
              setShowAddStaff(true)
              setNewRole(template.id as any)
              setTimeout(() => {
                notify(`Using ${template.name} template — enter staff details above`, true)
              }, 100)
            }}
          />
        )}

        {/* ══════════════ INVENTORY TAB ══════════════ */}
        {tab === 'inventory' && (
          <div style={{ maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>📦 Inventory</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{filteredInventory.length} product{filteredInventory.length !== 1 ? 's' : ''}</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              {/* Hidden file inputs for dual-photo scan */}
              <input ref={scanFrontRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleScanFileSelected(e.target.files[0], 'front') }} />
              <input ref={scanBackRef}  type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleScanFileSelected(e.target.files[0], 'back')  }} />

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => { setShowScanModal(true); setScanFront(null); setScanBack(null); setScanFrontThumb(null); setScanBackThumb(null) }} style={{ ...btnPrimary, fontSize: 12, background: '#7c3aed' }}>
                  📷 Scan to add
                </button>
                <button onClick={() => setShowBulkImport(true)} style={{ ...btnSecondary, fontSize: 12 }}>CSV import</button>
                <button onClick={() => setShowAddProduct(true)} style={{ ...btnSecondary, fontSize: 12 }}>+ Manual</button>
              </div>
            </div>

            {/* Search, category & sector filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <input placeholder="Search products..." value={invSearch} onChange={e => setInvSearch(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
              {categories.length > 2 && (
                <select value={invCategory} onChange={e => setInvCategory(e.target.value)} style={{ ...inputStyle, minWidth: 140 }}>
                  {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
                </select>
              )}
              {selectedSector === 'all' && (
                <select value={invSector} onChange={e => setInvSector(e.target.value)} style={{ ...inputStyle, minWidth: 140 }}>
                  <option value="all">All sectors</option>
                  <option value="retail">🛒 Retail</option>
                  <option value="repair">🔧 Repair</option>
                  <option value="factory">🏭 Factory</option>
                  <option value="restaurant">🍴 Restaurant</option>
                  <option value="logistics">🚚 Logistics</option>
                  <option value="salon">💇 Salon</option>
                </select>
              )}
            </div>
            {/* Stock status filter tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {(['all', 'low', 'out', 'expiring'] as const).map(f => {
                const labels: Record<string, string> = { all: 'All', low: 'Low stock', out: 'Out of stock', expiring: 'Expiring soon' }
                const colors: Record<string, string> = { all: ACC, low: AMBER, out: RED, expiring: '#f97316' }
                const isActive = invStockFilter === f
                return (
                  <button key={f} onClick={() => setInvStockFilter(f)} style={{ padding: '5px 12px', borderRadius: 8, border: isActive ? `1.5px solid ${colors[f]}` : '1.5px solid var(--b)', background: isActive ? `${colors[f]}18` : 'transparent', color: isActive ? colors[f] : 'var(--tx3)', fontSize: 12, fontWeight: isActive ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}>
                    {labels[f]}
                  </button>
                )
              })}
            </div>

            {/* Bulk-tag banner — shown when untagged items exist */}
            {(() => {
              const untagged = inventory.filter(i => !i.sector)
              if (untagged.length === 0) return null
              const SECTORS = [
                { value: 'retail', label: '🛒 Retail' },
                { value: 'repair', label: '🔧 Repair' },
                { value: 'factory', label: '🏭 Factory' },
                { value: 'restaurant', label: '🍴 Restaurant' },
                { value: 'logistics', label: '🚚 Logistics' },
                { value: 'salon', label: '💇 Salon' },
              ]
              return (
                <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 13, color: 'var(--tx3)', flex: 1, minWidth: 200 }}>
                    <strong style={{ color: 'var(--tx)' }}>{untagged.length} item{untagged.length !== 1 ? 's' : ''}</strong> have no sector tag — they appear in every sector's badge count.
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--tx3)' }}>Tag all untagged as:</span>
                    {SECTORS.map(s => (
                      <button key={s.value} disabled={bulkTagging} onClick={async () => {
                        setBulkTagging(true)
                        try {
                          await Promise.all(untagged.map(item =>
                            fetch('/api/pos/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, sector: s.value }) })
                          ))
                          setInventory(prev => prev.map(i => !i.sector ? { ...i, sector: s.value } : i))
                          notify(`${untagged.length} items tagged as ${s.label}`)
                        } catch { notify('Bulk tag failed', false) }
                        setBulkTagging(false)
                      }} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', cursor: bulkTagging ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: 'var(--tx)', opacity: bulkTagging ? 0.5 : 1 }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* ── Dual-photo scan modal ── */}
            {showScanModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => !scanning && setShowScanModal(false)}>
                <div style={{ background: 'var(--sf)', borderRadius: 14, padding: 28, maxWidth: 480, width: '100%', maxHeight: '92vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)' }}>📷 Scan product</div>
                    <button onClick={() => setShowScanModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--tx3)', padding: 4 }}>×</button>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 24 }}>
                    Take a photo of the front (and optionally the back) — Claude will fill in the product details automatically.
                  </div>

                  {/* Photo slots */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    {/* Front slot */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Front <span style={{ color: '#ef4444' }}>*</span></div>
                      {scanFrontThumb ? (
                        <div style={{ position: 'relative' }}>
                          <img src={scanFrontThumb} alt="front" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 12, display: 'block', border: '2px solid #7c3aed' }} />
                          <button onClick={() => { setScanFront(null); setScanFrontThumb(null) }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 999, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                          <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 10, fontWeight: 700, color: '#fff', background: '#7c3aed', padding: '2px 8px', borderRadius: 999 }}>✓ FRONT</div>
                        </div>
                      ) : (
                        <div style={{ aspectRatio: '3/4', borderRadius: 12, border: '2px dashed var(--b)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--ev)', cursor: 'pointer' }}>
                          <div style={{ fontSize: 28 }}>📦</div>
                          <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center' }}>Brand, name, price</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '80%' }}>
                            <button onClick={() => openScanCamera('front')} style={{ padding: '7px 0', borderRadius: 8, background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>📷 Camera</button>
                            <button onClick={() => scanFrontRef.current?.click()} style={{ padding: '7px 0', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Upload</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Back slot */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Back <span style={{ color: 'var(--tx3)', fontWeight: 400 }}>(optional)</span></div>
                      {scanBackThumb ? (
                        <div style={{ position: 'relative' }}>
                          <img src={scanBackThumb} alt="back" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 12, display: 'block', border: '2px solid #0891b2' }} />
                          <button onClick={() => { setScanBack(null); setScanBackThumb(null) }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 999, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                          <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 10, fontWeight: 700, color: '#fff', background: '#0891b2', padding: '2px 8px', borderRadius: 999 }}>✓ BACK</div>
                        </div>
                      ) : (
                        <div style={{ aspectRatio: '3/4', borderRadius: 12, border: '2px dashed var(--b)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--ev)', cursor: 'pointer' }}>
                          <div style={{ fontSize: 28 }}>🏷️</div>
                          <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center' }}>Expiry, batch, supplier</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '80%' }}>
                            <button onClick={() => openScanCamera('back')} style={{ padding: '7px 0', borderRadius: 8, background: '#0891b2', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>📷 Camera</button>
                            <button onClick={() => scanBackRef.current?.click()} style={{ padding: '7px 0', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Upload</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* What Claude will extract */}
                  {!scanFront && (
                    <div style={{ background: 'var(--ev)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>Claude will auto-fill:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {['Name', 'Brand', 'Category', 'SKU/Barcode', 'Price'].map(f => (
                          <span key={f} style={{ fontSize: 11, color: ACC, background: ACC_BG, padding: '2px 8px', borderRadius: 999 }}>{f}</span>
                        ))}
                        <span style={{ fontSize: 11, color: '#0891b2', background: 'rgba(8,145,178,.08)', padding: '2px 8px', borderRadius: 999 }}>Expiry date</span>
                        <span style={{ fontSize: 11, color: '#0891b2', background: 'rgba(8,145,178,.08)', padding: '2px 8px', borderRadius: 999 }}>Batch no.</span>
                        <span style={{ fontSize: 11, color: '#0891b2', background: 'rgba(8,145,178,.08)', padding: '2px 8px', borderRadius: 999 }}>Supplier</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 8 }}>Blue fields come from the back label</div>
                    </div>
                  )}

                  {/* Scan button */}
                  <button
                    onClick={runFullScan}
                    disabled={!scanFront || scanning}
                    style={{ width: '100%', padding: '14px', borderRadius: 12, background: scanFront ? '#7c3aed' : 'var(--b)', color: scanFront ? '#fff' : 'var(--tx3)', border: 'none', fontSize: 15, fontWeight: 700, cursor: scanFront ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all .2s' }}
                  >
                    {scanning ? '⏳ Reading product...' : scanFront ? `✨ Scan & fill form${scanBack ? ' (front + back)' : ' (front only)'}` : 'Take front photo first'}
                  </button>
                  {scanFront && !scanBack && (
                    <div style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center', marginTop: 8 }}>
                      Add the back photo to also get expiry date, batch number and supplier
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── In-app camera for scan modal ── */}
            {scanCameraOpen && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.95)', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 12, opacity: 0.8 }}>
                  {scanStep === 'front' ? '📦 Point at the FRONT of the product' : '🏷️ Point at the BACK of the product'}
                </div>
                <video ref={scanVideoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 500, borderRadius: 14, marginBottom: 16, border: `3px solid ${scanStep === 'front' ? '#7c3aed' : '#0891b2'}` }} />
                <canvas ref={scanCanvasRef} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={captureScanPhoto} style={{ padding: '14px 32px', borderRadius: 12, background: scanStep === 'front' ? '#7c3aed' : '#0891b2', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    📸 Capture
                  </button>
                  <button onClick={closeScanCamera} style={{ padding: '14px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Camera preview modal */}
            {showCameraPreview && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 600, borderRadius: 12, marginBottom: 16 }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={handleCapturePhoto} disabled={recognizing} style={{ ...btnPrimary, padding: '12px 28px', fontSize: 14, fontWeight: 700 }}>{recognizing ? 'Processing...' : 'Capture photo'}</button>
                  <button onClick={handleCloseCamera} disabled={recognizing} style={{ padding: '12px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Camera match result modal */}
            {recognizedProducts.length > 0 && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setRecognizedProducts([])}>
                <div style={{ background: 'var(--sf)', borderRadius: 16, padding: 24, maxWidth: 450, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                  {recognizedProducts[0]?.matched ? (
                    // ── Matched: Existing product in inventory ──
                    <>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', marginBottom: 12, marginTop: 0 }}>✓ Product found</h3>
                      <div style={{ background: 'var(--ev)', padding: 16, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 8 }}>{recognizedProducts[0].name}</div>
                        <div style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 4 }}>Sale price: {fmt(currencySymbol, recognizedProducts[0].sale_price || 0)}</div>
                        <div style={{ fontSize: 12, color: recognizedProducts[0].stock_qty > 0 ? GREEN : RED, fontWeight: 600 }}>
                          Stock: {recognizedProducts[0].stock_qty} {recognizedProducts[0].unit || 'items'}
                        </div>
                      </div>
                      <button onClick={() => setRecognizedProducts([])} style={{ ...btnPrimary, width: '100%' }}>Close</button>
                    </>
                  ) : (
                    // ── Unmatched: New product to add ──
                    <>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', marginBottom: 12, marginTop: 0 }}>Add new product</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Product name (from recognition) */}
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>Product name</label>
                          <input type="text" value={recognizedProducts[0]?.name || ''} disabled style={{ ...inputStyle, width: '100%', background: 'var(--ev)', opacity: 0.6 }} />
                          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4 }}>Auto-recognized from image</div>
                        </div>

                        {/* Sale price */}
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>Sale price</label>
                          <input type="number" placeholder="0.00" value={editingRecognizedData.sale_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, sale_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
                        </div>

                        {/* Cost price */}
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>Cost price (optional)</label>
                          <input type="number" placeholder="0.00" value={editingRecognizedData.cost_price || ''} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, cost_price: e.target.value })} style={{ ...inputStyle, width: '100%' }} step="0.01" />
                        </div>

                        {/* Stock qty */}
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>Starting stock</label>
                          <input type="number" value={editingRecognizedData.stock_qty || '1'} onChange={(e) => setEditingRecognizedData({ ...editingRecognizedData, stock_qty: e.target.value })} style={{ ...inputStyle, width: '100%' }} min="1" />
                        </div>

                        {/* Margin preview */}
                        {editingRecognizedData.cost_price && editingRecognizedData.sale_price && (
                          <div style={{ background: 'var(--ev)', padding: 10, borderRadius: 8, fontSize: 11 }}>
                            <div style={{ color: 'var(--tx2)', marginBottom: 2 }}>Margin: <strong style={{ color: 'var(--acc)' }}>{((parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)) / parseFloat(editingRecognizedData.sale_price || 1) * 100).toFixed(1)}%</strong></div>
                            <div style={{ color: 'var(--tx3)' }}>Profit: {(parseFloat(editingRecognizedData.sale_price) - parseFloat(editingRecognizedData.cost_price || 0)).toFixed(2)}</div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                        <button onClick={async () => {
                          if (!editingRecognizedData.sale_price) { notify('Sale price required', false); return }
                          setAddingProduct(true)
                          try {
                            const res = await fetch('/api/pos/inventory', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name: recognizedProducts[0]?.name,
                                sale_price: parseFloat(editingRecognizedData.sale_price),
                                cost_price: editingRecognizedData.cost_price ? parseFloat(editingRecognizedData.cost_price) : 0,
                                stock_qty: parseInt(editingRecognizedData.stock_qty || '1'),
                                low_stock_threshold: 5,
                              })
                            })
                            const data = await res.json()
                            if (data.product) {
                              setInventory(prev => [...prev, data.product])
                              notify(`${data.product.name} added`)
                              setRecognizedProducts([])
                              setEditingRecognizedData({})
                            } else {
                              notify(data.error || 'Failed to add', false)
                            }
                          } catch (err) {
                            notify('Failed to add product', false)
                          }
                          setAddingProduct(false)
                        }} disabled={!editingRecognizedData.sale_price || addingProduct} style={{ ...btnPrimary, flex: 1, opacity: !editingRecognizedData.sale_price || addingProduct ? 0.5 : 1 }}>{addingProduct ? 'Adding...' : 'Add to inventory'}</button>
                        <button onClick={() => { setRecognizedProducts([]); setEditingRecognizedData({}) }} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}


            {/* Bulk CSV import */}
            {showBulkImport && (
              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Bulk import from CSV</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10 }}>Format: <code>name, price, stock_qty, unit</code> (one product per line)</div>
                <input ref={csvInputRef} type="file" accept=".csv,.txt" onChange={handleCsvFile} style={{ display: 'none' }} />
                <button onClick={() => csvInputRef.current?.click()} style={{ ...btnSecondary, marginBottom: 8, fontSize: 12 }}>Choose CSV file</button>
                <textarea value={bulkCsv} onChange={e => setBulkCsv(e.target.value)} placeholder={"Hair Gel, 250, 100, item\nShampoo, 500, 50, bottle"} rows={5} style={{ ...inputStyle, width: '100%', resize: 'vertical', marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleBulkImport} disabled={importingBulk || !bulkCsv.trim()} style={{ ...btnPrimary, opacity: !bulkCsv.trim() ? 0.5 : 1 }}>{importingBulk ? 'Importing...' : 'Import products'}</button>
                  <button onClick={() => { setShowBulkImport(false); setBulkCsv('') }} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Add product form */}
            {showAddProduct && (
              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New product</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input placeholder="Product name" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, gridColumn: '1/-1' }} />
                  <input placeholder="Sale price" type="number" value={newProduct.sale_price} onChange={e => setNewProduct(p => ({ ...p, sale_price: e.target.value }))} style={inputStyle} />
                  <input placeholder="Cost price (optional)" type="number" value={newProduct.cost_price} onChange={e => setNewProduct(p => ({ ...p, cost_price: e.target.value }))} style={inputStyle} />
                  <input placeholder="Starting stock qty" type="number" value={newProduct.stock_qty} onChange={e => setNewProduct(p => ({ ...p, stock_qty: e.target.value }))} style={inputStyle} />
                  <input placeholder="Low stock alert at" type="number" value={newProduct.low_stock_threshold} onChange={e => setNewProduct(p => ({ ...p, low_stock_threshold: e.target.value }))} style={inputStyle} />
                  <select value={newProduct.unit} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))} style={inputStyle}>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="l">Litres (l)</option>
                    <option value="ml">Millilitres (ml)</option>
                    <option value="m">Metres (m)</option>
                    <option value="box">Boxes</option>
                    <option value="pack">Packs</option>
                    <option value="bag">Bags</option>
                    <option value="bottle">Bottles</option>
                    <option value="tin">Tins</option>
                    <option value="dozen">Dozen</option>
                  </select>
                  <input placeholder="SKU / barcode (optional)" value={newProduct.sku} onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))} style={inputStyle} />
                  <input placeholder="Category (e.g. Oils)" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} style={inputStyle} />
                  <input placeholder="Brand" value={newProduct.brand} onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))} style={inputStyle} />
                  <input placeholder="Supplier" value={newProduct.supplier} onChange={e => setNewProduct(p => ({ ...p, supplier: e.target.value }))} style={inputStyle} />
                  <input placeholder="Batch / lot number" value={newProduct.batch_number} onChange={e => setNewProduct(p => ({ ...p, batch_number: e.target.value }))} style={inputStyle} />
                  <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600 }}>Expiry date (optional)</label>
                    <input type="date" value={newProduct.expiry_date} onChange={e => setNewProduct(p => ({ ...p, expiry_date: e.target.value }))} style={inputStyle} />
                  </div>
                  {selectedSector !== 'all' ? (
                    <div style={{ gridColumn: '1/-1', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--ev)', fontSize: 12, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#d08a59', background: 'rgba(208,138,89,.12)', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase' }}>
                        {selectedSector}
                      </span>
                      <span>This item will be tagged to the <strong>{selectedSector}</strong> sector only.</span>
                    </div>
                  ) : (
                    <select value={newProduct.sector} onChange={e => setNewProduct(p => ({ ...p, sector: e.target.value }))} style={{ ...inputStyle, gridColumn: '1/-1' }}>
                      <option value="">All sectors (shared item)</option>
                      <option value="retail">🛒 Retail only</option>
                      <option value="repair">🔧 Repair only</option>
                      <option value="factory">🏭 Factory only</option>
                      <option value="restaurant">🍴 Restaurant only</option>
                      <option value="logistics">🚚 Logistics only</option>
                      <option value="salon">💇 Salon only</option>
                    </select>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={handleAddProduct} disabled={addingProduct} style={btnPrimary}>{addingProduct ? 'Adding...' : 'Add product'}</button>
                  <button onClick={() => setShowAddProduct(false)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Edit product modal */}
            {editingProduct && (
              <div style={{ ...cardStyle, marginBottom: 16, border: `1px solid ${ACC}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Edit {editingProduct.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input placeholder="Name" value={editProduct.name} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, gridColumn: '1/-1' }} />
                  <input placeholder="Sale price" type="number" value={editProduct.sale_price} onChange={e => setEditProduct(p => ({ ...p, sale_price: e.target.value }))} style={inputStyle} />
                  <input placeholder="Cost price" type="number" value={editProduct.cost_price} onChange={e => setEditProduct(p => ({ ...p, cost_price: e.target.value }))} style={inputStyle} />
                  <input placeholder="Stock qty" type="number" value={editProduct.stock_qty} onChange={e => setEditProduct(p => ({ ...p, stock_qty: e.target.value }))} style={inputStyle} />
                  <input placeholder="Low stock threshold" type="number" value={editProduct.low_stock_threshold} onChange={e => setEditProduct(p => ({ ...p, low_stock_threshold: e.target.value }))} style={inputStyle} />
                  <select value={editProduct.unit} onChange={e => setEditProduct(p => ({ ...p, unit: e.target.value }))} style={inputStyle}>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="l">Litres (l)</option>
                    <option value="ml">Millilitres (ml)</option>
                    <option value="m">Metres (m)</option>
                    <option value="box">Boxes</option>
                    <option value="pack">Packs</option>
                    <option value="bag">Bags</option>
                    <option value="bottle">Bottles</option>
                    <option value="tin">Tins</option>
                    <option value="dozen">Dozen</option>
                  </select>
                  <input placeholder="Category (e.g. Oils)" value={editProduct.category} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))} style={inputStyle} />
                  <input placeholder="Brand" value={editProduct.brand} onChange={e => setEditProduct(p => ({ ...p, brand: e.target.value }))} style={inputStyle} />
                  <input placeholder="Supplier" value={editProduct.supplier} onChange={e => setEditProduct(p => ({ ...p, supplier: e.target.value }))} style={inputStyle} />
                  <input placeholder="Batch / lot number" value={editProduct.batch_number} onChange={e => setEditProduct(p => ({ ...p, batch_number: e.target.value }))} style={inputStyle} />
                  <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600 }}>Expiry date</label>
                    <input type="date" value={editProduct.expiry_date} onChange={e => setEditProduct(p => ({ ...p, expiry_date: e.target.value }))} style={inputStyle} />
                  </div>
                  <select value={editProduct.sector} onChange={e => setEditProduct(p => ({ ...p, sector: e.target.value }))} style={{ ...inputStyle, gridColumn: '1/-1' }}>
                    <option value="">All sectors (shared item)</option>
                    <option value="retail">🛒 Retail only</option>
                    <option value="repair">🔧 Repair only</option>
                    <option value="factory">🏭 Factory only</option>
                    <option value="restaurant">🍴 Restaurant only</option>
                    <option value="logistics">🚚 Logistics only</option>
                    <option value="salon">💇 Salon only</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={handleEditProduct} disabled={editingProductSubmitting} style={btnPrimary}>{editingProductSubmitting ? 'Saving...' : 'Save'}</button>
                  <button onClick={() => setEditingProduct(null)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Inventory table */}
            {filteredInventory.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: ACC_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{invSearch || invCategory !== 'all' ? 'No matching products' : 'No products yet'}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{invSearch || invCategory !== 'all' ? 'Try a different search or category.' : 'Add your first product above or scan items with the camera.'}</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 70px 110px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  <span>Product</span><span style={{ textAlign: 'right' }}>Price</span><span style={{ textAlign: 'right' }}>Cost</span><span style={{ textAlign: 'right' }}>Stock</span><span style={{ textAlign: 'right' }}>Actions</span>
                </div>
                {filteredInventory.map((item, i) => {
                  const isOut = item.stock_qty === 0
                  const isLow = !isOut && item.stock_qty <= item.low_stock_threshold
                  const profitPer = item.sale_price - (item.cost_price || 0)
                  const today = new Date(); today.setHours(0,0,0,0)
                  const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null
                  const daysToExpiry = expiryDate ? Math.floor((expiryDate.getTime() - today.getTime()) / 86400000) : null
                  const isExpired = daysToExpiry !== null && daysToExpiry < 0
                  const isExpiringSoon = daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 30
                  return (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 70px 110px', padding: '12px 16px', borderTop: i === 0 ? 'none' : '1px solid var(--b)', background: isExpired ? 'rgba(220,38,38,.03)' : 'var(--sf)', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>
                          {item.name}
                          {isOut && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: RED, background: 'rgba(220,38,38,.08)', padding: '1px 6px', borderRadius: 9999 }}>OUT</span>}
                          {isLow && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: AMBER, background: 'rgba(234,179,8,.08)', padding: '1px 6px', borderRadius: 9999 }}>LOW</span>}
                          {isExpired && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: RED, background: 'rgba(220,38,38,.1)', padding: '1px 6px', borderRadius: 9999 }}>EXPIRED</span>}
                          {isExpiringSoon && !isExpired && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: AMBER, background: 'rgba(234,179,8,.1)', padding: '1px 6px', borderRadius: 9999 }}>EXP {daysToExpiry === 0 ? 'TODAY' : `${daysToExpiry}d`}</span>}
                        </div>
                        {item.location?.name && selectedLocation === 'all' && locations.length > 1 && <div style={{ fontSize: 10, color: ACC, fontWeight: 600 }}>{item.location.name}</div>}
                        {item.sku && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>SKU: {item.sku}</div>}
                        {(item.brand || item.supplier) && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{[item.brand, item.supplier].filter(Boolean).join(' · ')}</div>}
                        {item.sector && <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', background: 'var(--b)', padding: '1px 6px', borderRadius: 9999, display: 'inline-block', marginTop: 2, textTransform: 'capitalize' }}>{item.sector}</div>}
                        {expiryDate && !isExpired && !isExpiringSoon && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Exp {expiryDate.toLocaleDateString('en-GB')}</div>}
                        {item.last_sold_at && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Last sold {new Date(item.last_sold_at).toLocaleDateString('en-GB')}</div>}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', textAlign: 'right' }}>{fmt(currencySymbol, item.sale_price)}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx3)' }}>{fmt(currencySymbol, item.cost_price || 0)}</div>
                        {profitPer > 0 && <div style={{ fontSize: 10, color: GREEN }}>+{fmt(currencySymbol, profitPer)}</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {restockId === item.id ? (
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                            <input value={restockQty} onChange={e => setRestockQty(e.target.value.replace(/\D/g, ''))} placeholder="qty" style={{ ...inputStyle, width: 50, padding: '4px 6px', fontSize: 12, textAlign: 'center' }} autoFocus onKeyDown={e => { if (e.key === 'Enter') handleRestock(item.id); if (e.key === 'Escape') setRestockId(null) }} />
                            <button onClick={() => handleRestock(item.id)} style={{ padding: '4px 6px', borderRadius: 4, background: GREEN, color: '#fff', border: 'none', fontSize: 10, cursor: 'pointer' }}>+</button>
                          </div>
                        ) : (
                          <div onClick={() => { setRestockId(item.id); setRestockQty('') }} style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', cursor: 'pointer' }} title="Click to restock">
                            {item.stock_qty}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => { setEditingProduct(item); setEditProduct({ name: item.name, sale_price: item.sale_price.toString(), cost_price: (item.cost_price || 0).toString(), stock_qty: item.stock_qty.toString(), low_stock_threshold: item.low_stock_threshold.toString(), category: item.category || '', sector: item.sector || '', expiry_date: item.expiry_date || '', batch_number: item.batch_number || '', supplier: item.supplier || '', brand: item.brand || '', unit: item.unit || 'pcs' }) }} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }}>Edit</button>
                        <button onClick={() => handleDeleteProduct(item)} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: 'rgba(220,38,38,.08)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: RED }}>Remove</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ BRANCHES TAB ══════════════ */}
        {tab === 'branches' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{locations.length} branch{locations.length !== 1 ? 'es' : ''}</div>
              <button onClick={() => {
                const name = prompt('Branch name (e.g. "Downtown", "Mall Branch"):')
                if (!name?.trim()) return
                fetch('/api/pos/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim() }) })
                  .then(r => r.json()).then(d => { if (d.location) { setLocations(prev => [...prev, d.location]); notify(`${d.location.name} created`) } else { notify(d.error || 'Failed', false) } })
              }} style={btnPrimary}>+ Add branch</button>
            </div>
            {locations.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>No branches yet</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Add your first branch to start managing multiple locations.</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                {locations.map((loc, i) => (
                  <div key={loc.id} style={{ padding: '14px 16px', borderBottom: i < locations.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {loc.name}
                        {!loc.is_active && <span style={{ fontSize: 10, color: RED, fontWeight: 700 }}>INACTIVE</span>}
                      </div>
                      {loc.address && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{loc.address}</div>}
                      {loc.phone && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{loc.phone}</div>}
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>
                        {selectedSector === 'all'
                          ? `${staff.filter(s => s.location_id === loc.id).length} staff · ${inventory.filter(p => p.location_id === loc.id).length} products`
                          : `${staff.filter(s => s.location_id === loc.id && (s.sector || 'retail') === selectedSector).length} ${selectedSector} staff · ${completedTx.filter(t => t.cashier?.id && staff.find(s => s.id === t.cashier!.id && s.location_id === loc.id)).length} sales`
                        }
                      </div>
                    </div>
                    <button onClick={() => {
                      const newName = prompt('Rename branch:', loc.name)
                      if (!newName?.trim() || newName.trim() === loc.name) return
                      fetch('/api/pos/locations', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: loc.id, name: newName.trim() }) })
                        .then(r => r.json()).then(d => { if (d.location) { setLocations(prev => prev.map(l => l.id === loc.id ? d.location : l)); notify('Branch renamed') } else { notify(d.error || 'Failed', false) } })
                    }} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)' }}>Edit</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ AUDIT TAB ══════════════ */}
        {tab === 'audit' && (
          <AuditTab
            selectedSector={selectedSector}
            currencySymbol={currencySymbol}
            onBack={() => handleSetTab('services')}
          />
        )}

        {/* ══════════════ DEDICATED SECTOR ANALYTICS TABS ══════════════ */}
        {tab === 'restaurant' && (
          <RestaurantTab
            currencySymbol={currencySymbol}
            selectedLocation={selectedLocation}
            transactions={sectorTransactions}
            staff={filteredStaff}
            inventory={sectorFilteredInventory}
          />
        )}
        {tab === 'repair' && (
          <RepairTab
            currencySymbol={currencySymbol}
            selectedLocation={selectedLocation}
            transactions={sectorTransactions}
            staff={filteredStaff}
            inventory={sectorFilteredInventory}
          />
        )}
        {tab === 'salon' && (
          <SalonTab
            currencySymbol={currencySymbol}
            selectedLocation={selectedLocation}
            transactions={sectorTransactions}
            staff={filteredStaff}
            inventory={sectorFilteredInventory}
          />
        )}
        {tab === 'retail' && (
          <RetailTab
            currencySymbol={currencySymbol}
            selectedLocation={selectedLocation}
            transactions={sectorTransactions}
            staff={filteredStaff}
            inventory={sectorFilteredInventory}
          />
        )}
        {tab === 'payments' && (
          <PaymentsTab
            currencySymbol={currencySymbol}
            staff={staff}
          />
        )}
        {tab === 'factory' && (
          <FactoryTab
            currencySymbol={currencySymbol}
            selectedLocation={selectedLocation}
            transactions={sectorTransactions}
            staff={filteredStaff}
            inventory={sectorFilteredInventory}
          />
        )}

        {tab === 'map' && (
          <div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, color: 'var(--tx3)' }}>
                {geoPoints.length > 0
                  ? `${geoPoints.length} geo-tagged sale${geoPoints.length !== 1 ? 's' : ''} in this period`
                  : 'No geo-tagged sales in this period — cashiers must allow location access when checking out'}
              </div>
            </div>
            <div style={{ position: 'relative', height: 520, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--b)' }}>
              <div ref={mapDivRef} style={{ position: 'absolute', inset: 0 }} />
              {geoPoints.length === 0 && (
                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 20 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>No pins yet for this period</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Cashiers must allow location access when checking out</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ FACTORY CAPTURES TAB ══════════════ */}
        {tab === 'captures' && (
          <div style={{ maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>📷 Production Captures</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>All intake, output, wastage and dispatch records</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
            </div>
            {factoryLoading
              ? <div style={{ color: 'var(--tx3)', fontSize: 13, padding: 24, textAlign: 'center' }}>Loading captures…</div>
              : factoryCaptures.length === 0
                ? <div style={{ color: 'var(--tx3)', fontSize: 13, padding: 24, textAlign: 'center' }}>No captures yet. Floor workers submit captures via the POS app.</div>
                : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--b)' }}>
                          {['Date', 'Type', 'Product', 'Batch', 'Qty', 'Captured by', 'Status', 'Approved by'].map(h => (
                            <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {factoryCaptures.map((c: any) => {
                          const typeColor: Record<string, string> = { intake: '#2563eb', output: '#16a34a', wastage: '#dc2626', dispatch: '#9333ea' }
                          const statusColor: Record<string, string> = { approved: '#16a34a', rejected: '#dc2626', pending: '#d97706' }
                          return (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--b)' }}>
                              <td style={{ padding: '8px 10px', color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                              <td style={{ padding: '8px 10px' }}><span style={{ fontSize: 11, fontWeight: 700, color: typeColor[c.type] || 'var(--tx)', background: `${typeColor[c.type] || '#666'}18`, padding: '2px 8px', borderRadius: 9999, textTransform: 'capitalize' }}>{c.type}</span></td>
                              <td style={{ padding: '8px 10px' }}>{c.product_name || '—'}</td>
                              <td style={{ padding: '8px 10px', color: 'var(--tx3)' }}>{c.batch_ref || '—'}</td>
                              <td style={{ padding: '8px 10px' }}>{c.quantity ?? '—'}</td>
                              <td style={{ padding: '8px 10px' }}>{c.captured_by_staff?.name || '—'}</td>
                              <td style={{ padding: '8px 10px' }}><span style={{ fontSize: 11, fontWeight: 700, color: statusColor[c.status], background: `${statusColor[c.status]}18`, padding: '2px 8px', borderRadius: 9999, textTransform: 'capitalize' }}>{c.status}</span></td>
                              <td style={{ padding: '8px 10px', color: 'var(--tx3)' }}>{c.approved_by_staff?.name || '—'}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
          </div>
        )}

        {/* ══════════════ FACTORY APPROVALS TAB ══════════════ */}
        {tab === 'approvals' && (
          <div style={{ maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>✅ Pending Approvals</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Captures awaiting supervisor sign-off</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
            </div>
            {factoryLoading
              ? <div style={{ color: 'var(--tx3)', fontSize: 13, padding: 24, textAlign: 'center' }}>Loading…</div>
              : (() => {
                  const pending = factoryCaptures.filter((c: any) => c.status === 'pending')
                  if (pending.length === 0) return (
                    <div style={{ color: 'var(--tx3)', fontSize: 13, padding: 24, textAlign: 'center' }}>No pending approvals — all captures are reviewed.</div>
                  )
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {pending.map((c: any) => {
                        const typeColor: Record<string, string> = { intake: '#2563eb', output: '#16a34a', wastage: '#dc2626', dispatch: '#9333ea' }
                        return (
                          <div key={c.id} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            {c.photo_url && <img src={c.photo_url} alt="capture" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--b)' }} />}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: typeColor[c.type] || 'var(--tx)', background: `${typeColor[c.type] || '#666'}18`, padding: '2px 8px', borderRadius: 9999, textTransform: 'capitalize' }}>{c.type}</span>
                                {c.batch_ref && <span style={{ fontSize: 11, color: 'var(--tx3)' }}>Batch: {c.batch_ref}</span>}
                                {c.quantity != null && <span style={{ fontSize: 11, color: 'var(--tx3)' }}>Qty: {c.quantity}</span>}
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.product_name || 'Unlabelled capture'}</div>
                              {c.notes && <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>{c.notes}</div>}
                              <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>
                                Submitted by {c.captured_by_staff?.name || 'staff'} · {new Date(c.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                              <button
                                onClick={async () => {
                                  await fetch('/api/pos/factory/capture', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, status: 'approved' }) })
                                  setFactoryCaptures(prev => prev.map(x => x.id === c.id ? { ...x, status: 'approved' } : x))
                                  notify('Capture approved')
                                }}
                                style={{ fontSize: 12, fontWeight: 600, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>
                                Approve
                              </button>
                              <button
                                onClick={async () => {
                                  const reason = prompt('Rejection reason (optional):') || ''
                                  await fetch('/api/pos/factory/capture', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, status: 'rejected', rejection_reason: reason }) })
                                  setFactoryCaptures(prev => prev.map(x => x.id === c.id ? { ...x, status: 'rejected' } : x))
                                  notify('Capture rejected', false)
                                }}
                                style={{ fontSize: 12, fontWeight: 600, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>
                                Reject
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()
            }
          </div>
        )}

        {/* ══════════════ LOGISTICS TAB ══════════════ */}
        {tab === 'logistics' && (() => {
          const TEAL = '#0891b2'
          const LP = logParcels
          const today = new Date(); today.setHours(0, 0, 0, 0)
          const todayP = LP.filter((p: any) => new Date(p.created_at) >= today)
          const inTransit = LP.filter((p: any) => ['in_transit', 'out_for_delivery'].includes(p.status))
          const atBranch = LP.filter((p: any) => ['received', 'at_branch', 'assigned', 'loaded', 'at_destination'].includes(p.status))
          const delivered = LP.filter((p: any) => ['delivered', 'collected'].includes(p.status))
          const failed = LP.filter((p: any) => p.status === 'failed_delivery')
          const completedAll = delivered.length + failed.length
          const deliveryRate = completedAll > 0 ? Math.round((delivered.length / completedAll) * 100) : 0
          const totalRev = LP.reduce((s: number, p: any) => s + (p.fee_charged || 0), 0)
          const todayRev = todayP.reduce((s: number, p: any) => s + (p.fee_charged || 0), 0)
          const unpaid = LP.filter((p: any) => p.payment_status === 'unpaid').reduce((s: number, p: any) => s + (p.fee_charged || 0), 0)

          const statusBreak = Object.entries(
            LP.reduce<Record<string, number>>((a: any, p: any) => { a[p.status] = (a[p.status] || 0) + 1; return a }, {})
          ).sort((a: any, b: any) => b[1] - a[1])

          const SL: Record<string, string> = { received: 'Received', at_branch: 'At Branch', assigned: 'Assigned', loaded: 'Loaded', in_transit: 'In Transit', at_destination: 'At Destination', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', collected: 'Collected', failed_delivery: 'Failed', returned: 'Returned' }
          const SC: Record<string, string> = { received: AMBER, at_branch: TEAL, assigned: TEAL, loaded: TEAL, in_transit: '#6366f1', at_destination: GREEN, out_for_delivery: '#6366f1', delivered: GREEN, collected: GREEN, failed_delivery: RED, returned: RED }

          const filteredParcels = LP.filter((p: any) => {
            if (logStatusFilter && p.status !== logStatusFilter) return false
            if (logSearch) {
              const q = logSearch.toLowerCase()
              return (p.tracking_number?.toLowerCase().includes(q) || p.sender_name?.toLowerCase().includes(q) || p.receiver_name?.toLowerCase().includes(q) || p.destination_city?.toLowerCase().includes(q))
            }
            return true
          })

          const byCity = Object.entries(
            LP.reduce<Record<string, { count: number; revenue: number }>>((acc: any, p: any) => {
              const city = p.destination_city || 'Unknown'
              if (!acc[city]) acc[city] = { count: 0, revenue: 0 }
              acc[city].count++; acc[city].revenue += p.fee_charged || 0
              return acc
            }, {})
          ).sort((a: any, b: any) => b[1].revenue - a[1].revenue)

          const trucksAvail = logTrucks.filter((t: any) => t.status === 'available').length
          const trucksTransit = logTrucks.filter((t: any) => t.status === 'in_transit').length
          const trucksMaint = logTrucks.filter((t: any) => t.status === 'maintenance').length

          const openParcel = (p: any) => {
            setLogSelectedParcel(p)
            setLogParcelPhotos([])
            setLogParcelPhotosLoading(true)
            fetch(`/api/pos/parcels/photos?parcel_id=${p.id}&limit=50`)
              .then(r => r.json())
              .then(d => setLogParcelPhotos(d.photos || []))
              .finally(() => setLogParcelPhotosLoading(false))
          }

          const PHOTO_LABELS: Record<string, string> = {
            pickup_proof: 'Pickup',
            delivery_proof: 'Delivered',
            delivery_video: 'Delivery Video',
            collection_proof: 'Collected',
            failed_delivery: 'Failed Delivery',
            checkpoint: 'Checkpoint',
            return: 'Returned',
            waybill: 'Waybill Scan',
            invoice: 'Invoice',
            receipt: 'Receipt',
          }
          const PHOTO_COLORS: Record<string, string> = {
            pickup_proof: '#6366f1',
            delivery_proof: GREEN,
            delivery_video: GREEN,
            collection_proof: GREEN,
            failed_delivery: RED,
            checkpoint: TEAL,
            return: RED,
            waybill: AMBER,
            invoice: AMBER,
            receipt: AMBER,
          }

          return (
            <div style={{ maxWidth: 900 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>🚛 Logistics Network</div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Parcels, fleet, routes & revenue across all branches</div>
                </div>
                <button onClick={() => { setLogLoading(true); Promise.all([fetch('/api/pos/parcels?limit=200').then(r=>r.json()),fetch('/api/pos/trucks').then(r=>r.json()),fetch('/api/pos/routes').then(r=>r.json())]).then(([p,t,r])=>{setLogParcels(p.parcels||[]);setLogTrucks(t.trucks||[]);setLogRoutes(r.routes||[])}).finally(()=>setLogLoading(false)) }} style={{ fontSize: 12, color: TEAL, background: `${TEAL}10`, border: `1px solid ${TEAL}30`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }}>↻ Refresh</button>
              </div>

              {logLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--tx3)' }}>Loading logistics data…</div>
              ) : (
                <>
                  {/* Sub-tabs */}
                  <div className="tab-strip" style={{ gap: 4, marginBottom: 16, borderBottom: '1px solid var(--b)' }}>
                    {(['overview', 'parcels', 'fleet', 'routes', 'revenue', 'drivers'] as const).map(st => (
                      <button key={st} onClick={() => setLogTab(st)} style={{ padding: '6px 14px', border: 'none', borderBottom: logTab === st ? `2px solid ${TEAL}` : '2px solid transparent', background: 'transparent', color: logTab === st ? TEAL : 'var(--tx3)', fontSize: 12, fontWeight: logTab === st ? 700 : 400, cursor: 'pointer', textTransform: 'capitalize', flexShrink: 0, whiteSpace: 'nowrap' }}>{st}</button>
                    ))}
                  </div>

                  {logTab === 'overview' && (() => {
                    const activeDrivers = Array.from(new Set(LP.filter((p: any) => p.driver?.id && ['in_transit','out_for_delivery','assigned','loaded'].includes(p.status)).map((p: any) => p.driver.id))).length
                    const avgRevPerParcel = LP.length > 0 ? Math.round(totalRev / LP.length) : 0
                    return (
                    <>
                      {/* Primary volume metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
                        {[{ l: 'Today', v: todayP.length, c: TEAL, s: 'parcels received' }, { l: 'In Transit', v: inTransit.length, c: '#6366f1', s: 'on the road' }, { l: 'At Branch', v: atBranch.length, c: AMBER, s: 'pending dispatch' }, { l: 'Delivered', v: delivered.length, c: GREEN, s: 'completed' }].map(k => (
                          <div key={k.l} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: '12px 14px' }}>
                            <div style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 500, marginBottom: 4 }}>{k.l}</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: k.c, lineHeight: 1 }}>{k.v}</div>
                            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 3 }}>{k.s}</div>
                          </div>
                        ))}
                      </div>
                      {/* Performance metrics — visually secondary */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
                        {[
                          { l: 'FADR', v: `${deliveryRate}%`, c: deliveryRate >= 85 ? GREEN : deliveryRate >= 70 ? AMBER : RED, s: 'first attempt rate' },
                          { l: 'Failed', v: failed.length, c: failed.length > 0 ? RED : 'var(--tx3)', s: failed.length > 0 ? 'need re-attempt' : 'none' },
                          { l: 'Active Drivers', v: activeDrivers, c: TEAL, s: 'on active runs' },
                          { l: 'Avg / Parcel', v: avgRevPerParcel > 0 ? `${currencySymbol}${avgRevPerParcel.toLocaleString()}` : '—', c: 'var(--tx)', s: 'avg revenue' },
                        ].map(k => (
                          <div key={k.l} style={{ background: 'var(--bg)', border: '1px dashed var(--b)', borderRadius: 10, padding: '10px 14px' }}>
                            <div style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 500, marginBottom: 4 }}>{k.l}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: k.c, lineHeight: 1 }}>{k.v}</div>
                            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 3 }}>{k.s}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💰 Revenue</div>
                          {[{ l: 'Today', v: todayRev, c: GREEN }, { l: 'Total', v: totalRev, c: 'var(--tx)' }, { l: 'Unpaid', v: unpaid, c: unpaid > 0 ? RED : 'var(--tx3)' }].map(r => (
                            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{r.l}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: r.c }}>{currencySymbol} {r.v.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🚛 Fleet</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[{ l: 'Available', v: trucksAvail, c: GREEN }, { l: 'In Transit', v: trucksTransit, c: '#6366f1' }, { l: 'Maintenance', v: trucksMaint, c: RED }].map(f => (
                              <div key={f.l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 4, background: f.c }} />
                                <span style={{ fontSize: 12, color: 'var(--tx3)', flex: 1 }}>{f.l}</span>
                                <span style={{ fontSize: 14, fontWeight: 800, color: f.c }}>{f.v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {statusBreak.length > 0 && (
                        <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📊 Status Breakdown</div>
                          {statusBreak.map(([st, count]: any) => (
                            <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: 4, background: SC[st] || '#888', flexShrink: 0 }} />
                              <span style={{ flex: 1, fontSize: 12, color: 'var(--tx3)' }}>{SL[st] || st}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{count}</span>
                              <div style={{ width: 80, height: 6, background: 'var(--b)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min((count / LP.length) * 100, 100)}%`, height: '100%', background: SC[st] || '#888', borderRadius: 3 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recent parcels */}
                      <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🕒 Recent Parcels</div>
                        {LP.slice(0, 10).map((p: any) => (
                          <div key={p.id} onClick={() => openParcel(p)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 4px', borderBottom: '1px solid var(--b)', cursor: 'pointer', borderRadius: 6, transition: 'background 120ms' }}
                            onMouseEnter={e => { (e.currentTarget.style as any).background = `${TEAL}08` }} onMouseLeave={e => { (e.currentTarget.style as any).background = 'transparent' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>{p.tracking_number}</span>
                            <span style={{ flex: 1, fontSize: 11, color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.receiver_name || p.destination_city || '—'}</span>
                            <span style={{ background: `${SC[p.status] || '#888'}18`, color: SC[p.status] || '#888', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{SL[p.status] || p.status}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                          </div>
                        ))}
                        {LP.length === 0 && <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center', padding: 16 }}>No parcels yet</div>}
                      </div>
                    </>
                  )
                  })()}

                  {logTab === 'parcels' && (
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <input value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Search tracking, name, city…" style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--b)', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
                        <select value={logStatusFilter} onChange={e => setLogStatusFilter(e.target.value)} style={{ padding: '8px 10px', border: '1px solid var(--b)', borderRadius: 8, fontSize: 12, fontFamily: 'inherit' }}>
                          <option value="">All statuses</option>
                          {Object.entries(SL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>{filteredParcels.length} parcels</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 500, overflowY: 'auto' }}>
                        {filteredParcels.map((p: any) => (
                          <div key={p.id} onClick={() => openParcel(p)} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: 10, cursor: 'pointer', transition: 'border-color 150ms' }}
                            onMouseEnter={e => { (e.currentTarget.style as any).borderColor = TEAL }} onMouseLeave={e => { (e.currentTarget.style as any).borderColor = 'var(--b)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{p.tracking_number}</span>
                              <span style={{ marginLeft: 'auto', background: `${SC[p.status] || '#888'}18`, color: SC[p.status] || '#888', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{SL[p.status] || p.status}</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>
                              <div>{p.sender_name || '—'} → {p.receiver_name || '—'}</div>
                              <div>📍 {p.destination_city || '—'} {p.weight_kg ? `· ${p.weight_kg}kg` : ''}</div>
                              {p.fee_charged ? <div>💰 {currencySymbol} {p.fee_charged.toLocaleString()} · {p.payment_status || '—'}</div> : null}
                              {p.truck && <div>🚛 {p.truck.plate_number} {p.driver ? `· ${p.driver.name}` : ''}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {logTab === 'fleet' && (
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>{logTrucks.length} trucks</div>
                      {logTrucks.map((t: any) => {
                        const st = t.status === 'available' ? { bg: `${GREEN}18`, color: GREEN, label: 'Available' } : t.status === 'in_transit' ? { bg: '#6366f118', color: '#6366f1', label: 'In Transit' } : { bg: `${RED}18`, color: RED, label: t.status === 'maintenance' ? 'Maintenance' : t.status }
                        const tp = LP.filter((p: any) => p.truck?.id === t.id && ['assigned', 'loaded', 'in_transit'].includes(p.status))
                        return (
                          <div key={t.id} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 14, fontWeight: 800 }}>{t.plate_number}</span>
                              {t.make_model && <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{t.make_model}</span>}
                              {t.branch && <span style={{ fontSize: 10, color: 'var(--tx3)' }}>📍 {t.branch.name}</span>}
                              <span style={{ marginLeft: 'auto', background: st.bg, color: st.color, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{st.label}</span>
                            </div>
                            {tp.length > 0 && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>📦 {tp.length} active parcel{tp.length !== 1 ? 's' : ''}</div>}
                          </div>
                        )
                      })}
                      {logTrucks.length === 0 && <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No trucks registered</div>}
                    </div>
                  )}

                  {logTab === 'routes' && (
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>{logRoutes.length} routes</div>
                      {logRoutes.map((r: any) => (
                        <div key={r.id} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.name || `${r.origin?.name || '—'} → ${r.destination?.name || '—'}`}</div>
                          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--tx3)' }}>
                            {r.distance_km && <span>📏 {r.distance_km} km</span>}
                            {r.estimated_hours && <span>⏱️ {r.estimated_hours}h</span>}
                            {r.price_per_kg > 0 && <span>💰 {currencySymbol} {r.price_per_kg}/kg</span>}
                            {r.flat_rate > 0 && <span>📦 {currencySymbol} {r.flat_rate} flat</span>}
                          </div>
                        </div>
                      ))}
                      {logRoutes.length === 0 && <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No routes configured</div>}
                    </div>
                  )}

                  {logTab === 'revenue' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📈 By Period</div>
                          {[{ l: 'Today', p: todayP }, { l: 'Last 7d', p: LP.filter((p: any) => new Date(p.created_at) >= new Date(Date.now() - 7*86400000)) }, { l: 'This month', p: LP.filter((p: any) => { const d = new Date(p.created_at); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }) }, { l: 'All time', p: LP }].map(r => (
                            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{r.l} <span style={{ fontSize: 10 }}>({r.p.length})</span></span>
                              <span style={{ fontSize: 12, fontWeight: 700 }}>{currencySymbol} {r.p.reduce((s: number, p: any) => s + (p.fee_charged || 0), 0).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>💳 Payment Status</div>
                          {[{ l: 'Paid', f: 'paid', c: GREEN }, { l: 'Unpaid', f: 'unpaid', c: RED }, { l: 'Partial', f: 'partial', c: AMBER }].map(ps => {
                            const filtered = LP.filter((p: any) => p.payment_status === ps.f)
                            return (
                              <div key={ps.l} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 4, background: ps.c }} />
                                <span style={{ flex: 1, fontSize: 12, color: 'var(--tx3)' }}>{ps.l} ({filtered.length})</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: ps.c }}>{currencySymbol} {filtered.reduce((s: number, p: any) => s + (p.fee_charged || 0), 0).toLocaleString()}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🗺️ Revenue by Destination</div>
                        {byCity.map(([city, data]: any) => (
                          <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ flex: 1, fontSize: 12, color: 'var(--tx3)' }}>{city}</span>
                            <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{data.count} pkgs</span>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>{currencySymbol} {data.revenue.toLocaleString()}</span>
                          </div>
                        ))}
                        {byCity.length === 0 && <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center', padding: 16 }}>No data yet</div>}
                      </div>
                    </div>
                  )}

                  {logTab === 'drivers' && (() => {
                    const driverMap: Record<string, { name: string; total: number; delivered: number; failed: number; inProgress: number; revenue: number }> = {}
                    for (const p of LP) {
                      const dId = p.driver?.id
                      if (!dId) continue
                      if (!driverMap[dId]) driverMap[dId] = { name: p.driver.name || 'Unknown', total: 0, delivered: 0, failed: 0, inProgress: 0, revenue: 0 }
                      driverMap[dId].total++
                      if (['delivered','collected'].includes(p.status)) driverMap[dId].delivered++
                      else if (p.status === 'failed_delivery') driverMap[dId].failed++
                      else if (['in_transit','out_for_delivery','loaded','assigned'].includes(p.status)) driverMap[dId].inProgress++
                      driverMap[dId].revenue += p.fee_charged || 0
                    }
                    const drivers = Object.entries(driverMap).sort((a, b) => b[1].revenue - a[1].revenue)
                    return (
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 12 }}>
                          {drivers.length} driver{drivers.length !== 1 ? 's' : ''} with assigned parcels · ranked by revenue
                        </div>
                        {drivers.length === 0 && (
                          <div style={{ fontSize: 12, color: 'var(--tx3)', textAlign: 'center', padding: 32 }}>No driver data yet — assign drivers to parcels to see scorecards</div>
                        )}
                        {drivers.map(([dId, d]) => {
                          const completedAll = d.delivered + d.failed
                          const fadr = completedAll > 0 ? Math.round((d.delivered / completedAll) * 100) : null
                          const fadrColor = fadr === null ? 'var(--tx3)' : fadr >= 85 ? GREEN : fadr >= 70 ? AMBER : RED
                          return (
                            <div key={dId} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 16, background: `${TEAL}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: TEAL }}>{d.name.charAt(0).toUpperCase()}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13, fontWeight: 700 }}>{d.name}</div>
                                  <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{d.total} parcel{d.total !== 1 ? 's' : ''} assigned</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: 14, fontWeight: 800, color: GREEN }}>{currencySymbol} {d.revenue.toLocaleString()}</div>
                                  <div style={{ fontSize: 10, color: 'var(--tx3)' }}>revenue</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--b)', marginTop: 2 }}>
                                {[
                                  { l: 'Delivered', v: d.delivered, c: GREEN },
                                  { l: 'In Progress', v: d.inProgress, c: '#6366f1' },
                                  { l: 'Failed', v: d.failed, c: d.failed > 0 ? RED : 'var(--tx3)' },
                                  { l: 'FADR', v: fadr !== null ? `${fadr}%` : '—', c: fadrColor },
                                ].map((m, i, arr) => (
                                  <div key={m.l} style={{ flex: 1, padding: '8px 0 4px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid var(--b)' : 'none' }}>
                                    <div style={{ fontSize: 15, fontWeight: 800, color: m.c }}>{m.v}</div>
                                    <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{m.l}</div>
                                  </div>
                                ))}
                              </div>
                              {fadr !== null && (
                                <div style={{ marginTop: 8 }}>
                                  <div style={{ height: 3, background: 'var(--b)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: `${fadr}%`, height: '100%', background: fadrColor, borderRadius: 2, transition: 'width 700ms cubic-bezier(0.4,0,0.2,1)' }} />
                                  </div>
                                  <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 3 }}>{fadr >= 85 ? 'Excellent delivery rate' : fadr >= 70 ? 'Needs improvement' : 'Critical — review routes'}</div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </>
              )}

              {/* ── Parcel evidence modal ── */}
              {logSelectedParcel && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 400, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setLogSelectedParcel(null)}>
                  <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', borderRadius: '14px 14px 0 0', width: '100%', maxWidth: 600, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
                    {/* Drag handle */}
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                      <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--b)' }} />
                    </div>
                    {/* Scrollable body */}
                    <div style={{ overflowY: 'auto', padding: '8px 20px 24px' }}>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--tx)', letterSpacing: '0.02em' }}>{logSelectedParcel.tracking_number}</div>
                          <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>{logSelectedParcel.sender_name || '—'} → {logSelectedParcel.receiver_name || '—'}{logSelectedParcel.destination_city ? ` · ${logSelectedParcel.destination_city}` : ''}</div>
                        </div>
                        <span style={{ background: `${SC[logSelectedParcel.status] || '#888'}18`, color: SC[logSelectedParcel.status] || '#888', padding: '3px 9px', borderRadius: 6, fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{SL[logSelectedParcel.status] || logSelectedParcel.status}</span>
                        <button onClick={() => setLogSelectedParcel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx3)', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>

                      {/* Parcel meta — only non-empty fields */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', padding: '10px 0', borderTop: '1px solid var(--b)', borderBottom: '1px solid var(--b)', marginBottom: 18 }}>
                        {[
                          logSelectedParcel.weight_kg && { l: 'Weight', v: `${logSelectedParcel.weight_kg} kg` },
                          logSelectedParcel.fee_charged != null && { l: 'Fee', v: `${currencySymbol} ${logSelectedParcel.fee_charged.toLocaleString()}` },
                          logSelectedParcel.payment_status && { l: 'Payment', v: logSelectedParcel.payment_status },
                          logSelectedParcel.driver?.name && { l: 'Driver', v: logSelectedParcel.driver.name },
                          logSelectedParcel.truck?.plate_number && { l: 'Truck', v: logSelectedParcel.truck.plate_number },
                          logSelectedParcel.fail_reason && { l: 'Fail reason', v: logSelectedParcel.fail_reason },
                        ].filter(Boolean).map((r: any) => (
                          <div key={r.l}>
                            <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500 }}>{r.l.toUpperCase()}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{r.v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Evidence timeline */}
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 14 }}>Evidence chain</div>
                      {logParcelPhotosLoading ? (
                        <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--tx3)', fontSize: 13 }}>Loading…</div>
                      ) : logParcelPhotos.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '28px 16px', background: 'var(--sf)', borderRadius: 10, border: '1px solid var(--b)' }}>
                          <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>No photos yet</div>
                          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Driver photos will appear here as the parcel moves</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {logParcelPhotos.map((photo: any, idx: number) => {
                            const label = PHOTO_LABELS[photo.photo_type] || photo.photo_type
                            const color = PHOTO_COLORS[photo.photo_type] || TEAL
                            const ts = new Date(photo.created_at)
                            const isLast = idx === logParcelPhotos.length - 1
                            return (
                              <div key={photo.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                {/* Timeline spine */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 18 }}>
                                  <div style={{ width: 12, height: 12, borderRadius: 6, background: color, border: `2px solid var(--bg)`, outline: `2px solid ${color}`, marginTop: 3, flexShrink: 0 }} />
                                  {!isLast && <div style={{ width: 2, flex: 1, minHeight: 24, background: 'var(--b)', marginTop: 4 }} />}
                                </div>
                                <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
                                    <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{ts.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {ts.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                    {photo.captured_staff?.name && <span style={{ fontSize: 11, color: 'var(--tx3)' }}>· {photo.captured_staff.name}</span>}
                                  </div>
                                  {photo.photo_url && (
                                    photo.photo_type === 'delivery_video' || photo.photo_url.startsWith('data:video/') ? (
                                      <video
                                        src={photo.photo_url}
                                        controls
                                        playsInline
                                        style={{ width: '100%', maxHeight: 220, borderRadius: 8, display: 'block', background: '#000' }}
                                      />
                                    ) : (
                                      <img
                                        src={photo.photo_url}
                                        alt={label}
                                        style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                                      />
                                    )
                                  )}
                                  {photo.notes && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 6, fontStyle: 'italic', lineHeight: 1.4 }}>{photo.notes}</div>}
                                  {photo.lat && photo.lng && (
                                    <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                      {Number(photo.lat).toFixed(4)}, {Number(photo.lng).toFixed(4)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* ══════════════ FACTORY INTELLIGENCE TAB ══════════════ */}
        {tab === 'intelligence' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>🧠 Production Intelligence</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>AI-powered anomaly detection across your production floor</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
            </div>
            {!factoryIntelligence && !factoryIntelLoading && (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🏭</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Run Production Analysis</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 20, maxWidth: 420, margin: '0 auto 20px' }}>
                  Claude analyses your captures, wastage rate, approval lag, output/intake ratio and batch patterns to surface anomalies and recommend actions.
                </div>
                <button
                  onClick={async () => {
                    setFactoryIntelLoading(true)
                    try {
                      const res = await fetch('/api/pos/intelligence/anomaly-detection', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ analysis_type: 'factory', period_days: 30 }),
                      })
                      const d = await res.json()
                      setFactoryIntelligence(d)
                    } catch {
                      notify('Analysis failed — please try again', false)
                    }
                    setFactoryIntelLoading(false)
                  }}
                  style={{ background: 'var(--acc, #4f46e5)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Analyse last 30 days
                </button>
              </div>
            )}
            {factoryIntelLoading && (
              <div style={{ color: 'var(--tx3)', fontSize: 13, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                Analysing your production data…
              </div>
            )}
            {factoryIntelligence && !factoryIntelLoading && (() => {
              const { anomalies = [], recommendations = [], period_analyzed, raw_analysis } = factoryIntelligence
              const riskColor: Record<string, string> = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a' }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--tx3)' }}>
                    Analysed period: {period_analyzed}
                    <button onClick={() => setFactoryIntelligence(null)} style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--tx3)', background: 'none', border: '1px solid var(--b)', borderRadius: 6, padding: '2px 10px', cursor: 'pointer' }}>Re-run</button>
                  </div>
                  {recommendations.length > 0 && (
                    <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Recommendations</div>
                      {recommendations.map((r: string, i: number) => <div key={i} style={{ fontSize: 13, color: 'var(--tx)', marginBottom: 6 }}>{r}</div>)}
                    </div>
                  )}
                  {anomalies.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>Detected anomalies</div>
                      {anomalies.map((a: any, i: number) => (
                        <div key={i} style={{ background: 'var(--sf)', border: `1px solid ${riskColor[a.risk_level] || 'var(--b)'}40`, borderRadius: 12, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: riskColor[a.risk_level] || 'var(--tx3)', background: `${riskColor[a.risk_level] || '#888'}18`, padding: '2px 8px', borderRadius: 9999 }}>{a.risk_level}</span>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{a.issue}</div>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 4 }}>💡 {a.hypothesis}</div>
                          <div style={{ fontSize: 12, color: 'var(--tx)' }}>→ {a.action}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {anomalies.length === 0 && (
                    <div style={{ fontSize: 13, color: '#16a34a', background: '#16a34a10', border: '1px solid #16a34a30', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      ✅ No significant anomalies detected — production looks healthy.
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* ══════════════ CUSTOMERS TAB ══════════════ */}
        {tab === 'customers' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>👤 Customers</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Customer profiles, purchase history and segments</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            {(() => {
              const customerMap = new Map<string, { phone: string; name?: string; orders: number; total: number; lastVisit: string }>()
              for (const tx of transactions) {
                const c = tx.pos_customers
                if (!c?.phone) continue
                const existing = customerMap.get(c.phone)
                if (existing) {
                  existing.orders++
                  existing.total += tx.total
                  if (tx.created_at > existing.lastVisit) existing.lastVisit = tx.created_at
                  if (c.name && !existing.name) existing.name = c.name
                } else {
                  customerMap.set(c.phone, { phone: c.phone, name: c.name, orders: 1, total: tx.total, lastVisit: tx.created_at })
                }
              }
              const customers = Array.from(customerMap.values()).sort((a, b) => b.total - a.total)
              if (customers.length === 0) return (
                <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No customers yet</div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Customer profiles are created when you capture a phone number at the till.</div>
                </div>
              )
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Total customers</div><div style={{ fontSize: 22, fontWeight: 800, color: ACC }}>{customers.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Repeat customers</div><div style={{ fontSize: 22, fontWeight: 800, color: GREEN }}>{customers.filter(c => c.orders > 1).length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Avg lifetime value</div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, customers.reduce((s, c) => s + c.total, 0) / customers.length)}</div></div>
                  </div>
                  <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 100px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      <span>Customer</span><span style={{ textAlign: 'center' }}>Orders</span><span style={{ textAlign: 'right' }}>Spent</span><span style={{ textAlign: 'right' }}>Last visit</span>
                    </div>
                    {customers.slice(0, 30).map((c, i) => (
                      <div key={c.phone} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 100px', padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)', fontSize: 13, alignItems: 'center' }}>
                        <div><div style={{ fontWeight: 600, color: 'var(--tx)' }}>{c.name || c.phone}</div>{c.name && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{c.phone}</div>}</div>
                        <div style={{ textAlign: 'center', color: 'var(--tx3)' }}>{c.orders}</div>
                        <div style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(currencySymbol, c.total)}</div>
                        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>{new Date(c.lastVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ══════════════ PROMOTIONS TAB ══════════════ */}
        {tab === 'promotions' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>🏷️ Promotions & Discounts</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Track discounts applied across your sales</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            {(() => {
              const discountedTx = transactions.filter(t => t.subtotal && t.total < t.subtotal)
              const totalDiscount = discountedTx.reduce((s, t) => s + ((t.subtotal || t.total) - t.total), 0)
              const avgDiscount = discountedTx.length > 0 ? totalDiscount / discountedTx.length : 0
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Discounted sales</div><div style={{ fontSize: 22, fontWeight: 800, color: ACC }}>{discountedTx.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Total discounts given</div><div style={{ fontSize: 22, fontWeight: 800, color: RED }}>{fmt(currencySymbol, totalDiscount)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Avg discount</div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, avgDiscount)}</div></div>
                  </div>
                  {discountedTx.length === 0 ? (
                    <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>🏷️</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No discounts this period</div>
                      <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Discounted transactions will appear here when a sale is completed with a discount at the till.</div>
                    </div>
                  ) : (
                    <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 80px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                        <span>Items</span><span style={{ textAlign: 'right' }}>Subtotal</span><span style={{ textAlign: 'right' }}>Discount</span><span style={{ textAlign: 'right' }}>Date</span>
                      </div>
                      {discountedTx.slice(0, 20).map(tx => (
                        <div key={tx.id} onClick={() => setTxDetail(tx)} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 80px', padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)', cursor: 'pointer', fontSize: 13, alignItems: 'center' }}>
                          <div style={{ fontWeight: 500, color: 'var(--tx)' }}>{(tx.pos_items || []).map(i => i.name).filter(Boolean).join(', ') || 'Sale'}</div>
                          <div style={{ textAlign: 'right', color: 'var(--tx3)' }}>{fmt(currencySymbol, tx.subtotal || tx.total)}</div>
                          <div style={{ textAlign: 'right', fontWeight: 600, color: RED }}>-{fmt(currencySymbol, (tx.subtotal || tx.total) - tx.total)}</div>
                          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>{new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* ══════════════ LOYALTY TAB ══════════════ */}
        {tab === 'loyalty' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>⭐ Customer Loyalty</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Repeat customers, retention and lifetime value</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            {(() => {
              const customerMap = new Map<string, { phone: string; name?: string; orders: number; total: number; firstVisit: string; lastVisit: string }>()
              for (const tx of transactions) {
                const c = tx.pos_customers
                if (!c?.phone) continue
                const existing = customerMap.get(c.phone)
                if (existing) {
                  existing.orders++
                  existing.total += tx.total
                  if (tx.created_at > existing.lastVisit) existing.lastVisit = tx.created_at
                  if (tx.created_at < existing.firstVisit) existing.firstVisit = tx.created_at
                  if (c.name && !existing.name) existing.name = c.name
                } else {
                  customerMap.set(c.phone, { phone: c.phone, name: c.name, orders: 1, total: tx.total, firstVisit: tx.created_at, lastVisit: tx.created_at })
                }
              }
              const allCustomers = Array.from(customerMap.values())
              const repeatCustomers = allCustomers.filter(c => c.orders > 1)
              const topSpenders = [...allCustomers].sort((a, b) => b.total - a.total).slice(0, 10)
              const avgLTV = allCustomers.length > 0 ? allCustomers.reduce((s, c) => s + c.total, 0) / allCustomers.length : 0
              const repeatRate = allCustomers.length > 0 ? (repeatCustomers.length / allCustomers.length * 100) : 0
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Total customers</div><div style={{ fontSize: 22, fontWeight: 800, color: ACC }}>{allCustomers.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Repeat customers</div><div style={{ fontSize: 22, fontWeight: 800, color: GREEN }}>{repeatCustomers.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Repeat rate</div><div style={{ fontSize: 22, fontWeight: 800, color: repeatRate >= 20 ? GREEN : 'var(--tx)' }}>{repeatRate.toFixed(0)}%</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Avg lifetime value</div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, avgLTV)}</div></div>
                  </div>
                  {allCustomers.length === 0 ? (
                    <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No customer data yet</div>
                      <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Loyalty insights appear when customers are captured at the till via phone number.</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--tx)' }}>Top customers by spend</div>
                      <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 90px 90px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                          <span>Customer</span><span style={{ textAlign: 'center' }}>Visits</span><span style={{ textAlign: 'right' }}>Total spent</span><span style={{ textAlign: 'right' }}>Last visit</span>
                        </div>
                        {topSpenders.map((c, i) => (
                          <div key={c.phone} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 90px 90px', padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)', fontSize: 13, alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--tx)' }}>{c.name || c.phone}</div>
                              {c.name && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{c.phone}</div>}
                            </div>
                            <div style={{ textAlign: 'center' }}><span style={{ background: c.orders > 1 ? 'rgba(22,163,74,.1)' : 'var(--ev)', color: c.orders > 1 ? GREEN : 'var(--tx3)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 9999 }}>{c.orders}x</span></div>
                            <div style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(currencySymbol, c.total)}</div>
                            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>{new Date(c.lastVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* ══════════════ RETURNS TAB ══════════════ */}
        {tab === 'returns' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>↩️ Returns & Exchanges</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Refunds processed at the till this period</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            {(() => {
              const returnTx = transactions.filter(t => t.status === 'refunded' || t.status === 'partially_refunded')
              const totalRefunded = returnTx.reduce((s, t) => s + t.total, 0)
              const returnRate = transactions.length > 0 ? (returnTx.length / transactions.length * 100) : 0
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Total returns</div><div style={{ fontSize: 22, fontWeight: 800, color: returnTx.length > 0 ? RED : GREEN }}>{returnTx.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Amount refunded</div><div style={{ fontSize: 22, fontWeight: 800, color: totalRefunded > 0 ? RED : 'var(--tx)' }}>{fmt(currencySymbol, totalRefunded)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Return rate</div><div style={{ fontSize: 22, fontWeight: 800, color: returnRate > 5 ? RED : 'var(--tx)' }}>{returnRate.toFixed(1)}%</div></div>
                  </div>
                  {returnTx.length === 0 ? (
                    <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No returns this period</div>
                      <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Refunds will appear here when processed via the till&apos;s refund flow.</div>
                    </div>
                  ) : (
                    <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 100px 80px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                        <span>Items</span><span style={{ textAlign: 'center' }}>Status</span><span style={{ textAlign: 'right' }}>Amount</span><span style={{ textAlign: 'right' }}>Date</span>
                      </div>
                      {returnTx.slice(0, 20).map(tx => (
                        <div key={tx.id} onClick={() => setTxDetail(tx)} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 100px 80px', padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)', cursor: 'pointer', fontSize: 13, alignItems: 'center' }}>
                          <div style={{ fontWeight: 500, color: 'var(--tx)' }}>{(tx.pos_items || []).map(i => i.name).filter(Boolean).join(', ') || 'Sale'}</div>
                          <div style={{ textAlign: 'center' }}><span style={{ fontSize: 10, fontWeight: 700, color: tx.status === 'refunded' ? RED : AMBER, background: tx.status === 'refunded' ? 'rgba(220,38,38,.08)' : 'rgba(202,138,4,.08)', padding: '2px 8px', borderRadius: 9999 }}>{tx.status === 'refunded' ? 'Full refund' : 'Partial'}</span></div>
                          <div style={{ textAlign: 'right', fontWeight: 600, color: RED }}>{fmt(currencySymbol, tx.total)}</div>
                          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>{new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* ══════════════ REPORTS TAB ══════════════ */}
        {tab === 'reports' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>📊 Reports</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Sales, inventory, margins and business insights</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            {(() => {
              const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.total, 0)
              const totalCost = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + (t.pos_items || []).reduce((is, i) => is + (i.cost_price || 0) * i.qty, 0), 0)
              const totalProfit = totalRevenue - totalCost
              const inventoryValue = inventory.reduce((s, i) => s + i.cost_price * i.stock_qty, 0)
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Revenue</div><div style={{ fontSize: 18, fontWeight: 800, color: ACC }}>{fmt(currencySymbol, totalRevenue)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Gross profit</div><div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, totalProfit)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Margin</div><div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)' }}>{totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : '0'}%</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Stock value</div><div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, inventoryValue)}</div></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {[
                      { icon: '🛒', title: 'Sales report', desc: 'Revenue by product, category, staff & period', action: () => handleSetTab('overview') },
                      { icon: '📦', title: 'Inventory report', desc: 'Stock levels, valuation & dead stock', action: () => handleSetTab('inventory') },
                      { icon: '👥', title: 'Staff performance', desc: 'Sales per cashier, shift totals', action: () => handleSetTab('staff') },
                      { icon: '↩️', title: 'Returns report', desc: 'Return rates, reasons & refund totals', action: () => handleSetTab('returns') },
                      { icon: '👤', title: 'Customer report', desc: 'Retention, lifetime value & segments', action: () => handleSetTab('customers') },
                      { icon: '⭐', title: 'Loyalty report', desc: 'Repeat rate, top spenders & trends', action: () => handleSetTab('loyalty') },
                      { icon: '🏷️', title: 'Discounts report', desc: 'Promotions usage & discount totals', action: () => handleSetTab('promotions') },
                      { icon: '🔍', title: 'Audit trail', desc: 'Full change log & transaction history', action: () => handleSetTab('audit') },
                    ].map((r, i) => (
                      <button key={i} onClick={r.action} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: '16px 18px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)} onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b)')}>
                        <div style={{ fontSize: 24, flexShrink: 0 }}>{r.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{r.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2, lineHeight: 1.4 }}>{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ══════════════ PURCHASE ORDERS TAB ══════════════ */}
        {tab === 'purchase_orders' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>📋 Purchase Orders</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Order stock from suppliers and track deliveries</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Supplier orders</div>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: AMBER, background: 'rgba(202,138,4,.1)', padding: '3px 10px', borderRadius: 9999, marginBottom: 12 }}>Coming soon</span>
              <div style={{ fontSize: 13, color: 'var(--tx3)', maxWidth: 420, margin: '0 auto' }}>Create purchase orders, send to suppliers, receive stock and track back-orders — all linked to your inventory.</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 24, textAlign: 'left' }}>
                {[
                  { icon: '📝', title: 'Create POs', desc: 'Build orders from low-stock items' },
                  { icon: '📧', title: 'Send to supplier', desc: 'Email or WhatsApp POs directly' },
                  { icon: '📥', title: 'Receive stock', desc: 'Scan & confirm deliveries' },
                  { icon: '🔄', title: 'Back-orders', desc: 'Track partial & pending items' },
                  { icon: '🤖', title: 'Auto-reorder', desc: 'AI suggests when to restock' },
                  { icon: '📊', title: 'Supplier insights', desc: 'Lead times & cost trends' },
                ].map((f, i) => (
                  <div key={i} style={{ background: 'var(--ev)', borderRadius: 10, padding: 14, opacity: 0.6 }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ GIFT CARDS TAB ══════════════ */}
        {tab === 'gift_cards' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>🎁 Gift Cards</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Issue, redeem and track gift card balances</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎁</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Gift cards & store credit</div>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: AMBER, background: 'rgba(202,138,4,.1)', padding: '3px 10px', borderRadius: 9999, marginBottom: 12 }}>Coming soon</span>
              <div style={{ fontSize: 13, color: 'var(--tx3)', maxWidth: 420, margin: '0 auto' }}>Sell physical or digital gift cards, accept them as payment and track outstanding balances.</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 24, textAlign: 'left' }}>
                {[
                  { icon: '💳', title: 'Issue cards', desc: 'Physical or digital with unique codes' },
                  { icon: '📱', title: 'Check balance', desc: 'Scan or enter code at till' },
                  { icon: '💰', title: 'Accept as payment', desc: 'Full or partial redemption' },
                  { icon: '🔄', title: 'Store credit', desc: 'Issue on returns instead of refund' },
                  { icon: '📊', title: 'Liability report', desc: 'Track outstanding balances' },
                  { icon: '🎨', title: 'Custom designs', desc: 'Branded cards for your store' },
                ].map((f, i) => (
                  <div key={i} style={{ background: 'var(--ev)', borderRadius: 10, padding: 14, opacity: 0.6 }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ INTEGRATIONS TAB ══════════════ */}
        {tab === 'integrations' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>🔗 Integrations</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Connect your accounting, payments and marketing tools</div>
              </div>
              <button onClick={() => handleSetTab('services')} style={{ fontSize: 12, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {[
                { icon: '📘', title: 'Xero', desc: 'Auto-sync sales, refunds & tax to Xero', status: 'available', action: () => window.open('/api/pos/integrations/xero/connect', '_blank') },
                { icon: '📗', title: 'QuickBooks', desc: 'Sync transactions to QuickBooks Online', status: 'available', action: () => window.open('/api/auth/quickbooks', '_blank') },
                { icon: '💳', title: 'M-Pesa', desc: 'Accept mobile money payments', status: 'available', action: () => handleSetTab('overview') },
                { icon: '📧', title: 'Email marketing', desc: 'Sync customers to Mailchimp or Brevo', status: 'coming_soon' },
                { icon: '📦', title: 'Shipping', desc: 'Track shipments via 17Track, DHL & more', status: 'available', action: () => window.location.href = '/shipments' },
                { icon: '🛒', title: 'E-commerce', desc: 'Connect Shopify, WooCommerce & more', status: 'available', action: () => window.location.href = '/sources' },
              ].map((int, i) => (
                <div key={i} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, padding: 20, position: 'relative' }}>
                  {int.status === 'coming_soon' && <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 600, color: AMBER, background: 'rgba(202,138,4,.1)', padding: '2px 8px', borderRadius: 9999 }}>Coming soon</span>}
                  {int.status === 'available' && <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 600, color: GREEN, background: 'rgba(22,163,74,.1)', padding: '2px 8px', borderRadius: 9999 }}>Available</span>}
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{int.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>{int.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.4, marginBottom: 12 }}>{int.desc}</div>
                  {int.status === 'available' && int.action && (
                    <button onClick={int.action} style={{ fontSize: 12, fontWeight: 600, color: ACC, background: ACC_BG, border: `1px solid ${ACC_BORDER}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>Connect →</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* ══════════════ MODALS ══════════════ */}

      {/* Transaction detail modal */}
      {txDetail && (() => {
        const txItems = txDetail.pos_items || []
        const computedSubtotal = txItems.reduce((s, it) => s + it.qty * it.unit_price, 0)
        const subtotal = txDetail.subtotal ?? computedSubtotal
        const discount = txDetail.discount_amount ?? 0
        const tendered = txDetail.amount_tendered
        const change = tendered ? tendered - txDetail.total : null
        const totalCost = txItems.reduce((s, it) => s + (it.cost_price ? it.qty * it.cost_price : 0), 0)
        const totalProfit = txItems.reduce((s, it) => it.cost_price ? s + (it.qty * it.unit_price - it.qty * it.cost_price) : s, 0)
        const hasCostData = txItems.some(it => it.cost_price && it.cost_price > 0)
        const marginPct = computedSubtotal > 0 ? (totalProfit / computedSubtotal * 100) : 0
        const locName = txDetail.pos_location_id ? locations.find(l => l.id === txDetail.pos_location_id)?.name : null
        const statusColor = txDetail.status === 'completed' ? GREEN : txDetail.status === 'refunded' ? RED : '#f59e0b'
        const statusLabel = txDetail.status.replace('_', ' ')
        const createdDate = new Date(txDetail.created_at)
        const ago = Math.floor((Date.now() - createdDate.getTime()) / 60000)
        const agoText = ago < 1 ? 'just now' : ago < 60 ? `${ago}m ago` : ago < 1440 ? `${Math.floor(ago / 60)}h ago` : `${Math.floor(ago / 1440)}d ago`
        const paymentIcon = txDetail.payment_type === 'cash' ? '💵' : txDetail.payment_type === 'card' ? '💳' : '📱'

        return (
        <>
          <div onClick={() => setTxDetail(null)} style={modalOverlay} />
          <div style={{ ...modalBox, maxWidth: 520 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>Transaction details</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
                  #{txDetail.id.slice(0, 8)} · {createdDate.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · <span style={{ color: 'var(--tx2)' }}>{agoText}</span>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, background: statusColor + '14', padding: '4px 10px', borderRadius: 9999, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{statusLabel === 'completed' ? '✓ Completed' : statusLabel}</span>
            </div>

            {/* Info grid — clickable for drill-downs */}
            <div style={{ display: 'grid', gridTemplateColumns: locName ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div onClick={() => { setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'cashier_detail', title: `${txDetail.cashier?.name || 'Owner'}'s transactions`, cashier_id: txDetail.cashier?.name || 'Owner' }) }} style={{ fontSize: 12, color: 'var(--tx3)', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', transition: 'border-color .15s' }}>Cashier<div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginTop: 2 }}>{txDetail.cashier?.name || 'Owner'}{txDetail.cashier?.role ? <span style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 400, marginLeft: 6, textTransform: 'capitalize' }}>{txDetail.cashier.role}</span> : null}</div><div style={{ fontSize: 9, color: ACC, fontWeight: 600, marginTop: 3 }}>View performance →</div></div>
              <div onClick={() => { setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'payment_breakdown', title: `${txDetail.payment_type} payments`, payment_type: txDetail.payment_type }) }} style={{ fontSize: 12, color: 'var(--tx3)', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', transition: 'border-color .15s' }}>Payment<div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginTop: 2 }}>{paymentIcon} <span style={{ textTransform: 'capitalize' }}>{txDetail.payment_type}</span></div><div style={{ fontSize: 9, color: ACC, fontWeight: 600, marginTop: 3 }}>View all {txDetail.payment_type} →</div></div>
              {locName && <div onClick={() => { setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'branch_detail', title: `${locName} branch`, branch_id: txDetail.pos_location_id ?? undefined }) }} style={{ fontSize: 12, color: 'var(--tx3)', cursor: 'pointer', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', transition: 'border-color .15s' }}>Branch<div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginTop: 2 }}>📍 {locName}</div><div style={{ fontSize: 9, color: ACC, fontWeight: 600, marginTop: 3 }}>View branch →</div></div>}
            </div>

            {/* Customer — clickable */}
            {txDetail.pos_customers?.phone && (
              <div onClick={() => { const c = txDetail.pos_customers!; setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'customer_history', title: `${c.name || c.phone}'s history`, customer_phone: c.phone }) }} style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 12, background: 'var(--ev)', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', border: '1px solid var(--b)' }}>
                👤 Customer: <span style={{ fontWeight: 600, color: 'var(--tx)' }}>{txDetail.pos_customers.name || txDetail.pos_customers.phone}</span>
                {txDetail.pos_customers.name && txDetail.pos_customers.phone && <span style={{ marginLeft: 8, fontSize: 11 }}>({txDetail.pos_customers.phone})</span>}
                <span style={{ fontSize: 9, color: ACC, fontWeight: 600, marginLeft: 8 }}>View history →</span>
              </div>
            )}

            {/* Line items */}
            <div style={{ border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: hasCostData ? '1fr 40px 65px 65px 65px' : '1fr 50px 70px 70px', padding: '8px 14px', background: 'var(--ev)', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' }}>
                <span>Item</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'right' }}>Unit</span>{hasCostData && <span style={{ textAlign: 'right' }}>Profit</span>}<span style={{ textAlign: 'right' }}>Total</span>
              </div>
              {txItems.map((item, i) => {
                const lineTotal = item.qty * item.unit_price
                const lineProfit = item.cost_price ? lineTotal - item.qty * item.cost_price : null
                const matchedInv = inventory.find(inv => inv.name === item.name)
                return (
                  <div key={i} onClick={() => { if (matchedInv) { setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'product_history', title: item.name, product_name: item.name, item_id: matchedInv.id }) } }} style={{ display: 'grid', gridTemplateColumns: hasCostData ? '1fr 40px 65px 65px 65px' : '1fr 50px 70px 70px', padding: '10px 14px', borderTop: '1px solid var(--b)', fontSize: 13, cursor: matchedInv ? 'pointer' : 'default', transition: 'background .15s' }} onMouseEnter={e => { if (matchedInv) (e.currentTarget as HTMLElement).style.background = 'var(--ev)' }} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                    <span style={{ color: matchedInv ? ACC : 'var(--tx)', fontWeight: 500, textDecoration: matchedInv ? 'underline' : 'none', textDecorationColor: matchedInv ? ACC + '40' : undefined, textUnderlineOffset: '2px' }}>{item.name}</span>
                    <span style={{ textAlign: 'center', color: 'var(--tx3)' }}>{item.qty}</span>
                    <span style={{ textAlign: 'right', color: 'var(--tx3)' }}>{fmt(currencySymbol, item.unit_price)}</span>
                    {hasCostData && <span style={{ textAlign: 'right', fontSize: 12, color: lineProfit !== null ? (lineProfit >= 0 ? GREEN : RED) : 'var(--tx3)' }}>{lineProfit !== null ? fmt(currencySymbol, lineProfit) : '—'}</span>}
                    <span style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(currencySymbol, lineTotal)}</span>
                  </div>
                )
              })}
            </div>

            {/* Totals breakdown */}
            <div style={{ background: 'var(--ev)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
              {(discount > 0 || (subtotal !== txDetail.total)) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--tx3)', marginBottom: 6 }}>
                  <span>Subtotal</span><span>{fmt(currencySymbol, subtotal)}</span>
                </div>
              )}
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: RED, marginBottom: 6 }}>
                  <span>Discount</span><span>−{fmt(currencySymbol, discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: 'var(--tx)', borderTop: (discount > 0 || subtotal !== txDetail.total) ? '2px solid var(--b)' : 'none', paddingTop: (discount > 0 || subtotal !== txDetail.total) ? 8 : 0 }}>
                <span>Total</span><span>{fmt(currencySymbol, txDetail.total)}</span>
              </div>
              {tendered !== null && tendered !== undefined && tendered > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--tx3)', marginTop: 6 }}>
                    <span>Tendered</span><span>{fmt(currencySymbol, tendered)}</span>
                  </div>
                  {change !== null && change > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--tx3)' }}>
                      <span>Change</span><span>{fmt(currencySymbol, change)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Profit summary — clickable for deep-dives */}
            {hasCostData && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div onClick={() => { setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'gross_profit', title: 'Gross Profit Analysis' }) }} style={{ flex: 1, background: totalProfit >= 0 ? 'rgba(34,197,94,.06)' : 'rgba(220,38,38,.06)', border: `1px solid ${totalProfit >= 0 ? 'rgba(34,197,94,.2)' : 'rgba(220,38,38,.2)'}`, borderRadius: 8, padding: '8px 12px', textAlign: 'center', cursor: 'pointer', transition: 'transform .1s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Profit</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: totalProfit >= 0 ? GREEN : RED, marginTop: 2 }}>{fmt(currencySymbol, totalProfit)}</div>
                  <div style={{ fontSize: 8, color: ACC, fontWeight: 600, marginTop: 2 }}>Analyse →</div>
                </div>
                <div onClick={() => { setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'margin', title: 'Margin Breakdown' }) }} style={{ flex: 1, background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 8, padding: '8px 12px', textAlign: 'center', cursor: 'pointer', transition: 'transform .1s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Margin</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: marginPct >= 30 ? GREEN : marginPct >= 15 ? '#f59e0b' : RED, marginTop: 2 }}>{marginPct.toFixed(1)}%</div>
                  <div style={{ fontSize: 8, color: ACC, fontWeight: 600, marginTop: 2 }}>Breakdown →</div>
                </div>
                <div onClick={() => { setLastTxDetail(txDetail); setTxDetail(null); setFilterModal({ type: 'gross_profit', title: 'Cost Analysis' }) }} style={{ flex: 1, background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 8, padding: '8px 12px', textAlign: 'center', cursor: 'pointer', transition: 'transform .1s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Cost</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--tx)', marginTop: 2 }}>{fmt(currencySymbol, totalCost)}</div>
                  <div style={{ fontSize: 8, color: ACC, fontWeight: 600, marginTop: 2 }}>Analyse →</div>
                </div>
              </div>
            )}

            {/* Geo location — clickable to open map */}
            {txDetail.notes && (() => {
              const geoMatch = txDetail.notes.match(/\|__geo:([-\d.]+),([-\d.]+)/)
              const cleanNotes = txDetail.notes.replace(/\s*\|__geo:[^\s|]+/, '').trim()
              return (
                <>
                  {geoMatch && (
                    <div onClick={() => window.open(`https://www.google.com/maps?q=${geoMatch[1]},${geoMatch[2]}`, '_blank')} style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 8, padding: '8px 12px', background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.15)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>📍</span>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 500 }}>Sale location: {geoMatch[1]}, {geoMatch[2]}</div>
                        <div style={{ fontSize: 9, color: ACC, fontWeight: 600, marginTop: 1 }}>Open in Google Maps →</div>
                      </div>
                    </div>
                  )}
                  {cleanNotes && (
                    <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 12, padding: '8px 12px', background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.15)', borderRadius: 8 }}>
                      📝 {cleanNotes}
                    </div>
                  )}
                </>
              )
            })()}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {txDetail.status === 'completed' && (
                <button onClick={() => { setRefundTx(txDetail); setTxDetail(null); setRefundReason('') }} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(220,38,38,.25)', background: 'rgba(220,38,38,.06)', color: RED, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Process refund</button>
              )}
              <button onClick={() => { const items = txDetail.pos_items || []; const lines = items.map(it => `${it.name} x${it.qty} = ${fmt(currencySymbol, it.qty * it.unit_price)}`).join('\n'); const msg = `Receipt #${txDetail.id.slice(0, 8)}\n${createdDate.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n${lines}\n\nTotal: ${fmt(currencySymbol, txDetail.total)}${discount > 0 ? `\nDiscount: ${fmt(currencySymbol, discount)}` : ''}${txDetail.notes ? `\nNote: ${txDetail.notes}` : ''}\n\nThank you!`; navigator.clipboard.writeText(msg); notify('Receipt copied to clipboard') }} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--ev)', color: 'var(--tx)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📋 Copy receipt</button>
              <button onClick={() => { const items = txDetail.pos_items || []; const lines = items.map(it => `${it.name} x${it.qty} = ${fmt(currencySymbol, it.qty * it.unit_price)}`).join('%0a'); const msg = `*Receipt %23${txDetail.id.slice(0, 8)}*%0a${createdDate.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}%0a%0a${lines}%0a%0a*Total: ${fmt(currencySymbol, txDetail.total)}*${discount > 0 ? `%0aDiscount: ${fmt(currencySymbol, discount)}` : ''}%0a%0aThank you!`; window.open(`https://wa.me/?text=${msg}`, '_blank') }} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(37,211,102,.25)', background: 'rgba(37,211,102,.06)', color: '#25d366', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>💬 WhatsApp</button>
              <button onClick={() => setTxDetail(null)} style={btnSecondary}>Close</button>
            </div>
          </div>
        </>
        )
      })()}

      {/* Filter/drill-down modal */}
      {filterModal && (
        <>
          <div onClick={() => setFilterModal(null)} style={modalOverlay} />
          <div style={modalBox}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{filterModal.title}</div>
            {filterModal.type === 'sales' && (
              <div>
                {completedTx.length === 0 ? <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No completed sales in this period.</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                    {completedTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || 'Sale'}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(currencySymbol, tx.total)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {filterModal.type === 'refunds' && (
              <div>
                {refundedTx.length === 0 ? <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No refunds in this period.</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                    {refundedTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'rgba(220,38,38,.2)' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || 'Refund'}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: RED }}>-{fmt(currencySymbol, tx.total)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {filterModal.type === 'low_stock' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                {outOfStock.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', opacity: archivingStockId === item.id ? 0.4 : 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>OUT OF STOCK</span>
                      <button
                        disabled={archivingStockId === item.id}
                        onClick={async () => {
                          setArchivingStockId(item.id)
                          try {
                            const res = await fetch('/api/pos/inventory', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: item.id, active: false }),
                            })
                            if (res.ok) {
                              setInventory(prev => prev.filter(i => i.id !== item.id))
                              setToast({ msg: `${item.name} archived`, ok: true })
                            } else {
                              setToast({ msg: 'Failed to archive item', ok: false })
                            }
                          } catch { setToast({ msg: 'Failed to archive item', ok: false }) }
                          setArchivingStockId(null)
                        }}
                        style={{ fontSize: 11, color: 'var(--tx3)', background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 6, cursor: 'pointer', padding: '3px 8px', fontFamily: 'inherit', fontWeight: 500 }}
                      >Archive</button>
                    </div>
                  </div>
                ))}
                {lowStock.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(234,179,8,.06)', border: '1px solid rgba(234,179,8,.25)' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{item.stock_qty} left</span>
                  </div>
                ))}
                {alertCount === 0 && <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>All stock levels healthy.</div>}
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
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)' }}>Sales</div><div style={{ fontSize: 20, fontWeight: 800, color: ACC }}>{cashierTx.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)' }}>Revenue</div><div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, cashierRevenue)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 11, color: 'var(--tx3)' }}>Avg sale</div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, avgSale)}</div></div>
                  </div>
                  {activeHours.length > 0 && (
                    <div style={{ ...cardStyle, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>Sales by hour</div>
                      <MiniBarChart data={activeHours} color={ACC} height={60} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                    {cashierTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || 'Sale'}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {tx.payment_type}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(currencySymbol, tx.total)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
            {/* Gross Profit deep-dive */}
            {filterModal.type === 'gross_profit' && (() => {
              // Per-product profit breakdown
              const productProfit = completedTx.flatMap(t => (t.pos_items || []).map(i => ({
                name: i.name, qty: i.qty, revenue: i.unit_price * i.qty,
                cost: (i.cost_price || 0) * i.qty, profit: (i.unit_price - (i.cost_price || 0)) * i.qty,
                margin: i.unit_price > 0 ? ((i.unit_price - (i.cost_price || 0)) / i.unit_price * 100) : 0,
              })))
              const grouped: Record<string, { qty: number; revenue: number; cost: number; profit: number }> = {}
              productProfit.forEach(p => {
                if (!grouped[p.name]) grouped[p.name] = { qty: 0, revenue: 0, cost: 0, profit: 0 }
                grouped[p.name].qty += p.qty; grouped[p.name].revenue += p.revenue
                grouped[p.name].cost += p.cost; grouped[p.name].profit += p.profit
              })
              const sorted = Object.entries(grouped).sort((a, b) => b[1].profit - a[1].profit)
              const lossMakers = sorted.filter(([, d]) => d.profit < 0)
              return (
                <div>
                  {/* Summary cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Revenue</div><div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, todayRevenue)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Cost</div><div style={{ fontSize: 18, fontWeight: 800, color: RED }}>{fmt(currencySymbol, totalCost)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Profit</div><div style={{ fontSize: 18, fontWeight: 800, color: grossProfit >= 0 ? GREEN : RED }}>{fmt(currencySymbol, grossProfit)}</div></div>
                  </div>
                  {/* Visual bar */}
                  <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 10, background: 'var(--ev)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Revenue vs Cost</div>
                    <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', background: 'var(--b)' }}>
                      {todayRevenue > 0 && <div style={{ width: `${(totalCost / todayRevenue) * 100}%`, background: RED, transition: 'width .3s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700 }}>Cost</div>}
                      {todayRevenue > 0 && <div style={{ flex: 1, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700 }}>Profit {margin.toFixed(0)}%</div>}
                    </div>
                  </div>
                  {/* Product breakdown */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Profit by product</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto', marginBottom: lossMakers.length > 0 ? 14 : 0 }}>
                    {sorted.slice(0, 15).map(([name, d]) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: d.profit >= 0 ? 'rgba(22,163,74,.04)' : 'rgba(220,38,38,.04)', border: `1px solid ${d.profit >= 0 ? 'rgba(22,163,74,.15)' : 'rgba(220,38,38,.15)'}` }}>
                        <div><div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{name}</div><div style={{ fontSize: 10, color: 'var(--tx3)' }}>{d.qty} sold · {fmt(currencySymbol, d.revenue)} rev</div></div>
                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: 13, fontWeight: 700, color: d.profit >= 0 ? GREEN : RED }}>{fmt(currencySymbol, d.profit)}</div><div style={{ fontSize: 10, color: 'var(--tx3)' }}>{d.revenue > 0 ? (d.profit / d.revenue * 100).toFixed(0) : 0}% margin</div></div>
                      </div>
                    ))}
                  </div>
                  {/* Loss maker alert */}
                  {lossMakers.length > 0 && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: RED, marginBottom: 4 }}>⚠️ {lossMakers.length} product{lossMakers.length > 1 ? 's' : ''} selling below cost</div>
                      <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Review pricing on items with negative margins to protect profitability.</div>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Margin deep-dive */}
            {filterModal.type === 'margin' && (() => {
              const productMargins = completedTx.flatMap(t => (t.pos_items || []).map(i => ({
                name: i.name, revenue: i.unit_price * i.qty, cost: (i.cost_price || 0) * i.qty,
              })))
              const grouped: Record<string, { revenue: number; cost: number }> = {}
              productMargins.forEach(p => {
                if (!grouped[p.name]) grouped[p.name] = { revenue: 0, cost: 0 }
                grouped[p.name].revenue += p.revenue; grouped[p.name].cost += p.cost
              })
              const sorted = Object.entries(grouped).map(([name, d]) => ({
                name, revenue: d.revenue, cost: d.cost, margin: d.revenue > 0 ? ((d.revenue - d.cost) / d.revenue * 100) : 0,
              })).sort((a, b) => b.margin - a.margin)
              const healthLabel = margin >= 40 ? 'Healthy' : margin >= 20 ? 'Moderate' : 'Low'
              const healthColor = margin >= 40 ? GREEN : margin >= 20 ? AMBER : RED
              return (
                <div>
                  {/* Overall margin gauge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, padding: '14px 16px', borderRadius: 12, background: `${healthColor}08`, border: `1px solid ${healthColor}20` }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', border: `4px solid ${healthColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: healthColor }}>{margin.toFixed(0)}%</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: healthColor }}>{healthLabel} margin</div>
                      <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>
                        {margin >= 40 ? 'Your margins are strong — focus on maintaining pricing power.' : margin >= 20 ? 'Margins are moderate — review your highest-cost items.' : 'Margins are thin — urgently review pricing and supplier costs.'}
                      </div>
                    </div>
                  </div>
                  {/* Margin distribution */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Product margins — highest to lowest</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
                    {sorted.map(p => {
                      const mc = p.margin >= 40 ? GREEN : p.margin >= 20 ? AMBER : RED
                      return (
                        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--tx3)' }}>Rev {fmt(currencySymbol, p.revenue)} · Cost {fmt(currencySymbol, p.cost)}</div>
                          </div>
                          <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--ev)', overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ height: '100%', width: `${Math.min(Math.max(p.margin, 0), 100)}%`, background: mc, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: mc, minWidth: 40, textAlign: 'right' }}>{p.margin.toFixed(0)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Avg Sale deep-dive */}
            {filterModal.type === 'avg_sale' && (() => {
              const avgSale = todaySales > 0 ? todayRevenue / todaySales : 0
              const saleSizes = completedTx.map(t => t.total).sort((a, b) => a - b)
              const median = saleSizes.length > 0 ? saleSizes[Math.floor(saleSizes.length / 2)] : 0
              const smallest = saleSizes[0] || 0
              const largest = saleSizes[saleSizes.length - 1] || 0
              // Distribution buckets
              const buckets = [
                { label: `< ${fmt(currencySymbol, avgSale * 0.5, 0)}`, min: 0, max: avgSale * 0.5, count: 0 },
                { label: `${fmt(currencySymbol, avgSale * 0.5, 0)} - ${fmt(currencySymbol, avgSale, 0)}`, min: avgSale * 0.5, max: avgSale, count: 0 },
                { label: `${fmt(currencySymbol, avgSale, 0)} - ${fmt(currencySymbol, avgSale * 1.5, 0)}`, min: avgSale, max: avgSale * 1.5, count: 0 },
                { label: `> ${fmt(currencySymbol, avgSale * 1.5, 0)}`, min: avgSale * 1.5, max: Infinity, count: 0 },
              ]
              saleSizes.forEach(s => { const b = buckets.find(b => s >= b.min && s < b.max); if (b) b.count++ })
              const maxBucket = Math.max(...buckets.map(b => b.count), 1)
              // Items per transaction
              const avgItems = completedTx.length > 0 ? completedTx.reduce((s, t) => s + (t.pos_items || []).reduce((is, i) => is + i.qty, 0), 0) / completedTx.length : 0
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Average</div><div style={{ fontSize: 16, fontWeight: 800, color: ACC }}>{fmt(currencySymbol, avgSale)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Median</div><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, median)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Smallest</div><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tx3)' }}>{fmt(currencySymbol, smallest)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Largest</div><div style={{ fontSize: 16, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, largest)}</div></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Avg items/sale</div><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tx)' }}>{avgItems.toFixed(1)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Total sales</div><div style={{ fontSize: 16, fontWeight: 800, color: ACC }}>{todaySales}</div></div>
                  </div>
                  {/* Distribution chart */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Sale size distribution</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {buckets.map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, color: 'var(--tx3)', minWidth: 110, textAlign: 'right' }}>{b.label}</span>
                        <div style={{ flex: 1, height: 20, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(b.count / maxBucket) * 100}%`, background: ACC, borderRadius: 4, transition: 'width .3s', display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                            {b.count > 0 && <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>{b.count}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Tips */}
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: ACC_BG, border: `1px solid ${ACC_BORDER}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ACC, marginBottom: 4 }}>Tips to increase basket size</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>
                      {avgItems < 2 ? 'Most sales have only 1 item — try bundle deals or "add-on" suggestions at checkout.' : 'Good item count per sale. Consider upselling premium variants to increase value.'}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Staff Overview deep-dive */}
            {filterModal.type === 'staff_overview' && (() => {
              const totalStaffRev = cashierStats.reduce((s, c) => s + c.revenue, 0)
              const totalStaffSales = cashierStats.reduce((s, c) => s + c.sales, 0)
              const topPerformer = cashierStats[0]
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Total staff</div><div style={{ fontSize: 18, fontWeight: 800, color: ACC }}>{cashierStats.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Total revenue</div><div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, totalStaffRev)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Avg per staff</div><div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, cashierStats.length > 0 ? totalStaffRev / cashierStats.length : 0)}</div></div>
                  </div>
                  {/* Chart */}
                  <div style={{ ...cardStyle, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 8 }}>Revenue by staff</div>
                    <MiniBarChart data={cashierStats.map(c => ({ label: c.name.split(' ')[0], value: c.revenue }))} color={ACC} height={80} />
                  </div>
                  {/* Leaderboard */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Leaderboard</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
                    {cashierStats.map((c, i) => {
                      const pct = totalStaffRev > 0 ? (c.revenue / totalStaffRev * 100) : 0
                      return (
                        <div key={c.id} onClick={() => setFilterModal({ type: 'cashier_detail', title: `${c.name}'s transactions`, cashier_id: c.name })}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: i === 0 ? `1px solid ${ACC_BORDER}` : '1px solid var(--b)', background: i === 0 ? ACC_BG : 'var(--sf)', cursor: 'pointer', transition: 'all 150ms' }}
                          onMouseEnter={e => { (e.currentTarget.style as any).borderColor = ACC }}
                          onMouseLeave={e => { (e.currentTarget.style as any).borderColor = i === 0 ? ACC_BORDER : 'var(--b)' }}>
                          <span style={{ fontSize: 14, width: 22, textAlign: 'center' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{c.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{c.sales} sales · avg {fmt(currencySymbol, c.avgSale)} · {pct.toFixed(0)}% of revenue</div>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, c.revenue)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Stock item deep-dive */}
            {filterModal.type === 'stock_item' && (() => {
              const item = inventory.find(i => i.id === filterModal.item_id)
              if (!item) return <div style={{ fontSize: 13, color: 'var(--tx3)', padding: 20, textAlign: 'center' }}>Item not found.</div>
              const isOut = item.stock_qty === 0
              const statusColor = isOut ? RED : AMBER
              const profitPerUnit = item.sale_price - (item.cost_price || 0)
              const itemMargin = item.sale_price > 0 ? (profitPerUnit / item.sale_price * 100) : 0
              const stockValue = (item.cost_price || 0) * item.stock_qty
              const retailValue = item.sale_price * item.stock_qty
              // Recent sales of this item
              const itemSales = completedTx.filter(t => (t.pos_items || []).some(p => p.inventory_id === item.id || p.name === item.name))
              const totalQtySold = itemSales.flatMap(t => (t.pos_items || []).filter(p => p.inventory_id === item.id || p.name === item.name)).reduce((s, p) => s + p.qty, 0)
              const itemRevenue = itemSales.flatMap(t => (t.pos_items || []).filter(p => p.inventory_id === item.id || p.name === item.name)).reduce((s, p) => s + p.unit_price * p.qty, 0)
              const daysRemaining = totalQtySold > 0 ? Math.round(item.stock_qty / (totalQtySold / Math.max(1, completedTx.length > 0 ? 1 : 1))) : null
              const isExpiring = item.expiry_date && new Date(item.expiry_date).getTime() < Date.now() + 30 * 86400000
              return (
                <div>
                  {/* Status banner */}
                  <div style={{ padding: '12px 14px', borderRadius: 10, background: `${statusColor}08`, border: `1px solid ${statusColor}20`, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: statusColor }}>{isOut ? 'Out of stock' : `Low stock — ${item.stock_qty} remaining`}</div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Threshold: {item.low_stock_threshold} units</div>
                    </div>
                  </div>
                  {/* Detail grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Sale price</div><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, item.sale_price)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Cost price</div><div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tx3)' }}>{fmt(currencySymbol, item.cost_price || 0)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Profit/unit</div><div style={{ fontSize: 16, fontWeight: 800, color: profitPerUnit >= 0 ? GREEN : RED }}>{fmt(currencySymbol, profitPerUnit)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Margin</div><div style={{ fontSize: 16, fontWeight: 800, color: itemMargin >= 20 ? GREEN : itemMargin >= 10 ? AMBER : RED }}>{itemMargin.toFixed(0)}%</div></div>
                  </div>
                  {/* Stock & sales info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Stock value</div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, stockValue)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Retail value</div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{fmt(currencySymbol, retailValue)}</div></div>
                  </div>
                  {/* Sales activity this period */}
                  {totalQtySold > 0 && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--ev)', marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Sales this period</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--tx2)' }}>
                        <span><strong>{totalQtySold}</strong> units sold</span>
                        <span><strong>{fmt(currencySymbol, itemRevenue)}</strong> revenue</span>
                        <span>in <strong>{itemSales.length}</strong> transactions</span>
                      </div>
                    </div>
                  )}
                  {/* Extra info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {item.sku && <div style={{ fontSize: 12, color: 'var(--tx2)' }}>SKU: <strong>{item.sku}</strong></div>}
                    {item.category && <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Category: <strong>{item.category}</strong></div>}
                    {item.supplier && <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Supplier: <strong>{item.supplier}</strong></div>}
                    {item.brand && <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Brand: <strong>{item.brand}</strong></div>}
                    {item.expiry_date && (
                      <div style={{ fontSize: 12, color: isExpiring ? RED : 'var(--tx2)' }}>
                        {isExpiring ? '⚠️ ' : ''}Expires: <strong>{new Date(item.expiry_date).toLocaleDateString()}</strong>
                      </div>
                    )}
                    {item.batch_number && <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Batch: <strong>{item.batch_number}</strong></div>}
                    {item.last_sold_at && <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Last sold: <strong>{new Date(item.last_sold_at).toLocaleDateString()}</strong></div>}
                  </div>
                  {/* Action suggestion */}
                  <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: `${statusColor}06`, border: `1px dashed ${statusColor}30` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: statusColor, marginBottom: 4 }}>Recommended action</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>
                      {isOut ? `This item is out of stock. ${totalQtySold > 0 ? `It sold ${totalQtySold} units recently — reorder urgently to avoid lost sales.` : 'Consider restocking if there is demand.'}` :
                       `Stock is low at ${item.stock_qty} units (threshold: ${item.low_stock_threshold}). ${totalQtySold > 0 ? `At current sell rate, consider reordering soon.` : 'Monitor demand and reorder when needed.'}`}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Payment breakdown deep-dive */}
            {filterModal.type === 'payment_breakdown' && (() => {
              const payTypes = ['cash', 'card', 'mobile']
              const payData = payTypes.map(pt => {
                const txs = completedTx.filter(t => t.payment_type === pt)
                return { type: pt, count: txs.length, revenue: txs.reduce((s, t) => s + t.total, 0), icon: pt === 'cash' ? '💵' : pt === 'card' ? '💳' : '📱' }
              }).filter(p => p.count > 0)
              const totalRev = payData.reduce((s, p) => s + p.revenue, 0)
              const highlighted = filterModal.payment_type || ''
              const highlightedTx = completedTx.filter(t => t.payment_type === highlighted)
              return (
                <div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    {payData.map(p => (
                      <div key={p.type} style={{ flex: 1, ...cardStyle, border: p.type === highlighted ? `2px solid ${ACC}` : '1px solid var(--b)', textAlign: 'center' }}>
                        <div style={{ fontSize: 20 }}>{p.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'capitalize', color: 'var(--tx)', marginTop: 4 }}>{p.type}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: ACC }}>{p.count}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{fmt(currencySymbol, p.revenue)}</div>
                        <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{totalRev > 0 ? (p.revenue / totalRev * 100).toFixed(0) : 0}% of revenue</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{highlighted} transactions today</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                    {highlightedTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || 'Sale'}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(currencySymbol, tx.total)}</div>
                      </div>
                    ))}
                    {highlightedTx.length === 0 && <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No {highlighted} transactions today.</div>}
                  </div>
                </div>
              )
            })()}

            {/* Branch detail deep-dive */}
            {filterModal.type === 'branch_detail' && (() => {
              const branchTx = completedTx.filter(t => t.pos_location_id === filterModal.branch_id)
              const branchRevenue = branchTx.reduce((s, t) => s + t.total, 0)
              const branchAvg = branchTx.length > 0 ? branchRevenue / branchTx.length : 0
              const branchProfit = branchTx.reduce((s, t) => s + (t.pos_items || []).reduce((ps, i) => ps + (i.cost_price ? (i.unit_price - i.cost_price) * i.qty : 0), 0), 0)
              const branchHourly = Array.from({ length: 24 }, (_, i) => ({ label: `${i}:00`, value: 0 }))
              branchTx.forEach(t => { const h = new Date(t.created_at).getHours(); branchHourly[h].value += t.total })
              const activeHours = branchHourly.filter(h => h.value > 0)
              const payBreakdown = ['cash', 'card', 'mobile'].map(pt => ({ type: pt, count: branchTx.filter(t => t.payment_type === pt).length })).filter(p => p.count > 0)
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Sales</div><div style={{ fontSize: 20, fontWeight: 800, color: ACC }}>{branchTx.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Revenue</div><div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, branchRevenue)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Avg sale</div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, branchAvg)}</div></div>
                  </div>
                  {branchProfit > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Profit</div><div style={{ fontSize: 16, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, branchProfit)}</div></div>
                      <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Payment mix</div><div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginTop: 4 }}>{payBreakdown.map(p => `${p.type === 'cash' ? '💵' : p.type === 'card' ? '💳' : '📱'} ${p.count}`).join('  ')}</div></div>
                    </div>
                  )}
                  {activeHours.length > 0 && (
                    <div style={{ ...cardStyle, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>Revenue by hour</div>
                      <MiniBarChart data={activeHours} color={ACC} height={60} />
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Transactions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 250, overflowY: 'auto' }}>
                    {branchTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || 'Sale'}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(currencySymbol, tx.total)}</div>
                      </div>
                    ))}
                    {branchTx.length === 0 && <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No sales at this branch today.</div>}
                  </div>
                </div>
              )
            })()}

            {/* Customer history deep-dive */}
            {filterModal.type === 'customer_history' && (() => {
              const custPhone = filterModal.customer_phone
              const custTx = completedTx.filter(t => t.pos_customers?.phone === custPhone)
              const custRevenue = custTx.reduce((s, t) => s + t.total, 0)
              const custAvg = custTx.length > 0 ? custRevenue / custTx.length : 0
              const custItems = custTx.flatMap(t => (t.pos_items || []).map(i => i.name))
              const favItems: Record<string, number> = {}
              custItems.forEach(n => { favItems[n] = (favItems[n] || 0) + 1 })
              const topItems = Object.entries(favItems).sort((a, b) => b[1] - a[1]).slice(0, 5)
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Visits today</div><div style={{ fontSize: 20, fontWeight: 800, color: ACC }}>{custTx.length}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Total spent</div><div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, custRevenue)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Avg order</div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--tx)' }}>{fmt(currencySymbol, custAvg)}</div></div>
                  </div>
                  {topItems.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Favourite items</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {topItems.map(([name, count]) => (
                          <span key={name} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 9999, background: ACC_BG, border: `1px solid ${ACC_BORDER}`, color: ACC, fontWeight: 600 }}>{name} ×{count}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Orders</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 250, overflowY: 'auto' }}>
                    {custTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || 'Sale'}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {tx.payment_type}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(currencySymbol, tx.total)}</div>
                      </div>
                    ))}
                    {custTx.length === 0 && <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No transactions found for this customer today.</div>}
                  </div>
                </div>
              )
            })()}

            {/* Product history deep-dive */}
            {filterModal.type === 'product_history' && (() => {
              const prodName = filterModal.product_name
              const item = inventory.find(i => i.id === filterModal.item_id || i.name === prodName)
              const prodTx = completedTx.filter(t => (t.pos_items || []).some(p => p.name === prodName))
              const totalQty = prodTx.flatMap(t => (t.pos_items || []).filter(p => p.name === prodName)).reduce((s, p) => s + p.qty, 0)
              const totalRev = prodTx.flatMap(t => (t.pos_items || []).filter(p => p.name === prodName)).reduce((s, p) => s + p.unit_price * p.qty, 0)
              const totalCostP = prodTx.flatMap(t => (t.pos_items || []).filter(p => p.name === prodName)).reduce((s, p) => s + (p.cost_price || 0) * p.qty, 0)
              const prodProfit = totalRev - totalCostP
              const prodMargin = totalRev > 0 ? (prodProfit / totalRev * 100) : 0
              const hourly = Array.from({ length: 24 }, (_, i) => ({ label: `${i}:00`, value: 0 }))
              prodTx.forEach(t => { const h = new Date(t.created_at).getHours(); const qty = (t.pos_items || []).filter(p => p.name === prodName).reduce((s, p) => s + p.qty, 0); hourly[h].value += qty })
              const activeHours = hourly.filter(h => h.value > 0)
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Units sold</div><div style={{ fontSize: 20, fontWeight: 800, color: ACC }}>{totalQty}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Revenue</div><div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>{fmt(currencySymbol, totalRev)}</div></div>
                    <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Transactions</div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--tx)' }}>{prodTx.length}</div></div>
                  </div>
                  {totalCostP > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Profit</div><div style={{ fontSize: 16, fontWeight: 800, color: prodProfit >= 0 ? GREEN : RED }}>{fmt(currencySymbol, prodProfit)}</div></div>
                      <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Margin</div><div style={{ fontSize: 16, fontWeight: 800, color: prodMargin >= 30 ? GREEN : prodMargin >= 15 ? AMBER : RED }}>{prodMargin.toFixed(0)}%</div></div>
                      <div style={cardStyle}><div style={{ fontSize: 10, color: 'var(--tx3)' }}>Stock left</div><div style={{ fontSize: 16, fontWeight: 800, color: item && item.stock_qty <= (item.low_stock_threshold || 5) ? RED : 'var(--tx)' }}>{item?.stock_qty ?? '—'}</div></div>
                    </div>
                  )}
                  {item && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)' }}>Price: {fmt(currencySymbol, item.sale_price)}</span>
                      {item.cost_price ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)' }}>Cost: {fmt(currencySymbol, item.cost_price)}</span> : null}
                      {item.category ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)' }}>{item.category}</span> : null}
                      {item.brand ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)' }}>{item.brand}</span> : null}
                      {item.supplier ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)' }}>{item.supplier}</span> : null}
                    </div>
                  )}
                  {activeHours.length > 0 && (
                    <div style={{ ...cardStyle, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>Units sold by hour</div>
                      <MiniBarChart data={activeHours} color={ACC} height={60} />
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Transactions containing this product</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 250, overflowY: 'auto' }}>
                    {prodTx.map(tx => (
                      <div key={tx.id} onClick={() => { setFilterModal(null); setTxDetail(tx) }} style={{ ...cardStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{(tx.pos_items || []).map(i => i.name).join(', ') || 'Sale'}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(currencySymbol, tx.total)}</div>
                      </div>
                    ))}
                    {prodTx.length === 0 && <div style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', padding: 20 }}>No sales of this product today.</div>}
                  </div>
                </div>
              )
            })()}

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {lastTxDetail && (
                <button onClick={() => { setFilterModal(null); setTxDetail(lastTxDetail); setLastTxDetail(null) }} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${ACC}30`, background: `${ACC}08`, color: ACC, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>← Back to transaction</button>
              )}
              <button onClick={() => { setFilterModal(null); setLastTxDetail(null) }} style={btnSecondary}>Close</button>
            </div>
          </div>
        </>

      )}

      {/* Refund modal */}
      {refundTx && (
        <>
          <div onClick={() => setRefundTx(null)} style={modalOverlay} />
          <div style={modalBox}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Process refund</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 20 }}>Sale #{refundTx.id.slice(0, 8)} · {fmt(currencySymbol, refundTx.total)} · {refundTx.cashier?.name || 'Owner'}</div>
            <div style={{ border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              {(refundTx.pos_items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < refundTx.pos_items.length - 1 ? '1px solid var(--b)' : 'none', fontSize: 13 }}>
                  <span style={{ color: 'var(--tx)' }}>{item.name} x{item.qty}</span>
                  <span style={{ fontWeight: 600 }}>{fmt(currencySymbol, item.unit_price)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Reason (required)</div>
              <select value={refundReason} onChange={e => setRefundReason(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                <option value="">Select reason...</option>
                <option value="Customer changed mind">Customer changed mind</option>
                <option value="Wrong item scanned">Wrong item scanned</option>
                <option value="Defective product">Defective product</option>
                <option value="Duplicate charge">Duplicate charge</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleRefund(true)} disabled={!refundReason || refunding} style={{ flex: 1, padding: 12, borderRadius: 10, background: RED, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: !refundReason || refunding ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: !refundReason ? 0.5 : 1 }}>
                {refunding ? 'Processing...' : 'Full refund'}
              </button>
              <button onClick={() => setRefundTx(null)} style={{ flex: 1, ...btnSecondary, padding: 12, fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </>
      )}

      </div>

      {/* Inject keyframes for animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: .5; } 50% { opacity: .8; } }
      `}</style>
    </div>
  )
}
