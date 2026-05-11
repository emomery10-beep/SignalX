// app/transparency/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparency Centre | AskBiz",
  description: "How AskBiz's AI works — model, methodology, accuracy metrics, open data, error reporting, and EU AI Act compliance. Full transparency on every aspect of our AI business intelligence platform.",
  keywords: "askbiz transparency, ai transparency, business intelligence ai accuracy, how askbiz works, eu ai act article 13, ai methodology",
  openGraph: {
    title: "AskBiz Transparency Centre",
    description: "Full transparency on how AskBiz AI works, our accuracy rates, methodology, and regulatory compliance.",
    url: "https://askbiz.co/transparency",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/transparency" },
  robots: { index: true, follow: true },
};

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
