// Business figures for ONE investment's scope, from invested_at to today.
// Uses the same snapshot builder as the CFO so investor numbers always agree
// with what the owner sees.
import type { SupabaseClient } from '@supabase/supabase-js'
import { buildCfoSnapshot } from '@/lib/cfo-snapshot'
import { computeInvestorReturn, type InvestorReturn, type PaymentInput, type InvestmentInput } from '@/lib/investor-returns'

export interface ScopedInvestment extends InvestmentInput {
  segment: 'all' | 'retail' | 'factory'
  factory_location_id: string | null
}

export interface ScopeFigures {
  revenue: number
  grossProfit: number
  netProfit: number
  fixedCosts: number
  complete: boolean
  notes: string[]
  currencySymbol: string
}

const cache = new WeakMap<object, Map<string, Promise<ScopeFigures>>>()

export function scopeFigures(db: SupabaseClient, ownerId: string, inv: ScopedInvestment, today: string): Promise<ScopeFigures> {
  const key = `${inv.segment}|${inv.factory_location_id || ''}|${inv.invested_at}|${today}`
  let m = cache.get(db)
  if (!m) { m = new Map(); cache.set(db, m) }
  const hit = m.get(key)
  if (hit) return hit
  const p = (async (): Promise<ScopeFigures> => {
    const params = new URLSearchParams({ from: inv.invested_at, to: today, segment: inv.segment })
    if (inv.segment === 'factory' && inv.factory_location_id) params.set('factory', inv.factory_location_id)
    const snap: any = await buildCfoSnapshot({
      supabase: db, ownerId, user: { user_metadata: {}, phone: undefined } as any, isOwner: false, params,
      now: new Date(today + 'T12:00:00Z'),
    })
    const notes: string[] = []
    let complete = true
    if (snap.segment && snap.segment.expenses_allocated === false) {
      notes.push('Figures for this part of the business are before shared expenses (rent, payroll, utilities), so profit may be higher than the business total.')
    }
    for (const f of snap.segment?.factory_costs || []) if (!f.complete) complete = false
    if (snap.data_quality?.truncated) { complete = false; notes.push('The period is very long, so some sales may be missing from these totals.') }
    if ((snap.segment?.unpriced_dispatches || 0) > 0) notes.push('Some factory dispatches are still awaiting a price and are not counted yet.')
    return {
      revenue: snap.totals.revenue, grossProfit: snap.totals.gross_profit, netProfit: snap.totals.net_profit,
      fixedCosts: snap.totals.fixed_costs, complete, notes, currencySymbol: snap.currency_symbol,
    }
  })()
  m.set(key, p)
  return p
}

export async function investmentReturn(
  db: SupabaseClient, ownerId: string, inv: ScopedInvestment, payments: PaymentInput[], today: string,
): Promise<{ result: InvestorReturn; figures: ScopeFigures }> {
  const figures = await scopeFigures(db, ownerId, inv, today)
  const result = computeInvestorReturn(inv, { revenue: figures.revenue, netProfit: figures.netProfit, complete: figures.complete }, payments, today)
  result.notes.push(...figures.notes)
  return { result, figures }
}
