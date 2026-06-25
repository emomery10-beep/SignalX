import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchTweetsViaTavily, postTweet, validateXCredentials, X_KEYWORD_PRESETS } from '@/lib/x-api'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

// ── Reply prompt ─────────────────────────────────────────────────────────────
function buildReplyPrompt(tweetText: string, tweetAuthor: string): string {
  return `You are the AskBiz X account — a no-nonsense business advisor built for small business owners, Shopify sellers, Amazon FBA sellers, eBay traders, ecommerce founders, factory owners, and SMEs.

Write a reply to this tweet that does ALL of the following:
1. SOLVE their problem first — give one specific, actionable tip in plain English. Talk like a smart mate who runs a business, not a consultant.
2. End with a natural plug for askbiz.co — something like "askbiz.co can help you track this" or "we built askbiz.co for exactly this" or "check askbiz.co — free to start". Always include it. Make it feel helpful not salesy.
3. Max 255 characters total. Be punchy. No hashtags. Max 1 emoji.

Tweet from @${tweetAuthor}:
"${tweetText}"

Return ONLY the reply text. No quotes, no preamble, no explanation.`
}


// ── Original post prompt ──────────────────────────────────────────────────────
function buildOriginalPostPrompt(trend: string, context: string): string {
  return `You are the AskBiz X account — sharp, direct, built for SME owners, importers, exporters, Shopify sellers, factory owners, and distributors.

Write an ORIGINAL tweet about this trending business topic: "${trend}"

Context: ${context}

Rules:
1. Lead with a specific insight, stat, or warning — not a generic observation
2. Make it feel like insider knowledge from someone who understands SME trade, margins, and logistics
3. End naturally with askbiz.co — e.g. "askbiz.co tracks this" or "→ askbiz.co" or "we built askbiz.co for this"
4. Max 255 characters total. Punchy. No hashtags unless essential. Max 1 emoji.
5. Write as AskBiz — first person "we" or direct "you". Never third person about AskBiz.

Good examples:
"Shipping surcharges up 34% on Asia-UK lanes this month. Most SMEs won't notice until margins collapse. We track this in real time → askbiz.co"
"Your forwarder is probably overcharging you. Market rate Shanghai→Mombasa is $1,240. Most importers pay $1,800+. askbiz.co shows you the gap."

Return ONLY the tweet text. No quotes, no explanation.`
}

async function isAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user && ADMIN_EMAILS.includes(user.email || '')
}

function safeJson(data: unknown, status = 200) {
  try {
    return NextResponse.json(data, { status })
  } catch {
    return new NextResponse(JSON.stringify({ error: 'Response serialisation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    if (searchParams.get('action') === 'validate') {
      const result = await validateXCredentials()
      return safeJson(result)
    }

    // ── Public: social proof feed for embedding on the website ───────────────
    // Fetches the latest posted X replies — no auth needed, safe to call from
    // any page on askbiz.co to show real community engagement.
    if (searchParams.get('action') === 'social_proof') {
      const supabase = createClient()
      const limit = Math.min(Number(searchParams.get('limit') || 6), 20)
      const { data } = await supabase
        .from('x_agent_activity')
        .select('tweet_author, tweet_text, generated_reply, posted_at, tweet_id')
        .eq('status', 'posted')
        .order('posted_at', { ascending: false })
        .limit(limit)
      return safeJson({ replies: data || [] })
    }

    if (!await isAdmin()) return safeJson({ error: 'Unauthorized' }, 401)

    const supabase = createClient()
    const { data: recent } = await supabase
      .from('x_agent_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    return safeJson({ presets: X_KEYWORD_PRESETS, recent: recent || [] })

  } catch (err: any) {
    console.error('[xagent GET]', err)
    return safeJson({ error: err?.message || 'Internal error' }, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAdmin()) return safeJson({ error: 'Unauthorized' }, 401)

    const body = await request.json()
    const { action } = body

    // ── SEARCH ──────────────────────────────────────────────
    if (action === 'search') {
      const { presetId, customQuery, maxResults = 10 } = body
      let query = customQuery
      if (presetId && !customQuery) {
        const preset = X_KEYWORD_PRESETS.find(p => p.id === presetId)
        if (!preset) return safeJson({ error: 'Preset not found' }, 400)
        query = preset.query
      }
      if (!query) return safeJson({ error: 'query required' }, 400)

      // Search web for trend context — not Twitter specifically
      let trendContext = ''
      try {
        const key = process.env.TAVILY_API_KEY
        if (!key) throw new Error('TAVILY_API_KEY not configured')
        const tavilyRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: key,
            query: query + ' SME business impact 2026',
            search_depth: 'basic',
            max_results: 5,
            include_answer: true,
          }),
        })
        if (tavilyRes.ok) {
          const data = await tavilyRes.json()
          const snippets = (data.results || [])
            .map((r: any) => r.content?.slice(0, 200) || r.title || '')
            .filter(Boolean)
            .slice(0, 4)
          if (data.answer) snippets.unshift(data.answer.slice(0, 300))
          trendContext = snippets.join(' | ')
        }
      } catch (err: any) {
        console.error('[xagent search] Tavily error:', err)
      }

      if (!trendContext) {
        trendContext = `This topic is trending in SME and business circles: ${query}. Generate an insightful tweet based on general knowledge about this topic and its impact on small business owners, importers, exporters, and ecommerce sellers.`
      }

      const tweets: any[] = [] // kept for compatibility

      // Generate up to 3 original posts based on the trend
      const originalPosts: { topic: string; post: string }[] = []

      // Generate 3 variations with slightly different angles
      const angles = [
        `Key trend: ${query}. Context from recent posts: ${trendContext}`,
        `Business opportunity angle for: ${query}. What SME owners need to know: ${trendContext}`,
        `Risk/warning angle for: ${query}. What could hurt SME margins: ${trendContext}`,
      ]

      for (const angle of angles) {
        try {
          const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              max_tokens: 300,
              messages: [{ role: 'user', content: buildOriginalPostPrompt(query, angle) }],
            }),
          })
          const _groqData = await _groqRes.json()
          const post = _groqData.choices?.[0]?.message?.content?.trim() || ''
          logUsage({ route: 'xagent', model: 'llama-3.3-70b-versatile', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId: null })
          if (post) originalPosts.push({ topic: query, post: post.length > 255 ? post.slice(0, 252) + '...' : post })
        } catch (err: any) {
          console.error('[xagent] Groq error generating post:', JSON.stringify(err))
        }
      }

      if (!originalPosts.length) {
        return safeJson({
          error: 'Failed to generate any posts',
          debug: {
            query,
            trendContextLength: trendContext.length,
            trendContextSample: trendContext.slice(0, 100),
            anglesCount: angles.length,
          }
        }, 500)
      }

      try {
        const supabase = createClient()
        await supabase.from('x_agent_activity').insert(
          originalPosts.map(({ topic, post }) => ({
            tweet_id: null,
            tweet_text: `[TREND] ${topic}`,
            tweet_author: 'askbiz_original',
            generated_reply: post,
            keyword_query: query,
            status: 'pending',
            created_at: new Date().toISOString(),
          }))
        )
      } catch (err: any) {
        console.error('[xagent] Supabase insert error:', err?.message)
      }

      return safeJson({ tweets: originalPosts.map((p, i) => ({ tweet: { id: null, text: p.topic, author: 'trend' }, reply: p.post })), generated: originalPosts.length })
    }

    // ── POST ORIGINAL / REPLY ────────────────────────────────
    if (action === 'post_reply') {
      const { activityId, tweetId, replyText } = body
      if (!replyText) return safeJson({ error: 'replyText required' }, 400)

      let posted: { id: string; text: string }
      try {
        // If tweetId is null/undefined, post as original tweet (not a reply)
        posted = await postTweet(replyText, tweetId ? { replyToId: tweetId } : undefined)
      } catch (err: any) {
        console.error('[xagent post_reply] X API error:', err?.message)
        return safeJson({ error: err?.message || 'Failed to post to X' }, 500)
      }

      if (activityId) {
        try {
          const supabase = createClient()
          await supabase
            .from('x_agent_activity')
            .update({
              status: 'posted',
              posted_reply_id: posted.id,
              posted_at: new Date().toISOString(),
            })
            .eq('id', activityId)
        } catch (err: any) {
          console.error('[xagent] Supabase update error:', err?.message)
        }
      }

      return safeJson({ success: true, postedId: posted.id })
    }

    // ── CLEAR QUEUE ──────────────────────────────────────
    if (action === 'clear_queue') {
      const supabase = createClient()
      await supabase.from('x_agent_activity').delete().eq('status', 'pending')
      return safeJson({ success: true })
    }

    // ── REJECT ───────────────────────────────────────────────
    if (action === 'reject') {
      const supabase = createClient()
      await supabase.from('x_agent_activity').update({ status: 'rejected' }).eq('id', body.activityId)
      return safeJson({ success: true })
    }

    // ── REGENERATE ───────────────────────────────────────────
    if (action === 'regenerate') {
      const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: buildReplyPrompt(body.tweetText || '', body.tweetAuthor || 'founder'),
          }],
        }),
      })
      const _groqData = await _groqRes.json()
      const reply = _groqData.choices?.[0]?.message?.content?.trim() || ''
      logUsage({ route: 'xagent', model: 'llama-3.3-70b-versatile', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId: null })
      return safeJson({ reply: reply.length > 255 ? reply.slice(0, 252) + '...' : reply })
    }

    return safeJson({ error: 'Invalid action' }, 400)

  } catch (err: any) {
    console.error('[xagent POST]', err)
    return safeJson({ error: err?.message || 'Internal server error' }, 500)
  }
}
