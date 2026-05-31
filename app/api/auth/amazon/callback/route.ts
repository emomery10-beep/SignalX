// Amazon SP-API OAuth — Step 2: Exchange auth code for LWA tokens
import { NextRequest, NextResponse } from 'next/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const spApiOauthCode = searchParams.get('spapi_oauth_code')
  const state = searchParams.get('state')
  const sellingPartnerId = searchParams.get('selling_partner_id')

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
    const errBody = await tokenRes.text().catch(() => 'unknown')
    console.error('Amazon token exchange failed:', tokenRes.status, errBody)
    return NextResponse.redirect(new URL('/sources?error=amazon_token_failed', request.url))
  }

  const { access_token, refresh_token } = await tokenRes.json()

  // Use service client to bypass RLS
  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = createServiceClient()

  // Remove existing Amazon connection for this user, then insert fresh
  await supabase
    .from('connected_sources')
    .delete()
    .eq('user_id', userId)
    .eq('source_type', 'amazon_fba')

  const { data: source, error: insertError } = await supabase
    .from('connected_sources')
    .insert({
      user_id: userId,
      source_type: 'amazon_fba',
      name: `Amazon FBA${sellingPartnerId ? ` (${sellingPartnerId})` : ''}`,
      status: 'active',
      credentials: encryptCredentials({ access_token, refresh_token }),
      config: {
        selling_partner_id: sellingPartnerId,
        marketplace_id: 'ATVPDKIKX0DER', // US default
        region: 'us-east-1',
      },
      sync_interval_minutes: 120,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Amazon insert failed:', insertError)
    return NextResponse.redirect(new URL('/sources?error=amazon_save_failed', request.url))
  }

  if (source) {
    try { await runSync(userId) } catch (_) {}
  }

  return NextResponse.redirect(new URL('/sources?connected=amazon_fba', request.url))
}
