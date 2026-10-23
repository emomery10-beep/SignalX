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

const VALID_SHIFT_NAMES = ['Morning', 'Afternoon', 'Night', 'Custom']

// ── GET — active shift + recent completed ─────────────────────────────────────
// Returns { activeShift, recentShifts }
// For each completed shift, actual_output is computed from pos_factory_captures
// in the shift's time window (output type only).
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const canView =
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'capture.approve')
  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const limit = Math.min(20, parseInt(searchParams.get('limit') || '10'))

  // Active shift
  const { data: activeShift } = await service
    .from('pos_factory_shifts')
    .select('*, started_by_staff:pos_staff!started_by(id, name)')
    .eq('owner_id', auth.ownerId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Recent completed/abandoned shifts
  const { data: recentShifts } = await service
    .from('pos_factory_shifts')
    .select('*, started_by_staff:pos_staff!started_by(id, name), ended_by_staff:pos_staff!ended_by(id, name)')
    .eq('owner_id', auth.ownerId)
    .in('status', ['completed', 'abandoned'])
    .order('ended_at', { ascending: false })
    .limit(limit)

  // For the active shift: compute live output since it started
  let liveOutput = 0
  if (activeShift) {
    const { data: captures } = await service
      .from('pos_factory_captures')
      .select('quantity')
      .eq('owner_id', auth.ownerId)
      .eq('type', 'output')
      .gte('created_at', activeShift.started_at)

    liveOutput = (captures || []).reduce((s: number, c: any) => s + (c.quantity || 0), 0)
  }

  // For recent shifts: compute actual output per shift
  const shiftsWithOutput = await Promise.all(
    (recentShifts || []).map(async (shift: any) => {
      if (!shift.ended_at) return { ...shift, actual_output: null }
      const { data: captures } = await service
        .from('pos_factory_captures')
        .select('quantity')
        .eq('owner_id', auth.ownerId)
        .eq('type', 'output')
        .gte('created_at', shift.started_at)
        .lt('created_at', shift.ended_at)
      const actual = (captures || []).reduce((s: number, c: any) => s + (c.quantity || 0), 0)
      return { ...shift, actual_output: actual }
    })
  )

  return json({
    activeShift: activeShift ? { ...activeShift, live_output: liveOutput } : null,
    recentShifts: shiftsWithOutput,
  })
}

// ── POST — start a new shift ──────────────────────────────────────────────────
// Body: { shift_name, image, target_units?, custom_name?, notes? }
// ─────────────────────────────────────────────────────────────
// POST / PATCH — retired. This is an older copy of the route that lives in the POS app (pos.askbiz.co),
// which validates photos, locations and quantities. Nothing calls this one; leaving the write handlers
// open here only gave a second, unvalidated way into the same data.
// ─────────────────────────────────────────────────────────────
const retired = () => json({ error: 'Moved: use the AskBiz POS app (pos.askbiz.co).' }, 410)
export async function POST() { return retired() }
export async function PATCH() { return retired() }
