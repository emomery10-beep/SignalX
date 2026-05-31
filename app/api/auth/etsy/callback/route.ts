// Etsy OAuth 2.0 with PKCE — Step 2: Exchange code for access token
import { NextRequest, NextResponse } from 'next/server'
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
    const errBody = await tokenRes.text().catch(() => 'unknown')
    console.error('Etsy token exchange failed:', tokenRes.status, errBody)
    return NextResponse.redirect(new URL('/sources?error=etsy_token_failed', request.url))
  }

  const { access_token, refresh_token } = await tokenRes.json()

  // Get user/shop info for display name
  const userRes = await fetch('https://openapi.etsy.com/v3/application/users/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'x-api-key': process.env.ETSY_CLIENT_ID!,
    },
  })
  const userData = userRes.ok ? await userRes.json() : {}
  const shopName = userData.shop_name || userData.login_name || 'Etsy Shop'
  const shopId = userData.shop_id || ''

  // Use service client to bypass RLS
  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = createServiceClient()

  // Remove existing Etsy connection, then insert fresh
  await supabase
    .from('connected_sources')
    .delete()
    .eq('user_id', userId)
    .eq('source_type', 'etsy')

  const { data: source, error: insertError } = await supabase
    .from('connected_sources')
    .insert({
      user_id: userId,
      source_type: 'etsy',
      name: shopName,
      status: 'active',
      credentials: encryptCredentials({ access_token, refresh_token }),
      config: { shop_id: shopId },
      sync_interval_minutes: 60,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Etsy insert failed:', insertError)
    return NextResponse.redirect(new URL('/sources?error=etsy_save_failed', request.url))
  }

  if (source) {
    try { await runSync(userId) } catch (_) {}
  }

  return NextResponse.redirect(new URL('/sources?connected=etsy', request.url))
}
