import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'M-Pesa POS Integration — Auto-Match Payments to Sales | AskBiz',
  description: 'Already taking M-Pesa on your Till or Paybill? Wire it into a proper POS so payments auto-match to sales and stock, with no more checking SMS messages against a notebook.',
  keywords: ['M-Pesa POS integration', 'M-Pesa Till reconciliation', 'M-Pesa Paybill POS', 'M-Pesa Buy Goods system', 'mobile money reconciliation Kenya'],
  openGraph: {
    title: 'M-Pesa POS Integration — Payments Auto-Matched to Sales',
    description: 'Turn ad-hoc M-Pesa Till or Paybill takings into a proper system — no more manually checking SMS against a notebook.',
    url: 'https://askbiz.co/mpesa-pos-integration',
  },
  alternates: { canonical: 'https://askbiz.co/mpesa-pos-integration', languages: buildSeoHreflangMap('mpesa-pos-integration') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="M-Pesa POS integration"
      h1="Turn Your M-Pesa Till Into a Proper Point-of-Sale System"
      subheading="You're probably already taking M-Pesa on a Till or Paybill number. AskBiz wires that into a real system — payments auto-matched to sales and stock, so you stop scrolling through M-Pesa SMS messages trying to match them against a notebook."
      intro="Most small Kenyan businesses already accept M-Pesa — through a personal Till number, a Buy Goods number, or a Paybill — long before they have any kind of proper point-of-sale system. The M-Pesa side works fine on its own; the problem is everything around it. Every payment lands as a text message, and matching those messages to what was actually sold means either trusting memory or going line by line through the SMS inbox at the end of the day. AskBiz doesn't ask you to change how customers pay you — it connects to that same M-Pesa flow and does the matching automatically, so the payment, the sale, and the stock movement all land in one place without you touching a single text message."
      problem={{
        heading: "Taking M-Pesa isn't the same as running M-Pesa through a system",
        body: "A Till or Paybill number gets you paid, but it doesn't tell you what was sold, what's left in stock, or what today actually added up to. That work still happens manually — scrolling the M-Pesa SMS list, cross-checking amounts against what you remember selling, and writing a total in a notebook or a phone notes app. It's slow, it's easy to miss a payment or double-count one, and it tells you nothing about which products are moving or running low. The M-Pesa number is doing its job; there's just nothing behind it turning payments into real business information.",
      }}
      solution={{
        heading: "One system where the payment and the sale are already the same record",
        body: "With AskBiz, you ring up the sale on your phone as normal, the customer pays to your number, and the payment is matched to that specific sale automatically — no cross-checking SMS messages against anything. Stock deducts at the same moment, so your inventory count stays accurate without a separate stocktake. At the end of the day you get one number: total takings across M-Pesa, Airtel Money, MTN Mobile Money, cash and card combined, not four separate totals you have to add up yourself. It's the same M-Pesa usage you already have, wired into a system that actually accounts for it.",
      }}
      features={[
        { icon: '🔗', title: 'Payments auto-matched to sales', body: 'The M-Pesa payment to your number is matched to the specific sale automatically — no manual cross-checking of SMS messages.' },
        { icon: '📊', title: 'One combined daily total', body: 'M-Pesa, Airtel Money, MTN Mobile Money, cash and card all roll into a single daily takings figure, not separate tallies to add by hand.' },
        { icon: '📦', title: 'Stock updates the moment you sell', body: 'Every matched sale deducts stock in real time, so your inventory count reflects reality without a manual stocktake.' },
        { icon: '📱', title: 'No new Till or number needed', body: 'Keep using the M-Pesa Till, Paybill or Buy Goods number you already have — AskBiz builds a system around it, not a replacement for it.' },
        { icon: '🔍', title: 'See exactly what sold, not just what came in', body: 'Because the payment is tied to the actual items sold, you get a real product-level view, not just a pile of M-Pesa amounts.' },
        { icon: '📶', title: 'Keeps working if the network drops', body: 'Sales are recorded locally and synced when the connection returns, so a bad signal moment doesn\'t break your records.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Set up your business on AskBiz', body: 'Add your products and keep taking M-Pesa on the Till, Paybill or Buy Goods number you already use — nothing to migrate.' },
        { step: '2', title: 'Ring up the sale on your phone', body: 'Scan or select the items being sold, just like at any till, using your phone\'s camera and screen.' },
        { step: '3', title: 'Customer pays as usual', body: 'They pay M-Pesa, Airtel Money or MTN Mobile Money to your number exactly as before — the habit doesn\'t change.' },
        { step: '4', title: 'The match happens automatically', body: 'AskBiz matches the payment to the sale, deducts stock, and adds it to your combined daily total — no manual reconciliation.' },
      ]}
      faqs={[
        { q: 'Do I need a new M-Pesa Till or Paybill number to use this?', a: 'No. AskBiz works with the M-Pesa Till, Paybill or Buy Goods number you already have. You are not switching payment providers or getting a new number — you\'re adding a system on top of the M-Pesa usage you already do.' },
        { q: 'How is this different from just checking M-Pesa messages myself?', a: 'Checking messages by hand means matching amounts to sales from memory, one text at a time, usually at the end of a long day. AskBiz matches the payment to the specific sale the moment it happens, and folds it into stock and daily totals automatically — nothing to cross-check afterward.' },
        { q: 'Does it also handle cash and card, or only M-Pesa?', a: 'All of them. Cash, card, M-Pesa, Airtel Money and MTN Mobile Money all get recorded the same way, and roll up into one combined daily takings figure instead of separate totals you add up yourself.' },
        { q: 'Is this the same as the free M-Pesa POS page?', a: 'They cover different needs. Our free M-Pesa POS page is about starting from zero with a free till that happens to take M-Pesa. This page is for businesses already taking M-Pesa informally who want it wired into proper sales and stock tracking — the destination is the same app, just a different starting point.' },
        { q: 'What happens if a customer pays the wrong amount or I need to check a specific payment?', a: 'Because every sale carries its matched payment, timestamp and items, you can look up any transaction directly instead of hunting through your M-Pesa message history to find it.' },
        { q: 'Do I need new hardware to set this up?', a: 'No. It runs on the Android phone or iPhone you already have. There\'s no terminal, no card reader, and no separate barcode scanner — your phone\'s camera handles scanning.' },
      ]}
      cta={{
        heading: "Stop matching M-Pesa messages by hand",
        body: "Keep the Till or Paybill number you already use — let AskBiz match every payment to a sale automatically. Free to start, no card needed.",
      }}
      relatedPages={[
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS app' },
        { href: '/pos-system-kenya', label: 'POS system for Kenya' },
        { href: '/cloud-pos-kenya', label: 'Cloud POS Kenya' },
        { href: '/pricing', label: 'Pricing' },
      ]}
    />
  )
}
