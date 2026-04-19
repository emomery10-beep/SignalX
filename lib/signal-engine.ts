// ============================================================
// THE SIGNAL ENGINE — AskBiz Business Health Check
// Runs 3 intelligence checks on user data:
// 1. Stockout Risk
// 2. Margin Squeeze  
// 3. Sales Anomaly Detection
// ============================================================

export type SignalSeverity = 'red' | 'yellow' | 'blue'

export interface Signal {
  id: string
  title: string
  description: string          // Plain English for the user
  severity: SignalSeverity
  suggested_action: string     // What AskBiz should ask when clicked
  prompt: string               // Auto-populated chat prompt on click
  product?: string             // Which product triggered this
  metric?: string              // The number that triggered it
  created_at: string
}

export interface HealthCheckInput {
  rows: Record<string, unknown>[]
  headers: string[]
  // Optional: live market data
  aliexpressCosts?: Record<string, number>  // product → current cost
  previousCosts?: Record<string, number>    // product → cost 7 days ago
  leadTimeDays?: number                     // default 14
}

// ── HELPER: find column by keyword ───────────────────────────
function findCol(headers: string[], ...keywords: string[]): string | null {
  const lower = headers.map(h => h.toLowerCase())
  for (const kw of keywords) {
    const idx = lower.findIndex(h => h.includes(kw))
    if (idx >= 0) return headers[idx]
  }
  return null
}

// ── CHECK 1: STOCKOUT RISK ────────────────────────────────────
// Fires if: daily_sales_velocity × lead_time > current_stock
function checkStockoutRisk(
  rows: Record<string, unknown>[],
  headers: string[],
  leadTimeDays: number
): Signal[] {
  const signals: Signal[] = []

  const stockCol   = findCol(headers, 'stock', 'qty', 'quantity', 'inventory', 'units')
  const salesCol   = findCol(headers, 'daily_sales', 'sales_velocity', 'sold', 'units_sold', 'sales')
  const nameCol    = findCol(headers, 'name', 'product', 'item', 'sku', 'title')

  if (!stockCol || !salesCol) return signals

  rows.forEach(row => {
    const stock = Number(row[stockCol])
    const dailySales = Number(row[salesCol])
    if (isNaN(stock) || isNaN(dailySales) || dailySales <= 0) return

    const daysLeft = stock / dailySales
    const reorderBuffer = leadTimeDays * dailySales

    if (stock < reorderBuffer) {
      const product = String(row[nameCol || stockCol] || 'Unknown product')
      const severity: SignalSeverity = daysLeft < leadTimeDays * 0.5 ? 'red' : 'yellow'

      signals.push({
        id: `stockout-${product.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        title: `${product} running low`,
        description: `You have ${Math.round(daysLeft)} days of stock left for ${product}. At your current sales rate of ${Math.round(dailySales)} units/day, you'll run out before your next delivery arrives${leadTimeDays ? ` (${leadTimeDays}-day lead time)` : ''}.`,
        severity,
        suggested_action: 'Order more',
        prompt: `Calculate the cheapest reorder quantity for ${product}. I have ${Math.round(stock)} units left, selling ${Math.round(dailySales)} per day, with a ${leadTimeDays}-day supplier lead time. What should I order and when?`,
        product,
        metric: `${Math.round(daysLeft)} days left`,
        created_at: new Date().toISOString(),
      })
    }
  })

  return signals
}

// ── CHECK 2: MARGIN SQUEEZE ───────────────────────────────────
// Fires if: aliexpressCost + shipping has increased > 10% in last 7 days
function checkMarginSqueeze(
  rows: Record<string, unknown>[],
  headers: string[],
  aliexpressCosts?: Record<string, number>,
  previousCosts?: Record<string, number>
): Signal[] {
  const signals: Signal[] = []

  const nameCol   = findCol(headers, 'name', 'product', 'item', 'sku', 'title')
  const marginCol = findCol(headers, 'margin', 'gross_margin', 'profit_margin')
  const costCol   = findCol(headers, 'cost', 'cogs', 'unit_cost', 'purchase_price')
  const priceCol  = findCol(headers, 'price', 'selling_price', 'sale_price', 'revenue')

  // Check live AliExpress cost increases
  if (aliexpressCosts && previousCosts) {
    Object.entries(aliexpressCosts).forEach(([product, currentCost]) => {
      const previousCost = previousCosts[product]
      if (!previousCost || previousCost <= 0) return

      const pctIncrease = ((currentCost - previousCost) / previousCost) * 100

      if (pctIncrease > 10) {
        signals.push({
          id: `margin-squeeze-${product.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          title: `Cost increase on ${product}`,
          description: `Your AliExpress supplier cost for ${product} has increased by ${pctIncrease.toFixed(1)}% in the last 7 days (from $${previousCost.toFixed(2)} to $${currentCost.toFixed(2)}). This is squeezing your margin.`,
          severity: pctIncrease > 20 ? 'red' : 'yellow',
          suggested_action: 'Analyse margin impact',
          prompt: `My cost for ${product} just increased by ${pctIncrease.toFixed(1)}% on AliExpress. Calculate the impact on my profit margin and tell me whether I should raise my selling price, find an alternative supplier, or absorb the cost.`,
          product,
          metric: `+${pctIncrease.toFixed(1)}% cost increase`,
          created_at: new Date().toISOString(),
        })
      }
    })
  }

  // Check margin from uploaded data
  if (marginCol || (costCol && priceCol)) {
    rows.forEach(row => {
      const product = String(row[nameCol || Object.keys(row)[0]] || 'Product')

      let margin: number | null = null
      if (marginCol) {
        margin = Number(row[marginCol])
      } else if (costCol && priceCol) {
        const cost = Number(row[costCol])
        const price = Number(row[priceCol])
        if (!isNaN(cost) && !isNaN(price) && price > 0) {
          margin = ((price - cost) / price) * 100
        }
      }

      if (margin !== null && !isNaN(margin) && margin < 10) {
        signals.push({
          id: `low-margin-${product.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          title: `Low margin on ${product}`,
          description: `${product} has only a ${margin.toFixed(1)}% margin — barely enough to cover your operating costs. Any cost increase or discount will push this into negative territory.`,
          severity: margin < 5 ? 'red' : 'yellow',
          suggested_action: 'Fix this margin',
          prompt: `${product} has a ${margin.toFixed(1)}% margin. Analyse my data and tell me: should I raise the price, find a cheaper supplier, or discontinue this product? Show me the financial impact of each option.`,
          product,
          metric: `${margin.toFixed(1)}% margin`,
          created_at: new Date().toISOString(),
        })
      }
    })
  }

  return signals
}

// ── CHECK 3: ANOMALY DETECTION ────────────────────────────────
// Fires if: today's sales are 30%+ higher or lower than 7-day average
function checkSalesAnomalies(
  rows: Record<string, unknown>[],
  headers: string[]
): Signal[] {
  const signals: Signal[] = []

  const dateCol  = findCol(headers, 'date', 'created_at', 'order_date', 'sale_date', 'timestamp')
  const salesCol = findCol(headers, 'revenue', 'total', 'amount', 'sales', 'value')
  const nameCol  = findCol(headers, 'name', 'product', 'item', 'sku', 'category')

  if (!dateCol || !salesCol) return signals

  // Group rows by date
  const byDate: Record<string, number> = {}
  rows.forEach(row => {
    const dateStr = String(row[dateCol] || '')
    const dateKey = dateStr.substring(0, 10) // YYYY-MM-DD
    if (!dateKey || dateKey === 'undefined') return
    const val = Number(row[salesCol])
    if (!isNaN(val)) {
      byDate[dateKey] = (byDate[dateKey] || 0) + val
    }
  })

  const dates = Object.keys(byDate).sort()
  if (dates.length < 3) return signals

  const recentDates = dates.slice(-8)
  const today = recentDates[recentDates.length - 1]
  const past7 = recentDates.slice(0, -1)

  if (past7.length < 2) return signals

  const avg7Day = past7.reduce((sum, d) => sum + byDate[d], 0) / past7.length
  const todayVal = byDate[today]

  if (!avg7Day || avg7Day === 0) return signals

  const changePct = ((todayVal - avg7Day) / avg7Day) * 100

  if (Math.abs(changePct) >= 30) {
    const isSpike = changePct > 0
    signals.push({
      id: `anomaly-${today}-${Date.now()}`,
      title: isSpike ? '📈 Unusual sales spike today' : '📉 Sales down significantly today',
      description: isSpike
        ? `Today's sales (${formatValue(todayVal)}) are ${changePct.toFixed(0)}% above your 7-day average (${formatValue(avg7Day)}). Something is driving unusual demand — worth investigating so you can replicate it.`
        : `Today's sales (${formatValue(todayVal)}) are ${Math.abs(changePct).toFixed(0)}% below your 7-day average (${formatValue(avg7Day)}). This is an unusual drop that may need attention.`,
      severity: isSpike ? 'blue' : (Math.abs(changePct) > 50 ? 'red' : 'yellow'),
      suggested_action: isSpike ? 'Find what caused this' : 'Investigate the drop',
      prompt: isSpike
        ? `My sales today are ${changePct.toFixed(0)}% above my 7-day average. Analyse my data and tell me: which products are driving the spike, whether my stock can handle it, and what I should do to capitalise on this momentum.`
        : `My sales today are ${Math.abs(changePct).toFixed(0)}% below my 7-day average. Analyse my data and tell me: what's driving the drop, which products are most affected, and what actions I should take today.`,
      metric: `${changePct > 0 ? '+' : ''}${changePct.toFixed(0)}% vs 7-day avg`,
      created_at: new Date().toISOString(),
    })
  }

  return signals
}

function formatValue(n: number): string {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`
  return n.toFixed(0)
}

// ── MAIN: RUN FULL HEALTH CHECK ───────────────────────────────
export function runHealthCheck(input: HealthCheckInput): Signal[] {
  const { rows, headers, aliexpressCosts, previousCosts, leadTimeDays = 14 } = input

  if (!rows?.length || !headers?.length) return []

  const signals: Signal[] = [
    ...checkStockoutRisk(rows, headers, leadTimeDays),
    ...checkMarginSqueeze(rows, headers, aliexpressCosts, previousCosts),
    ...checkSalesAnomalies(rows, headers),
  ]

  // Deduplicate by product+type and sort by severity
  const seen = new Set<string>()
  const unique = signals.filter(s => {
    const key = s.id.split('-').slice(0, 2).join('-')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const severityOrder: Record<SignalSeverity, number> = { red: 0, yellow: 1, blue: 2 }
  return unique.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

// ── API ROUTE HELPER ──────────────────────────────────────────
export async function runHealthCheckFromUpload(
  userId: string,
  supabase: ReturnType<typeof import('@/lib/supabase/server').createClient>
): Promise<Signal[]> {
  try {
    const { data: upload } = await supabase
      .from('uploads')
      .select('parsed_sample, column_names')
      .eq('user_id', userId)
      .eq('status', 'parsed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!upload?.parsed_sample || !upload?.column_names) return []

    return runHealthCheck({
      rows: upload.parsed_sample as Record<string, unknown>[],
      headers: upload.column_names as string[],
    })
  } catch {
    return []
  }
}
