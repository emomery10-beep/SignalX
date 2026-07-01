// app/free-tools/page.tsx — Server Component (metadata only)
import type { Metadata } from "next";
import FreeToolsClient from "./FreeToolsClient";

export const metadata: Metadata = {
  title: "Free Business Calculators — Profit Margin, Landed Cost & More | AskBiz",
  description:
    "Free profit margin, break-even, landed cost, VAT, and FX risk calculators for small business owners. Works in KES, NGN, GBP and more. No sign-up required.",
  keywords:
    "free profit margin calculator, break-even calculator, landed cost calculator, FX risk calculator, business calculator Africa, Kenya business tools, Nigeria small business calculator, import duty calculator, VAT calculator, free business tools",
  openGraph: {
    title: "Free Business Calculators — Profit, Landed Cost & More",
    description:
      "Free profit margin, break-even, landed cost, VAT, and FX risk calculators. Works in KES, NGN, GBP and more. No sign-up, no account needed.",
    url: "https://askbiz.co/free-tools",
    siteName: "AskBiz",
    type: "website",
    images: [{ url: "https://askbiz.co/og-image.png", width: 1200, height: 630, alt: "AskBiz Free Business Calculators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Business Calculators — Profit, Landed Cost & More",
    description: "Free profit margin, break-even, landed cost, and VAT calculators. Works in KES, NGN, GBP and more. No sign-up needed.",
    images: ["https://askbiz.co/og-image.png"],
  },
  alternates: {
    canonical: "https://askbiz.co/free-tools",
    languages: {
      'x-default': 'https://askbiz.co/free-tools',
      'en': 'https://askbiz.co/free-tools',
      'en-KE': 'https://askbiz.co/free-tools',
      'en-NG': 'https://askbiz.co/free-tools',
      'en-UG': 'https://askbiz.co/free-tools',
      'en-GB': 'https://askbiz.co/free-tools',
      'en-US': 'https://askbiz.co/free-tools',
    },
  },
  robots: { index: true, follow: true },
};

const FREE_TOOLS_BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://askbiz.co' },
    { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://askbiz.co/free-tools' },
  ],
}

export default function FreeToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FREE_TOOLS_BREADCRUMB_LD) }} />
      <FreeToolsClient />
    </>
  );
}
