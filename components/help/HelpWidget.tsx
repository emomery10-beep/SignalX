'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HELP_ARTICLES, HELP_TOPICS, searchArticles, getPopularArticles, type HelpArticle } from '@/lib/help-content'
import { useLang } from '@/components/LanguageProvider'

const ACC  = '#d08a59'
const SF   = '#ffffff'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const BD   = '#e8e6e1'
const BG   = '#f9f8f6'

// Map app sections to relevant help topic slugs (must match HELP_TOPICS slugs)
const SECTION_MAP: [string, string][] = [
  ['/intelligence', 'intelligence-alerts'],
  ['/dashboards',   'data-analysis-reporting'],
  ['/ask',          'ask-askbiz'],
  ['/sources',      'connecting-data'],
  ['/settings',     'settings-preferences'],
  ['/billing',      'account-billing'],
  ['/tools',        'business-tools'],
  ['/forecasts',    'forecasting-planning'],
  ['/home',         'getting-started'],
  ['/files',        'files-uploads'],
  ['/templates',    'templates'],
  ['/sell',         'point-of-sale'],
  ['/pos',          'mobile-money'],
  ['/cfo',          'advanced-intelligence'],
]

function buildQuickLinks(tc: (k: string) => string) {
  return [
    { label: tc('help_helpwidget.gettingStarted'), href: '/help/topic/getting-started' },
    { label: tc('help_helpwidget.faq'),            href: '/help/faq' },
    { label: tc('help_helpwidget.glossary'),       href: '/help/glossary' },
  ]
}

export default function HelpWidget() {
  const { tc } = useLang()
  const [open,    setOpen]    = useState(false)
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<HelpArticle[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  const QUICK_LINKS = buildQuickLinks(tc)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', fn)
    return () => window.removeEventListener('mousedown', fn)
  }, [open])

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  // Live search
  useEffect(() => {
    if (query.trim().length <= 1) { setResults([]); return }
    setResults(searchArticles(query).slice(0, 5))
  }, [query])

  // Contextual articles based on current path
  const contextArticles = useMemo(() => {
    const match = SECTION_MAP.find(([p]) => pathname?.startsWith(p))
    if (match) {
      const topicSlug = match[1]
      const topic = HELP_TOPICS.find(t => t.slug === topicSlug)
      if (topic) {
        return HELP_ARTICLES.filter(a => a.topicSlug === topicSlug).slice(0, 3)
      }
    }
    return getPopularArticles().slice(0, 3)
  }, [pathname])

  const contextLabel = useMemo(() => {
    const match = SECTION_MAP.find(([p]) => pathname?.startsWith(p))
    if (match) {
      const topic = HELP_TOPICS.find(t => t.slug === match[1])
      return topic ? tc('help_helpwidget.helpFor') + topic.title : tc('help_helpwidget.suggestedArticles')
    }
    return tc('help_helpwidget.popularArticles')
  }, [pathname, tc])

  return (
    <div ref={panelRef} className="help-widget-fab" style={{ fontFamily: 'DM Sans, system-ui' }}>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 56, right: 0, width: 320,
          background: SF, border: `1px solid ${BD}`, borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,.15)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', maxHeight: 520,
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${BD}`, background: ACC }}>
            <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: SF, fontFamily: 'Sora, system-ui' }}>
              {tc('help_helpwidget.panelTitle')}
            </p>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input ref={inputRef} type="text" placeholder={tc('help_helpwidget.searchPlaceholder')}
                value={query} onChange={e => setQuery(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px 8px 30px', fontSize: 13, background: 'rgba(255,255,255,.2)', border: '1.5px solid rgba(255,255,255,.3)', borderRadius: 8, color: SF, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Body */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {results.length > 0 ? (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', padding: '10px 14px 4px', margin: 0 }}>
                  {tc('help_helpwidget.searchResults')}
                </p>
                {results.map(a => (
                  <Link key={a.slug} href={`/help/${a.slug}`} onClick={() => { setOpen(false); setQuery('') }}
                    style={{ display: 'block', padding: '9px 14px', textDecoration: 'none', borderBottom: `1px solid ${BD}`, transition: 'background 100ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{a.topic}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.35 }}>{a.title}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <>
                {/* Contextual articles */}
                <p style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', padding: '10px 14px 4px', margin: 0 }}>
                  {contextLabel}
                </p>
                {contextArticles.map(a => (
                  <Link key={a.slug} href={`/help/${a.slug}`} onClick={() => setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', textDecoration: 'none', borderBottom: `1px solid ${BD}`, transition: 'background 100ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.35, marginBottom: 2 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: TX3 }}>{tc('help_helpwidget.minRead', { min: a.readTime })}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}

                {/* Quick links */}
                <p style={{ fontSize: 10, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', padding: '10px 14px 4px', margin: 0 }}>
                  {tc('help_helpwidget.quickLinks')}
                </p>
                {QUICK_LINKS.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', textDecoration: 'none', borderBottom: `1px solid ${BD}`, fontSize: 13, color: TX2, transition: 'background 100ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {l.label}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/help" onClick={() => setOpen(false)}
              style={{ fontSize: 12, color: ACC, fontWeight: 600, textDecoration: 'none' }}>
              {tc('help_helpwidget.fullHelpCentre')}
            </Link>
            <a href="mailto:hello@askbiz.co"
              style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>
              {tc('help_helpwidget.emailSupport')}
            </a>
          </div>
        </div>
      )}

      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? tc('help_helpwidget.closeHelp') : tc('help_helpwidget.openHelp')}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: open ? TX2 : ACC, border: 'none',
          color: SF, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(208,138,89,.4)',
          fontSize: open ? 20 : 18, fontWeight: 700,
          transition: 'background .2s, transform .15s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? '×' : '?'}
      </button>
    </div>
  )
}
