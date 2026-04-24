'use client'
import { useEffect, useState } from 'react'

interface HealthComponent {
  name: string
  score: number
  label: string
  status: 'good' | 'warning' | 'critical'
  detail: string
}

interface HealthData {
  score: number
  label: string
  color: 'green' | 'amber' | 'red'
  components: HealthComponent[]
  summary: string
  topIssue: string | null
}

interface Props {
  health: HealthData | null
  size?: 'sm' | 'md' | 'lg'
  showComponents?: boolean
  onAsk?: (prompt: string) => void
}

const COLOR = {
  green: { bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.2)', text: '#16a34a', glow: 'rgba(34,197,94,.15)' },
  amber: { bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.2)', text: '#d97706', glow: 'rgba(245,158,11,.12)' },
  red:   { bg: 'rgba(239,68,68,.08)',  border: 'rgba(239,68,68,.2)',  text: '#dc2626', glow: 'rgba(239,68,68,.15)' },
}

const STATUS_DOT = { good: '#22C55E', warning: '#F59E0B', critical: '#EF4444' }

function ScoreDial({ score, color, size }: { score: number; color: 'green' | 'amber' | 'red'; size: 'sm' | 'md' | 'lg' }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const duration = 1200
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const dim = size === 'sm' ? 64 : size === 'md' ? 90 : 120
  const strokeW = size === 'sm' ? 5 : size === 'md' ? 7 : 9
  const r = (dim / 2) - strokeW - 2
  const circ = 2 * Math.PI * r
  const offset = circ - (displayed / 100) * circ
  const c = COLOR[color]
  const fontSize = size === 'sm' ? 16 : size === 'md' ? 22 : 30

  return (
    <div style={{ position: 'relative', width: dim, height: dim, flexShrink: 0 }}>
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke="var(--ev)" strokeWidth={strokeW}/>
        <circle cx={dim/2} cy={dim/2} r={r} fill="none"
          stroke={c.text} strokeWidth={strokeW}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear', filter: `drop-shadow(0 0 6px ${c.glow})` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize, fontWeight: 800, color: c.text, letterSpacing: '-.03em', lineHeight: 1 }}>{displayed}</span>
        {size !== 'sm' && <span style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 500, marginTop: 2 }}>/100</span>}
      </div>
    </div>
  )
}

export default function BusinessHealthScore({ health, size = 'md', showComponents = false, onAsk }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (!health) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--ev)' }}>
        <div style={{ width: size === 'sm' ? 64 : 90, height: size === 'sm' ? 64 : 90, borderRadius: '50%', background: 'var(--ov)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>No<br/>Data</span>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>Business Health Score</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Upload your data to calculate your score</div>
        </div>
      </div>
    )
  }

  const c = COLOR[health.color]

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${c.border}`, background: c.bg, overflow: 'hidden' }}>
      {/* Main score row */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: size === 'sm' ? '10px 14px' : '14px 18px', cursor: showComponents ? 'pointer' : 'default' }}
        onClick={() => showComponents && setExpanded(e => !e)}
      >
        <ScoreDial score={health.score} color={health.color} size={size}/>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-sora)', fontSize: size === 'sm' ? 13 : 15, fontWeight: 700, color: c.text }}>
              {health.label}
            </span>
            <span style={{ fontSize: 11, color: 'var(--tx3)' }}>Business Health Score</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--tx2)', margin: 0, lineHeight: 1.5 }}>{health.summary}</p>

          {health.topIssue && (
            <button
              onClick={(e) => { e.stopPropagation(); onAsk?.(health.topIssue || '') }}
              style={{ marginTop: 8, fontSize: 11, color: c.text, background: 'transparent', border: `1px solid ${c.border}`, borderRadius: 9999, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Ask AskBiz about this →
            </button>
          )}
        </div>

        {showComponents && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        )}
      </div>

      {/* Components breakdown */}
      {showComponents && expanded && (
        <div style={{ borderTop: `1px solid ${c.border}`, padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {health.components.map((comp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_DOT[comp.status], flexShrink: 0 }}></span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', minWidth: 110 }}>{comp.name}</span>
              <div style={{ flex: 1, height: 4, background: 'var(--ov)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(comp.score / 20) * 100}%`, background: STATUS_DOT[comp.status], borderRadius: 2, transition: 'width 0.8s var(--ease)' }}></div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--tx3)', minWidth: 70, textAlign: 'right' }}>{comp.label}</span>
            </div>
          ))}
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--tx3)', textAlign: 'right' }}>
            {health.components.reduce((s, c) => s + c.score, 0)}/100
          </div>
        </div>
      )}
    </div>
  )
}
