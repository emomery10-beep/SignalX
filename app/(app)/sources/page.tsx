'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { QRCodeSVG } from 'qrcode.react'

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
  { id: 'tiktok_shop', label: 'TikTok Shop',        category: 'Social Commerce', desc: 'Orders, video analytics, product performance',        icon: '🎵', accent: '#010101', color: 'rgba(1,1,1,.06)',      oauthFlow: true,  hint: 'Scan the QR code with your TikTok app to connect your shop', fields: [] },
  { id: 'instagram',   label: 'Instagram Shopping', category: 'Social Commerce', desc: 'Post insights, product clicks, shopping orders',       icon: '📸', accent: '#E1306C', color: 'rgba(225,48,108,.06)', oauthFlow: true,  hint: 'Redirects to Meta — grants read access to your Instagram Shop and catalog', fields: [] },
  { id: 'pinterest',   label: 'Pinterest',          category: 'Social Commerce', desc: 'Pin analytics, saves, product catalog performance',    icon: '📌', accent: '#E60023', color: 'rgba(230,0,35,.06)',   oauthFlow: false, hint: 'Paste your access token from Pinterest Business › Apps', fields: [{ key: 'access_token', label: 'Access Token', placeholder: 'pina_xxxxxxxxxxxx', type: 'password', required: true }] },

  // ── Inventory & Logistics ─────────────────────────────────────────────────
  { id: 'linnworks',   label: 'Linnworks',   category: 'Inventory & Logistics', desc: 'Multi-channel inventory, orders, fulfilment',          icon: '🗂️', accent: '#e84545', color: 'rgba(232,69,69,.1)',   oauthFlow: true,  hint: 'Redirects to Linnworks — read-only access',                          fields: [] },
  { id: 'cin7',        label: 'Cin7',        category: 'Inventory & Logistics', desc: 'Inventory, purchase orders, B2B sales, 3PL',           icon: '🏭', accent: '#ff6b35', color: 'rgba(255,107,53,.1)',  oauthFlow: false, hint: 'Paste your API key from Cin7 › Settings › API',                      fields: [{ key: 'account_id', label: 'Account ID', placeholder: 'xxxxxxxxxxxx', type: 'text', required: true }, { key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'shipstation', label: 'ShipStation', category: 'Inventory & Logistics', desc: 'Shipments, tracking, carriers, shipping costs',         icon: '🚚', accent: '#3a6eb5', color: 'rgba(58,110,181,.1)',  oauthFlow: false, hint: 'Paste your API keys from ShipStation › Account Settings › API Settings', fields: [{ key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'text', required: true }, { key: 'api_secret', label: 'API Secret', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'password', required: true }] },
  { id: 'royal_mail',  label: 'Royal Mail',  category: 'Inventory & Logistics', desc: 'Parcel tracking, costs, Click & Drop orders',           icon: '📮', accent: '#e2001a', color: 'rgba(226,0,26,.1)',    oauthFlow: false, hint: 'Paste your Click & Drop API key from Click & Drop › Settings › API', fields: [{ key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxx', type: 'password', required: true }] },

  // ── Point of Sale ─────────────────────────────────────────────────────────
  { id: 'askbiz_pos', label: 'AskBiz POS', category: 'Point of Sale', desc: 'Sales, stock and margins from your own register', icon: '🧾', accent: '#16a34a', color: 'rgba(22,163,74,.1)', oauthFlow: false, hint: '', fields: [] },
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
  // Social Commerce
  tiktok_shop:      ()  => '/api/auth/tiktok-shop',
  instagram:        ()  => '/api/auth/instagram-shopping',
  // Data
  google_sheets:    (f) => `/api/auth/google?spreadsheet_id=${encodeURIComponent(f.spreadsheet_id || '')}`,
}

const CATEGORY_ORDER = [
  'E-Commerce', 'Accounting', 'Payments', 'Marketing & Ads',
  'Social Commerce', 'Inventory & Logistics', 'Point of Sale', 'Data',
]

// Maps the literal category label used in SOURCES to its translation key suffix.
const CATEGORY_KEY: Record<string, string> = {
  'E-Commerce': 'cat_e_commerce',
  'Accounting': 'cat_accounting',
  'Payments': 'cat_payments',
  'Marketing & Ads': 'cat_marketing_ads',
  'Social Commerce': 'cat_social_commerce',
  'Inventory & Logistics': 'cat_inventory_logistics',
  'Point of Sale': 'cat_point_of_sale',
  'Data': 'cat_data',
}

function timeAgo(iso: string | null, tc: (key: string, vars?: Record<string, string | number>) => string): string {
  if (!iso) return tc('sources.time_never')
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2)  return tc('sources.time_just_now')
  if (mins < 60) return tc('sources.time_minutes_ago', { mins })
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return tc('sources.time_hours_ago', { hrs })
  return tc('sources.time_days_ago', { days: Math.floor(hrs / 24) })
}

export default function SourcesPage() {
  const { tc } = useLang()
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
  // TikTok Shop QR modal
  const [tiktokQr,          setTiktokQr]          = useState<{ authUrl: string } | null>(null)
  const [tiktokQrLoading,   setTiktokQrLoading]   = useState(false)
  const tiktokPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    loadSources()
    const connected = searchParams?.get('connected')
    const error     = searchParams?.get('error')
    if (connected) showToast(tc('sources.toast_connected', { name: connected.replace(/_/g, ' ') }), true)
    if (error)     showToast(tc('sources.toast_connection_failed', { error: error.replace(/_/g, ' ') }), false)
    return () => { if (tiktokPollRef.current) clearInterval(tiktokPollRef.current) }
  }, [])

  // Deep link from onboarding's connect step (e.g. /sources?open=quickbooks) —
  // auto-opens that connector's own flow instead of dropping the user on the
  // generic list to hunt for it themselves. Explicit allowlist, not "any valid
  // SOURCES id": openModal() special-cases a couple of ids to skip the review
  // modal and act immediately (askbiz_pos fires a real connect POST with no
  // confirmation step), and loading a URL must never trigger a state-changing
  // action on its own. Only ids that open an inert review modal belong here.
  const AUTO_OPENABLE_SOURCE_IDS = ['quickbooks', 'stripe', 'amazon_fba', 'google_sheets', 'tiktok_shop']
  useEffect(() => {
    const url = new URL(window.location.href)
    const open = url.searchParams.get('open')
    if (open && AUTO_OPENABLE_SOURCE_IDS.includes(open)) {
      openModal(open)
      // Strip it so a refresh or reshared link doesn't reopen the modal.
      url.searchParams.delete('open')
      window.history.replaceState(null, '', url.pathname + url.search)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    if (srcId === 'askbiz_pos') {
      connectAskBizPOS()
      return
    }
    setModalFields({}); setModal(srcId)
  }

  // AskBiz POS lives in the same Supabase project as this app, so there's
  // no OAuth/API key round trip — connecting just links the user's own
  // pos_transactions to their unified_data via the sync engine.
  const connectAskBizPOS = async () => {
    setConnecting('askbiz_pos')
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: 'askbiz_pos', name: 'AskBiz POS', credentials: {}, config: {} }),
      })
      if (!res.ok) throw new Error(await res.text())
      showToast(tc('sources.toast_connected', { name: 'AskBiz POS' }), true)
      await loadSources()
    } catch (e) {
      showToast(e instanceof Error ? e.message : tc('sources.toast_generic_connection_failed'), false)
    } finally { setConnecting(null) }
  }

  const handleShopifyManual = async () => {
    setShopifyError('')
    const shop  = shopifyShop.trim()
    const token = shopifyToken.trim()
    if (!shop)  { setShopifyError(tc('sources.shopify_err_enter_domain')); return }
    if (!token) { setShopifyError(tc('sources.shopify_err_paste_token')); return }
    setShopifyConnecting('manual')
    try {
      const res = await fetch('/api/auth/shopify/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop, access_token: token }),
      })
      const data = await res.json()
      if (!res.ok) { setShopifyError(data.error || tc('sources.shopify_err_connection_failed')); return }
      setShopifyModal(false)
      showToast(tc('sources.toast_shopify_connected', { shop: data.shop_name }), true)
      await loadSources()
    } catch {
      setShopifyError(tc('sources.shopify_err_retry'))
    } finally { setShopifyConnecting(null) }
  }

  const handleShopifyOAuth = () => {
    setShopifyError('')
    const shop = shopifyOauthShop.trim()
    if (!shop) { setShopifyError(tc('sources.shopify_err_enter_domain')); return }
    setShopifyConnecting('oauth')
    window.location.href = `/api/auth/shopify?shop=${encodeURIComponent(shop)}`
  }

  const handleConnect = async (srcId: string) => {
    const src = SOURCES.find(s => s.id === srcId)
    if (!src) return

    if (src.oauthFlow) {
      if (srcId === 'tiktok_shop') {
        setModal(null)
        setTiktokQrLoading(true)
        try {
          const res  = await fetch('/api/auth/tiktok-shop')
          const data = await res.json()
          if (data.auth_url) {
            setTiktokQr({ authUrl: data.auth_url })
            // Poll loadSources every 3s — when tiktok_shop appears, close modal + toast
            tiktokPollRef.current = setInterval(async () => {
              const pollRes  = await fetch('/api/sources')
              const pollData = await pollRes.json().catch(() => ({ sources: [] }))
              const found = (pollData.sources as Source[]).find(s => s.source_type === 'tiktok_shop')
              if (found) {
                clearInterval(tiktokPollRef.current!)
                tiktokPollRef.current = null
                setTiktokQr(null)
                showToast(tc('sources.toast_connected', { name: 'TikTok Shop' }), true)
                await loadSources()
              }
            }, 3000)
          } else {
            showToast(data.error || 'Failed to start TikTok connection', false)
          }
        } catch {
          showToast('Failed to start TikTok connection', false)
        } finally {
          setTiktokQrLoading(false)
        }
        return
      }
      const required = src.fields.filter(f => f.required)
      const missing  = required.find(f => !modalFields[f.key]?.trim())
      if (missing) { showToast(tc('sources.toast_please_enter', { label: missing.label }), false); return }
      const url = OAUTH_URL[srcId]?.(modalFields)
      if (url) window.location.href = url
      return
    }

    const required = src.fields.filter(f => f.required)
    const missing  = required.find(f => !modalFields[f.key]?.trim())
    if (missing) { showToast(tc('sources.toast_please_enter', { label: missing.label }), false); return }

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
      showToast(tc('sources.toast_connected', { name: src.label }), true)
      setModal(null)
      await loadSources()
    } catch (e) {
      showToast(e instanceof Error ? e.message : tc('sources.toast_generic_connection_failed'), false)
    } finally { setConnecting(null) }
  }

  const syncSource = async (sourceId: string) => {
    setSyncing(sourceId)
    try {
      const res  = await fetch('/api/sources/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source_id: sourceId }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      showToast(tc('sources.toast_sync_complete'), true)
      await loadSources()
    } catch (e) {
      showToast(e instanceof Error ? e.message : tc('sources.toast_sync_failed'), false)
    } finally { setSyncing(null) }
  }

  const disconnectSource = async (id: string) => {
    setDeleting(id)
    try {
      await fetch('/api/sources', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      showToast(tc('sources.toast_disconnected'), true)
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
      {/* On mobile the app shell floats a menu button top-left; clear it so
          the page heading isn't overlapped. No effect on desktop. */}
      <style>{`@media (max-width: 768px) { .sources-shell-body { padding-top: 56px !important; } }`}</style>

      <div className="page-shell-body sources-shell-body">

        {toast && (
          <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, background: toast.ok ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, fontSize: 15, color: toast.ok ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
            {toast.ok ? '✓' : '✗'} {toast.msg}
          </div>
        )}

        {/* Syncing banner — shown after fresh Shopify connect */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('syncing') === 'true' && (
          <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, background: 'rgba(149,191,71,.08)', border: '1px solid rgba(149,191,71,.3)', fontSize: 15, color: '#7aaa2e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🛍️</span>
            <span><strong>{tc('sources.syncing_banner_title')}</strong> {tc('sources.syncing_banner_body')}</span>
          </div>
        )}

        {/* ── Connected ─────────────────────────────────────────────────────── */}
        {sources.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              {tc('sources.connected_heading', { count: sources.length })}
            </div>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, overflow: 'hidden' }}>
              {sources.map((source, i) => {
                const info    = SOURCES.find(s => s.id === source.source_type)
                const isError = source.status === 'error' || !!source.error_message
                return (
                  <div key={source.id} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < sources.length - 1 ? '1px solid var(--b)' : 'none', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{info?.icon || '🔌'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{source.name}</div>
                      <div style={{ fontSize: 14, color: isError ? '#ef4444' : 'var(--tx3)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: isError ? '#ef4444' : source.status === 'active' ? '#22c55e' : '#f59e0b', display: 'inline-block', flexShrink: 0 }}/>
                        {isError ? source.error_message?.slice(0,60) || tc('sources.sync_error_fallback') : tc('sources.synced_label', { time: timeAgo(source.last_synced_at, tc) })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                      <button onClick={() => syncSource(source.id)} disabled={syncing === source.id}
                        style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', fontSize: 14, fontWeight: 500, color: 'var(--tx)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {syncing === source.id ? tc('sources.btn_syncing') : tc('sources.btn_sync_now')}
                      </button>
                      <button onClick={() => disconnectSource(source.id)} disabled={deleting === source.id}
                        style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid rgba(239,68,68,.3)', background: 'transparent', fontSize: 14, color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {deleting === source.id ? '…' : tc('sources.btn_disconnect')}
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
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            {sources.length === 0 ? tc('sources.heading_connect_platform') : tc('sources.heading_add_another')}
            <span style={{ marginLeft: 8, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--tx3)' }}>{tc('sources.integrations_count', { count: SOURCES.length })}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tc('sources.search_placeholder')}
              style={{ width: '100%', padding: '9px 12px 9px 32px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* ── Categorised connector list ─────────────────────────────────────── */}
        {pageLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 52, borderRadius: 10, background: 'var(--ev)', animation: 'shimmer 1.4s infinite' }}/>)}
          </div>
        ) : grouped.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', background: 'var(--ev)', borderRadius: 12, color: 'var(--tx3)', fontSize: 15 }}>
            {tc('sources.no_matches', { query: search })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {grouped.map(({ category, items }) => (
              <div key={category}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>
                  {tc('sources.' + (CATEGORY_KEY[category] || ''))}
                </div>
                <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
                  {items.map((src, i) => {
                    const isConnected = connectedTypes.has(src.id)
                    return (
                      <div key={src.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: i < items.length - 1 ? '1px solid var(--b)' : 'none', background: isConnected ? src.color : 'transparent', transition: 'background 150ms' }}>
                        {/* Icon */}
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: src.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>
                          {src.icon}
                        </div>
                        {/* Label + desc */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {src.label}
                            {!src.oauthFlow && src.id !== 'askbiz_pos' && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 4, padding: '1px 5px', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                                {tc('sources.badge_api_token')}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {src.desc}
                          </div>
                        </div>
                        {/* Action */}
                        {isConnected ? (
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 9999, padding: '3px 10px', letterSpacing: '.04em', textTransform: 'uppercase', flexShrink: 0 }}>
                            {tc('sources.badge_connected')}
                          </span>
                        ) : src.id === 'shopify' ? (
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 9999, padding: '3px 10px', letterSpacing: '.04em', textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap' }}>
                            {tc('sources.badge_coming_soon')}
                          </span>
                        ) : (
                          <button
                            onClick={() => openModal(src.id)}
                            disabled={connecting === src.id}
                            style={{ padding: '6px 14px', borderRadius: 9999, border: 'none', background: src.accent, color: '#fff', fontSize: 14, fontWeight: 600, cursor: connecting === src.id ? 'default' : 'pointer', opacity: connecting === src.id ? 0.6 : 1, fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}
                          >
                            {connecting === src.id ? tc('sources.btn_connecting') : tc('sources.btn_connect')}
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

        <div style={{ marginTop: 28, padding: '13px 16px', borderRadius: 12, border: '1px dashed var(--b2)', fontSize: 15, color: 'var(--tx3)', lineHeight: 1.6 }}>
          {tc('sources.csv_hint_prefix')} <strong style={{ color: 'var(--tx)' }}>{tc('sources.csv_hint_strong')}</strong> {tc('sources.csv_hint_suffix')}
        </div>

        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--tx3)', lineHeight: 1.6, textAlign: 'center' }}>
          The term &ldquo;Etsy&rdquo; is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
        </p>
      </div>

      {/* ── Shopify connect modal ─────────────────────────────────────────────── */}
      {shopifyModal && (
        <div onClick={e => { if (e.target === e.currentTarget) setShopifyModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--sf)', borderRadius: 14, padding: 20, width: '100%', maxWidth: 380, boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>🛍️</span>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{tc('sources.shopify_modal_title')}</span>
              <button onClick={() => setShopifyModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx3)', fontSize: 20, lineHeight: 1, padding: 2 }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--ev)', borderRadius: 9, padding: 3, marginBottom: 16 }}>
              {(['oauth', 'manual'] as const).map(tab => (
                <button key={tab} onClick={() => { setShopifyTab(tab); setShopifyError('') }}
                  style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    background: shopifyTab === tab ? 'var(--sf)' : 'transparent',
                    color: shopifyTab === tab ? 'var(--tx)' : 'var(--tx3)',
                    boxShadow: shopifyTab === tab ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
                  }}>
                  {tab === 'oauth' ? tc('sources.shopify_tab_oauth') : tc('sources.shopify_tab_manual')}
                </button>
              ))}
            </div>

            {/* Error */}
            {shopifyError && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', fontSize: 14, color: '#ef4444', marginBottom: 12 }}>
                {shopifyError}
              </div>
            )}

            {/* OAuth panel */}
            <div style={{ display: shopifyTab === 'oauth' ? 'block' : 'none' }}>
              <p style={{ fontSize: 14, color: 'var(--tx3)', margin: '0 0 12px', lineHeight: 1.5 }}>
                {tc('sources.shopify_oauth_intro')}
              </p>
              <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                {tc('sources.shopify_field_domain')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="mystore.myshopify.com"
                value={shopifyOauthShop}
                onChange={e => setShopifyOauthShop(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleShopifyOAuth()}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
              />
              <button onClick={handleShopifyOAuth} disabled={shopifyConnecting === 'oauth'}
                style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', background: '#95bf47', color: '#fff', fontSize: 15, fontWeight: 600, cursor: shopifyConnecting === 'oauth' ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {shopifyConnecting === 'oauth' ? tc('sources.shopify_btn_redirecting') : tc('sources.shopify_btn_connect_oauth')}
              </button>
            </div>

            {/* Manual token panel */}
            <div style={{ display: shopifyTab === 'manual' ? 'block' : 'none' }}>
              <p style={{ fontSize: 14, color: 'var(--tx3)', margin: '0 0 12px', lineHeight: 1.5 }}>
                {tc('sources.shopify_manual_intro_prefix')} <code style={{ fontSize: 13, background: 'var(--ev)', padding: '1px 4px', borderRadius: 3 }}>shpat_</code> {tc('sources.shopify_manual_intro_suffix')}
              </p>
              <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                {tc('sources.shopify_field_domain')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" placeholder="mystore.myshopify.com" value={shopifyShop} onChange={e => setShopifyShop(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
              <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                {tc('sources.shopify_field_access_token')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="password" placeholder="shpat_xxxxxxxxxxxxxxxxxxxx" value={shopifyToken} onChange={e => setShopifyToken(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
              <button onClick={handleShopifyManual} disabled={shopifyConnecting === 'manual'}
                style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', background: '#95bf47', color: '#fff', fontSize: 15, fontWeight: 600, cursor: shopifyConnecting === 'manual' ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {shopifyConnecting === 'manual' ? tc('sources.shopify_btn_connecting') : tc('sources.shopify_btn_connect_token')}
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--tx3)', textAlign: 'center', margin: '10px 0 0', lineHeight: 1.4 }}>
              {tc('sources.shopify_modal_footer')}
            </p>
          </div>
        </div>
      )}

      {/* ── TikTok Shop QR modal ───────────────────────────────────────────────── */}
      {tiktokQr && (
        <div onClick={() => { setTiktokQr(null); if (tiktokPollRef.current) { clearInterval(tiktokPollRef.current); tiktokPollRef.current = null } }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--sf)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 360, border: '1px solid var(--b)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 30 }}>🎵</span>
              <span style={{ fontFamily: 'var(--font-sora)', fontSize: 19, fontWeight: 700 }}>Connect TikTok Shop</span>
            </div>
            <p style={{ fontSize: 15, color: 'var(--tx2)', marginBottom: 20, lineHeight: 1.6 }}>
              Open the <strong>TikTok</strong> app on your phone, tap the scan icon, and scan this code to authorise your shop.
            </p>
            <div style={{ display: 'inline-flex', padding: 12, background: '#fff', borderRadius: 12, border: '1px solid var(--b)', marginBottom: 20 }}>
              <QRCodeSVG value={tiktokQr.authUrl} size={180} level="M" />
            </div>
            <p style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 14 }}>Waiting for authorisation<span className="dots">…</span></p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={tiktokQr.authUrl} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, padding: 10, borderRadius: 10, background: '#010101', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                Open on this device
              </a>
              <button onClick={() => { setTiktokQr(null); if (tiktokPollRef.current) { clearInterval(tiktokPollRef.current); tiktokPollRef.current = null } }}
                style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', fontSize: 15, color: 'var(--tx2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Connect modal ──────────────────────────────────────────────────────── */}
      {modal && activeSrc && (
        <div onClick={e => { if (e.target === e.currentTarget) setModal(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--sf)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, border: '1px solid var(--b)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: activeSrc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                {activeSrc.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700 }}>{tc('sources.modal_connect_title', { label: activeSrc.label })}</div>
                <div style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 2 }}>{activeSrc.hint}</div>
              </div>
            </div>
            {activeSrc.fields.map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                  {f.label}{f.required && <span style={{ color: '#ef4444' }}> *</span>}
                </label>
                <input type={f.type} placeholder={f.placeholder} value={modalFields[f.key] || ''}
                  onChange={e => setModalFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}/>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={() => handleConnect(modal)} disabled={connecting === modal}
                style={{ flex: 1, padding: 11, borderRadius: 10, border: 'none', background: activeSrc.accent, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {connecting === modal ? tc('sources.btn_connecting') : activeSrc.oauthFlow ? tc('sources.modal_authorise', { label: activeSrc.label }) : tc('sources.btn_connect')}
              </button>
              <button onClick={() => setModal(null)}
                style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', fontSize: 16, color: 'var(--tx2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                {tc('sources.btn_cancel')}
              </button>
            </div>
            {activeSrc.oauthFlow && (
              <p style={{ marginTop: 12, fontSize: 13, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6 }}>
                {tc('sources.modal_oauth_footer', { label: activeSrc.label })}
              </p>
            )}
            {activeSrc.id === 'etsy' && (
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.5, padding: '8px 4px 0', borderTop: '1px solid var(--b)' }}>
                The term &ldquo;Etsy&rdquo; is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
