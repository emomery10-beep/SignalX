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

// Must match buildDefectTypes()/buildSeverities() in app/factory/quality/page.tsx:28-45
// and the CHECK constraints on pos_factory_quality_checks.
const DEFECT_TYPES = ['dimensional', 'surface', 'contamination', 'assembly', 'packaging', 'other'] as const
const SEVERITIES   = ['critical', 'major', 'minor'] as const

// Private Supabase Storage bucket for quality-defect photos. Mirrors
// 'factory-captures' (app/api/pos/factory/capture/route.ts) and
// 'factory-waybill-photos' (app/api/pos/factory/waybill/route.ts) — NOT
// public, so URLs must be signed (see createSignedUrl below). This bucket
// does not exist yet and needs to be created manually in the Supabase
// dashboard (private, no public access) before uploads will persist; until
// then every upload gracefully falls back to a base64 data URL
// (storage: 'fallback'), same as those sibling routes.
const QUALITY_BUCKET = 'factory-quality-photos'

const SELECT_WITH_JOINS = `
  *,
  inspected_by_staff:pos_staff!inspected_by(id, name, role),
  location:pos_locations!location_id(id, name)
`

// Mirrors todayUtcBounds() in app/api/pos/factory/waybill/route.ts — the
// stats block below is scoped to "today" (UTC calendar day) to match that
// same hub convention (see app/factory/page.tsx's "Today's on-time rate"
// waybill tile). pos_factory_quality_checks has no resolved/status column
// (deliberately — see the migration's design note), so there is no real
// "open vs closed" defect state to query. "Open" here is a pragmatic proxy:
// fails logged today that a floor worker/supervisor still needs to action
// before end of shift, not an actual unresolved-state flag.
function todayUtcBounds() {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
  return {
    gte: `${today}T00:00:00.000Z`,
    lt:  `${today}T23:59:59.999Z`,
  }
}

// ─────────────────────────────────────────────────────────────
// GET — hub data: recent/filterable checks list + today's fail stats
// Query: ?limit=50&page=0&outcome=pass|fail&defect_type=...&severity=...&batch_id=...&date=YYYY-MM-DD
// The factory hub (app/factory/page.tsx loadQuality()) calls this with no
// params at all and reads criticals/openCount/totalAffected straight off
// the response root — those three fields are always computed (today-only,
// outcome='fail'), independent of whatever list filters are passed.
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'quality.view')) {
    return json({ error: 'Access denied' }, 403)
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const outcome    = searchParams.get('outcome')
  const defectType = searchParams.get('defect_type')
  const severity   = searchParams.get('severity')
  const batchId    = searchParams.get('batch_id')
  const date       = searchParams.get('date')  // YYYY-MM-DD
  const page       = Math.max(0, parseInt(searchParams.get('page')  || '0'))
  const limit      = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_factory_quality_checks')
    .select(SELECT_WITH_JOINS, { count: 'exact' })
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (outcome)    query = query.eq('outcome', outcome)
  if (defectType) query = query.eq('defect_type', defectType)
  if (severity)   query = query.eq('severity', severity)
  if (batchId)    query = query.eq('batch_id', batchId)
  if (date) {
    query = query
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at',  `${date}T23:59:59.999Z`)
  }

  const { data, error, count } = await query
  if (error) return json({ error: error.message }, 500)

  // Today's fail stats, for the hub tile — always all-time-filter-free
  // (today only), regardless of the list query params above.
  const { gte, lt } = todayUtcBounds()
  const { data: todayFails, error: statsErr } = await service
    .from('pos_factory_quality_checks')
    .select('severity, quantity_affected')
    .eq('owner_id', auth.ownerId)
    .eq('outcome', 'fail')
    .gte('created_at', gte)
    .lt('created_at', lt)

  if (statsErr) return json({ error: statsErr.message }, 500)

  const todayRows      = todayFails || []
  const openCount      = todayRows.length
  const criticals      = todayRows.filter(r => r.severity === 'critical').length
  const totalAffected  = todayRows.reduce((sum, r) => sum + (Number(r.quantity_affected) || 0), 0)

  return json({
    checks: data,
    total: count,
    openCount,
    criticals,
    totalAffected,
  })
}

// ─────────────────────────────────────────────────────────────
// POST — submit a new quality check
// Body: { image (base64), defect_type?, severity?, product_name?, quantity_affected?,
//         notes?, outcome? ('pass'|'fail'), location_id?, batch_id?, capture_id?, client_tx_id? }
//
// The current quality/page.tsx UI has no pass/clear-for-dispatch flow and no
// batch selector — it only ever logs a defect. So when the caller omits
// `outcome`, this route defaults it to 'fail' and leaves batch_id/capture_id
// null. `outcome: 'pass'` (and batch_id/capture_id) are accepted here for a
// future explicit QC-clearance flow, per the migration's design note.
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'quality.check')) {
    return json({ error: 'Your role does not have permission to log quality checks' }, 403)
  }

  const body = await req.json()
  const {
    image, defect_type, severity, product_name, quantity_affected, notes,
    location_id, batch_id, capture_id,
  } = body

  if (!image) return json({ error: 'image required' }, 400)

  const outcome: 'pass' | 'fail' = body.outcome === 'pass' ? 'pass' : 'fail'

  // A fail (the only outcome the current UI produces) always carries a
  // defect_type + severity, mirroring the page's own submitDefect() guard
  // (`if (!photoUrl || !defectType || !severity || !session) return`).
  if (outcome === 'fail' && (!defect_type || !severity)) {
    return json({ error: 'defect_type and severity required for a fail outcome' }, 400)
  }
  if (defect_type && !DEFECT_TYPES.includes(defect_type)) {
    return json({ error: `defect_type must be one of: ${DEFECT_TYPES.join(', ')}` }, 400)
  }
  if (severity && !SEVERITIES.includes(severity)) {
    return json({ error: `severity must be one of: ${SEVERITIES.join(', ')}` }, 400)
  }

  const service = createServiceClient()

  // Idempotency: a client_tx_id makes retries and offline-queue replays
  // safe. Dedupe BEFORE uploading the photo, so a replay never re-uploads
  // a duplicate blob for a check that's already recorded. (The current
  // quality/page.tsx UI doesn't send one yet, but this keeps the route
  // ready for an offline-queue submitter, same as factory/capture.)
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null
  if (clientTxId) {
    try {
      const { data: dupe, error: dupeErr } = await service
        .from('pos_factory_quality_checks')
        .select(SELECT_WITH_JOINS)
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (!dupeErr && dupe) return json({ check: dupe, deduped: true }, 200)
    } catch { /* dedupe is best-effort — never block a check on it */ }
  }

  // Upload photo to Supabase Storage
  let photoUrl = ''
  let storageMode: 'supabase' | 'fallback' = 'supabase'

  try {
    const base64Data = (image as string).replace(/^data:image\/\w+;base64,/, '')
    const buffer     = Buffer.from(base64Data, 'base64')
    const filename   = `${auth.ownerId}/quality_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from(QUALITY_BUCKET)
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      // Bucket may not exist yet — fall back to data URL
      console.error(`${QUALITY_BUCKET} storage upload failed:`, uploadErr.message)
      photoUrl    = `data:image/jpeg;base64,${base64Data}`
      storageMode = 'fallback'
    } else {
      // Private bucket — a public URL 404s in the browser. Sign it instead
      // (10-year expiry: these photos need to stay viewable indefinitely,
      // not just for one session).
      const { data: signedData, error: signErr } = await service.storage
        .from(QUALITY_BUCKET)
        .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)
      if (signErr || !signedData?.signedUrl) {
        console.error(`${QUALITY_BUCKET} signed URL failed:`, signErr?.message)
        photoUrl    = `data:image/jpeg;base64,${base64Data}`
        storageMode = 'fallback'
      } else {
        photoUrl = signedData.signedUrl
      }
    }
  } catch (err) {
    console.error('Factory quality check upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  const insertRow = {
    owner_id:           auth.ownerId,
    location_id:        location_id || auth.locationId || null,
    batch_id:           batch_id   || null,
    capture_id:         capture_id || null,
    outcome,
    defect_type:        defect_type || null,
    severity:           severity    || null,
    quantity_affected:  quantity_affected ?? null,
    product_name:       product_name || null,
    photo_url:          photoUrl,
    storage:            storageMode,
    notes:              notes || null,
    inspected_by:       auth.staffId || null,
    client_tx_id:       clientTxId,
  }

  const { data: check, error } = await service
    .from('pos_factory_quality_checks')
    .insert(insertRow)
    .select(SELECT_WITH_JOINS)
    .single()

  if (error) {
    // 23505 = unique violation: a concurrent retry already recorded this check — return it
    if (clientTxId && (error as any).code === '23505') {
      const { data: dupe } = await service
        .from('pos_factory_quality_checks')
        .select(SELECT_WITH_JOINS)
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (dupe) return json({ check: dupe, deduped: true }, 200)
    }
    // Live schema may predate the client_tx_id migration — never fail a
    // quality check because an optional column is missing.
    if (/client_tx_id|column|schema cache/i.test(error.message || '')) {
      const { client_tx_id: _omit, ...rowWithoutTxId } = insertRow
      const { data: retryCheck, error: retryErr } = await service
        .from('pos_factory_quality_checks')
        .insert(rowWithoutTxId)
        .select(SELECT_WITH_JOINS)
        .single()
      if (retryErr) return json({ error: retryErr.message }, 500)
      logPosAudit({
        auth, event: 'quality.check_logged', entityType: 'factory_quality_check', entityId: retryCheck.id,
        toValue: outcome,
        metadata: { defect_type: defect_type || null, severity: severity || null, product_name: product_name || null, quantity_affected: quantity_affected ?? null, storage: storageMode },
      })
      return json({ check: retryCheck }, 201)
    }
    return json({ error: error.message }, 500)
  }

  logPosAudit({
    auth, event: 'quality.check_logged', entityType: 'factory_quality_check', entityId: check.id,
    toValue: outcome,
    metadata: { defect_type: defect_type || null, severity: severity || null, product_name: product_name || null, quantity_affected: quantity_affected ?? null, storage: storageMode },
  })

  return json({ check }, 201)
}
