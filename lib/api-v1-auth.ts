import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Shared API-key validation + rate limiting for /api/v1/* routes. Extracted
// from app/api/v1/ask/route.ts (the first v1 endpoint) so /api/v1/scan and
// /api/v1/whatsapp/send don't each reimplement the same key lookup,
// is_active check, and per-minute limiter with their own subtly different bugs.

const PLAN_LIMITS: Record<string, { month: number; minute: number }> = {
  free:     { month: 100,   minute: 5   },
  growth:   { month: 10000, minute: 60  },
  business: { month: -1,    minute: 120 },
}

const minuteStore = new Map<string, { count: number; reset: number }>()

function checkMinuteLimit(keyId: string, limit: number): boolean {
  const now = Date.now()
  const entry = minuteStore.get(keyId)
  if (!entry || now > entry.reset) {
    minuteStore.set(keyId, { count: 1, reset: now + 60_000 })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
}

export type ApiKeyRow = {
  id: string
  user_id: string
  mode: 'generic' | 'account'
  plan: string
  is_active: boolean
  requests_month: number
  request_limit_month: number
  request_limit_minute: number
  credit_balance_cents: number
}

type AuthResult =
  | { ok: true; key: ApiKeyRow; supabase: ReturnType<typeof createServiceClient> }
  | { ok: false; response: NextResponse }

/** Validates x-api-key, active status, monthly quota, and per-minute rate limit. */
export async function authenticateApiKey(request: Request): Promise<AuthResult> {
  const supabase = createServiceClient()
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return { ok: false, response: NextResponse.json(
      { error: 'Missing x-api-key header', docs: 'https://developers.askbiz.co' },
      { status: 401, headers: CORS }
    ) }
  }

  const { data: key, error } = await supabase
    .from('api_keys')
    .select('id, user_id, mode, plan, is_active, requests_month, request_limit_month, request_limit_minute, credit_balance_cents')
    .eq('key', apiKey)
    .single()

  if (error || !key) {
    return { ok: false, response: NextResponse.json(
      { error: 'Invalid API key', docs: 'https://developers.askbiz.co' },
      { status: 401, headers: CORS }
    ) }
  }

  if (!key.is_active) {
    return { ok: false, response: NextResponse.json(
      { error: 'API key is disabled — go to askbiz.co/settings to re-enable it' },
      { status: 403, headers: CORS }
    ) }
  }

  const planLimits = PLAN_LIMITS[key.plan] || PLAN_LIMITS.free
  if (planLimits.month !== -1 && key.requests_month >= key.request_limit_month) {
    return { ok: false, response: NextResponse.json(
      { error: 'Monthly request limit reached', plan: key.plan, limit: key.request_limit_month, used: key.requests_month },
      { status: 429, headers: CORS }
    ) }
  }

  if (!checkMinuteLimit(key.id, key.request_limit_minute)) {
    return { ok: false, response: NextResponse.json(
      { error: 'Rate limit exceeded — too many requests per minute', limit: key.request_limit_minute, retry_after: '60 seconds' },
      { status: 429, headers: CORS }
    ) }
  }

  return { ok: true, key: key as ApiKeyRow, supabase }
}

export async function recordRequest(supabase: ReturnType<typeof createServiceClient>, key: ApiKeyRow, endpoint: string, status: number, latencyMs: number) {
  await supabase.from('api_keys').update({
    requests_month: key.requests_month + 1,
    last_used_at: new Date().toISOString(),
  }).eq('id', key.id)

  await supabase.from('api_usage').insert({
    key_id: key.id, user_id: key.user_id, endpoint, status, latency_ms: latencyMs,
  })
}

/**
 * Debits the wallet atomically via the debit_api_credits DB function — never
 * call this before the billable work succeeds (debit-on-success, see the
 * Phase 0 wallet design notes in the migration). Returns null if the key had
 * insufficient balance, which the caller should turn into a 402.
 */
export async function debitCredits(
  supabase: ReturnType<typeof createServiceClient>,
  keyId: string,
  amountCents: number,
  endpoint: string,
  requestId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('debit_api_credits', {
    p_key_id: keyId,
    p_amount_cents: amountCents,
    p_endpoint: endpoint,
    p_request_id: requestId,
  })
  if (error) {
    console.error('[api-v1-auth] debit_api_credits failed:', error.message)
    return false
  }
  return Boolean(data?.id)
}

export function insufficientCreditsResponse(requiredCents: number) {
  return NextResponse.json(
    {
      error: 'Insufficient API credits',
      required_cents: requiredCents,
      topup: 'https://developers.askbiz.co/dashboard',
    },
    { status: 402, headers: CORS }
  )
}
