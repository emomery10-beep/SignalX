import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

const APPOINTMENT_SELECT = `
  *,
  client:salon_clients!client_id(id, name, phone),
  stylist:pos_staff!stylist_id(id, name)
`

// ─────────────────────────────────────────────────────────────
// GET — list appointments (filter by date / status / client)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.view')) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const date      = searchParams.get('date')      // YYYY-MM-DD
  const status    = searchParams.get('status')
  const client_id = searchParams.get('client_id')

  let query = service
    .from('salon_appointments')
    .select(APPOINTMENT_SELECT)
    .eq('owner_id', auth.ownerId)
    .order('scheduled_at', { ascending: false })

  if (date) {
    query = query
      .gte('scheduled_at', `${date}T00:00:00.000Z`)
      .lt('scheduled_at',  `${date}T23:59:59.999Z`)
  }
  if (status)    query = query.eq('status', status)
  if (client_id) query = query.eq('client_id', client_id)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ appointments: data })
}

// ─────────────────────────────────────────────────────────────
// POST — create an appointment
// Body: { client_id?, stylist_id?, service_name, service_category?,
//         scheduled_at?, duration_mins?, price?, notes? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.create')) return json({ error: 'Access denied' }, 403)

  const body = await req.json()
  const { client_id, stylist_id, service_name, service_category, scheduled_at, duration_mins, price, notes } = body

  if (!service_name || !String(service_name).trim()) return json({ error: 'service_name required' }, 400)

  const service = createServiceClient()
  const { data: appointment, error } = await service
    .from('salon_appointments')
    .insert({
      owner_id:         auth.ownerId,
      location_id:      auth.locationId || null,
      client_id:        client_id  || null,
      stylist_id:       stylist_id || null,
      service_name:     String(service_name).trim(),
      service_category: service_category || null,
      scheduled_at:     scheduled_at || new Date().toISOString(),
      duration_mins:    duration_mins ?? 60,
      price:            price ?? 0,
      notes:            notes || null,
    })
    .select(APPOINTMENT_SELECT)
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ appointment }, 201)
}

// ─────────────────────────────────────────────────────────────
// PATCH — update an appointment
// Body: { id, status?, client_id?, stylist_id?, service_name?,
//         service_category?, scheduled_at?, duration_mins?, price?, notes? }
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.create')) return json({ error: 'Access denied' }, 403)

  const body = await req.json()
  const { id, status, client_id, stylist_id, service_name, service_category, scheduled_at, duration_mins, price, notes } = body

  if (!id) return json({ error: 'id required' }, 400)

  const update: Record<string, unknown> = {}
  if (status !== undefined)           update.status = status
  if (client_id !== undefined)        update.client_id = client_id || null
  if (stylist_id !== undefined)       update.stylist_id = stylist_id || null
  if (service_name !== undefined)     update.service_name = String(service_name).trim()
  if (service_category !== undefined) update.service_category = service_category || null
  if (scheduled_at !== undefined)     update.scheduled_at = scheduled_at
  if (duration_mins !== undefined)    update.duration_mins = duration_mins
  if (price !== undefined)            update.price = price
  if (notes !== undefined)            update.notes = notes ?? null

  const service = createServiceClient()
  const { data: appointment, error } = await service
    .from('salon_appointments')
    .update(update)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select(APPOINTMENT_SELECT)
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ appointment })
}
