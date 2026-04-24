import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// ── Parse Google Sheets CSV export URL ───────────────────────
function toCSVUrl(url: string): string {
  // Handle various Google Sheets URL formats
  const patterns = [
    /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit/,
    /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/pub/,
    /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=0`
    }
  }
  throw new Error('Invalid Google Sheets URL')
}

// ── Parse CSV text into rows ──────────────────────────────────
function parseCSVText(text: string): { headers: string[]; rows: Record<string, unknown>[] } {
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) throw new Error('Sheet appears empty')

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Record<string, unknown> = {}
    headers.forEach((h, i) => {
      const val = values[i] || ''
      row[h] = isNaN(Number(val)) || val === '' ? val : Number(val)
    })
    return row
  })

  return { headers, rows }
}

// ── POST /api/sync/sheets — manual trigger or cron ───────────
export async function POST(request: NextRequest) {
  // Verify cron secret for scheduled calls
  const authHeader = request.headers.get('authorization')
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const supabase = createServiceClient()

  let userId: string | null = null

  if (!isCron) {
    // Manual trigger — verify user session
    const { createClient } = await import('@/lib/supabase/server')
    const userSupabase = createClient()
    const { data: { user } } = await userSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    userId = user.id
  }

  try {
    // Get all active sheet connections
    const query = supabase
      .from('sheet_connections')
      .select('*')
      .eq('is_active', true)

    if (userId) query.eq('user_id', userId)

    const { data: connections, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!connections?.length) return NextResponse.json({ synced: 0, message: 'No active sheet connections' })

    const results = []

    for (const conn of connections) {
      try {
        // Fetch sheet as CSV (works for public sheets or sheets shared with "anyone with link")
        const csvUrl = toCSVUrl(conn.sheet_url)
        const res = await fetch(csvUrl, {
          headers: { 'User-Agent': 'SignalX/1.0' },
        })

        if (!res.ok) {
          throw new Error(`Could not fetch sheet — make sure it is shared with "Anyone with the link"`)
        }

        const csvText = await res.text()
        const { headers, rows } = parseCSVText(csvText)

        // Update or create upload record
        const uploadData = {
          user_id: conn.user_id,
          filename: conn.sheet_name || 'Google Sheet',
          row_count: rows.length,
          column_names: headers,
          parsed_sample: rows.slice(0, 200),
          status: 'parsed',
          source_type: 'google_sheets',
          source_url: conn.sheet_url,
        }

        if (conn.upload_id) {
          // Update existing
          await supabase.from('uploads').update({
            ...uploadData,
            updated_at: new Date().toISOString(),
          }).eq('id', conn.upload_id)
        } else {
          // Create new upload record
          const { data: newUpload } = await supabase
            .from('uploads')
            .insert(uploadData)
            .select()
            .single()

          // Link it back to the connection
          if (newUpload) {
            await supabase.from('sheet_connections')
              .update({ upload_id: newUpload.id, last_synced_at: new Date().toISOString() })
              .eq('id', conn.id)
          }
        }

        // Update last synced
        await supabase.from('sheet_connections').update({
          last_synced_at: new Date().toISOString(),
          last_row_count: rows.length,
          sync_error: null,
        }).eq('id', conn.id)

        // Log audit
        await supabase.from('audit_log').insert({
          user_id: conn.user_id,
          event: 'sheet_synced',
          metadata: { sheet: conn.sheet_name, rows: rows.length },
        })

        results.push({ id: conn.id, name: conn.sheet_name, rows: rows.length, status: 'ok' })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Sync failed'
        await supabase.from('sheet_connections').update({
          sync_error: msg,
          last_synced_at: new Date().toISOString(),
        }).eq('id', conn.id)
        results.push({ id: conn.id, name: conn.sheet_name, status: 'error', error: msg })
      }
    }

    return NextResponse.json({ synced: results.filter(r => r.status === 'ok').length, results })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Sync failed' }, { status: 500 })
  }
}

// ── GET — get sync status for current user ───────────────────
export async function GET() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('sheet_connections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}
