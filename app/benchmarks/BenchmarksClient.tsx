"use client";

import { useState } from "react";
import Link from "next/link";
import { localePath } from "@/lib/i18n-locale";
import { useLang } from "@/components/LanguageProvider";

const C = {
  bg: "#f9f8f6", sf: "#ffffff", el: "#f3f2ef",
  tx: "#1a1916", tx2: "#6b6760", tx3: "#a39e97",
  b: "rgba(0,0,0,.08)", b2: "rgba(0,0,0,.14)",
  acc: "#d08a59", accBg: "rgba(208,138,89,.08)", accBdr: "rgba(208,138,89,.25)",
};

interface Sector {
  id: string;
  name: string;
  icon: string;
  metrics: { label: string; median: string; top25: string; bottom25: string; unit: string }[];
  insight: string;
  sampleSize: string;
}

const SECTORS: Sector[] = [
  {
    id: "ecommerce", name: "E-commerce / DTC", icon: "🛒",
    sampleSize: "1,200+ businesses",
    insight: "Top-quartile e-commerce brands have 2.4x the AOV of median performers — driven primarily by bundling and upsell strategies, not higher unit prices.",
    metrics: [
      { label: "Gross margin", median: "42%", top25: "58%", bottom25: "28%", unit: "%" },
      { label: "Net margin", median: "8%", top25: "16%", bottom25: "2%", unit: "%" },
      { label: "Average order value", median: "£34", top25: "£62", bottom25: "£18", unit: "£" },
      { label: "Customer acquisition cost", median: "£12", top25: "£6", bottom25: "£22", unit: "£" },
      { label: "Return rate", median: "14%", top25: "6%", bottom25: "24%", unit: "%" },
      { label: "YoY revenue growth", median: "18%", top25: "42%", bottom25: "4%", unit: "%" },
      { label: "Repeat purchase rate", median: "28%", top25: "48%", bottom25: "12%", unit: "%" },
      { label: "Cart abandonment rate", median: "68%", top25: "55%", bottom25: "78%", unit: "%" },
    ],
  },
  {
    id: "food-bev", name: "Food & Beverage", icon: "🍽️",
    sampleSize: "800+ businesses",
    insight: "Food waste is the largest margin killer in this sector. Top-quartile businesses waste under 4% of stock vs. 15%+ for the bottom quartile — a 10+ percentage point margin difference.",
    metrics: [
      { label: "Gross margin", median: "62%", top25: "72%", bottom25: "48%", unit: "%" },
      { label: "Net margin", median: "6%", top25: "14%", bottom25: "-2%", unit: "%" },
      { label: "Food waste rate", median: "8%", top25: "3%", bottom25: "16%", unit: "%" },
      { label: "Average transaction value", median: "£8.50", top25: "£14", bottom25: "£5.20", unit: "£" },
      { label: "Staff cost as % of revenue", median: "32%", top25: "26%", bottom25: "40%", unit: "%" },
      { label: "YoY revenue growth", median: "12%", top25: "28%", bottom25: "1%", unit: "%" },
    ],
  },
  {
    id: "retail", name: "Retail (Physical)", icon: "🏪",
    sampleSize: "650+ businesses",
    insight: "Inventory turnover is the single biggest differentiator between top and bottom performers in physical retail. Top-quartile stores turn inventory 8x/year vs. 3.5x for the bottom quartile.",
    metrics: [
      { label: "Gross margin", median: "48%", top25: "60%", bottom25: "34%", unit: "%" },
      { label: "Net margin", median: "5%", top25: "12%", bottom25: "-1%", unit: "%" },
      { label: "Inventory turnover", median: "5.2x", top25: "8.0x", bottom25: "3.5x", unit: "x/yr" },
      { label: "Revenue per sq ft (annual)", median: "£320", top25: "£560", bottom25: "£180", unit: "£" },
      { label: "Shrinkage rate", median: "1.8%", top25: "0.6%", bottom25: "3.5%", unit: "%" },
      { label: "YoY revenue growth", median: "6%", top25: "18%", bottom25: "-3%", unit: "%" },
    ],
  },
  {
    id: "import-export", name: "Import / Export", icon: "🚢",
    sampleSize: "400+ businesses",
    insight: "FX exposure is the hidden margin destroyer. Importers who actively hedge or time FX payments save 3–8% of COGS annually vs. those who convert on invoice date.",
    metrics: [
      { label: "Gross margin", median: "28%", top25: "40%", bottom25: "16%", unit: "%" },
      { label: "Net margin", median: "7%", top25: "15%", bottom25: "1%", unit: "%" },
      { label: "Landed cost accuracy", median: "Within 8%", top25: "Within 2%", bottom25: "Off by 20%+", unit: "" },
      { label: "FX loss as % of COGS", median: "4%", top25: "1%", bottom25: "9%", unit: "%" },
      { label: "Average shipment lead time", median: "32 days", top25: "21 days", bottom25: "48 days", unit: "days" },
      { label: "YoY revenue growth", median: "14%", top25: "32%", bottom25: "2%", unit: "%" },
    ],
  },
  {
    id: "saas", name: "SaaS / Software", icon: "💻",
    sampleSize: "350+ businesses",
    insight: "Net revenue retention above 110% is the strongest predictor of sustainable growth in SME SaaS — companies with NRR > 110% grow 3x faster than those below 90%.",
    metrics: [
      { label: "Gross margin", median: "75%", top25: "85%", bottom25: "62%", unit: "%" },
      { label: "Net margin", median: "4%", top25: "18%", bottom25: "-12%", unit: "%" },
      { label: "Monthly churn rate", median: "4.5%", top25: "1.8%", bottom25: "8%", unit: "%" },
      { label: "CAC payback (months)", median: "10", top25: "5", bottom25: "18+", unit: "mo" },
      { label: "Net revenue retention", median: "98%", top25: "115%", bottom25: "82%", unit: "%" },
      { label: "YoY revenue growth", median: "24%", top25: "65%", bottom25: "6%", unit: "%" },
    ],
  },
  {
    id: "services", name: "Professional Services", icon: "💼",
    sampleSize: "500+ businesses",
    insight: "Utilisation rate is the key margin driver. Top-quartile firms maintain 78%+ billable utilisation vs. 55% for the bottom quartile — worth 15+ margin points.",
    metrics: [
      { label: "Gross margin", median: "52%", top25: "68%", bottom25: "38%", unit: "%" },
      { label: "Net margin", median: "12%", top25: "24%", bottom25: "3%", unit: "%" },
      { label: "Utilisation rate", median: "65%", top25: "78%", bottom25: "55%", unit: "%" },
      { label: "Revenue per employee", median: "£68K", top25: "£105K", bottom25: "£42K", unit: "£" },
      { label: "Client retention (annual)", median: "82%", top25: "94%", bottom25: "65%", unit: "%" },
      { label: "YoY revenue growth", median: "10%", top25: "25%", bottom25: "0%", unit: "%" },
    ],
  },
  {
    id: "fashion", name: "Fashion & Apparel", icon: "👗",
    sampleSize: "450+ businesses",
    insight: "Return rates are the biggest margin gap between top and bottom performers. A 10pp reduction in returns typically translates to 4–6pp improvement in net margin.",
    metrics: [
      { label: "Gross margin", median: "55%", top25: "68%", bottom25: "40%", unit: "%" },
      { label: "Net margin", median: "5%", top25: "14%", bottom25: "-4%", unit: "%" },
      { label: "Return rate", median: "22%", top25: "10%", bottom25: "35%", unit: "%" },
      { label: "Average order value", median: "£48", top25: "£82", bottom25: "£28", unit: "£" },
      { label: "Sell-through rate", median: "62%", top25: "80%", bottom25: "42%", unit: "%" },
      { label: "YoY revenue growth", median: "15%", top25: "38%", bottom25: "-2%", unit: "%" },
    ],
  },
  {
    id: "health-beauty", name: "Health & Beauty", icon: "💄",
    sampleSize: "380+ businesses",
    insight: "Subscription models dominate the top quartile — 72% of top-performing health & beauty brands have a subscription or auto-replenishment option, driving repeat purchase rates 3x higher than one-off sellers.",
    metrics: [
      { label: "Gross margin", median: "65%", top25: "78%", bottom25: "50%", unit: "%" },
      { label: "Net margin", median: "9%", top25: "20%", bottom25: "1%", unit: "%" },
      { label: "Repeat purchase rate", median: "35%", top25: "58%", bottom25: "15%", unit: "%" },
      { label: "Average order value", median: "£28", top25: "£52", bottom25: "£16", unit: "£" },
      { label: "Customer lifetime value", median: "£85", top25: "£210", bottom25: "£32", unit: "£" },
      { label: "YoY revenue growth", median: "20%", top25: "48%", bottom25: "3%", unit: "%" },
    ],
  },
];

export default function BenchmarksClient() {
  const { lang, tc } = useLang()
  const [activeSector, setActiveSector] = useState("ecommerce");
  const sector = SECTORS.find((s) => s.id === activeSector)!;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.tx }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(249,248,246,.96)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.b}`, padding: "0 clamp(16px,4vw,32px)", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={localePath("/", lang)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.tx }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={localePath("/blog", lang)} style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>Blog</Link>
          <Link href={localePath("/case-studies", lang)} style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>Case Studies</Link>
          <Link href={localePath("/pricing", lang)} style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>Pricing</Link>
          <Link href={localePath("/signin", lang)} style={{ padding: "7px 16px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Try free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(150deg, #1a1916 0%, #2d2a26 55%, #1a2030 100%)", padding: "clamp(52px,7vw,80px) clamp(16px,4vw,40px)", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(208,138,89,.18)", border: "1px solid rgba(208,138,89,.3)", color: "#e8a87a", fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const, padding: "5px 14px", borderRadius: 100, marginBottom: 20 }}>
            Updated Q2 2026
          </div>
          <h1 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, color: "#fff", margin: "0 0 14px", letterSpacing: "-.025em", lineHeight: 1.15 }}>
            SME Industry Benchmarks
          </h1>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 17, margin: "0 0 28px", lineHeight: 1.6 }}>
            How does your business compare? Anonymized data from 4,700+ SME businesses across 8 sectors.
            Median, top 25%, and bottom 25% — so you know where you stand.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            {[["4,700+", "Businesses"], ["8", "Sectors"], ["48+", "KPIs"], ["Quarterly", "Updates"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-sora)", fontSize: 24, fontWeight: 800, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", textTransform: "uppercase" as const, letterSpacing: ".05em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sector tabs + data */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(16px,4vw,40px)" }}>
        {/* Sector pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSector(s.id)}
              style={{
                fontFamily: "'DM Sans', system-ui", fontSize: 13, fontWeight: 600,
                padding: "9px 16px", borderRadius: 9999, border: "1.5px solid",
                borderColor: activeSector === s.id ? C.acc : C.b,
                background: activeSector === s.id ? C.accBg : C.sf,
                color: activeSector === s.id ? C.acc : C.tx2,
                cursor: "pointer", transition: "all .15s",
              }}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        {/* Sector header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>
              {sector.icon} {sector.name}
            </h2>
            <div style={{ fontSize: 13, color: C.tx3 }}>Based on {sector.sampleSize} · Q2 2026</div>
          </div>
        </div>

        {/* Insight */}
        <div style={{ background: C.accBg, border: `1px solid ${C.accBdr}`, borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.acc, textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 6 }}>Key Insight</div>
          <p style={{ fontSize: 14, color: C.tx, lineHeight: 1.6, margin: 0 }}>{sector.insight}</p>
        </div>

        {/* Metrics table */}
        <div style={{ overflowX: "auto", borderRadius: 14, border: `1.5px solid ${C.b}`, background: C.sf }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>Metric</th>
                <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>Bottom 25%</th>
                <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: C.tx, textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>Median</th>
                <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>Top 25%</th>
              </tr>
            </thead>
            <tbody>
              {sector.metrics.map((m, i) => (
                <tr key={m.label} style={{ background: i % 2 === 0 ? C.sf : C.el }}>
                  <td style={{ padding: "13px 20px", fontWeight: 600, color: C.tx, borderBottom: `1px solid ${C.b}` }}>{m.label}</td>
                  <td style={{ padding: "13px 20px", textAlign: "center", color: "#dc2626", fontFamily: "var(--font-sora)", fontWeight: 700, borderBottom: `1px solid ${C.b}` }}>{m.bottom25}</td>
                  <td style={{ padding: "13px 20px", textAlign: "center", color: C.tx, fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16, borderBottom: `1px solid ${C.b}` }}>{m.median}</td>
                  <td style={{ padding: "13px 20px", textAlign: "center", color: "#16a34a", fontFamily: "var(--font-sora)", fontWeight: 700, borderBottom: `1px solid ${C.b}` }}>{m.top25}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 12, color: C.tx3, marginTop: 12, lineHeight: 1.6 }}>
          Data is anonymized and aggregated from AskBiz users who opt in to benchmark sharing. Individual business data is never disclosed.
          Benchmarks are updated quarterly. Last update: Q2 2026.
        </p>
      </section>

      {/* Cross-sector comparison */}
      <section style={{ background: C.el, padding: "clamp(40px,6vw,64px) clamp(16px,4vw,40px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 22, fontWeight: 700, color: C.tx, margin: "0 0 24px" }}>
            Cross-Sector Comparison — Median Values
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 14, border: `1.5px solid ${C.b}`, background: C.sf }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>Sector</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>Gross Margin</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>Net Margin</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".05em", borderBottom: `1.5px solid ${C.b}`, background: C.el }}>YoY Growth</th>
                </tr>
              </thead>
              <tbody>
                {SECTORS.map((s, i) => {
                  const gm = s.metrics.find((m) => m.label === "Gross margin");
                  const nm = s.metrics.find((m) => m.label === "Net margin");
                  const yoy = s.metrics.find((m) => m.label === "YoY revenue growth");
                  return (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? C.sf : C.el, cursor: "pointer" }} onClick={() => { setActiveSector(s.id); window.scrollTo({ top: 300, behavior: "smooth" }); }}>
                      <td style={{ padding: "11px 16px", fontWeight: 600, color: C.tx, borderBottom: `1px solid ${C.b}` }}>{s.icon} {s.name}</td>
                      <td style={{ padding: "11px 16px", textAlign: "center", fontFamily: "var(--font-sora)", fontWeight: 700, borderBottom: `1px solid ${C.b}` }}>{gm?.median || "—"}</td>
                      <td style={{ padding: "11px 16px", textAlign: "center", fontFamily: "var(--font-sora)", fontWeight: 700, borderBottom: `1px solid ${C.b}` }}>{nm?.median || "—"}</td>
                      <td style={{ padding: "11px 16px", textAlign: "center", fontFamily: "var(--font-sora)", fontWeight: 700, color: "#16a34a", borderBottom: `1px solid ${C.b}` }}>{yoy?.median || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1a1916 0%, #2d2a26 100%)", padding: "clamp(40px,5vw,64px) clamp(16px,4vw,40px)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
            See How You Compare — With Your Real Data
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", margin: "0 0 24px", lineHeight: 1.6 }}>
            AskBiz shows you exactly where you sit vs. these benchmarks — using your actual sales, margins, and costs. Connect your data in 2 minutes.
          </p>
          <Link href={localePath("/signin", lang)} style={{ display: "inline-flex", padding: "13px 28px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Try AskBiz Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.b}`, background: C.sf, padding: "clamp(20px,3vw,28px) clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12, color: C.tx3 }}>© 2026 AskBiz Ltd</span>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[["/", "Home"], ["/blog", "Blog"], ["/case-studies", "Case Studies"], ["/free-tools", "Free Tools"], ["/pricing", "Pricing"], ["/help", "Help"], ["/privacy", "Privacy"], ["/terms", "Terms"]].map(([path, label]) => (
            <a key={path} href={localePath(path, lang)} style={{ fontSize: 12, color: C.tx3, textDecoration: "none" }}>{label}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
