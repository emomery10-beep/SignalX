import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/get-currency'
import { WALLET_TOPUP_BUNDLES } from '@/lib/geo'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' })

// Fixed bundles, not arbitrary amounts — simpler UX, fewer rounding edge
// cases, matches the original wallet design notes (see the Phase 0 plan:
// "fixed top-up bundles rather than arbitrary amounts"). Values in pence.
// This also doubles as the tier selector once local-currency charging is
// involved below — a client-sent 2000 always means "the £20 tier", whether
// the card actually gets charged £20, KSh 2,000, or something else.
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
  const tierIndex = TOPUP_BUNDLES.indexOf(amount_cents as typeof TOPUP_BUNDLES[number])
  if (tierIndex === -1) {
    return NextResponse.json({ error: `"amount_cents" must be one of: ${TOPUP_BUNDLES.join(', ')}` }, { status: 400 })
  }

  const { data: key, error } = await supabase
    .from('api_keys')
    .select('id, name')
    .eq('id', key_id)
    .eq('user_id', user.id)
    .single()

  if (error || !key) return NextResponse.json({ error: 'Key not found' }, { status: 404 })

  // Geo-aware charging: the developer's card gets charged in their own
  // currency (profiles.currency — reliable, unlike country_code) at a
  // PPP-discounted local price point mirroring POS_SEAT, when we have one.
  // Unlisted currencies fall back to the original GBP amount unchanged.
  const { currency: userCurrency } = await getUserLocale(supabase, user.id)
  const localBundle = WALLET_TOPUP_BUNDLES[userCurrency]
  const local = localBundle
    ? { currency: userCurrency.toLowerCase(), unitAmount: Math.round(localBundle[tierIndex] * 100) }
    : null

  // Builds a full Checkout Session for a given currency/amount. Metadata is
  // always derived from this call's own arguments — never computed
  // upfront — so a GBP-fallback session can't end up claiming metadata for
  // a currency it didn't actually charge.
  const createSession = (currency: string, unitAmount: number) => stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency,
        product_data: { name: `API credit top-up — ${key.name}` },
        unit_amount: unitAmount,
      },
      quantity: 1,
    }],
    success_url: 'https://developer.askbiz.co/dashboard/usage?topup=success',
    cancel_url: 'https://developer.askbiz.co/dashboard/usage?topup=cancelled',
    metadata: {
      type: 'wallet_topup',
      key_id: key.id,
      // The fixed GBP-pence credit the wallet gets on success — always the
      // requested tier, regardless of what currency/amount was actually
      // charged. The webhook reads this, never charged_amount_cents.
      credit_cents: String(amount_cents),
      // Audit/support visibility only (visible in the Stripe Dashboard) —
      // nothing in this codebase reads these back programmatically.
      charged_currency: currency,
      charged_amount_cents: String(unitAmount),
      supabase_user_id: user.id,
    },
  })

  let session: Stripe.Checkout.Session
  try {
    session = local
      ? await createSession(local.currency, local.unitAmount)
      : await createSession('gbp', amount_cents as number)
  } catch (err: any) {
    // Any invalid-request rejection of the local-currency attempt
    // (currency Stripe doesn't support, below its per-currency minimum
    // charge, decimal-format mismatch) falls back to GBP rather than
    // failing the developer's checkout outright — same idiom already used
    // at app/api/billing/downgrade-seats/route.ts.
    if (!local || err?.type !== 'StripeInvalidRequestError') throw err
    session = await createSession('gbp', amount_cents as number)
  }

  return NextResponse.json({ checkout_url: session.url })
}
