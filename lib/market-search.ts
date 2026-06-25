// ── MARKET SEARCH — Tavily primary, Google fallback ──────────────────────────
// Tries Tavily first. Only calls Serper/Google if Tavily returns nothing.
// This keeps costs low — most queries succeed on Tavily alone.
// ─────────────────────────────────────────────────────────────────────────────

import { tavilySearch } from './tavily'
import { serperSearch, serperAnswer } from './serper'

export interface MarketSearchResult {
  answer: string
  source: 'tavily' | 'google' | 'none'
  snippets: string[]
  hasData: boolean
}

export async function marketSearch(
  query: string,
  options: {
    topic?: 'general' | 'news'
    days?: number
    fallbackQuery?: string
  } = {}
): Promise<MarketSearchResult> {
  const { topic = 'general', days = 3, fallbackQuery } = options

  // ── Step 1: Try Tavily ────────────────────────────────────────────────────
  const tavilyRes = await tavilySearch(query, {
    searchDepth: 'basic',
    maxResults: 4,
    includeAnswer: true,
    topic: topic === 'news' ? 'news' : 'general',
    days: topic === 'news' ? days : undefined,
  })

  const tavilyAnswer = tavilyRes?.answer || tavilyRes?.results?.[0]?.content || ''

  if (tavilyAnswer) {
    return {
      answer: tavilyAnswer.slice(0, 400).trim(),
      source: 'tavily',
      snippets: (tavilyRes?.results || []).map(r => r.content).filter(Boolean).slice(0, 4),
      hasData: true,
    }
  }

  // ── Step 2: Tavily returned nothing — try Google ──────────────────────────
  const googleRes = await serperSearch(query, {
    type: topic === 'news' ? 'news' : 'search',
    num: 4,
    tbs: topic === 'news' ? 'qdr:d' : undefined,
  })

  const googleAnswer = serperAnswer(googleRes)

  if (googleAnswer) {
    return {
      answer: googleAnswer.slice(0, 400).trim(),
      source: 'google',
      snippets: (googleRes?.organic || []).map(r => r.snippet).filter(Boolean).slice(0, 4),
      hasData: true,
    }
  }

  // ── Step 3: Both failed — try alternate query on Google ───────────────────
  if (fallbackQuery) {
    const fallbackRes = await serperSearch(fallbackQuery, {
      type: topic === 'news' ? 'news' : 'search',
      num: 3,
    })
    const fallbackAnswer = serperAnswer(fallbackRes)
    if (fallbackAnswer) {
      return {
        answer: fallbackAnswer.slice(0, 400).trim(),
        source: 'google',
        snippets: (fallbackRes?.organic || []).map(r => r.snippet).filter(Boolean).slice(0, 3),
        hasData: true,
      }
    }
  }

  return { answer: '', source: 'none', snippets: [], hasData: false }
}
