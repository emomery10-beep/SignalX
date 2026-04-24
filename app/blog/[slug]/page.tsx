import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPost, getAllPosts, getRelatedPosts } from '@/lib/blog-content'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.title + ' | AskBiz',
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://askbiz.co/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishDate,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.metaDescription },
    alternates: { canonical: `https://askbiz.co/blog/${post.slug}` },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()
  const related = getRelatedPosts(post)

  // ── Schema markup ──────────────────────────────────────────────────────────
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Person',
      name: (post as { author?: string }).author || 'AskBiz Intelligence Team',
      jobTitle: 'Business Intelligence Analyst',
      worksFor: { '@type': 'Organization', name: 'AskBiz', url: 'https://askbiz.co' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'AskBiz',
      url: 'https://askbiz.co',
      logo: { '@type': 'ImageObject', url: 'https://askbiz.co/logo.svg' },
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    url: `https://askbiz.co/blog/${post.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://askbiz.co/blog/${post.slug}` },
    keywords: (post as { keywords?: string }).keywords || post.cluster,
    articleSection: post.cluster,
    inLanguage: 'en-GB',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.paa.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://askbiz.co' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://askbiz.co/blog' },
      { '@type': 'ListItem', position: 3, name: post.cluster, item: `https://askbiz.co/blog` },
      { '@type': 'ListItem', position: 4, name: post.title, item: `https://askbiz.co/blog/${post.slug}` },
    ],
  }

  const author = (post as { author?: string }).author || 'AskBiz Intelligence Team'
  const authorRole = (post as { authorRole?: string }).authorRole || 'Verified Business Intelligence Analyst'
  const externalCitations = (post as { externalCitations?: { label: string; url: string; publisher: string }[] }).externalCitations || []
  const executiveSummary = (post as { executiveSummary?: string }).executiveSummary || post.tldr
  const primaryKeyword = (post as { primaryKeyword?: string }).primaryKeyword || ''

  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', color: '#1a1916', background: '#f9f8f6' }}>

      {/* Schema markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 clamp(16px,4vw,24px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/blog" style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none', padding: '6px 12px' }}>← Blog</Link>
          <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#6366F1', borderRadius: 9999, padding: '7px 16px', textDecoration: 'none' }}>Try free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,24px) clamp(48px,8vw,80px)' }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: 6, fontSize: 12, color: '#a39e97', marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#a39e97', textDecoration: 'none' }}>AskBiz</Link>
          <span>›</span>
          <Link href="/blog" style={{ color: '#a39e97', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: '#6b6760' }}>{post.cluster}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 9999, padding: '3px 12px', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              {post.cluster}
            </div>
            <span style={{ fontSize: 12, color: '#a39e97' }}>{post.readTime} min read</span>
            <span style={{ fontSize: 12, color: '#a39e97' }}>·</span>
            <time dateTime={post.publishDate} style={{ fontSize: 12, color: '#a39e97' }}>
              {new Date(post.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          </div>

          {/* H1 — one per page */}
          <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(24px,4.5vw,36px)', fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.2, marginBottom: 20, color: '#1a1916' }}>
            {post.title}
          </h1>

          {/* Author byline — E-E-A-T signal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: '1px solid #e8e6e1', borderBottom: '1px solid #e8e6e1', marginBottom: 28 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.6"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.8"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916' }}>{author}</div>
              <div style={{ fontSize: 12, color: '#6b6760' }}>{authorRole} · AskBiz</div>
            </div>
            {primaryKeyword && (
              <div style={{ marginLeft: 'auto', fontSize: 11, color: '#a39e97', background: '#f0efed', borderRadius: 6, padding: '3px 8px' }}>
                {primaryKeyword}
              </div>
            )}
          </div>
        </header>

        {/* Executive Summary / Snippet — AI Overview target */}
        <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(99,102,241,.04)', borderLeft: '3px solid #6366F1', marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Executive Summary</div>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#1a1916', margin: 0, fontWeight: 500 }}>{executiveSummary}</p>
        </div>

        {/* Article sections */}
        <article>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {post.sections.map((s, i) => (
              s.level === 2 ? (
                <section key={i} data-motion style={{ transitionDelay: `${i * 0.05}s` }}>
                  <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 12, color: '#1a1916', lineHeight: 1.3 }}>
                    {s.heading}
                  </h2>
                  <div style={{ fontSize: 16, lineHeight: 1.85, color: '#4a4844' }}
                    dangerouslySetInnerHTML={{ __html: s.body
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n\n/g, '</p><p style="margin-top:1em">')
                      .replace(/\n- /g, '</p><ul style="margin:0.75em 0 0.75em 1.5em;list-style:disc"><li>')
                      .replace(/\n(\d+)\. /g, '</p><ol style="margin:0.75em 0 0.75em 1.5em"><li>')
                    }}
                  />
                </section>
              ) : (
                <section key={i}>
                  <h3 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 17, fontWeight: 600, marginBottom: 8, color: '#1a1916', lineHeight: 1.35 }}>
                    {s.heading}
                  </h3>
                  <div style={{ fontSize: 15, lineHeight: 1.85, color: '#4a4844' }}
                    dangerouslySetInnerHTML={{ __html: s.body
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n\n/g, '</p><p style="margin-top:1em">')
                    }}
                  />
                </section>
              )
            ))}
          </div>
        </article>

        {/* External citations — E-E-A-T authority signal */}
        {externalCitations.length > 0 && (
          <div style={{ margin: '36px 0', padding: '16px 20px', borderRadius: 12, background: '#fff', border: '1px solid #e8e6e1' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Sources & Further Reading</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {externalCitations.map((c, i) => (
                <a key={i} href={c.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6366F1', textDecoration: 'none', padding: '6px 0' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                  <span>{c.label}</span>
                  <span style={{ color: '#a39e97', fontSize: 11 }}>— {c.publisher}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA block */}
        <div style={{ padding: 'clamp(24px,4vw,36px)', borderRadius: 20, background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.06))', border: '1px solid rgba(99,102,241,.2)', textAlign: 'center', margin: '40px 0' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/><path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, marginBottom: 10, color: '#1a1916' }}>{post.cta.heading}</h2>
          <p style={{ fontSize: 15, color: '#6b6760', marginBottom: 20, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 20px' }}>{post.cta.body}</p>
          <Link href="/signin" style={{ display: 'inline-block', fontSize: 15, fontWeight: 600, color: '#fff', background: '#6366F1', borderRadius: 9999, padding: '12px 28px', textDecoration: 'none' }}>
            Get started free →
          </Link>
          <p style={{ fontSize: 12, color: '#a39e97', marginTop: 10 }}>No card required · 10 free questions · Results in seconds</p>
        </div>

        {/* FAQ / People Also Ask — FAQ schema */}
        <section aria-label="Frequently Asked Questions" style={{ marginBottom: 40 }} itemScope itemType="https://schema.org/FAQPage">
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 20, color: '#1a1916' }}>
            Common questions
          </h2>
          {post.paa.map((f, i) => (
            <div key={i}
              style={{ borderBottom: i < post.paa.length - 1 ? '1px solid #e8e6e1' : 'none', padding: '18px 0' }}
              itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#1a1916', margin: '0 0 8px' }} itemProp="name">
                {f.q}
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.75, margin: 0 }} itemProp="text">{f.a}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Internal link nudge */}
        <div style={{ padding: '14px 18px', borderRadius: 12, background: '#fff', border: '1px solid #e8e6e1', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#6b6760' }}>Want to analyse your own business data?</span>
          <Link href="/chat" style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Ask AskBiz now →
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section aria-label="Related articles">
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Related articles</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="card-hover" style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid #e8e6e1', background: '#fff', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1916', marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: '#6b6760' }}>{r.cluster} · {r.readTime} min read</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer style={{ borderTop: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,32px) clamp(16px,4vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: '#fff' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 700, color: '#1a1916' }}>AskBiz © 2026</span>
          <span style={{ fontSize: 12, color: '#a39e97', marginLeft: 12 }}>Business Intelligence for SME Founders</span>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[['/', 'Home'], ['/blog', 'Blog'], ['/chat', 'Try AskBiz'], ['/privacy', 'Privacy']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
