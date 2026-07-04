import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner, posEntitled } from '@/lib/pos-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

/**
 * POST /api/pos/payment/charge
 *
 * Process card payments via Stripe
 * Handles: card, Apple Pay, Google Pay, Klarna installments
 *
 * Body:
 *   transaction_id: uuid (links to POS transaction)
 *   amount_pence: number (in pence for GBP, cents for USD)
 *   currency: 'GBP' | 'USD' | 'EUR'
 *   payment_method: 'card' | 'apple_pay' | 'google_pay' | 'klarna'
 *   customer: { phone, email }
 *   description: string (sale reference)
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Charging customers is a selling action — requires an active POS
  // subscription or trial (same gate as recording a transaction).
  if (!(await posEntitled(ownerId))) {
    return NextResponse.json(
      { error: 'POS is not active — activate your till to start selling.', code: 'pos_not_active' },
      { status: 402 },
    )
  }

  const service = createServiceClient()
  const body = await req.json()

  const { transaction_id, amount_pence, currency = 'GBP', payment_method = 'card', customer, description } = body

  // Validate request
  if (!transaction_id || !amount_pence || amount_pence <= 0) {
    return NextResponse.json({ error: 'transaction_id and positive amount_pence required' }, { status: 400 })
  }

  try {
    // Verify transaction exists and fetch details
    const { data: transaction } = await service
      .from('pos_transactions')
      .select('id, total, tax_amount, customer_id')
      .eq('id', transaction_id)
      .eq('owner_id', ownerId)
      .single()

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Create or get Stripe customer
    let stripeCustomerId: string | undefined

    if (customer?.email) {
      const existingCustomers = await stripe.customers.list({
        email: customer.email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id
      } else {
        const newCustomer = await stripe.customers.create({
          email: customer.email,
          phone: customer.phone,
          description: `POS Customer - ${customer.email}`,
        })
        stripeCustomerId = newCustomer.id
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount_pence,
      currency: currency.toLowerCase(),
      customer: stripeCustomerId,
      description: `${description || 'POS Sale'} - Ref: ${transaction_id.slice(0, 8)}`,
      metadata: {
        transaction_id,
        owner_id: ownerId,
        payment_method,
      },
      payment_method_types:
        payment_method === 'klarna'
          ? ['klarna', 'card']
          : payment_method === 'apple_pay' || payment_method === 'google_pay'
            ? ['card'] // Apple/Google Pay handled via card
            : ['card'],
      capture_method: 'automatic', // Auto-capture (not auth-only)
    })

    // If this is a test/demo request with payment method ID provided, confirm it
    const paymentMethodId = body.payment_method_id

    if (paymentMethodId && paymentIntent.status === 'requires_payment_method') {
      const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: paymentMethodId,
      })

      return handlePaymentResult(service, ownerId, transaction_id, confirmedIntent, payment_method)
    }

    // Return payment intent client secret for frontend to confirm
    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: amount_pence,
      currency,
      status: paymentIntent.status,
      requires_action: paymentIntent.status === 'requires_action',
      next_action:
        paymentIntent.status === 'requires_action'
          ? paymentIntent.next_action?.type
          : null,
    })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message || 'Payment failed' }, { status: 400 })
  }
}

/**
 * POST /api/pos/payment/webhook
 *
 * Stripe webhook for payment confirmation
 * Listens for payment_intent.succeeded events
 */
export async function handlePaymentResult(
  service: any,
  ownerId: string,
  transactionId: string,
  paymentIntent: any,
  paymentMethod: string
) {
  if (paymentIntent.status === 'succeeded') {
    // Update transaction with payment details
    await service.from('pos_transactions').update({
      payment_status: 'paid',
      stripe_payment_id: paymentIntent.id,
      payment_method: paymentMethod,
      paid_at: new Date().toISOString(),
    })
      .eq('id', transactionId)
      .eq('owner_id', ownerId)

    return NextResponse.json({
      success: true,
      payment_id: paymentIntent.id,
      status: 'succeeded',
      amount_charged: paymentIntent.amount,
      currency: paymentIntent.currency,
      payment_method: paymentMethod,
      receipt_url: paymentIntent.charges.data[0]?.receipt_url || null,
      transaction_id: transactionId,
    })
  } else if (paymentIntent.status === 'requires_action') {
    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
      requires_action: true,
      client_secret: paymentIntent.client_secret,
      next_action: paymentIntent.next_action?.type,
    })
  } else {
    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
      error: `Payment ${paymentIntent.status}`,
    })
  }
}
