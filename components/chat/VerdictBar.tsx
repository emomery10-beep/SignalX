'use client'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  verdict: 'act' | 'watch' | 'problem' | null | undefined
  sentence: string | null | undefined
  marketPosition?: 'cheapest' | 'competitive' | 'premium' | 'overpriced' | null
  onAction?: () => void
}

function buildConfig(tc: (k: string) => string) {
  return {
    act:     { bg: 'rgba(34,197,94,.08)',  border: 'rgba(34,197,94,.25)',  dot: '#22C55E', label: tc('chat_verdictbar.actLabel'),     labelColor: '#16a34a', glow: 'rgba(34,197,94,.15)'  },
    watch:   { bg: 'rgba(245,158,11,.07)', border: 'rgba(245,158,11,.25)', dot: '#F59E0B', label: tc('chat_verdictbar.watchLabel'),   labelColor: '#d97706', glow: 'rgba(245,158,11,.12)' },
    problem: { bg: 'rgba(239,68,68,.07)',  border: 'rgba(239,68,68,.25)',  dot: '#EF4444', label: tc('chat_verdictbar.problemLabel'), labelColor: '#dc2626', glow: 'rgba(239,68,68,.15)'  },
  }
}

function buildMarketBadge(tc: (k: string) => string): Record<string, { label: string; color: string; bg: string }> {
  return {
    cheapest:    { label: tc('chat_verdictbar.marketCheapest'),    color: '#16a34a', bg: 'rgba(34,197,94,.1)'   },
    competitive: { label: tc('chat_verdictbar.marketCompetitive'), color: '#0284c7', bg: 'rgba(2,132,199,.1)'   },
    premium:     { label: tc('chat_verdictbar.marketPremium'),     color: '#7c3aed', bg: 'rgba(124,58,237,.1)'  },
    overpriced:  { label: tc('chat_verdictbar.marketOverpriced'),  color: '#dc2626', bg: 'rgba(239,68,68,.1)'   },
  }
}

export default function VerdictBar({ verdict, sentence, marketPosition }: Props) {
  const { tc } = useLang()
  if (!verdict || !sentence) return null

  const CONFIG = buildConfig(tc)
  const MARKET_BADGE = buildMarketBadge(tc)

  const c = CONFIG[verdict]
  const market = marketPosition ? MARKET_BADGE[marketPosition] : null

  return (
    <>
      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
      <div className="verdict-bar" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 12,
        background: c.bg, border: `1px solid ${c.border}`,
        marginBottom: 14, boxShadow: `0 2px 12px ${c.glow}`,
      }}>
        {/* Pulsing dot */}
        <div style={{ position: 'relative', flexShrink: 0, width: 10, height: 10 }}>
          <span style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '50%', background: c.dot,
            animation: verdict === 'act' ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}/>
          {verdict === 'act' && (
            <span style={{
              position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
              borderRadius: '50%', background: c.dot, opacity: 0.3,
              animation: 'ping 1.5s ease-in-out infinite',
            }}/>
          )}
        </div>

        {/* Label */}
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: c.labelColor, flexShrink: 0, fontFamily: 'var(--font-sora)' }}>
          {c.label}
        </span>

        {/* Divider */}
        <div style={{ width: 1, height: 14, background: c.border, flexShrink: 0 }}></div>

        {/* Sentence */}
        <span style={{ fontSize: 11, color: 'var(--tx)', lineHeight: 1.4, flex: 1, fontWeight: 500 }}>
          {sentence}
        </span>

        {/* Market position badge */}
        {market && (
          <span style={{
            fontSize: 9, fontWeight: 600, color: market.color,
            background: market.bg, padding: '3px 8px',
            borderRadius: 9999, flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            {market.label}
          </span>
        )}
      </div>
    </>
  )
}
