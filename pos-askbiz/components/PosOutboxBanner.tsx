'use client'
import { useEffect, useState } from 'react'
import { getOutboxCount, replayOfflineQueue } from '@/lib/pos-offline-queue'
import { useLang } from '@/components/LanguageProvider'

// App-wide strip for PIN staff: how many writes are saved on this device waiting to upload. It also drives the
// replay (on load, on every "back online" event, and every 20 s while anything is waiting), so no individual
// screen has to. Renders nothing when the outbox is empty.
export default function PosOutboxBanner() {
  const { tc } = useLang()
  const [count, setCount] = useState(0)

  useEffect(() => {
    let alive = true
    const who = () => {
      try {
        const s = JSON.parse(localStorage.getItem('pos_staff') || 'null')
        return s?.owner_id && s?.id ? { ownerId: s.owner_id as string, staffId: s.id as string } : null
      } catch { return null }
    }
    const tick = async (replay: boolean) => {
      const w = who()
      if (!w) { if (alive) setCount(0); return }
      try {
        if (replay && navigator.onLine) await replayOfflineQueue(w.ownerId, w.staffId).catch(() => {})
        const n = await getOutboxCount(w.ownerId)
        if (alive) setCount(n)
      } catch { /* IndexedDB unavailable: show nothing */ }
    }
    tick(true)
    const onOnline = () => tick(true)
    const timer = setInterval(() => tick(true), 20_000)
    const fast = setInterval(() => tick(false), 4_000) // pick up writes queued by the screen the user is on
    window.addEventListener('online', onOnline)
    return () => { alive = false; clearInterval(timer); clearInterval(fast); window.removeEventListener('online', onOnline) }
  }, [])

  if (count <= 0) return null
  return (
    <div role="status" aria-live="polite" style={{ position: 'sticky', top: 0, zIndex: 190, padding: '8px 16px', background: '#fef3c7', borderBottom: '1px solid #f59e0b', color: '#78350f', fontSize: 13, fontWeight: 600 }}>
      {tc('common.outbox_waiting', { count })}
    </div>
  )
}
