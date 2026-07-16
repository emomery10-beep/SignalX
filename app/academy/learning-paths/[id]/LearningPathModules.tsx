'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath, toLocale } from '@/lib/i18n-locale'
import type { LearningPath } from '@/lib/learning-paths-content'

const ACC = '#95592b' // AA-compliant text variant of the brand amber (see Help Centre --hc-accent-dark)
const SF  = '#ffffff'
const TX  = '#171512'
const TX2 = '#5c574f'
const TX3 = '#6a655c' // darkened from #a39e97 (2.5:1) to meet 4.5:1 on white/SF
const BD  = '#e8e6e1'

function storageKey(pathId: string) {
  return `askbiz_academy_path_${pathId}_read`
}

interface ArticleMeta {
  description?: string
  readTime?: number
  difficulty?: string
}

export default function LearningPathModules({
  path,
  articleMeta,
}: {
  path: LearningPath
  articleMeta: Record<string, ArticleMeta | undefined>
}) {
  const { lang } = useLang()
  const [read, setRead] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  // Hydrate after mount only — reading localStorage during SSR/first paint
  // would mismatch the server-rendered markup and trigger a hydration warning.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(path.id))
      if (raw) setRead(new Set(JSON.parse(raw)))
    } catch { /* localStorage unavailable (private mode, etc.) — degrade to unread */ }
    setHydrated(true)
  }, [path.id])

  function toggleRead(slug: string) {
    setRead(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      try { localStorage.setItem(storageKey(path.id), JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }

  const doneCount = path.articles.filter(a => read.has(a.slug)).length
  const pct = path.articles.length > 0 ? Math.round((doneCount / path.articles.length) * 100) : 0

  return (
    <>
      {/* Progress bar — mirrors the pattern already built for Academy Checklists */}
      <div style={{ marginBottom: 32, background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, height: 8, background: BD, borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: path.color, borderRadius: 9999, transition: hydrated ? 'width 300ms' : 'none' }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? '#1e7e34' : path.color, flexShrink: 0, minWidth: 90, textAlign: 'right' }}>
          {doneCount}/{path.articles.length} {pct === 100 ? 'complete' : `read (${pct}%)`}
        </span>
      </div>

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: TX, marginBottom: 24 }}>Modules ({path.articles.length})</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {path.articles.map((article, index) => {
            const meta = articleMeta[article.slug]
            const blurb = meta?.description || 'Part of this AskBiz Academy learning path.'
            const readLabel = meta ? `${meta.readTime} min read · ${meta.difficulty}` : 'AskBiz Academy'
            const isRead = read.has(article.slug)

            const card = (
              <div
                className="lp-module-card"
                style={{
                  background: SF,
                  border: `1px solid ${isRead ? path.color + '40' : BD}`,
                  borderRadius: 10,
                  padding: 20,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                {/* Checkmark toggle — click marks/unmarks read without navigating */}
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); toggleRead(article.slug) }}
                  aria-label={isRead ? `Mark "${article.title}" as unread` : `Mark "${article.title}" as read`}
                  aria-pressed={isRead}
                  style={{
                    minWidth: 36, width: 36, height: 36, borderRadius: '50%',
                    background: isRead ? path.color : SF,
                    color: isRead ? '#fff' : path.color,
                    border: `1.5px solid ${path.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, marginTop: 2, flexShrink: 0,
                    cursor: 'pointer', padding: 0,
                  }}
                >
                  {isRead ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L19 7"/></svg>
                  ) : index + 1}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: TX, margin: '0 0 4px 0' }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: 12, color: TX2, margin: '0 0 6px 0', lineHeight: 1.5 }}>
                    {blurb}
                  </p>
                  <p style={{ fontSize: 11, color: TX3, margin: 0 }}>
                    {readLabel}
                  </p>
                </div>
                <div style={{ fontSize: 16, color: meta ? ACC : TX3, flexShrink: 0 }}>→</div>
              </div>
            )

            return meta ? (
              <Link
                key={article.slug}
                href={localePath(`/academy/${article.slug}`, toLocale(lang))}
                style={{ textDecoration: 'none' }}
                onClick={() => {
                  // Reading an article counts as progress even if the reader
                  // never comes back to click the checkmark manually.
                  if (!read.has(article.slug)) toggleRead(article.slug)
                }}
              >
                {card}
              </Link>
            ) : (
              <div key={article.slug}>{card}</div>
            )
          })}
        </div>
      </div>
    </>
  )
}
