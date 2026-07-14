'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

const API = process.env.NEXT_PUBLIC_API_URL || ''

export type WaafiWallet = 'evc_plus' | 'waafi' | 'zaad' | 'sahal'

const WALLET_META: Record<WaafiWallet, { labelKey: string; askKey: string; emoji: string }> = {
  evc_plus: { labelKey: 'sell.evc_payment', askKey: 'sell.wallet_ask_number', emoji: '📲' },
  waafi:    { labelKey: 'sell.waafi_payment', askKey: 'sell.wallet_ask_number', emoji: '📲' },
  zaad:     { labelKey: 'sell.zaad_payment', askKey: 'sell.wallet_ask_number', emoji: '📲' },
  sahal:    { labelKey: 'sell.sahal_payment', askKey: 'sell.wallet_ask_number', emoji: '📲' },
}

interface PosWaafiPaymentProps {
  transactionId: string
  amount: number
  currencySymbol?: string
  ownerId: string
  staffId: string
  wallet: WaafiWallet
  customerPhone?: string
  autoSend?: boolean
  onPaymentComplete: () => void
  onPaymentFailed: (error: string) => void
}

export default function PosWaafiPayment({
  transactionId,
  amount,
  currencySymbol = '$',
  ownerId,
  staffId,
  wallet,
  customerPhone = '',
  autoSend = false,
  onPaymentComplete,
  onPaymentFailed,
}: PosWaafiPaymentProps) {
  const { tc } = useLang()
  const supabase = createClient()
  const [status, setStatus] = useState<'idle' | 'sending' | 'waiting' | 'completed' | 'failed'>('idle')
  const [phoneInput, setPhoneInput] = useState(customerPhone)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const walletLabel = tc(WALLET_META[wallet].labelKey)

  useEffect(() => {
    if (autoSend && customerPhone && status === 'idle') {
      sendPrompt(customerPhone)
    } else if (status === 'idle') {
      inputRef.current?.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Supabase Realtime for payment updates
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
          setErrorMsg(tc('sell.payment_failed_retry'))
          onPaymentFailed(tc('sell.payment_failed_retry'))
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
        setErrorMsg(tc('sell.payment_timed_out'))
        onPaymentFailed(tc('sell.payment_timed_out'))
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
          setErrorMsg(tc('sell.payment_declined'))
          onPaymentFailed(tc('sell.payment_declined'))
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

  const sendPrompt = async (overridePhone?: string) => {
    const phone = overridePhone || phoneInput
    if (!phone.trim()) return
    if (overridePhone) setPhoneInput(overridePhone)
    setStatus('sending')
    setErrorMsg(null)

    try {
      const res = await fetch(`${API}/api/pos/payment/evc-plus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-id': ownerId,
          'x-staff-id': staffId,
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          customer_phone: phone,
          wallet,
          amount,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('idle')
        setErrorMsg(data.error || tc('sell.mpesa_send_failed'))
        return
      }

      setPaymentId(data.payment_id)
      setStatus('waiting')
    } catch (err: any) {
      setStatus('idle')
      setErrorMsg(tc('sell.network_error'))
    }
  }

  const GREEN = '#16a34a'
  const ACC = '#d08a59'

  // Idle — enter phone number
  if (status === 'idle') return (
    <div style={{ marginTop: 14 }}>
      <div style={{ padding: '12px 16px', background: GREEN, borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{walletLabel}</span>
        <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{currencySymbol}{amount.toFixed(2)}</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e2dc', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6760', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {tc(WALLET_META[wallet].askKey, { wallet: walletLabel })}
        </div>

        {errorMsg && (
          <div style={{ marginBottom: 10, padding: '10px 12px', background: 'rgba(220,38,38,.07)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 10, fontSize: 12, color: '#dc2626', fontWeight: 500 }}>
            ⚠ {errorMsg}
          </div>
        )}

        <input
          ref={inputRef}
          type="tel"
          placeholder="+252 61 XXX XXXX"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && phoneInput && sendPrompt(undefined)}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 12,
            border: `2px solid ${errorMsg ? 'rgba(220,38,38,.4)' : '#e5e2dc'}`,
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
          onClick={() => sendPrompt()}
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
          📲 {tc('sell.mpesa_send_prompt')}
        </button>

        <div style={{ marginTop: 10, fontSize: 11, color: '#78736d', textAlign: 'center' }}>
          {tc('sell.mpesa_popup_hint')}
        </div>
      </div>
    </div>
  )

  // Sending
  if (status === 'sending') return (
    <div style={{ marginTop: 14, padding: '24px 16px', background: '#fff', borderRadius: 16, border: '1px solid #e5e2dc', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>📲</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1916' }}>{tc('sell.mpesa_sending_to', { phone: phoneInput })}</div>
      <div style={{ fontSize: 12, color: '#6b6760', marginTop: 4 }}>{tc('sell.just_a_moment')}</div>
    </div>
  )

  // Waiting for customer PIN
  if (status === 'waiting') return (
    <div style={{ marginTop: 14 }}>
      <div style={{ padding: '12px 16px', background: GREEN, borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{tc('sell.mpesa_waiting_customer')}</span>
        <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{currencySymbol}{amount.toFixed(2)}</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e2dc', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>
          {tc('sell.mpesa_check_phone')}
        </div>
        <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 16 }}>
          {tc('sell.mpesa_prompt_sent')} <strong>{phoneInput}</strong>
          <br />{tc('sell.mpesa_enter_pin')}
        </div>

        <div style={{ padding: '10px', background: 'rgba(22,163,74,.06)', borderRadius: 10, border: '1px solid rgba(22,163,74,.15)', marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>
            ⏳ {tc('sell.mpesa_waiting_pin')}
          </div>
          <div style={{ fontSize: 11, color: '#6b6760', marginTop: 2 }}>
            {tc('sell.updates_automatically')}
          </div>
        </div>

        <button
          onClick={() => { setStatus('idle'); setErrorMsg(null) }}
          style={{ fontSize: 12, color: '#6b6760', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {tc('sell.mpesa_wrong_number')}
        </button>
      </div>
    </div>
  )

  // Completed
  if (status === 'completed') return (
    <div style={{ marginTop: 14, padding: '24px', background: 'rgba(22,163,74,.06)', border: '2px solid rgba(22,163,74,.3)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>{tc('sell.mpesa_received')}</div>
      <div style={{ fontSize: 13, color: '#6b6760', marginTop: 4 }}>{tc('sell.mpesa_from_phone', { amount: `${currencySymbol}${amount.toFixed(2)}`, phone: phoneInput })}</div>
    </div>
  )

  // Failed
  if (status === 'failed') return (
    <div style={{ marginTop: 14, padding: '20px 16px', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>❌</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 8 }}>
        {tc('sell.payment_failed_or_timeout')}
      </div>
      {errorMsg && <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 12 }}>{errorMsg}</div>}
      <button onClick={() => { setStatus('idle'); setErrorMsg(null) }} style={{ padding: '10px 20px', borderRadius: 10, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
        {tc('sell.try_again')}
      </button>
    </div>
  )

  return null
}
