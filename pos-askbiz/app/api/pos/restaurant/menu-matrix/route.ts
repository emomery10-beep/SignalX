import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'cashier')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '30')

  const service = createServiceClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()

  // Get paid orders in the period
  const { data: paidOrders } = await service
    .from('restaurant_orders')
    .select('id')
    .eq('owner_id', auth.ownerId)
    .eq('status', 'paid')
    .gte('created_at', since)
    .limit(2000)

  const orderIds = (paidOrders || []).map(o => o.id)
  if (orderIds.length === 0) {
    return NextResponse.json({ items: [], summary: { total_items: 0, avg_margin: 0, avg_popularity: 0, days } })
  }

  // Get all order items from paid orders
  const { data: orderItems } = await service
    .from('restaurant_order_items')
    .select('menu_item_id, name, unit_price, food_cost, qty, status')
    .in('order_id', orderIds)
    .in('status', ['served', 'sent', 'ready', 'preparing'])
    .limit(5000)

  // Get menu items for category info
  const { data: menuItems } = await service
    .from('restaurant_menu_items')
    .select('id, name, price, food_cost, category_id, station, available')
    .eq('owner_id', auth.ownerId)

  const { data: categories } = await service
    .from('restaurant_menu_categories')
    .select('id, name')
    .eq('owner_id', auth.ownerId)

  const catMap: Record<string, string> = {}
  for (const c of categories || []) catMap[c.id] = c.name

  const menuMap: Record<string, { category: string; station: string; available: boolean; currentPrice: number; currentCost: number }> = {}
  for (const m of menuItems || []) {
    menuMap[m.id] = {
      category: catMap[m.category_id] || 'Uncategorised',
      station: m.station || 'all',
      available: m.available !== false,
      currentPrice: m.price || 0,
      currentCost: m.food_cost || 0,
    }
  }

  // Aggregate by menu item
  const itemStats: Record<string, {
    name: string; menuItemId: string | null
    totalQty: number; totalRevenue: number; totalCost: number
    category: string; station: string; available: boolean
  }> = {}

  for (const oi of orderItems || []) {
    const key = oi.menu_item_id || oi.name
    if (!itemStats[key]) {
      const meta = oi.menu_item_id ? menuMap[oi.menu_item_id] : null
      itemStats[key] = {
        name: oi.name,
        menuItemId: oi.menu_item_id,
        totalQty: 0,
        totalRevenue: 0,
        totalCost: 0,
        category: meta?.category || 'Uncategorised',
        station: meta?.station || 'all',
        available: meta?.available ?? true,
      }
    }
    const qty = oi.qty || 1
    itemStats[key].totalQty += qty
    itemStats[key].totalRevenue += (oi.unit_price || 0) * qty
    itemStats[key].totalCost += (oi.food_cost || 0) * qty
  }

  const items = Object.values(itemStats)
  if (items.length === 0) {
    return NextResponse.json({ items: [], summary: { total_items: 0, avg_margin: 0, avg_popularity: 0, days } })
  }

  // Calculate metrics
  const totalQtyAll = items.reduce((s, i) => s + i.totalQty, 0)
  const avgQty = totalQtyAll / items.length
  const avgMargin = items.reduce((s, i) => {
    const margin = i.totalRevenue > 0 ? ((i.totalRevenue - i.totalCost) / i.totalRevenue) * 100 : 0
    return s + margin
  }, 0) / items.length

  // Classify into quadrants
  const classified = items.map(item => {
    const margin = item.totalRevenue > 0 ? ((item.totalRevenue - item.totalCost) / item.totalRevenue) * 100 : 0
    const contributionMargin = item.totalRevenue - item.totalCost
    const highPopularity = item.totalQty >= avgQty
    const highMargin = margin >= avgMargin

    let quadrant: 'star' | 'plowhorse' | 'puzzle' | 'dog'
    if (highPopularity && highMargin) quadrant = 'star'
    else if (highPopularity && !highMargin) quadrant = 'plowhorse'
    else if (!highPopularity && highMargin) quadrant = 'puzzle'
    else quadrant = 'dog'

    return {
      name: item.name,
      menu_item_id: item.menuItemId,
      category: item.category,
      station: item.station,
      available: item.available,
      qty_sold: item.totalQty,
      revenue: Math.round(item.totalRevenue * 100) / 100,
      cost: Math.round(item.totalCost * 100) / 100,
      margin_pct: Math.round(margin * 10) / 10,
      contribution_margin: Math.round(contributionMargin * 100) / 100,
      quadrant,
    }
  }).sort((a, b) => b.contribution_margin - a.contribution_margin)

  return NextResponse.json({
    items: classified,
    summary: {
      total_items: classified.length,
      avg_margin: Math.round(avgMargin * 10) / 10,
      avg_popularity: Math.round(avgQty * 10) / 10,
      days,
      stars: classified.filter(i => i.quadrant === 'star').length,
      plowhorses: classified.filter(i => i.quadrant === 'plowhorse').length,
      puzzles: classified.filter(i => i.quadrant === 'puzzle').length,
      dogs: classified.filter(i => i.quadrant === 'dog').length,
      total_revenue: Math.round(classified.reduce((s, i) => s + i.revenue, 0)),
      total_cost: Math.round(classified.reduce((s, i) => s + i.cost, 0)),
    },
  })
}
