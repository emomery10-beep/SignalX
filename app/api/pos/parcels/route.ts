import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const branch_id = searchParams.get('branch_id') || auth.locationId
  const driver_id = searchParams.get('driver_id')
  const tracking = searchParams.get('tracking')
  const search = searchParams.get('search')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
  const from = searchParams.get('from')

  let query = service
    .from('pos_parcels')
    .select(`
      *,
      sender_branch:pos_locations!sender_branch_id(id, name),
      destination_branch:pos_locations!destination_branch_id(id, name),
      current_branch:pos_locations!current_branch_id(id, name),
      truck:pos_trucks!assigned_truck_id(id, plate_number),
      driver:pos_staff!assigned_driver_id(id, name),
      received_staff:pos_staff!received_by(id, name),
      route:pos_routes!route_id(id, name, price_per_kg, flat_rate)
    `)
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  if (branch_id) query = query.or(`sender_branch_id.eq.${branch_id},destination_branch_id.eq.${branch_id},current_branch_id.eq.${branch_id}`)
  if (driver_id) query = query.eq('assigned_driver_id', driver_id)
  if (tracking) query = query.eq('tracking_number', tracking)
  if (from) query = query.gte('created_at', from)
  if (search) query = query.or(`sender_name.ilike.%${search}%,receiver_name.ilike.%${search}%,sender_phone.ilike.%${search}%,receiver_phone.ilike.%${search}%,tracking_number.ilike.%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ parcels: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  const parcel: Record<string, unknown> = {
    owner_id: auth.ownerId,
    sender_name: body.sender_name || null,
    sender_phone: body.sender_phone || null,
    sender_branch_id: body.sender_branch_id || auth.locationId || null,
    receiver_name: body.receiver_name || null,
    receiver_phone: body.receiver_phone || null,
    destination_branch_id: body.destination_branch_id || null,
    destination_city: body.destination_city || null,
    description: body.description || null,
    weight_kg: body.weight_kg || null,
    declared_value: body.declared_value || 0,
    fee_charged: body.fee_charged || 0,
    payment_status: body.payment_status || 'unpaid',
    payment_method: body.payment_method || null,
    status: 'received',
    received_by: auth.staffId || null,
    current_branch_id: body.sender_branch_id || auth.locationId || null,
    current_lat: body.lat || null,
    current_lng: body.lng || null,
    route_id: body.route_id || null,
    tracking_number: body.tracking_number || null,
  }

  const { data, error } = await service
    .from('pos_parcels')
    .insert(parcel)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ parcel: data })
}

export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const allowed = [
    'status', 'assigned_truck_id', 'assigned_driver_id', 'route_id',
    'current_branch_id', 'current_lat', 'current_lng',
    'delivered_by', 'released_by', 'delivery_notes', 'fail_reason',
    'return_reason', 'collected_by_name', 'dispatched_at', 'delivered_at',
    'collected_at', 'fee_charged', 'payment_status', 'payment_method',
    'sender_name', 'sender_phone', 'receiver_name', 'receiver_phone',
    'destination_branch_id', 'destination_city', 'description', 'weight_kg',
    'declared_value',
  ]

  const filtered: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key]
  }

  const { data, error } = await service
    .from('pos_parcels')
    .update(filtered)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ parcel: data })
}
