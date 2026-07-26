import type { AcademyArticle } from "./academy-types";

export const academyConnectGoCardless: AcademyArticle[] = [
  {
    slug: "connect-gocardless-askbiz",
    title: "Connect GoCardless to AskBiz for Direct Debit & Subscription Payments",
    description: "How to connect GoCardless in AskBiz Sources, what it syncs, where that data ends up, and what it means for your Free plan source limit.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: [
      "GoCardless", "direct debit", "Bacs", "subscriptions", "mandates",
      "recurring payments", "AskBiz Sources", "Payments connector", "connect GoCardless",
    ],
    keyTakeaways: [
      "GoCardless lives in Sources > Payments, alongside Stripe, PayPal, Klarna and SumUp.",
      "It's a one-click OAuth connection — click Connect, sign in to GoCardless, approve read-only access. There's no API key to find or paste.",
      "It syncs your direct debit payments, each one tagged with the mandate that authorised it, so you can trace a charge back to the customer agreement behind it.",
      "GoCardless data is written to its own gocardless_payments table rather than your shared Transactions feed, because payment and mandate records don't fit that shape — so it won't show up in your regular sales Reports the way Stripe or PayPal does yet.",
      "It counts toward the Free plan's 3-connected-source cap like every other connector; Growth and Business plans have no source limit.",
    ],
    content: [
      {
        heading: "Where to find it",
        body: "Open Sources from the main AskBiz navigation and look under the Payments category — it sits between PayPal and Klarna, next to Stripe and SumUp. AskBiz groups every connector by category (E-Commerce, Accounting, Payments, Marketing & Ads, and so on), so Payments is where all five payment-related sources live together rather than being scattered across the page. If you'd rather not scroll, the search box at the top of the Sources page filters as you type, so typing \"gocardless\" or \"direct debit\" jumps straight to its card. The card shows a short description — direct debit payments, subscriptions, mandates — and a Connect button. Once connected, it moves up into the Connected list at the top of the page alongside your other sources, showing a status dot and a last-synced time, where you can trigger a manual sync or disconnect it at any time.",
      },
      {
        heading: "Connecting: one click, no API key",
        body: "GoCardless is an OAuth connector, not a paste-a-key one — the card's hint reads \"Redirects to GoCardless — read-only access\", and that's exactly what happens. Click Connect and AskBiz sends you to GoCardless's own login screen, requesting a read_only scope. Sign in and approve it there, and GoCardless redirects you straight back to Sources. You never see or handle an access token yourself, and there's nothing to copy out of a GoCardless settings page first — unlike, say, Klarna or SumUp in the same Payments group, which do ask you to paste in API credentials. Once you approve access, AskBiz looks up your GoCardless creditor account and uses its name as the source's display name in your Connected list, so it's recognisable as your business rather than showing up as a generic \"GoCardless\" row. A first sync kicks off automatically right after you connect, so you don't need to press Sync now just to see it start working.",
      },
      {
        heading: "What actually gets synced",
        body: "Once connected, AskBiz pulls your payments from GoCardless — every direct debit charge on the account, whether it's completed, pending, or failed, going back through your full payment history and then staying current on every sync after that. Each payment record carries the amount and currency, its status, the charge date, and any description you or GoCardless attached to it. Critically, each one also carries the mandate that authorised it — the underlying Direct Debit agreement the customer signed up to — so a payment isn't just a number, it's traceable back to the specific mandate (and by extension the subscription or agreement) that generated it. That's the sense in which the connector covers \"payments, subscriptions, and mandates\": what you get is a full feed of payments, each one already linked to the mandate behind it, rather than three separate, disconnected data sets. Because AskBiz pages through the API rather than pulling a fixed batch, a business with a large existing GoCardless history gets its full backlog on the first sync, not just the most recent charges.",
      },
      {
        heading: "Why it doesn't show up in your regular Reports yet",
        body: "Most of AskBiz's connectors — Stripe and PayPal included — feed into a shared table that powers your Transactions view, P&L, and Reports pages. GoCardless deliberately doesn't. Payment and mandate data has a different shape to an order or a sale — a direct debit payment doesn't have a product line, a customer name in the same format, or a channel the way a Shopify order does — so AskBiz writes it into its own dedicated table instead of forcing it into the shared one. In practice, that means your GoCardless data is being synced, stored securely, and kept current — but it isn't yet blended into the same sales Reports or P&L view that your Stripe or PayPal payments appear in. If you're relying on AskBiz for a single combined revenue view across payment processors, GoCardless is the one connector in the Payments group that currently sits slightly apart from that picture rather than inside it. That's a reason to keep connecting it — the data is captured and ready the moment reporting catches up to it — just not a reason to expect an instant like-for-like match to how Stripe behaves today.",
      },
      {
        heading: "Free plan source limits",
        body: "GoCardless doesn't get special treatment on plan limits — it counts as one connection against the Free plan's cap of 3 connected sources in total, combined across every category, not 3 per category. So if you're already running Shopify and Xero on Free, GoCardless would be your third and final slot unless you disconnect something else first. Growth and Business plans remove this limit entirely, so you can run GoCardless alongside Stripe, PayPal, and everything else in your stack without trading anything off. If direct debit and subscription payments are a meaningful part of your revenue, it's worth deciding upfront whether GoCardless earns one of your three free slots, or whether upgrading makes more sense once you're relying on more than a couple of sources at once.",
      },
      {
        heading: "If something goes wrong",
        body: "GoCardless's OAuth token for this connection doesn't come with a documented refresh flow, so if the connection ever stops working, the most likely cause is that token needing to be re-approved rather than a genuine sync bug. If a sync fails, the source's row in your Connected list will switch to an error status with a short message explaining why, and reconnecting is the fix: click Connect again and re-approve access. One thing worth knowing before you click Disconnect, though — it isn't a pause. Removing GoCardless from your Connected list deletes its synced payment history along with it, not just the connection itself. If you're disconnecting to troubleshoot rather than to remove GoCardless for good, reconnecting afterwards re-syncs your payment history fresh from GoCardless rather than picking up where the old data left off.",
      },
    ],
    relatedSlugs: ["how-to-connect-shopify-askbiz", "what-is-a-data-source", "connect-marketing-ads-sources-askbiz"],
    faq: [
      {
        q: "Do I need a GoCardless API key to connect?",
        a: "No. GoCardless connects via OAuth — click Connect on its Sources card and you're redirected to sign in and approve read-only access on GoCardless's own site. There's no key or token to find in your GoCardless settings and paste into AskBiz.",
      },
      {
        q: "Will my GoCardless payments show up in my AskBiz Reports or P&L alongside Stripe and PayPal?",
        a: "Not yet. GoCardless payment and mandate data is stored in its own dedicated table rather than the shared table that feeds Reports, Transactions and P&L — because that data doesn't fit the same shape as an order or sale. It's synced and stored, but it's currently separate from your blended revenue view.",
      },
      {
        q: "Does the connector pull my subscriptions as a separate list, or just payments?",
        a: "It syncs payments — every direct debit charge, whether completed, pending or failed — and each payment carries the mandate that authorised it, so you can trace a charge back to the underlying agreement. It isn't a separate feed of subscription or mandate objects independent of the payments themselves.",
      },
      {
        q: "Does connecting GoCardless use up one of my Free plan source slots?",
        a: "Yes. The Free plan allows up to 3 connected sources in total across every category combined, and GoCardless counts the same as any other connector — Stripe, Shopify, Xero, all of them. Growth and Business plans have no source limit.",
      },
      {
        q: "My GoCardless connection shows an error — what do I do?",
        a: "Click Connect again from the Sources page and re-approve access through GoCardless's login screen — the same flow as connecting the first time. Note that this is different from disconnecting: an error status doesn't touch your synced payment history, but if you click Disconnect first, that removes the synced GoCardless payment data along with the connection, and reconnecting re-syncs it fresh rather than restoring the old records.",
      },
    ],
  },
];
