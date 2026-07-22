import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'Inventory Management for Kenyan Businesses | AskBiz',
  description: 'Real-time stock deduction, low-stock alerts, expiry tracking, and AI reorder suggestions — built for Kenyan shops, kiosks and multi-branch businesses. No manual stock counts.',
  keywords: ['inventory management Kenya', 'stock control Kenya', 'low stock alerts Kenya', 'expiry tracking POS Kenya', 'multi-branch stock Kenya'],
  openGraph: {
    title: 'Inventory Management for Kenyan Businesses',
    description: 'Stock deducts automatically on every sale, with low-stock alerts, expiry tracking and reorder suggestions — no manual stocktakes.',
    url: 'https://askbiz.co/inventory-management-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/inventory-management-kenya', languages: buildSeoHreflangMap('inventory-management-kenya') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Inventory management Kenya"
      h1="Stock Control That Updates Itself, Sale by Sale"
      subheading="AskBiz deducts stock the moment a sale happens, warns you before you run out, tracks expiry dates on perishables, and suggests what to reorder — across one shop or several branches."
      intro="Most inventory problems in Kenyan shops and kiosks don't come from bad planning — they come from stock counts that are always slightly wrong by the time anyone checks them. A physical count taken on Monday is already out of date by Tuesday afternoon, and by the time someone notices an item is nearly finished, it's often already gone, or worse, the shop has kept over-ordering something that barely moves. AskBiz treats every sale as a stock event: the moment an item is sold, the count updates, so the number on your phone matches what's actually on the shelf without anyone doing a manual recount."
      problem={{
        heading: "Manual stock counts are always out of date",
        body: "A notebook or a once-a-week count tells you what stock looked like at the moment you checked it, not what it looks like now. Between checks, items sell out quietly, and the first sign is usually a customer asking for something that's already gone. On the other side, slow-moving stock sits unnoticed because nobody's tracking sell-through rate, just what's physically on the shelf. For businesses with perishables, there's a second layer of risk — stock that's still 'in count' but past its expiry date, which either gets sold by mistake or written off as a surprise loss. And for anyone running more than one branch, keeping counts consistent across locations by hand is close to impossible.",
      }}
      solution={{
        heading: "Stock updates itself — you just get told what to do about it",
        body: "Every sale in AskBiz deducts stock in real time, whether it was rung up with the camera scanner or picked from a list, so the count is always current without a manual recount. AskBiz flags items before they run out based on your actual sales pace, tracks expiry dates and batches so perishables get sold in the right order, and uses your sales history to suggest what and how much to reorder — rather than guessing. If you run more than one branch, stock transfers between them are logged with a full audit trail, and you get one consolidated view instead of checking each location separately.",
      }}
      features={[
        { icon: '⚡', title: 'Real-time deduction on every sale', body: 'Stock updates the instant an item is sold — no end-of-day reconciliation, no manual recount to trust the number.' },
        { icon: '🔔', title: 'Low-stock alerts before you run out', body: 'Get warned when an item is running low based on your actual sales pace, not a fixed threshold you have to guess and set.' },
        { icon: '📅', title: 'Expiry and batch tracking', body: 'Perishables are tracked by batch and expiry date, so older stock gets flagged to sell first and nothing expires unnoticed.' },
        { icon: '🤖', title: 'AI reorder suggestions', body: 'Reorder quantities are suggested based on how fast each item actually sells, not a flat rule that over- or under-stocks you.' },
        { icon: '🏬', title: 'Multi-branch stock transfers', body: 'Move stock between branches with a full audit trail, and see one consolidated stock picture across every location.' },
        { icon: '📷', title: 'Camera-based stock entry', body: 'Scan barcodes or snap a product photo to add or adjust stock — no separate barcode gun or manual typing required.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Add your products once', body: 'Scan barcodes or snap photos to get your stock list into AskBiz — including expiry dates for perishables where relevant.' },
        { step: '2', title: 'Sell as normal', body: 'Every sale, in-store or arranged elsewhere, deducts the right item from stock the moment it happens.' },
        { step: '3', title: 'Get alerted, not surprised', body: 'AskBiz flags low stock before you run out and highlights batches approaching their expiry date.' },
        { step: '4', title: 'Reorder and transfer with confidence', body: 'Use AI reorder suggestions based on real sales velocity, and move stock between branches with a logged transfer record.' },
      ]}
      faqs={[
        { q: 'Do I still need to do manual stock counts?', a: 'You shouldn\'t need to for day-to-day running, since every sale deducts stock automatically in real time. Many businesses still do an occasional physical count as a spot-check, but it stops being the only way you know what you have.' },
        { q: 'How do low-stock alerts decide when to warn me?', a: 'AskBiz looks at how fast each item is actually selling, so the alert accounts for real sales pace rather than a single fixed number you\'d have to set and adjust yourself for every product.' },
        { q: 'Can it track expiry dates for things like food or medicine?', a: 'Yes. You can record batches and expiry dates against stock, and AskBiz flags items approaching expiry so older batches get prioritized for sale and nothing quietly expires on the shelf.' },
        { q: 'How does the AI decide what to reorder?', a: 'It looks at your actual sales history for each item — how fast it moves, how often it sells out — and suggests a reorder quantity based on that pattern, rather than a flat rule that treats every product the same.' },
        { q: 'I run more than one shop — does stock stay separate per branch?', a: 'Each branch has its own stock count, and you can transfer stock between branches with a full record of what moved, when, and between which locations. You also get one consolidated view across all branches, not just per-branch totals.' },
        { q: 'Do I need a barcode scanner or special hardware?', a: 'No. Your phone\'s camera handles barcode scanning for both selling and stock entry — there\'s no separate scanner, terminal, or hardware to buy.' },
      ]}
      cta={{
        heading: "Stop guessing what's on the shelf",
        body: "Let every sale update your stock automatically, with alerts before you run out. Free to start, no card needed.",
      }}
      relatedPages={[
        { href: '/supermarket-pos-kenya', label: 'Supermarket POS Kenya' },
        { href: '/pharmacy-pos-kenya', label: 'Pharmacy POS Kenya' },
        { href: '/point-of-sale/feature/inventory', label: 'Inventory feature overview' },
        { href: '/pos-system-kenya', label: 'POS system for Kenya' },
      ]}
    />
  )
}
