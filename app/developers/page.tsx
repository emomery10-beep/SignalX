'use client'
import { useState } from 'react'
import Link from 'next/link'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const EV  = '#f3f2ef'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B   = 'rgba(0,0,0,.08)'

const CODE = {
  curl: `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What is my best selling product?",
    "context": {
      "currency": "GBP",
      "symbol": "£",
      "biz_type": "ecommerce",
      "revenue": 18400,
      "margin": 34,
      "top_products": ["Trainers", "Hoodies", "Caps"]
    }
  }'`,

  js: `const res = await fetch('https://askbiz.co/api/v1/ask', {
  method: 'POST',
  headers: {
    'x-api-key': 'abz_live_your_key_here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'What is my best selling product?',
    context: {
      currency: 'GBP', symbol: '£',
      biz_type: 'ecommerce',
      revenue: 18400, margin: 34,
      top_products: ['Trainers', 'Hoodies', 'Caps'],
    },
  }),
})
const data = await res.json()
console.log(data.answer)
console.log(data.verdict)          // 'act' | 'watch' | 'problem'
console.log(data.kpi_cards)        // array of metric cards
console.log(data.recommendations)  // array of action strings`,

  python: `import requests

res = requests.post(
    'https://askbiz.co/api/v1/ask',
    headers={
        'x-api-key': 'abz_live_your_key_here',
        'Content-Type': 'application/json',
    },
    json={
        'question': 'What is my best selling product?',
        'context': {
            'currency': 'GBP', 'symbol': '£',
            'biz_type': 'ecommerce',
            'revenue': 18400, 'margin': 34,
            'top_products': ['Trainers', 'Hoodies', 'Caps'],
        },
    }
)
data = res.json()
print(data['answer'])
print(data['verdict'])`,

  response: `{
  "answer": "Your best seller is Trainers at an estimated £8,200 this month. With a 34% margin that is roughly £2,788 in gross profit.",
  "insight_header": "Trainers driving 45% of revenue — margin healthy",
  "verdict": "act",
  "verdict_sentence": "Prioritise Trainers restocking — highest margin, highest volume.",
  "confidence": "high",
  "kpi_cards": [
    { "label": "Est. Trainers revenue", "value": "£8,200", "trend": "up", "status": "good" },
    { "label": "Gross margin", "value": "34%", "trend": "neutral", "status": "good" }
  ],
  "chart": {
    "type": "bar",
    "labels": ["Trainers", "Hoodies", "Caps"],
    "values": [8200, 6100, 4100],
    "label": "Estimated revenue by product"
  },
  "recommendations": [
    "Prioritise Trainers in your next restock order",
    "Consider a bundle with Hoodies — frequently bought together",
    "Review Caps cost vs selling price"
  ],
  "follow_up_questions": [
    "What is my margin on Trainers specifically?",
    "Should I expand the Trainers range?"
  ],
  "meta": {
    "model": "askbiz-v1",
    "latency_ms": 1240,
    "requests_remaining": 97
  }
}`,
}

const NAV = [
  { id: 'overview',       label: 'Overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'endpoint',       label: 'Endpoint' },
  { id: 'request',        label: 'Request format' },
  { id: 'response',       label: 'Response format' },
  { id: 'examples',       label: 'Code examples' },
  { id: 'errors',         label: 'Errors' },
  { id: 'pricing',        label: 'Pricing' },
]

const PLANS = [
  { name: 'Free',       price: '£0/mo',  req: '100',       rpm: '5',   col: TX3,       bg: EV },
  { name: 'Starter',    price: '£29/mo', req: '2,000',     rpm: '20',  col: ACC,       bg: 'rgba(208,138,89,.1)' },
  { name: 'Growth',     price: '£99/mo', req: '10,000',    rpm: '60',  col: '#16a34a', bg: 'rgba(34,197,94,.1)' },
  { name: 'Enterprise', price: 'Custom', req: 'Unlimited', rpm: '120', col: '#8c6fe0', bg: 'rgba(140,111,224,.1)' },
]

const ERRORS = [
  { code: '400', title: 'Bad Request',           desc: 'Missing or invalid "question" field, or malformed JSON' },
  { code: '401', title: 'Unauthorized',          desc: 'Missing or invalid x-api-key header' },
  { code: '403', title: 'Forbidden',             desc: 'API key is disabled — re-enable in Settings' },
  { code: '429', title: 'Rate Limit Exceeded',   desc: 'Monthly or per-minute limit reached' },
  { code: '500', title: 'Internal Server Error', desc: 'AI request failed — retry with exponential backoff' },
]

const FEATURES = [
  { icon: '⚡', title: 'Single endpoint',   desc: 'One POST request for all intelligence' },
  { icon: '🧠', title: 'Claude-powered',    desc: 'Business intelligence grounded in your data' },
  { icon: '📊', title: 'Structured output', desc: 'JSON with charts, KPIs, verdicts' },
  { icon: '🔒', title: 'Secure by default', desc: 'API key auth, HTTPS only, CORS enabled' },
]

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: TX3, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>{lang}</span>
        <button onClick={copy} style={{ fontSize: 11, fontWeight: 600, color: copied ? '#16a34a' : ACC, background: 'transparent', border: `1px solid ${copied ? 'rgba(34,197,94,.3)' : 'rgba(208,138,89,.3)'}`, borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit', minHeight: 'auto', transition: 'all 150ms' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1916', borderRadius: 12, padding: '16px 18px', overflowX: 'auto', fontSize: 12, lineHeight: 1.7, color: '#e8e6e0', fontFamily: 'JetBrains Mono, Consolas, monospace', margin: 0, border: '1px solid rgba(255,255,255,.06)' }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Field({ name, type, required, description, indent }: { name: string; type: string; required?: boolean; description: string; indent?: boolean }) {
  return (
    <div style={{ padding: '11px 0', borderBottom: `1px solid ${B}`, paddingLeft: indent ? 16 : 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' as const }}>
        <code style={{ fontSize: 13, fontWeight: 600, color: TX, fontFamily: 'monospace' }}>{name}</code>
        <span style={{ fontSize: 11, color: TX3, background: EV, padding: '1px 7px', borderRadius: 9999 }}>{type}</span>
        {required && <span style={{ fontSize: 11, color: '#dc2626', background: 'rgba(220,38,38,.07)', padding: '1px 7px', borderRadius: 9999, fontWeight: 600 }}>required</span>}
      </div>
      <div style={{ fontSize: 13, color: TX2, lineHeight: 1.6 }}>{description}</div>
    </div>
  )
}

function SectionHead({ title }: { title: string }) {
  return (
    <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 600, color: TX, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${B}` }}>
      {title}
    </h2>
  )
}

export default function DevelopersPage() {
  return (
    <>
      <style>{`
        body::before { display: none !important; }
        body { background: #f9f8f6 !important; }
        .main-content { margin-left: 0 !important; padding-top: 0 !important; padding-bottom: 0 !important; }
        .dev-page { min-height: 100vh; background: #f9f8f6; font-family: DM Sans, sans-serif; color: #1a1916; }
        .dev-topbar { background: #ffffff; border-bottom: 1px solid rgba(0,0,0,.08); padding: 14px 48px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 0 rgba(0,0,0,.06); }
        .dev-grid { max-width: 1100px; margin: 0 auto; padding: 48px 48px 80px 48px; display: grid; grid-template-columns: 160px 1fr; gap: 40px; align-items: start; }
        .dev-nav { position: sticky; top: 72px; }
        .dev-nav a { display: block; font-size: 13px; color: #6b6760; text-decoration: none; padding: 5px 0; line-height: 1.5; transition: color 150ms; }
        .dev-nav a:hover { color: #d08a59; }
        .dev-section { margin-bottom: 52px; }
        .dev-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
        .dev-plan-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        @media (max-width: 640px) {
          .dev-grid { grid-template-columns: 1fr; padding: 24px 16px 60px; }
          .dev-nav { display: none; }
          .dev-feature-grid { grid-template-columns: 1fr; }
          .dev-plan-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dev-page">
        <div className="dev-topbar">
          <Link href="/" style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: TX, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
                <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            AskBiz
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: TX3, background: EV, padding: '3px 10px', borderRadius: 9999, fontWeight: 500 }}>API v1</span>
            <Link href="/settings" style={{ fontSize: 13, fontWeight: 600, color: ACC, textDecoration: 'none' }}>Get API key →</Link>
          </div>
        </div>

        <div className="dev-grid">
          <nav className="dev-nav">
            <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>On this page</div>
            {NAV.map(item => (
              <a key={item.id} href={`#${item.id}`}>{item.label}</a>
            ))}
          </nav>

          <main>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Developer documentation</div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 36, fontWeight: 700, color: TX, letterSpacing: '-.03em', marginBottom: 14, lineHeight: 1.15 }}>AskBiz API</h1>
              <p style={{ fontSize: 15, color: TX2, lineHeight: 1.75, marginBottom: 24, maxWidth: 560 }}>
                Embed business intelligence into your own products with a single API call. Send a question and business context — get back a structured answer with verdict, KPI cards, charts, and recommendations.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/settings" style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 22px', background: ACC, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 10px rgba(208,138,89,.35)', minHeight: 'auto' }}>
                  Get your API key →
                </Link>
                <a href="#examples" style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 20px', background: SF, color: TX, borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: `1px solid ${B}`, minHeight: 'auto' }}>
                  See examples
                </a>
              </div>
            </div>

            <div className="dev-section" id="overview">
              <SectionHead title="Overview"/>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 16 }}>
                One endpoint: <code style={{ fontSize: 13, background: EV, padding: '2px 7px', borderRadius: 5, fontFamily: 'monospace' }}>POST /api/v1/ask</code>. Send a natural language question and business context. Get back structured JSON.
              </p>
              <div className="dev-feature-grid">
                {FEATURES.map((f, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: SF, border: `1px solid ${B}`, borderRadius: 12 }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TX, marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: TX3 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dev-section" id="authentication">
              <SectionHead title="Authentication"/>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 16 }}>
                All requests require an <code style={{ fontSize: 13, background: EV, padding: '2px 7px', borderRadius: 5, fontFamily: 'monospace' }}>x-api-key</code> header. Get your key from <Link href="/settings" style={{ color: ACC, textDecoration: 'none' }}>Settings → API Keys</Link>.
              </p>
              <CodeBlock lang="HTTP header" code="x-api-key: abz_live_your_key_here"/>
              <div style={{ padding: '12px 14px', background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 10, fontSize: 13, color: TX2, lineHeight: 1.6 }}>
                <strong style={{ color: TX }}>Keep your key secret.</strong> Never expose it in client-side code or public repos. Revoke compromised keys from Settings immediately.
              </div>
            </div>

            <div className="dev-section" id="endpoint">
              <SectionHead title="Endpoint"/>
              <div style={{ background: '#1a1916', borderRadius: 10, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: ACC, background: 'rgba(208,138,89,.15)', padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace' }}>POST</span>
                <code style={{ fontSize: 13, color: '#e8e6e0', fontFamily: 'monospace' }}>https://askbiz.co/api/v1/ask</code>
              </div>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7 }}>Accepts JSON. Returns JSON. CORS is enabled — callable from browser or server.</p>
            </div>

            <div className="dev-section" id="request">
              <SectionHead title="Request format"/>
              <Field name="question" type="string" required description="Plain English business question. Max 2,000 characters."/>
              <Field name="context" type="object" description="Business data to ground the answer. All fields optional."/>
              <div style={{ paddingLeft: 16, borderLeft: '2px solid rgba(208,138,89,.2)', margin: '4px 0 8px' }}>
                <Field name="context.currency"     type="string"   description="ISO currency code. Default: 'GBP'" indent/>
                <Field name="context.symbol"       type="string"   description="Currency symbol. Default: '£'" indent/>
                <Field name="context.biz_type"     type="string"   description="'retail' | 'ecommerce' | 'distributor' | 'exporter'" indent/>
                <Field name="context.region"       type="string"   description="Country code e.g. 'GB', 'US', 'NG'" indent/>
                <Field name="context.revenue"      type="number"   description="Monthly revenue in your currency" indent/>
                <Field name="context.margin"       type="number"   description="Average gross margin as a percentage" indent/>
                <Field name="context.top_products" type="string[]" description="Array of your top product names" indent/>
                <Field name="context.*"            type="any"      description="Any additional fields — Claude will use them" indent/>
              </div>
              <Field name="options.cfo_mode"      type="boolean" description="Board-ready financial language. Default: false"/>
              <Field name="options.simulate_mode" type="boolean" description="Model before/after impact of a what-if scenario. Default: false"/>
            </div>

            <div className="dev-section" id="response">
              <SectionHead title="Response format"/>
              <Field name="answer"                 type="string"            description="Plain-English answer. 2–5 sentences."/>
              <Field name="insight_header"          type="string"            description="One-sentence summary. Good for card headers."/>
              <Field name="verdict"                 type="act|watch|problem" description="act = do something now · watch = monitor · problem = urgent"/>
              <Field name="verdict_sentence"        type="string"            description="One sentence. One action. Max 20 words."/>
              <Field name="confidence"              type="high|medium|low"   description="AI confidence based on context provided."/>
              <Field name="kpi_cards"               type="array"             description="Array of {label, value, trend, status} objects."/>
              <Field name="chart"                   type="object|null"       description="{type, labels, values, label} or null."/>
              <Field name="recommendations"         type="string[]"          description="3–5 specific actions with numbers."/>
              <Field name="follow_up_questions"     type="string[]"          description="Suggested follow-up questions."/>
              <Field name="meta.latency_ms"         type="number"            description="Processing time in milliseconds."/>
              <Field name="meta.requests_remaining" type="number"            description="Requests left this month on your plan."/>
            </div>

            <div className="dev-section" id="examples">
              <SectionHead title="Code examples"/>
              <CodeBlock lang="cURL" code={CODE.curl}/>
              <CodeBlock lang="JavaScript / TypeScript" code={CODE.js}/>
              <CodeBlock lang="Python" code={CODE.python}/>
              <CodeBlock lang="Example response" code={CODE.response}/>
            </div>

            <div className="dev-section" id="errors">
              <SectionHead title="Errors"/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ERRORS.map(e => (
                  <div key={e.code} style={{ display: 'flex', gap: 14, padding: '12px 14px', background: SF, border: `1px solid ${B}`, borderRadius: 10, alignItems: 'flex-start' }}>
                    <code style={{ fontSize: 12, fontWeight: 700, color: e.code.startsWith('5') ? '#dc2626' : e.code.startsWith('4') ? '#d97706' : '#16a34a', fontFamily: 'monospace', flexShrink: 0, paddingTop: 1 }}>{e.code}</code>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TX, marginBottom: 2 }}>{e.title}</div>
                      <div style={{ fontSize: 12, color: TX3 }}>{e.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dev-section" id="pricing">
              <SectionHead title="Pricing"/>
              <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginBottom: 20 }}>
                API plans are separate from your AskBiz subscription. All keys start on Free automatically.
              </p>
              <div className="dev-plan-grid">
                {PLANS.map((p, i) => (
                  <div key={i} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: p.col, background: p.bg, padding: '2px 8px', borderRadius: 9999, display: 'inline-block', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
                      {p.name}
                    </div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 700, color: TX, marginBottom: 4 }}>{p.price}</div>
                    <div style={{ fontSize: 12, color: TX2, marginBottom: 2 }}>{p.req} requests / month</div>
                    <div style={{ fontSize: 12, color: TX3 }}>{p.rpm} requests / minute</div>
                  </div>
                ))}
              </div>
              <Link href="/billing" style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 22px', background: ACC, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 8px rgba(208,138,89,.25)', minHeight: 'auto' }}>
                Upgrade your API plan →
              </Link>
            </div>

          </main>
        </div>
      </div>
    </>
  )
}
