---
name: fpa-forecasting
description: >-
  Financial forecasting and FP&A domain knowledge for building, reviewing, or debugging
  revenue/profit/cash-flow forecasts, projections, runway, and scenario planning — especially
  AskBiz's CFO "Forecasts" section (components/cfo/CfoForecasts.tsx, lib/forecast, /api/cfo/snapshot).
  Use this whenever the task touches forecasting, projected revenue or profit, cash runway, burn
  rate, forecast accuracy, confidence bands, best/worst scenarios, P&L projection, driver-based
  models, or "why is this number negative/wrong", even if the user doesn't say the word "forecast".
  It encodes how real accounting products (Xero, Fathom, Jirav) build forecasts so AskBiz's match
  professional expectations. Reach for it before touching any forecast math or forecast UI.
---

# FP&A & Financial Forecasting

This skill gives you the accounting judgment to build and critique financial forecasts the way
professional FP&A tools (Xero, Fathom, Jirav) do — and to spot the specific ways naive statistical
forecasts mislead small-business owners. It is grounded in AskBiz's CFO Forecasts section; a
concrete map of that code is in `references/askbiz-forecast-map.md`.

## The core mental model: forecasts are *models*, not *trend lines*

A trustworthy financial forecast is a small causal model, not a regression fitted to each metric
separately. The single most common mistake — and the root of most "the numbers look insane" bugs — is
forecasting revenue, COGS, and fixed costs as three independent trends and then subtracting them.
Do that and you get contradictions: revenue projected up 600% while "profit" is negative, because
three separate curves disagreed. Real models are **driver-based**:

1. **Forecast the driver** (usually revenue, or units × price).
2. **Derive dependent lines from it.** COGS = a % of revenue (the gross-margin assumption). Variable
   costs scale with volume. Fixed costs are a *schedule* (rent, salaries, subscriptions) that does
   **not** move with revenue.
3. **Net is computed, never fitted.** `net = revenue − (revenue × cogs_ratio) − fixed`. Because every
   line traces back to one driver, the statement is internally consistent by construction.

This is what Fathom and Jirav mean by "driver-based 3-way forecasting": the P&L, balance sheet, and
cash flow stay linked because they share drivers. When you build or fix a forecast, prefer this shape.

## Why "projected profit is negative" — the diagnostic checklist

Negative projected profit is usually *arithmetically correct but economically misleading*. Work
through these in order:

- **Are the lines forecast independently?** If COGS and fixed are separate regressions rather than
  derived from revenue, the net is meaningless. Fix by making COGS a % of forecast revenue and fixed
  a run-rate. (This was AskBiz's exact bug — see the map.)
- **Are fixed costs applied to months with little/no revenue?** A configured monthly overhead (rent,
  salaries) gets charged every month, including near-empty early months. Those months are structurally
  loss-making, and a trend line carries the loss forward. Real cause = *thin history*, not a doomed
  business.
- **How many data points?** With 2–3 months you can't separate signal from noise. Say so loudly.
- **Is the overhead assumption real?** A user who typed a big monthly fixed cost but has recorded only
  a few sales will always show a loss. Surface the assumption, don't just render the red number.

The honest output is not "you will lose KSh 240K" — it's "on your current 2 months of data and your
configured overhead, this extrapolates to a loss; here's the assumption driving it."

## In-sample fit is not accuracy

The most dangerous vanity metric in forecasting: reporting how well a curve fits the data it was
*trained on*. A straight line through 2 points fits perfectly (R² = 1.0, MAPE = 0), so an "accuracy"
built from in-sample error reads ~100% precisely when the forecast is least trustworthy.

- **Only trust held-out (backtested) accuracy**: hide the last k periods, forecast them, compare to
  what actually happened. That is out-of-sample error — the only kind that predicts real performance.
- Backtesting needs enough history (roughly ≥6 periods to hold out a meaningful test). Below that,
  show **"N/A — need more history"**, never a number.
- Better still, track *forecast-vs-actual variance over time* each period (Xero/Fathom do this). A
  forecast that's never checked against reality is decoration.

## Cash flow & runway: dated documents beat trend extrapolation

Xero's short-term cash forecast is the gold standard for the near term and it uses **no statistics**:
`closing balance = opening bank balance + invoices due in the window − bills due in the window`. It
walks actual dated receivables and payables. For anything inside ~90 days, this is far more accurate
than extrapolating a net-profit trend.

When building or reviewing runway/cash widgets:

- **Prefer AR/AP-driven cash forecasts** for the near term; use statistical projection only for the
  longer horizon where no dated documents exist.
- **Runway = cash balance ÷ net burn rate** (per month). Only meaningful when the business is burning
  (net negative) *and* you actually have a cash balance.
- **Guard the "no cash balance" case.** A balance of 0 almost always means *not entered*, not
  *insolvent today*. Showing "0 months until cash runs out" for an unconfigured balance is a bug — show
  a "set your cash balance" prompt instead. Distinguish three states: unconfigured, burning (finite
  runway), profitable/sustainable.

## Uncertainty: one coherent story

If a chart shows a confidence band *and* best/worst lines, they must come from the same model.
Deriving the band from residual standard deviation while deriving best/worst from an unrelated CAGR
multiplier tells two contradictory uncertainty stories on one picture. Pick one basis (residual-based
prediction interval is the defensible default) and use it for band and scenario lines alike. Reserve
"scenarios" for genuinely *different assumptions* the user can change (Fathom-style: a price rise, a
new hire, a delayed payment), not cosmetic ± bands.

## Thin-data honesty

Small-business data is short and spiky. The engine can always *produce* a forecast; your job is to
gate trust:

- **< ~6 completed periods**: warn prominently, force plain linear (fancy methods overfit), and cap or
  caveat headline growth figures. A "+621% next month" badge off 2 points is a credibility hole.
- **Exclude the current partial period from the fit** (5 days of a month isn't a month) but show it as
  a partial actual — and make sure the first *forecast* period is the one *after* the partial month, or
  you get duplicate axis labels and "forecast" a month already underway.
- Detect and flag outliers, zero-heavy series, and high volatility — they widen real confidence.

## How professional tools frame it (reference points)

- **Xero** — bottom-up short-term cash from actual invoices/bills by due date; 7/30/90-day windows.
- **Fathom** — three-way forecasting; scenarios via editable timing/value assumptions; best/worst as
  assumption sets, not arithmetic bands; forecasts up to ~3 years.
- **Jirav** — driver-based 3-statement modeling (units, conversion, AOV, COGS %, headcount) with
  linked P&L/BS/CF and side-by-side scenarios; AI baseline you then tune by driver.

The gap to aim AskBiz at: driver-based P&L, AR/AP-aware near-term cash, backtested accuracy, and
editable assumption-based scenarios.

## Anti-patterns to catch on sight

| Smell | Why it's wrong | Do instead |
|---|---|---|
| Revenue, COGS, fixed each regressed separately then netted | Statement isn't internally consistent | Driver-based: COGS = % of forecast revenue; fixed = run-rate |
| "Accuracy: 100%" on 2–3 months | In-sample fit, always ~perfect on tiny n | Backtested accuracy, or "N/A — need history" |
| "0 months runway" when no balance entered | Conflates unconfigured with insolvent | Detect unconfigured → prompt to set balance |
| Confidence band + best/worst from different formulas | Two uncertainty stories at once | One basis (residual prediction interval) for both |
| Forecast starts on the current partial month | Duplicate labels; forecasts the present | Anchor forecast to the month *after* the last actual |
| Big growth % headline off tiny history, no caveat | False confidence | Warn < ~6 periods; cap/caveat the number |
| Runway from net-profit trend for near term | Ignores real dated AR/AP | Walk invoices/bills by due date (Xero method) |

## Working on the AskBiz forecast section

Read `references/askbiz-forecast-map.md` before editing — it maps every widget to its data source,
names the exact files/lines, and records the fixes already applied so you don't regress them.
