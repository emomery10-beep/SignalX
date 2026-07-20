// Canonical guide list — the "how to use" section, separate from the raw
// API reference. Each guide is a task-oriented walkthrough (HowTo schema),
// not a parameter-by-parameter reference. sitemap.ts, the /docs/guides
// index, and the docs nav all read from this list so it can't drift.

export type Guide = {
  slug: string
  title: string
  summary: string
  /** Which /docs/api-reference/[slug] pages this guide is built on. */
  relatedEndpoints: string[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'scan-and-price-products',
    title: 'Scan and price a product from a photo',
    summary: 'Use the vision endpoint to identify a product from a phone photo and match it against a merchant’s live inventory and pricing.',
    relatedEndpoints: ['scan'],
  },
  {
    slug: 'send-whatsapp-messages',
    title: 'Send WhatsApp receipts and purchase orders',
    summary: 'Send pre-approved receipt and purchase-order templates over WhatsApp using AskBiz’s Meta Business API connection.',
    relatedEndpoints: ['whatsapp-send'],
  },
  {
    slug: 'ask-business-questions',
    title: 'Ask business-intelligence questions',
    summary: 'Get grounded, plain-English answers about sales, margin, and stock — either from a connected AskBiz account or your own data context.',
    relatedEndpoints: ['ask'],
  },
  {
    slug: 'connect-to-a-merchant',
    title: 'Connect to a merchant’s account with scoped permissions',
    summary: 'Request access to a specific merchant’s inventory, have them approve it with a real consent screen, and use it across your other API calls.',
    relatedEndpoints: ['connections', 'scan'],
  },
  {
    slug: 'bill-a-merchant',
    title: 'Bill a merchant on your behalf',
    summary: 'Create a billing-on-behalf-of charge request, collected through a hosted Stripe Checkout page — no payment credentials touch your server.',
    relatedEndpoints: ['charges'],
  },
  {
    slug: 'webhooks',
    title: 'Subscribe to real-time webhooks',
    summary: 'React to sale.created, purchase_order.received, and stock.low events instead of polling — set up delivery, verify signatures, and test before going live.',
    relatedEndpoints: ['webhooks'],
  },
  {
    slug: 'errors-and-retries',
    title: 'Handle errors and retries safely',
    summary: 'The exact error shapes every endpoint returns, and how to use Idempotency-Key so a network retry never double-charges or double-sends.',
    relatedEndpoints: ['scan', 'whatsapp-send'],
  },
  {
    slug: 'organize-keys-with-apps',
    title: 'Organize keys with Apps',
    summary: 'Group your API keys under a named, brandable App so merchants see who’s asking on the consent screen instead of an unbranded request.',
    relatedEndpoints: ['apps', 'connections'],
  },
  {
    slug: 'use-the-api-console',
    title: 'Test the API from the interactive console',
    summary: 'Fire a real request at any core endpoint with your own key from the dashboard and see the actual response before writing any code.',
    relatedEndpoints: ['ask', 'scan', 'whatsapp-send', 'connections', 'charges'],
  },
  {
    slug: 'sandbox-keys',
    title: 'Build safely with a sandbox (test-mode) key',
    summary: 'Create a test key and get realistic responses from scan, whatsapp/send, and charges with no real debit, message, or charge — then switch to a live key when you’re ready.',
    relatedEndpoints: ['scan', 'whatsapp-send', 'charges'],
  },
]

export function getGuide(slug: string) {
  return GUIDES.find(g => g.slug === slug)
}
