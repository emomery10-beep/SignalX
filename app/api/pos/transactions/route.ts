import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — owner fetches transactions with filters
export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') || new Date(Date.now() - 86400000).toISOString()
  const to   = searchParams.get('to')   || new Date().toISOString()
  const cashier_id = searchParams.get('cashier_id')

  let query = supabase
    .from('pos_transactions')
    .select(`
      *,
      pos_items(*),
      pos_staff(id, name, role),
      pos_customers(id, phone, name)
    `)
    .eq('owner_id', user.id)
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: false })

  if (cashier_id) query = query.eq('cashier_id', cashier_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ transactions: data })
}

// POST — cashier creates a new completed sale
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { items, payment_type, customer_phone, cashier_id, notes } = body

  if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })
  if (!payment_type)  return NextResponse.json({ error: 'Payment type required' }, { status: 400 })

  // Resolve or create customer
  let customer_id: string | null = null
  if (customer_phone) {
    const { data: existing } = await supabase
      .from('pos_customers')
      .select('id')
      .eq('owner_id', user.id)
      .eq('phone', customer_phone)
      .maybeSingle()

    if (existing) {
      customer_id = existing.id
      await supabase.from('pos_customers').update({
        last_seen_at: new Date().toISOString(),
        visit_count:  supabase.rpc('increment_usage', { p_user_id: user.id, p_field: 'visit_count' }),
      }).eq('id', existing.id)
    } else {
      const { data: newCustomer } = await supabase
        .from('pos_customers')
        .insert({ owner_id: user.id, phone: customer_phone })
        .select('id')
        .single()
      if (newCustomer) customer_id = newCustomer.id
    }
  }

  const subtotal = items.reduce((s: number, i: { qty: number; unit_price: number }) => s + i.qty * i.unit_price, 0)
  const total    = subtotal

  // Create transaction
  const { data: tx, error: txErr } = await supabase
    .from('pos_transactions')
    .insert({
      owner_id:     user.id,
      cashier_id:   cashier_id || null,
      customer_id,
      subtotal,
      total,
      payment_type,
      status:       'completed',
      notes:        notes || null,
    })
    .select('id')
    .single()

  if (txErr || !tx) return NextResponse.json({ error: txErr?.message || 'Failed to create transaction' }, { status: 500 })

  // Insert line items (stock deduction handled by DB trigger)
  const lineItems = items.map((i: {
    inventory_id?: string; name: string; qty: number;
    unit_price: number; cost_price?: number
  }) => ({
    transaction_id: tx.id,
    inventory_id:   i.inventory_id || null,
    name:           i.name,
    qty:            i.qty,
    unit_price:     i.unit_price,
    cost_price:     i.cost_price || 0,
    line_total:     i.qty * i.unit_price,
  }))

  const { error: itemsErr } = await supabase.from('pos_items').insert(lineItems)
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

  // Update customer total_spent
  if (customer_id) {
    await supabase.rpc('increment_customer_spend', {
      p_customer_id: customer_id,
      p_amount: total,
    }).maybeSingle()
  }

  return NextResponse.json({ transaction_id: tx.id, total })
}
