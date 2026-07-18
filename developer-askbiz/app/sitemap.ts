import { MetadataRoute } from 'next'
import { CORE_ENDPOINTS } from '@/lib/endpoints'
import { GUIDES } from '@/lib/guides'

const SITE = 'https://developer.askbiz.co'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['/', '/docs', '/docs/quickstart', '/docs/authentication', '/docs/api-reference', '/docs/guides', '/docs/faq', '/docs/changelog']
  const apiReferencePages = CORE_ENDPOINTS.map(e => `/docs/api-reference/${e.slug}`)
  const guidePages = GUIDES.map(g => `/docs/guides/${g.slug}`)

  return [...staticPages, ...apiReferencePages, ...guidePages].map(path => ({
    url: `${SITE}${path}`,
    lastModified: '2026-07-17',
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : path === '/docs' ? 0.9 : 0.7,
  }))
}
