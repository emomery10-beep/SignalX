'use client'

import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  totals: {
    revenue: number
    cogs: number
    gross_profit: number
    fixed_costs: number
    net_profit: number
    gross_margin_pct: number
    net_margin_pct: number
  }
  comparison: {
    revenue: number
    cogs: number
    gross_profit: number
    net_profit: number
    gross_margin_pct: number
  }
  pnlMonthly?: Array<{
    month: string
    revenue: number
    cogs: number
    fixed: number
    net: number
    gross_margin_pct: number
    net_margin_pct: number
  }>
  pnlBySource?: Array<{
    source: string
    label: string
    revenue: number
    cogs: number
    gross_profit: number
    margin_pct: number
    orders: number
    pct_of_total: number
  }>
  currencySymbol: string
  onAsk: (prompt: string) => void
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
  if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
  return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
}

function pctStr(n: number): string {
  return `${n >= 0 ? '' : '−'}${Math.abs(n).toFixed(1)}%`
}

function changePct(current: number, prior: number): number | null {
  if (prior === 0) return current === 0 ? 0 : null
  return ((current - prior) / Math.abs(prior)) * 100
}

const CARD: React.CSSProperties = {
  borderRadius: 14,
  border: '1px solid var(--b)',
  background: 'var(--sf)',
  padding: 20,
}

const NUM_STYLE: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFamily: 'inherit',
}

const GREEN = '#22C55E'
const ORANGE = '#F97316'
const RED = '#EF4444'
const INDIGO = '#6366F1'

/* ------------------------------------------------------------------ */
/*  Section header bar                                                 */
/* ------------------------------------------------------------------ */

function SectionBar({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 }}>
      <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{label}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Mini sparkline (40x16)                                             */
/* ------------------------------------------------------------------ */

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return <span style={{ width: 40 }} />
  const w = 40
  const h = 16
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 2) - 1
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Waterfall Chart                                                    */
/* ------------------------------------------------------------------ */

function WaterfallChart({ totals, sym }: { totals: Props['totals']; sym: string }) {
  const { revenue, cogs, gross_profit, fixed_costs, net_profit } = totals
  const maxVal = Math.max(revenue, gross_profit, Math.abs(net_profit), Math.abs(cogs), Math.abs(fixed_costs)) || 1

  // Layout: 5 bars evenly spaced
  const barCount = 5
  const vbW = 500
  const vbH = 180
  const pad = 40
  const chartH = vbH - pad * 2
  const barW = 50
  const gap = (vbW - barCount * barW) / (barCount + 1)

  function scaleY(v: number) {
    return (v / maxVal) * chartH * 0.85
  }

  const baseline = pad + chartH * 0.9 // bottom baseline y

  interface BarDef {
    label: string
    value: number
    top: number
    height: number
    color: string
  }

  const revH = scaleY(revenue)
  const cogsH = scaleY(Math.abs(cogs))
  const gpH = scaleY(gross_profit)
  const fixedH = scaleY(Math.abs(fixed_costs))
  const npH = scaleY(Math.abs(net_profit))

  const bars: BarDef[] = [
    { label: 'Revenue', value: revenue, top: baseline - revH, height: revH, color: GREEN },
    { label: 'COGS', value: -Math.abs(cogs), top: baseline - revH, height: cogsH, color: ORANGE },
    { label: 'Gross Profit', value: gross_profit, top: baseline - gpH, height: gpH, color: gross_profit >= 0 ? GREEN : RED },
    { label: 'Fixed Costs', value: -Math.abs(fixed_costs), top: baseline - gpH, height: fixedH, color: RED },
    { label: 'Net Profit', value: net_profit, top: baseline - npH, height: npH, color: net_profit >= 0 ? GREEN : RED },
  ]

  // For hanging bars: COGS hangs from top of Revenue, Fixed hangs from top of Gross Profit
  bars[1].top = baseline - revH          // starts at Revenue top
  bars[3].top = baseline - gpH           // starts at Gross Profit top

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} width="100%" height={180} style={{ display: 'block' }}>
      {/* Baseline */}
      <line x1={0} y1={baseline} x2={vbW} y2={baseline} stroke="var(--b)" strokeWidth={0.5} />

      {/* Connector lines */}
      {/* Revenue top -> COGS top */}
      <line x1={gap + barW} y1={bars[0].top} x2={gap * 2 + barW} y2={bars[0].top} stroke="var(--tx3)" strokeWidth={0.5} strokeDasharray="3,2" />
      {/* COGS bottom -> Gross Profit top */}
      <line x1={gap * 2 + barW * 2} y1={bars[2].top} x2={gap * 3 + barW * 2} y2={bars[2].top} stroke="var(--tx3)" strokeWidth={0.5} strokeDasharray="3,2" />
      {/* Gross Profit top -> Fixed top */}
      <line x1={gap * 3 + barW * 3} y1={bars[2].top} x2={gap * 4 + barW * 3} y2={bars[2].top} stroke="var(--tx3)" strokeWidth={0.5} strokeDasharray="3,2" />

      {bars.map((bar, i) => {
        const x = gap * (i + 1) + barW * i
        return (
          <g key={i}>
            <rect x={x} y={bar.top} width={barW} height={Math.max(bar.height, 2)} rx={3} fill={bar.color} opacity={0.85} />
            {/* Amount label */}
            <text
              x={x + barW / 2}
              y={bar.top - 6}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="var(--tx)"
              style={NUM_STYLE}
            >
              {fmt(bar.value, sym)}
            </text>
            {/* Category label */}
            <text x={x + barW / 2} y={baseline + 14} textAnchor="middle" fontSize={9} fill="var(--tx3)">
              {bar.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Monthly Trend Chart                                                */
/* ------------------------------------------------------------------ */

function MonthlyTrendChart({ data, sym }: { data: NonNullable<Props['pnlMonthly']>; sym: string }) {
  const vbW = 600
  const vbH = 200
  const padL = 50
  const padR = 20
  const padT = 20
  const padB = 40
  const chartW = vbW - padL - padR
  const chartH = vbH - padT - padB

  const allVals = data.flatMap((d) => [d.revenue, d.cogs, d.net])
  const maxVal = Math.max(...allVals.map(Math.abs), 1)
  const minVal = Math.min(0, ...allVals)
  const range = maxVal - minVal || 1

  const barGroupW = chartW / data.length
  const barW = Math.min(barGroupW * 0.3, 24)

  function yPos(v: number) {
    return padT + chartH - ((v - minVal) / range) * chartH
  }

  const zeroY = yPos(0)

  // Net profit line points
  const linePoints = data
    .map((d, i) => {
      const cx = padL + barGroupW * i + barGroupW / 2
      const cy = yPos(d.net)
      return `${cx},${cy}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} width="100%" height={200} style={{ display: 'block' }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = padT + chartH * (1 - f)
        const val = minVal + range * f
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={vbW - padR} y2={y} stroke="var(--b)" strokeWidth={0.5} />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize={8} fill="var(--tx3)" style={NUM_STYLE}>
              {fmt(val, sym)}
            </text>
          </g>
        )
      })}

      {/* Zero line */}
      {minVal < 0 && (
        <line x1={padL} y1={zeroY} x2={vbW - padR} y2={zeroY} stroke="var(--tx3)" strokeWidth={0.5} strokeDasharray="4,2" />
      )}

      {/* Revenue & COGS bars */}
      {data.map((d, i) => {
        const cx = padL + barGroupW * i + barGroupW / 2
        const revH = (d.revenue / range) * chartH
        const cogsH = (d.cogs / range) * chartH
        return (
          <g key={i}>
            {/* Revenue bar */}
            <rect x={cx - barW - 1} y={zeroY - revH} width={barW} height={Math.max(revH, 1)} rx={2} fill={GREEN} opacity={0.7} />
            {/* COGS bar */}
            <rect x={cx + 1} y={zeroY - cogsH} width={barW} height={Math.max(cogsH, 1)} rx={2} fill={ORANGE} opacity={0.7} />
            {/* Month label */}
            <text x={cx} y={vbH - padB + 14} textAnchor="middle" fontSize={9} fill="var(--tx3)">
              {d.month}
            </text>
          </g>
        )
      })}

      {/* Net profit line */}
      <polyline points={linePoints} fill="none" stroke={INDIGO} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const cx = padL + barGroupW * i + barGroupW / 2
        const cy = yPos(d.net)
        return <circle key={i} cx={cx} cy={cy} r={2.5} fill={INDIGO} />
      })}

      {/* Legend */}
      <rect x={padL} y={4} width={8} height={8} rx={1} fill={GREEN} opacity={0.7} />
      <text x={padL + 12} y={12} fontSize={8} fill="var(--tx3)">Revenue</text>
      <rect x={padL + 60} y={4} width={8} height={8} rx={1} fill={ORANGE} opacity={0.7} />
      <text x={padL + 72} y={12} fontSize={8} fill="var(--tx3)">COGS</text>
      <line x1={padL + 115} y1={8} x2={padL + 130} y2={8} stroke={INDIGO} strokeWidth={1.5} />
      <text x={padL + 134} y={12} fontSize={8} fill="var(--tx3)">Net Profit</text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PnlStatement({ totals, comparison, pnlMonthly, pnlBySource, currencySymbol: sym, onAsk }: Props) {
  const [expandRevenue, setExpandRevenue] = useState(false)
  const [expandCogs, setExpandCogs] = useState(false)

  /* ---- derived data ---- */
  const revenueChange = changePct(totals.revenue, comparison.revenue)
  const cogsChange = changePct(totals.cogs, comparison.cogs)
  const gpChange = changePct(totals.gross_profit, comparison.gross_profit)
  const npChange = changePct(totals.net_profit, comparison.net_profit)

  const monthlyRevenue = pnlMonthly?.map((m) => m.revenue) ?? []
  const monthlyCogs = pnlMonthly?.map((m) => m.cogs) ?? []
  const monthlyNet = pnlMonthly?.map((m) => m.net) ?? []
  const monthlyGrossMargin = pnlMonthly?.map((m) => m.gross_margin_pct) ?? []

  /* ---- row helpers ---- */
  const thStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--tx3)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    padding: '6px 8px',
    borderBottom: '1px solid var(--b)',
    textAlign: 'left',
  }

  const tdStyle: React.CSSProperties = {
    fontSize: 13,
    padding: '8px 8px',
    borderBottom: '1px solid var(--b)',
    ...NUM_STYLE,
  }

  function ChangeCell({ pct }: { pct: number | null }) {
    if (pct === null) return <td style={tdStyle}>—</td>
    const isLarge = Math.abs(pct) > 10
    const color = pct > 0 ? GREEN : pct < 0 ? RED : 'var(--tx3)'
    return (
      <td
        style={{
          ...tdStyle,
          color,
          fontWeight: 500,
          background: isLarge ? (pct > 0 ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)') : undefined,
          borderRadius: isLarge ? 4 : undefined,
        }}
      >
        {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
      </td>
    )
  }

  function ExpandIcon({ expanded }: { expanded: boolean }) {
    return (
      <svg width={12} height={12} viewBox="0 0 12 12" style={{ marginRight: 4, transition: 'transform 0.15s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
        <path d="M4 2l4 4-4 4" fill="none" stroke="var(--tx3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  /* ---- sub-row for source breakdown ---- */
  function SourceSubRow({ s, metric }: { s: NonNullable<Props['pnlBySource']>[number]; metric: 'revenue' | 'cogs' }) {
    const val = metric === 'revenue' ? s.revenue : s.cogs
    const pctOfRev = metric === 'revenue' ? s.pct_of_total : (totals.revenue ? (s.cogs / totals.revenue) * 100 : 0)
    return (
      <tr style={{ background: 'var(--bg)' }}>
        <td style={{ ...tdStyle, paddingLeft: 32, fontSize: 12, color: 'var(--tx2)' }}>{s.label}</td>
        <td style={{ ...tdStyle, fontSize: 12 }}>{fmt(val, sym)}</td>
        <td style={{ ...tdStyle, fontSize: 11, color: 'var(--tx3)' }}>{pctOfRev.toFixed(1)}%</td>
        <td style={{ ...tdStyle, fontSize: 12, color: 'var(--tx3)' }}>—</td>
        <td style={{ ...tdStyle, fontSize: 12, color: 'var(--tx3)' }}>—</td>
        <td style={tdStyle} />
      </tr>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ============================================================ */}
      {/*  HEADER                                                       */}
      {/* ============================================================ */}
      <div style={{ ...CARD, paddingBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--tx)' }}>Profit &amp; Loss Statement</h2>
            <p style={{ fontSize: 11, color: 'var(--tx3)', margin: '4px 0 0' }}>
              Current period vs prior period &middot; All figures in {sym}
            </p>
          </div>
          <button
            onClick={() => onAsk('Analyze my P&L statement. What are the key trends and areas of concern?')}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: INDIGO,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Ask AI about this P&amp;L
          </button>
        </div>

        {/* ---- Waterfall ---- */}
        <div style={{ marginTop: 16 }}>
          <WaterfallChart totals={totals} sym={sym} />
        </div>
      </div>

      {/* ============================================================ */}
      {/*  MAIN P&L TABLE                                               */}
      {/* ============================================================ */}
      <div style={CARD}>
        <SectionBar color={INDIGO} label="Income Statement" />

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '30%' }}>Line Item</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Current</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>% of Rev</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Prior Period</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Change</th>
                <th style={{ ...thStyle, textAlign: 'center', width: 50 }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {/* ---------- REVENUE ---------- */}
              <tr
                style={{ cursor: pnlBySource?.length ? 'pointer' : undefined }}
                onClick={() => pnlBySource?.length && setExpandRevenue((p) => !p)}
              >
                <td style={{ ...tdStyle, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  {pnlBySource?.length ? <ExpandIcon expanded={expandRevenue} /> : null}
                  Revenue
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{fmt(totals.revenue, sym)}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>100.0%</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx2)' }}>{fmt(comparison.revenue, sym)}</td>
                <ChangeCell pct={revenueChange} />
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <MiniSparkline data={monthlyRevenue} color={GREEN} />
                </td>
              </tr>

              {/* Revenue sub-rows */}
              {expandRevenue &&
                pnlBySource?.map((s) => <SourceSubRow key={s.source} s={s} metric="revenue" />)}

              {/* ---------- COGS ---------- */}
              <tr
                style={{ cursor: pnlBySource?.length ? 'pointer' : undefined }}
                onClick={() => pnlBySource?.length && setExpandCogs((p) => !p)}
              >
                <td style={{ ...tdStyle, color: ORANGE, display: 'flex', alignItems: 'center' }}>
                  {pnlBySource?.length ? <ExpandIcon expanded={expandCogs} /> : null}
                  Cost of Goods Sold
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', color: ORANGE }}>({fmt(totals.cogs, sym)})</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>
                  {totals.revenue ? ((totals.cogs / totals.revenue) * 100).toFixed(1) : '0.0'}%
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx2)' }}>({fmt(comparison.cogs, sym)})</td>
                <ChangeCell pct={cogsChange} />
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <MiniSparkline data={monthlyCogs} color={ORANGE} />
                </td>
              </tr>

              {/* COGS sub-rows */}
              {expandCogs &&
                pnlBySource?.map((s) => <SourceSubRow key={s.source} s={s} metric="cogs" />)}

              {/* ---------- GROSS PROFIT ---------- */}
              <tr>
                <td style={{ ...tdStyle, fontWeight: 700, borderTop: `2px solid ${GREEN}`, paddingTop: 10 }}>
                  Gross Profit
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: totals.gross_profit >= 0 ? GREEN : RED, borderTop: `2px solid ${GREEN}`, paddingTop: 10 }}>
                  {fmt(totals.gross_profit, sym)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontSize: 11, color: 'var(--tx3)', borderTop: `2px solid ${GREEN}`, paddingTop: 10 }}>
                  {totals.gross_margin_pct.toFixed(1)}%
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx2)', borderTop: `2px solid ${GREEN}`, paddingTop: 10 }}>
                  {fmt(comparison.gross_profit, sym)}
                </td>
                <ChangeCell pct={gpChange} />
                <td style={{ ...tdStyle, textAlign: 'center', borderTop: `2px solid ${GREEN}`, paddingTop: 10 }}>
                  <MiniSparkline data={monthlyGrossMargin} color={GREEN} />
                </td>
              </tr>

              {/* ---------- OPERATING EXPENSES ---------- */}
              <tr>
                <td style={{ ...tdStyle, color: RED }}>Operating Expenses</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: RED }}>({fmt(totals.fixed_costs, sym)})</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>
                  {totals.revenue ? ((totals.fixed_costs / totals.revenue) * 100).toFixed(1) : '0.0'}%
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx2)' }}>—</td>
                <td style={tdStyle}>—</td>
                <td style={tdStyle} />
              </tr>

              {/* ---------- NET PROFIT ---------- */}
              <tr style={{ background: totals.net_profit >= 0 ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)' }}>
                <td style={{ ...tdStyle, fontWeight: 700, fontSize: 14, borderBottom: 'none' }}>
                  Net Profit
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, fontSize: 14, color: totals.net_profit >= 0 ? GREEN : RED, borderBottom: 'none' }}>
                  {fmt(totals.net_profit, sym)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontSize: 11, color: 'var(--tx3)', borderBottom: 'none' }}>
                  {totals.net_margin_pct.toFixed(1)}%
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx2)', borderBottom: 'none' }}>
                  {fmt(comparison.net_profit, sym)}
                </td>
                <ChangeCell pct={npChange} />
                <td style={{ ...tdStyle, textAlign: 'center', borderBottom: 'none' }}>
                  <MiniSparkline data={monthlyNet} color={totals.net_profit >= 0 ? GREEN : RED} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  MONTHLY TREND                                                */}
      {/* ============================================================ */}
      {pnlMonthly && pnlMonthly.length > 0 && (
        <div style={CARD}>
          <SectionBar color={INDIGO} label="Monthly P&L Trend" />

          <MonthlyTrendChart data={pnlMonthly} sym={sym} />

          {/* Monthly summary table */}
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 80 }}>Month</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Revenue</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>COGS</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Fixed</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Net</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>GM%</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>NM%</th>
                </tr>
              </thead>
              <tbody>
                {pnlMonthly.map((m) => (
                  <tr key={m.month}>
                    <td style={{ ...tdStyle, fontSize: 12, fontWeight: 500 }}>{m.month}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontSize: 12 }}>{fmt(m.revenue, sym)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontSize: 12, color: ORANGE }}>{fmt(m.cogs, sym)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontSize: 12, color: RED }}>{fmt(m.fixed, sym)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontSize: 12, fontWeight: 600, color: m.net >= 0 ? GREEN : RED }}>
                      {fmt(m.net, sym)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>{m.gross_margin_pct.toFixed(1)}%</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontSize: 11, color: 'var(--tx3)' }}>{m.net_margin_pct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
