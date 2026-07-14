import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import type { Metadata } from 'next'
import { resolveLocale, localePath } from '@/lib/i18n-locale'
import { LEARNING_PATHS } from '@/lib/learning-paths-content'
import { academyArticles } from '@/lib/academy-content'
import LearningPathModules from './LearningPathModules'

// Real per-article metadata keyed by slug — lets the hub page render each
// module's actual description and read time instead of a generic placeholder,
// and confirms which modules resolve to a real, linkable article.
const ARTICLE_BY_SLUG = new Map(academyArticles.map(a => [a.slug, a]))

// Meta descriptions target 150-160 chars; truncate on a word boundary so it
// reads as a sentence fragment rather than getting cut mid-word.
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#171512'
const TX2 = '#5c574f'
const TX3 = '#6a655c' // darkened from #a39e97 (2.5:1 on SF/BG) to meet 4.5:1 AA
const BD  = '#e8e6e1'

export async function generateStaticParams() {
  return LEARNING_PATHS.map((path) => ({
    id: path.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const path = LEARNING_PATHS.find(p => p.id === params.id)
  if (!path) return { title: 'Learning Path | AskBiz Academy' }

  // Most path titles are naturally short; append the brand suffix only when
  // it still fits the ~60-char SEO title budget, otherwise leave it bare.
  const suffix = ' · AskBiz Academy'
  const title = path.title.length + suffix.length <= 62 ? path.title + suffix : path.title
  const description = truncateAtWord(path.description, 157)
  const url = `https://askbiz.co/academy/learning-paths/${path.id}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function LearningPathPage({ params }: { params: { id: string } }) {
  const lang = resolveLocale({ urlLocale: headers().get('x-locale'), cookie: cookies().get('askbiz_lang')?.value })
  const id = params.id
  const path = LEARNING_PATHS.find(p => p.id === id)

  if (!path) {
    return (
      <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 560 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: TX, marginBottom: 12 }}>Learning Path Not Found</h1>
          <p style={{ fontSize: 13, color: TX2, marginBottom: 36 }}>The learning path you're looking for doesn't exist.</p>
          <Link href={localePath('/academy/learning-paths', lang)} style={{ display: 'inline-block', padding: '12px 28px', background: ACC, color: SF, textDecoration: 'none', borderRadius: 10, fontWeight: 700 }}>
            ← Back to Learning Paths
          </Link>
        </div>
      </div>
    )
  }

  const url = `https://askbiz.co/academy/learning-paths/${path.id}`

  // hasPart lists every lesson as its own LearningResource with a real,
  // crawlable URL — richer for Google's Course rich results and gives AI
  // answer engines an explicit lesson-by-lesson structure to cite instead of
  // just a lesson count.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: path.title,
    description: path.description,
    url,
    provider: { '@type': 'Organization', name: 'AskBiz', url: 'https://askbiz.co' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: path.duration,
    },
    coursePrerequisites: path.level,
    numberOfCredits: path.articles.length,
    hasPart: path.articles.map((a, i) => {
      const meta = ARTICLE_BY_SLUG.get(a.slug)
      return {
        '@type': 'LearningResource',
        position: i + 1,
        name: a.title,
        url: meta ? `https://askbiz.co/academy/${a.slug}` : undefined,
        description: meta?.description,
      }
    }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Academy', item: 'https://askbiz.co/academy' },
      { '@type': 'ListItem', position: 2, name: 'Learning Paths', item: 'https://askbiz.co/academy/learning-paths' },
      { '@type': 'ListItem', position: 3, name: path.title, item: url },
    ],
  }

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <style>{`
        .lp-module-card {
          transition: border-color 120ms, box-shadow 120ms;
        }
        .lp-module-card:hover {
          border-color: ${ACC};
          box-shadow: 0 4px 12px rgba(208, 138, 89, 0.1);
        }
        a:focus-visible, button:focus-visible {
          outline: 2px solid ${ACC};
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>

      {/* Header */}
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: '24px clamp(16px, 4vw, 32px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link href={localePath('/academy/learning-paths', lang)} style={{ color: ACC, textDecoration: 'none', fontSize: 12, fontWeight: 600, marginBottom: 16, display: 'inline-block' }}>
            ← Back to Learning Paths
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 54, lineHeight: 1 }}>{path.icon}</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: TX, margin: '0 0 12px 0', letterSpacing: '-0.025em' }}>
                {path.title}
              </h1>
              <p style={{ fontSize: 16, color: TX2, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {path.subtitle}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 11, color: TX2 }}>
                <span>📚 {path.articles.length} articles</span>
                <span>⏱️ {path.duration}</span>
                <span style={{ background: path.color, color: SF, padding: '4px 12px', borderRadius: 6, lineHeight: 1 }}>
                  {path.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'clamp(24px, 6vw, 40px) clamp(16px, 4vw, 32px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Description */}
          <div style={{ marginBottom: 48, background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: TX, marginBottom: 12 }}>About This Learning Path</h2>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: TX2, margin: 0 }}>
              {path.description}
            </p>
          </div>

          {/* Modules — progress tracking is client-side (localStorage), so it
              lives in its own 'use client' component; everything else on this
              page stays server-rendered and crawlable. */}
          <LearningPathModules
            path={path}
            articleMeta={Object.fromEntries(
              path.articles.map(a => {
                const meta = ARTICLE_BY_SLUG.get(a.slug)
                return [a.slug, meta ? { description: meta.description, readTime: meta.readTime, difficulty: meta.difficulty } : undefined]
              })
            )}
          />

          {/* CTA */}
          <div style={{ marginTop: 48, background: ACC, color: SF, borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px 0' }}>Ready to start learning?</h2>
            <p style={{ fontSize: 13, margin: '0 0 24px 0', lineHeight: 1.6 }}>
              Follow this learning path to master {path.title.toLowerCase()}.
            </p>
            <Link href={localePath('/signin', lang)} style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: SF,
              color: ACC,
              textDecoration: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 12,
            }}>
              Get Started Free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
