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

  // Discover the Google Ads customer ID this token can access — requires a
  // Google-approved Developer Token (a manual application process, separate
  // from OAuth; see GOOGLE_ADS_DEVELOPER_TOKEN). Without it this call 401s
  // and the connection is stored without a customer_id, which syncGoogleAds()
  // cannot proceed without.
  let customerId = ''
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN) {
    const customersRes = await fetch('https://googleads.googleapis.com/v17/customers:listAccessibleCustomers', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      },
    })
    if (customersRes.ok) {
      const { resourceNames } = await customersRes.json()
      customerId = String(resourceNames?.[0] || '').replace('customers/', '')
    }
  }

  const displayName = `Google Ads — ${userData.email || 'connected'}`

  const supabase = createClient()

  const { error: upsertError } = await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'google_ads',
      name: displayName,
      status: customerId ? 'active' : 'error',
      credentials: encryptCredentials({ access_token, refresh_token }),
      config: { customer_id: customerId },
      error_message: customerId ? null : 'Could not discover a Google Ads customer ID — check GOOGLE_ADS_DEVELOPER_TOKEN is set and approved',
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  if (upsertError) {
    return NextResponse.redirect(new URL('/sources?error=google_ads_save_failed', request.url))
  }

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=google_ads', request.url))
}
