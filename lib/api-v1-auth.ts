import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { API_PLAN_LIMITS, isApiPlan } from '@/lib/api-plan-limits'

// Shared API-key validation + rate limiting for /api/v1/* routes. Extracted
// from app/api/v1/ask/route.ts (the first v1 endpoint) so /api/v1/scan and
// /api/v1/whatsapp/send don't each reimplement the same key lookup,
// is_active check, and per-minute limiter with their own subtly different bugs.

// Re-exported under this file's original name — app/api/v1/pricing/route.ts
// and others already import PLAN_LIMITS from here. lib/api-plan-limits.ts is
// the actual source of truth (also read by the stripe-billing webhook's
// resync-on-plan-change fix); keeping both names avoids a wider rename.
export const PLAN_LIMITS = API_PLAN_LIMITS

/**
 * DB-backed, atomic per-minute limiter (check_and_increment_rate_limit,
 * 20260717000004_durable_rate_limit.sql) — NOT an in-process Map. A Map
 * resets per serverless instance, so on Vercel's multi-instance deployment
 * the advertised per-plan limit wasn't actually being enforced under real
 * concurrent traffic. Exported so app/api/v1/ask/route.ts (which predates
 * this shared module and had its own duplicate in-memory limiter) can use
 * the same durable counter instead of its own copy.
 */
export async function checkRateLimit(
  supabase: ReturnType<typeof createServiceClient>,
  keyId: string,
  limit: number
): Promise<{ allowed: boolean; remaining: number }> {
  const { data, error } = await supabase.rpc('check_and_increment_rate_limit', { p_key_id: keyId, p_limit: limit })
  if (error) {
    console.error('[api-v1-auth] check_and_increment_rate_limit failed:', error.message)
    return { allowed: true, remaining: limit } // fail open — a DB hiccup shouldn't 429 every caller
  }
  const row = Array.isArray(data) ? data[0] : data
  return { allowed: Boolean(row?.allowed), remaining: Number(row?.remaining ?? 0) }
}

/** X-RateLimit-* headers, matching the convention developers already know
 * from GitHub/Twilio/Stripe — lets a client build proactive backoff instead
 * of discovering the limit only after a 429. */
export function rateLimitHeaders(limit: number, remaining: number) {
  return { 'X-RateLimit-Limit': String(limit), 'X-RateLimit-Remaining': String(Math.max(0, remaining)) }
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
  app_id: string | null
}

type AuthResult =
  | { ok: true; key: ApiKeyRow; supabase: ReturnType<typeof createServiceClient>; rateLimitHeaders: Record<string, string> }
  | { ok: false; response: NextResponse }

/** Validates x-api-key, active status, monthly quota, and per-minute rate limit. */
export async function authenticateApiKey(request: Request): Promise<AuthResult> {
  const supabase = createServiceClient()
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return { ok: false, response: NextResponse.json(
      { error: 'Missing x-api-key header', docs: 'https://developer.askbiz.co/docs' },
      { status: 401, headers: CORS }
    ) }
  }

  const { data: key, error } = await supabase
    .from('api_keys')
    .select('id, user_id, mode, plan, is_active, requests_month, request_limit_month, request_limit_minute, credit_balance_cents, app_id')
    .eq('key', apiKey)
    .single()

  if (error || !key) {
    return { ok: false, response: NextResponse.json(
      { error: 'Invalid API key', docs: 'https://developer.askbiz.co/docs' },
      { status: 401, headers: CORS }
    ) }
  }

  if (!key.is_active) {
    return { ok: false, response: NextResponse.json(
      { error: 'API key is disabled — go to askbiz.co/settings to re-enable it' },
      { status: 403, headers: CORS }
    ) }
  }

  const planLimits = isApiPlan(key.plan) ? PLAN_LIMITS[key.plan] : PLAN_LIMITS.free
  if (planLimits.month !== -1 && key.requests_month >= key.request_limit_month) {
    return { ok: false, response: NextResponse.json(
      { error: 'Monthly request limit reached', plan: key.plan, limit: key.request_limit_month, used: key.requests_month },
      { status: 429, headers: CORS }
    ) }
  }

  const minuteCheck = await checkRateLimit(supabase, key.id, key.request_limit_minute)
  if (!minuteCheck.allowed) {
    return { ok: false, response: NextResponse.json(
      { error: 'Rate limit exceeded — too many requests per minute', limit: key.request_limit_minute, retry_after: '60 seconds' },
      { status: 429, headers: { ...CORS, ...rateLimitHeaders(key.request_limit_minute, 0) } }
    ) }
  }

  return { ok: true, key: key as ApiKeyRow, supabase, rateLimitHeaders: rateLimitHeaders(key.request_limit_minute, minuteCheck.remaining) }
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
 * Looks up a prior debit by (key_id, idempotency_key) BEFORE any billable
 * work runs — this is the check that actually prevents a duplicate
 * Groq/WhatsApp call on retry, not debitCredits' own idempotency_key column
 * (which only stops a *second debit*, too late if the side effect already
 * ran twice). Returns the stored response snapshot to replay verbatim, or
 * null if this is a fresh request.
 */
export async function checkIdempotency(
  supabase: ReturnType<typeof createServiceClient>,
  keyId: string,
  idempotencyKey: string
): Promise<{ status: number; body: unknown } | null> {
  const { data } = await supabase
    .from('api_credit_transactions')
    .select('response_snapshot')
    .eq('key_id', keyId)
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle()
  return (data?.response_snapshot as { status: number; body: unknown } | undefined) || null
}

/**
 * Debits the wallet atomically via the debit_api_credits DB function — never
 * call this before the billable work succeeds (debit-on-success, see the
 * Phase 0 wallet design notes in the migration). Returns null if the key had
 * insufficient balance, which the caller should turn into a 402. On success,
 * returns the post-debit key row (credit_balance_cents, low_balance_threshold_cents)
 * so callers can raise a low-balance warning without a second query.
 */
export async function debitCredits(
  supabase: ReturnType<typeof createServiceClient>,
  keyId: string,
  amountCents: number,
  endpoint: string,
  requestId: string,
  idempotencyKey?: string,
  responseSnapshot?: { status: number; body: unknown },
  force?: boolean
): Promise<{ credit_balance_cents: number; low_balance_threshold_cents: number } | null> {
  const { data, error } = await supabase.rpc('debit_api_credits', {
    p_key_id: keyId,
    p_amount_cents: amountCents,
    p_endpoint: endpoint,
    p_request_id: requestId,
    p_idempotency_key: idempotencyKey ?? null,
    p_response_snapshot: responseSnapshot ?? null,
    p_force: force ?? false,
  })
  if (error) {
    console.error('[api-v1-auth] debit_api_credits failed:', error.message)
    return null
  }
  return data?.id ? { credit_balance_cents: data.credit_balance_cents, low_balance_threshold_cents: data.low_balance_threshold_cents } : null
}

export function insufficientCreditsResponse(requiredCents: number) {
  return NextResponse.json(
    {
      error: 'Insufficient API credits',
      required_cents: requiredCents,
      topup: 'https://developer.askbiz.co/dashboard',
    },
    { status: 402, headers: CORS }
  )
}
