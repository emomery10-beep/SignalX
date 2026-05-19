import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { parcel_id, action, photo_url, lat, lng, notes, collected_by_name, fail_reason } = body

  if (!parcel_id || !action) {
    return NextResponse.json({ error: 'parcel_id and action required' }, { status: 400 })
  }

  const validActions = ['pickup', 'deliver', 'collect', 'fail', 'return', 'checkpoint']
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: `Invalid action. Must be one of: ${validActions.join(', ')}` }, { status: 400 })
  }

  const statusMap: Record<string, string> = {
    pickup: 'in_transit',
    deliver: 'delivered',
    collect: 'collected',
    fail: 'failed_delivery',
    return: 'returned',
    checkpoint: '',
  }

  const photoTypeMap: Record<string, string> = {
    pickup: 'pickup_proof',
    deliver: 'delivery_proof',
    collect: 'collection_proof',
    fail: 'failed_delivery',
    return: 'return',
    checkpoint: 'checkpoint',
  }

  // Save photo if provided
  let photoId = null
  if (photo_url) {
    const { data: photo } = await service
      .from('pos_parcel_photos')
      .insert({
        owner_id: auth.ownerId,
        parcel_id,
        photo_type: photoTypeMap[action],
        photo_url,
        storage: body.storage || 'supabase',
        lat: lat || null,
        lng: lng || null,
        captured_by: auth.staffId || null,
        branch_id: auth.locationId || null,
      })
      .select('id')
      .single()
    photoId = photo?.id || null
  }

  // Update parcel status (skip for checkpoint — just log the photo + history)
  const newStatus = statusMap[action]
  if (newStatus) {
    const updates: Record<string, unknown> = {
      status: newStatus,
      current_lat: lat || null,
      current_lng: lng || null,
    }

    if (action === 'deliver') {
      updates.delivered_by = auth.staffId
      updates.delivered_at = new Date().toISOString()
      updates.delivery_notes = notes || null
    }
    if (action === 'collect') {
      updates.released_by = auth.staffId
      updates.collected_at = new Date().toISOString()
      updates.collected_by_name = collected_by_name || null
    }
    if (action === 'fail') {
      updates.fail_reason = fail_reason || notes || null
    }
    if (action === 'return') {
      updates.return_reason = notes || null
    }
    if (action === 'pickup') {
      updates.dispatched_at = new Date().toISOString()
    }

    const { error: updateErr } = await service
      .from('pos_parcels')
      .update(updates)
      .eq('id', parcel_id)
      .eq('owner_id', auth.ownerId)

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // Log to history (especially for checkpoints which don't change status)
  if (action === 'checkpoint') {
    await service.from('pos_parcel_history').insert({
      parcel_id,
      from_status: 'in_transit',
      to_status: 'in_transit',
      changed_by: auth.staffId,
      photo_id: photoId,
      lat: lat || null,
      lng: lng || null,
      notes: notes || 'Checkpoint',
    })
  }

  return NextResponse.json({ success: true, action, photo_id: photoId })
}
