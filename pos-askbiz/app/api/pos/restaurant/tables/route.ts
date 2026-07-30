import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — all tables with current order info
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const location_id = searchParams.get('location_id') || auth.locationId

  // Note: current_order_id has no FK constraint to restaurant_orders (deliberately
  // loose so the order row can be voided/cleared independently), so it can't be
  // embedded via PostgREST relationship syntax like `restaurant_orders!current_order_id`.
  // Doing so makes PostgREST fail to resolve the relationship and the whole query
  // errors out with a 500 — which silently renders as an empty floor plan client-side.
  // Fetch current orders separately instead and merge them in.
  let query = service.from('restaurant_tables')
    .select(`
      *,
      server:pos_staff!server_id(id, name, role),
      upcoming_reservations:restaurant_reservations(
        id, customer_name, covers, reserved_at, status
      )
    `)
    .eq('owner_id', auth.ownerId)
    .order('section').order('name')

  if (location_id) query = query.eq('location_id', location_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const tables = data || []
  const orderIds = Array.from(new Set(tables.map((t: any) => t.current_order_id).filter(Boolean)))

  let ordersById: Record<string, any> = {}
  if (orderIds.length > 0) {
    const { data: orders, error: ordersError } = await service
      .from('restaurant_orders')
      .select(`
        id, status, covers, total, created_at, seated_at,
        order_items:restaurant_order_items(id, name, qty, status)
      `)
      .in('id', orderIds)
    if (ordersError) return NextResponse.json({ error: ordersError.message }, { status: 500 })
    ordersById = Object.fromEntries((orders || []).map((o: any) => [o.id, o]))
  }

  const tablesWithOrders = tables.map((t: any) => ({
    ...t,
    current_order: t.current_order_id ? (ordersById[t.current_order_id] || null) : null,
  }))

  return NextResponse.json({ tables: tablesWithOrders })
}

// POST — create a table
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { name, section, capacity, shape, x_pos, y_pos, width, height, location_id } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data, error } = await service.from('restaurant_tables').insert({
    owner_id: auth.ownerId,
    location_id: location_id || auth.locationId,
    name, section: section || 'Main',
    capacity: capacity || 4,
    shape: shape || 'rectangle',
    x_pos: x_pos || 0, y_pos: y_pos || 0,
    width: width || 2, height: height || 2,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ table: data })
}

// PATCH — update table (status, server, position, etc.)
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // If clearing table (status → available), unlink order and clear timings
  if (fields.status === 'available') {
    fields.current_order_id = null
    fields.server_id = null
    fields.seated_at = null
    fields.reservation_name = null
    fields.reservation_at = null
  }
  if (fields.status === 'occupied' && !fields.seated_at) {
    fields.seated_at = new Date().toISOString()
  }

  const { data, error } = await service.from('restaurant_tables')
    .update(fields).eq('id', id).eq('owner_id', auth.ownerId)
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ table: data })
}

// DELETE — remove a table
export async function DELETE(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { error } = await service.from('restaurant_tables').delete()
    .eq('id', id).eq('owner_id', auth.ownerId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
