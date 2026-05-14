import Link from 'next/link'
import { LEARNING_PATHS } from '@/lib/learning-paths-content'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

export async function generateStaticParams() {
  return LEARNING_PATHS.map((path) => ({
    id: path.id,
  }))
}

export const metadata = {
  title: 'Learning Path | AskBiz Academy',
  description: 'Structured learning path from AskBiz Academy',
}

export default function LearningPathPage({ params }: { params: { id: string } }) {
  const id = params.id
  const path = LEARNING_PATHS.find(p => p.id === id)

  if (!path) {
    return (
      <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 560 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: TX, marginBottom: 12 }}>Learning Path Not Found</h1>
          <p style={{ fontSize: 15, color: TX2, marginBottom: 36 }}>The learning path you're looking for doesn't exist.</p>
          <Link href="/academy/learning-paths" style={{ display: 'inline-block', padding: '12px 28px', background: ACC, color: SF, textDecoration: 'none', borderRadius: 10, fontWeight: 700 }}>
            ← Back to Learning Paths
          </Link>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: path.title,
    description: path.description,
    url: `https://askbiz.co/academy/learning-paths/${path.id}`,
    duration: path.duration,
    courseLevel: path.level,
    numberOfItems: path.articles.length,
  }

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .lp-module-card {
          transition: all 120ms;
          cursor: pointer;
        }
        .lp-module-card:hover {
          border-color: ${ACC};
          box-shadow: 0 4px 12px rgba(208, 138, 89, 0.1);
        }
      `}</style>

      {/* Header */}
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: '24px clamp(16px, 4vw, 32px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/academy/learning-paths" style={{ color: ACC, textDecoration: 'none', fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'inline-block' }}>
            ← Back to Learning Paths
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>{path.icon}</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: TX, margin: '0 0 12px 0', letterSpacing: '-0.025em' }}>
                {path.title}
              </h1>
              <p style={{ fontSize: 18, color: TX2, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {path.subtitle}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: TX2 }}>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: TX, marginBottom: 12 }}>About This Learning Path</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: TX2, margin: 0 }}>
              {path.description}
            </p>
          </div>

          {/* Modules */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: TX, marginBottom: 24 }}>Modules ({path.articles.length})</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {path.articles.map((article, index) => (
                <div
                  key={article.slug}
                  className="lp-module-card"
                  style={{
                    background: SF,
                    border: `1px solid ${BD}`,
                    borderRadius: 10,
                    padding: 20,
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    background: path.color,
                    color: SF,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    marginTop: 2,
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: TX, margin: '0 0 4px 0' }}>
                      {article.title}
                    </h3>
                    <p style={{ fontSize: 13, color: TX3, margin: 0 }}>
                      Article from AskBiz Academy
                    </p>
                  </div>
                  <div style={{ fontSize: 18 }}>→</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 48, background: ACC, color: SF, borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px 0' }}>Ready to start learning?</h2>
            <p style={{ fontSize: 15, margin: '0 0 24px 0', lineHeight: 1.6 }}>
              Follow this learning path to master {path.title.toLowerCase()}.
            </p>
            <Link href="/signin" style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: SF,
              color: ACC,
              textDecoration: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
            }}>
              Get Started Free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
