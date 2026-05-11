import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { transaction_id, item_ids, reason, full_refund } = await req.json()
  if (!transaction_id) return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  if (!reason)         return NextResponse.json({ error: 'reason required' }, { status: 400 })

  // Verify transaction belongs to this owner
  const { data: tx, error: txErr } = await supabase
    .from('pos_transactions')
    .select('*, pos_items(*)')
    .eq('id', transaction_id)
    .eq('owner_id', user.id)
    .single()

  if (txErr || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  if (tx.status === 'refunded') return NextResponse.json({ error: 'Already fully refunded' }, { status: 400 })

  const now = new Date().toISOString()

  if (full_refund || !item_ids?.length) {
    // Full refund — mark all items and transaction
    const itemIds = (tx.pos_items as { id: string }[]).map((i) => i.id)
    await supabase
      .from('pos_items')
      .update({ refunded: true, refunded_at: now, refund_reason: reason })
      .in('id', itemIds)

    await supabase
      .from('pos_transactions')
      .update({ status: 'refunded' })
      .eq('id', transaction_id)

    // Reverse the unified_data entry
    await supabase.from('unified_data').insert({
      user_id:       user.id,
      channel:       'pos',
      gross_revenue: -(tx.total),
      gross_margin:  0,
      record_date:   new Date().toISOString().split('T')[0],
    })
  } else {
    // Partial refund — mark specific items
    await supabase
      .from('pos_items')
      .update({ refunded: true, refunded_at: now, refund_reason: reason })
      .in('id', item_ids)
      .eq('transaction_id', transaction_id)

    await supabase
      .from('pos_transactions')
      .update({ status: 'partially_refunded' })
      .eq('id', transaction_id)

    // Reverse partial amount
    const refundedItems = (tx.pos_items as { id: string; line_total: number }[]).filter((i) => item_ids.includes(i.id))
    const refundAmount  = refundedItems.reduce((s, i) => s + i.line_total, 0)

    await supabase.from('unified_data').insert({
      user_id:       user.id,
      channel:       'pos',
      gross_revenue: -refundAmount,
      gross_margin:  0,
      record_date:   new Date().toISOString().split('T')[0],
    })
  }

  // Log to audit_log
  await supabase.from('audit_log').insert({
    user_id:  user.id,
    event:    'pos_refund',
    metadata: { transaction_id, full_refund: full_refund || false, item_ids, reason },
  })

  return NextResponse.json({ success: true })
}
