'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { forecast, ForecastResult } from '@/lib/forecast'
import ScenarioPlanner from './ScenarioPlanner'
import { useLang } from '@/components/LanguageProvider'

// ── Types ────────────────────────────────────────────────────
interface PnlMonth {
  month: string
  revenue: number
  cogs: number
  fixed: number
  net: number
  gross_margin_pct: number
  net_margin_pct: number
}

interface CashData {
  balance: number
  monthly_fixed: number
  runway_months: number | null
  runway_status: string
  daily_net_burn: number
}

interface DailyCashflow {
  date: string
  inflow: number
  outflow: number
  net: number
}

interface Props {
  pnlMonthly: PnlMonth[]
  totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
  cash: CashData
  dailyCashflow?: DailyCashflow[]
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

// ── Helpers ──────────────────────────────────────────────────
const HORIZONS = [
  { id: '1m', months: 1 },
  { id: '3m', months: 3 },
  { id: '6m', months: 6 },
  { id: '12m', months: 12 },
] as const

type HorizonId = typeof HORIZONS[number]['id']

const buildHorizons = (tc: (k: string, vars?: Record<string, string | number>) => string) => [
  { id: '1m' as const, label: tc('cfo_forecasts_tab.horizon_1m'), months: 1 },
  { id: '3m' as const, label: tc('cfo_forecasts_tab.horizon_3m'), months: 3 },
  { id: '6m' as const, label: tc('cfo_forecasts_tab.horizon_6m'), months: 6 },
  { id: '12m' as const, label: tc('cfo_forecasts_tab.horizon_12m'), months: 12 },
]

const COLOURS = {
  actual: '#6366F1',
  forecast: '#d08a59',
  best: '#22c55e',
  worst: '#ef4444',
  band: 'rgba(208,138,89,.12)',
  inflow: '#22c55e',
  outflow: '#ef4444',
  net: '#6366F1',
  gridLine: 'var(--b, #e8e6e1)',
  text: 'var(--tx, #1a1916)',
  textMuted: 'var(--tx3, #a39e97)',
}

function fmtMoney(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function fmtMonthLabel(m: string): string {
  try {
    const d = new Date(m + '-01')
    return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
  } catch { return m }
}

function futureMonthLabel(lastMonth: string, offset: number): string {
  try {
    const d = new Date(lastMonth + '-01')
    d.setMonth(d.getMonth() + offset)
    return d.toISOString().slice(0, 7)
  } catch { return `+${offset}` }
}

// ── Simple Canvas Chart Component ────────────────────────────
function LineChart({ data, width, height }: {
  data: { labels: string[]; series: { values: number[]; color: string; dash?: number[]; label: string }[]; band?: { upper: number[]; lower: number[]; color: string } }
  width: number
  height: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const padL = 56, padR = 16, padT = 16, padB = 32
    const chartW = width - padL - padR
    const chartH = height - padT - padB

    // Find min/max across all series
    const allVals = data.series.flatMap(s => s.values).concat(data.band?.upper || [], data.band?.lower || []).filter(v => v != null && isFinite(v))
    const minVal = Math.min(...allVals) * 0.9
    const maxVal = Math.max(...allVals) * 1.1
    const range = maxVal - minVal || 1

    const xStep = data.labels.length > 1 ? chartW / (data.labels.length - 1) : chartW
    const toX = (i: number) => padL + i * xStep
    const toY = (v: number) => padT + chartH - ((v - minVal) / range) * chartH

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Grid lines
    ctx.strokeStyle = COLOURS.gridLine
    ctx.lineWidth = 0.5
    const gridCount = 4
    for (let i = 0; i <= gridCount; i++) {
      const y = padT + (chartH / gridCount) * i
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(width - padR, y); ctx.stroke()
      const val = maxVal - (range / gridCount) * i
      ctx.fillStyle = COLOURS.textMuted
      ctx.font = '10px system-ui'
      ctx.textAlign = 'right'
      ctx.fillText(fmtMoney(val, ''), padL - 6, y + 3)
    }

    // X labels
    ctx.fillStyle = COLOURS.textMuted
    ctx.font = '10px system-ui'
    ctx.textAlign = 'center'
    const labelSkip = Math.max(1, Math.ceil(data.labels.length / 8))
    data.labels.forEach((label, i) => {
      if (i % labelSkip === 0) ctx.fillText(fmtMonthLabel(label), toX(i), height - 6)
    })

    // Confidence band
    if (data.band) {
      ctx.fillStyle = data.band.color
      ctx.beginPath()
      data.band.upper.forEach((v, i) => {
        const x = toX(i), y = toY(v)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      for (let i = data.band.lower.length - 1; i >= 0; i--) {
        ctx.lineTo(toX(i), toY(data.band.lower[i]))
      }
      ctx.closePath()
      ctx.fill()
    }

    // Draw series lines
    data.series.forEach(s => {
      ctx.strokeStyle = s.color
      ctx.lineWidth = 2
      ctx.setLineDash(s.dash || [])
      ctx.beginPath()
      let started = false
      s.values.forEach((v, i) => {
        if (v == null || !isFinite(v)) return
        const x = toX(i), y = toY(v)
        if (!started) { ctx.moveTo(x, y); started = true }
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.setLineDash([])
    })

    // Dots on actual data points
    const actualSeries = data.series[0]
    if (actualSeries) {
      ctx.fillStyle = actualSeries.color
      actualSeries.values.forEach((v, i) => {
        if (v == null || !isFinite(v)) return
        ctx.beginPath()
        ctx.arc(toX(i), toY(v), 3, 0, Math.PI * 2)
        ctx.fill()
      })
    }
  }, [data, width, height])

  return <canvas ref={canvasRef} style={{ width: '100%', maxWidth: width, display: 'block' }} />
}

// ── Waterfall Chart ──────────────────────────────────────────
function WaterfallChart({ items, width, height, sym }: {
  items: { label: string; value: number; type: 'start' | 'add' | 'subtract' | 'total' }[]
  width: number; height: number; sym: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const padL = 56, padR = 16, padT = 16, padB = 44
    const chartW = width - padL - padR
    const chartH = height - padT - padB
    const barW = Math.min(48, (chartW / items.length) * 0.6)
    const gap = (chartW - barW * items.length) / (items.length + 1)

    // Compute running totals
    const totals: number[] = []
    let running = 0
    items.forEach(item => {
      if (item.type === 'start' || item.type === 'total') {
        running = item.value
      } else {
        running += item.value
      }
      totals.push(running)
    })

    const allVals = totals.concat(items.map(i => i.value))
    const maxVal = Math.max(...allVals) * 1.15
    const minVal = Math.min(0, ...allVals) * 1.1
    const range = maxVal - minVal || 1
    const toY = (v: number) => padT + chartH - ((v - minVal) / range) * chartH

    ctx.clearRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = COLOURS.gridLine
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(width - padR, y); ctx.stroke()
      const val = maxVal - (range / 4) * i
      ctx.fillStyle = COLOURS.textMuted; ctx.font = '10px system-ui'; ctx.textAlign = 'right'
      ctx.fillText(fmtMoney(val, sym), padL - 6, y + 3)
    }

    // Zero line
    const zeroY = toY(0)
    ctx.strokeStyle = COLOURS.textMuted; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(padL, zeroY); ctx.lineTo(width - padR, zeroY); ctx.stroke()

    // Bars
    let prevTop = 0
    items.forEach((item, i) => {
      const x = padL + gap + i * (barW + gap)
      let barTop: number, barBottom: number, color: string

      if (item.type === 'start' || item.type === 'total') {
        barTop = toY(item.value)
        barBottom = toY(0)
        color = item.type === 'total' ? COLOURS.net : COLOURS.actual
      } else {
        const base = i > 0 ? totals[i - 1] : 0
        if (item.value >= 0) {
          barTop = toY(base + item.value)
          barBottom = toY(base)
          color = COLOURS.inflow
        } else {
          barTop = toY(base)
          barBottom = toY(base + item.value)
          color = COLOURS.outflow
        }
      }

      // Connector line from previous bar
      if (i > 0 && item.type !== 'total') {
        ctx.strokeStyle = COLOURS.textMuted; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3])
        const prevX = padL + gap + (i - 1) * (barW + gap) + barW
        ctx.beginPath(); ctx.moveTo(prevX, toY(totals[i - 1])); ctx.lineTo(x, toY(totals[i - 1])); ctx.stroke()
        ctx.setLineDash([])
      }

      ctx.fillStyle = color
      const barH = Math.abs(barBottom - barTop)
      ctx.beginPath()
      ctx.roundRect(x, Math.min(barTop, barBottom), barW, Math.max(barH, 1), 3)
      ctx.fill()

      // Value label
      ctx.fillStyle = COLOURS.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center'
      const labelY = Math.min(barTop, barBottom) - 6
      ctx.fillText(fmtMoney(item.value, sym), x + barW / 2, labelY)

      // X label
      ctx.fillStyle = COLOURS.textMuted; ctx.font = '9px system-ui'
      ctx.save(); ctx.translate(x + barW / 2, height - 4); ctx.rotate(-0.3)
      ctx.fillText(item.label, 0, 0); ctx.restore()

      prevTop = toY(totals[i])
    })
  }, [items, width, height, sym])

  return <canvas ref={canvasRef} style={{ width: '100%', maxWidth: width, display: 'block' }} />
}

// ── Main Component ───────────────────────────────────────────
export default function CfoForecasts({ pnlMonthly, totals, cash, dailyCashflow, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const horizons = buildHorizons(tc)
  const [horizon, setHorizon] = useState<HorizonId>('3m')
  const months = HORIZONS.find(h => h.id === horizon)!.months

  // Exclude the current (incomplete) month from regression inputs so a
  // partial month (e.g. 5 days of June) doesn't tank the trend line to zero.
  // We still show it in the P&L table marked as "partial".
  const currentMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
  const completedMonths = useMemo(
    () => (pnlMonthly || []).filter(m => m.month < currentMonth),
    [pnlMonthly, currentMonth]
  )
  const currentPartial = useMemo(
    () => (pnlMonthly || []).find(m => m.month === currentMonth) ?? null,
    [pnlMonthly, currentMonth]
  )

  // ── Revenue Forecast ─────────────────────────────────────
  const revForecast = useMemo(() => {
    if (completedMonths.length === 0) return null
    const revenueData = completedMonths.map(m => m.revenue)
    try {
      return forecast(revenueData, months, 'auto', 1.5)
    } catch { return null }
  }, [completedMonths, months])

  // ── P&L Forecast (all lines) ──────────────────────────────
  const pnlForecast = useMemo(() => {
    if (completedMonths.length === 0) return null
    const revData = completedMonths.map(m => m.revenue)
    const cogsData = completedMonths.map(m => m.cogs)
    const fixedData = completedMonths.map(m => m.fixed)
    try {
      const revF = forecast(revData, months, 'auto')
      const cogsF = forecast(cogsData, months, 'auto')
      const fixedF = forecast(fixedData, months, 'auto')

      const n = completedMonths.length
      const futureMonths: PnlMonth[] = []
      for (let i = 0; i < months; i++) {
        const rev = Math.max(0, revF.predicted[n + i] || 0)
        const cog = Math.max(0, cogsF.predicted[n + i] || 0)
        const fix = Math.max(0, fixedF.predicted[n + i] || 0)
        const net = rev - cog - fix
        const grossMargin = rev > 0 ? ((rev - cog) / rev) * 100 : 0
        const netMargin = rev > 0 ? (net / rev) * 100 : 0
        futureMonths.push({
          month: futureMonthLabel(completedMonths[n - 1].month, i + 1),
          revenue: rev, cogs: cog, fixed: fix, net,
          gross_margin_pct: grossMargin, net_margin_pct: netMargin,
        })
      }
      return futureMonths
    } catch { return null }
  }, [completedMonths, months])

  // ── Cash Runway Projection ────────────────────────────────
  const cashRunway = useMemo(() => {
    if (!cash || !pnlForecast) return null
    let balance = cash.balance
    const points: { month: string; balance: number }[] = [
      { month: 'Now', balance },
    ]
    for (const m of pnlForecast) {
      balance += m.net
      points.push({ month: fmtMonthLabel(m.month), balance })
    }
    const zeroMonth = points.findIndex(p => p.balance <= 0)
    return { points, zeroMonth }
  }, [cash, pnlForecast])

  // ── Cash Flow Waterfall (current month) ───────────────────
  const waterfall = useMemo(() => {
    if (!totals || !cash) return null
    const items: { label: string; value: number; type: 'start' | 'add' | 'subtract' | 'total' }[] = [
      { label: tc('cfo_forecasts_tab.waterfall_starting_cash'), value: cash.balance, type: 'start' },
      { label: tc('cfo_forecasts_tab.waterfall_revenue'), value: totals.revenue, type: 'add' },
      { label: tc('cfo_forecasts_tab.waterfall_cogs'), value: -totals.cogs, type: 'subtract' },
      { label: tc('cfo_forecasts_tab.waterfall_fixed_costs'), value: -totals.fixed_costs, type: 'subtract' },
      { label: tc('cfo_forecasts_tab.waterfall_ending_cash'), value: cash.balance + totals.net_profit, type: 'total' },
    ]
    return items
  }, [totals, cash, tc])

  // ── Chart data for Revenue Forecast ────────────────────────
  const revChartData = useMemo(() => {
    if (!revForecast || completedMonths.length === 0) return null
    const n = completedMonths.length
    // Include current partial month in chart labels/actuals (but NOT in regression)
    const allActual = currentPartial ? [...completedMonths, currentPartial] : completedMonths
    const allLabels = [
      ...allActual.map(m => m.month),
      ...Array.from({ length: months }, (_, i) => futureMonthLabel(completedMonths[n - 1].month, i + 1)),
    ]
    const actualValues = [...allActual.map(m => m.revenue), ...Array(months).fill(null)]
    const forecastOffset = allActual.length
    const forecastValues: (number | null)[] = Array(forecastOffset).fill(null)
    // Connect forecast line from the last completed month
    forecastValues[n - 1] = completedMonths[n - 1].revenue
    for (let i = 0; i < months; i++) {
      forecastValues.push(Math.max(0, revForecast.predicted[n + i] || 0))
    }

    // Scenarios based on completed months trend
    const lastRev = completedMonths[n - 1].revenue
    const baseGrowth = n > 1 ? (completedMonths[n - 1].revenue / completedMonths[0].revenue) ** (1 / (n - 1)) - 1 : 0
    const bestValues: (number | null)[] = [...Array(forecastOffset).fill(null) as null[]]
    const worstValues: (number | null)[] = [...Array(forecastOffset).fill(null) as null[]]
    bestValues[n - 1] = lastRev
    worstValues[n - 1] = lastRev
    for (let i = 0; i < months; i++) {
      bestValues.push(Math.max(0, lastRev * (1 + baseGrowth * 1.5) ** (i + 1)))
      worstValues.push(Math.max(0, lastRev * Math.max(0.5, (1 + baseGrowth * 0.3)) ** (i + 1)))
    }

    // Confidence band
    const fullBandUpper: (number | null)[] = [...Array(forecastOffset).fill(null)]
    const fullBandLower: (number | null)[] = [...Array(forecastOffset).fill(null)]
    for (let i = 0; i < months; i++) {
      fullBandUpper.push(Math.max(0, revForecast.upperBound[n + i] ?? revForecast.predicted[n + i] ?? 0))
      fullBandLower.push(Math.max(0, revForecast.lowerBound[n + i] ?? revForecast.predicted[n + i] ?? 0))
    }

    return {
      labels: allLabels,
      series: [
        { values: actualValues, color: COLOURS.actual, label: 'Actual' },
        { values: forecastValues, color: COLOURS.forecast, dash: [6, 4], label: 'Forecast' },
        { values: bestValues, color: COLOURS.best, dash: [3, 3], label: 'Best Case' },
        { values: worstValues, color: COLOURS.worst, dash: [3, 3], label: 'Worst Case' },
      ],
      band: {
        upper: allLabels.map((_, i) => i < forecastOffset ? (actualValues[i] ?? 0) : (fullBandUpper[i] ?? 0)),
        lower: allLabels.map((_, i) => i < forecastOffset ? (actualValues[i] ?? 0) : (fullBandLower[i] ?? 0)),
        color: COLOURS.band,
      },
    }
  }, [revForecast, completedMonths, currentPartial, months])

  // ── Cash Runway Chart Data ─────────────────────────────────
  const cashChartData = useMemo(() => {
    if (!cashRunway) return null
    return {
      labels: cashRunway.points.map(p => p.month),
      series: [
        { values: cashRunway.points.map(p => p.balance), color: COLOURS.actual, label: 'Cash Balance' },
        { values: cashRunway.points.map(() => 0), color: COLOURS.worst, dash: [4, 4], label: 'Zero Line' },
      ],
    }
  }, [cashRunway])

  // ── No data state — block only when zero completed months ────
  if (completedMonths.length === 0) {
    const hasCurrentOnly = currentPartial !== null
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)', fontSize: 11 }}>
        <div style={{ fontSize: 30, marginBottom: 12 }}>📊</div>
        <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--tx)' }}>{tc('cfo_forecasts_tab.no_data_title')}</div>
        <div>
          {hasCurrentOnly
            ? tc('cfo_forecasts_tab.no_data_current_only')
            : tc('cfo_forecasts_tab.no_data_none')}
        </div>
      </div>
    )
  }

  const runwayMonths = cashRunway?.zeroMonth === -1 ? null : cashRunway?.zeroMonth
  const runwayColor = runwayMonths != null ? (runwayMonths <= 3 ? '#ef4444' : runwayMonths <= 6 ? '#f59e0b' : '#22c55e') : '#22c55e'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Limited data warning ─── */}
      {completedMonths.length === 1 && (
        <div style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', fontSize: 9, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⚠️</span>
          <span>{tc('cfo_forecasts_tab.limited_data_warning')}</span>
        </div>
      )}

      {/* ── Horizon selector ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600, marginRight: 4 }}>{tc('cfo_forecasts_tab.horizon_label')}</span>
        {horizons.map(h => (
          <button
            key={h.id}
            onClick={() => setHorizon(h.id)}
            style={{
              padding: '4px 12px', borderRadius: 6, border: 'none', fontSize: 9, fontWeight: 600,
              background: horizon === h.id ? 'rgba(99,102,241,.12)' : 'transparent',
              color: horizon === h.id ? '#6366F1' : 'var(--tx3)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* ── KPI Summary Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          {
            label: tc('cfo_forecasts_tab.kpi_projected_revenue'),
            value: pnlForecast ? fmtMoney(pnlForecast.reduce((s, m) => s + m.revenue, 0), sym) : '-',
            sub: tc('cfo_forecasts_tab.kpi_next_months', { n: months }),
            color: '#6366F1',
          },
          {
            label: tc('cfo_forecasts_tab.kpi_projected_net_profit'),
            value: pnlForecast ? fmtMoney(pnlForecast.reduce((s, m) => s + m.net, 0), sym) : '-',
            sub: tc('cfo_forecasts_tab.kpi_next_months', { n: months }),
            color: pnlForecast && pnlForecast.reduce((s, m) => s + m.net, 0) >= 0 ? '#22c55e' : '#ef4444',
          },
          {
            label: tc('cfo_forecasts_tab.kpi_cash_runway'),
            value: runwayMonths != null ? tc('cfo_forecasts_tab.kpi_runway_value', { n: runwayMonths }) : tc('cfo_forecasts_tab.kpi_runway_sustainable'),
            sub: runwayMonths != null ? tc('cfo_forecasts_tab.kpi_runway_until_zero') : tc('cfo_forecasts_tab.kpi_runway_cash_positive'),
            color: runwayColor,
          },
          {
            label: tc('cfo_forecasts_tab.kpi_forecast_accuracy'),
            value: revForecast ? `${revForecast.accuracy.toFixed(0)}%` : '-',
            sub: revForecast ? revForecast.method : tc('cfo_forecasts_tab.kpi_accuracy_na'),
            color: '#d08a59',
          },
        ].map((kpi, i) => (
          <div key={i} style={{ background: 'var(--sf, #fff)', border: '1px solid var(--b, #e8e6e1)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: kpi.color, fontFamily: 'var(--font-sora)', letterSpacing: '-.02em' }}>{kpi.value}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Revenue Forecast Chart ─── */}
      {revChartData && (
        <div style={{ background: 'var(--sf, #fff)', border: '1px solid var(--b, #e8e6e1)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_forecasts_tab.revenue_forecast_title')}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_forecasts_tab.revenue_forecast_sub')}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 9 }}>
              {[
                { color: COLOURS.actual, label: tc('cfo_forecasts_tab.legend_actual'), dash: false },
                { color: COLOURS.forecast, label: tc('cfo_forecasts_tab.legend_forecast'), dash: true },
                { color: COLOURS.best, label: tc('cfo_forecasts_tab.legend_best'), dash: true },
                { color: COLOURS.worst, label: tc('cfo_forecasts_tab.legend_worst'), dash: true },
              ].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--tx3)' }}>
                  <span style={{ width: 16, height: 2, background: l.color, display: 'inline-block', borderRadius: 1, ...(l.dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${l.color} 0 4px, transparent 4px 8px)`, background: 'none' } : {}) }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <LineChart data={revChartData} width={700} height={260} />
          {revForecast?.summary && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(99,102,241,.04)', borderRadius: 8, fontSize: 9, color: 'var(--tx2)', lineHeight: 1.6 }}>
              {revForecast.summary}
            </div>
          )}
        </div>
      )}

      {/* ── Cash Runway Chart ─── */}
      {cashChartData && (
        <div style={{ background: 'var(--sf, #fff)', border: '1px solid var(--b, #e8e6e1)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_forecasts_tab.cash_runway_title')}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                {tc('cfo_forecasts_tab.cash_runway_sub')}
                {runwayMonths != null && (
                  <span style={{ color: runwayColor, fontWeight: 600 }}>{tc('cfo_forecasts_tab.cash_runway_until_zero', { n: runwayMonths })}</span>
                )}
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: runwayColor, fontFamily: 'var(--font-sora)' }}>
              {fmtMoney(cash.balance, sym)}
            </div>
          </div>
          <LineChart data={cashChartData} width={700} height={200} />
        </div>
      )}

      {/* ── P&L Forecast Table ─── */}
      {pnlForecast && (
        <div style={{ background: 'var(--sf, #fff)', border: '1px solid var(--b, #e8e6e1)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_forecasts_tab.pnl_forecast_title')}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_forecasts_tab.pnl_forecast_sub', { n: months })}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--b, #e8e6e1)' }}>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9 }}>{tc('cfo_forecasts_tab.table_line_item')}</th>
                {/* Last 2 completed months + current partial */}
                {completedMonths.slice(-2).map(m => (
                  <th key={m.month} style={{ textAlign: 'right', padding: '6px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9 }}>
                    {fmtMonthLabel(m.month)}
                    <div style={{ fontSize: 8, color: '#6366F1', fontWeight: 400 }}>{tc('cfo_forecasts_tab.table_tag_actual')}</div>
                  </th>
                ))}
                {currentPartial && (
                  <th style={{ textAlign: 'right', padding: '6px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9 }}>
                    {fmtMonthLabel(currentPartial.month)}
                    <div style={{ fontSize: 8, color: '#f59e0b', fontWeight: 400 }}>{tc('cfo_forecasts_tab.table_tag_partial')}</div>
                  </th>
                )}
                {/* Forecast months */}
                {pnlForecast.map(m => (
                  <th key={m.month} style={{ textAlign: 'right', padding: '6px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9 }}>
                    {fmtMonthLabel(m.month)}
                    <div style={{ fontSize: 8, color: '#d08a59', fontWeight: 400 }}>{tc('cfo_forecasts_tab.table_tag_forecast')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: tc('cfo_forecasts_tab.row_revenue'), key: 'revenue' as keyof PnlMonth, bold: false },
                { label: tc('cfo_forecasts_tab.row_cogs'), key: 'cogs' as keyof PnlMonth, bold: false },
                { label: tc('cfo_forecasts_tab.row_gross_profit'), key: 'gross_profit' as const, bold: true },
                { label: tc('cfo_forecasts_tab.row_fixed_costs'), key: 'fixed' as keyof PnlMonth, bold: false },
                { label: tc('cfo_forecasts_tab.row_net_profit'), key: 'net' as keyof PnlMonth, bold: true },
              ].map(row => (
                <tr key={row.key} style={{ borderBottom: '1px solid var(--b, #e8e6e1)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: row.bold ? 700 : 400, color: 'var(--tx)' }}>{row.label}</td>
                  {completedMonths.slice(-2).map(m => {
                    const val = row.key === 'gross_profit' ? m.revenue - m.cogs : (m[row.key] as number)
                    return (
                      <td key={m.month} style={{ textAlign: 'right', padding: '8px 10px', fontWeight: row.bold ? 700 : 400, color: 'var(--tx)' }}>
                        {fmtMoney(val, sym)}
                      </td>
                    )
                  })}
                  {currentPartial && (() => {
                    const val = row.key === 'gross_profit' ? currentPartial.revenue - currentPartial.cogs : (currentPartial[row.key] as number)
                    return (
                      <td style={{ textAlign: 'right', padding: '8px 10px', fontWeight: row.bold ? 700 : 400, color: 'var(--tx)', opacity: 0.6 }}>
                        {fmtMoney(val, sym)}
                      </td>
                    )
                  })()}
                  {pnlForecast.map(m => {
                    const val = row.key === 'gross_profit' ? m.revenue - m.cogs : (m[row.key] as number)
                    const isNeg = val < 0
                    return (
                      <td key={m.month} style={{ textAlign: 'right', padding: '8px 10px', fontWeight: row.bold ? 700 : 400, color: isNeg ? '#ef4444' : 'var(--tx)', background: 'rgba(208,138,89,.03)' }}>
                        {fmtMoney(val, sym)}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {/* Margin row */}
              <tr>
                <td style={{ padding: '8px 10px', fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_forecasts_tab.row_net_margin')}</td>
                {completedMonths.slice(-2).map(m => (
                  <td key={m.month} style={{ textAlign: 'right', padding: '8px 10px', fontSize: 9, color: 'var(--tx3)' }}>
                    {m.net_margin_pct.toFixed(1)}%
                  </td>
                ))}
                {currentPartial && (
                  <td style={{ textAlign: 'right', padding: '8px 10px', fontSize: 9, color: 'var(--tx3)', opacity: 0.6 }}>
                    {currentPartial.net_margin_pct.toFixed(1)}%
                  </td>
                )}
                {pnlForecast.map(m => (
                  <td key={m.month} style={{ textAlign: 'right', padding: '8px 10px', fontSize: 9, color: m.net_margin_pct < 0 ? '#ef4444' : 'var(--tx3)', background: 'rgba(208,138,89,.03)' }}>
                    {m.net_margin_pct.toFixed(1)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Cash Flow Waterfall ─── */}
      {waterfall && (
        <div style={{ background: 'var(--sf, #fff)', border: '1px solid var(--b, #e8e6e1)', borderRadius: 12, padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_forecasts_tab.waterfall_title')}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_forecasts_tab.waterfall_sub')}</div>
          </div>
          <WaterfallChart items={waterfall} width={700} height={240} sym={sym} />
        </div>
      )}

      {/* ── AI Pattern Detection ─── */}
      {completedMonths.length >= 3 && (() => {
        const revs = completedMonths.map(m => m.revenue)
        const n = revs.length

        // Detect patterns
        const patterns: Array<{ icon: string; label: string; detail: string; color: string }> = []

        // Growth trend
        const firstHalf = revs.slice(0, Math.floor(n / 2))
        const secondHalf = revs.slice(Math.floor(n / 2))
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
        const growthPct = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0
        if (growthPct > 10) patterns.push({ icon: '📈', label: tc('cfo_forecasts_tab.pattern_upward_label'), detail: tc('cfo_forecasts_tab.pattern_upward_detail', { n: growthPct.toFixed(0) }), color: '#22c55e' })
        else if (growthPct < -10) patterns.push({ icon: '📉', label: tc('cfo_forecasts_tab.pattern_declining_label'), detail: tc('cfo_forecasts_tab.pattern_declining_detail', { n: Math.abs(growthPct).toFixed(0) }), color: '#ef4444' })
        else patterns.push({ icon: '➡️', label: tc('cfo_forecasts_tab.pattern_stable_label'), detail: tc('cfo_forecasts_tab.pattern_stable_detail'), color: '#f59e0b' })

        // Seasonality (if enough months)
        if (n >= 6) {
          const avg = revs.reduce((a, b) => a + b, 0) / n
          const peaks = revs.filter(r => r > avg * 1.2).length
          const troughs = revs.filter(r => r < avg * 0.8).length
          if (peaks >= 2 && troughs >= 1) {
            const seasonalKey = peaks === 1 && troughs === 1
              ? 'cfo_forecasts_tab.pattern_seasonal_detail_one_each'
              : peaks === 1
              ? 'cfo_forecasts_tab.pattern_seasonal_detail_one_peak'
              : troughs === 1
              ? 'cfo_forecasts_tab.pattern_seasonal_detail_one_trough'
              : 'cfo_forecasts_tab.pattern_seasonal_detail'
            patterns.push({ icon: '🔄', label: tc('cfo_forecasts_tab.pattern_seasonal_label'), detail: tc(seasonalKey, { peaks, troughs }), color: '#6366F1' })
          }
        }

        // Margin compression
        const margins = completedMonths.map(m => m.gross_margin_pct)
        if (margins.length >= 3) {
          const marginStart = margins.slice(0, 2).reduce((a, b) => a + b, 0) / 2
          const marginEnd = margins.slice(-2).reduce((a, b) => a + b, 0) / 2
          if (marginEnd < marginStart - 3) {
            patterns.push({ icon: '⚠️', label: tc('cfo_forecasts_tab.pattern_compression_label'), detail: tc('cfo_forecasts_tab.pattern_compression_detail', { start: marginStart.toFixed(1), end: marginEnd.toFixed(1) }), color: '#ef4444' })
          } else if (marginEnd > marginStart + 3) {
            patterns.push({ icon: '✅', label: tc('cfo_forecasts_tab.pattern_expansion_label'), detail: tc('cfo_forecasts_tab.pattern_expansion_detail', { start: marginStart.toFixed(1), end: marginEnd.toFixed(1) }), color: '#22c55e' })
          }
        }

        // Volatility
        const avg = revs.reduce((a, b) => a + b, 0) / n
        const cv = avg > 0 ? Math.sqrt(revs.reduce((s, r) => s + Math.pow(r - avg, 2), 0) / n) / avg : 0
        if (cv > 0.3) patterns.push({ icon: '🎢', label: tc('cfo_forecasts_tab.pattern_volatility_label'), detail: tc('cfo_forecasts_tab.pattern_volatility_detail', { n: (cv * 100).toFixed(0) }), color: '#f59e0b' })

        if (patterns.length === 0) return null

        return (
          <div style={{ background: 'var(--sf, #fff)', border: '1px solid var(--b, #e8e6e1)', borderRadius: 12, padding: 16 }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_forecasts_tab.pattern_title')}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_forecasts_tab.pattern_sub')}</div>
              </div>
              {onAsk && (
                <button onClick={() => onAsk(tc('cfo_forecasts_tab.ask_ai_prompt', { summary: patterns.map(p => `${p.label}: ${p.detail}`).join('. ') }))}
                  style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', flexShrink: 0 }}>
                  {tc('cfo_forecasts_tab.ask_ai')}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patterns.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, border: `1px solid ${p.color}20`, background: `${p.color}06` }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>{p.label}</div>
                    <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.4 }}>{p.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* ── Scenario Planner (existing) ─── */}
      <div style={{ borderTop: '1px solid var(--b, #e8e6e1)', paddingTop: 16 }}>
        <ScenarioPlanner
          baseRevenue={totals.revenue}
          baseCogs={totals.cogs}
          baseFixed={totals.fixed_costs}
          cashBalance={cash.balance}
          currencySymbol={sym}
        />
      </div>
    </div>
  )
}
