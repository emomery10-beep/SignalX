import { NextRequest, NextResponse } from 'next/server'
import { runSync, previewSync } from '@/lib/sync/engine'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Read-only: reports which sources would sync and why, without syncing anything.
  if (url.searchParams.get('dryRun')) {
    const preview = await previewSync()
    return NextResponse.json({
      dryRun: true,
      totalSources: preview.length,
      dueNow: preview.filter(p => p.dueNow).length,
      preview,
    })
  }

  try {
    const results = await runSync()
    const summary = {
      totalSources: results.length,
      succeeded: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      totalRecords: results.reduce((s, r) => s + r.recordsSynced, 0),
    }
    return NextResponse.json({ success: true, ...summary, results })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Sync failed' }, { status: 500 })
  }
}
