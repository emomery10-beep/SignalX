import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DEMO_MARKETS, getDemoMarket } from '@/lib/demo-markets'
import { CURRENCIES } from '@/lib/geo'
import PosLiveDemo from '@/components/pos/PosLiveDemo'
import { ScopedLangProvider } from '@/components/LanguageProvider'
import { getInitialCatalogs } from '@/lib/i18n-catalog'

interface Props {
  params: { country: string }
}

const SITE = 'https://askbiz.co'

export function generateStaticParams() {
  return DEMO_MARKETS.map((m) => ({ country: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const market = getDemoMarket(params.country)
  if (!market) return {}
  const { hub, symbol } = market
  const cur = CURRENCIES[market.currency]
  const title = `${hub.country} POS Live Demo — Try AskBiz Free (${cur.name}, ${symbol})`
  const description = `Try the AskBiz point-of-sale live demo for ${hub.country}: real dashboards with sales in ${symbol}, ${market.localPayment}, and inventory — no signup. See how it works for retail, restaurant, salon, repair & factory businesses.`
  const url = `${SITE}/demo/${market.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function CountryDemoPage({ params }: Props) {
  const market = getDemoMarket(params.country)
  if (!market) notFound()
  const { hub, symbol } = market
  const cur = CURRENCIES[market.currency]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hub.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-5xl mb-4 block">{hub.flag}</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AskBiz POS — {hub.country} Live Demo</h1>
          <p className="text-xl text-gray-300 mb-2">{hub.heroSubtitle}</p>
          <p className="text-base text-gray-400">
            Sales in <strong className="text-white">{cur.name} ({symbol})</strong> · built for {market.localPayment} · no signup
          </p>
        </div>
      </section>

      {/* The live demo — pinned to this market's currency + language */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-6 px-2 sm:px-6">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white" dir={market.lang === 'ar' ? 'rtl' : 'ltr'}>
            <ScopedLangProvider lang={market.lang} initialCatalogs={getInitialCatalogs(market.lang)}>
              <PosLiveDemo initialCountry={market.code} showBanner={false} />
            </ScopedLangProvider>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Live interactive demo · mock data · figures shown in {symbol}
          </p>
        </div>
      </section>

      {/* Market overview */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Point of sale for {hub.country} businesses</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{hub.marketOverview}</p>
        </div>
      </section>

      {/* Key stats */}
      {hub.keyStats?.length > 0 && (
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {hub.keyStats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Challenges & solutions */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Challenges in {hub.country}</h2>
            <ul className="space-y-4">
              {hub.challenges.map((c, i) => (
                <li key={i}>
                  <div className="font-semibold text-gray-900">{c.title}</div>
                  <div className="text-gray-600 text-sm mt-1">{c.description}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How AskBiz helps</h2>
            <ul className="space-y-4">
              {hub.solutions.map((s, i) => (
                <li key={i}>
                  <div className="font-semibold text-gray-900">{s.title}</div>
                  <div className="text-gray-600 text-sm mt-1">{s.description}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Industries */}
      {hub.industries?.length > 0 && (
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular in {hub.country}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {hub.industries.map((industry, i) => (
                <span key={i} className="bg-white px-5 py-2 rounded-full text-gray-700 font-medium shadow-sm border border-gray-200">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {hub.faqs?.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{hub.country} FAQ</h2>
            <div className="space-y-6">
              {hub.faqs.map((f, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                  <p className="text-gray-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Start selling with AskBiz in {hub.country}</h2>
          <p className="text-orange-50 mb-8">Free to start · works on any phone · {market.localPayment}</p>
          <Link href="/signin" className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-orange-50 transition">
            Start free — no card needed
          </Link>
        </div>
      </section>
    </main>
  )
}
