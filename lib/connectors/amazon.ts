// ── AMAZON SP-API CONNECTOR ───────────────────────────────────
// Selling Partner API — OAuth via Login with Amazon (LWA)
// Scopes: sellingpartnerapi:reporting:analytics, sellingpartnerapi::inventory

export function getAmazonAuthUrl(state: string): string {
  const clientId = process.env.AMAZON_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/amazon/callback`
  // Amazon SP-API authorization endpoint
  return `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${clientId}&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}&version=beta`
}

export async function exchangeAmazonCode(code: string): Promise<{ access_token: string; refresh_token: string }> {
  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/amazon/callback`,
      client_id: process.env.AMAZON_CLIENT_ID!,
      client_secret: process.env.AMAZON_CLIENT_SECRET!,
    }),
  })
  if (!res.ok) throw new Error(`Amazon token exchange failed: ${res.status}`)
  return res.json()
}

export async function refreshAmazonToken(refreshToken: string): Promise<string> {
  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.AMAZON_CLIENT_ID!,
      client_secret: process.env.AMAZON_CLIENT_SECRET!,
    }),
  })
  if (!res.ok) throw new Error(`Amazon token refresh failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export async function fetchAmazonFBAInventory(accessToken: string, marketplaceId = 'A1F83G8C2ARO7P') {
  // UK marketplace default — ATVPDKIKX0DER = US
  const res = await fetch(
    `https://sellingpartnerapi-eu.amazon.com/fba/inventory/v1/summaries?details=true&granularityType=Marketplace&granularityId=${marketplaceId}&marketplaceIds=${marketplaceId}`,
    {
      headers: {
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json',
      },
    }
  )
  if (!res.ok) throw new Error(`Amazon FBA inventory failed: ${res.status}`)
  const data = await res.json()
  return data.payload?.inventorySummaries || []
}

export async function fetchAmazonOrders(accessToken: string, marketplaceId = 'A1F83G8C2ARO7P') {
  const createdAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const res = await fetch(
    `https://sellingpartnerapi-eu.amazon.com/orders/v0/orders?MarketplaceIds=${marketplaceId}&CreatedAfter=${createdAfter}&OrderStatuses=Shipped,Unshipped`,
    {
      headers: {
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json',
      },
    }
  )
  if (!res.ok) throw new Error(`Amazon orders failed: ${res.status}`)
  const data = await res.json()
  return data.payload?.Orders || []
}
