import { NextRequest, NextResponse } from 'next/server'
import { askOnce, buildSystemPrompt } from '@/lib/ai'
import { authenticateApiKey, CORS } from '@/lib/api-v1-auth'
import { API_PLAN_LIMITS as PLAN_LIMITS, isApiPlan } from '@/lib/api-plan-limits'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

// ── POST /api/v1/ask ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const start = Date.now()

  // Auth, is_active, monthly quota, per-minute rate limit — shared with
  // scan/whatsapp/send/charges/connections (lib/api-v1-auth.ts). This route
  // used to hand-roll its own copy of this exact logic (it predates the
  // extraction — the comment in api-v1-auth.ts says as much) which meant
  // any change made there, including the key_env sandbox-mode field this
  // route now needs, silently never applied here. No behavior change
  // intended from this migration beyond that.
  const auth = await authenticateApiKey(request)
  if (!auth.ok) return auth.response
  const { key: keyData, supabase, rateLimitHeaders: headers } = auth

  // Unlike scan/whatsapp/send/charges, /ask has no test-mode branch: it's
  // quota-limited only (never wallet-billed, never calls Meta or Stripe),
  // and account-mode /ask only ever reads the key owner's own data — no
  // real-money or cross-tenant risk to guard against. A canned test
  // response would just make the sandbox answer real business questions
  // with fiction, which is worse than answering for real in both modes.
  const planLimits = isApiPlan(keyData.plan) ? PLAN_LIMITS[keyData.plan] : PLAN_LIMITS.free

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
      { status: 400, headers }
    )
  }

  if (!body.question || typeof body.question !== 'string') {
    return NextResponse.json(
      { error: '"question" field is required and must be a string' },
      { status: 400, headers }
    )
  }

  if (body.question.length > 2000) {
    return NextResponse.json(
      { error: '"question" must be under 2000 characters' },
      { status: 400, headers }
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
      { status: 500, headers }
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
    { status: 200, headers }
  )
}
