import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://signal-x-navy.vercel.app'

const STRIPE_PRICES: Record<string, string> = {
  growth:   process.env.STRIPE_PRICE_GROWTH   || '',
  business: process.env.STRIPE_PRICE_BUSINESS || '',
}

// ── GET — current plan, usage, limits, soft control state ────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const period = new Date().toISOString().slice(0, 7)

  const [{ data: sub }, { data: usage }, { data: plans }] = await Promise.all([
    supabase.from('subscriptions').select('*, plans(*)').eq('user_id', user.id).single(),
    supabase.from('usage').select('*').eq('user_id', user.id).eq('period', period).single(),
    supabase.from('plans').select('*').eq('is_active', true).order('sort_order'),
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
  })
}

// ── POST — checkout, portal, log upgrade trigger ─────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, plan, trigger, feature } = await request.json()

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
  if (action === 'checkout' && plan && STRIPE_PRICES[plan]) {
    const isFirstUpgrade = !(sub as { stripe_customer_id?: string } | null)?.stripe_customer_id
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: STRIPE_PRICES[plan], quantity: 1 }],
      success_url: `${APP_URL}/billing?success=true&plan=${plan}`,
      cancel_url: `${APP_URL}/billing?cancelled=true`,
      subscription_data: {
        trial_period_days: isFirstUpgrade ? 7 : undefined,
        metadata: { supabase_user_id: user.id, plan },
      },
      metadata: { supabase_user_id: user.id, plan },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })
    return NextResponse.json({ url: session.url })
  }

  // Enterprise enquiry
  if (action === 'enterprise') {
    await supabase.from('upgrade_triggers').insert({
      user_id: user.id, trigger: 'enterprise_enquiry', feature: 'enterprise', plan_needed: 'enterprise',
    })
    return NextResponse.json({ url: `mailto:hello@signalx.ai?subject=Enterprise enquiry` })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
