import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

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

const PHOTO_TYPE: Record<string, string> = {
  pickup: 'pickup_proof',
  deliver: 'delivery_proof',
  fail: 'failed_delivery',
  checkpoint: 'checkpoint',
  collect: 'collection_proof',
}

// POST — record a handover / status transition by a handler or driver
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const body = await req.json()
  const { parcel_id, action } = body

  if (!parcel_id) return json({ error: 'parcel_id required' }, 400)
  if (!['pickup', 'deliver', 'fail', 'checkpoint', 'collect'].includes(action)) {
    return json({ error: 'Invalid action' }, 400)
  }

  // Fetch parcel scoped to owner
  const { data: parcel, error: fetchErr } = await service
    .from('pos_parcels')
    .select('id, status, owner_id')
    .eq('id', parcel_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (fetchErr) return json({ error: fetchErr.message }, 500)
  if (!parcel) return json({ error: 'Parcel not found' }, 404)

  const lat = toNum(body.lat)
  const lng = toNum(body.lng)
  const now = new Date().toISOString()

  // Optionally store the proof photo first so we can link it to history
  let photoId: string | null = null
  if (body.photo_url) {
    const { data: photo } = await service
      .from('pos_parcel_photos')
      .insert({
        owner_id: auth.ownerId,
        parcel_id,
        photo_type: PHOTO_TYPE[action] || 'other',
        photo_url: body.photo_url,
        storage: body.storage === 'fallback' ? 'fallback' : 'supabase',
        lat,
        lng,
        captured_by: auth.staffId || null,
        notes: body.notes || null,
      })
      .select('id')
      .single()
    if (photo) photoId = photo.id
  }

  // Build the parcel status update for this action
  const updates: Record<string, unknown> = {}
  if (lat !== null) updates.current_lat = lat
  if (lng !== null) updates.current_lng = lng

  switch (action) {
    case 'pickup':
      // driver collects from branch -> in transit
      updates.status = 'in_transit'
      updates.assigned_driver_id = auth.staffId || undefined
      updates.dispatched_at = now
      break
    case 'deliver':
      updates.status = 'delivered'
      updates.delivered_by = auth.staffId || null
      updates.delivered_at = now
      if (body.notes) updates.delivery_notes = body.notes
      break
    case 'fail':
      updates.status = 'failed_delivery'
      updates.delivered_by = auth.staffId || null
      updates.fail_reason = body.fail_reason || 'Unspecified'
      if (body.notes) updates.delivery_notes = body.notes
      break
    case 'collect':
      // handler releases parcel to receiver at destination branch
      updates.status = 'collected'
      updates.released_by = auth.staffId || null
      updates.collected_at = now
      updates.collected_by_name = body.collected_by_name || null
      break
    case 'checkpoint':
      // does not change status — just a logged location ping
      break
  }

  // clean undefined values
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k])

  if (Object.keys(updates).length > 0) {
    const { error: updErr } = await service
      .from('pos_parcels')
      .update(updates)
      .eq('id', parcel_id)
      .eq('owner_id', auth.ownerId)
    if (updErr) return json({ error: updErr.message }, 500)
  }

  // For checkpoints (no status change) — and to attach the photo/notes that the
  // auto status-change trigger does not capture — write an explicit history row.
  if (action === 'checkpoint' || photoId || body.notes || body.fail_reason) {
    await service.from('pos_parcel_history').insert({
      parcel_id,
      from_status: parcel.status,
      to_status: (updates.status as string) || parcel.status,
      changed_by: auth.staffId || null,
      photo_id: photoId,
      lat,
      lng,
      notes: body.notes || body.fail_reason || (action === 'checkpoint' ? 'Checkpoint' : null),
      metadata: { action },
    })
  }

  // Return the refreshed parcel
  const { data: updated } = await service
    .from('pos_parcels')
    .select('*')
    .eq('id', parcel_id)
    .eq('owner_id', auth.ownerId)
    .single()

  return json({ parcel: updated, photo_id: photoId })
}
