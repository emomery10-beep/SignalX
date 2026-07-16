"use client";

import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies-content";
import { useLang } from "@/components/LanguageProvider";
import { localePath, toLocale } from "@/lib/i18n-locale";

const C = {
  bg: "#f9f8f6", sf: "#ffffff", el: "#f3f2ef",
  tx: "#1a1916", tx2: "#6b6760", tx3: "#a39e97",
  b: "rgba(0,0,0,.08)", b2: "rgba(0,0,0,.14)",
  acc: "#d08a59", accBg: "rgba(208,138,89,.08)", accBdr: "rgba(208,138,89,.25)",
};

export default function CaseStudiesClient() {
  const { lang, tc } = useLang();
  const studies = getAllCaseStudies();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.tx }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(249,248,246,.96)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.b}`, padding: "0 clamp(16px,4vw,32px)", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={localePath("/", toLocale(lang))} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.tx }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-sora)", fontSize: 13, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={localePath("/blog", toLocale(lang))} style={{ fontSize: 11, color: C.tx2, textDecoration: "none" }}>{tc("case_studies.nav_blog")}</Link>
          <Link href={localePath("/free-tools", toLocale(lang))} style={{ fontSize: 11, color: C.tx2, textDecoration: "none" }}>{tc("case_studies.nav_free_tools")}</Link>
          <Link href={localePath("/pricing", toLocale(lang))} style={{ fontSize: 11, color: C.tx2, textDecoration: "none" }}>{tc("case_studies.nav_pricing")}</Link>
          <Link href={localePath("/signin", toLocale(lang))} style={{ padding: "7px 16px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>{tc("case_studies.nav_try_free")}</Link>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(150deg, #1a1916 0%, #2d2a26 55%, #1a2030 100%)", padding: "clamp(52px,7vw,80px) clamp(16px,4vw,40px)", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(208,138,89,.18)", border: "1px solid rgba(208,138,89,.3)", color: "#e8a87a", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const, padding: "5px 14px", borderRadius: 100, marginBottom: 20 }}>
            {tc("case_studies.badge")}
          </div>
          <h1 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, color: "#fff", margin: "0 0 14px", letterSpacing: "-.025em", lineHeight: 1.15 }}>
            {tc("case_studies.heading")}
          </h1>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            {tc("case_studies.subheading")}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "clamp(40px,6vw,72px) clamp(16px,4vw,40px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {studies.map((cs) => (
            <Link
              key={cs.slug}
              href={localePath(`/case-studies/${cs.slug}`, toLocale(lang))}
              style={{ background: C.sf, border: `1.5px solid ${C.b}`, borderRadius: 14, padding: 28, textDecoration: "none", color: C.tx, transition: "box-shadow .2s, transform .2s, border-color .2s", display: "flex", flexDirection: "column", gap: 16 }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,.1)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = C.accBdr; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = C.b; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 30 }}>{cs.logo}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-sora)", fontSize: 13, fontWeight: 700, color: C.tx }}>{cs.company}</div>
                  <div style={{ fontSize: 10, color: C.tx3 }}>{cs.industry} · {cs.location}</div>
                </div>
              </div>

              <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700, color: C.tx, margin: 0, lineHeight: 1.35, letterSpacing: "-.01em" }}>
                {cs.headline}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {cs.results.slice(0, 2).map((r) => (
                  <div key={r.metric} style={{ background: C.el, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".04em", marginBottom: 2 }}>{r.metric}</div>
                    <div style={{ fontFamily: "var(--font-sora)", fontSize: 14, fontWeight: 800, color: C.acc }}>{r.improvement}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "auto", paddingTop: 8, borderTop: `1px solid ${C.b}` }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.acc }}>{tc("case_studies.read_case_study")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #1a1916 0%, #2d2a26 100%)", padding: "clamp(40px,5vw,64px) clamp(16px,4vw,40px)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
            {tc("case_studies.cta_heading")}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.72)", margin: "0 0 24px", lineHeight: 1.6 }}>
            {tc("case_studies.cta_body")}
          </p>
          <Link href={localePath("/signin", toLocale(lang))} style={{ display: "inline-flex", padding: "13px 28px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            {tc("case_studies.cta_button")}
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.b}`, background: C.sf, padding: "clamp(20px,3vw,28px) clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 10, color: C.tx3 }}>{tc("case_studies.footer_copyright")}</span>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {([["/", tc("case_studies.footer_home")], ["/blog", tc("case_studies.nav_blog")], ["/academy", tc("case_studies.footer_academy")], ["/free-tools", tc("case_studies.nav_free_tools")], ["/pricing", tc("case_studies.nav_pricing")], ["/help", tc("case_studies.footer_help")], ["/privacy", tc("case_studies.footer_privacy")], ["/terms", tc("case_studies.footer_terms")]] as [string, string][]).map(([href, label]) => (
            <a key={href} href={localePath(href, toLocale(lang))} style={{ fontSize: 10, color: C.tx3, textDecoration: "none" }}>{label}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
