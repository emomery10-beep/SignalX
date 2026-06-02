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

// ─────────────────────────────────────────────────────────────
// GET — list salon clients (search by name / phone)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.view')) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim()

  let query = service
    .from('salon_clients')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('last_visit_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ clients: data })
}

// ─────────────────────────────────────────────────────────────
// POST — create a salon client
// Body: { name, phone?, email?, birthday?, notes? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.create')) return json({ error: 'Access denied' }, 403)

  const body = await req.json()
  const { name, phone, email, birthday, notes } = body

  if (!name || !String(name).trim()) return json({ error: 'name required' }, 400)

  const service = createServiceClient()
  const { data: client, error } = await service
    .from('salon_clients')
    .insert({
      owner_id:    auth.ownerId,
      location_id: auth.locationId || null,
      name:        String(name).trim(),
      phone:       phone    || null,
      email:       email    || null,
      birthday:    birthday || null,
      notes:       notes    || null,
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ client }, 201)
}

// ─────────────────────────────────────────────────────────────
// PATCH — update a salon client
// Body: { id, name?, phone?, email?, birthday?, notes? }
// ─────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.create')) return json({ error: 'Access denied' }, 403)

  const body = await req.json()
  const { id, name, phone, email, birthday, notes } = body

  if (!id) return json({ error: 'id required' }, 400)

  const update: Record<string, unknown> = {}
  if (name !== undefined)     update.name = String(name).trim()
  if (phone !== undefined)    update.phone = phone || null
  if (email !== undefined)    update.email = email || null
  if (birthday !== undefined) update.birthday = birthday || null
  if (notes !== undefined)    update.notes = notes ?? null

  const service = createServiceClient()
  const { data: client, error } = await service
    .from('salon_clients')
    .update(update)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ client })
}
