import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'Pharmacy POS Kenya — Batch & Expiry Tracking, M-Pesa | AskBiz',
  description: 'A pharmacy POS system for Kenyan chemists and drug stores: batch and expiry-date tracking for medicine stock, low-stock alerts, clean per-sale digital records, M-Pesa-first checkout, and multi-branch support.',
  keywords: ['pharmacy POS Kenya', 'chemist POS system', 'pharmacy point of sale Kenya', 'medicine stock tracking software', 'drug store till system Kenya', 'pharmacy inventory Kenya'],
  openGraph: {
    title: 'Pharmacy POS Kenya — Batch & Expiry Tracking, M-Pesa',
    description: 'Batch and expiry tracking for medicine stock, low-stock alerts, and M-Pesa-first checkout for Kenyan pharmacies and chemists.',
    url: 'https://askbiz.co/pharmacy-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/pharmacy-pos-kenya', languages: buildSeoHreflangMap('pharmacy-pos-kenya') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Pharmacy POS Kenya"
      h1="Pharmacy POS Kenya — Stock Records That Take Expiry Seriously"
      subheading="Track medicine stock by batch and expiry date, get low-stock alerts before essential lines run out, and keep a clean digital record of every sale — on a phone, with M-Pesa built in."
      intro="A pharmacy carries a kind of risk a general shop doesn't: stock that expires, and stock that customers genuinely need to be there when they ask for it. Selling expired medicine is a real safety and financial problem, and running out of a commonly requested drug sends a customer straight to the pharmacy down the road. AskBiz is a point-of-sale and inventory system built around that reality — batch and expiry-date tracking on every line, low-stock alerts before a shelf goes empty, and a clean digital record of every sale, running on the phone behind the counter rather than a dedicated pharmacy terminal."
      problem={{
        heading: "Expiry and stock-outs are the two ways a pharmacy loses money and trust",
        body: "Generic retail tills track how many units of an item you have, not which batch they came from or when that batch expires. For most shops that's fine. For a pharmacy it means expired stock can sit on the shelf undetected until a customer — or a routine check — finds it, at which point it's a write-off at best and a serious problem at worst. The opposite failure is just as damaging: an essential medicine quietly running out because nobody was tracking the reorder point closely enough, so a regular customer is turned away. On top of that, pharmacies still need clean, itemised sales records for their own bookkeeping and for handing to an accountant, which a paper till roll or a notebook doesn't provide.",
      }}
      solution={{
        heading: "Batch-level tracking, low-stock alerts, and records ready when you need them",
        body: "AskBiz tracks pharmacy stock by batch, with expiry dates attached to each one, so a specific batch approaching its date is visible on the dashboard rather than buried inside a total unit count. Low-stock alerts flag essential lines before they run out, based on your actual sales pace rather than a fixed guess. Every sale — prescription or over-the-counter — is recorded as a clean, itemised digital entry, which is exactly the kind of record needed for day-to-day bookkeeping or for an accountant preparing your figures. Checkout takes M-Pesa, Airtel Money, MTN Mobile Money, cash or card on the same phone the counter staff already carry, and if the pharmacy runs more than one branch, stock and sales consolidate into one dashboard across all of them. AskBiz keeps the stock records; it is not a substitute for your pharmacy's own regulatory or dispensing obligations.",
      }}
      features={[
        { icon: '📅', title: 'Batch & expiry tracking', body: 'Every stock line is tracked by batch with its expiry date, so ageing stock is visible before it becomes a write-off.' },
        { icon: '🔔', title: 'Low-stock alerts', body: 'Get flagged before an essential medicine runs out, based on your actual sales pace.' },
        { icon: '🧾', title: 'Clean digital sales records', body: 'Every sale is logged as an itemised digital entry, ready for bookkeeping or your accountant.' },
        { icon: '📲', title: 'M-Pesa-first checkout', body: 'Take M-Pesa, Airtel Money, MTN Mobile Money, cash or card at the same counter, on the same phone.' },
        { icon: '🏪', title: 'Multi-branch support', body: 'Run several branches of a pharmacy chain with stock transfers and one consolidated dashboard.' },
        { icon: '🤖', title: 'AI reorder suggestions', body: 'AI suggests reorder quantities from sales history, so restocking isn\'t left to guesswork.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Load your stock with batch details', body: 'Add products with batch numbers and expiry dates so every line is traceable from the start.' },
        { step: '2', title: 'Sell at the counter', body: 'Ring up items with the phone camera, take M-Pesa, Airtel, MTN, cash or card, and stock deducts instantly.' },
        { step: '3', title: 'Watch expiry and stock alerts', body: 'Get flagged when a batch is approaching expiry or a line is running low before customers notice.' },
        { step: '4', title: 'Pull clean records at month-end', body: 'Every sale is already itemised and ready to hand to your accountant or use for your own bookkeeping.' },
      ]}
      faqs={[
        { q: 'Does AskBiz track medicine expiry dates?', a: 'Yes. Stock is tracked by batch with an expiry date attached to each batch, so ageing stock is visible on the dashboard rather than hidden inside a total unit count for the item.' },
        { q: 'Will it warn me before essential medicines run out?', a: 'Yes. Low-stock alerts are generated based on your actual sales pace, so you can reorder a commonly requested line before it disappears from the shelf.' },
        { q: 'Is AskBiz certified by the Pharmacy and Poisons Board or similar regulators?', a: 'No. AskBiz is a point-of-sale and stock-tracking system — it keeps clean batch, expiry, and sales records, but it is not a regulatory certification and does not replace your pharmacy\'s own compliance and dispensing obligations.' },
        { q: 'Does it produce records suitable for KRA or an accountant?', a: 'Yes. Every sale is logged as a clean, itemised digital record, which is the kind of record needed for eTIMS-related bookkeeping or for handing over to an accountant. AskBiz does not submit anything to KRA on your behalf.' },
        { q: 'Can a pharmacy chain run multiple branches on one account?', a: 'Yes. Multi-branch support lets each branch keep its own stock and staff, with stock transfers between branches logged and a consolidated dashboard across the whole chain.' },
        { q: 'Does it accept M-Pesa at the counter?', a: 'Yes. M-Pesa, Airtel Money and MTN Mobile Money are accepted natively alongside cash and card, matched automatically to the sale.' },
      ]}
      cta={{
        heading: "Keep pharmacy stock and records under control",
        body: "Batch and expiry tracking, low-stock alerts, and clean sales records on the phone behind your counter. Start free, no card required.",
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
