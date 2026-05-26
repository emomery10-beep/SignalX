import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// GET — reservations list for a date range
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'cashier')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days   = parseInt(searchParams.get('days') || '7')
  const status = searchParams.get('status') // optional filter

  const from = new Date()
  from.setDate(from.getDate() - 1) // include yesterday's late sittings
  from.setHours(0, 0, 0, 0)
  const to = new Date()
  to.setDate(to.getDate() + days)
  to.setHours(23, 59, 59, 999)

  const service = createServiceClient()

  let query = service
    .from('restaurant_reservations')
    .select(`
      id, customer_name, customer_phone, customer_email,
      covers, reserved_at, duration_mins, status, notes, created_at,
      table_id,
      restaurant_tables(id, name, section, capacity)
    `)
    .eq('owner_id', auth.ownerId)
    .gte('reserved_at', from.toISOString())
    .lte('reserved_at', to.toISOString())
    .order('reserved_at', { ascending: true })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Today's covers count
  const todayStart = new Date(); todayStart.setHours(0,0,0,0)
  const todayEnd   = new Date(); todayEnd.setHours(23,59,59,999)
  const todayRes   = (data || []).filter((r: any) => {
    const d = new Date(r.reserved_at)
    return d >= todayStart && d <= todayEnd && r.status !== 'cancelled' && r.status !== 'no_show'
  })
  const todayCovers = todayRes.reduce((s: number, r: any) => s + (r.covers || 0), 0)

  return NextResponse.json({
    reservations: data || [],
    summary: {
      today_bookings: todayRes.length,
      today_covers:   todayCovers,
      upcoming:       (data || []).filter((r: any) => r.status === 'confirmed' || r.status === 'pending').length,
    },
  })
}

// POST — create reservation
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'cashier')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { customer_name, customer_phone, customer_email, covers, reserved_at, duration_mins, table_id, notes } = await req.json()

  if (!customer_name || !reserved_at || !covers) {
    return NextResponse.json({ error: 'customer_name, reserved_at and covers are required' }, { status: 400 })
  }

  const service = createServiceClient()

  const { data, error } = await service
    .from('restaurant_reservations')
    .insert({
      owner_id:      auth.ownerId,
      location_id:   auth.locationId || null,
      customer_name,
      customer_phone: customer_phone || null,
      customer_email: customer_email || null,
      covers:         parseInt(covers) || 2,
      reserved_at,
      duration_mins:  duration_mins || 90,
      table_id:       table_id || null,
      notes:          notes || null,
      status:         'confirmed',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reservation: data })
}

// PATCH — update status / assign table
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'cashier')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, status, table_id, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const service = createServiceClient()

  const updates: Record<string, any> = {}
  if (status)   updates.status   = status
  if (table_id !== undefined) updates.table_id = table_id || null
  if (notes !== undefined)    updates.notes    = notes

  const { data, error } = await service
    .from('restaurant_reservations')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If marking as seated, try to update the table status to occupied
  if (status === 'seated' && data.table_id) {
    await service
      .from('restaurant_tables')
      .update({ status: 'occupied', seated_at: new Date().toISOString() })
      .eq('id', data.table_id)
      .eq('owner_id', auth.ownerId)
  }

  return NextResponse.json({ reservation: data })
}

// DELETE — cancel reservation
export async function DELETE(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'cashier')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const service = createServiceClient()

  const { error } = await service
    .from('restaurant_reservations')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('owner_id', auth.ownerId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
