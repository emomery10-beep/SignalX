import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Session-authenticated. Lets a developer confirm their endpoint + secret
// actually work before going live, without waiting for a real sale/PO/stock
// event. Inserts straight into api_webhook_outbox so the existing 5-minute
// cron sweep (app/api/cron/webhook-delivery) delivers and signs it exactly
// like a real event — no separate delivery path to keep in sync.
// A service-role client is required because api_webhook_outbox only grants
// owners SELECT (writes are meant to come from trigger functions / the cron);
// ownership is verified against the session user first, so this never lets a
// developer enqueue a delivery for someone else's webhook.
export async function POST(request: Request, { params }: { params: { id: string } }) {
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
  if (webhook.event_types.length === 0) {
    return NextResponse.json({ error: 'This webhook has no subscribed events to test.' }, { status: 400 })
  }

  const eventType = webhook.event_types[0]
  const serviceClient = createServiceClient()
  const { data: delivery, error } = await serviceClient
    .from('api_webhook_outbox')
    .insert({
      owner_id: user.id,
      event_type: eventType,
      payload: { test: true, message: 'This is a test event sent from the AskBiz developer dashboard.', sent_at: new Date().toISOString() },
    })
    .select('id, event_type, status, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, delivery, note: 'Queued — delivered within ~5 minutes by the next cron sweep.' })
}
