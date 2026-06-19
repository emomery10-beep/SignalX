import type { Metadata } from 'next'
import PosPageClient from './PosPageClient'

export const metadata: Metadata = {
  title: 'Point of Sale — AskBiz | AI-Powered PoS for Any Business',
  description: 'AskBiz Point of Sale: camera-first checkout, 150+ currencies, mobile money (M-Pesa, MTN, Airtel), multi-branch inventory, staff shifts with OTP login, and AI intelligence built in. From £5/seat/month. No hardware needed.',
  keywords: 'point of sale, POS system, retail POS, restaurant POS, mobile POS, multi-currency POS, Africa POS, SME POS, barcode scanner POS, inventory management POS, AI point of sale',
  openGraph: {
    title: 'AskBiz Point of Sale — AI-Powered PoS for Any Business',
    description: 'Camera-first checkout, 150+ currencies, mobile money (M-Pesa, MTN, Airtel), multi-branch inventory and AI intelligence — all in one PoS. From £5/seat/month. No hardware needed.',
    url: 'https://askbiz.co/point-of-sale',
    type: 'website',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz Point of Sale' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskBiz Point of Sale — AI-Powered PoS for Any Business',
    description: 'Camera-first checkout, 150+ currencies, mobile money, multi-branch inventory and AI intelligence. From £5/seat/month.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: { canonical: 'https://askbiz.co/point-of-sale' },
}

export default function PosPage() {
  return <PosPageClient />
}
