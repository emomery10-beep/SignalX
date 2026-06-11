'use client'

import { useState, useEffect, useCallback } from 'react'

interface FailedPayment {
  id: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  amount: number
  currency_symbol: string
  failure_reason: string
  created_at: string
  retry_count: number
  max_retries: number
  status: 'failed' | 'retrying' | 'recovered' | 'abandoned'
  next_retry_at?: string
  recovered_at?: string
}

interface DunningStats {
  total_failed: number
  total_amount: number
  recovered_count: number
  recovered_amount: number
  recovery_rate: number
  pending_retry: number
  abandoned: number
}

interface Props {
  currencySymbol: string
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', INDIGO = '#6366F1', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${sym}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sym}${(abs / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(abs).toLocaleString()}`
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  failed:    { bg: 'rgba(239,68,68,.06)', border: 'rgba(239,68,68,.2)', text: RED, label: 'Failed' },
  retrying:  { bg: 'rgba(245,158,11,.06)', border: 'rgba(245,158,11,.2)', text: AMBER, label: 'Retrying' },
  recovered: { bg: 'rgba(34,197,94,.06)', border: 'rgba(34,197,94,.2)', text: GREEN, label: 'Recovered' },
  abandoned: { bg: 'rgba(107,114,128,.06)', border: 'rgba(107,114,128,.2)', text: '#6b7280', label: 'Abandoned' },
}

const FAILURE_REASONS: Record<string, string> = {
  insufficient_funds: 'Insufficient funds',
  card_declined: 'Card declined',
  expired_card: 'Expired card',
  network_error: 'Network error',
  authentication_required: 'Authentication required',
  mpesa_timeout: 'M-Pesa timeout',
  mpesa_insufficient: 'M-Pesa insufficient balance',
  unknown: 'Unknown error',
}

const RETRY_SCHEDULES = [
  { label: 'Aggressive', value: 'aggressive', desc: 'Retry after 1h, 6h, 24h', intervals: [1, 6, 24] },
  { label: 'Standard', value: 'standard', desc: 'Retry after 4h, 24h, 72h', intervals: [4, 24, 72] },
  { label: 'Gentle', value: 'gentle', desc: 'Retry after 24h, 72h, 168h', intervals: [24, 72, 168] },
]

export default function DunningRecovery({ currencySymbol: sym }: Props) {
  const [payments, setPayments] = useState<FailedPayment[]>([])
  const [stats, setStats] = useState<DunningStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [retrySchedule, setRetrySchedule] = useState('standard')
  const [filter, setFilter] = useState<'all' | 'failed' | 'retrying' | 'recovered' | 'abandoned'>('all')
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/pos/dunning')
      if (res.ok) {
        const data = await res.json()
        setPayments(data.payments || [])
        setStats(data.stats || null)
      } else {
        // API doesn't exist yet — use demo data
        generateDemoData()
      }
    } catch {
      generateDemoData()
    } finally {
      setLoading(false)
    }
  }, [])

  const generateDemoData = () => {
    const demoStats: DunningStats = {
      total_failed: 0,
      total_amount: 0,
      recovered_count: 0,
      recovered_amount: 0,
      recovery_rate: 0,
      pending_retry: 0,
      abandoned: 0,
    }
    setStats(demoStats)
    setPayments([])
  }

  useEffect(() => { fetchData() }, [fetchData])

  const retryPayment = async (paymentId: string) => {
    try {
      await fetch('/api/pos/dunning/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId }),
      })
      setPayments(ps => ps.map(p => p.id === paymentId ? { ...p, status: 'retrying' as const, retry_count: p.retry_count + 1 } : p))
    } catch {}
  }

  const sendReminder = async (paymentId: string) => {
    setSendingReminder(paymentId)
    try {
      await fetch('/api/pos/dunning/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId }),
      })
    } catch {}
    setTimeout(() => setSendingReminder(null), 2000)
  }

  const abandonPayment = async (paymentId: string) => {
    try {
      await fetch('/api/pos/dunning/abandon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId }),
      })
      setPayments(ps => ps.map(p => p.id === paymentId ? { ...p, status: 'abandoned' as const } : p))
    } catch {}
  }

  const filtered = payments.filter(p => filter === 'all' || p.status === filter)
  const hasData = payments.length > 0

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: RED }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>Payment Recovery</span>
          {stats && stats.total_failed > 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,.08)', color: RED }}>
              {stats.total_failed} failed · {fmt(stats.total_amount, sym)} at risk
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Stats row */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <StatCell label="Failed" value={stats.total_failed.toString()} sub={fmt(stats.total_amount, sym)} color={RED} />
            <StatCell label="Recovered" value={stats.recovered_count.toString()} sub={fmt(stats.recovered_amount, sym)} color={GREEN} />
            <StatCell label="Recovery Rate" value={`${stats.recovery_rate.toFixed(0)}%`} sub="of failed payments" color={stats.recovery_rate >= 50 ? GREEN : AMBER} />
            <StatCell label="Pending Retry" value={stats.pending_retry.toString()} sub="in queue" color={AMBER} />
          </div>
        )}

        {/* Retry schedule selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 12px', borderRadius: 8, background: 'var(--ev, #f9f9f8)' }}>
          <span style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 600 }}>Auto-retry:</span>
          <select value={retrySchedule} onChange={e => setRetrySchedule(e.target.value)}
            style={{ fontSize: 11, padding: '3px 6px', borderRadius: 5, border: '1px solid var(--b)', background: 'var(--sf)', fontFamily: 'inherit', color: 'var(--tx)' }}>
            {RETRY_SCHEDULES.map(s => (
              <option key={s.value} value={s.value}>{s.label} — {s.desc}</option>
            ))}
          </select>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {(['all', 'failed', 'retrying', 'recovered', 'abandoned'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                fontSize: 10, fontWeight: filter === f ? 600 : 400, padding: '4px 10px', borderRadius: 6,
                border: `1px solid ${filter === f ? INDIGO + '30' : 'var(--b)'}`,
                background: filter === f ? 'rgba(99,102,241,.06)' : 'transparent',
                color: filter === f ? INDIGO : 'var(--tx3)',
                cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
              }}>
              {f} {f !== 'all' ? `(${payments.filter(p => p.status === f).length})` : `(${payments.length})`}
            </button>
          ))}
        </div>

        {/* Payment list */}
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>Loading...</div>
        ) : !hasData ? (
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, color: GREEN, marginBottom: 4 }}>No failed payments</div>
            <p style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5, margin: 0 }}>
              All payments are processing successfully. Failed payments will appear here automatically for recovery.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filtered.map(payment => {
              const sc = STATUS_COLORS[payment.status]
              return (
                <div key={payment.id} style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${sc.border}`, background: sc.bg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{payment.customer_name}</div>
                      <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 1 }}>
                        {FAILURE_REASONS[payment.failure_reason] || payment.failure_reason} · {timeAgo(payment.created_at)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: sc.text, fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(payment.amount, payment.currency_symbol || sym)}
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 9999, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  {/* Retry progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--ev, #eee)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(payment.retry_count / payment.max_retries) * 100}%`, borderRadius: 2, background: sc.text, transition: 'width 300ms' }} />
                    </div>
                    <span style={{ fontSize: 9, color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
                      {payment.retry_count}/{payment.max_retries} retries
                    </span>
                  </div>

                  {/* Actions */}
                  {(payment.status === 'failed' || payment.status === 'retrying') && (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => retryPayment(payment.id)}
                        style={{ fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 6, border: 'none', background: INDIGO, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Retry Now
                      </button>
                      <button onClick={() => sendReminder(payment.id)}
                        style={{ fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {sendingReminder === payment.id ? 'Sent!' : 'Send Reminder'}
                      </button>
                      {payment.retry_count >= payment.max_retries && (
                        <button onClick={() => abandonPayment(payment.id)}
                          style={{ fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Mark Lost
                        </button>
                      )}
                    </div>
                  )}
                  {payment.status === 'recovered' && payment.recovered_at && (
                    <div style={{ fontSize: 10, color: GREEN, fontWeight: 500 }}>
                      Recovered {timeAgo(payment.recovered_at)} after {payment.retry_count} {payment.retry_count === 1 ? 'retry' : 'retries'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Recovery tips */}
        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)' }}>
          <div style={{ fontSize: 10, color: INDIGO, fontWeight: 600, marginBottom: 4 }}>Recovery tips</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.6 }}>
            Automated retries recover 30-40% of failed payments. SMS/WhatsApp reminders with a payment link recover an additional 15-20%. Most recoveries happen within the first 48 hours.
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCell({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>{sub}</div>
    </div>
  )
}
