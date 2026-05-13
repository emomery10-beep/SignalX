'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLAN_HIGHLIGHTS, PLAN_DESCRIPTIONS, getPlanBadge } from '@/lib/plans'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'


// ── Feature comparison table data ─────────────────────────────
const FEATURES_TABLE = [
  { category: 'Core',
    rows: [
      { label: 'Questions per month',       free: '10',         growth: 'Unlimited',  business: 'Unlimited'  },
      { label: 'File uploads',              free: '1/month',    growth: 'Unlimited',  business: 'Unlimited'  },
      { label: 'Business Pulse score',      free: '✓',          growth: '✓',          business: '✓'          },
      { label: 'Connect data sources',      free: '✓',          growth: '✓',          business: '✓'          },
      { label: 'API access',               free: '✓',          growth: '✓',          business: '✓'          },
    ]
  },
  { category: 'Intelligence',
    rows: [
      { label: 'Daily Brief',               free: '—',          growth: '✓',          business: '✓'          },
      { label: 'Anomaly alerts',            free: '—',          growth: 'Unlimited',  business: 'Unlimited'  },
      { label: 'Market intelligence',       free: '—',          growth: '✓',          business: '✓'          },
      { label: 'Churn intelligence',        free: '—',          growth: 'Monthly',    business: 'Real-time'  },
      { label: 'Decision Memory',           free: '—',          growth: '—',          business: '✓'          },
      { label: 'Competitor Watch',          free: '—',          growth: '—',          business: '✓'          },
      { label: 'CFO Mode',                  free: '—',          growth: '—',          business: '✓'          },
    ]
  },
  { category: 'Point of Sale',
    rows: [
      { label: 'FX Risk Modeller',          free: 'Manual',     growth: 'Pre-filled', business: 'Pre-filled' },
      { label: 'Landed Cost Calculator',    free: 'Manual',     growth: 'Pre-filled', business: 'Pre-filled' },
      { label: 'Supplier Scorecard',        free: 'View',       growth: 'Full',       business: 'Full'       },
      { label: 'Export Market Scoring',     free: '20 markets', growth: '+ Products', business: '+ Products' },
      { label: 'Social Commerce',           free: '—',          growth: '✓',          business: '✓'          },
      { label: 'Auto pre-fill from data',   free: '—',          growth: '✓',          business: '✓'          },
    ]
  },
  { category: 'Shipments',
    rows: [
      { label: 'Shipment tracking',         free: '1',          growth: '5',          business: 'Unlimited'  },
      { label: 'Financial intelligence',    free: '—',          growth: 'Basic',      business: 'Full'       },
      { label: 'Customs hold alerts',       free: '—',          growth: '—',          business: '✓'          },
      { label: 'Working capital tracking',  free: '—',          growth: '—',          business: '✓'          },
    ]
  },
  { category: 'Team',
    rows: [
      { label: 'Team seats',               free: '1',          growth: '1',          business: 'Up to 5'    },
      { label: 'Role-based access',        free: '—',          growth: '—',          business: '✓'          },
      { label: 'Priority support',         free: '—',          growth: '—',          business: '✓'          },
    ]
  },
]

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [currentPlan,  setCurrentPlan]  = useState('free')
  const [usage,        setUsage]        = useState<any>(null)
  const [limits,       setLimits]       = useState<any>(null)
  const [loading,      setLoading]      = useState('')
  const [pageLoading,  setPageLoading]  = useState(true)
  const [showTable,    setShowTable]    = useState(false)
  const [annual,       setAnnual]       = useState(false)
  // POS seats
  const [posEnabled,   setPosEnabled]   = useState(false)
  const [posSeatCount, setPosSeatCount] = useState(0)
  const [posSeats,     setPosSeats]     = useState(1)
  const [posLoading,   setPosLoading]   = useState(false)
  const [posSuccess,   setPosSuccess]   = useState(false)
  // M-Pesa
  const [isKenyan,       setIsKenyan]       = useState(false)
  const [mpesaPhone,     setMpesaPhone]     = useState('')
  const [mpesaTarget,    setMpesaTarget]    = useState<string|null>(null)
  const [mpesaPolling,   setMpesaPolling]   = useState(false)
  const [mpesaStatus,    setMpesaStatus]    = useState<'idle'|'sent'|'success'|'failed'|'cancelled'>('idle')
  const [mpesaCheckoutId, setMpesaCheckoutId] = useState<string|null>(null)

  // Prices are always shown in GBP to match what Stripe actually charges.
  // Stripe converts to local currency at checkout automatically.
  const sym      = '£'
  const currency = 'GBP'

  useEffect(() => {
    const init = async () => {
      try {
        // Detect Kenya from timezone
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
          if (tz === 'Africa/Nairobi') setIsKenyan(true)
        } catch {}

        const res = await fetch('/api/billing')
        if (res.ok) {
          const data = await res.json()
          setCurrentPlan(data.subscription?.plan_id || 'free')
          setUsage(data.usage)
          setLimits(data.limits)
          if (data.pos) {
            setPosEnabled(data.pos.enabled)
            setPosSeatCount(data.pos.seatCount)
            if (data.pos.seatCount > 0) setPosSeats(data.pos.seatCount)
          }
        }
        // Also check geo API for Kenya
        try {
          const geoRes = await fetch('/api/geo')
          if (geoRes.ok) {
            const geo = await geoRes.json()
            if (geo.countryCode === 'KE' || geo.currency === 'KES') setIsKenyan(true)
          }
        } catch {}
        // Check for pos_success in URL
        if (window.location.search.includes('pos_success=true')) {
          setPosSuccess(true)
          setTimeout(() => setPosSuccess(false), 6000)
        }
      } catch {}
      finally { setPageLoading(false) }
    }
    init()
  }, [])

  // ── Price calculation ──────────────────────────────────────
  // Fixed GBP prices — matches what Stripe actually charges.
  // Stripe converts to the customer's local currency at checkout.
  const GBP_PRICES: Record<string, number> = { growth: 19, business: 39 }

  const getPrice = (planId: string) => {
    const base = GBP_PRICES[planId]
    if (!base) return null
    const fmt = (n: number) => `£${n}`
    return {
      monthly:       fmt(base),
      annualMonthly: fmt(Math.round(base * 10 / 12)),
      annualTotal:   fmt(base * 10),
      raw:           base,
    }
  }

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return
    setLoading(planId)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout', plan: planId, currency, annual }),
      })
      // Try to parse JSON even on non-2xx — surface the API's error message
      // rather than a generic "something went wrong" that hides the cause.
      const text = await res.text()
      let data: any = {}
      try { data = JSON.parse(text) } catch {}
      if (data.url) {
        window.location.href = data.url
        return
      }
      const msg = data.error || `Checkout failed (${res.status}). ${text.slice(0, 200)}`
      alert(msg)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally { setLoading('') }
  }

  const handlePosCheckout = async () => {
    setPosLoading(true)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout_pos_seat', seats: posSeats, currency, annual: false }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Something went wrong')
    } catch { alert('Something went wrong. Please try again.') }
    finally { setPosLoading(false) }
  }

  const handleManagePos = async () => {
    setPosLoading(true)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'portal' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally { setPosLoading(false) }
  }

  const handleMpesaPay = async (planOrSeats: string, seats?: number) => {
    if (!mpesaPhone) { alert('Enter your M-Pesa phone number'); return }
    setMpesaTarget(planOrSeats)
    setMpesaStatus('idle')
    try {
      const res = await fetch('/api/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stk_push',
          phone: mpesaPhone,
          plan: seats ? undefined : planOrSeats,
          seats: seats ? String(seats) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'M-Pesa request failed'); setMpesaTarget(null); return }
      setMpesaCheckoutId(data.checkoutRequestId)
      setMpesaStatus('sent')
      // Poll for completion
      setMpesaPolling(true)
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        if (attempts > 30) { clearInterval(poll); setMpesaPolling(false); setMpesaStatus('failed'); return }
        try {
          const qRes = await fetch('/api/mpesa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'query', checkoutRequestId: data.checkoutRequestId }),
          })
          const q = await qRes.json()
          if (q.completed) {
            clearInterval(poll); setMpesaPolling(false); setMpesaStatus('success')
            setTimeout(() => window.location.reload(), 2000)
          } else if (q.cancelled) {
            clearInterval(poll); setMpesaPolling(false); setMpesaStatus('cancelled')
          }
        } catch {}
      }, 3000)
    } catch {
      alert('Connection error. Please try again.')
      setMpesaTarget(null)
    }
  }

  const currentBadge = getPlanBadge(currentPlan)

  const growthPrice = getPrice('growth')
  const bizPrice    = getPrice('business')

  const PLANS = [
    {
      id: 'free',
      name: 'Free',
      colour: '#6b6760',
      popular: false,
      displayPrice: `${sym}0`,
      annualMonthly: null,
      annualTotal: null,
      desc: PLAN_DESCRIPTIONS.free,
      highlights: PLAN_HIGHLIGHTS.free,
    },
    {
      id: 'growth',
      name: 'Growth',
      colour: '#6366F1',
      popular: true,
      displayPrice: growthPrice?.monthly || `${sym}19`,
      annualMonthly: growthPrice?.annualMonthly || null,
      annualTotal: growthPrice?.annualTotal || null,
      desc: PLAN_DESCRIPTIONS.growth,
      highlights: PLAN_HIGHLIGHTS.growth,
    },
    {
      id: 'business',
      name: 'Business',
      colour: '#7c3aed',
      popular: false,
      displayPrice: bizPrice?.monthly || `${sym}49`,
      annualMonthly: bizPrice?.annualMonthly || null,
      annualTotal: bizPrice?.annualTotal || null,
      desc: PLAN_DESCRIPTIONS.business,
      highlights: PLAN_HIGHLIGHTS.business,
    },
  ]

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-shell-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600 }}>Plans & Billing</div>
            <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 7 }}>
              Current plan:
              <span style={{ fontSize: 11, fontWeight: 700, color: currentBadge.colour, background: currentBadge.bg, borderRadius: 9999, padding: '2px 9px' }}>
                {currentBadge.label}
              </span>
              {usage && limits?.questions > 0 && (
                <span style={{ fontSize: 12, color: 'var(--tx3)' }}>
                  · {usage.questions}/{limits.questions} questions used
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell-body" style={{ maxWidth: 860 }}>


        {/* Annual toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: annual ? 'var(--tx3)' : 'var(--tx)', fontWeight: annual ? 400 : 600 }}>Monthly</span>
          <button
            onClick={() => setAnnual(v => !v)}
            style={{ width: 44, height: 24, borderRadius: 12, background: annual ? ACC : 'var(--b2)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms' }}
          >
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: annual ? 23 : 3, transition: 'left 200ms', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }}/>
          </button>
          <span style={{ fontSize: 13, color: annual ? 'var(--tx)' : 'var(--tx3)', fontWeight: annual ? 600 : 400 }}>
            Annual
            <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,.1)', borderRadius: 9999, padding: '1px 7px' }}>2 months free</span>
          </span>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
          {PLANS.map(plan => {
            const isCurrent = currentPlan === plan.id
            // Show annual per-month price when toggle is on, otherwise monthly price
            const shownPrice = annual && plan.annualMonthly ? plan.annualMonthly : plan.displayPrice
            return (
              <div key={plan.id} style={{ borderRadius: 18, border: plan.popular ? `2px solid ${plan.colour}` : `1px solid ${B}`, background: plan.popular ? `rgba(99,102,241,.02)` : SF, padding: '22px 20px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: 20, fontSize: 11, fontWeight: 700, color: '#fff', background: plan.colour, borderRadius: 9999, padding: '3px 12px', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                    Most popular
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-sora)', fontSize: 17, fontWeight: 700, color: plan.colour }}>{plan.name}</span>
                    {isCurrent && <span style={{ fontSize: 10, fontWeight: 700, color: plan.colour, background: plan.colour + '18', borderRadius: 9999, padding: '2px 8px' }}>Current</span>}
                  </div>

                  {/* Price display */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: 'var(--font-sora)', fontSize: 30, fontWeight: 800, color: 'var(--tx)', letterSpacing: '-.03em' }}>
                      {shownPrice}
                    </span>
                    {plan.id !== 'free' && (
                      <span style={{ fontSize: 13, color: 'var(--tx3)' }}>
                        /month{annual ? ' · billed annually' : ''}
                      </span>
                    )}
                  </div>

                  {/* Annual total note */}
                  {annual && plan.annualTotal && (
                    <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4, fontWeight: 500 }}>
                      {plan.annualTotal} billed once a year · 2 months free
                    </div>
                  )}

                  <p style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 8, lineHeight: 1.55 }}>{plan.desc}</p>
                </div>

                <div style={{ flex: 1, marginBottom: 18 }}>
                  {plan.highlights.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--tx2)', marginBottom: 7 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.colour} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || plan.id === 'free' || loading === plan.id}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 10,
                    border: isCurrent || plan.id === 'free' ? `1px solid ${B}` : 'none',
                    background: isCurrent || plan.id === 'free' ? 'transparent' : plan.colour,
                    color: isCurrent || plan.id === 'free' ? 'var(--tx3)' : '#fff',
                    fontSize: 14, fontWeight: 600, cursor: isCurrent || plan.id === 'free' ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: isCurrent || plan.id === 'free' ? 'none' : `0 2px 12px ${plan.colour}35`,
                  }}
                >
                  {loading === plan.id ? 'Loading…' : isCurrent ? 'Current plan' : plan.id === 'free' ? 'Free forever' : `Upgrade to ${plan.name} →`}
                </button>
              </div>
            )
          })}
        </div>

        {/* M-Pesa payment option for Kenyan users */}
        {isKenyan && (
          <div style={{ borderRadius: 18, border: '1px solid rgba(76,175,80,.3)', background: 'rgba(76,175,80,.03)', padding: '22px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 1v4M12 19v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M1 12h4M19 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: '#4CAF50' }}>Pay with M-Pesa</span>
                <div style={{ fontSize: 12, color: TX3 }}>Lipa Na M-Pesa — pay directly from your phone</div>
              </div>
            </div>

            {mpesaStatus === 'success' ? (
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Payment confirmed! Activating your plan…</span>
              </div>
            ) : mpesaStatus === 'cancelled' ? (
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#dc2626' }}>Payment was cancelled. Try again when ready.</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                  <input
                    type="tel"
                    placeholder="e.g. 0712345678"
                    value={mpesaPhone}
                    onChange={e => setMpesaPhone(e.target.value)}
                    style={{ flex: '1 1 180px', padding: '10px 14px', borderRadius: 10, border: `1px solid rgba(76,175,80,.3)`, background: SF, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: TX }}
                  />
                </div>

                {mpesaStatus === 'sent' && mpesaPolling && (
                  <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(76,175,80,.06)', border: '1px solid rgba(76,175,80,.15)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 16, height: 16, border: '2px solid #4CAF50', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: 13, color: '#4CAF50', fontWeight: 500 }}>Check your phone — enter your M-Pesa PIN to confirm</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {currentPlan !== 'growth' && (
                    <button
                      onClick={() => handleMpesaPay('growth')}
                      disabled={mpesaPolling}
                      style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#4CAF50', color: '#fff', fontSize: 13, fontWeight: 600, cursor: mpesaPolling ? 'default' : 'pointer', fontFamily: 'inherit', opacity: mpesaPolling ? .6 : 1 }}
                    >
                      {mpesaPolling && mpesaTarget === 'growth' ? 'Waiting…' : 'Growth — KES 2,400/mo'}
                    </button>
                  )}
                  {currentPlan !== 'business' && (
                    <button
                      onClick={() => handleMpesaPay('business')}
                      disabled={mpesaPolling}
                      style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#388E3C', color: '#fff', fontSize: 13, fontWeight: 600, cursor: mpesaPolling ? 'default' : 'pointer', fontFamily: 'inherit', opacity: mpesaPolling ? .6 : 1 }}
                    >
                      {mpesaPolling && mpesaTarget === 'business' ? 'Waiting…' : 'Business — KES 4,900/mo'}
                    </button>
                  )}
                  {!posEnabled && (
                    <button
                      onClick={() => handleMpesaPay('pos_seats', posSeats)}
                      disabled={mpesaPolling}
                      style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(76,175,80,.4)', background: 'transparent', color: '#4CAF50', fontSize: 13, fontWeight: 600, cursor: mpesaPolling ? 'default' : 'pointer', fontFamily: 'inherit', opacity: mpesaPolling ? .6 : 1 }}
                    >
                      {mpesaPolling && mpesaTarget === 'pos_seats' ? 'Waiting…' : `POS ${posSeats} seat${posSeats !== 1 ? 's' : ''} — KES ${(posSeats * 500).toLocaleString()}/mo`}
                    </button>
                  )}
                </div>

                <p style={{ fontSize: 11, color: TX3, marginTop: 12, lineHeight: 1.5 }}>
                  An STK push will be sent to your phone. Enter your M-Pesa PIN to complete. Card payments via Stripe also available above.
                </p>
              </>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* POS success toast */}
        {posSuccess && (
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 500 }}>POS seats activated — your cashiers can now log in at pos.askbiz.co</span>
          </div>
        )}

        {/* POS seats add-on */}
        <div style={{ borderRadius: 18, border: `1px solid rgba(208,138,89,.3)`, background: 'rgba(208,138,89,.03)', padding: '22px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <span style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: ACC }}>Point of Sale Seats</span>
                {posEnabled && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,.1)', borderRadius: 9999, padding: '2px 8px' }}>Active · {posSeatCount} seat{posSeatCount !== 1 ? 's' : ''}</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: TX2, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>
                Add cashier and inventory staff to your shop at <strong>£5/seat/month</strong>. Each seat lets one staff member log in to <a href="https://pos.askbiz.co" target="_blank" rel="noreferrer" style={{ color: ACC, textDecoration: 'none' }}>pos.askbiz.co</a> via email or WhatsApp OTP on their own phone. The owner dashboard is always included — seats are for additional staff only.
              </p>
            </div>

            {posEnabled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', flexShrink: 0 }}>
                {/* Seat stepper for amendment */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid rgba(208,138,89,.3)`, borderRadius: 10, overflow: 'hidden', background: SF }}>
                  <button
                    onClick={() => setPosSeats(s => Math.max(1, s - 1))}
                    style={{ width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >−</button>
                  <div style={{ width: 44, textAlign: 'center', fontSize: 14, fontWeight: 700, color: TX }}>
                    {posSeats}
                  </div>
                  <button
                    onClick={() => setPosSeats(s => Math.min(50, s + 1))}
                    style={{ width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>
                </div>

                {posSeats > posSeatCount ? (
                  <button
                    onClick={handlePosCheckout}
                    disabled={posLoading}
                    style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 2px 10px rgba(208,138,89,.3)`, opacity: posLoading ? .6 : 1 }}
                  >
                    {posLoading ? 'Loading…' : `Add ${posSeats - posSeatCount} seat${posSeats - posSeatCount !== 1 ? 's' : ''} →`}
                  </button>
                ) : (
                  <button onClick={handleManagePos} disabled={posLoading} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid rgba(208,138,89,.4)`, background: 'transparent', color: ACC, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: posLoading ? .6 : 1 }}>
                    {posLoading ? 'Loading…' : 'Manage subscription →'}
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {!posEnabled && (

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {/* Seat stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid rgba(208,138,89,.3)`, borderRadius: 10, overflow: 'hidden', background: SF }}>
                <button
                  onClick={() => setPosSeats(s => Math.max(1, s - 1))}
                  style={{ width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >−</button>
                <div style={{ width: 44, textAlign: 'center', fontSize: 14, fontWeight: 700, color: TX }}>
                  {posSeats}
                </div>
                <button
                  onClick={() => setPosSeats(s => Math.min(50, s + 1))}
                  style={{ width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</button>
              </div>

              <div style={{ fontSize: 13, color: TX2 }}>
                {posSeats} seat{posSeats !== 1 ? 's' : ''} ·{' '}
                <strong style={{ color: TX }}>£{posSeats * 5}/month</strong>
              </div>

              <button
                onClick={handlePosCheckout}
                disabled={posLoading}
                style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 2px 10px rgba(208,138,89,.3)`, opacity: posLoading ? .6 : 1 }}
              >
                {posLoading ? 'Loading…' : `Add ${posSeats} seat${posSeats !== 1 ? 's' : ''} →`}
              </button>
            </div>
          )}

          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              'Cashier & inventory roles',
              'Email or WhatsApp OTP login — no app install',
              'Camera price scanning (Claude AI)',
              'WhatsApp receipts to customers',
              'MTD-compatible VAT export',
              'Sales feed into BI dashboard',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: TX2 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Feature comparison table toggle */}
        <button
          onClick={() => setShowTable(v => !v)}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1px solid ${B}`, background: EV, fontSize: 13, fontWeight: 600, color: TX2, cursor: 'pointer', fontFamily: 'inherit', marginBottom: showTable ? 0 : 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {showTable ? 'Hide' : 'Compare all features'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: showTable ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showTable && (
          <div style={{ border: `1px solid ${B}`, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: EV, borderBottom: `1px solid ${B}` }}>
              <div style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.06em' }}>Feature</div>
              {['Free', 'Growth', 'Business'].map((p, i) => (
                <div key={p} style={{ padding: '12px 12px', fontSize: 13, fontWeight: 700, color: ['#6b6760','#6366F1','#7c3aed'][i], textAlign: 'center' }}>{p}</div>
              ))}
            </div>
            {FEATURES_TABLE.map((section, si) => (
              <div key={si}>
                <div style={{ padding: '10px 16px 6px', fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', background: 'rgba(0,0,0,.02)', borderBottom: `1px solid ${B}` }}>
                  {section.category}
                </div>
                {section.rows.map((row, ri) => (
                  <div key={ri} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: `1px solid ${B}`, background: ri % 2 === 0 ? SF : 'rgba(0,0,0,.01)' }}>
                    <div style={{ padding: '10px 16px', fontSize: 13, color: TX2 }}>{row.label}</div>
                    {[row.free, row.growth, row.business].map((val, i) => (
                      <div key={i} style={{ padding: '10px 12px', textAlign: 'center', fontSize: 13, fontWeight: val === '✓' || val === 'Full' || val === 'Unlimited' || val === 'Real-time' ? 600 : 400, color: val === '—' ? TX3 : val === '✓' || val === 'Full' || val === 'Unlimited' ? '#16a34a' : TX2 }}>
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* API callout */}
        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <p style={{ fontSize: 13, color: 'var(--tx2)', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--tx)' }}>API access is included on every plan — including Free.</strong> Build with AskBiz from day one.
          </p>
        </div>

        {/* FAQ */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Common questions</div>
          {[
            { q: 'Can I cancel anytime?',                a: 'Yes — cancel in one click, no questions asked. You keep access until the end of your billing period.' },
            { q: 'What counts as a question?',           a: 'Every time you ask AskBiz something — in chat, on the home screen, or via API — it counts as one question. Free plan gets 10 per month.' },
            { q: 'What does "pre-filled from data" mean?', a: 'On Growth and Business plans, the FX Risk, Landed Cost, and other tools automatically pull your product costs, margins, and supplier data from your connected sources — so you review and calculate rather than entering everything manually.' },
            { q: 'How does social commerce work?',       a: 'Connect TikTok Shop, Instagram Shopping, or Pinterest from the Sources page. AskBiz tracks your conversion rates, saves (demand signals), and which products are going viral — and alerts you when a product has high saves but no orders.' },
            { q: 'How does churn intelligence work?',    a: 'AskBiz scans your customer data monthly and scores each customer by churn risk based on days since last order and purchase frequency. At-risk customers appear in a retention priority list on My Business, and you can ask AskBiz why any specific customer is flagged.' },
            { q: 'How do team seats work?',              a: 'Business plan includes up to 5 team members. Each person gets their own login with role-based access.' },
            { q: 'How do POS seats work?',               a: 'POS seats are a separate add-on at £5/seat/month — available on any plan. Each seat lets one cashier or inventory staff member log in to pos.askbiz.co via email or WhatsApp OTP on their own phone. The owner dashboard is always included free.' },
            { q: 'Are prices in my local currency?',     a: 'Prices are shown in GBP. At checkout, Stripe automatically converts to your local currency at the current exchange rate.' },
            { q: 'Is my data safe?',                     a: 'Your data is encrypted at rest and in transit. We never use your business data to train AI models.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${B}`, padding: '14px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 5 }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: TX3, lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
