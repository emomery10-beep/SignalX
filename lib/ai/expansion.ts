// ============================================================
// SignalX Expansion Intelligence Engine
// Runs silently in the background when expansion questions detected
// ============================================================

export interface ExpansionCandidate {
  candidate_name: string
  candidate_type: 'variant_extension' | 'adjacent_category' | 'bundle' | 'geographic' | 'trend_led'
  opportunity_score: number
  why_it_fits: string
  evidence: {
    internal_demand: string
    trend_signal: string
    margin_signal: string
    customer_fit: string
  }
  financial: {
    estimated_margin_pct: number
    estimated_monthly_revenue: number
    break_even_units: number
    recommended_opening_order: number
    suggested_price_range: string
  }
  risks: string[]
  cannibalization: {
    risk_level: 'low' | 'medium' | 'high'
    affected_skus: string[]
    explanation: string
  }
  launch: {
    best_region: string
    best_channel: string
    test_length_days: number
    success_threshold: string
  }
  confidence: 'low' | 'medium' | 'high'
}

export interface SimulatorResult {
  gross_margin_pct: number
  contribution_margin_pct: number
  break_even_units: number
  projected_monthly_profit: number
  months_to_recover: number
  stockout_risk: 'low' | 'medium' | 'high'
  dead_stock_risk: 'low' | 'medium' | 'high'
  suggested_price_adjustment: string
  verdict: string
}

export interface DataSummary {
  topProducts: Array<{ name: string; revenue: number; margin: number; units: number }>
  categories: string[]
  avgMargin: number
  totalRevenue: number
  regions: string[]
  currency: string
  symbol: string
}

// ── Detect if a question is expansion-related ─────────────────
export function isExpansionQuestion(text: string): boolean {
  const patterns = [
    /what.*launch/i,
    /what.*expand/i,
    /new product/i,
    /product line/i,
    /what.*sell next/i,
    /what.*add next/i,
    /should i.*stock/i,
    /opportunity/i,
    /expand.*into/i,
    /adjacent/i,
    /cannib/i,
    /simulate.*price/i,
    /simulate.*profit/i,
    /opening order/i,
    /test.*market/i,
    /which.*market/i,
    /where.*launch/i,
    /what.*region/i,
    /low.risk.*product/i,
    /high.*margin.*product/i,
    /safest.*product/i,
  ]
  return patterns.some(p => p.test(text))
}

// ── Build data summary from uploaded dataset ──────────────────
export function buildDataSummary(
  rows: Record<string, unknown>[],
  headers: string[],
  currency: string,
  symbol: string
): DataSummary {
  const lh = headers.map(h => h.toLowerCase())
  const nameCol   = headers[lh.findIndex(h => /name|product|item|title/i.test(h))] || headers[0]
  const priceCol  = headers[lh.findIndex(h => /price|revenue|amount|sales/i.test(h))]
  const costCol   = headers[lh.findIndex(h => /cost/i.test(h))]
  const marginCol = headers[lh.findIndex(h => /margin/i.test(h))]
  const qtyCol    = headers[lh.findIndex(h => /qty|quantity|units|sold/i.test(h))]
  const catCol    = headers[lh.findIndex(h => /cat|category|type|dept/i.test(h))]
  const regionCol = headers[lh.findIndex(h => /region|country|location/i.test(h))]

  const products = rows.map(r => {
    const price  = Number(r[priceCol] || 0)
    const cost   = Number(r[costCol] || 0)
    const qty    = Number(r[qtyCol] || 1)
    const margin = marginCol && Number(r[marginCol]) > 0
      ? Number(r[marginCol])
      : price > 0 && cost > 0 ? ((price - cost) / price) * 100 : 0
    const revenue = price * qty
    return {
      name: String(r[nameCol] || 'Unknown'),
      revenue,
      margin: Math.round(margin * 10) / 10,
      units: qty,
      category: catCol ? String(r[catCol] || '') : '',
      region: regionCol ? String(r[regionCol] || '') : '',
      price,
      cost,
    }
  }).filter(p => p.revenue > 0)

  const sorted = [...products].sort((a, b) => b.revenue - a.revenue)
  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0)
  const avgMargin = products.length
    ? products.reduce((s, p) => s + p.margin, 0) / products.length
    : 0
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  const regions = [...new Set(products.map(p => p.region).filter(Boolean))]

  return {
    topProducts: sorted.slice(0, 10).map(p => ({
      name: p.name, revenue: p.revenue, margin: p.margin, units: p.units
    })),
    categories,
    avgMargin: Math.round(avgMargin * 10) / 10,
    totalRevenue,
    regions,
    currency,
    symbol,
  }
}

// ── Expansion simulator ────────────────────────────────────────
export function runSimulator(inputs: {
  sell_price: number
  landed_cost: number
  packaging_cost: number
  shipping_cost: number
  platform_fee_pct: number
  expected_monthly_units: number
  return_rate_pct: number
  marketing_cost_per_month: number
  moq: number
  lead_time_days: number
}): SimulatorResult {
  const {
    sell_price, landed_cost, packaging_cost, shipping_cost,
    platform_fee_pct, expected_monthly_units, return_rate_pct,
    marketing_cost_per_month, moq, lead_time_days
  } = inputs

  const effective_units = expected_monthly_units * (1 - return_rate_pct / 100)
  const platform_fee = sell_price * (platform_fee_pct / 100)
  const total_variable_cost = landed_cost + packaging_cost + shipping_cost + platform_fee
  const gross_margin_pct = sell_price > 0 ? ((sell_price - total_variable_cost) / sell_price) * 100 : 0
  const contribution_per_unit = sell_price - total_variable_cost
  const contribution_margin_pct = sell_price > 0 ? (contribution_per_unit / sell_price) * 100 : 0

  const monthly_contribution = contribution_per_unit * effective_units
  const projected_monthly_profit = monthly_contribution - marketing_cost_per_month

  const initial_investment = moq * landed_cost
  const months_to_recover = projected_monthly_profit > 0
    ? Math.ceil(initial_investment / projected_monthly_profit)
    : 999

  const break_even_units = contribution_per_unit > 0
    ? Math.ceil(marketing_cost_per_month / contribution_per_unit)
    : 999

  // Risk assessment
  const stockout_risk: 'low' | 'medium' | 'high' =
    lead_time_days > 60 ? 'high' : lead_time_days > 30 ? 'medium' : 'low'

  const sell_through_months = moq / effective_units
  const dead_stock_risk: 'low' | 'medium' | 'high' =
    sell_through_months > 6 ? 'high' : sell_through_months > 3 ? 'medium' : 'low'

  let suggested_price_adjustment = 'Price looks reasonable'
  if (gross_margin_pct < 20) suggested_price_adjustment = `Consider raising price by 15-20% — current margin is thin at ${gross_margin_pct.toFixed(1)}%`
  else if (gross_margin_pct > 60) suggested_price_adjustment = `Strong margin — you have room to be competitive on price`

  const verdict = projected_monthly_profit > 0
    ? gross_margin_pct >= 30
      ? `Strong opportunity — ${gross_margin_pct.toFixed(1)}% margin, recovers investment in ${months_to_recover} month${months_to_recover !== 1 ? 's' : ''}`
      : `Viable but thin — consider reducing costs or raising price to improve the ${gross_margin_pct.toFixed(1)}% margin`
    : `Not yet viable at these numbers — reduce cost or increase price to break even`

  return {
    gross_margin_pct: Math.round(gross_margin_pct * 10) / 10,
    contribution_margin_pct: Math.round(contribution_margin_pct * 10) / 10,
    break_even_units,
    projected_monthly_profit: Math.round(projected_monthly_profit),
    months_to_recover,
    stockout_risk,
    dead_stock_risk,
    suggested_price_adjustment,
    verdict,
  }
}

// ── Build expansion context for AI prompt ─────────────────────
export function buildExpansionContext(summary: DataSummary): string {
  if (!summary.topProducts.length) return ''

  const top5 = summary.topProducts.slice(0, 5)
  const topNames = top5.map(p => p.name).join(', ')
  const avgMargin = summary.avgMargin
  const totalRev = summary.totalRevenue

  return `
EXPANSION INTELLIGENCE CONTEXT:
Top products by revenue: ${topNames}
Average margin across portfolio: ${avgMargin}%
Total revenue in dataset: ${summary.symbol}${Math.round(totalRev).toLocaleString()}
Product categories: ${summary.categories.join(', ') || 'Not categorised'}
Active regions: ${summary.regions.join(', ') || 'Not specified'}
Top 5 products detail:
${top5.map(p => `- ${p.name}: ${summary.symbol}${Math.round(p.revenue).toLocaleString()} revenue, ${p.margin}% margin, ${p.units} units`).join('\n')}

EXPANSION SCORING FORMULA (use this when ranking opportunities):
0.25 × Demand Score
+ 0.20 × Margin Score  
+ 0.15 × Product Fit Score
+ 0.10 × Trend Score
+ 0.10 × Customer Overlap Score
+ 0.10 × Capital Efficiency Score
- 0.05 × Cannibalization Risk
- 0.05 × Inventory Risk
Score range: 0-100. Above 70 = strong opportunity. 50-70 = worth testing. Below 50 = weak signal.`
}
