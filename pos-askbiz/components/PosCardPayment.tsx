'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const API = process.env.NEXT_PUBLIC_API_URL || ''

interface PosCardPaymentProps {
  transactionId: string
  amount: number
  currencySymbol?: string
  ownerId: string
  staffId: string
  stripeVerified?: boolean
  defaultProvider?: 'stripe' | 'paystack' // pre-selected from the checkout screen sub-selector
  onPaymentComplete: () => void
  onPaymentFailed: (error: string) => void
}

export default function PosCardPayment({
  transactionId,
  amount,
  currencySymbol = '£',
  ownerId,
  staffId,
  stripeVerified = false,
  defaultProvider,
  onPaymentComplete,
  onPaymentFailed,
}: PosCardPaymentProps) {
  const supabase = createClient()
  // if defaultProvider is set the cashier already chose on the checkout screen — skip 'select'
  // if stripeVerified but no defaultProvider chosen yet — show 'select' inside this component
  // otherwise go straight to generating
  const initialStatus = defaultProvider ? 'idle' : (stripeVerified ? 'select' : 'idle')
  const [status, setStatus] = useState<'select' | 'generating' | 'waiting' | 'completed' | 'failed'>(initialStatus)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [paymentRef, setPaymentRef] = useState<string | null>(null)
  const [provider, setProvider] = useState<'stripe' | 'paystack' | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Auto-generate QR when component mounts
  // If defaultProvider was passed from checkout screen, use it immediately
  useEffect(() => {
    if (transactionId && status === 'idle') {
      initiateCard(defaultProvider)
    }
  }, [transactionId, status])

  // No auto-open — customer scans QR on their own device

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
    if (status !== 'waiting' || !paymentRef) return

    let attempts = 0
    const timer = setInterval(async () => {
      attempts++
      if (attempts > 90) { // 3 min timeout
        clearInterval(timer)
        setStatus('failed')
        onPaymentFailed('Payment timed out. Please try again.')
        return
      }
      try {
        const res = await fetch(`${API}/api/pos/payment/status?payment_id=${paymentRef}`, {
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
          onPaymentFailed('Payment declined. Try another method.')
        }
      } catch {}
    }, 2000)

    return () => clearInterval(timer)
  }, [status, paymentRef])

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

  const initiateCard = async (forceProvider?: 'stripe' | 'paystack') => {
    const resolvedProvider = forceProvider || defaultProvider
    setStatus('generating')
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
          ...(resolvedProvider ? { force_provider: resolvedProvider } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('failed')
        onPaymentFailed(data.error || 'Could not create payment link')
        return
      }
      setQrCode(data.qr_code)
      setCheckoutUrl(data.checkout_url)
      setPaymentRef(data.payment_id || data.reference)
      setProvider(data.provider || 'paystack')
      setStatus('waiting')
    } catch (err: any) {
      setStatus('failed')
      onPaymentFailed(err.message || 'Network error')
    }
  }

  const ACC = 'var(--pos-accent)'

  // Provider selector — shown when merchant has both Stripe + Paystack
  if (status === 'select') return (
    <div className="pos-sheet" style={{ marginTop: 14, padding: '20px 16px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-muted)', textAlign: 'center', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        How does the customer want to pay?
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Paystack — card via QR */}
        <button
          onClick={() => initiateCard('paystack')}
          className="pos-tab"
          style={{ padding: '16px 10px', borderRadius: 14, border: '2px solid #e5e2dc', background: '#fafaf9', cursor: 'pointer', textAlign: 'center' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--pos-border)')}
        >
          <div style={{ fontSize: 26, marginBottom: 6 }}>💳</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>Card</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 2 }}>Visa · Mastercard</div>
        </button>
        {/* Stripe — Apple Pay / Google Pay */}
        <button
          onClick={() => initiateCard('stripe')}
          className="pos-tab"
          style={{ padding: '16px 10px', borderRadius: 14, border: '2px solid #e5e2dc', background: '#fafaf9', cursor: 'pointer', textAlign: 'center' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#635bff')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--pos-border)')}
        >
          <div style={{ fontSize: 26, marginBottom: 6 }}>🍎</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pos-ink)' }}>Apple / Google Pay</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 2 }}>Tap to pay</div>
        </button>
      </div>
    </div>
  )

  // Generating state
  if (status === 'generating') return (
    <div style={{ marginTop: 14, padding: '24px 16px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos-ink)' }}>Generating payment link...</div>
      <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 4 }}>Just a moment</div>
    </div>
  )

  // Waiting — Stripe: tap-to-pay UI; Paystack: QR code
  if (status === 'waiting') return (
    <div style={{ marginTop: 14 }}>
      {/* Amount banner */}
      <div style={{ padding: '12px 16px', background: ACC, borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Amount due</span>
        <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{currencySymbol}{amount.toFixed(2)}</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e2dc', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '16px' }}>

        {provider === 'stripe' ? (
          /* ── Stripe: QR → customer scans → Apple/Google Pay in their browser ── */
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Show customer this QR code
            </div>

            {qrCode && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img src={qrCode} alt="Scan to pay" className="pos-reveal" style={{ width: 200, height: 200, borderRadius: 12, border: '3px solid #e5e2dc', display: 'block', margin: '0 auto' }} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              <div style={{ padding: '10px 8px', background: 'var(--pos-bg)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>🍎</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Apple Pay</div>
                <div style={{ fontSize: 10, color: 'var(--pos-muted)' }}>iPhone · Apple Watch</div>
              </div>
              <div style={{ padding: '10px 8px', background: 'var(--pos-bg)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>🤖</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Google Pay</div>
                <div style={{ fontSize: 10, color: 'var(--pos-muted)' }}>Android · Chrome</div>
              </div>
            </div>

            {checkoutUrl && (
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--pos-muted)', textDecoration: 'underline' }}>
                  Share payment link instead
                </a>
              </div>
            )}
          </>
        ) : (
          /* ── Paystack: QR code ── */
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pos-muted)', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Show customer this QR code
            </div>

            {qrCode && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img src={qrCode} alt="Scan to pay" className="pos-reveal" style={{ width: 200, height: 200, borderRadius: 12, border: '3px solid #e5e2dc', display: 'block', margin: '0 auto' }} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              <div style={{ padding: '10px 8px', background: 'var(--pos-bg)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>📱</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Scan QR</div>
                <div style={{ fontSize: 10, color: 'var(--pos-muted)' }}>with any camera</div>
              </div>
              <div style={{ padding: '10px 8px', background: 'var(--pos-bg)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>💳</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Enter card</div>
                <div style={{ fontSize: 10, color: 'var(--pos-muted)' }}>Visa · Mastercard</div>
              </div>
            </div>

            {checkoutUrl && (
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--pos-muted)', textDecoration: 'underline' }}>
                  Share payment link instead
                </a>
              </div>
            )}
          </>
        )}

        {/* Waiting indicator — same for both */}
        <div style={{ padding: '10px', background: 'rgba(59,130,246,.06)', borderRadius: 10, border: '1px solid rgba(59,130,246,.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>⏳ Waiting for customer to pay...</div>
          <div style={{ fontSize: 11, color: 'var(--pos-muted)', marginTop: 2 }}>Page updates automatically</div>
        </div>
      </div>
    </div>
  )

  // Completed
  if (status === 'completed') return (
    <div className="pos-reveal" style={{ marginTop: 14, padding: '24px', background: 'rgba(22,163,74,.06)', border: '2px solid rgba(22,163,74,.3)', borderRadius: 16, textAlign: 'center' }}>
      <div className="pos-success-icon" style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--pos-success)' }}>Payment received!</div>
      <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginTop: 4 }}>{currencySymbol}{amount.toFixed(2)} by card</div>
    </div>
  )

  // Failed
  if (status === 'failed') return (
    <div style={{ marginTop: 14, padding: '20px 16px', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>❌</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos-danger)', marginBottom: 12 }}>Payment failed</div>
      <button onClick={initiateCard} style={{ padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )

  return null
}
