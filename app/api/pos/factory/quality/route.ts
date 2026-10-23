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

const VALID_DEFECT_TYPES = ['dimensional', 'surface', 'contamination', 'assembly', 'packaging', 'other']
const VALID_SEVERITIES   = ['critical', 'major', 'minor']

// ── GET — list quality events ─────────────────────────────────────────────────
// ?date=YYYY-MM-DD  filter to a specific date (defaults to today)
// ?severity=critical|major|minor
// ?status=open|resolved|accepted_risk
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const canView =
    hasPermission(auth.role, 'camera.output') ||
    hasPermission(auth.role, 'capture.approve')
  if (!canView) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const date     = searchParams.get('date')
  const severity = searchParams.get('severity')
  const status   = searchParams.get('status')
  const limit    = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  let query = service
    .from('pos_factory_quality')
    .select(`
      *,
      reported_by_staff:pos_staff!reported_by(id, name, role)
    `)
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (date) {
    query = query
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at',  `${date}T23:59:59.999Z`)
  } else {
    const today = new Date().toISOString().slice(0, 10)
    query = query
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at',  `${today}T23:59:59.999Z`)
  }

  if (severity && VALID_SEVERITIES.includes(severity)) {
    query = query.eq('severity', severity)
  }
  if (status && ['open', 'resolved', 'accepted_risk'].includes(status)) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  const events     = data || []
  const criticals  = events.filter((e: any) => e.severity === 'critical').length
  const majors     = events.filter((e: any) => e.severity === 'major').length
  const minors     = events.filter((e: any) => e.severity === 'minor').length
  const totalAffected = events.reduce((s: number, e: any) => s + (e.quantity_affected || 0), 0)
  const openCount  = events.filter((e: any) => e.status === 'open').length

  return json({ events, criticals, majors, minors, totalAffected, openCount })
}

// ── POST — log a quality defect event ────────────────────────────────────────
// Body: { defect_type, severity, photo (base64), product_name?, batch_ref?,
//         quantity_affected?, notes?, location_id? }
// ─────────────────────────────────────────────────────────────
// POST / PATCH — retired. This is an older copy of the route that lives in the POS app (pos.askbiz.co),
// which validates photos, locations and quantities. Nothing calls this one; leaving the write handlers
// open here only gave a second, unvalidated way into the same data.
// ─────────────────────────────────────────────────────────────
const retired = () => json({ error: 'Moved: use the AskBiz POS app (pos.askbiz.co).' }, 410)
export async function POST() { return retired() }
export async function PATCH() { return retired() }
