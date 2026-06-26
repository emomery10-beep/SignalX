"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AcademyArticle, AcademyCategory } from "@/lib/academy-types";
import { useLang } from "@/components/LanguageProvider";

interface Props {
  articles: AcademyArticle[];
  categories: AcademyCategory[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Strip "What Is / What Are / What Does" to get the clean term for display + sorting
function getTerm(title: string): string {
  return title
    .replace(/^What (Is|Are|Does|Was|Were) (An? |The )?/i, "")
    .replace(/\?$/, "")
    .trim();
}

function getFirstLetter(title: string): string {
  return getTerm(title)[0]?.toUpperCase() ?? "#";
}

export default function GlossaryClient({ articles, categories }: Props) {
  const { tc, isRTL } = useLang();
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Sorted articles A-Z by clean term
  const sorted = useMemo(() => {
    return [...articles].sort((a, b) =>
      getTerm(a.title).localeCompare(getTerm(b.title))
    );
  }, [articles]);

  // Letters that actually have articles
  const activeLetters = useMemo(() => {
    const set = new Set(sorted.map((a) => getFirstLetter(a.title)));
    return set;
  }, [sorted]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = sorted;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          getTerm(a.title).toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    }
    if (activeLetter) {
      list = list.filter((a) => getFirstLetter(a.title) === activeLetter);
    }
    if (activeCategory) {
      list = list.filter((a) => a.categorySlug === activeCategory);
    }
    return list;
  }, [sorted, query, activeLetter, activeCategory]);

  // Group filtered list by first letter
  const grouped = useMemo(() => {
    const map: Record<string, AcademyArticle[]> = {};
    for (const article of filtered) {
      const letter = getFirstLetter(article.title);
      if (!map[letter]) map[letter] = [];
      map[letter].push(article);
    }
    return map;
  }, [filtered]);

  const groupedLetters = Object.keys(grouped).sort();
  const totalShowing = filtered.length;
  const isFiltered = !!query || !!activeLetter || !!activeCategory;

  const diffColor = (d: string) =>
    d === "Beginner" ? "#27ae60" : d === "Intermediate" ? "#e67e22" : "#e74c3c";

  return (
    <main
      style={{
        fontFamily: "DM Sans, sans-serif",
        background: "#faf9f7",
        minHeight: "100vh",
      }}
    >
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#1a1a2e",
          padding: "64px 24px 48px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#d08a59",
            fontFamily: "Sora, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          AskBiz
        </p>
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(26px, 5vw, 44px)",
            fontFamily: "Sora, sans-serif",
            fontWeight: 700,
            margin: "0 0 14px",
            lineHeight: 1.2,
          }}
        >
          {tc("glossary.title")}
        </h1>
        <p
          style={{
            color: "#b0b8c8",
            fontSize: 17,
            maxWidth: 520,
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          {tc("glossary.subtitle", { n: articles.length })}
        </p>

        {/* Search */}
        <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
          <span
            style={{
              position: "absolute",
              [isRTL ? "right" : "left"]: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 17,
              color: "#999",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder={tc("glossary.search_placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveLetter(null);
            }}
            style={{
              width: "100%",
              padding: isRTL ? "14px 46px 14px 42px" : "14px 42px 14px 46px",
              borderRadius: 10,
              border: "none",
              fontSize: 15,
              fontFamily: "DM Sans, sans-serif",
              outline: "none",
              boxSizing: "border-box",
              background: "#fff",
              color: "#1a1a2e",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                [isRTL ? "left" : "right"]: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#999",
                fontSize: 20,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          )}
        </div>
      </section>

      {/* ── A–Z Nav ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          overflowX: "auto",
        }}
      >
        <div
          dir="ltr"
          style={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => setActiveLetter(null)}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid",
              borderColor: !activeLetter ? "#d08a59" : "#e5e5e5",
              background: !activeLetter ? "#d08a59" : "transparent",
              color: !activeLetter ? "#fff" : "#999",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {tc("glossary.all")}
          </button>
          {ALPHABET.map((letter) => {
            const hasArticles = activeLetters.has(letter);
            const isActive = activeLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => {
                  if (!hasArticles) return;
                  setActiveLetter(isActive ? null : letter);
                  setQuery("");
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: isActive
                    ? "#d08a59"
                    : hasArticles
                    ? "#e5e5e5"
                    : "transparent",
                  background: isActive ? "#d08a59" : "transparent",
                  color: isActive ? "#fff" : hasArticles ? "#1a1a2e" : "#ddd",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: hasArticles ? "pointer" : "default",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </section>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 24px",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* ── Sidebar: Category Filter ─────────────────────────────────────── */}
        <aside style={{ position: "sticky", top: 72 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#aaa",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              margin: "0 0 12px",
            }}
          >
            {tc("glossary.filter_label")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                textAlign: "start",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: !activeCategory ? "#f0e8df" : "transparent",
                color: !activeCategory ? "#d08a59" : "#555",
                fontSize: 13,
                fontWeight: !activeCategory ? 700 : 400,
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <span>{tc("glossary.all_categories")}</span>
              <span style={{ color: "#aaa", fontWeight: 400 }}>
                {articles.length}
              </span>
            </button>
            {categories.map((cat) => {
              const count = articles.filter(
                (a) => a.categorySlug === cat.slug
              ).length;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() =>
                    setActiveCategory(isActive ? null : cat.slug)
                  }
                  style={{
                    textAlign: "start",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: isActive ? "#f0e8df" : "transparent",
                    color: isActive ? "#d08a59" : "#555",
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                    <span>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </span>
                  <span style={{ color: "#aaa", fontWeight: 400, flexShrink: 0 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stats box */}
          <div
            style={{
              marginTop: 28,
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#aaa",
                textTransform: "uppercase",
                letterSpacing: 1,
                margin: "0 0 10px",
                fontWeight: 700,
              }}
            >
              {tc("glossary.showing")}
            </p>
            <p
              style={{
                fontSize: 28,
                fontFamily: "Sora, sans-serif",
                fontWeight: 700,
                color: "#1a1a2e",
                margin: "0 0 2px",
              }}
            >
              {totalShowing}
            </p>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
              {tc("glossary.of_n_terms", { n: articles.length })}
            </p>
            {isFiltered && (
              <button
                onClick={() => {
                  setQuery("");
                  setActiveLetter(null);
                  setActiveCategory(null);
                }}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "8px",
                  borderRadius: 7,
                  border: "1px solid #eee",
                  background: "none",
                  color: "#d08a59",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
{tc("glossary.clear_filters")}
              </button>
            )}
          </div>
        </aside>

        {/* ── Main: Glossary Terms ─────────────────────────────────────────── */}
        <div>
          {groupedLetters.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 0",
                color: "#999",
                fontSize: 15,
              }}
            >
              {tc("glossary.no_terms", { query })}
            </div>
          ) : (
            groupedLetters.map((letter) => (
              <section
                key={letter}
                id={`letter-${letter}`}
                style={{ marginBottom: 48 }}
              >
                {/* Letter heading */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#1a1a2e",
                      color: "#d08a59",
                      fontFamily: "Sora, sans-serif",
                      fontWeight: 700,
                      fontSize: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {letter}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "#eee",
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#bbb", flexShrink: 0 }}>
                    {tc("glossary.term_count", { n: grouped[letter].length })}
                  </span>
                </div>

                {/* Term cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 12,
                  }}
                >
                  {grouped[letter].map((article) => (
                    <Link
                      key={article.slug}
                      href={`/academy/${article.slug}`}
                      style={{
                        display: "block",
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: 12,
                        padding: "16px 18px",
                        textDecoration: "none",
                        color: "#1a1a2e",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            color: "#1a1a2e",
                          }}
                        >
                          {getTerm(article.title)}
                        </span>
                        <span
                          style={{
                            color: "#d08a59",
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          {isRTL ? "←" : "→"}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#777",
                          lineHeight: 1.5,
                          margin: "0 0 10px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: diffColor(article.difficulty),
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {article.difficulty}
                        </span>
                        <span style={{ color: "#ddd", fontSize: 10 }}>·</span>
                        <span style={{ fontSize: 10, color: "#aaa" }}>
                          {article.readTime} min
                        </span>
                        <span style={{ color: "#ddd", fontSize: 10 }}>·</span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#bbb",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {article.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#1a1a2e",
          padding: "56px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontFamily: "Sora, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {tc("glossary.cta_heading")}
        </h2>
        <p
          style={{
            color: "#b0b8c8",
            fontSize: 16,
            marginBottom: 28,
            maxWidth: 440,
            margin: "0 auto 28px",
          }}
        >
          {tc("glossary.cta_body")}
        </p>
        <Link
          href="/signin"
          style={{
            display: "inline-block",
            background: "#d08a59",
            color: "#fff",
            padding: "13px 30px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {tc("glossary.cta_button")}
        </Link>
      </section>
    </main>
  );
}
