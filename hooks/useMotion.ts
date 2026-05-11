'use client'
import { useEffect, useRef } from 'react'

/**
 * useMotion — wires up scroll-driven entrance animations.
 * Add data-motion (or data-motion="left|right|scale|fade") to any element.
 * Add data-motion-group to a container to stagger-animate its children.
 * The hook adds .is-visible when the element enters the viewport.
 */
export function useMotion() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Once visible, stop observing (one-shot entrance)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    // Observe all [data-motion] and [data-motion-group] elements
    const elements = document.querySelectorAll('[data-motion], [data-motion-group]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

/**
 * useMotionRef — for a single element, returns a ref.
 * Usage: const ref = useMotionRef(); <div ref={ref} data-motion>...</div>
 */
export function useMotionRef<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
