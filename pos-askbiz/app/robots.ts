import { MetadataRoute } from 'next'

const PUBLIC_PATHS = ['/', '/preview', '/preview/', '/changelog', '/privacy', '/terms', '/cookies']

const PRIVATE_PATHS = [
  '/dashboard', '/sell', '/inventory', '/billing', '/refunds', '/payment-success',
  '/factory', '/logistics', '/repair', '/restaurant', '/retail', '/salon', '/api/',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: PUBLIC_PATHS,
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: 'https://pos.askbiz.co/sitemap.xml',
  }
}
