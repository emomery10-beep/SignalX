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
  if (searchParams.get('action') === 'validate') {
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

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { action } = body

  if (action === 'validate') {
    const result = await validateXCredentials()
    return NextResponse.json(result)
  }

  if (action === 'search') {
    const { presetId, customQuery, maxResults = 10 } = body as Record<string, unknown>

    let query = customQuery as string
    if (presetId && !customQuery) {
      const preset = X_KEYWORD_PRESETS.find(p => p.id === presetId)
      if (!preset) return NextResponse.json({ error: 'Preset not found' }, { status: 400 })
      query = preset.query
    }
    if (!query) return NextResponse.json({ error: 'query or presetId required' }, { status: 400 })

    try {
      const tweets = await searchTweetsViaTavily(query, Number(maxResults))
      if (!tweets.length) return NextResponse.json({ tweets: [], generated: 0 })

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
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 })
    }
  }

  if (action === 'post_reply') {
    const { activityId, tweetId, replyText } = body as Record<string, string>
    if (!tweetId || !replyText) return NextResponse.json({ error: 'tweetId and replyText required' }, { status: 400 })

    try {
      const posted = await postTweet(replyText, { replyToId: tweetId })
      if (activityId) {
        await supabase.from('x_agent_activity').update({
          status: 'posted',
          posted_reply_id: posted.id,
          posted_at: new Date().toISOString(),
        }).eq('id', activityId)
      }
      return NextResponse.json({ success: true, postedId: posted.id })
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 })
    }
  }

  if (action === 'post_thread') {
    const { agentContentId, tweets } = body as { agentContentId?: string; tweets: unknown[] }
    if (!tweets?.length) return NextResponse.json({ error: 'tweets array required' }, { status: 400 })

    try {
      const tweetTexts = tweets.map(t => (typeof t === 'string' ? t : (t as { text: string }).text))
      const postedIds = await postThread(tweetTexts)
      if (agentContentId) {
        await supabase.from('agent_content').update({
          status: 'published',
          published_at: new Date().toISOString(),
          metadata: { x_thread_ids: postedIds },
        }).eq('id', agentContentId)
      }
      return NextResponse.json({ success: true, postedIds, count: postedIds.length })
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 })
    }
  }

  if (action === 'reject') {
    const { activityId } = body as { activityId: string }
    await supabase.from('x_agent_activity').update({ status: 'rejected' }).eq('id', activityId)
    return NextResponse.json({ success: true })
  }

  if (action === 'regenerate') {
    const { tweetText, tweetAuthor } = body as { tweetText: string; tweetAuthor: string }
    try {
      const reply = await generateReply(tweetText, tweetAuthor || 'founder')
      return NextResponse.json({ reply })
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

async function generateReply(tweetText: string, username: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: 'You are the AskBiz growth account on X. Write a genuine helpful reply to this tweet from @' + username + '.\n\nTweet: "' + tweetText + '"\n\nRules:\n- Max 255 characters\n- Sound like a real person not a bot\n- Add genuine value\n- Mention askbiz.co naturally only if very relevant\n- Max 1 hashtag\n- Be specific\n\nReturn ONLY the reply text.',
    }],
  })
  const text = res.content[0].type === 'text' ? res.content[0].text.trim() : ''
  return text.length > 255 ? text.slice(0, 252) + '...' : text
}
