import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

// DEAD CODE WARNING (confirmed 2026-07-31, data-eng audit): zero callers
// anywhere in the monorepo — root has no app/factory/waybill page. The live
// pos_factory_waybills table matches pos-askbiz's schema instead (its own
// 20260724000008_factory_waybills.sql migration), which has no `status`
// column, a settable (not generated) `is_on_time`, and a `client_tx_id`
// idempotency column this route knows nothing about. If this route is ever
// wired up to a real caller, it WILL break immediately (its GET filters
// `.eq('status','dispatched')` against a column that doesn't exist live) —
// same drift class already hit and fixed for pos_factory_batches. Reconcile
// against pos-askbiz's shape (or retire this route) before reviving it.

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Access-Control-Allow-Origin': '*' } })
}

// ── GET — today's waybills + on-time stats ────────────────────────────────────
// ?date=YYYY-MM-DD  (defaults to today)
// ?limit=N
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const canView =
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'capture.approve')
  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const date  = searchParams.get('date') || new Date().toISOString().slice(0, 10)
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  const { data, error } = await service
    .from('pos_factory_waybills')
    .select('*, dispatched_by_staff:pos_staff!dispatched_by(id, name)')
    .eq('owner_id', auth.ownerId)
    .eq('status', 'dispatched')
    .gte('dispatched_at', `${date}T00:00:00.000Z`)
    .lt('dispatched_at',  `${date}T23:59:59.999Z`)
    .order('dispatched_at', { ascending: false })
    .limit(limit)

  if (error) return json({ error: error.message }, 500)

  const waybills     = data || []
  const withSchedule = waybills.filter((w: any) => w.scheduled_at != null)
  const onTime       = withSchedule.filter((w: any) => w.is_on_time === true).length
  const late         = withSchedule.filter((w: any) => w.is_on_time === false).length
  const onTimeRate   = withSchedule.length > 0 ? Math.round((onTime / withSchedule.length) * 100) : null
  const totalUnits   = waybills.reduce((s: number, w: any) => s + (w.quantity || 0), 0)

  return json({
    waybills,
    totalDispatches: waybills.length,
    onTime,
    late,
    onTimeRate,
    totalUnits,
    withScheduleCount: withSchedule.length,
  })
}

// ── POST — log a waybill scan ─────────────────────────────────────────────────
// Body: { destination, image, waybill_ref?, product_name?, quantity?,
//         scheduled_at? (ISO string), vehicle_ref?, notes? }
// ─────────────────────────────────────────────────────────────
// POST / PATCH — retired. This is an older copy of the route that lives in the POS app (pos.askbiz.co),
// which validates photos, locations and quantities. Nothing calls this one; leaving the write handlers
// open here only gave a second, unvalidated way into the same data.
// ─────────────────────────────────────────────────────────────
const retired = () => json({ error: 'Moved: use the AskBiz POS app (pos.askbiz.co).' }, 410)
export async function POST() { return retired() }
