'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

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
}

type Screen = 'home' | 'scan' | 'cart' | 'checkout' | 'receipt'

export default function SellPage() {
  const router  = useRouter()
  const [staff, setStaff]     = useState<StaffSession | null>(null)
  const [screen, setScreen]   = useState<Screen>('home')
  const [cart, setCart]       = useState<CartItem[]>([])
  const [todaySales, setTodaySales]   = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [currencySymbol, setCurrencySymbol] = useState('£')

  // Scan state
  const videoRef    = useRef<HTMLVideoElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning]   = useState(false)
  const [scanResult, setScanResult] = useState<{ name: string; price: number } | null>(null)
  const [scanError, setScanError]   = useState('')

  // Checkout state
  const [paymentType, setPaymentType]   = useState<'cash' | 'card'>('cash')
  const [customerPhone, setCustomerPhone] = useState('')
  const [processing, setProcessing]     = useState(false)
  const [lastTxId, setLastTxId]         = useState('')
  const [sendingReceipt, setSendingReceipt] = useState(false)
  const [receiptSent, setReceiptSent]   = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    if (s.role !== 'cashier') { router.push('/inventory'); return }
    setStaff(s)
    loadTodayStats(s.owner_id, s.id)
    loadCurrency(s.owner_id)
  }, [])

  const loadCurrency = async (_owner_id: string) => {
    setCurrencySymbol('£')
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
    if (!canvasRef.current || !videoRef.current) return
    const canvas = canvasRef.current
    const video  = videoRef.current
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)

    // Convert to base64 and send to AI
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    stopCamera()

    try {
      const res = await fetch(`${API}/api/pos/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      const data = await res.json()
      if (data.name && data.price) {
        setScanResult({ name: data.name, price: data.price })
      } else {
        setScanError('Could not read price. Try manual entry.')
      }
    } catch {
      setScanError('Scan failed. Try again or add manually.')
    }
  }

  const confirmScan = () => {
    if (!scanResult) return
    addToCart({ name: scanResult.name, unit_price: scanResult.price, cost_price: 0, qty: 1 })
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
    try {
      const res = await fetch(`${API}/api/pos/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id },
        body: JSON.stringify({
          items:          cart,
          payment_type:   paymentType,
          cashier_id:     staff.id,
          customer_phone: customerPhone || null,
        }),
      })
      const data = await res.json()
      setProcessing(false)
      if (data.transaction_id) {
        setLastTxId(data.transaction_id)
        setTodaySales(s => s + 1)
        setTodayRevenue(r => r + cartTotal)
        setScreen('receipt')
      }
    } catch {
      setProcessing(false)
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

  // ── HOME SCREEN ───────────────────────────────────────────
  if (screen === 'home') return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f8f6' }}>
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1916' }}>AskBiz POS</div>
          <div style={{ fontSize: 12, color: '#6b6760' }}>{staff?.name}</div>
        </div>
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e2dc', background: 'transparent', fontSize: 12, cursor: 'pointer', color: '#6b6760' }}>Sign out</button>
      </div>

      {/* Today's stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 20px' }}>
        <div style={{ padding: '16px', borderRadius: 14, background: '#fff', border: '1px solid #e5e2dc' }}>
          <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 4 }}>Today's revenue</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1916' }}>{currencySymbol}{todayRevenue.toFixed(2)}</div>
        </div>
        <div style={{ padding: '16px', borderRadius: 14, background: '#fff', border: '1px solid #e5e2dc' }}>
          <div style={{ fontSize: 11, color: '#6b6760', marginBottom: 4 }}>Sales</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1916' }}>{todaySales}</div>
        </div>
      </div>

      {/* Cart summary if items in cart */}
      {cart.length > 0 && (
        <div onClick={() => setScreen('cart')} style={{ margin: '0 20px 12px', padding: '14px 16px', borderRadius: 14, background: `rgba(208,138,89,.08)`, border: `1px solid rgba(208,138,89,.25)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: ACC }}>{cart.length} item{cart.length > 1 ? 's' : ''} in cart</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: ACC }}>{currencySymbol}{cartTotal.toFixed(2)}</div>
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
          New Sale
        </button>

        {cart.length > 0 && (
          <button
            onClick={() => setScreen('cart')}
            style={{ width: '100%', maxWidth: 300, padding: '16px', borderRadius: 16, background: '#fff', color: ACC, fontSize: 16, fontWeight: 700, border: `2px solid ${ACC}`, cursor: 'pointer' }}
          >
            View Cart ({cart.length}) · {currencySymbol}{cartTotal.toFixed(2)}
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
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Scan price tag</div>
      </div>

      {scanning ? (
        <div style={{ flex: 1, position: 'relative' }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {/* Viewfinder */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: 240, height: 160, border: '2px solid rgba(255,255,255,.7)', borderRadius: 16 }} />
          </div>
          <div style={{ padding: '24px 20px', display: 'flex', gap: 12 }}>
            <button onClick={captureAndScan} style={{ flex: 1, padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              📸 Capture
            </button>
          </div>
        </div>
      ) : scanResult ? (
        <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ padding: '24px', borderRadius: 16, background: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 8 }}>Scanned item</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1916', marginBottom: 8 }}>{scanResult.name}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: ACC }}>£{scanResult.price.toFixed(2)}</div>
          </div>
          {scanError && <div style={{ fontSize: 13, color: '#dc2626', textAlign: 'center' }}>{scanError}</div>}
          <button onClick={confirmScan} style={{ padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            ✓ Add to cart
          </button>
          <button onClick={() => { setScanResult(null); startCamera() }} style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Scan again
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '24px' }}>
          {scanError && <div style={{ fontSize: 14, color: '#fca5a5', textAlign: 'center' }}>{scanError}</div>}
          <button onClick={startCamera} style={{ padding: '16px 32px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Start camera</button>
        </div>
      )}
    </div>
  )

  // ── CART SCREEN ───────────────────────────────────────────
  if (screen === 'cart') return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('home')} style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #e5e2dc', color: '#1a1916', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1916' }}>Cart</div>
      </div>

      <div style={{ flex: 1, padding: '8px 20px', overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6760', fontSize: 14 }}>Cart is empty</div>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 14, marginBottom: 10, border: '1px solid #e5e2dc' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916' }}>{item.name}</div>
                <div style={{ fontSize: 13, color: '#6b6760' }}>£{item.unit_price.toFixed(2)} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => updateQty(idx, -1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e2dc', background: '#f9f8f6', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                  <span style={{ fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(idx, 1)}  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e2dc', background: '#f9f8f6', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1916', minWidth: 60, textAlign: 'right' }}>£{(item.qty * item.unit_price).toFixed(2)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '16px 20px 32px', background: '#fff', borderTop: '1px solid #e5e2dc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#6b6760' }}>Total</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#1a1916' }}>£{cartTotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setScreen('scan'); startCamera() }} style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#f9f8f6', border: '1px solid #e5e2dc', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#1a1916' }}>
            + Add item
          </button>
          <button onClick={() => setScreen('checkout')} disabled={cart.length === 0} style={{ flex: 2, padding: '14px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Checkout →
          </button>
        </div>
        {cart.length > 0 && (
          <button onClick={() => { setCart([]); setScreen('home') }} style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(220,38,38,.3)', color: '#dc2626', fontSize: 14, cursor: 'pointer' }}>
            Cancel sale
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
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1916' }}>Checkout</div>
      </div>

      <div style={{ flex: 1, padding: '8px 20px' }}>
        <div style={{ padding: '20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 4 }}>Total to collect</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#1a1916' }}>£{cartTotal.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: '#6b6760', marginTop: 4 }}>{cart.length} item{cart.length > 1 ? 's' : ''}</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 10 }}>Payment method</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(['cash', 'card'] as const).map(type => (
              <button key={type} onClick={() => setPaymentType(type)} style={{ padding: '16px', borderRadius: 14, border: `2px solid ${paymentType === type ? ACC : '#e5e2dc'}`, background: paymentType === type ? `rgba(208,138,89,.08)` : '#fff', color: paymentType === type ? ACC : '#6b6760', fontSize: 16, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>
                {type === 'cash' ? '💵 Cash' : '💳 Card'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>Customer phone (optional)</div>
          <div style={{ fontSize: 12, color: '#6b6760', marginBottom: 8 }}>To send a WhatsApp receipt</div>
          <input
            type="tel"
            placeholder="+447911123456"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 15, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ padding: '16px 20px 40px', background: '#fff', borderTop: '1px solid #e5e2dc' }}>
        <button
          onClick={handleCheckout}
          disabled={processing}
          style={{ width: '100%', padding: '18px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 18, fontWeight: 800, border: 'none', cursor: processing ? 'wait' : 'pointer' }}
        >
          {processing ? 'Processing...' : `Complete sale · £${cartTotal.toFixed(2)}`}
        </button>
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
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1916', marginBottom: 4 }}>Sale complete!</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a', marginBottom: 24 }}>£{cartTotal.toFixed(2)}</div>

        {/* Items */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc', padding: '16px', marginBottom: 20, textAlign: 'left' }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < cart.length - 1 ? '1px solid #f0ede8' : 'none', fontSize: 14 }}>
              <span style={{ color: '#1a1916' }}>{item.name} ×{item.qty}</span>
              <span style={{ fontWeight: 600, color: '#1a1916' }}>£{(item.qty * item.unit_price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* WhatsApp receipt */}
        {!receiptSent ? (
          <div style={{ marginBottom: 20 }}>
            {!customerPhone ? (
              <div>
                <input
                  type="tel"
                  placeholder="Customer phone for WhatsApp receipt"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box', marginBottom: 8 }}
                />
                <button onClick={handleSendReceipt} disabled={!customerPhone || sendingReceipt} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {sendingReceipt ? 'Sending...' : '📲 Send WhatsApp receipt'}
                </button>
              </div>
            ) : (
              <button onClick={handleSendReceipt} disabled={sendingReceipt} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                {sendingReceipt ? 'Sending...' : `📲 Send to ${customerPhone}`}
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.3)', color: '#16a34a', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
            ✓ Receipt sent on WhatsApp
          </div>
        )}

        <button onClick={resetSale} style={{ width: '100%', padding: '16px', borderRadius: 14, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          New sale →
        </button>
      </div>
    </div>
  )

  return null
}
