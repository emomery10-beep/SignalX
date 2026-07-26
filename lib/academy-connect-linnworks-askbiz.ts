import { AcademyArticle } from './academy-types'

export const academyConnectLinnworksAskbiz: AcademyArticle[] = [
  {
    slug: "connect-linnworks-askbiz",
    title: "Connect Linnworks to AskBiz for Multi-Channel Inventory Sync",
    description: "Step-by-step guide to connecting Linnworks to AskBiz — what the OAuth flow does, what data actually syncs, and how often it refreshes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["Linnworks", "connect", "integration", "AskBiz", "inventory", "multi-channel", "Sources", "orders", "fulfilment", "OAuth"],
    keyTakeaways: [
      "Linnworks lives under Sources > Inventory & Logistics, alongside Cin7 and ShipStation, and connects via OAuth — you authorise in Linnworks itself, AskBiz never sees a password.",
      "Access is read-only: AskBiz can pull your orders, it cannot create, edit, or cancel anything in your Linnworks account.",
      "What syncs is your open orders — SKU, product, quantity, price, channel, and fulfilment status per line item — which AskBiz turns into per-channel revenue and stock-movement figures. It's not a separate live warehouse stock-count feed.",
      "Sync frequency follows your AskBiz plan like every other source: daily on Free, every 6 hours on Growth, hourly on Business.",
      "This is a genuine working connector with its own sync handler and data normaliser — not the same as AskBiz's older articles that mention Linnworks only as an example of a multi-channel platform businesses might use.",
    ],
    content: [
      {
        heading: "Where to find it",
        body: "From your AskBiz dashboard, go to Sources. Scroll down to the Inventory & Logistics section — Linnworks sits there alongside Cin7 and ShipStation, with a short description underneath: \"Multi-channel inventory, orders, fulfilment.\" Cin7 and ShipStation both ask you to paste an API key (and, for Cin7, an account ID too) before they'll connect. Linnworks is different — it's the only one of the three that uses a full OAuth connection, so you click the tile and everything after that happens on Linnworks' own site rather than in a form on AskBiz.",
      },
      {
        heading: "Before you connect",
        body: "You'll need admin, or at least app-authorisation, access on your Linnworks account — the same level of access you'd need to approve any third-party app inside Linnworks itself. You don't need to generate or copy any API keys, secrets, or tokens beforehand; AskBiz doesn't ask you to paste anything for this particular connector, which is the main practical difference from Cin7 sitting right next to it. The Sources page tells you exactly what to expect before you click anything: \"Redirects to Linnworks — read-only access.\" That line is a literal description of what happens next, not marketing copy — AskBiz is requesting permission to read your orders, and nothing more.",
      },
      {
        heading: "Step 1 & 2: Authorise in Linnworks",
        body: "Clicking the Linnworks tile sends you to Linnworks' own OAuth authorisation screen, where you sign in (if you aren't already) and review exactly what AskBiz is asking to read before approving it. You're never asked for a Linnworks password inside AskBiz itself — the entire exchange happens on Linnworks' domain, which is standard OAuth practice and the same pattern AskBiz uses for Shopify, Xero, and its other OAuth-based sources. If you decide not to proceed, you can simply close or back out of that screen; nothing gets connected until you actually approve. Once you do approve, Linnworks redirects you straight back to AskBiz's Sources page automatically — there's no code to copy or paste anywhere.",
      },
      {
        heading: "Step 3: What happens after you approve",
        body: "On the way back, AskBiz exchanges the authorisation code Linnworks hands it for an access token, then saves that token encrypted in your account alongside the Linnworks server URL Linnworks assigns to your account. That token is a permanent one — it doesn't expire the way a typical session token does — but AskBiz never uses it directly against Linnworks' order API. Instead, on every sync it presents that permanent token to Linnworks' AuthorizeByApplication endpoint to mint a fresh, short-lived session token (Linnworks' own session tokens only last around 20 minutes, far shorter than any realistic sync interval), and it's that freshly minted session token that actually gets used to pull your orders. You don't see any of this happen — it's the mechanism that keeps the connection working reliably indefinitely without ever prompting you to reconnect or re-authorise. The moment your connection is saved, AskBiz also kicks off a first sync automatically, so there's nothing further to click.",
      },
      {
        heading: "What data actually syncs",
        body: "Each sync pulls your open orders from Linnworks. For every line item in every order, AskBiz records the SKU, product name, quantity, unit price, unit cost (where Linnworks provides one), which sales channel the order came in through, and the order's status. That gets normalised into the same per-record fields AskBiz uses for every other connected source — gross revenue, cost, margin, units sold, and stock movement — so your Linnworks orders sit in your reports next to your Shopify, Amazon, or POS sales rather than as a separate silo you have to check on its own. If an order comes through with no line items attached, AskBiz still records it as a single row using the order total, so nothing silently disappears just because the item-level detail wasn't available. Worth being precise about one thing, though: what syncs today is order activity, not a standalone live warehouse stock-count feed. AskBiz infers stock movement from units sold per order rather than pulling Linnworks' absolute on-hand quantities directly — every synced order reduces the stock-movement figure for that SKU, but AskBiz isn't asking Linnworks \"how many do I have left in the warehouse right now\" as a separate query. If you rely on Linnworks as your true stock-count source of record, keep doing that. AskBiz's view here is order-driven, which is accurate for revenue, channel, and product-performance analysis, but it isn't a substitute for checking live warehouse counts in Linnworks itself before making a purchasing decision.",
      },
      {
        heading: "How often it re-syncs",
        body: "Once connected, Linnworks follows the same sync schedule as every other source, gated by your AskBiz plan: once a day on Free, every 6 hours on Growth, and hourly on Business. Linnworks doesn't have its own slower floor interval the way a couple of other connectors do — Stripe is capped at 3 hours and Etsy at 8 hours even on Business, because their underlying data simply doesn't change fast enough to justify polling more often — so Linnworks just follows whatever cadence your plan allows, same as Shopify, Amazon, or Xero. If you want fresher numbers right after a big sales push across your channels, go back to the Sources page, find Linnworks in your list of connected sources, and click Sync Now — that triggers an on-demand sync outside the regular schedule, without affecting when the next scheduled sync runs. The same row on that page shows a status dot (green once it's syncing cleanly, amber or red if something needs attention) and a \"last synced\" time, so you can see at a glance exactly how current your Linnworks data is before you rely on it.",
      },
      {
        heading: "If you've read AskBiz's guide to multi-channel selling",
        body: "AskBiz's general Academy content on multi-channel selling mentions Linnworks as an example of the kind of platform businesses use to centralise orders across channels — that's a generic reference to the category of tool, written before AskBiz connected to Linnworks directly. This article is about something different: AskBiz's own direct connection to your Linnworks account, described above. If you're using Linnworks as your multi-channel hub already, connecting it here is what actually gets that data into AskBiz's reports.",
      },
    ],
    relatedSlugs: ["how-to-connect-shopify-askbiz", "pos-integrations-askbiz", "what-is-multi-channel-selling"],
    faq: [
      { q: "Does AskBiz get write access to my Linnworks account?", a: "No. The connection is read-only — AskBiz can pull your order data but cannot create, edit, cancel, or fulfil anything in Linnworks. The Sources page states this explicitly before you connect." },
      { q: "Will this show me my exact current stock levels from Linnworks?", a: "Not directly. AskBiz syncs your open orders and derives stock movement (units sold per SKU) from them — it doesn't currently pull a separate live warehouse stock-count feed. For your authoritative on-hand quantities, check Linnworks itself." },
      { q: "How is this different from the Linnworks mention in AskBiz's multi-channel selling article?", a: "That article mentions Linnworks generically, as an example of the category of multi-channel management tools businesses use — it isn't describing a connection to AskBiz. This article covers AskBiz's actual Linnworks connector, which pulls real order data into your account." },
      { q: "How often will my Linnworks data update in AskBiz?", a: "It follows your plan's normal sync schedule: daily on Free, every 6 hours on Growth, hourly on Business. You can also trigger an immediate sync any time from the Sources page with the Sync Now button." },
      { q: "What if I need to reconnect or something looks wrong?", a: "Go to Sources, find Linnworks in your connected sources list, and use Disconnect followed by reconnecting through the same OAuth flow. If a sync is failing, the status row will show an error message rather than staying silent." },
    ],
  },
]
