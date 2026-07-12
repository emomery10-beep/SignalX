import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// Columns the wizard is allowed to write. Everything else (owner_id, ids,
// timestamps) is server-controlled.
const WRITABLE = new Set([
  'stage', 'readiness_score',
  'gate_menu', 'gate_id', 'gate_payout', 'gate_permit', 'gate_health', 'gate_food_handler',
  'id_capture_id', 'permit_capture_id', 'health_capture_id',
  'payout_method', 'payout_number',
  'submitted_glovo', 'submitted_bolt', 'submitted_uber',
])

// GET: the current vendor's readiness row, creating a default one if none exists
// so the wizard always has something to render.
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const location_id = req.headers.get('x-location-id') || auth.locationId || null

  let query = service.from('restaurant_vendor_readiness').select('*').eq('owner_id', auth.ownerId)
  query = location_id ? query.eq('location_id', location_id) : query.is('location_id', null)
  const { data: existing, error } = await query.maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (existing) return NextResponse.json({ readiness: existing })

  const { data: created, error: insErr } = await service
    .from('restaurant_vendor_readiness')
    .insert({ owner_id: auth.ownerId, location_id })
    .select()
    .single()
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
  return NextResponse.json({ readiness: created })
}

// PATCH: update gate statuses / stage / payout / submission for the current vendor.
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const location_id = req.headers.get('x-location-id') || auth.locationId || null

  const body = await req.json()
  const fields: Record<string, any> = {}
  for (const [k, v] of Object.entries(body || {})) {
    if (WRITABLE.has(k)) fields[k] = v
  }
  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: 'no writable fields' }, { status: 400 })
  }

  let query = service.from('restaurant_vendor_readiness').update(fields).eq('owner_id', auth.ownerId)
  query = location_id ? query.eq('location_id', location_id) : query.is('location_id', null)
  const { data, error } = await query.select().maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ readiness: data })
}
