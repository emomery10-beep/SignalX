// ── TAVILY SEARCH CLIENT ──────────────────────────────────────────────────────
// Real-time web search for market intelligence, competitor news, regulatory
// updates, and industry trends — injected into Claude's context window
// ─────────────────────────────────────────────────────────────────────────────

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || ''

export interface TavilyResult {
  title: string
  url: string
  content: string
  score: number
  published_date?: string
}

export interface TavilySearchResponse {
  query: string
  results: TavilyResult[]
  answer?: string        // Tavily's own AI-generated answer (when requested)
  response_time: number
}

export interface TavilySearchOptions {
  searchDepth?: 'basic' | 'advanced'   // advanced = more results, higher quality
  maxResults?: number                   // 1-10, default 5
  includeAnswer?: boolean               // Tavily's own AI summary
  includeDomains?: string[]             // restrict to specific domains
  excludeDomains?: string[]             // exclude domains
  topic?: 'general' | 'news'           // news = recent articles prioritised
  days?: number                         // for news topic: last N days
}

/**
 * Search the live web via Tavily and return structured results.
 * Returns null (non-throwing) if the API key is missing or the request fails —
 * so the chat route degrades gracefully rather than erroring.
 */
export async function tavilySearch(
  query: string,
  options: TavilySearchOptions = {}
): Promise<TavilySearchResponse | null> {
  if (!TAVILY_API_KEY) {
    console.warn('[Tavily] TAVILY_API_KEY not set — skipping web search')
    return null
  }

  const {
    searchDepth = 'basic',
    maxResults = 5,
    includeAnswer = false,
    includeDomains,
    excludeDomains,
    topic = 'general',
    days,
  } = options

  try {
    const body: Record<string, unknown> = {
      api_key: TAVILY_API_KEY,
      query,
      search_depth: searchDepth,
      max_results: maxResults,
      include_answer: includeAnswer,
      topic,
    }

    if (includeDomains?.length) body.include_domains = includeDomains
    if (excludeDomains?.length) body.exclude_domains = excludeDomains
    if (days) body.days = days

    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000), // 8s timeout — non-blocking
    })

    if (!res.ok) {
      console.error(`[Tavily] API error ${res.status}: ${await res.text()}`)
      return null
    }

    const data = await res.json()
    return data as TavilySearchResponse
  } catch (err) {
    console.error('[Tavily] Search failed:', err)
    return null
  }
}

/**
 * Detect whether a user question warrants a live web search.
 * Returns the best search query string, or null if no search needed.
 */
export function detectSearchIntent(question: string): string | null {
  const q = question.toLowerCase()

  // Regulatory / compliance triggers
  const regulatoryMatch = q.match(
    /eu ai act|gdpr|vat|ioss|oss|customs|tariff|import duty|trade war|sanction|regulation|law|legislation|compliance/
  )
  if (regulatoryMatch) {
    return `${question} 2026 latest update`
  }

  // Market news / competitor triggers
  const newsMatch = q.match(
    /news|latest|recent|update|trend|industry|market|competitor|amazon|shopify|alibaba|temu|shein|ebay|tariff|recession|inflation|interest rate/
  )
  if (newsMatch) {
    return question
  }

  // Product / category trend triggers
  const trendMatch = q.match(
    /trending|popular|demand|hot product|best seller|what.s selling|growing market|niche|opportunity/
  )
  if (trendMatch) {
    return `${question} ecommerce trend 2026`
  }

  // Specific company / brand research
  const companyMatch = q.match(
    /who is|what is|tell me about|research|find out about|background on/
  )
  if (companyMatch) {
    return question
  }

  return null
}

/**
 * Format Tavily results into a concise context block for Claude's system prompt.
 * Keeps it tight — max ~500 tokens of web context.
 */
export function formatSearchContext(
  response: TavilySearchResponse,
  maxResults = 3
): string {
  if (!response.results?.length) return ''

  const lines: string[] = [
    `WEB SEARCH RESULTS (query: "${response.query}"):`,
  ]

  if (response.answer) {
    lines.push(`Summary: ${response.answer}`)
    lines.push('')
  }

  response.results.slice(0, maxResults).forEach((r, i) => {
    const date = r.published_date
      ? ` (${new Date(r.published_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })})`
      : ''
    lines.push(`[${i + 1}] ${r.title}${date}`)
    lines.push(`Source: ${r.url}`)
    // Truncate content to ~200 chars per result
    const snippet = r.content.length > 200
      ? r.content.slice(0, 200).trimEnd() + '…'
      : r.content
    lines.push(snippet)
    lines.push('')
  })

  lines.push(
    'Use these search results to provide accurate, current information. Cite sources where relevant by mentioning the publication name naturally in your answer.'
  )

  return lines.join('\n')
}
