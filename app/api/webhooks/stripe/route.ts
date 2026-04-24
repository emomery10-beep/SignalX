import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { normaliseStripe } from '@/lib/sync/normaliser'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  // In production: verify with Stripe webhook secret
  // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)

  const supabase = createServiceClient()
  const payload = JSON.parse(body)

  await supabase.from('webhook_events').insert({
    source_type: 'stripe',
    event_type: payload.type || 'unknown',
    payload,
  })

  // Only process payment events
  const paymentEvents = ['payment_intent.succeeded', 'charge.succeeded', 'checkout.session.completed']
  if (!paymentEvents.includes(payload.type)) {
    return NextResponse.json({ received: true })
  }

  const paymentData = payload.data?.object
  if (!paymentData) return NextResponse.json({ received: true })

  // Find user's Stripe source by matching account
  const { data: source } = await supabase
    .from('connected_sources')
    .select('id, user_id')
    .eq('source_type', 'stripe')
    .single()

  if (!source) return NextResponse.json({ received: true })

  const record = normaliseStripe(paymentData)
  await supabase.from('unified_data').upsert(
    [{ ...record, user_id: source.user_id, source_id: source.id, updated_at: new Date().toISOString() }],
    { onConflict: 'user_id,source_type,source_record_id', ignoreDuplicates: false }
  )

  await supabase.from('webhook_events').update({ processed: true }).eq('source_type', 'stripe').eq('processed', false)

  return NextResponse.json({ received: true })
}
