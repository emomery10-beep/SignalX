'use client'

import { useState } from 'react'

interface StripeSetupCardProps {
  staff: { owner_id: string; email: string; name?: string }
  onConfigLoaded?: (cfg: any) => void
}

const STRIPE_COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'PT', name: 'Portugal' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CA', name: 'Canada' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'JP', name: 'Japan' },
  { code: 'MY', name: 'Malaysia' },
]

export function StripeSetupCard({ staff, onConfigLoaded }: StripeSetupCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [country, setCountry] = useState('GB')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    fontSize: '13px',
    border: '1px solid var(--b)',
    borderRadius: '9px',
    backgroundColor: 'var(--sf)',
    boxSizing: 'border-box',
    color: 'var(--tx)',
    outline: 'none',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName || !country) { setError('Please fill in all fields'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/pos/payment/setup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          business_name: businessName,
          contact_email: staff.email,
          add_provider: 'stripe',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to connect Stripe')
        return
      }

      setSuccess(true)
      onConfigLoaded?.({ ...data, stripe_active: true, paystack_active: true })

      // Redirect to Stripe onboarding after short delay
      if (data.onboarding_url) {
        setTimeout(() => {
          window.location.href = data.onboarding_url
        }, 1200)
      } else {
        setTimeout(() => setShowModal(false), 1200)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Dashed "add" widget */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '9px 14px 9px 10px',
          background: 'var(--sf)',
          border: '1.5px dashed var(--b)',
          borderRadius: 12, cursor: 'pointer',
          width: 'fit-content',
          transition: 'border-color 150ms',
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'rgba(99,91,255,.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        }}>
          💜
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', whiteSpace: 'nowrap' }}>
            + Connect Stripe
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 1, whiteSpace: 'nowrap' }}>
            Apple Pay · Google Pay · International cards
          </div>
        </div>
      </div>

      {/* Stripe setup modal */}
      {showModal && (
        <div
          onClick={() => !loading && setShowModal(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--sf)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, border: '1px solid var(--b)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99,91,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💜</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>Connect Stripe</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>Apple Pay · Google Pay · International cards</div>
              </div>
            </div>

            {error && (
              <div style={{ padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: 9, border: '1px solid #fecaca', marginBottom: 14, color: '#991b1b', fontSize: 12 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '8px 12px', backgroundColor: '#ede9fe', borderRadius: 9, border: '1px solid #ddd6fe', marginBottom: 14, color: '#5b21b6', fontSize: 12 }}>
                Stripe connected! Opening Stripe onboarding...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  Business Country <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  disabled={loading}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {STRIPE_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  Business Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  disabled={loading}
                  placeholder="Your business name"
                  style={inputStyle}
                />
              </div>

              <div style={{ padding: '8px 12px', background: 'rgba(99,91,255,.06)', borderRadius: 9, marginBottom: 16, fontSize: 11, color: '#5b21b6', lineHeight: 1.5 }}>
                You'll be redirected to Stripe to complete identity verification (KYC). Once approved, Apple Pay, Google Pay and international cards will be enabled.
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={!businessName || loading}
                  style={{
                    flex: 1, padding: 11, borderRadius: 10, border: 'none',
                    background: !businessName || loading ? 'var(--b2, #d1d5db)' : '#635bff',
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: !businessName || loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Connecting...' : 'Continue to Stripe →'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  style={{ padding: '11px 18px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
