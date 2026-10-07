// Gives a POS owner their own till (pos_staff) login, once.
//
// The till (/sell) only accepts pos_staff PIN login — with no pos_staff row
// for the owner, nobody (not even the owner) can ever log in to sell. This
// used to happen inside the free-trial grant; the trial is closed, so it now
// runs on its own the first time a POS-persona owner lands on /pos, BEFORE
// payment, so the till login is ready the moment they activate.
//
// The PIN is only ever returned from the call that creates it (only the hash
// is stored), so the caller must show it immediately. Idempotent: if the
// owner already has a staff row, returns null and changes nothing.
import { createServiceClient } from '@/lib/supabase/server'
import { hashPin } from '@/lib/pin'

export async function ensureOwnerPin(
  ownerId: string,
  email: string | null | undefined,
): Promise<string | null> {
  const service = createServiceClient()

  const { data: ownerProfile } = await service
    .from('profiles')
    .select('full_name, phone')
    .eq('id', ownerId)
    .maybeSingle()

  const orFilters = [
    ownerProfile?.phone ? `phone.eq.${ownerProfile.phone}` : null,
    email ? `email.eq.${email}` : null,
  ].filter(Boolean).join(',')

  const { data: existing } = orFilters
    ? await service.from('pos_staff').select('id').eq('owner_id', ownerId).or(orFilters).limit(1)
    : { data: null }
  if (existing && existing.length > 0) return null

  const pin = String(Math.floor(1000 + Math.random() * 9000))
  const { error } = await service.from('pos_staff').insert({
    owner_id: ownerId,
    name: ownerProfile?.full_name || 'Owner',
    phone: ownerProfile?.phone || null,
    email: ownerProfile?.phone ? null : (email || null),
    role: 'manager',
    pin_hash: hashPin(pin),
    active: true,
  })
  if (error) return null // never claim a PIN that wasn't saved
  return pin
}
