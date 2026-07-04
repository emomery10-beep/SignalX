'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import PosCardPayment from '@/components/PosCardPayment'
import PosMobilePayment from '@/components/PosMobilePayment'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface CartItem {
  inventory_id?: string
  name: string
  qty: number
  unit_price: number
  cost_price: number
}

interface StaffSession {
  id: string
  name: string
  role: string
  owner_id: string
  currency_symbol?: string
}

type Screen = 'login' | 'home' | 'scan' | 'cart' | 'checkout' | 'receipt'

export default function SellPage() {
  const router  = useRouter()
  const { lang, tc } = useLang()
  const [staff, setStaff]     = useState<StaffSession | null>(null)
  const [screen, setScreen]   = useState<Screen>('login')
  const [cart, setCart]       = useState<CartItem[]>([])
  const [todaySales, setTodaySales]   = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [currencySymbol, setCurrencySymbol] = useState('£')

  // Geo state for map pins
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null)

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPin, setLoginPin]     = useState('')
  const [loginStep, setLoginStep]   = useState<'email' | 'pin'>('email')
  const [loginName, setLoginName]   = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Scan state
  const videoRef    = useRef<HTMLVideoElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning]   = useState(false)
  const [scanLoading, setScanLoading] = useState(false) // API call in flight
  const [scanPreview, setScanPreview] = useState<string | null>(null) // captured image preview
  const [scanResult, setScanResult] = useState<{ name: string; price: number; inventory_id?: string } | null>(null)
  const [scanError, setScanError]   = useState('')

  // Checkout state
  const [paymentType, setPaymentType]   = useState<'cash' | 'card' | 'mobile'>('cash')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [customerPhone, setCustomerPhone] = useState('')
  const [processing, setProcessing]     = useState(false)
  const [lastTxId, setLastTxId]         = useState('')
  const [sendingReceipt, setSendingReceipt] = useState(false)
  const [receiptSent, setReceiptSent]   = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (session) {
      try {
        const s = JSON.parse(session) as StaffSession
        if (s.role === 'inventory') { router.push(localePath('/inventory', lang)); return }
        setStaff(s)
        setCurrencySymbol(s.currency_symbol || '£')
        setScreen('home')
        loadTodayStats(s.owner_id, s.id)
      } catch { /* invalid session, show login */ }
    }
    // Start capturing location so it's ready by checkout
    if (navigator.geolocation) {
      const doGeo = () => navigator.geolocation.getCurrentPosition(
        pos => setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      )
      doGeo()
      const geoTimer = setInterval(doGeo, 60_000)
      return () => clearInterval(geoTimer)
    }
  }, [])

  // ── Staff Login ───────────────────────────────────────────
  const handleCheckEmail = async () => {
    if (!loginEmail.trim()) return
    setLoginLoading(true); setLoginError('')
    try {
      const res = await fetch(`${API}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_staff', email: loginEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setLoginError(data.error || 'Email not recognised'); setLoginLoading(false); return }
      setLoginName(data.name || '')
      setLoginStep('pin')
    } catch { setLoginError('Connection error. Please try again.') }
    setLoginLoading(false)
  }

  const handleVerifyPin = async () => {
    if (!loginPin) return
    setLoginLoading(true); setLoginError('')
    try {
      const res = await fetch(`${API}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', email: loginEmail.trim(), pin: loginPin }),
      })
      const data = await res.json()
      if (!res.ok) { setLoginError(data.error || 'Invalid PIN'); setLoginLoading(false); return }
      if (data.verified && data.staff) {
        const s = data.staff as StaffSession
        localStorage.setItem('pos_staff', JSON.stringify(s))
        if (s.role === 'inventory') { router.push(localePath('/inventory', lang)); return }
        setStaff(s)
        setCurrencySymbol(s.currency_symbol || '£')
        setScreen('home')
        loadTodayStats(s.owner_id, s.id)
      }
    } catch { setLoginError('Connection error. Please try again.') }
    setLoginLoading(false)
  }

  const loadTodayStats = async (owner_id: string, staffId?: string) => {
    const from = new Date(); from.setHours(0,0,0,0)
    try {
      const res = await fetch(`${API}/api/pos/transactions?from=${from.toISOString()}`, {
        headers: { 'x-owner-id': owner_id },
      })
      const data = await res.json()
      const sid = staffId || staff?.id
      const mine = (data.transactions || []).filter((t: { pos_staff: { id: string } | null; status: string }) =>
        t.pos_staff?.id === sid && t.status === 'completed'
      )
      setTodaySales(mine.length)
      setTodayRevenue(mine.reduce((s: number, t: { total: number }) => s + t.total, 0))
    } catch { /* silent — stats are non-critical */ }
  }

  const cartTotal = cart.reduce((s, i) => s + i.qty * i.unit_price, 0)
  const sym = currencySymbol

  // ── Camera scan ───────────────────────────────────────────
  const startCamera = async () => {
    setScanResult(null); setScanError(''); setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
    } catch {
      setScanError('Camera not available. Add item manually.')
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
    if (!canvasRef.current || !videoRef.current || !staff) return
    const canvas = canvasRef.current
    const video  = videoRef.current

    // Resize to max 1200px for API limits
    const maxDim = 1200
    let w = video.videoWidth, h = video.videoHeight
    console.log('[Sell Scan] Video dimensions:', w, 'x', h)
    if (w === 0 || h === 0) {
      setScanError('Camera not ready — wait a moment and try again.')
      return
    }
    if (w > maxDim || h > maxDim) {
      if (w > h) { h = Math.round(h * maxDim / w); w = maxDim }
      else       { w = Math.round(w * maxDim / h); h = maxDim }
    }
    canvas.width = w; canvas.height = h
    canvas.getContext('2d')?.drawImage(video, 0, 0, w, h)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
    const base64 = dataUrl.split(',')[1]
    console.log('[Sell Scan] Captured image size:', Math.round(base64.length / 1024), 'KB')
    console.log('[Sell Scan] Image hash (first 30):', base64.substring(0, 30))

    // Show preview of captured image
    setScanPreview(dataUrl)
    stopCamera()
    setScanLoading(true)
    setScanError('')

    try {
      const res = await fetch(`${API}/api/pos/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-staff-id': staff.id,
          'x-owner-id': staff.owner_id,
        },
        body: JSON.stringify({ image: base64 }),
      })
      console.log('[Sell Scan] API response status:', res.status)
      const data = await res.json()
      console.log('[Sell Scan] API response:', JSON.stringify(data))
      if (data.name) {
        setScanResult({
          name: data.name,
          price: data.price || 0,
          inventory_id: data.inventory_id || undefined,
        })
      } else {
        setScanError(data.error || 'Could not identify product. Try again or add manually.')
      }
    } catch (err) {
      console.error('[Sell Scan] Fetch error:', err)
      setScanError('Scan failed. Try again or add manually.')
    }
    setScanLoading(false)
  }

  const confirmScan = () => {
    if (!scanResult) return
    addToCart({ name: scanResult.name, unit_price: scanResult.price, cost_price: 0, qty: 1, inventory_id: scanResult.inventory_id })
    setScanResult(null); setScreen('cart')
  }

  // ── Cart management ───────────────────────────────────────
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

  // ── Checkout ──────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!staff || cart.length === 0) return
    setProcessing(true)
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
    try {
      const res = await fetch(`${API}/api/pos/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-id': staff.owner_id,
          'x-staff-id': staff.id,
        },
        body: JSON.stringify({
          items:          cart,
          payment_type:   paymentType,
          cashier_id:     staff.id,
          customer_phone: customerPhone || null,
          notes:          geo ? `|__geo:${geo.lat.toFixed(6)},${geo.lng.toFixed(6)}` : undefined,
        }),
      })
      const data = await res.json()
      setProcessing(false)
      if (data.transaction_id) {
        setLastTxId(data.transaction_id)
        if (paymentType === 'cash') {
          setTodaySales(s => s + 1)
          setTodayRevenue(r => r + cartTotal)
          setScreen('receipt')
        }
        // card/mobile: stay on checkout, payment components render below
      } else if (!res.ok) {
        // 402 pos_not_active = the owner's subscription/trial isn't active —
        // surface it instead of failing silently so the cashier can tell the
        // owner, rather than losing sales to a mystery.
        setPaymentError(data.error || 'Sale could not be recorded — please try again.')
      }
    } catch {
      setProcessing(false)
      setPaymentError('Sale could not be recorded — check your connection and try again.')
    }
  }

  const handleSendReceipt = async () => {
    if (!customerPhone || !lastTxId) return
    setSendingReceipt(true)
    try {
      await fetch(`${API}/api/pos/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: lastTxId, phone: customerPhone }),
      })
      setReceiptSent(true)
    } catch { /* receipt send is best-effort */ }
    setSendingReceipt(false)
  }

  const resetSale = () => {
    setCart([]); setCustomerPhone(''); setPaymentType('cash')
    setLastTxId(''); setReceiptSent(false); setScreen('home')
  }

  // ── LOGIN SCREEN ──────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9f8f6', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#1a1916', marginBottom: 4 }}>{tc('pos_sell.askbiz_pos')}</div>
        <div style={{ fontSize: 14, color: '#6b6760', marginBottom: 32 }}>{tc('pos_sell.staff_signin')}</div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', border: '1px solid #e5e2dc' }}>
          {loginStep === 'email' ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 16, textAlign: 'left' }}>{tc('pos_sell.enter_email')}</div>
              <input
                type="email"
                autoFocus
                placeholder={tc('pos_sell.email_placeholder')}
                value={loginEmail}
                onChange={e => { setLoginEmail(e.target.value); setLoginError('') }}
                onKeyDown={e => e.key === 'Enter' && handleCheckEmail()}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 16, fontFamily: 'inherit', background: '#f9f8f6', color: '#1a1916', boxSizing: 'border-box', marginBottom: 12 }}
              />
              {loginError && <div style={{ fontSize: 13, color: '#dc2626', marginBottom: 12, textAlign: 'left' }}>{loginError}</div>}
              <button
                onClick={handleCheckEmail}
                disabled={loginLoading || !loginEmail.trim()}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: loginLoading ? 'wait' : 'pointer', opacity: !loginEmail.trim() ? 0.5 : 1 }}
              >
                {loginLoading ? tc('pos_sell.checking') : tc('pos_sell.continue_btn')}
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 4, textAlign: 'left' }}>
                {tc('pos_sell.welcome_back')}{loginName ? `, ${loginName}` : ''}
              </div>
              <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 16, textAlign: 'left' }}>{tc('pos_sell.enter_pin')}</div>
              <input
                type="password"
                autoFocus
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={loginPin}
                onChange={e => { setLoginPin(e.target.value.replace(/\D/g, '')); setLoginError('') }}
                onKeyDown={e => e.key === 'Enter' && handleVerifyPin()}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 28, fontFamily: 'inherit', background: '#f9f8f6', color: '#1a1916', boxSizing: 'border-box', marginBottom: 12, textAlign: 'center', letterSpacing: 8 }}
              />
              {loginError && <div style={{ fontSize: 13, color: '#dc2626', marginBottom: 12, textAlign: 'left' }}>{loginError}</div>}
              <button
                onClick={handleVerifyPin}
                disabled={loginLoading || !loginPin}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: loginLoading ? 'wait' : 'pointer', opacity: !loginPin ? 0.5 : 1, marginBottom: 10 }}
              >
                {loginLoading ? tc('pos_sell.verifying') : tc('pos_sell.signin_btn')}
              </button>
              <button
                onClick={() => { setLoginStep('email'); setLoginPin(''); setLoginError('') }}
                style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'transparent', border: '1px solid #e5e2dc', fontSize: 13, cursor: 'pointer', color: '#6b6760' }}
              >
                {tc('pos_sell.different_email')}
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: '#a39e97' }}>
          {tc('pos_sell.no_account_ask_manager')}
        </div>
      </div>
    </div>
  )

  // ── HOME SCREEN ───────────────────────────────────────────
  if (screen === 'home') return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f8f6' }}>
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1916' }}>{tc('pos_sell.askbiz_pos')}</div>
          <div style={{ fontSize: 12, color: '#6b6760' }}>{staff?.name}</div>
        </div>
        <button onClick={() => { localStorage.removeItem('pos_staff'); setStaff(null); setScreen('login'); setLoginStep('email'); setLoginEmail(''); setLoginPin('') }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#6b6760' }}>{tc('pos_sell.sign_out')}</button>
      </div>

      {/* Today's stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 20px' }}>
        <div style={{ padding: '16px', borderRadius: 14, background: '#fff', border: '1px solid #e5e2dc' }}>
          <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 4 }}>{tc('pos_sell.todays_revenue')}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1916' }}>{sym}{todayRevenue.toFixed(2)}</div>
        </div>
        <div style={{ padding: '16px', borderRadius: 14, background: '#fff', border: '1px solid #e5e2dc' }}>
          <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 4 }}>{tc('pos_sell.sales')}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1916' }}>{todaySales}</div>
        </div>
      </div>

      {/* Cart summary if items in cart */}
      {cart.length > 0 && (
        <div onClick={() => setScreen('cart')} style={{ margin: '0 20px 12px', padding: '14px 16px', borderRadius: 14, background: `rgba(208,138,89,.08)`, border: `1px solid rgba(208,138,89,.25)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: ACC }}>{cart.length} {tc('pos_sell.items_in_cart').replace('{n}', String(cart.length)).replace('{s}', cart.length > 1 ? 's' : '')}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: ACC }}>{sym}{cartTotal.toFixed(2)}</div>
        </div>
      )}

      {/* Main action */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: 16 }}>
        <button
          onClick={() => { setScreen('scan'); startCamera() }}
          style={{ width: '100%', maxWidth: 300, padding: '24px', borderRadius: 20, background: ACC, color: '#fff', fontSize: 20, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          {tc('pos_sell.new_sale')}
        </button>

        {cart.length > 0 && (
          <button
            onClick={() => setScreen('cart')}
            style={{ width: '100%', maxWidth: 300, padding: '16px', borderRadius: 16, background: '#fff', color: ACC, fontSize: 16, fontWeight: 700, border: `2px solid ${ACC}`, cursor: 'pointer' }}
          >
            {tc('pos_sell.cart')} ({cart.length}) · {sym}{cartTotal.toFixed(2)}
          </button>
        )}
      </div>
    </div>
  )

  // ── SCAN SCREEN ───────────────────────────────────────────
  if (screen === 'scan') return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { stopCamera(); setScreen('home') }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{tc('pos_sell.scan_product')}</div>
      </div>

      {scanning ? (
        <div style={{ flex: 1, position: 'relative' }}>
          <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: 240, height: 160, border: '2px solid rgba(255,255,255,.7)', borderRadius: 16 }} />
          </div>
          <div style={{ padding: '24px 20px', display: 'flex', gap: 12 }}>
            <button onClick={captureAndScan} style={{ flex: 1, padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              {tc('pos_sell.capture')}
            </button>
          </div>
        </div>
      ) : scanLoading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '24px' }}>
          {scanPreview && <img src={scanPreview} alt="captured" style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 12, border: '2px solid ' + ACC }} />}
          <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{tc('pos_sell.identifying_product')}</div>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,.2)', borderTopColor: ACC, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : scanResult ? (
        <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {scanPreview && <img src={scanPreview} alt="captured" style={{ width: '100%', maxWidth: 200, height: 120, objectFit: 'cover', borderRadius: 12, margin: '0 auto', display: 'block' }} />}
          <div style={{ padding: '24px', borderRadius: 16, background: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 8 }}>{tc('pos_sell.scanned_item')}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1916', marginBottom: 8 }}>{scanResult.name}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: ACC }}>{sym}{scanResult.price.toFixed(2)}</div>
          </div>
          <button onClick={confirmScan} style={{ padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            {tc('pos_sell.add_to_cart')}
          </button>
          <button onClick={() => { setScanResult(null); setScanPreview(null); startCamera() }} style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            {tc('pos_sell.scan_again')}
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '24px' }}>
          {scanError && <div style={{ fontSize: 14, color: '#fca5a5', textAlign: 'center' }}>{scanError}</div>}
          <button onClick={startCamera} style={{ padding: '16px 32px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{tc('pos_sell.scan_product')}</button>
        </div>
      )}
    </div>
  )

  // ── CART SCREEN ───────────────────────────────────────────
  if (screen === 'cart') return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('home')} style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #e5e2dc', color: '#1a1916', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1916' }}>{tc('pos_sell.cart')}</div>
      </div>

      <div style={{ flex: 1, padding: '8px 20px', overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6760', fontSize: 14 }}>{tc('pos_sell.cart_empty')}</div>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 14, marginBottom: 10, border: '1px solid #e5e2dc' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916' }}>{item.name}</div>
                <div style={{ fontSize: 13, color: '#6b6760' }}>{sym}{item.unit_price.toFixed(2)} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => updateQty(idx, -1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e2dc', background: '#f9f8f6', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                  <span style={{ fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(idx, 1)}  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e2dc', background: '#f9f8f6', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1916', minWidth: 60, textAlign: 'right' }}>{sym}{(item.qty * item.unit_price).toFixed(2)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '16px 20px 32px', background: '#fff', borderTop: '1px solid #e5e2dc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#6b6760' }}>{tc('pos_sell.total')}</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#1a1916' }}>{sym}{cartTotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setScreen('scan'); startCamera() }} style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#f9f8f6', border: '1px solid #e5e2dc', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#1a1916' }}>
            {tc('pos_sell.add_item')}
          </button>
          <button onClick={() => setScreen('checkout')} disabled={cart.length === 0} style={{ flex: 2, padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            {tc('pos_sell.checkout')}
          </button>
        </div>
        {cart.length > 0 && (
          <button onClick={() => { setCart([]); setScreen('home') }} style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(220,38,38,.3)', color: '#dc2626', fontSize: 14, cursor: 'pointer' }}>
            {tc('pos_sell.cancel_sale')}
          </button>
        )}
      </div>
    </div>
  )

  // ── CHECKOUT SCREEN ───────────────────────────────────────
  if (screen === 'checkout') return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('cart')} style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #e5e2dc', color: '#1a1916', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1916' }}>{tc('pos_sell.checkout')}</div>
      </div>

      <div style={{ flex: 1, padding: '8px 20px' }}>
        <div style={{ padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 4 }}>{tc('pos_sell.total_to_collect')}</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#1a1916' }}>{sym}{cartTotal.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: '#6b6760', marginTop: 4 }}>{cart.length} {cart.length > 1 ? 'items' : 'item'}</div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 10 }}>{tc('pos_sell.payment_method')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {([['cash', `💵 ${tc('pos_sell.cash')}`], ['card', `💳 ${tc('pos_sell.card')}`], ['mobile', `📱 ${tc('pos_sell.mobile_wallet')}`]] as const).map(([type, label]) => (
              <button key={type} onClick={() => setPaymentType(type)} style={{ padding: '13px 8px', borderRadius: 12, border: `2px solid ${paymentType === type ? ACC : '#e5e2dc'}`, background: paymentType === type ? 'rgba(208,138,89,.08)' : '#fff', color: paymentType === type ? ACC : '#6b6760', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Card payment prompt — auto-renders after transaction created */}
        {paymentType === 'card' && lastTxId && (
          <PosCardPayment
            transactionId={lastTxId}
            amount={cartTotal}
            currencySymbol={sym}
            ownerId={staff!.owner_id}
            staffId={staff!.id}
            onPaymentComplete={() => { setTodaySales(s => s + 1); setTodayRevenue(r => r + cartTotal); setScreen('receipt') }}
            onPaymentFailed={(err) => setPaymentError(err)}
          />
        )}

        {/* Mobile / M-Pesa prompt */}
        {paymentType === 'mobile' && lastTxId && (
          <PosMobilePayment
            transactionId={lastTxId}
            amount={cartTotal}
            currencySymbol={sym}
            ownerId={staff!.owner_id}
            staffId={staff!.id}
            customerPhone={customerPhone}
            onPaymentComplete={() => { setTodaySales(s => s + 1); setTodayRevenue(r => r + cartTotal); setScreen('receipt') }}
            onPaymentFailed={(err) => setPaymentError(err)}
          />
        )}

        <div style={{ marginBottom: 20, marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>{tc('pos_sell.customer_phone_label')}</div>
          <div style={{ fontSize: 12, color: '#6b6760', marginBottom: 8 }}>{tc('pos_sell.whatsapp_receipt_note')}</div>
          <input
            type="tel"
            placeholder={tc('pos_sell.customer_phone_placeholder')}
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ padding: '16px 20px 40px', background: '#fff', borderTop: '1px solid #e5e2dc' }}>
        {paymentError && (
          <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', fontSize: 13, color: '#dc2626' }}>
            ⚠ {paymentError}
          </div>
        )}
        {!lastTxId && (
          <button
            onClick={handleCheckout}
            disabled={processing}
            style={{ width: '100%', padding: '18px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 18, fontWeight: 800, border: 'none', cursor: processing ? 'wait' : 'pointer' }}
          >
            {processing ? tc('pos_sell.processing') : `${tc('pos_sell.checkout')} · ${sym}${cartTotal.toFixed(2)}`}
          </button>
        )}
      </div>
    </div>
  )

  // ── RECEIPT SCREEN ────────────────────────────────────────
  if (screen === 'receipt') return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(22,163,74,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1916', marginBottom: 4 }}>{tc('pos_sell.sale_complete')}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a', marginBottom: 24 }}>{sym}{cartTotal.toFixed(2)}</div>

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc', padding: '16px', marginBottom: 20, textAlign: 'left' }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < cart.length - 1 ? '1px solid #f0ede8' : 'none', fontSize: 14 }}>
              <span style={{ color: '#1a1916' }}>{item.name} x{item.qty}</span>
              <span style={{ fontWeight: 600, color: '#1a1916' }}>{sym}{(item.qty * item.unit_price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {!receiptSent ? (
          <div style={{ marginBottom: 20 }}>
            {!customerPhone ? (
              <div>
                <input
                  type="tel"
                  placeholder={tc('pos_sell.customer_phone_placeholder')}
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box', marginBottom: 8 }}
                />
                <button onClick={handleSendReceipt} disabled={!customerPhone || sendingReceipt} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {sendingReceipt ? tc('pos_sell.sending') : tc('pos_sell.send_whatsapp_receipt')}
                </button>
              </div>
            ) : (
              <button onClick={handleSendReceipt} disabled={sendingReceipt} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                {sendingReceipt ? tc('pos_sell.sending') : tc('pos_sell.send_to_phone').replace('{phone}', customerPhone)}
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.3)', color: '#16a34a', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
            {tc('pos_sell.receipt_sent')}
          </div>
        )}

        <button onClick={resetSale} style={{ width: '100%', padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          {tc('pos_sell.new_sale_btn')}
        </button>
      </div>
    </div>
  )

  return null
}
