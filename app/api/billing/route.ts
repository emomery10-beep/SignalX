import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { getOrCreateStripeCustomer } from '@/lib/stripe-customer'
import { resolvePriceId as resolvePriceIdShared } from '@/lib/stripe-pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

// Thin wrapper preserving this file's existing (plan, annual) call shape —
// see lib/stripe-pricing.ts for the shared implementation, also used by
// app/api/v1/keys/subscription/route.ts against its own env var prefix.
const resolvePriceId = (plan: string, annual: boolean) => resolvePriceIdShared(stripe, 'STRIPE_PRICE', plan, annual)

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

  // Start free trial (no card required) — POS only. The Growth plan trial is
  // retired: it's not just unadvertised, new grants are rejected outright.
  if (action === 'start_trial') {
    const trialType = body.type as string
    if (trialType === 'growth') {
      return NextResponse.json({ error: 'The Growth free trial is no longer available' }, { status: 403 })
    }
    if (trialType !== 'pos') {
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
    const endsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

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

    // Enable PoS with up to 5 seats
    await supabase.from('profiles').update({
      pos_enabled: true,
      pos_seat_count: 5,
    }).eq('id', user.id)

    return NextResponse.json({ success: true, trial_type: trialType, ends_at: endsAt.toISOString() })
  }

  // Get or create Stripe customer — shared across main plan, POS seats, and
  // the developer API (lib/stripe-customer.ts), one customer per human.
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('user_id', user.id)
    .single()

  const isFirstUpgrade = !(sub as { stripe_customer_id?: string } | null)?.stripe_customer_id
  const customerId = await getOrCreateStripeCustomer(stripe, supabase, user)

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

  // Embedded-card-form variant of `checkout` above — same plan/subscription
  // concept (there is only ever one subscription per user; api_access is a
  // feature flag within it, see lib/plans.ts, not a separate developer-API
  // product), but confirmed inline with Stripe Elements (developer.askbiz.co's
  // upgrade modal) instead of a hosted-page redirect. Returns a client_secret
  // for stripe.confirmPayment() rather than a redirect url.
  if (action === 'checkout_embedded' && plan) {
    let priceId = ''
    try {
      priceId = await resolvePriceId(plan, annual)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[billing] price resolution failed:', msg)
      return NextResponse.json({ error: msg }, { status: 500 })
    }
    if (!priceId) return NextResponse.json({ error: 'Plan not configured' }, { status: 400 })

    const existingSubId = (sub as { stripe_subscription_id?: string } | null)?.stripe_subscription_id
    const metadata = { supabase_user_id: user.id, plan, interval: annual ? 'annual' : 'monthly' }

    let subscription: Stripe.Subscription
    if (existingSubId) {
      // Upgrade/downgrade an existing subscription — swap its single item's price.
      const current = await stripe.subscriptions.retrieve(existingSubId)
      const itemId = current.items.data[0]?.id
      if (!itemId) return NextResponse.json({ error: 'Existing subscription has no item to update' }, { status: 500 })
      subscription = await stripe.subscriptions.update(existingSubId, {
        items: [{ id: itemId, price: priceId }],
        payment_behavior: 'default_incomplete',
        proration_behavior: 'create_prorations',
        expand: ['latest_invoice.payment_intent'],
        metadata,
      })
    } else {
      subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        trial_period_days: isFirstUpgrade ? 7 : undefined,
        expand: ['latest_invoice.payment_intent'],
        metadata,
      })
    }

    const invoice = subscription.latest_invoice as Stripe.Invoice | null
    const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent | null

    // A trial, a $0 proration, or an already-paid invoice means no payment
    // is due right now — nothing for Elements to confirm. The webhook still
    // does the actual plan write; the client just doesn't need a card step.
    if (!paymentIntent || paymentIntent.status === 'succeeded') {
      return NextResponse.json({ success: true, requires_payment: false })
    }

    return NextResponse.json({ success: true, requires_payment: true, client_secret: paymentIntent.client_secret })
  }

  // POS seat checkout — separate recurring subscription at £5/seat/month
  if (action === 'checkout_pos_seat') {
    const seatCount = Math.max(1, Math.min(50, parseInt(body.seats || '1', 10)))
    const priceId = process.env.STRIPE_PRICE_POS_SEAT
    if (!priceId) return NextResponse.json({ error: 'POS seat price not configured. Add STRIPE_PRICE_POS_SEAT to env vars.' }, { status: 400 })

    // Whitelisted return path — the vendor setup flow returns to its own
    // activation screen instead of the plan-comparison billing page.
    // Exact-match whitelist only (never interpolate arbitrary paths into redirects).
    const returnToActivate = body.return_path === '/pos/activate'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: seatCount }],
      success_url: returnToActivate ? `${APP_URL}/pos/activate?paid=1` : `${APP_URL}/billing?pos_success=true&seats=${seatCount}`,
      cancel_url:  returnToActivate ? `${APP_URL}/pos/activate?cancelled=1` : `${APP_URL}/billing`,
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
