import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

// GET — list all locations for this owner
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_locations')
    .select('id, name, address, phone, is_active, created_at')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ locations: data || [] })
}

// POST — create a new location
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { name, address, phone } = await req.json()

  if (!name?.trim()) return NextResponse.json({ error: 'Location name required' }, { status: 400 })

  const { data, error } = await service
    .from('pos_locations')
    .insert({ owner_id: ownerId, name: name.trim(), address: address || null, phone: phone || null })
    .select('id, name, address, phone, is_active, created_at')
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Location with this name already exists' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ location: data }, { status: 201 })
}

// PATCH — update a location
export async function PATCH(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { id, name, address, phone, is_active } = await req.json()

  if (!id) return NextResponse.json({ error: 'Location id required' }, { status: 400 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (name !== undefined) updates.name = name.trim()
  if (address !== undefined) updates.address = address
  if (phone !== undefined) updates.phone = phone
  if (is_active !== undefined) updates.is_active = is_active

  const { error } = await service
    .from('pos_locations')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', ownerId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
