'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  currencySymbol: string
  onAsk: (prompt: string) => void
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${sym}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sym}${(abs / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(abs).toLocaleString()}`
}

export default function RecoveredRevenue({ currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [stats, setStats] = useState<{
    total_failed: number; total_amount: number
    recovered_count: number; recovered_amount: number
    recovery_rate: number; pending_retry: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/pos/dunning')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.stats) setStats(data.stats) })
      .catch(() => {})
  }, [])

  // Don't show if no dunning data
  if (!stats || (stats.total_failed === 0 && stats.recovered_count === 0)) return null

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: GREEN }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_recovered.title')}</span>
        </div>
        <button onClick={() => onAsk(tc('cfo_recovered.askPrompt', {
            failedCount: stats.total_failed,
            totalAmount: fmt(stats.total_amount, sym),
            recoveredAmount: fmt(stats.recovered_amount, sym),
            recoveryRate: stats.recovery_rate.toFixed(0),
            pendingRetry: stats.pending_retry,
          }))}
          style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          {tc('cfo_recovered.askAi')}
        </button>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>{tc('cfo_recovered.atRisk')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(stats.total_amount, sym)}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_recovered.failedPayments', { n: stats.total_failed })}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>{tc('cfo_recovered.recovered')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{fmt(stats.recovered_amount, sym)}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_recovered.payments', { n: stats.recovered_count })}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>{tc('cfo_recovered.recoveryRate')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: stats.recovery_rate >= 50 ? GREEN : stats.recovery_rate >= 25 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
              {stats.recovery_rate.toFixed(0)}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_recovered.pending', { n: stats.pending_retry })}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
