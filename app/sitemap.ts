import { getAllPosts } from '@/lib/blog-content'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://askbiz.co'
  const now = new Date()

    const blogPosts = getAllPosts().map(post => ({
    url: `https://askbiz.co/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...blogPosts,
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/business-intelligence-for-small-business`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/analyse-sales-data`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/stock-management-analytics`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/profit-margin-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/ai-business-analytics`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/bloomberg-alternative`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/how-to`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/translate`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    // How-to pages
    ...['calculate-profit-margin','calculate-inventory-turnover','calculate-break-even','calculate-cash-flow-forecast','calculate-reorder-point','calculate-gross-margin','calculate-average-order-value','calculate-working-capital'].map(slug => ({ url: `${base}/how-to/${slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85 })),
    // Translate pages
    ...['what-is-ebitda','what-is-working-capital','what-is-cash-flow','what-is-burn-rate','what-is-kpi','what-is-gross-profit','what-is-mrr','what-is-contribution-margin','what-is-dead-stock','what-is-churn-rate','what-is-liquidity','what-is-accounts-receivable','what-is-balance-sheet','what-is-unit-economics'].map(slug => ({ url: `${base}/translate/${slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85 })),
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    // Blog posts — 22 GEO-optimised articles
    ...['what-is-an-ai-chief-of-staff','how-to-use-ai-for-strategic-planning-2026','from-idea-to-execution-actionable-business-roadmaps','entrepreneurs-guide-data-backed-decision-making','how-ai-replacing-traditional-consulting','case-study-scale-solo-business-ai-intelligence','talk-to-spreadsheets-conversational-bi','top-5-mistakes-small-businesses-data','visualizing-growth-raw-data-executive-charts','predictive-analytics-small-business','clean-data-vs-messy-data','how-to-conduct-market-analysis-5-minutes','identifying-competitive-advantage-ai','ultimate-checklist-launching-new-product-2026','how-to-pivot-business-strategy-market-signals','ai-swot-analysis-vs-traditional','askbiz-vs-traditional-bi-tools','the-2026-ai-tech-stack-entrepreneurs','automating-boring-stuff-ai-saves-time','why-context-is-king-askbiz-business-logic','future-of-business-intelligence-2027','askbiz-faq-ai-driven-strategy'].map(slug => ({ url: `${base}/blog/${slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
