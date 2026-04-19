// Amazon SP-API OAuth — Step 2: Exchange auth code for LWA tokens
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const spApiOauthCode = searchParams.get('spapi_oauth_code')
  const state = searchParams.get('state')
  const sellingPartnerId = searchParams.get('selling_partner_id')
  const mwsAuthToken = searchParams.get('mws_auth_token') // legacy, may not be present

  if (!spApiOauthCode || !state) {
    return NextResponse.redirect(new URL('/sources?error=amazon_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  // Exchange OAuth code for LWA access + refresh tokens
  const tokenRes = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: spApiOauthCode,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/amazon/callback`,
      client_id: process.env.AMAZON_LWA_CLIENT_ID!,
      client_secret: process.env.AMAZON_LWA_CLIENT_SECRET!,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=amazon_token_failed', request.url))
  }

  const { access_token, refresh_token } = await tokenRes.json()

  const supabase = createClient()

  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'amazon_fba',
      name: `Amazon FBA${sellingPartnerId ? ` (${sellingPartnerId})` : ''}`,
      status: 'active',
      credentials: { access_token, refresh_token, mws_auth_token: mwsAuthToken },
      config: {
        selling_partner_id: sellingPartnerId,
        marketplace_id: 'ATVPDKIKX0DER', // US default, user can change
        region: 'us-east-1',
      },
      sync_interval_minutes: 120,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=amazon_fba', request.url))
}
