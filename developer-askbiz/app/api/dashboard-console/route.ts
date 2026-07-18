import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CORE_ENDPOINTS } from '@/lib/endpoints'

export const runtime = 'nodejs'

const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://askbiz.co'

// Session-authenticated so the console isn't an open proxy to askbiz.co for
// anyone who finds the URL — but the x-api-key itself is supplied by the
// caller, pasted into the console UI, not looked up server-side. Every key
// and webhook secret in this product is shown exactly once at creation and
// never re-displayed (see app/api/v1/keys, app/api/v1/webhooks) — this route
// deliberately does not add a way to retrieve a saved key's raw value, which
// would be a real security-policy change, not an implementation detail.
//
// path is validated against the known CORE_ENDPOINTS allowlist (not
// forwarded as an arbitrary string) so this can't be turned into a generic
// SSRF proxy to unrelated askbiz.co routes.
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { apiKey?: string; path?: string; method?: string; requestBody?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { apiKey, path, method, requestBody } = body
  if (!apiKey) return NextResponse.json({ error: '"apiKey" is required' }, { status: 400 })

  const endpoint = CORE_ENDPOINTS.find(e => e.path === path && e.authType === 'api_key')
  if (!endpoint) return NextResponse.json({ error: 'Unknown or non-api_key endpoint' }, { status: 400 })
  if (method && method !== 'POST' && method !== 'GET') {
    return NextResponse.json({ error: 'Only GET/POST are supported by the console' }, { status: 400 })
  }

  let parsedBody: unknown
  if (requestBody) {
    try {
      parsedBody = JSON.parse(requestBody)
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
    }
  }

  const start = Date.now()
  let upstream: Response
  try {
    upstream = await fetch(`${MAIN_APP_URL}${path}`, {
      method: endpoint.method === 'GET' ? 'GET' : 'POST',
      headers: { 'x-api-key': apiKey, ...(parsedBody ? { 'Content-Type': 'application/json' } : {}) },
      body: parsedBody ? JSON.stringify(parsedBody) : undefined,
    })
  } catch {
    return NextResponse.json({ error: 'Could not reach the API — network error' }, { status: 502 })
  }
  const latencyMs = Date.now() - start

  const text = await upstream.text()
  let responseBody: unknown = text
  try { responseBody = JSON.parse(text) } catch { /* non-JSON response, return as text */ }

  return NextResponse.json({
    status: upstream.status,
    latency_ms: latencyMs,
    rate_limit_remaining: upstream.headers.get('x-ratelimit-remaining'),
    response: responseBody,
  })
}
