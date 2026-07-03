// Shared safeguard for every scout agent (blog-scout, marketing-scout,
// carolyne-scout, ben-scout, victor-scout). Each agent feeds an LLM ~500-char
// search-result snippets and asks it to "name real companies, real
// regulations, real numbers" for authority. Without grounding, the model
// invents plausible-sounding attributions ("According to Reuters...",
// "As reported by The Guardian...") that were never in the source material —
// a real trust/legal risk once auto-published. This module is the single
// source of truth for (a) the prompt text that tells the model which sources
// it may actually cite, and (b) the post-generation check that catches
// ungrounded attributions the model invents anyway.

export interface SourceArticle {
  title: string
  url: string
  content: string
}

export function buildCitableSources(articles: SourceArticle[]): string[] {
  return articles.map(r => {
    try {
      return new URL(r.url).hostname.replace(/^www\./, '')
    } catch {
      return ''
    }
  }).filter(Boolean)
}

export function buildArticleContext(articles: SourceArticle[]): string {
  return articles
    .map((r, i) => {
      let source = 'unknown'
      try { source = new URL(r.url).hostname.replace(/^www\./, '') } catch { /* keep 'unknown' */ }
      return `[${i + 1}] ${r.title}\nSource: ${source}\nURL: ${r.url}\n${r.content.slice(0, 500)}`
    })
    .join('\n\n')
}

// Injected into each agent's system prompt, right after its own
// "you name real companies/regulators/numbers" line.
export function citationRulePrompt(citableSources: string[], articleCount: number): string {
  return `

CITATION RULE — READ CAREFULLY, THIS IS A HARD CONSTRAINT:
- You may ONLY attribute a claim, statistic, or quote to a named publication, company, or study if that exact fact appears in the source articles below. The allowed sources for this post are: ${citableSources.join(', ') || '(none provided)'}
- NEVER write "According to [Publication]", "As reported by [Publication]", "As seen in [Publication]", or any similar attribution unless [Publication] is one of the sources listed above AND the claim you're attributing to it is actually present in that source's content below.
- If a source snippet doesn't contain a specific number or fact you want to use, either don't use it, or state it as general market context WITHOUT naming a publication.
- Do NOT invent named publications that aren't in the source list above. Do NOT cite a real publication (Reuters, The Guardian, Bloomberg, Forbes, etc.) unless it's literally one of the ${articleCount} sources provided.
- When in doubt, don't cite a source by name at all — write the point as your own analysis instead. An unattributed factual claim is far safer than a fabricated attribution.`
}

const ATTRIBUTION_RE = /(?:According to|As reported by|As seen in|As noted by|Per|Reports? from|Data from|Research from)\s+([A-Z][A-Za-z0-9&'.\s-]{2,45}?)(?=[,.]|\s+(?:is|are|shows?|reveals?|reported|found|notes?|says?|found that))/g

// Defense-in-depth for when the model ignores the prompt rule anyway. Checks
// every "According to X" / "As reported by X" style attribution in the body
// text against the actual source domains — anything ungrounded gets
// returned so the caller can force human review instead of auto-publishing.
export function findFabricatedCitations(
  sections: Array<{ body?: string }> | undefined,
  citableSources: string[],
  { allowedNames = [] }: { allowedNames?: string[] } = {}
): string[] {
  const text = (sections || []).map(s => s.body || '').join(' ')

  const domainRoots = citableSources.map(host =>
    host.replace(/\.(com|co\.uk|org|net|io|news|gov|co\.ke|co\.za|co\.tz|co\.ug)$/i, '').replace(/[.-]/g, '').toLowerCase()
  )
  const allowedNameSet = new Set(allowedNames.map(n => n.toLowerCase()))

  const flagged: string[] = []
  let match: RegExpExecArray | null
  const re = new RegExp(ATTRIBUTION_RE)
  while ((match = re.exec(text)) !== null) {
    const name = match[1].trim()
    if (allowedNameSet.has(name.toLowerCase())) continue
    const nameWords = name.toLowerCase().split(/\s+/).filter(w => w.length > 2 && w !== 'the')
    const nameCompact = nameWords.join('')
    const grounded = domainRoots.some(root =>
      root.includes(nameCompact) || nameWords.some(w => root.includes(w))
    )
    if (!grounded) flagged.push(name)
  }
  return [...new Set(flagged)]
}

// Raising max_tokens fixed hard truncation, but a live test after deploying
// that fix still produced ~350-400 word articles against a ~1,400-1,500
// word prompt target — the model has room now and still undershoots. Since
// prompt-following isn't reliable, this is a hard floor: articles under it
// never auto-publish, regardless of quality score, the same way a
// fabricated citation blocks auto-publish. Set to the low end of the
// 1,200-1,500 word target (measuring section body text only — tldr/PAA/meta
// push the true total higher), so anything that clears this floor is a
// genuinely substantial article, not just "better than before."
export const MIN_WORD_COUNT = 1200

export function countSectionWords(sections: Array<{ body?: string }> | undefined): number {
  return (sections || []).reduce(
    (sum, s) => sum + (s.body ? s.body.trim().split(/\s+/).filter(Boolean).length : 0),
    0
  )
}

// A hard floor alone only quarantines thin output after the fact — it
// doesn't make the model more likely to hit the target next time. This
// wraps a Groq chat completion with ONE retry: if the first draft comes in
// under the floor, send the raw response back with an explicit instruction
// to expand only the short sections, rather than regenerating from scratch
// (cheaper, and keeps whatever was already good).
export async function generateWithLengthRetry(opts: {
  groqUrl: string
  apiKey: string
  model: string
  maxTokens: number
  systemPrompt: string
  userPrompt: string
  logRoute: string
  logUsage: (args: { route: string; model: string; usage: { input_tokens: number; output_tokens: number } }) => void
}): Promise<Record<string, any>> {
  const { groqUrl, apiKey, model, maxTokens, systemPrompt, userPrompt, logRoute, logUsage } = opts

  async function call(messages: Array<{ role: string; content: string }>) {
    const res = await fetch(groqUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
    })
    const data = await res.json()
    logUsage({ route: logRoute, model, usage: { input_tokens: data.usage?.prompt_tokens || 0, output_tokens: data.usage?.completion_tokens || 0 } })
    const raw = data.choices?.[0]?.message?.content || ''
    return raw.replace(/```json\n?|```/g, '').trim()
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]

  const firstRaw = await call(messages)
  const firstParsed = JSON.parse(firstRaw)
  if (!firstParsed.slug || !firstParsed.title || !firstParsed.sections?.length) {
    throw new Error('Invalid blog structure — missing slug, title, or sections')
  }

  const firstWordCount = countSectionWords(firstParsed.sections)
  if (firstWordCount >= MIN_WORD_COUNT) return firstParsed

  const thinSections = (firstParsed.sections as Array<{ heading?: string; body?: string }>)
    .map((s, i) => ({ i, heading: s.heading, words: s.body ? s.body.trim().split(/\s+/).filter(Boolean).length : 0 }))
    .filter(s => s.words < 150)

  const retryPrompt = `The article you just wrote totals ${firstWordCount} words across its sections — the minimum is ${MIN_WORD_COUNT}. Rewrite the COMPLETE JSON again, keeping everything that's good, but expanding these sections which are too short:
${thinSections.length > 0 ? thinSections.map(s => `- "${s.heading}" (currently ${s.words} words — add a second concrete example, walk through numbers a different way, or add a common-mistake callout)`).join('\n') : '- Expand every section proportionally — none of them individually is too short, but the total is under the minimum.'}

Do not shorten any section that's already long enough. Do not pad with repetition — add genuine additional value. Return ONLY the complete valid JSON, no markdown fences, same structure as before.

Here is what you wrote:
${firstRaw}`

  try {
    const retryRaw = await call([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
      { role: 'assistant', content: firstRaw },
      { role: 'user', content: retryPrompt },
    ])
    const retryParsed = JSON.parse(retryRaw)
    if (retryParsed.slug && retryParsed.title && retryParsed.sections?.length) {
      const retryWordCount = countSectionWords(retryParsed.sections)
      // Only use the retry if it's actually longer — otherwise fall back to
      // the original rather than risk a worse, still-short rewrite.
      if (retryWordCount > firstWordCount) return retryParsed
    }
  } catch {
    // Retry failed to parse — fall through to the original draft, which
    // the caller's word-count gate will correctly hold for review.
  }

  return firstParsed
}
