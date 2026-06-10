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

    // Handle Checkout Session completion (used by POS card/Apple Pay flow)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const sessionId = session.id
      const transactionId = session.metadata?.transaction_id

      if (!sessionId) {
        console.warn('[stripe/webhook] No session ID in checkout.session.completed')
        return NextResponse.json({ status: 'processed' })
      }

      // Find payment by external_reference (the cs_... session ID stored at link creation)
      let payment: any = null
      const { data: p1 } = await service
        .from('pos_payments')
        .select('id, owner_id, transaction_id, status')
        .eq('external_reference', sessionId)
        .single()
      payment = p1

      // Fallback: find by transaction_id from metadata
      if (!payment && transactionId) {
        const { data: p2 } = await service
          .from('pos_payments')
          .select('id, owner_id, transaction_id, status')
          .eq('transaction_id', transactionId)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        payment = p2
      }

      if (!payment) {
        console.warn(`[stripe/webhook] Payment not found for session ${sessionId}`)
        return NextResponse.json({ status: 'processed' })
      }

      if (payment.status === 'completed') {
        return NextResponse.json({ status: 'processed' })
      }

      await service
        .from('pos_payments')
        .update({ status: 'completed', external_receipt: sessionId, completed_at: new Date().toISOString() })
        .eq('id', payment.id)

      await service
        .from('pos_transactions')
        .update({ payment_status: 'paid', payment_type: 'card' })
        .eq('id', payment.transaction_id)
        .eq('owner_id', payment.owner_id)

      return NextResponse.json({ status: 'processed' })
    }

    // Handle legacy charge/payment_intent events (older integrations)
    if (event.type === 'charge.succeeded' || event.type === 'payment_intent.succeeded') {
      const data = event.data.object as any
      const chargeId = data.id || data.charges?.data?.[0]?.id

      if (!chargeId) {
        console.warn('[stripe/webhook] No charge ID found')
        return NextResponse.json({ status: 'processed' })
      }

      let payment: any = null
      const { data: p1 } = await service
        .from('pos_payments')
        .select('id, owner_id, transaction_id, status')
        .eq('external_reference', chargeId)
        .single()
      payment = p1

      if (!payment) {
        const { data: p2 } = await service
          .from('pos_payments')
          .select('id, owner_id, transaction_id, status')
          .eq('external_reference', data.payment_intent || data.id)
          .single()
        payment = p2
      }

      if (!payment && data.metadata?.transaction_id) {
        const { data: p3 } = await service
          .from('pos_payments')
          .select('id, owner_id, transaction_id, status')
          .eq('transaction_id', data.metadata.transaction_id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        payment = p3
      }

      if (!payment) {
        console.warn(`[stripe/webhook] Payment not found for charge ${chargeId}`)
        return NextResponse.json({ status: 'processed' })
      }

      if (payment.status === 'completed') {
        return NextResponse.json({ status: 'processed' })
      }

      await service
        .from('pos_payments')
        .update({ status: 'completed', external_receipt: chargeId, completed_at: new Date().toISOString() })
        .eq('id', payment.id)

      await service
        .from('pos_transactions')
        .update({ payment_status: 'paid', payment_type: 'card' })
        .eq('id', payment.transaction_id)
        .eq('owner_id', payment.owner_id)
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'processed' })
  } catch (error: any) {
    console.error('[stripe/webhook] error:', error)
    // Return 200 to prevent Stripe from retrying
    return NextResponse.json({ status: 'processed' })
  }
}
