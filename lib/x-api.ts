// X API — OAuth 1.0a posting + Tavily search
const X_BASE = 'https://api.twitter.com/2'

function buildOAuth1Header(method: string, url: string): string {
  const crypto = require('crypto')
  const ck  = process.env.X_API_KEY!
  const cs  = process.env.X_API_SECRET!
  const at  = process.env.X_ACCESS_TOKEN!
  const ats = process.env.X_ACCESS_TOKEN_SECRET!

  const nonce     = crypto.randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, '')
  const timestamp = String(Math.floor(Date.now() / 1000))

  const params: Record<string, string> = {
    oauth_consumer_key:     ck,
    oauth_nonce:            nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        timestamp,
    oauth_token:            at,
    oauth_version:          '1.0',
  }

  // Percent-encode keys and values, sort, join
  const encode = (s: string) => encodeURIComponent(s).replace(/!/g,'%21').replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/\*/g,'%2A')

  const paramStr = Object.keys(params)
    .sort()
    .map(k => encode(k) + '=' + encode(params[k]))
    .join('&')

  const base = method.toUpperCase() + '&' + encode(url) + '&' + encode(paramStr)
  const key  = encode(cs) + '&' + encode(ats)
  const sig  = crypto.createHmac('sha1', key).update(base).digest('base64')

  params['oauth_signature'] = sig

  return 'OAuth ' + Object.keys(params)
    .sort()
    .map(k => encode(k) + '="' + encode(params[k]) + '"')
    .join(', ')
}

export async function postTweet(text: string, options: { replyToId?: string } = {}): Promise<{ id: string; text: string }> {
  if (!process.env.X_API_KEY || !process.env.X_API_SECRET || !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_TOKEN_SECRET) {
    throw new Error('Missing X OAuth 1.0a credentials in environment variables')
  }

  const url  = X_BASE + '/tweets'
  const body: Record<string, unknown> = { text }
  if (options.replyToId) body.reply = { in_reply_to_tweet_id: options.replyToId }

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: buildOAuth1Header('POST', url), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const raw = await res.text()
  if (!raw) throw new Error('Empty response from X. Status: ' + res.status)

  let data: Record<string, unknown>
  try { data = JSON.parse(raw) } catch { throw new Error('Non-JSON from X: ' + raw.slice(0, 200)) }

  if (!res.ok) {
    throw new Error('X post failed (' + res.status + '): ' + ((data.detail as string) || (data.title as string) || JSON.stringify(data)))
  }

  return (data.data as { id: string; text: string })
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

export async function searchTweetsViaTavily(query: string, maxResults = 10): Promise<Array<{ id: string; text: string; url: string; author: string; score: number }>> {
  const key = process.env.TAVILY_API_KEY
  if (!key) throw new Error('TAVILY_API_KEY not configured')

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: key, query: 'site:x.com OR site:twitter.com ' + query, search_depth: 'basic', max_results: maxResults, include_answer: false }),
  })
  if (!res.ok) throw new Error('Tavily search failed: ' + res.status)

  const data = await res.json()
  return (data.results || [])
    .filter(r => r.url && (r.url.includes('x.com') || r.url.includes('twitter.com')))
    .map(r => {
      const id     = (r.url.match(/status\/(\d+)/) || [])[1] || ''
      const author = (r.url.match(/(?:x|twitter)\.com\/([^/]+)\/status/) || [])[1] || 'unknown'
      return { id, text: r.content || r.title || '', url: r.url, author, score: r.score || 0 }
    })
    .filter(t => t.id && /^\d+$/.test(t.id))
}

export async function validateXCredentials(): Promise<{ valid: boolean; username?: string; error?: string; mode?: string }> {
  const ck = process.env.X_API_KEY, cs = process.env.X_API_SECRET
  const at = process.env.X_ACCESS_TOKEN, ats = process.env.X_ACCESS_TOKEN_SECRET

  if (!ck || !cs || !at || !ats) {
    const missing = ['X_API_KEY','X_API_SECRET','X_ACCESS_TOKEN','X_ACCESS_TOKEN_SECRET'].filter(k => !process.env[k])
    return { valid: false, error: 'Missing: ' + missing.join(', ') }
  }

  try {
    const url = X_BASE + '/users/me'
    const res = await fetch(url, { headers: { Authorization: buildOAuth1Header('GET', url) } })
    const raw = await res.text()
    if (!raw) return { valid: false, error: 'Empty response. Status: ' + res.status }
    const data = JSON.parse(raw)
    if (!res.ok) return { valid: false, error: res.status + ': ' + JSON.stringify(data) }
    return { valid: true, username: data.data?.username, mode: 'oauth1' }
  } catch (err) {
    return { valid: false, error: String(err) }
  }
}

export const X_KEYWORD_PRESETS = [
  { id: 'sme_pain',         label: 'SME Pain Points',         query: 'small business struggling cash flow margins',              description: 'Founders talking about business problems' },
  { id: 'shopify_problems', label: 'Shopify Problems',         query: 'shopify margins profit not making money',                  description: 'Shopify sellers with margin issues' },
  { id: 'amazon_sellers',   label: 'Amazon Seller Pain',       query: 'amazon fba fees margins profit',                           description: 'FBA sellers frustrated with fees' },
  { id: 'ecommerce_data',   label: 'eCommerce Data Questions', query: 'ecommerce analytics best selling product track sales',     description: 'Sellers asking data questions' },
  { id: 'ai_business',      label: 'AI for Business',          query: 'AI small business analytics data insights founder',        description: 'People exploring AI for business' },
  { id: 'uk_retail',        label: 'UK Retail Pain',           query: 'UK retail shop inflation costs margins',                   description: 'UK retailers struggling' },
]
