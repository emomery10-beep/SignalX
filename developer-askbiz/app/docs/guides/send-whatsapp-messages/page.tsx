import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/send-whatsapp-messages`

export const metadata: Metadata = {
  title: 'Send WhatsApp receipts and purchase orders — AskBiz API guide',
  description: 'A task-oriented walkthrough for sending a receipt or purchase-order template over WhatsApp with POST /api/v1/whatsapp/send — key mode, phone formatting, idempotent sends, and handling a Meta send failure.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Send WhatsApp receipts and purchase orders — AskBiz API',
    description: 'From an account-mode key to a delivered WhatsApp message, without double-sending on retry.',
    url: URL,
    type: 'article',
  },
}

const sendCurl = `curl -X POST https://askbiz.co/api/v1/whatsapp/send \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 7c4f1a2e-9d3b-4e6a-8f21-1b5c9a0d3e7f" \\
  -d '{
    "phone": "+254712345678",
    "template": "receipt",
    "text": "Receipt #1042 — Coca-Cola 500ml x2, Total KES 160. Thank you for your purchase."
  }'`

const sendJs = `const idempotencyKey = crypto.randomUUID() // keep this value if you need to retry

const res = await fetch('https://askbiz.co/api/v1/whatsapp/send', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  },
  body: JSON.stringify({
    phone: '+254712345678',
    template: 'receipt',
    text: 'Receipt #1042 — Coca-Cola 500ml x2, Total KES 160. Thank you for your purchase.',
  }),
})

const result = await res.json()`

const sendPython = `import requests
import uuid

idempotency_key = str(uuid.uuid4())  # keep this value if you need to retry

res = requests.post(
    "https://askbiz.co/api/v1/whatsapp/send",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotency_key,
    },
    json={
        "phone": "+254712345678",
        "template": "receipt",
        "text": "Receipt #1042 — Coca-Cola 500ml x2, Total KES 160. Thank you for your purchase.",
    },
)

result = res.json()`

const retryJs = `async function sendReceipt(payload, idempotencyKey) {
  const res = await fetch('https://askbiz.co/api/v1/whatsapp/send', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ASKBIZ_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey, // same key on every attempt for this send
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 502) {
    // Meta failed to send — nothing was charged. Retry with the SAME key,
    // not a new one, so a message that actually did land isn't sent twice.
    return sendReceipt(payload, idempotencyKey)
  }

  return res.json()
}`

const retryPython = `def send_receipt(payload, idempotency_key):
    res = requests.post(
        "https://askbiz.co/api/v1/whatsapp/send",
        headers={
            "x-api-key": ASKBIZ_API_KEY,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotency_key,  # same key on every attempt for this send
        },
        json=payload,
    )

    if res.status_code == 502:
        # Meta failed to send — nothing was charged. Retry with the SAME key,
        # not a new one, so a message that actually did land isn't sent twice.
        return send_receipt(payload, idempotency_key)

    return res.json()`

const steps = [
  {
    name: 'Confirm your key is account-mode',
    text: 'POST /api/v1/whatsapp/send requires an account-mode key — a generic-mode key gets a 403. Generic keys have no tie to a real AskBiz business, so this endpoint deliberately can’t be used as an open message-blasting gateway. Check a key’s mode on the Keys page in the developer dashboard before you build against this endpoint.',
  },
  {
    name: 'Choose receipt or purchase_order as the template',
    text: 'The template field accepts exactly two values: receipt or purchase_order. There is no third option — otp is reserved for AskBiz’s own login flow and is never available through this endpoint. The template just tells AskBiz which category the message belongs to; the actual wording comes from the text field you send, up to 1024 characters.',
  },
  {
    name: 'Format the phone number in international form',
    text: 'phone must be in international format with a leading +, for example +254712345678. An invalid format returns a 400 before anything is attempted, so it never gets billed.',
  },
  {
    name: 'Send the request with an Idempotency-Key header',
    text: 'Generate a fresh client-side ID — a UUID works — and send it as the Idempotency-Key header. If your request times out and you don’t know whether it landed, retry with the exact same key and you get back the original result instead of a second real WhatsApp message going out. You’re only charged 2 cents once Meta confirms the send succeeded; a retry that hits the same key on an already-successful send is never billed twice.',
    code: (
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: sendCurl },
          { label: 'JavaScript', lang: 'js', code: sendJs },
          { label: 'Python', lang: 'python', code: sendPython },
        ]}
      />
    ),
  },
  {
    name: 'Handle a 502 by retrying with the same key',
    text: 'A 502 means Meta’s WhatsApp API failed to actually send the message — nothing is charged. It’s safe to retry immediately, as long as you reuse the same Idempotency-Key from the first attempt. Generating a new key on retry defeats the protection: it would be treated as an unrelated send, and if the first attempt had actually succeeded on Meta’s side after your client gave up on it, you’d end up paying for and delivering the message twice.',
    code: (
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: retryJs },
          { label: 'Python', lang: 'python', code: retryPython },
        ]}
      />
    ),
  },
]

export default function SendWhatsappMessagesGuide() {
  return (
    <ArticleShell
      title="Send WhatsApp receipts and purchase orders"
      description="You have a completed sale or a supplier order and want the merchant or supplier notified over WhatsApp. This is the shortest path through POST /api/v1/whatsapp/send: confirm your key mode, pick a template, format the number, and send idempotently."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Send WhatsApp messages', href: '/docs/guides/send-whatsapp-messages' },
      ]}
    >
      <p>
        <code>POST /api/v1/whatsapp/send</code> sends a <code>receipt</code> or <code>purchase_order</code> template
        over WhatsApp through AskBiz&rsquo;s Meta Business API connection. It requires an{' '}
        <code>account</code>-mode key, costs <strong>2 cents per successful send</strong>, and is billed only after
        Meta confirms the message actually went out — a failed or rejected call never touches your wallet.
      </p>

      <HowToSteps steps={steps} />

      <h2>What&rsquo;s next</h2>
      <p>
        For the full parameter and error reference, see{' '}
        <a href="/docs/api-reference/whatsapp-send">POST /api/v1/whatsapp/send</a>. For the complete idempotency
        contract shared with <code>/api/v1/scan</code>, see{' '}
        <a href="/docs/guides/errors-and-retries">Errors and retries</a>. Check{' '}
        <a href="/docs/api-reference/pricing">GET /api/v1/pricing</a> any time for current per-endpoint prices —
        it&rsquo;s public, no key required.
      </p>

      <FaqBlock
        heading="Send WhatsApp messages FAQ"
        items={[
          {
            question: 'Why did I get a 403 even though my phone number and template look correct?',
            answer: 'A 403 on this endpoint means your key is in generic mode. Sending WhatsApp messages requires an account-mode key tied to a real AskBiz business — generic-mode keys are rejected outright, regardless of the request body.',
          },
          {
            question: 'What happens if I retry a failed send with a different Idempotency-Key by mistake?',
            answer: 'It’s treated as a completely new, unrelated request. If the original attempt actually succeeded on Meta’s side after your client timed out or errored, you’ll send the message a second time and be charged a second 2 cents. Always reuse the exact same key when retrying the same logical send.',
          },
          {
            question: 'Am I charged if I get a 502?',
            answer: 'No. A 502 means Meta’s WhatsApp API failed to send the message, and nothing is charged — the same is true for every 4xx response from this endpoint. You’re only debited the 2 cents after Meta confirms a successful send.',
          },
          {
            question: 'Can I send a one-time passcode template through this endpoint?',
            answer: 'No. The otp template is reserved for AskBiz’s own login flow and is not exposed here — template only accepts receipt or purchase_order.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Send WhatsApp receipts and purchase orders',
        description: 'Confirm your key is account-mode, pick a receipt or purchase_order template, format the phone number, and send with an Idempotency-Key so a retry never sends the same WhatsApp message twice.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Send WhatsApp messages', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
