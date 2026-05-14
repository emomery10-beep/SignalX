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
