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
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  // Any worker who can submit output can report downtime
  if (!hasPermission(auth.role, 'camera.output') && !hasPermission(auth.role, 'camera.wastage')) {
    return json({ error: 'Access denied' }, 403)
  }

  const body = await req.json()
  const { machine_name, reason, image, notes, location_id } = body

  if (!image) return json({ error: 'image required' }, 400)
  if (!reason || !VALID_REASONS.includes(reason)) {
    return json({ error: `reason must be one of: ${VALID_REASONS.join(', ')}` }, 400)
  }

  // Store photo as base64 fallback (same pattern as factory captures)
  const photoUrl = image as string

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_factory_downtime')
    .insert({
      owner_id:       auth.ownerId,
      location_id:    location_id || auth.locationId || null,
      machine_name:   (machine_name || 'Machine').trim(),
      reason,
      notes:          notes || null,
      start_photo_url: photoUrl,
      storage:        'fallback',
      reported_by:    auth.staffId || null,
      started_at:     new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ downtime: data }, 201)
}

// ── PATCH — close a downtime event (machine back up) ─────────────────────────
// Body: { id, image (base64 of running machine) }
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'camera.output') && !hasPermission(auth.role, 'camera.wastage')) {
    return json({ error: 'Access denied' }, 403)
  }

  const body = await req.json()
  const { id, image } = body
  if (!id)    return json({ error: 'id required' }, 400)
  if (!image) return json({ error: 'image required' }, 400)

  const service = createServiceClient()

  // Verify the event belongs to this owner and is still open
  const { data: existing } = await service
    .from('pos_factory_downtime')
    .select('id, ended_at')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .single()

  if (!existing)          return json({ error: 'Event not found' }, 404)
  if (existing.ended_at)  return json({ error: 'Event already closed' }, 400)

  const { data, error } = await service
    .from('pos_factory_downtime')
    .update({
      end_photo_url: image as string,
      ended_at:      new Date().toISOString(),
      closed_by:     auth.staffId || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ downtime: data })
}
