import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { evaluateAllAlerts, autoDetectAlerts, type AlertCondition } from '@/lib/alerts'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('alerts')
    .select('*, alert_events(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Auto-detect mode
  if (body.autoDetect && body.uploadId) {
    const { data: upload } = await supabase
      .from('uploads')
      .select('parsed_sample, column_names')
      .eq('id', body.uploadId)
      .single()

    if (!upload) return NextResponse.json({ error: 'Upload not found' }, { status: 404 })

    const rows = upload.parsed_sample as Record<string, unknown>[]
    const headers = upload.column_names as string[]
    const suggestions = autoDetectAlerts(rows, headers)
    return NextResponse.json({ suggestions })
  }

  // Create alert
  const { data, error } = await supabase.from('alerts').insert({
    user_id: user.id,
    upload_id: body.uploadId,
    name: body.name,
    alert_type: body.alertType,
    condition: body.condition || '',
    threshold: body.threshold,
    column_name: body.column,
    is_active: true,
    notify_email: body.notifyEmail ?? true,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH — evaluate all active alerts against latest dataset
export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { uploadId } = await request.json()

  const [{ data: alertsData }, { data: upload }] = await Promise.all([
    supabase.from('alerts').select('*').eq('user_id', user.id).eq('is_active', true),
    supabase.from('uploads').select('parsed_sample').eq('id', uploadId).single(),
  ])

  if (!alertsData?.length || !upload?.parsed_sample) return NextResponse.json({ fired: [] })

  const conditions: AlertCondition[] = alertsData.map(a => ({
    id: a.id, name: a.name, alertType: a.alert_type,
    column: a.column_name, operator: '<' as const,
    threshold: a.threshold, notifyEmail: a.notify_email,
  }))

  const rows = upload.parsed_sample as Record<string, unknown>[]
  const fired = evaluateAllAlerts(conditions, rows)

  // Save fired events
  for (const f of fired) {
    await supabase.from('alert_events').insert({
      alert_id: f.alertId, message: f.message, data: { rows: f.rows },
    })
    await supabase.from('alerts').update({
      last_fired_at: new Date().toISOString(),
      fire_count: supabase.rpc('increment', { x: 1 }),
    }).eq('id', f.alertId)
  }

  return NextResponse.json({ fired })
}
