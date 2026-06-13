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
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'camera.output') && !hasPermission(auth.role, 'camera.wastage')) {
    return json({ error: 'Access denied' }, 403)
  }

  const body = await req.json()
  const { defect_type, severity, image, product_name, batch_ref, quantity_affected, notes, location_id } = body

  if (!image)       return json({ error: 'image required' }, 400)
  if (!defect_type || !VALID_DEFECT_TYPES.includes(defect_type)) {
    return json({ error: `defect_type must be one of: ${VALID_DEFECT_TYPES.join(', ')}` }, 400)
  }
  if (severity && !VALID_SEVERITIES.includes(severity)) {
    return json({ error: `severity must be one of: ${VALID_SEVERITIES.join(', ')}` }, 400)
  }

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_factory_quality')
    .insert({
      owner_id:          auth.ownerId,
      location_id:       location_id || auth.locationId || null,
      defect_type,
      severity:          severity || 'major',
      product_name:      product_name?.trim() || null,
      batch_ref:         batch_ref?.trim() || null,
      quantity_affected: quantity_affected != null ? Number(quantity_affected) : null,
      photo_url:         image as string,
      storage:           'fallback',
      notes:             notes?.trim() || null,
      reported_by:       auth.staffId || null,
    })
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ event: data }, 201)
}

// ── PATCH — update status (resolve / accept risk) ────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'capture.approve')) {
    return json({ error: 'Access denied — approvers only' }, 403)
  }

  const body = await req.json()
  const { id, status } = body
  if (!id)                                          return json({ error: 'id required' }, 400)
  if (!status || !['resolved', 'accepted_risk'].includes(status)) {
    return json({ error: 'status must be resolved or accepted_risk' }, 400)
  }

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_factory_quality')
    .update({ status })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ event: data })
}
