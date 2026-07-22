import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'Best POS Kenya 2026 — What Actually Matters When Choosing One | AskBiz',
  description: "An honest buyer's guide to picking a POS in Kenya in 2026: mobile money support, offline reliability, no hardware lock-in, a real free tier, multi-branch readiness, and eTIMS-ready records.",
  keywords: ['best POS Kenya 2026', 'best POS system Kenya', 'how to choose a POS Kenya', 'POS comparison Kenya', 'top POS Kenya'],
  openGraph: {
    title: 'Best POS Kenya 2026 — What Actually Matters When Choosing One',
    description: "A buyer's guide to the criteria that actually matter for a POS in Kenya in 2026, not a feature checklist copied from elsewhere.",
    url: 'https://askbiz.co/best-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/best-pos-kenya', languages: buildSeoHreflangMap('best-pos-kenya') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Best POS Kenya 2026"
      h1="Best POS Kenya 2026: What Actually Matters When You're Choosing One"
      subheading="Not a top-10 list. A straight rundown of the six things that actually decide whether a POS works for a Kenyan business in 2026 — and where AskBiz stands on each one."
      intro="Search 'best POS Kenya 2026' and most of what comes back is a checklist of generic features — inventory management, reporting, receipt printing — lifted from software reviews written for a completely different market. None of that tells you whether the thing will actually work at your till on a Tuesday afternoon when the network drops and a customer is paying by M-Pesa. This page is a buyer's guide, not a ranking of named products: six criteria that matter specifically for a Kenyan business choosing a POS in 2026, what to actually check for each one, and how AskBiz measures up against its own claims — nothing more."
      problem={{
        heading: "Why most 'best POS' content doesn't fit how Kenyan businesses operate",
        body: "Most POS comparison content is a repackaged feature checklist — does it have reporting, does it have inventory, does it have a customer database — built for markets where card payment is the default and connectivity is a given. That checklist misses almost everything a business owner here actually needs to know. It won't tell you whether the software takes M-Pesa or just cash and card. It won't tell you what happens to a sale when the 4G drops mid-transaction. It won't mention that 'free trial' and 'free plan' are different things, or that a hardware terminal can cost more than a month of stock. A checklist copied from a different market answers questions nobody here is actually asking.",
      }}
      solution={{
        heading: "The criteria that actually matter, and how to check each one",
        body: "Judge a POS in Kenya on six things. First, does it take M-Pesa and Airtel Money natively, matching the payment to the sale automatically, or are you still reconciling mobile money by hand? Second, does it keep working with no signal, saving sales locally and syncing later, or does it freeze the moment the network drops? Third, is there a real hardware-free option, or does 'affordable' still mean a terminal costing tens of thousands of shillings upfront? Fourth, is the free plan an actual free plan — real sales, no credit card, no countdown — or a 14-day trial wearing a free label? Fifth, if you plan to grow past one till, can it handle multiple branches with their own settings and a combined view, or will you outgrow it in a year? Sixth, does it leave you with clean, itemised digital records you can hand to an accountant or use for eTIMS bookkeeping, instead of a jumble of paper and screenshots? AskBiz was built against exactly this list: M-Pesa, Airtel Money and MTN Mobile Money taken natively; full offline selling with automatic sync; zero required hardware, since the camera is the scanner; a free plan that runs real sales with 10 free AI questions a month; multi-branch support with per-branch currency, tax and stock transfers; and clean per-sale records ready to hand to an accountant or use in eTIMS bookkeeping.",
      }}
      features={[
        { icon: '📲', title: 'Mobile money taken natively', body: 'M-Pesa, Airtel Money and MTN Mobile Money are matched to the sale automatically — not a manual reconciliation step bolted on after.' },
        { icon: '📶', title: 'Genuinely works with no signal', body: 'Sales save on the phone the instant they happen and sync automatically once the connection returns.' },
        { icon: '🚫', title: 'No hardware lock-in', body: 'The camera is the barcode scanner. No terminal, no printer, no proprietary scanner required to get started.' },
        { icon: '🆓', title: 'A free plan, not a disguised trial', body: 'Run real sales, track real stock, and get 10 free AI questions a month with no credit card and no countdown clock.' },
        { icon: '🏢', title: 'Multi-branch from the same account', body: 'Per-branch currency and tax, stock transfers between locations, and one dashboard — ready before you need it.' },
        { icon: '🧾', title: 'Records ready for eTIMS and your accountant', body: 'Every sale is logged cleanly, so handing figures over at tax time is a export, not a reconstruction project.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Check mobile money support first', body: "If M-Pesa or Airtel Money isn't native, everything else about the software is secondary — you'll be reconciling by hand." },
        { step: '2', title: 'Test it with the network off', body: 'Turn off your data and try to ring up a sale. If it stops working, it will stop working at the worst possible moment.' },
        { step: '3', title: 'Ask what the free plan actually includes', body: "Real sales with no card required, or a countdown to a paywall? Read what happens after day 14, not just day one." },
        { step: '4', title: 'Think one step past where you are today', body: 'If a second branch or extra staff member is even a possibility this year, check that the software handles it before you need it, not after.' },
      ]}
      faqs={[
        { q: 'Is this page ranking specific POS products against each other?', a: "No. This is a buyer's guide to the criteria that matter when choosing a POS in Kenya, not a ranked list naming and comparing other products. We think AskBiz meets these criteria well, and we've explained exactly how — you can apply the same six checks to anything else you're considering." },
        { q: "What's the single biggest thing to check first?", a: "Mobile money support, specifically whether M-Pesa and Airtel Money payments are matched to sales automatically. If that's missing or manual, no other feature makes up for it in daily use." },
        { q: 'Is a free trial the same as a free plan?', a: "No, and this is where a lot of 'free' POS marketing is misleading. A trial ends and asks for payment; AskBiz's free plan runs real sales indefinitely, with 10 free AI questions a month and no credit card required — you only pay to add extras like unlimited AI questions or multi-branch." },
        { q: 'Why does offline support matter so much for a 2026 buying decision?', a: "Connectivity in many parts of Kenya is still inconsistent, and a POS that stops working without signal means lost sales during exactly the busy moments you can least afford it. AskBiz saves sales locally and syncs automatically once you're back online." },
        { q: 'Does AskBiz handle KRA and eTIMS requirements?', a: "AskBiz keeps a clean, itemised digital record of every sale, which is what you need for eTIMS bookkeeping or to hand to an accountant. It doesn't submit invoices to KRA or connect KRA credentials directly — it makes sure your own records are accurate and ready when you need them." },
        { q: 'What if I only run one till and never plan to grow?', a: "Then the multi-branch criterion matters less to you today — but it costs nothing to pick software that could still handle it later. The other five criteria (mobile money, offline reliability, no hardware lock-in, a real free tier, and clean records) matter regardless of size." },
      ]}
      cta={{
        heading: 'See how AskBiz measures up for yourself',
        body: 'Try the free plan with real sales — no card, no trial countdown — and test it against the criteria that actually matter for your business.',
      }}
      relatedPages={[
        { href: '/pos-system-kenya', label: 'POS system for Kenya' },
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS app' },
        { href: '/offline-pos-kenya', label: 'Offline POS in Kenya' },
        { href: '/pricing', label: 'See pricing' },
      ]}
    />
  )
}
