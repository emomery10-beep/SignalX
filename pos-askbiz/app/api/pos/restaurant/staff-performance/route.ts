import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '7')

  const from = new Date()
  from.setDate(from.getDate() - days)
  from.setHours(0, 0, 0, 0)

  const service = createServiceClient()

  const [ordersRes, shiftsRes, staffRes] = await Promise.all([
    service
      .from('restaurant_orders')
      .select('id, total, covers, order_type, status, created_at, server_id, server_name, order_items:restaurant_order_items(name, unit_price, qty)')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'paid')
      .gte('created_at', from.toISOString())
      .order('created_at', { ascending: false }),
    service
      .from('restaurant_labor_shifts')
      .select('id, staff_id, role, hourly_rate, total_hours, total_cost, status, clock_in, clock_out')
      .eq('owner_id', auth.ownerId)
      .gte('clock_in', from.toISOString())
      .order('clock_in', { ascending: false }),
    service
      .from('pos_staff')
      .select('id, name, role')
      .eq('owner_id', auth.ownerId)
      .eq('active', true),
  ])

  const orders = ordersRes.data || []
  const shifts = shiftsRes.data || []
  const staff  = staffRes.data  || []

  // Build staff id → name map
  const staffMap: Record<string, string> = {}
  for (const s of staff) staffMap[s.id] = s.name

  // Aggregate orders by server
  const byServer: Record<string, {
    server_id: string | null
    server_name: string
    orders: number
    covers: number
    revenue: number
    items_sold: number
    avg_ticket: number
    avg_per_cover: number
  }> = {}

  for (const order of orders) {
    const key  = order.server_id || `name:${order.server_name}` || 'unknown'
    const name = order.server_name || (order.server_id ? staffMap[order.server_id] : null) || 'Unknown'
    if (!byServer[key]) {
      byServer[key] = { server_id: order.server_id, server_name: name, orders: 0, covers: 0, revenue: 0, items_sold: 0, avg_ticket: 0, avg_per_cover: 0 }
    }
    byServer[key].orders  += 1
    byServer[key].covers  += order.covers || 1
    byServer[key].revenue += order.total || 0
    byServer[key].items_sold += (order.order_items || []).reduce((s: number, i: any) => s + i.qty, 0)
  }

  // Compute averages
  const serverPerf = Object.values(byServer).map(s => ({
    ...s,
    avg_ticket:    s.orders > 0 ? s.revenue / s.orders : 0,
    avg_per_cover: s.covers > 0 ? s.revenue / s.covers : 0,
  })).sort((a, b) => b.revenue - a.revenue)

  // Aggregate shifts by staff member
  const byStaffShift: Record<string, {
    staff_id: string
    name: string
    role: string
    total_shifts: number
    total_hours: number
    total_labour_cost: number
    revenue_per_hour: number
  }> = {}

  for (const shift of shifts) {
    const key  = shift.staff_id || 'unknown'
    const name = staffMap[shift.staff_id] || shift.staff_id || 'Unknown'
    if (!byStaffShift[key]) {
      byStaffShift[key] = { staff_id: shift.staff_id, name, role: shift.role || 'staff', total_shifts: 0, total_hours: 0, total_labour_cost: 0, revenue_per_hour: 0 }
    }
    byStaffShift[key].total_shifts    += 1
    byStaffShift[key].total_hours     += shift.total_hours || 0
    byStaffShift[key].total_labour_cost += shift.total_cost || 0
  }

  // Cross-reference labour hours with revenue generated (for servers only)
  for (const s of serverPerf) {
    if (s.server_id && byStaffShift[s.server_id]) {
      const hrs = byStaffShift[s.server_id].total_hours
      byStaffShift[s.server_id].revenue_per_hour = hrs > 0 ? s.revenue / hrs : 0
    }
  }

  const shiftPerf = Object.values(byStaffShift).sort((a, b) => b.total_hours - a.total_hours)

  // Overall summary
  const totalOrders   = orders.length
  const totalRevenue  = orders.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const totalCovers   = orders.reduce((s: number, o: any) => s + (o.covers || 1), 0)
  const totalHours    = shifts.reduce((s: number, sh: any) => s + (sh.total_hours || 0), 0)
  const totalLabour   = shifts.reduce((s: number, sh: any) => s + (sh.total_cost || 0), 0)

  return NextResponse.json({
    period_days: days,
    summary: {
      total_orders:    totalOrders,
      total_revenue:   totalRevenue,
      total_covers:    totalCovers,
      total_labour_hours: totalHours,
      total_labour_cost:  totalLabour,
      revenue_per_labour_hour: totalHours > 0 ? totalRevenue / totalHours : 0,
    },
    server_performance: serverPerf,
    shift_performance:  shiftPerf,
  })
}
