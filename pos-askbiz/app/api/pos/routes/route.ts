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

const SELECT = `
  *,
  origin:pos_locations!origin_branch_id(id, name),
  destination:pos_locations!destination_branch_id(id, name)
`

// GET — list delivery routes for the owner
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const activeOnly = searchParams.get('active')

  let query = service
    .from('pos_routes')
    .select(SELECT)
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })

  if (activeOnly === 'true') query = query.eq('active', true)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ routes: data || [] })
}

// POST — create a route (branch_manager / dispatcher / manager / owner)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!roleCanAccess(auth.role || '', 'dispatcher')) {
    return json({ error: 'Only dispatchers and above can create routes' }, 403)
  }

  const service = createServiceClient()
  const body = await req.json()

  if (!body.origin_branch_id || !body.destination_branch_id) {
    return json({ error: 'origin_branch_id and destination_branch_id required' }, 400)
  }

  const { data, error } = await service
    .from('pos_routes')
    .insert({
      owner_id: auth.ownerId,
      origin_branch_id: body.origin_branch_id,
      destination_branch_id: body.destination_branch_id,
      name: body.name || null,
      distance_km: toNum(body.distance_km),
      price_per_kg: toNum(body.price_per_kg) ?? 0,
      flat_rate: toNum(body.flat_rate) ?? 0,
      estimated_hours: toNum(body.estimated_hours),
      active: body.active === false ? false : true,
    })
    .select(SELECT)
    .single()

  if (error) {
    if ((error as any).code === '23505') {
      return json({ error: 'A route between these branches already exists' }, 409)
    }
    return json({ error: error.message }, 500)
  }

  return json({ route: data }, 201)
}
