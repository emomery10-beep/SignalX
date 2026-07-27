import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/academy/production-readiness-checklist`

export const metadata: Metadata = {
  title: 'Production readiness checklist — AskBiz Academy',
  description: 'Eight concrete things to verify before you point real merchant traffic at an AskBiz integration — each with the exact code or setting to check.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Production readiness checklist — AskBiz Academy',
    description: 'Eight things to verify before going live, each with the exact check.',
    url: URL,
    type: 'article',
  },
}

const idempotencyCheck = `// Every POST to scan or whatsapp/send should include this header.
// Search your codebase for these two paths and confirm both set it:
fetch('https://askbiz.co/api/v1/scan', {
  headers: { 'Idempotency-Key': crypto.randomUUID() /* ← must be present */ },
})
fetch('https://askbiz.co/api/v1/whatsapp/send', {
  headers: { 'Idempotency-Key': crypto.randomUUID() /* ← must be present */ },
})`

const rateLimitCheck = `// Read the two rate-limit headers on every response instead of hardcoding
// your plan's limit — they reflect your account's real, current plan.
const res = await fetch('https://askbiz.co/api/v1/ask', { headers, body })
const remaining = Number(res.headers.get('X-RateLimit-Remaining'))
const limit = Number(res.headers.get('X-RateLimit-Limit'))
if (remaining < limit * 0.1) {
  // back off or alert — you're close to a 429
}`

const webhookVerify = `import crypto from 'node:crypto'

function verifyWebhook(rawBody, signatureHeader, secret) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  // Constant-time compare — never use === on secrets/signatures
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader))
}`

const errorHandling = `const res = await fetch('https://askbiz.co/api/v1/scan', opts)
if (!res.ok) {
  const err = await res.json()
  switch (res.status) {
    case 402: /* insufficient credits — err.required_cents, err.topup url */ break
    case 429: /* monthly limit — err.plan, err.limit, err.used */ break
    case 403: /* key disabled or wrong mode for this endpoint */ break
    default: /* log err.error and the status for anything else */
  }
}`

const CHECKS = [
  {
    title: 'Idempotency-Key on every billed POST',
    body: 'Both scan and whatsapp/send should send a fresh Idempotency-Key on every call. Grep your codebase for both endpoint paths and confirm neither one is missing the header — a single unretried code path here is how double-charges happen in production, not in testing.',
    code: <CodeTabs samples={[{ label: 'Check', lang: 'js', code: idempotencyCheck }]} />,
  },
  {
    title: 'Rate-limit headers drive backoff, not a hardcoded number',
    body: 'Plan limits can change (an upgrade, a temporary adjustment). Read X-RateLimit-Remaining and X-RateLimit-Limit from the actual response instead of hardcoding free=5/min, growth=60/min, business=120/min in your own logic — those numbers are documented for planning, not for you to encode as constants.',
    code: <CodeTabs samples={[{ label: 'Check', lang: 'js', code: rateLimitCheck }]} />,
  },
  {
    title: 'Webhook signatures are actually verified',
    body: 'If you consume sale.created, purchase_order.received, or stock.low, confirm you verify the x-askbiz-signature HMAC against the raw request body with a constant-time comparison — not a plain === that leaks timing information, and not skipped entirely because "it worked in testing."',
    code: <CodeTabs samples={[{ label: 'Check', lang: 'js', code: webhookVerify }]} />,
  },
  {
    title: 'Every non-2xx status is handled, not just caught generically',
    body: '402, 403, and 429 each carry specific, actionable fields (required_cents, plan/limit/used, a re-enable hint) — a generic catch-and-log throws that information away. Confirm your error handling branches on status code, not just on "did the fetch throw."',
    code: <CodeTabs samples={[{ label: 'Check', lang: 'js', code: errorHandling }]} />,
  },
  {
    title: 'Live keys are separate from sandbox keys in every environment',
    body: 'Confirm your staging environment uses a sandbox key and production uses a live key — via distinct environment variables, not a single key swapped by hand before deploys. A sandbox key accidentally left in production silently stops working against real inventory; a live key accidentally used in staging silently spends real money.',
  },
  {
    title: 'You’ve read the actual scopes a connection grants',
    body: 'If you request merchant connections, confirm your code checks which scopes were actually approved (a merchant can narrow them) rather than assuming the full set you requested was granted. Today read_inventory is the only scope, but code that assumes "whatever I asked for" rather than checking the response will break the moment a second scope exists.',
  },
  {
    title: 'Webhook delivery latency is accounted for',
    body: 'Webhooks deliver via a 5-minute cron sweep, not instantly. If any part of your integration assumes near-real-time delivery — a UI that polls for a webhook-driven update within seconds — that assumption will produce a confusing user-facing delay. Design for minutes, not milliseconds.',
  },
  {
    title: 'Your own monitoring exists independent of AskBiz’s dashboard',
    body: 'The developer dashboard shows your usage, but it won’t alert you. Confirm you have your own alerting on elevated error rates or approaching quota — from the response codes and rate-limit headers your integration already sees on every call — rather than discovering a problem when a merchant reports it.',
  },
]

export default function ProductionReadinessLesson() {
  return (
    <ArticleShell
      title="Production readiness checklist"
      description="Eight concrete things worth verifying before real merchant traffic hits your integration — each one with the exact code or behavior to check, not just a reminder to 'be careful.'"
      breadcrumbs={[
        { name: 'Academy', href: '/academy' },
        { name: 'Production readiness checklist', href: '/academy/production-readiness-checklist' },
      ]}
    >
      <p>
        None of these are hypothetical. Each maps to a specific, real failure mode described elsewhere in the docs —
        this lesson exists to turn that scattered knowledge into one list you can actually check off before a launch,
        not to introduce new behavior.
      </p>

      <div className="not-prose space-y-8 my-8">
        {CHECKS.map((check, i) => (
          <div key={check.title} className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-signal-500/10 ring-1 ring-signal-400/20 text-signal-300 text-sm font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-ink-50 font-semibold text-sm mb-1">{check.title}</h3>
              <p className="text-ink-300 text-sm leading-relaxed mb-2">{check.body}</p>
              {check.code}
            </div>
          </div>
        ))}
      </div>

      <h2>What&rsquo;s next</h2>
      <p>
        For the full contract behind items 1 and 4, see{' '}
        <a href="/docs/guides/errors-and-retries">Errors and retries</a>. For item 3, see{' '}
        <a href="/docs/guides/webhooks">Subscribe to webhooks</a>. For the pricing and quota numbers referenced
        throughout, see <a href="/academy/understanding-billing-and-pricing">Understanding billing and pricing</a>.
      </p>

      <FaqBlock
        heading="Questions about going to production"
        items={[
          {
            question: 'Is there a staging environment I should be testing against?',
            answer: 'There’s no separate staging API — sandbox keys serve that purpose against the same production endpoints, returning realistic simulated responses with no real debit, message, or charge.',
          },
          {
            question: 'Does AskBiz page me if my integration starts failing?',
            answer: 'No — the dashboard shows your own usage and error history, but there’s no proactive alerting on AskBiz’s side for your integration’s error rate. That monitoring is your responsibility, built from the same status codes and headers your integration already receives.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'Production readiness checklist',
        description: 'Eight concrete things to verify before real merchant traffic hits an AskBiz integration.',
        breadcrumb: [
          { name: 'Academy', url: `${SITE}/academy` },
          { name: 'Production readiness checklist', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
