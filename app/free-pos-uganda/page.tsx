import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Free POS App for Small Business in Uganda — No Hardware | AskBiz',
  description: 'A free point-of-sale app for Uganda: take MTN Mobile Money, Airtel Money, cash or card on any phone. No terminal, no monthly fee. Track sales and profit in shillings, offline-ready.',
  keywords: ['free POS app Uganda', 'POS app for small business Uganda', 'MTN Mobile Money POS', 'Airtel Money POS Uganda', 'phone POS shillings', 'no hardware POS Kampala'],
  openGraph: {
    title: 'Free POS App for Small Business in Uganda',
    description: 'Take MTN MoMo, Airtel Money, cash or card on any phone. No terminal, free to start. Track profit in shillings.',
    url: 'https://askbiz.co/free-pos-uganda',
  },
  alternates: { canonical: 'https://askbiz.co/free-pos-uganda' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Free POS app Uganda"
      h1="A Free POS App for Small Business in Uganda — No Hardware"
      subheading="Turn your phone into a full till. Take MTN Mobile Money, Airtel Money, cash or card, track every sale, and see your profit in Ugandan shillings. Free to start, no terminal, no monthly fee."
      intro="Most business in Uganda is paid for with mobile money — MTN MoMo and Airtel Money — yet the point-of-sale tools a shop owner finds first either ignore mobile money entirely (Loyverse, Square, GoDaddy) or come with a terminal, a subscription, and a setup fee. For a duka, a boutique, a bar, a pharmacy or a market seller in Kampala, Mbarara or Gulu, that's a poor fit. AskBiz is built for how Ugandans actually get paid. You open the app on any Android phone or iPhone, add your items by scanning a barcode or snapping a photo, and take payment by MTN Mobile Money, Airtel Money, cash or card — the sale records itself against the right products and your daily total. Nothing to rent, nothing to install beyond the app, and the free plan lets you run real sales without ever entering a card. It's a genuine POS for Ugandan small businesses, on the phone already in your pocket."
      problem={{
        heading: "Why the usual POS options don't fit a Ugandan duka",
        body: "A market seller or small duka can't justify a terminal that costs more than a week's takings, a monthly subscription, or an afternoon reading a manual. And the free global apps don't handle MTN MoMo or Airtel Money — the exact way most customers pay — so mobile money gets reconciled by hand, or not at all. The result is the same across the country: the business runs on a paper book, and the owner never really knows which lines make money once mobile money, cash and credit are all counted at the end of a busy day.",
      }}
      solution={{
        heading: "AskBiz is mobile-money-first and phone-first",
        body: "AskBiz takes MTN Mobile Money and Airtel Money natively — the customer pays and you record it in a tap, matched to the sale and your daily total, no manual reconciliation. It runs on the phone you already own, works offline when the network drops, and keeps clean records ready for URA and EFRIS. Stock updates itself, credit customers are tracked, and at close of day you see your takings, best sellers and low stock in shillings. The free plan covers all of this; you only pay for extras like unlimited AI questions, multiple branches or staff. It's the tool the global free apps can't be in Uganda, without the terminal the local ones demand.",
      }}
      features={[
        { icon: '📲', title: 'MTN MoMo & Airtel Money', body: 'Take both major mobile money rails natively — each payment matched to the sale and your daily total automatically.' },
        { icon: '📷', title: 'Camera is the scanner', body: 'Scan a barcode or snap a product photo to add items. No barcode gun, no separate hardware to buy.' },
        { icon: '🆓', title: 'Genuinely free to start', body: 'Run real sales on the free plan with no card and no trial countdown. Upgrade only when you want more.' },
        { icon: '🤝', title: 'Track credit customers', body: 'Record who has paid later and what they owe, so nothing is lost when a regular says “next time”.' },
        { icon: '🧾', title: 'URA & EFRIS-ready records', body: 'Every sale is logged cleanly, so your books are ready for EFRIS, URA and VAT rather than rebuilt at year end.' },
        { icon: '🌙', title: 'Know your profit tonight', body: 'See takings, best sellers and low stock in shillings at close of day — not weeks later in a book.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Open it on your phone', body: 'Works on any Android phone or iPhone. No terminal, no setup fee, no training.' },
        { step: '2', title: 'Add your products', body: 'Scan barcodes, snap photos, or type them in. AskBiz can name and price items from a photo for you.' },
        { step: '3', title: 'Sell and take mobile money', body: 'Ring up the basket, take MTN MoMo, Airtel Money, cash or card, and the sale records itself.' },
        { step: '4', title: 'Check your day', body: 'At close, see what you sold, your profit in shillings, who owes you, and what is running low — on one phone.' },
      ]}
      faqs={[
        { q: 'Is AskBiz really a free POS app for Uganda?', a: 'Yes. The free plan lets you record sales, take mobile money and cash, track stock and credit customers, and see your daily profit in shillings — with no card and no trial countdown. You only pay if you add extras like unlimited AI questions, multiple branches or staff. You can run a real business on the free plan.' },
        { q: 'Does it take MTN Mobile Money and Airtel Money?', a: 'Yes — both MTN MoMo and Airtel Money are supported natively. The customer pays and you record it in a tap, matched to the sale and your daily total, so you are not reconciling mobile money by hand at the end of the day.' },
        { q: 'Do I need a terminal or any equipment?', a: 'No. AskBiz turns the phone you already own into the till. The camera does the scanning, mobile money and cash do the payments, and there is no terminal, printer or scanner to buy — which is why it can be free to start.' },
        { q: 'Can it track customers who pay later?', a: 'Yes. You can record credit sales and see exactly who owes what, so “I’ll pay next time” stays visible instead of quietly becoming a loss.' },
        { q: 'Does it work without internet?', a: 'Yes. AskBiz keeps working offline — sales are saved on the phone and sync automatically when the network returns, so a weak signal never costs you a sale.' },
        { q: 'Is it suitable for URA and EFRIS?', a: 'AskBiz keeps a clean, complete record of every sale, which is what you need for EFRIS, URA and VAT, or for handing figures to an accountant. It is designed so your records are ready rather than something you rebuild later.' },
      ]}
      cta={{
        heading: "Start taking mobile money on your phone — free",
        body: "No terminal, no monthly fee, no card to sign up. Add your first items and take your first MoMo sale in minutes.",
      }}
      relatedPages={[
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS (Kenya)' },
        { href: '/free-pos-nigeria', label: 'Free POS app (Nigeria)' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
        { href: '/point-of-sale', label: 'Phone point of sale' },
      ]}
    />
  )
}
