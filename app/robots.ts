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
  '/free-mpesa-pos',
  '/free-pos-nigeria',
  '/free-pos-uganda',
  '/free-pos-ghana',
  '/free-pos-tanzania',
  '/pos-for-market-vendors',
  '/pos-system-kenya',
  '/pos-system-africa',
  '/best-pos-kenya',
  '/retail-pos-kenya',
  '/supermarket-pos-kenya',
  '/pharmacy-pos-kenya',
  '/restaurant-pos-kenya',
  '/cloud-pos-kenya',
  '/offline-pos-kenya',
  '/kra-etims-pos',
  '/mpesa-pos-integration',
  '/ecommerce-pos-kenya',
  '/inventory-management-kenya',
  '/utauza',
  '/app-ya-duka',
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

const PRIVATE_PATHS = ['/chat', '/files', '/expansion', '/alerts', '/forecasts', '/templates', '/sources', '/billing', '/admin', '/settings', '/api/', '/home-i18n']

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
