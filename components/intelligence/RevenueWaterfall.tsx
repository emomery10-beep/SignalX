'use client'
import { useState } from 'react'

interface WaterfallBar {
  label: string
  value: number        // can be negative (deductions)
  type: 'positive' | 'negative' | 'total'
  detail?: string
}

interface RevenueWaterfallProps {
  health: {
    components?: Array<{ name: string; score: number; label: string; detail?: string }>
    summary?: string
  } | null
  onAsk: (prompt: string) => void
}

const COLORS = {
  positive: '#22C55E',
  negative: '#EF4444',
  total:    '#6366F1',
}

export default function RevenueWaterfall({ health, onAsk }: RevenueWaterfallProps) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  const components = health?.components || []

  // Build waterfall bars from health components
  // Each component score 0–20 → map to illustrative financial breakdown
  const profitability = components.find(c => c.name?.toLowerCase().includes('profit'))
  const liquidity     = components.find(c => c.name?.toLowerCase().includes('liquid') || c.name?.toLowerCase().includes('cash'))
  const growth        = components.find(c => c.name?.toLowerCase().includes('growth'))
  const inventory     = components.find(c => c.name?.toLowerCase().includes('inventor'))
  const risk          = components.find(c => c.name?.toLowerCase().includes('risk'))

  const hasData = components.length > 0

  // Build illustrative bars (scores as proxy for relative performance)
  const bars: WaterfallBar[] = hasData ? [
    {
      label: 'Revenue',
      value: 100,
      type: 'positive',
      detail: growth ? `Growth signal: ${growth.label}` : 'Gross revenue baseline',
    },
    {
      label: 'COGS',
      value: profitability ? -(100 - profitability.score * 5) / 2 : -40,
      type: 'negative',
      detail: profitability ? `Margin signal: ${profitability.label}` : 'Cost of goods sold',
    },
    {
      label: 'Gross Profit',
      value: profitability ? profitability.score * 5 : 60,
      type: 'total',
      detail: `${profitability ? (profitability.score * 5).toFixed(0) : '60'}% gross margin`,
    },
    {
      label: 'Operating',
      value: risk ? -(risk.score < 10 ? 25 : 15) : -20,
      type: 'negative',
      detail: risk ? `Risk signal: ${risk.label}` : 'Operating expenses',
    },
    {
      label: 'Stock Cost',
      value: inventory ? -(20 - inventory.score) * 1.2 : -10,
      type: 'negative',
      detail: inventory ? `Inventory signal: ${inventory.label}` : 'Inventory holding cost',
    },
    {
      label: 'Net Margin',
      value: liquidity ? liquidity.score * 3 : 30,
      type: 'total',
      detail: liquidity ? `Cash signal: ${liquidity.label}` : 'Net margin estimate',
    },
  ] : []

  const maxAbs = bars.length > 0 ? Math.max(...bars.map(b => Math.abs(b.value))) : 100

  if (!hasData) {
    return (
      <div style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', fontSize: 13, color: 'var(--tx3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Upload data to see margin breakdown</span>
        <button onClick={() => onAsk('Show me a revenue and margin breakdown for my business')} style={{ fontSize: 12, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Ask AskBiz →</button>
      </div>
    )
  }

  const MiniWaterfall = ({ barH }: { barH: number }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: barH }}>
      {bars.map((bar, i) => {
        const w = Math.max(8, (Math.abs(bar.value) / maxAbs) * barH * 1.2)
        return (
          <div
            key={i}
            style={{
              width: w,
              height: Math.max(4, (Math.abs(bar.value) / maxAbs) * barH),
              background: COLORS[bar.type],
              borderRadius: '3px 3px 0 0',
              opacity: 0.8,
              minWidth: 8,
            }}
          />
        )
      })}
    </div>
  )

  return (
    <>
      {/* Mini card */}
      <div
        onClick={() => setExpanded(true)}
        style={{
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid var(--b)',
          background: 'var(--sf)',
          cursor: 'pointer',
          transition: 'box-shadow 150ms, border-color 150ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = '#6366F130' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--b)' }}
        title="Click to expand"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Revenue & Margin</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['#22C55E', 'Revenue'], ['#EF4444', 'Costs'], ['#6366F1', 'Margin']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--tx3)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
                </div>
              ))}
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </div>
        </div>
        <MiniWaterfall barH={52} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--tx3)' }}>
          <span>Revenue</span><span>Net Margin</span>
        </div>
      </div>

      {/* Expanded modal */}
      {expanded && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setExpanded(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--sf)', borderRadius: 20, padding: '24px 28px', width: '100%', maxWidth: 580, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 700 }}>Revenue & Margin Breakdown</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>Based on your health score signals · hover for detail</div>
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

            {/* Waterfall bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {bars.map((bar, i) => {
                const pct = Math.abs(bar.value) / maxAbs
                const isHov = hovered === i
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div style={{ width: 90, fontSize: 12, fontWeight: bar.type === 'total' ? 700 : 400, color: 'var(--tx2)', textAlign: 'right', flexShrink: 0 }}>
                      {bar.label}
                    </div>
                    <div style={{ flex: 1, height: bar.type === 'total' ? 22 : 16, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct * 100}%`,
                        background: isHov ? COLORS[bar.type] : COLORS[bar.type] + 'cc',
                        borderRadius: 4,
                        transition: 'width 400ms ease, background 100ms',
                      }} />
                    </div>
                    <div style={{ width: 70, fontSize: 12, fontWeight: bar.type === 'total' ? 700 : 400, color: bar.type === 'negative' ? '#EF4444' : bar.type === 'total' ? '#6366F1' : '#22C55E', textAlign: 'right', flexShrink: 0 }}>
                      {bar.value > 0 ? '+' : ''}{bar.value.toFixed(0)}%
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Hovered detail */}
            {hovered !== null && bars[hovered] && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'var(--ev)', fontSize: 12, color: 'var(--tx2)' }}>
                <strong>{bars[hovered].label}:</strong> {bars[hovered].detail}
              </div>
            )}

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--b)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 11, color: 'var(--tx3)', flex: 1 }}>
                Figures are index-relative to your health score signals. Connect accounting data for exact values.
              </div>
              <button
                onClick={() => { setExpanded(false); onAsk('Give me a detailed margin and revenue breakdown with exact figures') }}
                style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Get exact figures →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
