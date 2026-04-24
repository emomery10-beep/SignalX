import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', allow: ['/how-to', '/translate', '/bloomberg-alternative', '/business-intelligence-for-small-business', '/analyse-sales-data', '/stock-management-analytics', '/profit-margin-calculator', '/ai-business-analytics'],
      disallow: ['/chat', '/files', '/dashboards', '/expansion', '/alerts', '/forecasts', '/templates', '/sources', '/billing', '/admin', '/settings', '/api/'] },
    sitemap: 'https://askbiz.co/sitemap.xml',
  }
}
