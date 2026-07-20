import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import FaqBlock from '@/components/docs/FaqBlock'
import HowToSteps from '@/components/docs/HowToSteps'
import JsonLd from '@/components/docs/JsonLd'
import { howTo, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/guides/use-the-api-console`

export const metadata: Metadata = {
  title: 'Test the API from the interactive console — AskBiz API guide',
  description: 'Fire a real request at the AskBiz API with your own key from the developer.askbiz.co dashboard and see the actual response — status, latency, and rate-limit headers — before writing any code.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Interactive API console — AskBiz',
    description: 'See a real response before writing any code.',
    url: URL,
    type: 'article',
  },
}

const steps = [
  {
    name: 'Sign in and open the Console',
    text: 'The Console lives at developer.askbiz.co/dashboard/console, alongside Keys, Apps, Webhooks, and Usage. Like the rest of the dashboard, it requires you to be signed in — it isn’t part of the public, no-account /docs pages.',
  },
  {
    name: 'Pick an endpoint',
    text: 'The dropdown lists every endpoint callable with an x-api-key: POST /api/v1/ask, /api/v1/scan, /api/v1/whatsapp/send, /api/v1/connections, and /api/v1/charges. GET /api/v1/pricing isn’t listed — it needs no key at all, so just curl it directly. Webhook and App management aren’t listed either — both are session-only account settings, never called with an x-api-key in the first place, so there’s nothing for the console to send a key against.',
  },
  {
    name: 'Paste your API key',
    text: 'Paste either an abz_test_… or an abz_live_… key into the API key field — the console detects which one you’ve pasted and labels the request accordingly. It’s sent from your browser straight through to askbiz.co for that one request only — the console never stores, logs, or re-displays it, the same policy as every key and webhook secret in this product. Paste it fresh each time; it isn’t remembered between visits or endpoint switches.',
  },
  {
    name: 'Edit the request body and send it',
    text: 'Each endpoint starts with a realistic example body pre-filled — edit it to match what you actually want to test, then click Send request. With a test key, /api/v1/scan, /api/v1/whatsapp/send, and /api/v1/charges all return a realistic canned response with no real side effect — no debit, no WhatsApp message, no Stripe charge. With a live key, it’s a real call: a billed endpoint really debits your balance on success, and a real WhatsApp message, charge, or merchant consent email really goes out.',
  },
  {
    name: 'Read the real response',
    text: 'The response panel shows the actual HTTP status, latency in milliseconds, remaining requests for the current rate-limit window (from the same X-RateLimit-Remaining header documented in Authentication), and the full JSON body — exactly what your own server would receive for the same request.',
  },
]

export default function UseTheApiConsoleGuide() {
  return (
    <ArticleShell
      title="Test the API from the interactive console"
      description="The Console lets you fire a real request at the AskBiz API from the dashboard, using your own key, and see the actual response — status, latency, and rate-limit headers — before writing a line of integration code."
      breadcrumbs={[
        { name: 'Docs', href: '/docs' },
        { name: 'Guides', href: '/docs/guides' },
        { name: 'Use the API console', href: '/docs/guides/use-the-api-console' },
      ]}
    >
      <div className="not-prose mb-6 p-4 rounded-xl border border-pulse-700/40 bg-pulse-500/5">
        <p className="text-pulse-200/90 text-sm leading-relaxed">
          Use a <code>abz_test_&hellip;</code> key here if you just want to see the shape of a response —
          <code>/api/v1/scan</code>, <code>/api/v1/whatsapp/send</code>, and <code>/api/v1/charges</code> all return
          a realistic canned result with no real side effect on a test key: no debit, no WhatsApp message sent, no
          Stripe charge created. Switch to an <code>abz_live_&hellip;</code> key once you&rsquo;re ready for the
          request to really happen — a billed call debits your actual balance, and{' '}
          <code>/api/v1/whatsapp/send</code> sends an actual WhatsApp message.
        </p>
      </div>

      <p>
        Every code sample in these docs is ground-truthed against the live route implementations, but reading a
        sample still leaves a gap between &ldquo;this is what the response should look like&rdquo; and seeing your
        own account, your own data, and your own key actually produce it. The Console closes that gap without you
        needing to open a terminal or write a single line of client code first.
      </p>

      <HowToSteps steps={steps} />

      <h2>What&rsquo;s next</h2>
      <p>
        Once you&rsquo;ve confirmed an endpoint behaves the way you expect, move to real code — every{' '}
        <a href="/docs/api-reference">API Reference</a> page has cURL, JavaScript, and Python samples for the
        exact same request. If you&rsquo;re requesting access to a merchant&rsquo;s account rather than calling
        the API standalone, see <a href="/docs/guides/connect-to-a-merchant">Connect to a merchant</a>.
      </p>

      <FaqBlock
        heading="Console FAQ"
        items={[
          {
            question: 'Is there a sandbox or test mode, so I don’t use real credits or send a real WhatsApp message?',
            answer: 'Yes — create a test key (abz_test_…) from the Keys page, or toggle Test when creating one. On /api/v1/scan, /api/v1/whatsapp/send, and /api/v1/charges, a test key always returns a realistic canned response and never debits your balance, sends a real message, or creates a real Stripe charge. /api/v1/ask answers for real in both modes, since it’s never billed and only ever reads your own data. /api/v1/connections isn’t sandboxed yet — it requires a live key, since it reaches a real merchant’s inbox.',
          },
          {
            question: 'Is my API key stored when I use the console?',
            answer: 'No. It’s sent from your browser through to askbiz.co for that one request only and is never stored, logged, or re-displayed — the same policy as every key and webhook secret in this product. You need to paste it again each time you open the console or switch endpoints.',
          },
          {
            question: 'Why can’t I test GET /api/v1/pricing or webhooks from the console?',
            answer: 'Pricing needs no API key at all — it’s a fully public endpoint, so just curl or fetch it directly. Webhook and App management are session-authenticated dashboard actions, never called with an x-api-key in the first place, so there’s no key-authenticated request for the console to send.',
          },
          {
            question: 'Can someone else use my key if they get access to the console page?',
            answer: 'The console itself is session-gated — you have to be signed into your own developer.askbiz.co account to reach it. But the key field takes whatever key you paste in, so treat it the same as pasting a key into a terminal: don’t do it on a shared or untrusted machine.',
          },
        ]}
      />

      <JsonLd data={howTo({
        url: URL,
        name: 'Test the API from the interactive console',
        description: 'Sign into the developer.askbiz.co dashboard, open the Console, pick an endpoint, paste your API key, and send a real request to see the actual response before writing any code.',
        steps: steps.map(s => ({ name: s.name, text: s.text })),
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Guides', url: `${SITE}/docs/guides` },
          { name: 'Use the API console', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
