import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  const { data, error } = await service
    .from('pos_routes')
    .select('*, origin:pos_locations!origin_branch_id(id, name), destination:pos_locations!destination_branch_id(id, name)')
    .eq('owner_id', auth.ownerId)
    .eq('active', true)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ routes: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'branch_manager')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  if (!body.origin_branch_id || !body.destination_branch_id) {
    return NextResponse.json({ error: 'origin_branch_id and destination_branch_id required' }, { status: 400 })
  }

  const { data, error } = await service
    .from('pos_routes')
    .insert({
      owner_id: auth.ownerId,
      origin_branch_id: body.origin_branch_id,
      destination_branch_id: body.destination_branch_id,
      name: body.name || null,
      distance_km: body.distance_km || null,
      price_per_kg: body.price_per_kg || 0,
      flat_rate: body.flat_rate || 0,
      estimated_hours: body.estimated_hours || null,
    })
    .select('*, origin:pos_locations!origin_branch_id(id, name), destination:pos_locations!destination_branch_id(id, name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ route: data })
}

export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'branch_manager')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const allowed = ['name', 'distance_km', 'price_per_kg', 'flat_rate', 'estimated_hours', 'active']
  const filtered: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key]
  }

  const { data, error } = await service
    .from('pos_routes')
    .update(filtered)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ route: data })
}
