// app/free-tools/page.tsx — Server Component (metadata only)
import type { Metadata } from "next";
import FreeToolsClient from "./FreeToolsClient";

export const metadata: Metadata = {
  title: "Free Business Tools for Importers & Exporters | AskBiz",
  description:
    "Free landed cost calculator and FX risk modeller for UK, EU, and US importers. Calculate import duty, VAT, freight costs, and currency risk on any shipment. No sign-up required.",
  keywords:
    "free landed cost calculator, import duty calculator UK, FX risk calculator, currency risk business, import tax calculator, HS code duty rate, VAT import UK, free business tools importers",
  openGraph: {
    title: "Free Business Tools — Landed Cost & FX Risk Calculator",
    description:
      "Calculate your true landed cost and FX risk in seconds. Free tools for importers and exporters. No sign-up required.",
    url: "https://askbiz.co/free-tools",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/free-tools" },
  robots: { index: true, follow: true },
};

export default function FreeToolsPage() {
  return <FreeToolsClient />;
}
