// Pure, dependency-free financial-ratio helpers for the CFO "Full CFO Report"
// export (components/cfo/CfoReportExport.tsx). Each function DELIBERATELY
// MIRRORS — but does not import from — the equivalent live CFO tab, the same
// way lib/cfoForecastSummary.ts mirrors CfoForecasts.tsx: so the report can
// show the same numbers without risking a regression in the working,
// already-shipped tab UI. If the source tab's formula changes, mirror the
// change here too.
//
//   - computeWorkingCapital mirrors components/cfo/WorkingCapitalCycle.tsx
//   - computeBreakEven      mirrors components/cfo/DynamicBreakEven.tsx
//   - computeBalanceSheet   has no live-tab equivalent. It is deliberately a
//     CURRENT-position snapshot (cash + receivables + inventory at cost,
//     less payables + accrued tax), not ThreeWayForecast's 3-month-forward
//     projection — those answer different questions. AskBiz's schema has no
//     fixed-asset register, loan ledger, or paid-in-capital tracking, so
//     "net position" below is a residual/estimate, not full GAAP equity —
//     the report labels it as such rather than overstating precision.

export interface WorkingCapitalSummary {
  dio: number
  dso: number
  dpo: number
  ccc: number
  /** dailyRevenue * ccc — cash tied up in the operating cycle. 0 when ccc <= 0 (cycle is self-funding). */
  cashTiedUp: number
}

export function computeWorkingCapital(
  revenue: number,
  cogs: number,
  inventoryValue: number,
  receivablesTotal: number,
  payablesTotal: number,
): WorkingCapitalSummary {
  const dailyRevenue = revenue / 30
  const dailyCogs = cogs / 30
  const dio = dailyCogs > 0 ? Math.round(inventoryValue / dailyCogs) : 0
  const dso = dailyRevenue > 0 ? Math.round(receivablesTotal / dailyRevenue) : 0
  const dpo = dailyCogs > 0 ? Math.round(payablesTotal / dailyCogs) : 0
  const ccc = dio + dso - dpo
  const cashTiedUp = ccc > 0 ? dailyRevenue * ccc : 0
  return { dio, dso, dpo, ccc, cashTiedUp }
}

export interface BreakEvenSummary {
  breakEvenRevenue: number
  /** 0-100, capped at 100 even if revenue exceeds break-even */
  progressPct: number
  isProfitable: boolean
  safetyMarginPct: number
  daysToBreakEven: number | null
}

export function computeBreakEven(revenue: number, fixedCosts: number, grossMarginPct: number): BreakEvenSummary {
  const contributionMarginPct = grossMarginPct / 100
  const breakEvenRevenue = contributionMarginPct > 0 ? fixedCosts / contributionMarginPct : 0
  const rawProgressPct = breakEvenRevenue > 0 ? (revenue / breakEvenRevenue) * 100 : 0
  const isProfitable = revenue >= breakEvenRevenue && breakEvenRevenue > 0
  const safetyMarginPct = breakEvenRevenue > 0 ? ((revenue - breakEvenRevenue) / breakEvenRevenue) * 100 : 0
  const dailyRevenue = revenue / 30
  const daysToBreakEven = dailyRevenue > 0 ? Math.ceil(breakEvenRevenue / dailyRevenue) : null
  return {
    breakEvenRevenue,
    progressPct: Math.min(rawProgressPct, 100),
    isProfitable,
    safetyMarginPct,
    daysToBreakEven,
  }
}

export interface BalanceSheetSummary {
  cash: number
  receivables: number
  inventory: number
  totalAssets: number
  payables: number
  taxPayable: number
  totalLiabilities: number
  /** totalAssets - totalLiabilities. A residual estimate, NOT a full GAAP equity breakdown — see file header. */
  netPosition: number
}

export function computeBalanceSheet(
  cashBalance: number,
  receivablesTotal: number,
  inventoryValueAtCost: number,
  payablesTotal: number,
  taxPayable: number,
): BalanceSheetSummary {
  const totalAssets = cashBalance + receivablesTotal + inventoryValueAtCost
  const totalLiabilities = payablesTotal + taxPayable
  return {
    cash: cashBalance,
    receivables: receivablesTotal,
    inventory: inventoryValueAtCost,
    totalAssets,
    payables: payablesTotal,
    taxPayable,
    totalLiabilities,
    netPosition: totalAssets - totalLiabilities,
  }
}
