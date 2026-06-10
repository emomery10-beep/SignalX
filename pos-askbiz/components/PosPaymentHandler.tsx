'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const API = process.env.NEXT_PUBLIC_API_URL || ''

interface PosPaymentHandlerProps {
  transactionId: string
  amount: number
  paymentType: 'cash' | 'card' | 'mpesa'
  customerPhone?: string
  ownerId: string
  staffId: string
  currency: string
  onPaymentComplete: () => void
  onPaymentFailed: (error: string) => void
}

export default function PosPaymentHandler({
  transactionId,
  amount,
  paymentType,
  customerPhone,
  ownerId,
  staffId,
  currency,
  onPaymentComplete,
  onPaymentFailed,
}: PosPaymentHandlerProps) {
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [paymentRef, setPaymentRef] = useState<string | null>(null)
  const [pollingRef, setPollingRef] = useState<NodeJS.Timeout | null>(null)
  const [phoneInput, setPhoneInput] = useState(customerPhone || '')
  const audioRef = useRef<HTMLAudioElement>(null)

  // Listen to Supabase Realtime for payment updates
  useEffect(() => {
    if (!transactionId || !isProcessing) return

    const channel = supabase
      .channel(`pos_payments_${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pos_payments',
          filter: `transaction_id=eq.${transactionId}`,
        },
        (payload) => {
          const payment = payload.new
          if (payment.status === 'completed') {
            playSuccessSound()
            setStatus('completed')
            onPaymentComplete()
          } else if (payment.status === 'failed') {
            setStatus('failed')
            onPaymentFailed('Payment failed. Please try again.')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [transactionId, status, supabase, onPaymentComplete, onPaymentFailed])

  const playSuccessSound = () => {
    // Create a simple beep sound
    if (!audioRef.current) {
      audioRef.current = new Audio(
        'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
      )
    }
    audioRef.current?.play().catch(() => {})
  }

  const initiateM2pesa = async () => {
    if (!phoneInput) {
      onPaymentFailed('Phone number required')
      return
    }

    setStatus('processing')
    try {
      const res = await fetch(`${API}/api/pos/payment/mpesa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-id': ownerId,
          'x-staff-id': staffId,
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          customer_phone: phoneInput,
          amount,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('failed')
        onPaymentFailed(data.error || 'Failed to initiate M-Pesa payment')
        return
      }

      setPaymentRef(data.reference)
      // Start polling in case Realtime doesn't fire
      startPolling(data.payment_id)
    } catch (err: any) {
      setStatus('failed')
      onPaymentFailed(err.message || 'Network error')
    }
  }

  const initiateCard = async () => {
    setStatus('processing')
    try {
      const res = await fetch(`${API}/api/pos/payment/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-id': ownerId,
          'x-staff-id': staffId,
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          payment_method: 'card',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('failed')
        onPaymentFailed(data.error || 'Failed to create payment link')
        return
      }

      setPaymentRef(data.reference)
      setQrCode(data.qr_code)
      // Start polling for completion
      startPolling(data.payment_id)
    } catch (err: any) {
      setStatus('failed')
      onPaymentFailed(err.message || 'Network error')
    }
  }

  const startPolling = (paymentId: string) => {
    // Poll every 2 seconds for up to 2 minutes
    let attempts = 0
    const timer = setInterval(async () => {
      attempts++
      if (attempts > 60) {
        clearInterval(timer)
        setStatus('failed')
        onPaymentFailed('Payment timeout. Please try again.')
        return
      }

      try {
        const res = await fetch(
          `${API}/api/pos/payment/status?payment_id=${paymentId}`,
          {
            headers: {
              'x-owner-id': ownerId,
              'x-staff-id': staffId,
            },
          }
        )
        const data = await res.json()

        if (data.status === 'completed') {
          clearInterval(timer)
          playSuccessSound()
          setStatus('completed')
          onPaymentComplete()
        } else if (data.status === 'failed') {
          clearInterval(timer)
          setStatus('failed')
          onPaymentFailed('Payment failed')
        }
      } catch (err) {
        // Silently continue polling on error
      }
    }, 2000)

    setPollingRef(timer)
  }

  // Handle cash (no additional UI needed, just show status)
  if (paymentType === 'cash') {
    return null
  }

  // M-Pesa flow
  const isProcessing = status === 'processing'
  if (paymentType === 'mpesa') {
    return (
      <div className="pos-sheet" style={{ marginBottom: 14, padding: '16px', background: 'var(--pos-surface)', borderRadius: 14, border: '1px solid var(--pos-border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 8 }}>
          M-Pesa Payment
        </div>
        {status === 'idle' && (
          <>
            <input
              type="tel"
              placeholder="Customer M-Pesa number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1.5px solid var(--pos-border)',
                fontSize: 15,
                fontFamily: 'inherit',
                background: 'var(--pos-surface)',
                color: 'var(--pos-ink)',
                boxSizing: 'border-box',
                marginBottom: 8,
              }}
            />
            <button
              onClick={initiateM2pesa}
              disabled={!phoneInput || isProcessing}
              className="pos-btn-primary"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                background: phoneInput && !isProcessing ? 'var(--pos-success)' : '#ccc',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: phoneInput && !isProcessing ? 'pointer' : 'not-allowed',
                opacity: !phoneInput || isProcessing ? 0.5 : 1,
              }}
            >
              Send STK push
            </button>
          </>
        )}
        {status === 'processing' && (
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos-ink)' }}>Processing M-Pesa payment...</div>
            <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 4 }}>
              Check customer's phone for the prompt
            </div>
          </div>
        )}
      </div>
    )
  }

  // Card flow
  if (paymentType === 'card') {
    return (
      <div style={{ marginBottom: 14 }}>
        {status === 'idle' && (
          <button
            onClick={initiateCard}
            className="pos-btn-primary"
            style={{
              width: '100%',
              padding: '13px 14px',
              borderRadius: 10,
              background: '#3b82f6',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Generate Payment QR
          </button>
        )}
        {status === 'processing' && (
          <div className="pos-reveal" style={{ padding: '16px', background: 'var(--pos-surface)', borderRadius: 14, border: '1px solid var(--pos-border)' }}>
            {qrCode ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', marginBottom: 12, textAlign: 'center' }}>
                  Scan to pay
                </div>
                <img
                  src={qrCode}
                  alt="Payment QR"
                  style={{ width: '100%', maxWidth: 240, height: 'auto', borderRadius: 8, margin: '0 auto 12px' }}
                />
                <div style={{ fontSize: 12, color: 'var(--pos-muted)', textAlign: 'center' }}>
                  Customer scans with their phone · Tap Apple Pay or card
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--pos-muted)' }}>
                <div>Generating QR code...</div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return null
}
