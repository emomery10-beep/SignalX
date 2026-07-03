'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { COUNTRY_DIAL, countryFromCurrency, detectGeoFromTimezone, toE164 } from '@/lib/geo'

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

  // Phone / SMS OTP flow
  const [method, setMethod] = useState<Method>('email')
  const [phoneCountry, setPhoneCountry] = useState('KE')
  const [phoneLocal, setPhoneLocal] = useState('')
  const [sentPhone, setSentPhone] = useState('')   // E.164 number the code was sent to
  const [otpCode, setOtpCode] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [smsUnavailable, setSmsUnavailable] = useState(false)

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

  // Resend cooldown ticker
  useEffect(() => {
    if (resendIn <= 0) return
    const id = setInterval(() => setResendIn(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [resendIn > 0])

  const shopifyShop = searchParams.get('ref') === 'shopify' ? searchParams.get('shop') : null

  const getCallbackUrl = () => {
    const base = `${process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'}/auth/callback`
    // Pass shopify context through so auth callback can forward to link-pending
    if (shopifyShop) return `${base}?next=${encodeURIComponent(`/api/shopify/link-pending?shop=${shopifyShop}`)}`
    return base
  }

  const getPostAuthRedirect = () => shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/pos'

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

        if (data.session) { router.push(shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/onboarding') }
        else { setSuccess(tc('auth.ok_check_inbox', { email })) }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(getPostAuthRedirect())
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

  // GoTrue error shapes when the SMS provider (Twilio/MessageBird) isn't
  // configured or phone auth is disabled in Supabase settings.
  const isSmsUnavailableError = (e: any) => {
    const code = e?.code || ''
    const msg = e?.message || ''
    return ['sms_send_failed', 'phone_provider_disabled', 'otp_disabled'].includes(code)
      || /unsupported phone provider|error sending sms|phone.*(disabled|not enabled)|provider.*not.*configured/i.test(msg)
  }

  const handleSendCode = async () => {
    if (!phoneLocal.trim()) { setError(tc('auth.err_enter_phone')); return }
    const e164 = toE164(dial, phoneLocal)
    if (!e164) { setError(tc('auth.err_invalid_phone')); return }
    if (mode === 'signup' && !consentChecked) { setError(tc('auth.err_accept_terms')); return }
    setError(''); setSuccess(''); setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164,
        options: {
          channel: 'sms',
          // Sign-in must not silently create an account for a typo'd number
          shouldCreateUser: mode === 'signup',
          ...(mode === 'signup' && {
            data: {
              full_name: `${firstName} ${lastName}`.trim(),
              // Recorded proof of affirmative consent (GDPR Art. 7(1))
              consent_accepted: true,
              consent_accepted_at: new Date().toISOString(),
              consent_terms_version: CONSENT_VERSION,
              consent_privacy_version: CONSENT_VERSION,
            },
          }),
        },
      })
      if (error) throw error
      setSentPhone(e164)
      setOtpCode('')
      setResendIn(30)
      setSuccess(tc('auth.ok_code_sent', { phone: e164 }))
    } catch (e: any) {
      if (isSmsUnavailableError(e)) {
        setSmsUnavailable(true)
        setError(tc('auth.err_sms_unavailable'))
      } else if (/signups not allowed/i.test(e?.message || '')) {
        setError(tc('auth.err_phone_not_registered'))
      } else {
        setError(e?.message || tc('auth.err_sms_send_failed'))
      }
    } finally { setLoading(false) }
  }

  const handleVerifyCode = async () => {
    if (!otpCode.trim()) { setError(tc('auth.err_invalid_code')); return }
    setError(''); setSuccess(''); setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: sentPhone,
        token: otpCode.trim(),
        type: 'sms',
      })
      if (error) throw error
      if (data.session) {
        router.push(mode === 'signup'
          ? (shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/onboarding')
          : getPostAuthRedirect())
      }
    } catch (e: any) {
      const msg = e?.message || ''
      if (/expired|invalid/i.test(msg)) setError(tc('auth.err_invalid_code'))
      else setError(msg || tc('auth.err_auth_failed'))
    } finally { setLoading(false) }
  }

  const resetPhoneStep = () => {
    setSentPhone(''); setOtpCode(''); setError(''); setSuccess('')
  }

  // 3D tilt on the auth card — follows the cursor on hover, and gently
  // self-animates (via the .animate-tilt-3d CSS keyframe) the rest of the
  // time so the effect is visible even without mouse interaction.
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 })
  const [cardHover, setCardHover] = useState(false)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5   // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setCardTilt({ rx: py * -10, ry: px * 10 })
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1px solid var(--b2)', background: 'var(--ev)',
    color: 'var(--tx)', fontFamily: 'inherit', fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: 'var(--font-dm, DM Sans, sans-serif)',
      position: 'fixed', inset: 0, overflowY: 'auto',
    }}>

      {/* Language toggle — top-right corner */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <LanguageToggle compact/>
      </div>

      {/* Shopify install banner */}
      {searchParams.get('ref') === 'shopify' && searchParams.get('shop') && (
        <div className="animate-fade-down" style={{
          width: '100%', maxWidth: 'min(420px, 100%)', marginBottom: 16,
          background: 'rgba(150,191,72,.08)', border: '1px solid rgba(150,191,72,.3)',
          borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M15.5 2H8.5L2 8.5v7L8.5 22h7L22 15.5v-7L15.5 2z" stroke="#5A8A00" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12 8v4M12 16h.01" stroke="#5A8A00" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#3a6600', marginBottom: 2 }}>
              {tc('auth.shopify_connected', { shop: searchParams.get('shop') || '' })}
            </div>
            <div style={{ fontSize: 12, color: '#5A8A00', lineHeight: 1.4 }}>
              {tc('auth.shopify_subtitle')}
            </div>
          </div>
        </div>
      )}

      {/* Logo */}
      <Link href="/" className="animate-fade-down" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 32, textDecoration: 'none', color: 'var(--tx)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#d08a59', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
            <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
            <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
            <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 20, fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
      </Link>

      {/* Card — 3D tilt: follows the cursor on hover, self-animates otherwise */}
      <div
        className={`animate-scale-up stagger-1${cardHover ? '' : ' animate-tilt-3d'}`}
        onMouseMove={handleCardMouseMove}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => { setCardHover(false); setCardTilt({ rx: 0, ry: 0 }) }}
        style={{
          width: '100%', maxWidth: 'min(420px, 100%)',
          background: 'var(--sf)', border: '1px solid var(--b)',
          borderRadius: 'var(--r-lg)', padding: '32px',
          transformStyle: 'preserve-3d',
          ...(cardHover
            ? { transform: `perspective(1200px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`, transition: 'transform .12s ease-out' }
            : { transition: 'transform .4s ease-out' }),
        }}>

        {/* Mode tabs */}
        <div style={{
          position: 'relative', display: 'flex', background: 'var(--ev)',
          borderRadius: 12, padding: 4, marginBottom: 28,
          width: '100%'
        }}>
          <div aria-hidden style={{
            position: 'absolute', top: 4, bottom: 4, left: 4,
            width: 'calc(50% - 4px)', borderRadius: 9,
            background: 'var(--acc)', boxShadow: '0 2px 8px rgba(208,138,89,.3)',
            transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform .32s var(--ease)',
          }}/>
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setSentPhone(''); setOtpCode(''); setError(''); setSuccess('') }}
              style={{
                position: 'relative', zIndex: 1,
                flex: 1, padding: '10px', borderRadius: 9, border: 'none',
                background: 'transparent',
                color: mode === m ? '#fff' : 'var(--tx2)',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'color .2s var(--ease-out)',
              }}>
              {m === 'signin' ? tc('auth.tab_signin') : tc('auth.tab_signup')}
            </button>
          ))}
        </div>

        <h1 className="animate-fade-up stagger-2" style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: 'center', letterSpacing: '-.02em' }}>
          {mode === 'signin' ? tc('auth.welcome_back') : tc('auth.get_started')}
        </h1>
        <p className="animate-fade-up stagger-2" style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 24, textAlign: 'center', lineHeight: 1.5 }}>
          {mode === 'signin' ? tc('auth.signin_subtitle') : tc('auth.signup_subtitle')}
        </p>

        {/* Social sign-in */}
        <button className="animate-fade-up stagger-3" onClick={() => triggerAuth('google')} disabled={loading}
          style={{ width: '100%', padding: '0 16px', height: 44, borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 10 }}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {tc('auth.continue_google')}
        </button>
        <button className="animate-fade-up stagger-4" onClick={() => triggerAuth('azure')} disabled={loading}
          style={{ width: '100%', padding: '0 16px', height: 44, borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 10 }}>
          <svg width="17" height="17" viewBox="0 0 23 23" fill="none"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#00a4ef" d="M1 12h10v10H1z"/><path fill="#7fba00" d="M12 1h10v10H12z"/><path fill="#ffb900" d="M12 12h10v10H12z"/></svg>
          {tc('auth.continue_microsoft')}
        </button>
        {mode === 'signin' && (
          <button className="animate-fade-up stagger-5" onClick={handlePasskeySignIn} disabled={loading}
            style={{ width: '100%', padding: '0 16px', height: 44, borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 16 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {tc('auth.signin_passkey')}
          </button>
        )}
        {mode === 'signup' && <div style={{ marginBottom: 6 }}/>}

        {/* Divider */}
        <div className="animate-fade-up stagger-5" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}></div>
          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('auth.or')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}></div>
        </div>

        {/* Email / Phone method toggle */}
        <div className="animate-fade-up stagger-6" style={{ position: 'relative', display: 'flex', background: 'var(--ev)', borderRadius: 10, padding: 3, marginBottom: 14 }}>
          <div aria-hidden style={{
            position: 'absolute', top: 3, bottom: 3, left: 3,
            width: 'calc(50% - 3px)', borderRadius: 8,
            background: 'var(--sf)', boxShadow: '0 1px 4px rgba(0,0,0,.08)',
            transform: method === 'phone' ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform .28s var(--ease)',
          }}/>
          {(['email', 'phone'] as Method[]).map(m => (
            <button key={m} onClick={() => { setMethod(m); setError(''); setSuccess('') }}
              style={{
                position: 'relative', zIndex: 1,
                flex: 1, padding: '7px', borderRadius: 8, border: 'none',
                background: 'transparent',
                color: method === m ? 'var(--tx)' : 'var(--tx2)',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'color .2s var(--ease-out)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
              {m === 'email' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
              )}
              {m === 'email' ? tc('auth.method_email') : tc('auth.method_phone')}
            </button>
          ))}
        </div>

        {/* Name fields for signup */}
        {mode === 'signup' && (
          <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={tc('auth.first_name')} style={inp}/>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder={tc('auth.last_name')} style={inp}/>
          </div>
        )}

        {method === 'email' && (<>
          {/* Email */}
          <input className="animate-fade-up stagger-7" value={email} onChange={e => setEmail(e.target.value)} placeholder={tc('auth.email_placeholder')} type="email" autoFocus style={{ ...inp, marginBottom: 10 }}
            onKeyDown={e => e.key === 'Enter' && triggerAuth('email')}/>

          {/* Password */}
          <input className="animate-fade-up stagger-8" value={password} onChange={e => setPassword(e.target.value)} placeholder={tc('auth.password_placeholder')} type="password" style={{ ...inp, marginBottom: 16 }}
            onKeyDown={e => e.key === 'Enter' && triggerAuth('email')}/>
        </>)}

        {method === 'phone' && !sentPhone && (<>
          {/* Country dial code + local number */}
          <div className="animate-fade-up" style={{ display: 'flex', gap: 8, marginBottom: 10 }} dir="ltr">
            <select value={phoneCountry} onChange={e => setPhoneCountry(e.target.value)} aria-label={tc('auth.method_phone')}
              style={{ ...inp, width: 118, flexShrink: 0, cursor: 'pointer', appearance: 'none' }}>
              {COUNTRY_DIAL.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
              ))}
            </select>
            <input value={phoneLocal} onChange={e => setPhoneLocal(e.target.value)} placeholder={tc('auth.phone_placeholder')}
              type="tel" inputMode="tel" autoComplete="tel" dir="ltr" style={{ ...inp, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && handleSendCode()}/>
          </div>
          <p className="animate-fade-up" style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.5 }}>
            {tc('auth.phone_hint')}
          </p>
        </>)}

        {method === 'phone' && sentPhone && (<>
          {/* OTP code entry */}
          <input className="animate-scale-up" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder={tc('auth.otp_placeholder')} type="text" inputMode="numeric" autoComplete="one-time-code"
            autoFocus dir="ltr" style={{ ...inp, marginBottom: 10, textAlign: 'center', letterSpacing: '.35em', fontSize: 18 }}
            onKeyDown={e => e.key === 'Enter' && handleVerifyCode()}/>
          <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={resetPhoneStep} disabled={loading}
              style={{ background: 'none', border: 'none', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
              {tc('auth.change_number')}
            </button>
            <button onClick={handleSendCode} disabled={loading || resendIn > 0}
              style={{ background: 'none', border: 'none', color: resendIn > 0 ? 'var(--tx3)' : 'var(--acc)', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: resendIn > 0 ? 'default' : 'pointer', padding: 0 }}>
              {resendIn > 0 ? tc('auth.resend_in', { s: resendIn }) : tc('auth.resend_code')}
            </button>
          </div>
        </>)}

        {/* Affirmative consent checkbox for signup */}
        {mode === 'signup' && (method === 'email' || !sentPhone) && (
          <label htmlFor="consent" className="animate-fade-up" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, cursor: 'pointer' }}>
            <input
              id="consent"
              type="checkbox"
              checked={consentChecked}
              onChange={e => { setConsentChecked(e.target.checked); if (e.target.checked) setError('') }}
              style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, accentColor: 'var(--acc)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>
              {tc('auth.consent_prefix')}{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)', textDecoration: 'underline' }}>{tc('auth.terms_of_service')}</a>{' '}
              {tc('auth.and')}{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)', textDecoration: 'underline' }}>{tc('auth.privacy_policy')}</a>
            </span>
          </label>
        )}

        {/* Error / Success */}
        {error && <div role="alert" aria-live="polite" className="msg-in" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(244,128,128,.1)', border: '1px solid rgba(244,128,128,.3)', fontSize: 13, color: '#b91c1c', marginBottom: 14 }}>{error}</div>}
        {success && <div role="status" aria-live="polite" className="msg-in" style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', fontSize: 13, color: '#15803d', marginBottom: 14 }}>✓ {success}</div>}

        {/* SMS provider not configured — steer to email */}
        {method === 'phone' && smsUnavailable && (
          <button onClick={() => { setMethod('email'); setError(''); setSuccess('') }}
            style={{ width: '100%', padding: '11px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}>
            {tc('auth.use_email_instead')}
          </button>
        )}

        {/* Primary CTA */}
        {(() => {
          const disabled = loading || (method === 'email'
            ? (!email || !password || (mode === 'signup' && !consentChecked))
            : sentPhone
              ? otpCode.trim().length < 6
              : (!phoneLocal.trim() || smsUnavailable || (mode === 'signup' && !consentChecked)))
          const label = method === 'email'
            ? (mode === 'signin' ? `${tc('auth.tab_signin')} →` : `${tc('auth.tab_signup')} →`)
            : sentPhone ? `${tc('auth.verify_code')} →` : `${tc('auth.send_code')} →`
          const onClick = method === 'email'
            ? () => triggerAuth('email')
            : sentPhone ? handleVerifyCode : handleSendCode
          return (
            <button onClick={onClick} disabled={disabled}
              style={{ width: '100%', padding: '12px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora, Sora)', fontSize: 15, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .6 : 1, marginBottom: 10 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg style={{ animation: 'spin .7s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  {tc('auth.please_wait')}
                </span>
              ) : label}
            </button>
          )
        })()}

        {/* Inline consent details for signup */}
        {mode === 'signup' && (
          <p style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6, marginTop: 8 }}>
            {tc('auth.age_confirm')}{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tx2)', textDecoration: 'underline' }}>{tc('auth.privacy_policy')}</a>.
          </p>
        )}

        {/* Quick switch for signup mode */}
        {mode === 'signup' && (
          <p style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', marginTop: 12 }}>
            Already have an account?{' '}
            <button onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', color: 'var(--acc)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Sign in
            </button>
          </p>
        )}

        {/* Magic link */}
        {method === 'email' && (
        <button onClick={handleMagicLink} disabled={loading || !email}
          style={{ width: '100%', padding: '11px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 14, cursor: loading || !email ? 'not-allowed' : 'pointer', opacity: loading || !email ? .6 : 1 }}>
          {loading ? '…' : tc('auth.send_magic_link')}
        </button>
        )}

      </div>

      <p style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 20, textAlign: 'center' }}>
        {tc('auth.footer_consent_prefix')} <Link href="/terms" style={{ color: 'var(--acc)', textDecoration: 'none' }}>{tc('auth.terms_short')}</Link> {tc('auth.and')} <Link href="/privacy" style={{ color: 'var(--acc)', textDecoration: 'none' }}>{tc('auth.privacy_policy')}</Link>
      </p>
    </div>
  )
}
