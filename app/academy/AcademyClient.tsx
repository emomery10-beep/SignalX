'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import { academyCategories, academyArticles } from '@/lib/academy-content'
import type { AcademyArticle } from '@/lib/academy-types'
import { getReadArticles } from '@/lib/academy-read-tracking'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#171512'
const TX2 = '#5c574f'
const TX3 = '#6a655c' // darkened from #a39e97 (2.5:1) to meet WCAG AA 4.5:1
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

function ArticleRow({ article, index, total, isRead }: { article: AcademyArticle; index: number; total: number; isRead: boolean }) {
  const { lang, tc } = useLang()
  const color = academyCategories.find(c => c.slug === article.categorySlug)?.color || ACC
  return (
    <Link
      href={localePath(`/academy/${article.slug}`, lang)}
      className="ac-row"
      style={{
        textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 16, alignItems: 'center', padding: '14px 12px', borderRadius: 10,
        background: 'transparent',
        borderBottom: index < total - 1 ? `1px solid ${BD}` : 'none',
      }}
    >
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          {article.category}
        </span>
        {/* Reddit-style visited dimming — read articles recede so a scanned
            list shows what's new vs. already seen. */}
        <div style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 15, fontWeight: 600, color: isRead ? TX3 : TX, lineHeight: 1.4, marginTop: 3, marginBottom: 3 }}>
          {article.title}
          {isRead && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 500, color: TX3 }}>✓ read</span>}
        </div>
        <p style={{ fontSize: 12, color: TX2, lineHeight: 1.5, margin: 0 }}>
          {(article.description || '').slice(0, 120)}{(article.description || '').length > 120 ? '…' : ''}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: TX3, whiteSpace: 'nowrap' }}>{article.readTime} {tc('academy.read_time_min')}</div>
      </div>
    </Link>
  )
}

export default function AcademyClient() {
  const { lang, tc } = useLang()
  const searchRef = useRef<HTMLInputElement>(null)

  const [activeCategory,    setActiveCategory]    = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [search,             setSearch]             = useState('')
  const [searchFocused,      setSearchFocused]      = useState(false)
  const [visibleCount,       setVisibleCount]       = useState(PAGE_SIZE)
  const [sidebarOpen,        setSidebarOpen]        = useState(false)
  const [readSlugs,          setReadSlugs]          = useState<Set<string>>(new Set())
  const [difficultyFilter,   setDifficultyFilter]   = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All')
  const [hideRead,           setHideRead]           = useState(false)
  const [sortBy,             setSortBy]             = useState<'default' | 'quickest'>('default')

  useEffect(() => { setReadSlugs(getReadArticles()) }, [])

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
  const baseList    = isSearch ? searchResults : categoryArticles

  // Reddit-style flair filter + hide-read + read-time sort. All three run on
  // real data fields (difficulty, the localStorage read set, readTime) — no
  // fabricated "newest/popular" ordering.
  const displayList = useMemo(() => {
    let list = baseList
    if (difficultyFilter !== 'All') list = list.filter(a => a.difficulty === difficultyFilter)
    if (hideRead)                   list = list.filter(a => !readSlugs.has(a.slug))
    if (sortBy === 'quickest')      list = [...list].sort((a, b) => a.readTime - b.readTime)
    return list
  }, [baseList, difficultyFilter, hideRead, sortBy, readSlugs])

  const visibleRows = displayList.slice(0, visibleCount)
  const hasMore     = displayList.length > visibleCount

  function toggleExpand(slug: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  function resetFilters() {
    setDifficultyFilter('All')
    setHideRead(false)
    setSortBy('default')
  }

  function selectCategory(slug: string) {
    if (activeCategory === slug) {
      setActiveCategory(null)
    } else {
      setActiveCategory(slug)
      setSearch('')
      setVisibleCount(PAGE_SIZE)
      resetFilters()
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
    <div style={{ fontFamily: 'var(--font-dm), system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .ac-row        { transition: background 120ms; }
        .ac-row:hover  { background: ${SF} !important; }
        .ac-sb-btn       { cursor: pointer; border: none; background: transparent; transition: background 120ms; font-family: var(--font-dm), system-ui; }
        .ac-sb-btn:hover { background: rgba(0,0,0,0.045) !important; }
        .ac-card       { cursor: pointer; transition: transform 140ms, box-shadow 140ms; }
        .ac-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09) !important; }
        .ac-art-link   { display: block; padding: 5px 8px; border-radius: 6px; font-size: 12px; color: ${TX2}; text-decoration: none; line-height: 1.45; transition: background 100ms, color 100ms; }
        .ac-art-link:hover { background: rgba(0,0,0,0.04); color: ${TX}; }
        .ac-crumb      { background: none; border: none; cursor: pointer; padding: 0; font-family: var(--font-dm), system-ui; }
        .ac-crumb:hover { text-decoration: underline; }
        .ac-more       { cursor: pointer; transition: background 120ms; }
        .ac-more:hover { background: rgba(208,138,89,.12) !important; }
        .ac-search     { outline: none; }
        .ac-search:focus { border-color: ${ACC} !important; box-shadow: 0 0 0 3px rgba(208,138,89,.12); }
        a:focus-visible, button:focus-visible {
          outline: 2px solid ${ACC};
          outline-offset: 2px;
          border-radius: 4px;
        }
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
          <button className="ac-mob-tog" onClick={() => setSidebarOpen(o => !o)} aria-label={tc('academy.aria_toggle_categories')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX2} strokeWidth="2" strokeLinecap="round">
              {sidebarOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
          <Link href={localePath('/', lang)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 13, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
          </Link>
        </div>
        <Link href={localePath('/signin', lang)} style={{ fontSize: 11, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>
          {tc('academy.try_free')}
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
                fontSize: 11, fontWeight: isHome ? 600 : 400,
              }}
            >
              <span>{tc('academy.all_categories')}</span>
              <span style={{ fontSize: 9, color: TX3 }}>{academyArticles.length}</span>
            </button>
          </div>

          {/* Learn AskBiz shortcut */}
          <div style={{ padding: '4px 12px 8px' }}>
            <Link
              href={localePath('/academy/learning-askbiz', lang)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 8,
                background: '#f0ebff', border: '1px solid #c4a8f540',
                textDecoration: 'none', color: '#6c3fc5',
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>🎓</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>{tc('academy.learn_askbiz')}</div>
                <div style={{ fontSize: 9, color: '#9575cd', lineHeight: 1.3 }}>{tc('academy.learn_askbiz_tutorials')}</div>
              </div>
            </Link>
          </div>

          <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '10px 24px 6px' }}>
            {tc('academy.browse_categories')}
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
                      fontSize: 11, fontWeight: isActive ? 600 : 400, textAlign: 'left',
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ lineHeight: 1.35, flex: 1 }}>{cat.title}</span>
                    <span style={{ fontSize: 9, color: isActive ? color : TX3, flexShrink: 0 }}>{count}</span>
                  </button>
                  <button
                    className="ac-sb-btn"
                    onClick={() => toggleExpand(cat.slug)}
                    aria-label={isExp ? tc('academy.aria_collapse') : tc('academy.aria_expand')}
                    style={{ padding: '16px 16px 16px 10px', margin: '-8px -8px -8px 0', borderRadius: '0 8px 8px 0', color: isActive ? color : TX3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronIcon expanded={isExp} />
                  </button>
                </div>

                {isExp && (
                  <div style={{ paddingLeft: 26, paddingBottom: 4 }}>
                    {academyArticles.filter(a => a.categorySlug === cat.slug).map(article => (
                      <Link key={article.slug} href={localePath(`/academy/${article.slug}`, lang)} className="ac-art-link" onClick={() => setSidebarOpen(false)}>
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
            <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '4px 10px 6px' }}>{tc('academy.tools')}</div>
            {([[tc('academy.tool_learning_paths'), '/academy/learning-paths'], [tc('academy.tool_checklists'), '/academy/checklists'], ['Video Library', '/academy/videos']] as [string,string][]).map(([label, href]) => (
              <Link key={href} href={localePath(href, lang)} className="ac-sb-btn" style={{ display: 'block', padding: '6px 10px', fontSize: 11, color: TX2, textDecoration: 'none', borderRadius: 6 }}>
                {label}
              </Link>
            ))}
            <div style={{ height: 1, background: BD, margin: '8px 0 8px' }} />
            {([[tc('academy.link_help_centre'), '/help'], [tc('academy.link_blog'), '/blog'], [tc('academy.link_free_tools'), '/free-tools']] as [string,string][]).map(([label, href]) => (
              <Link key={href} href={localePath(href, lang)} className="ac-sb-btn" style={{ display: 'block', padding: '6px 10px', fontSize: 11, color: TX2, textDecoration: 'none', borderRadius: 6 }}>
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
                <h1 style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 'clamp(26px,3vw,34px)', fontWeight: 700, letterSpacing: '-.025em', color: TX, marginBottom: 6 }}>
                  {tc('academy.page_title')}
                </h1>
                <p style={{ fontSize: 14, color: TX2, margin: 0 }}>
                  {academyArticles.length}{tc('academy.intro_suffix')} {academyCategories.length} {tc('academy.intro_categories_suffix')}
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
                placeholder={tc('academy.search_placeholder')}
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory(null); setVisibleCount(PAGE_SIZE) }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 38px 11px 44px', fontSize: 12, color: TX, background: SF, border: `1.5px solid ${BD}`, borderRadius: 10, transition: 'border-color 150ms, box-shadow 150ms' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TX3, fontSize: 16, lineHeight: 1, padding: '0 2px' }}>×</button>
              )}
            </div>
          </div>

          {/* ── Home state ── */}
          {isHome && (
            <>
              {/* Learning Paths + Checklists promo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 36 }}>
                <Link href={localePath('/academy/learning-paths', lang)} style={{ textDecoration: 'none', background: '#fff8f3', border: `1px solid ${ACC}30`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 140ms' }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>🗺️</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 3 }}>{tc('academy.promo_learning_paths_title')}</div>
                    <div style={{ fontSize: 10, color: TX2 }}>{tc('academy.promo_learning_paths_desc')}</div>
                  </div>
                </Link>
                <Link href={localePath('/academy/checklists', lang)} style={{ textDecoration: 'none', background: '#f3faf6', border: '1px solid #a3e4b830', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 140ms' }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>✅</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 3 }}>{tc('academy.promo_checklists_title')}</div>
                    <div style={{ fontSize: 10, color: TX2 }}>{tc('academy.promo_checklists_desc')}</div>
                  </div>
                </Link>
              </div>

              {/* Category cards — top 5 featured, rest compact */}
              <section style={{ marginBottom: 52 }}>
                <h2 style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 20, letterSpacing: '-.015em' }}>{tc('academy.browse_categories_heading')}</h2>
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
                        <div style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 5, lineHeight: 1.3 }}>{cat.title}</div>
                        <p style={{ fontSize: 12, color: TX2, margin: '0 0 10px', lineHeight: 1.55 }}>
                          {cat.description.slice(0, 72)}{cat.description.length > 72 ? '…' : ''}
                        </p>
                        <span style={{ fontSize: 10, color, fontWeight: 600 }}>{count} {tc('academy.articles_arrow_suffix')}</span>
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
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${BD}`, background: SF, fontSize: 11, color: TX, fontWeight: 500 }}
                      >
                        {cat.title}
                        <span style={{ fontSize: 9, color: TX3 }}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Featured beginner articles */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 18, fontWeight: 700, color: TX, letterSpacing: '-.015em', margin: 0 }}>{tc('academy.start_here')}</h2>
                  <span style={{ fontSize: 10, color: TX3 }}>{academyArticles.length} {tc('academy.total_suffix')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {featuredArticles.map((a, i) => (
                    <ArticleRow key={a.slug} article={a} index={i} total={featuredArticles.length} isRead={readSlugs.has(a.slug)} />
                  ))}
                </div>
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <button
                    className="ac-sb-btn"
                    onClick={() => { setActiveCategory(null); setSearch(''); setVisibleCount(PAGE_SIZE) }}
                    style={{ fontSize: 11, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {tc('academy.browse_all_prefix')} {academyArticles.length} {tc('academy.browse_all_suffix')}
                  </button>
                </div>
              </section>
            </>
          )}

          {/* ── Category / search state ── */}
          {!isHome && (
            <>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22, fontSize: 11, color: TX2, flexWrap: 'wrap' }}>
                <button className="ac-crumb" onClick={goHome} style={{ color: ACC, fontSize: 11, fontWeight: 500 }}>{tc('academy.all_categories')}</button>
                {activeCategory && currentCategory && (
                  <><span style={{ color: TX3 }}>/</span><span style={{ color: TX, fontWeight: 600, fontSize: 11 }}>{currentCategory.title}</span></>
                )}
                {isSearch && !activeCategory && (
                  <><span style={{ color: TX3 }}>/</span><span style={{ color: TX, fontWeight: 600 }}>“{search}”</span></>
                )}
              </div>

              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, letterSpacing: '-.025em', color: TX, marginBottom: 4 }}>
                  {isSearch ? tc('academy.results_for_prefix') + ' “' + search + '”' : currentCategory?.title}
                </h1>
                <p style={{ fontSize: 13, color: TX2, margin: 0 }}>
                  {displayList.length} {displayList.length !== 1 ? tc('academy.article_plural') : tc('academy.article_singular')}
                  {activeCategory && currentCategory && !isSearch && ' · ' + currentCategory.description}
                </p>
              </div>

              {/* Filter bar — Reddit-style flair chips + hide-read + sort, all
                  on real data (difficulty, read set, readTime). Shown whenever
                  there's a list to narrow. */}
              {baseList.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('academy.filter_label')}</span>
                  {([
                    ['All',          tc('academy.filter_all')],
                    ['Beginner',     tc('academy.filter_beginner')],
                    ['Intermediate', tc('academy.filter_intermediate')],
                    ['Advanced',     tc('academy.filter_advanced')],
                  ] as const).map(([level, label]) => {
                    const on = difficultyFilter === level
                    const c  = level === 'All' ? ACC : (DIFF_COLORS[level] || ACC)
                    return (
                      <button
                        key={level}
                        onClick={() => { setDifficultyFilter(level); setVisibleCount(PAGE_SIZE) }}
                        aria-pressed={on}
                        style={{
                          fontSize: 11, fontWeight: on ? 700 : 500, cursor: 'pointer',
                          padding: '5px 12px', borderRadius: 9999,
                          border: `1px solid ${on ? c : BD}`,
                          background: on ? `${c}14` : SF,
                          color: on ? c : TX2,
                          fontFamily: 'var(--font-dm), system-ui',
                          transition: 'border-color 120ms, background 120ms, color 120ms',
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}

                  <span style={{ flex: 1 }} />

                  <button
                    onClick={() => { setHideRead(v => !v); setVisibleCount(PAGE_SIZE) }}
                    aria-pressed={hideRead}
                    style={{
                      fontSize: 11, fontWeight: hideRead ? 700 : 500, cursor: 'pointer',
                      padding: '5px 12px', borderRadius: 9999,
                      border: `1px solid ${hideRead ? ACC : BD}`,
                      background: hideRead ? `${ACC}14` : SF,
                      color: hideRead ? ACC : TX2,
                      fontFamily: 'var(--font-dm), system-ui', display: 'inline-flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    {hideRead && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L19 7"/></svg>}
                    {tc('academy.hide_read')}
                  </button>

                  <button
                    onClick={() => { setSortBy(v => v === 'default' ? 'quickest' : 'default'); setVisibleCount(PAGE_SIZE) }}
                    aria-pressed={sortBy === 'quickest'}
                    style={{
                      fontSize: 11, fontWeight: sortBy === 'quickest' ? 700 : 500, cursor: 'pointer',
                      padding: '5px 12px', borderRadius: 9999,
                      border: `1px solid ${sortBy === 'quickest' ? ACC : BD}`,
                      background: sortBy === 'quickest' ? `${ACC}14` : SF,
                      color: sortBy === 'quickest' ? ACC : TX2,
                      fontFamily: 'var(--font-dm), system-ui',
                    }}
                  >
                    {sortBy === 'quickest' ? tc('academy.sort_quickest') : tc('academy.sort_default')}
                  </button>
                </div>
              )}

              {/* No results */}
              {displayList.length === 0 && (() => {
                // Distinguish "no matches for this filter" from "no articles at
                // all" — if the underlying list has rows but filters emptied it,
                // offer to clear the filters instead of leaving home.
                const filtersActive = baseList.length > 0 && (difficultyFilter !== 'All' || hideRead)
                return (
                  <div style={{ padding: '48px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: TX2, marginBottom: 16 }}>{tc('academy.no_articles_found')}{isSearch ? ' ' + tc('academy.no_articles_found_for_prefix') + ' “' + search + '”' : ''}.</div>
                    <button
                      onClick={() => { filtersActive ? resetFilters() : goHome() }}
                      style={{ fontSize: 11, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {filtersActive ? tc('academy.filter_all') : tc('academy.back_to_all_categories')}
                    </button>
                  </div>
                )
              })()}

              {/* Article list */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {visibleRows.map((a, i) => (
                  <ArticleRow key={a.slug} article={a} index={i} total={visibleRows.length} isRead={readSlugs.has(a.slug)} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                  <button
                    className="ac-more"
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    style={{ fontSize: 11, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '9px 24px', fontWeight: 600, display: 'inline-block' }}
                  >
                    {tc('academy.load_prefix')} {Math.min(PAGE_SIZE, displayList.length - visibleCount)} {tc('academy.load_suffix')}
                  </button>
                  <div style={{ fontSize: 9, color: TX3, marginTop: 8 }}>
                    {tc('academy.showing_prefix')} {visibleRows.length} {tc('academy.showing_of')} {displayList.length}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer inside main so it scrolls with content */}
          <footer style={{ borderTop: `1px solid ${BD}`, marginTop: 64, padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 10, color: TX3 }}>{tc('academy.footer_copyright')}</span>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              {([['/', tc('academy.footer_home')], ['/blog', tc('academy.footer_blog')], ['/help', tc('academy.footer_help')], ['/academy', tc('academy.footer_academy')], ['/rules', tc('academy.footer_rules')], ['/privacy', tc('academy.footer_privacy')]] as [string,string][]).map(([href, label]) => (
                <Link key={href} href={localePath(href, lang)} style={{ fontSize: 10, color: TX3, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
