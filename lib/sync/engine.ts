// ============================================================
// SignalX Sync Engine
// Pulls from each source, normalises, upserts into unified_data
// ============================================================
import { createServiceClient } from '@/lib/supabase/server'
import {
  normaliseShopify, normaliseStripe, normaliseSquare,
  normaliseQuickBooks, normaliseGoogleSheets,
  type UnifiedRecord
} from './normaliser'
import { normaliseAmazonOrder } from './amazon-normaliser'
import { normaliseEbayOrder } from './ebay-normaliser'
import { normaliseEtsyReceipt } from './etsy-normaliser'
import { normaliseWooOrder } from './woocommerce-normaliser'
import { normaliseWalmartOrder } from './walmart-normaliser'
import {
  normaliseTikTokOrders, normaliseTikTokAnalytics,
  normaliseInstagramOrders, normaliseInstagramInsights,
  normalisePinterestAnalytics,
  type SocialSignalRecord,
} from './social-normaliser'
import { decryptCredentials, encryptCredentials } from '@/lib/crypto'

interface SyncResult {
  sourceId: string
  sourceName: string
  status: 'success' | 'error' | 'partial'
  recordsSynced: number
  recordsNew: number
  recordsUpdated: number
  error?: string
}

// ── Upsert records into unified_data ─────────────────────────
async function upsertRecords(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  sourceId: string,
  records: UnifiedRecord[]
): Promise<{ inserted: number; updated: number }> {
  if (!records.length) return { inserted: 0, updated: 0 }

  let inserted = 0, updated = 0

  // Batch in chunks of 100 to avoid payload limits
  for (let i = 0; i < records.length; i += 100) {
    const batch = records.slice(i, i + 100).map(r => ({
      ...r,
      user_id: userId,
      source_id: sourceId,
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('unified_data')
      .upsert(batch, {
        onConflict: 'user_id,source_type,source_record_id',
        ignoreDuplicates: false,
      })
      .select('id')

    if (!error && data) {
      inserted += data.length
    }
  }

  return { inserted, updated }
}

// ── Shopify: refresh expired access token ─────────────────────
async function refreshShopifyToken(
  sourceId: string,
  shopDomain: string,
  refreshToken: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ access_token: string; refresh_token: string } | null> {
  const res = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SHOPIFY_CLIENT_ID || '',
      client_secret: process.env.SHOPIFY_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  // Persist new tokens
  await supabase
    .from('connected_sources')
    .update({ credentials: encryptCredentials({ access_token: data.access_token, refresh_token: data.refresh_token }) })
    .eq('id', sourceId)
  return { access_token: data.access_token, refresh_token: data.refresh_token }
}

// ── Shopify sync (GraphQL) ────────────────────────────────────
async function syncShopify(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { shop_domain } = source.config
  const { access_token } = source.credentials

  if (!shop_domain || !access_token) return { records: [], error: 'Missing shop domain or access token' }

  const shop = String(shop_domain)
  const token = String(access_token)

  // ── Inline GraphQL helper ─────────────────────────────────
  const gql = async (query: string, variables: Record<string, unknown> = {}) => {
    const res = await fetch(`https://${shop}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
    if (!res.ok) throw new Error(`Shopify GraphQL error: ${res.status}`)
    const json = await res.json()
    if (json.errors?.length) throw new Error(json.errors[0]?.message || 'GraphQL error')
    return json.data as Record<string, unknown>
  }

  // ── Cursor-based paginator ────────────────────────────────
  const fetchAll = async (query: string, key: string): Promise<Record<string, unknown>[]> => {
    const nodes: Record<string, unknown>[] = []
    let cursor: string | null = null
    do {
      const data = await gql(query, { cursor })
      const conn = data[key] as {
        edges: { node: Record<string, unknown> }[]
        pageInfo: { hasNextPage: boolean; endCursor: string }
      }
      nodes.push(...conn.edges.map(e => e.node))
      cursor = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null
    } while (cursor)
    return nodes
  }

  try {
    // ── Orders ──────────────────────────────────────────────
    const ORDERS_QUERY = `
      query GetOrders($cursor: String) {
        orders(first: 250, after: $cursor, query: "status:any") {
          edges {
            node {
              id name createdAt displayFinancialStatus currencyCode
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
                    id name quantity
                    originalUnitPriceSet { shopMoney { amount } }
                    totalDiscountSet { shopMoney { amount } }
                    variant {
                      id sku title inventoryQuantity
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

    const orders = await fetchAll(ORDERS_QUERY, 'orders')
    const records = orders.flatMap(normaliseShopify)

    // ── Products + inventory (supplemental) ─────────────────
    try {
      const PRODUCTS_QUERY = `
        query GetProducts($cursor: String) {
          products(first: 250, after: $cursor) {
            edges {
              node {
                id title productType vendor
                variants(first: 100) {
                  edges {
                    node {
                      id sku title price inventoryQuantity
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

      const products = await fetchAll(PRODUCTS_QUERY, 'products')

      for (const p of products) {
        const variantEdges = ((p.variants as Record<string, unknown>)
          ?.edges as { node: Record<string, unknown> }[]) || []

        for (const ve of variantEdges) {
          const v = ve.node
          const price = Number(v.price) || 0
          const cost = Number(
            ((v.inventoryItem as Record<string, unknown>)
              ?.unitCost as Record<string, unknown>)?.amount
          ) || 0
          const qty = Number(v.inventoryQuantity) || 0
          const sku = String(v.sku || '')
          const variantTitle = String(v.title || 'Default Title')
          const productName = `${p.title}${variantTitle !== 'Default Title' ? ` - ${variantTitle}` : ''}`
          const sourceRecordId = `shopify_product_${p.id}_variant_${v.id}`

          if (records.some(r => r.sku === sku && sku)) continue

          const marginPct = price > 0 ? ((price - cost) / price) * 100 : 0
          records.push({
            record_date: new Date().toISOString().split('T')[0],
            sku: sku || String(v.id),
            product_name: String(productName),
            category: String(p.productType || ''),
            variant: variantTitle === 'Default Title' ? '' : variantTitle,
            supplier: String(p.vendor || ''),
            units_sold: 0,
            selling_price: price,
            discount: 0,
            gross_revenue: 0,
            net_revenue: 0,
            cost_price: cost,
            shipping_cost: 0,
            packaging_cost: 0,
            marketplace_fee: 0,
            tax: 0,
            total_cost: cost,
            gross_margin: Math.round(marginPct * 100) / 100,
            net_margin: Math.round(marginPct * 100) / 100,
            stock_level: qty,
            stock_movement: 0,
            low_stock_flag: qty > 0 && qty < 10,
            damaged_stock: 0,
            channel: 'shopify',
            customer_region: '',
            currency: 'USD',
            ad_spend: 0,
            campaign: '',
            coupon_code: '',
            coupon_discount: 0,
            payment_status: 'inventory',
            refund_amount: 0,
            payout_amount: 0,
            source_record_id: sourceRecordId,
            source_type: 'shopify',
            raw_data: { product_id: p.id, variant_id: v.id, ...v },
          } as UnifiedRecord)
        }
      }
    } catch (_) {
      // Product fetch is supplemental — don't fail the whole sync
    }

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Shopify sync failed' }
  }
}

// ── Stripe sync ───────────────────────────────────────────────
async function syncStripe(
  source: { config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { secret_key } = source.credentials
  if (!secret_key) return { records: [], error: 'Missing Stripe secret key' }

  try {
    const res = await fetch('https://api.stripe.com/v1/payment_intents?limit=100', {
      headers: { Authorization: `Bearer ${secret_key}` }
    })
    if (!res.ok) throw new Error(`Stripe API error: ${res.status}`)
    const { data: payments } = await res.json()
    const records = (payments as Record<string, unknown>[]).map(normaliseStripe)
    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Stripe sync failed' }
  }
}

// ── Google Sheets sync ────────────────────────────────────────
async function syncGoogleSheets(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { spreadsheet_id, sheet_name = 'Sheet1' } = source.config
  const { access_token } = source.credentials

  if (!spreadsheet_id || !access_token) return { records: [], error: 'Missing spreadsheet ID or access token' }

  try {
    const range = encodeURIComponent(`${sheet_name}!A1:ZZ10000`)
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${range}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    if (!res.ok) throw new Error(`Google Sheets API error: ${res.status}`)
    const { values } = await res.json()

    if (!values?.length) return { records: [], error: 'No data in sheet' }

    // First row is headers
    const headers = (values[0] as string[]).map((h: string) => h.toLowerCase().replace(/\s+/g, '_'))
    const rows = (values as string[][]).slice(1).map(row =>
      Object.fromEntries(headers.map((h: string, i: number) => [h, row[i] || '']))
    )
    const records = normaliseGoogleSheets(rows, source.id)
    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Google Sheets sync failed' }
  }
}

// ── Token refresh helper ─────────────────────────────────────
async function refreshGoogleToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
      }),
    })
    if (!res.ok) return null
    const { access_token } = await res.json()
    return access_token
  } catch { return null }
}

async function refreshQuickBooksToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID!
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: { Authorization: `Basic ${basicAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function refreshAmazonToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.amazon.com/auth/o2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.AMAZON_LWA_CLIENT_ID!,
        client_secret: process.env.AMAZON_LWA_CLIENT_SECRET!,
      }),
    })
    if (!res.ok) return null
    const { access_token } = await res.json()
    return access_token
  } catch { return null }
}

// ── Square sync ───────────────────────────────────────────────
async function syncSquare(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { access_token } = source.credentials
  const { location_id } = source.config
  if (!access_token) return { records: [], error: 'Missing Square access token' }

  try {
    const endpoint = location_id
      ? `https://connect.squareup.com/v2/orders/search`
      : `https://connect.squareup.com/v2/orders/search`

    const body = {
      location_ids: location_id ? [location_id] : [],
      query: {
        sort: { sort_field: 'CREATED_AT', sort_order: 'DESC' },
        filter: { date_time_filter: {
          created_at: {
            start_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
          }
        }}
      },
      limit: 500,
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-17',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Square API error: ${res.status}`)
    const { orders } = await res.json()
    const records = (orders as Record<string, unknown>[]).flatMap(normaliseSquare)
    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Square sync failed' }
  }
}

// ── QuickBooks sync ───────────────────────────────────────────
async function syncQuickBooks(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { realm_id } = source.config
  if (!access_token || !realm_id) return { records: [], error: 'Missing QuickBooks credentials' }

  try {
    // Try to fetch invoices; if 401, refresh token first
    let res = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${realm_id}/query?query=SELECT * FROM Invoice MAXRESULTS 500&minorversion=65`,
      { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
    )

    if (res.status === 401 && refresh_token) {
      const refreshed = await refreshQuickBooksToken(String(refresh_token))
      if (refreshed) {
        access_token = refreshed.access_token
        refresh_token = refreshed.refresh_token
        // Update stored tokens (re-encrypt)
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ access_token, refresh_token })
        }).eq('id', source.id)

        res = await fetch(
          `https://quickbooks.api.intuit.com/v3/company/${realm_id}/query?query=SELECT * FROM Invoice MAXRESULTS 500&minorversion=65`,
          { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
        )
      }
    }

    if (!res.ok) throw new Error(`QuickBooks API error: ${res.status}`)
    const data = await res.json()
    const invoices = data?.QueryResponse?.Invoice || []
    const records = (invoices as Record<string, unknown>[]).flatMap(normaliseQuickBooks)
    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'QuickBooks sync failed' }
  }
}

// ── Amazon FBA sync ───────────────────────────────────────────
async function syncAmazon(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { selling_partner_id, marketplace_id = 'ATVPDKIKX0DER', region = 'us-east-1' } = source.config

  if (!access_token) return { records: [], error: 'Missing Amazon credentials' }

  const baseUrl = `https://sellingpartnerapi-na.amazon.com`

  // Refresh token if needed
  const getHeaders = () => ({
    'x-amz-access-token': String(access_token),
    'Content-Type': 'application/json',
  })

  try {
    // Fetch orders from last 30 days
    const createdAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    let res = await fetch(
      `${baseUrl}/orders/v0/orders?MarketplaceIds=${marketplace_id}&CreatedAfter=${createdAfter}&OrderStatuses=Shipped,Unshipped,PartiallyShipped&MaxResultsPerPage=100`,
      { headers: getHeaders() }
    )

    // Handle token expiry
    if (res.status === 401 && refresh_token) {
      const newToken = await refreshAmazonToken(String(refresh_token))
      if (newToken) {
        access_token = newToken
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ ...source.credentials, access_token })
        }).eq('id', source.id)
        res = await fetch(
          `${baseUrl}/orders/v0/orders?MarketplaceIds=${marketplace_id}&CreatedAfter=${createdAfter}&OrderStatuses=Shipped&MaxResultsPerPage=100`,
          { headers: getHeaders() }
        )
      }
    }

    if (!res.ok) throw new Error(`Amazon SP-API error: ${res.status}`)
    const data = await res.json()
    const orders = data?.payload?.Orders || []

    // Fetch order items for each order (batch to avoid rate limits)
    const allRecords: UnifiedRecord[] = []
    const orderBatch = orders.slice(0, 20) // Limit to 20 orders to avoid rate limits

    for (const order of orderBatch) {
      try {
        const itemsRes = await fetch(
          `${baseUrl}/orders/v0/orders/${order.AmazonOrderId}/orderItems`,
          { headers: getHeaders() }
        )
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json()
          const orderWithItems = { ...order, OrderItems: itemsData?.payload?.OrderItems || [] }
          allRecords.push(...normaliseAmazonOrder(orderWithItems))
        }
      } catch { /* skip individual order failures */ }

      // Rate limit: 1 req/sec for orders
      await new Promise(r => setTimeout(r, 200))
    }

    // Also fetch FBA inventory for stock levels
    try {
      const invRes = await fetch(
        `${baseUrl}/fba/inventory/v1/summaries?details=true&granularityType=Marketplace&granularityId=${marketplace_id}&marketplaceIds=${marketplace_id}`,
        { headers: getHeaders() }
      )
      if (invRes.ok) {
        const invData = await invRes.json()
        const inventories = invData?.payload?.inventorySummaries || []
        for (const inv of inventories as Record<string, unknown>[]) {
          const asin = String((inv as any).asin || '')
          const sku = String((inv as any).sellerSku || asin)
          if (!sku || allRecords.some(r => r.sku === sku)) continue

          const qty = Number((inv as any).inventoryDetails?.fulfillableQuantity) || Number((inv as any).totalQuantity) || 0
          const name = String((inv as any).productName || sku)

          allRecords.push({
            record_date: new Date().toISOString().split('T')[0],
            sku,
            product_name: name,
            category: '',
            variant: '',
            supplier: '',
            units_sold: 0,
            selling_price: 0,
            discount: 0,
            gross_revenue: 0,
            net_revenue: 0,
            cost_price: 0,
            shipping_cost: 0,
            packaging_cost: 0,
            marketplace_fee: 0,
            tax: 0,
            total_cost: 0,
            gross_margin: 0,
            net_margin: 0,
            stock_level: qty,
            stock_movement: 0,
            low_stock_flag: qty > 0 && qty < 10,
            damaged_stock: 0,
            channel: 'amazon_fba',
            customer_region: '',
            currency: 'USD',
            ad_spend: 0,
            campaign: '',
            coupon_code: '',
            coupon_discount: 0,
            payment_status: 'inventory',
            refund_amount: 0,
            payout_amount: 0,
            source_record_id: `amazon_inventory_${sku}`,
            source_type: 'amazon_fba',
            raw_data: inv,
          } as UnifiedRecord)
        }
      }
    } catch (_) {
      // Inventory fetch is supplemental
    }

    return { records: allRecords }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Amazon sync failed' }
  }
}

// ── eBay sync ────────────────────────────────────────────────
async function syncEbay(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  if (!access_token) return { records: [], error: 'Missing eBay credentials' }

  try {
    // Fetch orders from last 30 days
    const createdFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    let res = await fetch(
      `https://api.ebay.com/sell/fulfillment/v1/order?filter=creationdate:[${createdFrom}..]&limit=100`,
      { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
    )

    // Handle token expiry — refresh and retry
    if (res.status === 401 && refresh_token) {
      const newToken = await refreshEbayToken(String(refresh_token))
      if (newToken) {
        access_token = newToken
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ ...source.credentials, access_token })
        }).eq('id', source.id)
        res = await fetch(
          `https://api.ebay.com/sell/fulfillment/v1/order?filter=creationdate:[${createdFrom}..]&limit=100`,
          { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
        )
      }
    }

    if (!res.ok) throw new Error(`eBay API error: ${res.status}`)
    const data = await res.json()
    const orders = data?.orders || []
    const records = (orders as Record<string, unknown>[]).flatMap(normaliseEbayOrder)

    // Also fetch active inventory listings for stock data
    try {
      const invRes = await fetch(
        'https://api.ebay.com/sell/inventory/v1/inventory_item?limit=200',
        { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
      )
      if (invRes.ok) {
        const invData = await invRes.json()
        const items = (invData?.inventoryItems || []) as Record<string, unknown>[]
        for (const item of items) {
          const sku = String((item as any).sku || '')
          if (!sku || records.some(r => r.sku === sku)) continue

          const product = (item as any).product || {}
          const availability = (item as any).availability?.shipToLocationAvailability || {}
          const qty = Number(availability.quantity) || 0
          const price = 0 // eBay inventory API doesn't include price; set from offers below
          const title = String(product.title || sku)

          records.push({
            record_date: new Date().toISOString().split('T')[0],
            sku,
            product_name: title,
            category: String(product.aspects?.Category?.[0] || product.aspects?.Type?.[0] || ''),
            variant: '',
            supplier: '',
            units_sold: 0,
            selling_price: price,
            discount: 0,
            gross_revenue: 0,
            net_revenue: 0,
            cost_price: 0,
            shipping_cost: 0,
            packaging_cost: 0,
            marketplace_fee: 0,
            tax: 0,
            total_cost: 0,
            gross_margin: 0,
            net_margin: 0,
            stock_level: qty,
            stock_movement: 0,
            low_stock_flag: qty > 0 && qty < 5,
            damaged_stock: 0,
            channel: 'ebay',
            customer_region: '',
            currency: 'USD',
            ad_spend: 0,
            campaign: '',
            coupon_code: '',
            coupon_discount: 0,
            payment_status: 'inventory',
            refund_amount: 0,
            payout_amount: 0,
            source_record_id: `ebay_inventory_${sku}`,
            source_type: 'ebay',
            raw_data: item,
          } as UnifiedRecord)
        }
      }
    } catch (_) {
      // Inventory fetch is supplemental — don't fail the whole sync
    }

    // Fetch active offers to get prices for inventory items
    try {
      const offersRes = await fetch(
        'https://api.ebay.com/sell/inventory/v1/offer?limit=200',
        { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
      )
      if (offersRes.ok) {
        const offersData = await offersRes.json()
        const offers = (offersData?.offers || []) as Record<string, unknown>[]
        for (const offer of offers) {
          const sku = String((offer as any).sku || '')
          const priceObj = (offer as any).pricingSummary?.price || {}
          const price = Number(priceObj.value) || 0
          const existing = records.find(r => r.sku === sku && r.source_type === 'ebay' && r.payment_status === 'inventory')
          if (existing && price > 0) {
            existing.selling_price = price
            ;(existing as unknown as Record<string, unknown>).value_at_retail = price * existing.stock_level
          }
        }
      }
    } catch (_) {}

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'eBay sync failed' }
  }
}

async function refreshEbayToken(refreshToken: string): Promise<string | null> {
  try {
    const credentials = Buffer.from(
      `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
    ).toString('base64')
    const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        scope: 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.analytics.readonly',
      }),
    })
    if (!res.ok) return null
    const { access_token } = await res.json()
    return access_token
  } catch { return null }
}

// ── Etsy sync ────────────────────────────────────────────────
async function syncEtsy(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { shop_id } = source.config
  if (!access_token) return { records: [], error: 'Missing Etsy credentials' }

  const apiKey = process.env.ETSY_CLIENT_ID || ''
  const headers = () => ({
    Authorization: `Bearer ${access_token}`,
    'x-api-key': apiKey,
    Accept: 'application/json',
  })

  try {
    // If we don't have shop_id, fetch it from /users/me
    let resolvedShopId = shop_id ? String(shop_id) : ''
    if (!resolvedShopId) {
      const meRes = await fetch('https://openapi.etsy.com/v3/application/users/me', { headers: headers() })
      if (meRes.ok) {
        const me = await meRes.json()
        resolvedShopId = String(me.shop_id || '')
      }
    }
    if (!resolvedShopId) return { records: [], error: 'Could not determine Etsy shop ID' }

    // Fetch recent receipts (orders) — last 30 days
    const minCreated = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000)
    let res = await fetch(
      `https://openapi.etsy.com/v3/application/shops/${resolvedShopId}/receipts?min_created=${minCreated}&limit=100`,
      { headers: headers() }
    )

    // Handle token expiry
    if (res.status === 401 && refresh_token) {
      const newToken = await refreshEtsyToken(String(refresh_token))
      if (newToken) {
        access_token = newToken.access_token
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({
            ...source.credentials,
            access_token: newToken.access_token,
            refresh_token: newToken.refresh_token,
          })
        }).eq('id', source.id)
        res = await fetch(
          `https://openapi.etsy.com/v3/application/shops/${resolvedShopId}/receipts?min_created=${minCreated}&limit=100`,
          { headers: headers() }
        )
      }
    }

    if (!res.ok) throw new Error(`Etsy API error: ${res.status}`)
    const data = await res.json()
    const receipts = data?.results || []
    const records = (receipts as Record<string, unknown>[]).flatMap(normaliseEtsyReceipt)

    // Also fetch active listings for inventory data
    try {
      const listRes = await fetch(
        `https://openapi.etsy.com/v3/application/shops/${resolvedShopId}/listings/active?limit=100&includes=Images`,
        { headers: headers() }
      )
      if (listRes.ok) {
        const listData = await listRes.json()
        const listings = (listData?.results || []) as Record<string, unknown>[]
        for (const listing of listings) {
          const listingId = String((listing as any).listing_id || '')
          const title = String((listing as any).title || 'Unknown')
          const sku = String((listing as any).sku?.[0] || listingId)
          if (records.some(r => r.sku === sku && sku !== listingId)) continue

          const price = Number((listing as any).price?.amount || 0) / Number((listing as any).price?.divisor || 100)
          const qty = Number((listing as any).quantity) || 0
          const category = String((listing as any).taxonomy?.name || (listing as any).tags?.[0] || '')

          records.push({
            record_date: new Date().toISOString().split('T')[0],
            sku,
            product_name: title,
            category,
            variant: '',
            supplier: '',
            units_sold: 0,
            selling_price: price,
            discount: 0,
            gross_revenue: 0,
            net_revenue: 0,
            cost_price: 0,
            shipping_cost: 0,
            packaging_cost: 0,
            marketplace_fee: 0,
            tax: 0,
            total_cost: 0,
            gross_margin: 0,
            net_margin: 0,
            stock_level: qty,
            stock_movement: 0,
            low_stock_flag: qty > 0 && qty < 5,
            damaged_stock: 0,
            channel: 'etsy',
            customer_region: '',
            currency: String((listing as any).price?.currency_code || 'USD'),
            ad_spend: 0,
            campaign: '',
            coupon_code: '',
            coupon_discount: 0,
            payment_status: 'inventory',
            refund_amount: 0,
            payout_amount: 0,
            source_record_id: `etsy_listing_${listingId}`,
            source_type: 'etsy',
            raw_data: listing,
          } as UnifiedRecord)
        }
      }
    } catch (_) {
      // Listing fetch is supplemental
    }

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Etsy sync failed' }
  }
}

async function refreshEtsyToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const res = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.ETSY_CLIENT_ID!,
        refresh_token: refreshToken,
      }),
    })
    if (!res.ok) return null
    const { access_token, refresh_token } = await res.json()
    return { access_token, refresh_token }
  } catch { return null }
}

// ── Google Sheets sync with token refresh ────────────────────
async function syncGoogleSheetsWithRefresh(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { spreadsheet_id, sheet_name = 'Sheet1' } = source.config
  if (!spreadsheet_id || !access_token) return { records: [], error: 'Missing spreadsheet ID or access token' }

  try {
    const range = encodeURIComponent(`${sheet_name}!A1:ZZ10000`)
    let res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${range}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    )

    if (res.status === 401 && refresh_token) {
      const newToken = await refreshGoogleToken(String(refresh_token))
      if (newToken) {
        access_token = newToken
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ ...source.credentials, access_token })
        }).eq('id', source.id)
        res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${range}`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
      }
    }

    if (!res.ok) throw new Error(`Google Sheets API error: ${res.status}`)
    const { values } = await res.json()
    if (!values?.length) return { records: [], error: 'No data in sheet' }

    const headers = (values[0] as string[]).map((h: string) => h.toLowerCase().replace(/\s+/g, '_'))
    const rows = (values as string[][]).slice(1).map(row =>
      Object.fromEntries(headers.map((h: string, i: number) => [h, row[i] || '']))
    )
    const { normaliseGoogleSheets } = await import('./normaliser')
    return { records: normaliseGoogleSheets(rows, source.id) }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Google Sheets sync failed' }
  }
}

// ── Upsert social signals ─────────────────────────────────────
async function upsertSocialSignals(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  sourceId: string,
  signals: SocialSignalRecord[]
): Promise<void> {
  if (!signals.length) return
  for (let i = 0; i < signals.length; i += 100) {
    const batch = signals.slice(i, i + 100).map(s => ({
      ...s,
      user_id: userId,
      source_id: sourceId,
      synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    await supabase
      .from('social_signals')
      .upsert(batch, { onConflict: 'user_id,source_type,content_id', ignoreDuplicates: false })
  }
}

// ── TikTok Shop sync ──────────────────────────────────────────
async function syncTikTokShop(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; signals: SocialSignalRecord[]; error?: string }> {
  const { access_token, shop_id } = source.credentials
  if (!access_token || !shop_id) return { records: [], signals: [], error: 'Missing TikTok access token or shop ID' }

  try {
    const headers = {
      'x-tts-access-token': String(access_token),
      'Content-Type': 'application/json',
    }

    // Fetch recent orders (last 30 days)
    const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000)
    const ordersRes = await fetch(
      `https://open-api.tiktokglobalshop.com/order/202309/orders/search`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          page_size: 100,
          sort_field: 'CREATE_TIME',
          sort_order: 'DESC',
          create_time_ge: since,
        }),
      }
    )

    let orders: Record<string, unknown>[] = []
    if (ordersRes.ok) {
      const data = await ordersRes.json()
      orders = (data?.data?.orders || data?.orders || []) as Record<string, unknown>[]
    }

    // Fetch product analytics
    const analyticsRes = await fetch(
      `https://open-api.tiktokglobalshop.com/analytics/202309/shop/products/performance`,
      { method: 'POST', headers, body: JSON.stringify({ page_size: 50 }) }
    )

    let analytics: Record<string, unknown>[] = []
    if (analyticsRes.ok) {
      const data = await analyticsRes.json()
      analytics = (data?.data?.items || []) as Record<string, unknown>[]
    }

    return {
      records: normaliseTikTokOrders(orders),
      signals: normaliseTikTokAnalytics(analytics),
    }
  } catch (e: unknown) {
    return { records: [], signals: [], error: e instanceof Error ? e.message : 'TikTok Shop sync failed' }
  }
}

// ── Instagram sync ────────────────────────────────────────────
async function syncInstagram(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; signals: SocialSignalRecord[]; error?: string }> {
  const { access_token, ig_user_id } = source.credentials
  if (!access_token || !ig_user_id) return { records: [], signals: [], error: 'Missing Instagram access token or user ID' }

  const token = String(access_token)
  const igId  = String(ig_user_id)

  try {
    // Fetch recent media with insights
    const mediaRes = await fetch(
      `https://graph.facebook.com/v18.0/${igId}/media?fields=id,media_type,timestamp,like_count,comments_count&limit=50&access_token=${token}`
    )

    let posts: Record<string, unknown>[] = []
    if (mediaRes.ok) {
      const data = await mediaRes.json()
      const items = (data?.data || []) as Record<string, unknown>[]

      // Fetch insights for each post (batch up to 20)
      const sample = items.slice(0, 20)
      posts = await Promise.all(sample.map(async post => {
        try {
          const insightRes = await fetch(
            `https://graph.facebook.com/v18.0/${post.id}/insights?metric=reach,impressions,saved,profile_visits,website_clicks&access_token=${token}`
          )
          if (!insightRes.ok) return post
          const { data: metrics } = await insightRes.json()
          const merged: Record<string, unknown> = { ...post }
          for (const m of (metrics as Record<string, unknown>[])) {
            merged[String(m.name)] = (m.values as any)?.[0]?.value || 0
          }
          return merged
        } catch { return post }
      }))
    }

    // Fetch commerce orders if catalog_id is set
    let orders: Record<string, unknown>[] = []
    const catalogId = source.credentials.catalog_id
    if (catalogId) {
      const ordersRes = await fetch(
        `https://graph.facebook.com/v18.0/${igId}/orders?access_token=${token}`
      )
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        orders = (data?.data || []) as Record<string, unknown>[]
      }
    }

    return {
      records: normaliseInstagramOrders(orders),
      signals: normaliseInstagramInsights(posts),
    }
  } catch (e: unknown) {
    return { records: [], signals: [], error: e instanceof Error ? e.message : 'Instagram sync failed' }
  }
}

// ── Pinterest sync ────────────────────────────────────────────
async function syncPinterest(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; signals: SocialSignalRecord[]; error?: string }> {
  const { access_token } = source.credentials
  if (!access_token) return { records: [], signals: [], error: 'Missing Pinterest access token' }

  try {
    const headers = { Authorization: `Bearer ${access_token}` }

    // Fetch pins with analytics (last 30 days)
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const pinsRes = await fetch(
      `https://api.pinterest.com/v5/pins?page_size=50`,
      { headers }
    )

    let pins: Record<string, unknown>[] = []
    if (pinsRes.ok) {
      const data = await pinsRes.json()
      const items = (data?.items || []) as Record<string, unknown>[]

      // Fetch analytics for each pin
      pins = await Promise.all(items.slice(0, 25).map(async pin => {
        try {
          const analyticsRes = await fetch(
            `https://api.pinterest.com/v5/pins/${pin.id}/analytics?start_date=${since}&end_date=${new Date().toISOString().split('T')[0]}&metric_types=IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK`,
            { headers }
          )
          if (!analyticsRes.ok) return pin
          const analytics = await analyticsRes.json()
          const summary = analytics?.all?.daily_metrics?.reduce(
            (acc: Record<string, number>, d: Record<string, unknown>) => {
              for (const [k, v] of Object.entries(d.metrics || {})) {
                acc[k] = (acc[k] || 0) + Number(v)
              }
              return acc
            }, {}
          ) || {}
          return { ...pin, impressions: summary.IMPRESSION, saves: summary.SAVE, pin_clicks: summary.PIN_CLICK, outbound_clicks: summary.OUTBOUND_CLICK }
        } catch { return pin }
      }))
    }

    return {
      records: [],
      signals: normalisePinterestAnalytics(pins),
    }
  } catch (e: unknown) {
    return { records: [], signals: [], error: e instanceof Error ? e.message : 'Pinterest sync failed' }
  }
}

// ── Walmart ───────────────────────────────────────────────────
async function syncWalmart(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const client_id     = String(source.config?.client_id     || '')
  const client_secret = String(source.credentials?.client_secret || '')

  if (!client_id || !client_secret) {
    return { records: [], error: 'Missing Walmart client_id or client_secret' }
  }

  // Exchange for access token
  const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
  const tokenRes  = await fetch('https://marketplace.walmartapis.com/v3/token', {
    method: 'POST',
    headers: {
      Authorization:          `Basic ${basicAuth}`,
      'WM_SVC.NAME':          'Walmart Marketplace',
      'WM_QOS.CORRELATION_ID': `askbiz-sync-${Date.now()}`,
      'Content-Type':         'application/x-www-form-urlencoded',
      Accept:                 'application/json',
    },
    body: 'grant_type=client_credentials',
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    return { records: [], error: `Walmart auth failed ${tokenRes.status}: ${err.slice(0, 200)}` }
  }

  const { access_token } = await tokenRes.json() as { access_token: string }
  if (!access_token) return { records: [], error: 'Walmart: no access_token in response' }

  const headers = {
    Authorization:          `Bearer ${access_token}`,
    'WM_SVC.NAME':          'Walmart Marketplace',
    'WM_QOS.CORRELATION_ID': `askbiz-sync-${Date.now()}`,
    Accept:                 'application/json',
  }

  // Sync orders from last 90 days
  const createdStartDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const records: UnifiedRecord[] = []

  try {
    let nextCursor: string | undefined
    do {
      const params = new URLSearchParams({ createdStartDate, limit: '200' })
      if (nextCursor) params.set('nextCursor', nextCursor)

      const res = await fetch(
        `https://marketplace.walmartapis.com/v3/orders?${params}`,
        { headers }
      )
      if (!res.ok) {
        const err = await res.text()
        return { records, error: `Walmart orders error ${res.status}: ${err.slice(0, 200)}` }
      }

      const body = await res.json() as Record<string, unknown>
      const list  = (body.list as Record<string, unknown>) || {}
      const meta  = (list.meta as Record<string, unknown>) || {}
      const orders = (
        (list.elements as Record<string, unknown>)?.order as Record<string, unknown>[]
      ) || []

      for (const order of orders) records.push(...normaliseWalmartOrder(order))

      nextCursor = meta.nextCursor ? String(meta.nextCursor).trim() || undefined : undefined
    } while (nextCursor)

    return { records }
  } catch (e: unknown) {
    return { records, error: e instanceof Error ? e.message : 'Walmart sync failed' }
  }
}

// ── WooCommerce ───────────────────────────────────────────────
async function syncWooCommerce(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const consumer_key    = String(source.config?.consumer_key    || '')
  const consumer_secret = String(source.credentials?.consumer_secret || '')
  const site_url        = String(source.config?.site_url        || '').replace(/\/$/, '')

  if (!consumer_key || !consumer_secret || !site_url) {
    return { records: [], error: 'Missing WooCommerce credentials or site URL' }
  }

  const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64')
  const headers = { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }
  const base = `${site_url}/wp-json/wc/v3`

  // Sync orders from the last 90 days
  const after = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const records: UnifiedRecord[] = []

  try {
    let page = 1
    while (true) {
      const res = await fetch(
        `${base}/orders?per_page=100&page=${page}&after=${after}&status=any`,
        { headers }
      )
      if (!res.ok) {
        const err = await res.text()
        return { records, error: `WooCommerce orders error ${res.status}: ${err.slice(0, 200)}` }
      }
      const orders = await res.json() as Record<string, unknown>[]
      if (!orders.length) break
      for (const order of orders) records.push(...normaliseWooOrder(order))
      const totalPages = Number(res.headers.get('X-WP-TotalPages') || 1)
      if (page >= totalPages) break
      page++
    }
    return { records }
  } catch (e: unknown) {
    return { records, error: e instanceof Error ? e.message : 'WooCommerce sync failed' }
  }
}

// ── Main sync runner ──────────────────────────────────────────
export async function runSync(userId?: string): Promise<SyncResult[]> {
  const supabase = createServiceClient()
  const results: SyncResult[] = []

  // Get sources to sync
  let query = supabase
    .from('connected_sources')
    .select('*')
    .eq('status', 'active')

  if (userId) query = query.eq('user_id', userId)

  const { data: sources } = await query
  if (!sources?.length) return results

  for (const source of sources) {
    const startedAt = new Date()
    let records: UnifiedRecord[] = []
    let syncError: string | undefined

    // Decrypt credentials before passing to sync handlers
    const decryptedSource = {
      ...source,
      credentials: decryptCredentials(source.credentials as Record<string, unknown>),
    }

    // Route to correct sync handler
    try {
      if (source.source_type === 'shopify') {
        const r = await syncShopify(decryptedSource, source.user_id, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'stripe') {
        const r = await syncStripe(decryptedSource)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'square') {
        const r = await syncSquare(decryptedSource)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'quickbooks') {
        const r = await syncQuickBooks(decryptedSource, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'google_sheets') {
        const r = await syncGoogleSheetsWithRefresh(decryptedSource, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'amazon_fba') {
        const r = await syncAmazon(decryptedSource, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'ebay') {
        const r = await syncEbay(decryptedSource, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'etsy') {
        const r = await syncEtsy(decryptedSource, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'tiktok_shop') {
        const r = await syncTikTokShop(decryptedSource, source.user_id, supabase)
        records = r.records; syncError = r.error
        await upsertSocialSignals(supabase, source.user_id, source.id, r.signals)
      } else if (source.source_type === 'instagram') {
        const r = await syncInstagram(decryptedSource, source.user_id, supabase)
        records = r.records; syncError = r.error
        await upsertSocialSignals(supabase, source.user_id, source.id, r.signals)
      } else if (source.source_type === 'pinterest') {
        const r = await syncPinterest(decryptedSource)
        records = r.records; syncError = r.error
        await upsertSocialSignals(supabase, source.user_id, source.id, r.signals)
      } else if (source.source_type === 'woocommerce') {
        const r = await syncWooCommerce(decryptedSource)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'walmart') {
        const r = await syncWalmart(decryptedSource)
        records = r.records; syncError = r.error
      }
    } catch (e: unknown) {
      syncError = e instanceof Error ? e.message : 'Unknown sync error'
    }

    const { inserted, updated } = records.length
      ? await upsertRecords(supabase, source.user_id, source.id, records)
      : { inserted: 0, updated: 0 }

    const status = syncError ? (records.length ? 'partial' : 'error') : 'success'

    // Update source last_synced_at
    await supabase.from('connected_sources').update({
      last_synced_at: new Date().toISOString(),
      status: syncError && !records.length ? 'error' : 'active',
      error_message: syncError || null,
    }).eq('id', source.id)

    // Log the sync
    await supabase.from('sync_log').insert({
      source_id: source.id,
      user_id: source.user_id,
      status,
      records_synced: records.length,
      records_new: inserted,
      records_updated: updated,
      error_message: syncError,
      started_at: startedAt.toISOString(),
      finished_at: new Date().toISOString(),
    })

    await supabase.from('audit_log').insert({
      user_id: source.user_id,
      event: 'sync_completed',
      metadata: { source_type: source.source_type, records: records.length, status },
    })

    results.push({
      sourceId: source.id,
      sourceName: source.name,
      status,
      recordsSynced: records.length,
      recordsNew: inserted,
      recordsUpdated: updated,
      error: syncError,
    })
  }

  return results
}
