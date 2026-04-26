// ============================================================
// X (Twitter) API v2 Client for AskBiz Growth Agent
// Handles: search, reply, post thread, like, follow
// ============================================================

const X_BASE = 'https://api.twitter.com/2'

interface XTweet {
  id: string
  text: string
  author_id?: string
  created_at?: string
  public_metrics?: {
    reply_count: number
    retweet_count: number
    like_count: number
    impression_count: number
  }
  author?: {
    id: string
    name: string
    username: string
    public_metrics?: {
      followers_count: number
    }
  }
}

interface XSearchResult {
  data: XTweet[]
  meta?: {
    newest_id: string
    oldest_id: string
    result_count: number
    next_token?: string
  }
}

// ── Auth headers ─────────────────────────────────────────────
function bearerHeaders() {
  const token = process.env.X_BEARER_TOKEN
  if (!token) throw new Error('X_BEARER_TOKEN not configured')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

function oauth1Headers(method: string, url: string, params: Record<string, string> = {}) {
  const consumerKey    = process.env.X_API_KEY
  const consumerSecret = process.env.X_API_SECRET
  const accessToken    = process.env.X_ACCESS_TOKEN
  const accessSecret   = process.env.X_ACCESS_TOKEN_SECRET

  if (!consumerKey || !consumerSecret || !accessToken || !accessSecret) {
    throw new Error('X OAuth1 credentials not configured. Need: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET')
  }

  const nonce     = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const timestamp = Math.floor(Date.now() / 1000).toString()

  const oauthParams: Record<string, string> = {
    oauth_consumer_key:     consumerKey,
    oauth_nonce:            nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        timestamp,
    oauth_token:            accessToken,
    oauth_version:          '1.0',
  }

  // Build signature base string
  const allParams = { ...params, ...oauthParams }
  const sortedParams = Object.keys(allParams).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join('&')

  const baseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join('&')

  // Sign with HMAC-SHA1 (required by Twitter OAuth 1.0a)
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(accessSecret)}`

  const crypto = require('crypto')
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64')

  oauthParams['oauth_signature'] = signature

  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(', ')

  return {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
  }
}

// ── Search tweets ─────────────────────────────────────────────
export async function searchTweets(
  query: string,
  options: {
    maxResults?: number
    sinceId?: string
    lang?: string
    minLikes?: number
  } = {}
): Promise<XSearchResult> {
  const params = new URLSearchParams({
    query: query + ' -is:retweet lang:en',
    max_results: String(Math.min(options.maxResults || 10, 100)),
    'tweet.fields': 'created_at,public_metrics,author_id',
    'expansions': 'author_id',
    'user.fields': 'name,username,public_metrics',
  })

  if (options.sinceId) params.set('since_id', options.sinceId)

  const res = await fetch(`${X_BASE}/tweets/search/recent?${params}`, {
    headers: bearerHeaders(),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`X search failed: ${res.status} — ${err}`)
  }

  const data = await res.json()

  // Attach author data to tweets
  const users = data.includes?.users || []
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))
  if (data.data) {
    data.data = data.data.map(t => ({
      ...t,
      author: userMap[t.author_id],
    }))

    // Filter by min likes if specified
    if (options.minLikes) {
      data.data = data.data.filter(t =>
        (t.public_metrics?.like_count || 0) >= options.minLikes
      )
    }
  }

  return data
}

// ── Post a tweet ─────────────────────────────────────────────
export async function postTweet(
  text: string,
  options: { replyToId?: string } = {}
): Promise<{ id: string; text: string }> {
  const url = `${X_BASE}/tweets`
  const body: Record<string, unknown> = { text }
  if (options.replyToId) {
    body.reply = { in_reply_to_tweet_id: options.replyToId }
  }

  const headers = oauth1Headers('POST', url)
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`X post failed: ${res.status} — ${err}`)
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
    // Rate limit courtesy delay
    await new Promise(r => setTimeout(r, 1500))
  }

  return ids
}

// ── Like a tweet ─────────────────────────────────────────────
export async function likeTweet(tweetId: string, userId: string): Promise<void> {
  const url = `${X_BASE}/users/${userId}/likes`
  const headers = oauth1Headers('POST', url)
  await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tweet_id: tweetId }),
  })
}

// ── Get authenticated user ID ────────────────────────────────
export async function getMyUserId(): Promise<string> {
  const url = `${X_BASE}/users/me`
  const headers = oauth1Headers('GET', url)
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Could not get X user ID: ${res.status}`)
  const data = await res.json()
  return data.data.id
}

// ── Validate credentials ──────────────────────────────────────
export async function validateXCredentials(): Promise<{
  valid: boolean
  username?: string
  error?: string
}> {
  try {
    const url = `${X_BASE}/users/me`
    const headers = oauth1Headers('GET', url)
    const res = await fetch(url, { headers })
    if (!res.ok) {
      const err = await res.text()
      return { valid: false, error: `${res.status}: ${err}` }
    }
    const data = await res.json()
    return { valid: true, username: data.data.username }
  } catch (err) {
    return { valid: false, error: String(err) }
  }
}

// ── Keyword presets for AskBiz ────────────────────────────────
export const X_KEYWORD_PRESETS = [
  {
    id: 'sme_pain',
    label: 'SME Pain Points',
    query: '(small business OR SME OR "shop owner" OR "online seller") (struggling OR "cash flow" OR margins OR inventory OR stockout) -is:retweet',
    description: 'Founders talking about business problems — prime reply targets',
  },
  {
    id: 'shopify_problems',
    label: 'Shopify Problems',
    query: '(shopify) (margins OR shipping OR profit OR "running out" OR stockout OR "not making money") -is:retweet',
    description: 'Shopify sellers with problems AskBiz can solve',
  },
  {
    id: 'amazon_sellers',
    label: 'Amazon Seller Pain',
    query: '("amazon seller" OR "amazon fba" OR "selling on amazon") (fees OR margins OR profit OR ranking OR "not worth it") -is:retweet',
    description: 'Amazon sellers frustrated with margins and fees',
  },
  {
    id: 'ecommerce_data',
    label: 'eCommerce Data Questions',
    query: '(ecommerce OR "e-commerce") ("how do I know" OR "how to track" OR analytics OR "which product" OR "best selling") -is:retweet',
    description: 'eCommerce owners asking data questions',
  },
  {
    id: 'ai_business',
    label: 'AI for Business',
    query: '("AI for business" OR "business intelligence" OR "AI analytics") (SME OR "small business" OR founder OR "shop owner") -is:retweet',
    description: 'People exploring AI for their business',
  },
  {
    id: 'uk_retail',
    label: 'UK Retail Pain',
    query: '("UK retail" OR "UK shop" OR "UK small business") (inflation OR costs OR margins OR "running at a loss") -is:retweet',
    description: 'UK retailers struggling with costs',
  },
]
