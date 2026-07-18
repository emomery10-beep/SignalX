import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/webhooks`

export const metadata: Metadata = {
  title: 'Subscribe to webhooks — sale.created, purchase_order.received, stock.low — AskBiz API guide',
  description: 'Set up AskBiz webhooks from the developer dashboard: register an endpoint and event types, save the whsec_ secret, verify the x-askbiz-signature header, and test a delivery before going live. Delivery runs on a ~5-minute cron sweep, not instantly.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Subscribe to webhooks — AskBiz API',
    description: 'React to sale, purchase-order, and stock events instead of polling.',
    url: URL,
    type: 'article',
  },
}

const verifyJs = `const crypto = require('crypto')

function isValidSignature(rawBody, signatureHeader, secret) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  // Constant-time comparison — never use === on secrets/signatures
  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected))
}

// Example Express handler — use the raw request body, not a re-serialized object
app.post('/webhooks/askbiz', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-askbiz-signature']
  if (!isValidSignature(req.body, signature, process.env.ASKBIZ_WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature')
  }

  const { event, data } = JSON.parse(req.body)
  // event is one of: sale.created | purchase_order.received | stock.low
  console.log(event, data)
  res.status(200).send('ok')
})`

const verifyPython = `import hashlib
import hmac
import os

def is_valid_signature(raw_body: bytes, signature_header: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature_header, expected)  # constant-time comparison

# Example Flask handler — use request.get_data() for the raw bytes, not re-serialized JSON
@app.route("/webhooks/askbiz", methods=["POST"])
def askbiz_webhook():
    signature = request.headers.get("x-askbiz-signature", "")
    raw_body = request.get_data()
    if not is_valid_signature(raw_body, signature, os.environ["ASKBIZ_WEBHOOK_SECRET"]):
        return "Invalid signature", 401

    payload = request.get_json()
    event, data = payload["event"], payload["data"]
    # event is one of: sale.created | purchase_order.received | stock.low
    return "ok", 200`

const saleCreatedPayload = `{
  "event": "sale.created",
  "data": {
    "transaction_id": "b4a1...",
    "total": 1450,
    "subtotal": 1400,
    "tax_amount": 50,
    "payment_type": "mpesa",
    "created_at": "2026-07-17T09:12:00.000Z"
  }
}`

const poReceivedPayload = `{
  "event": "purchase_order.received",
  "data": {
    "purchase_order_id": "9f2e...",
    "supplier_id": "1c7d...",
    "total_cost": 32000,
    "received_at": "2026-07-17T09:12:00.000Z"
  }
}`

const stockLowPayload = `{
  "event": "stock.low",
  "data": {
    "inventory_id": "e83a...",
    "name": "Coca-Cola 500ml",
    "stock_qty": 4,
    "low_stock_threshold": 10
  }
}`

const steps = [
  {
    name: 'Create a webhook from the dashboard',
    text: 'Webhooks aren’t created with an x-api-key REST call — they’re managed from the developer.askbiz.co dashboard’s Webhooks page, the same way you’d manage account settings. Add your endpoint URL (must be https://) and pick which event types to subscribe to: sale.created, purchase_order.received, stock.low. You can subscribe to one, two, or all three, and you can hold up to 10 webhooks per account.',
  },
  {
    name: 'Save the whsec_ secret — it’s shown once',
    text: 'Creating a webhook generates a signing secret in the form whsec_… and shows it to you exactly once, at creation time. Store it in your own environment (e.g. ASKBIZ_WEBHOOK_SECRET) immediately — there’s no way to retrieve it again later from the dashboard, only to delete the webhook and create a new one.',
  },
  {
    name: 'Verify the x-askbiz-signature header on your receiving endpoint',
    text: 'Every delivery is signed: the request body is HMAC-SHA256’d with your webhook secret, and the resulting hex digest is sent in the x-askbiz-signature header. Compute the same HMAC over the raw request body on your end and compare it to the header using a constant-time comparison — never a plain === or ==, which leaks timing information. Reject the request if it doesn’t match. Each delivery’s JSON body is { "event": "…", "data": { … } }, where event is one of the three subscribed event types.',
    code: (
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: verifyJs },
          { label: 'Python', lang: 'python', code: verifyPython },
        ]}
      />
    ),
  },
  {
    name: 'Send a test event and check the delivery log before going live',
    text: 'From the webhook’s row on the dashboard, use "Send test event" to enqueue a real synthetic delivery through the exact same signing and delivery path as a live event — it exercises your actual signature-verification code, not a mock. Then use "View deliveries" to see recent delivery attempts and their status. Do this before wiring the webhook into anything that matters, rather than waiting for a real sale, purchase order, or low-stock event to find out your endpoint or secret is wrong.',
  },
  {
    name: 'Plan around ~5-minute delivery latency, not instant delivery',
    text: 'Webhook delivery isn’t real-time — events are captured immediately when the underlying action happens, but delivery runs on a cron sweep that fires roughly every 5 minutes. Don’t build a flow that assumes sub-second or even sub-minute delivery; if you need a synchronous result (e.g. confirming a scan succeeded before continuing), use the relevant REST endpoint’s direct response instead of waiting on a webhook.',
  },
]

export default function WebhooksGuide() {
  return (
    <ArticleShell
      title="Subscribe to real-time webhooks"
      description="Webhooks let you react to sale.created, purchase_order.received, and stock.low events instead of polling. They're set up from the developer dashboard, not called with an x-api-key, and delivery runs on a ~5-minute cron sweep rather than instantly."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Webhooks', href: '/docs/guides/webhooks' },
      ]}
    >
      <p>
        AskBiz webhooks push three event types to a URL you control: <code>sale.created</code>,{' '}
        <code>purchase_order.received</code>, and <code>stock.low</code> — no others exist today. Unlike every
        other page in this API reference, webhooks are <strong>not</strong> something a third-party server calls with
        an <code>x-api-key</code>. They’re an account-settings action: you register the endpoint URL and event
        types from the developer.askbiz.co dashboard’s Webhooks page, the same place you’d manage API keys.
        Delivery is asynchronous and runs on a cron sweep roughly every 5 minutes, not instantly.
      </p>

      <HowToSteps steps={steps} />

      <h2>Event types and payload shape</h2>
      <p>
        Every delivery body has the shape <code>{'{ "event": "…", "data": { … } }'}</code>, where{' '}
        <code>event</code> is the event type name and <code>data</code> holds the event-specific fields below.
      </p>

      <h3>sale.created</h3>
      <p>Fires when a POS sale completes.</p>
      <CodeTabs samples={[{ label: 'Payload', lang: 'json', code: saleCreatedPayload }]} />

      <h3>purchase_order.received</h3>
      <p>Fires when a purchase order’s status transitions to received.</p>
      <CodeTabs samples={[{ label: 'Payload', lang: 'json', code: poReceivedPayload }]} />

      <h3>stock.low</h3>
      <p>
        Fires once, at the moment an item’s stock quantity crosses at or below its low-stock threshold — not
        repeatedly on every update while it stays low.
      </p>
      <CodeTabs samples={[{ label: 'Payload', lang: 'json', code: stockLowPayload }]} />

      <h2>What&rsquo;s next</h2>
      <p>
        For the request-response endpoints that make up the rest of the API, see{' '}
        <a href="/docs/api-reference">API Reference</a>. If you haven&rsquo;t built anything against AskBiz yet,
        start with the <a href="/docs/quickstart">quickstart</a>.
      </p>

      <FaqBlock
        heading="Webhooks FAQ"
        items={[
          {
            question: 'Can I create or manage webhooks with an API call instead of the dashboard?',
            answer: 'No. Webhook management (create, list, update, delete) is session-authenticated and only available from the developer.askbiz.co dashboard’s Webhooks page — there’s no x-api-key REST endpoint a third-party server calls to register a webhook. It’s treated as an account setting, not a per-request API action.',
          },
          {
            question: 'How fast are webhook deliveries?',
            answer: 'Not instant. Events are captured the moment the underlying action happens, but delivery to your endpoint runs on a cron sweep that fires roughly every 5 minutes, so plan for delivery latency bounded by about 5 minutes rather than real time.',
          },
          {
            question: 'What happens if I lose my webhook secret?',
            answer: 'The whsec_… secret is shown exactly once, at the moment you create the webhook. There’s no way to view it again afterward — if you lose it, delete the webhook and create a new one to get a fresh secret.',
          },
          {
            question: 'Why did signature verification fail even though the secret is correct?',
            answer: 'The most common cause is computing the HMAC over a re-serialized version of the JSON body instead of the exact raw bytes received — re-serializing can change key order or whitespace and produce a different digest. Compute the signature over the raw request body before any JSON parsing.',
          },
          {
            question: 'Can I test a webhook without waiting for a real sale or stock event?',
            answer: 'Yes — use "Send test event" on the webhook’s row in the dashboard. It enqueues a real delivery through the same signing and cron-delivery path as a live event, and "View deliveries" shows you the resulting attempt and status, so you can confirm your endpoint and signature check work before relying on a real event.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Subscribe to real-time webhooks',
        description: 'Register a webhook endpoint and event types from the AskBiz developer dashboard, save the signing secret, verify the x-askbiz-signature header, and test a delivery before relying on it in production.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Webhooks', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
