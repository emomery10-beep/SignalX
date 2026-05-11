import type { Metadata } from "next";
import FXRiskModeller from "./FXRiskModeller";

export const metadata: Metadata = {
  title: "Free FX Risk Modeller — Currency Risk Calculator for Importers | AskBiz",
  description: "Model how exchange rate movements affect your profit margins. See your break-even exchange rate and margin impact across mild, moderate, and severe depreciation scenarios. Free, no sign-up required.",
  keywords: "fx risk calculator free, currency risk importer, exchange rate margin impact, break even exchange rate, GBP USD margin calculator, currency depreciation business impact, hedging calculator importer",
  openGraph: {
    title: "Free FX Risk Modeller — Currency Risk for Importers",
    description: "See how exchange rate changes affect your margins. Break-even rates, scenario modelling, and rebalancing suggestions. Free.",
    url: "https://askbiz.co/free-tools/fx-risk-modeller",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/free-tools/fx-risk-modeller" },
  robots: { index: true, follow: true },
};

export default function FXRiskPage() {
  return <FXRiskModeller />;
}
