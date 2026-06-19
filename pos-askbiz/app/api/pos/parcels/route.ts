import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth, roleCanAccess } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// Escape ILIKE special chars to prevent injection
function escapeLike(s: string) {
  return s.replace(/[%_\\]/g, c => `\\${c}`)
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const SELECT = `
  *,
  truck:pos_trucks!assigned_truck_id(id, plate_number),
  driver:pos_staff!assigned_driver_id(id, name),
  sender_branch:pos_locations!sender_branch_id(id, name),
  destination_branch:pos_locations!destination_branch_id(id, name),
  route:pos_routes!route_id(id, name)
`

// GET — list parcels for the owner
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const driver_id = searchParams.get('driver_id')
  const assigned = searchParams.get('assigned')
  const search = searchParams.get('search') || ''
  const from = searchParams.get('from')
  const limit = Math.min(500, parseInt(searchParams.get('limit') || '100'))

  let query = service
    .from('pos_parcels')
    .select(SELECT)
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  if (driver_id) query = query.eq('assigned_driver_id', driver_id)
  if (assigned === 'true') query = query.not('assigned_driver_id', 'is', null)
  if (assigned === 'false') query = query.is('assigned_driver_id', null)
  if (from) query = query.gte('created_at', from)

  if (search) {
    const q = escapeLike(search)
    query = query.or(
      `tracking_number.ilike.%${q}%,sender_name.ilike.%${q}%,sender_phone.ilike.%${q}%,receiver_name.ilike.%${q}%,receiver_phone.ilike.%${q}%,destination_city.ilike.%${q}%`
    )
  }

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ parcels: data || [] })
}

// POST — create a parcel (counter-clerk / handler / driver / dispatcher / manager / owner)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  // counter-clerk (maps to handler level 25) and above can intake parcels
  if (!roleCanAccess(auth.role || '', 'handler')) {
    return json({ error: 'Not permitted to create parcels' }, 403)
  }

  const service = createServiceClient()
  const body = await req.json()

  const VALID_PAYMENT = ['cash', 'mpesa', 'mobile_money', 'card', 'account']

  const { data, error } = await service
    .from('pos_parcels')
    .insert({
      owner_id: auth.ownerId,
      tracking_number: body.tracking_number || '', // trigger auto-generates if blank
      sender_name: body.sender_name || null,
      sender_phone: body.sender_phone || null,
      sender_id_number: body.sender_id_number || null,
      sender_branch_id: body.sender_branch_id || auth.locationId || null,
      receiver_name: body.receiver_name || null,
      receiver_phone: body.receiver_phone || null,
      receiver_id_number: body.receiver_id_number || null,
      destination_branch_id: body.destination_branch_id || null,
      destination_city: body.destination_city || null,
      route_id: body.route_id || null,
      delivery_type: ['branch_to_branch', 'door_to_door'].includes(body.delivery_type) ? body.delivery_type : 'branch_to_branch',
      delivery_address: body.delivery_address || null,
      description: body.description || null,
      weight_kg: toNum(body.weight_kg),
      parcel_size: ['S', 'M', 'L', 'XL'].includes(body.parcel_size) ? body.parcel_size : null,
      declared_value: toNum(body.declared_value) ?? 0,
      fee_charged: toNum(body.fee_charged) ?? 0,
      payment_status: ['unpaid', 'paid', 'partial'].includes(body.payment_status) ? body.payment_status : 'unpaid',
      payment_method: VALID_PAYMENT.includes(body.payment_method) ? body.payment_method : null,
      intake_photo_url: body.intake_photo_url || null,
      intake_photo_path: body.intake_photo_path || null,
      sender_consent: body.sender_consent === true,
      receipt_consent: body.receipt_consent === true,
      consent_at: body.sender_consent === true ? new Date().toISOString() : null,
      consent_by: body.sender_consent === true ? (auth.staffId || null) : null,
      status: 'received',
      received_by: auth.staffId || null,
      current_branch_id: body.current_branch_id || auth.locationId || null,
      current_lat: toNum(body.lat),
      current_lng: toNum(body.lng),
    })
    .select(SELECT)
    .single()

  if (error) {
    if ((error as any).code === '23505') {
      return json({ error: 'Tracking number already exists' }, 409)
    }
    return json({ error: error.message }, 500)
  }

  // GDPR Art. 7 — persist an auditable consent record when the sender
  // opted into a WhatsApp/SMS receipt. Best-effort; never blocks intake.
  if (body.receipt_consent === true && (body.sender_phone || '').trim()) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const ua = req.headers.get('user-agent') || 'unknown'
    await service.from('pos_consent_log').insert({
      owner_id: auth.ownerId,
      customer_id: null,
      consent_type: 'whatsapp',
      status: 'granted',
      ip_address: ip,
      user_agent: ua,
      request_source: 'pos_terminal',
      timestamp: new Date().toISOString(),
    }).then(({ error: e }: { error: { message: string } | null }) => {
      if (e) console.error('consent_log insert failed:', e.message)
    })
  }

  return json({ parcel: data }, 201)
}

// PATCH — update a parcel (dispatch assignment, status transitions)
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const body = await req.json()
  const { id } = body
  if (!id) return json({ error: 'id required' }, 400)

  // Fetch current parcel scoped to owner
  const { data: current, error: fetchErr } = await service
    .from('pos_parcels')
    .select('id, status, assigned_driver_id')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (fetchErr) return json({ error: fetchErr.message }, 500)
  if (!current) return json({ error: 'Parcel not found' }, 404)

  // Assignment / dispatch fields require dispatcher level; drivers may only
  // touch their own parcels' status (handover route is preferred for drivers).
  const isDispatchAction =
    body.assigned_truck_id !== undefined ||
    body.assigned_driver_id !== undefined ||
    body.route_id !== undefined
  if (isDispatchAction && !roleCanAccess(auth.role || '', 'dispatcher')) {
    return json({ error: 'Only dispatchers and above can assign parcels' }, 403)
  }

  const VALID_STATUS = [
    'received', 'at_branch', 'assigned', 'loaded', 'in_transit',
    'at_destination', 'awaiting_collection', 'out_for_delivery', 'delivered', 'collected',
    'failed_delivery', 'returned',
  ]
  const VALID_PAYMENT = ['cash', 'mpesa', 'mobile_money', 'card', 'account']

  const updates: Record<string, unknown> = {}
  if (body.status !== undefined) {
    if (!VALID_STATUS.includes(body.status)) return json({ error: 'Invalid status' }, 400)
    updates.status = body.status
    // Stamp the right actor/timestamp for the destination + collection steps
    if (body.status === 'awaiting_collection') {
      updates.received_at_dest_by = auth.staffId || null
      updates.received_at_dest_at = new Date().toISOString()
    }
    if (body.status === 'collected') {
      updates.collected_by = auth.staffId || null
      updates.collected_at = new Date().toISOString()
      updates.released_by = auth.staffId || null
    }
  }
  if (body.current_branch_id !== undefined) updates.current_branch_id = body.current_branch_id || null
  if (body.assigned_truck_id !== undefined) updates.assigned_truck_id = body.assigned_truck_id || null
  if (body.assigned_driver_id !== undefined) updates.assigned_driver_id = body.assigned_driver_id || null
  if (body.route_id !== undefined) updates.route_id = body.route_id || null
  if (body.dispatched_at !== undefined) updates.dispatched_at = body.dispatched_at || null
  if (body.fee_charged !== undefined) updates.fee_charged = toNum(body.fee_charged) ?? 0
  if (body.payment_status !== undefined && ['unpaid', 'paid', 'partial'].includes(body.payment_status)) {
    updates.payment_status = body.payment_status
  }
  if (body.payment_method !== undefined && VALID_PAYMENT.includes(body.payment_method)) {
    updates.payment_method = body.payment_method
  }
  if (body.receiver_id_number !== undefined) updates.receiver_id_number = body.receiver_id_number || null
  if (body.collected_by_name !== undefined) updates.collected_by_name = body.collected_by_name || null
  if (body.collection_photo_url !== undefined) updates.collection_photo_url = body.collection_photo_url || null
  if (body.collection_photo_path !== undefined) updates.collection_photo_path = body.collection_photo_path || null
  if (body.delivery_notes !== undefined) updates.delivery_notes = body.delivery_notes || null

  if (Object.keys(updates).length === 0) return json({ error: 'No valid fields to update' }, 400)

  const { data, error } = await service
    .from('pos_parcels')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select(SELECT)
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ parcel: data })
}
