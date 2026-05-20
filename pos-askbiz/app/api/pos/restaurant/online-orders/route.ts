import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — incoming online orders
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const days   = parseInt(searchParams.get('days') || '0')

  let query = service.from('restaurant_online_orders')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) {
    query = query.eq('status', status)
  } else if (days > 0) {
    const from = new Date(); from.setDate(from.getDate() - days); from.setHours(0,0,0,0)
    query = query.gte('created_at', from.toISOString())
  } else {
    query = query.in('status', ['pending', 'accepted', 'ready'])
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // Return both keys for backwards compat
  return NextResponse.json({ orders: data || [], online_orders: data || [] })
}

// POST — receive a new online order (from website widget or external platform)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const {
    customer_name, customer_phone, customer_email,
    items_json, subtotal, total, requested_time, source, location_id,
  } = await req.json()

  if (!items_json?.length) return NextResponse.json({ error: 'items_json required' }, { status: 400 })

  const { data, error } = await service.from('restaurant_online_orders').insert({
    owner_id:       auth.ownerId,
    location_id:    location_id || auth.locationId,
    customer_name, customer_phone, customer_email,
    items_json, subtotal: subtotal || 0, total: total || 0,
    requested_time, source: source || 'website',
    status: 'pending',
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ online_order: data })
}

// PATCH — accept/reject/mark ready a online order
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { id, action, reject_reason } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const now = new Date().toISOString()

  if (action === 'accept') {
    const { data: onlineOrder } = await service.from('restaurant_online_orders')
      .select('*').eq('id', id).eq('owner_id', auth.ownerId).single()
    if (!onlineOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Create a restaurant_order to drive the kitchen
    const { data: order } = await service.from('restaurant_orders').insert({
      owner_id:     auth.ownerId,
      location_id:  onlineOrder.location_id,
      order_type:   'online',
      status:       'open',
      customer_name: onlineOrder.customer_name,
      customer_phone: onlineOrder.customer_phone,
      subtotal:     onlineOrder.subtotal,
      total:        onlineOrder.total,
      source_ref:   id,
      seated_at:    now,
    }).select().single()

    // Create order items from snapshot
    if (order && onlineOrder.items_json?.length) {
      const items = onlineOrder.items_json.map((i: any) => ({
        owner_id:    auth.ownerId,
        order_id:    order.id,
        name:        i.name,
        unit_price:  i.price || i.unit_price,
        food_cost:   i.food_cost || 0,
        qty:         i.qty || 1,
        station:     i.station || 'all',
        course:      i.course || 'main',
        status:      'pending',
      }))
      const { data: orderItems } = await service.from('restaurant_order_items').insert(items).select()
      // Route to kitchen
      if (orderItems) {
        const byStation: Record<string, any[]> = {}
        for (const item of orderItems) {
          const s = item.station || 'all'
          if (!byStation[s]) byStation[s] = []
          byStation[s].push({ id: item.id, name: item.name, qty: item.qty })
        }
        await service.from('restaurant_kitchen_tickets').insert(
          Object.entries(byStation).map(([station, items]) => ({
            owner_id:   auth.ownerId,
            order_id:   order.id,
            station,
            status:     'pending',
            items_json: items,
            table_name: `Online — ${onlineOrder.customer_name || 'Order'}`,
            order_type: 'online',
            sent_at:    now,
          }))
        )
      }
    }

    await service.from('restaurant_online_orders').update({
      status: 'accepted', accepted_at: now, order_id: order?.id,
    }).eq('id', id)
    return NextResponse.json({ success: true, order_id: order?.id })
  }

  if (action === 'reject') {
    await service.from('restaurant_online_orders').update({ status: 'rejected' }).eq('id', id)
    return NextResponse.json({ success: true })
  }

  if (action === 'ready') {
    await service.from('restaurant_online_orders').update({
      status: 'ready', ready_at: now,
    }).eq('id', id)
    return NextResponse.json({ success: true })
  }

  if (action === 'collected' || action === 'collect') {
    await service.from('restaurant_online_orders').update({
      status: 'collected', collected_at: now,
    }).eq('id', id)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'action must be: accept | reject | ready | collected' }, { status: 400 })
}
