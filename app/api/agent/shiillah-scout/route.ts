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
    // 1500-word Swahili articles cost more completion tokens than Alice's
    // 1200-1500 English ones — 2 topics fits Vercel's function limit and
    // Groq's real TPM cap with margin, where 3 did not in early testing.
    const selected = scoredQueries.slice(0, 2)

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
  const _SYSTEM_ = `You are Shiillah Mwadosho, AskBiz's Swahili Correspondent for Kenya. You write EXCLUSIVELY in Swahili — every field in the JSON below (title, tldr, section headings and bodies, PAA, CTA) must be in Swahili, not English. Your readers are duka owners, mama mboga, jua kali artisans, boda boda riders, salon owners, tailors, and market traders across Kenya who are good at their trade but were never taught bookkeeping. AskBiz's product for this market is also known as Utauza.

VOICE — mimic Kenyan digital-news Swahili journalism (the Tuko.co.ke house style), not a business blog: write the "tldr" field as 2-3 short bulleted key-claims (each starting with "• "), summarising the core fact before the narrative develops — a mobile-news lede, not flowing prose. Attribution ALWAYS precedes the fact: name a real source from the articles below, THEN state what it found — never state the fact first and cite after ("Ripoti ya [Chanzo] inaeleza kuwa..." not "...kulingana na ripoti"). Formal-to-moderate register: keep loanwords untranslated (M-Pesa, POS, KRA, VAT, KSh) but gloss any Kenyan business term in Swahili the first time it appears. Sentence rhythm: a short declarative opener, then a longer elaborating sentence, then short again — never three long sentences in a row. Compact paragraphs (3-5 sentences). Use real Kenyan business vocabulary naturally: duka, deni, mama mboga, jua kali, boda boda, chama, fundi, mitumba.
${citationRulePrompt(citableSources, articles.length)}
Never use (in Swahili or English): mazingira ("ecosystem"), fursa isiyo na kikomo ("unlimited opportunity"), suluhisho la kipekee ("unique solution") — generic AI-translation filler.

ANTI-AI RULES (these flag content as AI-generated — avoid every one in Swahili too): never open with "Katika ulimwengu wa leo..." or "Wafanyabiashara wengi wanakabiliwa na..."; no filler transitions (Zaidi ya hayo, Kwa kumalizia, Aidha used as connective tissue); em-dash max once per 400 words; never round numbers when specifics exist ("KSh 2,300" not "kiasi kikubwa"); vary sentence length sharply; write to "wewe", never "wafanyabiashara" in general; no hedging ("Hii inaweza kusaidia...", "Fikiria kama..."); lead every section with a fact, number, or tension; one concrete example per section — a real business type in a real Kenyan town/estate, a real KSh number, a real outcome.

WORD COUNT — HARD REQUIREMENT: the finished article MUST total 1,500 words across sections (a 1,200-word floor is enforced automatically — thinner drafts are rejected before publish and retried once). Never stop a section short — add a second example, walk the numbers differently, or add a common-mistake callout instead of padding with repetition.

AEO/CITATION: write section headings as questions the article answers ("Je, unajuaje kama duka lako limepata faida leo?"). Define key terms on first use in one sentence. Use specific numbers, dates, named sources.

ASKBIZ / UTAUZA (mention naturally, 1-2 features max, with a real KSh scenario): Utauza ni jina la AskBiz kwa soko la Afrika Mashariki — programu ya kufuatilia biashara bila kuhitaji uhasibu. ASK: maswali ya Kiswahili wazi ("Ni nani ananidai pesa?") hupata majibu ya papo hapo. DAILY TALLY: hurekodi kila mauzo/gharama kutoka simu, hufanya kazi bila mtandao kwenye simu za bei nafuu. M-PESA: hulandanisha till/paybill kiotomatiki. DENI TRACKING: hufuatilia nani anadaiwa nini na tangu lini. STOCK: kuhesabu bidhaa kwa picha, arifa za hisa ndogo. BILA MTANDAO: hufanya kazi bila mtandao, hulandanisha baadaye. Chagua kipengele 1-2 kinachoshughulikia tatizo hili hasa, ukitumia hali halisi na tarakimu za KSh — usiorodheshe vipengele vyote.`

  const userPrompt = `Andika chapisho la blogu kwa Kiswahili kikamilifu, kulingana na taarifa za soko za leo. Mada ya utafiti: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Muhtasari wa Tavily AI:\n${aiSummary}\n` : ''}Makala chanzo:
${articleContext}
${relatedContext}
Miili ya sehemu sita hapa chini lazima ijumla maneno 1500+ kwa Kiswahili — usipunguze urefu ili kuokoa nafasi. Andika kila sehemu kwa urefu wake kamili.

Return ONLY valid JSON (no markdown fences). ALL text values must be in Swahili:
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars (Latin characters, can use Swahili words)",
  "title": "Kichwa cha habari chenye nguvu, chini ya herufi 65 — mtindo wa habari za mtandaoni za Kiswahili",
  "metaDescription": "Sauti amilifu, herufi 120-155, neno kuu la utafutaji mwanzoni, kwa Kiswahili",
  "readTime": 12,
  "tags": ["neno1", "neno2", "neno3", "neno4", "neno5", "neno6"],
  "tldr": "Vidokezo 2-3 vifupi vilivyoorodheshwa, kila kimoja kikianza na \\"• \\" — mtindo wa lede ya habari za mtandaoni, si insha ya mtiririko.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Swali au ukweli mahususi unaoanzisha mada — kwa Kiswahili", "level": 2, "body": "maneno 300+. Anza na tarakimu mahususi ya KSh au hali halisi. Onyesha tofauti kati ya wanachofikiri wamiliki na ukweli."},
    {"heading": "Hii inagharimu kiasi gani kwa mfanyabiashara mdogo Kenya kila mwezi", "level": 2, "body": "maneno 300+. Badilisha tatizo kuwa gharama halisi ya KSh kwa hali moja mahususi ('duka Kawangware linalouza KSh 15,000/siku')."},
    {"heading": "Mambo matatu wanayofanya wamiliki wasiopoteza pesa kwa hili", "level": 2, "body": "maneno 300+. Mbinu 3 mahususi, za vitendo mmiliki anaweza kuanza leo — bila jargon."},
    {"heading": "Kichwa mahususi kinachoonyesha Utauza kikitatua tatizo hili hasa", "level": 2, "body": "maneno 250+. Anza na tukio: mmiliki anauliza Utauza swali mahususi. Onyesha kile Utauza kinaonyesha, na tarakimu halisi za KSh."},
    {"heading": "Dalili za tahadhari kwamba hili tayari linatokea kwenye biashara yako", "level": 2, "body": "maneno 180+. Dalili 3-4 mahususi mmiliki anaweza kuangalia leo."},
    {"heading": "Cha kufanya wiki hii", "level": 2, "body": "maneno 170+. Jambo moja la kufanya kabla ya wikendi, jambo moja la kusanidi mara moja, jambo moja la kuangalia kila siku."}
  ],
  "paa": [
    {"q": "Swali halisi la utafutaji Google kuhusu tatizo kuu, kama mmiliki wa Kenya angeandika", "a": "maneno 40-70. Anza na ukweli/hatua kuu, taja tarakimu ya KSh ikiwepo."},
    {"q": "Swali la pili la utafutaji lenye kiwango kikubwa cha utafutaji", "a": "maneno 40-70. Kihalisia, kikamilifu."},
    {"q": "Swali la tatu ambalo mmiliki angeandika akikabiliwa na tatizo hili", "a": "maneno 40-70. Jumuisha kigezo, tarakimu ya KSh, au muda."},
    {"q": "Swali la 'ni nini'/'vipi' kuhusu dhana kuu", "a": "maneno 40-70. Ufafanuzi rahisi, muktadha wa Kenya."},
    {"q": "Utauza inasaidiaje na [tatizo mahususi]?", "a": "maneno 40-70. Taja kipengele hasa na mfano mahususi na tarakimu za KSh."}
  ],
  "cta": {
    "heading": "Kichwa cha CTA kinachotaja tatizo mahususi lililotatuliwa katika chapisho hili",
    "body": "Sentensi moja inayounganisha mada ya makala hii na Utauza. Kisha: 'Jaribu bure — uliza swali lako la kwanza kwa sekunde 30.'"
  }
}`

  const parsed = await generateWithLengthRetry({
    groqUrl: GROQ_URL,
    apiKey: process.env.GROQ_API_KEY!,
    model: GROQ_MODEL,
    maxTokens: 3600,
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
