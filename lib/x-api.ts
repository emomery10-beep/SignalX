// ============================================================
// X (Twitter) API — OAuth 1.0a for posting (does not expire)
// Search via Tavily (free)
// ============================================================

const X_BASE = 'https://api.twitter.com/2'

// ── Build OAuth 1.0a Authorization header ────────────────────
function buildOAuth1Header(method: string, url: string): string {
  const crypto = require('crypto')

  const ck  = process.env.X_API_KEY || ''
  const cs  = process.env.X_API_SECRET || ''
  const at  = process.env.X_ACCESS_TOKEN || ''
  const ats = process.env.X_ACCESS_TOKEN_SECRET || ''

  const nonce = crypto.randomBytes(16).toString('hex')
  const timestamp = Math.floor(Date.now() / 1000).toString()

  const oauthParams: Record<string, string> = {
    oauth_consumer_key:     ck,
    oauth_nonce:            nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        timestamp,
    oauth_token:            at,
    oauth_version:          '1.0',
  }

  // Signature base string — only oauth params, no body params for JSON POST
  const paramString = Object.keys(oauthParams)
    .sort()
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(oauthParams[k]))
    .join('&')

  const baseString = method.toUpperCase() +
    '&' + encodeURIComponent(url) +
    '&' + encodeURIComponent(paramString)

  const signingKey = encodeURIComponent(cs) + '&' + encodeURIComponent(ats)

  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64')

  oauthParams['oauth_signature'] = signature

  const header = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(k => encodeURIComponent(k) + '="' + encodeURIComponent(oauthParams[k]) + '"')
    .join(', ')

  return header
}

// ── Post a tweet ──────────────────────────────────────────────
export async function postTweet(
  text: string,
  options: { replyToId?: string } = {}
): Promise<{ id: string; text: string }> {
  const ck  = process.env.X_API_KEY
  const cs  = process.env.X_API_SECRET
  const at  = process.env.X_ACCESS_TOKEN
  const ats = process.env.X_ACCESS_TOKEN_SECRET

  if (!ck || !cs || !at || !ats) {
    throw new Error('Missing X OAuth 1.0a credentials. Need: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET')
  }

  const url = X_BASE + '/tweets'
  const body: Record<string, unknown> = { text }
  if (options.replyToId) {
    body.reply = { in_reply_to_tweet_id: options.replyToId }
  }

  const authHeader = buildOAuth1Header('POST', url)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const rawText = await res.text()

  if (!rawText || rawText.trim() === '') {
    throw new Error('X returned empty response. Status: ' + res.status)
  }

  let data: Record<string, unknown>
  try {
    data = JSON.parse(rawText)
  } catch {
    throw new Error('X returned non-JSON: ' + rawText.slice(0, 200))
  }

  if (!res.ok) {
    const detail = (data.detail as string) || (data.title as string) || JSON.stringify(data)
    throw new Error('X post failed (' + res.status + '): ' + detail)
  }

  const tweetData = data.data as { id: string; text: string }
  if (!tweetData?.id) throw new Error('X response missing tweet data: ' + JSON.stringify(data))

  return tweetData
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

// ── Search via Tavily ─────────────────────────────────────────
export async function searchTweetsViaTavily(
  query: string,
  maxResults: number = 10
): Promise<Array<{ id: string; text: string; url: string; author: string; score: number }>> {
  const tavilyKey = process.env.TAVILY_API_KEY
  if (!tavilyKey) throw new Error('TAVILY_API_KEY not configured')

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: tavilyKey,
      query: 'site:x.com OR site:twitter.com ' + query,
      search_depth: 'basic',
      max_results: maxResults,
      include_answer: false,
    }),
  })

  if (!res.ok) throw new Error('Tavily search failed: ' + res.status)

  const data = await res.json()
  return (data.results || [])
    .filter(r => r.url && (r.url.includes('x.com') || r.url.includes('twitter.com')))
    .map(r => {
      const match = r.url.match(/status\/(\d+)/)
      const id = match ? match[1] : ''
      const authorMatch = r.url.match(/(?:x|twitter)\.com\/([^/]+)\/status/)
      const author = authorMatch ? authorMatch[1] : 'unknown'
      return { id, text: r.content || r.title || '', url: r.url, author, score: r.score || 0 }
    })
    .filter(t => t.id && /^\d+$/.test(t.id))
}

// ── Validate credentials ──────────────────────────────────────
export async function validateXCredentials(): Promise<{
  valid: boolean; username?: string; error?: string; mode?: string
}> {
  const ck  = process.env.X_API_KEY
  const cs  = process.env.X_API_SECRET
  const at  = process.env.X_ACCESS_TOKEN
  const ats = process.env.X_ACCESS_TOKEN_SECRET

  if (!ck || !cs || !at || !ats) {
    const missing = ['X_API_KEY','X_API_SECRET','X_ACCESS_TOKEN','X_ACCESS_TOKEN_SECRET']
      .filter(k => !process.env[k])
    return { valid: false, error: 'Missing env vars: ' + missing.join(', ') }
  }

  try {
    const url = X_BASE + '/users/me'
    const authHeader = buildOAuth1Header('GET', url)
    const res = await fetch(url, { headers: { Authorization: authHeader } })
    const rawText = await res.text()
    if (!rawText) return { valid: false, error: 'Empty response from X. Status: ' + res.status }
    const data = JSON.parse(rawText)
    if (!res.ok) return { valid: false, error: res.status + ': ' + JSON.stringify(data) }
    return { valid: true, username: data.data?.username, mode: 'oauth1' }
  } catch (err) {
    return { valid: false, error: String(err) }
  }
}

// ── Keyword presets ───────────────────────────────────────────
export const X_KEYWORD_PRESETS = [
  { id: 'sme_pain',         label: 'SME Pain Points',         query: 'small business struggling cash flow margins inventory',       description: 'Founders talking about business problems' },
  { id: 'shopify_problems', label: 'Shopify Problems',         query: 'shopify margins shipping profit not making money',            description: 'Shopify sellers with margin/stock issues' },
  { id: 'amazon_sellers',   label: 'Amazon Seller Pain',       query: 'amazon fba fees margins profit not worth it',                description: 'FBA sellers frustrated with fees' },
  { id: 'ecommerce_data',   label: 'eCommerce Data Questions', query: 'ecommerce analytics which product best selling track sales', description: 'Sellers asking data questions' },
  { id: 'ai_business',      label: 'AI for Business',          query: 'AI for small business analytics founder data insights',      description: 'People exploring AI for their business' },
  { id: 'uk_retail',        label: 'UK Retail Pain',           query: 'UK retail shop inflation costs margins losing money',        description: 'UK retailers struggling with costs' },
]
