// GoCardless OAuth 2.0 — Step 2: Exchange code for access token
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
    return NextResponse.redirect(new URL('/sources?error=gocardless_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gocardless/callback`

  const tokenRes = await fetch('https://connect.gocardless.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.GOCARDLESS_CLIENT_ID!,
      client_secret: process.env.GOCARDLESS_CLIENT_SECRET!,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=gocardless_token_failed', request.url))
  }

  const { access_token, organisation_id } = await tokenRes.json()

  // Get creditor name for display name
  const creditorsRes = await fetch('https://api.gocardless.com/creditors', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'GoCardless-Version': '2015-07-06',
    },
  })
  const creditorsData = creditorsRes.ok ? await creditorsRes.json() : {}
  const firstCreditor = creditorsData.creditors?.[0]
  const displayName = firstCreditor?.name || 'GoCardless'

  const supabase = createClient()

  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'gocardless',
      name: displayName,
      status: 'active',
      credentials: encryptCredentials({ access_token }),
      config: { organisation_id: organisation_id || '' },
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=gocardless', request.url))
}
