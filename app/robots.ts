import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
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
        '/pricing',
        '/vs',
        '/integrations',
        '/for',
        '/case-studies',
        '/free-tools',
        '/glossary',
        '/rss.xml',
      ],
      disallow: ['/chat', '/files', '/dashboards', '/expansion', '/alerts', '/forecasts', '/templates', '/sources', '/billing', '/admin', '/settings', '/api/'],
    },
    sitemap: 'https://askbiz.co/sitemap.xml',
  }
}
