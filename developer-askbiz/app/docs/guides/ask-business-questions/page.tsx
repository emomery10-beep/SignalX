import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/ask-business-questions`

export const metadata: Metadata = {
  title: 'Ask business-intelligence questions — AskBiz API guide',
  description: 'A task-oriented walkthrough for POST /api/v1/ask — choosing account mode vs. generic mode, writing a specific question, optionally requesting CFO-style framing with options.cfo_mode, and reading the structured kpi_cards, chart, table, and recommendations fields instead of just the answer string.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Ask business-intelligence questions — AskBiz API',
    description: 'Get grounded, structured answers about sales, margin, and stock — not just a sentence.',
    url: URL,
    type: 'article',
  },
}

const accountCurl = `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Which of my top products should I reorder before the weekend rush?"
  }'`

const accountJs = `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'Which of my top products should I reorder before the weekend rush?',
  }),
})

const result = await res.json()`

const accountPython = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/ask",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
    },
    json={"question": "Which of my top products should I reorder before the weekend rush?"},
)

result = res.json()`

const genericCurl = `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_generic_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Which of my top products should I reorder before the weekend rush?",
    "context": {
      "currency": "KES",
      "symbol": "KSh",
      "biz_type": "retail",
      "region": "Nairobi, Kenya",
      "top_products": ["Rice 5kg", "Cooking oil 2L", "Maize flour 2kg"]
    }
  }'`

const genericJs = `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_GENERIC_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'Which of my top products should I reorder before the weekend rush?',
    context: {
      currency: 'KES',
      symbol: 'KSh',
      biz_type: 'retail',
      region: 'Nairobi, Kenya',
      top_products: ['Rice 5kg', 'Cooking oil 2L', 'Maize flour 2kg'],
    },
  }),
})

const result = await res.json()`

const genericPython = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/ask",
    headers={
        "x-api-key": ASKBIZ_GENERIC_KEY,
        "Content-Type": "application/json",
    },
    json={
        "question": "Which of my top products should I reorder before the weekend rush?",
        "context": {
            "currency": "KES",
            "symbol": "KSh",
            "biz_type": "retail",
            "region": "Nairobi, Kenya",
            "top_products": ["Rice 5kg", "Cooking oil 2L", "Maize flour 2kg"],
        },
    },
)

result = res.json()`

const cfoCurl = `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "If margins hold steady, what is my cash runway over the next 3 months?",
    "options": { "cfo_mode": true }
  }'`

const cfoJs = `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ASKBIZ_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'If margins hold steady, what is my cash runway over the next 3 months?',
    options: { cfo_mode: true },
  }),
})

const result = await res.json()`

const cfoPython = `import requests

res = requests.post(
    "https://askbiz.co/api/v1/ask",
    headers={
        "x-api-key": ASKBIZ_API_KEY,
        "Content-Type": "application/json",
    },
    json={
        "question": "If margins hold steady, what is my cash runway over the next 3 months?",
        "options": {"cfo_mode": True},
    },
)

result = res.json()`

const structuredResponse = `{
  "answer": "Rice 5kg and Cooking oil 2L are both below 2 days of cover at your current sales pace — reorder those two before the weekend. Your other top sellers have more than a week of stock left.",
  "insight_header": "Two top sellers are close to running out",
  "verdict": "act",
  "verdict_sentence": "Rice 5kg and Cooking oil 2L will likely stock out before your next scheduled delivery.",
  "confidence": "high",
  "kpi_cards": [
    { "label": "Products below 2 days cover", "value": "2" },
    { "label": "Fastest stockout", "value": "Rice 5kg — 1.2 days" }
  ],
  "chart": null,
  "table": {
    "headers": ["Product", "Stock qty", "Days of cover"],
    "rows": [
      ["Rice 5kg", 9, "1.2"],
      ["Cooking oil 2L", 14, "1.8"],
      ["Maize flour 2kg", 62, "9.4"]
    ]
  },
  "recommendations": [
    "Reorder Rice 5kg and Cooking oil 2L today — both are projected to stock out before your next delivery window.",
    "Maize flour 2kg has enough cover to wait until your next scheduled order."
  ],
  "follow_up_questions": [
    "How much should I reorder of Rice 5kg to cover the next two weeks?",
    "Which supplier gives me the best price on Cooking oil 2L?"
  ],
  "meta": {
    "model": "askbiz-v1",
    "latency_ms": 1610,
    "requests_remaining": 412
  }
}`

const readResponseJs = `if (result.kpi_cards?.length) renderStatTiles(result.kpi_cards)
if (result.chart) renderChart(result.chart)       // null when the answer doesn't suit a chart
if (result.table) renderTable(result.table)       // null when the answer doesn't suit a table
if (result.recommendations?.length) renderActionList(result.recommendations)

// result.answer is still there for a plain-text fallback or a chat transcript
console.log(result.answer)`

const readResponsePython = `if result.get("kpi_cards"):
    render_stat_tiles(result["kpi_cards"])
if result.get("chart"):
    render_chart(result["chart"])      # null when the answer doesn't suit a chart
if result.get("table"):
    render_table(result["table"])      # null when the answer doesn't suit a table
if result.get("recommendations"):
    render_action_list(result["recommendations"])

# result["answer"] is still there for a plain-text fallback or a chat transcript
print(result["answer"])`

const steps = [
  {
    name: 'Decide account mode vs. generic mode',
    text: 'Check which mode your API key is in before you write any context — it determines whether /api/v1/ask has anything to ground the answer in besides the question text. An account-mode key is tied to a real AskBiz business: the endpoint automatically pulls that business’s profile (currency, biz_type, region) and the columns from its latest uploaded dataset, and any context you send is ignored. A generic-mode key has no connected account, so context is the only source of grounding data — without it, the model has nothing but the question text to work with.',
  },
  {
    name: 'Craft a specific question and call the endpoint',
    text: 'Send the question in the required question field (max 2000 characters) with your x-api-key. Ask about a specific metric, product, or time window — a vague "How’s my business doing?" gets a vague answer back. Account mode needs nothing else in the body:',
    code: (
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: accountCurl },
          { label: 'JavaScript', lang: 'js', code: accountJs },
          { label: 'Python', lang: 'python', code: accountPython },
        ]}
      />
    ),
  },
  {
    name: 'Optional — request CFO-style framing with options.cfo_mode',
    text: 'Add options: { cfo_mode: true } to the same request body when you want the answer framed the way a financial controller would think about it, rather than a plain operational answer. It doesn’t change which fields come back — you still get the same answer, kpi_cards, chart, table, and recommendations shape, just different framing in the text fields. options also accepts a separate simulate_mode boolean; see the ask reference for the full options object.',
    code: (
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: cfoCurl },
          { label: 'JavaScript', lang: 'js', code: cfoJs },
          { label: 'Python', lang: 'python', code: cfoPython },
        ]}
      />
    ),
  },
  {
    name: 'Read the structured response, not just answer',
    text: 'Every successful call returns the same shape regardless of mode or options. kpi_cards are ready to render as stat tiles, chart and table are pre-shaped for a charting library or a data grid (each is null when the model didn’t judge the answer suited to that format), and recommendations gives concrete next actions without parsing prose. answer is still there for a plain-text fallback, but treat it as the least structured field, not the primary one:',
    code: (
      <>
        <CodeTabs samples={[{ label: '200 — success', lang: 'json', code: structuredResponse }]} />
        <CodeTabs
          samples={[
            { label: 'JavaScript', lang: 'js', code: readResponseJs },
            { label: 'Python', lang: 'python', code: readResponsePython },
          ]}
        />
      </>
    ),
  },
]

export default function AskBusinessQuestionsGuide() {
  return (
    <ArticleShell
      title="Ask business-intelligence questions"
      description="You want a plain-English answer about sales, margin, or stock — grounded in real numbers, not a generic chatbot reply. This is the shortest path through POST /api/v1/ask: pick your grounding source, ask something specific, and read the structured fields the endpoint gives you back."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Ask business questions', href: '/docs/guides/ask-business-questions' },
      ]}
    >
      <p>
        <code>POST /api/v1/ask</code> takes a question and returns a grounded, structured answer — not just prose,
        but a verdict, KPI cards, an optional chart or table, and concrete recommendations. It is not credit-billed:
        it&rsquo;s free within your plan&rsquo;s monthly and per-minute quota, with no wallet debit either way,
        regardless of mode or options.
      </p>

      <HowToSteps steps={steps} />

      <h2>Generic mode — passing your own context</h2>
      <p>
        If your key is in <code>generic</code> mode, there&rsquo;s no connected AskBiz account for the endpoint to
        read from, so add a <code>context</code> object with whatever fields are relevant to the question —{' '}
        <code>currency</code>, <code>symbol</code>, <code>biz_type</code>, <code>region</code>, <code>revenue</code>,{' '}
        <code>margin</code>, <code>top_products</code>, <code>sector</code>, or any other free-form key/value pairs.
        The same question from step 2, grounded with explicit context instead of a connected account:
      </p>
      <CodeTabs
        samples={[
          { label: 'cURL', lang: 'bash', code: genericCurl },
          { label: 'JavaScript', lang: 'js', code: genericJs },
          { label: 'Python', lang: 'python', code: genericPython },
        ]}
      />

      <h2>What&rsquo;s next</h2>
      <p>
        For the full parameter table, response field reference, and error codes, see{' '}
        <a href="/docs/api-reference/ask">POST /api/v1/ask</a>. Note that unlike{' '}
        <a href="/docs/api-reference/scan">/scan</a> and <a href="/docs/api-reference/whatsapp-send">/whatsapp/send</a>,{' '}
        <code>/ask</code> doesn&rsquo;t accept an <code>Idempotency-Key</code> header — a 500 is still safe to retry
        since nothing is ever billed, but each retry is a brand-new call. See{' '}
        <a href="/docs/guides/errors-and-retries">Errors and retries</a> for the full contract across endpoints that
        do support idempotency.
      </p>

      <FaqBlock
        heading="Ask business questions FAQ"
        items={[
          {
            question: 'Why did I get a lower-confidence answer even though I sent context?',
            answer: 'confidence reflects how much grounded data the model actually had to work with. An account-mode key reading a full connected dataset typically grounds better than a generic-mode key with a handful of context fields, and a vague question grounds worse than a specific one regardless of mode — those are the levers to check first.',
          },
          {
            question: 'Does options.cfo_mode change which fields come back in the response?',
            answer: 'No. The response shape is identical either way — answer, insight_header, verdict, kpi_cards, chart, table, recommendations, and meta all still come back. cfo_mode only changes how the answer and insight_header are framed, not what fields exist.',
          },
          {
            question: 'Should I parse the answer string or read kpi_cards and table directly?',
            answer: 'Read the structured fields for anything you’re rendering in a UI — kpi_cards and table already give you the same data as discrete values, so you’re not extracting numbers out of a sentence. Check chart and table for null before rendering, since either can be null when the model didn’t judge the answer suited to that format.',
          },
          {
            question: 'Does asking a CFO-style question with cfo_mode cost more?',
            answer: 'No. /api/v1/ask isn’t credit-billed at all, with or without options — it’s free within your plan’s monthly and per-minute quota either way, unlike /scan (3¢) or /whatsapp/send (2¢) per successful call.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Ask business-intelligence questions',
        description: 'Choose account mode or generic mode, ask a specific question, optionally request CFO-style framing with options.cfo_mode, and read the structured kpi_cards, chart, table, and recommendations fields from POST /api/v1/ask.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Ask business questions', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
