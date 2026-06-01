// Shopify OAuth — Step 2: Exchange code for access token
import { NextRequest, NextResponse } from 'next/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const shop = searchParams.get('shop')

  if (!code || !state || !shop) {
    return NextResponse.redirect(new URL('/sources?error=shopify_cancelled', request.url))
  }

  let userId: string | undefined
  let shopFromState: string | undefined
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
    shopFromState = decoded.shop
  } catch {
    return NextResponse.redirect(new URL('/sources?error=invalid_state', request.url))
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/sources?error=shopify_token_failed', request.url))
  }

  const { access_token } = await tokenRes.json()

  // Get shop info for display name
  const shopRes = await fetch(`https://${shop}/admin/api/2025-01/shop.json`, {
    headers: { 'X-Shopify-Access-Token': access_token },
  })
  const shopData = shopRes.ok ? await shopRes.json() : {}
  const shopName = shopData.shop?.name || shop

  // Use service client to bypass RLS
  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = createServiceClient()

  // If no userId (App Store install flow), try to find user by checking current session
  // or create a pending connection
  if (!userId) {
    // Try to get user from current session cookies
    const { createClient } = await import('@/lib/supabase/server')
    const sessionClient = createClient()
    const { data: { user } } = await sessionClient.auth.getUser()
    userId = user?.id
  }

  if (!userId) {
    // App Store install flow — no logged-in AskBiz user
    // Store the token as a pending connection keyed by shop domain
    // so we can link it when the merchant signs into AskBiz later
    const { createServiceClient: createSvc } = await import('@/lib/supabase/server')
    const svcClient = createSvc()
    await svcClient
      .from('pending_shopify_installs')
      .upsert({
        shop_domain: shop,
        access_token: encryptCredentials({ access_token }),
        shop_name: shopName,
        installed_at: new Date().toISOString(),
      }, { onConflict: 'shop_domain' })
      .then(() => {})
      .catch((err: unknown) => console.error('Failed to store pending install:', err))

    // Redirect back to Shopify Admin as required for embedded apps
    const shopSlug = shop.replace('.myshopify.com', '')
    return NextResponse.redirect(`https://admin.shopify.com/store/${shopSlug}/apps/askbiz`)
  }

  // Remove any existing Shopify connection for this user, then insert fresh
  await supabase
    .from('connected_sources')
    .delete()
    .eq('user_id', userId)
    .eq('source_type', 'shopify')

  const { data: source, error: insertError } = await supabase
    .from('connected_sources')
    .insert({
      user_id: userId,
      source_type: 'shopify',
      name: shopName,
      status: 'active',
      credentials: encryptCredentials({ access_token }),
      config: { shop_domain: shop },
      sync_interval_minutes: 60,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Shopify insert failed:', insertError)
    return NextResponse.redirect(new URL(`/sources?error=shopify_save_failed`, request.url))
  }

  if (source) {
    // Kick off initial sync in background
    try { await runSync(userId) } catch (_) {}
  }

  return NextResponse.redirect(new URL('/sources?connected=shopify', request.url))
}
