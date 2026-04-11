import Anthropic from '@anthropic-ai/sdk'
import { isExpansionQuestion, buildExpansionContext, buildDataSummary } from './expansion'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface AIResult {
  answer_text: string
  confidence: 'high' | 'medium' | 'low'
  chart_type: 'bar' | 'line' | 'area' | 'pie' | 'none'
  chart_labels: string[]
  chart_values: number[]
  chart_label: string
  kpi_cards: Array<{ label: string; value: string; delta?: string; dir?: 'up' | 'down' | 'neutral' }>
  table_headers: string[]
  table_rows: string[][]
  follow_ups: string[]
  source_note: string
  scope_violation: boolean
  // Expansion-specific fields
  expansion_candidates?: Array<{
    name: string
    score: number
    margin: string
    risk: string
    launch: string
    why: string
  }>
  simulator_result?: {
    gross_margin_pct: number
    projected_monthly_profit: number
    verdict: string
    months_to_recover: number
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
  userName?: string
}): string {
  const { currency, symbol, bizType, region, sectorHints, trendTopics, activeFile, datasetSummary, expansionContext, userName } = opts

  const bizLabels: Record<string, string> = {
    retail: 'retail shop / FMCG seller',
    ecommerce: 'ecommerce seller (Shopify, Jumia, Takealot, etc.)',
    distributor: 'distributor or wholesaler supplying retailers',
    exporter: 'exporter / importer doing cross-border trade',
  }

  const trendContext = trendTopics?.length
    ? `Current trending topics in ${region || 'their region'}: ${trendTopics.slice(0, 5).join(', ')}. Reference these when they add relevant business context.`
    : ''

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

  return `You are SignalX, a Business Intelligence and Product Expansion advisor for a ${bizLabels[bizType] || 'business'} owner.

YOUR SCOPE: Answer questions about business intelligence, analytics, KPIs, margins, stock, pricing, revenue, costs, trends, forecasting, anomaly detection, AND product expansion strategy, new product opportunities, and launch planning.

LOCALISATION:
- User region: ${region || 'Global'}
- Local business sectors: ${sectorHints || 'retail, distribution, logistics'}  
- Currency: ${currency} — always use symbol ${symbol} for all monetary values
${trendContext}

ACTIVE DATA:
${activeFile ? `File loaded: ${activeFile}` : 'No file loaded — if user asks about their data, suggest uploading a CSV or XLSX file'}
${datasetSummary ? `Dataset: ${datasetSummary}` : ''}
${expansionInstructions}

RESPOND ONLY WITH VALID JSON — no markdown, no prose outside JSON:
{
  "answer_text": "Clear 2-6 sentence answer. Lead with the direct answer. Be like a sharp commercial analyst — concise, practical, plain English.",
  "confidence": "high|medium|low",
  "chart_type": "bar|line|pie|none",
  "chart_labels": [],
  "chart_values": [],
  "chart_label": "",
  "kpi_cards": [{"label":"","value":"","delta":"","dir":"up|down|neutral"}],
  "table_headers": [],
  "table_rows": [],
  "follow_ups": ["specific question 1", "specific question 2"],
  "source_note": "",
  "scope_violation": false,
  "expansion_candidates": [
    {
      "name": "Product opportunity name",
      "score": 72,
      "margin": "38%",
      "risk": "low",
      "launch": "Start with 50 units in Nairobi, test for 30 days",
      "why": "Your cooking oil customers already buy this 34% of the time"
    }
  ],
  "simulator_result": null
}

RULES:
- Use ${symbol} for all money. Round to whole numbers
- Stock critical = stock < 10 AND monthly sales > 100
- Margin = (price - cost) / price × 100
- Always include 2 specific follow_up questions
- Max 4 kpi_cards, max 10 table_rows
- expansion_candidates: only include when answering expansion/launch questions (max 5)
- simulator_result: only include when simulating specific price/cost scenarios
- End every expansion answer with: best next action, biggest risk, confidence level
- scope_violation = true only for completely non-business questions`
}

export async function streamChat(opts: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  systemPrompt: string
}): Promise<ReadableStream<Uint8Array>> {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    system: opts.systemPrompt,
    messages: opts.messages.slice(-14),
  })

  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
    cancel() { stream.abort() },
  })
}

export async function askOnce(opts: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  systemPrompt: string
}): Promise<AIResult> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    system: opts.systemPrompt,
    messages: opts.messages.slice(-14),
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
      follow_ups: [],
      source_note: '',
      scope_violation: false,
    }
  }
}

// Re-export for use in other modules
export { isExpansionQuestion, buildExpansionContext, buildDataSummary }
