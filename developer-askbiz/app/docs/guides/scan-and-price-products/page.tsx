import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/scan-and-price-products`

export const metadata: Metadata = {
  title: 'Scan and price a product from a photo — AskBiz API guide',
  description: 'A task-oriented walkthrough for turning a phone photo into a product name and price with POST /api/v1/scan — encoding the image, calling the endpoint, and handling matched vs unmatched results.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Scan and price a product from a photo — AskBiz API',
    description: 'From a JPEG to a name and price in one API call.',
    url: URL,
    type: 'article',
  },
}

const encodeJs = `import { readFile } from 'node:fs/promises'

const bytes = await readFile('./product-photo.jpg')
const base64Jpeg = bytes.toString('base64') // no data URI prefix`

const encodePython = `import base64

with open("product-photo.jpg", "rb") as f:
    base64_jpeg = base64.b64encode(f.read()).decode("utf-8")  # no data URI prefix`

const scanCurl = `curl -X POST https://askbiz.co/api/v1/scan \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 5a9e2c1e-6b3f-4a2d-9c11-3f7e8a0b1c2d" \\
  -d '{
    "image": "<base64-encoded JPEG>"
  }'`

const scanJs = `const res = await fetch('https://askbiz.co/api/v1/scan', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(), // safe to retry with the same key
  },
  body: JSON.stringify({ image: base64Jpeg }),
})

const result = await res.json()`

const scanPython = `import requests
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

result = res.json()`

const handleJs = `if (result.found) {
  // Real catalog match — show the merchant's own price and stock level
  console.log(\`\${result.name} — \${result.price} (\${result.stock_qty} in stock)\`)
} else {
  // Vision model identified something, but it's not in the resolved inventory —
  // fall back to a manual entry flow, pre-filled with result.name
  console.log(\`No catalog match for "\${result.name}" — prompting for manual price entry\`)
}`

const handlePython = `if result["found"]:
    # Real catalog match — show the merchant's own price and stock level
    print(f'{result["name"]} — {result["price"]} ({result["stock_qty"]} in stock)')
else:
    # Vision model identified something, but it's not in the resolved inventory —
    # fall back to a manual entry flow, pre-filled with result["name"]
    print(f'No catalog match for "{result["name"]}" — prompting for manual price entry')`

const merchantJs = `const res = await fetch('https://askbiz.co/api/v1/scan', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    image: base64Jpeg,
    merchant_id: connectedMerchantUserId, // requires an active read_inventory connection
  }),
})`

const merchantPython = `res = requests.post(
    "https://askbiz.co/api/v1/scan",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": str(uuid.uuid4()),
    },
    json={
        "image": base64_jpeg,
        "merchant_id": connected_merchant_user_id,  # requires an active read_inventory connection
    },
)`

const steps = [
  {
    name: 'Capture and base64-encode a JPEG',
    text: 'Take or receive the product photo as a JPEG and base64-encode it before sending — the endpoint expects the raw base64 string with no data URI prefix (don’t send "data:image/jpeg;base64,...", just the encoded bytes).',
    code: (
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: encodeJs },
          { label: 'Python', lang: 'python', code: encodePython },
        ]}
      />
    ),
  },
  {
    name: 'Call POST /api/v1/scan',
    text: 'Send the base64 image in the request body with your x-api-key. Include an Idempotency-Key so that if the request times out and you retry, you get back the exact original response instead of running (and potentially paying for) the vision call twice.',
    code: (
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: scanCurl },
          { label: 'JavaScript', lang: 'js', code: scanJs },
          { label: 'Python', lang: 'python', code: scanPython },
        ]}
      />
    ),
  },
  {
    name: 'Branch on found: true vs found: false',
    text: 'A response with found: true means the photo matched an item in the resolved inventory — you get a real inventory_id, price, cost_price, stock_qty, and unit back. A response with found: false still identified the product (name is populated) but nothing in the catalog matched — price, inventory_id, stock_qty, and unit come back null. Handle both: show the real price on a match, or fall back to a manual-entry flow pre-filled with the identified name when there isn’t one.',
    code: (
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: handleJs },
          { label: 'Python', lang: 'python', code: handlePython },
        ]}
      />
    ),
  },
  {
    name: 'Optional — scope the scan to a connected merchant',
    text: 'If you’re scanning on behalf of a merchant who isn’t your own AskBiz account, pass their user ID as merchant_id. This requires an active connection to that merchant that grants the read_inventory scope — set one up first with the connect-to-a-merchant guide. Without merchant_id, an account-mode key scans against its own inventory.',
    code: (
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: merchantJs },
          { label: 'Python', lang: 'python', code: merchantPython },
        ]}
      />
    ),
  },
]

export default function ScanAndPriceProductsGuide() {
  return (
    <ArticleShell
      title="Scan and price a product from a photo"
      description="You have a photo of a product and want its name and price back. This is the shortest path through POST /api/v1/scan: encode the image, call the endpoint, and handle a match or a miss."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Scan and price products', href: '/docs/guides/scan-and-price-products' },
      ]}
    >
      <p>
        <code>POST /api/v1/scan</code> takes a base64-encoded JPEG and returns a product identification. If your key
        is in <code>account</code> mode, that identification is matched against a real inventory — the caller&rsquo;s
        own, or a connected merchant&rsquo;s — and you get back an actual price and stock level, not just a label.
        The call costs 3&cent; and is only billed on a successful response; a failed or rejected call never debits
        your wallet.
      </p>

      <HowToSteps steps={steps} />

      <h2>What&rsquo;s next</h2>
      <p>
        For the full parameter and error reference, see{' '}
        <a href="/docs/api-reference/scan">POST /api/v1/scan</a>. To scope scans to a merchant who isn&rsquo;t your
        own account, set up a connection first with{' '}
        <a href="/docs/guides/connect-to-a-merchant">Connect to a merchant</a>. For the full idempotency contract and
        how retries interact with billing, see{' '}
        <a href="/docs/guides/errors-and-retries">Errors and retries</a>.
      </p>

      <FaqBlock
        heading="Scan and price products FAQ"
        items={[
          {
            question: 'What happens if the photo doesn’t match anything in the inventory?',
            answer: 'You get found: false with the vision model’s best identification in name, but inventory_id, price, stock_qty, and unit all come back null. You still get charged the 3¢ for the successful vision call — the miss is a valid, billed response, not an error. Use the identified name to pre-fill a manual entry flow.',
          },
          {
            question: 'Do I need to strip the "data:image/jpeg;base64," prefix before sending?',
            answer: 'Yes. The image field expects the raw base64 string only — no data URI prefix. If you’re capturing the photo from a browser <input type="file"> or canvas, strip everything before the comma in the resulting data URL before sending.',
          },
          {
            question: 'Why should I send an Idempotency-Key on every scan call?',
            answer: 'If a request times out on your end, you can’t tell whether the vision call actually ran server-side. Retrying with the same Idempotency-Key returns the original response instead of running the Groq vision pipeline again, so you never get double-charged or see two different results for one photo.',
          },
          {
            question: 'Can a generic-mode key match against a merchant’s inventory?',
            answer: 'No. Matching against a real inventory — your own or a connected merchant’s — requires an account-mode key. A generic-mode key still gets a raw product identification back, just with found: false and no catalog lookup, since there’s no account behind it to resolve inventory from.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Scan and price a product from a photo',
        description: 'Encode a product photo, call POST /api/v1/scan, and handle the found:true vs found:false response to get a real name and price.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Scan and price products', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
