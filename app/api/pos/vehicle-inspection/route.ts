import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const truck_id = searchParams.get('truck_id')
  const driver_id = searchParams.get('driver_id') || (auth.role === 'driver' ? auth.staffId : null)
  const type = searchParams.get('type')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

  let query = service
    .from('pos_vehicle_inspections')
    .select('*, truck:pos_trucks!truck_id(id, plate_number), driver:pos_staff!driver_id(id, name)')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (truck_id) query = query.eq('truck_id', truck_id)
  if (driver_id) query = query.eq('driver_id', driver_id)
  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inspections: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  if (!body.truck_id || !body.type) {
    return NextResponse.json({ error: 'truck_id and type (pre_trip/post_trip) required' }, { status: 400 })
  }

  const hasFlagged = Array.isArray(body.flagged_issues) && body.flagged_issues.length > 0

  const { data, error } = await service
    .from('pos_vehicle_inspections')
    .insert({
      owner_id: auth.ownerId,
      truck_id: body.truck_id,
      driver_id: auth.staffId || body.driver_id,
      branch_id: auth.locationId || body.branch_id || null,
      type: body.type,
      status: hasFlagged ? 'flagged' : 'complete',
      photo_front: body.photo_front || null,
      photo_rear: body.photo_rear || null,
      photo_left: body.photo_left || null,
      photo_right: body.photo_right || null,
      photo_tyres: body.photo_tyres || null,
      photo_cargo: body.photo_cargo || null,
      flagged_issues: body.flagged_issues || [],
      notes: body.notes || null,
      lat: body.lat || null,
      lng: body.lng || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If flagged, put truck into maintenance status
  if (hasFlagged) {
    await service
      .from('pos_trucks')
      .update({ status: 'maintenance' })
      .eq('id', body.truck_id)
      .eq('owner_id', auth.ownerId)
  }

  return NextResponse.json({ inspection: data })
}
