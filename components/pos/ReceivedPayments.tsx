'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface ReceivedPayment {
  id: string
  amount: number
  payment_method: string
  provider: string
  receipt?: string | null
  customer_phone?: string | null
  customer_name?: string | null
  cashier_name?: string | null
  completed_at: string
  payment_status?: string
}

interface Props {
  currencySymbol: string
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E'
const INDIGO = '#6366F1'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${sym}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sym}${(abs / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(abs).toLocaleString()}`
}

const METHOD_ICONS: Record<string, string> = {
  mpesa: '📱',
  mobile: '📱',
  card: '💳',
  apple_pay: '🍎',
  google_pay: '🟢',
}

export default function ReceivedPayments({ currencySymbol: sym }: Props) {
  const { tc } = useLang()
  const [payments, setPayments] = useState<ReceivedPayment[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return tc('pos_receivedpay.justNow')
    if (mins < 60) return tc('pos_receivedpay.minutesAgo').replace('{mins}', String(mins))
    const h = Math.floor(mins / 60)
    if (h < 24) return tc('pos_receivedpay.hoursAgo').replace('{h}', String(h))
    const d = Math.floor(h / 24)
    return tc('pos_receivedpay.daysAgo').replace('{d}', String(d))
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/pos/dunning/received')
      if (res.ok) {
        const data = await res.json()
        setPayments(data.payments || [])
        setTotal(data.total || 0)
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const hasData = payments.length > 0

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: GREEN }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('pos_receivedpay.title')}</span>
          {hasData && (
            <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(34,197,94,.08)', color: GREEN }}>
              {tc('pos_receivedpay.headerBadge').replace('{count}', String(payments.length)).replace('{total}', fmt(total, sym))}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Summary stats */}
        {hasData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{tc('pos_receivedpay.statReceivedLabel')}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{payments.length}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>{tc('pos_receivedpay.statReceivedSub')}</div>
            </div>
            <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{tc('pos_receivedpay.statTotalLabel')}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{fmt(total, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>{tc('pos_receivedpay.statTotalSub')}</div>
            </div>
            <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{tc('pos_receivedpay.statAvgLabel')}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(payments.length > 0 ? total / payments.length : 0, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>{tc('pos_receivedpay.statAvgSub')}</div>
            </div>
          </div>
        )}

        {/* Payment list */}
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 10 }}>{tc('pos_receivedpay.loading')}</div>
        ) : !hasData ? (
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_receivedpay.emptyTitle')}</div>
            <p style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5, margin: '6px 0 0' }}>
              {tc('pos_receivedpay.emptyBody')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
            {payments.map(payment => (
              <div key={payment.id} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(34,197,94,.15)', background: 'rgba(34,197,94,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{METHOD_ICONS[payment.payment_method] || '💳'}</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>
                        {payment.customer_phone || payment.customer_name || payment.cashier_name || tc('pos_receivedpay.defaultCustomer')}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>
                        <span style={{ textTransform: 'capitalize' }}>{payment.payment_method?.replace('_', ' ')}</span>
                        {payment.provider && <span> · {payment.provider}</span>}
                        {' · '}{timeAgo(payment.completed_at)}
                        {payment.receipt && <span> · #{payment.receipt.slice(0, 10)}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(payment.amount, sym)}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 9999, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', color: GREEN }}>
                      {payment.payment_status === 'paid' ? tc('pos_receivedpay.statusPaid') : tc('pos_receivedpay.statusReceived')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
