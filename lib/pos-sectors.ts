// Shared sector definitions for /point-of-sale and /point-of-sale/[sector] pages

export interface SectorFeature {
  icon: string
  title: string
  desc: string
}

export interface Sector {
  id: string
  icon: string
  label: string
  tagline: string
  desc: string
  color: string
  tiles: string[]
  features: SectorFeature[]
  // Extended content for the dedicated sector page
  hero: string
  workflow: { step: string; title: string; desc: string }[]
  useCases: { title: string; desc: string }[]
  stats: { value: string; label: string }[]
}

export const SECTORS: Sector[] = [
  {
    id: 'retail',
    icon: '🛒',
    label: 'Retail',
    tagline: 'Fast checkout. Smart shelves. Zero shrinkage.',
    desc: 'Everything a retail store needs from the floor to the back office — with AI watching margins and stock in real time.',
    color: '#2563eb',
    tiles: ['📦 Inventory', '🧾 Sales', '👥 Staff', '🏪 Branches', '🗺 Map', '📋 Audit'],
    features: [
      { icon: '📷', title: 'Barcode scanning', desc: 'Scan any product at the counter — item, price, and stock update instantly.' },
      { icon: '📦', title: 'Live inventory', desc: 'Real-time stock across all branches. Low-stock alerts and AI reorder suggestions.' },
      { icon: '💰', title: 'Split payments', desc: 'Card, cash, mobile money, or any combination. Discount codes and layaway built in.' },
      { icon: '🔄', title: 'Stock transfers', desc: 'Move items between branches and track every movement with a full audit trail.' },
      { icon: '🤖', title: 'AI margin alerts', desc: 'Anomaly detection flags unusual price drops, voids, or shrinkage patterns.' },
      { icon: '📊', title: 'Sales reports', desc: 'Daily, weekly, monthly — broken down by product, cashier, and payment method.' },
    ],
    hero: 'Run your shop from one screen. Barcode scan, sell, restock, and report — with AI watching every transaction.',
    workflow: [
      { step: '1', title: 'Open the shift', desc: 'Cashier logs in with OTP, counts the float. Register is live in seconds.' },
      { step: '2', title: 'Scan and sell', desc: 'Scan barcodes or search by name. Apply discounts, split payments, print receipts.' },
      { step: '3', title: 'Inventory stays current', desc: 'Every sale deducts stock in real time. Low-stock alerts appear automatically.' },
      { step: '4', title: 'Close and reconcile', desc: 'Close the shift, reconcile cash, and reports flow to your accounting system.' },
    ],
    useCases: [
      { title: 'Multi-branch clothing store', desc: 'Transfer stock between branches, set per-location pricing, and view consolidated sales across all sites in one dashboard.' },
      { title: 'Supermarket & FMCG', desc: 'Handle high-volume barcode scanning, expiry date tracking, and bulk reorder suggestions — all without external hardware.' },
      { title: 'Electronics & mobile shop', desc: 'Track serial numbers, manage warranty periods, and detect shrinkage patterns with AI anomaly alerts.' },
      { title: 'Market stall & pop-up', desc: 'Works offline on any phone or tablet. Syncs all transactions when you reconnect to the internet.' },
    ],
    stats: [
      { value: '< 2s', label: 'Average checkout time' },
      { value: '150+', label: 'Currencies supported' },
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '0', label: 'Proprietary hardware needed' },
    ],
  },
  {
    id: 'restaurant',
    icon: '🍽️',
    label: 'Restaurant',
    tagline: 'Table to till in seconds.',
    desc: 'Manage covers, kitchen orders, and front-of-house from one screen. No separate KDS hardware needed.',
    color: '#dc2626',
    tiles: ['🍽️ Tables', '🧾 Orders', '👥 Staff', '📦 Menu', '📋 Audit', '📊 Reports'],
    features: [
      { icon: '🍽️', title: 'Table & cover management', desc: 'Open a table, add covers, and ring up courses — all from a single screen.' },
      { icon: '🧾', title: 'Order & kitchen flow', desc: 'Orders route to the kitchen display automatically. No manual ticket writing.' },
      { icon: '🍷', title: 'Menu builder', desc: 'Categories, modifiers (extras, swaps), happy hour pricing, and daily specials.' },
      { icon: '💳', title: 'Split-bill & tips', desc: 'Split by item or equally. Tip prompts on screen. Gratuity line on receipt.' },
      { icon: '🗑️', title: 'Food waste capture', desc: 'Log wastage by item and shift. AI flags when waste is rising above baseline.' },
      { icon: '📊', title: 'Cover & revenue reports', desc: 'Average spend per cover, peak hours, and top-selling dishes — daily.' },
    ],
    hero: 'From first order to final bill, every table runs on one system. Kitchen routing, split bills, and nightly reports — without the complexity.',
    workflow: [
      { step: '1', title: 'Open tables', desc: 'Assign tables and covers. Walk-ins and reservations handled from the same view.' },
      { step: '2', title: 'Take orders', desc: 'Add items from the menu, apply modifiers, and send directly to the kitchen.' },
      { step: '3', title: 'Kitchen receives instantly', desc: 'Orders appear on the kitchen display the moment they\'re placed — no paper tickets.' },
      { step: '4', title: 'Bill and close', desc: 'Split the bill, add tips, take payment, and close the table in one flow.' },
    ],
    useCases: [
      { title: 'Full-service restaurant', desc: 'Table maps, multi-course ordering, and kitchen routing make full-service dining smooth for both staff and guests.' },
      { title: 'Café & fast casual', desc: 'Counter service with queue busting — take orders fast, route to bar and kitchen simultaneously.' },
      { title: 'Food truck & pop-up dining', desc: 'Works on any phone or tablet, offline if needed. Start selling anywhere in under 5 minutes.' },
      { title: 'Hotel restaurant', desc: 'Post charges to room tabs, handle multi-currency guest payments, and produce revenue reports for hotel management.' },
    ],
    stats: [
      { value: '3s', label: 'Order to kitchen time' },
      { value: '0', label: 'KDS hardware required' },
      { value: '100%', label: 'Offline capable' },
      { value: '24/7', label: 'Support included' },
    ],
  },
  {
    id: 'repair',
    icon: '🔧',
    label: 'Repair',
    tagline: 'Job in. Job tracked. Job done.',
    desc: 'Full job-ticket workflow from device check-in through diagnosis, repair, and customer handover — with parts inventory built in.',
    color: '#d97706',
    tiles: ['🔧 Service Jobs', '📦 Parts', '👥 Engineers', '🧾 Quotes', '📋 History', '🏪 Branches'],
    features: [
      { icon: '🔧', title: 'Service job tickets', desc: 'Log device make/model, fault description, and customer details on check-in.' },
      { icon: '📷', title: 'Device scan & photos', desc: 'Scan serial numbers or IMEI. Attach before/after photos to every job.' },
      { icon: '🛠️', title: 'Parts inventory', desc: 'Track parts stock, auto-deduct on job completion, and reorder when low.' },
      { icon: '💬', title: 'Customer quotes', desc: 'Generate a quote link customers can approve digitally before you start work.' },
      { icon: '🏆', title: 'Engineer skill matching', desc: 'Assign jobs by engineer specialisation. Track jobs per tech and completion rate.' },
      { icon: '🔒', title: 'Warranty tracking', desc: 'Log warranty period and alert cashiers when a device returns in-warranty.' },
    ],
    hero: 'Every repair job tracked from check-in to handover. Know your parts stock, engineer workload, and pending approvals at a glance.',
    workflow: [
      { step: '1', title: 'Check in the device', desc: 'Log make, model, fault, and customer. Scan serial number or IMEI. Take photos.' },
      { step: '2', title: 'Send a quote', desc: 'Build a repair quote and send a digital approval link to the customer.' },
      { step: '3', title: 'Assign and repair', desc: 'Assign to the right engineer. Parts are tracked and deducted on completion.' },
      { step: '4', title: 'Hand over and collect payment', desc: 'Mark complete, print receipt, log warranty period. Done.' },
    ],
    useCases: [
      { title: 'Phone & electronics repair', desc: 'IMEI scanning, before/after photos, and digital customer approvals mean no disputes at handover.' },
      { title: 'Multi-branch repair chain', desc: 'Jobs, engineers, and parts inventory consolidated across every location from one dashboard.' },
      { title: 'IT services & computer repair', desc: 'Track complex multi-day jobs, parts orders from suppliers, and engineer billable hours.' },
      { title: 'Appliance service centre', desc: 'Handle large items with collection/delivery tracking, warranty logs, and manufacturer reporting.' },
    ],
    stats: [
      { value: '100%', label: 'Digital job trail' },
      { value: '0', label: 'Paper job cards needed' },
      { value: 'Real-time', label: 'Parts stock visibility' },
      { value: 'Auto', label: 'Warranty expiry alerts' },
    ],
  },
  {
    id: 'salon',
    icon: '💇',
    label: 'Salon',
    tagline: 'Book it. Bill it. Build loyalty.',
    desc: 'Run appointments alongside walk-in retail. Track stylist performance, client history, and product sales from one dashboard.',
    color: '#7c3aed',
    tiles: ['📅 Appointments', '🛒 Retail', '👥 Stylists', '📋 Client history', '💳 Payments', '📊 Reports'],
    features: [
      { icon: '📅', title: 'Appointment booking', desc: 'Schedule appointments per stylist. Walk-ins slot in without disrupting the book.' },
      { icon: '💇', title: 'Service menu', desc: 'Set prices per service and stylist tier. Promotions and package deals built in.' },
      { icon: '🛒', title: 'Product retail', desc: 'Sell retail products alongside services. Inventory tracked the same as any store.' },
      { icon: '👤', title: 'Client history', desc: 'See every client\'s previous services, products bought, and stylist preferences.' },
      { icon: '💰', title: 'Tips & commissions', desc: 'Tip collection on screen. Per-stylist commission rules calculated automatically.' },
      { icon: '📊', title: 'Stylist performance', desc: 'Revenue, services, and product sales per stylist. Know your top earners daily.' },
    ],
    hero: 'Appointments, walk-ins, product retail, and stylist commissions — all from one screen. Build client loyalty with a full history behind every booking.',
    workflow: [
      { step: '1', title: 'Book the appointment', desc: 'Schedule per stylist or accept walk-ins. Both show in the same calendar view.' },
      { step: '2', title: 'Ring up the service', desc: 'Select services, add retail products, apply promotions. Client history is visible.' },
      { step: '3', title: 'Collect payment & tips', desc: 'Tips prompt at checkout. Commissions calculated automatically per stylist rules.' },
      { step: '4', title: 'Review daily performance', desc: 'End-of-day report shows revenue, commissions, and top services per stylist.' },
    ],
    useCases: [
      { title: 'Hair salon & barbershop', desc: 'Manage chairs, stylists, and walk-in queues alongside a product retail shelf — all from the same system.' },
      { title: 'Beauty & nail studio', desc: 'Track services per nail tech, run loyalty promotions, and manage product inventory at the station.' },
      { title: 'Spa & wellness centre', desc: 'Schedule therapists, track room usage, and run membership or package vouchers from one dashboard.' },
      { title: 'Multi-location beauty chain', desc: 'Centralised client records and stylist performance across every branch. Clients can book at any location.' },
    ],
    stats: [
      { value: 'Full', label: 'Client history per visit' },
      { value: 'Auto', label: 'Commission calculation' },
      { value: '0', label: 'Double bookings' },
      { value: '1', label: 'Screen for everything' },
    ],
  },
  {
    id: 'factory',
    icon: '🏭',
    label: 'Factory',
    tagline: 'Every batch tracked. Nothing lost.',
    desc: 'Capture intake, output, wastage, and dispatch at every stage. Approval workflows keep managers in control of production flow.',
    color: '#059669',
    tiles: ['📥 Captures', '✅ Approvals', '📦 Inventory', '🤖 Intelligence', '📋 Audit', '📊 Reports'],
    features: [
      { icon: '📥', title: 'Production captures', desc: 'Log intake, output, wastage, and dispatch with batch references and quantities.' },
      { icon: '✅', title: 'Approval workflow', desc: 'Managers approve or reject each capture. Pending queue with lag-time tracking.' },
      { icon: '📊', title: 'Output vs intake ratio', desc: 'AI monitors production efficiency and flags when yield drops below baseline.' },
      { icon: '🗑️', title: 'Wastage rate monitoring', desc: 'Track wastage % per batch. AI alerts when rising above your historical average.' },
      { icon: '🔍', title: 'Batch-level traceability', desc: 'Every capture linked to a batch reference — full chain from raw material to dispatch.' },
      { icon: '🤖', title: 'Factory intelligence', desc: 'Claude AI analyses your production data and surfaces anomalies and bottlenecks.' },
    ],
    hero: 'Every gram, every batch, every approval — logged and traceable. Know your yield, spot wastage, and get AI alerts before production issues become costly.',
    workflow: [
      { step: '1', title: 'Log intake', desc: 'Record raw material intake with batch reference, supplier, and quantity.' },
      { step: '2', title: 'Capture production', desc: 'Log output, wastage, and dispatch against each batch as production runs.' },
      { step: '3', title: 'Manager approves', desc: 'Each capture goes through the approval queue. Lag time is tracked automatically.' },
      { step: '4', title: 'AI reviews the data', desc: 'Claude flags unusual wastage, yield drops, or approval bottlenecks in real time.' },
    ],
    useCases: [
      { title: 'Food & beverage manufacturing', desc: 'Track raw ingredient intake, production batches, wastage per run, and finished goods dispatch with full audit trail.' },
      { title: 'Pharmaceutical production', desc: 'Approval workflows with manager sign-off on every batch. Traceability from intake to dispatch for regulatory compliance.' },
      { title: 'Garment & textile factory', desc: 'Log fabric intake, cut quantities, finished pieces, and end-of-line wastage per style and batch.' },
      { title: 'Small-batch artisan production', desc: 'Track yields per recipe, spot waste trends, and get reorder alerts when raw materials drop below minimum.' },
    ],
    stats: [
      { value: '100%', label: 'Batch traceability' },
      { value: 'Real-time', label: 'Wastage rate tracking' },
      { value: 'AI', label: 'Anomaly detection' },
      { value: 'Full', label: 'Approval audit trail' },
    ],
  },
  {
    id: 'logistics',
    icon: '🚚',
    label: 'Logistics',
    tagline: 'Every parcel. Every mile. Accounted for.',
    desc: 'Manage your courier fleet and parcel pipeline — from booking through delivery confirmation — with real-time fleet visibility.',
    color: '#0891b2',
    tiles: ['📦 Parcels', '🚚 Fleet', '🗺 Routes', '📋 Handover', '📊 Reports', '🤖 Intelligence'],
    features: [
      { icon: '📦', title: 'Parcel management', desc: 'Book, scan, track, and confirm parcels across every status from received to delivered.' },
      { icon: '🚚', title: 'Fleet tracking', desc: 'Monitor trucks by status — available, in transit, or maintenance. Assign loads.' },
      { icon: '🗺️', title: 'Route planning', desc: 'Group parcels by destination. Assign routes to drivers and track completion.' },
      { icon: '📷', title: 'Photo proof of delivery', desc: 'Drivers capture delivery photos. Stored against the parcel record permanently.' },
      { icon: '💰', title: 'Invoice & payment', desc: 'Auto-generate logistics invoices. Track paid vs unpaid across your parcel book.' },
      { icon: '🤖', title: 'Delivery intelligence', desc: 'AI flags high failure-rate routes, stuck parcels, and fleet utilisation anomalies.' },
    ],
    hero: 'Book parcels, manage your fleet, and confirm deliveries — all from one system. AI surfaces stuck parcels and fleet anomalies before they cost you.',
    workflow: [
      { step: '1', title: 'Book the parcel', desc: 'Log sender, recipient, destination, and fee. Print the label or scan at branch.' },
      { step: '2', title: 'Assign to a route', desc: 'Group parcels by destination and assign to the right truck and driver.' },
      { step: '3', title: 'Track in transit', desc: 'Update status at each checkpoint. Driver photos confirm delivery on arrival.' },
      { step: '4', title: 'Invoice and reconcile', desc: 'Auto-generate invoices per parcel or batch. Flag unpaid accounts for follow-up.' },
    ],
    useCases: [
      { title: 'Last-mile courier company', desc: 'Manage hundreds of parcels daily across multiple drivers, branches, and city routes — with photo delivery proof on every drop.' },
      { title: 'Regional freight & haulage', desc: 'Track truck loads, assign multi-stop routes, monitor fleet maintenance status, and produce consignment reports.' },
      { title: 'E-commerce fulfilment centre', desc: 'Integrate order dispatch with parcel creation, track delivery status, and flag failed deliveries for re-routing automatically.' },
      { title: 'In-house delivery fleet', desc: 'Retail or restaurant chains running their own delivery — manage drivers, routes, and delivery confirmation from the same POS system.' },
    ],
    stats: [
      { value: 'Real-time', label: 'Parcel status updates' },
      { value: 'Photo', label: 'Proof of delivery' },
      { value: 'AI', label: 'Failure rate alerts' },
      { value: '0', label: 'Extra tracking software needed' },
    ],
  },
]
