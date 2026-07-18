import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/quickstart`

export const metadata: Metadata = {
  title: 'Quickstart — get an API key and make your first call — AskBiz API',
  description: 'Create an AskBiz developer account, generate an API key, and call POST /api/v1/ask for free within your monthly quota — a complete copy-pasteable curl example.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Quickstart — AskBiz API',
    description: 'From zero to your first successful API call in five steps.',
    url: URL,
    type: 'article',
  },
}

const askCurl = `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What were my best-selling products last week?"
  }'`

const askResponse = `{
  "answer": "Your top seller last week was Coca-Cola 500ml, with 142 units sold...",
  "insight_header": "Coca-Cola 500ml led sales",
  "verdict": "watch",
  "verdict_sentence": "Strong demand, but stock is running low.",
  "confidence": "high",
  "kpi_cards": [],
  "chart": null,
  "table": null,
  "recommendations": [
    "Reorder Coca-Cola 500ml before the weekend rush"
  ],
  "follow_up_questions": [
    "How does this compare to the week before?"
  ],
  "meta": {
    "model": "askbiz-v1",
    "latency_ms": 840,
    "requests_remaining": 97
  }
}`

const steps = [
  {
    name: 'Create an account and sign in',
    text: 'Go to developer.askbiz.co/dashboard and sign in (or sign up if you’re new). This is the same account you’ll use to generate keys, inspect usage, and manage webhooks.',
  },
  {
    name: 'Create an API key',
    text: 'Open the Keys page in the dashboard and create a key. You’ll choose a mode: an account-mode key is tied to your own AskBiz business and automatically reads your real profile, currency, and uploaded data — use this if you’re building on your own AskBiz account. A generic-mode key has no AskBiz account behind it, so you supply all context yourself in each request — use this if you’re integrating AskBiz into someone else’s product. Copy the key now; treat it like a password.',
  },
  {
    name: 'Make your first call',
    text: 'POST /api/v1/ask is the lowest-friction endpoint to start with — it’s free within your monthly plan quota, no wallet debit involved. Send your key in the x-api-key header and a question in the body.',
    code: (
      <>
        <CodeTabs
          samples={[
            { label: 'cURL', lang: 'bash', code: askCurl },
            {
              label: 'JavaScript',
              lang: 'js',
              code: `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'What were my best-selling products last week?',
  }),
})

const result = await res.json()
console.log(result.answer)`,
            },
            {
              label: 'Python',
              lang: 'python',
              code: `import requests

res = requests.post(
    "https://askbiz.co/api/v1/ask",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
    },
    json={"question": "What were my best-selling products last week?"},
)

result = res.json()
print(result["answer"])`,
            },
          ]}
        />
        <p className="text-ink-300 text-sm leading-relaxed mt-3">A successful response looks like this:</p>
        <CodeTabs samples={[{ label: '200 — success', lang: 'json', code: askResponse }]} />
      </>
    ),
  },
  {
    name: 'Check your usage and spend',
    text: 'Open the Usage page in the dashboard to see calls made, your remaining monthly quota, and any wallet spend from billed endpoints like /api/v1/scan and /api/v1/whatsapp/send. /api/v1/ask calls count against your quota but never debit your wallet.',
  },
  {
    name: 'Explore the full API and guides',
    text: 'Once your first call works, browse the API Reference for every endpoint’s full request/response shape and error codes, or jump into a task-oriented Guide — scanning products, sending WhatsApp messages, connecting to a merchant, billing on behalf of a merchant, and webhooks.',
  },
]

export default function QuickstartPage() {
  return (
    <ArticleShell
      title="Quickstart"
      description="From zero to your first successful AskBiz API call in five steps — create a key, call /api/v1/ask, and see what comes back."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Quickstart', href: '/docs/quickstart' }]}
    >
      <p>
        You need an AskBiz developer account and one API key to make your first call. The fastest endpoint to start
        with is <code>POST /api/v1/ask</code> — it’s free within your monthly plan quota (no wallet debit), so you
        can test your integration before any billed endpoint is involved.
      </p>

      <HowToSteps steps={steps} />

      <h2>What&rsquo;s next</h2>
      <p>
        For endpoints that do cost money — <a href="/docs/api-reference/scan">scan</a> (3&cent; per successful call)
        and <a href="/docs/api-reference/whatsapp-send">whatsapp/send</a> (2&cent; per successful send) — read{' '}
        <a href="/docs/guides/errors-and-retries">Errors and retries</a> first so you understand how{' '}
        <code>Idempotency-Key</code> keeps a network retry from double-charging you. Check{' '}
        <a href="/docs/api-reference/pricing">GET /api/v1/pricing</a> any time — it’s public, no key required.
      </p>

      <FaqBlock
        heading="Quickstart FAQ"
        items={[
          {
            question: 'Do I need a credit card to get an API key?',
            answer: 'No. Creating an account and generating a key doesn’t require a card. POST /api/v1/ask is free within your monthly plan quota, so you can integrate and test without any billing setup. A card only matters once you call billed endpoints like /api/v1/scan or /api/v1/whatsapp/send and need wallet credit.',
          },
          {
            question: 'What’s the difference between account mode and generic mode?',
            answer: 'An account-mode key is tied to your own AskBiz business — it automatically pulls your real profile (business type, currency, region) and your latest uploaded data, so you don’t need to pass a "context" object to /api/v1/ask. A generic-mode key has no AskBiz account behind it, so you must supply "context" yourself in each request. Generic mode also can’t call /api/v1/whatsapp/send, which requires account mode.',
          },
          {
            question: 'Why does my first /api/v1/ask call not show a wallet charge on the Usage page?',
            answer: '/api/v1/ask isn’t credit-billed — it’s covered by your monthly plan quota instead. You’ll see it counted against your request quota on the Usage page, but no cents are debited from your wallet for it.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Get started with the AskBiz API',
        description: 'Create an AskBiz developer account, generate an API key, and make your first call to POST /api/v1/ask.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Quickstart', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
