"use client";

import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies-content";

const C = {
  bg: "#f9f8f6", sf: "#ffffff", el: "#f3f2ef",
  tx: "#1a1916", tx2: "#6b6760", tx3: "#a39e97",
  b: "rgba(0,0,0,.08)", b2: "rgba(0,0,0,.14)",
  acc: "#d08a59", accBg: "rgba(208,138,89,.08)", accBdr: "rgba(208,138,89,.25)",
};

export default function CaseStudiesClient() {
  const studies = getAllCaseStudies();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.tx }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(249,248,246,.96)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.b}`, padding: "0 clamp(16px,4vw,32px)", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.tx }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/blog" style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>Blog</Link>
          <Link href="/free-tools" style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>Free Tools</Link>
          <Link href="/pricing" style={{ fontSize: 13, color: C.tx2, textDecoration: "none" }}>Pricing</Link>
          <Link href="/signin" style={{ padding: "7px 16px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Try free →</Link>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(150deg, #1a1916 0%, #2d2a26 55%, #1a2030 100%)", padding: "clamp(52px,7vw,80px) clamp(16px,4vw,40px)", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(208,138,89,.18)", border: "1px solid rgba(208,138,89,.3)", color: "#e8a87a", fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const, padding: "5px 14px", borderRadius: 100, marginBottom: 20 }}>
            Case Studies
          </div>
          <h1 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, color: "#fff", margin: "0 0 14px", letterSpacing: "-.025em", lineHeight: 1.15 }}>
            Real Results from<br />Real Businesses
          </h1>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 17, margin: 0, lineHeight: 1.6 }}>
            See how SME founders use AskBiz to grow revenue, cut costs, and make better decisions with their data.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "clamp(40px,6vw,72px) clamp(16px,4vw,40px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {studies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              style={{ background: C.sf, border: `1.5px solid ${C.b}`, borderRadius: 14, padding: 28, textDecoration: "none", color: C.tx, transition: "box-shadow .2s, transform .2s, border-color .2s", display: "flex", flexDirection: "column", gap: 16 }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,.1)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = C.accBdr; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = C.b; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32 }}>{cs.logo}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700, color: C.tx }}>{cs.company}</div>
                  <div style={{ fontSize: 12, color: C.tx3 }}>{cs.industry} · {cs.location}</div>
                </div>
              </div>

              <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 17, fontWeight: 700, color: C.tx, margin: 0, lineHeight: 1.35, letterSpacing: "-.01em" }}>
                {cs.headline}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {cs.results.slice(0, 2).map((r) => (
                  <div key={r.metric} style={{ background: C.el, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: C.tx3, textTransform: "uppercase" as const, letterSpacing: ".04em", marginBottom: 2 }}>{r.metric}</div>
                    <div style={{ fontFamily: "var(--font-sora)", fontSize: 16, fontWeight: 800, color: C.acc }}>{r.improvement}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "auto", paddingTop: 8, borderTop: `1px solid ${C.b}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.acc }}>Read case study →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #1a1916 0%, #2d2a26 100%)", padding: "clamp(40px,5vw,64px) clamp(16px,4vw,40px)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
            Ready to Write Your Own Success Story?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.72)", margin: "0 0 24px", lineHeight: 1.6 }}>
            Join thousands of SME founders who use AskBiz to make data-driven decisions. Free to start.
          </p>
          <Link href="/signin" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Try AskBiz Free →
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.b}`, background: C.sf, padding: "clamp(20px,3vw,28px) clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12, color: C.tx3 }}>© 2026 AskBiz Ltd</span>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[["/", "Home"], ["/blog", "Blog"], ["/academy", "Academy"], ["/free-tools", "Free Tools"], ["/pricing", "Pricing"], ["/help", "Help"], ["/privacy", "Privacy"], ["/terms", "Terms"]].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 12, color: C.tx3, textDecoration: "none" }}>{label}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
