import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sanitizeName } from '@/lib/sanitize'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const allowed = [
    'first_name', 'last_name', 'business_name',
    'business_type', 'factory_type', 'currency', 'currency_symbol',
    'region', 'sector_hints', 'onboarded',
    'phone', 'address', 'town', 'county', 'postcode',
    'whatsapp_number', 'notify_whatsapp', 'notify_email_alerts', 'notify_digest_hour',
    // Manual "not yet sellable" hold override — for a factory type outside
    // the 12-template library, which has no per-recipe holdRule to
    // auto-detect from (see pos-askbiz/lib/factory-holds.ts).
    'factory_hold_enabled', 'factory_hold_days', 'factory_hold_label',
  ]
  // Name-like fields are shown back in the admin panel, in emails, on receipts
  // and in WhatsApp messages, so markup and control characters are stripped on
  // the way in rather than trusting every one of those consumers to escape.
  // Each cap is per-field: sector_hints is a comma-joined list and address is a
  // multi-line postal address, so a shared 120-char cap would silently truncate
  // real data.
  const NAME_LIKE: Record<string, number> = {
    first_name: 120, last_name: 120, business_name: 120, factory_type: 120,
    factory_hold_label: 120, town: 120, county: 120, postcode: 32,
    address: 300, sector_hints: 500,
  }

  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (!(key in body)) continue
    update[key] = key in NAME_LIKE && typeof body[key] === 'string'
      ? sanitizeName(body[key], NAME_LIKE[key])
      : body[key]
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
