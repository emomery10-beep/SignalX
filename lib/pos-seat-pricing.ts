import type { SupabaseClient } from '@supabase/supabase-js'
import { posHasPaid } from '@/lib/pos-entitlement'

/**
 * Mobile-money seat purchases send the TOTAL seats wanted. Charge only for
 * the seats not already paid for, so a 5-seat account adding one seat pays for
 * one — and can never be charged again for seats it already has. The payment
 * is still recorded as `pos_seats_<total>`, which the callbacks set directly.
 */
export async function seatsToCharge(
  supabase: SupabaseClient,
  userId: string,
  wantedTotal: number,
): Promise<{ total: number; current: number; charge: number }> {
  const { data } = await supabase
    .from('profiles').select('pos_enabled, pos_seat_count, pos_stripe_subscription_id').eq('id', userId).single()
  const p = data as { pos_enabled?: boolean; pos_seat_count?: number; pos_stripe_subscription_id?: string } | null
  // Only seats actually PAID FOR are credited. A free-trial account has seats enabled but has paid nothing, so
  // its first purchase is charged in full — a new user and a trial user follow the same policy: pay for every
  // seat you ask for, minus what you already pay for.
  const paid = !!p?.pos_enabled && (!!p?.pos_stripe_subscription_id || await posHasPaid(supabase as any, userId))
  const current = paid ? Math.max(0, Number(p?.pos_seat_count) || 0) : 0
  const total = Math.max(1, Math.min(50, wantedTotal))
  return { total, current, charge: Math.max(0, total - current) }
}
