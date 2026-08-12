// ============================================================
// AskBiz Blog Taxonomy
// ============================================================
// Single source of truth for turning the flat, unstructured `cluster`
// string on every BlogPost into:
//   1. a navigable sidebar tree (flagship + big standalone topics +
//      grouped regional/industry long-tail, instead of ~91 flat rows)
//   2. real per-cluster and per-group URLs the crawler can index
//   3. human-readable labels for clusters that were stored as raw
//      kebab-case slugs (e.g. "digital-marketing-roi")
//
// Deliberately does NOT touch the stored `cluster`/`pillar` values on
// any post — everything here is a read-only, display-time transform,
// so it's safe to change without migrating the 47 static content files
// or the 6 live cron "scout" agents that keep writing new posts.
// ============================================================

import type { BlogPost } from './blog-content'

// ── Slug + label helpers ─────────────────────────────────────────────────────

/** Must stay byte-identical to the slugifier every topic URL was built with. */
export function slugifyCluster(cluster: string): string {
  return cluster.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
}

const ACRONYMS = new Set(['roi', 'seo', 'pos', 'b2b', 'crm', 'erp', 'ai', 'ux', 'ui', 'faq', 'api', 'vat', 'kra', 'fx', 'cta'])
const EXPANSIONS: Record<string, string> = { cust: 'Customer', exp: 'Experience', mgmt: 'Management', ops: 'Operations' }
const SMALL_WORDS = new Set(['and', 'or', 'the', 'a', 'an', 'of', 'to', 'for', 'in', 'on'])

/**
 * Several source files stored the cluster as a raw kebab-case slug instead
 * of a display name (e.g. "factory-manufacturing-ops"). Humanize those;
 * leave anything already written as a normal name untouched.
 */
export function formatClusterName(cluster: string): string {
  const trimmed = cluster.trim()
  const looksLikeSlug = /^[a-z0-9]+(-[a-z0-9]+)+$/.test(trimmed)
  if (!looksLikeSlug) return trimmed
  return trimmed
    .split('-')
    .map((w, i) => {
      const lower = w.toLowerCase()
      if (EXPANSIONS[lower]) return EXPANSIONS[lower]
      if (ACRONYMS.has(lower)) return lower.toUpperCase()
      if (i > 0 && SMALL_WORDS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

// ── Grouping rules ────────────────────────────────────────────────────────────

/** Clusters at or above this article count get their own standalone sidebar
 *  row and never get folded into a region/industry rollup — they're already
 *  substantial enough to stand on their own. */
export const STANDALONE_THRESHOLD = 15

export const FLAGSHIP_CLUSTERS = new Set(['Africa Informal Business'])

export interface RegionDef { key: string; label: string; test: RegExp }

// Longest/most-specific patterns first. Only covers regions actually seen in
// the static content files or the 6 live scout agents' source; an unrecognised
// future region simply falls through to the "More topics" catch-all instead
// of being mis-bucketed — never silently dropped.
export const REGION_GROUPS: RegionDef[] = [
  { key: 'asean',          label: 'ASEAN',           test: /^ASEAN\b/i },
  { key: 'uk',              label: 'United Kingdom',  test: /^UK\b/i },
  { key: 'singapore',       label: 'Singapore',       test: /^Singapore\b/i },
  { key: 'east-africa',     label: 'East Africa',     test: /^East Africa\b/i },
  { key: 'west-africa',     label: 'West Africa',     test: /^West Africa\b/i },
  { key: 'south-africa',    label: 'South Africa',    test: /^South Africa\b/i },
  { key: 'nigeria',         label: 'Nigeria',         test: /^Nigeria\b/i },
  { key: 'kenya',           label: 'Kenya',           test: /^Kenya\b/i },
  // Negative lookahead keeps "US-China Tariffs" (a standalone trade cluster,
  // already above STANDALONE_THRESHOLD) out of the "United States" bucket.
  { key: 'united-states',   label: 'United States',   test: /^US(?!-China)\b/i },
]

export interface IndustryDef { key: string; label: string; test: RegExp }

export const INDUSTRY_GROUPS: IndustryDef[] = [
  { key: 'repair-services', label: 'Repair & field service', test: /^repair-shop-/i },
]

export type SidebarLeaf = { type: 'leaf'; cluster: string; slug: string; label: string; count: number; flagship?: boolean }
export type SidebarSubGroup = { type: 'subgroup'; key: string; label: string; count: number; children: SidebarLeaf[] }
export type SidebarGroup = { type: 'group'; key: string; label: string; count: number; linkable: boolean; children: (SidebarLeaf | SidebarSubGroup)[] }
export type SidebarNode = SidebarLeaf | SidebarGroup

export function getClusterCounts(posts: { cluster: string }[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const p of posts) {
    if (!p.cluster) continue
    counts[p.cluster] = (counts[p.cluster] || 0) + 1
  }
  return counts
}

function toLeaf(cluster: string, count: number): SidebarLeaf {
  return { type: 'leaf', cluster, slug: slugifyCluster(cluster), label: formatClusterName(cluster), count, flagship: FLAGSHIP_CLUSTERS.has(cluster) }
}

/**
 * The single function that decides the whole sidebar shape. Same rules
 * drive the sitemap and the hub-page "sibling topics" cross-links, so the
 * three never drift out of sync with each other.
 */
export function buildSidebarTree(clusterCounts: Record<string, number>): SidebarNode[] {
  const standalone: SidebarLeaf[] = []
  const regionBuckets = new Map<string, SidebarLeaf[]>()
  const industryBuckets = new Map<string, SidebarLeaf[]>()
  const more: SidebarLeaf[] = []

  for (const [cluster, count] of Object.entries(clusterCounts)) {
    const leaf = toLeaf(cluster, count)

    if (leaf.flagship || count >= STANDALONE_THRESHOLD) {
      standalone.push(leaf)
      continue
    }
    const region = REGION_GROUPS.find(r => r.test.test(cluster))
    if (region) {
      if (!regionBuckets.has(region.key)) regionBuckets.set(region.key, [])
      regionBuckets.get(region.key)!.push(leaf)
      continue
    }
    const industry = INDUSTRY_GROUPS.find(r => r.test.test(cluster))
    if (industry) {
      if (!industryBuckets.has(industry.key)) industryBuckets.set(industry.key, [])
      industryBuckets.get(industry.key)!.push(leaf)
      continue
    }
    more.push(leaf)
  }

  standalone.sort((a, b) => (b.flagship ? 1 : 0) - (a.flagship ? 1 : 0) || b.count - a.count)
  more.sort((a, b) => b.count - a.count)

  const nodes: SidebarNode[] = [...standalone]

  if (regionBuckets.size > 0) {
    const subgroups: SidebarSubGroup[] = REGION_GROUPS
      .filter(r => regionBuckets.has(r.key))
      .map(r => {
        const children = regionBuckets.get(r.key)!.sort((a, b) => b.count - a.count)
        return { type: 'subgroup' as const, key: r.key, label: r.label, count: children.reduce((s, c) => s + c.count, 0), children }
      })
      .sort((a, b) => b.count - a.count)
    nodes.push({
      type: 'group', key: 'regional-markets', label: 'Regional markets', linkable: false,
      count: subgroups.reduce((s, g) => s + g.count, 0), children: subgroups,
    })
  }

  for (const industry of INDUSTRY_GROUPS) {
    const items = industryBuckets.get(industry.key)
    if (!items || items.length === 0) continue
    items.sort((a, b) => b.count - a.count)
    nodes.push({ type: 'group', key: industry.key, label: industry.label, linkable: true, count: items.reduce((s, c) => s + c.count, 0), children: items })
  }

  if (more.length > 0) {
    nodes.push({ type: 'group', key: 'more-topics', label: 'More topics', linkable: false, count: more.reduce((s, c) => s + c.count, 0), children: more })
  }

  return nodes
}

// ── Region / industry post lookups (for the aggregate hub pages) ─────────────

export function getRegionDef(key: string): RegionDef | undefined {
  return REGION_GROUPS.find(r => r.key === key)
}

export function getIndustryDef(key: string): IndustryDef | undefined {
  return INDUSTRY_GROUPS.find(r => r.key === key)
}

export function getPostsForRegion(posts: BlogPost[], regionKey: string): BlogPost[] {
  const region = getRegionDef(regionKey)
  if (!region) return []
  return posts.filter(p => region.test.test(p.cluster))
}

export function getPostsForIndustry(posts: BlogPost[], industryKey: string): BlogPost[] {
  const industry = getIndustryDef(industryKey)
  if (!industry) return []
  return posts.filter(p => industry.test.test(p.cluster))
}

/** Sibling cluster names within the same region/industry bucket, for the
 *  "other topics in this group" cross-link section on a cluster hub page. */
export function getSiblingClusters(cluster: string, allClusters: string[]): { groupLabel: string; siblings: string[] } | null {
  const region = REGION_GROUPS.find(r => r.test.test(cluster))
  if (region) {
    return { groupLabel: region.label, siblings: allClusters.filter(c => c !== cluster && region.test.test(c)) }
  }
  const industry = INDUSTRY_GROUPS.find(r => r.test.test(cluster))
  if (industry) {
    return { groupLabel: industry.label, siblings: allClusters.filter(c => c !== cluster && industry.test.test(c)) }
  }
  return null
}

// ── Factual, non-fabricated descriptions for clusters/groups without a
//    hand-written intro ────────────────────────────────────────────────────

/** Lowercase for mid-sentence flow, but keep existing acronyms (ASEAN, UK, ROI…) shouting. */
function lowercaseExceptAcronyms(label: string): string {
  return label.split(' ').map(w => (/^[A-Z0-9]{2,}$/.test(w) ? w : w.toLowerCase())).join(' ')
}

export function buildClusterDescription(cluster: string, posts: { pillar?: string }[]): string {
  const label = formatClusterName(cluster)
  const lowered = lowercaseExceptAcronyms(label)
  const n = posts.length
  const guideWord = n === 1 ? 'guide' : 'guides'
  const pillars = Array.from(new Set(
    posts.map(p => p.pillar).filter((p): p is string => !!p && p.toLowerCase() !== 'emerging markets' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p))
  )).slice(0, 3)
  if (pillars.length > 0) {
    return `${n} AskBiz ${guideWord} on ${lowered}, covering ${pillars.join(', ')} and related operating decisions for SME founders.`
  }
  return `${n} AskBiz ${guideWord} on ${lowered} — practical, operator-focused guidance for SME founders.`
}

export function buildGroupDescription(label: string, clusterCount: number, postCount: number): string {
  const topicWord = clusterCount === 1 ? 'topic' : 'topics'
  return `${postCount} AskBiz guides on ${label} business operations, organized across ${clusterCount} ${topicWord}.`
}

// ── Africa Informal Business: best-effort country grouping ───────────────────
// Not a stored field (see audit) — derived from title text at render time,
// display-only, never used as a canonical identifier.

export const AFRICA_INFORMAL_COUNTRIES = [
  'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Senegal', "Côte d'Ivoire", 'Cameroon', 'Zambia',
  'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'Egypt', 'Morocco', 'Algeria',
  'Tunisia', 'DR Congo', 'Sierra Leone', 'Benin', 'Togo', 'Angola', 'Mali', 'Burkina Faso', 'Madagascar',
]

export function matchCountry(title: string): string | null {
  if (/\bcote d.ivoire\b|\bivory coast\b/i.test(title)) return "Côte d'Ivoire"
  if (/\bdr congo\b|\bdemocratic republic of congo\b/i.test(title)) return 'DR Congo'
  for (const c of AFRICA_INFORMAL_COUNTRIES) {
    if (c === "Côte d'Ivoire" || c === 'DR Congo') continue
    if (new RegExp(`\\b${c}\\b`, 'i').test(title)) return c
  }
  return null
}
