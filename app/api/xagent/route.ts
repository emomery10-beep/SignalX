import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchTweetsViaTavily, postTweet, validateXCredentials, X_KEYWORD_PRESETS } from '@/lib/x-api'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function isAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user && ADMIN_EMAILS.includes(user.email || '')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('action') === 'validate') {
    const result = await validateXCredentials()
    return NextResponse.json(result)
  }
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createClient()
  const { data: recent } = await supabase.from('x_agent_activity').select('*').order('created_at', { ascending: false }).limit(50)
  return NextResponse.json({ presets: X_KEYWORD_PRESETS, recent: recent || [] })
}

export async function POST(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { action } = body

  if (action === 'search') {
    const { presetId, customQuery, maxResults = 10 } = body
    let query = customQuery
    if (presetId && !customQuery) {
      const preset = X_KEYWORD_PRESETS.find(p => p.id === presetId)
      if (!preset) return NextResponse.json({ error: 'Preset not found' }, { status: 400 })
      query = preset.query
    }
    if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })
    const tweets = await searchTweetsViaTavily(query, maxResults)
    if (!tweets.length) return NextResponse.json({ tweets: [], generated: 0 })
    const pairs = await Promise.all(tweets.slice(0, 10).map(async tweet => {
      const res = await anthropic.messages.create({ model: 'claude-sonnet-4-5-20251001', max_tokens: 300, messages: [{ role: 'user', content: 'Write a genuine helpful reply to this tweet from @' + tweet.author + '.\n\nTweet: "' + tweet.text + '"\n\nRules: Max 255 chars, sound like a real person, add value, mention askbiz.co only if very relevant, max 1 hashtag. Return ONLY the reply text.' }] })
      const reply = res.content[0].type === 'text' ? res.content[0].text.trim() : ''
      return { tweet, reply: reply.length > 255 ? reply.slice(0, 252) + '...' : reply }
    }))
    const supabase = createClient()
    await supabase.from('x_agent_activity').insert(pairs.map(({ tweet, reply }) => ({ tweet_id: tweet.id, tweet_text: tweet.text, tweet_author: tweet.author, generated_reply: reply, keyword_query: query, status: 'pending', created_at: new Date().toISOString() })))
    return NextResponse.json({ tweets: pairs, generated: pairs.length })
  }

  if (action === 'post_reply') {
    const { activityId, tweetId, replyText } = body
    if (!tweetId || !replyText) return NextResponse.json({ error: 'tweetId and replyText required' }, { status: 400 })
    const posted = await postTweet(replyText, { replyToId: tweetId })
    const supabase = createClient()
    if (activityId) {
      // Posted from queue - update by activity id
      await supabase.from('x_agent_activity')
        .update({ status: 'posted', posted_reply_id: posted.id, posted_at: new Date().toISOString() })
        .eq('id', activityId)
    } else {
      // Posted from search results - find by tweet_id
      await supabase.from('x_agent_activity')
        .update({ status: 'posted', posted_reply_id: posted.id, posted_at: new Date().toISOString() })
        .eq('tweet_id', tweetId)
        .eq('status', 'pending')
    }
    return NextResponse.json({ success: true, postedId: posted.id })
  }

  if (action === 'reject') {
    const supabase = createClient()
    await supabase.from('x_agent_activity').update({ status: 'rejected' }).eq('id', body.activityId)
    return NextResponse.json({ success: true })
  }

  if (action === 'regenerate') {
    const res = await anthropic.messages.create({ model: 'claude-sonnet-4-5-20251001', max_tokens: 300, messages: [{ role: 'user', content: 'Write a genuine helpful reply to this tweet from @' + (body.tweetAuthor || 'founder') + '.\n\nTweet: "' + body.tweetText + '"\n\nRules: Max 255 chars, sound like a real person, add value, mention askbiz.co only if very relevant. Return ONLY the reply text.' }] })
    const reply = res.content[0].type === 'text' ? res.content[0].text.trim() : ''
    return NextResponse.json({ reply: reply.length > 255 ? reply.slice(0, 252) + '...' : reply })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
