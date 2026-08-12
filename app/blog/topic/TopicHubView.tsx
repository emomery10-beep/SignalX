import Link from 'next/link'
import BlogSidebar from '../BlogSidebar'
import type { BlogPost } from '@/lib/blog-content'

// ─────────────────────────────────────────────────────────────────────────────
// Shared render for every topic/group hub page — the spoke-linking pillar
// page in the hub-and-spoke model. Originally hand-built for just the 3
// Global Trade Intelligence clusters (see git history on this file's
// predecessor); generalized so every cluster and every region/industry
// rollup gets the same real, crawlable, schema-carrying page instead of
// only being reachable through a client-side filter on /blog.
// ─────────────────────────────────────────────────────────────────────────────

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B   = 'rgba(0,0,0,.08)'

export interface TopicHubViewProps {
  breadcrumbLabel: string
  badge: string
  title: string
  description: string
  posts: BlogPost[]
  allPostsForSidebar: BlogPost[]
  activeSlug: string
  colour?: { text: string; bg: string }
  thirdStatLabel: string
  thirdStatValue: number
  siblingSectionTitle?: string
  siblingLinks?: { label: string; href: string; count: number }[]
  canonicalUrl: string
  jsonLdName: string
}

export default function TopicHubView({
  breadcrumbLabel, badge, title, description, posts, allPostsForSidebar, activeSlug,
  colour, thirdStatLabel, thirdStatValue, siblingSectionTitle, siblingLinks, canonicalUrl, jsonLdName,
}: TopicHubViewProps) {
  const c = colour || { text: ACC, bg: 'rgba(208,138,89,.1)' }
  const totalMinutes = posts.reduce((sum, p) => sum + (p.readTime || 0), 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: jsonLdName,
    description,
    url: canonicalUrl,
    hasPart: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://askbiz.co/blog/${p.slug}`,
        name: p.title,
      })),
    },
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'var(--font-dm, DM Sans, sans-serif)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        .hub-card { transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease; cursor: pointer; }
        .hub-card:hover { border-color: ${c.text}55; box-shadow: 0 4px 16px rgba(0,0,0,.06); transform: translateY(-1px); }
        .hub-card:hover .hub-card-arrow { opacity: 1; transform: translateX(0); }
        .hub-card-arrow { opacity: 0; transform: translateX(-4px); transition: opacity 200ms ease, transform 200ms ease; }
        @media (prefers-reduced-motion: reduce) { .hub-card, .hub-card-arrow { transition: none; } }
        .hub-layout { max-width: 1260px; margin: 0 auto; display: grid; grid-template-columns: 244px 1fr; align-items: start; }
        @media (max-width: 860px) { .hub-layout { grid-template-columns: 1fr; } .hub-sidebar-col { display: none; } }
      `}</style>

      <div className="hub-layout">
        <div className="hub-sidebar-col">
          <BlogSidebar posts={allPostsForSidebar} totalCount={allPostsForSidebar.length} activeSlug={activeSlug} />
        </div>

        <div style={{ padding: '48px 20px 80px', maxWidth: 860 }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 11, color: TX3, marginBottom: 24 }}>
            <Link href="/" style={{ color: TX3, textDecoration: 'none' }}>Home</Link>
            {' / '}
            <Link href="/blog" style={{ color: TX3, textDecoration: 'none' }}>Blog</Link>
            {' / '}
            <span style={{ color: TX2 }}>{breadcrumbLabel}</span>
          </nav>

          <span style={{
            display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '4px 12px',
            borderRadius: 9999, color: c.text, background: c.bg, marginBottom: 14,
          }}>
            {badge}
          </span>

          <h1 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-.02em', color: TX, marginBottom: 14 }}>
            {title}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: TX2, maxWidth: 640, marginBottom: 24 }}>
            {description}
          </p>

          <div style={{ display: 'flex', gap: 28, paddingBottom: 24, marginBottom: 32, borderBottom: `1px solid ${B}`, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: TX, fontFamily: 'var(--font-sora, Sora)' }}>{posts.length}</div>
              <div style={{ fontSize: 10, color: TX3 }}>guides</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: TX, fontFamily: 'var(--font-sora, Sora)' }}>{totalMinutes}</div>
              <div style={{ fontSize: 10, color: TX3 }}>min total reading</div>
            </div>
            {thirdStatValue > 0 && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: c.text, fontFamily: 'var(--font-sora, Sora)' }}>{thirdStatValue}</div>
                <div style={{ fontSize: 10, color: TX3 }}>{thirdStatLabel}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map((p, i) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="hub-card" style={{
                display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px', borderRadius: 12,
                border: `1px solid ${B}`, background: SF, textDecoration: 'none',
              }}>
                <span style={{
                  flexShrink: 0, fontSize: 10, fontWeight: 700, color: TX3, background: BG,
                  width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 4, lineHeight: 1.4 }}>{p.title}</h3>
                  <p style={{ fontSize: 12, color: TX2, lineHeight: 1.5, margin: 0 }}>{p.tldr}</p>
                  <span style={{ fontSize: 10, color: TX3, marginTop: 6, display: 'inline-block' }}>{p.readTime} min read</span>
                </div>
                <span className="hub-card-arrow" style={{ flexShrink: 0, color: c.text, fontSize: 16, marginTop: 2 }} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          {siblingLinks && siblingLinks.length > 0 && (
            <>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 48, marginBottom: 14 }}>
                {siblingSectionTitle}
              </h2>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {siblingLinks.map(s => (
                  <Link key={s.href} href={s.href} className="hub-card" style={{
                    fontSize: 11, fontWeight: 600, color: c.text, textDecoration: 'none',
                    padding: '10px 16px', borderRadius: 9999, border: `1px solid ${B}`, background: SF,
                  }}>
                    {s.label} <span style={{ color: TX3, fontWeight: 400 }}>({s.count})</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
