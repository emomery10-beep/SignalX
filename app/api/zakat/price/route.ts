import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/get-currency'
import { fetchNisabPrice } from '@/lib/zakat-price'
import { computeZakat } from '@/lib/zakat'

export const dynamic = 'force-dynamic'

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// POST only, by design — this fires solely on an explicit user action (the
// "check current price" button). No GET, no cron, no auto-refresh: that's
// what keeps this off the Serper bill except when someone actually asks.
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorized' }, 401)

  const body = await request.json().catch(() => ({}))
  const { currency } = await getUserLocale(supabase, user.id)

  let metal: 'gold' | 'silver'
  if (body?.metal === 'gold' || body?.metal === 'silver') {
    metal = body.metal
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('zakat_nisab_metal')
      .eq('id', user.id)
      .single()
    metal = profile?.zakat_nisab_metal === 'gold' ? 'gold' : 'silver'
  }

  const priceResult = await fetchNisabPrice(metal, currency)
  if (!priceResult) {
    return json({ error: 'Could not fetch a current price. Try again shortly.' }, 502)
  }

  // Checking a metal's price also selects it — each metal's value/timestamp
  // is cached independently, so switching back to the other metal later
  // doesn't lose what was last checked for it.
  await supabase
    .from('profiles')
    .update(
      metal === 'gold'
        ? { zakat_nisab_metal: metal, zakat_nisab_gold_value: priceResult.nisabValue, zakat_nisab_gold_checked_at: priceResult.checkedAt }
        : { zakat_nisab_metal: metal, zakat_nisab_silver_value: priceResult.nisabValue, zakat_nisab_silver_checked_at: priceResult.checkedAt }
    )
    .eq('id', user.id)

  // Return the full recomputed zakat position (not just the price) so the
  // caller can update in one round trip instead of following up with a
  // separate GET /api/zakat — the new nisab value can flip aboveNisab/hawl
  // state, and the client needs that too, not just the raw price.
  const result = await computeZakat(supabase, user.id)
  return json({ ...result, priceCheck: priceResult })
}
