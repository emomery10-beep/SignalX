import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, askOnce } from '@/lib/ai'
import { isExpansionQuestion, buildExpansionContext, buildDataSummary } from '@/lib/ai/expansion'
import { tavilySearch, detectSearchIntent, formatSearchContext } from '@/lib/tavily'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    messages,
    conversationId,
    currency, symbol, bizType, region, sectorHints, trendTopics,
    activeFile, datasetSummary, userName,
    simulateMode, cfoMode,
  } = body

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_type, currency, currency_symbol, region, sector_hints')
    .eq('id', user.id)
    .single()

  const finalCurrency = currency || profile?.currency || 'USD'
  const finalSymbol   = symbol   || profile?.currency_symbol || '$'
  const finalBizType  = bizType  || profile?.business_type || 'retail'
  const finalRegion   = region   || profile?.region || ''
  const finalSector   = sectorHints || profile?.sector_hints || ''

  // Check usage limits
  const period = new Date().toISOString().slice(0, 7)
  const { data: sub } = await supabase.from('subscriptions').select('plan_id, plans(question_limit)').eq('user_id', user.id).single()
  const questionLimit = (sub as { plans?: { question_limit: number } } | null)?.plans?.question_limit ?? 10

  if (questionLimit !== -1) {
    const { data: usage } = await supabase.from('usage').select('questions').eq('user_id', user.id).eq('period', period).single()
    const used = (usage as { questions?: number } | null)?.questions ?? 0
    if (used >= questionLimit) {
      return NextResponse.json({
        error: 'limit_reached',
        message: `You've used all ${questionLimit} questions this month.`,
        upgrade_required: true,
        plan: sub?.plan_id || 'free',
      }, { status: 402 })
    }
  }

  // Detect if this is an expansion question
  const lastUserMessage = [...(messages || [])].reverse().find((m: { role: string }) => m.role === 'user')
  const questionText = lastUserMessage?.content || ''
  const isExpansion = isExpansionQuestion(questionText)

  // Build expansion context if needed
  let expansionContext = ''
  if (isExpansion) {
    // Try to load latest dataset for context
    const { data: latestUpload } = await supabase
      .from('uploads')
      .select('parsed_sample, column_names')
      .eq('user_id', user.id)
      .eq('status', 'parsed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (latestUpload?.parsed_sample) {
      const rows = latestUpload.parsed_sample as Record<string, unknown>[]
      const headers = latestUpload.column_names as string[]
      const summary = buildDataSummary(rows, headers, finalCurrency, finalSymbol)
      expansionContext = buildExpansionContext(summary)
    }
  }

  // ── MARKET INTELLIGENCE ──────────────────────────────────────
  // Detect if question is about pricing, sourcing, suppliers, trends
  let marketContext = ''
  const marketKeywords = /price|cost|supplier|source|aliexpress|ebay|amazon|trend|cheap|expensive|margin|competitor|market|sell for|worth|value/i
  if (marketKeywords.test(questionText) && datasetSummary) {
    try {
      // Extract product names from the dataset summary
      const productMatch = datasetSummary.match(/products?[^.]*?:\s*([^.]+)/i)
      const products = productMatch
        ? productMatch[1].split(',').map((p: string) => p.trim()).slice(0, 3)
        : [questionText.slice(0, 50)]

      const marketRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, country: finalRegion || 'GB' }),
      })

      if (marketRes.ok) {
        const marketData = await marketRes.json()
        if (marketData?.data?.length) {
          const lines: string[] = []
          for (const item of marketData.data) {
            lines.push(`Product: ${item.product}`)
            if (item.aliexpress?.status === 'ok' && item.aliexpress.lowestPrice) {
              lines.push(`  AliExpress lowest supplier price: $${item.aliexpress.lowestPrice.toFixed(2)}`)
            }
            if (item.ebay?.status === 'ok' && item.ebay.avgSoldPrice) {
              lines.push(`  eBay avg sold price: £${item.ebay.avgSoldPrice.toFixed(2)} (${item.ebay.soldCount} recent sales)`)
            }
            if (item.amazon?.status === 'ok' && item.amazon.lowestPrice) {
              lines.push(`  Amazon lowest price: £${item.amazon.lowestPrice.toFixed(2)}`)
            }
          }
          marketContext = lines.join('\n')
        }
      }
    } catch (e) {
      // Non-blocking — market data is enhancement not requirement
    }
  }

  // ── TAVILY WEB SEARCH ─────────────────────────────────────────────────────
  // Fire Tavily when the question has a live-web intent:
  // news, trends, regulations, competitor research, industry updates
  let searchContext = ''
  const tavilyQuery = detectSearchIntent(questionText)
  if (tavilyQuery) {
    try {
      const isNews = /news|latest|recent|update/.test(questionText.toLowerCase())
      const searchResult = await tavilySearch(tavilyQuery, {
        searchDepth: 'basic',
        maxResults: 4,
        includeAnswer: true,
        topic: isNews ? 'news' : 'general',
        days: isNews ? 7 : undefined,
      })
      if (searchResult) {
        searchContext = formatSearchContext(searchResult, 3)
      }
    } catch (e) {
      // Non-blocking — Tavily is enhancement not requirement
    }
  }

  const systemPrompt = buildSystemPrompt({
    currency: finalCurrency,
    symbol: finalSymbol,
    bizType: finalBizType,
    region: finalRegion,
    sectorHints: finalSector,
    trendTopics: trendTopics || [],
    activeFile,
    datasetSummary,
    expansionContext: expansionContext || undefined,
    userName: userName || user.email?.split('@')[0] || 'there',
    marketContext: marketContext || undefined,
    searchContext: searchContext || undefined,
    simulateMode: !!simulateMode,
    cfoMode: !!cfoMode,
  })

  // Save user message
  if (conversationId && messages?.length) {
    const lastMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    if (lastMsg) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: lastMsg.content,
      })
    }
  }

  // Audit log
  await supabase.from('audit_log').insert({
    user_id: user.id,
    event: 'ai_query',
    metadata: {
      conversation_id: conversationId,
      file: activeFile || null,
      expansion_mode: isExpansion,
    },
  })

  // Get AI response
  const result = await askOnce({ messages, systemPrompt })

  // Save assistant response
  if (conversationId) {
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: result.answer_text,
      result_json: result as unknown as Record<string, unknown>,
    })
  }

  // Increment usage
  await supabase.rpc('increment_usage', { p_user_id: user.id, p_field: 'questions' })

  return NextResponse.json(result)
}
