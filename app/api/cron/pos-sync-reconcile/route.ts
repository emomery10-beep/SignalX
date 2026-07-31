// app/api/cron/pos-sync-reconcile/route.ts
//
// Freshness/reconciliation check for the POS → unified_data pipeline
// (sync_pos_to_unified_data() trigger, 018_pos.sql + the 20260725 fixes).
// That trigger is the ONLY thing that writes a merchant's cash-sale revenue
// into unified_data — the table CFO snapshots, benchmarks, health scores,
// and daily briefs read from — but it runs silently inside a DB transaction
// with zero application-level logging. If it's ever dropped, disabled, or
// starts erroring (schema drift, a bad migration, etc.), nothing today
// would notice: pos_transactions keeps recording sales fine, so the outage
// is invisible everywhere except a quiet gap in cross-channel BI.
//
// This does NOT try to re-derive or backfill unified_data itself — it only
// flags the gap as a real alert (same alert-only pattern as
// shipment-reconcile) so it's visible instead of silent. Backfilling would
// need to duplicate the trigger's own margin/COGS calculation here, which
// risks drifting from the trigger's real logic — better to alert a human
// to check the trigger than to guess at its math in a second place.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Check yesterday (UTC), not today — today isn't over yet, so an
  // in-progress day with no unified_data row yet would just be noise.
  const now = new Date()
  const yesterday = new Date(now.getTime() - 86400000)
  const targetDate = yesterday.toISOString().slice(0, 10)

  const { data: sales, error: salesErr } = await supabase
    .from('pos_transactions')
    .select('owner_id')
    .eq('status', 'completed')
    .gte('created_at', `${targetDate}T00:00:00`)
    .lte('created_at', `${targetDate}T23:59:59`)
    .limit(5000)

  if (salesErr) return NextResponse.json({ error: salesErr.message }, { status: 500 })
  if (!sales?.length) return NextResponse.json({ message: 'No completed POS sales for target date', date: targetDate, checked: 0, flagged: 0 })

  const ownersWithSales = Array.from(new Set(sales.map(s => s.owner_id)))

  const { data: synced, error: syncedErr } = await supabase
    .from('unified_data')
    .select('user_id')
    .eq('channel', 'pos')
    .eq('record_date', targetDate)
    .in('user_id', ownersWithSales)

  if (syncedErr) return NextResponse.json({ error: syncedErr.message }, { status: 500 })

  const syncedOwners = new Set((synced || []).map(r => r.user_id))
  const missing = ownersWithSales.filter(id => !syncedOwners.has(id))

  if (!missing.length) {
    return NextResponse.json({ message: 'All POS sales reconciled', date: targetDate, checked: ownersWithSales.length, flagged: 0 })
  }

  let flagged = 0
  for (const ownerId of missing) {
    const { error } = await supabase.from('alerts').upsert({
      user_id: ownerId,
      type: 'pos_sync_gap',
      title: 'POS sales missing from cross-channel reporting',
      message: `Completed POS sales on ${targetDate} have no matching entry in unified_data. CFO snapshot, benchmarks, and health score reads for this date may be incomplete. Check the sync_pos_to_unified_data trigger.`,
      is_active: true,
      metadata: { date: targetDate },
    }, { onConflict: 'user_id,type' })
    if (!error) flagged++
  }

  return NextResponse.json({ success: true, date: targetDate, checked: ownersWithSales.length, missing: missing.length, flagged })
}
