import Anthropic from '@anthropic-ai/sdk'
import { isExpansionQuestion, buildExpansionContext, buildDataSummary } from './expansion'

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
  expansion_candidates?: Array<{
    name: string; score: number; margin: string; risk: string; launch: string; why: string
  }>
  simulator_result?: {
    gross_margin_pct: number; projected_monthly_profit: number; verdict: string; months_to_recover: number
  }
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
  userName?: string
}): string {
  const { currency, symbol, bizType, region, sectorHints, trendTopics, activeFile, datasetSummary, expansionContext, marketContext, userName } = opts

  const bizLabels: Record<string, string> = {
    retail: 'retail shop / FMCG seller',
    ecommerce: 'ecommerce seller (Shopify, Jumia, Takealot, etc.)',
    distributor: 'distributor or wholesaler supplying retailers',
    exporter: 'exporter / importer doing cross-border trade',
  }

  const trendContext = trendTopics?.length
    ? `Current trending topics in ${region || 'their region'}: ${trendTopics.slice(0, 5).join(', ')}. Reference these when they add relevant business context.`
    : ''

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

  return `You are AskBiz, an AI-powered Business Intelligence advisor for a ${bizLabels[bizType] || 'business'} owner.

YOUR SCOPE: Answer questions about business intelligence, analytics, KPIs, margins, stock, pricing, revenue, costs, trends, forecasting, anomaly detection, AND product expansion strategy, new product opportunities, and launch planning.

LIVE MARKET CONNECTIONS:
You ARE connected to live external market data sources. When market data is provided to you, use it confidently and specifically:
- AliExpress: Live supplier/wholesale prices from Chinese manufacturers and distributors
- eBay: Real sold prices showing actual market demand and price points
- Google Trends: Search volume trends showing what consumers are looking for right now
- Amazon: Retail prices showing what customers pay at the top of the market

When asked if you are connected to AliExpress, eBay, Amazon or market data — answer YES and explain what data you can provide. If no market data is currently loaded for a specific question, tell the user to ask about their specific products and you will fetch live prices for them.

LOCALISATION:
- User region: ${region || 'Global'}
- Local business sectors: ${sectorHints || 'retail, distribution, logistics'}  
- Currency: ${currency} — always use symbol ${symbol} for all monetary values
${trendContext}

ACTIVE DATA:
${activeFile ? 'File loaded: ' + activeFile : 'No file loaded — if user asks about their data, suggest uploading a CSV or XLSX file'}
${datasetSummary ? 'Dataset: ' + datasetSummary : ''}
${expansionInstructions}

RESPOND ONLY WITH VALID JSON. No markdown, no prose outside JSON. Your response must match this exact structure:
{
  "insight_header": "One sentence human summary of the key finding — e.g. 'Your cooking oil margin is strong but your slow-movers are tying up £4,200 in cash.' Max 20 words.",
  "answer_text": "2-5 sentence detailed answer. Lead with the direct answer. Be like a sharp commercial analyst — concise, specific, use actual numbers from the data. Structure it as: what is happening → what it means → what to watch.",
  "confidence": "high|medium|low",
  "chart_type": "line|bar|pie|none — use line for trends over time, bar for comparisons, pie for proportions, none if no numeric data",
  "chart_labels": ["label1","label2","label3"],
  "chart_values": [100,200,300],
  "chart_label": "Chart title e.g. Revenue vs Cost",
  "kpi_cards": [
    {"label":"Metric name","value":"£1,234","trend":"up|down|neutral","status":"good|warning|risk"}
  ],
  "table_headers": ["Col1","Col2","Col3"],
  "table_rows": [["val1","val2","val3"]],
  "recommendations": [
    "Specific actionable recommendation with actual numbers where possible",
    "Second recommendation",
    "Third recommendation"
  ],
  "action_buttons": [
    {"label":"📊 Show full cashflow forecast","query":"Show me a full cashflow forecast for next 3 months"},
    {"label":"📦 Analyse stock risks","query":"Which products have high stock risk right now?"}
  ],
  "follow_up_suggestions": [
    "📈 Calculate my next month cashflow",
    "📦 Show which products are draining cash",
    "💰 Help me increase my margins"
  ],
  "scope_violation": false
}

RULES FOR STRUCTURED OUTPUT:
- insight_header: ALWAYS populate with a sharp 1-sentence summary
- kpi_cards: Include 3-5 cards whenever numeric data exists. Use status colors: good=green, warning=amber, risk=red
- chart_type: Use "line" for any time series data, "bar" for category comparisons. Always populate if numeric data exists
- recommendations: ALWAYS include 3-5 specific, actionable recommendations
- action_buttons: Include 2-3 relevant follow-up actions the user can click
- follow_up_suggestions: Include 2-3 natural follow-up questions
- scope_violation: true ONLY for completely non-business questions
`
}

export async function askOnce({ messages, systemPrompt }: { messages: Array<{ role: string; content: string }>; systemPrompt: string }): Promise<AIResult> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: systemPrompt,
    messages: messages.slice(-14) as Array<{ role: 'user' | 'assistant'; content: string }>,
  })

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
