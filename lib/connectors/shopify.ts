// ── SHOPIFY CONNECTOR ─────────────────────────────────────────
// OAuth 2.0 + REST Admin API
// Scopes: read_orders, read_products, read_inventory

export const SHOPIFY_SCOPES = 'read_orders,read_products,read_inventory,read_customers'

export function getShopifyAuthUrl(shop: string, state: string): string {
  const clientId = process.env.SHOPIFY_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/shopify/callback`
  return `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${SHOPIFY_SCOPES}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
}

export async function exchangeShopifyCode(shop: string, code: string): Promise<string> {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  })
  if (!res.ok) throw new Error(`Shopify token exchange failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export async function fetchShopifyOrders(shop: string, token: string, limit = 250) {
  const res = await fetch(
    `https://${shop}/admin/api/2024-01/orders.json?status=any&limit=${limit}&fields=id,created_at,line_items,total_price,subtotal_price,total_discounts,financial_status`,
    { headers: { 'X-Shopify-Access-Token': token } }
  )
  if (!res.ok) throw new Error(`Shopify orders fetch failed: ${res.status}`)
  const data = await res.json()
  return data.orders || []
}

export async function fetchShopifyProducts(shop: string, token: string) {
  const res = await fetch(
    `https://${shop}/admin/api/2024-01/products.json?limit=250&fields=id,title,variants,product_type,vendor`,
    { headers: { 'X-Shopify-Access-Token': token } }
  )
  if (!res.ok) throw new Error(`Shopify products fetch failed: ${res.status}`)
  const data = await res.json()
  return data.products || []
}

export async function fetchShopifyInventory(shop: string, token: string) {
  const res = await fetch(
    `https://${shop}/admin/api/2024-01/inventory_levels.json?limit=250`,
    { headers: { 'X-Shopify-Access-Token': token } }
  )
  if (!res.ok) throw new Error(`Shopify inventory fetch failed: ${res.status}`)
  const data = await res.json()
  return data.inventory_levels || []
}
