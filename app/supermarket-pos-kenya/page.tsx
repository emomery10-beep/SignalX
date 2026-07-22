import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'Supermarket POS Kenya — Fast Checkout, Expiry Tracking | AskBiz',
  description: 'A supermarket POS system for Kenyan chains and high-volume stores: fast multi-item checkout, expiry and batch tracking for FMCG, AI bulk reorder suggestions, split payments, and multi-branch stock control.',
  keywords: ['supermarket POS Kenya', 'supermarket point of sale system', 'FMCG POS Kenya', 'expiry tracking POS', 'supermarket till system Kenya', 'multi-branch supermarket software'],
  openGraph: {
    title: 'Supermarket POS Kenya — Fast Checkout, Expiry Tracking',
    description: 'High-volume checkout, expiry and batch tracking, AI reorder suggestions, and split payments for Kenyan supermarkets and chains.',
    url: 'https://askbiz.co/supermarket-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/supermarket-pos-kenya', languages: buildSeoHreflangMap('supermarket-pos-kenya') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Supermarket POS Kenya"
      h1="Supermarket POS Kenya — Built for High-Volume, Fast-Moving Stock"
      subheading="Ring up long baskets fast, track expiry dates on every perishable batch, let AI tell you what to reorder before shelves go empty, and keep every branch of your chain on one dashboard."
      intro="A supermarket has a different problem to a small shop: volume. Dozens of items in a single basket, stock that turns over daily, perishables with real expiry dates attached, and customers who routinely want to split a bill between M-Pesa and cash because their mobile money balance doesn't quite cover the trolley. AskBiz is built to handle that volume on ordinary phones rather than requiring a bank of fixed terminals — fast multi-item scanning, batch and expiry tracking on FMCG lines, AI-driven bulk reorder suggestions, and split payments at the till, all working across as many branches as the chain has."
      problem={{
        heading: "Volume exposes the gaps that a small-shop till can get away with",
        body: "A system that works fine for a corner shop with twenty SKUs starts to strain at supermarket volume. Scanning needs to be fast enough that a queue doesn't build up behind a forty-item basket. Perishable stock — dairy, bread, produce — needs expiry dates tracked per batch, not just a total count, or it sits on the shelf past its date and becomes a write-off. Reordering by gut feel across hundreds of SKUs means some lines run out while others gather dust in the stockroom. And split payments — part M-Pesa, part cash, which is genuinely common when a shopper's mobile money balance falls just short — trip up systems that assume one payment method per transaction.",
      }}
      solution={{
        heading: "Fast checkout, batch-level tracking, and AI doing the reordering math",
        body: "AskBiz scans items with the phone camera fast enough to keep a supermarket queue moving, and every scan deducts stock in real time so the count on screen matches what's actually on the shelf. Perishable and FMCG lines can be tracked by batch with expiry dates attached, so a specific batch of stock — not just an SKU total — is visible and can be moved or discounted before it expires. AI looks at sales velocity and current stock across your SKUs and suggests bulk reorder quantities, rather than leaving a manager to eyeball hundreds of lines. At the till, split payments are native — a customer can pay part by M-Pesa and the balance in cash in the same transaction. And because most chains run more than one outlet, every branch reports into one consolidated dashboard with stock transfers logged between them.",
      }}
      features={[
        { icon: '⚡', title: 'Fast multi-item checkout', body: 'Scan long baskets quickly with the phone camera, keeping queues moving at peak hours.' },
        { icon: '📅', title: 'Expiry & batch tracking', body: 'Track perishable and FMCG stock by batch with expiry dates, not just a total count per SKU.' },
        { icon: '🤖', title: 'AI bulk reorder suggestions', body: 'AI reviews sales velocity across your SKUs and suggests reorder quantities before shelves go empty.' },
        { icon: '💳', title: 'Split payments', body: 'Accept part M-Pesa, part cash or card in the same transaction — a common request at the till.' },
        { icon: '🏪', title: 'Multi-branch consolidation', body: 'Run several outlets on one dashboard, with stock transfers between branches fully logged.' },
        { icon: '📦', title: 'Real-time stock deduction', body: 'Every sale updates stock instantly across hundreds of SKUs, so counts stay accurate all day.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Load your SKU catalogue', body: 'Add products with batch and expiry tracking enabled on perishable and FMCG lines.' },
        { step: '2', title: 'Set up your branches', body: 'Add each outlet with its own stock, staff, and till, all reporting to one dashboard.' },
        { step: '3', title: 'Check out fast, take split payments', body: 'Scan baskets quickly and accept M-Pesa, cash, or a split between them at the till.' },
        { step: '4', title: 'Let AI manage reordering', body: 'Review AI-suggested reorder quantities and expiry alerts before stock runs low or spoils.' },
      ]}
      faqs={[
        { q: 'Can AskBiz handle the checkout speed a supermarket needs?', a: 'Yes. Items are scanned with the phone camera and stock deducts in real time, which is built to keep pace with long, multi-item baskets rather than slow down at the till.' },
        { q: 'Does it track expiry dates on perishable stock?', a: 'Yes. Stock can be tracked by batch with expiry dates attached, so you can see which specific batch of a product is approaching its date rather than only a total count for the SKU.' },
        { q: 'How does the AI reorder suggestion work?', a: 'AI looks at how fast each SKU is selling against current stock levels and suggests bulk reorder quantities, so restocking decisions are based on your actual sales pattern rather than guesswork across hundreds of lines.' },
        { q: 'Can customers pay part M-Pesa and part cash?', a: 'Yes, split payments are supported at the till — a customer can cover part of the bill with M-Pesa and the remainder in cash or card in the same transaction.' },
        { q: 'We run several branches — can they all be managed together?', a: 'Yes. Multi-branch support lets each outlet keep its own stock and staff while stock transfers between branches are logged, and a consolidated dashboard shows sales and stock across the whole chain.' },
        { q: 'Does AskBiz produce records suitable for KRA or an accountant?', a: 'Yes. Every sale is logged as a clean, itemised digital record, which is the format needed for eTIMS-related bookkeeping or for handing figures to an accountant.' },
      ]}
      cta={{
        heading: "Run your supermarket on a system built for the volume",
        body: "Fast checkout, expiry-safe stock, and AI reorder suggestions across every branch. Start free, no card required.",
      }}
      relatedPages={[
        { href: '/retail-pos-kenya', label: 'Retail POS Kenya' },
        { href: '/point-of-sale/retail', label: 'Retail POS — full feature detail' },
        { href: '/inventory-management-kenya', label: 'Inventory management Kenya' },
        { href: '/pos-system-kenya', label: 'POS system Kenya' },
      ]}
    />
  )
}
