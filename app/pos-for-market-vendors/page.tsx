import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'POS for Market Stalls & Street Vendors | AskBiz',
  description: 'A point-of-sale app built for market stalls, street vendors and kiosks — not big shops. Camera-first, mobile money, works offline, no hardware. Replace the notebook with the phone in your pocket.',
  keywords: ['POS for street vendors', 'POS for market stalls', 'kiosk POS app', 'duka POS', 'informal business POS Africa', 'street vendor point of sale'],
  openGraph: {
    title: 'POS for Market Stalls & Street Vendors',
    description: 'A till built for the stall, the kiosk and the street — camera-first, mobile money, no hardware.',
    url: 'https://askbiz.co/pos-for-market-vendors',
  },
  alternates: { canonical: 'https://askbiz.co/pos-for-market-vendors' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="POS for market vendors"
      h1="A Point of Sale Built for Market Stalls and Street Vendors"
      subheading="Not a shop system squeezed onto a phone — a till designed from the ground up for the stall, the kiosk and the roadside. Camera-first, mobile money native, works offline, and free to start."
      intro="Almost every point-of-sale system is built for a shop with a counter, a computer, and a queue. Market stalls, street vendors and kiosks work differently: one hand on the goods, a phone in the other, customers who pay by M-Pesa or cash, and no time to type. Most vendors run the whole business in a notebook because the 'proper' POS systems assume a terminal, a subscription, and reading a manual. AskBiz is built for the notebook user, not the shop owner. You point your camera at a product to add it, take payment by mobile money or cash, and the day's takings, best sellers and low stock are there when you close — without a single spreadsheet. It is a real POS for informal businesses across Kenya, Nigeria, Uganda and beyond, on the phone the vendor already carries."
      problem={{
        heading: "Why normal POS systems don't fit a stall",
        body: "A market vendor can't stop mid-sale to type item names into a screen, can't afford a KES 45,000 terminal for a stall that packs up each night, and often isn't reading long English menus while a queue builds. Traditional POS software assumes a fixed counter, steady power, steady internet, and a literate operator with time to spare. Stalls have none of that. So the tools go unused and the vendor stays in the notebook — losing track of what actually sells, what's running low, and how much was really made once stock and mobile money are counted.",
      }}
      solution={{
        heading: "AskBiz is camera-first, so selling is faster than writing",
        body: "Instead of typing, you use the camera. Snap a product and AskBiz names and prices it; scan a barcode and it's in the basket. Take M-Pesa, Airtel, MTN or cash, and the sale records itself. Big buttons, photos instead of long text, and one-tap undo mean it works for a busy vendor who can't read a manual — and it keeps working when the network drops. At the end of the day you see your takings, your top sellers and what to restock, all on the same phone. No hardware, no counter, no spreadsheet — just a faster, clearer version of the notebook every vendor already trusts.",
      }}
      features={[
        { icon: '📷', title: 'Camera is the till', body: 'Snap or scan a product to add it. AskBiz can name and price items from a photo — faster than writing it down.' },
        { icon: '📲', title: 'Mobile money & cash', body: 'Take M-Pesa, Airtel Money, MTN MoMo or cash. Payments match to the sale and the day’s total automatically.' },
        { icon: '👆', title: 'Built for busy hands', body: 'Big buttons, product photos instead of long text, and one-tap undo — usable at speed, even without reading.' },
        { icon: '📶', title: 'Works offline', body: 'Sell through a dead spot. Sales save on the phone and sync the moment signal returns.' },
        { icon: '📦', title: 'Knows your stock', body: 'Each sale updates stock, so you see what is running low before you run out on a busy day.' },
        { icon: '🌙', title: 'The day, at a glance', body: 'Close-of-day takings, best sellers and restock list — no counting the notebook, no spreadsheet.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Open it on your phone', body: 'No terminal, no counter, no setup fee. Works on any Android phone or iPhone the vendor already owns.' },
        { step: '2', title: 'Snap your goods once', body: 'Add your products by photo or barcode. AskBiz names and prices them, building your stall’s catalogue.' },
        { step: '3', title: 'Sell fast', body: 'Tap items or scan them, take M-Pesa or cash, hand over the goods. The sale is recorded instantly.' },
        { step: '4', title: 'Close and check', body: 'See what you made and what to restock tonight — then pack up. The books are already done.' },
      ]}
      faqs={[
        { q: 'Is AskBiz really made for street vendors and stalls?', a: 'Yes. It is designed for informal businesses — market stalls, street vendors, kiosks and roadside sellers — not for big shops. That means camera-first input instead of typing, mobile money and cash instead of card terminals, big buttons and photos instead of dense menus, and offline support for weak networks.' },
        { q: 'I keep everything in a notebook. Is this hard to switch to?', a: 'No — it is built to feel like a faster notebook. You snap your goods once to build your list, then selling is tapping or scanning. There is nothing to install beyond the app, no hardware, and no manual to read. Most vendors are taking real sales within minutes.' },
        { q: 'Do I need a card machine or any equipment?', a: 'No. The phone in your pocket is the whole till. The camera does the scanning, mobile money and cash do the payments, and there is no terminal, printer or scanner to buy. That is why it can be free to start.' },
        { q: 'What if I cannot read English well?', a: 'AskBiz leans on photos, big buttons and simple icons instead of long text, and is available in Swahili and Somali with more languages coming. The camera-first design means much of the work is pointing and tapping, not reading.' },
        { q: 'Does it work without internet?', a: 'Yes. You can keep selling with no signal — sales are stored on the phone and sync automatically when the network returns, so a dead spot in the market never costs you a sale.' },
        { q: 'How much does it cost?', a: 'It is free to start, with no card required. You can sell, take mobile money, track stock and see your daily takings on the free plan. Paid plans add extras like unlimited AI questions, multiple stalls or branches, and team members.' },
      ]}
      cta={{
        heading: "Put the notebook down",
        body: "Snap your goods, take M-Pesa, and close the day knowing exactly what you made. Free to start on the phone you already carry.",
      }}
      relatedPages={[
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS app' },
        { href: '/point-of-sale', label: 'Phone point of sale' },
        { href: '/app-ya-duka', label: 'App ya kuuza duka (Kiswahili)' },
        { href: '/point-of-sale/retail', label: 'POS for retail' },
      ]}
    />
  )
}
