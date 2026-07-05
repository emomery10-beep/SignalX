'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { posSeatPrice } from '@/lib/geo'
import SpeakButton from '@/components/SpeakButton'

// ── AskBiz tokens (match onboarding / setup) ─────────────────
const ACC = '#d08a59'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B2  = 'rgba(0,0,0,.14)'
const SF  = '#ffffff'
const BG  = '#f9f8f6'
const OK  = '#2e7d54'

type Phase = 'loading' | 'pay' | 'redirecting' | 'checking' | 'pending' | 'active' | 'cancelled'

export default function PosActivatePage() {
  const router = useRouter()
  const supabase = createClient()
  const { tc } = useLang()

  const [phase, setPhase]       = useState<Phase>('loading')
  const [currency, setCurrency] = useState('GBP')
  const [seats, setSeats]       = useState(1) // 1 (owner) + team drafts
  const [error, setError]       = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Turn any staff drafts into real accounts once payment is confirmed.
  // Idempotent + best-effort — never blocks reaching the "live" screen.
  const provisionTeam = useCallback(async () => {
    try { await fetch('/api/pos/staff-draft/provision', { method: 'POST' }) } catch { /* retried on next POS load */ }
  }, [])

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }, [])

  // Poll /api/billing (the single source of truth for pos_enabled — its GET
  // also runs trial-expiry logic) until the payment webhook flips the flag.
  const startPolling = useCallback(() => {
    setPhase('checking')
    let tries = 0
    stopPolling()
    const tick = async () => {
      tries += 1
      try {
        const res = await fetch('/api/billing')
        if (res.ok) {
          const d = await res.json()
          if (d?.pos?.enabled) { stopPolling(); await provisionTeam(); setPhase('active'); return }
        }
      } catch { /* transient network error — keep polling */ }
      if (tries >= 30) { stopPolling(); setPhase('pending') } // ~90s, then manual retry
    }
    tick()
    pollRef.current = setInterval(tick, 3000)
  }, [stopPolling, provisionTeam])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('currency, pos_enabled')
        .eq('id', user.id)
        .maybeSingle()
      if (cancelled) return

      if (profile?.currency) setCurrency(profile.currency)

      // Seats = the owner's own seat + one per team draft.
      try {
        const dr = await fetch('/api/pos/staff-draft')
        if (dr.ok) { const d = await dr.json(); if (!cancelled) setSeats(1 + (d.drafts?.length || 0)) }
      } catch { /* default 1 seat */ }

      if (profile?.pos_enabled) { setPhase('active'); return }

      // Read query params in-effect (avoids the useSearchParams Suspense
      // requirement at build time).
      const params = new URLSearchParams(window.location.search)
      if (params.get('cancelled')) { setPhase('cancelled'); return }
      if (params.get('paid') || params.get('pesapal') || params.get('OrderTrackingId')) {
        startPolling(); return
      }
      setPhase('pay')
    })()
    return () => { cancelled = true; stopPolling() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Show the price in the currency the vendor confirmed at onboarding —
  // never a foreign symbol at the moment they're asked for money.
  const isKenyan = currency === 'KES' // KES → M-Pesa (PesaPal) is the primary path
  const price = posSeatPrice(currency, seats)

  const payMpesa = async () => {
    setPhase('redirecting'); setError('')
    try {
      const res = await fetch('/api/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_order', plan: 'pos', seats, return_path: '/pos/activate' }),
      })
      const d = await res.json()
      if (d.redirectUrl) { window.location.href = d.redirectUrl; return }
      setError(d.error || tc('pos_setup.activate_err')); setPhase('pay')
    } catch { setError(tc('pos_setup.activate_err')); setPhase('pay') }
  }

  const payCard = async () => {
    setPhase('redirecting'); setError('')
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout_pos_seat', seats, return_path: '/pos/activate' }),
      })
      const d = await res.json()
      if (d.url) { window.location.href = d.url; return }
      setError(d.error || tc('pos_setup.activate_err')); setPhase('pay')
    } catch { setError(tc('pos_setup.activate_err')); setPhase('pay') }
  }

  const bigBtn: React.CSSProperties = {
    width: '100%', padding: '16px', borderRadius: 14, border: 'none',
    background: ACC, color: '#fff', fontSize: 17, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 12px rgba(208,138,89,.3)',
  }
  const ghostBtn: React.CSSProperties = {
    width: '100%', padding: '15px', borderRadius: 14, border: `1.5px solid ${B2}`,
    background: 'transparent', color: TX2, fontSize: 16, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  }
  const spinner = (
    <svg style={{ animation: 'spin .8s linear infinite' }} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  )

  return (
    <div style={{ minHeight: '100%', background: BG, fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', padding: '32px 16px 40px', flex: 1 }}>

        {phase === 'loading' && (
          <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{spinner}</div>
        )}

        {/* ── PAY: the one-screen checkout ── */}
        {(phase === 'pay' || phase === 'redirecting') && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <SpeakButton text={`${tc('pos_setup.activate_title')}. ${price} ${tc('pos_setup.team_per_month')}`} size={48} />
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(24px,5vw,30px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 8 }}>
              {tc('pos_setup.activate_title')}
            </h1>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 8 }}>
              {tc('pos_setup.activate_subtitle')}
            </p>
            <p style={{ fontSize: 13, color: TX3, marginBottom: 28 }}>
              {tc('pos_setup.activate_items_saved')}
            </p>

            <div style={{ padding: '28px 20px', borderRadius: 18, background: SF, border: `1.5px solid ${B2}`, marginBottom: 24 }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 44, fontWeight: 700, color: TX, letterSpacing: '-.02em', lineHeight: 1 }}>
                {price}
              </div>
              <div style={{ fontSize: 13, color: TX2, marginTop: 10 }}>
                {tc('pos_setup.activate_price_note', { price })}
              </div>
              {seats > 1 && (
                <div style={{ fontSize: 12, color: TX3, marginTop: 6 }}>
                  {tc('pos_setup.activate_seats', { seats })}
                </div>
              )}
            </div>

            {error && <div role="alert" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#b91c1c', fontSize: 13, marginBottom: 16 }}>{error}</div>}

            {phase === 'redirecting' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, color: TX2, fontSize: 15 }}>
                {spinner} {tc('pos_setup.activate_redirecting')}
              </div>
            ) : (
              <>
                {isKenyan ? (
                  <>
                    <button style={{ ...bigBtn, marginBottom: 10 }} onClick={payMpesa}>{tc('pos_setup.activate_pay_mpesa')}</button>
                    <button style={{ ...ghostBtn, marginBottom: 10 }} onClick={payCard}>{tc('pos_setup.activate_pay_card')}</button>
                  </>
                ) : (
                  <button style={{ ...bigBtn, marginBottom: 10 }} onClick={payCard}>{tc('pos_setup.activate_pay_card')}</button>
                )}
                <button style={{ background: 'none', border: 'none', color: TX3, fontSize: 14, cursor: 'pointer', padding: '10px 0', fontFamily: 'inherit' }} onClick={() => router.push('/pos/setup')}>
                  {tc('pos_setup.activate_back_items')}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── CHECKING: returned from payment, waiting on webhook ── */}
        {phase === 'checking' && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>{spinner}</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: TX }}>{tc('pos_setup.activate_checking')}</p>
          </div>
        )}

        {/* ── PENDING: webhook slow / payment incomplete — never a dead end ── */}
        {phase === 'pending' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.7, marginBottom: 24 }}>{tc('pos_setup.activate_still_pending')}</p>
            <button style={{ ...bigBtn, marginBottom: 10 }} onClick={startPolling}>{tc('pos_setup.activate_check_again')}</button>
            <button style={ghostBtn} onClick={() => router.push('/pos/setup')}>{tc('pos_setup.activate_back_items')}</button>
          </div>
        )}

        {/* ── ACTIVE: payment confirmed ── */}
        {phase === 'active' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(46,125,84,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(24px,5vw,30px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 10 }}>
              {tc('pos_setup.activate_success_title')}
            </h1>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.6, marginBottom: 28 }}>
              {tc('pos_setup.activate_success_subtitle')}
            </p>
            <button style={bigBtn} onClick={() => router.push('/pos')}>{tc('pos_setup.activate_success_cta')}</button>
          </div>
        )}

        {/* ── CANCELLED: payment declined / abandoned — everything is saved ── */}
        {phase === 'cancelled' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,5vw,27px)', fontWeight: 700, color: TX, letterSpacing: '-.02em', marginBottom: 10 }}>
              {tc('pos_setup.activate_cancelled_title')}
            </h1>
            <p style={{ fontSize: 15, color: TX2, lineHeight: 1.7, marginBottom: 28 }}>
              {tc('pos_setup.activate_cancelled_subtitle')}
            </p>
            <button style={{ ...bigBtn, marginBottom: 10 }} onClick={() => setPhase('pay')}>{tc('pos_setup.activate_retry')}</button>
            <button style={ghostBtn} onClick={() => router.push('/pos/setup')}>{tc('pos_setup.activate_back_items')}</button>
          </div>
        )}

      </div>
    </div>
  )
}
