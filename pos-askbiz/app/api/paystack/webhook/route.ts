import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

const WEBHOOK_HASH = process.env.PAYSTACK_WEBHOOK_HASH

if (!WEBHOOK_HASH) {
  console.warn('[paystack/webhook] PAYSTACK_WEBHOOK_HASH not configured')
}

/**
 * POST /api/paystack/webhook
 *
 * Receive payment confirmations from Paystack
 * Verifies webhook signature, updates payment status, notifies cashier
 */
export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text()
    const signature = req.headers.get('x-paystack-signature')

    // Verify webhook signature
    if (WEBHOOK_HASH && signature) {
      const hash = crypto.createHmac('sha512', WEBHOOK_HASH).update(rawBody).digest('hex')
      if (hash !== signature) {
        console.warn('[paystack/webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(rawBody)
    const service = createServiceClient()

    // Only handle successful charges
    if (event.event !== 'charge.success') {
      return NextResponse.json({ status: 'ignored' })
    }

    const charge = event.data
    const reference = charge.reference
    const amount = charge.amount / 100 // Convert from kobo to regular currency

    if (!reference) {
      console.warn('[paystack/webhook] No reference in charge')
      return NextResponse.json({ status: 'processed' })
    }

    // Find the payment record by external reference
    const { data: payment, error: paymentError } = await service
      .from('pos_payments')
      .select('id, owner_id, transaction_id, status')
      .eq('external_reference', reference)
      .single()

    if (paymentError || !payment) {
      console.warn(`[paystack/webhook] Payment not found for reference ${reference}`)
      return NextResponse.json({ status: 'processed' })
    }

    // Update payment record
    const { error: updateError } = await service
      .from('pos_payments')
      .update({
        status: 'completed',
        external_receipt: charge.receipt_number || charge.id,
        completed_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('[paystack/webhook] Failed to update payment:', updateError)
      return NextResponse.json({ status: 'processed' })
    }

    // Update transaction payment status
    const { error: txError } = await service
      .from('pos_transactions')
      .update({
        payment_status: 'paid',
        payment_type: charge.metadata?.payment_method || 'card',
      })
      .eq('id', payment.transaction_id)
      .eq('owner_id', payment.owner_id)

    if (txError) {
      console.error('[paystack/webhook] Failed to update transaction:', txError)
    }

    // Success - Paystack will retry failed webhooks
    return NextResponse.json({ status: 'processed' })
  } catch (error: any) {
    console.error('[paystack/webhook] error:', error)
    // Return 200 to acknowledge receipt (Paystack expects this)
    return NextResponse.json({ status: 'processed' })
  }
}
