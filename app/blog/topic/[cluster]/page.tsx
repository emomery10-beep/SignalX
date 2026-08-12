import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, type BlogPost } from '@/lib/blog-content'
import { slugifyCluster, formatClusterName, buildClusterDescription, getSiblingClusters } from '@/lib/blog-taxonomy'
import TopicHubView from '../TopicHubView'

// ─────────────────────────────────────────────────────────────────────────────
// Hub page for a single blog cluster. Every cluster gets one of these —
// previously only 3 Global Trade Intelligence clusters had a real URL here
// and the other ~88 were reachable only via a client-side filter on /blog
// that never updated the address bar (uncrawlable, unbookmarkable). See the
// blog-sidebar-redesign audit for the full before/after.
// ─────────────────────────────────────────────────────────────────────────────

const CLUSTER_COLOURS: Record<string, { text: string; bg: string }> = {
  'US-China Tariffs':        { text: '#dc2626', bg: 'rgba(239,68,68,.1)' },
  'Supply Chain Disruption': { text: '#0f766e', bg: 'rgba(20,184,166,.1)' },
  'Trade Finance':           { text: '#16a34a', bg: 'rgba(34,197,94,.1)' },
  'Africa Informal Business':{ text: '#d08a59', bg: 'rgba(208,138,89,.1)' },
}

const TRADE_CLUSTERS = new Set(['US-China Tariffs', 'Supply Chain Disruption', 'Trade Finance'])

// Honest, grounded overviews for the topics worth a hand-written intro — no
// invented statistics or unverifiable claims. Everything else falls back to
// buildClusterDescription(), which is generated from real post data only.
const CLUSTER_INTRO: Record<string, string> = {
  'US-China Tariffs':
    'Section 301 and Section 232 tariffs, exclusion applications, HTS classification, duty drawback, bonded warehouses, and the compliance mechanics importers actually deal with when US-China trade policy shifts — from tariff engineering to UFLPA forced-labor restrictions and USMCA sourcing alternatives.',
  'Supply Chain Disruption':
    'Ocean and air freight rate volatility, container and port congestion, warehouse capacity, nearshoring, cold chain, and the inventory and logistics playbooks that keep goods moving when a lane, a carrier, or a supplier breaks down.',
  'Trade Finance':
    'Letters of credit, bank guarantees, documentary collections, factoring, forfaiting, trade credit insurance, and the working-capital and FX-risk instruments that fund a shipment between the purchase order and the customer\'s payment.',
  'Africa Informal Business':
    'Daily sales tracking, stock, and mobile-money reconciliation for kiosk owners, market stall traders, and roadside vendors across 25 African countries — built for Android phones vendors already carry, and for markets where electricity and data are not always reliable.',
}

const CLUSTER_BADGE: Record<string, string> = {
  'US-China Tariffs': 'Global Trade Intelligence',
  'Supply Chain Disruption': 'Global Trade Intelligence',
  'Trade Finance': 'Global Trade Intelligence',
  'Africa Informal Business': 'Africa Informal Business',
}

function getAllClusters(): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of getAllPosts()) {
    if (p.cluster && !seen.has(p.cluster)) { seen.add(p.cluster); out.push(p.cluster) }
  }
  return out
}

function resolveCluster(slug: string): string | undefined {
  return getAllClusters().find(c => slugifyCluster(c) === slug)
}

function getPostsForCluster(cluster: string): BlogPost[] {
  return getAllPosts()
    .filter(p => p.cluster === cluster)
    .sort((a, b) => a.title.localeCompare(b.title))
}

function getDescription(cluster: string, posts: BlogPost[]): string {
  return CLUSTER_INTRO[cluster] || buildClusterDescription(cluster, posts)
}

export async function generateStaticParams() {
  return getAllClusters().map(c => ({ cluster: slugifyCluster(c) }))
}

export async function generateMetadata({ params }: { params: { cluster: string } }): Promise<Metadata> {
  const cluster = resolveCluster(params.cluster)
  if (!cluster) return {}
  const posts = getPostsForCluster(cluster)
  const label = formatClusterName(cluster)
  const title = `${label} — Business Intelligence Guide | AskBiz`
  const fullIntro = getDescription(cluster, posts)
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

export default function ClusterHubPage({ params }: { params: { cluster: string } }) {
  const cluster = resolveCluster(params.cluster)
  if (!cluster) notFound()

  const allPosts = getAllPosts()
  const posts = getPostsForCluster(cluster)
  const label = formatClusterName(cluster)
  const colour = CLUSTER_COLOURS[cluster]
  const badge = CLUSTER_BADGE[cluster] || 'AskBiz Blog'
  const sibling = getSiblingClusters(cluster, getAllClusters())

  return (
    <TopicHubView
      breadcrumbLabel={label}
      badge={badge}
      title={label}
      description={getDescription(cluster, posts)}
      posts={posts}
      allPostsForSidebar={allPosts}
      activeSlug={params.cluster}
      colour={colour}
      thirdStatLabel="related topics"
      thirdStatValue={sibling?.siblings.length || 0}
      siblingSectionTitle={
        TRADE_CLUSTERS.has(cluster) ? 'Other trade intelligence topics'
        : sibling ? `Other ${sibling.groupLabel} topics`
        : undefined
      }
      siblingLinks={
        TRADE_CLUSTERS.has(cluster)
          ? [...TRADE_CLUSTERS].filter(c => c !== cluster).map(c => ({ label: c, href: `/blog/topic/${slugifyCluster(c)}`, count: getPostsForCluster(c).length }))
          : sibling?.siblings.map(c => ({ label: formatClusterName(c), href: `/blog/topic/${slugifyCluster(c)}`, count: getPostsForCluster(c).length }))
      }
      canonicalUrl={`https://askbiz.co/blog/topic/${params.cluster}`}
      jsonLdName={`${label} — AskBiz Business Intelligence Hub`}
    />
  )
}
