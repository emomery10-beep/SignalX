import type { Metadata } from 'next'
import { ACTIVE_LOCALES, localePath } from '@/lib/i18n-locale'
import LearningPathsPageClient from './LearningPathsPageClient'

const SITE = 'https://askbiz.co'

// hreflang alternates — mirrors the x-default + per-locale pattern in
// app/layout.tsx (see its 'so'/'sw' entries), generalized to all 7 active
// locales via localePath(). Content behind each locale URL is still English
// today (LearningPath objects have no translation mechanism yet), but the
// route already resolves per-locale, so advertising the alternates is
// correct and forward-compatible.
const LEARNING_PATHS_HUB_LANGUAGES: Record<string, string> = {
  'x-default': `${SITE}/academy/learning-paths`,
  ...Object.fromEntries(ACTIVE_LOCALES.map(l => [l, `${SITE}${localePath('/academy/learning-paths', l)}`])),
}

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
  alternates: { canonical: 'https://askbiz.co/academy/learning-paths', languages: LEARNING_PATHS_HUB_LANGUAGES },
}

export default function LearningPathsPage() {
  return <LearningPathsPageClient />
}
