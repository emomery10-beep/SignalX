'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const ACC = '#d08a59'
const ACC_BG = 'rgba(208,138,89,.08)'
const ACC_BORDER = 'rgba(208,138,89,.2)'

interface StaffMember {
  id: string
  name: string
  phone: string
  role: 'cashier' | 'inventory'
  active: boolean
  last_login_at: string | null
}

interface Transaction {
  id: string
  total: number
  payment_type: string
  status: string
  created_at: string
  cashier: { name: string } | null
  pos_items: { name: string; qty: number; unit_price: number }[]
}

interface InventoryItem {
  id: string
  name: string
  sale_price: number
  stock_qty: number
  low_stock_threshold: number
  last_sold_at: string | null
}

type Tab = 'overview' | 'staff' | 'inventory' | 'audit'

export default function POSPage() {
  const supabase = createClient()
  const [tab, setTab]                 = useState<Tab>('overview')
  const [staff, setStaff]             = useState<StaffMember[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [inventory, setInventory]     = useState<InventoryItem[]>([])
  const [loading, setLoading]         = useState(true)
  const [currencySymbol, setCurrencySymbol] = useState('£')
  const [posEnabled, setPosEnabled] = useState<boolean | null>(null)
  const [seatCount, setSeatCount]   = useState(0)

  // Refund state
  const [refundTx, setRefundTx]         = useState<Transaction | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [refunding, setRefunding]       = useState(false)

  // Add staff form
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [newPhone, setNewPhone]         = useState('')
  const [newEmail, setNewEmail]         = useState('')
  const [newName, setNewName]           = useState('')
  const [newRole, setNewRole]           = useState<'cashier' | 'inventory'>('cashier')
  const [newPin, setNewPin]             = useState('')
  const [addingStaff, setAddingStaff]   = useState(false)

  // Edit staff form
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [editPhone, setEditPhone]       = useState('')
  const [editEmail, setEditEmail]       = useState('')
  const [editName, setEditName]         = useState('')
  const [editPin, setEditPin]           = useState('')
  const [editingSubmitting, setEditingSubmitting] = useState(false)

  // Add product form
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5' })
  const [addingProduct, setAddingProduct] = useState(false)
  const [recognizing, setRecognizing] = useState(false)
  const [recognizedProducts, setRecognizedProducts] = useState<any[]>([])
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCameraMenu, setShowCameraMenu] = useState(false)
  const [showCameraPreview, setShowCameraPreview] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // ── Date range filter (NEW) ──────────────────────────
  type DateRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom'
  const [dateRange, setDateRange] = useState<DateRange>('today')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  // ── Transaction detail modal (NEW) ──────────────────────
  type FilterType = 'sales' | 'refunds' | 'low_stock' | 'cashier_detail'
  const [filterModal, setFilterModal] = useState<{
    type: FilterType
    title: string
    cashier_id?: string
  } | null>(null)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('currency_symbol, pos_enabled, pos_seat_count')
        .eq('id', user.id)
        .single()
      if (profile?.currency_symbol) setCurrencySymbol(profile.currency_symbol)
      setPosEnabled(profile?.pos_enabled ?? false)
      setSeatCount((profile as any)?.pos_seat_count ?? 0)

      const [staffRes, txRes, invRes] = await Promise.all([
        fetch('/api/pos/staff'),
        fetch(`/api/pos/transactions?from=${new Date(Date.now() - 86400000).toISOString()}`),
        fetch('/api/pos/inventory'),
      ])

      const [staffData, txData, invData] = await Promise.all([
        staffRes.json(), txRes.json(), invRes.json(),
      ])

      setStaff(staffData.staff || [])
      setTransactions(txData.transactions || [])
      setInventory(invData.inventory || [])
      setLoading(false)
    }
    init()
  }, [])

  // ── Helper functions for date range (NEW) ─────────────────
  const getDateRangeDetails = (range: DateRange): { start: Date; end: Date; label: string } => {
    const now = new Date()
    const start = new Date()
    let label = ''

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0)
        label = `Today · ${now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
        break
      case 'yesterday':
        start.setDate(start.getDate() - 1)
        start.setHours(0, 0, 0, 0)
        label = `Yesterday · ${start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
        break
      case 'last7':
        start.setDate(start.getDate() - 7)
        start.setHours(0, 0, 0, 0)
        label = `Last 7 days`
        break
      case 'last30':
        start.setDate(start.getDate() - 30)
        start.setHours(0, 0, 0, 0)
        label = `Last 30 days`
        break
      case 'custom':
        return {
          start: customStart ? new Date(customStart) : start,
          end: customEnd ? new Date(customEnd) : now,
          label: `${customStart} to ${customEnd}`,
        }
    }

    return { start, end: now, label }
  }

  // Update filtered transactions based on date range
  const dateRangeDetails = getDateRangeDetails(dateRange)
  const filteredTx = transactions.filter(
    t => new Date(t.created_at) >= dateRangeDetails.start && new Date(t.created_at) <= dateRangeDetails.end
  )

  // ── Derived stats ─────────────────────────────────────────
  const todayRevenue  = filteredTx.filter(t => t.status === 'completed').reduce((s, t) => s + t.total, 0)
  const todaySales    = filteredTx.filter(t => t.status === 'completed').length
  const refundCount   = filteredTx.filter(t => t.status === 'refunded' || t.status === 'partially_refunded').length
  const lowStock      = inventory.filter(i => i.stock_qty <= i.low_stock_threshold && i.stock_qty > 0)
  const outOfStock    = inventory.filter(i => i.stock_qty === 0)

  // Per-cashier stats
  const cashierStats = staff
    .filter(s => s.role === 'cashier')
    .map(s => {
      const txs = filteredTx.filter(t => t.cashier?.name === s.name && t.status === 'completed')
      return { ...s, sales: txs.length, revenue: txs.reduce((sum, t) => sum + t.total, 0) }
    })
    .sort((a, b) => b.revenue - a.revenue)

  // ── Get filtered transactions for modal ──────────────────
  const getModalTransactions = (): Transaction[] => {
    if (!filterModal) return []

    let filtered = filteredTx

    if (filterModal.type === 'sales') {
      filtered = filtered.filter(t => t.status === 'completed')
    } else if (filterModal.type === 'refunds') {
      filtered = filtered.filter(t => t.status === 'refunded' || t.status === 'partially_refunded')
    } else if (filterModal.type === 'low_stock') {
      const lowStockNames = new Set([...lowStock, ...outOfStock].map(i => i.name))
      filtered = filtered.filter(t =>
        t.pos_items?.some(item => lowStockNames.has(item.name))
      )
    } else if (filterModal.type === 'cashier_detail' && filterModal.cashier_id) {
      filtered = filtered.filter(t => t.cashier?.name === filterModal.cashier_id)
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const handleRefund = async (full: boolean) => {
    if (!refundTx || !refundReason) return
    setRefunding(true)
    await fetch('/api/pos/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: refundTx.id, full_refund: full, reason: refundReason }),
    })
    setTransactions(prev => prev.map(t => t.id === refundTx.id ? { ...t, status: full ? 'refunded' : 'partially_refunded' } : t))
    setRefundTx(null); setRefundReason(''); setRefunding(false)
  }

  const handleExport = () => {
    const from = new Date(); from.setDate(from.getDate() - 30)
    window.open(`/api/pos/export?from=${from.toISOString()}&to=${new Date().toISOString()}`, '_blank')
  }

  const handleExportVAT = () => {
    window.open('/api/pos/vat', '_blank')
  }

  const handleAddStaff = async () => {
    if ((!newPhone && !newEmail) || !newName) return
    if (newPin && (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin))) {
      alert('PIN must be 4–6 digits'); return
    }
    setAddingStaff(true)
    const res = await fetch('/api/pos/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: newPhone || undefined, email: newEmail || undefined, name: newName, role: newRole, pin: newPin || undefined }),
    })
    const data = await res.json()
    if (data.staff) {
      setStaff(prev => [...prev, data.staff])
      setNewPhone(''); setNewEmail(''); setNewName(''); setNewRole('cashier'); setNewPin('')
      setShowAddStaff(false)
    } else if (data.seat_limit) {
      alert(data.error)
    }
    setAddingStaff(false)
  }

  const handleToggleStaff = async (member: StaffMember) => {
    const res = await fetch('/api/pos/staff', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: member.id, active: !member.active }),
    })
    const data = await res.json()
    if (data.staff) setStaff(prev => prev.map(s => s.id === member.id ? data.staff : s))
    else if (data.seat_limit) alert(data.error)
  }

  const handleEditStaff = async () => {
    if (!editingStaff || (!editPhone && !editEmail) || !editName) return
    if (editPin && (editPin.length < 4 || editPin.length > 6 || !/^\d+$/.test(editPin))) {
      alert('PIN must be 4–6 digits'); return
    }
    setEditingSubmitting(true)
    const res = await fetch('/api/pos/staff', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingStaff.id,
        phone: editPhone || undefined,
        email: editEmail || undefined,
        name: editName,
        pin: editPin || undefined,
      }),
    })
    const data = await res.json()
    if (data.staff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? data.staff : s))
      setEditingStaff(null)
    } else if (data.error) {
      alert('Error: ' + data.error)
    }
    setEditingSubmitting(false)
  }

  const handleOpenEditStaff = (member: StaffMember) => {
    setEditingStaff(member)
    setEditName(member.name)
    setEditPhone(member.phone || '')
    setEditEmail(member.email || '')
    setEditPin('')
  }

  // Wire up stream → video element after the modal mounts
  useEffect(() => {
    if (showCameraPreview && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [showCameraPreview])

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      setShowCameraPreview(true)  // effect above will wire srcObject after render
      setShowCameraMenu(false)
    } catch (err: any) {
      alert('Camera access denied or not available: ' + err.message)
    }
  }

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const context = canvasRef.current.getContext('2d')
    if (!context) return

    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    context.drawImage(videoRef.current, 0, 0)

    canvasRef.current.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        handleImageCapture(file)
        handleCloseCamera()
      }
    }, 'image/jpeg', 0.9)
  }

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCameraPreview(false)
  }

  const handleImageCapture = async (file: File) => {
    setRecognizing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/pos/recognize-inventory', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.products && data.products.length > 0) {
        setRecognizedProducts(data.products)
      } else {
        alert('Could not recognize products from image')
      }
    } catch (err) {
      alert('Image recognition failed: ' + (err as any).message)
    }
    setRecognizing(false)
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sale_price) return
    setAddingProduct(true)
    const res = await fetch('/api/pos/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:                newProduct.name,
        sale_price:          parseFloat(newProduct.sale_price),
        cost_price:          parseFloat(newProduct.cost_price || '0'),
        stock_qty:           parseInt(newProduct.stock_qty || '0'),
        low_stock_threshold: parseInt(newProduct.low_stock_threshold || '5'),
      }),
    })
    const data = await res.json()
    if (data.product) {
      setInventory(prev => [...prev, data.product])
      setNewProduct({ name: '', sale_price: '', cost_price: '', stock_qty: '', low_stock_threshold: '5' })
      setShowAddProduct(false)
    }
    setAddingProduct(false)
  }

  if (loading || posEnabled === null) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--tx3)', fontSize: 14 }}>
      Loading POS...
    </div>
  )

  if (!posEnabled) return (
    <div className="page-shell">
      <div className="page-shell-header">
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>Point of Sale</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: ACC_BG, border: `1px solid ${ACC_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.8" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Point of Sale</div>
          <p style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.7, marginBottom: 24 }}>
            Turn any phone into a till. Add cashier and inventory staff seats to unlock the POS system — camera price scanning, WhatsApp receipts, live stock tracking, and BI insights all in one place.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginBottom: 28 }}>
            {[
              'Cashier & inventory roles with WhatsApp OTP login',
              'Camera price scanning powered by Claude AI',
              'Auto stock deduction + restock alerts',
              'WhatsApp receipts to customers',
              'MTD-compatible VAT export',
              'Sales feed directly into your BI dashboard',
            ].map(f => (
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

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-shell-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>Point of Sale</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{dateRangeDetails.label}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleExportVAT} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            MTD VAT
          </button>
          <button onClick={handleExport} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <a href="https://pos.askbiz.co" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 14px', borderRadius: 9, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Open till
          </a>
        </div>
      </div>

      <div className="page-shell-body">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--b)', paddingBottom: 0 }}>
          {(['overview', 'staff', 'inventory', 'audit'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none',
                background: tab === t ? 'var(--sf)' : 'transparent',
                color: tab === t ? 'var(--tx)' : 'var(--tx3)',
                fontSize: 13, fontWeight: tab === t ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: tab === t ? `2px solid ${ACC}` : '2px solid transparent',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Date Range Selector (NEW) ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {['today', 'yesterday', 'last7', 'last30'].map(range => (
              <button
                key={range}
                onClick={() => {
                  setDateRange(range as DateRange)
                  setCustomStart('')
                  setCustomEnd('')
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: dateRange === range ? `1.5px solid ${ACC}` : '1px solid var(--b)',
                  background: dateRange === range ? ACC_BG : 'var(--sf)',
                  color: dateRange === range ? ACC : 'var(--tx2)',
                  fontSize: 12,
                  fontWeight: dateRange === range ? 600 : 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                {range === 'today'
                  ? '📅 Today'
                  : range === 'yesterday'
                    ? '📅 Yesterday'
                    : range === 'last7'
                      ? '📅 Last 7 days'
                      : '📅 Last 30 days'}
              </button>
            ))}

            {/* Custom date range */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="date"
                value={customStart}
                onChange={e => {
                  setCustomStart(e.target.value)
                  setDateRange('custom')
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--b)',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--tx3)' }}>to</span>
              <input
                type="date"
                value={customEnd}
                onChange={e => {
                  setCustomEnd(e.target.value)
                  setDateRange('custom')
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--b)',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        )}

        {/* ── OVERVIEW TAB ─────────────────────────────────── */}
        {tab === 'overview' && (
          <div style={{ maxWidth: 800 }}>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { label: "Today's revenue",  value: `${currencySymbol}${todayRevenue.toLocaleString()}`, color: '#16a34a', type: 'sales' as const },
                { label: 'Sales',            value: todaySales.toString(),                               color: ACC, type: 'sales' as const },
                { label: 'Refunds',          value: refundCount.toString(),                              color: refundCount > 2 ? '#dc2626' : 'var(--tx)', type: 'refunds' as const },
                { label: 'Low stock alerts', value: (lowStock.length + outOfStock.length).toString(),    color: (lowStock.length + outOfStock.length) > 0 ? '#dc2626' : '#16a34a', type: 'low_stock' as const },
              ].map((kpi, i) => (
                <div key={i} onClick={() => setFilterModal({ type: kpi.type, title: kpi.label })} style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', cursor: 'pointer', transition: 'all 200ms', transform: 'scale(1)' }} onMouseEnter={(e) => { (e.currentTarget as any).style.transform = 'scale(1.02)'; (e.currentTarget as any).style.borderColor = ACC }} onMouseLeave={(e) => { (e.currentTarget as any).style.transform = 'scale(1)'; (e.currentTarget as any).style.borderColor = 'var(--b)' }}>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 6 }}>{kpi.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color, letterSpacing: '-.02em' }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Cashier performance */}
            {cashierStats.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Staff performance today</div>
                <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  {cashierStats.map((c, i) => (
                    <div key={c.id} onClick={() => setFilterModal({ type: 'cashier_detail', title: `${c.name}'s transactions`, cashier_id: c.name })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < cashierStats.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', cursor: 'pointer', transition: 'background 200ms' }} onMouseEnter={(e) => { (e.currentTarget as any).style.background = 'rgba(208,138,89,.04)' }} onMouseLeave={(e) => { (e.currentTarget as any).style.background = 'var(--sf)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: ACC_BG, border: `1px solid ${ACC_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: ACC }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{c.sales} sales</div>
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
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Stock alerts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {outOfStock.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{item.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>OUT OF STOCK</span>
                    </div>
                  ))}
                  {lowStock.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(234,179,8,.06)', border: '1px solid rgba(234,179,8,.25)' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{item.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#ca8a04' }}>{item.stock_qty} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent transactions */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Recent transactions</div>
              {filteredTx.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--tx3)', fontSize: 13, border: '1px solid var(--b)', borderRadius: 12 }}>
                  No sales in this period. Share <strong>pos.askbiz.co</strong> with your cashiers to get started.
                </div>
              ) : (
                <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  {filteredTx.slice(0, 10).map((tx, i) => (
                    <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < Math.min(filteredTx.length, 10) - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>
                          {(tx.pos_items || []).slice(0, 2).map(i => i.name).join(', ')}
                          {(tx.pos_items?.length ?? 0) > 2 && ` +${tx.pos_items.length - 2} more`}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                          {tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {tx.payment_type}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {tx.status !== 'completed' && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', background: 'rgba(220,38,38,.08)', padding: '2px 7px', borderRadius: 9999 }}>
                            {tx.status}
                          </span>
                        )}
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{currencySymbol}{tx.total.toFixed(2)}</div>
                        {tx.status === 'completed' && (
                          <button onClick={() => { setRefundTx(tx); setRefundReason('') }} style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid rgba(220,38,38,.25)', background: 'rgba(220,38,38,.06)', color: '#dc2626', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Refund
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STAFF TAB ────────────────────────────────────── */}
        {tab === 'staff' && (
          <div style={{ maxWidth: 640 }}>
            {(() => {
              const activeStaff = staff.filter(s => s.active).length
              const atLimit = activeStaff >= seatCount
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>
                    {activeStaff} of {seatCount} seat{seatCount !== 1 ? 's' : ''} used
                    {atLimit && (
                      <span style={{ marginLeft: 8, color: '#dc2626', fontWeight: 600 }}>
                        · <a href="/billing" style={{ color: '#dc2626' }}>Add seats →</a>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => atLimit ? window.location.href = '/billing' : setShowAddStaff(true)}
                    style={{ padding: '8px 14px', borderRadius: 9, background: atLimit ? '#dc2626' : ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {atLimit ? 'Upgrade seats →' : '+ Add staff'}
                  </button>
                </div>
              )
            })()}

            {showAddStaff && (
              <div style={{ marginBottom: 16, padding: '16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New staff member</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    placeholder="Full name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                  <input
                    placeholder="Phone number (e.g. +447911123456)"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center' }}>— or —</div>
                  <input
                    placeholder="Email address (alternative to WhatsApp)"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    type="email"
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as 'cashier' | 'inventory')}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}
                  >
                    <option value="cashier">Cashier — can process sales</option>
                    <option value="inventory">Inventory — can manage stock</option>
                  </select>
                  <input
                    placeholder="PIN (4–6 digits) — required for POS login"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${newPin && newPin.length >= 4 ? 'rgba(22,163,74,.4)' : 'var(--b2)'}`, fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)', letterSpacing: '0.15em' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleAddStaff} disabled={addingStaff} style={{ padding: '9px 16px', borderRadius: 8, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {addingStaff ? 'Adding...' : 'Add staff member'}
                    </button>
                    <button onClick={() => setShowAddStaff(false)} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }}>
                      Cancel
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>
                    They'll log in at <strong>pos.askbiz.co</strong> using their phone (WhatsApp code) or email address.
                  </div>
                </div>
              </div>
            )}

            {staff.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--tx3)', fontSize: 13, border: '1px solid var(--b)', borderRadius: 12 }}>
                No staff added yet. Add your first cashier or inventory manager above.
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                {staff.map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < staff.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)', opacity: s.active ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.active ? ACC_BG : 'var(--ev)', border: `1px solid ${s.active ? ACC_BORDER : 'var(--b)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: s.active ? ACC : 'var(--tx3)' }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span>{s.role}</span>
                          {s.phone && <span>· {s.phone}</span>}
                          {(s as any).has_pin
                            ? <span style={{ color: '#16a34a', fontWeight: 600 }}>· PIN ✓</span>
                            : <span style={{ color: '#dc2626', fontWeight: 600 }}>· No PIN set</span>}
                          {s.last_login_at && <span>· Last login {new Date(s.last_login_at).toLocaleDateString('en-GB')}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleOpenEditStaff(s)}
                        style={{
                          padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid var(--b)',
                          background: 'transparent', color: 'var(--tx2)'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStaff(s)}
                        style={{
                          padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                          background: s.active ? 'rgba(220,38,38,.08)' : 'rgba(22,163,74,.08)',
                          color: s.active ? '#dc2626' : '#16a34a',
                        }}
                      >
                        {s.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── EDIT STAFF MODAL ─────────────────────────────── */}
            {editingStaff && (
              <div style={{ marginTop: 16, padding: '16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Edit {editingStaff.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  <input
                    placeholder="Full name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                  <input
                    placeholder="Phone number"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center' }}>— or —</div>
                  <input
                    placeholder="Email address"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    type="email"
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                  <input
                    placeholder={`New PIN (4–6 digits)${(editingStaff as any)?.has_pin ? ' — leave blank to keep current' : ' — required for POS login'}`}
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${editPin && editPin.length >= 4 ? 'rgba(22,163,74,.4)' : 'var(--b2)'}`, fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)', letterSpacing: '0.15em' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleEditStaff}
                    disabled={editingSubmitting}
                    style={{ padding: '9px 16px', borderRadius: 8, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {editingSubmitting ? 'Saving...' : 'Save changes'}
                  </button>
                  <button
                    onClick={() => setEditingStaff(null)}
                    style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── INVENTORY TAB ─────────────────────────────────── */}
        {tab === 'inventory' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{inventory.length} products</div>
              <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageCapture(e.target.files[0]) }}
                  style={{ display: 'none' }}
                  capture="environment"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageCapture(e.target.files[0]) }}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => setShowCameraMenu(!showCameraMenu)}
                  disabled={recognizing}
                  style={{ padding: '8px 14px', borderRadius: 9, background: 'var(--ev)', color: 'var(--tx)', fontSize: 13, fontWeight: 600, border: '1px solid var(--b)', cursor: recognizing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: recognizing ? 0.6 : 1 }}
                >
                  {recognizing ? 'Reading...' : '📷 Read inventory'}
                </button>
                {showCameraMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', zIndex: 10, minWidth: 160 }}>
                    <button
                      onClick={handleOpenCamera}
                      style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--tx)', borderBottom: '1px solid var(--b)', fontFamily: 'inherit' }}
                    >
                      📸 Take photo
                    </button>
                    <button
                      onClick={() => { fileInputRef.current?.click(); setShowCameraMenu(false) }}
                      style={{ width: '100%', padding: '12px 16px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--tx)', fontFamily: 'inherit' }}
                    >
                      📁 Upload file
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowAddProduct(true)}
                  style={{ padding: '8px 14px', borderRadius: 9, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  + Add product
                </button>
              </div>
            </div>

            {/* ── CAMERA PREVIEW MODAL ─────────────────────────── */}
            {showCameraPreview && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', maxWidth: '600px', borderRadius: 12, marginBottom: 16 }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    onClick={handleCapturePhoto}
                    disabled={recognizing}
                    style={{
                      padding: '12px 28px',
                      borderRadius: 10,
                      background: ACC,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      border: 'none',
                      cursor: recognizing ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    {recognizing ? 'Processing...' : '📷 Capture photo'}
                  </button>
                  <button
                    onClick={handleCloseCamera}
                    disabled={recognizing}
                    style={{
                      padding: '12px 28px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,.3)',
                      background: 'transparent',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: recognizing ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {recognizedProducts.length > 0 && (
              <div style={{ marginBottom: 16, padding: '16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--ev)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📷 Recognized {recognizedProducts.length} product{recognizedProducts.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setRecognizedProducts([])} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', cursor: 'pointer', fontSize: 12 }}>Clear</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recognizedProducts.map((p: any, i: number) => (
                    <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--sf)', border: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{p.category} • {p.confidence}% confident</div>
                      </div>
                      <button
                        onClick={() => {
                          setNewProduct({ name: p.name, sale_price: '', cost_price: '', stock_qty: (p.quantity || 1).toString(), low_stock_threshold: '5' })
                          setShowAddProduct(true)
                          setRecognizedProducts(prev => prev.filter((_: any, idx: number) => idx !== i))
                        }}
                        style={{ padding: '6px 12px', borderRadius: 7, background: ACC, color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

                        {showAddProduct && (
              <div style={{ marginBottom: 16, padding: '16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New product</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input placeholder="Product name" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} style={{ gridColumn: '1/-1', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }} />
                  <input placeholder="Sale price" type="number" value={newProduct.sale_price} onChange={e => setNewProduct(p => ({ ...p, sale_price: e.target.value }))} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }} />
                  <input placeholder="Cost price (optional)" type="number" value={newProduct.cost_price} onChange={e => setNewProduct(p => ({ ...p, cost_price: e.target.value }))} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }} />
                  <input placeholder="Starting stock qty" type="number" value={newProduct.stock_qty} onChange={e => setNewProduct(p => ({ ...p, stock_qty: e.target.value }))} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }} />
                  <input placeholder="Low stock alert at" type="number" value={newProduct.low_stock_threshold} onChange={e => setNewProduct(p => ({ ...p, low_stock_threshold: e.target.value }))} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={handleAddProduct} disabled={addingProduct} style={{ padding: '9px 16px', borderRadius: 8, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {addingProduct ? 'Adding...' : 'Add product'}
                  </button>
                  <button onClick={() => setShowAddProduct(false)} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {inventory.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--tx3)', fontSize: 13, border: '1px solid var(--b)', borderRadius: 12 }}>
                No products yet. Add your first product above or your cashiers can scan items to add them on the fly.
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', padding: '10px 16px', background: 'var(--ev)', fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  <span>Product</span><span style={{ textAlign: 'right' }}>Price</span><span style={{ textAlign: 'right' }}>Stock</span><span style={{ textAlign: 'right' }}>Status</span>
                </div>
                {inventory.map((item, i) => {
                  const isOut  = item.stock_qty === 0
                  const isLow  = !isOut && item.stock_qty <= item.low_stock_threshold
                  const status = isOut ? { label: 'Out', color: '#dc2626', bg: 'rgba(220,38,38,.08)' }
                               : isLow ? { label: 'Low', color: '#ca8a04', bg: 'rgba(234,179,8,.08)' }
                               :          { label: 'OK',  color: '#16a34a', bg: 'rgba(22,163,74,.08)' }
                  return (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', padding: '12px 16px', borderTop: i === 0 ? 'none' : '1px solid var(--b)', background: 'var(--sf)', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{item.name}</div>
                        {item.last_sold_at && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Last sold {new Date(item.last_sold_at).toLocaleDateString('en-GB')}</div>}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', textAlign: 'right' }}>{currencySymbol}{item.sale_price.toFixed(2)}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', textAlign: 'right' }}>{item.stock_qty}</div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: status.color, background: status.bg, padding: '3px 8px', borderRadius: 9999 }}>{status.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {/* ── AUDIT TAB ─────────────────────────────────── */}
        {tab === 'audit' && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16 }}>
              All amendments and refunds are logged here automatically.
            </div>
            {transactions.filter(t => t.status !== 'completed').length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--tx3)', fontSize: 13, border: '1px solid var(--b)', borderRadius: 12 }}>
                No amendments or refunds yet. Clean record.
              </div>
            ) : (
              <div style={{ border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                {transactions.filter(t => t.status !== 'completed').map((tx, i, arr) => (
                  <div key={tx.id} style={{ padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--b)' : 'none', background: 'var(--sf)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: tx.status === 'refunded' ? '#dc2626' : '#ca8a04', background: tx.status === 'refunded' ? 'rgba(220,38,38,.08)' : 'rgba(234,179,8,.08)', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase' }}>
                          {tx.status.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>Sale #{tx.id.slice(0, 8)}</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#dc2626' }}>−{currencySymbol}{tx.total.toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
                      {tx.cashier?.name || 'Owner'} · {new Date(tx.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── TRANSACTION DETAIL MODAL ───────────────────────── */}
      {filterModal && (
        <>
          <div onClick={() => setFilterModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: 'var(--sf)', borderRadius: 16, padding: '24px', width: '90%', maxWidth: 900, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>{filterModal.title}</div>
              <button onClick={() => setFilterModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--tx3)' }}>✕</button>
            </div>

            {/* Transaction table */}
            {getModalTransactions().length > 0 ? (
              <div style={{ border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--b)' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--tx3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Time</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--tx3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Cashier</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--tx3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Items</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--tx3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Payment</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--tx3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Amount</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: 'var(--tx3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getModalTransactions().map((tx, i) => (
                      <tr key={tx.id} style={{ borderBottom: i < getModalTransactions().length - 1 ? '1px solid var(--b)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,.01)' }}>
                        <td style={{ padding: '10px 12px', color: 'var(--tx)', whiteSpace: 'nowrap' }}>
                          {new Date(tx.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--tx)' }}>{tx.cashier?.name || 'Owner'}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--tx)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tx.pos_items?.slice(0, 2).map(i => i.name).join(', ')}
                          {tx.pos_items && tx.pos_items.length > 2 && ` +${tx.pos_items.length - 2}`}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--tx3)', fontSize: 12 }}>{tx.payment_type}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--tx)', textAlign: 'right', fontWeight: 600 }}>{currencySymbol}{tx.total.toFixed(2)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 4, background: tx.status === 'completed' ? 'rgba(22,163,74,.1)' : 'rgba(220,38,38,.1)', color: tx.status === 'completed' ? '#16a34a' : '#dc2626' }}>
                            {tx.status === 'completed' ? '✓' : tx.status === 'refunded' ? 'Refunded' : 'Partial'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx3)' }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>No transactions found</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── REFUND MODAL ────────────────────────────────── */}
      {refundTx && (
        <>
          <div onClick={() => setRefundTx(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 101, background: 'var(--sf)', borderRadius: 20, padding: '28px', width: '90%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Process refund</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 20 }}>
              Sale #{refundTx.id.slice(0, 8)} · {currencySymbol}{refundTx.total.toFixed(2)} · {refundTx.cashier?.name || 'Owner'}
            </div>

            {/* Items */}
            <div style={{ border: '1px solid var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              {refundTx.pos_items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < refundTx.pos_items.length - 1 ? '1px solid var(--b)' : 'none', fontSize: 13 }}>
                  <span style={{ color: 'var(--tx)' }}>{item.name} ×{item.qty}</span>
                  <span style={{ fontWeight: 600 }}>{currencySymbol}{item.unit_price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Reason (required)</div>
              <select value={refundReason} onChange={e => setRefundReason(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--b2)', fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--tx)' }}>
                <option value="">Select reason...</option>
                <option value="Customer changed mind">Customer changed mind</option>
                <option value="Wrong item scanned">Wrong item scanned</option>
                <option value="Defective product">Defective product</option>
                <option value="Duplicate charge">Duplicate charge</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleRefund(true)} disabled={!refundReason || refunding} style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: !refundReason || refunding ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: !refundReason ? 0.5 : 1 }}>
                {refunding ? 'Processing...' : 'Full refund'}
              </button>
              <button onClick={() => setRefundTx(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx2)' }}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
