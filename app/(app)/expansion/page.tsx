'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Candidate {
  id: string
  candidate_name: string
  candidate_type: string
  opportunity_score: number
  why_it_fits: string
  estimated_margin_pct: number
  cannibalization_risk: string
  confidence: string
  best_region: string
  recommended_opening_order: number
  created_at: string
  status: string
}

const TYPE_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  variant_extension: { label: 'Variant', color: 'rgba(208,138,89,.15)', emoji: '🔄' },
  adjacent_category: { label: 'Adjacent', color: 'rgba(140,111,224,.15)', emoji: '🎯' },
  bundle: { label: 'Bundle', color: 'rgba(34,197,94,.12)', emoji: '📦' },
  geographic: { label: 'Geographic', color: 'rgba(59,130,246,.12)', emoji: '🌍' },
  trend_led: { label: 'Trend', color: 'rgba(239,68,68,.12)', emoji: '📈' },
}

const RISK_COLOR: Record<string, string> = {
  low: '#22c55e', medium: '#f5c55a', high: '#f48080'
}

const MOCK_CANDIDATES: Candidate[] = [
  { id: '1', candidate_name: 'Body Lotion 400ml', candidate_type: 'adjacent_category', opportunity_score: 74, why_it_fits: 'Your cooking oil buyers purchase body lotion 38% of the time from competitors. Strong margin potential.', estimated_margin_pct: 34, cannibalization_risk: 'low', confidence: 'high', best_region: 'Nairobi Central', recommended_opening_order: 200, created_at: new Date().toISOString(), status: 'new' },
  { id: '2', candidate_name: 'Cooking Oil 2L', candidate_type: 'variant_extension', opportunity_score: 68, why_it_fits: 'Your 1L cooking oil is your top seller. 2L variant captures bulk buyers and improves margin per unit.', estimated_margin_pct: 29, cannibalization_risk: 'medium', confidence: 'high', best_region: 'All stores', recommended_opening_order: 150, created_at: new Date().toISOString(), status: 'new' },
  { id: '3', candidate_name: 'Breakfast Bundle (Maize + Sugar + Tea)', candidate_type: 'bundle', opportunity_score: 61, why_it_fits: 'These 3 products are bought together 44% of the time. Bundling at 8% discount drives basket size.', estimated_margin_pct: 22, cannibalization_risk: 'low', confidence: 'medium', best_region: 'Nairobi', recommended_opening_order: 100, created_at: new Date().toISOString(), status: 'shortlisted' },
  { id: '4', candidate_name: 'Hand Sanitiser 500ml', candidate_type: 'trend_led', opportunity_score: 55, why_it_fits: 'Search volume up 34% in Nairobi this month. Your cleaning product buyers are the natural audience.', estimated_margin_pct: 41, cannibalization_risk: 'low', confidence: 'medium', best_region: 'Nairobi, Mombasa', recommended_opening_order: 300, created_at: new Date().toISOString(), status: 'new' },
  { id: '5', candidate_name: 'Unga wa Ngano 2kg', candidate_type: 'adjacent_category', opportunity_score: 49, why_it_fits: 'Maize flour buyers frequently purchase wheat flour. Category gap in your current assortment.', estimated_margin_pct: 19, cannibalization_risk: 'medium', confidence: 'low', best_region: 'Nairobi West', recommended_opening_order: 250, created_at: new Date().toISOString(), status: 'new' },
]

export default function ExpansionPage() {
  const router = useRouter()
  const { planId, loading: planLoading } = usePlan()
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [generating, setGenerating] = useState(false)

  const filtered = filter === 'all' ? candidates : candidates.filter(c => c.status === filter)
  const topScore = Math.max(...candidates.map(c => c.opportunity_score))
  const avgMargin = Math.round(candidates.reduce((a, b) => a + b.estimated_margin_pct, 0) / candidates.length)
  const highConfidence = candidates.filter(c => c.confidence === 'high').length
  const lowRisk = candidates.filter(c => c.cannibalization_risk === 'low').length

  const runAnalysis = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
  }

  if (!planLoading && planId === 'free') return <FeatureGate planId={planId} feature='expansion_intel' featureName='Expansion Intelligence' planNeeded='growth'><></></FeatureGate>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--b)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600 }}>Expansion Intelligence</div>
          <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3 }}>Product opportunities ranked by profit potential, demand evidence, and risk</div>
        </div>
        <button onClick={runAnalysis} disabled={generating}
          style={{ padding: '9px 18px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: generating ? .6 : 1, display: 'flex', alignItems: 'center', gap: 7 }}>
          {generating ? '⟳ Analysing…' : '✦ Run new analysis'}
        </button>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
          {[
            { label: 'Opportunities found', value: candidates.length, sub: 'this analysis', color: 'var(--acc)' },
            { label: 'Top opportunity score', value: `${topScore}/100`, sub: 'Body Lotion 400ml', color: 'var(--acc)' },
            { label: 'Avg estimated margin', value: `${avgMargin}%`, sub: 'across all candidates', color: '#22c55e' },
            { label: 'High confidence picks', value: highConfidence, sub: 'strong evidence', color: '#8c6fe0' },
            { label: 'Low cannibalisation', value: lowRisk, sub: 'safe to launch', color: '#22c55e' },
          ].map((k, i) => (
            <div key={i} style={{ padding: '16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)', marginTop: 2 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All (${candidates.length})` },
            { key: 'new', label: `New (${candidates.filter(c => c.status === 'new').length})` },
            { key: 'shortlisted', label: `Shortlisted (${candidates.filter(c => c.status === 'shortlisted').length})` },
            { key: 'testing', label: `Testing (${candidates.filter(c => c.status === 'testing').length})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding: '6px 14px', borderRadius: 9999, border: `1px solid ${filter === f.key ? 'rgba(208,138,89,.4)' : 'var(--b)'}`, background: filter === f.key ? 'rgba(208,138,89,.1)' : 'transparent', color: filter === f.key ? 'var(--acc)' : 'var(--tx2)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', fontWeight: filter === f.key ? 600 : 400 }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Candidate cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((c, i) => {
            const typeInfo = TYPE_LABELS[c.candidate_type] || { label: c.candidate_type, color: 'var(--ev)', emoji: '•' }
            return (
              <div key={c.id} onClick={() => router.push(`/expansion/${c.id}`)}
                style={{ padding: '18px 20px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)', cursor: 'pointer', transition: 'all 150ms', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(208,138,89,.3)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(208,138,89,.03)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--b)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--sf)' }}>

                {/* Rank */}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? 'var(--acc)' : 'var(--ev)', color: i === 0 ? '#fff' : 'var(--tx2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 600 }}>{c.candidate_name}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 9999, background: typeInfo.color, fontSize: 11, fontWeight: 500, color: 'var(--tx2)' }}>
                      {typeInfo.emoji} {typeInfo.label}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 9999, background: c.confidence === 'high' ? 'rgba(34,197,94,.1)' : 'rgba(245,197,90,.1)', fontSize: 11, color: c.confidence === 'high' ? '#22c55e' : '#f5c55a' }}>
                      {c.confidence} confidence
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.5 }}>{c.why_it_fits}</div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: 20, flexShrink: 0, flexWrap: 'wrap' }}>
                  {/* Score */}
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ position: 'relative', width: 48, height: 48, margin: '0 auto 4px' }}>
                      <svg width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--ev)" strokeWidth="4"/>
                        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--acc)" strokeWidth="4"
                          strokeDasharray={`${(c.opportunity_score / 100) * 125.6} 125.6`}
                          strokeLinecap="round" transform="rotate(-90 24 24)"/>
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sora)', fontSize: 12, fontWeight: 700 }}>
                        {c.opportunity_score}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Score</div>
                  </div>

                  {/* Margin */}
                  <div style={{ textAlign: 'center', minWidth: 50 }}>
                    <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: '#22c55e' }}>{c.estimated_margin_pct}%</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Est. margin</div>
                  </div>

                  {/* Cannibalisation */}
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700, color: RISK_COLOR[c.cannibalization_risk] }}>
                      {c.cannibalization_risk.charAt(0).toUpperCase() + c.cannibalization_risk.slice(1)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Cannibal. risk</div>
                  </div>

                  {/* Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--tx3)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(208,138,89,.2)', background: 'rgba(208,138,89,.04)', fontSize: 13, color: 'var(--tx2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span>💡 Connect Shopify or upload more data to get personalised expansion opportunities based on your actual sales.</span>
          <button onClick={() => router.push('/sources')}
            style={{ padding: '7px 16px', borderRadius: 9999, border: '1px solid var(--acc)', background: 'transparent', color: 'var(--acc)', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Connect data →
          </button>
        </div>

      </div>
    </div>
  )
}
