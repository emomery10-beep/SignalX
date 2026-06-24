'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

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
  const { tc } = useLang()
  const [showModal, setShowModal] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [businessName, setBusinessName] = useState<string>('')
  const [contactPhone, setContactPhone] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [fixingSubaccount, setFixingSubaccount] = useState(false)
  const [fixSubaccountMsg, setFixSubaccountMsg] = useState<string | null>(null)

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
      .then(data => { console.log('[PaymentSetupCard] config:', data); if (data.configured) { setCurrentConfig(data); onConfigLoaded?.(data) } })
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
      setError(!staff?.email ? tc('payment_setupcard.errorEmailMissing') : tc('payment_setupcard.errorRequiredFields'))
      return
    }

    // Validate Paystack-specific fields
    if (provider === 'paystack') {
      if (settlementType === 'mpesa' && !mpesaPhone) {
        setError(tc('payment_setupcard.errorMpesaPhone'))
        return
      }
      if (settlementType === 'bank' && (!selectedBank || !accountNumber)) {
        setError(tc('payment_setupcard.errorBankFields'))
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
        setError(data.error || tc('payment_setupcard.errorGeneric'))
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
      setError(err.message || tc('payment_setupcard.errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  const [fixPhone, setFixPhone] = useState<string>('')
  const [needsFixPhone, setNeedsFixPhone] = useState(false)

  const fixSubaccount = async (phone?: string) => {
    if (fixingSubaccount) return
    setFixingSubaccount(true)
    setFixSubaccountMsg(null)
    try {
      const res = await fetch('/api/pos/payment/setup', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id },
        body: JSON.stringify(phone ? { mpesa_phone: phone } : {}),
      })
      const data = await res.json()
      if (data.success || data.already_exists) {
        setFixSubaccountMsg(tc('payment_setupcard.fixSplitsSuccess'))
        setNeedsFixPhone(false)
        setCurrentConfig((c: any) => ({ ...c, has_subaccount: true, needs_subaccount_fix: false }))
        onConfigLoaded?.({ ...currentConfig, has_subaccount: true, needs_subaccount_fix: false })
      } else if (data.error === 'PHONE_REQUIRED') {
        setNeedsFixPhone(true)
        setFixSubaccountMsg(null)
      } else {
        setFixSubaccountMsg(tc('payment_setupcard.fixSplitsErrorGeneric', { error: data.error || 'Could not create subaccount — Paystack may need to verify your M-Pesa number.' }))
      }
    } catch {
      setFixSubaccountMsg(tc('payment_setupcard.fixSplitsErrorNetwork'))
    } finally {
      setFixingSubaccount(false)
    }
  }

  const statusLabel = currentConfig?.is_active
    ? currentConfig.payment_provider === 'stripe' && !currentConfig.stripe_onboarding_complete
      ? tc('payment_setupcard.statusPendingKyc')
      : tc('payment_setupcard.statusActiveLabel')
    : currentConfig?.configured === false
      ? null
      : null

  const providerLabel = currentConfig?.payment_provider === 'paystack'
    ? tc('payment_setupcard.providerPaystack')
    : currentConfig?.payment_provider === 'stripe'
      ? tc('payment_setupcard.providerStripe')
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
            {statusLabel === tc('payment_setupcard.statusActiveLabel') ? providerLabel : tc('payment_setupcard.widgetLabel')}
            {statusLabel === tc('payment_setupcard.statusActiveLabel') && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 1, whiteSpace: 'nowrap' }}>
            {statusLabel === tc('payment_setupcard.statusActiveLabel')
              ? tc('payment_setupcard.cardMobilePaymentsActive', { country: currentConfig?.country || '' })
              : statusLabel === tc('payment_setupcard.statusPendingKyc')
                ? tc('payment_setupcard.stripeVerificationPending')
                : tc('payment_setupcard.connectStripeOrPaystack')}
          </div>
        </div>

        {/* Right badge / button */}
        {configLoading ? (
          <span style={{ fontSize: 11, color: 'var(--tx3)', flexShrink: 0 }}>…</span>
        ) : statusLabel ? (
          <span style={{
            fontSize: 11, fontWeight: 600, borderRadius: 9999,
            padding: '3px 10px', flexShrink: 0, whiteSpace: 'nowrap',
            background: statusLabel === tc('payment_setupcard.statusActiveLabel') ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.1)',
            color: statusLabel === tc('payment_setupcard.statusActiveLabel') ? '#059669' : '#d97706',
          }}>
            {statusLabel === tc('payment_setupcard.statusActiveLabel') ? tc('payment_setupcard.statusActive') : statusLabel}
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
            {tc('payment_setupcard.btnSetUp')}
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
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>{tc('payment_setupcard.modalTitle')}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
                  {tc('payment_setupcard.modalSubtitle')}
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
                {provider === 'stripe' ? tc('payment_setupcard.successStripe') : tc('payment_setupcard.successPaystack')}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Country */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  {tc('payment_setupcard.labelCountry')} <span style={{ color: '#ef4444' }}>*</span>
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
                  <option value="">{tc('payment_setupcard.selectCountry')}</option>
                  {COUNTRY_OPTIONS.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.provider === 'paystack' ? tc('payment_setupcard.providerPaystack') : tc('payment_setupcard.providerStripe')})
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
                      ? tc('payment_setupcard.bannerPaystackMpesa')
                      : tc('payment_setupcard.bannerPaystackBank')
                    : tc('payment_setupcard.bannerStripe')}
                </div>
              )}

              {/* Business Name */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                  {tc('payment_setupcard.labelBusinessName')} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={loading}
                  placeholder={tc('payment_setupcard.placeholderBusinessName')}
                  style={inputStyle}
                />
              </div>

              {/* Contact Phone (for Stripe) */}
              {provider === 'stripe' && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                    {tc('payment_setupcard.labelContactPhone')}
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
                    {tc('payment_setupcard.sectionSettlementAccount')}
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
                        {tc('payment_setupcard.btnMpesa')}
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
                        {tc('payment_setupcard.btnBankAccount')}
                      </button>
                    </div>
                  )}

                  {/* M-Pesa phone input */}
                  {settlementType === 'mpesa' && hasMpesa && (
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                        {tc('payment_setupcard.labelMpesaPhone')} <span style={{ color: '#ef4444' }}>*</span>
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
                        {tc('payment_setupcard.mpesaPhoneHint')}
                      </div>
                    </div>
                  )}

                  {/* Bank account fields */}
                  {(settlementType === 'bank' || !hasMpesa) && (
                    <div>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginBottom: 4 }}>
                          {tc('payment_setupcard.labelBank')} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        {banksLoading ? (
                          <div style={{ ...inputStyle, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {tc('payment_setupcard.loadingBanks')}
                          </div>
                        ) : (
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            disabled={loading}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                          >
                            <option value="">{tc('payment_setupcard.selectBank')}</option>
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
                          {tc('payment_setupcard.labelAccountNumber')} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          disabled={loading}
                          placeholder={selectedCountryData?.code === 'NG' ? tc('payment_setupcard.placeholderAccountNumberNg') : tc('payment_setupcard.placeholderAccountNumber')}
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
                    ? tc('payment_setupcard.btnLoading')
                    : provider === 'stripe'
                      ? tc('payment_setupcard.btnContinueStripe')
                      : provider === 'paystack'
                        ? settlementType === 'mpesa' ? tc('payment_setupcard.btnConnectMpesa') : tc('payment_setupcard.btnConnectBank')
                        : tc('payment_setupcard.btnSetUpPayments')}
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
                  {tc('payment_setupcard.btnCancel')}
                </button>
              </div>
            </form>

            {/* Setup steps hint */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--b)', fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>
              {provider === 'stripe' ? (
                <span>{tc('payment_setupcard.hintStripe')}</span>
              ) : provider === 'paystack' ? (
                hasMpesa ? (
                  <span>{tc('payment_setupcard.hintPaystackMpesa')}</span>
                ) : (
                  <span>{tc('payment_setupcard.hintPaystackBank')}</span>
                )
              ) : (
                <span>{tc('payment_setupcard.hintDefault')}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
