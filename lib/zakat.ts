import { SupabaseClient } from '@supabase/supabase-js'

// Hawl (the qualifying holding period) is one Hijri year. A Hijri year has no
// fixed Gregorian date, but its elapsed real-world duration is stable at
// ~354-355 days regardless of which lunar year it is — so counting plain
// calendar days from the start date and comparing against 355 is equivalent
// to tracking the Hijri calendar, without needing a Hijri conversion library.
// All dates in/out of this module are Gregorian.
const HAWL_DAYS = 355

export interface ZakatBreakdown {
  cashValue: number
  inventoryValue: number
  receivablesValue: number
  payablesValue: number
  zakatBase: number
  currency: string
}

export interface HawlStatus {
  startDate: string | null
  daysElapsed: number | null
  daysRemaining: number | null
  dueDate: string | null
  active: boolean
}

export interface NisabInfo {
  metal: 'gold' | 'silver'
  cachedValue: number | null
  checkedAt: string | null
}

export interface ZakatResult {
  breakdown: ZakatBreakdown
  hawl: HawlStatus
  nisab: NisabInfo
  nisabKnown: boolean
  aboveNisab: boolean
  due: boolean
  amountDue: number
}

export interface ZakatOverrides {
  cashValue?: number
  inventoryValue?: number
  receivablesValue?: number
  payablesValue?: number
}

/** Returns an error message if any override is not a finite non-negative number, else null. */
export function validateOverrides(overrides: ZakatOverrides): string | null {
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      return `${key} must be a non-negative number`
    }
  }
  return null
}

/**
 * Computes the current zakat position for a business from the same source
 * tables the CFO dashboard reads (inventory at retail value, cfo_receivables,
 * cost_profile_overrides for cash) — no dependency on the CFO snapshot route
 * itself, since none of these three fields go through its revenue/COGS
 * source-dedup logic (that guard only applies to unified_data vs
 * pos_transactions, which zakat doesn't use).
 *
 * Also persists hawl start/reset transitions as a side effect (there is no
 * scheduled job in this app to do it otherwise, and continuous tracking was
 * the explicit design goal) — idempotent, so repeat calls are a no-op once
 * state matches.
 */
export async function computeZakat(
  supabase: SupabaseClient,
  userId: string,
  overrides: ZakatOverrides = {}
): Promise<ZakatResult> {
  const [{ data: profile }, { data: overridesRow }, { data: products }, { data: receivableRows }] = await Promise.all([
    supabase
      .from('profiles')
      .select('currency_symbol, zakat_hawl_start_date, zakat_nisab_metal, zakat_nisab_cached_value, zakat_nisab_checked_at')
      .eq('id', userId)
      .single(),
    supabase
      .from('cost_profile_overrides')
      .select('overrides')
      .eq('user_id', userId)
      .single(),
    supabase
      .from('inventory')
      .select('sale_price, stock_qty')
      .eq('owner_id', userId)
      .eq('active', true)
      .limit(500),
    supabase
      .from('cfo_receivables')
      .select('type, amount')
      .eq('user_id', userId),
  ])

  const currency = profile?.currency_symbol || '£'
  const cfoOverrides = (overridesRow?.overrides || {}) as Record<string, any>
  const autoCash = cfoOverrides.cash_balance || cfoOverrides.cashBalance || 0
  const autoInventory = (products || []).reduce((s: number, p: any) => s + ((p.sale_price || 0) * (p.stock_qty || 0)), 0)

  const rows = receivableRows || []
  // All receivable/payable rows count regardless of aging status — cfo_receivables.status
  // is an aging bucket (current/overdue_30/60/90), not a collectibility flag, so there is
  // no "doubtful debt" signal in this schema to exclude on. This mirrors exactly what the
  // CFO snapshot's own totals (receivables_summary) already include.
  const autoReceivables = rows.filter((r: any) => r.type === 'receivable').reduce((s: number, r: any) => s + (r.amount || 0), 0)
  const autoPayables = rows.filter((r: any) => r.type === 'payable').reduce((s: number, r: any) => s + (r.amount || 0), 0)

  const cashValue = overrides.cashValue ?? autoCash
  const inventoryValue = overrides.inventoryValue ?? autoInventory
  const receivablesValue = overrides.receivablesValue ?? autoReceivables
  const payablesValue = overrides.payablesValue ?? autoPayables

  const zakatBase = Math.max(0, cashValue + inventoryValue + receivablesValue - payablesValue)

  // PostgREST returns `numeric` columns as strings to avoid float precision
  // loss in transit — coerce explicitly so the NisabInfo contract (number)
  // is actually true at runtime, not just at the type level.
  const nisab: NisabInfo = {
    metal: (profile?.zakat_nisab_metal === 'gold' ? 'gold' : 'silver'),
    cachedValue: profile?.zakat_nisab_cached_value != null ? Number(profile.zakat_nisab_cached_value) : null,
    checkedAt: profile?.zakat_nisab_checked_at ?? null,
  }
  const nisabKnown = nisab.cachedValue != null
  const aboveNisab = nisabKnown && zakatBase >= (nisab.cachedValue as number)

  // --- Hawl state transition (only once nisab is actually known) ---
  let hawlStartDate: string | null = profile?.zakat_hawl_start_date || null
  const today = new Date().toISOString().split('T')[0]

  if (nisabKnown) {
    if (aboveNisab && !hawlStartDate) {
      // .is('zakat_hawl_start_date', null) makes this race-safe against a concurrent
      // GET doing the same transition — only the first writer's row matches and
      // updates. hawlStartDate only advances locally if the write actually landed,
      // so a failed/lost-race write can't make the response claim a persisted
      // state that isn't really in the DB.
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({ zakat_hawl_start_date: today })
        .eq('id', userId)
        .is('zakat_hawl_start_date', null)
        .select('zakat_hawl_start_date')
        .maybeSingle()
      if (!error && updated) hawlStartDate = updated.zakat_hawl_start_date
    } else if (!aboveNisab && hawlStartDate) {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({ zakat_hawl_start_date: null })
        .eq('id', userId)
        .not('zakat_hawl_start_date', 'is', null)
        .select('zakat_hawl_start_date')
        .maybeSingle()
      if (!error) hawlStartDate = updated ? updated.zakat_hawl_start_date : hawlStartDate
    }
  }

  let daysElapsed: number | null = null
  let daysRemaining: number | null = null
  let dueDate: string | null = null
  let hawlComplete = false

  if (hawlStartDate) {
    const startMs = new Date(hawlStartDate + 'T00:00:00Z').getTime()
    daysElapsed = Math.floor((Date.now() - startMs) / 86400000)
    daysRemaining = Math.max(0, HAWL_DAYS - daysElapsed)
    dueDate = new Date(startMs + HAWL_DAYS * 86400000).toISOString().split('T')[0]
    hawlComplete = daysElapsed >= HAWL_DAYS
  }

  const due = aboveNisab && hawlComplete
  const amountDue = due ? Math.round(zakatBase * 0.025 * 100) / 100 : 0

  return {
    breakdown: { cashValue, inventoryValue, receivablesValue, payablesValue, zakatBase, currency },
    hawl: { startDate: hawlStartDate, daysElapsed, daysRemaining, dueDate, active: !!hawlStartDate },
    nisab,
    nisabKnown,
    aboveNisab,
    due,
    amountDue,
  }
}
