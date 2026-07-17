import { TRADE_NEWS_ARTICLES } from './trade-news-content'

// AskBiz 500 SEO Articles — integration blog batches
import { INTEGRATION_BLOGS_BATCH_1 } from './integration-blogs-batch1'
import { INTEGRATION_BLOGS_BATCH_2 } from './integration-blogs-batch2'
import { INTEGRATION_BLOGS_BATCH_3_UK } from './integration-blogs-batch3-uk'
import { INTEGRATION_BLOGS_BATCH_4_SINGAPORE } from './integration-blogs-batch4-singapore'
import { INTEGRATION_BLOGS_BATCH_5_ASEAN } from './integration-blogs-batch5-asean'
import { INTEGRATION_BLOGS_BATCH_6_ADVANCED_ANALYTICS } from './integration-blogs-batch6-advanced-analytics'
import { INTEGRATION_BLOGS_BATCH_7_MOBILE } from './integration-blogs-batch7-mobile'
import { BATCH_8_SUPPLY_CHAIN } from './integration-blogs-batch8-supply-chain'
import { BATCH_9_CUSTOMER_RETENTION } from './integration-blogs-batch9-customer-retention'
import { INTEGRATION_BLOGS_BATCH_10_FINANCIAL_PLANNING } from './integration-blogs-batch10-financial-planning'
import { batch10PricingPosts } from './integration-blogs-batch10-pricing'
import { BATCH_11_COMPLIANCE } from './integration-blogs-batch11-compliance'
import { batch12AutomationPosts } from './integration-blogs-batch12-automation'
import { batch13RestaurantPosts } from './integration-blogs-batch13-restaurant-fb'
import { batch14DigitalMarketingPosts } from './integration-blogs-batch14-digital-marketing'
import { batch15RepairServicesPosts } from './integration-blogs-batch15-repair-services'
import { batch16FactoryManufacturingPosts } from './integration-blogs-batch16-factory-manufacturing'
import { batch17LogisticsDeliveryPosts } from './integration-blogs-batch17-logistics-delivery'
import { batch18CrisisResiliencePosts } from './integration-blogs-batch18-crisis-resilience'
import { batch19MarketingAnalyticsPosts } from './integration-blogs-batch19-marketing-analytics'
import { batch20GrowthScalingPosts } from './integration-blogs-batch20-growth-scaling'
import { POS_SEO_AFRICA_BATCH1 } from './pos-seo-africa-batch1'

// Africa Informal Business — 250 articles for street vendors, market stall owners, and car-boot sellers across 25 countries
import { AFRICA_INFORMAL_UGANDA } from './africa-informal-batch-uganda'
import { AFRICA_INFORMAL_TANZANIA } from './africa-informal-batch-tanzania'
import { AFRICA_INFORMAL_RWANDA } from './africa-informal-batch-rwanda'
import { AFRICA_INFORMAL_ETHIOPIA } from './africa-informal-batch-ethiopia'
import { AFRICA_INFORMAL_SENEGAL } from './africa-informal-batch-senegal'
import { AFRICA_INFORMAL_COTE_DIVOIRE } from './africa-informal-batch-cote-divoire'
import { AFRICA_INFORMAL_CAMEROON } from './africa-informal-batch-cameroon'
import { AFRICA_INFORMAL_ZAMBIA } from './africa-informal-batch-zambia'
import { AFRICA_INFORMAL_MALAWI } from './africa-informal-batch-malawi'
import { AFRICA_INFORMAL_MOZAMBIQUE } from './africa-informal-batch-mozambique'
import { AFRICA_INFORMAL_ZIMBABWE } from './africa-informal-batch-zimbabwe'
import { AFRICA_INFORMAL_BOTSWANA } from './africa-informal-batch-botswana'
import { AFRICA_INFORMAL_NAMIBIA } from './africa-informal-batch-namibia'
import { AFRICA_INFORMAL_EGYPT } from './africa-informal-batch-egypt'
import { AFRICA_INFORMAL_MOROCCO } from './africa-informal-batch-morocco'
import { AFRICA_INFORMAL_ALGERIA } from './africa-informal-batch-algeria'
import { AFRICA_INFORMAL_TUNISIA } from './africa-informal-batch-tunisia'
import { AFRICA_INFORMAL_DR_CONGO } from './africa-informal-batch-dr-congo'
import { AFRICA_INFORMAL_SIERRA_LEONE } from './africa-informal-batch-sierra-leone'
import { AFRICA_INFORMAL_BENIN } from './africa-informal-batch-benin'
import { AFRICA_INFORMAL_TOGO } from './africa-informal-batch-togo'
import { AFRICA_INFORMAL_ANGOLA } from './africa-informal-batch-angola'
import { AFRICA_INFORMAL_MALI } from './africa-informal-batch-mali'
import { AFRICA_INFORMAL_BURKINA_FASO } from './africa-informal-batch-burkina-faso'
import { AFRICA_INFORMAL_MADAGASCAR } from './africa-informal-batch-madagascar'

// Africa Blogs — FMCG, electronics, exports, and sector-specific SEO content (100 articles)
import { AFRICA_BLOGS_BATCH1 } from './africa-blogs-batch1'
import { AFRICA_BLOGS_BATCH2 } from './africa-blogs-batch2'
import { AFRICA_BLOGS_BATCH3 } from './africa-blogs-batch3'
import { AFRICA_BLOGS_BATCH4 } from './africa-blogs-batch4'

// AskBiz BI Market Blog Integration — Kenya, Nigeria, UK/EU, Cross-market (58 articles)
import { BI_MARKET_BLOG_POSTS } from './bi-blogs-integration'

export interface BlogPost {
  slug: string
  title: string
  metaDescription: string
  cluster: string
  pillar: string
  publishDate: string
  readTime: number
  tldr: string
  sections: Array<{
    heading: string
    level: 2 | 3 | 4
    body: string
  }>
  paa: Array<{ q: string; a: string }>
  /**
   * Per-post call-to-action. Two conventions exist across the content set:
   * { heading, body } (a headline + paragraph) and { text, href } (a label +
   * link). Both are accepted; the renderer reads heading→text and uses href.
   */
  cta?: { heading?: string; body?: string; text?: string; href?: string }
  relatedSlugs: string[]
  i18n?: { hreflang: { lang: string; url: string }[] }
  /** Optional byline; when absent the page shows the AskBiz Editorial Team. */
  author?: { name: string; role?: string; bio?: string }
}

const ALL_POSTS = [
  // AskBiz 500 SEO Articles — integration blog batches (525 articles across 21 batches)
  ...INTEGRATION_BLOGS_BATCH_1, ...INTEGRATION_BLOGS_BATCH_2, ...INTEGRATION_BLOGS_BATCH_3_UK,
  ...INTEGRATION_BLOGS_BATCH_4_SINGAPORE, ...INTEGRATION_BLOGS_BATCH_5_ASEAN, ...INTEGRATION_BLOGS_BATCH_6_ADVANCED_ANALYTICS,
  ...INTEGRATION_BLOGS_BATCH_7_MOBILE, ...BATCH_8_SUPPLY_CHAIN, ...BATCH_9_CUSTOMER_RETENTION,
  ...INTEGRATION_BLOGS_BATCH_10_FINANCIAL_PLANNING, ...batch10PricingPosts, ...BATCH_11_COMPLIANCE,
  ...batch12AutomationPosts, ...batch13RestaurantPosts, ...batch14DigitalMarketingPosts,
  ...batch15RepairServicesPosts, ...batch16FactoryManufacturingPosts, ...batch17LogisticsDeliveryPosts,
  ...batch18CrisisResiliencePosts, ...batch19MarketingAnalyticsPosts, ...batch20GrowthScalingPosts,
  // Africa informal business SEO — duka, spaza, mama mboga, jua kali, kiosk, tuck shop
  ...POS_SEO_AFRICA_BATCH1,
  // Africa Informal Business — 250 articles across 25 countries for street vendors, market stalls, car-boot sellers
  ...AFRICA_INFORMAL_UGANDA, ...AFRICA_INFORMAL_TANZANIA, ...AFRICA_INFORMAL_RWANDA, ...AFRICA_INFORMAL_ETHIOPIA, ...AFRICA_INFORMAL_SENEGAL,
  ...AFRICA_INFORMAL_COTE_DIVOIRE, ...AFRICA_INFORMAL_CAMEROON, ...AFRICA_INFORMAL_ZAMBIA, ...AFRICA_INFORMAL_MALAWI, ...AFRICA_INFORMAL_MOZAMBIQUE,
  ...AFRICA_INFORMAL_ZIMBABWE, ...AFRICA_INFORMAL_BOTSWANA, ...AFRICA_INFORMAL_NAMIBIA, ...AFRICA_INFORMAL_EGYPT, ...AFRICA_INFORMAL_MOROCCO,
  ...AFRICA_INFORMAL_ALGERIA, ...AFRICA_INFORMAL_TUNISIA, ...AFRICA_INFORMAL_DR_CONGO, ...AFRICA_INFORMAL_SIERRA_LEONE, ...AFRICA_INFORMAL_BENIN,
  ...AFRICA_INFORMAL_TOGO, ...AFRICA_INFORMAL_ANGOLA, ...AFRICA_INFORMAL_MALI, ...AFRICA_INFORMAL_BURKINA_FASO, ...AFRICA_INFORMAL_MADAGASCAR,
  // Africa Blogs — FMCG, electronics, exports, sector-specific SEO content
  ...AFRICA_BLOGS_BATCH1, ...AFRICA_BLOGS_BATCH2, ...AFRICA_BLOGS_BATCH3, ...AFRICA_BLOGS_BATCH4,
  // AskBiz BI Market Blog Integration — Kenya, Nigeria, UK/EU, Cross-market
  ...BI_MARKET_BLOG_POSTS,
  // Global Trade Intelligence — 63 canonical articles (consolidated 2026-07-03,
  // see lib/trade-news-content.ts for the full history of why)
  ...TRADE_NEWS_ARTICLES,
]

// Cache expanded posts so they're available for both sitemap and routing
let expandedPostsCache: BlogPost[] | null = null

function getExpandedPosts(): BlogPost[] {
  if (expandedPostsCache !== null) {
    return expandedPostsCache
  }

  const seen = new Set<string>()
  const expandedPosts: BlogPost[] = []

  // Separate Trade News from other articles
  const tradeNewsArticles: BlogPost[] = []
  const otherArticles: BlogPost[] = []

  for (const post of ALL_POSTS) {
    if (!post) continue
    // Trade News articles have 'Global Trade Intelligence' pillar
    if (post.pillar === 'Global Trade Intelligence') {
      tradeNewsArticles.push(post)
    } else {
      otherArticles.push(post)
    }
  }

  // Add all other articles (Middle East, China/US, Africa, etc.) first
  expandedPosts.push(...otherArticles)

  // Add Trade News articles (63 canonical articles, see lib/trade-news-content.ts)
  expandedPosts.push(...tradeNewsArticles)

  // Filter and cache
  expandedPostsCache = expandedPosts.filter((p): p is BlogPost => {
    if (!p || !p.slug || seen.has(p.slug)) return false
    if (!p.sections || !Array.isArray(p.sections) || p.sections.length === 0) return false
    if (!p.publishDate) return false
    seen.add(p.slug)
    return true
  })

  return expandedPostsCache
}

export function getAllPosts(): BlogPost[] {
  return getExpandedPosts()
}

export function getPost(slug: string): BlogPost | undefined {
  return getExpandedPosts().find(p => p && p.slug === slug)
}

export function getPostsByCluster(cluster: string): BlogPost[] {
  return ALL_POSTS.filter(p => p && p.cluster === cluster)
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return (post.relatedSlugs || []).map(s => ALL_POSTS.find(p => p && p.slug === s)).filter(Boolean) as BlogPost[]
}
