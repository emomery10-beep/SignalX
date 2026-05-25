import type { Metadata } from "next";
import COGSCalculator from "./COGSCalculator";

export const metadata: Metadata = {
  title: "Free Cost of Goods Sold (COGS) Calculator — Per Product & Total | AskBiz",
  description:
    "Calculate your cost of goods sold per product and in total. Add materials, labour, shipping, and overhead. See COGS ratio, gross profit, and per-unit economics. Free, no sign-up required.",
  keywords:
    "cost of goods sold calculator free, COGS calculator, cogs formula, cost of goods sold formula, how to calculate cogs, gross profit calculator, product cost calculator, manufacturing cost calculator, ecommerce cogs calculator, inventory cost calculator",
  openGraph: {
    title: "Free COGS Calculator — Cost of Goods Sold Per Product & Total",
    description:
      "Calculate your true cost of goods sold including materials, labour, shipping, and allocated overhead. Free tool for retailers, ecommerce, and manufacturers.",
    url: "https://askbiz.co/free-tools/cogs-calculator",
    siteName: "AskBiz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free COGS Calculator | AskBiz",
    description: "Calculate cost of goods sold per product. Includes labour, materials, shipping, and overhead allocation. Free tool.",
  },
  alternates: { canonical: "https://askbiz.co/free-tools/cogs-calculator" },
  robots: { index: true, follow: true },
};

export default function COGSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Cost of Goods Sold Calculator",
              description: "Free calculator for cost of goods sold (COGS) per product and in total. Includes materials, labour, shipping, packaging, and overhead allocation with gross profit analysis.",
              url: "https://askbiz.co/free-tools/cogs-calculator",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
              featureList: [
                "Per-product COGS calculation",
                "Materials, labour, shipping, and packaging inputs",
                "Overhead allocation per unit",
                "Gross profit and COGS ratio",
                "Multi-product batch analysis",
                "12 currencies supported",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
                { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://askbiz.co/free-tools" },
                { "@type": "ListItem", position: 3, name: "COGS Calculator", item: "https://askbiz.co/free-tools/cogs-calculator" },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is cost of goods sold (COGS)?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Cost of goods sold (COGS) is the total direct cost of producing or purchasing the products you sell. It includes raw materials, direct labour, shipping to your warehouse, and packaging — but not rent, marketing, or administrative costs.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do you calculate COGS?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "COGS = Materials + Direct Labour + Shipping/Freight + Packaging + any other direct costs. For retailers: COGS = Purchase Price + Inbound Shipping. For manufacturers: COGS = Raw Materials + Direct Labour + Manufacturing Overhead allocated to production.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the difference between COGS and expenses?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "COGS are costs directly tied to producing or purchasing products you sell — they scale with units. Expenses (operating costs) are indirect: rent, salaries, marketing, software. COGS is subtracted from revenue to get gross profit. Operating expenses are subtracted from gross profit to get net profit.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is a good COGS ratio?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "It varies by industry. Retail: 50–75% COGS ratio. Ecommerce: 40–60%. Manufacturing: 55–70%. SaaS: 10–30%. Food & beverage: 25–40%. A lower COGS ratio means more gross profit per unit sold.",
                  },
                },
              ],
            },
          ]),
        }}
      />
      <COGSCalculator />
    </>
  );
}
