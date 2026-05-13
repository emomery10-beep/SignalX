'use client'

import { useState } from 'react'

const SEAT_PRICE_MONTHLY = 500 // £5 in pence

interface SeatsUpgradeButtonProps {
  currentSeats: number
  ownerEmail: string
  ownerId: string
}

export function SeatsUpgradeButton({
  currentSeats,
  ownerEmail,
  ownerId,
}: SeatsUpgradeButtonProps) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showDowngrade, setShowDowngrade] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState(currentSeats)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const additionalSeats = selectedSeats - currentSeats
  const monthlyCost = Math.abs(additionalSeats) * (SEAT_PRICE_MONTHLY / 100)

  const handleUpgrade = async () => {
    if (additionalSeats <= 0) {
      setError('Please select more seats than your current plan')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seats: currentSeats,
          additional_seats: additionalSeats,
          owner_id: ownerId,
          owner_email: ownerEmail,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      if (sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
      } else {
        throw new Error('No session ID returned from server')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process upgrade')
    } finally {
      setLoading(false)
    }
  }

  const handleDowngrade = async () => {
    if (additionalSeats >= 0) {
      setError('Please select fewer seats than your current plan')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/billing/downgrade-seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_seats: currentSeats,
          new_seats: selectedSeats,
          owner_id: ownerId,
          owner_email: ownerEmail,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process downgrade')
      }

      const result = await response.json()
      alert(`Downgrade successful! Your plan will update next billing cycle.\nMonthly savings: £${monthlyCost.toFixed(2)}`)
      setShowDowngrade(false)
      setSelectedSeats(currentSeats)
    } catch (err: any) {
      setError(err.message || 'Failed to process downgrade')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Button Group */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={() => {
            setShowUpgrade(!showUpgrade)
            setShowDowngrade(false)
            setSelectedSeats(currentSeats)
            setError('')
          }}
          style={{
            padding: '10px 16px',
            backgroundColor: showUpgrade ? '#3b82f6' : '#fff',
            color: showUpgrade ? '#fff' : '#3b82f6',
            border: '2px solid #3b82f6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          ➕ Add Seats
        </button>

        {currentSeats > 1 && (
          <button
            onClick={() => {
              setShowDowngrade(!showDowngrade)
              setShowUpgrade(false)
              setSelectedSeats(currentSeats)
              setError('')
            }}
            style={{
              padding: '10px 16px',
              backgroundColor: showDowngrade ? '#f97316' : '#fff',
              color: showDowngrade ? '#fff' : '#f97316',
              border: '2px solid #f97316',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            ➖ Remove Seats
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      {/* Upgrade Panel */}
      {showUpgrade && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>
            Add Staff Seats
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="upgrade-seats"
              style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#374151' }}
            >
              Number of Seats
            </label>
            <input
              id="upgrade-seats"
              type="number"
              min={currentSeats + 1}
              max={50}
              value={selectedSeats}
              onChange={(e) => setSelectedSeats(Math.max(currentSeats + 1, parseInt(e.target.value) || currentSeats))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: '#dbeafe',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <strong>Current Plan:</strong> {currentSeats} seat{currentSeats !== 1 ? 's' : ''} @ £5/month
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>New Plan:</strong> {selectedSeats} seat{selectedSeats !== 1 ? 's' : ''} @ £5/month
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #93c5fd' }}>
              <strong>Additional Cost:</strong> £{monthlyCost.toFixed(2)}/month
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {loading ? 'Processing...' : `Upgrade to ${selectedSeats} Seats`}
          </button>
        </div>
      )}

      {/* Downgrade Panel */}
      {showDowngrade && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#9a3412' }}>
            Remove Staff Seats
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="downgrade-seats"
              style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#374151' }}
            >
              Number of Seats
            </label>
            <input
              id="downgrade-seats"
              type="number"
              min={1}
              max={Math.max(1, currentSeats - 1)}
              value={selectedSeats}
              onChange={(e) => setSelectedSeats(Math.min(currentSeats - 1, parseInt(e.target.value) || currentSeats))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: '#ffedd5',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <strong>Current Plan:</strong> {currentSeats} seat{currentSeats !== 1 ? 's' : ''} @ £5/month
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>New Plan:</strong> {selectedSeats} seat{selectedSeats !== 1 ? 's' : ''} @ £5/month
            </div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #fed7aa' }}>
              <strong>Monthly Savings:</strong> £{monthlyCost.toFixed(2)}/month
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
            Your subscription will be downgraded at the end of your current billing cycle. You'll see the savings on your next invoice.
          </p>

          <button
            onClick={handleDowngrade}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {loading ? 'Processing...' : `Downgrade to ${selectedSeats} Seat${selectedSeats !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}
