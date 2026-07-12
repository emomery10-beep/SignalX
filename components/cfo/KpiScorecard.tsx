'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface KpiRow {
  key: string
  label: string
  target: number
  actual: number | null
  unit: '%' | 'months' | 'x' | 'count' | 'currency'
  direction: 'above' | 'below'
  history: number[]
}

interface Props {
  revenue: number
  grossMarginPct: number
  netMarginPct: number
  runwayMonths: number | null
  stockoutRate: number
  healthScore: number | null
  revenueChange: number | null
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

function statusIcon(actual: number | null, target: number, direction: 'above' | 'below'): { icon: string; color: string } {
  if (actual == null) return { icon: '⚪', color: 'var(--tx3)' }
  const met = direction === 'above' ? actual >= target : actual <= target
  const close = direction === 'above' ? actual >= target * 0.85 : actual <= target * 1.15
  if (met) return { icon: '🟢', color: '#22C55E' }
  if (close) return { icon: '🟡', color: '#F59E0B' }
  return { icon: '🔴', color: '#EF4444' }
}

function trendArrow(history: number[]): { arrow: string; color: string } {
  if (history.length < 2) return { arrow: '→', color: 'var(--tx3)' }
  const last = history[history.length - 1]
  const prev = history[history.length - 2]
  if (last > prev) return { arrow: '↗', color: '#22C55E' }
  if (last < prev) return { arrow: '↘', color: '#EF4444' }
  return { arrow: '→', color: 'var(--tx3)' }
}

function formatValue(val: number | null, unit: string, sym: string): string {
  if (val == null) return '—'
  switch (unit) {
    case '%': return `${val.toFixed(1)}%`
    case 'months': return `${val} mo`
    case 'x': return `${val.toFixed(1)}x`
    case 'count': return `${Math.round(val)}`
    case 'currency':
      if (Math.abs(val) >= 1_000_000) return `${sym}${(val / 1_000_000).toFixed(1)}M`
      if (Math.abs(val) >= 1_000) return `${sym}${(val / 1_000).toFixed(0)}K`
      return `${sym}${Math.round(val)}`
    default: return `${val}`
  }
}

const buildKpiLabels = (tc: (k: string, v?: Record<string, string | number>) => string) => ({
  gross_margin: tc('cfo_kpi.labelGrossMargin'),
  net_margin: tc('cfo_kpi.labelNetMargin'),
  revenue_growth: tc('cfo_kpi.labelRevenueGrowth'),
  stockout_rate: tc('cfo_kpi.labelStockoutRate'),
  cash_runway: tc('cfo_kpi.labelCashRunway'),
  health_score: tc('cfo_kpi.labelHealthScore'),
})

export default function KpiScorecard({ revenue, grossMarginPct, netMarginPct, runwayMonths, stockoutRate, healthScore, revenueChange, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [editing, setEditing] = useState<string | null>(null)
  const [targets, setTargets] = useState<Record<string, number>>({
    gross_margin: 40,
    net_margin: 15,
    revenue_growth: 5,
    stockout_rate: 15,
    cash_runway: 6,
    health_score: 70,
  })

  // Load saved targets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cfo_kpi_targets')
      if (saved) setTargets(prev => ({ ...prev, ...JSON.parse(saved) }))
    } catch {}
  }, [])

  const saveTarget = (key: string, val: number) => {
    const updated = { ...targets, [key]: val }
    setTargets(updated)
    try { localStorage.setItem('cfo_kpi_targets', JSON.stringify(updated)) } catch {}
    setEditing(null)
  }

  const kpiLabels = buildKpiLabels(tc)

  const kpis: KpiRow[] = [
    { key: 'gross_margin', label: kpiLabels.gross_margin, target: targets.gross_margin, actual: grossMarginPct, unit: '%', direction: 'above', history: [] },
    { key: 'net_margin', label: kpiLabels.net_margin, target: targets.net_margin, actual: netMarginPct, unit: '%', direction: 'above', history: [] },
    { key: 'revenue_growth', label: kpiLabels.revenue_growth, target: targets.revenue_growth, actual: revenueChange, unit: '%', direction: 'above', history: [] },
    { key: 'stockout_rate', label: kpiLabels.stockout_rate, target: targets.stockout_rate, actual: stockoutRate, unit: '%', direction: 'below', history: [] },
    { key: 'cash_runway', label: kpiLabels.cash_runway, target: targets.cash_runway, actual: runwayMonths, unit: 'months', direction: 'above', history: [] },
    { key: 'health_score', label: kpiLabels.health_score, target: targets.health_score, actual: healthScore, unit: 'count', direction: 'above', history: [] },
  ]

  const metCount = kpis.filter(k => {
    if (k.actual == null) return false
    return k.direction === 'above' ? k.actual >= k.target : k.actual <= k.target
  }).length

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_kpi.title')}</span>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
            background: metCount >= 4 ? 'rgba(34,197,94,.1)' : metCount >= 2 ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)',
            color: metCount >= 4 ? '#22C55E' : metCount >= 2 ? '#F59E0B' : '#EF4444',
          }}>
            {tc('cfo_kpi.onTargetBadge', { met: metCount, total: kpis.length })}
          </span>
        </div>
        {onAsk && (
          <button
            onClick={() => {
              const missed = kpis.filter(k => k.actual != null && (k.direction === 'above' ? k.actual < k.target : k.actual > k.target))
              const missedStr = missed.map(k => `${k.label}: ${formatValue(k.actual, k.unit, sym)} (target: ${formatValue(k.target, k.unit, sym)})`).join(', ')
              onAsk(tc('cfo_kpi.askPrompt', { met: metCount, total: kpis.length, missed: missedStr || tc('cfo_kpi.askPromptNone') }))
            }}
            style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_kpi.askAi')}
          </button>
        )}
      </div>

      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px', padding: '8px 18px', borderBottom: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)' }}>{tc('cfo_kpi.colKpi')}</div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textAlign: 'right' }}>{tc('cfo_kpi.colTarget')}</div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textAlign: 'right' }}>{tc('cfo_kpi.colActual')}</div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textAlign: 'center' }}>{tc('cfo_kpi.colStatus')}</div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textAlign: 'center' }}>{tc('cfo_kpi.colTrend')}</div>
      </div>

      {/* KPI rows */}
      {kpis.map(kpi => {
        const st = statusIcon(kpi.actual, kpi.target, kpi.direction)
        const tr = trendArrow(kpi.history)
        const isEditing = editing === kpi.key

        return (
          <div
            key={kpi.key}
            style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px',
              padding: '10px 18px', borderBottom: '1px solid var(--b)',
              alignItems: 'center',
              background: st.color === '#EF4444' ? 'rgba(239,68,68,.02)' : 'transparent',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--tx)' }}>{kpi.label}</div>

            {/* Target (editable) */}
            <div style={{ textAlign: 'right' }}>
              {isEditing ? (
                <input
                  type="number"
                  defaultValue={kpi.target}
                  autoFocus
                  onBlur={e => saveTarget(kpi.key, Number(e.target.value) || kpi.target)}
                  onKeyDown={e => { if (e.key === 'Enter') saveTarget(kpi.key, Number((e.target as HTMLInputElement).value) || kpi.target) }}
                  style={{
                    width: 50, padding: '2px 4px', borderRadius: 4, border: '1px solid #6366F1',
                    fontSize: 9, textAlign: 'right', fontFamily: 'inherit', outline: 'none',
                  }}
                />
              ) : (
                <button
                  onClick={() => setEditing(kpi.key)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: 9, color: 'var(--tx3)', fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums',
                    textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '2px',
                  }}
                  title={tc('cfo_kpi.editTargetTitle')}
                >
                  {kpi.direction === 'above' ? '>' : '<'}{formatValue(kpi.target, kpi.unit, sym)}
                </button>
              )}
            </div>

            {/* Actual */}
            <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: st.color, fontVariantNumeric: 'tabular-nums' }}>
              {formatValue(kpi.actual, kpi.unit, sym)}
            </div>

            {/* Status */}
            <div style={{ textAlign: 'center', fontSize: 12 }}>{st.icon}</div>

            {/* Trend */}
            <div style={{ textAlign: 'center', fontSize: 12, color: tr.color, fontWeight: 600 }}>{tr.arrow}</div>
          </div>
        )
      })}

      <div style={{ padding: '10px 18px', background: 'var(--ev, #f9f9f8)', fontSize: 9, color: 'var(--tx3)' }}>
        {tc('cfo_kpi.footerHint')}
      </div>
    </div>
  )
}
