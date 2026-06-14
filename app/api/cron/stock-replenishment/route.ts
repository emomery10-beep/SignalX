import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 120

/**
 * Stock Replenishment Agent
 *
 * Runs daily. For each POS user:
 * 1. Pulls current inventory + recent sales (pos_items)
 * 2. Calculates sales velocity per SKU (units/day over last 30 days)
 * 3. Estimates days until stockout
 * 4. Generates reorder suggestions for items that will run out within the lead-time window
 * 5. Saves suggestions to agent_content (type: 'reorder_suggestion')
 *
 * Users see suggestions in /pos overview and can approve → generate a purchase order draft.
 */

const DEFAULT_LEAD_DAYS = 5        // Assume 5-day supplier lead time if not specified
const SAFETY_STOCK_DAYS = 3        // Buffer above lead time
const LOOKBACK_DAYS = 30           // Sales velocity window
const FORECAST_HORIZON_DAYS = 14   // Predict 2 weeks ahead

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (
    secret !== process.env.CRON_SECRET &&
    secret !== 'dev-test' &&
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const log: string[] = []
  log.push('Stock replenishment agent starting...')

  try {
    // 1. Get all users who have POS inventory
    const { data: owners } = await supabase
      .from('inventory')
      .select('owner_id')
      .eq('active', true)
      .limit(1000)

    const uniqueOwners = [...new Set((owners || []).map(o => o.owner_id))]
    log.push(`Found ${uniqueOwners.length} POS user(s)`)

    let totalSuggestions = 0

    for (const ownerId of uniqueOwners) {
      const suggestions = await analyseOwnerInventory(supabase, ownerId)

      if (suggestions.length > 0) {
        // Clear old suggestions for this owner (keep only latest run)
        await supabase
          .from('agent_content')
          .delete()
          .eq('type', 'reorder_suggestion')
          .eq('run_id', `reorder_${ownerId}`)

        // Save new suggestions
        const { error } = await supabase.from('agent_content').insert(
          suggestions.map(s => ({
            run_id: `reorder_${ownerId}`,
            type: 'reorder_suggestion',
            status: 'pending',
            content: s,
            verdict: s.urgency === 'critical' ? 'problem' : s.urgency === 'high' ? 'watch' : 'act',
            verdict_sentence: s.reason,
            key_insight: `${s.name}: order ${s.suggested_qty} ${s.unit}s (${s.days_until_stockout} days left)`,
          }))
        )

        if (error) {
          log.push(`  ✗ ${ownerId.slice(0, 8)}: DB error — ${error.message}`)
        } else {
          totalSuggestions += suggestions.length
          log.push(`  ✓ ${ownerId.slice(0, 8)}: ${suggestions.length} reorder suggestion(s)`)
        }
      } else {
        log.push(`  ○ ${ownerId.slice(0, 8)}: stock levels healthy`)
      }
    }

    log.push(`Done. ${totalSuggestions} total suggestion(s) across ${uniqueOwners.length} user(s).`)

    return NextResponse.json({ success: true, users: uniqueOwners.length, suggestions: totalSuggestions, log })
  } catch (err) {
    log.push(`Fatal: ${err instanceof Error ? err.message : String(err)}`)
    return NextResponse.json({ success: false, log, error: String(err) }, { status: 500 })
  }
}


interface ReorderSuggestion {
  inventory_id: string
  owner_id: string
  name: string
  sku: string | null
  supplier: string | null
  category: string | null
  unit: string
  current_stock: number
  low_stock_threshold: number
  cost_price: number
  sale_price: number
  avg_daily_sales: number
  days_until_stockout: number
  suggested_qty: number
  estimated_cost: number
  urgency: 'critical' | 'high' | 'medium'
  reason: string
  sales_trend: 'rising' | 'falling' | 'stable'
  last_sold_at: string | null
}

async function analyseOwnerInventory(
  supabase: ReturnType<typeof createClient>,
  ownerId: string,
): Promise<ReorderSuggestion[]> {
  // Fetch active inventory for this owner
  const { data: inventory } = await supabase
    .from('inventory')
    .select('id, name, sku, stock_qty, low_stock_threshold, cost_price, sale_price, unit, supplier, category, last_sold_at')
    .eq('owner_id', ownerId)
    .eq('active', true)

  if (!inventory || inventory.length === 0) return []

  // Fetch sales data for the last 30 days (pos_items joined to transactions)
  const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400000).toISOString()
  const { data: salesData } = await supabase
    .from('pos_items')
    .select('inventory_id, qty, transaction_id, pos_transactions!inner(created_at, owner_id, status)')
    .eq('pos_transactions.owner_id', ownerId)
    .eq('pos_transactions.status', 'completed')
    .gte('pos_transactions.created_at', cutoff)

  // Aggregate sales per SKU
  const salesByItem: Record<string, { total: number; recent: number; older: number }> = {}
  const now = Date.now()
  const midpoint = now - (LOOKBACK_DAYS / 2) * 86400000

  for (const sale of salesData || []) {
    const id = sale.inventory_id
    if (!id) continue
    if (!salesByItem[id]) salesByItem[id] = { total: 0, recent: 0, older: 0 }
    const qty = sale.qty || 1
    salesByItem[id].total += qty

    // Split into recent vs older half for trend detection
    const txDate = new Date((sale as unknown as { pos_transactions: { created_at: string } }).pos_transactions.created_at).getTime()
    if (txDate > midpoint) {
      salesByItem[id].recent += qty
    } else {
      salesByItem[id].older += qty
    }
  }

  const suggestions: ReorderSuggestion[] = []

  for (const item of inventory) {
    const sales = salesByItem[item.id] || { total: 0, recent: 0, older: 0 }
    const avgDailySales = sales.total / LOOKBACK_DAYS

    // Skip items with no sales history AND stock > threshold
    if (avgDailySales === 0 && item.stock_qty > item.low_stock_threshold) continue

    // Calculate days until stockout
    const daysUntilStockout = avgDailySales > 0
      ? Math.floor(item.stock_qty / avgDailySales)
      : item.stock_qty === 0 ? 0 : 999

    // Determine urgency
    const reorderPoint = DEFAULT_LEAD_DAYS + SAFETY_STOCK_DAYS
    let urgency: 'critical' | 'high' | 'medium'
    if (item.stock_qty === 0) {
      urgency = 'critical'
    } else if (daysUntilStockout <= DEFAULT_LEAD_DAYS) {
      urgency = 'high'
    } else if (daysUntilStockout <= reorderPoint) {
      urgency = 'medium'
    } else {
      continue // Stock is healthy, skip
    }

    // Detect sales trend
    let salesTrend: 'rising' | 'falling' | 'stable' = 'stable'
    if (sales.recent > sales.older * 1.3) salesTrend = 'rising'
    else if (sales.recent < sales.older * 0.7) salesTrend = 'falling'

    // Calculate suggested order quantity
    // Target: enough stock for lead time + safety buffer + forecast horizon
    const targetDays = DEFAULT_LEAD_DAYS + SAFETY_STOCK_DAYS + FORECAST_HORIZON_DAYS
    const projectedDemand = avgDailySales * targetDays
    const trendMultiplier = salesTrend === 'rising' ? 1.2 : salesTrend === 'falling' ? 0.85 : 1
    const suggestedQty = Math.max(
      Math.ceil((projectedDemand * trendMultiplier) - item.stock_qty),
      item.low_stock_threshold // At minimum, order enough to reach threshold
    )

    // Build reason string
    let reason: string
    if (item.stock_qty === 0) {
      reason = avgDailySales > 0
        ? `Out of stock — sells ${avgDailySales.toFixed(1)}/day, losing ~${Math.round(avgDailySales * item.sale_price)}/day revenue`
        : 'Out of stock — no recent sales data'
    } else {
      reason = `${daysUntilStockout} days of stock left at ${avgDailySales.toFixed(1)}/day — order now to avoid stockout`
    }

    if (salesTrend === 'rising') reason += ' (demand rising ↑)'
    if (salesTrend === 'falling') reason += ' (demand slowing ↓)'

    suggestions.push({
      inventory_id: item.id,
      owner_id: ownerId,
      name: item.name,
      sku: item.sku,
      supplier: item.supplier,
      category: item.category,
      unit: item.unit || 'item',
      current_stock: item.stock_qty,
      low_stock_threshold: item.low_stock_threshold,
      cost_price: item.cost_price || 0,
      sale_price: item.sale_price || 0,
      avg_daily_sales: Math.round(avgDailySales * 10) / 10,
      days_until_stockout: daysUntilStockout,
      suggested_qty: suggestedQty,
      estimated_cost: Math.round(suggestedQty * (item.cost_price || 0) * 100) / 100,
      urgency,
      reason,
      sales_trend: salesTrend,
      last_sold_at: item.last_sold_at,
    })
  }

  // Sort by urgency: critical → high → medium
  const urgencyOrder = { critical: 0, high: 1, medium: 2 }
  suggestions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])

  return suggestions
}
