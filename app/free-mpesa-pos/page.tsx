import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Free POS App That Takes M-Pesa — No Hardware | AskBiz',
  description: 'A free point-of-sale app that accepts M-Pesa, Airtel Money and MTN MoMo on any phone. No terminal, no card machine, no monthly fee to start. Sell and track profit from your pocket.',
  keywords: ['free POS app M-Pesa', 'M-Pesa POS', 'free point of sale Kenya', 'POS app no hardware', 'mobile money till', 'phone POS Kenya'],
  openGraph: {
    title: 'Free POS App That Takes M-Pesa — No Hardware',
    description: 'Turn any phone into a till that accepts M-Pesa, Airtel and MTN money. Free to start, no terminal required.',
    url: 'https://askbiz.co/free-mpesa-pos',
  },
  alternates: { canonical: 'https://askbiz.co/free-mpesa-pos' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Free M-Pesa POS app"
      h1="The Free POS App That Takes M-Pesa — No Hardware Needed"
      subheading="Turn the phone in your pocket into a full till. Accept M-Pesa, Airtel Money, MTN MoMo, cash or card, track every sale, and see exactly what you made today. Free to start, no card machine, no monthly fee."
      intro="Most point-of-sale systems in Kenya were built for shops that can afford a terminal, a monthly subscription, and a bit of training. A free POS app that actually accepts M-Pesa on the phone you already own is rare — most of the ones people find first (Loyverse, Square, GoDaddy) don't support mobile money at all. AskBiz is built the other way round: mobile money first, hardware never. You open the app on any Android or iPhone, add your items or scan them with the camera, and take payment by M-Pesa, Airtel Money, MTN Mobile Money, cash or card. There is nothing to buy and nothing to install beyond the app, and the free plan is genuinely free — you can run real sales through it without ever entering a card."
      problem={{
        heading: "Why 'free M-Pesa POS' is so hard to actually find",
        body: "Search for a free POS in Kenya and you hit two walls. The global free apps — Loyverse, Square, GoDaddy — are genuinely free but have no M-Pesa, so you're stuck reconciling mobile money by hand. The local ones that do support M-Pesa usually want a terminal (KES 6,000–45,000 upfront), a monthly fee, or both, and 'free' turns out to mean a 14-day trial. For a stall owner, a kiosk, or a new business testing whether an app is even worth it, that's a dead end. You end up back in the notebook.",
      }}
      solution={{
        heading: "AskBiz is mobile-money-first and phone-first",
        body: "AskBiz accepts M-Pesa, Airtel Money and MTN Mobile Money natively — the customer pays to your number, you confirm, and the sale is recorded against the right items automatically. No terminal to rent, no printer to buy, no reconciliation at the end of the day. It works on any phone, online or offline, and syncs when you get signal. The free plan lets you sell, track stock, and see your daily takings; you only pay if you want the extras like unlimited AI questions, multi-branch, or team seats. It's the tool the global free apps can't be in East Africa, without the hardware the local ones demand.",
      }}
      features={[
        { icon: '📲', title: 'M-Pesa, Airtel & MTN built in', body: 'Take mobile money natively — the payment is matched to the sale and your daily total, no manual reconciliation.' },
        { icon: '📷', title: 'Your camera is the scanner', body: 'Scan a barcode or snap a product photo to add items. No barcode gun, no separate scanner to buy.' },
        { icon: '🆓', title: 'Genuinely free to start', body: 'Run real sales on the free plan with no card and no trial countdown. Upgrade only when you want more.' },
        { icon: '📶', title: 'Works offline', body: 'Keep selling when the network drops. Sales are saved on the phone and sync automatically when signal returns.' },
        { icon: '🧾', title: 'KRA-ready records', body: 'Every sale is logged cleanly so your records are ready when it is time for eTIMS, VAT, or your accountant.' },
        { icon: '🌙', title: 'Know your money tonight', body: 'See takings, top sellers and low stock at the end of each day — not weeks later in a spreadsheet.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Download and open on your phone', body: 'Works on any Android phone or iPhone through the browser or app. No hardware, no setup fee, no training.' },
        { step: '2', title: 'Add your products', body: 'Scan barcodes, snap photos, or type them in. AskBiz can even name and price items from a photo for you.' },
        { step: '3', title: 'Sell and take M-Pesa', body: 'Ring up the basket, take payment by M-Pesa, Airtel, MTN, cash or card, and the sale records itself.' },
        { step: '4', title: 'Check your day', body: 'At close, see what you sold, what you made, and what is running low — all on the same phone.' },
      ]}
      faqs={[
        { q: 'Is AskBiz really a free POS app?', a: 'Yes. The free plan lets you sell, take mobile money and cash, track stock, and see your daily takings with no credit card and no trial countdown. You only pay if you choose to add extras like unlimited AI questions, multiple branches, or team seats. You can run a real business on the free plan.' },
        { q: 'Does it actually accept M-Pesa?', a: 'Yes — M-Pesa, Airtel Money and MTN Mobile Money are supported natively. The customer pays to your number and the payment is matched to the sale and your daily total automatically, so you are not reconciling mobile money by hand at the end of the day.' },
        { q: 'Do I need a card machine or terminal?', a: 'No. AskBiz turns the phone you already own into the till. There is no terminal to rent, no printer to buy, and no barcode scanner required — the camera does the scanning. That is the main reason it can be free where hardware-based systems cannot.' },
        { q: 'Will it work if my internet is slow or off?', a: 'Yes. AskBiz keeps working offline — sales are saved on the phone and sync automatically when the network comes back. You will not lose a sale because the signal dropped in the middle of a busy market.' },
        { q: 'Is it KRA and eTIMS friendly?', a: 'AskBiz keeps a clean record of every sale, which is exactly what you need when it is time for eTIMS, VAT, or handing figures to an accountant. It is designed so your records are ready rather than something you have to rebuild later.' },
        { q: 'Which countries and currencies does it support?', a: 'AskBiz works across Kenya, Nigeria, Uganda, Tanzania and beyond, with 150+ currencies and the local mobile money rails for each market (M-Pesa, Airtel Money, MTN MoMo and more). Your currency is set automatically from your phone number when you sign up.' },
      ]}
      cta={{
        heading: "Start taking M-Pesa on your phone — free",
        body: "No terminal, no monthly fee, no card to sign up. Add your first items and take your first M-Pesa sale in minutes.",
      }}
      relatedPages={[
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
        { href: '/free-pos-nigeria', label: 'Free POS app (Nigeria)' },
        { href: '/free-pos-uganda', label: 'Free POS app (Uganda)' },
        { href: '/demo/kenya', label: 'See the Kenya demo' },
      ]}
    />
  )
}
