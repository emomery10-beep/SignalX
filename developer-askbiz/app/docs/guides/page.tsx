import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleShell from '@/components/docs/ArticleShell'
import { GUIDES } from '@/lib/guides'
import { SITE } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Guides — How to use the AskBiz API',
  description: 'Task-oriented walkthroughs for building on AskBiz: scanning products, sending WhatsApp messages, connecting to merchants, billing on their behalf, webhooks, and safe retries.',
  alternates: { canonical: `${SITE}/docs/guides` },
  openGraph: { title: 'Guides — How to use the AskBiz API', description: 'Task-oriented walkthroughs for building on AskBiz.', url: `${SITE}/docs/guides`, type: 'website' },
}

export default function GuidesIndex() {
  return (
    <ArticleShell
      title="Guides"
      description="Step-by-step walkthroughs for the real things developers build with the AskBiz API — separate from the parameter-by-parameter API reference."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Guides', href: '/docs/guides' }]}
    >
      <div className="not-prose grid sm:grid-cols-2 gap-4">
        {GUIDES.map(g => (
          <Link key={g.slug} href={`/docs/guides/${g.slug}`}
            className="block border border-ink-700 rounded-xl p-5 bg-ink-900 hover:border-signal-600 transition-colors">
            <p className="text-ink-100 text-sm font-semibold mb-1.5">{g.title}</p>
            <p className="text-ink-400 text-xs leading-relaxed">{g.summary}</p>
          </Link>
        ))}
      </div>
    </ArticleShell>
  )
}
