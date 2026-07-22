import type { Metadata } from 'next'
import SeoPage from '@/components/SeoPage'
import { buildSeoHreflangMap } from '@/lib/seo-i18n-slugs'

export const metadata: Metadata = {
  title: 'Cloud POS Kenya — No Server, No IT Person, Any Device | AskBiz',
  description: 'A cloud-based POS for Kenyan businesses: no server to buy or maintain, log in from any phone or branch, data backed up centrally, and updates happen automatically.',
  keywords: ['cloud POS Kenya', 'cloud based POS system', 'POS no server Kenya', 'multi branch POS Kenya', 'online POS system Kenya', 'POS backup Kenya'],
  openGraph: {
    title: 'Cloud POS Kenya — No Server, No IT Person, Any Device',
    description: 'Run your business from any phone or branch with a POS that lives entirely in the cloud — nothing to install, nothing to maintain.',
    url: 'https://askbiz.co/cloud-pos-kenya',
  },
  alternates: { canonical: 'https://askbiz.co/cloud-pos-kenya', languages: buildSeoHreflangMap('cloud-pos-kenya') },
}

export default function Page() {
  return (
    <SeoPage
      keyword="Cloud POS Kenya"
      h1="Cloud POS Kenya — No Server, No IT Person, Access From Any Device"
      subheading="AskBiz runs entirely in the cloud. There's no box under the counter to maintain, no local install, and no single machine that holds your data. Log in from any phone or branch and see the same live business."
      intro="A lot of point-of-sale software sold in Kenya is still, underneath, a program installed on one desktop computer at the till. That machine holds the database. If it breaks, gets stolen, or the hard drive fails, the sales history often goes with it, and if you open a second branch, that till can't see what the first one is doing. AskBiz doesn't work that way. It's a cloud POS — built on Vercel and Supabase — so the app and your data live on servers we run, not on a machine sitting in your shop. You open it in a browser on any phone, tablet or computer, log in, and you're looking at the same live business no matter which device or branch you're standing in."
      problem={{
        heading: "The problem with a till that only one machine can see",
        body: "A single desktop till program ties your business to one physical machine. Someone has to keep that computer running, patched, and free of the kind of software problems that eventually catch up with any unmaintained PC — and in most small businesses, there is no IT person to do that. If the machine is stolen, dropped, or simply dies, whatever wasn't backed up is gone. Add a second branch and the problem compounds: that till still only knows about its own shop, so you're stitching two sets of numbers together by hand at month end, or not at all.",
      }}
      solution={{
        heading: 'A POS that lives in the cloud, not on a box in your shop',
        body: "With AskBiz there's no server to buy, configure, or keep alive — the software runs on cloud infrastructure we operate, and you access it through a browser on whatever device is in front of you. Your sales, stock and staff records are stored centrally and backed up as a matter of course, not sitting on a single till that can be lost, stolen, or break. Software updates happen on our end automatically, so you're never running an old, unpatched version because nobody got around to it. And because every branch reads and writes to the same live data, a multi-branch business sees one consolidated picture instead of several disconnected ones.",
      }}
      features={[
        { icon: '☁️', title: 'No server to buy or maintain', body: 'AskBiz runs entirely in the cloud on Vercel and Supabase. There is no local box under the counter and nothing for you to keep running.' },
        { icon: '📱', title: 'Log in from any phone or branch', body: 'Access your business from any Android phone, iPhone, tablet or computer — just log in, no installation required.' },
        { icon: '🔒', title: 'Centrally backed-up data', body: 'Your sales and stock data lives centrally, not on one till that can be lost, stolen or break. Nothing depends on a single machine surviving.' },
        { icon: '🔄', title: 'Automatic updates', body: 'New features and fixes roll out on our end. You never have to manually patch or update software yourself.' },
        { icon: '🏬', title: 'One live picture across branches', body: 'Every branch reads and writes to the same live data, so a multi-location business sees one consolidated view, not scattered tills.' },
        { icon: '🤖', title: 'AI built on top of your live data', body: 'Because your data already lives in one place, AskBiz can answer business questions and flag anomalies across your whole operation, not just one till.' },
      ]}
      howItWorks={[
        { step: '1', title: 'Sign up — no hardware to order', body: 'There is nothing to install and nothing to wait for delivery on. Create an account and you are already set up.' },
        { step: '2', title: 'Log in on any device', body: 'Open AskBiz in a browser on the phone or tablet at each till or branch. Same login, same live business.' },
        { step: '3', title: 'Sell and manage from anywhere', body: 'Ring up sales, manage stock and staff, and check performance from any device you are logged into — at the shop or away from it.' },
        { step: '4', title: 'Updates and backups happen for you', body: 'New features arrive automatically and your data is backed up centrally — nothing for you to manage on the technical side.' },
      ]}
      faqs={[
        { q: 'Do I need to buy a server or install anything?', a: 'No. AskBiz runs entirely in the cloud — there is no server to purchase and no software to install on a local machine. You access it through a browser on any device.' },
        { q: 'What happens to my data if a till device breaks or is stolen?', a: 'Your data is not stored on the till device itself. It lives centrally and is backed up, so a lost, stolen or broken phone does not mean lost business records — you simply log in again on another device.' },
        { q: 'Do I need an IT person to keep it running?', a: 'No. Because there is no local server or installed software to maintain, there is nothing for an IT person to patch or keep alive. Updates happen on our side automatically.' },
        { q: 'Can I use it across multiple branches?', a: 'Yes. Every branch logs into the same cloud system, so stock, sales and reporting are consolidated across locations in real time rather than living in separate, disconnected tills.' },
        { q: 'Do I have to manually update the software?', a: 'No. Because AskBiz is cloud-hosted, updates and improvements are deployed on our end and are simply there the next time you log in — nothing to download or install yourself.' },
        { q: 'Is my data safe if I lose internet connection at one branch?', a: 'Yes for selling — AskBiz keeps working offline and queues sales on the device, syncing automatically once connectivity returns. Since your data is centrally hosted rather than tied to one machine, a temporary connection drop at one branch does not affect the others.' },
      ]}
      cta={{
        heading: 'Run your business from the cloud — free to start',
        body: 'No server to buy, no IT person to hire, no single till holding your data. Log in from any phone or branch and see the same live business.',
      }}
      relatedPages={[
        { href: '/offline-pos-kenya', label: 'Offline POS Kenya' },
        { href: '/pos-system-kenya', label: 'POS system Kenya' },
        { href: '/point-of-sale', label: 'Point of sale by industry' },
        { href: '/pricing', label: 'Pricing' },
      ]}
    />
  )
}
