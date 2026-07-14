'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import { LEARNING_PATHS } from '@/lib/learning-paths-content'

const ACC = '#95592b' // AA-compliant amber text
const SF  = '#ffffff'
const TX  = '#171512'
const TX2 = '#5c574f'
const BD  = '#e8e6e1'

function readCountFor(pathId: string, total: number): number {
  try {
    const raw = localStorage.getItem(`askbiz_academy_path_${pathId}_read`)
    if (!raw) return 0
    const arr = JSON.parse(raw) as string[]
    // Clamp to the path length — stale slugs (e.g. after content edits) must
    // never push the count above 100%.
    return Math.min(Array.isArray(arr) ? arr.length : 0, total)
  } catch {
    return 0
  }
}

// Udemy-style "resume where you left off". Reads the same per-path localStorage
// keys the path detail pages write, and surfaces any started-but-unfinished
// path at the top of the hub. Renders nothing until it finds in-progress work,
// so first-time and finished visitors see no empty band.
export default function ContinueLearning() {
  const { lang, tc } = useLang()
  const [inProgress, setInProgress] = useState<
    { id: string; title: string; icon: string; color: string; done: number; total: number; pct: number }[]
  >([])

  useEffect(() => {
    const rows = LEARNING_PATHS
      .map(p => {
        const total = p.articles.length
        const done = readCountFor(p.id, total)
        return { id: p.id, title: p.title, icon: p.icon, color: p.color, done, total, pct: total ? Math.round((done / total) * 100) : 0 }
      })
      .filter(r => r.done > 0 && r.done < r.total)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3)
    setInProgress(rows)
  }, [])

  if (inProgress.length === 0) return null

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 12, letterSpacing: '-.01em' }}>
        {tc('academy.lp_continue_learning')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {inProgress.map(r => (
          <Link
            key={r.id}
            href={localePath(`/academy/learning-paths/${r.id}`, lang)}
            style={{ display: 'block', textDecoration: 'none', background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '16px 18px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
              <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 700, color: TX, lineHeight: 1.3, flex: 1 }}>{r.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 6, background: BD, borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 9999 }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: r.color, flexShrink: 0, whiteSpace: 'nowrap' }}>{r.done}/{r.total}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: ACC, marginTop: 10 }}>{tc('academy.lp_continue_cta')} →</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
