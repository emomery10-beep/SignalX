import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'
import { signPayload } from '@/lib/factory-photos'
import { syncFactoryStockToInventory, STOCK_AFFECTING_TYPES } from '@/lib/factory-dispatch-to-inventory'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// Same as json(), but swaps any stored photo reference (sb://bucket/path) for a short-lived signed URL.
async function jsonSigned(data: unknown, status = 200) {
  return json(await signPayload(createServiceClient(), data), status)
}

type CaptureType = 'intake' | 'intake_arrival' | 'intake_feed' | 'output' | 'wastage' | 'dispatch'

// Permission map: capture type → required permission
const CAPTURE_PERMISSION: Record<CaptureType, Parameters<typeof hasPermission>[1]> = {
  intake:   'camera.intake',
  intake_arrival: 'camera.intake',
  intake_feed: 'camera.intake',
  output:   'camera.output',
  wastage:  'camera.wastage',
  dispatch: 'camera.dispatch',
}

// dispatch_price is set only by an approver (pos-askbiz's PATCH /factory/
// capture, capture.approve permission) and must never reach the staff
// member who submitted the dispatch — same requirement as pos-askbiz's copy
// of this route (app/api/pos/factory/capture/route.ts there has the fuller
// fix; this older, separate copy only needed this one piece ported over
// since it never had dispatch_price/PATCH support to begin with). This
// route's GET selects '*' with no redaction, and this root app's PIN-staff
// auth (lib/pos-auth.ts) accepts the same x-staff-id/x-owner-id headers a
// dispatcher would use — so without this, any staff role with a camera
// permission could read dispatch_price for their own approved dispatches.
// Confirmed live 2026-09-22.
function redactDispatchPriceForNonApprovers<T extends Record<string, unknown>>(capture: T, role: string | null | undefined): T {
  if (!capture || hasPermission(role, 'capture.approve_dispatch')) return capture
  return { ...capture, dispatch_price: null }
}

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
    hasPermission(auth.role, 'capture.approve')

  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const type        = searchParams.get('type')
  const status      = searchParams.get('status')
  const shift_id    = searchParams.get('shift_id')
  const location_id = searchParams.get('location_id')
  const date        = searchParams.get('date')  // YYYY-MM-DD
  const from        = searchParams.get('from')  // ISO datetime, inclusive
  const to          = searchParams.get('to')    // ISO datetime, inclusive
  const page        = Math.max(0, parseInt(searchParams.get('page')  || '0'))
  const limit       = Math.min(2000, Math.max(1, parseInt(searchParams.get('limit') || '2000') || 2000))

  let query = service
    .from('pos_factory_captures')
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      approved_by_staff:pos_staff!approved_by(id, name, role),
      location:pos_locations!location_id(id, name)
    `, { count: 'exact' })
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (type)        query = query.eq('type', type)
  if (status)      query = query.eq('status', status)
  if (shift_id)    query = query.eq('shift_id', shift_id)
  if (location_id) query = query.eq('location_id', location_id)
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // Nairobi (UTC+3, no DST) calendar day, not raw UTC — a capture made
    // after ~9pm Nairobi time is already "tomorrow" in UTC, so a plain UTC
    // midnight boundary silently puts it under the wrong date. Same
    // convention as components/pos/FactoryTab.tsx's day-bucketing fix
    // (commit 139d94f1) and pos-askbiz's copy of this route.
    const start = new Date(`${date}T00:00:00+03:00`)
    const end = new Date(start.getTime() + 24 * 3600 * 1000)
    query = query
      .gte('created_at', start.toISOString())
      .lt('created_at',  end.toISOString())
  }
  if (from) query = query.gte('created_at', from)
  if (to)   query = query.lte('created_at', to)

  // Non-approvers (floor workers) only see their own captures
  if (!hasPermission(auth.role, 'capture.approve') && auth.staffId) {
    query = query.eq('captured_by', auth.staffId)
  }

  const { data, error, count } = await query
  if (error) return json({ error: error.message }, 500)

  const captures = (data || []).map((c: Record<string, unknown>) => redactDispatchPriceForNonApprovers(c, auth.role))
  return jsonSigned({ captures, total: count })
}

// ─────────────────────────────────────────────────────────────
// POST — retired. Captures are submitted from the POS app (pos.askbiz.co), whose route validates the
// product list, packaging, holds and photos. This older copy had none of that and nothing calls it.
// ─────────────────────────────────────────────────────────────
export async function POST() {
  return json({ error: 'Submit captures from the AskBiz POS app (pos.askbiz.co).' }, 410)
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

  const { id, status, rejection_reason, dispatch_price } = await req.json()

  if (!id || !status) return json({ error: 'id and status required' }, 400)
  if (!['approved', 'rejected'].includes(status)) {
    return json({ error: 'status must be approved or rejected' }, 400)
  }
  if (status === 'rejected' && !rejection_reason?.trim()) {
    return json({ error: 'rejection_reason required when rejecting a capture' }, 400)
  }

  let resolvedDispatchPrice: number | null = null
  if (dispatch_price !== undefined && dispatch_price !== null && dispatch_price !== '') {
    const parsed = Number(dispatch_price)
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1_000_000_000) {
      return json({ error: 'dispatch_price must be a non-negative number' }, 400)
    }
    resolvedDispatchPrice = parsed
  }

  const service = createServiceClient()

  // Confirm capture belongs to this owner and is still pending
  const { data: existing } = await service
    .from('pos_factory_captures')
    .select('id, status, type, location_id, captured_by')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!existing) return json({ error: 'Capture not found' }, 404)
  if (existing.type === 'dispatch' && !hasPermission(auth.role, 'capture.approve_dispatch')) {
    return json({ error: 'Only the production manager or owner can approve or reject dispatches' }, 403)
  }
  if (existing.status !== 'pending') {
    return json({ error: `Capture is already ${existing.status}` }, 400)
  }
  if (auth.staffId && existing.captured_by && existing.captured_by === auth.staffId) {
    return json({ error: 'You cannot approve or reject your own capture. Ask another approver.' }, 403)
  }
  // An approved dispatch with no price is revenue the CFO can never count, so it needs one up front
  // (the POS app's approvals screen enforces the same rule).
  const isDispatchApproval = status === 'approved' && existing.type === 'dispatch'
  if (isDispatchApproval && resolvedDispatchPrice === null) {
    return json({ error: 'Enter the dispatch price (per unit) before approving' }, 400)
  }

  const { data: updated, error } = await service
    .from('pos_factory_captures')
    .update({
      status,
      approved_by:      auth.staffId || null,
      approved_at:      status === 'approved' ? new Date().toISOString() : null,
      rejection_reason: status === 'rejected' ? rejection_reason.trim() : null,
      ...(isDispatchApproval ? { dispatch_price: resolvedDispatchPrice } : {}),
    })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .eq('status', 'pending')
    .select(`
      *,
      captured_by_staff:pos_staff!captured_by(id, name, role),
      approved_by_staff:pos_staff!approved_by(id, name, role),
      location:pos_locations!location_id(id, name)
    `)
    .maybeSingle()

  if (error) return json({ error: error.message }, 500)
  if (!updated) return json({ error: 'Capture was already actioned by someone else' }, 409)

  logPosAudit({
    auth,
    event: status === 'approved' ? 'capture.approved' : 'capture.rejected',
    entityType: 'factory_capture', entityId: id,
    toValue: status,
    metadata: status === 'rejected' ? { rejection_reason: rejection_reason.trim() } : (isDispatchApproval ? { dispatch_price: resolvedDispatchPrice } : {}),
  })

  // Any approved capture that moves stock refreshes the factory inventory rows (the POS app does the same).
  if (status === 'approved' && STOCK_AFFECTING_TYPES.includes(existing.type)) {
    await syncFactoryStockToInventory(auth.ownerId, existing.location_id || null)
  }

  return jsonSigned({ capture: updated })
}
