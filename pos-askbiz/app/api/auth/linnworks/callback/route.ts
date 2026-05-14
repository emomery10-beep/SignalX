// Linnworks OAuth 2.0 — Step 2: Exchange code for access token
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(new URL('/sources?error=linnworks_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  const tokenRes = await fetch('https://auth.linnworks.net/OAuth/Token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      AppId: process.env.LINNWORKS_APP_ID,
      AppSecret: process.env.LINNWORKS_SECRET,
      Code: code,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=linnworks_token_failed', request.url))
  }

  const tokenData = await tokenRes.json()
  const { Token: access_token, Server: server } = tokenData

  const supabase = createClient()

  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'linnworks',
      name: 'Linnworks',
      status: 'active',
      credentials: encryptCredentials({ access_token }),
      config: { server: server || '' },
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=linnworks', request.url))
}
