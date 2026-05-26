import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — active orders (open/sent/in-kitchen) or by date range
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status      = searchParams.get('status')        // filter by status
  const table_id    = searchParams.get('table_id')
  const from        = searchParams.get('from') || new Date(Date.now() - 86400000).toISOString()
  const to          = searchParams.get('to')   || new Date().toISOString()
  const active_only = searchParams.get('active') === 'true'

  let query = service.from('restaurant_orders')
    .select(`
      *,
      table:restaurant_tables!table_id(id, name, section, capacity),
      server:pos_staff!server_id(id, name, role),
      order_items:restaurant_order_items(
        id, name, unit_price, food_cost, qty, status, course, station, notes,
        sent_at, ready_at, served_at, created_at,
        modifiers:restaurant_order_item_modifiers(id, group_name, name, price_adjustment)
      )
    `)
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })

  if (active_only) {
    query = query.in('status', ['open', 'sent', 'all_served'])
  } else {
    query = query.gte('created_at', from).lte('created_at', to)
  }
  if (status)   query = query.eq('status', status)
  if (table_id) query = query.eq('table_id', table_id)

  const limit = parseInt(searchParams.get('limit') || '100')
  query = query.limit(limit)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data || [] })
}

// POST — create a new order + send to kitchen
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const body = await req.json()
  const { table_id, server_id, covers, order_type, customer_name, customer_phone, notes, items, location_id } = body

  if (!items?.length) return NextResponse.json({ error: 'items required' }, { status: 400 })

  // Calculate totals
  const subtotal = items.reduce((s: number, i: any) => {
    const modAdj = (i.modifiers || []).reduce((ms: number, m: any) => ms + (m.price_adjustment || 0), 0)
    return s + (i.unit_price + modAdj) * i.qty
  }, 0)

  // Create order
  const { data: order, error: orderErr } = await service.from('restaurant_orders').insert({
    owner_id:     auth.ownerId,
    location_id:  location_id || auth.locationId,
    table_id:     table_id || null,
    server_id:    server_id || auth.staffId,
    covers:       covers || 1,
    order_type:   order_type || 'dine_in',
    customer_name, customer_phone, notes,
    subtotal,
    total: subtotal,
    status: 'open',
    seated_at: new Date().toISOString(),
  }).select().single()
  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

  // Create order items
  const itemInserts = items.map((i: any) => ({
    owner_id:     auth.ownerId,
    order_id:     order.id,
    menu_item_id: i.menu_item_id || null,
    name:         i.name,
    unit_price:   i.unit_price,
    food_cost:    i.food_cost || 0,
    qty:          i.qty || 1,
    course:       i.course || 'main',
    station:      i.station || 'all',
    notes:        i.notes || null,
    status:       'pending',
  }))
  const { data: orderItems, error: itemErr } = await service
    .from('restaurant_order_items').insert(itemInserts).select()
  if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 500 })

  // Insert modifier snapshots
  const modInserts: any[] = []
  for (const [idx, item] of items.entries()) {
    const savedItem = orderItems?.[idx]
    if (!savedItem || !item.modifiers?.length) continue
    for (const m of item.modifiers) {
      modInserts.push({
        order_item_id:    savedItem.id,
        modifier_id:      m.modifier_id || null,
        group_name:       m.group_name || '',
        name:             m.name,
        price_adjustment: m.price_adjustment || 0,
      })
    }
  }
  if (modInserts.length) {
    await service.from('restaurant_order_item_modifiers').insert(modInserts)
  }

  // Mark table as occupied and link order
  if (table_id) {
    await service.from('restaurant_tables').update({
      status:           'occupied',
      current_order_id: order.id,
      server_id:        server_id || auth.staffId,
      seated_at:        new Date().toISOString(),
    }).eq('id', table_id).eq('owner_id', auth.ownerId)
  }

  // Send to kitchen — group items by station
  await sendToKitchen(service, auth.ownerId, order, orderItems || [], auth.locationId)

  return NextResponse.json({ order, items: orderItems })
}

// PATCH — update order (add items, change status, process payment)
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const body = await req.json()
  const { id, action, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Add more items to existing open order
  if (action === 'add_items') {
    const { items } = fields
    if (!items?.length) return NextResponse.json({ error: 'items required' }, { status: 400 })

    const { data: order } = await service.from('restaurant_orders')
      .select('id, subtotal, total, status, table_id, covers').eq('id', id).single()
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const itemInserts = items.map((i: any) => ({
      owner_id: auth.ownerId, order_id: id,
      menu_item_id: i.menu_item_id || null, name: i.name,
      unit_price: i.unit_price, food_cost: i.food_cost || 0,
      qty: i.qty || 1, course: i.course || 'main',
      station: i.station || 'all', notes: i.notes || null, status: 'pending',
    }))
    const { data: newItems } = await service.from('restaurant_order_items').insert(itemInserts).select()

    const addedTotal = items.reduce((s: number, i: any) => s + i.unit_price * i.qty, 0)
    const newTotal = (order.total || 0) + addedTotal
    await service.from('restaurant_orders').update({ subtotal: newTotal, total: newTotal })
      .eq('id', id).eq('owner_id', auth.ownerId)

    // Send new items to kitchen
    await sendToKitchen(service, auth.ownerId, order, newItems || [], auth.locationId)
    return NextResponse.json({ success: true, items: newItems })
  }

  // Pay and close order
  if (action === 'pay') {
    const { payment_type, amount_tendered, discount_amount, tax_amount } = fields
    const { data: order } = await service.from('restaurant_orders')
      .select('*, order_items:restaurant_order_items(*), table:restaurant_tables!table_id(name)').eq('id', id).single()
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const finalDiscount = discount_amount || 0
    const finalTax      = tax_amount || 0
    const finalTotal    = order.subtotal - finalDiscount + finalTax

    // Create pos_transaction to link to financial records
    const txItems = (order.order_items || []).map((i: any) => ({
      name: i.name, qty: i.qty, unit_price: i.unit_price, cost_price: i.food_cost || 0,
    }))
    const { data: posTx } = await service.from('pos_transactions').insert({
      owner_id:     auth.ownerId,
      pos_location_id: order.location_id,
      cashier_id:   order.server_id,
      subtotal:     order.subtotal,
      discount_amount: finalDiscount,
      total:        finalTotal,
      amount_tendered: amount_tendered || finalTotal,
      payment_type: payment_type || 'cash',
      status:       'completed',
      notes:        `Restaurant order — ${order.table?.name || order.order_type}`,
    }).select().single()

    // Link pos items
    if (posTx && txItems.length) {
      await service.from('pos_items').insert(
        txItems.map((i: any) => ({ ...i, transaction_id: posTx.id }))
      )
    }

    // Deduct inventory for menu items that have a linked inventory_id
    const menuItemIds = (order.order_items || [])
      .map((i: any) => i.menu_item_id).filter(Boolean)
    if (menuItemIds.length) {
      const { data: menuItems } = await service.from('restaurant_menu_items')
        .select('id, inventory_id').in('id', menuItemIds)
      const invMap: Record<string, string> = {}
      for (const mi of menuItems || []) {
        if (mi.inventory_id) invMap[mi.id] = mi.inventory_id
      }
      for (const oi of order.order_items || []) {
        const inventoryId = invMap[oi.menu_item_id]
        if (!inventoryId) continue
        const { error: rpcErr } = await service.rpc('decrement_inventory_stock', {
          p_id: inventoryId, p_owner_id: auth.ownerId, p_qty: oi.qty || 1,
        })
        if (rpcErr) {
          const { data: inv } = await service.from('inventory')
            .select('stock_qty').eq('id', inventoryId).eq('owner_id', auth.ownerId).single()
          if (inv) {
            await service.from('inventory')
              .update({ stock_qty: Math.max(0, (inv.stock_qty || 0) - (oi.qty || 1)) })
              .eq('id', inventoryId).eq('owner_id', auth.ownerId)
          }
        }
      }
    }

    // Close order
    await service.from('restaurant_orders').update({
      status: 'paid', payment_type, discount_amount: finalDiscount,
      tax_amount: finalTax, total: finalTotal,
      pos_transaction_id: posTx?.id || null,
      paid_at: new Date().toISOString(),
    }).eq('id', id).eq('owner_id', auth.ownerId)

    // Free the table
    if (order.table_id) {
      await service.from('restaurant_tables').update({
        status: 'cleaning', current_order_id: null, server_id: null, seated_at: null,
      }).eq('id', order.table_id).eq('owner_id', auth.ownerId)
    }

    // Update loyalty points if customer linked
    if (order.customer_id) {
      const { data: cust } = await service.from('pos_customers')
        .select('total_spent').eq('id', order.customer_id).single()
      if (cust) {
        await service.from('pos_customers')
          .update({ total_spent: (cust.total_spent || 0) + finalTotal, last_seen_at: new Date().toISOString() })
          .eq('id', order.customer_id)
      }
    }

    return NextResponse.json({ success: true, pos_transaction_id: posTx?.id })
  }

  // Generic field update (status, notes, covers, etc.)
  const { data, error } = await service.from('restaurant_orders')
    .update(fields).eq('id', id).eq('owner_id', auth.ownerId)
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ order: data })
}

// ── Helper: route items to kitchen stations ───────────────────────
async function sendToKitchen(
  service: any, ownerId: string, order: any, items: any[], locationId: string | null
) {
  // Group items by station
  const byStation: Record<string, any[]> = {}
  for (const item of items) {
    const station = item.station || 'all'
    if (!byStation[station]) byStation[station] = []
    byStation[station].push({ id: item.id, name: item.name, qty: item.qty, notes: item.notes })
  }

  const tickets = Object.entries(byStation).map(([station, stationItems]) => ({
    owner_id:    ownerId,
    order_id:    order.id,
    location_id: locationId,
    station,
    status:      'pending',
    items_json:  stationItems,
    table_name:  order.table?.name || (order.order_type !== 'dine_in' ? order.order_type : 'Unknown'),
    covers:      order.covers || 1,
    server_name: order.server?.name || '',
    order_type:  order.order_type || 'dine_in',
    sent_at:     new Date().toISOString(),
  }))

  if (tickets.length) {
    await service.from('restaurant_kitchen_tickets').insert(tickets)
    // Mark order and items as sent
    await service.from('restaurant_orders').update({
      status: 'sent', first_item_sent_at: new Date().toISOString(),
    }).eq('id', order.id)
    await service.from('restaurant_order_items').update({
      status: 'sent', sent_at: new Date().toISOString(),
    }).eq('order_id', order.id).eq('status', 'pending')
  }
}
