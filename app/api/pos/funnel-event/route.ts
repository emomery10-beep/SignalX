import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { POS_FUNNEL_EVENTS } from '@/lib/funnel-track'

export const runtime = 'nodejs'

const ALLOWED_EVENTS = new Set<string>(POS_FUNNEL_EVENTS)

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const event = typeof body?.event === 'string' ? body.event : ''
  if (!ALLOWED_EVENTS.has(event)) return NextResponse.json({ ok: false }, { status: 400 })

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const businessType = typeof body?.business_type === 'string' ? body.business_type.slice(0, 32) : null
  const metadata = body?.metadata && typeof body.metadata === 'object' ? body.metadata : {}

  const { error } = await supabase.from('pos_trial_funnel_events').insert({
    user_id: user.id,
    event,
    business_type: businessType,
    metadata,
  })
  if (error) console.error('[funnel-event] insert failed:', error)

  return NextResponse.json({ ok: true })
}
