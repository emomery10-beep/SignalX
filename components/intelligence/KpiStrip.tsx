'use client'
import { useEffect, useRef, useState } from 'react'

interface KpiCard {
  label: string
  value: string | number
  sub: string
  trend?: 'up' | 'down' | 'flat' | null
  trendLabel?: string
  accentColor?: string
  onClick?: () => void
  sparkline?: number[]
}

/* ── Animated count-up hook ── */
function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    if (isNaN(target)) return
    const start = prev.current
    const diff = target - start
    const t0 = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      const v = Math.round(start + diff * ease)
      setVal(v)
      if (p < 1) requestAnimationFrame(step)
      else prev.current = target
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

/* ── Inline sparkline SVG ── */
function Sparkline({ data, color, height = 28, width = 64 }: { data: number[]; color: string; height?: number; width?: number }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padY = 2
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - padY - ((v - min) / range) * (height - padY * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const linePath = `M${points.join(' L')}`
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color.replace('#','')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="2.5" fill={color} />
    </svg>
  )
}

function TrendBadge({ trend, label }: { trend: 'up' | 'down' | 'flat'; label?: string }) {
  const color = trend === 'up' ? '#22C55E' : trend === 'down' ? '#EF4444' : 'var(--tx3)'
  const bg = trend === 'up' ? 'rgba(34,197,94,.1)' : trend === 'down' ? 'rgba(239,68,68,.1)' : 'rgba(0,0,0,.04)'
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 11, fontWeight: 600, color,
      background: bg, borderRadius: 6, padding: '2px 7px',
    }}>
      {arrow} {label}
    </span>
  )
}

function statusIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('health')) return '❤️'
  if (l.includes('alert')) return '🛡️'
  if (l.includes('trend')) return '📈'
  if (l.includes('data') || l.includes('source')) return '🔌'
  return null
}

function cardGradient(label: string, trend?: 'up' | 'down' | 'flat' | null) {
  const l = label.toLowerCase()
  if (l.includes('health')) return {
    bg: 'linear-gradient(135deg, rgba(34,197,94,.06) 0%, rgba(34,197,94,.02) 100%)',
    border: 'rgba(34,197,94,.18)',
  }
  if (l.includes('alert')) return {
    bg: 'linear-gradient(135deg, rgba(99,102,241,.05) 0%, rgba(139,92,246,.02) 100%)',
    border: 'rgba(99,102,241,.18)',
  }
  if (l.includes('trend')) {
    if (trend === 'down') return {
      bg: 'linear-gradient(135deg, rgba(239,68,68,.05) 0%, rgba(239,68,68,.02) 100%)',
      border: 'rgba(239,68,68,.15)',
    }
    return {
      bg: 'linear-gradient(135deg, rgba(34,197,94,.05) 0%, rgba(34,197,94,.02) 100%)',
      border: 'rgba(34,197,94,.15)',
    }
  }
  if (l.includes('data') || l.includes('source')) return {
    bg: 'linear-gradient(135deg, rgba(245,158,11,.05) 0%, rgba(245,158,11,.02) 100%)',
    border: 'rgba(245,158,11,.15)',
  }
  return { bg: 'var(--sf)', border: 'var(--b)' }
}

export default function KpiStrip({ cards }: { cards: KpiCard[] }) {
  const hero = cards[0]
  const secondary = cards.slice(1)
  const heroNum = typeof hero?.value === 'number' ? hero.value : null
  const animated = useCountUp(heroNum ?? 0, 1000)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* ── Hero card (primary metric) ── */}
      {hero && (() => {
        const g = cardGradient(hero.label, hero.trend)
        return (
          <button
            onClick={hero.onClick}
            style={{
              padding: '20px 22px',
              borderRadius: 16,
              border: `1px solid ${g.border}`,
              background: g.bg,
              textAlign: 'left',
              cursor: hero.onClick ? 'pointer' : 'default',
              fontFamily: 'inherit',
              transition: 'box-shadow 200ms, transform 200ms',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
          >
            {/* Score ring */}
            <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="5" />
                <circle
                  cx="36" cy="36" r="30"
                  fill="none"
                  stroke={hero.accentColor || '#22C55E'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(heroNum ?? 0) / 100 * 188.5} 188.5`}
                  transform="rotate(-90 36 36)"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 800, color: hero.accentColor || 'var(--tx)',
                fontFamily: 'var(--font-sora, inherit)',
              }}>
                {heroNum != null ? animated : hero.value}
              </div>
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}>
                  {hero.label}
                </span>
                {hero.trend && hero.trendLabel && (
                  <TrendBadge trend={hero.trend} label={hero.trendLabel} />
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4 }}>
                {hero.sub}
              </div>
            </div>

            {/* Sparkline for hero */}
            {hero.sparkline && hero.sparkline.length > 1 && (
              <Sparkline data={hero.sparkline} color={hero.accentColor || '#22C55E'} height={40} width={100} />
            )}
          </button>
        )
      })()}

      {/* ── Secondary metrics row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${secondary.length}, 1fr)`, gap: 10 }}>
        {secondary.map((card, i) => {
          const g = cardGradient(card.label, card.trend)
          const icon = statusIcon(card.label)
          const numVal = typeof card.value === 'number' ? card.value : null
          return (
            <button
              key={i}
              onClick={card.onClick}
              style={{
                padding: '16px 16px 14px',
                borderRadius: 14,
                border: `1px solid ${g.border}`,
                background: g.bg,
                textAlign: 'left',
                cursor: card.onClick ? 'pointer' : 'default',
                fontFamily: 'inherit',
                transition: 'box-shadow 200ms, transform 200ms',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}>
                  {card.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: card.accentColor || 'var(--tx)',
                    fontFamily: 'var(--font-sora, inherit)',
                    lineHeight: 1,
                  }}>
                    {card.value}
                  </span>
                  {card.trend && card.trendLabel && (
                    <TrendBadge trend={card.trend} label={card.trendLabel} />
                  )}
                </div>
                {card.sparkline && card.sparkline.length > 1 && (
                  <Sparkline data={card.sparkline} color={card.accentColor || '#6366F1'} height={24} width={56} />
                )}
              </div>

              <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.3 }}>{card.sub}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
