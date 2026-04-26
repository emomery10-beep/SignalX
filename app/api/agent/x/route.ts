import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  searchTweets,
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

  if (action === 'search') {
    const { presetId, customQuery, maxResults = 10, minLikes = 0 } = body

    let query = customQuery
    if (presetId && !customQuery) {
      const preset = X_KEYWORD_PRESETS.find(p => p.id === presetId)
      if (!preset) return NextResponse.json({ error: 'Preset not found' }, { status: 400 })
      query = preset.query
    }

    if (!query) return NextResponse.json({ error: 'query or presetId required' }, { status: 400 })

    const results = await searchTweets(query, { maxResults, minLikes })

    if (!results.data?.length) {
      return NextResponse.json({ tweets: [], generated: 0 })
    }

    const withReplies = await Promise.allSettled(
      results.data.slice(0, 10).map(async tweet => {
        const reply = await generateReply(tweet.text, tweet.author?.username || 'founder')
        return { tweet, reply }
      })
    )

    const pairs = withReplies
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<{ tweet: typeof results.data[0]; reply: string }>).value)

    if (pairs.length > 0) {
      await supabase.from('x_agent_activity').insert(
        pairs.map(({ tweet, reply }) => ({
          tweet_id: tweet.id,
          tweet_text: tweet.text,
          tweet_author: tweet.author?.username,
          tweet_author_id: tweet.author_id,
          tweet_likes: tweet.public_metrics?.like_count || 0,
          tweet_replies: tweet.public_metrics?.reply_count || 0,
          generated_reply: reply,
          keyword_query: query,
          status: 'pending',
          created_at: new Date().toISOString(),
        }))
      )
    }

    return NextResponse.json({ tweets: pairs, generated: pairs.length, query })
  }

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

  if (action === 'reject') {
    const { activityId } = body
    await supabase.from('x_agent_activity').update({ status: 'rejected' }).eq('id', activityId)
    return NextResponse.json({ success: true })
  }

  if (action === 'regenerate') {
    const { tweetText, tweetAuthor } = body
    const reply = await generateReply(tweetText, tweetAuthor || 'founder')
    return NextResponse.json({ reply })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

async function generateReply(tweetText: string, username: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are the AskBiz growth account on X. Write a genuine, helpful reply to this tweet from @${username}.

Tweet: "${tweetText}"

Rules:
- Max 255 characters
- Sound like a real person, not a bot
- Add genuine value — share a specific insight or tip
- Mention askbiz.co naturally only if very relevant — never forced
- No hashtag spam — max 1 hashtag if needed
- No emojis unless the original tweet uses them
- Don't start with "Great point!" — be specific about their problem
- If the tweet describes a business problem, offer the specific AskBiz feature that solves it

Return ONLY the reply text, nothing else.`,
    }],
  })

  const text = res.content[0].type === 'text' ? res.content[0].text.trim() : ''
  return text.length > 255 ? text.slice(0, 252) + '...' : text
}
