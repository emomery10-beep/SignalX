import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — labor shifts with cost summary
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const from        = searchParams.get('from') || new Date(Date.now() - 86400000).toISOString()
  const to          = searchParams.get('to')   || new Date().toISOString()
  const active_only = searchParams.get('active') === 'true'
  const location_id = searchParams.get('location_id') || auth.locationId

  let query = service.from('restaurant_labor_shifts')
    .select(`*, staff:pos_staff!staff_id(id, name, role)`)
    .eq('owner_id', auth.ownerId)
    .order('clock_in', { ascending: false })

  if (active_only) {
    query = query.eq('status', 'active')
  } else {
    query = query.gte('clock_in', from).lte('clock_in', to)
  }
  if (location_id) query = query.eq('location_id', location_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const shifts = data || []
  const totalCost  = shifts.reduce((s: number, sh: any) => s + (sh.total_cost || 0), 0)
  const totalHours = shifts.reduce((s: number, sh: any) => s + (sh.total_hours || 0), 0)
  const active     = shifts.filter((s: any) => s.status === 'active')

  // Live running cost for active shifts
  const now = Date.now()
  const liveRunningCost = active.reduce((s: number, sh: any) => {
    const hoursWorked = (now - new Date(sh.clock_in).getTime()) / 3600000
    return s + hoursWorked * (sh.hourly_rate || 0)
  }, 0)

  return NextResponse.json({
    shifts,
    summary: {
      total_cost:       totalCost,
      total_hours:      totalHours,
      active_count:     active.length,
      live_running_cost: liveRunningCost,
    },
  })
}

// POST — clock in a staff member
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { staff_id, role, hourly_rate, location_id, notes } = await req.json()
  if (!staff_id) return NextResponse.json({ error: 'staff_id required' }, { status: 400 })

  // Prevent double clock-in
  const { data: existing } = await service.from('restaurant_labor_shifts')
    .select('id').eq('staff_id', staff_id).eq('owner_id', auth.ownerId).eq('status', 'active').maybeSingle()
  if (existing) return NextResponse.json({ error: 'Staff member already clocked in' }, { status: 409 })

  const { data, error } = await service.from('restaurant_labor_shifts').insert({
    owner_id:    auth.ownerId,
    location_id: location_id || auth.locationId,
    staff_id, role: role || 'waiter',
    hourly_rate: hourly_rate || 0,
    clock_in:    new Date().toISOString(),
    status:      'active',
    notes,
  }).select(`*, staff:pos_staff!staff_id(id, name, role)`).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ shift: data })
}

// PATCH — clock out or add break time
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { id, action, break_mins, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data: shift } = await service.from('restaurant_labor_shifts')
    .select('*').eq('id', id).eq('owner_id', auth.ownerId).single()
  if (!shift) return NextResponse.json({ error: 'Shift not found' }, { status: 404 })

  if (action === 'clock_out') {
    const clockOut    = new Date()
    const clockIn     = new Date(shift.clock_in)
    const breaks      = break_mins || shift.break_mins || 0
    const totalMins   = (clockOut.getTime() - clockIn.getTime()) / 60000 - breaks
    const totalHours  = Math.max(0, totalMins / 60)
    const totalCost   = totalHours * (shift.hourly_rate || 0)

    const { data, error } = await service.from('restaurant_labor_shifts').update({
      clock_out:   clockOut.toISOString(),
      break_mins:  breaks,
      total_hours: parseFloat(totalHours.toFixed(2)),
      total_cost:  parseFloat(totalCost.toFixed(2)),
      status:      'completed',
      notes:       notes || shift.notes,
    }).eq('id', id).eq('owner_id', auth.ownerId)
      .select(`*, staff:pos_staff!staff_id(id, name, role)`).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ shift: data })
  }

  if (action === 'add_break') {
    const newBreaks = (shift.break_mins || 0) + (break_mins || 0)
    const { data, error } = await service.from('restaurant_labor_shifts')
      .update({ break_mins: newBreaks }).eq('id', id).eq('owner_id', auth.ownerId)
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ shift: data })
  }

  return NextResponse.json({ error: 'action must be: clock_out | add_break' }, { status: 400 })
}
