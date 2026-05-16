'use client'
import { useState } from 'react'

interface Decision {
  id: string
  title: string
  description?: string
  decision_type: 'pricing' | 'stock' | 'supplier' | 'product' | 'strategy'
  product?: string
  before_value?: string
  after_value?: string
  review_at?: string
  reviewed?: boolean
  review_result?: string
  review_verdict?: 'good_call' | 'bad_call' | 'neutral' | null
  created_at: string
}

interface DecisionTimelineProps {
  decisions: Decision[]
  onAsk: (prompt: string) => void
}

const TYPE_COLORS: Record<string, string> = {
  pricing:  '#6366F1',
  stock:    '#22C55E',
  supplier: '#F59E0B',
  product:  '#EC4899',
  strategy: '#8B5CF6',
}

const TYPE_LABELS: Record<string, string> = {
  pricing: 'Pricing', stock: 'Stock', supplier: 'Supplier', product: 'Product', strategy: 'Strategy',
}

function verdictConfig(verdict: string | null | undefined) {
  if (verdict === 'good_call') return { label: 'Good call', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' }
  if (verdict === 'bad_call')  return { label: "Didn't work", color: '#EF4444', bg: 'rgba(239,68,68,0.1)' }
  if (verdict === 'neutral')   return { label: 'Mixed', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' }
  return null
}

function isReviewDue(decision: Decision) {
  if (decision.reviewed) return false
  if (!decision.review_at) return false
  return new Date(decision.review_at) <= new Date()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

export default function DecisionTimeline({ decisions, onAsk }: DecisionTimelineProps) {
  const [selected, setSelected] = useState<string | null>(null)

  if (!decisions.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx3)' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>📝</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>No decisions logged yet</div>
        <div style={{ fontSize: 12, lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
          Log your first business decision and AskBiz will check back in 6 weeks to see how it played out.
        </div>
      </div>
    )
  }

  // Sort by date ascending for timeline
  const sorted = [...decisions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const goodCalls  = decisions.filter(d => d.review_verdict === 'good_call').length
  const badCalls   = decisions.filter(d => d.review_verdict === 'bad_call').length
  const reviewed   = decisions.filter(d => d.reviewed).length
  const dueCt      = decisions.filter(isReviewDue).length

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-sora)' }}>{decisions.length}</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Total decisions</div>
        </div>
        <div style={{ width: 1, background: 'var(--b)', alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-sora)' }}>{reviewed}</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Reviewed</div>
        </div>
        <div style={{ width: 1, background: 'var(--b)', alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#22C55E', fontFamily: 'var(--font-sora)' }}>{goodCalls}</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Good calls</div>
        </div>
        <div style={{ width: 1, background: 'var(--b)', alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#EF4444', fontFamily: 'var(--font-sora)' }}>{badCalls}</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Missed calls</div>
        </div>
        {reviewed > 0 && (
          <>
            <div style={{ width: 1, background: 'var(--b)', alignSelf: 'stretch' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#6366F1', fontFamily: 'var(--font-sora)' }}>
                {Math.round((goodCalls / reviewed) * 100)}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Success rate</div>
            </div>
          </>
        )}
        {dueCt > 0 && (
          <>
            <div style={{ width: 1, background: 'var(--b)', alignSelf: 'stretch' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--font-sora)' }}>{dueCt}</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Due for review</div>
            </div>
          </>
        )}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 7, top: 10, bottom: 10,
          width: 2, background: 'var(--b)', borderRadius: 1,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((decision, i) => {
            const verdict  = verdictConfig(decision.review_verdict)
            const due      = isReviewDue(decision)
            const typeCol  = TYPE_COLORS[decision.decision_type] || '#6b6760'
            const isOpen   = selected === decision.id

            // Node color
            let nodeColor = '#D1D5DB'       // pending / grey
            if (verdict?.color) nodeColor = verdict.color
            else if (due)       nodeColor = '#F59E0B'

            return (
              <div key={decision.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {/* Timeline node */}
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: nodeColor,
                  flexShrink: 0, marginTop: 3, position: 'relative',
                  boxShadow: due ? `0 0 0 3px ${nodeColor}30, 0 0 0 6px ${nodeColor}12` : verdict ? `0 0 0 2px ${nodeColor}20` : 'none',
                  transition: 'box-shadow 200ms',
                  zIndex: 1,
                }} />

                {/* Card */}
                <div
                  onClick={() => setSelected(isOpen ? null : decision.id)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `1px solid ${isOpen ? typeCol + '40' : 'var(--b)'}`,
                    background: isOpen ? typeCol + '06' : 'var(--sf)',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.borderColor = typeCol + '30' }}
                  onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--b)' }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.3 }}>{decision.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                      {due && !verdict && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', background: 'rgba(245,158,11,0.12)', padding: '2px 7px', borderRadius: 9999 }}>
                          Review due
                        </span>
                      )}
                      {verdict && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: verdict.color, background: verdict.bg, padding: '2px 7px', borderRadius: 9999 }}>
                          {verdict.label}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: typeCol, background: typeCol + '12', padding: '2px 7px', borderRadius: 9999 }}>
                      {TYPE_LABELS[decision.decision_type] || decision.decision_type}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{formatDate(decision.created_at)}</span>
                    {decision.product && <span style={{ fontSize: 11, color: 'var(--tx3)' }}>· {decision.product}</span>}
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--b)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {decision.description && (
                        <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>{decision.description}</div>
                      )}
                      {(decision.before_value || decision.after_value) && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {decision.before_value && (
                            <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'var(--ev)', color: 'var(--tx3)' }}>
                              Before: <strong style={{ color: 'var(--tx2)' }}>{decision.before_value}</strong>
                            </div>
                          )}
                          {decision.after_value && (
                            <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'var(--ev)', color: 'var(--tx3)' }}>
                              After: <strong style={{ color: typeCol }}>{decision.after_value}</strong>
                            </div>
                          )}
                        </div>
                      )}
                      {decision.review_at && (
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                          {decision.reviewed ? `Reviewed ${formatDate(decision.review_at)}` : `Review scheduled: ${formatDate(decision.review_at)}`}
                        </div>
                      )}
                      {decision.review_result && (
                        <div style={{ fontSize: 12, color: 'var(--tx2)', padding: '8px 12px', borderRadius: 8, background: 'var(--ev)', lineHeight: 1.55 }}>
                          {decision.review_result}
                        </div>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); onAsk(`Analyse this decision I made: ${decision.title}. ${decision.description || ''}`) }}
                        style={{ alignSelf: 'flex-start', padding: '6px 12px', borderRadius: 8, border: 'none', background: typeCol, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Ask AskBiz →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
