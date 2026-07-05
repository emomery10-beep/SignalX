import { createServiceClient } from '@/lib/supabase/server'

/**
 * Turn a paid owner's staff drafts ("ghosts") into real pos_staff accounts.
 *
 * Called from every place a payment can confirm — the payment webhooks
 * (reliable, browser-independent), the activate-page poll, and a load-time
 * safety net — so provisioning never depends on a tab being open.
 *
 * Safe to call repeatedly: idempotent. Only acts when pos_enabled is true.
 * Provisions oldest-first up to the paid capacity (pos_seat_count - 1, since
 * seat #1 is the owner/operator). Insert-then-delete per draft, so a failure
 * never loses a draft — it stays and is retried next time.
 */
export async function provisionStaffDrafts(ownerId: string): Promise<{ provisioned: number; remaining: number }> {
  const service = createServiceClient()

  const { data: profile } = await service
    .from('profiles')
    .select('pos_enabled, pos_seat_count')
    .eq('id', ownerId)
    .maybeSingle()

  // Only provision once POS is actually active (paid/trialing).
  if (!profile?.pos_enabled) {
    return { provisioned: 0, remaining: await draftCount(service, ownerId) }
  }

  const seatCount = Number(profile.pos_seat_count) || 0

  const { count: activeStaff } = await service
    .from('pos_staff')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('active', true)

  const capacity = Math.max(0, seatCount - 1 - (activeStaff ?? 0))
  if (capacity <= 0) {
    return { provisioned: 0, remaining: await draftCount(service, ownerId) }
  }

  const { data: drafts } = await service
    .from('pos_staff_drafts')
    .select('id, name, role, phone, email, pin_hash')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true })
    .limit(capacity)

  if (!drafts || drafts.length === 0) {
    return { provisioned: 0, remaining: 0 }
  }

  let provisioned = 0
  for (const d of drafts) {
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
      // Unique collision (a real staff row with the same credential already
      // exists): drop the now-redundant draft and move on.
      if (insErr.code === '23505') {
        await service.from('pos_staff_drafts').delete().eq('id', d.id).eq('owner_id', ownerId)
      }
      continue
    }
    await service.from('pos_staff_drafts').delete().eq('id', d.id).eq('owner_id', ownerId)
    provisioned += 1
  }

  return { provisioned, remaining: await draftCount(service, ownerId) }
}

async function draftCount(service: ReturnType<typeof createServiceClient>, ownerId: string): Promise<number> {
  const { count } = await service
    .from('pos_staff_drafts')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
  return count ?? 0
}
