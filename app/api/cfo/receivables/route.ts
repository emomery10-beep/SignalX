import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sym = await getCurrencySymbol(supabase, user.id)
  const now = new Date()

  // Fetch manual receivables, POS unpaid transactions, and ecommerce unpaid orders in parallel
  const [{ data: manualItems }, { data: posPending }, { data: ecomPending }] = await Promise.all([
    // Manual receivables/payables
    supabase
      .from('cfo_receivables')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true }),

    // POS transactions with pending/failed payment (money owed to you)
    supabase
      .from('pos_transactions')
      .select('id, total, customer_id, created_at, payment_type, payment_status, status, notes')
      .eq('owner_id', user.id)
      .in('payment_status', ['pending', 'failed'])
      .neq('status', 'refunded')
      .order('created_at', { ascending: true })
      .limit(200),

    // Ecommerce orders with pending/unpaid payment status from unified_data
    supabase
      .from('unified_data')
      .select('source_record_id, product_name, source_type, net_revenue, record_date, payment_status, customer_region')
      .eq('user_id', user.id)
      .in('payment_status', ['pending', 'authorized', 'partially_paid', 'PENDING', 'AWAITING_PAYMENT'])
      .order('record_date', { ascending: true })
      .limit(200),
  ])

  // Build combined items list
  const items: any[] = [...(manualItems || [])]

  // Add POS pending transactions as auto-receivables
  for (const tx of posPending || []) {
    const created = new Date(tx.created_at)
    // POS transactions are due immediately — treat created_at as due date
    const daysOverdue = Math.max(0, Math.ceil((now.getTime() - created.getTime()) / 86400000))
    const status = daysOverdue <= 0 ? 'current'
      : daysOverdue <= 30 ? 'overdue_30'
      : daysOverdue <= 60 ? 'overdue_60' : 'overdue_90'

    items.push({
      id: `pos_${tx.id}`,
      user_id: user.id,
      type: 'receivable',
      counterparty: `POS Sale #${tx.id.slice(0, 8)}`,
      amount: tx.total || 0,
      due_date: tx.created_at?.split('T')[0] || now.toISOString().split('T')[0],
      days_overdue: daysOverdue,
      status,
      notes: `${tx.payment_type || 'unknown'} payment ${tx.payment_status} — ${tx.notes || ''}`.trim(),
      source: 'pos',
      auto: true,
    })
  }

  // Aggregate ecommerce unpaid orders by source + date
  const ecomGroups = new Map<string, { source: string; total: number; count: number; earliestDate: string; products: string[] }>()
  for (const row of ecomPending || []) {
    const source = row.source_type || 'unknown'
    const dateKey = row.record_date || now.toISOString().split('T')[0]
    const key = `${source}_${dateKey}`

    if (!ecomGroups.has(key)) {
      ecomGroups.set(key, { source, total: 0, count: 0, earliestDate: dateKey, products: [] })
    }
    const g = ecomGroups.get(key)!
    g.total += row.net_revenue || 0
    g.count++
    if (g.products.length < 3 && row.product_name) g.products.push(row.product_name)
  }

  const sourceLabels: Record<string, string> = {
    shopify: 'Shopify', ebay: 'eBay', etsy: 'Etsy', amazon_fba: 'Amazon',
    stripe: 'Stripe', square: 'Square', woocommerce: 'WooCommerce',
  }

  for (const [key, g] of ecomGroups) {
    const due = new Date(g.earliestDate)
    const daysOverdue = Math.max(0, Math.ceil((now.getTime() - due.getTime()) / 86400000))
    const status = daysOverdue <= 0 ? 'current'
      : daysOverdue <= 30 ? 'overdue_30'
      : daysOverdue <= 60 ? 'overdue_60' : 'overdue_90'
    const label = sourceLabels[g.source] || g.source

    items.push({
      id: `ecom_${key}`,
      user_id: user.id,
      type: 'receivable',
      counterparty: `${label} — ${g.count} unpaid order${g.count > 1 ? 's' : ''}`,
      amount: Math.round(g.total * 100) / 100,
      due_date: g.earliestDate,
      days_overdue: daysOverdue,
      status,
      notes: g.products.length > 0 ? `Items: ${g.products.join(', ')}${g.count > 3 ? ` +${g.count - 3} more` : ''}` : null,
      source: g.source,
      auto: true,
    })
  }

  // Sort all items by due date
  items.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))

  return NextResponse.json({ items, currency_symbol: sym })
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

  // Only allow deleting manual entries (not auto-generated ones)
  if (id.startsWith('pos_') || id.startsWith('ecom_')) {
    return NextResponse.json({ error: 'Cannot delete auto-generated entries' }, { status: 400 })
  }

  await supabase
    .from('cfo_receivables')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
