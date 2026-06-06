import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
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

  const [{ data: sub }, { data: usage }, { data: plans }, { data: profile }, { data: trials }] = await Promise.all([
    supabase.from('subscriptions').select('*, plans(*)').eq('user_id', user.id).single(),
    supabase.from('usage').select('*').eq('user_id', user.id).eq('period', period).single(),
    supabase.from('plans').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('profiles').select('pos_enabled, pos_seat_count, pos_stripe_subscription_id, currency').eq('id', user.id).single(),
    supabase.from('trials').select('*').eq('user_id', user.id),
  ])

  const now = new Date()
  const trialsList = (trials || []) as { trial_type: string; started_at: string; ends_at: string; converted: boolean }[]
  const posTrial = trialsList.find(t => t.trial_type === 'pos')
  const growthTrial = trialsList.find(t => t.trial_type === 'growth')

  // Expire trials that have passed their end date
  const posTrialActive = posTrial && !posTrial.converted && new Date(posTrial.ends_at) > now
  const posTrialExpired = posTrial && !posTrial.converted && new Date(posTrial.ends_at) <= now
  const growthTrialActive = growthTrial && !growthTrial.converted && new Date(growthTrial.ends_at) > now
  const growthTrialExpired = growthTrial && !growthTrial.converted && new Date(growthTrial.ends_at) <= now

  // Handle PoS trial expiry: disable PoS if no paid subscription
  const profileData = profile as { pos_enabled?: boolean; pos_seat_count?: number; pos_stripe_subscription_id?: string; currency?: string } | null
  let posEnabled = profileData?.pos_enabled ?? false
  let posSeatCount = profileData?.pos_seat_count ?? 0

  if (posTrialExpired && posEnabled) {
    const hasPaidPos = !!profileData?.pos_stripe_subscription_id
    if (!hasPaidPos) {
      await supabase.from('profiles').update({ pos_enabled: false, pos_seat_count: 0 }).eq('id', user.id)
      posEnabled = false
      posSeatCount = 0
    }
  }

  // Handle Growth trial expiry: downgrade to free if no paid subscription
  const subData = sub as { plan_id?: string; stripe_subscription_id?: string; payment_provider?: string; plans?: Record<string, unknown> } | null
  let effectivePlanId = subData?.plan_id || 'free'

  if (growthTrialExpired && effectivePlanId === 'growth') {
    const hasPaidSub = !!subData?.stripe_subscription_id || subData?.payment_provider === 'pesapal'
    if (!hasPaidSub) {
      await Promise.all([
        supabase.from('subscriptions').update({ plan_id: 'free', updated_at: now.toISOString() }).eq('user_id', user.id),
        supabase.from('profiles').update({ plan_id: 'free' }).eq('id', user.id),
      ])
      effectivePlanId = 'free'
    }
  }

  // Resolve plan features based on effective plan (may differ from DB if trial expired)
  const allPlans = (plans || []) as { id: string; question_limit: number; upload_limit: number; forecast_limit: number; alert_limit: number; expansion_intel: boolean; live_sync: boolean; api_access: boolean; name: string }[]
  const effectivePlan = allPlans.find(p => p.id === effectivePlanId) || null

  const plan = effectivePlan as {
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

  // Build trial info for frontend
  const calcDaysLeft = (endsAt: string) => Math.max(0, Math.ceil((new Date(endsAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  const trialInfo: Record<string, { active: boolean; daysLeft: number; endsAt: string; expired: boolean; used: boolean }> = {}
  if (posTrial) {
    trialInfo.pos = { active: !!posTrialActive, daysLeft: posTrialActive ? calcDaysLeft(posTrial.ends_at) : 0, endsAt: posTrial.ends_at, expired: !!posTrialExpired, used: true }
  }
  if (growthTrial) {
    trialInfo.growth = { active: !!growthTrialActive, daysLeft: growthTrialActive ? calcDaysLeft(growthTrial.ends_at) : 0, endsAt: growthTrial.ends_at, expired: !!growthTrialExpired, used: true }
  }

  return NextResponse.json({
    subscription: { ...sub, plan_id: effectivePlanId },
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
      enabled:   posEnabled,
      seatCount: posSeatCount,
    },
    trials: trialInfo,
    userCurrency: profileData?.currency || 'GBP',
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

  // Start free trial (no card required)
  if (action === 'start_trial') {
    const trialType = body.type as string
    if (trialType !== 'pos' && trialType !== 'growth') {
      return NextResponse.json({ error: 'Invalid trial type' }, { status: 400 })
    }

    // Check if user already used this trial
    const { data: existing } = await supabase
      .from('trials')
      .select('id, converted')
      .eq('user_id', user.id)
      .eq('trial_type', trialType)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'You have already used this free trial' }, { status: 400 })
    }

    const now = new Date()
    const endsAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

    // Insert trial record
    const { error: trialErr } = await supabase.from('trials').insert({
      user_id: user.id,
      trial_type: trialType,
      started_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    if (trialErr) {
      return NextResponse.json({ error: 'Could not start trial' }, { status: 500 })
    }

    if (trialType === 'pos') {
      // Enable PoS with up to 5 seats
      await supabase.from('profiles').update({
        pos_enabled: true,
        pos_seat_count: 5,
      }).eq('id', user.id)
    }

    if (trialType === 'growth') {
      // Upgrade to Growth plan (no Stripe subscription)
      await Promise.all([
        supabase.from('subscriptions').update({
          plan_id: 'growth',
          status: 'trialing',
          trial_ends_at: endsAt.toISOString(),
          updated_at: now.toISOString(),
        }).eq('user_id', user.id),
        supabase.from('profiles').update({ plan_id: 'growth' }).eq('id', user.id),
      ])
    }

    return NextResponse.json({ success: true, trial_type: trialType, ends_at: endsAt.toISOString() })
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
