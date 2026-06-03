import { AcademyArticle } from "./academy-types";

export const ASKBIZ_POS_HACKS_ARTICLES: AcademyArticle[] = [

  // 1 ─── Daily Brief Routine ──────────────────────────────────────────────────
  {
    slug: "pos-hack-daily-brief-routine-askbiz",
    title: "Start Every Day in 60 Seconds with the Daily Brief",
    description: "A power-user morning routine using AskBiz POS Overview — check revenue, stock alerts, and staff performance in under a minute before you open the doors.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["daily brief", "POS overview", "morning routine", "health score", "revenue check", "AskBiz", "shortcut", "efficiency"],
    keyTakeaways: [
      "The Overview tab is your single daily dashboard — revenue, gross profit, margin, and low-stock count at a glance.",
      "Switch to 'Today' filter the moment you arrive so you're comparing live numbers, not yesterday's.",
      "The Low Stock badge on the Overview tells you how many items need reordering before the first sale.",
      "A 60-second daily brief habit catches problems early and removes guesswork from the trading day."
    ],
    content: [
      {
        heading: "Why a 60-second brief beats a 30-minute spreadsheet check",
        body: "Most business owners spend the first 20–30 minutes of the day pulling numbers together from emails, spreadsheets, and WhatsApp messages. AskBiz POS Overview replaces all of that. In one tab you can see today's revenue, gross profit margin, the number of sales, refunds issued, and how many products are running low — all updated in real time. The habit takes discipline to build but pays back in hours per week.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "Step 1 — Hit 'Today' the moment you open POS",
        body: "Go to askbiz.co/pos and click the Overview tab. The date filter defaults to 'Last 30 days'. Click 'Today' to switch to live data. You'll immediately see today's Revenue, Sales count, Refunds, and Low Stock number. Gross Profit and Margin appear in the second row. This single view replaces an opening-time spreadsheet check. Bookmark askbiz.co/pos so you land here every morning."
      },
      {
        heading: "Step 2 — Check the Low Stock count first",
        body: "The 'Low stock' metric in the top row shows how many products are below their reorder threshold. If that number is greater than zero, go to Operations > Inventory and click the 'Low stock' filter tab immediately. Review which products are affected before the trading day starts — placing restock orders in the morning means stock can arrive before you run out. This single habit eliminates the most common cause of lost sales."
      },
      {
        heading: "Step 3 — Glance at Staff Performance",
        body: "Scroll down the Overview page to the Staff Performance section. This shows each cashier's sales count and revenue for the day. If it's 9 am and one till shows zero sales while another shows five, you know someone hasn't logged in yet. This is a 10-second staffing check that used to require walking the floor."
      },
      {
        heading: "Step 4 — Check yesterday's final numbers in 'Yesterday'",
        body: "Before switching fully to Today, click 'Yesterday' for 5 seconds to confirm the previous day closed correctly. If yesterday's Revenue looks unexpectedly low, check the Audit log for any voids or session issues before today's trading begins. Once satisfied, flip back to Today and leave Overview open on a shared screen for the team to see."
      },
      {
        heading: "Making the brief a team habit",
        body: "Print the 5-step brief on a card and stick it next to the till: (1) Open Overview, (2) Select Today, (3) Check Low Stock, (4) Check Refunds = 0, (5) Confirm Staff Performance shows all cashiers active. Any cashier or manager can run this in under a minute. The shared screen approach — projecting Overview on a TV behind the counter — means the whole team sees the same numbers without anyone having to report them."
      }
    ],
    relatedSlugs: ["pos-hack-health-score-shortcut-askbiz", "pos-hack-metrics-pinning-askbiz", "pos-daily-brief-askbiz"],
    faq: [
      { q: "Can I see last week's daily briefs to spot trends?", a: "Yes — use the custom date range picker on Overview and select a 7-day window. The charts update to show revenue by hour across the week so you can spot which days and shifts perform best." },
      { q: "Does the Overview update in real time?", a: "Yes. Revenue, sales count, and low-stock numbers update as each transaction is processed at the till. There is no need to refresh the page manually." }
    ]
  },

  // 2 ─── Quick Keys Config ────────────────────────────────────────────────────
  {
    slug: "pos-hack-quick-keys-config-askbiz",
    title: "Set Up Quick Keys for One-Tap Product Entry",
    description: "How to configure Quick Keys at the AskBiz POS till so your fastest-selling products are one tap away — eliminating barcode scans for your top 20 items.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["quick keys", "fast checkout", "product shortcut", "till speed", "one-tap", "AskBiz POS", "cashier efficiency", "frequently sold"],
    keyTakeaways: [
      "Quick Keys let cashiers add a product to a sale with a single tap — no barcode scan needed.",
      "Assign your top 20 fastest-selling products to Quick Keys for the biggest speed gain.",
      "Quick Keys are configured at pos.askbiz.co (the till) under Till Settings > Quick Keys.",
      "A well-configured Quick Keys grid can reduce checkout time per item from 3 seconds to under 1 second."
    ],
    content: [
      {
        heading: "What are Quick Keys and why do they matter?",
        body: "Quick Keys are one-tap shortcut buttons displayed on the till screen at pos.askbiz.co. Each button is linked to a specific product — tap it and the item is added to the sale instantly, at the correct price, with stock deducted. For fast-moving items like bottled water, bread, or prepaid airtime, Quick Keys remove the need to scan a barcode or search by name. On a busy till, shaving 2 seconds off every item adds up to 15–20 fewer minutes of customer queuing per day.",
        image: "/images/training/pos-inventory.png",
      },
      {
        heading: "Step 1 — Identify your top 20 fastest-selling products",
        body: "Before you set up Quick Keys, go to Operations > Inventory in the POS management panel. Sort products by their category and look at what your team scans most often during a shift. Alternatively, go to Operations > Sales, filter to Last 7 days, and identify the products with the highest transaction count. Write down the exact product names — these are the candidates for Quick Keys. Aim for 12–20 products, which fills a standard grid without making it crowded."
      },
      {
        heading: "Step 2 — Open Till Settings at pos.askbiz.co",
        body: "Quick Keys are configured at the till, not in the management panel. On the device running pos.askbiz.co, log in as a manager, tap the Settings icon (gear wheel, top right), then tap 'Quick Keys'. You'll see an empty grid — each cell can be assigned a product. Tap any empty cell, search for the product name, and confirm. The product image and price appear on the button immediately."
      },
      {
        heading: "Step 3 — Arrange your grid for natural hand movement",
        body: "Put the products you sell most often in the top-left of the grid — this is where the eye and hand naturally go first. Group similar items together: all beverages in one row, snacks in another. If your team uses a touchscreen till, make the most-tapped items larger by assigning them to wide cells (double-width) if your layout supports it. Review and adjust the grid every month as your top-sellers change."
      },
      {
        heading: "Step 4 — Train your cashiers on Quick Keys in 3 minutes",
        body: "Stick a laminated card next to the till with the product grid printed on it. During the first shift with Quick Keys active, walk cashiers through the grid — 'This corner is all beverages, this row is snacks.' Most cashiers memorise the grid within 2–3 shifts purely through repetition. The speed improvement is obvious immediately, which motivates uptake without needing to enforce it."
      },
      {
        heading: "Keeping Quick Keys up to date",
        body: "When you add a new fast-selling product to your inventory (via Operations > Inventory > Scan to add), add it to Quick Keys the same day. When a product goes out of stock permanently, remove its Quick Key to avoid cashiers tapping it and getting a 'no stock' error mid-sale. A monthly 5-minute review of the grid — comparing it against your top-sellers report — keeps Quick Keys accurate year-round."
      }
    ],
    relatedSlugs: ["pos-hack-barcode-scan-speed-askbiz", "pos-hack-product-search-shortcuts-askbiz", "pos-barcode-till-askbiz"],
    faq: [
      { q: "How many Quick Keys can I set up?", a: "The grid supports up to 20 Quick Keys by default. Contact AskBiz support if you need a larger grid for businesses with a wider fast-moving product range." },
      { q: "Can different branches have different Quick Key grids?", a: "Yes — Quick Keys are configured per device, so each branch or till can have its own grid tailored to the products that sell fastest at that location." }
    ]
  },

  // 3 ─── Barcode Scan Speed ───────────────────────────────────────────────────
  {
    slug: "pos-hack-barcode-scan-speed-askbiz",
    title: "Ring Up 20 Items in Under a Minute with Barcode Scanning",
    description: "Pro tips for fast barcode scanning at the AskBiz till — scanner positioning, product catalogue hygiene, and how to handle unlabelled items without slowing down the queue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["barcode scanning", "till speed", "checkout speed", "scanner tips", "POS efficiency", "AskBiz", "product catalogue", "unlabelled items"],
    keyTakeaways: [
      "A well-positioned scanner and clean product catalogue allows 20 items to be processed in under 60 seconds.",
      "Every product must have its barcode registered in Inventory — unregistered barcodes slow the till to a crawl.",
      "Use the 'Scan to add' shortcut on the Inventory page to register new barcodes in under 10 seconds.",
      "Assign Quick Keys for the 10 items you sell most that have no barcode — this covers unlabelled goods instantly."
    ],
    content: [
      {
        heading: "The real bottleneck at a busy till",
        body: "When a customer reaches the till with 20 items, checkout time breaks down into three phases: picking up and orienting each item for scanning (1–2 seconds each), waiting for the scanner to read and the till to respond (under 0.5 seconds if the product is registered), and processing payment. The biggest gains come from reducing orientation time and eliminating 'product not found' pauses. AskBiz's barcode system handles the middle phase instantly — the hacks in this article fix the other two.",
        image: "/images/training/pos-inventory.png",
      },
      {
        heading: "Hack 1 — Register every barcode before opening day",
        body: "An unregistered barcode causes the till to pause and show a 'product not found' message, forcing the cashier to search manually or call for help. To register barcodes quickly, go to Operations > Inventory and click 'Scan to add'. Scan the product barcode with your phone camera or handheld scanner — AskBiz reads the barcode, looks up the product database, and auto-fills the name, suggested category, and pricing fields. You only need to confirm or adjust. Bulk-register an entire shelf in 20–30 minutes before your next trading day."
      },
      {
        heading: "Hack 2 — Angle the scanner correctly for one-pass reads",
        body: "Handheld scanners read barcodes fastest when held at a slight angle (15–20 degrees) rather than perfectly perpendicular to the barcode. This reduces reflection from shiny packaging. For fixed-mount scanners, position the unit so products pass at the optimal distance (usually 10–30 cm) specified in the scanner manual. Poor scanner positioning is the single most common cause of slow scanning — a well-positioned scanner reads on the first pass over 95% of the time."
      },
      {
        heading: "Hack 3 — Use quantity multiplier for multiples of the same item",
        body: "When a customer buys 6 bottles of the same product, don't scan each one individually. Scan one, then tap the quantity field at the till and type '6'. AskBiz multiplies the price and deducts 6 units from stock in a single action. This is the biggest single speed-up for grocery and convenience stores where bulk purchases are common. Train all cashiers on this before they process their first shift."
      },
      {
        heading: "Hack 4 — Assign Quick Keys for your unlabelled products",
        body: "Loose produce, baked goods, and handmade items often have no barcode. Rather than forcing cashiers to search by name (3–5 seconds per item), assign these products as Quick Keys at the till. When the customer presents an unlabelled item, the cashier taps one button. This hack eliminates the most common source of queue build-up in food and produce retail."
      },
      {
        heading: "Hack 5 — Use the Low Stock filter to pre-register new arrivals",
        body: "When new stock arrives, register the barcodes before putting items on the shelf — not after a cashier encounters them at the till. Go to Inventory > Scan to add and process the delivery receipt line by line. This turns a supply chain task (stock intake) into a till-readiness task, so the till is never surprised by an unfamiliar barcode during trading hours."
      }
    ],
    relatedSlugs: ["pos-hack-quick-keys-config-askbiz", "pos-hack-product-search-shortcuts-askbiz", "pos-barcode-till-askbiz"],
    faq: [
      { q: "What scanners work with AskBiz POS?", a: "AskBiz works with any USB HID or Bluetooth barcode scanner. The till interface at pos.askbiz.co treats scanner input as keyboard input, so no driver installation is required." },
      { q: "What if a product barcode is damaged and won't scan?", a: "Use the product search bar at the till — type the first 3 letters of the product name and tap it from the results list. This typically takes under 3 seconds." }
    ]
  },

  // 4 ─── Product Search Shortcuts ─────────────────────────────────────────────
  {
    slug: "pos-hack-product-search-shortcuts-askbiz",
    title: "Find Any Product in 2 Seconds with Smart Search",
    description: "How to use AskBiz POS smart product search to locate any item in your catalogue faster than a barcode scan — essential for unlabelled goods, bulk bins, and custom items.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["product search", "smart search", "POS speed", "find product", "AskBiz till", "search shortcut", "inventory lookup", "catalogue"],
    keyTakeaways: [
      "Typing the first 3 letters of a product name in the till search bar finds it faster than scanning for loose goods.",
      "Product names must be consistent in your Inventory for search to work reliably — avoid abbreviations and typos.",
      "Combine search with quantity multiplier to process weighed or bulk goods without barcodes.",
      "Use category filters in Inventory to keep the product search list clean and short."
    ],
    content: [
      {
        heading: "When is search faster than scanning?",
        body: "Barcode scanning is fastest for labelled, packaged goods. But the moment a cashier picks up an unlabelled item — loose fruit, a bakery roll, a handmade product — scanning is impossible and search takes over. At AskBiz POS, the product search bar at pos.askbiz.co is always visible at the top of the checkout screen. Typing 3 characters produces a filtered list in under 0.5 seconds. With a clean, well-named product catalogue, 'ban' returns 'Banana', 'ban bread', and 'banned items' — cashiers learn within one shift which abbreviations work.",
        image: "/images/training/pos-inventory.png",
      },
      {
        heading: "Hack 1 — Standardise product names in your Inventory",
        body: "Go to Operations > Inventory and audit your product names. Remove abbreviations like 'Rce' (Rice), 'Sg' (Sugar), and inconsistent capitalisation. A product called 'Basmati Rice 5KG' is found instantly by typing 'bas'. A product called 'BR5' requires memorising a code. Spend 30 minutes standardising names and search becomes a reliable shortcut rather than a gamble. The Inventory page allows inline editing — click 'Edit' next to any product."
      },
      {
        heading: "Hack 2 — Use category tags to shorten search lists",
        body: "Assign every product a category in Inventory. At the till, cashiers can filter search by category — tap 'Beverages' and then type 'wat' to see only water products rather than every product containing 'wat'. This filter combination finds products in highly stocked catalogues (50+ items) far faster than unfiltered search. Categories set in Inventory appear automatically at the till with no additional configuration."
      },
      {
        heading: "Hack 3 — Search + quantity multiplier for weighed goods",
        body: "For products sold by weight (deli items, loose grains, bulk spices), search for the product name, then change the quantity to a decimal — for example 0.5 for half a kilogram. AskBiz calculates the price proportionally. This avoids needing a separate price-per-weight calculation or a manual override. Set up weighed products in Inventory with 'per kg' pricing so the multiplier works correctly at the till."
      },
      {
        heading: "Hack 4 — Create shorthand product names for the fastest searches",
        body: "For products your cashiers search constantly, consider adding a short prefix to the name. For example, rename your top 10 search items with a '#' prefix: '#Water 500ml', '#Bread White'. At the till, typing '#' returns only these 10 items instantly — a de facto Quick Key list for search-based products. This is a low-tech hack that works immediately without any configuration change."
      },
      {
        heading: "Keeping your catalogue clean long-term",
        body: "Every time you add a product via Inventory > Scan to add, complete all fields before saving — name, category, sector, price, and cost. A product added with only a barcode and price becomes hard to find via search a month later. The 5 extra seconds at product registration save 3 seconds per search, thousands of times over. Run a monthly catalogue audit using the CSV export from Inventory to spot missing names or duplicate entries."
      }
    ],
    relatedSlugs: ["pos-hack-barcode-scan-speed-askbiz", "pos-hack-quick-keys-config-askbiz", "pos-product-search-askbiz"],
    faq: [
      { q: "Can I search by SKU or product code?", a: "Yes — the till search bar matches against product name, SKU, and barcode number. If you assign SKU codes in Inventory, cashiers can type them at the till to find items instantly." },
      { q: "How many products can AskBiz hold in the catalogue?", a: "There is no published upper limit. Businesses with 500+ SKUs use category and sector filters to keep search results manageable." }
    ]
  },

  // 5 ─── Discount Presets ──────────────────────────────────────────────────────
  {
    slug: "pos-hack-discount-presets-askbiz",
    title: "Pre-Set Your Most-Used Discounts for One-Click Applying",
    description: "How to configure recurring promotions in AskBiz so cashiers apply your standard discounts with one tap — without needing manager approval for every price reduction.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["discount presets", "promotions", "one-click discount", "cashier permissions", "POS hack", "AskBiz", "price reduction", "checkout speed"],
    keyTakeaways: [
      "Create recurring promotions in Operations > Promotions so discounts appear as presets at the till.",
      "Named promotions allow cashiers to apply a discount with one tap — no percentage calculation needed.",
      "All applied promotions are tracked in your Reports > Promotions section with full audit trail.",
      "Set validity dates on promotions so they deactivate automatically without manual removal."
    ],
    content: [
      {
        heading: "The problem with ad-hoc discounts",
        body: "When a cashier applies a manual percentage discount, three things happen: they might calculate it wrong, the discount is recorded as 'custom' with no label, and the manager can't see at month-end whether that discount was authorised or accidental. AskBiz Promotions solves all three problems — define your discounts once in Operations > Promotions and they appear as one-tap options at the till, with full tracking.",
        image: "/images/training/pos-apply-discount.png",
      },
      {
        heading: "Step 1 — Create a named promotion in Operations > Promotions",
        body: "Go to Operations > Promotions. Click '+ New promotion' and fill in: Name (e.g. 'Staff Discount 15%'), discount type (percentage or fixed amount), value (15), and optionally a validity period. Give it a clear name that cashiers will recognise at the till. Save it. The promotion is now live and visible to cashiers as a one-tap option at checkout. If you set an end date, it disappears automatically when the promotion expires."
      },
      {
        heading: "Step 2 — Set up your recurring standard discounts",
        body: "Most businesses have 3–5 standard discounts they apply regularly: staff discount, loyal customer discount, bulk purchase discount, market day discount, and a general 'manager override' option. Create each as a named promotion with the correct percentage. This replaces the need for cashiers to type a number — they tap the discount name and the correct amount is applied. If a cashier tries to apply a discount not on the list, they'll need manager approval, which acts as a natural control."
      },
      {
        heading: "Step 3 — Track promotion usage in Reports",
        body: "Go to Operations > Reports to see the total discounts given over any period, broken down by promotion name. If 'Staff Discount 15%' was applied 47 times last month, you can see the total value given away and which cashier applied it most. This data is invaluable for understanding if a promotion is being over-used or if there are unauthorised patterns. It also feeds directly into your gross profit calculation, so your margin figures are always accurate."
      },
      {
        heading: "Hack — Use expiry dates as your promotions calendar",
        body: "Instead of manually removing seasonal promotions, set their end date in advance. A 'Valentine's Week 20% off flowers' promotion set to expire on 15 February disappears automatically. This means your Promotions list stays clean and cashiers never accidentally apply a deal that ended last season. Combine this with a note in your team WhatsApp group announcing the promotion start and end dates — AskBiz handles the technical deactivation."
      },
      {
        heading: "Hack — Minimum purchase promotions for upselling",
        body: "If your promotion requires a minimum basket value (e.g. 'Spend KSh 1,000, get 10% off'), configure the minimum value in the promotion settings. The till will only show this promotion as available when the basket reaches the threshold. This nudges cashiers to mention the deal when a customer is close — 'You're KSh 150 away from 10% off' — without requiring any mental arithmetic from the cashier."
      }
    ],
    relatedSlugs: ["pos-hack-split-pay-default-askbiz", "pos-apply-discount-askbiz", "pos-cashier-shifts-askbiz"],
    faq: [
      { q: "Can I restrict which cashiers can apply discounts?", a: "Yes — cashier permissions in Operations > Staff let you assign discount authority per role. Cashiers can be limited to preset promotions only, while managers can apply custom amounts." },
      { q: "Do promotions apply to the whole basket or individual items?", a: "Both are supported. Promotions can be order-level (basket total) or line-level (specific product). Configure this when creating the promotion in Operations > Promotions." }
    ]
  },

  // 6 ─── Split Payment Default ─────────────────────────────────────────────────
  {
    slug: "pos-hack-split-pay-default-askbiz",
    title: "Save Your Favourite Split Payment Mix as Default",
    description: "How to streamline M-Pesa + cash split payments at the AskBiz till so your most common two-method combination is always the fastest option for cashiers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["split payment", "M-Pesa cash", "payment mix", "checkout shortcut", "AskBiz POS", "two payment methods", "cashier tip", "payment speed"],
    keyTakeaways: [
      "AskBiz POS supports split payment across cash, M-Pesa, and card in any combination.",
      "Train cashiers to enter the M-Pesa amount first — the till auto-calculates the remaining cash due.",
      "Keep the Integrations page configured with active M-Pesa to ensure split payment is always available.",
      "Split payment transactions are recorded separately in Reports so you see exact cash vs digital revenue."
    ],
    content: [
      {
        heading: "Why split payment is common — and how to make it fast",
        body: "In Kenyan retail, customers frequently pay part by M-Pesa and part by cash — especially for purchases between KSh 500 and KSh 2,000. The M-Pesa balance might only cover two-thirds of the bill, with the remainder in cash. AskBiz POS handles this in a single sale, but cashiers can lose 30–60 seconds if they're not trained on the fastest entry sequence. This article shows the exact 4-step split payment flow that eliminates fumbling.",
        image: "/images/training/pos-payment-methods.png",
      },
      {
        heading: "The 4-step fast split payment flow",
        body: "1. Complete the sale basket (all items scanned or keyed). 2. At the payment screen, tap 'Split'. 3. Enter the M-Pesa amount and tap 'Confirm M-Pesa' — the customer sends payment while you're still at the till. 4. AskBiz automatically shows the remaining cash amount. The cashier collects cash and taps 'Confirm Cash'. The sale closes in one transaction with both payment types recorded. The key: enter M-Pesa first while the customer has their phone out."
      },
      {
        heading: "Training cashiers on the correct sequence",
        body: "The most common mistake cashiers make with split payment is entering the cash amount first, then realising the M-Pesa amount, and having to restart. Drill the rule: M-Pesa first, always. The customer will always know their M-Pesa amount — it's limited by their phone balance. The cash is whatever is left. Once cashiers internalise this sequence, split payments become as fast as single-method payments within a week."
      },
      {
        heading: "Keeping M-Pesa always ready",
        body: "Go to Operations > Integrations to verify M-Pesa is connected and shows an 'Active' status. If the M-Pesa connection drops (network issue or credential expiry), the split option disappears at the till and cashiers fall back to manual logging — which means lost data. Check Integrations weekly and reconnect immediately if the status changes from Active. Set a recurring calendar reminder for the first day of each month."
      },
      {
        heading: "Reconciling split payments in Reports",
        body: "Go to Operations > Reports > Sales. Filter by 'Payment method' to see a breakdown of how much revenue came via cash vs M-Pesa for any date range. If your business is transitioning customers from cash to M-Pesa, track this monthly — you'll see the cash percentage drop over time as customers adopt mobile payment. This data also helps you size your daily cash float correctly."
      },
      {
        heading: "Handling the split payment that doesn't complete",
        body: "Occasionally M-Pesa confirmation is slow (network delay). The till waits in a pending state — do not close the sale. Instruct customers to wait for the M-Pesa SMS confirmation before completing the transaction. If after 2 minutes no confirmation arrives, void the M-Pesa portion and restart with a different method. AskBiz does not record revenue until both payment parts are confirmed, so no double-charges or partial records occur."
      }
    ],
    relatedSlugs: ["pos-payment-methods-askbiz", "pos-split-payment-askbiz", "pos-hack-cash-float-formula-askbiz"],
    faq: [
      { q: "Can I split a payment three ways — cash, M-Pesa, and card?", a: "AskBiz supports splitting across any active payment methods. A three-way split is available — enter each amount and confirm each method in turn." },
      { q: "Are split payment totals shown in the cashier's session report?", a: "Yes. The end-of-session report shows a breakdown of the cashier's total by payment method, including split payment line items." }
    ]
  },

  // 7 ─── Cash Float Formula ───────────────────────────────────────────────────
  {
    slug: "pos-hack-cash-float-formula-askbiz",
    title: "The Float Formula: Never Run Out of Change Mid-Shift",
    description: "A practical formula for calculating the right opening cash float using your AskBiz sales data — so you always have the right coins and notes to make change throughout the day.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["cash float", "change management", "opening float", "cash handling", "POS cash", "AskBiz", "till management", "shift start"],
    keyTakeaways: [
      "Use your AskBiz Reports average sale value to calculate the right float denomination mix.",
      "The float formula: take your expected cash sales per hour × 0.3 to set the float amount.",
      "Record your opening float in AskBiz at shift start so end-of-day cash reconciliation is accurate.",
      "Review your float calculation monthly as your average sale value and cash/M-Pesa mix changes."
    ],
    content: [
      {
        heading: "Why getting the float wrong costs you money",
        body: "Running out of KSh 50 coins mid-morning means turning away cash customers or rounding down — both cost your business. An oversized float means cash sitting idle in the till instead of in the bank earning overnight interest. AskBiz gives you the data to calculate the correct float size scientifically, rather than guessing. The formula takes 5 minutes to run and saves hours of scrambling for change each week.",
        image: "/images/training/pos-reports.png",
      },
      {
        heading: "Step 1 — Find your average cash sale value",
        body: "Go to Operations > Reports. Filter to Last 7 days and check the 'Avg sale' metric (visible in the Overview — currently showing in the second metrics row). Then switch to Reports to see the split between cash and M-Pesa. Your average cash sale is what you'll need to make change for most often. If your average sale is KSh 274, you'll need coins and notes up to KSh 300 in the float."
      },
      {
        heading: "Step 2 — Apply the float formula",
        body: "Float formula: (expected cash sales per hour) × 30% = opening float target. If your busiest hour does KSh 5,000 in cash sales, your float should be KSh 1,500. Break this into denominations: 50% in KSh 50 coins (change for small purchases), 30% in KSh 100 notes, 20% in KSh 200 notes. Adjust the denomination mix based on your average sale value — higher average sales need more large-denomination notes."
      },
      {
        heading: "Step 3 — Log the float in AskBiz at shift start",
        body: "At pos.askbiz.co, when opening a new cashier session, the till prompts for an opening float amount. Enter the exact amount counted from the cash box. AskBiz uses this figure to calculate the expected cash balance at end of day: Opening float + Cash sales - Cash refunds = Expected closing cash. If the actual cash in the till differs from this figure, the discrepancy is flagged immediately in the cashier's session report."
      },
      {
        heading: "Hack — Use yesterday's close to set today's float",
        body: "Rather than counting the float from scratch every morning, AskBiz's closing cash figure from yesterday becomes today's opening float automatically if you leave the agreed amount in the till overnight. This eliminates the morning count for most days. Only recount if there was a discrepancy the previous day or if cash was removed for banking."
      },
      {
        heading: "Reviewing float effectiveness monthly",
        body: "Go to Operations > Reports and check how often your cashiers recorded change-giving errors or float top-up notes over the past month. If the Audit Log shows multiple 'float added mid-shift' entries, your opening float is too small. If end-of-day cash consistently runs 30%+ over the expected amount, your float is oversized and cash is idle. Adjust once per month to stay optimal as your sales volume and cash/M-Pesa mix evolves."
      }
    ],
    relatedSlugs: ["pos-hack-eod-reconciliation-askbiz", "pos-cash-float-askbiz", "pos-hack-cashier-report-filter-askbiz"],
    faq: [
      { q: "Does AskBiz track the float separately from sales revenue?", a: "Yes — the opening float is entered separately at shift start and is not counted as revenue. The end-of-day report shows sales cash, float, and closing total as separate lines." },
      { q: "Can I see how much cash each branch has at any time?", a: "The Branches view in Operations shows stock value by branch. For real-time cash positions across branches, check each cashier's active session from the Staff view." }
    ]
  },

  // 8 ─── End of Day Reconciliation ────────────────────────────────────────────
  {
    slug: "pos-hack-eod-reconciliation-askbiz",
    title: "Close the Day in 5 Minutes with This Routine",
    description: "A 5-step end-of-day closing routine for AskBiz POS — reconcile cash, confirm M-Pesa totals, check session discrepancies, and close all cashier shifts cleanly every night.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["end of day", "close till", "cash reconciliation", "cashier session", "AskBiz POS", "closing routine", "shift close", "daily close"],
    keyTakeaways: [
      "AskBiz generates a cashier session report the moment a shift is closed — no manual tallying needed.",
      "Close the till in the exact sequence: count cash → close session → compare to AskBiz expected total.",
      "Any discrepancy is highlighted automatically in red in the session report — no spreadsheet required.",
      "M-Pesa totals reconcile automatically via the Integrations connection — only cash needs manual counting."
    ],
    content: [
      {
        heading: "Why end-of-day takes longer than it should",
        body: "The typical end-of-day problem isn't counting the cash — it's reconciling it. If a cashier applies a discount that isn't in the system, or processes a return after the session report was run, the numbers don't match and the manager spends 30 minutes tracking the discrepancy. AskBiz eliminates this by keeping a live running total of every transaction in the session, which the manager can compare against physical cash in under 5 minutes.",
        image: "/images/training/pos-cashier-shifts.png",
      },
      {
        heading: "Step 1 — Have the cashier count cash before closing the session",
        body: "Before the cashier touches anything in AskBiz, count the physical cash in the till. Write the total on a slip of paper. This is important — if you close the session in AskBiz first, you risk reconciling against a figure you can't verify. The sequence matters: count first, then close."
      },
      {
        heading: "Step 2 — Close the cashier session in AskBiz",
        body: "At pos.askbiz.co, the cashier taps their profile icon and selects 'Close Session'. AskBiz generates the session report instantly showing: Total sales, Cash sales, M-Pesa sales, discounts applied, refunds, and Expected cash in till (Opening float + Cash sales - Cash refunds). This appears on screen within 2 seconds."
      },
      {
        heading: "Step 3 — Compare the AskBiz expected total to your counted cash",
        body: "Take the slip of paper with your counted cash total and compare it to the 'Expected cash' figure in AskBiz. If they match exactly, the till is clean — close and bank. If there's a discrepancy, AskBiz highlights it in the session report. Check the Audit log (Operations > Audit) sorted by today's date — any unrecorded transaction, void, or manual override will appear here and explain the gap."
      },
      {
        heading: "Step 4 — Confirm M-Pesa totals via Integrations",
        body: "M-Pesa totals don't need manual counting — AskBiz reconciles them automatically via the connected M-Pesa integration. Go to Operations > Integrations to verify the M-Pesa connection is active. The M-Pesa total in the session report matches your Safaricom till statement exactly. If there's a discrepancy, it usually means a payment was confirmed on M-Pesa but not acknowledged at the AskBiz till — check for pending transactions in the Audit log."
      },
      {
        heading: "Step 5 — Review and lock the session in Operations > Staff",
        body: "Once confirmed, go to Operations > Staff and verify the cashier's session shows as 'Closed' with the correct timestamp. If a cashier failed to close their session before leaving, a manager can close it remotely from this view. Set a rule: no one leaves the premises until their AskBiz session is closed and confirmed by a manager. This 5-minute discipline eliminates month-end reconciliation surprises."
      }
    ],
    relatedSlugs: ["pos-hack-cash-float-formula-askbiz", "pos-open-close-day-askbiz", "pos-hack-cashier-report-filter-askbiz"],
    faq: [
      { q: "Can I reopen a session that was closed too early?", a: "Session reopening requires manager access. Contact AskBiz support if you need to amend a closed session — an audit trail entry is created for any change." },
      { q: "How long are session records kept?", a: "AskBiz retains all session records permanently. You can search the Audit log or export Reports for any historical date." }
    ]
  },

  // 9 ─── Reorder Alerts ───────────────────────────────────────────────────────
  {
    slug: "pos-hack-reorder-alerts-askbiz",
    title: "Set Reorder Thresholds So You Never Stock Out",
    description: "How to use AskBiz POS low stock alerts and the inventory filter to spot which products need reordering before a customer asks for something you don't have.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["reorder alert", "low stock", "stock threshold", "inventory management", "AskBiz POS", "restock", "out of stock prevention", "stock notification"],
    keyTakeaways: [
      "The 'Low stock' tab in Operations > Inventory shows every product below its reorder threshold in one click.",
      "AskBiz automatically flags products as LOW when stock drops below the threshold you set per product.",
      "Check the Low Stock tab every morning as part of your daily brief — it takes under 30 seconds.",
      "The Overview tab shows the total low-stock count so you know at a glance if action is needed."
    ],
    content: [
      {
        heading: "The most expensive mistake in retail: running out of stock",
        body: "A customer who asks for something you don't have doesn't just lose you one sale — they often don't come back. Yet most stock-outs are entirely predictable: if you can see a product's current quantity, you know it will hit zero before the next delivery arrives. AskBiz's Low Stock filter makes this visible in one click. The businesses that use this feature daily virtually eliminate avoidable stock-outs.",
        image: "/images/training/pos-hack-reorder.png",
      },
      {
        heading: "Step 1 — Set a reorder threshold for every fast-moving product",
        body: "Go to Operations > Inventory. Click 'Edit' next to any product. In the product settings, set a 'Reorder level' — the quantity at which AskBiz marks the product as LOW. For a product that sells 10 units per day and takes 2 days to restock, set the reorder level to 25 (10 × 2 days + 5 buffer). AskBiz immediately flags the product as LOW in the inventory list the moment stock drops to or below this number."
      },
      {
        heading: "Step 2 — Open the Low Stock tab every morning",
        body: "Go to Operations > Inventory and click the 'Low stock' filter tab. Every product currently at or below its reorder threshold appears here with the LOW badge. This view shows product name, branch, current quantity, price, and cost. With this filter active, you have a ready-made restock order: these are the products to call your supplier about today. The list updates in real time as sales happen, so a product that crosses the threshold during the day appears automatically."
      },
      {
        heading: "Step 3 — Use the Overview Low Stock count as your morning indicator",
        body: "The POS Overview tab (the first screen you see) shows a 'Low stock' number in the top metrics row — currently showing 46 products at this business. If that number is non-zero when you arrive in the morning, open the Low Stock tab in Inventory before doing anything else. If it's zero, your stock is healthy and no restocking action is needed today. This two-second check replaces a morning walkthrough of the entire shop floor."
      },
      {
        heading: "Step 4 — Build your restock order from the Low Stock list",
        body: "With the Low Stock filter open, note the products, their current quantities, and your typical order amounts. Contact your supplier with this list — either by phone, WhatsApp, or email. Specify the quantity needed to return each item to its safe stock level (reorder level + 2–3 weeks of expected sales). Once stock arrives, update quantities via Inventory > Edit or by scanning the delivery with 'Scan to add'. The LOW badge disappears automatically."
      },
      {
        heading: "Advanced — Use 'Out of stock' tab for emergencies",
        body: "The 'Out of stock' tab in Inventory shows products that have already hit zero. These are products a customer cannot buy today. If you see items here when you arrive, they need same-day emergency restocking or removal from display. Consider using the product's AskBiz page to add a note to the name (e.g. 'Basmati Rice — AWAITING STOCK') so cashiers don't attempt to sell it at the till. Remove the note once restocked."
      }
    ],
    relatedSlugs: ["pos-hack-audit-log-shrinkage-askbiz", "pos-hack-supplier-po-fast-askbiz", "pos-manual-stock-adjust-askbiz"],
    faq: [
      { q: "Can AskBiz send me an automatic notification when stock gets low?", a: "AskBiz highlights low stock in the Overview and Inventory filter. For push notifications, check the notification settings in your account profile — email alerts for low stock events may be available in your plan." },
      { q: "Can I set different reorder levels for different branches?", a: "Reorder levels are currently set per product across branches. Use the Branch filter in Inventory to check stock levels per location and adjust your restock quantities accordingly." }
    ]
  },

  // 10 ─── Audit Log Shrinkage ─────────────────────────────────────────────────
  {
    slug: "pos-hack-audit-log-shrinkage-askbiz",
    title: "Catch Shrinkage in Seconds Using the Audit Log",
    description: "How to use the AskBiz POS Audit Log to detect stock discrepancies, unauthorised voids, and inventory adjustments that could indicate shrinkage or cashier errors.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["shrinkage", "audit log", "stock discrepancy", "void detection", "AskBiz POS", "inventory audit", "cashier errors", "loss prevention"],
    keyTakeaways: [
      "The Audit Log under Operations > Audit records every stock change, void, and price edit with a timestamp and user.",
      "Filter the Audit Log by 'Inventory' event type to see all manual stock adjustments made today.",
      "Unexplained stock reductions on high-value products are a key shrinkage signal — check these weekly.",
      "Pair Audit Log reviews with cashier session reports to correlate voids with physical cash counts."
    ],
    content: [
      {
        heading: "What is shrinkage and how does AskBiz help detect it?",
        body: "Shrinkage is the gap between the stock you think you have (according to your records) and the stock physically on your shelf. It comes from theft, supplier shortfalls, cashier errors, and spoilage. AskBiz reduces shrinkage not by preventing it in real time, but by making it instantly visible — every stock movement is timestamped, attributed to a user, and logged permanently in the Audit trail. A weekly 5-minute audit catches patterns before they become major losses.",
        image: "/images/training/pos-manual-stock-adjust.png",
      },
      {
        heading: "Step 1 — Open Operations > Audit and filter by Inventory",
        body: "Go to Operations > Audit. By default, the Audit Log shows all events — sales, refunds, stock changes, user logins. Click the event type filter and select 'Inventory'. This narrows the view to only stock adjustments: manual edits, additions, and reductions. Every entry shows the product name, old quantity, new quantity, the amount of change, who made it (which user account), and the exact timestamp."
      },
      {
        heading: "Step 2 — Look for unexplained negative adjustments",
        body: "Legitimate inventory changes fall into two categories: sales (automatic, linked to a transaction ID) and manual adjustments (stock received, damaged goods written off, count corrections). A manual adjustment that reduces stock on a high-value product — like Basmati Rice or cooking oil — without a corresponding delivery note or damage report is a shrinkage signal. Cross-reference it: was there a supplier delivery that day? Did the cashier on that shift report anything?"
      },
      {
        heading: "Step 3 — Check for void patterns",
        body: "Switch the Audit filter to 'Returns' or look for void entries. A single cashier with an unusually high number of voids in their session — compared to other cashiers — warrants investigation. One or two voids per session is normal. Five or more is unusual. Pair the void timestamps with the physical cash count from that session: if the cash is short by approximately the value of the voided transactions, that's a strong indicator of a cash-handling problem."
      },
      {
        heading: "Step 4 — Compare stock counts weekly using Inventory export",
        body: "Once per week, export your Inventory to CSV (Operations > Inventory > CSV export button). Compare this week's stock quantities to last week's. For each product, the formula is: Last week's stock + Deliveries received - Units sold (from Reports) = Expected stock. If actual stock is consistently lower than expected for the same product, focus your Audit Log investigation on that product specifically — filter by product name in the Audit search bar."
      },
      {
        heading: "Building a shrinkage-resistant operation",
        body: "The best shrinkage prevention is making the Audit Log visible to the team. Post a notice near the stock room: 'All inventory adjustments are logged with your name and timestamp.' This alone deters opportunistic adjustments. Pair it with a weekly 5-minute audit review — take 5 minutes every Monday morning to scan the Audit Log for the previous week's inventory events. This discipline typically reduces unexplained shrinkage by 40–60% within the first month."
      }
    ],
    relatedSlugs: ["pos-hack-reorder-alerts-askbiz", "pos-manual-stock-adjust-askbiz", "pos-hack-cashier-report-filter-askbiz"],
    faq: [
      { q: "Can I export the Audit Log to share with a loss prevention consultant?", a: "Yes — the Audit Log data is accessible via Operations > Reports and can be exported. Contact AskBiz support for a full audit export in CSV format for any date range." },
      { q: "How far back does the Audit Log go?", a: "AskBiz retains audit data permanently. You can search the log for any historical date using the date range filter at the top of the Audit page." }
    ]
  },

  // 11 ─── Supplier PO Fast ────────────────────────────────────────────────────
  {
    slug: "pos-hack-supplier-po-fast-askbiz",
    title: "Create a Supplier Restock Order in 3 Steps",
    description: "How to use the AskBiz POS Low Stock list to build a supplier restock order in minutes — and what's coming in the Purchase Orders feature for one-tap supplier emails.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["purchase order", "supplier order", "restock", "supplier email", "AskBiz POS", "inventory reorder", "supply chain", "stock replenishment"],
    keyTakeaways: [
      "The Low Stock filter in Inventory is your instant restock list — export it as a CSV to send to suppliers today.",
      "AskBiz Purchase Orders (coming soon) will allow you to create, send, and track supplier orders from within the POS.",
      "Building a restock order from AskBiz data takes 3 minutes and eliminates manual stock counting.",
      "Set consistent supplier contact details in a shared note or your phone contacts to speed up the ordering process."
    ],
    content: [
      {
        heading: "From low stock alert to supplier order in 3 minutes",
        body: "Most small businesses create restock orders by walking the shop floor with a clipboard. AskBiz eliminates the clipboard walk — your Low Stock list is already compiled in real time. The Purchase Orders section (Operations > Purchase Orders) is coming soon to AskBiz, and will enable direct supplier emails and back-order tracking. Until then, the Low Stock export workflow described here gives you the same result in 3 steps.",
        image: "/images/training/pos-hack-suppliers.png",
      },
      {
        heading: "Step 1 — Export the Low Stock list",
        body: "Go to Operations > Inventory and click the 'Low stock' filter tab. You'll see every product below its reorder threshold with current quantities and costs. Click 'CSV import/export' (or the download icon) to export this list. The CSV contains product name, SKU, current stock, cost price, and branch. This is your restock order draft — open it in any spreadsheet app and add a column for 'Order quantity' based on your typical delivery size."
      },
      {
        heading: "Step 2 — Group products by supplier",
        body: "In the exported CSV, sort or group by supplier (if you've added supplier names to your product descriptions in Inventory). Most businesses deal with 3–5 primary suppliers. Create a separate order for each: Supplier A gets one list, Supplier B gets another. This takes 2 minutes with a spreadsheet filter. Copy each supplier's list into a WhatsApp message or email. Being specific — product name, SKU, and quantity — reduces supplier confusion and speeds delivery confirmation."
      },
      {
        heading: "Step 3 — Update stock when deliveries arrive",
        body: "When a delivery arrives, go to Operations > Inventory > Scan to add. Scan each delivered item's barcode — AskBiz increases the stock count automatically. For deliveries without barcodes, click 'Edit' on the product and update the stock quantity manually. The Audit Log records the adjustment with your name, the timestamp, and the quantity change. This closes the loop: Low Stock → Order placed → Delivery received → Stock updated → LOW badge removed."
      },
      {
        heading: "What Purchase Orders will add (coming soon)",
        body: "The Purchase Orders section visible at Operations > Purchase Orders shows the upcoming workflow: Create POs (build orders from low-stock items automatically), Send to supplier (email or WhatsApp POs directly from AskBiz), Receive stock (scan deliveries to confirm and update inventory), Back-orders (track partial deliveries), Auto-reorder (AI suggests restock timing based on your sales velocity), and Supplier insights (lead times and cost trends). When this feature launches, the 3-step manual process above becomes one-tap."
      },
      {
        heading: "Hack — Keep a supplier WhatsApp group for fast ordering",
        body: "Create a WhatsApp group with each of your main suppliers. When you export the Low Stock list, paste the relevant products directly into the appropriate group with a standard format: 'RESTOCK REQUEST — [Date] — [Product] [Qty]'. This creates a timestamped, searchable order history in WhatsApp that you can cross-reference against AskBiz deliveries. It takes 90 seconds per supplier and requires no special software."
      }
    ],
    relatedSlugs: ["pos-hack-reorder-alerts-askbiz", "pos-hack-audit-log-shrinkage-askbiz", "pos-manual-stock-adjust-askbiz"],
    faq: [
      { q: "When will Purchase Orders be available in AskBiz?", a: "Purchase Orders is listed as 'Coming soon' in Operations. Check the AskBiz release notes or contact support for the expected launch date." },
      { q: "Can I track which deliveries I'm waiting for?", a: "Until Purchase Orders launches, use a shared note or spreadsheet to track outstanding orders. The Audit Log shows the date each product's stock was last updated, so you can confirm a delivery was entered correctly." }
    ]
  },

  // 12 ─── Loyalty Fast Lookup ─────────────────────────────────────────────────
  {
    slug: "pos-hack-loyalty-fast-lookup-askbiz",
    title: "Add a Loyalty Customer to a Sale with One Scan",
    description: "How to attach a loyalty customer to an AskBiz POS sale in under 5 seconds using phone number lookup or loyalty card scan — so no points are ever missed.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["loyalty", "customer points", "fast lookup", "loyalty card", "phone number", "AskBiz POS", "customer scan", "rewards"],
    keyTakeaways: [
      "Loyalty customers can be attached to a sale by phone number search or loyalty card scan — both take under 5 seconds.",
      "Train cashiers to ask 'Do you have a loyalty card?' at the start of every sale, not at the end.",
      "Points are only awarded if the customer is attached before the sale is finalised — not retroactively.",
      "Check Operations > Loyalty to see total points issued, redeemed, and your best-earning customers."
    ],
    content: [
      {
        heading: "Why fast loyalty lookup matters",
        body: "A loyalty programme only works if points are recorded consistently. If attaching a loyalty customer takes 15–20 seconds, cashiers skip it when the queue builds. AskBiz makes loyalty lookup a 3-second action — phone number or card scan at the start of the transaction — so it becomes automatic behaviour rather than an afterthought.",
        image: "/images/training/pos-loyalty.png",
      },
      {
        heading: "Method 1 — Phone number lookup (fastest for walk-in customers)",
        body: "At the start of a sale at pos.askbiz.co, tap the customer icon or 'Add customer' field before adding any products. Type the customer's phone number — AskBiz searches the Customers database and shows the matching loyalty account in under a second. Tap the name to attach. The customer's points balance and tier appear at the top of the sale screen. This method works even if the customer forgot their loyalty card."
      },
      {
        heading: "Method 2 — Loyalty card scan (fastest for regular customers)",
        body: "If your loyalty programme uses physical cards with barcodes or QR codes, scan the card at the till at the start of the sale — the same way you'd scan a product. AskBiz reads the loyalty card barcode and attaches the customer account automatically. This is the fastest method for regular customers who always carry their card. Set up loyalty card barcodes in Operations > Loyalty > Card management."
      },
      {
        heading: "The golden rule — ask at the start, not the end",
        body: "Train cashiers with one rule: 'Do you have a loyalty card?' is the first thing said at the till, not the last. If the question is asked after payment is processed, points can't be awarded retroactively in most cases. Building the loyalty check into the greeting — 'Hi, do you have a loyalty card with us?' — means it happens before any scanning begins. This simple script change increases loyalty capture rates from 40% to 80–90% within a week."
      },
      {
        heading: "Checking and redeeming loyalty points",
        body: "When a loyalty customer is attached to a sale, their points balance shows on screen. If they have enough points to redeem, a 'Redeem points' option appears at the payment screen. The customer can redeem points as a discount on the current sale. The transaction records both the points earned from today's purchase and any points redeemed. Go to Operations > Loyalty to see total points in circulation and your highest-value loyalty customers."
      },
      {
        heading: "Monitoring your loyalty programme performance",
        body: "Go to Operations > Loyalty to see the programme overview — points issued, points redeemed, redemption rate, and customer tier breakdown. A healthy loyalty programme has a redemption rate of 30–50% — if it's lower, customers aren't finding the points valuable. If it's higher, check that your points-to-reward ratio is financially sustainable. Review these metrics monthly alongside your Promotions report to understand the total cost of customer incentives."
      }
    ],
    relatedSlugs: ["pos-hack-customer-credit-refund-askbiz", "pos-customer-credit-askbiz", "pos-hack-product-search-shortcuts-askbiz"],
    faq: [
      { q: "Can a customer earn loyalty points on a discounted purchase?", a: "This depends on your programme configuration. Go to Operations > Loyalty > Settings to configure whether points are earned on the full price, discounted price, or only non-promotional purchases." },
      { q: "Can customers check their points balance without visiting the store?", a: "AskBiz can send loyalty statements by SMS or email depending on your plan. Check Operations > Loyalty for customer communication options." }
    ]
  },

  // 13 ─── Customer Credit Refund ──────────────────────────────────────────────
  {
    slug: "pos-hack-customer-credit-refund-askbiz",
    title: "Issue a Refund as Store Credit Instead of Cash",
    description: "How to process a refund as AskBiz store credit — keeping revenue in the business, giving the customer a hassle-free resolution, and tracking credit balances automatically.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["store credit", "refund credit", "customer credit", "cash refund alternative", "AskBiz POS", "returns", "credit account", "customer management"],
    keyTakeaways: [
      "Store credit keeps the refund value inside your business rather than paying cash out the till.",
      "Credit is attached to the customer's profile and automatically deducted at their next purchase.",
      "Customers prefer store credit over waiting for a cash refund — offer it as the default option.",
      "All credit balances are visible in Operations > Customers so you can track outstanding store credit."
    ],
    content: [
      {
        heading: "Why store credit is better than cash refunds for both parties",
        body: "When a customer returns an item, the default instinct is to hand back cash. But store credit is better for everyone: the customer gets instant resolution without waiting for a card refund or bank transfer, and your business retains the revenue. The customer's credit is linked to their AskBiz account and deducts automatically at their next purchase — there's nothing for them to remember. For businesses with tight cash flows, store credit also smooths out the daily cash position.",
        image: "/images/training/pos-customer-credit.png",
      },
      {
        heading: "Step 1 — Process the return at pos.askbiz.co",
        body: "When a customer returns a product at the till, open a new sale and tap 'Return' or 'Refund'. Search for the original sale by transaction ID, date, or customer name. Select the items being returned. AskBiz shows the refund amount and asks for the refund method: Cash, M-Pesa reversal, or Store Credit. Select 'Store Credit'."
      },
      {
        heading: "Step 2 — Attach the credit to the customer's account",
        body: "If the customer is already in your AskBiz database (they have a loyalty account or have purchased before), the store credit attaches to their profile automatically. If they're a new customer, create a profile: tap 'New customer', enter their name and phone number. The credit is stored against this profile. Next time they visit, attaching their profile at checkout will show their available credit balance — the cashier simply applies it as a payment method."
      },
      {
        heading: "Step 3 — Redeeming credit at the next purchase",
        body: "When the customer returns to buy something, attach their profile at the start of the sale. At the payment screen, their store credit balance is shown as an available payment method. The cashier taps 'Use store credit' and the amount is deducted from the credit balance. If the purchase is larger than the credit balance, the remainder is paid by cash or M-Pesa. If the credit covers the full purchase, the sale completes without any cash changing hands."
      },
      {
        heading: "Monitoring outstanding store credit balances",
        body: "Go to Operations > Customers. Each customer profile shows their current store credit balance. Filter by 'Has credit' to see all customers with outstanding credit. This helps you understand your total store credit liability — the sum of all outstanding credits is an amount your business owes customers in future goods. Review this monthly: if total credit is growing, check whether customers are returning more than usual or whether some credits have never been redeemed."
      },
      {
        heading: "Setting a credit expiry policy",
        body: "Store credit that sits unused indefinitely becomes a liability on your books. Consider setting a credit expiry — for example, store credit must be used within 6 months. Inform customers of this policy at the point of issuing credit. AskBiz allows you to set credit validity periods in the Customer settings. Expired credit can be reviewed in Operations > Customers and cleared with a manual adjustment (logged in the Audit trail)."
      }
    ],
    relatedSlugs: ["pos-hack-loyalty-fast-lookup-askbiz", "pos-customer-credit-askbiz", "pos-void-cancel-askbiz"],
    faq: [
      { q: "Can store credit be used at a different branch?", a: "Yes — customer profiles and credit balances are shared across all branches in AskBiz. A customer who receives credit at the town branch can redeem it at the Bondeni branch." },
      { q: "Is store credit taxable?", a: "Tax treatment of store credit varies by jurisdiction. Consult your accountant — in most cases, tax is applied at the point of the original sale, not when credit is issued or redeemed." }
    ]
  },

  // 14 ─── Branch Best Performer ───────────────────────────────────────────────
  {
    slug: "pos-hack-branch-best-performer-askbiz",
    title: "Spot Your Best Branch in 10 Seconds on the Map",
    description: "How to use the AskBiz POS Map and Branches views to instantly identify your top-performing location, compare revenue between branches, and make resourcing decisions faster.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["branch comparison", "best branch", "map view", "multi-branch", "AskBiz POS", "performance comparison", "branch analytics", "location intelligence"],
    keyTakeaways: [
      "The Map tab shows geo-tagged sales bubbles — larger bubbles mean more sales at that location.",
      "Switch the Overview Branch filter to compare any two branches side-by-side using the same date range.",
      "The Branches tab in Operations shows stock levels, revenue, and cashier activity per location.",
      "Use branch comparison data to decide where to open a second shift or add a temporary cashier."
    ],
    content: [
      {
        heading: "10-second branch performance check with the Map",
        body: "If you run more than one branch, the Map tab at AskBiz POS gives you the fastest visual answer to 'where are most of my sales coming from today?' Go to POS > Map. Each sales location appears as a geo-tagged bubble — the size of the bubble represents the volume of transactions from that location. With 23 geo-tagged sales visible, you can see in seconds which locations are active and which are quiet. No spreadsheet required.",
        image: "/images/training/pos-branch-comparison.png",
      },
      {
        heading: "Drill deeper with the Overview Branch filter",
        body: "For numbers rather than geography, go to POS > Overview and use the 'Branch' dropdown at the top of the page. Select 'Town' — you'll see revenue, sales count, and margin for that branch today. Then switch to 'Bondeni' and compare. This two-tab comparison takes 10 seconds and gives you all the data you need to decide where to send an additional cashier during a busy period."
      },
      {
        heading: "Using Branches in Operations for stock-level comparison",
        body: "Go to Operations > Branches. This view shows each branch with its stock value, product count, and recent sales activity. If one branch has 40 products low in stock while another has only 5, you can redistribute stock from the overstocked branch rather than placing a new supplier order. AskBiz tracks stock per branch in real time, so this decision can be made in minutes with accurate data."
      },
      {
        heading: "Hack — Set the Branch filter on Overview and leave it",
        body: "If you spend most of your day focused on one branch, set the Branch filter on Overview to that branch and leave it. The metrics update live for that location only. Use a second browser tab set to 'All Branches' for the overall picture. This dual-view setup means you can monitor your flagship branch closely while keeping the group total visible in a second tab — no switching, no confusion."
      },
      {
        heading: "Making resourcing decisions from branch data",
        body: "Check the 'Sales by hour' chart on Overview for each branch. If Town branch peaks between 11 am and 1 pm while Bondeni peaks between 4 pm and 6 pm, you can stagger cashier shifts to cover both peaks efficiently rather than having both branches fully staffed simultaneously. This scheduling insight — derived from one chart in AskBiz — can reduce your total cashier hours by 10–15% while maintaining service quality at each branch's busy period."
      }
    ],
    relatedSlugs: ["pos-branch-comparison-askbiz", "pos-multiple-tills-askbiz", "pos-hack-multi-branch-stock-sync-askbiz"],
    faq: [
      { q: "How many branches can AskBiz manage simultaneously?", a: "AskBiz supports multiple branches on the appropriate plan. All branches share the same product catalogue, customer database, and Audit Log." },
      { q: "Can I restrict which branches a cashier can log in to?", a: "Yes — cashier permissions in Operations > Staff allow you to restrict login to specific branches. A cashier at the Bondeni branch cannot access the Town branch till unless explicitly permitted." }
    ]
  },

  // 15 ─── Cashier Report Filter ────────────────────────────────────────────────
  {
    slug: "pos-hack-cashier-report-filter-askbiz",
    title: "Filter Reports by Cashier to Find Training Gaps",
    description: "How to use AskBiz POS staff performance reporting to identify which cashiers need support — faster checkout times, lower error rates, and fewer voids start with the right data.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["cashier performance", "staff report", "training gaps", "void rate", "AskBiz POS", "cashier filter", "employee analytics", "checkout errors"],
    keyTakeaways: [
      "The Overview > Staff Performance section shows each cashier's sales count and revenue for any date range.",
      "A high void rate relative to sales count is the clearest indicator of a cashier who needs checkout training.",
      "Compare cashiers' average sale values — a consistently lower average may indicate upselling skills gaps.",
      "Review staff performance weekly, not monthly — issues caught in week 1 are easier to correct than habits formed over 4 weeks."
    ],
    content: [
      {
        heading: "Why cashier-level data changes how you train",
        body: "Without cashier-level data, performance conversations are based on impressions — 'I think Lee is doing well' or 'James seems slow.' AskBiz makes these conversations objective: 'Lee processed 47 sales today with 2 voids and a KSh 320 average sale. James processed 31 sales with 7 voids and a KSh 210 average sale.' Those numbers tell you exactly what each cashier needs coaching on — and which one is already performing at a high level.",
        image: "/images/training/pos-reports.png",
      },
      {
        heading: "Step 1 — Open Staff Performance in the Overview",
        body: "Go to POS > Overview and scroll down to the 'Staff Performance' section. This shows each cashier's totals for the selected date range: sales count, total revenue, and average sale value. Use the date filter to select 'Last 7 days' for a meaningful sample. Sort by 'Sales count' descending to see your most active cashier at the top."
      },
      {
        heading: "Step 2 — Check void rates in Operations > Staff",
        body: "Go to Operations > Staff. Click on a cashier's name to see their session history. Each session shows voids processed. Compare void counts relative to total sales: a cashier with 1 void per 50 sales is performing well. A cashier with 5 voids per 30 sales has a pattern to investigate — are they accidentally completing sales, misunderstanding prices, or voiding to correct honest mistakes? The Audit Log shows the details of each void with the exact product and price."
      },
      {
        heading: "Step 3 — Compare average sale values between cashiers",
        body: "A significant difference in average sale value between two cashiers at the same till suggests different cashier behaviours. A lower average sale may mean one cashier isn't offering add-ons or loyalty upsells. It may also mean they're serving a different customer mix (morning vs afternoon shift). Use the date filter to compare same-shift performance across different days to control for customer mix before drawing conclusions."
      },
      {
        heading: "Step 4 — Have a data-driven coaching conversation",
        body: "When you sit down with a cashier to review their performance, show them their AskBiz stats directly on screen. 'Here's your void rate this week compared to last week.' 'Here's your average sale vs the team average.' This removes emotion from the conversation — the numbers are neutral and the cashier can see them too. Most cashiers respond positively to objective data and improve quickly once they understand exactly what's being measured."
      },
      {
        heading: "Building a weekly review habit",
        body: "Set a 15-minute weekly slot — Monday morning works well — to review staff performance data for the previous week. Flag any cashier who had more than 3 voids per 30 sales or whose average sale dropped more than 15% from the previous week. A 5-minute conversation in week 1 prevents a performance problem from becoming a habit. Staff who know their metrics are reviewed weekly consistently outperform those who aren't measured."
      }
    ],
    relatedSlugs: ["pos-hack-eod-reconciliation-askbiz", "pos-cashier-shifts-askbiz", "pos-hack-audit-log-shrinkage-askbiz"],
    faq: [
      { q: "Can cashiers see their own performance data?", a: "Cashier-level data is visible to manager accounts. You can choose to share individual stats with each cashier as part of a coaching conversation — AskBiz doesn't restrict this." },
      { q: "Does AskBiz track checkout time per transaction?", a: "AskBiz records transaction timestamps, which allows you to calculate average transaction duration. Divide session hours by transaction count for an average — detailed per-transaction timing may be in future analytics features." }
    ]
  },

  // 16 ─── Health Score Shortcut ───────────────────────────────────────────────
  {
    slug: "pos-hack-health-score-shortcut-askbiz",
    title: "Use the Health Score to Run a 2-Minute Weekly Review",
    description: "How to interpret the AskBiz POS Health Score as a single business performance indicator and use it to run a structured 2-minute weekly review without pulling multiple reports.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["health score", "weekly review", "business performance", "AskBiz overview", "KPI shortcut", "business health", "performance metric", "quick review"],
    keyTakeaways: [
      "The AskBiz Health Score aggregates revenue, margin, stock health, and customer trends into one number.",
      "Compare your Health Score week-over-week — a declining score is an early warning before it shows in revenue.",
      "Use the Ask tab to get a plain-English explanation of what's driving your current Health Score.",
      "A 2-minute weekly review of the Health Score and its top 3 components is enough to stay ahead of problems."
    ],
    content: [
      {
        heading: "What the Health Score actually measures",
        body: "The AskBiz Health Score is a composite indicator that weighs revenue trend, gross margin, stock health (low stock as a percentage of total products), and refund rate. A score above 80 indicates strong performance across all dimensions. A score between 60–80 means one or two areas need attention. Below 60 is an early warning — something material is wrong. The score gives you a one-number answer to 'How is my business doing?' without reading five separate reports.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "Step 1 — Find the Health Score on Overview",
        body: "The Health Score appears at the top of the POS Overview page. Switch the date filter to 'Last 30 days' to see your current monthly score. Note the score and the directional indicator — is it up or down from the previous period? A score going from 75 to 68 in one week is worth investigating even if revenue is up, because it means another dimension (margin, stock, or refunds) has deteriorated."
      },
      {
        heading: "Step 2 — Use the Ask tab for a plain-English breakdown",
        body: "Navigate to the Ask tab (left sidebar). Type: 'Break down my health score — what's driving it down this week?' AskBiz will respond with a plain-English analysis identifying the specific factors affecting the score. This replaces 10 minutes of report-reading with a 10-second question. The AI analysis references your actual data — revenue, margin percentages, specific products — not generic advice."
      },
      {
        heading: "Step 3 — Run the 2-minute weekly review",
        body: "Every Monday, open Overview, select 'Last 7 days', and check: (1) Health Score vs last week — up or down? (2) Revenue vs prior week — same day comparison. (3) Low Stock count — any new items need ordering? (4) Refunds — any unusual spike? If all four look stable or improving, your business is healthy. If any one is significantly off, spend 5 additional minutes investigating that specific area. This structured 2-minute check replaces an unstructured 30-minute weekly review."
      },
      {
        heading: "Health Score as a team communication tool",
        body: "Share the Health Score with your team by projecting it on a shared screen in the back office. A team that sees a 68 score and knows a 75+ is achievable will naturally focus on the right behaviours — fewer voids, better loyalty capture, accurate stock counts. Display it alongside a simple target: 'Our goal this month: Health Score 78+'. This turns a management metric into a team goal without needing to explain the underlying calculations."
      },
      {
        heading: "What to do when the Health Score drops sharply",
        body: "A Health Score drop of 10+ points in a single week almost always has a single cause. Check in this order: (1) Revenue — did a top product go out of stock? (2) Margin — was a major discount applied? (3) Refund rate — was there a batch of returns? (4) Stock health — did multiple items go low simultaneously? The Ask tab can pinpoint the cause in seconds. Address the root cause and the score will recover within the next weekly cycle."
      }
    ],
    relatedSlugs: ["pos-hack-daily-brief-routine-askbiz", "pos-hack-metrics-pinning-askbiz", "pos-health-score-deep-askbiz"],
    faq: [
      { q: "How often does the Health Score update?", a: "The Health Score updates in real time as transactions are processed. The 30-day view shows a rolling score that changes slightly each day as the oldest day drops off and the newest is added." },
      { q: "Is there a way to benchmark my Health Score against similar businesses?", a: "AskBiz doesn't currently publish industry benchmarks publicly. Contact support to discuss sector-specific performance expectations for your business type." }
    ]
  },

  // 17 ─── Multi-Branch Stock Sync ─────────────────────────────────────────────
  {
    slug: "pos-hack-multi-branch-stock-sync-askbiz",
    title: "Keep Two Branches in Sync Without Spreadsheets",
    description: "How AskBiz POS automatically synchronises stock levels, sales data, and customer records across multiple branches in real time — eliminating manual stock transfer sheets.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["multi-branch", "stock sync", "branch inventory", "real-time sync", "AskBiz POS", "stock transfer", "multi-location", "branch management"],
    keyTakeaways: [
      "AskBiz syncs stock levels across all branches in real time — no manual reconciliation between locations needed.",
      "Use the Branch filter in Operations > Inventory to see stock levels at a specific location only.",
      "Inter-branch stock transfers are recorded as Inventory adjustments in the Audit Log with full traceability.",
      "Customer credit and loyalty points are shared across branches automatically — customers can redeem anywhere."
    ],
    content: [
      {
        heading: "The multi-branch problem AskBiz solves automatically",
        body: "Running two or more branches without a connected system means staff are sharing WhatsApp photos of stock counts, manually updating spreadsheets, and guessing which branch has excess stock. AskBiz maintains a single real-time database for all branches — when a sale happens at the Bondeni branch, the inventory at Bondeni decreases immediately and is visible from the Town branch manager's screen within seconds. No phone call required.",
        image: "/images/training/pos-multiple-tills.png",
      },
      {
        heading: "Viewing stock by branch in real time",
        body: "Go to Operations > Inventory. By default, the view shows combined stock across all branches. To see stock at a specific branch, use the 'Branch' dropdown at the top of the page — select 'Town' or 'Bondeni'. The product list updates to show only that branch's quantities. This is how you answer 'Do we have Basmati Rice at Bondeni?' in 5 seconds without calling the branch manager."
      },
      {
        heading: "Recording an inter-branch stock transfer",
        body: "When you physically move stock from one branch to another, record it in AskBiz to keep the numbers accurate. At the sending branch: go to Inventory > Edit the product > reduce the quantity by the transfer amount. At the receiving branch: go to Inventory > Edit the product > increase the quantity by the same amount. Both changes appear in the Audit Log with branch, user, timestamp, and quantity — creating a paper trail for every transfer."
      },
      {
        heading: "Hack — Use Branches comparison to spot rebalancing opportunities",
        body: "Go to Operations > Branches. This view shows stock value and product counts per location. If Town has KSh 45,000 in stock and Bondeni has KSh 8,000, and both branches sell similar products at similar volumes, Town has excess stock that could be transferred to Bondeni rather than placing a new supplier order. This stock rebalancing reduces total inventory investment and prevents one branch from running out while another overstocks."
      },
      {
        heading: "Customer and loyalty sync across branches",
        body: "Every customer profile, credit balance, and loyalty points total is shared across all branches. A customer who earns loyalty points at Town can redeem them at Bondeni. A customer credit issued at one branch applies at any other branch. This seamless experience — invisible to the customer — is handled automatically by AskBiz. There is no action required from your team; it works from the moment multiple branches are connected to the same AskBiz account."
      },
      {
        heading: "Reporting across all branches simultaneously",
        body: "To see combined performance across all branches, go to Overview and set Branch to 'All Branches'. The revenue, margin, and sales figures aggregate all locations. To compare branches, open Overview in two browser tabs — set one to Town and one to Bondeni — and view them side by side. This dual-tab comparison is the fastest way to answer 'Which branch had a better day?' without exporting any data."
      }
    ],
    relatedSlugs: ["pos-hack-branch-best-performer-askbiz", "pos-multiple-tills-askbiz", "pos-branch-comparison-askbiz"],
    faq: [
      { q: "Does AskBiz sync in real time or on a schedule?", a: "AskBiz syncs in real time over an internet connection. Sales, stock changes, and customer updates appear across all branches within seconds." },
      { q: "What happens to stock sync if one branch loses internet?", a: "AskBiz offline mode allows sales to continue without internet. Transactions sync automatically when connectivity is restored — stock levels update at that point." }
    ]
  },

  // 18 ─── Void Speed ──────────────────────────────────────────────────────────
  {
    slug: "pos-hack-void-speed-askbiz",
    title: "Void or Edit a Sale Before It Closes — The Fast Way",
    description: "How to quickly void a line item or cancel a sale in progress at the AskBiz till — before finalising payment — without disrupting the queue or requiring manager authorisation.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["void sale", "cancel item", "remove line item", "till correction", "AskBiz POS", "cashier error", "sale correction", "pre-payment void"],
    keyTakeaways: [
      "A line item can be removed from an open sale instantly by long-pressing or swiping it at pos.askbiz.co.",
      "A full sale cancellation before payment requires no manager approval — it disappears from the queue.",
      "Post-payment voids require manager authorisation and are logged in the Audit trail automatically.",
      "Train cashiers to correct errors before payment confirmation — it's faster and creates no audit complexity."
    ],
    content: [
      {
        heading: "Two types of void — before and after payment",
        body: "There are two completely different scenarios when correcting a sale at AskBiz POS. Before payment is confirmed, removing an item or cancelling the sale is instant and leaves no record — it's simply an edit to an incomplete transaction. After payment, a void creates a return record, updates stock, and is logged in the Audit trail with the cashier's name. Train cashiers to catch errors in the basket before hitting pay — it's faster and simpler for everyone.",
        image: "/images/training/pos-void-cancel.png",
      },
      {
        heading: "How to remove a line item from an open sale",
        body: "At pos.askbiz.co, with the sale basket open, find the product to remove. Tap and hold the line item (or swipe left, depending on your device) — a 'Remove' button appears. Tap it and the item is removed from the basket instantly. The quantity returns to stock automatically. If the cashier scanned the same item twice by mistake, they can also change the quantity — tap the quantity number, type the correct amount. Either method takes under 3 seconds."
      },
      {
        heading: "How to cancel a full sale before payment",
        body: "To cancel the entire sale before payment, tap the 'Cancel' or 'Clear basket' button at the till. AskBiz removes all items from the basket and returns to the empty sale screen. All scanned items return to stock automatically. No record of the cancelled sale is created in Reports (incomplete sales are not revenue events). This is appropriate when a customer changes their mind before paying."
      },
      {
        heading: "How to void a completed sale (post-payment)",
        body: "If a sale has already been paid for and a refund is needed, go to Operations > Returns. Search for the transaction by date, cashier, or customer. Select the items to refund and choose the refund method (cash, M-Pesa reversal, or store credit). The refund is processed and stock is restored. This creates a Returns record in the Audit trail and appears in your Reports as a negative revenue event — which is the correct accounting treatment."
      },
      {
        heading: "Hack — Use the Audit Log to investigate suspicious voids",
        body: "Every post-payment void is visible in Operations > Audit with the cashier name, transaction amount, and timestamp. If a cashier has an unusually high void rate, review their entries in the Audit Log. The log shows the original sale amount and the voided amount — if cash collected matches sales minus voids in the session report, the voids are legitimate. If cash is short by the void amount, investigate further. This pattern recognition requires only 2 minutes of Audit Log review per cashier per week."
      },
      {
        heading: "Setting void permissions by role",
        body: "Go to Operations > Staff > Roles. You can configure whether a cashier role is allowed to void completed sales independently or requires manager approval. For most businesses, pre-payment edits require no approval, while post-payment voids require a manager pin. This two-tier permission structure prevents accidental voids and ensures all legitimate corrections are authorised. Review these permissions when onboarding a new cashier and adjust as they become trusted."
      }
    ],
    relatedSlugs: ["pos-void-cancel-askbiz", "pos-hack-cashier-report-filter-askbiz", "pos-hack-audit-log-shrinkage-askbiz"],
    faq: [
      { q: "Can I void a sale that happened yesterday?", a: "Yes — go to Operations > Returns and search by date. Past transactions can be voided with manager authorisation regardless of when they occurred." },
      { q: "Does voiding a sale automatically reverse M-Pesa payment?", a: "AskBiz records the void in its system. The M-Pesa reversal must be initiated separately through your Safaricom business account. AskBiz support can provide guidance on coordinating both actions." }
    ]
  },

  // 19 ─── Metrics Pinning ──────────────────────────────────────────────────────
  {
    slug: "pos-hack-metrics-pinning-askbiz",
    title: "Pin Your Top 3 KPIs for a 10-Second Morning Check",
    description: "How to identify and monitor your three most important AskBiz POS metrics every morning — without opening multiple reports — using the Overview as your single source of truth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["KPI", "key metrics", "morning check", "POS dashboard", "AskBiz overview", "business metrics", "revenue margin", "daily numbers"],
    keyTakeaways: [
      "Revenue, Gross Profit Margin, and Low Stock count are the three metrics most businesses need daily.",
      "The AskBiz Overview shows all three without navigating to any sub-reports.",
      "Switching between 'Today', 'Yesterday', and 'Last 7 days' gives three time frames in one view.",
      "Setting a daily target for each metric and comparing it to actual gives you a 10-second red/green status check."
    ],
    content: [
      {
        heading: "The 3-metric morning check that replaces 5 reports",
        body: "Most business dashboards show too much information, which means owners skim over everything and act on nothing. The AskBiz approach is different: the Overview is designed to surface the most critical numbers at the top. For the vast majority of retail businesses, three numbers determine whether the day is on track: Revenue (are we hitting today's target?), Gross Profit Margin (are we making money on what we sell?), and Low Stock count (can we fulfil today's demand?). Everything else is detail.",
        image: "/images/training/pos-metrics-explained.png",
      },
      {
        heading: "Metric 1 — Revenue vs target",
        body: "Go to Overview > Today. The Revenue metric (top left) shows today's total sales. Before trading begins, set a daily revenue target in your head (or on a whiteboard): last Monday's revenue + 10% is a reasonable aspirational target. At noon, check if you're at 50% of that target — if yes, you're on track for the full day. If you're at 30%, something needs addressing: Is there a promotion running? Is a cashier having a slow session? Revenue is the first alert."
      },
      {
        heading: "Metric 2 — Gross Profit Margin",
        body: "The Margin metric on Overview shows your gross profit percentage in real time. Your target margin depends on your sector — grocery retail typically targets 18–25%, convenience stores aim for 25–35%. If your margin today is 5% below your target, a heavily discounted item or a mis-priced product is dragging it down. Filter Reports by product category to find the culprit. Checking margin daily catches pricing errors before they compound over a full month."
      },
      {
        heading: "Metric 3 — Low Stock count",
        body: "The Low Stock number (top right on Overview) tells you how many products are below their reorder threshold. A non-zero number means action is needed before those products run out. If Low Stock shows 8 at 8 am, your first task before opening is to check which 8 products are affected and whether any are high-velocity items that could stock out before your next delivery. This single number replaces a manual shelf walk."
      },
      {
        heading: "Hack — Set a written daily target next to the screen",
        body: "Write three numbers on a sticky note next to your POS screen: Revenue target (KSh X by close), Margin target (X%), Low Stock limit (under X items). Each morning, check Overview against these numbers. Red/green in 10 seconds. Share the targets with your team so the cashiers and stock controller know what 'a good day' looks like. Teams with explicit daily targets consistently outperform those with vague goals."
      },
      {
        heading: "Expanding beyond 3 metrics as you grow",
        body: "Once the 3-metric check is a daily habit, add a fourth: Avg Sale value. If your average sale is trending down over consecutive days, it might mean a popular high-value product is out of stock, or customers are buying fewer items per visit. The AskBiz Overview shows Avg Sale in the second metric row. Add this to your daily check once the core three are automatic — typically after 2–3 weeks of daily review."
      }
    ],
    relatedSlugs: ["pos-hack-daily-brief-routine-askbiz", "pos-hack-health-score-shortcut-askbiz", "pos-metrics-explained-askbiz"],
    faq: [
      { q: "Can I customise which metrics appear on the Overview?", a: "The Overview layout is currently standardised. Use the Ask tab to get any specific metric instantly — type 'What is my margin today?' and AskBiz returns the number in seconds." },
      { q: "How do I set a revenue target in AskBiz?", a: "Revenue targets are currently set externally (whiteboard, spreadsheet, or team WhatsApp). AskBiz is building target-setting features — check the product roadmap for updates." }
    ]
  },

  // 20 ─── Offline Prep ─────────────────────────────────────────────────────────
  {
    slug: "pos-hack-offline-prep-askbiz",
    title: "Prepare for Connectivity Loss So Sales Never Stop",
    description: "How AskBiz POS offline mode works, what to do before a connectivity outage to protect revenue, and how to reconcile offline transactions when the connection returns.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["offline mode", "no internet", "connectivity loss", "POS offline", "AskBiz", "offline sales", "sync", "business continuity"],
    keyTakeaways: [
      "AskBiz POS continues processing cash sales in offline mode — no internet required for the till to function.",
      "M-Pesa payments cannot be confirmed offline — train cashiers to switch to cash when connectivity drops.",
      "Offline transactions sync automatically to the dashboard the moment internet is restored.",
      "Prepare for outages by keeping the till page loaded and the float fully stocked before each shift."
    ],
    content: [
      {
        heading: "Why offline capability is essential in emerging markets",
        body: "In Kenya and across East Africa, internet connectivity is reliable most of the time — but not all of the time. Mobile data outages, router failures, and power cuts that knock out your broadband can leave a till without connectivity for 30 minutes to several hours. A till that stops working when the internet goes down turns a connectivity inconvenience into a revenue event. AskBiz POS offline mode is designed to ensure this never happens.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "How AskBiz offline mode works",
        body: "When AskBiz detects that the internet connection has been lost, the till switches to offline mode automatically — no cashier action required. In offline mode, the till continues processing cash sales using the locally cached product catalogue and pricing. Each transaction is stored locally on the device. When internet is restored, AskBiz syncs all offline transactions to the cloud in sequence, updating the sales totals, Audit Log, and inventory counts as if no outage occurred."
      },
      {
        heading: "Preparing before an outage hits",
        body: "The best preparation happens before any outage occurs. Three things reduce offline-mode disruption: (1) Keep the till page (pos.askbiz.co) loaded and active at all times — don't close the browser tab. (2) Ensure the product catalogue was last synced within the past 24 hours — new products added within the last few minutes may not appear offline. (3) Keep the cash float fully stocked at shift start — if M-Pesa fails during an outage, all payments must be made in cash."
      },
      {
        heading: "What to tell cashiers when connectivity drops",
        body: "Train cashiers with one offline instruction: 'Cash only, no M-Pesa.' When the AskBiz offline indicator appears (usually a banner or status change in the interface), the cashier immediately announces: 'Our system is temporarily offline — we can only accept cash payments at the moment.' This sets customer expectations clearly and prevents situations where a customer sends M-Pesa but the payment can't be confirmed. Have this instruction on a laminated card next to the till."
      },
      {
        heading: "Reconciling after the connection returns",
        body: "When internet connectivity is restored, AskBiz begins syncing offline transactions automatically. Do not close the browser or restart the device during this sync — a progress indicator shows the sync status. Once complete, go to Overview and check that today's revenue figure matches the running total from the offline period. Open the Audit Log and filter to today — all offline transactions appear with their original timestamps and are marked as offline-session entries."
      },
      {
        heading: "Hack — Test offline mode before you need it",
        body: "Once per month, deliberately disconnect your router for 5 minutes during a quiet period and process a test sale in AskBiz. Confirm that the till works, the sale records, and that the transaction syncs correctly when you reconnect. This drill takes 10 minutes and ensures that when a real outage happens, your team isn't discovering how offline mode works for the first time in front of a queue of waiting customers."
      }
    ],
    relatedSlugs: ["pos-offline-mode-askbiz", "pos-hack-cash-float-formula-askbiz", "pos-payment-methods-askbiz"],
    faq: [
      { q: "How long can AskBiz operate in offline mode?", a: "AskBiz can process an unlimited number of transactions in offline mode. The only limitation is device battery — ensure the device is plugged into power during the trading day." },
      { q: "Are offline transactions secure?", a: "Yes — offline transactions are stored in an encrypted local cache on the device. They cannot be accessed from outside the device and are only synced to the AskBiz cloud under your account credentials." }
    ]
  },

];
