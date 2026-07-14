import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Free POS App for Small Business in Nigeria — No Hardware | AskBiz',
  description: 'A free point-of-sale app for Nigeria: take bank transfers, OPay, PalmPay, Moniepoint, cash or card on any phone. No terminal, no monthly fee. Track sales and profit in Naira.',
  keywords: ['free POS app Nigeria', 'POS app for small business Nigeria', 'POS software Nigeria', 'bank transfer POS Nigeria', 'phone POS Naira', 'no hardware POS Lagos'],
  openGraph: {
    title: 'Free POS App for Small Business in Nigeria',
    description: 'Take bank transfers, OPay, PalmPay, cash or card on any phone. No terminal, free to start. Track profit in Naira.',
    url: 'https://askbiz.co/free-pos-nigeria',
  },
  alternates: { canonical: 'https://askbiz.co/free-pos-nigeria' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Free POS app Nigeria"
      h1="A Free POS App for Small Business in Nigeria — No Hardware"
      subheading="Turn your phone into a full till. Take instant bank transfers, OPay, PalmPay, Moniepoint, cash or card, track every sale, and see your profit in Naira. Free to start, no POS machine, no monthly fee."
      intro="In Nigeria, the word 'POS' usually means a rented terminal from an agent — a machine, a daily target, and a cut on every transaction. For a shop owner, a boutique, a pharmacy or a roadside seller who just wants to record sales and know their profit, that's the wrong tool. Meanwhile the free POS apps people find first — Loyverse, Square, GoDaddy — don't understand how Nigerians actually get paid: instant bank transfer, OPay, PalmPay, Moniepoint, and cash. AskBiz is built for the way money moves here. You open the app on any Android phone or iPhone, add your items by scanning or snapping a photo, and record the sale however the customer pays — transfer, wallet, cash or card. Nothing to rent, nothing to install beyond the app, and the free plan lets you run real sales without ever entering a card. It's a proper point-of-sale for Nigerian small businesses, priced for a market stall, not a bank."
      problem={{
        heading: "Why 'free POS' rarely means free in Nigeria",
        body: "The POS terminals you see everywhere belong to agents and payment companies — you rent the machine, hit a target, and pay a fee on every transaction. That's a payments business, not a way to run your own shop's books. The global free apps genuinely cost nothing but don't speak Naira workflows: no bank-transfer matching, no OPay or PalmPay, no cash-first design. So the average small business owner records nothing, or keeps a paper book, and never really knows which products make money once transfers, cash and 'I'll pay later' are all counted.",
      }}
      solution={{
        heading: "AskBiz records the sale, however the customer pays",
        body: "AskBiz isn't a terminal to rent — it's a till on your phone. Ring up the basket, then log the payment as bank transfer, OPay, PalmPay, Moniepoint, card or cash, and the sale is recorded against the right items and your daily total. Stock updates itself, credit ('pay later') is tracked, and at close of day you see what you sold, what you made in Naira, and what to restock. It works offline for when the network is down, keeps clean records for FIRS and VAT, and is free to start — you only pay for extras like unlimited AI questions, multiple branches or staff. No agent, no target, no cut of your sales.",
      }}
      features={[
        { icon: '🏦', title: 'Transfers, wallets, cash & card', body: 'Log bank transfer, OPay, PalmPay, Moniepoint, cash or card — each matched to the sale and your daily total.' },
        { icon: '📷', title: 'Camera is the scanner', body: 'Scan a barcode or snap a product photo to add items. No barcode gun, no separate hardware to buy.' },
        { icon: '🆓', title: 'Genuinely free to start', body: 'Run real sales on the free plan with no card and no trial countdown. No agent, no rental, no daily target.' },
        { icon: '🤝', title: 'Track “pay later”', body: 'Record credit customers and what they owe, so nothing slips through when someone promises to pay next week.' },
        { icon: '🧾', title: 'FIRS & VAT-ready records', body: 'Every sale is logged cleanly, so your books are ready for VAT, FIRS, or your accountant — not rebuilt later.' },
        { icon: '🌙', title: 'Know your profit tonight', body: 'See takings, best sellers and low stock in Naira at close of day — not weeks later in a notebook.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Open it on your phone', body: 'Works on any Android phone or iPhone. No terminal to rent, no setup fee, no agent agreement.' },
        { step: '2', title: 'Add your products', body: 'Scan barcodes, snap photos, or type them in. AskBiz can name and price items from a photo for you.' },
        { step: '3', title: 'Sell and log the payment', body: 'Ring up the basket, then tap how they paid — transfer, OPay, PalmPay, cash or card. The sale records itself.' },
        { step: '4', title: 'Check your day', body: 'At close, see what you sold, your profit in Naira, who owes you, and what is running low — all on one phone.' },
      ]}
      faqs={[
        { q: 'Is AskBiz really a free POS app for Nigeria?', a: 'Yes. The free plan lets you record sales, track stock and credit customers, and see your daily profit in Naira with no card and no trial countdown. Unlike rented POS terminals, there is no agent, no daily target, and no cut taken from your sales. You only pay if you add extras like unlimited AI questions, multiple branches or staff.' },
        { q: 'Which payment methods can I record?', a: 'You can record instant bank transfer, OPay, PalmPay, Moniepoint, card and cash. AskBiz matches each payment to the sale and your daily total, so your books balance without you reconciling transfers by hand at the end of the day.' },
        { q: 'Do I need a POS machine or terminal?', a: 'No. AskBiz turns the phone you already own into the till — the camera does the scanning and you simply log how the customer paid. There is no terminal to rent and no rental fee, which is why it can be free to start.' },
        { q: 'Can it track customers who pay later?', a: 'Yes. You can record credit sales and see exactly who owes what, so “I’ll pay next week” doesn’t quietly become a loss. It’s one of the most common ways small businesses lose money, and AskBiz keeps it visible.' },
        { q: 'Does it work when the network is down?', a: 'Yes. AskBiz keeps working offline — sales are saved on the phone and sync automatically when the connection returns, so you never lose a sale to a bad signal.' },
        { q: 'Is it suitable for FIRS and VAT?', a: 'AskBiz keeps a clean, complete record of every sale, which is exactly what you need for VAT, FIRS filings, or handing figures to an accountant. It is designed so your records are ready rather than something you rebuild at year end.' },
      ]}
      cta={{
        heading: "Run your own till — free",
        body: "No agent, no rented machine, no monthly fee. Add your items and record your first sale in Naira in minutes.",
      }}
      relatedPages={[
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS (Kenya)' },
        { href: '/free-pos-uganda', label: 'Free POS app (Uganda)' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
        { href: '/point-of-sale', label: 'Phone point of sale' },
      ]}
    />
  )
}
