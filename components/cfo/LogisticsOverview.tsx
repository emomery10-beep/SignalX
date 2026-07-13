'use client'

import { useLang } from '@/components/LanguageProvider'

interface LogisticsData {
  in_transit_count: number
  in_transit_value: number
  delayed_count: number
  delayed_value: number
  at_risk_count: number
  financing_cost: number
  avg_delivery_days: number
}

interface Props {
  data: LogisticsData
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

export default function LogisticsOverview({ data, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()

  if (data.in_transit_count === 0) {
    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_logistics.title')}</span>
        </div>
        <div style={{ padding: '20px 18px', textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>
          {tc('cfo_logistics.emptyState')}
        </div>
      </div>
    )
  }

  const hasDelays = data.delayed_count > 0
  const statusColor = hasDelays ? '#EF4444' : '#22C55E'

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_logistics.title')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_logistics.provider')}</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(tc('cfo_logistics.askPrompt', {
              inTransitCount: data.in_transit_count,
              inTransitValue: fmt(data.in_transit_value, sym),
              delayedCount: data.delayed_count,
              delayedValue: fmt(data.delayed_value, sym),
              financingCost: fmt(data.financing_cost, sym),
              avgDays: data.avg_delivery_days,
            }))}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_logistics.askAi')}
          </button>
        )}
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--b)' }}>
        <MetricCell label={tc('cfo_logistics.metricInTransit')} value={String(data.in_transit_count)} sub={fmt(data.in_transit_value, sym)} color="#F97316" />
        <MetricCell label={tc('cfo_logistics.metricDelayed')} value={String(data.delayed_count)} sub={data.delayed_count > 0 ? fmt(data.delayed_value, sym) : '—'} color={hasDelays ? '#EF4444' : '#22C55E'} />
        <MetricCell label={tc('cfo_logistics.metricAvgDelivery')} value={`${data.avg_delivery_days}d`} sub={tc('cfo_logistics.workingCapitalDays')} color="#6366F1" />
        <MetricCell label={tc('cfo_logistics.metricFinanceCost')} value={fmt(data.financing_cost, sym)} sub={tc('cfo_logistics.capitalTiedUp')} color={data.financing_cost > 0 ? '#EF4444' : '#22C55E'} />
      </div>

      {/* Status bar */}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{tc('cfo_logistics.shipmentHealth')}</div>
        <div style={{ height: 22, borderRadius: 6, overflow: 'hidden', display: 'flex', background: 'var(--ev, #e5e5e5)' }}>
          {data.in_transit_count - data.delayed_count > 0 && (
            <div style={{
              width: `${((data.in_transit_count - data.delayed_count) / data.in_transit_count) * 100}%`,
              background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{tc('cfo_logistics.onTime', { n: data.in_transit_count - data.delayed_count })}</span>
            </div>
          )}
          {data.delayed_count > 0 && (
            <div style={{
              width: `${(data.delayed_count / data.in_transit_count) * 100}%`,
              background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{tc('cfo_logistics.delayedCount', { n: data.delayed_count })}</span>
            </div>
          )}
        </div>

        {data.at_risk_count > 0 && (
          <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.15)', fontSize: 11, color: '#EF4444', fontWeight: 500 }}>
            {tc('cfo_logistics.atRiskWarning', { n: data.at_risk_count })}
          </div>
        )}

        {data.in_transit_value > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>
            {tc('cfo_logistics.inTransitSummary', { value: fmt(data.in_transit_value, sym), days: data.avg_delivery_days })}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCell({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>{sub}</div>
    </div>
  )
}
