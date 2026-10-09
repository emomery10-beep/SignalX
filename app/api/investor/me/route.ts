import { NextResponse } from 'next/server'
import { resolveInvestor } from '@/lib/investor-access'
import { investmentReturn } from '@/lib/investor-figures'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// The signed-in investor's OWN investment(s) and what they've earned. Rows are
// selected strictly by investor_user_id = caller; the response contains no other
// investor's amount, name, email or share, no totals raised, no owner ids.
export async function GET() {
  const a = await resolveInvestor()
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status })
  const { db, user, ownerId } = a

  const { data: rows } = await db.from('investor_investments').select('*')
    .eq('investor_user_id', user.id).eq('owner_id', ownerId).order('invested_at', { ascending: true })
  if (!rows || rows.length === 0) return NextResponse.json({ investments: [], currency_symbol: null })

  const ids = rows.map((r: any) => r.id)
  const { data: pays } = await db.from('investor_payments').select('investment_id, paid_at, amount, note')
    .in('investment_id', ids).order('paid_at', { ascending: false })
  const factoryIds = Array.from(new Set(rows.map((r: any) => r.factory_location_id).filter(Boolean)))
  const { data: locs } = factoryIds.length
    ? await db.from('pos_locations').select('id, name').in('id', factoryIds).eq('owner_id', ownerId)
    : { data: [] as any[] }

  const today = new Date().toISOString().split('T')[0]
  let currency: string | null = null
  const investments = await Promise.all(rows.map(async (r: any) => {
    const payments = (pays || []).filter((p: any) => p.investment_id === r.id)
    const { result, figures } = await investmentReturn(db, ownerId, r, payments.map((p: any) => ({ paid_at: p.paid_at, amount: Number(p.amount) })), today)
    currency = figures.currencySymbol
    const scopeLabel = r.segment === 'retail' ? 'Retail' : r.segment === 'factory'
      ? (locs?.find((l: any) => l.id === r.factory_location_id)?.name || 'Factory') : 'Whole business'
    return {
      id: r.id, type: r.type, amount: Number(r.amount), invested_at: r.invested_at, status: r.status,
      scope: scopeLabel, terms: r.terms,
      payments: payments.map((p: any) => ({ paid_at: p.paid_at, amount: Number(p.amount), note: p.note })),
      return: result,
      // Business headline only when the owner allows it for this investor.
      company: r.show_company_figures
        ? { since: r.invested_at, revenue: figures.revenue, gross_profit: figures.grossProfit, net_profit: figures.netProfit }
        : null,
    }
  }))
  return NextResponse.json({ investments, currency_symbol: currency })
}
