// ── SHOPIFY CONNECTOR ─────────────────────────────────────────
// OAuth 2.0 + GraphQL Admin API (required for Shopify App Store)
// Scopes: read_orders, read_products, read_inventory, read_customers

export const SHOPIFY_SCOPES = 'read_orders,read_products,read_inventory,read_customers'

const GQL_VERSION = '2025-01'

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

// ── GraphQL helper ────────────────────────────────────────────

export async function shopifyGQL(
  shop: string,
  token: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<Record<string, unknown>> {
  const res = await fetch(`https://${shop}/admin/api/${GQL_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  if (res.status === 401 || res.status === 403) throw new Error(`SHOPIFY_AUTH_ERROR:${res.status}`)
  if (!res.ok) throw new Error(`Shopify GraphQL HTTP error: ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message || 'Shopify GraphQL error')
  return json.data as Record<string, unknown>
}

// ── Paginated fetch ───────────────────────────────────────────

async function fetchAllPages(
  shop: string,
  token: string,
  query: string,
  key: string
): Promise<Record<string, unknown>[]> {
  const nodes: Record<string, unknown>[] = []
  let cursor: string | null = null
  do {
    const data = await shopifyGQL(shop, token, query, { cursor })
    const conn = data[key] as {
      edges: { node: Record<string, unknown> }[]
      pageInfo: { hasNextPage: boolean; endCursor: string }
    }
    nodes.push(...conn.edges.map(e => e.node))
    cursor = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null
  } while (cursor)
  return nodes
}

// ── GraphQL Queries ───────────────────────────────────────────

export const ORDERS_GQL = `
  query GetOrders($cursor: String) {
    orders(first: 250, after: $cursor, query: "status:any") {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          currencyCode
          totalDiscountsSet { shopMoney { amount } }
          totalTaxSet { shopMoney { amount } }
          discountCodes
          shippingAddress { countryCodeV2 }
          shippingLines(first: 1) {
            edges { node { originalPriceSet { shopMoney { amount } } } }
          }
          lineItems(first: 50) {
            edges {
              node {
                id
                name
                quantity
                originalUnitPriceSet { shopMoney { amount } }
                totalDiscountSet { shopMoney { amount } }
                variant {
                  id
                  sku
                  title
                  inventoryQuantity
                  inventoryItem { unitCost { amount } }
                }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

export const PRODUCTS_GQL = `
  query GetProducts($cursor: String) {
    products(first: 250, after: $cursor) {
      edges {
        node {
          id
          title
          productType
          vendor
          variants(first: 100) {
            edges {
              node {
                id
                sku
                title
                price
                inventoryQuantity
                inventoryItem { unitCost { amount } }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

export const CUSTOMERS_GQL = `
  query GetCustomers($cursor: String) {
    customers(first: 250, after: $cursor) {
      edges {
        node {
          id
          firstName
          lastName
          email
          phone
          numberOfOrders
          amountSpent { amount currencyCode }
          createdAt
          updatedAt
          tags
          defaultAddress { country city }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

export const SHOP_GQL = `
  query GetShop {
    shop {
      name
      myshopifyDomain
      email
      currencyCode
      plan { displayName }
      countryCode
      ianaTimezone
      createdAt
    }
  }
`

// ── Exported fetch helpers ────────────────────────────────────

export const fetchAllShopifyOrders   = (shop: string, token: string) => fetchAllPages(shop, token, ORDERS_GQL, 'orders')
export const fetchAllShopifyProducts = (shop: string, token: string) => fetchAllPages(shop, token, PRODUCTS_GQL, 'products')
export const fetchAllShopifyCustomers = (shop: string, token: string) => fetchAllPages(shop, token, CUSTOMERS_GQL, 'customers')
