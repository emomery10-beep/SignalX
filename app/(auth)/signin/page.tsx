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

  const getCallbackUrl = () => 'https://askbiz.co/auth/callback'

  const handleEmailAuth = async () => {
    setError(''); setSuccess(''); setLoading(true)
    try {
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Authentication failed')
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send magic link')
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getCallbackUrl() }
    })
    if (error) { setError(error.message); setLoading(false) }
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
      padding: '24px', fontFamily: 'var(--font-dm, DM Sans, sans-serif)',
      position: 'fixed', inset: 0, overflowY: 'auto',
    }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 32, textDecoration: 'none', color: 'var(--tx)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
        </div>
        <span style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 20, fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
      </Link>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--sf)', border: '1px solid var(--b)',
        borderRadius: 20, padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,.08)'
      }}>

        {/* Mode tabs — centred */}
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
        <button onClick={handleGoogle} disabled={loading}
          style={{ width: '100%', padding: '11px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 16, transition: 'all 150ms' }}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}/>
          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--b)' }}/>
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
          onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}/>

        {/* Password */}
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ ...inp, marginBottom: 16 }}
          onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}/>

        {/* Error / Success */}
        {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(244,128,128,.1)', border: '1px solid rgba(244,128,128,.3)', fontSize: 13, color: '#f48080', marginBottom: 14 }}>{error}</div>}
        {success && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', fontSize: 13, color: '#22c55e', marginBottom: 14 }}>✓ {success}</div>}

        {/* Primary CTA */}
        <button onClick={handleEmailAuth} disabled={loading || !email || !password}
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
