import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sym = await getCurrencySymbol(supabase, user.id)

  const { data: items } = await supabase
    .from('cfo_receivables')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })

  return NextResponse.json({ items: items || [], currency_symbol: sym })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, counterparty, amount, due_date, notes } = body

  if (!counterparty || !amount || !due_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const now = new Date()
  const due = new Date(due_date)
  const days_overdue = Math.max(0, Math.ceil((now.getTime() - due.getTime()) / 86400000))
  const status = days_overdue <= 0 ? 'current'
    : days_overdue <= 30 ? 'overdue_30'
    : days_overdue <= 60 ? 'overdue_60' : 'overdue_90'

  const { data, error } = await supabase
    .from('cfo_receivables')
    .insert({
      user_id: user.id,
      type: type || 'receivable',
      counterparty,
      amount: Number(amount),
      due_date,
      days_overdue,
      status,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await supabase
    .from('cfo_receivables')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
