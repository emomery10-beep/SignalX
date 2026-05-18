'use client'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#d08a59'

const API = process.env.NEXT_PUBLIC_API_URL || ''

function LoginPageContent() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [pin, setPin]           = useState('')
  const [step, setStep]         = useState<'email' | 'pin'>('email')
  const [staffName, setStaffName] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleCheckEmail = async () => {
    if (!email.trim()) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_staff', email: email.trim() }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error || 'Email not recognised'); return }
      setStaffName(data.name)
      setStep('pin')
    } catch { setLoading(false); setError('Network error — please try again') }
  }

  const handleVerifyPin = async () => {
    if (!pin.trim()) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', email: email.trim(), pin }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error || 'Incorrect PIN'); return }
      localStorage.setItem('pos_staff', JSON.stringify(data.staff))
      const role = data.staff.role
      const dest = role === 'inventory'
        ? '/inventory'
        : ['engineer', 'repair', 'supervisor', 'manager'].includes(role)
          ? '/dashboard'
          : '/sell'
      router.push(dest)
    } catch { setLoading(false); setError('Network error — please try again') }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f9f8f6' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: '#1a1916' }}>AskBiz POS</div>
          <div style={{ fontSize: 13, color: '#6b6760', marginTop: 4 }}>Staff login</div>
        </div>

        {step === 'email' ? (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#1a1916' }}>Email address</div>
            <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 16 }}>Enter your work email to continue.</div>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheckEmail()}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 16, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' as const, outline: 'none' }}
              autoComplete="email"
              inputMode="email"
              autoFocus
            />
            {error && <div style={{ fontSize: 13, color: '#dc2626', marginTop: 8 }}>{error}</div>}
            <button
              onClick={handleCheckEmail}
              disabled={loading || !email.trim()}
              style={{ width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: !email.trim() ? 0.5 : 1 }}
            >
              {loading ? 'Checking...' : 'Continue →'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#1a1916' }}>Hi {staffName} 👋</div>
            <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 16 }}>Enter your PIN to sign in.</div>
            <input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleVerifyPin()}
              maxLength={8}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 24, letterSpacing: 8, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' as const, outline: 'none', textAlign: 'center' }}
              autoFocus
            />
            {error && <div style={{ fontSize: 13, color: '#dc2626', marginTop: 8 }}>{error}</div>}
            <button
              onClick={handleVerifyPin}
              disabled={loading || !pin.trim()}
              style={{ width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: !pin.trim() ? 0.5 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
            <button
              onClick={() => { setStep('email'); setError(''); setPin('') }}
              style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 12, background: 'transparent', border: '1px solid #e5e2dc', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', color: '#6b6760' }}
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
