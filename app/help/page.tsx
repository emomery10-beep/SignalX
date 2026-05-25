'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { HELP_TOPICS, HELP_ARTICLES, searchArticles, getPopularArticles, type HelpArticle } from '@/lib/help-content'
import './help.css'

const IS_NEW_DAYS = 45
function isNew(lastUpdated?: string): boolean {
  try { return !!lastUpdated && Date.now() - new Date(lastUpdated).getTime() < IS_NEW_DAYS * 86_400_000 }
  catch { return false }
}

const POPULAR_QUERIES = [
  'Connect Shopify', 'Dashboard is empty', 'Export data',
  'Billing & invoices', 'API access', 'Reset password',
]

const FEATURED_TOPIC_SLUGS = [
  'getting-started', 'point-of-sale', 'data-analysis-reporting',
  'account-billing', 'intelligence-alerts', 'api-developers',
  'privacy-security', 'troubleshooting', 'connecting-data', 'business-tools',
]

const PAGE_SIZE = 20

export default function HelpPage() {
  const popularArticles = useMemo(() => getPopularArticles(), [])
  const searchRef = useRef<HTMLInputElement>(null)

  const [activeTopic,    setActiveTopic]    = useState<string | null>(null)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [search,         setSearch]         = useState('')
  const [searchFocused,  setSearchFocused]  = useState(false)
  const [visibleCount,   setVisibleCount]   = useState(PAGE_SIZE)
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
  }

  function goHome() {
    setActiveTopic(null)
    setSearch('')
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="hc-root">
      {/* ── Header ── */}
      <header className="hc-header">
        <div className="hc-header-inner">
          <Link href="/" className="hc-brand">
            <div className="hc-brand-icon">
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <rect x="3"  y="22" width="5" height="7"  rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9"  width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span className="hc-brand-name">AskBiz</span>
          </Link>
          <div className="hc-brand-divider" />
          <Link href="/help" className="hc-brand-label" style={{ textDecoration: 'none' }}>Help Centre</Link>
          <div style={{ flex: 1 }} />
          <Link href="/signin" style={{
            fontSize: 13, fontWeight: 600, color: '#fff',
            background: 'var(--hc-accent)', borderRadius: 9999,
            padding: '7px 18px', textDecoration: 'none',
            transition: 'background 0.15s',
          }}>
            Try free
          </Link>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="hc-body">
        {/* ── Sidebar ── */}
        <aside className="hc-sidebar" aria-label="Help topics">
          <p className="hc-nav-label">Browse topics</p>
          {HELP_TOPICS.map(topic => {
            const isActive = activeTopic === topic.slug
            const isExp    = expandedTopics.has(topic.slug)
            const count    = HELP_ARTICLES.filter(a => a.topicSlug === topic.slug).length

            return (
              <div key={topic.slug} className="hc-nav-group">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    className={`hc-nav-topic ${isActive ? 'hc-nav-topic--active' : ''}`}
                    onClick={() => selectTopic(topic.slug)}
                    style={{ flex: 1 }}
                  >
                    <span className="hc-nav-topic-icon">{topic.icon}</span>
                    <span className="hc-nav-topic-label">{topic.title}</span>
                    <span className="hc-nav-topic-count">{count}</span>
                  </button>
                  <button
                    onClick={() => toggleExpand(topic.slug)}
                    aria-label={isExp ? 'Collapse' : 'Expand'}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '8px 12px 8px 4px', color: 'var(--hc-muted)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <span className={`hc-nav-chevron ${isExp ? 'hc-nav-chevron--open' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </div>

                {isExp && (
                  <ul className="hc-nav-articles">
                    {HELP_ARTICLES.filter(a => a.topicSlug === topic.slug).map(article => (
                      <li key={article.slug}>
                        <Link href={`/help/${article.slug}`} className="hc-nav-article">
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}

          <div className="hc-nav-divider" />
          <Link href="/help/faq" className="hc-nav-link">FAQ</Link>
          <Link href="/help/glossary" className="hc-nav-link">Glossary</Link>
          <Link href="/rules" className="hc-nav-link">Rules & Policies</Link>
          <Link href="/transparency" className="hc-nav-link">Transparency Centre</Link>
        </aside>

        {/* ── Main ── */}
        <main className="hc-main">
          {/* Search bar — prominent, X-style */}
          <div style={{ marginBottom: isHome ? 40 : 28 }}>
            {isHome && (
              <div style={{ marginBottom: 24, maxWidth: 560 }}>
                <h1 style={{
                  fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 700,
                  color: 'var(--hc-dark)', marginBottom: 6, lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}>
                  How can we help?
                </h1>
                <p style={{ fontSize: 15, color: 'var(--hc-secondary)', margin: 0, lineHeight: 1.55 }}>
                  Search {HELP_ARTICLES.length} articles across {HELP_TOPICS.length} topics.
                </p>
              </div>
            )}
            <div className="hc-search-wrap">
              <svg className="hc-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                className="hc-search"
                type="text"
                placeholder="Search articles and guides..."
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveTopic(null); setVisibleCount(PAGE_SIZE); setAcOpen(true) }}
                onFocus={() => { setSearchFocused(true); setAcOpen(true) }}
                onBlur={() => setTimeout(() => { setSearchFocused(false); setAcOpen(false) }, 150)}
              />
              {!search && <span className="hc-search-kbd">⌘K</span>}
              {search && (
                <button className="hc-search-clear" onClick={() => { setSearch(''); setAcOpen(false) }}>×</button>
              )}

              {/* Autocomplete dropdown */}
              {acOpen && (searchFocused || search.trim()) && (
                <div className="hc-ac-dropdown">
                  {!search.trim() ? (
                    <>
                      <p className="hc-ac-label">Popular searches</p>
                      {POPULAR_QUERIES.map(q => (
                        <button key={q} className="hc-ac-item"
                          onMouseDown={() => { setSearch(q); setActiveTopic(null); setVisibleCount(PAGE_SIZE); setAcOpen(false) }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hc-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                          </svg>
                          {q}
                        </button>
                      ))}
                    </>
                  ) : acSuggestions.length > 0 ? (
                    <>
                      <p className="hc-ac-label">Suggestions</p>
                      {acSuggestions.map(a => (
                        <Link key={a.slug} href={`/help/${a.slug}`} className="hc-ac-item"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { setAcOpen(false) }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="hc-ac-item-title">{a.title}</div>
                            <div className="hc-ac-item-topic">{a.topic}</div>
                          </div>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--hc-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--hc-muted)', margin: 0, padding: '12px 16px' }}>No suggestions found</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Home state ── */}
          {isHome && (
            <>
              {/* Topic cards — X-style grid */}
              <section style={{ marginBottom: 48 }}>
                <h2 className="hc-section-title">Browse by topic</h2>
                <div className="hc-topics-grid">
                  {HELP_TOPICS.filter(t => FEATURED_TOPIC_SLUGS.includes(t.slug))
                    .sort((a, b) => FEATURED_TOPIC_SLUGS.indexOf(a.slug) - FEATURED_TOPIC_SLUGS.indexOf(b.slug))
                    .map(topic => {
                      const count = HELP_ARTICLES.filter(a => a.topicSlug === topic.slug).length
                      return (
                        <button
                          key={topic.slug}
                          className="hc-topic-card"
                          onClick={() => selectTopic(topic.slug)}
                          aria-label={`Browse ${topic.title} articles`}
                        >
                          <span className="hc-topic-card-icon">{topic.icon}</span>
                          <span className="hc-topic-card-title">{topic.title}</span>
                          <span className="hc-topic-card-desc">
                            {topic.description.slice(0, 80)}{topic.description.length > 80 ? '...' : ''}
                          </span>
                          <span className="hc-topic-card-count">{count} articles</span>
                        </button>
                      )
                    })}
                </div>
              </section>

              {/* Popular articles */}
              <section style={{ marginBottom: 48 }}>
                <h2 className="hc-section-title">Popular articles</h2>
                <div className="hc-article-list">
                  {popularArticles.slice(0, 8).map(a => (
                    <Link key={a.slug} href={`/help/${a.slug}`} className="hc-article-row">
                      <div className="hc-article-row-body">
                        <span className="hc-article-row-title">{a.title}</span>
                        <span className="hc-article-row-desc">{a.description}</span>
                      </div>
                      <div className="hc-article-row-right">
                        <span className="hc-tag hc-tag--topic">{a.topic}</span>
                        {a.popular && <span className="hc-tag hc-tag--popular">Popular</span>}
                        <svg className="hc-article-row-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Resources */}
              <section style={{ marginBottom: 48 }}>
                <h2 className="hc-section-title">Resources</h2>
                <div className="hc-resources-grid">
                  {[
                    { icon: '📋', title: 'FAQ', desc: 'Quick answers to common questions about AskBiz.', href: '/help/faq', cta: 'Browse FAQ' },
                    { icon: '📖', title: 'Glossary', desc: 'Plain-English definitions for business metrics and terms.', href: '/help/glossary', cta: 'View glossary' },
                    { icon: '📧', title: 'Email support', desc: 'Replies within 2 business hours, Mon-Fri 8am-6pm GMT.', href: 'mailto:hello@askbiz.co', cta: 'Send email' },
                    { icon: '📅', title: 'Book a call', desc: 'Schedule a 30-minute support call with our team.', href: 'https://cal.com/askbiz/support', cta: 'Book a slot' },
                  ].map(c => (
                    <a key={c.title} href={c.href}
                      {...(c.href.startsWith('http') || c.href.startsWith('mailto') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="hc-resource-card">
                      <span className="hc-resource-card-icon">{c.icon}</span>
                      <span className="hc-resource-card-title">{c.title}</span>
                      <span className="hc-resource-card-desc">{c.desc}</span>
                      <span className="hc-resource-card-cta">{c.cta} →</span>
                    </a>
                  ))}
                </div>
              </section>

              {/* Footer */}
              <footer className="hc-footer">
                <span className="hc-footer-copy">© 2026 AskBiz</span>
                <div className="hc-footer-links">
                  {([['/', 'Home'], ['/blog', 'Blog'], ['/help', 'Help'], ['/rules', 'Rules'], ['/privacy', 'Privacy'], ['/developers', 'API']] as [string,string][]).map(([href, label]) => (
                    <Link key={href} href={href} className="hc-footer-link">{label}</Link>
                  ))}
                </div>
              </footer>
            </>
          )}

          {/* ── Topic / search state ── */}
          {!isHome && (
            <>
              {/* Breadcrumb */}
              <nav className="hc-breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
                <ol className="hc-breadcrumb-list">
                  <li><button onClick={goHome} className="hc-breadcrumb-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--hc-font)', fontSize: 13 }}>Help Centre</button></li>
                  {activeTopic && currentTopic && (
                    <>
                      <li><span className="hc-breadcrumb-sep">›</span></li>
                      <li className="hc-breadcrumb-current">{currentTopic.title}</li>
                    </>
                  )}
                  {isSearch && !activeTopic && (
                    <>
                      <li><span className="hc-breadcrumb-sep">›</span></li>
                      <li className="hc-breadcrumb-current">Search results</li>
                    </>
                  )}
                </ol>
              </nav>

              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <h1 style={{
                  fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700,
                  color: 'var(--hc-dark)', marginBottom: 4, letterSpacing: '-0.01em',
                }}>
                  {isSearch ? `Results for "${search}"` : currentTopic?.title}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--hc-secondary)', margin: 0 }}>
                  {displayList.length} article{displayList.length !== 1 ? 's' : ''}
                  {activeTopic && currentTopic && !isSearch && ` · ${currentTopic.description}`}
                </p>
              </div>

              {/* No results */}
              {displayList.length === 0 && (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: 'var(--hc-secondary)', marginBottom: 16 }}>
                    No articles found{isSearch ? ` for "${search}"` : ''}.
                  </div>
                  <button onClick={goHome} style={{
                    fontSize: 13, color: 'var(--hc-accent)', background: 'none',
                    border: '1px solid var(--hc-accent)', borderRadius: 8,
                    padding: '7px 16px', cursor: 'pointer', fontWeight: 600,
                    fontFamily: 'var(--hc-font)',
                  }}>
                    Back to all topics
                  </button>
                </div>
              )}

              {/* Article list */}
              {displayList.length > 0 && (
                <div className="hc-article-list">
                  {visibleRows.map(a => (
                    <Link key={a.slug} href={`/help/${a.slug}`} className="hc-article-row">
                      <div className="hc-article-row-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span className="hc-article-row-title" style={{ marginBottom: 0 }}>{a.title}</span>
                          {a.popular && <span className="hc-tag hc-tag--popular">Popular</span>}
                          {isNew(a.lastUpdated) && <span className="hc-tag hc-tag--new">New</span>}
                        </div>
                        <span className="hc-article-row-desc">{a.description}</span>
                      </div>
                      <div className="hc-article-row-right">
                        <span className="hc-tag">{a.readTime} min</span>
                        <svg className="hc-article-row-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Load more */}
              {hasMore && (
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    style={{
                      fontSize: 13, color: 'var(--hc-accent)', background: 'none',
                      border: '1px solid var(--hc-accent)', borderRadius: 9999,
                      padding: '9px 24px', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'var(--hc-font)', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--hc-accent-light)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    Show more ({displayList.length - visibleCount} remaining)
                  </button>
                </div>
              )}

              {/* Footer */}
              <footer className="hc-footer">
                <span className="hc-footer-copy">© 2026 AskBiz</span>
                <div className="hc-footer-links">
                  {([['/', 'Home'], ['/blog', 'Blog'], ['/help', 'Help'], ['/privacy', 'Privacy']] as [string,string][]).map(([href, label]) => (
                    <Link key={href} href={href} className="hc-footer-link">{label}</Link>
                  ))}
                </div>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
