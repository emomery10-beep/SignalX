'use client'
import { useEffect } from 'react'

const focusRing = 'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-500'

// Shared overlay pattern — no reusable modal existed anywhere in this app
// before the Settings/Billing work; this is the one place it's defined.
// Click-to-close backdrop + centered card, Escape-to-close, scroll lock —
// same conventions as the fixed-overlay pattern used elsewhere in the
// broader AskBiz codebase, rebuilt here in this app's own ink-*/signal-*
// Tailwind language instead of that pattern's inline styles.
export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800 sticky top-0 bg-ink-900">
          <h2 id="modal-title" className="font-display text-base font-bold text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className={`w-8 h-8 rounded-md flex items-center justify-center text-ink-400 hover:text-ink-50 hover:bg-ink-800 transition-colors ${focusRing}`}
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
