'use client'
import { useState, useEffect } from 'react'
import type { PosStaffIdentifier } from '@/lib/pos-staff-lock'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const ACC = '#d08a59'

const DEFAULTS: Record<string, string> = {
  lock_title: 'Session locked',
  lock_subtitle: 'For your security, re-enter your PIN to continue.',
  enter_pin: 'Enter your PIN',
  unlock_btn: 'Unlock',
  verifying: 'Verifying...',
  not_you_sign_out: 'Not you? Sign out',
}

export default function PosStaffLockScreen({
  staffName,
  identifier,
  onUnlock,
  onSignOut,
  t,
}: {
  staffName: string
  identifier: PosStaffIdentifier | null
  onUnlock: () => void
  onSignOut: () => void
  t?: (key: string) => string
}) {
  const tr = (key: string) => t?.(key) || DEFAULTS[key]
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // A session with no stored identifier predates this feature — there's
  // nothing to silently re-verify against, so fall back to a full sign-out.
  // Deferred to an effect: calling onSignOut (which triggers parent setState/
  // navigation) directly during render is not allowed by React.
  useEffect(() => {
    if (!identifier) onSignOut()
  }, [identifier])

  if (!identifier) return null

  const submit = async () => {
    if (!pin || loading) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', ...identifier, pin }),
      })
      const data = await res.json()
      if (!res.ok || !data.verified) { setError(data.error || 'Incorrect PIN'); setLoading(false); return }
      onUnlock()
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(26,25,22,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: 'min(360px, 100%)', background: '#fff', borderRadius: 16, padding: 28, textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fdf1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>
          🔒
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{tr('lock_title')}</div>
        <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 20 }}>
          {staffName ? `${staffName} — ` : ''}{tr('lock_subtitle')}
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 8)); setError('') }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={tr('enter_pin')}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${error ? '#e8b4ae' : '#e5e2dc'}`, fontSize: 20, letterSpacing: 6, textAlign: 'center', marginBottom: 12, boxSizing: 'border-box' }}
        />
        {error && <div style={{ fontSize: 12, color: '#b3261e', marginBottom: 12 }}>{error}</div>}
        <button
          onClick={submit}
          disabled={loading || !pin}
          style={{
            width: '100%', padding: 12, borderRadius: 10, border: 'none',
            background: ACC, color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: loading || !pin ? 'default' : 'pointer', opacity: loading || !pin ? 0.6 : 1, marginBottom: 14,
          }}
        >
          {loading ? tr('verifying') : tr('unlock_btn')}
        </button>
        <button onClick={onSignOut} style={{ background: 'none', border: 'none', color: '#6b6760', fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>
          {tr('not_you_sign_out')}
        </button>
      </div>
    </div>
  )
}
