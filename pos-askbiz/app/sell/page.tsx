'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CashierCopilot from '@/components/CashierCopilot'
import PosCardPayment from '@/components/PosCardPayment'
import PosMobilePayment from '@/components/PosMobilePayment'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface CartItem {
  inventory_id?: string
  name: string
  qty: number
  unit?: string
  unit_price: number
  cost_price: number
  notes?: string
}

interface InventoryItem {
  id: string
  name: string
  sku?: string
  sale_price: number
  cost_price: number
  stock_qty: number
  low_stock_threshold?: number
  unit?: string
  expiry_date?: string | null
}

interface StaffSession {
  id: string
  name: string
  role: string
  owner_id: string
  location_id?: string
  currency_symbol: string
  business_type: string
}

type Screen = 'home' | 'add' | 'cart' | 'checkout' | 'receipt'
type AddMode = 'camera' | 'search'

// Business-type adaptive labels
function bizLabel(type: string) {
  const t = (type || '').toLowerCase()
  if (['restaurant', 'cafe', 'café', 'food', 'bar', 'takeaway'].some(k => t.includes(k)))
    return { sale: 'New Order', item: 'Add items', heading: 'Order', table: true }
  if (['salon', 'barber', 'barbershop', 'spa', 'beauty', 'service', 'clinic'].some(k => t.includes(k)))
    return { sale: 'New Booking', item: 'Add services', heading: 'Services', table: false }
  return { sale: 'New Sale', item: 'Add item', heading: 'Cart', table: false }
}

export default function SellPage() {
  const router = useRouter()
  const [staff, setStaff]   = useState<StaffSession | null>(null)
  const [screen, setScreen] = useState<Screen>('home')
  const [cart, setCart]     = useState<CartItem[]>([])
  const [todaySales, setTodaySales]     = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [sym, setSym]       = useState('£')
  const [biz, setBiz]       = useState(bizLabel('retail'))

  // Add-item mode
  const [addMode, setAddMode]           = useState<AddMode>('camera')
  const [scanning, setScanning]         = useState(false)
  const [scanResult, setScanResult]     = useState<{ name: string; price: number; inventory_id?: string; unit?: string } | null>(null)
  const [scanError, setScanError]       = useState('')
  const [searchQuery, setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cart editing
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null)
  const [noteInput, setNoteInput]     = useState('')
  const [kgInputs, setKgInputs]       = useState<Record<number, string>>({})
  const [checkoutError, setCheckoutError] = useState('')

  // Geo
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null)

  // Checkout
  const [paymentType, setPaymentType]   = useState<'cash' | 'card' | 'mobile'>('cash')
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount')
  const [discountValue, setDiscountValue] = useState('')
  const [amountTendered, setAmountTendered] = useState('')
  const [tableNumber, setTableNumber]   = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [processing, setProcessing]     = useState(false)
  const [lastTxId, setLastTxId]         = useState('')
  const [lastTotal, setLastTotal]       = useState(0)
  const [sendingReceipt, setSendingReceipt] = useState(false)
  const [receiptSent, setReceiptSent]   = useState(false)
  const [oversold, setOversold]         = useState<string[]>([])
  const [expiryWarning, setExpiryWarning] = useState<string | null>(null)

  // Payment state
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Shift
  const [shiftOpen, setShiftOpen]     = useState<boolean | null>(null)
  const [shiftId, setShiftId]         = useState<string | null>(null)
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [openingCash, setOpeningCash] = useState('')
  const [shiftAction, setShiftAction] = useState<'open' | 'close'>('open')
  const [closingCash, setClosingCash] = useState('')
  const [shiftLoading, setShiftLoading] = useState(false)

  // ── Init ────────────────────────────────────────────────────
  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    if (s.role !== 'cashier') { router.push('/inventory'); return }
    setStaff(s)
    setSym(s.currency_symbol || '£')
    setBiz(bizLabel(s.business_type || 'retail'))
    loadTodayStats(s)
    if (s.location_id) checkShift(s)  // sync localStorage check
    // Fetch fresh owner config to get correct currency symbol
    fetch(`${API}/api/pos/config`, {
      headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
    }).then(r => r.json()).then(cfg => {
      if (cfg.currency_symbol) setSym(cfg.currency_symbol)
      if (cfg.business_type)   setBiz(bizLabel(cfg.business_type))
    }).catch(() => {})

    // Start capturing location immediately so it's ready by checkout
    if (navigator.geolocation) {
      const doGeo = () => navigator.geolocation.getCurrentPosition(
        pos => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}, // silently ignore denial
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      )
      doGeo()
      // Refresh every 60 s so coords stay current for long sessions
      const geoTimer = setInterval(doGeo, 60_000)
      return () => clearInterval(geoTimer)
    }
  }, [])

  const loadTodayStats = async (s: StaffSession) => {
    const from = new Date(); from.setHours(0, 0, 0, 0)
    try {
      const res = await fetch(`${API}/api/pos/transactions?from=${from.toISOString()}`, {
        headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
      })
      const data = await res.json()
      const mine = (data.transactions || []).filter(
        (t: any) => (t.cashier?.id === s.id || t.pos_staff?.id === s.id) && t.status === 'completed'
      )
      setTodaySales(mine.length)
      setTodayRevenue(mine.reduce((acc: number, t: any) => acc + (t.total || 0), 0))
    } catch {}
  }

  // ── Shift ────────────────────────────────────────────────────
  const shiftKey = (s: StaffSession) => `pos_shift_${s.owner_id}_${s.id}`

  const checkShift = (s: StaffSession) => {
    // Read from localStorage — no API call needed, instant and reliable
    try {
      const stored = localStorage.getItem(shiftKey(s))
      if (stored) {
        const shift = JSON.parse(stored)
        if (shift?.id) { setShiftOpen(true); setShiftId(shift.id); return }
      }
    } catch {}
    setShiftOpen(false)
  }

  const handleOpenShift = async () => {
    if (!staff?.location_id) return
    setShiftLoading(true)
    // Generate a local shift ID and persist immediately — no DB required
    const newShiftId = `shift_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const shiftRecord = {
      id:            newShiftId,
      openedAt:      new Date().toISOString(),
      openingCash:   parseFloat(openingCash) || 0,
      locationId:    staff.location_id,
      cashierId:     staff.id,
    }
    localStorage.setItem(shiftKey(staff), JSON.stringify(shiftRecord))
    setShiftOpen(true); setShiftId(newShiftId); setShowShiftModal(false); setOpeningCash('')

    // Persist to DB — update localStorage shiftId with real DB id on success
    fetch(`${API}/api/pos/shift/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
      body: JSON.stringify({ cashier_id: staff.id, location_id: staff.location_id, opening_cash_balance: parseFloat(openingCash) || 0 }),
    }).then(r => r.json()).then(data => {
      if (data.shift_id) {
        // Update stored shift id to the real DB uuid so close works correctly
        const stored = localStorage.getItem(shiftKey(staff))
        if (stored) {
          const rec = JSON.parse(stored)
          localStorage.setItem(shiftKey(staff), JSON.stringify({ ...rec, id: data.shift_id }))
          setShiftId(data.shift_id)
        }
      }
    }).catch(() => {})

    setShiftLoading(false)
  }

  const handleCloseShift = async () => {
    if (!staff) return
    setShiftLoading(true)
    // Remove from localStorage immediately
    localStorage.removeItem(shiftKey(staff))
    setShiftOpen(false); setShiftId(null); setShowShiftModal(false); setClosingCash('')

    // Best-effort DB write
    fetch(`${API}/api/pos/shift/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
      body: JSON.stringify({ shift_id: shiftId, closing_cash_balance: parseFloat(closingCash) || 0 }),
    }).catch(() => {})

    setShiftLoading(false)
  }

  // ── Computed totals ─────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.qty * i.unit_price, 0)
  const discountAmt = (() => {
    const v = parseFloat(discountValue) || 0
    if (!v) return 0
    if (discountType === 'percent') return Math.min(subtotal, (subtotal * v) / 100)
    return Math.min(subtotal, v)
  })()
  const cartTotal  = Math.max(0, subtotal - discountAmt)
  const tendered   = parseFloat(amountTendered) || 0
  const changeDue  = paymentType === 'cash' && tendered > cartTotal ? tendered - cartTotal : 0

  // ── Camera ────────────────────────────────────────────────────
  const startCamera = async () => {
    setScanResult(null); setScanError(''); setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
    } catch {
      setScanError('Camera not available. Use search instead.')
      setScanning(false)
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    stream?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setScanning(false)
  }

  const captureAndScan = async () => {
    if (!canvasRef.current || !videoRef.current) return
    const canvas = canvasRef.current
    const video  = videoRef.current
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    stopCamera()
    try {
      const res = await fetch(`${API}/api/pos/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staff?.id || '', 'x-owner-id': staff?.owner_id || '' },
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()
      if (data.name) setScanResult({ name: data.name, price: data.price ?? 0, inventory_id: data.inventory_id, unit: data.unit })
      else setScanError('Could not identify product. Try search instead.')
    } catch {
      setScanError('Scan failed. Try search instead.')
    }
  }

  // ── Inventory search ─────────────────────────────────────────
  const searchInventory = useCallback(async (q: string) => {
    if (!q.trim() || !staff) { setSearchResults([]); return }
    setSearchLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/inventory?search=${encodeURIComponent(q)}&limit=15`, {
        headers: { 'x-staff-id': staff.id, 'x-owner-id': staff.owner_id },
      })
      const data = await res.json()
      setSearchResults(data.inventory || [])
    } catch {}
    setSearchLoading(false)
  }, [staff])

  useEffect(() => {
    const t = setTimeout(() => searchInventory(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery, searchInventory])

  // ── Cart management ───────────────────────────────────────────
  const addToCart = (item: Omit<CartItem, 'qty'> & { qty?: number }) => {
    setCart(prev => {
      const existing = prev.findIndex(i => i.name === item.name && i.unit_price === item.unit_price)
      if (existing >= 0) {
        return prev.map((i, idx) => idx === existing ? { ...i, qty: i.qty + (item.qty || 1) } : i)
      }
      return [...prev, { ...item, qty: item.qty || 1 }]
    })
  }

  const updateQty = (idx: number, delta: number) => {
    setCart(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], qty: Math.max(0, next[idx].qty + delta) }
      return next.filter(i => i.qty > 0)
    })
  }

  const saveNote = (idx: number) => {
    setCart(prev => prev.map((i, j) => j === idx ? { ...i, notes: noteInput.trim() || undefined } : i))
    setEditNoteIdx(null)
  }

  const confirmScan = () => {
    if (!scanResult) return
    addToCart({ name: scanResult.name, unit_price: scanResult.price, cost_price: 0, inventory_id: scanResult.inventory_id, unit: scanResult.unit })
    setScanResult(null); setScreen('cart')
  }

  const addFromSearch = (item: InventoryItem) => {
    if (item.expiry_date) {
      const todayMs = new Date().setHours(0,0,0,0)
      const daysToExpiry = Math.floor((new Date(item.expiry_date).getTime() - todayMs) / 86400000)
      if (daysToExpiry < 0) {
        setExpiryWarning(`⚠ "${item.name}" EXPIRED on ${new Date(item.expiry_date).toLocaleDateString('en-GB')} — do not sell`)
        setTimeout(() => setExpiryWarning(null), 5000)
        return // block adding expired items
      } else if (daysToExpiry <= 7) {
        setExpiryWarning(`⚠ "${item.name}" expires ${daysToExpiry === 0 ? 'TODAY' : `in ${daysToExpiry} day${daysToExpiry !== 1 ? 's' : ''}`}`)
        setTimeout(() => setExpiryWarning(null), 4000)
      }
    }
    addToCart({ name: item.name, unit_price: item.sale_price, cost_price: item.cost_price || 0, inventory_id: item.id, unit: item.unit })
    setScreen('cart')
  }

  const captureGeo = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {} // silently ignore if denied
    )
  }

  const setItemQty = (idx: number, qty: number) => {
    setCart(prev => {
      const next = [...prev]
      const rounded = Math.round(qty * 100) / 100
      if (rounded <= 0) return next.filter((_, i) => i !== idx)
      next[idx] = { ...next[idx], qty: rounded }
      return next
    })
  }

  // ── Checkout ──────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!staff || cart.length === 0) return
    setProcessing(true)
    setCheckoutError('')
    setPaymentError(null)
    try {
      // Attempt a fresh geo capture right before checkout (3s timeout)
      let geo = geoCoords
      if (!geo && navigator.geolocation) {
        geo = await new Promise<{ lat: number; lng: number } | null>(resolve => {
          const timer = setTimeout(() => resolve(null), 3000)
          navigator.geolocation.getCurrentPosition(
            pos => { clearTimeout(timer); const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }; setGeoCoords(coords); resolve(coords) },
            () => { clearTimeout(timer); resolve(null) },
            { enableHighAccuracy: false, timeout: 3000, maximumAge: 300000 }
          )
        })
      }
      const res = await fetch(`${API}/api/pos/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
        body: JSON.stringify({
          items:           cart,
          payment_type:    paymentType === 'mobile' ? 'mpesa' : paymentType === 'card' ? 'card' : paymentType,
          cashier_id:      staff.id,
          customer_phone:  customerPhone || null,
          discount_amount: discountAmt || null,
          amount_tendered: paymentType === 'cash' && tendered ? tendered : null,
          shift_id:        shiftId || null,
          notes:           [tableNumber ? `Table: ${tableNumber}` : '', geo ? `|__geo:${geo.lat.toFixed(6)},${geo.lng.toFixed(6)}` : ''].filter(Boolean).join(' ') || undefined,
        }),
      })
      const data = await res.json()
      if (data.transaction_id) {
        setLastTxId(data.transaction_id)
        setLastTotal(cartTotal)
        setOversold(data.oversold || [])

        // For cash payment, go straight to receipt
        if (paymentType === 'cash') {
          setTodaySales(s => s + 1)
          setTodayRevenue(r => r + cartTotal)
          setScreen('receipt')
        }
        // For card/mobile, payment components will render inline and handle completion
      } else {
        setCheckoutError(data.error || 'Payment failed — please try again')
      }
    } catch (err: any) {
      setCheckoutError('Network error — check your connection and try again')
    }
    setProcessing(false)
  }

  const handleSendReceipt = async () => {
    if (!customerPhone || !lastTxId) return
    setSendingReceipt(true)
    try {
      await fetch(`${API}/api/pos/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staff?.id || '', 'x-owner-id': staff?.owner_id || '' },
        body: JSON.stringify({ transaction_id: lastTxId, phone: customerPhone }),
      })
      setReceiptSent(true)
    } catch {}
    setSendingReceipt(false)
  }

  const resetSale = () => {
    setCart([]); setCustomerPhone(''); setPaymentType('cash')
    setDiscountValue(''); setDiscountType('amount')
    setAmountTendered(''); setTableNumber('')
    setLastTxId(''); setLastTotal(0); setReceiptSent(false)
    setOversold([]); setScanResult(null); setScanError('')
    setSearchQuery(''); setSearchResults([])
    setKgInputs({}); setCheckoutError(''); setGeoCoords(null)
    setShowPaymentHandler(false); setPaymentError(null)
    setScreen('home')
  }

  const copilot = staff ? (
    <CashierCopilot screen={screen} cart={cart} customerPhone={customerPhone} ownerId={staff.owner_id} staffId={staff.id} />
  ) : null

  // ─────────────────────────────────────────────────────────────
  // HOME SCREEN
  // ─────────────────────────────────────────────────────────────
  if (screen === 'home') return (<>{copilot}
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f8f6' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1916' }}>AskBiz POS</div>
          <div style={{ fontSize: 12, color: '#6b6760' }}>{staff?.name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {staff?.location_id && shiftOpen !== null && (
            <button
              onClick={() => { setShiftAction(shiftOpen ? 'close' : 'open'); setShowShiftModal(true) }}
              style={{ padding: '5px 10px', borderRadius: 8, border: `1px solid ${shiftOpen ? '#16a34a' : '#d08a59'}`, background: shiftOpen ? 'rgba(22,163,74,.08)' : 'rgba(208,138,89,.08)', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: shiftOpen ? '#16a34a' : '#d08a59' }}
            >
              {shiftOpen ? '● Shift open' : '○ Open shift'}
            </button>
          )}

          {/* Location indicator — tappable to request permission */}
          <button
            onClick={() => {
              if (!navigator.geolocation) return
              navigator.geolocation.getCurrentPosition(
                pos => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => alert('Location access denied. Go to browser Settings → this site → allow Location to geo-tag sales.')
              )
            }}
            title={geoCoords ? `📍 ${geoCoords.lat.toFixed(4)}, ${geoCoords.lng.toFixed(4)}` : 'Tap to enable location for map pins'}
            style={{ padding: '4px 8px', borderRadius: 20, border: `1px solid ${geoCoords ? '#16a34a' : '#e5e2dc'}`, background: geoCoords ? 'rgba(22,163,74,.08)' : 'rgba(229,226,220,.5)', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: geoCoords ? '#16a34a' : '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
            {geoCoords ? '📍' : '📍?'}
          </button>

          <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#6b6760' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 20px' }}>
        <div style={{ padding: '16px', borderRadius: 14, background: '#fff', border: '1px solid #e5e2dc' }}>
          <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 4 }}>Today's revenue</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1916' }}>{sym}{todayRevenue.toFixed(2)}</div>
        </div>
        <div style={{ padding: '16px', borderRadius: 14, background: '#fff', border: '1px solid #e5e2dc' }}>
          <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 4 }}>Sales today</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1916' }}>{todaySales}</div>
        </div>
      </div>

      {/* Geo permission nudge — shown when location not yet captured */}
      {!geoCoords && (
        <button
          onClick={() => {
            if (!navigator.geolocation) return
            navigator.geolocation.getCurrentPosition(
              pos => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              () => alert('Location access denied. Go to your browser Settings → this site → allow Location to geo-tag sales on the map.')
            )
          }}
          style={{ margin: '0 20px 12px', padding: '10px 14px', borderRadius: 12, border: '1px dashed #d1d5db', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: 'calc(100% - 40px)', textAlign: 'left' }}>
          <span style={{ fontSize: 16 }}>📍</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6760' }}>Tap to enable location</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Geo-tags each sale on the map</div>
          </div>
        </button>
      )}

      {/* Cart resume banner */}
      {cart.length > 0 && (
        <div onClick={() => setScreen('cart')} style={{ margin: '0 20px 12px', padding: '14px 16px', borderRadius: 14, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: ACC }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in {biz.heading.toLowerCase()}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: ACC }}>{sym}{cartTotal.toFixed(2)}</div>
        </div>
      )}

      {/* Main action */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: 14 }}>
        <button
          onClick={() => { setScreen('add'); setAddMode('camera'); startCamera() }}
          style={{ width: '100%', maxWidth: 300, padding: '24px', borderRadius: 20, background: ACC, color: '#fff', fontSize: 20, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          {biz.sale}
        </button>
        {cart.length > 0 && (
          <button onClick={() => setScreen('cart')} style={{ width: '100%', maxWidth: 300, padding: '16px', borderRadius: 16, background: '#fff', color: ACC, fontSize: 16, fontWeight: 700, border: `2px solid ${ACC}`, cursor: 'pointer' }}>
            Continue {biz.heading} ({cart.length}) · {sym}{cartTotal.toFixed(2)}
          </button>
        )}
      </div>

      {/* Shift modal */}
      {showShiftModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end', zIndex: 999 }} onClick={e => e.target === e.currentTarget && setShowShiftModal(false)}>
          <div style={{ width: '100%', background: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#1a1916', marginBottom: 16 }}>
              {shiftAction === 'open' ? 'Open shift' : 'Close shift'}
            </div>
            {shiftAction === 'open' ? (
              <>
                <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 8 }}>Opening cash in till</div>
                <input
                  type="number" placeholder="0.00" value={openingCash} onChange={e => setOpeningCash(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14 }}
                />
                <button onClick={handleOpenShift} disabled={shiftLoading} style={{ width: '100%', padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {shiftLoading ? 'Opening...' : 'Open shift'}
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 8 }}>Closing cash count</div>
                <input
                  type="number" placeholder="0.00" value={closingCash} onChange={e => setClosingCash(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14 }}
                />
                <button onClick={handleCloseShift} disabled={shiftLoading} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#1a1916', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {shiftLoading ? 'Closing...' : 'Close shift'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  </>)

  // ─────────────────────────────────────────────────────────────
  // ADD ITEM SCREEN (Camera + Search tabs)
  // ─────────────────────────────────────────────────────────────
  if (screen === 'add') return (<>{copilot}
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { stopCamera(); setScreen('home') }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{biz.item}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '12px 20px 0' }}>
        {(['camera', 'search'] as AddMode[]).map(m => (
          <button key={m} onClick={() => {
            if (m === 'search') stopCamera()
            if (m === 'camera') { setScanResult(null); setScanError(''); startCamera() }
            setAddMode(m)
          }} style={{ flex: 1, padding: '9px', border: 'none', background: 'transparent', color: addMode === m ? '#fff' : 'rgba(255,255,255,.5)', fontSize: 14, fontWeight: addMode === m ? 700 : 400, borderBottom: addMode === m ? '2px solid #d08a59' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
            {m === 'camera' ? '📷 Camera' : '🔍 Search'}
          </button>
        ))}
      </div>

      {/* Camera mode */}
      {addMode === 'camera' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {scanning ? (
            <div style={{ flex: 1, position: 'relative' }}>
              <video ref={videoRef} playsInline muted style={{ width: '100%', height: '55vh', objectFit: 'cover' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ width: 230, height: 150, border: '2px solid rgba(255,255,255,.75)', borderRadius: 16 }} />
              </div>
              <div style={{ padding: '20px' }}>
                <button onClick={captureAndScan} style={{ width: '100%', padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  📸 Capture
                </button>
              </div>
            </div>
          ) : scanResult ? (
            <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: '24px', borderRadius: 16, background: '#fff', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 6 }}>Found</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1916' }}>{scanResult.name}</div>
                  {scanResult.unit === 'kg' && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#d08a59', background: 'rgba(208,138,89,.1)', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(208,138,89,.25)' }}>kg</span>
                  )}
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: ACC }}>{sym}{scanResult.price.toFixed(2)}</div>
                {scanResult.unit === 'kg' && (
                  <div style={{ fontSize: 12, color: '#6b6760', marginTop: 2 }}>per kg — set quantity in cart</div>
                )}
              </div>
              {scanError && <div style={{ fontSize: 13, color: '#fca5a5', textAlign: 'center' }}>{scanError}</div>}
              <button onClick={confirmScan} style={{ padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                ✓ Add to {biz.heading.toLowerCase()}
              </button>
              <button onClick={() => { setScanResult(null); startCamera() }} style={{ padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Scan again
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '24px' }}>
              {scanError && <div style={{ fontSize: 14, color: '#fca5a5', textAlign: 'center' }}>{scanError}</div>}
              <button onClick={startCamera} style={{ padding: '15px 32px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Start camera
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search mode */}
      {addMode === 'search' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f9f8f6' }}>
          <div style={{ padding: '14px 20px' }}>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or SKU..."
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' }}
            />
          </div>

          {/* Manual entry shortcut */}
          {searchQuery && !searchLoading && searchResults.length === 0 && (
            <div style={{ padding: '0 20px 12px' }}>
              <button onClick={() => {
                const price = 0
                addToCart({ name: searchQuery, unit_price: price, cost_price: 0 })
                setScreen('cart')
              }} style={{ width: '100%', padding: '13px', borderRadius: 12, border: '1.5px dashed #d08a59', background: 'rgba(208,138,89,.06)', color: '#d08a59', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add "{searchQuery}" manually (set price in cart)
              </button>
            </div>
          )}

          {expiryWarning && (
            <div style={{ margin: '0 20px 10px', padding: '12px 16px', borderRadius: 12, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.3)', fontSize: 13, fontWeight: 600, color: '#dc2626' }}>
              {expiryWarning}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
            {searchLoading && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#6b6760', fontSize: 14 }}>Searching...</div>
            )}
            {searchResults.map(item => {
              const todayMs2 = new Date().setHours(0,0,0,0)
              const daysToExp = item.expiry_date ? Math.floor((new Date(item.expiry_date).getTime() - todayMs2) / 86400000) : null
              const isExpiredItem = daysToExp !== null && daysToExp < 0
              const isExpiringSoonItem = daysToExp !== null && daysToExp >= 0 && daysToExp <= 7
              return (
              <button key={item.id} onClick={() => addFromSearch(item)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: isExpiredItem ? 'rgba(220,38,38,.04)' : '#fff', borderRadius: 14, marginBottom: 8, border: `1px solid ${isExpiredItem ? '#fca5a5' : '#e5e2dc'}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916' }}>
                    {item.name}
                    {isExpiredItem && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: '#dc2626', background: 'rgba(220,38,38,.1)', padding: '1px 6px', borderRadius: 9999 }}>EXPIRED</span>}
                    {isExpiringSoonItem && !isExpiredItem && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: '#f97316', background: 'rgba(249,115,22,.1)', padding: '1px 6px', borderRadius: 9999 }}>EXP {daysToExp === 0 ? 'TODAY' : `${daysToExp}d`}</span>}
                  </div>
                  {item.sku && <div style={{ fontSize: 11, color: '#a39e97', marginTop: 1 }}>SKU: {item.sku}</div>}
                  <div style={{ fontSize: 11, marginTop: 3 }}>
                    {item.stock_qty <= 0
                      ? <span style={{ color: '#dc2626', fontWeight: 600 }}>Out of stock</span>
                      : item.low_stock_threshold && item.stock_qty <= item.low_stock_threshold
                      ? <span style={{ color: '#f59e0b', fontWeight: 600 }}>Low stock · {item.stock_qty} left</span>
                      : <span style={{ color: '#6b6760' }}>{item.stock_qty} in stock</span>
                    }
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: isExpiredItem ? '#dc2626' : ACC, marginLeft: 12 }}>{sym}{item.sale_price.toFixed(2)}</div>
              </button>
              )
            })}
            {!searchLoading && searchResults.length === 0 && !searchQuery && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b6760', fontSize: 14 }}>
                Start typing to search your inventory
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </>)

  // ─────────────────────────────────────────────────────────────
  // CART SCREEN
  // ─────────────────────────────────────────────────────────────
  if (screen === 'cart') return (<>{copilot}
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('home')} style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #e5e2dc', color: '#1a1916', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1916' }}>{biz.heading}</div>
        {cart.length > 0 && <div style={{ marginLeft: 'auto', fontSize: 13, color: '#6b6760' }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</div>}
      </div>

      <div style={{ flex: 1, padding: '8px 20px', overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6760', fontSize: 14 }}>{biz.heading} is empty</div>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 14, marginBottom: 10, border: '1px solid #e5e2dc', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916' }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: '#6b6760' }}>{sym}{item.unit_price.toFixed(2)} {item.unit === 'kg' ? 'per kg' : 'each'}</div>
                  {item.notes && <div style={{ fontSize: 12, color: ACC, marginTop: 2 }}>📝 {item.notes}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.unit === 'kg' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        value={kgInputs[idx] !== undefined ? kgInputs[idx] : String(item.qty)}
                        onChange={e => setKgInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                        onBlur={e => {
                          const val = parseFloat(e.target.value)
                          if (!isNaN(val) && val > 0) setItemQty(idx, val)
                          setKgInputs(prev => { const n = { ...prev }; delete n[idx]; return n })
                        }}
                        step="0.1"
                        min="0.1"
                        style={{ width: 68, padding: '6px 8px', borderRadius: 8, border: '1.5px solid #d08a59', fontSize: 15, fontWeight: 700, textAlign: 'center', fontFamily: 'inherit', color: '#1a1916', background: '#fff', boxSizing: 'border-box' }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#d08a59', background: 'rgba(208,138,89,.1)', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(208,138,89,.25)', whiteSpace: 'nowrap' }}>kg</span>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => updateQty(idx, -1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e2dc', background: '#f9f8f6', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                      <span style={{ fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(idx, 1)}  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e2dc', background: '#f9f8f6', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                    </>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1916', minWidth: 64, textAlign: 'right' }}>{sym}{(item.qty * item.unit_price).toFixed(2)}</div>
                </div>
              </div>
              {/* Note row */}
              {editNoteIdx === idx ? (
                <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
                  <input
                    autoFocus value={noteInput} onChange={e => setNoteInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveNote(idx)}
                    placeholder="e.g. no sugar, oat milk, medium..."
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e2dc', fontSize: 13, fontFamily: 'inherit' }}
                  />
                  <button onClick={() => saveNote(idx)} style={{ padding: '8px 12px', borderRadius: 8, background: ACC, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                </div>
              ) : (
                <button onClick={() => { setEditNoteIdx(idx); setNoteInput(item.notes || '') }} style={{ width: '100%', padding: '6px 16px 10px', textAlign: 'left', border: 'none', background: 'transparent', fontSize: 12, color: '#a39e97', cursor: 'pointer', fontFamily: 'inherit' }}>
                  + {item.notes ? 'Edit note' : 'Add note / modifier'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '14px 20px 32px', background: '#fff', borderTop: '1px solid #e5e2dc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#6b6760' }}>Total</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#1a1916' }}>{sym}{cartTotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <button onClick={() => { stopCamera(); setScreen('add'); setAddMode('search') }} style={{ flex: 1, padding: '13px', borderRadius: 12, background: '#f9f8f6', border: '1px solid #e5e2dc', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#1a1916' }}>
            + {biz.item}
          </button>
          <button onClick={() => { captureGeo(); setScreen('checkout') }} disabled={cart.length === 0} style={{ flex: 2, padding: '13px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Checkout →
          </button>
        </div>
        {cart.length > 0 && (
          <button onClick={() => { setCart([]); setScreen('home') }} style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(220,38,38,.3)', color: '#dc2626', fontSize: 14, cursor: 'pointer' }}>
            Cancel {biz.heading.toLowerCase()}
          </button>
        )}
      </div>
    </div>
  </>)

  // ─────────────────────────────────────────────────────────────
  // CHECKOUT SCREEN
  // ─────────────────────────────────────────────────────────────
  if (screen === 'checkout') return (<>{copilot}
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('cart')} style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #e5e2dc', color: '#1a1916', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1916' }}>Checkout</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
        {/* Total summary */}
        <div style={{ padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc', marginBottom: 14 }}>
          {discountAmt > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b6760', marginBottom: 4 }}>
                <span>Subtotal</span><span>{sym}{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#16a34a', marginBottom: 8 }}>
                <span>Discount</span><span>−{sym}{discountAmt.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: '#e5e2dc', marginBottom: 10 }} />
            </>
          ) : null}
          <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 4 }}>Total to collect</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#1a1916' }}>{sym}{cartTotal.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: '#6b6760', marginTop: 4 }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</div>
        </div>

        {/* Payment method */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 8 }}>Payment method</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {([['cash', '💵 Cash'], ['card', '💳 Card'], ['mobile', '📱 Mobile']] as const).map(([type, label]) => (
              <button key={type} onClick={() => setPaymentType(type)} style={{ padding: '13px 8px', borderRadius: 12, border: `2px solid ${paymentType === type ? ACC : '#e5e2dc'}`, background: paymentType === type ? 'rgba(208,138,89,.08)' : '#fff', color: paymentType === type ? ACC : '#6b6760', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Payment Prompt */}
        {paymentType === 'card' && lastTxId && (
          <PosCardPayment
            transactionId={lastTxId}
            amount={cartTotal}
            ownerId={staff.owner_id}
            staffId={staff.id}
            onPaymentComplete={() => {
              setTodaySales(s => s + 1)
              setTodayRevenue(r => r + cartTotal)
              setScreen('receipt')
            }}
            onPaymentFailed={(error) => {
              setPaymentError(error)
            }}
          />
        )}

        {/* Mobile Payment Prompt (M-Pesa) */}
        {paymentType === 'mobile' && lastTxId && (
          <PosMobilePayment
            transactionId={lastTxId}
            amount={cartTotal}
            ownerId={staff.owner_id}
            staffId={staff.id}
            customerPhone={customerPhone}
            onPaymentComplete={() => {
              setTodaySales(s => s + 1)
              setTodayRevenue(r => r + cartTotal)
              setScreen('receipt')
            }}
            onPaymentFailed={(error) => {
              setPaymentError(error)
            }}
          />
        )}

        {/* Cash tendered → change */}
        {paymentType === 'cash' && (
          <div style={{ marginBottom: 14, padding: '16px', background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 8 }}>Amount received</div>
            <input
              type="number" inputMode="decimal" placeholder={`${sym}0.00`} value={amountTendered}
              onChange={e => setAmountTendered(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 18, fontWeight: 700, fontFamily: 'inherit', boxSizing: 'border-box', color: '#1a1916' }}
            />
            {changeDue > 0 && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>Change due</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#16a34a' }}>{sym}{changeDue.toFixed(2)}</span>
              </div>
            )}
            {amountTendered && tendered < cartTotal && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#dc2626' }}>
                Short by {sym}{(cartTotal - tendered).toFixed(2)}
              </div>
            )}
          </div>
        )}

        {/* Discount */}
        <div style={{ marginBottom: 14, padding: '16px', background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 8 }}>Discount (optional)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1.5px solid #e5e2dc' }}>
              {(['amount', 'percent'] as const).map(t => (
                <button key={t} onClick={() => setDiscountType(t)} style={{ padding: '10px 14px', border: 'none', background: discountType === t ? ACC : '#fff', color: discountType === t ? '#fff' : '#6b6760', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {t === 'amount' ? sym : '%'}
                </button>
              ))}
            </div>
            <input
              type="number" inputMode="decimal" placeholder="0"
              value={discountValue} onChange={e => setDiscountValue(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', color: '#1a1916' }}
            />
          </div>
          {discountAmt > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#16a34a' }}>
              Saving {sym}{discountAmt.toFixed(2)} ({((discountAmt / subtotal) * 100).toFixed(0)}% off)
            </div>
          )}
        </div>

        {/* Table number (restaurant/café only) */}
        {biz.table && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>Table number (optional)</div>
            <input
              type="text" placeholder="e.g. 4, A3, Bar" value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* Customer phone */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 4 }}>Customer phone (optional)</div>
          <div style={{ fontSize: 12, color: '#6b6760', marginBottom: 6 }}>To send a WhatsApp receipt</div>
          <input
            type="tel" placeholder="+447911123456" value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ padding: '14px 20px 40px', background: '#fff', borderTop: '1px solid #e5e2dc' }}>
        {checkoutError && (
          <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.25)', fontSize: 13, color: '#dc2626', fontWeight: 500 }}>
            ⚠ {checkoutError}
          </div>
        )}
        {paymentError && (
          <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.25)', fontSize: 13, color: '#dc2626', fontWeight: 500 }}>
            ⚠ {paymentError}
          </div>
        )}
        <button
          onClick={handleCheckout}
          disabled={processing || (paymentType === 'cash' && !!amountTendered && tendered < cartTotal)}
          style={{ width: '100%', padding: '18px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 18, fontWeight: 800, border: 'none', cursor: processing ? 'wait' : 'pointer', opacity: (paymentType === 'cash' && !!amountTendered && tendered < cartTotal) ? 0.5 : 1 }}
        >
          {processing ? 'Processing...' : `Complete · ${sym}${cartTotal.toFixed(2)}`}
        </button>
      </div>
    </div>
  </>)

  // ─────────────────────────────────────────────────────────────
  // RECEIPT SCREEN
  // ─────────────────────────────────────────────────────────────
  if (screen === 'receipt') return (<>{copilot}
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(22,163,74,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1916', marginBottom: 4 }}>
          {biz.sale === 'New Order' ? 'Order complete!' : biz.sale === 'New Booking' ? 'Booking done!' : 'Sale complete!'}
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a', marginBottom: changeDue > 0 ? 6 : 20 }}>
          {sym}{lastTotal.toFixed(2)}
        </div>

        {/* Change due */}
        {changeDue > 0 && (
          <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 12, background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.2)' }}>
            <div style={{ fontSize: 12, color: '#16a34a', marginBottom: 2 }}>Change to give customer</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a' }}>{sym}{changeDue.toFixed(2)}</div>
          </div>
        )}

        {/* Oversold warning */}
        {oversold.length > 0 && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', fontSize: 12, color: '#d97706', textAlign: 'left' }}>
            ⚠️ Sold beyond stock: {oversold.join(', ')}. Update inventory.
          </div>
        )}

        {/* Items receipt */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc', padding: '14px', marginBottom: 16, textAlign: 'left' }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < cart.length - 1 ? '1px solid #f0ede8' : 'none', fontSize: 14 }}>
              <span style={{ color: '#1a1916' }}>{item.name} ×{item.qty}{item.unit === 'kg' ? 'kg' : ''}{item.notes ? ` (${item.notes})` : ''}</span>
              <span style={{ fontWeight: 600, color: '#1a1916' }}>{sym}{(item.qty * item.unit_price).toFixed(2)}</span>
            </div>
          ))}
          {discountAmt > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 0', fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
              <span>Discount</span><span>−{sym}{discountAmt.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* WhatsApp receipt */}
        {!receiptSent ? (
          <div style={{ marginBottom: 16 }}>
            {!customerPhone ? (
              <>
                <input
                  type="tel" placeholder="Customer phone for receipt"
                  value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e5e2dc', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box', marginBottom: 8 }}
                />
                <button onClick={handleSendReceipt} disabled={!customerPhone || sendingReceipt} style={{ width: '100%', padding: '13px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {sendingReceipt ? 'Sending...' : '📲 Send WhatsApp receipt'}
                </button>
              </>
            ) : (
              <button onClick={handleSendReceipt} disabled={sendingReceipt} style={{ width: '100%', padding: '13px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                {sendingReceipt ? 'Sending...' : `📲 Send to ${customerPhone}`}
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: '11px', borderRadius: 12, background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.3)', color: '#16a34a', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            ✓ Receipt sent
          </div>
        )}

        <button onClick={resetSale} style={{ width: '100%', padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          {biz.sale} →
        </button>
      </div>
    </div>
  </>)

  return null
}
