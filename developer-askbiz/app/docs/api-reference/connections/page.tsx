import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/api-reference/connections`

export const metadata: Metadata = {
  title: 'POST + GET /api/v1/connections — Merchant connections — AskBiz API',
  description: 'Request permission to read a merchant’s AskBiz data. Create a connection, get a merchant consent link, and list connection status. Scopes, the consent screen, and error codes.',
  alternates: { canonical: URL },
  openGraph: { title: 'POST + GET /api/v1/connections — AskBiz API', description: 'Merchant connections endpoint reference.', url: URL, type: 'article' },
}

const postCurl = `curl -X POST https://askbiz.co/api/v1/connections \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_email": "owner@example-shop.com",
    "scopes": ["read_inventory"]
  }'`

const postJs = `const res = await fetch('https://askbiz.co/api/v1/connections', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    merchant_email: 'owner@example-shop.com',
    scopes: ['read_inventory'],
  }),
})

const { connection, confirmation_url } = await res.json()
// send confirmation_url to the merchant however you reach them — email, WhatsApp, SMS
console.log(connection.status) // "pending"`

const postPython = `import requests

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
print(data["confirmation_url"])`

const getCurl = `curl https://askbiz.co/api/v1/connections \\
  -H "x-api-key: abz_live_your_key_here"`

const getJs = `const res = await fetch('https://askbiz.co/api/v1/connections', {
  headers: { 'x-api-key': process.env.ASKBIZ_API_KEY },
})

const { connections } = await res.json()`

const getPython = `import requests

res = requests.get(
    "https://askbiz.co/api/v1/connections",
    headers={"x-api-key": ASKBIZ_API_KEY},
)

connections = res.json()["connections"]`

const postResponse = `{
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

const getResponse = `{
  "connections": [
    {
      "id": "c1a2b3c4-...",
      "merchant_email": "owner@example-shop.com",
      "merchant_user_id": "u7d8e9f0-...",
      "status": "approved",
      "scopes": ["read_inventory"],
      "created_at": "2026-07-10T09:00:00Z",
      "approved_at": "2026-07-10T09:12:00Z",
      "revoked_at": null
    },
    {
      "id": "d2b3c4d5-...",
      "merchant_email": "another-shop@example.com",
      "merchant_user_id": null,
      "status": "pending",
      "scopes": ["read_inventory"],
      "created_at": "2026-07-16T14:30:00Z",
      "approved_at": null,
      "revoked_at": null
    }
  ]
}`

export default function ConnectionsReferencePage() {
  return (
    <ArticleShell
      title="POST + GET /api/v1/connections"
      description="Request permission to read a merchant’s AskBiz data. You create the connection and get a link; the merchant approves it on their own consent screen."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'API Reference', href: '/docs/api-reference' }, { name: 'connections', href: '/docs/api-reference/connections' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">POST</span>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">GET</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">x-api-key required</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">Not credit-billed</span>
      </div>

      <h2>What it does</h2>
      <p>
        A connection is how your app gets permission to act on a specific AskBiz merchant&rsquo;s data instead of
        your own. You <code>POST</code> a merchant&rsquo;s email and the scopes you want; AskBiz creates a{' '}
        <code>pending</code> connection and hands you back a confirmation link. The merchant opens that link, signs
        in, and approves or declines on their own consent screen — nothing is granted until they do. <code>GET</code>{' '}
        lists the connections your key has created, so you can poll for status instead of guessing when a merchant
        acts.
      </p>
      <p>
        Neither <code>POST</code> nor <code>GET</code> on this endpoint is credit-billed. The only scope that exists
        today is <code>read_inventory</code>, which — once approved — lets your key pass that merchant&rsquo;s user
        ID as <code>merchant_id</code> on{' '}
        <a href="/docs/api-reference/scan">POST /api/v1/scan</a> to read their inventory instead of your own.
      </p>

      <h2>Request</h2>

      <h3>POST — create a connection</h3>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: postCurl },
          { label: 'JavaScript', lang: 'js', code: postJs },
          { label: 'Python', lang: 'python', code: postPython },
        ]}
      />

      <table>
        <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>merchant_email</code></td><td>string</td><td>Yes</td><td>Valid email address of the merchant you want to connect to.</td></tr>
          <tr><td><code>scopes</code></td><td>string[]</td><td>No</td><td>Permissions to request. <code>read_inventory</code> is the only scope that exists today. Omit this field to default to the full current scope set (today, just <code>[&quot;read_inventory&quot;]</code>) — this keeps integrations built before scopes existed working unchanged.</td></tr>
        </tbody>
      </table>

      <h3>GET — list your connections</h3>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: getCurl },
          { label: 'JavaScript', lang: 'js', code: getJs },
          { label: 'Python', lang: 'python', code: getPython },
        ]}
      />
      <p>No parameters. Returns every connection your key has created, most recent 200.</p>

      <h2>Scopes</h2>
      <p>
        A scope is a single, named permission a connection can grant. The only scope that exists today is{' '}
        <code>read_inventory</code>, which lets your key read the connected merchant&rsquo;s inventory via{' '}
        <code>merchant_id</code> on <a href="/docs/api-reference/scan">POST /api/v1/scan</a>. There is no scope yet
        for writing data, reading sales, or anything beyond inventory — don&rsquo;t request or expect one.
      </p>
      <p>
        If you omit <code>scopes</code> on the <code>POST</code> body, AskBiz requests the full current set on your
        behalf (today that&rsquo;s still just <code>read_inventory</code>). As more scopes are added in the future,
        this default will only ever apply to integrations that predate scopes — always pass <code>scopes</code>{' '}
        explicitly in new code so you request exactly what you need.
      </p>

      <h2>The merchant consent screen</h2>
      <p>
        This works the same way OAuth-style permission dialogs do on other platforms: you ask for a specific set of
        permissions, and the merchant sees and controls exactly what they&rsquo;re granting — you never get
        silent or implicit access.
      </p>
      <ul>
        <li>Your <code>POST</code> creates a <code>pending</code> connection and a confirmation link at <code>https://developer.askbiz.co/connect/&#123;token&#125;</code>, valid for 7 days (reflected in <code>expires_at</code>).</li>
        <li>The merchant opens the link and signs in to their own AskBiz account.</li>
        <li>They see a real consent screen listing exactly the scopes you requested — nothing vague, no bundled permissions.</li>
        <li>They can untick any scope before approving. This is narrowing only: they can grant less than you asked for, never more than you requested.</li>
        <li>They can decline entirely, leaving the connection unapproved.</li>
        <li>Once approved, <code>read_inventory</code> connections let you pass that merchant&rsquo;s ID as <code>merchant_id</code> on <code>POST /api/v1/scan</code>.</li>
      </ul>
      <p>
        Revocation is merchant-initiated only — they can revoke an approved connection from their own confirmation
        page at any time. There is no developer-initiated revoke endpoint today; if a merchant needs to be
        disconnected, ask them to revoke it from their side.
      </p>

      <h2>Response</h2>
      <p><code>POST</code> — <code>200</code>, connection created:</p>
      <CodeTabs samples={[{ label: '200 — POST success', lang: 'json', code: postResponse }]} />
      <p><code>GET</code> — <code>200</code>, most recent 200 connections:</p>
      <CodeTabs samples={[{ label: '200 — GET success', lang: 'json', code: getResponse }]} />

      <h2>Errors</h2>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>400</td><td>Invalid <code>merchant_email</code>, or <code>scopes</code> isn&rsquo;t a valid array of recognized scope names. (<code>POST</code> only.)</td></tr>
          <tr><td>401</td><td>Missing or invalid <code>x-api-key</code>.</td></tr>
          <tr><td>409</td><td>An active connection to that <code>merchant_email</code> already exists for this key. (<code>POST</code> only.)</td></tr>
        </tbody>
      </table>

      <FaqBlock
        heading="Connections endpoint FAQ"
        items={[
          {
            question: 'Can I revoke a connection myself, from my own server?',
            answer: 'No. There is no developer-initiated revoke endpoint today — only the merchant can revoke an approved connection, and they do it from their own confirmation page.',
          },
          {
            question: 'What happens if I don’t pass scopes on the POST body?',
            answer: 'It defaults to the full current scope set, which today is just ["read_inventory"]. This exists so integrations built before scopes were introduced keep working unchanged — new integrations should still pass scopes explicitly.',
          },
          {
            question: 'Can the merchant grant more access than I asked for?',
            answer: 'No. The consent screen only lets them untick scopes you requested — narrowing what they grant, never widening it beyond your original request.',
          },
          {
            question: 'How long is the confirmation link valid?',
            answer: 'Seven days from creation. The exact cutoff is returned as expires_at in the POST response.',
          },
          {
            question: 'What can I actually do once a connection is approved?',
            answer: 'With an approved read_inventory connection, pass the merchant’s ID as merchant_id on POST /api/v1/scan to read their inventory instead of your own account’s.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'POST + GET /api/v1/connections — AskBiz API Reference',
        description: 'Merchant connections endpoint — request permission to read a merchant’s AskBiz data via a consent link, and list connection status.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'API Reference', url: `${SITE}/docs/api-reference` },
          { name: 'connections', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
