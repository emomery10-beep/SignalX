'use client'

import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  pnlMonthly?: Array<{ month: string; revenue: number; cogs: number; fixed: number; net: number; gross_margin_pct: number; net_margin_pct: number }>
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

export default function DynamicBreakEven({ totals, pnlMonthly, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [avgOrderValue, setAvgOrderValue] = useState<number | null>(null)

  const { revenue, cogs, gross_profit, fixed_costs, gross_margin_pct } = totals
  const contributionMarginPct = gross_margin_pct / 100

  // Break-even revenue
  const breakEvenRevenue = contributionMarginPct > 0 ? fixed_costs / contributionMarginPct : 0

  // Progress toward break-even
  const rawProgressPct = breakEvenRevenue > 0 ? (revenue / breakEvenRevenue) * 100 : 0
  const progressPct = Math.min(rawProgressPct, 100)
  const revenueToGo = Math.max(breakEvenRevenue - revenue, 0)
  const isProfitable = revenue >= breakEvenRevenue && breakEvenRevenue > 0

  // If user provides avg order value, calculate units needed
  const aov = avgOrderValue || (revenue > 0 ? Math.round(revenue / 30) : 0) // rough daily estimate
  const unitsToBreakEven = aov > 0 ? Math.ceil(breakEvenRevenue / aov) : 0
  const unitsSoFar = aov > 0 ? Math.floor(revenue / aov) : 0
  const unitsToGo = Math.max(unitsToBreakEven - unitsSoFar, 0)

  // Safety margin (how far above/below break-even)
  const safetyMarginPct = breakEvenRevenue > 0 ? ((revenue - breakEvenRevenue) / breakEvenRevenue) * 100 : 0

  // Monthly break-even trend
  const monthlyBE = pnlMonthly?.map(m => {
    const gm = m.revenue > 0 ? (m.revenue - m.cogs) / m.revenue : 0
    return gm > 0 ? m.fixed / gm : 0
  }) ?? []

  // Days estimate (if we know daily average)
  const daysInPeriod = 30
  const dailyRevenue = revenue / daysInPeriod
  const daysToBreakEven = dailyRevenue > 0 ? Math.ceil(breakEvenRevenue / dailyRevenue) : null

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: isProfitable ? GREEN : AMBER }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_breakeven.cardTitle')}</span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
            background: isProfitable ? 'rgba(34,197,94,.1)' : 'rgba(245,158,11,.1)',
            color: isProfitable ? GREEN : AMBER }}>
            {isProfitable ? tc('cfo_breakeven.badgeAbove') : tc('cfo_breakeven.badgeToGo', { amount: fmt(revenueToGo, sym) })}
          </span>
        </div>
        <button onClick={() => onAsk(tc('cfo_breakeven.askPrompt', {
            breakEven: fmt(breakEvenRevenue, sym),
            revenue: fmt(revenue, sym),
            pct: rawProgressPct.toFixed(0),
            fixed: fmt(fixed_costs, sym),
            gm: gross_margin_pct,
            safety: safetyMarginPct.toFixed(1),
          }))}
          style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          {tc('cfo_breakeven.askAi')}
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_breakeven.revenueProgress')}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: isProfitable ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(revenue, sym)} / {fmt(breakEvenRevenue, sym)}
            </span>
          </div>
          <div style={{ position: 'relative', height: 10, background: 'var(--ev, #f3f2ef)', borderRadius: 5 }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: 5, transformOrigin: 'left',
              transform: `scaleX(${Math.min(progressPct, 100) / 100})`,
              background: isProfitable ? `linear-gradient(90deg, ${AMBER}, ${GREEN})` : `linear-gradient(90deg, ${RED}, ${AMBER})`,
              transition: 'transform 500ms var(--ease-out)',
            }} />
            {/* Break-even marker */}
            <div style={{
              position: 'absolute', left: `${Math.min(100 / (progressPct / 100 || 1), 100)}%`, top: -3,
              width: 2, height: 16, background: 'var(--tx)', borderRadius: 1, opacity: 0.5,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginTop: 4 }}>
            <span>{sym}0</span>
            <span style={{ fontWeight: 600 }}>{tc('cfo_breakeven.breakEvenLabel', { amount: fmt(breakEvenRevenue, sym) })}</span>
            <span>{fmt(Math.max(revenue, breakEvenRevenue) * 1.2, sym)}</span>
          </div>
        </div>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_breakeven.kpiBreakEven')}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(breakEvenRevenue, sym)}</div>
          </div>
          <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_breakeven.kpiSafetyMargin')}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: safetyMarginPct >= 20 ? GREEN : safetyMarginPct >= 0 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
              {safetyMarginPct >= 0 ? '+' : ''}{safetyMarginPct.toFixed(1)}%
            </div>
          </div>
          <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_breakeven.kpiDaysToBE')}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>
              {daysToBreakEven != null ? tc('cfo_breakeven.daysValue', { n: daysToBreakEven }) : '—'}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('cfo_breakeven.howCalculated')}</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 14 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--b)' }}>
              <td style={{ padding: '6px 0', color: 'var(--tx)' }}>{tc('cfo_breakeven.rowFixedCosts')}</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmt(fixed_costs, sym)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--b)' }}>
              <td style={{ padding: '6px 0', color: 'var(--tx)' }}>{tc('cfo_breakeven.rowGrossMargin')}</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{gross_margin_pct.toFixed(1)}%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--b)' }}>
              <td style={{ padding: '6px 0', color: 'var(--tx)', fontWeight: 600 }}>{tc('cfo_breakeven.rowFormula')}</td>
              <td style={{ padding: '6px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: INDIGO }}>{fmt(breakEvenRevenue, sym)}</td>
            </tr>
          </tbody>
        </table>

        {/* Units calculator */}
        <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_breakeven.ordersTitle')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_breakeven.avgOrderLabel')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{sym}</span>
                <input type="number" value={avgOrderValue || ''} placeholder={String(aov)}
                  onChange={e => setAvgOrderValue(Number(e.target.value) || null)}
                  style={{ width: 60, padding: '3px 6px', borderRadius: 5, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: 'var(--sf)', color: 'var(--tx)', outline: 'none', textAlign: 'right' }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{unitsToBreakEven.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_breakeven.ordersNeeded')}</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{unitsSoFar.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_breakeven.ordersDone')}</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: unitsToGo > 0 ? AMBER : GREEN, fontVariantNumeric: 'tabular-nums' }}>{unitsToGo.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_breakeven.ordersToGo')}</div>
            </div>
          </div>
        </div>

        {/* Monthly trend */}
        {monthlyBE.length > 1 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{tc('cfo_breakeven.monthlyTrendTitle')}</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60, marginBottom: 4 }}>
              {monthlyBE.map((be, i) => {
                const max = Math.max(...monthlyBE, 1)
                const h = (be / max) * 50
                const monthRev = pnlMonthly![i].revenue
                const hit = monthRev >= be
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div style={{ width: '70%', height: Math.max(h, 2), borderRadius: 3, background: hit ? GREEN : AMBER, opacity: 0.7 }} />
                    <div style={{ fontSize: 7, color: 'var(--tx3)' }}>{pnlMonthly![i].month}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 9, color: 'var(--tx3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: GREEN, opacity: 0.7 }} /> {tc('cfo_breakeven.legendHit')}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: AMBER, opacity: 0.7 }} /> {tc('cfo_breakeven.legendBelow')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
