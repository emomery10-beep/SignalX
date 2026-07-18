import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import JsonLd from '@/components/docs/JsonLd'
import { organizationAndWebsite, SITE } from '@/lib/schema'
import { CORE_ENDPOINTS } from '@/lib/endpoints'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

export const metadata: Metadata = {
  title: 'AskBiz Developers — Build on the API that powers AskBiz',
  description: 'Vision recognition, WhatsApp messaging, and business-intelligence APIs for African SME commerce. Billed only on success, priced in the open, idempotent by design.',
  alternates: { canonical: SITE },
  openGraph: {
    title: 'AskBiz Developers',
    description: 'Build on the API that powers AskBiz — vision, WhatsApp, and business-intelligence, billed only on success.',
    url: SITE,
    siteName: 'AskBiz Developers',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'AskBiz Developers', description: 'Vision, WhatsApp, and business-intelligence APIs for African SME commerce.' },
}

const BENEFITS = [
  {
    title: 'Billed only on success',
    body: 'A failed or rejected call is never charged — check real, live prices at GET /api/v1/pricing before you write a line of code.',
  },
  {
    title: 'Idempotent by design',
    body: 'Send an Idempotency-Key header on billed endpoints and a network retry returns your original result instead of double-charging.',
  },
  {
    title: 'Real merchant consent',
    body: 'Request scoped access to a merchant’s account and they see exactly what you’re asking for on a real consent screen — narrow-only, never widened.',
  },
  {
    title: 'Ground-truthed docs',
    body: 'Every parameter and error code in the docs is checked against the live route — plus a machine-readable OpenAPI spec for AI coding agents.',
  },
]

const curlSample = `curl -X POST https://askbiz.co/api/v1/scan \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"image": "<base64-encoded JPEG>"}'

# {"found":true,"name":"Coca-Cola 500ml","price":80,"stock_qty":24,...}`

export default async function DeveloperHome() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-ink-950">
      <header className="border-b border-ink-800">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-ink-50">
            <div className="w-7 h-7 rounded-md bg-signal-500 flex items-center justify-center text-ink-950 font-bold text-sm flex-shrink-0">A</div>
            <span className="font-display font-bold text-sm tracking-tight whitespace-nowrap">AskBiz Developers</span>
          </div>
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
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
          <p className="text-signal-300 text-xs font-semibold tracking-wide uppercase mb-4">AskBiz API</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-50 mb-5 tracking-tight leading-tight">
            Build on the API that powers AskBiz
          </h1>
          <p className="text-ink-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Vision recognition, WhatsApp messaging, and business-intelligence Q&amp;A for African SME commerce —
            the same engine behind the AskBiz app, available pay-per-use.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs/quickstart" className={`px-6 py-3 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors ${focusRing}`}>
              Get started →
            </Link>
            <Link href="/docs/api-reference" className={`px-6 py-3 rounded-lg border border-ink-600 text-ink-200 text-sm font-medium hover:bg-ink-800 transition-colors ${focusRing}`}>
              Browse API reference
            </Link>
          </div>
        </section>

        {/* Code sample */}
        <section className="max-w-2xl mx-auto px-4 md:px-6 pb-20">
          <div className="border border-ink-700 rounded-xl overflow-hidden bg-ink-900">
            <div className="px-4 py-2.5 border-b border-ink-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-ink-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-ink-700" />
              <span className="text-ink-400 text-xs ml-2">Identify a product from a photo</span>
            </div>
            <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-ink-100"><code>{curlSample}</code></pre>
          </div>
        </section>

        {/* Feature grid */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20">
          <h2 className="font-display text-2xl font-bold text-ink-50 mb-2 text-center">Five endpoints, one API key</h2>
          <p className="text-ink-300 text-sm text-center mb-10 max-w-lg mx-auto">
            Every endpoint documented with real request/response shapes, error codes, and pricing — not a sales page.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {CORE_ENDPOINTS.map(e => (
              <Link key={e.slug} href={`/docs/api-reference/${e.slug}`}
                className={`block border border-ink-700 rounded-xl p-5 bg-ink-900 hover:border-signal-600 transition-colors ${focusRing}`}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-signal-300">{e.method}</span>
                  <code className="text-sm text-ink-100">{e.path}</code>
                </div>
                <p className="text-ink-400 text-xs leading-relaxed">{e.summary}</p>
              </Link>
            ))}
            <Link href="/docs/guides/webhooks"
              className={`block border border-ink-700 rounded-xl p-5 bg-ink-900 hover:border-signal-600 transition-colors ${focusRing}`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-signal-300">WEBHOOKS</span>
              </div>
              <p className="text-ink-400 text-xs leading-relaxed">React to sale.created, purchase_order.received, and stock.low events in real time instead of polling.</p>
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20">
          <h2 className="font-display text-2xl font-bold text-ink-50 mb-10 text-center">Built to be trusted, not just tried</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-signal-600/20 flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-signal-400" />
                </div>
                <div>
                  <h3 className="text-ink-50 text-sm font-semibold mb-1">{b.title}</h3>
                  <p className="text-ink-400 text-xs leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 md:px-6 pb-24 text-center">
          <div className="border border-ink-700 rounded-2xl bg-ink-900 px-8 py-12">
            <h2 className="font-display text-2xl font-bold text-ink-50 mb-3">Ready to build?</h2>
            <p className="text-ink-300 text-sm mb-6 max-w-sm mx-auto">
              Create an account, get an API key, and make your first call in a few minutes — no card required to start.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/signin" className={`px-6 py-3 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors ${focusRing}`}>
                Create your first key →
              </Link>
              <Link href="/docs" className={`px-6 py-3 rounded-lg border border-ink-600 text-ink-200 text-sm font-medium hover:bg-ink-800 transition-colors ${focusRing}`}>
                Read the docs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-800">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-400">
          <span>&copy; {new Date().getFullYear()} AskBiz Ltd.</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="https://askbiz.co" className="hover:text-signal-300 transition-colors">askbiz.co</a>
            <Link href="/docs" className="hover:text-signal-300 transition-colors">Docs</Link>
            <a href="https://askbiz.co/terms" className="hover:text-signal-300 transition-colors">Terms</a>
            <a href="https://askbiz.co/privacy" className="hover:text-signal-300 transition-colors">Privacy</a>
            <a href="mailto:hello@askbiz.co" className="hover:text-signal-300 transition-colors">hello@askbiz.co</a>
          </div>
        </div>
      </footer>

      <JsonLd data={organizationAndWebsite()} />
    </div>
  )
}
