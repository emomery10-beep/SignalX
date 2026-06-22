import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { askOnce, buildSystemPrompt } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 30

// ── Plan limits ───────────────────────────────────────────────────────────────
const PLAN_LIMITS: Record<string, { month: number; minute: number }> = {
  free:       { month: 100,   minute: 5  },
  starter:    { month: 2000,  minute: 20 },
  growth:     { month: 10000, minute: 60 },
  enterprise: { month: -1,    minute: 120 }, // -1 = unlimited
}

// ── Rate limit store (in-memory per-minute, resets automatically) ─────────────
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

// ── CORS headers for public API ───────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

// ── POST /api/v1/ask ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const start = Date.now()
  // Service client: callers authenticate with an API key (no session), so RLS
  // can't scope by auth.uid(). The route validates the key and scopes every
  // query manually by the key's user_id.
  const supabase = createServiceClient()

  // 1. Extract API key
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing x-api-key header', docs: 'https://askbiz.co/developers' },
      { status: 401, headers: CORS }
    )
  }

  // 2. Validate key
  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('id, user_id, mode, plan, is_active, requests_month, request_limit_month, request_limit_minute')
    .eq('key', apiKey)
    .single()

  if (keyError || !keyData) {
    return NextResponse.json(
      { error: 'Invalid API key', docs: 'https://askbiz.co/developers' },
      { status: 401, headers: CORS }
    )
  }

  if (!keyData.is_active) {
    return NextResponse.json(
      { error: 'API key is disabled — go to askbiz.co/settings to re-enable it' },
      { status: 403, headers: CORS }
    )
  }

  // 3. Monthly limit check
  const planLimits = PLAN_LIMITS[keyData.plan] || PLAN_LIMITS.free
  if (planLimits.month !== -1 && keyData.requests_month >= keyData.request_limit_month) {
    return NextResponse.json(
      {
        error: 'Monthly request limit reached',
        plan: keyData.plan,
        limit: keyData.request_limit_month,
        used: keyData.requests_month,
        resets: 'First of next month',
        upgrade: 'https://askbiz.co/developers#pricing',
      },
      { status: 429, headers: CORS }
    )
  }

  // 4. Per-minute rate limit
  if (!checkMinuteLimit(keyData.id, keyData.request_limit_minute)) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded — too many requests per minute',
        limit: keyData.request_limit_minute,
        retry_after: '60 seconds',
      },
      { status: 429, headers: CORS }
    )
  }

  // 5. Parse request body
  let body: {
    question: string
    context?: {
      currency?: string
      symbol?: string
      biz_type?: string
      region?: string
      revenue?: number
      margin?: number
      top_products?: string[]
      sector?: string
      [key: string]: unknown
    }
    options?: {
      cfo_mode?: boolean
      simulate_mode?: boolean
    }
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400, headers: CORS }
    )
  }

  if (!body.question || typeof body.question !== 'string') {
    return NextResponse.json(
      { error: '"question" field is required and must be a string' },
      { status: 400, headers: CORS }
    )
  }

  if (body.question.length > 2000) {
    return NextResponse.json(
      { error: '"question" must be under 2000 characters' },
      { status: 400, headers: CORS }
    )
  }

  // 6. Build context
  // Mode A: account — pull user's connected data from Supabase
  // Mode B: generic — use context from request body
  let datasetSummary = ''
  let currency = 'GBP'
  let symbol = '£'
  let bizType = 'retail'
  let region = ''
  let sectorHints = ''

  if (keyData.mode === 'account') {
    // Pull from the user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_type, currency, currency_symbol, region, sector_hints')
      .eq('id', keyData.user_id)
      .single()

    if (profile) {
      currency    = profile.currency || 'GBP'
      symbol      = profile.currency_symbol || '£'
      bizType     = profile.business_type || 'retail'
      region      = profile.region || ''
      sectorHints = profile.sector_hints || ''
    }

    // Pull latest dataset summary from uploads
    const { data: upload } = await supabase
      .from('uploads')
      .select('column_names, parsed_sample')
      .eq('user_id', keyData.user_id)
      .eq('status', 'parsed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (upload?.column_names) {
      datasetSummary = `Columns available: ${(upload.column_names as string[]).join(', ')}`
    }
  } else {
    // Mode B: use context from request body
    const ctx = body.context || {}
    currency    = ctx.currency    || 'GBP'
    symbol      = ctx.symbol      || '£'
    bizType     = ctx.biz_type    || 'retail'
    region      = ctx.region      || ''
    sectorHints = ctx.sector      || ''

    // Build a dataset summary from the context object
    const ctxLines: string[] = []
    if (ctx.revenue)       ctxLines.push(`Revenue: ${symbol}${ctx.revenue}`)
    if (ctx.margin)        ctxLines.push(`Margin: ${ctx.margin}%`)
    if (ctx.top_products)  ctxLines.push(`Top products: ${ctx.top_products.join(', ')}`)

    // Include any other custom fields
    const reserved = ['currency', 'symbol', 'biz_type', 'region', 'sector', 'revenue', 'margin', 'top_products']
    Object.entries(ctx).forEach(([k, v]) => {
      if (!reserved.includes(k) && v !== undefined) {
        ctxLines.push(`${k}: ${v}`)
      }
    })
    datasetSummary = ctxLines.join(' · ')
  }

  // 7. Build system prompt and get AI response
  const systemPrompt = buildSystemPrompt({
    currency,
    symbol,
    bizType,
    region,
    sectorHints,
    datasetSummary: datasetSummary || undefined,
    simulateMode: body.options?.simulate_mode || false,
    cfoMode:      body.options?.cfo_mode || false,
  })

  let result
  try {
    result = await askOnce({
      messages: [{ role: 'user', content: body.question }],
      systemPrompt,
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'AI request failed — please try again' },
      { status: 500, headers: CORS }
    )
  }

  const latency = Date.now() - start

  // 8. Increment usage counters
  await supabase
    .from('api_keys')
    .update({
      requests_month: keyData.requests_month + 1,
      last_used_at: new Date().toISOString(),
    })
    .eq('id', keyData.id)

  // 9. Log usage
  await supabase.from('api_usage').insert({
    key_id:     keyData.id,
    user_id:    keyData.user_id,
    endpoint:   '/api/v1/ask',
    question:   body.question.slice(0, 200),
    status:     200,
    latency_ms: latency,
  })

  // 10. Return clean response
  return NextResponse.json(
    {
      answer:           result.answer_text,
      insight_header:   result.insight_header || null,
      verdict:          result.verdict || null,
      verdict_sentence: result.verdict_sentence || null,
      confidence:       result.confidence,
      kpi_cards:        result.kpi_cards || [],
      chart: result.chart_type !== 'none' ? {
        type:   result.chart_type,
        labels: result.chart_labels,
        values: result.chart_values,
        label:  result.chart_label,
      } : null,
      table: result.table_headers?.length ? {
        headers: result.table_headers,
        rows:    result.table_rows,
      } : null,
      recommendations:     result.recommendations || [],
      follow_up_questions: result.follow_up_suggestions || [],
      meta: {
        model:      'askbiz-v1',
        latency_ms: latency,
        requests_remaining: planLimits.month === -1
          ? 'unlimited'
          : keyData.request_limit_month - keyData.requests_month - 1,
      },
    },
    { status: 200, headers: CORS }
  )
}
