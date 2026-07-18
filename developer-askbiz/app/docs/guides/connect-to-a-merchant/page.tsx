import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/connect-to-a-merchant`

export const metadata: Metadata = {
  title: 'Connect to a merchant with scoped permissions — AskBiz API',
  description: 'Request read_inventory access to a specific merchant’s AskBiz account, send them a real consent link, and use the approved connection’s merchant ID on POST /api/v1/scan.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Connect to a merchant — AskBiz API',
    description: 'Scoped, merchant-approved access — the closest thing to an OAuth permission dialog in the AskBiz product.',
    url: URL,
    type: 'article',
  },
}

const createCurl = `curl -X POST https://askbiz.co/api/v1/connections \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_email": "owner@example-shop.com",
    "scopes": ["read_inventory"]
  }'`

const createJs = `const res = await fetch('https://askbiz.co/api/v1/connections', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    merchant_email: 'owner@example-shop.com',
    scopes: ['read_inventory'], // the only scope that exists today
  }),
})

const { connection, confirmation_url } = await res.json()
console.log(connection.status) // "pending"
console.log(confirmation_url)`

const createPython = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/connections",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
    },
    json={
        "merchant_email": "owner@example-shop.com",
        "scopes": ["read_inventory"],
    },
)

data = res.json()
print(data["connection"]["status"])  # "pending"
print(data["confirmation_url"])`

const createResponse = `{
  "connection": {
    "id": "c1a2b3c4-...",
    "merchant_email": "owner@example-shop.com",
    "status": "pending",
    "scopes": ["read_inventory"],
    "created_at": "2026-07-17T09:00:00Z",
    "expires_at": "2026-07-24T09:00:00Z"
  },
  "confirmation_url": "https://developer.askbiz.co/connect/8f2e1a9c-4b3d-4e5f-9a0b-1c2d3e4f5a6b"
}`

const pollCurl = `curl https://askbiz.co/api/v1/connections \\
  -H "x-api-key: abz_live_your_key_here"`

const pollJs = `const res = await fetch('https://askbiz.co/api/v1/connections', {
  headers: { 'x-api-key': process.env.ASKBIZ_API_KEY },
})

const { connections } = await res.json()
const connection = connections.find(c => c.merchant_email === 'owner@example-shop.com')

if (connection?.status === 'approved') {
  // ready — connection.merchant_user_id is what you'll pass as merchant_id
  console.log(connection.merchant_user_id, connection.scopes)
}`

const pollPython = `import requests

res = requests.get(
    "https://askbiz.co/api/v1/connections",
    headers={"x-api-key": ASKBIZ_API_KEY},
)

connections = res.json()["connections"]
connection = next((c for c in connections if c["merchant_email"] == "owner@example-shop.com"), None)

if connection and connection["status"] == "approved":
    # ready — connection["merchant_user_id"] is what you'll pass as merchant_id
    print(connection["merchant_user_id"], connection["scopes"])`

const pollResponse = `{
  "connections": [
    {
      "id": "c1a2b3c4-...",
      "merchant_email": "owner@example-shop.com",
      "merchant_user_id": "u7d8e9f0-...",
      "status": "approved",
      "scopes": ["read_inventory"],
      "created_at": "2026-07-17T09:00:00Z",
      "approved_at": "2026-07-17T09:14:00Z",
      "revoked_at": null
    }
  ]
}`

const scanCurl = `curl -X POST https://askbiz.co/api/v1/scan \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 5a9e2c1e-6b3f-4a2d-9c11-3f7e8a0b1c2d" \\
  -d '{
    "image": "<base64-encoded JPEG>",
    "merchant_id": "u7d8e9f0-..."
  }'`

const scanJs = `const res = await fetch('https://askbiz.co/api/v1/scan', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    image: base64Jpeg,
    merchant_id: connection.merchant_user_id, // from the approved connection
  }),
})

const result = await res.json()
if (result.found) {
  console.log(result.name, result.price, result.stock_qty)
}`

const scanPython = `import requests
import uuid

res = requests.post(
    "https://askbiz.co/api/v1/scan",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": str(uuid.uuid4()),
    },
    json={
        "image": base64_jpeg,
        "merchant_id": connection["merchant_user_id"],  # from the approved connection
    },
)

result = res.json()
if result["found"]:
    print(result["name"], result["price"], result["stock_qty"])`

const steps = [
  {
    name: 'Request a connection to the merchant',
    text: 'POST /api/v1/connections with the merchant’s email and the scopes you need. read_inventory is the only scope that exists today. This creates a pending connection and a confirmation link — nothing is granted yet.',
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
    name: 'Send the merchant their confirmation link',
    text: 'The response includes confirmation_url — a link to https://developer.askbiz.co/connect/{token} that’s valid for 7 days (see expires_at). Send it to the merchant however you already reach them: email, WhatsApp, SMS. There’s no in-band way to deliver it; that’s on you.',
    code: <CodeTabs samples={[{ label: '200 — connection created', lang: 'json', code: createResponse }]} />,
  },
  {
    name: 'The merchant reviews and approves on a real consent screen',
    text: 'They open the link, sign in to their own AskBiz account, and see exactly the scopes you requested — nothing vague, nothing bundled. They can untick any scope before approving (narrowing only, never granting more than you asked for), or decline entirely. This step happens entirely on their side — you don’t call anything for it.',
  },
  {
    name: 'Check GET /api/v1/connections for status: "approved"',
    text: 'There’s no webhook for connection status changes (webhooks only cover sale.created, purchase_order.received, and stock.low), so poll GET /api/v1/connections and match on merchant_email. Once status is "approved", the connection carries a merchant_user_id and the final scopes array — check scopes too, since the merchant may have approved fewer than you requested.',
    code: (
      <>
        <CodeTabs
          samples={[
            { label: 'cURL', lang: 'bash', code: pollCurl },
            { label: 'JavaScript', lang: 'js', code: pollJs },
            { label: 'Python', lang: 'python', code: pollPython },
          ]}
        />
        <p className="text-ink-300 text-sm leading-relaxed mt-3">An approved connection looks like this:</p>
        <CodeTabs samples={[{ label: '200 — approved', lang: 'json', code: pollResponse }]} />
      </>
    ),
  },
  {
    name: 'Use merchant_id on POST /api/v1/scan',
    text: 'Pass the connection’s merchant_user_id as merchant_id on a scan call. With an approved read_inventory connection, the scan is matched against that merchant’s live inventory instead of your own account’s — same endpoint, same pricing, same Idempotency-Key contract.',
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
]

export default function ConnectToMerchantGuide() {
  return (
    <ArticleShell
      title="Connect to a merchant’s account with scoped permissions"
      description="Request access to one merchant’s inventory, have them approve it on a real consent screen, and use the approved connection on your other API calls — AskBiz’s closest equivalent to an OAuth permission dialog."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Connect to a merchant', href: '/docs/guides/connect-to-a-merchant' },
      ]}
    >
      <p>
        A connection is how your app gets permission to act on a specific merchant&rsquo;s AskBiz data instead of
        your own account&rsquo;s. You request it with <code>POST /api/v1/connections</code>, the merchant approves
        or narrows it on their own consent screen, and once approved you pass their ID as{' '}
        <code>merchant_id</code> on <code>POST /api/v1/scan</code> to read their inventory. Neither creating nor
        listing connections is credit-billed.
      </p>

      <HowToSteps steps={steps} />

      <h2>Why scoped consent matters</h2>
      <p>
        This is the closest thing to an OAuth permission dialog in the AskBiz product, and it&rsquo;s worth building
        your integration around the same assumptions you&rsquo;d bring to any OAuth flow:
      </p>
      <ul>
        <li>You never get silent or implicit access — a connection stays <code>pending</code> until the merchant explicitly acts on it.</li>
        <li>The merchant sees exactly what you asked for. There&rsquo;s no bundling scopes together or hiding one behind another.</li>
        <li>Approval can only narrow your request, never widen it — if you ask for <code>read_inventory</code>, the merchant can grant that or nothing, never more than you requested.</li>
        <li>Revocation is merchant-initiated only. They can revoke an approved connection from their own confirmation page at any time; there&rsquo;s no developer-initiated revoke endpoint today. Design your integration to handle a connection disappearing without warning — re-check <code>status</code> rather than assuming a past approval still holds.</li>
        <li>If you already have an active connection to a given <code>merchant_email</code>, a second <code>POST</code> returns <code>409</code> instead of creating a duplicate — reuse the existing one via <code>GET</code> rather than retrying blindly.</li>
      </ul>

      <h2>What&rsquo;s next</h2>
      <p>
        Full parameter-by-parameter detail — including the <code>scopes</code> default behavior and every error
        code — is in the <a href="/docs/api-reference/connections">connections API reference</a>. For everything
        else the scan call can return once you&rsquo;re connected, see the{' '}
        <a href="/docs/api-reference/scan">scan API reference</a>.
      </p>

      <FaqBlock
        heading="Connect to a merchant FAQ"
        items={[
          {
            question: 'How do I know when the merchant has approved the connection?',
            answer: 'Poll GET /api/v1/connections and check status on the matching merchant_email. There’s no webhook for connection status — the three webhook event types are sale.created, purchase_order.received, and stock.low, none of which cover connections.',
          },
          {
            question: 'What if the merchant approves but unticks the scope I actually needed?',
            answer: 'Check the scopes array on the approved connection, not just status — it reflects what they actually granted, which can be narrower than what you requested. Today read_inventory is the only scope that exists, so a narrowed approval means they granted nothing.',
          },
          {
            question: 'What exact value do I pass as merchant_id on POST /api/v1/scan?',
            answer: 'The merchant_user_id field from the approved connection object returned by GET /api/v1/connections — not the merchant_email you originally requested with, and not the connection’s own id.',
          },
          {
            question: 'Can I connect to the same merchant twice?',
            answer: 'Not while an active connection to that merchant_email already exists for your key — POST /api/v1/connections returns 409. List your existing connections with GET first if you’re not sure whether one already exists.',
          },
          {
            question: 'Can I revoke a connection myself once I no longer need it?',
            answer: 'No. There’s no developer-initiated revoke endpoint today — only the merchant can revoke an approved connection, from their own confirmation page.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Connect to a merchant’s account with scoped permissions',
        description: 'Request access to a specific merchant’s inventory, have them approve it with a real consent screen, and use it on POST /api/v1/scan.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Connect to a merchant', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
