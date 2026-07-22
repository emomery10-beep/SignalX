import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch, type TavilySearchResponse } from '@/lib/tavily'
import { serperSearch } from '@/lib/serper'
import { logUsage } from '@/lib/log-usage'
import { buildCitableSources, buildArticleContext, citationRulePrompt, findFabricatedCitations, countSectionWords, MIN_WORD_COUNT, generateWithLengthRetry } from '@/lib/scout-citation-guard'

export const runtime = 'nodejs'
export const maxDuration = 800

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

// Same proven Kenya micro-business topic pool Alice already covers in
// English — Shiillah covers it again in native Swahili with a different
// voice, doubling coverage rather than competing with her for the same
// keywords. Query text stays English: these are just search-engine inputs
// to Tavily/Serper, not reader-facing copy.
const SCOUT_QUERIES = [
  { query: 'duka shopkeeper Kenya losing money poor record keeping', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'Kenya kiosk business stock theft shrinkage small shop', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'Kenya shopkeeper credit sales customers not paying deni', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'Kenya small shop stock count phone inventory 2026', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'mama mboga vegetable vendor Kenya daily profit tracking', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },
  { query: 'mama ntilie food kiosk Kenya pricing profit margin', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },
  { query: 'Nairobi market trader wholesale stock cash Kenya 2026', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },
  { query: 'jua kali artisan Kenya Kamukunji pricing a job costing', cluster: 'Kenya Micro Business', pillar: 'Jua Kali & Trades' },
  { query: 'welder carpenter fundi Kenya business finances tracking', cluster: 'Kenya Micro Business', pillar: 'Jua Kali & Trades' },
  { query: 'Kenya informal manufacturer small workshop material cost', cluster: 'Kenya Micro Business', pillar: 'Jua Kali & Trades' },
  { query: 'boda boda rider Kenya daily income fuel expense tracking', cluster: 'Kenya Micro Business', pillar: 'Boda Boda & Transport' },
  { query: 'matatu sacco Kenya daily collections record keeping', cluster: 'Kenya Micro Business', pillar: 'Boda Boda & Transport' },
  { query: 'salon barbershop Kenya daily takings client tracking', cluster: 'Kenya Micro Business', pillar: 'Salon & Personal Care' },
  { query: 'mitumba second hand clothes trader Kenya stock tracking', cluster: 'Kenya Micro Business', pillar: 'Mitumba & Tailoring' },
  { query: 'tailor fundi cherehani Kenya order and payment tracking', cluster: 'Kenya Micro Business', pillar: 'Mitumba & Tailoring' },
  { query: 'agrovet farm inputs shop Kenya credit customers deni', cluster: 'Kenya Micro Business', pillar: 'Agrovet & Farming' },
  { query: 'small scale farmer Kenya selling produce cash tracking', cluster: 'Kenya Micro Business', pillar: 'Agrovet & Farming' },
  { query: 'Kenya hardware shop credit sales customer debt tracking', cluster: 'Kenya Micro Business', pillar: 'Hardware & Building' },
  { query: 'chama savings group Kenya record keeping accountability', cluster: 'Kenya Micro Business', pillar: 'Chama & Group Savings' },
  { query: 'M-Pesa till reconciliation Kenya small business shop', cluster: 'Kenya Micro Business', pillar: 'Mobile Money' },
  { query: 'Kenya small business multiple M-Pesa accounts confusion cash', cluster: 'Kenya Micro Business', pillar: 'Mobile Money' },
  { query: 'Kenya jua kali micro business financial literacy struggle', cluster: 'Kenya Micro Business', pillar: 'Financial Literacy' },
  { query: 'Kenya informal sector business collapse poor bookkeeping', cluster: 'Kenya Micro Business', pillar: 'Financial Literacy' },
  { query: 'Kenya micro business no accountant simple bookkeeping', cluster: 'Kenya Micro Business', pillar: 'Financial Literacy' },
  { query: 'Kenya small business seasonal cash flow school fees January', cluster: 'Kenya Micro Business', pillar: 'Seasonal Cash Flow' },
  { query: 'how to track daily sales without a notebook Kenya duka', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'how mama mboga can track profit simple way Kenya', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },
  { query: 'how to know who owes you money shop Kenya deni', cluster: 'Kenya Micro Business', pillar: 'Credit & Deni Tracking' },
  { query: 'best way small business Kenya track stock using phone', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'how boda boda rider can track fuel and income Kenya', cluster: 'Kenya Micro Business', pillar: 'Boda Boda & Transport' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const authHeader = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runShiillahScout()
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runShiillahScout()
}

async function runShiillahScout() {
  const runId = `blog_sw_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Shiillah anachunguza habari za leo za biashara ndogo Kenya...')

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Skip if already ran today — prevents double-posting when the orchestrator
    // cron and a manual "Run Now" both fire on the same day.
    const today = new Date().toISOString().slice(0, 10)
    const { count: todayCount } = await supabase
      .from('agent_content')
      .select('id', { count: 'exact', head: true })
      .like('run_id', 'blog_sw_%')
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      log.push(`Already ran today (${today}) — skipping to avoid duplicates`)
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today, log })
    }

    // Own type+run_id-prefix pair for both the dedup read and the published-slug
    // lookup below — Alice's blog_% exclusion trick isn't needed since this is
    // Shiillah's own dedicated prefix from day one.
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: recentPosts }, { data: publishedPosts }] = await Promise.all([
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog').like('run_id', 'blog_sw_%').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog').like('run_id', 'blog_sw_%').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
    ])

    const recentQueryWords = new Set<string>()
    const recentClusterCount: Record<string, number> = {}
    for (const p of recentPosts || []) {
      if (p.source_query) {
        p.source_query.toLowerCase().split(/\s+/).forEach((w: string) => recentQueryWords.add(w))
      }
      const cluster = (p.content as Record<string, unknown>)?.cluster as string | undefined
      if (cluster) recentClusterCount[cluster] = (recentClusterCount[cluster] || 0) + 1
    }

    const existingSlugs = new Set<string>(
      (publishedPosts || []).map(p => (p.content as Record<string, unknown>)?.slug as string | undefined).filter(Boolean) as string[]
    )

    const recentPublished: { slug: string; title: string; cluster: string }[] = (publishedPosts || [])
      .map(p => {
        const c = p.content as Record<string, unknown>
        return { slug: c?.slug as string, title: c?.title as string, cluster: c?.cluster as string }
      })
      .filter(p => p.slug && p.title)

    const scoredQueries = SCOUT_QUERIES.map(q => {
      const clusterPenalty = (recentClusterCount[q.cluster] || 0) >= 3 ? 1 : 0
      const queryWords = q.query.toLowerCase().split(/\s+/)
      const overlap = queryWords.filter(w => w.length > 4 && recentQueryWords.has(w)).length
      const overlapPenalty = overlap >= 4 ? 2 : overlap >= 2 ? 1 : 0
      return { ...q, penalty: clusterPenalty + overlapPenalty }
    })

    scoredQueries.sort((a, b) => a.penalty - b.penalty || Math.random() - 0.5)
    // Each topic is its own independent Groq call, sized on its own — the
    // per-request 413 below was caused by prompt+maxTokens size, not by
    // running multiple topics per invocation. Still matching Victor/
    // Carolyne/Ben's conservative 1-per-run pace for now (rather than 2)
    // since Swahili's real per-call cost on this model is still unproven in
    // production; raise it once logUsage shows consistent headroom.
    const selected = scoredQueries.slice(0, 1)

    log.push(`Selected ${selected.length} topics (${selected.filter(s => s.penalty === 0).length} fresh, ${selected.filter(s => s.penalty > 0).length} revisits)`)
    const hasTavily = !!process.env.TAVILY_API_KEY
    const hasSerper = !!process.env.SERPER_API_KEY
    if (!hasTavily && !hasSerper) {
      log.push('ERROR: No search keys set — add TAVILY_API_KEY or SERPER_API_KEY to Vercel env vars')
      return NextResponse.json({ success: false, log }, { status: 200 })
    }
    log.push(`Searching ${hasTavily ? 'Tavily' : ''}${hasTavily && hasSerper ? ' + ' : ''}${hasSerper ? 'Serper' : ''} for live data...`)

    const searchResults = await Promise.allSettled(
      selected.map(async s => {
        let searchResult = await tavilySearch(s.query, {
          searchDepth: 'advanced',
          maxResults: 5,
          includeAnswer: true,
          topic: 'news',
          days: 14,
        })

        if (!searchResult?.results?.length) {
          // Most of these topics are evergreen, not news events — try news
          // (freshest) then general search (broader) before giving up.
          for (const type of ['news', 'search'] as const) {
            const serperRes = await serperSearch(s.query, { type, num: 5 })
            if (serperRes?.organic?.length) {
              searchResult = {
                query: s.query,
                results: serperRes.organic.map(r => ({
                  title: r.title,
                  url: r.link,
                  content: r.snippet,
                  score: 1,
                  published_date: r.date,
                })),
                answer: serperRes.answerBox?.snippet || serperRes.answerBox?.answer || '',
                response_time: 0,
              } satisfies TavilySearchResponse
              log.push(`Serper ${type} fallback used for: "${s.query}"`)
              break
            }
          }
        }

        return { ...s, searchResult }
      })
    )

    const validResults = searchResults
      .filter((r): r is PromiseFulfilledResult<typeof selected[0] & { searchResult: TavilySearchResponse }> =>
        r.status === 'fulfilled' && !!r.value.searchResult?.results?.length
      )
      .map(r => r.value)

    const rejectedCount = searchResults.filter(r => r.status === 'rejected').length
    const nullCount = searchResults.filter(r => r.status === 'fulfilled' && !r.value.searchResult?.results?.length).length
    if (rejectedCount > 0) log.push(`${rejectedCount} requests threw errors`)
    if (nullCount > 0) log.push(`${nullCount} queries returned no results from Tavily or Serper`)

    if (validResults.length === 0) {
      log.push('No search results from any query — exiting')
      return NextResponse.json({ success: false, log, reason: 'no_results' })
    }

    log.push(`Got results for ${validResults.length}/${selected.length} queries. Writing blogs...`)

    const blogResults = await Promise.allSettled(
      validResults.map(r => writeShiillahBlogPost(r, recentPublished))
    )

    const inserts: Record<string, unknown>[] = []

    for (let i = 0; i < blogResults.length; i++) {
      const result = blogResults[i]
      const source = validResults[i]
      const topArticle = source.searchResult!.results[0]

      if (result.status === 'fulfilled' && result.value) {
        let slug = result.value.slug as string
        if (existingSlugs.has(slug)) {
          const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '')
          slug = `${slug}-${dateSuffix}`
          result.value = { ...result.value, slug }
        }
        existingSlugs.add(slug)

        const citableSources = (result.value as Record<string, unknown>)._citableSources as string[] | undefined
        delete (result.value as Record<string, unknown>)._citableSources

        const fabricated = findFabricatedCitations(result.value.sections, citableSources || [], { allowedNames: ['AskBiz', 'Utauza'] })
        const wordCount = countSectionWords(result.value.sections)
        const isThin = wordCount < MIN_WORD_COUNT
        const quality = scoreShiillahBlogQuality(result.value)

        // Shiillah is the first agent writing in Swahili rather than English —
        // scoreShiillahBlogQuality checks length/structure heuristics only, not
        // Swahili fluency or grammar, so every draft holds for human review
        // regardless of score until that's been checked against real output.
        // Flip to the same quality>=80 auto-publish gate every other agent uses
        // once several batches have been reviewed and read naturally.
        const status = 'pending'
        if (fabricated.length > 0) {
          log.push(`  ⚠ "${result.value.title}" cites unverified source(s): ${fabricated.join('; ')} — held for review`)
        }
        if (isThin) {
          log.push(`  ⚠ "${result.value.title}" is thin (${wordCount} words, needs ${MIN_WORD_COUNT}) — held for review`)
        }
        inserts.push({
          run_id: runId,
          type: 'blog',
          status,
          content: result.value,
          source_url: topArticle.url,
          source_title: topArticle.title,
          source_query: source.query,
          verdict: 'act',
          verdict_sentence: result.value.tldr?.slice(0, 100) || '',
          key_insight: result.value.metaDescription || '',
        })
        log.push(`✓ Blog ${i + 1}: "${result.value.title}" (quality: ${quality}, status: ${status})`)
      } else {
        const reason = result.status === 'rejected' ? result.reason?.message || String(result.reason) : 'empty result'
        log.push(`✗ Blog ${i + 1} failed: ${reason}`)
      }
    }

    if (inserts.length > 0) {
      const { error } = await supabase.from('agent_content').insert(inserts)
      if (error) {
        log.push(`DB error: ${error.message}`)
      } else {
        log.push(`Saved ${inserts.length} blogs — all held pending review`)
      }
    }

    log.push(`Shiillah complete. ${inserts.length}/${validResults.length} blogs generated.`)

    return NextResponse.json({
      success: true,
      runId,
      blogsGenerated: inserts.length,
      searchesRun: validResults.length,
      log,
    })
  } catch (err) {
    log.push(`Fatal error: ${err instanceof Error ? err.message : String(err)}`)
    return NextResponse.json({ success: false, log, error: String(err) }, { status: 500 })
  }
}

interface SearchInput {
  query: string
  cluster: string
  pillar: string
  penalty?: number
  searchResult: NonNullable<Awaited<ReturnType<typeof tavilySearch>>>
}

type RecentPost = { slug: string; title: string; cluster: string }

async function writeShiillahBlogPost(input: SearchInput, recentPublished: RecentPost[] = []) {
  const { query, cluster, pillar, searchResult } = input
  const articles = searchResult.results.slice(0, 3)
  const aiSummary = (searchResult.answer || '').slice(0, 250)

  const citableSources = buildCitableSources(articles)
  const articleContext = buildArticleContext(articles)

  const relatedContext = recentPublished.length > 0
    ? `\nRECENT PUBLISHED POSTS (for relatedSlugs — pick 2-3 most topically relevant):\n${
        recentPublished.slice(0, 5).map(p => `- slug: "${p.slug}" | "${p.title}" [${p.cluster}]`).join('\n')
      }\n`
    : ''

  // Voice modelled on Kenyan digital-news Swahili journalism (Tuko.co.ke
  // house style): bulleted key-claims lede, attribution-before-quote,
  // formal-moderate register with untranslated loanwords glossed on first
  // use, short-long-short sentence rhythm. Applied to AskBiz's actual Kenya
  // micro-business beat — not to news/current-affairs topics.
  //
  // Instructions below are in English on purpose, even though every OUTPUT
  // field must be Swahili: this account's real Groq TPM ceiling (6000, see
  // groq-rate-limiter.ts) is calibrated for English prompts, and Swahili
  // tokenizes noticeably less efficiently on this model's English-centric
  // vocabulary. Writing instructional/meta text in Swahili added real prompt
  // tokens for zero benefit — the model doesn't need Swahili instructions to
  // produce Swahili output — and a live run confirmed it blew straight
  // through the ceiling (requested 6644 vs a limit of 6000) on the very
  // first call. Keep new instructions here in English; only article content
  // (title/tldr/headings/bodies/paa/cta VALUES) is Swahili.
  const _SYSTEM_ = `You are Shiillah Mwadosho, AskBiz's Swahili Correspondent for Kenya. Every VALUE in the JSON below (title, tldr, section headings and bodies, tags, paa, cta) must be written in Swahili — these instructions are in English, but nothing you output should be. Readers: duka owners, mama mboga, jua kali artisans, boda boda riders, salon owners, tailors, and market traders across Kenya who are good at their trade but were never taught bookkeeping. AskBiz's product for this market is also called Utauza.

VOICE — mimic Kenyan digital-news Swahili journalism (the Tuko.co.ke house style), not a business blog. Write "tldr" as 2-3 short bulleted key-claims in Swahili (each starting with "• "), summarising the core fact before the narrative develops — a mobile-news lede, not flowing prose. Attribution always precedes the fact: name a real source from the articles below, then state what it found — never state the fact first and cite after. Formal-to-moderate register: keep loanwords untranslated (M-Pesa, POS, KRA, VAT, KSh) but gloss any Kenyan business term in Swahili on first use. Sentence rhythm: short declarative opener, then a longer elaborating sentence, then short again — never three long sentences in a row. Compact paragraphs (3-5 sentences). Use real Kenyan business vocabulary naturally: duka, deni, mama mboga, jua kali, boda boda, chama, fundi, mitumba.
${citationRulePrompt(citableSources, articles.length)}
ANTI-AI RULES (in Swahili too): never open with a generic "in today's world" or "many business owners face..." line; no filler transitions used as connective tissue; em-dash max once per 400 words; never round a number when a specific one exists; vary sentence length sharply; address the reader directly, never "business owners" in general; no hedging; lead every section with a fact, number, or tension; one concrete example per section — a real business type in a real Kenyan town/estate, a real KSh figure, a real outcome.

WORD COUNT — HARD REQUIREMENT: sections must total 1,500 Swahili words (a 1,200-word floor is enforced automatically — thinner drafts are rejected and retried once). Never stop a section short — add a second example, walk the numbers differently, or add a common-mistake callout instead of padding with repetition.

AEO: write section headings as questions the article answers, in Swahili. Define key terms on first use in one sentence.

ASKBIZ / UTAUZA (mention naturally, 1-2 features max, with a real KSh scenario, written in Swahili): Utauza is AskBiz's name for the East Africa market — an app that tracks a business's money without needing accounting knowledge. Features you can draw on: ASK (plain Swahili questions like "who owes me money?" get instant answers), DAILY TALLY (records every sale/expense from a phone, works on cheap phones without internet), M-PESA (syncs till/paybill automatically), DENI TRACKING (tracks who owes what and since when), STOCK (count stock by photo, low-stock alerts), OFFLINE (keeps working with no signal, syncs later). Pick 1-2 features that solve this specific problem, with a real KSh scenario — don't list them all.`

  const userPrompt = `Write a blog post entirely in Swahili, based on today's Kenya micro-business intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}Source articles:
${articleContext}
${relatedContext}
The six section bodies below must total 1500+ Swahili words combined — do not compress or shorten them to save space. Write every section to its full stated word count.

Return ONLY valid JSON (no markdown fences). Every text VALUE must be written in Swahili — the field descriptions below are in English, but your answers are not:
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars (Latin characters, Swahili words are fine)",
  "title": "Sharp Swahili headline, under 65 chars, Kenyan digital-news style",
  "metaDescription": "Active voice, 120-155 chars, primary keyword first, in Swahili",
  "readTime": 12,
  "tags": ["swahili-keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "2-3 short bulleted key-claims in Swahili, each starting with \\"• \\" — a news-lede, not an essay.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "A specific question or fact that opens the topic, in Swahili", "level": 2, "body": "300+ Swahili words. Open with a specific KSh figure or real scenario. Show the gap between what owners assume and reality."},
    {"heading": "What this actually costs a small Kenyan business owner every month, in Swahili", "level": 2, "body": "300+ Swahili words. Turn the problem into a real KSh cost using one concrete scenario (e.g. a Kawangware shop selling KSh 15,000/day)."},
    {"heading": "Three things owners who don't lose money on this do differently, in Swahili", "level": 2, "body": "300+ Swahili words. 3 specific, practical tactics an owner can start today — no jargon."},
    {"heading": "A heading showing Utauza solving this exact problem, in Swahili", "level": 2, "body": "250+ Swahili words. Open with a scene: an owner asks Utauza a specific question. Show what Utauza returns, with real KSh figures."},
    {"heading": "Warning signs this is already happening in your business, in Swahili", "level": 2, "body": "180+ Swahili words. 3-4 specific signs an owner can check today."},
    {"heading": "What to do this week, in Swahili", "level": 2, "body": "170+ Swahili words. One thing to do before the weekend, one thing to set up once, one thing to check daily."}
  ],
  "paa": [
    {"q": "A real Google search query about the core problem, as a Kenyan owner would type it, in Swahili", "a": "40-70 Swahili words. Lead with the key fact/action, cite a KSh figure if relevant."},
    {"q": "A second high-search-volume query, in Swahili", "a": "40-70 Swahili words. Factual, complete."},
    {"q": "A third query an owner facing this problem would type, in Swahili", "a": "40-70 Swahili words. Include a benchmark, KSh figure, or timeframe."},
    {"q": "A what-is/how-to query about the core concept, in Swahili", "a": "40-70 Swahili words. Simple explanation, Kenyan context."},
    {"q": "How does Utauza help with [specific problem]?, in Swahili", "a": "40-70 Swahili words. Name the exact feature plus a concrete example with KSh figures."}
  ],
  "cta": {
    "heading": "CTA headline naming the specific problem this post solved, in Swahili",
    "body": "One Swahili sentence connecting this article's insight to Utauza. Then in Swahili: 'Try it free — ask your first question in 30 seconds.'"
  }
}`

  const parsed = await generateWithLengthRetry({
    groqUrl: GROQ_URL,
    apiKey: process.env.GROQ_API_KEY!,
    model: GROQ_MODEL,
    // Matches Alice/Victor/Ben's proven-safe ceiling rather than the original
    // 3600 — that extra +400, stacked on Swahili's real per-token inflation
    // on this model's English-centric tokenizer, is what caused the 413.
    // Trimming the system/user prompts (see comments above) frees up real
    // headroom too, but without a live call to confirm Groq's actual
    // tokenization, matching the already-proven-safe value is the
    // conservative choice. Watch logUsage's real input/output token counts
    // in production and raise this once there's confirmed headroom.
    maxTokens: 3200,
    systemPrompt: _SYSTEM_,
    userPrompt,
    logRoute: 'agent/shiillah-scout',
    logUsage,
  })

  if (!parsed.slug || !parsed.title || !parsed.sections?.length) {
    throw new Error('Invalid blog structure — missing slug, title, or sections')
  }

  parsed.cluster = cluster
  parsed.pillar = pillar
  parsed.publishDate = new Date().toISOString().slice(0, 10)
  parsed.author = {
    name: 'Shiillah Mwadosho',
    role: 'Mwandishi wa Kiswahili, AskBiz (Utauza)',
    bio: 'Shiillah Mwadosho anaandika kwa Kiswahili kwa ajili ya wamiliki wa maduka, mama mboga, mafundi wa jua kali, na waendesha boda boda kote Kenya — akibadilisha matatizo halisi ya pesa kuwa maarifa wanayoweza kutumia siku hiyo hiyo.',
  }
  parsed._citableSources = citableSources

  return parsed
}

function scoreShiillahBlogQuality(blog: Record<string, unknown>): number {
  let score = 0

  if (blog.title && typeof blog.title === 'string') {
    const t = blog.title
    if (t.length >= 20 && t.length <= 70) score += 12
    if (!/^(the|a |an |how |what |why |is |are |top |best )/i.test(t)) score += 3
  }

  if (blog.slug && typeof blog.slug === 'string' && blog.slug.length >= 15 && blog.slug.length <= 65) score += 8

  if (blog.metaDescription && typeof blog.metaDescription === 'string') {
    const len = blog.metaDescription.length
    if (len >= 120 && len <= 155) score += 10
    else if (len >= 80) score += 5
  }

  if (blog.tldr && typeof blog.tldr === 'string' && blog.tldr.length >= 80) score += 8

  if (Array.isArray(blog.tags) && blog.tags.length >= 4) score += 5

  const sections = blog.sections as Array<{ heading?: string; body?: string }> | undefined
  if (Array.isArray(sections)) {
    if (sections.length >= 5) score += 10
    const totalWords = sections.reduce((sum, s) => sum + (s.body?.split(/\s+/).length || 0), 0)
    if (totalWords >= 1300) score += 15
    else if (totalWords >= 900) score += 8
    if (sections.every(s => s.heading && s.body && s.body.length > 100)) score += 8
  }

  const paa = blog.paa as Array<{ q?: string; a?: string }> | undefined
  if (Array.isArray(paa)) {
    if (paa.length >= 4) score += 8
    const substantiveAnswers = paa.filter(p => p.q && p.a && p.a.length >= 150).length
    if (substantiveAnswers >= 3) score += 7
    else if (substantiveAnswers >= 2) score += 3
  }

  if (blog.cta && typeof blog.cta === 'object') score += 3
  if (Array.isArray(blog.relatedSlugs) && blog.relatedSlugs.length >= 1) score += 3

  return Math.min(score, 100)
}
