'use client'

import { useState, useEffect } from 'react'

interface PaymentSetupCardProps {
  staff: any
}

const COUNTRY_OPTIONS = [
  { code: 'KE', name: 'Kenya', provider: 'paystack', currency: 'KES', hasMpesa: true },
  { code: 'NG', name: 'Nigeria', provider: 'paystack', currency: 'NGN', hasMpesa: false },
  { code: 'GH', name: 'Ghana', provider: 'paystack', currency: 'GHS', hasMpesa: false },
  { code: 'UG', name: 'Uganda', provider: 'paystack', currency: 'UGX', hasMpesa: true },
  { code: 'TZ', name: 'Tanzania', provider: 'paystack', currency: 'TZS', hasMpesa: true },
  { code: 'RW', name: 'Rwanda', provider: 'paystack', currency: 'RWF', hasMpesa: true },
  { code: 'ZA', name: 'South Africa', provider: 'paystack', currency: 'ZAR', hasMpesa: false },
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

interface Bank {
  name: string
  code: string
  type: string
  currency: string
}

export function PaymentSetupCard({ staff, onConfigLoaded }: PaymentSetupCardProps & { onConfigLoaded?: (cfg: any) => void }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [businessName, setBusinessName] = useState<string>('')
  const [contactPhone, setContactPhone] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const [configLoading, setConfigLoading] = useState(true)

  // Paystack-specific fields
  const [banks, setBanks] = useState<Bank[]>([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [settlementType, setSettlementType] = useState<'mpesa' | 'bank'>('mpesa')
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [accountNumber, setAccountNumber] = useState<string>('')
  const [mpesaPhone, setMpesaPhone] = useState<string>('')

  const selectedCountryData = COUNTRY_OPTIONS.find(c => c.code === selectedCountry) as any
  const provider = selectedCountryData?.provider || 'none'
  const hasMpesa = selectedCountryData?.hasMpesa || false

  // Load existing config on mount
  useEffect(() => {
    if (!staff?.owner_id) return
    fetch('/api/pos/payment/setup', {
      credentials: 'include',
      headers: { 'x-owner-id': staff.owner_id },
    })
      .then(r => r.json())
      .then(data => { if (data.configured) { setCurrentConfig(data); onConfigLoaded?.(data) } })
      .catch(() => {})
      .finally(() => setConfigLoading(false))
  }, [staff?.owner_id])

  // Fetch banks when a Paystack country is selected
  useEffect(() => {
    if (provider !== 'paystack' || !selectedCountry) {
      setBanks([])
      return
    }

    setBanksLoading(true)
    fetch(`/api/pos/payment/banks?country=${selectedCountry}`)
      .then(res => res.json())
      .then(data => {
        setBanks(data.banks || [])
        // Default to M-Pesa for countries that support it
        if (hasMpesa) {
          setSettlementType('mpesa')
        } else {
          setSettlementType('bank')
        }
      })
      .catch(() => setBanks([]))
      .finally(() => setBanksLoading(false))
  }, [selectedCountry, provider, hasMpesa])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCountry || !businessName || !staff?.email) {
      setError(!staff?.email ? 'Account email not found. Please update your profile.' : 'Please fill in all required fields')
      return
    }

    // Validate Paystack-specific fields
    if (provider === 'paystack') {
      if (settlementType === 'mpesa' && !mpesaPhone) {
        setError('Please enter your M-Pesa phone number')
        return
      }
      if (settlementType === 'bank' && (!selectedBank || !accountNumber)) {
        setError('Please select a bank and enter your account number')
        return
      }
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Build the request body
      const body: any = {
        country: selectedCountry,
        business_name: businessName,
        contact_email: staff.email,
        contact_phone: contactPhone || mpesaPhone,
      }

      // Add Paystack settlement details
      if (provider === 'paystack') {
        if (settlementType === 'mpesa') {
          // For M-Pesa, find the M-Pesa bank code from the banks list
          const mpesaBank = banks.find(b =>
            b.name.toLowerCase().includes('m-pesa') ||
            b.name.toLowerCase().includes('mpesa') ||
            b.name.toLowerCase().includes('safaricom') ||
            b.type === 'mobile_money'
          )
          body.settlement_bank = mpesaBank?.code || ''
          body.account_number = mpesaPhone.replace(/^\+/, '') // strip leading +
        } else {
          body.settlement_bank = selectedBank
          body.account_number = accountNumber
        }

        body.settlement_account = {
          type: settlementType,
          phone: mpesaPhone,
          bank_code: selectedBank,
          account: accountNumber,
        }
      }

      const response = await fetch('/api/pos/payment/setup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to set up payment provider')
        return
      }

      setSuccess(true)
      setCurrentConfig(data)
      onConfigLoaded?.(data)

      if (provider === 'stripe' && data.onboarding_url) {
        setTimeout(() => {
          window.location.href = data.onboarding_url
        }, 1500)
      } else {
        setTimeout(() => setShowModal(false), 1500)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const statusLabel = currentConfig?.is_active
    ? currentConfig.payment_provider === 'stripe' && !currentConfig.stripe_onboarding_complete
      ? 'Pending KYC'
      : 'Active'
    : currentConfig?.configured === false
      ? null
      : null

  const providerLabel = currentConfig?.payment_provider === 'paystack'
    ? 'Paystack'
    : currentConfig?.payment_provider === 'stripe'
      ? 'Stripe'
      : null

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

  const canSubmit = selectedCountry && businessName && !loading && (
    provider === 'stripe' ||
    (provider === 'paystack' && (
      (settlementType === 'mpesa' && mpesaPhone) ||
      (settlementType === 'bank' && selectedBank && accountNumber)
    ))
  )

  return (
    <>
      {/* ── Compact auto-width widget ── */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '9px 14px 9px 10px',
          background: statusLabel === 'Active' ? 'rgba(16,185,129,.06)' : 'var(--sf)',
          border: `1.5px solid ${statusLabel === 'Active' ? 'rgba(16,185,129,.3)' : 'var(--b)'}`,
          borderRadius: 12, cursor: 'pointer', transition: 'border-color 150ms',
          width: 'fit-content',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: statusLabel === 'Active' ? 'rgba(16,185,129,.15)' : 'rgba(99,91,255,.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        }}>
          💳
        </div>

        {/* Text */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
            {statusLabel === 'Active' ? providerLabel : 'Payment Setup'}
            {statusLabel === 'Active' && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 1, whiteSpace: 'nowrap' }}>
            {statusLabel === 'Active'
              ? `${currentConfig?.country || ''} · Card & mobile payments active`
              : statusLabel === 'Pending KYC'
                ? 'Stripe verification pending'
                : 'Connect Stripe or Paystack'}
          </div>
        </div>

        {/* Right badge / button */}
        {configLoading ? (
          <span style={{ fontSize: 11, color: 'var(--tx3)', flexShrink: 0 }}>…</span>
        ) : statusLabel ? (
          <span style={{
            fontSize: 11, fontWeight: 600, borderRadius: 9999,
            padding: '3px 10px', flexShrink: 0, whiteSpace: 'nowrap',
            background: statusLabel === 'Active' ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.1)',
            color: statusLabel === 'Active' ? '#059669' : '#d97706',
          }}>
            {statusLabel === 'Active' ? '● Active' : statusLabel}
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowModal(true) }}
            style={{
              padding: '6px 14px', borderRadius: 9999, border: 'none',
              background: '#635bff', color: '#fff',
              fontSize: 12, fontWeight: 600, flexShrink: 0,
              whiteSpace: 'nowrap', cursor: 'pointer',
            }}
          >
            Set Up
          </button>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          onClick={() => !loading && setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--sf)', borderRadius: 20, padding: 28,
              width: '100%', maxWidth: 420, border: '1px solid var(--b)',
              maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'rgba(99,91,255,.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                💳
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>Payment Setup</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
                  Connect Stripe or Paystack to accept payments
                </div>
              </div>
            </div>

            {/* Error / Success banners */}
            {error && (
              <div style={{ padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: 9, border: '1px solid #fecaca', marginBottom: 14, color: '#991b1b', fontSize: 12 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '8px 12px', backgroundColor: '#d1fae5', borderRadius: 9, border: '1px solid #a7f3d0', marginBottom: 14, color: '#065f46', fontSize: 12 }}>
                {provider === 'stripe' ? 'Redirecting to Stripe onboarding...' : 'Payment setup complete! M-Pesa & cards are now enabled.'}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Country */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  Country <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value)
                    setSelectedBank('')
                    setAccountNumber('')
                    setMpesaPhone('')
                    setError('')
                  }}
                  disabled={loading}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.provider === 'paystack' ? 'Paystack' : 'Stripe'})
                    </option>
                  ))}
                </select>
              </div>

              {selectedCountry && (
                <div style={{
                  padding: '6px 10px', borderRadius: 8, marginBottom: 12, fontSize: 11,
                  background: provider === 'paystack' ? 'rgba(245,158,11,.08)' : 'rgba(99,91,255,.08)',
                  color: provider === 'paystack' ? '#92400e' : '#4338ca',
                }}>
                  {provider === 'paystack'
                    ? hasMpesa
                      ? '✓ M-Pesa & card payments · Fee: ~3.5%'
                      : '✓ Card & bank payments · Fee: ~3.5%'
                    : '✓ Stripe Connect · KYC required · Fee: ~4.9%'}
                </div>
              )}

              {/* Business Name */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  Business Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={loading}
                  placeholder="Your business name"
                  style={inputStyle}
                />
              </div>

              {/* Contact Phone (for Stripe) */}
              {provider === 'stripe' && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    disabled={loading}
                    placeholder="+447512345678"
                    style={inputStyle}
                  />
                </div>
              )}

              {/* ── Paystack settlement fields ── */}
              {provider === 'paystack' && selectedCountry && (
                <div style={{
                  padding: 14, borderRadius: 12, marginBottom: 14,
                  border: '1px solid var(--b)', background: 'rgba(245,158,11,.03)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 10 }}>
                    Settlement Account
                  </div>

                  {/* M-Pesa / Bank toggle (only for M-Pesa countries) */}
                  {hasMpesa && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      <button
                        type="button"
                        onClick={() => setSettlementType('mpesa')}
                        style={{
                          flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--b)',
                          background: settlementType === 'mpesa' ? '#16a34a' : 'transparent',
                          color: settlementType === 'mpesa' ? '#fff' : 'var(--tx)',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        📱 M-Pesa
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettlementType('bank')}
                        style={{
                          flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--b)',
                          background: settlementType === 'bank' ? '#635bff' : 'transparent',
                          color: settlementType === 'bank' ? '#fff' : 'var(--tx)',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        🏦 Bank Account
                      </button>
                    </div>
                  )}

                  {/* M-Pesa phone input */}
                  {settlementType === 'mpesa' && hasMpesa && (
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                        M-Pesa Phone Number <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        disabled={loading}
                        placeholder="254712345678"
                        style={inputStyle}
                      />
                      <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4 }}>
                        This number will receive settlements and be used to prompt M-Pesa payments from customers at the POS
                      </div>
                    </div>
                  )}

                  {/* Bank account fields */}
                  {(settlementType === 'bank' || !hasMpesa) && (
                    <div>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                          Bank <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        {banksLoading ? (
                          <div style={{ ...inputStyle, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            Loading banks...
                          </div>
                        ) : (
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            disabled={loading}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                          >
                            <option value="">Select bank</option>
                            {banks.map(b => (
                              <option key={b.code} value={b.code}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                          Account Number <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          disabled={loading}
                          placeholder={selectedCountryData?.code === 'NG' ? '0123456789' : 'Account number'}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    flex: 1, padding: 11, borderRadius: 10, border: 'none',
                    background: !canSubmit ? 'var(--b2, #d1d5db)' : provider === 'paystack' ? '#16a34a' : '#635bff',
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: !canSubmit ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading
                    ? 'Setting up...'
                    : provider === 'stripe'
                      ? 'Continue to Stripe'
                      : provider === 'paystack'
                        ? settlementType === 'mpesa' ? 'Connect M-Pesa' : 'Connect Bank Account'
                        : 'Set Up Payments'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  style={{
                    padding: '11px 18px', borderRadius: 10,
                    border: '1px solid var(--b)', background: 'transparent',
                    color: 'var(--tx)', fontSize: 14, fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Setup steps hint */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--b)', fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>
              {provider === 'stripe' ? (
                <span>1. Fill in details → 2. Continue to Stripe → 3. Complete KYC → 4. Accept payments</span>
              ) : provider === 'paystack' ? (
                hasMpesa ? (
                  <span>1. Enter business details → 2. Connect M-Pesa number → 3. Cashiers can prompt M-Pesa payments from POS</span>
                ) : (
                  <span>1. Enter business details → 2. Select bank & account → 3. Cards enabled instantly</span>
                )
              ) : (
                <span>Select a country to see the setup flow for your region</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
