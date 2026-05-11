import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { normaliseStripe } from '@/lib/sync/normaliser'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // ── Verify Stripe signature — NEVER skip this ─────────────────────────────
  if (!sig || !webhookSecret) {
    console.error('Missing Stripe signature or webhook secret')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const payload = event.data.object as Record<string, unknown>

  await supabase.from('webhook_events').insert({
    source_type: 'stripe',
    event_type: event.type,
    payload: event,
  })

  // Only process payment events
  const paymentEvents = ['payment_intent.succeeded', 'charge.succeeded', 'checkout.session.completed']
  if (!paymentEvents.includes(event.type)) {
    return NextResponse.json({ received: true })
  }

  if (!payload) return NextResponse.json({ received: true })

  // Find user's Stripe source by matching account
  const { data: source } = await supabase
    .from('connected_sources')
    .select('id, user_id')
    .eq('source_type', 'stripe')
    .single()

  if (!source) return NextResponse.json({ received: true })

  const record = normaliseStripe(payload)
  await supabase.from('unified_data').upsert(
    [{ ...record, user_id: source.user_id, source_id: source.id, updated_at: new Date().toISOString() }],
    { onConflict: 'user_id,source_type,source_record_id', ignoreDuplicates: false }
  )

  await supabase.from('webhook_events').update({ processed: true }).eq('source_type', 'stripe').eq('processed', false)

  return NextResponse.json({ received: true })
}
