// ============================================================
// AskBiz POS Learning Hub Content — Blogs, Articles, Learning Paths
// ============================================================

export interface AskBizBlogPost {
  slug: string
  title: string
  description: string
  category: 'pos-features' | 'strategy' | 'compliance' | 'technical'
  readTime: number
  publishDate: string
  filePath: string
  keywords: string[]
}

export interface AskBizArticle {
  slug: string
  title: string
  description: string
  category: 'architecture' | 'pricing' | 'compliance' | 'operations'
  readTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  filePath: string
  keywords: string[]
}

export interface AskBizLearningPath {
  slug: string
  title: string
  description: string
  modules: number
  estimatedHours: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  filePath: string
  keywords: string[]
}

// Blog posts
export const ASKBIZ_BLOG_POSTS: AskBizBlogPost[] = [
  {
    slug: 'pos-kpi-drilldown',
    title: 'POS Dashboard KPI Drill-Down: Interactive Analytics',
    description: 'Transform raw KPI numbers into actionable business intelligence with interactive drill-down analytics',
    category: 'pos-features',
    readTime: 8,
    publishDate: '2026-05-14',
    filePath: '/content/blogs/01-pos-kpi-drilldown.md',
    keywords: ['KPI', 'analytics', 'dashboard', 'drill-down', 'retail']
  },
  {
    slug: 'transaction-filtering',
    title: 'Transaction Filtering & Real-Time Analytics',
    description: 'Master transaction filtering techniques to unlock insights from your POS data',
    category: 'pos-features',
    readTime: 9,
    publishDate: '2026-05-14',
    filePath: '/content/blogs/02-transaction-filtering.md',
    keywords: ['filtering', 'transactions', 'analytics', 'real-time', 'POS']
  },
  {
    slug: 'seat-pricing-model',
    title: 'Seat-Based Pricing Model: A Game-Changer',
    description: 'Why per-seat pricing aligns incentives and delivers better ROI than traditional POS models',
    category: 'strategy',
    readTime: 7,
    publishDate: '2026-05-14',
    filePath: '/content/blogs/03-seat-pricing-model.md',
    keywords: ['pricing', 'SaaS', 'seats', 'business model', 'ROI']
  },
  {
    slug: 'gdpr-compliance-pos',
    title: 'GDPR Compliance in Retail POS Systems',
    description: 'Build customer trust while staying compliant with European data protection laws',
    category: 'compliance',
    readTime: 10,
    publishDate: '2026-05-14',
    filePath: '/content/blogs/04-gdpr-compliance-pos.md',
    keywords: ['GDPR', 'privacy', 'compliance', 'data protection', 'retail']
  },
  {
    slug: 'tax-automation',
    title: 'Tax Automation: Never Do Manual Calculations Again',
    description: 'How intelligent POS systems calculate, report, and file taxes automatically',
    category: 'compliance',
    readTime: 9,
    publishDate: '2026-05-14',
    filePath: '/content/blogs/05-tax-automation.md',
    keywords: ['tax', 'VAT', 'automation', 'compliance', 'HMRC']
  },
  {
    slug: 'affordable-pos-uk-small-business',
    title: 'Why UK Small Businesses Are Overpaying for Their POS System',
    description: 'Square, Lightspeed, and traditional POS hardware cost far more than most UK small business owners realise. Here is the real maths — and a better model.',
    category: 'strategy',
    readTime: 8,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/08-affordable-pos-uk-small-business.md',
    keywords: ['UK', 'small business', 'POS cost', 'Square alternative', 'affordable POS', 'HMRC', 'retail']
  },
  {
    slug: 'africa-business-intelligence-data-scarce',
    title: 'Business Intelligence for African SMEs: Getting Insights Where Data Has Always Been Scarce',
    description: 'Most African small businesses have never had access to real business data. Collective intelligence changes that — pooling anonymised data from similar traders to create meaningful benchmarks even where individual history is short.',
    category: 'strategy',
    readTime: 10,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/09-africa-business-intelligence-data-scarce.md',
    keywords: ['Africa', 'Nigeria', 'Kenya', 'Ghana', 'SME', 'business intelligence', 'data-scarce', 'collective intelligence']
  },
  {
    slug: 'eu-gdpr-pos-compliance',
    title: 'GDPR-Ready POS: How European Small Businesses Stay Compliant Without the Legal Bills',
    description: 'EU businesses must handle customer data under GDPR — but most affordable POS systems were not built with this in mind. How AskBiz handles compliance by default.',
    category: 'compliance',
    readTime: 9,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/10-eu-gdpr-pos-compliance.md',
    keywords: ['GDPR', 'EU', 'compliance', 'data protection', 'France', 'Germany', 'Netherlands', 'POS']
  },
  {
    slug: 'us-small-business-pos-cost',
    title: 'The Real Cost of Your POS System: What American Small Business Owners Are Not Told',
    description: 'Toast, Square, and Clover all charge hardware plus monthly fees plus per-transaction cuts. A realistic cost comparison for US small business owners — and what seat-based pricing actually means.',
    category: 'strategy',
    readTime: 9,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/11-us-small-business-pos-cost.md',
    keywords: ['US', 'America', 'small business', 'Toast alternative', 'Clover alternative', 'POS cost', 'restaurant POS']
  },
  {
    slug: 'multi-sector-one-dashboard',
    title: 'Running a Restaurant AND a Repair Shop? One Dashboard Now Covers Both',
    description: 'Many small business owners operate across multiple sectors. AskBiz is the first affordable POS to handle Restaurant, Retail, Repair, and Salon from a single account — with separated intelligence and staff permissions for each.',
    category: 'pos-features',
    readTime: 7,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/12-multi-sector-one-dashboard.md',
    keywords: ['multi-sector', 'restaurant', 'repair', 'retail', 'salon', 'one dashboard', 'small business']
  },
  {
    slug: 'africa-mobile-market-traders',
    title: 'From Nairobi to Lagos: How Mobile Market Traders Are Getting Enterprise-Grade Intelligence',
    description: 'African market traders and informal sellers have always priced by gut feel and tracked nothing. AskBiz changes that — running on any Android phone, with WhatsApp staff login and GPS-tagged sales showing exactly where revenue is generated.',
    category: 'strategy',
    readTime: 10,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/13-africa-mobile-market-traders.md',
    keywords: ['Africa', 'Kenya', 'Nigeria', 'market traders', 'mobile POS', 'informal economy', 'WhatsApp', 'geo-tagged']
  },
  {
    slug: 'collective-intelligence-small-business',
    title: 'You Do Not Need Big Data — You Need Shared Data: The Collective Intelligence Model',
    description: 'How k-anonymised collective benchmarking gives every small business the intelligence that was previously only available to large chains — without exposing anyone\'s individual data.',
    category: 'strategy',
    readTime: 9,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/14-collective-intelligence-small-business.md',
    keywords: ['collective intelligence', 'benchmarking', 'anonymised data', 'small business', 'pricing intelligence', 'Africa']
  },
  {
    slug: 'restaurant-daily-brief-intelligence',
    title: 'What if Your Restaurant Got a Business Report Every Morning Before Service?',
    description: 'AskBiz Restaurant generates a daily brief every morning — revenue vs target, covers, average ticket, waste cost, and an AI-written recommendation. The intelligence a chain has, at independent restaurant prices.',
    category: 'pos-features',
    readTime: 8,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/15-restaurant-daily-brief-intelligence.md',
    keywords: ['restaurant', 'daily brief', 'AI intelligence', 'hospitality', 'food & beverage', 'morning report']
  },
  {
    slug: 'making-tax-digital-uk-pos',
    title: 'Making Tax Digital Is Coming for Every UK Business — Is Your POS Ready?',
    description: 'HMRC\'s MTD programme is expanding to cover more businesses. AskBiz POS exports compliant VAT reports directly from the dashboard — no manual spreadsheets, no accountant needed for basic filing.',
    category: 'compliance',
    readTime: 8,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/16-making-tax-digital-uk-pos.md',
    keywords: ['Making Tax Digital', 'MTD', 'HMRC', 'VAT', 'UK', 'compliance', 'small business']
  },
  {
    slug: 'staff-sector-permissions-pos',
    title: 'How to Give Staff Exactly the Right Access — No More, No Less',
    description: 'The risk of giving all staff full POS access. How sector-based permissions mean restaurant staff only see the restaurant, repair staff only see repairs — and the admin sees everything from one place.',
    category: 'pos-features',
    readTime: 7,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/17-staff-sector-permissions-pos.md',
    keywords: ['staff permissions', 'sector access', 'POS security', 'role-based access', 'multi-sector', 'small business']
  },
  {
    slug: 'pos-without-hardware',
    title: 'Why the Hardware Model of POS Is Broken — and What Replaces It',
    description: 'Traditional POS vendors sell you terminals, card readers, and receipt printers. In the UK that is £500–2000 upfront. In Nigeria or Ghana, even more proportionally. AskBiz runs on the phone you already own.',
    category: 'strategy',
    readTime: 9,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/18-pos-without-hardware-africa-asia.md',
    keywords: ['no hardware', 'mobile POS', 'Africa', 'Asia', 'affordable', 'phone POS', 'WhatsApp receipts']
  },
  {
    slug: 'branch-sector-intelligence',
    title: 'Filtering Your Business by Branch and Sector: Why Granular Intelligence Changes Everything',
    description: 'A business with three branches and two sectors needs to answer specific questions — not see everything blended together. How AskBiz branch and sector filters work across every tab of the dashboard.',
    category: 'pos-features',
    readTime: 7,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/19-branch-sector-intelligence.md',
    keywords: ['branch filter', 'sector filter', 'multi-location', 'intelligence', 'dashboard', 'analytics']
  },
  {
    slug: 'africa-fintech-sme-intelligence',
    title: 'The Missing Layer in African Fintech: Business Intelligence for the Informal Economy',
    description: 'M-Pesa and Flutterwave solved payments. But payment is not intelligence. AskBiz is the layer that tells African SMEs which products drive margin, which staff are performing, and how they compare to similar businesses nearby.',
    category: 'strategy',
    readTime: 11,
    publishDate: '2026-05-17',
    filePath: '/content/blogs/20-africa-fintech-sme-intelligence.md',
    keywords: ['Africa', 'fintech', 'M-Pesa', 'Flutterwave', 'SME', 'informal economy', 'business intelligence', 'Nigeria', 'Kenya']
  }
]

// Academic articles
export const ASKBIZ_ACADEMIC_ARTICLES: AskBizArticle[] = [
  {
    slug: 'pos-architecture',
    title: 'Architectural Design of Modern Cloud-Based POS Systems',
    description: 'Technical analysis of multi-tenant SaaS architecture for retail transaction processing',
    category: 'architecture',
    readTime: 12,
    difficulty: 'advanced',
    filePath: '/content/academic-articles/01-pos-architecture.md',
    keywords: ['architecture', 'cloud', 'multi-tenant', 'SaaS', 'microservices']
  },
  {
    slug: 'saas-pricing-models',
    title: 'Multi-Tenant SaaS Pricing Models: Theory & Practice',
    description: 'Economic models for recurring revenue in cloud-based enterprise software',
    category: 'pricing',
    readTime: 11,
    difficulty: 'intermediate',
    filePath: '/content/academic-articles/02-saas-pricing-models.md',
    keywords: ['pricing', 'SaaS', 'revenue', 'business model', 'economics']
  },
  {
    slug: 'audit-trails',
    title: 'Real-Time Compliance Audit Trails in Financial Systems',
    description: 'Immutable logging, hash chains, and forensic integrity for regulatory compliance',
    category: 'compliance',
    readTime: 13,
    difficulty: 'advanced',
    filePath: '/content/academic-articles/03-audit-trails.md',
    keywords: ['audit', 'compliance', 'cryptography', 'immutable', 'HMRC']
  },
  {
    slug: 'inventory-optimization',
    title: 'Inventory Management & Stock Optimization Algorithms',
    description: 'Demand forecasting, EOQ, and real-time rebalancing for retail',
    category: 'operations',
    readTime: 12,
    difficulty: 'intermediate',
    filePath: '/content/academic-articles/04-inventory-optimization.md',
    keywords: ['inventory', 'optimization', 'demand forecasting', 'EOQ', 'retail']
  }
]

// Learning paths
export const ASKBIZ_LEARNING_PATHS: AskBizLearningPath[] = [
  {
    slug: 'complete-pos-mastery',
    title: 'Complete POS System Mastery',
    description: 'Master modern Point of Sale technology from fundamentals to advanced operations',
    modules: 6,
    estimatedHours: 10,
    difficulty: 'beginner',
    filePath: '/content/learning-paths/01-complete-pos-mastery.md',
    keywords: ['POS', 'fundamentals', 'transactions', 'inventory', 'staff']
  },
  {
    slug: 'compliance-mastery',
    title: 'Compliance & Regulatory Mastery',
    description: 'Master tax compliance, GDPR, and audit trails for UK/EU/US businesses',
    modules: 6,
    estimatedHours: 10,
    difficulty: 'intermediate',
    filePath: '/content/learning-paths/02-compliance-mastery.md',
    keywords: ['compliance', 'tax', 'GDPR', 'audit', 'regulatory']
  },
  {
    slug: 'business-intelligence-mastery',
    title: 'Business Intelligence Mastery',
    description: 'Transform raw transaction data into strategic business decisions',
    modules: 6,
    estimatedHours: 10,
    difficulty: 'intermediate',
    filePath: '/content/learning-paths/03-business-intelligence-mastery.md',
    keywords: ['analytics', 'KPI', 'dashboard', 'business intelligence', 'insights']
  },
  {
    slug: 'multi-location-management',
    title: 'Multi-Location Management',
    description: 'Build systems to manage multiple stores while maintaining control and compliance',
    modules: 6,
    estimatedHours: 10,
    difficulty: 'advanced',
    filePath: '/content/learning-paths/04-multi-location-management.md',
    keywords: ['multi-location', 'scaling', 'operations', 'consolidation', 'growth']
  }
]

// Helper function to get blog post by slug
export function getBlogPostBySlug(slug: string): AskBizBlogPost | undefined {
  return ASKBIZ_BLOG_POSTS.find(post => post.slug === slug)
}

// Helper function to get article by slug
export function getArticleBySlug(slug: string): AskBizArticle | undefined {
  return ASKBIZ_ACADEMIC_ARTICLES.find(article => article.slug === slug)
}

// Helper function to get learning path by slug
export function getLearningPathBySlug(slug: string): AskBizLearningPath | undefined {
  return ASKBIZ_LEARNING_PATHS.find(path => path.slug === slug)
}

// Get all content
export function getAllAskBizContent() {
  return {
    blogs: ASKBIZ_BLOG_POSTS,
    articles: ASKBIZ_ACADEMIC_ARTICLES,
    learningPaths: ASKBIZ_LEARNING_PATHS,
  }
}
