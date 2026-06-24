'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

const API = process.env.NEXT_PUBLIC_API_URL || ''

interface PosCardPaymentProps {
  transactionId: string
  amount: number
  currencySymbol?: string
  ownerId: string
  staffId: string
  onPaymentComplete: () => void
  onPaymentFailed: (error: string) => void
}

export default function PosCardPayment({
  transactionId,
  amount,
  currencySymbol = '£',
  ownerId,
  staffId,
  onPaymentComplete,
  onPaymentFailed,
}: PosCardPaymentProps) {
  const { tc } = useLang()
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'generating' | 'waiting' | 'completed' | 'failed'>('idle')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [paymentRef, setPaymentRef] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Auto-generate QR when component mounts
  useEffect(() => {
    if (transactionId && status === 'idle') {
      initiateCard()
    }
  }, [transactionId])

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
        const res = await fetch(`${API}/api/pos/payment/status?reference=${paymentRef}`, {
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

  const initiateCard = async () => {
    setStatus('generating')
    try {
      const res = await fetch(`${API}/api/pos/payment/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-id': ownerId,
          'x-staff-id': staffId,
        },
        body: JSON.stringify({ transaction_id: transactionId, payment_method: 'card' }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('failed')
        onPaymentFailed(data.error || 'Could not create payment link')
        return
      }
      setQrCode(data.qr_code)
      setCheckoutUrl(data.checkout_url)
      setPaymentRef(data.reference || data.payment_id)
      setStatus('waiting')
    } catch (err: any) {
      setStatus('failed')
      onPaymentFailed(err.message || 'Network error')
    }
  }

  const ACC = '#d08a59'

  // Generating state
  if (status === 'generating') return (
    <div style={{ marginTop: 14, padding: '24px 16px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1916' }}>{tc('pos_cardpayment.generatingTitle')}</div>
      <div style={{ fontSize: 12, color: '#6b6760', marginTop: 4 }}>{tc('pos_cardpayment.generatingSubtitle')}</div>
    </div>
  )

  // Waiting with QR
  if (status === 'waiting') return (
    <div style={{ marginTop: 14 }}>
      {/* Amount banner */}
      <div style={{ padding: '12px 16px', background: ACC, borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{tc('pos_cardpayment.amountDue')}</span>
        <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{currencySymbol}{amount.toFixed(2)}</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e2dc', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '16px' }}>
        {/* Cashier instruction */}
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6760', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {tc('pos_cardpayment.showQrInstruction')}
        </div>

        {/* QR Code */}
        {qrCode && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img
              src={qrCode}
              alt={tc('pos_cardpayment.scanToPayAlt')}
              style={{ width: 200, height: 200, borderRadius: 12, border: '3px solid #e5e2dc', display: 'block', margin: '0 auto' }}
            />
          </div>
        )}

        {/* How to pay */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '10px 8px', background: '#f9f8f6', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>📱</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{tc('pos_cardpayment.scanQrTitle')}</div>
            <div style={{ fontSize: 10, color: '#6b6760' }}>{tc('pos_cardpayment.scanQrSubtitle')}</div>
          </div>
          <div style={{ padding: '10px 8px', background: '#f9f8f6', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>󰀀</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{tc('pos_cardpayment.walletTitle')}</div>
            <div style={{ fontSize: 10, color: '#6b6760' }}>{tc('pos_cardpayment.walletSubtitle')}</div>
          </div>
        </div>

        {/* Waiting indicator */}
        <div style={{ padding: '10px', background: 'rgba(59,130,246,.06)', borderRadius: 10, border: '1px solid rgba(59,130,246,.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
            {tc('pos_cardpayment.waitingMessage')}
          </div>
          <div style={{ fontSize: 11, color: '#6b6760', marginTop: 2 }}>
            {tc('pos_cardpayment.waitingSubtitle')}
          </div>
        </div>

        {/* Fallback link */}
        {checkoutUrl && (
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: '#6b6760', textDecoration: 'underline' }}>
              {tc('pos_cardpayment.shareLink')}
            </a>
          </div>
        )}
      </div>
    </div>
  )

  // Completed
  if (status === 'completed') return (
    <div style={{ marginTop: 14, padding: '24px', background: 'rgba(22,163,74,.06)', border: '2px solid rgba(22,163,74,.3)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#16a34a' }}>{tc('pos_cardpayment.paymentReceived')}</div>
      <div style={{ fontSize: 13, color: '#6b6760', marginTop: 4 }}>{tc('pos_cardpayment.paymentReceivedDetail', { symbol: currencySymbol, amount: amount.toFixed(2) })}</div>
    </div>
  )

  // Failed
  if (status === 'failed') return (
    <div style={{ marginTop: 14, padding: '20px 16px', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>❌</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 12 }}>{tc('pos_cardpayment.paymentFailed')}</div>
      <button onClick={initiateCard} style={{ padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
        {tc('pos_cardpayment.tryAgain')}
      </button>
    </div>
  )

  return null
}
