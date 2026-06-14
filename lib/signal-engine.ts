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
        id: `stockout-${product.replace(/\s+/g, '-').toLowerCase()}`,
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
          id: `margin-squeeze-${product.replace(/\s+/g, '-').toLowerCase()}`,
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
          id: `low-margin-${product.replace(/\s+/g, '-').toLowerCase()}`,
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
      id: `anomaly-${today}`,
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

// ── POS-BASED SIGNALS ────────────────────────────────────────
// Generate signals directly from live POS inventory + transaction data

export interface PosSignalInput {
  inventory: { name: string; stock_qty: number; low_stock_threshold: number; sale_price?: number; cost_price?: number }[]
  recentSales: { name: string; qty: number; unit_price: number; cost_price: number }[]
  todayRevenue: number
  avgDailyRevenue: number
}

export function runHealthCheckFromPOSData(input: PosSignalInput): Signal[] {
  const { inventory, recentSales, todayRevenue, avgDailyRevenue } = input
  const signals: Signal[] = []

  // Build daily sales velocity per product (from last 7 days of line items)
  const salesByProduct: Record<string, number> = {}
  for (const item of recentSales) {
    salesByProduct[item.name] = (salesByProduct[item.name] || 0) + item.qty
  }

  // CHECK 1: Stockout risk from inventory
  for (const item of inventory) {
    const dailyVelocity = (salesByProduct[item.name] || 0) / 7
    if (dailyVelocity <= 0) continue

    const daysLeft = item.stock_qty / dailyVelocity
    const leadTime = 14

    if (daysLeft < leadTime) {
      const severity: SignalSeverity = daysLeft < 7 ? 'red' : 'yellow'
      signals.push({
        id: `stockout-pos-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
        title: `${item.name} running low`,
        description: `${Math.round(daysLeft)} days of stock left at current sales rate (${dailyVelocity.toFixed(1)}/day). You have ${item.stock_qty} units remaining.`,
        severity,
        suggested_action: 'Reorder now',
        prompt: `${item.name} has ${item.stock_qty} units left, selling ${dailyVelocity.toFixed(1)} per day. How many should I reorder and when?`,
        product: item.name,
        metric: `${Math.round(daysLeft)} days left`,
        created_at: new Date().toISOString(),
      })
    }
  }

  // CHECK 2: Out-of-stock items
  const outOfStock = inventory.filter(i => i.stock_qty <= 0)
  for (const item of outOfStock) {
    signals.push({
      id: `oos-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
      title: `${item.name} — OUT OF STOCK`,
      description: `${item.name} has zero stock. You're losing sales on this product.`,
      severity: 'red',
      suggested_action: 'Restock urgently',
      prompt: `${item.name} is out of stock. What's the fastest way to restock and how much am I losing in daily sales?`,
      product: item.name,
      metric: '0 units',
      created_at: new Date().toISOString(),
    })
  }

  // CHECK 3: Low margin products
  const productMargins: Record<string, { revenue: number; cost: number }> = {}
  for (const item of recentSales) {
    if (!productMargins[item.name]) productMargins[item.name] = { revenue: 0, cost: 0 }
    productMargins[item.name].revenue += item.qty * item.unit_price
    productMargins[item.name].cost += item.qty * (item.cost_price || 0)
  }

  for (const [name, data] of Object.entries(productMargins)) {
    if (data.cost <= 0 || data.revenue <= 0) continue
    const margin = ((data.revenue - data.cost) / data.revenue) * 100
    if (margin < 0) {
      signals.push({
        id: `neg-margin-pos-${name.replace(/\s+/g, '-').toLowerCase()}`,
        title: `${name} — losing money`,
        description: `${name} has a ${margin.toFixed(1)}% margin. You lose money on every sale.`,
        severity: 'red',
        suggested_action: 'Fix pricing',
        prompt: `${name} has a negative ${margin.toFixed(1)}% margin. Should I raise the price, find a cheaper supplier, or discontinue it?`,
        product: name,
        metric: `${margin.toFixed(1)}% margin`,
        created_at: new Date().toISOString(),
      })
    } else if (margin < 10) {
      signals.push({
        id: `low-margin-pos-${name.replace(/\s+/g, '-').toLowerCase()}`,
        title: `Low margin on ${name}`,
        description: `${name} has only a ${margin.toFixed(1)}% margin — barely covering costs.`,
        severity: 'yellow',
        suggested_action: 'Review pricing',
        prompt: `${name} has a ${margin.toFixed(1)}% margin. How can I improve profitability on this product?`,
        product: name,
        metric: `${margin.toFixed(1)}% margin`,
        created_at: new Date().toISOString(),
      })
    }
  }

  // CHECK 4: Sales anomaly (today vs 7-day average)
  if (avgDailyRevenue > 0 && todayRevenue >= 0) {
    const changePct = ((todayRevenue - avgDailyRevenue) / avgDailyRevenue) * 100
    if (Math.abs(changePct) >= 30) {
      const isSpike = changePct > 0
      signals.push({
        id: `anomaly-pos`,
        title: isSpike ? 'Unusual sales spike today' : 'Sales down significantly today',
        description: isSpike
          ? `Today's revenue (${formatValue(todayRevenue)}) is ${changePct.toFixed(0)}% above your 7-day average (${formatValue(avgDailyRevenue)}).`
          : `Today's revenue (${formatValue(todayRevenue)}) is ${Math.abs(changePct).toFixed(0)}% below your 7-day average (${formatValue(avgDailyRevenue)}).`,
        severity: isSpike ? 'blue' : (Math.abs(changePct) > 50 ? 'red' : 'yellow'),
        suggested_action: isSpike ? 'Capitalise on this' : 'Investigate the drop',
        prompt: isSpike
          ? `My POS sales today are ${changePct.toFixed(0)}% above my 7-day average. Which products are driving this and do I have enough stock?`
          : `My POS sales today are ${Math.abs(changePct).toFixed(0)}% below average. What's causing the drop and what should I do?`,
        metric: `${changePct > 0 ? '+' : ''}${changePct.toFixed(0)}% vs avg`,
        created_at: new Date().toISOString(),
      })
    }
  }

  // Deduplicate and sort
  const seen = new Set<string>()
  const unique = signals.filter(s => {
    const key = `${s.product || 'global'}-${s.id.split('-')[0]}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const severityOrder: Record<SignalSeverity, number> = { red: 0, yellow: 1, blue: 2 }
  return unique.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

// ── LOGISTICS SIGNALS ────────────────────────────────────────
// Generate signals from logistics/courier parcel data

export interface LogisticsSignalInput {
  parcels: { status: string; fee_charged: number; payment_status: string; created_at: string; delivered_at?: string; dispatched_at?: string; fail_reason?: string; destination_city?: string }[]
  trucks: { status: string; plate_number: string }[]
  todayParcelsIn: number
  avgDailyParcelsIn: number
}

export function runLogisticsSignals(input: LogisticsSignalInput): Signal[] {
  const { parcels, trucks, todayParcelsIn, avgDailyParcelsIn } = input
  const signals: Signal[] = []

  // CHECK 1: Throughput anomaly (today vs average)
  if (avgDailyParcelsIn > 0 && todayParcelsIn >= 0) {
    const changePct = ((todayParcelsIn - avgDailyParcelsIn) / avgDailyParcelsIn) * 100
    if (Math.abs(changePct) >= 30) {
      const isSpike = changePct > 0
      signals.push({
        id: `logistics-throughput`,
        title: isSpike ? 'Parcel intake spike today' : 'Parcel intake down today',
        description: isSpike
          ? `${todayParcelsIn} parcels received today — ${changePct.toFixed(0)}% above average (${avgDailyParcelsIn.toFixed(0)}/day). Check handler capacity.`
          : `Only ${todayParcelsIn} parcels received — ${Math.abs(changePct).toFixed(0)}% below average (${avgDailyParcelsIn.toFixed(0)}/day).`,
        severity: isSpike ? 'blue' : (Math.abs(changePct) > 50 ? 'red' : 'yellow'),
        suggested_action: isSpike ? 'Check capacity' : 'Investigate drop',
        prompt: isSpike
          ? `Parcel intake is ${changePct.toFixed(0)}% above average today. Do we have enough handlers and truck capacity?`
          : `Parcel intake is ${Math.abs(changePct).toFixed(0)}% below average today. What's causing the drop?`,
        metric: `${changePct > 0 ? '+' : ''}${changePct.toFixed(0)}% vs avg`,
        created_at: new Date().toISOString(),
      })
    }
  }

  // CHECK 2: Failed delivery rate
  const delivered = parcels.filter(p => p.status === 'delivered' || p.status === 'collected')
  const failed = parcels.filter(p => p.status === 'failed_delivery')
  const completedTotal = delivered.length + failed.length
  if (completedTotal >= 5) {
    const failRate = (failed.length / completedTotal) * 100
    if (failRate > 15) {
      signals.push({
        id: `logistics-fail-rate`,
        title: `High failed delivery rate: ${failRate.toFixed(0)}%`,
        description: `${failed.length} of ${completedTotal} deliveries failed. Top reason: ${failed[0]?.fail_reason || 'unknown'}. This impacts revenue and customer satisfaction.`,
        severity: failRate > 25 ? 'red' : 'yellow',
        suggested_action: 'Review failed deliveries',
        prompt: `Our delivery failure rate is ${failRate.toFixed(0)}% (${failed.length} of ${completedTotal}). Analyse the failure reasons and recommend fixes.`,
        metric: `${failRate.toFixed(0)}% fail rate`,
        created_at: new Date().toISOString(),
      })
    }
  }

  // CHECK 3: Unpaid revenue
  const unpaidTotal = parcels.filter(p => p.payment_status === 'unpaid').reduce((s, p) => s + (p.fee_charged || 0), 0)
  const totalRevenue = parcels.reduce((s, p) => s + (p.fee_charged || 0), 0)
  if (totalRevenue > 0) {
    const unpaidPct = (unpaidTotal / totalRevenue) * 100
    if (unpaidPct > 30) {
      signals.push({
        id: `logistics-unpaid`,
        title: `${unpaidPct.toFixed(0)}% of revenue is unpaid`,
        description: `${formatValue(unpaidTotal)} in unpaid parcel fees out of ${formatValue(totalRevenue)} total. Cash flow at risk.`,
        severity: unpaidPct > 50 ? 'red' : 'yellow',
        suggested_action: 'Chase payments',
        prompt: `${unpaidPct.toFixed(0)}% of our logistics revenue (${formatValue(unpaidTotal)}) is unpaid. Which parcels should we prioritize collecting payment for?`,
        metric: `${unpaidPct.toFixed(0)}% unpaid`,
        created_at: new Date().toISOString(),
      })
    }
  }

  // CHECK 4: Trucks in maintenance
  const maintenanceCount = trucks.filter(t => t.status === 'maintenance').length
  const totalTrucks = trucks.length
  if (totalTrucks > 0 && maintenanceCount > 0) {
    const maintenancePct = (maintenanceCount / totalTrucks) * 100
    if (maintenancePct > 30) {
      signals.push({
        id: `logistics-fleet`,
        title: `${maintenanceCount} of ${totalTrucks} trucks in maintenance`,
        description: `${maintenancePct.toFixed(0)}% of your fleet is offline. This may delay dispatches and increase delivery times.`,
        severity: maintenancePct > 50 ? 'red' : 'yellow',
        suggested_action: 'Check fleet status',
        prompt: `${maintenanceCount} of our ${totalTrucks} trucks are in maintenance. What's the impact on our delivery capacity and when should we expect them back?`,
        metric: `${maintenancePct.toFixed(0)}% offline`,
        created_at: new Date().toISOString(),
      })
    }
  }

  // CHECK 5: Parcels stuck at branch (older than 48h without dispatch)
  const now = Date.now()
  const stuckParcels = parcels.filter(p => {
    if (!['received', 'at_branch'].includes(p.status)) return false
    const age = now - new Date(p.created_at).getTime()
    return age > 48 * 3600 * 1000
  })
  if (stuckParcels.length > 0) {
    signals.push({
      id: `logistics-stuck`,
      title: `${stuckParcels.length} parcels stuck at branch`,
      description: `${stuckParcels.length} parcel${stuckParcels.length > 1 ? 's' : ''} received over 48 hours ago and not yet dispatched. Customers may complain.`,
      severity: stuckParcels.length > 10 ? 'red' : 'yellow',
      suggested_action: 'Dispatch pending parcels',
      prompt: `We have ${stuckParcels.length} parcels that have been sitting at branch for over 48 hours. How should we prioritize dispatching them?`,
      metric: `${stuckParcels.length} stuck`,
      created_at: new Date().toISOString(),
    })
  }

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
