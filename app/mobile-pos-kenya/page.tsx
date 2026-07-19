import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

// Targets the "mobile POS Kenya" query cluster — where the SERP is dominated by
// KSh 21k–45k Android POS terminals + eTIMS, and the People-Also-Ask is literally
// "Can I use my phone as a POS machine?". This page flips the hardware bias
// (phone IS the POS), answers the PAA directly for rich results / AEO, and handles
// eTIMS honestly (digital records, no false automated-eTIMS claim).

export const metadata: Metadata = {
  title: 'Mobile POS in Kenya — Turn Your Phone Into a POS Machine | AskBiz',
  description:
    'Free mobile POS for Kenya. Turn any phone into a POS machine — scan with the camera, take M-Pesa, Airtel & cash, track stock. No KSh 30,000 terminal. Works offline. Free to start.',
  keywords: [
    'mobile POS Kenya', 'mobile POS app Kenya', 'POS app Kenya', 'phone as POS machine',
    'use phone as POS Kenya', 'free mobile POS Kenya', 'M-Pesa POS Kenya', 'POS system Kenya',
    'Android POS Kenya alternative', 'camera POS Kenya', 'point of sale app Kenya',
    'mpesa till app', 'duka POS Kenya', 'kiosk POS Kenya', 'best mobile POS Kenya',
  ],
  alternates: { canonical: 'https://askbiz.co/mobile-pos-kenya' },
  openGraph: {
    type: 'website',
    url: 'https://askbiz.co/mobile-pos-kenya',
    title: 'Mobile POS in Kenya — Turn Your Phone Into a POS Machine',
    description:
      'No KSh 30,000 terminal. AskBiz turns any Android phone or iPhone into a full mobile POS — camera scanning, M-Pesa, Airtel & cash, stock and daily profit. Free to start.',
    siteName: 'AskBiz',
    images: [{ url: 'https://askbiz.co/og-image.png', width: 1200, height: 630, alt: 'AskBiz — mobile POS for Kenya, on your phone' }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Mobile POS · Kenya"
      h1="Mobile POS in Kenya: turn your phone into a POS machine"
      subheading="No KSh 30,000 terminal. AskBiz turns the phone already in your pocket into a full point of sale — scan with the camera, take M-Pesa, and know exactly what you made today. Free to start."
      intro="AskBiz is a mobile POS for Kenya that runs on the phone you already own — no card machine, no Android POS terminal, no hardware to buy. Point your camera at a product to sell it, accept M-Pesa, Airtel Money or cash, track your stock, and see your daily takings and profit every evening. It's a free mobile POS app built for Kenyan shops, kiosks, dukas, salons, food stalls and service businesses — a phone-first point of sale that works on any Android phone or iPhone, even offline."
      problem={{
        heading: "Why “mobile POS in Kenya” usually means buying a machine",
        body: "Search for a mobile POS in Kenya and you'll mostly find handheld Android POS terminals selling for KSh 21,000 to KSh 45,000 — plus receipt paper, a charger and setup. For a stall, a kiosk or a one-person shop, that's a lot of money tied up in a device that can break, get stolen, or sit idle. Meanwhile the phone in your pocket already has a camera, a screen and M-Pesa. It can do the whole job — no separate machine needed.",
      }}
      solution={{
        heading: "Your phone is the POS machine",
        body: "AskBiz turns that phone into a complete point of sale. The camera is the scanner — point it at a product and AskBiz names and prices it, so there's no barcode gun and no typing. Take M-Pesa, MTN, Airtel Money, cash or card, and every sale records itself. Your stock updates as you sell, and at close of day you see exactly what you made and what you profited. It keeps working when the network drops, and it runs on any Android phone or iPhone — no terminal, no app store, no hardware.",
      }}
      features={[
        { icon: '📷', title: 'Your camera is the scanner', body: 'Point at a product to add it — no barcode gun, no typing. Faster than tapping a handheld terminal.' },
        { icon: '📲', title: 'M-Pesa, Airtel & cash', body: 'Take M-Pesa, MTN and Airtel Money, cash or card. Every payment matches to the sale automatically.' },
        { icon: '📱', title: 'Any phone, no hardware', body: 'Runs in the browser on the Android phone or iPhone you already own. No KSh 30,000 terminal to buy.' },
        { icon: '📶', title: 'Works offline', body: 'Keep selling with no signal — cash sales save on the phone and sync the moment you are back online.' },
        { icon: '📦', title: 'Stock & daily takings', body: "See what's selling, what's running low, and exactly what you made and profited each day." },
        { icon: '🧾', title: 'Records for your books', body: 'Every sale is logged and exportable — ready for your KRA bookkeeping and your accountant.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Open it on your phone', body: 'No terminal, no setup fee. Works on any Android phone or iPhone you already have, straight in the browser.' },
        { step: '2', title: 'Add your products by camera', body: "Snap your goods once. AskBiz names and prices them, building your shop's catalogue." },
        { step: '3', title: 'Sell and take M-Pesa', body: 'Tap or scan items, take M-Pesa, Airtel or cash, and hand over the goods. The sale records itself.' },
        { step: '4', title: 'See what you made tonight', body: 'At close of day, see your takings, your profit, your best sellers and what to restock — no maths, no spreadsheet.' },
      ]}
      faqs={[
        { q: 'Can I use my phone as a POS machine in Kenya?', a: 'Yes. AskBiz turns any Android phone or iPhone into a full mobile POS — the camera is your scanner, and you take M-Pesa, Airtel Money, cash or card. You don’t need a separate POS machine or card terminal; the phone in your pocket is the point of sale.' },
        { q: 'Is there a free mobile POS in Kenya?', a: 'Yes — AskBiz is free to start, with no card required. You can sell, take M-Pesa and cash, track stock and see your daily takings on the free plan. Paid plans add extras like unlimited AI questions, multiple branches and team members.' },
        { q: 'Does it work with M-Pesa?', a: 'Yes. M-Pesa is built in, alongside MTN Mobile Money, Airtel Money, cash and card. Every payment is matched to the sale so your books balance at the end of the day.' },
        { q: 'Do I need to buy a POS machine or Android terminal?', a: 'No. Most “mobile POS” options in Kenya are handheld terminals costing KSh 21,000–45,000. AskBiz needs none of that — it runs on the phone you already own, so there is no hardware, no card machine and no upfront cost.' },
        { q: 'What about eTIMS and KRA?', a: 'AskBiz keeps a complete digital record of every sale that you can use for your KRA and eTIMS bookkeeping and share with your accountant. Automated eTIMS e-invoicing to KRA isn’t built in yet — AskBiz focuses on making selling, stock and daily profit effortless on your phone.' },
        { q: 'Does it work without internet?', a: 'Yes. Cash sales keep going with no connection — the sale and your stock still update, and everything syncs automatically when you are back online. Card and mobile money payments need a live connection to confirm with the provider, so those pause until signal returns.' },
        { q: 'Which businesses is it for?', a: 'Any Kenyan business that sells: shops, kiosks, dukas, spaza shops, market stalls, salons, barbershops, food stalls, repair shops and service businesses — registered or not. If you have a phone, you are ready.' },
      ]}
      cta={{
        heading: 'Turn your phone into a POS today',
        body: 'Free to start on the phone you already carry. Scan with your camera, take M-Pesa, and know what you made by tonight — no machine, no hardware.',
      }}
      relatedPages={[
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS' },
        { href: '/point-of-sale', label: 'Phone point of sale' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
        { href: '/business-intelligence/kenya', label: 'AskBiz for Kenya' },
      ]}
    />
  )
}
