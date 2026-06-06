'use client'

import { PaymentSetupCard } from '@/components/PaymentSetupCard'

interface PaymentsTabProps {
  currencySymbol: string
  staff?: any[]
}

export default function PaymentsTab({ currencySymbol, staff }: PaymentsTabProps) {
  // Get staff object (owner) from the local/global context
  const ownerStaff = staff?.[0] || null

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: 'var(--tx)' }}>
          💳 Payment Methods
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--tx3)' }}>
          Configure payment providers and enable customers to pay via Paystack or Stripe
        </p>
      </div>

      {/* Payment Setup Card */}
      {ownerStaff && (
        <PaymentSetupCard
          staff={{
            owner_id: ownerStaff.owner_id || ownerStaff.id,
            email: ownerStaff.email,
            name: ownerStaff.name,
          }}
        />
      )}

      {!ownerStaff && (
        <div style={{ padding: '24px', backgroundColor: 'var(--sf)', borderRadius: '8px', border: '1px solid var(--b)', color: 'var(--tx3)', textAlign: 'center' }}>
          Loading payment configuration...
        </div>
      )}
    </div>
  )
}
