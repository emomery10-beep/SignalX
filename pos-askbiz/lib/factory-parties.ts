// Customers (dispatch buyers) and suppliers (farmers, traders) for the Factory money loop, plus the check
// that the money-loop tables exist yet. Every money feature goes through moneySchemaReady() so the app keeps
// working, with those features simply off, until migration 20261024000001 has been applied.
import { clipText, normalisePartyPhone } from '@/lib/pos-input'

let cached: { ready: boolean; at: number } | null = null
const RECHECK_MS = 5 * 60 * 1000

export async function moneySchemaReady(service: any): Promise<boolean> {
  if (cached && (cached.ready || Date.now() - cached.at < RECHECK_MS)) return cached.ready
  const a = await service.from('pos_factory_captures').select('party_id, due_date').limit(1)
  const b = await service.from('pos_factory_payments').select('id').limit(1)
  cached = { ready: !a.error && !b.error, at: Date.now() }
  return cached.ready
}

export type PartyKind = 'customer' | 'supplier'

/** Finds a party by name (case-insensitive) or creates it; fills in a phone the first time one is known. */
export async function findOrCreateParty(service: any, ownerId: string, kind: PartyKind, rawName: unknown, rawPhone?: unknown): Promise<string | null> {
  const name = clipText(rawName, 120)
  if (!name) return null
  const phone = normalisePartyPhone(rawPhone)
  const { data: existing } = await service.from('pos_factory_parties').select('id, phone')
    .eq('owner_id', ownerId).eq('kind', kind).ilike('name', name.replace(/[%_]/g, m => '\\' + m)).maybeSingle()
  if (existing) {
    if (phone && !existing.phone) await service.from('pos_factory_parties').update({ phone }).eq('id', existing.id)
    return existing.id
  }
  const { data: created, error } = await service.from('pos_factory_parties')
    .insert({ owner_id: ownerId, kind, name, phone: phone || null }).select('id').single()
  if (!error) return created.id
  // Lost a race with a concurrent insert of the same name: read the winner.
  const { data: again } = await service.from('pos_factory_parties').select('id').eq('owner_id', ownerId).eq('kind', kind).ilike('name', name).maybeSingle()
  return again?.id || null
}
