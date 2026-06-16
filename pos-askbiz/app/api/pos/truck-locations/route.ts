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

// POST — driver app sends a GPS ping { truck_id, lat, lng }
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const body = await req.json()

  const lat = toNum(body.lat)
  const lng = toNum(body.lng)
  if (lat === null || lng === null) return json({ error: 'lat and lng required' }, 400)

  // Verify the truck belongs to this owner (no cross-owner pings)
  let truck_id: string | null = body.truck_id || null
  if (truck_id) {
    const { data: truck } = await service
      .from('pos_trucks')
      .select('id')
      .eq('id', truck_id)
      .eq('owner_id', auth.ownerId)
      .maybeSingle()
    if (!truck) return json({ error: 'Truck not found' }, 404)
  }

  const { data, error } = await service
    .from('pos_truck_locations')
    .insert({
      owner_id: auth.ownerId,
      truck_id,
      driver_id: auth.staffId || null,
      lat,
      lng,
      // recorded_at defaults to now()
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ location: data }, 201)
}

// GET — managers read fleet positions.
//   ?latest=true  → most recent location per truck for the owner
//   ?truck_id=…   → full history for one truck (newest first)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // Fleet-wide tracking is a management view
  if (!roleCanAccess(auth.role || '', 'dispatcher')) {
    return json({ error: 'Not permitted to view fleet locations' }, 403)
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const truck_id = searchParams.get('truck_id')
  const latest = searchParams.get('latest')
  const limit = Math.min(500, parseInt(searchParams.get('limit') || '200'))

  // History for a single truck
  if (truck_id) {
    const { data, error } = await service
      .from('pos_truck_locations')
      .select('*')
      .eq('owner_id', auth.ownerId)
      .eq('truck_id', truck_id)
      .order('recorded_at', { ascending: false })
      .limit(limit)

    if (error) return json({ error: error.message }, 500)
    return json({ locations: data || [] })
  }

  // Latest position per truck
  if (latest === 'true') {
    // Pull a recent window then reduce to the newest row per truck.
    const { data, error } = await service
      .from('pos_truck_locations')
      .select(`
        *,
        truck:pos_trucks!truck_id(id, plate_number),
        driver:pos_staff!driver_id(id, name)
      `)
      .eq('owner_id', auth.ownerId)
      .order('recorded_at', { ascending: false })
      .limit(2000)

    if (error) return json({ error: error.message }, 500)

    const seen = new Set<string>()
    const latestPerTruck: any[] = []
    for (const row of data || []) {
      const key = row.truck_id || `none-${row.id}`
      if (seen.has(key)) continue
      seen.add(key)
      latestPerTruck.push(row)
    }
    return json({ locations: latestPerTruck })
  }

  // Default: recent pings across the fleet
  const { data, error } = await service
    .from('pos_truck_locations')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('recorded_at', { ascending: false })
    .limit(limit)

  if (error) return json({ error: error.message }, 500)
  return json({ locations: data || [] })
}
