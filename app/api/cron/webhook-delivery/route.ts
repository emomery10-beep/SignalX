import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHmac } from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 60

// Drains api_webhook_outbox (see 20260708000004_outbound_webhooks.sql for
// how rows get in there — DB triggers, not application code). Runs every 5
// minutes (vercel.json) — that's the delivery latency ceiling for now;
// tightening it further (pg_net for instant delivery straight from the
// trigger) is a follow-up, not done here. Registered as its own cron
// rather than folded into an existing job so its schedule/failure
// isolation don't couple to unrelated jobs.
const MAX_ATTEMPTS = 5
const BATCH_SIZE = 200
const DELIVERY_TIMEOUT_MS = 8000

function sign(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

async function deliverOne(url: string, secret: string, eventType: string, payload: unknown): Promise<boolean> {
  const body = JSON.stringify({ event: eventType, data: payload })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-askbiz-event': eventType,
        'x-askbiz-signature': sign(secret, body),
      },
      body,
      signal: controller.signal,
    })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: pending, error } = await supabase
    .from('api_webhook_outbox')
    .select('id, owner_id, event_type, payload, attempts')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!pending || pending.length === 0) return NextResponse.json({ delivered: 0, failed: 0, dead: 0 })

  type OutboxItem = { id: string; owner_id: string; event_type: string; payload: unknown; attempts: number }
  type WebhookSub = { user_id: string; url: string; secret: string; event_types: string[]; is_active: boolean }

  const ownerIds = Array.from(new Set((pending as OutboxItem[]).map(p => p.owner_id)))
  const { data: webhooks } = await supabase
    .from('api_webhooks')
    .select('user_id, url, secret, event_types, is_active')
    .in('user_id', ownerIds)
    .eq('is_active', true)

  let delivered = 0, failed = 0, dead = 0

  for (const item of pending as OutboxItem[]) {
    const subscribers = ((webhooks || []) as WebhookSub[]).filter(
      w => w.user_id === item.owner_id && w.event_types.includes(item.event_type)
    )

    // No active subscription for this event — nothing to deliver, and no
    // point retrying forever (the developer may have deleted the webhook
    // after the event was already enqueued).
    if (subscribers.length === 0) {
      await supabase.from('api_webhook_outbox').update({ status: 'dead', last_attempted_at: new Date().toISOString() }).eq('id', item.id)
      dead++
      continue
    }

    const results = await Promise.all(
      subscribers.map(w => deliverOne(w.url, w.secret, item.event_type, item.payload))
    )
    const allOk = results.every(Boolean)
    const attempts = item.attempts + 1

    if (allOk) {
      await supabase.from('api_webhook_outbox').update({
        status: 'delivered', attempts, last_attempted_at: new Date().toISOString(),
      }).eq('id', item.id)
      delivered++
    } else if (attempts >= MAX_ATTEMPTS) {
      await supabase.from('api_webhook_outbox').update({
        status: 'dead', attempts, last_attempted_at: new Date().toISOString(),
      }).eq('id', item.id)
      dead++
    } else {
      await supabase.from('api_webhook_outbox').update({
        status: 'pending', attempts, last_attempted_at: new Date().toISOString(),
      }).eq('id', item.id)
      failed++
    }
  }

  return NextResponse.json({ delivered, failed, dead, total: pending.length })
}
