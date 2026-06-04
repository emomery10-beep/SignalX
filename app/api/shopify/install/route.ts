// Shopify App — entry point when merchant opens app from Shopify Admin
// Handles both first-time install AND subsequent opens
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyShopifyRequest(params: URLSearchParams): boolean {
  const hmac = params.get('hmac')
  if (!hmac) return false
  const secret = process.env.SHOPIFY_CLIENT_SECRET
  if (!secret) return false

  const entries = Array.from(params.entries())
    .filter(([key]) => key !== 'hmac')
    .sort(([a], [b]) => a.localeCompare(b))
  const message = entries.map(([k, v]) => `${k}=${v}`).join('&')
  const hash = crypto.createHmac('sha256', secret).update(message).digest('hex')
  try {
    // Use hex Buffers so lengths always match (both 32 bytes); avoids timingSafeEqual throw
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hmac, 'hex'))
  } catch {
    return false
  }
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const shop = params.get('shop')

  // No shop param — show a proper landing page instead of JSON error
  if (!shop) {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify`)
  }

  const cleanShop = shop.replace(/https?:\/\//, '').replace(/\/$/, '')

  // Verify HMAC — if it fails, redirect to a friendly error page (not JSON 401)
  if (!verifyShopifyRequest(params)) {
    console.error('Shopify install: HMAC verification failed for shop', cleanShop)
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=invalid_signature`)
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID
  if (!clientId || !process.env.SHOPIFY_CLIENT_SECRET) {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=not_configured`)
  }

  // Check if this shop already has a connection — try to find current session user first
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Logged-in user — check if they already have this shop connected
      const { data: existing } = await supabase
        .from('connected_sources')
        .select('id')
        .eq('user_id', user.id)
        .eq('source_type', 'shopify')
        .eq('config->>shop_domain', cleanShop)
        .maybeSingle()

      if (existing) {
        // Already connected — send them straight to the sources page
        return NextResponse.redirect(`${APP_URL}/sources?shop=${cleanShop}`)
      }
    }

    // Check pending installs (App Store flow — user may not be logged in yet)
    const { createServiceClient } = await import('@/lib/supabase/server')
    const svc = createServiceClient()
    const { data: pending } = await svc
      .from('pending_shopify_installs')
      .select('shop_domain')
      .eq('shop_domain', cleanShop)
      .maybeSingle()

    if (pending) {
      // Already installed — redirect to sign-in with a helpful message
      return NextResponse.redirect(`${APP_URL}/?ref=shopify&shop=${cleanShop}&status=connect_account`)
    }
  } catch (e) {
    // Don't block install if these checks fail
    console.error('Shopify install pre-check error:', e)
  }

  // New install — start OAuth flow
  const redirectUri = `${APP_URL}/api/auth/shopify/callback`
  const scopes = 'read_orders,read_products,read_inventory,read_customers'
  const nonce = crypto.randomBytes(16).toString('hex')
  const state = Buffer.from(JSON.stringify({ nonce, shop: cleanShop })).toString('base64url')

  const authUrl =
    `https://${cleanShop}/admin/oauth/authorize` +
    `?client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`

  return NextResponse.redirect(authUrl)
}
