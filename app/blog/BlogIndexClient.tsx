'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog-content'

function getContentType(title: string, pillar: string): string {
  const t = title.toLowerCase()
  const p = (pillar || '').toLowerCase()
  if (t.includes('how to') || t.includes('how-to') || t.includes('step-by-step')) return 'How-To'
  if (t.includes(' vs ') || t.includes('versus') || t.includes('comparison')) return 'Comparison'
  if (t.includes('case study') || t.includes('success story')) return 'Case Study'
  if (t.includes('what is') || t.includes('what are') || t.includes('explained') || t.includes('definition')) return 'Explainer'
  if (t.includes('news') || t.includes('trends') || t.includes('report') || p.includes('news')) return 'Report'
  if (t.includes('checklist') || t.includes('template') || t.includes('playbook')) return 'Template'
  return 'Guide'
}

const CLUSTER_DIFFICULTY: Record<string, string> = {
  'AskBiz Tutorials': 'Beginner', 'Startup Growth': 'Beginner', 'Business & Economic Impact': 'Beginner',
  'BI News & Trends 2026': 'Beginner', 'AI & Business Trends 2026': 'Beginner',
  'Business Strategy': 'Intermediate', 'Financial Intelligence': 'Intermediate', 'Marketing Intelligence': 'Intermediate',
  'eCommerce Intelligence': 'Intermediate', 'Data-Driven Decisions': 'Intermediate', 'Inventory & Supply Chain': 'Intermediate',
  'UK Business & Tax': 'Intermediate', 'Efficiency & Tools': 'Intermediate', 'AI Chief of Staff': 'Intermediate',
  'Africa eCommerce': 'Intermediate', 'Emerging Markets': 'Intermediate',
  'Data Translator': 'Advanced', 'Predictive Operations': 'Advanced', 'Predictive Strategy': 'Advanced',
  'Global Trade Intelligence': 'Advanced', 'Geopolitical Impact': 'Advanced', 'Local & Vertical Growth': 'Advanced',
  'Multi-Language & Vertical ROI': 'Advanced', 'Cross-Border EU Commerce': 'Advanced', 'EU-Ready AI': 'Advanced',
}

const DIFF_COLOURS: Record<string, string> = {
  Beginner: '#16a34a', Intermediate: '#d97706', Advanced: '#dc2626',
}

const CTYPE_COLOURS: Record<string, string> = {
  'How-To': '#0284c7', 'Comparison': '#9333ea', 'Case Study': '#0f766e',
  'Explainer': '#6366F1', 'Report': '#dc2626', 'Template': '#d97706', 'Guide': '#a39e97',
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

const CLUSTER_COLOURS: Record<string, { text: string; bg: string; border: string }> = {
  'AI Chief of Staff':             { text: '#9268f8', bg: 'rgba(146,104,248,.08)', border: 'rgba(146,104,248,.2)' },
  'Data Translator':               { text: '#1ed4ca', bg: 'rgba(30,212,202,.08)',  border: 'rgba(30,212,202,.2)'  },
  'Startup Growth':                { text: '#d08a59', bg: 'rgba(208,138,89,.08)',  border: 'rgba(208,138,89,.2)'  },
  'Efficiency & Tools':            { text: '#5280cc', bg: 'rgba(82,128,204,.08)',  border: 'rgba(82,128,204,.2)'  },
  'Financial Intelligence':        { text: '#16a34a', bg: 'rgba(34,197,94,.08)',   border: 'rgba(34,197,94,.2)'   },
  'Predictive Operations':         { text: '#dc2626', bg: 'rgba(239,68,68,.08)',   border: 'rgba(239,68,68,.2)'   },
  'Predictive Strategy':           { text: '#d97706', bg: 'rgba(245,158,11,.08)',  border: 'rgba(245,158,11,.2)'  },
  'Global Trade Intelligence':     { text: '#d97706', bg: 'rgba(245,158,11,.08)',  border: 'rgba(245,158,11,.2)'  },
  'Geopolitical Impact':           { text: '#dc2626', bg: 'rgba(239,68,68,.08)',   border: 'rgba(239,68,68,.2)'   },
  'AI & Business Trends 2026':     { text: '#6366F1', bg: 'rgba(99,102,241,.08)',  border: 'rgba(99,102,241,.2)'  },
  'Data-Driven Decisions':         { text: '#16a34a', bg: 'rgba(34,197,94,.08)',   border: 'rgba(34,197,94,.2)'   },
  'BI News & Trends 2026':         { text: '#059669', bg: 'rgba(16,185,129,.08)',  border: 'rgba(16,185,129,.2)'  },
  'Africa eCommerce':              { text: '#b45309', bg: 'rgba(180,83,9,.08)',    border: 'rgba(180,83,9,.2)'    },
  'Local & Vertical Growth':       { text: '#6366F1', bg: 'rgba(99,102,241,.08)', border: 'rgba(99,102,241,.2)'  },
  'Multi-Language & Vertical ROI': { text: '#db2777', bg: 'rgba(236,72,153,.08)', border: 'rgba(236,72,153,.2)'  },
  'eCommerce Intelligence':        { text: '#0284c7', bg: 'rgba(14,165,233,.08)',  border: 'rgba(14,165,233,.2)'  },
  'Marketing Intelligence':        { text: '#9333ea', bg: 'rgba(168,85,247,.08)', border: 'rgba(168,85,247,.2)'  },
  'Inventory & Supply Chain':      { text: '#0f766e', bg: 'rgba(20,184,166,.08)', border: 'rgba(20,184,166,.2)'  },
  'Business Strategy':             { text: '#1d4ed8', bg: 'rgba(59,130,246,.08)', border: 'rgba(59,130,246,.2)'  },
  'UK Business & Tax':             { text: '#be185d', bg: 'rgba(236,72,153,.08)', border: 'rgba(236,72,153,.2)'  },
  'Emerging Markets':              { text: '#b45309', bg: 'rgba(180,83,9,.08)',    border: 'rgba(180,83,9,.2)'    },
  'AskBiz Tutorials':              { text: '#d08a59', bg: 'rgba(208,138,89,.08)', border: 'rgba(208,138,89,.2)'  },
  'Business & Economic Impact':    { text: '#0f766e', bg: 'rgba(20,184,166,.08)', border: 'rgba(20,184,166,.2)'  },
  'Cross-Border EU Commerce':      { text: '#6366F1', bg: 'rgba(99,102,241,.08)', border: 'rgba(99,102,241,.2)'  },
  'EU-Ready AI':                   { text: '#1d4ed8', bg: 'rgba(59,130,246,.08)', border: 'rgba(59,130,246,.2)'  },
}

function getColour(cluster: string) {
  return CLUSTER_COLOURS[cluster] || { text: ACC, bg: 'rgba(208,138,89,.08)', border: 'rgba(208,138,89,.2)' }
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function relativeDate(dateStr: string): string {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return fmtDateShort(dateStr)
}

function isNew(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 48 * 3600000
}

const POPULAR_TOPICS: { cluster: string; description: string; icon: React.ReactNode }[] = [
  {
    cluster: 'AI Chief of Staff',
    description: 'Automate executive decisions and strategy with AI',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v1a4 4 0 0 1-8 0v-1H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>
        <path d="M9 14h.01M15 14h.01M9.5 18s1 1 2.5 1 2.5-1 2.5-1"/>
      </svg>
    ),
  },
  {
    cluster: 'Financial Intelligence',
    description: 'Cash flow, forecasting, and financial analytics for SMEs',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    cluster: 'eCommerce Intelligence',
    description: 'Data-driven growth strategies for online retail',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
    ),
  },
  {
    cluster: 'Business Strategy',
    description: 'Strategic planning, competitive analysis, and growth models',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    cluster: 'Marketing Intelligence',
    description: 'Campaign optimisation and audience insights',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 19-9-9 19-2-8-8-2z"/>
      </svg>
    ),
  },
  {
    cluster: 'Startup Growth',
    description: 'Traction, funding, and scaling your startup faster',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
  },
  {
    cluster: 'Data-Driven Decisions',
    description: 'Turn raw data into actionable business intelligence',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>
      </svg>
    ),
  },
  {
    cluster: 'Inventory & Supply Chain',
    description: 'Optimise stock, logistics, and supplier relationships',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15"/>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
      </svg>
    ),
  },
  {
    cluster: 'Global Trade Intelligence',
    description: 'Navigate international markets, tariffs, and trade routes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
]

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms', display: 'block' }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

const PAGE_SIZE = 20

// ── Inner component (needs useSearchParams → requires Suspense wrapper) ──────
function BlogContent() {
  const searchParams   = useSearchParams()
  const staticPosts    = getAllPosts()
  const [agentPosts, setAgentPosts] = useState<ReturnType<typeof getAllPosts>>([])
  const initCluster    = searchParams.get('cluster')
  const initPillar     = searchParams.get('pillar')

  useEffect(() => {
    fetch('/api/blog/published')
      .then(r => r.json())
      .then(d => {
        if (d.posts?.length) {
          const slugs = new Set(staticPosts.map(p => p.slug))
          setAgentPosts(d.posts.filter((p: { slug: string }) => p.slug && !slugs.has(p.slug)))
        }
      })
      .catch(() => {})
  }, [])

  const posts = useMemo(() => [...agentPosts, ...staticPosts], [agentPosts, staticPosts])

  const [active,           setActive]           = useState<string | null>(initCluster)
  const [activePillar,     setActivePillar]     = useState<string | null>(initPillar)
  const [search,           setSearch]           = useState('')
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(
    initCluster ? new Set([initCluster]) : new Set()
  )
  const [visibleCount,     setVisibleCount]     = useState(PAGE_SIZE)
  const [sidebarOpen,      setSidebarOpen]      = useState(false)
  const [sortBy,           setSortBy]           = useState<'date' | 'quickest'>('date')
  const [ctFilter,         setCtFilter]         = useState<string | null>(null)

  const clusters = useMemo(() => {
    const seen = new Set<string>()
    const out: string[] = []
    posts.forEach(p => { if (!seen.has(p.cluster)) { seen.add(p.cluster); out.push(p.cluster) } })
    return out.sort((a, b) => a.localeCompare(b))
  }, [posts])

  const clusterPillars = useMemo(() => {
    const map: Record<string, string[]> = {}
    clusters.forEach(c => {
      const seen = new Set<string>()
      const pillars: string[] = []
      posts.filter(p => p.cluster === c).forEach(p => {
        if (p.pillar && !seen.has(p.pillar)) { seen.add(p.pillar); pillars.push(p.pillar) }
      })
      map[c] = pillars
    })
    return map
  }, [clusters, posts])

  const filtered = useMemo(() => {
    let r = posts
    if (active) r = r.filter(p => p.cluster === active)
    if (activePillar) r = r.filter(p => p.pillar === activePillar)
    if (ctFilter) r = r.filter(p => getContentType(p.title, p.pillar || '') === ctFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tldr?.toLowerCase().includes(q) ||
        p.cluster.toLowerCase().includes(q) ||
        p.pillar?.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'quickest') r = [...r].sort((a, b) => a.readTime - b.readTime)
    else r = [...r].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    return r
  }, [posts, active, activePillar, search, sortBy, ctFilter])

  // "New this month" — posts published in last 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const newThisMonth  = useMemo(() =>
    posts
      .filter(p => new Date(p.publishDate).getTime() > thirtyDaysAgo)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 6),
  [posts])

  // "Popular this month" — 5 shortest-read posts from the most-posted cluster (proxy for engagement)
  const popularThisMonth = useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach(p => { counts[p.cluster] = (counts[p.cluster] || 0) + 1 })
    const topCluster = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return topCluster
      ? posts.filter(p => p.cluster === topCluster).sort((a, b) => a.readTime - b.readTime).slice(0, 5)
      : []
  }, [posts])

  // Top clusters by post count — drives the Popular topics section dynamically
  const topClusters = useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach(p => { counts[p.cluster] = (counts[p.cluster] || 0) + 1 })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([cluster, count]) => ({
        cluster,
        count,
        description: POPULAR_TOPICS.find(t => t.cluster === cluster)?.description ?? `${count} guides on ${cluster}`,
        icon:        POPULAR_TOPICS.find(t => t.cluster === cluster)?.icon ?? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
        ),
      }))
  }, [posts])

  const isHome      = !active && !activePillar && !search.trim() && !ctFilter
  const visibleRows = filtered.slice(0, visibleCount)
  const hasMore     = filtered.length > visibleCount

  function toggleExpand(cluster: string) {
    setExpandedClusters(prev => {
      const next = new Set(prev)
      if (next.has(cluster)) next.delete(cluster)
      else next.add(cluster)
      return next
    })
  }

  function selectCluster(cluster: string) {
    if (active === cluster && !activePillar) {
      setActive(null)
    } else {
      setActive(cluster)
      setActivePillar(null)
      setSearch('')
      setVisibleCount(PAGE_SIZE)
      setCtFilter(null)
      if (!expandedClusters.has(cluster))
        setExpandedClusters(prev => new Set([...prev, cluster]))
    }
    setSidebarOpen(false)
  }

  function goHome() {
    setActive(null)
    setActivePillar(null)
    setSearch('')
    setVisibleCount(PAGE_SIZE)
    setCtFilter(null)
    setSidebarOpen(false)
  }

  function PostCard({ post, index, total }: { post: ReturnType<typeof getAllPosts>[0]; index: number; total: number }) {
    const c = getColour(post.cluster)
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="post-row"
        style={{
          textDecoration: 'none', display: 'grid',
          gridTemplateColumns: '1fr auto', gap: 16,
          alignItems: 'center', padding: '14px 12px', borderRadius: 10,
          background: 'transparent',
          borderBottom: index < total - 1 ? `1px solid ${BD}` : 'none',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.text, flexShrink: 0, display: 'inline-block' }}/>
            <span style={{ fontSize: 11, fontWeight: 500, color: c.text }}>{post.cluster}</span>
          </div>
          <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 600, color: TX, lineHeight: 1.4, marginBottom: 3 }}>
            {post.title}
          </div>
          <p style={{ fontSize: 12, color: TX2, lineHeight: 1.55, margin: 0 }}>
            {post.tldr?.slice(0, 120)}{(post.tldr?.length ?? 0) > 120 ? '…' : ''}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: TX3, whiteSpace: 'nowrap' }}>{post.readTime} min</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
            {isNew(post.publishDate) && (
              <span style={{ fontSize: 9, fontWeight: 700, color: '#16a34a', background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.2)', borderRadius: 4, padding: '1px 5px', letterSpacing: '.04em', lineHeight: 1.4 }}>NEW</span>
            )}
            <div style={{ fontSize: 11, color: isNew(post.publishDate) ? '#16a34a' : TX3, whiteSpace: 'nowrap', fontWeight: isNew(post.publishDate) ? 500 : 400 }}>{relativeDate(post.publishDate)}</div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .post-row { transition: background 120ms; }
        .post-row:hover { background: ${SF} !important; }
        .sb-btn { cursor: pointer; border: none; background: transparent; transition: background 120ms; }
        .sb-btn:hover { background: rgba(0,0,0,0.045) !important; }
        .topic-card { transition: background 140ms, border-color 140ms, transform 140ms; cursor: pointer; }
        .topic-card:hover { background: var(--ev, #f3f2ef) !important; border-color: rgba(208,138,89,.25) !important; transform: translateY(-1px); }
        .search-input { outline: none; }
        .search-input:focus { border-color: ${ACC} !important; box-shadow: 0 0 0 3px rgba(208,138,89,.12); }
        .pillar-btn { cursor: pointer; border: none; background: transparent; transition: background 100ms; text-align: left; }
        .pillar-btn:hover { background: rgba(0,0,0,0.04) !important; }
        .crumb-btn { background: none; border: none; cursor: pointer; padding: 0; }
        .crumb-btn:hover { text-decoration: underline; }
        .load-more-btn { cursor: pointer; transition: background 120ms; }
        .load-more-btn:hover { background: rgba(208,138,89,.12) !important; }
        .mobile-toggle { display: none; cursor: pointer; border: none; background: none; align-items: center; gap: 6px; }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 39; }
        @media (min-width: 861px) {
          .blog-sidebar-wrap { position: sticky !important; top: 54px !important; height: calc(100vh - 54px); overflow-y: auto; align-self: start; }
        }
        @media (max-width: 860px) {
          .blog-layout { grid-template-columns: 1fr !important; }
          .blog-sidebar-wrap { display: none; position: fixed; top: 54px; left: 0; bottom: 0; width: 280px; z-index: 40; background: ${SF}; box-shadow: 4px 0 24px rgba(0,0,0,.12); overflow-y: auto; }
          .blog-sidebar-wrap.open { display: block; }
          .sidebar-overlay.open { display: block; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Mobile hamburger */}
          <button className="mobile-toggle" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle topics">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TX2} strokeWidth="2" strokeLinecap="round">
              {sidebarOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
          </Link>
        </div>
        <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>
          Try free →
        </Link>
      </nav>

      {/* Mobile sidebar overlay */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Layout */}
      <div className="blog-layout" style={{ maxWidth: 1260, margin: '0 auto', display: 'grid', gridTemplateColumns: '244px 1fr', alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <div className={`blog-sidebar-wrap${sidebarOpen ? ' open' : ''}`}>
          <aside style={{ minHeight: '100%', borderRight: `1px solid ${BD}`, padding: '20px 0 32px' }}>

            <div style={{ padding: '0 12px', marginBottom: 4 }}>
              <button className="sb-btn" onClick={goHome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 12px', borderRadius: 8, background: isHome ? 'rgba(208,138,89,.12)' : 'transparent', color: isHome ? ACC : TX2, fontSize: 13, fontWeight: isHome ? 600 : 400 }}>
                <span>All topics</span>
                <span style={{ fontSize: 11, color: TX3 }}>{posts.length}</span>
              </button>
            </div>

            <div style={{ height: 10 }} />

            {clusters.map(cluster => {
              const c         = getColour(cluster)
              const isActive  = active === cluster
              const isExp     = expandedClusters.has(cluster)
              const pillars   = clusterPillars[cluster] || []
              const count     = posts.filter(p => p.cluster === cluster).length

              return (
                <div key={cluster} style={{ padding: '0 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, background: isActive ? c.bg : 'transparent', marginBottom: 1 }}>
                    <button className="sb-btn" onClick={() => selectCluster(cluster)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 6px 7px 10px', borderRadius: '8px 0 0 8px', color: isActive ? c.text : TX2, fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: 'left' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.text, flexShrink: 0, display: 'inline-block' }}/>
                      <span style={{ lineHeight: 1.35, flex: 1 }}>{cluster}</span>
                      <span style={{ fontSize: 10, color: isActive ? c.text : TX3, flexShrink: 0 }}>{count}</span>
                    </button>
                    {pillars.length > 0 && (
                      <button className="sb-btn" onClick={() => toggleExpand(cluster)} aria-label={isExp ? 'Collapse' : 'Expand'} style={{ padding: '7px 10px', borderRadius: '0 8px 8px 0', color: isActive ? c.text : TX3, display: 'flex', alignItems: 'center' }}>
                        <ChevronIcon expanded={isExp}/>
                      </button>
                    )}
                  </div>
                  {isExp && pillars.length > 0 && (
                    <div style={{ paddingLeft: 26, paddingBottom: 4 }}>
                      {pillars.map(pillar => {
                        const isPA = activePillar === pillar && active === cluster
                        return (
                          <button key={pillar} className="pillar-btn" onClick={() => { setActive(cluster); setActivePillar(pillar); setSearch(''); setVisibleCount(PAGE_SIZE); setSidebarOpen(false) }} style={{ display: 'block', width: '100%', padding: '5px 8px', borderRadius: 6, fontSize: 12, color: isPA ? c.text : TX2, fontWeight: isPA ? 600 : 400, background: isPA ? c.bg : 'transparent' }}>
                            {pillar}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </aside>
        </div>

        {/* ── Main ── */}
        <main style={{ padding: 'clamp(28px,4vw,48px) clamp(24px,4vw,48px)', minHeight: 'calc(100vh - 54px)' }}>

          {/* Search */}
          <div style={{ marginBottom: isHome ? 36 : 28 }}>
            {isHome && (
              <div style={{ marginBottom: 22 }}>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-.03em', color: TX, marginBottom: 8, lineHeight: 1.15 }}>
                  Business Intelligence Hub
                </h1>
                <p style={{ fontSize: 14, color: TX2, margin: 0, lineHeight: 1.6 }}>
                  {posts.length.toLocaleString()} guides across {clusters.length} topics — AI, eCommerce, finance, and SME strategy.
                </p>
              </div>
            )}
            <div style={{ position: 'relative', maxWidth: isHome ? 580 : 480 }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input className="search-input" type="text" placeholder="Search articles and guides…" value={search} onChange={e => { setSearch(e.target.value); setActive(null); setActivePillar(null); setVisibleCount(PAGE_SIZE) }}
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
              <section style={{ marginBottom: 52 }}>
                <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, marginBottom: 20, letterSpacing: '-.015em' }}>Popular topics</h2>
                {/* Featured top 3 — data-driven from actual post counts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
                  {topClusters.slice(0, 3).map(topic => {
                    const c = getColour(topic.cluster)
                    return (
                      <button
                        key={topic.cluster}
                        className="topic-card"
                        onClick={() => selectCluster(topic.cluster)}
                        aria-label={`Browse ${topic.cluster} articles`}
                        style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '20px 20px 18px', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit', color: 'inherit',
                          /* override globals.css button { display: inline-flex; align-items: center } */
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: c.text, flexShrink: 0 }}>
                          {topic.icon}
                        </div>
                        <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 5, lineHeight: 1.3 }}>{topic.cluster}</div>
                        <p style={{ fontSize: 12, color: TX2, margin: '0 0 12px', lineHeight: 1.55, flex: 1 }}>{topic.description}</p>
                        <span style={{ fontSize: 11, color: c.text, fontWeight: 600 }}>{topic.count} articles →</span>
                      </button>
                    )
                  })}
                </div>
                {/* Compact pills for next clusters — data-driven */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {topClusters.slice(3).map(topic => {
                    const c = getColour(topic.cluster)
                    return (
                      <button key={topic.cluster} className="sb-btn" onClick={() => selectCluster(topic.cluster)} style={{ fontSize: 13, color: TX, background: SF, border: `1px solid ${BD}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 36 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.text, flexShrink: 0, display: 'inline-block' }}/>
                        <span style={{ fontWeight: 500 }}>{topic.cluster}</span>
                        <span style={{ fontSize: 11, color: TX3, fontWeight: 400 }}>{topic.count}</span>
                      </button>
                    )
                  })}
                </div>
              </section>

              {popularThisMonth.length > 0 && (
                <section style={{ marginBottom: 52 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, letterSpacing: '-.015em', margin: 0 }}>Popular this month</h2>
                    {popularThisMonth[0]?.cluster && (
                      <span style={{ fontSize: 11, fontWeight: 500, color: getColour(popularThisMonth[0].cluster).text, background: getColour(popularThisMonth[0].cluster).bg, border: `1px solid ${getColour(popularThisMonth[0].cluster).border}`, borderRadius: 9999, padding: '2px 10px' }}>
                        {popularThisMonth[0].cluster}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {popularThisMonth.map((post, i) => (
                      <PostCard key={post.slug} post={post} index={i} total={popularThisMonth.length}/>
                    ))}
                  </div>
                </section>
              )}

              {newThisMonth.length > 0 && (
                <section style={{ marginBottom: 52 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, letterSpacing: '-.015em', margin: 0 }}>New this month</h2>
                    <span style={{ fontSize: 10, fontWeight: 700, color: SF, background: ACC, borderRadius: 9999, padding: '2px 8px' }}>{newThisMonth.length} new</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {newThisMonth.map((post, i) => (
                      <PostCard key={post.slug} post={post} index={i} total={newThisMonth.length}/>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 700, color: TX, letterSpacing: '-.015em', margin: 0 }}>Recent articles</h2>
                  <span style={{ fontSize: 12, color: TX3 }}>{posts.length} total</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {posts.slice(0, 8).map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} total={8}/>
                  ))}
                </div>
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <button className="sb-btn" onClick={() => { setActive(null); setSearch(''); setVisibleCount(PAGE_SIZE) }} style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
                    Browse all {posts.length} articles →
                  </button>
                </div>
              </section>
            </>
          )}

          {/* ── Filtered / search state ── */}
          {!isHome && (
            <>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22, fontSize: 13, color: TX2, flexWrap: 'wrap' }}>
                <button className="crumb-btn" onClick={goHome} style={{ color: ACC, fontSize: 13, fontWeight: 500 }}>All topics</button>
                {active && (
                  <><span style={{ color: TX3 }}>/</span>
                  <button className="crumb-btn" onClick={() => { setActivePillar(null) }} style={{ color: activePillar ? TX2 : TX, fontWeight: activePillar ? 400 : 600, fontSize: 13 }}>{active}</button></>
                )}
                {activePillar && (
                  <><span style={{ color: TX3 }}>/</span><span style={{ color: TX, fontWeight: 600 }}>{activePillar}</span></>
                )}
                {search && !active && (
                  <><span style={{ color: TX3 }}>/</span><span style={{ color: TX, fontWeight: 600 }}>"{search}"</span></>
                )}
              </div>

              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 700, letterSpacing: '-.025em', color: TX, marginBottom: 4 }}>
                  {search ? `Results for "${search}"` : activePillar || active}
                </h1>
                <p style={{ fontSize: 13, color: TX2, margin: 0 }}>
                  {filtered.length} article{filtered.length !== 1 ? 's' : ''}
                  {active && !search && ` · ${active}`}
                </p>
              </div>

              {/* Sort + content type filter toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                {/* Sort */}
                <div style={{ display: 'flex', background: SF, border: `1px solid ${BD}`, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  {(['date', 'quickest'] as const).map(s => (
                    <button key={s} onClick={() => setSortBy(s)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: sortBy === s ? 700 : 400, color: sortBy === s ? SF : TX2, background: sortBy === s ? ACC : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 120ms' }}>
                      {s === 'date' ? 'Newest' : 'Quickest'}
                    </button>
                  ))}
                </div>
                {/* Content type pills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(['How-To', 'Guide', 'Explainer', 'Comparison', 'Case Study', 'Report', 'Template'] as const).map(ct => {
                    const col   = CTYPE_COLOURS[ct]
                    const active = ctFilter === ct
                    return (
                      <button key={ct} onClick={() => { setCtFilter(active ? null : ct); setVisibleCount(PAGE_SIZE) }}
                        style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? SF : col, background: active ? col : `${col}14`, border: `1px solid ${col}44`, borderRadius: 9999, padding: '4px 12px', cursor: 'pointer', transition: 'all 120ms' }}>
                        {ct}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* No results */}
              {filtered.length === 0 && (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: TX2, marginBottom: 16 }}>No articles found{search ? ` for "${search}"` : ''}.</div>
                  <button onClick={goHome} style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 600 }}>
                    Back to all topics
                  </button>
                </div>
              )}

              {/* Post list */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {visibleRows.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} total={visibleRows.length}/>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                  <button
                    className="load-more-btn"
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    style={{ fontSize: 13, color: ACC, background: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '9px 24px', fontWeight: 600, display: 'inline-block' }}
                  >
                    Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more articles
                  </button>
                  <div style={{ fontSize: 11, color: TX3, marginTop: 8 }}>
                    Showing {visibleRows.length} of {filtered.length}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF }}>
        <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz. AI-powered business intelligence for SMEs.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['/', 'Home'], ['/blog', 'Blog'], ['/rss.xml', 'RSS'], ['/privacy', 'Privacy'], ['/developers', 'API']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}

// ── Default export: wrap in Suspense for useSearchParams ─────────────────────
const BLOG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'AskBiz Business Intelligence Blog',
  description: 'Guides, analysis, and insights for SME founders on business intelligence, ecommerce, financial intelligence, AI tools, and global trade.',
  url: 'https://askbiz.co/blog',
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: 'AskBiz',
    url: 'https://askbiz.co',
    logo: { '@type': 'ImageObject', url: 'https://askbiz.co/logo.svg' },
  },
}

export default function BlogIndexClient() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_JSON_LD) }} />
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f9f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, system-ui' }}>
        <div style={{ fontSize: 14, color: '#a39e97' }}>Loading…</div>
      </div>
    }>
      <BlogContent />
    </Suspense>
    </>
  )
}
