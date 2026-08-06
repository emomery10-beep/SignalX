'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { computeForecastSummary } from '@/lib/cfoForecastSummary'
import { computeTax } from './TaxEstimator'
import { STORAGE_KEY as BUDGET_STORAGE_KEY, DEFAULT_BUDGET, daysBetween, type Budget } from './BudgetVsActual'

type Tc = (k: string, vars?: Record<string, string | number>) => string

interface Props {
  data: {
    period: { start: string; end: string; compStart: string; compEnd: string; key: string }
    country_code?: string | null
    totals: { revenue: number; cogs: number; gross_profit: number; fixed_costs: number; net_profit: number; gross_margin_pct: number; net_margin_pct: number }
    comparison: { revenue: number; gross_profit: number; net_profit: number; gross_margin_pct: number }
    inventory: { total_products: number; low_or_oos: number; stockout_rate: number; value_at_cost: number }
    cash: { balance: number; runway_months: number | null; runway_status: string; daily_net_burn: number; monthly_fixed?: number }
    alerts: Array<{ type: string; severity: string; message: string }>
    kpis: any[]
    pnl_monthly?: Array<{ month: string; revenue: number; cogs: number; fixed: number; net: number; gross_margin_pct: number; net_margin_pct: number }>
    margin_by_product?: Array<{ name: string; category: string; revenue: number; cogs: number; margin_pct: number; units: number; contribution: number }>
    margin_by_channel?: Array<{ source: string; label: string; revenue: number; cogs: number; gross_profit: number; margin_pct: number; orders: number; pct_of_total: number }>
    receivables_summary?: { total_receivables: number; total_payables: number; overdue_receivables: number }
    receivables_aging?: { current: number; overdue_30: number; overdue_60: number; overdue_90: number }
    daily_cashflow?: Array<{ date: string; inflow: number; outflow: number; net: number }>
  }
  currencySymbol: string
  period: string
}

interface ExpenseRow {
  id: string
  vendor: string
  date: string
  amount: number
  category: string
}

interface ReceivableRow {
  id: string
  type: 'receivable' | 'payable'
  counterparty: string
  amount: number
  due_date: string
  days_overdue: number
  status: string
}

const MAX_TABLE_ROWS = 30

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function fmtSigned(n: number, sym: string): string {
  const s = fmt(Math.abs(n), sym)
  return n > 0 ? `+${s}` : n < 0 ? `-${s}` : s
}

function pctChange(curr: number, prev: number): string {
  if (prev === 0) return '—'
  const pct = Math.round(((curr - prev) / Math.abs(prev)) * 100)
  return pct > 0 ? `+${pct}%` : `${pct}%`
}

const buildPeriodLabels = (tc: Tc): Record<string, string> => ({
  today: tc('cfo_report.period_today'),
  this_week: tc('cfo_report.period_this_week'),
  this_month: tc('cfo_report.period_this_month'),
  last_month: tc('cfo_report.period_last_month'),
  this_quarter: tc('cfo_report.period_this_quarter'),
  ytd: tc('cfo_report.period_ytd'),
  last_90: tc('cfo_report.period_last_90'),
})

export default function CfoReportExport({ data, currencySymbol: sym, period }: Props) {
  const { tc } = useLang()
  const PERIOD_LABELS = buildPeriodLabels(tc)
  const [exporting, setExporting] = useState(false)
  const t = data.totals
  const c = data.comparison

  // Budget is stored client-side only (see components/cfo/CostConfigDrawer.tsx-
  // adjacent BudgetVsActual.tsx) — loaded here the same way that component
  // loads it, so the report's Budget section shows the same numbers.
  const [budgetState, setBudgetState] = useState<{ budget: Budget; hasBudget: boolean }>({ budget: DEFAULT_BUDGET, hasBudget: false })
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setBudgetState({ budget: parsed, hasBudget: Object.values(parsed).some((v: any) => Number(v) > 0) })
      }
    } catch {}
  }, [])

  // Expenses and Receivables/Payables detail live in their own tables, not the
  // shared snapshot (see ExpensesTab.tsx / ReceivablesTracker.tsx) — fetched
  // here the same way those tabs do, so the report can show real line items
  // instead of just the summary numbers already in `data`. Fetched on mount
  // (not on click) so they're normally ready before the user hits Download;
  // the button stays disabled until both resolve either way, so the export
  // never silently ships without this data.
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [expensesLoading, setExpensesLoading] = useState(true)
  const [receivables, setReceivables] = useState<ReceivableRow[]>([])
  const [receivablesLoading, setReceivablesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/cfo/expenses')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (!cancelled) setExpenses(d?.expenses || []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setExpensesLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/cfo/receivables?period=${period}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (!cancelled) setReceivables((d?.items || []).map((r: any) => ({
        id: r.id, type: r.type === 'payable' ? 'payable' : 'receivable', counterparty: r.counterparty,
        amount: r.amount, due_date: r.due_date, days_overdue: r.days_overdue || 0, status: r.status || 'current',
      }))) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setReceivablesLoading(false) })
    return () => { cancelled = true }
  }, [period])

  const criticalAlerts = data.alerts.filter(a => a.severity === 'critical')
  const warningAlerts = data.alerts.filter(a => a.severity === 'warning')

  // ── Forecast (mirrors the Forecasts tab's KPI row — see lib/cfoForecastSummary.ts) ──
  const forecastSummary = computeForecastSummary(data.pnl_monthly, data.cash, 6)

  // ── Margins — top products/channels by revenue ──
  const topProducts = [...(data.margin_by_product || [])].sort((a, b) => b.revenue - a.revenue).slice(0, 8)
  const channels = [...(data.margin_by_channel || [])].sort((a, b) => b.revenue - a.revenue)

  // ── Budget vs Actual — same period-scaling as BudgetVsActual.tsx ──
  const periodDays = Math.max(daysBetween(data.period.start, data.period.end), 1)
  const budgetFactor = periodDays / 30
  const scaledBudget: Budget = {
    revenue: budgetState.budget.revenue * budgetFactor,
    cogs: budgetState.budget.cogs * budgetFactor,
    fixed_costs: budgetState.budget.fixed_costs * budgetFactor,
    net_profit: budgetState.budget.net_profit * budgetFactor,
  }

  // ── Tax — reuses the exact math behind the Tax Estimator tab ──
  const tax = computeTax(t.revenue, t.net_profit, tc, data.country_code)

  // ── Expenses — scoped to the selected period, like the KPI cards above ──
  const expensesInPeriod = expenses
    .filter(e => e.date >= data.period.start && e.date <= data.period.end)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  const expensesTotal = expensesInPeriod.reduce((s, e) => s + e.amount, 0)
  const expensesShown = expensesInPeriod.slice(0, MAX_TABLE_ROWS)

  // ── Receivables/payables — already period-scoped server-side ──
  const receivablesList = receivables.filter(r => r.type === 'receivable')
  const payablesList = receivables.filter(r => r.type === 'payable')

  // ── Cash flow — daily rows for a short period, weekly rollup once it gets
  // long (e.g. YTD), so the report stays a sane length either way. ──
  const dailyCashflow = data.daily_cashflow || []
  const cashflowRows: { label: string; inflow: number; outflow: number; net: number }[] =
    dailyCashflow.length <= 31
      ? dailyCashflow.map(d => ({ label: d.date, inflow: d.inflow, outflow: d.outflow, net: d.net }))
      : (() => {
          const weeks = new Map<string, { inflow: number; outflow: number; net: number }>()
          for (const d of dailyCashflow) {
            const dt = new Date(d.date)
            const weekStart = new Date(dt)
            weekStart.setDate(dt.getDate() - dt.getDay())
            const key = weekStart.toISOString().slice(0, 10)
            const cur = weeks.get(key) || { inflow: 0, outflow: 0, net: 0 }
            weeks.set(key, { inflow: cur.inflow + d.inflow, outflow: cur.outflow + d.outflow, net: cur.net + d.net })
          }
          return [...weeks.entries()].map(([weekStart, v]) => ({ label: tc('cfo_report.cashflow_week_of', { date: weekStart }), ...v }))
        })()
  const cashflowShown = cashflowRows.slice(-MAX_TABLE_ROWS)
  const cashflowTotals = dailyCashflow.reduce((s, d) => ({ inflow: s.inflow + d.inflow, outflow: s.outflow + d.outflow, net: s.net + d.net }), { inflow: 0, outflow: 0, net: 0 })

  const exportPdf = async () => {
    setExporting(true)
    try {
      const el = document.getElementById('cfo-full-report')
      if (!el) return

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        windowWidth: 800,
      })

      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `cfo-report-${PERIOD_LABELS[period]?.replace(/\s/g, '-').toLowerCase() || period}-${new Date().toISOString().split('T')[0]}.png`
      link.href = imgData
      link.click()
    } catch {
      window.print()
    } finally {
      setExporting(false)
    }
  }

  const overallStatus = criticalAlerts.length > 0 ? tc('cfo_report.status_needs_attention') :
    warningAlerts.length > 0 ? tc('cfo_report.status_monitor') :
    t.net_profit >= 0 ? tc('cfo_report.status_on_track') : tc('cfo_report.status_review_required')

  const statusColor = criticalAlerts.length > 0 ? '#EF4444' :
    warningAlerts.length > 0 ? '#F59E0B' :
    t.net_profit >= 0 ? '#22C55E' : '#F97316'

  // Section list is built as plain data first (rather than hard-coded
  // ReportSection number={N} props) so numbering stays correct no matter
  // which optional sections (Forecast/Margins/Receivables/Budget) are
  // present for a given business — adding/removing a section here can't
  // leave a gap or duplicate number in what's rendered.
  const sections: { title: string; node: React.ReactNode }[] = []

  sections.push({
    title: tc('cfo_report.section_executive_summary'),
    node: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <MetricBox label={tc('cfo_report.metric_revenue')} value={fmt(t.revenue, sym)} change={pctChange(t.revenue, c.revenue)} positive={t.revenue >= c.revenue} />
          <MetricBox label={tc('cfo_report.metric_gross_profit')} value={fmt(t.gross_profit, sym)} change={tc('cfo_report.margin_suffix', { pct: t.gross_margin_pct })} positive={t.gross_margin_pct >= 30} />
          <MetricBox label={tc('cfo_report.metric_net_profit')} value={fmt(t.net_profit, sym)} change={tc('cfo_report.margin_suffix', { pct: t.net_margin_pct })} positive={t.net_profit >= 0} />
        </div>
        <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>
          {t.net_profit >= 0
            ? tc('cfo_report.summary_profit', { revenue: fmt(t.revenue, sym), net: fmt(t.net_profit, sym), margin: t.net_margin_pct, trend: t.revenue >= c.revenue ? tc('cfo_report.revenue_up') : tc('cfo_report.revenue_declined'), change: pctChange(t.revenue, c.revenue) })
            : tc('cfo_report.summary_loss', { revenue: fmt(t.revenue, sym), loss: fmt(Math.abs(t.net_profit), sym) })
          }
        </div>
      </>
    ),
  })

  sections.push({
    title: tc('cfo_report.section_pnl'),
    node: (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
            <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}></th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>{tc('cfo_report.col_amount')}</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>{tc('cfo_report.col_pct_revenue')}</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>{tc('cfo_report.col_vs_prior')}</th>
          </tr>
        </thead>
        <tbody>
          <PnlLine label={tc('cfo_report.pnl_revenue')} amount={t.revenue} pctRev={100} change={pctChange(t.revenue, c.revenue)} sym={sym} bold />
          <PnlLine label={tc('cfo_report.pnl_cogs')} amount={-t.cogs} pctRev={t.revenue > 0 ? (t.cogs / t.revenue) * 100 : 0} sym={sym} />
          <PnlLine label={tc('cfo_report.pnl_gross_profit')} amount={t.gross_profit} pctRev={t.gross_margin_pct} change={pctChange(t.gross_profit, c.gross_profit)} sym={sym} bold border highlight={t.gross_profit > 0} />
          <PnlLine label={tc('cfo_report.pnl_opex')} amount={-t.fixed_costs} pctRev={t.revenue > 0 ? (t.fixed_costs / t.revenue) * 100 : 0} sym={sym} />
          <PnlLine label={tc('cfo_report.pnl_net_profit')} amount={t.net_profit} pctRev={t.net_margin_pct} change={pctChange(t.net_profit, c.net_profit)} sym={sym} bold border highlight={t.net_profit >= 0} />
        </tbody>
      </table>
    ),
  })

  if (forecastSummary) {
    const runwayValue = forecastSummary.cashRunwayUnconfigured
      ? tc('cfo_report.not_set')
      : forecastSummary.cashRunwayMonths != null
      ? tc('cfo_report.months_value', { n: forecastSummary.cashRunwayMonths })
      : tc('cfo_report.forecast_runway_sustainable')
    sections.push({
      title: tc('cfo_report.section_forecast'),
      node: (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 18 }}>
            <SmallMetric label={tc('cfo_report.forecast_projected_revenue')} value={fmt(forecastSummary.projectedRevenue || 0, sym)} />
            <SmallMetric label={tc('cfo_report.forecast_projected_net_profit')} value={fmt(forecastSummary.projectedNetProfit || 0, sym)} alert={(forecastSummary.projectedNetProfit || 0) < 0} />
            <SmallMetric label={tc('cfo_report.forecast_cash_runway')} value={runwayValue} alert={!forecastSummary.cashRunwayUnconfigured && forecastSummary.cashRunwayMonths != null && forecastSummary.cashRunwayMonths <= 3} />
            <SmallMetric label={tc('cfo_report.forecast_accuracy')} value={forecastSummary.accuracyLabel} />
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{tc('cfo_report.forecast_monthly_title')}</div>
          <DataTable
            columns={[tc('cfo_report.forecast_col_month'), tc('cfo_report.pnl_revenue'), tc('cfo_report.pnl_cogs'), tc('cfo_report.forecast_col_net'), tc('cfo_report.forecast_col_margin')]}
            rows={forecastSummary.monthlyBreakdown.map(m => [
              m.month, fmt(m.revenue, sym), fmt(m.cogs, sym), fmt(m.net, sym), `${m.net_margin_pct.toFixed(1)}%`,
            ])}
          />

          {forecastSummary.cashTrajectory.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{tc('cfo_report.forecast_cash_trajectory_title')}</div>
              <DataTable
                columns={[tc('cfo_report.forecast_col_month'), tc('cfo_report.forecast_col_cash_balance')]}
                rows={forecastSummary.cashTrajectory.map(p => [p.label, fmt(p.balance, sym)])}
              />
            </div>
          )}

          <div style={{ fontSize: 11, color: '#888', marginTop: 10 }}>
            {tc('cfo_report.forecast_footnote', { n: forecastSummary.completedMonths })}
          </div>
        </>
      ),
    })
  }

  // ── Cash Flow — separate from the "Cash Position" KPI section above so it
  // maps 1:1 to the CFO dashboard's own Cash Flow sub-tab. ──
  if (dailyCashflow.length > 0) {
    sections.push({
      title: tc('cfo_report.section_cashflow'),
      node: (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <SmallMetric label={tc('cfo_report.cashflow_total_inflow')} value={fmt(cashflowTotals.inflow, sym)} />
            <SmallMetric label={tc('cfo_report.cashflow_total_outflow')} value={fmt(cashflowTotals.outflow, sym)} />
            <SmallMetric label={tc('cfo_report.cashflow_net_change')} value={fmtSigned(cashflowTotals.net, sym)} alert={cashflowTotals.net < 0} />
          </div>
          <DataTable
            columns={[dailyCashflow.length <= 31 ? tc('cfo_report.cashflow_col_date') : tc('cfo_report.cashflow_col_week'), tc('cfo_report.cashflow_col_inflow'), tc('cfo_report.cashflow_col_outflow'), tc('cfo_report.cashflow_col_net')]}
            rows={cashflowShown.map(r => [r.label, fmt(r.inflow, sym), fmt(r.outflow, sym), fmtSigned(r.net, sym)])}
          />
          {cashflowRows.length > cashflowShown.length && (
            <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
              {tc('cfo_report.cashflow_truncated_note', { shown: cashflowShown.length, total: cashflowRows.length })}
            </div>
          )}
        </>
      ),
    })
  }

  // ── Expenses — itemized, capped so the report stays a sane length ──
  if (!expensesLoading && expensesInPeriod.length > 0) {
    sections.push({
      title: tc('cfo_report.section_expenses'),
      node: (
        <>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
            {tc('cfo_report.expenses_total_note', { count: expensesInPeriod.length, total: fmt(expensesTotal, sym) })}
          </div>
          <DataTable
            columns={[tc('cfo_report.expenses_col_date'), tc('cfo_report.expenses_col_vendor'), tc('cfo_report.expenses_col_category'), tc('cfo_report.expenses_col_amount')]}
            rows={expensesShown.map(e => [e.date, e.vendor, e.category, fmt(e.amount, sym)])}
          />
          {expensesInPeriod.length > expensesShown.length && (
            <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
              {tc('cfo_report.expenses_truncated_note', { shown: expensesShown.length, total: expensesInPeriod.length })}
            </div>
          )}
        </>
      ),
    })
  }

  sections.push({
    title: tc('cfo_report.section_cash'),
    node: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <MetricBox label={tc('cfo_report.metric_cash_balance')} value={data.cash.balance > 0 ? fmt(data.cash.balance, sym) : tc('cfo_report.not_set')} positive={data.cash.balance > 0} />
        <MetricBox label={tc('cfo_report.metric_monthly_burn')} value={fmt(Math.abs(data.cash.daily_net_burn * 30), sym)} positive={data.cash.daily_net_burn >= 0} change={data.cash.daily_net_burn >= 0 ? tc('cfo_report.cash_positive') : tc('cfo_report.negative_burn')} />
        <MetricBox label={tc('cfo_report.metric_cash_runway')} value={data.cash.runway_months != null ? tc('cfo_report.months_value', { n: data.cash.runway_months }) : data.cash.daily_net_burn >= 0 ? tc('cfo_report.cash_positive_short') : '—'} positive={data.cash.runway_months == null || data.cash.runway_months >= 3} />
      </div>
    ),
  })

  if (topProducts.length > 0 || channels.length > 0) {
    sections.push({
      title: tc('cfo_report.section_margins'),
      node: (
        <>
          {topProducts.length > 0 && (
            <div style={{ marginBottom: channels.length > 0 ? 18 : 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{tc('cfo_report.margins_by_product')}</div>
              <DataTable
                columns={[tc('cfo_report.margin_col_name'), tc('cfo_report.margin_col_revenue'), tc('cfo_report.margin_col_margin')]}
                rows={topProducts.map(p => [p.name, fmt(p.revenue, sym), `${p.margin_pct.toFixed(1)}%`])}
              />
            </div>
          )}
          {channels.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{tc('cfo_report.margins_by_channel')}</div>
              <DataTable
                columns={[tc('cfo_report.margin_col_name'), tc('cfo_report.margin_col_revenue'), tc('cfo_report.margin_col_margin')]}
                rows={channels.map(ch => [ch.label, fmt(ch.revenue, sym), `${ch.margin_pct.toFixed(1)}%`])}
              />
            </div>
          )}
        </>
      ),
    })
  }

  if (data.receivables_summary || data.receivables_aging || (!receivablesLoading && receivables.length > 0)) {
    sections.push({
      title: tc('cfo_report.section_receivables'),
      node: (
        <>
          {data.receivables_summary && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <SmallMetric label={tc('cfo_report.recv_total_receivables')} value={fmt(data.receivables_summary.total_receivables, sym)} />
              <SmallMetric label={tc('cfo_report.recv_total_payables')} value={fmt(data.receivables_summary.total_payables, sym)} />
              <SmallMetric label={tc('cfo_report.recv_overdue')} value={fmt(data.receivables_summary.overdue_receivables, sym)} alert={data.receivables_summary.overdue_receivables > 0} />
            </div>
          )}
          {data.receivables_aging && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: (!receivablesLoading && receivables.length > 0) ? 18 : 0 }}>
              <SmallMetric label={tc('cfo_report.recv_aging_current')} value={fmt(data.receivables_aging.current, sym)} />
              <SmallMetric label={tc('cfo_report.recv_aging_30')} value={fmt(data.receivables_aging.overdue_30, sym)} alert={data.receivables_aging.overdue_30 > 0} />
              <SmallMetric label={tc('cfo_report.recv_aging_60')} value={fmt(data.receivables_aging.overdue_60, sym)} alert={data.receivables_aging.overdue_60 > 0} />
              <SmallMetric label={tc('cfo_report.recv_aging_90')} value={fmt(data.receivables_aging.overdue_90, sym)} alert={data.receivables_aging.overdue_90 > 0} />
            </div>
          )}
          {!receivablesLoading && receivablesList.length > 0 && (
            <div style={{ marginBottom: payablesList.length > 0 ? 18 : 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{tc('cfo_report.recv_outstanding_title')}</div>
              <DataTable
                columns={[tc('cfo_report.recv_col_customer'), tc('cfo_report.recv_col_due'), tc('cfo_report.recv_col_status'), tc('cfo_report.recv_col_amount')]}
                rows={receivablesList.slice(0, MAX_TABLE_ROWS).map(r => [r.counterparty, r.due_date, r.days_overdue > 0 ? tc('cfo_report.recv_days_overdue', { n: r.days_overdue }) : tc('cfo_report.recv_current'), fmt(r.amount, sym)])}
              />
              {receivablesList.length > MAX_TABLE_ROWS && (
                <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>{tc('cfo_report.recv_truncated_note', { shown: MAX_TABLE_ROWS, total: receivablesList.length })}</div>
              )}
            </div>
          )}
          {!receivablesLoading && payablesList.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{tc('cfo_report.pay_outstanding_title')}</div>
              <DataTable
                columns={[tc('cfo_report.recv_col_customer'), tc('cfo_report.recv_col_due'), tc('cfo_report.recv_col_status'), tc('cfo_report.recv_col_amount')]}
                rows={payablesList.slice(0, MAX_TABLE_ROWS).map(r => [r.counterparty, r.due_date, r.days_overdue > 0 ? tc('cfo_report.recv_days_overdue', { n: r.days_overdue }) : tc('cfo_report.recv_current'), fmt(r.amount, sym)])}
              />
              {payablesList.length > MAX_TABLE_ROWS && (
                <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>{tc('cfo_report.pay_truncated_note', { shown: MAX_TABLE_ROWS, total: payablesList.length })}</div>
              )}
            </div>
          )}
        </>
      ),
    })
  }

  if (budgetState.hasBudget) {
    sections.push({
      title: tc('cfo_report.section_budget'),
      node: (
        <DataTable
          columns={['', tc('cfo_report.budget_col_budget'), tc('cfo_report.budget_col_actual'), tc('cfo_report.budget_col_variance')]}
          rows={[
            [tc('cfo_report.budget_row_revenue'), fmt(scaledBudget.revenue, sym), fmt(t.revenue, sym), fmtSigned(t.revenue - scaledBudget.revenue, sym)],
            [tc('cfo_report.budget_row_cogs'), fmt(scaledBudget.cogs, sym), fmt(t.cogs, sym), fmtSigned(scaledBudget.cogs - t.cogs, sym)],
            [tc('cfo_report.budget_row_fixed'), fmt(scaledBudget.fixed_costs, sym), fmt(t.fixed_costs, sym), fmtSigned(scaledBudget.fixed_costs - t.fixed_costs, sym)],
            [tc('cfo_report.budget_row_net'), fmt(scaledBudget.net_profit, sym), fmt(t.net_profit, sym), fmtSigned(t.net_profit - scaledBudget.net_profit, sym)],
          ]}
        />
      ),
    })
  }

  sections.push({
    title: tc('cfo_report.section_inventory'),
    node: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        <SmallMetric label={tc('cfo_report.inv_total_products')} value={`${data.inventory.total_products}`} />
        <SmallMetric label={tc('cfo_report.inv_stock_value')} value={fmt(data.inventory.value_at_cost, sym)} />
        <SmallMetric label={tc('cfo_report.inv_low_oos')} value={`${data.inventory.low_or_oos}`} alert={data.inventory.low_or_oos > 0} />
        <SmallMetric label={tc('cfo_report.inv_stockout_rate')} value={`${data.inventory.stockout_rate}%`} alert={data.inventory.stockout_rate > 30} />
      </div>
    ),
  })

  sections.push({
    title: tc('cfo_report.section_tax'),
    node: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: tax.turnoverTax.applicable ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: 12 }}>
          <SmallMetric label={tax.vat.name} value={fmt(tax.vat.amount, sym)} />
          <SmallMetric label={tc('cfo_report.tax_income')} value={fmt(tax.incomeTax.amount, sym)} />
          {tax.turnoverTax.applicable && <SmallMetric label={tc('cfo_report.tax_turnover')} value={fmt(tax.turnoverTax.amount, sym)} />}
          <SmallMetric label={tc('cfo_report.tax_total_set_aside')} value={fmt(tax.totalSetAside, sym)} alert={tax.totalSetAside > 0} />
        </div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 10 }}>
          {tc('cfo_report.tax_pct_revenue', { pct: Math.round(tax.pctOfRevenue) })}
        </div>
      </>
    ),
  })

  if (criticalAlerts.length > 0 || warningAlerts.length > 0) {
    sections.push({
      title: tc('cfo_report.section_risks'),
      node: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {criticalAlerts.map((a, i) => (
            <div key={`c${i}`} style={{ fontSize: 12, color: '#333', padding: '8px 12px', borderRadius: 6, background: '#fef2f2', border: '1px solid #fca5a5' }}>
              <strong style={{ color: '#EF4444' }}>{tc('cfo_report.label_critical')}</strong> {a.message}
            </div>
          ))}
          {warningAlerts.map((a, i) => (
            <div key={`w${i}`} style={{ fontSize: 12, color: '#333', padding: '8px 12px', borderRadius: 6, background: '#fffbeb', border: '1px solid #fcd34d' }}>
              <strong style={{ color: '#F59E0B' }}>{tc('cfo_report.label_warning')}</strong> {a.message}
            </div>
          ))}
        </div>
      ),
    })
  }

  if (data.kpis && data.kpis.length > 0) {
    sections.push({
      title: tc('cfo_report.section_kpi'),
      node: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {data.kpis.map((kpi: any) => (
            <div key={kpi.key} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e5e5', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#333', marginTop: 4 }}>{kpi.valueLabel || (kpi.value != null ? `${kpi.value}` : '—')}</div>
              {kpi.change != null && (
                <div style={{ fontSize: 10, color: kpi.change > 0 ? '#22C55E' : kpi.change < 0 ? '#EF4444' : '#888', fontWeight: 600, marginTop: 2 }}>
                  {kpi.change > 0 ? '▲' : kpi.change < 0 ? '▼' : '–'} {Math.abs(kpi.change)}%
                </div>
              )}
            </div>
          ))}
        </div>
      ),
    })
  }

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header with export button */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_report.header_title')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{PERIOD_LABELS[period] || period}</span>
        </div>
        <button
          onClick={exportPdf}
          disabled={exporting || expensesLoading || receivablesLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, color: '#fff', background: '#6366F1',
            border: 'none', borderRadius: 8, padding: '8px 16px',
            cursor: (exporting || expensesLoading || receivablesLoading) ? 'wait' : 'pointer', fontWeight: 600, fontFamily: 'inherit',
            opacity: (expensesLoading || receivablesLoading) ? 0.7 : 1,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {exporting ? tc('cfo_report.btn_generating') : (expensesLoading || receivablesLoading) ? tc('cfo_report.btn_loading') : tc('cfo_report.btn_download')}
        </button>
      </div>

      {/* Full report content — exported as image */}
      <div id="cfo-full-report" style={{ padding: 32, background: '#fff', color: '#1a1a1a', maxWidth: 800 }}>
        {/* Report title */}
        <div style={{ borderBottom: '3px solid #6366F1', paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>{tc('cfo_report.report_title')}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <div style={{ fontSize: 13, color: '#666' }}>
              {tc('cfo_report.report_meta', { period: PERIOD_LABELS[period] || period, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: statusColor, padding: '4px 12px', borderRadius: 6, background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
              {overallStatus}
            </div>
          </div>
        </div>

        {sections.map((s, i) => (
          <ReportSection key={i} number={i + 1} title={s.title}>{s.node}</ReportSection>
        ))}

        {/* Footer */}
        <div style={{ borderTop: '2px solid #e5e5e5', paddingTop: 14, marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: '#aaa' }}>
            {tc('cfo_report.footer_generated', { date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })}
          </div>
          <div style={{ fontSize: 10, color: '#aaa' }}>
            {tc('cfo_report.footer_page', { current: 1, total: 1 })}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportSection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#6366F1', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{number}</span>
        {title}
      </div>
      {children}
    </div>
  )
}

function MetricBox({ label, value, change, positive }: { label: string; value: string; change?: string; positive?: boolean }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fafafa' }}>
      <div style={{ fontSize: 10, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>{value}</div>
      {change && <div style={{ fontSize: 11, color: positive ? '#22C55E' : '#EF4444', fontWeight: 600, marginTop: 2 }}>{change}</div>}
    </div>
  )
}

function SmallMetric({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e5e5', textAlign: 'center', background: alert ? '#fef2f2' : '#fafafa' }}>
      <div style={{ fontSize: 9, color: '#888', fontWeight: 500, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: alert ? '#EF4444' : '#333', marginTop: 2 }}>{value}</div>
    </div>
  )
}

function DataTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
          {columns.map((col, i) => (
            <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '6px 0', fontSize: 11, color: '#888', fontWeight: 600 }}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: '1px solid #f0f0f0' }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ textAlign: ci === 0 ? 'left' : 'right', padding: '6px 0', color: '#333' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PnlLine({ label, amount, pctRev, change, sym, bold, border, highlight }: {
  label: string; amount: number; pctRev: number; change?: string; sym: string; bold?: boolean; border?: boolean; highlight?: boolean
}) {
  const fmtAmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
    return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
  }

  return (
    <tr style={{ borderTop: border ? '2px solid #e5e5e5' : undefined, background: highlight ? (amount >= 0 ? '#f0fdf4' : '#fef2f2') : undefined }}>
      <td style={{ padding: '8px 0', fontWeight: bold ? 700 : 400, color: '#333', fontSize: 13 }}>{label}</td>
      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: bold ? 700 : 400, color: amount < 0 ? '#dc2626' : '#333' }}>{fmtAmt(amount)}</td>
      <td style={{ padding: '8px 0', textAlign: 'right', color: '#888' }}>{pctRev > 0 ? `${Math.round(pctRev)}%` : ''}</td>
      <td style={{ padding: '8px 0', textAlign: 'right', fontSize: 12, color: change?.startsWith('+') ? '#22C55E' : change?.startsWith('-') ? '#dc2626' : '#888' }}>{change || ''}</td>
    </tr>
  )
}
