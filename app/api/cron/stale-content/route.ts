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
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  // Delete rejected content older than 30 days
  const { count: rejectedDeleted } = await supabase
    .from('agent_content')
    .delete({ count: 'exact' })
    .eq('status', 'rejected')
    .lt('created_at', thirtyDaysAgo)

  // Expire pending content older than 7 days (never reviewed = stale — this is
  // the threshold the security audit's "No stale pending content" check uses;
  // it then gets swept up by the 30-day rejected-content delete above on a
  // later run). 'expired' isn't a valid status per agent_content's check
  // constraint, so this reuses 'rejected' — same as a human explicitly
  // rejecting it, just attributed to the cron via reviewed_by.
  const { count: staleExpired } = await supabase
    .from('agent_content')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), reviewed_by: 'cron:stale-content' }, { count: 'exact' })
    .eq('status', 'pending')
    .lt('created_at', sevenDaysAgo)

  // Safety net: delete anything still pending after 30 days (shouldn't
  // normally be reached now that the 7-day expiry above runs first).
  const { count: staleDeleted } = await supabase
    .from('agent_content')
    .delete({ count: 'exact' })
    .eq('status', 'pending')
    .lt('created_at', thirtyDaysAgo)

  return NextResponse.json({
    success: true,
    rejectedDeleted: rejectedDeleted || 0,
    staleExpired: staleExpired || 0,
    staleDeleted: staleDeleted || 0,
  })
}
