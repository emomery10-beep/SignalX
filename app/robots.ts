import { MetadataRoute } from 'next'

const PUBLIC_PATHS = [
  '/',
  '/blog',
  '/blog/',
  '/help',
  '/help/',
  '/academy',
  '/academy/',
  '/how-to',
  '/translate',
  '/bloomberg-alternative',
  '/business-intelligence-for-small-business',
  '/analyse-sales-data',
  '/stock-management-analytics',
  '/profit-margin-calculator',
  '/ai-business-analytics',
  '/point-of-sale',
  '/pos-preview',
  '/demo',
  '/demo/',
  '/pricing',
  '/vs',
  '/integrations',
  '/for',
  '/case-studies',
  '/free-tools',
  '/glossary',
  '/rss.xml',
]

const PRIVATE_PATHS = ['/chat', '/files', '/dashboards', '/expansion', '/alerts', '/forecasts', '/templates', '/sources', '/billing', '/admin', '/settings', '/api/']

// Named AI-crawler entries so discovery audits and the crawlers themselves see
// explicit allow/disallow rules here, not just in the informal llms.txt file.
const AI_BOTS = ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'Meta-ExternalAgent', 'CCBot', 'Bytespider']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: AI_BOTS,
        allow: PUBLIC_PATHS,
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: '*',
        allow: PUBLIC_PATHS,
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: 'https://askbiz.co/sitemap.xml',
  }
}
