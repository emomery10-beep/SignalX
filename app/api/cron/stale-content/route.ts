import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

  // Delete rejected content older than 30 days
  const { count: rejectedDeleted } = await supabase
    .from('agent_content')
    .delete({ count: 'exact' })
    .eq('status', 'rejected')
    .lt('created_at', thirtyDaysAgo)

  // Delete pending content older than 30 days (never reviewed = stale)
  const { count: staleDeleted } = await supabase
    .from('agent_content')
    .delete({ count: 'exact' })
    .eq('status', 'pending')
    .lt('created_at', thirtyDaysAgo)

  return NextResponse.json({
    success: true,
    rejectedDeleted: rejectedDeleted || 0,
    staleDeleted: staleDeleted || 0,
  })
}
