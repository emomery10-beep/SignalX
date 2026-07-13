'use client'

import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  cash: { balance: number; monthly_fixed: number; runway_months: number | null; daily_net_burn: number }
  inventory: { total_products: number; low_or_oos: number; stockout_rate: number; value_at_cost: number; value_at_retail: number }
  currencySymbol: string
  onAsk: (prompt: string) => void
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', INDIGO = '#6366F1', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

interface Benchmark {
  id: string
  name: string
  grossMargin: [number, number]  // [p25, p75]
  netMargin: [number, number]
  opexRatio: [number, number]    // opex as % of revenue
  inventoryTurnover: [number, number]
  revenuePerEmployee: [number, number] // annual, in thousands
}

const buildIndustries = (tc: (k: string, v?: Record<string, string | number>) => string): Benchmark[] => [
  { id: 'ecommerce_general', name: tc('cfo_benchmarks.industryEcommerceGeneral'), grossMargin: [30, 50], netMargin: [5, 15], opexRatio: [20, 35], inventoryTurnover: [4, 8], revenuePerEmployee: [150, 350] },
  { id: 'ecommerce_fashion', name: tc('cfo_benchmarks.industryEcommerceFashion'), grossMargin: [45, 65], netMargin: [5, 12], opexRatio: [30, 45], inventoryTurnover: [3, 6], revenuePerEmployee: [120, 280] },
  { id: 'ecommerce_electronics', name: tc('cfo_benchmarks.industryEcommerceElectronics'), grossMargin: [20, 35], netMargin: [3, 10], opexRatio: [15, 25], inventoryTurnover: [5, 10], revenuePerEmployee: [200, 500] },
  { id: 'food_bev', name: tc('cfo_benchmarks.industryFoodBev'), grossMargin: [35, 55], netMargin: [3, 10], opexRatio: [25, 40], inventoryTurnover: [8, 20], revenuePerEmployee: [100, 250] },
  { id: 'health_beauty', name: tc('cfo_benchmarks.industryHealthBeauty'), grossMargin: [50, 70], netMargin: [8, 18], opexRatio: [25, 40], inventoryTurnover: [4, 8], revenuePerEmployee: [130, 300] },
  { id: 'home_garden', name: tc('cfo_benchmarks.industryHomeGarden'), grossMargin: [35, 55], netMargin: [5, 12], opexRatio: [20, 35], inventoryTurnover: [3, 7], revenuePerEmployee: [140, 320] },
  { id: 'retail_general', name: tc('cfo_benchmarks.industryRetailGeneral'), grossMargin: [25, 45], netMargin: [2, 8], opexRatio: [20, 35], inventoryTurnover: [4, 8], revenuePerEmployee: [120, 280] },
  { id: 'wholesale', name: tc('cfo_benchmarks.industryWholesale'), grossMargin: [15, 30], netMargin: [2, 6], opexRatio: [10, 20], inventoryTurnover: [6, 12], revenuePerEmployee: [250, 600] },
  { id: 'saas', name: tc('cfo_benchmarks.industrySaas'), grossMargin: [70, 90], netMargin: [10, 30], opexRatio: [40, 65], inventoryTurnover: [0, 0], revenuePerEmployee: [150, 400] },
  { id: 'services', name: tc('cfo_benchmarks.industryServices'), grossMargin: [50, 75], netMargin: [10, 25], opexRatio: [30, 50], inventoryTurnover: [0, 0], revenuePerEmployee: [100, 250] },
  { id: 'manufacturing', name: tc('cfo_benchmarks.industryManufacturing'), grossMargin: [25, 40], netMargin: [5, 12], opexRatio: [15, 25], inventoryTurnover: [4, 8], revenuePerEmployee: [150, 400] },
  { id: 'hospitality', name: tc('cfo_benchmarks.industryHospitality'), grossMargin: [55, 75], netMargin: [5, 15], opexRatio: [35, 55], inventoryTurnover: [10, 30], revenuePerEmployee: [50, 150] },
]

type MetricKey = 'grossMargin' | 'netMargin' | 'opexRatio' | 'inventoryTurnover'

function getPosition(value: number, range: [number, number]): 'below' | 'in-range' | 'above' {
  if (value < range[0]) return 'below'
  if (value > range[1]) return 'above'
  return 'in-range'
}

function posColor(pos: 'below' | 'in-range' | 'above', inverted = false): string {
  if (pos === 'in-range') return GREEN
  if (inverted) return pos === 'above' ? RED : GREEN
  return pos === 'below' ? RED : GREEN
}

export default function IndustryBenchmarks({ totals, cash, inventory, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [selectedIndustry, setSelectedIndustry] = useState('ecommerce_general')

  const INDUSTRIES = buildIndustries(tc)
  const industry = INDUSTRIES.find(i => i.id === selectedIndustry) || INDUSTRIES[0]

  // Calculate user's metrics
  const userGrossMargin = totals.gross_margin_pct
  const userNetMargin = totals.net_margin_pct
  const userOpexRatio = totals.revenue > 0 ? (totals.fixed_costs / totals.revenue) * 100 : 0
  const annualRevenue = totals.revenue * 12
  const userInvTurnover = inventory.value_at_cost > 0 ? (totals.cogs * 12) / inventory.value_at_cost : 0

  const metrics: Array<{
    key: MetricKey
    label: string
    userValue: number
    range: [number, number]
    suffix: string
    inverted?: boolean // true = lower is better (e.g., opex ratio)
    decimals?: number
  }> = [
    { key: 'grossMargin', label: tc('cfo_benchmarks.metricGrossMargin'), userValue: userGrossMargin, range: industry.grossMargin, suffix: '%', decimals: 1 },
    { key: 'netMargin', label: tc('cfo_benchmarks.metricNetMargin'), userValue: userNetMargin, range: industry.netMargin, suffix: '%', decimals: 1 },
    { key: 'opexRatio', label: tc('cfo_benchmarks.metricOpexRatio'), userValue: userOpexRatio, range: industry.opexRatio, suffix: '%', inverted: true, decimals: 1 },
    ...(industry.inventoryTurnover[1] > 0 ? [{
      key: 'inventoryTurnover' as MetricKey,
      label: tc('cfo_benchmarks.metricInventoryTurnover'),
      userValue: userInvTurnover,
      range: industry.inventoryTurnover,
      suffix: 'x',
      decimals: 1,
    }] : []),
  ]

  // Overall score: how many metrics are in-range or better
  const scoreCount = metrics.filter(m => {
    const pos = getPosition(m.userValue, m.range)
    if (m.inverted) return pos === 'in-range' || pos === 'below'
    return pos === 'in-range' || pos === 'above'
  }).length
  const overallLabel = scoreCount === metrics.length ? tc('cfo_benchmarks.overallOutperforming') : scoreCount >= metrics.length / 2 ? tc('cfo_benchmarks.overallOnTrack') : tc('cfo_benchmarks.overallBelowAverage')
  const overallColor = scoreCount === metrics.length ? GREEN : scoreCount >= metrics.length / 2 ? AMBER : RED

  // Build gap analysis text
  const gaps = metrics.filter(m => {
    const pos = getPosition(m.userValue, m.range)
    if (m.inverted) return pos === 'above'
    return pos === 'below'
  })

  const buildSuggestion = (key: string, gap: number): string => {
    const suggestions: Record<string, string> = {
      grossMargin: tc('cfo_benchmarks.gapGrossMargin', { gap: gap.toFixed(1) }),
      netMargin: tc('cfo_benchmarks.gapNetMargin', { gap: gap.toFixed(1) }),
      opexRatio: tc('cfo_benchmarks.gapOpexRatio', { gap: gap.toFixed(1) }),
      inventoryTurnover: tc('cfo_benchmarks.gapInventoryTurnover', { gap: gap.toFixed(1) }),
    }
    return suggestions[key] || tc('cfo_benchmarks.gapFallback')
  }

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: INDIGO }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_benchmarks.title')}</span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
            background: `${overallColor}15`, color: overallColor }}>
            {overallLabel}
          </span>
        </div>
        <button onClick={() => onAsk(tc('cfo_benchmarks.askPrompt', {
            industry: industry.name,
            grossMargin: userGrossMargin.toFixed(1),
            gmLow: industry.grossMargin[0],
            gmHigh: industry.grossMargin[1],
            netMargin: userNetMargin.toFixed(1),
            nmLow: industry.netMargin[0],
            nmHigh: industry.netMargin[1],
            opexRatio: userOpexRatio.toFixed(1),
            opexLow: industry.opexRatio[0],
            opexHigh: industry.opexRatio[1],
            gapSuffix: gaps.length > 0
              ? tc('cfo_benchmarks.askPromptGapSuffix', { gaps: gaps.map(g => g.label).join(', ') })
              : '',
          }))}
          style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          {tc('cfo_benchmarks.askAi')}
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Industry selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>{tc('cfo_benchmarks.industryLabel')}</span>
          <select value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)}
            style={{ flex: 1, fontSize: 12, padding: '6px 10px', borderRadius: 7, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontWeight: 500 }}>
            {INDUSTRIES.map(ind => (
              <option key={ind.id} value={ind.id}>{ind.name}</option>
            ))}
          </select>
        </div>

        {/* Benchmark comparisons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          {metrics.map(m => {
            const pos = getPosition(m.userValue, m.range)
            const color = posColor(pos, m.inverted)
            const rangeWidth = m.range[1] - m.range[0]
            const rangeMin = Math.max(m.range[0] - rangeWidth * 0.5, 0)
            const rangeMax = m.range[1] + rangeWidth * 0.5
            const totalWidth = rangeMax - rangeMin
            const userPct = totalWidth > 0 ? Math.min(Math.max(((m.userValue - rangeMin) / totalWidth) * 100, 2), 98) : 50
            const rangeLowPct = totalWidth > 0 ? ((m.range[0] - rangeMin) / totalWidth) * 100 : 25
            const rangeHighPct = totalWidth > 0 ? ((m.range[1] - rangeMin) / totalWidth) * 100 : 75

            return (
              <div key={m.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{m.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
                      {m.userValue.toFixed(m.decimals ?? 0)}{m.suffix}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--tx3)' }}>
                      {tc('cfo_benchmarks.vsRange', { low: m.range[0], high: m.range[1], suffix: m.suffix })}
                    </span>
                  </div>
                </div>
                {/* Visual range bar */}
                <div style={{ position: 'relative', height: 10, background: 'var(--ev, #f3f2ef)', borderRadius: 5 }}>
                  {/* Industry range band */}
                  <div style={{
                    position: 'absolute', left: `${rangeLowPct}%`, width: `${rangeHighPct - rangeLowPct}%`,
                    height: '100%', background: 'rgba(99,102,241,.12)', borderRadius: 5,
                  }} />
                  {/* User marker */}
                  <div style={{
                    position: 'absolute', left: `${userPct}%`, top: -2,
                    width: 10, height: 14, borderRadius: 3, background: color,
                    transform: 'translateX(-5px)', boxShadow: `0 1px 4px ${color}40`,
                    transition: 'left 400ms ease',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--tx3)', marginTop: 3 }}>
                  <span>{m.inverted ? tc('cfo_benchmarks.rangeBarBetter') : tc('cfo_benchmarks.rangeBarWorse')}</span>
                  <span style={{ color: INDIGO, fontWeight: 600 }}>{tc('cfo_benchmarks.rangeBarIndustry')}</span>
                  <span>{m.inverted ? tc('cfo_benchmarks.rangeBarWorse') : tc('cfo_benchmarks.rangeBarBetter')}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Gap analysis */}
        {gaps.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {tc('cfo_benchmarks.improvementOpportunities')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {gaps.map(g => {
                const target = g.inverted ? g.range[1] : g.range[0]
                const gap = Math.abs(g.userValue - target)
                return (
                  <div key={g.key} style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${RED}20`, background: `${RED}06` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{g.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: RED }}>
                        {g.userValue.toFixed(g.decimals ?? 0)}{g.suffix} → {target.toFixed(g.decimals ?? 0)}{g.suffix}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.4 }}>
                      {buildSuggestion(g.key, gap)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Summary grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden' }}>
          {metrics.map(m => {
            const pos = getPosition(m.userValue, m.range)
            const color = posColor(pos, m.inverted)
            const icon = (m.inverted
              ? (pos === 'above' ? tc('cfo_benchmarks.iconInvertedHigh') : pos === 'below' ? tc('cfo_benchmarks.iconInvertedGood') : tc('cfo_benchmarks.iconOk'))
              : (pos === 'below' ? tc('cfo_benchmarks.iconLow') : pos === 'above' ? tc('cfo_benchmarks.iconGreat') : tc('cfo_benchmarks.iconOk')))
            return (
              <div key={m.key} style={{ padding: '10px 6px', background: 'var(--sf)', textAlign: 'center' }}>
                <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
                  {m.userValue.toFixed(m.decimals ?? 0)}{m.suffix}
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, color, marginTop: 2 }}>{icon}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
