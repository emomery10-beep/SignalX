import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' })

type PendingCharge = {
  id: string
  merchant_email: string
  amount_cents: number
  currency: string
  description: string
  status: string
  expires_at: string
  key_env: 'live' | 'test'
}

// Sandbox charge: never touches Stripe. Simulates the same end state a real
// approval reaches (status -> 'approved') via the same atomic
// conditional-update pattern the Stripe webhook uses for the live path
// (app/api/webhooks/stripe-billing/route.ts), so a developer testing their
// integration sees the same charge lifecycle in both modes. This function
// is the ONLY place a test-env charge is ever approved — it has no Stripe
// SDK call in it at all, so there's nothing here that could accidentally
// reach Stripe even under a future edit. The `developer_charges_test_no_
// stripe_session` DB constraint (20260720000003) backs this up structurally:
// a test-env row can never carry a stripe_checkout_session_id, live or not.
async function simulateTestApproval(
  supabase: ReturnType<typeof createClient>,
  charge: PendingCharge,
  userId: string
) {
  const { data: updated } = await supabase
    .from('developer_charges')
    .update({ status: 'approved', merchant_user_id: userId, approved_at: new Date().toISOString() })
    .eq('id', charge.id)
    .eq('status', 'pending')
    .select('id')
    .single()

  if (!updated) return NextResponse.json({ error: `Charge is already ${charge.status}` }, { status: 409 })
  return NextResponse.json({ simulated: true, status: 'approved' })
}

// Live charge: the real, only call site for stripe.checkout.sessions.create
// in this file. Creates a real one-time Stripe Checkout session for the
// charge and returns its URL; the developer portal's confirmation page
// redirects the merchant there. Actual approval (status -> 'approved') only
// happens in the Stripe webhook once payment is confirmed — this function
// never marks a charge approved itself, unlike the test-mode path above.
async function createLiveCheckout(
  supabase: ReturnType<typeof createClient>,
  charge: PendingCharge,
  user: { id: string; email: string },
  token: string
) {
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
    success_url: `https://developer.askbiz.co/charges/${token}?result=success`,
    cancel_url: `https://developer.askbiz.co/charges/${token}?result=cancelled`,
    metadata: {
      type: 'developer_charge',
      developer_charge_id: charge.id,
      supabase_user_id: user.id,
    },
  })

  await supabase.from('developer_charges').update({ stripe_checkout_session_id: session.id }).eq('id', charge.id)

  return NextResponse.json({ checkout_url: session.url })
}

// Session-authenticated (the merchant, logged into their own AskBiz
// account) — not an x-api-key route.
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: charge, error } = await supabase
    .from('developer_charges')
    .select('id, merchant_email, amount_cents, currency, description, status, expires_at, key_env')
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

  if (charge.key_env === 'test') {
    return simulateTestApproval(supabase, charge, user.id)
  }
  return createLiveCheckout(supabase, charge, { id: user.id, email: user.email }, params.token)
}
