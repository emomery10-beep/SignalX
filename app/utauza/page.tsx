import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Utauza — The East Africa Name for AskBiz | Phone POS with M-Pesa',
  description: 'Utauza is the East African name for AskBiz — “you will sell” in Kiswahili. A camera-first phone POS that takes M-Pesa, Airtel and MTN money for market stalls and shops. Free to start.',
  keywords: ['Utauza', 'Utauza app', 'Utauza AskBiz', 'Utauza POS', 'Utauza M-Pesa', 'AskBiz East Africa'],
  openGraph: {
    title: 'Utauza — The East Africa Name for AskBiz',
    description: 'Utauza (“you will sell”) is AskBiz for East Africa: a camera-first phone POS with M-Pesa. Free to start.',
    url: 'https://askbiz.co/utauza',
  },
  alternates: { canonical: 'https://askbiz.co/utauza' },
}

// Dedicated brand entity so search engines resolve "Utauza" to a real brand,
// with AskBiz declared as the same organisation (alternateName).
const utauzaSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://askbiz.co/#utauza',
      name: 'Utauza',
      alternateName: ['AskBiz', 'Utauza App', 'AskBiz East Africa'],
      url: 'https://askbiz.co/utauza',
      sameAs: ['https://askbiz.co'],
      description: 'Utauza is the East African name for AskBiz — a camera-first phone POS and daily business tracker that accepts M-Pesa, Airtel Money and MTN Mobile Money for market stalls, street vendors and small shops.',
      areaServed: ['KE', 'TZ', 'UG', 'RW', 'BI'],
      knowsLanguage: ['sw', 'en'],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://askbiz.co/utauza#webpage',
      url: 'https://askbiz.co/utauza',
      name: 'Utauza — The East Africa Name for AskBiz',
      inLanguage: 'en',
      about: { '@id': 'https://askbiz.co/#utauza' },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(utauzaSchema) }} />
      <SeoPage
        keyword="Utauza"
        h1="Utauza — Uza kwa Simu Yako. It's AskBiz for East Africa."
        subheading="Utauza means “you will sell” in Kiswahili. It's the East African name for AskBiz: a camera-first phone POS that takes M-Pesa, Airtel and MTN money for market stalls, kiosks and shops. Same app, same account — a name that speaks to the market."
        intro="Utauza and AskBiz are the same product. AskBiz is the global name; Utauza — Kiswahili for “you will sell” — is what it's called across East Africa, because a till for Kenyan and Tanzanian traders should carry a name traders recognise. Whether you find us as Utauza or AskBiz, you get the same thing: a phone-first point of sale built for market stalls, street vendors and small shops. Point your camera at a product to add it, take payment by M-Pesa, Airtel Money, MTN Mobile Money or cash, and see exactly what you made at the end of the day. No terminal, no spreadsheet, free to start. This page exists so that anyone searching for Utauza lands in the right place and knows it's AskBiz underneath."
        problem={{
          heading: "Why the name Utauza matters",
          body: "A trader in Nairobi or Dar es Salaam shouldn't have to translate an English product name before deciding whether a business tool is for them. “Utauza” — you will sell — says exactly what it does, in the language of the market. Global software rarely bothers; it ships one English name everywhere and hopes. We built the East African identity on purpose so the product feels like it belongs here, not like it was flown in. If you heard about Utauza from another vendor, a WhatsApp group, or a market, this is it.",
        }}
        solution={{
          heading: "One product, the name that fits your market",
          body: "Utauza is AskBiz with an East African name and an East-African-first design: M-Pesa, Airtel and MTN money native; Kiswahili in the app; offline support for weak networks; and a camera-first flow that works even if you'd rather not type. Sign in as Utauza or AskBiz and it's the same account, the same data, the same free-to-start plan. You can switch the app to Kiswahili, take mobile money from the first sale, and know your money tonight — under whichever name you found us.",
        }}
        features={[
          { icon: '🗣️', title: '“You will sell”', body: 'Utauza is Kiswahili for “you will sell” — the East African name for AskBiz, built for traders who speak the market’s language.' },
          { icon: '📲', title: 'M-Pesa, Airtel & MTN', body: 'Take mobile money natively across Kenya, Tanzania, Uganda and beyond, matched to each sale automatically.' },
          { icon: '📷', title: 'Camera-first till', body: 'Snap or scan a product to add it. Sell faster than writing it in a notebook — no hardware required.' },
          { icon: '🌍', title: 'Kiswahili built in', body: 'Use the app in Kiswahili, with the same account and data whether you call it Utauza or AskBiz.' },
          { icon: '📶', title: 'Offline ready', body: 'Keep selling with no signal; sales sync automatically when the network comes back.' },
          { icon: '🆓', title: 'Free to start', body: 'Sell, take mobile money and track your day on the free plan — no card, no terminal, no monthly fee.' },
        ]}
        howItWorks={[
          { step: '1', title: 'Open Utauza on your phone', body: 'Utauza and AskBiz are the same app — open it on any Android phone or iPhone and set the language to Kiswahili if you like.' },
          { step: '2', title: 'Add your goods', body: 'Snap or scan your products to build your list. AskBiz can name and price them from a photo.' },
          { step: '3', title: 'Sell and take M-Pesa', body: 'Ring up the basket, take M-Pesa, Airtel, MTN or cash, and the sale records itself.' },
          { step: '4', title: 'Know your money tonight', body: 'At close, see your takings, top sellers and what to restock — all on the same phone.' },
        ]}
        faqs={[
          { q: 'What is Utauza? Is it the same as AskBiz?', a: 'Yes — Utauza and AskBiz are the same product. AskBiz is the global name; Utauza is the East African name, Kiswahili for “you will sell”. Same app, same account, same data. If you find us under either name, you are in the right place.' },
          { q: 'What does “Utauza” mean?', a: '“Utauza” is Kiswahili for “you will sell”. We chose it as the East African name for AskBiz so that a point-of-sale tool for market traders carries a name that speaks to the market, rather than an English name that needs translating.' },
          { q: 'Which countries use the Utauza name?', a: 'Utauza is the name used across East Africa — Kenya, Tanzania, Uganda, Rwanda and Burundi — where Kiswahili is widely spoken. Elsewhere the product is known as AskBiz. The underlying app is identical.' },
          { q: 'Can I use the app in Kiswahili?', a: 'Yes. The app is available in Kiswahili, and you can switch languages in settings. Mobile money, offline support and the camera-first till all work the same in any language.' },
          { q: 'Does Utauza take M-Pesa?', a: 'Yes — M-Pesa, Airtel Money and MTN Mobile Money are supported natively, with each payment matched to its sale and your daily total automatically. There is no terminal to buy.' },
          { q: 'Is Utauza free?', a: 'Yes, it is free to start with no card required. You can sell, take mobile money and cash, track stock and see your daily takings on the free plan. Paid plans add unlimited AI questions, multiple branches and team seats.' },
        ]}
        cta={{
          heading: "Anza na Utauza — bure",
          body: "Utauza is AskBiz for East Africa. Add your goods, take M-Pesa, and know your money tonight — free to start, no card needed.",
        }}
        relatedPages={[
          { href: '/sw', label: 'AskBiz kwa Kiswahili' },
          { href: '/app-ya-duka', label: 'App ya kuuza duka' },
          { href: '/free-mpesa-pos', label: 'Free M-Pesa POS app' },
          { href: '/point-of-sale', label: 'Phone point of sale' },
        ]}
      />
    </>
  )
}
