'use client'
import { useState } from 'react'

interface HistoryPoint {
  score: number
  recorded_at?: string
  created_at?: string
}

interface MiniTrendChartProps {
  history: HistoryPoint[]
  label?: string
  height?: number
}

function barColor(score: number) {
  if (score >= 65) return '#22C55E'
  if (score >= 45) return '#F59E0B'
  return '#EF4444'
}

function formatDate(h: HistoryPoint) {
  const d = h.recorded_at || h.created_at
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function MiniTrendChart({ history, label = '30-Day Trend', height = 48 }: MiniTrendChartProps) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  const items = history.slice(-30)
  if (items.length < 2) return null

  const scores = items.map(h => Number(h.score) || 0)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)
  const range = maxScore - minScore || 1
  const firstScore = scores[0]
  const lastScore = scores[scores.length - 1]
  const delta = lastScore - firstScore
  const deltaLabel = `${delta >= 0 ? '+' : ''}${delta.toFixed(0)} pts`
  const deltaColor = delta >= 0 ? '#22C55E' : '#EF4444'

  return (
    <>
      {/* Mini chart card */}
      <div
        onClick={() => setExpanded(true)}
        style={{
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid var(--b)',
          background: 'var(--sf)',
          cursor: 'pointer',
          transition: 'box-shadow 150ms, border-color 150ms',
          userSelect: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = '#6366F130' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--b)' }}
        title="Click to expand"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: deltaColor }}>{deltaLabel} vs 30 days ago</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </div>
        </div>
        {/* Bar chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }} aria-hidden>
          {items.map((h, i) => {
            const sc = Number(h.score) || 0
            const pct = (sc - minScore) / range
            const ht = Math.max(4, pct * (height - 4) + 4)
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: ht,
                  background: barColor(sc),
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.8,
                  minWidth: 3,
                  transition: 'opacity 150ms',
                }}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--tx3)' }}>
          <span>30 days ago</span><span>Today</span>
        </div>
      </div>

      {/* Expanded modal */}
      {expanded && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setExpanded(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--sf)',
              borderRadius: 20,
              padding: '24px 28px',
              width: '100%',
              maxWidth: 560,
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
                  Score: <strong style={{ color: barColor(lastScore) }}>{lastScore}/100</strong>
                  &nbsp;·&nbsp;
                  <span style={{ color: deltaColor }}>{deltaLabel} vs 30 days ago</span>
                </div>
              </div>
              <button
                onClick={() => setExpanded(false)}
                style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Large bar chart with hover tooltips */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
                {items.map((h, i) => {
                  const sc = Number(h.score) || 0
                  const pct = (sc - minScore) / range
                  const ht = Math.max(8, pct * 112 + 8)
                  const isHov = hovered === i
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', cursor: 'default' }}
                    >
                      {isHov && (
                        <div style={{
                          position: 'absolute', bottom: ht + 6, left: '50%', transform: 'translateX(-50%)',
                          background: 'var(--tx)', color: 'var(--sf)', borderRadius: 6,
                          padding: '4px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 10,
                        }}>
                          {formatDate(h) && <span style={{ opacity: 0.65, marginRight: 4 }}>{formatDate(h)}</span>}
                          {sc}
                        </div>
                      )}
                      <div style={{
                        width: '100%', height: ht,
                        background: isHov ? barColor(sc) : barColor(sc) + 'cc',
                        borderRadius: '3px 3px 0 0',
                        transition: 'background 100ms',
                        minWidth: 4,
                      }} />
                    </div>
                  )
                })}
              </div>
              {/* Y-axis lines */}
              {[25, 50, 75].map(y => (
                <div key={y} style={{
                  position: 'absolute', left: 0, right: 0,
                  bottom: (y / 100) * 120,
                  borderTop: '1px dashed var(--b)',
                  pointerEvents: 'none',
                }}>
                  <span style={{ position: 'absolute', right: '100%', paddingRight: 6, fontSize: 9, color: 'var(--tx3)', lineHeight: 1, marginTop: -5 }}>{y}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--tx3)' }}>
              <span>30 days ago</span><span>Today</span>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--b)' }}>
              {[['#22C55E', 'Healthy (65+)'], ['#F59E0B', 'Watch (45–64)'], ['#EF4444', 'At Risk (<45)']].map(([col, lbl]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--tx3)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: col }} />
                  {lbl}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
