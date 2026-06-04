// ── Per-user Shopify data API ──────────────────────────────────
// Each AskBiz user has their own Shopify store + token stored
// in connected_sources. This route looks up THEIR credentials
// and makes the request to THEIR store — completely isolated.
//
// GET /api/shopify/data?resource=orders|products|customers|inventory|summary
// GET /api/shopify/data?resource=orders&limit=50&cursor=<endCursor>

import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { decryptCredentials } from '@/lib/crypto'

const GQL_VERSION = '2025-01'

type ShopifyResource = 'orders' | 'products' | 'customers' | 'inventory' | 'summary'

// ── GraphQL helper — posts to the user's own store ────────────

class ShopifyAuthError extends Error {
  isAuthError = true
  constructor(message: string) { super(message) }
}

async function gqlPost(
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

  if (res.status === 401) throw new ShopifyAuthError('Access token is invalid or has been revoked')
  if (res.status === 402) throw new ShopifyAuthError('Shopify store is frozen or payment required')
  if (res.status === 403) throw new ShopifyAuthError('Access token does not have the required scopes')
  if (res.status === 404) throw new Error('Store not found — check your store domain')
  if (res.status === 429) throw new Error('Shopify rate limit hit — try again in a moment')
  if (!res.ok) throw new Error(`Shopify returned ${res.status}`)

  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message || 'Shopify GraphQL error')
  return json.data as Record<string, unknown>
}

// ── Paginated helper ──────────────────────────────────────────

async function fetchPage(
  shop: string,
  token: string,
  query: string,
  key: string,
  cursor?: string
): Promise<{
  nodes: Record<string, unknown>[]
  hasNextPage: boolean
  endCursor: string | null
}> {
  const data = await gqlPost(shop, token, query, { cursor: cursor || null })
  const conn = data[key] as {
    edges: { node: Record<string, unknown> }[]
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
  return {
    nodes: (conn.edges || []).map(e => e.node),
    hasNextPage: conn.pageInfo?.hasNextPage ?? false,
    endCursor: conn.pageInfo?.endCursor ?? null,
  }
}

// ── GraphQL Queries ───────────────────────────────────────────

const ORDERS_GQL = `
  query GetOrders($cursor: String) {
    orders(first: 50, after: $cursor, query: "status:any") {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          currencyCode
          totalPriceSet { shopMoney { amount } }
          subtotalPriceSet { shopMoney { amount } }
          totalDiscountsSet { shopMoney { amount } }
          customer { firstName lastName email }
          shippingAddress { countryCodeV2 city }
          lineItems(first: 10) {
            edges {
              node {
                id
                name
                quantity
                originalUnitPriceSet { shopMoney { amount } }
                variant { id sku title }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

const PRODUCTS_GQL = `
  query GetProducts($cursor: String) {
    products(first: 50, after: $cursor) {
      edges {
        node {
          id
          title
          handle
          productType
          vendor
          status
          createdAt
          updatedAt
          variants(first: 10) {
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
          images(first: 1) {
            edges { node { url altText } }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

const CUSTOMERS_GQL = `
  query GetCustomers($cursor: String) {
    customers(first: 50, after: $cursor) {
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

// Inventory via products + variants (no direct REST inventory_levels in GraphQL)
const INVENTORY_GQL = `
  query GetInventory($cursor: String) {
    products(first: 50, after: $cursor) {
      edges {
        node {
          id
          title
          variants(first: 20) {
            edges {
              node {
                id
                sku
                title
                inventoryQuantity
                inventoryItem {
                  id
                  unitCost { amount }
                  inventoryLevels(first: 5) {
                    edges {
                      node {
                        quantities(names: ["available"]) {
                          name
                          quantity
                        }
                        location { id name }
                      }
                    }
                  }
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

const SHOP_GQL = `
  query GetShop {
    shop {
      name
      myshopifyDomain
      email
      currencyCode
      plan { displayName }
      ianaTimezone
      createdAt
    }
  }
`

const ORDER_COUNT_GQL = `
  query OrderCount {
    ordersCount(query: "status:any") { count }
  }
`

const PRODUCT_COUNT_GQL = `
  query ProductCount {
    productsCount { count }
  }
`

const CUSTOMER_COUNT_GQL = `
  query CustomerCount {
    customersCount { count }
  }
`

const RECENT_ORDERS_GQL = `
  query RecentOrders($since: String) {
    orders(first: 250, query: $since) {
      edges {
        node {
          id
          displayFinancialStatus
          totalPriceSet { shopMoney { amount } }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

// ── Resource fetchers ─────────────────────────────────────────

async function fetchOrders(shop: string, token: string, limit: number, cursor?: string) {
  // Shopify GQL doesn't support per-query `first` override easily so we use page fetch
  const result = await fetchPage(shop, token, ORDERS_GQL, 'orders', cursor)

  // Transform GraphQL nodes to match expected REST-like shape for the response
  const orders = result.nodes.map(o => ({
    id: o.id,
    name: o.name,
    created_at: o.createdAt,
    financial_status: (o.displayFinancialStatus as string)?.toLowerCase(),
    fulfillment_status: (o.displayFulfillmentStatus as string)?.toLowerCase(),
    total_price: (o.totalPriceSet as Record<string, unknown> & { shopMoney: { amount: string } })?.shopMoney?.amount,
    subtotal_price: (o.subtotalPriceSet as Record<string, unknown> & { shopMoney: { amount: string } })?.shopMoney?.amount,
    total_discounts: (o.totalDiscountsSet as Record<string, unknown> & { shopMoney: { amount: string } })?.shopMoney?.amount,
    currency: o.currencyCode,
    customer: o.customer,
    shipping_address: o.shippingAddress,
    line_items: (o.lineItems as { edges: { node: Record<string, unknown> }[] })?.edges?.map(e => ({
      id: e.node.id,
      name: e.node.name,
      quantity: e.node.quantity,
      price: (e.node.originalUnitPriceSet as Record<string, unknown> & { shopMoney: { amount: string } })?.shopMoney?.amount,
      variant: e.node.variant,
    })),
  }))

  return {
    orders,
    count: orders.length,
    pagination: {
      has_next_page: result.hasNextPage,
      end_cursor: result.endCursor,
    },
  }
}

async function fetchProducts(shop: string, token: string, limit: number, cursor?: string) {
  const result = await fetchPage(shop, token, PRODUCTS_GQL, 'products', cursor)

  const products = result.nodes.map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    product_type: p.productType,
    vendor: p.vendor,
    status: (p.status as string)?.toLowerCase(),
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    variants: (p.variants as { edges: { node: Record<string, unknown> }[] })?.edges?.map(e => ({
      id: e.node.id,
      sku: e.node.sku,
      title: e.node.title,
      price: e.node.price,
      inventory_quantity: e.node.inventoryQuantity,
      cost: (e.node.inventoryItem as Record<string, unknown> & { unitCost: { amount: string } })?.unitCost?.amount,
    })),
    images: (p.images as { edges: { node: { url: string; altText: string } }[] })?.edges?.map(e => ({
      src: e.node.url,
      alt: e.node.altText,
    })),
  }))

  return {
    products,
    count: products.length,
    pagination: {
      has_next_page: result.hasNextPage,
      end_cursor: result.endCursor,
    },
  }
}

async function fetchCustomers(shop: string, token: string, limit: number, cursor?: string) {
  const result = await fetchPage(shop, token, CUSTOMERS_GQL, 'customers', cursor)

  const customers = result.nodes.map(c => ({
    id: c.id,
    first_name: c.firstName,
    last_name: c.lastName,
    email: c.email,
    phone: c.phone,
    orders_count: c.numberOfOrders,
    total_spent: (c.amountSpent as { amount: string; currencyCode: string })?.amount,
    currency: (c.amountSpent as { amount: string; currencyCode: string })?.currencyCode,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
    tags: c.tags,
    default_address: c.defaultAddress,
  }))

  return {
    customers,
    count: customers.length,
    pagination: {
      has_next_page: result.hasNextPage,
      end_cursor: result.endCursor,
    },
  }
}

async function fetchInventory(shop: string, token: string) {
  // Collect all pages
  const allNodes: Record<string, unknown>[] = []
  let cursor: string | null = null
  do {
    const result = await fetchPage(shop, token, INVENTORY_GQL, 'products', cursor || undefined)
    allNodes.push(...result.nodes)
    cursor = result.hasNextPage ? result.endCursor : null
  } while (cursor)

  // Flatten to inventory level rows
  const inventoryLevels: Record<string, unknown>[] = []
  for (const product of allNodes) {
    const variantEdges = (product.variants as { edges: { node: Record<string, unknown> }[] })?.edges || []
    for (const ve of variantEdges) {
      const v = ve.node
      const levels = (v.inventoryItem as Record<string, unknown> & {
        inventoryLevels: { edges: { node: Record<string, unknown> }[] }
      })?.inventoryLevels?.edges || []

      for (const le of levels) {
        const level = le.node
        const quantities = (level.quantities as { name: string; quantity: number }[]) || []
        const available = quantities.find(q => q.name === 'available')?.quantity ?? 0
        const location = level.location as { id: string; name: string }

        inventoryLevels.push({
          product_id: product.id,
          product_title: product.title,
          variant_id: v.id,
          variant_sku: v.sku,
          variant_title: v.title,
          inventory_quantity: v.inventoryQuantity,
          available,
          location_id: location?.id,
          location_name: location?.name || 'Unknown location',
          cost: (v.inventoryItem as Record<string, unknown> & { unitCost: { amount: string } })?.unitCost?.amount,
        })
      }

      // If no location data, still surface the variant-level count
      if (levels.length === 0) {
        inventoryLevels.push({
          product_id: product.id,
          product_title: product.title,
          variant_id: v.id,
          variant_sku: v.sku,
          variant_title: v.title,
          inventory_quantity: v.inventoryQuantity,
          available: v.inventoryQuantity,
          location_id: null,
          location_name: 'Default',
          cost: (v.inventoryItem as Record<string, unknown> & { unitCost: { amount: string } })?.unitCost?.amount,
        })
      }
    }
  }

  return {
    inventory_levels: inventoryLevels,
    count: inventoryLevels.length,
  }
}

async function fetchSummary(shop: string, token: string) {
  // Shop info + counts in parallel
  const [shopData, countData, productCountData, customerCountData] = await Promise.all([
    gqlPost(shop, token, SHOP_GQL),
    gqlPost(shop, token, ORDER_COUNT_GQL).catch(() => ({ ordersCount: { count: null } })),
    gqlPost(shop, token, PRODUCT_COUNT_GQL).catch(() => ({ productsCount: { count: null } })),
    gqlPost(shop, token, CUSTOMER_COUNT_GQL).catch(() => ({ customersCount: { count: null } })),
  ])

  // Recent orders — last 30 days
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  // GraphQL orders query filter via query string
  const recentData = await gqlPost(shop, token, `
    query RecentOrders {
      orders(first: 250, query: "created_at:>=${since} status:any") {
        edges {
          node {
            id
            displayFinancialStatus
            totalPriceSet { shopMoney { amount } }
          }
        }
      }
    }
  `)

  const recentEdges = (recentData.orders as { edges: { node: Record<string, unknown> }[] })?.edges || []
  const recentOrders = recentEdges.map(e => e.node)
  const paidOrders = recentOrders.filter(o => {
    const status = (o.displayFinancialStatus as string)?.toLowerCase()
    return status === 'paid' || status === 'partially_refunded'
  })
  const revenue30d = paidOrders.reduce((sum, o) => {
    const amount = parseFloat(String(
      (o.totalPriceSet as Record<string, unknown> & { shopMoney: { amount: string } })?.shopMoney?.amount || 0
    ))
    return sum + amount
  }, 0)

  const shopInfo = shopData.shop as Record<string, unknown>

  return {
    shop: {
      name: shopInfo?.name,
      myshopify_domain: shopInfo?.myshopifyDomain,
      email: shopInfo?.email,
      currency: shopInfo?.currencyCode,
      plan_name: (shopInfo?.plan as Record<string, unknown>)?.displayName,
      timezone: shopInfo?.ianaTimezone,
      created_at: shopInfo?.createdAt,
    },
    counts: {
      total_orders: (countData.ordersCount as { count: number })?.count ?? null,
      total_products: (productCountData.productsCount as { count: number })?.count ?? null,
      total_customers: (customerCountData.customersCount as { count: number })?.count ?? null,
      orders_last_30d: recentOrders.length,
      paid_orders_last_30d: paidOrders.length,
    },
    revenue: {
      last_30d: Math.round(revenue30d * 100) / 100,
      currency: (shopInfo?.currencyCode as string) || 'USD',
    },
  }
}

// ── Route handler ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // 1. Authenticate the AskBiz user
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // 2. Parse query params
  const { searchParams } = request.nextUrl
  const resource = (searchParams.get('resource') || 'summary') as ShopifyResource
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 250)
  const cursor = searchParams.get('cursor') || undefined

  const validResources: ShopifyResource[] = ['orders', 'products', 'customers', 'inventory', 'summary']
  if (!validResources.includes(resource)) {
    return NextResponse.json(
      { error: `Invalid resource. Use: ${validResources.join(', ')}` },
      { status: 400 }
    )
  }

  // 3. Load THIS user's Shopify connection — each user has their own
  const svc = createServiceClient()
  const { data: source, error: sourceError } = await svc
    .from('connected_sources')
    .select('id, name, config, credentials, status, last_synced_at')
    .eq('user_id', user.id)
    .eq('source_type', 'shopify')
    .eq('status', 'active')
    .single()

  if (sourceError || !source) {
    return NextResponse.json(
      { error: 'No Shopify store connected. Go to Sources to connect your store.' },
      { status: 404 }
    )
  }

  // 4. Decrypt their credentials — completely unique per user
  const creds = decryptCredentials(source.credentials as Record<string, unknown>)
  const token = String(creds.access_token || '')
  const shop = String((source.config as Record<string, unknown>).shop_domain || '')

  if (!token || !shop) {
    return NextResponse.json(
      { error: 'Shopify credentials are incomplete — reconnect your store.' },
      { status: 422 }
    )
  }

  // 5. Fetch from THEIR Shopify store using THEIR token (GraphQL)
  try {
    let data: Record<string, unknown>

    if (resource === 'orders') {
      data = await fetchOrders(shop, token, limit, cursor)
    } else if (resource === 'products') {
      data = await fetchProducts(shop, token, limit, cursor)
    } else if (resource === 'customers') {
      data = await fetchCustomers(shop, token, limit, cursor)
    } else if (resource === 'inventory') {
      data = await fetchInventory(shop, token)
    } else {
      data = await fetchSummary(shop, token)
    }

    return NextResponse.json({
      ok: true,
      source: {
        id: source.id,
        name: source.name,
        shop_domain: shop,
        last_synced_at: source.last_synced_at,
      },
      resource,
      ...data,
    })

  } catch (e: unknown) {
    const err = e as Error & { isAuthError?: boolean }

    // Auth errors mean the token was revoked — mark the source as errored
    if (err.isAuthError) {
      await svc.from('connected_sources').update({
        status: 'error',
        error_message: err.message,
      }).eq('id', source.id)

      return NextResponse.json(
        { error: err.message, action: 'reconnect' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: err.message || 'Failed to fetch Shopify data' },
      { status: 500 }
    )
  }
}
