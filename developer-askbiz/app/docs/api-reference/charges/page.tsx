import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/api-reference/charges`

export const metadata: Metadata = {
  title: 'POST + GET /api/v1/charges — Bill a merchant on your behalf — AskBiz API',
  description: 'Create and list billing-on-behalf-of charges against a merchant, collected through a hosted Stripe Checkout link between £1 and £100,000. Includes the real limitation: AskBiz does not yet automatically pay collected charges out to your account.',
  alternates: { canonical: URL },
  openGraph: { title: 'POST + GET /api/v1/charges — AskBiz API', description: 'Billing-on-behalf-of endpoint reference.', url: URL, type: 'article' },
}

const createCurl = `curl -X POST https://askbiz.co/api/v1/charges \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_email": "owner@example-shop.com",
    "amount_cents": 250000,
    "currency": "gbp",
    "description": "Invoice #1042 — website retainer, July"
  }'`

const createJs = `const res = await fetch('https://askbiz.co/api/v1/charges', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    merchant_email: 'owner@example-shop.com',
    amount_cents: 250000,
    currency: 'gbp',
    description: 'Invoice #1042 — website retainer, July',
  }),
})

const { charge, confirmation_url } = await res.json()
console.log(charge.status) // "pending"
// Send confirmation_url to the merchant — they approve and pay via Stripe Checkout`

const createPython = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/charges",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
    },
    json={
        "merchant_email": "owner@example-shop.com",
        "amount_cents": 250000,
        "currency": "gbp",
        "description": "Invoice #1042 — website retainer, July",
    },
)

data = res.json()
print(data["charge"]["status"])       # "pending"
print(data["confirmation_url"])       # send this to the merchant`

const createResponse = `{
  "charge": {
    "id": "cha_9f3e2c1a",
    "status": "pending",
    "amount_cents": 250000,
    "currency": "gbp",
    "description": "Invoice #1042 — website retainer, July",
    "created_at": "2026-07-17T09:12:00Z",
    "expires_at": "2026-07-24T09:12:00Z"
  },
  "confirmation_url": "https://developer.askbiz.co/charges/8f2a1c9e-4b3d-4a1e-9c7f-2d6e8a0b1c3f"
}`

const listCurl = `curl https://askbiz.co/api/v1/charges \\
  -H "x-api-key: abz_live_your_key_here"`

const listJs = `const res = await fetch('https://askbiz.co/api/v1/charges', {
  headers: { 'x-api-key': process.env.ASKBIZ_API_KEY },
})

const { charges } = await res.json()`

const listPython = `import requests

res = requests.get(
    "https://askbiz.co/api/v1/charges",
    headers={"x-api-key": ASKBIZ_API_KEY},
)

charges = res.json()["charges"]`

const listResponse = `{
  "charges": [
    {
      "id": "cha_9f3e2c1a",
      "merchant_email": "owner@example-shop.com",
      "amount_cents": 250000,
      "currency": "gbp",
      "description": "Invoice #1042 — website retainer, July",
      "status": "approved",
      "created_at": "2026-07-17T09:12:00Z",
      "approved_at": "2026-07-17T09:41:22Z",
      "expires_at": "2026-07-24T09:12:00Z"
    },
    {
      "id": "cha_7b1d4e2f",
      "merchant_email": "another-owner@example.com",
      "amount_cents": 15000,
      "currency": "gbp",
      "description": "Setup fee",
      "status": "pending",
      "created_at": "2026-07-16T14:03:11Z",
      "approved_at": null,
      "expires_at": "2026-07-23T14:03:11Z"
    }
  ]
}`

export default function ChargesReferencePage() {
  return (
    <ArticleShell
      title="POST + GET /api/v1/charges"
      description="Create a billing-on-behalf-of charge against a merchant’s email, collected through a real Stripe Checkout session, and list the charges you’ve created. AskBiz does not yet pay this money out to your own account automatically — read the Payouts section before you build on this."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'API Reference', href: '/docs/api-reference' }, { name: 'charges', href: '/docs/api-reference/charges' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">POST</span>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">GET</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">x-api-key required</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">Not credit-billed</span>
      </div>

      <h2>What it does</h2>
      <p>
        Lets your integration collect money from a merchant without ever touching their card details. You create a
        charge with an amount and a description; AskBiz creates a <code>pending</code> charge and a confirmation
        link at <code>https://developer.askbiz.co/charges/{'{token}'}</code>. The merchant opens that link and, on
        approval, is redirected to a real Stripe Checkout session to actually pay. A charge is only ever marked{' '}
        <code>approved</code> by a Stripe webhook confirming the payment went through — never by the confirmation
        page itself — so there&rsquo;s no way to mark a charge paid without a real Stripe transaction behind it.
      </p>
      <p>
        Creating and listing charges is free — this endpoint is not credit-billed, unlike{' '}
        <a href="/docs/api-reference/scan">/scan</a> or <a href="/docs/api-reference/whatsapp-send">/whatsapp/send</a>.
        It also doesn&rsquo;t support an <code>Idempotency-Key</code> header — if a create request times out and you
        aren&rsquo;t sure whether it landed, check <code>GET /api/v1/charges</code> for an existing charge to that
        merchant before creating another one.
      </p>

      <h2>Create a charge</h2>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: createCurl },
          { label: 'JavaScript', lang: 'js', code: createJs },
          { label: 'Python', lang: 'python', code: createPython },
        ]}
      />

      <h3>Body parameters</h3>
      <table>
        <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>merchant_email</code></td><td>string</td><td>Yes</td><td>A valid email address for the merchant you&rsquo;re charging.</td></tr>
          <tr><td><code>amount_cents</code></td><td>integer</td><td>Yes</td><td>Amount to charge, in cents. Between 100 and 10,000,000 — £1 to £100,000.</td></tr>
          <tr><td><code>currency</code></td><td>string</td><td>No</td><td>Defaults to <code>gbp</code> if omitted.</td></tr>
          <tr><td><code>description</code></td><td>string</td><td>Yes</td><td>Max 500 characters — what the charge is for (e.g. an invoice reference).</td></tr>
        </tbody>
      </table>

      <h3>Response</h3>
      <CodeTabs samples={[{ label: '200 — success', lang: 'json', code: createResponse }]} />
      <p>
        Send <code>confirmation_url</code> to the merchant however you&rsquo;d normally reach them — it&rsquo;s not
        emailed automatically. <code>charge.status</code> starts as <code>pending</code> and becomes{' '}
        <code>approved</code> once Stripe confirms payment; see the guide on{' '}
        <a href="/docs/guides/bill-a-merchant">billing a merchant on your behalf</a> for the full flow end to end.
      </p>

      <h2>List charges</h2>
      <p>Returns the charges you&rsquo;ve created, most recent 100 first.</p>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: listCurl },
          { label: 'JavaScript', lang: 'js', code: listJs },
          { label: 'Python', lang: 'python', code: listPython },
        ]}
      />

      <h3>Response</h3>
      <CodeTabs samples={[{ label: '200 — success', lang: 'json', code: listResponse }]} />

      <h2>Payouts — read this before you build on it</h2>
      <p>
        This is a real, current limitation, not a rounding-error caveat: <strong>there is no automatic payout
        mechanism from AskBiz to your account.</strong> Creating a charge and getting it approved collects the
        merchant&rsquo;s payment through a genuine Stripe Checkout session on AskBiz&rsquo;s side — it does not move
        that money to you. Treat <code>/api/v1/charges</code> as collection infrastructure you can build on top of
        today, not as a complete payments product yet.
      </p>

      <h2>Currency</h2>
      <p>
        <code>charges</code> defaults <code>currency</code> to <code>gbp</code> and amounts are billed in real GBP
        through Stripe. That&rsquo;s a different context from{' '}
        <a href="/docs/api-reference/pricing">GET /api/v1/pricing</a>, which labels per-call API prices generically
        in cents (<code>currency: "usd_cents"</code>) — the two aren&rsquo;t the same currency system, and this page
        won&rsquo;t pretend they are.
      </p>

      <h2>Errors</h2>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>400</td><td>Invalid <code>merchant_email</code>, <code>amount_cents</code> outside 100–10,000,000, or <code>description</code> missing or over 500 characters.</td></tr>
          <tr><td>401</td><td>Missing or invalid <code>x-api-key</code>.</td></tr>
        </tbody>
      </table>
      <p>
        There&rsquo;s no 402 here — since this endpoint isn&rsquo;t credit-billed, a low or empty wallet never blocks
        a charge from being created or listed.
      </p>

      <FaqBlock
        heading="Charges endpoint FAQ"
        items={[
          {
            question: 'If a merchant approves and pays, does the money land in my account automatically?',
            answer: 'No. There is currently no automatic payout mechanism from AskBiz to your account. Approval and payment happen through a real Stripe Checkout session on AskBiz’s side — this endpoint collects money on the merchant’s behalf, it does not yet move that money to you.',
          },
          {
            question: 'Can a merchant, or I, mark a charge as approved without actually paying?',
            answer: 'No. A charge only moves from pending to approved when a Stripe webhook confirms the payment succeeded — the confirmation page itself never flips the status, so there’s no way to fake an approval.',
          },
          {
            question: 'What currency are charges billed in?',
            answer: 'Whatever you pass as currency, defaulting to gbp if you omit it — amounts are real GBP charged through Stripe. This is separate from the generic per-call cent pricing on GET /api/v1/pricing.',
          },
          {
            question: 'Does creating or listing charges cost me credits?',
            answer: 'No. POST and GET /api/v1/charges are not credit-billed — only the eventual Stripe payment involves real money, and that money goes toward the merchant’s payment, not a debit from your AskBiz wallet.',
          },
          {
            question: 'Can I retry a create request safely if it times out?',
            answer: 'This endpoint doesn’t support an Idempotency-Key header. If you’re unsure whether a create request landed, call GET /api/v1/charges first and check for an existing charge to that merchant_email before creating a duplicate.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'POST + GET /api/v1/charges — AskBiz API Reference',
        description: 'Billing-on-behalf-of endpoint — create a Stripe-Checkout-backed charge against a merchant and list charges you’ve created. No automatic payout to the developer yet.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'API Reference', url: `${SITE}/docs/api-reference` },
          { name: 'charges', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
