import type { Metadata } from 'next'
import ArticleShell from '@/components/docs/ArticleShell'
import JsonLd from '@/components/docs/JsonLd'
import { CORE_ENDPOINTS, ACCOUNT_ENDPOINTS } from '@/lib/endpoints'
import { GUIDES } from '@/lib/guides'
import { webPage, SITE } from '@/lib/schema'

const URL = `${SITE}/docs/sitemap`

export const metadata: Metadata = {
  title: 'Sitemap — AskBiz Developers',
  description: 'Every page on developer.askbiz.co in one place — API reference, guides, authentication, changelog, and legal pages. See also the machine-readable /sitemap.xml.',
  alternates: { canonical: URL },
  openGraph: { title: 'Sitemap — AskBiz Developers', description: 'Every page on developer.askbiz.co in one place.', url: URL, type: 'website' },
}

function LinkList({ items }: { items: { href: string; label: string; note?: string }[] }) {
  return (
    <ul className="not-prose grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
      {items.map(item => (
        <li key={item.href}>
          <a href={item.href} className="text-signal-300 text-sm hover:text-signal-200 underline underline-offset-2">{item.label}</a>
          {item.note && <span className="text-ink-500 text-xs"> — {item.note}</span>}
        </li>
      ))}
    </ul>
  )
}

export default function SitemapPage() {
  return (
    <ArticleShell
      title="Sitemap"
      description="Every page on developer.askbiz.co, grouped the way the docs nav groups them. Prefer a machine-readable version? See sitemap.xml."
      breadcrumbs={[{ name: 'Docs', href: '/docs' }, { name: 'Sitemap', href: '/docs/sitemap' }]}
    >
      <h2>Start here</h2>
      <LinkList items={[
        { href: '/', label: 'AskBiz Developers — home' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/docs', label: 'Documentation overview' },
        { href: '/docs/quickstart', label: 'Quickstart' },
        { href: '/docs/authentication', label: 'Authentication' },
      ]} />

      <h2>API reference</h2>
      <p>Callable directly with an <code>x-api-key</code>:</p>
      <LinkList items={[
        { href: '/docs/api-reference', label: 'API Reference — index' },
        ...CORE_ENDPOINTS.map(e => ({ href: `/docs/api-reference/${e.slug}`, label: `${e.method} ${e.path}`, note: e.slug })),
      ]} />
      <p>Account-management actions, dashboard-only (no dedicated reference page — see the matching guide where one exists):</p>
      <ul className="not-prose grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
        {ACCOUNT_ENDPOINTS.map(e => (
          <li key={e.slug} className="text-ink-300 text-sm">
            <code className="text-ink-200">{e.method} {e.path}</code>
          </li>
        ))}
      </ul>

      <h2>Guides</h2>
      <LinkList items={[
        { href: '/docs/guides', label: 'Guides — index' },
        ...GUIDES.map(g => ({ href: `/docs/guides/${g.slug}`, label: g.title })),
      ]} />

      <h2>Reference &amp; updates</h2>
      <LinkList items={[
        { href: '/docs/faq', label: 'FAQ' },
        { href: '/docs/changelog', label: 'Changelog' },
        { href: '/docs/sitemap', label: 'Sitemap (this page)' },
      ]} />

      <h2>Legal</h2>
      <LinkList items={[
        { href: '/docs/terms', label: 'Developer API Terms' },
        { href: '/docs/privacy', label: 'Developer Privacy Addendum' },
        { href: 'https://askbiz.co/terms', label: 'AskBiz Terms of Service', note: 'askbiz.co' },
        { href: 'https://askbiz.co/privacy', label: 'AskBiz Privacy Policy', note: 'askbiz.co' },
        { href: 'https://askbiz.co/rules/acceptable-use-policy', label: 'Acceptable Use Policy', note: 'askbiz.co' },
        { href: 'https://askbiz.co/rules/prohibited-activities', label: 'Prohibited Activities Policy', note: 'askbiz.co' },
        { href: 'https://askbiz.co/dpa', label: 'Data Processing Agreement', note: 'askbiz.co' },
      ]} />

      <h2>For machines</h2>
      <LinkList items={[
        { href: '/sitemap.xml', label: 'sitemap.xml', note: 'XML sitemap for search engines' },
        { href: '/robots.txt', label: 'robots.txt' },
        { href: '/llms.txt', label: 'llms.txt', note: 'AI-crawler access rules and citation guidance' },
        { href: 'https://askbiz.co/api/v1/openapi.json', label: 'openapi.json', note: 'full OpenAPI 3.0 spec' },
      ]} />

      <JsonLd data={webPage({
        url: URL,
        name: 'Sitemap — AskBiz Developers',
        description: 'Every page on developer.askbiz.co in one place.',
        dateModified: '2026-07-19',
        breadcrumb: [
          { name: 'Docs', url: `${SITE}/docs` },
          { name: 'Sitemap', url: URL },
        ],
      })} />
    </ArticleShell>
  )
}
