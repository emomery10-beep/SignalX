import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_CURRENCY, CURRENCIES, SECTOR_HINTS, PRICING_TIERS } from '@/lib/geo'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // ── 1. Use Vercel's built-in geo headers (free, instant, no API needed) ──
    const vercelCountry = request.headers.get('x-vercel-ip-country')
    const vercelCity    = request.headers.get('x-vercel-ip-city')
    const vercelRegion  = request.headers.get('x-vercel-ip-country-region')

    let countryCode = vercelCountry || 'US'
    let country     = ''
    let city        = vercelCity ? decodeURIComponent(vercelCity) : ''
    let region      = vercelRegion || ''

    // ── 2. If Vercel headers not available, try ipapi.co as fallback ──
    if (!vercelCountry) {
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0].trim() : null

      if (ip && ip !== '127.0.0.1' && ip !== '::1') {
        try {
          const res = await Promise.race([
            fetch(`https://ipapi.co/${ip}/json/`, {
              headers: { 'User-Agent': 'SignalX/1.0' }
            }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
          ]) as Response

          if (res.ok) {
            const d = await res.json()
            if (!d.error) {
              countryCode = d.country_code || countryCode
              country     = d.country_name || ''
              city        = d.city || city
              region      = d.region || region
            }
          }
        } catch (_) {
          // use Vercel headers or defaults
        }
      }
    }

    // ── 3. Map country code to full name if not already set ──
    const COUNTRY_NAMES: Record<string, string> = {
      KE: 'Kenya', NG: 'Nigeria', ZA: 'South Africa', UG: 'Uganda',
      TZ: 'Tanzania', GH: 'Ghana', ET: 'Ethiopia', RW: 'Rwanda',
      ZM: 'Zambia', ZW: 'Zimbabwe', US: 'United States', GB: 'United Kingdom',
      AE: 'UAE', IN: 'India', SG: 'Singapore', CA: 'Canada', AU: 'Australia',
      DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands',
      BR: 'Brazil', MX: 'Mexico', PK: 'Pakistan', BD: 'Bangladesh',
      EG: 'Egypt', MA: 'Morocco', CI: "Côte d'Ivoire", CM: 'Cameroon',
      SN: 'Senegal', MX: 'Mexico', JP: 'Japan', KR: 'South Korea', CN: 'China',
    }
    if (!country) country = COUNTRY_NAMES[countryCode] || countryCode

    // ── 4. Build geo result ──
    const currency     = COUNTRY_CURRENCY[countryCode] || 'USD'
    const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD
    const sectorHints  = SECTOR_HINTS[countryCode] || SECTOR_HINTS.DEFAULT

    const pricingTier =
      ['KE','NG','ZA','GH','UG','TZ','ET','RW','ZM','ZW','MW','MZ','CI','CM','SN'].includes(countryCode) ? 'africa'
      : ['IN','BR','MX','AE','SG','PK','BD','EG','MA'].includes(countryCode) ? 'emerging'
      : 'developed'

    // ── 5. Try Google Trends (non-blocking) ──
    let trendTopics: string[] = []
    try {
      const trendRes = await Promise.race([
        fetch(`https://trends.google.com/trends/trendingsearches/daily/rss?geo=${countryCode}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]) as Response

      if (trendRes.ok) {
        const xml = await trendRes.text()
        const matches = xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || []
        trendTopics = matches
          .slice(1, 6)
          .map(m => m.replace(/<title><!\[CDATA\[|\]\]><\/title>/g, '').trim())
          .filter(Boolean)
      }
    } catch (_) {
      // trends unavailable — that's fine
    }

    const result = {
      country,
      countryCode,
      city,
      region,
      currency,
      currencySymbol: currencyInfo.sym,
      currencyName:   currencyInfo.name,
      locale:         currencyInfo.locale,
      sectorHints,
      trendTopics,
      pricingTier,
      flag: currencyInfo.flag,
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })

  } catch (err) {
    // Hard fallback
    return NextResponse.json({
      country: 'United States', countryCode: 'US', city: '', region: '',
      currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar',
      locale: 'en-US', sectorHints: 'retail, ecommerce, logistics',
      trendTopics: [], pricingTier: 'developed', flag: '🇺🇸',
    })
  }
}
