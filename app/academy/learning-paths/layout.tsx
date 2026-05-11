import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learning Paths | AskBiz Academy — Structured Business Intelligence Courses',
  description: 'Follow curated learning paths to master business intelligence, eCommerce, SaaS, retail, supply chain, manufacturing, legal, sustainability, and more. 107 tracks, 817+ curated articles for SME founders.',
  alternates: { canonical: 'https://askbiz.co/academy/learning-paths' },
  openGraph: {
    title: 'AskBiz Academy Learning Paths',
    description: 'Structured tracks for founders who want to master BI, eCommerce, SaaS, finance, and more.',
    url: 'https://askbiz.co/academy/learning-paths',
    type: 'website',
    siteName: 'AskBiz',
  },
}

export default function LearningPathsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
