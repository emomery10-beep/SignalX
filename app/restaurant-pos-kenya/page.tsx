import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'Restaurant POS Kenya — Tables, Kitchen Orders & M-Pesa | AskBiz',
  description: 'A restaurant POS built for Kenyan cafes and eateries: table management, kitchen order routing with no extra hardware, split M-Pesa bills, and offline selling when the wifi drops.',
  keywords: ['restaurant POS Kenya', 'cafe POS Kenya', 'restaurant till Kenya', 'M-Pesa restaurant billing', 'kitchen order system Kenya', 'split bill M-Pesa'],
  openGraph: {
    title: 'Restaurant POS Kenya — Tables, Kitchen Orders & M-Pesa',
    description: 'Run a Kenyan restaurant or cafe from one phone: tables, kitchen routing, split M-Pesa bills, and offline selling.',
    url: 'https://askbiz.co/restaurant-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/restaurant-pos-kenya', languages: buildSeoHreflangMap('restaurant-pos-kenya') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Restaurant POS Kenya"
      h1="Restaurant POS Kenya — Tables, Kitchen Orders & Split M-Pesa Bills"
      subheading="Run a cafe, eatery or restaurant from the phone behind the counter. Open tables, send orders straight to the kitchen, let each diner pay their own M-Pesa, and keep taking orders even when the wifi cuts out."
      intro="Most restaurants in Kenya still run on a paper order pad and a separate calculator for the bill — or a POS system built for a different market, where a printed KDS terminal in the kitchen and a single group payment are assumed. Neither fits how a Nairobi cafe or a Mombasa nyama choma joint actually works: orders need to reach the kitchen fast, the bill often needs splitting between diners who each pay their own M-Pesa, and the router or wifi at the till is not always reliable, especially during a busy dinner service. AskBiz runs the whole front-of-house and kitchen flow from a phone, with mobile money and offline selling built in from the start rather than bolted on."
      problem={{
        heading: 'Paper pads, one bill, and a wifi router that picks the worst moment to drop',
        body: "A waiter takes an order by hand, walks it to the kitchen, and hopes it's read correctly. The bill for a table of six gets added up on a phone calculator, and when three of them want to pay their own share by M-Pesa, someone has to do the maths on paper and cross their fingers the numbers match what came in on M-Pesa. Then, on a busy Friday night, the wifi drops for ten minutes and the till software — built assuming a constant connection — stops taking orders altogether, right when the restaurant is fullest and can least afford to stop.",
      }}
      solution={{
        heading: 'Tables, kitchen and billing on one phone — working even when the network is not',
        body: "AskBiz turns the phone at the till (or in a waiter's hand) into the whole front-of-house system. Open a table, add covers, and send the order to the kitchen the moment it's rung up — no separate kitchen display terminal to buy, no ticket to hand-write. When the bill comes, split it by item or equally across diners, and each person can pay their own share by M-Pesa, Airtel Money or MTN Mobile Money straight to your number, matched automatically to their portion of the table. And because AskBiz caches the app and queues sales on the device, a dropped wifi connection mid-service doesn't stop you taking orders — everything syncs the moment the connection is back.",
      }}
      features={[
        { icon: '🍽️', title: 'Table & cover management', body: 'Open a table, seat the covers, and manage multiple tables at once from a single phone screen.' },
        { icon: '🧾', title: 'Kitchen order routing, no extra hardware', body: 'Orders route to the kitchen the moment they are rung up — no separate KDS terminal or printer to buy.' },
        { icon: '💳', title: 'Split-bill, split M-Pesa', body: 'Split the bill by item or equally across diners. Each person can pay their own share by M-Pesa, Airtel or MTN to your number.' },
        { icon: '📶', title: 'Keeps taking orders when wifi drops', body: 'A dropped connection mid-service does not stop the till — orders and sales queue on the phone and sync when signal returns.' },
        { icon: '🍷', title: 'Menu builder with modifiers', body: 'Build your menu with categories, extras and swaps, and run daily specials without reprinting a physical menu.' },
        { icon: '🗑️', title: 'Food waste tracking', body: 'Log wastage by dish and shift, with AI flagging when waste on an item starts creeping above your normal baseline.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Open the till on any phone', body: 'No terminal or kitchen hardware to install — AskBiz runs in the browser on the phone you already have.' },
        { step: '2', title: 'Seat a table and take the order', body: 'Open the table, add covers, and ring up dishes. The order routes straight to the kitchen.' },
        { step: '3', title: 'Bill and take payment', body: 'Split the bill by item or equally, and let each diner pay their own portion by M-Pesa, Airtel, MTN, cash or card.' },
        { step: '4', title: 'Review the night', body: 'See covers served, revenue per table, top dishes and any waste flags once service is done.' },
      ]}
      faqs={[
        { q: 'Do I need to buy a kitchen display screen?', a: 'No. Orders route from the till to the kitchen inside AskBiz itself — you can view them on a phone or tablet in the kitchen. There is no separate KDS hardware to purchase or wire up.' },
        { q: 'Can each diner pay their own M-Pesa share?', a: 'Yes. Split the bill by item or equally across the table, and each diner can pay their own portion by M-Pesa, Airtel Money or MTN Mobile Money to your number, matched to their share of the bill.' },
        { q: 'What happens if the restaurant wifi drops mid-service?', a: 'AskBiz keeps working. A service worker caches the app and an IndexedDB store on the phone queues any orders or sales taken while offline. The moment connectivity returns, everything syncs automatically — no lost orders and no lost sales.' },
        { q: 'Can I run daily specials and modifiers?', a: 'Yes. The menu builder supports categories, modifiers like extras and swaps, and daily specials, so you are not stuck reprinting a physical menu every time something changes.' },
        { q: 'Does it track food waste?', a: 'Yes. You can log wastage by dish and shift, and AI flags it when waste on a particular item rises above what is normal for your kitchen, so it does not go unnoticed for weeks.' },
        { q: 'Is this only for restaurants, or does it cover cafes and smaller eateries too?', a: 'It covers both. A single-till cafe uses the same order-and-bill flow with fewer tables; a larger restaurant uses the same system across more covers and staff, with the option to add multiple branches later.' },
      ]}
      cta={{
        heading: 'Run your restaurant on one phone — free to start',
        body: 'Tables, kitchen orders, split M-Pesa bills, and offline selling that keeps working when the wifi doesn\'t. No hardware to buy.',
      }}
      relatedPages={[
        { href: '/point-of-sale/restaurant', label: 'Restaurant POS — full feature guide' },
        { href: '/cloud-pos-kenya', label: 'Cloud POS Kenya' },
        { href: '/offline-pos-kenya', label: 'Offline POS Kenya' },
        { href: '/pos-system-kenya', label: 'POS system Kenya' },
      ]}
    />
  )
}
