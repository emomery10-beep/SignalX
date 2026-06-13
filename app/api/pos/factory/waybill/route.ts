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
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'camera.output') && !hasPermission(auth.role, 'camera.wastage')) {
    return json({ error: 'Access denied' }, 403)
  }

  const body = await req.json()
  const { destination, image, waybill_ref, product_name, quantity, scheduled_at, vehicle_ref, notes, location_id } = body

  if (!image)               return json({ error: 'image required — photograph the waybill' }, 400)
  if (!destination?.trim()) return json({ error: 'destination required' }, 400)

  // Validate scheduled_at if provided
  let scheduledAtISO: string | null = null
  if (scheduled_at) {
    const d = new Date(scheduled_at)
    if (isNaN(d.getTime())) return json({ error: 'scheduled_at must be a valid ISO date' }, 400)
    scheduledAtISO = d.toISOString()
  }

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_factory_waybills')
    .insert({
      owner_id:       auth.ownerId,
      location_id:    location_id || auth.locationId || null,
      waybill_ref:    waybill_ref?.trim() || null,
      destination:    destination.trim(),
      product_name:   product_name?.trim() || null,
      quantity:       quantity ? Number(quantity) : null,
      photo_url:      image as string,
      storage:        'fallback',
      scheduled_at:   scheduledAtISO,
      dispatched_at:  new Date().toISOString(),
      vehicle_ref:    vehicle_ref?.trim() || null,
      notes:          notes?.trim() || null,
      dispatched_by:  auth.staffId || null,
    })
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ waybill: data }, 201)
}
