'use client'

import { useLang } from '@/components/LanguageProvider'

interface KpiData {
  key: string
  label: string
  value: number | null
  valueLabel?: string
  subValue?: string
  change?: number | null
  status: 'green' | 'yellow' | 'red' | 'gray'
  sparkline?: number[]
}

interface Props {
  kpis: KpiData[]
  currencySymbol: string
  loading?: boolean
  onNavigate?: (tab: string) => void
}

const STATUS_COLORS: Record<string, string> = {
  green: '#22C55E',
  yellow: '#F59E0B',
  red: '#EF4444',
  gray: 'var(--tx3)',
}

const KPI_TAB_MAP: Record<string, string> = {
  revenue: 'pnl',
  gross_profit: 'margins',
  net_profit: 'pnl',
  net_margin: 'pnl',
  net_cashflow: 'cashflow',
  inventory: 'inventory',
  health: 'reports',
}

function formatCurrency(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function Sparkline({ data, color, width = 60, height = 22 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 2) - 1
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ display: 'block', marginTop: 4 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      <circle cx={parseFloat(points.split(' ').pop()!.split(',')[0])} cy={parseFloat(points.split(' ').pop()!.split(',')[1])} r={2} fill={color} />
    </svg>
  )
}

export default function FinancialSnapshot({ kpis, currencySymbol, loading, onNavigate }: Props) {
  const { tc } = useLang()

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ height: 88, borderRadius: 12, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
      {kpis.map(kpi => {
        const color = STATUS_COLORS[kpi.status] || STATUS_COLORS.gray
        const isCurrency = ['revenue', 'gross_profit', 'net_profit', 'net_cashflow', 'inventory'].includes(kpi.key)
        const displayValue = kpi.valueLabel
          ? kpi.valueLabel
          : kpi.value != null
            ? isCurrency
              ? formatCurrency(kpi.value, currencySymbol)
              : `${kpi.value}`
            : tc('cfo_financialsnapshot.noValue')
        const targetTab = KPI_TAB_MAP[kpi.key]
        const isClickable = !!targetTab && !!onNavigate

        return (
          <div
            key={kpi.key}
            onClick={isClickable ? () => onNavigate!(targetTab) : undefined}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid var(--b)',
              background: 'var(--sf)',
              position: 'relative',
              overflow: 'hidden',
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'box-shadow 150ms, border-color 150ms',
            }}
            onMouseEnter={isClickable ? (e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,.12)' } : undefined}
            onMouseLeave={isClickable ? (e) => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.boxShadow = 'none' } : undefined}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6,
              }}>
                {kpi.label}
              </div>
              {isClickable && (
                <span style={{ fontSize: 9, color: 'var(--tx3)', opacity: 0.5 }}>→</span>
              )}
            </div>
            <div style={{
              fontSize: 20, fontWeight: 700, color: 'var(--tx)',
              fontFamily: 'var(--font-sora, inherit)', marginBottom: 3,
              letterSpacing: '-0.02em',
            }}>
              {displayValue}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {kpi.change != null && (
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: kpi.change > 0 ? '#22C55E' : kpi.change < 0 ? '#EF4444' : 'var(--tx3)',
                  }}>
                    {kpi.change > 0 ? '▲' : kpi.change < 0 ? '▼' : '–'} {Math.abs(kpi.change)}%
                  </span>
                )}
                {kpi.subValue && (
                  <span style={{ fontSize: 10, color: 'var(--tx3)' }}>
                    {kpi.subValue}
                  </span>
                )}
              </div>
              {kpi.sparkline && kpi.sparkline.length >= 2 && (
                <Sparkline data={kpi.sparkline} color={color} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
