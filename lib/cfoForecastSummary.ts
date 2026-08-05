// Lightweight, dependency-free summary of the CFO Forecasts tab's numbers,
// for use anywhere that needs the headline projection WITHOUT rendering the
// full CfoForecasts UI (currently: the consolidated CfoReportExport report).
//
// Deliberately mirrors — but does not import from — the per-render useMemo
// logic inside components/cfo/CfoForecasts.tsx (revForecast/pnlForecast/
// cashRunway/accuracyKpi). Kept as a SEPARATE small pure function rather than
// refactoring CfoForecasts.tsx itself, to avoid touching the live, working
// Forecasts tab UI. If the forecasting approach changes in one place, mirror
// the change here too — see the comment block in CfoForecasts.tsx pointing
// back at this file.
import { forecast } from '@/lib/forecast'

export interface PnlMonthRow {
  month: string
  revenue: number
  cogs: number
  fixed: number
  net: number
  gross_margin_pct: number
  net_margin_pct: number
}

// Only `balance` is actually read below — kept minimal (rather than mirroring
// every field on the shared snapshot's `cash` object) so any caller with just
// a balance can use this without an unrelated type mismatch.
export interface CashSummary {
  balance: number
  monthly_fixed?: number
  runway_months?: number | null
  runway_status?: string
  daily_net_burn?: number
}

export interface ForecastSummary {
  horizonMonths: number
  projectedRevenue: number | null
  projectedNetProfit: number | null
  cashRunwayMonths: number | null   // months until balance hits zero, given the forecast
  cashRunwayUnconfigured: boolean   // true when no cash balance has been entered
  cashRunwaySustainable: boolean    // true when cash never hits zero within the horizon
  accuracyLabel: string             // e.g. "82%" or "N/A"
  accuracySub: string               // method name, or reason for N/A
  completedMonths: number
}

/**
 * Computes the same headline numbers shown on the CFO Forecasts tab's KPI
 * row, from the shared /api/cfo/snapshot payload — no extra fetches.
 */
export function computeForecastSummary(
  pnlMonthly: PnlMonthRow[] | undefined,
  cash: CashSummary | undefined,
  horizonMonths: number = 6,
): ForecastSummary | null {
  if (!pnlMonthly || pnlMonthly.length === 0 || !cash) return null

  const currentMonth = new Date().toISOString().slice(0, 7)
  const completedMonths = pnlMonthly.filter(m => m.month < currentMonth)
  const currentPartial = pnlMonthly.find(m => m.month === currentMonth) ?? null
  const partialOffset = currentPartial ? 1 : 0

  if (completedMonths.length === 0) return null

  const revData = completedMonths.map(m => m.revenue)
  let revF
  try {
    revF = forecast(revData, horizonMonths + partialOffset, 'auto', 1.5)
  } catch {
    return null
  }

  const n = completedMonths.length
  const cogsRatios = completedMonths.filter(m => m.revenue > 0).map(m => m.cogs / m.revenue)
  const avgCogsRatio = cogsRatios.length ? cogsRatios.reduce((a, b) => a + b, 0) / cogsRatios.length : 0
  const recentFixed = completedMonths.slice(-3).map(m => m.fixed)
  const avgFixed = recentFixed.length ? recentFixed.reduce((a, b) => a + b, 0) / recentFixed.length : 0

  const futureMonths: { revenue: number; net: number }[] = []
  for (let i = 0; i < horizonMonths; i++) {
    const rev = Math.max(0, revF.predicted[n + partialOffset + i] || 0)
    const cog = Math.max(0, rev * avgCogsRatio)
    const fix = Math.max(0, avgFixed)
    futureMonths.push({ revenue: rev, net: rev - cog - fix })
  }

  const projectedRevenue = futureMonths.reduce((s, m) => s + m.revenue, 0)
  const projectedNetProfit = futureMonths.reduce((s, m) => s + m.net, 0)

  // Cash runway — mirrors CfoForecasts.tsx: balance <= 0 means "not configured",
  // not "insolvent today".
  let cashRunwayMonths: number | null = null
  let cashRunwayUnconfigured = false
  let cashRunwaySustainable = false
  if (cash.balance <= 0) {
    cashRunwayUnconfigured = true
  } else {
    let balance = cash.balance
    let zeroMonth = -1
    futureMonths.forEach((m, i) => {
      balance += m.net
      if (zeroMonth === -1 && balance <= 0) zeroMonth = i + 1 // +1: point 0 is "Now"
    })
    if (zeroMonth === -1) cashRunwaySustainable = true
    else cashRunwayMonths = zeroMonth
  }

  // Accuracy — only surface a held-out backtest, and only with >=6 months of
  // history (an in-sample fit on a handful of points is meaningless).
  let accuracyLabel: string
  let accuracySub: string
  if (completedMonths.length < 6) {
    accuracyLabel = 'N/A'
    accuracySub = 'Needs 6+ months of history'
  } else {
    const bt = revF.backtest
    const acc = bt ? Math.max(0, Math.min(100, 100 - bt.mape)) : revF.accuracy
    accuracyLabel = `${acc.toFixed(0)}%`
    accuracySub = revF.method
  }

  return {
    horizonMonths,
    projectedRevenue,
    projectedNetProfit,
    cashRunwayMonths,
    cashRunwayUnconfigured,
    cashRunwaySustainable,
    accuracyLabel,
    accuracySub,
    completedMonths: completedMonths.length,
  }
}
