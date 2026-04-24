// ============================================================
// Shopify Integration — OAuth + REST API
// Scopes: read_orders, read_products, read_inventory, read_customers
// ============================================================

export const SHOPIFY_SCOPES = [
  'read_orders',
  'read_products', 
  'read_inventory',
  'read_customers',
  'read_analytics',
].join(',')

// ── OAuth: Build the install/auth URL ────────────────────────
export function buildShopifyAuthUrl(shop: string, state: string): string {
  const clientId = process.env.SHOPIFY_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    scope: SHOPIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
    'grant_options[]': 'per-user',
  })
  // Normalise shop domain
  const cleanShop = shop.replace('https://', '').replace('http://', '').replace(/\/$/, '')
  const shopHost = cleanShop.includes('.myshopify.com') ? cleanShop : `${cleanShop}.myshopify.com`
  return `https://${shopHost}/admin/oauth/authorize?${params.toString()}`
}

// ── OAuth: Exchange code for access token ────────────────────
export async function exchangeShopifyCode(shop: string, code: string): Promise<string> {
  const cleanShop = shop.replace('https://', '').replace('http://', '').replace(/\/$/, '')
  const shopHost = cleanShop.includes('.myshopify.com') ? cleanShop : `${cleanShop}.myshopify.com`

  const res = await fetch(`https://${shopHost}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Shopify token exchange failed: ${err}`)
  }
  const data = await res.json()
  return data.access_token
}

// ── Fetch Shopify orders (last 90 days) ───────────────────────
export async function fetchShopifyOrders(
  shop: string,
  accessToken: string,
  limit = 250
): Promise<Record<string, unknown>[]> {
  const cleanShop = shop.replace('https://', '').replace('http://', '').replace(/\/$/, '')
  const shopHost = cleanShop.includes('.myshopify.com') ? cleanShop : `${cleanShop}.myshopify.com`

  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const allOrders: Record<string, unknown>[] = []
  let pageInfo: string | null = null

  do {
    const params = new URLSearchParams({
      status: 'any',
      limit: String(limit),
      created_at_min: since,
      fields: 'id,created_at,line_items,total_price,subtotal_price,currency,customer,shipping_address,financial_status,fulfillment_status,discount_codes,refunds',
    })
    if (pageInfo) {
      params.set('page_info', pageInfo)
      params.delete('created_at_min')
      params.delete('status')
      params.delete('fields')
    }

    const res = await fetch(`https://${shopHost}/admin/api/2024-01/orders.json?${params}`, {
      headers: { 'X-Shopify-Access-Token': accessToken, 'Content-Type': 'application/json' },
    })
    if (!res.ok) break

    const data = await res.json()
    allOrders.push(...(data.orders || []))

    // Get next page from Link header
    const link = res.headers.get('Link') || ''
    const next = link.match(/<[^>]*page_info=([^&>]+)[^>]*>;\s*rel="next"/)
    pageInfo = next ? next[1] : null
  } while (pageInfo && allOrders.length < 2000)

  return allOrders
}

// ── Fetch Shopify products with inventory ─────────────────────
export async function fetchShopifyProducts(
  shop: string,
  accessToken: string
): Promise<Record<string, unknown>[]> {
  const cleanShop = shop.replace('https://', '').replace('http://', '').replace(/\/$/, '')
  const shopHost = cleanShop.includes('.myshopify.com') ? cleanShop : `${cleanShop}.myshopify.com`

  const res = await fetch(
    `https://${shopHost}/admin/api/2024-01/products.json?limit=250&fields=id,title,variants,product_type,vendor,status`,
    { headers: { 'X-Shopify-Access-Token': accessToken } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.products || []
}

// ── Verify shop domain format ─────────────────────────────────
export function normaliseShopDomain(shop: string): string {
  const clean = shop.replace('https://', '').replace('http://', '').replace(/\/$/, '').toLowerCase()
  return clean.includes('.myshopify.com') ? clean : `${clean}.myshopify.com`
}
