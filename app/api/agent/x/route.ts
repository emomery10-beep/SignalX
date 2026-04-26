import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  searchTweetsViaTavily,
  postTweet,
  postThread,
  validateXCredentials,
  X_KEYWORD_PRESETS,
} from '@/lib/x-api'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function verifyAdmin(supabase: ReturnType<typeof createClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) return null
  return user
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const user = await verifyAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'validate') {
    const result = await validateXCredentials()
    return NextResponse.json(result)
  }

  const { data: recent } = await supabase
    .from('x_agent_activity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ presets: X_KEYWORD_PRESETS, recent: recent || [] })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const user = await verifyAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { action } = body

  if (action === 'validate') {
    const result = await validateXCredentials()
    return NextResponse.json(result)
  }

  // ── Search via Tavily ─────────────────────────────────────
  if (action === 'search') {
    const { presetId, customQuery, maxResults = 10 } = body

    let query = customQuery
    if (presetId && !customQuery) {
      const preset = X_KEYWORD_PRESETS.find(p => p.id === presetId)
      if (!preset) return NextResponse.json({ error: 'Preset not found' }, { status: 400 })
      query = preset.query
    }

    if (!query) return NextResponse.json({ error: 'query or presetId required' }, { status: 400 })

    const tweets = await searchTweetsViaTavily(query, maxResults)

    if (!tweets.length) {
      return NextResponse.json({ tweets: [], generated: 0 })
    }

    // Generate AI replies
    const withReplies = await Promise.allSettled(
      tweets.slice(0, 10).map(async tweet => {
        const reply = await generateReply(tweet.text, tweet.author)
        return { tweet, reply }
      })
    )

    const pairs = withReplies
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<{ tweet: typeof tweets[0]; reply: string }>).value)

    if (pairs.length > 0) {
      await supabase.from('x_agent_activity').insert(
        pairs.map(({ tweet, reply }) => ({
          tweet_id: tweet.id,
          tweet_text: tweet.text,
          tweet_author: tweet.author,
          tweet_author_id: tweet.author,
          tweet_likes: 0,
          tweet_replies: 0,
          generated_reply: reply,
          keyword_query: query,
          status: 'pending',
          created_at: new Date().toISOString(),
        }))
      )
    }

    return NextResponse.json({ tweets: pairs, generated: pairs.length, query })
  }

  // ── Post a reply ──────────────────────────────────────────
  if (action === 'post_reply') {
    const { activityId, tweetId, replyText } = body
    if (!tweetId || !replyText) return NextResponse.json({ error: 'tweetId and replyText required' }, { status: 400 })

    const posted = await postTweet(replyText, { replyToId: tweetId })

    if (activityId) {
      await supabase.from('x_agent_activity').update({
        status: 'posted',
        posted_reply_id: posted.id,
        posted_at: new Date().toISOString(),
      }).eq('id', activityId)
    }

    return NextResponse.json({ success: true, postedId: posted.id })
  }

  // ── Post a standalone tweet / thread ─────────────────────
  if (action === 'post_thread') {
    const { agentContentId, tweets } = body
    if (!tweets?.length) return NextResponse.json({ error: 'tweets array required' }, { status: 400 })

    const tweetTexts = tweets.map(t => t.text || t)
    const postedIds = await postThread(tweetTexts)

    if (agentContentId) {
      await supabase.from('agent_content').update({
        status: 'published',
        published_at: new Date().toISOString(),
        metadata: { x_thread_ids: postedIds },
      }).eq('id', agentContentId)
    }

    return NextResponse.json({ success: true, postedIds, count: postedIds.length })
  }

  // ── Reject ────────────────────────────────────────────────
  if (action === 'reject') {
    const { activityId } = body
    await supabase.from('x_agent_activity').update({ status: 'rejected' }).eq('id', activityId)
    return NextResponse.json({ success: true })
  }

  // ── Regenerate reply ──────────────────────────────────────
  if (action === 'regenerate') {
    const { tweetText, tweetAuthor } = body
    const reply = await generateReply(tweetText, tweetAuthor || 'founder')
    return NextResponse.json({ reply })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

async function generateReply(tweetText: string, username: string): Promise<string> {
  const problemKeywords: Record<string, string> = {
    margins:   'track your real margin per product after all fees and shipping',
    profit:    'see exactly which products are actually making you money',
    stock:     'get alerts before you run out of stock',
    inventory: 'know your days-of-stock left before it becomes a crisis',
    cash:      'model your cash position 30, 60, 90 days out',
    shipping:  'calculate your true landed cost after shipping',
    amazon:    'calculate your true Amazon FBA margin per ASIN after all fees',
    shopify:   'see your real Shopify margin after ads, fees and returns',
    data:      'ask your sales data questions in plain English',
    sales:     'find your best and worst performing products instantly',
    pricing:   'simulate price changes and see the margin impact before you commit',
    forecast:  'forecast your next 90 days based on current trends',
  }

  let specificSolve = 'get a clear picture of what is actually happening in your business'
  const lower = tweetText.toLowerCase()
  for (const [kw, solve] of Object.entries(problemKeywords)) {
    if (lower.includes(kw)) { specificSolve = solve; break }
  }

  const prompt = `You are the AskBiz X account. AskBiz is an AI business intelligence tool for SME founders — connect Shopify/Amazon/eBay or upload a CSV and ask questions in plain English.

Write a reply to this tweet from @${username} that:
1. Acknowledges their specific problem genuinely (1 sentence, no fluff)
2. Offers the specific AskBiz solution: ${specificSolve}
3. Ends with a CTA — EVERY reply must end with either "askbiz.co" or "DM us"

Tweet: "${tweetText}"

Rules:
- Max 240 characters total including CTA
- Sound human — not a bot or salesperson
- CTA examples: "...askbiz.co does exactly this — free to try" or "...we built askbiz.co for this" or "...DM us, happy to show you"
- No hashtags
- Be specific about their exact problem

Return ONLY the reply text.`

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = res.content[0].type === 'text' ? res.content[0].text.trim() : ''
  return text.length > 240 ? text.slice(0, 237) + '...' : text
}
