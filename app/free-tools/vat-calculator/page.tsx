import type { Metadata } from "next";
import VatCalculator from "./VatCalculator";

export const metadata: Metadata = {
  title: "Free VAT Calculator — Add or Remove VAT for 30 Countries | AskBiz",
  description:
    "Calculate VAT, GST, or sales tax instantly for 30 countries. Add VAT to a net price or extract VAT from a gross price. Standard, reduced, and zero rates. Free, no sign-up.",
  keywords:
    "VAT calculator free, add VAT, remove VAT, extract VAT, sales tax calculator, GST calculator, UK VAT calculator, EU VAT rates, VAT inclusive to exclusive, reverse VAT calculation",
  openGraph: {
    title: "Free VAT Calculator — Add or Remove VAT for 30 Countries",
    description:
      "Calculate VAT, GST, or sales tax for 30 countries. Add or extract VAT instantly. Free, no sign-up.",
    url: "https://askbiz.co/free-tools/vat-calculator",
    siteName: "AskBiz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free VAT Calculator — 30 Countries | AskBiz",
    description: "Add or remove VAT for 30 countries. Standard, reduced, and zero rates. Free tool.",
  },
  alternates: { canonical: "https://askbiz.co/free-tools/vat-calculator" },
  robots: { index: true, follow: true },
};

export default function VatCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VAT Calculator",
              url: "https://askbiz.co/free-tools/vat-calculator",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
              description: "Calculate VAT, GST, or sales tax for 30 countries. Add or extract VAT from any amount.",
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
                { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://askbiz.co/free-tools" },
                { "@type": "ListItem", position: 3, name: "VAT Calculator", item: "https://askbiz.co/free-tools/vat-calculator" },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How do I calculate VAT on a net price?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Multiply the net price by the VAT rate as a decimal. For UK standard rate: net price × 0.20 = VAT amount. Add the VAT to the net price to get the gross (VAT-inclusive) price.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I remove VAT from a gross price?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Divide the gross price by (1 + VAT rate as decimal). For UK 20% VAT: gross ÷ 1.20 = net price. The difference is the VAT amount.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the UK VAT rate in 2026?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The UK standard VAT rate is 20%. The reduced rate is 5% (applied to home energy, child car seats, etc.). Some goods like most food and children's clothing are zero-rated (0%).",
                  },
                },
              ],
            },
          ]),
        }}
      />
      <VatCalculator />
    </>
  );
}
