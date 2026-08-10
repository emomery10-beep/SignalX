import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'
import { matchHoldRule, matchManualHoldRule } from '@/lib/factory-holds'
import { matchDecayRule } from '@/lib/factory-decay'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch' | 'packaging'

// Permission map: capture type → required permission
const CAPTURE_PERMISSION: Record<CaptureType, Parameters<typeof hasPermission>[1]> = {
  intake:    'camera.intake',
  output:    'camera.output',
  wastage:   'camera.wastage',
  dispatch:  'camera.dispatch',
  packaging: 'camera.packaging',
}

// Sellable-annotation fields (sale_price / buyer_name) only make sense on
// captures that represent something that could actually be sold: a finished
// output, or a wastage capture that's really a byproduct (press-cake, bran,
// whey — several factory-type templates explicitly warn these should NOT be
// logged as plain wastage, but the live capture form only has output/
// wastage to choose between, so wastage needs to be able to carry a sale
// too). Intake/dispatch/packaging never carry a sale annotation directly —
// packaging just repackages an output that may already be marked sold.
const SALE_ANNOTATABLE_TYPES: CaptureType[] = ['output', 'wastage']

// A generic, free-form process-parameter reading (e.g. dairy's pasteurize
// temp/time) — deliberately not auto-detected/template-matched like
// holdRule/decayRule; a worker fills this in directly, so it needs no
// settled product name to match against (relevant since e.g. dairy's own
// pasteurize stage happens before the yoghurt/cheese/ghee-butter branch is
// even chosen). Intake/output only — the two "a real measurement happened
// here" moments; wastage/dispatch/packaging don't obviously need one.
const PARAM_ANNOTATABLE_TYPES: CaptureType[] = ['intake', 'output']

// Which captures can be grouped into a production run (see the run_ref
// find-or-create block in POST below) — intake/output only, the two
// moments a run's "what went in, what came out" actually spans.
const RUN_TAGGABLE_TYPES: CaptureType[] = ['intake', 'output']

// ─────────────────────────────────────────────────────────────
// GET — list captures (filterable by type / status / date / shift)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // Any role with at least one camera permission (or supervisor+) can list
  const canView =
    hasPermission(auth.role, 'camera.intake') ||
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'camera.wastage') ||
    hasPermission(auth.role, 'camera.dispatch') ||
    hasPermission(auth.role, 'camera.packaging') ||
    hasPermission(auth.role, 'capture.approve')

  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const type      = searchParams.get('type')
  const status    = searchParams.get('status')
  const shift_id  = searchParams.get('shift_id')
  const date      = searchParams.get('date')  // YYYY-MM-DD
  const page      = Math.max(0, parseInt(searchParams.get('page')  || '0'))
  const limit     = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_factory_captures')
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      approved_by_staff:pos_staff!approved_by(id, name, role),
      location:pos_locations!location_id(id, name),
      production_run:pos_factory_production_runs!production_run_id(id, run_ref, input_product_name)
    `, { count: 'exact' })
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (type)     query = query.eq('type', type)
  if (status)   query = query.eq('status', status)
  if (shift_id) query = query.eq('shift_id', shift_id)
  if (date) {
    query = query
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at',  `${date}T23:59:59.999Z`)
  }

  // Non-approvers (floor workers) only see their own captures
  if (!hasPermission(auth.role, 'capture.approve') && auth.staffId) {
    query = query.eq('captured_by', auth.staffId)
  }

  const { data, error, count } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ captures: data, total: count })
}

// ─────────────────────────────────────────────────────────────
// POST — submit a new capture
// Body: { type, image (base64), shift_id?, product_name?, batch_ref?, quantity?, notes?,
//         sale_price?, buyer_name? (output/wastage only) }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const body = await req.json()
  const { type, image, shift_id, batch_ref, quantity, notes, location_id } = body
  // '__other__' is the capture form's raw <option> value for "pick from a
  // free-text product name instead of the inventory list" -- the client is
  // expected to swap it for the typed-in name before submitting, but never
  // trust that from the server side. Treat a literal '__other__' the same
  // as "no product name" rather than let the placeholder leak into
  // reporting (e.g. the /factory/production Yield Summary).
  const product_name = body.product_name === '__other__' ? null : body.product_name

  if (!type || !image) return json({ error: 'type and image required' }, 400)
  if (!['intake', 'output', 'wastage', 'dispatch', 'packaging'].includes(type)) {
    return json({ error: 'type must be intake, output, wastage, dispatch, or packaging' }, 400)
  }

  const captureType = type as CaptureType
  if (!hasPermission(auth.role, CAPTURE_PERMISSION[captureType])) {
    return json({ error: `Your role does not have permission to submit ${type} captures` }, 403)
  }

  // Optional "this was sold" annotation — only meaningful on output/wastage
  // (see SALE_ANNOTATABLE_TYPES above). Silently dropped rather than
  // rejected on other types, since the client always knows which type it's
  // submitting and this keeps the endpoint forgiving of a stray field.
  let sale_price: number | null = null
  let buyer_name: string | null = null
  if (SALE_ANNOTATABLE_TYPES.includes(captureType)) {
    if (body.sale_price !== undefined && body.sale_price !== null && body.sale_price !== '') {
      const parsed = Number(body.sale_price)
      if (!Number.isFinite(parsed) || parsed < 0) {
        return json({ error: 'sale_price must be a non-negative number' }, 400)
      }
      sale_price = parsed
    }
    if (typeof body.buyer_name === 'string' && body.buyer_name.trim()) {
      buyer_name = body.buyer_name.trim().slice(0, 200)
    }
  }

  // Optional process-parameter reading — only meaningful on intake/output
  // (see PARAM_ANNOTATABLE_TYPES above). All three fields travel together;
  // a label with no value (or vice versa) is dropped rather than rejected,
  // same forgiving-of-a-stray-field posture as the sale annotation above.
  let param_label: string | null = null
  let param_value: number | null = null
  let param_unit: string | null = null
  if (PARAM_ANNOTATABLE_TYPES.includes(captureType) && typeof body.param_label === 'string' && body.param_label.trim() && body.param_value !== undefined && body.param_value !== null && body.param_value !== '') {
    const parsedParam = Number(body.param_value)
    if (!Number.isFinite(parsedParam)) {
      return json({ error: 'param_value must be a number' }, 400)
    }
    param_label = body.param_label.trim().slice(0, 100)
    param_value = parsedParam
    param_unit = typeof body.param_unit === 'string' && body.param_unit.trim() ? body.param_unit.trim().slice(0, 20) : null
  }

  const service = createServiceClient()

  // Optional production-run tagging (intake/output only) — find-or-create
  // by a human-typed reference, same UX pattern app/factory/batch/page.tsx
  // already uses for batch_ref. Activates pos_factory_production_runs +
  // pos_factory_captures.production_run_id, both live since July with zero
  // callers until now — lets two co-outputs (or an intake and the output
  // it became) be grouped so the Production log's per-run yield view can
  // attribute intake correctly instead of dividing by an owner's ENTIRE
  // intake history for that product name. Best-effort: a lookup/create
  // failure should never block the capture itself.
  let production_run_id: string | null = null
  const run_ref = typeof body.run_ref === 'string' ? body.run_ref.trim().slice(0, 64) : ''
  if (RUN_TAGGABLE_TYPES.includes(captureType) && run_ref) {
    try {
      const { data: existingRun } = await service
        .from('pos_factory_production_runs')
        .select('id')
        .eq('owner_id', auth.ownerId)
        .eq('run_ref', run_ref)
        .maybeSingle()
      if (existingRun) {
        production_run_id = existingRun.id
      } else {
        const { data: newRun, error: newRunErr } = await service
          .from('pos_factory_production_runs')
          .insert({ owner_id: auth.ownerId, run_ref, input_product_name: product_name || null, created_by: auth.staffId || null })
          .select('id')
          .single()
        if (!newRunErr) production_run_id = newRun.id
      }
    } catch (err) {
      console.error('Factory production run lookup/create error (non-fatal):', err)
    }
  }

  // Marks an 'output' capture as a real, separately-sellable mid-process
  // intermediate (parboiled paddy, dried parchment coffee) rather than a
  // final product.
  const is_intermediate = captureType === 'output' && body.is_intermediate === true

  // Idempotency: a client_tx_id makes retries and offline-queue replays
  // safe. Dedupe BEFORE uploading the photo, so a replay never re-uploads
  // a duplicate blob for a capture that's already recorded.
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null
  if (clientTxId) {
    try {
      const { data: dupe, error: dupeErr } = await service
        .from('pos_factory_captures')
        .select('*, captured_by_staff:pos_staff!captured_by(id, name, role), location:pos_locations!location_id(id, name)')
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (!dupeErr && dupe) return json({ capture: dupe, deduped: true }, 200)
    } catch { /* dedupe is best-effort — never block a capture on it */ }
  }

  // Upload photo to Supabase Storage
  let photoUrl = ''
  let storageMode: 'supabase' | 'fallback' = 'supabase'

  try {
    const base64Data = (image as string).replace(/^data:image\/\w+;base64,/, '')
    const buffer     = Buffer.from(base64Data, 'base64')
    const filename   = `${auth.ownerId}/${type}_${Date.now()}.jpg`

    const { error: uploadErr } = await service.storage
      .from('factory-captures')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })

    if (uploadErr) {
      // Bucket may not exist yet — fall back to data URL
      console.error('factory-captures storage upload failed:', uploadErr.message)
      photoUrl    = `data:image/jpeg;base64,${base64Data}`
      storageMode = 'fallback'
    } else {
      // factory-captures is a private bucket — a public URL 404s in the
      // browser. Sign it instead (10-year expiry: these photos need to
      // stay viewable indefinitely, not just for one session).
      const { data: signedData, error: signErr } = await service.storage
        .from('factory-captures')
        .createSignedUrl(filename, 60 * 60 * 24 * 365 * 10)
      if (signErr || !signedData?.signedUrl) {
        console.error('factory-captures signed URL failed:', signErr?.message)
        photoUrl    = `data:image/jpeg;base64,${base64Data}`
        storageMode = 'fallback'
      } else {
        photoUrl = signedData.signedUrl
      }
    }
  } catch (err) {
    console.error('Factory capture upload error:', err)
    return json({ error: 'Image upload failed' }, 500)
  }

  // Tag this capture with the owner's currently-active factory PRODUCTION
  // shift (pos_factory_production_shifts — output targets / floor photos),
  // if one is open. Distinct from shift_id above, which points at the
  // cash-register pos_shifts and is untouched.
  //
  // Best-effort and schema-gated: the production-shifts migration
  // (20260724000007_factory_production_shifts.sql) may not be applied to
  // this environment yet, in which case both the lookup below and the
  // production_shift_id column on this table are absent. We only look at
  // whether the lookup itself errored (not whether it found a row) to
  // decide whether to include the column in the insert at all — this way
  // a capture never fails because an optional, not-yet-migrated column
  // was referenced.
  let activeProductionShiftId: string | null = null
  let productionShiftColumnAvailable = false
  try {
    const { data: activeProductionShift, error: activeShiftErr } = await service
      .from('pos_factory_production_shifts')
      .select('id')
      .eq('owner_id', auth.ownerId)
      .eq('status', 'active')
      .maybeSingle()
    if (!activeShiftErr) {
      productionShiftColumnAvailable = true
      activeProductionShiftId = activeProductionShift?.id || null
    }
  } catch { /* production-shifts migration not applied yet — skip tagging */ }

  const { data: capture, error } = await service
    .from('pos_factory_captures')
    .insert({
      owner_id:     auth.ownerId,
      location_id:  location_id || auth.locationId || null,
      shift_id:     shift_id || null,
      captured_by:  auth.staffId || null,
      type:         captureType,
      status:       'pending',
      photo_url:    photoUrl,
      storage:      storageMode,
      product_name: product_name || null,
      batch_ref:    batch_ref    || null,
      quantity:     quantity     ?? null,
      notes:        notes        || null,
      client_tx_id: clientTxId,
      sale_price,
      buyer_name,
      param_label,
      param_value,
      param_unit,
      production_run_id,
      is_intermediate,
      ...(productionShiftColumnAvailable ? { production_shift_id: activeProductionShiftId } : {}),
    })
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      location:pos_locations!location_id(id, name)
    `)
    .single()

  if (error) {
    // 23505 = unique violation: a concurrent retry already recorded this capture — return it
    if (clientTxId && (error as any).code === '23505') {
      const { data: dupe } = await service
        .from('pos_factory_captures')
        .select('*, captured_by_staff:pos_staff!captured_by(id, name, role), location:pos_locations!location_id(id, name)')
        .eq('owner_id', auth.ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (dupe) return json({ capture: dupe, deduped: true }, 200)
    }
    // Live schema may predate the client_tx_id migration — never fail a
    // capture because an optional column is missing.
    if (/client_tx_id|column|schema cache/i.test(error.message || '')) {
      const { data: retryCapture, error: retryErr } = await service
        .from('pos_factory_captures')
        .insert({
          owner_id: auth.ownerId, location_id: location_id || auth.locationId || null, shift_id: shift_id || null,
          captured_by: auth.staffId || null, type: captureType, status: 'pending', photo_url: photoUrl,
          storage: storageMode, product_name: product_name || null, batch_ref: batch_ref || null,
          quantity: quantity ?? null, notes: notes || null, sale_price, buyer_name,
          param_label, param_value, param_unit, production_run_id, is_intermediate,
        })
        .select('*, captured_by_staff:pos_staff!captured_by(id, name, role), location:pos_locations!location_id(id, name)')
        .single()
      if (retryErr) return json({ error: retryErr.message }, 500)
      logPosAudit({
        auth, event: 'capture.submitted', entityType: 'factory_capture', entityId: retryCapture.id,
        toValue: captureType,
        metadata: { product_name: product_name || null, batch_ref: batch_ref || null, quantity: quantity ?? null, storage: storageMode, sale_price, buyer_name, param_label, param_value, param_unit, run_ref: run_ref || null, is_intermediate },
      })
      return json({ capture: retryCapture }, 201)
    }
    return json({ error: error.message }, 500)
  }

  logPosAudit({
    auth, event: 'capture.submitted', entityType: 'factory_capture', entityId: capture.id,
    toValue: captureType,
    metadata: { product_name: product_name || null, batch_ref: batch_ref || null, quantity: quantity ?? null, storage: storageMode, sale_price, buyer_name, param_label, param_value, param_unit, run_ref: run_ref || null, is_intermediate },
  })

  // Auto-create a not-yet-releasable hold, and/or set a shelf-life expiry,
  // if this output/packaging capture's product matches a factory-type
  // recipe carrying one (or the owner's own manual hold override, for a
  // factory type outside the 12-template library). One profile fetch
  // serves both checks. Best-effort throughout: a lookup failure should
  // never fail the capture itself.
  if ((captureType === 'output' || captureType === 'packaging') && product_name) {
    try {
      const { data: profile } = await service
        .from('profiles')
        .select('factory_type, factory_hold_enabled, factory_hold_days, factory_hold_label')
        .eq('id', auth.ownerId)
        .maybeSingle()

      const matchedHold = matchHoldRule(product_name, profile?.factory_type)
        ?? matchManualHoldRule(profile?.factory_hold_enabled, profile?.factory_hold_days, profile?.factory_hold_label)

      if (matchedHold) {
        const { rule } = matchedHold
        const holdRows: Record<string, unknown>[] = [{
          owner_id: auth.ownerId,
          capture_id: capture.id,
          label: rule.label,
          releasable_at: rule.durationDays ? new Date(Date.now() + rule.durationDays * 86400000).toISOString() : null,
          is_blocking: true,
        }]
        // Concrete's real case: a second, later, informational-only
        // milestone alongside the primary blocking one.
        if (rule.secondaryDurationDays) {
          holdRows.push({
            owner_id: auth.ownerId,
            capture_id: capture.id,
            label: rule.secondaryLabel || rule.label,
            releasable_at: new Date(Date.now() + rule.secondaryDurationDays * 86400000).toISOString(),
            is_blocking: false,
          })
        }
        await service.from('pos_factory_capture_holds').insert(holdRows)
      }

      // Shelf-life decay — the mirror case (bakery: sellable now, but not
      // for long). A capture can't be both held and decaying (nothing in
      // the 12 templates has that shape), so this runs independently of
      // the hold check above rather than as an else-branch.
      const matchedDecay = matchDecayRule(product_name, profile?.factory_type)
      if (matchedDecay) {
        await service
          .from('pos_factory_captures')
          .update({ expires_at: new Date(Date.now() + matchedDecay.rule.hoursUntilExpiry * 3600000).toISOString() })
          .eq('id', capture.id)
          .eq('owner_id', auth.ownerId)
      }
    } catch (err) {
      console.error('Factory capture hold/decay creation error (non-fatal):', err)
    }
  }

  return json({ capture }, 201)
}

// ─────────────────────────────────────────────────────────────
// PATCH — approve or reject a capture (supervisor+ only)
// Body: { id, status: 'approved' | 'rejected', rejection_reason? }
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'capture.approve')) {
    return json({ error: 'Only supervisor, manager, or owner can approve captures' }, 403)
  }

  const { id, status, rejection_reason } = await req.json()

  if (!id || !status) return json({ error: 'id and status required' }, 400)
  if (!['approved', 'rejected'].includes(status)) {
    return json({ error: 'status must be approved or rejected' }, 400)
  }
  if (status === 'rejected' && !rejection_reason?.trim()) {
    return json({ error: 'rejection_reason required when rejecting a capture' }, 400)
  }

  const service = createServiceClient()

  // Confirm capture belongs to this owner and is still pending
  const { data: existing } = await service
    .from('pos_factory_captures')
    .select('id, status')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!existing) return json({ error: 'Capture not found' }, 404)
  if (existing.status !== 'pending') {
    return json({ error: `Capture is already ${existing.status}` }, 400)
  }

  const { data: updated, error } = await service
    .from('pos_factory_captures')
    .update({
      status,
      approved_by:      auth.staffId || null,
      approved_at:      status === 'approved' ? new Date().toISOString() : null,
      rejection_reason: status === 'rejected' ? rejection_reason.trim() : null,
    })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      approved_by_staff:pos_staff!approved_by(id, name, role),
      location:pos_locations!location_id(id, name)
    `)
    .single()

  if (error) return json({ error: error.message }, 500)

  logPosAudit({
    auth,
    event: status === 'approved' ? 'capture.approved' : 'capture.rejected',
    entityType: 'factory_capture', entityId: id,
    toValue: status,
    metadata: status === 'rejected' ? { rejection_reason: rejection_reason.trim() } : {},
  })

  return json({ capture: updated })
}
