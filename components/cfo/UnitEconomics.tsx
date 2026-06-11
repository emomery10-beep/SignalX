'use client'

import { useState } from 'react'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  marginByProduct?: Array<{ name: string; category: string; revenue: number; cogs: number; margin_pct: number; units: number; contribution: number }>
  currencySymbol: string
  onAsk: (prompt: string) => void
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', INDIGO = '#6366F1', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${abs.toFixed(abs < 10 ? 2 : 0)}${n < 0 ? ')' : ''}`
}

export default function UnitEconomics({ totals, marginByProduct, currencySymbol: sym, onAsk }: Props) {
  const [cacInput, setCacInput] = useState<number | null>(null)
  const [ltvMonths, setLtvMonths] = useState(12)
  const [sortBy, setSortBy] = useState<'contribution' | 'margin' | 'revenue'>('contribution')

  const products = marginByProduct || []
  const hasProducts = products.length > 0

  // Aggregate unit economics
  const totalUnits = products.reduce((s, p) => s + p.units, 0)
  const avgRevenuePerUnit = totalUnits > 0 ? totals.revenue / totalUnits : 0
  const avgCogsPerUnit = totalUnits > 0 ? totals.cogs / totalUnits : 0
  const avgContributionPerUnit = avgRevenuePerUnit - avgCogsPerUnit
  const avgFixedPerUnit = totalUnits > 0 ? totals.fixed_costs / totalUnits : 0
  const avgProfitPerUnit = avgContributionPerUnit - avgFixedPerUnit

  // CAC & LTV
  const marketingSpend = totals.fixed_costs * 0.25 // estimate: 25% of fixed costs is marketing
  const cac = cacInput || (totalUnits > 0 ? marketingSpend / totalUnits : 0)
  const monthlyGrossProfit = totalUnits > 0 ? totals.gross_profit / totalUnits : 0
  const ltv = monthlyGrossProfit * ltvMonths
  const ltvCacRatio = cac > 0 ? ltv / cac : 0
  const paybackMonths = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : 0

  const ltvColor = ltvCacRatio >= 3 ? GREEN : ltvCacRatio >= 1.5 ? AMBER : RED
  const ltvLabel = ltvCacRatio >= 3 ? 'Healthy' : ltvCacRatio >= 1.5 ? 'Borderline' : 'Unprofitable'

  // Product-level contribution sorted
  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'contribution') return b.contribution - a.contribution
    if (sortBy === 'margin') return b.margin_pct - a.margin_pct
    return b.revenue - a.revenue
  })

  // Identify hero / zero products
  const heroes = sorted.filter(p => p.margin_pct >= 50 && p.contribution > 0).slice(0, 3)
  const zeros = sorted.filter(p => p.margin_pct < 10 || p.contribution < 0).slice(0, 3)

  // Contribution waterfall categories
  const categories = new Map<string, { revenue: number; cogs: number; contribution: number; count: number }>()
  products.forEach(p => {
    const cat = p.category || 'Uncategorized'
    const existing = categories.get(cat) || { revenue: 0, cogs: 0, contribution: 0, count: 0 }
    existing.revenue += p.revenue
    existing.cogs += p.cogs
    existing.contribution += p.contribution
    existing.count++
    categories.set(cat, existing)
  })
  const catArr = [...categories.entries()].sort((a, b) => b[1].contribution - a[1].contribution)

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: INDIGO }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>Unit Economics</span>
          {ltvCacRatio > 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
              background: `${ltvColor}15`, color: ltvColor }}>
              LTV:CAC {ltvCacRatio.toFixed(1)}x · {ltvLabel}
            </span>
          )}
        </div>
        <button onClick={() => onAsk(`My unit economics: Avg revenue/unit ${fmt(avgRevenuePerUnit, sym)}, COGS/unit ${fmt(avgCogsPerUnit, sym)}, contribution/unit ${fmt(avgContributionPerUnit, sym)}, profit/unit ${fmt(avgProfitPerUnit, sym)}. LTV:CAC ratio ${ltvCacRatio.toFixed(1)}x, payback ${paybackMonths.toFixed(1)} months. ${heroes.length > 0 ? `Top products: ${heroes.map(h => h.name).join(', ')}.` : ''} ${zeros.length > 0 ? `Low-margin: ${zeros.map(z => z.name).join(', ')}.` : ''} How should I optimize my product mix for higher per-unit profitability?`)}
          style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          Ask AI
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Per-unit breakdown */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Per-Unit Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--b)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
          {([
            ['Revenue', avgRevenuePerUnit, 'var(--tx)'],
            ['COGS', avgCogsPerUnit, RED],
            ['Contribution', avgContributionPerUnit, avgContributionPerUnit > 0 ? GREEN : RED],
            ['Net Profit', avgProfitPerUnit, avgProfitPerUnit > 0 ? GREEN : RED],
          ] as const).map(([label, value, color]) => (
            <div key={label} style={{ padding: '10px 6px', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{fmt(value, sym)}</div>
            </div>
          ))}
        </div>

        {/* LTV / CAC */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Customer Value</div>
        <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>CAC {sym}</span>
              <input type="number" value={cacInput || ''} placeholder={cac.toFixed(0)}
                onChange={e => setCacInput(Number(e.target.value) || null)}
                style={{ width: 65, padding: '3px 6px', borderRadius: 5, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', background: 'var(--sf)', color: 'var(--tx)', outline: 'none', textAlign: 'right' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>LTV months</span>
              <select value={ltvMonths} onChange={e => setLtvMonths(Number(e.target.value))}
                style={{ padding: '3px 6px', borderRadius: 5, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', background: 'var(--sf)', color: 'var(--tx)' }}>
                {[3, 6, 12, 24, 36].map(m => <option key={m} value={m}>{m}mo</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: INDIGO, fontVariantNumeric: 'tabular-nums' }}>{fmt(ltv, sym)}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>LTV ({ltvMonths}mo)</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: ltvColor, fontVariantNumeric: 'tabular-nums' }}>{ltvCacRatio.toFixed(1)}x</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>LTV:CAC ratio</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: paybackMonths <= 3 ? GREEN : paybackMonths <= 6 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
                {paybackMonths > 0 ? `${paybackMonths.toFixed(1)}mo` : '—'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>CAC payback</div>
            </div>
          </div>
          {/* LTV:CAC visual bar */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginBottom: 3 }}>
              <span>0x</span>
              <span style={{ color: AMBER, fontWeight: 600 }}>1.5x</span>
              <span style={{ color: GREEN, fontWeight: 600 }}>3x+ (target)</span>
            </div>
            <div style={{ position: 'relative', height: 8, background: `linear-gradient(90deg, ${RED}, ${AMBER} 30%, ${GREEN} 60%, ${GREEN})`, borderRadius: 4, opacity: 0.3 }}>
              <div style={{
                position: 'absolute', left: `${Math.min((ltvCacRatio / 5) * 100, 98)}%`, top: -3,
                width: 8, height: 14, borderRadius: 3, background: ltvColor,
                transform: 'translateX(-4px)', boxShadow: `0 1px 4px ${ltvColor}50`,
              }} />
            </div>
          </div>
        </div>

        {/* Hero / Zero products */}
        {hasProducts && (heroes.length > 0 || zeros.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {heroes.length > 0 && (
              <div style={{ padding: 10, borderRadius: 8, border: `1px solid ${GREEN}20`, background: `${GREEN}06` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: GREEN, textTransform: 'uppercase', marginBottom: 6 }}>Top Performers</div>
                {heroes.map(p => (
                  <div key={p.name} style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{p.margin_pct}% margin · {fmt(p.contribution, sym)}</div>
                  </div>
                ))}
              </div>
            )}
            {zeros.length > 0 && (
              <div style={{ padding: 10, borderRadius: 8, border: `1px solid ${RED}20`, background: `${RED}06` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: RED, textTransform: 'uppercase', marginBottom: 6 }}>Underperformers</div>
                {zeros.map(p => (
                  <div key={p.name} style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{p.margin_pct}% margin · {fmt(p.contribution, sym)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category contribution */}
        {catArr.length > 1 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Contribution by Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {catArr.slice(0, 6).map(([cat, data]) => {
                const pct = totals.revenue > 0 ? (data.contribution / totals.gross_profit) * 100 : 0
                const marginPct = data.revenue > 0 ? ((data.revenue - data.cogs) / data.revenue) * 100 : 0
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx)' }}>{cat} ({data.count})</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: marginPct >= 40 ? GREEN : marginPct >= 20 ? AMBER : RED, fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(data.contribution, sym)} · {marginPct.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ height: 5, background: 'var(--ev, #f3f2ef)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${Math.max(pct, 1)}%`, background: INDIGO, borderRadius: 3, transition: 'width 400ms ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Product table */}
        {hasProducts && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product Detail</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['contribution', 'margin', 'revenue'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: sortBy === s ? 'rgba(99,102,241,.1)' : 'transparent',
                      color: sortBy === s ? INDIGO : 'var(--tx3)', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', textTransform: 'capitalize' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--b)' }}>
                    <th style={{ textAlign: 'left', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>Product</th>
                    <th style={{ textAlign: 'right', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>Revenue</th>
                    <th style={{ textAlign: 'right', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>Margin</th>
                    <th style={{ textAlign: 'right', padding: '5px 0', fontSize: 9, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase' }}>Contrib.</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.slice(0, 15).map(p => (
                    <tr key={p.name} style={{ borderBottom: '1px solid var(--b)' }}>
                      <td style={{ padding: '5px 0', color: 'var(--tx)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                      <td style={{ padding: '5px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(p.revenue, sym)}</td>
                      <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600, color: p.margin_pct >= 40 ? GREEN : p.margin_pct >= 20 ? AMBER : RED }}>{p.margin_pct}%</td>
                      <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(p.contribution, sym)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
