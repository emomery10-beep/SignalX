// ============================================================
// X (Twitter) API — OAuth 2.0 for posting
// Search via Tavily (free, already integrated)
// ============================================================

const X_BASE = 'https://api.twitter.com/2'

// ── Post a tweet via OAuth 2.0 ────────────────────────────────
export async function postTweet(
  text: string,
  options: { replyToId?: string } = {}
): Promise<{ id: string; text: string }> {
  const accessToken = process.env.X_ACCESS_TOKEN_V2

  if (!accessToken) throw new Error('X_ACCESS_TOKEN_V2 not configured')

  const url = X_BASE + '/tweets'
  const body: Record<string, unknown> = { text }
  if (options.replyToId) {
    body.reply = { in_reply_to_tweet_id: options.replyToId }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error('X post failed: ' + res.status + ' — ' + err)
  }

  const data = await res.json()
  return data.data
}

// ── Post a thread ─────────────────────────────────────────────
export async function postThread(tweets: string[]): Promise<string[]> {
  const ids: string[] = []
  let replyToId: string | undefined

  for (const text of tweets) {
    const posted = await postTweet(text, replyToId ? { replyToId } : {})
    ids.push(posted.id)
    replyToId = posted.id
    await new Promise(r => setTimeout(r, 2000))
  }

  return ids
}

// ── Search tweets via Tavily (free) ──────────────────────────
// Uses site:x.com search to find relevant tweets without X API credits
export async function searchTweetsViaTavily(
  query: string,
  maxResults: number = 10
): Promise<Array<{
  id: string
  text: string
  url: string
  author: string
  score: number
}>> {
  const tavilyKey = process.env.TAVILY_API_KEY
  if (!tavilyKey) throw new Error('TAVILY_API_KEY not configured')

  const searchQuery = 'site:x.com OR site:twitter.com ' + query

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: tavilyKey,
      query: searchQuery,
      search_depth: 'basic',
      max_results: maxResults,
      include_answer: false,
    }),
  })

  if (!res.ok) throw new Error('Tavily search failed: ' + res.status)

  const data = await res.json()
  const results = data.results || []

  return results
    .filter(r => r.url && (r.url.includes('x.com') || r.url.includes('twitter.com')))
    .map(r => {
      // Extract tweet ID from URL
      const match = r.url.match(/status\/(\d+)/)
      const id = match ? match[1] : r.url
      // Extract author from URL
      const authorMatch = r.url.match(/(?:x|twitter)\.com\/([^/]+)\/status/)
      const author = authorMatch ? authorMatch[1] : 'unknown'

      return {
        id,
        text: r.content || r.title || '',
        url: r.url,
        author,
        score: r.score || 0,
      }
    })
    .filter(t => t.id && t.id.match(/^\d+$/))
}

// ── Validate OAuth 2.0 token ──────────────────────────────────
export async function validateXCredentials(): Promise<{
  valid: boolean
  username?: string
  error?: string
  mode?: string
}> {
  const token = process.env.X_ACCESS_TOKEN_V2
  if (!token) {
    return { valid: false, error: 'X_ACCESS_TOKEN_V2 not set in environment variables' }
  }

  try {
    const res = await fetch(X_BASE + '/users/me', {
      headers: { Authorization: 'Bearer ' + token },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { valid: false, error: res.status + ': ' + JSON.stringify(body) }
    }

    const data = await res.json()
    return { valid: true, username: data.data?.username, mode: 'oauth2' }
  } catch (err) {
    return { valid: false, error: String(err) }
  }
}

// ── Keyword presets ───────────────────────────────────────────
export const X_KEYWORD_PRESETS = [
  {
    id: 'sme_pain',
    label: 'SME Pain Points',
    query: 'small business struggling cash flow margins inventory',
    description: 'Founders talking about business problems',
  },
  {
    id: 'shopify_problems',
    label: 'Shopify Problems',
    query: 'shopify margins shipping profit not making money',
    description: 'Shopify sellers with margin/stock issues',
  },
  {
    id: 'amazon_sellers',
    label: 'Amazon Seller Pain',
    query: 'amazon fba fees margins profit not worth it',
    description: 'FBA sellers frustrated with fees',
  },
  {
    id: 'ecommerce_data',
    label: 'eCommerce Data Questions',
    query: 'ecommerce analytics which product best selling track sales',
    description: 'Sellers asking data/analytics questions',
  },
  {
    id: 'ai_business',
    label: 'AI for Business',
    query: 'AI for small business analytics founder data insights',
    description: 'People exploring AI for their business',
  },
  {
    id: 'uk_retail',
    label: 'UK Retail Pain',
    query: 'UK retail shop inflation costs margins losing money',
    description: 'UK retailers struggling with costs',
  },
]
