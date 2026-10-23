'use client'
// A printable delivery note for one dispatch: what left, for whom, on what vehicle, with a line for the
// receiver to sign. Deliberately carries NO prices — it travels with the goods, and dispatch prices stay with
// the people allowed to see them. Open it as /factory/delivery-note?id=<dispatch capture id>.
import { useEffect, useState } from 'react'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import { factoryDayKey, setFactoryTz } from '@/lib/factory-tz-client'

interface Dispatch { id: string; product_name: string | null; quantity: number | null; notes: string | null; created_at: string; status: string; party_id?: string | null; captured_by_staff?: { name: string } | null }
interface WaybillRow { capture_id?: string | null; waybill_ref?: string | null; vehicle_ref?: string | null }

export default function DeliveryNotePage() {
  const { tc } = useLang()
  const { session, ready } = usePosAuth()
  const [d, setD] = useState<Dispatch | null | undefined>(undefined)
  const [business, setBusiness] = useState('')
  const [customer, setCustomer] = useState('')
  const [wb, setWb] = useState<WaybillRow | null>(null)

  useEffect(() => {
    if (!ready || !session) return
    const id = new URLSearchParams(window.location.search).get('id')
    if (!id) { setD(null); return }
    const h = session.headers
    fetch(`/api/pos/factory/capture?id=${encodeURIComponent(id)}`, { headers: h })
      .then(r => (r.ok ? r.json() : null))
      .then(async j => {
        setFactoryTz(j?.time_zone)
        const cap: Dispatch | undefined = (j?.captures || [])[0]
        if (!cap || (cap as any).type !== 'dispatch' || cap.status === 'rejected') { setD(null); return }
        setD(cap)
        if (cap.party_id) {
          fetch('/api/pos/factory/parties?kind=customer', { headers: h }).then(r => (r.ok ? r.json() : null))
            .then(p => setCustomer((p?.parties || []).find((x: any) => x.id === cap.party_id)?.name || '')).catch(() => {})
        }
        fetch('/api/pos/factory/waybill', { headers: h }).then(r => (r.ok ? r.json() : null))
          .then(w => setWb((w?.waybills || []).find((x: WaybillRow) => x.capture_id === cap.id) || null)).catch(() => {})
      })
      .catch(() => setD(null))
    fetch('/api/pos/config', { headers: h }).then(r => (r.ok ? r.json() : null)).then(c => setBusiness(c?.business_name || '')).catch(() => {})
  }, [ready, session])

  if (!ready || d === undefined) return <div style={{ padding: 24, fontFamily: 'system-ui' }}>…</div>
  if (!d) return <div style={{ padding: 24, fontFamily: 'system-ui' }}>{tc('factory_waybill.dn_not_found')}</div>

  const row = (label: string, value: string | number | null | undefined) => (
    <tr>
      <td style={{ padding: '10px 0', color: '#555', width: '38%', borderBottom: '1px solid #ddd' }}>{label}</td>
      <td style={{ padding: '10px 0', fontWeight: 600, borderBottom: '1px solid #ddd' }}>{value || '—'}</td>
    </tr>
  )
  return (
    <div style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="no-print" style={{ textAlign: 'right', marginBottom: 12 }}>
          <button onClick={() => window.print()} style={{ minHeight: 44, padding: '0 22px', borderRadius: 10, border: '1px solid #111', background: '#111', color: '#fff', fontSize: 15, cursor: 'pointer' }}>{tc('factory_waybill.dn_print')}</button>
        </div>
        <h1 style={{ fontSize: 26, margin: 0 }}>{business}</h1>
        <h2 style={{ fontSize: 20, margin: '4px 0 20px', color: '#444' }}>{tc('factory_waybill.dn_title')} · {tc('factory_waybill.dn_no')} {d.id.slice(0, 8).toUpperCase()}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <tbody>
            {row(tc('factory_waybill.dn_date'), factoryDayKey(d.created_at))}
            {row(tc('factory_waybill.dn_customer'), customer)}
            {row(tc('factory_waybill.dn_destination'), d.notes)}
            {row(tc('factory_waybill.dn_item'), d.product_name)}
            {row(tc('factory_waybill.dn_qty'), d.quantity != null ? Number(d.quantity).toLocaleString() : null)}
            {row(tc('factory_waybill.dn_vehicle'), wb?.vehicle_ref)}
            {row(tc('factory_waybill.dn_waybill'), wb?.waybill_ref)}
            {row(tc('factory_waybill.dn_dispatched_by'), d.captured_by_staff?.name)}
          </tbody>
        </table>
        <div style={{ marginTop: 56 }}>
          <div style={{ borderBottom: '1px solid #111', height: 40 }} />
          <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>{tc('factory_waybill.dn_received_by')}</div>
        </div>
      </div>
      <style>{`@media print { .no-print { display: none !important } body { background: #fff } }`}</style>
    </div>
  )
}
