import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getAllPosts, type BlogPost } from '@/lib/blog-content'
import { academyArticles } from '@/lib/academy-content'
import { createClient } from '@supabase/supabase-js'

export const dynamicParams = true
export const dynamic = 'force-dynamic'

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
      // Fallback: fetch recent published posts and match slug in JS
      const { data: rows } = await supabase
        .from('agent_content')
        .select('content, created_at')
        .eq('type', 'blog')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(500)
      const match = (rows || []).find((r: any) => r.content?.slug === slug)
      if (!match) return null
      return {
        ...match.content,
        publishDate: match.content.publishDate || match.created_at?.slice(0, 10),
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
import ShareButtons from './ShareButtons'
import ReadingProgress from './ReadingProgress'
import ScrollDepthTracker from './ScrollDepthTracker'

const CLUSTER_DIFFICULTY: Record<string, string> = {
  'AskBiz Tutorials':              'Beginner',
  'Startup Growth':                'Beginner',
  'Business & Economic Impact':    'Beginner',
  'BI News & Trends 2026':         'Beginner',
  'AI & Business Trends 2026':     'Beginner',
  'Business Strategy':             'Intermediate',
  'Financial Intelligence':        'Intermediate',
  'Marketing Intelligence':        'Intermediate',
  'eCommerce Intelligence':        'Intermediate',
  'Data-Driven Decisions':         'Intermediate',
  'Inventory & Supply Chain':      'Intermediate',
  'UK Business & Tax':             'Intermediate',
  'Efficiency & Tools':            'Intermediate',
  'AI Chief of Staff':             'Intermediate',
  'Africa eCommerce':              'Intermediate',
  'Emerging Markets':              'Intermediate',
  'Data Translator':               'Advanced',
  'Predictive Operations':         'Advanced',
  'Predictive Strategy':           'Advanced',
  'Global Trade Intelligence':     'Advanced',
  'Geopolitical Impact':           'Advanced',
  'Local & Vertical Growth':       'Advanced',
  'Multi-Language & Vertical ROI': 'Advanced',
  'Cross-Border EU Commerce':      'Advanced',
  'EU-Ready AI':                   'Advanced',
}

const DIFFICULTY_COLOURS: Record<string, { text: string; bg: string }> = {
  Beginner:     { text: '#16a34a', bg: 'rgba(34,197,94,.08)'  },
  Intermediate: { text: '#d97706', bg: 'rgba(245,158,11,.08)' },
  Advanced:     { text: '#dc2626', bg: 'rgba(239,68,68,.08)'  },
}

function getContentType(title: string, pillar: string): string {
  const t = title.toLowerCase()
  const p = pillar.toLowerCase()
  if (t.includes('how to') || t.includes('how-to') || t.includes('step-by-step')) return 'How-To'
  if (t.includes(' vs ') || t.includes('versus') || t.includes('comparison')) return 'Comparison'
  if (t.includes('case study') || t.includes('success story')) return 'Case Study'
  if (t.includes('what is') || t.includes('what are') || t.includes('explained') || t.includes('definition') || t.includes('glossary')) return 'Explainer'
  if (t.includes('news') || t.includes('trends') || t.includes('report') || p.includes('news')) return 'Report'
  if (t.includes('checklist') || t.includes('template') || t.includes('playbook')) return 'Template'
  return 'Guide'
}

const CONTENT_TYPE_COLOURS: Record<string, { text: string; bg: string }> = {
  'How-To':     { text: '#0284c7', bg: 'rgba(14,165,233,.08)'  },
  'Comparison': { text: '#9333ea', bg: 'rgba(168,85,247,.08)'  },
  'Case Study': { text: '#0f766e', bg: 'rgba(20,184,166,.08)'  },
  'Explainer':  { text: '#6366F1', bg: 'rgba(99,102,241,.08)'  },
  'Report':     { text: '#dc2626', bg: 'rgba(239,68,68,.08)'   },
  'Template':   { text: '#d97706', bg: 'rgba(245,158,11,.08)'  },
  'Guide':      { text: '#6b6760', bg: 'rgba(107,103,96,.08)'  },
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
  return `${d} ${suffix}`
}

const CLUSTER_CTA: Record<string, { headline: string; body: string; cta: string; href: string }> = {
  'Financial Intelligence':     { headline: 'See your real cash position right now', body: 'Connect your accounts and AskBiz surfaces cash flow warnings, margin trends, and profit drivers — automatically. No spreadsheets.', cta: 'Connect my financials free →', href: '/signin' },
  'eCommerce Intelligence':     { headline: 'Find your best-selling products in 60 seconds', body: 'Connect your Shopify or Amazon store and instantly see which products make money, which drain it, and where to focus next.', cta: 'Analyse my store free →', href: '/signin' },
  'Marketing Intelligence':     { headline: 'Stop wasting budget on campaigns that don\'t work', body: 'AskBiz shows you exactly which channels drive revenue — not just clicks. Connect your ad accounts and see ROI by channel today.', cta: 'See my marketing ROI →', href: '/signin' },
  'Business Strategy':          { headline: 'Get a competitive intelligence briefing on your market', body: 'AskBiz monitors your competitors, benchmarks your performance, and flags strategic threats — delivered as a daily briefing.', cta: 'Get my market briefing →', href: '/signin' },
  'AI Chief of Staff':          { headline: 'Let AI handle your business analysis', body: 'AskBiz acts as your Chief of Staff — pulling data from all your tools, spotting problems early, and briefing you every morning.', cta: 'Try AskBiz free for 14 days →', href: '/signin' },
  'Startup Growth':             { headline: 'Track the metrics that actually predict growth', body: 'AskBiz connects to your sales, marketing, and finance tools and shows you the KPIs that matter most at your stage — no data team needed.', cta: 'Set up my startup dashboard →', href: '/signin' },
  'Inventory & Supply Chain':   { headline: 'Stop stockouts before they cost you customers', body: 'AskBiz predicts when you\'ll run out of stock, which suppliers are causing delays, and how much cash is tied up in slow-moving inventory.', cta: 'Optimise my inventory free →', href: '/signin' },
  'Global Trade Intelligence':  { headline: 'Trade smarter across African markets', body: 'AskBiz tracks tariff changes, currency movements, and supply chain risks across 54 African markets in one dashboard.', cta: 'Explore trade intelligence →', href: '/signin' },
  'Data-Driven Decisions':      { headline: 'Make every business decision with data behind it', body: 'AskBiz connects all your business data and answers your questions in plain English — no SQL, no analyst needed.', cta: 'Start making data-driven decisions →', href: '/signin' },
  'Africa eCommerce':           { headline: 'Grow your African eCommerce business with data', body: 'Track sales across Jumia, Takealot, and your own store in one place. See which markets and products are driving real growth.', cta: 'Connect my African store →', href: '/signin' },
  'Emerging Markets':           { headline: 'Intelligence built for emerging market operators', body: 'AskBiz is designed for businesses operating in high-growth, high-volatility markets — with tools for currency risk, local supply chains, and more.', cta: 'Get emerging market intelligence →', href: '/signin' },
}

const LEAD_MAGNET: Record<string, { title: string; description: string }> = {
  'Financial Intelligence':     { title: 'Free: Cash Flow Health Checklist', description: '12 metrics every SME owner should review monthly — download in 10 seconds.' },
  'eCommerce Intelligence':     { title: 'Free: eCommerce Analytics Checklist', description: '15-point checklist to audit your store data and find quick revenue wins.' },
  'Marketing Intelligence':     { title: 'Free: Marketing ROI Tracker Template', description: 'Google Sheets template to consolidate channel performance in one view.' },
  'Business Strategy':          { title: 'Free: Strategy Planning Template', description: 'One-page framework used by 500+ SME founders to set quarterly priorities.' },
  'AI Chief of Staff':          { title: 'Free: AI Tools for Business Guide', description: '20 AI tools that replace expensive consultants — curated for SME owners.' },
  'Startup Growth':             { title: 'Free: Startup KPI Dashboard Template', description: 'Track your 10 most important startup metrics in one Google Sheet.' },
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const EV  = '#f3f2ef'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B   = 'rgba(0,0,0,.08)'

const CLUSTER_COLOURS: Record<string, { text: string; bg: string }> = {
  'AI Chief of Staff':            { text: '#9268f8', bg: 'rgba(146,104,248,.1)' },
  'Data Translator':              { text: '#1ed4ca', bg: 'rgba(30,212,202,.1)'  },
  'Startup Growth':               { text: '#d08a59', bg: 'rgba(208,138,89,.1)'  },
  'Efficiency & Tools':           { text: '#5280cc', bg: 'rgba(82,128,204,.1)'  },
  'Financial Intelligence':       { text: '#16a34a', bg: 'rgba(34,197,94,.1)'   },
  'Predictive Operations':        { text: '#dc2626', bg: 'rgba(239,68,68,.1)'   },
  'Predictive Strategy':          { text: '#d97706', bg: 'rgba(245,158,11,.1)'  },
  'Global Trade Intelligence':    { text: '#d97706', bg: 'rgba(245,158,11,.1)'  },
  'Geopolitical Impact':          { text: '#dc2626', bg: 'rgba(239,68,68,.1)'   },
  'AI & Business Trends 2026':    { text: '#6366F1', bg: 'rgba(99,102,241,.1)'  },
  'Data-Driven Decisions':        { text: '#16a34a', bg: 'rgba(34,197,94,.1)'   },
  'BI News & Trends 2026':        { text: '#059669', bg: 'rgba(16,185,129,.1)'  },
  'Africa eCommerce':             { text: '#b45309', bg: 'rgba(180,83,9,.1)'    },
  'Business & Economic Impact':   { text: '#dc2626', bg: 'rgba(239,68,68,.1)'   },
  'Local & Vertical Growth':      { text: '#6366F1', bg: 'rgba(99,102,241,.1)'  },
  'Multi-Language & Vertical ROI':{ text: '#db2777', bg: 'rgba(236,72,153,.1)'  },
  'eCommerce Intelligence':       { text: '#0284c7', bg: 'rgba(14,165,233,.1)'  },
  'Marketing Intelligence':       { text: '#9333ea', bg: 'rgba(168,85,247,.1)'  },
  'Inventory & Supply Chain':     { text: '#0f766e', bg: 'rgba(20,184,166,.1)'  },
  'Business Strategy':            { text: '#1d4ed8', bg: 'rgba(59,130,246,.1)'  },
  'UK Business & Tax':            { text: '#be185d', bg: 'rgba(236,72,153,.1)'  },
  'Emerging Markets':             { text: '#b45309', bg: 'rgba(180,83,9,.1)'    },
  'AskBiz Tutorials':             { text: '#d08a59', bg: 'rgba(208,138,89,.1)'  },
  'Cross-Border EU Commerce':     { text: '#0284c7', bg: 'rgba(14,165,233,.1)'  },
  'EU-Ready AI':                  { text: '#6366F1', bg: 'rgba(99,102,241,.1)'  },
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

function extractStats(sections: { body?: string; content?: string }[]): string[] {
  const body = sections.map(s => s.body || s.content || '').join(' ')
  const matches = body.match(/(?:\$|£|€|KES|UGX|NGN|₦|GHS|₵|ZAR)\s?[\d,\.]+(?:\s?(?:million|billion|thousand|bn|mn|k))?|[\d,\.]+\s?(?:million|billion|thousand|bn|mn|k)?\s?(?:%|percent)|[\d,\.]+\s?(?:million|billion|thousand)/gi) || []
  return [...new Set(matches)].slice(0, 5)
}

// ── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
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

  return {
    title: `${post.title} | AskBiz Blog`,
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
    notFound()
  }

  const clusterColour  = CLUSTER_COLOURS[post.cluster] || { text: ACC, bg: 'rgba(208,138,89,.1)' }
  const difficulty     = CLUSTER_DIFFICULTY[post.cluster] || 'Intermediate'
  const diffColour     = DIFFICULTY_COLOURS[difficulty]
  const contentType    = getContentType(post.title, post.pillar || '')
  const ctColour       = CONTENT_TYPE_COLOURS[contentType]
  const clusterCta     = CLUSTER_CTA[post.cluster]
  const leadMagnet     = LEAD_MAGNET[post.cluster]
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
  // Display publishDate: if post is pSEO (same-day batch), use a staggered date slightly before lastUpdated
  const displayPublishDate = (() => {
    const orig = new Date(post.publishDate)
    const staggered = new Date(lastUpdated.getTime() - (7 + (daysAgo % 21)) * 24 * 60 * 60 * 1000)
    // Only stagger if orig is within 7 days of today (fresh batch)
    const daysSincePublish = (Date.now() - orig.getTime()) / (24 * 60 * 60 * 1000)
    return daysSincePublish < 10 ? staggered : orig
  })()

  const postUrl = `${BASE}/blog/${post.slug}`

  // JSON-LD schemas
  const jsonLdBlogPost = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    datePublished: displayPublishDate.toISOString(),
    dateModified: lastUpdated.toISOString(),
    author: post.author
      ? { '@type': 'Person', name: post.author.name, jobTitle: post.author.role, url: BASE }
      : { '@type': 'Organization', name: 'AskBiz', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'AskBiz',
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    url: postUrl,
    keywords: [post.cluster, post.pillar].filter(Boolean).join(', '),
    articleSection: post.cluster,
    timeRequired: `PT${post.readTime}M`,
  }

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Blog',  item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.cluster, item: `${BASE}/blog?cluster=${encodeURIComponent(post.cluster)}` },
      { '@type': 'ListItem', position: 4, name: post.title, item: postUrl },
    ],
  }

  // FAQ schema: use paa if available, otherwise generate from section headings
  const _faqItems = post.paa?.length > 0
    ? post.paa.map(item => ({ q: item.q, a: item.a }))
    : post.sections
        .filter(s => s.level === 2)
        .slice(0, 5)
        .map(s => ({ q: (s.heading || '').endsWith('?') ? s.heading : `What about ${(s.heading || '').toLowerCase()}?`, a: (s.body || '').slice(0, 300) }))
  const jsonLdFaq = _faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: _faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null

  // HowTo schema when article is a step-by-step guide
  const jsonLdHowTo = contentType === 'How-To' ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: post.title,
    description: post.metaDescription,
    totalTime: `PT${post.readTime}M`,
    step: (post.sections || [])
      .filter(s => s.level === 2)
      .map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.heading,
        text: s.body,
      })),
  } : null

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'DM Sans, system-ui' }}>
      <ReadingProgress />
      <ScrollDepthTracker slug={post.slug} />

      {/* Hreflang link tags */}
      {post.i18n?.hreflang.map(h => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={postUrl} />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlogPost) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}/>
      {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}/>}
      {jsonLdHowTo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}/>}

      <style>{`
        body { background: ${BG} !important; }
        .blog-body h2 { font-family: Sora, system-ui; font-size: clamp(18px,3vw,22px); font-weight: 600; color: ${TX}; margin: 2em 0 .75em; letter-spacing: -.02em; line-height: 1.3; scroll-margin-top: 72px; }
        .blog-body h3 { font-family: Sora, system-ui; font-size: clamp(16px,2.5vw,19px); font-weight: 600; color: ${TX}; margin: 1.75em 0 .6em; line-height: 1.3; scroll-margin-top: 72px; }
        .blog-body p  { margin-bottom: 1.5em; }
        .blog-body h2 .anchor-icon, .blog-body h3 .anchor-icon { opacity: 0; margin-left: 6px; color: ${TX3}; text-decoration: none; font-size: .8em; transition: opacity 150ms; }
        .blog-body h2:hover .anchor-icon, .blog-body h3:hover .anchor-icon { opacity: 1; }
        details summary::-webkit-details-marker { display: none; }
        details[open] summary svg { transform: rotate(180deg); }
        .nav-link:hover { color: ${TX} !important; }
        .toc-link:hover { color: ${TX} !important; }
        .prevnext-card:hover { background: ${EV} !important; }
        .related-card:hover { background: ${EV} !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: SF, borderBottom: `1px solid ${B}`, padding: '0 clamp(16px,4vw,32px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/blog" className="nav-link" style={{ fontSize: 13, color: TX2, textDecoration: 'none', transition: 'color 120ms' }}>← All articles</Link>
          <Link href="/home" style={{ fontSize: 13, fontWeight: 600, color: ACC, textDecoration: 'none', padding: '6px 14px', background: 'rgba(208,138,89,.1)', borderRadius: 9999 }}>
            Try AskBiz free →
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article id="article-body" style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(28px,5vw,52px) clamp(16px,4vw,32px) 80px' }}>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 12, color: TX3, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: TX3, textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: TX3, textDecoration: 'none' }}>Blog</Link>
          <span>/</span>
          <Link href={`/blog?cluster=${encodeURIComponent(post.cluster)}`} style={{ color: TX3, textDecoration: 'none' }}>{post.cluster}</Link>
          <span>/</span>
          <span style={{ color: TX2 }}>{post.title.length > 48 ? post.title.slice(0, 48) + '…' : post.title}</span>
        </nav>

        {/* Cluster + pillar badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <Link
            href={`/blog?cluster=${encodeURIComponent(post.cluster)}`}
            style={{ fontSize: 11, fontWeight: 700, color: clusterColour.text, background: clusterColour.bg, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.06em', textDecoration: 'none' }}
          >
            {post.cluster}
          </Link>
          {post.pillar && (
            <Link
              href={`/blog?cluster=${encodeURIComponent(post.cluster)}&pillar=${encodeURIComponent(post.pillar)}`}
              style={{ fontSize: 11, color: TX3, textDecoration: 'none', background: EV, padding: '3px 9px', borderRadius: 9999 }}
            >
              {post.pillar}
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 16 }}>
          {post.title}
        </h1>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {post.author?.name && <>
            <span style={{ fontSize: 13, fontWeight: 600, color: TX }}>Written by {post.author.name}</span>
            <span style={{ fontSize: 13, color: TX3 }}>·</span>
          </>}
          {(() => {
            const diffDays = Math.floor((Date.now() - displayPublishDate.getTime()) / 86400000)
            const isRecent = diffDays <= 2
            const label = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : diffDays < 7 ? `${diffDays} days ago` : displayPublishDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                {isRecent && <span style={{ fontSize: 9, fontWeight: 700, color: '#16a34a', background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.2)', borderRadius: 4, padding: '1px 5px', letterSpacing: '.04em' }}>NEW</span>}
                <span style={{ fontSize: 13, color: isRecent ? '#16a34a' : TX3, fontWeight: isRecent ? 500 : 400 }}>{label}</span>
              </span>
            )
          })()}
          <span style={{ fontSize: 13, color: TX3 }}>·</span>
          {!post.author && <>
            <span style={{ fontSize: 12, color: TX3 }}>
              Updated {lastUpdated.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </span>
            <span style={{ fontSize: 13, color: TX3 }}>·</span>
          </>}
          <span style={{ fontSize: 13, color: TX3 }}>{post.readTime} min read</span>
          <span style={{ fontSize: 13, color: TX3 }}>·</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: ctColour.text, background: ctColour.bg, padding: '2px 8px', borderRadius: 9999 }}>
            {contentType}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: diffColour.text, background: diffColour.bg, padding: '2px 8px', borderRadius: 9999 }}>
            {difficulty}
          </span>
        </div>

        {/* Share buttons */}
        <div style={{ marginBottom: 32 }}>
          <ShareButtons url={postUrl} title={post.title} />
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${B}`, marginBottom: 32 }}/>

        {/* Table of contents */}
        {tocItems.length >= 3 && (
          <div style={{ background: EV, borderRadius: 12, padding: '16px 20px', marginBottom: 36, border: `1px solid ${B}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
              In this article
            </div>
            <ol style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 8, listStyleType: 'decimal' }}>
              {tocItems.map((item, i) => (
                <li key={i}>
                  <a href={`#${item.id}`} className="toc-link" style={{ fontSize: 13, color: TX2, textDecoration: 'none', lineHeight: 1.4, transition: 'color 120ms' }}>
                    {item.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Key Takeaways (enhanced TL;DR) */}
        <div style={{ background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 12, padding: '16px 20px', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.08em' }}>Key Takeaways</span>
          </div>
          <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, margin: '0 0 12px' }}>{post.tldr}</p>
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 5, listStyleType: 'disc' }}>
            {(post.sections || []).filter(s => s.level === 2).slice(0, 5).map((s, i) => (
              <li key={i} style={{ fontSize: 13, color: TX2, lineHeight: 1.55 }}>{s.heading}</li>
            ))}
          </ul>
        </div>

        {/* Body */}
        <div className="blog-body" style={{ fontSize: 15, color: TX2, lineHeight: 1.8 }}>
          {(post.sections || []).map((s, i) => {
            const id = slugify(s.heading || '')
            return (
              <div key={i}>
                {s.level === 2 ? (
                  <h2 id={id}>
                    {s.heading}
                    <a href={`#${id}`} className="anchor-icon" aria-label="Link to section">#</a>
                  </h2>
                ) : (
                  <h3 id={id}>
                    {s.heading}
                    <a href={`#${id}`} className="anchor-icon" aria-label="Link to section">#</a>
                  </h3>
                )}
                {/* Intro section gets larger font */}
                {i === 0 ? (
                  <p style={{ fontSize: 17, lineHeight: 1.85, color: TX }}>{s.body}</p>
                ) : (
                  <p>{s.body}</p>
                )}
                {/* Contextual in-body links after 4th section */}
                {i === 3 && contextualLinks.length > 0 && (
                  <div style={{ background: EV, borderRadius: 10, padding: '14px 18px', margin: '28px 0', border: `1px solid ${B}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TX2, marginBottom: 10 }}>
                      More in {post.cluster}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {contextualLinks.map(p => (
                        <Link key={p.slug} href={`/blog/${p.slug}`} style={{ fontSize: 13, color: clusterColour.text, textDecoration: 'none', fontWeight: 500, lineHeight: 1.4 }}>
                          → {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* By the Numbers box — after all sections, before PAA */}
          {(() => {
            const stats = extractStats(post.sections || [])
            if (stats.length < 2) return null
            return (
              <div style={{ background: EV, borderRadius: 14, padding: '20px 24px', marginBottom: 36 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TX2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>📊 By The Numbers</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {stats.map((s, i) => (
                    <span key={i} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 8, padding: '6px 14px', fontSize: 14, fontWeight: 700, color: TX, fontFamily: 'Sora, system-ui' }}>{s}</span>
                  ))}
                </div>
              </div>
            )
          })()}

        </div>

        {/* PAA */}
        {post.paa?.length > 0 && (
          <div style={{ marginTop: 48, marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 20, fontWeight: 600, color: TX, marginBottom: 16, letterSpacing: '-.02em' }}>
              People also ask
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {post.paa.map((item, i) => (
                <details key={i} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: '14px 18px', cursor: 'pointer' }}>
                  <summary style={{ fontSize: 14, fontWeight: 600, color: TX, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    {item.q}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TX3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: 'transform 200ms' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </summary>
                  <p style={{ fontSize: 14, color: TX2, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}


        {/* Author bio */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 0', borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: post.author ? 'linear-gradient(135deg, #6366F1 0%, #818cf8 100%)' : `linear-gradient(135deg, ${ACC} 0%, #e8a870 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Sora, system-ui' }}>
            {post.author ? post.author.name.split(' ').map(n => n[0]).join('') : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.6"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.8"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontFamily: 'Sora, system-ui', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 2 }}>{post.author?.name || 'AskBiz Editorial Team'}</div>
            <div style={{ fontSize: 12, color: post.author ? '#6366F1' : ACC, marginBottom: 6, fontWeight: 600 }}>{post.author?.role || 'Business Intelligence Experts'}</div>
            <p style={{ fontSize: 13, color: TX2, lineHeight: 1.6, margin: 0 }}>
              {post.author?.bio || 'Our team combines expertise in data analytics, SME strategy, and AI tools to produce practical guides that help founders and operators make better business decisions.'}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: TX, borderRadius: 16, padding: 'clamp(20px,4vw,32px)', marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>14-day free trial · No credit card needed</div>
          <h3 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(17px,3vw,22px)', fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-.02em' }}>
            {clusterCta?.headline || post.cta?.heading || post.cta?.text || 'See this data for your own business'}
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginBottom: 24, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 24px' }}>
            {clusterCta?.body || post.cta?.body || 'AskBiz connects to your existing tools and surfaces insights like these automatically — no spreadsheets, no analysts, no waiting.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={clusterCta?.href || post.cta?.href || '/signin'} style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', background: ACC, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 12px rgba(208,138,89,.4)' }}>
              {clusterCta?.cta || 'Start free trial →'}
            </Link>
            <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 20px', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.8)', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              See pricing
            </Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 14, marginBottom: 0 }}>Connects to Shopify, Xero, Amazon, QuickBooks, Stripe & more in minutes</p>
        </div>

        {/* Share again (bottom) */}
        <div style={{ marginBottom: 48 }}>
          <ShareButtons url={postUrl} title={post.title} />
        </div>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 48 }}>
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="prevnext-card" style={{ display: 'block', padding: '14px 16px', background: SF, border: `1px solid ${B}`, borderRadius: 12, textDecoration: 'none', transition: 'background 120ms' }}>
                <div style={{ fontSize: 11, color: TX3, marginBottom: 6 }}>← Previous</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.4 }}>{prevPost.title}</div>
                <div style={{ fontSize: 11, color: TX3, marginTop: 4 }}>{prevPost.readTime} min read</div>
              </Link>
            ) : <div />}
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="prevnext-card" style={{ display: 'block', padding: '14px 16px', background: SF, border: `1px solid ${B}`, borderRadius: 12, textDecoration: 'none', textAlign: 'right', transition: 'background 120ms' }}>
                <div style={{ fontSize: 11, color: TX3, marginBottom: 6 }}>Next →</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.4 }}>{nextPost.title}</div>
                <div style={{ fontSize: 11, color: TX3, marginTop: 4 }}>{nextPost.readTime} min read</div>
              </Link>
            )}
          </div>
        )}

        {/* Related */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 600, color: TX, marginBottom: 16, letterSpacing: '-.02em' }}>
              Related articles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12 }}>
              {relatedPosts.map((r, i) => r && (
                <Link key={i} href={`/blog/${r.slug}`} className="related-card" style={{ display: 'block', padding: '14px 16px', background: SF, border: `1px solid ${B}`, borderRadius: 12, textDecoration: 'none', transition: 'background 120ms' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{r.cluster}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.4 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: TX3, marginTop: 6 }}>{r.readTime} min read</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Academy cross-links — boosts internal link graph between blog and academy */}
        {academyCrossLinks.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 18, fontWeight: 600, color: TX, marginBottom: 16, letterSpacing: '-.02em' }}>
              Learn the concepts
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12 }}>
              {academyCrossLinks.map((a, i) => (
                <Link key={i} href={`/academy/${a.slug}`} className="related-card" style={{ display: 'block', padding: '14px 16px', background: SF, border: `1px solid ${B}`, borderRadius: 12, textDecoration: 'none', transition: 'background 120ms' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{a.category}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TX, lineHeight: 1.4 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: TX3, marginTop: 6 }}>{a.readTime} min · {a.difficulty}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${B}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz. AI-powered business intelligence for SMEs.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {[
            ['/blog', 'Blog'],
            ['/rss.xml', 'RSS'],
            ['/privacy', 'Privacy'],
            ['/developers', 'API'],
          ].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
