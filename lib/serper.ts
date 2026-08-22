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

// Pass `diagnostics` (a caller's run log) to learn WHY this returned null.
// An out-of-credit account answers HTTP 400 "Not enough credits", which is
// otherwise indistinguishable from a query that genuinely found nothing.
export async function serperSearch(query: string, options: {
  type?: 'search' | 'news'
  num?: number
  tbs?: string   // time filter e.g. 'qdr:d' = past day
  diagnostics?: string[]
} = {}): Promise<SerperResponse | null> {
  const { type = 'search', num = 5, tbs, diagnostics } = options

  if (!SERPER_KEY) {
    diagnostics?.push('Serper: SERPER_API_KEY not set — skipped')
    return null
  }

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
    if (!res.ok) {
      const errText = await res.text()
      console.error(`[Serper] /${type} error ${res.status}: ${errText}`)
      diagnostics?.push(
        `Serper /${type}: HTTP ${res.status} — ${errText.replace(/\s+/g, ' ').slice(0, 160)}` +
        (/not enough credits/i.test(errText) ? ' (top up at serper.dev — the whole fallback is dead until you do)' : '')
      )
      return null
    }
    const data = await res.json()
    // The /news endpoint puts results under `news`, not `organic` — normalize
    // so every caller can read `.organic` regardless of which endpoint this hit.
    if (type === 'news' && !data.organic && Array.isArray(data.news)) {
      data.organic = data.news
    }
    if (!data?.organic?.length) diagnostics?.push(`Serper /${type}: 0 results for "${query}"`)
    return data as SerperResponse
  } catch (err) {
    console.error('[Serper] Search failed:', err)
    diagnostics?.push(`Serper /${type}: request failed — ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

// Extract best plain-text answer from a Serper response
export function serperAnswer(res: SerperResponse | null): string {
  if (!res) return ''
  if (res.answerBox?.answer) return res.answerBox.answer
  if (res.answerBox?.snippet) return res.answerBox.snippet
  if (res.knowledgeGraph?.description) return res.knowledgeGraph.description
  return (res.organic || []).slice(0, 2).map(r => r.snippet).filter(Boolean).join(' ') || ''
}
