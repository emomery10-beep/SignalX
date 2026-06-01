'use client'
import { useState } from 'react'

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

function computeCreditScore(props: Props): { total: number; maxTotal: number; grade: string; factors: ScoreFactor[] } {
  const factors: ScoreFactor[] = []

  // 1. Digital record quality (max 25)
  let digitalScore = 0
  if (props.hasPos) digitalScore += 10
  if (props.hasEcommerce) digitalScore += 5
  if (props.daysWithData >= 180) digitalScore += 10
  else if (props.daysWithData >= 90) digitalScore += 7
  else if (props.daysWithData >= 30) digitalScore += 4
  factors.push({
    label: 'Digital Records',
    score: digitalScore,
    maxScore: 25,
    detail: `${props.daysWithData} days of data${props.hasPos ? ', POS connected' : ''}${props.hasEcommerce ? ', e-commerce connected' : ''}`,
    status: digitalScore >= 20 ? 'good' : digitalScore >= 12 ? 'fair' : 'poor',
    tip: digitalScore < 20 ? 'Connect more data sources and maintain consistent digital records to improve this score.' : 'Strong digital footprint — lenders can verify your business activity.',
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
    label: 'Revenue Consistency',
    score: Math.min(revenueScore, 20),
    maxScore: 20,
    detail: `Monthly revenue: ${fmt(props.revenue, props.currencySymbol)}`,
    status: revenueScore >= 16 ? 'good' : revenueScore >= 8 ? 'fair' : 'poor',
    tip: revenueScore < 16 ? 'Consistent monthly revenue above KES 100K improves lending decisions. Avoid cash-only periods.' : 'Revenue level and consistency look strong for lending.',
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
    label: 'Profitability',
    score: Math.min(profitScore, 20),
    maxScore: 20,
    detail: `Gross margin ${props.grossMarginPct}%, Net margin ${props.netMarginPct}%`,
    status: profitScore >= 16 ? 'good' : profitScore >= 8 ? 'fair' : 'poor',
    tip: profitScore < 16 ? 'Lenders want to see healthy margins. Focus on COGS reduction and pricing optimization.' : 'Healthy margins signal strong ability to service debt.',
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
    label: 'Cash Management',
    score: Math.min(cashScore, 20),
    maxScore: 20,
    detail: `${props.runwayMonths != null ? `${props.runwayMonths}mo runway` : 'Runway not set'}, ${props.stockoutRate}% stockout`,
    status: cashScore >= 14 ? 'good' : cashScore >= 8 ? 'fair' : 'poor',
    tip: cashScore < 14 ? 'Build a cash reserve of 3-6 months expenses. Reduce stockouts to show operational control.' : 'Good cash position and inventory management.',
  })

  // 5. Compliance (max 15)
  let complianceScore = 5
  if (props.hasPos) complianceScore += 5
  if (props.daysWithData >= 30) complianceScore += 5
  factors.push({
    label: 'Tax & Compliance',
    score: Math.min(complianceScore, 15),
    maxScore: 15,
    detail: 'Based on eTIMS readiness and record-keeping consistency',
    status: complianceScore >= 12 ? 'good' : complianceScore >= 7 ? 'fair' : 'poor',
    tip: complianceScore < 12 ? 'Register on eTIMS and keep all receipts digital. Lenders check KRA compliance status.' : 'Compliance posture looks solid for lending applications.',
  })

  const total = factors.reduce((s, f) => s + f.score, 0)
  const maxTotal = factors.reduce((s, f) => s + f.maxScore, 0)
  const grade = total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : total >= 35 ? 'D' : 'F'

  return { total, maxTotal, grade, factors }
}

export default function CreditReadiness(props: Props) {
  const { currencySymbol: sym, onAsk } = props
  const [expanded, setExpanded] = useState<string | null>(null)
  const result = computeCreditScore(props)

  const gradeColor = result.grade === 'A' ? '#22C55E' : result.grade === 'B' ? '#22C55E' : result.grade === 'C' ? '#F59E0B' : '#EF4444'
  const ringPct = (result.total / result.maxTotal) * 100

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Credit Readiness</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Lending eligibility score</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(`My credit readiness score is ${result.total}/${result.maxTotal} (Grade ${result.grade}). ${result.factors.filter(f => f.status === 'poor').map(f => `${f.label}: ${f.score}/${f.maxScore}`).join(', ')}. What should I improve first to qualify for business loans in Kenya (KCB, Equity, Fuliza Biashara)?`)}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Ask AI
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
            {result.grade === 'A' ? 'Excellent — Ready for formal lending' :
             result.grade === 'B' ? 'Good — Most lenders would consider' :
             result.grade === 'C' ? 'Fair — Digital lenders available' :
             'Needs Improvement — Build digital trail first'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>
            {result.grade === 'A' || result.grade === 'B'
              ? 'Your digital records and financial performance are strong enough for KCB, Equity, and Cooperative Bank SMB products.'
              : 'Focus on the areas below to strengthen your profile. Mobile lenders (Fuliza, Tala Business) may be available now.'}
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
                      {factor.status === 'good' ? 'Strength: ' : 'Improve: '}
                    </span>
                    {factor.tip}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Lender products */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Available Lending Products</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <LenderRow name="Fuliza Biashara" range="Up to KES 3M" minGrade="C" currentGrade={result.grade} />
          <LenderRow name="KCB Vooma" range="KES 50K–5M" minGrade="B" currentGrade={result.grade} />
          <LenderRow name="Equity Biashara" range="KES 100K–10M" minGrade="B" currentGrade={result.grade} />
          <LenderRow name="Cooperative Bank SME" range="KES 500K–50M" minGrade="A" currentGrade={result.grade} />
        </div>
      </div>

      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--b)', fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
        Score is indicative only — actual lending decisions depend on additional factors. Maintaining clean eTIMS records and consistent digital transactions improves eligibility across all lenders.
      </div>
    </div>
  )
}

function LenderRow({ name, range, minGrade, currentGrade }: { name: string; range: string; minGrade: string; currentGrade: string }) {
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
        {eligible ? 'Likely eligible' : `Needs Grade ${minGrade}+`}
      </span>
    </div>
  )
}
