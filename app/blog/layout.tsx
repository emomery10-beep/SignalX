import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Intelligence Hub | AskBiz Blog',
  description: 'Guides, explainers, and insights on business intelligence, AI analytics, eCommerce strategy, financial intelligence, and data-driven decisions for SME owners.',
  openGraph: {
    title: 'Business Intelligence Hub | AskBiz Blog',
    description: 'Guides, explainers, and insights on business intelligence, AI analytics, eCommerce strategy, financial intelligence, and data-driven decisions for SME owners.',
    url: 'https://askbiz.co/blog',
    siteName: 'AskBiz',
    type: 'website',
    images: [{ url: 'https://askbiz.co/api/og?title=Business+Intelligence+Hub&category=AskBiz+Blog', width: 1200, height: 630, alt: 'AskBiz Business Intelligence Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@askbizco',
    title: 'Business Intelligence Hub | AskBiz Blog',
    description: 'Guides and insights on BI, AI analytics, and data-driven decisions for SME owners.',
    images: ['https://askbiz.co/api/og?title=Business+Intelligence+Hub&category=AskBiz+Blog'],
  },
  alternates: { canonical: 'https://askbiz.co/blog' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
