import { AcademyArticle } from "./academy-types";

export const academyJumiaMarketplaceConnector: AcademyArticle[] = [
  {
    slug: "connect-jumia-marketplace-askbiz",
    title: "Connect Jumia to AskBiz: Orders, Payouts & Stock for African Marketplaces",
    description:
      "How to link your Jumia Vendor Center account to AskBiz using a Client ID and Refresh Token, what actually syncs, and what's still out of scope.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: [
      "Jumia",
      "Jumia Vendor Center",
      "Jumia connector",
      "marketplace integration",
      "African e-commerce",
      "Sources",
      "AskBiz",
      "stock sync",
      "orders sync",
    ],
    keyTakeaways: [
      "Jumia lives under Sources > E-Commerce alongside Shopify, Amazon FBA, eBay, Etsy, WooCommerce and Walmart — but unlike those, it doesn't use a one-click OAuth redirect.",
      "You connect it manually, by pasting a Client ID and Refresh Token that you generate yourself in Jumia Vendor Center > Settings > Applications (Self Authorisation).",
      "Each sync pulls recent orders and current stock levels from your Jumia storefronts; the payout figure shown per order is an estimate from order revenue, not Jumia's official settled payout statement.",
      "Jumia stock feeds directly into your CFO inventory view and channel-labelled low-stock alerts — Jumia shipments and delivery tracking are deliberately left out of this connector's scope.",
      "This is a newly built connector, reviewed internally against Jumia's API but not yet verified end-to-end on a live seller account — worth spot-checking your first sync against Vendor Center's own numbers.",
    ],
    content: [
      {
        heading: "What the Jumia connector does",
        body: "Jumia is one of the E-Commerce sources under Sources in AskBiz, alongside Shopify, Amazon FBA, eBay, Etsy, WooCommerce and Walmart. Once connected, it's a pull-only sync: AskBiz reads your recent orders and current stock levels from Jumia Vendor Center and folds them into your unified business data, the same place every other channel — your physical till, your Shopify store, your Amazon listings — lands. That's the point of connecting it at all: instead of logging into Vendor Center separately to check how your Jumia storefront is doing, its orders and stock show up next to everything else, in one dashboard, in your local currency.",
      },
      {
        heading: "Why there's no one-click 'Connect' button",
        body: "Shopify, Amazon FBA, eBay and Etsy all use standard OAuth — you click Connect, get redirected to log into that platform, approve access, and land back in AskBiz already connected. Jumia's Vendor Center doesn't offer that for third-party apps. Instead it runs on what Jumia calls Self Authorization: you create your own Application inside your own Vendor Center account, and that generates a Client ID and a Refresh Token scoped to your shop. There's no AskBiz-owned app you're approving and no password ever passed between the two — you're generating a credential pair that only your Jumia account controls, then handing AskBiz those two values directly.",
      },
      {
        heading: "Connecting your account, step by step",
        body: "Log into Jumia Vendor Center and go to Settings, then Applications. Click Create Application and choose Self Authorisation as the type. Jumia will show you a Client ID — copy it — and let you generate a Refresh Token — copy that too. Back in AskBiz, go to Sources, find Jumia under E-Commerce, and paste the Client ID into the Client ID field and the Refresh Token into the Refresh Token field (this one is masked, like a password). AskBiz checks the credentials immediately by requesting an access token from Jumia and confirming it can read your shop list before saving the connection. If that check fails, the most common cause is the Application not having Order or Product permissions enabled in Vendor Center — go back and confirm those roles are ticked, then try again.",
      },
      {
        heading: "What actually syncs — and what doesn't",
        body: "Each sync fetches your recent orders (a rolling window, most recent first) and, for each one, the individual order line items — Jumia's model returns one row per unit sold rather than a quantity field, so a 3-unit line on your storefront comes back as three separate items, each carrying its own price, discount, tax and shipping figure. Stock levels come from a separate catalog endpoint, keyed by SKU. Worth knowing: the payout amount you'll see against a Jumia order in AskBiz is calculated from that order's net revenue after discounts, not pulled from Jumia's official settlement report — Jumia only exposes real commission and fee deductions on a separate payout-statement endpoint that this connector doesn't currently read. Treat the payout figure as a useful estimate for tracking trends, not a substitute for the payout report inside Vendor Center itself when you need the exact number. The connector is also pull-only in both directions of scope: it never writes back to your Jumia listings, prices or stock, and it deliberately doesn't touch Jumia's shipment or delivery-tracking data — this connector is about sales and stock visibility, not fulfilment logistics.",
      },
      {
        heading: "Where you'll see it in AskBiz",
        body: "Jumia orders count toward your combined revenue and order totals across every connected channel, each priced in the storefront's own local currency. Stock levels feed your CFO Inventory view, merged against the same product wherever possible — note that Jumia's stock feed doesn't include a product name, so until it's matched to a named listing from another channel, AskBiz shows the SKU in its place. Low-stock alerts are labelled by channel, so a warning that a Jumia SKU is running low won't get confused with the same SKU running fine in your physical shop. And in the Intelligence tab's channel filter, Jumia is a selectable option, so you can look at Jumia performance in isolation from everything else you sell on.",
      },
      {
        heading: "Worth knowing before you rely on it",
        body: "This connector was added recently. It's been built and reviewed internally against Jumia's documented Vendor Center API, but hasn't yet been run end-to-end against a live, active Jumia seller account — so treat your first sync as something to spot-check against Vendor Center's own order and stock figures rather than assuming it's exact from day one. If a sync stops working with an error about the refresh token, that almost always means it was revoked or expired in Vendor Center — generate a new Client ID and Refresh Token and reconnect from Sources. Behind the scenes, AskBiz also mints a fresh access token from your refresh token on every sync rather than trying to reuse one, since Jumia's access tokens are short-lived, and it deliberately paces its requests to stay under Jumia's rate limit rather than firing them all at once. Because each sync fetches a capped batch of your most recent orders, a very high-volume storefront may see its full recent history fill in over a couple of syncs rather than all at once on the first run.",
      },
    ],
    relatedSlugs: ["how-to-connect-shopify-askbiz", "how-to-connect-amazon-askbiz", "what-is-a-data-source"],
    faq: [
      {
        q: "Does connecting Jumia work the same way as Shopify or Amazon, with a login redirect?",
        a: "No. Shopify, Amazon FBA, eBay and Etsy use OAuth — you click Connect and log in on their site. Jumia doesn't support that for third-party apps, so you generate a Client ID and Refresh Token yourself in Jumia Vendor Center > Settings > Applications, then paste both into AskBiz under Sources.",
      },
      {
        q: "Can AskBiz change my Jumia prices, listings or stock levels?",
        a: "No. The connector is pull-only — it reads your orders and stock from Jumia, it never writes anything back to your Jumia storefront.",
      },
      {
        q: "Will I see Jumia shipment or delivery status in AskBiz?",
        a: "Not currently. Shipment and delivery-tracking data is deliberately outside this connector's scope — it covers orders, revenue and stock, not logistics.",
      },
      {
        q: "The payout amount on a Jumia order doesn't match what Jumia actually pays me — why?",
        a: "That figure is estimated from the order's net revenue after discounts, not pulled from Jumia's official payout statement, which reports real commission and fee deductions separately. Use Vendor Center's own payout report for the exact settled amount.",
      },
      {
        q: "My Jumia sync suddenly stopped working — what do I do?",
        a: "This almost always means your Refresh Token was revoked or expired in Vendor Center. Generate a new Client ID and Refresh Token from Settings > Applications and reconnect from Sources with the fresh values.",
      },
    ],
  },
];
