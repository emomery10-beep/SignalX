import type { Metadata } from 'next'
import JsonLd from '@/components/docs/JsonLd'
import FaqBlock from '@/components/docs/FaqBlock'
import Eyebrow from '@/components/ui/Eyebrow'
import Card from '@/components/ui/Card'
import Reveal from '@/components/ui/Reveal'
import { Button, ButtonExternal } from '@/components/ui/Button'
import { webPage, SITE } from '@/lib/schema'

const URL = `${SITE}/help`

export const metadata: Metadata = {
  title: 'Help Center — AskBiz Developer API Support',
  description: 'Find answers by topic — getting started, authentication, pricing and billing, merchant connections, vision and WhatsApp endpoints, webhooks, and error handling — or reach a real person.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Help Center — AskBiz Developers',
    description: 'Answers by topic for developers building on the AskBiz API, plus a direct line to support.',
    url: URL,
    siteName: 'AskBiz Developers',
    type: 'website',
  },
}

const TOPICS = [
  {
    title: 'Getting started',
    body: 'Create an account, get your first API key, and make your first call.',
    links: [
      { href: '/docs/quickstart', label: 'Quickstart' },
      { href: '/docs/authentication', label: 'Authentication' },
      { href: '/docs/guides/sandbox-keys', label: 'Build with a sandbox key' },
    ],
  },
  {
    title: 'Pricing & billing',
    body: 'What costs money, what’s free, and exactly how much.',
    links: [
      { href: '/docs/api-reference/pricing', label: 'Live pricing endpoint' },
      { href: '/pricing', label: 'Plans & quotas' },
      { href: '/docs/guides/bill-a-merchant', label: 'Bill a merchant on your behalf' },
    ],
  },
  {
    title: 'Merchant connections',
    body: 'Requesting scoped access to a merchant’s account, and what they see.',
    links: [
      { href: '/docs/guides/connect-to-a-merchant', label: 'Connect to a merchant' },
      { href: '/docs/api-reference/connections', label: 'POST /api/v1/connections reference' },
    ],
  },
  {
    title: 'Vision & messaging',
    body: 'Scanning products from photos and sending WhatsApp receipts.',
    links: [
      { href: '/docs/guides/scan-and-price-products', label: 'Scan and price products' },
      { href: '/docs/guides/send-whatsapp-messages', label: 'Send WhatsApp messages' },
    ],
  },
  {
    title: 'Webhooks & events',
    body: 'Reacting to sales, purchase orders, and low stock in real time.',
    links: [
      { href: '/docs/guides/webhooks', label: 'Subscribe to webhooks' },
    ],
  },
  {
    title: 'Errors & retries',
    body: 'What every error response looks like, and how to retry safely.',
    links: [
      { href: '/docs/guides/errors-and-retries', label: 'Handle errors and retries' },
      { href: '/docs/faq', label: 'Full FAQ' },
    ],
  },
]

const TOP_QUESTIONS = [
  {
    question: 'Which endpoints actually cost money per call?',
    answer: 'Only two: POST /api/v1/scan (3¢ per successful call) and POST /api/v1/whatsapp/send (2¢ per successful send). POST /api/v1/ask is free within your monthly plan quota. All prices are per successful call — a failed or rejected request is never billed.',
  },
  {
    question: 'How do I avoid double-charging on a retry?',
    answer: 'Send a client-generated Idempotency-Key header (a UUID works) on POST /api/v1/scan or POST /api/v1/whatsapp/send. Retrying with the same key returns your original response instead of running the action again.',
  },
  {
    question: 'What’s the difference between an account-mode and generic-mode key?',
    answer: 'An account-mode key is tied to a real AskBiz business and automatically pulls its profile and inventory context. A generic-mode key has no connected account and must supply its own context — and cannot call POST /api/v1/whatsapp/send at all.',
  },
  {
    question: 'How do I get access to a merchant who isn’t my own account?',
    answer: 'Call POST /api/v1/connections to create a pending connection request. The merchant approves it from a real, hosted confirmation page — they see exactly which scopes you asked for and can narrow, but never widen, them.',
  },
  {
    question: 'My key is being rate-limited — what are the actual limits?',
    answer: 'Per-minute: free = 5/min, growth = 60/min, business = 120/min. Monthly quotas: free = 100/month, growth = 10,000/month, business = unlimited. Every response includes X-RateLimit-Limit and X-RateLimit-Remaining headers so you can track usage without guessing.',
  },
  {
    question: 'I can’t find the answer here — how do I reach a person?',
    answer: 'Email hello@askbiz.co with your API key’s prefix (never the full key) and a description of what you’re seeing. For account or billing issues, sign in and use the dashboard — it has more context than we can ask for over email.',
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <Reveal>
        <div className="max-w-2xl mb-16">
          <div className="mb-4"><Eyebrow>Help Center</Eyebrow></div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-50 mb-5 tracking-tight">
            Get unstuck, fast
          </h1>
          <p className="text-ink-300 text-base leading-relaxed mb-8">
            Answers to the questions developers actually ask, organized by what you&rsquo;re trying to do —
            not an alphabetical dump. If you can&rsquo;t find it here, the full FAQ and every guide are one click away.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/docs/faq">Read the full FAQ</Button>
            <ButtonExternal href="mailto:hello@askbiz.co" variant="secondary">Email support</ButtonExternal>
          </div>
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {TOPICS.map((topic, i) => (
          <Reveal key={topic.title} delay={i * 50}>
            <Card interactive={false} padding="p-6" className="h-full">
              <h2 className="text-ink-50 text-base font-bold mb-1.5">{topic.title}</h2>
              <p className="text-ink-400 text-xs leading-relaxed mb-4">{topic.body}</p>
              <ul className="space-y-2">
                {topic.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-signal-300 text-xs font-medium hover:text-signal-200 underline underline-offset-2 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <FaqBlock heading="Most-asked questions" items={TOP_QUESTIONS} />
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-16 rounded-[2rem] p-1.5 bg-white/[0.02] ring-1 ring-white/[0.06]">
          <div className="rounded-[calc(2rem-0.375rem)] bg-ink-900/80 px-8 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <h2 className="font-display text-xl font-bold text-ink-50 mb-2">Still stuck?</h2>
            <p className="text-ink-300 text-sm mb-6 max-w-sm mx-auto">
              Email us with your API key&rsquo;s prefix (never the full key) and what you&rsquo;re seeing — a real person reads every message.
            </p>
            <ButtonExternal href="mailto:hello@askbiz.co">hello@askbiz.co</ButtonExternal>
          </div>
        </div>
      </Reveal>

      <JsonLd data={[
        webPage({
          url: URL,
          name: 'Help Center — AskBiz Developers',
          description: 'Answers by topic for developers building on the AskBiz API.',
          dateModified: '2026-07-27',
          breadcrumb: [{ name: 'Help', url: URL }],
        }),
      ]} />
    </div>
  )
}
