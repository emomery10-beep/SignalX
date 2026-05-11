// Etsy OAuth 2.0 with PKCE — Step 2: Exchange code for access token
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
    return NextResponse.redirect(new URL('/sources?error=etsy_cancelled', request.url))
  }

  let userId: string, codeVerifier: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
    codeVerifier = decoded.codeVerifier
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/etsy/callback`

  const tokenRes = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ETSY_CLIENT_ID!,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=etsy_token_failed', request.url))
  }

  const { access_token, refresh_token } = await tokenRes.json()

  // Get user info for display name
  const userRes = await fetch('https://openapi.etsy.com/v3/application/users/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'x-api-key': process.env.ETSY_CLIENT_ID!,
    },
  })
  const userData = userRes.ok ? await userRes.json() : {}
  const displayName = userData.login_name || 'Etsy Shop'

  const supabase = createClient()

  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'etsy',
      name: displayName,
      status: 'active',
      credentials: encryptCredentials({ access_token, refresh_token }),
      config: {},
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=etsy', request.url))
}
