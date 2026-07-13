import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, type BlogPost } from '@/lib/blog-content'

// ─────────────────────────────────────────────────────────────────────────────
// Hub page for a Global Trade Intelligence cluster — the pillar page in the
// hub-and-spoke model. Each of the 63 canonical trade-news articles (the
// spokes) links back here via its cluster; this page links out to all of
// them. Built alongside the 5,830 -> 63 article consolidation so the
// remaining articles have a real, crawlable, unique-URL hub instead of only
// a query-param filter on /blog.
// ─────────────────────────────────────────────────────────────────────────────

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B   = 'rgba(0,0,0,.08)'

const CLUSTER_COLOURS: Record<string, { text: string; bg: string }> = {
  'US-China Tariffs':        { text: '#dc2626', bg: 'rgba(239,68,68,.1)' },
  'Supply Chain Disruption': { text: '#0f766e', bg: 'rgba(20,184,166,.1)' },
  'Trade Finance':           { text: '#16a34a', bg: 'rgba(34,197,94,.1)' },
}

function slugifyCluster(cluster: string): string {
  return cluster.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
}

const CLUSTERS = ['US-China Tariffs', 'Supply Chain Disruption', 'Trade Finance']

// Honest, grounded overviews — describe what the cluster actually covers,
// no invented statistics or unverifiable claims.
const CLUSTER_INTRO: Record<string, string> = {
  'US-China Tariffs':
    'Section 301 and Section 232 tariffs, exclusion applications, HTS classification, duty drawback, bonded warehouses, and the compliance mechanics importers actually deal with when US-China trade policy shifts — from tariff engineering to UFLPA forced-labor restrictions and USMCA sourcing alternatives.',
  'Supply Chain Disruption':
    'Ocean and air freight rate volatility, container and port congestion, warehouse capacity, nearshoring, cold chain, and the inventory and logistics playbooks that keep goods moving when a lane, a carrier, or a supplier breaks down.',
  'Trade Finance':
    'Letters of credit, bank guarantees, documentary collections, factoring, forfaiting, trade credit insurance, and the working-capital and FX-risk instruments that fund a shipment between the purchase order and the customer\'s payment.',
}

function getPostsForCluster(cluster: string): BlogPost[] {
  return getAllPosts()
    .filter(p => p.cluster === cluster)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export async function generateStaticParams() {
  return CLUSTERS.map(c => ({ cluster: slugifyCluster(c) }))
}

export async function generateMetadata({ params }: { params: { cluster: string } }): Promise<Metadata> {
  const cluster = CLUSTERS.find(c => slugifyCluster(c) === params.cluster)
  if (!cluster) return {}
  const posts = getPostsForCluster(cluster)
  const title = `${cluster} — Trade Intelligence Guide | AskBiz`
  const fullIntro = CLUSTER_INTRO[cluster]
  const description = fullIntro.length <= 160
    ? fullIntro
    : fullIntro.slice(0, fullIntro.slice(0, 157).lastIndexOf(' ')) + '…'
  return {
    title,
    description,
    alternates: { canonical: `https://askbiz.co/blog/topic/${params.cluster}` },
    openGraph: { title, description, type: 'website', url: `https://askbiz.co/blog/topic/${params.cluster}` },
    twitter: { card: 'summary', title, description },
    other: { 'article-count': String(posts.length) },
  }
}

export default function TradeClusterHubPage({ params }: { params: { cluster: string } }) {
  const cluster = CLUSTERS.find(c => slugifyCluster(c) === params.cluster)
  if (!cluster) notFound()

  const posts = getPostsForCluster(cluster)
  const colour = CLUSTER_COLOURS[cluster] || { text: ACC, bg: 'rgba(208,138,89,.1)' }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cluster} — Global Trade Intelligence`,
    description: CLUSTER_INTRO[cluster],
    url: `https://askbiz.co/blog/topic/${params.cluster}`,
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

  const totalMinutes = posts.reduce((sum, p) => sum + (p.readTime || 0), 0)

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'var(--font-dm, DM Sans, sans-serif)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        .hub-card { transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease; cursor: pointer; }
        .hub-card:hover { border-color: ${colour.text}55; box-shadow: 0 4px 16px rgba(0,0,0,.06); transform: translateY(-1px); }
        .hub-card:hover .hub-card-arrow { opacity: 1; transform: translateX(0); }
        .hub-card-arrow { opacity: 0; transform: translateX(-4px); transition: opacity 200ms ease, transform 200ms ease; }
        @media (prefers-reduced-motion: reduce) {
          .hub-card, .hub-card-arrow { transition: none; }
        }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px 80px' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 11, color: TX3, marginBottom: 24 }}>
          <Link href="/" style={{ color: TX3, textDecoration: 'none' }}>Home</Link>
          {' / '}
          <Link href="/blog" style={{ color: TX3, textDecoration: 'none' }}>Blog</Link>
          {' / '}
          <span style={{ color: TX2 }}>{cluster}</span>
        </nav>

        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '4px 12px',
          borderRadius: 9999, color: colour.text, background: colour.bg, marginBottom: 14,
        }}>
          Global Trade Intelligence
        </span>

        <h1 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-.02em', color: TX, marginBottom: 14 }}>
          {cluster}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: TX2, maxWidth: 640, marginBottom: 24 }}>
          {CLUSTER_INTRO[cluster]}
        </p>

        {/* Stats bar — replaces the plain "N guides" caption with a scannable summary */}
        <div style={{ display: 'flex', gap: 28, paddingBottom: 24, marginBottom: 32, borderBottom: `1px solid ${B}`, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: TX, fontFamily: 'var(--font-sora, Sora)' }}>{posts.length}</div>
            <div style={{ fontSize: 10, color: TX3 }}>guides</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: TX, fontFamily: 'var(--font-sora, Sora)' }}>{totalMinutes}</div>
            <div style={{ fontSize: 10, color: TX3 }}>min total reading</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colour.text, fontFamily: 'var(--font-sora, Sora)' }}>3</div>
            <div style={{ fontSize: 10, color: TX3 }}>trade topics covered</div>
          </div>
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
              <span className="hub-card-arrow" style={{ flexShrink: 0, color: colour.text, fontSize: 16, marginTop: 2 }} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        <h2 style={{ fontSize: 12, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 48, marginBottom: 14 }}>
          Other trade intelligence topics
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {CLUSTERS.filter(c => c !== cluster).map(c => (
            <Link key={c} href={`/blog/topic/${slugifyCluster(c)}`} className="hub-card" style={{
              fontSize: 11, fontWeight: 600, color: (CLUSTER_COLOURS[c] || { text: ACC }).text, textDecoration: 'none',
              padding: '10px 16px', borderRadius: 9999, border: `1px solid ${B}`, background: SF,
            }}>
              {c} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
