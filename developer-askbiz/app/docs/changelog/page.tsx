import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/changelog`

export const metadata: Metadata = {
  title: 'Changelog — AskBiz API',
  description: 'Dated log of changes to the AskBiz developer API — idempotency support, rate-limit headers, pricing, scoped connection permissions, webhook tooling, and usage/billing visibility.',
  alternates: { canonical: URL },
  openGraph: { title: 'Changelog — AskBiz API', description: 'Dated log of changes to the AskBiz developer API.', url: URL, type: 'article' },
}

type Entry = {
  date: string
  summary: string
  detail: string
}

const entries: Entry[] = [
  {
    summary: 'Apps — optional named grouping for your keys',
    detail: 'Create an app from the dashboard Apps page (name, logo, redirect URI) and assign your keys to it. Purely additive — a key with no app keeps working exactly as before. Once a key that created a connection is grouped under an app, the merchant sees that app’s name and logo on the /connect consent screen instead of an unbranded request.',
    date: '2026-07-17',
  },
  {
    summary: 'Interactive API console in the dashboard',
    detail: 'A new Console page lets you fire a real request at any core endpoint (ask, scan, whatsapp/send, connections, charges) using your own key, directly from developer.askbiz.co/dashboard/console — no terminal or client code required to see an actual response, with live status, latency, and rate-limit-remaining shown alongside it. Your key is sent through for that one request only and is never stored, logged, or re-displayed. There’s no sandbox mode yet, so every call through the console is a real, live call.',
    date: '2026-07-17',
  },
  {
    summary: 'Durable, cross-instance rate limiting on every endpoint',
    detail: 'The per-minute limiter now uses a shared, atomic database counter instead of an in-memory count local to whichever server handled the request — the previous version could under-enforce your plan’s per-minute limit under real concurrent traffic. POST /api/v1/ask also now returns X-RateLimit-Limit and X-RateLimit-Remaining headers, matching /scan and /whatsapp/send.',
    date: '2026-07-17',
  },
  {
    summary: 'Idempotency-Key support on /scan and /whatsapp/send',
    detail: 'Send an Idempotency-Key header on POST requests to /api/v1/scan or /api/v1/whatsapp/send. Retrying with the same key returns the original response instead of re-running the call — no duplicate WhatsApp sends, no duplicate vision calls, no double charge. Not supported on /ask, /connections, or /charges.',
    date: '2026-07-17',
  },
  {
    summary: 'Live pricing at GET /api/v1/pricing',
    detail: 'A public, unauthenticated endpoint returning per-call prices for billed endpoints, plan-level rate limits, and a note that only successful calls are ever billed. No x-api-key required — check pricing before writing any code.',
    date: '2026-07-17',
  },
  {
    summary: 'Rate-limit response headers (X-RateLimit-Limit / X-RateLimit-Remaining)',
    detail: 'Every /api/v1/* response now includes X-RateLimit-Limit and X-RateLimit-Remaining, reflecting your plan’s per-minute limit (free 5/min, growth 60/min, business 120/min).',
    date: '2026-07-17',
  },
  {
    summary: 'Low-balance warnings in API responses',
    detail: 'When a billed call pushes your wallet below its low-balance threshold, the 200 response now includes low_balance_warning: true and the current balance_cents in-band — you find out at the moment it happens, not only when a later call fails with a 402.',
    date: '2026-07-17',
  },
  {
    summary: 'Scoped permissions for merchant connections (read_inventory)',
    detail: 'POST /api/v1/connections accepts a scopes array when requesting a merchant connection. The merchant sees exactly which permissions were requested on the consent screen and can untick any before approving. read_inventory is currently the only scope, and it’s what unlocks the merchant_id parameter on POST /api/v1/scan.',
    date: '2026-07-17',
  },
  {
    summary: 'Webhook test-ping and delivery log in the dashboard',
    detail: 'The Webhooks page in the developer.askbiz.co dashboard now has a Send test event button that enqueues a real synthetic delivery through the same signing path as production events, plus a View deliveries panel showing recent delivery status and attempts — use both before relying on a real sale.created, purchase_order.received, or stock.low event.',
    date: '2026-07-17',
  },
  {
    summary: 'Spend visibility and billing history in the Usage dashboard',
    detail: 'The Usage dashboard now surfaces per-endpoint call counts and spend alongside your current plan’s monthly and per-minute quotas, so you can see where your credits are going without cross-referencing invoices.',
    date: '2026-07-17',
  },
]

export default function ChangelogPage() {
  return (
    <ArticleShell
      title="Changelog"
      description="Initial public changelog. Dated entries for what's shipped in the AskBiz developer API and dashboard — idempotency, rate limits, pricing, scoped permissions, webhook tooling, and usage visibility."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Changelog', href: '/docs/changelog' }]}
    >
      <p>
        This is the first entry in the AskBiz API changelog. It covers seven changes shipped together as the
        baseline for the public developer docs launching today, 2026-07-17. Going forward, new entries are added
        above this batch as they ship.
      </p>

      <div className="not-prose flex flex-col gap-8 mt-8">
        {entries.map((entry) => (
          <div key={entry.summary} className="border-l-2 border-ink-800 pl-5">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <time dateTime={entry.date} className="text-xs font-mono text-ink-400">{entry.date}</time>
              <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">Shipped</span>
            </div>
            <h3 className="text-ink-50 font-medium text-base mb-1.5">{entry.summary}</h3>
            <p className="text-ink-300 text-sm leading-relaxed">{entry.detail}</p>
          </div>
        ))}
      </div>

      <h2>What&rsquo;s not on this list</h2>
      <p>
        This changelog only records real, shipped changes. It does not include planned or in-progress work — see{' '}
        <a href="/docs/api-reference">API Reference</a> for the current state of every endpoint and{' '}
        <a href="/docs/guides/webhooks">the webhooks guide</a> for the full event-delivery contract, including the
        ~5-minute cron sweep latency.
      </p>

      <JsonLd data={techArticle({
        url: URL,
        headline: 'Changelog — AskBiz API',
        description: 'Dated log of changes to the AskBiz developer API — idempotency support, rate-limit headers, pricing, scoped connection permissions, webhook tooling, and usage/billing visibility.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Changelog', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
