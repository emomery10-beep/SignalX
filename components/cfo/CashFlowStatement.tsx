'use client'

interface Props {
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number }
  cash: { balance: number; monthly_fixed: number; runway_months: number | null; runway_status: string; daily_net_burn: number }
  dailyCashflow?: Array<{ date: string; inflow: number; outflow: number; net: number }>
  receivablesAging?: { current: number; overdue_30: number; overdue_60: number; overdue_90: number }
  receivablesSummary?: { total_receivables: number; total_payables: number; overdue_receivables: number }
  currencySymbol: string
  onAsk: (prompt: string) => void
}

const GREEN = '#22C55E'
const ORANGE = '#F97316'
const RED = '#EF4444'
const INDIGO = '#6366F1'
const YELLOW = '#F59E0B'

export default function CashFlowStatement({
  totals,
  cash,
  dailyCashflow,
  receivablesAging,
  receivablesSummary,
  currencySymbol: sym,
  onAsk,
}: Props) {
  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
    if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000).toFixed(1)}K${n < 0 ? ')' : ''}`
    return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
  }

  const runwayColor = (status: string) => {
    if (status === 'critical') return RED
    if (status === 'warning') return YELLOW
    return GREEN
  }

  /* ── Aggregate daily data to weekly if > 30 days ── */
  const chartData = (() => {
    if (!dailyCashflow || dailyCashflow.length === 0) return null
    if (dailyCashflow.length <= 30) return dailyCashflow
    const weeks: Array<{ date: string; inflow: number; outflow: number; net: number }> = []
    for (let i = 0; i < dailyCashflow.length; i += 7) {
      const chunk = dailyCashflow.slice(i, i + 7)
      weeks.push({
        date: chunk[0].date,
        inflow: chunk.reduce((s, d) => s + d.inflow, 0),
        outflow: chunk.reduce((s, d) => s + d.outflow, 0),
        net: chunk.reduce((s, d) => s + d.net, 0),
      })
    }
    return weeks
  })()

  /* ── Cash flow statement math ── */
  const netOperating = totals.revenue - totals.cogs - totals.fixed_costs
  const netFinancing = (receivablesSummary?.total_receivables ?? 0) - (receivablesSummary?.total_payables ?? 0)
  const netCashPosition = netOperating + netFinancing

  /* ── Receivables aging check ── */
  const hasAging = receivablesAging && (
    receivablesAging.current > 0 || receivablesAging.overdue_30 > 0 ||
    receivablesAging.overdue_60 > 0 || receivablesAging.overdue_90 > 0
  )
  const agingTotal = hasAging
    ? receivablesAging!.current + receivablesAging!.overdue_30 + receivablesAging!.overdue_60 + receivablesAging!.overdue_90
    : 0
  const atRisk = hasAging
    ? receivablesAging!.overdue_30 + receivablesAging!.overdue_60 + receivablesAging!.overdue_90
    : 0

  /* ── Cash Flow Chart helpers ── */
  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null

    const W = 600
    const H = 200
    const padL = 56
    const padR = 16
    const padT = 16
    const padB = 36
    const chartW = W - padL - padR
    const chartH = H - padT - padB

    const maxInflow = Math.max(...chartData.map(d => d.inflow), 1)
    const maxOutflow = Math.max(...chartData.map(d => d.outflow), 1)
    const maxVal = Math.max(maxInflow, maxOutflow)

    // Cumulative net
    let cum = 0
    const cumPoints = chartData.map(d => { cum += d.net; return cum })
    const cumMin = Math.min(...cumPoints, 0)
    const cumMax = Math.max(...cumPoints, 1)
    const cumRange = cumMax - cumMin || 1

    const barGroupW = chartW / chartData.length
    const barW = Math.max(2, barGroupW * 0.3)
    const gap = 2
    const zeroY = padT + chartH / 2

    const scaleBar = (v: number) => (v / maxVal) * (chartH / 2)

    // Label interval
    const labelInterval = chartData.length <= 10 ? 1 : chartData.length <= 20 ? 3 : 5

    // Y-axis ticks
    const yTicks = [maxVal, maxVal / 2, 0, -maxVal / 2, -maxVal]
    const yScale = (v: number) => zeroY - scaleBar(v)

    // Cumulative line points
    const cumLinePoints = cumPoints.map((v, i) => {
      const x = padL + barGroupW * i + barGroupW / 2
      const y = padT + chartH - ((v - cumMin) / cumRange) * chartH
      return `${x},${y}`
    }).join(' ')

    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 12 }}>
          Daily Cash Flow
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Zero line */}
          <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke="var(--b)" strokeWidth={1} />

          {/* Y-axis ticks */}
          {yTicks.map((v, i) => {
            const y = yScale(v)
            return (
              <g key={i}>
                <line x1={padL - 4} y1={y} x2={padL} y2={y} stroke="var(--tx3)" strokeWidth={0.5} />
                <text x={padL - 8} y={y + 3} textAnchor="end" fontSize={9} fill="var(--tx3)">
                  {fmt(v)}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {chartData.map((d, i) => {
            const x = padL + barGroupW * i + (barGroupW - barW * 2 - gap) / 2
            const inflowH = scaleBar(d.inflow)
            const outflowH = scaleBar(d.outflow)
            return (
              <g key={i}>
                {/* Inflow bar (green, going up) */}
                <rect x={x} y={zeroY - inflowH} width={barW} height={inflowH} fill={GREEN} rx={1} opacity={0.85} />
                {/* Outflow bar (red, going down) */}
                <rect x={x + barW + gap} y={zeroY} width={barW} height={outflowH} fill={RED} rx={1} opacity={0.85} />
                {/* X-axis label */}
                {i % labelInterval === 0 && (
                  <text
                    x={padL + barGroupW * i + barGroupW / 2}
                    y={H - 4}
                    textAnchor="middle"
                    fontSize={9}
                    fill="var(--tx3)"
                  >
                    {d.date.slice(5)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Cumulative net line */}
          <polyline
            points={cumLinePoints}
            fill="none"
            stroke={INDIGO}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
          {cumPoints.length > 0 && (
            <circle
              cx={parseFloat(cumLinePoints.split(' ').pop()!.split(',')[0])}
              cy={parseFloat(cumLinePoints.split(' ').pop()!.split(',')[1])}
              r={3}
              fill={INDIGO}
            />
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
          {[
            { label: 'Inflow', color: GREEN },
            { label: 'Outflow', color: RED },
            { label: 'Cumulative Net', color: INDIGO },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--tx3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: 'inline-block' }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Statement table row helper ── */
  const Row = ({ label, value, bold, italic, color, note, borderTop }: {
    label: string; value?: string; bold?: boolean; italic?: boolean; color?: string; note?: string; borderTop?: boolean
  }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 0',
      borderTop: borderTop ? '1px solid var(--b)' : undefined,
      fontWeight: bold ? 700 : 400,
      fontStyle: italic ? 'italic' : 'normal',
      fontSize: bold ? 13 : 12,
    }}>
      <span style={{ color: italic ? 'var(--tx3)' : 'var(--tx)' }}>{label}</span>
      <span style={{ color: color || 'var(--tx)', fontFamily: 'var(--font-sora, inherit)' }}>
        {value ?? ''}
        {note && <span style={{ fontSize: 10, color: 'var(--tx3)', fontStyle: 'italic', marginLeft: 6 }}>{note}</span>}
      </span>
    </div>
  )

  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{
      fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase' as const,
      letterSpacing: '0.08em', padding: '10px 0 4px', marginTop: 8,
      borderBottom: '2px solid var(--b)',
    }}>
      {title}
    </div>
  )

  /* ── Projection cards ── */
  const renderProjection = () => {
    if (cash.balance <= 0) return null
    const dailyNet = cash.daily_net_burn
    const monthlyExpenses = cash.monthly_fixed || (totals.fixed_costs + totals.cogs)
    const periods = [30, 60, 90]
    const projections = periods.map(days => ({
      days,
      balance: cash.balance + dailyNet * days,
    }))

    const lowThreshold = monthlyExpenses > 0 ? monthlyExpenses : cash.balance * 0.1

    const projColor = (bal: number) => {
      if (bal < 0) return RED
      if (bal < lowThreshold) return YELLOW
      return GREEN
    }

    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 12 }}>
          Cash Flow Projection
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {projections.map(p => {
            const c = projColor(p.balance)
            return (
              <div key={p.days} style={{
                padding: '12px 14px', borderRadius: 12,
                border: `1px solid ${c}22`, background: `${c}08`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {p.days} Days
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c, fontFamily: 'var(--font-sora, inherit)', letterSpacing: '-0.02em' }}>
                  {fmt(p.balance)}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 8, textAlign: 'center' }}>
          Based on average daily net: {fmt(cash.daily_net_burn)}/day
        </div>
      </div>
    )
  }

  /* ── Receivables Aging ── */
  const renderAging = () => {
    if (!hasAging) return null
    const buckets = [
      { label: 'Current', value: receivablesAging!.current, color: GREEN },
      { label: '30 Days', value: receivablesAging!.overdue_30, color: YELLOW },
      { label: '60 Days', value: receivablesAging!.overdue_60, color: ORANGE },
      { label: '90+ Days', value: receivablesAging!.overdue_90, color: RED },
    ]

    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>
            Receivables Aging
          </div>
          <div style={{ fontSize: 11, color: RED, fontWeight: 600 }}>
            At Risk: {fmt(atRisk)}
          </div>
        </div>

        {/* Stacked horizontal bar */}
        <div style={{ display: 'flex', height: 20, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
          {buckets.map(b => {
            const pct = agingTotal > 0 ? (b.value / agingTotal) * 100 : 0
            if (pct === 0) return null
            return (
              <div key={b.label} style={{
                width: `${pct}%`, background: b.color, minWidth: pct > 0 ? 2 : 0,
                transition: 'width 300ms',
              }} />
            )
          })}
        </div>

        {/* Bucket cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {buckets.map(b => {
            const pct = agingTotal > 0 ? ((b.value / agingTotal) * 100).toFixed(1) : '0.0'
            return (
              <div key={b.label} style={{
                padding: '10px 12px', borderRadius: 10,
                border: `1px solid ${b.color}22`, background: `${b.color}08`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                  {b.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: b.color, fontFamily: 'var(--font-sora, inherit)' }}>
                  {fmt(b.value)}
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
                  {pct}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── Cash Position Card helper ── */
  const PositionCard = ({ label, value, color, notSet, clickPrompt }: {
    label: string; value: string; color: string; notSet?: boolean; clickPrompt?: string
  }) => (
    <div
      onClick={notSet && clickPrompt ? () => onAsk(clickPrompt) : undefined}
      style={{
        padding: '12px 14px', borderRadius: 12,
        border: '1px solid var(--b)', background: 'var(--sf)',
        position: 'relative', overflow: 'hidden',
        cursor: notSet && clickPrompt ? 'pointer' : 'default',
        transition: 'box-shadow 150ms, border-color 150ms',
      }}
      onMouseEnter={notSet && clickPrompt ? (e) => {
        e.currentTarget.style.borderColor = INDIGO
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,.12)'
      } : undefined}
      onMouseLeave={notSet && clickPrompt ? (e) => {
        e.currentTarget.style.borderColor = 'var(--b)'
        e.currentTarget.style.boxShadow = 'none'
      } : undefined}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
        background: notSet ? 'var(--tx3)' : color, borderRadius: '12px 0 0 12px',
      }} />
      <div style={{
        fontSize: 10, fontWeight: 600, color: 'var(--tx3)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
      }}>
        {label}
      </div>
      {notSet ? (
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--tx3)' }}>Not set</div>
          {clickPrompt && (
            <div style={{ fontSize: 10, color: INDIGO, marginTop: 2 }}>Click to set</div>
          )}
        </div>
      ) : (
        <div style={{
          fontSize: 20, fontWeight: 700, color, fontFamily: 'var(--font-sora, inherit)',
          letterSpacing: '-0.02em',
        }}>
          {value}
        </div>
      )}
    </div>
  )

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: INDIGO }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>Cash Flow Statement</span>
        </div>
        <button
          onClick={() => onAsk('Analyze my cash flow and suggest improvements')}
          style={{
            padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
            background: `${INDIGO}14`, color: INDIGO, border: `1px solid ${INDIGO}30`,
            cursor: 'pointer', transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${INDIGO}24`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${INDIGO}14`)}
        >
          Ask AI
        </button>
      </div>

      {/* ── Cash Position Summary ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 4 }}>
        <PositionCard
          label="Cash Balance"
          value={fmt(cash.balance)}
          color={GREEN}
          notSet={cash.balance === 0}
          clickPrompt="Set my current cash balance. What is my starting cash on hand?"
        />
        <PositionCard
          label="Monthly Fixed Costs"
          value={fmt(cash.monthly_fixed)}
          color={RED}
          notSet={cash.monthly_fixed === 0}
          clickPrompt="Set my monthly fixed costs — rent, salaries, subscriptions, etc."
        />
        <PositionCard
          label={cash.daily_net_burn >= 0 ? 'Daily Net Gain' : 'Daily Net Burn'}
          value={fmt(cash.daily_net_burn)}
          color={cash.daily_net_burn >= 0 ? GREEN : RED}
        />
        <PositionCard
          label="Cash Runway"
          value={cash.runway_months != null ? `${cash.runway_months.toFixed(1)} mo` : '—'}
          color={runwayColor(cash.runway_status)}
        />
      </div>

      {/* ── Cash Flow Chart ── */}
      {renderChart()}

      {/* ── Cash Flow Statement Table ── */}
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 12 }}>
        <SectionHeader title="Operating Activities" />
        <Row label="Cash from Sales" value={fmt(totals.revenue)} color={GREEN} />
        <Row label="Cost of Goods Paid" value={fmt(-totals.cogs)} color={RED} />
        <Row label="Operating Expenses" value={fmt(-totals.fixed_costs)} color={RED} />
        <Row label="Net Operating Cash Flow" value={fmt(netOperating)} bold borderTop
          color={netOperating >= 0 ? GREEN : RED}
        />

        <SectionHeader title="Investing Activities" />
        <Row label="Inventory Purchases" italic note="Tracked via Inventory tab" />
        <Row label="Net Investing Cash Flow" value={fmt(0)} bold borderTop note="See Inventory" />

        <SectionHeader title="Financing & Receivables" />
        {receivablesSummary ? (
          <>
            <Row label="Accounts Receivable" value={fmt(receivablesSummary.total_receivables)} color={GREEN} />
            <Row label="Accounts Payable" value={fmt(-receivablesSummary.total_payables)} color={RED} />
            <Row label="Net Financing" value={fmt(netFinancing)} bold borderTop
              color={netFinancing >= 0 ? GREEN : RED}
            />
          </>
        ) : (
          <Row label="No receivables data" italic />
        )}

        {/* Net Cash Position */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 0 4px', marginTop: 12,
          borderTop: '2px solid var(--b)',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>NET CASH POSITION</span>
          <span style={{
            fontSize: 20, fontWeight: 700,
            color: netCashPosition >= 0 ? GREEN : RED,
            fontFamily: 'var(--font-sora, inherit)',
            letterSpacing: '-0.02em',
            padding: '2px 10px', borderRadius: 8,
            background: netCashPosition >= 0 ? `${GREEN}10` : `${RED}10`,
          }}>
            {fmt(netCashPosition)}
          </span>
        </div>
      </div>

      {/* ── Cash Flow Projection ── */}
      {renderProjection()}

      {/* ── Receivables Aging ── */}
      {renderAging()}
    </div>
  )
}
