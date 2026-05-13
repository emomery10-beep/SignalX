import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

/**
 * POST /api/billing/create-checkout-session
 *
 * Create Stripe checkout session for seat upgrades
 *
 * Body:
 *   seats: number (total seats including current)
 *   additional_seats: number (how many new seats)
 *   owner_id: string (user ID)
 *   owner_email: string (for receipt)
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { seats, additional_seats, owner_id, owner_email } = body

  if (!additional_seats || additional_seats <= 0) {
    return NextResponse.json({ error: 'Must add at least 1 seat' }, { status: 400 })
  }

  try {
    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: owner_email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `POS Seats (${additional_seats} additional)`,
              description: `AskBiz POS - Add ${additional_seats} seat(s) at £5/month each`,
            },
            unit_amount: 500 * additional_seats, // £5 per seat in pence
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?upgrade=cancelled`,
      metadata: {
        owner_id,
        additional_seats,
        total_seats: seats,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
