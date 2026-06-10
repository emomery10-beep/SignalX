import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

/**
 * POST /api/webhooks/stripe
 *
 * Stripe webhook handler for payment events
 * Listens for:
 *   - payment_intent.succeeded: payment confirmed
 *   - payment_intent.payment_failed: payment declined
 *   - charge.refunded: refund processed
 */
export async function POST(req: NextRequest) {
  const service = createServiceClient()

  const body = await req.text()
  const signature = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const transactionId = session.metadata?.transaction_id
      const ownerId = session.metadata?.owner_id

      if (transactionId) {
        await service
          .from('pos_payments')
          .update({ status: 'completed', external_receipt: session.id, completed_at: new Date().toISOString() })
          .eq('transaction_id', transactionId)
          .eq('status', 'pending')

        if (ownerId) {
          await service
            .from('pos_transactions')
            .update({ payment_status: 'paid', payment_type: 'card' })
            .eq('id', transactionId)
            .eq('owner_id', ownerId)
        }
      } else if (session.id) {
        const { data: payment } = await service
          .from('pos_payments')
          .select('id, owner_id, transaction_id')
          .eq('external_reference', session.id)
          .eq('status', 'pending')
          .single()

        if (payment) {
          await service
            .from('pos_payments')
            .update({ status: 'completed', external_receipt: session.id, completed_at: new Date().toISOString() })
            .eq('id', payment.id)

          await service
            .from('pos_transactions')
            .update({ payment_status: 'paid', payment_type: 'card' })
            .eq('id', payment.transaction_id)
            .eq('owner_id', payment.owner_id)
        }
      }

      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      const transactionId = paymentIntent.metadata?.transaction_id
      const ownerId = paymentIntent.metadata?.owner_id

      if (!transactionId || !ownerId) {
        return NextResponse.json({ received: true })
      }

      // Update transaction as paid
      await service
        .from('pos_transactions')
        .update({
          payment_status: 'paid',
          stripe_payment_id: paymentIntent.id,
          paid_at: new Date().toISOString(),
        })
        .eq('id', transactionId)
        .eq('owner_id', ownerId)

      // Also update pos_payments so Realtime subscription fires
      await service
        .from('pos_payments')
        .update({
          status: 'completed',
          external_receipt: paymentIntent.id,
          completed_at: new Date().toISOString(),
        })
        .eq('transaction_id', transactionId)
        .eq('status', 'pending')

      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      const transactionId = paymentIntent.metadata?.transaction_id
      const ownerId = paymentIntent.metadata?.owner_id

      if (!transactionId || !ownerId) {
        return NextResponse.json({ received: true })
      }

      // Update transaction as failed
      const failureMessage = paymentIntent.last_payment_error?.message || 'Payment declined'

      await service
        .from('pos_transactions')
        .update({
          payment_status: 'failed',
          payment_failure_reason: failureMessage,
        })
        .eq('id', transactionId)
        .eq('owner_id', ownerId)

      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge

      if (charge.refunded) {
        const paymentIntentId = charge.payment_intent

        // Find transaction by payment intent
        const { data: transactions } = await service
          .from('pos_transactions')
          .select('id, owner_id')
          .eq('stripe_payment_id', typeof paymentIntentId === 'string' ? paymentIntentId : paymentIntentId?.id)
          .limit(1)

        if (transactions && transactions.length > 0) {
          const tx = transactions[0]

          // Refund already handled by our API endpoint, this is just confirmation
          await service
            .from('pos_transactions')
            .update({
              payment_status: 'refunded',
            })
            .eq('id', tx.id)
            .eq('owner_id', tx.owner_id)
        }
      }

      break
    }

    case 'customer.subscription.updated': {
      // Future: Handle subscription upgrades/downgrades
      break
    }

    default: {
      // Unhandled event type
    }
  }

  return NextResponse.json({ received: true })
}
