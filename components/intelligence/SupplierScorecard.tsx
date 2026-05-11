'use client'
import { useState, useEffect } from 'react'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const B2   = 'rgba(0,0,0,.14)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Shipment {
  id:               string
  supplier_name:    string
  carrier_name:     string
  track_status:     string
  delay_days:       number | null
  is_at_risk:       boolean | null
  customs_hold:     boolean
  financial_impact: number | null
  total_value:      number | null
  expected_arrival: string
}

interface SupplierScore {
  name:               string
  shipmentCount:      number
  deliveredCount:     number
  delayedCount:       number
  atRiskCount:        number
  customsHoldCount:   number
  onTimeRate:         number   // 0-100
  avgDelayDays:       number
  totalFinancialImpact: number
  totalValue:         number
  score:              number   // 0-100 composite
  grade:              'A' | 'B' | 'C' | 'D' | 'F'
  carriers:           string[]
  recommendation:     string
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function gradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

const GRADE_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  A: { text: '#16a34a', bg: 'rgba(34,197,94,.1)',   border: 'rgba(34,197,94,.25)'  },
  B: { text: '#0284c7', bg: 'rgba(14,165,233,.1)',  border: 'rgba(14,165,233,.25)' },
  C: { text: '#d97706', bg: 'rgba(245,158,11,.1)',  border: 'rgba(245,158,11,.25)' },
  D: { text: '#ea580c', bg: 'rgba(234,88,12,.1)',   border: 'rgba(234,88,12,.25)'  },
  F: { text: '#dc2626', bg: 'rgba(220,38,38,.1)',   border: 'rgba(220,38,38,.25)'  },
}

function buildRecommendation(s: SupplierScore): string {
  if (s.grade === 'A') return 'Excellent reliability. Prioritise this supplier for your most time-sensitive orders.'
  if (s.grade === 'B') return `Good performance. Minor delays averaging ${s.avgDelayDays.toFixed(1)} days — monitor but no action required.`
  if (s.grade === 'C') {
    if (s.customsHoldCount > 0) return `${s.customsHoldCount} customs hold${s.customsHoldCount > 1 ? 's' : ''} detected — review documentation requirements before next order.`
    return `On-time rate of ${s.onTimeRate.toFixed(0)}% is below acceptable. Raise with supplier and build 7-day safety stock buffer.`
  }
  if (s.grade === 'D') return `Significant delays averaging ${s.avgDelayDays.toFixed(1)} days. Financial impact £${s.totalFinancialImpact.toFixed(0)}. Begin qualifying an alternative supplier.`
  return `Critical reliability failure. ${s.delayedCount} of ${s.shipmentCount} shipments delayed. Urgently diversify — this supplier is costing your business.`
}

function scoreSuppliers(shipments: Shipment[]): SupplierScore[] {
  // Group by supplier
  const map = new Map<string, Shipment[]>()
  for (const s of shipments) {
    const key = (s.supplier_name || 'Unknown').trim()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }

  return Array.from(map.entries())
    .map(([name, items]) => {
      const deliveredCount   = items.filter(s => s.track_status === 'Delivered').length
      const delayedCount     = items.filter(s => s.delay_days && s.delay_days > 0).length
      const atRiskCount      = items.filter(s => s.is_at_risk).length
      const customsHoldCount = items.filter(s => s.customs_hold).length
      const totalDelay       = items.reduce((sum, s) => sum + (s.delay_days || 0), 0)
      const avgDelayDays     = items.length > 0 ? totalDelay / items.length : 0
      const totalFinancialImpact = items.reduce((sum, s) => sum + (s.financial_impact || 0), 0)
      const totalValue       = items.reduce((sum, s) => sum + (s.total_value || 0), 0)
      const onTimeCount      = deliveredCount - delayedCount
      const onTimeRate       = deliveredCount > 0 ? Math.max(0, (onTimeCount / deliveredCount) * 100) : 100

      // Carriers used
      const carriers = [...new Set(items.map(s => s.carrier_name).filter(Boolean))]

      // Composite score (0-100)
      // On-time rate: 50 points
      // No customs holds: 20 points
      // Low financial impact: 15 points
      // Low delay days: 15 points
      const onTimePoints     = (onTimeRate / 100) * 50
      const customsPoints    = customsHoldCount === 0 ? 20 : Math.max(0, 20 - customsHoldCount * 7)
      const maxImpact        = 5000
      const impactPoints     = totalValue > 0 ? Math.max(0, 15 * (1 - Math.min(totalFinancialImpact / maxImpact, 1))) : 15
      const maxDelay         = 14
      const delayPoints      = Math.max(0, 15 * (1 - Math.min(avgDelayDays / maxDelay, 1)))
      const score            = Math.round(onTimePoints + customsPoints + impactPoints + delayPoints)

      const grade = gradeFromScore(score)
      const draft: SupplierScore = {
        name, shipmentCount: items.length, deliveredCount, delayedCount,
        atRiskCount, customsHoldCount, onTimeRate, avgDelayDays,
        totalFinancialImpact, totalValue, score, grade, carriers,
        recommendation: '',
      }
      draft.recommendation = buildRecommendation(draft)
      return draft
    })
    .filter(s => s.shipmentCount > 0)
    .sort((a, b) => b.score - a.score)
}

// ── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ value, max = 100, colour }: { value: number; max?: number; colour: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ height: 5, background: EV, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: colour, borderRadius: 3, transition: 'width 600ms var(--ease)' }}/>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SupplierScorecard({ onAsk }: { onAsk: (prompt: string) => void }) {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [sortBy, setSortBy]       = useState<'score' | 'shipments' | 'impact'>('score')

  useEffect(() => {
    fetch('/api/track?status=all')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.shipments) setShipments(data.shipments)
        else if (Array.isArray(data)) setShipments(data)
      })
      .catch(() => setError('Could not load shipment data'))
      .finally(() => setLoading(false))
  }, [])

  const suppliers = scoreSuppliers(shipments)

  const sorted = [...suppliers].sort((a, b) => {
    if (sortBy === 'score')     return b.score - a.score
    if (sortBy === 'shipments') return b.shipmentCount - a.shipmentCount
    if (sortBy === 'impact')    return b.totalFinancialImpact - a.totalFinancialImpact
    return 0
  })

  // Summary stats
  const avgScore    = suppliers.length > 0 ? Math.round(suppliers.reduce((s, x) => s + x.score, 0) / suppliers.length) : 0
  const atRisk      = suppliers.filter(s => s.grade === 'D' || s.grade === 'F')
  const totalImpact = suppliers.reduce((s, x) => s + x.totalFinancialImpact, 0)

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map(i => <div key={i} style={{ height: 80, borderRadius: 14, background: EV }}/>)}
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', background: SF, border: `1px solid ${B}`, borderRadius: 14 }}>
        <div style={{ fontSize: 13, color: TX3 }}>{error}</div>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', background: SF, border: `1px solid ${B}`, borderRadius: 16 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: TX, marginBottom: 6 }}>
          No supplier data yet
        </div>
        <p style={{ fontSize: 13, color: TX3, lineHeight: 1.65, maxWidth: 340, margin: '0 auto 16px' }}>
          Add shipments with supplier names and AskBiz will automatically build your supplier scorecard as deliveries arrive.
        </p>
        <button
          onClick={() => onAsk('How do I set up supplier tracking in AskBiz to monitor delivery performance?')}
          style={{ fontSize: 13, fontWeight: 600, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '8px 18px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          How to get started →
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: TX, marginBottom: 4 }}>
          Supplier Scorecard
        </div>
        <div style={{ fontSize: 13, color: TX2, lineHeight: 1.5 }}>
          On-time delivery, customs holds, delay days, and financial impact — scored per supplier from your shipment history.
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Suppliers tracked', value: String(suppliers.length),         colour: TX },
          { label: 'Avg score',         value: String(avgScore) + '/100',        colour: avgScore >= 70 ? '#16a34a' : avgScore >= 50 ? '#d97706' : '#dc2626' },
          { label: 'At risk',           value: String(atRisk.length),            colour: atRisk.length > 0 ? '#dc2626' : '#16a34a' },
          { label: 'Total delay cost',  value: totalImpact > 0 ? `£${totalImpact.toFixed(0)}` : '£0', colour: totalImpact > 500 ? '#dc2626' : TX },
        ].map((k, i) => (
          <div key={i} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: TX3, marginBottom: 5, fontWeight: 500 }}>{k.label}</div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, color: k.colour }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Sort controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: TX3 }}>Sort by:</span>
        {(['score', 'shipments', 'impact'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            style={{ fontSize: 12, fontWeight: sortBy === s ? 600 : 400, color: sortBy === s ? ACC : TX3, background: sortBy === s ? 'rgba(208,138,89,.08)' : 'transparent', border: `1px solid ${sortBy === s ? 'rgba(208,138,89,.3)' : B}`, borderRadius: 9999, padding: '3px 11px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}
          >
            {s === 'impact' ? 'Financial impact' : s}
          </button>
        ))}
      </div>

      {/* Supplier cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(supplier => {
          const g = GRADE_STYLE[supplier.grade]
          const isOpen = expanded === supplier.name
          return (
            <div key={supplier.name} style={{ background: SF, border: `1px solid ${isOpen ? 'rgba(208,138,89,.3)' : B}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 200ms' }}>

              {/* Card header — always visible */}
              <div
                onClick={() => setExpanded(isOpen ? null : supplier.name)}
                style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
              >
                {/* Grade badge */}
                <div style={{ width: 40, height: 40, borderRadius: 10, background: g.bg, border: `1px solid ${g.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 800, color: g.text }}>{supplier.grade}</span>
                </div>

                {/* Name + metrics */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TX }}>{supplier.name}</span>
                    <span style={{ fontSize: 11, color: TX3 }}>{supplier.shipmentCount} shipment{supplier.shipmentCount > 1 ? 's' : ''}</span>
                    {supplier.customsHoldCount > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#dc2626', background: 'rgba(220,38,38,.08)', padding: '1px 7px', borderRadius: 9999 }}>
                        {supplier.customsHoldCount} customs hold{supplier.customsHoldCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 400 }}>
                    <div>
                      <div style={{ fontSize: 10, color: TX3, marginBottom: 2 }}>On-time rate</div>
                      <ScoreBar value={supplier.onTimeRate} colour={supplier.onTimeRate >= 80 ? '#16a34a' : supplier.onTimeRate >= 60 ? '#d97706' : '#dc2626'}/>
                      <div style={{ fontSize: 11, fontWeight: 600, color: supplier.onTimeRate >= 80 ? '#16a34a' : supplier.onTimeRate >= 60 ? '#d97706' : '#dc2626', marginTop: 2 }}>{supplier.onTimeRate.toFixed(0)}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: TX3, marginBottom: 2 }}>Avg delay</div>
                      <ScoreBar value={Math.max(0, 14 - supplier.avgDelayDays)} max={14} colour={supplier.avgDelayDays <= 2 ? '#16a34a' : supplier.avgDelayDays <= 5 ? '#d97706' : '#dc2626'}/>
                      <div style={{ fontSize: 11, fontWeight: 600, color: supplier.avgDelayDays <= 2 ? '#16a34a' : supplier.avgDelayDays <= 5 ? '#d97706' : '#dc2626', marginTop: 2 }}>{supplier.avgDelayDays.toFixed(1)}d</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: TX3, marginBottom: 2 }}>Composite score</div>
                      <ScoreBar value={supplier.score} colour={g.text}/>
                      <div style={{ fontSize: 11, fontWeight: 600, color: g.text, marginTop: 2 }}>{supplier.score}/100</div>
                    </div>
                  </div>
                </div>

                {/* Financial impact + chevron */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {supplier.totalFinancialImpact > 0 && (
                    <>
                      <div style={{ fontSize: 11, color: TX3, marginBottom: 2 }}>Delay cost</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>−£{supplier.totalFinancialImpact.toFixed(0)}</div>
                    </>
                  )}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ marginTop: 6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${B}`, padding: '14px 16px', background: EV }}>

                  {/* Recommendation */}
                  <div style={{ padding: '10px 13px', borderRadius: 10, background: g.bg, border: `1px solid ${g.border}`, marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: g.text, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Recommendation</div>
                    <div style={{ fontSize: 13, color: TX2, lineHeight: 1.55 }}>{supplier.recommendation}</div>
                  </div>

                  {/* Detail grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                    {[
                      { label: 'Total shipments',  value: String(supplier.shipmentCount) },
                      { label: 'Delivered',         value: String(supplier.deliveredCount) },
                      { label: 'Delayed',           value: String(supplier.delayedCount),       warn: supplier.delayedCount > 0 },
                      { label: 'Customs holds',     value: String(supplier.customsHoldCount),   warn: supplier.customsHoldCount > 0 },
                      { label: 'Total value',       value: supplier.totalValue > 0 ? `£${supplier.totalValue.toLocaleString()}` : '—' },
                      { label: 'Financial impact',  value: supplier.totalFinancialImpact > 0 ? `−£${supplier.totalFinancialImpact.toFixed(0)}` : '£0', warn: supplier.totalFinancialImpact > 500 },
                    ].map((item, i) => (
                      <div key={i} style={{ background: SF, borderRadius: 9, padding: '9px 11px', border: `1px solid ${B}` }}>
                        <div style={{ fontSize: 11, color: TX3, marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: item.warn ? '#dc2626' : TX }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Carriers */}
                  {supplier.carriers.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: TX3, marginBottom: 6 }}>Carriers used</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {supplier.carriers.map(c => (
                          <span key={c} style={{ fontSize: 12, color: TX2, background: SF, border: `1px solid ${B}`, borderRadius: 9999, padding: '2px 10px' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ask AskBiz */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onAsk(`Analyse ${supplier.name}'s delivery performance. They have a ${supplier.onTimeRate.toFixed(0)}% on-time rate, average delay of ${supplier.avgDelayDays.toFixed(1)} days, ${supplier.customsHoldCount} customs holds, and have cost me £${supplier.totalFinancialImpact.toFixed(0)} in financial impact. Should I find an alternative supplier?`)}
                      style={{ fontSize: 12, fontWeight: 600, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9, padding: '7px 13px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Ask AskBiz about this supplier →
                    </button>
                    {(supplier.grade === 'D' || supplier.grade === 'F') && (
                      <button
                        onClick={() => onAsk(`I need to find an alternative to ${supplier.name} who ships ${supplier.carriers[0] || 'internationally'}. What should I look for in a replacement supplier and how do I qualify them?`)}
                        style={{ fontSize: 12, color: '#dc2626', background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 9, padding: '7px 13px', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Find alternative supplier →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 14, fontSize: 11, color: TX3, textAlign: 'center', lineHeight: 1.5 }}>
        Scores calculated from {shipments.length} shipment{shipments.length !== 1 ? 's' : ''} across {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} · Updates automatically as deliveries arrive
      </div>
    </div>
  )
}
