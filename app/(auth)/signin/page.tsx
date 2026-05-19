'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Consent modal state
  const [showConsent, setShowConsent] = useState(false)
  const [pendingAction, setPendingAction] = useState<'email' | 'google' | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToData, setAgreedToData] = useState(false)
  const [agreedToAge, setAgreedToAge] = useState(false)

  const allConsented = agreedToTerms && agreedToData && agreedToAge

  const getCallbackUrl = () => `${process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'}/auth/callback`

  // Called after consent is confirmed
  const executeAuth = async (action: 'email' | 'google') => {
    setShowConsent(false)
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (action === 'google') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: getCallbackUrl() }
        })
        if (error) throw error
        return
      }
      // Email/password
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: `${firstName} ${lastName}`.trim() },
            emailRedirectTo: getCallbackUrl(),
          },
        })
        if (error) throw error
        if (data.session) { router.push('/onboarding') }
        else { setSuccess(`Check your inbox at ${email} — click the link to activate your account.`) }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/chat')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed')
    } finally { setLoading(false) }
  }

  // Trigger auth — show consent modal first if signing up
  const triggerAuth = (action: 'email' | 'google') => {
    if (mode === 'signup') {
      setPendingAction(action)
      setShowConsent(true)
    } else {
      executeAuth(action)
    }
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

      {/* Consent modal */}
      {showConsent && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px 16px',
        }} onClick={e => { if (e.target === e.currentTarget) setShowConsent(false) }}>
          <div style={{
            background: 'var(--sf)', borderRadius: 20, padding: '32px',
            width: '100%', maxWidth: 420,
            boxShadow: '0 24px 64px rgba(0,0,0,.18)',
            border: '1px solid var(--b)',
            animation: 'slideUp .2s ease both',
          }}>
            <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>

            {/* Icon + heading */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--acc)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 18, fontWeight: 700, color: 'var(--tx)', margin: '0 0 6px', letterSpacing: '-.02em' }}>
                Before you continue
              </h2>
              <p style={{ fontSize: 13, color: 'var(--tx2)', margin: 0, lineHeight: 1.5 }}>
                Please confirm the following to create your account
              </p>
            </div>

            {/* Consent items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                {
                  key: 'terms' as const,
                  checked: agreedToTerms,
                  set: setAgreedToTerms,
                  text: <>I agree to the <Link href="/terms" target="_blank" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Terms of Service</Link> and <Link href="/privacy" target="_blank" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Privacy Policy</Link></>,
                },
                {
                  key: 'data' as const,
                  checked: agreedToData,
                  set: setAgreedToData,
                  text: <>I consent to AskBiz processing my business data for AI-powered insights. I can withdraw in Settings. <Link href="/privacy#data" target="_blank" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Learn more</Link></>,
                },
                {
                  key: 'age' as const,
                  checked: agreedToAge,
                  set: setAgreedToAge,
                  text: <>I confirm I am at least 13 years old (16 in the EU)</>,
                },
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '12px 14px', borderRadius: 12, background: item.checked ? 'rgba(208,138,89,.06)' : 'var(--ev)', border: `1.5px solid ${item.checked ? 'rgba(208,138,89,.3)' : 'var(--b)'}`, transition: 'all 150ms' }}>
                  <div style={{ position: 'relative', flexShrink: 0, marginTop: 1 }}>
                    <input type="checkbox" checked={item.checked} onChange={e => item.set(e.target.checked)}
                      style={{ opacity: 0, position: 'absolute', width: 18, height: 18, cursor: 'pointer', margin: 0 }}/>
                    <div style={{
                      width: 18, height: 18, borderRadius: 5,
                      background: item.checked ? 'var(--acc)' : 'var(--sf)',
                      border: `2px solid ${item.checked ? 'var(--acc)' : 'var(--b2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 150ms',
                    }}>
                      {item.checked && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 12.5, color: 'var(--tx2)', lineHeight: 1.55 }}>{item.text}</span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <button
              onClick={() => pendingAction && executeAuth(pendingAction)}
              disabled={!allConsented}
              style={{
                width: '100%', padding: '13px', borderRadius: 9999, border: 'none',
                background: allConsented ? 'var(--acc)' : 'var(--ev)',
                color: allConsented ? '#fff' : 'var(--tx3)',
                fontFamily: 'var(--font-sora, Sora)', fontSize: 15, fontWeight: 600,
                cursor: allConsented ? 'pointer' : 'not-allowed',
                transition: 'all 200ms',
                marginBottom: 10,
              }}>
              {allConsented ? 'Confirm & create account →' : 'Please agree to all above'}
            </button>
            <button
              onClick={() => setShowConsent(false)}
              style={{ width: '100%', padding: '10px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
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

        {/* Google */}
        <button onClick={() => triggerAuth('google')} disabled={loading}
          style={{ width: '100%', padding: '0 16px', height: 44, borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 16, transition: 'all 150ms' }}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

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

        {/* Error / Success */}
        {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(244,128,128,.1)', border: '1px solid rgba(244,128,128,.3)', fontSize: 13, color: '#f48080', marginBottom: 14 }}>{error}</div>}
        {success && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', fontSize: 13, color: '#22c55e', marginBottom: 14 }}>✓ {success}</div>}

        {/* Primary CTA */}
        <button onClick={() => triggerAuth('email')} disabled={loading || !email || !password}
          style={{ width: '100%', padding: '12px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora, Sora)', fontSize: 15, fontWeight: 600, cursor: loading || !email || !password ? 'not-allowed' : 'pointer', opacity: loading || !email || !password ? .6 : 1, marginBottom: 10 }}>
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in →' : 'Create account →'}
        </button>

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
