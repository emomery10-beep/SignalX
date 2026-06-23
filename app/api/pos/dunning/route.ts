import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/pos/dunning
 *
 * Returns failed/pending payments for the Payment Recovery dashboard.
 * Queries pos_transactions for payment_status = 'failed' or 'pending'
 * (for non-cash transactions that haven't been confirmed).
 */
export async function GET() {
  const authClient = createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ payments: [], stats: null }, { status: 401 })

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Try pos_payments first (dedicated payment tracking table)
  let usePaymentsTable = false
  try {
    const { error: probeErr } = await supabase
      .from('pos_payments')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .limit(1)

    if (!probeErr) usePaymentsTable = true
  } catch {}

  if (usePaymentsTable) {
    return fetchFromPosPayments(supabase, user.id)
  }

  // Fallback: use pos_transactions payment_status fields
  return fetchFromPosTransactions(supabase, user.id)
}

async function fetchFromPosPayments(supabase: SupabaseClient<Database>, userId: string) {
  const { data: failed } = await supabase
    .from('pos_payments')
    .select('id, owner_id, transaction_id, customer_phone, amount, payment_method, provider, external_reference, status, error_message, initiated_at, completed_at, created_at')
    .eq('owner_id', userId)
    .in('status', ['failed', 'cancelled'])
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: recovered } = await supabase
    .from('pos_payments')
    .select('id, owner_id, amount, status, completed_at, created_at, customer_phone, error_message, payment_method')
    .eq('owner_id', userId)
    .eq('status', 'completed')
    .not('error_message', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(50)

  const allPayments = [...(failed || []), ...(recovered || [])]
  return buildResponse(allPayments, 'pos_payments')
}

async function fetchFromPosTransactions(supabase: SupabaseClient<Database>, userId: string) {
  // Only get genuinely FAILED digital payments (not pending — pending just means webhook hasn't confirmed yet)
  const { data: failedTx } = await supabase
    .from('pos_transactions')
    .select('id, owner_id, total, payment_type, payment_status, payment_failure_reason, created_at, paid_at, status, cashier:pos_staff!cashier_id(name), pos_customers(phone, name)')
    .eq('owner_id', userId)
    .neq('payment_type', 'cash')
    .eq('payment_status', 'failed')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(100)

  // Get transactions that were refunded (for recovery stats)
  const { data: refundedTx } = await supabase
    .from('pos_transactions')
    .select('id, owner_id, total, payment_type, payment_status, refund_amount, refunded_at, created_at')
    .eq('owner_id', userId)
    .eq('payment_status', 'refunded')
    .order('refunded_at', { ascending: false })
    .limit(50)

  const mapped = (failedTx || []).map(tx => ({
    id: tx.id,
    owner_id: tx.owner_id,
    amount: tx.total || 0,
    customer_phone: (tx as any).pos_customers?.phone || null,
    status: tx.payment_status === 'failed' ? 'failed' : 'pending',
    error_message: tx.payment_failure_reason || null,
    created_at: tx.created_at,
    completed_at: tx.paid_at,
    payment_method: tx.payment_type,
  }))

  return buildResponse(mapped, 'pos_transactions')
}

function buildResponse(allPayments: any[], source: string) {
  const mapped = allPayments.map(p => {
    let status: 'failed' | 'retrying' | 'recovered' | 'abandoned' = 'failed'
    if (p.status === 'completed' && p.error_message) status = 'recovered'
    else if (p.status === 'cancelled' || p.status === 'abandoned') status = 'abandoned'
    else if (p.status === 'pending') status = 'retrying'

    return {
      id: p.id,
      customer_name: p.customer_phone || (p as any).pos_customers?.name || 'Customer',
      customer_phone: p.customer_phone,
      amount: p.amount || p.total || 0,
      currency_symbol: 'KSh',
      failure_reason: mapFailureReason(p.error_message || p.payment_failure_reason),
      created_at: p.created_at || p.initiated_at,
      retry_count: 0,
      max_retries: 3,
      status,
      recovered_at: status === 'recovered' ? p.completed_at : undefined,
    }
  })

  const failedPayments = mapped.filter(p => p.status === 'failed' || p.status === 'retrying')
  const recoveredPayments = mapped.filter(p => p.status === 'recovered')
  const abandonedPayments = mapped.filter(p => p.status === 'abandoned')
  const totalAtRisk = failedPayments.reduce((s, p) => s + p.amount, 0)
  const totalRecovered = recoveredPayments.reduce((s, p) => s + p.amount, 0)
  const totalFailed = failedPayments.length + recoveredPayments.length + abandonedPayments.length

  return NextResponse.json({
    payments: mapped,
    stats: {
      total_failed: failedPayments.length,
      total_amount: totalAtRisk,
      recovered_count: recoveredPayments.length,
      recovered_amount: totalRecovered,
      recovery_rate: totalFailed > 0 ? (recoveredPayments.length / totalFailed) * 100 : 0,
      pending_retry: mapped.filter(p => p.status === 'retrying').length,
      abandoned: abandonedPayments.length,
    },
    source,
  })
}

function mapFailureReason(msg: string | null | undefined): string {
  if (!msg) return 'unknown'
  const lower = msg.toLowerCase()
  if (lower.includes('insufficient')) return 'insufficient_funds'
  if (lower.includes('declined')) return 'card_declined'
  if (lower.includes('expired')) return 'expired_card'
  if (lower.includes('network') || lower.includes('timeout')) return 'network_error'
  if (lower.includes('authentication') || lower.includes('otp')) return 'authentication_required'
  if (lower.includes('mpesa') && lower.includes('timeout')) return 'mpesa_timeout'
  if (lower.includes('mpesa') && lower.includes('insufficient')) return 'mpesa_insufficient'
  return 'unknown'
}
