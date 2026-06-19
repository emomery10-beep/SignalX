import type { Metadata } from 'next'
import { SECTORS } from '@/lib/pos-sectors'
import SectorPageClient from './SectorPageClient'

export async function generateMetadata({ params }: { params: { sector: string } }): Promise<Metadata> {
  const sector = SECTORS.find(s => s.id === params.sector)
  if (!sector) {
    return { title: 'Point of Sale — AskBiz' }
  }
  return {
    title: `${sector.label} Point of Sale — AskBiz | ${sector.tagline}`,
    description: `${sector.hero} AskBiz PoS for ${sector.label.toLowerCase()}: ${sector.desc}`,
    openGraph: {
      title: `AskBiz PoS for ${sector.label} — ${sector.tagline}`,
      description: `${sector.hero} From £5/seat/month. No hardware needed.`,
      url: `https://askbiz.co/point-of-sale/${sector.id}`,
      type: 'website',
      siteName: 'AskBiz',
      images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: `AskBiz ${sector.label} Point of Sale` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `AskBiz PoS for ${sector.label} — ${sector.tagline}`,
      description: `${sector.desc} From £5/seat/month.`,
      images: ['https://askbiz.co/og-image.png'],
    },
    alternates: { canonical: `https://askbiz.co/point-of-sale/${sector.id}` },
  }
}

export default function SectorPage() {
  return <SectorPageClient />
}
