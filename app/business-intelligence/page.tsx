import { Metadata } from 'next'
import Link from 'next/link'
import { COUNTRY_HUBS } from '@/lib/country-hub-content'

export const metadata: Metadata = {
  title: 'Business Intelligence for Emerging Markets | AskBiz',
  description: 'AskBiz provides data-driven business intelligence tools for SMEs across Africa, Asia, and Latin America. Explore country-specific analytics for 50+ markets.',
  openGraph: {
    title: 'Business Intelligence for Emerging Markets | AskBiz',
    description: 'AskBiz provides data-driven business intelligence tools for SMEs across Africa, Asia, and Latin America.',
  },
}

const REGION_ORDER = [
  'West Africa',
  'East Africa',
  'Southern Africa',
  'North Africa',
  'Central Africa',
  'South Asia',
  'Southeast Asia',
  'Latin America',
]

export default function BusinessIntelligencePage() {
  const countriesByRegion = REGION_ORDER.map((region) => ({
    region,
    countries: COUNTRY_HUBS.filter((hub) => hub.region === region),
  })).filter((group) => group.countries.length > 0)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Business Intelligence for Emerging Markets
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Data-driven analytics tools designed for the unique challenges and opportunities of 50 markets across Africa, Asia, and Latin America.
          </p>
          <Link
            href="/signin"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Country Grid by Region */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {countriesByRegion.map((group) => (
            <div key={group.region} className="mb-16 last:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                {group.region}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.countries.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={`/business-intelligence/${hub.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 hover:shadow-md transition"
                  >
                    <span className="text-3xl block mb-2">{hub.flag}</span>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition">
                      {hub.country}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why AskBiz for Emerging Markets
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Built for Local Realities
              </h3>
              <p className="text-gray-600">
                Every market has unique currencies, payment systems, tax regimes, and business practices. AskBiz is configured for each country, not retrofitted from a Western template.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Works Anywhere
              </h3>
              <p className="text-gray-600">
                From Lagos to rural Madagascar, AskBiz works on low-bandwidth connections, mobile devices, and even fully offline. Your analytics are always accessible.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Affordable at Every Scale
              </h3>
              <p className="text-gray-600">
                Pricing tiers designed for each market ensure that businesses from micro-enterprises to mid-sized companies can access professional-grade analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to grow with data?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses across emerging markets using AskBiz to make smarter decisions.
          </p>
          <Link
            href="/signin"
            className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </main>
  )
}
