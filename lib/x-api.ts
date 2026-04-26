// ============================================================
// X (Twitter) API
// Posting: OAuth 1.0a (fixed signing)
// Search: Tavily
// ============================================================

const X_BASE = 'https://api.twitter.com/2'

function pct(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21').replace(/'/g, '%27')
    .replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
}

function buildOAuthHeader(method: string, url: string): string {
  const crypto = require('crypto')

  const consumerKey    = process.env.X_API_KEY!
  const consumerSecret = process.env.X_API_SECRET!
  const accessToken    = process.env.X_ACCESS_TOKEN!
  const accessSecret   = process.env.X_ACCESS_TOKEN_SECRET!

  const timestamp = String(Math.floor(Date.now() / 1000))
  const nonce     = crypto.randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, '')

  const params: Record<string, string> = {
    oauth_consumer_key:     consumerKey,
    oauth_nonce:            nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        timestamp,
    oauth_token:            accessToken,
    oauth_version:          '1.0',
  }

  // Build parameter string — sorted, percent encoded
  const paramStr = Object.keys(params)
    .sort()
    .map(k => pct(k) + '=' + pct(params[k]))
    .join('&')

  // Signature base string
  const base = method.toUpperCase() + '&' + pct(url) + '&' + pct(paramStr)

  // Signing key
  const signingKey = pct(consumerSecret) + '&' + pct(accessSecret)

  // HMAC-SHA1
  const signature = crypto.createHmac('sha1', signingKey).update(base).digest('base64')

  params['oauth_signature'] = signature

  // Build Authorization header
  return 'OAuth ' + Object.keys(params)
    .sort()
    .map(k => pct(k) + '="' + pct(params[k]) + '"')
    .join(', ')
}

export async function postTweet(
  text: string,
  options: { replyToId?: string } = {}
): Promise<{ id: string; text: string }> {
  const required = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET']
  const missing  = required.filter(k => !process.env[k])
  if (missing.length) throw new Error('Missing env vars: ' + missing.join(', '))

  const url  = X_BASE + '/tweets'
  const body: Record<string, unknown> = { text }
  if (options.replyToId) body.reply = { in_reply_to_tweet_id: options.replyToId }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization:  buildOAuthHeader('POST', url),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const raw = await res.text()
  if (!raw) throw new Error('Empty response from X. Status: ' + res.status)

  let data: Record<string, unknown>
  try { data = JSON.parse(raw) } catch { throw new Error('Non-JSON from X: ' + raw.slice(0, 200)) }

  if (!res.ok) {
    throw new Error('X post failed (' + res.status + '): ' + ((data.detail as string) || (data.title as string) || JSON.stringify(data)))
  }

  const tweet = data.data as { id: string; text: string }
  if (!tweet?.id) throw new Error('No tweet data in response: ' + JSON.stringify(data))
  return tweet
}

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

export async function searchTweetsViaTavily(
  query: string,
  maxResults = 10
): Promise<Array<{ id: string; text: string; url: string; author: string; score: number }>> {
  const key = process.env.TAVILY_API_KEY
  if (!key) throw new Error('TAVILY_API_KEY not configured')

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: key,
      query: 'site:x.com OR site:twitter.com ' + query,
      search_depth: 'basic',
      max_results: maxResults,
    }),
  })

  if (!res.ok) throw new Error('Tavily failed: ' + res.status)
  const data = await res.json()

  return (data.results || [])
    .filter(r => r.url?.includes('x.com') || r.url?.includes('twitter.com'))
    .map(r => {
      const idMatch     = r.url.match(/status\/(\d+)/)
      const authorMatch = r.url.match(/(?:x|twitter)\.com\/([^/]+)\/status/)
      return {
        id:     idMatch     ? idMatch[1]     : '',
        author: authorMatch ? authorMatch[1] : 'unknown',
        text:   r.content || r.title || '',
        url:    r.url,
        score:  r.score || 0,
      }
    })
    .filter(t => /^\d+$/.test(t.id))
}

export async function validateXCredentials(): Promise<{
  valid: boolean; username?: string; error?: string; mode?: string
}> {
  const required = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET']
  const missing  = required.filter(k => !process.env[k])
  if (missing.length) return { valid: false, error: 'Missing env vars: ' + missing.join(', ') }

  try {
    const url = X_BASE + '/users/me'
    const res = await fetch(url, { headers: { Authorization: buildOAuthHeader('GET', url) } })
    const raw = await res.text()
    if (!raw) return { valid: false, error: 'Empty response, status: ' + res.status }
    const data = JSON.parse(raw)
    if (!res.ok) return { valid: false, error: res.status + ': ' + JSON.stringify(data) }
    return { valid: true, username: data.data?.username, mode: 'oauth1' }
  } catch (err) {
    return { valid: false, error: String(err) }
  }
}

export const X_KEYWORD_PRESETS = [
  { id: 'sme_pain',         label: 'SME Pain Points',         query: 'small business struggling cash flow margins inventory',       description: 'Founders talking about business problems' },
  { id: 'shopify_problems', label: 'Shopify Problems',         query: 'shopify margins shipping profit not making money',            description: 'Shopify sellers with margin/stock issues' },
  { id: 'amazon_sellers',   label: 'Amazon Seller Pain',       query: 'amazon fba fees margins profit not worth it',                description: 'FBA sellers frustrated with fees' },
  { id: 'ecommerce_data',   label: 'eCommerce Data Questions', query: 'ecommerce analytics which product best selling track sales', description: 'Sellers asking data questions' },
  { id: 'ai_business',      label: 'AI for Business',          query: 'AI for small business analytics founder data insights',      description: 'People exploring AI for their business' },
  { id: 'uk_retail',        label: 'UK Retail Pain',           query: 'UK retail shop inflation costs margins losing money',        description: 'UK retailers struggling with costs' },
]
