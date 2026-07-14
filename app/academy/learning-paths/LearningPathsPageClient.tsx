'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { LEARNING_PATHS, totalArticles } from '@/lib/learning-paths-content'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import ContinueLearning from './ContinueLearning'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

// Alias for convenience
const PATHS = LEARNING_PATHS

const LEVEL_COLOR: Record<string, string> = {
  'Beginner':               '#27ae60',
  'Beginner–Intermediate':  '#2980b9',
  'Intermediate':           '#e8734a',
  'Intermediate–Advanced':  '#8e44ad',
  'Advanced':               '#e74c3c',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AskBiz Academy Learning Paths',
  description: 'Structured learning paths for SME founders covering business intelligence, eCommerce, SaaS, retail, supply chain, manufacturing, legal, sustainability, and more.',
  url: 'https://askbiz.co/academy/learning-paths',
  numberOfItems: PATHS.length,
  // Each item links to its own crawlable /academy/learning-paths/[id] page —
  // previously every entry pointed at this same hub URL, which is invalid
  // structured data (search engines expect one distinct URL per ListItem).
  itemListElement: PATHS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.title,
    description: p.description,
    url: `https://askbiz.co/academy/learning-paths/${p.id}`,
  })),
}

export default function LearningPathsPageClient() {
  const { lang, tc } = useLang()
  const [search, setSearch]           = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredPaths = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return PATHS
    return PATHS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.level.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.articles.some(a => a.title.toLowerCase().includes(q))
    )
  }, [search])

  function goHome() {
    setSearch('')
    setSidebarOpen(false)
  }

  const isHome = true

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .lp-sb-btn       { cursor: pointer; border: none; background: transparent; transition: background 120ms; font-family: DM Sans, system-ui; width: 100%; text-align: left; }
        .lp-sb-btn:hover { background: rgba(0,0,0,0.045) !important; }
        .lp-card         { transition: transform 140ms, box-shadow 140ms; }
        .lp-card:hover   { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .lp-search       { outline: none; }
        .lp-search:focus { border-color: ${ACC} !important; box-shadow: 0 0 0 3px rgba(208,138,89,.12); }
        .lp-mob-tog      { display: none; cursor: pointer; border: none; background: none; align-items: center; }
        .lp-sb-overlay   { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 39; }
        @media (max-width: 860px) {
          .lp-sb-wrap  { display: none; position: fixed; top: 54px; left: 0; bottom: 0; width: 280px; z-index: 40; background: ${SF}; box-shadow: 4px 0 24px rgba(0,0,0,.12); overflow-y: auto; }
          .lp-sb-wrap.open { display: block; }
          .lp-sb-overlay.open { display: block; }
          .lp-mob-tog  { display: flex !important; }
          .lp-main     { padding: 24px 16px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="lp-mob-tog" onClick={() => setSidebarOpen(o => !o)} aria-label={tc('academy.lp_aria_toggle')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX2} strokeWidth="2" strokeLinecap="round">
              {sidebarOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
          <Link href={localePath('/', lang)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
            </div>
            <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
          </Link>
        </div>
        <Link href={localePath('/signin', lang)} style={{ fontSize: 11, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>{tc('academy.lp_try_free')}</Link>
      </nav>

      {/* Mobile overlay */}
      <div className={`lp-sb-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Two-pane layout */}
      <div style={{ display: 'flex', height: 'calc(100vh - 54px)', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div className={`lp-sb-wrap${sidebarOpen ? ' open' : ''}`} style={{ width: 244, flexShrink: 0, overflowY: 'auto', borderRight: `1px solid ${BD}`, background: SF, padding: '20px 0 32px' }}>

          {/* All paths */}
          <div style={{ padding: '0 12px', marginBottom: 4 }}>
            <button
              className="lp-sb-btn"
              onClick={goHome}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'rgba(208,138,89,.12)', color: ACC, fontSize: 11, fontWeight: 600 }}
            >
              <span>{tc('academy.lp_all_paths')}</span>
              <span style={{ fontSize: 9, color: TX3 }}>{PATHS.length}</span>
            </button>
          </div>

          <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '10px 24px 6px' }}>{tc('academy.lp_browse_tracks')}</div>

          {PATHS.map(path => (
            <div key={path.id} style={{ padding: '0 12px' }}>
              <Link
                href={localePath(`/academy/learning-paths/${path.id}`, lang)}
                onClick={() => setSidebarOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, color: TX2, fontSize: 11, fontWeight: 400, marginBottom: 1, textDecoration: 'none' }}
              >
                <span style={{ fontSize: 12, flexShrink: 0 }}>{path.icon}</span>
                <span style={{ lineHeight: 1.35, flex: 1, textAlign: 'left' }}>{path.title}</span>
                <span style={{ fontSize: 9, color: TX3, flexShrink: 0 }}>{path.articles.length}</span>
              </Link>
            </div>
          ))}

          {/* Footer links */}
          <div style={{ padding: '0 12px', marginTop: 12 }}>
            <div style={{ height: 1, background: BD, margin: '8px 0 12px' }} />
            <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '4px 10px 6px' }}>{tc('academy.lp_also_in_academy')}</div>
            {([[tc('academy.lp_all_articles'), '/academy'], [tc('academy.lp_checklists'), '/academy/checklists']] as [string,string][]).map(([label, href]) => (
              <Link key={href} href={localePath(href, lang)} style={{ display: 'block', padding: '6px 10px', fontSize: 11, color: TX2, textDecoration: 'none', borderRadius: 6 }}>{label}</Link>
            ))}
            <div style={{ height: 1, background: BD, margin: '8px 0 8px' }} />
            {([[tc('academy.lp_help_centre'), '/help'], [tc('academy.lp_blog'), '/blog'], [tc('academy.lp_free_tools'), '/free-tools']] as [string,string][]).map(([label, href]) => (
              <Link key={href} href={localePath(href, lang)} style={{ display: 'block', padding: '6px 10px', fontSize: 11, color: TX2, textDecoration: 'none', borderRadius: 6 }}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Main pane */}
        <main className="lp-main" style={{ flex: 1, overflowY: 'auto', padding: 'clamp(28px,4vw,48px) clamp(24px,4vw,48px)' }}>

          {/* Search + heading */}
          <div style={{ marginBottom: 32 }}>
            {isHome && (
              <div style={{ marginBottom: 18 }}>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, letterSpacing: '-.025em', color: TX, marginBottom: 4 }}>
                  {tc('academy.lp_page_title')}
                </h1>
                <p style={{ fontSize: 12, color: TX2, margin: 0 }}>
                  {PATHS.length} {tc('academy.lp_subtitle').replace('{totalArticles}', String(totalArticles))}
                </p>
              </div>
            )}

            {/* Search bar */}
            <div style={{ position: 'relative', maxWidth: 520 }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="lp-search"
                type="text"
                placeholder={tc('academy.lp_search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 36px 10px 40px', fontSize: 12, color: TX, background: SF, border: `1.5px solid ${BD}`, borderRadius: 10 }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TX3, fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
              )}
            </div>
          </div>

          {/* Search results */}
          {search.trim() && (
            <>
              <div style={{ fontSize: 11, color: TX3, marginBottom: 16 }}>
                {filteredPaths.length} {filteredPaths.length !== 1 ? tc('academy.lp_tracks_matching_plural') : tc('academy.lp_tracks_matching_prefix')} {tc('academy.lp_tracks_matching_suffix')} &ldquo;{search}&rdquo;
              </div>
              {filteredPaths.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 13, color: TX2 }}>{tc('academy.lp_no_tracks_found')} &ldquo;{search}&rdquo;</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {filteredPaths.map(path => <PathCard key={path.id} path={path} lang={lang} />)}
                </div>
              )}
            </>
          )}

          {/* Home: resume band + grid of all paths */}
          {isHome && !search.trim() && (
            <>
              <ContinueLearning />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {PATHS.map(path => <PathCard key={path.id} path={path} lang={lang} />)}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function PathCard({ path, lang }: { path: typeof PATHS[0]; lang: string }) {
  const { tc } = useLang()
  return (
    <Link
      className="lp-card"
      href={localePath(`/academy/learning-paths/${path.id}`, lang)}
      style={{ display: 'block', textDecoration: 'none', background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '22px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: path.color }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${path.color}15`, border: `1px solid ${path.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          {path.icon}
        </div>
        <span style={{ fontSize: 9, color: LEVEL_COLOR[path.level] || TX3, background: `${LEVEL_COLOR[path.level] || TX3}15`, border: `1px solid ${LEVEL_COLOR[path.level] || TX3}30`, padding: '3px 8px', borderRadius: 9999, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {path.level}
        </span>
      </div>
      <div style={{ fontFamily: 'Sora, system-ui', fontSize: 12, fontWeight: 700, color: TX, marginBottom: 2 }}>{path.title}</div>
      <div style={{ fontSize: 9, color: path.color, fontWeight: 600, marginBottom: 8 }}>{path.subtitle}</div>
      <p style={{ fontSize: 10, color: TX2, lineHeight: 1.6, marginBottom: 12 }}>{path.description.slice(0, 100)}{path.description.length > 100 ? '…' : ''}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${BD}`, paddingTop: 10 }}>
        <span style={{ fontSize: 9, color: TX3 }}>📖 {path.articles.length} {tc('academy.lp_duration_articles')} · {path.duration}</span>
        <span style={{ fontSize: 10, color: path.color, fontWeight: 700 }}>{tc('academy.lp_start')}</span>
      </div>
    </Link>
  )
}
