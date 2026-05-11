'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogisticsPulseCard() {
  const router = useRouter()
  const [health, setHealth] = useState<any>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetch('/api/logistics?view=health')
      .then(r => r.json())
      .then(d => { if (d && d.health) setHealth(d.health) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!health || typeof health.score !== 'number') return
    const target = health.score
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / 1000, 1)
      setScore(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [health])

  if (!health || typeof health.score !== 'number') return null

  const color = health.color === 'green' ? '#16a34a' : health.color === 'red' ? '#dc2626' : '#d97706'
  const bg = health.color === 'green' ? 'rgba(34,197,94,.08)' : health.color === 'red' ? 'rgba(239,68,68,.08)' : 'rgba(245,158,11,.08)'
  const border = health.color === 'green' ? 'rgba(34,197,94,.2)' : health.color === 'red' ? 'rgba(239,68,68,.2)' : 'rgba(245,158,11,.2)'
  const circ = 2 * Math.PI * 36
  const dashOffset = circ - (score / 100) * circ

  return (
    <div onClick={() => router.push('/shipments')}
      style={{ padding: 16, borderRadius: 14, border: `1px solid ${border}`, background: bg, cursor: 'pointer', marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="38" cy="38" r="36" fill="none" stroke="var(--b)" strokeWidth="6"/>
            <circle cx="38" cy="38" r="36" fill="none" stroke={color} strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-sora)', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 8, color: 'var(--tx3)' }}>/100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>📦 Logistics</span>
            <span style={{ fontSize: 10, fontWeight: 600, color, background: bg, border: `1px solid ${border}`, padding: '1px 6px', borderRadius: 9999 }}>{health.label || ''}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--tx3)', margin: '0 0 8px', lineHeight: 1.5 }}>{health.summary || ''}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {health.active_shipments > 0 && <span style={{ fontSize: 11, color: 'var(--tx2)' }}><strong>{health.active_shipments}</strong> active</span>}
            {health.at_risk > 0 && <span style={{ fontSize: 11, color: '#d97706' }}><strong>{health.at_risk}</strong> at risk</span>}
            {health.customs_holds > 0 && <span style={{ fontSize: 11, color: '#dc2626' }}><strong>{health.customs_holds}</strong> customs hold</span>}
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  )
}
