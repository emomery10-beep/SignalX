import Stripe from 'stripe'

// One Stripe customer per AskBiz user, shared across every billing surface
// (main plan, POS seats, and the developer API) — extracted from
// app/api/billing/route.ts so the new developer-API subscription flow
// (app/api/v1/keys/subscription/route.ts) reuses the exact same customer
// instead of creating a second one per human. Keyed off subscriptions.stripe_customer_id,
// the same column billing/route.ts already reads/writes.
export async function getOrCreateStripeCustomer(
  stripe: Stripe,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  user: { id: string; email?: string | null }
): Promise<string> {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  const existing = (sub as { stripe_customer_id?: string } | null)?.stripe_customer_id
  if (existing) return existing

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
  const customer = await stripe.customers.create({
    email: user.email!,
    name: (profile as { full_name?: string } | null)?.full_name || user.email!,
    metadata: { supabase_user_id: user.id },
  })

  await supabase.from('subscriptions').upsert({
    user_id: user.id, stripe_customer_id: customer.id, plan_id: 'free', status: 'active',
  }, { onConflict: 'user_id' })

  return customer.id
}
