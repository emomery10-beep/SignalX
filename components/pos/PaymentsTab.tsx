'use client'

import { useState, useCallback } from 'react'
import { PaymentSetupCard } from '@/components/PaymentSetupCard'
import { StripeSetupCard } from '@/components/StripeSetupCard'

interface PaymentsTabProps {
  currencySymbol: string
  staff?: any[]
}

export default function PaymentsTab({ currencySymbol, staff }: PaymentsTabProps) {
  const ownerStaff = staff?.[0] || null
  const [config, setConfig] = useState<any>(null)
  const [stripeResuming, setStripeResuming] = useState(false)

  const resumeStripeOnboarding = useCallback(async () => {
    if (stripeResuming) return
    setStripeResuming(true)
    try {
      const res = await fetch('/api/pos/payment/stripe-resume', { credentials: 'include' })
      const data = await res.json()
      if (data.onboarding_url) {
        window.location.href = data.onboarding_url
      }
    } catch (_) {}
    finally { setStripeResuming(false) }
  }, [stripeResuming])

  const paystackActive = config?.paystack_active ?? (config?.payment_provider === 'paystack' && config?.is_active)
  const stripeActive = config?.stripe_active ?? ((config?.payment_provider === 'stripe' || config?.payment_provider === 'both') && config?.is_active)
  const showAddStripe = paystackActive && !stripeActive

  const staffProps = ownerStaff ? {
    owner_id: ownerStaff.owner_id || ownerStaff.id,
    email: ownerStaff.email,
    name: ownerStaff.name,
  } : null

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: 'var(--tx)' }}>
          💳 Payment Methods
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--tx3)' }}>
          Configure payment providers and enable customers to pay via Paystack or Stripe
        </p>
      </div>

      {staffProps ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-start' }}>
          {/* Paystack widget */}
          <PaymentSetupCard
            staff={staffProps}
            onConfigLoaded={setConfig}
          />

          {/* Stripe widget — shown when only Paystack is active (add second provider) */}
          {showAddStripe && (
            <StripeSetupCard
              staff={staffProps}
              onConfigLoaded={setConfig}
            />
          )}

          {/* Stripe active widget */}
          {stripeActive && (
            <div
              onClick={!config?.stripe_onboarding_complete ? resumeStripeOnboarding : undefined}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '9px 14px 9px 10px',
                background: 'rgba(99,91,255,.06)',
                border: '1.5px solid rgba(99,91,255,.3)',
                borderRadius: 12, width: 'fit-content',
                cursor: config?.stripe_onboarding_complete ? 'default' : 'pointer',
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: 'rgba(99,91,255,.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>💜</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                  Stripe
                  {config?.stripe_onboarding_complete
                    ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    : <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                  }
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 1, whiteSpace: 'nowrap' }}>
                  {config?.stripe_onboarding_complete
                    ? 'Apple Pay · Google Pay · Cards active'
                    : stripeResuming ? 'Loading Stripe link…' : 'Click to complete Stripe onboarding'}
                </div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, borderRadius: 9999,
                padding: '3px 10px', flexShrink: 0, whiteSpace: 'nowrap',
                background: config?.stripe_onboarding_complete ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.1)',
                color: config?.stripe_onboarding_complete ? '#059669' : '#d97706',
              }}>
                {config?.stripe_onboarding_complete ? '● Active' : stripeResuming ? '…' : 'Pending KYC'}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '24px', backgroundColor: 'var(--sf)', borderRadius: '8px', border: '1px solid var(--b)', color: 'var(--tx3)', textAlign: 'center' }}>
          Loading payment configuration...
        </div>
      )}
    </div>
  )
}
