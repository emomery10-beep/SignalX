// ── SERPER.DEV — Google Search API ───────────────────────────────────────────
// Runs in parallel with Tavily to cover gaps when Tavily returns nothing.
// Graceful no-op when SERPER_API_KEY is not set.
// Pricing: 2,500 free queries/month, then $3/1000.
// Sign up: https://serper.dev
// ─────────────────────────────────────────────────────────────────────────────

const SERPER_KEY = process.env.SERPER_API_KEY || ''

export interface SerperResult {
  title: string
  link: string
  snippet: string
  date?: string
}

export interface SerperResponse {
  query: string
  answerBox?: { answer?: string; snippet?: string; title?: string }
  organic: SerperResult[]
  knowledgeGraph?: { description?: string }
}

export async function serperSearch(query: string, options: {
  type?: 'search' | 'news'
  num?: number
  tbs?: string   // time filter e.g. 'qdr:d' = past day
} = {}): Promise<SerperResponse | null> {
  if (!SERPER_KEY) return null

  const { type = 'search', num = 5, tbs } = options

  const endpoint = type === 'news'
    ? 'https://google.serper.dev/news'
    : 'https://google.serper.dev/search'

  try {
    const body: Record<string, unknown> = { q: query, num }
    if (tbs) body.tbs = tbs

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return await res.json() as SerperResponse
  } catch {
    return null
  }
}

// Extract best plain-text answer from a Serper response
export function serperAnswer(res: SerperResponse | null): string {
  if (!res) return ''
  if (res.answerBox?.answer) return res.answerBox.answer
  if (res.answerBox?.snippet) return res.answerBox.snippet
  if (res.knowledgeGraph?.description) return res.knowledgeGraph.description
  return res.organic.slice(0, 2).map(r => r.snippet).filter(Boolean).join(' ') || ''
}
