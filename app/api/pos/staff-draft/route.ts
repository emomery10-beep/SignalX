import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { hashPin } from '@/lib/pin'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// GET — list this owner's staff drafts (never returns pin_hash)
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_staff_drafts')
    .select('id, name, role, phone, email, created_at')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ drafts: data || [] })
}

// POST — add a draft team member. Setup action (not payment-gated).
// Body: { name, role?, phone?, email?, pin }  (one of phone/email required)
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const name = String(body.name || '').trim()
  const role = String(body.role || 'cashier').trim() || 'cashier'
  const phone = body.phone ? String(body.phone).trim() : null
  const email = body.email ? String(body.email).trim().toLowerCase() : null
  const pin = String(body.pin || '')

  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  if (!phone && !email) return NextResponse.json({ error: 'A phone or email is required' }, { status: 400 })
  if (!/^\d{4}$/.test(pin)) return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 })

  const service = createServiceClient()

  // Guard against a credential that already belongs to real staff or another
  // draft for this owner (so it can actually be provisioned later).
  const dup = await staffCredentialExists(service, ownerId, phone, email)
  if (dup) return NextResponse.json({ error: 'That phone or email is already used by another team member' }, { status: 409 })

  const { data, error } = await service
    .from('pos_staff_drafts')
    .insert({ owner_id: ownerId, name, role, phone, email, pin_hash: hashPin(pin) })
    .select('id, name, role, phone, email')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ draft: data }, { status: 201 })
}

// DELETE ?id= — remove a draft
export async function DELETE(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const service = createServiceClient()
  const { error } = await service.from('pos_staff_drafts').delete().eq('id', id).eq('owner_id', ownerId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Whether a phone/email is already taken by real staff or an existing draft
// for this owner. Checked per-field so either identifier collides correctly.
async function staffCredentialExists(
  service: ReturnType<typeof createServiceClient>,
  ownerId: string,
  phone: string | null,
  email: string | null,
): Promise<boolean> {
  for (const table of ['pos_staff', 'pos_staff_drafts'] as const) {
    if (phone) {
      const { data } = await service.from(table).select('id').eq('owner_id', ownerId).eq('phone', phone).limit(1)
      if (data && data.length) return true
    }
    if (email) {
      const { data } = await service.from(table).select('id').eq('owner_id', ownerId).eq('email', email).limit(1)
      if (data && data.length) return true
    }
  }
  return false
}
