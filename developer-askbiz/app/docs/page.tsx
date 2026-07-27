import type { Metadata } from 'next'
import JsonLd from '@/components/docs/JsonLd'
import Eyebrow from '@/components/ui/Eyebrow'
import Card from '@/components/ui/Card'
import Reveal from '@/components/ui/Reveal'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { techArticle, SITE } from '@/lib/schema'
import { CORE_ENDPOINTS } from '@/lib/endpoints'
import { GUIDES } from '@/lib/guides'

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
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <Reveal>
        <div className="max-w-2xl mb-16">
          <div className="mb-4"><Eyebrow>AskBiz API Documentation</Eyebrow></div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-50 mb-5 tracking-tight">
            Build on the API that powers AskBiz
          </h1>
          <p className="text-ink-300 text-base leading-relaxed mb-8">
            AskBiz is a phone-first point-of-sale and business-intelligence platform used by market vendors and small
            businesses across Africa. The same vision recognition, WhatsApp messaging, and business-question-answering
            that power the AskBiz app are available as a pay-per-use REST API — billed only on success, priced in the
            open, and safe to retry with idempotency keys.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/docs/quickstart">Get started</Button>
            <Button href="/docs/api-reference" variant="secondary">Browse API reference</Button>
          </div>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-5 mb-16">
        {CORE_ENDPOINTS.map((e, i) => (
          <Reveal key={e.slug} delay={i * 50}>
            <Card href={`/docs/api-reference/${e.slug}`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-signal-300">{e.method}</span>
                <code className="text-sm text-ink-100">{e.path}</code>
              </div>
              <p className="text-ink-300 text-xs leading-relaxed">{e.summary}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-ink-50">Guides</h2>
            <Link href="/docs/guides" className="text-signal-300 text-sm hover:text-signal-200 underline underline-offset-4 decoration-white/20 transition-colors">View all guides →</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {GUIDES.slice(0, 4).map(g => (
              <Card key={g.slug} href={`/docs/guides/${g.slug}`} padding="p-4">
                <p className="text-ink-100 text-sm font-medium mb-1">{g.title}</p>
                <p className="text-ink-400 text-xs leading-relaxed">{g.summary}</p>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          <Card interactive={false}>
            <h3 className="text-ink-50 text-sm font-bold mb-1.5">Billed only on success</h3>
            <p className="text-ink-400 text-xs leading-relaxed">A failed or rejected call is never charged — see <a href="/docs/api-reference/pricing" className="text-signal-300 underline underline-offset-2">live pricing</a>.</p>
          </Card>
          <Card interactive={false}>
            <h3 className="text-ink-50 text-sm font-bold mb-1.5">Idempotent by design</h3>
            <p className="text-ink-400 text-xs leading-relaxed">Send an <code className="text-signal-300">Idempotency-Key</code> header and a network retry never double-charges or double-sends.</p>
          </Card>
          <Card interactive={false}>
            <h3 className="text-ink-50 text-sm font-bold mb-1.5">Machine-readable spec</h3>
            <p className="text-ink-400 text-xs leading-relaxed">Full OpenAPI 3.0 at <a href="https://askbiz.co/api/v1/openapi.json" className="text-signal-300 underline underline-offset-2">openapi.json</a> — feed it directly to an AI coding agent.</p>
          </Card>
        </div>
      </Reveal>

      <JsonLd data={techArticle({
        url: `${SITE}/docs`,
        headline: 'AskBiz API Documentation',
        description: 'Vision, WhatsApp, and business-intelligence APIs for African SME commerce.',
        breadcrumb: [{ name: 'Docs', url: `${SITE}/docs` }],
      })} />
    </div>
  )
}
