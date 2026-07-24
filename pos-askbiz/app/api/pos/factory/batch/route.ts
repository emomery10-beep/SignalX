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

const CHECKPOINTS = ['intake', 'in_progress', 'qc_pass', 'qc_fail', 'dispatch'] as const
type Checkpoint = (typeof CHECKPOINTS)[number]

const BATCH_COLUMNS  = 'id, batch_ref, product_name, status, updated_at'
const EVENT_COLUMNS  = 'id, batch_id, checkpoint, photo_url, created_at'

interface BatchRow {
  id: string
  batch_ref: string
  product_name: string | null
  status: string
  updated_at: string
}

interface EventRow {
  id: string
  batch_id: string
  checkpoint: string
  photo_url: string
  created_at: string
}

// Attach each batch's events (ascending by created_at, matching the
// frontend's photo-trail rendering — app/factory/batch/page.tsx reads
// events[events.length - 1] as "latest").
async function attachEvents(service: ReturnType<typeof createServiceClient>, batches: BatchRow[]) {
  if (batches.length === 0) return batches.map(b => ({ ...b, events: [] as EventRow[] }))

  const { data: events } = await service
    .from('pos_factory_batch_events')
    .select(EVENT_COLUMNS)
    .in('batch_id', batches.map(b => b.id))
    .order('created_at', { ascending: true })

  const byBatch = new Map<string, EventRow[]>()
  for (const ev of (events || []) as EventRow[]) {
    const list = byBatch.get(ev.batch_id) || []
    list.push({ id: ev.id, batch_id: ev.batch_id, checkpoint: ev.checkpoint, photo_url: ev.photo_url, created_at: ev.created_at })
    byBatch.set(ev.batch_id, list)
  }

  return batches.map(b => ({ ...b, events: byBatch.get(b.id) || [] }))
}

// ─────────────────────────────────────────────────────────────
// GET — list batches with their checkpoint/photo trail
// Query: ?status=active (open batches, i.e. not yet dispatched) or an
// exact checkpoint value; ?limit=30
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'batch.view')) {
    return json({ error: 'Access denied' }, 403)
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit  = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30')))

  let query = service
    .from('pos_factory_batches')
    .select(BATCH_COLUMNS)
    .eq('owner_id', auth.ownerId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (status === 'active') {
    // "active" = still moving through the line, i.e. not yet dispatched
    query = query.neq('status', 'dispatch')
  } else if (status && (CHECKPOINTS as readonly string[]).includes(status)) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  const batches = await attachEvents(service, (data || []) as BatchRow[])
  return json({ batches })
}

// ─────────────────────────────────────────────────────────────
// POST — log a checkpoint scan against a batch (find-or-create)
// Body: { batch_ref, checkpoint, image (base64), product_name?, create_if_missing?, client_tx_id? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'batch.log')) {
    return json({ error: 'Your role does not have permission to log batch checkpoints' }, 403)
  }

  const body = await req.json()
  const { batch_ref, checkpoint, image, product_name } = body
  // Frontend always sends create_if_missing: true (app/factory/batch/page.tsx),
  // but default to true regardless so the endpoint is usable even if a caller omits it.
  const createIfMissing = body.create_if_missing !== false

  if (!batch_ref || typeof batch_ref !== 'string' || !batch_ref.trim()) {
    return json({ error: 'batch_ref required' }, 400)
  }
  if (!checkpoint || !(CHECKPOINTS as readonly string[]).includes(checkpoint)) {
    return json({ error: `checkpoint must be one of: ${CHECKPOINTS.join(', ')}` }, 400)
  }
  if (!image) return json({ error: 'image required' }, 400)

  const batchRef = batch_ref.trim()
  const cp = checkpoint as Checkpoint
  const service = createServiceClient()

  // Idempotency: dedupe BEFORE uploading the photo, so an offline-queue
  // replay never re-uploads a duplicate blob for an event already recorded
  // (same pattern as app/api/pos/factory/capture/route.ts).
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null
  if (clientTxId) {
    try {
      const { data: dupeEvent } = await service
        .from('pos_factory_batch_events')
        .select('batch_id')
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (dupeEvent) {
        const { data: dupeBatch } = await service
          .from('pos_factory_batches')
          .select(BATCH_COLUMNS)
          .eq('id', dupeEvent.batch_id)
          .eq('owner_id', auth.ownerId)
          .maybeSingle()
        if (dupeBatch) {
          const [withEvents] = await attachEvents(service, [dupeBatch as BatchRow])
          return json({ batch: withEvents, deduped: true }, 200)
        }
      }
    } catch { /* dedupe is best-effort — never block a submission on it */ }
  }

  // Upload photo to Supabase Storage
  let photoUrl = ''
  let storageMode: 'supabase' | 'fallback' = 'supabase'

  try {
    const base64Data = (image as string).replace(/^data:image\/\w+;base64,/, '')
    const buffer     = Buffer.from(base64Data, 'base64')
    const safeRef    = batchRef.replace(/[^a-zA-Z0-9_-]/g, '_')
    const filename   = `${auth.ownerId}/${safeRef}_${cp}_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from('factory-batch-events')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      // Bucket may not exist yet — fall back to data URL
      console.error('factory-batch-events storage upload failed:', uploadErr.message)
      photoUrl    = `data:image/jpeg;base64,${base64Data}`
      storageMode = 'fallback'
    } else {
      // factory-batch-events is a private bucket — a public URL 404s in the
      // browser. Sign it instead (10-year expiry: these photos need to
      // stay viewable indefinitely, not just for one session).
      const { data: signedData, error: signErr } = await service.storage
        .from('factory-batch-events')
        .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)
      if (signErr || !signedData?.signedUrl) {
        console.error('factory-batch-events signed URL failed:', signErr?.message)
        photoUrl    = `data:image/jpeg;base64,${base64Data}`
        storageMode = 'fallback'
      } else {
        photoUrl = signedData.signedUrl
      }
    }
  } catch (err) {
    console.error('Factory batch upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  // Find-or-create the batch by (owner_id, batch_ref)
  const { data: existingBatch, error: findErr } = await service
    .from('pos_factory_batches')
    .select(BATCH_COLUMNS)
    .eq('owner_id', auth.ownerId)
    .eq('batch_ref', batchRef)
    .maybeSingle()

  if (findErr) return json({ error: findErr.message }, 500)

  let batch: BatchRow | null = existingBatch as BatchRow | null
  let batchCreated = false
  const previousStatus = batch?.status || null

  if (!batch) {
    if (!createIfMissing) return json({ error: 'Batch not found' }, 404)

    const { data: created, error: createErr } = await service
      .from('pos_factory_batches')
      .insert({
        owner_id:     auth.ownerId,
        location_id:  auth.locationId || null,
        batch_ref:    batchRef,
        product_name: product_name?.trim() || null,
        status:       cp,
      })
      .select(BATCH_COLUMNS)
      .single()

    if (createErr) {
      // 23505 = unique violation: a concurrent request created this
      // batch_ref first — fetch it and fall through to the update path.
      if ((createErr as any).code === '23505') {
        const { data: raced } = await service
          .from('pos_factory_batches')
          .select(BATCH_COLUMNS)
          .eq('owner_id', auth.ownerId)
          .eq('batch_ref', batchRef)
          .maybeSingle()
        if (!raced) return json({ error: createErr.message }, 500)
        batch = raced as BatchRow
      } else {
        return json({ error: createErr.message }, 500)
      }
    } else {
      batch = created as BatchRow
      batchCreated = true
    }
  }

  if (!batch) return json({ error: 'Batch could not be resolved' }, 500)

  // Advance the batch's status to this checkpoint (skip if we just
  // created it above — status is already correct from the insert).
  if (!batchCreated) {
    const updatePayload: Record<string, unknown> = { status: cp }
    // Don't clobber an existing product name with a blank retype
    if (product_name?.trim() && !batch.product_name) updatePayload.product_name = product_name.trim()

    const { data: updated, error: updateErr } = await service
      .from('pos_factory_batches')
      .update(updatePayload)
      .eq('id', batch.id)
      .eq('owner_id', auth.ownerId)
      .select(BATCH_COLUMNS)
      .single()

    if (updateErr) return json({ error: updateErr.message }, 500)
    batch = updated as BatchRow
  }

  // Log the checkpoint event
  const { error: eventErr } = await service
    .from('pos_factory_batch_events')
    .insert({
      owner_id:     auth.ownerId,
      batch_id:     batch.id,
      checkpoint:   cp,
      photo_url:    photoUrl,
      storage:      storageMode,
      logged_by:    auth.staffId || null,
      client_tx_id: clientTxId,
    })

  if (eventErr) {
    // 23505 = a concurrent retry with the same client_tx_id already logged
    // this event — treat as a successful dedupe rather than an error.
    if (!(clientTxId && (eventErr as any).code === '23505')) {
      return json({ error: eventErr.message }, 500)
    }
  }

  // Return the batch with its full, up-to-date event trail
  const [batchWithEvents] = await attachEvents(service, [batch])

  logPosAudit({
    auth,
    event: 'batch.checkpoint_logged',
    entityType: 'factory_batch',
    entityId: batch.id,
    fromValue: previousStatus || undefined,
    toValue: cp,
    metadata: {
      batch_ref: batchRef,
      product_name: batch.product_name,
      storage: storageMode,
      batch_created: batchCreated,
    },
  })

  return json({ batch: batchWithEvents }, batchCreated ? 201 : 200)
}
