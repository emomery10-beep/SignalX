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

import { waitForGroqBudget, parseGroqRetryAfterMs } from './groq-rate-limiter'

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

// 320 chars/article (down from 500) — every char here counts directly
// against the 6000 TPM request cap alongside the system prompt and the
// completion budget, and with 3 articles per post this still gives the
// model enough grounding to cite specifics without blowing the budget.
export function buildArticleContext(articles: SourceArticle[]): string {
  return articles
    .map((r, i) => {
      let source = 'unknown'
      try { source = new URL(r.url).hostname.replace(/^www\./, '') } catch { /* keep 'unknown' */ }
      return `[${i + 1}] ${r.title}\nSource: ${source}\nURL: ${r.url}\n${r.content.slice(0, 320)}`
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

// Swahili equivalent — additive, doesn't change matching behaviour for the
// English-writing agents. Added for Shiillah Mwadosho, AskBiz's first
// Swahili-language content agent.
const ATTRIBUTION_RE_SW = /(?:Kwa mujibu wa|Kulingana na|Kama ilivyoripotiwa na|Ripoti ya)\s+([A-Z][A-Za-z0-9&'.\s-]{2,45}?)(?=[,.]|\s+(?:in(?:aeleza|abainisha|aripoti|asema)?|il(?:ieleza|isema|ionyesha)))/g

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
  for (const pattern of [ATTRIBUTION_RE, ATTRIBUTION_RE_SW]) {
    let match: RegExpExecArray | null
    const re = new RegExp(pattern)
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

  // Each call here counts against Groq's real per-minute token cap for the
  // whole account (6000 TPM for llama-3.1-8b-instant on the on-demand tier,
  // per the 413 body) — with 3-5 topics running concurrently, uncoordinated
  // calls blow straight through it. waitForGroqBudget paces every call
  // (initial + the one length-expand retry) against a shared rolling-window
  // budget instead of firing blind. The estimate here must track the actual
  // message size — a flat guess (the old code used a fixed +4300) drifts out
  // of sync the moment prompt length changes and silently lets oversized
  // requests through, which is how this broke last time.
  async function call(messages: Array<{ role: string; content: string }>) {
    const promptTokens = Math.ceil(messages.reduce((sum, m) => sum + m.content.length, 0) / 4)
    for (let attempt = 1; attempt <= 2; attempt++) {
      await waitForGroqBudget(promptTokens + maxTokens)
      const res = await fetch(groqUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, max_tokens: maxTokens, response_format: { type: 'json_object' }, messages }),
      })
      const bodyText = await res.text()
      let data: any
      try {
        data = JSON.parse(bodyText)
      } catch {
        throw new Error(`Groq API returned non-JSON (status ${res.status}): ${bodyText.slice(0, 200)}`)
      }
      if (!res.ok) {
        const msg = `Groq API error ${res.status}: ${data?.error?.message || bodyText.slice(0, 200)}`
        const retryAfterMs = parseGroqRetryAfterMs(msg)
        if (retryAfterMs && attempt === 1) {
          await new Promise(r => setTimeout(r, retryAfterMs))
          continue
        }
        throw new Error(msg)
      }
      logUsage({ route: logRoute, model, usage: { input_tokens: data.usage?.prompt_tokens || 0, output_tokens: data.usage?.completion_tokens || 0 } })
      const raw = data.choices?.[0]?.message?.content || ''
      return raw.replace(/```json\n?|```/g, '').trim()
    }
    throw new Error('Groq API call failed after rate-limit retry')
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

  // Deliberately NOT echoing firstRaw back as assistant context here — that
  // used to roughly double the prompt size (original prompt + the entire
  // first draft), which alone was enough to blow the account's real 6000 TPM
  // cap regardless of how small the initial call was kept. Re-sending the
  // original prompt plus a stronger instruction costs about the same as the
  // first call instead of nearly double, at the cost of the model no longer
  // seeing its own first draft to build on.
  const retryPrompt = `${userPrompt}

Your previous attempt at this only totaled ${firstWordCount} words across its sections — the minimum is ${MIN_WORD_COUNT}. Write it again from scratch, going deeper on every section${thinSections.length > 0 ? `, especially: ${thinSections.map(s => `"${s.heading}"`).join(', ')}` : ''} — add a second concrete example, walk through numbers a different way, or add a common-mistake callout. Do not pad with repetition. Return ONLY the complete valid JSON, no markdown fences.`

  try {
    const retryRaw = await call([
      { role: 'system', content: systemPrompt },
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
