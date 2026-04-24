import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'

// POST /api/sync — manual sync trigger (authenticated user)
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sourceId } = await request.json().catch(() => ({}))

  try {
    const results = await runSync(user.id)
    const filtered = sourceId ? results.filter(r => r.sourceId === sourceId) : results
    return NextResponse.json({ results: filtered, synced: filtered.length })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Sync failed' }, { status: 500 })
  }
}

// GET /api/sync — cron job endpoint (runs every 6 hours via Vercel cron)
// Vercel calls this automatically — no auth needed but we verify the cron secret
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // In production, verify the cron secret Vercel sends
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await runSync() // runs for ALL active users
    const total = results.reduce((s, r) => s + r.recordsSynced, 0)
    return NextResponse.json({
      message: `Cron sync complete`,
      sources: results.length,
      totalRecords: total,
      results,
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Cron sync failed' }, { status: 500 })
  }
}
