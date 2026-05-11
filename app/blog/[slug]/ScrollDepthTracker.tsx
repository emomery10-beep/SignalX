'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function ScrollDepthTracker({ slug }: { slug: string }) {
  const fired = useRef(new Set<number>())

  useEffect(() => {
    function onScroll() {
      const el = document.getElementById('article-body')
      if (!el || !window.gtag) return
      const top    = el.getBoundingClientRect().top
      const height = el.offsetHeight
      const pct    = Math.min(100, Math.max(0, (-top / (height - window.innerHeight + 120)) * 100))
      const milestones = [25, 50, 75, 100]
      for (const m of milestones) {
        if (pct >= m && !fired.current.has(m)) {
          fired.current.add(m)
          window.gtag('event', 'scroll_depth', {
            event_category: 'Blog',
            event_label: slug,
            value: m,
          })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  return null
}
