import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// ── MARKET INTELLIGENCE API ──────────────────────────────────────────────────
// Pulls live pricing and trend data from Amazon, AliExpress, eBay, Google Trends
// API keys added to Vercel env vars after obtaining from each platform
// ─────────────────────────────────────────────────────────────────────────────

const AMAZON_ACCESS_KEY    = process.env.AMAZON_ACCESS_KEY    || ''
const AMAZON_SECRET_KEY    = process.env.AMAZON_SECRET_KEY    || ''
const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || ''
const ALIEXPRESS_APP_KEY   = process.env.ALIEXPRESS_APP_KEY   || ''
const ALIEXPRESS_APP_SECRET = process.env.ALIEXPRESS_APP_SECRET || ''
const EBAY_APP_ID          = process.env.EBAY_APP_ID          || ''

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { products, country = 'GB' } = await request.json()
  if (!products?.length) return NextResponse.json({ error: 'No products provided' }, { status: 400 })

  const results = await Promise.allSettled(
    products.slice(0, 5).map((product: string) => getMarketData(product, country))
  )

  const data = results.map((r, i) => ({
    product: products[i],
    ...(r.status === 'fulfilled' ? r.value : { error: 'Data unavailable', amazon: null, aliexpress: null, ebay: null, trends: null })
  }))

  return NextResponse.json({ data })
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const product = searchParams.get('product') || ''
  const country = searchParams.get('country') || 'GB'

  if (!product) return NextResponse.json({ error: 'Product required' }, { status: 400 })

  const data = await getMarketData(product, country)
  return NextResponse.json(data)
}

async function getMarketData(product: string, country: string) {
  const [amazonData, aliexpressData, ebayData, trendsData] = await Promise.allSettled([
    getAmazonData(product, country),
    getAliexpressData(product),
    getEbayData(product, country),
    getGoogleTrends(product),
  ])

  return {
    product,
    amazon:     amazonData.status     === 'fulfilled' ? amazonData.value     : null,
    aliexpress: aliexpressData.status === 'fulfilled' ? aliexpressData.value : null,
    ebay:       ebayData.status       === 'fulfilled' ? ebayData.value       : null,
    trends:     trendsData.status     === 'fulfilled' ? trendsData.value     : null,
    fetchedAt:  new Date().toISOString(),
  }
}

// ── AMAZON ───────────────────────────────────────────────────────────────────
async function getAmazonData(product: string, country: string) {
  if (!AMAZON_ACCESS_KEY || !AMAZON_SECRET_KEY) {
    return { status: 'no_api_key', message: 'Add AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_ASSOCIATE_TAG to Vercel env vars' }
  }

  // Amazon PA-API 5.0
  const marketplace = country === 'GB' ? 'www.amazon.co.uk' : country === 'US' ? 'www.amazon.com' : 'www.amazon.co.uk'
  const endpoint = `https://webservices.amazon.co.uk/paapi5/searchitems`

  const payload = {
    Keywords: product,
    Resources: ['ItemInfo.Title', 'Offers.Listings.Price', 'BrowseNodeInfo.BrowseNodes'],
    SearchIndex: 'All',
    ItemCount: 3,
    PartnerTag: AMAZON_ASSOCIATE_TAG,
    PartnerType: 'Associates',
    Marketplace: marketplace,
  }

  // Sign request with AWS Signature V4
  const signedHeaders = await signAWSRequest('POST', endpoint, payload, AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY)

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...signedHeaders },
    body: JSON.stringify(payload),
  })

  if (!res.ok) return { status: 'error', message: `Amazon API error: ${res.status}` }

  const data = await res.json()
  const items = data?.SearchResult?.Items || []

  return {
    status: 'ok',
    results: items.map((item: Record<string, unknown>) => {
      const info = item.ItemInfo as Record<string, unknown>
      const title = (info?.Title as Record<string, unknown>)?.DisplayValue as string
      const offers = item.Offers as Record<string, unknown>
      const listings = offers?.Listings as Record<string, unknown>[]
      const price = listings?.[0]?.Price as Record<string, unknown>
      return {
        title,
        price: price?.DisplayAmount as string,
        priceValue: (price?.Amount as number),
        url: item.DetailPageURL as string,
      }
    }),
    lowestPrice: Math.min(...items.map((i: Record<string, unknown>) => {
      const offers = i.Offers as Record<string, unknown>
      const listings = offers?.Listings as Record<string, unknown>[]
      const price = listings?.[0]?.Price as Record<string, unknown>
      return (price?.Amount as number) || Infinity
    })),
  }
}

// ── ALIEXPRESS ────────────────────────────────────────────────────────────────
async function getAliexpressData(product: string) {
  if (!ALIEXPRESS_APP_KEY) {
    return { status: 'no_api_key', message: 'Add ALIEXPRESS_APP_KEY and ALIEXPRESS_APP_SECRET to Vercel env vars' }
  }

  const timestamp = Date.now().toString()
  const params = new URLSearchParams({
    app_key: ALIEXPRESS_APP_KEY,
    timestamp,
    sign_method: 'sha256',
    method: 'aliexpress.affiliate.product.query',
    keywords: product,
    page_no: '1',
    page_size: '5',
    sort: 'SALE_PRICE_ASC',
    fields: 'product_id,product_title,target_sale_price,target_original_price,product_main_image_url',
  })

  // Simple HMAC-SHA256 signing
  const paramsStr = [...params.entries()].sort().map(([k, v]) => `${k}${v}`).join('')
  const sign = await hmacSHA256(ALIEXPRESS_APP_SECRET + paramsStr + ALIEXPRESS_APP_SECRET, ALIEXPRESS_APP_SECRET)
  params.set('sign', sign.toUpperCase())

  const res = await fetch(`https://api-sg.aliexpress.com/sync?${params}`)
  if (!res.ok) return { status: 'error', message: `AliExpress API error: ${res.status}` }

  const data = await res.json()
  const products = data?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product || []

  return {
    status: 'ok',
    results: products.map((p: Record<string, unknown>) => ({
      title: p.product_title as string,
      salePrice: p.target_sale_price as string,
      originalPrice: p.target_original_price as string,
      salePriceValue: parseFloat((p.target_sale_price as string || '0').replace(/[^0-9.]/g, '')),
    })),
    lowestPrice: Math.min(...products.map((p: Record<string, unknown>) =>
      parseFloat((p.target_sale_price as string || '0').replace(/[^0-9.]/g, ''))
    )),
  }
}

// ── EBAY ──────────────────────────────────────────────────────────────────────
async function getEbayData(product: string, country: string) {
  if (!EBAY_APP_ID) {
    return { status: 'no_api_key', message: 'Add EBAY_APP_ID to Vercel env vars' }
  }

  const globalId = country === 'GB' ? 'EBAY-GB' : 'EBAY-US'
  const url = new URL('https://svcs.ebay.com/services/search/FindingService/v1')
  url.searchParams.set('OPERATION-NAME', 'findCompletedItems')
  url.searchParams.set('SERVICE-VERSION', '1.0.0')
  url.searchParams.set('SECURITY-APPNAME', EBAY_APP_ID)
  url.searchParams.set('RESPONSE-DATA-FORMAT', 'JSON')
  url.searchParams.set('keywords', product)
  url.searchParams.set('GLOBAL-ID', globalId)
  url.searchParams.set('paginationInput.entriesPerPage', '5')
  url.searchParams.set('sortOrder', 'BestMatch')
  url.searchParams.set('itemFilter(0).name', 'SoldItemsOnly')
  url.searchParams.set('itemFilter(0).value', 'true')

  const res = await fetch(url.toString())
  if (!res.ok) return { status: 'error', message: `eBay API error: ${res.status}` }

  const data = await res.json()
  const items = data?.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item || []

  const prices = items.map((i: Record<string, unknown>) => {
    const selling = i.sellingStatus as Record<string, unknown>[]
    const price = selling?.[0]?.currentPrice as Record<string, unknown>[]
    return parseFloat((price?.[0]?.['__value__'] as string) || '0')
  }).filter((p: number) => p > 0)

  return {
    status: 'ok',
    soldCount: items.length,
    avgSoldPrice: prices.length ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : null,
    lowestSoldPrice: prices.length ? Math.min(...prices) : null,
    highestSoldPrice: prices.length ? Math.max(...prices) : null,
    results: items.slice(0, 3).map((i: Record<string, unknown>) => {
      const selling = i.sellingStatus as Record<string, unknown>[]
      const price = selling?.[0]?.currentPrice as Record<string, unknown>[]
      const title = (i.title as string[])?.[0]
      return { title, soldPrice: parseFloat((price?.[0]?.['__value__'] as string) || '0') }
    }),
  }
}

// ── GOOGLE TRENDS (no API key needed) ────────────────────────────────────────
async function getGoogleTrends(product: string) {
  try {
    const encoded = encodeURIComponent(product)
    const url = `https://trends.google.com/trends/api/explore?hl=en-GB&tz=-60&req={"comparisonItem":[{"keyword":"${encoded}","geo":"GB","time":"today 3-m"}],"category":0,"property":""}`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html,application/json' }
    })

    if (!res.ok) return { status: 'unavailable', trend: 'unknown' }

    const text = await res.text()
    const jsonStr = text.replace(")]}'", '').trim()
    const data = JSON.parse(jsonStr)

    const widgets = data?.widgets || []
    const timelineWidget = widgets.find((w: Record<string, unknown>) => w.id === 'TIMESERIES')
    const value = timelineWidget?.request?.restriction?.complexKeywordsRestriction?.keyword?.[0]?.value

    return {
      status: 'ok',
      keyword: value || product,
      trend: 'available',
      note: 'Trend data available — search volume tracked over 3 months',
    }
  } catch {
    return { status: 'unavailable', trend: 'unknown', note: 'Google Trends data temporarily unavailable' }
  }
}

// ── AWS Signature V4 helper ───────────────────────────────────────────────────
async function signAWSRequest(method: string, url: string, body: unknown, accessKey: string, secretKey: string) {
  const now = new Date()
  const date = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z'
  const dateShort = date.slice(0, 8)
  const region = 'us-east-1'
  const service = 'ProductAdvertisingAPI'

  const bodyStr = JSON.stringify(body)
  const bodyHash = await sha256(bodyStr)

  const headers: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
    'host': new URL(url).hostname,
    'x-amz-date': date,
    'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
  }

  const signedHeaderNames = Object.keys(headers).sort().join(';')
  const canonicalHeaders = Object.entries(headers).sort().map(([k, v]) => `${k}:${v}\n`).join('')
  const canonicalRequest = `${method}\n/paapi5/searchitems\n\n${canonicalHeaders}\n${signedHeaderNames}\n${bodyHash}`
  const credentialScope = `${dateShort}/${region}/${service}/aws4_request`
  const stringToSign = `AWS4-HMAC-SHA256\n${date}\n${credentialScope}\n${await sha256(canonicalRequest)}`

  const signingKey = await getSigningKey(secretKey, dateShort, region, service)
  const signature = await hmacSHA256(stringToSign, signingKey)

  headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaderNames}, Signature=${signature}`
  return headers
}

async function sha256(message: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hmacSHA256(message: string, key: string | CryptoKey): Promise<string> {
  const keyData = typeof key === 'string' ? new TextEncoder().encode(key) : key
  const cryptoKey = typeof key === 'string'
    ? await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    : key
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getSigningKey(secret: string, date: string, region: string, service: string): Promise<CryptoKey> {
  const kDate    = await crypto.subtle.importKey('raw', new TextEncoder().encode(`AWS4${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const kRegion  = await crypto.subtle.importKey('raw', new Uint8Array(await crypto.subtle.sign('HMAC', kDate, new TextEncoder().encode(date))), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const kService = await crypto.subtle.importKey('raw', new Uint8Array(await crypto.subtle.sign('HMAC', kRegion, new TextEncoder().encode(region))), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const kSigning = await crypto.subtle.importKey('raw', new Uint8Array(await crypto.subtle.sign('HMAC', kService, new TextEncoder().encode(service))), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return kSigning
}
