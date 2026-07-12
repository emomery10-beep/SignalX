'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'
import { COUNTRY_DIAL, toE164 } from '@/lib/phone'
import { markPosSessionStarted } from '@/lib/pos-session'

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
  const [checkingSession, setCheckingSession] = useState(true)
  // Staff log in with phone (default, for low-literacy cashiers) or email.
  const [method, setMethod]           = useState<'phone' | 'email'>('phone')
  const [phoneCountry, setPhoneCountry] = useState('KE')
  const [phoneLocal, setPhoneLocal]     = useState('')

  // A returning staff member with a valid cached session skips the login
  // form entirely — no network call, so this works on a cold offline boot.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pos_staff')
      if (raw) {
        const s = JSON.parse(raw)
        if (s?.id && s?.owner_id && s?.role !== undefined) {
          router.replace(getLoginDest(s.role))
          return
        }
      }
    } catch {}
    setCheckingSession(false)
  }, [])

  // Resolve the login identifier body based on the chosen tab.
  // Returns null (with an error set) when the input is incomplete/invalid.
  const loginIdentifier = (): { email: string } | { phone: string; dial: string } | null => {
    if (method === 'email') {
      const trimmed = email.trim()
      if (!trimmed) return null
      return { email: trimmed }
    }
    const dial = COUNTRY_DIAL.find(c => c.code === phoneCountry)?.dial || '+254'
    // Client-side validity check only — the raw local digits + dial are sent
    // as-is so the server can match every plausible stored format (owners
    // enter staff phone numbers with no E.164 normalisation).
    if (!toE164(dial, phoneLocal)) { setError(tc('pos_login.err_invalid_phone')); return null }
    return { phone: phoneLocal, dial }
  }

  const handleCheckEmail = async () => {
    const id = loginIdentifier()
    if (!id) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_staff', ...id }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error || tc('pos_login.err_unrecognised')); return }
      setStaffName(data.name)
      setStep('pin')
    } catch { setLoading(false); setError(tc('pos_login.err_network')) }
  }

  const handleVerifyPin = async () => {
    if (!pin.trim()) return
    const id = loginIdentifier()
    if (!id) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/pos/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_pin', ...id, pin }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error || tc('pos_login.err_pin_incorrect')); return }
      localStorage.setItem('pos_staff', JSON.stringify(data.staff))
      markPosSessionStarted()
      router.push(getLoginDest(data.staff.role))
    } catch { setLoading(false); setError(tc('pos_login.err_network')) }
  }

  if (checkingSession) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)', fontSize: 14, background: 'var(--pos-bg)' }}>
      {tc('pos_login.loading_login')}
    </div>
  )

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
            {/* Method tabs — phone first for low-literacy cashiers */}
            <div style={{ position: 'relative', display: 'flex', background: 'var(--pos-bg)', borderRadius: 10, padding: 3, marginBottom: 16, border: '1px solid var(--pos-border)' }}>
              <div aria-hidden style={{ position: 'absolute', top: 3, bottom: 3, left: 3, width: 'calc(50% - 3px)', borderRadius: 8, background: 'var(--pos-surface)', boxShadow: '0 1px 4px rgba(0,0,0,.08)', transform: method === 'email' ? 'translateX(100%)' : 'translateX(0)', transition: 'transform .25s ease' }}/>
              {(['phone', 'email'] as const).map(m => (
                <button key={m} onClick={() => { setMethod(m); setError('') }}
                  style={{ position: 'relative', zIndex: 1, flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: 'transparent', color: method === m ? 'var(--pos-ink)' : 'var(--pos-muted)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {m === 'phone' ? tc('pos_login.method_phone') : tc('pos_login.method_email')}
                </button>
              ))}
            </div>

            {method === 'phone' ? (
              <>
                <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 16 }}>{tc('pos_login.phone_hint')}</div>
                <div style={{ display: 'flex', gap: 6 }} dir="ltr">
                  <select value={phoneCountry} onChange={e => { setPhoneCountry(e.target.value); setError('') }}
                    aria-label={tc('pos_login.method_phone')}
                    style={{ width: 92, flexShrink: 0, padding: '14px 8px', borderRadius: 12, border: '1.5px solid var(--pos-border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', cursor: 'pointer', appearance: 'none' }}>
                    {COUNTRY_DIAL.map(c => <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>)}
                  </select>
                  <input
                    type="tel" inputMode="tel" autoComplete="tel" autoFocus dir="ltr"
                    placeholder={tc('pos_login.phone_placeholder')}
                    value={phoneLocal}
                    onChange={e => { setPhoneLocal(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleCheckEmail()}
                    style={{ flex: 1, minWidth: 0, padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--pos-border)', fontSize: 16, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' as const }}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 16 }}>{tc('pos_login.email_hint')}</div>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleCheckEmail()}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--pos-border)', fontSize: 16, fontFamily: 'inherit', background: 'var(--pos-surface)', color: 'var(--pos-ink)', boxSizing: 'border-box' as const, outline: 'none' }}
                  autoComplete="email"
                  inputMode="email"
                  autoFocus
                />
              </>
            )}
            {error && <div className="pos-banner" role="alert" style={{ fontSize: 13, color: 'var(--pos-danger)', marginTop: 8 }}>{error}</div>}
            <button
              onClick={handleCheckEmail}
              disabled={loading || (method === 'email' ? !email.trim() : !phoneLocal.trim())}
              className="pos-btn-primary"
              style={{ width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, background: ACC, color: 'var(--pos-surface)', fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: (method === 'email' ? !email.trim() : !phoneLocal.trim()) ? 0.5 : 1 }}
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
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)', fontSize: 14 }}>{tc('pos_login.loading_login')}</div>}>
        <LoginPageContent />
      </Suspense>
    </>
  )
}
