'use client'

import { useState, useEffect } from 'react'

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
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>Payment Recovery</span>
        </div>
        <button onClick={() => onAsk(`We have ${stats.total_failed} failed payments totalling ${fmt(stats.total_amount, sym)}. We've recovered ${fmt(stats.recovered_amount, sym)} (${stats.recovery_rate.toFixed(0)}% rate). ${stats.pending_retry} payments pending retry. How can we improve our recovery rate?`)}
          style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          Ask AI
        </button>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>At Risk</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: RED, fontVariantNumeric: 'tabular-nums' }}>{fmt(stats.total_amount, sym)}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{stats.total_failed} failed payments</div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>Recovered</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{fmt(stats.recovered_amount, sym)}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{stats.recovered_count} payments</div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 4 }}>Recovery Rate</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: stats.recovery_rate >= 50 ? GREEN : stats.recovery_rate >= 25 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
              {stats.recovery_rate.toFixed(0)}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{stats.pending_retry} pending</div>
          </div>
        </div>
      </div>
    </div>
  )
}
