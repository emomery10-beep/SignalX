'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { phoneToSyntheticEmail, isValidPin } from '@/lib/phone-auth'

// Same account system as askbiz.co — a developer signs in with the exact
// same Google/Microsoft/email/phone+PIN credentials as their AskBiz
// account, and lands here instead of /pos. See lib/supabase/client.ts for
// the shared-cookie-domain mechanic that makes an existing askbiz.co
// session valid on this subdomain without ever hitting this page.
type Mode = 'signin' | 'signup'
type Method = 'email' | 'phone'

// useSearchParams() opts the tree into client-side rendering and requires a
// Suspense boundary for Next's static prerender pass, or `next build` fails
// on this page. The boundary lives here; the real page is the inner component.
export default function DeveloperSignInPage() {
  return (
    <Suspense fallback={null}>
      <DeveloperSignInForm />
    </Suspense>
  )
}

function DeveloperSignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'signup' ? 'signup' : 'signin')
  const [method, setMethod] = useState<Method>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Preserves the deep link a signed-out visitor arrived with (e.g. a
  // Phase 3 charge-confirmation URL) through both the OAuth round-trip and
  // the direct email/phone sign-in paths, instead of always landing on
  // /dashboard regardless of intent.
  const nextPath = (() => {
    const n = searchParams.get('next')
    return n && n.startsWith('/') ? n : '/dashboard'
  })()

  const getCallbackUrl = () =>
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://developer.askbiz.co'}/auth/callback?next=${encodeURIComponent(nextPath)}`

  const handleOAuth = async (provider: 'google' | 'azure') => {
    setError(''); setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getCallbackUrl(),
          ...(provider === 'azure' && { scopes: 'email profile openid User.Read' }),
        },
      })
      if (error) throw error
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed')
      setLoading(false)
    }
  }

  const handleEmailAuth = async () => {
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: getCallbackUrl() },
        })
        if (error) throw error
        if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
          throw new Error('An account with this email already exists — sign in instead.')
        }
        if (data.session) router.push(nextPath)
        else setSuccess(`Check ${email} for a verification link to finish signing up.`)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(nextPath)
      }
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed')
    } finally { setLoading(false) }
  }

  const handlePhoneAuth = async () => {
    if (!/^\+\d{8,15}$/.test(phone)) { setError('Enter your phone in international format, e.g. +254712345678'); return }
    if (!isValidPin(pin)) { setError('PIN must be 4 digits'); return }
    if (mode === 'signup' && pin !== pinConfirm) { setError('PINs do not match'); return }
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/phone-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signup', phone, pin }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Sign-up failed')
        const { error } = await supabase.auth.signInWithPassword({ email: phoneToSyntheticEmail(phone), password: pin })
        if (error) throw error
        router.push(nextPath)
      } else {
        const res = await fetch('/api/auth/phone-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signin', phone, pin }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Sign-in failed')
        const { error } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
        if (error) throw error
        router.push(nextPath)
      }
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <Link href="https://askbiz.co" className="flex items-center gap-2 mb-8 no-underline text-ink-50">
        <div className="w-7 h-7 rounded-lg bg-signal-500 flex items-center justify-center text-ink-950 font-bold text-sm">A</div>
        <span className="font-display font-bold text-lg tracking-tight">AskBiz Developers</span>
      </Link>

      {/* Visually-hidden page title — the visible header above is a logo
          link, not a heading, so screen readers had no page-level landmark
          without this. */}
      <h1 className="sr-only">Sign in to AskBiz Developers</h1>

      <div className="w-full max-w-sm bg-ink-900 border border-ink-700 rounded-2xl p-6">
        <div className="flex mb-5 border-b border-ink-700" role="tablist" aria-label="Sign in or create account">
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
              role="tab" aria-selected={mode === m}
              className={clsxTab(mode === m)}>
              {m === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <button onClick={() => handleOAuth('google')} disabled={loading}
          className={oauthBtnCls}>
          Continue with Google
        </button>
        <button onClick={() => handleOAuth('azure')} disabled={loading}
          className={`${oauthBtnCls} mb-4`}>
          Continue with Microsoft
        </button>

        <div className="flex items-center gap-2 mb-4 text-ink-300 text-xs">
          <div className="flex-1 h-px bg-ink-700" />
          or
          <div className="flex-1 h-px bg-ink-700" />
        </div>

        <div className="flex mb-4 gap-1 p-1 bg-ink-950 rounded-lg" role="tablist" aria-label="Sign-in method">
          {(['email', 'phone'] as Method[]).map(m => (
            <button key={m} onClick={() => { setMethod(m); setError('') }}
              role="tab" aria-selected={method === m}
              className={clsxMethod(method === m)}>
              {m === 'email' ? 'Email' : 'Phone'}
            </button>
          ))}
        </div>

        {method === 'email' ? (
          <div className="space-y-3">
            <div>
              <label htmlFor="signin-email" className={labelCls}>Email</label>
              <input id="signin-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label htmlFor="signin-password" className={labelCls}>Password</label>
              <input id="signin-password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className={inputCls} />
            </div>
            <button onClick={handleEmailAuth} disabled={loading || !email || !password}
              className={primaryBtnCls}>
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor="signin-phone" className={labelCls}>Phone number</label>
              <input id="signin-phone" type="tel" autoComplete="tel" placeholder="+254712345678" value={phone} onChange={e => setPhone(e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label htmlFor="signin-pin" className={labelCls}>4-digit PIN</label>
              <input id="signin-pin" type="password" inputMode="numeric" maxLength={4} placeholder="4-digit PIN" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                className={inputCls} />
            </div>
            {mode === 'signup' && (
              <div>
                <label htmlFor="signin-pin-confirm" className={labelCls}>Confirm PIN</label>
                <input id="signin-pin-confirm" type="password" inputMode="numeric" maxLength={4} placeholder="Confirm PIN" value={pinConfirm} onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ''))}
                  className={inputCls} />
              </div>
            )}
            <button onClick={handlePhoneAuth} disabled={loading || !phone || pin.length !== 4}
              className={primaryBtnCls}>
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        {success && <p className="mt-3 text-xs text-signal-300">{success}</p>}
      </div>

      <p className="mt-6 text-xs text-ink-300 text-center max-w-sm">
        Same account as your AskBiz business. If you&rsquo;re already signed in on askbiz.co, you&rsquo;re already signed in here.
      </p>
    </div>
  )
}

// focus-visible: audit found inputCls stripping the browser default outline
// (outline-none) with only a border-color change to replace it — a weaker
// signal than a real focus ring. This restores a proper ring, in the brand
// accent, matching the outline spec the main app's DESIGN.md documents
// (2px solid accent, 2px offset) rather than inventing a new pattern.
const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'
// py-3 (not py-2.5) on every interactive control — audit found ~40px total
// height platform-wide, under the 44px touch-target minimum.
const inputCls = `w-full px-3 py-3 rounded-lg border border-ink-600 bg-ink-950 text-ink-50 text-sm transition-colors ${focusRing}`
const primaryBtnCls = `w-full py-3 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`
const oauthBtnCls = `w-full mb-2 py-3 rounded-lg border border-ink-600 bg-ink-800 text-ink-50 text-sm font-medium hover:bg-ink-700 transition-colors disabled:opacity-60 ${focusRing}`
const labelCls = 'block mb-1.5 text-xs font-medium text-ink-200'
const clsxTab = (active: boolean) =>
  `flex-1 pb-3 text-sm font-medium transition-colors ${focusRing} ${active ? 'text-ink-50 border-b-2 border-signal-500' : 'text-ink-300 border-b-2 border-transparent'}`
const clsxMethod = (active: boolean) =>
  // py-3.5, not py-1.5 — this compact segmented control was the worst
  // touch-target offender (~32px total); still visually tight but now
  // meets 44px.
  `flex-1 py-3.5 rounded-md text-xs font-medium transition-colors ${focusRing} ${active ? 'bg-ink-700 text-ink-50' : 'text-ink-300'}`
