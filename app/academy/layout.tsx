import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | AskBiz Academy',
    default: 'AskBiz Academy — Business Intelligence for Founders',
  },
  description:
    'Free encyclopedia of business intelligence, financial metrics, eCommerce, trade, and AI — written in plain English for founders and SME operators.',
  openGraph: {
    siteName: 'AskBiz Academy',
    type: 'website',
  },
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
