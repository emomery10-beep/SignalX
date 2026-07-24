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

// Private Supabase Storage bucket for waybill dispatch photos. Mirrors the
// 'factory-captures' bucket used by app/api/pos/factory/capture/route.ts —
// NOT public, so URLs must be signed (see createSignedUrl below). This
// bucket does not exist yet and needs to be created manually in the
// Supabase dashboard (private, no public access) before uploads will
// persist; until then every upload gracefully falls back to a base64
// data URL (storage: 'fallback'), same as the capture route.
const WAYBILL_BUCKET = 'factory-waybill-photos'

// How much slack a dispatch gets before it's considered "late" relative to
// its scheduled_at time. A dispatch at or before scheduled_at + this grace
// window is on time; anything later is late. Named constant so it's easy
// to tune later without hunting through the comparison logic below.
const ON_TIME_GRACE_MS = 15 * 60 * 1000 // 15 minutes

// Aggregate stats are scoped to "today" (UTC calendar day) to match the
// hub UI copy "Today's on-time rate". The recent-waybills LIST itself is
// intentionally NOT date-filtered — it's just "recent", any day.
function todayUtcBounds() {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
  return {
    gte: `${today}T00:00:00.000Z`,
    lt:  `${today}T23:59:59.999Z`,
  }
}

/**
 * NULL when there's no scheduled_at ("no schedule" badge in the UI).
 * Otherwise true if dispatchedAt is at or before scheduled_at + grace,
 * false if it's later than that.
 */
function computeIsOnTime(scheduledAt: string | null | undefined, dispatchedAt: Date): boolean | null {
  if (!scheduledAt) return null
  const scheduled = new Date(scheduledAt)
  if (Number.isNaN(scheduled.getTime())) return null
  return dispatchedAt.getTime() <= scheduled.getTime() + ON_TIME_GRACE_MS
}

// ─────────────────────────────────────────────────────────────
// GET — hub data: recent waybills + today's on-time rate stats
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'waybill.view')) {
    return json({ error: 'Access denied' }, 403)
  }

  const service = createServiceClient()

  // Recent dispatches — no date filter, just the most recent N.
  const { data: waybills, error: listErr } = await service
    .from('pos_factory_waybills')
    .select('id, waybill_ref, destination, product_name, quantity, photo_url, scheduled_at, dispatched_at, is_on_time, vehicle_ref')
    .eq('owner_id', auth.ownerId)
    .order('dispatched_at', { ascending: false })
    .limit(20)

  if (listErr) return json({ error: listErr.message }, 500)

  // Today's stats — scoped to the current UTC calendar day only.
  const { gte, lt } = todayUtcBounds()
  const { data: todayRows, error: statsErr } = await service
    .from('pos_factory_waybills')
    .select('is_on_time, quantity')
    .eq('owner_id', auth.ownerId)
    .gte('dispatched_at', gte)
    .lt('dispatched_at', lt)

  if (statsErr) return json({ error: statsErr.message }, 500)

  const rows = todayRows || []
  const totalDispatches = rows.length
  const onTime          = rows.filter(r => r.is_on_time === true).length
  const late            = rows.filter(r => r.is_on_time === false).length
  const withScheduleCount = onTime + late
  const onTimeRate = withScheduleCount > 0 ? Math.round((onTime / withScheduleCount) * 100) : null
  const totalUnits = rows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0)

  return json({
    waybills: waybills || [],
    totalDispatches,
    onTime,
    late,
    onTimeRate,
    totalUnits,
    withScheduleCount,
  })
}

// ─────────────────────────────────────────────────────────────
// POST — log a new dispatch/waybill
// Body: { destination, image (base64), waybill_ref?, product_name?,
//         quantity?, vehicle_ref?, scheduled_at?, notes?, location_id?,
//         client_tx_id? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'waybill.log')) {
    return json({ error: 'Your role does not have permission to log a waybill dispatch' }, 403)
  }

  const body = await req.json()
  const {
    destination, image, waybill_ref, product_name, quantity,
    vehicle_ref, scheduled_at, notes, location_id,
  } = body

  if (!destination || typeof destination !== 'string' || !destination.trim()) {
    return json({ error: 'destination required' }, 400)
  }
  if (!image) return json({ error: 'image required' }, 400)

  const service = createServiceClient()

  // Idempotency: dedupe BEFORE uploading the photo, so a replay never
  // re-uploads a duplicate blob for a waybill that's already recorded.
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null
  if (clientTxId) {
    try {
      const { data: dupe, error: dupeErr } = await service
        .from('pos_factory_waybills')
        .select('*')
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (!dupeErr && dupe) return json({ waybill: dupe, deduped: true }, 200)
    } catch { /* dedupe is best-effort — never block a submission on it */ }
  }

  // Upload photo to Supabase Storage
  let photoUrl = ''
  let storageMode: 'supabase' | 'fallback' = 'supabase'

  try {
    const base64Data = (image as string).replace(/^data:image\/\w+;base64,/, '')
    const buffer     = Buffer.from(base64Data, 'base64')
    const filename   = `${auth.ownerId}/waybill_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from(WAYBILL_BUCKET)
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      // Bucket may not exist yet — fall back to data URL
      console.error(`${WAYBILL_BUCKET} storage upload failed:`, uploadErr.message)
      photoUrl    = `data:image/jpeg;base64,${base64Data}`
      storageMode = 'fallback'
    } else {
      // Private bucket — a public URL 404s in the browser. Sign it instead
      // (10-year expiry: these photos need to stay viewable indefinitely,
      // not just for one session).
      const { data: signedData, error: signErr } = await service.storage
        .from(WAYBILL_BUCKET)
        .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)
      if (signErr || !signedData?.signedUrl) {
        console.error(`${WAYBILL_BUCKET} signed URL failed:`, signErr?.message)
        photoUrl    = `data:image/jpeg;base64,${base64Data}`
        storageMode = 'fallback'
      } else {
        photoUrl = signedData.signedUrl
      }
    }
  } catch (err) {
    console.error('Waybill photo upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  const dispatchedAt = new Date()
  const isOnTime = computeIsOnTime(scheduled_at, dispatchedAt)

  const insertPayload = {
    owner_id:      auth.ownerId,
    location_id:   location_id || auth.locationId || null,
    destination:   destination.trim(),
    waybill_ref:   waybill_ref  ? String(waybill_ref).trim()  : null,
    product_name:  product_name ? String(product_name).trim() : null,
    quantity:      quantity ?? null,
    vehicle_ref:   vehicle_ref  ? String(vehicle_ref).trim()  : null,
    scheduled_at:  scheduled_at || null,
    dispatched_at: dispatchedAt.toISOString(),
    is_on_time:    isOnTime,
    notes:         notes || null,
    photo_url:     photoUrl,
    storage:       storageMode,
    dispatched_by: auth.staffId || null,
    client_tx_id:  clientTxId,
  }

  const { data: waybill, error } = await service
    .from('pos_factory_waybills')
    .insert(insertPayload)
    .select('*')
    .single()

  if (error) {
    // 23505 = unique violation: a concurrent retry already recorded this waybill — return it
    if (clientTxId && (error as any).code === '23505') {
      const { data: dupe } = await service
        .from('pos_factory_waybills')
        .select('*')
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (dupe) return json({ waybill: dupe, deduped: true }, 200)
    }
    // Live schema may predate the client_tx_id column — never fail a
    // waybill submission because an optional column is missing.
    if (/client_tx_id|column|schema cache/i.test(error.message || '')) {
      const { client_tx_id: _omit, ...retryPayload } = insertPayload
      const { data: retryWaybill, error: retryErr } = await service
        .from('pos_factory_waybills')
        .insert(retryPayload)
        .select('*')
        .single()
      if (retryErr) return json({ error: retryErr.message }, 500)

      logPosAudit({
        auth, event: 'waybill.logged', entityType: 'factory_waybill', entityId: retryWaybill.id,
        toValue: retryWaybill.destination,
        metadata: { waybill_ref: retryWaybill.waybill_ref, is_on_time: retryWaybill.is_on_time, storage: storageMode },
      })
      return json({ waybill: retryWaybill }, 201)
    }
    return json({ error: error.message }, 500)
  }

  logPosAudit({
    auth, event: 'waybill.logged', entityType: 'factory_waybill', entityId: waybill.id,
    toValue: waybill.destination,
    metadata: { waybill_ref: waybill.waybill_ref, is_on_time: waybill.is_on_time, storage: storageMode },
  })

  return json({ waybill }, 201)
}
