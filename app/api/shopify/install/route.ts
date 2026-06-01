// Shopify App Install — handles install requests from Shopify Admin
// This is the entry point when a merchant clicks "Install" in the Shopify App Store.
// It does NOT require the user to be logged into AskBiz first.
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyShopifyRequest(params: URLSearchParams): boolean {
  const hmac = params.get('hmac')
  if (!hmac) return false

  const secret = process.env.SHOPIFY_CLIENT_SECRET
  if (!secret) return false

  // Remove hmac from params and sort remaining
  const entries = Array.from(params.entries())
    .filter(([key]) => key !== 'hmac')
    .sort(([a], [b]) => a.localeCompare(b))
  const message = entries.map(([k, v]) => `${k}=${v}`).join('&')

  const hash = crypto.createHmac('sha256', secret).update(message).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac))
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const shop = params.get('shop')

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 })
  }

  // Verify the request is from Shopify
  if (!verifyShopifyRequest(params)) {
    console.error('Shopify install: HMAC verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const cleanShop = shop.replace(/https?:\/\//, '').replace(/\/$/, '')
  const clientId = process.env.SHOPIFY_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 500 })
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
  const scopes = 'read_orders,read_products,read_inventory,read_analytics,read_customers'

  // Use a nonce for state to prevent CSRF — we'll resolve the user in the callback
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
