import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeZakat, validateOverrides, setNisabMetal, ZakatOverrides } from '@/lib/zakat'

export const dynamic = 'force-dynamic'

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — current zakat position, auto-computed from CFO source tables.
// Persists hawl start/reset transitions as a side effect of computeZakat
// (see lib/zakat.ts) — safe to call repeatedly, idempotent once state settles.
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const result = await computeZakat(supabase, user.id)
  return json(result)
}

// POST — recompute with manual overrides and persist a snapshot to the
// zakat_calculations audit log (captures what the user actually saw/edited).
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const body = await request.json().catch(() => ({}))
  const overrides = (body?.overrides || {}) as ZakatOverrides

  const validationError = validateOverrides(overrides)
  if (validationError) return json({ error: validationError }, 400)

  // Switching which metal is selected doesn't need a fresh price check —
  // each metal's last-checked value is already cached independently.
  if (body?.metal === 'gold' || body?.metal === 'silver') {
    await setNisabMetal(supabase, user.id, body.metal)
  }

  const result = await computeZakat(supabase, user.id, overrides)

  const { data: saved, error } = await supabase
    .from('zakat_calculations')
    .insert({
      owner_id: user.id,
      cash_value: result.breakdown.cashValue,
      inventory_value: result.breakdown.inventoryValue,
      receivables_value: result.breakdown.receivablesValue,
      overrides: Object.keys(overrides).length ? overrides : null,
      zakat_base: result.breakdown.zakatBase,
      nisab_value: result.nisab.cachedValue ?? 0,
      hawl_day_count: result.hawl.daysElapsed,
      amount_due: result.amountDue,
      currency: result.breakdown.currency,
    })
    .select('id, calculated_at')
    .single()

  if (error) {
    // Table may not exist yet if the migration hasn't been applied — still
    // return the live calculation so the UI works before the schema lands.
    if (error.code === '42P01') return json({ ...result, note: 'zakat_calculations table not yet created' })
    return json({ error: error.message }, 500)
  }

  return json({ ...result, calculationId: saved.id, calculatedAt: saved.calculated_at })
}
