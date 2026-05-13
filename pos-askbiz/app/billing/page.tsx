'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SeatsUpgradeButton } from '@/components/SeatsUpgradeButton'

const API = process.env.NEXT_PUBLIC_API_URL || ''

export default function BillingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [staff, setStaff] = useState<any>(null)
  const [seatsActive, setSeatsActive] = useState(2)
  const [upgradeMessage, setUpgradeMessage] = useState('')

  useEffect(() => {
    const storedStaff = localStorage.getItem('pos_staff')
    if (!storedStaff) {
      router.push('/')
      return
    }

    try {
      setStaff(JSON.parse(storedStaff))
    } catch (e) {
      router.push('/')
    }

    const upgrade = searchParams.get('upgrade')
    if (upgrade === 'success') {
      setUpgradeMessage('✅ Upgrade successful! Your new seats are now active.')
      setTimeout(() => setUpgradeMessage(''), 5000)
    } else if (upgrade === 'cancelled') {
      setUpgradeMessage('❌ Upgrade cancelled. No charges were made.')
      setTimeout(() => setUpgradeMessage(''), 5000)
    }
  }, [searchParams])

  const handleLogout = () => {
    localStorage.removeItem('pos_staff')
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>💳 Plans & Billing</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {staff && <span style={{ fontSize: '14px', color: '#666' }}>{staff.name}</span>}
            <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {upgradeMessage && (
        <div style={{ padding: '12px 16px', backgroundColor: upgradeMessage.includes('successful') ? '#d4edda' : '#f8d7da', color: upgradeMessage.includes('successful') ? '#155724' : '#721c24', borderRadius: '6px', margin: '16px', border: `1px solid ${upgradeMessage.includes('successful') ? '#c3e6cb' : '#f5c6cb'}` }}>
          {upgradeMessage}
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Point of Sale Seats */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Point of Sale Seats</h2>
              <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Active - {seatsActive} seats</span>
            </div>
          </div>

          {/* Seat Upgrade Component */}
          {staff && (
            <SeatsUpgradeButton
              currentSeats={seatsActive}
              ownerEmail={staff.email}
              ownerId={staff.owner_id}
            />
          )}

          <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '4px', marginTop: '16px', fontSize: '13px', color: '#78350f' }}>
            <p style={{ margin: '0 0 12px 0' }}>Add cashier and inventory staff to your shop at £5/seat/month. Each seat lets one staff member log in to <code>pos.askbiz.co</code> via email or WhatsApp OTP on their own phone. The owner dashboard is always included — seats are for additional staff only.</p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>✓ Cashier & inventory roles</li>
              <li>✓ Email or WhatsApp OTP login</li>
              <li>✓ WhatsApp receipts to customers</li>
              <li>✓ MTD-compatible VAT export</li>
              <li>✓ Cancel anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
