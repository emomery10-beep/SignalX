'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CashierCopilot from '@/components/CashierCopilot'
import PosCardPayment from '@/components/PosCardPayment'
import PosMobilePayment from '@/components/PosMobilePayment'
import { getRoleHomeRoute } from '@/lib/pos-role-client'
import { useLang } from '@/components/LanguageProvider'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { fetchInventory } from '@/lib/pos-inventory-fetch'
import { bulkUpsertFromApi, isCacheStale, decrementLocalStock } from '@/lib/pos-inventory-cache'

const ACC = 'var(--pos-accent)'
const API = process.env.NEXT_PUBLIC_API_URL || ''

// Compress a camera/gallery photo to a small JPEG data URL. createImageBitmap
// avoids the iOS Safari "black canvas" bug with large photos (and works in
// private/incognito mode, where a live getUserMedia preview often stays black).
async function compressToDataUrl(file: File, maxEdge = 1280, quality = 0.8): Promise<string> {
  const draw = (src: CanvasImageSource, w: number, h: number): string | null => {
    const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h)
    const ctx = c.getContext('2d'); if (!ctx) return null
    ctx.drawImage(src, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', quality)
  }
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file)
      const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height))
      const out = draw(bmp, Math.round(bmp.width * scale), Math.round(bmp.height * scale))
      bmp.close?.(); if (out && out.length > 120) return out
    } catch { /* fall through */ }
  }
  const dataUrl: string = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(file) })
  try {
    const img: HTMLImageElement = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('decode')); i.src = dataUrl })
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
    const out = draw(img, Math.round(img.width * scale), Math.round(img.height * scale)); if (out && out.length > 120) return out
  } catch { /* fall through */ }
  return dataUrl
}

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
function bizLabel(type: string, tc: (key: string, vars?: Record<string, string | number>) => string) {
  const t = (type || '').toLowerCase()
  if (['restaurant', 'cafe', 'café', 'food', 'bar', 'takeaway'].some(k => t.includes(k)))
    return { sale: tc('sell.biz_food_sale'), item: tc('sell.biz_food_item'), heading: tc('sell.biz_food_heading'), table: true }
  if (['salon', 'barber', 'barbershop', 'spa', 'beauty', 'service', 'clinic'].some(k => t.includes(k)))
    return { sale: tc('sell.biz_service_sale'), item: tc('sell.biz_service_item'), heading: tc('sell.biz_service_heading'), table: false }
  return { sale: tc('sell.biz_retail_sale'), item: tc('sell.biz_retail_item'), heading: tc('sell.biz_retail_heading'), table: false }
}

export default function SellPage() {
  const router = useRouter()
  const { tc } = useLang()
  const online = useOnlineStatus()
  const [staff, setStaff]   = useState<StaffSession | null>(null)
  const [screen, setScreen] = useState<Screen>('home')
  const [cart, setCart]     = useState<CartItem[]>([])
  const [todaySales, setTodaySales]     = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [sym, setSym]       = useState('£')
  const [biz, setBiz]       = useState(() => bizLabel('retail', tc))
  const [businessName, setBusinessName] = useState('')

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
  const prodInputRef = useRef<HTMLInputElement>(null)

  // Cart editing
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null)
  const [noteInput, setNoteInput]     = useState('')
  const [kgInputs, setKgInputs]       = useState<Record<number, string>>({})
  const [checkoutError, setCheckoutError] = useState('')

  // Geo
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError]   = useState('')

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
  const [receiptError, setReceiptError] = useState('')
  const [oversold, setOversold]         = useState<string[]>([])
  const [expiryWarning, setExpiryWarning] = useState<string | null>(null)
  const [mpesaPhone, setMpesaPhone]       = useState('')
  const [paymentError, setPaymentError]   = useState<string | null>(null)
  const [offlineSale, setOfflineSale]     = useState(false)

  // One id per sale, stable across retries — the API dedupes on it so a
  // timed-out checkout can be retried (or replayed from the offline queue)
  // without ever recording the sale twice.
  const saleIdRef = useRef('')
  const getSaleId = () => {
    if (!saleIdRef.current) {
      saleIdRef.current = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `tx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    }
    return saleIdRef.current
  }

  // Payment config
  const [stripeVerified, setStripeVerified] = useState(false)
  const [cardProvider, setCardProvider] = useState<'stripe' | 'paystack' | null>(null)
  // null = unknown (fetch failed / still loading) — only nag or block when we know for sure
  const [paymentConfigured, setPaymentConfigured] = useState<boolean | null>(null)
  const [productCount, setProductCount] = useState<number | null>(null)

  // Practice mode — fully on-device guided run-through: demo products,
  // simulated scan, checkout never calls the API. Nothing is recorded.
  const [practice, setPractice] = useState(false)
  const [showPracticeCard, setShowPracticeCard] = useState(false)
  const practiceDoneKey = (s: StaffSession) => `pos_practice_done_${s.id}`
  const demoItems = (): InventoryItem[] => [
    { id: 'demo_1', name: tc('sell.demo_rice'),  sale_price: 2.50, cost_price: 1.80, stock_qty: 20 },
    { id: 'demo_2', name: tc('sell.demo_milk'),  sale_price: 1.20, cost_price: 0.85, stock_qty: 12 },
    { id: 'demo_3', name: tc('sell.demo_soap'),  sale_price: 0.90, cost_price: 0.55, stock_qty: 30 },
    { id: 'demo_4', name: tc('sell.demo_bread'), sale_price: 1.00, cost_price: 0.60, stock_qty: 8 },
  ]
  const startPractice = () => {
    setPractice(true); setPaymentType('cash'); setCart([])
    setScanResult(null); setScanError(''); setSearchQuery(''); setSearchResults([])
    setScreen('add'); setAddMode('camera')
  }
  const exitPractice = () => {
    if (staff) { try { localStorage.setItem(practiceDoneKey(staff), '1') } catch {} }
    setShowPracticeCard(false); setPractice(false); setCart([])
    setSearchQuery(''); setSearchResults([]); setScanResult(null)
    setAmountTendered(''); setCheckoutError('')
    // Clear the fake practice transaction so the next real checkout renders its Complete button
    setLastTxId(''); setLastTotal(0); setPaymentError(null)
    setScreen('home')
  }

  // Shift
  const [shiftOpen, setShiftOpen]     = useState<boolean | null>(null)
  const [shiftId, setShiftId]         = useState<string | null>(null)
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [openingCash, setOpeningCash] = useState('')
  const [shiftAction, setShiftAction] = useState<'open' | 'close'>('open')
  const [closingCash, setClosingCash] = useState('')
  const [shiftLoading, setShiftLoading] = useState(false)
  const [closeVarianceReason, setCloseVarianceReason] = useState('')
  const [closeRequiresReason, setCloseRequiresReason] = useState(false)
  const [closeError, setCloseError] = useState('')

  // ── Init ────────────────────────────────────────────────────
  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    const home = getRoleHomeRoute(s.role)
    if (home !== '/sell') { router.push(home); return }
    setStaff(s)
    setSym(s.currency_symbol || '£')
    setBiz(bizLabel(s.business_type || 'retail', tc))
    try { if (!localStorage.getItem(`pos_practice_done_${s.id}`)) setShowPracticeCard(true) } catch {}
    loadTodayStats(s)
    if (s.location_id) checkShift(s)  // sync localStorage check
    // Fetch fresh owner config to get correct currency symbol
    fetch(`${API}/api/pos/config`, {
      headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
    }).then(r => r.json()).then(cfg => {
      if (cfg.currency_symbol) setSym(cfg.currency_symbol)
      if (cfg.business_type)   setBiz(bizLabel(cfg.business_type, tc))
      if (cfg.business_name)   setBusinessName(cfg.business_name)
    }).catch(() => {})

    // Fetch payment config to know if Stripe is verified (for Apple Pay sub-option)
    // and whether card/M-Pesa are available at all (surfaced on home + checkout)
    fetch(`${API}/api/pos/payment/setup`, {
      headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
    }).then(r => r.json()).then(cfg => {
      if (cfg.stripe_onboarding_complete) setStripeVerified(true)
      if (typeof cfg.configured === 'boolean') setPaymentConfigured(cfg.configured && cfg.is_active !== false)
    }).catch(() => {})

    // Product count — a brand-new business with zero products gets pointed
    // at manual entry instead of discovering an empty search at the till
    fetchInventory({ ownerId: s.owner_id, staffId: s.id, locationId: s.location_id, limit: 1 }).then(data => {
      if (typeof data.total === 'number') setProductCount(data.total)
    }).catch(() => {})

    // Background catalog sync — mirrors inventory into IndexedDB so search
    // and checkout keep working with no network. Throttled so a page visit
    // doesn't re-download the whole catalog every time.
    isCacheStale(s.owner_id, 6 * 60 * 60 * 1000).then(stale => {
      if (stale) bulkUpsertFromApi(s.owner_id, s.id, s.location_id).catch(() => {})
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
    setCloseError('')

    const finishLocally = () => {
      localStorage.removeItem(shiftKey(staff))
      setShiftOpen(false); setShiftId(null); setShowShiftModal(false)
      setClosingCash(''); setCloseVarianceReason(''); setCloseRequiresReason(false)
    }

    try {
      const res = await fetch(`${API}/api/pos/shift/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
        body: JSON.stringify({
          shift_id: shiftId,
          physical_cash_count: parseFloat(closingCash) || 0,
          variance_reason: closeVarianceReason || undefined,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        finishLocally()
      } else if (data.requires_reason) {
        // Cash count doesn't match expected — keep the shift open and ask
        // the cashier to explain before we let them close it.
        setCloseRequiresReason(true)
        setCloseError(tc('sell.shift_variance_detected', { amount: `${sym}${Math.abs(data.variance_amount).toFixed(2)}` }))
      } else {
        setCloseError(data.error || tc('sell.shift_close_failed'))
      }
    } catch {
      // Offline / unreachable — close locally so the cashier isn't blocked;
      // reconciliation will be missing server-side until connectivity returns.
      finishLocally()
    }

    setShiftLoading(false)
  }

  // ── Offline queue — cash sales made without signal upload later ──
  const offlineKey = (s: StaffSession) => `pos_offline_sales_${s.owner_id}_${s.id}`
  const replayingRef = useRef(false)

  const replayOfflineSales = useCallback(async () => {
    if (!staff || replayingRef.current) return
    let queue: { client_tx_id: string; body: any }[] = []
    try { queue = JSON.parse(localStorage.getItem(offlineKey(staff)) || '[]') } catch {}
    if (!queue.length) return
    replayingRef.current = true
    const remaining = [...queue]
    for (const entry of queue) {
      try {
        const res = await fetch(`${API}/api/pos/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
          body: JSON.stringify(entry.body),
        })
        // Uploaded (or rejected as permanently invalid) → drop from the queue.
        // 5xx / network errors keep the entry for the next replay.
        if (res.ok || res.status === 400) remaining.splice(remaining.findIndex(e => e.client_tx_id === entry.client_tx_id), 1)
        else break
      } catch { break }
    }
    try { localStorage.setItem(offlineKey(staff), JSON.stringify(remaining)) } catch {}
    replayingRef.current = false
    if (remaining.length < queue.length) loadTodayStats(staff)
  }, [staff])

  const resyncCatalog = useCallback(() => {
    if (!staff) return
    bulkUpsertFromApi(staff.owner_id, staff.id, staff.location_id).catch(() => {})
  }, [staff])

  useEffect(() => {
    if (!staff) return
    replayOfflineSales()
    const onOnline = () => { replayOfflineSales(); resyncCatalog() }
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [staff, replayOfflineSales, resyncCatalog])

  // ── Navigation guard — warn before leaving with an unpaid cart ──
  useEffect(() => {
    if (cart.length === 0 || screen === 'receipt') return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [cart.length, screen])

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

  // ── Camera (native capture — reliable on iOS / incognito) ──────
  const openProductCamera = () => {
    if (practice) {
      // Simulate a successful scan — no camera, no API, nothing recorded
      const demo = demoItems()[cart.length % 4]
      setScanError('')
      setScanning(true)
      setTimeout(() => {
        setScanResult({ name: demo.name, price: demo.sale_price, inventory_id: demo.id })
        setScanning(false)
      }, 700)
      return
    }
    prodInputRef.current?.click()
  }
  const stopCamera = () => {} // retained as a no-op for legacy call sites

  const scanProductFile = async (file: File) => {
    setScanResult(null); setScanError(''); setScanning(true)
    try {
      const dataUrl = await compressToDataUrl(file)
      const base64 = dataUrl.split(',')[1]
      const res = await fetch(`${API}/api/pos/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staff?.id || '', 'x-owner-id': staff?.owner_id || '' },
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()
      if (data.name) setScanResult({ name: data.name, price: data.price ?? 0, inventory_id: data.inventory_id, unit: data.unit })
      else setScanError(data.error || tc('sell.scan_not_identified'))
    } catch {
      setScanError(tc('sell.scan_failed'))
    }
    setScanning(false)
  }

  // ── Inventory search ─────────────────────────────────────────
  const searchInventory = useCallback(async (q: string) => {
    if (practice) {
      // Demo products only — visible without typing so there's nothing to guess
      const all = demoItems()
      setSearchResults(q.trim() ? all.filter(i => i.name.toLowerCase().includes(q.trim().toLowerCase())) : all)
      return
    }
    if (!q.trim() || !staff) { setSearchResults([]); return }
    setSearchLoading(true)
    try {
      const data = await fetchInventory({ ownerId: staff.owner_id, staffId: staff.id, locationId: staff.location_id, search: q, limit: 15 })
      setSearchResults(data.inventory || [])
    } catch {}
    setSearchLoading(false)
  }, [staff, practice, tc])

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
        setExpiryWarning(tc('sell.expiry_expired', { name: item.name, date: new Date(item.expiry_date).toLocaleDateString('en-GB') }))
        setTimeout(() => setExpiryWarning(null), 5000)
        return // block adding expired items
      } else if (daysToExpiry <= 7) {
        setExpiryWarning(
          daysToExpiry === 0 ? tc('sell.expiry_soon_today', { name: item.name })
          : daysToExpiry === 1 ? tc('sell.expiry_soon_one_day', { name: item.name })
          : tc('sell.expiry_soon_days', { name: item.name, days: daysToExpiry })
        )
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
    if (practice) {
      // Practice checkout stays entirely on-device — no transaction is created
      setLastTxId('practice')
      setLastTotal(cartTotal)
      setScreen('receipt')
      return
    }
    setProcessing(true)
    setCheckoutError('')
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
      const txBody = {
        items:           cart,
        payment_type:    paymentType === 'mobile' ? 'mpesa' : paymentType,
        cashier_id:      staff.id,
        customer_phone:  paymentType === 'mobile' ? (mpesaPhone || customerPhone || null) : (customerPhone || null),
        discount_amount:          discountAmt || null,
        amount_tendered:          paymentType === 'cash' && tendered ? tendered : null,
        shift_id:                 shiftId || null,
        // cash = paid straight away; card/mobile = pending until webhook/polling confirms
        initial_payment_status:   paymentType === 'cash' ? 'paid' : 'pending',
        notes:           [tableNumber ? `Table: ${tableNumber}` : '', geo ? `|__geo:${geo.lat.toFixed(6)},${geo.lng.toFixed(6)}` : ''].filter(Boolean).join(' ') || undefined,
        client_tx_id:    getSaleId(),
      }

      // The client_tx_id makes this POST idempotent, so a request that timed
      // out mid-flight can be retried once without risking a double record.
      // AbortController timeout matters here specifically: on a genuinely
      // offline real device, plain fetch() can hang for a very long time
      // (unlike Chrome DevTools' "Offline" throttling, which fails fast) —
      // without this, checkout would sit on "Processing..." indefinitely
      // and never reach the offline-queue fallback below.
      const postSale = () => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 8000)
        return fetch(`${API}/api/pos/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
          body: JSON.stringify(txBody),
          signal: controller.signal,
        }).finally(() => clearTimeout(timer))
      }
      let res: Response
      try {
        res = await postSale()
      } catch {
        await new Promise(r => setTimeout(r, 800))
        res = await postSale() // second network failure falls through to the outer catch
      }
      const data = await res.json()
      if (data.transaction_id) {
        setLastTxId(data.transaction_id)
        setLastTotal(cartTotal)
        setOversold(data.oversold || [])
        // Keep the cache in step with rapid consecutive sales before the
        // next background sync reconciles it to server truth.
        decrementLocalStock(cart.map(i => ({ inventory_id: i.inventory_id, qty: i.qty }))).catch(() => {})
        if (paymentType === 'cash') {
          setTodaySales(s => s + 1)
          setTodayRevenue(r => r + cartTotal)
          setScreen('receipt')
        }
        // card/mobile: stay here — payment component below handles completion
      } else {
        setCheckoutError(data.error || tc('sell.payment_failed_retry'))
      }
    } catch (err: any) {
      // Cash was already handed over — record the sale on-device and upload
      // when signal returns. Card/M-Pesa can't proceed without a connection.
      if (paymentType === 'cash' && staff) {
        try {
          const queue = JSON.parse(localStorage.getItem(offlineKey(staff)) || '[]')
          if (!queue.some((e: any) => e.client_tx_id === saleIdRef.current)) {
            queue.push({
              client_tx_id: saleIdRef.current,
              body: {
                items: cart, payment_type: 'cash', cashier_id: staff.id,
                customer_phone: customerPhone || null, discount_amount: discountAmt || null,
                amount_tendered: tendered || null, shift_id: shiftId || null,
                initial_payment_status: 'paid',
                notes: tableNumber ? `Table: ${tableNumber}` : undefined,
                client_tx_id: saleIdRef.current,
              },
            })
            localStorage.setItem(offlineKey(staff), JSON.stringify(queue))
          }
          // Same-device optimistic decrement — a second offline sale of the
          // same SKU sees accurate low-stock state without a server round-trip.
          // Cross-device drift is NOT reconciled here; the next catalog sync
          // simply overwrites with server truth.
          decrementLocalStock(cart.map(i => ({ inventory_id: i.inventory_id, qty: i.qty }))).catch(() => {})
          setOfflineSale(true)
          setLastTxId(`offline_${saleIdRef.current}`)
          setLastTotal(cartTotal)
          setTodaySales(s => s + 1)
          setTodayRevenue(r => r + cartTotal)
          setScreen('receipt')
        } catch {
          setCheckoutError(tc('sell.network_error'))
        }
      } else {
        setCheckoutError(tc('sell.network_error'))
      }
    }
    setProcessing(false)
  }

  const handleSendReceipt = async () => {
    if (!customerPhone || !lastTxId || sendingReceipt) return
    setSendingReceipt(true)
    setReceiptError('')
    try {
      const res = await fetch(`${API}/api/pos/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staff?.id || '', 'x-owner-id': staff?.owner_id || '' },
        body: JSON.stringify({ transaction_id: lastTxId, phone: customerPhone }),
      })
      if (res.ok) setReceiptSent(true)
      else {
        const data = await res.json().catch(() => ({}))
        setReceiptError(data.error || tc('sell.receipt_send_failed'))
      }
    } catch {
      setReceiptError(tc('sell.receipt_send_failed'))
    }
    setSendingReceipt(false)
  }

  const resetSale = () => {
    if (practice) { exitPractice(); return }
    setCart([]); setCustomerPhone(''); setPaymentType('cash')
    setDiscountValue(''); setDiscountType('amount')
    setAmountTendered(''); setTableNumber('')
    setLastTxId(''); setLastTotal(0); setReceiptSent(false); setReceiptError('')
    setOversold([]); setScanResult(null); setScanError('')
    setSearchQuery(''); setSearchResults([])
    setKgInputs({}); setCheckoutError(''); setGeoCoords(null)
    setOfflineSale(false); saleIdRef.current = ''
    setScreen('home')
  }

  const copilot = staff ? (
    <CashierCopilot screen={screen} cart={cart} customerPhone={customerPhone} ownerId={staff.owner_id} staffId={staff.id} />
  ) : null

  // Practice banner — pinned guidance for the current step, with an exit
  const practiceBanner = practice ? (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '10px 14px', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 800 }}>🎓 {tc('sell.practice_banner')}</span>
        {' — '}
        {screen === 'add' ? tc('sell.practice_hint_add')
          : screen === 'cart' ? tc('sell.practice_hint_cart')
          : screen === 'checkout' ? tc('sell.practice_hint_checkout')
          : screen === 'receipt' ? tc('sell.practice_hint_receipt')
          : tc('sell.practice_hint_home')}
      </div>
      <button onClick={exitPractice} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        {tc('sell.practice_exit')}
      </button>
    </div>
  ) : null

  // ─────────────────────────────────────────────────────────────
  // HOME SCREEN
  // ─────────────────────────────────────────────────────────────
  // Personalized, time-aware greeting for the header — first name only,
  // keeps it informal. Business name drops to the secondary line.
  const firstName = (staff?.name || '').trim().split(/\s+/)[0]
  const greetHour = new Date().getHours()
  const greetKey  = greetHour < 12 ? 'sell.greeting_morning' : greetHour < 17 ? 'sell.greeting_afternoon' : 'sell.greeting_evening'
  const greeting  = firstName ? tc(greetKey, { name: firstName }) : (businessName || tc('sell.app_name'))
  if (screen === 'home') return (<>{copilot}{practiceBanner}
    <div className="pos-screen" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--pos-bg)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--pos-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--pos-ink)' }}>{greeting}</div>
            {businessName && <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{businessName}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 38 }}>
            {staff?.location_id && shiftOpen !== null && (
              <button
                onClick={() => { setShiftAction(shiftOpen ? 'close' : 'open'); setCloseError(''); setCloseRequiresReason(false); setCloseVarianceReason(''); setShowShiftModal(true) }}
                className="pos-tab"
                style={{ padding: '5px 10px', borderRadius: 8, border: `1px solid ${shiftOpen ? 'var(--pos-success)' : 'var(--pos-accent)'}`, background: shiftOpen ? 'var(--pos-success-pale)' : 'var(--pos-accent-pale)', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: shiftOpen ? 'var(--pos-success)' : 'var(--pos-accent)' }}
              >
                {shiftOpen ? tc('sell.shift_open_indicator') : tc('sell.shift_open_action')}
              </button>
            )}
            {/* Location indicator */}
            <button
              onClick={() => {
                if (!navigator.geolocation) return
                setGeoError('')
                navigator.geolocation.getCurrentPosition(
                  pos => { setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoError('') },
                  () => setGeoError(tc('sell.location_denied'))
                )
              }}
              aria-label={geoCoords ? tc('sell.location_active_label', { lat: geoCoords.lat.toFixed(4), lng: geoCoords.lng.toFixed(4) }) : tc('sell.location_enable_label')}
              title={geoCoords ? `📍 ${geoCoords.lat.toFixed(4)}, ${geoCoords.lng.toFixed(4)}` : tc('sell.location_tap_enable_title')}
              style={{ padding: '4px 8px', borderRadius: 20, border: `1px solid ${geoCoords ? 'var(--pos-success)' : 'var(--pos-border)'}`, background: geoCoords ? 'var(--pos-success-pale)' : 'rgba(229,226,220,.5)', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: geoCoords ? 'var(--pos-success)' : 'var(--pos-hint)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {geoCoords ? '📍' : '📍?'}
            </button>
            <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--pos-border)', background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--pos-muted)' }}>
              {tc('sell.sign_out')}
            </button>
          </div>
        </div>

        {/* Stats strip — inline, not card grid */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--pos-ink)', letterSpacing: '-0.02em' }}>{sym}{todayRevenue.toFixed(2)}</span>
          <span style={{ fontSize: 13, color: 'var(--pos-muted)', fontWeight: 400 }}>{tc('sell.today')}</span>
          <span style={{ fontSize: 13, color: 'var(--pos-border)', margin: '0 2px' }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--pos-muted)' }}>{todaySales}</span>
          <span style={{ fontSize: 13, color: 'var(--pos-muted)', fontWeight: 400 }}>{todaySales !== 1 ? tc('sell.sales_plural') : tc('sell.sales_singular')}</span>
        </div>
      </div>

      {/* Geo error banner */}
      {geoError && (
        <div role="alert" className="pos-banner" style={{ margin: '0 20px 8px', padding: '10px 14px', borderRadius: 10, background: 'var(--pos-danger-pale)', border: '1px solid rgba(220,38,38,.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--pos-danger)' }}>📍 {geoError}</div>
          <button onClick={() => setGeoError('')} aria-label={tc('sell.dismiss')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pos-danger)', fontSize: 14, padding: '2px 4px', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Geo permission nudge — shown when location not yet captured */}
      {!geoCoords && (
        <button
          onClick={() => {
            if (!navigator.geolocation) return
            setGeoError('')
            navigator.geolocation.getCurrentPosition(
              pos => { setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoError('') },
              () => setGeoError(tc('sell.location_denied'))
            )
          }}
          style={{ margin: '0 20px 12px', padding: '10px 14px', borderRadius: 12, border: '1px dashed #d1d5db', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: 'calc(100% - 40px)', textAlign: 'left' }}>
          <span style={{ fontSize: 16 }}>📍</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)' }}>{tc('sell.tap_enable_location')}</div>
            <div style={{ fontSize: 11, color: 'var(--pos-hint)' }}>{tc('sell.geo_tags_each_sale')}</div>
          </div>
        </button>
      )}

      {/* First-run practice invitation */}
      {showPracticeCard && !practice && cart.length === 0 && (
        <div style={{ margin: '0 20px 12px', padding: '14px 16px', borderRadius: 14, background: '#1e3a5f', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{tc('sell.practice_card_title')}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', marginTop: 2, lineHeight: 1.4 }}>{tc('sell.practice_card_body')}</div>
            <button onClick={startPractice} style={{ marginTop: 8, padding: '8px 16px', borderRadius: 9, background: '#fff', border: 'none', color: '#1e3a5f', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {tc('sell.practice_start')}
            </button>
          </div>
          <button onClick={() => { if (staff) { try { localStorage.setItem(practiceDoneKey(staff), '1') } catch {} } setShowPracticeCard(false) }} aria-label={tc('sell.dismiss')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: 16, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Setup checklist — surfaces prerequisites that used to fail silently at checkout */}
      {(() => {
        const needShift  = !!staff?.location_id && shiftOpen === false
        const noProducts = productCount === 0
        const noPayments = paymentConfigured === false
        if (!needShift && !noProducts && !noPayments) return null
        return (
          <div style={{ margin: '0 20px 12px', padding: '14px 16px', borderRadius: 14, background: 'var(--pos-surface)', border: '1px solid var(--pos-border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)', marginBottom: 10 }}>{tc('sell.setup_heading')}</div>
            {needShift && (
              <button onClick={() => { setShiftAction('open'); setShowShiftModal(true) }} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', padding: '10px 12px', marginBottom: 6, borderRadius: 10, background: 'var(--pos-accent-pale)', border: '1px solid var(--pos-accent-ring)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <span style={{ fontSize: 16 }}>🕐</span>
                <span style={{ fontSize: 13, color: 'var(--pos-ink)', lineHeight: 1.45 }}>{tc('sell.setup_open_shift')}</span>
              </button>
            )}
            {noProducts && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', marginBottom: 6, borderRadius: 10, background: 'var(--pos-bg)', border: '1px solid var(--pos-border)' }}>
                <span style={{ fontSize: 16 }}>📦</span>
                <span style={{ fontSize: 13, color: 'var(--pos-ink)', lineHeight: 1.45 }}>{tc('sell.setup_no_products')}</span>
              </div>
            )}
            {noPayments && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--pos-bg)', border: '1px solid var(--pos-border)' }}>
                <span style={{ fontSize: 16 }}>💳</span>
                <span style={{ fontSize: 13, color: 'var(--pos-ink)', lineHeight: 1.45 }}>{tc('sell.setup_no_payments')}</span>
              </div>
            )}
          </div>
        )
      })()}

      {/* Cart resume banner */}
      {cart.length > 0 && (
        <div onClick={() => setScreen('cart')} style={{ margin: '0 20px 12px', padding: '14px 16px', borderRadius: 14, background: 'var(--pos-accent-pale)', border: '1px solid var(--pos-accent-ring)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: ACC }}>{cart.length !== 1 ? tc('sell.items_in_heading', { count: cart.length, heading: biz.heading.toLowerCase() }) : tc('sell.one_item_in_heading', { heading: biz.heading.toLowerCase() })}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: ACC }}>{sym}{cartTotal.toFixed(2)}</div>
        </div>
      )}

      {/* Main action */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: 14 }}>
        <button
          onClick={() => { setScanResult(null); setScanError(''); setScreen('add'); setAddMode('camera') }}
          className="pos-btn-primary"
          style={{ width: '100%', maxWidth: 300, padding: '24px', borderRadius: 20, background: ACC, color: '#fff', fontSize: 20, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          {biz.sale}
        </button>
        {cart.length > 0 && (
          <button onClick={() => setScreen('cart')} className="pos-btn-primary" style={{ width: '100%', maxWidth: 300, padding: '16px', borderRadius: 16, background: 'var(--pos-surface)', color: ACC, fontSize: 16, fontWeight: 700, border: `2px solid ${ACC}`, cursor: 'pointer' }}>
            {tc('sell.continue_heading', { heading: biz.heading, count: cart.length, total: `${sym}${cartTotal.toFixed(2)}` })}
          </button>
        )}
      </div>

      {/* Powered by AskBiz POS — brand footer */}
      <div style={{ textAlign: 'center', padding: '0 20px 18px', fontSize: 11, fontWeight: 500, color: 'var(--pos-muted)', opacity: 0.75 }}>
        {tc('sell.powered_by')}
      </div>

      {/* Shift modal */}
      {showShiftModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end', zIndex: 999 }} onClick={e => e.target === e.currentTarget && setShowShiftModal(false)}>
          <div className="pos-sheet" style={{ width: '100%', background: 'var(--pos-surface)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--pos-ink)', marginBottom: 16 }}>
              {shiftAction === 'open' ? tc('sell.open_shift') : tc('sell.close_shift')}
            </div>
            {shiftAction === 'open' ? (
              <>
                <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 8 }}>{tc('sell.opening_cash_in_till')}</div>
                <input
                  type="number" placeholder="0.00" value={openingCash} onChange={e => setOpeningCash(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14 }}
                />
                <button onClick={handleOpenShift} disabled={shiftLoading} style={{ width: '100%', padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {shiftLoading ? tc('sell.opening') : tc('sell.open_shift')}
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 8 }}>{tc('sell.closing_cash_count')}</div>
                <input
                  type="number" placeholder="0.00" value={closingCash} onChange={e => setClosingCash(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14 }}
                />
                {closeError && (
                  <div role="alert" style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--pos-danger-pale)', border: '1px solid rgba(220,38,38,.2)', fontSize: 13, color: 'var(--pos-danger)', lineHeight: 1.4 }}>
                    {closeError}
                  </div>
                )}
                {closeRequiresReason && (
                  <>
                    <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 8 }}>{tc('sell.shift_variance_reason_label')}</div>
                    <input
                      type="text" placeholder={tc('sell.shift_variance_reason_placeholder')} value={closeVarianceReason}
                      onChange={e => setCloseVarianceReason(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14 }}
                    />
                  </>
                )}
                <button
                  onClick={handleCloseShift}
                  disabled={shiftLoading || (closeRequiresReason && !closeVarianceReason.trim())}
                  style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'var(--pos-ink)', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: (closeRequiresReason && !closeVarianceReason.trim()) ? 0.5 : 1 }}
                >
                  {shiftLoading ? tc('sell.closing') : tc('sell.close_shift')}
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
  if (screen === 'add') return (<>{copilot}{practiceBanner}
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { stopCamera(); setScreen('home') }} aria-label={tc('sell.back_to_home')} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{biz.item}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '12px 20px 0' }}>
        {(['camera', 'search'] as AddMode[]).map(m => (
          <button key={m} onClick={() => {
            if (m === 'search') stopCamera()
            if (m === 'camera') { setScanResult(null); setScanError('') }
            setAddMode(m)
          }} className="pos-tab" style={{ flex: 1, padding: '9px', border: 'none', background: 'transparent', color: addMode === m ? '#fff' : 'rgba(255,255,255,.5)', fontSize: 14, fontWeight: addMode === m ? 700 : 400, borderBottom: addMode === m ? '2px solid #d08a59' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
            {m === 'camera' ? tc('sell.tab_camera') : tc('sell.tab_search')}
          </button>
        ))}
      </div>

      {/* Camera mode — native capture */}
      {addMode === 'camera' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <input ref={prodInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
            aria-label={tc('sell.photograph_product')} onChange={e => { const f = e.target.files?.[0]; if (f) scanProductFile(f); e.target.value = '' }} />
          {scanning ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,.25)', borderTopColor: ACC, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{tc('sell.reading_product')}</div>
            </div>
          ) : scanResult ? (
            <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="pos-reveal" style={{ padding: '24px', borderRadius: 16, background: 'var(--pos-surface)', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 6 }}>{tc('sell.found')}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pos-ink)' }}>{scanResult.name}</div>
                  {scanResult.unit === 'kg' && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-accent)', background: 'var(--pos-accent-pale)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--pos-accent-ring)' }}>{tc('sell.unit_kg')}</span>
                  )}
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: ACC }}>{sym}{scanResult.price.toFixed(2)}</div>
                {scanResult.unit === 'kg' && (
                  <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 2 }}>{tc('sell.per_kg_set_quantity')}</div>
                )}
              </div>
              {scanError && <div style={{ fontSize: 13, color: '#fca5a5', textAlign: 'center' }}>{scanError}</div>}
              <button onClick={confirmScan} style={{ padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                {tc('sell.add_to_heading', { heading: biz.heading.toLowerCase() })}
              </button>
              <button onClick={() => { setScanResult(null); openProductCamera() }} style={{ padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                {tc('sell.scan_again')}
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '24px' }}>
              <button onClick={openProductCamera} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 16 }}>
                <div style={{ width: 88, height: 88, borderRadius: 24, border: '2px dashed rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📷</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{tc('sell.tap_to_photograph')}</div>
              </button>
              {scanError && <div style={{ fontSize: 14, color: '#fca5a5', textAlign: 'center' }}>{scanError}</div>}
              <button onClick={() => { setScanError(''); setAddMode('search') }} style={{ padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                {tc('sell.search_instead')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search mode */}
      {addMode === 'search' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--pos-bg)' }}>
          <div style={{ padding: '14px 20px' }}>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={tc('sell.search_placeholder')}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' }}
            />
          </div>

          {/* Manual entry shortcut */}
          {searchQuery && !searchLoading && searchResults.length === 0 && (
            <div style={{ padding: '0 20px 12px' }}>
              <button onClick={() => {
                const price = 0
                addToCart({ name: searchQuery, unit_price: price, cost_price: 0 })
                setScreen('cart')
              }} style={{ width: '100%', padding: '13px', borderRadius: 12, border: '1.5px dashed var(--pos-accent)', background: 'var(--pos-accent-pale)', color: 'var(--pos-accent)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {tc('sell.add_manually', { query: searchQuery })}
              </button>
            </div>
          )}

          {expiryWarning && (
            <div style={{ margin: '0 20px 10px', padding: '12px 16px', borderRadius: 12, background: 'var(--pos-danger-pale)', border: '1px solid var(--pos-danger-ring)', fontSize: 13, fontWeight: 600, color: 'var(--pos-danger)' }}>
              {expiryWarning}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
            {searchLoading && (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--pos-muted)', fontSize: 14 }}>{tc('sell.searching')}</div>
            )}
            {searchResults.map(item => {
              const todayMs2 = new Date().setHours(0,0,0,0)
              const daysToExp = item.expiry_date ? Math.floor((new Date(item.expiry_date).getTime() - todayMs2) / 86400000) : null
              const isExpiredItem = daysToExp !== null && daysToExp < 0
              const isExpiringSoonItem = daysToExp !== null && daysToExp >= 0 && daysToExp <= 7
              return (
              <button key={item.id} onClick={() => addFromSearch(item)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: isExpiredItem ? 'rgba(220,38,38,.04)' : '#fff', borderRadius: 14, marginBottom: 8, border: `1px solid ${isExpiredItem ? '#fca5a5' : 'var(--pos-border)'}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pos-ink)' }}>
                    {item.name}
                    {isExpiredItem && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--pos-danger)', background: 'rgba(220,38,38,.1)', padding: '1px 6px', borderRadius: 9999 }}>{tc('sell.badge_expired')}</span>}
                    {isExpiringSoonItem && !isExpiredItem && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--pos-warning)', background: 'rgba(249,115,22,.1)', padding: '1px 6px', borderRadius: 9999 }}>{daysToExp === 0 ? tc('sell.badge_exp_today') : tc('sell.badge_exp_days', { days: daysToExp as number })}</span>}
                  </div>
                  {item.sku && <div style={{ fontSize: 11, color: 'var(--pos-hint)', marginTop: 1 }}>{tc('sell.sku_label', { sku: item.sku })}</div>}
                  <div style={{ fontSize: 11, marginTop: 3 }}>
                    {item.stock_qty <= 0
                      ? <span style={{ color: 'var(--pos-danger)', fontWeight: 600 }}>{tc('sell.out_of_stock')}</span>
                      : item.low_stock_threshold && item.stock_qty <= item.low_stock_threshold
                      ? <span style={{ color: '#f59e0b', fontWeight: 600 }}>{tc('sell.low_stock', { count: item.stock_qty })}</span>
                      : <span style={{ color: 'var(--pos-muted)' }}>{tc('sell.in_stock', { count: item.stock_qty })}</span>
                    }
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: isExpiredItem ? 'var(--pos-danger)' : ACC, marginLeft: 12 }}>{sym}{item.sale_price.toFixed(2)}</div>
              </button>
              )
            })}
            {!searchLoading && searchResults.length === 0 && !searchQuery && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--pos-muted)', fontSize: 14 }}>
                {tc('sell.start_typing_to_search')}
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
  if (screen === 'cart') return (<>{copilot}{practiceBanner}
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('home')} aria-label={tc('sell.back_to_home')} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', color: 'var(--pos-ink)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--pos-ink)' }}>{biz.heading}</div>
        {cart.length > 0 && <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--pos-muted)' }}>{cart.length !== 1 ? tc('sell.items_count', { count: cart.length }) : tc('sell.one_item')}</div>}
      </div>

      <div style={{ flex: 1, padding: '8px 20px', overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--pos-muted)', fontSize: 14 }}>{tc('sell.heading_is_empty', { heading: biz.heading })}</div>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="pos-item" style={{ background: 'var(--pos-surface)', borderRadius: 14, marginBottom: 10, border: '1px solid var(--pos-border)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pos-ink)' }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--pos-muted)' }}>{sym}{item.unit_price.toFixed(2)} {item.unit === 'kg' ? tc('sell.per_kg') : tc('sell.each')}</div>
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
                        style={{ width: 68, padding: '6px 8px', borderRadius: 8, border: '1.5px solid #d08a59', fontSize: 15, fontWeight: 700, textAlign: 'center', fontFamily: 'inherit', color: 'var(--pos-ink)', background: 'var(--pos-surface)', boxSizing: 'border-box' }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-accent)', background: 'var(--pos-accent-pale)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--pos-accent-ring)', whiteSpace: 'nowrap' }}>{tc('sell.unit_kg')}</span>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => updateQty(idx, -1)} aria-label={tc('sell.decrease_quantity', { name: item.name })} className="pos-qty-btn" style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid var(--pos-border)', background: 'var(--pos-bg)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                      <span style={{ fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: 'center' }} aria-label={tc('sell.quantity_label', { qty: item.qty })}>{item.qty}</span>
                      <button onClick={() => updateQty(idx, 1)}  aria-label={tc('sell.increase_quantity', { name: item.name })} className="pos-qty-btn" style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid var(--pos-border)', background: 'var(--pos-bg)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                    </>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--pos-ink)', minWidth: 64, textAlign: 'right' }}>{sym}{(item.qty * item.unit_price).toFixed(2)}</div>
                </div>
              </div>
              {/* Note row */}
              {editNoteIdx === idx ? (
                <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
                  <input
                    autoFocus value={noteInput} onChange={e => setNoteInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveNote(idx)}
                    placeholder={tc('sell.note_placeholder')}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--pos-border)', fontSize: 13, fontFamily: 'inherit' }}
                  />
                  <button onClick={() => saveNote(idx)} style={{ padding: '8px 12px', borderRadius: 8, background: ACC, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tc('sell.save')}</button>
                </div>
              ) : (
                <button onClick={() => { setEditNoteIdx(idx); setNoteInput(item.notes || '') }} style={{ width: '100%', padding: '6px 16px 10px', textAlign: 'left', border: 'none', background: 'transparent', fontSize: 12, color: 'var(--pos-hint)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  + {item.notes ? tc('sell.edit_note') : tc('sell.add_note_modifier')}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '14px 20px 32px', background: 'var(--pos-surface)', borderTop: '1px solid var(--pos-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--pos-muted)' }}>{tc('sell.total')}</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--pos-ink)' }}>{sym}{cartTotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <button onClick={() => { stopCamera(); setScreen('add'); setAddMode('search') }} style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'var(--pos-bg)', border: '1px solid var(--pos-border)', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--pos-ink)' }}>
            + {biz.item}
          </button>
          <button onClick={() => { captureGeo(); setScreen('checkout') }} disabled={cart.length === 0} className="pos-btn-primary" style={{ flex: 2, padding: '13px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            {tc('sell.checkout_arrow')}
          </button>
        </div>
        {cart.length > 0 && (
          <button onClick={() => {
            // Guard the most destructive one-tap action on the page
            if (window.confirm(tc('sell.cancel_confirm', { heading: biz.heading.toLowerCase() }))) { setCart([]); setScreen('home') }
          }} style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'transparent', border: '1px solid var(--pos-danger-ring)', color: 'var(--pos-danger)', fontSize: 14, cursor: 'pointer' }}>
            {tc('sell.cancel_heading', { heading: biz.heading.toLowerCase() })}
          </button>
        )}
      </div>
    </div>
  </>)

  // ─────────────────────────────────────────────────────────────
  // CHECKOUT SCREEN
  // ─────────────────────────────────────────────────────────────
  if (screen === 'checkout') return (<>{copilot}{practiceBanner}
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('cart')} aria-label={tc('sell.back_to_cart')} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', color: 'var(--pos-ink)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--pos-ink)' }}>{tc('sell.checkout')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
        {/* Total summary */}
        <div style={{ padding: '20px', background: 'var(--pos-surface)', borderRadius: 16, border: '1px solid var(--pos-border)', marginBottom: 14 }}>
          {discountAmt > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--pos-muted)', marginBottom: 4 }}>
                <span>{tc('sell.subtotal')}</span><span>{sym}{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--pos-success)', marginBottom: 8 }}>
                <span>{tc('sell.discount')}</span><span>−{sym}{discountAmt.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: 'var(--pos-border)', marginBottom: 10 }} />
            </>
          ) : null}
          <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 4 }}>{tc('sell.total_to_collect')}</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--pos-ink)' }}>{sym}{cartTotal.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 4 }}>{cart.length !== 1 ? tc('sell.items_count', { count: cart.length }) : tc('sell.one_item')}</div>
        </div>

        {/* Payment method */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 8 }}>{tc('sell.payment_method')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {([['cash', tc('sell.pay_cash')], ['card', tc('sell.pay_card')], ['mobile', tc('sell.pay_mobile')]] as const)
              .filter(([type]) => !practice || type === 'cash') // practice is cash-only: card/M-Pesa would hit real payment providers
              .map(([type, label]) => {
                const requiresNetwork = type !== 'cash' && !online
                return (
                  <button
                    key={type}
                    disabled={requiresNetwork}
                    onClick={() => { setPaymentType(type); setLastTxId(''); setPaymentError(null); setCardProvider(null); }}
                    className="pos-tab"
                    style={{
                      padding: '13px 8px', borderRadius: 12,
                      border: `2px solid ${paymentType === type ? ACC : 'var(--pos-border)'}`,
                      background: paymentType === type ? 'var(--pos-accent-pale)' : '#fff',
                      color: paymentType === type ? ACC : 'var(--pos-muted)',
                      fontSize: 13, fontWeight: 700,
                      cursor: requiresNetwork ? 'not-allowed' : 'pointer',
                      opacity: requiresNetwork ? 0.5 : 1,
                    }}
                  >
                    {label}
                    {requiresNetwork && <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{tc('sell.offline_payment_disabled')}</div>}
                  </button>
                )
              })}
          </div>
        </div>

        {/* Payments not configured — explain instead of failing after the transaction is created */}
        {paymentConfigured === false && paymentType !== 'cash' && (
          <div className="pos-banner" style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', fontSize: 13, color: '#b45309', lineHeight: 1.5 }}>
            {tc('sell.checkout_payments_not_setup')}
          </div>
        )}

        {/* Card sub-selector — shown when Card is selected and merchant has both Stripe + Paystack */}
        {paymentType === 'card' && stripeVerified && !lastTxId && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tc('sell.how_customer_wants_to_pay')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={() => setCardProvider('paystack')}
                style={{ padding: '14px 10px', borderRadius: 14, border: `2px solid ${cardProvider === 'paystack' ? ACC : 'var(--pos-border)'}`, background: cardProvider === 'paystack' ? 'var(--pos-accent-pale)' : '#fff', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>💳</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{tc('sell.card_label')}</div>
                <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 1 }}>{tc('sell.card_brands')}</div>
              </button>
              <button
                onClick={() => setCardProvider('stripe')}
                style={{ padding: '14px 10px', borderRadius: 14, border: `2px solid ${cardProvider === 'stripe' ? '#635bff' : 'var(--pos-border)'}`, background: cardProvider === 'stripe' ? 'rgba(99,91,255,.06)' : '#fff', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>🍎</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>{tc('sell.apple_google_pay')}</div>
                <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 1 }}>{tc('sell.scan_qr_to_pay')}</div>
              </button>
            </div>
          </div>
        )}

        {/* M-Pesa phone input — shows immediately when Mobile selected */}
        {paymentType === 'mobile' && !lastTxId && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 6 }}>{tc('sell.mpesa_number_label')}</div>
            <input type="tel" placeholder={tc('sell.mpesa_number_placeholder')} value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' }} />
          </div>
        )}

        {/* Card payment — shows after transaction created */}
        {paymentType === 'card' && lastTxId && (
          <PosCardPayment transactionId={lastTxId} amount={cartTotal} currencySymbol={sym} ownerId={staff.owner_id} staffId={staff.id}
            stripeVerified={stripeVerified}
            defaultProvider={cardProvider || undefined}
            onPaymentComplete={() => {
              // Mark payment_status = paid now payment is confirmed
              fetch(`${API}/api/pos/transactions`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
                body: JSON.stringify({ transaction_id: lastTxId, status: 'paid' }),
              }).catch(() => {})
              setTodaySales(s => s + 1); setTodayRevenue(r => r + cartTotal); setScreen('receipt')
            }}
            onPaymentFailed={(e) => {
              // Mark payment_status = failed so it doesn't count in stats
              fetch(`${API}/api/pos/transactions`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
                body: JSON.stringify({ transaction_id: lastTxId, status: 'failed' }),
              }).catch(() => {})
              setLastTxId('')
              setPaymentError(e)
            }} />
        )}

        {/* M-Pesa STK push — shows after transaction created, auto-sends prompt */}
        {paymentType === 'mobile' && lastTxId && (
          <PosMobilePayment transactionId={lastTxId} amount={cartTotal} currencySymbol={sym} ownerId={staff.owner_id} staffId={staff.id}
            customerPhone={mpesaPhone} autoSend={!!mpesaPhone}
            onPaymentComplete={() => {
              fetch(`${API}/api/pos/transactions`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
                body: JSON.stringify({ transaction_id: lastTxId, status: 'paid' }),
              }).catch(() => {})
              setTodaySales(s => s + 1); setTodayRevenue(r => r + cartTotal); setScreen('receipt')
            }}
            onPaymentFailed={(e) => {
              fetch(`${API}/api/pos/transactions`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
                body: JSON.stringify({ transaction_id: lastTxId, status: 'failed' }),
              }).catch(() => {})
              setLastTxId('')
              setPaymentError(e)
            }} />
        )}

        {/* Cash tendered → change */}
        {paymentType === 'cash' && (
          <div style={{ marginBottom: 14, padding: '16px', background: 'var(--pos-surface)', borderRadius: 14, border: '1px solid var(--pos-border)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 8 }}>{tc('sell.amount_received')}</div>
            <input
              type="number" inputMode="decimal" placeholder={`${sym}0.00`} value={amountTendered}
              onChange={e => setAmountTendered(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 18, fontWeight: 700, fontFamily: 'inherit', boxSizing: 'border-box', color: 'var(--pos-ink)' }}
            />
            {changeDue > 0 && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--pos-success-pale)', border: '1px solid var(--pos-success-ring)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos-success)' }}>{tc('sell.change_due')}</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--pos-success)' }}>{sym}{changeDue.toFixed(2)}</span>
              </div>
            )}
            {amountTendered && tendered < cartTotal && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--pos-danger)' }}>
                {tc('sell.short_by', { amount: `${sym}${(cartTotal - tendered).toFixed(2)}` })}
              </div>
            )}
          </div>
        )}

        {/* Discount */}
        <div style={{ marginBottom: 14, padding: '16px', background: 'var(--pos-surface)', borderRadius: 14, border: '1px solid var(--pos-border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 8 }}>{tc('sell.discount_optional')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--pos-border)' }}>
              {(['amount', 'percent'] as const).map(t => (
                <button key={t} onClick={() => setDiscountType(t)} style={{ padding: '10px 14px', border: 'none', background: discountType === t ? ACC : '#fff', color: discountType === t ? '#fff' : 'var(--pos-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {t === 'amount' ? sym : tc('sell.percent_symbol')}
                </button>
              ))}
            </div>
            <input
              type="number" inputMode="decimal" placeholder={tc('sell.discount_value_placeholder')}
              value={discountValue} onChange={e => setDiscountValue(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', color: 'var(--pos-ink)' }}
            />
          </div>
          {discountAmt > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--pos-success)' }}>
              {tc('sell.saving_off', { amount: `${sym}${discountAmt.toFixed(2)}`, percent: ((discountAmt / subtotal) * 100).toFixed(0) })}
            </div>
          )}
        </div>

        {/* Table number (restaurant/café only) */}
        {biz.table && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 6 }}>{tc('sell.table_number_optional')}</div>
            <input
              type="text" placeholder={tc('sell.table_number_placeholder')} value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* Customer phone */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 4 }}>{tc('sell.customer_phone_optional')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginBottom: 6 }}>{tc('sell.to_send_whatsapp_receipt')}</div>
          <input
            type="tel" placeholder={tc('sell.customer_phone_placeholder')} value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ padding: '14px 20px 40px', background: 'var(--pos-surface)', borderTop: '1px solid var(--pos-border)' }}>
        {checkoutError && (
          <div className="pos-banner" style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--pos-danger-pale)', border: '1px solid var(--pos-danger-ring)', fontSize: 13, color: 'var(--pos-danger)', fontWeight: 500 }}>
            ⚠ {checkoutError}
          </div>
        )}
        {paymentError && (
          <div className="pos-banner" style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--pos-danger-pale)', border: '1px solid var(--pos-danger-ring)', fontSize: 13, color: 'var(--pos-danger)', fontWeight: 500 }}>
            ⚠ {paymentError}
          </div>
        )}
        {!lastTxId && (
          <button
            onClick={handleCheckout}
            disabled={processing || (paymentType === 'cash' && (!amountTendered || tendered < cartTotal)) || (paymentType === 'card' && stripeVerified && !cardProvider) || (paymentType !== 'cash' && paymentConfigured === false) || (paymentType !== 'cash' && !online)}
            className="pos-btn-primary"
            style={{ width: '100%', padding: '18px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 18, fontWeight: 800, border: 'none', cursor: processing ? 'wait' : 'pointer', opacity: (paymentType === 'cash' && (!amountTendered || tendered < cartTotal)) ? 0.5 : 1 }}
          >
            {processing ? tc('sell.processing') :
              paymentType === 'mobile' ? tc('sell.send_mpesa', { amount: `${sym}${cartTotal.toFixed(2)}` }) :
              paymentType === 'card' && stripeVerified && cardProvider === 'stripe' ? tc('sell.charge_apple_google_pay', { amount: `${sym}${cartTotal.toFixed(2)}` }) :
              paymentType === 'card' && stripeVerified && cardProvider === 'paystack' ? tc('sell.charge_card_amount', { amount: `${sym}${cartTotal.toFixed(2)}` }) :
              paymentType === 'card' && stripeVerified && !cardProvider ? tc('sell.select_how_to_pay') :
              paymentType === 'card'   ? tc('sell.charge_card_amount', { amount: `${sym}${cartTotal.toFixed(2)}` }) :
                                        tc('sell.complete_amount', { amount: `${sym}${cartTotal.toFixed(2)}` })}
          </button>
        )}
      </div>
    </div>
  </>)

  // ─────────────────────────────────────────────────────────────
  // RECEIPT SCREEN
  // ─────────────────────────────────────────────────────────────
  if (screen === 'receipt') return (<>{copilot}{practiceBanner}
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
        <div className="pos-success-icon" style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--pos-success-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke='var(--pos-success)' strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pos-ink)', marginBottom: 4 }}>
          {biz.sale === tc('sell.biz_food_sale') ? tc('sell.order_complete') : biz.sale === tc('sell.biz_service_sale') ? tc('sell.booking_done') : tc('sell.sale_complete')}
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--pos-success)', marginBottom: changeDue > 0 ? 6 : 20 }}>
          {sym}{lastTotal.toFixed(2)}
        </div>

        {/* Change due */}
        {changeDue > 0 && (
          <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 12, background: 'var(--pos-success-pale)', border: '1px solid var(--pos-success-ring)' }}>
            <div style={{ fontSize: 12, color: 'var(--pos-success)', marginBottom: 2 }}>{tc('sell.change_to_give')}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--pos-success)' }}>{sym}{changeDue.toFixed(2)}</div>
          </div>
        )}

        {/* Practice sale — celebrate, and be explicit that nothing was recorded */}
        {practice && (
          <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 10, background: '#1e3a5f', fontSize: 13, color: '#fff', textAlign: 'left', lineHeight: 1.5 }}>
            🎓 {tc('sell.practice_receipt_note')}
          </div>
        )}

        {/* Offline sale — recorded on-device, uploads when signal returns */}
        {offlineSale && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', fontSize: 12, color: '#d97706', textAlign: 'left', lineHeight: 1.5 }}>
            {tc('sell.offline_sale_saved')}
          </div>
        )}

        {/* Oversold warning */}
        {oversold.length > 0 && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', fontSize: 12, color: '#d97706', textAlign: 'left' }}>
            {tc('sell.oversold_warning', { items: oversold.join(', ') })}
          </div>
        )}

        {/* Items receipt */}
        <div style={{ background: 'var(--pos-surface)', borderRadius: 14, border: '1px solid var(--pos-border)', padding: '14px', marginBottom: 16, textAlign: 'left' }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < cart.length - 1 ? '1px solid #f0ede8' : 'none', fontSize: 14 }}>
              <span style={{ color: 'var(--pos-ink)' }}>{item.name} ×{item.qty}{item.unit === 'kg' ? 'kg' : ''}{item.notes ? ` (${item.notes})` : ''}</span>
              <span style={{ fontWeight: 600, color: 'var(--pos-ink)' }}>{sym}{(item.qty * item.unit_price).toFixed(2)}</span>
            </div>
          ))}
          {discountAmt > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 0', fontSize: 13, color: 'var(--pos-success)', fontWeight: 600 }}>
              <span>{tc('sell.discount')}</span><span>−{sym}{discountAmt.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* WhatsApp receipt — needs the server copy of the sale, so not available for queued offline or practice sales */}
        {(offlineSale || practice) ? null : !receiptSent ? (
          <div style={{ marginBottom: 16 }}>
            {!customerPhone ? (
              <>
                <input
                  type="tel" placeholder={tc('sell.customer_phone_for_receipt')}
                  value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 14, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box', marginBottom: 8 }}
                />
                <button onClick={handleSendReceipt} disabled={!customerPhone || sendingReceipt} style={{ width: '100%', padding: '13px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {sendingReceipt ? tc('sell.sending') : tc('sell.send_whatsapp_receipt')}
                </button>
              </>
            ) : (
              <button onClick={handleSendReceipt} disabled={sendingReceipt} style={{ width: '100%', padding: '13px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                {sendingReceipt ? tc('sell.sending') : tc('sell.send_to_phone', { phone: customerPhone })}
              </button>
            )}
            {receiptError && (
              <div role="alert" style={{ marginTop: 8, padding: '9px 12px', borderRadius: 10, background: 'var(--pos-danger-pale)', border: '1px solid var(--pos-danger-ring)', fontSize: 12, color: 'var(--pos-danger)', fontWeight: 500 }}>
                ⚠ {receiptError}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '11px', borderRadius: 12, background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.3)', color: 'var(--pos-success)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            {tc('sell.receipt_sent')}
          </div>
        )}

        <button onClick={resetSale} style={{ width: '100%', padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          {tc('sell.sale_arrow', { sale: biz.sale })}
        </button>
      </div>
    </div>
  </>)

  return null
}
