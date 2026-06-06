'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const API = process.env.NEXT_PUBLIC_API_URL || ''

interface PosMobilePaymentProps {
  transactionId: string
  amount: number
  ownerId: string
  staffId: string
  customerPhone?: string
  onPaymentComplete: () => void
  onPaymentFailed: (error: string) => void
}

export default function PosMobilePayment({
  transactionId,
  amount,
  ownerId,
  staffId,
  customerPhone = '',
  onPaymentComplete,
  onPaymentFailed,
}: PosMobilePaymentProps) {
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle')
  const [phoneInput, setPhoneInput] = useState(customerPhone)
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

  const initiateMpesa = async () => {
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
        <>
          <input
            type="tel"
            placeholder="Customer M-Pesa number"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            disabled={status === 'processing'}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 10,
              border: '1.5px solid #e5e2dc',
              fontSize: 15,
              fontFamily: 'inherit',
              background: '#fff',
              color: '#1a1916',
              boxSizing: 'border-box',
              marginBottom: 8,
            }}
          />
          <button
            onClick={initiateMpesa}
            disabled={!phoneInput || status === 'processing'}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 10,
              background: phoneInput && status !== 'processing' ? '#16a34a' : '#ccc',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: phoneInput && status !== 'processing' ? 'pointer' : 'not-allowed',
            }}
          >
            Send STK Push
          </button>
        </>
      )}

      {status === 'processing' && (
        <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1916' }}>Processing M-Pesa payment...</div>
          <div style={{ fontSize: 12, color: '#6b6760', marginTop: 4 }}>
            Check customer's phone for the prompt
          </div>
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
