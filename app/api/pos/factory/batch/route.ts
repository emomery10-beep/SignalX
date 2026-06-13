import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Access-Control-Allow-Origin': '*' } })
}

const VALID_CHECKPOINTS = ['intake', 'in_progress', 'qc_pass', 'qc_fail', 'dispatch']
const VALID_STATUSES    = ['active', 'completed', 'on_hold']

// ── GET — list batches with latest checkpoint ─────────────────────────────────
// ?status=active|completed|on_hold  (default: active)
// ?date=YYYY-MM-DD                  (filter batch creation date)
// ?batch_ref=XXX                    (lookup specific batch)
// ?id=UUID                          (full detail — includes all events)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const canView =
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'capture.approve')
  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const id        = searchParams.get('id')
  const status    = searchParams.get('status') || 'active'
  const batchRef  = searchParams.get('batch_ref')
  const date      = searchParams.get('date')
  const limit     = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  // Full detail for a single batch
  if (id) {
    const { data: batch } = await service
      .from('pos_factory_batches')
      .select('*')
      .eq('id', id)
      .eq('owner_id', auth.ownerId)
      .single()
    if (!batch) return json({ error: 'Batch not found' }, 404)

    const { data: events } = await service
      .from('pos_factory_batch_events')
      .select('*, scanned_by_staff:pos_staff!scanned_by(id, name)')
      .eq('batch_id', id)
      .eq('owner_id', auth.ownerId)
      .order('created_at', { ascending: true })

    return json({ batch: { ...batch, events: events || [] } })
  }

  // List batches
  let query = service
    .from('pos_factory_batches')
    .select(`
      *,
      events:pos_factory_batch_events(
        id, checkpoint, photo_url, created_at
      )
    `)
    .eq('owner_id', auth.ownerId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (batchRef) {
    query = query.ilike('batch_ref', `%${batchRef}%`)
  } else {
    if (VALID_STATUSES.includes(status)) query = query.eq('status', status)
    if (date) {
      query = query
        .gte('created_at', `${date}T00:00:00.000Z`)
        .lt('created_at',  `${date}T23:59:59.999Z`)
    }
  }

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ batches: data || [] })
}

// ── POST — scan a batch at a checkpoint ──────────────────────────────────────
// Body: { batch_ref, checkpoint, image, product_name?, notes?, create_if_missing? }
// If batch_ref exists → log event; if not and create_if_missing → create batch + log
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'camera.output') && !hasPermission(auth.role, 'camera.wastage')) {
    return json({ error: 'Access denied' }, 403)
  }

  const body = await req.json()
  const { batch_ref, checkpoint, image, product_name, notes, create_if_missing, location_id } = body

  if (!image)       return json({ error: 'image required' }, 400)
  if (!batch_ref?.trim()) return json({ error: 'batch_ref required' }, 400)
  if (!checkpoint || !VALID_CHECKPOINTS.includes(checkpoint)) {
    return json({ error: `checkpoint must be one of: ${VALID_CHECKPOINTS.join(', ')}` }, 400)
  }

  const service = createServiceClient()
  const ref = (batch_ref as string).trim().toUpperCase()

  // Find or create batch
  let { data: batch } = await service
    .from('pos_factory_batches')
    .select('id, status')
    .eq('owner_id', auth.ownerId)
    .eq('batch_ref', ref)
    .maybeSingle()

  if (!batch) {
    if (!create_if_missing) {
      return json({ error: 'Batch not found. Set create_if_missing=true to create it.' }, 404)
    }
    const { data: newBatch, error: createErr } = await service
      .from('pos_factory_batches')
      .insert({
        owner_id:     auth.ownerId,
        location_id:  location_id || auth.locationId || null,
        batch_ref:    ref,
        product_name: (product_name as string)?.trim() || null,
        status:       'active',
      })
      .select()
      .single()
    if (createErr) return json({ error: createErr.message }, 500)
    batch = newBatch
  }

  // Log the event
  const { data: event, error: evErr } = await service
    .from('pos_factory_batch_events')
    .insert({
      owner_id:   auth.ownerId,
      batch_id:   batch!.id,
      checkpoint,
      photo_url:  image as string,
      storage:    'fallback',
      notes:      (notes as string)?.trim() || null,
      scanned_by: auth.staffId || null,
    })
    .select()
    .single()
  if (evErr) return json({ error: evErr.message }, 500)

  // Auto-complete batch when dispatched
  if (checkpoint === 'dispatch') {
    await service
      .from('pos_factory_batches')
      .update({ status: 'completed' })
      .eq('id', batch!.id)
  }

  // Return batch + all its events for the trail display
  const { data: allEvents } = await service
    .from('pos_factory_batch_events')
    .select('id, checkpoint, photo_url, created_at')
    .eq('batch_id', batch!.id)
    .order('created_at', { ascending: true })

  return json({ event, batch: { ...batch, events: allEvents || [] } }, 201)
}

// ── PATCH — update batch status ───────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'capture.approve')) {
    return json({ error: 'Access denied — approvers only' }, 403)
  }

  const { id, status } = await req.json()
  if (!id) return json({ error: 'id required' }, 400)
  if (!status || !VALID_STATUSES.includes(status)) {
    return json({ error: 'status must be active, completed, or on_hold' }, 400)
  }

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_factory_batches')
    .update({ status })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ batch: data })
}
