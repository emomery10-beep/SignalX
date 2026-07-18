import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Session-authenticated, same pattern as app/api/v1/keys/route.ts — creating
// and managing an "app" is an account-settings action, not a per-request API
// call. See 20260717000005_developer_apps.sql for why this exists alongside
// (not instead of) raw api_keys rows.

const MAX_APPS = 10

// ── GET — list all apps for the logged-in user ─────────────────────────────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: apps, error } = await supabase
    .from('developer_apps')
    .select('id, name, logo_url, redirect_uri, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ apps: apps || [] })
}

// ── POST — register a new app ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { name?: string; logo_url?: string; redirect_uri?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const name = (body.name || '').trim()
  if (!name || name.length > 100) {
    return NextResponse.json({ error: '"name" is required and must be under 100 characters' }, { status: 400 })
  }
  if (body.logo_url && !/^https:\/\//.test(body.logo_url)) {
    return NextResponse.json({ error: '"logo_url" must be an https:// URL' }, { status: 400 })
  }
  if (body.redirect_uri && !/^https:\/\//.test(body.redirect_uri)) {
    return NextResponse.json({ error: '"redirect_uri" must be an https:// URL' }, { status: 400 })
  }

  const { count } = await supabase
    .from('developer_apps')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
  if ((count || 0) >= MAX_APPS) {
    return NextResponse.json({ error: `Maximum of ${MAX_APPS} apps per account.` }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('developer_apps')
    .insert({ user_id: user.id, name, logo_url: body.logo_url || null, redirect_uri: body.redirect_uri || null })
    .select('id, name, logo_url, redirect_uri, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, app: data })
}

// ── PATCH — rename or update an app ─────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, name, logo_url, redirect_uri } = body
  if (!id) return NextResponse.json({ error: 'App id required' }, { status: 400 })

  const update: Record<string, unknown> = {}
  if (name !== undefined) {
    if (!name || name.length > 100) return NextResponse.json({ error: '"name" must be a non-empty string under 100 characters' }, { status: 400 })
    update.name = name
  }
  if (logo_url !== undefined) {
    if (logo_url && !/^https:\/\//.test(logo_url)) return NextResponse.json({ error: '"logo_url" must be an https:// URL' }, { status: 400 })
    update.logo_url = logo_url || null
  }
  if (redirect_uri !== undefined) {
    if (redirect_uri && !/^https:\/\//.test(redirect_uri)) return NextResponse.json({ error: '"redirect_uri" must be an https:// URL' }, { status: 400 })
    update.redirect_uri = redirect_uri || null
  }

  const { data, error } = await supabase
    .from('developer_apps')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, name, logo_url, redirect_uri, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, app: data })
}

// ── DELETE — remove an app (keys/connections keep working, just ungrouped) ──
export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'App id required' }, { status: 400 })

  const { error } = await supabase
    .from('developer_apps')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
