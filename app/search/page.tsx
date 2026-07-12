'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { HELP_ARTICLES } from '@/lib/help-content'
import { getAllPosts } from '@/lib/blog-content'
import { academyArticles } from '@/lib/academy-content'
import { localePath } from '@/lib/i18n-locale'
import { useLang } from '@/components/LanguageProvider'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

type ResultType = 'academy' | 'help' | 'blog'

interface SearchResult {
  type: ResultType
  title: string
  description: string
  href: string
  tag: string
  tagColor: string
  score: number
}

const TYPE_META: Record<ResultType, { label: string; color: string }> = {
  academy: { label: 'Academy',     color: '#d08a59' },
  help:    { label: 'Help Centre', color: '#2980b9' },
  blog:    { label: 'Blog',        color: '#27ae60' },
}

function scoreText(text: string, q: string): number {
  const t = text.toLowerCase()
  if (t === q) return 20
  if (t.startsWith(q)) return 15
  if (t.includes(q)) return 10
  return 0
}

export default function SearchPage() {
  const { lang, tc } = useLang()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ResultType | 'all'>('all')

  const blogPosts = useMemo(() => {
    try { return getAllPosts() } catch { return [] }
  }, [])

  const results: SearchResult[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const hits: SearchResult[] = []

    // Academy
    academyArticles.forEach(a => {
      let score = scoreText(a.title, q) * 2
      score += scoreText(a.description, q)
      score += scoreText(a.category, q) * 0.5
      if ((a.keywords || []).some(k => k.toLowerCase().includes(q))) score += 4
      if (a.difficulty === 'Beginner') score += 1
      if (score > 0) hits.push({ type: 'academy', title: a.title, description: a.description, href: localePath(`/academy/${a.slug}`, lang), tag: a.category, tagColor: '#d08a59', score })
    })

    // Help
    HELP_ARTICLES.forEach(a => {
      let score = scoreText(a.title, q) * 2
      score += scoreText(a.description, q)
      score += scoreText(a.topic, q) * 0.5
      if ((a.keywords || []).some(k => k.toLowerCase().includes(q))) score += 4
      if (a.popular) score += 2
      if (score > 0) hits.push({ type: 'help', title: a.title, description: a.description, href: localePath(`/help/${a.slug}`, lang), tag: a.topic, tagColor: '#2980b9', score })
    })

    // Blog
    blogPosts.forEach((p: any) => {
      let score = scoreText(p.title, q) * 2
      score += scoreText(p.excerpt || p.description || '', q)
      if ((p.tags || []).some((t: string) => t.toLowerCase().includes(q))) score += 3
      if (score > 0) hits.push({ type: 'blog', title: p.title, description: p.excerpt || p.description || '', href: localePath(`/blog/${p.slug}`, lang), tag: 'Blog', tagColor: '#27ae60', score })
    })

    return hits.sort((a, b) => b.score - a.score)
  }, [query, blogPosts])

  const filtered = filter === 'all' ? results : results.filter(r => r.type === filter)

  const counts = {
    all:     results.length,
    academy: results.filter(r => r.type === 'academy').length,
    help:    results.filter(r => r.type === 'help').length,
    blog:    results.filter(r => r.type === 'blog').length,
  }

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href={localePath('/', lang)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <Link href={localePath('/signin', lang)} style={{ fontSize: 11, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,32px)' }}>

        {/* Search input */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: TX, letterSpacing: '-.025em', marginBottom: 16 }}>
            Search AskBiz
          </h1>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              autoFocus
              type="text"
              placeholder={tc('common.search_placeholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '14px 44px 14px 50px', fontSize: 14, color: TX, background: SF, border: `1.5px solid ${BD}`, borderRadius: 12, outline: 'none' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TX3, fontSize: 18, padding: 0 }}>×</button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        {results.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {(['all', 'academy', 'help', 'blog'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? TX : SF,
                  color: filter === f ? '#fff' : TX2,
                  border: `1px solid ${filter === f ? TX : BD}`,
                  borderRadius: 9999, padding: '6px 14px', fontSize: 11, fontWeight: filter === f ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'DM Sans, system-ui',
                }}
              >
                {f === 'all' ? 'All' : TYPE_META[f].label} ({counts[f]})
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {query.length >= 2 && (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 13, color: TX2, marginBottom: 8 }}>No results for &ldquo;{query}&rdquo;</div>
                <div style={{ fontSize: 11, color: TX3 }}>{tc('common.search_no_results_try')} <Link href={localePath('/academy', lang)} style={{ color: ACC }}>{tc('nav.academy')}</Link></div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, color: TX3, marginBottom: 16 }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filtered.slice(0, 30).map((r, i) => (
                    <Link
                      key={i}
                      href={r.href}
                      style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '16px 18px', textDecoration: 'none', display: 'block', transition: 'border-color 120ms' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: r.tagColor, background: r.tagColor + '18', border: `1px solid ${r.tagColor}30`, padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>
                          {TYPE_META[r.type].label}
                        </span>
                        <span style={{ fontSize: 9, color: TX3 }}>{r.tag}</span>
                      </div>
                      <div style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, color: TX, marginBottom: 4, lineHeight: 1.4 }}>{r.title}</div>
                      <p style={{ fontSize: 11, color: TX2, margin: 0, lineHeight: 1.55 }}>
                        {(r.description || '').slice(0, 120)}{(r.description || '').length > 120 ? '…' : ''}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Empty state */}
        {query.length < 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 8 }}>
            {([
              { href: localePath('/academy', lang), icon: '🎓', label: 'Browse Academy', sub: `${academyArticles.length}+ guides` },
              { href: localePath('/help', lang),    icon: '❓', label: 'Help Centre',    sub: `${HELP_ARTICLES.length} articles` },
              { href: localePath('/blog', lang),    icon: '📝', label: 'Blog',           sub: 'Latest posts' },
              { href: localePath('/free-tools', lang), icon: '🛠️', label: 'Free Tools', sub: 'Calculators & tools' },
            ] as {href:string;icon:string;label:string;sub:string}[]).map(item => (
              <Link key={item.href} href={item.href} style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '18px 16px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontFamily: 'Sora, system-ui', fontSize: 12, fontWeight: 700, color: TX, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: TX3 }}>{item.sub}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF, marginTop: 48 }}>
        <span style={{ fontSize: 10, color: TX3 }}>© 2026 AskBiz Ltd.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/', 'Home'], ['/academy', 'Academy'], ['/help', 'Help'], ['/blog', 'Blog']] as [string,string][]).map(([path, label]) => (
            <Link key={path} href={localePath(path, lang)} style={{ fontSize: 10, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
