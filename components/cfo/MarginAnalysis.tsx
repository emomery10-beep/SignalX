'use client'
import { useState, useMemo } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  comparison: { revenue: number; gross_margin_pct: number }
  marginByProduct?: Array<{ name: string; category: string; revenue: number; cogs: number; margin_pct: number; units: number; contribution: number }>
  marginByChannel?: Array<{ source: string; label: string; revenue: number; cogs: number; gross_profit: number; margin_pct: number; orders: number; pct_of_total: number }>
  pnlMonthly?: Array<{ month: string; gross_margin_pct: number; net_margin_pct: number }>
  currencySymbol: string
  onAsk: (prompt: string) => void
}

type SortKey = 'name' | 'category' | 'revenue' | 'cogs' | 'margin_pct' | 'units' | 'contribution'
type SortDir = 'asc' | 'desc'

const GREEN = '#22C55E'
const ORANGE = '#F97316'
const RED = '#EF4444'
const INDIGO = '#6366F1'
const YELLOW = '#EAB308'

function marginColor(pct: number, thresholds: [number, number] = [35, 20]): string {
  if (pct >= thresholds[0]) return GREEN
  if (pct >= thresholds[1]) return YELLOW
  return RED
}

function netMarginColor(pct: number): string {
  if (pct >= 10) return GREEN
  if (pct >= 0) return YELLOW
  return RED
}

type Tc = (k: string, vars?: Record<string, string | number>) => string

const buildProductColumns = (tc: Tc): [SortKey, string][] => [
  ['name', tc('cfo_margin.col_product')],
  ['category', tc('cfo_margin.col_category')],
  ['revenue', tc('cfo_margin.col_revenue')],
  ['cogs', tc('cfo_margin.col_cogs')],
  ['margin_pct', tc('cfo_margin.col_margin_pct')],
  ['units', tc('cfo_margin.col_units')],
  ['contribution', tc('cfo_margin.col_contribution')],
]

export default function MarginAnalysis({ totals, comparison, marginByProduct, marginByChannel, pnlMonthly, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [productView, setProductView] = useState<'top' | 'bottom'>('top')
  const [sortKey, setSortKey] = useState<SortKey>('margin_pct')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const fmt = (n: number): string => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${sym}${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${sym}${(abs / 1_000).toFixed(1)}K`
    return `${sym}${Math.round(abs).toLocaleString()}`
  }

  const cogsRatio = totals.revenue > 0 ? (totals.cogs / totals.revenue) * 100 : 0
  const fixedRatio = totals.revenue > 0 ? (totals.fixed_costs / totals.revenue) * 100 : 0
  const profitRatio = totals.revenue > 0 ? (totals.net_profit / totals.revenue) * 100 : 0
  const marginDelta = totals.gross_margin_pct - comparison.gross_margin_pct

  // Sorted channels
  const sortedChannels = useMemo(() => {
    if (!marginByChannel?.length) return []
    return [...marginByChannel].sort((a, b) => b.margin_pct - a.margin_pct)
  }, [marginByChannel])

  // Sorted products
  const sortedProducts = useMemo(() => {
    if (!marginByProduct?.length) return []
    const sorted = [...marginByProduct].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      const diff = (aVal as number) - (bVal as number)
      return sortDir === 'asc' ? diff : -diff
    })
    if (productView === 'top') return sorted.slice(0, 10)
    return sorted.reverse().slice(0, 10)
  }, [marginByProduct, sortKey, sortDir, productView])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'category' ? 'asc' : 'desc')
    }
  }

  const sortArrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  const cardStyle: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
  const sectionHeader = (label: string, color: string, extra?: React.ReactNode): React.ReactNode => (
    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{label}</span>
      </div>
      {extra}
    </div>
  )

  const tabNum: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header ── */}
      <div style={{ ...cardStyle }}>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: INDIGO }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_margin.title')}</span>
          </div>
          <button
            onClick={() => onAsk(tc('cfo_margin.ask_ai_prompt', {
              gross: totals.gross_margin_pct.toFixed(1),
              net: totals.net_margin_pct.toFixed(1),
              cogs: cogsRatio.toFixed(1),
              delta: (marginDelta >= 0 ? '+' : '') + marginDelta.toFixed(1),
            }))}
            style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_margin.ask_ai')}
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {/* Gross Margin */}
        <div style={{ ...cardStyle, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 600, marginBottom: 6 }}>{tc('cfo_margin.kpi_gross_margin')}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: marginColor(totals.gross_margin_pct), ...tabNum }}>{totals.gross_margin_pct.toFixed(1)}%</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4, ...tabNum }}>{tc('cfo_margin.kpi_gross_profit_suffix', { value: fmt(totals.gross_profit) })}</div>
        </div>

        {/* Net Margin */}
        <div style={{ ...cardStyle, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 600, marginBottom: 6 }}>{tc('cfo_margin.kpi_net_margin')}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: netMarginColor(totals.net_margin_pct), ...tabNum }}>{totals.net_margin_pct.toFixed(1)}%</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4, ...tabNum }}>{tc('cfo_margin.kpi_net_suffix', { value: fmt(totals.net_profit) })}</div>
        </div>

        {/* COGS Ratio */}
        <div style={{ ...cardStyle, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 600, marginBottom: 6 }}>{tc('cfo_margin.kpi_cogs_ratio')}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: ORANGE, ...tabNum }}>{cogsRatio.toFixed(1)}%</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4, ...tabNum }}>{tc('cfo_margin.kpi_cogs_suffix', { value: fmt(totals.cogs) })}</div>
        </div>

        {/* Margin Change */}
        <div style={{ ...cardStyle, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 600, marginBottom: 6 }}>{tc('cfo_margin.kpi_margin_change')}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: marginDelta >= 0 ? GREEN : RED, ...tabNum }}>
            {marginDelta >= 0 ? '+' : ''}{marginDelta.toFixed(1)}pp
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4 }}>{tc('cfo_margin.kpi_vs_prior')}</div>
        </div>
      </div>

      {/* ── Revenue Breakdown Bar ── */}
      <div style={{ ...cardStyle }}>
        {sectionHeader(tc('cfo_margin.revenue_breakdown'), ORANGE)}
        <div style={{ padding: '14px 18px' }}>
          {(() => {
            const totalCostPct = cogsRatio + fixedRatio + Math.max(profitRatio, 0)
            const scale = totalCostPct > 100 ? 100 / totalCostPct : 1
            const cogsW = cogsRatio * scale
            const fixedW = fixedRatio * scale
            const profitW = Math.max(profitRatio, 0) * scale
            return (
              <>
                <div style={{ height: 32, borderRadius: 8, overflow: 'hidden', display: 'flex', background: 'var(--ev, #e5e5e5)' }}>
                  {cogsRatio > 0 && (
                    <div
                      title={tc('cfo_margin.tooltip_cogs', { pct: cogsRatio.toFixed(1) })}
                      style={{ width: `${cogsW}%`, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      {cogsW > 8 && <span style={{ fontSize: 10, color: '#fff', fontWeight: 600, ...tabNum }}>{tc('cfo_margin.bar_cogs', { pct: cogsRatio.toFixed(0) })}</span>}
                    </div>
                  )}
                  {fixedRatio > 0 && (
                    <div
                      title={tc('cfo_margin.tooltip_fixed', { pct: fixedRatio.toFixed(1) })}
                      style={{ width: `${fixedW}%`, background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      {fixedW > 8 && <span style={{ fontSize: 10, color: '#fff', fontWeight: 600, ...tabNum }}>{tc('cfo_margin.bar_fixed', { pct: fixedRatio.toFixed(0) })}</span>}
                    </div>
                  )}
                  {profitRatio > 0 && (
                    <div
                      title={tc('cfo_margin.tooltip_profit', { pct: profitRatio.toFixed(1) })}
                      style={{ width: `${profitW}%`, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      {profitW > 8 && <span style={{ fontSize: 10, color: '#fff', fontWeight: 600, ...tabNum }}>{tc('cfo_margin.bar_profit', { pct: profitRatio.toFixed(0) })}</span>}
                    </div>
                  )}
                </div>
                {profitRatio < 0 && (
                  <div style={{ fontSize: 10, color: '#EF4444', marginTop: 4, fontWeight: 500 }}>
                    {tc('cfo_margin.loss_warning', { pct: Math.abs(profitRatio).toFixed(1) })}
                  </div>
                )}
              </>
            )
          })()}
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: RED }} />
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_margin.legend_cogs')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: ORANGE }} />
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_margin.legend_fixed_costs')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: GREEN }} />
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_margin.legend_profit')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Margin Trend Chart ── */}
      {pnlMonthly && pnlMonthly.length > 1 && (() => {
        const chartW = 680
        const chartH = 160
        const padL = 40
        const padR = 16
        const padT = 12
        const padB = 28
        const innerW = chartW - padL - padR
        const innerH = chartH - padT - padB
        const n = pnlMonthly.length

        const xStep = n > 1 ? innerW / (n - 1) : 0
        const grossPts = pnlMonthly.map((d, i) => ({ x: padL + i * xStep, y: padT + innerH - (d.gross_margin_pct / 100) * innerH }))
        const netPts = pnlMonthly.map((d, i) => ({ x: padL + i * xStep, y: padT + innerH - (Math.max(d.net_margin_pct, 0) / 100) * innerH }))

        const grossLine = grossPts.map(p => `${p.x},${p.y}`).join(' ')
        const netLine = netPts.map(p => `${p.x},${p.y}`).join(' ')

        return (
          <div style={{ ...cardStyle }}>
            {sectionHeader(tc('cfo_margin.margin_trend'), GREEN)}
            <div style={{ padding: '12px 18px', overflowX: 'auto' }}>
              <svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: 'block', maxWidth: '100%' }}>
                {/* Gridlines */}
                {[20, 40, 60, 80].map(v => {
                  const y = padT + innerH - (v / 100) * innerH
                  return (
                    <g key={v}>
                      <line x1={padL} x2={chartW - padR} y1={y} y2={y} stroke="var(--b)" strokeWidth={1} />
                      <text x={padL - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--tx3)" style={tabNum}>{v}%</text>
                    </g>
                  )
                })}
                {/* 0% baseline */}
                <line x1={padL} x2={chartW - padR} y1={padT + innerH} y2={padT + innerH} stroke="var(--b)" strokeWidth={1} />
                <text x={padL - 6} y={padT + innerH + 3} textAnchor="end" fontSize={9} fill="var(--tx3)">0%</text>

                {/* Gross margin line */}
                <polyline points={grossLine} fill="none" stroke={GREEN} strokeWidth={2} strokeLinejoin="round" />
                {grossPts.map((p, i) => (
                  <circle key={`g${i}`} cx={p.x} cy={p.y} r={3} fill={GREEN} stroke="#fff" strokeWidth={1.5}>
                    <title>{tc('cfo_margin.tooltip_gross', { month: pnlMonthly[i].month, pct: pnlMonthly[i].gross_margin_pct.toFixed(1) })}</title>
                  </circle>
                ))}

                {/* Net margin line */}
                <polyline points={netLine} fill="none" stroke={INDIGO} strokeWidth={2} strokeLinejoin="round" />
                {netPts.map((p, i) => (
                  <circle key={`n${i}`} cx={p.x} cy={p.y} r={3} fill={INDIGO} stroke="#fff" strokeWidth={1.5}>
                    <title>{tc('cfo_margin.tooltip_net', { month: pnlMonthly[i].month, pct: pnlMonthly[i].net_margin_pct.toFixed(1) })}</title>
                  </circle>
                ))}

                {/* X-axis labels */}
                {pnlMonthly.map((d, i) => (
                  <text key={i} x={padL + i * xStep} y={chartH - 4} textAnchor="middle" fontSize={9} fill="var(--tx3)">{d.month}</text>
                ))}
              </svg>
              <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 12, height: 2, borderRadius: 1, background: GREEN }} />
                  <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_margin.legend_gross_margin')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 12, height: 2, borderRadius: 1, background: INDIGO }} />
                  <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_margin.legend_net_margin')}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Margin by Channel ── */}
      {sortedChannels.length > 0 && (
        <div style={{ ...cardStyle }}>
          {sectionHeader(tc('cfo_margin.margin_by_channel'), INDIGO, (
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('cfo_margin.channels_count', { n: sortedChannels.length })}</span>
          ))}
          <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedChannels.map(ch => {
              const color = marginColor(ch.margin_pct)
              const barWidth = Math.max(ch.margin_pct, 0)
              return (
                <div key={ch.source}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{ch.label}</span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <span style={{ fontSize: 11, color: 'var(--tx3)', ...tabNum }}>{fmt(ch.revenue)}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color, ...tabNum }}>{ch.margin_pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--ev, #e5e5e5)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(barWidth, 100)}%`, borderRadius: 4, background: color, transition: 'width .3s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Product Margin Table ── */}
      {marginByProduct && marginByProduct.length > 0 && (
        <div style={{ ...cardStyle }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, borderRadius: 2, background: GREEN }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_margin.product_margins')}</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['top', 'bottom'] as const).map(view => (
                <button
                  key={view}
                  onClick={() => { setProductView(view); setSortKey('margin_pct'); setSortDir(view === 'top' ? 'desc' : 'asc') }}
                  style={{
                    fontSize: 10, fontWeight: 600, fontFamily: 'inherit', border: 'none', borderRadius: 6,
                    padding: '3px 8px', cursor: 'pointer',
                    background: productView === view ? 'rgba(99,102,241,.12)' : 'transparent',
                    color: productView === view ? INDIGO : 'var(--tx3)',
                  }}
                >
                  {view === 'top' ? tc('cfo_margin.view_top') : tc('cfo_margin.view_bottom')}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--b)' }}>
                  {buildProductColumns(tc).map(([key, label]) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      style={{
                        padding: '10px 12px', textAlign: key === 'name' || key === 'category' ? 'left' : 'right',
                        fontSize: 10, fontWeight: 600, color: 'var(--tx3)', cursor: 'pointer',
                        whiteSpace: 'nowrap', userSelect: 'none',
                      }}
                    >
                      {label}{sortArrow(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((p, i) => {
                  const mc = marginColor(p.margin_pct, [40, 20])
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--b)' }}>
                      <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 500, color: 'var(--tx)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                      <td style={{ padding: '8px 12px', fontSize: 11, color: 'var(--tx3)' }}>{p.category}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', ...tabNum, color: 'var(--tx)' }}>{fmt(p.revenue)}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', ...tabNum, color: 'var(--tx3)' }}>{fmt(p.cogs)}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          <div style={{ width: 40, height: 6, borderRadius: 3, background: 'var(--ev, #e5e5e5)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(Math.max(p.margin_pct, 0), 100)}%`, borderRadius: 3, background: mc }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: mc, ...tabNum }}>{p.margin_pct.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', ...tabNum, color: 'var(--tx3)' }}>{p.units.toLocaleString()}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', ...tabNum, color: 'var(--tx)' }}>{fmt(p.contribution)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Margin Waterfall ── */}
      <div style={{ ...cardStyle }}>
        {sectionHeader(tc('cfo_margin.margin_waterfall'), INDIGO)}
        <div style={{ padding: '14px 18px' }}>
          {(() => {
            const wW = 480
            const wH = 180
            const barH = 28
            const gap = 14
            const labelW = 100
            const valueW = 60
            const barAreaW = wW - labelW - valueW - 20

            const steps = [
              { label: tc('cfo_margin.step_revenue'), pct: 100, type: 'total' as const },
              { label: tc('cfo_margin.step_cogs'), pct: -cogsRatio, type: 'subtract' as const },
              { label: tc('cfo_margin.step_gross_margin'), pct: totals.gross_margin_pct, type: 'subtotal' as const },
              { label: tc('cfo_margin.step_fixed_costs'), pct: -fixedRatio, type: 'subtract' as const },
              { label: tc('cfo_margin.step_net_margin'), pct: totals.net_margin_pct, type: 'subtotal' as const },
            ]

            let running = 0

            return (
              <svg width={wW} height={steps.length * (barH + gap)} viewBox={`0 0 ${wW} ${steps.length * (barH + gap)}`} style={{ display: 'block', maxWidth: '100%' }}>
                {steps.map((step, i) => {
                  const y = i * (barH + gap)
                  const barX = labelW

                  let segX: number, segW: number, color: string

                  if (step.type === 'total') {
                    segX = barX
                    segW = (100 / 100) * barAreaW
                    color = INDIGO
                    running = 100
                  } else if (step.type === 'subtract') {
                    const absPct = Math.abs(step.pct)
                    segW = (absPct / 100) * barAreaW
                    running = running - absPct
                    segX = barX + (running / 100) * barAreaW
                    color = RED
                  } else {
                    segX = barX
                    segW = (Math.max(step.pct, 0) / 100) * barAreaW
                    running = step.pct
                    color = step.pct >= 0 ? GREEN : RED
                  }

                  return (
                    <g key={i}>
                      {/* Label */}
                      <text x={0} y={y + barH / 2 + 4} fontSize={11} fontWeight={step.type !== 'subtract' ? 600 : 400} fill="var(--tx)">{step.label}</text>
                      {/* Bar background */}
                      <rect x={barX} y={y} width={barAreaW} height={barH} rx={6} fill="var(--ev, #e5e5e5)" opacity={0.3} />
                      {/* Bar segment */}
                      <rect x={segX} y={y} width={Math.max(segW, 1)} height={barH} rx={6} fill={color} opacity={0.85} />
                      {/* Value */}
                      <text x={wW} y={y + barH / 2 + 4} textAnchor="end" fontSize={11} fontWeight={600} fill={color} style={tabNum}>
                        {step.type === 'subtract' ? `-${Math.abs(step.pct).toFixed(1)}%` : `${step.pct.toFixed(1)}%`}
                      </text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
