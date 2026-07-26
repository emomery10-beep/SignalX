import type { AcademyArticle } from "./academy-types";

export const academyConnectXeroFreeAgent: AcademyArticle[] = [
  {
    slug: "connect-xero-freeagent-askbiz",
    title: "Connect Xero or FreeAgent to AskBiz",
    description: "How to connect Xero or FreeAgent under Sources > Accounting, what each one syncs into AskBiz, and how they differ from Sage and Wave in the same category.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: [
      "Xero", "FreeAgent", "AskBiz Sources", "Accounting connectors",
      "connect Xero", "connect FreeAgent", "invoices sync", "bookkeeping integration",
    ],
    keyTakeaways: [
      "Xero and FreeAgent both live under Sources > Accounting, alongside QuickBooks, Sage and Wave.",
      "Both connect with one click via OAuth — you sign in and approve read-only access, with nothing to paste. Sage and Wave, in the same category, instead ask you to paste API credentials.",
      "What actually flows into AskBiz is your invoices — both money coming in (sales invoices) and money going out (bills) — which feed your AskBiz revenue and expense reports.",
      "This is a separate, one-way pull: AskBiz reads from Xero/FreeAgent for reporting. If you also use AskBiz POS, its own (different) Xero integration pushes POS sales out to Xero for bookkeeping — the two aren't the same connection.",
      "How often it re-syncs depends on your plan: daily on Free, every 6 hours on Growth, hourly on Business.",
    ],
    content: [
      {
        heading: "Where to find them",
        body: "Open Sources from the main AskBiz navigation. Connectors are grouped by category, and Accounting is one of those groups — sitting alongside E-Commerce, Payments, Marketing & Ads and the rest. Inside Accounting you'll find five cards: QuickBooks, Xero, Sage, FreeAgent and Wave. If scrolling isn't your thing, the search box at the top of the Sources page filters straight down to a card when you type \"xero\" or \"freeagent\". Xero's card describes it as covering invoices, bank reconciliation, P&L and payroll; FreeAgent's card describes invoices, expenses, tax timeline and cash flow — that's the ground each platform covers in general. What AskBiz actually pulls from either one, covered below, is narrower and specific: your invoices.",
      },
      {
        heading: "Connecting Xero",
        body: "Click Connect on the Xero card. AskBiz redirects you to Xero to sign in and approve read-only access to your organisation — there's no client ID, secret or token to find and paste anywhere. Once you approve it, you're sent back to AskBiz and the card moves into the Connected list at the top of the page with a status indicator and a last-synced time.",
      },
      {
        heading: "Connecting FreeAgent",
        body: "FreeAgent works the same way. Click Connect, sign in to FreeAgent, and approve read-only access — again, no credentials to copy in manually. Because a FreeAgent OAuth token is scoped to a single company, you don't need to pick a tenant or company afterwards the way some multi-company platforms require; the connection is tied to whichever FreeAgent company you approved access for.",
      },
      {
        heading: "The difference from Sage and Wave, right next to them",
        body: "Xero and FreeAgent are the two OAuth connects in the Accounting group — you never see a form field for either. Sage and Wave, sitting in the same list, work differently: Sage asks you to paste a Client ID and Client Secret from the Sage Developer Portal, and Wave asks for an access token generated from Wave's own Settings > Developer page. If you're used to pasting credentials for Sage or Wave, don't go looking for an equivalent field for Xero or FreeAgent — for these two, clicking Connect and approving access in the provider's own login screen is the entire process.",
      },
      {
        heading: "What actually syncs",
        body: "Once connected, AskBiz pulls your invoices from Xero (or FreeAgent) and splits them by type. Sales invoices — money owed to you — become revenue line items in AskBiz, carrying the product/line description, quantity, price, currency and payment status (paid, pending, or partially paid) straight from the invoice. Bills — money you owe — become expense records, tagged with the vendor, amount, date and category. Between the two, that's what feeds your AskBiz P&L and expense reporting from either platform. On the Xero side, invoices are pulled in pages and ordered by when they were last updated, so edits you make in Xero — a payment recorded, an invoice amended — get picked up on the next sync rather than only on the invoice's original creation date. Xero and FreeAgent's own bank reconciliation, payroll, and tax-timeline features stay inside Xero or FreeAgent itself — AskBiz isn't pulling those specific figures across, only the invoice and bill data.",
      },
      {
        heading: "Keeping the token connection alive",
        body: "OAuth tokens expire periodically by design, and AskBiz refreshes both automatically behind the scenes — for Xero via its identity service, for FreeAgent via its own token endpoint — so a normal sync won't ask you to sign in again. If a refresh ever fails (for example, if access was revoked from the Xero or FreeAgent side), the connected source will show an error status on the Sources page with a short message, and reconnecting is the same one-click process as the first time.",
      },
      {
        heading: "How often it re-syncs",
        body: "Sync frequency is tied to your AskBiz plan rather than the connector itself: daily on Free, every 6 hours on Growth, and hourly on Business. Neither Xero nor FreeAgent has a special slower floor applied to it the way a couple of other connectors do, so you get your plan's normal interval. If you want the latest figures without waiting, press \"Sync now\" on the connected source's row in the Sources page and it'll pull immediately, regardless of when the next scheduled sync is due.",
      },
      {
        heading: "Disconnecting or switching",
        body: "Both sources sit in the Connected list once set up, next to every other source you've linked, and each has its own Disconnect button. Disconnecting is a genuine clean-up, not just a pause: AskBiz revokes the token with the provider and removes the revenue records that source synced in, so an old or wrong connection doesn't keep leaving figures behind in your reports. If you need to reconnect later, or switch which Xero organisation or FreeAgent company is linked, disconnect first and then go through Connect again to authorise the new one — the next sync repopulates your data from scratch.",
      },
      {
        heading: "If you also use AskBiz POS with Xero",
        body: "Worth being clear about, because the names overlap: this Sources connector is a one-way pull into AskBiz for reporting — it reads your Xero or FreeAgent data so it shows up in your dashboards and P&L. If you use AskBiz POS, POS has its own separate Xero integration under its own settings, which does the opposite job — it pushes your POS sales out to Xero as draft invoices, for your bookkeeping. The two aren't linked to each other and don't share a connection: connecting one doesn't connect or affect the other, and you can use either, both, or neither depending on what you need.",
      },
    ],
    relatedSlugs: ["how-to-connect-shopify-askbiz", "what-is-a-data-source", "connect-marketing-ads-sources-askbiz"],
    faq: [
      {
        q: "Do I need to paste an API key or client secret for Xero or FreeAgent?",
        a: "No. Both are OAuth connectors — click Connect, sign in to Xero or FreeAgent, and approve read-only access. That's different from Sage and Wave in the same Accounting group, which do ask you to paste credentials.",
      },
      {
        q: "Does connecting Xero to Sources also set up the POS-to-Xero bookkeeping sync?",
        a: "No, they're unrelated connections. This Sources connector pulls your Xero data into AskBiz for reporting. AskBiz POS has its own, separate Xero integration in its own settings that pushes POS sales out to Xero as draft invoices. Connecting one doesn't connect the other.",
      },
      {
        q: "What data actually shows up in AskBiz after I connect — everything from Xero?",
        a: "Specifically your invoices: sales invoices become revenue records (with quantity, price, currency and payment status) and bills become expense records (vendor, amount, category). Xero and FreeAgent's own bank reconciliation, payroll and tax-timeline features aren't pulled across — those stay in Xero or FreeAgent.",
      },
      {
        q: "How often does the data refresh once it's connected?",
        a: "It follows your AskBiz plan's sync interval — daily on Free, every 6 hours on Growth, hourly on Business. You can also click \"Sync now\" on the connected source at any time to pull the latest data immediately instead of waiting.",
      },
      {
        q: "What happens if my Xero or FreeAgent connection stops working?",
        a: "AskBiz automatically refreshes the underlying access token on each sync, so this shouldn't usually require anything from you. If a refresh does fail — for example because access was revoked on the Xero or FreeAgent side — the source shows an error status with a short message on the Sources page, and you reconnect the same way you connected the first time.",
      },
    ],
  },
];
