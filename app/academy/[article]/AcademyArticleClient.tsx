"use client";

import Link from "next/link";
import { AcademyArticle } from "@/lib/academy-types";
import { academyArticles } from "@/lib/academy-content";

interface Props {
  article: AcademyArticle;
}

export default function AcademyArticleClient({ article }: Props) {
  const related = academyArticles.filter((a) => article.relatedSlugs.includes(a.slug));

  const diffColor =
    article.difficulty === "Beginner"
      ? "#27ae60"
      : article.difficulty === "Intermediate"
      ? "#e67e22"
      : "#e74c3c";

  return (
    <main style={{ fontFamily: "DM Sans, sans-serif", background: "#faf9f7", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", fontSize: 13, color: "#999" }}>
          <Link href="/" style={{ color: "#999", textDecoration: "none" }}>Home</Link>
          {" / "}
          <Link href="/academy" style={{ color: "#999", textDecoration: "none" }}>Academy</Link>
          {" / "}
          <Link href={`/academy/category/${article.categorySlug}`} style={{ color: "#999", textDecoration: "none" }}>
            {article.category}
          </Link>
          {" / "}
          <span style={{ color: "#1a1a2e" }}>{article.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 48, alignItems: "start" }}>
        {/* Main Content */}
        <article>
          {/* Meta */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ background: "#f0e8df", color: "#d08a59", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              {article.category}
            </span>
            <span style={{ background: "#f0faf4", color: diffColor, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              {article.difficulty}
            </span>
            <span style={{ color: "#999", fontSize: 12, padding: "4px 0" }}>
              {article.readTime} min read
            </span>
          </div>

          <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2, margin: "0 0 16px" }}>
            {article.title}
          </h1>

          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.7, margin: "0 0 36px", borderLeft: "3px solid #d08a59", paddingLeft: 16 }}>
            {article.description}
          </p>

          {/* Key Takeaways */}
          <div style={{ background: "#fff8f3", border: "1px solid #f0e0cc", borderRadius: 12, padding: 24, marginBottom: 40 }}>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, color: "#d08a59", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 }}>
              Key Takeaways
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {article.keyTakeaways.map((kt, i) => (
                <li key={i} style={{ fontSize: 15, color: "#333", lineHeight: 1.6, marginBottom: 8 }}>
                  {kt}
                </li>
              ))}
            </ul>
          </div>

          {/* Article Sections */}
          {article.content.map((section, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2
                id={`section-${i}`}
                style={{ fontFamily: "Sora, sans-serif", fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: "0 0 12px" }}
              >
                {section.heading}
              </h2>
              <p style={{ fontSize: 16, color: "#444", lineHeight: 1.8, margin: 0 }}>
                {section.body}
              </p>
            </div>
          ))}

          {/* Related Articles */}
          {related.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #eee" }}>
              <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 20 }}>
                Related Articles
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/academy/${rel.slug}`}
                    style={{
                      display: "block",
                      padding: "14px 16px",
                      background: "#fff",
                      borderRadius: 10,
                      border: "1px solid #eee",
                      textDecoration: "none",
                      color: "#1a1a2e",
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {rel.title}
                    <span style={{ display: "block", color: "#999", fontSize: 11, marginTop: 6 }}>
                      {rel.readTime} min · {rel.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar TOC */}
        <aside style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 13, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 14px" }}>
              Contents
            </h3>
            <nav>
              {article.content.map((section, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  style={{
                    display: "block",
                    fontSize: 13,
                    color: "#555",
                    textDecoration: "none",
                    padding: "6px 0",
                    borderBottom: i < article.content.length - 1 ? "1px solid #f5f5f5" : "none",
                    lineHeight: 1.4,
                  }}
                >
                  {section.heading}
                </a>
              ))}
            </nav>
          </div>

          {/* CTA box */}
          <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 24, textAlign: "center" }}>
            <p style={{ color: "#d08a59", fontFamily: "Sora, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
              AskBiz
            </p>
            <p style={{ color: "#fff", fontFamily: "Sora, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
              See these metrics for your business
            </p>
            <p style={{ color: "#b0b8c8", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
              AskBiz connects to your data and surfaces insights like these automatically.
            </p>
            <Link
              href="/signup"
              style={{
                display: "block",
                background: "#d08a59",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Start Free Trial
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
