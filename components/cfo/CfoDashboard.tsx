'use client'
import { useState, useEffect, useCallback } from 'react'
import PeriodSelector from './PeriodSelector'
import FinancialSnapshot from './FinancialSnapshot'
import RevenueTrendChart from './RevenueTrendChart'
import CfoAlerts from './CfoAlerts'
import CashFlowCountdown from '@/components/intelligence/CashFlowCountdown'
import SupplierBrief from '@/components/intelligence/SupplierBrief'
import PriceSensitivity from '@/components/intelligence/PriceSensitivity'
import ScenarioPlanner from './ScenarioPlanner'
import CfoForecasts from './CfoForecasts'
import CostBreakdown from './CostBreakdown'
import InventoryFinance from './InventoryFinance'
import TaxEstimator from './TaxEstimator'
import KpiScorecard from './KpiScorecard'
import BoardPack from './BoardPack'
import ReceivablesTracker from './ReceivablesTracker'
import CreditReadiness from './CreditReadiness'
import WorkingCapitalCycle from './WorkingCapitalCycle'
import WeeklyCfoDigest from './WeeklyCfoDigest'
import CfoReportExport from './CfoReportExport'
import SourceBreakdown from './SourceBreakdown'
import CfoAiInsight from './CfoAiInsight'
import LogisticsOverview from './LogisticsOverview'
import PnlStatement from './PnlStatement'
import MarginAnalysis from './MarginAnalysis'
import CashFlowStatement from './CashFlowStatement'
import RollingCashForecast from './RollingCashForecast'
import ContributionMarginWaterfall from './ContributionMarginWaterfall'
import BudgetVsActual from './BudgetVsActual'
import ExpensesTab from './ExpensesTab'
import ReceiptScanner from './ReceiptScanner'

interface SnapshotData {
  currency_symbol: string
  country_code?: string | null
  kpis: any[]
  alerts: any[]
  chart: any[]
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
  inventory: {
    total_products: number
    low_or_oos: number
    stockout_rate: number
    value_at_cost: number
    value_at_retail: number
  }
  cash: {
    balance: number
    monthly_fixed: number
    runway_months: number | null
    runway_status: string
    daily_net_burn: number
  }
  data_quality: { days_with_data: number; has_ecommerce: boolean; has_pos: boolean; has_shipments?: boolean }
  source_breakdown?: Array<{
    source: string; label: string; revenue: number; cogs: number
    gross_profit: number; margin_pct: number; orders: number; pct_of_total: number
  }>
  logistics?: {
    in_transit_count: number; in_transit_value: number
    delayed_count: number; delayed_value: number
    at_risk_count: number; financing_cost: number; avg_delivery_days: number
  }
  receivables_summary?: {
    total_receivables: number; total_payables: number; overdue_receivables: number
  }
  pnl_by_source?: Array<{
    source: string; label: string; revenue: number; cogs: number
    gross_profit: number; margin_pct: number; orders: number; pct_of_total: number
  }>
  pnl_monthly?: Array<{
    month: string; revenue: number; cogs: number; fixed: number; net: number
    gross_margin_pct: number; net_margin_pct: number
  }>
  margin_by_product?: Array<{
    name: string; category: string; revenue: number; cogs: number
    margin_pct: number; units: number; contribution: number
  }>
  margin_by_channel?: Array<{
    source: string; label: string; revenue: number; cogs: number
    gross_profit: number; margin_pct: number; orders: number; pct_of_total: number
  }>
  receivables_aging?: {
    current: number; overdue_30: number; overdue_60: number; overdue_90: number
  }
  daily_cashflow?: Array<{
    date: string; inflow: number; outflow: number; net: number
  }>
}

const SUB_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pnl', label: 'P&L' },
  { id: 'cashflow', label: 'Cash Flow' },
  { id: 'margins', label: 'Margins' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'receivables', label: 'Receivables' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'budget', label: 'Budget' },
  { id: 'forecasts', label: 'Forecasts' },
  { id: 'tax', label: 'Tax' },
  { id: 'reports', label: 'Reports' },
] as const

type SubTab = typeof SUB_TABS[number]['id']

interface Props {
  onAsk: (prompt: string) => void
}

export default function CfoDashboard({ onAsk }: Props) {
  const [subTab, setSubTab] = useState<SubTab>('dashboard')
  const [period, setPeriod] = useState('this_month')
  const [data, setData] = useState<SnapshotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [recTotals, setRecTotals] = useState<{ receivables: number; payables: number }>({ receivables: 0, payables: 0 })
  const [quickScanOpen, setQuickScanOpen] = useState(false)

  const fetchData = useCallback((p: string) => {
    setLoading(true)
    fetch(`/api/cfo/snapshot?period=${p}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData(period) }, [period, fetchData])

  const changePeriod = (p: string) => {
    setPeriod(p)
  }

  const sym = data?.currency_symbol || '$'
  const countryCode = data?.country_code || null

  const fmtCurrency = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
    if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
    return `${sym}${Math.round(n).toLocaleString()}`
  }

  const pctChange = (curr: number, prev: number) =>
    prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 2 }}>CFO</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Financial intelligence · Real-time analytics · Actionable insights</div>
          </div>
          {!loading && data?.totals && data.totals.revenue > 0 && (
            <button
              onClick={() => setSubTab('reports')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 11, color: '#6366F1', background: 'rgba(99,102,241,.08)',
                border: 'none', borderRadius: 7, padding: '6px 12px',
                cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export Report
            </button>
          )}
        </div>

        {/* Sub-tab navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {SUB_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              style={{
                padding: '6px 12px', borderRadius: 7,
                border: 'none',
                background: subTab === t.id ? 'rgba(99,102,241,.1)' : 'transparent',
                color: subTab === t.id ? '#6366F1' : 'var(--tx3)',
                fontSize: 12, fontWeight: subTab === t.id ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 120ms', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Period selector */}
        <PeriodSelector value={period} onChange={changePeriod} />
      </div>

      {/* ─── DASHBOARD VIEW ─── */}
      {subTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Alerts */}
          {data?.alerts && data.alerts.length > 0 && (
            <CfoAlerts alerts={data.alerts} onNavigate={(tab) => setSubTab(tab as SubTab)} />
          )}

          {/* KPI Snapshot */}
          <FinancialSnapshot
            kpis={data?.kpis || []}
            currencySymbol={sym}
            loading={loading}
            onNavigate={(tab) => setSubTab(tab as SubTab)}
          />

          {/* Revenue vs Costs Chart */}
          {!loading && data?.chart && (
            <RevenueTrendChart data={data.chart} currencySymbol={sym} />
          )}

          {/* P&L Summary Card */}
          {!loading && data?.totals && data.totals.revenue > 0 && (
            <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: '#22C55E' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>P&L Summary</span>
                </div>
                <button
                  onClick={() => setSubTab('pnl')}
                  style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
                >
                  View full P&L →
                </button>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--b)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}></th>
                      <th style={{ textAlign: 'right', padding: '6px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</th>
                      <th style={{ textAlign: 'right', padding: '6px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>% Rev</th>
                      <th style={{ textAlign: 'right', padding: '6px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>vs Prior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <PnlRow label="Revenue" amount={data.totals.revenue} pctRev={100} change={pctChange(data.totals.revenue, data.comparison.revenue)} sym={sym} bold />
                    <PnlRow label="Cost of Goods" amount={-data.totals.cogs} pctRev={data.totals.revenue > 0 ? (data.totals.cogs / data.totals.revenue) * 100 : 0} change={pctChange(data.totals.cogs, data.comparison.cogs)} sym={sym} negative />
                    <PnlRow label="Gross Profit" amount={data.totals.gross_profit} pctRev={data.totals.gross_margin_pct} change={pctChange(data.totals.gross_profit, data.comparison.gross_profit)} sym={sym} bold border />
                    <PnlRow label="Fixed Costs" amount={-data.totals.fixed_costs} pctRev={data.totals.revenue > 0 ? (data.totals.fixed_costs / data.totals.revenue) * 100 : 0} sym={sym} negative />
                    <PnlRow label="Net Profit" amount={data.totals.net_profit} pctRev={data.totals.net_margin_pct} change={pctChange(data.totals.net_profit, data.comparison.net_profit)} sym={sym} bold border highlight />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          {!loading && data?.totals && data.totals.revenue > 0 && (
            <CostBreakdown
              revenue={data.totals.revenue}
              cogs={data.totals.cogs}
              fixedCosts={data.totals.fixed_costs}
              currencySymbol={sym}
              onAsk={onAsk}
            />
          )}

          {/* AI Insights */}
          {!loading && data && (
            <CfoAiInsight data={data} countryCode={countryCode} onAsk={onAsk} />
          )}

          {/* Revenue by Source */}
          {!loading && data?.source_breakdown && data.source_breakdown.length > 1 && (
            <SourceBreakdown sources={data.source_breakdown} currencySymbol={sym} onAsk={onAsk} />
          )}

          {/* Logistics (Track17) */}
          {!loading && data?.logistics && (
            <LogisticsOverview data={data.logistics} currencySymbol={sym} onAsk={onAsk} />
          )}

          {/* Cash Flow section */}
          <CashFlowCountdown onAsk={onAsk} />
        </div>
      )}

      {/* ─── P&L VIEW ─── */}
      {subTab === 'pnl' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && data?.totals ? (
            <PnlStatement
              totals={data.totals}
              comparison={data.comparison}
              pnlMonthly={data.pnl_monthly}
              pnlBySource={data.pnl_by_source}
              currencySymbol={sym}
              onAsk={onAsk}
            />
          ) : loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>Loading P&L data...</div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>No data available. Connect a data source to see your P&L.</div>
          )}
        </div>
      )}

      {/* ─── CASH FLOW VIEW ─── */}
      {subTab === 'cashflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && data?.daily_cashflow && data.daily_cashflow.length > 0 && (
            <RollingCashForecast
              dailyCashflow={data.daily_cashflow}
              cashBalance={data.cash.balance}
              monthlyFixed={data.cash.monthly_fixed}
              currencySymbol={sym}
              onAsk={onAsk}
            />
          )}

          <CashFlowCountdown onAsk={onAsk} />

          {!loading && data?.totals ? (
            <CashFlowStatement
              totals={data.totals}
              cash={data.cash}
              dailyCashflow={data.daily_cashflow}
              receivablesAging={data.receivables_aging}
              receivablesSummary={data.receivables_summary}
              sourceBreakdown={data.source_breakdown}
              currencySymbol={sym}
              onAsk={onAsk}
            />
          ) : loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>Loading cash flow data...</div>
          ) : null}
        </div>
      )}

      {/* ─── MARGINS VIEW ─── */}
      {subTab === 'margins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && data?.totals && data.totals.revenue > 0 ? (
            <MarginAnalysis
              totals={data.totals}
              comparison={data.comparison}
              marginByProduct={data.margin_by_product}
              marginByChannel={data.margin_by_channel}
              pnlMonthly={data.pnl_monthly}
              currencySymbol={sym}
              onAsk={onAsk}
            />
          ) : loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>Loading margin data...</div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>No data available. Connect a data source to analyze margins.</div>
          )}

          {!loading && data?.margin_by_channel && data.margin_by_channel.length > 0 && (
            <ContributionMarginWaterfall
              channels={data.margin_by_channel}
              currencySymbol={sym}
              onAsk={onAsk}
            />
          )}

          <PriceSensitivity onAsk={onAsk} />
          <SupplierBrief onAsk={onAsk} />
        </div>
      )}

      {/* ─── INVENTORY VIEW ─── */}
      {subTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InventoryFinance onAsk={onAsk} />
        </div>
      )}

      {/* ─── RECEIVABLES VIEW ─── */}
      {subTab === 'receivables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ReceivablesTracker
            currencySymbol={sym}
            countryCode={countryCode}
            onAsk={onAsk}
            onTotalsChange={(r, p) => setRecTotals({ receivables: r, payables: p })}
          />
          {!loading && data?.totals && data.totals.revenue > 0 && (
            <WorkingCapitalCycle
              revenue={data.totals.revenue}
              cogs={data.totals.cogs}
              inventoryValue={data.inventory.value_at_cost}
              receivablesTotal={recTotals.receivables || data.receivables_summary?.total_receivables || 0}
              payablesTotal={recTotals.payables || data.receivables_summary?.total_payables || 0}
              currencySymbol={sym}
              countryCode={countryCode}
              onAsk={onAsk}
            />
          )}
        </div>
      )}

      {/* ─── EXPENSES VIEW ─── */}
      {subTab === 'expenses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ExpensesTab currencySymbol={sym} onAsk={onAsk} />
        </div>
      )}

      {/* ─── BUDGET VIEW ─── */}
      {subTab === 'budget' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && data?.totals ? (
            <BudgetVsActual
              totals={data.totals}
              pnlMonthly={data.pnl_monthly}
              currencySymbol={sym}
              period={period}
              onAsk={onAsk}
            />
          ) : loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>Loading...</div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>Connect a data source to track budget vs actuals.</div>
          )}
        </div>
      )}

      {/* ─── FORECASTS VIEW ─── */}
      {subTab === 'forecasts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && data?.totals ? (
            <CfoForecasts
              pnlMonthly={data.pnl_monthly ?? []}
              totals={data.totals}
              cash={data.cash}
              dailyCashflow={data.daily_cashflow}
              currencySymbol={sym}
            />
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>
              {loading ? 'Loading...' : 'Connect a data source to view forecasts.'}
            </div>
          )}
        </div>
      )}

      {/* ─── TAX & COMPLIANCE VIEW ─── */}
      {subTab === 'tax' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && data?.totals ? (
            <TaxEstimator
              revenue={data.totals.revenue}
              grossProfit={data.totals.gross_profit}
              netProfit={data.totals.net_profit}
              currencySymbol={sym}
              countryCode={countryCode}
              onAsk={onAsk}
            />
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>
              {loading ? 'Loading...' : 'Connect a data source to estimate tax obligations.'}
            </div>
          )}
        </div>
      )}

      {/* ─── FLOATING CAMERA BUTTON ─── */}
      <div style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 50 }}>
        {quickScanOpen && (
          <div style={{ position: 'absolute', bottom: 52, right: 0, width: 340 }}>
            <ReceiptScanner
              currencySymbol={sym}
              onConfirm={async (expense) => {
                try {
                  await fetch('/api/cfo/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(expense) })
                  setQuickScanOpen(false)
                  setSubTab('expenses' as SubTab)
                } catch {}
              }}
              onCancel={() => setQuickScanOpen(false)}
            />
          </div>
        )}
        <button
          onClick={() => setQuickScanOpen(v => !v)}
          title="Scan a receipt"
          style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: '#6366F1', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,.4)', transition: 'transform 150ms, box-shadow 150ms' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,.5)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,.4)' }}
        >
          📷
        </button>
      </div>

      {/* ─── REPORTS VIEW ─── */}
      {subTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && data?.totals ? (
            <>
              <CfoReportExport data={data} currencySymbol={sym} period={period} />
              <KpiScorecard
                revenue={data.totals.revenue}
                grossMarginPct={data.totals.gross_margin_pct}
                netMarginPct={data.totals.net_margin_pct}
                runwayMonths={data.cash.runway_months}
                stockoutRate={data.inventory.stockout_rate}
                healthScore={data.kpis?.find((k: any) => k.key === 'health')?.value ?? null}
                revenueChange={data.kpis?.find((k: any) => k.key === 'revenue')?.change ?? null}
                currencySymbol={sym}
                onAsk={onAsk}
              />
              <BoardPack data={data} currencySymbol={sym} onAsk={onAsk} />
              <WeeklyCfoDigest data={data} currencySymbol={sym} onAsk={onAsk} />
              <CreditReadiness
                revenue={data.totals.revenue}
                grossMarginPct={data.totals.gross_margin_pct}
                netMarginPct={data.totals.net_margin_pct}
                runwayMonths={data.cash.runway_months}
                stockoutRate={data.inventory.stockout_rate}
                hasPos={data.data_quality.has_pos}
                hasEcommerce={data.data_quality.has_ecommerce}
                daysWithData={data.data_quality.days_with_data}
                currencySymbol={sym}
                countryCode={countryCode}
                onAsk={onAsk}
              />
            </>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>
              {loading ? 'Loading...' : 'Connect a data source to generate reports.'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


/* ─── Inline sub-components ─── */

function PnlRow({ label, amount, pctRev, change, sym, bold, negative, border, highlight }: {
  label: string; amount: number; pctRev: number; change?: number | null; sym: string
  bold?: boolean; negative?: boolean; border?: boolean; highlight?: boolean
}) {
  const fmtAmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
    if (abs >= 1_000) return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
    return `${n < 0 ? '(' : ''}${sym}${Math.round(abs)}${n < 0 ? ')' : ''}`
  }

  return (
    <tr style={{
      borderTop: border ? '2px solid var(--b)' : undefined,
      background: highlight ? 'rgba(99,102,241,.03)' : undefined,
    }}>
      <td style={{ padding: '7px 0', fontWeight: bold ? 700 : 400, color: 'var(--tx)', fontSize: 12 }}>{label}</td>
      <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: bold ? 700 : 400, color: negative ? '#EF4444' : 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>
        {fmtAmt(amount)}
      </td>
      <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
        {pctRev > 0 ? `${Math.round(pctRev)}%` : ''}
      </td>
      <td style={{ padding: '7px 0', textAlign: 'right' }}>
        {change != null && (
          <span style={{ fontSize: 11, fontWeight: 600, color: change > 0 ? '#22C55E' : change < 0 ? '#EF4444' : 'var(--tx3)' }}>
            {change > 0 ? '▲' : change < 0 ? '▼' : '–'} {Math.abs(change)}%
          </span>
        )}
      </td>
    </tr>
  )
}

function PnlFull({ data, sym, fmtCurrency, onAsk }: { data: SnapshotData; sym: string; fmtCurrency: (n: number) => string; onAsk: (s: string) => void }) {
  const t = data.totals
  const c = data.comparison
  const pct = (curr: number, prev: number) => prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>Profit & Loss Statement</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>Percentage-first · Variance highlighted</div>
        </div>
        <button
          onClick={() => onAsk(`Analyze my P&L: Revenue ${fmtCurrency(t.revenue)}, COGS ${fmtCurrency(t.cogs)} (${Math.round((t.cogs / t.revenue) * 100)}%), Gross margin ${t.gross_margin_pct}%, Net profit ${fmtCurrency(t.net_profit)} (${t.net_margin_pct}%). What should I focus on improving?`)}
          style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
        >
          Ask AI about this P&L
        </button>
      </div>

      <div style={{ padding: '14px 18px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--b)' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', width: '35%' }}></th>
              <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current</th>
              <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>% of Rev</th>
              <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prior Period</th>
              <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--tx3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Change</th>
            </tr>
          </thead>
          <tbody>
            <FullPnlRow label="Revenue" current={t.revenue} pctRev={100} prior={c.revenue} change={pct(t.revenue, c.revenue)} sym={sym} bold />
            <FullPnlRow label="Cost of Goods Sold" current={-t.cogs} pctRev={t.revenue > 0 ? (t.cogs / t.revenue) * 100 : 0} prior={-c.cogs} change={pct(t.cogs, c.cogs)} sym={sym} negative />

            <tr style={{ borderTop: '2px solid var(--b)', background: 'rgba(34,197,94,.03)' }}>
              <td style={{ padding: '9px 0', fontWeight: 700, fontSize: 13 }}>Gross Profit</td>
              <td style={{ padding: '9px 0', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(t.gross_profit)}</td>
              <td style={{ padding: '9px 0', textAlign: 'right', fontWeight: 700, color: t.gross_margin_pct >= 35 ? '#22C55E' : t.gross_margin_pct >= 20 ? '#F59E0B' : '#EF4444' }}>{t.gross_margin_pct}%</td>
              <td style={{ padding: '9px 0', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(c.gross_profit)}</td>
              <td style={{ padding: '9px 0', textAlign: 'right' }}>{renderChange(pct(t.gross_profit, c.gross_profit))}</td>
            </tr>

            <FullPnlRow label="Operating Expenses" current={-t.fixed_costs} pctRev={t.revenue > 0 ? (t.fixed_costs / t.revenue) * 100 : 0} sym={sym} negative />

            <tr style={{ borderTop: '2px solid var(--b)', background: t.net_profit >= 0 ? 'rgba(99,102,241,.04)' : 'rgba(239,68,68,.04)' }}>
              <td style={{ padding: '10px 0', fontWeight: 800, fontSize: 14 }}>Net Profit</td>
              <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 800, fontSize: 14, color: t.net_profit >= 0 ? '#22C55E' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>
                {fmtCurrency(t.net_profit)}
              </td>
              <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700, color: t.net_profit >= 0 ? '#22C55E' : '#EF4444' }}>
                {t.net_margin_pct}%
              </td>
              <td style={{ padding: '10px 0', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(c.net_profit)}</td>
              <td style={{ padding: '10px 0', textAlign: 'right' }}>{renderChange(pct(t.net_profit, c.net_profit))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FullPnlRow({ label, current, pctRev, prior, change, sym, bold, negative }: {
  label: string; current: number; pctRev: number; prior?: number; change?: number | null; sym: string
  bold?: boolean; negative?: boolean
}) {
  const fmtAmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '(' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M${n < 0 ? ')' : ''}`
    return `${n < 0 ? '(' : ''}${sym}${Math.round(abs).toLocaleString()}${n < 0 ? ')' : ''}`
  }

  return (
    <tr>
      <td style={{ padding: '8px 0', fontWeight: bold ? 700 : 400, color: 'var(--tx)', fontSize: 13 }}>{label}</td>
      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: bold ? 700 : 400, color: negative ? '#EF4444' : 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>
        {fmtAmt(current)}
      </td>
      <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
        {pctRev > 0 ? `${Math.round(pctRev)}%` : ''}
      </td>
      <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--tx3)', fontVariantNumeric: 'tabular-nums' }}>
        {prior != null ? fmtAmt(prior) : ''}
      </td>
      <td style={{ padding: '8px 0', textAlign: 'right' }}>
        {renderChange(change)}
      </td>
    </tr>
  )
}

function renderChange(change: number | null | undefined) {
  if (change == null) return null
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: change > 0 ? '#22C55E' : change < 0 ? '#EF4444' : 'var(--tx3)' }}>
      {change > 0 ? '▲' : change < 0 ? '▼' : '–'} {Math.abs(change)}%
    </span>
  )
}

function CashMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function WaterfallChart({ revenue, cogs, fixed, net, sym, fmtCurrency }: {
  revenue: number; cogs: number; fixed: number; net: number; sym: string; fmtCurrency: (n: number) => string
}) {
  const maxVal = Math.max(revenue, 1)
  const barH = 32
  const items = [
    { label: 'Revenue', value: revenue, color: '#22C55E', width: (revenue / maxVal) * 100 },
    { label: 'COGS', value: -cogs, color: '#F97316', width: (cogs / maxVal) * 100 },
    { label: 'Fixed Costs', value: -fixed, color: '#EF4444', width: (fixed / maxVal) * 100 },
    { label: 'Net Profit', value: net, color: net >= 0 ? '#22C55E' : '#EF4444', width: (Math.abs(net) / maxVal) * 100 },
  ]

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Cash Flow Waterfall</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 80, fontSize: 11, color: 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>{item.label}</div>
            <div style={{ flex: 1, height: barH, borderRadius: 6, background: 'var(--ev, #f3f2ef)', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', width: `${Math.max(item.width, 2)}%`,
                background: item.color, borderRadius: 6,
                display: 'flex', alignItems: 'center', paddingLeft: 8,
                transition: 'width 400ms ease',
              }}>
                {item.width > 15 && (
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>
                    {item.value < 0 ? '−' : ''}{fmtCurrency(Math.abs(item.value))}
                  </span>
                )}
              </div>
            </div>
            {item.width <= 15 && (
              <span style={{ fontSize: 10, color: item.color, fontWeight: 600, flexShrink: 0 }}>
                {item.value < 0 ? '−' : ''}{fmtCurrency(Math.abs(item.value))}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
