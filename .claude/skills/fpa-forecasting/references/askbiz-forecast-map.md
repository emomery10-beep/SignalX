# AskBiz CFO Forecast Section — Code Map

Read this before touching the forecast section. It maps each widget to its data source and records
fixes already applied (July 2026) so you don't regress them.

## Files

| File | Role |
|---|---|
| `components/cfo/CfoForecasts.tsx` | The Forecasts tab UI + all client-side forecasting logic (KPI cards, revenue chart, cash-runway chart, P&L table, waterfall, pattern detection) |
| `lib/forecast/index.ts` | Forecasting engine: linear / moving-average / seasonal / exponential, auto-selection, backtest, anomaly + data-quality assessment |
| `app/api/cfo/snapshot/route.ts` | Server data source: pulls Supabase POS + ecommerce + `cfo_expenses` + overrides, returns `pnl_monthly`, `totals`, `cash`, etc. |
| `components/cfo/CfoDashboard.tsx` | Fetches `/api/cfo/snapshot?period=…` and renders `CfoForecasts` when `subTab === 'forecasts'` |
| `locales/en/cfo_forecasts_tab.json` | UI strings (fallback chain: locale → English → key) |

## Data flow

`CfoDashboard` → `fetch('/api/cfo/snapshot')` → `pnl_monthly[]` (per-month `{revenue, cogs, fixed, net,
margins}`), `totals`, `cash{balance, monthly_fixed, runway_months, …}` → props into `CfoForecasts` →
client-side `forecast()` calls extrapolate the monthly history.

Key server facts:
- `cashBalance` and `monthlyFixedCosts` come from a user **overrides** row (or query params), and
  **default to 0** when unset (`route.ts` ~L192-197). A 0 cash balance means "not entered."
- Monthly `fixed = monthlyFixedCosts + non-COGS tracked expenses`, applied to **every** month in the
  6-month window (`route.ts` ~L533) — including months with little/no revenue.
- `netProfit = grossProfit − fixedCostsForPeriod` (`route.ts` ~L279). Negative is legitimate when a
  configured overhead exceeds thin recorded gross profit.

## Widget → source

| Widget | Value | Source |
|---|---|---|
| Projected Revenue | `sum(pnlForecast.revenue)` | revenue regression over `completedMonths` |
| Projected Net Profit | `sum(pnlForecast.net)` | driver-based: `rev − rev×cogsRatio − avgFixed` |
| Cash Runway | month index where projected balance ≤ 0 | `cash.balance` + cumulative `pnlForecast.net` |
| Forecast Accuracy | backtested `100 − MAPE`, or N/A | `revForecast.backtest` (out-of-sample) |
| Revenue Forecast chart | actual + forecast + band + best/worst | `revForecast.predicted / upperBound / lowerBound` |

## Fixes applied (July 2026) — don't regress these

1. **Driver-based P&L.** `pnlForecast` no longer regresses COGS and fixed independently. It forecasts
   revenue, then `cogs = revenue × avg(cogs/revenue)` and `fixed = avg(last 3 months' fixed)`. This
   removed the "revenue up 600% but profit negative" incoherence. Keep the statement driver-based.
2. **Cash Runway unconfigured state.** When `cash.balance <= 0`, `cashRunway` returns
   `{unconfigured: true}` and the card shows "Not set / Add your cash balance" instead of a false
   "0 months." The cash chart hides in this state. Don't reintroduce the `findIndex(<=0)` on a 0 balance.
3. **Forecast Accuracy = backtest, not in-sample.** The card shows held-out backtest accuracy only when
   `completedMonths.length >= 6`; below that it shows "N/A — Need ≥6 months history." Never surface the
   in-sample `revForecast.accuracy` as the headline again (it's ~100% on tiny n).
4. **Off-by-one axis fix.** Forecast months anchor to the **last plotted actual** (the current partial
   month if present) via `partialOffset`, so the first forecast month is the one *after* it. Predictions
   are read at `predicted[n + partialOffset + i]` and the engine is asked for `months + partialOffset`
   horizon points. This killed the duplicate "Jul 26 / Jul 26" axis labels.
5. **Unified uncertainty.** Best/Worst chart lines now use the engine's `upperBound`/`lowerBound` (same
   basis as the shaded confidence band) instead of an unrelated CAGR ± multiplier. One coherent story.
6. **Limited-data warning.** Shows for `completedMonths.length < 6` (was `=== 1`) with the month count
   interpolated, so a 2-month forecast is still flagged as unreliable.

## Still open (good future work)

- **Near-term cash from AR/AP.** `snapshot` already computes `receivables_summary` (receivables,
  payables, overdue) but the runway ignores it. A Xero-style dated-document cash forecast for the
  ≤90-day window would be far more accurate than net-profit extrapolation.
- **Editable scenarios.** `ScenarioPlanner` exists but best/worst are still model bands, not
  user-editable assumption sets (price change, new hire, delayed payment) — the Fathom/Jirav pattern.
- **Forecast-vs-actual tracking.** `lib/forecast/index.ts` exports `checkDeviation()` but it's unused
  here. Persisting each period's forecast and grading it against actuals would give a *real* accuracy
  trend instead of a per-render backtest.
