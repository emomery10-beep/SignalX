import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { verifyTransaction } from '@/lib/paystack'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

/**
 * GET /api/pos/payment/status?payment_id=xxx
 *
 * Check payment status for polling.
 * If still pending, verifies directly with Paystack as a webhook fallback.
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const paymentId = req.nextUrl.searchParams.get('payment_id')
  if (!paymentId) {
    return NextResponse.json({ error: 'payment_id required' }, { status: 400 })
  }

  const service = createServiceClient()

  try {
    const { data: payment, error } = await service
      .from('pos_payments')
      .select('id, status, completed_at, external_reference, transaction_id, provider')
      .eq('id', paymentId)
      .eq('owner_id', ownerId)
      .single()

    if (error || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Already completed or failed — return immediately
    if (payment.status !== 'pending') {
      return NextResponse.json({ status: payment.status, completed_at: payment.completed_at })
    }

    // Still pending — verify directly with payment provider (webhook fallback)
    if (payment.external_reference) {
      try {
        if (payment.provider === 'stripe') {
          // Verify Stripe checkout session status
          const { data: config } = await service
            .from('merchant_payment_config')
            .select('stripe_connected_account_id')
            .eq('owner_id', ownerId)
            .single()

          if (config?.stripe_connected_account_id) {
            const session = await stripe.checkout.sessions.retrieve(
              payment.external_reference,
              { stripeAccount: config.stripe_connected_account_id }
            )

            if (session.payment_status === 'paid') {
              await service
                .from('pos_payments')
                .update({ status: 'completed', completed_at: new Date().toISOString() })
                .eq('id', payment.id)

              await service
                .from('pos_transactions')
                .update({ payment_status: 'paid' })
                .eq('id', payment.transaction_id)
                .eq('owner_id', ownerId)

              return NextResponse.json({ status: 'completed' })
            }

            if (session.status === 'expired') {
              await service
                .from('pos_payments')
                .update({ status: 'failed' })
                .eq('id', payment.id)

              return NextResponse.json({ status: 'failed' })
            }
          }
        } else {
          const verified = await verifyTransaction(payment.external_reference)

          if (verified.status === 'success') {
            await service
              .from('pos_payments')
              .update({ status: 'completed', completed_at: new Date().toISOString() })
              .eq('id', payment.id)

            await service
              .from('pos_transactions')
              .update({ payment_status: 'paid' })
              .eq('id', payment.transaction_id)
              .eq('owner_id', ownerId)

            return NextResponse.json({ status: 'completed' })
          }

          if (verified.status === 'failed' || verified.status === 'abandoned') {
            await service
              .from('pos_payments')
              .update({ status: 'failed' })
              .eq('id', payment.id)

            return NextResponse.json({ status: 'failed' })
          }
        }
      } catch (verifyErr) {
        console.warn('[payment/status] Provider verify error:', verifyErr)
      }
    }

    return NextResponse.json({ status: payment.status, completed_at: payment.completed_at })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
