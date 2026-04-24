import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import LandingClient from '@/components/layout/LandingClient'
import { COUNTRY_CURRENCY, CURRENCIES } from '@/lib/geo'

export default async function HomePage({ searchParams }: { searchParams: { code?: string; token_hash?: string; type?: string } }) {
  // If auth code lands on homepage, redirect to callback
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`)
  }
  if (searchParams.token_hash && searchParams.type) {
    redirect(`/auth/callback?token_hash=${searchParams.token_hash}&type=${searchParams.type}`)
  }

  const headersList = headers()
  const countryCode = headersList.get('x-vercel-ip-country') || 'US'
  const city = headersList.get('x-vercel-ip-city') || ''

  const COUNTRY_NAMES: Record<string, string> = {
    KE: 'Kenya', NG: 'Nigeria', ZA: 'South Africa', UG: 'Uganda',
    TZ: 'Tanzania', GH: 'Ghana', ET: 'Ethiopia', RW: 'Rwanda',
    ZM: 'Zambia', US: 'United States', GB: 'United Kingdom',
    AE: 'UAE', IN: 'India', SG: 'Singapore', CA: 'Canada',
    AU: 'Australia', DE: 'Germany', FR: 'France', IT: 'Italy',
    ES: 'Spain', NL: 'Netherlands', BR: 'Brazil', MX: 'Mexico',
  }

  const country = COUNTRY_NAMES[countryCode] || countryCode
  const currency = COUNTRY_CURRENCY[countryCode] || 'USD'
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD

  const geo = {
    country,
    countryCode,
    city: city ? decodeURIComponent(city) : '',
    region: '',
    currency,
    currencySymbol: currencyInfo.sym,
    currencyName: currencyInfo.name,
    trendTopics: [] as string[],
  }

  return <LandingClient geo={geo} />
}
