// app/sitemap.ts
// AskBiz sitemap — single flat file with all URLs
// Switched from sitemap index (generateSitemaps) to flat file so Google
// picks up every URL in a single fetch without needing to crawl sub-sitemaps

export const revalidate = 0 // Always regenerate — never serve stale cached sitemap

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog-content";
import { HELP_ARTICLES, HELP_TOPICS } from "@/lib/help-content";
import { POLICY_ARTICLES } from "@/lib/rules-content";
import { getAllArticles as getTransparencyArticles } from "@/lib/transparency-content";
import { academyArticles, academyCategories } from "@/lib/academy-content";
import { getAllHowTo, getAllTranslate } from "@/lib/seo-content";
import { COUNTRY_HUBS } from "@/lib/country-hub-content";
import { SECTORS } from "@/lib/pos-sectors";
import { POS_FEATURES } from "@/lib/pos-features";
import { LEARNING_PATHS } from "@/lib/learning-paths-content";

const base = "https://askbiz.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Deterministic hash → unique date spread across the past 365 days
  function hashModifiedDate(slug: string, baseDate?: string): string {
    let hash = 5381
    const str = slug + (baseDate || '')
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i)
      hash = hash & hash // Convert to 32-bit int
    }
    const daysAgo = Math.abs(hash) % 365
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    // Return a date between 1 day ago and 365 days ago
    return d.toISOString()
  }

  const { COMPARISONS } = await import("@/lib/comparisons-content");
  const { INTEGRATIONS } = await import("@/lib/integrations-content");
  const { USE_CASES } = await import("@/lib/use-cases-content");
  const { CASE_STUDIES } = await import("@/lib/case-studies-content");

  const posts = getAllPosts();

  return [
    // ── CORE: landing pages, tools, comparisons, integrations, case studies ──
    { url: base,                                                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/pricing`,                                    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/point-of-sale`,                              lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...SECTORS.map(s => ({ url: `${base}/point-of-sale/${s.id}`,  lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...POS_FEATURES.map(f => ({ url: `${base}/point-of-sale/feature/${f.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/changelog`,                                  lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/developers`,                                 lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`,                                    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`,                                      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/search`,                                     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/benchmarks`,                                 lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // SEO landing pages
    { url: `${base}/bloomberg-alternative`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-business-analytics`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/analyse-sales-data`,                         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/business-intelligence-for-small-business`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/stock-management-analytics`,                 lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/profit-margin-calculator`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Free tools
    { url: `${base}/free-tools`,                                 lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/free-tools/landed-cost-calculator`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/free-tools/fx-risk-modeller`,                lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/free-tools/vat-calculator`,                  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/free-tools/profit-margin-calculator`,        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/free-tools/cogs-calculator`,                 lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/free-tools/break-even-calculator`,           lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // Comparisons
    { url: `${base}/vs`,                                         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...COMPARISONS.map(c => ({ url: `${base}/vs/${c.slug}`,      lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    // Integrations
    { url: `${base}/integrations`,                               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...INTEGRATIONS.map(i => ({ url: `${base}/integrations/${i.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    // Use cases
    ...USE_CASES.map(u => ({ url: `${base}/for/${u.slug}`,      lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    // Case studies
    { url: `${base}/case-studies`,                               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...CASE_STUDIES.map(cs => ({ url: `${base}/case-studies/${cs.slug}`, lastModified: new Date(cs.publishDate).toISOString(), changeFrequency: "monthly" as const, priority: 0.8 })),

    // ── BLOG: all blog posts ────────────────────────────────────────────────────
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: hashModifiedDate(post.slug, post.publishDate),
      changeFrequency: "monthly" as const,
      priority: (post as { pillar?: string }).pillar === 'Operator Playbook' ? 0.8 : 0.7,
    })),

    // ── ACADEMY: categories + articles + learning paths ──────────────────────────
    { url: `${base}/academy`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/academy/learning-paths`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...LEARNING_PATHS.map(lp => ({ url: `${base}/academy/learning-paths/${lp.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/academy/learning-askbiz`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/academy/checklists`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...academyCategories.map((cat) => ({
      url: `${base}/academy/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...academyArticles.map((article) => ({
      url: `${base}/academy/${article.slug}`,
      lastModified: hashModifiedDate(article.slug),
      changeFrequency: "monthly" as const,
      priority: article.difficulty === "Beginner" ? 0.8 : 0.7,
    })),

    // ── HELP: topics + articles ──────────────────────────────────────────────────
    { url: `${base}/help`,          lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/help/faq`,      lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/help/glossary`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/glossary`,      lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...HELP_TOPICS.map((topic) => ({
      url: `${base}/help/topic/${topic.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...HELP_ARTICLES.map((article) => ({
      url: `${base}/help/${article.slug}`,
      lastModified: hashModifiedDate(article.slug, article.lastUpdated),
      changeFrequency: "monthly" as const,
      priority: article.popular ? 0.8 : 0.6,
    })),

    // ── CONTENT: how-to, translate, rules, transparency ──────────────────────────
    { url: `${base}/how-to`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/translate`,    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/rules`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/transparency`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...getAllHowTo().map((entry) => ({
      url: `${base}/how-to/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getAllTranslate().map((entry) => ({
      url: `${base}/translate/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...POLICY_ARTICLES.map((article) => ({
      url: `${base}/rules/${article.slug}`,
      lastModified: new Date(article.lastUpdated).toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getTransparencyArticles().map((article) => ({
      url: `${base}/transparency/${article.slug}`,
      lastModified: new Date(article.lastUpdated).toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // ── COUNTRIES: business intelligence country hub pages ──────────────────────
    { url: `${base}/business-intelligence`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...COUNTRY_HUBS.map((hub) => ({
      url: `${base}/business-intelligence/${hub.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
