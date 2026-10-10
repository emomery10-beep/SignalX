import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { getUserLocale } from '@/lib/get-currency'
import { factoryCostDefaultsFor } from '@/lib/factory-cost-defaults'

const json = (data: any, status = 200) => NextResponse.json(data, { status })
const money = (v: unknown) => { const n = Number(v); return Number.isFinite(n) && n >= 0 && n <= 1e9 ? n : null }

// Labour / electricity / overhead assumptions for ONE factory, shared by the
// Factory tab and the CFO. No saved row → the country default (Kenya is
// pre-filled; every other country is unset, never another country's rates).
async function resolveFactory(auth: { ownerId: string; locationId: string | null }, req: NextRequest) {
  const locationId = auth.locationId || new URL(req.url).searchParams.get('location_id')
  if (!locationId) return null
  const service = createServiceClient()
  const { data } = await service.from('pos_locations').select('id, kind, factory_type').eq('id', locationId).eq('owner_id', auth.ownerId).maybeSingle()
  if (!data || data.kind !== 'factory') return null
  // The branch's own type wins; 'other'/unset falls back to the owner's profile type.
  let type: string | null = data.factory_type || null
  if (!type || type === 'other') {
    const { data: prof } = await service.from('profiles').select('factory_type').eq('id', auth.ownerId).maybeSingle()
    type = (prof as any)?.factory_type || type
  }
  return { id: locationId as string, type }
}

export async function GET(req: NextRequest) {
  try {
    // Wage rates are sensitive — managers/owners only, same bar as saving them.
    const auth = await resolvePosAuth(req, 'manager')
    if (!auth) return json({ error: 'Unauthorised' }, 401)
    const factory = await resolveFactory(auth, req)
    const locationId = factory?.id || null

    const service = createServiceClient()
    const [{ data: row }, locale] = await Promise.all([
      locationId
        ? service.from('pos_factory_cost_settings').select('staff_per_day, electricity_per_day, overhead, electricity_basis, updated_at').eq('location_id', locationId).maybeSingle()
        : Promise.resolve({ data: null }),
      getUserLocale(service, auth.ownerId),
    ])
    const defaults = factoryCostDefaultsFor(locale.countryCode, factory?.type)
    if (row) {
      return json({
        saved: true, country_code: locale.countryCode, currency: locale.currency,
        settings: { configured: true, staffPerDay: Number(row.staff_per_day), electricityPerDay: Number(row.electricity_per_day), overhead: Number(row.overhead) },
        electricity_basis: row.electricity_basis, updated_at: row.updated_at,
      })
    }
    return json({ saved: false, country_code: locale.countryCode, currency: locale.currency, settings: defaults, electricity_basis: null })
  } catch (e) {
    console.error('cost-settings GET error:', e)
    return json({ error: 'Server error' }, 500)
  }
}

// Body: { location_id?, staff_per_day, electricity_per_day, overhead?, electricity_basis? }
export async function POST(req: NextRequest) {
  try {
    const auth = await resolvePosAuth(req, 'manager')
    if (!auth) return json({ error: 'Unauthorised' }, 401)
    const body = await req.json().catch(() => ({}))
    const locationId = auth.locationId || body.location_id || null
    if (!locationId) return json({ error: 'Select a factory' }, 400)
    const service = createServiceClient()
    const { data: loc } = await service.from('pos_locations').select('id, kind').eq('id', locationId).eq('owner_id', auth.ownerId).maybeSingle()
    if (!loc || loc.kind !== 'factory') return json({ error: 'Not a factory' }, 400)

    const staff = money(body.staff_per_day)
    const elec = money(body.electricity_per_day)
    const overhead = body.overhead === undefined ? 0 : money(body.overhead)
    if (staff == null || elec == null || overhead == null) return json({ error: 'Enter valid amounts' }, 400)
    let basis = body.electricity_basis && typeof body.electricity_basis === 'object' ? body.electricity_basis : null
    // A save from a screen that doesn't know about the cost cycle or pack size (the pos-askbiz rates page) must not
    // wipe them. Keep what is already saved; a stale labour entry is dropped when the new save didn't restate it,
    // because staff_per_day just changed and the old entry would no longer match it.
    const { data: prev } = await service.from('pos_factory_cost_settings').select('electricity_basis').eq('location_id', locationId).maybeSingle()
    const prevBasis = prev?.electricity_basis && typeof prev.electricity_basis === 'object' ? { ...(prev.electricity_basis as Record<string, unknown>) } : {}
    if (!(basis && 'labour' in basis)) delete (prevBasis as any).labour
    basis = { ...prevBasis, ...(basis || {}) }
    if (Object.keys(basis).length === 0) basis = null

    const { error } = await service.from('pos_factory_cost_settings').upsert({
      location_id: locationId, owner_id: auth.ownerId,
      staff_per_day: staff, electricity_per_day: elec, overhead,
      electricity_basis: basis, updated_at: new Date().toISOString(),
    }, { onConflict: 'location_id' })
    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  } catch (e) {
    console.error('cost-settings POST error:', e)
    return json({ error: 'Server error' }, 500)
  }
}
