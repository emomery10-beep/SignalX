import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/api-reference/whatsapp-send`

export const metadata: Metadata = {
  title: 'POST /api/v1/whatsapp/send — WhatsApp messaging — AskBiz API',
  description: 'Send a receipt or purchase-order template over WhatsApp on behalf of a connected AskBiz account. Request and response shapes, 2¢ pricing, idempotency, and error codes.',
  alternates: { canonical: URL },
  openGraph: { title: 'POST /api/v1/whatsapp/send — AskBiz API', description: 'WhatsApp messaging endpoint reference.', url: URL, type: 'article' },
}

const curl = `curl -X POST https://askbiz.co/api/v1/whatsapp/send \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 7c4f1a2e-9d3b-4e6a-8f21-1b5c9a0d3e7f" \\
  -d '{
    "phone": "+254712345678",
    "template": "receipt",
    "text": "Receipt #1042 — Coca-Cola 500ml x2, Total KES 160. Thank you for your purchase."
  }'`

const js = `const res = await fetch('https://askbiz.co/api/v1/whatsapp/send', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(), // safe to retry with the same key
  },
  body: JSON.stringify({
    phone: '+254712345678',
    template: 'receipt',
    text: 'Receipt #1042 — Coca-Cola 500ml x2, Total KES 160. Thank you for your purchase.',
  }),
})

const result = await res.json()
if (result.low_balance_warning) {
  console.log('Wallet low:', result.balance_cents)
}`

const python = `import requests
import uuid

res = requests.post(
    "https://askbiz.co/api/v1/whatsapp/send",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": str(uuid.uuid4()),
    },
    json={
        "phone": "+254712345678",
        "template": "receipt",
        "text": "Receipt #1042 — Coca-Cola 500ml x2, Total KES 160. Thank you for your purchase.",
    },
)

result = res.json()
if result.get("low_balance_warning"):
    print("Wallet low:", result["balance_cents"])`

const responseSuccess = `{
  "success": true
}`

const responseLowBalance = `{
  "success": true,
  "low_balance_warning": true,
  "balance_cents": 340
}`

const response402 = `{
  "error": "Insufficient credits",
  "required_cents": 2
}`

const responseTestMode = `{
  "success": true,
  "test_mode": true
}`

export default function WhatsappSendReferencePage() {
  return (
    <ArticleShell
      title="POST /api/v1/whatsapp/send"
      description="Send a receipt or purchase-order template over WhatsApp using AskBiz's Meta Business API connection. Account-mode keys only — 2¢ per successful send, debited after Meta confirms delivery."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'API Reference', href: '/docs/api-reference' }, { name: 'whatsapp-send', href: '/docs/api-reference/whatsapp-send' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">POST</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">2¢ per successful send</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">x-api-key required</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">account mode only</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">Idempotency-Key supported</span>
      </div>

      <h2>What it does</h2>
      <p>
        Sends a WhatsApp message through AskBiz&rsquo;s Meta Business API connection, using one of two pre-approved
        templates: <code>receipt</code> or <code>purchase_order</code>. Your account is debited{' '}
        <strong>2 cents per successful send</strong>, and only after Meta confirms the message was actually sent —
        a failed send never costs you anything.
      </p>
      <p>
        This endpoint requires an <code>account</code>-mode key. A <code>generic</code>-mode key gets a 403 — generic
        keys have no tie to a real AskBiz business, so this deliberately can&rsquo;t be used as an open
        message-blasting gateway for arbitrary WhatsApp numbers.
      </p>

      <h2>Request</h2>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: curl },
          { label: 'JavaScript', lang: 'js', code: js },
          { label: 'Python', lang: 'python', code: python },
        ]}
      />

      <h3>Body parameters</h3>
      <table>
        <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>phone</code></td><td>string</td><td>Yes</td><td>Recipient in international format, e.g. <code>+254712345678</code>.</td></tr>
          <tr><td><code>template</code></td><td>string</td><td>Yes</td><td>Either <code>receipt</code> or <code>purchase_order</code>. There is no third option — <code>otp</code> is reserved for AskBiz&rsquo;s own login flow and is never available through this endpoint.</td></tr>
          <tr><td><code>text</code></td><td>string</td><td>Yes</td><td>Message body, max 1024 characters.</td></tr>
        </tbody>
      </table>

      <h2>Response</h2>
      <p>On a confirmed send:</p>
      <CodeTabs samples={[{ label: '200 — sent', lang: 'json', code: responseSuccess }]} />
      <p>
        If the send pushes your wallet below its low-balance threshold, the same 200 response also carries{' '}
        <code>low_balance_warning: true</code> and the new <code>balance_cents</code> — in-band, at the moment it
        happens, not just when you hit a 402 on a later call:
      </p>
      <CodeTabs samples={[{ label: '200 — sent, low balance', lang: 'json', code: responseLowBalance }]} />
      <p>If your balance can&rsquo;t cover the 2¢ send before it&rsquo;s even attempted:</p>
      <CodeTabs samples={[{ label: '402 — insufficient credits', lang: 'json', code: response402 }]} />
      <p>
        On a test key (<code>abz_test_&hellip;</code>), no message ever reaches Meta and your wallet is never
        touched — you get this instead, every time:
      </p>
      <CodeTabs samples={[{ label: '200 — test key', lang: 'json', code: responseTestMode }]} />
      <p>
        See <a href="/docs/guides/sandbox-keys">Build safely with a sandbox key</a> for the full test/live picture
        across every endpoint.
      </p>

      <h2>Errors</h2>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>400</td><td>Invalid JSON, invalid <code>phone</code> format, invalid <code>template</code>, or <code>text</code> over 1024 characters.</td></tr>
          <tr><td>401</td><td>Missing or invalid <code>x-api-key</code>.</td></tr>
          <tr><td>402</td><td>Insufficient credits — response includes <code>required_cents</code>.</td></tr>
          <tr><td>403</td><td>Key is in <code>generic</code> mode. This endpoint requires an account-mode key tied to a real AskBiz business.</td></tr>
          <tr><td>429</td><td>Rate limit or monthly quota exceeded — check the <code>X-RateLimit-Remaining</code> response header.</td></tr>
          <tr><td>502</td><td>Meta&rsquo;s WhatsApp API failed to send the message. Nothing is charged — safe to retry with the same <code>Idempotency-Key</code>.</td></tr>
        </tbody>
      </table>
      <p>
        Send an <code>Idempotency-Key</code> header on every call. If a request times out and you don&rsquo;t know
        whether it landed, retrying with the same key returns the original result instead of sending a second real
        WhatsApp message and debiting a second 2¢. See{' '}
        <a href="/docs/guides/errors-and-retries">Errors and retries</a> for the full contract.
      </p>

      <FaqBlock
        heading="WhatsApp send FAQ"
        items={[
          {
            question: 'Why can’t I send an OTP template through this endpoint?',
            answer: 'The otp template is reserved for AskBiz’s own login flow and is not exposed through the public API — only receipt and purchase_order are available to send.',
          },
          {
            question: 'Can I use a generic-mode key to send WhatsApp messages?',
            answer: 'No. This endpoint requires an account-mode key, which is tied to a real AskBiz business. A generic-mode key gets a 403, because without that tie the endpoint could otherwise be used as an open message-blasting gateway to arbitrary phone numbers.',
          },
          {
            question: 'When am I actually charged the 2 cents?',
            answer: 'Only after Meta confirms the message was sent successfully. A 400, 401, 402, 403, or 502 response is never billed.',
          },
          {
            question: 'What happens if my network call times out and I don’t know if the message went out?',
            answer: 'Retry the exact same request with the same Idempotency-Key header. If the first attempt already succeeded server-side, you get back that original result instead of a second message being sent and a second 2¢ debit.',
          },
          {
            question: 'Can I test this endpoint without sending a real WhatsApp message?',
            answer: 'Yes — use a test key (abz_test_…). It skips Meta entirely and never touches your wallet, always returning { success: true, test_mode: true }. See Build safely with a sandbox key.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'POST /api/v1/whatsapp/send — AskBiz API Reference',
        description: 'WhatsApp messaging endpoint — send receipt and purchase-order templates on behalf of a connected AskBiz account.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'API Reference', url: `${SITE}/docs/api-reference` },
          { name: 'whatsapp-send', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
