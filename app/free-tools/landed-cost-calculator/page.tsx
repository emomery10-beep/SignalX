// app/free-tools/landed-cost-calculator/page.tsx
import type { Metadata } from "next";
import LandedCostCalculator from "./LandedCostCalculator";

export const metadata: Metadata = {
  title: "Free Landed Cost Calculator — Import Duty, VAT & Freight | AskBiz",
  description:
    "Calculate the true landed cost of any imported product. Import duty rates for 25+ countries, UK/EU/US VAT, freight cost estimation, and full per-unit breakdown. Free, no sign-up required.",
  keywords:
    "landed cost calculator free, import duty calculator UK, import VAT calculator, HS code duty rate, true cost importing, freight cost calculator, landed cost formula, import tax UK, CIF calculator",
  openGraph: {
    title: "Free Landed Cost Calculator — Import Duty, VAT & Freight",
    description:
      "Calculate your true landed cost including import duty, VAT, freight, insurance, and FX. Free tool for importers. No sign-up.",
    url: "https://askbiz.co/free-tools/landed-cost-calculator",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/free-tools/landed-cost-calculator" },
  robots: { index: true, follow: true },
};

export default function LandedCostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Landed Cost Calculator",
              description: "Free calculator for the true landed cost of imported goods, including import duty, VAT, freight, insurance, and FX conversion.",
              url: "https://askbiz.co/free-tools/landed-cost-calculator",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
              featureList: [
                "Import duty rates for 25+ countries",
                "28 HS code product categories",
                "Sea, air, and road freight options",
                "VAT/GST calculation by destination",
                "FX conversion to home currency",
                "True per-unit cost breakdown",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How do I calculate landed cost?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Landed cost = Supplier price + Freight + Insurance + Import duty + VAT/GST + Customs clearance fees. Use the CIF value (Cost + Insurance + Freight) as the basis for calculating duty and VAT.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the import duty rate for clothing from China to the UK?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Cotton T-shirts (HS code 6109.10) imported from China to the UK attract a 12% import duty rate under the UK Global Tariff. UK VAT (20%) is then applied on the CIF value plus duty.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I have to pay VAT on imports?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes — import VAT is charged on goods entering the UK (20%) and EU (typically 19–22% depending on country). VAT-registered businesses can reclaim import VAT through their VAT return, making the effective cost zero. Non-VAT-registered businesses cannot reclaim it.",
                  },
                },
              ],
            },
          ]),
        }}
      />
      <LandedCostCalculator />
    </>
  );
}
