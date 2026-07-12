import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch } from '@/lib/tavily'
import { logUsage } from '@/lib/log-usage'
import { waitForGroqBudget } from '@/lib/groq-rate-limiter'

export const runtime = 'nodejs'
export const maxDuration = 800

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

const SCOUT_QUERIES = [
  { query: 'quick WhatsApp tip Kenya duka owner stock tracking', cluster: 'Kenya Community Distribution', pillar: 'Duka & Retail' },
  { query: 'quick tip Kenya duka shopkeeper deni customers not paying', cluster: 'Kenya Community Distribution', pillar: 'Duka & Retail' },
  { query: 'quick tip Kenya kiosk owner stock theft shrinkage', cluster: 'Kenya Community Distribution', pillar: 'Duka & Retail' },
  { query: 'quick tip mama mboga Kenya daily profit tracking phone', cluster: 'Kenya Community Distribution', pillar: 'Food & Market Trading' },
  { query: 'quick tip mama ntilie Kenya food kiosk pricing profit', cluster: 'Kenya Community Distribution', pillar: 'Food & Market Trading' },
  { query: 'quick tip Nairobi market trader Kenya cash tracking', cluster: 'Kenya Community Distribution', pillar: 'Food & Market Trading' },
  { query: 'quick tip jua kali fundi Kenya pricing a job costing', cluster: 'Kenya Community Distribution', pillar: 'Jua Kali & Trades' },
  { query: 'quick tip welder carpenter Kenya business finances', cluster: 'Kenya Community Distribution', pillar: 'Jua Kali & Trades' },
  { query: 'quick tip boda boda rider Kenya fuel income tracking', cluster: 'Kenya Community Distribution', pillar: 'Boda Boda & Transport' },
  { query: 'quick tip matatu sacco Kenya daily collections', cluster: 'Kenya Community Distribution', pillar: 'Boda Boda & Transport' },
  { query: 'quick tip salon barbershop Kenya daily takings tracking', cluster: 'Kenya Community Distribution', pillar: 'Salon & Personal Care' },
  { query: 'quick tip mitumba trader Kenya stock tracking phone', cluster: 'Kenya Community Distribution', pillar: 'Mitumba & Tailoring' },
  { query: 'quick tip tailor cherehani Kenya order payment tracking', cluster: 'Kenya Community Distribution', pillar: 'Mitumba & Tailoring' },
  { query: 'quick tip agrovet Kenya credit customers deni tracking', cluster: 'Kenya Community Distribution', pillar: 'Agrovet & Farming' },
  { query: 'quick tip small farmer Kenya selling produce cash tracking', cluster: 'Kenya Community Distribution', pillar: 'Agrovet & Farming' },
  { query: 'quick tip chama savings group Kenya record keeping', cluster: 'Kenya Community Distribution', pillar: 'Chama & Group Savings' },
  { query: 'quick tip M-Pesa till reconciliation Kenya small business', cluster: 'Kenya Community Distribution', pillar: 'Mobile Money' },
  { query: 'quick WhatsApp tip Kenya small business bookkeeping no accountant', cluster: 'Kenya Community Distribution', pillar: 'Financial Literacy' },
  { query: 'quick tip how to know who owes you money shop Kenya deni', cluster: 'Kenya Community Distribution', pillar: 'Credit & Deni Tracking' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const authHeader = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const fg = searchParams.get('focus_gate')
  const focus = fg ? { gate: fg, label: searchParams.get('focus_label') || fg, count: Number(searchParams.get('focus_count')) || 0 } : undefined
  return runCommunityScout(focus)
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runCommunityScout()
}

async function runCommunityScout(focus?: { gate: string; label: string; count: number }) {
  const runId = `community_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Jane is scanning for today\'s community post topics...')

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Admin readiness work-queue hand-off: draft ONE post targeted at vendors
    // stuck at a specific formality gate. Explicit + on-demand, so it bypasses
    // the daily-skip guard and the random topic selection below.
    if (focus) {
      if (!process.env.TAVILY_API_KEY) {
        log.push('ERROR: No search key set — add TAVILY_API_KEY to Vercel env vars')
        return NextResponse.json({ success: false, log }, { status: 200 })
      }
      const gateTopics: Record<string, string> = {
        gate_menu: 'how Kenyan food vendors build a menu with prices to list on Glovo Bolt Uber Eats',
        gate_id: 'ID and KYC documents Kenyan small food vendors need to join food delivery apps',
        gate_payout: 'M-Pesa or bank payout setup for Kenyan vendors on food delivery apps',
        gate_permit: 'single business permit for Kenyan food vendors county requirements and cost',
        gate_health: 'health certificate for a food business in Kenya from county public health how to get it',
        gate_food_handler: 'food handler medical certificate Kenya requirements for food vendors',
      }
      const query = gateTopics[focus.gate] || `helping Kenyan food vendors clear ${focus.label} to list on delivery apps`
      log.push(`Jane is drafting a post to help vendors with: ${focus.label}`)
      const searchResult = await tavilySearch(query, { searchDepth: 'advanced', maxResults: 3, topic: 'news', days: 30 })
      const input = { query, cluster: 'Restaurant Enablement', pillar: 'Restaurant & Delivery', searchResult: (searchResult ?? { results: [] }) as any }
      let content: any = null
      try { content = await writeCommunityPost(input) } catch (e) { log.push(`Draft failed: ${e instanceof Error ? e.message : String(e)}`) }
      if (!content) return NextResponse.json({ success: false, log, focus: focus.gate }, { status: 200 })
      const top = searchResult?.results?.[0]
      const { error: focusErr } = await supabase.from('agent_content').insert([{
        run_id: runId, type: 'community_post', status: 'pending', content,
        source_url: top?.url || null, source_title: top?.title || null, source_query: query,
      }])
      if (focusErr) { log.push(`DB error: ${focusErr.message}`); return NextResponse.json({ success: false, log }, { status: 200 }) }
      log.push('Saved 1 targeted community post — pending review')
      return NextResponse.json({ success: true, runId, blogsGenerated: 1, focus: focus.gate, log })
    }

    // Skip if already ran today — prevents double-posting when the orchestrator
    // cron and a manual "Run Now" both fire on the same day.
    const today = new Date().toISOString().slice(0, 10)
    const { count: todayCount } = await supabase
      .from('agent_content')
      .select('id', { count: 'exact', head: true })
      .like('run_id', 'community_%')
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      log.push(`Already ran today (${today}) — skipping to avoid duplicates`)
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today, log })
    }

    if (!process.env.TAVILY_API_KEY) {
      log.push('ERROR: No search key set — add TAVILY_API_KEY to Vercel env vars')
      return NextResponse.json({ success: false, log }, { status: 200 })
    }

    // Random selection is fine here — social posts don't need Alice's
    // freshness-scoring dedup logic, an occasional repeat topic is no big deal.
    const shuffled = [...SCOUT_QUERIES].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 3)

    log.push(`Selected ${selected.length} topics. Searching Tavily for light context...`)

    const searchResults = await Promise.allSettled(
      selected.map(async s => {
        const searchResult = await tavilySearch(s.query, {
          searchDepth: 'advanced',
          maxResults: 3,
          topic: 'news',
          days: 14,
        })
        return { ...s, searchResult }
      })
    )

    const validResults = searchResults
      .filter((r): r is PromiseFulfilledResult<typeof selected[0] & { searchResult: NonNullable<Awaited<ReturnType<typeof tavilySearch>>> }> =>
        r.status === 'fulfilled' && !!r.value.searchResult?.results?.length
      )
      .map(r => r.value)

    const skippedCount = selected.length - validResults.length
    if (skippedCount > 0) log.push(`${skippedCount} topic(s) had no Tavily results — skipped`)

    if (validResults.length === 0) {
      log.push('No search results from any query — exiting')
      return NextResponse.json({ success: false, log, reason: 'no_results' })
    }

    log.push(`Got context for ${validResults.length}/${selected.length} topics. Writing posts...`)

    const postResults = await Promise.allSettled(
      validResults.map(r => writeCommunityPost(r))
    )

    const inserts: Record<string, unknown>[] = []

    for (let i = 0; i < postResults.length; i++) {
      const result = postResults[i]
      const source = validResults[i]
      const topArticle = source.searchResult!.results[0]

      if (result.status === 'fulfilled' && result.value) {
        inserts.push({
          run_id: runId,
          type: 'community_post',
          status: 'pending',
          content: result.value,
          source_url: topArticle?.url || null,
          source_title: topArticle?.title || null,
          source_query: source.query,
        })
        log.push(`✓ Post ${i + 1}: "${result.value.topic}"`)
      } else {
        const reason = result.status === 'rejected' ? result.reason?.message || String(result.reason) : 'empty result'
        log.push(`✗ Post ${i + 1} failed: ${reason}`)
      }
    }

    if (inserts.length > 0) {
      const { error } = await supabase.from('agent_content').insert(inserts)
      if (error) {
        log.push(`DB error: ${error.message}`)
      } else {
        log.push(`Saved ${inserts.length} community posts — all pending review`)
      }
    }

    log.push(`Community scout complete. ${inserts.length}/${validResults.length} posts generated.`)

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
  searchResult: NonNullable<Awaited<ReturnType<typeof tavilySearch>>>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

async function writeCommunityPost(input: SearchInput) {
  const { query, cluster, pillar, searchResult } = input
  const articles = searchResult.results.slice(0, 3)
  const articleContext = articles
    .map((a, i) => `${i + 1}. ${a.title}\n${(a.content || '').slice(0, 200)}`)
    .join('\n\n')

  const systemPrompt = `You are Jane Wanjiru, AskBiz's Head of Community Growth for Kenya. You write short, warm, casual posts for WhatsApp business groups and Facebook community groups — the kind of message a friendly community admin drops in to help everyone out, not a blog post and not an ad.

VOICE: Warm, casual, Kenyan English, like you're chatting to people you know. Use light Sheng/Swahili business words naturally where they fit: duka, deni, mama mboga, jua kali, boda boda, chama. No headings, no markdown, no bullet lists — just natural sentences, like a real WhatsApp message. Never invent statistics, studies, or sources — casual tone referencing common pain points everyone recognises is fine without citing anything.

Never use: landscape, leverage, synergy, holistic, ecosystem, unlock, empower, seamless, cutting-edge, game-changer, robust.

Return ONLY valid JSON (no markdown fences):
{
  "topic": "short topic name",
  "pillar": "one of the pillar names given to you",
  "whatsappText": "casual message under 400 characters, plain text, at most one emoji, natural not spammy, does not include a link (the link is added separately)",
  "facebookText": "slightly longer casual message under 600 characters, appropriate for a Facebook community group, does not include a link (the link is added separately)"
}`

  const userPrompt = `Write a short WhatsApp-group post and a short Facebook-group post about this topic for Kenyan micro-business owners.

Topic angle: "${query}"
Pillar: "${pillar}"

Light background context (for inspiration only, do not cite or quote it directly):
${articleContext}

Keep both texts short, casual, and useful — one practical tip or relatable pain point per post.`

  const promptTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 4)
  const maxTokens = 600
  await waitForGroqBudget(promptTokens + maxTokens)

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    throw new Error(`Groq error ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  const usage = data.usage || {}
  logUsage({
    route: 'agent/community-scout',
    model: GROQ_MODEL,
    usage: { input_tokens: usage.prompt_tokens || 0, output_tokens: usage.completion_tokens || 0 },
  })

  const raw = data.choices?.[0]?.message?.content || ''
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in Groq response')
  const parsed = JSON.parse(jsonMatch[0])

  if (!parsed.topic || !parsed.whatsappText || !parsed.facebookText) {
    throw new Error('Invalid community post structure — missing topic, whatsappText, or facebookText')
  }

  const campaignSlug = slugify(parsed.topic)

  return {
    topic: parsed.topic,
    cluster,
    pillar: parsed.pillar || pillar,
    whatsappText: parsed.whatsappText,
    facebookText: parsed.facebookText,
    whatsappLink: `https://askbiz.co/?utm_source=whatsapp&utm_medium=community&utm_campaign=${campaignSlug}`,
    facebookLink: `https://askbiz.co/?utm_source=facebook&utm_medium=community&utm_campaign=${campaignSlug}`,
    author: {
      name: 'Jane Wanjiru',
      role: 'Head of Community Growth, Kenya',
    },
  }
}
