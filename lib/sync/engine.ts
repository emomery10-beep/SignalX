// ============================================================
// SignalX Sync Engine
// Pulls from each source, normalises, upserts into unified_data
// ============================================================
import { createServiceClient } from '@/lib/supabase/server'
import {
  normaliseShopify, normaliseStripe, normaliseSquare, normaliseAskBizPOS,
  normaliseQuickBooks, normaliseQuickBooksBill, normaliseGoogleSheets,
  normaliseXeroInvoice, normaliseXeroBill,
  normaliseFreeAgentInvoice, normaliseFreeAgentBill,
  normaliseGoogleAnalyticsRow, normaliseGoCardlessPayment,
  normaliseMailchimpCampaign, normaliseKlaviyoCampaign,
  type UnifiedRecord, type QBExpenseRow
} from './normaliser'
import { normaliseAmazonOrder } from './amazon-normaliser'
import { normaliseJumiaOrderItem, normaliseJumiaStock } from './jumia-normaliser'
import { normaliseEbayOrder } from './ebay-normaliser'
import { normaliseEtsyReceipt } from './etsy-normaliser'
import { normaliseWooOrder } from './woocommerce-normaliser'
import { normaliseLinnworksOrder } from './linnworks-normaliser'
import { normaliseWalmartOrder } from './walmart-normaliser'
import {
  normaliseTikTokOrders, normaliseTikTokAnalytics,
  normaliseInstagramOrders, normaliseInstagramInsights,
  normalisePinterestAnalytics, normaliseGoogleAdsCampaign, normaliseMetaAdsInsight,
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
): Promise<{ inserted: number; updated: number; failed: number; error?: string }> {
  if (!records.length) return { inserted: 0, updated: 0, failed: 0 }

  let inserted = 0, updated = 0, failed = 0
  let lastError: string | undefined

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
    } else if (error) {
      // Don't swallow this: a batch can fail here even when the source fetch
      // above succeeded (e.g. a unique-constraint collision unrelated to this
      // batch's own onConflict target — see unified_data_pos_daily_uniq vs
      // syncAskBizPOS in the data-eng audit). Silently dropping it made
      // sync_log/connected_sources report 'success' while rows never landed.
      failed += batch.length
      lastError = error.message
      console.error(`[sync] unified_data upsert failed for user ${userId} source ${sourceId}: ${error.message}`)
    }
  }

  return { inserted, updated, failed, error: lastError }
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

async function refreshXeroToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const clientId = process.env.XERO_CLIENT_ID!
    const clientSecret = process.env.XERO_CLIENT_SECRET!
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch('https://identity.xero.com/connect/token', {
      method: 'POST',
      headers: { Authorization: `Basic ${basicAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function refreshFreeAgentToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const res = await fetch('https://api.freeagent.com/v2/token_endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.FREEAGENT_CLIENT_ID || '',
        client_secret: process.env.FREEAGENT_CLIENT_SECRET || '',
      }),
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

// ── AskBiz POS sync ────────────────────────────────────────────
// Same Supabase project as pos.askbiz.co — no external API call, just a
// direct read of this user's own pos_transactions/pos_items/inventory rows.
// Only runs for a user with a connected_sources row where source_type='askbiz_pos' —
// nothing in the current codebase creates that row (checked: no auth/callback/setup
// route inserts it), so this path is currently dormant/unreachable for new activity.
// DO NOT wire up a UI to create that row without first resolving the collision below:
// its per-line-item unified_data writes (source_type='askbiz_pos') target channel='pos'
// record_date=today, the same bucket `sync_pos_to_unified_data()` (018_pos.sql +
// 20260725 fixes) maintains as one aggregated row per user/day under source_type
// 'askbiz_pos_daily_agg'. Postgres enforces the unified_data_pos_daily_uniq partial
// index regardless of which onConflict target this function's caller (upsertRecords)
// specifies, so once the trigger's row exists for a day, every later line-item insert
// here 23505s and is now surfaced (not silently dropped) via upsertRecords' returned
// `failed` count — but it still never lands. Needs a product decision (keep one
// mechanism, or key the two under fully separate buckets) before re-enabling.
async function syncAskBizPOS(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  try {
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

    const { data: transactions, error: txErr } = await supabase
      .from('pos_transactions')
      .select('*')
      .eq('owner_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1000)
    if (txErr) throw new Error(txErr.message)
    if (!transactions?.length) return { records: [] }

    const txRows = transactions as Record<string, unknown>[]
    const txIds = txRows.map((t) => t.id as string)
    const { data: items } = await supabase
      .from('pos_items')
      .select('*')
      .in('transaction_id', txIds)

    const { data: inventory } = await supabase
      .from('inventory')
      .select('id, sku, stock_qty, low_stock_threshold')
      .eq('owner_id', userId)

    const inventoryById = new Map<string, { stock_qty: number; low_stock_threshold: number; sku: string }>(
      ((inventory || []) as Record<string, unknown>[]).map((inv) => [
        inv.id as string,
        { stock_qty: inv.stock_qty as number, low_stock_threshold: inv.low_stock_threshold as number, sku: (inv.sku as string) || '' },
      ])
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('currency')
      .eq('id', userId)
      .single()
    const currency = (profile as Record<string, unknown> | null)?.currency as string || 'USD'

    const itemsByTx = new Map<string, Record<string, unknown>[]>()
    for (const item of (items || []) as Record<string, unknown>[]) {
      const key = item.transaction_id as string
      const list = itemsByTx.get(key) || []
      list.push(item)
      itemsByTx.set(key, list)
    }

    const records = txRows.flatMap((tx) =>
      normaliseAskBizPOS(tx, itemsByTx.get(tx.id as string) || [], inventoryById, currency)
    )
    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'AskBiz POS sync failed' }
  }
}

// ── QuickBooks sync ───────────────────────────────────────────
async function syncQuickBooks(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { realm_id } = source.config
  if (!access_token || !realm_id) return { records: [], error: 'Missing QuickBooks credentials' }

  const qbBase = process.env.QUICKBOOKS_SANDBOX === 'true'
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com'

  const qbFetch = async (query: string) => {
    let res = await fetch(
      `${qbBase}/v3/company/${realm_id}/query?query=${encodeURIComponent(query)}&minorversion=65`,
      { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
    )
    if (res.status === 401 && refresh_token) {
      const refreshed = await refreshQuickBooksToken(String(refresh_token))
      if (refreshed) {
        access_token = refreshed.access_token
        refresh_token = refreshed.refresh_token
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ access_token, refresh_token })
        }).eq('id', source.id)
        res = await fetch(
          `${qbBase}/v3/company/${realm_id}/query?query=${encodeURIComponent(query)}&minorversion=65`,
          { headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' } }
        )
      }
    }
    if (!res.ok) throw new Error(`QuickBooks API error ${res.status}: ${query.slice(0, 40)}`)
    return res.json()
  }

  try {
    const [invoiceData, billData] = await Promise.all([
      qbFetch('SELECT * FROM Invoice ORDERBY MetaData.LastUpdatedTime DESC MAXRESULTS 500'),
      qbFetch('SELECT * FROM Bill ORDERBY MetaData.LastUpdatedTime DESC MAXRESULTS 500'),
    ])

    // ── Invoices → unified_data ───────────────────────────────
    const invoices = invoiceData?.QueryResponse?.Invoice || []
    const records = (invoices as Record<string, unknown>[]).flatMap(normaliseQuickBooks)

    // ── Bills → cfo_expenses (upsert by source_record_id) ────
    const bills = billData?.QueryResponse?.Bill || []
    const expenseRows: QBExpenseRow[] = (bills as Record<string, unknown>[])
      .map(normaliseQuickBooksBill)
      .filter((r): r is QBExpenseRow => r !== null)

    if (expenseRows.length > 0) {
      // Check which source_record_ids already exist to avoid overwriting manual edits
      const ids = expenseRows.map(r => r.source_record_id)
      const { data: existing } = await supabase
        .from('cfo_expenses')
        .select('source_record_id')
        .eq('user_id', userId)
        .in('source_record_id', ids)

      const existingIds = new Set((existing || []).map((r: { source_record_id: string }) => r.source_record_id))
      const toInsert = expenseRows
        .filter(r => !existingIds.has(r.source_record_id))
        .map(r => ({ ...r, user_id: userId }))

      if (toInsert.length > 0) {
        await supabase.from('cfo_expenses').insert(toInsert)
      }
    }

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'QuickBooks sync failed' }
  }
}

// ── Xero sync ───────────────────────────────────────────────
// Xero's /Invoices endpoint returns both sales invoices (ACCREC) and bills
// (ACCPAY) in one collection — split by Type below, same target tables as
// QuickBooks (unified_data for ACCREC, cfo_expenses for ACCPAY).
async function syncXero(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { tenant_id } = source.config
  if (!access_token || !tenant_id) return { records: [], error: 'Missing Xero credentials' }

  // Only approved/reconciled transactions — matches what the help article promises.
  const whereClause = encodeURIComponent('Status=="AUTHORISED" OR Status=="PAID"')

  const xeroFetch = async (page: number) => {
    const headers = () => ({
      Authorization: `Bearer ${access_token}`,
      'Xero-tenant-id': String(tenant_id),
      Accept: 'application/json',
    })
    let res = await fetch(
      `https://api.xero.com/api.xro/2.0/Invoices?where=${whereClause}&order=UpdatedDateUTC DESC&page=${page}`,
      { headers: headers() }
    )
    if (res.status === 401 && refresh_token) {
      const refreshed = await refreshXeroToken(String(refresh_token))
      if (refreshed) {
        access_token = refreshed.access_token
        refresh_token = refreshed.refresh_token
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ access_token, refresh_token })
        }).eq('id', source.id)
        res = await fetch(
          `https://api.xero.com/api.xro/2.0/Invoices?where=${whereClause}&order=UpdatedDateUTC DESC&page=${page}`,
          { headers: headers() }
        )
      }
    }
    if (!res.ok) throw new Error(`Xero API error ${res.status}`)
    return res.json()
  }

  try {
    const records: UnifiedRecord[] = []
    const billRows: QBExpenseRow[] = []

    let page = 1
    while (true) {
      const data = await xeroFetch(page)
      const invoices = (data?.Invoices || []) as Record<string, unknown>[]
      if (!invoices.length) break

      for (const invoice of invoices) {
        if (invoice.Type === 'ACCREC') {
          records.push(...normaliseXeroInvoice(invoice))
        } else if (invoice.Type === 'ACCPAY') {
          const row = normaliseXeroBill(invoice)
          if (row) billRows.push(row)
        }
      }

      if (invoices.length < 100) break // Xero returns up to 100 per page
      page++
    }

    // ── Bills → cfo_expenses (upsert by source_record_id) ────
    if (billRows.length > 0) {
      const ids = billRows.map(r => r.source_record_id)
      const { data: existing } = await supabase
        .from('cfo_expenses')
        .select('source_record_id')
        .eq('user_id', userId)
        .in('source_record_id', ids)

      const existingIds = new Set((existing || []).map((r: { source_record_id: string }) => r.source_record_id))
      const toInsert = billRows
        .filter(r => !existingIds.has(r.source_record_id))
        .map(r => ({ ...r, user_id: userId }))

      if (toInsert.length > 0) {
        await supabase.from('cfo_expenses').insert(toInsert)
      }
    }

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Xero sync failed' }
  }
}

// ── FreeAgent sync ─────────────────────────────────────────────
// FreeAgent has separate /v2/invoices (receivable) and /v2/bills (payable)
// endpoints, like QuickBooks — a FreeAgent OAuth token is scoped to a single
// company, so unlike Xero/QuickBooks no tenant/realm ID is needed per request.
async function syncFreeAgent(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  if (!access_token) return { records: [], error: 'Missing FreeAgent credentials' }

  const faFetch = async (path: string) => {
    const headers = () => ({ Authorization: `Bearer ${access_token}`, Accept: 'application/json' })
    let res = await fetch(`https://api.freeagent.com/v2${path}`, { headers: headers() })
    if (res.status === 401 && refresh_token) {
      const refreshed = await refreshFreeAgentToken(String(refresh_token))
      if (refreshed) {
        access_token = refreshed.access_token
        refresh_token = refreshed.refresh_token
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ access_token, refresh_token })
        }).eq('id', source.id)
        res = await fetch(`https://api.freeagent.com/v2${path}`, { headers: headers() })
      }
    }
    if (!res.ok) throw new Error(`FreeAgent API error ${res.status}: ${path}`)
    return res.json()
  }

  try {
    const [invoiceData, billData] = await Promise.all([
      faFetch('/invoices?view=all'),
      faFetch('/bills?view=all'),
    ])

    // Only approved/non-draft transactions — matches the Xero precedent.
    const invoices = ((invoiceData?.invoices || []) as Record<string, unknown>[])
      .filter(inv => safeAgentStatus(inv.status) !== 'draft')
    const records = invoices.flatMap(normaliseFreeAgentInvoice)

    const bills = ((billData?.bills || []) as Record<string, unknown>[])
      .filter(bill => safeAgentStatus(bill.status) !== 'draft')
    const billRows: QBExpenseRow[] = bills
      .map(normaliseFreeAgentBill)
      .filter((r): r is QBExpenseRow => r !== null)

    if (billRows.length > 0) {
      const ids = billRows.map(r => r.source_record_id)
      const { data: existing } = await supabase
        .from('cfo_expenses')
        .select('source_record_id')
        .eq('user_id', userId)
        .in('source_record_id', ids)

      const existingIds = new Set((existing || []).map((r: { source_record_id: string }) => r.source_record_id))
      const toInsert = billRows
        .filter(r => !existingIds.has(r.source_record_id))
        .map(r => ({ ...r, user_id: userId }))

      if (toInsert.length > 0) {
        await supabase.from('cfo_expenses').insert(toInsert)
      }
    }

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'FreeAgent sync failed' }
  }
}

function safeAgentStatus(status: unknown): string {
  return String(status || '').toLowerCase()
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

// ── Jumia: mint a fresh access token from the merchant's own refresh token ──
// Access tokens are short-lived (12h); the client_id is per-merchant (each
// seller registers their own Application in their own Vendor Center account),
// so it comes from source.config rather than a shared env var.
async function refreshJumiaToken(clientId: string, refreshToken: string): Promise<{ access_token: string; refresh_token?: string } | null> {
  try {
    const res = await fetch('https://vendor-api.jumia.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return { access_token: data.access_token, refresh_token: data.refresh_token }
  } catch { return null }
}

// ── Jumia sync (Vendor Center GPM/GOP API) ────────────────────
async function syncJumia(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { client_id } = source.config
  const { refresh_token } = source.credentials
  if (!client_id || !refresh_token) return { records: [], error: 'Missing Jumia Client ID or Refresh Token' }

  // Always mint a fresh access token — the stored one (if any) is short-lived
  // and there's no cheap way to check its remaining lifetime up front.
  const fresh = await refreshJumiaToken(String(client_id), String(refresh_token))
  if (!fresh) return { records: [], error: 'Jumia refresh token is invalid or expired — reconnect from Sources' }

  await supabase.from('connected_sources').update({
    credentials: encryptCredentials({ refresh_token: fresh.refresh_token || refresh_token, access_token: fresh.access_token }),
  }).eq('id', source.id)

  const baseUrl = 'https://vendor-api.jumia.com'
  const headers = { Authorization: `Bearer ${fresh.access_token}` }
  const allRecords: UnifiedRecord[] = []

  try {
    // Orders from the last 30 days
    const createdAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const ordersRes = await fetch(`${baseUrl}/orders?createdAfter=${createdAfter}&size=100`, { headers })
    if (!ordersRes.ok) throw new Error(`Jumia orders API error: ${ordersRes.status}`)
    const ordersData = await ordersRes.json()
    const orders = (ordersData?.orders || []) as Record<string, unknown>[]

    // Fetch line items per order (capped, and paced under the 4 req/sec rate limit)
    for (const order of orders.slice(0, 50)) {
      try {
        const itemsRes = await fetch(`${baseUrl}/orders/items?orderId=${order.id}`, { headers })
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json()
          const items = (itemsData?.items || []) as Record<string, unknown>[]
          for (const item of items) allRecords.push(normaliseJumiaOrderItem(order, item))
        }
      } catch { /* skip individual order failures */ }
      await new Promise(r => setTimeout(r, 260))
    }

    // Stock levels
    try {
      const stockRes = await fetch(`${baseUrl}/catalog/stock?size=100`, { headers })
      if (stockRes.ok) {
        const stockData = await stockRes.json()
        const stocks = (stockData?.products || []) as Record<string, unknown>[]
        for (const s of stocks) {
          const sku = String(s.sellerSku || '')
          if (!sku || allRecords.some(r => r.sku === sku)) continue
          allRecords.push(normaliseJumiaStock(s))
        }
      }
    } catch { /* stock fetch is supplemental */ }

    return { records: allRecords }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Jumia sync failed' }
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

// ── Google Ads sync ────────────────────────────────────────────
// Requires a Google-approved Developer Token (GOOGLE_ADS_DEVELOPER_TOKEN) —
// a manual application process separate from OAuth. The connect callback
// only stores a customer_id if that token was present and valid at connect
// time; without one, this returns early rather than call the Ads API blind.
async function syncGoogleAds(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; signals: SocialSignalRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { customer_id } = source.config
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  if (!access_token || !customer_id) return { records: [], signals: [], error: 'Missing Google Ads customer ID — reconnect once GOOGLE_ADS_DEVELOPER_TOKEN is configured' }
  if (!developerToken) return { records: [], signals: [], error: 'GOOGLE_ADS_DEVELOPER_TOKEN is not configured' }

  const query = `
    SELECT campaign.id, campaign.name, segments.date,
           metrics.cost_micros, metrics.impressions, metrics.clicks,
           metrics.conversions, metrics.conversions_value
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
  `.trim()

  const gadsFetch = async () => {
    const headers = () => ({
      Authorization: `Bearer ${access_token}`,
      'developer-token': developerToken,
      'Content-Type': 'application/json',
    })
    let res = await fetch(
      `https://googleads.googleapis.com/v17/customers/${customer_id}/googleAds:search`,
      { method: 'POST', headers: headers(), body: JSON.stringify({ query }) }
    )
    if (res.status === 401 && refresh_token) {
      const newToken = await refreshGoogleToken(String(refresh_token))
      if (newToken) {
        access_token = newToken
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ ...source.credentials, access_token })
        }).eq('id', source.id)
        res = await fetch(
          `https://googleads.googleapis.com/v17/customers/${customer_id}/googleAds:search`,
          { method: 'POST', headers: headers(), body: JSON.stringify({ query }) }
        )
      }
    }
    if (!res.ok) throw new Error(`Google Ads API error ${res.status}`)
    return res.json()
  }

  try {
    const data = await gadsFetch()
    const rows = (data?.results || []) as Record<string, unknown>[]
    const signals = rows.map(row => normaliseGoogleAdsCampaign(row, 'GBP'))
    return { records: [], signals }
  } catch (e: unknown) {
    return { records: [], signals: [], error: e instanceof Error ? e.message : 'Google Ads sync failed' }
  }
}

// ── Google Analytics sync ──────────────────────────────────────
// Writes to ga_sessions directly (not unified_data/social_signals — session
// and channel data doesn't fit either shape).
async function syncGoogleAnalytics(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  let { access_token, refresh_token } = source.credentials
  const { property_id } = source.config
  if (!access_token || !property_id) return { records: [], error: 'Missing GA4 property ID' }

  const body = {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'date' }, { name: 'sessionDefaultChannelGroup' }],
    metrics: [
      { name: 'sessions' }, { name: 'totalUsers' }, { name: 'conversions' },
      { name: 'bounceRate' }, { name: 'averageSessionDuration' }, { name: 'totalRevenue' },
    ],
  }

  const gaFetch = async () => {
    const headers = () => ({ Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' })
    let res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${property_id}:runReport`,
      { method: 'POST', headers: headers(), body: JSON.stringify(body) }
    )
    if (res.status === 401 && refresh_token) {
      const newToken = await refreshGoogleToken(String(refresh_token))
      if (newToken) {
        access_token = newToken
        await supabase.from('connected_sources').update({
          credentials: encryptCredentials({ ...source.credentials, access_token })
        }).eq('id', source.id)
        res = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${property_id}:runReport`,
          { method: 'POST', headers: headers(), body: JSON.stringify(body) }
        )
      }
    }
    if (!res.ok) throw new Error(`Google Analytics API error ${res.status}`)
    return res.json()
  }

  try {
    const data = await gaFetch()
    const rows = (data?.rows || []) as Record<string, unknown>[]
    const gaRows = rows.map(normaliseGoogleAnalyticsRow)

    if (gaRows.length > 0) {
      await supabase.from('ga_sessions').upsert(
        gaRows.map(r => ({ ...r, user_id: userId, source_id: source.id, updated_at: new Date().toISOString() })),
        { onConflict: 'user_id,source_id,record_date,channel' }
      )
    }

    return { records: [] }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Google Analytics sync failed' }
  }
}

// ── GoCardless sync ─────────────────────────────────────────────
// Writes to gocardless_payments directly — payment/mandate data doesn't fit
// unified_data or social_signals. No inline 401-refresh: the current token
// model has no confirmed renewal flow for this OAuth scope (see the callback
// route's comment) — a 401 here surfaces as a sync error rather than retrying.
async function syncGoCardless(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { access_token } = source.credentials
  if (!access_token) return { records: [], error: 'Missing GoCardless credentials' }

  try {
    const records: UnifiedRecord[] = []
    let after: string | undefined
    const paymentRows: ReturnType<typeof normaliseGoCardlessPayment>[] = []

    do {
      const url = new URL('https://api.gocardless.com/payments')
      url.searchParams.set('limit', '100')
      if (after) url.searchParams.set('after', after)

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'GoCardless-Version': '2015-07-06',
        },
      })
      if (!res.ok) throw new Error(`GoCardless API error ${res.status}`)
      const data = await res.json()
      const payments = (data?.payments || []) as Record<string, unknown>[]
      paymentRows.push(...payments.map(normaliseGoCardlessPayment))
      after = data?.meta?.cursors?.after || undefined
    } while (after)

    if (paymentRows.length > 0) {
      await supabase.from('gocardless_payments').upsert(
        paymentRows.map(r => ({ ...r, user_id: userId, source_id: source.id, updated_at: new Date().toISOString() })),
        { onConflict: 'user_id,payment_id' }
      )
    }

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'GoCardless sync failed' }
  }
}

// ── Mailchimp sync ──────────────────────────────────────────────
// Writes to email_campaigns directly. Mailchimp OAuth2 tokens don't expire,
// so no refresh logic is needed here.
async function syncMailchimp(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { access_token } = source.credentials
  const { api_endpoint } = source.config
  if (!access_token || !api_endpoint) return { records: [], error: 'Missing Mailchimp credentials' }

  try {
    const res = await fetch(`${api_endpoint}/3.0/reports?count=100&sort_field=send_time&sort_dir=DESC`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!res.ok) throw new Error(`Mailchimp API error ${res.status}`)
    const { reports } = await res.json()
    const campaignRows = ((reports || []) as Record<string, unknown>[]).map(normaliseMailchimpCampaign)

    if (campaignRows.length > 0) {
      await supabase.from('email_campaigns').upsert(
        campaignRows.map(r => ({ ...r, user_id: userId, source_id: source.id, updated_at: new Date().toISOString() })),
        { onConflict: 'user_id,source_type,campaign_id' }
      )
    }

    return { records: [] }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Mailchimp sync failed' }
  }
}

// ── Klaviyo sync ────────────────────────────────────────────────
// NOTE: the Campaign Values Reporting request shape below (particularly
// resolving a "Placed Order"-style conversion_metric_id, and the exact
// statistics/response field names) could not be verified against
// authenticated Klaviyo API docs during development — treat this as needing
// a live-account check before relying on it, same flag as syncLinnworks().
async function syncKlaviyo(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { api_key } = source.credentials
  if (!api_key) return { records: [], error: 'Missing Klaviyo API key' }

  const headers = {
    Authorization: `Klaviyo-API-Key ${api_key}`,
    revision: '2024-10-15',
    'Content-Type': 'application/json',
  }

  try {
    // Find the "Placed Order" metric to use as the conversion metric.
    const metricsRes = await fetch('https://a.klaviyo.com/api/metrics/?filter=equals(name,"Placed Order")', { headers })
    if (!metricsRes.ok) throw new Error(`Klaviyo metrics API error ${metricsRes.status}`)
    const metricsData = await metricsRes.json()
    const conversionMetricId = metricsData?.data?.[0]?.id

    // List email campaigns from the last 90 days.
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    const campaignsRes = await fetch(
      `https://a.klaviyo.com/api/campaigns/?filter=and(equals(messages.channel,'email'),greater-than(created_at,${since}))`,
      { headers }
    )
    if (!campaignsRes.ok) throw new Error(`Klaviyo campaigns API error ${campaignsRes.status}`)
    const { data: campaigns } = await campaignsRes.json()
    if (!campaigns?.length) return { records: [] }

    const campaignRows: ReturnType<typeof normaliseKlaviyoCampaign>[] = []

    if (conversionMetricId) {
      const reportRes = await fetch('https://a.klaviyo.com/api/campaign-values-reports/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            type: 'campaign-values-report',
            attributes: {
              timeframe: { key: 'last_90_days' },
              conversion_metric_id: conversionMetricId,
              filter: `any(campaign_id,[${campaigns.map((c: Record<string, unknown>) => `"${c.id}"`).join(',')}])`,
              statistics: ['recipients', 'opens_unique', 'clicks_unique', 'unsubscribes', 'conversion_value', 'conversion_value_currency'],
            },
          },
        }),
      })
      if (reportRes.ok) {
        const { data: report } = await reportRes.json()
        const results = (report?.attributes?.results || []) as Record<string, unknown>[]
        for (const result of results) {
          const groupings = (result.groupings as Record<string, unknown>) || {}
          const campaign = campaigns.find((c: Record<string, unknown>) => c.id === groupings.campaign_id)
          if (campaign) campaignRows.push(normaliseKlaviyoCampaign(campaign, (result.statistics as Record<string, unknown>) || {}))
        }
      }
    }

    // Any campaign without a matching report row still gets a zero-stats record
    // rather than being silently dropped.
    const reportedIds = new Set(campaignRows.map(r => r.campaign_id))
    for (const campaign of campaigns as Record<string, unknown>[]) {
      if (!reportedIds.has(String(campaign.id))) campaignRows.push(normaliseKlaviyoCampaign(campaign, {}))
    }

    if (campaignRows.length > 0) {
      await supabase.from('email_campaigns').upsert(
        campaignRows.map(r => ({ ...r, user_id: userId, source_id: source.id, updated_at: new Date().toISOString() })),
        { onConflict: 'user_id,source_type,campaign_id' }
      )
    }

    return { records: [] }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Klaviyo sync failed' }
  }
}

// ── Meta Ads sync ───────────────────────────────────────────────
// No inline refresh here — Meta issues no refresh_token for these tokens;
// the token-refresh cron's special-cased instagram/meta_ads branch keeps
// access_token current via periodic fb_exchange_token re-exchange instead.
async function syncMetaAds(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; signals: SocialSignalRecord[]; error?: string }> {
  const { access_token } = source.credentials
  const { ad_account_id } = source.config
  if (!access_token || !ad_account_id) return { records: [], signals: [], error: 'Missing Meta ad account ID' }

  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const until = new Date().toISOString().slice(0, 10)
    const fields = 'campaign_id,campaign_name,spend,impressions,clicks,actions,action_values'
    const timeRange = encodeURIComponent(JSON.stringify({ since, until }))

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${ad_account_id}/insights?fields=${fields}&time_range=${timeRange}&time_increment=1&level=campaign&access_token=${access_token}`
    )
    if (!res.ok) throw new Error(`Meta Ads API error ${res.status}`)
    const { data } = await res.json()
    const rows = (data || []) as Record<string, unknown>[]
    const signals = rows.map(row => normaliseMetaAdsInsight(row, 'GBP'))
    return { records: [], signals }
  } catch (e: unknown) {
    return { records: [], signals: [], error: e instanceof Error ? e.message : 'Meta Ads sync failed' }
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

// ── Instagram Shopping sync ─────────────────────────────────────
// credentials holds only the Meta access token (issued via OAuth in
// app/api/auth/instagram-shopping) — ig_user_id and commerce_merchant_settings_id
// are discovered at connect time and live in config, matching how the
// connect UI splits fields (password → credentials, everything else → config).
const GRAPH_API_VERSION = 'v19.0'

async function syncInstagram(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; signals: SocialSignalRecord[]; error?: string }> {
  const { access_token } = source.credentials
  const { ig_user_id, commerce_merchant_settings_id } = source.config
  if (!access_token || (!ig_user_id && !commerce_merchant_settings_id)) {
    return { records: [], signals: [], error: 'Missing Instagram access token or account ID — reconnect Instagram Shopping' }
  }

  const token = String(access_token)
  const igId  = ig_user_id ? String(ig_user_id) : ''
  const cmsId = commerce_merchant_settings_id ? String(commerce_merchant_settings_id) : ''

  try {
    // Fetch recent media with insights (requires instagram_basic — best-effort, skipped if unauthorized)
    let posts: Record<string, unknown>[] = []
    if (igId) {
      const mediaRes = await fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${igId}/media?fields=id,media_type,timestamp,like_count,comments_count&limit=50&access_token=${token}`
      )

      if (mediaRes.ok) {
        const data = await mediaRes.json()
        const items = (data?.data || []) as Record<string, unknown>[]

        // Fetch insights for each post (batch up to 20)
        const sample = items.slice(0, 20)
        posts = await Promise.all(sample.map(async post => {
          try {
            const insightRes = await fetch(
              `https://graph.facebook.com/${GRAPH_API_VERSION}/${post.id}/insights?metric=reach,impressions,saved,profile_visits,website_clicks&access_token=${token}`
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
    }

    // Fetch commerce orders via the Commerce Platform Order API (requires
    // commerce_account_read_orders — the shop's Commerce Merchant Settings ID,
    // not the IG user ID or catalog ID, is what scopes order data).
    let orders: Record<string, unknown>[] = []
    if (cmsId) {
      const fields = 'id,created,channel,order_status,items{id,product_id,retailer_id,quantity,price_per_unit,product_name},estimated_payment_details'
      const ordersRes = await fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${cmsId}/commerce_orders?fields=${fields}&access_token=${token}`
      )
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        orders = (data?.data || []) as Record<string, unknown>[]
      } else if (!igId) {
        // No IG media fallback either — surface the failure instead of silently returning nothing.
        const err = await ordersRes.text().catch(() => ordersRes.statusText)
        return { records: [], signals: [], error: `Instagram Shopping orders fetch failed ${ordersRes.status}: ${err.slice(0, 200)}` }
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

// ── Linnworks ─────────────────────────────────────────────────
// The stored credential is Linnworks' permanent access token, not a session
// token — session tokens last only ~20 minutes, far shorter than any sync
// interval, so a fresh one is minted via AuthorizeByApplication on every
// sync rather than cached and refreshed reactively.
async function syncLinnworks(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> }
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { access_token } = source.credentials
  const { server } = source.config
  const appId = process.env.LINNWORKS_APP_ID
  const appSecret = process.env.LINNWORKS_SECRET
  if (!access_token || !server) return { records: [], error: 'Missing Linnworks credentials' }
  if (!appId || !appSecret) return { records: [], error: 'LINNWORKS_APP_ID/LINNWORKS_SECRET not configured' }

  try {
    const sessionRes = await fetch('https://api.linnworks.net/api/Auth/AuthorizeByApplication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ApplicationId: appId, ApplicationSecret: appSecret, Token: access_token }),
    })
    if (!sessionRes.ok) throw new Error(`Linnworks session error ${sessionRes.status}`)
    const { Token: sessionToken } = await sessionRes.json()
    if (!sessionToken) throw new Error('Linnworks did not return a session token')

    const ordersRes = await fetch(`${server}/api/Orders/GetOpenOrders`, {
      method: 'POST',
      headers: {
        Authorization: sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entriesPerPage: 200, pageNumber: 1 }),
    })
    if (!ordersRes.ok) throw new Error(`Linnworks orders error ${ordersRes.status}`)
    const { Data } = await ordersRes.json()
    const orders = (Data || []) as Record<string, unknown>[]
    const records = orders.flatMap(normaliseLinnworksOrder)

    return { records }
  } catch (e: unknown) {
    return { records: [], error: e instanceof Error ? e.message : 'Linnworks sync failed' }
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
    'WM_SEC.ACCESS_TOKEN':   access_token,
    'WM_SVC.NAME':           'Walmart Marketplace',
    'WM_QOS.CORRELATION_ID': `askbiz-sync-${Date.now()}`,
    Accept:                  'application/json',
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

// ── Plan-aware sync interval gating ────────────────────────────
const PLAN_INTERVAL_MINUTES: Record<string, number> = {
  free: 24 * 60,     // 1440 — daily
  growth: 6 * 60,    // 360 — every 6 hours
  business: 60,      // hourly
}

// Connectors whose own data doesn't need to move faster than this, even on Business.
const CONNECTOR_FLOOR_MINUTES: Partial<Record<string, number>> = {
  stripe: 3 * 60,      // 180
  etsy: 8 * 60,        // 480
  instagram: 6 * 60,   // 360
  tiktok_shop: 6 * 60,
  pinterest: 6 * 60,
}

function effectiveIntervalMinutes(sourceType: string, planId: string): number {
  const planInterval = PLAN_INTERVAL_MINUTES[planId] ?? PLAN_INTERVAL_MINUTES.free
  const floor = CONNECTOR_FLOOR_MINUTES[sourceType]
  return floor ? Math.max(planInterval, floor) : planInterval
}

// Batch plan lookup — no FK exists between connected_sources and subscriptions
// (both independently reference auth.users), so this is a manual join.
async function getPlanByUser(
  supabase: ReturnType<typeof createServiceClient>,
  userIds: string[]
): Promise<Map<string, string>> {
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, plan_id, status, trial_ends_at')
    .in('user_id', userIds)

  const now = Date.now()
  return new Map(
    (subs ?? []).map((s: { user_id: string; plan_id: string | null; status: string | null; trial_ends_at: string | null }) => {
      // Growth-trial expiry is otherwise only applied lazily when a user loads /billing —
      // without this check a lapsed trial would keep its faster interval indefinitely.
      const trialExpired = s.status === 'trialing' && !!s.trial_ends_at && new Date(s.trial_ends_at).getTime() < now
      return [s.user_id, trialExpired ? 'free' : (s.plan_id || 'free')] as [string, string]
    })
  )
}

export interface SyncPreviewEntry {
  sourceId: string
  sourceType: string
  userId: string
  planId: string
  effectiveIntervalMinutes: number
  lastSyncedAt: string | null
  dueNow: boolean
}

// Read-only diagnostic: reports what the next cron sweep would or wouldn't sync, and why —
// no sync handler is dispatched and last_synced_at is never written.
export async function previewSync(): Promise<SyncPreviewEntry[]> {
  const supabase = createServiceClient()
  const { data: sources } = await supabase
    .from('connected_sources')
    .select('*')
    .eq('status', 'active')
  if (!sources?.length) return []

  const userIds = [...new Set(sources.map((s: { user_id: string }) => s.user_id))] as string[]
  const planByUser = await getPlanByUser(supabase, userIds)
  const now = Date.now()

  return sources.map((source: { id: string; source_type: string; user_id: string; last_synced_at: string | null }) => {
    const planId = planByUser.get(source.user_id) || 'free'
    const interval = effectiveIntervalMinutes(source.source_type, planId)
    const dueNow = !source.last_synced_at || (now - new Date(source.last_synced_at).getTime() >= interval * 60_000)
    return {
      sourceId: source.id,
      sourceType: source.source_type,
      userId: source.user_id,
      planId,
      effectiveIntervalMinutes: interval,
      lastSyncedAt: source.last_synced_at,
      dueNow,
    }
  })
}

// ── Main sync runner ──────────────────────────────────────────
// `userId` set = manual "Sync Now" — always syncs immediately, bypasses interval gating below.
// `userId` unset = the bulk cron sweep — only sources due per the caller's plan interval are synced.
export async function runSync(userId?: string): Promise<SyncResult[]> {
  const supabase = createServiceClient()
  const results: SyncResult[] = []

  // Get sources to sync
  let query = supabase
    .from('connected_sources')
    .select('*')
    .eq('status', 'active')

  if (userId) query = query.eq('user_id', userId)

  let { data: sources } = await query
  if (!sources?.length) return results

  if (!userId) {
    const userIds = [...new Set(sources.map((s: { user_id: string }) => s.user_id))] as string[]
    const planByUser = await getPlanByUser(supabase, userIds)
    const now = Date.now()

    sources = sources.filter((source: { last_synced_at: string | null; user_id: string; source_type: string }) => {
      if (!source.last_synced_at) return true
      const planId = planByUser.get(source.user_id) || 'free'
      const intervalMs = effectiveIntervalMinutes(source.source_type, planId) * 60_000
      return now - new Date(source.last_synced_at).getTime() >= intervalMs
    })
    if (!sources.length) return results
  }

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
        const r = await syncQuickBooks(decryptedSource, supabase, source.user_id)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'xero') {
        const r = await syncXero(decryptedSource, supabase, source.user_id)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'freeagent') {
        const r = await syncFreeAgent(decryptedSource, supabase, source.user_id)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'google_sheets') {
        const r = await syncGoogleSheetsWithRefresh(decryptedSource, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'google_ads') {
        const r = await syncGoogleAds(decryptedSource, supabase)
        records = r.records; syncError = r.error
        await upsertSocialSignals(supabase, source.user_id, source.id, r.signals)
      } else if (source.source_type === 'google_analytics') {
        const r = await syncGoogleAnalytics(decryptedSource, supabase, source.user_id)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'meta_ads') {
        const r = await syncMetaAds(decryptedSource)
        records = r.records; syncError = r.error
        await upsertSocialSignals(supabase, source.user_id, source.id, r.signals)
      } else if (source.source_type === 'gocardless') {
        const r = await syncGoCardless(decryptedSource, supabase, source.user_id)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'mailchimp') {
        const r = await syncMailchimp(decryptedSource, supabase, source.user_id)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'klaviyo') {
        const r = await syncKlaviyo(decryptedSource, supabase, source.user_id)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'amazon_fba') {
        const r = await syncAmazon(decryptedSource, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'jumia') {
        const r = await syncJumia(decryptedSource, supabase)
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
      } else if (source.source_type === 'linnworks') {
        const r = await syncLinnworks(decryptedSource)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'askbiz_pos') {
        const r = await syncAskBizPOS(supabase, source.user_id)
        records = r.records; syncError = r.error
      }
    } catch (e: unknown) {
      syncError = e instanceof Error ? e.message : 'Unknown sync error'
    }

    const { inserted, updated, failed, error: upsertError } = records.length
      ? await upsertRecords(supabase, source.user_id, source.id, records)
      : { inserted: 0, updated: 0, failed: 0, error: undefined as string | undefined }

    if (failed > 0 && !syncError) {
      syncError = `${failed} of ${records.length} records failed to write to unified_data: ${upsertError}`
    }

    const status = syncError ? (inserted > 0 ? 'partial' : 'error') : 'success'

    // Update source last_synced_at
    await supabase.from('connected_sources').update({
      last_synced_at: new Date().toISOString(),
      status: syncError && inserted === 0 ? 'error' : 'active',
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
