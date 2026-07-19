import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/docs/JsonLd'
import Logo from '@/components/Logo'
import { organizationAndWebsite, webPage, SITE } from '@/lib/schema'
import { CORE_ENDPOINTS } from '@/lib/endpoints'
import { PLANS, formatQuota } from '@/lib/plan-limits'

const URL = `${SITE}/pricing`
const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

export const metadata: Metadata = {
  title: 'Pricing — AskBiz API',
  description: 'AskBiz API pricing: free, growth, and business plans with real monthly quotas and per-minute limits, plus per-call prices for billed endpoints — billed only on success, never on a failed or rejected call.',
  alternates: { canonical: URL },
  openGraph: { title: 'Pricing — AskBiz API', description: 'Free, growth, and business plans — billed only on success.', url: URL, type: 'website' },
}

const billedEndpoints = CORE_ENDPOINTS.filter(e => typeof e.priceCents === 'number')

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950">
      <header className="border-b border-ink-800">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 no-underline text-ink-50">
            <Logo size={28} />
            <span className="font-display font-bold text-sm tracking-tight whitespace-nowrap">AskBiz Developers</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/docs" className={`px-3 py-2 rounded-md text-sm font-medium text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors ${focusRing}`}>
              Docs
            </Link>
            <Link href="/signin" className={`px-4 py-2 rounded-md bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors ${focusRing}`}>
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 md:px-6 pt-16 pb-10 text-center">
          <h1 className="font-display text-4xl font-bold text-ink-50 mb-4 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-ink-300 text-base leading-relaxed max-w-xl mx-auto">
            Plans set your monthly quota and per-minute rate limit. A handful of endpoints are billed per call on top
            of that, at the prices below — and only on success. See{' '}
            <a href="/docs/api-reference/pricing" className="text-signal-300 underline underline-offset-2">
              <code>GET /api/v1/pricing</code>
            </a>{' '}
            for the live, authoritative numbers.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <div key={plan.id} className={`rounded-2xl border p-6 flex flex-col ${plan.id === 'growth' ? 'border-signal-500 bg-ink-900' : 'border-ink-700 bg-ink-900'}`}>
                {plan.id === 'growth' && (
                  <span className="self-start text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300 mb-3">Most common</span>
                )}
                <h2 className="font-display text-xl font-bold text-ink-50 mb-1">{plan.label}</h2>
                <p className="text-ink-400 text-sm mb-5">{plan.tagline}</p>
                <dl className="space-y-2.5 mb-6 flex-1">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-ink-400 text-xs">Monthly requests</dt>
                    <dd className="text-ink-100 text-sm font-semibold">{formatQuota(plan.monthlyQuota)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-ink-400 text-xs">Per-minute limit</dt>
                    <dd className="text-ink-100 text-sm font-semibold">{plan.perMinuteLimit}/min</dd>
                  </div>
                </dl>
                <Link
                  href="/signin"
                  className={`text-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${focusRing} ${
                    plan.id === 'growth'
                      ? 'bg-signal-500 text-ink-950 hover:bg-signal-400'
                      : 'border border-ink-600 text-ink-200 hover:bg-ink-800'
                  }`}
                >
                  {plan.id === 'free' ? 'Get started free' : `Upgrade to ${plan.label}`}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-ink-500 text-xs text-center mt-5">
            Already have keys? Upgrade from{' '}
            <Link href="/dashboard/settings" className="text-signal-300 underline underline-offset-2">Settings → Billing</Link> —
            the new plan applies to every key on your account immediately.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
          <h2 className="font-display text-lg font-bold text-ink-50 mb-1">Billed per call, on top of your plan</h2>
          <p className="text-ink-400 text-sm mb-6">
            These endpoints debit your credit wallet on success only — a failed or rejected call is never charged.
            Top up credits from <Link href="/dashboard/settings" className="text-signal-300 underline underline-offset-2">Settings</Link>.
          </p>
          <div className="border border-ink-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700 text-ink-300 text-left bg-ink-900">
                  <th className="px-4 py-2.5 font-medium">Endpoint</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {billedEndpoints.map(e => (
                  <tr key={e.slug} className="border-b border-ink-800 last:border-0">
                    <td className="px-4 py-2.5">
                      <a href={`/docs/api-reference/${e.slug}`} className="text-signal-300 underline underline-offset-2">
                        <code>{e.method} {e.path}</code>
                      </a>
                    </td>
                    <td className="px-4 py-2.5 text-ink-100 font-medium">{e.priceCents}¢ / call</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-2.5 text-ink-300">Everything else on this plan</td>
                  <td className="px-4 py-2.5 text-ink-100 font-medium">Included, no per-call charge</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-800">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-400">
          <span>&copy; {new Date().getFullYear()} AskBiz Ltd.</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="https://askbiz.co" className="hover:text-signal-300 transition-colors">askbiz.co</a>
            <Link href="/docs" className="hover:text-signal-300 transition-colors">Docs</Link>
            <Link href="/docs/terms" className="hover:text-signal-300 transition-colors">Terms</Link>
            <Link href="/docs/privacy" className="hover:text-signal-300 transition-colors">Privacy</Link>
            <a href="mailto:hello@askbiz.co" className="hover:text-signal-300 transition-colors">hello@askbiz.co</a>
          </div>
        </div>
      </footer>

      <JsonLd data={organizationAndWebsite()} />
      <JsonLd data={webPage({
        url: URL,
        name: 'Pricing — AskBiz API',
        description: 'Free, growth, and business API plans with real monthly quotas and per-minute limits, plus per-call prices for billed endpoints.',
        dateModified: '2026-07-19',
        breadcrumb: [{ name: 'Pricing', url: URL }],
      })} />
    </div>
  )
}
