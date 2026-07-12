'use client'

import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface StripeSetupCardProps {
  staff: { owner_id: string; email: string; name?: string }
  onConfigLoaded?: (cfg: any) => void
}

function buildStripeCountries(tc: (key: string) => string) {
  return [
    { code: 'GB', name: tc('stripe_setupcard.countryGB') },
    { code: 'US', name: tc('stripe_setupcard.countryUS') },
    { code: 'IE', name: tc('stripe_setupcard.countryIE') },
    { code: 'DE', name: tc('stripe_setupcard.countryDE') },
    { code: 'FR', name: tc('stripe_setupcard.countryFR') },
    { code: 'NL', name: tc('stripe_setupcard.countryNL') },
    { code: 'BE', name: tc('stripe_setupcard.countryBE') },
    { code: 'AT', name: tc('stripe_setupcard.countryAT') },
    { code: 'SE', name: tc('stripe_setupcard.countrySE') },
    { code: 'NO', name: tc('stripe_setupcard.countryNO') },
    { code: 'DK', name: tc('stripe_setupcard.countryDK') },
    { code: 'FI', name: tc('stripe_setupcard.countryFI') },
    { code: 'ES', name: tc('stripe_setupcard.countryES') },
    { code: 'IT', name: tc('stripe_setupcard.countryIT') },
    { code: 'PT', name: tc('stripe_setupcard.countryPT') },
    { code: 'AU', name: tc('stripe_setupcard.countryAU') },
    { code: 'NZ', name: tc('stripe_setupcard.countryNZ') },
    { code: 'CA', name: tc('stripe_setupcard.countryCA') },
    { code: 'SG', name: tc('stripe_setupcard.countrySG') },
    { code: 'HK', name: tc('stripe_setupcard.countryHK') },
    { code: 'JP', name: tc('stripe_setupcard.countryJP') },
    { code: 'MY', name: tc('stripe_setupcard.countryMY') },
  ]
}

export function StripeSetupCard({ staff, onConfigLoaded }: StripeSetupCardProps) {
  const { tc } = useLang()
  const [showModal, setShowModal] = useState(false)
  const [country, setCountry] = useState('GB')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const STRIPE_COUNTRIES = buildStripeCountries(tc)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    fontSize: '11px',
    border: '1px solid var(--b)',
    borderRadius: '9px',
    backgroundColor: 'var(--sf)',
    boxSizing: 'border-box',
    color: 'var(--tx)',
    outline: 'none',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName || !country) { setError(tc('stripe_setupcard.errorFillFields')); return }

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
        setError(data.error || tc('stripe_setupcard.errorFailedConnect'))
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
      setError(err.message || tc('stripe_setupcard.errorGeneric'))
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>
          💜
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', whiteSpace: 'nowrap' }}>
            {tc('stripe_setupcard.connectStripeButton')}
          </div>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1, whiteSpace: 'nowrap' }}>
            {tc('stripe_setupcard.paymentMethods')}
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
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99,91,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💜</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{tc('stripe_setupcard.connectStripeTitle')}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{tc('stripe_setupcard.paymentMethods')}</div>
              </div>
            </div>

            {error && (
              <div style={{ padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: 9, border: '1px solid #fecaca', marginBottom: 14, color: '#991b1b', fontSize: 10 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '8px 12px', backgroundColor: '#ede9fe', borderRadius: 9, border: '1px solid #ddd6fe', marginBottom: 14, color: '#5b21b6', fontSize: 10 }}>
                {tc('stripe_setupcard.successMessage')}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  {tc('stripe_setupcard.businessCountryLabel')} <span style={{ color: '#ef4444' }}>*</span>
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
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  {tc('stripe_setupcard.businessNameLabel')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  disabled={loading}
                  placeholder={tc('stripe_setupcard.businessNamePlaceholder')}
                  style={inputStyle}
                />
              </div>

              <div style={{ padding: '8px 12px', background: 'rgba(99,91,255,.06)', borderRadius: 9, marginBottom: 16, fontSize: 9, color: '#5b21b6', lineHeight: 1.5 }}>
                {tc('stripe_setupcard.kycDisclaimer')}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={!businessName || loading}
                  style={{
                    flex: 1, padding: 11, borderRadius: 10, border: 'none',
                    background: !businessName || loading ? 'var(--b2, #d1d5db)' : '#635bff',
                    color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: !businessName || loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? tc('stripe_setupcard.buttonConnecting') : tc('stripe_setupcard.buttonContinue')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  style={{ padding: '11px 18px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                >
                  {tc('stripe_setupcard.buttonCancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
