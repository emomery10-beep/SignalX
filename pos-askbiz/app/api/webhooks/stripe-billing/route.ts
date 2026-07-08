// Mirrors: app/api/webhooks/stripe-billing/route.ts (root) — keep both in sync
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail, planUpgradeEmail, posSeatsWelcomeEmail, unsubscribeUrl, firstNameOf } from '@/lib/email'
import { resolveLocale, type Lang } from '@/lib/i18n-locale'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

// Ranks strictly increase on genuine upgrades — used to gate the welcome email
// so renewals/lateral moves never re-trigger it.
const PLAN_RANK: Record<string, number> = { free: 0, growth: 1, business: 2, enterprise: 3 }

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_BILLING_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Prevent duplicate processing
  const { data: existing } = await supabase
    .from('billing_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .single()
  if (existing) return NextResponse.json({ received: true })

  const getUserId = async (customerId: string): Promise<string | null> => {
    const { data } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single()
    return data?.user_id || null
  }

  const updatePlan = async (userId: string, planId: string, subData: Partial<{
    stripe_subscription_id: string
    stripe_price_id: string
    status: string
    current_period_start: string
    current_period_end: string
    cancel_at_period_end: boolean
  }>) => {
    await Promise.all([
      supabase.from('subscriptions').update({
        plan_id: planId,
        ...subData,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId),
      supabase.from('profiles').update({ plan_id: planId }).eq('id', userId),
    ])
  }

  // Claims a (user, email_type) row in lifecycle_emails before sending — the
  // unique constraint means whichever webhook instance (this app or the
  // root app's identical copy) processes a given event first wins the claim,
  // so upgrades never double-email even though both apps share this DB.
  const claimAndSend = async (
    userId: string,
    emailType: string,
    buildEmail: (firstName: string, locale: Lang) => { subject: string; html: string },
  ) => {
    const { error: claimError } = await supabase.from('lifecycle_emails').insert({ user_id: userId, email_type: emailType })
    if (claimError) return // already claimed — nothing to do

    const [{ data: authData }, { data: profile }] = await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from('profiles').select('full_name, preferred_locale, registration_country').eq('id', userId).single(),
    ])
    const email = authData?.user?.email
    if (!email) return

    const locale = resolveLocale({ profile: profile?.preferred_locale, country: profile?.registration_country })
    const { subject, html } = buildEmail(firstNameOf(profile?.full_name), locale)
    await sendEmail({
      to: email,
      subject,
      html,
      replyTo: 'hello@askbiz.co',
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl(userId)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        if (!userId) break

        // Developer platform Phase 3 — billing-on-behalf-of. Mirrors the
        // root app's identical branch (app/api/webhooks/stripe-billing/
        // route.ts) — keep both in sync, same reasoning as everything else
        // in this file. See that copy's comment, and the scope note in
        // supabase/migrations/20260708000005_developer_charges.sql, for why
        // this only records what's owed to the developer rather than
        // automating payout.
        if (session.metadata?.type === 'developer_charge') {
          const chargeId = session.metadata?.developer_charge_id
          if (!chargeId) break

          // Atomic conditional update, not select-then-update — see the
          // root app's identical branch for why: this endpoint and the root
          // app's can both receive the same Stripe event concurrently, and
          // a separate SELECT would let both read status='pending' and both
          // credit the ledger. UPDATE...WHERE status='pending' is atomic at
          // the row level, so only one racing invocation can ever flip it.
          const { data: updated } = await supabase
            .from('developer_charges')
            .update({ status: 'approved', merchant_user_id: userId, approved_at: new Date().toISOString() })
            .eq('id', chargeId)
            .eq('status', 'pending')
            .select('id, key_id, amount_cents, platform_fee_percent')
            .single()

          if (updated) {
            const developerShareCents = Math.round(updated.amount_cents * (1 - updated.platform_fee_percent / 100))
            await supabase.from('developer_payouts_ledger').insert({
              key_id: updated.key_id,
              charge_id: updated.id,
              developer_share_cents: developerShareCents,
            })
          }
          break
        }

        // Dashboard wallet top-up — mirrors the root app's identical branch,
        // see that copy for the idempotency reasoning.
        if (session.metadata?.type === 'wallet_topup') {
          const keyId = session.metadata?.key_id
          const amountCents = parseInt(session.metadata?.amount_cents || '0', 10)
          if (!keyId || !amountCents) break
          await supabase.rpc('topup_api_credits', {
            p_key_id: keyId,
            p_amount_cents: amountCents,
            p_provider: 'stripe',
            p_provider_ref: session.id,
          })
          break
        }

        // POS seat purchase
        if (session.metadata?.type === 'pos_seats') {
          const seats = parseInt(session.metadata?.seats || '1', 10)
          const { data: priorProfile } = await supabase.from('profiles').select('pos_enabled').eq('id', userId).single()
          const wasEnabled = priorProfile?.pos_enabled ?? false

          await supabase.from('profiles').update({
            pos_enabled:                 true,
            pos_seat_count:              seats,
            pos_stripe_subscription_id:  session.subscription as string,
          }).eq('id', userId)

          if (!wasEnabled) {
            await claimAndSend(userId, 'pos_seats_welcome', (firstName, locale) =>
              posSeatsWelcomeEmail({ firstName, unsubscribeUrl: unsubscribeUrl(userId), locale }))
          }
          break
        }

        // Main plan checkout
        const plan = session.metadata?.plan || 'growth'
        const { data: priorSub } = await supabase.from('subscriptions').select('plan_id').eq('user_id', userId).single()
        const oldRank = PLAN_RANK[priorSub?.plan_id ?? 'free'] ?? 0

        await supabase.from('subscriptions').update({
          stripe_customer_id: session.customer as string,
        }).eq('user_id', userId)

        await updatePlan(userId, plan, {
          stripe_subscription_id: session.subscription as string,
          status: 'active',
        })

        if ((PLAN_RANK[plan] ?? 0) > oldRank) {
          await claimAndSend(userId, `plan_upgrade:${plan}`, (firstName, locale) =>
            planUpgradeEmail({ firstName, planId: plan, unsubscribeUrl: unsubscribeUrl(userId), locale }))
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = await getUserId(sub.customer as string)
        if (!userId) break

        // POS seat quantity or status change
        if (sub.metadata?.type === 'pos_seats') {
          const seats  = sub.items.data[0]?.quantity || 1
          const active = sub.status === 'active' || sub.status === 'trialing'
          const { data: priorProfile } = await supabase.from('profiles').select('pos_enabled').eq('id', userId).single()
          const wasEnabled = priorProfile?.pos_enabled ?? false

          await supabase.from('profiles').update({
            pos_enabled:    active,
            pos_seat_count: active ? seats : 0,
          }).eq('id', userId)

          if (active && !wasEnabled) {
            await claimAndSend(userId, 'pos_seats_welcome', (firstName, locale) =>
              posSeatsWelcomeEmail({ firstName, unsubscribeUrl: unsubscribeUrl(userId), locale }))
          }
          break
        }

        // Main plan update
        const plan = sub.metadata?.plan || 'growth'
        const { data: priorSub } = await supabase.from('subscriptions').select('plan_id').eq('user_id', userId).single()
        const oldRank = PLAN_RANK[priorSub?.plan_id ?? 'free'] ?? 0
        const status = sub.status === 'active' ? 'active'
          : sub.status === 'past_due' ? 'past_due'
          : sub.status === 'trialing' ? 'trialing'
          : 'active'

        await updatePlan(userId, plan, {
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data[0]?.price.id,
          status,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        })

        if ((PLAN_RANK[plan] ?? 0) > oldRank) {
          await claimAndSend(userId, `plan_upgrade:${plan}`, (firstName, locale) =>
            planUpgradeEmail({ firstName, planId: plan, unsubscribeUrl: unsubscribeUrl(userId), locale }))
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = await getUserId(sub.customer as string)
        if (!userId) break

        // POS seat cancellation
        if (sub.metadata?.type === 'pos_seats') {
          await supabase.from('profiles').update({
            pos_enabled:                 false,
            pos_seat_count:              0,
            pos_stripe_subscription_id:  null,
          }).eq('id', userId)
          break
        }

        // Main plan downgrade to free
        await updatePlan(userId, 'free', {
          stripe_subscription_id: sub.id,
          status: 'cancelled',
          cancel_at_period_end: false,
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const userId = await getUserId(invoice.customer as string)
        if (!userId) break

        await supabase.from('billing_events').insert({
          user_id: userId,
          event_type: 'payment.succeeded',
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          stripe_event_id: event.id,
          metadata: { invoice_id: invoice.id },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const userId = await getUserId(invoice.customer as string)
        if (!userId) break

        await supabase.from('subscriptions').update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId)
        break
      }
    }

    // Log all events
    const obj = event.data.object as Stripe.Subscription | Stripe.Checkout.Session | Stripe.Invoice
    const customerId = 'customer' in obj ? obj.customer as string : null
    const userId = customerId ? await getUserId(customerId) : null

    await supabase.from('billing_events').insert({
      user_id: userId,
      event_type: event.type,
      stripe_event_id: event.id,
      metadata: { type: event.type },
    }).onConflict('stripe_event_id').ignore()

  } catch (err) {
    console.error('Webhook error:', err)
  }

  return NextResponse.json({ received: true })
}
