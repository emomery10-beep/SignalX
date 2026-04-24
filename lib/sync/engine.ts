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

// ── Shopify sync ──────────────────────────────────────────────
async function syncShopify(
  source: { id: string; config: Record<string, unknown>; credentials: Record<string, unknown> },
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<{ records: UnifiedRecord[]; error?: string }> {
  const { shop_domain } = source.config
  const { access_token } = source.credentials

  if (!shop_domain || !access_token) return { records: [], error: 'Missing shop domain or access token' }

  try {
    // Fetch last 250 orders
    const res = await fetch(
      `https://${shop_domain}/admin/api/2024-01/orders.json?status=any&limit=250`,
      { headers: { 'X-Shopify-Access-Token': String(access_token) } }
    )
    if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
    const { orders } = await res.json()
    const records = (orders as Record<string, unknown>[]).flatMap(normaliseShopify)
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
        // Update stored tokens
        await supabase.from('connected_sources').update({
          credentials: { access_token, refresh_token }
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
          credentials: { ...source.credentials, access_token }
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
          credentials: { ...source.credentials, access_token }
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

    // Route to correct sync handler
    try {
      if (source.source_type === 'shopify') {
        const r = await syncShopify(source, source.user_id, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'stripe') {
        const r = await syncStripe(source)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'square') {
        const r = await syncSquare(source)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'quickbooks') {
        const r = await syncQuickBooks(source, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'google_sheets') {
        const r = await syncGoogleSheetsWithRefresh(source, supabase)
        records = r.records; syncError = r.error
      } else if (source.source_type === 'amazon_fba') {
        const r = await syncAmazon(source, supabase)
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
