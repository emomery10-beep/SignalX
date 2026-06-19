import type { Metadata } from 'next'
import LearningPathsPageClient from './LearningPathsPageClient'

export const metadata: Metadata = {
  title: 'Learning Paths — AskBiz Academy',
  description: 'Structured learning paths for SME founders covering business intelligence, eCommerce, SaaS, retail, supply chain, manufacturing, legal, sustainability, and more.',
  keywords: 'business learning paths, SME education, eCommerce learning, retail business guides, supply chain training, SaaS founder education',
  openGraph: {
    title: 'AskBiz Academy Learning Paths',
    description: 'Structured learning paths for SME founders — business intelligence, eCommerce, retail, supply chain, manufacturing, legal, and sustainability.',
    url: 'https://askbiz.co/academy/learning-paths',
    type: 'website',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz Academy Learning Paths' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskBiz Academy Learning Paths',
    description: 'Structured paths for SME founders — eCommerce, retail, supply chain, manufacturing, and more.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: { canonical: 'https://askbiz.co/academy/learning-paths' },
}

export default function LearningPathsPage() {
  return <LearningPathsPageClient />
}
