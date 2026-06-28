import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, askOnce } from '@/lib/ai'
import { loadMemoryContext, extractAndSaveMemory } from '@/lib/ai/memory'
import { isExpansionQuestion, buildExpansionContext, buildDataSummary } from '@/lib/ai/expansion'
import { tavilySearch, detectSearchIntent, formatSearchContext } from '@/lib/tavily'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { detectChurnIntent, buildChurnAIResult } from '@/lib/ai/churn'
import { detectCostIntent, buildCostContext, fetchCostProfile } from '@/lib/ai/cost-context'
import { detectExportIntent, buildExportMarketsResult } from '@/lib/ai/export-markets'
import { detectSocialIntent, buildSocialResult } from '@/lib/ai/social-intelligence'
import { COUNTRY_CURRENCY, CURRENCIES } from '@/lib/geo'
import { resolveLocale } from '@/lib/i18n-locale'

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

  // Derive currency from Vercel IP-country header — always accurate, overrides stale profile/client values
  const ipCountry = request.headers.get('x-vercel-ip-country') || ''
  const geoCurrency = ipCountry ? COUNTRY_CURRENCY[ipCountry] : null
  const geoSymbol   = geoCurrency ? (CURRENCIES[geoCurrency]?.sym ?? null) : null

  // The user's saved profile currency wins; geo (IP) is only a fallback when the
  // profile has none, then the client value, then USD.
  const finalCurrency = profile?.currency || geoCurrency || currency || 'USD'
  const finalSymbol   = profile?.currency_symbol || geoSymbol || symbol || '$'
  const finalBizType  = bizType  || profile?.business_type || 'retail'
  const finalRegion   = region   || profile?.region || ''
  const finalSector   = sectorHints || profile?.sector_hints || ''

  // Resolve the response language: explicit client choice → saved cookie → geo.
  // The AI answers in this language. (Profile column is read elsewhere once the
  // preferred_locale migration is applied; cookie already reflects the choice.)
  const finalLocale = resolveLocale({
    urlLocale: (body.locale as string) || null,
    cookie: request.cookies.get('askbiz_lang')?.value,
    country: ipCountry,
  })

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

  // ── GLOBAL PRODUCT CATALOGUE CONTEXT (Growth+) ───────────────
  if (isGrowthPlus && marketKeywords.test(questionText)) {
    try {
      const service = createServiceClient()
      const productMatch = questionText.match(/(?:price|sell|worth|cost|market|rate|what is|how much)(?:\s+\w+){0,3}\s+([\w\s]{3,40}?)(?:\s+in|\s+on|\s+for|\?|$)/i)
      const gpcQuery = productMatch ? productMatch[1].trim() : questionText.replace(/[^a-zA-Z0-9\s]/g, '').trim().slice(0, 50)
      if (gpcQuery.length >= 3) {
        const { data: gpcRows } = await service
          .from('global_product_catalogue')
          .select('product_name,channel,region,currency,avg_selling_price,min_selling_price,max_selling_price,avg_gross_margin,merchant_count,period')
          .ilike('product_name', `%${gpcQuery}%`)
          .order('merchant_count', { ascending: false })
          .limit(5)
        if (gpcRows?.length) {
          const gpcLines = ['GLOBAL MERCHANT PRICE POOL (anonymised, n≥3 merchants):']
          for (const r of gpcRows) {
            gpcLines.push(`${r.product_name} | ${r.channel} | ${r.region}: avg ${r.currency}${r.avg_selling_price} (range ${r.min_selling_price}–${r.max_selling_price}) | margin ${r.avg_gross_margin ? r.avg_gross_margin + '%' : 'N/A'} | ${r.merchant_count}+ merchants | ${r.period}`)
          }
          marketContext = marketContext ? marketContext + '\n\n' + gpcLines.join('\n') : gpcLines.join('\n')
        }
      }
    } catch {}
  }

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

  // ── BUSINESS DATA CONTEXT (always runs — every question gets business data) ──
  let posContext = ''
  const service = createServiceClient()
  {
    const q = questionText.toLowerCase()
    const now = new Date()
    let from: Date
    let to: Date = now
    let periodLabel = "Today's"

    if (/yesterday/.test(q)) {
      const d = new Date(now); d.setDate(d.getDate() - 1); d.setHours(0,0,0,0)
      from = d
      to = new Date(d); to.setHours(23,59,59,999)
      periodLabel = "Yesterday's"
    } else if (/last\s*(7|seven)\s*days?|past\s*week/i.test(q)) {
      from = new Date(now); from.setDate(from.getDate() - 7); from.setHours(0,0,0,0)
      periodLabel = 'Last 7 days'
    } else if (/last\s*month|past\s*month/i.test(q)) {
      from = new Date(now); from.setMonth(from.getMonth() - 1); from.setHours(0,0,0,0)
      periodLabel = 'Last month'
    } else if (/last\s*30\s*days/i.test(q)) {
      from = new Date(now); from.setDate(from.getDate() - 30); from.setHours(0,0,0,0)
      periodLabel = 'Last 30 days'
    } else if (/this\s*week/i.test(q)) {
      from = new Date(now); from.setDate(from.getDate() - from.getDay()); from.setHours(0,0,0,0)
      periodLabel = 'This week'
    } else if (/this\s*month/i.test(q)) {
      from = new Date(now.getFullYear(), now.getMonth(), 1)
      periodLabel = 'This month'
    } else if (/busiest|which.?day|day.?of.?week/i.test(q)) {
      from = new Date(now); from.setDate(from.getDate() - 90); from.setHours(0,0,0,0)
      periodLabel = 'Last 90 days'
    } else if (/today|right now|so far today/i.test(q)) {
      from = new Date(now); from.setHours(0,0,0,0)
      periodLabel = "Today's"
    } else {
      from = new Date(now); from.setDate(from.getDate() - 30); from.setHours(0,0,0,0)
      periodLabel = 'Last 30 days'
    }

    const [txRes, invRes, staffRes, custRes, anomalyRes, alertRes, forecastRes, healthRes, shiftRes, decisionRes, sourcesRes, mpesaRes, briefRes, locRes] = await Promise.all([
      service.from('pos_transactions').select('total,subtotal,discount_amount,status,payment_type,created_at,pos_location_id,pos_items(name,qty,unit_price,cost_price),pos_staff(name)').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).order('created_at', { ascending: false }).limit(200),
      service.from('inventory').select('name,stock_qty,low_stock_threshold,sale_price,cost_price,location_id').eq('owner_id', user.id).eq('active', true).order('stock_qty', { ascending: true }).limit(100),
      service.from('pos_staff').select('name,role,active').eq('owner_id', user.id),
      service.from('pos_customers').select('id,name,phone,total_spent,visit_count,last_seen_at').eq('owner_id', user.id).order('total_spent', { ascending: false }).limit(10),
      service.from('anomalies').select('type,severity,title,body,product,metric,created_at').eq('user_id', user.id).eq('seen', false).order('created_at', { ascending: false }).limit(10),
      service.from('alerts').select('name,type,condition,last_triggered_at,enabled').eq('user_id', user.id).eq('enabled', true).limit(10),
      service.from('forecasts').select('metric,value,period,confidence,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      service.from('health_scores').select('score,label,summary,components,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      // Shift management
      service.from('pos_shifts').select('cashier_id,opening_balance,closing_balance,expected_balance,variance_amount,variance_reason,status,opened_at,closed_at').eq('owner_id', user.id).gte('opened_at', from.toISOString()).lte('opened_at', to.toISOString()).order('opened_at', { ascending: false }).limit(20),
      // Decisions log
      service.from('decisions').select('title,decision_type,product,before_value,after_value,review_at,reviewed,review_verdict,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      // Connected integrations
      service.from('connected_sources').select('source_type,name,status,last_synced_at,error_message').eq('user_id', user.id),
      // M-Pesa payments
      service.from('mpesa_payments').select('amount,status,mpesa_receipt,plan,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      // Latest daily brief
      service.from('daily_briefs').select('improved,worsened,action,health_score,date,created_at').eq('user_id', user.id).order('date', { ascending: false }).limit(1),
      // Locations
      service.from('pos_locations').select('id,name,is_active').eq('owner_id', user.id).eq('is_active', true),
    ])

    const txs       = txRes.data || []
    const inv       = invRes.data || []
    const staffList = staffRes.data || []
    const customers = custRes.data || []
    const anomalies = anomalyRes.data || []
    const alerts    = alertRes.data || []
    const forecasts = forecastRes.data || []
    const health    = healthRes.data?.[0] || null
    const shifts    = shiftRes.data || []
    const decisions = decisionRes.data || []
    const sources   = sourcesRes.data || []
    const mpesa     = mpesaRes.data || []
    const brief     = briefRes.data?.[0] || null
    const locations = locRes.data || []

    console.log('[POS DEBUG] user.id:', user.id, 'from:', from.toISOString(), 'to:', to.toISOString(), 'period:', periodLabel)
    console.log('[POS DEBUG] txs:', txs.length, 'inv:', inv.length, 'staff:', staffList.length, 'txErr:', txRes.error?.message || 'none')
    if (txRes.error) console.error('POS tx query error:', txRes.error.message)
    if (invRes.error) console.error('POS inv query error:', invRes.error.message)
    if (shiftRes.error) console.error('Shift query error:', shiftRes.error.message)

    const completed = txs.filter((t: any) => t.status === 'completed')
    const revenue   = completed.reduce((s: number, t: any) => s + t.total, 0)
    const refunds   = txs.filter((t: any) => t.status === 'refunded' || t.status === 'partially_refunded').length

    // Profit from line items
    let totalCost = 0
    for (const t of completed) {
      for (const item of (t.pos_items || [])) {
        totalCost += (item.cost_price || 0) * item.qty
      }
    }
    const profit = revenue - totalCost
    const marginPct = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0'

    // Top products
    const productSales: Record<string, { qty: number; revenue: number; cost: number }> = {}
    for (const t of completed) {
      for (const item of (t.pos_items || [])) {
        const key = item.name
        if (!productSales[key]) productSales[key] = { qty: 0, revenue: 0, cost: 0 }
        productSales[key].qty += item.qty
        productSales[key].revenue += item.qty * item.unit_price
        productSales[key].cost += (item.cost_price || 0) * item.qty
      }
    }
    const topProducts = Object.entries(productSales).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5)

    // Payment breakdown
    const paymentBreakdown: Record<string, number> = {}
    for (const t of completed) {
      const method = t.payment_type || 'unknown'
      paymentBreakdown[method] = (paymentBreakdown[method] || 0) + t.total
    }

    // Busiest hour
    const hourCounts: Record<number, number> = {}
    for (const t of completed) {
      const hour = new Date(t.created_at).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    }
    const busiestHour = Object.entries(hourCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]

    // POS day-of-week breakdown
    const DOW_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    const posDayRevenue: Record<string, { revenue: number; txns: number }> = {}
    for (const t of completed) {
      const day = DOW_NAMES[new Date(t.created_at).getDay()]
      if (!posDayRevenue[day]) posDayRevenue[day] = { revenue: 0, txns: 0 }
      posDayRevenue[day].revenue += t.total
      posDayRevenue[day].txns++
    }

    const lowStock = (inv as any[]).filter(i => i.stock_qty <= (i.low_stock_threshold || 5))

    // ── Unified data (Stripe, eBay, Shopify etc.) ───────────────────────────
    // Always query — no source-existence gate, fixed 365-day window so
    // historical patterns (busiest day, trends) have enough data.
    // Include channel='pos' so POS product sales appear when pos_transactions returns 0.
    const udFrom = new Date(now); udFrom.setDate(udFrom.getDate() - 365)
    const { data: udData, error: udError } = await service
      .from('unified_data')
      .select('record_date,gross_revenue,net_revenue,channel,product_name,units_sold,source_type,payment_status')
      .eq('user_id', user.id)
      .gte('record_date', udFrom.toISOString().slice(0, 10))
      .order('record_date', { ascending: false })
      .limit(1000)
    const unifiedRows: any[] = (udData || []).filter((r: any) => (r.gross_revenue || 0) > 0)
    if (udError) console.error('[unified_data] query error:', udError.message)
    console.log('[unified_data] rows:', unifiedRows.length, 'user:', user.id)
    // ── End unified data ─────────────────────────────────────────────────────

    posContext = `\n\nLIVE POS DATA (${periodLabel}):\n`
    posContext += `${completed.length} completed transactions, ${finalSymbol}${revenue.toFixed(2)} revenue, ${finalSymbol}${profit.toFixed(2)} profit (${marginPct}% margin), ${refunds} refund(s).\n`

    // Per-branch breakdown (only if multiple locations exist)
    if (locations.length > 1) {
      const locMap = Object.fromEntries(locations.map((l: any) => [l.id, l.name]))
      const branchRevenue: Record<string, { txns: number; revenue: number }> = {}
      for (const t of completed) {
        const locName = locMap[t.pos_location_id] || 'Unassigned'
        if (!branchRevenue[locName]) branchRevenue[locName] = { txns: 0, revenue: 0 }
        branchRevenue[locName].txns++
        branchRevenue[locName].revenue += t.total
      }
      posContext += `\nBy branch:\n${Object.entries(branchRevenue).map(([name, d]) => `- ${name}: ${d.txns} txns, ${finalSymbol}${d.revenue.toFixed(2)} revenue`).join('\n')}\n`

      // Inventory per branch
      const branchStock: Record<string, { total: number; low: number; oos: number }> = {}
      for (const item of inv) {
        const locName = locMap[(item as any).location_id] || 'Unassigned'
        if (!branchStock[locName]) branchStock[locName] = { total: 0, low: 0, oos: 0 }
        branchStock[locName].total++
        if (item.stock_qty <= 0) branchStock[locName].oos++
        else if (item.stock_qty <= (item.low_stock_threshold || 5)) branchStock[locName].low++
      }
      posContext += `Inventory by branch:\n${Object.entries(branchStock).map(([name, d]) => `- ${name}: ${d.total} products, ${d.low} low stock, ${d.oos} out of stock`).join('\n')}\n`
    }

    if (Object.keys(paymentBreakdown).length > 0) {
      posContext += `Payment methods: ${Object.entries(paymentBreakdown).map(([m, v]) => `${m}: ${finalSymbol}${v.toFixed(2)}`).join(', ')}.\n`
    }
    if (busiestHour) {
      posContext += `Busiest hour: ${Number(busiestHour[0])}:00 (${busiestHour[1]} transactions).\n`
    }
    if (topProducts.length > 0) {
      posContext += `Top products: ${topProducts.map(([name, s]) => `${name} (${s.qty} sold, ${finalSymbol}${s.revenue.toFixed(2)}, margin ${s.revenue > 0 ? ((s.revenue - s.cost) / s.revenue * 100).toFixed(0) : 0}%)`).join(', ')}.\n`
    }
    if (lowStock.length > 0) {
      posContext += `Low/out of stock (${lowStock.length} items): ${lowStock.slice(0, 10).map((i: any) => `${i.name} (${i.stock_qty} left)`).join(', ')}.\n`
    }
    if (staffList.length > 0) {
      posContext += `Staff: ${(staffList as any[]).filter(s => s.active).map(s => `${s.name} (${s.role})`).join(', ')}.\n`
    }
    if (customers.length > 0) {
      posContext += `Top customers: ${customers.slice(0, 5).map((c: any) => `${c.name || c.phone || 'Anonymous'} (${finalSymbol}${(c.total_spent || 0).toFixed(2)} spent, ${c.visit_count || 0} visits)`).join(', ')}.\n`
    }
    if (anomalies.length > 0) {
      posContext += `\nACTIVE ANOMALIES (${anomalies.length}):\n${anomalies.map((a: any) => `- [${a.severity.toUpperCase()}] ${a.title}: ${a.body}`).join('\n')}\n`
    }
    if (health) {
      posContext += `\nBUSINESS HEALTH: ${health.score}/100 (${health.label}). ${health.summary}\n`
    }
    if (forecasts.length > 0) {
      posContext += `\nFORECASTS: ${forecasts.map((f: any) => `${f.metric}: ${finalSymbol}${f.value?.toFixed?.(2) ?? f.value} (${f.period}, ${f.confidence || 'medium'} confidence)`).join(', ')}.\n`
    }
    if (alerts.length > 0) {
      posContext += `\nACTIVE ALERTS: ${alerts.map((a: any) => `${a.name} (${a.type}${a.last_triggered_at ? ', last triggered ' + new Date(a.last_triggered_at).toLocaleDateString() : ''})`).join(', ')}.\n`
    }

    // Shift management
    if (shifts.length > 0) {
      const closedShifts = shifts.filter((s: any) => s.status !== 'open')
      const openShifts = shifts.filter((s: any) => s.status === 'open')
      const totalVariance = closedShifts.reduce((s: number, sh: any) => s + Math.abs(sh.variance_amount || 0), 0)
      const shiftsWithVariance = closedShifts.filter((s: any) => s.variance_amount && Math.abs(s.variance_amount) > 0)
      posContext += `\nSHIFT DATA (${periodLabel}):\n`
      posContext += `${shifts.length} shift(s) (${openShifts.length} open, ${closedShifts.length} closed).\n`
      if (closedShifts.length > 0) {
        posContext += `Cash variance: ${finalSymbol}${totalVariance.toFixed(2)} across ${shiftsWithVariance.length} shift(s) with discrepancies.\n`
        const reconciled = closedShifts.filter((s: any) => s.status === 'reconciled').length
        posContext += `Reconciliation rate: ${closedShifts.length > 0 ? ((reconciled / closedShifts.length) * 100).toFixed(0) : 0}%.\n`
      }
      if (openShifts.length > 0) {
        posContext += `Currently open: ${openShifts.map((s: any) => `cashier ${s.cashier_id} (float ${finalSymbol}${(s.opening_balance || 0).toFixed(2)}, opened ${new Date(s.opened_at).toLocaleTimeString()})`).join(', ')}.\n`
      }
    }

    // Daily brief
    if (brief) {
      posContext += `\nLATEST DAILY BRIEF (${brief.date}):\n`
      if (brief.improved) posContext += `Improved: ${brief.improved}\n`
      if (brief.worsened) posContext += `Worsened: ${brief.worsened}\n`
      if (brief.action) posContext += `Key action: ${brief.action}\n`
      if (brief.health_score) posContext += `Health score: ${brief.health_score}/100\n`
    }

    // Connected channel data (Stripe, eBay, Shopify etc.) from unified_data
    if (unifiedRows.length > 0) {
      const udDayRevenue: Record<string, { revenue: number; orders: number }> = {}
      const channelRevenue: Record<string, number> = {}
      const productSalesUd: Record<string, { units: number; revenue: number }> = {}
      let udTotal = 0
      for (const row of unifiedRows) {
        const day = DOW_NAMES[new Date(row.record_date).getDay()]
        if (!udDayRevenue[day]) udDayRevenue[day] = { revenue: 0, orders: 0 }
        udDayRevenue[day].revenue += row.gross_revenue || 0
        udDayRevenue[day].orders++
        const ch = row.channel || row.source_type || 'unknown'
        channelRevenue[ch] = (channelRevenue[ch] || 0) + (row.gross_revenue || 0)
        udTotal += row.gross_revenue || 0
        if (row.product_name) {
          if (!productSalesUd[row.product_name]) productSalesUd[row.product_name] = { units: 0, revenue: 0 }
          productSalesUd[row.product_name].units += row.units_sold || 0
          productSalesUd[row.product_name].revenue += row.gross_revenue || 0
        }
      }
      // Only include products with actual units sold (excludes Stripe subscription events)
      const topUdProducts = Object.entries(productSalesUd).filter(([, s]) => s.units > 0).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5)

      posContext += `\nALL CHANNEL REVENUE (${periodLabel}, from ${Object.keys(channelRevenue).join(', ')}):\n`
      posContext += `Total: ${finalSymbol}${udTotal.toFixed(2)} across ${unifiedRows.length} records.\n`
      posContext += `By channel: ${Object.entries(channelRevenue).map(([ch, rev]) => `${ch}: ${finalSymbol}${rev.toFixed(2)}`).join(', ')}.\n`
      if (topUdProducts.length > 0) {
        posContext += `Top products: ${topUdProducts.map(([name, s]) => `${name} (${s.units} units, ${finalSymbol}${s.revenue.toFixed(2)})`).join(', ')}.\n`
      }

      // Merge POS + external channels into one combined day-of-week table
      const allDays = new Set([...Object.keys(posDayRevenue), ...Object.keys(udDayRevenue)])
      const combinedDays: { day: string; revenue: number; txns: number }[] = []
      for (const day of allDays) {
        combinedDays.push({
          day,
          revenue: (posDayRevenue[day]?.revenue || 0) + (udDayRevenue[day]?.revenue || 0),
          txns: (posDayRevenue[day]?.txns || 0) + (udDayRevenue[day]?.orders || 0),
        })
      }
      combinedDays.sort((a, b) => b.revenue - a.revenue)

      posContext += `\nCOMBINED REVENUE BY DAY OF WEEK (POS + all channels, ${periodLabel}):\n`
      posContext += combinedDays.map(d => `  ${d.day}: ${finalSymbol}${d.revenue.toFixed(2)} (${d.txns} transactions)`).join('\n') + '\n'
      if (combinedDays.length > 0) {
        posContext += `Busiest day overall: ${combinedDays[0].day} with ${finalSymbol}${combinedDays[0].revenue.toFixed(2)} combined revenue.\n`
      }
    } else if (Object.keys(posDayRevenue).length > 0) {
      // POS only — no external channels
      const sortedPosDays = Object.entries(posDayRevenue).sort((a, b) => b[1].revenue - a[1].revenue)
      posContext += `\nPOS REVENUE BY DAY OF WEEK (${periodLabel}):\n`
      posContext += sortedPosDays.map(([day, d]) => `  ${day}: ${finalSymbol}${d.revenue.toFixed(2)} (${d.txns} txns)`).join('\n') + '\n'
      if (sortedPosDays.length > 0) {
        posContext += `Busiest day: ${sortedPosDays[0][0]} with ${finalSymbol}${sortedPosDays[0][1].revenue.toFixed(2)} revenue.\n`
      }
    }

    // Connected integrations
    if (sources.length > 0) {
      const active = sources.filter((s: any) => s.status === 'active')
      const errored = sources.filter((s: any) => s.status === 'error')
      posContext += `\nCONNECTED INTEGRATIONS (${sources.length}):\n`
      posContext += `Active: ${active.map((s: any) => `${s.name} (${s.source_type}${s.last_synced_at ? ', synced ' + new Date(s.last_synced_at).toLocaleDateString() : ''})`).join(', ') || 'none'}.\n`
      if (errored.length > 0) {
        posContext += `Errors: ${errored.map((s: any) => `${s.name} (${s.source_type}): ${s.error_message || 'unknown error'}`).join(', ')}.\n`
      }
    }

    // M-Pesa payments
    if (mpesa.length > 0) {
      const completed_mpesa = mpesa.filter((p: any) => p.status === 'completed')
      const pending_mpesa = mpesa.filter((p: any) => p.status === 'pending')
      posContext += `\nM-PESA PAYMENTS (recent ${mpesa.length}):\n`
      posContext += `${completed_mpesa.length} completed, ${pending_mpesa.length} pending.\n`
      if (completed_mpesa.length > 0) {
        const totalMpesa = completed_mpesa.reduce((s: number, p: any) => s + p.amount, 0)
        posContext += `Total received: KSh ${totalMpesa.toLocaleString()}. Latest: ${completed_mpesa.slice(0, 3).map((p: any) => `KSh ${p.amount} (${p.plan}, ${new Date(p.created_at).toLocaleDateString()})`).join(', ')}.\n`
      }
    }

    // Decisions log
    if (decisions.length > 0) {
      const pending = decisions.filter((d: any) => !d.reviewed && d.review_at && new Date(d.review_at) <= new Date())
      posContext += `\nDECISIONS LOG (${decisions.length} recent):\n`
      posContext += decisions.slice(0, 5).map((d: any) => `- ${d.title} (${d.decision_type}${d.before_value ? `, ${d.before_value} → ${d.after_value}` : ''}${d.review_verdict ? `, verdict: ${d.review_verdict}` : ''}) — ${new Date(d.created_at).toLocaleDateString()}`).join('\n') + '\n'
      if (pending.length > 0) {
        posContext += `⚠ ${pending.length} decision(s) overdue for review.\n`
      }
    }
  }
  // ── END BUSINESS DATA CONTEXT ────────────────────────────

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
    locale: finalLocale,
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
    costContext: costContext || undefined,
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

  const result = await askOnce({ messages, systemPrompt, userId: user.id })

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
