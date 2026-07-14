// Reddit-style "visited" tracking for AskBiz Academy — lets article rows
// dim once read, so scanning a 644-article library shows what's new vs.
// already seen instead of every row looking identical forever.
const STORAGE_KEY = 'askbiz_academy_read_articles'

export function getReadArticles(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function markArticleRead(slug: string) {
  if (typeof window === 'undefined') return
  try {
    const current = getReadArticles()
    if (current.has(slug)) return
    current.add(slug)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]))
  } catch { /* localStorage unavailable (private mode, etc.) — no-op */ }
}
