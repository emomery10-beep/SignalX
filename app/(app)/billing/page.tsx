'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLAN_HIGHLIGHTS, PLAN_DESCRIPTIONS, getPlanBadge } from '@/lib/plans'
import { useLang } from '@/components/LanguageProvider'

// Brand tokens — fixed by plan identity, intentionally not CSS variables
const ACC = '#d08a59'
const PLAN_CLR = {
  free:     '#6b6760',
  growth:   '#6366F1',
  business: '#7c3aed',
}

// ── Feature comparison table data ─────────────────────────────
const buildFeaturesTable = (tc: (key: string, vars?: Record<string, string | number>) => string) => {
  const U = tc('billing.val_unlimited')
  const C = tc('billing.val_check')
  const D = tc('billing.val_dash')
  return [
    {
      category: tc('billing.cat_core'),
      rows: [
        { label: tc('billing.row_questions_per_month'), free: '10',                            growth: U,                            business: U },
        { label: tc('billing.row_file_uploads'),        free: tc('billing.val_one_per_month'), growth: U,                            business: U },
        { label: tc('billing.row_business_pulse'),      free: C,                               growth: C,                            business: C },
        { label: tc('billing.row_data_sources'),        free: tc('billing.val_up_to_3'),       growth: U,                            business: U },
        { label: tc('billing.row_api_access'),          free: C,                               growth: C,                            business: C },
      ],
    },
    {
      category: tc('billing.cat_dashboard'),
      rows: [
        { label: tc('billing.row_kpi_strip'),           free: C, growth: C, business: C },
        { label: tc('billing.row_health_trend'),        free: C, growth: C, business: C },
        { label: tc('billing.row_waterfall'),           free: D, growth: C, business: C },
        { label: tc('billing.row_anomaly_alerts'),      free: D, growth: U, business: U },
        { label: tc('billing.row_decision_timeline'),   free: D, growth: D, business: C },
      ],
    },
    {
      category: tc('billing.cat_intelligence'),
      rows: [
        { label: tc('billing.row_daily_brief'),            free: D, growth: C,                          business: C },
        { label: tc('billing.row_market_intelligence'),    free: D, growth: C,                          business: C },
        { label: tc('billing.row_churn_intelligence'),     free: D, growth: tc('billing.val_monthly'),  business: tc('billing.val_real_time') },
        { label: tc('billing.row_expansion_intelligence'), free: D, growth: C,                          business: C },
        { label: tc('billing.row_decision_memory'),        free: D, growth: D,                          business: C },
        { label: tc('billing.row_competitor_watch'),       free: D, growth: D,                          business: C },
        { label: tc('billing.row_cfo_pl'),                 free: D, growth: D,                          business: C },
        { label: tc('billing.row_cfo_runway'),             free: D, growth: D,                          business: C },
        { label: tc('billing.row_cfo_board'),              free: D, growth: D,                          business: C },
        { label: tc('billing.row_cfo_margin'),             free: D, growth: D,                          business: C },
        { label: tc('billing.row_cfo_working_capital'),    free: D, growth: D,                          business: C },
        { label: tc('billing.row_cfo_cost_structure'),     free: D, growth: D,                          business: C },
      ],
    },
    {
      category: tc('billing.cat_connections'),
      rows: [
        { label: tc('billing.row_integration_hub'),  free: C,                          growth: C, business: C },
        { label: tc('billing.row_ecommerce_sync'),   free: tc('billing.val_up_to_3'),  growth: U, business: U },
        { label: tc('billing.row_accounting_sync'),  free: tc('billing.val_up_to_3'),  growth: U, business: U },
        { label: tc('billing.row_payments_sync'),    free: tc('billing.val_up_to_3'),  growth: U, business: U },
        { label: tc('billing.row_social_commerce'),  free: D,                          growth: C, business: C },
        { label: tc('billing.row_auto_prefill'),     free: D,                          growth: C, business: C },
      ],
    },
    {
      category: tc('billing.cat_tools'),
      rows: [
        { label: tc('billing.row_fx_risk'),            free: tc('billing.val_manual'),     growth: tc('billing.val_prefilled'),         business: tc('billing.val_prefilled') },
        { label: tc('billing.row_landed_cost'),        free: tc('billing.val_manual'),     growth: tc('billing.val_prefilled'),         business: tc('billing.val_prefilled') },
        { label: tc('billing.row_supplier_scorecard'), free: tc('billing.val_view'),       growth: tc('billing.val_full'),              business: tc('billing.val_full') },
        { label: tc('billing.row_export_market'),      free: tc('billing.row_export_market_free'), growth: tc('billing.row_export_market_growth'), business: tc('billing.row_export_market_growth') },
      ],
    },
    {
      category: tc('billing.cat_shipments'),
      rows: [
        { label: tc('billing.row_shipment_tracking'),       free: '1', growth: '5',                        business: U },
        { label: tc('billing.row_financial_impact'),        free: D,   growth: tc('billing.val_basic'),    business: tc('billing.val_full') },
        { label: tc('billing.row_customs_hold'),            free: D,   growth: D,                          business: C },
        { label: tc('billing.row_working_capital_track'),   free: D,   growth: D,                          business: C },
      ],
    },
    {
      category: tc('billing.cat_team'),
      rows: [
        { label: tc('billing.row_team_seats'),     free: tc('billing.val_owner_one'), growth: tc('billing.val_owner_one'), business: tc('billing.val_up_to_5') },
        { label: tc('billing.row_role_access'),    free: D,                           growth: D,                           business: C },
        { label: tc('billing.row_priority_support'), free: D,                         growth: D,                           business: C },
      ],
    },
  ]
}

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()
  const { tc } = useLang()

  // Memoised so it doesn't rebuild on every state change
  const FEATURES_TABLE = useMemo(() => buildFeaturesTable(tc), [tc])

  const [currentPlan,  setCurrentPlan]  = useState('free')
  const [usage,        setUsage]        = useState<any>(null)
  const [limits,       setLimits]       = useState<any>(null)
  const [loading,      setLoading]      = useState('')
  const [pageLoading,  setPageLoading]  = useState(true)
  const [showTable,    setShowTable]    = useState(false)
  const [annual,       setAnnual]       = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  // POS seats
  const [posEnabled,   setPosEnabled]   = useState(false)
  const [posSeatCount, setPosSeatCount] = useState(0)
  const [posSeats,     setPosSeats]     = useState(1)
  const [posLoading,   setPosLoading]   = useState(false)
  const [posSuccess,   setPosSuccess]   = useState(false)
  // Trials
  const [trials,       setTrials]       = useState<Record<string, { active: boolean; daysLeft: number; endsAt: string; expired: boolean; used: boolean }>>({})
  const [trialLoading, setTrialLoading] = useState('')
  const [trialSuccess, setTrialSuccess] = useState('')
  // Kenyan user detection + PesaPal
  const [isKenyan,          setIsKenyan]          = useState(false)
  const [pesapalLoading,    setPesapalLoading]    = useState('')
  const [pesapalSuccess,    setPesapalSuccess]    = useState(false)
  // Somali user detection + WaafiPay — push-prompt flow (like M-Pesa STK
  // push), not a redirect: WaafiPay has no hosted checkout page.
  const [isSomali,          setIsSomali]          = useState(false)
  const [waafiPhone,        setWaafiPhone]        = useState('')
  const [waafiPlan,         setWaafiPlan]         = useState<'growth' | 'business' | 'pos' | null>(null)
  const [waafiStatus,       setWaafiStatus]       = useState<'idle' | 'sending' | 'waiting' | 'completed' | 'failed'>('idle')
  const [waafiReferenceId,  setWaafiReferenceId]  = useState('')
  const [waafiError,        setWaafiError]        = useState('')

  const sym      = isKenyan ? 'KSh' : isSomali ? '$' : '£'
  const currency = isKenyan ? 'KES' : isSomali ? 'USD' : 'GBP'

  useEffect(() => {
    const init = async () => {
      try {
        const roleRes = await fetch('/api/me/role')
        if (roleRes.ok) {
          const { role } = await roleRes.json()
          if (role && role !== 'owner' && role !== 'analyst') {
            router.replace('/intelligence')
            return
          }
        }

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
          if (data.trials) setTrials(data.trials)
          const uc = (data.userCurrency || '').toUpperCase()
          if (uc === 'KES') setIsKenyan(true)
          if (uc === 'SOS') setIsSomali(true)
        }
        if (window.location.search.includes('pos_success=true')) {
          setPosSuccess(true)
          setTimeout(() => setPosSuccess(false), 6000)
        }
        if (window.location.search.includes('pesapal=complete')) {
          setPesapalSuccess(true)
          setTimeout(() => setPesapalSuccess(false), 8000)
        }
      } catch {}
      finally { setPageLoading(false) }
    }
    init()
  }, [])

  // ── Price calculation ──────────────────────────────────────
  const PRICES: Record<string, Record<string, number>> = {
    GBP: { growth: 19, business: 39 },
    KES: { growth: 1900, business: 4900 },
    // Somalia is framed in USD (not SOS) throughout, matching the /so
    // landing page's existing pricing display — kept in sync with
    // USD_PLAN_PRICE in app/api/waafipay-billing/route.ts.
    USD: { growth: 19, business: 49 },
  }

  const getPrice = (planId: string) => {
    const table = PRICES[isKenyan ? 'KES' : isSomali ? 'USD' : 'GBP'] || PRICES.GBP
    const base = table[planId]
    if (!base) return null
    const fmt = (n: number) => `${sym}${n.toLocaleString()}`
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
    setCheckoutError('')
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout', plan: planId, currency, annual }),
      })
      const text = await res.text()
      let data: any = {}
      try { data = JSON.parse(text) } catch {}
      if (data.url) {
        window.location.href = data.url
        return
      }
      setCheckoutError(data.error || tc('billing.alert_checkout_failed', { status: res.status, detail: text.slice(0, 200) }))
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : tc('billing.alert_something_wrong_retry'))
    } finally { setLoading('') }
  }

  const handlePosCheckout = async () => {
    setPosLoading(true)
    setCheckoutError('')
    try {
      const additionalSeats = posSeats - posSeatCount
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout_pos_seat', seats: additionalSeats, currency, annual: false }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setCheckoutError(data.error || tc('billing.alert_something_wrong'))
    } catch { setCheckoutError(tc('billing.alert_something_wrong_retry')) }
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

  // ── PesaPal checkout (Kenyan users) ─────────────────────────
  const handlePesapalCheckout = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return
    setPesapalLoading(planId)
    setCheckoutError('')
    try {
      const res = await fetch('/api/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_order', plan: planId }),
      })
      const data = await res.json()
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }
      setCheckoutError(data.error || tc('billing.alert_something_wrong'))
    } catch {
      setCheckoutError(tc('billing.alert_something_wrong_retry'))
    } finally { setPesapalLoading('') }
  }

  // ── WaafiPay push-prompt checkout (Somali users) ────────────
  // Unlike PesaPal, there's no hosted checkout page — the plan+phone are
  // submitted, WaafiPay sends a PIN prompt straight to that phone, and we
  // poll for completion the same way pos-askbiz's PosWaafiPayment.tsx does.
  const handleWaafiSubmit = async (planOrSeats: 'growth' | 'business' | 'pos') => {
    if (!waafiPhone.trim()) {
      setWaafiError(tc('billing.waafipay_error_phone'))
      return
    }
    setWaafiPlan(planOrSeats)
    setWaafiStatus('sending')
    setWaafiError('')
    setCheckoutError('')
    try {
      const res = await fetch('/api/waafipay-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          planOrSeats === 'pos'
            ? { action: 'submit_order', seats: posSeats, phone: waafiPhone }
            : { action: 'submit_order', plan: planOrSeats, phone: waafiPhone }
        ),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setWaafiStatus('idle')
        setWaafiError(data.error || tc('billing.alert_something_wrong'))
        return
      }
      setWaafiReferenceId(data.reference_id)
      setWaafiStatus('waiting')
    } catch {
      setWaafiStatus('idle')
      setWaafiError(tc('billing.alert_something_wrong_retry'))
    }
  }

  // Polling fallback — no Realtime channel wired into this page, same
  // ~2s/90-attempt shape as pos-askbiz/components/PosWaafiPayment.tsx.
  useEffect(() => {
    if (waafiStatus !== 'waiting' || !waafiReferenceId) return
    let attempts = 0
    const timer = setInterval(async () => {
      attempts++
      if (attempts > 90) {
        clearInterval(timer)
        setWaafiStatus('failed')
        setWaafiError(tc('billing.waafipay_timed_out'))
        return
      }
      try {
        const res = await fetch('/api/waafipay-billing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check_status', reference_id: waafiReferenceId }),
        })
        const data = await res.json()
        if (data.completed) {
          clearInterval(timer)
          setWaafiStatus('completed')
          const refresh = await fetch('/api/billing')
          if (refresh.ok) {
            const d = await refresh.json()
            setCurrentPlan(d.subscription?.plan_id || 'free')
            if (d.pos) { setPosEnabled(d.pos.enabled); setPosSeatCount(d.pos.seatCount) }
          }
        } else if (data.failed) {
          clearInterval(timer)
          setWaafiStatus('failed')
          setWaafiError(tc('billing.waafipay_declined'))
        }
      } catch {}
    }, 2000)
    return () => clearInterval(timer)
  }, [waafiStatus, waafiReferenceId])

  const handleStartTrial = async (type: 'pos' | 'growth') => {
    setTrialLoading(type)
    setCheckoutError('')
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_trial', type }),
      })
      const data = await res.json()
      if (data.success) {
        setTrialSuccess(type)
        setTimeout(() => setTrialSuccess(''), 6000)
        const refresh = await fetch('/api/billing')
        if (refresh.ok) {
          const d = await refresh.json()
          setCurrentPlan(d.subscription?.plan_id || 'free')
          setUsage(d.usage)
          setLimits(d.limits)
          if (d.pos) {
            setPosEnabled(d.pos.enabled)
            setPosSeatCount(d.pos.seatCount)
            if (d.pos.seatCount > 0) setPosSeats(d.pos.seatCount)
          }
          if (d.trials) setTrials(d.trials)
        }
      } else {
        setCheckoutError(data.error || tc('billing.alert_something_wrong'))
      }
    } catch { setCheckoutError(tc('billing.alert_something_wrong_retry')) }
    finally { setTrialLoading('') }
  }

  const handlePesapalPosCheckout = async () => {
    setPosLoading(true)
    setCheckoutError('')
    try {
      const res = await fetch('/api/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_order', plan: 'pos', seats: posSeats }),
      })
      const data = await res.json()
      if (data.redirectUrl) window.location.href = data.redirectUrl
      else setCheckoutError(data.error || tc('billing.alert_something_wrong'))
    } catch { setCheckoutError(tc('billing.alert_something_wrong_retry')) }
    finally { setPosLoading(false) }
  }

  const currentBadge = getPlanBadge(currentPlan)

  const growthPrice = getPrice('growth')
  const bizPrice    = getPrice('business')

  const PLANS = [
    {
      id: 'free',
      name: tc('billing.plan_0_name'),
      colour: PLAN_CLR.free,
      popular: false,
      displayPrice: `${sym}0`,
      annualMonthly: null,
      annualTotal: null,
      desc: PLAN_DESCRIPTIONS.free,
      highlights: PLAN_HIGHLIGHTS.free,
    },
    {
      id: 'growth',
      name: tc('billing.plan_1_name'),
      colour: PLAN_CLR.growth,
      popular: true,
      displayPrice: growthPrice?.monthly || `${sym}19`,
      annualMonthly: growthPrice?.annualMonthly || null,
      annualTotal: growthPrice?.annualTotal || null,
      desc: PLAN_DESCRIPTIONS.growth,
      highlights: PLAN_HIGHLIGHTS.growth,
    },
    {
      id: 'business',
      name: tc('billing.plan_2_name'),
      colour: PLAN_CLR.business,
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
      <div className="page-shell-body" style={{ maxWidth: 860 }}>

        {/* Annual toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 15, color: annual ? 'var(--tx3)' : 'var(--tx)', fontWeight: annual ? 400 : 600 }}>{tc('billing.toggle_monthly')}</span>
          <button
            role="switch"
            aria-checked={annual}
            aria-label={tc('billing.toggle_label') || 'Switch between monthly and annual billing'}
            onClick={() => setAnnual(v => !v)}
            style={{ width: 48, height: 44, borderRadius: 14, background: annual ? ACC : 'var(--b2)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms', flexShrink: 0 }}
          >
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 11, left: annual ? 23 : 3, transition: 'left 200ms', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }}/>
          </button>
          <span style={{ fontSize: 15, color: annual ? 'var(--tx)' : 'var(--tx3)', fontWeight: annual ? 600 : 400 }}>
            {tc('billing.toggle_annual')}
            <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,.1)', borderRadius: 9999, padding: '1px 7px' }}>{tc('billing.toggle_annual_badge')}</span>
          </span>
        </div>

        {/* Inline checkout error — replaces blocking alert() */}
        {checkoutError && (
          <div
            role="alert"
            aria-live="assertive"
            style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 15, color: '#dc2626', flex: 1 }}>{checkoutError}</span>
            <button onClick={() => setCheckoutError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 18, lineHeight: 1, padding: '0 2px' }} aria-label="Dismiss error">×</button>
          </div>
        )}

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
          {PLANS.map(plan => {
            const isCurrent = currentPlan === plan.id
            const shownPrice = annual && plan.annualMonthly ? plan.annualMonthly : plan.displayPrice
            return (
              <div key={plan.id} style={{ borderRadius: 18, border: plan.popular ? `2px solid ${plan.colour}` : '1px solid var(--b)', background: plan.popular ? `rgba(99,102,241,.02)` : 'var(--sf)', padding: '22px 20px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: 20, fontSize: 13, fontWeight: 700, color: '#fff', background: plan.colour, borderRadius: 9999, padding: '3px 12px', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                    {tc('billing.badge_most_popular')}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: 19, fontWeight: 700, color: plan.colour, margin: 0 }}>{plan.name}</h3>
                    {isCurrent && <span style={{ fontSize: 12, fontWeight: 700, color: plan.colour, background: plan.colour + '18', borderRadius: 9999, padding: '2px 8px' }}>{tc('billing.badge_current')}</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: 'var(--font-sora)', fontSize: 32, fontWeight: 800, color: 'var(--tx)', letterSpacing: '-.03em' }}>
                      {shownPrice}
                    </span>
                    {plan.id !== 'free' && (
                      <span style={{ fontSize: 15, color: 'var(--tx3)' }}>
                        {annual ? tc('billing.price_per_month_annual') : tc('billing.price_per_month')}
                      </span>
                    )}
                  </div>

                  {annual && plan.annualTotal && (
                    <div style={{ fontSize: 13, color: '#16a34a', marginTop: 4, fontWeight: 500 }}>
                      {tc('billing.annual_total_note', { total: plan.annualTotal })}
                    </div>
                  )}

                  <p style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 8, lineHeight: 1.55 }}>{plan.desc}</p>
                </div>

                <div style={{ flex: 1, marginBottom: 18 }}>
                  {plan.highlights.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15, color: 'var(--tx2)', marginBottom: 7 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.colour} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Trial badge */}
                {plan.id === 'growth' && trials.growth?.active && (
                  <div style={{ marginBottom: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Static dot — pulse removed to respect prefers-reduced-motion */}
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1', flexShrink: 0 }} aria-hidden="true"/>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#6366F1' }}>{tc(trials.growth.daysLeft === 1 ? 'billing.trial_active_one' : 'billing.trial_active', { days: trials.growth.daysLeft })}</span>
                  </div>
                )}
                {plan.id === 'growth' && trials.growth?.expired && (
                  <div style={{ marginBottom: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>{tc('billing.trial_ended_subscribe')}</span>
                  </div>
                )}

                {(() => {
                  const isTrialing = plan.id === 'growth' && trials.growth?.active
                  const canTrial = plan.id === 'growth' && !trials.growth?.used && !isCurrent
                  const trialExpired = plan.id === 'growth' && trials.growth?.expired

                  if (canTrial) {
                    return (
                      <button
                        onClick={() => handleStartTrial('growth')}
                        disabled={trialLoading === 'growth'}
                        style={{
                          width: '100%', padding: '13px', borderRadius: 10, border: 'none', minHeight: 44,
                          background: '#6366F1',
                          color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {trialLoading === 'growth' ? tc('billing.btn_starting') : tc('billing.btn_start_free')}
                      </button>
                    )
                  }

                  return (
                    <button
                      onClick={() => isKenyan ? handlePesapalCheckout(plan.id) : handleUpgrade(plan.id)}
                      disabled={(!trialExpired && isCurrent) || plan.id === 'free' || loading === plan.id || pesapalLoading === plan.id}
                      style={{
                        width: '100%', padding: '13px', borderRadius: 10, minHeight: 44,
                        border: (!trialExpired && isCurrent) || plan.id === 'free' ? '1px solid var(--b)' : 'none',
                        background: (!trialExpired && isCurrent) || plan.id === 'free' ? 'transparent' : plan.colour,
                        color: (!trialExpired && isCurrent) || plan.id === 'free' ? 'var(--tx3)' : '#fff',
                        fontSize: 16, fontWeight: 600, cursor: (!trialExpired && isCurrent) || plan.id === 'free' ? 'default' : 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {(loading === plan.id || pesapalLoading === plan.id) ? tc('billing.btn_loading')
                        : isTrialing ? tc('billing.btn_subscribe_to', { plan: plan.name })
                        : trialExpired ? tc('billing.btn_subscribe_to', { plan: plan.name })
                        : isCurrent ? tc('billing.btn_current_plan')
                        : plan.id === 'free' ? tc('billing.btn_free_forever')
                        : tc('billing.btn_upgrade_to', { plan: plan.name })}
                    </button>
                  )
                })()}

              </div>
            )
          })}
        </div>

        {/* PesaPal success toast */}
        {pesapalSuccess && (
          <div role="status" aria-live="polite" style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize: 15, color: '#16a34a', fontWeight: 500 }}>{tc('billing.pesapal_success')}</span>
          </div>
        )}

        {/* M-Pesa / PesaPal section — Kenyan users */}
        {isKenyan && (
          <div style={{ borderRadius: 18, border: '1px solid rgba(76,175,80,.3)', background: 'rgba(76,175,80,.03)', padding: '22px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 1v4M12 19v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M1 12h4M19 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <div>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#4CAF50' }}>{tc('billing.mpesa_title')}</span>
                <div style={{ fontSize: 14, color: 'var(--tx3)' }}>{tc('billing.mpesa_subtitle')}</div>
              </div>
            </div>

            <p style={{ fontSize: 15, color: 'var(--tx2)', marginBottom: 16, lineHeight: 1.6 }}>
              {tc('billing.mpesa_intro')}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {currentPlan !== 'growth' && (
                <button
                  onClick={() => handlePesapalCheckout('growth')}
                  disabled={!!pesapalLoading}
                  style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#4CAF50', color: '#fff', fontSize: 15, fontWeight: 600, cursor: pesapalLoading ? 'default' : 'pointer', fontFamily: 'inherit', opacity: pesapalLoading ? .6 : 1, minHeight: 44 }}
                >
                  {pesapalLoading === 'growth' ? tc('billing.mpesa_btn_redirecting') : tc('billing.mpesa_btn_growth')}
                </button>
              )}
              {currentPlan !== 'business' && (
                <button
                  onClick={() => handlePesapalCheckout('business')}
                  disabled={!!pesapalLoading}
                  style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#388E3C', color: '#fff', fontSize: 15, fontWeight: 600, cursor: pesapalLoading ? 'default' : 'pointer', fontFamily: 'inherit', opacity: pesapalLoading ? .6 : 1, minHeight: 44 }}
                >
                  {pesapalLoading === 'business' ? tc('billing.mpesa_btn_redirecting') : tc('billing.mpesa_btn_business')}
                </button>
              )}
              <button
                onClick={handlePesapalPosCheckout}
                disabled={!!pesapalLoading || posLoading}
                style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(76,175,80,.4)', background: 'transparent', color: '#4CAF50', fontSize: 15, fontWeight: 600, cursor: (pesapalLoading || posLoading) ? 'default' : 'pointer', fontFamily: 'inherit', opacity: (pesapalLoading || posLoading) ? .6 : 1, minHeight: 44 }}
              >
                {posLoading ? tc('billing.btn_loading') : tc(posSeats === 1 ? 'billing.mpesa_btn_pos_one' : 'billing.mpesa_btn_pos', { seats: posSeats, total: (posSeats * 500).toLocaleString() })}
              </button>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {['mpesa_method_mpesa', 'mpesa_method_airtel', 'mpesa_method_card'].map(k => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--tx3)', padding: '4px 10px', borderRadius: 8, background: 'rgba(76,175,80,.06)', border: '1px solid rgba(76,175,80,.12)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                  {tc('billing.' + k)}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 12, lineHeight: 1.5 }}>
              {tc('billing.mpesa_footnote')}
            </p>
          </div>
        )}

        {/* WaafiPay section — Somali users. Push-prompt flow: phone input +
            "Send prompt" button per plan, then a waiting/completed/failed
            state — no redirect, since WaafiPay has no hosted checkout page. */}
        {isSomali && (
          <div style={{ borderRadius: 18, border: '1px solid rgba(22,163,74,.3)', background: 'rgba(22,163,74,.03)', padding: '22px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 1v4M12 19v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M1 12h4M19 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <div>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>{tc('billing.waafipay_title')}</span>
                <div style={{ fontSize: 14, color: 'var(--tx3)' }}>{tc('billing.waafipay_subtitle')}</div>
              </div>
            </div>

            {waafiStatus === 'idle' || waafiStatus === 'sending' ? (
              <>
                <p style={{ fontSize: 15, color: 'var(--tx2)', marginBottom: 16, lineHeight: 1.6 }}>
                  {tc('billing.waafipay_intro')}
                </p>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>
                    {tc('billing.waafipay_phone_label')}
                  </label>
                  <input
                    type="tel"
                    placeholder="+252 61 XXX XXXX"
                    value={waafiPhone}
                    onChange={e => setWaafiPhone(e.target.value)}
                    disabled={waafiStatus === 'sending'}
                    style={{ width: '100%', maxWidth: 280, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--b)', fontSize: 15, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)', boxSizing: 'border-box' }}
                  />
                </div>

                {waafiError && (
                  <div style={{ marginBottom: 14, padding: '10px 12px', background: 'rgba(220,38,38,.07)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 10, fontSize: 13, color: '#dc2626', fontWeight: 500 }}>
                    ⚠ {waafiError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {currentPlan !== 'growth' && (
                    <button
                      onClick={() => handleWaafiSubmit('growth')}
                      disabled={waafiStatus === 'sending' || !waafiPhone.trim()}
                      style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontSize: 15, fontWeight: 600, cursor: (waafiStatus === 'sending' || !waafiPhone.trim()) ? 'default' : 'pointer', fontFamily: 'inherit', opacity: (waafiStatus === 'sending' || !waafiPhone.trim()) ? .6 : 1, minHeight: 44 }}
                    >
                      {waafiStatus === 'sending' && waafiPlan === 'growth' ? tc('billing.waafipay_btn_sending') : tc('billing.waafipay_btn_growth')}
                    </button>
                  )}
                  {currentPlan !== 'business' && (
                    <button
                      onClick={() => handleWaafiSubmit('business')}
                      disabled={waafiStatus === 'sending' || !waafiPhone.trim()}
                      style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#15803d', color: '#fff', fontSize: 15, fontWeight: 600, cursor: (waafiStatus === 'sending' || !waafiPhone.trim()) ? 'default' : 'pointer', fontFamily: 'inherit', opacity: (waafiStatus === 'sending' || !waafiPhone.trim()) ? .6 : 1, minHeight: 44 }}
                    >
                      {waafiStatus === 'sending' && waafiPlan === 'business' ? tc('billing.waafipay_btn_sending') : tc('billing.waafipay_btn_business')}
                    </button>
                  )}
                  <button
                    onClick={() => handleWaafiSubmit('pos')}
                    disabled={waafiStatus === 'sending' || !waafiPhone.trim()}
                    style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(22,163,74,.4)', background: 'transparent', color: '#16a34a', fontSize: 15, fontWeight: 600, cursor: (waafiStatus === 'sending' || !waafiPhone.trim()) ? 'default' : 'pointer', fontFamily: 'inherit', opacity: (waafiStatus === 'sending' || !waafiPhone.trim()) ? .6 : 1, minHeight: 44 }}
                  >
                    {waafiStatus === 'sending' && waafiPlan === 'pos' ? tc('billing.waafipay_btn_sending') : tc(posSeats === 1 ? 'billing.waafipay_btn_pos_one' : 'billing.waafipay_btn_pos', { seats: posSeats, total: posSeats * 5 })}
                  </button>
                </div>

                <p style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 14, lineHeight: 1.5 }}>
                  {tc('billing.waafipay_footnote')}
                </p>
              </>
            ) : waafiStatus === 'waiting' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📱</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>
                  {tc('billing.waafipay_check_phone')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>
                  {tc('billing.waafipay_prompt_sent')} <strong>{waafiPhone}</strong>
                </div>
              </div>
            ) : waafiStatus === 'completed' ? (
              <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>{tc('billing.waafipay_success')}</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>❌</div>
                <div style={{ fontSize: 14, color: '#dc2626', marginBottom: 12 }}>{waafiError || tc('billing.waafipay_declined')}</div>
                <button
                  onClick={() => { setWaafiStatus('idle'); setWaafiError(''); setWaafiReferenceId('') }}
                  style={{ padding: '9px 18px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  {tc('billing.waafipay_try_again')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trial success toasts — role="status" so AT announces them politely */}
        {trialSuccess === 'pos' && (
          <div role="status" aria-live="polite" style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize: 15, color: '#16a34a', fontWeight: 500 }}>{tc('billing.toast_pos_trial')}</span>
          </div>
        )}
        {trialSuccess === 'growth' && (
          <div role="status" aria-live="polite" style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize: 15, color: '#16a34a', fontWeight: 500 }}>{tc('billing.toast_growth_trial')}</span>
          </div>
        )}

        {/* POS success toast */}
        {posSuccess && (
          <div role="status" aria-live="polite" style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize: 15, color: '#16a34a', fontWeight: 500 }}>{tc('billing.toast_pos_activated')}</span>
          </div>
        )}

        {/* POS seats add-on */}
        <div style={{ borderRadius: 18, border: `1px solid rgba(208,138,89,.3)`, background: 'rgba(208,138,89,.03)', padding: '22px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <span style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: ACC }}>{tc('billing.pos_title')}</span>
                {posEnabled && trials.pos?.active && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', background: 'rgba(99,102,241,.1)', borderRadius: 9999, padding: '2px 8px' }}>{tc(
                    trials.pos.daysLeft === 1
                      ? (posSeatCount === 1 ? 'billing.pos_badge_trial_one_day_one_seat' : 'billing.pos_badge_trial_one_day')
                      : (posSeatCount === 1 ? 'billing.pos_badge_trial_one_seat' : 'billing.pos_badge_trial'),
                    { days: trials.pos.daysLeft, seats: posSeatCount }
                  )}</span>
                )}
                {posEnabled && !trials.pos?.active && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,.1)', borderRadius: 9999, padding: '2px 8px' }}>{tc(posSeatCount === 1 ? 'billing.pos_badge_active_one' : 'billing.pos_badge_active', { seats: posSeatCount })}</span>
                )}
              </div>
              <p style={{ fontSize: 15, color: 'var(--tx2)', margin: 0, lineHeight: 1.6, maxWidth: 480 }}>
                {trials.pos?.active
                  ? <>{tc('billing.pos_desc_trial_pre')}<a href="https://pos.askbiz.co" target="_blank" rel="noreferrer" style={{ color: ACC, textDecoration: 'none' }}>pos.askbiz.co</a>{tc('billing.pos_desc_trial_post')}</>
                  : <>{tc('billing.pos_desc_pre')}<strong>{tc('billing.pos_desc_price', { price: isKenyan ? 'KSh 500' : '£5' })}</strong>{tc('billing.pos_desc_post')}<a href="https://pos.askbiz.co" target="_blank" rel="noreferrer" style={{ color: ACC, textDecoration: 'none' }}>pos.askbiz.co</a>{tc('billing.pos_desc_post2')}</>
                }
              </p>
            </div>

            {posEnabled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', flexShrink: 0 }}>
                {trials.pos?.active ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, color: 'var(--tx3)' }}>{tc('billing.pos_seats_included')}</span>
                    <button
                      onClick={isKenyan ? handlePesapalPosCheckout : handlePosCheckout}
                      disabled={posLoading}
                      style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid rgba(208,138,89,.4)`, background: 'transparent', color: ACC, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: posLoading ? .6 : 1, minHeight: 44 }}
                    >
                      {posLoading ? tc('billing.btn_loading') : tc('billing.pos_btn_subscribe_now')}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Seat stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid rgba(208,138,89,.3)`, borderRadius: 10, overflow: 'hidden', background: 'var(--sf)' }}>
                      <button
                        onClick={() => setPosSeats(s => Math.max(1, s - 1))}
                        aria-label={tc('billing.pos_decrease_seat') || 'Remove a POS seat'}
                        style={{ width: 44, height: 44, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >−</button>
                      <div
                        aria-live="polite"
                        aria-atomic="true"
                        aria-label={`${posSeats} ${posSeats === 1 ? 'seat' : 'seats'}`}
                        style={{ width: 44, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}
                      >
                        {posSeats}
                      </div>
                      <button
                        onClick={() => setPosSeats(s => Math.min(50, s + 1))}
                        aria-label={tc('billing.pos_increase_seat') || 'Add a POS seat'}
                        style={{ width: 44, height: 44, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>

                    {posSeats > posSeatCount ? (
                      <button
                        onClick={handlePosCheckout}
                        disabled={posLoading}
                        style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: ACC, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: posLoading ? .6 : 1, minHeight: 44 }}
                      >
                        {posLoading ? tc('billing.btn_loading') : tc(posSeats - posSeatCount === 1 ? 'billing.pos_btn_add_seats_one' : 'billing.pos_btn_add_seats', { n: posSeats - posSeatCount })}
                      </button>
                    ) : (
                      <button onClick={handleManagePos} disabled={posLoading} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid rgba(208,138,89,.4)`, background: 'transparent', color: ACC, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: posLoading ? .6 : 1, minHeight: 44 }}>
                        {posLoading ? tc('billing.btn_loading') : tc('billing.pos_btn_manage')}
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : null}
          </div>

          {!posEnabled && (
            <div style={{ marginTop: 20 }}>
              {/* Trial expired notice */}
              {trials.pos?.expired && (
                <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>{tc('billing.pos_trial_expired')}</span>
                </div>
              )}

              {/* Free trial button — flat colour, no gradient */}
              {!trials.pos?.used && (
                <div style={{ marginBottom: 14 }}>
                  <button
                    onClick={() => handleStartTrial('pos')}
                    disabled={trialLoading === 'pos'}
                    style={{
                      padding: '13px 24px', borderRadius: 10, border: 'none', minHeight: 44,
                      background: ACC,
                      color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                      opacity: trialLoading === 'pos' ? .6 : 1,
                    }}
                  >
                    {trialLoading === 'pos' ? tc('billing.btn_starting') : tc('billing.pos_btn_start_free')}
                  </button>
                  <div style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 6 }}>{tc('billing.pos_no_card')}</div>
                </div>
              )}

              {/* Paid seat purchase */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                {/* Seat stepper */}
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid rgba(208,138,89,.3)`, borderRadius: 10, overflow: 'hidden', background: 'var(--sf)' }}>
                  <button
                    onClick={() => setPosSeats(s => Math.max(1, s - 1))}
                    aria-label={tc('billing.pos_decrease_seat') || 'Remove a POS seat'}
                    style={{ width: 44, height: 44, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >−</button>
                  <div
                    aria-live="polite"
                    aria-atomic="true"
                    aria-label={`${posSeats} ${posSeats === 1 ? 'seat' : 'seats'}`}
                    style={{ width: 44, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}
                  >
                    {posSeats}
                  </div>
                  <button
                    onClick={() => setPosSeats(s => Math.min(50, s + 1))}
                    aria-label={tc('billing.pos_increase_seat') || 'Add a POS seat'}
                    style={{ width: 44, height: 44, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: ACC, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>
                </div>

                <div style={{ fontSize: 15, color: 'var(--tx2)' }}>
                  {tc(posSeats === 1 ? 'billing.pos_seat_count_price_one' : 'billing.pos_seat_count_price', { seats: posSeats, price: isKenyan ? `KSh ${(posSeats * 500).toLocaleString()}` : `£${posSeats * 5}` })}
                </div>

                <button
                  onClick={isKenyan ? handlePesapalPosCheckout : handlePosCheckout}
                  disabled={posLoading}
                  style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: ACC, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: posLoading ? .6 : 1, minHeight: 44 }}
                >
                  {posLoading ? tc('billing.btn_loading') : tc(posSeats === 1 ? 'billing.pos_btn_add_seats_one' : 'billing.pos_btn_add_seats', { n: posSeats })}
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--tx2)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                {tc('billing.pos_feat_' + i)}
              </div>
            ))}
          </div>
        </div>

        {/* Feature comparison table toggle — aria-expanded communicates open/closed to AT */}
        <button
          onClick={() => setShowTable(v => !v)}
          aria-expanded={showTable}
          aria-controls="feature-comparison-table"
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--ev)', fontSize: 15, fontWeight: 600, color: 'var(--tx2)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: showTable ? 0 : 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44 }}
        >
          {showTable ? tc('billing.compare_hide') : tc('billing.compare_show')}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ transform: showTable ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {showTable && (
          /* Horizontal scroll wrapper so the 4-column table doesn't clip on mobile */
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <div id="feature-comparison-table" style={{ border: '1px solid var(--b)', borderRadius: 16, overflow: 'hidden', minWidth: 560 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
                <div style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('billing.table_col_feature')}</div>
                {['table_col_free', 'table_col_growth', 'table_col_business'].map((k, i) => (
                  <div key={k} style={{ padding: '12px 12px', fontSize: 15, fontWeight: 700, color: [PLAN_CLR.free, PLAN_CLR.growth, PLAN_CLR.business][i], textAlign: 'center' }}>{tc('billing.' + k)}</div>
                ))}
              </div>
              {FEATURES_TABLE.map((section, si) => (
                <div key={si}>
                  <div style={{ padding: '10px 16px 6px', fontSize: 13, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', background: 'rgba(0,0,0,.02)', borderBottom: '1px solid var(--b)' }}>
                    {section.category}
                  </div>
                  {section.rows.map((row, ri) => (
                    <div key={ri} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid var(--b)', background: ri % 2 === 0 ? 'var(--sf)' : 'rgba(0,0,0,.01)' }}>
                      <div style={{ padding: '10px 16px', fontSize: 15, color: 'var(--tx2)' }}>{row.label}</div>
                      {[row.free, row.growth, row.business].map((val, i) => {
                        const isGood = val === tc('billing.val_check') || val === tc('billing.val_full') || val === tc('billing.val_unlimited') || val === tc('billing.val_real_time') || val === tc('billing.val_prefilled')
                        const isDash = val === tc('billing.val_dash')
                        const isLimit = val === tc('billing.val_manual') || val === tc('billing.val_view') || val === tc('billing.val_monthly') || val === tc('billing.val_basic')
                        return (
                          <div key={i} style={{
                            padding: '10px 12px',
                            textAlign: 'center',
                            fontSize: 15,
                            fontWeight: isGood ? 600 : 400,
                            color: isDash ? 'var(--tx3)' : isGood ? '#16a34a' : isLimit ? '#d08a59' : 'var(--tx2)',
                          }}>
                            {val}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API callout */}
        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <p style={{ fontSize: 15, color: 'var(--tx2)', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--tx)' }}>{tc('billing.api_callout_bold')}</strong> {tc('billing.api_callout_rest')}
          </p>
        </div>

        {/* FAQ — dl/dt/dd for semantic Q&A structure */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>{tc('billing.faq_heading')}</div>
          <dl style={{ margin: 0 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => {
              let a: string
              if (i === 11) a = tc('billing.faq_11_a', { price: isKenyan ? 'KSh 500' : '£5' })
              else if (i === 12) a = isKenyan ? tc('billing.faq_12_a_kes') : tc('billing.faq_12_a_gbp')
              else a = tc('billing.faq_' + i + '_a')
              return { q: tc('billing.faq_' + i + '_q'), a }
            }).map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--b)', padding: '14px 0' }}>
                <dt style={{ fontSize: 16, fontWeight: 600, color: 'var(--tx)', marginBottom: 5 }}>{faq.q}</dt>
                <dd style={{ fontSize: 15, color: 'var(--tx3)', lineHeight: 1.6, margin: 0 }}>{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </div>
  )
}
