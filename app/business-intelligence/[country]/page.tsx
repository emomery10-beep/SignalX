import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { COUNTRY_HUBS } from '@/lib/country-hub-content'

interface Props {
  params: { country: string }
}

export async function generateStaticParams() {
  return COUNTRY_HUBS.map((hub) => ({ country: hub.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hub = COUNTRY_HUBS.find(h => h.slug === params.country)
  if (!hub) return {}
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    openGraph: { title: hub.metaTitle, description: hub.metaDescription },
  }
}

export default function CountryHubPage({ params }: Props) {
  const hub = COUNTRY_HUBS.find(h => h.slug === params.country)
  if (!hub) notFound()

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-5xl mb-4 block">{hub.flag}</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{hub.heroHeading}</h1>
          <p className="text-xl text-gray-300 mb-8">{hub.heroSubtitle}</p>
          <Link href="/signin" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {hub.keyStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The {hub.country} Business Landscape</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{hub.marketOverview}</p>
        </div>
      </section>

      {/* Key Industries */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Industries</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {hub.industries.map((industry, i) => (
              <span key={i} className="bg-white px-5 py-2 rounded-full text-gray-700 font-medium shadow-sm border border-gray-200">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Business Challenges in {hub.country}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {hub.challenges.map((challenge, i) => (
              <div key={i} className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How AskBiz Helps in {hub.country}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {hub.solutions.map((solution, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">FAQ</h2>
          <div className="space-y-6">
            {hub.faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your {hub.country} business?</h2>
          <p className="text-xl mb-8 opacity-90">AskBiz turns your business data into actionable intelligence — no spreadsheets, no consultants.</p>
          <Link href="/signin" className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition">
            Start Free Trial
          </Link>
        </div>
      </section>
    </main>
  )
}
