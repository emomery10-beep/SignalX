import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

const DOWNTIME_REASONS = ['breakdown', 'changeover', 'no_materials', 'quality_hold', 'planned_maintenance', 'other'] as const
type DowntimeReason = (typeof DOWNTIME_REASONS)[number]

const DOWNTIME_PHOTOS_BUCKET = 'factory-downtime-photos'

// ─────────────────────────────────────────────────────────────
// Upload a downtime photo (start or end) to Supabase Storage.
// Mirrors the private-bucket + createSignedUrl pattern used by
// /api/pos/factory/capture, with the same data-URL fallback if
// the bucket hasn't been created yet.
// ─────────────────────────────────────────────────────────────
async function uploadDowntimePhoto(
  service: ReturnType<typeof createServiceClient>,
  ownerId: string,
  label: string,
  image: string,
): Promise<{ url: string; storage: 'supabase' | 'fallback' } | null> {
  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer     = Buffer.from(base64Data, 'base64')
    const filename   = `${ownerId}/${label}_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from(DOWNTIME_PHOTOS_BUCKET)
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      // Bucket may not exist yet — fall back to data URL
      console.error(`${DOWNTIME_PHOTOS_BUCKET} storage upload failed:`, uploadErr.message)
      return { url: `data:image/jpeg;base64,${base64Data}`, storage: 'fallback' }
    }

    // Private bucket — a public URL 404s in the browser. Sign it instead
    // (10-year expiry: these photos need to stay viewable indefinitely).
    const { data: signedData, error: signErr } = await service.storage
      .from(DOWNTIME_PHOTOS_BUCKET)
      .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)

    if (signErr || !signedData?.signedUrl) {
      console.error(`${DOWNTIME_PHOTOS_BUCKET} signed URL failed:`, signErr?.message)
      return { url: `data:image/jpeg;base64,${base64Data}`, storage: 'fallback' }
    }

    return { url: signedData.signedUrl, storage: 'supabase' }
  } catch (err) {
    console.error('Downtime photo upload error:', err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// Find-or-create a pos_factory_machines row by (owner_id, name).
// Mirrors the batch route's find-or-create-by-batch_ref idea —
// the UI only ever sends a free-text machine name, never an id.
// Best-effort: machine_id is a nullable FK, so a registry failure
// never blocks recording the downtime event itself.
// ─────────────────────────────────────────────────────────────
async function resolveMachineId(
  service: ReturnType<typeof createServiceClient>,
  ownerId: string,
  locationId: string | null,
  machineName: string,
): Promise<string | null> {
  try {
    const { data: existing } = await service
      .from('pos_factory_machines')
      .select('id')
      .eq('owner_id', ownerId)
      .eq('name', machineName)
      .maybeSingle()
    if (existing) return existing.id

    const { data: created, error: createErr } = await service
      .from('pos_factory_machines')
      .insert({ owner_id: ownerId, location_id: locationId, name: machineName })
      .select('id')
      .single()

    if (!createErr && created) return created.id

    // 23505 = unique violation: a concurrent request created it first
    if (createErr && (createErr as any).code === '23505') {
      const { data: retry } = await service
        .from('pos_factory_machines')
        .select('id')
        .eq('owner_id', ownerId)
        .eq('name', machineName)
        .maybeSingle()
      if (retry) return retry.id
    }

    console.error('pos_factory_machines find-or-create failed:', createErr?.message)
    return null
  } catch (err) {
    console.error('resolveMachineId error:', err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// GET — list downtime events, filtered to currently-open ones
// via ?active=true (what the downtime hub page calls on load).
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'downtime.view')) {
    return json({ error: 'Access denied' }, 403)
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const active = searchParams.get('active') === 'true'
  const limit  = Math.min(200, parseInt(searchParams.get('limit') || '100'))

  let query = service
    .from('pos_factory_downtime_events')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (active) query = query.eq('status', 'open')

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ activeEvents: data })
}

// ─────────────────────────────────────────────────────────────
// POST — open a new downtime event
// Body: { machine_name, reason, image (base64), location_id?, client_tx_id? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'downtime.report')) {
    return json({ error: 'Your role does not have permission to report downtime' }, 403)
  }

  const body = await req.json()
  const { reason, image, location_id } = body
  const machineName = (typeof body.machine_name === 'string' && body.machine_name.trim()) || 'Machine'

  if (!image) return json({ error: 'image required' }, 400)
  if (!reason || !DOWNTIME_REASONS.includes(reason as DowntimeReason)) {
    return json({ error: `reason must be one of ${DOWNTIME_REASONS.join(', ')}` }, 400)
  }

  const service = createServiceClient()

  // Idempotency: a client_tx_id makes retries and offline-queue replays
  // safe. Dedupe BEFORE uploading the photo, so a replay never re-uploads
  // a duplicate blob for an event that's already recorded.
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null
  if (clientTxId) {
    try {
      const { data: dupe, error: dupeErr } = await service
        .from('pos_factory_downtime_events')
        .select('*')
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (!dupeErr && dupe) return json({ event: dupe, deduped: true }, 200)
    } catch { /* dedupe is best-effort — never block a report on it */ }
  }

  const resolvedLocationId = location_id || auth.locationId || null
  const machineId = await resolveMachineId(service, auth.ownerId, resolvedLocationId, machineName)

  const upload = await uploadDowntimePhoto(service, auth.ownerId, 'start', image as string)
  if (!upload) return json({ error: 'Image upload failed' }, 500)

  const { data: event, error } = await service
    .from('pos_factory_downtime_events')
    .insert({
      owner_id:        auth.ownerId,
      location_id:     resolvedLocationId,
      machine_id:      machineId,
      machine_name:    machineName,
      reason,
      status:          'open',
      start_photo_url: upload.url,
      start_storage:   upload.storage,
      started_by:      auth.staffId || null,
      client_tx_id:    clientTxId,
    })
    .select('*')
    .single()

  if (error) {
    // 23505 = unique violation: a concurrent retry already recorded this event — return it
    if (clientTxId && (error as any).code === '23505') {
      const { data: dupe } = await service
        .from('pos_factory_downtime_events')
        .select('*')
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (dupe) return json({ event: dupe, deduped: true }, 200)
    }
    return json({ error: error.message }, 500)
  }

  logPosAudit({
    auth, event: 'downtime.reported', entityType: 'factory_downtime_event', entityId: event.id,
    toValue: reason,
    metadata: { machine_name: machineName, machine_id: machineId, storage: upload.storage },
  })

  return json({ event }, 201)
}

// ─────────────────────────────────────────────────────────────
// PATCH — close an existing (open) downtime event
// Body: { id, image (base64) }
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'downtime.close')) {
    return json({ error: 'Your role does not have permission to close downtime events' }, 403)
  }

  const { id, image } = await req.json()
  if (!id || !image) return json({ error: 'id and image required' }, 400)

  const service = createServiceClient()

  // Confirm the event belongs to this owner and is still open
  const { data: existing } = await service
    .from('pos_factory_downtime_events')
    .select('id, status, started_at')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!existing) return json({ error: 'Downtime event not found' }, 404)
  if (existing.status !== 'open') {
    return json({ error: 'Downtime event is already closed' }, 400)
  }

  const upload = await uploadDowntimePhoto(service, auth.ownerId, `${id}_end`, image as string)
  if (!upload) return json({ error: 'Image upload failed' }, 500)

  const endedAt   = new Date()
  const startedAt = new Date(existing.started_at)
  const durationMinutes = Math.max(0, Math.round(((endedAt.getTime() - startedAt.getTime()) / 60000) * 100) / 100)

  const { data: updated, error } = await service
    .from('pos_factory_downtime_events')
    .update({
      status:           'closed',
      end_photo_url:    upload.url,
      end_storage:      upload.storage,
      ended_at:         endedAt.toISOString(),
      duration_minutes: durationMinutes,
      closed_by:        auth.staffId || null,
    })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  logPosAudit({
    auth, event: 'downtime.closed', entityType: 'factory_downtime_event', entityId: id,
    toValue: 'closed',
    metadata: { duration_minutes: durationMinutes, storage: upload.storage },
  })

  return json({ event: updated })
}
