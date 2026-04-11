import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    { count: queryCount },
    { count: fileCount },
    { count: alertCount },
    { count: forecastCount },
    { count: exportCount },
    { data: recentLogs },
    { data: profile },
    { data: alertsFired },
  ] = await Promise.all([
    supabase.from('audit_log').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('event', 'ai_query'),
    supabase.from('uploads').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
    supabase.from('forecasts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('exports').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('audit_log').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(25),
    supabase.from('profiles').select('region, currency, sector_hints, plan, business_type').eq('id', user.id).single(),
    supabase.from('alert_events').select('*, alerts(name)').order('fired_at', { ascending: false }).limit(5),
  ])

  return NextResponse.json({
    stats: {
      queries: queryCount || 0,
      files: fileCount || 0,
      alerts: alertCount || 0,
      forecasts: forecastCount || 0,
      exports: exportCount || 0,
    },
    profile,
    recentLogs: recentLogs || [],
    alertsFired: alertsFired || [],
  })
}
