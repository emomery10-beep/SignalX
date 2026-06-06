'use client'

import { useState, useEffect } from 'react'

interface PaymentSetupCardProps {
  staff: any
}

const COUNTRY_OPTIONS = [
  { code: 'KE', name: 'Kenya', provider: 'paystack' },
  { code: 'NG', name: 'Nigeria', provider: 'paystack' },
  { code: 'GH', name: 'Ghana', provider: 'paystack' },
  { code: 'UG', name: 'Uganda', provider: 'paystack' },
  { code: 'TZ', name: 'Tanzania', provider: 'paystack' },
  { code: 'RW', name: 'Rwanda', provider: 'paystack' },
  { code: 'ZA', name: 'South Africa', provider: 'paystack' },
  { code: 'GB', name: 'United Kingdom', provider: 'stripe' },
  { code: 'US', name: 'United States', provider: 'stripe' },
  { code: 'IE', name: 'Ireland', provider: 'stripe' },
  { code: 'DE', name: 'Germany', provider: 'stripe' },
  { code: 'FR', name: 'France', provider: 'stripe' },
  { code: 'NL', name: 'Netherlands', provider: 'stripe' },
  { code: 'BE', name: 'Belgium', provider: 'stripe' },
  { code: 'AT', name: 'Austria', provider: 'stripe' },
  { code: 'SE', name: 'Sweden', provider: 'stripe' },
  { code: 'NO', name: 'Norway', provider: 'stripe' },
  { code: 'DK', name: 'Denmark', provider: 'stripe' },
  { code: 'FI', name: 'Finland', provider: 'stripe' },
  { code: 'ES', name: 'Spain', provider: 'stripe' },
  { code: 'IT', name: 'Italy', provider: 'stripe' },
  { code: 'PT', name: 'Portugal', provider: 'stripe' },
  { code: 'CZ', name: 'Czech Republic', provider: 'stripe' },
  { code: 'PL', name: 'Poland', provider: 'stripe' },
  { code: 'AU', name: 'Australia', provider: 'stripe' },
  { code: 'NZ', name: 'New Zealand', provider: 'stripe' },
  { code: 'CA', name: 'Canada', provider: 'stripe' },
  { code: 'SG', name: 'Singapore', provider: 'stripe' },
  { code: 'HK', name: 'Hong Kong', provider: 'stripe' },
  { code: 'JP', name: 'Japan', provider: 'stripe' },
  { code: 'MY', name: 'Malaysia', provider: 'stripe' },
]

export function PaymentSetupCard({ staff }: PaymentSetupCardProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [businessName, setBusinessName] = useState<string>('')
  const [contactPhone, setContactPhone] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const [loadingConfig, setLoadingConfig] = useState(true)

  const selectedCountryData = COUNTRY_OPTIONS.find(c => c.code === selectedCountry)
  const provider = selectedCountryData?.provider || 'none'

  useEffect(() => {
    loadPaymentConfig()
  }, [])

  const loadPaymentConfig = async () => {
    if (!staff?.owner_id) return

    try {
      const response = await fetch('/api/pos/payment/config', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentConfig(data)
        if (data.country) {
          setSelectedCountry(data.country)
        }
      }
    } catch (err) {
      console.error('Failed to load payment config:', err)
    } finally {
      setLoadingConfig(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCountry || !businessName || !staff?.email) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/pos/payment/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          business_name: businessName,
          contact_email: staff.email,
          contact_phone: contactPhone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to set up payment provider')
        return
      }

      setSuccess(true)
      setCurrentConfig(data)

      if (provider === 'stripe' && data.onboarding_url) {
        setTimeout(() => {
          window.location.href = data.onboarding_url
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        💳 Payment Setup
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Set up card payments through Paystack (Africa) or Stripe (International)
      </p>

      {loadingConfig ? (
        <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '4px', color: '#78350f', fontSize: '14px' }}>
          Loading payment configuration...
        </div>
      ) : currentConfig?.is_active ? (
        <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '4px', border: '1px solid #a7f3d0', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#065f46' }}>
            <strong>✓ Payment Setup Active</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
              Provider: <strong>{currentConfig.payment_provider === 'paystack' ? 'Paystack (M-Pesa & Cards)' : 'Stripe Connect'}</strong> for {currentConfig.country}
            </p>
            {currentConfig.payment_provider === 'stripe' && !currentConfig.stripe_onboarding_complete && (
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#d97706' }}>
                ⚠️ Please complete Stripe onboarding to start accepting payments
              </p>
            )}
          </div>
        </div>
      ) : null}

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fee2e2', borderRadius: '4px', border: '1px solid #fecaca', marginBottom: '16px', color: '#991b1b', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '12px 16px', backgroundColor: '#d4edda', borderRadius: '4px', border: '1px solid #c3e6cb', marginBottom: '16px', color: '#155724', fontSize: '14px' }}>
          ✓ Payment setup successful! {provider === 'stripe' ? 'Redirecting to Stripe onboarding...' : 'You can now accept payments.'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Country <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            <option value="">Select your country</option>
            {COUNTRY_OPTIONS.map(country => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.provider === 'paystack' ? 'Paystack' : 'Stripe'})
              </option>
            ))}
          </select>
        </div>

        {selectedCountry && (
          <div style={{ padding: '12px', backgroundColor: provider === 'paystack' ? '#fef3c7' : '#dbeafe', borderRadius: '4px', marginBottom: '16px', fontSize: '13px', color: provider === 'paystack' ? '#78350f' : '#1e40af' }}>
            {provider === 'paystack'
              ? '✓ This country uses Paystack. Customers can pay via M-Pesa or card.'
              : '✓ This country uses Stripe Connect. You\'ll complete KYC verification and then accept card payments.'}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Business Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            disabled={loading}
            placeholder="Your business name"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
              color: '#374151',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Contact Phone
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            disabled={loading}
            placeholder="+254712345678"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
              color: '#374151',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedCountry || !businessName}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: loading || !selectedCountry || !businessName ? '#d1d5db' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading || !selectedCountry || !businessName ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {loading ? 'Setting up...' : 'Set Up Payment Method'}
        </button>
      </form>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '4px', marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#374151' }}>How it works:</p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Select your country to automatically set up the right payment provider</li>
          <li>Paystack: Accept M-Pesa and card payments in Africa (instant setup)</li>
          <li>Stripe: Accept card payments internationally (requires KYC verification)</li>
          <li>We take a 2% platform fee on all transactions</li>
        </ul>
      </div>
    </div>
  )
}
