import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, askOnce } from '@/lib/ai'
import { loadMemoryContext, extractAndSaveMemory } from '@/lib/ai/memory'
import { isExpansionQuestion, buildExpansionContext, buildDataSummary } from '@/lib/ai/expansion'
import { tavilySearch, detectSearchIntent, formatSearchContext } from '@/lib/tavily'
import { createClient } from '@/lib/supabase/server'
import { detectChurnIntent, buildChurnAIResult } from '@/lib/ai/churn'
import { detectCostIntent, buildCostContext, fetchCostProfile } from '@/lib/ai/cost-context'
import { detectExportIntent, buildExportMarketsResult } from '@/lib/ai/export-markets'
import { detectSocialIntent, buildSocialResult } from '@/lib/ai/social-intelligence'

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

  // ── CHURN INTENT
  const isChurnQuestion = detectChurnIntent(questionText)
  if (isChurnQuestion) {
    try {
      const scanRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'}/api/churn-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': request.headers.get('cookie') || '' },
        body: JSON.stringify({ source: 'chat' }),
      })
      const scanData = await scanRes.json()
      if (scanData.success && scanData.summary) {
        const result = buildChurnAIResult(scanData, finalSymbol)
        if (conversationId) {
          await supabase.from('messages').insert([
            { conversation_id: conversationId, role: 'user', content: questionText },
            { conversation_id: conversationId, role: 'assistant', content: result.answer_text, metadata: result },
          ])
        }
        await supabase.rpc('increment_usage', { p_user_id: user.id })
        return NextResponse.json(result)
      }
    } catch {}
  }
  // ── MARKET INTELLIGENCE ──────────────────────────────────────
  let marketContext = ''
  const marketKeywords = /price|cost|supplier|source|aliexpress|ebay|amazon|trend|cheap|expensive|margin|competitor|market|sell for|worth|value/i
  if (marketKeywords.test(questionText)) {
    try {
      const questionProductMatch = questionText.match(/(?:price|cost|sell|source|buy|find)\s+(?:of\s+|for\s+)?([\w\s]{3,40}?)(?:\s+on|\s+from|\s+at|\?|$)/i)
      const datasetProductMatch = datasetSummary?.match(/products?[^.]*?:\s*([^.]+)/i)
      const products = questionProductMatch
        ? [questionProductMatch[1].trim()]
        : datasetProductMatch
        ? datasetProductMatch[1].split(',').map((p: string) => p.trim()).slice(0, 3)
        : [questionText.replace(/[^a-zA-Z0-9\s]/g, '').trim().slice(0, 50)]

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
      // Non-blocking
    }
  }

  const userPlan = sub?.plan_id || 'free'
  const isGrowthPlus = ['growth', 'business', 'enterprise'].includes(userPlan)
  const isBusinessPlus = ['business', 'enterprise'].includes(userPlan)

  // -- 17TRACK SHIPMENT LOOKUP --
  let trackingContext = ""
  const trackingNumberMatch = questionText.match(/\b([A-Z]{2}\d{9}[A-Z]{2}|\d{12,22}|1Z[A-Z0-9]{16}|[A-Z]{3}\d{10}|JD\d{18})\b/i)
  const trackingIntent = /where is|track|shipment|parcel|package|delivery|arrived|shipping status|in transit|customs/i.test(questionText)
  if (trackingNumberMatch || (trackingIntent && questionText.length < 120)) {
    try {
      const trackingNum = trackingNumberMatch?.[1]
      if (trackingNum) {
        const { data: shipment } = await supabase.from("shipments").select("*").eq("user_id", user.id).eq("tracking_number", trackingNum.toUpperCase()).single()
        if (shipment) {
          trackingContext = [
            "SHIPMENT DATA for " + shipment.tracking_number + ":",
            "Status: " + shipment.track_status,
            shipment.last_event ? "Last event: " + shipment.last_event : "",
            shipment.last_location ? "Location: " + shipment.last_location : "",
            shipment.supplier_name ? "Supplier: " + shipment.supplier_name : "",
            shipment.sku ? "Product: " + shipment.sku + " x" + (shipment.quantity || 1) : "",
            shipment.expected_arrival ? "Expected arrival: " + shipment.expected_arrival : "",
            shipment.delay_days > 0 ? "DELAYED by " + shipment.delay_days + " days" : "",
            shipment.customs_hold ? "CUSTOMS HOLD ACTIVE" : "",
            isGrowthPlus && shipment.total_value ? "Shipment value: " + finalSymbol + shipment.total_value : "",
            isBusinessPlus && shipment.financial_impact > 0 ? "Financial impact: " + finalSymbol + shipment.financial_impact : "",
          ].filter(Boolean).join("\n")
        }
      } else if (trackingIntent) {
        const { data: shipments } = await supabase.from("shipments").select("tracking_number, track_status, sku, supplier_name, delay_days, customs_hold, financial_impact, expected_arrival, is_at_risk").eq("user_id", user.id).not("track_status", "in", "(\"Delivered\",\"Undelivered\",\"Expired\")").order("is_at_risk", { ascending: false }).limit(10)
        if (shipments?.length) {
          trackingContext = "ACTIVE SHIPMENTS:\n" + shipments.map((s: any) =>
            "- " + s.tracking_number + ": " + s.track_status + (s.delay_days > 0 ? " (" + s.delay_days + "d delayed)" : "") + (s.customs_hold ? " [CUSTOMS HOLD]" : "") + (s.sku ? " | " + s.sku : "") + (s.financial_impact > 0 ? " | Impact: " + finalSymbol + s.financial_impact : "")
          ).join("\n")
        }
      }
    } catch (e) {}
  }

  // -- FREIGHT RATE INTELLIGENCE --
  let freightContext = ""
  const freightIntent = /freight|shipping rate|shipping cost|forwarder|overcharg|how much to ship|cheapest.*ship|ship.*cheap|container|ocean freight|air freight|cbm|fob|cif|landed cost/i.test(questionText)
  if (freightIntent) {
    try {
      const { data: recentQuotes } = await supabase.from("freight_quotes").select("origin_port, destination_port, cheapest_rate, market_avg_rate, user_paid_rate, overpaying_amount, shipment_mode, quoted_at").eq("user_id", user.id).order("quoted_at", { ascending: false }).limit(5)
      const { data: inboundShipments } = await supabase.from("shipments").select("supplier_name, total_value, daily_financing_cost").eq("user_id", user.id).eq("shipment_type", "inbound").limit(5)
      const parts: string[] = []

      if (!isGrowthPlus) {
        freightContext = "User asking about freight rates. They are on the free plan. Give general freight rate advice and tips for negotiating with forwarders. Mention that upgrading to Growth or Business unlocks freight rate benchmarking powered by live market data."
      }

      if (isGrowthPlus && recentQuotes?.length) {
        parts.push("FREIGHT RATE BENCHMARKS:")
        recentQuotes.forEach((q: any) => {
          parts.push("Lane: " + q.origin_port + " to " + q.destination_port + " (" + q.shipment_mode + ")")
          parts.push("  Market cheapest: $" + q.cheapest_rate + " | Market avg: $" + q.market_avg_rate)
          if (q.user_paid_rate) parts.push("  User paying: $" + q.user_paid_rate)
          if (q.overpaying_amount > 0) parts.push("  OVERPAYING by: $" + q.overpaying_amount)
        })
      }
      if (isGrowthPlus && inboundShipments?.length) {
        parts.push("USER INBOUND SHIPMENTS:")
        inboundShipments.forEach((s: any) => { if (s.total_value) parts.push("- " + (s.supplier_name || "Supplier") + ": " + finalSymbol + s.total_value) })
      }

      const overpayingAnalysis = isBusinessPlus
        ? "\n\nAnalyse if the user is overpaying. If overpaying amount is shown, calculate annual saving and suggest specific renegotiation language."
        : ""

      if (isGrowthPlus && !parts.length) {
        try {
          const route = questionText.match(/from\s+(\w[\w\s]+?)\s+to\s+(\w[\w\s]+)/i)
          const searchQuery = route
            ? `ocean freight rate ${route[1].trim()} to ${route[2].trim()} 2026 USD per container`
            : `current ocean freight rates SME importer 2026 USD benchmarks`
          const tavilyFreight = await tavilySearch(searchQuery, { searchDepth: 'basic', maxResults: 3, includeAnswer: true })
          if (tavilyFreight?.answer) {
            freightContext = "LIVE FREIGHT RATE DATA (from web):\n" + tavilyFreight.answer + "\n\nUse this market rate data to advise the user. Suggest they save their actual paid rate on the Shipments page so AskBiz can benchmark it against the market automatically."
          }
        } catch (e) {}
      }

      if (isGrowthPlus) freightContext = freightContext || (parts.length
        ? parts.join("\n") + "\n\nUse this data to give specific freight rate advice. If no benchmarks yet, suggest they use the freight rate quote tool on the Shipments page."
        : "User asking about freight rates but has no benchmarks yet. Suggest going to Shipments page to get a free market rate quote to benchmark against their forwarder.")
    } catch (e) {}
  }

  // ── PARCEL MONKEY LIVE QUOTE ─────────────────────────────────────────────
  // Fires when user asks about sending a parcel, courier price, or shipping cost
  // for a specific small-parcel route (not bulk freight)
  let parcelContext = ""
  const parcelIntent = /how much.*send|send.*parcel|parcel.*cost|courier.*price|how much.*post|post.*cost|ship.*parcel|parcel.*ship|price.*deliver|deliver.*price|how much.*courier|quote.*parcel|parcel.*quote/i.test(questionText)

  if (parcelIntent) {
    try {
      // Step 1: Claude parses the NL question into structured parcel data
      const parseRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal': 'true' },
        body: JSON.stringify({ action: 'parse', text: questionText }),
      })

      if (parseRes.ok) {
        const parseData = await parseRes.json()

        if (parseData.success && parseData.parsed) {
          const parsed = parseData.parsed

          if (parsed.missing?.length > 0) {
            // Tell Claude what's still needed — it will ask the user naturally
            parcelContext = [
              `PARCEL QUOTE — INCOMPLETE:`,
              `Understood so far: origin=${parsed.origin || '?'}, destination=${parsed.destination || '?'}`,
              parsed.weight_kg ? `weight=${parsed.weight_kg}kg` : '',
              `Still needed to get a live quote: ${parsed.missing.join(', ')}`,
              `Ask the user for these specific details naturally in your answer_text.`,
              `Set parcel_missing_fields to: ${JSON.stringify(parsed.missing)}`,
            ].filter(Boolean).join('\n')

          } else {
            // Step 2: All fields present — fetch live rates from Parcel Monkey
            const quotesRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/quote`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-internal': 'true' },
              body: JSON.stringify({ action: 'get_quotes', ...parsed }),
            })

            if (quotesRes.ok) {
              const quotesData = await quotesRes.json()

              if (quotesData.success && quotesData.quotes?.length) {
                const top = quotesData.quotes.slice(0, 4)
                const cheapest = top[0]

                // Pull user's historical shipping spend for comparison
                const { data: shippingSpend } = await supabase
                  .from('shipments')
                  .select('total_value')
                  .eq('user_id', user.id)
                  .eq('shipment_type', 'outbound')
                  .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

                const monthlySpend = shippingSpend?.reduce((sum: number, s: any) => sum + (s.total_value || 0), 0) || 0

                parcelContext = [
                  `LIVE PARCEL MONKEY RATES:`,
                  `Route: ${parsed.origin} → ${parsed.destination} | Weight: ${parsed.weight_kg}kg | Dims: ${parsed.length_cm}×${parsed.width_cm}×${parsed.height_cm}cm`,
                  ``,
                  ...top.map((q: any, i: number) =>
                    `${i === 0 ? '[CHEAPEST] ' : ''}${q.carrier} — ${q.service_name}: £${parseFloat(q.total_price_gross).toFixed(2)} (${q.service_description})${q.customs_invoice_required ? ' [customs docs required]' : ''}`
                  ),
                  ``,
                  monthlySpend > 0
                    ? `USER SHIPPING CONTEXT: User spent ${finalSymbol}${monthlySpend.toFixed(2)} on outbound shipments in the last 30 days. Use this to calculate potential savings if they switch to the cheapest carrier.`
                    : `No historical shipping spend data available for comparison.`,
                  ``,
                  `Populate parcel_quotes with the top options using their service codes so the user can book directly.`,
                ].join('\n')
              } else {
                parcelContext = `Parcel Monkey returned no quotes for this route. Tell the user no services are currently available for ${parsed.origin} → ${parsed.destination} and suggest they check parcelmonkey.co.uk directly.`
              }
            }
          }
        }
      }
    } catch (e) {
      // Non-blocking — parcel context is enhancement not requirement
    }
  }

  // ── TAVILY WEB SEARCH ─────────────────────────────────────────────────────
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
      // Non-blocking
    }
  }

  // ── SOCIAL COMMERCE INTENT ──────────────────────────────────
  const isSocialQuestion = detectSocialIntent(questionText)
  if (isSocialQuestion) {
    try {
      const socialRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'}/api/social`, {
        headers: { 'Cookie': request.headers.get('cookie') || '' },
      })
      const socialData = socialRes.ok ? await socialRes.json() : null
      if (socialData) {
        const result = buildSocialResult(questionText, socialData)
        if (conversationId) {
          await supabase.from('messages').insert([
            { conversation_id: conversationId, role: 'user', content: questionText },
            { conversation_id: conversationId, role: 'assistant', content: result.answer_text, metadata: result },
          ])
        }
        await supabase.rpc('increment_usage', { p_user_id: user.id, p_field: 'questions' })
        return NextResponse.json(result)
      }
    } catch {}
  }
  // ── END SOCIAL COMMERCE INTENT ────────────────────────────────

  // ── EXPORT MARKET INTENT ─────────────────────────────────────
  const isExportQuestion = detectExportIntent(questionText)

  if (isExportQuestion) {
    try {
      // Get product lines from cost profile if available
      const costProfile = await fetchCostProfile(supabase, user.id)
      const productLines = costProfile?.product_lines?.map(p => ({
        category: p.category,
        product_name: p.product_name,
        avg_gross_margin: p.avg_gross_margin,
      })) || []

      const result = buildExportMarketsResult(questionText, productLines)

      if (conversationId) {
        await supabase.from('messages').insert([
          { conversation_id: conversationId, role: 'user', content: questionText },
          { conversation_id: conversationId, role: 'assistant', content: result.answer_text, metadata: result },
        ])
      }
      await supabase.rpc('increment_usage', { p_user_id: user.id, p_field: 'questions' })
      return NextResponse.json(result)
    } catch {
      // Fall through to normal AI response
    }
  }
  // ── END EXPORT MARKET INTENT ──────────────────────────────────

  // ── COST INTELLIGENCE CONTEXT ────────────────────────────────
  let costContext = ''
  if (detectCostIntent(questionText)) {
    const costProfile = await fetchCostProfile(supabase, user.id)
    if (costProfile) {
      costContext = buildCostContext(costProfile)
    }
  }
  // ── END COST INTELLIGENCE CONTEXT ────────────────────────────

  // ── POS INTELLIGENCE CONTEXT ─────────────────────────────
  let posContext = ''
  const posKeywords = /\b(sales?|till|cashier|pos|shop|store|sold|selling|stock|inventory|refund|receipt|customer|basket|revenue today|today.s sales?)\b/i
  if (posKeywords.test(questionText)) {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const [txRes, invRes, staffRes] = await Promise.all([
      supabase.from('pos_transactions').select('total,status,created_at,pos_items(name,qty),pos_staff(name)').eq('owner_id', user.id).gte('created_at', today.toISOString()).order('created_at', { ascending: false }).limit(50),
      supabase.from('inventory').select('name,stock_qty,low_stock_threshold,sale_price').eq('owner_id', user.id).eq('active', true).order('stock_qty', { ascending: true }).limit(20),
      supabase.from('pos_staff').select('name,role,active').eq('owner_id', user.id),
    ])
    const txs      = txRes.data || []
    const inv      = invRes.data || []
    const staffList = staffRes.data || []
    const todayRev  = txs.filter((t: { status: string }) => t.status === 'completed').reduce((s: number, t: { total: number }) => s + t.total, 0)
    const todayCnt  = txs.filter((t: { status: string }) => t.status === 'completed').length
    const refunds   = txs.filter((t: { status: string }) => t.status === 'refunded' || t.status === 'partially_refunded').length
    const lowStock  = (inv as { stock_qty: number; low_stock_threshold: number; name: string }[]).filter(i => i.stock_qty <= i.low_stock_threshold)
    if (todayCnt > 0 || inv.length > 0) {
      posContext = `\n\nLIVE POS DATA:\nToday's sales: ${todayCnt} transactions, ${finalSymbol}${todayRev.toFixed(2)} revenue, ${refunds} refunds.\n`
      if (lowStock.length > 0) posContext += `Low/out of stock: ${lowStock.map((i: { name: string; stock_qty: number }) => `${i.name} (${i.stock_qty} left)`).join(', ')}.\n`
      if (staffList.length > 0) posContext += `Active staff: ${(staffList as { name: string; role: string; active: boolean }[]).filter(s => s.active).map(s => `${s.name} (${s.role})`).join(', ')}.\n`
    }
  }
  // ── END POS CONTEXT ──────────────────────────────────────

  // ── COLLECTIVE INTELLIGENCE / BENCHMARK CONTEXT ───────────
  let benchmarkContext = ''
  const benchmarkIntent = /sell.*in\s+([\w\s]+)|market.*in\s+([\w\s]+)|expand.*to\s+([\w\s]+)|how.*do.*in\s+([\w\s]+)|benchmark|industry average|others.*sell|compare.*sector|typical margin|average basket|refund rate/i.test(questionText)
  if (benchmarkIntent) {
    try {
      // Extract target region from question if present
      const regionMatch = questionText.match(/\bin\s+([\w\s]{3,30}?)(?:\?|$|\.|,)/i)
      const targetRegion = regionMatch?.[1]?.trim() || finalRegion || 'United Kingdom'
      const period = new Date().toISOString().slice(0, 7)

      const { data: benchmarks } = await supabase
        .from('market_benchmarks')
        .select('sector, region, business_size, metric, value, sample_size')
        .ilike('region', `%${targetRegion.split(' ').pop() || targetRegion}%`)
        .eq('period', period)
        .order('sample_size', { ascending: false })
        .limit(20)

      if (benchmarks?.length) {
        const grouped: Record<string, Record<string, string>> = {}
        for (const b of benchmarks) {
          const key = `${b.sector} · ${b.region} · ${b.business_size}`
          if (!grouped[key]) grouped[key] = {}
          const labels: Record<string, string> = {
            avg_margin:        'avg gross margin',
            avg_basket:        'avg basket size',
            avg_daily_revenue: 'avg daily revenue',
            refund_rate:       'refund rate',
          }
          grouped[key][labels[b.metric] || b.metric] = b.metric === 'avg_margin' || b.metric === 'refund_rate'
            ? `${b.value.toFixed(1)}%`
            : `${finalSymbol}${b.value.toFixed(2)}`
        }

        const lines = ['MARKET BENCHMARKS (anonymised — minimum 3 businesses per bucket):']
        for (const [label, metrics] of Object.entries(grouped)) {
          lines.push(`\n${label}:`)
          for (const [metric, value] of Object.entries(metrics)) {
            lines.push(`  ${metric}: ${value}`)
          }
        }
        benchmarkContext = lines.join('\n')
      } else {
        // Fall back to Tavily for market intelligence when no local benchmarks exist
        const tavilyBenchQuery = `${finalSector || 'retail'} business average profit margin basket size ${targetRegion} 2025`
        try {
          const benchSearch = await tavilySearch(tavilyBenchQuery, { searchDepth: 'basic', maxResults: 3, includeAnswer: true })
          if (benchSearch?.answer) {
            benchmarkContext = `MARKET INTELLIGENCE (web research — no local benchmark data yet for ${targetRegion}):\n${benchSearch.answer}`
          }
        } catch {}
      }
    } catch {}
  }
  // ── END COLLECTIVE INTELLIGENCE ───────────────────────────

  // Load persistent business memory (non-blocking — empty string if it fails)
  const businessMemory = await loadMemoryContext(user.id)

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
    trackingContext: trackingContext || undefined,
    freightContext: freightContext || undefined,
    parcelContext: parcelContext || undefined,
    businessMemory: businessMemory || undefined,
    simulateMode: !!simulateMode,
    cfoMode: !!cfoMode,
    posContext: posContext || undefined,
    benchmarkContext: benchmarkContext || undefined,
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
      parcel_intent: parcelIntent,
    },
  })

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

  // Extract business facts from this exchange (fire-and-forget)
  extractAndSaveMemory(user.id, questionText, result.answer_text).catch(() => {})

  // Increment usage
  await supabase.rpc('increment_usage', { p_user_id: user.id, p_field: 'questions' })

  return NextResponse.json(result)
}
