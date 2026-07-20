// Starter gallery registry — a handful of realistic, pre-filled requests a
// new developer can open directly in the Console with one click, instead of
// picking an endpoint and writing a request body from scratch. Each one is
// safe to run start-to-finish on a test key (see /docs/guides/sandbox-keys)
// — that's why /api/v1/connections isn't here: it's blocked for test keys
// entirely, so there's no way to make it a safe-by-default starter.
//
// Deliberately NOT a full "guide" (see lib/guides.ts) — no per-slug static
// page, no prose, no FAQ. The card on /dashboard/starters IS the whole
// experience; "Try it" jumps straight into the Console.

export type Starter = {
  slug: string
  title: string
  /** One line, plain language — what this does for your business, not what the endpoint is called. */
  outcome: string
  path: string
  method: 'POST'
  body: string
  curl: string
}

export const STARTERS: Starter[] = [
  {
    slug: 'ask-a-question',
    title: 'Answer a business question',
    outcome: 'Ask in plain English and get a grounded answer about sales, margin, or stock.',
    path: '/api/v1/ask',
    method: 'POST',
    body: JSON.stringify({ question: 'Which product has the worst margin this month?' }, null, 2),
    curl: `curl -X POST https://askbiz.co/api/v1/ask \\
  -H "x-api-key: abz_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "Which product has the worst margin this month?"}'`,
  },
  {
    slug: 'price-a-product',
    title: 'Price a product from a photo',
    outcome: 'Snap a photo of a product and get back its name, price, and stock level.',
    path: '/api/v1/scan',
    method: 'POST',
    body: JSON.stringify({ image: '<base64-encoded JPEG>' }, null, 2),
    curl: `curl -X POST https://askbiz.co/api/v1/scan \\
  -H "x-api-key: abz_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"image": "<base64-encoded JPEG>"}'`,
  },
  {
    slug: 'send-a-receipt',
    title: 'Send a WhatsApp receipt',
    outcome: 'Text a customer their receipt the moment a sale happens.',
    path: '/api/v1/whatsapp/send',
    method: 'POST',
    body: JSON.stringify({ phone: '+254712345678', template: 'receipt', text: 'Thank you for your purchase!' }, null, 2),
    curl: `curl -X POST https://askbiz.co/api/v1/whatsapp/send \\
  -H "x-api-key: abz_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+254712345678", "template": "receipt", "text": "Thank you for your purchase!"}'`,
  },
  {
    slug: 'bill-a-merchant',
    title: 'Bill a merchant',
    outcome: 'Ask a merchant to approve and pay a charge, collected through a hosted checkout page.',
    path: '/api/v1/charges',
    method: 'POST',
    body: JSON.stringify({ merchant_email: 'merchant@example.com', amount_cents: 5000, currency: 'gbp', description: 'Monthly subscription' }, null, 2),
    curl: `curl -X POST https://askbiz.co/api/v1/charges \\
  -H "x-api-key: abz_test_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"merchant_email": "merchant@example.com", "amount_cents": 5000, "currency": "gbp", "description": "Monthly subscription"}'`,
  },
]

export function getStarter(slug: string) {
  return STARTERS.find(s => s.slug === slug)
}
