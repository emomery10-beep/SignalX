import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — list service presets for this owner
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  let query = service
    .from('pos_service_presets')
    .select('*, location:pos_locations!location_id(id, name)')
    .eq('owner_id', auth.ownerId)
    .eq('active', true)
    .order('category')
    .order('name')

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ presets: data })
}

// POST — create a new service preset
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (auth.role !== 'owner' && auth.role !== 'repair') {
    return json({ error: 'Only owner or repair staff can manage presets' }, 403)
  }

  const service = createServiceClient()
  const { name, category, price, estimated_minutes, parts_required, location_id } = await req.json()

  if (!name?.trim()) return json({ error: 'name required' }, 400)
  if (price === undefined || price < 0) return json({ error: 'valid price required' }, 400)

  const { data, error } = await service
    .from('pos_service_presets')
    .insert({
      owner_id: auth.ownerId,
      name: name.trim(),
      category: category?.trim() || 'general',
      price: Number(price),
      estimated_minutes: estimated_minutes ? parseInt(estimated_minutes) : 60,
      parts_required: parts_required || [],
      location_id: location_id || auth.locationId || null,
    })
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ preset: data }, 201)
}

// PATCH — update a service preset
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (auth.role !== 'owner' && auth.role !== 'repair') {
    return json({ error: 'Only owner or repair staff can manage presets' }, 403)
  }

  const service = createServiceClient()
  const { id, ...fields } = await req.json()
  if (!id) return json({ error: 'id required' }, 400)

  const allowed = ['name', 'category', 'price', 'estimated_minutes', 'parts_required', 'active', 'location_id']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (fields[key] !== undefined) updates[key] = fields[key]
  }

  if (Object.keys(updates).length === 0) {
    return json({ error: 'No valid fields to update' }, 400)
  }

  const { data, error } = await service
    .from('pos_service_presets')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ preset: data })
}
