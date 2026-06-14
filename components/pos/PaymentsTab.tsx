'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PaymentSetupCard } from '@/components/PaymentSetupCard'
import { StripeSetupCard } from '@/components/StripeSetupCard'
import DunningRecovery from './DunningRecovery'
import ReceivedPayments from './ReceivedPayments'

interface PaymentsTabProps {
  currencySymbol: string
  staff?: any[]
}

export default function PaymentsTab({ currencySymbol, staff }: PaymentsTabProps) {
  const ownerStaff = staff?.[0] || null
  const [config, setConfig] = useState<any>(null)
  const searchParams = useSearchParams()
  const [stripeVerifyMsg, setStripeVerifyMsg] = useState<string | null>(null)
  const [stripeResuming, setStripeResuming] = useState(false)
  const [fixingSubaccount, setFixingSubaccount] = useState(false)
  const [fixSubaccountMsg, setFixSubaccountMsg] = useState<string | null>(null)
  const [fixPhone, setFixPhone] = useState('')
  const [needsFixPhone, setNeedsFixPhone] = useState(false)

  // Auto-verify Stripe when returning from onboarding
  useEffect(() => {
    if (searchParams.get('stripe_setup_complete') !== 'true') return
    if (!ownerStaff) return
    const ownerId = ownerStaff.owner_id || ownerStaff.id
    fetch('/api/pos/payment/stripe-verify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'x-owner-id': ownerId },
    })
      .then(r => r.json())
      .then(data => {
        if (data.verified) {
          setStripeVerifyMsg('✅ Stripe verified! International payments now active.')
          setConfig((c: any) => c ? { ...c, stripe_onboarding_complete: true } : c)
        } else {
          setStripeVerifyMsg('⚠ Stripe verification still pending — Stripe may take a few minutes to confirm.')
        }
      })
      .catch(() => {})
  }, [searchParams, ownerStaff])

  const fixSubaccount = async (phone?: string) => {
    if (fixingSubaccount || !ownerStaff) return
    setFixingSubaccount(true)
    setFixSubaccountMsg(null)
    try {
      const res = await fetch('/api/pos/payment/setup', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-owner-id': ownerStaff.owner_id || ownerStaff.id },
        body: JSON.stringify(phone ? { mpesa_phone: phone } : {}),
      })
      const data = await res.json()
      if (data.success || data.already_exists) {
        setFixSubaccountMsg('✅ Splits fixed! Platform fee now active on all payments.')
        setNeedsFixPhone(false)
        setConfig((c: any) => ({ ...c, has_subaccount: true }))
      } else if (data.error === 'PHONE_REQUIRED') {
        setNeedsFixPhone(true)
      } else {
        setFixSubaccountMsg(`⚠ ${data.error || 'Could not create subaccount.'}`)
      }
    } catch {
      setFixSubaccountMsg('⚠ Network error — please try again.')
    } finally {
      setFixingSubaccount(false)
    }
  }

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

      {stripeVerifyMsg && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: stripeVerifyMsg.startsWith('✅') ? 'rgba(16,185,129,.08)' : 'rgba(245,158,11,.08)', border: `1px solid ${stripeVerifyMsg.startsWith('✅') ? 'rgba(16,185,129,.3)' : 'rgba(245,158,11,.3)'}`, borderRadius: 10, fontSize: 13, color: stripeVerifyMsg.startsWith('✅') ? '#059669' : '#d97706', fontWeight: 600 }}>
          {stripeVerifyMsg}
        </div>
      )}

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

      {/* ── Received Payments ── */}
      <div style={{ marginTop: 24 }}>
        <ReceivedPayments currencySymbol={currencySymbol} />
      </div>

      {/* ── Payment Recovery (Dunning) ── */}
      <div style={{ marginTop: 24 }}>
        <DunningRecovery currencySymbol={currencySymbol} />
      </div>

      {/* ── Fix Splits banner — Paystack active but no subaccount set up ── */}
      {paystackActive && config?.has_subaccount === false && (
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 12, maxWidth: 400 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#d97706', marginBottom: 4 }}>⚠ Platform splits not active</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10 }}>
            Payments are going to the main account without splitting. Fix this to automatically route AskBiz's 2% platform fee on every transaction.
          </div>
          {needsFixPhone && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 6 }}>Enter your M-Pesa number to link:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="tel" placeholder="07XXXXXXXX" value={fixPhone} onChange={e => setFixPhone(e.target.value)}
                  style={{ flex: 1, fontSize: 13, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)' }} />
                <button onClick={() => fixSubaccount(fixPhone)} disabled={fixingSubaccount || !fixPhone}
                  style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: '#f59e0b', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  {fixingSubaccount ? '...' : 'Link'}
                </button>
              </div>
            </div>
          )}
          {fixSubaccountMsg && (
            <div style={{ fontSize: 12, marginBottom: 8, color: fixSubaccountMsg.startsWith('✅') ? '#059669' : '#dc2626' }}>
              {fixSubaccountMsg}
            </div>
          )}
          {!needsFixPhone && !fixSubaccountMsg && (
            <button onClick={() => fixSubaccount()} disabled={fixingSubaccount}
              style={{ fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 8, background: '#f59e0b', color: '#fff', border: 'none', cursor: fixingSubaccount ? 'default' : 'pointer', opacity: fixingSubaccount ? 0.7 : 1 }}>
              {fixingSubaccount ? 'Fixing...' : 'Fix Splits Now'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
