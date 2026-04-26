// ============================================================
// X (Twitter) API — OAuth 1.0a posting + Tavily search
// ============================================================
const X_BASE = 'https://api.twitter.com/2'

function sign(method: string, url: string): string {
  const crypto = require('crypto')
  const ck  = process.env.X_API_KEY || 'xhk9VIguFgydo0ydCNEWb5281'
  const cs  = process.env.X_API_SECRET || 'iXFTSd0J14xPKhCMzBaFc8MzZouo7gPTHRySYFOngk1DY6a86q'
  const at  = process.env.X_ACCESS_TOKEN || '1564902406680444928-gNzNlugCWVTpnXCOi8akKCqW15ZZZw'
  const ats = process.env.X_ACCESS_TOKEN_SECRET || 'Mimr5lbDV8KT0ZrArWPJ591U8QAR9WkexeX4935iTNzFL'

  const nonce = crypto.randomBytes(16).toString('hex')
  const ts    = String(Math.floor(Date.now() / 1000))

  const p: Record<string,string> = {
    oauth_consumer_key:     ck,
    oauth_nonce:            nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        ts,
    oauth_token:            at,
    oauth_version:          '1.0',
  }

  const enc = (s: string) => encodeURIComponent(s)

  const base = method + '&' + enc(url) + '&' +
    enc(Object.keys(p).sort().map(k => enc(k) + '=' + enc(p[k])).join('&'))

  const key = enc(cs) + '&' + enc(ats)
  p.oauth_signature = crypto.createHmac('sha1', key).update(base).digest('base64')

  return 'OAuth ' + Object.keys(p).sort()
    .map(k => enc(k) + '="' + enc(p[k]) + '"').join(', ')
}

export async function postTweet(
  text: string,
  options: { replyToId?: string } = {}
): Promise<{ id: string; text: string }> {
  if (!process.env.X_API_KEY) throw new Error('X_API_KEY not set in Vercel environment variables')
  if (!process.env.X_ACCESS_TOKEN) throw new Error('X_ACCESS_TOKEN not set in Vercel environment variables')

  const url  = X_BASE + '/tweets'
  const body: Record<string,unknown> = { text }
  if (options.replyToId) body.reply = { in_reply_to_tweet_id: options.replyToId }

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: sign('POST', url), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const raw = await res.text()
  if (!raw) throw new Error('Empty response from X. Status: ' + res.status)

  const data = JSON.parse(raw)
  if (!res.ok) throw new Error('X post failed (' + res.status + '): ' + (data.detail || data.title || raw))

  return data.data as { id: string; text: string }
}

export async function postThread(tweets: string[]): Promise<string[]> {
  const ids: string[] = []
  let replyToId: string | undefined
  for (const text of tweets) {
    const p = await postTweet(text, replyToId ? { replyToId } : {})
    ids.push(p.id)
    replyToId = p.id
    await new Promise(r => setTimeout(r, 2000))
  }
  return ids
}

export async function searchTweetsViaTavily(query: string, maxResults = 10) {
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
      include_answer: false,
    }),
  })
  if (!res.ok) throw new Error('Tavily search failed: ' + res.status)
  const data = await res.json()

  return (data.results || [])
    .filter(r => r.url && (r.url.includes('x.com') || r.url.includes('twitter.com')))
    .map(r => ({
      id:     (r.url.match(/status\/(\d+)/) || [])[1] || '',
      text:   r.content || r.title || '',
      url:    r.url,
      author: (r.url.match(/(?:x|twitter)\.com\/([^/]+)\/status/) || [])[1] || 'unknown',
      score:  r.score || 0,
    }))
    .filter(t => t.id && /^\d+$/.test(t.id))
}

export async function validateXCredentials() {
  const missing = ['X_API_KEY','X_API_SECRET','X_ACCESS_TOKEN','X_ACCESS_TOKEN_SECRET']
    .filter(k => !process.env[k])

  if (missing.length) return { valid: false, error: 'Missing env vars: ' + missing.join(', ') }

  try {
    const url = X_BASE + '/users/me'
    const res = await fetch(url, { headers: { Authorization: sign('GET', url) } })
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
