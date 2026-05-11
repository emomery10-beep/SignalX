import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — list dashboards with tile count
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('dashboards')
    .select('*, dashboard_tiles(count)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — create dashboard or add tile
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Adding a tile to existing dashboard
  if (body.dashboard_id && body.tile_type) {
    const { data, error } = await supabase
      .from('dashboard_tiles')
      .insert({
        dashboard_id: body.dashboard_id,
        tile_type: body.tile_type,
        title: body.title,
        config: body.config || {},
        position: body.position || 0,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Update dashboard updated_at
    await supabase.from('dashboards').update({ updated_at: new Date().toISOString() }).eq('id', body.dashboard_id)
    await supabase.from('audit_log').insert({ user_id: user.id, event: 'tile_saved', metadata: { dashboard_id: body.dashboard_id, tile_type: body.tile_type } })
    return NextResponse.json(data)
  }

  // Creating new dashboard
  const { data, error } = await supabase
    .from('dashboards')
    .insert({ user_id: user.id, title: body.title || 'My Dashboard' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await supabase.from('audit_log').insert({ user_id: user.id, event: 'dashboard_created', metadata: { dashboard_id: data.id } })
  return NextResponse.json(data)
}
