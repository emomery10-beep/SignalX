import type { Metadata } from 'next'
import PosPageClient from './PosPageClient'

const POS_BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://askbiz.co' },
    { '@type': 'ListItem', position: 2, name: 'Point of Sale', item: 'https://askbiz.co/point-of-sale' },
  ],
}

const POS_FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need a card machine or till to use AskBiz POS?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. AskBiz POS runs on any smartphone or tablet. You scan items with your camera, take M-Pesa, cash, or card, and your stock updates automatically. No hardware purchase required.' },
    },
    {
      '@type': 'Question',
      name: 'Does AskBiz POS support M-Pesa, MTN Mobile Money, and Airtel Money?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — M-Pesa, MTN Mobile Money, and Airtel Money are built in with no setup needed. You can also accept cash, Stripe card payments, and 150+ currencies.' },
    },
    {
      '@type': 'Question',
      name: 'How much does AskBiz POS cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'The POS add-on starts from £5/seat/month (KSh 500, ₦2,500, R90 depending on your country). The base business tracker is free to start with no card required.' },
    },
    {
      '@type': 'Question',
      name: 'Does it work for market stalls and street vendors?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. AskBiz POS is designed for sellers without a fixed shop — market stalls, street sellers, food stands, pop-up traders. If you have a phone, you can take payment and track stock immediately.' },
    },
    {
      '@type': 'Question',
      name: 'Can I manage stock and multiple staff with AskBiz POS?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Stock updates automatically after every sale. Staff log in with an OTP — no password sharing — and you can see every transaction per person. Works across multiple branches too.' },
    },
    {
      '@type': 'Question',
      name: 'What types of businesses use AskBiz POS?',
      acceptedAnswer: { '@type': 'Answer', text: 'AskBiz POS works for any business that sells: small shops, kiosks, spaza shops, duuka, boutiques, barbershops, salons, restaurants, food stands, couriers, delivery businesses, market stalls, and street sellers. If you sell something and you have a phone, it works for you.' },
    },
    {
      '@type': 'Question',
      name: 'Does AskBiz POS work in Nairobi, Lagos, Kampala, Accra, and other African cities?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. AskBiz POS is used by businesses in Nairobi, Lagos, Kampala, Accra, Dar es Salaam, Abuja, Abidjan, Lusaka, Harare, and across Africa. M-Pesa, MTN Mobile Money, and Airtel Money are all supported natively. Pricing is available in KES, NGN, GHS, UGX, ZAR, and more.' },
    },
    {
      '@type': 'Question',
      name: 'How does AskBiz compare to Square, SumUp, iZettle, or Yoco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Square, SumUp, iZettle, and Yoco all require a card reader — a piece of hardware you have to buy. AskBiz requires no hardware at all: your phone camera is your scanner and your till. AskBiz also supports M-Pesa, MTN Mobile Money, and Airtel Money, which none of those alternatives do. It is also free to start, while Square and SumUp charge transaction fees from day one.' },
    },
    {
      '@type': 'Question',
      name: 'Can I track my daily takings and get an end of day report?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. AskBiz gives you a daily takings summary — total revenue, profit, top selling items, and stock movements. You see your end of day report automatically, without adding anything up yourself. No sales book, no spreadsheet, no calculator.' },
    },
    {
      '@type': 'Question',
      name: 'Does AskBiz work for couriers, delivery businesses, and boda boda riders?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Any business that takes payment on the move can use AskBiz — couriers, delivery drivers, boda boda riders. Take M-Pesa or cash on your phone, issue a digital receipt, and your daily revenue is tracked automatically.' },
    },
  ],
}

export const metadata: Metadata = {
  title: 'AskBiz Phone POS — Take M-Pesa, Scan Items, No Hardware',
  description: 'AskBiz POS turns your phone into a till. Scan items with your camera, take M-Pesa, MTN, Airtel, cash or card. Stock updates automatically. From £5/seat/month.',
  keywords: 'mobile POS Africa, M-Pesa POS, phone POS, phone till, market stall POS, street vendor POS, small shop POS, kiosk POS, spaza shop POS, duuka POS, barbershop POS, salon POS Africa, restaurant POS Africa, courier POS, delivery business POS, boda boda payment, hawker POS, jua kali POS, camera scan POS, no hardware POS, MTN mobile money POS, Airtel Money POS, M-Pesa receipt, Kenya POS app, Nigeria POS, Nairobi POS, Lagos POS, Kampala POS, Accra POS, Dar es Salaam POS, inventory tracker phone, daily takings, end of day report, track daily sales, stock management phone, till reconciliation, affordable POS Africa, free POS Kenya, unregistered business POS, sole trader POS Africa, Square alternative Africa, SumUp alternative Africa, iZettle alternative, Yoco alternative',
  openGraph: {
    title: 'AskBiz Phone POS — M-Pesa, Camera Scan & No Hardware',
    description: 'Turns your phone into a till. Scan items with your camera, take M-Pesa, MTN, Airtel, or cash. Stock updates itself. From £5/seat/month, no hardware.',
    url: 'https://askbiz.co/point-of-sale',
    type: 'website',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz Phone POS — sell with your phone, no hardware' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskBiz Phone POS — M-Pesa, Camera Scan & No Hardware',
    description: 'Turns your phone into a till. Camera scan, M-Pesa, MTN, Airtel, cash, or card. Stock updates itself. From £5/seat/month.',
    images: ['https://askbiz.co/og-image.png'],
  },
  alternates: {
    canonical: 'https://askbiz.co/point-of-sale',
    languages: {
      'x-default': 'https://askbiz.co/point-of-sale',
      'en': 'https://askbiz.co/point-of-sale',
      'en-KE': 'https://askbiz.co/point-of-sale',
      'en-NG': 'https://askbiz.co/point-of-sale',
      'en-UG': 'https://askbiz.co/point-of-sale',
      'en-GB': 'https://askbiz.co/point-of-sale',
      'en-US': 'https://askbiz.co/point-of-sale',
    },
  },
}

export default function PosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(POS_BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(POS_FAQ_LD) }} />
      <PosPageClient />
    </>
  )
}
