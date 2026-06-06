'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const API = process.env.NEXT_PUBLIC_API_URL || ''

interface PosMobilePaymentProps {
  transactionId: string
  amount: number
  currencySymbol?: string
  ownerId: string
  staffId: string
  customerPhone?: string
  onPaymentComplete: () => void
  onPaymentFailed: (error: string) => void
}

export default function PosMobilePayment({
  transactionId,
  amount,
  currencySymbol = 'KSh',
  ownerId,
  staffId,
  customerPhone = '',
  onPaymentComplete,
  onPaymentFailed,
}: PosMobilePaymentProps) {
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'sending' | 'waiting' | 'completed' | 'failed'>('idle')
  const [phoneInput, setPhoneInput] = useState(customerPhone)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus phone input
    if (status === 'idle') inputRef.current?.focus()
  }, [status])

  // Listen to Supabase Realtime for payment updates
  useEffect(() => {
    if (!transactionId || status !== 'waiting') return

    const channel = supabase
      .channel(`pos_payments_${transactionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pos_payments',
        filter: `transaction_id=eq.${transactionId}`,
      }, (payload) => {
        const payment = payload.new
        if (payment.status === 'completed') {
          playSuccessSound()
          setStatus('completed')
          onPaymentComplete()
        } else if (payment.status === 'failed') {
          setStatus('failed')
          onPaymentFailed('Payment failed. Please try again.')
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [transactionId, status])

  // Polling fallback
  useEffect(() => {
    if (status !== 'waiting' || !paymentId) return

    let attempts = 0
    const timer = setInterval(async () => {
      attempts++
      if (attempts > 90) {
        clearInterval(timer)
        setStatus('failed')
        onPaymentFailed('Payment timed out. Please try again.')
        return
      }
      try {
        const res = await fetch(`${API}/api/pos/payment/status?payment_id=${paymentId}`, {
          headers: { 'x-owner-id': ownerId, 'x-staff-id': staffId },
        })
        const data = await res.json()
        if (data.status === 'completed') {
          clearInterval(timer)
          playSuccessSound()
          setStatus('completed')
          onPaymentComplete()
        } else if (data.status === 'failed') {
          clearInterval(timer)
          setStatus('failed')
          onPaymentFailed('Payment declined.')
        }
      } catch {}
    }, 2000)

    return () => clearInterval(timer)
  }, [status, paymentId])

  const playSuccessSound = () => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch {}
  }

  const sendMpesaPrompt = async () => {
    if (!phoneInput.trim()) return
    setStatus('sending')

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
        onPaymentFailed(data.error || 'Could not send M-Pesa prompt')
        return
      }

      setPaymentId(data.payment_id)
      setStatus('waiting')
    } catch (err: any) {
      setStatus('failed')
      onPaymentFailed(err.message || 'Network error')
    }
  }

  const GREEN = '#16a34a'
  const ACC = '#d08a59'

  // Idle — enter phone number
  if (status === 'idle') return (
    <div style={{ marginTop: 14 }}>
      {/* Amount banner */}
      <div style={{ padding: '12px 16px', background: GREEN, borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>M-Pesa payment</span>
        <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{currencySymbol}{amount.toFixed(2)}</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e2dc', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ask customer for their M-Pesa number
        </div>

        <input
          ref={inputRef}
          type="tel"
          placeholder="07XX XXX XXX"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && phoneInput && sendMpesaPrompt()}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 12,
            border: '2px solid #e5e2dc',
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'inherit',
            background: '#fff',
            color: '#1a1916',
            boxSizing: 'border-box',
            marginBottom: 10,
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        />

        <button
          onClick={sendMpesaPrompt}
          disabled={!phoneInput.trim()}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            background: phoneInput.trim() ? GREEN : '#d1d5db',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            border: 'none',
            cursor: phoneInput.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          📲 Send M-Pesa prompt
        </button>

        <div style={{ marginTop: 10, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
          Customer will get a popup on their phone to confirm payment
        </div>
      </div>
    </div>
  )

  // Sending
  if (status === 'sending') return (
    <div style={{ marginTop: 14, padding: '24px 16px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>📲</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1916' }}>Sending to {phoneInput}...</div>
      <div style={{ fontSize: 12, color: '#6b6760', marginTop: 4 }}>Just a moment</div>
    </div>
  )

  // Waiting for customer to approve on phone
  if (status === 'waiting') return (
    <div style={{ marginTop: 14 }}>
      <div style={{ padding: '12px 16px', background: GREEN, borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Waiting for customer</span>
        <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{currencySymbol}{amount.toFixed(2)}</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e2dc', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>
          Check their phone
        </div>
        <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 16 }}>
          M-Pesa prompt sent to <strong>{phoneInput}</strong>
          <br />Ask them to enter their M-Pesa PIN to confirm
        </div>

        <div style={{ padding: '10px', background: 'rgba(22,163,74,.06)', borderRadius: 10, border: '1px solid rgba(22,163,74,.15)', marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>
            ⏳ Waiting for PIN confirmation...
          </div>
          <div style={{ fontSize: 11, color: '#6b6760', marginTop: 2 }}>
            Updates automatically when paid
          </div>
        </div>

        <button
          onClick={() => setStatus('idle')}
          style={{ fontSize: 12, color: '#6b6760', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Wrong number? Send again
        </button>
      </div>
    </div>
  )

  // Completed
  if (status === 'completed') return (
    <div style={{ marginTop: 14, padding: '24px', background: 'rgba(22,163,74,.06)', border: '2px solid rgba(22,163,74,.3)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>M-Pesa payment received!</div>
      <div style={{ fontSize: 13, color: '#6b6760', marginTop: 4 }}>{currencySymbol}{amount.toFixed(2)} from {phoneInput}</div>
    </div>
  )

  // Failed
  if (status === 'failed') return (
    <div style={{ marginTop: 14, padding: '20px 16px', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>❌</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 12 }}>
        Payment failed or timed out
      </div>
      <button onClick={() => setStatus('idle')} style={{ padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )

  return null
}
