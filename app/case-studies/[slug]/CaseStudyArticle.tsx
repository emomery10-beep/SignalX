"use client";

import Link from "next/link";
import { getCaseStudy, getAllCaseStudies } from "@/lib/case-studies-content";
import { useLang } from "@/lib/i18n-catalog";
import { localePath } from "@/lib/i18n-locale";

const C = {
  bg: "#f9f8f6", sf: "#ffffff", el: "#f3f2ef",
  tx: "#1a1916", tx2: "#6b6760", tx3: "#a39e97",
  b: "rgba(0,0,0,.08)", b2: "rgba(0,0,0,.14)",
  acc: "#d08a59", accBg: "rgba(208,138,89,.08)", accBdr: "rgba(208,138,89,.25)",
};

export default function CaseStudyArticle({ slug }: { slug: string }) {
  const { lang, tc } = useLang();
  const cs = getCaseStudy(slug);
  if (!cs) return null;

  const related = getAllCaseStudies().filter((r) => r.slug !== slug).slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.tx }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(249,248,246,.96)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.b}`, padding: "0 clamp(16px,4vw,32px)", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={localePath("/", lang)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.tx }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={localePath("/case-studies", lang)} style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>{tc("case_studies.nav_all_case_studies")}</Link>
          <Link href={localePath("/pricing", lang)} style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>{tc("case_studies.nav_pricing")}</Link>
          <Link href={localePath("/signin", lang)} style={{ padding: "7px 16px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{tc("case_studies.nav_try_free")}</Link>
        </div>
      </nav>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(32px,5vw,56px) clamp(16px,4vw,40px)" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: C.tx3, marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
          <Link href={localePath("/", lang)} style={{ color: C.tx3, textDecoration: "none" }}>{tc("case_studies.breadcrumb_home")}</Link>
          <span>›</span>
          <Link href={localePath("/case-studies", lang)} style={{ color: C.tx3, textDecoration: "none" }}>{tc("case_studies.breadcrumb_case_studies")}</Link>
          <span>›</span>
          <span style={{ color: C.tx2 }}>{cs.company}</span>
        </nav>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ fontSize: 44 }}>{cs.logo}</span>
          <div>
            <div style={{ fontFamily: "var(--font-sora)", fontSize: 18, fontWeight: 700 }}>{cs.company}</div>
            <div style={{ fontSize: 13, color: C.tx3 }}>{cs.industry} · {cs.location} · {cs.employees}</div>
          </div>
        </div>

        <h1 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: C.tx, margin: "0 0 24px", lineHeight: 1.2, letterSpacing: "-.02em" }}>
          {cs.headline}
        </h1>

        {/* Results grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
          {cs.results.map((r) => (
            <div key={r.metric} style={{ background: C.sf, border: `1.5px solid ${C.b}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".04em", marginBottom: 6 }}>{r.metric}</div>
              <div style={{ fontFamily: "var(--font-sora)", fontSize: 22, fontWeight: 800, color: C.acc, marginBottom: 4 }}>{r.improvement}</div>
              <div style={{ fontSize: 12, color: C.tx3 }}>{r.before} → {r.after}</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote style={{ background: C.accBg, border: `1px solid ${C.accBdr}`, borderRadius: 12, padding: "24px 28px", margin: "0 0 36px" }}>
          <p style={{ fontSize: 16, fontStyle: "italic", color: C.tx, lineHeight: 1.65, margin: "0 0 12px" }}>
            "{cs.quote.text}"
          </p>
          <footer style={{ fontSize: 13, color: C.tx2, fontWeight: 600 }}>
            — {cs.quote.author}, {cs.quote.role}
          </footer>
        </blockquote>

        {/* Info pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
          <div style={{ background: C.el, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: C.tx2 }}>
            <strong style={{ color: C.tx }}>{tc("case_studies.timeline_label")}</strong> {cs.timeline}
          </div>
          {cs.productsUsed.map((p) => (
            <div key={p} style={{ background: C.el, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: C.tx2 }}>
              {p}
            </div>
          ))}
        </div>

        {/* Article body */}
        {cs.sections.map((s) => (
          <div key={s.heading} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 20, fontWeight: 700, color: C.tx, margin: "0 0 10px" }}>{s.heading}</h2>
            <p style={{ fontSize: 15, color: C.tx2, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #1a1916 0%, #2d2a26 100%)", borderRadius: 14, padding: "36px 32px", textAlign: "center", marginTop: 40 }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
            {tc("case_studies.article_cta_heading", { company: cs.company })}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.72)", margin: "0 0 20px", lineHeight: 1.6 }}>
            {tc("case_studies.article_cta_body")}
          </p>
          <Link href={localePath("/signin", lang)} style={{ display: "inline-flex", padding: "12px 26px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            {tc("case_studies.article_cta_button")}
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: "var(--font-sora)", fontSize: 18, fontWeight: 700, color: C.tx, margin: "0 0 20px" }}>{tc("case_studies.more_case_studies")}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={localePath(`/case-studies/${r.slug}`, lang)}
                  style={{ background: C.sf, border: `1.5px solid ${C.b}`, borderRadius: 12, padding: 20, textDecoration: "none", color: C.tx, transition: "border-color .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accBdr; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.b; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{r.logo}</span>
                    <span style={{ fontFamily: "var(--font-sora)", fontSize: 13, fontWeight: 700 }}>{r.company}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.tx, lineHeight: 1.4, marginBottom: 8 }}>{r.headline}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.acc }}>{tc("case_studies.read_short")}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <footer style={{ borderTop: `1px solid ${C.b}`, background: C.sf, padding: "clamp(20px,3vw,28px) clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12, color: C.tx3 }}>{tc("case_studies.footer_copyright")}</span>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {([["/", tc("case_studies.footer_home")], ["/case-studies", tc("case_studies.footer_case_studies")], ["/blog", tc("case_studies.nav_blog")], ["/free-tools", tc("case_studies.nav_free_tools")], ["/pricing", tc("case_studies.nav_pricing")], ["/privacy", tc("case_studies.footer_privacy")], ["/terms", tc("case_studies.footer_terms")]] as [string, string][]).map(([href, label]) => (
            <a key={href} href={localePath(href, lang)} style={{ fontSize: 12, color: C.tx3, textDecoration: "none" }}>{label}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
