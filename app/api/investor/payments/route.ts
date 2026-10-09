import { NextRequest, NextResponse } from 'next/server'
import { resolveOwner } from '@/lib/investor-access'

export const runtime = 'nodejs'
const json = (data: any, status = 200) => NextResponse.json(data, { status })
const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))

// Owner records a payment actually made to an investor (repayment, payout, dividend).
export async function POST(req: NextRequest) {
  const a = await resolveOwner()
  if (!a.ok) return json({ error: a.error }, a.status)
  const body = await req.json().catch(() => ({}))
  const amount = Number(body.amount)
  if (!body.investment_id || !(amount > 0 && amount <= 1e12) || !isDate(body.paid_at)) return json({ error: 'Enter the date and amount paid' }, 400)
  const { data: inv } = await a.db.from('investor_investments').select('id').eq('id', body.investment_id).eq('owner_id', a.ownerId).maybeSingle()
  if (!inv) return json({ error: 'Investment not found' }, 404)
  const { error } = await a.db.from('investor_payments').insert({
    investment_id: inv.id, owner_id: a.ownerId, paid_at: body.paid_at, amount,
    note: typeof body.note === 'string' ? body.note.trim().slice(0, 200) || null : null,
  })
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const a = await resolveOwner()
  if (!a.ok) return json({ error: a.error }, a.status)
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return json({ error: 'Missing id' }, 400)
  const { error } = await a.db.from('investor_payments').delete().eq('id', id).eq('owner_id', a.ownerId)
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true })
}
