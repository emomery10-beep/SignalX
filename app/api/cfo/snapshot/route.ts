import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/get-currency'
import { getDateRange } from '@/lib/cfo-date-range'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SOURCE_LABELS: Record<string, string> = {
  shopify: 'Shopify',
  amazon_fba: 'Amazon',
  ebay: 'eBay',
  etsy: 'Etsy',
  pos: 'POS',
  stripe: 'Stripe',
  google_sheets: 'Google Sheets',
  manual_csv: 'Manual CSV',
  woocommerce: 'WooCommerce',
  square: 'Square',
  tiktok_shop: 'TikTok Shop',
  jumia: 'Jumia',
  takealot: 'Takealot',
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currencySymbol: sym, countryCode } = await getUserLocale(supabase, user.id)
  const params = new URL(request.url).searchParams
  const now = new Date()

  const periodKey = params.get('period') || 'this_month'
  const { start, end, compStart, compEnd } = getDateRange(periodKey, now)

  // 6-month lookback for pnl_monthly — always anchored to TODAY, not the period's end date
  // so that "Last Month" view doesn't truncate the forecast window
  const todayStr = now.toISOString().split('T')[0]
  const sixMonthsAgoDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const sixMonthsAgo = sixMonthsAgoDate.toISOString().split('T')[0]

  const [
    { data: unified },
    { data: unifiedComp },
    { data: posTx },
    { data: posTxComp },
    { data: posItemsComp },
    { data: overridesRow },
    { data: latestHealth },
    { data: posProducts },
    { data: shipments },
    { data: receivables },
    { data: unified6m },
    { data: posTx6m },
    { data: posItemRows },
    { data: posItems6m },
    { data: cfoExpenses },
    { data: cfoExpenses6m },
    { data: cfoExpensesComp },
  ] = await Promise.all([
    supabase
      .from('unified_data')
      .select('record_date, gross_revenue, total_cost, gross_margin, cost_price, units_sold, product_name, category, source_type')
      .eq('user_id', user.id)
      .neq('source_type', 'pos')                    // POS revenue captured via pos_transactions — exclude to prevent double-counting
      .gte('record_date', start)
      .lte('record_date', end)
      .order('record_date', { ascending: true })
      .limit(5000),
    supabase
      .from('unified_data')
      .select('record_date, gross_revenue, total_cost, cost_price, units_sold, source_type')
      .eq('user_id', user.id)
      .neq('source_type', 'pos')                    // same guard for comparison period
      .gte('record_date', compStart)
      .lte('record_date', compEnd)
      .limit(5000),
    supabase
      .from('pos_transactions')
      .select('total, created_at, status')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', start + 'T00:00:00')
      .lte('created_at', end + 'T23:59:59')
      .limit(5000),
    supabase
      .from('pos_transactions')
      .select('total, created_at, status')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', compStart + 'T00:00:00')
      .lte('created_at', compEnd + 'T23:59:59')
      .limit(5000),
    // Comparison period POS line items — needed to compute comp-period COGS accurately
    supabase
      .from('pos_transactions')
      .select('created_at, pos_items!transaction_id(qty, cost_price)')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', compStart + 'T00:00:00')
      .lte('created_at', compEnd + 'T23:59:59')
      .limit(5000),
    supabase
      .from('cost_profile_overrides')
      .select('overrides')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('health_scores')
      .select('score, label, components, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('inventory')
      .select('id, name, sale_price, cost_price, stock_qty, low_stock_threshold, category')
      .eq('owner_id', user.id)
      .eq('active', true)
      .limit(500),
    supabase
      .from('shipments')
      .select('tracking_number, carrier_name, track_status, total_value, unit_cost, quantity, delay_days, daily_financing_cost, financial_impact, working_capital_days, order_date, expected_arrival, actual_arrival, is_at_risk, shipment_type')
      .eq('user_id', user.id)
      .in('track_status', ['InTransit', 'Pickup', 'Pending', 'OutForDelivery'])
      .limit(200),
    supabase
      .from('cfo_receivables')
      .select('type, amount, status')
      .eq('user_id', user.id),
    supabase
      .from('unified_data')
      .select('record_date, gross_revenue, total_cost, cost_price, units_sold')
      .eq('user_id', user.id)
      .neq('source_type', 'pos')                    // exclude POS — captured via pos_transactions
      .gte('record_date', sixMonthsAgo)
      .lte('record_date', todayStr)
      .order('record_date', { ascending: true })
      .limit(10000),
    supabase
      .from('pos_transactions')
      .select('total, created_at')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', sixMonthsAgo + 'T00:00:00')
      .lte('created_at', todayStr + 'T23:59:59')      // always today, not period end
      .limit(10000),
    // Stage 1a: POS line items — current period (for COGS + margin_by_product)
    supabase
      .from('pos_transactions')
      .select('created_at, status, pos_items!transaction_id(name, qty, unit_price, cost_price)')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', start + 'T00:00:00')
      .lte('created_at', end + 'T23:59:59')
      .limit(5000),
    // Stage 1b: POS line items — 6-month window (for pnl_monthly COGS)
    supabase
      .from('pos_transactions')
      .select('created_at, pos_items!transaction_id(qty, cost_price)')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', sixMonthsAgo + 'T00:00:00')
      .lte('created_at', todayStr + 'T23:59:59')      // always today, not period end
      .limit(10000),
    // Stage 2a: tracked expenses — current period (split by category into COGS or fixed costs)
    supabase
      .from('cfo_expenses')
      .select('date, amount, category')
      .eq('user_id', user.id)
      .gte('date', start)
      .lte('date', end),
    // Stage 2b: tracked expenses — 6-month window (for pnl_monthly)
    supabase
      .from('cfo_expenses')
      .select('date, amount, category')
      .eq('user_id', user.id)
      .gte('date', sixMonthsAgo)
      .lte('date', todayStr),                          // always today, not period end
    // Stage 2c: tracked expenses — comparison period (for apples-to-apples net profit)
    supabase
      .from('cfo_expenses')
      .select('date, amount, category')
      .eq('user_id', user.id)
      .gte('date', compStart)
      .lte('date', compEnd),
  ])

  const overrides = (overridesRow?.overrides || {}) as Record<string, any>
  const monthlyFixedCosts =
    overrides.monthly_fixed_costs || overrides.monthlyFixedCosts ||
    Number(params.get('monthly_fixed_costs') || 0)
  const cashBalance =
    overrides.cash_balance || overrides.cashBalance ||
    Number(params.get('cash_balance') || 0)

  // --- Stage 2: Split tracked expenses — supplier purchases → COGS, everything else → fixed costs ---
  const COGS_CATEGORIES = new Set(['Supplier / Stock Purchase'])
  const trackedExpensesTotal = (cfoExpenses || [])
    .filter(e => !COGS_CATEGORIES.has(e.category))
    .reduce((s, e) => s + (e.amount || 0), 0)
  const trackedCogsTotal = (cfoExpenses || [])
    .filter(e => COGS_CATEGORIES.has(e.category))
    .reduce((s, e) => s + (e.amount || 0), 0)

  // --- Stage 1: Build a date→COGS map from POS line items (current period) ---
  const posItemCogsMap = new Map<string, number>()
  for (const tx of posItemRows || []) {
    const date = ((tx as any).created_at || '').split('T')[0]
    if (!date) continue
    const items = (tx as any).pos_items || []
    let txCogs = 0
    for (const it of items) {
      txCogs += (Number(it.qty) || 0) * (Number(it.cost_price) || 0)
    }
    if (txCogs > 0) {
      posItemCogsMap.set(date, (posItemCogsMap.get(date) || 0) + txCogs)
    }
  }

  // --- Aggregate current period ---
  const dailyMap = new Map<string, { revenue: number; cogs: number }>()
  const sourceMap = new Map<string, { revenue: number; cogs: number; orders: number }>()

  for (const r of unified || []) {
    const date = r.record_date
    if (!dailyMap.has(date)) dailyMap.set(date, { revenue: 0, cogs: 0 })
    const d = dailyMap.get(date)!
    const rev = r.gross_revenue || 0
    const cost = r.total_cost || (r.cost_price || 0) * (r.units_sold || 0)
    d.revenue += rev
    d.cogs += cost

    const src = r.source_type || 'unknown'
    if (!sourceMap.has(src)) sourceMap.set(src, { revenue: 0, cogs: 0, orders: 0 })
    const sm = sourceMap.get(src)!
    sm.revenue += rev
    sm.cogs += cost
    sm.orders += 1
  }
  for (const tx of posTx || []) {
    const date = (tx.created_at || '').split('T')[0]
    if (!date) continue
    if (!dailyMap.has(date)) dailyMap.set(date, { revenue: 0, cogs: 0 })
    const posRev = tx.total || 0
    dailyMap.get(date)!.revenue += posRev

    if (!sourceMap.has('pos')) sourceMap.set('pos', { revenue: 0, cogs: 0, orders: 0 })
    const posSource = sourceMap.get('pos')!
    posSource.revenue += posRev
    posSource.orders += 1
  }
  // Inject POS COGS once per date (not once per transaction — avoids double-counting)
  for (const [date, cogs] of posItemCogsMap.entries()) {
    if (!dailyMap.has(date)) dailyMap.set(date, { revenue: 0, cogs: 0 })
    dailyMap.get(date)!.cogs += cogs
  }
  // Set total POS COGS on sourceMap in one pass
  const totalPosItemCogs = Array.from(posItemCogsMap.values()).reduce((s, c) => s + c, 0)
  if (sourceMap.has('pos')) sourceMap.get('pos')!.cogs = totalPosItemCogs

  const dailyData = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }))

  const totalRevenue = dailyData.reduce((s, d) => s + d.revenue, 0)
  // Only add expense-tracked COGS when POS has no cost-price data — prevents double-counting
  // for merchants whose POS already records COGS via product cost prices.
  const totalPosCogs = dailyData.reduce((s, d) => s + d.cogs, 0)
  const totalCogs = totalPosCogs > 0 ? totalPosCogs : totalPosCogs + trackedCogsTotal
  // (totalPosItemCogs is used above for sourceMap only — totalPosCogs includes all COGS sources)
  const periodDays = Math.max(daysBetween(start, end), 1)
  // Stage 2: fixed costs = overhead estimate (pro-rated) + non-COGS tracked expenses
  const overheadForPeriod = (monthlyFixedCosts / 30) * periodDays
  const fixedCostsForPeriod = overheadForPeriod + trackedExpensesTotal
  const grossProfit = totalRevenue - totalCogs
  const netProfit = grossProfit - fixedCostsForPeriod
  const grossMarginPct = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
  const netMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  // --- Aggregate comparison period ---
  let compRevenue = 0, compCogs = 0
  for (const r of unifiedComp || []) {
    compRevenue += r.gross_revenue || 0
    compCogs += r.total_cost || (r.cost_price || 0) * (r.units_sold || 0)
  }
  for (const tx of posTxComp || []) {
    compRevenue += tx.total || 0
  }
  // Add comparison-period POS COGS from line items (mirrors current-period logic)
  let compPosCogs = 0
  for (const tx of posItemsComp || []) {
    for (const it of (tx as any).pos_items || []) {
      compPosCogs += (Number(it.qty) || 0) * (Number(it.cost_price) || 0)
    }
  }
  // Comparison-period tracked expenses — split same way as current period
  const compTrackedExpensesTotal = (cfoExpensesComp || [])
    .filter(e => !COGS_CATEGORIES.has(e.category))
    .reduce((s: number, e: any) => s + (e.amount || 0), 0)
  const compTrackedCogsTotal = (cfoExpensesComp || [])
    .filter(e => COGS_CATEGORIES.has(e.category))
    .reduce((s: number, e: any) => s + (e.amount || 0), 0)
  // Use POS COGS if available, else fall back to unified_data COGS + expense-tracked COGS
  compCogs = compPosCogs > 0 ? compPosCogs : compCogs + compTrackedCogsTotal
  const compGrossProfit = compRevenue - compCogs
  const compPeriodDays = Math.max(daysBetween(compStart, compEnd), 1)
  // Include comparison-period tracked expenses so net profit comparison is apples-to-apples
  const compFixed = (monthlyFixedCosts / 30) * compPeriodDays + compTrackedExpensesTotal
  const compNetProfit = compGrossProfit - compFixed
  const compGrossMarginPct = compRevenue > 0 ? (compGrossProfit / compRevenue) * 100 : 0

  // --- Inventory metrics (table is 'inventory', fields: sale_price, stock_qty) ---
  const products = posProducts || []
  const totalProducts = products.length
  const lowOrOos = products.filter(p => {
    const threshold = p.low_stock_threshold || 5
    return (p.stock_qty || 0) <= threshold
  }).length
  const inventoryValueAtCost = products.reduce((s, p) => s + ((p.cost_price || 0) * (p.stock_qty || 0)), 0)
  const inventoryValueAtRetail = products.reduce((s, p) => s + ((p.sale_price || 0) * (p.stock_qty || 0)), 0)
  const stockoutRate = totalProducts > 0 ? (lowOrOos / totalProducts) * 100 : 0

  // --- Cash runway ---
  const dailyFixed = (overheadForPeriod + trackedExpensesTotal) / periodDays
  const dailyNetBurn = (totalRevenue / periodDays) - (totalCogs / periodDays) - dailyFixed
  // dailyTotalCosts = all spending regardless of revenue (COGS + fixed overhead + tracked expenses)
  const dailyTotalCosts = (totalCogs / periodDays) + dailyFixed
  let runwayMonths: number | null = null
  let runwayStatus: 'critical' | 'warning' | 'healthy' | 'strong' | 'unknown' = 'unknown'
  if (cashBalance > 0 && dailyTotalCosts > 0) {
    if (dailyNetBurn < 0) {
      // Burning cash: runway = balance / net burn rate
      const runwayDays = cashBalance / Math.abs(dailyNetBurn)
      runwayMonths = Math.round((runwayDays / 30) * 10) / 10
    } else {
      // Profitable: show conservative "zero-revenue survival" runway = balance / total costs
      const runwayDays = cashBalance / dailyTotalCosts
      runwayMonths = Math.round((runwayDays / 30) * 10) / 10
    }
    if (runwayMonths <= 1) runwayStatus = 'critical'
    else if (runwayMonths <= 3) runwayStatus = 'warning'
    else if (runwayMonths <= 6) runwayStatus = 'healthy'
    else runwayStatus = 'strong'
  } else if (cashBalance <= 0) {
    runwayStatus = 'unknown'
  } else {
    runwayStatus = 'strong'
  }

  // --- Alerts ---
  const alerts: Array<{ type: string; severity: 'critical' | 'warning' | 'info'; message: string; tab?: string }> = []

  const revChangePct = compRevenue > 0 ? ((totalRevenue - compRevenue) / compRevenue) * 100 : 0
  if (revChangePct < -20) {
    alerts.push({ type: 'revenue_cliff', severity: 'critical', message: `Revenue down ${Math.abs(Math.round(revChangePct))}% vs prior period`, tab: 'pnl' })
  }
  if (grossMarginPct > 0 && compGrossMarginPct > 0 && (compGrossMarginPct - grossMarginPct) > 5) {
    alerts.push({ type: 'margin_erosion', severity: 'warning', message: `Gross margin dropped from ${compGrossMarginPct.toFixed(1)}% to ${grossMarginPct.toFixed(1)}%`, tab: 'margins' })
  }
  if (runwayStatus === 'critical') {
    alerts.push({ type: 'cash_danger', severity: 'critical', message: `Cash runway under ${runwayMonths} months at current burn`, tab: 'cashflow' })
  }
  if (stockoutRate > 50) {
    alerts.push({ type: 'stockout', severity: 'warning', message: `${Math.round(stockoutRate)}% of products are low or out of stock (${lowOrOos} of ${totalProducts})`, tab: 'inventory' })
  }
  if (netProfit < 0 && totalRevenue > 0) {
    alerts.push({ type: 'net_loss', severity: 'critical', message: `Operating at a net loss of ${sym}${Math.abs(Math.round(netProfit)).toLocaleString()} this period`, tab: 'pnl' })
  }

  // --- KPI cards ---
  const pctChange = (curr: number, prev: number) => prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null

  // Sparkline: cumulative daily values for trend visualization
  const revenueSparkline = dailyData.map(d => d.revenue)
  const grossProfitSparkline = dailyData.map(d => d.revenue - d.cogs)
  const netSparkline = dailyData.map(d => d.revenue - d.cogs - dailyFixed)

  const kpis = [
    {
      key: 'revenue',
      label: 'Revenue',
      value: totalRevenue,
      change: pctChange(totalRevenue, compRevenue),
      status: revChangePct >= 5 ? 'green' : revChangePct >= 0 ? 'yellow' : 'red',
      sparkline: revenueSparkline,
    },
    {
      key: 'gross_profit',
      label: 'Gross Profit',
      value: grossProfit,
      subValue: `${grossMarginPct.toFixed(1)}% margin`,
      change: pctChange(grossProfit, compGrossProfit),
      status: grossMarginPct >= 35 ? 'green' : grossMarginPct >= 20 ? 'yellow' : 'red',
      sparkline: grossProfitSparkline,
    },
    {
      key: 'net_profit',
      label: 'Net Profit',
      value: netProfit,
      subValue: `${netMarginPct.toFixed(1)}% of revenue`,
      change: pctChange(netProfit, compNetProfit),
      status: netProfit >= 0 ? 'green' : 'red',
      sparkline: netSparkline,
    },
    {
      key: 'cash_runway',
      label: 'Cash Runway',
      value: runwayMonths,
      valueLabel: runwayMonths != null ? `${runwayMonths} mo` : 'Set balance',
      status: runwayStatus === 'strong' ? 'green' : runwayStatus === 'healthy' ? 'green' : runwayStatus === 'warning' ? 'yellow' : runwayStatus === 'critical' ? 'red' : 'gray',
    },
    {
      key: 'inventory',
      label: 'Inventory Value',
      value: inventoryValueAtCost,
      subValue: `${totalProducts} products · ${lowOrOos} low/OOS`,
      status: stockoutRate < 30 ? 'green' : stockoutRate < 50 ? 'yellow' : 'red',
    },
    {
      key: 'health',
      label: 'Health Score',
      value: latestHealth?.score ?? null,
      valueLabel: latestHealth?.score != null ? `${latestHealth.score}/100` : '—',
      subValue: latestHealth?.label || '',
      status: (latestHealth?.score ?? 0) >= 65 ? 'green' : (latestHealth?.score ?? 0) >= 45 ? 'yellow' : 'red',
    },
  ]

  // --- Per-source breakdown ---
  const sourceBreakdown = Array.from(sourceMap.entries())
    .map(([source, d]) => ({
      source,
      label: SOURCE_LABELS[source] || source.charAt(0).toUpperCase() + source.slice(1).replace(/_/g, ' '),
      revenue: Math.round(d.revenue),
      cogs: Math.round(d.cogs),
      gross_profit: Math.round(d.revenue - d.cogs),
      margin_pct: d.revenue > 0 ? Math.round(((d.revenue - d.cogs) / d.revenue) * 100) : 0,
      orders: d.orders,
      pct_of_total: totalRevenue > 0 ? Math.round((d.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // --- Logistics / Track17 ---
  const activeShipments = shipments || []
  const inTransitCount = activeShipments.length
  const inTransitValue = activeShipments.reduce((s, sh) => s + (sh.total_value || 0), 0)
  const delayedShipments = activeShipments.filter(sh => (sh.delay_days || 0) > 0)
  const delayedCount = delayedShipments.length
  const delayedValue = delayedShipments.reduce((s, sh) => s + (sh.total_value || 0), 0)
  const totalFinancingCost = activeShipments.reduce((s, sh) => s + (sh.financial_impact || 0), 0)
  const avgDeliveryDays = activeShipments.length > 0
    ? Math.round(activeShipments.reduce((s, sh) => s + (sh.working_capital_days || 0), 0) / activeShipments.length)
    : 0
  const atRiskCount = activeShipments.filter(sh => sh.is_at_risk).length

  // --- Receivables / Payables totals ---
  const receivableItems = receivables || []
  const totalReceivables = receivableItems.filter(r => r.type === 'receivable').reduce((s, r) => s + (r.amount || 0), 0)
  const totalPayables = receivableItems.filter(r => r.type === 'payable').reduce((s, r) => s + (r.amount || 0), 0)
  const overdueReceivables = receivableItems.filter(r => r.type === 'receivable' && r.status !== 'current').reduce((s, r) => s + (r.amount || 0), 0)

  // --- Daily chart data ---
  const chartData = dailyData.map(d => ({
    date: d.date,
    revenue: Math.round(d.revenue),
    cogs: Math.round(d.cogs),
    fixed: Math.round(dailyFixed),
    net: Math.round(d.revenue - d.cogs - dailyFixed),
  }))

  // --- Stage 1b + 2b: Build month→COGS map from POS line items (6-month) ---
  const posItems6mCogsMap = new Map<string, number>()
  for (const tx of posItems6m || []) {
    const month = ((tx as any).created_at || '').slice(0, 7)
    if (!month) continue
    const items = (tx as any).pos_items || []
    for (const it of items) {
      const cogs = (Number(it.qty) || 0) * (Number(it.cost_price) || 0)
      if (cogs > 0) posItems6mCogsMap.set(month, (posItems6mCogsMap.get(month) || 0) + cogs)
    }
  }

  // Build month→tracked expenses map (6-month), split by category
  const expensesMonthMap = new Map<string, number>()   // fixed costs
  const cogsExpensesMonthMap = new Map<string, number>() // supplier purchases → COGS
  for (const e of cfoExpenses6m || []) {
    const month = (e.date || '').slice(0, 7)
    if (!month) continue
    if (COGS_CATEGORIES.has(e.category)) {
      cogsExpensesMonthMap.set(month, (cogsExpensesMonthMap.get(month) || 0) + (e.amount || 0))
    } else {
      expensesMonthMap.set(month, (expensesMonthMap.get(month) || 0) + (e.amount || 0))
    }
  }

  // --- pnl_monthly: 6-month P&L aggregation ---
  const monthlyMap = new Map<string, { revenue: number; cogs: number }>()
  for (const r of unified6m || []) {
    const month = (r.record_date || '').slice(0, 7) // YYYY-MM
    if (!month) continue
    if (!monthlyMap.has(month)) monthlyMap.set(month, { revenue: 0, cogs: 0 })
    const m = monthlyMap.get(month)!
    m.revenue += r.gross_revenue || 0
    m.cogs += r.total_cost || (r.cost_price || 0) * (r.units_sold || 0)
  }
  for (const tx of posTx6m || []) {
    const month = (tx.created_at || '').slice(0, 7)
    if (!month) continue
    if (!monthlyMap.has(month)) monthlyMap.set(month, { revenue: 0, cogs: 0 })
    // Stage 1b: add POS COGS for this month
    monthlyMap.get(month)!.revenue += tx.total || 0
  }
  // Inject POS COGS into monthly map
  for (const [month, cogs] of posItems6mCogsMap.entries()) {
    if (!monthlyMap.has(month)) monthlyMap.set(month, { revenue: 0, cogs: 0 })
    monthlyMap.get(month)!.cogs += cogs
  }

  const pnlMonthly = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => {
      const rev = Math.round(v.revenue)
      const cogsSales = Math.round(v.cogs)
      const monthCogs = cogsExpensesMonthMap.get(month) || 0
      // Same rule: only use expense COGS when POS has no cost-price data for this month
      const cogs = cogsSales > 0 ? cogsSales : cogsSales + monthCogs
      const gp = rev - cogs
      // Stage 2b: fixed = overhead estimate + non-COGS tracked expenses for this month
      const monthExpenses = expensesMonthMap.get(month) || 0
      const fixed = Math.round(monthlyFixedCosts + monthExpenses)
      const net = gp - fixed
      return {
        month,
        revenue: rev,
        cogs,
        fixed,
        net,
        gross_margin_pct: rev > 0 ? Math.round((gp / rev) * 1000) / 10 : 0,
        net_margin_pct: rev > 0 ? Math.round((net / rev) * 1000) / 10 : 0,
      }
    })

  // --- margin_by_product: per-product margin from BOTH ecommerce (unified_data)
  //     and POS (pos_items) sales, so real POS products appear alongside any
  //     ecommerce sales. Zero-sales catalog entries (e.g. unsold demo-store
  //     products synced from a connected Shopify store) are filtered out below. ---
  const productMap = new Map<string, { category: string; revenue: number; cogs: number; units: number }>()
  for (const r of unified || []) {
    const name = r.product_name || 'Unknown'
    if (!productMap.has(name)) productMap.set(name, { category: r.category || '', revenue: 0, cogs: 0, units: 0 })
    const p = productMap.get(name)!
    p.revenue += r.gross_revenue || 0
    p.cogs += r.total_cost || (r.cost_price || 0) * (r.units_sold || 0)
    p.units += r.units_sold || 0
    if (!p.category && r.category) p.category = r.category
  }
  // Merge POS line-item sales
  for (const tx of posItemRows || []) {
    const items = (tx as any).pos_items || []
    for (const it of items) {
      const name = it.name || 'Unknown'
      const qty = Number(it.qty) || 0
      const unitPrice = Number(it.unit_price) || 0
      const costPrice = Number(it.cost_price) || 0
      if (!productMap.has(name)) productMap.set(name, { category: 'POS', revenue: 0, cogs: 0, units: 0 })
      const p = productMap.get(name)!
      p.revenue += qty * unitPrice
      p.cogs += qty * costPrice
      p.units += qty
    }
  }
  const marginByProduct = Array.from(productMap.entries())
    // Drop pure catalog noise: products that neither earned revenue nor sold a unit
    .filter(([, p]) => p.revenue > 0 || p.units > 0)
    .map(([name, p]) => ({
      name,
      category: p.category,
      revenue: Math.round(p.revenue),
      cogs: Math.round(p.cogs),
      margin_pct: p.revenue > 0 ? Math.round(((p.revenue - p.cogs) / p.revenue) * 1000) / 10 : 0,
      units: p.units,
      contribution: totalRevenue > 0 ? Math.round((p.revenue / totalRevenue) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 50)

  // --- receivables_aging ---
  const receivablesAging = { current: 0, overdue_30: 0, overdue_60: 0, overdue_90: 0 }
  for (const r of receivableItems) {
    if (r.type !== 'receivable') continue
    const amt = r.amount || 0
    if (r.status === 'current') receivablesAging.current += amt
    else if (r.status === 'overdue_30') receivablesAging.overdue_30 += amt
    else if (r.status === 'overdue_60') receivablesAging.overdue_60 += amt
    else if (r.status === 'overdue_90') receivablesAging.overdue_90 += amt
  }
  receivablesAging.current = Math.round(receivablesAging.current)
  receivablesAging.overdue_30 = Math.round(receivablesAging.overdue_30)
  receivablesAging.overdue_60 = Math.round(receivablesAging.overdue_60)
  receivablesAging.overdue_90 = Math.round(receivablesAging.overdue_90)

  // --- daily_cashflow ---
  const dailyCashflow = dailyData.map(d => ({
    date: d.date,
    inflow: Math.round(d.revenue),
    outflow: Math.round(d.cogs + dailyFixed),
    net: Math.round(d.revenue - d.cogs - dailyFixed),
  }))

  return NextResponse.json({
    period: { start, end, compStart, compEnd, key: periodKey },
    currency_symbol: sym,
    country_code: countryCode,
    kpis,
    alerts,
    chart: chartData,
    totals: {
      revenue: Math.round(totalRevenue),
      cogs: Math.round(totalCogs),
      gross_profit: Math.round(grossProfit),
      fixed_costs: Math.round(fixedCostsForPeriod),
      net_profit: Math.round(netProfit),
      gross_margin_pct: Math.round(grossMarginPct * 10) / 10,
      net_margin_pct: Math.round(netMarginPct * 10) / 10,
    },
    comparison: {
      revenue: Math.round(compRevenue),
      cogs: Math.round(compCogs),
      gross_profit: Math.round(compGrossProfit),
      net_profit: Math.round(compNetProfit),
      gross_margin_pct: Math.round(compGrossMarginPct * 10) / 10,
    },
    inventory: {
      total_products: totalProducts,
      low_or_oos: lowOrOos,
      stockout_rate: Math.round(stockoutRate),
      value_at_cost: Math.round(inventoryValueAtCost),
      value_at_retail: Math.round(inventoryValueAtRetail),
    },
    cash: {
      balance: cashBalance,
      monthly_fixed: monthlyFixedCosts,           // overhead estimate only (for Scenario Planner base)
      monthly_fixed_total: (() => {
        // Use average of completed months' fixed costs from pnl_monthly for a stable monthly rate
        const currentMonth = now.toISOString().slice(0, 7)
        const completed = pnlMonthly.filter(m => m.month < currentMonth && m.fixed > 0)
        if (completed.length > 0) {
          return Math.round(completed.reduce((s, m) => s + m.fixed, 0) / completed.length)
        }
        return Math.round(monthlyFixedCosts + trackedExpensesTotal)
      })(),
      tracked_expenses_total: Math.round(trackedExpensesTotal),
      runway_months: runwayMonths,
      runway_status: runwayStatus,
      daily_net_burn: Math.round(dailyNetBurn * 100) / 100,
    },
    data_quality: {
      days_with_data: dailyData.length,
      has_ecommerce: (unified?.length || 0) > 0,
      has_pos: (posTx?.length || 0) > 0,
      has_shipments: inTransitCount > 0,
    },
    source_breakdown: sourceBreakdown,
    logistics: {
      in_transit_count: inTransitCount,
      in_transit_value: Math.round(inTransitValue),
      delayed_count: delayedCount,
      delayed_value: Math.round(delayedValue),
      at_risk_count: atRiskCount,
      financing_cost: Math.round(totalFinancingCost),
      avg_delivery_days: avgDeliveryDays,
    },
    receivables_summary: {
      total_receivables: Math.round(totalReceivables),
      total_payables: Math.round(totalPayables),
      overdue_receivables: Math.round(overdueReceivables),
    },
    pnl_by_source: sourceBreakdown,
    pnl_monthly: pnlMonthly,
    margin_by_product: marginByProduct,
    margin_by_channel: sourceBreakdown,
    receivables_aging: receivablesAging,
    daily_cashflow: dailyCashflow,
  })
}

function daysBetween(a: string, b: string): number {
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1
}

