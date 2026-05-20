import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — restaurant-specific KPIs and analytics
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const days        = parseInt(searchParams.get('days') || '7')
  const location_id = searchParams.get('location_id') || auth.locationId

  const from = new Date()
  from.setDate(from.getDate() - days)
  from.setHours(0, 0, 0, 0)

  const [ordersRes, laborRes, wasteRes] = await Promise.all([
    service.from('restaurant_orders')
      .select(`
        id, status, covers, subtotal, discount_amount, tax_amount, total,
        order_type, seated_at, first_item_sent_at, last_item_ready_at, paid_at, created_at,
        order_items:restaurant_order_items(
          id, name, unit_price, food_cost, qty, station, course, status,
          sent_at, ready_at
        )
      `)
      .eq('owner_id', auth.ownerId)
      .gte('created_at', from.toISOString())
      .not('status', 'eq', 'void'),

    service.from('restaurant_labor_shifts')
      .select('role, hourly_rate, clock_in, clock_out, total_hours, total_cost, status')
      .eq('owner_id', auth.ownerId)
      .gte('clock_in', from.toISOString()),

    service.from('restaurant_waste_log')
      .select('item_name, qty, cost_per_unit, total_cost, reason, created_at')
      .eq('owner_id', auth.ownerId)
      .gte('created_at', from.toISOString()),
  ])

  const orders = ordersRes.data || []
  const labor  = laborRes.data  || []
  const waste  = wasteRes.data  || []

  const paidOrders = orders.filter((o: any) => o.status === 'paid')

  // ── Revenue & Covers ────────────────────────────────────────────
  const totalRevenue = paidOrders.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const totalCovers  = paidOrders.reduce((s: number, o: any) => s + (o.covers || 1), 0)
  const avgTicket    = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0
  const avgPerCover  = totalCovers > 0 ? totalRevenue / totalCovers : 0

  // ── Food Cost % ─────────────────────────────────────────────────
  let totalFoodCost = 0
  const itemSales: Record<string, { name: string; qty: number; revenue: number; cost: number; station: string }> = {}
  for (const order of paidOrders) {
    for (const item of (order.order_items || [])) {
      totalFoodCost += (item.food_cost || 0) * item.qty
      const key = item.name
      if (!itemSales[key]) itemSales[key] = { name: item.name, qty: 0, revenue: 0, cost: 0, station: item.station }
      itemSales[key].qty     += item.qty
      itemSales[key].revenue += item.unit_price * item.qty
      itemSales[key].cost    += (item.food_cost || 0) * item.qty
    }
  }
  const foodCostPct = totalRevenue > 0 ? (totalFoodCost / totalRevenue) * 100 : 0

  // ── Table Turns & Dwell Time ────────────────────────────────────
  const dineInOrders = paidOrders.filter((o: any) => o.order_type === 'dine_in' && o.seated_at && o.paid_at)
  const avgDwellMins = dineInOrders.length > 0
    ? dineInOrders.reduce((s: number, o: any) => {
        return s + (new Date(o.paid_at).getTime() - new Date(o.seated_at).getTime()) / 60000
      }, 0) / dineInOrders.length
    : 0

  // ── Kitchen Performance ─────────────────────────────────────────
  const itemsWithTimes = paidOrders.flatMap((o: any) =>
    (o.order_items || []).filter((i: any) => i.sent_at && i.ready_at)
  )
  const avgPrepMins = itemsWithTimes.length > 0
    ? itemsWithTimes.reduce((s: number, i: any) =>
        s + (new Date(i.ready_at).getTime() - new Date(i.sent_at).getTime()) / 60000, 0
      ) / itemsWithTimes.length
    : 0

  // Per-station average prep time
  const stationTimes: Record<string, { total: number; count: number }> = {}
  for (const item of itemsWithTimes) {
    const station = item.station || 'all'
    if (!stationTimes[station]) stationTimes[station] = { total: 0, count: 0 }
    stationTimes[station].total += (new Date(item.ready_at).getTime() - new Date(item.sent_at).getTime()) / 60000
    stationTimes[station].count++
  }
  const stationAvgPrep = Object.entries(stationTimes).map(([station, d]) => ({
    station, avg_prep_mins: d.count > 0 ? parseFloat((d.total / d.count).toFixed(1)) : 0,
  }))

  // ── Labor Cost % ────────────────────────────────────────────────
  const totalLaborCost = labor.reduce((s: number, sh: any) => s + (sh.total_cost || 0), 0)
  const laborCostPct   = totalRevenue > 0 ? (totalLaborCost / totalRevenue) * 100 : 0

  // ── Channel Breakdown ───────────────────────────────────────────
  const byChannel: Record<string, { count: number; revenue: number }> = {}
  for (const order of paidOrders) {
    const ch = order.order_type || 'dine_in'
    if (!byChannel[ch]) byChannel[ch] = { count: 0, revenue: 0 }
    byChannel[ch].count++
    byChannel[ch].revenue += order.total || 0
  }

  // ── Peak Hours ──────────────────────────────────────────────────
  const hourCounts: Record<number, number> = {}
  for (const order of paidOrders) {
    const hour = new Date(order.created_at).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  }
  const peakHours = Object.entries(hourCounts)
    .map(([h, c]) => ({ hour: parseInt(h), orders: c }))
    .sort((a, b) => b.orders - a.orders)

  // ── Daily Revenue Trend ─────────────────────────────────────────
  const dailyRevenue: Record<string, number> = {}
  for (const order of paidOrders) {
    const day = order.created_at.slice(0, 10)
    dailyRevenue[day] = (dailyRevenue[day] || 0) + (order.total || 0)
  }

  // ── Top Items ───────────────────────────────────────────────────
  const topItems = Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(i => ({
      ...i,
      margin_pct: i.revenue > 0 ? parseFloat(((i.revenue - i.cost) / i.revenue * 100).toFixed(1)) : 0,
    }))

  // ── Waste Summary ───────────────────────────────────────────────
  const totalWasteCost = waste.reduce((s: number, w: any) => s + (w.total_cost || 0), 0)
  const wastePct = totalRevenue > 0 ? (totalWasteCost / totalRevenue) * 100 : 0

  return NextResponse.json({
    period_days: days,
    kpis: {
      total_revenue:    parseFloat(totalRevenue.toFixed(2)),
      total_orders:     paidOrders.length,
      total_covers:     totalCovers,
      avg_ticket:       parseFloat(avgTicket.toFixed(2)),
      avg_per_cover:    parseFloat(avgPerCover.toFixed(2)),
      food_cost_pct:    parseFloat(foodCostPct.toFixed(1)),
      labor_cost_pct:   parseFloat(laborCostPct.toFixed(1)),
      avg_dwell_mins:   parseFloat(avgDwellMins.toFixed(1)),
      avg_prep_mins:    parseFloat(avgPrepMins.toFixed(1)),
      total_waste_cost: parseFloat(totalWasteCost.toFixed(2)),
      waste_pct:        parseFloat(wastePct.toFixed(1)),
      prime_cost_pct:   parseFloat((foodCostPct + laborCostPct).toFixed(1)), // food+labor combined
    },
    top_items:       topItems,
    by_channel:      byChannel,
    peak_hours:      peakHours,
    station_prep:    stationAvgPrep,
    daily_revenue:   dailyRevenue,
  })
}
