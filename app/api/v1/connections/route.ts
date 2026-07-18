import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { authenticateApiKey, recordRequest, CORS } from '@/lib/api-v1-auth'

export const runtime = 'nodejs'

// Phase 4 (scoped-down) — a developer requests access to a specific
// merchant (by email); the merchant approves via developer.askbiz.co, and
// the resulting connection is what app/api/v1/scan's optional merchant_id
// param checks before scoping data to that merchant. See the migration
// (20260708000007_developer_connections.sql) for why this is deliberately
// narrower than full OAuth app installs.
//
// Phase 2 follow-up (20260717000003_connection_scopes.sql): the connection
// now carries an explicit scope list instead of one binary "active" grant —
// see ALLOWED_SCOPES below. Only read_inventory exists because that's the
// only thing any connection-gated endpoint actually reads today.

const ALLOWED_SCOPES = ['read_inventory'] as const
type Scope = typeof ALLOWED_SCOPES[number]

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  const auth = await authenticateApiKey(request)
  if (!auth.ok) return auth.response
  const { key, supabase } = auth

  let body: { merchant_email?: string; scopes?: Scope[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS })
  }

  const { merchant_email } = body
  if (!merchant_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchant_email)) {
    return NextResponse.json({ error: '"merchant_email" must be a valid email' }, { status: 400, headers: CORS })
  }

  // Defaults to the full set (today, just read_inventory) so existing
  // integrations that don't send "scopes" keep the exact access they had
  // before scopes existed — an explicit request can only ever narrow this,
  // never widen it beyond ALLOWED_SCOPES.
  const requestedScopes = body.scopes !== undefined ? body.scopes : [...ALLOWED_SCOPES]
  if (!Array.isArray(requestedScopes) || requestedScopes.some(s => !ALLOWED_SCOPES.includes(s))) {
    return NextResponse.json({ error: `"scopes" must be an array from: ${ALLOWED_SCOPES.join(', ')}` }, { status: 400, headers: CORS })
  }

  const { data: existingActive } = await supabase
    .from('developer_connections')
    .select('id')
    .eq('key_id', key.id)
    .eq('merchant_email', merchant_email.toLowerCase().trim())
    .eq('status', 'active')
    .maybeSingle()

  if (existingActive) {
    return NextResponse.json({ error: 'Already connected to this merchant', connection_id: existingActive.id }, { status: 409, headers: CORS })
  }

  const confirmationToken = randomBytes(24).toString('hex')
  const { data: connection, error } = await supabase
    .from('developer_connections')
    .insert({
      key_id: key.id,
      // Denormalized from the key at creation time (20260717000005_developer_apps.sql)
      // so the merchant consent screen can show "App XYZ wants ..." without a join,
      // and keeps reflecting the requesting app even if the key later moves.
      app_id: key.app_id,
      merchant_email: merchant_email.toLowerCase().trim(),
      confirmation_token: confirmationToken,
      scopes: requestedScopes,
    })
    .select('id, merchant_email, status, scopes, app_id, created_at, expires_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })

  await recordRequest(supabase, key, '/api/v1/connections', 200, Date.now() - start)

  return NextResponse.json({
    connection,
    confirmation_url: `https://developer.askbiz.co/connect/${confirmationToken}`,
  }, { headers: CORS })
}

export async function GET(request: NextRequest) {
  const auth = await authenticateApiKey(request)
  if (!auth.ok) return auth.response
  const { key, supabase } = auth

  const { data: connections, error } = await supabase
    .from('developer_connections')
    .select('id, merchant_email, merchant_user_id, status, scopes, app_id, created_at, approved_at, revoked_at')
    .eq('key_id', key.id)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  return NextResponse.json({ connections: connections || [] }, { headers: CORS })
}
