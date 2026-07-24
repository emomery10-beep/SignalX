import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'
import type { PosAuditEvent } from '@/lib/pos-audit'

// ============================================================
// Factory PRODUCTION shift tracking (output targets, floor
// photos). Backed by pos_factory_production_shifts — a table
// that is completely separate from pos_shifts (the cash-register
// reconciliation table used by /api/pos/shift/*). Do not confuse
// the two; see supabase/migrations/20260724000007_factory_production_shifts.sql
// for the full rationale.
// ============================================================

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

const PRODUCTION_SHIFT_OPENED_EVENT: PosAuditEvent = 'shift.production_opened'
const PRODUCTION_SHIFT_CLOSED_EVENT: PosAuditEvent = 'shift.production_closed'

const SHIFT_NAMES = ['Morning', 'Afternoon', 'Night', 'Custom'] as const
const SHIFT_BUCKET = 'factory-shift-photos'

const SHIFT_SELECT = `
  *,
  started_by_staff:pos_staff!started_by(id, name),
  ended_by_staff:pos_staff!ended_by(id, name)
`

type ServiceClient = ReturnType<typeof createServiceClient>

// live_output / actual_output are never stored as a running counter —
// always recomputed from pos_factory_captures so the number can't drift
// if captures are approved/rejected after the fact (see migration note).
async function computeShiftOutput(service: ServiceClient, ownerId: string, shiftId: string): Promise<number> {
  const { data, error } = await service
    .from('pos_factory_captures')
    .select('quantity')
    .eq('owner_id', ownerId)
    .eq('production_shift_id', shiftId)
    .eq('type', 'output')
    .neq('status', 'rejected')

  if (error) {
    console.error('computeShiftOutput failed:', error.message)
    return 0
  }
  return (data || []).reduce((sum: number, row: any) => sum + (Number(row.quantity) || 0), 0)
}

// Same private-bucket + long-expiry-signed-URL pattern as
// app/api/pos/factory/capture/route.ts. Falls back to an inline data URL
// (storage: 'fallback') if the bucket doesn't exist yet or signing fails —
// never blocks a shift open/close on a storage hiccup.
async function uploadShiftPhoto(
  service: ServiceClient,
  ownerId: string,
  label: 'start' | 'end',
  image: string,
): Promise<{ url: string; storage: 'supabase' | 'fallback' }> {
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')
  const filename = `${ownerId}/${label}_${Date.now()}.jpg`

  const { error: uploadErr } = await service.storage
    .from(SHIFT_BUCKET)
    .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

  if (uploadErr) {
    // Bucket may not exist yet — fall back to data URL, same as factory-captures
    console.error(`${SHIFT_BUCKET} storage upload failed:`, uploadErr.message)
    return { url: `data:image/jpeg;base64,${base64Data}`, storage: 'fallback' }
  }

  // Private bucket — a public URL 404s in the browser. Sign it instead
  // (10-year expiry: these photos need to stay viewable indefinitely).
  const { data: signedData, error: signErr } = await service.storage
    .from(SHIFT_BUCKET)
    .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)

  if (signErr || !signedData?.signedUrl) {
    console.error(`${SHIFT_BUCKET} signed URL failed:`, signErr?.message)
    return { url: `data:image/jpeg;base64,${base64Data}`, storage: 'fallback' }
  }

  return { url: signedData.signedUrl, storage: 'supabase' }
}

// ─────────────────────────────────────────────────────────────
// GET — the current active shift (if any, with live computed output)
// plus recent completed shifts for the hub's history list.
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'shift.production_view')) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()

  const { data: active, error: activeErr } = await service
    .from('pos_factory_production_shifts')
    .select(SHIFT_SELECT)
    .eq('owner_id', auth.ownerId)
    .eq('status', 'active')
    .maybeSingle()

  if (activeErr) return json({ error: activeErr.message }, 500)

  let activeShift: any = null
  if (active) {
    const live_output = await computeShiftOutput(service, auth.ownerId, (active as any).id)
    activeShift = { ...(active as any), live_output }
  }

  const { data: recentShifts, error: recentErr } = await service
    .from('pos_factory_production_shifts')
    .select(SHIFT_SELECT)
    .eq('owner_id', auth.ownerId)
    .eq('status', 'completed')
    .order('started_at', { ascending: false })
    .limit(20)

  if (recentErr) return json({ error: recentErr.message }, 500)

  return json({ activeShift, recentShifts: recentShifts || [] })
}

// ─────────────────────────────────────────────────────────────
// POST — open a new production shift
// Body: { shift_name, custom_name?, image (base64), target_units?, location_id?, client_tx_id? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'shift.production_open')) {
    return json({ error: 'Your role does not have permission to start a production shift' }, 403)
  }

  const body = await req.json()
  const { shift_name, custom_name, image, target_units, location_id } = body

  if (!shift_name || !image) return json({ error: 'shift_name and image required' }, 400)
  if (!SHIFT_NAMES.includes(shift_name)) {
    return json({ error: 'shift_name must be Morning, Afternoon, Night, or Custom' }, 400)
  }

  let targetUnitsNum: number | null = null
  if (target_units !== undefined && target_units !== null && target_units !== '') {
    targetUnitsNum = Number(target_units)
    if (isNaN(targetUnitsNum) || targetUnitsNum < 0) {
      return json({ error: 'target_units must be a non-negative number' }, 400)
    }
  }

  const service = createServiceClient()

  // Idempotency: dedupe BEFORE checking for an active shift or uploading a
  // photo, so an offline-queue replay of an already-applied open never
  // 409s and never re-uploads a duplicate photo.
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null
  if (clientTxId) {
    try {
      const { data: dupe, error: dupeErr } = await service
        .from('pos_factory_production_shifts')
        .select(SHIFT_SELECT)
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (!dupeErr && dupe) return json({ shift: dupe, deduped: true }, 200)
    } catch { /* dedupe is best-effort — never block a shift-open on it */ }
  }

  // Only one active shift per owner — also enforced at the DB level by a
  // partial unique index (idx_pos_factory_production_shifts_one_active).
  const { data: existingActive, error: existingErr } = await service
    .from('pos_factory_production_shifts')
    .select('id')
    .eq('owner_id', auth.ownerId)
    .eq('status', 'active')
    .maybeSingle()

  if (existingErr) return json({ error: existingErr.message }, 500)
  if (existingActive) {
    return json({ error: 'A production shift is already active. End it before starting a new one.' }, 409)
  }

  let photo: { url: string; storage: 'supabase' | 'fallback' }
  try {
    photo = await uploadShiftPhoto(service, auth.ownerId, 'start', image as string)
  } catch (err) {
    console.error('Factory shift start-photo upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  const { data: shift, error } = await service
    .from('pos_factory_production_shifts')
    .insert({
      owner_id:        auth.ownerId,
      location_id:     location_id || auth.locationId || null,
      shift_name,
      custom_name:     shift_name === 'Custom' ? ((custom_name || '').trim() || null) : null,
      target_units:    targetUnitsNum,
      start_photo_url: photo.url,
      start_storage:   photo.storage,
      status:          'active',
      started_by:      auth.staffId || null,
      client_tx_id:    clientTxId,
    })
    .select(SHIFT_SELECT)
    .single()

  if (error) {
    // 23505 = unique violation — either the client_tx_id dedupe index or the
    // one-active-shift-per-owner partial index raced with a concurrent request.
    if ((error as any).code === '23505') {
      if (clientTxId) {
        const { data: dupe } = await service
          .from('pos_factory_production_shifts')
          .select(SHIFT_SELECT)
          .eq('owner_id', auth.ownerId)
          .eq('client_tx_id', clientTxId)
          .maybeSingle()
        if (dupe) return json({ shift: dupe, deduped: true }, 200)
      }
      return json({ error: 'A production shift is already active. End it before starting a new one.' }, 409)
    }
    return json({ error: error.message }, 500)
  }

  logPosAudit({
    auth,
    event: PRODUCTION_SHIFT_OPENED_EVENT,
    entityType: 'factory_production_shift',
    entityId: (shift as any).id,
    toValue: shift_name,
    metadata: { custom_name: (shift as any).custom_name, target_units: targetUnitsNum, storage: photo.storage },
  })

  return json({ shift }, 201)
}

// ─────────────────────────────────────────────────────────────
// PATCH — end the active production shift
// Body: { id, image (base64) }
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'shift.production_close')) {
    return json({ error: 'Your role does not have permission to end a production shift' }, 403)
  }

  const { id, image } = await req.json()
  if (!id || !image) return json({ error: 'id and image required' }, 400)

  const service = createServiceClient()

  const { data: existing, error: fetchErr } = await service
    .from('pos_factory_production_shifts')
    .select('id, status, started_at')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (fetchErr) return json({ error: fetchErr.message }, 500)
  if (!existing) return json({ error: 'Shift not found' }, 404)
  if ((existing as any).status !== 'active') return json({ error: `Shift is already ${(existing as any).status}` }, 400)

  let photo: { url: string; storage: 'supabase' | 'fallback' }
  try {
    photo = await uploadShiftPhoto(service, auth.ownerId, 'end', image as string)
  } catch (err) {
    console.error('Factory shift end-photo upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  const endedAt = new Date()
  const startedAt = new Date((existing as any).started_at)
  const durationMinutes = Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 60000))

  // Computed fresh at close time (never carried over from a running
  // counter) so the shift's headline number can't drift from later
  // capture approvals/rejections.
  const actualOutput = await computeShiftOutput(service, auth.ownerId, id)

  const { data: updated, error } = await service
    .from('pos_factory_production_shifts')
    .update({
      end_photo_url:    photo.url,
      end_storage:      photo.storage,
      ended_at:         endedAt.toISOString(),
      ended_by:         auth.staffId || null,
      duration_minutes: durationMinutes,
      actual_output:    actualOutput,
      status:           'completed',
    })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select(SHIFT_SELECT)
    .single()

  if (error) return json({ error: error.message }, 500)

  logPosAudit({
    auth,
    event: PRODUCTION_SHIFT_CLOSED_EVENT,
    entityType: 'factory_production_shift',
    entityId: id,
    toValue: 'completed',
    metadata: { actual_output: actualOutput, duration_minutes: durationMinutes, storage: photo.storage },
  })

  return json({ shift: updated })
}
