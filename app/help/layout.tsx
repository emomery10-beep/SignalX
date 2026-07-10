// app/help/layout.tsx
import type { Metadata } from "next";
import StatusBanner from "@/components/help/StatusBanner";
import "./help.css";

const OG_IMAGE = "https://askbiz.co/api/og?title=Help%20Centre&category=AskBiz%20Documentation";

export const metadata: Metadata = {
  title: {
    default: "Help Centre | AskBiz",
    template: "%s | AskBiz Help",
  },
  description:
    "Find answers to all your AskBiz questions. Guides on connecting data sources, Business Tools, AI chat, billing, privacy, and more.",
  keywords:
    "askbiz help, business intelligence help, connect shopify askbiz, askbiz billing, askbiz api, business pulse score, small business analytics, AI business insights",
  openGraph: {
    title: "AskBiz Help Centre",
    description:
      "Find answers to all your AskBiz questions — getting started, data sources, Business Tools, billing, and more.",
    url: "https://askbiz.co/help",
    siteName: "AskBiz",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "AskBiz Help Centre — Guides, tutorials and FAQs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AskBiz Help Centre",
    description: "Find answers, guides, and FAQs for AskBiz.",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: "https://askbiz.co/help",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// Organisation + WebSite schema injected once at the help layout level
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AskBiz",
  url: "https://askbiz.co",
  logo: "https://askbiz.co/logo.svg",
  description:
    "AskBiz is a camera-first phone POS and daily business tracker for African market stalls, street vendors, and small shops — scan to sell, take mobile money, and see your profit every night.",
  sameAs: [
    "https://twitter.com/askbizco",
    "https://www.linkedin.com/company/askbiz",
    "https://www.facebook.com/share/g/17wFxNYZRH/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@askbiz.co",
    contactType: "customer support",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AskBiz Help Centre",
  url: "https://askbiz.co/help",
  description:
    "Official help documentation for AskBiz — the camera-first phone POS and daily business tracker for African market stalls, street vendors, and small shops.",
  publisher: {
    "@type": "Organization",
    name: "AskBiz",
    url: "https://askbiz.co",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://askbiz.co/help?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <StatusBanner />
      {children}
    </>
  );
}
