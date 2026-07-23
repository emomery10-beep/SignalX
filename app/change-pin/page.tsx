'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
  fontFamily: 'inherit', fontSize: 17, fontWeight: 700, textAlign: 'center',
  letterSpacing: '.4em', outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
  color: TX2, marginBottom: 4,
}

// Landed here because an admin reset the user's PIN to a temporary value
// (app/api/admin/route.ts action=reset_pin) — profiles.must_change_pin is
// true, and app/(app)/layout.tsx redirects here until a real PIN is set.
export default function ChangePinPage() {
  const router = useRouter()
  const supabase = createClient()
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    if (pin.length !== 4) { setError('Enter a 4-digit PIN.'); return }
    if (pin !== pinConfirm) { setError('PINs don’t match.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return }

      // Refresh the client session so it reflects the new password immediately.
      await supabase.auth.refreshSession()
      router.push('/home')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      fontFamily: 'var(--font-dm, DM Sans, sans-serif)',
    }}>
      <div style={{
        width: '100%', maxWidth: 360, background: '#fff', borderRadius: 16,
        border: `1px solid ${B2}`, padding: 28,
      }}>
        <h1 style={{ fontSize: 19, fontWeight: 800, color: TX, margin: '0 0 6px' }}>
          Set a new PIN
        </h1>
        <p style={{ fontSize: 13, color: TX3, margin: '0 0 20px', lineHeight: 1.4 }}>
          Your PIN was reset by an admin. Choose a new 4-digit PIN to continue — you’ll use it to sign in from now on.
        </p>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="newPin" style={lbl}>New PIN</label>
          <input id="newPin" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            type="password" inputMode="numeric" autoComplete="new-password" autoFocus dir="ltr" style={inp}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="confirmPin" style={lbl}>Confirm PIN</label>
          <input id="confirmPin" value={pinConfirm} onChange={e => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
            type="password" inputMode="numeric" autoComplete="new-password" dir="ltr" style={inp}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {error && <p style={{ fontSize: 13, color: '#c0392b', margin: '0 0 12px' }}>{error}</p>}

        <button onClick={submit} disabled={loading || pin.length !== 4 || pinConfirm.length !== 4} style={{
          width: '100%', padding: '11px 0', borderRadius: 8, border: 'none',
          background: ACC, color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
          cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {loading ? 'Saving…' : 'Save PIN'}
        </button>
      </div>
    </div>
  )
}
