'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { academyCategories, academyArticles } from '@/lib/academy-content'
import type { AcademyArticle } from '@/lib/academy-types'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

const PAGE_SIZE = 20

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms', display: 'block' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const DIFF_COLORS: Record<string, string> = {
  Beginner:     '#27ae60',
  Intermediate: '#e8734a',
  Advanced:     '#e74c3c',
}

function ArticleRow({ article, index, total }: { article: AcademyArticle; index: number; total: number }) {
  const color = academyCategories.find(c => c.slug === article.categorySlug)?.color || ACC
  return (
    <Link
      href={`/academy/${article.slug}`}
      className="ac-row"
      style={{
        textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 16, alignItems: 'center', padding: '14px 12px', borderRadius: 10,
        background: 'transparent',
        borderBottom: index < total - 1 ? `1px solid ${BD}` : 'none',
      }}
    >
      <div>
        <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          {article.category}
        </span>
        <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 600, color: TX, lineHeight: 1.4, marginTop: 3, marginBottom: 3 }}>
          {article.title}
        </div>
        <p style={{ fontSize: 12, color: TX2, lineHeight: 1.5, margin: 0 }}>
          {(article.description || '').slice(0, 120)}{(article.description || '').length > 120 ? '…' : ''}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: TX3, whiteSpace: 'nowrap' }}>{article.readTime} min</div>
      </div>
    </Link>
  )
}

export default function AcademyClient() {
  const searchRef = useRef<HTMLInputElement>(null)

  const [activeCategory,    setActiveCategory]    = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [search,             setSearch]             = useState('')
  const [searchFocused,      setSearchFocused]      = useState(false)
  const [visibleCount,       setVisibleCount]       = useState(PAGE_SIZE)
  const [sidebarOpen,        setSidebarOpen]        = useState(false)

  const searchResults = useMemo(() => {
    if (search.trim().length <= 1) return []
    const q = search.toLowerCase()
    return academyArticles
      .filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.keywords || []).some(k => k?.toLowerCase().includes(q))
      )
      .map(a => {
        let score = 0
        if (a.title.toLowerCase().includes(q))                         score += 10
        if (a.category.toLowerCase().includes(q))                      score += 6
        if ((a.description || '').toLowerCase().includes(q))           score += 4
        if ((a.keywords || []).some(k => k?.toLowerCase().includes(q))) score += 3
        if (a.difficulty === 'Beginner')                               score += 1
        return { ...a, score }
      })
      .sort((a, b) => b.score - a.score)
  }, [search])

  const currentCategory  = academyCategories.find(c => c.slug === activeCategory)
  const categoryArticles = activeCategory ? academyArticles.filter(a => a.categorySlug === activeCategory) : []

  const isHome      = !activeCategory && !search.trim()
  const isSearch    = search.trim().length > 1
  const displayList = isSearch ? searchResults : categoryArticles
  const visibleRows = displayList.slice(0, visibleCount)
  const hasMore     = displayList.length > visibleCount

  function toggleExpand(slug: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  function selectCategory(slug: string) {
    if (activeCategory === slug) {
      setActiveCategory(null)
    } else {
      setActiveCategory(slug)
      setSearch('')
      setVisibleCount(PAGE_SIZE)
      if (!expandedCategories.has(slug))
        setExpandedCategories(prev => new Set([...prev, slug]))
    }
    setSidebarOpen(false)
  }

  function goHome() {
    setActiveCategory(null)
    setSearch('')
    setVisibleCount(PAGE_SIZE)
    setSidebarOpen(false)
  }

  // Featured articles for home state (first Beginner article per top category)
  const featuredArticles = useMemo(() => {
    return academyArticles.filter(a => a.difficulty === 'Beginner').slice(0, 8)
  }, [])

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .ac-row        { transition: background 120ms; }
        .ac-row:hover  { background: ${SF} !important; }
        .ac-sb-btn       { cursor: pointer; border: none; background: transparent; transition: background 120ms; font-family: DM Sans, system-ui; }
        .ac-sb-btn:hover { background: rgba(0,0,0,0.045) !important; }
        .ac-card       { cursor: pointer; transition: transform 140ms, box-shadow 140ms; }
        .ac-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09) !important; }
        .ac-art-link   { display: block; padding: 5px 8px; border-radius: 6px; font-size: 12px; color: ${TX2}; text-decoration: none; line-height: 1.45; transition: background 100ms, color 100ms; }
        .ac-art-link:hover { background: rgba(0,0,0,0.04); color: ${TX}; }
        .ac-crumb      { background: none; border: none; cursor: pointer; padding: 0; font-family: DM Sans, system-ui; }
        .ac-crumb:hover { text-decoration: underline; }
        .ac-more       { cursor: pointer; transition: background 120ms; }
        .ac-more:hover { background: rgba(208,138,89,.12) !important; }
        .ac-search     { outline: none; }
        .ac-search:focus { border-color: ${ACC} !important; box-shadow: 0 0 0 3px rgba(208,138,89,.12); }
        .ac-mob-tog    { display: none; cursor: pointer; border: none; background: none; align-items: center; }
        .ac-sb-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 39; }
        @media (max-width: 860px) {
          .ac-sb-wrap  { display: none; position: fixed; top: 54px; left: 0; bottom: 0; width: 280px; z-index: 40; background: ${SF}; box-shadow: 4px 0 24px rgba(0,0,0,.12); overflow-y: auto; }
          .ac-sb-wrap.open  { display: block; }
          .ac-sb-overlay.open { display: block; }
          .ac-mob-tog  { display: flex !important; }
          .ac-main     { padding: 24px 16px !important; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        borderBottom: `1px solid ${BD}`, background: SF,
        padding: '0 clamp(16px,4vw,24px)', height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="ac-mob-tog" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle categories">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX2} strokeWidth="2" strokeLinecap="round">
              {sidebarOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <rect x="3"  y="22" width="5" height="7"  rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9"  width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
          </Link>
        </div>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>
          Try free →
        </Link>
      </nav>

      {/* Mobile overlay */}
      <div className={`ac-sb-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* ── Two-pane layout ── */}
      <div style={{ display: 'flex', height: 'calc(100vh - 54px)', overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <div className={`ac-sb-wrap${sidebarOpen ? ' open' : ''}`} style={{ width: 244, flexShrink: 0, overflowY: 'auto', borderRight: `1px solid ${BD}`, background: SF, padding: '20px 0 32px' }}>

          {/* All categories */}
          <div style={{ padding: '0 12px', marginBottom: 4 }}>
            <button
              className="ac-sb-btn"
              onClick={goHome}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '8px 12px', borderRadius: 8,
                background: isHome ? 'rgba(208,138,89,.12)' : 'transparent',
                color: isHome ? ACC : TX2,
                fontSize: 13, fontWeight: isHome ? 600 : 400,
              }}
            >
              <span>All categories</span>
              <span style={{ fontSize: 11, color: TX3 }}>{academyArticles.length}</span>
            </button>
          </div>

          {/* Learn AskBiz shortcut */}
          <div style={{ padding: '4px 12px 8px' }}>
            <Link
              href="/academy/learning-askbiz"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 8,
                background: '#f0ebff', border: '1px solid #c4a8f540',
                textDecoration: 'none', color: '#6c3fc5',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>🎓</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>Learn AskBiz</div>
                <div style={{ fontSize: 10, color: '#9575cd', lineHeight: 1.3 }}>70 step-by-step tutorials</div>
              </div>
            </Link>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '10px 24px 6px' }}>
            Browse categories
          </div>

          {academyCategories.map(cat => {
            const isActive = activeCategory === cat.slug
            const isExp    = expandedCategories.has(cat.slug)
            const color    = cat.color || ACC
            const count    = academyArticles.filter(a => a.categorySlug === cat.slug).length

            return (
              <div key={cat.slug} style={{ padding: '0 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, background: isActive ? `${color}14` : 'transparent', marginBottom: 1 }}>
                  <button
                    className="ac-sb-btn"
                    onClick={() => selectCategory(cat.slug)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 6px 7px 10px', borderRadius: '8px 0 0 8px',
                      color: isActive ? color : TX2,
                      fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: 'left',
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ lineHeight: 1.35, flex: 1 }}>{cat.title}</span>
                    <span style={{ fontSize: 10, color: isActive ? color : TX3, flexShrink: 0 }}>{count}</span>
                  </button>
                  <button
                    className="ac-sb-btn"
                    onClick={() => toggleExpand(cat.slug)}
                    aria-label={isExp ? 'Collapse' : 'Expand'}
                    style={{ padding: '7px 10px', borderRadius: '0 8px 8px 0', color: isActive ? color : TX3, display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronIcon expanded={isExp} />
                  </button>
                </div>

                {isExp && (
                  <div style={{ paddingLeft: 26, paddingBottom: 4 }}>
                    {academyArticles.filter(a => a.categorySlug === cat.slug).map(article => (
                      <Link key={article.slug} href={`/academy/${article.slug}`} className="ac-art-link" onClick={() => setSidebarOpen(false)}>
                        {article.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Extra links */}
          <div style={{ padding: '0 12px', marginTop: 12 }}>
            <div style={{ height: 1, background: BD, margin: '8px 0 12px' }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '4px 10px 6px' }}>Tools</div>
            {([['🗺️ Learning Paths', '/academy/learning-paths'], ['✅ Checklists', '/academy/checklists']] as [string,string][]).map(([label, href]) => (
              <Link key={href} href={href} className="ac-sb-btn" style={{ display: 'block', padding: '6px 10px', fontSize: 13, color: TX2, textDecoration: 'none', borderRadius: 6 }}>
                {label}
              </Link>
            ))}
            <div style={{ height: 1, background: BD, margin: '8px 0 8px' }} />
            {([['Help Centre', '/help'], ['Blog', '/blog'], ['Free Tools', '/free-tools']] as [string,string][]).map(([label, href]) => (
              <Link key={href} href={href} className="ac-sb-btn" style={{ display: 'block', padding: '6px 10px', fontSize: 13, color: TX2, textDecoration: 'none', borderRadius: 6 }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <main className="ac-main" style={{ flex: 1, overflowY: 'auto', padding: 'clamp(28px,4vw,48px) clamp(24px,4vw,48px)' }}>

          {/* Search bar + heading */}
          <div style={{ marginBottom: isHome ? 36 : 28 }}>
            {isHome && (
              <div style={{ marginBottom: 18 }}>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, letterSpacing: '-.025em', color: TX, marginBottom: 6 }}>
                  Academy
                </h1>
                <p style={{ fontSize: 14, color: TX2, margin: 0 }}>
                  {academyArticles.length}+ free guides covering every metric, concept, and tool that matters for SME founders — {academyCategories.length} categories
                </p>
              </div>
            )}
            <div style={{ position: 'relative', maxWidth: isHome ? 580 : 480 }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                className="ac-search"
                type="text"
                placeholder="Search articles — try 'gross margin', 'churn', 'Incoterms'…"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory(null); setVisibleCount(PAGE_SIZE) }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 38px 11px 44px', fontSize: 14, color: TX, background: SF, border: `1.5px solid ${BD}`, borderRadius: 10, transition: 'border-color 150ms, box-shadow 150ms' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TX3, fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
              )}
            </div>
          </div>

          {/* ── Home state ── */}
          {isHome && (
            <>
              {/* Learning Paths + Checklists promo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 36 }}>
                <Link href="/academy/learning-paths" style={{ textDecoration: 'none', background: '#fff8f3', border: `1px solid ${ACC}30`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 140ms' }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>🗺️</span>
                  <div>
                    <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 3 }}>Learning Paths</div>
                    <div style={{ fontSize: 12, color: TX2 }}>8 curated sequences — follow a structured track from beginner to advanced</div>
                  </div>
                </Link>
                <Link href="/academy/checklists" style={{ textDecoration: 'none', background: '#f3faf6', border: '1px solid #a3e4b830', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 140ms' }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>✅</span>
                  <div>
                    <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 3 }}>Checklists</div>
                    <div style={{ fontSize: 12, color: TX2 }}>Interactive checklists for month-end close, fundraising, product launches, and more</div>
                  </div>
                </Link>
              </div>

              {/* Category cards — top 5 featured, rest compact */}
              <section style={{ marginBottom: 52 }}>
                <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 20, letterSpacing: '-.015em' }}>Browse categories</h2>
                {/* Featured top 5 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
                  {academyCategories.slice(0, 5).map(cat => {
                    const color = cat.color || ACC
                    const count = academyArticles.filter(a => a.categorySlug === cat.slug).length
                    return (
                      <div
                        key={cat.slug}
                        className="ac-card"
                        onClick={() => selectCategory(cat.slug)}
                        style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '20px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                      >
                        <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 5, lineHeight: 1.3 }}>{cat.title}</div>
                        <p style={{ fontSize: 12, color: TX2, margin: '0 0 10px', lineHeight: 1.55 }}>
                          {cat.description.slice(0, 72)}{cat.description.length > 72 ? '…' : ''}
                        </p>
                        <span style={{ fontSize: 11, color, fontWeight: 600 }}>{count} articles →</span>
                      </div>
                    )
                  })}
                </div>
                {/* Remaining as compact inline buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {academyCategories.slice(5).map(cat => {
                    const color = cat.color || ACC
                    const count = academyArticles.filter(a => a.categorySlug === cat.slug).length
                    return (
                      <button
                        key={cat.slug}
                        className="ac-sb-btn"
                        onClick={() => selectCategory(cat.slug)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BD}`, background: SF, fontSize: 13, color: TX, fontWeight: 500 }}
                      >
                        {cat.title}
                        <span style={{ fontSize: 11, color: TX3 }}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Featured beginner articles */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, letterSpacing: '-.015em', margin: 0 }}>Start here</h2>
                  <span style={{ fontSize: 12, color: TX3 }}>{academyArticles.length} total</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {featuredArticles.map((a, i) => (
                    <ArticleRow key={a.slug} article={a} index={i} total={featuredArticles.length} />
                  ))}
                </div>
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <button
                    className="ac-sb-btn"
                    onClick={() => { setActiveCategory(null); setSearch(''); setVisibleCount(PAGE_SIZE) }}
                    style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Browse all {academyArticles.length} articles →
                  </button>
                </div>
              </section>
            </>
          )}

          {/* ── Category / search state ── */}
          {!isHome && (
            <>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22, fontSize: 13, color: TX2, flexWrap: 'wrap' }}>
                <button className="ac-crumb" onClick={goHome} style={{ color: ACC, fontSize: 13, fontWeight: 500 }}>All categories</button>
                {activeCategory && currentCategory && (
                  <><span style={{ color: TX3 }}>/</span><button className="ac-crumb" style={{ color: TX, fontWeight: 600, fontSize: 13 }}>{currentCategory.title}</button></>
                )}
                {isSearch && !activeCategory && (
                  <><span style={{ color: TX3 }}>/</span><span style={{ color: TX, fontWeight: 600 }}>"{search}"</span></>
                )}
              </div>

              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 700, letterSpacing: '-.025em', color: TX, marginBottom: 4 }}>
                  {isSearch ? `Results for "${search}"` : currentCategory?.title}
                </h1>
                <p style={{ fontSize: 13, color: TX2, margin: 0 }}>
                  {displayList.length} article{displayList.length !== 1 ? 's' : ''}
                  {activeCategory && currentCategory && !isSearch && ` · ${currentCategory.description}`}
                </p>
              </div>

              {/* No results */}
              {displayList.length === 0 && (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: TX2, marginBottom: 16 }}>No articles found{isSearch ? ` for "${search}"` : ''}.</div>
                  <button onClick={goHome} style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 600 }}>
                    Back to all categories
                  </button>
                </div>
              )}

              {/* Article list */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {visibleRows.map((a, i) => (
                  <ArticleRow key={a.slug} article={a} index={i} total={visibleRows.length} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                  <button
                    className="ac-more"
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '9px 24px', fontWeight: 600, display: 'inline-block' }}
                  >
                    Load {Math.min(PAGE_SIZE, displayList.length - visibleCount)} more articles
                  </button>
                  <div style={{ fontSize: 11, color: TX3, marginTop: 8 }}>
                    Showing {visibleRows.length} of {displayList.length}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer inside main so it scrolls with content */}
          <footer style={{ borderTop: `1px solid ${BD}`, marginTop: 64, padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz. AI-powered business intelligence for SMEs.</span>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              {([['/', 'Home'], ['/blog', 'Blog'], ['/help', 'Help'], ['/academy', 'Academy'], ['/rules', 'Rules'], ['/privacy', 'Privacy']] as [string,string][]).map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
