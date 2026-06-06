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
  const [showInstructions, setShowInstructions] = useState(false)

  const selectedCountryData = COUNTRY_OPTIONS.find(c => c.code === selectedCountry)
  const provider = selectedCountryData?.provider || 'none'

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
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '12px', marginBottom: '12px' }}>
      <h2 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
        💳 Payment Setup
      </h2>

      {currentConfig?.is_active ? (
        <div style={{ padding: '6px 8px', backgroundColor: '#d1fae5', borderRadius: '4px', border: '1px solid #a7f3d0', marginBottom: '8px', fontSize: '12px', color: '#065f46' }}>
          <strong>✓ Active:</strong> {currentConfig.payment_provider === 'paystack' ? 'Paystack' : 'Stripe'} for {currentConfig.country}
          {currentConfig.payment_provider === 'stripe' && !currentConfig.stripe_onboarding_complete && ' (⚠️ Complete onboarding)'}
        </div>
      ) : null}

      {error && (
        <div style={{ padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', border: '1px solid #fecaca', marginBottom: '8px', color: '#991b1b', fontSize: '12px' }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '4px 8px', backgroundColor: '#d4edda', borderRadius: '4px', border: '1px solid #c3e6cb', marginBottom: '8px', color: '#155724', fontSize: '12px' }}>
          ✓ {provider === 'stripe' ? 'Redirecting to Stripe onboarding...' : 'Payment setup successful!'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>
            Country <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              color: '#374151',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select country</option>
            {COUNTRY_OPTIONS.map(country => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.provider === 'paystack' ? 'Paystack' : 'Stripe'})
              </option>
            ))}
          </select>
        </div>

        {selectedCountry && (
          <div style={{ padding: '6px 8px', backgroundColor: provider === 'paystack' ? '#fef3c7' : '#dbeafe', borderRadius: '4px', marginBottom: '8px', fontSize: '11px', color: provider === 'paystack' ? '#78350f' : '#1e40af' }}>
            {provider === 'paystack'
              ? '✓ M-Pesa & card payments'
              : '✓ Card payments (KYC verification required)'}
          </div>
        )}

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>
            Business Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            disabled={loading}
            placeholder="Business name"
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
              color: '#374151',
            }}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>
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
              padding: '6px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
              color: '#374151',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={loading || !selectedCountry || !businessName}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: loading || !selectedCountry || !businessName ? '#d1d5db' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: loading || !selectedCountry || !businessName ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Setting up...' : 'Setup'}
          </button>
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {showInstructions ? '▼ Hide' : '▶ Help'}
          </button>
        </div>
      </form>

      {showInstructions && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e5e7eb', fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
          {provider === 'paystack' ? (
            <div>
              <div style={{ marginBottom: '8px' }}><strong style={{ color: '#374151' }}>1.</strong> Fill in details</div>
              <div style={{ marginBottom: '8px' }}><strong style={{ color: '#374151' }}>2.</strong> Click "Setup"</div>
              <div style={{ marginBottom: '8px' }}><strong style={{ color: '#374151' }}>3.</strong> M-Pesa & cards enabled immediately</div>
              <div style={{ padding: '6px 8px', backgroundColor: '#fef3c7', borderRadius: '3px', marginTop: '6px', color: '#92400e' }}>
                💡 Fee: 1.5% (Paystack) + 2% (AskBiz) = 3.5% total
              </div>
            </div>
          ) : provider === 'stripe' ? (
            <div>
              <div style={{ marginBottom: '8px' }}><strong style={{ color: '#374151' }}>1.</strong> Fill in details</div>
              <div style={{ marginBottom: '8px' }}><strong style={{ color: '#374151' }}>2.</strong> Click "Setup"</div>
              <div style={{ marginBottom: '8px' }}><strong style={{ color: '#374151' }}>3.</strong> Complete KYC verification</div>
              <div style={{ marginBottom: '8px' }}><strong style={{ color: '#374151' }}>4.</strong> Payments enabled automatically</div>
              <div style={{ padding: '6px 8px', backgroundColor: '#dbeafe', borderRadius: '3px', marginTop: '6px', color: '#1e40af' }}>
                💡 Fee: ~2.9% (Stripe) + 2% (AskBiz) = ~4.9% total
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: '#6b7280' }}>👆 Select country above</div>
          )}
        </div>
      )}
    </div>
  )
}
