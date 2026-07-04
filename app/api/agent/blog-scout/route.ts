import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch, type TavilySearchResponse } from '@/lib/tavily'
import { serperSearch } from '@/lib/serper'
import { logUsage } from '@/lib/log-usage'
import { buildCitableSources, buildArticleContext, citationRulePrompt, findFabricatedCitations, countSectionWords, MIN_WORD_COUNT, generateWithLengthRetry } from '@/lib/scout-citation-guard'

export const runtime = 'nodejs'
export const maxDuration = 800

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const SCOUT_QUERIES = [
  // ── Retail / duka ──────────────────────────────────────────────────────────
  { query: 'duka shopkeeper Kenya losing money poor record keeping', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'Kenya kiosk business stock theft shrinkage small shop', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'Kenya shopkeeper credit sales customers not paying deni', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'Kenya small shop stock count phone inventory 2026', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },

  // ── Mama mboga / mama ntilie / food ─────────────────────────────────────────
  { query: 'mama mboga vegetable vendor Kenya daily profit tracking', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },
  { query: 'mama ntilie food kiosk Kenya pricing profit margin', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },
  { query: 'Nairobi market trader wholesale stock cash Kenya 2026', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },

  // ── Jua kali / artisans ──────────────────────────────────────────────────────
  { query: 'jua kali artisan Kenya Kamukunji pricing a job costing', cluster: 'Kenya Micro Business', pillar: 'Jua Kali & Trades' },
  { query: 'welder carpenter fundi Kenya business finances tracking', cluster: 'Kenya Micro Business', pillar: 'Jua Kali & Trades' },
  { query: 'Kenya informal manufacturer small workshop material cost', cluster: 'Kenya Micro Business', pillar: 'Jua Kali & Trades' },

  // ── Transport: boda boda / matatu ────────────────────────────────────────────
  { query: 'boda boda rider Kenya daily income fuel expense tracking', cluster: 'Kenya Micro Business', pillar: 'Boda Boda & Transport' },
  { query: 'matatu sacco Kenya daily collections record keeping', cluster: 'Kenya Micro Business', pillar: 'Boda Boda & Transport' },

  // ── Salon / beauty / tailoring / mitumba ─────────────────────────────────────
  { query: 'salon barbershop Kenya daily takings client tracking', cluster: 'Kenya Micro Business', pillar: 'Salon & Personal Care' },
  { query: 'mitumba second hand clothes trader Kenya stock tracking', cluster: 'Kenya Micro Business', pillar: 'Mitumba & Tailoring' },
  { query: 'tailor fundi cherehani Kenya order and payment tracking', cluster: 'Kenya Micro Business', pillar: 'Mitumba & Tailoring' },

  // ── Agrovet / smallholder farming ────────────────────────────────────────────
  { query: 'agrovet farm inputs shop Kenya credit customers deni', cluster: 'Kenya Micro Business', pillar: 'Agrovet & Farming' },
  { query: 'small scale farmer Kenya selling produce cash tracking', cluster: 'Kenya Micro Business', pillar: 'Agrovet & Farming' },
  { query: 'Kenya hardware shop credit sales customer debt tracking', cluster: 'Kenya Micro Business', pillar: 'Hardware & Building' },

  // ── Chama / savings groups / mobile money ────────────────────────────────────
  { query: 'chama savings group Kenya record keeping accountability', cluster: 'Kenya Micro Business', pillar: 'Chama & Group Savings' },
  { query: 'M-Pesa till reconciliation Kenya small business shop', cluster: 'Kenya Micro Business', pillar: 'Mobile Money' },
  { query: 'Kenya small business multiple M-Pesa accounts confusion cash', cluster: 'Kenya Micro Business', pillar: 'Mobile Money' },

  // ── Financial literacy / informal sector struggles ───────────────────────────
  { query: 'Kenya jua kali micro business financial literacy struggle', cluster: 'Kenya Micro Business', pillar: 'Financial Literacy' },
  { query: 'Kenya informal sector business collapse poor bookkeeping', cluster: 'Kenya Micro Business', pillar: 'Financial Literacy' },
  { query: 'Kenya micro business no accountant simple bookkeeping', cluster: 'Kenya Micro Business', pillar: 'Financial Literacy' },
  { query: 'Kenya small business seasonal cash flow school fees January', cluster: 'Kenya Micro Business', pillar: 'Seasonal Cash Flow' },

  // ── Buyer-intent queries ──────────────────────────────────────────────────
  { query: 'how to track daily sales without a notebook Kenya duka', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'how mama mboga can track profit simple way Kenya', cluster: 'Kenya Micro Business', pillar: 'Food & Market Trading' },
  { query: 'how to know who owes you money shop Kenya deni', cluster: 'Kenya Micro Business', pillar: 'Credit & Deni Tracking' },
  { query: 'best way small business Kenya track stock using phone', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
  { query: 'how jua kali artisan should price a job correctly Kenya', cluster: 'Kenya Micro Business', pillar: 'Jua Kali & Trades' },
  { query: 'how boda boda rider can track fuel and income Kenya', cluster: 'Kenya Micro Business', pillar: 'Boda Boda & Transport' },
  { query: 'simple bookkeeping for Kenya shopkeeper with no accountant', cluster: 'Kenya Micro Business', pillar: 'Financial Literacy' },
  { query: 'how to stop losing money in a small shop Kenya duka', cluster: 'Kenya Micro Business', pillar: 'Duka & Retail' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const authHeader = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runBlogScout()
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runBlogScout()
}

async function runBlogScout() {
  const runId = `blog_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Blog scout starting — checking recent topics to avoid repeats...')

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
      .like('run_id', 'blog_%')
      .not('run_id', 'like', 'blog_%_%') // excludes blog_mktg_*, blog_ea_*, blog_us_*
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      log.push(`Already ran today (${today}) — skipping to avoid duplicates`)
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today, log })
    }

    // Fetch recent coverage for topic dedup and relatedSlugs context
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: recentPosts }, { data: publishedPosts }] = await Promise.all([
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
    ])

    // Build dedup sets
    const recentQueryWords = new Set<string>()
    const recentClusterCount: Record<string, number> = {}
    for (const p of recentPosts || []) {
      if (p.source_query) {
        p.source_query.toLowerCase().split(/\s+/).forEach((w: string) => recentQueryWords.add(w))
      }
      const cluster = (p.content as Record<string, unknown>)?.cluster as string | undefined
      if (cluster) recentClusterCount[cluster] = (recentClusterCount[cluster] || 0) + 1
    }

    // Existing slugs for dedup
    const existingSlugs = new Set<string>(
      (publishedPosts || []).map(p => (p.content as Record<string, unknown>)?.slug as string | undefined).filter(Boolean) as string[]
    )

    // Recent published posts for relatedSlugs context (title + slug)
    const recentPublished: { slug: string; title: string; cluster: string }[] = (publishedPosts || [])
      .map(p => {
        const c = p.content as Record<string, unknown>
        return { slug: c?.slug as string, title: c?.title as string, cluster: c?.cluster as string }
      })
      .filter(p => p.slug && p.title)

    // Score topic freshness: deprioritise clusters covered 3+ times in last 30 days
    const scoredQueries = SCOUT_QUERIES.map(q => {
      const clusterPenalty = (recentClusterCount[q.cluster] || 0) >= 3 ? 1 : 0
      // Count shared words with recent queries (rough similarity signal)
      const queryWords = q.query.toLowerCase().split(/\s+/)
      const overlap = queryWords.filter(w => w.length > 4 && recentQueryWords.has(w)).length
      const overlapPenalty = overlap >= 4 ? 2 : overlap >= 2 ? 1 : 0
      return { ...q, penalty: clusterPenalty + overlapPenalty }
    })

    // Sort by penalty ascending (freshest topics first), then shuffle within same penalty tier
    scoredQueries.sort((a, b) => a.penalty - b.penalty || Math.random() - 0.5)
    // 5 topics couldn't safely finish within Vercel's 300s function limit
    // once Groq's real TPM rate limit is respected — 3 fits with margin.
    const selected = scoredQueries.slice(0, 3)

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
        // Try Tavily first
        let searchResult = await tavilySearch(s.query, {
          searchDepth: 'advanced',
          maxResults: 5,
          includeAnswer: true,
          topic: 'news',
          days: 14,
        })

        // Fall back to Serper if Tavily returns nothing
        if (!searchResult?.results?.length) {
          const serperRes = await serperSearch(s.query, { type: 'news', num: 5 })
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
            log.push(`Serper fallback used for: "${s.query}"`)
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

    // Pacing against Groq's per-minute token cap happens inside writeBlogPost
    // via waitForGroqBudget — safe to dispatch all topics concurrently here.
    const blogResults = await Promise.allSettled(
      validResults.map(r => writeBlogPost(r, recentPublished))
    )

    const inserts: Record<string, unknown>[] = []

    for (let i = 0; i < blogResults.length; i++) {
      const result = blogResults[i]
      const source = validResults[i]
      const topArticle = source.searchResult!.results[0]

      if (result.status === 'fulfilled' && result.value) {
        // Deduplicate slug against existing published posts + this run's inserts
        let slug = result.value.slug as string
        if (existingSlugs.has(slug)) {
          const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '')
          slug = `${slug}-${dateSuffix}`
          result.value = { ...result.value, slug }
        }
        existingSlugs.add(slug)

        const citableSources = (result.value as Record<string, unknown>)._citableSources as string[] | undefined
        delete (result.value as Record<string, unknown>)._citableSources

        const fabricated = findFabricatedCitations(result.value.sections, citableSources || [], { allowedNames: ['AskBiz'] })
        const wordCount = countSectionWords(result.value.sections)
        const isThin = wordCount < MIN_WORD_COUNT
        const quality = scoreBlogQuality(result.value)
        // Auto-publish if quality is high AND no ungrounded attributions were
        // found — a fabricated "According to Reuters..." is worse than a
        // low-quality article, so it always forces human review regardless
        // of how well the article otherwise scores.
        const status = quality >= 80 && fabricated.length === 0 && !isThin ? 'published' : 'pending'
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
        const autoPublished = inserts.filter(i => i.status === 'published').length
        const pendingReview = inserts.filter(i => i.status === 'pending').length
        log.push(`Saved ${inserts.length} blogs — ${autoPublished} auto-published, ${pendingReview} pending review`)
      }
    }

    log.push(`Blog scout complete. ${inserts.length}/${validResults.length} blogs generated.`)

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

async function writeBlogPost(input: SearchInput, recentPublished: RecentPost[] = []) {
  const { query, cluster, pillar, searchResult } = input
  const articles = searchResult.results.slice(0, 5)
  const aiSummary = searchResult.answer || ''

  const articleContext = buildArticleContext(articles)

  // Whitelist of publication names the model is allowed to name — anything else
  // gets stripped post-generation, since an LLM given thin 500-char snippets
  // and told to "name real companies, real regulations" will otherwise invent
  // plausible-sounding attributions ("According to Reuters...") that were
  // never actually in the source material.
  const citableSources = buildCitableSources(articles)

  // Provide Alice with recent published posts for relatedSlugs selection
  const relatedContext = recentPublished.length > 0
    ? `\nRECENT PUBLISHED POSTS (for relatedSlugs — pick 2-3 most topically relevant):\n${
        recentPublished.slice(0, 20).map(p => `- slug: "${p.slug}" | "${p.title}" [${p.cluster}]`).join('\n')
      }\n`
    : ''

  const _SYSTEM_ = `You are Alice Watson, AskBiz's SEO & Financial Inclusion Correspondent for Kenya. You write for the millions of Kenyans running micro and informal businesses — duka owners, mama mboga, jua kali artisans, boda boda riders, salon owners, tailors, market traders — who are good at their trade but were never taught bookkeeping, and who are losing real money every week because they can't answer "did I actually make a profit today?" You are an SEO optimisation expert: every post is built to rank and to be cited by AI answer engines, while staying genuinely useful to someone running a duka on thin margins. Your style:

VOICE & TONE:
- You write for someone who left formal schooling early or never had a bookkeeping lesson in their life — not for an MBA. No jargon without an immediate plain-English explanation.
- You lead with the specific problem, not a lecture: "You sold KSh 8,400 of stock today. You have KSh 6,100 in the till. Where did the other KSh 2,300 go?" — not "Cash reconciliation is important for small businesses."
- You use short, punchy sentences. You break up walls of text. Nobody reading this has time for a wall of text.
- You're direct and warm, like a trusted neighbour who understands numbers, not a bank manager talking down to them
- You use contrasts: "Last month you thought you made KSh 12,000. When we actually counted, it was KSh 4,000. Here's where the rest went."
- You use real Kenyan business language naturally and explain it once on first use: duka, deni (credit owed to you), mama mboga, jua kali, boda boda, chama, fundi, mitumba — write for readers who use these words every day, and for readers who don't yet know them
- Currency: KSh (Kenyan Shillings) always, written in full the first time in a section ("KSh 4,200"), then KSh thereafter
- You name real companies, real regulations, real numbers — but ONLY when they appear in the source articles provided below
${citationRulePrompt(citableSources, articles.length)}
- You never use: "landscape", "leverage", "synergy", "holistic", "ecosystem", "unlock", "empower", "seamless", "cutting-edge", "game-changer", "robust"
- You sound like someone who has sat at the counter of a duka in Gikomba or Kawangware and watched exactly how money disappears — not a blog post written from an office

ANTI-AI WRITING RULES (these patterns get content flagged as AI-generated — avoid every single one):
- Never open a post or section with: "In today's...", "In an era of...", "As businesses navigate...", "With the rise of..."
- Never use: "It's worth noting", "It's important to remember", "It's no secret", "needless to say", "at the end of the day"
- Never use filler transitions: "Furthermore", "Moreover", "Additionally", "In conclusion", "To summarise", "In summary"
- Em-dash (—) maximum once per 400 words. Em-dash overuse is the single biggest AI tell.
- Never round numbers when specifics exist. "63% of dukas" beats "most shops". "KSh 4,200/week" beats "thousands of shillings".
- Vary sentence length sharply. Short. Then a longer sentence that carries the weight of the explanation and gives the reader real context. Short again. Never three long sentences in a row.
- Write to "you" not "business owners" or "traders" — direct second person throughout
- Never start two consecutive paragraphs with the same word
- No hedging constructions: "This may help...", "Consider whether...", "You might want to..."
- Lead every section with a fact, a number, or a tension — not scene-setting prose
- One concrete example per major section: a real business type in a real Kenyan town or estate, a real KSh number, a real outcome — not "a typical trader"

WORD COUNT — THIS IS A HARD REQUIREMENT, NOT A SUGGESTION:
- The finished article MUST be between 1,200 and 1,500 words across the sections. This is checked automatically after you write it — articles under 1,200 words are rejected and never published, wasting the whole run.
- Every section has a minimum word count listed below. If you're unsure you've hit it, do not stop — add a second concrete example, walk through the numbers a different way, or add a common-mistake callout. Never end a section short just because you've made the main point once.
- Do not pad with repetition or filler to hit the count — add genuine additional value: another worked example, a second scenario (a different sector), a specific number you haven't used yet.

AEO / AI CITATION RULES (makes the article citable by ChatGPT, Perplexity, Claude):
- Write H2s as questions where the article answers them: "How do you know if your duka actually made a profit today?", "What is deni and why does it sink small shops?", "How much stock should a mama mboga carry before market day?"
- Define key terms on first use in one clear sentence — AI engines extract these as direct answers
- Include at least one "quick answer" paragraph (2–3 sentences) near the top that directly answers the core question
- Use specific numbers, dates, and named sources — vague claims don't get cited

CONTENT TYPE: Match the format to the topic. Use one of: Guide, How-To, Comparison, Explainer, Report. A "how to" query needs step-by-step sections. A news/trend topic needs a briefing-style report. Reflect this in the title and section structure.

ASKBIZ PRODUCT KNOWLEDGE (use this naturally — never dump it all):
AskBiz is an AI business tool built so a duka owner, mama mboga, or jua kali artisan can track their real financial position without any accounting knowledge. Key capabilities relevant to Kenya's micro and informal sector:
- ASK: Owners type or speak plain-Swahili-or-English questions ("Ni nani ananidai pesa?" / "Who owes me money?", "Did I make a profit today?", "How much stock do I have left?") and get instant, specific answers
- DAILY TALLY: Records every sale and expense as it happens — from a phone, works on low-end Android, works with patchy data — and shows a simple end-of-day picture: what came in, what went out, what's left
- M-PESA INTEGRATION: Reconciles till and paybill transactions automatically, so an owner juggling cash and M-Pesa doesn't have to manually match every entry
- DENI (CREDIT) TRACKING: Tracks exactly who owes what and since when, and sends a reminder — the single biggest reason informal businesses run out of cash is untracked credit sales
- STOCK TRACKING: Photograph-based stock counting and low-stock alerts — no barcode scanner or spreadsheet needed
- OFFLINE-FIRST: Keeps working when there's no signal, syncs when connection returns — built for real Kenyan network conditions, not assuming constant 4G
- NO ACCOUNTING KNOWLEDGE REQUIRED: No debits, credits, or ledgers — just plain answers to the questions an owner actually has
- CHAMA & GROUP RECORDS: Simple shared record-keeping for savings groups and chamas, so contributions and payouts are transparent to every member
- PRICING: Built to be affordable for a business making a few thousand shillings a day, with a free tier to start

When mentioning AskBiz in the post, pick 1-2 specific features that directly solve the problem in the article. Show a realistic scenario — a duka owner or mama mboga asking a real question and getting a specific answer with real KSh figures. Don't list features.`
  const userPrompt = `Write a blog post based on today's market intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}
Source articles:
${articleContext}
${relatedContext}
The six section bodies below must total 1200+ words combined — do not compress or shorten them to save space. Write every section to its full stated word count.

Return ONLY valid JSON (no markdown fences):
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars",
  "title": "Sharp, specific title under 65 chars — include the primary keyword near the start",
  "metaDescription": "Active voice, 120-155 chars, primary keyword in first 20 words, makes the reader want to click",
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The problem. The impact in KSh. What to do about it.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete number, real scenario, or tension — not the topic name", "level": 2, "body": "MUST BE AT LEAST 280 WORDS — this is checked and short sections get the whole article rejected. Open with a specific KSh figure or a real situation (a duka running out of stock mid-week, a mama mboga who can't tell if she made money today). Set the stakes in the first sentence. Use a contrast structure: what most owners assume, what's actually true, why it matters."},
    {"heading": "What this actually costs a small business in Kenya each month", "level": 2, "body": "MUST BE AT LEAST 280 WORDS. Translate the problem into a concrete KSh cost. Use a specific business scenario — 'a duka in Kawangware doing KSh 15,000/day', 'a mama mboga in Gikomba market', 'a boda boda rider covering 80km a day' — not 'businesses' or 'traders' in general. Quantify the impact in shillings, percentages, or hours lost."},
    {"heading": "The three things owners who don't lose money to this are doing", "level": 2, "body": "MUST BE AT LEAST 280 WORDS. 3 specific, practical tactics an owner can start today — no smartphone-app jargon, no accounting jargon. Name exactly what to do, when, and how often. Each tactic should be concrete enough to act on immediately, e.g. 'count your till against your notebook every closing time, not once a week.'"},
    {"heading": "A concrete heading showing AskBiz solving this exact problem", "level": 2, "body": "MUST BE AT LEAST 220 WORDS. Open with a scene: a duka owner or mama mboga asks AskBiz a specific question — give the exact question text, in plain English or a natural Swahili-English mix. Describe what AskBiz shows: which feature responds, what the answer looks like, what decision it makes possible. Be specific with real KSh numbers — 'AskBiz shows: 3 customers owe you a total of KSh 4,800 in deni, two of them over 3 weeks old.'"},
    {"heading": "The warning signs this is already happening in your business", "level": 2, "body": "AT LEAST 160 WORDS. 3-4 specific, checkable signals — things an owner can look for in their own till, notebook, or stock today, not vague symptoms."},
    {"heading": "What to do this week", "level": 2, "body": "AT LEAST 160 WORDS. One primary action to take before the weekend. One thing to set up once. One thing to check daily going forward. Be specific and practical — no 'consider' or 'think about'."}
  ],
  "paa": [
    {"q": "Exact Google search query about the primary problem in this post, in the way a Kenyan small business owner would actually search it", "a": "40-70 word direct answer. Lead with the key action or fact. Cite a specific KSh number if available from the sources. End with what owners who get this right do differently."},
    {"q": "Second high-volume search query about a sub-topic in this post", "a": "40-70 word direct answer. Factual, complete sentence. No cliffhangers."},
    {"q": "Third search query an owner would type when facing this problem", "a": "40-70 word direct answer. Include a specific benchmark, KSh figure, or timeframe if relevant."},
    {"q": "A 'what is' or 'how does' question about the core concept in this post (e.g. what deni means, how a chama works)", "a": "40-70 word direct answer. Plain English definition, grounded in real Kenyan micro-business context."},
    {"q": "How does AskBiz help with [specific problem from this post]?", "a": "40-70 words. Name the exact AskBiz feature. Describe what it shows or does. Give a specific example with real KSh figures."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz. Then: 'Try it free — ask your first question in 30 seconds.'"
  },
  "author": {
    "name": "Alice Watson",
    "role": "SEO & Financial Inclusion Correspondent, Kenya",
    "bio": "Alice Watson covers Kenya's micro and informal business sector for AskBiz — dukas, mama mboga, jua kali artisans, boda boda riders, and everyone running a business without a bookkeeping lesson to their name. She turns real money problems into briefings owners can act on the same day."
  }
}`

  // The requested article is ~1,380 words of body copy (per-section minimums
  // above) plus title, metaDescription, tldr, 5 PAA answers, and a CTA —
  // comfortably over 1,600 words of total content. At ~1.4 tokens/word plus
  // JSON escaping overhead, 3000 tokens was forcing truncation. If the model
  // still undershoots the word floor with 6500 tokens of room,
  // generateWithLengthRetry sends one follow-up asking it to expand the
  // short sections rather than accepting a thin first draft. Every call it
  // makes is paced against Groq's real per-minute token cap internally.
  const parsed = await generateWithLengthRetry({
    groqUrl: GROQ_URL,
    apiKey: process.env.GROQ_API_KEY!,
    model: GROQ_MODEL,
    maxTokens: 6500,
    systemPrompt: _SYSTEM_,
    userPrompt,
    logRoute: 'agent/blog-scout',
    logUsage,
  })

  if (!parsed.slug || !parsed.title || !parsed.sections?.length) {
    throw new Error('Invalid blog structure — missing slug, title, or sections')
  }

  // Always use today's date — model may pick the date of a news event instead
  parsed.publishDate = new Date().toISOString().slice(0, 10)

  // Carry the whitelist through so the publish gate can check for fabricated
  // attributions — the caller strips this before saving to the DB.
  parsed._citableSources = citableSources

  return parsed
}

function scoreBlogQuality(blog: Record<string, unknown>): number {
  let score = 0

  // Title: 20-70 chars, doesn't start with a generic word
  if (blog.title && typeof blog.title === 'string') {
    const t = blog.title
    if (t.length >= 20 && t.length <= 70) score += 12
    // Penalise generic openers
    if (!/^(the|a |an |how |what |why |is |are |top |best )/i.test(t)) score += 3
  }

  // Slug: keyword-rich, reasonable length
  if (blog.slug && typeof blog.slug === 'string' && blog.slug.length >= 15 && blog.slug.length <= 65) score += 8

  // Meta description: 120-155 chars
  if (blog.metaDescription && typeof blog.metaDescription === 'string') {
    const len = blog.metaDescription.length
    if (len >= 120 && len <= 155) score += 10
    else if (len >= 80) score += 5
  }

  // TLDR: at least 80 chars
  if (blog.tldr && typeof blog.tldr === 'string' && blog.tldr.length >= 80) score += 8

  // Tags: 4+ tags
  if (Array.isArray(blog.tags) && blog.tags.length >= 4) score += 5

  // Sections: at least 5 sections with substantial bodies
  const sections = blog.sections as Array<{ heading?: string; body?: string }> | undefined
  if (Array.isArray(sections)) {
    if (sections.length >= 5) score += 10
    const totalWords = sections.reduce((sum, s) => sum + (s.body?.split(/\s+/).length || 0), 0)
    if (totalWords >= 1000) score += 15
    else if (totalWords >= 700) score += 8
    // All sections have heading + substantial body
    if (sections.every(s => s.heading && s.body && s.body.length > 100)) score += 8
  }

  // PAA: 4+ questions with substantive answers (>150 chars each)
  const paa = blog.paa as Array<{ q?: string; a?: string }> | undefined
  if (Array.isArray(paa)) {
    if (paa.length >= 4) score += 8
    const substantiveAnswers = paa.filter(p => p.q && p.a && p.a.length >= 150).length
    if (substantiveAnswers >= 3) score += 7
    else if (substantiveAnswers >= 2) score += 3
  }

  // CTA present
  if (blog.cta && typeof blog.cta === 'object') score += 3

  // relatedSlugs present (boosts internal linking)
  if (Array.isArray(blog.relatedSlugs) && blog.relatedSlugs.length >= 1) score += 3

  return Math.min(score, 100)
}

async function pingSitemapServices() {
  const sitemapUrl = 'https://askbiz.co/sitemap.xml'
  await Promise.allSettled([
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
    fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
  ])
}
