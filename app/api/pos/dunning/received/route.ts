import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/pos/dunning/received
 *
 * Returns confirmed/completed digital payments (non-cash) for the Payment History section.
 * Shows payments received via Paystack (M-Pesa, card) and Stripe.
 */
export async function GET() {
  const authClient = createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ payments: [], total: 0 }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Try pos_payments table first
  let payments: any[] = []
  let totalReceived = 0

  try {
    const { data, error } = await supabase
      .from('pos_payments')
      .select('id, amount, payment_method, provider, external_receipt, customer_phone, status, completed_at, created_at')
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(50)

    if (!error && data && data.length > 0) {
      payments = data.map(p => ({
        id: p.id,
        amount: p.amount || 0,
        payment_method: p.payment_method || 'card',
        provider: p.provider || 'paystack',
        receipt: p.external_receipt,
        customer_phone: p.customer_phone,
        completed_at: p.completed_at || p.created_at,
      }))
      totalReceived = payments.reduce((s, p) => s + p.amount, 0)
      return NextResponse.json({ payments, total: totalReceived, count: payments.length, source: 'pos_payments' })
    }
  } catch {}

  // Fallback: query pos_transactions for non-cash completed payments
  const { data: txns } = await supabase
    .from('pos_transactions')
    .select('id, total, payment_type, payment_status, paid_at, created_at, pos_customers(phone, name), cashier:pos_staff!cashier_id(name)')
    .eq('owner_id', user.id)
    .neq('payment_type', 'cash')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(50)

  payments = (txns || []).map(tx => ({
    id: tx.id,
    amount: tx.total || 0,
    payment_method: tx.payment_type || 'card',
    provider: 'paystack',
    receipt: null,
    customer_phone: (tx as any).pos_customers?.phone || null,
    customer_name: (tx as any).pos_customers?.name || null,
    cashier_name: (tx as any).cashier?.name || null,
    completed_at: tx.paid_at || tx.created_at,
    payment_status: tx.payment_status,
  }))

  totalReceived = payments.reduce((s, p) => s + p.amount, 0)
  return NextResponse.json({ payments, total: totalReceived, count: payments.length, source: 'pos_transactions' })
}
