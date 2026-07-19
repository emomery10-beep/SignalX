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
    text: 'Paste a real abz_live_… key into the API key field. It’s sent from your browser straight through to askbiz.co for that one request only — the console never stores, logs, or re-displays it, the same policy as every key and webhook secret in this product. Paste it fresh each time; it isn’t remembered between visits or endpoint switches.',
  },
  {
    name: 'Edit the request body and send it',
    text: 'Each endpoint starts with a realistic example body pre-filled — edit it to match what you actually want to test, then click Send request. This is a real call: a billed endpoint (scan, whatsapp/send) really debits your balance on success, and a real WhatsApp message or merchant consent email really goes out. It’s not a sandbox or a dry run.',
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
      <div className="not-prose mb-6 p-4 rounded-xl border border-amber-700/40 bg-amber-500/5">
        <p className="text-amber-200/90 text-sm leading-relaxed">
          The console sends <strong>real</strong> requests with your <strong>real</strong> key — there&rsquo;s no
          sandbox or test-mode key today (every key is <code>abz_live_&hellip;</code>). A billed call debits your
          actual balance on success, and <code>/api/v1/whatsapp/send</code> sends an actual WhatsApp message.
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
            answer: 'Not today — every API key is a live key (abz_live_…), including in the Console, so a billed call debits your real balance and a WhatsApp send really delivers. Use a low-cost endpoint like /api/v1/ask or a real test phone number you control when trying out /api/v1/whatsapp/send.',
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
