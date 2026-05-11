import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { transaction_id, items, reason, cashier_id } = await req.json()
  if (!transaction_id) return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  if (!reason)         return NextResponse.json({ error: 'reason required' }, { status: 400 })
  if (!items?.length)  return NextResponse.json({ error: 'items required' }, { status: 400 })

  // Verify ownership and that it was created today (same shift)
  const { data: original, error } = await supabase
    .from('pos_transactions')
    .select('*, pos_items(*)')
    .eq('id', transaction_id)
    .eq('owner_id', user.id)
    .single()

  if (error || !original) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

  const createdAt   = new Date(original.created_at)
  const hoursSince  = (Date.now() - createdAt.getTime()) / 3600000
  if (hoursSince > 24) return NextResponse.json({ error: 'Amendments only allowed within 24 hours of sale' }, { status: 400 })

  // New totals
  const newSubtotal = items.reduce((s: number, i: { qty: number; unit_price: number }) => s + i.qty * i.unit_price, 0)
  const newTotal    = newSubtotal
  const now         = new Date().toISOString()

  // Mark original as amended
  await supabase
    .from('pos_transactions')
    .update({ status: 'amended', amended_at: now, amended_by: cashier_id || null, amend_reason: reason })
    .eq('id', transaction_id)

  // Create corrected transaction linked to original
  const { data: newTx } = await supabase
    .from('pos_transactions')
    .insert({
      owner_id:      user.id,
      cashier_id:    original.cashier_id,
      customer_id:   original.customer_id,
      subtotal:      newSubtotal,
      total:         newTotal,
      payment_type:  original.payment_type,
      status:        'completed',
      amended_from:  transaction_id,
      notes:         `Amended. Reason: ${reason}`,
    })
    .select('id')
    .single()

  if (!newTx) return NextResponse.json({ error: 'Failed to create amended transaction' }, { status: 500 })

  // Insert corrected items
  await supabase.from('pos_items').insert(
    items.map((i: { inventory_id?: string; name: string; qty: number; unit_price: number; cost_price?: number }) => ({
      transaction_id: newTx.id,
      inventory_id:   i.inventory_id || null,
      name:           i.name,
      qty:            i.qty,
      unit_price:     i.unit_price,
      cost_price:     i.cost_price || 0,
      line_total:     i.qty * i.unit_price,
    }))
  )

  // Reverse original in unified_data, new tx trigger handles the new one
  await supabase.from('unified_data').insert({
    user_id:       user.id,
    channel:       'pos',
    gross_revenue: -(original.total),
    gross_margin:  0,
    record_date:   new Date().toISOString().split('T')[0],
  })

  // Audit log
  await supabase.from('audit_log').insert({
    user_id:  user.id,
    event:    'pos_amendment',
    metadata: { original_id: transaction_id, new_id: newTx.id, reason, original_total: original.total, new_total: newTotal },
  })

  return NextResponse.json({ success: true, new_transaction_id: newTx.id })
}
