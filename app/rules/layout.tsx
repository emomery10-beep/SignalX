// app/rules/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules & Policies | AskBiz",
  description:
    "AskBiz's complete rules and policies. Acceptable use, intellectual property, AI policies, platform integrity, enforcement, law enforcement guidelines, and regulatory compliance (GDPR, EU AI Act, CCPA, UK OSA).",
  keywords:
    "askbiz rules, askbiz policies, acceptable use policy, gdpr compliance, eu ai act, ccpa, uk online safety act, askbiz terms",
  openGraph: {
    title: "AskBiz Rules & Policies",
    description:
      "Acceptable use, IP, AI policies, enforcement, law enforcement guidelines, and full regulatory compliance across UK, EU, and US.",
    url: "https://askbiz.co/rules",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/rules" },
  robots: { index: true, follow: true },
};

export default function RulesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
