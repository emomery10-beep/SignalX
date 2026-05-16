'use client'

interface KpiCard {
  label: string
  value: string | number
  sub: string
  trend?: 'up' | 'down' | 'flat' | null
  trendLabel?: string
  accentColor?: string
  onClick?: () => void
}

function TrendArrow({ trend, color }: { trend: 'up' | 'down' | 'flat'; color: string }) {
  if (trend === 'up') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  )
  if (trend === 'down') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
  return <span style={{ fontSize: 10, color }}>—</span>
}

export default function KpiStrip({ cards }: { cards: KpiCard[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
      gap: 10,
      marginBottom: 16,
    }}>
      {cards.map((card, i) => (
        <button
          key={i}
          onClick={card.onClick}
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid var(--b)',
            background: 'var(--sf)',
            textAlign: 'left',
            cursor: card.onClick ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'border-color 150ms, box-shadow 150ms',
            outline: 'none',
          }}
          onMouseEnter={e => { if (card.onClick) { e.currentTarget.style.borderColor = '#6366F115'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {card.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontSize: 22,
              fontWeight: 700,
              color: card.accentColor || 'var(--tx)',
              fontFamily: 'var(--font-sora, inherit)',
              lineHeight: 1,
            }}>
              {card.value}
            </span>
            {card.trend && card.trendLabel && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: card.trend === 'up' ? '#22C55E' : card.trend === 'down' ? '#EF4444' : 'var(--tx3)' }}>
                <TrendArrow trend={card.trend} color={card.trend === 'up' ? '#22C55E' : card.trend === 'down' ? '#EF4444' : 'var(--tx3)'} />
                {card.trendLabel}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>{card.sub}</div>
        </button>
      ))}
    </div>
  )
}
