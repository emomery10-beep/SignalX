'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isInventoryLevel, isManagerOrAboveLevel } from '@/lib/pos-role-client'
import { useLang } from '@/components/LanguageProvider'
import PurchaseOrdersTab from '@/components/pos/PurchaseOrdersTab'

const API = process.env.NEXT_PUBLIC_API_URL || ''

interface StaffSession { id: string; name: string; role: string; owner_id: string; currency_symbol?: string }

export default function InventoryPurchaseOrdersPage() {
  const router = useRouter()
  const { tc } = useLang()
  const [staff, setStaff] = useState<StaffSession | null>(null)
  const [sym, setSym] = useState('£')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const notify = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    if (!isInventoryLevel(s.role) && !isManagerOrAboveLevel(s.role)) { router.push('/sell'); return }
    setStaff(s)
    setSym(s.currency_symbol || '£')
    fetch(`${API}/api/pos/config`, {
      headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
    }).then(r => r.json()).then(cfg => {
      if (cfg.currency_symbol) setSym(cfg.currency_symbol)
    }).catch(() => {})
  }, [])

  if (!staff) return null

  const authHeaders = { 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg,var(--bg))' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 2000, padding: '10px 18px', borderRadius: 10, background: toast.ok ? 'rgba(34,197,94,.15)' : 'rgba(220,38,38,.15)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,.3)' : 'rgba(220,38,38,.3)'}`, color: toast.ok ? '#16a34a' : '#dc2626', fontSize: 14, fontWeight: 500 }}>
          {toast.msg}
        </div>
      )}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/inventory')} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--tx2)', fontFamily: 'inherit' }}>
          ← {tc('inventory.title')}
        </button>
      </div>
      <div style={{ padding: 20 }}>
        <PurchaseOrdersTab
          currencySymbol={sym}
          selectedLocation="all"
          notify={notify}
          t={(k, v) => tc('pos.' + k, v)}
          authHeaders={authHeaders}
          canSend={isManagerOrAboveLevel(staff.role)}
        />
      </div>
    </div>
  )
}
