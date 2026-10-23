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

const VALID_REASONS = ['breakdown', 'changeover', 'no_materials', 'quality_hold', 'planned_maintenance', 'other']

// ── GET — list downtime events ────────────────────────────────────────────────
// ?date=YYYY-MM-DD  filter to a specific date (defaults to today)
// ?active=true      only return open events (ended_at IS NULL)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const canView =
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'capture.approve')
  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const date    = searchParams.get('date')
  const active  = searchParams.get('active') === 'true'
  const limit   = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_factory_downtime')
    .select(`
      *,
      reported_by_staff:pos_staff!reported_by(id, name, role),
      closed_by_staff:pos_staff!closed_by(id, name, role)
    `)
    .eq('owner_id', auth.ownerId)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (active) {
    query = query.is('ended_at', null)
  } else if (date) {
    query = query
      .gte('started_at', `${date}T00:00:00.000Z`)
      .lt('started_at',  `${date}T23:59:59.999Z`)
  } else {
    // Default: today
    const today = new Date().toISOString().slice(0, 10)
    query = query
      .gte('started_at', `${today}T00:00:00.000Z`)
      .lt('started_at',  `${today}T23:59:59.999Z`)
  }

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  // Compute today's total downtime minutes (completed events only)
  const completed = (data || []).filter((d: any) => d.duration_minutes != null)
  const totalDowntimeMinutes = completed.reduce((s: number, d: any) => s + (d.duration_minutes || 0), 0)
  const activeEvents = (data || []).filter((d: any) => d.ended_at == null)

  return json({ downtime: data, totalDowntimeMinutes, activeEvents })
}

// ── POST — start a downtime event ─────────────────────────────────────────────
// Body: { machine_name, reason, image (base64), notes? }
// ─────────────────────────────────────────────────────────────
// POST / PATCH — retired. This is an older copy of the route that lives in the POS app (pos.askbiz.co),
// which validates photos, locations and quantities. Nothing calls this one; leaving the write handlers
// open here only gave a second, unvalidated way into the same data.
// ─────────────────────────────────────────────────────────────
const retired = () => json({ error: 'Moved: use the AskBiz POS app (pos.askbiz.co).' }, 410)
export async function POST() { return retired() }
export async function PATCH() { return retired() }
