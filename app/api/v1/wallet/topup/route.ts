import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' })

// Fixed bundles, not arbitrary amounts — simpler UX, fewer rounding edge
// cases, matches the original wallet design notes (see the Phase 0 plan:
// "fixed top-up bundles rather than arbitrary amounts"). Values in pence.
const TOPUP_BUNDLES = [500, 2000, 10000] as const

// Session-authenticated (the developer, topping up their own key) — not an
// x-api-key route. Creates a real Stripe Checkout session; the actual
// credit grant only happens in the webhook once payment is confirmed
// (see app/api/webhooks/stripe-billing/route.ts's 'wallet_topup' case).
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { key_id?: string; amount_cents?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { key_id, amount_cents } = body
  if (!key_id) return NextResponse.json({ error: '"key_id" is required' }, { status: 400 })
  if (!TOPUP_BUNDLES.includes(amount_cents as typeof TOPUP_BUNDLES[number])) {
    return NextResponse.json({ error: `"amount_cents" must be one of: ${TOPUP_BUNDLES.join(', ')}` }, { status: 400 })
  }

  const { data: key, error } = await supabase
    .from('api_keys')
    .select('id, name')
    .eq('id', key_id)
    .eq('user_id', user.id)
    .single()

  if (error || !key) return NextResponse.json({ error: 'Key not found' }, { status: 404 })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: { name: `API credit top-up — ${key.name}` },
        unit_amount: amount_cents,
      },
      quantity: 1,
    }],
    success_url: 'https://developer.askbiz.co/dashboard/usage?topup=success',
    cancel_url: 'https://developer.askbiz.co/dashboard/usage?topup=cancelled',
    metadata: {
      type: 'wallet_topup',
      key_id: key.id,
      amount_cents: String(amount_cents),
      supabase_user_id: user.id,
    },
  })

  return NextResponse.json({ checkout_url: session.url })
}
