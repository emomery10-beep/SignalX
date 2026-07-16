"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AcademyArticle } from "@/lib/academy-types";
import { academyArticles } from "@/lib/academy-content";
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import { markArticleRead } from '@/lib/academy-read-tracking'
import { parseYoutubeId } from '@/lib/youtube-feed'

interface BlogCrossLink {
  slug: string;
  title: string;
  cluster: string;
  readTime: number;
}

interface Props {
  article: AcademyArticle;
  blogCrossLinks?: BlogCrossLink[];
}

export default function AcademyArticleClient({ article, blogCrossLinks = [] }: Props) {
  const { lang, tc } = useLang()

  // Reddit-style visited tracking — any real visit counts as "read", not just
  // a click from the Academy hub (covers search-engine and direct visits too).
  useEffect(() => { markArticleRead(article.slug) }, [article.slug])

  // Scroll-spy for the sidebar TOC — highlights the section currently in view,
  // matching the Help Centre article reader. Purely additive: the TOC links
  // still work as plain anchors with JS disabled.
  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => {
    const headings = article.content.map((_, i) => document.getElementById(`section-${i}`)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).id.replace('section-', ''));
          if (!Number.isNaN(idx)) setActiveSection(idx);
        }
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 }
    );
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [article.slug, article.content.length]);

  const related = academyArticles.filter((a) => article.relatedSlugs.includes(a.slug));

  const diffColor =
    article.difficulty === "Beginner"
      ? "#27ae60"
      : article.difficulty === "Intermediate"
      ? "#e67e22"
      : "#e74c3c";

  return (
    <main style={{ fontFamily: "DM Sans, system-ui", background: "#f9f8f6", minHeight: "100vh" }}>
      <style>{`
        a:focus-visible, button:focus-visible {
          outline: 2px solid #d08a59;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", fontSize: 11, color: "#6a655c" }}>
          <Link href={localePath('/', lang)} style={{ color: "#6a655c", textDecoration: "none" }}>{tc('academy.art_breadcrumb_home')}</Link>
          {" / "}
          <Link href={localePath('/academy', lang)} style={{ color: "#6a655c", textDecoration: "none" }}>{tc('academy.art_breadcrumb_academy')}</Link>
          {" / "}
          <Link href={localePath(`/academy/category/${article.categorySlug}`, lang)} style={{ color: "#6a655c", textDecoration: "none" }}>
            {article.category}
          </Link>
          {" / "}
          <span style={{ color: "#171512" }}>{article.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 48, alignItems: "start" }}>
        {/* Main Content */}
        <article>
          {/* Meta */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ background: "#f0e8df", color: "#d08a59", padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 600 }}>
              {article.category}
            </span>
            <span style={{ background: "#f0faf4", color: diffColor, padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 600 }}>
              {article.difficulty}
            </span>
            <span style={{ color: "#6a655c", fontSize: 10, padding: "4px 0" }}>
              {article.readTime} {tc('academy.art_min_read')}
            </span>
          </div>

          <h1 style={{ fontFamily: "Sora, system-ui", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "#171512", lineHeight: 1.2, margin: "0 0 16px" }}>
            {article.title}
          </h1>

          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, margin: "0 0 36px" }}>
            {article.description}
          </p>

          {/* Video embed — shown when article has a YouTube videoUrl */}
          {article.videoUrl && (
            <div style={{ marginBottom: 40, borderRadius: 14, overflow: 'hidden', border: '1px solid #eee', background: '#000', aspectRatio: '16/9', position: 'relative' }}>
              <iframe
                src={`https://www.youtube.com/embed/${parseYoutubeId(article.videoUrl)}?rel=0&modestbranding=1`}
                title={article.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          )}

          {/* Key Takeaways */}
          <div style={{ background: "#fff8f3", border: "1px solid #f0e0cc", borderRadius: 12, padding: 24, marginBottom: 40 }}>
            <h2 style={{ fontFamily: "Sora, system-ui", fontSize: 13, fontWeight: 700, color: "#d08a59", margin: "0 0 14px" }}>
              {tc('academy.art_key_takeaways')}
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {article.keyTakeaways.map((kt, i) => (
                <li key={i} style={{ fontSize: 13, color: "#333", lineHeight: 1.6, marginBottom: 8 }}>
                  {kt}
                </li>
              ))}
            </ul>
          </div>

          {/* Article Sections */}
          {article.content.map((section, i) => (
            <div key={i}>
              <div style={{ marginBottom: 36 }}>
                <h2
                  id={`section-${i}`}
                  style={{ fontFamily: "Sora, system-ui", fontSize: 18, fontWeight: 700, color: "#171512", margin: "0 0 12px" }}
                >
                  {section.heading}
                </h2>
                <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, margin: 0 }}>
                  {section.body}
                </p>
                {section.image && (
                  /* Serve the WebP twin (82% smaller than the PNG source) with a
                     PNG fallback for any browser without WebP support. Static
                     files, so this works on any host with no runtime image
                     optimizer — unlike next/image. */
                  <picture>
                    <source srcSet={section.image.replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.image}
                      alt={section.heading}
                      loading="lazy"
                      style={{ display: "block", width: "100%", maxWidth: 720, height: "auto", borderRadius: 12, margin: "20px 0 0", border: "1px solid #ececf0" }}
                    />
                  </picture>
                )}
              </div>
            </div>
          ))}

          {/* Related Articles */}
          {related.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #eee" }}>
              <h2 style={{ fontFamily: "Sora, system-ui", fontSize: 16, fontWeight: 700, color: "#171512", marginBottom: 20 }}>
                {tc('academy.art_related_articles')}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={localePath(`/academy/${rel.slug}`, lang)}
                    style={{
                      display: "block",
                      padding: "14px 16px",
                      background: "#fff",
                      borderRadius: 10,
                      border: "1px solid #eee",
                      textDecoration: "none",
                      color: "#171512",
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {rel.title}
                    <span style={{ display: "block", color: "#6a655c", fontSize: 9, marginTop: 6 }}>
                      {rel.readTime} {tc('academy.art_min_read')} · {rel.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Blog cross-links — boosts internal link graph between academy and blog */}
          {blogCrossLinks.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #eee" }}>
              <h2 style={{ fontFamily: "Sora, system-ui", fontSize: 16, fontWeight: 700, color: "#171512", marginBottom: 20 }}>
                {tc('academy.art_further_reading')}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {blogCrossLinks.map((post) => (
                  <Link
                    key={post.slug}
                    href={localePath(`/blog/${post.slug}`, lang)}
                    style={{
                      display: "block",
                      padding: "14px 16px",
                      background: "#fff",
                      borderRadius: 10,
                      border: "1px solid #eee",
                      textDecoration: "none",
                      color: "#171512",
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ display: "block", color: "#d08a59", fontSize: 9, fontWeight: 600, marginBottom: 6 }}>
                      {post.cluster}
                    </span>
                    {post.title}
                    <span style={{ display: "block", color: "#6a655c", fontSize: 9, marginTop: 6 }}>
                      {post.readTime} {tc('academy.art_min_read')}
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
            <h3 style={{ fontFamily: "Sora, system-ui", fontSize: 11, fontWeight: 700, color: "#6a655c", margin: "0 0 14px" }}>
              {tc('academy.art_toc_heading')}
            </h3>
            <nav>
              {article.content.map((section, i) => {
                const active = i === activeSection;
                return (
                  <a
                    key={i}
                    href={`#section-${i}`}
                    aria-current={active ? 'true' : undefined}
                    style={{
                      display: "block",
                      fontSize: 11,
                      color: active ? "#95592b" : "#555",
                      fontWeight: active ? 700 : 400,
                      textDecoration: "none",
                      padding: "6px 0 6px 10px",
                      borderLeft: `2px solid ${active ? "#d08a59" : "transparent"}`,
                      marginLeft: -10,
                      borderBottom: i < article.content.length - 1 ? "1px solid #f5f5f5" : "none",
                      lineHeight: 1.4,
                      transition: "color 120ms, border-color 120ms",
                    }}
                  >
                    {section.heading}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* CTA box */}
          <div style={{ background: "#171512", borderRadius: 14, padding: 24, textAlign: "center" }}>
            <p style={{ color: "#d08a59", fontFamily: "Sora, system-ui", fontSize: 10, fontWeight: 600, marginBottom: 10 }}>
              {tc('academy.art_cta_eyebrow')}
            </p>
            <p style={{ color: "#fff", fontFamily: "Sora, system-ui", fontSize: 14, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
              {tc('academy.art_cta_heading')}
            </p>
            <p style={{ color: "#b0b8c8", fontSize: 11, marginBottom: 20, lineHeight: 1.5 }}>
              {tc('academy.art_cta_body')}
            </p>
            <Link
              href={localePath('/signin', lang)}
              style={{
                display: "block",
                background: "#d08a59",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                textDecoration: "none",
                fontFamily: "Sora, system-ui",
                marginBottom: 10,
              }}
            >
              {tc('academy.art_cta_button')}
            </Link>
            <Link
              href={localePath('/pricing', lang)}
              style={{
                display: "block",
                color: "#b0b8c8",
                fontSize: 10,
                textDecoration: "none",
              }}
            >
              {tc('academy.art_cta_pricing')}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
