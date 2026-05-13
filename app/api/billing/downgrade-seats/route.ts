import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

/**
 * POST /api/billing/downgrade-seats
 *
 * Downgrade POS seat subscription
 *
 * Body:
 *   current_seats: number (current seat count)
 *   new_seats: number (target seat count)
 *   owner_id: string (user ID)
 *   owner_email: string (for record)
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { current_seats, new_seats, owner_id, owner_email } = body

  // Validation
  if (!current_seats || !new_seats) {
    return NextResponse.json({ error: 'Missing seat counts' }, { status: 400 })
  }

  if (new_seats >= current_seats) {
    return NextResponse.json({ error: 'New seat count must be less than current count' }, { status: 400 })
  }

  if (new_seats < 1) {
    return NextResponse.json({ error: 'Minimum 1 seat required' }, { status: 400 })
  }

  try {
    const service = createServiceClient()

    // Find customer by email
    const customers = await stripe.customers.list({
      email: owner_email,
      limit: 1,
    })

    if (!customers.data.length) {
      return NextResponse.json({ error: 'Customer not found in Stripe' }, { status: 404 })
    }

    const customerId = customers.data[0].id

    // Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    if (!subscriptions.data.length) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const subscription = subscriptions.data[0]
    const lineItem = subscription.items.data[0]

    // Calculate new price (new_seats * £5 in pence)
    const newPriceAmount = 500 * new_seats

    // Update subscription with new price
    // Stripe will handle proration automatically
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: lineItem.id,
          price_data: {
            currency: 'gbp',
            product: lineItem.price.product as string,
            unit_amount: newPriceAmount,
            recurring: {
              interval: 'month',
            },
          },
        },
      ],
      proration_behavior: 'create_prorations', // Create credit for unused portion
    })

    // Store downgrade record for audit
    await service.from('pos_billing_changes').insert({
      owner_id,
      change_type: 'downgrade',
      from_seats: current_seats,
      to_seats: new_seats,
      stripe_subscription_id: subscription.id,
      effective_date: new Date().toISOString(),
    }).catch(() => {
      // Table might not exist yet, that's okay
      console.log('Could not log billing change (table may not exist)')
    })

    return NextResponse.json({
      success: true,
      message: `Downgrade to ${new_seats} seat(s) successful`,
      subscription_id: updatedSubscription.id,
      new_monthly_amount: newPriceAmount / 100, // Convert to pounds
      proration_credit: (lineItem.price.unit_amount - newPriceAmount) / 100, // Approximate
    })
  } catch (error: any) {
    console.error('Downgrade error:', error)

    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ error: 'Invalid subscription details' }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process downgrade' },
      { status: 500 }
    )
  }
}
