'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ACC = '#d08a59'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contact, setContact]     = useState('')
  const [step, setStep]           = useState<'contact' | 'waiting'>('contact')
  const [staffName, setStaffName] = useState('')
  const [method, setMethod]       = useState<'email'>('email')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [verifying, setVerifying] = useState(false)

  const isEmail = contact.includes('@')

  // Handle magic link callback on mount
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      verifyMagicLink(token)
    }
  }, [searchParams])

  const verifyMagicLink = async (token: string) => {
    setVerifying(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Invalid or expired link')
        setVerifying(false)
        return
      }
      localStorage.setItem('pos_staff', JSON.stringify(data.staff))
      router.push(data.staff.role === 'inventory' ? '/inventory' : '/sell')
    } catch (e) {
      setError('Network error — please try again')
      setVerifying(false)
    }
  }

  const handleSendMagicLink = async () => {
    if (!contact.trim()) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          email: contact.trim(),
        }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error || 'Failed to send link'); return }
      setStaffName(data.name)
      setMethod('email')
      setStep('waiting')
    } catch { setLoading(false); setError('Network error — please try again') }
  }

  if (verifying) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f9f8f6' }}>
        <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: '#1a1916', marginBottom: 12 }}>Signing you in...</div>
          {error && <div style={{ fontSize: 13, color: '#dc2626', marginTop: 16 }}>{error}</div>}
        </div>
      </div>
    )
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

        {step === 'contact' ? (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#1a1916' }}>Email address</div>
            <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 16 }}>
              We'll send you a login link to verify it's you.
            </div>
            <input
              type="email"
              placeholder="you@email.com"
              value={contact}
              onChange={e => setContact(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMagicLink()}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e5e2dc', fontSize: 16, fontFamily: 'inherit', background: '#fff', color: '#1a1916', boxSizing: 'border-box' as const, outline: 'none' }}
              autoComplete="email"
              inputMode="email"
              autoFocus
            />
            {error && <div style={{ fontSize: 13, color: '#dc2626', marginTop: 8 }}>{error}</div>}
            <button
              onClick={handleSendMagicLink}
              disabled={loading || !contact.trim()}
              style={{ width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: !contact.trim() ? 0.5 : 1 }}
            >
              {loading ? 'Sending...' : 'Send login link →'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#1a1916' }}>Hi {staffName} 👋</div>
            <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 16 }}>
              Check your email for a login link — it's valid for 15 minutes.
            </div>
            <div style={{ padding: '16px', background: '#f4f3f1', borderRadius: 12, marginBottom: 16, textAlign: 'center' as const }}>
              <div style={{ fontSize: 12, color: '#6b6760', marginBottom: 8 }}>Waiting for you to click the link in your email...</div>
              <div style={{ fontSize: 11, color: '#a39e97' }}>This page will refresh automatically</div>
            </div>
            <button
              onClick={() => { setStep('contact'); setError(''); setContact('') }}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'transparent', border: '1px solid #e5e2dc', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', color: '#6b6760' }}
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
