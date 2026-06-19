import type { Metadata } from 'next'
import HelpPageClient from './HelpPageClient'

export const metadata: Metadata = {
  title: 'Help Center — AskBiz',
  description: 'Find answers to your AskBiz questions. Search articles covering getting started, integrations, Point of Sale, billing, analytics, data exports, and GDPR tools.',
  keywords: 'AskBiz help, AskBiz support, AskBiz documentation, POS help, analytics help, integrations guide',
  openGraph: {
    title: 'AskBiz Help Center',
    description: 'Search our help articles. Covers getting started, integrations, Point of Sale, billing, analytics, and GDPR tools.',
    url: 'https://askbiz.co/help',
    type: 'website',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz Help Center' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskBiz Help Center',
    description: 'Find answers about AskBiz — POS, analytics, integrations, billing, and GDPR tools.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: { canonical: 'https://askbiz.co/help' },
}

export default function HelpPage() {
  return <HelpPageClient />
}
