import { AcademyArticle } from "./academy-types";

export const academyPosFreeTrialExplained: AcademyArticle[] = [
  {
    slug: "pos-free-trial-explained-askbiz",
    title: "How the AskBiz POS Free Trial Works",
    description: "AskBiz POS offers a one-time, 30-day free trial with no card required. Here's exactly how to claim it, what it includes, and what happens when it ends.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["POS free trial", "AskBiz POS", "30-day trial", "no card required", "pos/activate", "trial expiry", "billing"],
    keyTakeaways: [
      "The free trial is POS-only, lasts 30 days, and needs no card — each account can claim it once.",
      "You'll see it offered in two places: a banner on the onboarding done screen for POS-persona signups, and again on the pos/activate page if you haven't claimed it yet.",
      "When the 30 days run out without a paid subscription, AskBiz automatically switches POS off — your data stays intact, but the till stops working until you subscribe.",
      "The equivalent Growth-plan (BI) trial has been discontinued — POS is the only free trial AskBiz currently offers.",
      "Your trial status, including days remaining and the exact end date, is always visible on the Billing page.",
    ],
    content: [
      {
        heading: "What the trial actually gives you",
        body: "The AskBiz POS free trial unlocks the full till for 30 days from the moment you start it, with no payment card requested at any point. It's a one-time offer — each account can claim it exactly once, which AskBiz tracks server-side rather than trusting anything in the browser. If you've already claimed it before (even on a different device or after clearing your cookies), the system knows and won't offer it again. Starting the trial switches POS on immediately and provisions up to five staff seats, so you can bring your whole till team on board — cashiers, managers, whoever needs a login — without hitting a seat limit during the trial itself.",
      },
      {
        heading: "Where you'll be offered it",
        body: "AskBiz surfaces the trial at two points, both aimed at getting you selling as fast as possible without asking for card details upfront. The first is on the onboarding \"done\" screen, but only if you signed up as a POS persona — you'll see a small banner above the \"Set up my till\" button announcing the 30-day trial. That banner is just an announcement, not the claim button itself; it tells you the offer exists before you go any further. The second, and the one that actually starts the trial, is on the pos/activate page — the screen you land on when you go to switch POS on. Before pushing you straight to a paid checkout, it checks whether you have an unclaimed trial. If you do, a \"Start free trial\" option appears above the payment buttons; if you've already used it, that option simply doesn't show and you go straight to payment options instead. Either way, there's no dead-end — if a click lands after you've already claimed it elsewhere (say, the Billing page), AskBiz quietly hides the button and shows the payment path instead, rather than an error.",
      },
      {
        heading: "Claiming it on pos/activate",
        body: "When the trial option is available, it's the top button on the pos/activate screen — labelled to start the free trial, with a note underneath confirming no card is needed. Below it sits a divider and then your normal payment options: M-Pesa for Kenyan accounts, plus card payment for everyone. Tapping the trial button doesn't redirect you anywhere; it calls AskBiz's billing system directly, which records the trial start time and a 30-days-later end date, flips POS on, and takes you straight to a confirmation screen. From there it's the same \"you're all set\" flow as a paid activation — you land back on your till, ready to sell.",
      },
      {
        heading: "What happens when the 30 days end",
        body: "AskBiz checks trial expiry every time your billing status is loaded — practically speaking, this means the moment your 30 days pass, the next time anything touches your billing state, the system notices. If there's no paid POS subscription attached to your account by then, POS access is switched off automatically: the till stops being usable, and staff logins will find the door closed. Nothing about your sales history, inventory, or settings is deleted — it's all still there, waiting. Subscribing at any point afterwards switches POS back on with everything exactly as you left it. The cutoff is deliberately clean: there's no grace-period nagging or partial lockout, just an automatic switch from \"on\" to \"off\" if the trial lapses with nothing paid behind it.",
      },
      {
        heading: "Checking your trial status",
        body: "You don't have to guess how much runway you have left. The Billing page shows a badge next to the POS section whenever your trial is active, stating the number of days remaining and how many seats you're currently using. Once you subscribe — or once the trial expires and you pay to reactivate — that badge switches to a plain \"active\" status instead. If you're the kind of owner who likes to plan ahead rather than be surprised by a locked till mid-shift, the Billing page is the place to check in, ideally a few days before the 30 days are up.",
      },
      {
        heading: "Why there's no equivalent for the Growth (BI) plan",
        body: "If you've heard that AskBiz used to offer a free trial for its Growth business-intelligence plan, that's true — but it's no longer available. AskBiz's billing system explicitly rejects any new request for a Growth trial with a clear message that it's been retired; the code path exists only to turn requests away, not to grant them. The POS trial is the only free trial currently offered. If your business needs both POS and the BI/Growth features, the POS trial gets your till running immediately at no cost, while Growth-plan access is a straightforward paid decision from day one — no trial period to factor into that call.",
      },
    ],
    relatedSlugs: ["pos-overview-dashboard-askbiz", "askbiz-pos-overview", "pos-live-dashboard-sync-askbiz"],
    faq: [
      {
        q: "Do I need to enter a card to start the POS free trial?",
        a: "No. Starting the trial requires no payment details at all — it's genuinely free for the full 30 days. You'll only need to add a payment method if you decide to subscribe, either during or after the trial.",
      },
      {
        q: "Can I claim the trial twice — for example on a second business account?",
        a: "The trial is one-time per account, tracked on the server, not per device or browser. A second AskBiz account (a genuinely separate signup) would be eligible for its own trial, but you can't re-trigger it on the same account by clearing cookies or trying again from a different screen.",
      },
      {
        q: "What exactly happens to my sales data when the trial expires?",
        a: "Nothing is deleted. AskBiz switches POS access off — meaning the till itself stops being usable — but every sale, product, and setting you had is preserved. Subscribing at any point afterwards restores full access with your data exactly as it was.",
      },
      {
        q: "I started the trial from the onboarding banner — do I need to do anything else?",
        a: "The onboarding banner is just an announcement that the offer exists; it doesn't start the trial itself. You claim it on the pos/activate page, which you reach via \"Set up my till.\" If you've already claimed it there, you won't see the option again.",
      },
      {
        q: "Is there a free trial for the Growth (BI) plan too?",
        a: "No — the Growth plan trial has been discontinued. Requesting one now returns an explicit \"no longer available\" response. POS is currently the only AskBiz plan offered on a free trial.",
      },
    ],
  },
];
