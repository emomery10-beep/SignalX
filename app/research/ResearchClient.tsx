"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { localePath } from "@/lib/i18n-locale";
import { RESEARCH_PAPERS } from "@/lib/research-papers";

// Homepage tokens ("Founder's Terminal" — cool shell, single amber accent).
const C = {
  bg: "#f2f3f5", sf: "#ffffff", el: "#e8eaed",
  tx: "#1A1410", tx2: "#4A4038", tx3: "#6b6560",
  b: "#dde0e4", b2: "#c8ccd2",
  acc: "#C97A44", accBg: "rgba(201,122,68,.08)", accBdr: "rgba(201,122,68,.28)",
};

const CREDENTIALS = [
  "BSc Computer Science",
  "MA Applied Linguistics",
  "15+ years — East Africa & Middle East",
  "Founder, AskBiz",
];

function Avatar({ src, name, size }: { src: string; name: string; size: number }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (failed) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: C.accBg, border: `1px solid ${C.accBdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 700, color: C.acc, flexShrink: 0 }}>
        {initials}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`${name} — portrait`} width={size} height={size} onError={() => setFailed(true)}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.sf}`, boxShadow: "0 4px 18px rgba(0,0,0,.14)", flexShrink: 0 }} />
  );
}

export default function ResearchClient() {
  const { lang } = useLang();
  const navLink = { fontSize: 13, color: C.tx2, textDecoration: "none" } as const;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.tx }}>
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(242,243,245,.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.b}`, padding: "0 clamp(16px,4vw,32px)", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={localePath("/", lang)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.tx }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>
          </div>
          <span style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href={localePath("/blog", lang)} style={navLink}>Blog</Link>
            <Link href={localePath("/academy", lang)} style={navLink}>Academy</Link>
            <Link href={localePath("/pricing", lang)} style={navLink}>Pricing</Link>
          </span>
          <Link href={localePath("/signin", lang)} style={{ padding: "7px 16px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Try free</Link>
        </div>
      </nav>

      {/* ── Author header ───────────────────────────────────────────────── */}
      <header style={{ maxWidth: 940, margin: "0 auto", padding: "clamp(40px,6vw,72px) clamp(16px,4vw,40px) clamp(28px,4vw,40px)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.acc, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 20 }}>
          Research &amp; Writing
        </div>
        <div className="author-row" style={{ display: "flex", alignItems: "center", gap: "clamp(20px,4vw,36px)" }}>
          <Avatar src="/images/founder.jpg" name="Idarus Ali" size={128} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.1, margin: "0 0 12px" }}>
              Idarus Ali
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CREDENTIALS.map((c) => (
                <span key={c} style={{ fontSize: 12.5, fontWeight: 500, color: C.tx2, background: C.sf, border: `1px solid ${C.b}`, borderRadius: 9999, padding: "5px 13px" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 660, marginTop: "clamp(24px,3vw,32px)", display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: C.tx, margin: 0 }}>
            Idarus has spent more than fifteen years working across East Africa and the Middle East. Not from an office, but next to the people who actually run the economy: the market traders, the shopkeepers, the street vendors, the small businesses that keep families going.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.tx2, margin: 0 }}>
            That closeness changed how he sees the problem. Most of these owners can&rsquo;t afford the software and the accountants that bigger companies take for granted, and for a long time nobody bothered to build anything for them. Idarus never accepted that. Being short of money should not mean being left behind, and the tools that help a business survive should reach the woman selling vegetables just as easily as the company with a finance team.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.tx2, margin: 0 }}>
            That is why he founded AskBiz. A business tool that runs from a cheap phone, in the owner&rsquo;s own language, so anyone can see what they made today and know what to do tomorrow. No expensive hardware. No accountant. Just answers a trader can actually use.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.tx2, margin: 0 }}>
            Idarus holds a BSc in Computer Science and an MA in Applied Linguistics. One taught him how systems work. The other taught him how people really talk, and how easily they get left out. The research here comes from that same world, and it is written about the people too often missing from it.
          </p>
        </div>
      </header>

      {/* ── Papers ──────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 940, margin: "0 auto", padding: "0 clamp(16px,4vw,40px) clamp(48px,7vw,88px)" }}>
        <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700, letterSpacing: ".02em", color: C.tx3, textTransform: "uppercase", borderTop: `1px solid ${C.b}`, paddingTop: 28, margin: "0 0 24px" }}>
          Papers
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {RESEARCH_PAPERS.map((p) => (
            <Link
              key={p.slug}
              href={localePath(`/research/${p.slug}`, lang)}
              style={{ display: "block", background: C.sf, border: `1px solid ${C.b}`, borderRadius: 16, padding: "clamp(20px,3vw,30px)", textDecoration: "none", color: C.tx, transition: "box-shadow .2s ease, border-color .2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,.09)"; e.currentTarget.style.borderColor = C.accBdr; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.b; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: C.acc, background: C.accBg, border: `1px solid ${C.accBdr}`, borderRadius: 9999, padding: "4px 11px" }}>{p.type}</span>
                <span style={{ fontSize: 13, color: C.tx3 }}>{p.date}</span>
                {p.length && <span style={{ fontSize: 13, color: C.tx3 }}>· {p.length}</span>}
              </div>

              <h3 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(18px,2.2vw,22px)", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-.015em", color: C.tx, margin: "0 0 12px" }}>
                {p.title}
              </h3>

              <p style={{ fontSize: 15, lineHeight: 1.7, color: C.tx2, margin: "0 0 18px", maxWidth: 680 }}>
                {p.summary}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ fontSize: 12, color: C.tx3, background: C.el, borderRadius: 9999, padding: "4px 11px" }}>{t}</span>
                ))}
              </div>

              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: C.acc }}>
                Read paper <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.b}`, background: C.sf, padding: "clamp(20px,3vw,28px) clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12, color: C.tx3 }}>AskBiz · Utauza © 2026</span>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {([["/", "Home"], ["/blog", "Blog"], ["/academy", "Academy"], ["/help", "Help"], ["/privacy", "Privacy"], ["/terms", "Terms"]] as [string, string][]).map(([href, label]) => (
            <a key={href} href={localePath(href, lang)} style={{ fontSize: 12, color: C.tx3, textDecoration: "none" }}>{label}</a>
          ))}
        </nav>
      </footer>

      <style>{`
        @media (max-width: 560px) {
          .author-row { flex-direction: column; align-items: flex-start; text-align: left; }
          .nav-desktop-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}
