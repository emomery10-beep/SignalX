import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog | AskBiz',
  description: 'See what\'s new in AskBiz — product updates, improvements, and fixes.',
  alternates: { canonical: 'https://askbiz.co/changelog' },
}

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const BD   = '#e8e6e1'
const BG   = '#f9f8f6'
const SF   = '#ffffff'

type ChangeType = 'new' | 'improved' | 'fixed' | 'removed'

interface Change {
  type: ChangeType
  text: string
}

interface Release {
  version: string
  date: string
  summary: string
  changes: Change[]
}

const TYPE_STYLE: Record<ChangeType, { label: string; bg: string; color: string; border: string }> = {
  new:      { label: 'New',      bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  improved: { label: 'Improved', bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  fixed:    { label: 'Fixed',    bg: '#fff8e1', color: '#e65100', border: '#ffcc80' },
  removed:  { label: 'Removed',  bg: '#fce4ec', color: '#880e4f', border: '#f48fb1' },
}

const RELEASES: Release[] = [
  {
    version: '2.16.0',
    date: '2026-06-16',
    summary: 'AI discoverability overhaul — new compare page, camera-first POS hero, homepage rewrite, and removal of 3-month trial messaging.',
    changes: [
      { type: 'new',      text: '/compare page — AskBiz vs Shopify vs Power BI: 12-row feature table, pricing clarity strip, honest verdict section, and explicit correction of the $199/month figure circulating on AI platforms' },
      { type: 'improved', text: 'Homepage hero rewritten: label now reads "POS · INVENTORY · AI INTELLIGENCE — ONE PLATFORM", headline "Your shop. Your stock. All in one place.", subtext leads with "No training. No setup. Just plug in and go."' },
      { type: 'improved', text: 'Homepage: three-column compare section added between POS showcase and pricing — Shopify vs AskBiz vs Power BI cards with pros, cons, and honest verdict per tool' },
      { type: 'improved', text: 'Homepage pricing trust strip added below hero CTAs: "Free plan always available · £19/mo for Growth · £39/mo for Business · includes full POS system"' },
      { type: 'improved', text: 'Point of Sale hero rewritten to camera-first: "Point your camera. That\'s your checkout." with label POINT OF SALE · CAMERA-FIRST and subtext "No barcode gun. No manual entry. No Shopify needed."' },
      { type: 'removed',  text: '3-month free trial messaging removed from all user-facing surfaces — homepage CTA, pricing section badge, pricing page plan notes, POS page CTAs, billing page intro, POS section body, trial buttons, FAQ answer, and expired-access message' },
      { type: 'improved', text: 'Sitemap: /compare added at priority 0.9 with monthly revalidation' },
    ],
  },
  {
    version: '2.15.0',
    date: '2026-06-16',
    summary: 'Blog agent reliability fixes, AI Discovery scoring overhaul, blog topic polish, and Discovery Agent state persistence.',
    changes: [
      { type: 'fixed',    text: 'Victor, Carolyne, and Ben blog agents were silently failing DB inserts — root cause was custom type values (blog_ea, blog_us, blog_mktg_africa) violating the agent_content CHECK constraint. All agents now use type: blog, differentiated via run_id prefix (blog_ea_*, blog_us_*, blog_mktg_africa_*)' },
      { type: 'fixed',    text: 'Agent post counts (pending / published / rejected) showing 0 in Victor, Carolyne, and Ben tabs — list routes now filter by run_id prefix instead of type, so Alice\'s posts are correctly isolated from the other agents' },
      { type: 'improved', text: 'After an agent run completes, the filter auto-switches to Published so newly drafted posts with blog URLs are immediately visible without a manual tab change' },
      { type: 'improved', text: 'Blog Popular Topics section is now fully data-driven — counts and topic list come from actual post data, replacing hardcoded cluster names that didn\'t match DB values' },
      { type: 'fixed',    text: 'Blog topic card icons not rendering — icon JSX was defined in POPULAR_TOPICS but never passed through to the card render layer' },
      { type: 'fixed',    text: 'Blog topic cards collapsing to a single row — globals.css applies inline-flex to all <button> elements, forcing card children to flow horizontally. Fixed with explicit flex-direction: column on card buttons' },
      { type: 'fixed',    text: 'Cluster labels in blog post rows used uppercase + tracked text — replaced with a coloured dot + normal-weight 11px label' },
      { type: 'improved', text: 'AI Discovery Agent card now persists state across page refreshes using localStorage (key: dac_audit_v2) — restores instantly on mount then fetches fresh data in the background' },
      { type: 'fixed',    text: 'Discovery Agent "Generate manifest" state was lost on page refresh — generated manifests are now written to localStorage on success so the Listed status survives navigation' },
      { type: 'improved', text: 'AI Discovery audit scoring upgraded to 10-point model: +4 for URL endpoint returning 200, +2 for structured data configured and valid, +4 for probe question returning AskBiz HIT. Previous model capped at 7/10 regardless of probe results' },
      { type: 'improved', text: 'Discovery audit now runs probe questions across all 6 platforms in parallel (was limited to first 4), and probe hit results feed directly into platform scoring' },
    ],
  },
  {
    version: '2.14.0',
    date: '2026-06-14',
    summary: 'Smart notification system, Paystack payment tracking, POS inventory archiving, CFO dashboard cleanup, and blog + academy design polish.',
    changes: [
      { type: 'new',      text: 'In-app notification inbox — payment failures, reorder alerts, daily sales summaries, large sale flags, and source connection health all fire as notifications' },
      { type: 'new',      text: 'Paystack webhook on main app — charge.success and charge.failed events update payment status and create instant notifications' },
      { type: 'new',      text: 'Received Payments section — confirmed digital payments (M-Pesa, card) now shown separately from failed payment recovery' },
      { type: 'new',      text: 'Payment Recovery dashboard — dedicated API for failed/cancelled payments with recovery stats and retry tracking' },
      { type: 'new',      text: 'Archive button on out-of-stock items — hide products from stock alerts and Pulse without deleting them' },
      { type: 'new',      text: 'Shared notification helper with built-in deduplication — prevents the same alert from firing more than once per configurable window' },
      { type: 'new',      text: 'Source connection health alerts — stale sync warnings, disconnection alerts, and new connection confirmations' },
      { type: 'new',      text: 'POS daily sales summary notifications — yesterday\'s revenue, transaction count, and cash vs digital breakdown delivered each morning' },
      { type: 'improved', text: 'Pulse dismissed signals now persist across page refreshes — signal IDs are stable instead of regenerating on every load' },
      { type: 'improved', text: 'Stock replenishment cron now creates notifications for critical and high-urgency reorder suggestions' },
      { type: 'improved', text: 'Proactive cron flags large individual sales when top sale exceeds 2× the daily average' },
      { type: 'fixed',    text: 'Paystack payments not appearing in Payment Recovery — webhook was only on pos.askbiz.co, now also on askbiz.co' },
      { type: 'fixed',    text: 'Pending payments incorrectly shown as "Retrying" — dunning API now only queries genuinely failed payments' },
      { type: 'fixed',    text: 'Dismissed Pulse alerts reappearing on refresh — removed Date.now() suffix from signal IDs' },
      { type: 'removed',  text: 'Inline alert banners on CFO Dashboard — margin and stock alerts now handled by the notification system and Pulse' },
      { type: 'improved', text: 'Blog index — Popular Topics redesigned with 3 featured cards plus compact inline buttons, breaking the identical card grid' },
      { type: 'improved', text: 'Blog article — removed 6 interstitials (Key Insight, newsletter CTA, cluster CTA, duplicate Key Takeaways, lead magnet) leaving one clean bottom CTA' },
      { type: 'improved', text: 'Blog article — removed side-stripe accent borders from intro and contextual links sections' },
      { type: 'improved', text: 'Blog post rows — stripped badge overload (content type, difficulty, pillar pills) down to plain cluster label' },
      { type: 'improved', text: 'Academy index — category grid redesigned with 5 featured cards plus compact inline buttons for remaining 20 categories' },
      { type: 'improved', text: 'Academy article — removed mid-article gradient CTA interstitial, sidebar CTA is now the single conversion ask' },
      { type: 'improved', text: 'Academy article — removed side-stripe border from description and fixed uppercase tracked headings' },
      { type: 'improved', text: 'Academy article rows — stripped badge overload (category + difficulty pills) down to plain category label' },
      { type: 'fixed',    text: 'Font fallback inconsistency across blog and academy — all changed from sans-serif to system-ui' },
    ],
  },
  {
    version: '2.13.0',
    date: '2026-06-04',
    summary: 'Critical Shopify OAuth fix, proper 404 status codes for dynamic pages, and 3-month free trial promotion on landing page.',
    changes: [
      { type: 'fixed',    text: 'Shopify OAuth route returned 500 due to variable used before declaration — prevented store connection during app review' },
      { type: 'fixed',    text: 'Blog posts with invalid slugs returned HTTP 200 instead of 404 — now correctly returns 404 via Next.js notFound()' },
      { type: 'fixed',    text: 'Point of Sale sector pages returned HTTP 200 for nonexistent sectors — now returns proper 404' },
      { type: 'fixed',    text: 'Point of Sale feature pages returned HTTP 200 for nonexistent features — now returns proper 404' },
      { type: 'improved', text: 'Landing page hero — added prominent purple "3 months free — no card required" banner above the fold' },
      { type: 'improved', text: 'Landing page CTA updated from "Start free — no card needed" to "Start 3-month free trial"' },
      { type: 'improved', text: 'Pricing section Growth card badge changed from "Most popular" to "3 months free trial" with purple gradient' },
      { type: 'improved', text: 'Growth plan CTA in pricing section updated to "Start free trial" with direct signup link' },
      { type: 'improved', text: 'Trust badges, subtitle, and geo sub-text all updated to reflect the 3-month free trial offer' },
      { type: 'improved', text: 'FAQ updated to mention 3-month free trial for Growth and PoS' },
    ],
  },
  {
    version: '2.12.0',
    date: '2026-06-04',
    summary: '3-month free trials for Growth plan and Point of Sale — no card required. Works for both Stripe and M-Pesa/PesaPal users.',
    changes: [
      { type: 'new',      text: '3-month free trial for Growth plan — full Growth features (unlimited questions, daily brief, social commerce, churn intelligence) with no card upfront' },
      { type: 'new',      text: '3-month free trial for Point of Sale — up to 5 seats included, no card or M-Pesa required' },
      { type: 'new',      text: 'Trials table in database — tracks trial type, start/end dates, and conversion status per user' },
      { type: 'new',      text: 'Trial activation API — POST /api/billing with action "start_trial" for both PoS and Growth trials' },
      { type: 'new',      text: 'Billing page trial UI — start buttons for eligible users, active trial badges with days remaining, expired trial notices' },
      { type: 'new',      text: 'Trial conversion tracking — Stripe webhook and PesaPal callback both mark trials as converted on payment' },
      { type: 'improved', text: 'Billing API GET now fetches trial state, auto-expires trials, and returns trial info to frontend' },
      { type: 'improved', text: 'PoS trial locks seat stepper to 5 seats with "included in trial" label — paid users can have up to 50' },
      { type: 'improved', text: 'Growth trial expiry check now correctly handles PesaPal-paid users (was only checking for Stripe subscription)' },
      { type: 'improved', text: 'usePlan hook extended with TrialInfo interface — components can check trial.active, trial.daysLeft, trial.expired' },
      { type: 'fixed',    text: 'Growth trial expiry would incorrectly downgrade PesaPal/M-Pesa subscribers who had no Stripe subscription ID' },
    ],
  },
  {
    version: '2.11.0',
    date: '2026-05-19',
    summary: 'Point of Sale marketing page, global currency support, interactive demos, geo-aware PoS pricing, and full logistics API.',
    changes: [
      { type: 'new',      text: '/point-of-sale marketing page — hero, camera-first scan demo, 12-feature grid, comparison table, and per-seat pricing' },
      { type: 'new',      text: 'Camera-first PoS demo — animated phone mock showing scan → recognise → basket → pay in 4 steps with a progress tracker' },
      { type: 'new',      text: 'Staff setup walkthrough — interactive screen-recording style demo showing how to add a cashier in under 2 minutes with OTP login' },
      { type: 'new',      text: 'Global currency support on /point-of-sale — 150+ currencies, localisation, mobile money (M-Pesa, MTN, Airtel), and 10 tax regimes (UK VAT, US Sales Tax, FIRS, KRA, GST, SARS, UAE VAT, AU GST, EU OSS, Custom)' },
      { type: 'new',      text: 'Logistics API routes — /api/pos/parcels, /api/pos/trucks, /api/pos/routes, /api/pos/logistics-invoices, /api/pos/vehicle-inspection, /api/pos/parcels/handover, /api/pos/parcels/photos, /api/pos/parcels/scan' },
      { type: 'new',      text: '/benchmarks and /case-studies pages now live — were returning 404 (untracked files fixed)' },
      { type: 'improved', text: 'Pricing section — PoS add-on card now shown first before intelligence tiers; includes feature pills and dual CTAs' },
      { type: 'improved', text: 'Geo-aware PoS pricing — PoS seat price now localised per country (KSh 600, ₦2,500, R 90, ₹400, £5, $5, etc.) across all pricing surfaces and FAQ' },
      { type: 'improved', text: 'Growth and Business plan prices now correctly use geo-detected currency on landing page (was hardcoded £ regardless of country)' },
      { type: 'fixed',    text: '/free-tools/break-even-calculator and /free-tools/vat-calculator were returning 404 — files committed and deployed' },
      { type: 'fixed',    text: 'PoS pricing card showing £5 for Kenyan users instead of KSh 600 — currency detection now wired end-to-end' },
    ],
  },
  {
    version: '2.10.0',
    date: '2026-05-16',
    summary: 'New free tools, case studies, industry benchmarks, geo-aware CTAs, and POS seat pricing on the landing page.',
    changes: [
      { type: 'new',      text: 'VAT Calculator — supports 30+ countries with auto-filled VAT rates and reverse VAT calculation' },
      { type: 'new',      text: 'Break-Even Calculator — 12 currencies, interactive chart, and what-if price scenarios' },
      { type: 'new',      text: 'Case Studies section — 6 real-world stories showing how SMEs use AskBiz across sectors' },
      { type: 'new',      text: 'SME Industry Benchmarks — compare margins, growth, AOV, and KPIs across 8 sectors (updated quarterly)' },
      { type: 'new',      text: 'Geo-aware CTAs — landing page adapts headline and promo for visitors from Singapore, Australia, Nigeria, and more' },
      { type: 'new',      text: 'African market promo banner — auto-surfaces ASKBIZ-AFRICA discount code for eligible countries' },
      { type: 'improved', text: 'Pricing section now shows explicit POS seat pricing (£5/seat/month add-on) on Growth and Business tiers' },
      { type: 'improved', text: 'Navigation mega-menu updated with Resources dropdown linking to all new sections' },
      { type: 'improved', text: 'Footer updated with Case Studies and Benchmarks links' },
      { type: 'improved', text: 'Sitemap expanded with all new routes for improved SEO coverage' },
    ],
  },
  {
    version: '2.9.0',
    date: '2026-05-12',
    summary: 'Introducing AskBiz POS — a fully integrated point of sale system with camera scanning, inventory management, staff roles, and real-time BI.',
    changes: [
      { type: 'new',      text: 'AskBiz POS — built-in point of sale system accessible from any smartphone or tablet' },
      { type: 'new',      text: 'Camera-based barcode and price tag scanning using your phone camera — no extra hardware needed' },
      { type: 'new',      text: 'Full checkout flow: scan, cart, payment (cash or card), and receipt in under 60 seconds' },
      { type: 'new',      text: 'WhatsApp receipt delivery — customers get digital proof of purchase instantly' },
      { type: 'new',      text: 'Staff management with role-based access (cashier and inventory roles) and magic link login' },
      { type: 'new',      text: 'Real-time inventory management with low-stock and out-of-stock alerts' },
      { type: 'new',      text: 'Full and partial refund handling with reason tracking and audit trail' },
      { type: 'new',      text: 'Transaction amendments and corrections with complete audit logging' },
      { type: 'new',      text: 'VAT calculation on every transaction with MTD-compatible digital record-keeping' },
      { type: 'new',      text: '30-day transaction export for accountants (CSV format)' },
      { type: 'new',      text: 'POS data feeds directly into dashboards, Daily Brief, Business Pulse, and AI chat' },
      { type: 'new',      text: 'Multi-location POS support with per-location staff, inventory, and reporting' },
      { type: 'new',      text: 'Offline mode — continue processing cash sales during brief internet outages' },
      { type: 'new',      text: '25 new Academy articles on POS and retail intelligence' },
      { type: 'new',      text: '22 new Help Centre articles including compliance guides (HMRC, GDPR, receipt law)' },
      { type: 'new',      text: '"Retail POS Mastery" learning path — from first sale to full intelligence' },
      { type: 'improved', text: 'Help Centre POS integration reference updated (previously CSV-only for Zettle/Square)' },
    ],
  },
  {
    version: '2.8.0',
    date: '2026-05-09',
    summary: 'Major help centre overhaul with contextual search, smart escalation, and an in-app help widget.',
    changes: [
      { type: 'new',      text: 'In-app floating help widget — contextual article suggestions based on current page' },
      { type: 'new',      text: 'Live search autocomplete with article title and topic suggestions' },
      { type: 'new',      text: 'Sidebar topic filter on the Help Centre' },
      { type: 'new',      text: 'CMD+K shortcut to focus the help search from anywhere' },
      { type: 'new',      text: '"New" badge on articles updated within the last 45 days' },
      { type: 'new',      text: 'Smart escalation after low-rating feedback — email, call booking, FAQ' },
      { type: 'new',      text: '"Not helpful" reason categories: Inaccurate, Outdated, Too technical, Missing info' },
      { type: 'new',      text: 'Article "last verified" badge showing review month and year' },
      { type: 'new',      text: 'Community section on help home: forum, support call, email, FAQ' },
      { type: 'new',      text: 'Status banner for incident announcements across all help pages' },
      { type: 'improved', text: 'Article reading progress bar and back-to-top button' },
      { type: 'improved', text: 'Click-to-copy on inline code snippets in articles' },
      { type: 'improved', text: 'Video embed support for articles with a video guide' },
      { type: 'improved', text: 'Print/PDF view hides navigation and sidebar for clean output' },
    ],
  },
  {
    version: '2.7.2',
    date: '2026-04-22',
    summary: 'Dashboard performance improvements and Shopify sync reliability fixes.',
    changes: [
      { type: 'improved', text: 'Dashboard load time reduced by ~40% for accounts with 3+ connected sources' },
      { type: 'improved', text: 'Shopify order sync now retries automatically on rate-limit errors' },
      { type: 'fixed',    text: 'Fixed a bug where revenue figures could show as $0 for the current day' },
      { type: 'fixed',    text: 'Resolved an issue with date filters not persisting across page refreshes' },
    ],
  },
  {
    version: '2.7.1',
    date: '2026-04-10',
    summary: 'Forecasting accuracy improvements and minor UI polish.',
    changes: [
      { type: 'improved', text: 'Forecasting model now incorporates seasonal trends for more accurate projections' },
      { type: 'improved', text: 'Ask AI now remembers context across follow-up questions in the same session' },
      { type: 'fixed',    text: 'Fixed export button not working on Firefox 124' },
      { type: 'fixed',    text: 'Resolved sidebar overlap on screens narrower than 375px' },
    ],
  },
  {
    version: '2.7.0',
    date: '2026-03-28',
    summary: 'Launched Business Tools v2 with new integrations and a redesigned tools sidebar.',
    changes: [
      { type: 'new',      text: 'Business Tools v2 — redesigned sidebar with search and favourites' },
      { type: 'new',      text: 'Xero integration now supports multi-currency accounts' },
      { type: 'new',      text: 'New "Profit Pulse" widget on the home dashboard' },
      { type: 'improved', text: 'Google Analytics integration now pulls session and conversion data' },
      { type: 'removed',  text: 'Removed legacy CSV importer — replaced by the new Data Import wizard' },
    ],
  },
  {
    version: '2.6.5',
    date: '2026-03-08',
    summary: 'Security updates and bug fixes.',
    changes: [
      { type: 'improved', text: 'Upgraded authentication library to address two low-severity CVEs' },
      { type: 'fixed',    text: 'Fixed chart tooltips disappearing on touch devices' },
      { type: 'fixed',    text: 'Resolved an issue where invited users could land on a blank screen after sign-up' },
    ],
  },
]

function TypeBadge({ type }: { type: ChangeType }) {
  const s = TYPE_STYLE[type]
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
      padding: '3px 10px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      flexShrink: 0, lineHeight: 1, display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

export default function ChangelogPage() {
  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
              <rect x="3"  y="22" width="5" height="7"  rx="1.5" fill="white" opacity="0.5"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
              <rect x="19" y="9"  width="5" height="20" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/help" style={{ fontSize: 13, color: TX2, textDecoration: 'none', fontWeight: 500 }}>Help Centre</Link>
          <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: SF, borderBottom: `1px solid ${BD}`, padding: 'clamp(40px,6vw,72px) clamp(16px,6vw,80px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: ACC, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 12px' }}>Product updates</p>
          <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(28px,4.5vw,42px)', fontWeight: 700, color: TX, margin: '0 0 14px', letterSpacing: '-.03em', lineHeight: 1.1 }}>
            Changelog
          </h1>
          <p style={{ fontSize: 16, color: TX2, margin: '0 0 24px', lineHeight: 1.7, maxWidth: 520 }}>
            New features, improvements, and fixes — updated with every release.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:hello@askbiz.co?subject=Changelog feedback" style={{ fontSize: 13, color: TX2, textDecoration: 'none', border: `1px solid ${BD}`, borderRadius: 8, padding: '8px 18px', fontWeight: 500, transition: 'border-color .15s' }}>
              Send feedback →
            </a>
            <Link href="/help" style={{ fontSize: 13, color: ACC, textDecoration: 'none', border: `1px solid ${ACC}`, borderRadius: 8, padding: '8px 18px', fontWeight: 600 }}>
              Help Centre →
            </Link>
          </div>
        </div>
      </div>

      {/* Releases */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,24px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {RELEASES.map((rel, i) => (
            <article key={rel.version} style={{
              background: SF,
              border: `1px solid ${i === 0 ? ACC : BD}`,
              borderRadius: 14,
              padding: 'clamp(20px,3vw,28px)',
              boxShadow: i === 0 ? `0 0 0 1px ${ACC}22, 0 4px 20px rgba(0,0,0,.06)` : '0 1px 4px rgba(0,0,0,.04)',
              position: 'relative',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, letterSpacing: '-.01em',
                }}>
                  v{rel.version}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: TX3, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: TX3, fontWeight: 500 }}>
                  {new Date(rel.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {i === 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: SF, background: ACC,
                    padding: '3px 10px', borderRadius: 9999, letterSpacing: '.06em', textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}>
                    Latest
                  </span>
                )}
              </div>

              {/* Summary */}
              <p style={{ fontSize: 14, color: TX2, margin: '0 0 18px', lineHeight: 1.6 }}>
                {rel.summary}
              </p>

              {/* Changes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rel.changes.map((c, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '8px 12px',
                    background: BG,
                    borderRadius: 8,
                  }}>
                    <div style={{ paddingTop: 2, flexShrink: 0 }}>
                      <TypeBadge type={c.type} />
                    </div>
                    <span style={{ fontSize: 13, color: TX, lineHeight: 1.55, flex: 1 }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${BD}`, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: TX3, margin: '0 0 12px' }}>
            Looking for older releases? <a href="mailto:hello@askbiz.co" style={{ color: ACC, textDecoration: 'none', fontWeight: 600 }}>Contact support</a>.
          </p>
          <Link href="/help" style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>← Back to Help Centre</Link>
        </div>
      </div>
    </div>
  )
}
