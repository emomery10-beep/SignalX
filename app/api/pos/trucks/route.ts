import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const location_id = searchParams.get('location_id') || auth.locationId

  let query = service
    .from('pos_trucks')
    .select('*, branch:pos_locations!location_id(id, name)')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (location_id) query = query.eq('location_id', location_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trucks: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'branch_manager')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { plate_number, make_model, location_id, notes } = await req.json()
  if (!plate_number) return NextResponse.json({ error: 'plate_number required' }, { status: 400 })

  const { data, error } = await service
    .from('pos_trucks')
    .insert({
      owner_id: auth.ownerId,
      plate_number: plate_number.toUpperCase().trim(),
      make_model: make_model || null,
      location_id: location_id || auth.locationId || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ truck: data })
}

export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const allowed = ['plate_number', 'make_model', 'status', 'location_id', 'notes']
  const filtered: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key]
  }
  if (filtered.plate_number) filtered.plate_number = (filtered.plate_number as string).toUpperCase().trim()

  const { data, error } = await service
    .from('pos_trucks')
    .update(filtered)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ truck: data })
}
