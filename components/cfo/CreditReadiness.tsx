'use client'
import { useState } from 'react'
import { getRegionConfig } from '@/lib/region-config'
import { useLang } from '@/components/LanguageProvider'

type TC = (k: string, vars?: Record<string, string | number>) => string

interface Props {
  revenue: number
  grossMarginPct: number
  netMarginPct: number
  runwayMonths: number | null
  stockoutRate: number
  hasPos: boolean
  hasEcommerce: boolean
  daysWithData: number
  currencySymbol: string
  countryCode?: string | null
  onAsk?: (prompt: string) => void
}

interface ScoreFactor {
  label: string
  score: number
  maxScore: number
  detail: string
  status: 'good' | 'fair' | 'poor'
  tip: string
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function computeCreditScore(props: Props, tc: TC): { total: number; maxTotal: number; grade: string; factors: ScoreFactor[] } {
  const factors: ScoreFactor[] = []

  // 1. Digital record quality (max 25)
  let digitalScore = 0
  if (props.hasPos) digitalScore += 10
  if (props.hasEcommerce) digitalScore += 5
  if (props.daysWithData >= 180) digitalScore += 10
  else if (props.daysWithData >= 90) digitalScore += 7
  else if (props.daysWithData >= 30) digitalScore += 4
  factors.push({
    label: tc('cfo_credit.factor_digital_label'),
    score: digitalScore,
    maxScore: 25,
    detail: tc('cfo_credit.factor_digital_detail', {
      days: props.daysWithData,
      pos: props.hasPos ? tc('cfo_credit.factor_digital_pos') : '',
      ecom: props.hasEcommerce ? tc('cfo_credit.factor_digital_ecom') : '',
    }),
    status: digitalScore >= 20 ? 'good' : digitalScore >= 12 ? 'fair' : 'poor',
    tip: digitalScore < 20 ? tc('cfo_credit.factor_digital_tip_low') : tc('cfo_credit.factor_digital_tip_high'),
  })

  // 2. Revenue consistency (max 20)
  let revenueScore = 0
  if (props.revenue > 0) {
    if (props.revenue >= 500_000) revenueScore += 12
    else if (props.revenue >= 100_000) revenueScore += 8
    else revenueScore += 4
    if (props.daysWithData >= 60) revenueScore += 8
    else if (props.daysWithData >= 30) revenueScore += 4
  }
  factors.push({
    label: tc('cfo_credit.factor_revenue_label'),
    score: Math.min(revenueScore, 20),
    maxScore: 20,
    detail: tc('cfo_credit.factor_revenue_detail', { revenue: fmt(props.revenue, props.currencySymbol) }),
    status: revenueScore >= 16 ? 'good' : revenueScore >= 8 ? 'fair' : 'poor',
    tip: revenueScore < 16 ? tc('cfo_credit.factor_revenue_tip_low') : tc('cfo_credit.factor_revenue_tip_high'),
  })

  // 3. Profitability (max 20)
  let profitScore = 0
  if (props.grossMarginPct >= 35) profitScore += 10
  else if (props.grossMarginPct >= 20) profitScore += 6
  else if (props.grossMarginPct > 0) profitScore += 3
  if (props.netMarginPct >= 10) profitScore += 10
  else if (props.netMarginPct >= 5) profitScore += 6
  else if (props.netMarginPct > 0) profitScore += 3
  factors.push({
    label: tc('cfo_credit.factor_profit_label'),
    score: Math.min(profitScore, 20),
    maxScore: 20,
    detail: tc('cfo_credit.factor_profit_detail', { gross: props.grossMarginPct, net: props.netMarginPct }),
    status: profitScore >= 16 ? 'good' : profitScore >= 8 ? 'fair' : 'poor',
    tip: profitScore < 16 ? tc('cfo_credit.factor_profit_tip_low') : tc('cfo_credit.factor_profit_tip_high'),
  })

  // 4. Cash management (max 20)
  let cashScore = 0
  if (props.runwayMonths != null) {
    if (props.runwayMonths >= 6) cashScore += 14
    else if (props.runwayMonths >= 3) cashScore += 8
    else cashScore += 3
  }
  if (props.stockoutRate < 20) cashScore += 6
  else if (props.stockoutRate < 40) cashScore += 3
  factors.push({
    label: tc('cfo_credit.factor_cash_label'),
    score: Math.min(cashScore, 20),
    maxScore: 20,
    detail: tc('cfo_credit.factor_cash_detail', {
      runway: props.runwayMonths != null ? tc('cfo_credit.factor_cash_runway', { months: props.runwayMonths }) : tc('cfo_credit.factor_cash_runway_unset'),
      stockout: props.stockoutRate,
    }),
    status: cashScore >= 14 ? 'good' : cashScore >= 8 ? 'fair' : 'poor',
    tip: cashScore < 14 ? tc('cfo_credit.factor_cash_tip_low') : tc('cfo_credit.factor_cash_tip_high'),
  })

  // 5. Compliance (max 15)
  let complianceScore = 5
  if (props.hasPos) complianceScore += 5
  if (props.daysWithData >= 30) complianceScore += 5
  factors.push({
    label: tc('cfo_credit.factor_compliance_label'),
    score: Math.min(complianceScore, 15),
    maxScore: 15,
    detail: tc('cfo_credit.factor_compliance_detail'),
    status: complianceScore >= 12 ? 'good' : complianceScore >= 7 ? 'fair' : 'poor',
    tip: complianceScore < 12 ? tc('cfo_credit.factor_compliance_tip_low') : tc('cfo_credit.factor_compliance_tip_high'),
  })

  const total = factors.reduce((s, f) => s + f.score, 0)
  const maxTotal = factors.reduce((s, f) => s + f.maxScore, 0)
  const grade = total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : total >= 35 ? 'D' : 'F'

  return { total, maxTotal, grade, factors }
}

export default function CreditReadiness(props: Props) {
  const { currencySymbol: sym, countryCode, onAsk } = props
  const { tc } = useLang()
  const [expanded, setExpanded] = useState<string | null>(null)
  const result = computeCreditScore(props, tc)
  const region = getRegionConfig(countryCode)

  const gradeColor = result.grade === 'A' ? '#22C55E' : result.grade === 'B' ? '#22C55E' : result.grade === 'C' ? '#F59E0B' : '#EF4444'
  const ringPct = (result.total / result.maxTotal) * 100

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_credit.title')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_credit.subtitle')}</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(tc('cfo_credit.ask_ai_prompt', {
              total: result.total,
              maxTotal: result.maxTotal,
              grade: result.grade,
              weakAreas: result.factors.filter(f => f.status === 'poor').map(f => f.label + ': ' + f.score + '/' + f.maxScore).join(', '),
              country: region.countryName,
              lenders: region.lenders.slice(0, 3).map(l => l.name).join(', '),
            }))}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_credit.ask_ai')}
          </button>
        )}
      </div>

      {/* Score hero */}
      <div style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid var(--b)' }}>
        {/* Score ring */}
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--ev, #e5e5e5)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke={gradeColor} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${ringPct * 2.136} ${213.6 - ringPct * 2.136}`}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dasharray 500ms ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: gradeColor }}>{result.grade}</div>
            <div style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 600 }}>{result.total}/{result.maxTotal}</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>
            {result.grade === 'A' ? tc('cfo_credit.hero_grade_a') :
             result.grade === 'B' ? tc('cfo_credit.hero_grade_b') :
             result.grade === 'C' ? tc('cfo_credit.hero_grade_c') :
             tc('cfo_credit.hero_grade_low')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>
            {result.grade === 'A' || result.grade === 'B'
              ? tc('cfo_credit.hero_desc_high', { lenders: region.lenders.filter(l => l.minGrade === 'B' || l.minGrade === 'A').map(l => l.name).join(', ') })
              : tc('cfo_credit.hero_desc_low', { lender: region.lenders.find(l => l.minGrade === 'C')?.name || tc('cfo_credit.hero_desc_low_fallback') })}
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div>
        {result.factors.map(factor => {
          const isExpanded = expanded === factor.label
          const barPct = (factor.score / factor.maxScore) * 100
          const statusColor = factor.status === 'good' ? '#22C55E' : factor.status === 'fair' ? '#F59E0B' : '#EF4444'

          return (
            <div key={factor.label} style={{ borderTop: '1px solid var(--b)' }}>
              <button
                onClick={() => setExpanded(isExpanded ? null : factor.label)}
                style={{ width: '100%', padding: '12px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{factor.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>{factor.score}/{factor.maxScore}</span>
                    <span style={{ fontSize: 10, color: 'var(--tx3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>▼</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--ev, #e5e5e5)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${barPct}%`, background: statusColor, borderRadius: 3, transition: 'width 400ms ease' }} />
                </div>
              </button>

              {isExpanded && (
                <div style={{ padding: '0 18px 14px', fontSize: 11, color: 'var(--tx3)', lineHeight: 1.6 }}>
                  <div style={{ marginBottom: 6 }}>{factor.detail}</div>
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: factor.status === 'good' ? 'rgba(34,197,94,.04)' : 'rgba(245,158,11,.04)', border: `1px solid ${factor.status === 'good' ? 'rgba(34,197,94,.12)' : 'rgba(245,158,11,.12)'}` }}>
                    <span style={{ fontWeight: 600, color: factor.status === 'good' ? '#22C55E' : '#F59E0B' }}>
                      {factor.status === 'good' ? tc('cfo_credit.status_strength') : tc('cfo_credit.status_improve')}
                    </span>
                    {factor.tip}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* DSCR & Debt Capacity */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 8 }}>{tc('cfo_credit.dscr_section')}</div>
        {(() => {
          const annualNetIncome = props.revenue * 12 * (props.netMarginPct / 100)
          const estimatedDebtService = props.revenue * 12 * 0.1 // assume 10% of annual revenue as potential debt service
          const dscr = estimatedDebtService > 0 ? annualNetIncome / estimatedDebtService : 0
          const maxDebtService = annualNetIncome * 0.4 // max 40% of net income to debt
          const dscrColor = dscr >= 1.5 ? '#22C55E' : dscr >= 1.0 ? '#F59E0B' : '#EF4444'
          const dscrLabel = dscr >= 1.5 ? tc('cfo_credit.dscr_strong') : dscr >= 1.0 ? tc('cfo_credit.dscr_adequate') : tc('cfo_credit.dscr_weak')
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', marginBottom: 3 }}>{tc('cfo_credit.dscr_label')}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: dscrColor, fontVariantNumeric: 'tabular-nums' }}>{dscr.toFixed(2)}x</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{dscrLabel}</div>
              </div>
              <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', marginBottom: 3 }}>{tc('cfo_credit.dscr_max_debt')}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(maxDebtService / 12, sym)}{tc('cfo_credit.dscr_per_month')}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_credit.dscr_max_debt_note')}</div>
              </div>
              <div style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx3)', marginBottom: 3 }}>{tc('cfo_credit.dscr_capacity')}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#6366F1', fontVariantNumeric: 'tabular-nums' }}>{fmt(maxDebtService * 3, sym)}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_credit.dscr_capacity_note')}</div>
              </div>
            </div>
          )
        })()}
        <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.4, padding: '6px 0' }}>
          {tc('cfo_credit.dscr_explainer')}
        </div>
      </div>

      {/* Financing comparison */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 8 }}>{tc('cfo_credit.financing_section')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {buildFinancingOptions(tc).map(opt => {
            const gradeOrder = ['F', 'D', 'C', 'B', 'A']
            const eligible = gradeOrder.indexOf(result.grade) >= gradeOrder.indexOf(opt.minGrade)
            return (
              <div key={opt.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, alignItems: 'center', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--b)', opacity: eligible ? 1 : 0.5 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{opt.type}</div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{opt.best}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>{opt.rate}</div>
                  <div style={{ fontSize: 8, color: 'var(--tx3)' }}>{tc('cfo_credit.financing_cost')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>{opt.speed}</div>
                  <div style={{ fontSize: 8, color: 'var(--tx3)' }}>{tc('cfo_credit.financing_speed')}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                  background: eligible ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.06)',
                  color: eligible ? '#22C55E' : '#EF4444' }}>
                  {eligible ? tc('cfo_credit.financing_eligible') : tc('cfo_credit.financing_needs_grade', { grade: opt.minGrade })}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lender products */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 8 }}>{tc('cfo_credit.lenders_section')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {region.lenders.map(lender => (
            <LenderRow key={lender.name} name={lender.name} range={lender.range} minGrade={lender.minGrade} currentGrade={result.grade} tc={tc} />
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--b)', fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
        {tc('cfo_credit.footer_disclaimer', { tip: region.complianceTip })}
      </div>
    </div>
  )
}

function buildFinancingOptions(tc: TC): { id: string; type: string; rate: string; speed: string; best: string; minGrade: string }[] {
  return [
    { id: 'revenue', type: tc('cfo_credit.financing_revenue_based'), rate: '6-12%', speed: '1-3 days', best: tc('cfo_credit.financing_revenue_based_best'), minGrade: 'C' },
    { id: 'invoice', type: tc('cfo_credit.financing_invoice'), rate: '2-5%', speed: '24 hours', best: tc('cfo_credit.financing_invoice_best'), minGrade: 'C' },
    { id: 'term', type: tc('cfo_credit.financing_term'), rate: '8-18%', speed: '1-4 weeks', best: tc('cfo_credit.financing_term_best'), minGrade: 'B' },
    { id: 'overdraft', type: tc('cfo_credit.financing_overdraft'), rate: '10-20%', speed: '1-2 weeks', best: tc('cfo_credit.financing_overdraft_best'), minGrade: 'B' },
    { id: 'asset', type: tc('cfo_credit.financing_asset'), rate: '5-12%', speed: '1-2 weeks', best: tc('cfo_credit.financing_asset_best'), minGrade: 'C' },
  ]
}

function LenderRow({ name, range, minGrade, currentGrade, tc }: { name: string; range: string; minGrade: string; currentGrade: string; tc: TC }) {
  const gradeOrder = ['F', 'D', 'C', 'B', 'A']
  const eligible = gradeOrder.indexOf(currentGrade) >= gradeOrder.indexOf(minGrade)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
      <div>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)' }}>{name}</span>
        <span style={{ fontSize: 10, color: 'var(--tx3)', marginLeft: 6 }}>{range}</span>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
        background: eligible ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.06)',
        color: eligible ? '#22C55E' : '#EF4444',
      }}>
        {eligible ? tc('cfo_credit.lender_likely_eligible') : tc('cfo_credit.lender_needs_grade', { grade: minGrade })}
      </span>
    </div>
  )
}
