'use client'
import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface SourceData {
  source: string
  label: string
  revenue: number
  cogs: number
  gross_profit: number
  margin_pct: number
  orders: number
  pct_of_total: number
}

interface Props {
  sources: SourceData[]
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

const SOURCE_COLORS: Record<string, string> = {
  shopify: '#96BF48',
  amazon_fba: '#FF9900',
  ebay: '#E53238',
  etsy: '#F1641E',
  pos: '#6366F1',
  stripe: '#635BFF',
  google_sheets: '#34A853',
  manual_csv: '#9CA3AF',
  woocommerce: '#7F54B3',
  square: '#006AFF',
  tiktok_shop: '#000000',
  jumia: '#F68B1E',
  takealot: '#0B79BF',
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

export default function SourceBreakdown({ sources, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!sources.length) return null

  const totalRevenue = sources.reduce((s, d) => s + d.revenue, 0)

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_sourcebreakdown.heading')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_sourcebreakdown.channels', { n: sources.length })}</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(tc('cfo_sourcebreakdown.askAiPrompt', { summary: sources.map(s => `${s.label}: ${fmt(s.revenue, sym)} (${s.margin_pct}% margin)`).join(', ') }))}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_sourcebreakdown.askAi')}
          </button>
        )}
      </div>

      {/* Stacked revenue bar */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
        <div style={{ height: 28, borderRadius: 8, overflow: 'hidden', display: 'flex', background: 'var(--ev, #e5e5e5)' }}>
          {sources.map(s => {
            const color = SOURCE_COLORS[s.source] || '#9CA3AF'
            const pct = totalRevenue > 0 ? (s.revenue / totalRevenue) * 100 : 0
            if (pct < 1) return null
            return (
              <div
                key={s.source}
                onClick={() => setExpanded(expanded === s.source ? null : s.source)}
                style={{
                  width: `${pct}%`, background: color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', transition: 'opacity 150ms',
                }}
                title={`${s.label}: ${fmt(s.revenue, sym)} (${s.pct_of_total}%)`}
              >
                {pct > 10 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{s.label} {s.pct_of_total}%</span>}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8, fontSize: 10, color: 'var(--tx3)' }}>
          {sources.map(s => (
            <span key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: SOURCE_COLORS[s.source] || '#9CA3AF', display: 'inline-block' }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Source rows */}
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {sources.map(s => {
          const color = SOURCE_COLORS[s.source] || '#9CA3AF'
          const isExpanded = expanded === s.source
          return (
            <div key={s.source}>
              <div
                onClick={() => setExpanded(isExpanded ? null : s.source)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '10px 18px',
                  borderTop: '1px solid var(--b)', cursor: 'pointer',
                  background: isExpanded ? 'rgba(99,102,241,.02)' : 'transparent',
                  transition: 'background 120ms',
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0, marginRight: 10 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_sourcebreakdown.transactions', { n: s.orders, pct: s.pct_of_total })}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(s.revenue, sym)}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: s.margin_pct >= 35 ? '#22C55E' : s.margin_pct >= 20 ? '#F59E0B' : '#EF4444' }}>{tc('cfo_sourcebreakdown.marginPct', { n: s.margin_pct })}</div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--tx3)', marginLeft: 8, transition: 'transform 120ms', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>▶</span>
              </div>
              {isExpanded && (
                <div style={{ padding: '8px 18px 12px 38px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
                  <MiniMetric label={tc('cfo_sourcebreakdown.metricRevenue')} value={fmt(s.revenue, sym)} color={color} />
                  <MiniMetric label={tc('cfo_sourcebreakdown.metricCogs')} value={fmt(s.cogs, sym)} color="#F97316" />
                  <MiniMetric label={tc('cfo_sourcebreakdown.metricGrossProfit')} value={fmt(s.gross_profit, sym)} color={s.gross_profit >= 0 ? '#22C55E' : '#EF4444'} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MiniMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}
