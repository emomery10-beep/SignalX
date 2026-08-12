'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath, toLocale } from '@/lib/i18n-locale'
import {
  buildSidebarTree, getClusterCounts,
  type SidebarNode, type SidebarLeaf, type SidebarSubGroup,
} from '@/lib/blog-taxonomy'

const ACC = '#d08a59'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'
const HOVER = 'rgba(0,0,0,0.045)'

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms', display: 'block', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

function isGroup(n: SidebarNode): n is Extract<SidebarNode, { type: 'group' }> {
  return n.type === 'group'
}

interface BlogSidebarProps {
  /** Every post currently known to the page embedding this sidebar. */
  posts: { cluster: string }[]
  totalCount: number
  /** Slug of the cluster/group the current page represents, for highlighting. */
  activeSlug?: string
}

export default function BlogSidebar({ posts, totalCount, activeSlug }: BlogSidebarProps) {
  const { lang, tc, isRTL } = useLang()
  const [search, setSearch] = useState('')

  const tree = useMemo(() => buildSidebarTree(getClusterCounts(posts)), [posts])

  const initialOpen = useMemo(() => {
    const open = new Set<string>()
    if (!activeSlug) return open
    for (const node of tree) {
      if (!isGroup(node)) continue
      for (const child of node.children) {
        if (child.type === 'leaf' && child.slug === activeSlug) { open.add(node.key); }
        if (child.type === 'subgroup') {
          if (child.key === activeSlug) open.add(node.key)
          if (child.children.some(l => l.slug === activeSlug)) { open.add(node.key); open.add(child.key) }
        }
      }
    }
    return open
  }, [tree, activeSlug])

  const [openKeys, setOpenKeys] = useState<Set<string>>(initialOpen)

  function toggle(key: string) {
    setOpenKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Flatten every leaf for the search box — grouping stops mattering once
  // someone knows what they're looking for.
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return null
    const out: SidebarLeaf[] = []
    for (const node of tree) {
      if (!isGroup(node)) { if (node.label.toLowerCase().includes(q)) out.push(node); continue }
      for (const child of node.children) {
        if (child.type === 'leaf') { if (child.label.toLowerCase().includes(q)) out.push(child) }
        else { for (const leaf of child.children) if (leaf.label.toLowerCase().includes(q)) out.push(leaf) }
      }
    }
    return out.sort((a, b) => b.count - a.count)
  }, [tree, search])

  function topicHref(slug: string) {
    return localePath(`/blog/topic/${slug}`, toLocale(lang))
  }
  function groupHref(key: string) {
    return localePath(`/blog/group/${key}`, toLocale(lang))
  }

  function LeafRow({ leaf }: { leaf: SidebarLeaf }) {
    const isActive = activeSlug === leaf.slug
    return (
      <Link
        href={topicHref(leaf.slug)}
        className="sb-btn"
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8,
          color: isActive ? ACC : TX2, fontSize: 11, fontWeight: isActive ? 600 : 400,
          background: isActive ? 'rgba(208,138,89,.12)' : 'transparent', textDecoration: 'none',
        }}
      >
        {leaf.flagship && <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACC, flexShrink: 0, display: 'inline-block' }}/>}
        <span style={{ lineHeight: 1.35, flex: 1 }}>{leaf.label}</span>
        <span style={{ fontSize: 12, color: isActive ? ACC : TX3, flexShrink: 0 }}>{leaf.count}</span>
      </Link>
    )
  }

  function GroupHeader({ label, count, meta, linkable, href, expanded, onToggle }: {
    label: string; count: number; meta?: string; linkable: boolean; href?: string; expanded: boolean; onToggle: () => void
  }) {
    const isActive = linkable && href && activeSlug && href.endsWith(activeSlug)
    const labelEl = (
      <span style={{ lineHeight: 1.35, flex: 1, fontWeight: isActive ? 600 : 400, color: isActive ? ACC : TX2 }}>{label}</span>
    )
    return (
      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, background: isActive ? 'rgba(208,138,89,.12)' : 'transparent' }}>
        {linkable && href ? (
          <Link href={href} className="sb-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 6px 7px 10px', borderRadius: '8px 0 0 8px', textDecoration: 'none' }}>
            {labelEl}
          </Link>
        ) : (
          <button className="sb-btn" onClick={onToggle} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 6px 7px 10px', borderRadius: '8px 0 0 8px', textAlign: 'left' }}>
            {labelEl}
          </button>
        )}
        <span style={{ fontSize: 12, color: TX3, padding: '7px 4px 7px 0', flexShrink: 0 }}>{meta || count}</span>
        <button className="sb-btn" onClick={onToggle} aria-label={expanded ? tc('blog_index.sidebar_collapse') : tc('blog_index.sidebar_expand')} style={{ padding: '7px 10px', borderRadius: '0 8px 8px 0', color: TX3, display: 'flex', alignItems: 'center' }}>
          <ChevronIcon expanded={expanded}/>
        </button>
      </div>
    )
  }

  return (
    <aside style={{ minHeight: '100%', [isRTL ? 'borderLeft' : 'borderRight']: `1px solid ${BD}`, padding: '20px 0 32px' }}>
      <style>{`
        .sb-btn { cursor: pointer; border: none; background: transparent; transition: background 120ms; }
        .sb-btn:hover { background: ${HOVER} !important; }
        .sb-search { outline: none; }
        .sb-search:focus { border-color: ${ACC} !important; }
      `}</style>

      <div style={{ padding: '0 12px', marginBottom: 4 }}>
        <Link href={localePath('/blog', toLocale(lang))} className="sb-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 12px', borderRadius: 8, color: TX2, fontSize: 11, textDecoration: 'none' }}>
          <span>{tc('blog_index.sidebar_all_topics')}</span>
          <span style={{ fontSize: 12, color: TX3 }}>{totalCount}</span>
        </Link>
      </div>

      <div style={{ padding: '0 12px', marginBottom: 4 }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', [isRTL ? 'right' : 'left']: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="sb-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tc('blog_index.sidebar_search_placeholder')}
            style={{ width: '100%', boxSizing: 'border-box', padding: isRTL ? '6px 28px 6px 8px' : '6px 8px 6px 28px', fontSize: 11, color: TX, background: SF, border: `1px solid ${BD}`, borderRadius: 8 }}
          />
        </div>
      </div>

      <div style={{ height: 6 }} />

      {searchResults ? (
        <div style={{ padding: '0 12px' }}>
          {searchResults.length === 0 && <div style={{ fontSize: 11, color: TX3, padding: '6px 10px' }}>{tc('blog_index.no_results_for', { query: search })}</div>}
          {searchResults.map(leaf => <LeafRow key={leaf.cluster} leaf={leaf}/>)}
        </div>
      ) : (
        tree.map(node => {
          if (!isGroup(node)) {
            return <div key={node.cluster} style={{ padding: '0 12px' }}><LeafRow leaf={node}/></div>
          }
          const expanded = openKeys.has(node.key)
          return (
            <div key={node.key} style={{ padding: '0 12px' }}>
              <GroupHeader
                label={node.label}
                count={node.count}
                meta={node.key === 'regional-markets' ? `${node.count} · ${node.children.length}` : undefined}
                linkable={node.linkable}
                href={node.linkable ? groupHref(node.key) : undefined}
                expanded={expanded}
                onToggle={() => toggle(node.key)}
              />
              {expanded && (
                <div style={{ paddingLeft: 14, paddingTop: 2, paddingBottom: 4 }}>
                  {node.children.map(child => {
                    if (child.type === 'leaf') return <LeafRow key={child.cluster} leaf={child}/>
                    const subExpanded = openKeys.has(child.key)
                    return (
                      <div key={child.key}>
                        <GroupHeader
                          label={child.label}
                          count={child.count}
                          linkable={true}
                          href={groupHref(child.key)}
                          expanded={subExpanded}
                          onToggle={() => toggle(child.key)}
                        />
                        {subExpanded && (
                          <div style={{ paddingLeft: 14, paddingTop: 2, paddingBottom: 4 }}>
                            {(child as SidebarSubGroup).children.map(leaf => <LeafRow key={leaf.cluster} leaf={leaf}/>)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })
      )}
    </aside>
  )
}
