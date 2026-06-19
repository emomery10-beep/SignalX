import type { Metadata } from 'next'
import { POS_FEATURES } from '@/lib/pos-features'
import FeaturePageClient from './FeaturePageClient'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const feature = POS_FEATURES.find(f => f.slug === params.slug)
  if (!feature) {
    return { title: 'Point of Sale — AskBiz' }
  }
  return {
    title: `${feature.title} — AskBiz Point of Sale`,
    description: `${feature.hero} ${feature.desc}`,
    openGraph: {
      title: `${feature.title} — AskBiz PoS`,
      description: `${feature.hero} From £5/seat/month. Works on any device.`,
      url: `https://askbiz.co/point-of-sale/feature/${feature.slug}`,
      type: 'website',
      siteName: 'AskBiz',
      images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: `AskBiz PoS — ${feature.title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${feature.title} — AskBiz PoS`,
      description: `${feature.desc} From £5/seat/month.`,
      images: ['https://askbiz.co/og-image.png'],
    },
    alternates: { canonical: `https://askbiz.co/point-of-sale/feature/${feature.slug}` },
  }
}

export default function FeaturePage() {
  return <FeaturePageClient />
}
