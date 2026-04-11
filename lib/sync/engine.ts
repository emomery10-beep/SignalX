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
      } else if (source.source_type === 'google_sheets') {
        const r = await syncGoogleSheets(source)
        records = r.records; syncError = r.error
      }
      // Square and QuickBooks: similar pattern — add when OAuth is set up
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
