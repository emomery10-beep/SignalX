import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function GET() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Selects all 6 consent-like purposes. camera_consent/logistics_consent
  // and collective_opt_in/market_intelligence_opt_in were previously
  // omitted here — the frontend silently fell back to hardcoded defaults
  // for the former, and the latter went through a separate unaudited
  // direct-write path. See migration 20260807000001_camera_logistics_consent.
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'data_consent, training_consent, data_consent_at, training_consent_at, ' +
      'camera_consent, camera_consent_at, logistics_consent, logistics_consent_at, ' +
      'collective_opt_in, collective_opted_at, market_intelligence_opt_in, market_intelligence_opted_at'
    )
    .eq('id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ consent: data })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Every field is optional — a caller can update a single purpose (e.g.
  // just collective_opt_in) without needing to know or resend the others.
  // update_consent() only touches/logs purposes that are actually present.
  const {
    data_consent, training_consent, camera_consent, logistics_consent,
    collective_opt_in, market_intelligence_opt_in,
  } = await request.json()

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const ipHash = createHash('sha256').update(ip + (process.env.IP_HASH_SALT || 'askbiz-salt')).digest('hex')

  const { data, error } = await supabase.rpc('update_consent', {
    p_user_id: user.id,
    p_data_consent: data_consent ?? null,
    p_training_consent: training_consent ?? null,
    p_camera_consent: camera_consent ?? null,
    p_logistics_consent: logistics_consent ?? null,
    p_collective_opt_in: collective_opt_in ?? null,
    p_market_intelligence_opt_in: market_intelligence_opt_in ?? null,
    p_ip_hash: ipHash,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
