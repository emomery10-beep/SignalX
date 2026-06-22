'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SeatsUpgradeButton } from '@/components/SeatsUpgradeButton'
import { useLang } from '@/components/LanguageProvider'

const API = process.env.NEXT_PUBLIC_API_URL || ''

function BillingPageContent() {
  const router = useRouter()
  const { tc } = useLang()
  const searchParams = useSearchParams()
  const [staff, setStaff] = useState<any>(null)
  const [seatsActive, setSeatsActive] = useState(1)
  const [upgradeMessage, setUpgradeMessage] = useState('')
  const [upgradeKind, setUpgradeKind] = useState<'' | 'success' | 'cancelled'>('')
  const [loadingSeats, setLoadingSeats] = useState(true)
  const [seatsLoaded, setSeatsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Load current seat count from subscription
  const loadCurrentSeats = async (ownerId: string, ownerEmail: string) => {
    try {
      const response = await fetch('/api/billing/get-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_id: ownerId, owner_email: ownerEmail }),
      })

      if (response.ok) {
        const data = await response.json()
        setSeatsActive(data.current_seats || 1)
      } else {
        setSeatsActive(1)
      }
    } catch (error) {
      console.error('Failed to load seats:', error)
      setSeatsActive(1)
    } finally {
      setLoadingSeats(false)
      setSeatsLoaded(true)
    }
  }

  // Mark that we're on the client after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check auth and load data only after client hydration
  useEffect(() => {
    if (!isClient) return

    const storedStaff = localStorage.getItem('pos_staff')
    if (!storedStaff) {
      router.push('/')
      return
    }

    try {
      const parsedStaff = JSON.parse(storedStaff)
      setStaff(parsedStaff)
      // Load seat count immediately
      loadCurrentSeats(parsedStaff.owner_id, parsedStaff.email)
    } catch (e) {
      console.error('Failed to parse staff:', e)
      router.push('/')
    }
  }, [isClient, router])

  useEffect(() => {
    const upgrade = searchParams.get('upgrade')
    if (upgrade === 'success') {
      setUpgradeKind('success')
      setUpgradeMessage(tc('pos_billing.upgrade_success'))
      setTimeout(() => { setUpgradeMessage(''); setUpgradeKind('') }, 5000)
    } else if (upgrade === 'cancelled') {
      setUpgradeKind('cancelled')
      setUpgradeMessage(tc('pos_billing.upgrade_cancelled'))
      setTimeout(() => { setUpgradeMessage(''); setUpgradeKind('') }, 5000)
    }
  }, [searchParams])

  const handleSignOut = () => {
    localStorage.removeItem('pos_staff')
    router.push('/')
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', backgroundColor: 'var(--pos-bg)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--pos-surface)', borderBottom: '1px solid var(--pos-border)', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--pos-ink)' }}>{tc('pos_billing.title')}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {staff && <span style={{ fontSize: '14px', color: 'var(--pos-muted)' }}>{staff.name}</span>}
            <button type="button" onClick={handleSignOut} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'var(--pos-ink)' }}>
              {tc('pos_billing.sign_out')}
            </button>
          </div>
        </div>
      </div>

      {upgradeMessage && (
        <div className="pos-banner" style={{ padding: '12px 16px', backgroundColor: upgradeKind === 'success' ? '#d4edda' : '#f8d7da', color: upgradeKind === 'success' ? '#155724' : '#721c24', borderRadius: '6px', margin: '16px', border: `1px solid ${upgradeKind === 'success' ? '#c3e6cb' : '#f5c6cb'}` }}>
          {upgradeMessage}
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Point of Sale Seats */}
        <div className="pos-reveal" style={{ backgroundColor: 'var(--pos-surface)', borderRadius: '8px', border: '1px solid var(--pos-border)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: 'var(--pos-ink)' }}>{tc('pos_billing.seats_title')}</h2>
              <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                {tc('pos_billing.seats_active' + (seatsActive !== 1 ? '_other' : '_one'), { count: seatsActive })}
              </span>
            </div>
          </div>

          {/* Seat Upgrade Component - Only render after client hydration to prevent mismatch */}
          {isClient && staff && staff.email && staff.owner_id ? (
            <SeatsUpgradeButton
              currentSeats={seatsActive}
              ownerEmail={staff.email}
              ownerId={staff.owner_id}
            />
          ) : isClient ? (
            <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '4px', color: '#78350f', fontSize: '13px' }}>
              {tc('pos_billing.loading_seat_info')}
            </div>
          ) : null}

          <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '4px', marginTop: '16px', fontSize: '13px', color: '#78350f' }}>
            <p style={{ margin: '0 0 12px 0' }}>{tc('pos_billing.seats_blurb_1')}<code>pos.askbiz.co</code>{tc('pos_billing.seats_blurb_2')}</p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>{tc('pos_billing.bullet_roles')}</li>
              <li>{tc('pos_billing.bullet_login')}</li>
              <li>{tc('pos_billing.bullet_receipts')}</li>
              <li>{tc('pos_billing.bullet_vat')}</li>
              <li>{tc('pos_billing.bullet_cancel')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function BillingFallback() {
  const { tc } = useLang()
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pos-muted)' }}>{tc('pos_billing.loading_billing')}</div>
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingFallback />}>
      <BillingPageContent />
    </Suspense>
  )
}
