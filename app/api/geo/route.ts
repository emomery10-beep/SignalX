import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_CURRENCY, CURRENCIES, SECTOR_HINTS, PRICING_TIERS } from '@/lib/geo'

export const runtime = 'nodejs'

// Formatted pricing strings per country (mirrors app/page.tsx PRICING_TIERS)
const APP_PRICING: Record<string, { growth: string; business: string; sym: string; pos: string }> = {
  GB:  { growth: '£19',        business: '£49',        sym: '£',   pos: '£5'        },
  IE:  { growth: '€19',        business: '€49',        sym: '€',   pos: '€5'        },
  DE:  { growth: '€19',        business: '€49',        sym: '€',   pos: '€5'        },
  FR:  { growth: '€19',        business: '€49',        sym: '€',   pos: '€5'        },
  NL:  { growth: '€19',        business: '€49',        sym: '€',   pos: '€5'        },
  ES:  { growth: '€19',        business: '€49',        sym: '€',   pos: '€5'        },
  IT:  { growth: '€19',        business: '€49',        sym: '€',   pos: '€5'        },
  US:  { growth: '$19',        business: '$49',        sym: '$',   pos: '$5'        },
  CA:  { growth: 'CA$25',      business: 'CA$65',      sym: 'CA$', pos: 'CA$7'      },
  AU:  { growth: 'A$27',       business: 'A$75',       sym: 'A$',  pos: 'A$8'       },
  SG:  { growth: 'S$25',       business: 'S$65',       sym: 'S$',  pos: 'S$7'       },
  AE:  { growth: 'AED 69',     business: 'AED 199',    sym: 'AED', pos: 'AED 18'    },
  IN:  { growth: '₹1,499',     business: '₹3,999',     sym: '₹',   pos: '₹400'      },
  KE:  { growth: 'KSh 1,900',  business: 'KSh 4,900',  sym: 'KSh', pos: 'KSh 600'   },
  NG:  { growth: '₦9,900',     business: '₦29,900',    sym: '₦',   pos: '₦2,500'    },
  ZA:  { growth: 'R 290',      business: 'R 890',      sym: 'R',   pos: 'R 90'      },
  GH:  { growth: '₵220',       business: '₵690',       sym: '₵',   pos: '₵25'       },
  UG:  { growth: 'USh 59,000', business: 'USh 179,000',sym: 'USh', pos: 'USh 18,000' },
  TZ:  { growth: 'TSh 39,000', business: 'TSh 119,000',sym: 'TSh', pos: 'TSh 12,000' },
  ET:  { growth: 'Br 890',     business: 'Br 2,900',   sym: 'Br',  pos: 'Br 250'    },
  BR:  { growth: 'R$ 95',      business: 'R$ 245',     sym: 'R$',  pos: 'R$ 25'     },
  MX:  { growth: 'MX$ 320',    business: 'MX$ 820',    sym: 'MX$', pos: 'MX$ 90'    },
  JP:  { growth: '¥2,800',     business: '¥7,200',     sym: '¥',   pos: '¥700'      },
  KR:  { growth: '₩22,000',    business: '₩59,000',    sym: '₩',   pos: '₩6,000'    },
  DEFAULT: { growth: '$19',    business: '$49',         sym: '$',   pos: '$5'        },
}

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
      SN: 'Senegal', JP: 'Japan', KR: 'South Korea', CN: 'China',
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

    const pricing = APP_PRICING[countryCode] || APP_PRICING.DEFAULT

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
      pricing,
    }

    return NextResponse.json(result, {
      headers: {
        // Per-user geo — must not be shared/CDN cached
        'Cache-Control': 'private, no-store',
      },
    })

  } catch (err) {
    // Hard fallback
    return NextResponse.json({
      country: 'United States', countryCode: 'US', city: '', region: '',
      currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar',
      locale: 'en-US', sectorHints: 'retail, ecommerce, logistics',
      trendTopics: [], pricingTier: 'developed', flag: '🇺🇸',
      pricing: APP_PRICING.US,
    })
  }
}
