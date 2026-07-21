import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'

export const metadata: Metadata = {
  title: 'Offline POS Kenya — Sell With No Signal, Sync Automatically | AskBiz',
  description: 'A POS app that keeps recording sales when your connection drops. Sales queue on the phone offline and sync automatically the moment signal returns — no lost sales in areas with patchy connectivity.',
  keywords: ['offline POS Kenya', 'POS app no internet', 'offline sales app Kenya', 'POS works without wifi', 'mobile POS patchy connection', 'offline till app'],
  openGraph: {
    title: 'Offline POS Kenya — Sell With No Signal, Sync Automatically',
    description: 'Keep selling and recording sales even with no network. AskBiz queues sales on the phone and syncs the moment connectivity returns.',
    url: 'https://askbiz.co/offline-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/offline-pos-kenya' },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Offline POS Kenya"
      h1="Offline POS Kenya — Keep Selling With No Signal, Sync When It Returns"
      subheading="Outside the main towns, connectivity in Kenya can drop without warning. AskBiz keeps recording sales while you're offline and syncs everything automatically the second signal comes back — no sale is ever lost to a dead network."
      intro="A lot of small businesses in Kenya operate somewhere the network isn't guaranteed — a stall near the edge of town, a shop that loses signal every time it rains, a market with patchy coverage at the best of times. Most POS apps assume you're always online, so the moment the connection drops, the till either stops working outright or, worse, lets you keep ringing up sales it never actually saves. AskBiz was built with the opposite assumption: connectivity will drop sometimes, and the app has to keep working through it without losing a single sale."
      problem={{
        heading: "When the signal drops, most tills either freeze or quietly lose the sale",
        body: "A shop near the edge of town, or one that just has an unreliable network provider, can lose signal several times in a day — during a delivery, a storm, or simply because coverage is thin in that part of the country. Cloud-only POS apps that need a live connection to record every sale either stop working the moment that happens, or worse, let the cashier keep ringing things up while quietly failing to save any of it. Either way, the business owner finds out later that a chunk of the day's sales simply never got recorded, with no way to reconstruct them.",
      }}
      solution={{
        heading: 'A service worker and on-device queue that never lose a sale',
        body: "AskBiz uses a service worker to cache the app itself, so it opens and runs on your phone even with zero signal — it isn't waiting on a network request just to load the till screen. When you ring up a sale with no connection, it's written straight into an IndexedDB store on the device, the same way the app behaves when it's online, just held locally instead of sent immediately. The moment the phone reconnects — to wifi, mobile data, anything — every queued sale syncs to the server automatically, in the background, with no button to press and nothing for the cashier to remember to do.",
      }}
      features={[
        { icon: '📴', title: 'App works with zero signal', body: 'A service worker caches the app shell, so AskBiz opens and runs on your phone even with no network connection at all.' },
        { icon: '🗂️', title: 'Sales queue on the device', body: 'Every sale made offline is written to an IndexedDB store on the phone itself — nothing is lost while you wait for signal to return.' },
        { icon: '🔄', title: 'Automatic sync, no button to press', body: 'The moment connectivity returns, queued sales sync to the server in the background. Nobody has to remember to press "sync".' },
        { icon: '🧾', title: 'No lost sales, no gaps in the record', body: 'Every sale rung up offline shows up in your reports once synced — there is no missing chunk of the day to reconstruct from memory.' },
        { icon: '📶', title: 'Built for patchy connectivity, not just outages', body: 'It is not only for total network loss — it smooths over the normal in-and-out coverage many areas outside the main towns deal with daily.' },
        { icon: '🏪', title: 'Same till, same app, online or offline', body: 'There is no separate "offline mode" to switch into — it is the same screen, same workflow, whether you have signal or not.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Open the app once with signal', body: 'The first load caches the app on your phone via a service worker, so it can open without a connection after that.' },
        { step: '2', title: 'Keep selling if signal drops', body: 'Ring up sales as normal. With no connection, each sale is written to the phone\'s local IndexedDB store instead of the server.' },
        { step: '3', title: 'Connectivity returns', body: 'The moment the phone picks up wifi or mobile data again, queued sales start syncing to the server automatically.' },
        { step: '4', title: 'Check your reports as normal', body: 'Once synced, offline sales appear in your daily totals and reports exactly like any other sale — nothing to reconcile by hand.' },
      ]}
      faqs={[
        { q: 'What exactly keeps working when I have no signal?', a: 'Selling and recording sales. You can open the app, ring up items, take payment, and the sale is saved on the phone even with zero network connection. It is designed and tested for this specific job — capturing and syncing sales — rather than every feature in the app.' },
        { q: 'Will I lose sales if the network drops mid-transaction?', a: 'No. Sales made while offline are written to an IndexedDB store on the device itself, not held in memory, so they survive until the phone reconnects and syncs them to the server automatically.' },
        { q: 'Do I need to press a button to sync once I have signal again?', a: 'No. Sync happens automatically in the background the moment connectivity returns. There is nothing for the cashier to remember to trigger.' },
        { q: 'Does the AI assistant work offline too?', a: 'No — offline support currently covers selling and recording sales, which then sync when you reconnect. Asking the AI business questions requires a live connection, since it needs to reach the server.' },
        { q: 'Is this only useful if my area has no network at all?', a: 'It helps just as much with patchy, in-and-out coverage as with total outages — which is the more common situation for many businesses outside Kenya\'s main towns. The app doesn\'t need a perfect signal, just an eventual one.' },
        { q: 'Do I need to do anything special to set up offline mode?', a: 'No separate setup. Open the app once with a connection so it can cache itself, and after that it works whether you have signal or not — there is no toggle or offline mode to turn on.' },
      ]}
      cta={{
        heading: "Never lose a sale to a dropped connection again",
        body: "AskBiz keeps recording sales offline and syncs them the moment signal returns — built for the real connectivity you deal with, not the connectivity a POS app assumes you have.",
      }}
      relatedPages={[
        { href: '/cloud-pos-kenya', label: 'Cloud POS Kenya' },
        { href: '/free-mpesa-pos', label: 'Free M-Pesa POS app' },
        { href: '/pos-for-market-vendors', label: 'POS for market vendors' },
        { href: '/pos-system-kenya', label: 'POS system Kenya' },
      ]}
    />
  )
}
