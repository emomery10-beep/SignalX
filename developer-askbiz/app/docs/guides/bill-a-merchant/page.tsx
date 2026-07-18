import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/bill-a-merchant`

export const metadata: Metadata = {
  title: 'Bill a merchant on your behalf — AskBiz API guide',
  description: 'A task-oriented walkthrough for collecting payment from a merchant with POST /api/v1/charges — create the charge, send the confirmation link, and confirm payment through GET /api/v1/charges. Includes the real no-payout-yet limitation.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Bill a merchant on your behalf — AskBiz API',
    description: 'Collect payment through a real Stripe Checkout session without touching a card number.',
    url: URL,
    type: 'article',
  },
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
    amount_cents: 250000, // £2,500.00 — amount_cents must be 100–10,000,000
    currency: 'gbp',
    description: 'Invoice #1042 — website retainer, July',
  }),
})

const { charge, confirmation_url } = await res.json()
console.log(charge.status) // "pending"`

const createPython = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/charges",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
    },
    json={
        "merchant_email": "owner@example-shop.com",
        "amount_cents": 250000,  # £2,500.00 — amount_cents must be 100-10,000,000
        "currency": "gbp",
        "description": "Invoice #1042 — website retainer, July",
    },
)

data = res.json()
charge = data["charge"]
confirmation_url = data["confirmation_url"]
print(charge["status"])  # "pending"`

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

const sendJs = `// Send confirmation_url to the merchant however you'd normally reach
// them — email, WhatsApp, SMS. It's not sent automatically by AskBiz.
await notifyMerchant(charge.merchant_email, {
  message: \`You have a new invoice for review: \${confirmation_url}\`,
})`

const sendPython = `# Send confirmation_url to the merchant however you'd normally reach
# them — email, WhatsApp, SMS. It's not sent automatically by AskBiz.
notify_merchant(
    merchant_email,
    message=f"You have a new invoice for review: {confirmation_url}",
)`

const pollCurl = `curl https://askbiz.co/api/v1/charges \\
  -H "x-api-key: abz_live_your_key_here"`

const pollJs = `const res = await fetch('https://askbiz.co/api/v1/charges', {
  headers: { 'x-api-key': process.env.ASKBIZ_API_KEY },
})

const { charges } = await res.json()
const mine = charges.find(c => c.id === charge.id)

if (mine.status === 'approved') {
  // Stripe confirmed real payment — safe to mark the invoice paid
} else if (mine.status === 'pending') {
  // Merchant hasn't approved and paid yet — check again later
}`

const pollPython = `res = requests.get(
    "https://askbiz.co/api/v1/charges",
    headers={"x-api-key": ASKBIZ_API_KEY},
)

charges = res.json()["charges"]
mine = next(c for c in charges if c["id"] == charge["id"])

if mine["status"] == "approved":
    pass  # Stripe confirmed real payment — safe to mark the invoice paid
elif mine["status"] == "pending":
    pass  # Merchant hasn't approved and paid yet — check again later`

const pollResponse = `{
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
    }
  ]
}`

const steps = [
  {
    name: 'Create the charge',
    text: 'Call POST /api/v1/charges with the merchant’s email, an amount_cents between 100 and 10,000,000 (£1 to £100,000), and a description up to 500 characters. This is not credit-billed — creating and listing charges costs you nothing. The response comes back with a pending charge and a confirmation_url.',
    code: (
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: createCurl },
          { label: 'JavaScript', lang: 'js', code: createJs },
          { label: 'Python', lang: 'python', code: createPython },
        ]}
      />
    ),
  },
  {
    name: 'Send the confirmation_url to the merchant',
    text: 'AskBiz does not email or message the merchant for you — deliver confirmation_url through whatever channel you already use to reach them (email, WhatsApp, SMS). The link points to https://developer.askbiz.co/charges/{token} and expires 7 days after creation (see expires_at in the response).',
    code: (
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: sendJs },
          { label: 'Python', lang: 'python', code: sendPython },
        ]}
      />
    ),
  },
  {
    name: 'The merchant approves and pays via Stripe Checkout',
    text: 'The merchant opens the confirmation link and, on approval, is redirected to a real Stripe Checkout session to actually pay. No card number, expiry, or CVC ever touches your server — Stripe collects it directly. There is no approve-without-paying path: the confirmation page itself never marks a charge as paid.',
  },
  {
    name: 'The charge becomes approved only after Stripe confirms payment',
    text: 'A charge moves from pending to approved exclusively when a Stripe webhook confirms the payment succeeded on AskBiz’s side. If the merchant closes the tab without paying, or the payment fails, the charge simply stays pending — it doesn’t flip to any kind of "declined" state on its own.',
  },
  {
    name: 'Check GET /api/v1/charges for the current status',
    text: 'Poll GET /api/v1/charges (or look up the charge by id in the returned list) to see whether status has moved from pending to approved, and read approved_at once it has. Use this to decide when to mark your own invoice or order as paid.',
    code: (
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: pollCurl },
          { label: 'JavaScript', lang: 'js', code: pollJs },
          { label: 'Python', lang: 'python', code: pollPython },
        ]}
      />
    ),
  },
]

export default function BillAMerchantGuide() {
  return (
    <ArticleShell
      title="Bill a merchant on your behalf"
      description="Collect payment from a merchant through a hosted Stripe Checkout page without your server ever touching a card number. This walks through POST /api/v1/charges end to end: create the charge, deliver the confirmation link, and confirm payment landed."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Bill a merchant', href: '/docs/guides/bill-a-merchant' },
      ]}
    >
      <p>
        <code>POST /api/v1/charges</code> creates a &ldquo;billing-on-behalf-of&rdquo; request against a merchant&rsquo;s
        email address. AskBiz generates a confirmation link; the merchant opens it and pays through a real Stripe
        Checkout session. The charge only becomes <code>approved</code> once Stripe confirms the payment actually
        went through — never by the confirmation page itself. Creating and listing charges is free; this endpoint
        isn&rsquo;t credit-billed.
      </p>

      <div className="not-prose rounded-lg border border-signal-600/30 bg-signal-600/10 px-4 py-3 my-6">
        <p className="text-sm text-ink-300 leading-relaxed">
          <strong className="text-ink-50">Read this before you build on it:</strong> there is currently no automatic
          payout mechanism from AskBiz to your account. Getting a charge to <code>approved</code> means the merchant
          has genuinely paid through Stripe on AskBiz&rsquo;s side — it does not move that money to you. Treat{' '}
          <code>/api/v1/charges</code> as collection infrastructure, not a complete payments product yet.
        </p>
      </div>

      <HowToSteps steps={steps} />

      <h2>Response shapes</h2>
      <p>What a successful create call returns:</p>
      <CodeTabs samples={[{ label: '200 — charge created', lang: 'json', code: createResponse }]} />
      <p>What GET /api/v1/charges returns once Stripe has confirmed payment on one of them:</p>
      <CodeTabs samples={[{ label: '200 — charges list', lang: 'json', code: pollResponse }]} />

      <h2>What&rsquo;s next</h2>
      <p>
        For the full parameter and error reference, including the 400/401 error cases and the currency note (charges
        default to <code>gbp</code>, separate from the generic per-call cent pricing on{' '}
        <a href="/docs/api-reference/pricing">GET /api/v1/pricing</a>), see{' '}
        <a href="/docs/api-reference/charges">POST + GET /api/v1/charges</a>.
      </p>

      <FaqBlock
        heading="Bill a merchant FAQ"
        items={[
          {
            question: 'If the merchant pays, does the money land in my account automatically?',
            answer: 'No. There is currently no automatic payout mechanism from AskBiz to your account. The Stripe Checkout session collects the merchant’s payment on AskBiz’s side — approving a charge does not yet move that money to you.',
          },
          {
            question: 'Can I or the merchant mark a charge as approved without a real payment?',
            answer: 'No. A charge only moves from pending to approved when a Stripe webhook confirms the payment succeeded. The confirmation page itself never flips the status, so there’s no way to fake an approval.',
          },
          {
            question: 'Does my server ever see the merchant’s card details?',
            answer: 'No. The merchant enters payment details directly into a real Stripe Checkout session after clicking your confirmation_url — no card number, expiry, or CVC crosses your server at any point.',
          },
          {
            question: 'How do I know when a charge has been paid, since there’s no webhook for it?',
            answer: 'Poll GET /api/v1/charges and check the status field on the charge — it starts as pending and becomes approved once Stripe confirms payment, with approved_at set at that point.',
          },
          {
            question: 'What happens if the merchant never opens the confirmation link?',
            answer: 'The charge stays pending and is only usable until expires_at, which is 7 days after creation — after that, treat the confirmation link as stale and create a new charge if you still need payment.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Bill a merchant on your behalf',
        description: 'Create a charge with POST /api/v1/charges, send the merchant the confirmation link, and confirm payment through GET /api/v1/charges once Stripe has processed it.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Bill a merchant', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
