import type { Metadata } from 'next'
import LearningAskBizPageClient from './LearningAskBizPageClient'

export const metadata: Metadata = {
  title: 'Learning AskBiz — Step-by-step Training | AskBiz Academy',
  description: '10 step-by-step training articles to help you master AskBiz — from your first login to advanced features including Point of Sale, integrations, analytics, and AI tools.',
  keywords: 'AskBiz training, AskBiz tutorial, learn AskBiz, AskBiz getting started, AskBiz POS setup, AskBiz integrations',
  openGraph: {
    title: 'Learning AskBiz — Step-by-step Training',
    description: '10 guided articles to master AskBiz: first login, POS setup, integrations, analytics, and AI features.',
    url: 'https://askbiz.co/academy/learning-askbiz',
    type: 'website',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'Learning AskBiz' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning AskBiz — Step-by-step Training',
    description: '10 guided articles to master AskBiz: POS setup, integrations, analytics, and AI features.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: { canonical: 'https://askbiz.co/academy/learning-askbiz' },
}

export default function LearningAskBizPage() {
  return <LearningAskBizPageClient />
}
