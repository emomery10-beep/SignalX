'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const API = process.env.NEXT_PUBLIC_API_URL || ''

interface PosCardPaymentProps {
  transactionId: string
  amount: number
  ownerId: string
  staffId: string
  onPaymentComplete: () => void
  onPaymentFailed: (error: string) => void
}

export default function PosCardPayment({
  transactionId,
  amount,
  ownerId,
  staffId,
  onPaymentComplete,
  onPaymentFailed,
}: PosCardPaymentProps) {
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [paymentRef, setPaymentRef] = useState<string | null>(null)
  const [pollingRef, setPollingRef] = useState<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Listen to Supabase Realtime for payment updates
  useEffect(() => {
    if (!transactionId || status !== 'processing') return

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
    if (!audioRef.current) {
      audioRef.current = new Audio(
        'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
      )
    }
    audioRef.current?.play().catch(() => {})
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
      startPolling(data.payment_id)
    } catch (err: any) {
      setStatus('failed')
      onPaymentFailed(err.message || 'Network error')
    }
  }

  const startPolling = (paymentId: string) => {
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

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e2dc' }}>
      {status === 'idle' && (
        <button
          onClick={initiateCard}
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
        <div style={{ padding: '16px', background: '#fff', borderRadius: 14, border: '1px solid #e5e2dc' }}>
          {qrCode ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 12, textAlign: 'center' }}>
                Scan to pay
              </div>
              <img
                src={qrCode}
                alt="Payment QR"
                style={{ width: '100%', maxWidth: 240, height: 'auto', borderRadius: 8, margin: '0 auto 12px', display: 'block' }}
              />
              <div style={{ fontSize: 12, color: '#6b6760', textAlign: 'center' }}>
                Customer scans with their phone · Tap Apple Pay or card
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b6760' }}>
              <div>Generating QR code...</div>
            </div>
          )}
        </div>
      )}

      {status === 'completed' && (
        <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>✓ Payment completed</div>
        </div>
      )}

      {status === 'failed' && (
        <div style={{ padding: '12px', background: 'rgba(220, 38, 38, 0.05)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>Payment failed. Please try again.</div>
          <button
            onClick={() => setStatus('idle')}
            style={{
              marginTop: 8,
              padding: '8px 12px',
              borderRadius: 6,
              background: '#dc2626',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
