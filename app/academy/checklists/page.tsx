import type { Metadata } from 'next'
import ChecklistsPageClient from './ChecklistsPageClient'

export const metadata: Metadata = {
  title: 'Business Checklists — AskBiz Academy',
  description: 'Practical checklists for SME founders — covering finance & accounting, operations, hiring, compliance, export readiness, POS setup, and more. Download-ready and free.',
  keywords: 'business checklists, SME operations, finance checklist, compliance checklist, export readiness, POS setup checklist',
  openGraph: {
    title: 'Business Checklists — AskBiz Academy',
    description: 'Practical download-ready checklists for SME founders covering finance, operations, hiring, compliance, export readiness, and POS setup.',
    url: 'https://askbiz.co/academy/checklists',
    type: 'website',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz Academy Checklists' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Checklists — AskBiz Academy',
    description: 'Free checklists for SME founders — finance, operations, compliance, export readiness, and more.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: { canonical: 'https://askbiz.co/academy/checklists' },
}

export default function ChecklistsPage() {
  return <ChecklistsPageClient />
}
