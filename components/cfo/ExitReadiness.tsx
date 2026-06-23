'use client'

import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  cash: { balance: number; monthly_fixed: number; runway_months: number | null; daily_net_burn: number }
  comparison: { revenue: number; cogs: number; gross_profit: number; net_profit: number; gross_margin_pct: number }
  pnlMonthly?: Array<{ month: string; revenue: number; cogs: number; fixed: number; net: number; gross_margin_pct: number; net_margin_pct: number }>
  dataQuality: { days_with_data: number; has_ecommerce: boolean; has_pos: boolean }
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

interface Factor {
  id: string
  label: string
  description: string
  weight: number
  score: number // 0-100 auto-calculated
  maxScore: number
}

function calcRevGrowth(pnlMonthly?: Props['pnlMonthly']): number | null {
  if (!pnlMonthly || pnlMonthly.length < 3) return null
  const recent = pnlMonthly.slice(-3)
  const older = pnlMonthly.slice(-6, -3)
  if (older.length === 0) return null
  const recentAvg = recent.reduce((s, m) => s + m.revenue, 0) / recent.length
  const olderAvg = older.reduce((s, m) => s + m.revenue, 0) / older.length
  return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : null
}

function calcRevVolatility(pnlMonthly?: Props['pnlMonthly']): number {
  if (!pnlMonthly || pnlMonthly.length < 3) return 50
  const revs = pnlMonthly.map(m => m.revenue)
  const avg = revs.reduce((a, b) => a + b, 0) / revs.length
  if (avg === 0) return 50
  const variance = revs.reduce((s, r) => s + Math.pow(r - avg, 2), 0) / revs.length
  const cv = Math.sqrt(variance) / avg
  // Lower CV = more predictable = higher score
  if (cv < 0.05) return 95
  if (cv < 0.1) return 85
  if (cv < 0.2) return 70
  if (cv < 0.35) return 50
  if (cv < 0.5) return 30
  return 15
}

export default function ExitReadiness({ totals, cash, comparison, pnlMonthly, dataQuality, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [expanded, setExpanded] = useState(false)

  const revGrowth = calcRevGrowth(pnlMonthly)
  const revPredictability = calcRevVolatility(pnlMonthly)

  // Build factors
  const factors: Factor[] = [
    {
      id: 'profitability',
      label: tc('cfo_exit.factor_profitability_label'),
      description: tc('cfo_exit.factor_profitability_desc'),
      weight: 20,
      maxScore: 20,
      score: (() => {
        const nm = totals.net_margin_pct
        if (nm >= 20) return 20
        if (nm >= 15) return 17
        if (nm >= 10) return 14
        if (nm >= 5) return 10
        if (nm >= 0) return 6
        return 2
      })(),
    },
    {
      id: 'growth',
      label: tc('cfo_exit.factor_growth_label'),
      description: tc('cfo_exit.factor_growth_desc'),
      weight: 20,
      maxScore: 20,
      score: (() => {
        if (revGrowth == null) return 5
        if (revGrowth >= 30) return 20
        if (revGrowth >= 20) return 17
        if (revGrowth >= 10) return 14
        if (revGrowth >= 5) return 10
        if (revGrowth >= 0) return 6
        return 2
      })(),
    },
    {
      id: 'margins',
      label: tc('cfo_exit.factor_margins_label'),
      description: tc('cfo_exit.factor_margins_desc'),
      weight: 15,
      maxScore: 15,
      score: (() => {
        const gm = totals.gross_margin_pct
        if (gm >= 60) return 15
        if (gm >= 50) return 13
        if (gm >= 40) return 11
        if (gm >= 30) return 8
        if (gm >= 20) return 5
        return 2
      })(),
    },
    {
      id: 'predictability',
      label: tc('cfo_exit.factor_predictability_label'),
      description: tc('cfo_exit.factor_predictability_desc'),
      weight: 15,
      maxScore: 15,
      score: Math.round((revPredictability / 100) * 15),
    },
    {
      id: 'runway',
      label: tc('cfo_exit.factor_runway_label'),
      description: tc('cfo_exit.factor_runway_desc'),
      weight: 10,
      maxScore: 10,
      score: (() => {
        const rm = cash.runway_months
        if (rm == null) return 5  // cash balance not configured — score neutral, not maximum
        if (rm > 24) return 10
        if (rm >= 12) return 9
        if (rm >= 6) return 6
        if (rm >= 3) return 3
        return 1
      })(),
    },
    {
      id: 'data_quality',
      label: tc('cfo_exit.factor_data_quality_label'),
      description: tc('cfo_exit.factor_data_quality_desc'),
      weight: 10,
      maxScore: 10,
      score: (() => {
        let s = 0
        if (dataQuality.days_with_data >= 365) s += 5
        else if (dataQuality.days_with_data >= 180) s += 3
        else if (dataQuality.days_with_data >= 90) s += 2
        else s += 1
        if (dataQuality.has_ecommerce) s += 2
        if (dataQuality.has_pos) s += 2
        if (dataQuality.has_ecommerce && dataQuality.has_pos) s += 1
        return Math.min(s, 10)
      })(),
    },
    {
      id: 'diversification',
      label: tc('cfo_exit.factor_diversification_label'),
      description: tc('cfo_exit.factor_diversification_desc'),
      weight: 10,
      maxScore: 10,
      score: (() => {
        let s = 3
        if (dataQuality.has_ecommerce && dataQuality.has_pos) s = 8
        else if (dataQuality.has_ecommerce || dataQuality.has_pos) s = 5
        return s
      })(),
    },
  ]

  const totalScore = factors.reduce((s, f) => s + f.score, 0)
  const maxPossible = factors.reduce((s, f) => s + f.maxScore, 0)
  const pct = Math.round((totalScore / maxPossible) * 100)

  const grade = pct >= 85 ? 'A' : pct >= 70 ? 'B' : pct >= 55 ? 'C' : pct >= 40 ? 'D' : 'F'
  const gradeColor = pct >= 85 ? GREEN : pct >= 70 ? '#22C55E' : pct >= 55 ? AMBER : pct >= 40 ? '#F97316' : RED
  const gradeLabel = pct >= 85 ? tc('cfo_exit.grade_exit_ready') : pct >= 70 ? tc('cfo_exit.grade_nearly_ready') : pct >= 55 ? tc('cfo_exit.grade_needs_work') : pct >= 40 ? tc('cfo_exit.grade_significant_gaps') : tc('cfo_exit.grade_not_ready')

  // Top weaknesses
  const weaknesses = [...factors].sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore)).slice(0, 3)

  // Estimated timeline
  const timelineMonths = pct >= 85 ? '3-6' : pct >= 70 ? '6-12' : pct >= 55 ? '12-18' : '18-36'

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: gradeColor }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_exit.title')}</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
            background: `${gradeColor}15`, color: gradeColor }}>
            {tc('cfo_exit.grade_badge', { grade, label: gradeLabel })}
          </span>
        </div>
        <button onClick={() => onAsk(tc('cfo_exit.ask_prompt', {
            pct,
            grade,
            weaknesses: weaknesses.map(w => w.label + ' (' + w.score + '/' + w.maxScore + ')').join(', '),
            revenue: fmt(totals.revenue, sym),
            netMargin: totals.net_margin_pct,
            growth: revGrowth != null ? revGrowth.toFixed(1) + '%' : tc('cfo_exit.unknown'),
          }))}
          style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          {tc('cfo_exit.ask_ai')}
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Score ring + headline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
          {/* Score circle */}
          <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
            <svg viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--ev, #f3f2ef)" strokeWidth="7" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={gradeColor} strokeWidth="7"
                strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 600ms ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: gradeColor, lineHeight: 1 }}>{pct}</span>
              <span style={{ fontSize: 8, color: 'var(--tx3)', fontWeight: 600 }}>{tc('cfo_exit.of_100')}</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>
              {gradeLabel}
            </div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5, marginBottom: 6 }}>
              {pct >= 85 ? tc('cfo_exit.headline_a') :
               pct >= 70 ? tc('cfo_exit.headline_b') :
               pct >= 55 ? tc('cfo_exit.headline_c') :
               tc('cfo_exit.headline_d')}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--tx3)' }}>
                {tc('cfo_exit.est_timeline')} <span style={{ fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_exit.timeline_value', { months: timelineMonths })}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--tx3)' }}>
                {tc('cfo_exit.score')} <span style={{ fontWeight: 700, color: 'var(--tx)' }}>{totalScore}/{maxPossible}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Factor bars */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 10 }}>
            {tc('cfo_exit.factor_breakdown')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {factors.map(f => {
              const fpct = (f.score / f.maxScore) * 100
              const barColor = fpct >= 80 ? GREEN : fpct >= 60 ? AMBER : RED
              return (
                <div key={f.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx)' }}>{f.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: barColor, fontVariantNumeric: 'tabular-nums' }}>{f.score}/{f.maxScore}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--ev, #f3f2ef)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${fpct}%`, background: barColor, borderRadius: 3, transition: 'width 400ms ease' }} />
                  </div>
                  {expanded && (
                    <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{f.description}</div>
                  )}
                </div>
              )
            })}
          </div>
          <button onClick={() => setExpanded(!expanded)}
            style={{ fontSize: 10, color: INDIGO, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', marginTop: 6, padding: 0 }}>
            {expanded ? tc('cfo_exit.hide_descriptions') : tc('cfo_exit.show_descriptions')}
          </button>
        </div>

        {/* Top weaknesses & actions */}
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 8 }}>
          {tc('cfo_exit.priority_improvements')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {weaknesses.map((w, i) => {
            const fpct = (w.score / w.maxScore) * 100
            const actions: Record<string, string> = {
              profitability: tc('cfo_exit.action_profitability'),
              growth: tc('cfo_exit.action_growth'),
              margins: tc('cfo_exit.action_margins'),
              predictability: tc('cfo_exit.action_predictability'),
              runway: tc('cfo_exit.action_runway'),
              data_quality: tc('cfo_exit.action_data_quality'),
              diversification: tc('cfo_exit.action_diversification'),
            }
            return (
              <div key={w.id} style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${fpct < 50 ? RED : AMBER}20`,
                background: `${fpct < 50 ? RED : AMBER}06` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>
                    {i + 1}. {w.label}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: fpct < 50 ? RED : AMBER }}>{Math.round(fpct)}%</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
                  {actions[w.id] || w.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Key metrics summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 6px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_exit.metric_net_margin')}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: totals.net_margin_pct >= 10 ? GREEN : totals.net_margin_pct >= 0 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
              {totals.net_margin_pct.toFixed(1)}%
            </div>
          </div>
          <div style={{ padding: '10px 6px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_exit.metric_growth')}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: revGrowth != null && revGrowth > 0 ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>
              {revGrowth != null ? `${revGrowth > 0 ? '+' : ''}${revGrowth.toFixed(0)}%` : '—'}
            </div>
          </div>
          <div style={{ padding: '10px 6px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_exit.metric_gross_margin')}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: totals.gross_margin_pct >= 40 ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>
              {totals.gross_margin_pct.toFixed(1)}%
            </div>
          </div>
          <div style={{ padding: '10px 6px', background: 'var(--sf)', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{tc('cfo_exit.metric_runway')}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: (cash.runway_months ?? 99) >= 12 ? GREEN : (cash.runway_months ?? 0) >= 6 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
              {cash.runway_months != null ? tc('cfo_exit.runway_months_short', { months: cash.runway_months }) : tc('cfo_exit.runway_not_set')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
