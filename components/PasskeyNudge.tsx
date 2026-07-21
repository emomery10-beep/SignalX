'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { PASSKEY_NUDGE_DISMISSED_KEY } from '@/lib/passkey-nudge'

// Hard navigation, not router.push — this fires right after a session
// change (sign-in just completed). Next's client Router Cache is keyed by
// pathname only, so a soft push to a route visited earlier in this tab (e.g.
// a previous account's /pos on a shared device) can serve that OLD render
// instead of fetching fresh. A full navigation guarantees the new cookies
// are what the server sees.
const goTo = (destination: string) => { window.location.href = destination }

// Shown once after a successful email/password or phone+PIN auth (signup or
// sign-in) to nudge the user toward adding a passkey — skipped entirely if
// they already have one, or if they've dismissed the nudge for good.
//
// Owns the whole lifecycle: the passkey-list check, show/dismiss state, and
// the localStorage "don't show again" flag. Mount it wherever a flow just
// finished and is about to navigate to `destination` — it either renders the
// nudge UI (and navigates itself once the user dismisses/completes it), or
// renders nothing and navigates straight to `destination` immediately.
export default function PasskeyNudge({ destination }: { destination: string }) {
  const supabase = createClient()
  const { tc } = useLang()

  const [show, setShow] = useState(false)
  const [dontRemind, setDontRemind] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (typeof window !== 'undefined' && localStorage.getItem(PASSKEY_NUDGE_DISMISSED_KEY)) {
          if (!cancelled) goTo(destination)
          return
        }
        const auth = supabase.auth as any
        const listFn = auth.passkey?.list || auth.listPasskeys
        if (typeof listFn === 'function') {
          const res = await listFn.call(auth)
          const passkeys = res?.data?.passkeys || res?.data || []
          if (Array.isArray(passkeys) && passkeys.length > 0) {
            if (!cancelled) goTo(destination)
            return
          }
        }
        if (!cancelled) setShow(true)
      } catch {
        if (!cancelled) goTo(destination)
      }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination])

  const dismiss = () => {
    if (dontRemind && typeof window !== 'undefined') localStorage.setItem(PASSKEY_NUDGE_DISMISSED_KEY, '1')
    goTo(destination)
  }

  const addPasskey = async () => {
    setBusy(true)
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
      setBusy(false)
      goTo(destination)
    }
  }

  if (!show) return null

  return (
    <div className="animate-fade-up" style={{ textAlign: 'center', padding: '5px 0', maxWidth: 320, margin: '0 auto' }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(208,138,89,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <circle cx="12" cy="16" r="1"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h1 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700, marginBottom: 5 }}>{tc('auth.passkey_nudge_title')}</h1>
      <p style={{ fontSize: 'clamp(15px,1.4vw,16px)', color: 'var(--tx2)', marginBottom: 14, lineHeight: 1.5 }}>{tc('auth.passkey_nudge_body')}</p>
      <button onClick={addPasskey} disabled={busy}
        style={{ width: '100%', minHeight: 0, padding: '8px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(16px,1.4vw,17px)', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', opacity: busy ? .7 : 1, marginBottom: 7 }}>
        {busy ? tc('auth.please_wait') : tc('auth.passkey_nudge_cta')}
      </button>
      <button onClick={dismiss} disabled={busy}
        style={{ width: '100%', minHeight: 0, padding: '7px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 'clamp(15px,1.3vw,16px)', cursor: busy ? 'not-allowed' : 'pointer', marginBottom: 10 }}>
        {tc('auth.passkey_nudge_skip')}
      </button>
      <label style={{ minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
        <input type="checkbox" checked={dontRemind} onChange={e => setDontRemind(e.target.checked)}
          style={{ width: 12, height: 12, accentColor: 'var(--acc)', cursor: 'pointer' }}/>
        <span style={{ fontSize: 'clamp(13px,1.1vw,14px)', color: 'var(--tx3)' }}>{tc('auth.passkey_nudge_dont_remind')}</span>
      </label>
    </div>
  )
}
