import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleShell from '@/components/docs/ArticleShell'
import CodeTabs from '@/components/docs/CodeTabs'
import FaqBlock from '@/components/docs/FaqBlock'
import JsonLd from '@/components/docs/JsonLd'
import { techArticle, SITE } from '@/lib/schema'
import { STARTERS } from '@/lib/starters'

const URL = `${SITE}/docs/starters`

export const metadata: Metadata = {
  title: 'Starters — working example requests for every core endpoint — AskBiz API',
  description: 'Four real, pre-filled requests — price a product from a photo, send a WhatsApp receipt, answer a business question, bill a merchant — ready to run, safe on a test key. No blank endpoint picker, no request body to write from scratch.',
  alternates: { canonical: URL },
  openGraph: { title: 'Starters — AskBiz API', description: 'Working example requests for every core endpoint, safe to try on a test key.', url: URL, type: 'article' },
}

export default function StartersDocsPage() {
  return (
    <ArticleShell
      title="Starters"
      description="Four working requests, ready to run — pick one, copy it, or open it pre-filled in the dashboard Console. Every one of these is safe to try on a test key: nothing real happens."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Starters', href: '/docs/starters' }]}
    >
      <div className="not-prose flex flex-wrap gap-2 mb-6">
        <span className="text-xs px-2.5 py-1 rounded-full bg-signal-600/20 text-signal-300">{STARTERS.length} starters</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">Safe on a test key</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-ink-800 text-ink-300">No account required to read this page</span>
      </div>

      <h2>What a starter is</h2>
      <p>
        A starter is a real, working request against one of AskBiz&rsquo;s core endpoints — the exact endpoint, the
        exact request body, already filled in. There&rsquo;s no blank endpoint picker to figure out and no JSON to
        write from a spec. Signed-in developers can open any of these directly in the dashboard{' '}
        <a href="/docs/guides/use-the-api-console">Console</a>, pre-filled and ready to send with one click — the
        code below is exactly what that click sends.
      </p>
      <p>
        Every starter is chosen specifically because it&rsquo;s safe to run on a{' '}
        <a href="/docs/guides/sandbox-keys">test key</a> (<code>abz_test_&hellip;</code>): nothing real is charged,
        no real WhatsApp message goes out, and no real merchant is contacted. Try one, see the real response shape,
        then switch to a live key when you&rsquo;re ready to ship.
      </p>

      {STARTERS.map(s => (
        <div key={s.slug}>
          <h2>{s.title}</h2>
          <p>{s.outcome}</p>
          <CodeTabs samples={[{ label: 'cURL', lang: 'bash', code: s.curl }]} />
        </div>
      ))}

      <h2>Try these interactively</h2>
      <p>
        Reading the code above is one way to start. The faster way: <Link href="/signin">sign in</Link> (or{' '}
        <Link href="/signin?mode=signup">create a free account</Link>) and open any starter directly from{' '}
        <code>developer.askbiz.co/dashboard/starters</code> — it deep-links straight into the Console with the
        endpoint and body already selected, so you only need to paste your own key and press send.
      </p>

      <FaqBlock
        heading="Starters FAQ"
        items={[
          {
            question: 'Do I need an account to use these examples?',
            answer: 'No — every request on this page is copy-pasteable with just an API key from a curl, JS, or Python shell. Signing in only matters if you want the one-click, pre-filled version inside the dashboard Console.',
          },
          {
            question: 'Will running these cost me anything?',
            answer: 'Not on a test key. Every starter here is chosen because it’s fully safe on a test key (abz_test_…) — no real wallet debit, no real WhatsApp send, no real charge. See Build safely with a sandbox key for exactly what each endpoint does differently in test mode.',
          },
          {
            question: 'Why isn’t there a starter for /api/v1/connections?',
            answer: 'A connection request reaches a real merchant’s real inbox and consent screen — there’s no way to make that safe to try casually, on a test key or otherwise. It’s the one core endpoint left out of Starters for that reason.',
          },
        ]}
      />

      <JsonLd data={techArticle({
        url: URL,
        headline: 'Starters — AskBiz API',
        description: 'Working example requests for every core AskBiz API endpoint, safe to try on a test key.',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Starters', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
