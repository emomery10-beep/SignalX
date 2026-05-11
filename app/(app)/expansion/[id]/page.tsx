'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const MOCK_CANDIDATE = {
  id: '1',
  candidate_name: 'Body Lotion 400ml',
  candidate_type: 'adjacent_category',
  opportunity_score: 74,
  why_it_fits: 'Your cooking oil buyers purchase body lotion 38% of the time from competitors. You already have the customer — you just need the product.',
  evidence: {
    internal_demand: '67% of your top 200 customers buy personal care products from other stores. Your repeat buyers visit 4.2× per month on average.',
    trend_signal: 'Body lotion searches up 22% in Nairobi over the last 3 months. Peak demand in August–October (dry season).',
    margin_signal: 'Category average gross margin is 34–42%. Your current portfolio average is 22%. This would lift your blended margin.',
    customer_fit: 'Same demographic as your current cooking oil and maize flour buyers. No new customer acquisition needed.'
  },
  financial: {
    estimated_margin_pct: 34,
    estimated_monthly_revenue: 48000,
    break_even_units: 87,
    recommended_opening_order: 200,
    suggested_price_range: 'KSh 180 – 220',
    estimated_monthly_profit: 16320,
    months_to_recover: 1.4,
  },
  cannibalization: {
    risk_level: 'low',
    affected_skus: [],
    explanation: 'No overlap with current assortment. Body lotion occupies a completely separate shelf and customer use case. Zero substitution risk.',
    net_gain_pct: 100,
  },
  launch: {
    best_region: 'Nairobi Central',
    best_channel: 'In-store + WhatsApp broadcast to existing customers',
    test_length_days: 30,
    success_threshold: '80 units sold in first 30 days',
    opening_order_rationale: '200 units covers 2.3 months at projected velocity. Low dead stock risk.',
  },
  risks: [
    'Lead time from supplier may be 2–3 weeks — plan opening order early',
    'Store storage space required for additional SKU',
    'Price sensitivity — test at KSh 195 before committing to full range',
  ],
  confidence: 'high',
  status: 'new',
}

const RISK_COLOR: Record<string, string> = { low: '#22c55e', medium: '#f5c55a', high: '#f48080' }
const RISK_BG: Record<string, string> = { low: 'rgba(34,197,94,.1)', medium: 'rgba(245,197,90,.1)', high: 'rgba(244,128,128,.1)' }

export default function CandidateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [c] = useState(MOCK_CANDIDATE)
  const [status, setStatus] = useState(c.status)
  const [saving, setSaving] = useState(false)

  // Simulator state
  const [simInputs, setSimInputs] = useState({
    sellPrice: 195,
    landedCost: 115,
    packagingCost: 8,
    shippingCost: 5,
    platformFeePct: 0,
    expectedUnits: 200,
    returnRatePct: 2,
  })
  const [simResult, setSimResult] = useState<null | {
    grossMarginPct: number
    contributionMarginPct: number
    breakEvenUnits: number
    monthlyProfit: number
    verdict: string
  }>(null)

  const runSimulator = () => {
    const { sellPrice, landedCost, packagingCost, shippingCost, platformFeePct, expectedUnits, returnRatePct } = simInputs
    const totalCost = landedCost + packagingCost + shippingCost + (sellPrice * platformFeePct / 100)
    const grossMargin = sellPrice - totalCost
    const grossMarginPct = Math.round((grossMargin / sellPrice) * 100)
    const effectiveUnits = expectedUnits * (1 - returnRatePct / 100)
    const monthlyProfit = Math.round(grossMargin * effectiveUnits)
    const breakEvenUnits = Math.ceil(totalCost / grossMargin * totalCost / sellPrice * expectedUnits)
    const contributionMarginPct = grossMarginPct
    const verdict = grossMarginPct >= 30 ? '✅ Strong — worth launching'
      : grossMarginPct >= 20 ? '⚠️ Viable — watch costs'
      : '❌ Weak — revisit pricing or costs'
    setSimResult({ grossMarginPct, contributionMarginPct, breakEvenUnits: Math.max(breakEvenUnits, 10), monthlyProfit, verdict })
  }

  useEffect(() => { runSimulator() }, [])

  const updateStatus = async (newStatus: string) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setStatus(newStatus)
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--b)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => router.back()}
          style={{ padding: '6px 12px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600 }}>{c.candidate_name}</div>
          <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 2 }}>Expansion candidate · Adjacent category</div>
        </div>
        {/* Status buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['shortlisted', 'testing', 'launched', 'rejected'].map(s => (
            <button key={s} onClick={() => updateStatus(s)} disabled={saving}
              style={{ padding: '6px 14px', borderRadius: 9999, border: `1px solid ${status === s ? 'rgba(208,138,89,.4)' : 'var(--b)'}`, background: status === s ? 'rgba(208,138,89,.1)' : 'transparent', color: status === s ? 'var(--acc)' : 'var(--tx2)', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer', fontWeight: status === s ? 600 : 400, textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Score + top metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
          {[
            { label: 'Opportunity score', value: `${c.opportunity_score}/100`, color: 'var(--acc)' },
            { label: 'Est. gross margin', value: `${c.financial.estimated_margin_pct}%`, color: '#22c55e' },
            { label: 'Est. monthly profit', value: `KSh ${c.financial.estimated_monthly_profit.toLocaleString()}`, color: '#22c55e' },
            { label: 'Break-even units', value: `${c.financial.break_even_units} units`, color: 'var(--tx)' },
            { label: 'Opening order', value: `${c.financial.recommended_opening_order} units`, color: 'var(--tx)' },
            { label: 'Recover in', value: `${c.financial.months_to_recover} months`, color: 'var(--tx)' },
          ].map((m, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Why this */}
        <Card title="Why this product?">
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--tx2)' }}>{c.why_it_fits}</p>
        </Card>

        {/* Evidence */}
        <Card title="Demand evidence">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
            {[
              { icon: '📊', label: 'Internal demand', text: c.evidence.internal_demand },
              { icon: '📈', label: 'Trend signal', text: c.evidence.trend_signal },
              { icon: '💰', label: 'Margin signal', text: c.evidence.margin_signal },
              { icon: '👥', label: 'Customer fit', text: c.evidence.customer_fit },
            ].map((e, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--bg)' }}>
                <div style={{ fontSize: 16, marginBottom: 6 }}>{e.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 5 }}>{e.label}</div>
                <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6 }}>{e.text}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cannibalization */}
        <Card title="Cannibalisation risk">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ padding: '10px 18px', borderRadius: 12, background: RISK_BG[c.cannibalization.risk_level], flexShrink: 0, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, color: RISK_COLOR[c.cannibalization.risk_level] }}>
                {c.cannibalization.risk_level.toUpperCase()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>Risk level</div>
            </div>
            <div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--tx2)', marginBottom: 8 }}>{c.cannibalization.explanation}</p>
              {c.cannibalization.affected_skus.length > 0 && (
                <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Affected SKUs: {c.cannibalization.affected_skus.join(', ')}</div>
              )}
            </div>
          </div>
        </Card>

        {/* Simulator */}
        <Card title="Profit simulator — adjust and rerun">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { key: 'sellPrice', label: 'Selling price (KSh)', min: 50, max: 2000, step: 5 },
              { key: 'landedCost', label: 'Landed cost (KSh)', min: 10, max: 1500, step: 5 },
              { key: 'packagingCost', label: 'Packaging cost (KSh)', min: 0, max: 200, step: 1 },
              { key: 'shippingCost', label: 'Shipping cost (KSh)', min: 0, max: 200, step: 1 },
              { key: 'expectedUnits', label: 'Expected units/month', min: 10, max: 5000, step: 10 },
              { key: 'returnRatePct', label: 'Return rate (%)', min: 0, max: 20, step: 0.5 },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="range" min={f.min} max={f.max} step={f.step}
                    value={simInputs[f.key as keyof typeof simInputs]}
                    onChange={e => setSimInputs(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                    style={{ flex: 1, accentColor: 'var(--acc)' }}/>
                  <span style={{ fontSize: 13, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
                    {simInputs[f.key as keyof typeof simInputs]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={runSimulator}
            style={{ padding: '9px 20px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
            Recalculate →
          </button>
          {simResult && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
              {[
                { label: 'Gross margin', value: `${simResult.grossMarginPct}%`, color: simResult.grossMarginPct >= 30 ? '#22c55e' : simResult.grossMarginPct >= 20 ? '#f5c55a' : '#f48080' },
                { label: 'Monthly profit', value: `KSh ${simResult.monthlyProfit.toLocaleString()}`, color: '#22c55e' },
                { label: 'Break-even units', value: `${simResult.breakEvenUnits}`, color: 'var(--tx)' },
                { label: 'Verdict', value: simResult.verdict, color: 'var(--tx)', wide: true },
              ].map((r, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--ev)', gridColumn: r.wide ? '1 / -1' : undefined }}>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: r.wide ? 14 : 18, fontWeight: 700, color: r.color }}>{r.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>{r.label}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Launch plan */}
        <Card title="Launch plan">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
            {[
              { icon: '📍', label: 'Best region to test', value: c.launch.best_region },
              { icon: '📣', label: 'Best channel', value: c.launch.best_channel },
              { icon: '📅', label: 'Minimum test length', value: `${c.launch.test_length_days} days` },
              { icon: '🎯', label: 'Success threshold', value: c.launch.success_threshold },
              { icon: '📦', label: 'Opening order', value: `${c.financial.recommended_opening_order} units — ${c.launch.opening_order_rationale}` },
              { icon: '💰', label: 'Suggested price', value: c.financial.suggested_price_range },
            ].map((l, i) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--bg)' }}>
                <div style={{ fontSize: 14, marginBottom: 5 }}>{l.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontSize: 13, color: 'var(--tx)', lineHeight: 1.5 }}>{l.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Risks */}
        <Card title="Risk flags">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {c.risks.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(245,197,90,.25)', background: 'rgba(245,197,90,.06)', fontSize: 13, color: 'var(--tx2)', lineHeight: 1.55 }}>
                <span style={{ color: '#f5c55a', flexShrink: 0 }}>⚠</span> {r}
              </div>
            ))}
          </div>
        </Card>

        {/* Chat CTA */}
        <div style={{ padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(208,138,89,.2)', background: 'rgba(208,138,89,.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>Want to dig deeper?</div>
            <div style={{ fontSize: 13, color: 'var(--tx2)' }}>Ask AskBiz anything about this opportunity in the chat.</div>
          </div>
          <button onClick={() => router.push('/chat')}
            style={{ padding: '8px 18px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Ask in chat →
          </button>
        </div>

      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600 }}>{title}</div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  )
}
