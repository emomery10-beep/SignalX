import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth, roleCanAccess } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// POST — save a pre_trip / post_trip inspection (driver, handler, or above)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const body = await req.json()

  const truck_id = body.truck_id
  const type = body.type === 'post_trip' ? 'post_trip' : body.type === 'pre_trip' ? 'pre_trip' : null

  if (!truck_id) return json({ error: 'truck_id required' }, 400)
  if (!type) return json({ error: 'type must be pre_trip or post_trip' }, 400)

  // The driver doing the inspection — use explicit staff_id or fall back to auth
  const driver_id = body.staff_id || auth.staffId
  if (!driver_id) return json({ error: 'staff_id required' }, 400)

  // Verify the truck belongs to this owner (prevent cross-owner writes)
  const { data: truck } = await service
    .from('pos_trucks')
    .select('id')
    .eq('id', truck_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()
  if (!truck) return json({ error: 'Truck not found' }, 404)

  const flagged_issues = Array.isArray(body.flagged_issues) ? body.flagged_issues : []
  const status = flagged_issues.length > 0 ? 'flagged' : 'complete'

  const { data, error } = await service
    .from('pos_vehicle_inspections')
    .insert({
      owner_id: auth.ownerId,
      truck_id,
      driver_id,
      branch_id: body.branch_id || auth.locationId || null,
      type,
      status,
      photo_front: body.photo_front || null,
      photo_rear: body.photo_rear || null,
      photo_left: body.photo_left || null,
      photo_right: body.photo_right || null,
      photo_tyres: body.photo_tyres || null,
      photo_cargo: body.photo_cargo || null,
      flagged_issues,
      notes: body.notes || null,
      lat: toNum(body.lat),
      lng: toNum(body.lng),
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  // If issues flagged, flag the truck for maintenance review
  if (status === 'flagged') {
    await service
      .from('pos_trucks')
      .update({ status: 'maintenance' })
      .eq('id', truck_id)
      .eq('owner_id', auth.ownerId)
      .eq('status', 'available')
  }

  return json({ inspection: data }, 201)
}

// GET — list inspections for a truck / owner (managers + drivers viewing own)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const truck_id = searchParams.get('truck_id')
  const inspectionType = searchParams.get('type')
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_vehicle_inspections')
    .select(`
      *,
      truck:pos_trucks!truck_id(id, plate_number),
      driver:pos_staff!driver_id(id, name)
    `)
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (truck_id) query = query.eq('truck_id', truck_id)
  if (inspectionType) query = query.eq('type', inspectionType)

  // Drivers / handlers can only see their own inspections
  if (!roleCanAccess(auth.role || '', 'dispatcher') && auth.staffId) {
    query = query.eq('driver_id', auth.staffId)
  }

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ inspections: data || [] })
}
