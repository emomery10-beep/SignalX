import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

// Cache product → default-price resolutions so we only hit Stripe once per cold start.
const productPriceCache = new Map<string, string>()

// Resolve a Stripe price ID for a plan + interval.
// Lookup chain: STRIPE_PRICE_<PLAN>_<INTERVAL> → STRIPE_PRICE_<PLAN> (legacy monthly).
// Accepts either a price ID (`price_...`) or a product ID (`prod_...`); product IDs
// are resolved to their default price on first use. Annual env vars are optional —
// if missing, annual silently falls back to monthly.
async function resolvePriceId(plan: string, annual: boolean): Promise<string> {
  const PLAN = plan.toUpperCase()
  const interval = annual ? 'ANNUAL' : 'MONTHLY'
  const raw = (
    process.env[`STRIPE_PRICE_${PLAN}_${interval}`] ||
    process.env[`STRIPE_PRICE_${PLAN}_MONTHLY`] ||
    process.env[`STRIPE_PRICE_${PLAN}`] ||
    ''
  ).trim()

  if (!raw) return ''
  if (raw.startsWith('price_')) return raw
  if (raw.startsWith('prod_')) {
    const cached = productPriceCache.get(raw)
    if (cached) return cached
    const product = await stripe.products.retrieve(raw)
    const defaultPrice = typeof product.default_price === 'string'
      ? product.default_price
      : product.default_price?.id
    if (!defaultPrice) throw new Error(`Product ${raw} has no default price set in Stripe`)
    productPriceCache.set(raw, defaultPrice)
    return defaultPrice
  }
  return raw
}

// ── GET — current plan, usage, limits, soft control state ────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const period = new Date().toISOString().slice(0, 7)

  const [{ data: sub }, { data: usage }, { data: plans }, { data: profile }] = await Promise.all([
    supabase.from('subscriptions').select('*, plans(*)').eq('user_id', user.id).single(),
    supabase.from('usage').select('*').eq('user_id', user.id).eq('period', period).single(),
    supabase.from('plans').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('profiles').select('pos_enabled, pos_seat_count').eq('id', user.id).single(),
  ])

  const plan = (sub as { plans?: Record<string, unknown> } | null)?.plans as {
    question_limit: number; upload_limit: number; forecast_limit: number
    alert_limit: number; expansion_intel: boolean; live_sync: boolean
    api_access: boolean; name: string
  } | null

  const ql = plan?.question_limit ?? 10
  const ul = plan?.upload_limit ?? 1
  const qUsed = (usage as { questions?: number } | null)?.questions ?? 0
  const uUsed = (usage as { uploads?: number } | null)?.uploads ?? 0

  // Soft control thresholds
  const qPct = ql === -1 ? 0 : (qUsed / ql) * 100
  const softWarning = qPct >= 80 && qPct < 100
  const limitReached = ql !== -1 && qUsed >= ql

  return NextResponse.json({
    subscription: sub,
    plan: plan,
    usage: { questions: qUsed, uploads: uUsed, period },
    limits: { questions: ql, uploads: ul },
    remaining: {
      questions: ql === -1 ? -1 : Math.max(0, ql - qUsed),
      uploads: ul === -1 ? -1 : Math.max(0, ul - uUsed),
    },
    softWarning,
    limitReached,
    usagePct: Math.round(qPct),
    isUnlimited: ql === -1,
    features: {
      expansion_intel: plan?.expansion_intel ?? false,
      live_sync: plan?.live_sync ?? false,
      api_access: plan?.api_access ?? false,
      forecast_limit: plan?.forecast_limit ?? 0,
      alert_limit: plan?.alert_limit ?? 0,
    },
    plans: plans || [],
    pos: {
      enabled:   (profile as { pos_enabled?: boolean } | null)?.pos_enabled   ?? false,
      seatCount: (profile as { pos_seat_count?: number } | null)?.pos_seat_count ?? 0,
    },
  })
}

// ── POST — checkout, portal, log upgrade trigger ─────────────
export async function POST(request: NextRequest) {
  try {
    return await handlePost(request)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[billing] POST failed:', msg, err)
    return NextResponse.json({ error: msg || 'Checkout failed' }, { status: 500 })
  }
}

async function handlePost(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { trigger, feature } = body
  // Treat a request with `plan` but no explicit action as a checkout request —
  // the billing page UI sends `{ plan, currency, annual }` directly.
  const action: string = body.action || (body.plan ? 'checkout' : '')
  const plan: string | undefined = body.plan
  const currency: string | undefined = body.currency
  const annual: boolean = !!body.annual

  // Log upgrade trigger (feature-based, not limit-based)
  if (action === 'log_trigger') {
    await supabase.from('upgrade_triggers').insert({
      user_id: user.id,
      trigger: trigger || 'unknown',
      feature: feature || 'unknown',
      plan_needed: plan || 'growth',
    })
    return NextResponse.json({ logged: true })
  }

  // Get or create Stripe customer
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = (sub as { stripe_customer_id?: string } | null)?.stripe_customer_id

  if (!customerId) {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    const customer = await stripe.customers.create({
      email: user.email!,
      name: (profile as { full_name?: string } | null)?.full_name || user.email!,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('subscriptions').upsert({
      user_id: user.id, stripe_customer_id: customerId, plan_id: 'free', status: 'active',
    }, { onConflict: 'user_id' })
  }

  // Billing portal
  if (action === 'portal') {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId, return_url: `${APP_URL}/billing`,
    })
    return NextResponse.json({ url: session.url })
  }

  // Checkout
  if (action === 'checkout' && plan) {
    let priceId = ''
    try {
      priceId = await resolvePriceId(plan, annual)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[billing] price resolution failed:', msg)
      return NextResponse.json({ error: msg }, { status: 500 })
    }
    if (!priceId) return NextResponse.json({ error: 'Plan not configured' }, { status: 400 })

    const isFirstUpgrade = !(sub as { stripe_customer_id?: string } | null)?.stripe_customer_id

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/billing?success=true&plan=${plan}`,
      cancel_url: `${APP_URL}/billing?cancelled=true`,
      subscription_data: {
        trial_period_days: isFirstUpgrade ? 7 : undefined,
        metadata: { supabase_user_id: user.id, plan, interval: annual ? 'annual' : 'monthly' },
      },
      metadata: { supabase_user_id: user.id, plan, interval: annual ? 'annual' : 'monthly' },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })
    return NextResponse.json({ url: session.url })
  }

  // POS seat checkout — separate recurring subscription at £5/seat/month
  if (action === 'checkout_pos_seat') {
    const seatCount = Math.max(1, Math.min(50, parseInt(body.seats || '1', 10)))
    const priceId = process.env.STRIPE_PRICE_POS_SEAT
    if (!priceId) return NextResponse.json({ error: 'POS seat price not configured. Add STRIPE_PRICE_POS_SEAT to env vars.' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: seatCount }],
      success_url: `${APP_URL}/billing?pos_success=true&seats=${seatCount}`,
      cancel_url:  `${APP_URL}/billing`,
      subscription_data: {
        metadata: { supabase_user_id: user.id, type: 'pos_seats', seats: String(seatCount) },
      },
      metadata: { supabase_user_id: user.id, type: 'pos_seats', seats: String(seatCount) },
      allow_promotion_codes: true,
    })
    return NextResponse.json({ url: session.url })
  }

  // Enterprise enquiry
  if (action === 'enterprise') {
    await supabase.from('upgrade_triggers').insert({
      user_id: user.id, trigger: 'enterprise_enquiry', feature: 'enterprise', plan_needed: 'enterprise',
    })
    return NextResponse.json({ url: `mailto:hello@askbiz.co?subject=Enterprise enquiry` })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
