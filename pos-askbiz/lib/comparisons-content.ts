export interface ComparisonFeature {
  feature: string
  askbiz: string | boolean
  them: string | boolean
  winner: 'askbiz' | 'them' | 'tie'
}

export interface Comparison {
  slug: string
  competitor: string
  tagline: string
  description: string
  metaDescription: string
  heroHeading: string
  heroSubtitle: string
  theirColor: string
  verdict: string
  bestFor: { askbiz: string; them: string }
  features: ComparisonFeature[]
  faqs: { q: string; a: string }[]
}

export const COMPARISONS: Comparison[] = [
  {
    slug: 'google-looker-studio',
    competitor: 'Google Looker Studio',
    tagline: 'AskBiz vs Google Looker Studio',
    description: 'Both tools connect to your data and build dashboards. But Looker Studio requires you to build everything yourself — AskBiz gives you answers in plain English, automatically.',
    metaDescription: 'Comparing AskBiz vs Google Looker Studio for SME analytics. AskBiz connects your sales channels and surfaces insights automatically — no dashboard building required.',
    heroHeading: 'AskBiz vs Google Looker Studio',
    heroSubtitle: 'Looker Studio is free and powerful — but you build every report from scratch. AskBiz connects your data and surfaces the insights that matter, automatically.',
    theirColor: '#4285f4',
    verdict: 'Google Looker Studio is a capable free tool for teams with a data analyst to build and maintain reports. AskBiz is built for founders and operators who want answers without building dashboards — it connects your Shopify, Amazon, Xero, and ad accounts and tells you what\'s happening, every day.',
    bestFor: {
      askbiz: 'SME founders who want instant insights without building dashboards',
      them: 'Teams with a dedicated analyst who want full control over report design',
    },
    features: [
      { feature: 'Pre-built SME dashboards',         askbiz: true,                   them: false,                  winner: 'askbiz' },
      { feature: 'Plain-English answers',            askbiz: true,                   them: false,                  winner: 'askbiz' },
      { feature: 'Shopify / Amazon connect',         askbiz: true,                   them: 'Via Google Sheets only', winner: 'askbiz' },
      { feature: 'Xero / QuickBooks connect',        askbiz: true,                   them: 'Via connector add-on',   winner: 'askbiz' },
      { feature: 'AI-powered anomaly alerts',        askbiz: true,                   them: false,                  winner: 'askbiz' },
      { feature: 'Daily briefing email',             askbiz: true,                   them: false,                  winner: 'askbiz' },
      { feature: 'Custom report builder',            askbiz: 'Coming soon',          them: true,                   winner: 'them' },
      { feature: 'Free tier',                        askbiz: '14-day free trial',    them: 'Free forever',         winner: 'them' },
      { feature: 'Setup time',                       askbiz: 'Under 10 minutes',     them: '2–8 hours',            winner: 'askbiz' },
      { feature: 'Requires data expertise',          askbiz: false,                  them: true,                   winner: 'askbiz' },
      { feature: 'Mobile-friendly',                  askbiz: true,                   them: 'Limited',              winner: 'askbiz' },
      { feature: 'UK HMRC / VAT data',               askbiz: true,                   them: false,                  winner: 'askbiz' },
    ],
    faqs: [
      { q: 'Is Google Looker Studio free?', a: 'Yes, Looker Studio is free. However, you need to build every report and dashboard yourself, which typically requires a data analyst or someone comfortable with data modelling. AskBiz has a paid subscription but does all the setup work for you — most SME founders are seeing value within minutes of connecting their first data source.' },
      { q: 'Can Looker Studio connect to Shopify?', a: 'Not natively. You\'d need to export Shopify data to Google Sheets and connect that, or use a paid third-party connector. AskBiz connects directly to Shopify, Amazon, Xero, QuickBooks, Stripe, and advertising platforms out of the box.' },
      { q: 'Which is better for a non-technical founder?', a: 'AskBiz by a significant margin. Looker Studio requires you to understand data sources, dimensions, metrics, and chart configuration. AskBiz asks you a question and answers it in plain English using your actual business data.' },
    ],
  },
  {
    slug: 'power-bi',
    competitor: 'Microsoft Power BI',
    tagline: 'AskBiz vs Microsoft Power BI',
    description: 'Power BI is enterprise-grade and powerful. But it\'s built for data teams, not founders. AskBiz gives SME operators the same quality of insight without the complexity or the IT department.',
    metaDescription: 'AskBiz vs Microsoft Power BI for small business analytics. Power BI is built for enterprise data teams — AskBiz is built for SME founders who want answers, not tools.',
    heroHeading: 'AskBiz vs Microsoft Power BI',
    heroSubtitle: 'Power BI is the gold standard for enterprise analytics. AskBiz is built for SMEs who want the same quality of insight — without the complexity, the IT team, or the six-month implementation.',
    theirColor: '#f2c811',
    verdict: 'Power BI is exceptional for large organisations with data engineers and analysts. For an SME founder, it\'s significant overkill — and the learning curve is steep. AskBiz connects your existing tools in minutes and delivers actionable insights from day one.',
    bestFor: {
      askbiz: 'SMEs wanting instant, actionable insights from their existing tools',
      them: 'Enterprise teams with dedicated BI/data engineering resources',
    },
    features: [
      { feature: 'SME-ready out of the box',          askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Setup without IT support',           askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Plain-English AI answers',           askbiz: true,               them: 'Q&A visual only',  winner: 'askbiz' },
      { feature: 'Shopify / Amazon native connect',    askbiz: true,               them: 'Via Power Query',  winner: 'askbiz' },
      { feature: 'Enterprise data modelling',          askbiz: false,              them: true,               winner: 'them' },
      { feature: 'Hundreds of data connectors',        askbiz: 'Key SME sources',  them: true,               winner: 'them' },
      { feature: 'Custom calculated measures (DAX)',   askbiz: false,              them: true,               winner: 'them' },
      { feature: 'Daily automated briefing',           askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'AI anomaly alerts',                  askbiz: true,               them: 'Premium add-on',   winner: 'askbiz' },
      { feature: 'Cost for SME (per month)',           askbiz: 'From £49',         them: 'From £8 + setup',  winner: 'tie' },
      { feature: 'Time to first insight',              askbiz: '< 10 minutes',     them: 'Days to weeks',    winner: 'askbiz' },
      { feature: 'Mobile app',                         askbiz: true,               them: true,               winner: 'tie' },
    ],
    faqs: [
      { q: 'Is Power BI good for small businesses?', a: 'Power BI can work for small businesses, but it has a steep learning curve and typically requires someone comfortable with data modelling, DAX formulas, and Power Query. Most SME founders find the complexity disproportionate to their needs. AskBiz is designed specifically for the SME use case — connecting directly to your tools and surfacing insights without any configuration.' },
      { q: 'How much does Power BI cost?', a: 'Power BI Desktop is free but limited to a single user. Power BI Pro costs around £8 per user per month, but you\'ll also need time investment to build and maintain reports — which typically means paying an analyst or consultant. AskBiz pricing includes all the insight generation, so the total cost of ownership is more comparable than the licence fee suggests.' },
      { q: 'Can I switch from Power BI to AskBiz?', a: 'Yes. AskBiz connects to the same data sources (Shopify, Amazon, Xero, QuickBooks, Stripe, ad platforms) and starts surfacing insights immediately. Many users run both during a trial period before deciding.' },
    ],
  },
  {
    slug: 'tableau',
    competitor: 'Tableau',
    tagline: 'AskBiz vs Tableau',
    description: 'Tableau is the world\'s leading data visualisation tool. It\'s also priced and designed for enterprises. AskBiz delivers Tableau-quality insight for SMEs, at SME prices, with no data team required.',
    metaDescription: 'AskBiz vs Tableau for SME business intelligence. Tableau is enterprise-grade and expensive — AskBiz gives SME founders the same quality of insight without the complexity or the cost.',
    heroHeading: 'AskBiz vs Tableau',
    heroSubtitle: 'Tableau produces beautiful, powerful analytics. It also starts at £55/user/month and requires a data analyst to get value from it. AskBiz is built for the SME founder who wants answers, not visualisations.',
    theirColor: '#e8762d',
    verdict: 'Tableau is the industry standard for enterprise data visualisation and rightly so. For an SME, the cost, complexity, and implementation time are rarely justified. AskBiz delivers the insight layer — what\'s happening, why, and what to do — specifically designed for small and medium business operators.',
    bestFor: {
      askbiz: 'SME founders who want answers without a data analyst',
      them: 'Large organisations needing enterprise-grade data visualisation',
    },
    features: [
      { feature: 'SME pricing',                        askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Setup without a data analyst',       askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'eCommerce native connectors',        askbiz: true,               them: 'Paid add-ons',     winner: 'askbiz' },
      { feature: 'AI-generated plain-English insights',askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Enterprise data visualisation',      askbiz: false,              them: true,               winner: 'them' },
      { feature: 'Custom calculated fields',           askbiz: 'Key metrics built-in', them: true,           winner: 'them' },
      { feature: 'Hundreds of chart types',            askbiz: false,              them: true,               winner: 'them' },
      { feature: 'Daily briefing / alerts',            askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Time to value',                      askbiz: '< 10 minutes',     them: 'Weeks',            winner: 'askbiz' },
      { feature: 'Starting price',                     askbiz: 'From £49/month',   them: 'From £55/user/month', winner: 'askbiz' },
      { feature: 'Mobile app',                         askbiz: true,               them: true,               winner: 'tie' },
    ],
    faqs: [
      { q: 'Is Tableau worth it for a small business?', a: 'For most small businesses, Tableau is significant overkill. The minimum investment — licence fees plus the analyst time needed to build and maintain dashboards — typically runs to thousands of pounds per year before you see a single insight. AskBiz is built specifically for SMEs and delivers actionable insight from day one, at a fraction of the cost.' },
      { q: 'What does Tableau cost for a small team?', a: 'Tableau Creator licences start at around £55 per user per month (billed annually), and you\'ll typically need multiple licences plus Tableau Server or Tableau Online for sharing. The total cost for a small team can easily exceed £5,000/year before any implementation or training costs.' },
    ],
  },
  {
    slug: 'metabase',
    competitor: 'Metabase',
    tagline: 'AskBiz vs Metabase',
    description: 'Metabase is a great open-source BI tool for technical teams. AskBiz is built for non-technical founders who want insights without writing SQL or self-hosting a server.',
    metaDescription: 'AskBiz vs Metabase for small business analytics. Metabase requires a database and technical setup — AskBiz connects to your existing tools in minutes with no technical knowledge required.',
    heroHeading: 'AskBiz vs Metabase',
    heroSubtitle: 'Metabase is excellent for technical teams who want to query their own database. AskBiz is for founders who don\'t have a database engineer — and don\'t want one.',
    theirColor: '#509ee3',
    verdict: 'Metabase is a strong open-source BI tool if you have a database with your business data in it and someone technical to manage it. AskBiz connects directly to Shopify, Amazon, Xero, and your advertising platforms — no database, no SQL, no server setup.',
    bestFor: {
      askbiz: 'Non-technical SME founders wanting instant insights from existing tools',
      them: 'Technical teams wanting to query their own database with SQL',
    },
    features: [
      { feature: 'No database required',              askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'No SQL required',                   askbiz: true,               them: 'Basic mode available', winner: 'askbiz' },
      { feature: 'No self-hosting required',          askbiz: true,               them: 'Cloud version available', winner: 'tie' },
      { feature: 'eCommerce native connectors',       askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'AI plain-English insights',         askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Custom SQL queries',                askbiz: false,              them: true,               winner: 'them' },
      { feature: 'Open source / free tier',           askbiz: '14-day trial',     them: true,               winner: 'them' },
      { feature: 'Daily automated briefing',          askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Setup time',                        askbiz: '< 10 minutes',     them: 'Hours to days',    winner: 'askbiz' },
      { feature: 'UK HMRC / VAT awareness',           askbiz: true,               them: false,              winner: 'askbiz' },
    ],
    faqs: [
      { q: 'Is Metabase free?', a: 'Metabase Open Source is free to self-host. Metabase Cloud starts at $500/month for pro features. Self-hosting requires a server, database setup, and ongoing maintenance — costs that are often underestimated by small teams. AskBiz is a fully managed SaaS with no infrastructure to maintain.' },
      { q: 'Can Metabase connect to Shopify or Amazon?', a: 'Not directly. Metabase connects to databases — so you\'d need to first pipe your Shopify or Amazon data into a database (like PostgreSQL), then connect Metabase to that database. AskBiz connects natively to Shopify, Amazon, Xero, QuickBooks, Stripe, and advertising platforms.' },
    ],
  },
  {
    slug: 'databox',
    competitor: 'Databox',
    tagline: 'AskBiz vs Databox',
    description: 'Databox and AskBiz both connect to your business tools and surface key metrics. The difference: Databox shows you numbers in dashboards — AskBiz tells you what those numbers mean and what to do.',
    metaDescription: 'AskBiz vs Databox for SME business intelligence. Both connect to your tools — AskBiz goes further with AI-powered analysis and plain-English answers to your business questions.',
    heroHeading: 'AskBiz vs Databox',
    heroSubtitle: 'Databox is a solid KPI dashboard tool. AskBiz takes it further — not just showing you metrics, but explaining what\'s happening, flagging anomalies, and answering your questions.',
    theirColor: '#5f6bc0',
    verdict: 'Databox is strong for teams that want a polished KPI dashboard with a wide range of native integrations. AskBiz focuses on the insight layer — AI analysis, anomaly detection, plain-English answers — on top of the same data, making it better suited for founders who want to understand their business rather than just monitor it.',
    bestFor: {
      askbiz: 'Founders who want AI-powered analysis and plain-English answers',
      them: 'Teams who primarily want a polished KPI dashboard',
    },
    features: [
      { feature: 'AI plain-English answers',          askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Anomaly detection / alerts',        askbiz: true,               them: 'Basic alerts',     winner: 'askbiz' },
      { feature: 'Daily automated briefing',          askbiz: true,               them: 'Scorecard emails', winner: 'tie' },
      { feature: 'Native eCommerce connectors',       askbiz: true,               them: true,               winner: 'tie' },
      { feature: 'Pre-built dashboard templates',     askbiz: true,               them: true,               winner: 'tie' },
      { feature: 'Number of integrations',            askbiz: 'Key SME sources',  them: '70+ integrations', winner: 'them' },
      { feature: 'White-label / agency features',     askbiz: false,              them: true,               winner: 'them' },
      { feature: 'Free tier',                         askbiz: '14-day trial',     them: 'Free (3 users)',   winner: 'them' },
      { feature: 'UK-specific (VAT, HMRC)',           askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Time to first insight',             askbiz: '< 10 minutes',     them: '30–60 minutes',    winner: 'askbiz' },
    ],
    faqs: [
      { q: 'Is Databox free?', a: 'Databox has a free plan for up to 3 users and 3 data source connections with limited features. Paid plans start from around $47/month. AskBiz offers a 14-day free trial with full access.' },
      { q: 'What\'s the main difference between AskBiz and Databox?', a: 'Databox is primarily a dashboard and KPI tracking tool — it shows you metrics in a visual format. AskBiz adds an AI analysis layer on top — it explains what\'s happening in your metrics, flags anomalies, answers your questions in plain English, and delivers a daily briefing of your most important business updates.' },
    ],
  },
  {
    slug: 'geckoboard',
    competitor: 'Geckoboard',
    tagline: 'AskBiz vs Geckoboard',
    description: 'Geckoboard is designed for displaying KPIs on office TV screens. AskBiz is designed for founders making decisions — delivering insight wherever you are, not just on the wall.',
    metaDescription: 'AskBiz vs Geckoboard for business analytics. Geckoboard is a TV dashboard tool — AskBiz delivers AI-powered daily insight directly to founders on any device.',
    heroHeading: 'AskBiz vs Geckoboard',
    heroSubtitle: 'Geckoboard puts your KPIs on a TV screen. AskBiz puts the answers in your pocket — with AI analysis, daily briefings, and alerts wherever you are.',
    theirColor: '#00bc5b',
    verdict: 'Geckoboard excels at one specific use case: displaying live KPIs on office TV screens to keep teams aligned. AskBiz is a different product — built for founders who need analytical depth, AI-powered insight, and answers to specific business questions, not just metric displays.',
    bestFor: {
      askbiz: 'Founders wanting AI-powered insight and answers on any device',
      them: 'Teams wanting live KPI displays on office TV screens',
    },
    features: [
      { feature: 'AI plain-English answers',          askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'TV dashboard / wall display',       askbiz: false,              them: true,               winner: 'them' },
      { feature: 'Daily briefing email',              askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Anomaly alerts',                    askbiz: true,               them: 'Basic',            winner: 'askbiz' },
      { feature: 'Mobile-first experience',           askbiz: true,               them: 'Limited',          winner: 'askbiz' },
      { feature: 'eCommerce connectors',              askbiz: true,               them: true,               winner: 'tie' },
      { feature: 'Accounting connectors',             askbiz: true,               them: 'Limited',          winner: 'askbiz' },
      { feature: 'UK VAT / HMRC awareness',           askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Setup time',                        askbiz: '< 10 minutes',     them: '30–60 minutes',    winner: 'askbiz' },
      { feature: 'Starting price',                    askbiz: 'From £49/month',   them: 'From $49/month',   winner: 'tie' },
    ],
    faqs: [
      { q: 'What is Geckoboard best used for?', a: 'Geckoboard is specifically designed for creating live KPI dashboards that display on TV screens in offices, helping teams stay aligned on key metrics throughout the day. If that\'s your primary need, Geckoboard does it well. If you need analytical depth, AI-powered insight, or answers to specific business questions, AskBiz is a better fit.' },
    ],
  },
  {
    slug: 'klipfolio',
    competitor: 'Klipfolio',
    tagline: 'AskBiz vs Klipfolio',
    description: 'Klipfolio is a highly customisable dashboard platform. AskBiz trades some of that customisation for intelligence — pre-built insights, AI analysis, and answers that don\'t require hours of setup.',
    metaDescription: 'AskBiz vs Klipfolio for SME analytics. Klipfolio is highly customisable but complex — AskBiz delivers immediate insight from your business tools without the configuration overhead.',
    heroHeading: 'AskBiz vs Klipfolio',
    heroSubtitle: 'Klipfolio gives you complete control over how your data looks. AskBiz gives you complete clarity on what your data means — automatically.',
    theirColor: '#f7941d',
    verdict: 'Klipfolio is a powerful, flexible dashboard platform with deep customisation capabilities. This flexibility comes with complexity — you\'ll spend time building and maintaining Klips before you start getting value. AskBiz prioritises time-to-insight: connect your tools and start seeing what matters within minutes.',
    bestFor: {
      askbiz: 'Founders wanting instant insight with minimal configuration',
      them: 'Teams wanting fully customisable dashboards and deep flexibility',
    },
    features: [
      { feature: 'Time to first insight',             askbiz: '< 10 minutes',     them: 'Hours to days',    winner: 'askbiz' },
      { feature: 'AI plain-English analysis',         askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Dashboard customisation',           askbiz: 'Curated',          them: 'Fully custom',     winner: 'them' },
      { feature: 'Formula / calculation editor',      askbiz: false,              them: true,               winner: 'them' },
      { feature: 'eCommerce native connectors',       askbiz: true,               them: true,               winner: 'tie' },
      { feature: 'Daily briefing / alerts',           askbiz: true,               them: 'Alerts only',      winner: 'askbiz' },
      { feature: 'UK-specific (VAT, HMRC)',           askbiz: true,               them: false,              winner: 'askbiz' },
      { feature: 'Free tier',                         askbiz: '14-day trial',     them: 'Free (2 users)',   winner: 'them' },
      { feature: 'White-label for agencies',          askbiz: false,              them: true,               winner: 'them' },
    ],
    faqs: [
      { q: 'Is Klipfolio good for small businesses?', a: 'Klipfolio can work well for small businesses with someone willing to invest time in configuring dashboards. If you want plug-and-play insight with no configuration, AskBiz is a faster path to value. If you want maximum flexibility and control over every element of your dashboards, Klipfolio is worth the setup investment.' },
    ],
  },
]

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find(c => c.slug === slug)
}
