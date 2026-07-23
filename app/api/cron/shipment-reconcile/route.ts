// app/api/cron/shipment-reconcile/route.ts
// Backstop for the 17Track webhook: shipment status only ever changes when
// api/webhooks/17track fires. If a push is ever missed, a shipment can go
// stale silently. This does NOT re-poll 17Track directly — there's no other
// call to a "current status" endpoint anywhere in this codebase to model
// the request/response shape on (only /register and /push-for-new-lookup
// are used, in app/api/track/route.ts), and guessing that contract risked
// shipping a cron that silently no-ops or errors against a paid API with no
// way to verify it here. Instead this flags staleness as a real alert
// through the existing shipment_alerts pipeline so it's visible in the
// Business-plan alerts banner and daily brief — same as any other alert.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const STALE_AFTER_MS = 48 * 3600000

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: active } = await supabase
    .from('shipments')
    .select('id, user_id, tracking_number, sku, updated_at, created_at')
    .not('track_status', 'in', '("Delivered","Undelivered","Expired")')
    .limit(500)

  const cutoff = Date.now() - STALE_AFTER_MS
  const stale = (active || []).filter(s => {
    const lastTouched = s.updated_at || s.created_at
    return lastTouched && new Date(lastTouched).getTime() < cutoff
  })

  if (!stale.length) {
    return NextResponse.json({ message: 'No stale shipments', checked: active?.length || 0, flagged: 0 })
  }

  let flagged = 0
  for (const shipment of stale) {
    // Same 24h dedup pattern as the 17Track webhook handler
    const { data: recentAlert } = await supabase
      .from('shipment_alerts')
      .select('id')
      .eq('shipment_id', shipment.id)
      .eq('alert_type', 'delay')
      .gte('created_at', new Date(Date.now() - 86400000).toISOString())
      .single()

    if (recentAlert) continue

    await supabase.from('shipment_alerts').insert({
      user_id: shipment.user_id,
      shipment_id: shipment.id,
      tracking_number: shipment.tracking_number,
      alert_type: 'delay',
      alert_level: 'warning',
      message: `No tracking update for ${shipment.tracking_number}${shipment.sku ? ` (${shipment.sku})` : ''} in over 48 hours. Check status directly on 17Track.`,
      financial_impact: 0,
      delay_days: null,
      is_read: false,
    })
    flagged++
  }

  return NextResponse.json({ success: true, checked: active?.length || 0, stale: stale.length, flagged })
}
