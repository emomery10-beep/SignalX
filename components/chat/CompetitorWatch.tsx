'use client'
import { useLang } from '@/components/LanguageProvider'

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

function buildMarketLabels(tc: (k: string) => string) {
  return {
    cheapest:    { label: tc('chat_competitorwatch.marketCheapestLabel'),    sub: tc('chat_competitorwatch.marketCheapestSub'),    color: '#16a34a' },
    competitive: { label: tc('chat_competitorwatch.marketCompetitiveLabel'), sub: tc('chat_competitorwatch.marketCompetitiveSub'), color: '#0284c7' },
    premium:     { label: tc('chat_competitorwatch.marketPremiumLabel'),     sub: tc('chat_competitorwatch.marketPremiumSub'),     color: '#7c3aed' },
    overpriced:  { label: tc('chat_competitorwatch.overpricedLabel'),        sub: tc('chat_competitorwatch.overpricedSub'),        color: '#dc2626' },
  }
}

export default function CompetitorWatch({ data, marketPosition }: Props) {
  const { tc } = useLang()
  if (!data?.length) return null

  const marketLabels = buildMarketLabels(tc)
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
          {tc('chat_competitorwatch.headerLabel')}
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
