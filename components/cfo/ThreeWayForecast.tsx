'use client'

import { useState, useMemo } from 'react'

interface PnlMonth {
  month: string; revenue: number; cogs: number; fixed: number; net: number
  gross_margin_pct: number; net_margin_pct: number
}

interface Props {
  pnlMonthly: PnlMonth[]
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  cash: { balance: number; monthly_fixed: number; runway_months: number | null; daily_net_burn: number }
  receivablesSummary?: { total_receivables: number; total_payables: number; overdue_receivables: number }
  currencySymbol: string
  onAsk: (prompt: string) => void
}

const CARD: React.CSSProperties = { borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }
const GREEN = '#22C55E', RED = '#EF4444', INDIGO = '#6366F1', AMBER = '#F59E0B'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

type View = 'linked' | 'waterfall' | 'scenario'

export default function ThreeWayForecast({ pnlMonthly, totals, cash, receivablesSummary, currencySymbol: sym, onAsk }: Props) {
  const [view, setView] = useState<View>('linked')
  const [revenueAdj, setRevenueAdj] = useState(0)  // % adjustment
  const [cogsAdj, setCogsAdj] = useState(0)
  const [fixedAdj, setFixedAdj] = useState(0)

  // ── Project forward 3 months based on recent trends ──
  const forecast = useMemo(() => {
    const months = pnlMonthly.slice(-6)
    if (months.length < 2) return null

    // Simple trend: average month-over-month growth rates
    const revGrowths: number[] = []
    const cogsRatios: number[] = []
    const fixedAmts: number[] = []
    for (let i = 1; i < months.length; i++) {
      if (months[i - 1].revenue > 0) revGrowths.push((months[i].revenue - months[i - 1].revenue) / months[i - 1].revenue)
      if (months[i].revenue > 0) cogsRatios.push(months[i].cogs / months[i].revenue)
      fixedAmts.push(months[i].fixed)
    }

    const avgRevGrowth = revGrowths.length > 0 ? revGrowths.reduce((a, b) => a + b, 0) / revGrowths.length : 0
    const avgCogsRatio = cogsRatios.length > 0 ? cogsRatios.reduce((a, b) => a + b, 0) / cogsRatios.length : 0.6
    const avgFixed = fixedAmts.length > 0 ? fixedAmts.reduce((a, b) => a + b, 0) / fixedAmts.length : totals.fixed_costs

    const lastRev = months[months.length - 1].revenue
    const projected: Array<{
      month: string; revenue: number; cogs: number; grossProfit: number
      fixed: number; netProfit: number; cashBalance: number
      receivables: number; payables: number; netAssets: number
    }> = []

    let runningCash = cash.balance
    const baseReceivables = receivablesSummary?.total_receivables || 0
    const basePayables = receivablesSummary?.total_payables || 0

    for (let i = 0; i < 3; i++) {
      const growthFactor = 1 + avgRevGrowth + (revenueAdj / 100)
      const rev = (i === 0 ? lastRev : projected[i - 1].revenue) * growthFactor
      const cogsFactor = avgCogsRatio * (1 + cogsAdj / 100)
      const cogs = rev * cogsFactor
      const grossProfit = rev - cogs
      const fixed = avgFixed * (1 + fixedAdj / 100)
      const netProfit = grossProfit - fixed

      // Cash flow: net profit adjusted for working capital changes
      const collectionRate = 0.85 // assume 85% of revenue collected in-month
      const paymentRate = 0.9    // assume 90% of costs paid in-month
      const cashInflow = rev * collectionRate
      const cashOutflow = (cogs + fixed) * paymentRate
      runningCash = runningCash + cashInflow - cashOutflow

      // Balance sheet estimates
      const receivables = rev * (1 - collectionRate) + baseReceivables * Math.pow(0.7, i + 1)
      const payables = (cogs + fixed) * (1 - paymentRate) + basePayables * Math.pow(0.8, i + 1)
      const netAssets = runningCash + receivables - payables

      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() + i + 1)
      const monthLabel = monthDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })

      projected.push({ month: monthLabel, revenue: rev, cogs, grossProfit, fixed, netProfit, cashBalance: runningCash, receivables, payables, netAssets })
    }

    return { projected, avgRevGrowth, avgCogsRatio, avgFixed }
  }, [pnlMonthly, totals, cash, receivablesSummary, revenueAdj, cogsAdj, fixedAdj])

  if (!forecast || forecast.projected.length === 0) return null

  const { projected } = forecast

  // Find max values for bar scaling
  const maxRev = Math.max(...projected.map(p => p.revenue), 1)
  const maxCash = Math.max(...projected.map(p => Math.abs(p.cashBalance)), 1)

  return (
    <div style={CARD}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: INDIGO }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>3-Way Linked Forecast</span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(99,102,241,.08)', color: INDIGO }}>
            P&L → Cash → Balance Sheet
          </span>
        </div>
        <button onClick={() => onAsk(`My 3-way linked forecast shows: ${projected.map(p => `${p.month}: Revenue ${fmt(p.revenue, sym)}, Net Profit ${fmt(p.netProfit, sym)}, Cash ${fmt(p.cashBalance, sym)}`).join('. ')}. Revenue growth trend: ${(forecast.avgRevGrowth * 100).toFixed(1)}% MoM. What risks should I watch for and how can I improve these projections?`)}
          style={{ fontSize: 10, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
          Ask AI
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* View tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {([['linked', 'Linked View'], ['waterfall', 'Cash Waterfall'], ['scenario', 'What-If']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setView(id)}
              style={{ fontSize: 11, fontWeight: view === id ? 600 : 400, padding: '5px 12px', borderRadius: 8, border: `1px solid ${view === id ? INDIGO + '30' : 'var(--b)'}`, background: view === id ? 'rgba(99,102,241,.06)' : 'transparent', color: view === id ? INDIGO : 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── LINKED VIEW: 3 statements side by side ── */}
        {view === 'linked' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {projected.map(p => (
              <div key={p.month} style={{ borderRadius: 10, border: '1px solid var(--b)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 10px', background: 'var(--ev, #f9f9f8)', borderBottom: '1px solid var(--b)', fontSize: 11, fontWeight: 700, color: 'var(--tx)', textAlign: 'center' }}>
                  {p.month}
                </div>

                {/* P&L */}
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>P&L</div>
                  <Row label="Revenue" value={fmt(p.revenue, sym)} color="var(--tx)" />
                  <Row label="COGS" value={fmt(-p.cogs, sym)} color={RED} />
                  <Row label="Gross" value={fmt(p.grossProfit, sym)} color={p.grossProfit >= 0 ? GREEN : RED} />
                  <Row label="Fixed" value={fmt(-p.fixed, sym)} color={RED} />
                  <div style={{ borderTop: '1px solid var(--b)', paddingTop: 4, marginTop: 4 }}>
                    <Row label="Net" value={fmt(p.netProfit, sym)} color={p.netProfit >= 0 ? GREEN : RED} bold />
                  </div>
                </div>

                {/* Cash Flow */}
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--b)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Cash Flow</div>
                  <Row label="Balance" value={fmt(p.cashBalance, sym)} color={p.cashBalance >= 0 ? GREEN : RED} bold />
                  {/* Visual bar */}
                  <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: 'var(--ev, #eee)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (p.cashBalance / maxCash) * 100)}%`, borderRadius: 2, background: p.cashBalance >= 0 ? GREEN : RED, transition: 'width 300ms' }} />
                  </div>
                </div>

                {/* Balance Sheet */}
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Balance Sheet</div>
                  <Row label="Cash" value={fmt(p.cashBalance, sym)} color="var(--tx)" />
                  <Row label="Receivables" value={fmt(p.receivables, sym)} color="var(--tx)" />
                  <Row label="Payables" value={fmt(-p.payables, sym)} color={RED} />
                  <div style={{ borderTop: '1px solid var(--b)', paddingTop: 4, marginTop: 4 }}>
                    <Row label="Net Assets" value={fmt(p.netAssets, sym)} color={p.netAssets >= 0 ? GREEN : RED} bold />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CASH WATERFALL ── */}
        {view === 'waterfall' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 14, lineHeight: 1.5 }}>
              How cash flows from your P&L through working capital changes to your ending balance.
            </div>
            {projected.map((p, i) => {
              const prevCash = i === 0 ? cash.balance : projected[i - 1].cashBalance
              const cashFromOps = p.netProfit
              const wcChange = (p.receivables - (i === 0 ? (receivablesSummary?.total_receivables || 0) : projected[i - 1].receivables)) -
                               (p.payables - (i === 0 ? (receivablesSummary?.total_payables || 0) : projected[i - 1].payables))
              const netCashChange = p.cashBalance - prevCash

              return (
                <div key={p.month} style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 8 }}>{p.month}</div>
                  <WaterfallRow label="Opening Cash" value={prevCash} sym={sym} />
                  <WaterfallRow label="+ Net Profit" value={cashFromOps} sym={sym} positive />
                  <WaterfallRow label="± Working Capital" value={-wcChange} sym={sym} />
                  <div style={{ borderTop: '2px solid var(--b)', marginTop: 6, paddingTop: 6 }}>
                    <WaterfallRow label="= Closing Cash" value={p.cashBalance} sym={sym} bold />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 10, color: netCashChange >= 0 ? GREEN : RED, fontWeight: 600 }}>
                    {netCashChange >= 0 ? '↑' : '↓'} {fmt(Math.abs(netCashChange), sym)} net change
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── WHAT-IF SCENARIO ── */}
        {view === 'scenario' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 14, lineHeight: 1.5 }}>
              Adjust assumptions and see how changes cascade through all three financial statements.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <SliderRow label="Revenue growth" value={revenueAdj} onChange={setRevenueAdj} color={GREEN} />
              <SliderRow label="COGS change" value={cogsAdj} onChange={setCogsAdj} color={RED} />
              <SliderRow label="Fixed costs change" value={fixedAdj} onChange={setFixedAdj} color={AMBER} />
              {(revenueAdj !== 0 || cogsAdj !== 0 || fixedAdj !== 0) && (
                <button onClick={() => { setRevenueAdj(0); setCogsAdj(0); setFixedAdj(0) }}
                  style={{ fontSize: 10, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, textAlign: 'left' }}>
                  Reset to baseline →
                </button>
              )}
            </div>

            {/* Impact summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1, background: 'var(--b)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
              {[
                ['Month 3 Revenue', fmt(projected[2].revenue, sym), INDIGO],
                ['Month 3 Net Profit', fmt(projected[2].netProfit, sym), projected[2].netProfit >= 0 ? GREEN : RED],
                ['Month 3 Cash', fmt(projected[2].cashBalance, sym), projected[2].cashBalance >= 0 ? GREEN : RED],
                ['Month 3 Net Assets', fmt(projected[2].netAssets, sym), projected[2].netAssets >= 0 ? GREEN : RED],
              ].map(([label, value, color]) => (
                <div key={label} style={{ padding: '10px 8px', background: 'var(--sf)', textAlign: 'center' }}>
                  <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Cascade visualization */}
            <div style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', marginBottom: 8 }}>CASCADE EFFECT</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <CascadeChip label="Revenue" change={revenueAdj} color={GREEN} />
                <Arrow />
                <CascadeChip label="Gross Profit" change={projected[2].grossProfit > 0 ? ((projected[2].grossProfit / projected[2].revenue) * 100 - totals.gross_margin_pct) : 0} color={INDIGO} />
                <Arrow />
                <CascadeChip label="Net Profit" change={totals.net_profit > 0 ? ((projected[2].netProfit - totals.net_profit) / totals.net_profit) * 100 : 0} color={projected[2].netProfit >= 0 ? GREEN : RED} />
                <Arrow />
                <CascadeChip label="Cash" change={cash.balance > 0 ? ((projected[2].cashBalance - cash.balance) / cash.balance) * 100 : 0} color={projected[2].cashBalance >= 0 ? GREEN : RED} />
              </div>
            </div>
          </div>
        )}

        {/* Link explanation */}
        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)' }}>
          <div style={{ fontSize: 10, color: INDIGO, fontWeight: 600, marginBottom: 4 }}>How the 3 statements connect</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
            P&L net profit feeds into cash flow. Cash flow is adjusted for working capital (when you collect revenue vs pay bills). The ending cash balance flows into the balance sheet alongside receivables and payables.
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
      <span style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: bold ? 700 : 600, color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )
}

function WaterfallRow({ label, value, sym, bold, positive }: { label: string; value: number; sym: string; bold?: boolean; positive?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
      <span style={{ fontSize: 11, color: 'var(--tx)', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: bold ? 700 : 600, color: value >= 0 ? '#22C55E' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(value, sym)}
      </span>
    </div>
  )
}

function SliderRow({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--tx)', fontWeight: 500, minWidth: 110 }}>{label}</span>
      <input type="range" min={-30} max={30} step={5} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: color, height: 4 }} />
      <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: value === 0 ? 'var(--tx3)' : value > 0 ? '#22C55E' : '#EF4444', minWidth: 45, textAlign: 'right' }}>
        {value > 0 ? '+' : ''}{value}%
      </span>
    </div>
  )
}

function CascadeChip({ label, change, color }: { label: string; change: number; color: string }) {
  return (
    <div style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${color}25`, background: `${color}08`, textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 5h10M8 2l3 3-3 3" stroke="var(--tx3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
