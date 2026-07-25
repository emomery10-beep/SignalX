// Meta Ads OAuth 2.0 — Step 2: Exchange code for access token
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
    return NextResponse.redirect(new URL('/sources?error=meta_cancelled', request.url))
  }

  let userId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  const appId = process.env.META_APP_ID!
  const appSecret = process.env.META_APP_SECRET!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/meta/callback`

  const tokenRes = await fetch('https://graph.facebook.com/v19.0/oauth/access_token?' + new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  }))

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=meta_token_failed', request.url))
  }

  const { access_token: shortLivedToken } = await tokenRes.json()

  // Short-lived → long-lived token (~60 days). Meta issues no refresh_token for
  // user tokens — the token-refresh cron re-exchanges this before it expires,
  // mirroring the same pattern already used by the instagram-shopping connector.
  const longTokenRes = await fetch('https://graph.facebook.com/v19.0/oauth/access_token?' + new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  }))
  if (!longTokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=meta_token_exchange_failed', request.url))
  }
  const { access_token, expires_in } = await longTokenRes.json() as { access_token: string; expires_in: number }

  // Discover the first accessible ad account — the Marketing API needs the
  // act_<id> form for every insights request.
  const adAccountsRes = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name&access_token=${access_token}`)
  const adAccounts = adAccountsRes.ok ? ((await adAccountsRes.json())?.data || []) : []
  const firstAccount = adAccounts[0]
  const adAccountId = firstAccount?.id || ''
  const displayName = firstAccount?.name || 'Meta Ads'

  const expiresAt = new Date(Date.now() + (expires_in || 60 * 24 * 60 * 60) * 1000).toISOString()

  const supabase = createClient()

  const { error: upsertError } = await supabase
    .from('connected_sources')
    .upsert({
      user_id: userId,
      source_type: 'meta_ads',
      name: displayName,
      status: adAccountId ? 'active' : 'error',
      credentials: encryptCredentials({ access_token, expires_at: expiresAt }),
      config: { ad_account_id: adAccountId },
      error_message: adAccountId ? null : 'No Meta ad account found for this login',
      sync_interval_minutes: 60,
    }, { onConflict: 'user_id,source_type' })

  if (upsertError) {
    return NextResponse.redirect(new URL('/sources?error=meta_ads_save_failed', request.url))
  }

  try { await runSync(userId) } catch (_) {}

  return NextResponse.redirect(new URL('/sources?connected=meta_ads', request.url))
}
