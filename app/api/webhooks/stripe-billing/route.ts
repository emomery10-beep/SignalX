import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

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

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const plan = session.metadata?.plan || 'growth'
        if (!userId) break

        // Update customer ID if not set
        await supabase.from('subscriptions').update({
          stripe_customer_id: session.customer as string,
        }).eq('user_id', userId)

        await updatePlan(userId, plan, {
          stripe_subscription_id: session.subscription as string,
          status: 'active',
        })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = await getUserId(sub.customer as string)
        if (!userId) break

        const plan = sub.metadata?.plan || 'growth'
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
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = await getUserId(sub.customer as string)
        if (!userId) break

        // Downgrade to free
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
