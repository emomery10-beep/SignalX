import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/api-reference/scan`

export const metadata: Metadata = {
  title: 'POST /api/v1/scan — Vision product recognition — AskBiz API',
  description: 'Identify a product from a photo and match it against a merchant’s live inventory. Request and response shapes, pricing, idempotency, and error codes for the AskBiz vision recognition endpoint.',
  alternates: { canonical: URL },
  openGraph: { title: 'POST /api/v1/scan — AskBiz API', description: 'Vision recognition endpoint reference.', url: URL, type: 'article' },
}

const curl = `curl -X POST https://askbiz.co/api/v1/scan \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 5a9e2c1e-6b3f-4a2d-9c11-3f7e8a0b1c2d" \\
  -d '{
    "image": "<base64-encoded JPEG>"
  }'`

const js = `const res = await fetch('https://askbiz.co/api/v1/scan', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(), // safe to retry with the same key
  },
  body: JSON.stringify({ image: base64Jpeg }),
})

const result = await res.json()
if (result.found) {
  console.log(result.name, result.price)
}`

const python = `import requests
import uuid

res = requests.post(
    "https://askbiz.co/api/v1/scan",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": str(uuid.uuid4()),
    },
    json={"image": base64_jpeg},
)

result = res.json()
if result["found"]:
    print(result["name"], result["price"])`

const responseFound = `{
  "found": true,
  "inventory_id": "b1e2c3d4-...",
  "name": "Coca-Cola 500ml",
  "price": 80,
  "cost_price": 55,
  "stock_qty": 24,
  "unit": "bottle"
}`

const responseNotFound = `{
  "found": false,
  "inventory_id": null,
  "name": "Fanta Orange 300ml",
  "price": null,
  "stock_qty": null,
  "unit": null
}`

export default function ScanReferencePage() {
  return (
    <ArticleShell
      title="POST /api/v1/scan"
      description="Vision recognition — identify a product from a photo. Account-mode keys get results matched against the caller’s own AskBiz inventory; generic keys get raw identification only."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'API Reference', href: '/docs/api-reference' }, { name: 'scan', href: '/docs/api-reference/scan' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">POST</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">3¢ per successful call</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">x-api-key required</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">Idempotency-Key supported</span>
      </div>

      <h2>What it does</h2>
      <p>
        Sends a photo to the same Groq Llama-4-Scout vision pipeline that powers the AskBiz app&rsquo;s in-app product
        scanner. If your key is in <code>account</code> mode, the result is matched against your own AskBiz inventory —
        you get back a real <code>inventory_id</code>, stock level, and price. In <code>generic</code> mode (or when
        nothing matches), you still get a raw identification with no catalog lookup.
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
          <tr><td><code>image</code></td><td>string</td><td>Yes</td><td>Base64-encoded JPEG. No data URI prefix — raw base64 only.</td></tr>
          <tr><td><code>merchant_id</code></td><td>string</td><td>No</td><td>Scan on behalf of a connected merchant instead of your own account — requires an active <a href="/docs/guides/connect-to-a-merchant">connection</a> that grants the <code>read_inventory</code> scope.</td></tr>
        </tbody>
      </table>

      <h2>Response</h2>
      <p>When the photo matches an item in the resolved inventory (your own, or a connected merchant&rsquo;s):</p>
      <CodeTabs samples={[{ label: '200 — matched', lang: 'json', code: responseFound }]} />
      <p>When nothing matches, or the key has no catalog to match against:</p>
      <CodeTabs samples={[{ label: '200 — no match', lang: 'json', code: responseNotFound }]} />
      <p>
        If your balance drops below your account&rsquo;s low-balance threshold as a result of this call, the response
        also includes <code>low_balance_warning: true</code> and the new <code>balance_cents</code> — in-band, at the
        moment it happens, not just when you hit a 402.
      </p>

      <h2>Errors</h2>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>400</td><td>Invalid JSON body, or <code>image</code> missing.</td></tr>
          <tr><td>401</td><td>Missing or invalid <code>x-api-key</code>.</td></tr>
          <tr><td>402</td><td>Insufficient credits — response includes <code>required_cents</code>.</td></tr>
          <tr><td>403</td><td><code>merchant_id</code> given with no active connection, or the connection doesn&rsquo;t grant <code>read_inventory</code>.</td></tr>
          <tr><td>422</td><td>Vision model couldn&rsquo;t identify a product in the image.</td></tr>
          <tr><td>429</td><td>Rate limit or monthly quota exceeded — check the <code>X-RateLimit-Remaining</code> response header.</td></tr>
          <tr><td>502</td><td>Upstream vision recognition failed — safe to retry (with the same <code>Idempotency-Key</code> to avoid a double charge if the first call actually succeeded server-side after you gave up on it).</td></tr>
        </tbody>
      </table>
      <p>
        None of the 4xx/5xx responses above are billed — a failed or rejected call never debits your wallet. See{' '}
        <a href="/docs/guides/errors-and-retries">Errors and retries</a> for the full idempotency contract.
      </p>

      <FaqBlock
        heading="Scan endpoint FAQ"
        items={[
          {
            question: 'Do I get charged if the vision model can’t identify the product?',
            answer: 'No. Debiting only happens after recognition succeeds — a 422 (no product identified) or 502 (upstream failure) never costs you anything.',
          },
          {
            question: 'What image formats are supported?',
            answer: 'JPEG only, base64-encoded with no data URI prefix (send the raw base64 string, not "data:image/jpeg;base64,...").',
          },
          {
            question: 'Can I scan on behalf of a merchant who isn’t my own account?',
            answer: 'Yes, with an active connection to that merchant that grants the read_inventory scope — pass their user ID as merchant_id. See the guide on connecting to a merchant.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'POST /api/v1/scan — AskBiz API Reference',
        description: 'Vision recognition endpoint — identify a product from a photo and match it against a merchant’s inventory.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'API Reference', url: `${SITE}/docs/api-reference` },
          { name: 'scan', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
