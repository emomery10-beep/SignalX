import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Session-authenticated (mirrors /api/v1/webhooks) — surfaces the
// api_webhook_outbox rows that were already being recorded (status/attempts/
// last_attempted_at) but never exposed to the dashboard.
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: webhook, error: webhookError } = await supabase
    .from('api_webhooks')
    .select('id, event_types')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (webhookError || !webhook) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })

  const { data: deliveries, error } = await supabase
    .from('api_webhook_outbox')
    .select('id, event_type, status, attempts, last_attempted_at, created_at')
    .eq('owner_id', user.id)
    .in('event_type', webhook.event_types.length > 0 ? webhook.event_types : [''])
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deliveries: deliveries || [] })
}
