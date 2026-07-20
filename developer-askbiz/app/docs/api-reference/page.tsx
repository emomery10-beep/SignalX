import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleShell from '@/components/docs/ArticleShell'
import { CORE_ENDPOINTS, ACCOUNT_ENDPOINTS } from '@/lib/endpoints'
import { SITE } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'API Reference — AskBiz Developers',
  description: 'Every AskBiz API endpoint: authentication, request and response shapes, pricing, rate limits, and idempotency. Full OpenAPI 3.0 spec included.',
  alternates: { canonical: `${SITE}/docs/api-reference` },
  openGraph: { title: 'API Reference — AskBiz Developers', description: 'Every AskBiz API endpoint, request/response shapes, pricing, and the full OpenAPI 3.0 spec.', url: `${SITE}/docs/api-reference`, type: 'website' },
}

export default function ApiReferenceIndex() {
  return (
    <ArticleShell
      title="API Reference"
      description="Every endpoint you can call directly with an API key, plus the account-management actions available from the dashboard."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'API Reference', href: '/docs/api-reference' }]}
    >
      <h2>Callable with your API key</h2>
      <p>These are the endpoints a third-party integration calls directly, authenticated with the <code>x-api-key</code> header.</p>
      <div className="not-prose grid sm:grid-cols-2 gap-3 mb-8">
        {CORE_ENDPOINTS.map(e => (
          <Link key={e.slug} href={`/docs/api-reference/${e.slug}`}
            className="block border border-ink-700 rounded-xl p-4 bg-ink-900 hover:border-signal-600 transition-colors">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-signal-300">{e.method}</span>
              <code className="text-sm text-ink-100">{e.path}</code>
              {typeof e.priceCents === 'number' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-signal-600/20 text-signal-300">{e.priceCents}¢/call</span>
              )}
            </div>
            <p className="text-ink-400 text-xs leading-relaxed">{e.summary}</p>
          </Link>
        ))}
      </div>

      <h2>Account management (dashboard only)</h2>
      <p>These control your account, not a specific request — they&rsquo;re managed from the developer dashboard rather than called from your server with an API key.</p>
      <div className="not-prose grid sm:grid-cols-2 gap-3">
        {ACCOUNT_ENDPOINTS.map(e => (
          <div key={e.slug} className="block border border-ink-800 rounded-xl p-4 bg-ink-900/50">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-800 text-ink-300">{e.method}</span>
              <code className="text-sm text-ink-200">{e.path}</code>
            </div>
            <p className="text-ink-400 text-xs leading-relaxed">{e.summary}</p>
          </div>
        ))}
      </div>

      <p>
        Not sure where to start? <a href="/docs/starters">Starters</a> has four working requests already filled
        in — no blank endpoint picker, no request body to write from scratch.
      </p>

      <h2>Machine-readable spec</h2>
      <p>
        The full OpenAPI 3.0 document is hand-maintained to mirror the live endpoints, reviewed alongside these
        reference pages on every endpoint change. If the two ever disagree, treat this page and the individual
        endpoint pages below as authoritative. Feed the spec to an AI coding agent, import it into Postman, or
        generate a typed client: <a href="https://askbiz.co/api/v1/openapi.json">askbiz.co/api/v1/openapi.json</a>.
      </p>
    </ArticleShell>
  )
}
