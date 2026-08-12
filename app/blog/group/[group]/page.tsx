import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts } from '@/lib/blog-content'
import {
  REGION_GROUPS, INDUSTRY_GROUPS, getRegionDef, getIndustryDef,
  getPostsForRegion, getPostsForIndustry, buildGroupDescription,
  slugifyCluster, formatClusterName,
} from '@/lib/blog-taxonomy'
import TopicHubView from '../../topic/TopicHubView'

// ─────────────────────────────────────────────────────────────────────────────
// Aggregate hub page for a region (ASEAN, United Kingdom, Singapore, ...) or
// an industry vertical (Repair & field service). These consolidate the
// long tail of 1-3-article clusters (e.g. 14 separate "ASEAN X" clusters)
// into one real page with real topical depth, instead of leaving each as an
// orphaned single-article page competing with its own siblings for the same
// search intent. Every individual cluster still gets its own page too (see
// app/blog/topic/[cluster]) — this page is the concentrated entry point that
// links out to all of them.
// ─────────────────────────────────────────────────────────────────────────────

function allGroupKeys(): string[] {
  return [...REGION_GROUPS.map(r => r.key), ...INDUSTRY_GROUPS.map(i => i.key)]
}

function resolveGroup(key: string) {
  const region = getRegionDef(key)
  if (region) return { kind: 'region' as const, key: region.key, label: region.label }
  const industry = getIndustryDef(key)
  if (industry) return { kind: 'industry' as const, key: industry.key, label: industry.label }
  return null
}

function getPostsForGroup(kind: 'region' | 'industry', key: string) {
  const all = getAllPosts()
  return kind === 'region' ? getPostsForRegion(all, key) : getPostsForIndustry(all, key)
}

export async function generateStaticParams() {
  return allGroupKeys().map(group => ({ group }))
}

export async function generateMetadata({ params }: { params: { group: string } }): Promise<Metadata> {
  const group = resolveGroup(params.group)
  if (!group) return {}
  const posts = getPostsForGroup(group.kind, group.key)
  const clusterCount = new Set(posts.map(p => p.cluster)).size
  const title = `${group.label} — Business Intelligence Guides | AskBiz`
  const description = buildGroupDescription(group.label, clusterCount, posts.length)
  return {
    title,
    description,
    alternates: { canonical: `https://askbiz.co/blog/group/${params.group}` },
    openGraph: { title, description, type: 'website', url: `https://askbiz.co/blog/group/${params.group}` },
    twitter: { card: 'summary', title, description },
    other: { 'article-count': String(posts.length) },
  }
}

export default function GroupHubPage({ params }: { params: { group: string } }) {
  const group = resolveGroup(params.group)
  if (!group) notFound()

  const allPosts = getAllPosts()
  const posts = getPostsForGroup(group.kind, group.key)
  if (posts.length === 0) notFound()

  const clusters = Array.from(new Set(posts.map(p => p.cluster))).sort((a, b) => {
    const countA = posts.filter(p => p.cluster === a).length
    const countB = posts.filter(p => p.cluster === b).length
    return countB - countA
  })
  const clusterCount = clusters.length
  const badge = group.kind === 'region' ? 'Regional markets' : 'By industry'

  return (
    <TopicHubView
      breadcrumbLabel={group.label}
      badge={badge}
      title={group.label}
      description={buildGroupDescription(group.label, clusterCount, posts.length)}
      posts={posts.sort((a, b) => a.title.localeCompare(b.title))}
      allPostsForSidebar={allPosts}
      activeSlug={group.key}
      thirdStatLabel="topics covered"
      thirdStatValue={clusterCount}
      siblingSectionTitle={`Topics within ${group.label}`}
      siblingLinks={clusters.map(c => ({
        label: formatClusterName(c),
        href: `/blog/topic/${slugifyCluster(c)}`,
        count: posts.filter(p => p.cluster === c).length,
      }))}
      canonicalUrl={`https://askbiz.co/blog/group/${params.group}`}
      jsonLdName={`${group.label} — AskBiz Business Intelligence Hub`}
    />
  )
}
