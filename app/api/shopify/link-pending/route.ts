// Links a pending Shopify install (from App Store flow) to the now-authenticated user.
// Called after sign-in when the merchant arrived via the Shopify App Store.
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { decryptCredentials, encryptCredentials } from '@/lib/crypto'
import { runSync } from '@/lib/sync/engine'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

export async function GET(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop')

  if (!shop) {
    return NextResponse.redirect(`${APP_URL}/sources?error=missing_shop`)
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Not logged in — send back to sign-in with context preserved
    return NextResponse.redirect(`${APP_URL}/signin?ref=shopify&shop=${shop}`)
  }

  const svc = createServiceClient()

  // Look up the pending install
  const { data: pending } = await svc
    .from('pending_shopify_installs')
    .select('access_token, shop_name')
    .eq('shop_domain', shop)
    .maybeSingle()

  if (!pending) {
    // No pending install — this shop may need a fresh OAuth
    const clientId = process.env.SHOPIFY_CLIENT_ID
    if (!clientId) return NextResponse.redirect(`${APP_URL}/sources?error=not_configured`)

    const nonce = require('crypto').randomBytes(16).toString('hex')
    const state = Buffer.from(JSON.stringify({ nonce, shop, userId: user.id })).toString('base64url')
    const redirectUri = `${APP_URL}/api/auth/shopify/callback`
    const scopes = 'read_orders,read_products,read_inventory,read_customers'
    const authUrl =
      `https://${shop}/admin/oauth/authorize` +
      `?client_id=${clientId}` +
      `&scope=${scopes}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}`
    return NextResponse.redirect(authUrl)
  }

  // Decrypt and re-encrypt under the user's context (same key, but mark as linked)
  let credentials: { access_token: string }
  try {
    credentials = decryptCredentials(pending.access_token) as { access_token: string }
  } catch {
    return NextResponse.redirect(`${APP_URL}/sources?error=invalid_credentials`)
  }

  // Remove any existing Shopify connection for this user, then insert fresh
  await svc
    .from('connected_sources')
    .delete()
    .eq('user_id', user.id)
    .eq('source_type', 'shopify')

  const { data: source, error: insertError } = await svc
    .from('connected_sources')
    .insert({
      user_id: user.id,
      source_type: 'shopify',
      name: pending.shop_name || shop,
      status: 'active',
      credentials: encryptCredentials(credentials),
      config: { shop_domain: shop },
      sync_interval_minutes: 60,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Shopify link-pending insert failed:', insertError)
    return NextResponse.redirect(`${APP_URL}/sources?error=shopify_save_failed`)
  }

  // Mark the pending install as linked
  await svc
    .from('pending_shopify_installs')
    .update({ linked_at: new Date().toISOString(), user_id: user.id })
    .eq('shop_domain', shop)

  // Kick off initial sync in background
  if (source) {
    try { await runSync(user.id) } catch (_) {}
  }

  return NextResponse.redirect(`${APP_URL}/sources?connected=shopify`)
}
