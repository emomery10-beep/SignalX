'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

export default function LogisticsPulseCard() {
  const router = useRouter()
  const { tc } = useLang()
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/logistics?view=health')
      .then(r => r.json())
      .then(d => { if (d?.health) setHealth(d.health) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ height: 96, borderRadius: 'var(--r-md)', background: 'var(--ev)', marginTop: 10, animation: 'shimmer 1.4s infinite' }} />
  if (!health || typeof health.score !== 'number') return null

  const isGreen  = health.color === 'green'
  const isRed    = health.color === 'red'
  const isGrey   = health.color === 'grey'
  const color    = isGrey ? 'var(--tx3)' : isGreen ? '#16a34a' : isRed ? '#dc2626' : '#d97706'
  const bg       = isGrey ? 'var(--ev)' : isGreen ? 'rgba(34,197,94,.06)' : isRed ? 'rgba(239,68,68,.06)' : 'rgba(245,158,11,.06)'
  const border   = isGrey ? 'var(--b)' : isGreen ? 'rgba(34,197,94,.18)' : isRed ? 'rgba(239,68,68,.18)' : 'rgba(245,158,11,.18)'
  const score    = Math.min(100, Math.max(0, health.score))

  return (
    <div
      onClick={() => router.push('/shipments')}
      style={{
        padding: '14px 16px', borderRadius: 'var(--r-md)',
        border: `1px solid ${border}`, background: bg,
        cursor: 'pointer', marginTop: 10,
        transition: 'border-color 150ms',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-dm), sans-serif' }}>
            {tc('logistics_pulsecard.title')}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 8px',
            borderRadius: 'var(--r-pill, 9999px)',
            background: bg, border: `1px solid ${border}`, color,
            fontFamily: 'var(--font-dm), sans-serif',
          }}>
            {health.label || ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'var(--font-sora), system-ui', lineHeight: 1 }}>{isGrey ? '—' : score}</span>
          <span style={{ fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--font-dm), sans-serif' }}>{tc('logistics_pulsecard.outOf100')}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 2 }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      {/* Health bar — fixed-width track, transform-scaled fill (compositor-only, no layout thrash) */}
      <div style={{ height: 4, borderRadius: 'var(--r-pill, 9999px)', background: 'var(--b)', marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '100%', background: color, borderRadius: 'var(--r-pill, 9999px)', transform: `scaleX(${score / 100})`, transformOrigin: 'left', transition: 'transform 800ms var(--ease)' }} />
      </div>

      {/* Summary + stats */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--tx3)', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-dm), sans-serif', flex: 1 }}>
          {health.summary || ''}
        </p>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {health.active_shipments > 0 && (
            <span style={{ fontSize: 11, color: 'var(--tx2)', fontFamily: 'var(--font-dm), sans-serif', whiteSpace: 'nowrap' }}>
              <strong style={{ color: 'var(--tx)' }}>{health.active_shipments}</strong> {tc('logistics_pulsecard.active')}
            </span>
          )}
          {health.at_risk > 0 && (
            <span style={{ fontSize: 11, color: '#d97706', fontFamily: 'var(--font-dm), sans-serif', whiteSpace: 'nowrap' }}>
              <strong>{health.at_risk}</strong> {tc('logistics_pulsecard.atRisk')}
            </span>
          )}
          {health.customs_holds > 0 && (
            <span style={{ fontSize: 11, color: '#dc2626', fontFamily: 'var(--font-dm), sans-serif', whiteSpace: 'nowrap' }}>
              <strong>{health.customs_holds}</strong> {tc('logistics_pulsecard.customsHold')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
