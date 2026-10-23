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
// ─────────────────────────────────────────────────────────────
// POST / PATCH — retired. This is an older copy of the route that lives in the POS app (pos.askbiz.co),
// which validates photos, locations and quantities. Nothing calls this one; leaving the write handlers
// open here only gave a second, unvalidated way into the same data.
// ─────────────────────────────────────────────────────────────
const retired = () => json({ error: 'Moved: use the AskBiz POS app (pos.askbiz.co).' }, 410)
export async function POST() { return retired() }
export async function PATCH() { return retired() }
