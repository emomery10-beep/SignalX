// Instagram Shopping OAuth 2.0 — Step 2
// Exchanges the auth code for a long-lived token, then discovers the Business
// Manager's Commerce Merchant Settings ID (the real key for reading Instagram/
// Facebook Shop orders — NOT the catalog ID or IG user ID) via the Graph API.
// If no commerce account is found, the connection is rejected here rather than
// silently saved — this doubles as save-time credential validation.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'

const GRAPH = 'https://graph.facebook.com/v19.0'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(new URL('/sources?error=instagram_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
    if (!userId) throw new Error('no userId in state')
  } catch {
    return NextResponse.redirect(new URL('/sources?error=instagram_invalid_state', request.url))
  }

  const appId     = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) {
    return NextResponse.redirect(new URL('/sources?error=instagram_not_configured', request.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram-shopping/callback`

  // Step 1: code → short-lived user token
  const shortTokenRes = await fetch(`${GRAPH}/oauth/access_token?` + new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  }))
  if (!shortTokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=instagram_token_failed', request.url))
  }
  const { access_token: shortLivedToken } = await shortTokenRes.json()

  // Step 2: short-lived → long-lived token (~60 days). Meta issues no refresh_token
  // for user tokens — the refresh cron re-exchanges this token before it expires.
  const longTokenRes = await fetch(`${GRAPH}/oauth/access_token?` + new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  }))
  if (!longTokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=instagram_token_exchange_failed', request.url))
  }
  const { access_token, expires_in } = await longTokenRes.json() as { access_token: string; expires_in: number }

  // Step 3: discover the Business Manager(s) this user granted access to.
  const businessesRes = await fetch(`${GRAPH}/me/businesses?fields=id,name&access_token=${access_token}`)
  const businesses = businessesRes.ok ? ((await businessesRes.json())?.data || []) : []

  if (!businesses.length) {
    return NextResponse.redirect(new URL('/sources?error=instagram_no_business', request.url))
  }

  // Step 4: for each business, look for a Commerce Merchant Settings ID (the shop)
  // and a connected Instagram professional account. First match wins.
  let commerceMerchantSettingsId = ''
  let igUserId = ''
  let businessId = ''
  let shopName = ''

  for (const biz of businesses as { id: string; name: string }[]) {
    const cmsRes = await fetch(`${GRAPH}/${biz.id}/commerce_merchant_settings?access_token=${access_token}`)
    const cmsData = cmsRes.ok ? ((await cmsRes.json())?.data || []) : []
    if (cmsData.length) {
      commerceMerchantSettingsId = String(cmsData[0].id)
      businessId = biz.id
      shopName = biz.name
      break
    }
  }

  if (!commerceMerchantSettingsId) {
    // No commerce account reachable — either none is set up in Commerce Manager yet,
    // or (pre-App-Review) this app only has access to test commerce accounts.
    return NextResponse.redirect(new URL('/sources?error=instagram_no_commerce_account', request.url))
  }

  // Best-effort: find the connected Instagram professional account for post/insights data.
  // Not required for orders — commerce_merchant_settings_id alone covers that.
  const igAccountsRes = await fetch(`${GRAPH}/${businessId}/instagram_accounts?access_token=${access_token}`)
  if (igAccountsRes.ok) {
    const igData = (await igAccountsRes.json())?.data || []
    if (igData.length) igUserId = String(igData[0].id)
  }

  const expiresAt = new Date(Date.now() + (expires_in || 60 * 24 * 60 * 60) * 1000).toISOString()

  const supabase = createClient()
  await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'instagram',
      name: shopName || 'Instagram Shopping',
      status: 'active',
      credentials: encryptCredentials({ access_token, expires_at: expiresAt }),
      config: { business_id: businessId, commerce_merchant_settings_id: commerceMerchantSettingsId, ig_user_id: igUserId },
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=instagram_shopping', request.url))
}
