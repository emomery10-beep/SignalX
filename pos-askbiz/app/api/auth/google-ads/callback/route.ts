// Google Ads OAuth 2.0 — Step 2: Exchange code for access token
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
    return NextResponse.redirect(new URL('/sources?error=google_ads_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google-ads/callback`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=google_ads_token_failed', request.url))
  }

  const { access_token, refresh_token } = await tokenRes.json()

  // Get user email for display name
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  const userData = userRes.ok ? await userRes.json() : {}
  const displayName = `Google Ads — ${userData.email || 'connected'}`

  const supabase = createClient()

  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'google_ads',
      name: displayName,
      status: 'active',
      credentials: encryptCredentials({ access_token, refresh_token }),
      config: {},
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=google_ads', request.url))
}
