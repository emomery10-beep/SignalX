import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Retail POS Kenya — Phone-Based Till with M-Pesa | AskBiz',
  description: 'A retail point-of-sale system for Kenyan shops that runs on the phone you already own. Barcode scanning via camera, M-Pesa-first checkout, multi-branch stock transfers, and AI shrinkage alerts.',
  keywords: ['retail POS Kenya', 'POS system for shops Kenya', 'retail point of sale Kenya', 'shop till system Kenya', 'M-Pesa retail POS', 'clothing store POS Kenya'],
  openGraph: {
    title: 'Retail POS Kenya — Phone-Based Till with M-Pesa',
    description: 'Barcode scanning, M-Pesa-first checkout, and multi-branch stock transfers for Kenyan retail shops — no terminal required.',
    url: 'https://askbiz.co/retail-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/retail-pos-kenya' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Retail POS Kenya"
      h1="Retail POS Kenya — Built for How Kenyan Shops Actually Sell"
      subheading="Scan with the camera, take M-Pesa first, and watch stock update the moment a sale happens — across one shop or ten branches. No terminal, no barcode gun, no month-end surprises."
      intro="Retail in Kenya doesn't run the way a lot of point-of-sale software assumes it does. Customers pay by M-Pesa more often than cash or card, shops open a second or third branch long before they can afford a rack of tablets and barcode guns, and shrinkage — stock that quietly disappears between the shelf and the till — is a real cost, not a hypothetical one. AskBiz is a retail POS built around that reality. It runs on any Android phone or iPhone your staff already carry, uses the camera as the barcode scanner, and takes M-Pesa, Airtel Money and MTN Mobile Money as first-class payment methods rather than an afterthought bolted onto a card-first system."
      problem={{
        heading: "Generic POS software wasn't built for a mobile-money retail floor",
        body: "Most retail POS systems were designed around a card machine and a barcode scanner as separate purchases, with mobile money treated as an integration you configure later — if it's supported at all. For a Kenyan shop that means buying hardware you may not need, then still reconciling M-Pesa payments by hand at the end of the day because the till and the phone showing the M-Pesa confirmation are two different systems. Add a second branch and the problems compound: stock counts drift apart, nobody can see across locations without phoning each branch manager, and a consistent shrinkage pattern at one till can go unnoticed for months because no one is watching the numbers in real time.",
      }}
      solution={{
        heading: "One phone-based till, M-Pesa first, watching every branch",
        body: "AskBiz turns the phone at the counter into the scanner, the till, and the mobile money terminal at once. Point the camera at a barcode and the item, price and stock level update immediately — no separate scanner to buy or charge. M-Pesa, Airtel Money and MTN Mobile Money are accepted directly against the sale, so there's no gap between what the customer paid and what the till recorded. Running more than one branch is built in from the start: transfer stock between locations with a full log of what moved and when, and see a consolidated view of sales and stock across every site from a single dashboard. Underneath it all, AI reviews transactions for the patterns that usually point to shrinkage — unusual voids, repeated discounts, or price overrides — and flags them before they become a pattern of loss.",
      }}
      features={[
        { icon: '📷', title: 'Camera barcode scanning', body: 'Scan any product with the phone camera at the counter. No barcode gun to buy, charge, or lose.' },
        { icon: '📲', title: 'M-Pesa-first checkout', body: 'Take M-Pesa, Airtel Money, MTN Mobile Money, cash or card at the same till, matched automatically to the sale.' },
        { icon: '🔄', title: 'Multi-branch stock transfers', body: 'Move stock between branches and see a full audit trail of every transfer, in and out.' },
        { icon: '📦', title: 'Real-time stock levels', body: 'Every sale deducts from stock instantly, so what the app shows is what is actually on the shelf.' },
        { icon: '🤖', title: 'AI shrinkage & margin alerts', body: 'Unusual voids, repeated discounts, and price overrides are flagged automatically, branch by branch.' },
        { icon: '🏪', title: 'Consolidated branch dashboard', body: 'See sales, stock, and staff performance across every location without phoning each manager.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Set up your shop and branches', body: 'Add your first branch, then any additional ones. Each can have its own stock, staff, and till.' },
        { step: '2', title: 'Load your products', body: 'Scan existing barcodes with the camera or add items manually, with photos if you want them.' },
        { step: '3', title: 'Sell and take M-Pesa', body: 'Scan at the counter, take payment by M-Pesa, Airtel, MTN, cash or card, and the sale records itself.' },
        { step: '4', title: 'Watch stock and margins', body: 'Transfer stock between branches as needed, and let AI flag anything unusual before it costs you.' },
      ]}
      faqs={[
        { q: 'Do I need a barcode scanner or card machine to use AskBiz for retail?', a: 'No. The phone camera scans barcodes directly, and M-Pesa, Airtel Money and MTN Mobile Money are accepted natively, so there is no separate scanner or card terminal to buy.' },
        { q: 'Can I run more than one branch on the same account?', a: 'Yes. Multi-branch support is built in — each branch can have its own currency and tax settings if needed, stock can be transferred between branches with a full log, and you get one consolidated dashboard across all of them.' },
        { q: 'How does AskBiz help with shrinkage?', a: 'AI reviews transactions for the patterns that usually signal shrinkage — unusual voids, repeated discounts, or price overrides — and flags them so you can look into a specific till or shift rather than discovering a loss months later.' },
        { q: 'Is M-Pesa really built in, or do I still reconcile it by hand?', a: 'It is built in. When a customer pays by M-Pesa, Airtel Money or MTN Mobile Money, that payment is matched to the sale automatically, so you are not cross-checking mobile money statements against till receipts at the end of the day.' },
        { q: 'Can AskBiz help with reordering stock?', a: 'Yes. AI suggests reorder quantities based on your sales patterns and current stock levels, and low-stock alerts tell you before an item runs out.' },
        { q: 'Is there a free way to try this before paying for anything?', a: 'Yes. The free plan lets you run real sales, scan real barcodes, and take real M-Pesa payments with no credit card required. Paid tiers add unlimited AI questions, multi-branch, and team seats when you need them.' },
      ]}
      cta={{
        heading: "Put your retail shop on a phone-based till",
        body: "Scan with the camera, take M-Pesa without the reconciliation headache, and see every branch from one screen. Start free, no card required.",
      }}
      relatedPages={[
        { href: '/point-of-sale/retail', label: 'Retail POS — full feature detail' },
        { href: '/supermarket-pos-kenya', label: 'Supermarket POS Kenya' },
        { href: '/pos-system-kenya', label: 'POS system Kenya' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
      ]}
    />
  )
}
