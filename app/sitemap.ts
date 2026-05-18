// app/sitemap.ts
// AskBiz complete sitemap — covers all public routes
// Automatically includes all help articles, rules policies, transparency articles, and academy articles
// Updated: 420+ academy articles across 15 categories

export const revalidate = 0 // Always regenerate — never serve stale cached sitemap

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog-content";
import { HELP_ARTICLES, HELP_TOPICS } from "@/lib/help-content";

import { POLICY_ARTICLES } from "@/lib/rules-content";
import { getAllArticles as getTransparencyArticles } from "@/lib/transparency-content";
import { academyArticles, academyCategories } from "@/lib/academy-content";
import { getAllHowTo, getAllTranslate } from "@/lib/seo-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://askbiz.co";
  const now = new Date().toISOString();

  // ── Core pages ──────────────────────────────────────────────────────────────
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: base,                        lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/blog`,              lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/help`,              lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/help/faq`,          lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/help/glossary`,     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/rules`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/transparency`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`,             lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/developers`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/glossary`,                                   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/how-to`,                                     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/translate`,                                  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/bloomberg-alternative`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-business-analytics`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/analyse-sales-data`,                         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/business-intelligence-for-small-business`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/stock-management-analytics`,                 lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/profit-margin-calculator`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/changelog`,                                  lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/point-of-sale`,                              lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];

  // ── Help Center ─────────────────────────────────────────────────────────────
  const helpTopicRoutes: MetadataRoute.Sitemap = HELP_TOPICS.map((topic) => ({
    url: `${base}/help/topic/${topic.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const helpArticleRoutes: MetadataRoute.Sitemap = HELP_ARTICLES.map((article) => ({
    url: `${base}/help/${article.slug}`,
    lastModified: new Date(article.lastUpdated).toISOString(),
    changeFrequency: "monthly" as const,
    priority: article.popular ? 0.8 : 0.6,
  }));

  // ── How-To pages ────────────────────────────────────────────────────────────
  const howToRoutes: MetadataRoute.Sitemap = getAllHowTo().map((entry) => ({
    url: `${base}/how-to/${entry.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Translate pages ──────────────────────────────────────────────────────────
  const translateRoutes: MetadataRoute.Sitemap = getAllTranslate().map((entry) => ({
    url: `${base}/translate/${entry.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Rules & Policies ────────────────────────────────────────────────────────
  // Fragment URLs (#slug) are excluded — Google ignores hash anchors; individual article pages cover this content.
  const rulesArticleRoutes: MetadataRoute.Sitemap = POLICY_ARTICLES.map((article) => ({
    url: `${base}/rules/${article.slug}`,
    lastModified: new Date(article.lastUpdated).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Transparency Centre ──────────────────────────────────────────────────────
  // Fragment URLs (#slug) excluded — individual article pages cover this content.
  const transparencyArticleRoutes: MetadataRoute.Sitemap = getTransparencyArticles().map((article) => ({
    url: `${base}/transparency/${article.slug}`,
    lastModified: new Date(article.lastUpdated).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Free Tools ──────────────────────────────────────────────────────────────
  const freeToolRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/free-tools`,                              lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/free-tools/landed-cost-calculator`,       lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/free-tools/fx-risk-modeller`,             lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/free-tools/vat-calculator`,               lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/free-tools/break-even-calculator`,        lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
  ];

  // ── Blog posts ──────────────────────────────────────────────────────────────
  const blogPostRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Academy ─────────────────────────────────────────────────────────────────
  const academyIndexRoute: MetadataRoute.Sitemap = [
    { url: `${base}/academy`,                        lastModified: now, changeFrequency: "weekly" as const,  priority: 0.9 },
    { url: `${base}/academy/learning-paths`,         lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/academy/checklists`,             lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  // 15 category hub pages — proper crawlable URLs (no query strings)
  const academyCategoryRoutes: MetadataRoute.Sitemap = academyCategories.map((cat) => ({
    url: `${base}/academy/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 420+ individual article pages — Beginner articles get slightly higher priority
  const academyArticleRoutes: MetadataRoute.Sitemap = academyArticles.map((article) => ({
    url: `${base}/academy/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: article.difficulty === "Beginner" ? 0.8 : 0.7,
  }));

  // ── Comparison pages ────────────────────────────────────────────────────────
  const { COMPARISONS } = await import("@/lib/comparisons-content");
  const vsIndexRoute:    MetadataRoute.Sitemap = [{ url: `${base}/vs`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }];
  const vsRoutes:        MetadataRoute.Sitemap = COMPARISONS.map(c => ({ url: `${base}/vs/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));

  // ── Integrations ────────────────────────────────────────────────────────────
  const { INTEGRATIONS } = await import("@/lib/integrations-content");
  const integrationsIndexRoute: MetadataRoute.Sitemap = [{ url: `${base}/integrations`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 }];
  const integrationRoutes:      MetadataRoute.Sitemap = INTEGRATIONS.map(i => ({ url: `${base}/integrations/${i.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));

  // ── Use-case / For pages ─────────────────────────────────────────────────────
  const { USE_CASES } = await import("@/lib/use-cases-content");
  const forRoutes: MetadataRoute.Sitemap = USE_CASES.map(u => ({ url: `${base}/for/${u.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));

  // ── Case Studies ─────────────────────────────────────────────────────────────
  const { CASE_STUDIES } = await import("@/lib/case-studies-content");
  const caseStudyIndexRoute: MetadataRoute.Sitemap = [{ url: `${base}/case-studies`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 }];
  const caseStudyRoutes: MetadataRoute.Sitemap = CASE_STUDIES.map(cs => ({ url: `${base}/case-studies/${cs.slug}`, lastModified: new Date(cs.publishDate).toISOString(), changeFrequency: "monthly" as const, priority: 0.8 }));

  // ── Benchmarks ──────────────────────────────────────────────────────────────
  const benchmarksRoute: MetadataRoute.Sitemap = [
    { url: `${base}/benchmarks`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
  ];

  // ── Pricing & Search ─────────────────────────────────────────────────────────
  const pricingAndSearchRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/search`,  lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  // ── Combined ────────────────────────────────────────────────────────────────
  return [
    ...coreRoutes,
    ...blogPostRoutes,
    ...howToRoutes,
    ...translateRoutes,
    ...freeToolRoutes,
    ...academyIndexRoute,
    ...academyCategoryRoutes,
    ...academyArticleRoutes,
    ...helpTopicRoutes,
    ...helpArticleRoutes,
    ...rulesArticleRoutes,
    ...transparencyArticleRoutes,
    ...vsIndexRoute,
    ...vsRoutes,
    ...integrationsIndexRoute,
    ...integrationRoutes,
    ...forRoutes,
    ...caseStudyIndexRoute,
    ...caseStudyRoutes,
    ...benchmarksRoute,
    ...pricingAndSearchRoutes,
  ];
}
