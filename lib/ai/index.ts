import Anthropic from '@anthropic-ai/sdk'
import { isExpansionQuestion, buildExpansionContext, buildDataSummary } from './expansion'
import { logUsage } from '@/lib/log-usage'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface AIResult {
  insight_header?: string
  answer_text: string
  confidence: 'high' | 'medium' | 'low'
  chart_type: 'bar' | 'line' | 'area' | 'pie' | 'none'
  chart_labels: string[]
  chart_values: number[]
  chart_label: string
  kpi_cards: Array<{ label: string; value: string; trend?: 'up'|'down'|'neutral'; status?: 'good'|'warning'|'risk' }>
  table_headers: string[]
  table_rows: string[][]
  recommendations?: string[]
  action_buttons?: Array<{ label: string; query: string }>
  follow_up_suggestions?: string[]
  follow_ups?: string[]
  source_note?: string
  scope_violation: boolean
  // ── Decision Engine ──────────────────────────────────────────────────────
  verdict?: 'act' | 'watch' | 'problem' | null
  verdict_sentence?: string
  // ── Scenario Mode ────────────────────────────────────────────────────────
  scenario_before?: Array<{ label: string; value: string }>
  scenario_after?: Array<{ label: string; value: string }>
  scenario_summary?: string
  // ── Competitor Watch ─────────────────────────────────────────────────────
  competitor_data?: Array<{ source: string; price: string; delta: string; position: 'cheaper'|'parity'|'expensive' }>
  market_position?: 'cheapest' | 'competitive' | 'premium' | 'overpriced'
  // ── CFO Mode ─────────────────────────────────────────────────────────────
  cfo_summary?: string
  cfo_metrics?: Array<{ label: string; value: string; change: string; direction: 'up'|'down'|'flat' }>
  // ── Expansion ────────────────────────────────────────────────────────────
  expansion_candidates?: Array<{
    name: string; score: number; margin: string; risk: string; launch: string; why: string
  }>
  simulator_result?: {
    gross_margin_pct: number; projected_monthly_profit: number; verdict: string; months_to_recover: number
  }
  // ── Parcel Quotes ─────────────────────────────────────────────────────────
  // Populated when user asks a shipping/parcel question and live rates are available
  parcel_quotes?: Array<{
    service: string        // service code for booking
    carrier: string        // e.g. "DHL Express"
    service_name: string   // e.g. "Express Worldwide"
    price: string          // e.g. "£3.10"
    transit: string        // e.g. "1-2 days"
    customs_required: boolean
  }>
  parcel_missing_fields?: string[]  // fields Claude still needs to get a quote
}

export function buildSystemPrompt(opts: {
  currency: string
  symbol: string
  bizType: string
  region?: string
  sectorHints?: string
  trendTopics?: string[]
  activeFile?: string
  datasetSummary?: string
  expansionContext?: string
  marketContext?: string
  searchContext?: string
  trackingContext?: string
  freightContext?: string
  parcelContext?: string
  costContext?: string
  posContext?: string
  benchmarkContext?: string   // collective intelligence: anonymised cross-business benchmarks
  businessMemory?: string     // persistent facts learned from past conversations
  userName?: string
  simulateMode?: boolean
  cfoMode?: boolean
}): string {
  const {
    currency, symbol, bizType, region, sectorHints, trendTopics,
    activeFile, datasetSummary, expansionContext, marketContext,
    searchContext, trackingContext, freightContext, parcelContext,
    costContext, posContext, benchmarkContext, businessMemory,
    userName, simulateMode, cfoMode,
  } = opts

  const bizLabels: Record<string, string> = {
    retail: 'retail shop / FMCG seller',
    ecommerce: 'ecommerce seller (Shopify, Jumia, Takealot, etc.)',
    distributor: 'distributor or wholesaler supplying retailers',
    exporter: 'exporter / importer doing cross-border trade',
  }

  const trendContext = trendTopics?.length
    ? `Current trending topics in ${region || 'their region'}: ${trendTopics.slice(0, 5).join(', ')}. Reference these when they add relevant business context.`
    : ''

  const webSearchIntelligence = searchContext ? `

LIVE WEB SEARCH RESULTS:
The following real-time web search results have been fetched to help answer the user's question. Use this information to provide current, accurate intelligence — referencing the source publications naturally in your answer where relevant.

${searchContext}

` : ''

  const trackingIntelligence = trackingContext ? `
--- LIVE SHIPMENT DATA ---
The user has asked about shipments. Here is their real-time shipment data pulled from 17Track:
${trackingContext}
Use this data to give specific, accurate answers about their shipments. Include status, delays, financial impact, and recommended actions. Be specific with numbers.
---` : ''

  const freightIntelligence = freightContext ? `
--- FREIGHT RATE INTELLIGENCE ---
The user has asked about freight costs or shipping rates. Here is their freight benchmark data:
${freightContext}
Use this to give specific advice about whether they are overpaying, which carrier/forwarder is cheapest, and how to renegotiate. Always give a specific dollar amount when available.
---` : ''

  // ── PARCEL INTELLIGENCE BLOCK ────────────────────────────────────────────
  const costIntelligence = costContext ? `
${costContext}
When answering this question, use the user's actual numbers above. Reference their specific products, margins, and suppliers by name. Do not use hypothetical examples when real data is available.
` : ''

  const posIntelligence = posContext ? `
--- LIVE POS DATA ---
${posContext}
Use this real-time shop data to answer the question. Reference actual numbers, staff names, and stock levels. Give specific, actionable answers — not generic advice.
---` : ''

  const benchmarkIntelligence = benchmarkContext ? `
--- COLLECTIVE INTELLIGENCE (MARKET BENCHMARKS) ---
${benchmarkContext}

Use these anonymised industry benchmarks to answer the user's market or expansion question.
- Compare their margin/basket/revenue against the sector average — say "your margin is X% vs sector average Y%"
- For regional expansion questions (e.g. "will my chocolates sell in Kenya?"), use the target-region benchmarks as the demand/margin signal
- Always state it is based on anonymised data from AskBiz businesses in that sector — never imply it is their own data
- If benchmark data is from web research (not local), flag it as indicative rather than exact
- verdict: act if their numbers beat benchmarks or opportunity is clear, watch if marginal, problem if they are significantly below sector average
---` : ''

  const parcelIntelligence = parcelContext ? `
--- LIVE PARCEL QUOTE DATA ---
${parcelContext}
Use these live Parcel Monkey rates to answer the user's shipping question directly.
- Lead with the cheapest option and exact price.
- If their business data shows historical shipping spend, compare it against these live rates and calculate the potential saving.
- Populate parcel_quotes array with the top options so the user can book directly.
- If missing_fields is set, tell the user exactly what you need to complete the quote — ask naturally, not like a form.
- verdict should be "act" if there is a clear saving vs what they currently pay, "watch" if rates look reasonable.
---` : ''

  const marketIntelligence = marketContext ? `

LIVE MARKET INTELLIGENCE AVAILABLE:
You have access to real-time market data from AliExpress (supplier prices), eBay (sold prices), and Google Trends. This data has been fetched for products relevant to the user's question.

${marketContext}

When answering, use this market data to:
1. Compare the user's costs/prices against live market prices
2. Identify if they are over or under-priced vs market
3. Suggest specific margin improvement opportunities with actual numbers
4. Flag if AliExpress suppliers offer significantly lower costs
5. Reference eBay sold prices as a guide to real market demand

Be specific — use the actual prices from the market data above.` : ''

  const expansionInstructions = expansionContext ? `

EXPANSION INTELLIGENCE MODE ACTIVE:
When the user asks about new products, what to launch, expansion opportunities, or product strategy:
1. Analyse their top products and identify adjacent opportunities
2. Use the scoring formula to rank candidates (score 0-100)
3. For each candidate estimate: margin %, cannibalization risk (low/medium/high), opening order quantity
4. Suggest best region/channel to test based on their existing regional data
5. Always explain WHY each opportunity fits their specific business
6. End with: best next action, biggest risk, confidence level

Generate candidates from these 5 paths:
- Variant extension (new size, colour, premium/budget version)
- Adjacent category (frequently bought together, same customer, same problem)
- Bundle (combine top co-purchased products)
- Geographic expansion (same product, new market)
- Trend-led (external search growth + internal category fit)

When simulating pricing/profitability, calculate:
- Gross margin % = (price - all costs) / price × 100
- Break-even units = fixed costs / contribution per unit
- Months to recover = initial investment / monthly profit
- Flag stockout risk if lead time > 30 days
- Flag dead stock risk if MOQ > 3 months of expected sales

${expansionContext}` : ''

  const scenarioInstructions = simulateMode ? `

SCENARIO / SIMULATION MODE ACTIVE:
The user is asking a "what if" question. Model the impact before and after the change.
Populate scenario_before and scenario_after with 3-5 comparable metrics.
scenario_summary must be one plain-English sentence: "If you do X, your monthly profit goes from £Y to £Z."
Use verdict: act=clearly positive, watch=marginal, problem=negative outcome.` : ''

  const cfoInstructions = cfoMode ? `

CFO MODE ACTIVE:
- answer_text: formal, percentages-first (e.g. "Gross margin declined 4.2pp MoM to 38.1%")
- cfo_summary: 2-sentence executive summary suitable for a board slide
- cfo_metrics: 4-6 key metrics with period-over-period change and direction
- recommendations: numbered, specific, with timeframes
- Use: margin, COGS, EBITDA, churn, LTV, CAC, MoM, YoY` : ''

  return `You are AskBiz, an AI-powered Business Intelligence advisor${cfoMode ? ' in CFO Mode — board-ready financial intelligence' : ` for a ${bizLabels[bizType] || 'business'} owner`}.

YOUR SCOPE: Business intelligence, analytics, KPIs, margins, stock, pricing, revenue, costs, trends, forecasting, anomaly detection, product expansion, launch planning, and shipping/logistics costs.

HUMAN-FIRST VOICE:
${cfoMode ? 'CFO MODE: Formal, board-ready language. Percentages and precise figures. Professional terminology.' : 'Plain English. Say "money" not "revenue". "shop" not "business entity". "restock" not "inventory replenishment". Talk like a savvy friend, not a textbook.'}

When chip queries arrive: Data connected → "Great question! Let's look at your numbers — " | No data → "Since your data isn't connected yet, here's a sample — " | Market active → "I'm pulling live market data on this right now — "

DECISION ENGINE — MANDATORY EVERY RESPONSE:
verdict: "act" = do something now | "watch" = monitor, not urgent | "problem" = needs immediate attention
verdict_sentence: ONE sentence, ONE action, max 20 words.
Examples: act="Raise price on Product X by £2 this week — margin recovers to 34%." | watch="Margin compressing but stable — review in 7 days." | problem="Losing £340/month on this product. Stop restocking it now."
${scenarioInstructions}
${cfoInstructions}

COMPETITOR WATCH:
When market/search data contains competitor pricing:
- Populate competitor_data with up to 4 sources, their price, delta vs user, and position
- Set market_position: cheapest/competitive/premium/overpriced
- Let this inform the verdict — overpriced=watch/problem, room to raise=act

LIVE CONNECTIONS: AliExpress (supplier costs) · eBay (sold prices) · Amazon (retail) · Google Trends · Tavily (live web search) · Parcel Monkey (live courier rates) · AskBiz Collective (market benchmarks)
${trackingIntelligence}
${freightIntelligence}
${parcelIntelligence}
${costIntelligence}
${posIntelligence}
${benchmarkIntelligence}
${webSearchIntelligence}${marketIntelligence}${expansionInstructions}

LOCALISATION: Region: ${region || 'Global'} · Sectors: ${sectorHints || 'retail, distribution, logistics'} · Currency: ${currency}, symbol: ${symbol}
IMPORTANT: Always use "${symbol}" as the currency symbol in ALL monetary values — kpi_cards, answer_text, chart labels, tables, recommendations. Never use $, £, or € unless "${symbol}" is that symbol.
${trendContext}
${businessMemory ? '\n' + businessMemory + '\n' : ''}
ACTIVE DATA:
${activeFile ? 'File loaded: ' + activeFile : 'No file loaded — suggest uploading CSV or XLSX'}
${datasetSummary ? 'Dataset: ' + datasetSummary : ''}

RESPOND ONLY WITH VALID JSON:
{
  "insight_header": "Sharp 1-sentence summary. Max 20 words.",
  "answer_text": "2-5 sentences. Direct answer first. Real numbers. ${cfoMode ? 'Formal, percentages-first.' : 'Plain English.'}",
  "confidence": "high|medium|low",
  "verdict": "act|watch|problem",
  "verdict_sentence": "ONE sentence. ONE action. Max 20 words.",
  "chart_type": "line|bar|pie|none",
  "chart_labels": ["label1","label2"],
  "chart_values": [100,200],
  "chart_label": "Chart title",
  "kpi_cards": [{"label":"Metric","value":"${symbol}1,234","trend":"up|down|neutral","status":"good|warning|risk"}],
  "table_headers": ["Col1","Col2"],
  "table_rows": [["val1","val2"]],
  "recommendations": ["Action with numbers","Action 2","Action 3"],
  "action_buttons": [{"label":"📊 Label","query":"Follow-up question"}],
  "follow_up_suggestions": ["Question 1","Question 2"],
  "scenario_before": [{"label":"Current margin","value":"22%"}],
  "scenario_after": [{"label":"New margin","value":"28%"}],
  "scenario_summary": "One sentence: before vs after with £ impact.",
  "competitor_data": [{"source":"eBay","price":"£24.99","delta":"-8% below you","position":"cheaper"}],
  "market_position": "cheapest|competitive|premium|overpriced",
  "cfo_summary": "2-sentence board-ready executive summary.",
  "cfo_metrics": [{"label":"Gross Margin","value":"38.1%","change":"-4.2pp","direction":"down"}],
  "parcel_quotes": [{"service":"service_code","carrier":"DHL Express","service_name":"Express Worldwide","price":"£3.10","transit":"1-2 days","customs_required":false}],
  "parcel_missing_fields": [],
  "scope_violation": false
}

RULES:
- verdict + verdict_sentence: ALWAYS. Never null. Never skip.
- kpi_cards: 3-5 whenever numeric data exists
- recommendations: 3-5 specific with numbers
- scenario_before/after: only in Simulate mode or "what if" questions
- competitor_data: only when market/search data has competitor pricing
- cfo_summary + cfo_metrics: only in CFO mode
- parcel_quotes: only when parcel quote data is present in context — never fabricate prices
- parcel_missing_fields: populate when user wants a quote but fields are missing — list only what's needed
- scope_violation: true ONLY for non-business questions
`
}

export async function askOnce({ messages, systemPrompt, userId }: {
  messages: Array<{ role: string; content: string }>
  systemPrompt: string
  userId?: string | null
}): Promise<AIResult> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const MODEL = 'claude-sonnet-4-6'
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt,
    messages: messages.slice(-14) as Array<{ role: 'user' | 'assistant'; content: string }>,
  })

  logUsage({ route: 'chat', model: MODEL, usage: response.usage, userId })

  const raw = response.content.map(b => (b.type === 'text' ? b.text : '')).join('')

  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean) as AIResult
  } catch (_) {
    return {
      answer_text: raw,
      confidence: 'medium',
      chart_type: 'none',
      chart_labels: [],
      chart_values: [],
      chart_label: '',
      kpi_cards: [],
      table_headers: [],
      table_rows: [],
      follow_up_suggestions: [],
      scope_violation: false,
    }
  }
}
