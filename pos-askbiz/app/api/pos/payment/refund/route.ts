import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

/**
 * POST /api/pos/payment/refund
 *
 * Process refund via Stripe
 * Handles: partial refunds, reason logging, tax reversal
 *
 * Body:
 *   transaction_id: uuid
 *   amount_pence?: number (if not provided, full refund)
 *   reason: 'customer_request' | 'duplicate' | 'damaged' | 'other'
 *   reason_details?: string
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { transaction_id, amount_pence, reason = 'customer_request', reason_details } = body

  if (!transaction_id) {
    return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  }

  try {
    // Fetch transaction details
    const { data: transaction, error: txError } = await service
      .from('pos_transactions')
      .select(`
        id,
        total_amount,
        total_tax,
        stripe_payment_id,
        payment_status,
        tax_jurisdiction,
        tax_rate,
        pos_items (
          unit_price,
          qty,
          tax_amount,
          tax_rate
        )
      `)
      .eq('id', transaction_id)
      .eq('owner_id', ownerId)
      .single()

    if (!transaction || !transaction.stripe_payment_id) {
      return NextResponse.json({ error: 'Transaction not found or not paid via Stripe' }, { status: 404 })
    }

    // Determine refund amount
    const refundAmount = amount_pence || transaction.total_amount

    if (refundAmount > transaction.total_amount) {
      return NextResponse.json({ error: 'Refund amount exceeds transaction total' }, { status: 400 })
    }

    // Calculate tax reversal (proportional)
    const refundRatio = refundAmount / transaction.total_amount
    const taxReversal = Math.round(transaction.total_tax * refundRatio)

    // Issue refund via Stripe
    const stripeRefund = await stripe.refunds.create({
      payment_intent: transaction.stripe_payment_id,
      amount: refundAmount,
      metadata: {
        reason,
        reason_details,
        transaction_id,
      },
    })

    if (stripeRefund.status !== 'succeeded') {
      return NextResponse.json(
        { error: `Stripe refund ${stripeRefund.status}` },
        { status: 400 }
      )
    }

    // Update transaction
    await service
      .from('pos_transactions')
      .update({
        payment_status: 'refunded',
        refund_amount: refundAmount,
        refund_id: stripeRefund.id,
        refund_reason: reason,
        refund_reason_details: reason_details,
        refunded_at: new Date().toISOString(),
        total_tax: transaction.total_tax - taxReversal, // Reverse tax proportionally
      })
      .eq('id', transaction_id)

    // Log refund in audit trail
    const { data: transactionHistory } = await service
      .from('pos_transaction_history')
      .select('hash, version')
      .eq('transaction_id', transaction_id)
      .order('version', { ascending: false })
      .limit(1)

    const previousHash = transactionHistory?.[0]?.hash
    const version = (transactionHistory?.[0]?.version || 0) + 1

    // Calculate new hash for immutable trail
    const hashInput = `${previousHash || ''}${JSON.stringify({
      type: 'refund',
      amount: refundAmount,
      tax_reversed: taxReversal,
      reason,
    })}`
    const { createHash } = await import('crypto')
    const hash = createHash('sha256').update(hashInput).digest('hex')

    await service.from('pos_transaction_history').insert({
      owner_id: ownerId,
      transaction_id,
      version,
      state_json: { refunded: true, refund_amount: refundAmount, tax_reversed: taxReversal },
      hash,
      previous_hash: previousHash,
      change_reason: 'refund',
      change_details_json: {
        stripe_refund_id: stripeRefund.id,
        reason,
        reason_details,
      },
      changed_at: new Date().toISOString(),
      changed_by: ownerId, // Would be cashier ID in real system
    })

    return NextResponse.json({
      success: true,
      refund_id: stripeRefund.id,
      status: stripeRefund.status,
      amount_refunded: refundAmount,
      currency: stripeRefund.currency,
      tax_reversed: taxReversal,
      transaction_id,
      receipt_url: stripeRefund.charge ? null : null,
      refund_reason: reason,
    })
  } catch (error: any) {
    console.error('Refund error:', error)
    return NextResponse.json({ error: error.message || 'Refund failed' }, { status: 400 })
  }
}

/**
 * GET /api/pos/payment/refund?transaction_id=xxx
 *
 * Get refund history for a transaction
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const transactionId = searchParams.get('transaction_id')

  if (!transactionId) {
    return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  }

  const { data: transaction } = await service
    .from('pos_transactions')
    .select('id, refund_id, refund_amount, refund_reason, refunded_at')
    .eq('id', transactionId)
    .eq('owner_id', ownerId)
    .single()

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  }

  return NextResponse.json({
    transaction_id: transactionId,
    refund_id: transaction.refund_id,
    refund_amount: transaction.refund_amount,
    refund_reason: transaction.refund_reason,
    refunded_at: transaction.refunded_at,
    refunded: !!transaction.refund_id,
  })
}
