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
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'camera.output') && !hasPermission(auth.role, 'camera.wastage')) {
    return json({ error: 'Access denied' }, 403)
  }

  const body = await req.json()
  const { shift_name, image, target_units, custom_name, notes, location_id } = body

  if (!image) return json({ error: 'image required — photograph the floor to start shift' }, 400)
  if (!shift_name || !VALID_SHIFT_NAMES.includes(shift_name)) {
    return json({ error: `shift_name must be one of: ${VALID_SHIFT_NAMES.join(', ')}` }, 400)
  }

  const service = createServiceClient()

  // Block if another shift is already active for this owner
  const { data: existing } = await service
    .from('pos_factory_shifts')
    .select('id, shift_name, started_at')
    .eq('owner_id', auth.ownerId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (existing) {
    return json({
      error: 'A shift is already active. End it before starting a new one.',
      activeShift: existing,
    }, 409)
  }

  const { data, error } = await service
    .from('pos_factory_shifts')
    .insert({
      owner_id:        auth.ownerId,
      location_id:     location_id || auth.locationId || null,
      shift_name,
      custom_name:     shift_name === 'Custom' ? (custom_name?.trim() || null) : null,
      start_photo_url: image as string,
      storage:         'fallback',
      target_units:    target_units ? Number(target_units) : null,
      notes:           notes?.trim() || null,
      started_by:      auth.staffId || null,
    })
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ shift: data }, 201)
}

// ── PATCH — end shift / abandon shift ─────────────────────────────────────────
// Body: { id, image, status? ('completed' | 'abandoned'), notes? }
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'camera.output') && !hasPermission(auth.role, 'camera.wastage')) {
    return json({ error: 'Access denied' }, 403)
  }

  const body = await req.json()
  const { id, image, status: newStatus, notes } = body
  if (!id)    return json({ error: 'id required' }, 400)
  if (!image) return json({ error: 'image required — photograph the output to end shift' }, 400)

  const closeStatus = newStatus === 'abandoned' ? 'abandoned' : 'completed'

  const service = createServiceClient()

  // Verify the shift is active and belongs to this owner
  const { data: shift } = await service
    .from('pos_factory_shifts')
    .select('id, status, started_at')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .single()

  if (!shift)              return json({ error: 'Shift not found' }, 404)
  if (shift.status !== 'active') return json({ error: 'Shift is not active' }, 400)

  const endedAt = new Date().toISOString()

  const { data, error } = await service
    .from('pos_factory_shifts')
    .update({
      end_photo_url: image as string,
      ended_at:      endedAt,
      ended_by:      auth.staffId || null,
      status:        closeStatus,
      notes:         notes?.trim() || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return json({ error: error.message }, 500)

  // Compute actual output during this shift
  const { data: captures } = await service
    .from('pos_factory_captures')
    .select('quantity')
    .eq('owner_id', auth.ownerId)
    .eq('type', 'output')
    .gte('created_at', shift.started_at)
    .lt('created_at', endedAt)

  const actualOutput = (captures || []).reduce((s: number, c: any) => s + (c.quantity || 0), 0)

  return json({ shift: { ...data, actual_output: actualOutput } })
}
