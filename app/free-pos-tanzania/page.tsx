import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Free POS App for Small Business in Tanzania — No Hardware | AskBiz',
  description: 'A free point-of-sale app for Tanzania: take M-Pesa, Mixx by Yas (Tigo Pesa), Airtel Money, HaloPesa, cash or card on any phone. No terminal, no monthly fee. Track profit in shillings, offline-ready.',
  keywords: ['free POS app Tanzania', 'POS app for small business Tanzania', 'M-Pesa POS Tanzania', 'Tigo Pesa POS', 'Airtel Money Tanzania', 'phone POS shilingi'],
  openGraph: {
    title: 'Free POS App for Small Business in Tanzania',
    description: 'Take M-Pesa, Mixx by Yas, Airtel Money, cash or card on any phone. No terminal, free to start. Track profit in shillings.',
    url: 'https://askbiz.co/free-pos-tanzania',
  },
  alternates: { canonical: 'https://askbiz.co/free-pos-tanzania' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Free POS app Tanzania"
      h1="A Free POS App for Small Business in Tanzania — No Hardware"
      subheading="Turn your phone into a full till. Take M-Pesa, Mixx by Yas (Tigo Pesa), Airtel Money, HaloPesa, cash or card, track every sale, and see your profit in shillings. Free to start, no terminal, no monthly fee."
      intro="Tanzania is one of the most mobile-money-driven markets in Africa — M-Pesa, Mixx by Yas (formerly Tigo Pesa), Airtel Money and HaloPesa move money for millions of small businesses every day. Yet the point-of-sale tools a duka owner finds first either ignore mobile money entirely (Loyverse, Square, GoDaddy) or come bundled with a terminal, a subscription and a setup fee. For a duka, a boutique, a genge, a pharmacy or a market seller in Dar es Salaam, Mwanza or Arusha, that's a poor fit. AskBiz is built for how Tanzanians actually get paid. You open the app on any Android phone or iPhone, add your items by scanning a barcode or snapping a photo, and take payment by M-Pesa, Mixx by Yas, Airtel Money, HaloPesa, cash or card — the sale records itself against the right products and your daily total. Nothing to rent, nothing to install beyond the app, and the free plan lets you run real sales without ever entering a card. Available in Kiswahili, it's a genuine POS for Tanzanian small businesses, on the phone already in your pocket."
      problem={{
        heading: "Why the usual POS options don't fit a Tanzanian duka",
        body: "A duka or market seller can't justify a terminal that costs more than a week's takings, a monthly subscription, or an afternoon reading an English manual. And the free global apps don't handle M-Pesa, Mixx by Yas or Airtel Money — the exact way most customers pay — so mobile money gets reconciled by hand, or not at all. The result is the same across the country: the business runs on a paper book, and the owner never really knows which lines make money once mobile money, cash and mikopo (credit) are all counted at the end of a busy day.",
      }}
      solution={{
        heading: "AskBiz is mobile-money-first and phone-first",
        body: "AskBiz takes M-Pesa, Mixx by Yas, Airtel Money and HaloPesa natively — the customer pays and you record it in a tap, matched to the sale and your daily total, with no manual reconciliation. It runs on the phone you already own, works in Kiswahili, works offline when the network drops, and keeps clean records ready for the TRA, VAT and VFD receipting. Stock updates itself, credit customers are tracked, and at close of day you see your takings, best sellers and low stock in shillings. The free plan covers all of this; you only pay for extras like unlimited AI questions, multiple branches or staff. It's the tool the global free apps can't be in Tanzania, without the terminal the local ones demand.",
      }}
      features={[
        { icon: '📲', title: 'M-Pesa, Mixx, Airtel & Halo', body: 'Take every major mobile money rail natively — each payment matched to the sale and your daily total automatically.' },
        { icon: '📷', title: 'Camera is the scanner', body: 'Scan a barcode or snap a product photo to add items. No barcode gun, no separate hardware to buy.' },
        { icon: '🇹🇿', title: 'Works in Kiswahili', body: 'Use the app in Kiswahili, built for how Tanzanian traders actually sell — same account, same data.' },
        { icon: '🤝', title: 'Track mikopo (credit)', body: 'Record who has paid later and what they owe, so nothing is lost when a regular says “nitalipa kesho”.' },
        { icon: '🧾', title: 'TRA, VAT & VFD ready', body: 'Every sale is logged cleanly, so your books are ready for the TRA, VAT and VFD receipting rather than rebuilt.' },
        { icon: '🌙', title: 'Know your profit tonight', body: 'See takings, best sellers and low stock in shillings at close of day — not weeks later in a book.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Open it on your phone', body: 'Works on any Android phone or iPhone, in Kiswahili if you like. No terminal, no setup fee, no training.' },
        { step: '2', title: 'Add your products', body: 'Scan barcodes, snap photos, or type them in. AskBiz can name and price items from a photo for you.' },
        { step: '3', title: 'Sell and take mobile money', body: 'Ring up the basket, take M-Pesa, Mixx by Yas, Airtel Money, HaloPesa, cash or card, and the sale records itself.' },
        { step: '4', title: 'Check your day', body: 'At close, see what you sold, your profit in shillings, who owes you, and what is running low — on one phone.' },
      ]}
      faqs={[
        { q: 'Is AskBiz really a free POS app for Tanzania?', a: 'Yes. The free plan lets you record sales, take mobile money and cash, track stock and credit customers, and see your daily profit in shillings — with no card and no trial countdown. You only pay if you add extras like unlimited AI questions, multiple branches or staff. You can run a real business on the free plan.' },
        { q: 'Does it take M-Pesa, Mixx by Yas and Airtel Money?', a: 'Yes — M-Pesa, Mixx by Yas (formerly Tigo Pesa), Airtel Money and HaloPesa are all supported natively. The customer pays and you record it in a tap, matched to the sale and your daily total, so you are not reconciling mobile money by hand at the end of the day.' },
        { q: 'Can I use the app in Kiswahili?', a: 'Yes. AskBiz is available in Kiswahili, and you can switch languages in settings. Mobile money, offline support and the camera-first till all work the same in any language.' },
        { q: 'Do I need a terminal or any equipment?', a: 'No. AskBiz turns the phone you already own into the till. The camera does the scanning, mobile money and cash do the payments, and there is no terminal, printer or scanner to buy — which is why it can be free to start.' },
        { q: 'Does it work without internet?', a: 'Yes. AskBiz keeps working offline — sales are saved on the phone and sync automatically when the network returns, so a weak signal never costs you a sale.' },
        { q: 'Is it suitable for the TRA and VFD receipts?', a: 'AskBiz keeps a clean, complete record of every sale, which is what you need for the TRA, VAT and VFD receipting, or for handing figures to an accountant. It is designed so your records are ready rather than something you rebuild later.' },
      ]}
      cta={{
        heading: "Start taking mobile money on your phone — free",
        body: "No terminal, no monthly fee, no card to sign up. Add your first items and take your first M-Pesa sale in minutes.",
      }}
      relatedPages={[
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS (Kenya)' },
        { href: '/app-ya-duka', label: 'App ya kuuza duka (Kiswahili)' },
        { href: '/free-pos-uganda', label: 'Free POS app (Uganda)' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
      ]}
    />
  )
}
