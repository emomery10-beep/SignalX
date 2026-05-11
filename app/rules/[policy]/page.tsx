// app/rules/[policy]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPolicyBySlug, getPoliciesByCategory, getCategoryBySlug, POLICY_ARTICLES } from "@/lib/rules-content";
import PolicyClient from "./PolicyClient";

export async function generateStaticParams() {
  return POLICY_ARTICLES.map((a) => ({ policy: a.slug }));
}

export async function generateMetadata({ params }: { params: { policy: string } }): Promise<Metadata> {
  const article = getPolicyBySlug(params.policy);
  if (!article) return { title: "Policy Not Found" };
  const url = `https://askbiz.co/rules/${article.slug}`;
  return {
    title: `${article.title} | AskBiz Rules & Policies`,
    description: article.description,
    keywords: article.keywords?.join(", "),
    openGraph: { title: article.title, description: article.description, url, siteName: "AskBiz", type: "article", modifiedTime: article.lastUpdated },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default function PolicyPage({ params }: { params: { policy: string } }) {
  const article = getPolicyBySlug(params.policy);
  if (!article) notFound();

  const category = getCategoryBySlug(article.categorySlug);
  const categoryPolicies = getPoliciesByCategory(article.categorySlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: article.title,
    description: article.description,
    url: `https://askbiz.co/rules/${article.slug}`,
    dateModified: article.lastUpdated,
    publisher: { "@type": "Organization", name: "AskBiz" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Rules & Policies", item: "https://askbiz.co/rules" },
        { "@type": "ListItem", position: 2, name: article.category, item: `https://askbiz.co/rules#${article.categorySlug}` },
        { "@type": "ListItem", position: 3, name: article.title },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PolicyClient article={article} category={category} categoryPolicies={categoryPolicies} />
    </>
  );
}
