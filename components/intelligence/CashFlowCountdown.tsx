'use client'
import { useState, useEffect } from 'react'

interface CashFlowData {
  runway: { days: number | null; label: string; status: string }
  cash: { balance: number; has_balance: boolean }
  daily: { revenue: number; cogs: number; fixed: number; net_burn: number; gross_profit: number; breakeven: number; breakeven_gap: number }
  monthly: { revenue: number; cogs: number; fixed_costs: number; net: number; has_fixed_costs: boolean }
  trend: { revenue_pct: number; burn_improving: boolean }
  weekly_flow: { week: string; net: number }[]
  data_quality: { days_with_data: number; has_ecommerce: boolean; has_pos: boolean }
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,.06)', icon: '🔴' },
  warning:  { color: '#F59E0B', bg: 'rgba(245,158,11,.06)', icon: '🟡' },
  healthy:  { color: '#10B981', bg: 'rgba(16,185,129,.06)', icon: '🟢' },
  strong:   { color: '#6366F1', bg: 'rgba(99,102,241,.06)', icon: '💪' },
  unknown:  { color: 'var(--tx3)', bg: 'var(--sf)', icon: '⏳' },
}

export default function CashFlowCountdown({ onAsk }: { onAsk?: (prompt: string) => void }) {
  const [data, setData] = useState<CashFlowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/cashflow-countdown')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#10B981' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Cash Flow</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2].map(i => (
            <div key={i} style={{ height: 40, borderRadius: 12, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) return null
  if (data.data_quality.days_with_data === 0) return null

  const cfg = STATUS_CONFIG[data.runway.status] || STATUS_CONFIG.unknown
  const weekly = data.weekly_flow
  const maxAbs = Math.max(...weekly.map(w => Math.abs(w.net)), 1)

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000) return `£${(n / 1000).toFixed(1)}k`
    return `£${Math.round(n)}`
  }

  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, border: `1px solid ${data.runway.status === 'critical' ? 'rgba(239,68,68,.2)' : 'var(--b)'}`, background: cfg.bg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#10B981' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Cash Flow</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk('Analyse my cash flow and runway. What should I do to improve it?')}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >Ask AI</button>
        )}
      </div>

      {/* Runway hero */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 24 }}>{cfg.icon}</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: cfg.color, lineHeight: 1.2 }}>
            {data.runway.label}
          </div>
          {data.cash.has_balance && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>
              {fmt(data.cash.balance)} balance
              {data.trend.revenue_pct !== 0 && (
                <span style={{ marginLeft: 6, color: data.trend.revenue_pct > 0 ? '#10B981' : '#EF4444' }}>
                  {data.trend.revenue_pct > 0 ? '↑' : '↓'} {Math.abs(data.trend.revenue_pct)}% revenue
                </span>
              )}
            </div>
          )}
          {!data.cash.has_balance && data.runway.status === 'unknown' && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>
              Add your cash balance in settings for runway tracking
            </div>
          )}
        </div>
      </div>

      {/* Daily breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        <MetricBox label="Daily revenue" value={fmt(data.daily.revenue)} color="#10B981" />
        <MetricBox label="Daily costs" value={fmt(data.daily.cogs + data.daily.fixed)} color="#EF4444" />
        <MetricBox label="Daily net" value={`${data.daily.net_burn >= 0 ? '+' : ''}${fmt(data.daily.net_burn)}`} color={data.daily.net_burn >= 0 ? '#10B981' : '#EF4444'} />
      </div>

      {/* Weekly cash flow sparkline */}
      {weekly.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 6, fontWeight: 600 }}>Weekly net cash flow</div>
          <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: 40 }}>
            {weekly.map((w, i) => {
              const h = Math.max(2, (Math.abs(w.net) / maxAbs) * 36)
              const isPositive = w.net >= 0
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 40 }}>
                  <div
                    style={{
                      width: '100%', maxWidth: 20, height: h, borderRadius: 3,
                      background: isPositive ? 'rgba(16,185,129,.5)' : 'rgba(239,68,68,.4)',
                    }}
                    title={`${w.week}: ${fmt(w.net)}`}
                  />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 9, color: 'var(--tx3)' }}>12w ago</span>
            <span style={{ fontSize: 9, color: 'var(--tx3)' }}>This week</span>
          </div>
        </div>
      )}

      {/* Monthly summary */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px', borderRadius: 10,
        border: '1px solid var(--b)', background: 'var(--sf)',
        fontSize: 11, color: 'var(--tx3)',
      }}>
        <span>Monthly: {fmt(data.monthly.revenue)} in, {fmt(data.monthly.cogs + data.monthly.fixed_costs)} out</span>
        <span style={{ fontWeight: 700, color: data.monthly.net >= 0 ? '#10B981' : '#EF4444' }}>
          {data.monthly.net >= 0 ? '+' : ''}{fmt(data.monthly.net)}
        </span>
      </div>

      {/* Breakeven indicator */}
      {data.daily.breakeven > 0 && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--tx3)', textAlign: 'center' }}>
          {data.daily.breakeven_gap >= 0
            ? <span>Earning <strong style={{ color: '#10B981' }}>{fmt(data.daily.breakeven_gap)}/day</strong> above breakeven</span>
            : <span>Need <strong style={{ color: '#EF4444' }}>{fmt(Math.abs(data.daily.breakeven_gap))}/day</strong> more to break even</span>
          }
        </div>
      )}
    </div>
  )
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}
