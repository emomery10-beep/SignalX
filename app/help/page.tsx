'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { HELP_TOPICS, HELP_ARTICLES, searchArticles, getPopularArticles, type HelpArticle } from '@/lib/help-content'

const IS_NEW_DAYS = 45
function isNew(lastUpdated?: string): boolean {
  try { return !!lastUpdated && Date.now() - new Date(lastUpdated).getTime() < IS_NEW_DAYS * 86_400_000 }
  catch { return false }
}

const POPULAR_QUERIES = [
  'Connect Shopify', 'Dashboard is empty', 'Export data',
  'Billing & invoices', 'API access', 'Reset password',
]

// Curated featured topics shown on the home page (subset of all topics)
const FEATURED_TOPIC_SLUGS = [
  'getting-started',
  'point-of-sale',
  'data-analysis-reporting',
  'account-billing',
  'intelligence-alerts',
  'api-developers',
  'privacy-security',
  'troubleshooting',
]

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

function ArticleRow({ article, index, total }: { article: HelpArticle; index: number; total: number }) {
  const color = HELP_TOPICS.find(t => t.slug === article.topicSlug)?.color || ACC
  return (
    <Link
      href={`/help/${article.slug}`}
      className="h-row"
      style={{
        textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 16, alignItems: 'center', padding: '14px 12px', borderRadius: 10,
        background: 'transparent',
        borderBottom: index < total - 1 ? `1px solid ${BD}` : 'none',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color, background: `${color}18`,
            border: `1px solid ${color}30`, padding: '2px 7px', borderRadius: 9999,
            textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap',
          }}>
            {article.topic}
          </span>
          {article.popular && (
            <span style={{
              fontSize: 10, color: '#b8743e', background: '#f5ebe0',
              border: '1px solid #e8cba8', padding: '2px 7px', borderRadius: 9999,
              fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
            }}>Popular</span>
          )}
          {isNew(article.lastUpdated) && (
            <span style={{
              fontSize: 10, color: '#fff', background: '#2e7d32',
              border: '1px solid #388e3c', padding: '2px 7px', borderRadius: 9999,
              fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
            }}>New</span>
          )}
        </div>
        <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 600, color: TX, lineHeight: 1.4, marginBottom: 3 }}>
          {article.title}
        </div>
        <p style={{ fontSize: 12, color: TX2, lineHeight: 1.5, margin: 0 }}>
          {article.description.slice(0, 100)}{article.description.length > 100 ? '…' : ''}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: TX3, whiteSpace: 'nowrap' }}>{article.readTime} min</div>
        <div style={{ fontSize: 11, color: ACC, fontWeight: 600, marginTop: 4 }} aria-label={`Read ${article.title}`}>Read →</div>
      </div>
    </Link>
  )
}

export default function HelpPage() {
  const popularArticles = useMemo(() => getPopularArticles(), [])
  const searchRef = useRef<HTMLInputElement>(null)

  const [activeTopic,    setActiveTopic]    = useState<string | null>(null)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [search,         setSearch]         = useState('')
  const [searchFocused,  setSearchFocused]  = useState(false)
  const [visibleCount,   setVisibleCount]   = useState(PAGE_SIZE)
  const [sidebarOpen,    setSidebarOpen]    = useState(false)
  const [sidebarFilter,  setSidebarFilter]  = useState('')
  const [acOpen,         setAcOpen]         = useState(false)

  // CMD+K / Ctrl+K focuses search
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
      if (e.key === 'Escape') { setAcOpen(false); searchRef.current?.blur() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  // Live autocomplete suggestions (title-first, shows from 1 char)
  const acSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return HELP_ARTICLES
      .filter(a => a.title.toLowerCase().includes(q) || a.topic.toLowerCase().includes(q))
      .slice(0, 6)
  }, [search])

  const searchResults = useMemo(() => {
    if (search.trim().length <= 1) return []
    const q = search.toLowerCase()
    return searchArticles(search)
      .map(a => {
        let score = 0
        if (a.title.toLowerCase().includes(q))                          score += 10
        if (a.topic.toLowerCase().includes(q))                          score += 6
        if (a.description.toLowerCase().includes(q))                    score += 4
        if (a.popular)                                                   score += 2
        if ((a.keywords || []).some(k => k.toLowerCase().includes(q)))  score += 3
        return { ...a, score }
      })
      .sort((a, b) => b.score - a.score)
  }, [search])

  const currentTopic  = HELP_TOPICS.find(t => t.slug === activeTopic)
  const topicArticles = activeTopic ? HELP_ARTICLES.filter(a => a.topicSlug === activeTopic) : []

  const isHome      = !activeTopic && !search.trim()
  const isSearch    = search.trim().length > 1
  const displayList = isSearch ? searchResults : topicArticles
  const visibleRows = displayList.slice(0, visibleCount)
  const hasMore     = displayList.length > visibleCount

  function toggleExpand(slug: string) {
    setExpandedTopics(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  function selectTopic(slug: string) {
    if (activeTopic === slug) {
      setActiveTopic(null)
    } else {
      setActiveTopic(slug)
      setSearch('')
      setVisibleCount(PAGE_SIZE)
      if (!expandedTopics.has(slug))
        setExpandedTopics(prev => new Set([...prev, slug]))
    }
    setSidebarOpen(false)
  }

  function goHome() {
    setActiveTopic(null)
    setSearch('')
    setVisibleCount(PAGE_SIZE)
    setSidebarOpen(false)
  }

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .h-row        { transition: background 120ms; }
        .h-row:hover  { background: ${SF} !important; }
        .sb-btn       { cursor: pointer; border: none; background: transparent; transition: background 120ms; font-family: DM Sans, system-ui; }
        .sb-btn:hover { background: rgba(0,0,0,0.045) !important; }
        .h-card       { cursor: pointer; transition: transform 140ms, box-shadow 140ms; }
        .h-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09) !important; }
        .h-art-link   { display: block; padding: 5px 8px; border-radius: 6px; font-size: 12px; color: ${TX2}; text-decoration: none; line-height: 1.45; transition: background 100ms, color 100ms; }
        .h-art-link:hover { background: rgba(0,0,0,0.04); color: ${TX}; }
        .h-crumb      { background: none; border: none; cursor: pointer; padding: 0; font-family: DM Sans, system-ui; }
        .h-crumb:hover { text-decoration: underline; }
        .h-more       { cursor: pointer; transition: background 120ms; }
        .h-more:hover { background: rgba(208,138,89,.12) !important; }
        .h-search     { outline: none; }
        .h-search:focus { border-color: ${ACC} !important; box-shadow: 0 0 0 3px rgba(208,138,89,.12); }
        .h-mob-tog    { display: none; cursor: pointer; border: none; background: none; align-items: center; }
        .h-sb-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 39; }
        @media (max-width: 860px) {
          .h-sb-wrap  { display: none; position: fixed; top: 54px; left: 0; bottom: 0; width: 280px; z-index: 40; background: ${SF}; box-shadow: 4px 0 24px rgba(0,0,0,.12); overflow-y: auto; }
          .h-sb-wrap.open  { display: block; }
          .h-sb-overlay.open { display: block; }
          .h-mob-tog  { display: flex !important; }
          .h-main     { padding: 24px 16px !important; }
        }
      `}</style>

      {/* ── Nav — identical to blog ── */}
      <nav style={{
        borderBottom: `1px solid ${BD}`, background: SF,
        padding: '0 clamp(16px,4vw,24px)', height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="h-mob-tog" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle topics">
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
      <div className={`h-sb-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* ── Two-pane layout ── */}
      <div style={{ display: 'flex', height: 'calc(100vh - 54px)', overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <div className={`h-sb-wrap${sidebarOpen ? ' open' : ''}`} style={{ width: 244, flexShrink: 0, overflowY: 'auto', borderRight: `1px solid ${BD}`, background: SF, padding: '20px 0 32px' }}>
          <aside>

            {/* Sidebar topic filter */}
            <div style={{ padding: '0 12px 10px' }}>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Filter topics…"
                  value={sidebarFilter}
                  onChange={e => setSidebarFilter(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px 7px 26px', fontSize: 12, color: TX, background: BG, border: `1px solid ${BD}`, borderRadius: 7, outline: 'none', fontFamily: 'DM Sans, system-ui' }}
                />
                {sidebarFilter && (
                  <button onClick={() => setSidebarFilter('')} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TX3, fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
                )}
              </div>
            </div>

            {/* All topics */}
            <div style={{ padding: '0 12px', marginBottom: 4 }}>
              <button
                className="sb-btn"
                onClick={goHome}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '8px 12px', borderRadius: 8,
                  background: isHome ? 'rgba(208,138,89,.12)' : 'transparent',
                  color: isHome ? ACC : TX2,
                  fontSize: 13, fontWeight: isHome ? 600 : 400,
                }}
              >
                <span>All topics</span>
                <span style={{ fontSize: 11, color: TX3 }}>{HELP_ARTICLES.length}</span>
              </button>
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '10px 24px 6px' }}>
              Browse topics
            </div>

            {HELP_TOPICS.filter(t => !sidebarFilter.trim() || t.title.toLowerCase().includes(sidebarFilter.toLowerCase())).map(topic => {
              const isActive = activeTopic === topic.slug
              const isExp    = expandedTopics.has(topic.slug)
              const color    = topic.color || ACC
              const count    = HELP_ARTICLES.filter(a => a.topicSlug === topic.slug).length

              return (
                <div key={topic.slug} style={{ padding: '0 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, background: isActive ? `${color}14` : 'transparent', marginBottom: 1 }}>
                    <button
                      className="sb-btn"
                      onClick={() => selectTopic(topic.slug)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 6px 7px 10px', borderRadius: '8px 0 0 8px',
                        color: isActive ? color : TX2,
                        fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: 'left',
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ lineHeight: 1.35, flex: 1 }}>{topic.title}</span>
                      <span style={{ fontSize: 10, color: isActive ? color : TX3, flexShrink: 0 }}>{count}</span>
                    </button>
                    <button
                      className="sb-btn"
                      onClick={() => toggleExpand(topic.slug)}
                      aria-label={isExp ? 'Collapse' : 'Expand'}
                      style={{ padding: '7px 10px', borderRadius: '0 8px 8px 0', color: isActive ? color : TX3, display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronIcon expanded={isExp} />
                    </button>
                  </div>

                  {isExp && (
                    <div style={{ paddingLeft: 26, paddingBottom: 4 }}>
                      {HELP_ARTICLES.filter(a => a.topicSlug === topic.slug).map(article => (
                        <Link key={article.slug} href={`/help/${article.slug}`} className="h-art-link" onClick={() => setSidebarOpen(false)}>
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
              {([['Rules & Policies', '/rules'], ['Transparency Centre', '/transparency'], ['FAQ', '/help/faq'], ['Glossary', '/help/glossary']] as [string,string][]).map(([label, href]) => (
                <Link key={href} href={href} className="sb-btn" style={{ display: 'block', padding: '6px 10px', fontSize: 13, color: TX2, textDecoration: 'none', borderRadius: 6 }}>
                  {label}
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* ── Main ── */}
        <main className="h-main" style={{ flex: 1, overflowY: 'auto', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,72px)' }}>

          {/* Search bar + heading */}
          <div style={{ marginBottom: isHome ? 40 : 28 }}>
            {isHome && (
              <div style={{ marginBottom: 22, maxWidth: 580 }}>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(24px,3vw,32px)', fontWeight: 700, letterSpacing: '-.03em', color: TX, marginBottom: 8, lineHeight: 1.15 }}>
                  How can we help?
                </h1>
                <p style={{ fontSize: 14, color: TX2, margin: 0, lineHeight: 1.6 }}>
                  {HELP_ARTICLES.length} guides and articles across {HELP_TOPICS.length} topics — search or browse below.
                </p>
              </div>
            )}
            <div style={{ position: 'relative', maxWidth: isHome ? 580 : 480 }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                className="h-search"
                type="text"
                placeholder="Search articles and guides…"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveTopic(null); setVisibleCount(PAGE_SIZE); setAcOpen(true) }}
                onFocus={() => { setSearchFocused(true); setAcOpen(true) }}
                onBlur={() => setTimeout(() => { setSearchFocused(false); setAcOpen(false) }, 150)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 72px 11px 44px', fontSize: 14, color: TX, background: SF, border: `1.5px solid ${BD}`, borderRadius: 10, transition: 'border-color 150ms, box-shadow 150ms' }}
              />
              {/* CMD+K hint */}
              {!search && (
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 3, pointerEvents: 'none' }}>
                  <kbd style={{ fontSize: 10, color: TX3, background: BG, border: `1px solid ${BD}`, borderRadius: 4, padding: '2px 5px', fontFamily: 'inherit', lineHeight: 1.4 }}>⌘K</kbd>
                </span>
              )}
              {search && (
                <button onClick={() => { setSearch(''); setAcOpen(false) }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TX3, fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
              )}
              {/* Dropdown: popular searches (empty) or live autocomplete (typing) */}
              {acOpen && (searchFocused || search.trim()) && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: SF, border: `1px solid ${BD}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.1)', zIndex: 200, padding: '10px 8px', maxHeight: 340, overflowY: 'auto' }}>
                  {!search.trim() ? (
                    <>
                      <p style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 8px', padding: '0 6px' }}>Popular searches</p>
                      {POPULAR_QUERIES.map(q => (
                        <button key={q}
                          onMouseDown={() => { setSearch(q); setActiveTopic(null); setVisibleCount(PAGE_SIZE); setAcOpen(false) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 7, fontSize: 13, color: TX, fontFamily: 'DM Sans, system-ui', textAlign: 'left', transition: 'background 100ms' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f3f2ef')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                          </svg>
                          {q}
                        </button>
                      ))}
                    </>
                  ) : acSuggestions.length > 0 ? (
                    <>
                      <p style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 6px', padding: '0 6px' }}>Suggestions</p>
                      {acSuggestions.map(a => {
                        const color = HELP_TOPICS.find(t => t.slug === a.topicSlug)?.color || ACC
                        return (
                          <Link key={a.slug} href={`/help/${a.slug}`}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => { setAcOpen(false); setSidebarOpen(false) }}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, textDecoration: 'none', color: TX, transition: 'background 100ms' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f3f2ef')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.3 }}>{a.title}</div>
                              <div style={{ fontSize: 11, color: TX3 }}>{a.topic}</div>
                            </div>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </Link>
                        )
                      })}
                    </>
                  ) : (
                    <p style={{ fontSize: 13, color: TX3, margin: 0, padding: '4px 10px' }}>No suggestions found</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Home state ── */}
          {isHome && (
            <>
              {/* Popular topics — curated 8-topic grid */}
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, letterSpacing: '-.015em', margin: 0 }}>Browse by topic</h2>
                  <span style={{ fontSize: 12, color: TX3 }}>{HELP_TOPICS.length} topics total</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                  {HELP_TOPICS.filter(t => FEATURED_TOPIC_SLUGS.includes(t.slug)).sort((a, b) => FEATURED_TOPIC_SLUGS.indexOf(a.slug) - FEATURED_TOPIC_SLUGS.indexOf(b.slug)).map(topic => {
                    const color = topic.color || ACC
                    const count = HELP_ARTICLES.filter(a => a.topicSlug === topic.slug).length
                    return (
                      <button
                        key={topic.slug}
                        className="h-card"
                        onClick={() => selectTopic(topic.slug)}
                        aria-label={`Browse ${topic.title} articles`}
                        style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '22px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit', color: 'inherit' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                            {topic.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 4, lineHeight: 1.3 }}>{topic.title}</div>
                            <p style={{ fontSize: 12, color: TX2, margin: '0 0 8px', lineHeight: 1.5 }}>
                              {topic.description.slice(0, 65)}{topic.description.length > 65 ? '…' : ''}
                            </p>
                            <span style={{ fontSize: 11, color, fontWeight: 600 }}>{count} articles →</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {/* See all topics link */}
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button
                    className="sb-btn"
                    onClick={() => { /* scroll sidebar into view or expand — for now just hint */ document.querySelector('.h-sb-wrap')?.scrollIntoView({ behavior: 'smooth' }) }}
                    style={{ fontSize: 12, color: TX3, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                  >
                    View all {HELP_TOPICS.length} topics in the sidebar →
                  </button>
                </div>
              </section>

              {/* Popular articles — same row list as blog's "Recent articles" */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, letterSpacing: '-.015em', margin: 0 }}>Popular articles</h2>
                  <span style={{ fontSize: 12, color: TX3 }}>{HELP_ARTICLES.length} total</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {popularArticles.slice(0, 8).map((a, i) => (
                    <ArticleRow key={a.slug} article={a} index={i} total={Math.min(8, popularArticles.length)} />
                  ))}
                </div>
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <button
                    className="sb-btn"
                    onClick={() => { setActiveTopic(null); setSearch(''); setVisibleCount(PAGE_SIZE) }}
                    style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Browse all {HELP_ARTICLES.length} articles →
                  </button>
                </div>
              </section>

              {/* ── Community section ── */}
              <section style={{ marginTop: 48 }}>
                <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 16, letterSpacing: '-.015em' }}>
                  Community & support
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                  {[
                    {
                      icon: '💬', title: 'Community Forum',
                      desc: 'Ask questions and share tips with other AskBiz users.',
                      href: 'https://community.askbiz.co', cta: 'Join the community',
                    },
                    {
                      icon: '📅', title: 'Book a support call',
                      desc: 'Schedule a 30-minute call with our team — free on all plans.',
                      href: 'https://cal.com/askbiz/support', cta: 'Book a slot',
                    },
                    {
                      icon: '📧', title: 'Email support',
                      desc: 'Replies within 2 business hours, Mon–Fri 8am–6pm GMT.',
                      href: 'mailto:hello@askbiz.co', cta: 'Send an email',
                    },
                    {
                      icon: '📋', title: 'FAQ',
                      desc: 'Quick answers to the most common questions about AskBiz.',
                      href: '/help/faq', cta: 'Browse FAQ',
                    },
                  ].map(c => (
                    <a key={c.title} href={c.href}
                      {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="h-comm-card"
                      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', background: SF, border: `1px solid ${BD}`, borderRadius: 12, textDecoration: 'none', color: TX, transition: 'border-color 150ms, box-shadow 150ms' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ACC; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,.08)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BD; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                      <span style={{ fontSize: 22 }}>{c.icon}</span>
                      <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX }}>{c.title}</div>
                      <p style={{ fontSize: 12, color: TX2, lineHeight: 1.5, margin: 0, flex: 1 }}>{c.desc}</p>
                      <span style={{ fontSize: 12, color: ACC, fontWeight: 600, marginTop: 4 }}>{c.cta} →</span>
                    </a>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── Topic / search state — same as blog's filtered state ── */}
          {!isHome && (
            <>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22, fontSize: 13, color: TX2, flexWrap: 'wrap' }}>
                <button className="h-crumb" onClick={goHome} style={{ color: ACC, fontSize: 13, fontWeight: 500 }}>All topics</button>
                {activeTopic && currentTopic && (
                  <><span style={{ color: TX3 }}>/</span><button className="h-crumb" style={{ color: TX, fontWeight: 600, fontSize: 13 }}>{currentTopic.title}</button></>
                )}
                {isSearch && !activeTopic && (
                  <><span style={{ color: TX3 }}>/</span><span style={{ color: TX, fontWeight: 600 }}>"{search}"</span></>
                )}
              </div>

              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 700, letterSpacing: '-.025em', color: TX, marginBottom: 4 }}>
                  {isSearch ? `Results for "${search}"` : currentTopic?.title}
                </h1>
                <p style={{ fontSize: 13, color: TX2, margin: 0 }}>
                  {displayList.length} article{displayList.length !== 1 ? 's' : ''}
                  {activeTopic && currentTopic && !isSearch && ` · ${currentTopic.description}`}
                </p>
              </div>

              {/* No results */}
              {displayList.length === 0 && (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: TX2, marginBottom: 16 }}>No articles found{isSearch ? ` for "${search}"` : ''}.</div>
                  <button onClick={goHome} style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 600 }}>
                    Back to all topics
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
                    className="h-more"
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
          {/* ── Footer ── */}
          <footer style={{ borderTop: `1px solid ${BD}`, marginTop: 64, padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz. AI-powered business intelligence for SMEs.</span>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              {([['/', 'Home'], ['/blog', 'Blog'], ['/help', 'Help'], ['/rules', 'Rules'], ['/privacy', 'Privacy'], ['/developers', 'API']] as [string,string][]).map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
