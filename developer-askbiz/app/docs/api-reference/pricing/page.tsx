import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/api-reference/pricing`

export const metadata: Metadata = {
  title: 'GET /api/v1/pricing — Live pricing and plan limits — AskBiz API',
  description: 'Public, unauthenticated endpoint returning current per-endpoint prices and plan rate/quota limits for the AskBiz API. Check pricing before you write any code — no API key needed.',
  alternates: { canonical: URL },
  openGraph: { title: 'GET /api/v1/pricing — AskBiz API', description: 'Live pricing and plan limits, no auth required.', url: URL, type: 'article' },
}

const curl = `curl https://askbiz.co/api/v1/pricing`

const js = `const res = await fetch('https://askbiz.co/api/v1/pricing')
const pricing = await res.json()

console.log(pricing.endpoints)
console.log(pricing.plans.free)`

const python = `import requests

res = requests.get("https://askbiz.co/api/v1/pricing")
pricing = res.json()

print(pricing["endpoints"])
print(pricing["plans"]["free"])`

const response = `{
  "endpoints": [
    { "path": "/api/v1/scan", "price_cents": 3 },
    { "path": "/api/v1/whatsapp/send", "price_cents": 2 }
  ],
  "plans": {
    "free": { "month": 100, "minute": 5 },
    "growth": { "month": 10000, "minute": 60 },
    "business": { "month": -1, "minute": 120 }
  },
  "currency": "usd_cents",
  "note": "Prices are per successful call — failed or rejected requests are never billed."
}`

export default function PricingReferencePage() {
  return (
    <ArticleShell
      title="GET /api/v1/pricing"
      description="Public, unauthenticated endpoint returning the API&rsquo;s current per-call prices and plan rate/quota limits — check it before you integrate, not after a 402."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'API Reference', href: '/docs/api-reference' }, { name: 'pricing', href: '/docs/api-reference/pricing' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">GET</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">Public — no auth required</span>
      </div>

      <h2>What it does</h2>
      <p>
        Returns the live per-call price for every billed endpoint plus the rate and quota limits for each plan tier.
        No <code>x-api-key</code> header, no account, no request body — this is the one endpoint in the API you can
        call from a browser address bar. Use it to check current pricing before you write any integration code, or
        to drive an in-app cost estimate without hardcoding numbers that can drift out of sync with what you&rsquo;re
        actually billed.
      </p>

      <h2>Request</h2>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: curl },
          { label: 'JavaScript', lang: 'js', code: js },
          { label: 'Python', lang: 'python', code: python },
        ]}
      />
      <p>No headers, no query parameters, no body.</p>

      <h2>Response</h2>
      <CodeTabs samples={[{ label: '200 — success', lang: 'json', code: response }]} />

      <h3>Priced endpoints</h3>
      <p>
        Only two endpoints in the API are billed per call. Everything else — <a href="/docs/api-reference/ask"><code>/api/v1/ask</code></a>,{' '}
        <a href="/docs/api-reference/connections"><code>/api/v1/connections</code></a>, and{' '}
        <a href="/docs/api-reference/charges"><code>/api/v1/charges</code></a> — is free within your plan&rsquo;s quota.
      </p>
      <table>
        <thead><tr><th>Endpoint</th><th>Price</th></tr></thead>
        <tbody>
          <tr><td><a href="/docs/api-reference/scan"><code>/api/v1/scan</code></a></td><td>3¢ per successful call</td></tr>
          <tr><td><a href="/docs/api-reference/whatsapp-send"><code>/api/v1/whatsapp/send</code></a></td><td>2¢ per successful call</td></tr>
        </tbody>
      </table>
      <p>
        As the response&rsquo;s <code>note</code> field states: prices apply to successful calls only. A rejected or
        failed request — a 4xx validation error, a 429 rate limit, a 502 upstream failure — is never billed.
      </p>

      <h3>Plan limits</h3>
      <p>
        <code>month</code> is your monthly request quota across all endpoints combined; <code>-1</code> means
        unlimited. <code>minute</code> is your per-minute rate limit, enforced separately from the monthly quota.
      </p>
      <table>
        <thead><tr><th>Plan</th><th>Monthly quota</th><th>Per-minute limit</th></tr></thead>
        <tbody>
          <tr><td>free</td><td>100</td><td>5</td></tr>
          <tr><td>growth</td><td>10,000</td><td>60</td></tr>
          <tr><td>business</td><td>Unlimited</td><td>120</td></tr>
        </tbody>
      </table>
      <p>
        <code>/api/v1/scan</code> and <code>/api/v1/whatsapp/send</code> return your live <code>X-RateLimit-Limit</code> and{' '}
        <code>X-RateLimit-Remaining</code> headers on every response so you don&rsquo;t have to poll this endpoint to
        track your own usage — see <a href="/docs/guides/rate-limits-and-idempotency">Rate limits and idempotency</a>.
      </p>

      <h2>A note on currency</h2>
      <p>
        This endpoint labels prices generically as <code>usd_cents</code>, and that&rsquo;s accurate for the two
        per-call prices shown here. It is not the currency used everywhere else in AskBiz: wallet top-up bundles are
        billed in GBP (£5 / £20 / £100), and the <a href="/docs/api-reference/charges"><code>/api/v1/charges</code></a>{' '}
        endpoint defaults its <code>currency</code> field to <code>gbp</code> when you don&rsquo;t specify one. Don&rsquo;t
        assume one currency across the whole platform — check the currency each individual endpoint actually uses.
      </p>

      <FaqBlock
        heading="Pricing endpoint FAQ"
        items={[
          {
            question: 'Do I need an API key to call /api/v1/pricing?',
            answer: 'No. This is the one endpoint in the API with no authentication at all — no x-api-key header, no account required.',
          },
          {
            question: 'Am I billed for calling this endpoint?',
            answer: 'No. Pricing lookups are free and not counted against your rate limit or monthly quota — they aren’t billed endpoints at all.',
          },
          {
            question: 'Why does the response say usd_cents but /api/v1/charges defaults to gbp?',
            answer: 'The two per-call endpoint prices (scan, whatsapp/send) are genuinely denominated in USD cents. Charges you create on behalf of a merchant default to GBP instead — the platform doesn’t use one currency everywhere, so check each endpoint’s own currency field rather than assuming.',
          },
          {
            question: 'Does the monthly quota reset, and does it cover all endpoints together?',
            answer: 'The "month" figure in plans is a single combined quota across every endpoint you call with that key, not a per-endpoint allowance. If you exceed it you get a 429 with plan, limit, and used in the error body.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'GET /api/v1/pricing — AskBiz API Reference',
        description: 'Public, unauthenticated endpoint returning live per-endpoint prices and plan rate/quota limits.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'API Reference', url: `${SITE}/docs/api-reference` },
          { name: 'pricing', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
