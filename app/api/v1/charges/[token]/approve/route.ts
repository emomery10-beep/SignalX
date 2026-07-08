import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' })

// Session-authenticated (the merchant, logged into their own AskBiz
// account) — not an x-api-key route. Creates a real one-time Stripe
// Checkout session for the charge and returns its URL; the developer
// portal's confirmation page redirects the merchant there. Actual approval
// (status -> 'approved') only happens in the Stripe webhook once payment is
// confirmed — this route never marks a charge approved itself.
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: charge, error } = await supabase
    .from('developer_charges')
    .select('id, merchant_email, amount_cents, currency, description, status, expires_at')
    .eq('confirmation_token', params.token)
    .single()

  if (error || !charge) return NextResponse.json({ error: 'Charge not found' }, { status: 404 })

  if (charge.merchant_email !== user.email.toLowerCase()) {
    return NextResponse.json({ error: 'This charge is not addressed to your account' }, { status: 403 })
  }
  if (charge.status !== 'pending') {
    return NextResponse.json({ error: `Charge is already ${charge.status}` }, { status: 409 })
  }
  if (new Date(charge.expires_at) < new Date()) {
    await supabase.from('developer_charges').update({ status: 'expired' }).eq('id', charge.id)
    return NextResponse.json({ error: 'Charge has expired' }, { status: 409 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency: charge.currency,
        product_data: { name: charge.description },
        unit_amount: charge.amount_cents,
      },
      quantity: 1,
    }],
    success_url: `https://developer.askbiz.co/charges/${params.token}?result=success`,
    cancel_url: `https://developer.askbiz.co/charges/${params.token}?result=cancelled`,
    metadata: {
      type: 'developer_charge',
      developer_charge_id: charge.id,
      supabase_user_id: user.id,
    },
  })

  await supabase.from('developer_charges').update({ stripe_checkout_session_id: session.id }).eq('id', charge.id)

  return NextResponse.json({ checkout_url: session.url })
}
