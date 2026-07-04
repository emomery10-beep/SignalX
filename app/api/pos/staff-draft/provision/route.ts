import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner, posEntitled } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// POST — turn staff drafts into real staff accounts after payment.
// Gated on pos_enabled (this creates seat-consuming accounts, only valid
// once paid). Idempotent: provisions oldest-first up to the paid capacity,
// leaves any excess drafts in place. Seat model: 1 seat is the owner/
// operator, so staff capacity = pos_seat_count - 1.
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!(await posEntitled(ownerId))) {
    return NextResponse.json({ error: 'POS is not active', code: 'pos_not_active' }, { status: 402 })
  }

  const service = createServiceClient()

  const { data: profile } = await service
    .from('profiles')
    .select('pos_seat_count')
    .eq('id', ownerId)
    .maybeSingle()
  const seatCount = Number(profile?.pos_seat_count) || 0

  // How many staff seats are available beyond the owner's own seat.
  const { count: activeStaff } = await service
    .from('pos_staff')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('active', true)
  const capacity = Math.max(0, seatCount - 1 - (activeStaff ?? 0))

  if (capacity <= 0) {
    return NextResponse.json({ provisioned: 0, remaining_drafts: await draftCount(service, ownerId) })
  }

  const { data: drafts } = await service
    .from('pos_staff_drafts')
    .select('id, name, role, phone, email, pin_hash')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true })
    .limit(capacity)

  if (!drafts || drafts.length === 0) {
    return NextResponse.json({ provisioned: 0, remaining_drafts: 0 })
  }

  let provisioned = 0
  for (const d of drafts) {
    // Insert the real staff row, then delete the draft — only on success, so
    // a failure never loses the draft (it stays and can be retried).
    const { error: insErr } = await service.from('pos_staff').insert({
      owner_id: ownerId,
      name: d.name,
      role: d.role,
      phone: d.phone,
      email: d.email,
      pin_hash: d.pin_hash,
      active: true,
    })
    if (insErr) {
      // e.g. a unique-collision with a real staff row created meanwhile —
      // drop the now-redundant draft so it doesn't block, and continue.
      if (insErr.code === '23505') { await service.from('pos_staff_drafts').delete().eq('id', d.id).eq('owner_id', ownerId) }
      continue
    }
    await service.from('pos_staff_drafts').delete().eq('id', d.id).eq('owner_id', ownerId)
    provisioned += 1
  }

  return NextResponse.json({ provisioned, remaining_drafts: await draftCount(service, ownerId) })
}

async function draftCount(service: ReturnType<typeof createServiceClient>, ownerId: string): Promise<number> {
  const { count } = await service
    .from('pos_staff_drafts')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
  return count ?? 0
}
