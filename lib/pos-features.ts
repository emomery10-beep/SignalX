export interface PosFeature {
  slug: string
  icon: string
  title: string
  desc: string
  tag: string
  color: string
  hero: string
  screen: 'overview' | 'register' | 'inventory' | 'reports' | 'staff' | 'retail' | 'restaurant' | 'repair' | 'salon' | 'factory' | 'logistics'
  details: { icon: string; title: string; desc: string }[]
  benefits: string[]
  useCases: { title: string; desc: string }[]
}

export const POS_FEATURES: PosFeature[] = [
  {
    slug: 'register-checkout',
    icon: '🧾', title: 'Register & Checkout', tag: 'Core', color: '#2563eb',
    desc: 'Fast checkout with barcode scanning or manual search. Split payments, layaways, discounts, refunds, and digital receipts in any currency.',
    hero: 'Ring up sales in seconds. Scan a barcode, split the payment, send a receipt — all from any device, anywhere in the world.',
    screen: 'register',
    details: [
      { icon: '📷', title: 'Barcode & QR scanning', desc: 'Point the camera at any barcode. Product, price, and stock update instantly — no typing.' },
      { icon: '💳', title: 'Split & flexible payments', desc: 'Card, cash, mobile money, or any combination. Discount codes, layaway, and gift cards built in.' },
      { icon: '🧾', title: 'Digital receipts', desc: 'Send receipts by SMS, email, or QR code. No printer needed. Branded with your logo.' },
      { icon: '↩️', title: 'Refunds & exchanges', desc: 'Process refunds and exchanges in one tap. All logged to the audit trail automatically.' },
    ],
    benefits: ['< 2 second checkout on average', 'Works offline — syncs when reconnected', 'No proprietary hardware needed'],
    useCases: [
      { title: 'High-volume retail', desc: 'Handle 100+ transactions a day with barcode scanning, multi-item baskets, and queue-busting speed.' },
      { title: 'Market stall & pop-up', desc: 'Run the full register from a phone. Accept card, cash, or mobile money. Works offline.' },
      { title: 'Multi-branch chain', desc: 'Every till on the same system. See real-time sales across all locations from one dashboard.' },
    ],
  },
  {
    slug: 'multi-currency',
    icon: '💱', title: 'Any Currency, Any Country', tag: 'Global', color: '#d08a59',
    desc: 'Set your store currency to GBP, USD, EUR, NGN, KES, AED, INR, ZAR or 150+ others. Exchange rates, symbol formatting, and decimal rules handled automatically.',
    hero: 'Sell in any currency, anywhere. Set it once and everything — prices, receipts, tax reports, and accounting exports — follows automatically.',
    screen: 'retail',
    details: [
      { icon: '🌍', title: '150+ currencies supported', desc: 'From KES to JPY to NGN. Symbol formatting, decimal rules, and number separators all automatic.' },
      { icon: '🏪', title: 'Per-branch currency', desc: 'Run branches in different countries each with their own currency, tax, and pricing rules.' },
      { icon: '📊', title: 'Multi-currency reports', desc: 'Consolidate revenue across currencies with a base-currency conversion for management reports.' },
      { icon: '💸', title: 'FX rate management', desc: 'Set custom exchange rates for cross-currency transactions. Updated automatically or manually.' },
    ],
    benefits: ['150+ currencies with automatic formatting', 'Per-branch currency isolation', 'Single dashboard across all currencies'],
    useCases: [
      { title: 'African retail chain', desc: 'Run stores in Kenya (KES), Nigeria (NGN), and Ghana (GHS) from one account. Each branch in its own currency.' },
      { title: 'Border town retail', desc: 'Accept multiple currencies at the till and reconcile against a single base currency at end of day.' },
      { title: 'International franchise', desc: 'Expand to new markets without changing your system. Add a country, pick the currency, start selling.' },
    ],
  },
  {
    slug: 'inventory',
    icon: '📦', title: 'Inventory Management', tag: 'Smart', color: '#059669',
    desc: 'Real-time stock levels across every branch. Low-stock alerts, stock transfers, batch updates, and AI-powered reorder recommendations.',
    hero: 'Know exactly what you have, where it is, and when to reorder — across every branch, in real time.',
    screen: 'inventory',
    details: [
      { icon: '📊', title: 'Real-time stock levels', desc: 'Every sale deducts stock instantly. View live levels per product, per branch, or across all locations.' },
      { icon: '⚠️', title: 'Low-stock alerts', desc: 'Set reorder thresholds per product. Get alerted before you run out — not after.' },
      { icon: '🔄', title: 'Branch stock transfers', desc: 'Move inventory between branches. Every transfer logged with full audit trail.' },
      { icon: '🤖', title: 'AI reorder suggestions', desc: 'Claude AI analyses sales velocity and recommends optimal reorder quantities and timing.' },
    ],
    benefits: ['Real-time deduction on every sale', 'AI reorder recommendations', 'Bulk import via CSV or barcode scan'],
    useCases: [
      { title: 'Multi-location retailer', desc: 'See stock across all branches in one view. Transfer from overstocked to low-stock locations instantly.' },
      { title: 'Fast-moving goods', desc: 'Low-stock alerts prevent stockouts on your best sellers. AI predicts reorder timing from sales velocity.' },
      { title: 'Seasonal business', desc: 'Track which products peak when, pre-load stock before seasonal surges, and clear slow movers with promotions.' },
    ],
  },
  {
    slug: 'multi-branch',
    icon: '🏪', title: 'Multi-Branch', tag: 'Scale', color: '#7c3aed',
    desc: 'Run multiple locations — in the same country or across borders — from one dashboard. Per-branch currency, tax, inventory, and staff settings.',
    hero: 'One account, unlimited locations. Each branch has its own currency, tax rates, inventory, and staff — all visible from a single dashboard.',
    screen: 'overview',
    details: [
      { icon: '🗺️', title: 'Branch map view', desc: 'See all your locations on a map with live sales, stock, and staff status per branch.' },
      { icon: '⚙️', title: 'Per-branch settings', desc: 'Each branch has its own currency, tax rate, receipt template, and inventory pool.' },
      { icon: '📊', title: 'Consolidated reporting', desc: 'View revenue, stock, and staff performance across all branches in one report.' },
      { icon: '👥', title: 'Cross-branch staff', desc: 'Assign staff to multiple branches. Permissions travel with the person, not the location.' },
    ],
    benefits: ['Unlimited branches on one account', 'Per-branch currency and tax isolation', 'Consolidated group dashboard'],
    useCases: [
      { title: 'Retail chain', desc: 'Manage 10 stores from one login. Transfer stock, compare performance, and update pricing across all branches at once.' },
      { title: 'Cross-border operations', desc: 'Branches in Kenya, Nigeria, and UAE each trade in local currency with local tax rules — consolidated for group reporting.' },
      { title: 'Franchise model', desc: 'Franchisees get their own branch view; you see everything. Role-based access controls what each user sees.' },
    ],
  },
  {
    slug: 'staff-shifts',
    icon: '👥', title: 'Staff & Shifts', tag: 'Team', color: '#0891b2',
    desc: 'Role-based access for cashiers and managers. Shift open/close with cash reconciliation, OTP login, and per-cashier performance tracking.',
    hero: 'Your team, your rules. Set roles, open shifts, reconcile cash, and track every cashier\'s performance — all from the Staff tab.',
    screen: 'staff',
    details: [
      { icon: '🔑', title: 'OTP login — no passwords', desc: 'Staff log in with a one-time PIN sent to their phone. No passwords to forget or share.' },
      { icon: '⏱️', title: 'Shift open & close', desc: 'Open a shift with a float count. Close it with cash reconciliation. Variance logged automatically.' },
      { icon: '🎭', title: '3 roles: Manager, Cashier, Inventory', desc: 'Set once, controlled forever. Each role sees only what it needs.' },
      { icon: '📊', title: 'Per-cashier performance', desc: 'Sales, transactions, refunds, and discounts per cashier per shift. Know your top performers.' },
    ],
    benefits: ['OTP login — no passwords to manage', 'Full shift reconciliation trail', 'Per-cashier sales performance'],
    useCases: [
      { title: 'Busy retail store', desc: 'Multiple cashiers on the same shift, each with their own login and performance tracked separately.' },
      { title: 'Staff turnover', desc: 'New staff set up in under 2 minutes with OTP login. No IT needed, no passwords to reset.' },
      { title: 'Manager oversight', desc: 'Managers see everything. Cashiers see only their register. Inventory staff see stock — nothing else.' },
    ],
  },
  {
    slug: 'tax-compliance',
    icon: '🧮', title: 'Tax & Compliance', tag: 'Finance', color: '#dc2626',
    desc: 'VAT, GST, sales tax, and custom local tax rates. Multi-jurisdiction rules, consolidated reports, and filing-ready previews. Syncs to Xero and QuickBooks.',
    hero: 'Tax configured once, applied everywhere. VAT, GST, sales tax — per product, per branch, per country — with filing-ready reports.',
    screen: 'overview',
    details: [
      { icon: '🌍', title: 'Every major tax system', desc: 'VAT (UK/EU), GST (Australia/India), Sales Tax (US), custom rates (Africa, Middle East). All supported.' },
      { icon: '📋', title: 'MTD VAT reports', desc: 'Making Tax Digital ready. One-click MTD VAT report export in the correct format for HMRC.' },
      { icon: '🔗', title: 'Xero & QuickBooks sync', desc: 'Tax data flows directly to your accounting system. No manual exports or re-keying.' },
      { icon: '🏪', title: 'Per-branch tax rates', desc: 'Each branch can have different tax rates for different jurisdictions. All consolidated in group reports.' },
    ],
    benefits: ['MTD VAT export ready', 'Multi-jurisdiction per branch', 'Auto-sync to Xero & QuickBooks'],
    useCases: [
      { title: 'UK retailer', desc: 'Standard and reduced VAT rates per product. MTD VAT report generated in one click at quarter end.' },
      { title: 'Multi-country chain', desc: 'UK branch on 20% VAT, Kenya branch on 16% VAT, UAE branch on 5% VAT — all from one account.' },
      { title: 'Accountant-managed business', desc: 'Xero sync means your accountant always has up-to-date transaction data. No CSV emails.' },
    ],
  },
  {
    slug: 'localisation',
    icon: '🌍', title: 'Localisation', tag: 'Local', color: '#059669',
    desc: 'Date formats, number separators, address formats, and receipt layouts automatically match your country. Right-to-left language support included.',
    hero: 'The POS speaks your language and follows your local conventions — dates, numbers, addresses, and receipts all formatted for your market.',
    screen: 'retail',
    details: [
      { icon: '📅', title: 'Local date & number formats', desc: 'DD/MM/YYYY or MM/DD/YYYY. Comma vs period decimals. All follows your locale automatically.' },
      { icon: '🧾', title: 'Localised receipt layouts', desc: 'Receipt header, footer, tax line, and address format match your country\'s standards.' },
      { icon: '↔️', title: 'Right-to-left support', desc: 'Arabic, Hebrew, and other RTL languages supported. The full UI flips direction automatically.' },
      { icon: '📍', title: 'Address format matching', desc: 'Address fields and postal code formats match the local standard per country.' },
    ],
    benefits: ['Automatic locale detection', 'RTL language support', 'Compliant receipt layouts per country'],
    useCases: [
      { title: 'Middle East retailer', desc: 'Arabic UI, RTL layout, AED currency, and receipt format — all set automatically from your branch location.' },
      { title: 'European expansion', desc: 'German date formats, Euro currency, EU receipt requirements — each country gets the right layout.' },
      { title: 'African market', desc: 'Local currency symbols, M-Pesa payment on receipts, and Swahili or French interface in one tap.' },
    ],
  },
  {
    slug: 'payments',
    icon: '💳', title: 'Flexible Payments', tag: 'Payments', color: '#d08a59',
    desc: 'Accept card, cash, mobile money (M-Pesa, MTN, Airtel), QR pay, and split payments. Works offline and syncs when reconnected.',
    hero: 'Accept any payment method your customers use — card, cash, mobile money, QR code, or a split of all four. Nothing blocked.',
    screen: 'register',
    details: [
      { icon: '📱', title: 'Mobile money', desc: 'M-Pesa, MTN MoMo, Airtel Money, and other local wallets. QR code shown on screen for customer to scan.' },
      { icon: '💳', title: 'Card payments', desc: 'Tap, chip, or swipe via any card terminal. Or use Stripe Terminal for integrated processing.' },
      { icon: '✂️', title: 'Split payments', desc: 'Customer pays half by card, half by mobile money? Split it — any combination, any number of payment methods.' },
      { icon: '📴', title: 'Offline mode', desc: 'No internet? The register keeps working. Payments sync when the connection returns.' },
    ],
    benefits: ['Mobile money for every major African network', 'Split payments — any combination', 'Full offline capability'],
    useCases: [
      { title: 'Kenyan FMCG shop', desc: 'Accept M-Pesa, KCB Mpesa, and cash simultaneously. QR on screen, confirmation before checkout.' },
      { title: 'Pop-up market stall', desc: 'Unreliable internet? Offline mode keeps selling. Everything syncs when you get back to the office.' },
      { title: 'High-value retail', desc: 'Customer pays deposit by card, balance on collection. Split payment tracks both legs.' },
    ],
  },
  {
    slug: 'ai-intelligence',
    icon: '🤖', title: 'AI Intelligence', tag: 'AI', color: '#7c3aed',
    desc: 'Anomaly detection on transactions, AI-driven supplier recommendations, sales pattern insights, and demand forecasting — all from your PoS data.',
    hero: 'Claude AI watches your POS data 24/7 — surfacing anomalies, flagging shrinkage, predicting stockouts, and explaining what\'s driving your numbers.',
    screen: 'overview',
    details: [
      { icon: '🔍', title: 'Anomaly detection', desc: 'Unusual voids, price changes, discount patterns, or cash discrepancies flagged before they become problems.' },
      { icon: '📈', title: 'Demand forecasting', desc: 'Sales velocity analysis predicts which products to reorder and when, based on your actual sales history.' },
      { icon: '🏭', title: 'Supplier recommendations', desc: 'AI grades suppliers on on-time delivery, defect rate, and margin impact — and recommends alternates.' },
      { icon: '💬', title: 'Ask in plain English', desc: 'Ask "What was my best-selling product last month?" and get a plain English answer with your real numbers.' },
    ],
    benefits: ['Anomaly detection runs 24/7', 'Demand forecasting from sales history', 'Plain English answers to any question'],
    useCases: [
      { title: 'Cash-heavy business', desc: 'AI flags when cash-in doesn\'t match till totals. Spots patterns that suggest human error — or worse.' },
      { title: 'High-SKU retailer', desc: 'With 500+ products, AI identifies which are underperforming, trending, or about to go out of stock.' },
      { title: 'Multi-branch operator', desc: 'AI compares performance across branches and surfaces which location needs attention and why.' },
    ],
  },
  {
    slug: 'reports',
    icon: '📊', title: 'Reports & Analytics', tag: 'Insights', color: '#2563eb',
    desc: 'Daily, weekly, and monthly sales reports broken down by product, cashier, branch, and payment method. Export in your local currency.',
    hero: 'Every sale, every shift, every product — reported clearly. Daily, weekly, or monthly, broken down by however you want to cut it.',
    screen: 'overview',
    details: [
      { icon: '📅', title: 'Period comparison', desc: 'Today vs yesterday. This week vs last week. This month vs last month. Trend direction on every metric.' },
      { icon: '🏪', title: 'Branch breakdown', desc: 'Revenue, margin, and transaction count per branch — side by side. Spot your best and worst locations.' },
      { icon: '🧾', title: 'Product performance', desc: 'Units sold, revenue, and margin per product. Sort by any column. Export to CSV in one click.' },
      { icon: '📤', title: 'MTD VAT & accounting export', desc: 'MTD VAT report, full transaction ledger, and accounting export ready for Xero or QuickBooks.' },
    ],
    benefits: ['Period-over-period comparison built in', 'CSV export in local currency', 'MTD VAT report in one click'],
    useCases: [
      { title: 'Weekly business review', desc: 'Pull last week vs the week before in 10 seconds. Know your trajectory before the team meeting.' },
      { title: 'Accountant reporting', desc: 'Monthly transaction ledger exported to Xero automatically. Your accountant never has to chase you.' },
      { title: 'Product range decisions', desc: 'Sort products by margin, not just revenue. Identify slow movers before they tie up your cash.' },
    ],
  },
  {
    slug: 'privacy',
    icon: '🔒', title: 'Privacy & Compliance', tag: 'Trust', color: '#374151',
    desc: 'GDPR, NDPR, POPIA, and PDPA ready. One-click customer data export, deletion requests, consent logging, and configurable retention policies.',
    hero: 'GDPR, NDPR, POPIA, PDPA — wherever your customers are, their data rights are respected. Built in, not bolted on.',
    screen: 'staff',
    details: [
      { icon: '📤', title: 'Data export on request', desc: 'Customer requests their data? Export it in one click. Full transaction history, receipts, and profile.' },
      { icon: '🗑️', title: 'Right to erasure', desc: 'Delete a customer\'s data permanently. Audit log confirms the deletion for compliance records.' },
      { icon: '✅', title: 'Consent logging', desc: 'Marketing consent captured and logged with timestamp. Auditable trail for every customer.' },
      { icon: '⏱️', title: 'Configurable retention', desc: 'Set how long transaction data is retained. Auto-purge after your chosen period.' },
    ],
    benefits: ['GDPR, NDPR, POPIA, PDPA compliant', 'One-click data export & deletion', 'Consent log with full audit trail'],
    useCases: [
      { title: 'UK/EU retailer', desc: 'GDPR compliance out of the box. Data export and deletion tools ready for any subject access request.' },
      { title: 'Nigerian business', desc: 'NDPR compliance — customer consent captured, data residency options, and deletion on request.' },
      { title: 'South African retailer', desc: 'POPIA-ready with consent logging, retention policies, and data officer reporting built in.' },
    ],
  },
  {
    slug: 'works-everywhere',
    icon: '📱', title: 'Works Everywhere', tag: 'Flex', color: '#374151',
    desc: 'Runs on any device — iPad at the counter, Android phone for pop-ups, or desktop in the back office. No proprietary hardware, no lock-in.',
    hero: 'Your iPhone. Your Android. Your old laptop. The POS runs on anything with a browser — no app install, no hardware fees, no lock-in.',
    screen: 'register',
    details: [
      { icon: '📱', title: 'Any device', desc: 'iPad, Android tablet, phone, laptop, or desktop. If it has a browser, it runs the POS.' },
      { icon: '📴', title: 'Offline first', desc: 'Lost connection? Keep selling. Everything syncs automatically when you reconnect.' },
      { icon: '🔌', title: 'No proprietary hardware', desc: 'Use any Bluetooth or USB barcode scanner. No $500 terminals. No locked hardware contracts.' },
      { icon: '🔄', title: 'Multi-device shift', desc: 'Open a shift on iPad, close it on desktop. The shift travels with the user, not the device.' },
    ],
    benefits: ['Works on any browser — no app install', 'Full offline capability', 'No hardware lock-in or minimum contracts'],
    useCases: [
      { title: 'Pop-up market', desc: 'Use the phone you already have. Full POS, payments, and receipts from any mobile browser.' },
      { title: 'Shop counter', desc: 'Mount an old iPad, pair a cheap Bluetooth scanner. Professional setup for under £50 of hardware.' },
      { title: 'Remote or rural store', desc: 'Offline mode keeps the register running when the internet drops. Syncs when you reconnect.' },
    ],
  },
]
