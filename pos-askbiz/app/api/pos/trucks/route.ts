import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth, roleCanAccess } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

const TRUCK_STATUSES = ['available', 'in_transit', 'maintenance', 'decommissioned']

// Managers / branch managers / dispatchers / owner may manage fleet.
// branch_manager and dispatcher are logistics roles above driver/handler.
function canManageFleet(role: string | null): boolean {
  return roleCanAccess(role || '', 'dispatcher')
}

// GET — list trucks for the owner, optionally filtered by status
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  let query = service
    .from('pos_trucks')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ trucks: data || [] })
}

// POST — create a truck (branch_manager / manager / owner / dispatcher)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!canManageFleet(auth.role)) {
    return json({ error: 'Only managers, branch managers or dispatchers can register trucks' }, 403)
  }

  const service = createServiceClient()
  const body = await req.json()
  // Accept registration/plate aliases
  const plate_number = (body.plate_number || body.registration || body.plate || '').toString().trim()
  const make_model = (body.make_model || [body.make, body.model].filter(Boolean).join(' ') || '').toString().trim() || null
  const status = TRUCK_STATUSES.includes(body.status) ? body.status : 'available'
  const location_id = body.location_id || auth.locationId || null
  const notes = body.notes ? String(body.notes) : null

  if (!plate_number) return json({ error: 'plate_number (registration) required' }, 400)

  const { data, error } = await service
    .from('pos_trucks')
    .insert({
      owner_id: auth.ownerId,
      location_id,
      plate_number,
      make_model,
      status,
      notes,
    })
    .select('*')
    .single()

  if (error) {
    if ((error as any).code === '23505') {
      return json({ error: 'A truck with this plate number already exists' }, 409)
    }
    return json({ error: error.message }, 500)
  }

  return json({ truck: data }, 201)
}

// PATCH — update truck status / assignment / details
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!canManageFleet(auth.role)) {
    return json({ error: 'Only managers, branch managers or dispatchers can update trucks' }, 403)
  }

  const service = createServiceClient()
  const body = await req.json()
  const { id } = body
  if (!id) return json({ error: 'id required' }, 400)

  const updates: Record<string, unknown> = {}
  if (body.status !== undefined) {
    if (!TRUCK_STATUSES.includes(body.status)) return json({ error: 'Invalid status' }, 400)
    updates.status = body.status
  }
  if (body.plate_number !== undefined) updates.plate_number = String(body.plate_number).trim()
  if (body.make_model !== undefined) updates.make_model = body.make_model || null
  if (body.location_id !== undefined) updates.location_id = body.location_id || null
  if (body.notes !== undefined) updates.notes = body.notes || null

  if (Object.keys(updates).length === 0) return json({ error: 'No valid fields to update' }, 400)

  const { data, error } = await service
    .from('pos_trucks')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)
  if (!data) return json({ error: 'Truck not found' }, 404)

  return json({ truck: data })
}
