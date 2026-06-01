'use client'

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
  if (data.in_transit_count === 0) {
    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Logistics & Shipments</span>
        </div>
        <div style={{ padding: '20px 18px', textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>
          No active shipments tracked. Add shipments via the Track17 integration to see logistics impact on working capital.
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
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Logistics & Shipments</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Track17</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(`My shipments: ${data.in_transit_count} in transit worth ${fmt(data.in_transit_value, sym)}, ${data.delayed_count} delayed (${fmt(data.delayed_value, sym)} at risk), financing cost ${fmt(data.financing_cost, sym)}, avg delivery ${data.avg_delivery_days} days. How can I reduce logistics costs and working capital tied up in transit?`)}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Ask AI
          </button>
        )}
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--b)' }}>
        <MetricCell label="In Transit" value={String(data.in_transit_count)} sub={fmt(data.in_transit_value, sym)} color="#F97316" />
        <MetricCell label="Delayed" value={String(data.delayed_count)} sub={data.delayed_count > 0 ? fmt(data.delayed_value, sym) : '—'} color={hasDelays ? '#EF4444' : '#22C55E'} />
        <MetricCell label="Avg Delivery" value={`${data.avg_delivery_days}d`} sub="working capital days" color="#6366F1" />
        <MetricCell label="Finance Cost" value={fmt(data.financing_cost, sym)} sub="capital tied up" color={data.financing_cost > 0 ? '#EF4444' : '#22C55E'} />
      </div>

      {/* Status bar */}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Shipment Health</div>
        <div style={{ height: 22, borderRadius: 6, overflow: 'hidden', display: 'flex', background: 'var(--ev, #e5e5e5)' }}>
          {data.in_transit_count - data.delayed_count > 0 && (
            <div style={{
              width: `${((data.in_transit_count - data.delayed_count) / data.in_transit_count) * 100}%`,
              background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{data.in_transit_count - data.delayed_count} on time</span>
            </div>
          )}
          {data.delayed_count > 0 && (
            <div style={{
              width: `${(data.delayed_count / data.in_transit_count) * 100}%`,
              background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{data.delayed_count} delayed</span>
            </div>
          )}
        </div>

        {data.at_risk_count > 0 && (
          <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.15)', fontSize: 11, color: '#EF4444', fontWeight: 500 }}>
            {data.at_risk_count} shipment{data.at_risk_count > 1 ? 's' : ''} flagged as at-risk — may cause stockout or revenue loss if delayed further.
          </div>
        )}

        {data.in_transit_value > 0 && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>
            {fmt(data.in_transit_value, sym)} in inventory is currently in transit. This capital is tied up for an average of {data.avg_delivery_days} days until goods arrive and can be sold.
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
