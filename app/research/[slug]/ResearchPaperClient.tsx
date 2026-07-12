"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { localePath } from "@/lib/i18n-locale";
import { AUTHOR, type ResearchPaper } from "@/lib/research-papers";

const C = {
  bg: "#f2f3f5", sf: "#ffffff", el: "#e8eaed",
  tx: "#1A1410", tx2: "#4A4038", tx3: "#6b6560",
  b: "#dde0e4", b2: "#c8ccd2",
  acc: "#C97A44", accBg: "rgba(201,122,68,.08)", accBdr: "rgba(201,122,68,.28)",
};

function Avatar({ src, name, size }: { src: string; name: string; size: number }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (failed) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: C.accBg, border: `1px solid ${C.accBdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 700, color: C.acc, flexShrink: 0 }}>{initials}</div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`${name} — portrait`} width={size} height={size} onError={() => setFailed(true)}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.sf}`, boxShadow: "0 2px 10px rgba(0,0,0,.12)", flexShrink: 0 }} />
  );
}

const PdfIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
  </svg>
);

export default function ResearchPaperClient({ paper }: { paper: ResearchPaper }) {
  const { lang } = useLang();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.tx }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(242,243,245,.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.b}`, padding: "0 clamp(16px,4vw,32px)", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={localePath("/", lang)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.tx }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.acc, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>
          </div>
          <span style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <Link href={localePath("/signin", lang)} style={{ padding: "7px 16px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Try free</Link>
      </nav>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(28px,5vw,52px) clamp(16px,4vw,40px) clamp(48px,7vw,80px)" }}>
        <Link href={localePath("/research", lang)} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.tx3, textDecoration: "none", marginBottom: 26 }}>
          ← Research
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: C.acc, background: C.accBg, border: `1px solid ${C.accBdr}`, borderRadius: 9999, padding: "4px 11px" }}>{paper.type}</span>
          <span style={{ fontSize: 13, color: C.tx3 }}>{paper.date}</span>
          {paper.length && <span style={{ fontSize: 13, color: C.tx3 }}>· {paper.length}</span>}
        </div>

        <h1 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, lineHeight: 1.18, letterSpacing: "-.02em", margin: "0 0 22px" }}>
          {paper.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 11, paddingBottom: 26, marginBottom: 30, borderBottom: `1px solid ${C.b}` }}>
          <Avatar src={AUTHOR.image} name={AUTHOR.name} size={44} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.tx }}>{AUTHOR.name}</div>
            <div style={{ fontSize: 12.5, color: C.tx3 }}>{AUTHOR.role}</div>
          </div>
        </div>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.tx3, margin: "0 0 14px" }}>Abstract</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.75, color: C.tx, margin: 0 }}>{paper.abstract}</p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "var(--font-sora)", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.tx3, margin: "0 0 16px" }}>Key findings</h2>
          <ol style={{ listStyle: "none", counterReset: "kf", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {paper.keyFindings.map((f, i) => (
              <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: C.accBg, color: C.acc, border: `1px solid ${C.accBdr}`, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>{i + 1}</span>
                <p style={{ fontSize: 15.5, lineHeight: 1.7, color: C.tx2, margin: 0 }}>{f}</p>
              </li>
            ))}
          </ol>
        </section>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 30 }}>
          {paper.tags.map((t) => (
            <span key={t} style={{ fontSize: 12, color: C.tx3, background: C.el, borderRadius: 9999, padding: "4px 11px" }}>{t}</span>
          ))}
        </div>

        <div style={{ background: C.sf, border: `1px solid ${C.b}`, borderRadius: 16, padding: "clamp(20px,3vw,26px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-sora)", fontSize: 15, fontWeight: 700, color: C.tx, marginBottom: 3 }}>Read the full paper</div>
            <div style={{ fontSize: 13, color: C.tx3 }}>PDF · {paper.length} · free to download</div>
          </div>
          <a href={paper.file} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 9999, background: C.acc, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "background .15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#b06a37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.acc; }}>
            <PdfIcon /> Download PDF
          </a>
        </div>
      </article>

      <footer style={{ borderTop: `1px solid ${C.b}`, background: C.sf, padding: "clamp(20px,3vw,28px) clamp(16px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12, color: C.tx3 }}>AskBiz · Utauza © 2026</span>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {([["/research", "Research"], ["/", "Home"], ["/blog", "Blog"], ["/privacy", "Privacy"], ["/terms", "Terms"]] as [string, string][]).map(([href, label]) => (
            <a key={href} href={localePath(href, lang)} style={{ fontSize: 12, color: C.tx3, textDecoration: "none" }}>{label}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
