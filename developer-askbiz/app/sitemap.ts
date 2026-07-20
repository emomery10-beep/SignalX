import { MetadataRoute } from 'next'
import { CORE_ENDPOINTS } from '@/lib/endpoints'
import { GUIDES } from '@/lib/guides'

const SITE = 'https://developer.askbiz.co'

// Default lastModified for pages that haven't changed since the docs
// section's initial launch. Override per-path below for anything touched
// since then — keep this honest rather than bumping every date on every
// edit, since search engines use it as a freshness signal.
const LAUNCH_DATE = '2026-07-17'
const UPDATED: Record<string, string> = {
  '/docs/changelog': '2026-07-20',
  '/docs/terms': '2026-07-19',
  '/docs/privacy': '2026-07-19',
  '/docs/sitemap': '2026-07-20',
  '/docs/guides/organize-keys-with-apps': '2026-07-19',
  '/docs/guides/use-the-api-console': '2026-07-20',
  '/docs/guides/sandbox-keys': '2026-07-20',
  '/docs/api-reference': '2026-07-20',
  '/docs/api-reference/scan': '2026-07-20',
  '/docs/api-reference/whatsapp-send': '2026-07-20',
  '/docs/api-reference/charges': '2026-07-20',
  '/docs/api-reference/connections': '2026-07-20',
  '/docs/authentication': '2026-07-20',
  '/docs/quickstart': '2026-07-20',
  '/docs/starters': '2026-07-20',
  '/pricing': '2026-07-19',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '/', '/pricing', '/docs', '/docs/quickstart', '/docs/authentication', '/docs/api-reference',
    '/docs/starters', '/docs/guides', '/docs/faq', '/docs/changelog', '/docs/terms', '/docs/privacy', '/docs/sitemap',
  ]
  const apiReferencePages = CORE_ENDPOINTS.map(e => `/docs/api-reference/${e.slug}`)
  const guidePages = GUIDES.map(g => `/docs/guides/${g.slug}`)

  return [...staticPages, ...apiReferencePages, ...guidePages].map(path => ({
    url: `${SITE}${path}`,
    lastModified: UPDATED[path] || LAUNCH_DATE,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : path === '/pricing' ? 0.95 : path === '/docs' ? 0.9 : path === '/docs/terms' || path === '/docs/privacy' ? 0.4 : 0.7,
  }))
}
