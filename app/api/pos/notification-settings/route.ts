import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// pos_notification_settings (supabase/migrations/032_pos_intelligence_notifications.sql)
// gates the CUSTOMER-facing WhatsApp/email sends (salon booking confirmations,
// restaurant order confirmations, repair quotes/ready, logistics delivery
// updates — see pos-askbiz/app/api/pos/notifications/send/route.ts and this
// app's own app/api/pos/notifications/send/route.ts, both of which only ever
// .select() this table). This route is the only write path for it. It is
// intentionally separate from /api/profile's `notify_whatsapp`, which is the
// merchant's own personal alert preference on a different table/column.
//
// owner_id has a UNIQUE constraint but the table shipped with only SELECT/
// UPDATE RLS policies — no INSERT policy, so a first-time save couldn't go
// through the user's own RLS-scoped session. The missing policy is now added
// in 20260731000002_pos_notification_settings_insert_rls.sql, but this route
// still authenticates with the normal session client and performs the actual
// write with the service client, always forcing owner_id to the authenticated
// user's id (never taken
// from the request body).

const DEFAULTS = {
  // The table's own DEFAULT is `true`, but since no row exists for anyone yet
  // and whatsapp_phone starts empty, defaulting the toggle "on" would present
  // a channel that can't actually send. Default it off until a merchant sets
  // a real number and turns it on themselves.
  whatsapp_enabled: false,
  whatsapp_phone: '',
  email_enabled: true,
  email_address: '',
  inventory_alerts_enabled: true,
  inventory_alert_threshold: 5,
  sales_anomaly_alerts_enabled: true,
  sales_anomaly_threshold_percent: 25,
  cash_variance_alerts_enabled: true,
  cash_variance_threshold_amount: 500,
  tax_reminder_alerts_enabled: true,
  tax_reminder_days_before: 7,
}

const SELECT_COLUMNS = Object.keys(DEFAULTS).join(', ')

// Loose E.164-ish check: optional leading +, 7-15 digits after stripping
// spaces/dashes/parens. Good enough to reject "on but empty/garbage" without
// being a full libphonenumber validation.
function isPhoneShaped(raw: string): boolean {
  const stripped = raw.replace(/[\s\-()]/g, '')
  return /^\+?[1-9]\d{6,14}$/.test(stripped)
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('pos_notification_settings')
    .select(SELECT_COLUMNS)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ...DEFAULTS, ...(data || {}) })
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const allowed = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]
  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  // Merge with existing (or default) values so a partial PATCH can still be
  // validated against the resulting whole state — e.g. flipping
  // whatsapp_enabled=true in a request that doesn't also carry a phone number
  // for the first time should still be rejected if there's no existing phone.
  const service = createServiceClient()
  const { data: existing } = await service
    .from('pos_notification_settings')
    .select(SELECT_COLUMNS)
    .eq('owner_id', user.id)
    .maybeSingle()

  const merged = { ...DEFAULTS, ...(existing || {}), ...update }

  if (merged.whatsapp_enabled) {
    const phone = String(merged.whatsapp_phone || '').trim()
    if (!phone || !isPhoneShaped(phone)) {
      return NextResponse.json(
        { error: 'whatsapp_phone must be a valid phone number (with country code) to enable WhatsApp notifications' },
        { status: 400 }
      )
    }
  }

  const { data, error } = await service
    .from('pos_notification_settings')
    .upsert({ owner_id: user.id, ...update }, { onConflict: 'owner_id' })
    .select(SELECT_COLUMNS)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
