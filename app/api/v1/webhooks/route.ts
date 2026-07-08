import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'

// Session-authenticated (mirrors /api/v1/keys) — managing webhook endpoints
// is an account-settings action, not a per-request API call, so it's driven
// from the developer dashboard rather than gated by x-api-key.
const ALLOWED_EVENTS = ['sale.created', 'purchase_order.received', 'stock.low'] as const

function generateSecret(): string {
  return `whsec_${randomBytes(24).toString('hex')}`
}

// ── GET — list webhooks for the logged-in user ─────────────────────────────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: webhooks, error } = await supabase
    .from('api_webhooks')
    .select('id, url, event_types, is_active, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // Secret is never returned after creation — same "show once" pattern as API keys.
  return NextResponse.json({ webhooks: webhooks || [] })
}

// ── POST — register a new webhook ───────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { url, event_types } = body

  if (!url || typeof url !== 'string' || !/^https:\/\//.test(url)) {
    return NextResponse.json({ error: '"url" must be an https:// URL' }, { status: 400 })
  }
  if (!Array.isArray(event_types) || event_types.length === 0 || event_types.some((e: string) => !ALLOWED_EVENTS.includes(e as typeof ALLOWED_EVENTS[number]))) {
    return NextResponse.json({ error: `"event_types" must be a non-empty array from: ${ALLOWED_EVENTS.join(', ')}` }, { status: 400 })
  }

  const { count } = await supabase
    .from('api_webhooks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
  if ((count || 0) >= 10) {
    return NextResponse.json({ error: 'Maximum of 10 webhooks per account.' }, { status: 400 })
  }

  const secret = generateSecret()
  const { data, error } = await supabase
    .from('api_webhooks')
    .insert({ user_id: user.id, url, event_types, secret })
    .select('id, url, event_types, is_active, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    webhook: { ...data, secret },
    warning: 'Copy this secret now — used to verify the x-askbiz-signature header on deliveries. It will not be shown again.',
  })
}

// ── PATCH — toggle active status or change subscribed events ──────────────
export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, is_active, event_types } = body
  if (!id) return NextResponse.json({ error: 'Webhook id required' }, { status: 400 })

  const update: Record<string, unknown> = {}
  if (is_active !== undefined) update.is_active = is_active
  if (event_types !== undefined) {
    if (!Array.isArray(event_types) || event_types.some((e: string) => !ALLOWED_EVENTS.includes(e as typeof ALLOWED_EVENTS[number]))) {
      return NextResponse.json({ error: `"event_types" must be from: ${ALLOWED_EVENTS.join(', ')}` }, { status: 400 })
    }
    update.event_types = event_types
  }

  const { data, error } = await supabase
    .from('api_webhooks')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, url, event_types, is_active, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, webhook: data })
}

// ── DELETE — remove a webhook ────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Webhook id required' }, { status: 400 })

  const { error } = await supabase
    .from('api_webhooks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
