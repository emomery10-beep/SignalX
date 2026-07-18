import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/errors-and-retries`

export const metadata: Metadata = {
  title: 'Handle errors and retries safely — AskBiz API guide',
  description: 'The universal error field every AskBiz API response shares, what each status code (400/401/402/403/422/429/502) means per endpoint, the debit-on-success billing guarantee, and how to use Idempotency-Key so a retry never double-charges or double-sends.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Handle errors and retries safely — AskBiz API',
    description: 'Every status code explained, the never-charged-for-a-failure guarantee, and the full Idempotency-Key contract with a before/after example.',
    url: URL,
    type: 'article',
  },
}

const errorShape = `{
  "error": "A human-readable description of what went wrong"
}`

const insufficientCredits = `{
  "error": "Insufficient credits",
  "required_cents": 2,
  "topup": "<your wallet top-up link>"
}`

const quotaExceeded = `{
  "error": "Monthly quota exceeded",
  "plan": "free",
  "limit": 100,
  "used": 100
}`

const withoutKeyJs = `async function scanProduct(base64Jpeg) {
  const res = await fetch('https://askbiz.co/api/v1/scan', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ASKBIZ_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Jpeg }),
  })
  return res.json()
}

// If this call times out, you don't know whether the scan actually ran
// server-side. Calling scanProduct() again is a brand-new, independent
// request — if the first attempt actually succeeded after your client
// gave up on it, you now pay 3 cents twice for the same photo.
try {
  return await scanProduct(photo)
} catch (err) {
  return await scanProduct(photo) // no protection against a double charge
}`

const withoutKeyPython = `import requests

def scan_product(base64_jpeg):
    res = requests.post(
        "https://askbiz.co/api/v1/scan",
        headers={
            "x-api-key": ASKBIZ_API_KEY,
            "Content-Type": "application/json",
        },
        json={"image": base64_jpeg},
    )
    return res.json()

# If this call times out, you don't know whether the scan actually ran
# server-side. Calling scan_product() again is a brand-new, independent
# request — if the first attempt actually succeeded after your client
# gave up on it, you now pay 3 cents twice for the same photo.
try:
    result = scan_product(photo)
except requests.RequestException:
    result = scan_product(photo)  # no protection against a double charge`

const withKeyJs = `async function scanProduct(base64Jpeg, idempotencyKey) {
  const res = await fetch('https://askbiz.co/api/v1/scan', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ASKBIZ_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ image: base64Jpeg }),
  })
  return res.json()
}

// Generate the key once, per logical scan — not per attempt.
const idempotencyKey = crypto.randomUUID()

try {
  return await scanProduct(photo, idempotencyKey)
} catch (err) {
  // Same key on retry: if the first attempt already succeeded server-side,
  // you get back the exact original response instead of a second charge.
  return await scanProduct(photo, idempotencyKey)
}`

const withKeyPython = `import uuid
import requests

def scan_product(base64_jpeg, idempotency_key):
    res = requests.post(
        "https://askbiz.co/api/v1/scan",
        headers={
            "x-api-key": ASKBIZ_API_KEY,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotency_key,
        },
        json={"image": base64_jpeg},
    )
    return res.json()

# Generate the key once, per logical scan — not per attempt.
idempotency_key = str(uuid.uuid4())

try:
    result = scan_product(photo, idempotency_key)
except requests.RequestException:
    # Same key on retry: if the first attempt already succeeded server-side,
    # you get back the exact original response instead of a second charge.
    result = scan_product(photo, idempotency_key)`

export default function ErrorsAndRetriesGuide() {
  return (
    <ArticleShell
      title="Handle errors and retries safely"
      description="Every AskBiz API error response is JSON with at least an error field. This page covers what each status code means per endpoint, the guarantee that a failed call is never billed, and the full Idempotency-Key contract for retrying /scan and /whatsapp/send without double-charging or double-sending."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Errors and retries', href: '/docs/guides/errors-and-retries' },
      ]}
    >
      <p>
        Every error response from the AskBiz API is JSON with at least an <code>error</code> string field — there is
        no single universal schema beyond that; some endpoints attach extra context fields on top. A failed or
        rejected call is <strong>never billed</strong>, on any endpoint that charges per call. And on{' '}
        <code>POST /api/v1/scan</code> and <code>POST /api/v1/whatsapp/send</code> specifically, sending an{' '}
        <code>Idempotency-Key</code> header means a retry after a timeout returns the original result instead of
        re-running (and re-billing) the underlying action.
      </p>

      <h2>The universal error shape</h2>
      <p>
        Every 4xx or 5xx response from any <code>/api/v1/*</code> endpoint is a JSON object with at least this
        field:
      </p>
      <CodeTabs samples={[{ label: 'Error response shape', lang: 'json', code: errorShape }]} />
      <p>
        Some status codes add fields on top of <code>error</code> — insufficient credits (402) includes{' '}
        <code>required_cents</code> and a <code>topup</code> link, a monthly-quota 429 includes{' '}
        <code>plan</code>, <code>limit</code>, and <code>used</code>, and a disabled-key 403 tells you to re-enable
        the key from your dashboard settings. There is no one shared schema for these extras — they're documented
        per status code below, not invented as a generic envelope.
      </p>

      <h2>What each status code means</h2>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th><th>Applies to</th></tr></thead>
        <tbody>
          <tr>
            <td>400</td>
            <td>Malformed JSON body, or a required field missing or invalid — e.g. <code>ask</code>&rsquo;s <code>question</code> over 2000 characters, <code>whatsapp/send</code>&rsquo;s <code>phone</code> not in international format, <code>connections</code>&rsquo;s invalid email or scopes array, <code>charges</code>&rsquo;s <code>amount_cents</code> out of range or missing <code>description</code>.</td>
            <td>ask, scan, whatsapp/send, connections, charges</td>
          </tr>
          <tr>
            <td>401</td>
            <td>Missing or invalid <code>x-api-key</code> header.</td>
            <td>ask, scan, whatsapp/send, connections, charges</td>
          </tr>
          <tr>
            <td>402</td>
            <td>Wallet balance is too low to cover the call&rsquo;s price. Body includes <code>required_cents</code>.</td>
            <td>scan, whatsapp/send</td>
          </tr>
          <tr>
            <td>403</td>
            <td>Two different causes: your key is disabled account-wide (fix: re-enable it from dashboard settings — this applies regardless of endpoint or request body), or this specific call isn&rsquo;t authorized — <code>whatsapp/send</code> rejects a <code>generic</code>-mode key outright, and <code>scan</code> rejects a <code>merchant_id</code> with no active connection granting <code>read_inventory</code>.</td>
            <td>ask, scan, whatsapp/send (any endpoint, for a disabled key)</td>
          </tr>
          <tr>
            <td>422</td>
            <td>The vision model couldn&rsquo;t identify a product in the image.</td>
            <td>scan</td>
          </tr>
          <tr>
            <td>429</td>
            <td>Per-minute rate limit or monthly quota exceeded. A quota 429 body includes <code>plan</code>, <code>limit</code>, and <code>used</code>. Check the <code>X-RateLimit-Remaining</code> response header — every endpoint returns it, backed by a durable per-key counter.</td>
            <td>ask, scan, whatsapp/send</td>
          </tr>
          <tr>
            <td>502</td>
            <td>The upstream call AskBiz depends on failed — the Groq vision pipeline for <code>scan</code>, Meta&rsquo;s WhatsApp API for <code>whatsapp/send</code>. Safe to retry.</td>
            <td>scan, whatsapp/send</td>
          </tr>
          <tr>
            <td>500</td>
            <td>The AI request itself failed. Safe to retry.</td>
            <td>ask</td>
          </tr>
        </tbody>
      </table>
      <p>
        One more code worth knowing outside this table: <code>POST /api/v1/connections</code> returns{' '}
        <strong>409</strong> if an active connection to that <code>merchant_email</code> already exists for your
        key — that&rsquo;s a duplicate-request conflict, not a retry-safety concern, since a second identical POST
        won&rsquo;t create a second connection row.
      </p>

      <h3>402 — insufficient credits (scan, whatsapp/send)</h3>
      <p>
        <code>required_cents</code> tells you the exact price of the call you attempted — 3 for <code>scan</code>,
        2 for <code>whatsapp/send</code>. <code>topup</code> is a link to top up your wallet.
      </p>
      <CodeTabs samples={[{ label: '402 — insufficient credits', lang: 'json', code: insufficientCredits }]} />

      <h3>429 — quota exceeded (ask, scan, whatsapp/send)</h3>
      <p>
        <code>plan</code>, <code>limit</code>, and <code>used</code> tell you exactly which ceiling you hit. Plan
        limits are per month: <code>free</code> is 100, <code>growth</code> is 10,000, <code>business</code> is
        unlimited (<code>-1</code>). Per-minute limits are separate: <code>free</code> is 5/min, <code>growth</code>{' '}
        is 60/min, <code>business</code> is 120/min. See{' '}
        <a href="/docs/api-reference/pricing">GET /api/v1/pricing</a> for the full table, no key required to check
        it.
      </p>
      <CodeTabs samples={[{ label: '429 — monthly quota exceeded', lang: 'json', code: quotaExceeded }]} />

      <h2>You&rsquo;re never charged for a failed call</h2>
      <p>
        On every endpoint that has a price, billing happens only after the underlying action actually succeeds —
        never on the attempt itself:
      </p>
      <ul>
        <li>
          <code>POST /api/v1/scan</code> debits 3 cents only on a 200 response — the vision model returned an
          identification, whether or not it matched your inventory. A 400, 401, 402, 403, 422, 429, or 502 is never
          billed.
        </li>
        <li>
          <code>POST /api/v1/whatsapp/send</code> debits 2 cents only after Meta confirms the message actually sent
          (200, <code>success: true</code>). A 400, 401, 402, 403, 429, or 502 — including the case where Meta
          itself rejects the send — is never billed.
        </li>
        <li>
          <code>POST /api/v1/ask</code> isn&rsquo;t credit-billed at all, success or failure — it&rsquo;s free
          within your plan&rsquo;s quota.
        </li>
        <li>
          <code>POST /api/v1/connections</code> and <code>POST /api/v1/charges</code> aren&rsquo;t credit-billed
          operations either — creating a connection request or a charge request costs you nothing; <code>charges</code>{' '}
          collects money from the merchant, it doesn&rsquo;t debit your wallet.
        </li>
      </ul>

      <h2>Retrying safely with Idempotency-Key</h2>
      <p>
        <code>POST /api/v1/scan</code> and <code>POST /api/v1/whatsapp/send</code> accept an{' '}
        <code>Idempotency-Key</code> header — any client-generated string, a UUID works well. Send the same key on
        a retry of the same logical operation (e.g. after a timeout where you don&rsquo;t know if the first attempt
        landed), and the API returns the exact original response instead of re-running the action. That means a
        retried <code>scan</code> never runs the vision model twice, a retried <code>whatsapp/send</code> never
        sends a second real message, and neither ever double-charges. Without the header, every request is
        independent — a retry is a brand-new, separately billable call. This is the same convention Stripe uses
        for the same header name.
      </p>

      <h3>Without Idempotency-Key — risky</h3>
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: withoutKeyJs },
          { label: 'Python', lang: 'python', code: withoutKeyPython },
        ]}
      />

      <h3>With Idempotency-Key — safe</h3>
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: withKeyJs },
          { label: 'Python', lang: 'python', code: withKeyPython },
        ]}
      />
      <p>
        One caveat: the key alone is what the API matches on. Reusing the same key for two genuinely different
        scans returns the first scan&rsquo;s stored result for the second one too — generate a fresh key per
        logical operation, and only reuse it across retries of that same operation.
      </p>

      <h2>Endpoints that don&rsquo;t use Idempotency-Key</h2>
      <p>
        <code>POST /api/v1/ask</code>, <code>POST /api/v1/connections</code>, and{' '}
        <code>POST /api/v1/charges</code> don&rsquo;t check for or store this header. For <code>ask</code>, that&rsquo;s
        low-stakes — it isn&rsquo;t billed, so a redundant retry just costs latency, not money. For{' '}
        <code>connections</code>, a duplicate POST to the same <code>merchant_email</code> already returns a 409
        instead of creating a second pending connection, so accidental double-submission is handled without an
        opt-in key. <code>charges</code> has no built-in de-duplication described here — each successful POST
        creates a new charge request, so avoid blindly retrying a <code>charges</code> call you&rsquo;re not sure
        landed; check <a href="/docs/api-reference/charges">GET /api/v1/charges</a> for existing charges to that
        merchant first.
      </p>

      <h2>What&rsquo;s next</h2>
      <p>
        For full parameter and response details per endpoint, see{' '}
        <a href="/docs/api-reference/scan">POST /api/v1/scan</a>,{' '}
        <a href="/docs/api-reference/whatsapp-send">POST /api/v1/whatsapp/send</a>,{' '}
        <a href="/docs/api-reference/ask">POST /api/v1/ask</a>,{' '}
        <a href="/docs/api-reference/connections">POST /api/v1/connections</a>, and{' '}
        <a href="/docs/api-reference/charges">POST /api/v1/charges</a>. Webhook deliveries (from the dashboard, not
        an <code>x-api-key</code> call) have their own retry and signing model — see{' '}
        <a href="/docs/guides/webhooks">Subscribe to real-time webhooks</a>.
      </p>

      <FaqBlock
        heading="Errors and retries FAQ"
        items={[
          {
            question: 'Do I get billed for a 429 rate-limit or quota error?',
            answer: 'No. Like every other error status, a 429 is never billed — /api/v1/scan debits 3 cents and /api/v1/whatsapp/send debits 2 cents only on a successful 200 response, never on a rejected attempt.',
          },
          {
            question: 'Does /api/v1/ask support Idempotency-Key?',
            answer: 'No. Idempotency-Key is only recognized on POST /api/v1/scan and POST /api/v1/whatsapp/send. /api/v1/ask doesn’t bill per call at all — it’s free within your plan’s quota — and doesn’t check for or store this header, so sending it has no effect.',
          },
          {
            question: 'What happens if I retry a POST to /api/v1/connections with the same merchant email?',
            answer: 'You get a 409, not a duplicate connection. /api/v1/connections already rejects a second active connection request to the same merchant_email for your key, so this specific case is protected without needing an Idempotency-Key.',
          },
          {
            question: 'If I reuse the same Idempotency-Key for two genuinely different scans, will the second one run?',
            answer: 'No — the API matches on the key alone and can’t tell your two photos apart from it. It returns the first request’s stored response for any repeat of that key, regardless of what the body says the second time. Generate a new key per logical operation, and only reuse it across retries of that same operation.',
          },
          {
            question: 'Why did I get a 403 telling me to re-enable my key, when my request body looks correct?',
            answer: 'That means the key is disabled at the account level, independent of the endpoint or request body — every x-api-key-authenticated endpoint returns the same 403 in that case. Re-enabling it from your dashboard settings is the fix, not changing the request.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'Handle errors and retries safely — AskBiz API',
        description: 'The universal error field every AskBiz API response shares, what each status code means per endpoint, the debit-on-success billing guarantee, and the full Idempotency-Key contract for /scan and /whatsapp/send.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Errors and retries', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
