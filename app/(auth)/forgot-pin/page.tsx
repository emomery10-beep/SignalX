'use client'
import { useState } from 'react'
import Link from 'next/link'
import { COUNTRY_DIAL, toE164 } from '@/lib/geo'

// Self-service PIN recovery. Companion to app/change-pin/page.tsx (which
// handles the *forced* reset after an admin issues a temp PIN) — this is
// the user-initiated path, verified over WhatsApp instead of an admin
// relaying a code by hand. See app/api/auth/phone-pin/reset/route.ts.
// Styled like change-pin/page.tsx rather than the themed signin page: a
// narrow, single-purpose utility screen, not the marketing-adjacent auth card.
const ACC = '#d08a59'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B2  = 'rgba(0,0,0,.14)'
const EV  = '#f3f2ef'
const BG  = '#f9f8f6'

const inp: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 8,
  border: `1px solid ${B2}`, background: EV, color: TX,
  fontFamily: 'inherit', fontSize: 15, fontWeight: 600, outline: 'none', boxSizing: 'border-box',
}
const inpCode: React.CSSProperties = {
  ...inp, fontSize: 17, fontWeight: 700, textAlign: 'center', letterSpacing: '.4em',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
  color: TX2, marginBottom: 4,
}
const card: React.CSSProperties = {
  width: '100%', maxWidth: 360, background: '#fff', borderRadius: 16,
  border: `1px solid ${B2}`, padding: 28,
}
const shell: React.CSSProperties = {
  minHeight: '100dvh', background: BG, display: 'flex',
  alignItems: 'center', justifyContent: 'center', padding: 20,
  fontFamily: 'var(--font-dm, DM Sans, sans-serif)',
}
const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '11px 0', borderRadius: 8, border: 'none',
  background: ACC, color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
  cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.7 : 1,
})

type Step = 'phone' | 'code' | 'done'

export default function ForgotPinPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phoneCountry, setPhoneCountry] = useState('KE')
  const [phoneLocal, setPhoneLocal] = useState('')
  const [e164, setE164] = useState('')
  const [code, setCode] = useState('')
  const [newPin, setNewPin] = useState('')
  const [newPinConfirm, setNewPinConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const dial = COUNTRY_DIAL.find(c => c.code === phoneCountry)?.dial || '+254'

  const startCooldown = () => {
    setCooldown(60)
    const timer = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const requestCode = async () => {
    setError('')
    if (!phoneLocal.trim()) { setError('Enter your phone number.'); return }
    const phone = toE164(dial, phoneLocal)
    if (!phone) { setError('That phone number doesn’t look right.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/phone-pin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', phone }),
      })
      if (!res.ok) throw new Error()
      setE164(phone)
      setStep('code')
      startCooldown()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const confirmReset = async () => {
    setError('')
    if (!/^\d{6}$/.test(code)) { setError('Enter the 6-digit code from WhatsApp.'); return }
    if (newPin.length !== 4) { setError('Enter a 4-digit PIN.'); return }
    if (newPin !== newPinConfirm) { setError('PINs don’t match.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/phone-pin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', phone: e164, code, newPin }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return }
      setStep('done')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={shell}>
      <div style={card}>
        {step === 'phone' && (<>
          <h1 style={{ fontSize: 19, fontWeight: 800, color: TX, margin: '0 0 6px' }}>Reset your PIN</h1>
          <p style={{ fontSize: 13, color: TX3, margin: '0 0 20px', lineHeight: 1.4 }}>
            Enter the phone number on your account. We’ll send a 6-digit code over WhatsApp to verify it’s you.
          </p>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="phoneLocal" style={lbl}>Phone number</label>
            <div style={{ display: 'flex', gap: 5 }} dir="ltr">
              <select value={phoneCountry} onChange={e => setPhoneCountry(e.target.value)} aria-label="Country"
                style={{ ...inp, width: 80, flexShrink: 0, cursor: 'pointer', appearance: 'none' }}>
                {COUNTRY_DIAL.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                ))}
              </select>
              <input id="phoneLocal" value={phoneLocal} onChange={e => setPhoneLocal(e.target.value)}
                placeholder="712 345 678" type="tel" inputMode="tel" autoComplete="tel" autoFocus dir="ltr"
                style={{ ...inp, flex: 1 }} onKeyDown={e => e.key === 'Enter' && requestCode()} />
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#c0392b', margin: '0 0 12px' }}>{error}</p>}

          <button onClick={requestCode} disabled={loading || !phoneLocal.trim()} style={primaryBtn(loading || !phoneLocal.trim())}>
            {loading ? 'Sending…' : 'Send code via WhatsApp'}
          </button>

          <p style={{ fontSize: 13, color: TX3, textAlign: 'center', marginTop: 16 }}>
            <Link href="/signin" style={{ color: TX2, textDecoration: 'underline' }}>Back to sign in</Link>
          </p>
        </>)}

        {step === 'code' && (<>
          <h1 style={{ fontSize: 19, fontWeight: 800, color: TX, margin: '0 0 6px' }}>Check WhatsApp</h1>
          <p style={{ fontSize: 13, color: TX3, margin: '0 0 20px', lineHeight: 1.4 }}>
            If {e164} has an account, a 6-digit code just arrived on WhatsApp. It expires in 10 minutes.
          </p>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="code" style={lbl}>6-digit code</label>
            <input id="code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              type="text" inputMode="numeric" autoComplete="one-time-code" autoFocus dir="ltr" style={inpCode}
              onKeyDown={e => e.key === 'Enter' && confirmReset()} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="newPin" style={lbl}>New PIN</label>
            <input id="newPin" value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              type="password" inputMode="numeric" autoComplete="new-password" dir="ltr" style={inpCode}
              onKeyDown={e => e.key === 'Enter' && confirmReset()} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="newPinConfirm" style={lbl}>Confirm new PIN</label>
            <input id="newPinConfirm" value={newPinConfirm} onChange={e => setNewPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
              type="password" inputMode="numeric" autoComplete="new-password" dir="ltr" style={inpCode}
              onKeyDown={e => e.key === 'Enter' && confirmReset()} />
          </div>

          {error && <p style={{ fontSize: 13, color: '#c0392b', margin: '0 0 12px' }}>{error}</p>}

          <button onClick={confirmReset} disabled={loading || code.length !== 6 || newPin.length !== 4 || newPinConfirm.length !== 4}
            style={primaryBtn(loading || code.length !== 6 || newPin.length !== 4 || newPinConfirm.length !== 4)}>
            {loading ? 'Saving…' : 'Reset PIN'}
          </button>

          <p style={{ fontSize: 13, color: TX3, textAlign: 'center', marginTop: 16 }}>
            {cooldown > 0 ? (
              <>Didn’t get it? Resend in {cooldown}s</>
            ) : (
              <button onClick={requestCode} disabled={loading} style={{ background: 'none', border: 'none', padding: 0, color: ACC, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                Resend code
              </button>
            )}
            {' · '}
            <button onClick={() => { setStep('phone'); setError('') }} style={{ background: 'none', border: 'none', padding: 0, color: TX2, fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
              Wrong number?
            </button>
          </p>
        </>)}

        {step === 'done' && (<>
          <h1 style={{ fontSize: 19, fontWeight: 800, color: TX, margin: '0 0 6px' }}>PIN reset</h1>
          <p style={{ fontSize: 13, color: TX3, margin: '0 0 20px', lineHeight: 1.4 }}>
            Your PIN has been changed. Sign in with your new PIN.
          </p>
          <Link href="/signin" style={{ display: 'block', textAlign: 'center', ...primaryBtn(false), textDecoration: 'none', boxSizing: 'border-box' }}>
            Go to sign in
          </Link>
        </>)}
      </div>
    </div>
  )
}
