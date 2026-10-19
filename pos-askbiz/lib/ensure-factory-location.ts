/**
 * Every factory account needs one `pos_locations` row with kind='factory'.
 *
 * Production, stock, the CFO figures and /intelligence all read a factory's captures through that row. A manufacturer
 * who registered but never created one would log captures with no factory attached, and they would never reach
 * the CFO or Intelligence pages. This creates the default factory from the owner's registration answers
 * (the factory type they picked, the business name) the first time one is needed.
 *
 * Returns the factory's id when the owner has exactly one (existing or just created), else null (none wanted, or
 * several — the caller must then be told which one).
 *
 * NOTE: identical copy lives in lib/ensure-factory-location.ts (root app) — the two apps deploy separately.
 */
export async function ensureFactoryLocation(service: any, ownerId: string): Promise<string | null> {
  const { data: existing } = await service
    .from('pos_locations').select('id').eq('owner_id', ownerId).eq('kind', 'factory').eq('is_active', true).limit(2)
  if (existing && existing.length > 0) return existing.length === 1 ? existing[0].id : null

  const { data: prof } = await service
    .from('profiles').select('business_name, business_type, factory_type').eq('id', ownerId).maybeSingle()
  if (!prof || (prof.business_type !== 'manufacturer' && !prof.factory_type)) return null

  const row = {
    owner_id: ownerId, name: 'Main factory', kind: 'factory', factory_type: prof.factory_type || 'other',
  }
  const { data: created, error } = await service.from('pos_locations').insert(row).select('id').single()
  if (!error && created) return created.id
  // Lost a race with another request (unique name) or the row exists inactive: use what is there.
  const { data: again } = await service
    .from('pos_locations').select('id').eq('owner_id', ownerId).eq('kind', 'factory').limit(2)
  return again && again.length === 1 ? again[0].id : null
}
