import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('connected_sources')
    .select('id, source_type, name, status, last_synced_at, sync_interval_minutes, error_message, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { source_type, name, credentials, config, sync_interval_minutes = 360 } = body

  if (!source_type || !name) return NextResponse.json({ error: 'source_type and name required' }, { status: 400 })

  // Save source
  const { data: source, error } = await supabase
    .from('connected_sources')
    .insert({ user_id: user.id, source_type, name, credentials, config, sync_interval_minutes })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('audit_log').insert({
    user_id: user.id,
    event: 'source_connected',
    metadata: { source_type, name },
  })

  // Trigger initial sync immediately
  try {
    await runSync(user.id)
  } catch (_) {
    // Don't fail the connection if initial sync fails
  }

  return NextResponse.json(source)
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  await supabase.from('connected_sources').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ deleted: true })
}
