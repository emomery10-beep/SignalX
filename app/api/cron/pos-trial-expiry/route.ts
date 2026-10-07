// app/api/cron/pos-trial-expiry/route.ts
//
// The free POS trial is closed; pre-closure trials run to their ends_at and
// then must lock. Before this cron, expiry only ran when the owner happened
// to open /api/billing — 38 of 39 expired trials were still selling for free.
//
// posEntitled() already blocks sales in real time for a lapsed trial; this
// cron clears the stored flag (profiles.pos_enabled) so every screen that
// reads it directly (/pos, admin, daily brief) agrees. Anyone with a Stripe
// subscription or a completed M-Pesa/PesaPal/WaafiPay seat payment is never
// touched — see lib/pos-entitlement.ts.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { posHasPaid } from '@/lib/pos-entitlement'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: lapsed, error } = await service
    .from('trials')
    .select('user_id')
    .eq('trial_type', 'pos')
    .eq('converted', false)
    .lte('ends_at', new Date().toISOString())
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let locked = 0
  let skippedPaid = 0
  for (const row of lapsed || []) {
    const userId = row.user_id as string
    const { data: profile } = await service
      .from('profiles').select('pos_enabled').eq('id', userId).maybeSingle()
    if (!profile?.pos_enabled) continue
    if (await posHasPaid(service, userId)) {
      // Paid but the webhook never set converted — repair it, don't lock.
      await service.from('trials').update({ converted: true }).eq('user_id', userId).eq('trial_type', 'pos')
      skippedPaid++
      continue
    }
    const { error: upErr } = await service
      .from('profiles').update({ pos_enabled: false, pos_seat_count: 0 }).eq('id', userId)
    if (!upErr) locked++
  }

  return NextResponse.json({ checked: lapsed?.length ?? 0, locked, skippedPaid })
}
