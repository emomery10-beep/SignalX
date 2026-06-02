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

// ── Shopify sync ──────────────────────────────────────────────
async function syncShopify(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { shop_domain } = source.config
  let { access_token, refresh_token } = source.credentials

  if (!shop_domain || !access_token) return { records: [], error: 'Missing shop domain or access token' }

  try {
    let res = await fetch(
      `https://${shop_domain}/admin/api/2025-01/orders.json?status=any&limit=250`,
      { headers: { 'X-Shopify-Access-Token': String(access_token) } }
    )

    // If 401/403 and we have a refresh token, try refreshing
    if ((res.status === 401 || res.status === 403) && refresh_token) {
      const refreshed = await refreshShopifyToken(source.id, String(shop_domain), String(refresh_token), supabase)
      if (refreshed) {
        access_token = refreshed.access_token
        res = await fetch(
          `https://${shop_domain}/admin/api/2025-01/orders.json?status=any&limit=250`,
          { headers: { 'X-Shopify-Access-Token': String(access_token) } }
        )
      }
    }

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Shopify API error: ${res.status} — ${errBody.substring(0, 200)}`)
    }
    const { orders } = await res.json()
    const records = (orders as Record<string, unknown>[]).flatMap(normaliseShopify)

    // Also fetch products for inventory data (even if there are no orders yet)
    try {
      const prodRes = await fetch(
        `https://${shop_domain}/admin/api/2025-01/products.json?limit=250&fields=id,title,variants,product_type,vendor`,
        { headers: { 'X-Shopify-Access-Token': String(access_token) } }
      )
      if (prodRes.ok) {
        const { products } = await prodRes.json()
        for (const p of (products || []) as Record<string, unknown>[]) {
          const variants = (p.variants as Record<string, unknown>[]) || []
          for (const v of variants) {
            const price = Number(v.price) || 0
            const cost = Number(v.cost) || 0 // Shopify variant cost field
            const qty = Number(v.inventory_quantity) || 0
            const sku = String(v.sku || '')
            const variantTitle = String(v.title || 'Default')
            const productName = `${p.title}${variantTitle !== 'Default Title' ? ` - ${variantTitle}` : ''}`
            const sourceRecordId = `shopify_product_${p.id}_variant_${v.id}`

            // Skip if we already have a more recent order record for this product
            if (records.some(r => r.sku === sku && sku)) continue

            const marginPct = price > 0 ? ((price - cost) / price) * 100 : 0
            records.push({
              record_date: new Date().toISOString().split('T')[0],
              sku: sku || String(v.id),
              product_name: String(productName),
              category: String(p.product_type || ''),
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
              currency: String(v.presentment_prices?.[0]?.price?.currency_code || 'USD'),
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
      `https://api.ebay.com/sell/fulfillment/v1/order?filter=creationdate:[${createdFrom}..] &limit=100`,
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
          `https://api.ebay.com/sell/fulfillment/v1/order?filter=creationdate:[${createdFrom}..] &limit=100`,
          { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
        )
      }
    }

    if (!res.ok) throw new Error(`eBay API error: ${res.status}`)
    const data = await res.json()
    const orders = data?.orders || []
    const records = (orders as Record<string, unknown>[]).flatMap(normaliseEbayOrder)
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
