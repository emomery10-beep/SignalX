import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { promises as dns } from 'dns'

export const runtime = 'nodejs'

// Session-authenticated, same pattern as app/api/v1/apps/route.ts. DNS TXT
// record proof of domain ownership — the same idea as Google Search
// Console / SPF verification, no external provider dependency needed since
// Node's own `dns` module can resolve TXT records directly. Only once this
// succeeds does app/connect/[token]/page.tsx ever actually redirect a
// merchant to the app's redirect_uri.
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const appId = body?.app_id
  if (!appId) return NextResponse.json({ error: '"app_id" is required' }, { status: 400 })

  const { data: app } = await supabase
    .from('developer_apps')
    .select('id, redirect_uri, redirect_uri_verification_token')
    .eq('id', appId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 })
  if (!app.redirect_uri) return NextResponse.json({ error: 'This app has no redirect_uri set' }, { status: 400 })
  if (!app.redirect_uri_verification_token) return NextResponse.json({ error: 'No verification token on record — re-save the redirect_uri first' }, { status: 400 })

  let hostname: string
  try {
    hostname = new URL(app.redirect_uri).hostname
  } catch {
    return NextResponse.json({ error: 'redirect_uri is not a valid URL' }, { status: 400 })
  }

  const challengeHost = `_askbiz-challenge.${hostname}`
  let records: string[][]
  try {
    records = await dns.resolveTxt(challengeHost)
  } catch {
    return NextResponse.json({
      error: `No TXT record found at ${challengeHost}. Add one with the value "${app.redirect_uri_verification_token}" and try again — DNS changes can take a few minutes to propagate.`,
    }, { status: 400 })
  }

  // TXT record values can be split into multiple chunked strings by the
  // resolver — join each record's chunks before comparing.
  const found = records.some(chunks => chunks.join('') === app.redirect_uri_verification_token)
  if (!found) {
    return NextResponse.json({
      error: `Found a TXT record at ${challengeHost}, but its value didn't match. Expected "${app.redirect_uri_verification_token}".`,
    }, { status: 400 })
  }

  const { data: updated, error } = await supabase
    .from('developer_apps')
    .update({ redirect_uri_verified_at: new Date().toISOString() })
    .eq('id', appId)
    .eq('user_id', user.id)
    .select('id, redirect_uri_verified_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, app: updated })
}
