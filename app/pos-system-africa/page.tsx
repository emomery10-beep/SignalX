import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'POS System for Africa — Mobile Money, Any Phone, Any Country | AskBiz',
  description: 'One POS system for businesses across Kenya, Nigeria, Uganda, Tanzania, Ghana and beyond. Local mobile money rails, works on any phone, stays online-or-off, 150+ currencies.',
  keywords: ['POS system Africa', 'African POS software', 'mobile money POS', 'point of sale Africa', 'POS Nigeria Kenya Uganda', 'cross border POS'],
  openGraph: {
    title: 'POS System for Africa — Mobile Money, Any Phone, Any Country',
    description: 'One POS system for Kenya, Nigeria, Uganda, Tanzania, Ghana and beyond — built around mobile money and phones that already exist.',
    url: 'https://askbiz.co/pos-system-africa',
  },
  alternates: { canonical: 'https://askbiz.co/pos-system-africa', languages: buildSeoHreflangMap('pos-system-africa') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="POS System Africa"
      h1="One POS System, Built for How Business Actually Happens Across Africa"
      subheading="Whether your customers pay by M-Pesa in Nairobi, OPay in Lagos, MTN MoMo in Kampala or Accra, or Airtel Money in Dar es Salaam, the same phone-based POS handles the sale, tracks the stock, and keeps working when the signal doesn't."
      intro="Most POS software sold internationally is built for one payment habit — a card tapped on a terminal — and Africa is treated as an afterthought market to patch on later. That ordering is backwards for a continent where mobile money, not cards, is how most people actually pay, and where a business in Lagos, Nairobi, Kampala, Dar es Salaam or Accra all need the same basic thing: a system that takes the payment method their customers actually use, runs on a phone that's already in their pocket, and doesn't fall over the moment the network gets patchy. AskBiz is built for that reality directly, not as a regional add-on. The specific mobile money rail changes by country — M-Pesa, Airtel Money, MTN Mobile Money, OPay and others — but the underlying system is the same everywhere: mobile-money-first, phone-first, and built to keep working offline."
      problem={{
        heading: "'Built for Africa' usually means 'built elsewhere, translated'",
        body: "A lot of POS software marketed to African businesses is a system designed for the US or Europe with a currency dropdown added on. That shows up in the details that matter most day to day: mobile money is either missing entirely or handled as a manual add-on step, the app assumes a steady connection that doesn't reflect daily reality in large parts of Nigeria, Kenya, Uganda, Tanzania or Ghana, and a business operating across more than one of these countries has no clean way to run all of it from one account without juggling separate currencies and separate logins. The result is software that technically works but never quite fits — you're adapting your business to the tool instead of the other way round.",
      }}
      solution={{
        heading: 'Mobile money and offline-first, wherever the business operates',
        body: "AskBiz starts from the payment methods people actually use in each market — M-Pesa and Airtel Money in Kenya and Tanzania, MTN Mobile Money in Uganda and Ghana, and the equivalent local rails elsewhere — and takes them natively, alongside cash and card. It runs on any Android phone or iPhone with no terminal to import or maintain, and it keeps working with no connection at all, saving sales locally and syncing automatically the moment signal returns — a patchy network is a daily reality across the continent, not a one-country problem. With 150+ currencies auto-detected from a phone number at signup, a business operating across borders — say, buying from Nigeria and selling in Ghana, or running branches in two countries — can manage all of it in one account instead of stitching together separate tools per market.",
      }}
      features={[
        { icon: '🌍', title: 'Local mobile money, wherever you operate', body: 'M-Pesa, Airtel Money, MTN Mobile Money and more — the rail that matches your customers, taken natively.' },
        { icon: '📱', title: 'One phone, no hardware to import', body: 'Runs on any Android phone or iPhone through the browser or app. No terminal to source, ship, or maintain.' },
        { icon: '📶', title: 'Built for patchy connectivity', body: 'Sales save locally and sync automatically when the network returns — wherever on the continent you are trading.' },
        { icon: '💱', title: '150+ currencies, auto-detected', body: 'Your currency is set from your phone number at signup, so cross-border and multi-country operators are covered from day one.' },
        { icon: '🏢', title: 'Multi-branch across markets', body: 'Per-branch currency and tax settings, stock transfers, and one dashboard — even if branches sit in different countries.' },
        { icon: '🧠', title: 'AI that reads your actual sales', body: 'Ask what is selling, what looks off, or what to reorder, and get answers grounded in your own data, not a generic report.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Sign up from your phone number', body: 'Your country and currency are detected automatically, so the right mobile money options appear from the start.' },
        { step: '2', title: 'Add your products', body: 'Camera-scan barcodes or snap photos to build your catalogue — no separate scanner needed.' },
        { step: '3', title: 'Take payment the way your customers pay', body: 'M-Pesa, Airtel Money, MTN MoMo, cash or card — whichever fits the sale, recorded automatically either way.' },
        { step: '4', title: 'Track it all, branch by branch or country by country', body: 'See daily performance per branch or roll it all up, even across currencies, in one dashboard.' },
      ]}
      faqs={[
        { q: 'Which countries does AskBiz actually support?', a: 'AskBiz is used by businesses across Kenya, Nigeria, Uganda, Tanzania, Ghana and other African markets, with 150+ currencies supported and local mobile money rails matched to each country.' },
        { q: 'Does it support mobile money everywhere, or just M-Pesa?', a: 'M-Pesa, Airtel Money and MTN Mobile Money are all supported natively, alongside cash and card, and coverage is matched to the mobile money habits of each market rather than treating one country as the default and the rest as exceptions.' },
        { q: 'Can I run branches in more than one country from one account?', a: 'Yes. Each branch can carry its own currency and tax setting, stock can transfer between branches, and everything rolls up into a single consolidated dashboard, which is useful for operators trading across borders.' },
        { q: 'Does it need a strong internet connection to work?', a: 'No. AskBiz is built to keep working when the connection drops — sales are saved on the device and sync automatically once you are back online, which matters across large parts of the continent where signal is inconsistent.' },
        { q: 'Do I need to buy a card machine or terminal?', a: 'No. AskBiz runs on the phone you already own, using the camera as a barcode scanner. There is no hardware to import, ship, or maintain, which keeps costs down and setup fast wherever you are.' },
        { q: 'Is the free plan available in every country, or just Kenya?', a: 'The free plan is available everywhere AskBiz operates — you can run real sales, track stock, and use 10 free AI questions a month with no credit card, regardless of which African market you are trading in.' },
      ]}
      cta={{
        heading: 'One POS system, built for how Africa actually trades',
        body: 'Mobile money native, works on any phone, keeps going offline. Set it up from your phone number in minutes.',
      }}
      relatedPages={[
        { href: '/free-pos-nigeria', label: 'Free POS app (Nigeria)' },
        { href: '/free-pos-uganda', label: 'Free POS app (Uganda)' },
        { href: '/free-pos-ghana', label: 'Free POS app (Ghana)' },
        { href: '/free-pos-tanzania', label: 'Free POS app (Tanzania)' },
        { href: '/pos-system-kenya', label: 'POS system for Kenya' },
        { href: '/demo', label: 'See a live country demo' },
      ]}
    />
  )
}
