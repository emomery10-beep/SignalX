import type { Metadata } from "next";
import BenchmarksClient from "./BenchmarksClient";

export const metadata: Metadata = {
  title: "SME Industry Benchmarks 2026 — Margins, Growth & KPIs by Sector | AskBiz",
  description:
    "Free industry benchmarks for SME founders. Compare your margins, growth rate, AOV, and key KPIs against sector averages. Data from thousands of real businesses, updated quarterly.",
  keywords:
    "SME benchmarks, industry benchmarks UK, average profit margin by industry, small business KPIs, e-commerce benchmarks, retail benchmarks, food and beverage margins, average order value by industry",
  openGraph: {
    title: "SME Industry Benchmarks 2026 — Margins, Growth & KPIs by Sector",
    description: "Compare your business metrics against sector averages. Free, updated quarterly.",
    url: "https://askbiz.co/benchmarks",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/benchmarks" },
  robots: { index: true, follow: true },
};

export default function BenchmarksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Dataset",
              name: "AskBiz SME Industry Benchmarks 2026",
              description: "Anonymized, aggregated industry benchmarks for SME businesses across 8 sectors.",
              url: "https://askbiz.co/benchmarks",
              license: "https://askbiz.co/terms",
              creator: { "@type": "Organization", name: "AskBiz", url: "https://askbiz.co" },
              temporalCoverage: "2025/2026",
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
                { "@type": "ListItem", position: 2, name: "Benchmarks", item: "https://askbiz.co/benchmarks" },
              ],
            },
          ]),
        }}
      />
      <BenchmarksClient />
    </>
  );
}
