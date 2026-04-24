'use client'

interface CompetitorItem {
  source: string
  price: string
  delta: string
  position: 'cheaper' | 'parity' | 'expensive'
}

interface Props {
  data: CompetitorItem[]
  marketPosition: 'cheapest' | 'competitive' | 'premium' | 'overpriced' | null | undefined
}

const positionStyle = {
  cheaper:   { color: '#16a34a', bg: 'rgba(34,197,94,.08)', icon: '↓' },
  parity:    { color: '#0284c7', bg: 'rgba(2,132,199,.08)', icon: '≈' },
  expensive: { color: '#dc2626', bg: 'rgba(239,68,68,.08)', icon: '↑' },
}

const marketLabels = {
  cheapest:    { label: 'You are the cheapest', sub: 'Room to raise prices — test a 5-10% increase.', color: '#16a34a' },
  competitive: { label: 'You are competitively priced', sub: 'Good position. Monitor for changes.', color: '#0284c7' },
  premium:     { label: 'You are premium priced', sub: 'Ensure your brand justifies the premium.', color: '#7c3aed' },
  overpriced:  { label: 'You are above market price', sub: 'Risk of losing customers. Consider a price adjustment.', color: '#dc2626' },
}

export default function CompetitorWatch({ data, marketPosition }: Props) {
  if (!data?.length) return null

  const summary = marketPosition ? marketLabels[marketPosition] : null

  return (
    <div style={{
      borderRadius: 14,
      border: '1px solid var(--b)',
      overflow: 'hidden',
      marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        background: 'var(--ev)',
        borderBottom: '1px solid var(--b)',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Competitor Watch
        </span>
        {summary && (
          <span style={{
            marginLeft: 'auto', fontSize: 11, fontWeight: 600,
            color: summary.color,
          }}>
            {summary.label}
          </span>
        )}
      </div>

      {/* Competitor rows */}
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((item, i) => {
          const ps = positionStyle[item.position] || positionStyle.parity
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 9,
              background: 'var(--ev)',
              border: '1px solid var(--b)',
            }}>
              {/* Source badge */}
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: 'var(--tx2)',
                minWidth: 60,
              }}>
                {item.source}
              </span>

              {/* Price */}
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', flex: 1 }}>
                {item.price}
              </span>

              {/* Delta badge */}
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: ps.color,
                background: ps.bg,
                padding: '3px 9px',
                borderRadius: 9999,
              }}>
                {ps.icon} {item.delta}
              </span>
            </div>
          )
        })}
      </div>

      {/* Summary nudge */}
      {summary && (
        <div style={{
          padding: '8px 14px 12px',
          fontSize: 12,
          color: 'var(--tx3)',
          lineHeight: 1.5,
        }}>
          {summary.sub}
        </div>
      )}
    </div>
  )
}
