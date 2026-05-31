import { AcademyArticle } from "./academy-types";

export const ASKBIZ_POS_TRAINING_ARTICLES: AcademyArticle[] = [
  {
    slug: "pos-overview-dashboard-askbiz",
    title: "Reading Your POS Daily Dashboard",
    description: "A complete guide to the AskBiz Point of Sale Overview — understanding your daily revenue, sales count, refunds, low-stock alerts, margins, and staff performance at a glance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["POS", "point of sale", "dashboard", "revenue", "sales", "gross profit", "margin", "overview", "AskBiz"],
    keyTakeaways: [
      "The POS Overview shows Revenue, Sales, Refunds, Low stock count, Gross profit, Margin %, and Avg sale value — all in one screen.",
      "Use the date filters (Today, Yesterday, Last 7 days, Last 30 days, or custom) to compare any two periods instantly.",
      "The 'vs prev' indicator on each metric tells you if you're up or down vs the previous equivalent period."
    ],
    content: [
      {
        heading: "Finding your way to the POS Overview",
        body: "Click the POS tab in the top navigation bar. The Overview sub-tab loads by default. At the top you'll see three quick-action buttons: MTD VAT (month-to-date VAT report), Export CSV (download your sales data), and Open till (start a cashier session). Below those are the Branch and Sector filter dropdowns — set these to see numbers for a single location or business type rather than all combined.",
        image: "/images/training/askbiz-pos-overview.png"
      },
      {
        heading: "Understanding the seven key metrics",
        body: "The Overview shows seven headline numbers. Revenue is your total income in the period. Sales is the count of transactions. Refunds is the number of returned or voided transactions. Low stock is the count of products at or below your minimum stock threshold — a red number here means immediate attention needed. Gross profit is Revenue minus cost of goods sold. Margin % is Gross profit divided by Revenue — the higher the better. Avg sale is Revenue divided by Sales count, giving you the typical basket size."
      },
      {
        heading: "Using date filters to spot trends",
        body: "Click Today, Yesterday, Last 7 days, or Last 30 days to switch periods instantly. Each metric shows a 'vs prev' change alongside it — for example '↓ 100% vs prev' means sales dropped completely compared to the equivalent previous period. For custom date ranges, use the two date-picker fields on the right. This is useful for comparing week-on-week, or isolating a specific promotional period to see its impact on margin and average sale."
      },
      {
        heading: "Staff Performance section",
        body: "Below the key metrics, the Overview shows a Staff Performance chart — a bar graph with each cashier's name on the X-axis and their revenue contribution on the Y-axis. Below the chart is a ranked list: staff name, number of sales, and average sale value. Click any staff member's name to open a transaction modal showing their individual Sales count, Revenue total, and Avg sale for the selected period. This is ideal for spotting which cashiers are upselling effectively."
      },
      {
        heading: "Stock Alerts: acting on low inventory",
        body: "The Stock Alerts section appears below Staff Performance. Products marked OUT OF STOCK show in red — these items cannot be sold until restocked. Items with a number remaining (e.g. '25 left', '1 left') show in amber as a warning. Click any product row to see full stock details and reorder options. Regularly reviewing this section before opening prevents the frustration of a cashier trying to sell a product that's no longer in stock."
      }
    ],
    relatedSlugs: ["pos-open-till-askbiz", "pos-inventory-management-askbiz", "pos-staff-management-askbiz"],
    faq: [
      { q: "Why does 'vs prev' show 100% drop?", a: "This usually means the previous period had sales but the current period has zero — for example comparing today (no sales yet) vs yesterday." },
      { q: "Can I filter by a specific product category?", a: "Use the Sector dropdown to filter by business type (Retail, Restaurant, etc.). For product-level filtering, go to Operations > Inventory." },
      { q: "What's the difference between Revenue and Gross profit?", a: "Revenue is the total amount customers paid. Gross profit subtracts the cost of goods sold (COGS), so it reflects what you actually kept after buying the stock." }
    ]
  },

  {
    slug: "pos-open-till-askbiz",
    title: "How to Open and Close Your Till on AskBiz POS",
    description: "Step-by-step guide to starting a cashier session with the Open Till button — including how tills work, handling opening float, and what happens at end of day.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["till", "open till", "cashier", "POS", "point of sale", "session", "float", "end of day", "AskBiz"],
    keyTakeaways: [
      "Click 'Open till' from the top of any POS page to start a cashier session.",
      "Each till session is tied to a staff member's PIN — this keeps sales attributed correctly.",
      "Closing the till produces a session summary showing cash collected, card payments, and any discrepancies."
    ],
    content: [
      {
        heading: "Starting your day: the Open Till button",
        body: "The 'Open till' button sits in the top-right area of every POS screen. Clicking it opens the till interface where a cashier can begin processing sales. Each session requires a staff PIN — this ensures every transaction is attributed to the correct cashier, which feeds into the Staff Performance data on the Overview. If you're the manager, you can also open a till on behalf of a cashier by entering their PIN.",
        image: "/images/training/11-pos-inventory.gif"
      },
      {
        heading: "Setting an opening float",
        body: "When opening the till, you'll be prompted to enter the opening float — the amount of cash in the drawer at the start of the shift. Count your notes and coins and enter the total. This is important for end-of-day reconciliation: AskBiz compares your opening float plus cash sales to the actual cash in the drawer to identify any shortfalls or overages. If your business is card-only, you can set the float to zero."
      },
      {
        heading: "Processing sales through the till",
        body: "Once the till is open, the cashier can search for products by name or barcode, add them to the basket, apply any discounts or promotions, and complete the sale by selecting a payment method — cash, card, or split payment. AskBiz records the transaction instantly and updates inventory levels in real time. For returns, use the refund function within the till rather than manually adjusting stock."
      },
      {
        heading: "Closing the till and reconciling cash",
        body: "At end of shift, the cashier clicks Close till. AskBiz shows a summary: total cash sales, total card sales, expected cash in drawer (opening float + cash sales - any refunds), and a field to enter the actual cash counted. If these match, the session closes cleanly. Any variance is flagged and recorded in the Audit log so managers can investigate. The session data then flows into the Overview dashboard and Reports."
      }
    ],
    relatedSlugs: ["pos-overview-dashboard-askbiz", "pos-staff-management-askbiz", "pos-audit-log-askbiz"],
    faq: [
      { q: "Can two cashiers share a till?", a: "Each till session is tied to one PIN. For shift changes, close the current session and open a new one with the incoming cashier's PIN." },
      { q: "What if a cashier forgets their PIN?", a: "Go to POS > Staff and click Edit on the staff member to reset their PIN. Only managers and owners can reset PINs." },
      { q: "Are offline sales supported?", a: "AskBiz POS requires an internet connection to record sales in real time. For offline resilience, contact support for options." }
    ]
  },

  {
    slug: "pos-stock-alerts-askbiz",
    title: "Managing Stock Alerts and Low Inventory on AskBiz POS",
    description: "How to use the Stock Alerts section in your POS Overview to catch out-of-stock products before they become a problem — and how to restock quickly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["stock alerts", "low stock", "out of stock", "inventory", "POS", "AskBiz", "restock"],
    keyTakeaways: [
      "Stock Alerts appear at the bottom of the POS Overview — red means out of stock, amber means low stock with a unit count.",
      "Click any product in the Stock Alerts list to view full product details and trigger a restock.",
      "Set minimum stock thresholds in Operations > Inventory to control which products appear in alerts."
    ],
    content: [
      {
        heading: "Where to find Stock Alerts",
        body: "Scroll to the bottom of the POS Overview tab. The Stock Alerts section lists every product that has hit or fallen below its minimum stock threshold. Products are colour-coded: red rows with 'OUT OF STOCK' mean zero units remain and the product cannot be sold. Amber rows show a unit count (e.g. '1 left', '5 left') — these products can still be sold but will run out soon. The count of low-stock items also appears in the 'Low stock' metric card at the top of the Overview."
      },
      {
        heading: "Understanding the alert thresholds",
        body: "Each product has a minimum stock level set in Operations > Inventory. When current stock falls at or below that minimum, the product appears in Stock Alerts. For example, if Black Hair Soap has a minimum of 5 and you have 1 left, it shows as '1 left' in amber. If Fenugreek Seeds hit zero, they show as 'OUT OF STOCK' in red. Setting realistic minimums — based on how long it takes your supplier to deliver — gives you enough warning to reorder before stock runs out."
      },
      {
        heading: "Acting on an alert: restocking quickly",
        body: "Click any product row in Stock Alerts to open its full product detail view. From there you can see the current quantity, minimum threshold, supplier details, and a restock option. Use the restock form to log a stock receipt — enter the quantity received and the cost per unit. AskBiz updates the inventory level immediately and removes the product from Stock Alerts once it's above the minimum threshold."
      },
      {
        heading: "Preventing stockouts with smart thresholds",
        body: "Review your Stock Alerts each morning before opening. Products that frequently appear in alerts probably need a higher minimum threshold. Go to Operations > Inventory, find the product, and edit its minimum stock level. A good rule of thumb: set the minimum to at least 1.5× your average daily sales rate multiplied by your supplier's lead time in days. This gives you a buffer to reorder and receive before you run out."
      }
    ],
    relatedSlugs: ["pos-overview-dashboard-askbiz", "pos-inventory-management-askbiz", "pos-operations-retail-askbiz"],
    faq: [
      { q: "Can I get email alerts for out-of-stock items?", a: "Yes. Go to Business > Alerts to configure automatic notifications when products hit their minimum threshold." },
      { q: "Why is a product showing as low stock even after I restocked?", a: "Check whether the restock receipt was logged in Operations > Inventory. If the quantity wasn't updated there, the alert will persist." },
      { q: "Can I bulk-update minimum stock levels?", a: "Use the CSV import in Operations > Inventory to update minimum levels for multiple products at once." }
    ]
  },

  {
    slug: "pos-inventory-management-askbiz",
    title: "Managing Your POS Inventory on AskBiz",
    description: "A complete walkthrough of Operations > Inventory — adding products, setting prices and costs, managing stock levels, and keeping your product catalogue accurate.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: ["inventory", "stock", "products", "POS", "AskBiz", "cost price", "selling price", "SKU", "barcode"],
    keyTakeaways: [
      "Access Inventory from POS > Operations > Retail (or your sector) > Inventory — your full product catalogue lives here.",
      "Each product has a selling price, cost price, current stock level, minimum threshold, and optional barcode/SKU.",
      "You can add products manually or import a CSV to bulk-upload your catalogue."
    ],
    content: [
      {
        heading: "Getting to Inventory",
        body: "Click POS in the top nav, then the Operations sub-tab. Select your business sector — Retail, Restaurant, Salon, etc. — and click Inventory. You'll see all your products listed with current stock levels. The badge on the Inventory card shows the total product count (e.g. '40'). Use the search bar to find a specific product quickly, or scroll through the full list.",
        image: "/images/training/11-pos-inventory.gif"
      },
      {
        heading: "Adding a new product",
        body: "Click '+ Add product'. Fill in the product name, selling price (what customers pay), cost price (what you paid the supplier), and the current stock quantity. Add a category, SKU code, and barcode if you have them — barcodes let cashiers scan products at the till instead of searching manually. Set a minimum stock level so AskBiz knows when to alert you. Hit Save. The product is now available in the till and included in all inventory reports."
      },
      {
        heading: "Editing products and updating stock",
        body: "Click any product to open its detail view. From here you can update the price (both selling and cost), edit the description, adjust the stock quantity, change the minimum threshold, or deactivate the product. To receive new stock, use the 'Add stock' option rather than manually editing the quantity — this creates a proper stock receipt record that feeds into your audit trail and purchase history, making end-of-year stock reconciliation much easier."
      },
      {
        heading: "Bulk importing your product catalogue",
        body: "If you're setting up AskBiz for the first time and have your products in a spreadsheet, use the CSV import. Download the template from the Inventory page, fill in your product names, prices, costs, quantities, and minimum thresholds, then upload the file. AskBiz will process the import and display any errors — usually missing required fields or incorrectly formatted prices. Fix the errors and re-upload until the import completes cleanly."
      },
      {
        heading: "Filtering and organising your catalogue",
        body: "Use the category filter to view just one product category — useful for doing a stock count of a specific section. The stock status filter lets you view only out-of-stock, low-stock, or in-stock products. If you operate multiple branches, the Branch dropdown filters the inventory to show stock levels for one location. Products with zero stock can be hidden from the till by deactivating them — they remain in your records but cashiers won't see them."
      }
    ],
    relatedSlugs: ["pos-stock-alerts-askbiz", "pos-operations-retail-askbiz", "pos-branches-management-askbiz"],
    faq: [
      { q: "Can I have different prices at different branches?", a: "Yes. Edit a product and set branch-specific pricing. The till at each branch will show the price for that location." },
      { q: "How do I handle products sold by weight?", a: "Set the product up with a per-unit price and let the cashier enter the weight/quantity at point of sale." },
      { q: "What happens to inventory when a sale is processed?", a: "AskBiz automatically deducts the sold quantity from stock in real time, so your inventory is always up to date after each transaction." }
    ]
  },

  {
    slug: "pos-sales-transactions-askbiz",
    title: "Viewing and Analysing POS Sales & Transactions",
    description: "How to use Operations > Sales to review every transaction, filter by period, track revenue trends, and identify your best-selling products and busiest times.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["sales", "transactions", "revenue", "POS", "AskBiz", "best sellers", "reports", "analytics"],
    keyTakeaways: [
      "Operations > Sales shows every transaction with date, cashier, items sold, payment method, and total.",
      "Filter by date range, branch, cashier, or payment method to drill into exactly the data you need.",
      "The sales view shows both the transaction list and product-level summaries — use product summaries to find your bestsellers."
    ],
    content: [
      {
        heading: "Opening the Sales view",
        body: "Go to POS > Operations > Retail > Sales. The Sales section shows Revenue and Transactions as headline numbers for your selected period, along with a chart of sales over time. Below that is a full transaction log. Each row shows the transaction date and time, the cashier who processed it, the items sold, the payment method (cash or card), and the total amount. Click any row to see the full receipt — every item, quantity, price, and any discount applied."
      },
      {
        heading: "Filtering your sales data",
        body: "Use the date range selector at the top to set the period. Combine this with the Branch dropdown to see sales for one location, or the cashier filter to see transactions by a specific staff member. The payment method filter lets you separate cash sales from card sales — useful when reconciling your card terminal against AskBiz. To export the filtered view, click Export CSV and the file downloads immediately with all visible columns."
      },
      {
        heading: "Identifying your best-selling products",
        body: "Switch to the Products tab within Sales to see a ranked list of items sold in the period. Each product shows total units sold, revenue generated, and its share of overall sales. Products at the top of the list deserve priority in your inventory planning — always keep generous stock of these. Products at the bottom that generate minimal revenue may be worth reviewing: consider whether they're priced correctly, positioned well, or worth stocking at all."
      },
      {
        heading: "Understanding your sales patterns",
        body: "The sales chart plots revenue over time. Look for peaks (busy days or hours) and troughs (slow periods). If you're on Last 7 days view, you might see that weekends consistently outperform weekdays, or that Tuesdays are your slowest day. Use this insight to plan staffing — schedule more cashiers during peak periods and fewer during slow ones. You can also correlate sales peaks with promotions or external events to understand what drives your busiest days."
      }
    ],
    relatedSlugs: ["pos-overview-dashboard-askbiz", "pos-reports-askbiz", "pos-promotions-askbiz"],
    faq: [
      { q: "Can I view sales broken down by hour?", a: "Yes. Set a custom date range to a single day and the sales chart will display hourly data." },
      { q: "How do I find a specific transaction?", a: "Use the search field in the transaction log to search by customer name, cashier, or transaction amount." },
      { q: "Can I void or edit a past transaction?", a: "You can process a return via Operations > Returns. Editing past transactions directly is not allowed to preserve audit integrity." }
    ]
  },

  {
    slug: "pos-customers-askbiz",
    title: "Customer Profiles and Segments on AskBiz POS",
    description: "How to use Operations > Customers to view customer purchase history, build segments, and understand who your best customers are.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["customers", "profiles", "segments", "purchase history", "POS", "AskBiz", "loyalty", "CRM"],
    keyTakeaways: [
      "Every customer who provides their name or phone number at checkout gets a profile that tracks their purchase history.",
      "Segments let you group customers by spend level, visit frequency, or last purchase date.",
      "Use customer data to identify your top spenders and target them with loyalty rewards or promotions."
    ],
    content: [
      {
        heading: "How customer profiles are created",
        body: "When a cashier processes a sale, they can optionally add the customer's name, phone number, or email. AskBiz creates a customer profile for that person and links every subsequent purchase made under the same contact details. Over time, each profile builds up a complete purchase history — every item bought, every transaction amount, visit dates, average spend, and total lifetime value. Customers who buy without providing contact details are recorded as anonymous sales."
      },
      {
        heading: "Viewing individual customer profiles",
        body: "Go to POS > Operations > Retail > Customers. The customer list shows each customer's name, total spend, number of visits, and last visit date. Click any customer to open their full profile: a timeline of every transaction, a breakdown of products they buy most often, their average basket size, and any loyalty points they've accumulated. This view is invaluable when a customer calls with a question — you can instantly pull up exactly what they bought and when."
      },
      {
        heading: "Building customer segments",
        body: "Use the Segments feature to group customers automatically. You can create segments based on total spend (e.g. customers who've spent over KSh 5,000), visit frequency (e.g. customers who visit weekly), or recency (e.g. customers who haven't bought in 60 days). Segments update automatically as customers' behaviour changes — a customer who hits the spend threshold moves into your high-value segment without you doing anything manually."
      },
      {
        heading: "Using customer data to grow revenue",
        body: "Your best customers — high spend, frequent visits — deserve special treatment. Use the Promotions feature to create exclusive discounts for your high-value segment. For customers who haven't visited in a while (the 'lapsing' segment), create a win-back offer. Export the segment's phone numbers and use WhatsApp or SMS to reach them directly. AskBiz gives you the data — how you use it to communicate with customers is entirely flexible."
      }
    ],
    relatedSlugs: ["pos-loyalty-programme-askbiz", "pos-promotions-askbiz", "pos-sales-transactions-askbiz"],
    faq: [
      { q: "Is customer data GDPR compliant?", a: "AskBiz stores customer data on UK servers with encryption in transit and at rest. You must obtain customer consent before collecting their details at checkout." },
      { q: "Can customers opt out of being tracked?", a: "Yes. Delete a customer profile from the Customers section to remove all their data from AskBiz." },
      { q: "Can I import existing customer data?", a: "Yes. Use the CSV import in Customers to upload existing contact lists. Match columns to name, phone, email, and any spend history you want to carry over." }
    ]
  },

  {
    slug: "pos-promotions-askbiz",
    title: "Creating Promotions, Discounts and Coupons on AskBiz POS",
    description: "How to set up and run promotions in AskBiz POS — from simple percentage discounts to product-specific deals and coupon codes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["promotions", "discounts", "coupons", "deals", "POS", "AskBiz", "offers", "sale"],
    keyTakeaways: [
      "Create promotions from Operations > Retail > Promotions — set percentage or fixed-amount discounts, apply them to all products or specific items.",
      "Coupon codes let customers redeem promotions at checkout by entering a code — ideal for marketing campaigns.",
      "Promotions can be time-limited, quantity-limited, or customer-segment-specific."
    ],
    content: [
      {
        heading: "Getting to Promotions",
        body: "Go to POS > Operations > Retail > Promotions. Click '+ New promotion'. You'll see options for the promotion type: percentage discount (e.g. 20% off), fixed amount discount (e.g. KSh 100 off), buy-one-get-one (BOGO), or a spend threshold offer (e.g. spend KSh 1,000 and get 10% off). Choose the type that fits your goal — most clearance sales use percentage discounts, while 'free gift with purchase' campaigns use BOGO."
      },
      {
        heading: "Setting the scope: all products or specific items",
        body: "After choosing the promotion type, set the scope. 'All products' applies the discount to everything in the till. 'Specific categories' lets you run, for example, a 25% off all beauty products promotion. 'Specific products' lets you discount individual items — useful for clearing slow-moving stock. If you choose specific products, search and add them from your inventory. The promotion will only activate when one of those items is added to a basket."
      },
      {
        heading: "Adding a coupon code",
        body: "Toggle on 'Require coupon code' to make the promotion opt-in. Enter a code — something memorable like WELCOME20 or LAUNCH50. Cashiers can type this code into the till, or you can set it so customers enter it themselves at a self-checkout point. Coupon codes are ideal for marketing campaigns where you want to track uptake: the Promotions dashboard shows how many times each coupon has been redeemed."
      },
      {
        heading: "Setting limits and dates",
        body: "Every promotion can have a start date, end date, and a maximum number of uses. For time-limited flash sales, set the end date to midnight of the last day. For limited-quantity offers (e.g. first 50 customers get a discount), set the maximum uses to 50 — AskBiz will stop accepting the promotion automatically once it's been used 50 times. Combine limits with customer segments to restrict the promotion to, for example, loyalty members only."
      }
    ],
    relatedSlugs: ["pos-loyalty-programme-askbiz", "pos-customers-askbiz", "pos-sales-transactions-askbiz"],
    faq: [
      { q: "Can a customer use multiple promotions on one transaction?", a: "By default, only one promotion applies per transaction. You can change this in the promotion settings to allow stacking." },
      { q: "How do I see which promotions are driving the most revenue?", a: "The Promotions dashboard shows each promotion's redemption count, total discount given, and revenue generated during the promotion period." },
      { q: "Can I pause a promotion without deleting it?", a: "Yes. Click Edit on any promotion and toggle it to inactive. It will remain saved and can be reactivated later." }
    ]
  },

  {
    slug: "pos-loyalty-programme-askbiz",
    title: "Setting Up a Loyalty Programme on AskBiz POS",
    description: "How to create and manage a points-based loyalty programme — setting earn rates, reward tiers, and how customers redeem points at checkout.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["loyalty", "points", "rewards", "tiers", "POS", "AskBiz", "customer retention", "repeat customers"],
    keyTakeaways: [
      "Set an earn rate (e.g. 1 point per KSh 10 spent) and a redemption rate (e.g. 100 points = KSh 10 off).",
      "Create tiers (Bronze, Silver, Gold) to reward your highest-spending customers with better earn rates.",
      "Points balance is visible on the customer profile and can be redeemed directly at the till."
    ],
    content: [
      {
        heading: "Setting up your loyalty programme",
        body: "Go to POS > Operations > Retail > Loyalty. Click 'Enable loyalty programme'. Set your earn rate — how many points a customer earns per currency unit spent. For example, 1 point per KSh 10 spent means a KSh 500 purchase earns 50 points. Then set your redemption rate — how many points equal a KSh discount at checkout. A common ratio is 100 points = KSh 10 off, giving customers a 1% effective discount which is affordable for most businesses."
      },
      {
        heading: "Creating loyalty tiers",
        body: "Tiers reward your most loyal customers with higher earn rates. Create a Bronze tier (all customers), a Silver tier (customers who've spent KSh 10,000+), and a Gold tier (customers who've spent KSh 50,000+). Set different earn rates per tier — for example Bronze earns 1 point per KSh 10, Silver earns 1.5 points, Gold earns 2 points. Customers automatically move up tiers as their cumulative spend grows. Tier status is visible on the customer's profile and shown in the till when a customer is selected."
      },
      {
        heading: "How customers earn and redeem points",
        body: "When a cashier selects a customer at the till before processing a sale, AskBiz automatically calculates and awards points based on the basket total and the customer's tier. The points are added to the customer's balance immediately after the transaction completes. To redeem points, the cashier selects the customer, clicks 'Redeem points', and enters the number of points to use. AskBiz calculates the equivalent discount and applies it to the basket. The customer's balance is reduced accordingly."
      },
      {
        heading: "Monitoring your loyalty programme performance",
        body: "The Loyalty dashboard shows total points issued, total points redeemed, redemption rate (what % of issued points are actually used), and the total value of discounts given. A low redemption rate might mean customers aren't aware of their balance — remind them at checkout. A very high redemption rate is good for retention but watch its impact on your margins. Use the Business > Ask AI feature to ask 'What is the revenue impact of my loyalty programme?' for a deeper analysis."
      }
    ],
    relatedSlugs: ["pos-customers-askbiz", "pos-promotions-askbiz", "pos-reports-askbiz"],
    faq: [
      { q: "Can points expire?", a: "Yes. Set a points expiry period in the Loyalty settings — for example, points expire if unused within 12 months." },
      { q: "Can customers check their points balance themselves?", a: "Their balance is shown to the cashier when their profile is pulled up at the till. Customer-facing balance checks via SMS or a portal are on the AskBiz roadmap." },
      { q: "What happens to points when a sale is refunded?", a: "Points earned on the refunded amount are automatically deducted from the customer's balance." }
    ]
  },

  {
    slug: "pos-returns-refunds-askbiz",
    title: "Processing Returns, Refunds and Exchanges on AskBiz POS",
    description: "How to handle returns and refunds cleanly in AskBiz POS — finding the original transaction, processing a full or partial refund, and restocking returned items.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["returns", "refunds", "exchanges", "POS", "AskBiz", "credit note", "partial refund"],
    keyTakeaways: [
      "Process all returns through Operations > Returns — never adjust inventory manually as this breaks your audit trail.",
      "You can do a full refund, partial refund (specific items), or an exchange (return + new sale).",
      "Returned items are automatically added back to stock, and the refund appears in your sales report as a negative transaction."
    ],
    content: [
      {
        heading: "Finding the original transaction",
        body: "Go to POS > Operations > Retail > Returns. Click '+ New return'. Search for the original transaction by date, customer name, or transaction amount. Once you find it, click to open the receipt. You'll see every item from the original sale with checkboxes. Select the items being returned — you can return all items (full refund) or just some of them (partial refund)."
      },
      {
        heading: "Processing a full refund",
        body: "To refund the entire transaction, select all items and click 'Refund'. Choose the refund method: back to the original payment method (cash goes back as cash, card goes back to the card), or as a store credit note. Enter a reason for the return — this field is optional but useful for tracking why customers return items. Click Confirm. The refund is recorded, the items are returned to stock, and the transaction log shows the original sale and the return linked together."
      },
      {
        heading: "Processing a partial refund",
        body: "To refund only some items, select only those items on the receipt. AskBiz calculates the partial refund amount automatically based on the item prices and any discounts that applied. This is useful when a customer bought three products but only wants to return one. The refunded amount and restocked items only cover the selected products — the rest of the transaction remains intact in your records."
      },
      {
        heading: "Handling exchanges",
        body: "An exchange is a return combined with a new sale. Process the return first as above, giving the customer credit for the returned items. Then open a new transaction in the till, add the exchange item to the basket, and apply the credit note as payment. If the exchange item costs more, the customer pays the difference; if it costs less, issue the remaining credit as a store credit or cash refund. Both the return and the new sale are recorded as separate transactions in your audit log."
      }
    ],
    relatedSlugs: ["pos-sales-transactions-askbiz", "pos-audit-log-askbiz", "pos-inventory-management-askbiz"],
    faq: [
      { q: "What if I can't find the original transaction?", a: "You can process a return without the original receipt by selecting 'No receipt return'. AskBiz will ask for the item and refund amount manually, but this won't be linked to a specific original transaction." },
      { q: "Do returned items automatically go back into stock?", a: "Yes — by default. If an item is damaged and unsellable, uncheck 'Return to stock' during the return process and AskBiz won't add it back to inventory." },
      { q: "Can I restrict who can process returns?", a: "Yes. Go to POS > Staff and set the 'Can process returns' permission to manager-only if you want cashiers to get approval before issuing refunds." }
    ]
  },

  {
    slug: "pos-reports-askbiz",
    title: "Using POS Reports: Sales, Margins and Insights",
    description: "How to generate and read POS reports in AskBiz — understanding your sales summary, margin analysis, best-selling products, and busiest trading periods.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["reports", "sales report", "margin", "POS", "AskBiz", "insights", "analytics", "profit"],
    keyTakeaways: [
      "Operations > Reports shows pre-built reports for Sales Summary, Margin Analysis, Product Performance, and Staff Performance.",
      "All reports can be filtered by date range, branch, and sector — and exported to CSV.",
      "The Margin Analysis report is the most important for profitability: it shows which products you're actually making money on."
    ],
    content: [
      {
        heading: "Where to find POS Reports",
        body: "Go to POS > Operations > Retail > Reports. You'll see a menu of report types. The key reports are: Sales Summary (total revenue, transactions, refunds, and average sale by period), Product Performance (sales and margin by product), Staff Performance (revenue and transactions by cashier), and Margin Analysis (gross profit and margin % by product or category). Each report loads for your default date range and can be filtered and re-run."
      },
      {
        heading: "Reading the Sales Summary",
        body: "The Sales Summary shows your headline numbers for the period: total revenue, number of transactions, total refunds, net revenue (revenue minus refunds), average transaction value, and a day-by-day breakdown. Use this report for a quick weekly review — open last week's Sales Summary every Monday morning to understand what happened. If net revenue is significantly lower than revenue, investigate your refund rate using the Returns section."
      },
      {
        heading: "Using Margin Analysis to protect profitability",
        body: "The Margin Analysis report is the most powerful for business health. It shows each product's revenue, cost of goods sold (COGS), gross profit, and margin percentage. Sort by Margin % ascending to find your lowest-margin products — these are the ones where pricing may need to be reviewed or where supplier costs are eating your profit. Sort by Gross profit descending to see your most profitable products in absolute terms. These are the products to prioritise stocking and promoting."
      },
      {
        heading: "Product Performance: finding your bestsellers and slow-movers",
        body: "The Product Performance report ranks products by units sold, revenue, and margin. Your bestsellers by units might not be your bestsellers by profit if they're low-margin items. The ideal products are those that rank highly on both units sold and margin %. Products with high units but low margin might be worth a price increase test. Products with low units and low margin are candidates for discontinuation — they take up shelf space and cash without contributing meaningfully."
      },
      {
        heading: "Exporting reports for accounting",
        body: "Every report has an Export CSV button. The export includes all rows visible in the report — no sampling or limits. Download your monthly Sales Summary and send it to your accountant. Download the Margin Analysis for VAT filing. For MTD (Making Tax Digital) VAT reporting specifically, use the MTD VAT button at the top of any POS screen — this generates a VAT-compliant summary for the month."
      }
    ],
    relatedSlugs: ["pos-sales-transactions-askbiz", "pos-export-vat-askbiz", "pos-overview-dashboard-askbiz"],
    faq: [
      { q: "Can I schedule reports to send automatically?", a: "Automated report scheduling is on the AskBiz roadmap. For now, export reports manually on a recurring schedule and share with your team." },
      { q: "Why does my margin look lower than expected?", a: "Check that cost prices are entered correctly for all products in Inventory. Missing or incorrect cost prices will skew margin calculations." },
      { q: "Can I compare two periods side by side?", a: "The 'vs prev' indicators on the Overview do this automatically. For a more detailed side-by-side, export two date ranges to CSV and compare in a spreadsheet." }
    ]
  },

  {
    slug: "pos-staff-management-askbiz",
    title: "Managing POS Staff: Adding Cashiers, Setting PINs and Permissions",
    description: "How to add staff to AskBiz POS, assign roles and branches, set PINs for till access, and manage seat usage across your locations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["staff", "cashier", "PIN", "permissions", "POS", "AskBiz", "seats", "roles", "team"],
    keyTakeaways: [
      "Add staff from POS > Staff — each staff member gets a name, role (cashier or inventory), branch assignment, and a PIN.",
      "PINs authenticate staff at the till and ensure every sale is attributed to the correct person.",
      "Your plan determines how many staff seats you have — upgrade seats to add more team members."
    ],
    content: [
      {
        heading: "The Staff tab: your team overview",
        body: "Go to POS and click the Staff sub-tab at the top. You'll see every staff member, their role, branch, whether their PIN is set, and their last login date. The header shows how many seats are in use vs your total (e.g. '2 of 2 seats used'). If you're at capacity, click 'Add seats' or 'Upgrade seats' to increase your limit. Each staff member has Edit and Deactivate buttons — deactivating a staff member prevents them from logging into the till without deleting their transaction history.",
        image: "/images/training/askbiz-pos-overview.png"
      },
      {
        heading: "Adding a new staff member",
        body: "Click '+ Add staff' from the Staff tab. Enter their name and assign a role: Cashier (can process sales, apply promotions, and handle returns) or Inventory (can receive stock, adjust inventory levels, and view reports but not process customer sales). Assign them to a branch — staff can only access the till for branches they're assigned to. Set a 4-digit PIN that the staff member will use to log into the till. Make sure they memorise it — do not use predictable PINs like 1234 or 0000."
      },
      {
        heading: "Resetting a forgotten PIN",
        body: "If a staff member forgets their PIN, go to POS > Staff, find their name, and click Edit. Click 'Reset PIN' and enter a new 4-digit PIN, then confirm. Let the staff member know their new PIN. Only managers and account owners can reset PINs — cashiers cannot change their own PIN through the till interface. If a staff member leaves, deactivate their account immediately to prevent unauthorised till access."
      },
      {
        heading: "Permissions: what each role can and cannot do",
        body: "Cashier role: can open the till, process sales, apply coupon codes, add customers to transactions, and process returns (if enabled). Cannot edit product prices, adjust stock levels, or view detailed margin reports. Inventory role: can add and receive stock, edit product details including cost prices, run inventory reports, and manage suppliers. Cannot open the till or process customer sales. This separation of duties is an important control — your cashiers shouldn't be able to change the prices they're selling at."
      }
    ],
    relatedSlugs: ["pos-open-till-askbiz", "pos-branches-management-askbiz", "pos-audit-log-askbiz"],
    faq: [
      { q: "Can a staff member work at multiple branches?", a: "Yes. Edit the staff member and assign them to multiple branches. They'll be able to log into the till at any of their assigned branches." },
      { q: "What happens to a deactivated staff member's past transactions?", a: "All past transactions remain in the system attributed to them. Deactivation only prevents future logins." },
      { q: "Is there a manager-override PIN?", a: "Yes. The account owner's PIN can override any cashier restriction — useful for approving returns or applying manual discounts that require manager approval." }
    ]
  },

  {
    slug: "pos-branches-management-askbiz",
    title: "Managing Multiple Branches on AskBiz POS",
    description: "How to set up and manage multiple locations — adding branches, assigning stock and staff, comparing branch performance, and consolidating your multi-site view.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["branches", "locations", "multi-site", "POS", "AskBiz", "stock transfer", "branch performance"],
    keyTakeaways: [
      "Add branches from POS > Branches — each branch has its own stock levels, staff assignments, and sales history.",
      "Use the Branch dropdown on any POS page to filter data to a single location.",
      "The Overview with 'All Branches' selected gives you a consolidated view across your whole business."
    ],
    content: [
      {
        heading: "The Branches tab: your location list",
        body: "Go to POS and click the Branches sub-tab. You'll see every branch listed with its name, whether it's the default location, how many staff members are assigned, and how many products are in its inventory. For example: 'town — Default location — 2 staff · 76 products' and 'Bondeni — 0 staff · 0 products'. Click Edit on any branch to update its name, address, contact details, and operating hours."
      },
      {
        heading: "Adding a new branch",
        body: "Click '+ Add branch'. Enter the branch name (e.g. 'Westlands', 'Airport Road', 'Bondeni'). Add the physical address — this is used for the Map view and for geo-tagging sales. Set the operating hours if they differ from your default. Assign staff to the branch from the Staff tab. Then stock the branch by going to Operations > Inventory and using the Branch dropdown to add product quantities specifically for that location. A new branch starts with zero stock until you log a stock receipt or transfer stock from another branch."
      },
      {
        heading: "Comparing branch performance",
        body: "From the POS Overview, set the Branch dropdown to 'All Branches' to see your total combined numbers. Then switch to individual branches one at a time to see each location's Revenue, Sales, Gross profit, and Margin. If one branch has a significantly lower margin than another with similar revenue, investigate the cost prices — perhaps that branch is buying stock at higher prices. If one branch has far fewer transactions despite similar opening hours, it may need a marketing push or a staffing review."
      },
      {
        heading: "Managing stock across branches",
        body: "Each branch has its own inventory. Stock levels at the town branch are separate from Bondeni. If the town branch is overstocked on an item and Bondeni is running low, you can log a stock transfer: go to Inventory, find the product, click 'Transfer stock', select the source branch, destination branch, and quantity. AskBiz deducts from the source and adds to the destination, keeping both branches' stock accurate. Stock transfers are recorded in the Audit log for full traceability."
      }
    ],
    relatedSlugs: ["pos-inventory-management-askbiz", "pos-overview-dashboard-askbiz", "pos-map-view-askbiz"],
    faq: [
      { q: "Can I set different prices at different branches?", a: "Yes. Go to Operations > Inventory, select a branch, and edit product prices for that specific location." },
      { q: "Is there a limit to how many branches I can add?", a: "Branch limits depend on your plan. Check the pricing page or contact support to understand limits on your current plan." },
      { q: "Can customers at one branch redeem loyalty points earned at another?", a: "Yes. Loyalty points are tied to the customer profile, which is shared across all branches." }
    ]
  },

  {
    slug: "pos-map-view-askbiz",
    title: "The POS Sales Map: Geo-Tagged Transactions",
    description: "How the AskBiz POS Map tab works — enabling location access, viewing where sales happen geographically, and using map data to understand customer footprint.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["map", "geo-tagged", "location", "POS", "AskBiz", "geography", "sales map"],
    keyTakeaways: [
      "The Map tab shows a geographic heat map of where sales transactions were processed — useful for multi-branch or mobile businesses.",
      "Geo-tagging requires cashiers to allow location access on their device when checking out.",
      "Use the map to spot which areas generate the most sales, then focus marketing efforts there."
    ],
    content: [
      {
        heading: "How geo-tagged sales work",
        body: "Go to POS and click the Map sub-tab. If you see 'No geo-tagged sales in this period — cashiers must allow location access when checking out', it means location permissions haven't been granted on the cashier's device. The Map feature uses the browser's geolocation API — when a cashier processes a sale, the device records the GPS coordinates of that transaction. These coordinates are plotted on the map so you can see exactly where each sale happened."
      },
      {
        heading: "Enabling location access for cashiers",
        body: "For geo-tagging to work, each cashier's device must grant location permission to AskBiz. On Chrome: when the cashier first opens a till session, the browser will ask 'Allow AskBiz to use your location?' — click Allow. On Safari: go to Settings > Safari > Location and set AskBiz to 'Allow'. Once enabled, every subsequent sale from that device is automatically tagged with the GPS location. Remind cashiers not to block this permission — without it the Map tab stays empty."
      },
      {
        heading: "Reading the sales map",
        body: "Once sales are being geo-tagged, the Map shows dots or clusters at the location of each transaction. Use the date filters to change the period — for example, Last 30 days shows your sales geography for a full month. Click a dot to see the transaction details. For businesses with multiple branches, you'll see clusters forming around each location. For mobile or delivery businesses, the map shows where customers are when they're transacted — revealing your real geographic trading area."
      },
      {
        heading: "Using map data for business decisions",
        body: "If your sales cluster in one area, consider whether a second branch or pop-up in that area would capture more of the nearby market. If you're a delivery business and sales cluster far from your base, it might be worth a satellite depot or delivery partner in that zone. Combine map data with the Branch filter to see whether your town branch customers are geographically close (they walk past) or far (they drive specifically to you) — this affects your marketing strategy and where you'd put a future location."
      }
    ],
    relatedSlugs: ["pos-branches-management-askbiz", "pos-overview-dashboard-askbiz", "pos-logistics-network-askbiz"],
    faq: [
      { q: "Is location data stored permanently?", a: "Location coordinates are stored as part of the transaction record and are subject to the same data retention and GDPR policies as all other customer data." },
      { q: "What if cashiers work in areas with poor GPS signal?", a: "Transactions with no GPS fix are recorded without coordinates and won't appear on the map. They still appear normally in all other reports." },
      { q: "Can I see which cashier made each geo-tagged sale?", a: "Yes. Click any dot on the map to see the full transaction detail including the cashier's name." }
    ]
  },

  {
    slug: "pos-audit-log-askbiz",
    title: "Using the POS Audit Log to Track Every Change",
    description: "How the Audit Log in AskBiz POS records every transaction, stock change, staff action, and system event — and how to use it to investigate discrepancies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["audit log", "audit trail", "transactions", "POS", "AskBiz", "accountability", "discrepancy", "investigation"],
    keyTakeaways: [
      "The Audit Log records every event in your POS — transactions, inventory changes, staff logins, deliveries, and more.",
      "Filter by Transactions, Jobs, Captures, Inventory, Staff, or Deliveries to narrow down what you're looking for.",
      "Search by actor (staff member name) or event type to pinpoint a specific incident."
    ],
    content: [
      {
        heading: "Where to find the Audit Log",
        body: "Go to POS and click the Audit sub-tab. The Audit Log shows a complete, tamper-proof record of everything that has happened in your POS — from the moment you first set it up. At the top, filter by event category: All (everything), Transactions (sales, refunds, voids), Jobs (scheduled tasks), Captures (payment captures), Inventory (stock changes, price edits), Staff (logins, PIN resets, deactivations), or Deliveries (logistics events). Set a time filter — All time, Today, or a custom date."
      },
      {
        heading: "Investigating a discrepancy",
        body: "If your end-of-day cash doesn't match what AskBiz shows, start with the Transactions filter. Set the date to today and look for any transactions that seem unexpected — refunds processed without a clear reason, unusually high discount amounts, or transactions voided after the till was closed. Click any event row to expand it and see the full detail: who did it, at what time, on which device, and what changed. For stock discrepancies, switch to the Inventory filter and look for stock adjustments — manual quantity changes that bypassed the proper restock process."
      },
      {
        heading: "Searching for a specific actor or event",
        body: "Use the search bar at the top of the Audit Log to search by staff member name (actor) or event description. For example, type 'annet' to see every action annet has taken — every sale she processed, every stock adjustment, every login. This is the most powerful tool for investigating a specific staff member's activity if something doesn't add up. The search is case-insensitive and matches partial names."
      },
      {
        heading: "Using the Audit Log for compliance",
        body: "The Audit Log is your evidence trail for tax purposes, insurance claims, and regulatory compliance. It cannot be edited or deleted by anyone — not even the account owner. For VAT inspections, combine the Audit Log with the MTD VAT report to provide a complete picture of your transaction history. For insurance claims involving stock theft, the Inventory filter in the Audit Log shows exactly when stock levels changed and who changed them, helping establish whether losses occurred and when."
      }
    ],
    relatedSlugs: ["pos-open-till-askbiz", "pos-returns-refunds-askbiz", "pos-export-vat-askbiz"],
    faq: [
      { q: "Can I delete entries from the Audit Log?", a: "No. The Audit Log is immutable — no user can edit or delete entries. This is by design for compliance and accountability." },
      { q: "How far back does the Audit Log go?", a: "All events from when your account was created are retained. There is no automatic purge of old audit data." },
      { q: "Can I export the Audit Log?", a: "Yes. Use the Export CSV button at the top of the Audit Log to download all visible events for the selected date range and filters." }
    ]
  },

  {
    slug: "pos-logistics-network-askbiz",
    title: "POS Logistics Network: Managing Deliveries and Fleet",
    description: "How to use the Logistics tab in AskBiz POS to track parcels, manage your delivery fleet, monitor routes, and view logistics revenue across all branches.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["logistics", "deliveries", "fleet", "parcels", "POS", "AskBiz", "routes", "delivery network"],
    keyTakeaways: [
      "The Logistics tab shows parcels, fleet, routes, and revenue across all your branches in one view.",
      "Use the branch and sector filters to isolate logistics performance for a specific location.",
      "Connect your delivery operations to POS so delivery revenue is tracked alongside in-store sales."
    ],
    content: [
      {
        heading: "Accessing the Logistics Network",
        body: "Go to POS and click the Logistics sub-tab. The Logistics Network page covers parcels, fleet management, route performance, and delivery revenue across all your branches. If you see 'Loading logistics data...' on first visit, click the Refresh button — the logistics module pulls live data from your connected delivery operations. If your business doesn't handle deliveries, this tab can be ignored; it's most relevant to courier businesses, delivery restaurants, and retail businesses that offer home delivery."
      },
      {
        heading: "Tracking parcels and deliveries",
        body: "The parcels section shows every active delivery: the parcel ID, destination, assigned driver or fleet vehicle, current status (picked up, in transit, delivered, failed), and the expected delivery time. Filter by branch to see only deliveries originating from a specific location. Click any parcel to see its full tracking timeline — every status update from when the order was placed through to delivery confirmation. Failed deliveries are flagged in red and should be reattempted or refunded promptly."
      },
      {
        heading: "Fleet and route performance",
        body: "The fleet section shows each vehicle or driver's utilisation — how many deliveries they've completed in the period, total distance covered, and delivery success rate. A driver with a low success rate may need route optimisation or additional training on customer handovers. The routes section groups deliveries by geographic area, helping you see which delivery zones are most active and whether your fleet coverage matches demand. Overloaded zones may justify hiring an additional driver."
      },
      {
        heading: "Viewing logistics revenue",
        body: "Delivery revenue (delivery fees charged to customers) is tracked separately from product revenue. The Logistics Network shows total delivery fees collected by branch, average delivery fee, and number of deliveries. Compare this to the cost of running your fleet — if delivery fees don't cover fuel, vehicle costs, and driver wages, your delivery model is loss-making even if individual orders look profitable. Use the Business > CFO Mode for a deeper analysis of delivery profitability."
      }
    ],
    relatedSlugs: ["pos-branches-management-askbiz", "pos-map-view-askbiz", "pos-reports-askbiz"],
    faq: [
      { q: "Does AskBiz integrate with third-party delivery platforms?", a: "Yes. Go to POS > Operations > Integrations to connect platforms like Glovo, Uber Eats, or your own delivery management software." },
      { q: "How are delivery returns handled?", a: "Failed deliveries that result in a product being returned to the warehouse are processed through Operations > Returns, same as in-store returns." },
      { q: "Can I assign specific products or orders to specific drivers?", a: "Yes. Use the assignment feature within the Logistics tab to match orders to drivers based on their route or availability." }
    ]
  },

  {
    slug: "pos-export-vat-askbiz",
    title: "Exporting Data and Generating MTD VAT Reports on AskBiz POS",
    description: "How to use the Export CSV and MTD VAT buttons on AskBiz POS to download your sales data and produce VAT-compliant reports for accounting and tax filing.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["export", "CSV", "VAT", "MTD", "Making Tax Digital", "tax", "accounting", "POS", "AskBiz"],
    keyTakeaways: [
      "Click 'Export CSV' at the top of any POS page to download your sales, inventory, or report data as a spreadsheet.",
      "Click 'MTD VAT' to generate a month-to-date VAT summary compliant with Making Tax Digital requirements.",
      "Filter before exporting — the export always reflects the currently active Branch, Sector, and date filters."
    ],
    content: [
      {
        heading: "Using the Export CSV button",
        body: "The Export CSV button appears at the top of every POS tab — Overview, Operations sub-sections, Staff, and Branches. Before clicking Export, set your filters: choose the Branch (All Branches or a specific one), the date range (e.g. Last 30 days for monthly reporting), and the Sector if applicable. Then click Export CSV. Your browser downloads a file immediately. Open it in Excel, Google Sheets, or any CSV-compatible tool. The file contains every visible column from the current view — no data is hidden or truncated."
      },
      {
        heading: "What each export contains",
        body: "Overview export: Revenue, Sales count, Refunds, Gross profit, Margin, and Avg sale for each day in the range. Transactions export (from Operations > Sales): one row per transaction with date, time, cashier, items, quantities, prices, discounts, payment method, and total. Inventory export (from Operations > Inventory): one row per product with name, SKU, selling price, cost price, current stock, minimum threshold, and category. Staff export: one row per staff member with name, role, branch, sales count, and revenue for the period."
      },
      {
        heading: "Generating the MTD VAT report",
        body: "Click the 'MTD VAT' button at the top of any POS page. AskBiz generates a VAT summary for the current calendar month to date. The report shows: total gross sales (including VAT), total net sales (excluding VAT), total VAT collected, broken down by VAT rate (standard, reduced, zero). This format is compatible with Making Tax Digital submissions via your accounting software — share the report with your accountant or import it directly into Xero or QuickBooks if you've set up that integration."
      },
      {
        heading: "Connecting to Xero for automated VAT",
        body: "For fully automated VAT reporting, connect AskBiz POS to Xero via POS > Operations > Integrations. Once connected, your daily sales totals automatically sync to Xero as journal entries, with VAT categorised correctly. This eliminates the need to manually export and import — your accountant sees live POS data in Xero. If you don't use Xero, use the monthly MTD VAT export combined with the Operations > Sales CSV export to give your accountant a complete picture."
      }
    ],
    relatedSlugs: ["pos-reports-askbiz", "pos-audit-log-askbiz", "pos-operations-retail-askbiz"],
    faq: [
      { q: "Can I export data for a custom date range?", a: "Yes. Set a custom date range using the date pickers before clicking Export CSV." },
      { q: "Is the MTD VAT report accepted by HMRC?", a: "The MTD VAT report provides the figures required for a VAT return. You'll still submit through HMRC's Making Tax Digital portal or your accounting software — AskBiz provides the numbers, not the submission." },
      { q: "How often should I export my data?", a: "At minimum, export a monthly Sales CSV and MTD VAT report. Keep these as backup records even if you're also connected to Xero." }
    ]
  },

  {
    slug: "pos-operations-retail-askbiz",
    title: "POS Operations: Navigating Retail, Restaurant, Salon and More",
    description: "How the Operations tab adapts to different business types — understanding the sector selector and what changes between Retail, Restaurant, Repair, Salon, Factory, and Logistics modes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["operations", "retail", "restaurant", "salon", "repair", "factory", "logistics", "POS", "AskBiz", "sector"],
    keyTakeaways: [
      "The Operations tab has six sector modes: Restaurant, Repair, Salon, Retail, Factory, and Logistics — each shows the tools relevant to that business type.",
      "Switching sectors changes the menu options, terminology, and default workflows to match your industry.",
      "If you run multiple business types (e.g. a salon that also sells retail products), you can switch between sectors within the same account."
    ],
    content: [
      {
        heading: "The sector selector in Operations",
        body: "Go to POS > Operations. At the top you'll see six pill buttons: Restaurant, Repair, Salon, Retail, Factory, and Logistics. These represent different business types. Click any pill to switch to that sector's Operations menu. The default is Retail — showing Inventory, Sales, Customers, Promotions, Loyalty, Returns, Reports, Purchase Orders, Gift Cards, Staff, Branches, Map, Integrations, and Audit. Other sectors replace some of these with industry-specific alternatives.",
        image: "/images/training/11-pos-inventory.gif"
      },
      {
        heading: "Retail Operations",
        body: "Retail is the most comprehensive mode with the full menu: Inventory (stock levels & products), Sales (revenue & transactions), Customers (profiles, history & segments), Promotions (discounts, coupons & deals), Loyalty (points, rewards & tiers), Returns (refunds, exchanges & credits), Reports (sales, margins & insights), Purchase Orders (supplier orders & receiving — coming soon), Gift Cards (issue, redeem & balances — coming soon), Staff (cashiers & permissions), Branches (locations & stock by branch), Map (branch locations on map), Integrations (Xero, payments & more), and Audit (transaction & change log)."
      },
      {
        heading: "Restaurant Operations",
        body: "Restaurant mode replaces Inventory with a Menu builder — you create dishes with ingredients rather than physical stock items. Returns become Voids (cancelling table orders). The Sales view includes table numbers and covers (number of diners). Reports show average spend per cover and table turn times alongside revenue. If you run a café or food stall, Restaurant mode is designed for you — it handles the ordering flow and kitchen coordination rather than traditional retail stock management."
      },
      {
        heading: "Repair, Salon, Factory and Logistics",
        body: "Repair mode is designed for phone repair shops, electronics services, and trade businesses — it includes job management, customer quotes, and parts inventory. Salon mode adds appointment booking, staff scheduling, and service menus. Factory mode focuses on production runs, raw material inventory, and work-in-progress tracking. Logistics mode centres on parcel management, driver assignment, and route planning. If your business spans multiple modes — for example a salon that also sells retail hair products — use Retail for the product sales and Salon for services."
      }
    ],
    relatedSlugs: ["pos-inventory-management-askbiz", "pos-sales-transactions-askbiz", "pos-reports-askbiz"],
    faq: [
      { q: "Can I use two sectors at the same time?", a: "You can switch between sectors within the same POS account. Data from each sector is tracked separately, so your retail sales don't mix with restaurant covers." },
      { q: "Does my plan restrict which sectors I can use?", a: "The Starter plan includes Retail mode. Restaurant, Salon, Repair, Factory, and Logistics modes may require a higher plan — check the pricing page." },
      { q: "Can I rename the sector labels to match my business?", a: "Sector names are fixed in the current version. Custom labels are on the product roadmap." }
    ]
  },

  {
    slug: "pos-integrations-askbiz",
    title: "POS Integrations: Connecting Xero, Payments and More",
    description: "How to connect AskBiz POS to your accounting software, payment terminals, and other business tools — so your sales data flows automatically without manual entry.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["integrations", "Xero", "payments", "POS", "AskBiz", "accounting", "payment terminal", "connect"],
    keyTakeaways: [
      "Connect AskBiz POS to Xero, QuickBooks, or other accounting tools via Operations > Integrations — sales sync automatically.",
      "Payment integrations link your card terminal directly to AskBiz so card sales are recorded without manual entry.",
      "Integrations eliminate double-entry — your accountant sees live data without you exporting CSVs."
    ],
    content: [
      {
        heading: "Finding the Integrations page",
        body: "Go to POS > Operations > Retail > Integrations. This page lists all available connections for your POS: accounting platforms (Xero, QuickBooks), payment terminals (card machine integration), e-commerce platforms (to sync online and offline inventory), and delivery platforms. Each integration shows its status — connected (green), disconnected (grey), or pending setup (amber). For most businesses, the most valuable integrations to set up first are accounting (Xero or QuickBooks) and payment terminals."
      },
      {
        heading: "Connecting to Xero",
        body: "Click the Xero tile and follow the OAuth authorisation flow — you'll be redirected to Xero's login screen to authorise AskBiz access. Once connected, select how often to sync: real-time (every transaction creates a Xero entry immediately) or daily batch (all transactions from the day sync as a single journal entry at midnight). For most small businesses, daily batch is sufficient and creates a cleaner Xero history. Your chart of accounts mapping — which AskBiz sales categories map to which Xero accounts — is set during the initial setup."
      },
      {
        heading: "Connecting payment terminals",
        body: "For card payment integration, click your terminal provider's tile. AskBiz supports major terminal providers — the specific list depends on your region. Once connected, your card terminal and AskBiz communicate directly: when a cashier completes a sale in AskBiz and selects card payment, the amount is automatically sent to the terminal. The customer taps or inserts their card, and the approved payment is confirmed back to AskBiz in seconds. No more reading the terminal amount and typing it into the POS manually."
      },
      {
        heading: "Managing active integrations",
        body: "Each active integration shows a Connected status and a Last sync timestamp. If a sync fails (for example, Xero connectivity issues), the integration shows an error with a Retry button. Click any connected integration to see its detailed settings — you can pause the sync, change the sync frequency, update account mappings, or disconnect entirely. Disconnecting an integration doesn't delete historical data; it just stops future syncing. Reconnecting restores the sync from the point of disconnection."
      }
    ],
    relatedSlugs: ["pos-export-vat-askbiz", "pos-reports-askbiz", "how-to-connect-data-sources-askbiz"],
    faq: [
      { q: "What if I use QuickBooks instead of Xero?", a: "QuickBooks integration works the same way as Xero — click the QuickBooks tile in Integrations and follow the same OAuth authorisation process." },
      { q: "Does the payment terminal integration work with contactless and Apple/Google Pay?", a: "Yes — the terminal handles all payment methods including chip and PIN, contactless, Apple Pay, and Google Pay. AskBiz records the payment as 'card' regardless of the method used." },
      { q: "Can I integrate with Shopify to sync online and offline inventory?", a: "Yes. Connect Shopify via both the POS Integrations page and the Business > Connect tab. This keeps your online and offline stock counts in sync." }
    ]
  },

  {
    slug: "pos-ask-ai-about-pos-data-askbiz",
    title: "Using AskBiz AI to Query Your POS Data",
    description: "How to use AskBiz's AI chat to ask questions about your Point of Sale data — from daily sales summaries to product performance, staff analysis, and margin deep-dives.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["AI", "chat", "POS", "AskBiz", "questions", "analytics", "sales analysis", "AI chat", "business intelligence"],
    keyTakeaways: [
      "AskBiz AI can answer questions about your POS data in plain English — no SQL or spreadsheets needed.",
      "Start with specific questions like 'What were my top 5 selling products last week?' rather than vague ones.",
      "Combine POS questions with business-wide questions — for example asking how your POS margin compares to your eCommerce margin."
    ],
    content: [
      {
        heading: "Connecting POS data to the AI",
        body: "Your POS data is automatically available to AskBiz AI once you start processing sales through the till. Click the Ask tab in the top navigation. Type a question about your POS in the chat bar. AskBiz analyses your connected POS data and responds in plain English with the numbers, trends, or recommendations you asked for. The AI has access to transactions, inventory, staff performance, and all the data visible in your POS reports.",
        image: "/images/training/03-ai-chat-ask.gif"
      },
      {
        heading: "Good POS questions to start with",
        body: "Here are example questions that work well: 'What were my top 10 best-selling products last month?' — returns a ranked list with units sold and revenue. 'Which cashier processed the most sales this week?' — compares staff performance. 'What is my average transaction value this month vs last month?' — shows the trend in basket size. 'Which products are below minimum stock right now?' — surfaces your current stock alert list. 'What was my gross margin last week?' — gives you the margin percentage for the period. Start specific — vague questions like 'how is my business doing?' get broad answers."
      },
      {
        heading: "Asking about product and category performance",
        body: "AskBiz AI can break down performance by category, individual product, or time period. Try: 'Show me margin by product category for last month.' — you'll see which categories are most profitable. 'Which products have I not sold any of in the past 30 days?' — surfaces dead stock that's tying up cash. 'What is my fastest-moving product this week?' — tells you what's flying off the shelves. 'What would happen to my revenue if I increased the price of [product] by 10%?' — uses the AI Sparring Partner for scenario analysis."
      },
      {
        heading: "Combining POS with business intelligence",
        body: "The real power of AskBiz AI is connecting your POS data with other sources. If you're also connected to Shopify or Amazon, you can ask: 'Is my online or in-store margin higher?' — AskBiz compares both channels. 'Which products sell better online vs in-store?' — helps you decide where to focus stock. 'What is my total revenue across all channels this month?' — consolidates POS and eCommerce into one figure. This cross-channel view is impossible to do manually across multiple dashboards — AskBiz does it in seconds."
      }
    ],
    relatedSlugs: ["pos-overview-dashboard-askbiz", "pos-reports-askbiz", "how-to-use-askbiz-ai-chat"],
    faq: [
      { q: "Does the AI have access to real-time till data?", a: "Yes. AskBiz AI queries your live data — including transactions processed today. Ask 'What is my revenue so far today?' and it gives you the current figure." },
      { q: "Can the AI generate a report I can share with my accountant?", a: "The AI can summarise your financials in text, but for formal reports, use the Reports section or MTD VAT export. You can share those exports directly with your accountant." },
      { q: "What if the AI gives me a number that doesn't match what I see in the POS reports?", a: "The AI uses the same underlying data as the reports. Discrepancies can occur if you're asking about different time periods or branches. Clarify your question with specific dates and branch names for consistent results." }
    ]
  },

  {
    slug: "pos-end-of-day-reconciliation-askbiz",
    title: "End-of-Day Close: Cash Reconciliation and Till Counting",
    description: "A step-by-step guide to closing your till at end of day in AskBiz POS — counting cash, reconciling card totals, identifying discrepancies, and producing a closing summary for your records.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["end of day", "till close", "cash reconciliation", "cash count", "POS", "AskBiz", "discrepancy", "close till", "EOD"],
    keyTakeaways: [
      "Always count your physical cash before looking at the POS expected total — avoids anchoring bias and gives a true reconciliation.",
      "AskBiz POS shows expected cash (float + cash sales − cash refunds) so you can instantly see if you're over or under.",
      "Any discrepancy is logged in the Audit tab with the cashier's name, date, and amount — giving you a full accountability trail.",
      "The closing report (exported as CSV or viewed in Reports) gives you the day's Revenue, Cash, Card, Refunds, and Net total in one place."
    ],
    content: [
      {
        heading: "Why end-of-day reconciliation matters",
        body: "Reconciling your till at the end of every trading day is one of the most important controls in any retail or hospitality business. It catches cash discrepancies before they accumulate, deters internal theft, and gives you an accurate day's-end picture of your revenue split across cash and card. Without a daily close, small discrepancies compound — a £5 shortage every day is £1,825 a year. AskBiz POS makes the process quick: the system already knows every transaction, so reconciliation is a matter of counting your physical cash and comparing it against what the system expects."
      },
      {
        heading: "Step 1 — Count your physical cash first",
        body: "Before opening AskBiz's close-till screen, physically count the cash in the drawer. Count by denomination: £50 notes, £20 notes, £10 notes, £5 notes, £2 coins, £1 coins, and so on down to pennies. Record your count on a till-count sheet (a simple paper sheet or a note in your phone). The total is your Physical Cash Total. Counting before seeing the system's expected total is important — it prevents unconscious anchoring where you count to match a number you already know, which defeats the purpose of reconciliation."
      },
      {
        heading: "Step 2 — Open the Close Till screen in AskBiz",
        body: "In AskBiz POS, click Open till in the Overview header, then select Close till (if the till is already open and you're ending the session). Alternatively, go to Operations > Till Management > Close Session. The Close Till screen shows: Opening Float (the cash you started with), Cash Sales (total cash transactions during the session), Cash Refunds (cash returned to customers), and Expected Cash (Float + Cash Sales − Cash Refunds). This is the amount the drawer should contain. Compare this figure to your Physical Cash Total from Step 1."
      },
      {
        heading: "Step 3 — Record and explain any discrepancy",
        body: "If your Physical Cash Total matches Expected Cash exactly — great, no discrepancy. If they differ, the Close Till screen has a Discrepancy field where you enter the difference (positive if over, negative if short) and a Notes field for the reason. Common explanations include: incorrect change given to a customer, a voided sale that wasn't recorded, a petty cash payment made from the drawer, or genuine counting error. The discrepancy and your note are saved automatically to the Audit log under the cashier's name. Managers can review all discrepancies in the Audit tab without needing to be present at close."
      },
      {
        heading: "Step 4 — Set tomorrow's float and print the closing report",
        body: "After confirming the discrepancy (or zero discrepancy), AskBiz asks you to set the Opening Float for the next session — typically £50 to £200 depending on your expected cash volume the following day. Remove any cash above the float from the drawer and secure it in the safe. Then click Close Session. AskBiz generates a Closing Summary showing: total Revenue for the session, Cash total, Card total, Refunds total, Discrepancy (if any), and the next Opening Float. This summary is stored in Reports > Sessions and can be exported as a CSV. Share it with your bookkeeper or accountant as your daily record."
      },
      {
        heading: "Reviewing patterns across multiple days",
        body: "Individual day reconciliation is the control. Pattern review is the intelligence. In AskBiz Reports > Sessions, you can view all closed sessions sorted by date, cashier, or branch. If one cashier consistently has small shortages, it's worth investigating — it may be a training issue (incorrect change calculation) or something more serious. If one branch consistently has higher card-to-cash ratios than another, that may reflect the customer demographic or a cashier preference for card-only transactions. Weekly and monthly pattern reviews turn your end-of-day reconciliation from a compliance task into a genuine business insight tool."
      }
    ],
    relatedSlugs: ["pos-open-till-askbiz", "pos-reports-askbiz", "pos-audit-log-askbiz"],
    faq: [
      { q: "What if I forget to close the till before the next day?", a: "AskBiz will prompt you to close the previous session when you try to open a new one. You can still close the previous session retroactively — the transaction data is preserved accurately, though the session timestamp will show the actual close time rather than end-of-trading." },
      { q: "Can I close the till remotely as a manager without being at the POS?", a: "Managers with appropriate permissions can view session summaries and Audit log entries remotely via AskBiz. However, the physical cash count must be performed by someone at the location — the system cannot count physical cash for you." },
      { q: "How long are closing reports kept?", a: "Session closing reports are retained indefinitely in AskBiz Reports > Sessions. For HMRC purposes, you must keep records for at least six years, and AskBiz's digital records satisfy this requirement." }
    ]
  }
];
