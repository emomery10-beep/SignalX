import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — kitchen tickets by station (KDS feed)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const station     = searchParams.get('station')     // filter by station
  const location_id = searchParams.get('location_id') || auth.locationId
  const include_done = searchParams.get('include_done') === 'true'

  let query = service.from('restaurant_kitchen_tickets')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('sent_at', { ascending: true }) // oldest first on KDS

  if (!include_done) query = query.in('status', ['pending', 'in_progress'])
  if (station && station !== 'all') query = query.eq('station', station)
  if (location_id) query = query.eq('location_id', location_id)

  const { data, error } = await query.limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Calculate age in seconds for each ticket
  const now = Date.now()
  const tickets = (data || []).map((t: any) => ({
    ...t,
    age_seconds: Math.floor((now - new Date(t.sent_at).getTime()) / 1000),
  }))

  return NextResponse.json({ tickets })
}

// PATCH — update ticket status (start cooking, bump/complete, recall)
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { id, action } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const now = new Date().toISOString()

  if (action === 'start') {
    // Chef picks up the ticket
    await service.from('restaurant_kitchen_tickets').update({
      status: 'in_progress', started_at: now,
    }).eq('id', id).eq('owner_id', auth.ownerId)

    return NextResponse.json({ success: true, status: 'in_progress' })
  }

  if (action === 'bump') {
    // Ticket done — bump it off the screen
    const { data: ticket } = await service.from('restaurant_kitchen_tickets')
      .select('order_id, station').eq('id', id).single()

    await service.from('restaurant_kitchen_tickets').update({
      status: 'done', completed_at: now,
    }).eq('id', id).eq('owner_id', auth.ownerId)

    // Mark order items for this station as ready
    if (ticket?.order_id) {
      await service.from('restaurant_order_items').update({
        status: 'ready', ready_at: now,
      }).eq('order_id', ticket.order_id)
        .eq('station', ticket.station)
        .eq('status', 'sent')

      // Check if all items across all stations are done
      const { data: allTickets } = await service.from('restaurant_kitchen_tickets')
        .select('status').eq('order_id', ticket.order_id)
      const allDone = (allTickets || []).every((t: any) => t.status === 'done')
      if (allDone) {
        await service.from('restaurant_orders').update({
          status: 'all_served', last_item_ready_at: now,
        }).eq('id', ticket.order_id).eq('owner_id', auth.ownerId)
      }
    }
    return NextResponse.json({ success: true, status: 'done' })
  }

  if (action === 'recall') {
    // Bring a done ticket back (e.g. customer complaint)
    const { data } = await service.from('restaurant_kitchen_tickets')
      .update({ status: 'in_progress', completed_at: null })
      .eq('id', id).eq('owner_id', auth.ownerId)
      .select().single()
    await service.from('restaurant_kitchen_tickets')
      .update({ bump_count: (data?.bump_count || 0) + 1 }).eq('id', id)
    return NextResponse.json({ success: true, status: 'in_progress' })
  }

  return NextResponse.json({ error: 'action must be: start | bump | recall' }, { status: 400 })
}
