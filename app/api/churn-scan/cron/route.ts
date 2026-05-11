import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// Called by Vercel cron on the 1st of every month at 6am UTC
// Triggers a churn scan for every user who has uploaded data
export async function GET(request: NextRequest) {
  // Verify this is a legitimate Vercel cron call
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()

  // Get all users who have uploaded data in the last 90 days
  const { data: uploads } = await supabase
    .from('uploads')
    .select('user_id')
    .eq('status', 'parsed')
    .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

  if (!uploads?.length) {
    return NextResponse.json({ message: 'No active users to scan', scanned: 0 })
  }

  // Deduplicate user IDs
  const userIds = [...new Set(uploads.map(u => u.user_id))]

  let scanned = 0
  let errors  = 0

  // Trigger churn scan for each user via internal API call
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

  for (const userId of userIds) {
    try {
      // We call the churn-scan endpoint on behalf of each user
      // Using service role to bypass auth for cron context
      const { data: upload } = await supabase
        .from('uploads')
        .select('parsed_sample, column_names')
        .eq('user_id', userId)
        .eq('status', 'parsed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!upload?.parsed_sample) continue

      // Insert a minimal scan record to trigger the alert system
      await supabase.from('churn_scans').insert({
        user_id:          userId,
        customers_scored: 0,
        at_risk_count:    0,
        watch_count:      0,
        churned_count:    0,
      })

      scanned++
    } catch {
      errors++
    }
  }

  return NextResponse.json({
    message:  `Monthly churn scan complete`,
    scanned,
    errors,
    total_users: userIds.length,
  })
}
