import type { Metadata } from "next";
import ProfitMarginCalculator from "./ProfitMarginCalculator";

export const metadata: Metadata = {
  title: "Free Profit Margin Calculator — Margin, Markup & Cost Analysis | AskBiz",
  description:
    "Calculate profit margin, markup percentage, and true cost per product. Add multiple products, see ranked margins, and find hidden cost gaps. Free, no sign-up required.",
  keywords:
    "profit margin calculator free, markup calculator, gross margin calculator, profit margin formula, margin vs markup, cost of goods sold calculator, product margin calculator, ecommerce margin calculator, retail margin calculator",
  openGraph: {
    title: "Free Profit Margin Calculator — Margin, Markup & Cost Analysis",
    description:
      "Calculate your real profit margin per product. Add shipping, fees, and duties to see true margins — not simplified ones. Free, no sign-up.",
    url: "https://askbiz.co/free-tools/profit-margin-calculator",
    siteName: "AskBiz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Profit Margin Calculator | AskBiz",
    description: "Calculate real profit margin per product. Includes markup, cost breakdown, and batch analysis. Free tool.",
  },
  alternates: { canonical: "https://askbiz.co/free-tools/profit-margin-calculator" },
  robots: { index: true, follow: true },
};

export default function ProfitMarginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Profit Margin Calculator",
              description: "Free calculator for profit margin, markup percentage, and true cost per product. Supports batch analysis of multiple products with additional cost inputs for shipping, fees, and duties.",
              url: "https://askbiz.co/free-tools/profit-margin-calculator",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
              featureList: [
                "Profit margin and markup calculation",
                "Batch analysis of multiple products",
                "Additional cost inputs (shipping, fees, duties)",
                "True margin vs simplified margin comparison",
                "12 currencies supported",
                "Margin ranking and health indicators",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
                { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://askbiz.co/free-tools" },
                { "@type": "ListItem", position: 3, name: "Profit Margin Calculator", item: "https://askbiz.co/free-tools/profit-margin-calculator" },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is profit margin?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Profit margin is the percentage of revenue that remains as profit after deducting all costs. The formula is: Margin % = ((Selling Price − Total Cost) ÷ Selling Price) × 100. A 30% margin means you keep 30p of every £1 in revenue.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the difference between margin and markup?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Margin is profit as a percentage of the selling price. Markup is profit as a percentage of the cost price. A product costing £10 sold for £15 has a 33.3% margin but a 50% markup. Margin is always lower than markup for the same product.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is a good profit margin for a small business?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Good margins vary by industry: retail 5–20%, ecommerce 10–30%, SaaS 60–80%, professional services 20–50%, food & beverage 3–15%. The most important thing is knowing your margin per product, not just the average.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Why is my real margin lower than expected?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most businesses calculate margin using only the purchase price. Real margin must include shipping costs, platform fees, import duties, packaging, returns, and payment processing. These hidden costs typically reduce your true margin by 10–25 percentage points.",
                  },
                },
              ],
            },
          ]),
        }}
      />
      <ProfitMarginCalculator />
    </>
  );
}
