import { AcademyArticle } from "./academy-types";

export const ASKBIZ_POS_TILL_ARTICLES: AcademyArticle[] = [
  {
    slug: "pos-payment-methods-askbiz",
    title: "Payment Methods at the AskBiz Till",
    description: "Learn which payment methods AskBiz POS supports — cash, M-Pesa mobile money, card — and how to connect payment integrations so your till accepts every way customers want to pay.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    videoUrl: "d2iPhRgygCU",
    readTime: 5,
    keywords: ["payment methods", "M-Pesa", "cash", "card payment", "mobile money", "POS", "integrations", "AskBiz"],
    keyTakeaways: [
      "AskBiz POS supports cash, M-Pesa mobile money, and card payments at the till.",
      "Connect M-Pesa via Operations > Integrations — it takes under two minutes to activate.",
      "Xero and QuickBooks integrations automatically sync every payment method to your accounts.",
      "All payment types appear separately in your Sales report so you can see exactly how customers pay."
    ],
    content: [
      {
        heading: "Which payment methods does AskBiz POS support?",
        body: "AskBiz POS accepts three core payment methods at the till: cash, card (via a connected card reader), and M-Pesa mobile money. When a cashier completes a sale they choose the method — or split across two methods — and AskBiz records each payment type separately. Every transaction flows into your Sales report with the payment method tagged, so you can analyse whether your customers prefer cash or digital payments.",
        image: "/images/training/pos-payment-methods.png",
      },
      {
        heading: "Connecting M-Pesa for mobile money payments",
        body: "To enable M-Pesa, go to Operations > Integrations. You'll see M-Pesa listed with an 'Available' badge and a 'Connect →' button. Click it, follow the authorisation steps with your Safaricom business account credentials, and M-Pesa appears as a payment option at the till immediately. Once connected, cashiers see a 'M-Pesa' button at checkout. The customer enters their phone number or scans a QR code, and the payment confirmation appears on screen before the sale is finalised."
      },
      {
        heading: "Accepting cash payments correctly",
        body: "When a cashier selects Cash at the till, AskBiz shows a change calculator — enter the amount the customer hands over and the till shows the exact change to give. All cash sales are tallied in the session total so that end-of-day cash reconciliation is accurate. If your business uses an opening float, set this at the start of each shift so that the expected cash balance is correct when you close the till."
      },
      {
        heading: "Syncing all payments to Xero or QuickBooks",
        body: "The Integrations page also lists Xero and QuickBooks, both marked Available. Connecting either one means every sale — regardless of payment method — is automatically posted to your accounting software. Cash sales, M-Pesa receipts, and card transactions are logged as separate line items so your bookkeeper sees a clean breakdown. VAT is attached to each transaction automatically, which makes your MTD VAT report one click away from the top of any POS screen."
      },
      {
        heading: "Viewing your payment method breakdown in reports",
        body: "Go to Operations > Reports > Sales report to see a full breakdown of revenue by payment method over any date range. You can filter by branch and sector, and export to CSV for your accountant. The 'Total discounts given' figure at the top of the Promotions section helps you understand if certain payment methods are more often associated with discounted sales — useful intelligence when setting promotional pricing."
      },
      {
        heading: "What to do if a payment fails",
        body: "If an M-Pesa payment times out, the till stays open and you can retry or switch to a different payment method without losing the basket. For card failures, check the reader connection and try again — the sale is never recorded until payment is confirmed. Cash payments only fail if the cashier closes the sale before tendering, which can be undone within the same session. All payment attempts are visible in the Audit trail under Operations > Reports."
      }
    ],
    relatedSlugs: ["pos-split-payment-askbiz", "pos-receipts-askbiz", "pos-open-till-askbiz"],
    faq: [
      { q: "Can I add a card reader to AskBiz?", a: "Yes — card reader support is available through integrations. Contact AskBiz support to set up your specific card terminal model." },
      { q: "Does M-Pesa work offline?", a: "M-Pesa requires an internet connection to confirm payments. In offline mode, only cash sales can be processed and will sync when connectivity returns." },
      { q: "Can I accept foreign currency?", a: "AskBiz records all sales in your base currency (KSh by default). Foreign currency exchange must be handled manually before entering the payment." }
    ]
  },

  {
    slug: "pos-apply-discount-askbiz",
    title: "Applying Discounts and Promotions at the Till",
    description: "How to apply line-level and order-level discounts at the AskBiz checkout, track every discount given across your team, and monitor promotional impact on your margins.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["discount", "promotion", "coupon", "price reduction", "POS", "till", "margin", "AskBiz"],
    keyTakeaways: [
      "Discounts can be applied at line level (one product) or order level (the whole basket) at the till.",
      "Every discounted sale is logged — view totals in Operations > Promotions & Discounts.",
      "The dashboard shows Discounted sales count, Total discounts given, and Average discount value.",
      "Discounts reduce your margin, so the Reports section shows both revenue and gross profit after discounts."
    ],
    content: [
      {
        heading: "Where to find your discount performance data",
        body: "Go to Operations > Promotions & Discounts to see a live dashboard of every discount applied across your sales. The three headline metrics are: Discounted sales (number of transactions that included a discount), Total discounts given (the KSh value taken off), and Avg discount (the typical amount discounted per sale). Discounted transactions appear here as soon as a sale is completed with a discount at the till — the screen updates in real time.",
        image: "/images/training/pos-apply-discount.png",
      },
      {
        heading: "Applying a discount at the till",
        body: "Once a cashier has added products to the basket at the till, they can tap the discount icon next to any line item to apply a line-level discount. Enter a percentage or a fixed KSh amount. For an order-level discount that applies to the whole basket, tap the Order discount button at the bottom of the basket. Both types reduce the sale total and are logged separately so you can distinguish between product-level promotions and goodwill discounts at checkout."
      },
      {
        heading: "Setting up named promotions and coupons",
        body: "For recurring promotions — a weekly 10% off deal, a buy-two-get-one, or a seasonal sale — create named promotions from the Promotions & Discounts section. Named promotions can be triggered by the cashier selecting them from a list or by scanning a coupon barcode. This keeps your discount data clean: instead of a generic percentage, the report shows exactly which promotion drove each discount, making it easy to evaluate whether a campaign was worth running."
      },
      {
        heading: "Understanding the impact on margins",
        body: "Every discount you apply reduces your Gross profit. The Reports page shows Margin % after all discounts have been applied, so you always see your true profitability. If your Avg discount is high but your sales volume hasn't increased proportionally, that's a sign the discounts are eating into margin without driving additional footfall. Use the Discounts report under Operations > Reports to see which products are most frequently discounted — these might be candidates for a permanent price adjustment instead."
      },
      {
        heading: "Controlling who can apply discounts",
        body: "Under Staff management you can set discount permissions per cashier role. A standard cashier might be limited to a maximum 10% discount, while a manager can override to any amount. This prevents unauthorised giveaways and ensures the Promotions dashboard accurately reflects intentional pricing decisions. PIN-protected overrides mean every discount above the cashier's limit requires a manager to enter their PIN — creating an automatic approval trail in the Audit log."
      },
      {
        heading: "Reviewing discount history over time",
        body: "Use the date filter at the top of the Promotions & Discounts page to compare discount activity week on week or month on month. If the Discounted sales count spikes on certain days, that may correlate with a specific cashier's shift or a particular time of day. Exporting this data via the CSV button at the top of the POS screen lets you analyse it in a spreadsheet alongside your sales data for a complete promotional ROI picture."
      }
    ],
    relatedSlugs: ["pos-payment-methods-askbiz", "pos-receipts-askbiz", "pos-metrics-explained-askbiz"],
    faq: [
      { q: "Can I set a maximum discount limit per cashier?", a: "Yes — staff permissions control the maximum discount percentage each cashier role can apply without a manager override." },
      { q: "Do discounts show on the customer's receipt?", a: "Yes — the receipt shows the original price, the discount amount, and the final price paid for full transparency." },
      { q: "Can I run a time-limited promotion automatically?", a: "Named promotions can be set with a start and end date so they activate and deactivate without manual intervention." }
    ]
  },

  {
    slug: "pos-split-payment-askbiz",
    title: "Split Payments: Taking Two Payment Methods in One Sale",
    description: "Learn how to split a single AskBiz POS transaction between cash and M-Pesa, or any two payment methods — perfect when a customer can't pay the full amount one way.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["split payment", "part payment", "cash and M-Pesa", "multiple payment", "till", "AskBiz POS"],
    keyTakeaways: [
      "AskBiz POS lets you split any sale across two payment methods in a single transaction.",
      "Common splits: part cash, part M-Pesa — useful when a customer is short on either.",
      "Both payment amounts are recorded separately in the Sales report and audit trail.",
      "Split payments are fully supported in offline mode for the cash portion."
    ],
    content: [
      {
        heading: "When split payments are useful",
        body: "Split payments solve a common till problem: a customer wants to pay KSh 1,200 but only has KSh 800 cash and the rest on M-Pesa. Rather than cancelling or asking the customer to find the exact amount, AskBiz lets you take the cash first and then complete the remainder via M-Pesa in the same transaction. The sale appears as a single receipt but both payment legs are individually logged in your accounts.",
        image: "/images/training/pos-payment-methods.png",
      },
      {
        heading: "How to split a payment at the till",
        body: "After building the basket and applying any discounts, tap the Pay button. Instead of selecting a single method, tap Split payment. Enter the first amount (e.g. KSh 800 cash) and confirm it. AskBiz deducts that amount from the total and shows the outstanding balance (KSh 400). Select the second payment method — M-Pesa — and complete the M-Pesa confirmation. Once both legs are confirmed, the sale closes and the receipt shows both payments."
      },
      {
        heading: "Which payment combinations are supported",
        body: "AskBiz supports splitting across any two of your connected payment methods: Cash + M-Pesa, Cash + Card, or M-Pesa + Card. You cannot currently split across three methods in one transaction. If a customer needs to pay across three methods, consider taking two payments as one split transaction and then processing a second small transaction for the remaining amount — both will appear on the same order if you link them through the customer's account."
      },
      {
        heading: "How split payments appear in your reports",
        body: "In the Sales report each payment method's total is calculated across all transactions, including split legs. So if five split-payment transactions each had KSh 500 cash and KSh 500 M-Pesa, your report shows KSh 2,500 in cash and KSh 2,500 in M-Pesa — the totals are never combined. This makes your end-of-day cash count accurate and your M-Pesa reconciliation with your Safaricom statement straightforward."
      },
      {
        heading: "Split payments with discounts applied",
        body: "If a discount has been applied before the split, AskBiz calculates the discounted total first and then divides the remaining balance. The cashier enters how much of the discounted total the customer is paying in cash, and AskBiz shows the exact M-Pesa amount outstanding. The Promotions dashboard records the discount against the sale, not against either payment leg, so your discount reporting is unaffected by how the customer chose to pay."
      }
    ],
    relatedSlugs: ["pos-payment-methods-askbiz", "pos-apply-discount-askbiz", "pos-receipts-askbiz"],
    faq: [
      { q: "Can I split a refund across two methods?", a: "Refunds are returned via the original payment method where possible. If a split refund is needed, process each portion separately in the Returns flow." },
      { q: "What if the M-Pesa leg of a split payment fails?", a: "The cash portion is held and the M-Pesa can be retried. The sale only completes once both legs are confirmed." },
      { q: "Is there a minimum split amount?", a: "No minimum is enforced — a customer can pay KSh 1 in cash and the rest via M-Pesa if needed." }
    ]
  },

  {
    slug: "pos-receipts-askbiz",
    title: "Receipts and Transaction Records in AskBiz POS",
    description: "How to issue printed and digital receipts at the AskBiz till, find past transactions in your audit trail, and use receipts as the starting point for refunds.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["receipt", "transaction", "audit trail", "print receipt", "digital receipt", "refund", "AskBiz POS"],
    keyTakeaways: [
      "AskBiz generates a receipt automatically for every completed sale — print or send digitally.",
      "Every receipt is stored permanently in the Audit trail under Operations > Reports.",
      "Receipts show itemised products, discounts, payment method, cashier name, and timestamp.",
      "Use a receipt to initiate a refund — look up the transaction in the audit trail to find it."
    ],
    content: [
      {
        heading: "Your receipt and transaction history at a glance",
        body: "Every completed sale in AskBiz POS generates a permanent transaction record. These records are accessible through Operations > Reports > Audit trail, which shows the full change log and transaction history. The Sales report (also under Reports) shows Revenue KSh, Gross profit, Margin, and the total Stock value — giving you the financial context around every receipt issued. The Stock value field shows the current value of all products in your inventory.",
        image: "/images/training/pos-reports.png",
      },
      {
        heading: "What information appears on a receipt",
        body: "Each AskBiz receipt includes: your business name and branch, the date and time of the transaction, an itemised list of products sold with individual prices, any discounts applied at line or order level, the subtotal, VAT amount (if applicable), the total paid, the payment method used (cash/M-Pesa/card), and the cashier's name. For split payments, both payment legs appear on the receipt. A unique transaction ID at the bottom of the receipt makes it easy to look up later."
      },
      {
        heading: "Printing a receipt at the till",
        body: "If your till is connected to a receipt printer, AskBiz automatically sends the receipt to the printer as soon as the sale completes. If the printer is offline or out of paper, you'll see an alert and can retry the print job from the last-transaction screen. Thermal printers are the most common connection — check that the AskBiz till is paired to your printer via the device settings before your first sale of the day."
      },
      {
        heading: "Sending digital receipts by SMS or WhatsApp",
        body: "When a customer profile is linked to a sale (captured via their phone number), AskBiz can send a digital receipt via SMS or WhatsApp. Tap the 'Send receipt' option after completing the payment and select the delivery method. The customer receives a concise summary with the total paid, items, and a reference number. Digital receipts are also stored against the customer's profile so you can retrieve any past receipt by looking up the customer in Operations > Customers."
      },
      {
        heading: "Finding a past transaction in the audit trail",
        body: "Go to Operations > Reports and click Audit trail. This opens the same view as the Audit tab — a full log of every event in your system. Use the Transactions filter to show only sales records, then search by cashier name, product, or date. The transaction detail shows every item, payment, and any edits made. Use this view to verify disputed sales, reconcile your cash drawer, or find the transaction ID needed to start a refund."
      },
      {
        heading: "Starting a refund from a receipt",
        body: "To process a refund, go to Operations > Returns & Exchanges. You can search by the transaction ID from the original receipt or filter by date to find the sale. Once found, tap Refund, select which items to return, and choose the refund method. AskBiz records the return and adjusts the 'Amount refunded' and 'Return rate' figures in the Returns dashboard. The refund also appears as a negative entry in your Sales report, keeping your revenue figures accurate."
      }
    ],
    relatedSlugs: ["pos-void-cancel-askbiz", "pos-payment-methods-askbiz", "pos-manual-stock-adjust-askbiz"],
    faq: [
      { q: "How long are receipts stored?", a: "Transaction records are stored indefinitely in the AskBiz audit trail — there's no expiry on historical data." },
      { q: "Can a customer request a duplicate receipt?", a: "Yes — look up the transaction in the audit trail and reprint or resend the digital receipt at any time." },
      { q: "Does AskBiz support A4 receipts for B2B sales?", a: "Standard thermal receipts are generated at the till. For formal invoices, use the Export CSV function and format in your accounting software." }
    ]
  },

  {
    slug: "pos-barcode-till-askbiz",
    title: "Scanning Barcodes at the AskBiz Till",
    description: "How to use a barcode scanner with AskBiz POS to add products to a sale instantly, assign barcodes to your inventory, and scan new stock into your system.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["barcode", "barcode scanner", "scan", "inventory", "POS", "product", "till", "AskBiz"],
    keyTakeaways: [
      "A USB or Bluetooth barcode scanner works directly with AskBiz POS — no additional setup required.",
      "Scan a barcode at the till and the product is instantly added to the basket at the correct price.",
      "Use the 'Scan to add' button in Inventory to assign barcodes to products or add new stock.",
      "Products can have multiple barcodes — useful for different pack sizes of the same item."
    ],
    content: [
      {
        heading: "Your inventory with 75 products ready to scan",
        body: "AskBiz Inventory shows all your products in one place — 75 products in this example — each with price, cost, and current stock level visible at a glance. The search bar at the top lets you find any product by name, and the filters (Low stock, Out of stock, Expiring soon) help you prioritise which items need attention. Products that have barcodes assigned can be scanned directly at the till instead of searched manually, making checkout significantly faster.",
        image: "/images/training/pos-inventory.png",
      },
      {
        heading: "Connecting a barcode scanner to AskBiz",
        body: "AskBiz POS works with any standard HID (Human Interface Device) barcode scanner — plug a USB scanner into your till device and it is recognised automatically, no drivers needed. For Bluetooth scanners, pair the device through your operating system's Bluetooth settings first. Once connected, click in the product search box at the till and scan — the barcode populates the search field and the matching product is added to the basket instantly."
      },
      {
        heading: "Assigning barcodes to products in Inventory",
        body: "Go to Operations > Inventory and click Edit next to any product. In the product detail page, find the Barcode field and enter or scan the barcode number. Save the product. From that point on, scanning the barcode at the till adds that product. If a product has multiple pack sizes — for example, a 250g bag and a 1kg bag of the same product — create separate product records for each and assign the appropriate barcode to each one."
      },
      {
        heading: "Adding new stock via 'Scan to add'",
        body: "The Inventory page has a prominent orange 'Scan to add' button at the top. Tap it to open the barcode-entry flow for adding new products or updating existing stock. Scan the product barcode — if it already exists in your catalogue, AskBiz finds it and lets you update the quantity. If it's a new product, you'll be prompted to enter the product name, price, cost, and category before saving. This makes goods-in fast: scan each item as it arrives and your stock count updates in real time."
      },
      {
        heading: "Using filters to manage your barcode catalogue",
        body: "Filter your inventory by Low stock or Out of stock to find products that need restocking and may need their barcodes verified. Products tagged with a sector (Retail, Restaurant, etc.) can be filtered by All sectors so you see your full catalogue across all business types. The STOCK column shows current levels at a glance — items with very low counts (like '1 left') should be reordered before they sell out and leave the barcode unresponsive at the till."
      },
      {
        heading: "Troubleshooting barcode scan failures",
        body: "If a barcode scan produces no result at the till, the most common causes are: the barcode is not yet assigned to a product in your catalogue, the scanner beam didn't read the code cleanly (try again at a different angle), or the product record is marked as inactive. Go to Operations > Inventory and search for the product by name. If it exists but has no barcode, add it in the Edit screen. If the product doesn't exist, use Scan to add to create it."
      }
    ],
    relatedSlugs: ["pos-product-search-askbiz", "pos-manual-stock-adjust-askbiz", "pos-quick-keys-askbiz"],
    faq: [
      { q: "Can I scan barcodes on a phone camera?", a: "AskBiz is designed for dedicated hardware scanners. Camera scanning via mobile device may work but is slower and less reliable in a busy till environment." },
      { q: "What barcode formats does AskBiz support?", a: "AskBiz supports standard EAN-13, EAN-8, UPC-A, UPC-E, and Code 128 formats — covering the vast majority of retail product barcodes." },
      { q: "Can two products share the same barcode?", a: "No — each barcode maps to one product. If two products have the same barcode, you'll need to create custom barcodes for one of them." }
    ]
  },

  {
    slug: "pos-quick-keys-askbiz",
    title: "Quick-Access Product Keys for Fast Checkout",
    description: "How to set up product quick-keys in AskBiz POS for your fastest-moving items — tap once to add to the basket without searching or scanning.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["quick keys", "product shortcuts", "fast checkout", "till", "POS", "basket", "product", "AskBiz"],
    keyTakeaways: [
      "Quick-keys are one-tap product shortcuts on the till screen for your most popular items.",
      "Set up quick-keys from your Inventory so cashiers don't need to search or scan for common products.",
      "Organise quick-keys into categories — drinks, snacks, staples — to keep checkout fast.",
      "Quick-keys use the same price and stock as the main product record — no duplicate setup needed."
    ],
    content: [
      {
        heading: "Why quick-keys matter in a busy till environment",
        body: "If your top 10 products make up 60% of your sales, having cashiers search by name or scan a barcode for each one adds seconds to every transaction. Over a day of 80+ sales those seconds add up to real queue time. Quick-keys solve this: a tap on a pre-configured button instantly adds the product at the correct price. AskBiz lets you configure as many quick-keys as your screen comfortably shows, organised into groups that match how your cashiers think about your products.",
        image: "/images/training/pos-inventory.png",
      },
      {
        heading: "Identifying your top products for quick-keys",
        body: "Go to Operations > Reports > Sales report and sort by units sold over the last 30 days. The products at the top of that list are your quick-key candidates. In the example inventory, products like Basmati Rice (stock: 25) and AJWAD Premium Biryani Rice (stock: 24) are clearly high-turnover items — these are ideal quick-keys. Aim for 8–16 quick-keys on a standard till screen; enough to cover your core range without cluttering the interface."
      },
      {
        heading: "Setting up quick-keys from your inventory",
        body: "Open Operations > Inventory and click Edit on the product you want to add as a quick-key. In the product settings, find the 'Quick key' toggle and enable it. You can optionally assign a colour and position number to control where it appears on the till's quick-key grid. Save the product. The next time a cashier opens the till, the quick-key appears on screen. No need to enter the price again — it uses whatever price is set in the product record."
      },
      {
        heading: "Organising quick-keys into categories",
        body: "The till's quick-key grid can be organised into tabs by category. For example, a grocery store might have tabs for Rice & Grains, Oils & Condiments, and Personal Care. Cashiers swipe between tabs to find the right product group. Set the category for each quick-key in the product's Edit screen under the Quick key category field. This organisation reduces the cognitive load on cashiers during busy periods and reduces the chance of ringing up the wrong product."
      },
      {
        heading: "Keeping quick-keys in sync with price changes",
        body: "Because quick-keys link directly to the product record in Inventory, any price change you make in the Inventory edit screen is reflected immediately at the till — no need to update the quick-key separately. If a product goes out of stock, it is not automatically hidden from the quick-key grid, so make a habit of reviewing your Out of stock filter in Inventory and deactivating quick-keys for items you won't be restocking soon. This prevents a cashier accidentally trying to sell a product you no longer have."
      },
      {
        heading: "Quick-keys and variable-weight products",
        body: "For products sold by weight — like loose rice or spices sold per gram — you can set a quick-key with a price-per-unit and prompt the cashier to enter a quantity at the till. The quantity field accepts decimals (e.g. 0.5 for half a kilogram). This works well when the price is fixed per unit but the amount varies by customer. The Inventory page shows these products with their per-unit price so you can verify the quick-key price is correct before busy trading periods."
      }
    ],
    relatedSlugs: ["pos-barcode-till-askbiz", "pos-product-search-askbiz", "pos-inventory-management-askbiz"],
    faq: [
      { q: "How many quick-keys can I have?", a: "AskBiz supports up to 48 quick-keys across 4 category tabs — 12 per tab on a standard till layout." },
      { q: "Can quick-keys be different per branch?", a: "Yes — each branch's till can have its own quick-key configuration, reflecting the different product ranges you carry at each location." },
      { q: "Do quick-keys work offline?", a: "Yes — quick-keys are cached locally so they remain available even when the internet connection drops." }
    ]
  },

  {
    slug: "pos-cash-float-askbiz",
    title: "Managing Your Cash Float and Drawer",
    description: "How to set an opening float, record cash movements during the day, and reconcile your cash drawer at the end of each shift using AskBiz POS.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["cash float", "cash drawer", "reconciliation", "till", "opening float", "cash management", "AskBiz POS"],
    keyTakeaways: [
      "Set an opening float when starting each till session to enable accurate end-of-day reconciliation.",
      "AskBiz calculates expected cash in the drawer automatically — float + cash sales minus cash refunds.",
      "Any shortfall or overage is flagged and logged in the Audit trail for manager review.",
      "The Reports section shows your Stock value (KSh 170,787.75 in this example) alongside daily cash metrics."
    ],
    content: [
      {
        heading: "Understanding your financial position from the Reports screen",
        body: "The Reports page in AskBiz is your financial control centre. It shows Revenue, Gross profit, Margin, and Stock value — in this account, the stock on hand is worth KSh 170,787.75. Below the headline metrics are eight report types covering every aspect of your business. For cash management, the Sales report and Audit trail are the most relevant — they show how much cash moved through the till and whether it matches your expected float calculation.",
        image: "/images/training/pos-reports.png",
      },
      {
        heading: "Setting your opening float each morning",
        body: "When a cashier clicks Open till at the start of the day, AskBiz prompts them to enter the opening float — the physical cash in the drawer before any sales. Count every note and coin and enter the total. This figure is stored against the session. If your drawer always starts with KSh 5,000, make this a standard operating procedure so that the end-of-day calculation is always based on the same baseline. A consistent float amount also makes it easier to spot unusual discrepancies."
      },
      {
        heading: "Recording cash in and cash out during the day",
        body: "Throughout a shift, cash doesn't only enter the drawer through sales. A delivery might require a cash payment out, or the manager might remove cash for banking (a 'cash drop'). Record these movements in the till's Cash management section: select Cash in or Cash out, enter the amount and a reason (e.g. 'Banking run', 'Petty cash - cleaning supplies'). These movements are deducted from or added to the expected drawer total so your reconciliation remains accurate."
      },
      {
        heading: "Running the end-of-day cash count",
        body: "When the cashier clicks Close till, AskBiz shows the session summary: Opening float, Total cash sales, Cash refunds, and any Cash in/out movements — from these it calculates the Expected cash in drawer. The cashier physically counts the notes and coins and enters the Actual cash count. AskBiz instantly shows whether there's a match, a shortage, or an overage. Any variance is flagged for the manager and recorded in the Audit trail with the cashier's name and timestamp."
      },
      {
        heading: "Investigating cash discrepancies",
        body: "If the actual cash count doesn't match the expected total, open the Audit trail (Operations > Reports > Audit trail, or via the Audit tab) and filter by the session date and cashier. Look for any transactions that were cancelled after cash was tendered, or cash movements that weren't recorded. Common causes include: change given incorrectly, a refund paid in cash that wasn't logged, or a cash-in movement forgotten during the day. Resolving these before closing gives you a clean daily record."
      },
      {
        heading: "Best practices for cash float discipline",
        body: "Keep a single consistent float amount — something between KSh 3,000 and KSh 10,000 depending on your typical transaction size. Remove excess cash to a safe during the day rather than letting the drawer fill up (this also reduces theft risk). Train cashiers to count change before handing it to customers rather than after, and to never put customer cash in the drawer before giving change. These habits eliminate the most common causes of end-of-day discrepancies."
      }
    ],
    relatedSlugs: ["pos-open-close-day-askbiz", "pos-cashier-shifts-askbiz", "pos-metrics-explained-askbiz"],
    faq: [
      { q: "What if I don't use a cash drawer?", a: "You can skip the opening float entry or set it to zero. AskBiz still tracks cash sales for reporting, but cash reconciliation prompts won't appear." },
      { q: "Can I see float history across multiple days?", a: "Yes — the Audit trail records every till session's opening float and closing count with dates and cashier names." },
      { q: "What happens if the drawer doesn't balance?", a: "The discrepancy is logged automatically. Managers can review it in the Audit trail and decide how to account for it (writeoff, investigation, etc.)." }
    ]
  },

  {
    slug: "pos-void-cancel-askbiz",
    title: "Voiding and Cancelling Sales at the Till",
    description: "How to cancel a sale in progress, void a completed transaction, and process customer refunds through the AskBiz POS Returns & Exchanges flow.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["void", "cancel sale", "refund", "return", "exchange", "POS", "till", "AskBiz"],
    keyTakeaways: [
      "Cancel a sale in progress at any point before payment is confirmed — the basket clears with no record.",
      "Void a completed transaction via Operations > Returns & Exchanges to reverse a sale and update stock.",
      "Every return is tracked: Total returns, Amount refunded, and Return rate are shown on the dashboard.",
      "All voids and refunds are permanently logged in the Audit trail with the cashier's name."
    ],
    content: [
      {
        heading: "The Returns & Exchanges dashboard",
        body: "Operations > Returns & Exchanges is your central view for all reversed transactions. The three headline metrics are: Total returns (number of transactions reversed in the period), Amount refunded (total KSh returned to customers), and Return rate (percentage of sales that were refunded). The message 'Refunds will appear here when processed via the till's refund flow' confirms that refunds must go through the correct process — not by manually adjusting stock or cash — to be properly recorded.",
        image: "/images/training/pos-void-cancel.png",
      },
      {
        heading: "Cancelling a sale before payment",
        body: "If a customer changes their mind before paying — or a cashier builds a basket incorrectly — tap the Clear or Cancel button at the till. This removes all items from the basket instantly. No transaction record is created because no payment has been taken, so there is nothing to reverse. The stock levels are not affected. The cashier can then start a fresh sale. This is different from voiding, which applies to sales that have already been completed and paid for."
      },
      {
        heading: "Voiding a completed transaction",
        body: "To void a sale that has already been paid, go to Operations > Returns & Exchanges. Find the transaction by searching the date, cashier, or product. Select it and choose Void transaction. AskBiz will ask for confirmation and, if PIN authorisation is required, prompt for the manager PIN. Once confirmed, the transaction is reversed: the revenue is subtracted from your Sales report, the stock quantities are returned to inventory, and the refund is added to the Amount refunded total."
      },
      {
        heading: "Processing a partial return or exchange",
        body: "Not every return involves the full transaction. A customer may want to return one item from a five-item sale, or exchange a product for a different variant. In the Returns & Exchanges flow, select the specific line items to return rather than the whole transaction. For exchanges, process the return of the original item first to bring it back into stock, then create a new sale for the replacement. This gives you clean inventory and revenue records for both legs."
      },
      {
        heading: "Refund payment methods",
        body: "AskBiz returns money via the same method it was received by default: cash sales get a cash refund, M-Pesa sales get an M-Pesa reversal. Managers can override this — for example, issuing a store credit instead of a cash refund. Any refund method other than the original is logged with a reason in the Audit trail, ensuring a clear record if the customer disputes the refund later. Store credit is applied to the customer's profile and can be used on their next purchase."
      },
      {
        heading: "Viewing all refund history in the Audit trail",
        body: "Every void and refund is permanently recorded in the Audit trail accessible via Operations > Reports > Audit trail. Filter by the Returns category to see only refund events. Each entry shows the cashier who processed it, the original transaction ID, the items returned, and the refund amount. This log cannot be edited or deleted — it is a tamper-proof record for accounting, dispute resolution, and staff accountability. If refund rates are higher than expected, the Audit trail is the place to investigate patterns."
      }
    ],
    relatedSlugs: ["pos-receipts-askbiz", "pos-cashier-shifts-askbiz", "pos-manual-stock-adjust-askbiz"],
    faq: [
      { q: "Can a cashier process a refund without manager approval?", a: "This depends on the permissions set for that cashier role. You can require a manager PIN for all refunds or only for amounts above a threshold." },
      { q: "Does a void update my stock automatically?", a: "Yes — when a transaction is voided, AskBiz adds the returned quantities back to the inventory count immediately." },
      { q: "How long after a sale can I process a refund?", a: "There is no system time limit on refunds in AskBiz — your own refund policy determines the customer-facing window." }
    ]
  },

  {
    slug: "pos-tax-setup-askbiz",
    title: "Setting Up Tax Rates and VAT in AskBiz POS",
    description: "How to configure VAT and tax rates across your products, generate your MTD VAT report, and sync tax data automatically to Xero or QuickBooks.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["VAT", "tax", "MTD VAT", "tax rate", "Xero", "accounting", "POS", "AskBiz"],
    keyTakeaways: [
      "Set tax rates at the product level in Inventory — AskBiz applies them automatically at checkout.",
      "The MTD VAT button at the top of any POS screen generates your month-to-date VAT report instantly.",
      "Connect Xero or QuickBooks via Integrations to auto-sync all tax data to your accounting software.",
      "Different product categories can have different tax rates — essential for mixed retail/food businesses."
    ],
    content: [
      {
        heading: "Managing tax through your Integrations panel",
        body: "AskBiz connects to leading accounting platforms to automate tax reporting. From Operations > Integrations you can connect Xero (which auto-syncs sales, refunds & tax) and QuickBooks Online (which syncs all transactions). Both integrations are listed as Available and take only a few minutes to set up. Once connected, every sale's tax element is posted to your accounting software in real time — eliminating manual VAT data entry entirely.",
        image: "/images/training/pos-payment-methods.png",
      },
      {
        heading: "Using the MTD VAT report",
        body: "The MTD VAT button appears in the top action bar on every POS screen — it stands for Month-to-Date VAT. Click it to see a breakdown of all VAT collected during the current month, itemised by product category and tax rate. You can export this report as a CSV for submission or review. If you're VAT-registered and file quarterly, use the custom date range on the main Overview to pull the exact reporting period you need before clicking MTD VAT."
      },
      {
        heading: "Setting tax rates on individual products",
        body: "In Operations > Inventory, edit any product and find the Tax rate field. Set the appropriate rate for that product — for example, 16% VAT for standard-rated goods, 0% for zero-rated food items, or a custom rate if your jurisdiction uses different bands. AskBiz applies this rate automatically at checkout so the cashier never needs to calculate tax manually. The receipt shows the tax-inclusive price and the VAT amount separately for customer transparency."
      },
      {
        heading: "Tax rates for different business sectors",
        body: "If your business spans multiple sectors — for example, a retail shop that also serves food — different products may carry different tax rates. AskBiz handles this by applying the tax rate set at product level rather than a blanket rate. A cold drink may be zero-rated while a hot prepared meal is standard-rated. Review your inventory regularly to ensure each product has the correct tax rate, especially when adding new product categories or after tax law changes."
      },
      {
        heading: "Reconciling tax in your accounting software",
        body: "Once Xero or QuickBooks is connected, open your accounting dashboard to verify that tax postings match your AskBiz sales data. Each sale appears as a separate line with the correct tax code attached. Refunds and voids appear as negative entries with the same tax code, so your net VAT position is always accurate. If you spot a discrepancy, check the Audit trail in AskBiz for the specific transaction — this gives you the exact tax amount applied per sale."
      },
      {
        heading: "Preparing for a VAT audit or inspection",
        body: "AskBiz's Audit trail provides a tamper-proof record of every transaction, payment, and stock adjustment — exactly what's needed in a VAT audit. To prepare, go to Operations > Reports > Audit trail and export the full transaction history for the period under review. The export includes transaction IDs, dates, amounts, tax rates applied, and payment methods. This evidence-grade record, combined with your Xero or QuickBooks postings, gives auditors a complete and consistent picture."
      }
    ],
    relatedSlugs: ["pos-payment-methods-askbiz", "pos-receipts-askbiz", "pos-metrics-explained-askbiz"],
    faq: [
      { q: "Can I apply tax after the fact to existing products?", a: "Yes — editing the tax rate on a product in Inventory applies it to all future sales. Historical sales retain their original tax rate as recorded at the time." },
      { q: "Does AskBiz support tax-exempt customers?", a: "You can apply a 0% discount or zero-rate specific products for specific sales, but dedicated tax-exemption profiles are managed at the accounting software level." },
      { q: "What happens if I misconfigure a tax rate?", a: "Correct the rate in the product's Inventory record and note the date. Historical transactions will retain the original rate — your accountant will need to adjust the difference manually for the affected period." }
    ]
  },

  {
    slug: "pos-multiple-tills-askbiz",
    title: "Running Multiple Tills Across Branches",
    description: "How to set up AskBiz POS across two or more locations — managing branches, assigning staff, stocking each location, and comparing performance from one dashboard.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["multiple tills", "branches", "locations", "multi-location", "POS", "AskBiz"],
    keyTakeaways: [
      "AskBiz supports multiple branches — each with its own till, staff, and stock catalogue.",
      "The Branches tab shows all locations with staff count and product count at a glance.",
      "Staff can be assigned to specific branches and can only access data for their location.",
      "The Overview dashboard lets you switch between 'All Branches' and individual locations."
    ],
    content: [
      {
        heading: "Viewing and managing your branches",
        body: "The Branches tab in AskBiz POS shows every location you've set up. In this account, there are two branches: town (the default location with 2 staff and 75 products) and Bondeni (currently 0 staff and 0 products). Each branch has its own till, its own inventory, and its own cashier accounts. The '+ Add branch' button creates a new location — you'll be asked for the branch name, address, and which sector it operates in.",
        image: "/images/training/pos-multiple-tills.png",
      },
      {
        heading: "Adding and configuring a new branch",
        body: "Click '+ Add branch' in the Branches tab. Enter the branch name (e.g. 'Bondeni'), the physical address, and select the primary business sector. Once created, the branch appears in the branch selector dropdown at the top of every POS screen. Staff accounts need to be assigned to the new branch before they can log in — go to the Staff section and click Edit on each relevant cashier to add the branch to their permitted locations."
      },
      {
        heading: "Assigning stock to each branch",
        body: "Each branch maintains its own inventory. In Operations > Inventory, use the branch filter to see stock levels at a specific location. To stock a new branch, use the CSV import function to upload a product list with opening quantities, or use the Scan to add feature to scan products into that branch directly. The branch filter also lets you spot stock imbalances — if town has 24 units of a product and Bondeni has 0, you can plan a stock transfer before the Bondeni branch runs out."
      },
      {
        heading: "Filtering dashboard data by branch",
        body: "The Branch dropdown at the top of the Overview and all Operations sections lets you toggle between All Branches and individual locations. When All Branches is selected, revenue and sales data from all locations are combined. Switching to a single branch shows only that location's data. This is the fastest way to compare performance: open the Overview for town, note the Revenue, then switch to Bondeni and compare. No exports or spreadsheets needed."
      },
      {
        heading: "Running separate tills at the same branch",
        body: "A single branch can have multiple tills operating simultaneously — for example, a supermarket might have three checkout points all running AskBiz POS. Each till is a separate session tied to a different cashier. All sessions feed into the same branch total on the dashboard. At the end of the day, each till is closed and reconciled separately, giving you a per-cashier record alongside the branch total. This setup scales well for high-volume retail without requiring separate branch accounts."
      },
      {
        heading: "Comparing branch performance over time",
        body: "Use the Reports > Sales report with the branch filter to generate side-by-side performance data for any date range. Revenue, Avg sale, and Return rate can vary significantly between branches depending on local customer behaviour and staff quality. If one branch consistently has a lower Avg sale, it may indicate that quick-keys for high-value products haven't been set up there, or that cashiers aren't upselling. Use this data to direct your training and product ranging efforts."
      }
    ],
    relatedSlugs: ["pos-branch-comparison-askbiz", "pos-cashier-shifts-askbiz", "pos-overview-dashboard-askbiz"],
    faq: [
      { q: "Is there a limit on the number of branches?", a: "Branch limits depend on your AskBiz plan. Check your current plan under account settings or contact support to discuss multi-location pricing." },
      { q: "Can a staff member work at multiple branches?", a: "Yes — assign multiple branch permissions to a staff member's account so they can log in at any of their permitted locations." },
      { q: "Does stock transfer between branches automatically?", a: "No — stock transfers are managed manually using Inventory adjustments at each branch. Automated inter-branch transfers are on the product roadmap." }
    ]
  },

  {
    slug: "pos-cashier-shifts-askbiz",
    title: "Managing Cashier Accounts and Shifts",
    description: "How to add and manage cashier accounts in AskBiz POS, set PINs, assign branch access, control permissions, and review each cashier's shift performance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["cashier", "staff", "PIN", "shift", "permissions", "accounts", "POS", "AskBiz"],
    keyTakeaways: [
      "Each cashier gets a personal account with a PIN — every sale is attributed to the correct person.",
      "Staff roles (cashier, inventory, manager) control what each person can see and do at the till.",
      "The Staff page shows last login date so you can quickly see who has been active recently.",
      "2 of 2 seats currently used — add more seats from the Staff page if your team grows."
    ],
    content: [
      {
        heading: "Your current staff setup",
        body: "The Staff page under Operations shows every cashier account on your plan. In this account: Lee cashier is set up as a cashier role at the town branch with a PIN set and last logged in 02/06/2026, and james is set up as inventory role at the town branch with a PIN set and last logged in 30/05/2026. The page shows '2 of 2 seats used' — your current plan allows two staff members. The '+ Add seats' link takes you to the upgrade flow if your team grows.",
        image: "/images/training/pos-cashier-shifts.png",
      },
      {
        heading: "Adding a new cashier account",
        body: "Click the '+ Add seats' link or contact AskBiz support to expand your plan, then use the Staff section to create the new account. Enter the cashier's name, assign a role (cashier, inventory manager, or admin), and select which branch or branches they can access. The system generates a temporary PIN which the cashier should change on first login. Each cashier's PIN is their identity at the till — it attributes every sale, refund, and discount to that person."
      },
      {
        heading: "Setting and changing PINs",
        body: "A green 'PIN set' badge next to a staff member's name confirms they have an active PIN. If a cashier forgets their PIN, click Edit on their account and reset it. The audit trail records PIN changes with a timestamp (you saw this earlier in the Audit Log: 'STAFF.PIN CHANGED - PIN changed - 31 May 11:49'). Require cashiers to use a PIN that isn't an obvious number — this prevents other staff from processing sales under the wrong account, which would distort your performance data."
      },
      {
        heading: "Understanding staff roles and permissions",
        body: "AskBiz has three main roles. The cashier role allows processing sales, applying discounts up to their limit, and closing their own till session. The inventory role adds the ability to adjust stock levels and add new products — as seen with james. The admin or manager role has full access including viewing all reports, processing refunds above the cashier limit, and editing staff accounts. Assign the minimum permissions needed for each person's job to maintain proper access controls."
      },
      {
        heading: "Reviewing cashier shift performance",
        body: "At the end of each day, go to Operations > Reports > Staff performance. This report shows each cashier's name, total sales count, total revenue, and average sale value for the selected period. Comparing these figures across your team reveals which cashiers are converting more sales and upselling effectively. If one cashier's Avg sale is significantly below the team average, this might signal a need for product knowledge training or coaching on suggesting complementary items."
      },
      {
        heading: "Deactivating a cashier who has left",
        body: "When a staff member leaves, click Deactivate on their account in the Staff page. Their account becomes inactive immediately — they can no longer log in at the till. Their historical sales data is preserved in your reports under their name, so past performance isn't lost. If you later want to reactivate the account (e.g. a seasonal worker returning), click Edit and toggle their status back to active. Deactivating rather than deleting ensures your historical data stays intact."
      }
    ],
    relatedSlugs: ["pos-open-close-day-askbiz", "pos-multiple-tills-askbiz", "pos-metrics-explained-askbiz"],
    faq: [
      { q: "Can I see what a specific cashier sold today?", a: "Yes — go to Reports > Staff performance, select Today, and click the cashier's name to see their individual transaction list." },
      { q: "What happens if two cashiers share a PIN?", a: "All sales under that PIN are attributed to one account, corrupting your per-cashier performance data. Always give each person a unique PIN." },
      { q: "Can cashiers see each other's sales data?", a: "No — a standard cashier role can only see their own session data. Managers can see all staff data in the Reports section." }
    ]
  },

  {
    slug: "pos-health-score-deep-askbiz",
    title: "Understanding Your POS Health Score",
    description: "A deep dive into the AskBiz POS Health Score — what each component measures, why it matters, and specific steps you can take to improve your score this week.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["health score", "POS health", "business health", "KPIs", "performance", "AskBiz"],
    keyTakeaways: [
      "The Health Score is a composite measure of your stock health, sales consistency, margin quality, and staff performance.",
      "Low stock alerts (48 items in this example) are a major driver of a lower health score.",
      "Improving margin and reducing return rate both contribute positively to your score.",
      "Review the Health Score daily alongside your Overview metrics to catch issues early."
    ],
    content: [
      {
        heading: "What the Health Score measures",
        body: "The AskBiz POS Health Score is a single number (0–100) that summarises the operational health of your business across four dimensions: stock health (how many items are low or out of stock), sales momentum (revenue trend vs the previous equivalent period), margin quality (gross profit margin vs your target), and operational compliance (staff logging in, tills being opened and closed correctly, and discounts staying within limits). A high score means your operation is running smoothly; a dip is an early warning to investigate.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "The stock health component",
        body: "Stock health accounts for a significant portion of the Health Score. If you have 48 items marked as Low stock (as shown in the current Overview), those 48 potential stockouts are dragging your score down. Each item that reaches zero stock — and therefore can't be sold — is a lost sale opportunity and a negative signal. To improve this component: review the Stock Alerts section daily, set reorder points for your top-selling products, and use the Low stock filter in Inventory to prioritise your restocking runs."
      },
      {
        heading: "Sales momentum: trend vs previous period",
        body: "AskBiz compares your current period's revenue to the previous equivalent period and uses this trend as a Health Score input. A sustained 'vs prev' decline — for example three consecutive days of lower revenue than the same days last week — will reduce your momentum score even if your absolute revenue is acceptable. The solution is to look at which products are selling less and whether the change is seasonal, a stock issue, or a cashier behaviour issue. The Staff performance report helps isolate people-related causes."
      },
      {
        heading: "Margin quality and the discount effect",
        body: "If your gross margin is below a healthy threshold for your sector, the Health Score reflects that. Excessive discounting is one of the most common causes of margin erosion — check the Promotions & Discounts dashboard to see your Avg discount figure. If cashiers are routinely discounting more than 10–15%, review your discount permission settings. Also check your product costs in Inventory — if costs have risen but prices haven't been updated, your margin will have silently compressed."
      },
      {
        heading: "Operational compliance factors",
        body: "The Health Score also captures operational discipline: are tills being opened at the start of each trading day? Are cashiers closing their sessions with a proper cash count? Are refunds being processed through the correct Returns flow rather than as manual adjustments? These compliance signals are visible in the Audit trail. A manager who checks the Audit log each morning catches compliance failures before they become habits and before they distort the financial reporting."
      },
      {
        heading: "A weekly routine for improving your score",
        body: "Build a five-minute morning review into your routine: open the POS Overview, check today's date and the date range filter is set correctly, note any metrics with a red 'vs prev' indicator, check the Stock Alerts for new out-of-stock items, and look at the staff list to confirm all expected cashiers are set up and active. On Mondays, compare last week's Health Score to the previous week and identify the single biggest change. Act on one thing each week and you'll see continuous improvement."
      }
    ],
    relatedSlugs: ["pos-daily-brief-askbiz", "pos-metrics-explained-askbiz", "pos-manual-stock-adjust-askbiz"],
    faq: [
      { q: "Where do I see my actual Health Score number?", a: "The Health Score appears prominently on the POS Overview when you have the AskBiz AI features enabled. Ask 'What is my health score?' in the Ask tab for a detailed breakdown." },
      { q: "How often is the Health Score updated?", a: "The score updates in real time as sales, stock adjustments, and session events are recorded throughout the day." },
      { q: "What is a good Health Score?", a: "Scores above 75 indicate a well-run operation. Scores below 50 typically point to a significant stock, margin, or operational issue that needs immediate attention." }
    ]
  },

  {
    slug: "pos-daily-brief-askbiz",
    title: "Your Daily Business Brief: Start Every Day with the Right Data",
    description: "How to use the AskBiz POS Overview as your daily briefing — reviewing key metrics, stock alerts, and staff performance before trading begins each morning.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["daily brief", "morning review", "overview", "stock alerts", "revenue", "POS dashboard", "AskBiz"],
    keyTakeaways: [
      "The POS Overview is your daily brief — open it before the till opens each morning.",
      "Check the Stock Alerts section to prevent cashiers trying to sell items that are out of stock.",
      "The 'vs prev' indicator on Revenue and Sales tells you immediately if yesterday outperformed the same day last week.",
      "Staff Performance shows which cashiers were most active yesterday — useful for managing schedules."
    ],
    content: [
      {
        heading: "Your morning dashboard view",
        body: "The AskBiz POS Overview gives you everything you need to start the day confidently. Set the date filter to Yesterday and you'll see yesterday's Revenue, Sales count, Refunds, Low stock count, Gross profit, Margin, and Avg sale — all with a 'vs prev' comparison to the same day in the previous period. The 48 low-stock alerts visible in the current view are a high-priority flag: before opening the till, review which products are affected and decide whether to restock or remove them from the quick-key grid.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "Reading the 'vs prev' indicators",
        body: "Each headline metric shows a coloured arrow and percentage next to it. A green arrow means the current period is higher than the previous; a red arrow means it's lower. The '↓ 100% vs prev' indicator means the current period has zero sales — which is expected if you're looking at Today before the till has opened. Switch to Yesterday to see meaningful comparisons. If you consistently see a red arrow on the same day of week, investigate whether that's a slow trading day or a systemic issue."
      },
      {
        heading: "Reviewing stock alerts before opening",
        body: "Scroll down on the Overview to reach the Stock Alerts section. This lists every product that is either Out of stock (in red) or running low (with a quantity remaining). Products that are Out of stock cannot be added to a sale at the till — if a cashier tries, they'll see an error. Review this list each morning and either restock the affected items, contact your supplier, or temporarily deactivate the out-of-stock products from your quick-key grid to prevent cashier frustration."
      },
      {
        heading: "Checking staff performance from yesterday",
        body: "The Staff Performance section of the Overview (scroll down from the headline KPIs) shows each cashier's sales count and revenue for the selected period. Set the filter to Yesterday to see who was most active. If a cashier logged zero sales on a day they were scheduled to work, investigate whether their till session was opened correctly or whether there's a login issue. Consistent low performance from one person may point to a training need or scheduling mismatch."
      },
      {
        heading: "The five-minute morning routine",
        body: "Build these five steps into your pre-trading routine: (1) Open the POS Overview and set to Yesterday. (2) Check Revenue and Sales vs prev — note any significant changes. (3) Scroll to Stock Alerts and identify any Out of stock items to address. (4) Check Staff Performance for any zero-sale anomalies. (5) Switch the date to Today before handing over to the first cashier, so the opening float and first transactions appear in real time. This routine takes under five minutes and keeps you ahead of problems."
      },
      {
        heading: "Using the Branch filter in your daily brief",
        body: "If you manage multiple branches, use the Branch dropdown to check each location's daily brief separately. Town branch might show 48 low-stock items while Bondeni shows zero (because it has no products assigned yet). This location-level view helps you prioritise where restocking effort is needed most today. After reviewing each branch individually, switch back to All Branches for the combined total that reflects your overall business position."
      }
    ],
    relatedSlugs: ["pos-health-score-deep-askbiz", "pos-metrics-explained-askbiz", "pos-overview-dashboard-askbiz"],
    faq: [
      { q: "Can I get the daily brief sent to me automatically?", a: "AskBiz can be asked to generate a daily summary via the Ask AI feature. Type 'Give me yesterday's sales summary' in the Ask tab each morning." },
      { q: "What time does the daily data reset?", a: "Data resets at midnight local time. The Today view starts fresh at 00:00 and Yesterday shows the previous day's full totals." },
      { q: "Can I add custom metrics to my daily brief view?", a: "The Overview is standardised. For custom metric combinations, use the Reports section and save your preferred filter settings." }
    ]
  },

  {
    slug: "pos-product-search-askbiz",
    title: "Finding Products Quickly in Your AskBiz Inventory",
    description: "How to search, filter, and locate any of your 75+ products in the AskBiz Inventory — from the till search bar to the management view with stock, price, and category filters.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["product search", "inventory", "search", "filter", "stock", "POS", "till", "AskBiz"],
    keyTakeaways: [
      "Search products by name at the till — type the first few letters and the matching item appears instantly.",
      "The Inventory management page shows all 75 products with price, cost, and stock levels in one view.",
      "Filter by Low stock, Out of stock, or Expiring soon to find products that need attention.",
      "Use the category and sector dropdowns to narrow your view to specific product groups."
    ],
    content: [
      {
        heading: "Your product catalogue at a glance",
        body: "Operations > Inventory shows all 75 products in your catalogue with four key columns: PRODUCT (name and branch tag), PRICE (selling price), COST (what you paid), and STOCK (current quantity on hand). Products appear in alphabetical order by default. At the top you have three ways to add new products: Scan to add (for barcoded items), CSV import (for bulk uploads), and + Manual (for typing in a single new product). The search bar and filter pills give you multiple ways to find exactly what you're looking for.",
        image: "/images/training/pos-inventory.png",
      },
      {
        heading: "Searching by product name at the till",
        body: "At the till interface, there's a product search field at the top of the basket screen. Start typing any part of the product name — for example, type 'rice' to find all rice products instantly. AskBiz shows matching results as you type; tap the product to add it to the basket. For products with very similar names (like multiple rice varieties), the results show price and stock level alongside the name so the cashier can pick the right one without opening each product individually."
      },
      {
        heading: "Using the Inventory search and filters",
        body: "In the Inventory management page, the search bar at the top searches across all product names simultaneously. The filter pills below — All, Low stock, Out of stock, Expiring soon — let you jump straight to problem categories. Click Low stock to see every product running close to zero; this is more useful than scrolling through all 75 products looking for low numbers. The All categories and All sectors dropdowns let you further narrow to specific groups — for example, viewing only Retail sector products."
      },
      {
        heading: "Understanding the PRICE vs COST columns",
        body: "The Inventory table shows both PRICE (what customers pay) and COST (what you pay your supplier). The difference is your gross profit per unit. For example, AJWAD Premium Biryani Rice is priced at KSh 100.00 and costs KSh 86.00 — a gross profit of KSh 14.00 per unit. If a product's cost rises and you haven't updated the price, your margin on that product is silently shrinking. Regular review of the PRICE vs COST column catches this before it affects your overall margin significantly."
      },
      {
        heading: "Acting on low-stock search results",
        body: "When the Low stock filter shows products approaching zero, you have three immediate options: reorder from the supplier (use Operations > Purchase Orders if that feature is active), manually adjust the stock level if you've already received goods that haven't been entered yet (use the Edit function and update the STOCK figure), or deactivate the product temporarily to prevent it appearing at the till. The 4 items flagged as 'have no sector tag' in the inventory notice are also worth addressing — tagging them correctly ensures they appear in the right sector reports."
      },
      {
        heading: "Searching across multiple branches",
        body: "When the Branch dropdown at the top is set to All Branches, the Inventory search shows products across your entire catalogue. Branch-specific stock levels appear in the STOCK column with the branch name as a tag below the product name — for example, 'town' appears below products stocked at the town branch. To compare stock between town and Bondeni for a specific product, search for the product name and look at the stock figures for each branch row. This helps identify inter-branch transfer opportunities."
      }
    ],
    relatedSlugs: ["pos-barcode-till-askbiz", "pos-quick-keys-askbiz", "pos-manual-stock-adjust-askbiz"],
    faq: [
      { q: "Can I search products by barcode number in the Inventory manager?", a: "Yes — enter the barcode number in the product search bar to find that specific product record." },
      { q: "Can I bulk-edit prices for multiple products at once?", a: "Use the CSV import function — export your current product list, update prices in the spreadsheet, and re-import to apply changes in bulk." },
      { q: "What does 'Expiring soon' filter show?", a: "Products with an expiry date set that falls within the next 30 days — useful for food and pharmaceutical retailers who need to monitor shelf life." }
    ]
  },

  {
    slug: "pos-customer-credit-askbiz",
    title: "Customer Accounts and Credit at the Till",
    description: "How to create customer profiles by capturing phone numbers at the till, build a customer database in AskBiz, and use customer accounts for account sales and store credit.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["customer", "customer profile", "phone number", "account sale", "credit", "CRM", "POS", "AskBiz"],
    keyTakeaways: [
      "Customer profiles are created automatically when a cashier captures a phone number at the till.",
      "Each profile tracks purchase history, lifetime value, and loyalty points.",
      "Account credit can be applied to a customer's profile for use on future purchases.",
      "The Customers dashboard shows all profiles, purchase history, and customer segments."
    ],
    content: [
      {
        heading: "Building your customer database from the till",
        body: "The Customers page in AskBiz shows all customer profiles created from your POS. Profiles are created automatically when a cashier captures a customer's phone number during a sale — the prompt appears at the payment step. Once a phone number is entered, AskBiz creates or updates the customer record with the transaction details. Over time this builds a complete purchase history per customer, visible in Operations > Customers. The page currently shows 'No customers yet' — profiles grow as cashiers capture numbers.",
        image: "/images/training/pos-customer-credit.png",
      },
      {
        heading: "Capturing a customer's number at the till",
        body: "When completing a sale, the till shows a prompt: 'Add customer number for receipt and loyalty?' The cashier can type the number directly or ask the customer to tap their phone on an NFC reader if available. Once entered, AskBiz links the transaction to that customer's profile. If the phone number already exists in the system, the customer's name and previous purchase history appear — useful for recognising regular customers and personalising service. This step is optional — if the customer declines, the sale completes normally without a profile link."
      },
      {
        heading: "What's stored in a customer profile",
        body: "Each customer profile contains: name, phone number, total spend (lifetime value), number of purchases, first and last visit dates, average spend per visit, loyalty points balance, and a full transaction history. Managers can view individual profiles by clicking on a customer name in the Customers list. This data feeds the Customer report (under Operations > Reports) which shows retention rates, top spenders, and customer segments — letting you identify who your most valuable customers are."
      },
      {
        heading: "Applying store credit to a customer account",
        body: "When a refund is processed and the manager chooses store credit instead of cash back, the credit amount is added to the customer's profile. At the next purchase, the cashier can search for the customer by phone number at the till, see the available credit, and apply it to the basket. Store credit reduces the payment required and the balance is deducted from the customer's profile automatically. The credit balance and all usage is visible in the customer's profile history."
      },
      {
        heading: "Using the Customer Loyalty dashboard",
        body: "Operations > Customer Loyalty shows: Total customers, Repeat customers, Repeat rate (%), and Avg lifetime value. These metrics tell you how good your business is at retaining customers who come back. If Repeat rate is low, consider activating a loyalty programme — AskBiz's Loyalty feature (under Operations > Loyalty) lets you award points per KSh spent and redeem them as discounts. This gives customers an incentive to give their phone number at the till, growing your database faster."
      },
      {
        heading: "Segmenting customers for targeted promotions",
        body: "The Customer report under Operations > Reports shows customer segments — groups like 'High spenders', 'At risk of lapsing', and 'New customers'. Use these segments to target promotions: send a loyalty offer to your top 20 spenders via the Email marketing integration (Mailchimp or Brevo), or create a win-back offer for customers who haven't purchased in 60 days. Each promotion you run through these segments can be tracked against the Promotions & Discounts dashboard to measure uptake."
      }
    ],
    relatedSlugs: ["pos-loyalty-program-askbiz", "pos-apply-discount-askbiz", "pos-receipts-askbiz"],
    faq: [
      { q: "Can I import existing customer data from a spreadsheet?", a: "Yes — use the Customers section's import function to upload a CSV of existing customer names and phone numbers." },
      { q: "Are customer phone numbers visible to all staff?", a: "Phone numbers are visible to admin and manager roles. Standard cashiers see the customer name but not the full number for privacy." },
      { q: "Can a customer have multiple phone numbers?", a: "Each profile is tied to one primary phone number. If a customer uses a different number, a new profile is created — merge duplicates from the Customers management view." }
    ]
  },

  {
    slug: "pos-offline-mode-askbiz",
    title: "Using AskBiz POS When the Internet Goes Down",
    description: "What happens to your AskBiz till when connectivity drops — how offline mode works, which features remain available, and how data syncs when you reconnect.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["offline mode", "no internet", "connectivity", "sync", "POS", "till", "AskBiz"],
    keyTakeaways: [
      "AskBiz POS continues processing cash sales in offline mode — your till never fully stops.",
      "M-Pesa and card payments require an internet connection and are unavailable offline.",
      "All offline transactions are queued and sync automatically when connectivity is restored.",
      "The Overview dashboard and Reports require connectivity — check the AskBiz status indicator."
    ],
    content: [
      {
        heading: "How AskBiz handles loss of connectivity",
        body: "Modern retail can't afford downtime every time the internet hiccups. AskBiz POS is built with an offline-first architecture for core functions: when connectivity drops, the till continues operating for cash sales. Products and prices are cached locally on the till device, so cashiers can search, add to basket, apply cash discounts, and complete sales without interruption. The dashboard overview shows your last-known data with a connectivity indicator showing you're working offline.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "Which features work offline",
        body: "In offline mode these features remain fully functional: product search by name, barcode scanning (for barcodes in the cached catalogue), quick-keys, cash payments, cash discounts, receipts (printed only — digital receipts queue for later delivery), and the opening/closing float process. These cover the vast majority of a typical retail transaction. Your cashiers can keep trading without knowing there's a connectivity issue at all — as long as they're taking cash."
      },
      {
        heading: "Which features require connectivity",
        body: "Features that need a live internet connection: M-Pesa payments (payment confirmation requires real-time Safaricom API access), card payments (same reason), sending digital receipts by SMS or WhatsApp, the Ask AI feature, viewing real-time dashboard updates, and syncing stock adjustments made on another device. If M-Pesa is a significant payment method for you, consider a mobile data backup connection (a phone hotspot) for the till so you can maintain digital payment capability during broadband outages."
      },
      {
        heading: "How offline transactions sync on reconnection",
        body: "When connectivity is restored, AskBiz automatically syncs all queued offline transactions to the server within seconds. Sales, stock level updates, and cashier events all upload in chronological order. Your dashboard immediately refreshes to reflect the complete picture. The Audit trail records these transactions with their actual timestamp — not the reconnection time — so your sales data is accurate even if you were offline for an hour. No manual re-entry is required."
      },
      {
        heading: "Best practices for offline resilience",
        body: "Before a busy trading day, make sure your till device has recently synced to pull the latest product catalogue and prices to its local cache. If you know a connectivity-challenged period is coming (an outdoor market, a rural pop-up), open the till while you have a connection to ensure the cache is fresh. Keep a mobile data SIM or hotspot device available as a backup. Train cashiers to communicate to customers that M-Pesa is temporarily unavailable rather than attempting a payment that will fail."
      }
    ],
    relatedSlugs: ["pos-payment-methods-askbiz", "pos-open-close-day-askbiz", "pos-daily-brief-askbiz"],
    faq: [
      { q: "How long can I operate offline before data is lost?", a: "AskBiz stores offline transactions locally on the device indefinitely until a connection is available — there is no time limit for data loss." },
      { q: "Will I see a notification when connectivity drops?", a: "Yes — the till shows a connectivity warning banner when it detects that it cannot reach the AskBiz servers." },
      { q: "Can I check my sales totals while offline?", a: "The till shows running totals for the current session. The full Overview dashboard and historical reports require connectivity." }
    ]
  },

  {
    slug: "pos-branch-comparison-askbiz",
    title: "Comparing Branch Performance with the Map View",
    description: "How to use the AskBiz POS Map tab to see geo-tagged sales across your locations, and how to compare branch performance using the branch filter across all reports.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["branch comparison", "map", "geo-tagged", "locations", "performance", "multi-branch", "AskBiz POS"],
    keyTakeaways: [
      "The Map tab shows geo-tagged sales plotted on a map — 23 sales in the last 30 days in this example.",
      "Each dot on the map represents a completed sale, giving you a visual sense of where business is concentrated.",
      "Use the Branch filter on any report to compare revenue, margin, and return rate by location.",
      "The Branches tab shows staff count and product count per branch for a quick operational health check."
    ],
    content: [
      {
        heading: "23 geo-tagged sales on the Map view",
        body: "The Map tab in AskBiz POS shows every sale that has a location attached — from customers who've agreed to share location data or from delivery sales that are geo-tagged by default. In the last 30 days, there are 23 geo-tagged sales visible on this map. Each plotted point represents a completed transaction. The map has zoom controls (+ and -) to zoom into specific neighbourhoods or zoom out for a city-level view. This is useful for understanding the geographic reach of your sales and spotting untapped areas.",
        image: "/images/training/pos-branch-comparison.png",
      },
      {
        heading: "What geo-tagging tells you about your customers",
        body: "Clusters of geo-tagged sales on the map reveal where your customers are physically located. If most of your town branch sales cluster within a 2km radius but there are scattered sales 10km away, it suggests some customers travel specifically to your store — a signal that a second branch in that distant area might capture new demand. Sparse coverage in an area might indicate a marketing opportunity: reaching customers who live nearby but don't know about you yet."
      },
      {
        heading: "Using the Branch filter for side-by-side comparison",
        body: "For a direct financial comparison between branches, switch to the Overview tab and use the Branch dropdown to toggle between locations. Note the Revenue and Margin for town, then switch to Bondeni and compare. For a more structured comparison, go to Operations > Reports > Sales report and run the same report for each branch in turn. Key metrics to compare: Revenue per day, Avg sale (which reflects upselling effectiveness), and Margin % (which shows whether pricing and costs are consistent across locations)."
      },
      {
        heading: "Identifying your strongest and weakest locations",
        body: "Once you have branch-by-branch data, rank your locations by Avg sale rather than just total revenue. A branch with lower footfall but higher Avg sale per customer is actually converting more value per transaction — this might reflect a better-trained team or a different product mix. Conversely, high footfall with low Avg sale suggests either a lot of small purchases or cashiers not suggestive-selling. These insights help you decide where to invest in staff training or product ranging."
      },
      {
        heading: "Monitoring the Bondeni branch ramp-up",
        body: "The Bondeni branch currently shows 0 staff and 0 products — it has been created but not yet stocked or staffed. Use the Branches tab to track its setup progress: add staff accounts (go to Staff > edit each cashier to add Bondeni as a permitted branch), import or scan products into Bondeni's inventory, and run the till for the first time. Once the first transactions appear, Bondeni's data will show on the Map and be selectable in the Branch dropdown across all reports, giving you a true multi-location comparison."
      }
    ],
    relatedSlugs: ["pos-multiple-tills-askbiz", "pos-metrics-explained-askbiz", "pos-daily-brief-askbiz"],
    faq: [
      { q: "Why aren't all my sales geo-tagged?", a: "Only sales where location data is available (delivery sales, or customers who've permitted location sharing) are tagged. Standard till sales without customer location data don't appear on the map." },
      { q: "Can I export the map data?", a: "Location data is included in the CSV export from the main POS Export CSV button — each row includes the branch name and, where available, the geographic coordinates." },
      { q: "How do I ensure Bondeni's inventory matches town's?", a: "Export your town inventory as CSV (Operations > Inventory > Export), then re-import it with Bondeni selected as the target branch." }
    ]
  },

  {
    slug: "pos-manual-stock-adjust-askbiz",
    title: "Making Manual Stock Adjustments in AskBiz",
    description: "How to manually update stock levels in AskBiz when goods arrive, stock is damaged, or counts don't match — and how every adjustment is recorded in the Audit Log.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["stock adjustment", "inventory", "manual stock", "audit log", "stock count", "AskBiz"],
    keyTakeaways: [
      "Every manual stock adjustment is recorded in the Audit Log with the product name, quantity change, and timestamp.",
      "Adjustments can be positive (goods received) or negative (write-off for damaged/expired stock).",
      "The Audit Log > Inventory filter shows a clear history of all stock changes — perfect for accountability.",
      "Use the Inventory page's Low stock filter to identify which products need adjusting first."
    ],
    content: [
      {
        heading: "A real audit trail of stock adjustments",
        body: "The AskBiz Audit Log keeps a permanent record of every stock change. Filtering by Inventory shows exactly what's been adjusted, when, and by how much. In this account the log shows: Shujaac Oils Cold Pressed Sesame Oil 250ml adjusted to 284 on 31 May at 21:59, and Basmati Rice adjusted multiple times on 28 May (a count of 25, then -6, then 0). These entries show both incoming stock and corrections — building an accountable, auditable inventory history.",
        image: "/images/training/pos-manual-stock-adjust.png",
      },
      {
        heading: "When to make a manual stock adjustment",
        body: "Manual adjustments are needed in four situations: (1) Goods received from a supplier that haven't been scanned in yet — add the quantity received. (2) Stock that has been damaged, expired, or stolen — subtract the quantity lost and note the reason. (3) A stock count reveals a discrepancy between the system and the physical shelf — correct to the actual count. (4) Stock transferred from one branch to another — subtract from the source branch and add to the destination. Each of these creates an Audit Log entry."
      },
      {
        heading: "How to make a stock adjustment",
        body: "Go to Operations > Inventory. Find the product using the search bar or by scrolling the list. Click Edit on the product row. In the Edit screen, locate the Stock count field and enter the new quantity — either the corrected absolute number or an adjustment amount, depending on your AskBiz version. Add a reason in the notes field (e.g. 'Goods received 28/05', 'Spoilage write-off', 'Stocktake correction'). Save the product. The change is recorded immediately in the Audit Log with your name and timestamp."
      },
      {
        heading: "Using the Scan to add flow for goods received",
        body: "For receiving a delivery of multiple products, the Scan to add button in Inventory is faster than editing each product individually. Tap Scan to add, then scan each product's barcode as you unpack the delivery. AskBiz identifies the product and asks how many units you're receiving — enter the quantity and it adds to the existing stock count automatically. Each scan creates an Audit Log entry. This approach is faster, reduces typing errors, and ensures every item is accounted for as it enters your warehouse or storeroom."
      },
      {
        heading: "Investigating discrepancies with the Audit Log",
        body: "If your physical stock count doesn't match AskBiz at the end of a month, the Audit Log is the tool to investigate. Filter by Inventory and set the date range to the month in question. You'll see every adjustment made — including who made it and when. Compare the adjustments against your supplier delivery notes and sales data. A negative adjustment by an unexpected staff member at an unusual time is a potential theft signal. The log cannot be edited or deleted, providing an accurate and tamper-proof investigation trail."
      },
      {
        heading: "Keeping the 4 untagged items organised",
        body: "The Inventory page shows a notice: '4 items have no sector tag — they appear in every sector's badge count.' These untagged products are showing up across all sectors because they haven't been assigned to a specific business type. Click Edit on each of these products and assign the correct sector (Retail, Restaurant, etc.). This ensures they're counted correctly in sector-specific reports and reduces the Low stock badge count showing inflated numbers by including items from all sectors in the 48 low-stock total."
      }
    ],
    relatedSlugs: ["pos-product-search-askbiz", "pos-barcode-till-askbiz", "pos-void-cancel-askbiz"],
    faq: [
      { q: "Can I undo a stock adjustment?", a: "You can't delete an Audit Log entry, but you can make a correcting adjustment in the opposite direction — which also appears in the log for transparency." },
      { q: "Who can make stock adjustments?", a: "Staff with the inventory or admin role. Standard cashier accounts cannot make stock adjustments — this prevents manipulation of stock counts." },
      { q: "Is there a bulk stock adjustment tool?", a: "Yes — use the CSV import in Inventory to upload a spreadsheet of products and new stock quantities for bulk stocktake corrections." }
    ]
  },

  {
    slug: "pos-open-close-day-askbiz",
    title: "Opening and Closing Your Till Each Day",
    description: "The complete daily checklist for AskBiz POS — from logging in with a cashier PIN and setting a float, to reconciling cash and reviewing the day's performance at close.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["open till", "close till", "daily routine", "cashier", "float", "reconciliation", "POS", "AskBiz"],
    keyTakeaways: [
      "Each till session starts with a cashier PIN login and opening float entry.",
      "AskBiz tracks every transaction during the session and calculates expected cash at close.",
      "Closing correctly ensures accurate daily reports and a clean audit trail.",
      "Staff with 'PIN set' status (visible in the Staff page) are ready to open the till immediately."
    ],
    content: [
      {
        heading: "Who's ready to open the till today",
        body: "Before the first till session of the day, check the Staff page under Operations to confirm all your cashiers have 'PIN set' status. In this account, Lee cashier (last login 02/06/2026) and james (last login 30/05/2026) both show 'PIN set' — meaning they can log in to the till immediately. If a cashier's PIN isn't set, click Edit on their account and assign one before they start their shift. A cashier without a PIN cannot open a till session and cannot process sales.",
        image: "/images/training/pos-cashier-shifts.png",
      },
      {
        heading: "Step 1 — Morning check before opening",
        body: "Before clicking Open till, run a five-minute morning check: (1) View the Overview with Yesterday selected to see how the previous day closed. (2) Check the Stock Alerts section for any out-of-stock items — remove these from quick-keys if needed. (3) Confirm the Branch filter is set to the correct location if you manage multiple branches. (4) Verify your receipt printer is connected and has paper. Only then hand the till over to the first cashier of the day."
      },
      {
        heading: "Step 2 — Opening the till session",
        body: "Click the orange 'Open till' button at the top of any POS screen. The cashier enters their personal PIN — this links all subsequent transactions to their account. AskBiz then prompts for the opening float: count the cash in the drawer and enter the exact total. Once confirmed, the till is live and ready for sales. If your branch has multiple tills, each till opens as a separate session — each cashier opens their own session with their own PIN and their own float."
      },
      {
        heading: "Step 3 — During the day",
        body: "Cashiers process sales normally — searching or scanning products, applying any discounts, and completing payment by cash, M-Pesa, or card. For cash management during the day, record any cash drops (removing excess cash for banking) or petty cash payments through the till's Cash in/Cash out function. If a customer needs a refund, process it through the Returns flow rather than giving cash directly — this keeps the session's expected cash total accurate."
      },
      {
        heading: "Step 4 — Closing the till at end of shift",
        body: "When the cashier's shift ends, click Close till. AskBiz shows the session summary: total cash sales, total M-Pesa, total card, opening float, and expected cash in drawer. The cashier counts the physical cash and enters the actual count. If the actual matches the expected, the session closes cleanly. If there's a variance, it's flagged for the manager. Both outcomes are recorded in the Audit trail. The cashier cannot manipulate this count — the expected figure is calculated by AskBiz based on the session's transactions."
      },
      {
        heading: "Step 5 — End of day manager review",
        body: "After all cashiers have closed their tills, the manager reviews the day's performance on the POS Overview with Today selected. Revenue, Sales count, Gross profit, and Margin tell you whether it was a good day. Check the Staff Performance section to see each cashier's contribution. If any variances were flagged at till close, investigate them in the Audit trail now — memories are freshest immediately after the shift. Finish by switching to Yesterday tomorrow morning and the cycle begins again."
      }
    ],
    relatedSlugs: ["pos-cashier-shifts-askbiz", "pos-cash-float-askbiz", "pos-daily-brief-askbiz"],
    faq: [
      { q: "Can I reopen a closed till session?", a: "No — once a session is closed it is finalised. If a late transaction needs to be added, open a new session and process it there, noting in the audit that it relates to the previous day." },
      { q: "What if a cashier forgets to close their till?", a: "The session remains open until explicitly closed. Managers can close another cashier's session from the admin view if needed." },
      { q: "Does AskBiz automatically close the till at midnight?", a: "No — sessions must be manually closed. This is intentional, as some businesses trade past midnight and should not have their session interrupted." }
    ]
  },

  {
    slug: "pos-metrics-explained-askbiz",
    title: "Every POS Metric in AskBiz Explained",
    description: "A plain-language guide to every number in your AskBiz POS dashboard — Revenue, Gross Profit, Margin, Avg Sale, Return Rate, Stock Value, and more — so you know exactly what each one means.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: ["metrics", "KPIs", "revenue", "gross profit", "margin", "avg sale", "return rate", "stock value", "AskBiz POS"],
    keyTakeaways: [
      "Revenue is total income; Gross Profit is what's left after cost of goods; Margin is Gross Profit as a percentage of Revenue.",
      "Avg Sale (average basket size) is one of the most actionable metrics — small increases compound quickly.",
      "Return Rate tells you what proportion of sales are being reversed — a rising rate needs investigation.",
      "Stock Value (KSh 170,787.75 in this example) is the total cost of all products currently on hand."
    ],
    content: [
      {
        heading: "The seven headline metrics on your Overview",
        body: "The AskBiz POS Overview shows seven numbers at a glance. Understanding what each one means — and what drives it up or down — is the foundation of running your business by data rather than instinct. The metrics are: Revenue, Sales count, Refunds, Low stock, Gross profit, Margin, and Avg sale. Each has a 'vs prev' change indicator showing whether it has improved or declined compared to the previous equivalent period. The Overview also shows Stock value in the Reports section — currently KSh 170,787.75 representing the total cost of all on-hand inventory.",
        image: "/images/training/pos-metrics-explained.png",
      },
      {
        heading: "Revenue: your total income",
        body: "Revenue (also called Turnover or Sales value) is the total amount customers paid you during the selected period — before any deductions. It includes all payment methods: cash, M-Pesa, and card. It does not subtract cost of goods, wages, rent, or any other expense. Revenue is your top line. It's important, but it doesn't tell you how profitable you are — a business with high revenue but thin margins can still lose money. Always look at Revenue alongside Gross profit and Margin for a complete picture."
      },
      {
        heading: "Gross Profit and Margin: your true profitability",
        body: "Gross Profit is Revenue minus the cost of goods sold (COGS). If you sold Basmati Rice for KSh 250 and it cost you KSh 148, your gross profit on that item is KSh 102. Across all products sold in a period, AskBiz sums these differences to give you total Gross profit. Margin % is Gross profit divided by Revenue, expressed as a percentage. A 40% margin means 40 cents of every shilling earned is kept after paying for the goods. Higher is better. If your margin is falling, check whether product costs have risen or discounts are being over-applied."
      },
      {
        heading: "Sales count, Refunds, and Return Rate",
        body: "Sales is the number of completed transactions in the period — not the revenue value, just the count. Each transaction counts as one Sale regardless of basket size. Refunds is the count of transactions reversed. Return Rate (shown in the Returns & Exchanges dashboard) is Refunds divided by Sales, expressed as a percentage — 0.0% means no sales were returned. A rising Return Rate can indicate product quality issues, customer expectation mismatches, or cashier errors at checkout that are leading to wrong items being rung up."
      },
      {
        heading: "Average Sale: the metric you can improve fastest",
        body: "Avg Sale is Revenue divided by the number of Sales — the typical amount a customer spends per visit. This is one of the most actionable metrics in retail because small improvements compound fast: if you serve 80 customers a day and raise Avg sale from KSh 1,200 to KSh 1,350, that's an extra KSh 12,000 per day without finding a single new customer. Strategies to raise Avg sale include: training cashiers to suggest complementary products, setting quick-keys for bundled items, and placing high-margin products near the checkout."
      },
      {
        heading: "Low Stock count and Stock Value",
        body: "Low stock shows how many products are at or below their minimum threshold — 48 in the current Overview. Each of these represents a potential lost sale if not restocked. Stock Value (KSh 170,787.75) is the total purchase cost of all products currently in your inventory across all branches. This is the capital tied up in your stock — too high means cash is locked up in slow-moving products; too low means you risk stockouts. Regularly comparing Stock Value to Revenue gives you a stock-turn view: how many times per month you're selling and replacing your inventory."
      },
      {
        heading: "Reports: the full suite of metric detail",
        body: "The Reports section (Operations > Reports) expands every headline metric into detailed sub-reports: Sales report (revenue by product, category, staff, and period), Inventory report (stock levels and valuation), Staff performance (sales per cashier and shift totals), Returns report (return rates and reasons), Customer report (retention and lifetime value), Loyalty report (repeat rate and top spenders), Discounts report (promotions usage), and Audit trail (full change and transaction history). Together these eight reports give you complete visibility of every aspect of your POS operation."
      }
    ],
    relatedSlugs: ["pos-daily-brief-askbiz", "pos-health-score-deep-askbiz", "pos-overview-dashboard-askbiz"],
    faq: [
      { q: "What's the difference between Revenue and Gross Profit?", a: "Revenue is total income from customers. Gross Profit subtracts the cost of buying the goods — it's what you actually keep before other expenses." },
      { q: "How do I improve my Avg Sale?", a: "Train cashiers to suggest one add-on per sale, set quick-keys for high-value complementary products, and bundle related items at a slight discount." },
      { q: "Why does my Stock Value seem high?", a: "High Stock Value relative to sales suggests slow-moving inventory. Use the Inventory report to identify products that haven't sold in 30 days and consider marking them down or returning them to your supplier." }
    ]
  }
];
