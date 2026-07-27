// Academy content model. Two kinds of content:
//  - TRACKS: curated learning paths through *existing* docs/guides, reordered
//    pedagogically (beginner → advanced) instead of the reference-style
//    alphabetical/task grouping used in /docs/guides.
//  - LESSONS: original long-form articles that don't exist anywhere else in
//    the docs — project tutorials and conceptual deep-dives, not endpoint
//    reference. sitemap.ts reads LESSONS so each gets its own sitemap entry.

export type TrackStep = { href: string; title: string; summary: string }
export type Track = { slug: string; title: string; summary: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; steps: TrackStep[] }

export const TRACKS: Track[] = [
  {
    slug: 'foundations',
    title: 'Foundations',
    summary: 'Get a working API key, understand authentication, and make your first safe-to-retry call.',
    level: 'Beginner',
    steps: [
      { href: '/docs/quickstart', title: 'Quickstart', summary: 'Create an account and make your first call in a few minutes.' },
      { href: '/docs/authentication', title: 'Authentication', summary: 'How x-api-key works, and account-mode vs generic-mode keys.' },
      { href: '/docs/guides/sandbox-keys', title: 'Build with a sandbox key', summary: 'Realistic responses with no real debit, message, or charge.' },
      { href: '/docs/guides/errors-and-retries', title: 'Errors and retries', summary: 'Every error shape, and how Idempotency-Key keeps retries safe.' },
    ],
  },
  {
    slug: 'core-endpoints',
    title: 'Core endpoints',
    summary: 'The three endpoints most integrations are actually built on.',
    level: 'Beginner',
    steps: [
      { href: '/docs/guides/scan-and-price-products', title: 'Scan and price products', summary: 'Turn a phone photo into a name, price, and stock level.' },
      { href: '/docs/guides/send-whatsapp-messages', title: 'Send WhatsApp messages', summary: 'Receipts and purchase orders over Meta’s Business API.' },
      { href: '/docs/guides/ask-business-questions', title: 'Ask business questions', summary: 'Grounded, plain-English answers about sales and stock.' },
    ],
  },
  {
    slug: 'merchants-and-money',
    title: 'Merchants & money',
    summary: 'Act on a merchant’s behalf, and collect payment for it.',
    level: 'Intermediate',
    steps: [
      { href: '/docs/guides/connect-to-a-merchant', title: 'Connect to a merchant', summary: 'Scoped access, approved on a real consent screen.' },
      { href: '/docs/guides/bill-a-merchant', title: 'Bill a merchant', summary: 'Billing-on-behalf-of via a hosted Stripe Checkout page.' },
      { href: '/academy/understanding-billing-and-pricing', title: 'Understanding billing & pricing', summary: 'The wallet model, per-call pricing, and where currencies diverge.' },
    ],
  },
  {
    slug: 'production',
    title: 'Going to production',
    summary: 'What changes between a working prototype and something merchants depend on.',
    level: 'Advanced',
    steps: [
      { href: '/docs/guides/webhooks', title: 'Subscribe to webhooks', summary: 'React to events instead of polling — with signature verification.' },
      { href: '/docs/guides/organize-keys-with-apps', title: 'Organize keys with Apps', summary: 'A named, brandable identity merchants see on consent screens.' },
      { href: '/academy/production-readiness-checklist', title: 'Production readiness checklist', summary: 'Idempotency, rate limits, monitoring, and key hygiene before launch.' },
    ],
  },
]

export type Lesson = { slug: string; title: string; summary: string; readMinutes: number }

export const LESSONS: Lesson[] = [
  {
    slug: 'build-your-first-integration',
    title: 'Build your first integration in 15 minutes',
    summary: 'A start-to-finish project: get a sandbox key, scan a product photo, and handle both a catalog match and a miss — with real code, not fragments.',
    readMinutes: 12,
  },
  {
    slug: 'understanding-billing-and-pricing',
    title: 'Understanding AskBiz billing and pricing',
    summary: 'The wallet model in full: what’s billed per call, what’s covered by your plan quota, and the three places currency conventions genuinely differ.',
    readMinutes: 9,
  },
  {
    slug: 'production-readiness-checklist',
    title: 'Production readiness checklist',
    summary: 'Eight concrete things to verify before you point real merchant traffic at your integration — each with the exact code or setting to check.',
    readMinutes: 10,
  },
]

export function getLesson(slug: string) {
  return LESSONS.find(l => l.slug === slug)
}
