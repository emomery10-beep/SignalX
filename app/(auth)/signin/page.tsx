'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Mode = 'signin' | 'signup'

// Version of the legal documents the user is consenting to. Bump when Terms/Privacy change.
const CONSENT_VERSION = '2026-06-16'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'signup' ? 'signup' : 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [consentChecked, setConsentChecked] = useState(false)

  const shopifyShop = searchParams.get('ref') === 'shopify' ? searchParams.get('shop') : null

  const getCallbackUrl = () => {
    const base = `${process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'}/auth/callback`
    // Pass shopify context through so auth callback can forward to link-pending
    if (shopifyShop) return `${base}?next=${encodeURIComponent(`/api/shopify/link-pending?shop=${shopifyShop}`)}`
    return base
  }

  const getPostAuthRedirect = () => shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/chat'

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
          throw new Error('You must accept the Terms and Privacy Policy to create an account.')
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
          throw new Error('An account with this email already exists. Try signing in instead, or use a magic link.')
        }

        if (data.session) { router.push(shopifyShop ? `/api/shopify/link-pending?shop=${shopifyShop}` : '/onboarding') }
        else { setSuccess(`Check your inbox at ${email} — click the link to activate your account.`) }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(getPostAuthRedirect())
      }
    } catch (e: any) {
      const msg = e?.message || e?.error_description || (typeof e === 'string' ? e : 'Authentication failed')
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
      const msg = e?.message || e?.error_description || 'Passkey sign-in failed'
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
    if (!email) { setError('Enter your email first'); return }
    setError(''); setSuccess(''); setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getCallbackUrl() }
      })
      if (error) throw error
      setSuccess(`Magic link sent to ${email} — check your inbox.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send magic link')
    } finally { setLoading(false) }
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

      {/* Shopify install banner */}
      {searchParams.get('ref') === 'shopify' && searchParams.get('shop') && (
        <div style={{
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
              Shopify store connected: {searchParams.get('shop')}
            </div>
            <div style={{ fontSize: 12, color: '#5A8A00', lineHeight: 1.4 }}>
              Sign in or create a free AskBiz account to link your Shopify store and start analysing your data.
            </div>
          </div>
        </div>
      )}

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 32, textDecoration: 'none', color: 'var(--tx)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
            <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
            <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
            <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 20, fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
      </Link>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 'min(420px, 100%)',
        background: 'var(--sf)', border: '1px solid var(--b)',
        borderRadius: 20, padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,.08)'
      }}>

        {/* Mode tabs */}
        <div style={{
          display: 'flex', background: 'var(--ev)',
          borderRadius: 12, padding: 4, marginBottom: 28,
          width: '100%'
        }}>
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: 9, border: 'none',
                background: mode === m ? 'var(--acc)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--tx2)',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 150ms',
                boxShadow: mode === m ? '0 2px 8px rgba(208,138,89,.3)' : 'none',
              }}>
              {m === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <h1 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: 'center', letterSpacing: '-.02em' }}>
          {mode === 'signin' ? 'Welcome back' : 'Get started free'}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 24, textAlign: 'center' }}>
          {mode === 'signin' ? 'Sign in to your AskBiz account' : '10 free questions every month — no card needed'}
        </p>

        {/* Social sign-in */}
        <button onClick={() => triggerAuth('google')} disabled={loading}
          style={{ width: '100%', padding: '0 16px', height: 44, borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 10, transition: 'all 150ms' }}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <button onClick={() => triggerAuth('azure')} disabled={loading}
          style={{ width: '100%', padding: '0 16px', height: 44, borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 10, transition: 'all 150ms' }}>
          <svg width="17" height="17" viewBox="0 0 23 23" fill="none"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#00a4ef" d="M1 12h10v10H1z"/><path fill="#7fba00" d="M12 1h10v10H12z"/><path fill="#ffb900" d="M12 12h10v10H12z"/></svg>
          Continue with Microsoft
        </button>
        {mode === 'signin' && (
          <button onClick={handlePasskeySignIn} disabled={loading}
            style={{ width: '100%', padding: '0 16px', height: 44, borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 16, transition: 'all 150ms' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Sign in with Passkey
          </button>
        )}
        {mode === 'signup' && <div style={{ marginBottom: 6 }}/>}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}></div>
          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}></div>
        </div>

        {/* Name fields for signup */}
        {mode === 'signup' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" style={inp}/>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" style={inp}/>
          </div>
        )}

        {/* Email */}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" style={{ ...inp, marginBottom: 10 }}
          onKeyDown={e => e.key === 'Enter' && triggerAuth('email')}/>

        {/* Password */}
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ ...inp, marginBottom: 16 }}
          onKeyDown={e => e.key === 'Enter' && triggerAuth('email')}/>

        {/* Affirmative consent checkbox for signup */}
        {mode === 'signup' && (
          <label htmlFor="consent" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, cursor: 'pointer' }}>
            <input
              id="consent"
              type="checkbox"
              checked={consentChecked}
              onChange={e => { setConsentChecked(e.target.checked); if (e.target.checked) setError('') }}
              style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, accentColor: 'var(--acc)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)', textDecoration: 'underline' }}>Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)', textDecoration: 'underline' }}>Privacy Policy</a>
            </span>
          </label>
        )}

        {/* Error / Success */}
        {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(244,128,128,.1)', border: '1px solid rgba(244,128,128,.3)', fontSize: 13, color: '#f48080', marginBottom: 14 }}>{error}</div>}
        {success && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', fontSize: 13, color: '#22c55e', marginBottom: 14 }}>✓ {success}</div>}

        {/* Primary CTA */}
        <button onClick={() => triggerAuth('email')} disabled={loading || !email || !password || (mode === 'signup' && !consentChecked)}
          style={{ width: '100%', padding: '12px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora, Sora)', fontSize: 15, fontWeight: 600, cursor: loading || !email || !password || (mode === 'signup' && !consentChecked) ? 'not-allowed' : 'pointer', opacity: loading || !email || !password || (mode === 'signup' && !consentChecked) ? .6 : 1, marginBottom: 10 }}>
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in →' : 'Create account →'}
        </button>

        {/* Inline consent details for signup */}
        {mode === 'signup' && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6, marginBottom: 6 }}>
              By creating an account you confirm you are 13+ (16 in the EU/UK).
            </p>
            <p style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              You consent to data processing for AI-powered business insights, including: analysis of uploaded files,
              IP-based geolocation for currency detection, and optional POS features such as camera scanning,
              logistics tracking, and mobile money payments (M-Pesa, MTN, Airtel). Camera images are processed
              in real time and never stored. See our{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tx2)', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
              for full details.
            </p>
          </div>
        )}

        {/* Magic link */}
        <button onClick={handleMagicLink} disabled={loading || !email}
          style={{ width: '100%', padding: '11px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 14, cursor: loading || !email ? 'not-allowed' : 'pointer', opacity: loading || !email ? .6 : 1 }}>
          {loading ? '…' : 'Send magic link instead'}
        </button>

      </div>

      <p style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 20, textAlign: 'center' }}>
        By continuing you agree to our <Link href="/terms" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Terms</Link> and <Link href="/privacy" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Privacy Policy</Link>
      </p>
    </div>
  )
}
