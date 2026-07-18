import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/faq`

export const metadata: Metadata = {
  title: 'FAQ — AskBiz Developer API',
  description: 'Answers to specific questions about AskBiz API pricing, idempotency, account vs. generic keys, rate limits, connections, charges, webhooks, and error behavior.',
  alternates: { canonical: URL },
  openGraph: { title: 'FAQ — AskBiz Developer API', description: 'Specific, sourced answers about pricing, idempotency, rate limits, connections, charges, and webhooks.', url: URL, type: 'article' },
}

export default function FaqPage() {
  return (
    <ArticleShell
      title="Frequently asked questions"
      description="Specific answers about pricing, idempotency, account vs. generic keys, rate limits, connections, charges, and webhooks — pulled directly from how the endpoints actually behave."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'FAQ', href: '/docs/faq' }]}
    >
      <p>
        This page collects the questions developers ask most often about the AskBiz API, with answers specific
        enough to act on: exact prices, exact limits, and exact behavior. For endpoint-level detail, see the{' '}
        <a href="/docs/api-reference">API reference</a>; for auth setup, see{' '}
        <a href="/docs/authentication">Authentication</a>.
      </p>

      <FaqBlock
        heading="All questions"
        items={[
          {
            question: 'Which endpoints actually cost money per call?',
            answer:
              'Only two: POST /api/v1/scan (3¢ per successful call) and POST /api/v1/whatsapp/send (2¢ per successful send). POST /api/v1/ask is free within your monthly plan quota — no wallet debit. Connections and charges are billing-on-behalf-of mechanisms, not billed to you. All prices are per successful call — a failed or rejected request is never billed. See /docs/api-reference/pricing.',
          },
          {
            question: 'Is pricing shown in the same currency everywhere?',
            answer:
              'No, and it is worth being precise about this. GET /api/v1/pricing labels its per-call prices generically in cents (usd_cents). Wallet top-ups elsewhere in the product are billed in GBP, in £5 / £20 / £100 bundles. POST /api/v1/charges defaults its currency field to gbp if you don’t specify one. Each part of the platform is accurate in its own context — don’t assume one unified currency across all of it.',
          },
          {
            question: 'What is an Idempotency-Key and which endpoints support it?',
            answer:
              'It’s a client-generated string (a UUID works well) you send in an Idempotency-Key header on a POST. If you retry with the same key — for example after a network timeout where you don’t know if the first attempt landed — the API returns the exact original response instead of re-running the action, so you’re never double-charged or don’t send a duplicate WhatsApp message. It’s only supported on POST /api/v1/scan and POST /api/v1/whatsapp/send — /api/v1/ask, /api/v1/connections, and /api/v1/charges don’t support it, so a retry against those is always a brand-new call. This is the same convention Stripe uses.',
          },
          {
            question: 'What happens if I retry a POST without an Idempotency-Key?',
            answer:
              'It’s treated as an entirely independent request. On /api/v1/scan or /api/v1/whatsapp/send that means a second real Groq vision call or a second real WhatsApp message, and a second charge if the first one succeeded. Always send an Idempotency-Key on those two endpoints when retrying.',
          },
          {
            question: 'What’s the difference between an account-mode key and a generic-mode key?',
            answer:
              'An account-mode key is tied to a real AskBiz business. On POST /api/v1/ask, account-mode keys automatically pull the caller’s own AskBiz profile (business type, currency, region) and latest uploaded dataset columns — any "context" you send is ignored. Generic-mode keys have no connected account, so they must supply "context" themselves. POST /api/v1/whatsapp/send requires an account-mode key outright and returns 403 for a generic key, specifically so a generic key can’t be used as an open message-blasting gateway.',
          },
          {
            question: 'What are the rate limits, and which endpoints expose them in response headers?',
            answer:
              'Per-minute limits by plan: free = 5/min, growth = 60/min, business = 120/min. Monthly quotas: free = 100/month, growth = 10,000/month, business = unlimited. Every /api/v1/* endpoint (including /ask) returns X-RateLimit-Limit and X-RateLimit-Remaining on every response, backed by a durable per-key counter — not an in-memory guess that could differ between serverless instances. Exceeding the monthly quota on any endpoint returns 429 with plan, limit, and used in the response body.',
          },
          {
            question: 'What scopes exist for POST /api/v1/connections, and can a merchant narrow them?',
            answer:
              'Today there is exactly one valid scope: read_inventory. If you omit scopes when creating a connection, it defaults to the full set (currently just [\'read_inventory\']) so integrations built before scopes existed keep working unchanged. When the merchant opens the confirmation link, they see a real consent screen listing exactly what was requested and can untick any scope before approving — narrowing only, they can never grant more than you asked for.',
          },
          {
            question: 'How does a merchant approve a connection request, and can I revoke it programmatically?',
            answer:
              'POST /api/v1/connections creates a pending connection and a confirmation link at https://developer.askbiz.co/connect/{token}, valid for 7 days. The merchant signs in, reviews the consent screen, and approves or declines. No, there is no developer-initiated revoke endpoint today — only the merchant can revoke a connection, and only from their own confirmation page.',
          },
          {
            question: 'Does AskBiz pay out the money collected through POST /api/v1/charges?',
            answer:
              'Not automatically, and this is a real current limitation worth knowing before you build on it. A charge’s confirmation link takes the merchant to a real Stripe Checkout session, and the charge is only marked approved by a Stripe webhook confirming actual payment — never by the approval page itself. But there is currently no automatic payout mechanism from AskBiz to the developer’s own account. This collects money on the merchant’s behalf; it does not yet move that money to you.',
          },
          {
            question: 'What amount range does POST /api/v1/charges accept?',
            answer:
              'amount_cents must be an integer between 100 and 10,000,000 — £1 to £100,000 at the default gbp currency. Outside that range you get a 400.',
          },
          {
            question: 'How fast are webhook deliveries, and are they called with an API key?',
            answer:
              'Webhooks are delivered by a 5-minute cron sweep, not instantly — expect delivery latency bounded by roughly 5 minutes, not real-time. They’re also not something a third-party server calls with x-api-key: webhook management (GET/POST/PATCH/DELETE /api/v1/webhooks) is dashboard-only, authenticated by your developer.askbiz.co session, and used to configure your own account’s webhook endpoints — it isn’t a REST call your integration’s server makes.',
          },
          {
            question: 'Which event types can a webhook subscribe to?',
            answer:
              'Exactly three: sale.created, purchase_order.received, and stock.low. No other event types exist today.',
          },
          {
            question: 'How do I verify a webhook delivery is really from AskBiz?',
            answer:
              'Each webhook gets a secret (whsec_...) shown once at creation. Every delivery is signed and carries an x-askbiz-signature header (HMAC) you verify against that secret. Use the dashboard’s "Send test event" button to trigger a real synthetic delivery through the same signing path, and "View deliveries" to check recent delivery status and attempts, before relying on a real sale, purchase order, or low-stock event to test with.',
          },
          {
            question: 'Do failed or rejected API calls ever get billed?',
            answer:
              'No. Every 4xx and 5xx response across the billed endpoints (scan, whatsapp/send) is unbilled — debiting only happens after the underlying action actually succeeds (a real vision match, a Meta-confirmed WhatsApp send). The GET /api/v1/pricing note states this directly: prices are per successful call, failed or rejected requests are never billed.',
          },
          {
            question: 'What does every error response look like?',
            answer:
              'Every error is JSON with at least an "error" string field. Some carry extra context specific to that failure: a 402 (insufficient credits) includes required_cents and a topup URL; a 429 (monthly limit) includes plan, limit, and used; a 403 for a disabled key tells you to re-enable it from settings. There’s no single universal error schema beyond the error field — the extra fields are endpoint- and case-specific.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'FAQ — AskBiz Developer API',
        description: 'Answers to specific questions about AskBiz API pricing, idempotency, account vs. generic keys, rate limits, connections, charges, and webhooks.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'FAQ', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
