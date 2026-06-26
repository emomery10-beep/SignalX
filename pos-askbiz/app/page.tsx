'use client'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'

const ACC = '#d08a59'

const API = process.env.NEXT_PUBLIC_API_URL || ''

// Inline role routing so the login page has no external imports that could fail
function getLoginDest(role: string): string {
  if (!role) return '/sell'
  // Logistics template roles
  if (role === 'logistics-counter-clerk') return '/logistics/intake'
  if (role === 'branch_manager' || role === 'logistics-branch-manager') return '/logistics/dashboard'
  if (role === 'dispatcher' || role === 'logistics-dispatcher') return '/logistics/dispatch'
  if (role === 'handler' || role === 'driver' || role === 'logistics-handler' || role === 'logistics-driver') return '/logistics'
  // Sector hubs — template roles go directly to their sector page
  if (/^restaurant-/.test(role)) return '/restaurant'
  if (/^factory-/.test(role))    return '/factory'
  if (/^repair-/.test(role))     return '/repair'
  if (/^salon-/.test(role))      return '/salon'
  // Retail and legacy roles — by level
  const suffix = role.match(/^retail-(.+)$/)?.[1]
  if (suffix) {
    if (suffix.includes('manager') || suffix.includes('supervisor')) return '/dashboard'
    if (suffix.includes('inventory') || suffix.includes('inspector') || suffix.includes('quality')) return '/inventory'
    return '/sell'
  }
  // Legacy roles
  if (['manager', 'supervisor', 'repair', 'engineer'].includes(role)) return '/dashboard'
  if (role === 'inventory') return '/inventory'
  return '/sell'
}

function LoginPageContent() {
  const router = useRouter()
  const { tc } = useLang()
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
      if (!res.ok) { setError(data.error || tc('pos_login.err_email_unrecognised')); return }
      setStaffName(data.name)
      setStep('pin')
    } catch { setLoading(false); setError(tc('pos_login.err_network')) }
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
      if (!res.ok) { setError(data.error || tc('pos_login.err_pin_incorrect')); return }
      localStorage.setItem('pos_staff', JSON.stringify(data.staff))
      router.push(getLoginDest(data.staff.role))
    } catch { setLoading(false); setError(tc('pos_login.err_network')) }
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--pos-bg)' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: 'var(--pos-ink)' }}>AskBiz POS</div>
          <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 4 }}>{tc('pos_login.staff_login')}</div>
        </div>

        {step === 'email' ? (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--pos-ink)' }}>{tc('pos_login.email_label')}</div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 16 }}>{tc('pos_login.email_hint')}</div>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheckEmail()}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--pos-border)', fontSize: 16, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' as const, outline: 'none' }}
              autoComplete="email"
              inputMode="email"
              autoFocus
            />
            {error && <div className="pos-banner" role="alert" style={{ fontSize: 13, color: 'var(--pos-danger)', marginTop: 8 }}>{error}</div>}
            <button
              onClick={handleCheckEmail}
              disabled={loading || !email.trim()}
              className="pos-btn-primary"
              style={{ width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, background: ACC, color: 'var(--pos-surface)', fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : !email.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: !email.trim() ? 0.5 : 1 }}
            >
              {loading ? tc('pos_login.checking') : tc('pos_login.continue')}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--pos-ink)' }}>{tc('pos_login.greeting', { name: staffName })}</div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 16 }}>{tc('pos_login.pin_hint')}</div>
            <input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleVerifyPin()}
              maxLength={8}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--pos-border)', fontSize: 24, letterSpacing: 8, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' as const, outline: 'none', textAlign: 'center' }}
              autoFocus
            />
            {error && <div className="pos-banner" role="alert" style={{ fontSize: 13, color: 'var(--pos-danger)', marginTop: 8 }}>{error}</div>}
            <button
              onClick={handleVerifyPin}
              disabled={loading || !pin.trim()}
              className="pos-btn-primary"
              style={{ width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, background: ACC, color: 'var(--pos-surface)', fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : !pin.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: !pin.trim() ? 0.5 : 1 }}
            >
              {loading ? tc('pos_login.signing_in') : tc('pos_login.sign_in')}
            </button>
            <button
              onClick={() => { setStep('email'); setError(''); setPin('') }}
              style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 12, background: 'transparent', border: '1px solid var(--pos-border)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--pos-muted)' }}
            >
              {tc('pos_login.use_different_email')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const { tc } = useLang()
  return (
    <>
      <LanguageToggle />
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)', fontSize: 14 }}>{tc('pos_login.loading_login')}</div>}>
        <LoginPageContent />
      </Suspense>
    </>
  )
}
