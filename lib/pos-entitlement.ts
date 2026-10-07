// Single source of truth for "has this POS owner paid?" and "has their free
// trial lapsed?". The free POS trial is closed (new grants are rejected in
// app/api/billing/route.ts), but trial rows from before the closure still
// exist — those accounts keep selling only until their ends_at, then lock.
//
// Used by posEntitled() (real-time gate on every sale), the billing GET
// lazy-expiry, and the daily pos-trial-expiry cron, so all three always agree.
import type { SupabaseClient } from '@supabase/supabase-js'

// Every payment path that can activate POS seats. Each webhook also sets
// trials.converted, but we check the payment tables too so a webhook that
// half-failed can never lock out someone who really paid.
const PAYMENT_TABLES = ['pesapal_payments', 'mpesa_payments', 'waafipay_billing_payments'] as const

export async function posHasPaid(service: SupabaseClient, ownerId: string): Promise<boolean> {
  const { data: profile } = await service
    .from('profiles')
    .select('pos_stripe_subscription_id')
    .eq('id', ownerId)
    .maybeSingle()
  if (profile?.pos_stripe_subscription_id) return true

  for (const table of PAYMENT_TABLES) {
    const { data } = await service
      .from(table)
      .select('plan')
      .eq('user_id', ownerId)
      .eq('status', 'completed')
      .like('plan', 'pos_seats_%')
      .limit(1)
    if (data && data.length > 0) return true
  }
  return false
}

/**
 * True when the owner has a POS trial row that has ended, was never
 * converted, and no payment exists. Fails OPEN on a read error (returns
 * false): the profile read in posEntitled() already fails closed, and a
 * transient error here must never lock out a paying customer.
 */
export async function posTrialLapsed(service: SupabaseClient, ownerId: string): Promise<boolean> {
  const { data: trial, error } = await service
    .from('trials')
    .select('ends_at, converted')
    .eq('user_id', ownerId)
    .eq('trial_type', 'pos')
    .maybeSingle()
  if (error || !trial) return false
  if (trial.converted) return false
  if (new Date(trial.ends_at).getTime() > Date.now()) return false
  return !(await posHasPaid(service, ownerId))
}
