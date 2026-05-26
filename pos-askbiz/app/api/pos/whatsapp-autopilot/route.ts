import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

interface AutopilotRule {
  id: string
  trigger: string
  message_template: string
  enabled: boolean
  conditions: Record<string, any>
  last_fired?: string
  fire_count: number
}

const DEFAULT_RULES: Omit<AutopilotRule, 'id'>[] = [
  {
    trigger: 'low_stock',
    message_template: '⚠️ Stock Alert: {{item_name}} is down to {{stock_qty}} units (threshold: {{threshold}}). Time to reorder!',
    enabled: false,
    conditions: {},
    fire_count: 0,
  },
  {
    trigger: 'customer_winback',
    message_template: 'Hi {{customer_name}}! We haven\'t seen you in a while. Come back and enjoy our latest offerings! 🎉',
    enabled: false,
    conditions: { days_since_last_visit: 30, min_total_spent: 50 },
    fire_count: 0,
  },
  {
    trigger: 'post_purchase',
    message_template: 'Thank you for your purchase of {{total}}! 🙏 Your receipt is ready. Visit us again soon!',
    enabled: false,
    conditions: { min_total: 10 },
    fire_count: 0,
  },
  {
    trigger: 'reservation_reminder',
    message_template: 'Hi {{customer_name}}, reminder: your reservation for {{covers}} is tomorrow at {{time}}. See you then! 🍽️',
    enabled: false,
    conditions: { hours_before: 24 },
    fire_count: 0,
  },
  {
    trigger: 'shift_summary',
    message_template: '📊 Shift Summary: {{sales_count}} sales, {{revenue}} revenue, {{margin}}% margin. Top seller: {{top_item}}',
    enabled: false,
    conditions: {},
    fire_count: 0,
  },
  {
    trigger: 'daily_digest',
    message_template: '📈 Daily Digest: {{total_sales}} sales ({{revenue}}), {{new_customers}} new customers. {{alert_summary}}',
    enabled: false,
    conditions: { send_time: '21:00' },
    fire_count: 0,
  },
]

// GET — list autopilot rules
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'manager')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { data: rules } = await service
    .from('whatsapp_autopilot_rules')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: true })

  // Check if WhatsApp is configured
  const { data: settings } = await service
    .from('pos_notification_settings')
    .select('whatsapp_enabled, whatsapp_phone')
    .eq('owner_id', auth.ownerId)
    .single()

  if (!rules?.length) {
    return NextResponse.json({
      rules: DEFAULT_RULES.map((r, i) => ({ ...r, id: `default_${i}` })),
      is_default: true,
      whatsapp_configured: !!settings?.whatsapp_enabled,
      whatsapp_phone: settings?.whatsapp_phone || null,
    })
  }

  return NextResponse.json({
    rules,
    is_default: false,
    whatsapp_configured: !!settings?.whatsapp_enabled,
    whatsapp_phone: settings?.whatsapp_phone || null,
  })
}

// POST — save/update autopilot rules
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'manager')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { rules } = await req.json()

  if (!Array.isArray(rules)) {
    return NextResponse.json({ error: 'rules array required' }, { status: 400 })
  }

  // Delete existing and re-insert
  await service
    .from('whatsapp_autopilot_rules')
    .delete()
    .eq('owner_id', auth.ownerId)

  const inserts = rules.map((r: any) => ({
    owner_id: auth.ownerId,
    trigger: r.trigger,
    message_template: r.message_template,
    enabled: r.enabled ?? false,
    conditions: r.conditions || {},
    fire_count: r.fire_count || 0,
  }))

  const { data, error } = await service
    .from('whatsapp_autopilot_rules')
    .insert(inserts)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rules: data })
}

// PATCH — toggle single rule
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'manager')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { id, enabled, message_template, conditions } = await req.json()

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updates: Record<string, any> = {}
  if (enabled !== undefined) updates.enabled = enabled
  if (message_template) updates.message_template = message_template
  if (conditions) updates.conditions = conditions

  const { data, error } = await service
    .from('whatsapp_autopilot_rules')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rule: data })
}
