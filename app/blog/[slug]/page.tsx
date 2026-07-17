import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getPost, getAllPosts, type BlogPost } from '@/lib/blog-content'
import { academyArticles } from '@/lib/academy-content'
import { createClient } from '@supabase/supabase-js'
import { TRADE_NEWS_REDIRECTS } from '@/lib/trade-news-redirects'
import BlogPostView from './BlogPostView'

export const dynamicParams = true
// ISR: with generateStaticParams() forced empty below (~3,000+ posts would OOM
// the build otherwise), every first-touch request goes through Next's on-demand
// static-generation fallback and is then cached per `revalidate`. This used to
// crash every such request with "Page changed from static to dynamic at runtime,
// reason: headers" even though nothing here calls headers()/cookies(). Root
// cause: app/not-found.tsx (the root 404 boundary) called headers() indirectly
// via getLocale()/getT(), and Next.js renders the root not-found.tsx on *every*
// request — not just 404s — because it's passed as the NotFoundBoundary's
// fallback prop, which a Client Component can't lazily invoke a Server Component
// to produce on demand. That made every route in the app look like it used a
// dynamic API; it only hard-crashed here because this route's on-demand fallback
// is the one path that actually compares runtime behaviour against the route's
// static/ISR classification. Fixed by hardcoding not-found.tsx's locale instead
// of reading it from headers() (see that file's comment).
export const revalidate = 3600

async function getPostWithFallback(slug: string): Promise<BlogPost | null> {
  const staticPost = getPost(slug)
  if (staticPost) return staticPost

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Use JSONB containment operator (@>) — more reliable than content->>slug text filter
    const { data, error } = await supabase
      .from('agent_content')
      .select('content, created_at')
      .eq('type', 'blog')
      .eq('status', 'published')
      .contains('content', { slug })
      .maybeSingle()

    if (error || !data) {
      // Fallback: filter by slug cast — avoids fetching all 500+ posts
      const { data: row } = await supabase
        .from('agent_content')
        .select('content, created_at')
        .eq('type', 'blog')
        .eq('status', 'published')
        .eq('content->>slug', slug)
        .maybeSingle()
      if (!row) return null
      return {
        ...row.content,
        publishDate: row.content.publishDate || row.created_at?.slice(0, 10),
      }
    }

    return {
      ...data.content,
      publishDate: data.content.publishDate || data.created_at?.slice(0, 10),
    }
  } catch {
    return null
  }
}

const BASE = 'https://askbiz.co'

// ── Meta description enhancer ────────────────────────────────────────────────
// Transforms plain article descriptions into click-worthy SERP hooks
function enhanceMetaDescription(post: { title: string; metaDescription: string; cluster: string; pillar?: string; readTime: number }): string {
  const t = post.title.toLowerCase()
  const d = post.metaDescription
  const cluster = post.cluster || ''

  // If description already has a hook (question, number, stat), keep it
  if (/^\d|how |why |what if|most |stop |never |always |the \d|[£$€]\d|\d%/.test(d.toLowerCase())) return d

  // Content-type specific hooks
  if (t.includes(' vs ') || t.includes('versus')) {
    return `${d} Compare side-by-side and decide which works for your business.`
  }
  if (t.includes('how to')) {
    return `Step-by-step: ${d} Takes under ${post.readTime} minutes to read.`
  }
  if (t.includes('what is') || t.includes('what are')) {
    return `${d} Plain-English explanation with real business examples.`
  }

  // Cluster-specific suffixes that create urgency or curiosity
  const clusterHook: Record<string, string> = {
    'Financial Intelligence':    'Most SMEs get this wrong — here\'s how to fix it.',
    'eCommerce Intelligence':    'See how top African eCommerce sellers use this to grow.',
    'Inventory & Supply Chain':  'Get this right and you\'ll cut costs immediately.',
    'Marketing Intelligence':    'The data-backed approach most marketers ignore.',
    'Business Strategy':         'The framework used by fast-growing African SMEs.',
    'Global Trade Intelligence': 'Critical for any business operating across African borders.',
    'Startup Growth':            'Actionable — not theory. Read time: under ' + post.readTime + ' mins.',
    'AI Chief of Staff':         'How AI is changing this for SME operators right now.',
    'Fintech — Pan-African':     'What every African business owner needs to know.',
    'Logistics — West Africa':   'Practical guide for operators across West Africa.',
    'Agribusiness — East Africa':'Data-driven insights for East African agribusiness.',
    'Energy — Off-Grid & Renewable': 'The opportunity most African investors are missing.',
  }

  const suffix = clusterHook[cluster] || 'Practical guide with actionable takeaways.'
  const combined = `${d} ${suffix}`
  // Hooks are appended blind to the base description's length, so long posts
  // can push well past the ~160-char SEO meta description budget — cap it.
  if (combined.length <= 160) return combined
  const cut = combined.slice(0, 157)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
}

// Deterministic hash → unique display date spread across past 365 days
function hashDaysAgo(slug: string): number {
  let h = 5381
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) + h) + slug.charCodeAt(i)
    h = h & h
  }
  return Math.abs(h) % 330 + 14 // 14 to 344 days ago
}

// ── Static generation ────────────────────────────────────────────────────────
// Return empty array — pre-rendering all posts at build time causes OOM on
// Vercel's 8 GB build machine because blog-content.ts imports hundreds of batch
// files (~3,000+ posts total). Posts render on first request instead and are
// then cached per `revalidate` above (on-demand ISR via `dynamicParams`).
export async function generateStaticParams() {
  return []
}

// ── Per-post metadata ────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPostWithFallback(params.slug)
  if (!post) return { title: 'Article not found | AskBiz Blog' }

  const url = `${BASE}/blog/${post.slug}`
  const published = new Date(post.publishDate).toISOString()

  const alternateLanguages: Record<string, string> = {}
  post.i18n?.hreflang.forEach(h => { alternateLanguages[h.lang] = h.url })

  const enhancedDesc = enhanceMetaDescription(post)

  // AI-generated headlines run long; only add the brand suffix when it still
  // fits the ~60-char SEO title budget, otherwise ship the bare headline.
  const titleSuffix = ' | AskBiz Blog'
  const seoTitle = post.title.length + titleSuffix.length <= 62 ? post.title + titleSuffix : post.title

  return {
    title: seoTitle,
    description: enhancedDesc,
    openGraph: {
      title: post.title,
      description: enhancedDesc,
      url,
      type: 'article',
      publishedTime: published,
      authors: [post.author?.name || 'AskBiz'],
      tags: [post.cluster, post.pillar].filter(Boolean),
      siteName: 'AskBiz',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: enhancedDesc,
      site: '@askbizco',
    },
    alternates: {
      canonical: url,
      ...(Object.keys(alternateLanguages).length > 0 && { languages: alternateLanguages }),
      types: { 'application/rss+xml': `${BASE}/rss.xml` },
    },
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostWithFallback(params.slug)

  if (!post) {
    // Old trade-news-batch* slug from the pre-consolidation era (5,830 URLs
    // -> 63 canonical articles) — send crawlers/visitors to the live article
    // instead of a dead end, so accumulated link equity isn't lost.
    const canonicalSlug = TRADE_NEWS_REDIRECTS[params.slug]
    if (canonicalSlug) permanentRedirect(`/blog/${canonicalSlug}`)
    notFound()
  }

  const allPosts       = getAllPosts()
  const currentIndex  = allPosts.findIndex(p => p.slug === post.slug)
  const prevPost      = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost      = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  // Related posts: use relatedSlugs if available, otherwise fall back to same-cluster articles
  const _explicitRelated = (post.relatedSlugs || [])
    .map(s => allPosts.find(p => p?.slug === s))
    .filter(Boolean)
    .slice(0, 3)
  const _clusterFallback = _explicitRelated.length > 0 ? [] : allPosts
    .filter(p => p.cluster === post.cluster && p.slug !== post.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)
  const relatedPosts = _explicitRelated.length > 0 ? _explicitRelated : _clusterFallback

  // Contextual in-body links: same-cluster posts that aren't this one
  const contextualLinks = allPosts
    .filter(p => p.cluster === post.cluster && p.slug !== post.slug)
    .slice(0, 4)

  // Cross-link to academy articles: find academy definitions relevant to this blog post's topic
  const _postWords = (post.title + ' ' + post.metaDescription + ' ' + (post.cluster || '')).toLowerCase()
  const academyCrossLinks = academyArticles
    .filter(a => {
      const keywords = a.keywords || []
      return keywords.some(kw => _postWords.includes((kw || '').toLowerCase())) ||
        _postWords.includes(a.slug.replace(/^what-is-/, '').replace(/-/g, ' '))
    })
    .slice(0, 4)

  const tocItems = (post.sections || [])
    .filter(s => s.level === 2)
    .map(s => ({ heading: s.heading, id: slugify(s.heading || '') }))

  // Spread lastUpdated across past year based on slug hash — avoids all pSEO posts having same date
  const daysAgo = hashDaysAgo(post.slug)
  const lastUpdated = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  // Scout posts (Alice Watson) are real daily news — always show their actual publish date.
  // pSEO batch posts are staggered so they don't all share the same date.
  const isScoutPost = post.author?.name === 'Alice Watson'
  const displayPublishDate = (() => {
    const orig = new Date(post.publishDate)
    if (isScoutPost) return orig
    const staggered = new Date(lastUpdated.getTime() - (7 + (daysAgo % 21)) * 24 * 60 * 60 * 1000)
    const daysSincePublish = (Date.now() - orig.getTime()) / (24 * 60 * 60 * 1000)
    return daysSincePublish < 10 ? staggered : orig
  })()

  const postUrl = `${BASE}/blog/${post.slug}`

  return (
    <BlogPostView
      post={post}
      prevPost={prevPost}
      nextPost={nextPost}
      relatedPosts={relatedPosts}
      contextualLinks={contextualLinks}
      academyCrossLinks={academyCrossLinks}
      tocItems={tocItems}
      displayPublishDate={displayPublishDate.toISOString()}
      lastUpdated={lastUpdated.toISOString()}
      postUrl={postUrl}
    />
  )
}
