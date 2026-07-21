import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/sandbox-keys`

export const metadata: Metadata = {
  title: 'Build safely with a sandbox key — AskBiz API guide',
  description: 'Create a test API key (abz_test_…) and get realistic canned responses from /api/v1/scan, /api/v1/whatsapp/send, and /api/v1/charges with no real debit, no real WhatsApp message, and no real Stripe charge — then switch to a live key when you’re ready to ship.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Sandbox keys — AskBiz API',
    description: 'Test your integration with nothing real at stake, then flip one setting to go live.',
    url: URL,
    type: 'article',
  },
}

const testScanResponse = `{
  "found": true,
  "inventory_id": null,
  "name": "Coca-Cola 500ml",
  "price": 80,
  "cost_price": 60,
  "stock_qty": 24,
  "unit": "bottle",
  "test_mode": true
}`

const testWhatsappResponse = `{
  "success": true,
  "test_mode": true
}`

const testChargeApprove = `{
  "simulated": true,
  "status": "approved"
}`

const steps = [
  {
    name: 'Create a test key',
    text: 'On the Keys page, open New key and leave Environment set to Test — it’s the default. You’ll get a key that starts abz_test_… instead of abz_live_…. A key’s environment is fixed at creation and can’t be changed later, so create a separate live key when you’re ready to ship.',
  },
  {
    name: 'Call scan, whatsapp/send, or charges exactly like you would live',
    text: 'Every request shape, header, and error case is identical between a test key and a live key — the same 400 for a malformed body, the same 401 for a bad key. The only difference is what happens on success.',
  },
  {
    name: 'Get a realistic response with nothing real behind it',
    text: 'POST /api/v1/scan returns a fixed, realistic product match. POST /api/v1/whatsapp/send returns success without sending anything. POST /api/v1/charges creates a real charge row you can approve on the confirmation page — but approving it simulates the outcome instead of opening a real Stripe checkout, and nothing is ever charged to a card.',
  },
  {
    name: 'Switch to a live key when you’re ready',
    text: 'Create a new key with Environment set to Live, or use one you already have. There’s nothing to migrate — your integration code doesn’t change, only which key you send.',
  },
]

export default function SandboxKeysGuide() {
  return (
    <ArticleShell
      title="Build safely with a sandbox key"
      description="A test key (abz_test_…) lets you build and test a real integration against realistic responses, with nothing real at stake — no wallet debit, no WhatsApp message, no Stripe charge. Switch to a live key when you’re ready to ship."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Sandbox keys', href: '/docs/guides/sandbox-keys' },
      ]}
    >
      <p>
        Every API key is either <strong>Test</strong> (<code>abz_test_&hellip;</code>) or{' '}
        <strong>Live</strong> (<code>abz_live_&hellip;</code>) — set once when you create it, and fixed after
        that. A test key is the default for a new key, on the theory that your first call against this API
        shouldn&rsquo;t be able to hurt anything. Everything below applies the same way whether you call the API
        directly or from the <a href="/docs/guides/use-the-api-console">interactive console</a>.
      </p>

      <HowToSteps steps={steps} />

      <h2>What each endpoint does with a test key</h2>
      <table>
        <thead><tr><th>Endpoint</th><th>With a test key</th></tr></thead>
        <tbody>
          <tr>
            <td><code>POST /api/v1/scan</code></td>
            <td>Always returns the same realistic match, no vision model call, no wallet debit, no read of your real inventory.</td>
          </tr>
          <tr>
            <td><code>POST /api/v1/whatsapp/send</code></td>
            <td>Returns success immediately — no message reaches Meta, no wallet debit. Nothing is delivered to the phone number you send.</td>
          </tr>
          <tr>
            <td><code>POST /api/v1/charges</code></td>
            <td>Creates a real charge row and a real confirmation link, so you can test the full lifecycle — but approving it on the confirmation page simulates approval instead of opening Stripe Checkout. No card is ever charged, and the charge never appears in a payout.</td>
          </tr>
          <tr>
            <td><code>POST /api/v1/ask</code></td>
            <td>Answers for real, on both test and live keys — it&rsquo;s never billed and only ever reads your own account&rsquo;s data, so there&rsquo;s no real-money or real-message risk to guard against here.</td>
          </tr>
          <tr>
            <td><code>POST /api/v1/connections</code></td>
            <td>Returns an already-active fixture connection instantly on a test key — no real merchant inbox is reached, <code>merchant_email</code> in the response is a fixed sandbox address, and <code>connection.test_mode</code> is <code>true</code>.</td>
          </tr>
        </tbody>
      </table>

      <h2>Example: a test scan</h2>
      <p>
        Send any image — a test key never actually calls the vision model, so the request succeeds regardless of
        what the photo shows:
      </p>
      <CodeTabs samples={[{ label: 'Response — always this exact match', lang: 'json', code: testScanResponse }]} />

      <h2>Example: a test WhatsApp send</h2>
      <p>Nothing is sent, to any phone number, including a real one you control:</p>
      <CodeTabs samples={[{ label: 'Response', lang: 'json', code: testWhatsappResponse }]} />

      <h2>Example: approving a test charge</h2>
      <p>
        The confirmation page a test charge&rsquo;s <code>confirmation_url</code> points to shows a{' '}
        <strong>TEST CHARGE</strong> banner and a <em>Simulate approve</em> button instead of a real payment form.
        Approving it returns:
      </p>
      <CodeTabs samples={[{ label: 'Response from the approve step', lang: 'json', code: testChargeApprove }]} />

      <h2>What&rsquo;s next</h2>
      <p>
        Once your integration behaves the way you expect against a test key, create a live key from the same
        Keys page and point your integration at it — every request shape stays the same. See{' '}
        <a href="/docs/guides/errors-and-retries">Handle errors and retries safely</a> before you flip the switch,
        so a live retry can&rsquo;t double-charge or double-send.
      </p>

      <FaqBlock
        heading="Sandbox keys FAQ"
        items={[
          {
            question: 'Can I turn a test key into a live key, or the other way around?',
            answer: 'No — a key’s environment is fixed at creation and can’t be changed afterward, the same as Stripe’s own live/test key model. Create a new key in the environment you need.',
          },
          {
            question: 'Does a test key count against my plan’s monthly quota?',
            answer: 'Yes — quota and per-minute rate limits apply the same way to test and live keys. What’s different is billing: scan and whatsapp/send never debit your wallet on a test key, since nothing real happens.',
          },
          {
            question: 'Will a test scan ever return "not found" so I can test that path?',
            answer: 'Not yet — a test key always returns the same successful match today. If you need to test your own not-found handling, use a live key with a real photo of something not in your catalog.',
          },
          {
            question: 'Can a test charge’s confirmation link be sent to a real merchant?',
            answer: 'Yes, and it’s safe to — a test charge’s confirmation page never shows a real Stripe checkout, only the Simulate approve/decline buttons, so nothing is ever collected from whoever opens it.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Build safely with a sandbox key',
        description: 'Create a test API key and get realistic canned responses from scan, whatsapp/send, and charges with no real debit, message, or charge, then switch to a live key when ready.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Sandbox keys', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
