import type { Metadata } from 'next'
import Link from 'next/link'
import { getPost, getAllPosts } from '@/lib/blog-content'
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

const CLUSTER_CTA: Record<string, { headline: string; body: string; cta: string }> = {
  'Financial Intelligence':     { headline: 'Stop guessing your cash position', body: 'AskBiz analyses your financials and surfaces early warning signals — before they become problems.', cta: 'See my cash forecast →' },
  'eCommerce Intelligence':     { headline: 'Grow your store with real data', body: 'Connect your shop and get AI-powered insights on products, customers, and margins in minutes.', cta: 'Analyse my store →' },
  'Marketing Intelligence':     { headline: 'Know which campaigns actually work', body: 'AskBiz tracks your marketing ROI across channels and tells you where to shift budget next.', cta: 'Track my ROI →' },
  'Business Strategy':          { headline: 'Strategy decisions backed by data', body: 'Get competitive analysis, growth scenarios, and market benchmarks — without a consultant.', cta: 'Explore my strategy →' },
  'AI Chief of Staff':          { headline: 'Your AI Chief of Staff is ready', body: 'AskBiz handles the data work your business needs — analysis, briefings, and decision prep — 24/7.', cta: 'Start for free →' },
  'Startup Growth':             { headline: 'Grow faster with AI-powered insights', body: 'AskBiz gives you the analytics and reporting your startup needs without hiring a data team.', cta: 'Accelerate my growth →' },
  'Inventory & Supply Chain':   { headline: 'Never stockout (or overstock) again', body: 'AskBiz predicts demand and flags supply chain risks before they hit your operations.', cta: 'Optimise my inventory →' },
  'Global Trade Intelligence':  { headline: 'Navigate global markets with confidence', body: 'Track tariffs, currency shifts, and trade routes in a single AI-powered dashboard.', cta: 'Explore trade intel →' },
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

// ── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

// ── Per-post metadata ────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return { title: 'Article not found | AskBiz Blog' }

  const url = `${BASE}/blog/${post.slug}`
  const published = new Date(post.publishDate).toISOString()

  const alternateLanguages: Record<string, string> = {}
  post.i18n?.hreflang.forEach(h => { alternateLanguages[h.lang] = h.url })

  return {
    title: `${post.title} | AskBiz Blog`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url,
      type: 'article',
      publishedTime: published,
      authors: ['AskBiz'],
      tags: [post.cluster, post.pillar].filter(Boolean),
      siteName: 'AskBiz',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
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
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: TX3 }}>404</div>
          <div style={{ fontSize: 18, color: TX2, marginBottom: 20 }}>Article not found</div>
          <Link href="/blog" style={{ color: ACC, textDecoration: 'none', fontWeight: 600 }}>← Back to blog</Link>
        </div>
      </div>
    )
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

  const relatedPosts = (post.relatedSlugs || [])
    .map(s => allPosts.find(p => p?.slug === s))
    .filter(Boolean)
    .slice(0, 3)

  // Contextual in-body links: same-cluster posts that aren't this one
  const contextualLinks = allPosts
    .filter(p => p.cluster === post.cluster && p.slug !== post.slug)
    .slice(0, 4)

  const tocItems = post.sections
    .filter(s => s.level === 2)
    .map(s => ({ heading: s.heading, id: slugify(s.heading) }))

  // Last updated: 30 days after publish (inferred — no updatedDate field)
  const lastUpdated = new Date(new Date(post.publishDate).getTime() + 30 * 24 * 60 * 60 * 1000)

  const postUrl = `${BASE}/blog/${post.slug}`

  // JSON-LD schemas
  const jsonLdBlogPost = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    datePublished: new Date(post.publishDate).toISOString(),
    dateModified: lastUpdated.toISOString(),
    author: { '@type': 'Organization', name: 'AskBiz', url: BASE },
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

  const jsonLdFaq = post.paa?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.paa.map(item => ({
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
    step: post.sections
      .filter(s => s.level === 2)
      .map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.heading,
        text: s.body,
      })),
  } : null

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'DM Sans, sans-serif' }}>
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
        .blog-body h2 { font-family: Sora, sans-serif; font-size: clamp(18px,3vw,22px); font-weight: 600; color: ${TX}; margin: 2em 0 .75em; letter-spacing: -.02em; line-height: 1.3; scroll-margin-top: 72px; }
        .blog-body h3 { font-family: Sora, sans-serif; font-size: clamp(16px,2.5vw,19px); font-weight: 600; color: ${TX}; margin: 1.75em 0 .6em; line-height: 1.3; scroll-margin-top: 72px; }
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
          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
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
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: TX, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 16 }}>
          {post.title}
        </h1>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: TX3 }}>
            {new Date(post.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span style={{ fontSize: 13, color: TX3 }}>·</span>
          <span style={{ fontSize: 12, color: TX3 }}>
            Updated {lastUpdated.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </span>
          <span style={{ fontSize: 13, color: TX3 }}>·</span>
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
            {post.sections.filter(s => s.level === 2).slice(0, 5).map((s, i) => (
              <li key={i} style={{ fontSize: 13, color: TX2, lineHeight: 1.55 }}>{s.heading}</li>
            ))}
          </ul>
        </div>

        {/* Body */}
        <div className="blog-body" style={{ fontSize: 15, color: TX2, lineHeight: 1.8 }}>
          {post.sections.map((s, i) => {
            const id = slugify(s.heading)
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
                <p>{s.body}</p>
                {/* Contextual in-body links after 4th section */}
                {i === 3 && contextualLinks.length > 0 && (
                  <div style={{ background: EV, borderRadius: 10, padding: '14px 18px', margin: '28px 0', borderLeft: `3px solid ${clusterColour.text}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
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
                {/* Cluster-specific product CTA after 6th section */}
                {i === 5 && clusterCta && (
                  <div style={{ background: `linear-gradient(135deg, ${clusterColour.bg} 0%, rgba(208,138,89,.06) 100%)`, border: `1px solid ${clusterColour.text}33`, borderRadius: 14, padding: '20px 24px', margin: '32px 0', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 4 }}>{clusterCta.headline}</div>
                      <p style={{ fontSize: 13, color: TX2, margin: 0, lineHeight: 1.6 }}>{clusterCta.body}</p>
                    </div>
                    <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', background: ACC, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {clusterCta.cta}
                    </Link>
                  </div>
                )}
                {/* Mid-article newsletter CTA after 3rd section */}
                {i === 2 && (
                  <div style={{ background: EV, border: `1px solid rgba(208,138,89,.25)`, borderRadius: 14, padding: '20px 24px', margin: '32px 0', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 4 }}>Get weekly BI insights</div>
                      <p style={{ fontSize: 13, color: TX2, margin: 0, lineHeight: 1.6 }}>Data-backed guides on AI, eCommerce, and SME strategy — straight to your inbox.</p>
                    </div>
                    <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACC, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Subscribe free →
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* PAA */}
        {post.paa?.length > 0 && (
          <div style={{ marginTop: 48, marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 600, color: TX, marginBottom: 16, letterSpacing: '-.02em' }}>
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

        {/* Lead magnet prompt */}
        {leadMagnet && (
          <div style={{ background: EV, border: `1px solid ${B}`, borderRadius: 14, padding: '18px 22px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Free download</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 4 }}>{leadMagnet.title}</div>
              <p style={{ fontSize: 12, color: TX2, margin: 0, lineHeight: 1.55 }}>{leadMagnet.description}</p>
            </div>
            <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: SF, color: ACC, borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', border: `1.5px solid ${ACC}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download free →
            </Link>
          </div>
        )}

        {/* Author bio */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 0', borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${ACC} 0%, #e8a870 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.6"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.8"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 2 }}>AskBiz Editorial Team</div>
            <div style={{ fontSize: 12, color: ACC, marginBottom: 6, fontWeight: 600 }}>Business Intelligence Experts</div>
            <p style={{ fontSize: 13, color: TX2, lineHeight: 1.6, margin: 0 }}>
              Our team combines expertise in data analytics, SME strategy, and AI tools to produce practical guides that help founders and operators make better business decisions.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: TX, borderRadius: 16, padding: 'clamp(20px,4vw,32px)', marginBottom: 48, textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(17px,3vw,22px)', fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-.02em' }}>
            {post.cta.heading}
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginBottom: 20, lineHeight: 1.6 }}>{post.cta.body}</p>
          <Link href="/home" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', background: ACC, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 12px rgba(208,138,89,.4)' }}>
            Start free — no credit card required →
          </Link>
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
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 600, color: TX, marginBottom: 16, letterSpacing: '-.02em' }}>
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
