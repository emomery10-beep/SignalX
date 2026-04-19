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
    openGraph: { title: post.title, description: post.metaDescription, url: `https://askbiz.co/blog/${post.slug}` },
    alternates: { canonical: `https://askbiz.co/blog/${post.slug}` },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()
  const related = getRelatedPosts(post)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.paa.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    author: { '@type': 'Organization', name: 'AskBiz' },
    publisher: { '@type': 'Organization', name: 'AskBiz', url: 'https://askbiz.co' },
    datePublished: post.publishDate,
    url: `https://askbiz.co/blog/${post.slug}`,
  }

  return (
    <div style={{ fontFamily: 'var(--font-dm, system-ui)', color: '#1a1916', background: '#f9f8f6' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}/>

      <nav style={{ borderBottom: '1px solid #e8e6e1', background: '#fff', padding: '0 clamp(16px,4vw,24px)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1916' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/blog" style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none', padding: '6px 12px' }}>← Blog</Link>
          <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '7px 16px', textDecoration: 'none' }}>Try free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,24px) clamp(48px,8vw,80px)' }}>

        <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: '#a39e97', marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#a39e97', textDecoration: 'none' }}>AskBiz</Link>
          <span>›</span>
          <Link href="/blog" style={{ color: '#a39e97', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: '#6b6760' }}>{post.cluster}</span>
        </nav>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#d08a59', background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '3px 12px', marginBottom: 14, letterSpacing: '.04em', textTransform: 'uppercase' }}>
            {post.cluster} · {post.readTime} min read
          </div>
          <h1 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(24px,4.5vw,36px)', fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.2, marginBottom: 16, color: '#1a1916' }}>
            {post.title}
          </h1>
        </div>

        {/* TL;DR */}
        <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(208,138,89,.06)', borderLeft: '3px solid #d08a59', marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#d08a59', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>TL;DR</div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#1a1916', margin: 0 }}>{post.tldr}</p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {post.sections.map((s, i) => (
            s.level === 2 ? (
              <section key={i}>
                <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 12, color: '#1a1916' }}>
                  {s.heading}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: '#4a4844', margin: 0 }}>{s.body}</p>
              </section>
            ) : (
              <div key={i} style={{ paddingLeft: 0 }}>
                <h3 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#1a1916' }}>
                  {s.heading}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: '#4a4844', margin: 0 }}>{s.body}</p>
              </div>
            )
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: 'clamp(24px,4vw,36px)', borderRadius: 20, background: 'linear-gradient(135deg,rgba(208,138,89,.08),rgba(140,111,224,.06))', border: '1px solid rgba(208,138,89,.2)', textAlign: 'center', margin: '40px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, marginBottom: 10, color: '#1a1916' }}>{post.cta.heading}</h2>
          <p style={{ fontSize: 15, color: '#6b6760', marginBottom: 20, lineHeight: 1.6 }}>{post.cta.body}</p>
          <Link href="/signin" style={{ display: 'inline-block', fontSize: 15, fontWeight: 600, color: '#fff', background: '#d08a59', borderRadius: 9999, padding: '12px 28px', textDecoration: 'none' }}>
            Get started free →
          </Link>
          <p style={{ fontSize: 12, color: '#a39e97', marginTop: 10 }}>No card required · 10 free questions · Results in seconds</p>
        </div>

        {/* People Also Ask */}
        <section style={{ marginBottom: 40 }} itemScope itemType="https://schema.org/FAQPage">
          <h2 style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 20, color: '#1a1916' }}>
            People also ask
          </h2>
          {post.paa.map((f, i) => (
            <div key={i} style={{ borderBottom: i < post.paa.length - 1 ? '1px solid #e8e6e1' : 'none', padding: '18px 0' }}
              itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <div style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#1a1916' }} itemProp="name">{f.q}</div>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.75, margin: 0 }} itemProp="text">{f.a}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a39e97', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Related posts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid #e8e6e1', background: '#fff', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1916', marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: '#6b6760' }}>{r.cluster} · {r.readTime} min read</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer style={{ borderTop: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,32px) clamp(16px,4vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: '#fff' }}>
        <span style={{ fontFamily: 'var(--font-sora, system-ui)', fontSize: 13, fontWeight: 700, color: '#1a1916' }}>AskBiz © 2026</span>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[['/', 'Home'], ['/blog', 'Blog'], ['/privacy', 'Privacy']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: '#6b6760', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
