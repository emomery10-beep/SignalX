import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/authentication`

export const metadata: Metadata = {
  title: 'Authentication — x-api-key, key modes, idempotency, rate limits — AskBiz API',
  description: 'How AskBiz API authentication works: the x-api-key header, account vs generic key mode, which endpoints support Idempotency-Key, and how per-minute rate limits are enforced.',
  alternates: { canonical: URL },
  openGraph: { title: 'Authentication — AskBiz API', description: 'The x-api-key header, key modes, idempotency, and rate limits, explained once for every endpoint.', url: URL, type: 'article' },
}

const curlBasic = `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What were my top sellers this week?"
  }'`

const jsBasic = `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
    // no Idempotency-Key here — /api/v1/ask doesn't support it
  },
  body: JSON.stringify({ question: 'What were my top sellers this week?' }),
})

const result = await res.json()`

const pythonBasic = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/ask",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
        # no Idempotency-Key here — /api/v1/ask doesn't support it
    },
    json={"question": "What were my top sellers this week?"},
)

result = res.json()`

const curlIdempotent = `curl -X POST https://askbiz.co/api/v1/whatsapp/send \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 7c4f1a2e-9d3b-4e6a-8f21-1b5c9a0d3e7f" \\
  -d '{
    "phone": "+254712345678",
    "template": "receipt",
    "text": "Receipt #1042 — Total KES 160. Thank you for your purchase."
  }'

# If this call times out and you don't know whether it landed, retry with
# the exact same Idempotency-Key value. You get back the original response
# instead of a second WhatsApp message and a second 2¢ debit.`

const responseHeaders = `HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59

{ "success": true }`

const response401 = `{
  "error": "Invalid or missing API key"
}`

const response403 = `{
  "error": "This API key has been disabled. Re-enable it from the Keys page in your dashboard."
}`

const response429 = `{
  "error": "Monthly quota exceeded",
  "plan": "free",
  "limit": 100,
  "used": 100
}`

export default function AuthenticationPage() {
  return (
    <ArticleShell
      title="Authentication"
      description="Every authenticated AskBiz API call carries your key in the x-api-key header. This page covers the mechanics that apply across endpoints — key modes, Idempotency-Key, and rate limits — so each individual reference page doesn't have to repeat them."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Authentication', href: '/docs/authentication' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">x-api-key header</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">2 key modes: account / generic</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">Idempotency-Key on 2 endpoints</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">Rate-limit headers on 2 endpoints</span>
      </div>

      <h2>How authentication works</h2>
      <p>
        Send your key in an <code>x-api-key</code> header on every request to an authenticated endpoint — not{' '}
        <code>Authorization: Bearer</code>. There&rsquo;s no OAuth flow and no session cookie involved for
        programmatic API calls.{' '}
        <a href="/docs/api-reference/pricing"><code>GET /api/v1/pricing</code></a> is the one exception: it&rsquo;s
        fully public and needs no key at all. Webhook management (<code>/api/v1/webhooks</code>) is the other
        exception in the opposite direction — it&rsquo;s a dashboard-only, session-authenticated account setting,
        never called with an <code>x-api-key</code> by a third-party server. See{' '}
        <a href="/docs/guides/webhooks">the webhooks guide</a> for that distinction.
      </p>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: curlBasic },
          { label: 'JavaScript', lang: 'js', code: jsBasic },
          { label: 'Python', lang: 'python', code: pythonBasic },
        ]}
      />
      <p>
        Create and manage keys from the Keys page in your <code>developer.askbiz.co</code> dashboard. Treat a key
        like a password — anyone who has it can act as you against every endpoint it&rsquo;s valid for.
      </p>

      <h2>Account mode vs generic mode</h2>
      <p>
        Every key is created in one of two modes, chosen when you generate it. The mode changes what an endpoint
        does with your request, not just what it&rsquo;s allowed to call.
      </p>
      <table>
        <thead><tr><th>Mode</th><th>What it is</th><th>What changes</th></tr></thead>
        <tbody>
          <tr>
            <td><code>account</code></td>
            <td>Tied to a real AskBiz business — your own connected account.</td>
            <td>
              <a href="/docs/api-reference/ask"><code>/api/v1/ask</code></a> automatically pulls your business
              type, currency, region, and latest uploaded dataset columns — any <code>context</code> you pass in
              the request body is ignored. Required for{' '}
              <a href="/docs/api-reference/whatsapp-send"><code>/api/v1/whatsapp/send</code></a>, which returns a
              403 to a generic-mode key.
            </td>
          </tr>
          <tr>
            <td><code>generic</code></td>
            <td>Not tied to a real AskBiz business — for integrating AskBiz into someone else&rsquo;s product.</td>
            <td>
              You must supply <code>context</code> yourself on <a href="/docs/api-reference/ask"><code>/api/v1/ask</code></a>{' '}
              calls, since there&rsquo;s no connected account for it to read from. Cannot call{' '}
              <a href="/docs/api-reference/whatsapp-send"><code>/api/v1/whatsapp/send</code></a> — a generic key
              has no tie to a real business, so it deliberately can&rsquo;t be used as an open
              message-blasting gateway.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Idempotency-Key</h2>
      <p>
        Send an <code>Idempotency-Key</code> header — any client-generated string, such as a UUID — on a POST to{' '}
        <a href="/docs/api-reference/scan"><code>/api/v1/scan</code></a> or{' '}
        <a href="/docs/api-reference/whatsapp-send"><code>/api/v1/whatsapp/send</code></a>. If you retry with the{' '}
        <strong>same</strong> key value — for example after a network timeout where you don&rsquo;t know if the
        first attempt landed — the API returns the exact original response instead of re-running the underlying
        action. A retry never sends a second real WhatsApp message or runs a second vision call, and never
        double-charges. This is the same header-name convention Stripe uses.
      </p>
      <p>
        Without an <code>Idempotency-Key</code>, every request is treated as independent — a retry is a brand-new,
        separately billable call.
      </p>
      <CodeTabs samples={[{ label: 'cURL', lang: 'bash', code: curlIdempotent }]} />
      <table>
        <thead><tr><th>Endpoint</th><th>Idempotency-Key</th></tr></thead>
        <tbody>
          <tr><td><a href="/docs/api-reference/scan"><code>POST /api/v1/scan</code></a></td><td>Supported</td></tr>
          <tr><td><a href="/docs/api-reference/whatsapp-send"><code>POST /api/v1/whatsapp/send</code></a></td><td>Supported</td></tr>
          <tr><td><a href="/docs/api-reference/ask"><code>POST /api/v1/ask</code></a></td><td>Not supported — every call is independent.</td></tr>
          <tr><td><a href="/docs/api-reference/connections"><code>POST /api/v1/connections</code></a></td><td>Not supported.</td></tr>
          <tr><td><code>POST /api/v1/charges</code></td><td>Not supported.</td></tr>
        </tbody>
      </table>

      <h2>Rate limits and monthly quota</h2>
      <p>
        Two separate numeric limits apply to your key, enforced independently: a <strong>per-minute rate limit</strong>{' '}
        and a <strong>monthly quota</strong>. Both come from your plan.
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
        Every <code>/api/v1/*</code> endpoint returns your live per-minute standing on every response, success or
        failure, backed by a durable per-key counter rather than an in-memory guess that could differ between
        serverless instances:
      </p>
      <CodeTabs samples={[{ label: 'Response headers', lang: 'text', code: responseHeaders }]} />
      <p>
        The monthly quota is enforced separately from the per-minute limit and, when exceeded, returns a 429 whose
        body includes <code>plan</code>, <code>limit</code>, and <code>used</code> so you know exactly where you
        stand.
      </p>

      <h2>Error responses</h2>
      <p>
        Every error response is JSON with at least an <code>error</code> string field. Some errors carry extra
        context specific to that failure — documented per-endpoint on each API reference page — rather than one
        universal schema. For example, insufficient credits (402, on billed endpoints only) includes{' '}
        <code>required_cents</code> and a <code>topup</code> URL.
      </p>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>401</td><td>Missing or invalid <code>x-api-key</code>.</td></tr>
          <tr><td>403</td><td>The key has been disabled — re-enable it from the Keys page in your dashboard. Or, on an endpoint that requires it (like <code>/api/v1/whatsapp/send</code>), the key is in <code>generic</code> mode.</td></tr>
          <tr><td>429</td><td>Per-minute rate limit or monthly quota exceeded. A monthly-quota 429 includes <code>plan</code>, <code>limit</code>, and <code>used</code> in the body.</td></tr>
        </tbody>
      </table>
      <CodeTabs
        samples={[
          { label: '401 — invalid key', lang: 'json', code: response401 },
          { label: '403 — disabled key', lang: 'json', code: response403 },
          { label: '429 — quota exceeded', lang: 'json', code: response429 },
        ]}
      />

      <FaqBlock
        heading="Authentication FAQ"
        items={[
          {
            question: 'What happens if my API key is compromised?',
            answer: 'Disable it immediately from the Keys page in your developer.askbiz.co dashboard, then create a new key to replace it. There is no key-rotation feature — disabling stops the compromised key from authenticating anything, and every call made with it returns a 403 until you re-enable it (which you shouldn’t do for a key you no longer trust) or simply leave it disabled and switch your integration to the new key.',
          },
          {
            question: 'Which endpoints support Idempotency-Key?',
            answer: 'Only POST /api/v1/scan and POST /api/v1/whatsapp/send. POST /api/v1/ask, POST /api/v1/connections, and POST /api/v1/charges don’t support it — retrying those is always treated as a brand-new request, so build your own duplicate-prevention if that matters for your integration.',
          },
          {
            question: 'How is the per-minute limit enforced — can it be bypassed by hitting different servers?',
            answer: 'No. The counter is a durable, atomic database counter keyed by your API key, not an in-memory count on whichever server happened to handle the request. Every request against a given key — regardless of which serverless instance processes it — increments the same counter, so the X-RateLimit-Remaining header is always accurate.',
          },
          {
            question: 'Do I need to send an Idempotency-Key on every request?',
            answer: 'It’s optional but strongly recommended on /api/v1/scan and /api/v1/whatsapp/send, especially around network calls that might time out. Without one, a retry — even an accidental one — is billed as a brand-new call; with one, retrying with the same key value returns the original result instead.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'Authentication — AskBiz API Reference',
        description: 'The x-api-key header, account vs generic key mode, Idempotency-Key support, and rate-limit vs monthly-quota enforcement across the AskBiz API.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Authentication', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
