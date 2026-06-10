'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import { useState, useEffect, useMemo } from 'react'

interface Source {
  id: string; source_type: string; name: string; status: string
  last_synced_at: string | null; sync_interval_minutes: number
  error_message: string | null; created_at: string
}

type SourceDef = {
  id: string; label: string; category: string; desc: string
  icon: string; accent: string; color: string; oauthFlow: boolean
  hint: string
  fields: { key: string; label: string; placeholder: string; type: string; required: boolean }[]
}

const SOURCES: SourceDef[] = [
  // ── E-Commerce ────────────────────────────────────────────────────────────
  { id: 'shopify',    label: 'Shopify',     category: 'E-Commerce', desc: 'Orders, products, inventory, customers',         icon: '🛍️', accent: '#95bf47', color: 'rgba(149,191,71,.1)',  oauthFlow: true,  hint: "Enter your store domain — you'll approve access in Shopify", fields: [{ key: 'shop', label: 'Store domain', placeholder: 'mystore.myshopify.com', type: 'text', required: true }] },
  { id: 'amazon_fba', label: 'Amazon FBA',  category: 'E-Commerce', desc: 'FBA orders, inventory, fees, returns',           icon: '📦', accent: '#ff9900', color: 'rgba(255,153,0,.1)',   oauthFlow: true,  hint: 'Redirects to Amazon Seller Central — read-only access',      fields: [] },
  { id: 'ebay',       label: 'eBay',        category: 'E-Commerce', desc: 'Listings, orders, seller metrics, fees',         icon: '🏷️', accent: '#e53238', color: 'rgba(229,50,56,.1)',   oauthFlow: true,  hint: 'Redirects to eBay — read-only access to your seller account', fields: [] },
  { id: 'etsy',       label: 'Etsy',        category: 'E-Commerce', desc: 'Shop stats, orders, listings, revenue',          icon: '🧶', accent: '#f1641e', color: 'rgba(241,100,30,.1)',  oauthFlow: true,  hint: 'Redirects to Etsy — read-only access',                       fields: [] },
  { id: 'woocommerce',label: 'WooCommerce', category: 'E-Commerce', desc: 'Orders, products, customers, revenue',           icon: '🛒', accent: '#7f54b3', color: 'rgba(127,84,179,.1)',  oauthFlow: false, hint: 'Paste your REST API keys from WooCommerce › Settings › Advanced › REST API', fields: [{ key: 'site_url', label: 'Site URL', placeholder: 'https://mystore.com', type: 'text', required: true }, { key: 'consumer_key', label: 'Consumer Key', placeholder: 'ck_xxxxxxxxxxxx', type: 'text', required: true }, { key: 'consumer_secret', label: 'Consumer Secret', placeholder: 'cs_xxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'walmart',    label: 'Walmart',     category: 'E-Commerce', desc: 'Marketplace orders, inventory, performance',     icon: '🏪', accent: '#0071ce', color: 'rgba(0,113,206,.1)',   oauthFlow: false, hint: 'Paste your API keys from Walmart Seller Center › Developer Tools', fields: [{ key: 'client_id', label: 'Client ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text', required: true }, { key: 'client_secret', label: 'Client Secret', placeholder: 'xxxxxxxxxxxx', type: 'password', required: true }] },

  // ── Accounting ────────────────────────────────────────────────────────────
  { id: 'quickbooks', label: 'QuickBooks',  category: 'Accounting', desc: 'P&L, invoices, expenses, cash flow',             icon: '📒', accent: '#2ca02c', color: 'rgba(44,160,44,.1)',   oauthFlow: true,  hint: 'Redirects to Intuit — read-only access',                     fields: [] },
  { id: 'xero',       label: 'Xero',        category: 'Accounting', desc: 'Invoices, bank reconciliation, P&L, payroll',    icon: '📘', accent: '#13b5ea', color: 'rgba(19,181,234,.1)',  oauthFlow: true,  hint: 'Redirects to Xero — read-only access',                       fields: [] },
  { id: 'sage',       label: 'Sage',        category: 'Accounting', desc: 'Accounts, invoices, payroll, VAT returns',       icon: '💚', accent: '#00b050', color: 'rgba(0,176,80,.1)',    oauthFlow: false, hint: 'Paste your credentials from Sage Developer Portal › My Applications', fields: [{ key: 'client_id', label: 'Client ID', placeholder: 'xxxxxxxxxxxxxxxx', type: 'text', required: true }, { key: 'client_secret', label: 'Client Secret', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'freeagent',  label: 'FreeAgent',   category: 'Accounting', desc: 'Invoices, expenses, tax timeline, cash flow',    icon: '🟠', accent: '#f26a21', color: 'rgba(242,106,33,.1)',  oauthFlow: true,  hint: 'Redirects to FreeAgent — read-only access',                  fields: [] },
  { id: 'wave',       label: 'Wave',        category: 'Accounting', desc: 'Invoices, receipts, payroll, accounting',        icon: '🌊', accent: '#1e88e5', color: 'rgba(30,136,229,.1)',  oauthFlow: false, hint: 'Paste your Wave API token from Wave › Settings › Developer', fields: [{ key: 'access_token', label: 'Access Token', placeholder: 'wave_xxxxxxxxxxxx', type: 'password', required: true }] },

  // ── Payments ──────────────────────────────────────────────────────────────
  { id: 'stripe',     label: 'Stripe',      category: 'Payments', desc: 'Payments, payouts, refunds, transactions',         icon: '💳', accent: '#635bff', color: 'rgba(99,91,255,.1)',   oauthFlow: false, hint: 'Paste your Stripe secret or restricted key from Dashboard → Developers → API keys', fields: [{ key: 'secret_key', label: 'Secret Key', placeholder: 'sk_live_… or rk_live_…', type: 'password', required: true }] },
  { id: 'paypal',     label: 'PayPal',      category: 'Payments', desc: 'Transactions, payouts, refunds, disputes',         icon: '🅿️', accent: '#0070e0', color: 'rgba(0,112,224,.1)',   oauthFlow: true,  hint: 'Redirects to PayPal — read-only access',                     fields: [] },
  { id: 'gocardless', label: 'GoCardless',  category: 'Payments', desc: 'Direct debit payments, subscriptions, mandates',   icon: '🏦', accent: '#f46a35', color: 'rgba(244,106,53,.1)',  oauthFlow: true,  hint: 'Redirects to GoCardless — read-only access',                 fields: [] },
  { id: 'klarna',     label: 'Klarna',      category: 'Payments', desc: 'BNPL orders, conversion rates, settlements',       icon: '🌸', accent: '#ff6b8a', color: 'rgba(255,107,138,.1)', oauthFlow: false, hint: 'Paste your credentials from Klarna Merchant Portal › API Credentials', fields: [{ key: 'username', label: 'API Username (UID)', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text', required: true }, { key: 'password', label: 'API Password', placeholder: 'xxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'sumup',      label: 'SumUp',       category: 'Payments', desc: 'Card reader sales, POS transactions, daily totals',icon: '💵', accent: '#1a1a2e', color: 'rgba(26,26,46,.08)',   oauthFlow: false, hint: 'Paste your API key from SumUp Dashboard › API Keys', fields: [{ key: 'access_token', label: 'Access Token', placeholder: 'sup_sk_xxxxxxxxxxxx', type: 'password', required: true }] },

  // ── Marketing & Ads ───────────────────────────────────────────────────────
  { id: 'meta_ads',         label: 'Meta Ads',         category: 'Marketing & Ads', desc: 'Facebook & Instagram ad spend, ROAS, CPM, CPC', icon: '📣', accent: '#0081fb', color: 'rgba(0,129,251,.1)',  oauthFlow: true,  hint: 'Redirects to Meta — grants read access to your ad accounts',         fields: [] },
  { id: 'google_ads',       label: 'Google Ads',       category: 'Marketing & Ads', desc: 'Search campaigns, spend, ROAS, conversions',     icon: '🎯', accent: '#4285f4', color: 'rgba(66,133,244,.1)', oauthFlow: true,  hint: 'Redirects to Google — read-only access to your ad accounts',         fields: [] },
  { id: 'google_analytics', label: 'Google Analytics', category: 'Marketing & Ads', desc: 'Traffic, sessions, funnels, e-commerce revenue',  icon: '📈', accent: '#e8710a', color: 'rgba(232,113,10,.1)', oauthFlow: true,  hint: 'Redirects to Google — read-only access to your GA4 property',        fields: [] },
  { id: 'klaviyo',          label: 'Klaviyo',          category: 'Marketing & Ads', desc: 'Email revenue, flows, open rates, attribution',   icon: '📧', accent: '#6c47ff', color: 'rgba(108,71,255,.1)', oauthFlow: false, hint: 'Paste your private API key from Klaviyo › Account › Settings › API Keys', fields: [{ key: 'api_key', label: 'Private API Key', placeholder: 'pk_xxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'mailchimp',        label: 'Mailchimp',        category: 'Marketing & Ads', desc: 'Campaigns, open rates, click rates, audience',    icon: '🐒', accent: '#f0b429', color: 'rgba(240,180,41,.15)', oauthFlow: true,  hint: 'Redirects to Mailchimp — read-only access',                          fields: [] },

  // ── Social Commerce ───────────────────────────────────────────────────────
  { id: 'tiktok_shop', label: 'TikTok Shop',        category: 'Social Commerce', desc: 'Orders, video analytics, product performance',        icon: '🎵', accent: '#010101', color: 'rgba(1,1,1,.06)',      oauthFlow: false, hint: 'Paste your access token from TikTok Partner Center › Apps', fields: [{ key: 'access_token', label: 'Access Token', placeholder: 'act.xxxxxxxxxxxx', type: 'password', required: true }, { key: 'shop_id', label: 'Shop ID', placeholder: '7xxxxxxxxxxxxxxxxx', type: 'text', required: true }] },
  { id: 'instagram',   label: 'Instagram Shopping', category: 'Social Commerce', desc: 'Post insights, product clicks, shopping orders',       icon: '📸', accent: '#E1306C', color: 'rgba(225,48,108,.06)', oauthFlow: false, hint: 'Paste your Meta Graph API token from Meta Business Suite › Apps', fields: [{ key: 'access_token', label: 'Access Token', placeholder: 'EAAxxxxxxxxxxxx', type: 'password', required: true }, { key: 'ig_user_id', label: 'Instagram User ID', placeholder: '17xxxxxxxxxxxxxxxxx', type: 'text', required: true }, { key: 'catalog_id', label: 'Catalog ID (optional)', placeholder: '10xxxxxxxxxx', type: 'text', required: false }] },
  { id: 'pinterest',   label: 'Pinterest',          category: 'Social Commerce', desc: 'Pin analytics, saves, product catalog performance',    icon: '📌', accent: '#E60023', color: 'rgba(230,0,35,.06)',   oauthFlow: false, hint: 'Paste your access token from Pinterest Business › Apps', fields: [{ key: 'access_token', label: 'Access Token', placeholder: 'pina_xxxxxxxxxxxx', type: 'password', required: true }] },

  // ── Inventory & Logistics ─────────────────────────────────────────────────
  { id: 'linnworks',   label: 'Linnworks',   category: 'Inventory & Logistics', desc: 'Multi-channel inventory, orders, fulfilment',          icon: '🗂️', accent: '#e84545', color: 'rgba(232,69,69,.1)',   oauthFlow: true,  hint: 'Redirects to Linnworks — read-only access',                          fields: [] },
  { id: 'cin7',        label: 'Cin7',        category: 'Inventory & Logistics', desc: 'Inventory, purchase orders, B2B sales, 3PL',           icon: '🏭', accent: '#ff6b35', color: 'rgba(255,107,53,.1)',  oauthFlow: false, hint: 'Paste your API key from Cin7 › Settings › API',                      fields: [{ key: 'account_id', label: 'Account ID', placeholder: 'xxxxxxxxxxxx', type: 'text', required: true }, { key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'shipstation', label: 'ShipStation', category: 'Inventory & Logistics', desc: 'Shipments, tracking, carriers, shipping costs',         icon: '🚚', accent: '#3a6eb5', color: 'rgba(58,110,181,.1)',  oauthFlow: false, hint: 'Paste your API keys from ShipStation › Account Settings › API Settings', fields: [{ key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'text', required: true }, { key: 'api_secret', label: 'API Secret', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'royal_mail',  label: 'Royal Mail',  category: 'Inventory & Logistics', desc: 'Parcel tracking, costs, Click & Drop orders',           icon: '📮', accent: '#e2001a', color: 'rgba(226,0,26,.1)',    oauthFlow: false, hint: 'Paste your Click & Drop API key from Click & Drop › Settings › API', fields: [{ key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'password', required: true }] },

  // ── Point of Sale ─────────────────────────────────────────────────────────
  { id: 'square', label: 'Square', category: 'Point of Sale', desc: 'Orders, inventory, payments, locations',                                  icon: '⬛', accent: '#3d3d3d', color: 'rgba(100,100,100,.08)', oauthFlow: false, hint: 'Paste your access token from the Square Developer Dashboard', fields: [{ key: 'access_token', label: 'Access token', placeholder: 'EAAAl...', type: 'password', required: true }, { key: 'location_id', label: 'Location ID (optional)', placeholder: 'L...', type: 'text', required: false }] },

  // ── Data ──────────────────────────────────────────────────────────────────
  { id: 'google_sheets', label: 'Google Sheets', category: 'Data', desc: 'Any spreadsheet — sales, stock, costs, P&L',                         icon: '📊', accent: '#34a853', color: 'rgba(52,168,83,.1)',   oauthFlow: true,  hint: 'Paste a Spreadsheet ID, or leave blank to choose after connecting', fields: [{ key: 'spreadsheet_id', label: 'Spreadsheet ID (optional)', placeholder: '1BxiMVs0XRA5...', type: 'text', required: false }] },
]

const OAUTH_URL: Record<string, (f: Record<string, string>) => string> = {
  // E-Commerce
  shopify:          (f) => `/api/auth/shopify?shop=${encodeURIComponent(f.shop || '')}`,
  amazon_fba:       ()  => '/api/auth/amazon',
  ebay:             ()  => '/api/auth/ebay',
  etsy:             ()  => '/api/auth/etsy',
  // Accounting
  quickbooks:       ()  => '/api/auth/quickbooks',
  xero:             ()  => '/api/auth/xero',
  freeagent:        ()  => '/api/auth/freeagent',
  // Payments
  paypal:           ()  => '/api/auth/paypal',
  gocardless:       ()  => '/api/auth/gocardless',
  // Marketing & Ads
  meta_ads:         ()  => '/api/auth/meta',
  google_ads:       ()  => '/api/auth/google-ads',
  google_analytics: ()  => '/api/auth/google-analytics',
  mailchimp:        ()  => '/api/auth/mailchimp',
  // Inventory
  linnworks:        ()  => '/api/auth/linnworks',
  // Data
  google_sheets:    (f) => `/api/auth/google?spreadsheet_id=${encodeURIComponent(f.spreadsheet_id || '')}`,
}

const CATEGORY_ORDER = [
  'E-Commerce', 'Accounting', 'Payments', 'Marketing & Ads',
  'Social Commerce', 'Inventory & Logistics', 'Point of Sale', 'Data',
]

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function SourcesPage() {
  const { planId, loading: planLoading } = usePlan()
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null

  const [sources,    setSources]    = useState<Source[]>([])
  const [pageLoading,setPageLoading]= useState(true)
  const [connecting,        setConnecting]        = useState<string | null>(null)
  const [syncing,           setSyncing]           = useState<string | null>(null)
  const [modal,             setModal]             = useState<string | null>(null)
  const [modalFields,       setModalFields]       = useState<Record<string, string>>({})
  const [toast,             setToast]             = useState<{ msg: string; ok: boolean } | null>(null)
  const [deleting,          setDeleting]          = useState<string | null>(null)
  const [search,            setSearch]            = useState('')
  // Shopify dual-connect modal
  const [shopifyModal,      setShopifyModal]      = useState(false)
  const [shopifyShop,       setShopifyShop]       = useState('')
  const [shopifyToken,      setShopifyToken]      = useState('')
  const [shopifyOauthShop,  setShopifyOauthShop]  = useState('')
  const [shopifyConnecting, setShopifyConnecting] = useState<'manual' | 'oauth' | null>(null)
  const [shopifyError,      setShopifyError]      = useState('')
  const [shopifyTab,        setShopifyTab]        = useState<'oauth' | 'manual'>('oauth')

  useEffect(() => {
    loadSources()
    const connected = searchParams?.get('connected')
    const error     = searchParams?.get('error')
    if (connected) showToast(`${connected.replace(/_/g, ' ')} connected`, true)
    if (error)     showToast(`Connection failed: ${error.replace(/_/g, ' ')}`, false)
  }, [])

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const loadSources = async () => {
    setPageLoading(true)
    try {
      const res  = await fetch('/api/sources')
      const data = await res.json()
      setSources(Array.isArray(data) ? data : [])
    } finally { setPageLoading(false) }
  }

  const openModal = (srcId: string) => {
    if (srcId === 'shopify') {
      setShopifyShop(''); setShopifyToken(''); setShopifyOauthShop('')
      setShopifyError(''); setShopifyTab('oauth'); setShopifyModal(true)
      return
    }
    setModalFields({}); setModal(srcId)
  }

  const handleShopifyManual = async () => {
    setShopifyError('')
    const shop  = shopifyShop.trim()
    const token = shopifyToken.trim()
    if (!shop)  { setShopifyError('Enter your store domain'); return }
    if (!token) { setShopifyError('Paste your access token'); return }
    setShopifyConnecting('manual')
    try {
      const res = await fetch('/api/auth/shopify/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop, access_token: token }),
      })
      const data = await res.json()
      if (!res.ok) { setShopifyError(data.error || 'Connection failed'); return }
      setShopifyModal(false)
      showToast(`Shopify (${data.shop_name}) connected`, true)
      await loadSources()
    } catch {
      setShopifyError('Connection failed — try again')
    } finally { setShopifyConnecting(null) }
  }

  const handleShopifyOAuth = () => {
    setShopifyError('')
    const shop = shopifyOauthShop.trim()
    if (!shop) { setShopifyError('Enter your store domain'); return }
    setShopifyConnecting('oauth')
    window.location.href = `/api/auth/shopify?shop=${encodeURIComponent(shop)}`
  }

  const handleConnect = async (srcId: string) => {
    const src = SOURCES.find(s => s.id === srcId)
    if (!src) return

    if (src.oauthFlow) {
      const required = src.fields.filter(f => f.required)
      const missing  = required.find(f => !modalFields[f.key]?.trim())
      if (missing) { showToast(`Please enter your ${missing.label}`, false); return }
      const url = OAUTH_URL[srcId]?.(modalFields)
      if (url) window.location.href = url
      return
    }

    const required = src.fields.filter(f => f.required)
    const missing  = required.find(f => !modalFields[f.key]?.trim())
    if (missing) { showToast(`Please enter your ${missing.label}`, false); return }

    setConnecting(srcId)
    try {
      const credentials: Record<string, string> = {}
      const config:      Record<string, string> = {}
      src.fields.forEach(f => {
        if (f.type === 'password') credentials[f.key] = modalFields[f.key] || ''
        else                       config[f.key]      = modalFields[f.key] || ''
      })
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: srcId, name: src.label, credentials, config }),
      })
      if (!res.ok) throw new Error(await res.text())
      showToast(`${src.label} connected`, true)
      setModal(null)
      await loadSources()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Connection failed', false)
    } finally { setConnecting(null) }
  }

  const syncSource = async (sourceId: string) => {
    setSyncing(sourceId)
    try {
      const res  = await fetch('/api/sources/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source_id: sourceId }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      showToast('Sync complete', true)
      await loadSources()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Sync failed', false)
    } finally { setSyncing(null) }
  }

  const disconnectSource = async (id: string) => {
    setDeleting(id)
    try {
      await fetch('/api/sources', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      showToast('Disconnected', true)
      await loadSources()
    } finally { setDeleting(null) }
  }

  const connectedTypes = new Set(sources.map(s => s.source_type))
  const activeSrc = modal ? SOURCES.find(s => s.id === modal) : null

  // Filter + group available sources
  const available = useMemo(() => {
    const q = search.toLowerCase()
    return SOURCES.filter(s => !q || s.label.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
  }, [search])

  const grouped = useMemo(() => {
    const map: Record<string, SourceDef[]> = {}
    available.forEach(s => { (map[s.category] = map[s.category] || []).push(s) })
    return CATEGORY_ORDER.filter(c => map[c]).map(c => ({ category: c, items: map[c] }))
  }, [available])

  return (
    <div className="page-shell">


      <div className="page-shell-body">

        {toast && (
          <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, background: toast.ok ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, fontSize: 13, color: toast.ok ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
            {toast.ok ? '✓' : '✗'} {toast.msg}
          </div>
        )}

        {/* Syncing banner — shown after fresh Shopify connect */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('syncing') === 'true' && (
          <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, background: 'rgba(149,191,71,.08)', border: '1px solid rgba(149,191,71,.3)', fontSize: 13, color: '#7aaa2e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🛍️</span>
            <span><strong>Shopify connected.</strong> Your data is syncing in the background — check your dashboard in a few minutes.</span>
          </div>
        )}

        {/* ── Connected ─────────────────────────────────────────────────────── */}
        {sources.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              Connected ({sources.length})
            </div>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, overflow: 'hidden' }}>
              {sources.map((source, i) => {
                const info    = SOURCES.find(s => s.id === source.source_type)
                const isError = source.status === 'error' || !!source.error_message
                return (
                  <div key={source.id} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < sources.length - 1 ? '1px solid var(--b)' : 'none', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{info?.icon || '🔌'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{source.name}</div>
                      <div style={{ fontSize: 12, color: isError ? '#ef4444' : 'var(--tx3)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: isError ? '#ef4444' : source.status === 'active' ? '#22c55e' : '#f59e0b', display: 'inline-block', flexShrink: 0 }}/>
                        {isError ? source.error_message?.slice(0,60) || 'Sync error — reconnect to fix' : `Synced ${timeAgo(source.last_synced_at)}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                      <button onClick={() => syncSource(source.id)} disabled={syncing === source.id}
                        style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', fontSize: 12, fontWeight: 500, color: 'var(--tx)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {syncing === source.id ? 'Syncing…' : 'Sync now'}
                      </button>
                      <button onClick={() => disconnectSource(source.id)} disabled={deleting === source.id}
                        style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid rgba(239,68,68,.3)', background: 'transparent', fontSize: 12, color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {deleting === source.id ? '…' : 'Disconnect'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Search bar ────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            {sources.length === 0 ? 'Connect a platform' : 'Add another source'}
            <span style={{ marginLeft: 8, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--tx3)' }}>— {SOURCES.length} integrations</span>
          </div>
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search integrations…"
              style={{ width: '100%', padding: '9px 12px 9px 32px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* ── Categorised connector list ─────────────────────────────────────── */}
        {pageLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 52, borderRadius: 10, background: 'var(--ev)', animation: 'shimmer 1.4s infinite' }}/>)}
          </div>
        ) : grouped.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', background: 'var(--ev)', borderRadius: 12, color: 'var(--tx3)', fontSize: 13 }}>
            No integrations match &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {grouped.map(({ category, items }) => (
              <div key={category}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>
                  {category}
                </div>
                <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  {items.map((src, i) => {
                    const isConnected = connectedTypes.has(src.id)
                    return (
                      <div key={src.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: i < items.length - 1 ? '1px solid var(--b)' : 'none', background: isConnected ? src.color : 'transparent', transition: 'background 150ms' }}>
                        {/* Icon */}
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: src.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                          {src.icon}
                        </div>
                        {/* Label + desc */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {src.label}
                            {!src.oauthFlow && (
                              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 4, padding: '1px 5px', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                                API token
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {src.desc}
                          </div>
                        </div>
                        {/* Action */}
                        {isConnected ? (
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 9999, padding: '3px 10px', letterSpacing: '.04em', textTransform: 'uppercase', flexShrink: 0 }}>
                            Connected
                          </span>
                        ) : src.id === 'shopify' ? (
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 9999, padding: '3px 10px', letterSpacing: '.04em', textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap' }}>
                            Coming Soon
                          </span>
                        ) : (
                          <button
                            onClick={() => openModal(src.id)}
                            style={{ padding: '6px 14px', borderRadius: 9999, border: 'none', background: src.accent, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 28, padding: '13px 16px', borderRadius: 12, border: '1px dashed var(--b2)', fontSize: 13, color: 'var(--tx3)', lineHeight: 1.6 }}>
          💡 No integration yet? <strong style={{ color: 'var(--tx)' }}>Upload a CSV or Excel file</strong> from the chat page — instant analysis, no connection needed.
        </div>
      </div>

      {/* ── Shopify connect modal ─────────────────────────────────────────────── */}
      {shopifyModal && (
        <div onClick={e => { if (e.target === e.currentTarget) setShopifyModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--sf)', borderRadius: 14, padding: 20, width: '100%', maxWidth: 380, boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🛍️</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Connect Shopify</span>
              <button onClick={() => setShopifyModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx3)', fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--ev)', borderRadius: 9, padding: 3, marginBottom: 16 }}>
              {(['oauth', 'manual'] as const).map(tab => (
                <button key={tab} onClick={() => { setShopifyTab(tab); setShopifyError('') }}
                  style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    background: shopifyTab === tab ? 'var(--sf)' : 'transparent',
                    color: shopifyTab === tab ? 'var(--tx)' : 'var(--tx3)',
                    boxShadow: shopifyTab === tab ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
                  }}>
                  {tab === 'oauth' ? 'One-click' : 'Manual token'}
                </button>
              ))}
            </div>

            {/* Error */}
            {shopifyError && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: 12, color: '#ef4444', marginBottom: 12 }}>
                {shopifyError}
              </div>
            )}

            {/* OAuth panel */}
            <div style={{ display: shopifyTab === 'oauth' ? 'block' : 'none' }}>
              <p style={{ fontSize: 12, color: 'var(--tx3)', margin: '0 0 12px', lineHeight: 1.5 }}>
                Enter your store domain and you'll be redirected to Shopify to approve access in one click.
              </p>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                Store domain <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="mystore.myshopify.com"
                value={shopifyOauthShop}
                onChange={e => setShopifyOauthShop(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleShopifyOAuth()}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
              />
              <button onClick={handleShopifyOAuth} disabled={shopifyConnecting === 'oauth'}
                style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', background: '#95bf47', color: '#fff', fontSize: 13, fontWeight: 600, cursor: shopifyConnecting === 'oauth' ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {shopifyConnecting === 'oauth' ? 'Redirecting…' : 'Connect via Shopify →'}
              </button>
            </div>

            {/* Manual token panel */}
            <div style={{ display: shopifyTab === 'manual' ? 'block' : 'none' }}>
              <p style={{ fontSize: 12, color: 'var(--tx3)', margin: '0 0 12px', lineHeight: 1.5 }}>
                Create a custom app in your Shopify Admin → Settings → Apps → Develop apps, then paste the <code style={{ fontSize: 11, background: 'var(--ev)', padding: '1px 4px', borderRadius: 3 }}>shpat_</code> token below.
              </p>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                Store domain <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" placeholder="mystore.myshopify.com" value={shopifyShop} onChange={e => setShopifyShop(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                Access token <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="password" placeholder="shpat_xxxxxxxxxxxxxxxxxxxx" value={shopifyToken} onChange={e => setShopifyToken(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
              <button onClick={handleShopifyManual} disabled={shopifyConnecting === 'manual'}
                style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', background: '#95bf47', color: '#fff', fontSize: 13, fontWeight: 600, cursor: shopifyConnecting === 'manual' ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {shopifyConnecting === 'manual' ? 'Connecting…' : 'Connect with token'}
              </button>
            </div>

            <p style={{ fontSize: 11, color: 'var(--tx3)', textAlign: 'center', margin: '10px 0 0', lineHeight: 1.4 }}>
              🔒 Read-only access. Credentials encrypted & stored securely.
            </p>
          </div>
        </div>
      )}

      {/* ── Connect modal ──────────────────────────────────────────────────────── */}
      {modal && activeSrc && (
        <div onClick={e => { if (e.target === e.currentTarget) setModal(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--sf)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, border: '1px solid var(--b)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: activeSrc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {activeSrc.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>Connect {activeSrc.label}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>{activeSrc.hint}</div>
              </div>
            </div>
            {activeSrc.fields.map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                  {f.label}{f.required && <span style={{ color: '#ef4444' }}> *</span>}
                </label>
                <input type={f.type} placeholder={f.placeholder} value={modalFields[f.key] || ''}
                  onChange={e => setModalFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}/>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={() => handleConnect(modal)} disabled={connecting === modal}
                style={{ flex: 1, padding: 11, borderRadius: 10, border: 'none', background: activeSrc.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {connecting === modal ? 'Connecting…' : activeSrc.oauthFlow ? `Authorise via ${activeSrc.label} →` : 'Connect'}
              </button>
              <button onClick={() => setModal(null)}
                style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', fontSize: 14, color: 'var(--tx2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
            {activeSrc.oauthFlow && (
              <p style={{ marginTop: 12, fontSize: 11, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6 }}>
                🔒 Read-only access. AskBiz never stores your {activeSrc.label} password.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
