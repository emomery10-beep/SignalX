import { NextRequest, NextResponse } from 'next/server'
import { resolveOwner } from '@/lib/investor-access'
import { validateTerms, INVESTMENT_TYPES } from '@/lib/investor-terms'
import { investmentReturn } from '@/lib/investor-figures'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const json = (data: any, status = 200) => NextResponse.json(data, { status })
const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))
const today = () => new Date().toISOString().split('T')[0]
const isEmail = (v: unknown): v is string => typeof v === 'string' && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

async function checkedScope(db: any, ownerId: string, body: any) {
  const segment = ['all', 'retail', 'factory'].includes(body.segment) ? body.segment : 'all'
  let factoryId: string | null = null
  if (segment === 'factory' && body.factory_location_id) {
    const { data } = await db.from('pos_locations').select('id, kind').eq('id', body.factory_location_id).eq('owner_id', ownerId).maybeSingle()
    if (!data || data.kind !== 'factory') return { error: 'Choose one of your factories' }
    factoryId = data.id
  }
  return { segment, factoryId }
}

// Owner: every investment, with its worked-out return and payments.
export async function GET() {
  const a = await resolveOwner()
  if (!a.ok) return json({ error: a.error }, a.status)
  const { db, ownerId } = a

  const [{ data: rows }, { data: pays }] = await Promise.all([
    db.from('investor_investments').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false }),
    db.from('investor_payments').select('id, investment_id, paid_at, amount, note').eq('owner_id', ownerId).order('paid_at', { ascending: false }),
  ])
  const t = today()
  const items = await Promise.all((rows || []).map(async (r: any) => {
    const payments = (pays || []).filter((p: any) => p.investment_id === r.id)
    const { result, figures } = await investmentReturn(db, ownerId, r, payments.map((p: any) => ({ paid_at: p.paid_at, amount: Number(p.amount) })), t)
    return { ...r, amount: Number(r.amount), payments, return: result, currency_symbol: figures.currencySymbol }
  }))
  // Equity can't legitimately exceed 100% across holders — surface it to the owner only.
  const equityPct = items.filter((i: any) => i.type === 'equity' && i.status === 'active' && i.segment === 'all')
    .reduce((s: number, i: any) => s + (Number(i.return.lines.find((l: any) => l.label === 'Ownership')?.value) || 0), 0)
  return json({ investments: items, equity_total_pct: Math.round(equityPct * 100) / 100, equity_over_100: equityPct > 100 })
}

export async function POST(req: NextRequest) {
  const a = await resolveOwner()
  if (!a.ok) return json({ error: a.error }, a.status)
  const { db, ownerId } = a
  const body = await req.json().catch(() => ({}))

  if (!isEmail(body.investor_email)) return json({ error: 'Enter the investor\'s email' }, 400)
  if (!INVESTMENT_TYPES.includes(body.type)) return json({ error: 'Choose an investment type' }, 400)
  const amount = Number(body.amount)
  if (!(amount > 0 && amount <= 1e12)) return json({ error: 'Enter the amount invested' }, 400)
  if (!isDate(body.invested_at) || body.invested_at > today()) return json({ error: 'Enter a valid investment date (not in the future)' }, 400)
  const v = validateTerms(body.type, body.terms)
  if (!v.ok) return json({ error: v.error }, 400)
  const scope = await checkedScope(db, ownerId, body)
  if ('error' in scope) return json({ error: scope.error }, 400)

  const { data, error } = await db.from('investor_investments').insert({
    owner_id: ownerId,
    investor_email: body.investor_email.trim().toLowerCase(),
    investor_name: typeof body.investor_name === 'string' ? body.investor_name.trim().slice(0, 120) || null : null,
    type: body.type, amount, invested_at: body.invested_at,
    segment: scope.segment, factory_location_id: scope.factoryId,
    terms: v.terms,
    show_company_figures: body.show_company_figures !== false,
  }).select('id').single()
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true, id: data.id })
}

export async function PATCH(req: NextRequest) {
  const a = await resolveOwner()
  if (!a.ok) return json({ error: a.error }, a.status)
  const { db, ownerId } = a
  const body = await req.json().catch(() => ({}))
  if (!body.id) return json({ error: 'Missing id' }, 400)
  const { data: cur } = await db.from('investor_investments').select('*').eq('id', body.id).eq('owner_id', ownerId).maybeSingle()
  if (!cur) return json({ error: 'Not found' }, 404)

  const patch: Record<string, any> = { updated_at: new Date().toISOString() }
  if (body.investor_email !== undefined) { if (!isEmail(body.investor_email)) return json({ error: 'Enter a valid email' }, 400); patch.investor_email = body.investor_email.trim().toLowerCase(); patch.investor_user_id = null }
  if (body.investor_name !== undefined) patch.investor_name = typeof body.investor_name === 'string' ? body.investor_name.trim().slice(0, 120) || null : null
  if (body.amount !== undefined) { const n = Number(body.amount); if (!(n > 0 && n <= 1e12)) return json({ error: 'Enter a valid amount' }, 400); patch.amount = n }
  if (body.invested_at !== undefined) { if (!isDate(body.invested_at) || body.invested_at > today()) return json({ error: 'Enter a valid date' }, 400); patch.invested_at = body.invested_at }
  if (body.type !== undefined || body.terms !== undefined) {
    const type = body.type ?? cur.type
    if (!INVESTMENT_TYPES.includes(type)) return json({ error: 'Unknown type' }, 400)
    const v = validateTerms(type, body.terms ?? cur.terms)
    if (!v.ok) return json({ error: v.error }, 400)
    patch.type = type; patch.terms = v.terms
  }
  if (body.segment !== undefined) {
    const scope = await checkedScope(db, ownerId, body)
    if ('error' in scope) return json({ error: scope.error }, 400)
    patch.segment = scope.segment; patch.factory_location_id = scope.factoryId
  }
  if (typeof body.show_company_figures === 'boolean') patch.show_company_figures = body.show_company_figures
  if (body.status === 'active' || body.status === 'closed') patch.status = body.status

  const { error } = await db.from('investor_investments').update(patch).eq('id', body.id).eq('owner_id', ownerId)
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const a = await resolveOwner()
  if (!a.ok) return json({ error: a.error }, a.status)
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return json({ error: 'Missing id' }, 400)
  const { error } = await a.db.from('investor_investments').delete().eq('id', id).eq('owner_id', a.ownerId)
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true })
}
