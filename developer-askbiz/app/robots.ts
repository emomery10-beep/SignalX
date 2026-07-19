import { MetadataRoute } from 'next'

// Same pattern as the main app's app/robots.ts — only the public landing
// page and /docs are crawlable here; everything else on developer.askbiz.co
// is an authenticated app or a merchant-facing one-time confirmation link,
// neither of which should be crawled or indexed.
const PUBLIC_PATHS = ['/', '/pricing', '/docs', '/docs/']
const PRIVATE_PATHS = ['/dashboard', '/admin', '/signin', '/connect', '/charges', '/api/', '/auth']

const AI_BOTS = ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'Meta-ExternalAgent', 'CCBot', 'Bytespider']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_BOTS, allow: PUBLIC_PATHS, disallow: PRIVATE_PATHS },
      { userAgent: '*', allow: PUBLIC_PATHS, disallow: PRIVATE_PATHS },
    ],
    sitemap: 'https://developer.askbiz.co/sitemap.xml',
  }
}
