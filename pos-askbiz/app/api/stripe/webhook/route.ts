import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

if (!WEBHOOK_SECRET) {
  console.warn('[stripe/webhook] STRIPE_WEBHOOK_SECRET not configured')
}

/**
 * POST /api/stripe/webhook
 *
 * Receive Stripe webhook events for payment confirmations
 * Verifies signature, processes charge.succeeded and payment_intent.succeeded
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature')

    // Verify webhook signature
    if (!WEBHOOK_SECRET || !signature) {
      console.warn('[stripe/webhook] Missing webhook secret or signature')
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 401 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET)
    } catch (err: any) {
      console.warn('[stripe/webhook] Signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const service = createServiceClient()

    // Handle payment confirmation events
    if (event.type === 'charge.succeeded' || event.type === 'payment_intent.succeeded') {
      const data = event.data.object as any
      const chargeId = data.id || data.charges?.data?.[0]?.id
      const amount = data.amount
      const accountId = data.connected_account ? data.connected_account : null

      if (!chargeId) {
        console.warn('[stripe/webhook] No charge ID found')
        return NextResponse.json({ status: 'processed' })
      }

      // Find payment by external reference (Stripe charge ID or payment intent ID)
      const { data: payment, error: paymentError } = await service
        .from('pos_payments')
        .select('id, owner_id, transaction_id, status')
        .eq('external_reference', chargeId)
        .single()

      if (paymentError || !payment) {
        // Try to find by payment intent ID
        let paymentByIntent: any = null
        const { data: pbi1 } = await service
          .from('pos_payments')
          .select('id, owner_id, transaction_id, status')
          .eq('external_reference', data.payment_intent || data.id)
          .single()
        paymentByIntent = pbi1

        // Fallback: find by transaction_id from Stripe metadata
        if (!paymentByIntent && data.metadata?.transaction_id) {
          const { data: pbi2 } = await service
            .from('pos_payments')
            .select('id, owner_id, transaction_id, status')
            .eq('transaction_id', data.metadata.transaction_id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
          paymentByIntent = pbi2
        }

        if (!paymentByIntent) {
          console.warn(`[stripe/webhook] Payment not found for charge ${chargeId}`)
          return NextResponse.json({ status: 'processed' })
        }

        // Update payment record
        await service
          .from('pos_payments')
          .update({
            status: 'completed',
            external_receipt: chargeId,
            completed_at: new Date().toISOString(),
          })
          .eq('id', paymentByIntent.id)

        // Update transaction
        await service
          .from('pos_transactions')
          .update({
            payment_status: 'paid',
            payment_type: 'card',
          })
          .eq('id', paymentByIntent.transaction_id)
          .eq('owner_id', paymentByIntent.owner_id)

        return NextResponse.json({ status: 'processed' })
      }

      // Update payment record
      const { error: updateError } = await service
        .from('pos_payments')
        .update({
          status: 'completed',
          external_receipt: chargeId,
          completed_at: new Date().toISOString(),
        })
        .eq('id', payment.id)

      if (updateError) {
        console.error('[stripe/webhook] Failed to update payment:', updateError)
        return NextResponse.json({ status: 'processed' })
      }

      // Update transaction payment status
      const { error: txError } = await service
        .from('pos_transactions')
        .update({
          payment_status: 'paid',
          payment_type: 'card',
        })
        .eq('id', payment.transaction_id)
        .eq('owner_id', payment.owner_id)

      if (txError) {
        console.error('[stripe/webhook] Failed to update transaction:', txError)
      }
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'processed' })
  } catch (error: any) {
    console.error('[stripe/webhook] error:', error)
    // Return 200 to prevent Stripe from retrying
    return NextResponse.json({ status: 'processed' })
  }
}
