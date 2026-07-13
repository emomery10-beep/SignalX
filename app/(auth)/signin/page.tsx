'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { COUNTRY_DIAL, countryFromCurrency, detectGeoFromTimezone, toE164 } from '@/lib/geo'
import { phoneToSyntheticEmail } from '@/lib/phone-auth'

const PASSKEY_NUDGE_DISMISSED_KEY = 'askbiz_passkey_nudge_dismissed'

type Mode = 'signin' | 'signup'
type Method = 'email' | 'phone'

// Version of the legal documents the user is consenting to. Bump when Terms/Privacy change.
const CONSENT_VERSION = '2026-06-16'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { tc } = useLang()
  const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'signup' ? 'signup' : 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [consentChecked, setConsentChecked] = useState(false)

  // Phone + PIN login — no SMS, rides on Supabase's real password auth via
  // a synthetic email (see lib/phone-auth.ts)
  const [method, setMethod] = useState<Method>('phone')
  const [phoneCountry, setPhoneCountry] = useState('KE')
  const [phoneLocal, setPhoneLocal] = useState('')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')

  // Passkey nudge — shown once after a successful login/signup if the user
  // has no passkey yet and hasn't dismissed it for good.
  const [passkeyNudge, setPasskeyNudge] = useState<{ show: boolean; destination: string }>({ show: false, destination: '' })
  const [nudgeDontRemind, setNudgeDontRemind] = useState(false)
  const [nudgeBusy, setNudgeBusy] = useState(false)

  // Prefill the dial-code country from geo; fall back to timezone-derived
  // currency when /api/geo is unreachable (e.g. local dev).
  useEffect(() => {
    let cancelled = false
    fetch('/api/geo')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (!cancelled && d?.countryCode && COUNTRY_DIAL.some(c => c.code === d.countryCode)) {
          setPhoneCountry(d.countryCode)
        }
      })
      .catch(() => {
        if (cancelled) return
        const cc = countryFromCurrency(detectGeoFromTimezone().currency)
        if (cc && COUNTRY_DIAL.some(c => c.code === cc)) setPhoneCountry(cc)
      })
    return () => { cancelled = true }
  }, [])

  const shopifyShop = searchParams.get('ref') === 'shopify' ? searchParams.get('shop') : null

  const getCallbackUrl = () => {
    const base = `${process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'}/auth/callback`
    // Pass shopify context through so auth callback can forward to link-pending
    if (shopifyShop) return `${base}?next=${encodeURIComponent(`/api/shopify/link-pending?shop=${shopifyShop}`)}`
    return base
  }

  const getPostAuthRedirect = () => shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/pos'

  // Runs after any successful email/password or phone+PIN auth — nudges the
  // user to add a passkey (skipped if they already have one, or dismissed
  // the nudge for good). Does not apply to OAuth (redirects off-page) or
  // passkey sign-in itself (they're already using one).
  const proceedAfterAuth = async (destination: string) => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem(PASSKEY_NUDGE_DISMISSED_KEY)) {
        router.push(destination); return
      }
      const auth = supabase.auth as any
      const listFn = auth.passkey?.list || auth.listPasskeys
      if (typeof listFn === 'function') {
        const res = await listFn.call(auth)
        const passkeys = res?.data?.passkeys || res?.data || []
        if (Array.isArray(passkeys) && passkeys.length > 0) {
          router.push(destination); return
        }
      }
      setPasskeyNudge({ show: true, destination })
    } catch {
      router.push(destination)
    }
  }

  const dismissPasskeyNudge = () => {
    if (nudgeDontRemind && typeof window !== 'undefined') localStorage.setItem(PASSKEY_NUDGE_DISMISSED_KEY, '1')
    router.push(passkeyNudge.destination)
  }

  const addPasskeyFromNudge = async () => {
    setNudgeBusy(true)
    try {
      const auth = supabase.auth as any
      if (typeof auth.registerPasskey === 'function') {
        const result = await auth.registerPasskey()
        if (result?.error) throw result.error
      }
    } catch {
      // Cancelled or failed enrollment shouldn't block navigation — they can
      // add a passkey later from settings.
    } finally {
      setNudgeBusy(false)
      router.push(passkeyNudge.destination)
    }
  }

  const executeAuth = async (action: 'email' | 'google' | 'apple' | 'azure') => {
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (action === 'google' || action === 'apple' || action === 'azure') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: action,
          options: {
            redirectTo: getCallbackUrl(),
            ...(action === 'azure' && { scopes: 'email profile openid User.Read' }),
          }
        })
        if (error) throw error
        return
      }
      // Email/password
      if (mode === 'signup') {
        if (!consentChecked) {
          throw new Error(tc('auth.err_accept_terms'))
        }
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: {
              full_name: `${firstName} ${lastName}`.trim(),
              // Recorded proof of affirmative consent (GDPR Art. 7(1))
              consent_accepted: true,
              consent_accepted_at: new Date().toISOString(),
              consent_terms_version: CONSENT_VERSION,
              consent_privacy_version: CONSENT_VERSION,
            },
            emailRedirectTo: getCallbackUrl(),
          },
        })
        if (error) throw error

        // Supabase returns empty identities when the email already exists
        // (security feature to prevent email enumeration — no error thrown, no email sent)
        if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
          throw new Error(tc('auth.err_email_exists'))
        }

        if (data.session) { proceedAfterAuth(shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/onboarding') }
        else { setSuccess(tc('auth.ok_check_inbox', { email })) }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        proceedAfterAuth(getPostAuthRedirect())
      }
    } catch (e: any) {
      const msg = e?.message || e?.error_description || (typeof e === 'string' ? e : tc('auth.err_auth_failed'))
      setError(msg)
    } finally { setLoading(false) }
  }

  const triggerAuth = (action: 'email' | 'google' | 'apple' | 'azure') => {
    executeAuth(action)
  }

  const handlePasskeySignIn = async () => {
    setError(''); setSuccess(''); setLoading(true)
    try {
      const { data, error } = await (supabase.auth as any).signInWithPasskey()
      if (error) throw error
      if (data?.session) {
        router.push(getPostAuthRedirect())
      }
    } catch (e: any) {
      const msg = e?.message || e?.error_description || tc('auth.err_passkey_failed')
      const fullText = `${msg} ${e?.name || ''}`
      // Ignore user-cancelled or timed-out WebAuthn prompts
      if (fullText.match(/cancell?ed|AbortError|NotAllowedError|timed out|not allowed/i)) {
        // User dismissed the passkey prompt — no error to show
      } else {
        setError(msg)
      }
    } finally { setLoading(false) }
  }

  const handleMagicLink = async () => {
    if (!email) { setError(tc('auth.err_enter_email_first')); return }
    setError(''); setSuccess(''); setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getCallbackUrl() }
      })
      if (error) throw error
      setSuccess(tc('auth.ok_magic_sent', { email }))
    } catch (e) {
      setError(e instanceof Error ? e.message : tc('auth.err_magic_failed'))
    } finally { setLoading(false) }
  }

  const dial = COUNTRY_DIAL.find(c => c.code === phoneCountry)?.dial || '+254'

  const handlePhoneAuth = async () => {
    if (!phoneLocal.trim()) { setError(tc('auth.err_enter_phone')); return }
    const e164 = toE164(dial, phoneLocal)
    if (!e164) { setError(tc('auth.err_invalid_phone')); return }
    if (!/^\d{4}$/.test(pin)) { setError(tc('auth.err_invalid_pin')); return }
    if (mode === 'signup') {
      if (!consentChecked) { setError(tc('auth.err_accept_terms')); return }
      if (pin !== pinConfirm) { setError(tc('auth.err_pin_mismatch')); return }
    }
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/phone-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup', phone: e164, pin,
            firstName, lastName, consentVersion: CONSENT_VERSION,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || tc('auth.err_auth_failed'))

        // Account just created server-side with the admin API (which doesn't
        // hand back a browser session) — sign in normally with the PIN the
        // user just chose to establish the real client session.
        const { error } = await supabase.auth.signInWithPassword({ email: phoneToSyntheticEmail(e164), password: pin })
        if (error) throw error
        proceedAfterAuth(shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/onboarding')
      } else {
        const res = await fetch('/api/auth/phone-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signin', phone: e164, pin }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || tc('auth.err_auth_failed'))

        // Server already verified the PIN against Supabase's real password
        // auth and returned the resulting tokens — hydrate them into the
        // browser client so cookies/session persist like any other login.
        const { error } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
        if (error) throw error
        proceedAfterAuth(getPostAuthRedirect())
      }
    } catch (e: any) {
      setError(e?.message || tc('auth.err_auth_failed'))
    } finally { setLoading(false) }
  }

  // 3D tilt on the auth card — hover-only micro-interaction (no idle
  // self-animation: a card that wobbles on its own while nobody's touching
  // it fights the brand's own "speed reads as confidence" principle).
  // Disabled entirely under prefers-reduced-motion.
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 })
  const [cardHover, setCardHover] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5   // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setCardTilt({ rx: py * -10, ry: px * 10 })
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '7px 10px', borderRadius: 8,
    border: '1px solid var(--b2)', background: 'var(--ev)',
    color: 'var(--tx)', fontFamily: 'inherit', fontSize: 'clamp(16px,1.6vw,17px)',
    outline: 'none', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    display: 'block', minHeight: 0, fontFamily: 'inherit', fontSize: 'clamp(15px,1.4vw,16px)', fontWeight: 500,
    color: 'var(--tx2)', marginBottom: 4,
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      padding: '28px 12px 16px', fontFamily: 'var(--font-dm, DM Sans, sans-serif)',
      position: 'fixed', inset: 0, overflowY: 'auto',
    }}>

      {/* Language toggle — top-right corner */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <LanguageToggle compact/>
      </div>

      {/* Shopify install banner */}
      {searchParams.get('ref') === 'shopify' && searchParams.get('shop') && (
        <div className="animate-fade-down" style={{
          width: '100%', maxWidth: 'min(300px, 100%)', marginBottom: 10,
          background: 'rgba(150,191,72,.08)', border: '1px solid rgba(150,191,72,.3)',
          borderRadius: 9, padding: '9px 12px', display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M15.5 2H8.5L2 8.5v7L8.5 22h7L22 15.5v-7L15.5 2z" stroke="#5A8A00" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12 8v4M12 16h.01" stroke="#5A8A00" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize: 'clamp(14px,1.4vw,15px)', fontWeight: 600, color: '#3a6600', marginBottom: 2 }}>
              {tc('auth.shopify_connected', { shop: searchParams.get('shop') || '' })}
            </div>
            <div style={{ fontSize: 'clamp(13px,1.2vw,14px)', color: '#5A8A00', lineHeight: 1.4 }}>
              {tc('auth.shopify_subtitle')}
            </div>
          </div>
        </div>
      )}

      {/* Logo */}
      <Link href="/" className="animate-fade-down" style={{ minHeight: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, textDecoration: 'none', color: 'var(--tx)', flexShrink: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: '#d08a59', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
        </div>
        <span style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(14px,1.6vw,16px)', fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
      </Link>

      {/* Card — 3D tilt: follows the cursor on hover, self-animates otherwise */}
      <div
        className="animate-scale-up stagger-1"
        onMouseMove={handleCardMouseMove}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => { setCardHover(false); setCardTilt({ rx: 0, ry: 0 }) }}
        style={{
          width: '100%', maxWidth: 'min(300px, 100%)', flexShrink: 0,
          background: 'var(--sf)', border: '1px solid var(--b)',
          borderRadius: 'var(--r-lg)', padding: '16px',
          transformStyle: 'preserve-3d',
          ...(cardHover
            ? { transform: `perspective(1200px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`, transition: 'transform .12s ease-out' }
            : { transition: 'transform .4s ease-out' }),
        }}>

        {passkeyNudge.show ? (
          <div className="animate-fade-up" style={{ textAlign: 'center', padding: '5px 0' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(208,138,89,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700, marginBottom: 5 }}>{tc('auth.passkey_nudge_title')}</h1>
            <p style={{ fontSize: 'clamp(15px,1.4vw,16px)', color: 'var(--tx2)', marginBottom: 14, lineHeight: 1.5 }}>{tc('auth.passkey_nudge_body')}</p>
            <button onClick={addPasskeyFromNudge} disabled={nudgeBusy}
              style={{ width: '100%', minHeight: 0, padding: '8px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(16px,1.4vw,17px)', fontWeight: 600, cursor: nudgeBusy ? 'wait' : 'pointer', opacity: nudgeBusy ? .7 : 1, marginBottom: 7 }}>
              {nudgeBusy ? tc('auth.please_wait') : tc('auth.passkey_nudge_cta')}
            </button>
            <button onClick={dismissPasskeyNudge} disabled={nudgeBusy}
              style={{ width: '100%', minHeight: 0, padding: '7px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 'clamp(15px,1.3vw,16px)', cursor: nudgeBusy ? 'not-allowed' : 'pointer', marginBottom: 10 }}>
              {tc('auth.passkey_nudge_skip')}
            </button>
            <label style={{ minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={nudgeDontRemind} onChange={e => setNudgeDontRemind(e.target.checked)}
                style={{ width: 12, height: 12, accentColor: 'var(--acc)', cursor: 'pointer' }}/>
              <span style={{ fontSize: 'clamp(13px,1.1vw,14px)', color: 'var(--tx3)' }}>{tc('auth.passkey_nudge_dont_remind')}</span>
            </label>
          </div>
        ) : (<>

        {/* Mode tabs */}
        <div style={{
          position: 'relative', display: 'flex', background: 'var(--ev)',
          borderRadius: 9, padding: 3, marginBottom: 10,
          width: '100%'
        }}>
          <div aria-hidden style={{
            position: 'absolute', top: 3, bottom: 3, left: 3,
            width: 'calc(50% - 3px)', borderRadius: 7,
            background: 'var(--acc)', boxShadow: '0 2px 8px rgba(208,138,89,.3)',
            transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform .32s var(--ease)',
          }}/>
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setPin(''); setPinConfirm(''); setError(''); setSuccess('') }}
              style={{
                position: 'relative', zIndex: 1, minHeight: 0,
                flex: 1, padding: '7px', borderRadius: 7, border: 'none',
                background: 'transparent',
                color: mode === m ? '#fff' : 'var(--tx2)',
                fontFamily: 'inherit', fontSize: 'clamp(16px,1.4vw,17px)', fontWeight: 600,
                cursor: 'pointer', transition: 'color .2s var(--ease-out)',
              }}>
              {m === 'signin' ? tc('auth.tab_signin') : tc('auth.tab_signup')}
            </button>
          ))}
        </div>

        <h1 className="animate-fade-up stagger-2" style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(18px,2.4vw,22px)', fontWeight: 700, marginBottom: 2, textAlign: 'center', letterSpacing: '-.02em' }}>
          {mode === 'signin' ? tc('auth.welcome_back') : tc('auth.get_started')}
        </h1>
        <p className="animate-fade-up stagger-2" style={{ fontSize: 'clamp(15px,1.6vw,16px)', color: 'var(--tx2)', marginBottom: 9, textAlign: 'center', lineHeight: 1.4 }}>
          {mode === 'signin' ? tc('auth.signin_subtitle') : tc('auth.signup_subtitle')}
        </p>

        {/* Social sign-in */}
        <button className="animate-fade-up stagger-3 no-tap-target" onClick={() => triggerAuth('google')} disabled={loading}
          style={{ width: '100%', padding: '0 12px', height: 28, borderRadius: 7, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 'clamp(16px,1.4vw,17px)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {tc('auth.continue_google')}
        </button>
        <button className="animate-fade-up stagger-4" onClick={() => triggerAuth('azure')} disabled={loading}
          style={{ width: '100%', minHeight: 0, padding: '0 12px', height: 28, borderRadius: 7, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 'clamp(16px,1.4vw,17px)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 5 }}>
          <svg width="12" height="12" viewBox="0 0 23 23" fill="none"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#00a4ef" d="M1 12h10v10H1z"/><path fill="#7fba00" d="M12 1h10v10H12z"/><path fill="#ffb900" d="M12 12h10v10H12z"/></svg>
          {tc('auth.continue_microsoft')}
        </button>
        {mode === 'signin' && (
          <button className="animate-fade-up stagger-5" onClick={handlePasskeySignIn} disabled={loading}
            style={{ width: '100%', minHeight: 0, padding: '0 12px', height: 28, borderRadius: 7, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 'clamp(16px,1.4vw,17px)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 7 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {tc('auth.signin_passkey')}
          </button>
        )}
        {mode === 'signup' && <div style={{ marginBottom: 2 }}/>}

        {/* Divider */}
        <div className="animate-fade-up stagger-5" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}></div>
          <span style={{ fontSize: 'clamp(13px,1.1vw,14px)', color: 'var(--tx3)' }}>{tc('auth.or')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}></div>
        </div>

        {/* Email / Phone method toggle */}
        <div className="animate-fade-up stagger-6" style={{ position: 'relative', display: 'flex', background: 'var(--ev)', borderRadius: 8, padding: 2, marginBottom: 7 }}>
          <div aria-hidden style={{
            position: 'absolute', top: 2, bottom: 2, left: 2,
            width: 'calc(50% - 2px)', borderRadius: 6,
            background: 'var(--sf)', boxShadow: '0 1px 4px rgba(0,0,0,.08)',
            transform: method === 'phone' ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform .28s var(--ease)',
          }}/>
          {(['phone', 'email'] as Method[]).map(m => (
            <button key={m} onClick={() => { setMethod(m); setError(''); setSuccess('') }}
              style={{
                position: 'relative', zIndex: 1, minHeight: 0,
                flex: 1, padding: '5px', borderRadius: 6, border: 'none',
                background: 'transparent',
                color: method === m ? 'var(--tx)' : 'var(--tx2)',
                fontFamily: 'inherit', fontSize: 'clamp(16px,1.4vw,17px)', fontWeight: 600,
                cursor: 'pointer', transition: 'color .2s var(--ease-out)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
              {m === 'email' ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
              )}
              {m === 'email' ? tc('auth.method_email') : tc('auth.method_phone')}
            </button>
          ))}
        </div>

        {/* Name fields for signup — grouped under a heading so identity and
            credential fields read as two distinct steps, not one long wall */}
        {mode === 'signup' && (
          <>
            <p className="animate-fade-up" style={{ fontSize: 'clamp(15px,1.3vw,16px)', fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>
              {tc('auth.signup_identity_heading')}
            </p>
            <div className="animate-fade-up grid-fixed-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 7 }}>
              <div>
                <label htmlFor="firstName" style={lbl}>{tc('auth.first_name')}</label>
                <input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={tc('auth.first_name')} style={inp}/>
              </div>
              <div>
                <label htmlFor="lastName" style={lbl}>{tc('auth.last_name')}</label>
                <input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder={tc('auth.last_name')} style={inp}/>
              </div>
            </div>
            <p className="animate-fade-up" style={{ fontSize: 'clamp(15px,1.3vw,16px)', fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>
              {tc('auth.signup_credentials_heading')}
            </p>
          </>
        )}

        {method === 'email' && (<>
          {/* Email */}
          <div className="animate-fade-up stagger-7" style={{ marginBottom: 5 }}>
            <label htmlFor="email" style={lbl}>{tc('auth.email_placeholder')}</label>
            <input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={tc('auth.email_placeholder')} type="email" style={inp}
              onKeyDown={e => e.key === 'Enter' && triggerAuth('email')}/>
          </div>

          {/* Password */}
          <div className="animate-fade-up stagger-8" style={{ marginBottom: 7 }}>
            <label htmlFor="password" style={lbl}>{tc('auth.password_placeholder')}</label>
            <input id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tc('auth.password_placeholder')} type="password" style={inp}
              onKeyDown={e => e.key === 'Enter' && triggerAuth('email')}/>
          </div>
        </>)}

        {method === 'phone' && (<>
          {/* Country dial code + local number */}
          <div className="animate-fade-up" style={{ marginBottom: 5 }}>
            <label htmlFor="phoneLocal" style={lbl}>{tc('auth.phone_label')}</label>
            <div style={{ display: 'flex', gap: 5 }} dir="ltr">
              <select value={phoneCountry} onChange={e => setPhoneCountry(e.target.value)} aria-label={tc('auth.method_phone')}
                style={{ ...inp, width: 82, flexShrink: 0, cursor: 'pointer', appearance: 'none' }}>
                {COUNTRY_DIAL.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                ))}
              </select>
              <input id="phoneLocal" value={phoneLocal} onChange={e => setPhoneLocal(e.target.value)} placeholder={tc('auth.phone_placeholder')}
                type="tel" inputMode="tel" autoComplete="tel" autoFocus dir="ltr" style={{ ...inp, flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && handlePhoneAuth()}/>
            </div>
          </div>

          {/* PIN entry — single field to sign in, confirm field added on signup */}
          <div style={{ display: 'grid', gridTemplateColumns: mode === 'signup' ? 'repeat(2, 1fr)' : '1fr', gap: 6, marginBottom: 5 }}>
            <div>
              <label htmlFor="pin" style={lbl}>{tc('auth.pin_placeholder')}</label>
              <input id="pin" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder={tc('auth.pin_placeholder')} type="password" inputMode="numeric" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                dir="ltr" style={{ ...inp, textAlign: 'center', letterSpacing: pin ? '.5em' : 'normal', fontSize: 'clamp(17px,1.8vw,18px)' }}
                onKeyDown={e => e.key === 'Enter' && handlePhoneAuth()}/>
            </div>
            {mode === 'signup' && (
              <div>
                <label htmlFor="pinConfirm" style={lbl}>{tc('auth.pin_confirm_placeholder')}</label>
                <input id="pinConfirm" value={pinConfirm} onChange={e => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder={tc('auth.pin_confirm_placeholder')} type="password" inputMode="numeric" autoComplete="new-password"
                  dir="ltr" style={{ ...inp, textAlign: 'center', letterSpacing: pinConfirm ? '.5em' : 'normal', fontSize: 'clamp(17px,1.8vw,18px)' }}
                  onKeyDown={e => e.key === 'Enter' && handlePhoneAuth()}/>
              </div>
            )}
          </div>
          <p className="animate-fade-up" style={{ fontSize: 'clamp(13px,1.2vw,14px)', color: 'var(--tx3)', marginBottom: 7, lineHeight: 1.4 }}>
            {tc('auth.phone_hint')}
          </p>
        </>)}

        {/* Affirmative consent checkbox for signup */}
        {mode === 'signup' && (
          <label htmlFor="consent" className="animate-fade-up" style={{ minHeight: 0, display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 7, cursor: 'pointer' }}>
            <input
              id="consent"
              type="checkbox"
              checked={consentChecked}
              onChange={e => { setConsentChecked(e.target.checked); if (e.target.checked) setError('') }}
              style={{ width: 12, height: 12, marginTop: 2, flexShrink: 0, accentColor: 'var(--acc)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 'clamp(13px,1.2vw,14px)', color: 'var(--tx2)', lineHeight: 1.4 }}>
              {tc('auth.consent_prefix')}{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ minHeight: 0, display: 'inline', color: 'var(--acc)', textDecoration: 'underline' }}>{tc('auth.terms_of_service')}</a>{' '}
              {tc('auth.and')}{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ minHeight: 0, display: 'inline', color: 'var(--acc)', textDecoration: 'underline' }}>{tc('auth.privacy_policy')}</a>
            </span>
          </label>
        )}

        {/* Error / Success */}
        {error && <div role="alert" aria-live="polite" className="msg-in" style={{ padding: '6px 9px', borderRadius: 7, background: 'rgba(244,128,128,.1)', border: '1px solid rgba(244,128,128,.3)', fontSize: 'clamp(14px,1.4vw,15px)', color: '#b91c1c', marginBottom: 6 }}>{error}</div>}
        {success && <div role="status" aria-live="polite" className="msg-in" style={{ padding: '6px 9px', borderRadius: 7, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', fontSize: 'clamp(14px,1.4vw,15px)', color: '#15803d', marginBottom: 6 }}>✓ {success}</div>}

        {/* Primary CTA */}
        {(() => {
          const disabled = loading || (method === 'email'
            ? (!email || !password || (mode === 'signup' && !consentChecked))
            : (!phoneLocal.trim() || pin.length !== 4 || (mode === 'signup' && (pinConfirm.length !== 4 || !consentChecked))))
          const label = mode === 'signin' ? `${tc('auth.tab_signin')} →` : `${tc('auth.tab_signup')} →`
          const onClick = method === 'email' ? () => triggerAuth('email') : handlePhoneAuth
          return (
            <button onClick={onClick} disabled={disabled}
              style={{ width: '100%', minHeight: 0, padding: '7px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(16px,1.6vw,17px)', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .6 : 1, marginBottom: 5 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg style={{ animation: 'spin .7s linear infinite' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  {tc('auth.please_wait')}
                </span>
              ) : label}
            </button>
          )
        })()}

        {/* Inline consent details for signup */}
        {mode === 'signup' && (
          <p style={{ fontSize: 'clamp(13px,1vw,13px)', color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.5, marginTop: 3 }}>
            {tc('auth.age_confirm')}{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ minHeight: 0, display: 'inline', color: 'var(--tx2)', textDecoration: 'underline' }}>{tc('auth.privacy_policy')}</a>.
          </p>
        )}

        {/* Quick switch for signup mode */}
        {mode === 'signup' && (
          <p style={{ fontSize: 'clamp(14px,1.3vw,15px)', color: 'var(--tx3)', textAlign: 'center', marginTop: 5 }}>
            Already have an account?{' '}
            <button onClick={() => setMode('signin')} style={{ minHeight: 0, background: 'none', border: 'none', color: 'var(--acc)', fontFamily: 'inherit', fontSize: 'clamp(14px,1.3vw,15px)', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'inline' }}>
              Sign in
            </button>
          </p>
        )}

        {/* Magic link */}
        {method === 'email' && (
        <button onClick={handleMagicLink} disabled={loading || !email}
          style={{ width: '100%', minHeight: 0, padding: '6px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 'clamp(15px,1.4vw,16px)', cursor: loading || !email ? 'not-allowed' : 'pointer', opacity: loading || !email ? .6 : 1 }}>
          {loading ? '…' : tc('auth.send_magic_link')}
        </button>
        )}

        </>)}
      </div>

      <p style={{ fontSize: 'clamp(13px,1.2vw,14px)', color: 'var(--tx3)', marginTop: 10, textAlign: 'center', flexShrink: 0 }}>
        {tc('auth.footer_consent_prefix')} <Link href="/terms" style={{ minHeight: 0, display: 'inline', color: 'var(--acc)', textDecoration: 'none' }}>{tc('auth.terms_short')}</Link> {tc('auth.and')} <Link href="/privacy" style={{ minHeight: 0, display: 'inline', color: 'var(--acc)', textDecoration: 'none' }}>{tc('auth.privacy_policy')}</Link>
      </p>
    </div>
  )
}
