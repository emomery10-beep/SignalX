import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'One System for In-Store and WhatsApp/Instagram Orders | AskBiz',
  description: 'Selling in person and taking orders on WhatsApp or Instagram? Track every sale, stock count and profit number in one place, whichever channel the sale came from.',
  keywords: ['ecommerce POS Kenya', 'WhatsApp orders inventory', 'Instagram shop stock Kenya', 'online orders POS Kenya', 'multi-channel selling Kenya'],
  openGraph: {
    title: 'One Place to Track Every Sale — In-Store or Online',
    description: 'Whether a sale happened at the counter or was arranged on WhatsApp or Instagram, it hits the same stock count and the same daily profit number.',
    url: 'https://askbiz.co/ecommerce-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/ecommerce-pos-kenya', languages: buildSeoHreflangMap('ecommerce-pos-kenya') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Ecommerce & online orders POS Kenya"
      h1="One Stock Count and One Profit Number — Whether You Sold In Person or on WhatsApp"
      subheading="For most small Kenyan sellers, 'selling online' means taking orders through WhatsApp or Instagram DMs, not running a website. AskBiz lets you record those sales in the same place as your in-person ones, so your stock and your daily profit are never split across two systems."
      intro="Ask a market vendor or small shop owner in Kenya whether they sell online, and most will say yes — but what they mean is customers messaging them on WhatsApp or ordering through an Instagram post, not a shopping-cart website. That kind of selling is real and common, but it usually lives completely separate from the till: the in-person sale goes into the POS or the notebook, and the WhatsApp order gets written on a scrap of paper, remembered, or not tracked at all. AskBiz isn't a website builder or a shopping-cart platform — it doesn't host an online store. What it does is give you one place to record every sale, in-store or arranged online, so your stock count and your profit number are always the true, combined picture rather than two separate guesses you have to add together."
      problem={{
        heading: "One business, two untracked sales channels",
        body: "A customer buys a dress at the stall — that goes in the till. Another customer messages on WhatsApp asking if you have it in blue, agrees a price, and pays by M-Pesa — that sale often never touches your stock count at all. Multiply that across a week and you've got a real gap: stock looks like it's still there when it isn't, your daily profit number is missing sales you definitely made, and at month end you're trying to remember which items moved through DMs versus the counter. The two channels aren't the problem — not tracking them the same way is.",
      }}
      solution={{
        heading: "Every sale goes through the same system, whatever the channel",
        body: "When a WhatsApp or Instagram order is agreed, you ring it up in AskBiz just like an in-person sale — same product list, same stock deduction, same payment recording for M-Pesa, Airtel Money, MTN Mobile Money, cash or card. AskBiz doesn't host your online store or manage the DMs themselves; it's the record-keeping and stock layer that sits underneath however you actually take the order. The result is one inventory count that's always accurate regardless of where the sale happened, and one daily profit figure that reflects everything you sold — not just what crossed the counter.",
      }}
      features={[
        { icon: '💬', title: 'Record WhatsApp & Instagram orders like any sale', body: 'Ring up an order arranged over chat the same way as an in-person sale — same items, same stock deduction, same record.' },
        { icon: '📦', title: 'One inventory count, not two', body: 'Stock deducts the moment any sale is recorded, so what the app shows always matches what you actually have left, regardless of channel.' },
        { icon: '💰', title: 'One true daily profit number', body: 'In-person and online-arranged sales roll into the same daily total, so you\'re never missing DM sales from your figures.' },
        { icon: '📷', title: 'Camera-first product entry', body: 'Add or find products with your phone camera when confirming an order, whether it came from a walk-in or a chat message.' },
        { icon: '💳', title: 'Every payment method recorded the same way', body: 'M-Pesa, Airtel Money, MTN Mobile Money, cash or card — however the online order gets paid, it\'s recorded consistently.' },
        { icon: '📶', title: 'Works even with patchy connectivity', body: 'Record a sale offline when confirming a chat order somewhere with weak signal — it syncs automatically once you\'re back online.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Sell in person as normal', body: 'Ring up counter sales on your phone with the camera scanner or product list, same as any AskBiz sale.' },
        { step: '2', title: 'Confirm a WhatsApp or Instagram order', body: 'Once a buyer agrees to purchase over chat, add the same items to a sale in AskBiz — no separate spreadsheet or notebook.' },
        { step: '3', title: 'Record the payment', body: 'Log the M-Pesa, Airtel, MTN, cash or card payment for that order just like any other sale.' },
        { step: '4', title: 'See one combined picture', body: 'Your stock count and daily profit reflect every sale — counter and chat-arranged — in the same dashboard.' },
      ]}
      faqs={[
        { q: 'Does AskBiz host my online store or shopping cart?', a: 'No. AskBiz is a POS and business tracker, not a website builder or shopping-cart platform. If you sell through WhatsApp, Instagram, or another channel, that conversation and the order-taking still happen there — AskBiz is where you record the resulting sale so it hits the same stock and profit numbers as everything else.' },
        { q: 'How do I add a WhatsApp or Instagram order into AskBiz?', a: 'The same way you\'d ring up any sale — select or scan the items the customer bought and log the payment method they used. It takes the same few taps as an in-person sale and updates your stock and daily total the same way.' },
        { q: 'Will this show me which channel each sale came from?', a: 'AskBiz focuses on giving you one accurate combined picture of stock and profit rather than a channel-by-channel breakdown. The main problem it solves is making sure online-arranged sales aren\'t silently missing from your numbers at all.' },
        { q: 'Is this only useful if I have a lot of online orders?', a: 'No — it helps as soon as you take even occasional WhatsApp or Instagram orders alongside in-person sales. The moment a sale isn\'t recorded through the same system as your other sales, your stock count and profit figure start drifting from reality.' },
        { q: 'Do I need a website or online store set up first?', a: 'No. Most small Kenyan sellers using this take orders directly through chat apps with no website at all — that\'s exactly the case this is built for. There\'s nothing to set up beyond recording the sale in AskBiz once it\'s agreed.' },
        { q: 'Does it work if I only sell in person right now?', a: 'Yes — it\'s the same POS either way. If you start taking online orders later, you\'re already using the system that will track them consistently alongside your in-person sales.' },
      ]}
      cta={{
        heading: "Stop keeping two separate sales pictures",
        body: "Record every sale — counter or chat-arranged — in one place, with one stock count and one true profit number. Free to start.",
      }}
      relatedPages={[
        { href: '/pos-system-kenya', label: 'POS system for Kenya' },
        { href: '/inventory-management-kenya', label: 'Inventory management Kenya' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
        { href: '/pricing', label: 'Pricing' },
      ]}
    />
  )
}
