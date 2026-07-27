import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import JsonLd from '@/components/docs/JsonLd'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import GlowField from '@/components/ui/GlowField'
import Reveal from '@/components/ui/Reveal'
import Eyebrow from '@/components/ui/Eyebrow'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { organizationAndWebsite, SITE } from '@/lib/schema'
import { CORE_ENDPOINTS } from '@/lib/endpoints'

export const metadata: Metadata = {
  title: 'AskBiz Developers — Build on the API that powers AskBiz',
  description: 'Vision recognition, WhatsApp messaging, and business-intelligence APIs for African SME commerce. Billed only on success, priced in the open, idempotent by design.',
  alternates: { canonical: SITE },
  openGraph: {
    title: 'AskBiz Developers',
    description: 'Build on the API that powers AskBiz — vision, WhatsApp, and business-intelligence, billed only on success.',
    url: SITE,
    siteName: 'AskBiz Developers',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'AskBiz Developers', description: 'Vision, WhatsApp, and business-intelligence APIs for African SME commerce.' },
}

const BENEFITS = [
  {
    title: 'Billed only on success',
    body: 'A failed or rejected call is never charged — check real, live prices at GET /api/v1/pricing before you write a line of code.',
  },
  {
    title: 'Idempotent by design',
    body: 'Send an Idempotency-Key header on billed endpoints and a network retry returns your original result instead of double-charging.',
  },
  {
    title: 'Real merchant consent',
    body: 'Request scoped access to a merchant’s account and they see exactly what you’re asking for on a real consent screen — narrow-only, never widened.',
  },
  {
    title: 'Ground-truthed docs',
    body: 'Every parameter and error code in the docs is checked against the live route — plus a machine-readable OpenAPI spec for AI coding agents.',
  },
]

const curlSample = `curl -X POST https://askbiz.co/api/v1/scan \\
  -H "x-api-key: abz_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"image": "<base64-encoded JPEG>"}'

# {"found":true,"name":"Coca-Cola 500ml","price":80,"stock_qty":24,...}`

export default async function DeveloperHome() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 relative">
      <GlowField />
      <PublicHeader current="/" />

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 md:px-6 pt-28 pb-20 text-center">
          <Reveal>
            <div className="mb-6 flex justify-center"><Eyebrow>AskBiz API</Eyebrow></div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-ink-50 mb-6 tracking-tight leading-[1.05]">
              Build on the API that powers AskBiz
            </h1>
            <p className="text-ink-300 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Vision recognition, WhatsApp messaging, and business-intelligence Q&amp;A for African SME commerce —
              the same engine behind the AskBiz app, available pay-per-use.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/docs/quickstart">Get started</Button>
              <Button href="/docs/api-reference" variant="secondary">Browse API reference</Button>
            </div>
          </Reveal>
        </section>

        {/* Code sample */}
        <section className="max-w-2xl mx-auto px-4 md:px-6 pb-28">
          <Reveal delay={100}>
            <div className="rounded-[1.75rem] p-1.5 bg-white/[0.02] ring-1 ring-white/[0.06]">
              <div className="rounded-[calc(1.75rem-0.375rem)] overflow-hidden bg-ink-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="text-ink-400 text-xs ml-2">Identify a product from a photo</span>
                </div>
                <pre className="p-5 overflow-x-auto text-xs leading-relaxed text-ink-100"><code>{curlSample}</code></pre>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Feature grid — asymmetrical bento */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-28">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-signal-300 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Endpoints</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-50 mb-3">Five endpoints, one API key</h2>
              <p className="text-ink-300 text-sm max-w-lg mx-auto">
                Every endpoint documented with real request/response shapes, error codes, and pricing — not a sales page.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {CORE_ENDPOINTS.map((e, i) => (
              <Reveal key={e.slug} delay={i * 60}>
                <Card href={`/docs/api-reference/${e.slug}`}>
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-signal-300">{e.method}</span>
                    <code className="text-sm text-ink-100">{e.path}</code>
                  </div>
                  <p className="text-ink-400 text-xs leading-relaxed">{e.summary}</p>
                </Card>
              </Reveal>
            ))}
            <Reveal delay={CORE_ENDPOINTS.length * 60}>
              <Card href="/docs/guides/webhooks">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-signal-300">WEBHOOKS</span>
                </div>
                <p className="text-ink-400 text-xs leading-relaxed">React to sale.created, purchase_order.received, and stock.low events in real time instead of polling.</p>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* Learn — Academy / Help cross-link */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-28">
          <div className="grid sm:grid-cols-2 gap-5">
            <Reveal>
              <Card href="/academy" padding="p-7">
                <p className="text-signal-300 text-[10px] font-semibold tracking-[0.2em] uppercase mb-3">Academy</p>
                <h3 className="font-display text-lg font-bold text-ink-50 mb-2">Learn to build on AskBiz</h3>
                <p className="text-ink-400 text-xs leading-relaxed">Structured learning paths, project tutorials, and production-readiness lessons — from your first API key to a shipped integration.</p>
              </Card>
            </Reveal>
            <Reveal delay={80}>
              <Card href="/help" padding="p-7">
                <p className="text-signal-300 text-[10px] font-semibold tracking-[0.2em] uppercase mb-3">Help</p>
                <h3 className="font-display text-lg font-bold text-ink-50 mb-2">Get unstuck fast</h3>
                <p className="text-ink-400 text-xs leading-relaxed">Answers to the questions developers actually ask, organized by topic — billing, auth, connections, webhooks, and errors.</p>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-28">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-50 mb-12 text-center">Built to be trusted, not just tried</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 70}>
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl bg-signal-500/10 ring-1 ring-signal-400/20 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-signal-400" />
                  </div>
                  <div>
                    <h3 className="text-ink-50 text-sm font-semibold mb-1.5">{b.title}</h3>
                    <p className="text-ink-400 text-xs leading-relaxed">{b.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 md:px-6 pb-32 text-center">
          <Reveal>
            <div className="rounded-[2rem] p-1.5 bg-white/[0.02] ring-1 ring-white/[0.06]">
              <div className="rounded-[calc(2rem-0.375rem)] bg-ink-900/80 px-8 py-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-50 mb-3">Ready to build?</h2>
                <p className="text-ink-300 text-sm mb-8 max-w-sm mx-auto">
                  Create an account, get an API key, and make your first call in a few minutes — no card required to start.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button href="/signin">Create your first key</Button>
                  <Button href="/docs" variant="secondary" icon={false}>Read the docs</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <PublicFooter />

      <JsonLd data={organizationAndWebsite()} />
    </div>
  )
}
