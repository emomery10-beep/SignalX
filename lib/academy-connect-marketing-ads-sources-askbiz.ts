import type { AcademyArticle } from "./academy-types";

export const academyMarketingAdsSources: AcademyArticle[] = [
  {
    slug: "connect-marketing-ads-sources-askbiz",
    title: "Connect Your Marketing Data: Meta Ads, Google Ads, Google Analytics, Mailchimp & Klaviyo",
    description: "How to connect the five Marketing & Ads sources in AskBiz — Meta Ads, Google Ads, Google Analytics, Mailchimp and Klaviyo — and what each one syncs into your dashboard.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: [
      "Meta Ads", "Google Ads", "Google Analytics", "Mailchimp", "Klaviyo",
      "Marketing & Ads sources", "AskBiz Sources", "ad spend", "ROAS",
      "email marketing", "connect marketing data",
    ],
    keyTakeaways: [
      "Sources > Marketing & Ads has five connectors: Meta Ads, Google Ads, Google Analytics, Mailchimp and Klaviyo — each pulls a different slice of your marketing performance into AskBiz.",
      "Four of the five connect with one click via OAuth (Meta Ads, Google Ads, Google Analytics, Mailchimp). Klaviyo is the exception — you paste a private API key instead, because Klaviyo doesn't offer an OAuth app flow for this kind of read access.",
      "Each source feeds different numbers: Meta Ads and Google Ads bring spend/ROAS/CPM/CPC, Google Analytics brings site traffic and funnels, Mailchimp brings campaign performance, and Klaviyo brings email-attributed revenue.",
      "On the Free plan you can connect up to 3 data sources in total, across any category — so a mix of e.g. Meta Ads, Mailchimp and your POS already uses your full quota. Growth and Business plans remove the cap entirely.",
      "These aren't placeholder connectors — each one has real sync logic behind it, so once connected they pull live data on an ongoing basis, not just a one-off import.",
    ],
    content: [
      {
        heading: "Where to find them",
        body: "Open Sources from the main AskBiz navigation. The connectors are grouped by category, and Marketing & Ads is one of those groups, sitting alongside E-Commerce, Accounting, Payments and the rest. Inside it you'll find five cards: Meta Ads, Google Ads, Google Analytics, Mailchimp and Klaviyo. You can also use the search box at the top of the Sources page — typing \"ads\", \"mailchimp\" or \"klaviyo\" filters straight down to the relevant card. Each card shows a short description of what it syncs, and a Connect button. Once connected, a source moves up into the \"Connected\" list at the top of the page, where you can trigger a manual sync or disconnect it at any time.",
      },
      {
        heading: "Meta Ads — Facebook & Instagram ad performance",
        body: "Meta Ads connects your Facebook and Instagram advertising account. Click Connect and AskBiz redirects you to Meta to sign in and approve read access to your ad accounts — there's nothing to type or paste. Once approved, it syncs your ad spend alongside ROAS (return on ad spend), CPM (cost per thousand impressions) and CPC (cost per click), so you can see what your ad budget is actually returning without opening Ads Manager separately. This is useful for connecting the dots between what you're spending on Facebook and Instagram ads and what's actually landing in your sales — especially if you're also running Instagram Shopping or a Shopify store through AskBiz, since spend and revenue then sit side by side.",
      },
      {
        heading: "Google Ads — search campaign performance",
        body: "Google Ads works the same way as Meta Ads: click Connect, sign in to your Google account, and approve read-only access to your ad accounts. It syncs your search campaign spend, ROAS and conversions, so you can track what your Google search ads are costing versus what they're converting into. If you're already running Google Ads to drive traffic to a website or store, connecting it here means that spend shows up next to your other marketing and revenue numbers instead of living only in a separate Google Ads login.",
      },
      {
        heading: "Google Analytics — site traffic and funnels",
        body: "Google Analytics is a separate connector from Google Ads, even though both go through Google's login. This one connects to a GA4 property on your website — it's about what happens once someone lands on your site, not what you paid to get them there. It syncs traffic and sessions, funnel data (where visitors drop off before converting), and e-commerce revenue if you have GA4's e-commerce tracking set up. Click Connect, sign in with the Google account that has access to your GA4 property, and approve access. Pairing this with Google Ads or Meta Ads gives you the fuller picture: what you spent to bring someone to your site, and what they actually did once they got there.",
      },
      {
        heading: "Mailchimp — email campaign performance",
        body: "Mailchimp connects via OAuth as well — click Connect, sign in to Mailchimp, and approve access. It syncs your campaigns along with open rates, click rates and audience data, so your email marketing performance sits in the same dashboard as your sales and ad spend rather than only in Mailchimp's own reporting.",
      },
      {
        heading: "Klaviyo — the one that's different: a pasted API key, not OAuth",
        body: "Klaviyo is the odd one out among the five. Instead of a Connect button that redirects you to sign in, you'll see a field asking for a private API key. To get one, log in to Klaviyo, go to Account, then Settings, then API Keys, and create (or copy) a private API key from there. Paste it into the field in AskBiz and connect. This is a deliberate difference in how the connector works, not a broken OAuth flow — Klaviyo's API for this kind of account-level read access is key-based rather than OAuth-based, so a private key is the correct and expected way to connect it. Because a private API key is a genuine credential, treat it the same way you'd treat a password: only generate it from your own Klaviyo account, and don't share it outside of pasting it directly into AskBiz. Once connected, Klaviyo syncs email-attributed revenue, your flows (automated email sequences), open rates and attribution — so you can see how much revenue your Klaviyo emails are actually driving, not just how many people opened them.",
      },
      {
        heading: "Free plan source limits",
        body: "The Free plan allows up to 3 connected data sources in total, and that cap applies across every category combined — it isn't 3 per category. So if you connect Meta Ads, Mailchimp and your AskBiz POS, you've used your full quota and would need to disconnect one before adding a fourth, whether that fourth one is Klaviyo, Shopify, or anything else. Growth and Business plans remove this limit entirely, giving you unlimited source connections across AskBiz's full integration list. If marketing data is a priority for you, it's worth deciding upfront which sources matter most on the Free plan, or upgrading if you want all five Marketing & Ads connectors alongside your sales and accounting sources at the same time.",
      },
      {
        heading: "What happens after you connect",
        body: "Once a source is connected, it appears in the Connected list at the top of the Sources page with a status indicator and a \"last synced\" time. These aren't one-off imports — each of the five has real sync logic behind it that keeps pulling fresh data on an ongoing basis, and you can also press \"Sync now\" on any connected source if you want the latest numbers immediately rather than waiting for the next automatic sync. If a source ever shows an error status — for example if Klaviyo's API key has been revoked, or an OAuth token needs re-approving — the error message on that row will tell you what went wrong, and reconnecting is the same process as connecting for the first time.",
      },
    ],
    relatedSlugs: ["how-to-connect-shopify-askbiz", "what-is-a-data-source", "pos-integrations-askbiz"],
    faq: [
      {
        q: "Why does Klaviyo ask for an API key instead of just letting me sign in like the others?",
        a: "Meta Ads, Google Ads, Google Analytics and Mailchimp all use OAuth, so you sign in and approve access with one click. Klaviyo's connector uses a private API key instead, because that's the correct way to grant this kind of read access to Klaviyo's API. Generate it from Klaviyo under Account, then Settings, then API Keys, and paste it into AskBiz.",
      },
      {
        q: "Do Google Ads and Google Analytics use the same connection?",
        a: "No — they're two separate connectors on the Sources page, even though both redirect you through a Google sign-in. Google Ads syncs your ad spend and campaign performance; Google Analytics syncs your website traffic and funnels from a GA4 property. You can connect either one on its own, or both.",
      },
      {
        q: "I'm on the Free plan — can I connect all five Marketing & Ads sources?",
        a: "Only if they're the only sources you connect. The Free plan allows up to 3 data sources total, across every category combined, not 3 per category. Connecting all five Marketing & Ads sources plus anything else — your POS, Shopify, accounting software — would exceed that limit. Growth and Business plans have unlimited source connections.",
      },
      {
        q: "Is my Klaviyo API key safe to paste into AskBiz?",
        a: "The field is a password-style input, and it's used only to authenticate AskBiz's read access to your Klaviyo account. Treat the key itself the same way you'd treat any other account credential — only generate it from your own Klaviyo account, and don't paste it anywhere except directly into the AskBiz connection field.",
      },
      {
        q: "What exactly does each source sync — is it a one-time import?",
        a: "No, none of the five are one-off imports. Meta Ads and Google Ads sync spend, ROAS, CPM/CPC and conversions; Google Analytics syncs traffic, sessions, funnels and e-commerce revenue; Mailchimp syncs campaigns, open rates, click rates and audience; Klaviyo syncs email revenue, flows, open rates and attribution. Each keeps syncing on an ongoing basis once connected, and you can trigger a manual sync at any time from the Connected list.",
      },
    ],
  },
];
