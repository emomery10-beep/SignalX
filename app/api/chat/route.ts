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
  // "deliver" (not "delivery") catches delivering/deliveries/delivered too. carrier/courier added
  // so the carrier-performance extension below is actually reachable by its own natural phrasing
  // ("which courier is most reliable?") — it previously required trackingIntent to ALSO be true,
  // but neither word was in this list, so that phrasing set carrierMention=true, trackingIntent=false
  // and the whole block was unreachable.
  const trackingIntent = /where is|track|shipment|parcel|package|deliver|arrived|shipping status|in transit|customs|carrier|courier/i.test(questionText)
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
      // Unread shipment alerts — the UI surfaces these with specific alert text/reason that the
      // shipment row itself doesn't carry. Runs for BOTH branches above (a specific tracking
      // number or a general tracking question) — previously this only ran in the general branch,
      // so pasting an actual tracking number (arguably the most relevant case for "any alerts on
      // this parcel?") never surfaced them at all.
      {
        let alertsQuery = supabase.from("shipment_alerts").select("alert_type, alert_level, message, financial_impact, delay_days, tracking_number").eq("user_id", user.id).eq("is_read", false).order("created_at", { ascending: false }).limit(10)
        if (trackingNumberMatch?.[1]) alertsQuery = alertsQuery.eq("tracking_number", trackingNumberMatch[1].toUpperCase())
        const { data: shipAlerts } = await alertsQuery
        if (shipAlerts?.length) {
          trackingContext += (trackingContext ? "\n\n" : "") + "UNREAD SHIPMENT ALERTS:\n" + shipAlerts.map((a: any) =>
            "- [" + (a.alert_level || a.alert_type || "alert").toUpperCase() + "] " + (a.tracking_number ? a.tracking_number + ": " : "") + (a.message || a.alert_type) + (a.financial_impact > 0 ? " | Impact: " + finalSymbol + a.financial_impact : "")
          ).join("\n")
        }
      }
      // Carrier reliability — a natural extension of the tracking context rather than its own
      // top-level intent: it only makes sense once we're already answering a shipment question,
      // and only when the user actually asked about the carrier rather than a specific parcel.
      const carrierMention = /\bcarrier(s)?\b|\bcourier(s)?\b|which carrier|\breliable\b|\bon.?time\b/i.test(questionText)
      if (trackingIntent && carrierMention) {
        const { data: carrierRows, error: carrierErr } = await supabase
          .from("carrier_performance")
          .select("carrier_code, carrier_name, route_origin, route_destination, transit_days, on_time, had_customs_hold, recorded_at")
          .eq("user_id", user.id)
          .order("recorded_at", { ascending: false })
          .limit(200)
        if (carrierErr) console.error('carrier_performance query error:', carrierErr.message)
        const carrierRecords = carrierRows || []
        if (carrierRecords.length > 0) {
          const byCarrier: Record<string, { total: number; onTime: number; holds: number; transitDays: number[] }> = {}
          for (const r of carrierRecords as any[]) {
            const key = r.carrier_name || r.carrier_code || 'Unknown carrier'
            if (!byCarrier[key]) byCarrier[key] = { total: 0, onTime: 0, holds: 0, transitDays: [] }
            byCarrier[key].total++
            if (r.on_time) byCarrier[key].onTime++
            if (r.had_customs_hold) byCarrier[key].holds++
            if (r.transit_days != null) byCarrier[key].transitDays.push(Number(r.transit_days))
          }
          const ranked = Object.entries(byCarrier).map(([name, v]) => ({
            name,
            total: v.total,
            onTimePct: v.total > 0 ? (v.onTime / v.total) * 100 : 0,
            holds: v.holds,
            avgTransit: v.transitDays.length > 0 ? v.transitDays.reduce((s, d) => s + d, 0) / v.transitDays.length : null,
          })).sort((a, b) => b.onTimePct - a.onTimePct)

          // carrier_performance is UNIQUE(user_id, carrier_code, route_origin, route_destination) and
          // is upserted by the latest delivery on each lane — one row per carrier×route, overwritten
          // each time, not an accumulating per-shipment log. So `total` below counts ROUTES tracked,
          // not shipments, and on_time reflects only the most recent parcel on each lane.
          const lines = ["CARRIER PERFORMANCE (this user's own shipment history, most recent delivery per route):"]
          for (const c of ranked) {
            lines.push(`- ${c.name}: ${c.onTimePct.toFixed(1)}% on time across ${c.total} route(s) tracked${c.avgTransit != null ? `, avg ${c.avgTransit.toFixed(1)} days transit` : ''}${c.holds > 0 ? `, ${c.holds} customs hold(s)` : ''}`)
          }
          if (ranked.length > 1 && ranked[ranked.length - 1].total >= 3) {
            const worst = ranked[ranked.length - 1]
            lines.push(`Worst performer: ${worst.name} at ${worst.onTimePct.toFixed(1)}% on time.`)
          }
          lines.push("IMPORTANT: Each figure reflects the most recent delivery on each route, not an average across all shipments on that route — state that distinction if asked how many shipments this covers. State the percentages exactly and do not re-rank or estimate them. Do not describe a carrier as good or bad beyond what these numbers show.")
          trackingContext += (trackingContext ? "\n\n" : "") + lines.join("\n")
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
    let isGrowthQuery = false
    let growthSpanDays = 0

    const growthDurationMatch = q.match(/last\s*(\d+)\s*(day|week|month|year)s?/i)
    const growthWordMatch = /\b(grown|growth|grew|growing|increase[d]?|decrease[d]?|compared?\s+to|vs\.?\s+(last|previous)|versus)\b/i.test(q)

    // Absolute calendar month name (e.g. "how was my expenses for the month of July") — a
    // named month is a stronger, more specific signal than any relative-window keyword below,
    // so it's checked right after growth phrasing and before the generic relative branches.
    const MONTH_NAMES = ['january','february','march','april','may','june','july','august','september','october','november','december']
    const monthNameMatch = q.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i)

    // Expense/spending question — distinct from the broad cost/margin detector above, which
    // covers product-level COGS, not general business outgoings (rent, vendor bills, etc.).
    // Negative lookbehind excludes "customer/client spend" — that's basket-size language, not
    // a business-expense question, and was previously hijacking it (e.g. "average customer spend").
    const isExpenseQuestion = /\bexpense(s)?\b|\bspending\b|\boutgoing(s)?\b|\bhow much.*\b(pay|paid)\b|(?<!customer |customers |client |clients |shopper |shoppers |their )\b(spend|spent)\b/i.test(q)

    // Additional real-feature intents — each queries a live table this route previously never
    // looked at, following the same "compute deterministically, don't let the LLM guess" pattern
    // as the growth/expense blocks above. Gated behind intent so ordinary questions don't pay for
    // 9 extra queries most users' business type will never touch.
    const isReceivablesQuestion = /\breceivable(s)?\b|\bpayable(s)?\b|who owes me|owed to me|outstanding invoice|overdue (invoice|payment|bill)|unpaid invoice|what do i owe|money i owe|bills i owe/i.test(q)
    // Dropped the old bare \bPOs?\b shorthand — case-insensitively it matched "POS" itself
    // (this product's own name), spuriously firing on ordinary sales questions.
    const isPurchaseOrderQuestion = /purchase order|\bPO\s*#\s*\d|supplier order|order(ed)? from (my )?supplier|restock order/i.test(q)
    const isRestaurantOpsQuestion = /\bcovers?\b|dine.?in|takeaway|\bkitchen\b|\bwaiter(s)?\b|\bchef(s)?\b|food waste|wasted (food|ingredients)|menu item|table turn/i.test(q)
    const isRepairJobQuestion = /repair (job|ticket)|service (job|ticket)|device (repair|drop.?off)|turnaround time|fix(ed)? (a |the )?(phone|device|laptop)/i.test(q)
    const isLogisticsFleetQuestion = /\bmy (truck|trucks|fleet)\b|which driver|undelivered parcel|parcel(s)?\s+.*\b(undelivered|in transit|delivered|status)\b|route (efficiency|performance)/i.test(q)
    const isFactoryQuestion = /\bfactory\b|production batch|\bbatch(es)?\b|\bwaybill(s)?\b|manufactur|production (yield|output)/i.test(q)
    const isSalonQuestion = /\bsalon\b|\bappointment(s)?\b|\bbooking(s)?\b|\bstylist(s)?\b|no.?show|haircut|client visit/i.test(q)
    // Widened to cover direct-debit collection too — gocardless mandates/payments are
    // conceptually the same "is my money actually being collected?" question as the POS
    // dunning data, so they share one intent and one (clearly-labelled) context section.
    // "mandate" alone false-matched unrelated regulatory phrasing (e.g. "rules mandated by KRA") —
    // scoped to the direct-debit sense specifically.
    const isPaymentIssuesQuestion = /failed payment|payment(s)?\s+.*\bfailed\b|payment link|dunning|abandoned (payment|checkout)|stuck payment|direct debit|gocardless|\bmandate(s|d)?\b.{0,20}(debit|payment|collection)|(debit|payment|collection).{0,20}\bmandate(s|d)?\b/i.test(q)
    const isStocktakeQuestion = /stocktake|shrinkage|stock (count|variance)|missing stock|inventory (count|variance)/i.test(q)
    const isZakatQuestion = /\bzakat\b/i.test(q)
    // Tax filings (pos_tax_filings) — periodic VAT/turnover returns, not daily figures.
    // \btax(es|ed|able)?\b so "how much taxes did I pay" still fires this block — without it,
    // that phrasing only matched isExpenseQuestion, silently skipping the anti-hallucination
    // guard below and letting the LLM answer a tax question from raw expense data instead.
    // Bare "filing(s)" alone false-matched unrelated phrasing (e.g. "a filing system for my
    // receipts") — scoped to a tax-filing sense specifically; \btax(es|ed|able)?\b alone already
    // covers the common case, this alternation only adds the filing-specific phrasing.
    const isTaxQuestion = /\btax(es|ed|able)?\b|\bvat\b|tax\s+filing(s)?|filing(s)?\s+(status|due|deadline|submitted)|tax return|tax due|tax owed/i.test(q)
    // Website analytics (ga_sessions) — traffic/sessions/conversion, distinct from POS sales.
    // A bare \bsessions?\b collides with this product's own non-web uses of the word — stocktake
    // sessions (isStocktakeQuestion, which literally groups by session_ref) and salon/training
    // sessions — so those senses are excluded by lookbehind, the same technique isExpenseQuestion
    // already uses to keep "customer spend" out of the business-expense intent.
    const isTrafficQuestion = /\btraffic\b|website visitor|(?<!stocktake |stock |salon |training |therapy |counting |gym )\bsessions?\b|bounce rate|conversion rate|google analytics|\bga\b traffic/i.test(q)
    // Email marketing (email_campaigns — mailchimp + klaviyo).
    const isMarketingQuestion = /email campaign|\bmailchimp\b|\bklaviyo\b|open rate|click rate|campaign performance|newsletter (performance|results)/i.test(q)

    if (growthWordMatch) {
      // Growth / period-over-period comparison question (e.g. "how much has my retail grown in last 2 months")
      isGrowthQuery = true
      if (growthDurationMatch) {
        const n = parseInt(growthDurationMatch[1], 10)
        const unit = growthDurationMatch[2].toLowerCase()
        growthSpanDays = n * (unit === 'day' ? 1 : unit === 'week' ? 7 : unit === 'year' ? 365 : 30)
        periodLabel = `Last ${n} ${unit}${n > 1 ? 's' : ''}`
      } else if (/last\s*(7|seven)\s*days?|past\s*week|this\s*week/i.test(q)) {
        growthSpanDays = 7
        periodLabel = 'Last 7 days'
      } else {
        growthSpanDays = 30
        periodLabel = 'Last 30 days'
      }
      from = new Date(now); from.setDate(from.getDate() - growthSpanDays); from.setHours(0,0,0,0)
    } else if (monthNameMatch) {
      const monthIdx = MONTH_NAMES.indexOf(monthNameMatch[1].toLowerCase())
      const yearMatch = q.match(/\b(20\d{2})\b/)
      let year = yearMatch ? parseInt(yearMatch[1], 10) : now.getFullYear()
      // No year given and the named month hasn't happened yet this year (e.g. asking about
      // "July" in January) — assume the most recent past occurrence, i.e. last year's.
      if (!yearMatch && monthIdx > now.getMonth()) year -= 1
      from = new Date(year, monthIdx, 1); from.setHours(0, 0, 0, 0)
      to = new Date(year, monthIdx + 1, 0); to.setHours(23, 59, 59, 999)
      periodLabel = `${monthNameMatch[1][0].toUpperCase()}${monthNameMatch[1].slice(1).toLowerCase()} ${year}`
    } else if (/yesterday/.test(q)) {
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

    const [txRes, invRes, staffRes, custRes, debtorRes, anomalyRes, alertRes, forecastRes, healthRes, shiftRes, decisionRes, sourcesRes, mpesaRes, briefRes, locRes] = await Promise.all([
      // pos_transactions has TWO FKs to pos_staff (cashier_id, amended_by) — a bare `pos_staff(name)`
      // embed is ambiguous and PostgREST returns PGRST201 (data: null), silently zeroing every
      // period-scoped number below. Must disambiguate to the cashier relationship explicitly.
      service.from('pos_transactions').select('total,subtotal,discount_amount,status,payment_type,created_at,pos_location_id,pos_items(name,qty,unit_price,cost_price),pos_staff!cashier_id(name)').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).order('created_at', { ascending: false }).limit(200),
      service.from('inventory').select('name,stock_qty,low_stock_threshold,sale_price,cost_price,location_id').eq('owner_id', user.id).eq('active', true).order('stock_qty', { ascending: true }).limit(100),
      service.from('pos_staff').select('name,role,active').eq('owner_id', user.id),
      service.from('pos_customers').select('id,name,phone,total_spent,visit_count,last_seen_at').eq('owner_id', user.id).order('total_spent', { ascending: false }).limit(10),
      // Customers who owe money (deni/book-credit ledger cache column, indexed for this exact lookup)
      service.from('pos_customers').select('name,phone,balance_owed').eq('owner_id', user.id).neq('balance_owed', 0).order('balance_owed', { ascending: false }).limit(10),
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
    const debtors   = debtorRes.data || []
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
    // Include ALL inventory names so the AI can answer product-specific questions
    if (inv.length > 0) {
      posContext += `Inventory (${inv.length} products): ${(inv as any[]).slice(0, 60).map((i: any) => `${i.name} (stock:${i.stock_qty}${i.sale_price ? `, price:${finalSymbol}${i.sale_price}` : ''})`).join(', ')}.\n`
    }
    if (lowStock.length > 0) {
      posContext += `Low/out of stock (${lowStock.length} items): ${lowStock.slice(0, 10).map((i: any) => `${i.name} (${i.stock_qty} left)`).join(', ')}.\n`
    }
    // If this period has no transactions, add a broader 90-day window so the AI can answer historical questions
    // (skipped for growth queries — the dedicated comparison block below covers that case instead)
    if (completed.length === 0 && !isGrowthQuery) {
      const broad90From = new Date(now); broad90From.setDate(broad90From.getDate() - 90); broad90From.setHours(0, 0, 0, 0)
      const { data: broadTxs } = await service
        .from('pos_transactions')
        .select('total,status,created_at,pos_items(name,qty,unit_price)')
        .eq('owner_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', broad90From.toISOString())
        .order('created_at', { ascending: false })
        .limit(200)
      const broadCompleted = broadTxs || []
      if (broadCompleted.length > 0) {
        posContext += `\nNote: No transactions found for "${periodLabel}" but found ${broadCompleted.length} completed transactions in the last 90 days. `
        const broad90Revenue = broadCompleted.reduce((s: number, t: any) => s + t.total, 0)
        posContext += `90-day revenue: ${finalSymbol}${broad90Revenue.toFixed(2)}.\n`
        // Build product sales from broader window
        const broadProducts: Record<string, { qty: number; revenue: number }> = {}
        for (const t of broadCompleted) {
          for (const item of (t.pos_items || [])) {
            if (!broadProducts[item.name]) broadProducts[item.name] = { qty: 0, revenue: 0 }
            broadProducts[item.name].qty += item.qty
            broadProducts[item.name].revenue += item.qty * item.unit_price
          }
        }
        const topBroad = Object.entries(broadProducts).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5)
        if (topBroad.length > 0) {
          posContext += `Top products (last 90 days): ${topBroad.map(([name, s]) => `${name} (${s.qty} sold, ${finalSymbol}${s.revenue.toFixed(2)})`).join(', ')}.\n`
        }
      } else {
        posContext += `\nNote: No transactions found in pos_transactions for this user in the last 90 days. If sales were recorded via the POS, there may be a data sync issue.\n`
      }
    }
    // Early-month supplement: if "this month" has <50 transactions and we're in the first 7 days,
    // also pull last month so the AI can answer questions about recent history
    if (periodLabel === 'This month' && completed.length < 50 && now.getDate() <= 7) {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthName = lastMonthStart.toLocaleString('en', { month: 'long', year: 'numeric' })
      const { data: lastMonthTxs } = await service
        .from('pos_transactions')
        .select('total,status,created_at,pos_items(name,qty,unit_price)')
        .eq('owner_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', lastMonthStart.toISOString())
        .lt('created_at', lastMonthEnd.toISOString())
        .order('created_at', { ascending: false })
        .limit(300)
      const lmCompleted = lastMonthTxs || []
      if (lmCompleted.length > 0) {
        const lmRevenue = lmCompleted.reduce((s: number, t: any) => s + t.total, 0)
        const lmProducts: Record<string, { qty: number; revenue: number }> = {}
        for (const t of lmCompleted) {
          for (const item of (t.pos_items || [])) {
            if (!lmProducts[item.name]) lmProducts[item.name] = { qty: 0, revenue: 0 }
            lmProducts[item.name].qty += item.qty
            lmProducts[item.name].revenue += item.qty * item.unit_price
          }
        }
        const topLm = Object.entries(lmProducts).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 10)
        posContext += `\nLast month (${lastMonthName}): ${lmCompleted.length} completed transactions, ${finalSymbol}${lmRevenue.toFixed(2)} revenue.\n`
        if (topLm.length > 0) {
          posContext += `Last month top products: ${topLm.map(([name, s]) => `${name} (${s.qty} sold, ${finalSymbol}${s.revenue.toFixed(2)})`).join(', ')}.\n`
        }
      }
    }
    if (staffList.length > 0) {
      posContext += `Staff: ${(staffList as any[]).filter(s => s.active).map(s => `${s.name} (${s.role})`).join(', ')}.\n`
    }
    if (customers.length > 0) {
      posContext += `Top customers: ${customers.slice(0, 5).map((c: any) => `${c.name || c.phone || 'Anonymous'} (${finalSymbol}${(c.total_spent || 0).toFixed(2)} spent, ${c.visit_count || 0} visits)`).join(', ')}.\n`
    }
    if (debtors.length > 0) {
      const totalOwed = debtors.reduce((s: number, d: any) => s + (d.balance_owed || 0), 0)
      posContext += `CUSTOMER CREDIT (deni/book debt) — customers who owe money: ${finalSymbol}${totalOwed.toFixed(2)} total across ${debtors.length} customer(s): ${debtors.slice(0, 5).map((d: any) => `${d.name || d.phone || 'Anonymous'} (${finalSymbol}${(d.balance_owed || 0).toFixed(2)})`).join(', ')}.\n`
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

    // Growth / period-over-period comparison — deterministic calculation, not left for the LLM to eyeball
    if (isGrowthQuery && growthSpanDays > 0) {
      const compTo = new Date(from.getTime() - 1)
      const compFrom = new Date(compTo); compFrom.setDate(compFrom.getDate() - growthSpanDays); compFrom.setHours(0, 0, 0, 0)
      const { data: compTxs, error: compErr } = await service
        .from('pos_transactions')
        .select('total,status,created_at')
        .eq('owner_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', compFrom.toISOString())
        .lte('created_at', compTo.toISOString())
        .limit(500)
      if (compErr) console.error('Growth comparison query error:', compErr.message)
      const compCompleted = compTxs || []
      const compRevenue = compCompleted.reduce((s: number, t: any) => s + (t.total || 0), 0)
      const currentRevenue = revenue
      const currentCount = completed.length

      posContext += `\nGROWTH COMPARISON (${periodLabel} vs prior ${growthSpanDays}-day period, ${compFrom.toISOString().slice(0, 10)} to ${compTo.toISOString().slice(0, 10)}):\n`
      posContext += `Current period: ${finalSymbol}${currentRevenue.toFixed(2)} revenue, ${currentCount} transactions.\n`
      posContext += `Prior period: ${finalSymbol}${compRevenue.toFixed(2)} revenue, ${compCompleted.length} transactions.\n`

      if (compRevenue > 0) {
        const revChangePct = ((currentRevenue - compRevenue) / compRevenue) * 100
        posContext += `Revenue change: ${revChangePct >= 0 ? '+' : ''}${revChangePct.toFixed(1)}% ${revChangePct >= 0 ? 'growth' : 'decline'}.\n`
        posContext += `IMPORTANT: State this exact growth percentage and direction plainly in the answer. Use it as the primary kpi_card (label "Revenue Growth", value "${revChangePct >= 0 ? '+' : ''}${revChangePct.toFixed(1)}%", trend "${revChangePct >= 0 ? 'up' : 'down'}", status "${revChangePct >= 0 ? 'good' : 'warning'}"). Do not say there is insufficient data — the numbers above are the full calculation.\n`
      } else if (currentRevenue > 0) {
        posContext += `Revenue change: cannot compute a percentage (no revenue in the prior period), but the current period has ${finalSymbol}${currentRevenue.toFixed(2)} in new revenue versus zero before.\n`
        posContext += `IMPORTANT: State plainly that revenue went from ${finalSymbol}0 to ${finalSymbol}${currentRevenue.toFixed(2)} — describe this as new/first revenue in the period, not as "insufficient data".\n`
      } else {
        posContext += `Revenue change: no revenue recorded in either period — there is nothing to compare yet.\n`
        posContext += `IMPORTANT: State plainly that there were no transactions in either period, so growth cannot be measured yet. Do not invent a percentage.\n`
      }
    }

    // Expenses — query the real cfo_expenses tracker (manually-entered / receipt-scanned
    // business outgoings) for the resolved date window. Previously an expense question got
    // no expense data at all and the LLM either fabricated "expense tracking isn't available"
    // (false — it exists, this route just never queried it) or substituted irrelevant revenue
    // KPI cards. Deterministic, same pattern as the growth comparison above.
    if (isExpenseQuestion) {
      const expFrom = from.toISOString().slice(0, 10)
      const expTo = to.toISOString().slice(0, 10)
      const { data: expenseRows, error: expError } = await service
        .from('cfo_expenses')
        .select('vendor, date, amount, category')
        .eq('user_id', user.id)
        .gte('date', expFrom)
        .lte('date', expTo)
        .order('date', { ascending: false })
        .limit(500)
      if (expError) console.error('cfo_expenses query error:', expError.message)
      const expenses = expenseRows || []
      const totalExpenses = expenses.reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0)

      posContext += `\nEXPENSES (${periodLabel}):\n`
      if (expenses.length > 0) {
        const byCategory: Record<string, number> = {}
        for (const e of expenses as any[]) {
          const cat = e.category || 'Other'
          byCategory[cat] = (byCategory[cat] || 0) + (Number(e.amount) || 0)
        }
        posContext += `${expenses.length} recorded expense(s) totaling ${finalSymbol}${totalExpenses.toFixed(2)}.\n`
        posContext += `By category: ${Object.entries(byCategory).map(([c, v]) => `${c}: ${finalSymbol}${v.toFixed(2)}`).join(', ')}.\n`
        posContext += `IMPORTANT: State this exact total (${finalSymbol}${totalExpenses.toFixed(2)}) plainly as the answer. Use it as the primary kpi_card (label "Expenses (${periodLabel})", value "${finalSymbol}${totalExpenses.toFixed(2)}"). Do not substitute unrelated revenue or transaction-count figures for this — the user asked about expenses specifically.\n`
      } else {
        posContext += `No expenses recorded in the CFO Expenses tracker for ${periodLabel}.\n`
        posContext += `IMPORTANT: State plainly that no expenses are recorded for ${periodLabel} yet, and that they can add them from the CFO Expenses tab. This platform DOES track expenses (the feature exists) — do not claim expense tracking "isn't happening" or "isn't available", only that none are recorded for this specific period. Do NOT show unrelated revenue or transaction-count KPI cards as if they answer this expense question — omit kpi_cards/stat tiles entirely rather than substituting revenue figures.\n`
      }
    }

    // Receivables & payables — cfo_receivables (CFO dashboard's "who owes me / who do I owe"
    // tracker). Not date-windowed — these are live outstanding balances, not period transactions.
    if (isReceivablesQuestion) {
      const { data: recRows, error: recErr } = await service
        .from('cfo_receivables')
        .select('type, counterparty, amount, due_date, status')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })
        .limit(200)
      if (recErr) console.error('cfo_receivables query error:', recErr.message)
      const receivables = (recRows || []).filter((r: any) => r.type === 'receivable')
      const payables = (recRows || []).filter((r: any) => r.type === 'payable')
      const totalReceivable = receivables.reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0)
      const totalPayable = payables.reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0)
      const overdueReceivable = receivables.filter((r: any) => r.status && r.status !== 'current')

      posContext += `\nRECEIVABLES & PAYABLES (live balances, not period-scoped):\n`
      if (receivables.length > 0) {
        posContext += `Owed TO the business: ${finalSymbol}${totalReceivable.toFixed(2)} across ${receivables.length} invoice(s)${overdueReceivable.length > 0 ? `, ${overdueReceivable.length} overdue` : ''}: ${receivables.slice(0, 5).map((r: any) => `${r.counterparty} ${finalSymbol}${(Number(r.amount) || 0).toFixed(2)} (due ${r.due_date}${r.status !== 'current' ? `, ${r.status}` : ''})`).join(', ')}.\n`
      } else {
        posContext += `No receivables recorded.\n`
      }
      if (payables.length > 0) {
        posContext += `Owed BY the business: ${finalSymbol}${totalPayable.toFixed(2)} across ${payables.length} bill(s): ${payables.slice(0, 5).map((r: any) => `${r.counterparty} ${finalSymbol}${(Number(r.amount) || 0).toFixed(2)} (due ${r.due_date})`).join(', ')}.\n`
      } else {
        posContext += `No payables recorded.\n`
      }
      posContext += `IMPORTANT: Use these exact figures. "Who owes me" = receivables. "What do I owe" = payables. Do not confuse this with expenses or revenue.\n`
    }

    // Purchase orders — supplier ordering flow (create → send → receive → pay).
    if (isPurchaseOrderQuestion) {
      const { data: poRows, error: poErr } = await service
        .from('purchase_orders')
        .select('id, status, total_cost, expected_at, received_at, created_at, pos_suppliers(name)')
        .eq('owner_id', user.id)
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
        .order('created_at', { ascending: false })
        .limit(100)
      if (poErr) console.error('purchase_orders query error:', poErr.message)
      const pos = poRows || []
      const totalPoSpend = pos.reduce((s: number, p: any) => s + (Number(p.total_cost) || 0), 0)
      const byStatus: Record<string, number> = {}
      for (const p of pos as any[]) byStatus[p.status] = (byStatus[p.status] || 0) + 1

      posContext += `\nPURCHASE ORDERS (${periodLabel}):\n`
      if (pos.length > 0) {
        posContext += `${pos.length} purchase order(s) totaling ${finalSymbol}${totalPoSpend.toFixed(2)}. Status: ${Object.entries(byStatus).map(([s, c]) => `${c} ${s}`).join(', ')}.\n`
        const unpaid = pos.filter((p: any) => p.status !== 'received' && p.status !== 'cancelled')
        if (unpaid.length > 0) {
          posContext += `Still open: ${unpaid.slice(0, 5).map((p: any) => `${p.pos_suppliers?.name || 'Unknown supplier'} — ${finalSymbol}${(Number(p.total_cost) || 0).toFixed(2)} (${p.status})`).join(', ')}.\n`
        }
      } else {
        posContext += `No purchase orders in ${periodLabel}.\n`
      }

      // Line items for those POs — purchase_order_items has no owner_id of its own
      // (it inherits ownership through po_id), so it is fetched by the PO ids already
      // authorised above rather than by a direct owner filter.
      const poIds = (pos as any[]).map(p => p.id).filter(Boolean)
      if (poIds.length > 0) {
        const { data: poItemRows, error: poItemErr } = await service
          .from('purchase_order_items')
          .select('id, po_id, name, qty_ordered, qty_received, unit_cost, line_total, created_at')
          .in('po_id', poIds)
          .order('line_total', { ascending: false })
          .limit(500)
        if (poItemErr) console.error('purchase_order_items query error:', poItemErr.message)
        const poItems = poItemRows || []
        if (poItems.length > 0) {
          const poStatusById: Record<string, string> = {}
          for (const p of pos as any[]) poStatusById[p.id] = p.status
          const itemTotals: Record<string, { qty: number; spend: number }> = {}
          for (const it of poItems as any[]) {
            const key = it.name || 'Unnamed item'
            if (!itemTotals[key]) itemTotals[key] = { qty: 0, spend: 0 }
            itemTotals[key].qty += Number(it.qty_ordered) || 0
            itemTotals[key].spend += Number(it.line_total) || 0
          }
          const topOrdered = Object.entries(itemTotals).sort((a, b) => b[1].spend - a[1].spend).slice(0, 5)
          posContext += `Top ordered items: ${topOrdered.map(([name, t]) => `${name} (${t.qty} ordered, ${finalSymbol}${t.spend.toFixed(2)})`).join(', ')}.\n`

          // Only 'ordered'/'partial' POs can genuinely be "back-ordered" — status is
          // draft|ordered|partial|received|cancelled, and the earlier "still open" filter
          // (line ~1117) already excludes received/cancelled but NOT draft (never sent to the
          // supplier, so there's nothing to chase) — a plain "!== 'received'" check let both
          // draft and cancelled POs appear here despite there being no real shortfall to report.
          const backOrdered = (poItems as any[]).filter(it =>
            (Number(it.qty_received) || 0) < (Number(it.qty_ordered) || 0) &&
            (poStatusById[it.po_id] === 'ordered' || poStatusById[it.po_id] === 'partial')
          )
          if (backOrdered.length > 0) {
            const shortUnits = backOrdered.reduce((s: number, it: any) => s + ((Number(it.qty_ordered) || 0) - (Number(it.qty_received) || 0)), 0)
            posContext += `⚠ Back-ordered: ${backOrdered.length} line(s) short by ${shortUnits} unit(s) total: ${backOrdered.slice(0, 5).map((it: any) => `${it.name} (${Number(it.qty_received) || 0}/${Number(it.qty_ordered) || 0} received)`).join(', ')}.\n`
          }
        }
      }
      posContext += `IMPORTANT: This is supplier/restock spend, separate from cfo_expenses and separate from revenue — do not conflate them. State the exact item names and quantities above; do not estimate what was ordered.\n`
    }

    // Restaurant operations — covers, order mix, food waste, labour cost. Only relevant to
    // restaurant-type businesses; empty results are expected and fine for other business types.
    if (isRestaurantOpsQuestion) {
      const [ordRes, wasteRes, laborRes, menuRes, onlineRes, resvRes, delivRes] = await Promise.all([
        service.from('restaurant_orders').select('id, status, order_type, covers, total, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(500),
        service.from('restaurant_waste_log').select('item_name, qty, unit, total_cost, reason, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(200),
        service.from('restaurant_labor_shifts').select('role, total_hours, total_cost, clock_in').eq('owner_id', user.id).gte('clock_in', from.toISOString()).lte('clock_in', to.toISOString()).limit(200),
        // Menu — not date-windowed (a live menu, not a period event). Only sellable items.
        service.from('restaurant_menu_items').select('id, name, price, food_cost, station, available, eighty_sixed, created_at').eq('owner_id', user.id).eq('available', true).limit(300),
        service.from('restaurant_online_orders').select('id, status, customer_name, subtotal, total, requested_time, source, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(300),
        service.from('restaurant_reservations').select('id, customer_name, covers, reserved_at, duration_mins, status, created_at').eq('owner_id', user.id).gte('reserved_at', from.toISOString()).lte('reserved_at', to.toISOString()).limit(300),
        service.from('restaurant_deliveries').select('id, supplier_name, invoice_ref, delivery_date, currency, total_value, items_count, created_at').eq('owner_id', user.id).gte('delivery_date', from.toISOString().slice(0, 10)).lte('delivery_date', to.toISOString().slice(0, 10)).order('delivery_date', { ascending: false }).limit(200),
      ])
      if (ordRes.error) console.error('restaurant_orders query error:', ordRes.error.message)
      if (menuRes.error) console.error('restaurant_menu_items query error:', menuRes.error.message)
      if (onlineRes.error) console.error('restaurant_online_orders query error:', onlineRes.error.message)
      if (resvRes.error) console.error('restaurant_reservations query error:', resvRes.error.message)
      if (delivRes.error) console.error('restaurant_deliveries query error:', delivRes.error.message)
      const orders = ordRes.data || []
      const waste = wasteRes.data || []
      const labor = laborRes.data || []
      const menuItems = menuRes.data || []
      const onlineOrders = onlineRes.data || []
      const reservations = resvRes.data || []
      const deliveries = delivRes.data || []

      // Line items for the period's orders — restaurant_order_items DOES carry owner_id, but
      // scoping by the already-authorised order ids keeps it exactly aligned to the window above.
      // Excludes order-level 'void' (a walkout/comp'd table) — the item-level void check below only
      // catches individual voided items, not an entire order voided after the fact, which would
      // otherwise still count toward "top dishes by volume" despite never actually selling.
      const orderIds = (orders as any[]).filter(o => o.status !== 'void').map(o => o.id).filter(Boolean)
      let orderItems: any[] = []
      if (orderIds.length > 0) {
        const { data: oiRows, error: oiErr } = await service
          .from('restaurant_order_items')
          .select('id, order_id, menu_item_id, name, unit_price, food_cost, qty, status, course, created_at')
          .eq('owner_id', user.id)
          .in('order_id', orderIds)
          .order('created_at', { ascending: false })
          .limit(1000)
        if (oiErr) console.error('restaurant_order_items query error:', oiErr.message)
        orderItems = oiRows || []
      }

      if (orders.length > 0 || waste.length > 0 || labor.length > 0 || menuItems.length > 0 || onlineOrders.length > 0 || reservations.length > 0 || deliveries.length > 0) {
        posContext += `\nRESTAURANT OPERATIONS (${periodLabel}):\n`
        if (orders.length > 0) {
          const paidOrders = orders.filter((o: any) => o.status === 'paid')
          const totalCovers = paidOrders.reduce((s: number, o: any) => s + (o.covers || 0), 0)
          const totalOrderRevenue = paidOrders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0)
          const byType: Record<string, number> = {}
          for (const o of paidOrders as any[]) byType[o.order_type] = (byType[o.order_type] || 0) + 1
          posContext += `${paidOrders.length} paid order(s), ${totalCovers} covers, ${finalSymbol}${totalOrderRevenue.toFixed(2)} revenue. By type: ${Object.entries(byType).map(([t, c]) => `${c} ${t}`).join(', ')}.\n`
        }
        if (waste.length > 0) {
          const totalWasteCost = waste.reduce((s: number, w: any) => s + (Number(w.total_cost) || 0), 0)
          posContext += `Food waste: ${waste.length} log(s) totaling ${finalSymbol}${totalWasteCost.toFixed(2)}: ${waste.slice(0, 5).map((w: any) => `${w.item_name} (${w.qty}${w.unit}, ${w.reason || 'unspecified'})`).join(', ')}.\n`
        }
        if (labor.length > 0) {
          const totalLaborCost = labor.reduce((s: number, l: any) => s + (Number(l.total_cost) || 0), 0)
          posContext += `Labour: ${labor.length} shift(s), ${finalSymbol}${totalLaborCost.toFixed(2)} total cost.\n`
        }

        // Menu margin + 86'd items
        if (menuItems.length > 0) {
          // food_cost defaults to 0 in the schema, not null — an uncosted item and a genuinely
          // free-to-make item are indistinguishable, so require BOTH price and cost > 0. Without
          // this, every never-costed dish scores a false 100% margin and dominates "best margin".
          const priced = (menuItems as any[]).filter(m => Number(m.price) > 0 && Number(m.food_cost) > 0)
          const uncosted = menuItems.length - priced.length
          const withMargin = priced.map((m: any) => {
            const price = Number(m.price) || 0
            const cost = Number(m.food_cost) || 0
            return { name: m.name, price, cost, margin: price - cost, marginPct: price > 0 ? ((price - cost) / price) * 100 : 0 }
          })
          const avgMarginPct = withMargin.length > 0 ? withMargin.reduce((s, m) => s + m.marginPct, 0) / withMargin.length : 0
          const bestMargin = [...withMargin].sort((a, b) => b.marginPct - a.marginPct).slice(0, 3)
          const worstMargin = [...withMargin].sort((a, b) => a.marginPct - b.marginPct).slice(0, 3)
          posContext += `Menu: ${menuItems.length} available item(s)${uncosted > 0 ? ` (${uncosted} without a food cost recorded, excluded from margin below)` : ''}, average gross margin ${withMargin.length > 0 ? avgMarginPct.toFixed(1) + '%' : 'not available — no items have a recorded food cost'}.\n`
          if (bestMargin.length > 0) {
            posContext += `Best margin dishes: ${bestMargin.map(m => `${m.name} (${finalSymbol}${m.margin.toFixed(2)}, ${m.marginPct.toFixed(0)}%)`).join(', ')}. Worst: ${worstMargin.map(m => `${m.name} (${finalSymbol}${m.margin.toFixed(2)}, ${m.marginPct.toFixed(0)}%)`).join(', ')}.\n`
          }
          const eightySixed = (menuItems as any[]).filter(m => m.eighty_sixed)
          if (eightySixed.length > 0) {
            posContext += `⚠ 86'd right now (${eightySixed.length}): ${eightySixed.slice(0, 10).map((m: any) => m.name).join(', ')} — these cannot be sold until put back on.\n`
          }
          if (withMargin.length > 0) {
            posContext += `IMPORTANT: This menu margin is per-dish (price minus food cost), a different figure from the overall business profit margin computed elsewhere in this context — do not conflate the two or answer a dish-margin question with the business-wide number.\n`
          }
        }

        // Top-selling dishes by qty and by margin contribution
        if (orderItems.length > 0) {
          const dishStats: Record<string, { qty: number; revenue: number; cost: number; hasCost: boolean }> = {}
          for (const it of orderItems) {
            if (it.status === 'void') continue
            const key = it.name || 'Unnamed dish'
            if (!dishStats[key]) dishStats[key] = { qty: 0, revenue: 0, cost: 0, hasCost: false }
            const qty = Number(it.qty) || 0
            dishStats[key].qty += qty
            dishStats[key].revenue += qty * (Number(it.unit_price) || 0)
            dishStats[key].cost += qty * (Number(it.food_cost) || 0)
            // food_cost defaults to 0 in the schema, indistinguishable from "genuinely free" —
            // track whether ANY line for this dish actually recorded a cost, same reasoning as
            // the menu-item margin fix above, so an uncosted dish can't fake the top margin spot.
            if (Number(it.food_cost) > 0) dishStats[key].hasCost = true
          }
          const byQty = Object.entries(dishStats).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5)
          const byMargin = Object.entries(dishStats).filter(([, s]) => s.hasCost).sort((a, b) => (b[1].revenue - b[1].cost) - (a[1].revenue - a[1].cost)).slice(0, 5)
          posContext += `Top dishes by volume: ${byQty.map(([n, s]) => `${n} (${s.qty} sold, ${finalSymbol}${s.revenue.toFixed(2)})`).join(', ')}.\n`
          if (byMargin.length > 0) {
            posContext += `Top dishes by gross margin contribution (only dishes with a recorded food cost): ${byMargin.map(([n, s]) => `${n} (${finalSymbol}${(s.revenue - s.cost).toFixed(2)})`).join(', ')}.\n`
          }
          posContext += `IMPORTANT: "Best seller" by volume and "most profitable" are different lists above — answer whichever the user actually asked for, and never merge or re-rank them yourself.\n`
        }

        // Delivery-platform vs own-channel split. Excludes 'rejected' orders — that money was
        // never actually received. Note restaurant_online_orders.order_id links back to
        // restaurant_orders, so an accepted online order's total may ALSO already be counted in
        // "paid order(s) revenue" above once it's fulfilled — flagged explicitly below so the two
        // figures never get silently added together.
        const acceptedOnline = (onlineOrders as any[]).filter(o => o.status !== 'rejected')
        if (acceptedOnline.length > 0) {
          const bySource: Record<string, { count: number; revenue: number }> = {}
          for (const o of acceptedOnline) {
            const src = o.source || 'website'
            if (!bySource[src]) bySource[src] = { count: 0, revenue: 0 }
            bySource[src].count++
            bySource[src].revenue += Number(o.total) || 0
          }
          const onlineTotal = Object.values(bySource).reduce((s, v) => s + v.revenue, 0)
          posContext += `Online orders (${periodLabel}): ${acceptedOnline.length} order(s), ${finalSymbol}${onlineTotal.toFixed(2)}. By source: ${Object.entries(bySource).sort((a, b) => b[1].revenue - a[1].revenue).map(([s, v]) => `${s}: ${v.count} orders, ${finalSymbol}${v.revenue.toFixed(2)}`).join(', ')}.\n`
          const platformRevenue = Object.entries(bySource).filter(([s]) => s === 'uber_eats' || s === 'deliveroo' || s === 'just_eat').reduce((s, [, v]) => s + v.revenue, 0)
          const ownRevenue = onlineTotal - platformRevenue
          posContext += `Third-party delivery platforms: ${finalSymbol}${platformRevenue.toFixed(2)} vs own website/phone: ${finalSymbol}${ownRevenue.toFixed(2)}.\n`
          posContext += `IMPORTANT: Accepted online orders may also already appear in the paid-order revenue figure above once fulfilled — do not add these two revenue figures together as if they were separate income.\n`
        }

        // Reservations + no-show rate
        if (reservations.length > 0) {
          const byResvStatus: Record<string, number> = {}
          for (const r of reservations as any[]) byResvStatus[r.status || 'unknown'] = (byResvStatus[r.status || 'unknown'] || 0) + 1
          const resvCovers = (reservations as any[]).reduce((s: number, r: any) => s + (Number(r.covers) || 0), 0)
          posContext += `Reservations (${periodLabel}): ${reservations.length} booking(s) for ${resvCovers} covers. Status: ${Object.entries(byResvStatus).map(([s, c]) => `${c} ${s}`).join(', ')}.\n`
          // No-show rate against SETTLED reservations only (reserved_at already in the past) —
          // otherwise a window that includes future bookings (e.g. "this month" asked mid-month)
          // dilutes the rate with reservations that haven't happened yet and can't be a no-show.
          const settled = (reservations as any[]).filter(r => new Date(r.reserved_at) <= now)
          if (settled.length > 0) {
            const settledNoShows = settled.filter((r: any) => r.status === 'no_show').length
            const noShowPct = ((settledNoShows / settled.length) * 100).toFixed(1)
            posContext += `No-show rate (past reservations only, ${settled.length} of the ${reservations.length} above have actually happened): ${noShowPct}% (${settledNoShows} of ${settled.length}).\n`
            posContext += `IMPORTANT: State the no-show rate as exactly ${noShowPct}%, computed only from reservations whose date has passed — it is already computed, do not recalculate or round it differently, and do not include future/upcoming bookings in that percentage.\n`
          }
        }

        // Food-cost spend from the delivery-note scanner
        if (deliveries.length > 0) {
          const foodSpend = deliveries.reduce((s: number, d: any) => s + (Number(d.total_value) || 0), 0)
          const topSuppliers: Record<string, number> = {}
          for (const d of deliveries as any[]) topSuppliers[d.supplier_name || 'Unknown supplier'] = (topSuppliers[d.supplier_name || 'Unknown supplier'] || 0) + (Number(d.total_value) || 0)
          posContext += `Food-cost spend (scanned supplier deliveries, ${periodLabel}): ${finalSymbol}${foodSpend.toFixed(2)} across ${deliveries.length} delivery note(s). Top suppliers: ${Object.entries(topSuppliers).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n, v]) => `${n}: ${finalSymbol}${v.toFixed(2)}`).join(', ')}.\n`
          posContext += `IMPORTANT: This is scanned-invoice food-cost spend specifically — it may overlap with cfo_expenses, purchase_orders, or restaurant_waste_log figures elsewhere in this context if the same delivery was also logged there. Do not add this total to those without checking for overlap; if unsure, present it as its own figure.\n`
        }
      } else {
        posContext += `\nRESTAURANT OPERATIONS: No restaurant order/waste/labour/menu/reservation data for ${periodLabel} — this business may not use the restaurant module.\n`
      }

      // Cross-tenant ingredient price benchmark — only when the question is actually about
      // price/cost movement. ingredient_price_market is an anonymised k-anonymised VIEW
      // (n>=3 contributors, no owner_id), so it is safe to read without an owner filter.
      const wantsPriceTrend = isExpenseQuestion || /expensive|\bprice(s|d)?\b|\bcost(s|ing)?\b|\bcheaper\b|going up/i.test(q)
      if (wantsPriceTrend) {
        // Cross-reference to the ingredients this merchant actually buys/sells where we
        // cheaply can; otherwise fall back to the broadest recent rows for their region.
        const ownIngredients = Array.from(new Set([
          ...(waste as any[]).map(w => (w.item_name || '').toLowerCase().trim()),
          ...orderItems.map((i: any) => (i.name || '').toLowerCase().trim()),
        ].filter(n => n.length >= 3))).slice(0, 8)

        const baseIpmQuery = () => {
          let q2 = service
            .from('ingredient_price_market')
            .select('ingredient, category, unit, currency, region, period, data_points, p25, median, p75, avg_price, min_price, max_price')
            .order('period', { ascending: false })
            .limit(12)
          if (finalRegion) q2 = q2.ilike('region', `%${finalRegion}%`)
          return q2
        }
        let ipm: any[] = []
        let ipmErr: any = null
        if (ownIngredients.length > 0) {
          const { data, error } = await baseIpmQuery().in('ingredient', ownIngredients)
          ipmErr = error
          ipm = data || []
          // Scoping to the merchant's own ingredients can legitimately return nothing (their
          // ingredients just aren't in the k-anonymised pool yet) — fall back to the broadest
          // recent rows for their region rather than silently showing no benchmark at all.
          if (ipm.length === 0 && !error) {
            const { data: fallbackData, error: fallbackErr } = await baseIpmQuery()
            ipmErr = fallbackErr
            ipm = fallbackData || []
          }
        } else {
          const { data, error } = await baseIpmQuery()
          ipmErr = error
          ipm = data || []
        }
        if (ipmErr) console.error('ingredient_price_market query error:', ipmErr.message)
        if (ipm.length > 0) {
          posContext += `\nINGREDIENT PRICE BENCHMARK (anonymised cross-merchant view, minimum 3 contributors per row):\n`
          posContext += ipm.slice(0, 8).map((r: any) => `- ${r.ingredient} (${r.unit}, ${r.region || 'all regions'}, ${r.period}): median ${r.median != null ? r.currency + r.median : 'n/a'} [p25 ${r.p25 ?? 'n/a'} – p75 ${r.p75 ?? 'n/a'}], ${r.data_points} data points`).join('\n') + '\n'
          posContext += `IMPORTANT: This is a market comparison from other merchants, NOT this business's own spend. Never present these medians as what the user paid — the user's real spend is the food-cost/delivery figures above. Only use this to say whether they look above or below market.\n`
        }
      }
    }

    // Repair/service jobs — device repair intake through completion.
    if (isRepairJobQuestion) {
      const { data: jobRows, error: jobErr } = await service
        .from('pos_service_jobs')
        .select('id, status, quoted_price, created_at, updated_at')
        .eq('owner_id', user.id)
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
        .limit(200)
      if (jobErr) console.error('pos_service_jobs query error:', jobErr.message)
      const jobs = jobRows || []
      posContext += `\nREPAIR/SERVICE JOBS (${periodLabel}):\n`
      if (jobs.length > 0) {
        const byStatus: Record<string, number> = {}
        for (const j of jobs as any[]) byStatus[j.status] = (byStatus[j.status] || 0) + 1
        const completed = jobs.filter((j: any) => j.status === 'completed' || j.status === 'collected')
        const totalQuoted = completed.reduce((s: number, j: any) => s + (Number(j.quoted_price) || 0), 0)
        posContext += `${jobs.length} job(s). Status: ${Object.entries(byStatus).map(([s, c]) => `${c} ${s}`).join(', ')}. Completed jobs value: ${finalSymbol}${totalQuoted.toFixed(2)}.\n`

        // Parts consumed on COMPLETED jobs only — pos_service_parts has no owner_id (ownership is
        // inherited via job_id), so it is fetched by job id. Must match `completed`, not all `jobs`:
        // totalQuoted above only sums completed/collected jobs, so pulling parts from open jobs too
        // would subtract their cost from a quoted total that doesn't include them yet, producing
        // negative "labour" and >100% "parts" percentages on any shop with open jobs mid-repair.
        const jobIds = (completed as any[]).map(j => j.id).filter(Boolean)
        if (jobIds.length > 0) {
          const { data: partRows, error: partErr } = await service
            .from('pos_service_parts')
            .select('id, job_id, name, qty, unit_cost, line_total, created_at')
            .in('job_id', jobIds)
            .limit(500)
          if (partErr) console.error('pos_service_parts query error:', partErr.message)
          const parts = partRows || []
          if (parts.length > 0) {
            const partsTotal = parts.reduce((s: number, p: any) => s + (Number(p.line_total) || 0), 0)
            const labourTotal = totalQuoted - partsTotal
            const partsPct = totalQuoted > 0 ? ((partsTotal / totalQuoted) * 100).toFixed(1) : '0'
            const partTotals: Record<string, { qty: number; value: number }> = {}
            for (const p of parts as any[]) {
              const key = p.name || 'Unnamed part'
              if (!partTotals[key]) partTotals[key] = { qty: 0, value: 0 }
              partTotals[key].qty += Number(p.qty) || 0
              partTotals[key].value += Number(p.line_total) || 0
            }
            const topParts = Object.entries(partTotals).sort((a, b) => b[1].value - a[1].value).slice(0, 5)
            posContext += `Parts used on completed jobs: ${parts.length} line(s) worth ${finalSymbol}${partsTotal.toFixed(2)} — most used: ${topParts.map(([name, t]) => `${name} (${t.qty}×, ${finalSymbol}${t.value.toFixed(2)})`).join(', ')}.\n`
            posContext += `Parts vs labour split on completed jobs: parts ${finalSymbol}${partsTotal.toFixed(2)} (${partsPct}%), labour ${finalSymbol}${labourTotal.toFixed(2)} (${totalQuoted > 0 ? (100 - Number(partsPct)).toFixed(1) : '0'}%) of the ${finalSymbol}${totalQuoted.toFixed(2)} quoted total.\n`
            posContext += `IMPORTANT: Use this exact parts/labour split. "Labour" here is the quoted job value minus parts — say so plainly; do not present the quoted total as if it were all labour, and do not recompute these percentages yourself.\n`
          }
        }
      } else {
        posContext += `No repair/service jobs in ${periodLabel}.\n`
      }
    }

    // Logistics fleet — the user's own trucks/parcels/routes. Distinct from `shipments`
    // (inbound/outbound freight tracking) and from the parcel-quote intent (outbound rate shopping).
    if (isLogisticsFleetQuestion) {
      const [truckRes, parcelRes, routeRes, logInvRes] = await Promise.all([
        service.from('pos_trucks').select('plate_number, status').eq('owner_id', user.id).limit(100),
        service.from('pos_parcels').select('tracking_number, status, destination_city, fee_charged, payment_status, created_at').eq('owner_id', user.id).not('status', 'in', '("delivered","collected","returned")').order('created_at', { ascending: false }).limit(50),
        service.from('pos_routes').select('id, name, distance_km, price_per_kg, flat_rate, estimated_hours, active, created_at').eq('owner_id', user.id).eq('active', true).limit(100),
        // Fleet OPERATING COST (fuel/maintenance/tolls) — despite the "invoices" name these
        // are costs the business pays out, NOT receivables owed to it.
        service.from('pos_logistics_invoices').select('id, vendor_name, invoice_number, total_amount, currency, invoice_date, category, notes, created_at').eq('owner_id', user.id).gte('invoice_date', from.toISOString().slice(0, 10)).lte('invoice_date', to.toISOString().slice(0, 10)).order('invoice_date', { ascending: false }).limit(300),
      ])
      if (truckRes.error) console.error('pos_trucks query error:', truckRes.error.message)
      if (parcelRes.error) console.error('pos_parcels query error:', parcelRes.error.message)
      if (routeRes.error) console.error('pos_routes query error:', routeRes.error.message)
      if (logInvRes.error) console.error('pos_logistics_invoices query error:', logInvRes.error.message)
      const trucks = truckRes.data || []
      const activeParcels = parcelRes.data || []
      const routes = routeRes.data || []
      const logInvoices = logInvRes.data || []

      if (trucks.length > 0 || activeParcels.length > 0 || routes.length > 0 || logInvoices.length > 0) {
        posContext += `\nLOGISTICS FLEET:\n`
        if (trucks.length > 0) {
          const byTruckStatus: Record<string, number> = {}
          for (const t of trucks as any[]) byTruckStatus[t.status] = (byTruckStatus[t.status] || 0) + 1
          posContext += `${trucks.length} truck(s): ${Object.entries(byTruckStatus).map(([s, c]) => `${c} ${s}`).join(', ')}.\n`
        }
        if (activeParcels.length > 0) {
          const unpaidParcels = activeParcels.filter((p: any) => p.payment_status !== 'paid')
          posContext += `${activeParcels.length} parcel(s) not yet delivered: ${activeParcels.slice(0, 5).map((p: any) => `${p.tracking_number} (${p.status}${p.destination_city ? `, to ${p.destination_city}` : ''})`).join(', ')}.${unpaidParcels.length > 0 ? ` ${unpaidParcels.length} still unpaid.` : ''}\n`
        }
        if (routes.length > 0) {
          posContext += `${routes.length} active route(s): ${routes.slice(0, 6).map((r: any) => `${r.name || 'Unnamed route'} (${r.distance_km ? `${r.distance_km}km, ` : ''}${Number(r.flat_rate) > 0 ? `flat ${finalSymbol}${Number(r.flat_rate).toFixed(2)}` : `${finalSymbol}${(Number(r.price_per_kg) || 0).toFixed(2)}/kg`}${r.estimated_hours ? `, ~${r.estimated_hours}h` : ''})`).join(', ')}.\n`
        }
        if (logInvoices.length > 0) {
          const totalOpCost = logInvoices.reduce((s: number, i: any) => s + (Number(i.total_amount) || 0), 0)
          const byCategory: Record<string, number> = {}
          for (const i of logInvoices as any[]) {
            const cat = i.category || 'other'
            byCategory[cat] = (byCategory[cat] || 0) + (Number(i.total_amount) || 0)
          }
          posContext += `Fleet OPERATING COST (${periodLabel}): ${finalSymbol}${totalOpCost.toFixed(2)} across ${logInvoices.length} invoice(s). By category: ${Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([c, v]) => `${c}: ${finalSymbol}${v.toFixed(2)}`).join(', ')}.\n`
          posContext += `IMPORTANT: These logistics invoices are money the business PAYS OUT for running the fleet (fuel, maintenance, tolls, loading) — they are a real cost against fleet revenue, not receivables and not the same records as cfo_expenses. State the exact ${finalSymbol}${totalOpCost.toFixed(2)} figure; do not add it to cfo_expenses totals or you will double-count.\n`
        }
      } else {
        posContext += `\nLOGISTICS FLEET: No trucks, active parcels, routes or fleet invoices found — this business may not use the logistics module.\n`
      }
    }

    // Factory/manufacturing — batches, intake/output/wastage captures, dispatch waybills.
    // pos_factory_batches, pos_factory_captures and pos_factory_waybills are name-identical
    // between the root and pos-askbiz migration histories. The downtime/quality/shift tables
    // are NOT — they are differently NAMED per app (root: pos_factory_downtime/_quality/_shifts,
    // pos-askbiz: pos_factory_downtime_events/_quality_checks/_production_shifts). Both sets are
    // live against one shared database, and a given merchant's rows land in whichever pair the
    // app they used writes to, so both are queried and the results merged. Each query keeps its
    // own error check: if one table is absent in an environment, that query's `error` is set and
    // its `data` is null, and the other five still contribute — nothing throws.
    if (isFactoryQuestion) {
      const [batchRes, captureRes, waybillRes] = await Promise.all([
        service.from('pos_factory_batches').select('status, product_name, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(200),
        service.from('pos_factory_captures').select('type, quantity, product_name, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(300),
        service.from('pos_factory_waybills').select('destination, product_name, quantity, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(100),
      ])
      if (batchRes.error) console.error('pos_factory_batches query error:', batchRes.error.message)
      if (captureRes.error) console.error('pos_factory_captures query error:', captureRes.error.message)
      if (waybillRes.error) console.error('pos_factory_waybills query error:', waybillRes.error.message)
      const batches = batchRes.data || []
      const captures = captureRes.data || []
      const waybills = waybillRes.data || []

      // Naming-divergent pairs — root-named table and pos-askbiz-named table queried together
      // and merged. Same owner_id column on both sides, similar shape.
      const [dtRootRes, dtPosRes, qcRootRes, qcPosRes, shRootRes, shPosRes] = await Promise.all([
        // root-side
        service.from('pos_factory_downtime').select('id, machine_name, reason, started_at, ended_at, duration_minutes').eq('owner_id', user.id).gte('started_at', from.toISOString()).lte('started_at', to.toISOString()).limit(200),
        // pos-askbiz-side
        service.from('pos_factory_downtime_events').select('id, machine_name, reason, status, started_at, ended_at, duration_minutes').eq('owner_id', user.id).gte('started_at', from.toISOString()).lte('started_at', to.toISOString()).limit(200),
        // root-side
        service.from('pos_factory_quality').select('id, defect_type, severity, product_name, quantity_affected, status, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(200),
        // pos-askbiz-side
        service.from('pos_factory_quality_checks').select('id, outcome, defect_type, severity, quantity_affected, product_name, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(200),
        // root-side (no target/actual output columns on this one — count and duration only)
        service.from('pos_factory_shifts').select('id, shift_name, started_at, duration_minutes').eq('owner_id', user.id).gte('started_at', from.toISOString()).lte('started_at', to.toISOString()).limit(200),
        // pos-askbiz-side
        // duration_minutes exists on this table too (pos-askbiz's own factory_production_shifts
        // migration) — omitting it here meant a pos-askbiz-only merchant's logged hours were
        // silently dropped from the merged sum below (root-side rows would contribute, theirs never would).
        service.from('pos_factory_production_shifts').select('id, shift_name, target_units, actual_output, duration_minutes, status, started_at').eq('owner_id', user.id).gte('started_at', from.toISOString()).lte('started_at', to.toISOString()).limit(200),
      ])
      if (dtRootRes.error) console.error('pos_factory_downtime query error:', dtRootRes.error.message)
      if (dtPosRes.error) console.error('pos_factory_downtime_events query error:', dtPosRes.error.message)
      if (qcRootRes.error) console.error('pos_factory_quality query error:', qcRootRes.error.message)
      if (qcPosRes.error) console.error('pos_factory_quality_checks query error:', qcPosRes.error.message)
      if (shRootRes.error) console.error('pos_factory_shifts query error:', shRootRes.error.message)
      if (shPosRes.error) console.error('pos_factory_production_shifts query error:', shPosRes.error.message)

      const downtime: any[] = [...(dtRootRes.data || []), ...(dtPosRes.data || [])]
      const quality: any[] = [...(qcRootRes.data || []), ...(qcPosRes.data || [])]
      const prodShifts: any[] = [...(shRootRes.data || []), ...(shPosRes.data || [])]

      if (batches.length > 0 || captures.length > 0 || waybills.length > 0 || downtime.length > 0 || quality.length > 0 || prodShifts.length > 0) {
        posContext += `\nFACTORY / PRODUCTION (${periodLabel}):\n`
        if (batches.length > 0) {
          const byBatchStatus: Record<string, number> = {}
          for (const b of batches as any[]) byBatchStatus[b.status] = (byBatchStatus[b.status] || 0) + 1
          posContext += `${batches.length} batch(es): ${Object.entries(byBatchStatus).map(([s, c]) => `${c} ${s}`).join(', ')}.\n`
        }
        if (captures.length > 0) {
          const byType: Record<string, number> = {}
          const qtyByType: Record<string, number> = {}
          for (const c of captures as any[]) {
            byType[c.type] = (byType[c.type] || 0) + 1
            qtyByType[c.type] = (qtyByType[c.type] || 0) + (Number(c.quantity) || 0)
          }
          posContext += `Production captures: ${Object.entries(byType).map(([t, c]) => `${c} ${t}${qtyByType[t] ? ` (${qtyByType[t]} units)` : ''}`).join(', ')}.\n`
          if (qtyByType.wastage > 0) posContext += `⚠ Wastage recorded: ${qtyByType.wastage} units across ${byType.wastage} log(s).\n`
        }
        if (waybills.length > 0) {
          posContext += `${waybills.length} dispatch waybill(s) totaling ${waybills.reduce((s: number, w: any) => s + (Number(w.quantity) || 0), 0)} units.\n`
        }
        if (downtime.length > 0) {
          const totalDowntimeMins = downtime.reduce((s: number, d: any) => s + (Number(d.duration_minutes) || 0), 0)
          const stillOpen = downtime.filter((d: any) => !d.ended_at).length
          const byReason: Record<string, number> = {}
          for (const d of downtime) byReason[d.reason || 'other'] = (byReason[d.reason || 'other'] || 0) + (Number(d.duration_minutes) || 0)
          const byMachine: Record<string, number> = {}
          for (const d of downtime) byMachine[d.machine_name || 'Unnamed machine'] = (byMachine[d.machine_name || 'Unnamed machine'] || 0) + (Number(d.duration_minutes) || 0)
          const worstMachine = Object.entries(byMachine).sort((a, b) => b[1] - a[1])[0]
          posContext += `Downtime: ${downtime.length} event(s), ${totalDowntimeMins.toFixed(0)} minutes total (${(totalDowntimeMins / 60).toFixed(1)} hours)${stillOpen > 0 ? `, ${stillOpen} still open (duration not yet counted)` : ''}. By reason: ${Object.entries(byReason).sort((a, b) => b[1] - a[1]).map(([r, m]) => `${r}: ${m.toFixed(0)}min`).join(', ')}.\n`
          if (worstMachine) posContext += `Worst machine: ${worstMachine[0]} with ${worstMachine[1].toFixed(0)} minutes lost.\n`
        }
        if (quality.length > 0) {
          // 'outcome' only exists on the pos-askbiz side; a root-side row is always a logged defect
          // (049_factory_quality.sql has no 'outcome' column at all — every row IS a defect log, not
          // a pass/fail check). That means fails.length === quality.length on root data by construction,
          // so a "fail rate" here is structurally always ~100% and meaningless — report counts only,
          // never a rate, unless a real produced-units denominator (captures/shift output) is added.
          const fails = quality.filter((r: any) => r.outcome ? r.outcome === 'fail' : true)
          const affected = fails.reduce((s: number, r: any) => s + (Number(r.quantity_affected) || 0), 0)
          const bySeverity: Record<string, number> = {}
          for (const r of fails) bySeverity[r.severity || 'unspecified'] = (bySeverity[r.severity || 'unspecified'] || 0) + 1
          const openIssues = quality.filter((r: any) => r.status === 'open').length
          posContext += `Quality: ${quality.length} defect log(s), ${affected} unit(s) affected. Severity: ${Object.entries(bySeverity).map(([s, c]) => `${c} ${s}`).join(', ')}.${openIssues > 0 ? ` ${openIssues} still open.` : ''}\n`
        }
        if (prodShifts.length > 0) {
          const withOutput = prodShifts.filter((s: any) => s.actual_output != null)
          const totalOutput = withOutput.reduce((s: number, sh: any) => s + (Number(sh.actual_output) || 0), 0)
          const totalTarget = prodShifts.filter((s: any) => s.target_units != null).reduce((s: number, sh: any) => s + (Number(sh.target_units) || 0), 0)
          const shiftMins = prodShifts.reduce((s: number, sh: any) => s + (Number(sh.duration_minutes) || 0), 0)
          posContext += `Production shifts: ${prodShifts.length} shift(s)${shiftMins > 0 ? `, ${(shiftMins / 60).toFixed(1)} hours logged` : ''}${withOutput.length > 0 ? `, ${totalOutput} units produced across ${withOutput.length} shift(s) with recorded output` : ''}${totalTarget > 0 ? ` against a ${totalTarget}-unit target (${((totalOutput / totalTarget) * 100).toFixed(0)}% of target)` : ''}.\n`
        }
        if (downtime.length > 0 || quality.length > 0 || prodShifts.length > 0) {
          posContext += `IMPORTANT: The downtime, quality and shift figures above are already totalled across every production log this business has — state them exactly as given. Do not describe any of them as unavailable, and do not estimate output or downtime from batch counts.\n`
        }
      } else {
        posContext += `\nFACTORY / PRODUCTION: No batch/capture/waybill/downtime/quality/shift data for ${periodLabel} — this business may not use the factory module.\n`
      }
    }

    // Salon appointments/bookings.
    if (isSalonQuestion) {
      const { data: apptRows, error: apptErr } = await service
        .from('salon_appointments')
        .select('service_name, scheduled_at, price, status')
        .eq('owner_id', user.id)
        .gte('scheduled_at', from.toISOString())
        .lte('scheduled_at', to.toISOString())
        .order('scheduled_at', { ascending: false })
        .limit(200)
      if (apptErr) console.error('salon_appointments query error:', apptErr.message)
      const appts = apptRows || []
      posContext += `\nSALON APPOINTMENTS (${periodLabel}):\n`
      let salonServiceRevenue = 0
      if (appts.length > 0) {
        const completed = appts.filter((a: any) => a.status === 'completed')
        const noShows = appts.filter((a: any) => a.status === 'no_show')
        const totalRevenue = completed.reduce((s: number, a: any) => s + (Number(a.price) || 0), 0)
        salonServiceRevenue = totalRevenue
        posContext += `${appts.length} appointment(s), ${completed.length} completed (${finalSymbol}${totalRevenue.toFixed(2)}), ${noShows.length} no-show(s).\n`
      } else {
        posContext += `No salon appointments in ${periodLabel}.\n`
      }

      // Product cost per service + lapsed high-value clients. Product usage IS date-windowed;
      // the client list deliberately is NOT — a lapsed client is defined by absence, so
      // windowing it would hide exactly the people the merchant needs to see.
      const lapsedCutoff = new Date(now); lapsedCutoff.setDate(lapsedCutoff.getDate() - 60)
      const [usageRes, clientRes] = await Promise.all([
        service.from('salon_product_usage').select('id, appointment_id, client_id, product_name, amount_used, unit, cost, service_name, created_at').eq('owner_id', user.id).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()).limit(500),
        // .or() so clients who have NEVER visited (last_visit_at is null) aren't silently dropped —
        // a plain .lt() comparison excludes nulls in SQL, which would hide exactly the clients most
        // overdue for a win-back message.
        service.from('salon_clients').select('id, name, phone, total_visits, total_spend, last_visit_at').eq('owner_id', user.id).or(`last_visit_at.is.null,last_visit_at.lt.${lapsedCutoff.toISOString()}`).order('total_spend', { ascending: false }).limit(20),
      ])
      if (usageRes.error) console.error('salon_product_usage query error:', usageRes.error.message)
      if (clientRes.error) console.error('salon_clients query error:', clientRes.error.message)
      const productUsage = usageRes.data || []
      const lapsedClients = clientRes.data || []

      if (productUsage.length > 0) {
        const totalProductCost = productUsage.reduce((s: number, u: any) => s + (Number(u.cost) || 0), 0)
        const byProduct: Record<string, number> = {}
        for (const u of productUsage as any[]) byProduct[u.product_name || 'Unnamed product'] = (byProduct[u.product_name || 'Unnamed product'] || 0) + (Number(u.cost) || 0)
        posContext += `Product cost consumed (${periodLabel}): ${finalSymbol}${totalProductCost.toFixed(2)} across ${productUsage.length} usage log(s). Biggest: ${Object.entries(byProduct).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n, v]) => `${n}: ${finalSymbol}${v.toFixed(2)}`).join(', ')}.\n`
        // Only claim a "real service margin" when there's completed-appointment revenue to net it
        // against — with zero completed appointments this would print a negative margin at "0%",
        // internally contradictory, for a period that simply hasn't had a finished appointment yet.
        if (salonServiceRevenue > 0) {
          const serviceMargin = salonServiceRevenue - totalProductCost
          const marginPctSalon = ((serviceMargin / salonServiceRevenue) * 100).toFixed(1)
          posContext += `REAL SERVICE MARGIN: ${finalSymbol}${salonServiceRevenue.toFixed(2)} completed-appointment revenue − ${finalSymbol}${totalProductCost.toFixed(2)} product cost = ${finalSymbol}${serviceMargin.toFixed(2)} (${marginPctSalon}%).\n`
          posContext += `IMPORTANT: When asked what the salon actually makes, quote the ${finalSymbol}${serviceMargin.toFixed(2)} margin figure, not the raw appointment revenue — product cost is already deducted above. Do not recompute it.\n`
        }
      }
      if (lapsedClients.length > 0) {
        const lapsedValue = lapsedClients.reduce((s: number, c: any) => s + (Number(c.total_spend) || 0), 0)
        posContext += `LAPSED CLIENTS (no visit in 60+ days, highest lifetime spend first): ${lapsedClients.length} client(s) worth ${finalSymbol}${lapsedValue.toFixed(2)} lifetime: ${lapsedClients.slice(0, 8).map((c: any) => `${c.name || c.phone || 'Unnamed'} (${finalSymbol}${(Number(c.total_spend) || 0).toFixed(2)}, ${c.total_visits || 0} visits, last seen ${c.last_visit_at ? new Date(c.last_visit_at).toLocaleDateString() : 'never'})`).join(', ')}.\n`
        posContext += `IMPORTANT: These are win-back targets, listed highest-value first. Name the actual clients above — do not generalise to "some clients haven't returned".\n`
      }
    }

    // Payment issues — failed/pending payment links and dunning. Distinct from mpesa_payments
    // (subscription billing) — this is customer-sale payment collection.
    if (isPaymentIssuesQuestion) {
      const { data: payRows, error: payErr } = await service
        .from('pos_payments')
        .select('amount, status, payment_method, error_message, created_at')
        .eq('owner_id', user.id)
        .in('status', ['pending', 'failed'])
        .order('created_at', { ascending: false })
        .limit(100)
      if (payErr) console.error('pos_payments query error:', payErr.message)
      const stuckPayments = payRows || []
      posContext += `\nSTUCK/FAILED PAYMENTS (current, not period-scoped):\n`
      if (stuckPayments.length > 0) {
        const totalStuck = stuckPayments.reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0)
        const failed = stuckPayments.filter((p: any) => p.status === 'failed')
        posContext += `${stuckPayments.length} payment(s) totaling ${finalSymbol}${totalStuck.toFixed(2)} stuck (${failed.length} failed, ${stuckPayments.length - failed.length} pending).\n`
      } else {
        posContext += `No stuck or failed payments right now.\n`
      }

      // Direct debit (GoCardless) — a completely separate rail from the POS card/link payments
      // above. Only non-settled states are pulled; 'confirmed'/'paid_out' money is already banked.
      const { data: ddRows, error: ddErr } = await service
        .from('gocardless_payments')
        .select('payment_id, mandate_id, amount, currency, status, charge_date, description')
        .eq('user_id', user.id)
        .in('status', ['pending_submission', 'submitted', 'failed', 'cancelled'])
        .order('charge_date', { ascending: false })
        .limit(100)
      if (ddErr) console.error('gocardless_payments query error:', ddErr.message)
      const directDebits = ddRows || []
      // Explicitly labelled all-time/not-period-scoped — unlike an arbitrary lookback cutoff, this
      // doesn't risk hiding a genuinely still-unresolved old failure, but the model must say so
      // rather than presenting a stale figure as if it reflects the requested period.
      posContext += `\nDIRECT DEBIT COLLECTIONS (GoCardless, all-time/not period-scoped — separate from the POS card/link payments above):\n`
      if (directDebits.length > 0) {
        const ddTotal = directDebits.reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0)
        const byDdStatus: Record<string, { count: number; amount: number }> = {}
        for (const p of directDebits as any[]) {
          const st = p.status || 'unknown'
          if (!byDdStatus[st]) byDdStatus[st] = { count: 0, amount: 0 }
          byDdStatus[st].count++
          byDdStatus[st].amount += Number(p.amount) || 0
        }
        const ddFailed = (byDdStatus['failed']?.amount || 0) + (byDdStatus['cancelled']?.amount || 0)
        posContext += `${directDebits.length} unsettled direct debit(s) totaling ${finalSymbol}${ddTotal.toFixed(2)}. By status: ${Object.entries(byDdStatus).map(([s, v]) => `${s}: ${v.count} (${finalSymbol}${v.amount.toFixed(2)})`).join(', ')}.\n`
        if (ddFailed > 0) posContext += `⚠ ${finalSymbol}${ddFailed.toFixed(2)} failed or cancelled and will not arrive without re-collection.\n`
        posContext += `IMPORTANT: These are all-time, not scoped to ${periodLabel}. Keep these direct debit figures separate from the POS payment figures above — they are different payment rails and must never be added together into one "failed payments" total.\n`
      } else {
        posContext += `No unsettled GoCardless direct debits (nothing pending, submitted, failed or cancelled).\n`
        posContext += `IMPORTANT: Keep this separate from the POS payment figures above even when both are empty — they are different payment rails.\n`
      }
    }

    // Stocktake / shrinkage variance.
    if (isStocktakeQuestion) {
      const { data: adjRows, error: adjErr } = await service
        .from('pos_stock_adjustments')
        .select('product_name, system_qty, counted_qty, variance, variance_value, reason, session_ref, created_at')
        .eq('owner_id', user.id)
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
        .order('created_at', { ascending: false })
        .limit(200)
      if (adjErr) console.error('pos_stock_adjustments query error:', adjErr.message)
      const adjustments = adjRows || []
      posContext += `\nSTOCKTAKE / SHRINKAGE (${periodLabel}):\n`
      if (adjustments.length > 0) {
        const totalVarianceValue = adjustments.reduce((s: number, a: any) => s + (Number(a.variance_value) || 0), 0)
        const sessions = new Set(adjustments.map((a: any) => a.session_ref).filter(Boolean)).size
        posContext += `${adjustments.length} item(s) counted across ${sessions || 1} session(s), net variance value ${finalSymbol}${totalVarianceValue.toFixed(2)} (negative = shrinkage/loss).\n`
        const biggestLosses = adjustments.filter((a: any) => a.variance_value < 0).sort((a: any, b: any) => a.variance_value - b.variance_value).slice(0, 5)
        if (biggestLosses.length > 0) {
          posContext += `Biggest losses: ${biggestLosses.map((a: any) => `${a.product_name} (${finalSymbol}${Math.abs(a.variance_value).toFixed(2)})`).join(', ')}.\n`
        }
      } else {
        posContext += `No stocktake sessions recorded in ${periodLabel}.\n`
      }
    }

    // Zakat — most recent saved calculation, if any. Not date-windowed (a point-in-time calc).
    if (isZakatQuestion) {
      const { data: zakatRow, error: zakatErr } = await service
        .from('zakat_calculations')
        .select('calculated_at, cash_value, inventory_value, receivables_value, zakat_base, nisab_value, amount_due, currency')
        .eq('owner_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (zakatErr) console.error('zakat_calculations query error:', zakatErr.message)
      posContext += `\nZAKAT:\n`
      if (zakatRow) {
        posContext += `Most recent calculation (${new Date(zakatRow.calculated_at).toLocaleDateString()}): zakat base ${zakatRow.currency}${(Number(zakatRow.zakat_base) || 0).toFixed(2)}, nisab ${zakatRow.currency}${(Number(zakatRow.nisab_value) || 0).toFixed(2)}, amount due ${zakatRow.currency}${(Number(zakatRow.amount_due) || 0).toFixed(2)}.\n`
        posContext += `IMPORTANT: State this saved figure plainly rather than saying no calculation exists.\n`
      } else {
        posContext += `No saved zakat calculation found. Suggest using the Zakat Calculator in the Intelligence tab.\n`
      }
    }

    // Tax filings — VAT/turnover returns. Deliberately NOT scoped to the resolved from/to:
    // filings are periodic documents, so the most recent few are always the relevant ones
    // regardless of what date window the question implied.
    if (isTaxQuestion) {
      const { data: filingRows, error: filingErr } = await service
        .from('pos_tax_filings')
        .select('jurisdiction, filing_period_start, filing_period_end, total_turnover, total_tax_due, tax_paid, net_due, status, submitted_at, submitted_to, filing_reference')
        .eq('owner_id', user.id)
        .order('filing_period_end', { ascending: false })
        .limit(20)
      if (filingErr) console.error('pos_tax_filings query error:', filingErr.message)
      const filings = filingRows || []
      posContext += `\nTAX FILINGS (20 most recent, not period-scoped):\n`
      if (filings.length > 0) {
        posContext += filings.slice(0, 5).map((f: any) => `- ${f.jurisdiction} ${f.filing_period_start} → ${f.filing_period_end}: turnover ${finalSymbol}${(Number(f.total_turnover) || 0).toFixed(2)}, tax due ${finalSymbol}${(Number(f.total_tax_due) || 0).toFixed(2)}, paid ${finalSymbol}${(Number(f.tax_paid) || 0).toFixed(2)}, NET DUE ${finalSymbol}${(Number(f.net_due) || 0).toFixed(2)} [${f.status}${f.filing_reference ? `, ref ${f.filing_reference}` : ''}]`).join('\n') + '\n'
        const drafts = filings.filter((f: any) => f.status === 'draft')
        const rejected = filings.filter((f: any) => f.status === 'rejected')
        // "Still owed" = draft + submitted (awaiting the merchant's action or the authority's
        // decision). 'rejected' filings are deliberately excluded and called out separately —
        // a rejected filing needs correcting/resubmitting, its net_due isn't a reliable current
        // liability figure the way an open draft/submitted one is.
        const totalNetDue = filings.filter((f: any) => f.status === 'draft' || f.status === 'submitted').reduce((s: number, f: any) => s + (Number(f.net_due) || 0), 0)
        if (drafts.length > 0) {
          posContext += `⚠ ${drafts.length} filing(s) still in DRAFT and not submitted: ${drafts.map((f: any) => `${f.jurisdiction} ${f.filing_period_start}–${f.filing_period_end} (${finalSymbol}${(Number(f.net_due) || 0).toFixed(2)} net due)`).join(', ')}.\n`
        }
        if (rejected.length > 0) {
          posContext += `⚠ ${rejected.length} filing(s) REJECTED and need correcting/resubmitting: ${rejected.map((f: any) => `${f.jurisdiction} ${f.filing_period_start}–${f.filing_period_end}`).join(', ')}.\n`
        }
        posContext += `Total net due across draft/submitted filings (excludes rejected — see above): ${finalSymbol}${totalNetDue.toFixed(2)}.\n`
        posContext += `IMPORTANT: Quote these exact filing figures. Net due is what is still owed — do not recompute tax from revenue or margin figures elsewhere in this context, do not fold rejected filings into "still owed", and do not give tax advice beyond what these records state.\n`
      } else {
        posContext += `No tax filings recorded yet.\n`
        posContext += `IMPORTANT: State plainly that no filings are saved yet. Do NOT substitute revenue or expense figures as if they answered a tax question, and do not estimate a tax liability.\n`
      }
    }

    // Website analytics (ga_sessions) — record_date is a DATE column, so the window is
    // sliced to YYYY-MM-DD rather than passed as a full ISO timestamp.
    if (isTrafficQuestion) {
      const { data: gaRows, error: gaErr } = await service
        .from('ga_sessions')
        .select('record_date, channel, sessions, users, conversions, conversion_rate, bounce_rate, avg_session_secs, revenue, currency')
        .eq('user_id', user.id)
        .gte('record_date', from.toISOString().slice(0, 10))
        .lte('record_date', to.toISOString().slice(0, 10))
        .order('record_date', { ascending: false })
        .limit(3000)
      if (gaErr) console.error('ga_sessions query error:', gaErr.message)
      const ga = gaRows || []
      posContext += `\nWEBSITE TRAFFIC (${periodLabel}):\n`
      if (ga.length > 0) {
        const totalSessions = ga.reduce((s: number, r: any) => s + (Number(r.sessions) || 0), 0)
        const totalUsers = ga.reduce((s: number, r: any) => s + (Number(r.users) || 0), 0)
        const totalConversions = ga.reduce((s: number, r: any) => s + (Number(r.conversions) || 0), 0)
        const totalGaRevenue = ga.reduce((s: number, r: any) => s + (Number(r.revenue) || 0), 0)
        const overallCvr = totalSessions > 0 ? ((totalConversions / totalSessions) * 100).toFixed(2) : '0.00'
        // Session-weighted, not a plain average of daily rates — a day with 5 sessions shouldn't
        // count the same as a day with 5,000. bounce_rate/avg_session_secs were being fetched and
        // never used, despite isTrafficQuestion explicitly matching "bounce rate" as a trigger phrase.
        const weightedBounce = totalSessions > 0 ? ga.reduce((s: number, r: any) => s + (Number(r.bounce_rate) || 0) * (Number(r.sessions) || 0), 0) / totalSessions : 0
        const weightedAvgSecs = totalSessions > 0 ? ga.reduce((s: number, r: any) => s + (Number(r.avg_session_secs) || 0) * (Number(r.sessions) || 0), 0) / totalSessions : 0

        const byChannel: Record<string, { sessions: number; conversions: number; revenue: number }> = {}
        for (const r of ga as any[]) {
          const ch = r.channel || 'unassigned'
          if (!byChannel[ch]) byChannel[ch] = { sessions: 0, conversions: 0, revenue: 0 }
          byChannel[ch].sessions += Number(r.sessions) || 0
          byChannel[ch].conversions += Number(r.conversions) || 0
          byChannel[ch].revenue += Number(r.revenue) || 0
        }
        const channelRows = Object.entries(byChannel).map(([ch, v]) => ({
          channel: ch,
          ...v,
          cvr: v.sessions > 0 ? (v.conversions / v.sessions) * 100 : 0,
        })).sort((a, b) => b.sessions - a.sessions)
        const bestCvr = [...channelRows].filter(c => c.sessions > 0).sort((a, b) => b.cvr - a.cvr)[0]

        posContext += `${totalSessions} session(s) from ${totalUsers} user(s), ${totalConversions} conversion(s) (${overallCvr}% overall conversion rate)${totalGaRevenue > 0 ? `, ${finalSymbol}${totalGaRevenue.toFixed(2)} attributed revenue` : ''}.\n`
        posContext += `Bounce rate: ${weightedBounce.toFixed(1)}%. Avg session length: ${(weightedAvgSecs / 60).toFixed(1)} min.\n`
        posContext += `By channel: ${channelRows.slice(0, 8).map(c => `${c.channel}: ${c.sessions} sessions, ${c.conversions} conv (${c.cvr.toFixed(2)}%)`).join(', ')}.\n`
        if (bestCvr) {
          posContext += `Best-converting channel: ${bestCvr.channel} at ${bestCvr.cvr.toFixed(2)}% (${bestCvr.conversions} conversions from ${bestCvr.sessions} sessions).\n`
        }
        posContext += `IMPORTANT: These are website analytics, not POS sales — do not mix session counts with transaction counts, or GA revenue with POS revenue. State the exact conversion rates above; they are already calculated.\n`
      } else {
        posContext += `No website analytics recorded for ${periodLabel} — Google Analytics may not be connected.\n`
        posContext += `IMPORTANT: Say plainly that no traffic data exists for this period. Do NOT substitute POS transaction counts as if they were website sessions.\n`
      }
    }

    // Email marketing campaigns (Mailchimp + Klaviyo share one table, keyed by source_type).
    if (isMarketingQuestion) {
      const { data: campRows, error: campErr } = await service
        .from('email_campaigns')
        .select('source_type, campaign_name, sent_at, recipients, opens, open_rate, clicks, click_rate, unsubscribes, revenue, currency')
        .eq('user_id', user.id)
        .gte('sent_at', from.toISOString())
        .lte('sent_at', to.toISOString())
        .order('sent_at', { ascending: false })
        .limit(50)
      if (campErr) console.error('email_campaigns query error:', campErr.message)
      const campaigns = campRows || []
      posContext += `\nEMAIL CAMPAIGNS (${periodLabel}):\n`
      if (campaigns.length > 0) {
        const totalRecipients = campaigns.reduce((s: number, c: any) => s + (Number(c.recipients) || 0), 0)
        const totalCampRevenue = campaigns.reduce((s: number, c: any) => s + (Number(c.revenue) || 0), 0)
        const totalUnsubs = campaigns.reduce((s: number, c: any) => s + (Number(c.unsubscribes) || 0), 0)
        // Weighted average of the PLATFORM's own open_rate/click_rate (recipient-weighted), not
        // totalOpens/totalRecipients — those are different denominators (platform rates are unique
        // opens ÷ delivered) and would silently disagree with the per-campaign list printed right
        // below, directly contradicting the "do not recompute or average them differently" line.
        const avgOpen = totalRecipients > 0 ? (campaigns.reduce((s: number, c: any) => s + (Number(c.open_rate) || 0) * (Number(c.recipients) || 0), 0) / totalRecipients).toFixed(2) : '0.00'
        const avgClick = totalRecipients > 0 ? (campaigns.reduce((s: number, c: any) => s + (Number(c.click_rate) || 0) * (Number(c.recipients) || 0), 0) / totalRecipients).toFixed(2) : '0.00'

        posContext += `${campaigns.length} campaign(s) to ${totalRecipients} recipient(s): ${avgOpen}% open, ${avgClick}% click, ${totalUnsubs} unsubscribe(s)${totalCampRevenue > 0 ? `, ${finalSymbol}${totalCampRevenue.toFixed(2)} attributed revenue` : ''}.\n`
        posContext += campaigns.slice(0, 10).map((c: any) => `- ${c.campaign_name || 'Untitled'} (${c.source_type}, sent ${c.sent_at ? new Date(c.sent_at).toLocaleDateString() : 'unknown'}): ${Number(c.recipients) || 0} sent, ${(Number(c.open_rate) || 0).toFixed(2)}% open, ${(Number(c.click_rate) || 0).toFixed(2)}% click${Number(c.revenue) > 0 ? `, ${finalSymbol}${(Number(c.revenue) || 0).toFixed(2)} revenue` : ''}`).join('\n') + '\n'

        if (campaigns.length >= 3) {
          const ranked = [...(campaigns as any[])].sort((a, b) => (Number(b.open_rate) || 0) - (Number(a.open_rate) || 0))
          const best = ranked[0]
          const worst = ranked[ranked.length - 1]
          posContext += `Best performer: "${best.campaign_name || 'Untitled'}" at ${(Number(best.open_rate) || 0).toFixed(2)}% open / ${(Number(best.click_rate) || 0).toFixed(2)}% click. Worst: "${worst.campaign_name || 'Untitled'}" at ${(Number(worst.open_rate) || 0).toFixed(2)}% open / ${(Number(worst.click_rate) || 0).toFixed(2)}% click.\n`
        }
        posContext += `IMPORTANT: Use these exact open/click rates as given — they come from the email platform, do not recompute or average them differently. Campaign revenue is platform-attributed and is not the same money as POS revenue; do not add the two together.\n`
      } else {
        posContext += `No email campaigns sent in ${periodLabel} — Mailchimp/Klaviyo may not be connected.\n`
        posContext += `IMPORTANT: State plainly that no campaigns exist for this period. Do not substitute unrelated sales or traffic figures.\n`
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
