import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'POS System Kenya — Mobile Money, Offline-Ready, Free to Start | AskBiz',
  description: 'A POS system built for how Kenyan businesses actually work: M-Pesa and Airtel Money built in, runs on the phone you already own, keeps selling with no signal, and free to start.',
  keywords: ['POS system Kenya', 'point of sale Kenya', 'POS Kenya', 'till system Kenya', 'M-Pesa POS system', 'business software Kenya'],
  openGraph: {
    title: 'POS System Kenya — Mobile Money, Offline-Ready, Free to Start',
    description: 'M-Pesa built in, works on any phone, keeps selling offline. The POS system built for how Kenyan businesses actually operate.',
    url: 'https://askbiz.co/pos-system-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/pos-system-kenya' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="POS System Kenya"
      h1="A POS System Built for How Kenyan Businesses Actually Work"
      subheading="M-Pesa and Airtel Money built in, runs on the phone you already carry, and keeps ringing up sales even when the network drops. One system for a single kiosk or a chain of branches — free to start, no terminal to buy."
      intro="'POS system' in Kenya usually means one of two things: an imported till built for a country where card payments are the norm, or a stripped-down inventory app with no way to take mobile money. Neither matches how business is actually done here — a customer paying by M-Pesa, a shopkeeper checking stock from their phone, a signal that comes and goes depending on the day. AskBiz is a POS system built the other way round, starting from mobile money and the phone in your pocket rather than bolting them on afterward. Whether you run a single shop, a market stall, a pharmacy counter, a restaurant, or several branches across town, the same system handles the sale, the stock, and the numbers — and it works whether you're online or not."
      problem={{
        heading: 'Most POS systems assume a shop that looks nothing like yours',
        body: "The POS software that shows up first in a search was usually built for a market with steady broadband, card terminals on every counter, and one currency to worry about. Bring it to Kenya and the cracks show fast: M-Pesa either isn't supported or is bolted on as an afterthought, the app grinds to a halt the moment 4G drops to nothing, and there's a card-machine or subscription cost before you've made a single sale. If you run more than one branch, most of these systems don't even try — you're left running separate logins and reconciling stock by phone call. A POS system for Kenya has to start from mobile money, patchy connectivity, and phone-only budgets — not treat them as edge cases.",
      }}
      solution={{
        heading: 'One system, built around mobile money and the phone you already have',
        body: "AskBiz runs entirely on a normal Android phone or iPhone — no terminal, no separate scanner, no dedicated hardware to buy or carry. It takes M-Pesa, Airtel Money, MTN Mobile Money, cash and card natively, matching each mobile money payment to the sale automatically instead of leaving you to reconcile it by hand at night. It keeps working with no signal at all: sales save to the phone and sync the moment connection returns, so a dead network in the middle of a busy afternoon doesn't cost you the sale. And if you're running more than one location, each branch can hold its own currency and tax setting, transfer stock between locations, and roll up into one dashboard — so growing from one till to five doesn't mean starting over with new software.",
      }}
      features={[
        { icon: '💳', title: 'M-Pesa, Airtel Money & cash, natively', body: 'Every payment type a Kenyan business actually takes is built in from day one — no separate mobile money reconciliation step.' },
        { icon: '📱', title: 'Runs on the phone you already own', body: 'No terminal, no card machine, no dedicated scanner. Android or iPhone, browser or app — that is the whole setup.' },
        { icon: '📶', title: 'Keeps selling with no signal', body: 'Sales are saved on the device the instant they happen and sync automatically once you are back online.' },
        { icon: '🏢', title: 'Ready for more than one branch', body: 'Per-branch currency and tax, stock transfers between locations, and one consolidated dashboard across all of them.' },
        { icon: '👥', title: 'Staff logins with real roles', body: 'Manager, cashier and inventory roles with phone OTP login, plus shift open/close and cash reconciliation.' },
        { icon: '🧠', title: 'Answers business questions in plain language', body: 'Ask what sold, what is running low, or what looks off, and get an answer from your own sales data — no spreadsheet required.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Sign up and set your business', body: 'Your currency is detected from your phone number automatically. Add your business name and you are ready to sell.' },
        { step: '2', title: 'Add your products', body: 'Scan barcodes with the camera, snap a photo, or type items in by hand — whichever is fastest for your shop.' },
        { step: '3', title: 'Sell, online or off', body: 'Take M-Pesa, Airtel Money, MTN, cash or card. If the network drops mid-sale, it still records and syncs later.' },
        { step: '4', title: 'Check the numbers, add branches as you grow', body: 'See daily takings and stock levels at a glance, and bring on more branches or staff whenever the business needs it.' },
      ]}
      faqs={[
        { q: 'Does AskBiz work as a POS for any type of business in Kenya?', a: 'Yes. The core system — mobile money, offline selling, stock tracking, staff roles — works the same whether you run a retail shop, a restaurant, a pharmacy, a supermarket counter, or a market stall. Some businesses use extra features suited to their type, but everyone starts from the same reliable base.' },
        { q: 'Do I need to buy any hardware to use it?', a: 'No. AskBiz runs on the Android phone or iPhone you already have. The camera acts as your barcode scanner, so there is no separate scanner, card machine, or till hardware to buy.' },
        { q: 'What happens to my sales if the internet goes down?', a: 'Nothing is lost. AskBiz keeps working offline using a local cache on the device, and every sale you make while offline syncs automatically the moment you are back on a network.' },
        { q: 'Can I run more than one branch on the same account?', a: 'Yes. Each branch can have its own currency and tax settings, you can transfer stock between branches, and everything rolls up into one dashboard so you can see the whole business at once.' },
        { q: 'Is there really a free plan, or is it a trial?', a: 'It is a real free plan, not a countdown. You can take actual mobile money and cash sales, track stock, and get 10 free AI questions a month with no credit card. Paid tiers add unlimited AI questions, multi-branch, and team seats when you need them.' },
        { q: 'Will this help with eTIMS or my accountant?', a: 'AskBiz keeps a clean, itemised digital record of every sale, which is exactly the kind of record you need for eTIMS bookkeeping or to hand to an accountant. It does not submit anything to KRA on your behalf — it makes sure your own records are accurate and ready.' },
      ]}
      cta={{
        heading: 'Start running your business on a POS system built for Kenya',
        body: 'M-Pesa built in, works on your phone, keeps selling offline. Set it up in minutes, no card required.',
      }}
      relatedPages={[
        { href: '/retail-pos-kenya', label: 'POS for retail shops' },
        { href: '/restaurant-pos-kenya', label: 'POS for restaurants' },
        { href: '/offline-pos-kenya', label: 'Offline POS in Kenya' },
        { href: '/kra-etims-pos', label: 'eTIMS-ready record keeping' },
      ]}
    />
  )
}
