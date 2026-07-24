import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function GET() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('data_consent, training_consent, data_consent_at, training_consent_at')
    .eq('id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ consent: data })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data_consent, training_consent } = await request.json()

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const ipHash = createHash('sha256').update(ip + (process.env.IP_HASH_SALT || 'askbiz-salt')).digest('hex')

  const { data, error } = await supabase.rpc('update_consent', {
    p_user_id: user.id,
    p_data_consent: data_consent,
    p_training_consent: training_consent,
    p_ip_hash: ipHash,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
