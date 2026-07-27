import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import HowToSteps from '@/components/docs/HowToSteps'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/academy/build-your-first-integration`

export const metadata: Metadata = {
  title: 'Build your first integration in 15 minutes — AskBiz Academy',
  description: 'A start-to-finish project tutorial: create a sandbox key, scan a product photo, and handle both a catalog match and a miss — with complete, runnable code.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Build your first integration in 15 minutes — AskBiz Academy',
    description: 'From zero to a working scan integration, with complete runnable code.',
    url: URL,
    type: 'article',
  },
}

const setupBash = `# No install needed — this project just uses fetch and a JPEG file.
# Create a free account at developer.askbiz.co, then create a sandbox key
# from the dashboard: Settings → API Keys → New key → Sandbox (test mode)`

const envJs = `// .env
ASKBIZ_API_KEY=abz_test_xxxxxxxxxxxxxxxx   // sandbox key — no real debit`

const fullScriptJs = `import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

async function scanProduct(photoPath) {
  const bytes = await readFile(photoPath)
  const base64Jpeg = bytes.toString('base64') // no data URI prefix

  const res = await fetch('https://askbiz.co/api/v1/scan', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ASKBIZ_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify({ image: base64Jpeg }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(\`Scan failed (\${res.status}): \${err.error}\`)
  }

  return res.json()
}

const result = await scanProduct('./product-photo.jpg')

if (result.found) {
  console.log(\`Matched: \${result.name} — \${result.price} (\${result.stock_qty} in stock)\`)
} else {
  console.log(\`No catalog match. Vision model saw: "\${result.name}" — prompting manual entry.\`)
}`

const fullScriptPython = `import base64
import os
import uuid

import requests


def scan_product(photo_path):
    with open(photo_path, "rb") as f:
        base64_jpeg = base64.b64encode(f.read()).decode("utf-8")  # no data URI prefix

    res = requests.post(
        "https://askbiz.co/api/v1/scan",
        headers={
            "x-api-key": os.environ["ASKBIZ_API_KEY"],
            "Content-Type": "application/json",
            "Idempotency-Key": str(uuid.uuid4()),
        },
        json={"image": base64_jpeg},
    )

    if not res.ok:
        raise RuntimeError(f"Scan failed ({res.status_code}): {res.json()['error']}")

    return res.json()


result = scan_product("./product-photo.jpg")

if result["found"]:
    print(f'Matched: {result["name"]} — {result["price"]} ({result["stock_qty"]} in stock)')
else:
    print(f'No catalog match. Vision model saw: "{result["name"]}" — prompting manual entry.')`

const steps = [
  {
    name: 'Create a sandbox key',
    text: 'Sign in to developer.askbiz.co, open Settings → API Keys, and create a new key in sandbox (test) mode. A sandbox key returns realistic-shaped responses without debiting your wallet or touching a real inventory — see Build safely with a sandbox key for exactly what it simulates.',
    code: <CodeTabs samples={[{ label: 'Setup', lang: 'bash', code: setupBash }]} />,
  },
  {
    name: 'Store the key as an environment variable',
    text: 'Never hardcode a key in source you might commit. Put it in a .env file (or your platform’s secret manager) and load it at runtime.',
    code: <CodeTabs samples={[{ label: '.env', lang: 'bash', code: envJs }]} />,
  },
  {
    name: 'Write the full scan function',
    text: 'This one function does the whole job: read a JPEG, base64-encode it, send it to POST /api/v1/scan with an Idempotency-Key so an accidental retry can’t double-run the vision call, and surface a clear error on a non-2xx response.',
    code: (
      <CodeTabs
        samples={[
          { label: 'JavaScript', lang: 'js', code: fullScriptJs },
          { label: 'Python', lang: 'python', code: fullScriptPython },
        ]}
      />
    ),
  },
  {
    name: 'Handle both outcomes, not just the happy path',
    text: 'A sandbox (and a real) scan can come back found: true with a real price and stock level, or found: false with just an identified name and no catalog entry. Both are billed, successful responses — found: false is not an error. Your integration needs a real fallback path (a manual price-entry screen pre-filled with the identified name), not just a console.log.',
  },
  {
    name: 'Switch to a live key when you’re ready',
    text: 'Create a second key in live mode from the same Settings screen, swap the environment variable, and you’re calling the real vision pipeline against real inventory. Nothing else in your code changes — that’s the entire point of the sandbox/live split.',
  },
]

export default function BuildFirstIntegrationLesson() {
  return (
    <ArticleShell
      title="Build your first integration in 15 minutes"
      description="One working script, start to finish: get a sandbox key, scan a product photo, and handle both a catalog match and a miss — with complete code, not fragments."
      breadcrumbs={[
        { name: 'Academy', href: '/academy' },
        { name: 'Build your first integration', href: '/academy/build-your-first-integration' },
      ]}
    >
      <p>
        This lesson builds one real thing: a script that takes a product photo and returns a name, price, and
        stock level. It uses <code>POST /api/v1/scan</code> — the same endpoint covered in the{' '}
        <a href="/docs/guides/scan-and-price-products">reference guide</a>, but framed here as a single project you
        build in order, from an empty folder to a working result.
      </p>

      <HowToSteps steps={steps} />

      <h2>What&rsquo;s next</h2>
      <p>
        Once this works against a sandbox key, the natural next step is scoping it to a real merchant&rsquo;s
        inventory instead of your own — covered in{' '}
        <a href="/docs/guides/connect-to-a-merchant">Connect to a merchant</a>. Before you point real traffic at it,
        read the <a href="/academy/production-readiness-checklist">production readiness checklist</a>.
      </p>

      <FaqBlock
        heading="Questions about this lesson"
        items={[
          {
            question: 'Do I need a real product photo to follow along?',
            answer: 'Any JPEG of a packaged product works for testing the shape of the response. In sandbox mode the result is simulated, so the specific photo content matters less than getting the base64 encoding and request format right.',
          },
          {
            question: 'Why does the example strip the data URI prefix?',
            answer: 'The image field expects raw base64 only. If you capture the photo from a browser file input or canvas, the resulting data URL starts with "data:image/jpeg;base64," — that prefix must be removed before sending, or the request will fail to decode server-side.',
          },
          {
            question: 'What happens if I forget the Idempotency-Key header?',
            answer: 'The call still succeeds — the header is optional but strongly recommended. Without it, a network-level retry on your end becomes a brand-new request, which on a live key means a second real charge and a second vision call.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Build your first integration in 15 minutes',
        description: 'Get a sandbox key, scan a product photo, and handle both a catalog match and a miss with the AskBiz API.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Academy', url: `${SITE}/academy` },
          { name: 'Build your first integration', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
