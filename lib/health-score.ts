// ── Business Health Score Engine ─────────────────────────────────────────────
// Calculates a 0-100 score from 5 weighted signals.
// Each signal is scored 0-20 then summed.

export interface HealthComponent {
  name: string
  score: number      // 0-20
  label: string      // plain English status
  status: 'good' | 'warning' | 'critical'
  detail: string
}

export interface HealthScore {
  score: number                 // 0-100
  label: string                 // 'Healthy' | 'Good' | 'At Risk' | 'Critical'
  color: 'green' | 'amber' | 'red'
  components: HealthComponent[]
  summary: string               // one-line plain English
  topIssue: string | null       // most important thing to fix
}

export interface HealthInput {
  rows: Record<string, unknown>[]
  headers: string[]
  previousRows?: Record<string, unknown>[]  // last period data
  cashBalance?: number
  monthlyFixedCosts?: number
  targetMargin?: number        // default 0.30
}

function findCol(headers: string[], ...keywords: string[]): string | null {
  const lower = headers.map(h => h.toLowerCase())
  for (const kw of keywords) {
    const idx = lower.findIndex(h => h.includes(kw))
    if (idx >= 0) return headers[idx]
  }
  return null
}

function num(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0
  const n = parseFloat(String(val).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? 0 : n
}

export function calculateHealthScore(input: HealthInput): HealthScore {
  const { rows, headers, previousRows, cashBalance, monthlyFixedCosts, targetMargin = 0.30 } = input

  if (!rows?.length) {
    return {
      score: 0, label: 'No Data', color: 'red',
      components: [],
      summary: 'Upload your sales data to calculate your Business Health Score.',
      topIssue: 'Connect your data to get started.',
    }
  }

  const components: HealthComponent[] = []

  // ── 1. MARGIN HEALTH (0-20) ───────────────────────────────────────────────
  const revenueCol  = findCol(headers, 'revenue', 'sales', 'price', 'total')
  const costCol     = findCol(headers, 'cost', 'cogs', 'supplier', 'purchase')
  const qtyCol      = findCol(headers, 'qty', 'quantity', 'units', 'sold')

  let totalRevenue = 0, totalCost = 0
  for (const r of rows) {
    const qty = qtyCol ? num(r[qtyCol]) : 1
    totalRevenue += revenueCol ? num(r[revenueCol]) * qty : 0
    totalCost    += costCol    ? num(r[costCol]) * qty    : 0
  }

  const grossMargin = totalRevenue > 0 ? (totalRevenue - totalCost) / totalRevenue : null
  let marginScore = 10
  let marginLabel = 'Unknown'
  let marginStatus: 'good' | 'warning' | 'critical' = 'warning'
  let marginDetail = 'Could not calculate margin — check your data has revenue and cost columns.'

  if (grossMargin !== null) {
    if (grossMargin >= targetMargin + 0.05) { marginScore = 20; marginLabel = 'Strong'; marginStatus = 'good'; marginDetail = `Gross margin at ${(grossMargin * 100).toFixed(1)}% — ${((grossMargin - targetMargin) * 100).toFixed(1)}pp above target.` }
    else if (grossMargin >= targetMargin)      { marginScore = 16; marginLabel = 'On target'; marginStatus = 'good'; marginDetail = `Gross margin at ${(grossMargin * 100).toFixed(1)}% — at target.` }
    else if (grossMargin >= targetMargin - 0.05) { marginScore = 10; marginLabel = 'Slipping'; marginStatus = 'warning'; marginDetail = `Gross margin at ${(grossMargin * 100).toFixed(1)}% — ${((targetMargin - grossMargin) * 100).toFixed(1)}pp below target.` }
    else if (grossMargin >= 0)               { marginScore = 4;  marginLabel = 'Danger zone'; marginStatus = 'critical'; marginDetail = `Gross margin at ${(grossMargin * 100).toFixed(1)}% — significantly below target. Action needed.` }
    else                                      { marginScore = 0;  marginLabel = 'Negative'; marginStatus = 'critical'; marginDetail = `Gross margin is negative — you are losing money on each sale.` }
  }
  components.push({ name: 'Margin Health', score: marginScore, label: marginLabel, status: marginStatus, detail: marginDetail })

  // ── 2. REVENUE TREND (0-20) ───────────────────────────────────────────────
  let trendScore = 10
  let trendLabel = 'Stable'
  let trendStatus: 'good' | 'warning' | 'critical' = 'warning'
  let trendDetail = 'No previous period data to compare against.'

  if (previousRows?.length && totalRevenue > 0) {
    let prevRevenue = 0
    for (const r of previousRows) {
      const qty = qtyCol ? num(r[qtyCol]) : 1
      prevRevenue += revenueCol ? num(r[revenueCol]) * qty : 0
    }
    if (prevRevenue > 0) {
      const change = (totalRevenue - prevRevenue) / prevRevenue
      if (change > 0.1)       { trendScore = 20; trendLabel = 'Growing'; trendStatus = 'good'; trendDetail = `Revenue up ${(change * 100).toFixed(1)}% vs last period.` }
      else if (change > 0)    { trendScore = 16; trendLabel = 'Slightly up'; trendStatus = 'good'; trendDetail = `Revenue up ${(change * 100).toFixed(1)}% vs last period.` }
      else if (change > -0.05){ trendScore = 12; trendLabel = 'Stable'; trendStatus = 'warning'; trendDetail = `Revenue stable vs last period (${(change * 100).toFixed(1)}%).` }
      else if (change > -0.15){ trendScore = 6;  trendLabel = 'Declining'; trendStatus = 'warning'; trendDetail = `Revenue down ${Math.abs(change * 100).toFixed(1)}% vs last period.` }
      else                    { trendScore = 0;  trendLabel = 'Sharp drop'; trendStatus = 'critical'; trendDetail = `Revenue down ${Math.abs(change * 100).toFixed(1)}% vs last period — investigate immediately.` }
    }
  }
  components.push({ name: 'Revenue Trend', score: trendScore, label: trendLabel, status: trendStatus, detail: trendDetail })

  // ── 3. STOCK POSITION (0-20) ──────────────────────────────────────────────
  const stockCol    = findCol(headers, 'stock', 'inventory', 'units left', 'on hand', 'remaining')
  const productCol  = findCol(headers, 'product', 'name', 'item', 'sku', 'description')

  let stockScore = 15
  let stockLabel = 'OK'
  let stockStatus: 'good' | 'warning' | 'critical' = 'warning'
  let stockDetail = 'No inventory data found.'

  if (stockCol && qtyCol) {
    const products: Record<string, { stock: number; sold: number }> = {}
    for (const r of rows) {
      const prod = productCol ? String(r[productCol] || 'Unknown') : 'Unknown'
      if (!products[prod]) products[prod] = { stock: 0, sold: 0 }
      products[prod].stock = Math.max(products[prod].stock, num(r[stockCol]))
      products[prod].sold += num(r[qtyCol])
    }
    const entries = Object.entries(products)
    const criticalCount = entries.filter(([, v]) => v.stock > 0 && v.sold > 0 && (v.stock / (v.sold / 30)) < 7).length
    const warningCount  = entries.filter(([, v]) => v.stock > 0 && v.sold > 0 && (v.stock / (v.sold / 30)) < 14).length

    if (criticalCount === 0 && warningCount === 0) { stockScore = 20; stockLabel = 'Well stocked'; stockStatus = 'good'; stockDetail = 'All products have healthy stock levels.' }
    else if (criticalCount === 0)                  { stockScore = 13; stockLabel = `${warningCount} low`; stockStatus = 'warning'; stockDetail = `${warningCount} product(s) have less than 14 days of stock remaining.` }
    else                                           { stockScore = 4;  stockLabel = `${criticalCount} critical`; stockStatus = 'critical'; stockDetail = `${criticalCount} product(s) have less than 7 days of stock — risk of stockout.` }
  }
  components.push({ name: 'Stock Position', score: stockScore, label: stockLabel, status: stockStatus, detail: stockDetail })

  // ── 4. CASH FLOW (0-20) ───────────────────────────────────────────────────
  let cashScore = 12
  let cashLabel = 'Unknown'
  let cashStatus: 'good' | 'warning' | 'critical' = 'warning'
  let cashDetail = 'Connect bank data or enter monthly costs for cash flow analysis.'

  if (cashBalance !== undefined && monthlyFixedCosts) {
    const runwayMonths = cashBalance / monthlyFixedCosts
    if (runwayMonths > 6)       { cashScore = 20; cashLabel = 'Strong'; cashStatus = 'good'; cashDetail = `${runwayMonths.toFixed(1)} months runway at current fixed costs.` }
    else if (runwayMonths > 3)  { cashScore = 15; cashLabel = 'Comfortable'; cashStatus = 'good'; cashDetail = `${runwayMonths.toFixed(1)} months runway — healthy but keep monitoring.` }
    else if (runwayMonths > 1.5){ cashScore = 8;  cashLabel = 'Tight'; cashStatus = 'warning'; cashDetail = `${runwayMonths.toFixed(1)} months runway — tighter than recommended.` }
    else                        { cashScore = 2;  cashLabel = 'Critical'; cashStatus = 'critical'; cashDetail = `Only ${runwayMonths.toFixed(1)} months of runway — urgent action needed.` }
  } else if (totalRevenue > 0) {
    // Estimate from revenue
    const estimatedMonthlyProfit = (totalRevenue - totalCost) / Math.max(rows.length / 30, 1)
    if (estimatedMonthlyProfit > 0)  { cashScore = 14; cashLabel = 'Profitable'; cashStatus = 'good'; cashDetail = 'Business appears cash flow positive based on your data.' }
    else                             { cashScore = 3;  cashLabel = 'Unprofitable'; cashStatus = 'critical'; cashDetail = 'Costs appear to exceed revenue — review your cost structure.' }
  }
  components.push({ name: 'Cash Flow', score: cashScore, label: cashLabel, status: cashStatus, detail: cashDetail })

  // ── 5. PRODUCT DIVERSITY (0-20) ───────────────────────────────────────────
  let diversityScore = 12
  let diversityLabel = 'OK'
  let diversityStatus: 'good' | 'warning' | 'critical' = 'warning'
  let diversityDetail = 'No product data to analyse.'

  if (productCol && qtyCol) {
    const productRevenue: Record<string, number> = {}
    for (const r of rows) {
      const prod = String(r[productCol] || 'Unknown')
      if (!productRevenue[prod]) productRevenue[prod] = 0
      const qty = num(r[qtyCol])
      const price = revenueCol ? num(r[revenueCol]) : 1
      productRevenue[prod] += qty * price
    }
    const products = Object.entries(productRevenue).sort((a, b) => b[1] - a[1])
    const totalRev = products.reduce((s, [, v]) => s + v, 0)
    const topProductShare = totalRev > 0 ? (products[0]?.[1] || 0) / totalRev : 0
    const productCount = products.length

    if (productCount >= 10 && topProductShare < 0.4)  { diversityScore = 20; diversityLabel = 'Diversified'; diversityStatus = 'good'; diversityDetail = `${productCount} products, top product is ${(topProductShare * 100).toFixed(0)}% of revenue.` }
    else if (productCount >= 5 && topProductShare < 0.6) { diversityScore = 14; diversityLabel = 'Moderate'; diversityStatus = 'good'; diversityDetail = `${productCount} products, top product is ${(topProductShare * 100).toFixed(0)}% of revenue.` }
    else if (topProductShare > 0.8)                   { diversityScore = 5;  diversityLabel = 'High risk'; diversityStatus = 'critical'; diversityDetail = `${(topProductShare * 100).toFixed(0)}% of revenue from one product — high concentration risk.` }
    else                                               { diversityScore = 10; diversityLabel = 'Limited'; diversityStatus = 'warning'; diversityDetail = `${productCount} products — consider diversifying your range.` }
  }
  components.push({ name: 'Product Mix', score: diversityScore, label: diversityLabel, status: diversityStatus, detail: diversityDetail })

  // ── FINAL SCORE ───────────────────────────────────────────────────────────
  const total = components.reduce((s, c) => s + c.score, 0)
  const label = total >= 80 ? 'Healthy' : total >= 65 ? 'Good' : total >= 45 ? 'At Risk' : 'Critical'
  const color = total >= 65 ? 'green' : total >= 45 ? 'amber' : 'red'

  const criticalComponents = components.filter(c => c.status === 'critical')
  const warningComponents = components.filter(c => c.status === 'warning')

  const topIssue = criticalComponents[0]?.detail || warningComponents[0]?.detail || null

  const summaryMap: Record<string, string> = {
    Healthy: `Your business is in strong shape. Score: ${total}/100.`,
    Good: `Business is performing well with some areas to watch. Score: ${total}/100.`,
    'At Risk': `Several metrics need attention. Score: ${total}/100. Focus on ${criticalComponents[0]?.name || 'your weakest area'}.`,
    Critical: `Business health is critical. Score: ${total}/100. Immediate action required on ${criticalComponents[0]?.name || 'key metrics'}.`,
  }

  return { score: total, label, color, components, summary: summaryMap[label], topIssue }
}

// ── Anomaly Detection ─────────────────────────────────────────────────────────
export interface Anomaly {
  type: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  body: string
  product?: string
  metric?: string
  value?: number
  threshold?: number
  prompt: string
}

export function detectAnomalies(
  rows: Record<string, unknown>[],
  headers: string[],
  previousRows?: Record<string, unknown>[]
): Anomaly[] {
  const anomalies: Anomaly[] = []
  if (!rows?.length) return anomalies

  const productCol = findCol(headers, 'product', 'name', 'item', 'sku')
  const qtyCol     = findCol(headers, 'qty', 'quantity', 'units', 'sold')
  const revenueCol = findCol(headers, 'revenue', 'sales', 'price', 'total')
  const costCol    = findCol(headers, 'cost', 'cogs', 'supplier')
  const stockCol   = findCol(headers, 'stock', 'inventory', 'units left')

  if (!productCol || !qtyCol) return anomalies

  // Build product-level aggregates
  const current: Record<string, { qty: number; revenue: number; cost: number; stock: number }> = {}
  for (const r of rows) {
    const prod = String(r[productCol] || 'Unknown')
    if (!current[prod]) current[prod] = { qty: 0, revenue: 0, cost: 0, stock: 0 }
    current[prod].qty     += num(r[qtyCol])
    current[prod].revenue += revenueCol ? num(r[revenueCol]) * num(r[qtyCol]) : 0
    current[prod].cost    += costCol    ? num(r[costCol]) * num(r[qtyCol])    : 0
    current[prod].stock    = stockCol   ? Math.max(current[prod].stock, num(r[stockCol])) : 0
  }

  const previous: Record<string, { qty: number; revenue: number; cost: number }> = {}
  if (previousRows?.length) {
    for (const r of previousRows) {
      const prod = String(r[productCol] || 'Unknown')
      if (!previous[prod]) previous[prod] = { qty: 0, revenue: 0, cost: 0 }
      previous[prod].qty     += num(r[qtyCol])
      previous[prod].revenue += revenueCol ? num(r[revenueCol]) * num(r[qtyCol]) : 0
      previous[prod].cost    += costCol    ? num(r[costCol]) * num(r[qtyCol])    : 0
    }
  }

  for (const [prod, data] of Object.entries(current)) {
    // Stockout risk
    if (stockCol && data.stock > 0 && data.qty > 0) {
      const dailyVelocity = data.qty / 30
      const daysLeft = data.stock / dailyVelocity
      if (daysLeft < 7) {
        anomalies.push({
          type: 'stockout_risk', severity: 'critical',
          title: `${prod} — ${Math.floor(daysLeft)} days of stock left`,
          body: `At current sales velocity, you'll run out of ${prod} in ${Math.floor(daysLeft)} days. Your supplier typically takes 14 days to deliver.`,
          product: prod, metric: 'days_remaining', value: daysLeft, threshold: 14,
          prompt: `I have ${Math.floor(data.stock)} units of ${prod} left and I'm selling ${dailyVelocity.toFixed(1)} per day. How urgently do I need to reorder and what quantity should I order?`,
        })
      } else if (daysLeft < 14) {
        anomalies.push({
          type: 'stockout_risk', severity: 'warning',
          title: `${prod} — ${Math.floor(daysLeft)} days of stock left`,
          body: `${prod} will need restocking within 2 weeks. Plan your reorder now to avoid a stockout.`,
          product: prod, metric: 'days_remaining', value: daysLeft, threshold: 14,
          prompt: `${prod} has ${Math.floor(daysLeft)} days of stock remaining. What should my reorder quantity be and when should I place the order?`,
        })
      }
    }

    // Margin drop
    if (data.revenue > 0 && data.cost > 0) {
      const margin = (data.revenue - data.cost) / data.revenue
      if (margin < 0) {
        anomalies.push({
          type: 'margin_drop', severity: 'critical',
          title: `${prod} — negative margin`,
          body: `You are losing money on every sale of ${prod}. Current cost (${((data.cost / data.qty)).toFixed(2)}) exceeds revenue (${((data.revenue / data.qty)).toFixed(2)}).`,
          product: prod, metric: 'gross_margin', value: margin,
          prompt: `${prod} has a negative gross margin of ${(margin * 100).toFixed(1)}%. What should I do — raise the price, find a cheaper supplier, or discontinue it?`,
        })
      } else if (margin < 0.15) {
        anomalies.push({
          type: 'margin_drop', severity: 'warning',
          title: `${prod} — low margin (${(margin * 100).toFixed(1)}%)`,
          body: `${prod} is generating only ${(margin * 100).toFixed(1)}% gross margin — below the healthy threshold of 15%. This needs attention.`,
          product: prod, metric: 'gross_margin', value: margin, threshold: 0.15,
          prompt: `${prod} has a gross margin of only ${(margin * 100).toFixed(1)}%. What are my options to improve this — pricing, cost reduction, or discontinuation?`,
        })
      }
    }

    // Sales velocity change
    if (previousRows?.length && previous[prod]) {
      const change = previous[prod].qty > 0 ? (data.qty - previous[prod].qty) / previous[prod].qty : 0
      if (change < -0.3) {
        anomalies.push({
          type: 'velocity_spike', severity: 'warning',
          title: `${prod} — sales down ${Math.abs(change * 100).toFixed(0)}%`,
          body: `${prod} sales dropped ${Math.abs(change * 100).toFixed(0)}% compared to last period. Sold ${data.qty} vs ${previous[prod].qty} previously.`,
          product: prod, metric: 'sales_change', value: change,
          prompt: `Sales of ${prod} have dropped ${Math.abs(change * 100).toFixed(0)}% this period vs last period. What could be causing this and what should I do?`,
        })
      } else if (change > 0.5) {
        anomalies.push({
          type: 'velocity_spike', severity: 'info',
          title: `${prod} — sales up ${(change * 100).toFixed(0)}%`,
          body: `${prod} is selling ${(change * 100).toFixed(0)}% faster than last period. Make sure you have enough stock to sustain this.`,
          product: prod, metric: 'sales_change', value: change,
          prompt: `${prod} sales are up ${(change * 100).toFixed(0)}% this period. Do I have enough stock to sustain this, and should I increase my next reorder?`,
        })
      }
    }
  }

  return anomalies.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })
}
