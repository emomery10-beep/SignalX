'use client'

import { useLang } from '@/components/LanguageProvider'

interface Props {
  revenue: number
  cogs: number
  fixedCosts: number
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

interface CostItem {
  label: string
  amount: number
  color: string
  pctOfRevenue: number
  pctOfTotal: number
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

const buildItems = (
  tc: (k: string, v?: Record<string, string | number>) => string,
  revenue: number,
  cogs: number,
  fixedCosts: number,
  totalCosts: number
): CostItem[] => [
  {
    label: tc('cfo_costbreakdown.labelCogs'),
    amount: cogs,
    color: '#F97316',
    pctOfRevenue: revenue > 0 ? (cogs / revenue) * 100 : 0,
    pctOfTotal: (cogs / totalCosts) * 100,
  },
  {
    label: tc('cfo_costbreakdown.labelFixed'),
    amount: fixedCosts,
    color: '#EF4444',
    pctOfRevenue: revenue > 0 ? (fixedCosts / revenue) * 100 : 0,
    pctOfTotal: (fixedCosts / totalCosts) * 100,
  },
]

export default function CostBreakdown({ revenue, cogs, fixedCosts, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const totalCosts = cogs + fixedCosts
  if (totalCosts === 0) return null

  const netProfit = revenue - totalCosts
  const items: CostItem[] = buildItems(tc, revenue, cogs, fixedCosts, totalCosts)

  // Donut chart calculations
  const donutSize = 140
  const r = 50
  const cx = donutSize / 2
  const cy = donutSize / 2
  const strokeW = 24

  let cumAngle = -90
  const arcs = items.map(item => {
    const angle = (item.pctOfTotal / 100) * 360
    const startAngle = cumAngle
    cumAngle += angle
    const endAngle = cumAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)

    const large = angle > 180 ? 1 : 0

    return {
      ...item,
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
    }
  })

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('cfo_costbreakdown.heading')}</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(tc('cfo_costbreakdown.askAiPrompt', { cogsPct: Math.round((cogs / revenue) * 100), cogsAmt: fmt(cogs, sym), fixedPct: Math.round((fixedCosts / revenue) * 100), fixedAmt: fmt(fixedCosts, sym) }))}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_costbreakdown.askAi')}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Donut chart */}
        <div style={{ position: 'relative', width: donutSize, height: donutSize, flexShrink: 0 }}>
          <svg width={donutSize} height={donutSize}>
            {arcs.map((arc, i) => (
              <path
                key={i}
                d={arc.d}
                fill="none"
                stroke={arc.color}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>{fmt(totalCosts, sym)}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_costbreakdown.totalCosts')}</div>
          </div>
        </div>

        {/* Breakdown table */}
        <div style={{ flex: 1 }}>
          {items.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{fmt(item.amount, sym)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{Math.round(item.pctOfRevenue)}%</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_costbreakdown.ofRevenue')}</div>
              </div>
            </div>
          ))}

          {/* Net profit row */}
          <div style={{ borderTop: '1px solid var(--b)', paddingTop: 8, marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: netProfit >= 0 ? '#22C55E' : '#EF4444', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_costbreakdown.netProfit')}</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{fmt(netProfit, sym)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: netProfit >= 0 ? '#22C55E' : '#EF4444' }}>
                {revenue > 0 ? `${Math.round((netProfit / revenue) * 100)}%` : '—'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_costbreakdown.ofRevenue')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue breakdown bar */}
      {revenue > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('cfo_costbreakdown.whereEveryGoes', { sym })}</div>
          <div style={{ height: 24, borderRadius: 6, overflow: 'hidden', display: 'flex', background: 'var(--ev, #e5e5e5)' }}>
            {(() => {
              const totalPct = items.reduce((s, i) => s + i.pctOfRevenue, 0)
              const scale = totalPct > 100 ? 100 / totalPct : 1
              return (
                <>
                  {items.map(item => {
                    const w = item.pctOfRevenue * scale
                    return (
                      <div key={item.label} style={{ width: `${w}%`, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms ease', flexShrink: 0 }}>
                        {w > 8 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{sym}{Math.round(item.pctOfRevenue)}</span>}
                      </div>
                    )
                  })}
                  {netProfit > 0 && (
                    <div style={{ flex: 1, background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{sym}{Math.round((netProfit / revenue) * 100)}{tc('cfo_costbreakdown.profitSuffix')}</span>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
          {netProfit < 0 && (
            <div style={{ fontSize: 10, color: '#EF4444', marginTop: 4, fontWeight: 500 }}>
              {tc('cfo_costbreakdown.costsExceed', { sym, n: Math.round(Math.abs(netProfit / revenue) * 100) })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
