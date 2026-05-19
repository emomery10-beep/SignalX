import type { Metadata } from "next";
import BreakEvenCalculator from "./BreakEvenCalculator";

export const metadata: Metadata = {
  title: "Free Break-Even Calculator — Units, Revenue & Profit Scenarios | AskBiz",
  description:
    "Calculate your break-even point in units and revenue. Enter fixed costs, selling price, and variable cost — see contribution margin, profit scenarios, and price sensitivity. Free, no sign-up.",
  keywords:
    "break even calculator free, break even analysis, break even point calculator, contribution margin calculator, fixed costs variable costs, how many units to break even, profit calculator, business planning calculator",
  openGraph: {
    title: "Free Break-Even Calculator — Units, Revenue & Profit Scenarios",
    description:
      "Find your break-even point instantly. See profit scenarios and price sensitivity analysis. Free, no sign-up.",
    url: "https://askbiz.co/free-tools/break-even-calculator",
    siteName: "AskBiz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Break-Even Calculator | AskBiz",
    description: "Calculate break-even in units and revenue. See profit scenarios at different volumes. Free tool.",
  },
  alternates: { canonical: "https://askbiz.co/free-tools/break-even-calculator" },
  robots: { index: true, follow: true },
};

export default function BreakEvenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Break-Even Calculator",
              url: "https://askbiz.co/free-tools/break-even-calculator",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
              description: "Calculate your break-even point in units and revenue. Includes profit scenarios and price sensitivity analysis.",
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
                { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://askbiz.co/free-tools" },
                { "@type": "ListItem", position: 3, name: "Break-Even Calculator", item: "https://askbiz.co/free-tools/break-even-calculator" },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is a break-even point?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The break-even point is the number of units you need to sell so that your total revenue equals your total costs. At this point your profit is zero — sell one more unit and you start making a profit.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do you calculate break-even units?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Break-even units = Fixed Costs ÷ (Selling Price per Unit − Variable Cost per Unit). The denominator is called the contribution margin per unit.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is contribution margin?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Contribution margin is the selling price minus the variable cost per unit. It represents how much each unit sold contributes toward covering fixed costs and generating profit.",
                  },
                },
              ],
            },
          ]),
        }}
      />
      <BreakEvenCalculator />
    </>
  );
}
