import type { Metadata } from 'next'
import BlogIndexClient from './BlogIndexClient'

export const metadata: Metadata = {
  title: 'Business Intelligence Hub — AskBiz Blog',
  description: 'Guides, playbooks, and analysis for SME founders. Topics cover business intelligence, Point of Sale, eCommerce analytics, export markets, FX risk, supplier management, and more.',
  keywords: 'business intelligence blog, SME founder guides, eCommerce analytics, POS insights, export market analysis, small business strategy',
  openGraph: {
    title: 'Business Intelligence Hub — AskBiz Blog',
    description: 'Practical guides for SME founders on business intelligence, Point of Sale, eCommerce analytics, export markets, and more.',
    url: 'https://askbiz.co/blog',
    type: 'website',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Intelligence Hub — AskBiz Blog',
    description: 'Practical guides for SME founders on business intelligence, POS, eCommerce analytics, and more.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: { canonical: 'https://askbiz.co/blog' },
}

export default function BlogPage() {
  return <BlogIndexClient />
}
