import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'
import { CORE_ENDPOINTS } from '@/lib/endpoints'
import { GUIDES } from '@/lib/guides'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

export const metadata: Metadata = {
  title: 'AskBiz API Documentation — Vision, WhatsApp, and Business-Intelligence APIs',
  description: 'Build on the AskBiz API: product-recognition vision, WhatsApp receipts and purchase orders, business-intelligence Q&A, merchant connections, billing-on-behalf-of, and real-time webhooks. Pay-per-use, transparent pricing, idempotent by design.',
  alternates: { canonical: `${SITE}/docs` },
  openGraph: {
    title: 'AskBiz API Documentation',
    description: 'Vision, WhatsApp, and business-intelligence APIs for African SME commerce — transparent pricing, idempotent by design.',
    url: `${SITE}/docs`,
    siteName: 'AskBiz Developers',
    type: 'website',
  },
}

export default function DocsHomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-14">
      <div className="max-w-2xl mb-14">
        <p className="text-signal-300 text-xs font-semibold tracking-wide uppercase mb-3">AskBiz API Documentation</p>
        <h1 className="font-display text-4xl font-bold text-ink-50 mb-4 tracking-tight">
          Build on the API that powers AskBiz
        </h1>
        <p className="text-ink-300 text-base leading-relaxed mb-6">
          AskBiz is a phone-first point-of-sale and business-intelligence platform used by market vendors and small
          businesses across Africa. The same vision recognition, WhatsApp messaging, and business-question-answering
          that power the AskBiz app are available as a pay-per-use REST API — billed only on success, priced in the
          open, and safe to retry with idempotency keys.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs/quickstart" className={`px-5 py-3 rounded-lg bg-signal-500 text-ink-950 text-sm font-semibold hover:bg-signal-400 transition-colors ${focusRing}`}>
            Get started →
          </Link>
          <Link href="/docs/api-reference" className={`px-5 py-3 rounded-lg border border-ink-600 text-ink-200 text-sm font-medium hover:bg-ink-800 transition-colors ${focusRing}`}>
            Browse API reference
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-14">
        {CORE_ENDPOINTS.map(e => (
          <Link key={e.slug} href={`/docs/api-reference/${e.slug}`}
            className={`block border border-ink-700 rounded-xl p-5 bg-ink-900 hover:border-signal-600 transition-colors ${focusRing}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-signal-300">{e.method}</span>
              <code className="text-sm text-ink-100">{e.path}</code>
            </div>
            <p className="text-ink-300 text-xs leading-relaxed">{e.summary}</p>
          </Link>
        ))}
      </div>

      <div className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-ink-50">Guides</h2>
          <Link href="/docs/guides" className={`text-signal-300 text-sm hover:text-signal-200 ${focusRing}`}>View all →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {GUIDES.slice(0, 4).map(g => (
            <Link key={g.slug} href={`/docs/guides/${g.slug}`}
              className={`block border border-ink-700 rounded-xl p-4 bg-ink-900 hover:border-signal-600 transition-colors ${focusRing}`}>
              <p className="text-ink-100 text-sm font-medium mb-1">{g.title}</p>
              <p className="text-ink-400 text-xs leading-relaxed">{g.summary}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="border border-ink-700 rounded-xl p-5 bg-ink-900">
          <h3 className="text-ink-50 text-sm font-bold mb-1.5">Billed only on success</h3>
          <p className="text-ink-400 text-xs leading-relaxed">A failed or rejected call is never charged — see <Link href="/docs/api-reference/pricing" className="text-signal-300 underline underline-offset-2">live pricing</Link>.</p>
        </div>
        <div className="border border-ink-700 rounded-xl p-5 bg-ink-900">
          <h3 className="text-ink-50 text-sm font-bold mb-1.5">Idempotent by design</h3>
          <p className="text-ink-400 text-xs leading-relaxed">Send an <code className="text-signal-300">Idempotency-Key</code> header and a network retry never double-charges or double-sends.</p>
        </div>
        <div className="border border-ink-700 rounded-xl p-5 bg-ink-900">
          <h3 className="text-ink-50 text-sm font-bold mb-1.5">Machine-readable spec</h3>
          <p className="text-ink-400 text-xs leading-relaxed">Full OpenAPI 3.0 at <a href="https://askbiz.co/api/v1/openapi.json" className="text-signal-300 underline underline-offset-2">openapi.json</a> — feed it directly to an AI coding agent.</p>
        </div>
      </div>

      <JsonLd data={techArticle({
        url: `${SITE}/docs`,
        headline: 'AskBiz API Documentation',
        description: 'Vision, WhatsApp, and business-intelligence APIs for African SME commerce.',
        breadcrumb: [{ name: 'Docs', url: `${SITE}/docs` }],
      })} />
    </div>
  )
}
