import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/api-reference/ask`

export const metadata: Metadata = {
  title: 'POST /api/v1/ask — Grounded business intelligence Q&A — AskBiz API',
  description: 'Ask a plain-English business-intelligence question and get an answer grounded in real sales, stock, and margin data. Free within your plan quota. Request and response shapes, account-mode vs. generic-mode context, and error codes.',
  alternates: { canonical: URL },
  openGraph: { title: 'POST /api/v1/ask — AskBiz API', description: 'Grounded business-intelligence Q&A endpoint reference.', url: URL, type: 'article' },
}

const curl = `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Which of my products had the worst margin last month?"
  }'`

const js = `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'Which of my products had the worst margin last month?',
  }),
})

const result = await res.json()
console.log(result.answer)`

const python = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/ask",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
    },
    json={"question": "Which of my products had the worst margin last month?"},
)

result = res.json()
print(result["answer"])`

const curlGeneric = `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_generic_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Is a 22% gross margin healthy for this business?",
    "context": {
      "currency": "KES",
      "symbol": "KSh",
      "biz_type": "retail",
      "region": "Nairobi, Kenya",
      "revenue": 480000,
      "margin": 22,
      "top_products": ["Cooking oil 2L", "Maize flour 2kg", "Sugar 1kg"]
    }
  }'`

const jsGeneric = `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_GENERIC_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'Is a 22% gross margin healthy for this business?',
    context: {
      currency: 'KES',
      symbol: 'KSh',
      biz_type: 'retail',
      region: 'Nairobi, Kenya',
      revenue: 480000,
      margin: 22,
      top_products: ['Cooking oil 2L', 'Maize flour 2kg', 'Sugar 1kg'],
    },
  }),
})

const result = await res.json()
console.log(result.answer)`

const pythonGeneric = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/ask",
    headers={
        "x-api-key": ASKBIZ_GENERIC_KEY,
        "Content-Type": "application/json",
    },
    json={
        "question": "Is a 22% gross margin healthy for this business?",
        "context": {
            "currency": "KES",
            "symbol": "KSh",
            "biz_type": "retail",
            "region": "Nairobi, Kenya",
            "revenue": 480000,
            "margin": 22,
            "top_products": ["Cooking oil 2L", "Maize flour 2kg", "Sugar 1kg"],
        },
    },
)

result = res.json()
print(result["answer"])`

const response200 = `{
  "answer": "Fanta Orange 300ml had the worst margin last month at 11%, well below your 34% average. You sold 210 units at that margin, which cost you roughly KSh 9,800 in foregone profit compared to your average line.",
  "insight_header": "Fanta Orange 300ml is dragging your margin down",
  "verdict": "watch",
  "verdict_sentence": "One low-margin product is quietly eating into an otherwise healthy month.",
  "confidence": "high",
  "kpi_cards": [
    { "label": "Worst margin product", "value": "Fanta Orange 300ml" },
    { "label": "Margin", "value": "11%" }
  ],
  "chart": {
    "type": "bar",
    "labels": ["Fanta Orange 300ml", "Coca-Cola 500ml", "Sprite 500ml"],
    "values": [11, 34, 29],
    "label": "Margin %"
  },
  "table": null,
  "recommendations": [
    "Reprice Fanta Orange 300ml or renegotiate your supplier cost — it's the only line below 20% margin.",
    "Check whether the low margin is a pricing mistake or a deliberate loss-leader."
  ],
  "follow_up_questions": [
    "What was my average margin across all products last month?",
    "How much would repricing this item to 25% margin add to my monthly profit?"
  ],
  "meta": {
    "model": "askbiz-v1",
    "latency_ms": 1840,
    "requests_remaining": 87
  }
}`

export default function AskReferencePage() {
  return (
    <ArticleShell
      title="POST /api/v1/ask"
      description="Grounded business-intelligence Q&A — ask a plain-English question and get an answer backed by real sales, stock, and margin data. Free within your plan quota; no wallet debit."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'API Reference', href: '/docs/api-reference' }, { name: 'ask', href: '/docs/api-reference/ask' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-ink-800 text-signal-300">POST</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">Free within plan quota</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">x-api-key required</span>
      </div>

      <h2>What it does</h2>
      <p>
        Sends a plain-English business question to the same AI answer engine that powers the AskBiz app&rsquo;s
        chat interface, and gets back a structured, grounded answer — not just prose, but a verdict, KPI cards,
        an optional chart or table, and concrete recommendations. Unlike <a href="/docs/api-reference/scan">/scan</a>{' '}
        and <a href="/docs/api-reference/whatsapp-send">/whatsapp/send</a>, this endpoint is not credit-billed —
        it&rsquo;s free within your plan&rsquo;s monthly and per-minute quota, with no wallet debit either way.
      </p>

      <h2>Account mode vs. generic mode context</h2>
      <p>
        How the answer gets grounded depends on your key&rsquo;s mode. An <code>account</code>-mode key is tied to a
        real AskBiz business — for those keys, the endpoint automatically pulls the caller&rsquo;s own AskBiz
        profile (business type, currency, region) and the columns from their latest uploaded dataset to ground the
        answer. Any <code>context</code> you send is ignored for account-mode keys, since there&rsquo;s already a
        real account to read from.
      </p>
      <p>
        A <code>generic</code>-mode key has no AskBiz account behind it, so there&rsquo;s nothing to read
        automatically — you must supply <code>context</code> yourself for the answer to be grounded in anything
        beyond the question text. See{' '}
        <a href="/docs/guides/ask-business-questions">Ask business-intelligence questions</a> for a full walkthrough
        of both modes.
      </p>

      <h2>Request</h2>
      <p>Account-mode key — no context needed, the answer is grounded in the caller&rsquo;s own connected data:</p>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: curl },
          { label: 'JavaScript', lang: 'js', code: js },
          { label: 'Python', lang: 'python', code: python },
        ]}
      />
      <p>Generic-mode key — <code>context</code> supplied explicitly since there&rsquo;s no account to read from:</p>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: curlGeneric },
          { label: 'JavaScript', lang: 'js', code: jsGeneric },
          { label: 'Python', lang: 'python', code: pythonGeneric },
        ]}
      />

      <h3>Body parameters</h3>
      <table>
        <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>question</code></td><td>string</td><td>Yes</td><td>Max 2000 characters.</td></tr>
          <tr><td><code>context</code></td><td>object</td><td>No</td><td>Ignored for account-mode keys. For generic-mode keys, the only source of grounding data — see fields below.</td></tr>
          <tr><td><code>options</code></td><td>object</td><td>No</td><td><code>{'{ cfo_mode?: boolean, simulate_mode?: boolean }'}</code>.</td></tr>
        </tbody>
      </table>

      <h3><code>context</code> object fields</h3>
      <table>
        <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>currency</code></td><td>string</td><td>e.g. <code>"KES"</code>.</td></tr>
          <tr><td><code>symbol</code></td><td>string</td><td>e.g. <code>"KSh"</code>.</td></tr>
          <tr><td><code>biz_type</code></td><td>string</td><td>One of <code>retail</code>, <code>ecommerce</code>, <code>distributor</code>, <code>exporter</code>.</td></tr>
          <tr><td><code>region</code></td><td>string</td><td>Free text, e.g. <code>"Nairobi, Kenya"</code>.</td></tr>
          <tr><td><code>revenue</code></td><td>number</td><td>Recent period revenue, in the given currency&rsquo;s minor or major unit as you define it.</td></tr>
          <tr><td><code>margin</code></td><td>number</td><td>Gross margin as a percentage.</td></tr>
          <tr><td><code>top_products</code></td><td>string[]</td><td>Names of the business&rsquo;s top products.</td></tr>
          <tr><td><code>sector</code></td><td>string</td><td>Free text.</td></tr>
          <tr><td>(any other key)</td><td>any</td><td><code>context</code> accepts free-form additional key/value pairs beyond the fields above.</td></tr>
        </tbody>
      </table>

      <h2>Response</h2>
      <p>200 — every successful call returns the same shape, whether the key is account-mode or generic-mode:</p>
      <CodeTabs samples={[{ label: '200 — success', lang: 'json', code: response200 }]} />

      <h3>Response fields</h3>
      <table>
        <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>answer</code></td><td>string</td><td>Plain-English answer.</td></tr>
          <tr><td><code>insight_header</code></td><td>string | null</td><td>Short one-line summary of the finding, if the model produced one.</td></tr>
          <tr><td><code>verdict</code></td><td>'act' | 'watch' | 'problem' | null</td><td>At-a-glance severity for dashboards or alerting.</td></tr>
          <tr><td><code>verdict_sentence</code></td><td>string | null</td><td>One-sentence explanation of the verdict.</td></tr>
          <tr><td><code>confidence</code></td><td>'high' | 'medium' | 'low'</td><td>How well-grounded the answer is in the data actually available.</td></tr>
          <tr><td><code>kpi_cards</code></td><td>object[]</td><td>Small label/value pairs suitable for rendering as stat tiles.</td></tr>
          <tr><td><code>chart</code></td><td>object | null</td><td><code>{'{ type, labels, values, label }'}</code> when the answer is well suited to a chart, otherwise <code>null</code>.</td></tr>
          <tr><td><code>table</code></td><td>object | null</td><td><code>{'{ headers, rows }'}</code> when the answer is well suited to a table, otherwise <code>null</code>.</td></tr>
          <tr><td><code>recommendations</code></td><td>string[]</td><td>Concrete next actions.</td></tr>
          <tr><td><code>follow_up_questions</code></td><td>string[]</td><td>Suggested next questions to ask.</td></tr>
          <tr><td><code>meta.model</code></td><td>string</td><td>Always <code>"askbiz-v1"</code>.</td></tr>
          <tr><td><code>meta.latency_ms</code></td><td>number</td><td>Server-side processing time.</td></tr>
          <tr><td><code>meta.requests_remaining</code></td><td>number | 'unlimited'</td><td>Calls left in the current period under your plan&rsquo;s monthly quota.</td></tr>
        </tbody>
      </table>

      <h2>Errors</h2>
      <table>
        <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>400</td><td>Invalid JSON body, missing <code>question</code>, or <code>question</code> over 2000 characters.</td></tr>
          <tr><td>401</td><td>Missing or invalid <code>x-api-key</code>.</td></tr>
          <tr><td>403</td><td>Key is disabled — re-enable it from your dashboard settings.</td></tr>
          <tr><td>429</td><td>Monthly quota or per-minute rate limit exceeded.</td></tr>
          <tr><td>500</td><td>The underlying AI request failed — safe to retry.</td></tr>
        </tbody>
      </table>
      <p>
        Unlike <a href="/docs/api-reference/scan">/scan</a> and <a href="/docs/api-reference/whatsapp-send">/whatsapp/send</a>,
        this endpoint does not accept an <code>Idempotency-Key</code> header. Every call is treated
        as independent — retrying a 500 is safe since nothing is billed, but there&rsquo;s no dedupe against a
        repeated request. It does return <code>X-RateLimit-Limit</code> / <code>X-RateLimit-Remaining</code> response
        headers, same as every other endpoint. See <a href="/docs/guides/errors-and-retries">Errors and retries</a>{' '}
        for the full contract across endpoints that support idempotency.
      </p>

      <FaqBlock
        heading="Ask endpoint FAQ"
        items={[
          {
            question: 'Does calling /api/v1/ask cost anything?',
            answer: 'No. It’s free within your plan’s monthly and per-minute quota — there’s no per-call price and no wallet debit, unlike /scan (3¢) or /whatsapp/send (2¢).',
          },
          {
            question: 'Do I need to send context if I’m using an account-mode key?',
            answer: 'No — account-mode keys automatically pull the caller’s own AskBiz profile and latest dataset columns. Any context you send is ignored for account-mode keys.',
          },
          {
            question: 'What happens if I don’t send context with a generic-mode key?',
            answer: 'The question is still answered, but with nothing to ground it in beyond the question text itself — expect lower-confidence, more generic answers. Generic-mode keys have no connected account to read from automatically.',
          },
          {
            question: 'Can I retry a request safely if it times out?',
            answer: 'A 500 is safe to retry since nothing is billed either way. But /ask does not support an Idempotency-Key header, so a retry is a brand-new call — there’s no deduplication against the original attempt.',
          },
          {
            question: 'Does the response include rate-limit headers?',
            answer: 'Yes — every response includes X-RateLimit-Limit and X-RateLimit-Remaining for your per-minute quota, same as /scan and /whatsapp/send. The response body also includes meta.requests_remaining for your monthly quota.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'POST /api/v1/ask — AskBiz API Reference',
        description: 'Grounded business-intelligence Q&A endpoint — ask a plain-English question and get an answer backed by real sales, stock, and margin data, free within your plan quota.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'API Reference', url: `${SITE}/docs/api-reference` },
          { name: 'ask', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
