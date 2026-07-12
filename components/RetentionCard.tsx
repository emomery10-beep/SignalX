'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const B2   = 'rgba(0,0,0,.14)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

interface Customer {
  customer_ref:     string
  customer_name:    string | null
  last_order_date:  string | null
  days_since_order: number
  order_count:      number
  total_spend:      number
  churn_risk_score: number
  churn_risk_label: string
}

interface ScanSummary {
  customers_scored: number
  at_risk_count:    number
  watch_count:      number
  churned_count:    number
  scanned_at:       string
}

function buildRiskStyle(tc: (key: string) => string) {
  return {
    at_risk: { text: '#dc2626', bg: 'rgba(220,38,38,.08)', border: 'rgba(220,38,38,.2)', label: tc('retention_card.riskLabelAtRisk') },
    watch:   { text: '#d97706', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.2)', label: tc('retention_card.riskLabelWatch') },
    churned: { text: '#6b6760', bg: 'rgba(107,103,96,.08)', border: 'rgba(107,103,96,.2)', label: tc('retention_card.riskLabelChurned') },
    healthy: { text: '#16a34a', bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.2)', label: tc('retention_card.riskLabelHealthy') },
  }
}

export default function RetentionCard({ symbol = '£' }: { symbol?: string }) {
  const router = useRouter()
  const { tc } = useLang()
  const [customers, setCustomers]   = useState<Customer[]>([])
  const [summary, setSummary]       = useState<ScanSummary | null>(null)
  const [loading, setLoading]       = useState(true)
  const [scanning, setScanning]     = useState(false)
  const [noData, setNoData]         = useState(false)
  const [expanded, setExpanded]     = useState(false)

  const RISK_STYLE = buildRiskStyle(tc)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/churn-scan')
      const data = await res.json()
      setCustomers(data.customers || [])
      setSummary(data.last_scan || null)
    } catch {}
    finally { setLoading(false) }
  }

  const runScan = async () => {
    setScanning(true)
    try {
      const res = await fetch('/api/churn-scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'manual' }) })
      const data = await res.json()
      if (data.error === 'no_data' || data.error === 'no_customers') {
        setNoData(true)
      } else if (data.success) {
        setCustomers(data.top_at_risk || [])
        await loadData()
      }
    } catch {}
    finally { setScanning(false) }
  }

  const askAboutCustomer = (c: Customer) => {
    const name = c.customer_name || c.customer_ref
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', {
      detail: tc('retention_card.askCustomerPrompt', { name, days: c.days_since_order, orders: c.order_count, symbol, ltv: c.total_spend.toFixed(0) })
    })), 400)
  }

  const atRisk  = customers.filter(c => c.churn_risk_label === 'at_risk')
  const watch   = customers.filter(c => c.churn_risk_label === 'watch')
  const ltv     = atRisk.reduce((s, c) => s + c.total_spend, 0)
  const visible = expanded ? customers : customers.slice(0, 4)

  if (loading) {
    return (
      <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ height: 16, width: 160, background: EV, borderRadius: 6, marginBottom: 8 }}/>
        <div style={{ height: 60, background: EV, borderRadius: 10 }}/>
      </div>
    )
  }

  // No scan run yet
  if (!summary && !noData) {
    return (
      <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '16px 18px', marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>{tc('retention_card.sectionHeading')}</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 26 }}>👥</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TX, marginBottom: 4 }}>{tc('retention_card.emptyHeading')}</div>
            <div style={{ fontSize: 11, color: TX2, lineHeight: 1.5, marginBottom: 12 }}>
              {tc('retention_card.emptyBody')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={runScan}
                disabled={scanning}
                style={{ fontSize: 10, fontWeight: 600, background: ACC, color: '#fff', border: 'none', borderRadius: 9, padding: '8px 14px', cursor: scanning ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: scanning ? .7 : 1, boxShadow: '0 2px 8px rgba(208,138,89,.25)' }}
              >
                {scanning ? tc('retention_card.scanning') : tc('retention_card.scanNow')}
              </button>
              <button
                onClick={() => router.push('/ask')}
                style={{ fontSize: 10, color: TX2, background: 'transparent', border: `1px solid ${B2}`, borderRadius: 9, padding: '8px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {tc('retention_card.uploadDataFirst')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No customer data found in upload
  if (noData) {
    return (
      <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '16px 18px', marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>{tc('retention_card.sectionHeading')}</div>
        <div style={{ fontSize: 11, color: TX2, lineHeight: 1.6 }}>
          {tc('retention_card.noDataBody')}
        </div>
        <button onClick={() => router.push('/ask')} style={{ marginTop: 10, fontSize: 10, fontWeight: 600, color: ACC, background: 'transparent', border: `1px solid rgba(208,138,89,.3)`, borderRadius: 9, padding: '7px 13px', cursor: 'pointer', fontFamily: 'inherit' }}>
          {tc('retention_card.uploadCustomerData')}
        </button>
      </div>
    )
  }

  // All healthy
  if (customers.length === 0) {
    return (
      <div style={{ background: 'rgba(34,197,94,.04)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 16, padding: '16px 18px', marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{tc('retention_card.sectionHeading')}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>{tc('retention_card.allHealthy')}</div>
            <div style={{ fontSize: 10, color: TX3, marginTop: 2 }}>
              {tc('retention_card.customersScored', { n: summary?.customers_scored || 0, date: summary ? new Date(summary.scanned_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '' })}
            </div>
          </div>
          <button onClick={runScan} disabled={scanning} style={{ marginLeft: 'auto', fontSize: 9, color: TX3, background: 'transparent', border: `1px solid ${B}`, borderRadius: 9, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {scanning ? tc('retention_card.scanning') : tc('retention_card.rescan')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '16px 18px', marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{tc('retention_card.sectionHeading')}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: TX }}>
            {atRisk.length > 0 ? (
              <span style={{ color: '#dc2626' }}>{tc('retention_card.atRiskStat', { n: atRisk.length, symbol, ltv: ltv.toFixed(0) })}</span>
            ) : (
              <span style={{ color: '#d97706' }}>{tc('retention_card.watchStat', { n: watch.length })}</span>
            )}
            {watch.length > 0 && atRisk.length > 0 && <span style={{ color: TX3, fontSize: 10, fontWeight: 400, marginLeft: 6 }}>{tc('retention_card.watchExtra', { n: watch.length })}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            onClick={() => { router.push('/ask'); setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: tc('retention_card.askAllAtRisk') })), 400) }}
            style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 8, padding: '5px 11px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {tc('retention_card.askAskBiz')}
          </button>
          <button onClick={runScan} disabled={scanning} style={{ fontSize: 9, color: TX3, background: 'transparent', border: `1px solid ${B}`, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {scanning ? tc('retention_card.scanning') : tc('retention_card.rescan')}
          </button>
        </div>
      </div>

      {/* Customer list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 10 }}>
        {visible.map((c, i) => {
          const risk = RISK_STYLE[c.churn_risk_label as keyof typeof RISK_STYLE] || RISK_STYLE.watch
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: risk.bg, border: `1px solid ${risk.border}`, borderRadius: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TX }}>{c.customer_name || c.customer_ref}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: risk.text }}>{risk.label}</span>
                </div>
                <div style={{ fontSize: 9, color: TX3 }}>
                  {tc('retention_card.customerRowMeta', { days: c.days_since_order, orders: c.order_count, symbol, ltv: c.total_spend.toFixed(0) })}
                </div>
              </div>
              <button
                onClick={() => askAboutCustomer(c)}
                style={{ fontSize: 9, fontWeight: 600, color: risk.text, background: 'transparent', border: `1px solid ${risk.border}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
              >
                {tc('retention_card.analyse')}
              </button>
            </div>
          )
        })}
      </div>

      {/* Show more */}
      {customers.length > 4 && (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{ width: '100%', fontSize: 10, color: TX3, background: 'transparent', border: `1px solid ${B}`, borderRadius: 9, padding: '7px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {expanded ? tc('retention_card.showLess') : tc('retention_card.showMore', { n: customers.length - 4 })}
        </button>
      )}

      {/* Last scan note */}
      {summary && (
        <div style={{ fontSize: 9, color: TX3, marginTop: 8, textAlign: 'right' }}>
          {tc('retention_card.customersScored', { n: summary.customers_scored, date: new Date(summary.scanned_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) })}
        </div>
      )}
    </div>
  )
}
