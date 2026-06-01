import { AcademyArticle } from "./academy-types";

export const ASKBIZ_POS_RETAIL_ARTICLES: AcademyArticle[] = [
  {
    slug: "retail-product-catalogue-askbiz",
    title: "Building Your Product Catalogue in AskBiz POS",
    description: "A complete walkthrough for adding products to AskBiz POS — setting names, SKUs, barcodes, cost prices, selling prices, and stock quantities from scratch.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: ["product catalogue", "add product", "SKU", "barcode", "retail", "POS", "AskBiz", "inventory setup"],
    keyTakeaways: [
      "Every product needs a Name, Selling Price, and at least one unit of measure before it can be sold at the till.",
      "Adding a cost price unlocks gross margin tracking — without it the POS cannot calculate profit.",
      "Barcodes link physical products to the system so cashiers can scan rather than search."
    ],
    content: [
      {
        heading: "Getting to the product catalogue",
        body: "From the top navigation, go to POS > Operations > Retail > Products. This is the master list of every item your business sells. New installations show an empty list with an Add Product button in the top-right corner. Existing businesses with products already loaded will see their catalogue here, searchable by name, SKU, or barcode.",
        image: "/images/training/pos-retail-inventory.png"
      },
      {
        heading: "Adding a new product — basic details",
        body: "Click Add Product. The form has several sections. Start with the basics: Product Name (what appears on receipts and the till screen), Category (which department or product group this belongs to), and Unit (the selling unit — Each, Kg, Litre, Box, etc.). The unit tells the till how to count this item: Each means one discrete item per scan; Kg means the cashier enters a weight; Box might contain multiple units. Choose carefully — you can't easily change the unit after stock has been recorded against a product."
      },
      {
        heading: "Setting prices and cost",
        body: "Enter the Selling Price (the price your customers pay, inclusive of VAT if applicable). Then enter the Cost Price — what you paid your supplier for one unit. The margin percentage is calculated automatically: (Selling Price − Cost Price) ÷ Selling Price × 100. If you leave Cost Price blank, AskBiz cannot calculate profit or margin for this product. Set the VAT rate from the dropdown: Standard (20%), Reduced (5%), or Zero Rated. Most retail goods are standard-rated; food, children's clothing, and books are common zero or reduced-rate categories."
      },
      {
        heading: "Adding a barcode or SKU",
        body: "The SKU (Stock Keeping Unit) is your internal product code — it can be whatever format you use. The Barcode field accepts EAN-13, EAN-8, Code 128, and QR codes. Scan your product's barcode using a USB or Bluetooth barcode scanner while the Barcode field is active and it populates automatically. If the product doesn't have a printed barcode, you can generate one: click Generate Barcode and AskBiz creates a unique code you can print and attach. Multiple barcodes per product are supported — useful if the same product is sold in different pack sizes."
      },
      {
        heading: "Setting opening stock quantity",
        body: "In the Stock section, enter your Current Stock (the quantity you have right now). If you're setting up a new business, count your physical stock and enter that number. If you're migrating from another system, use the figure from your last stock count. Also set the Minimum Stock Level — the threshold that triggers a low-stock alert in the POS Overview. A common rule of thumb is to set the minimum at roughly two weeks' worth of sales, giving you time to reorder before running out."
      },
      {
        heading: "Saving and verifying",
        body: "Click Save Product. The product now appears in your catalogue and is immediately available at the till. Test it by going to Open till, searching for the product name, and confirming it appears with the correct price. Also scan the barcode if you added one — it should locate the product instantly. Any changes to price or stock can be made by clicking the product row in the catalogue and editing the relevant field."
      }
    ],
    relatedSlugs: ["retail-product-variants-askbiz", "retail-categories-askbiz", "retail-bulk-import-products-askbiz"],
    faq: [
      { q: "Can I add a product image?", a: "Yes — there's an image upload field on the product form. Images appear on the till screen, making it easier for cashiers to confirm they've selected the right item." },
      { q: "What's the difference between SKU and barcode?", a: "The SKU is your internal reference code — you create it. The barcode is a scannable code, often printed on the product by the manufacturer. A product can have both, or just one." },
      { q: "Can I set different prices for different customer types?", a: "Yes — use Price Lists (Operations > Retail > Price Lists) to set wholesale, trade, or member prices that override the standard selling price for specific customers." }
    ]
  },

  {
    slug: "retail-product-variants-askbiz",
    title: "Managing Product Variants: Sizes, Colours and Packs",
    description: "How to set up product variants in AskBiz POS — creating size and colour options, managing individual variant stock levels, and handling variant-level pricing.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["product variants", "sizes", "colours", "SKU", "retail", "POS", "AskBiz", "options"],
    keyTakeaways: [
      "Variants let one parent product have multiple options (e.g. T-shirt in Small, Medium, Large) each with their own stock count.",
      "Each variant can have a different price — useful for size premiums or different pack sizes.",
      "Stock is tracked per variant — the till won't let you sell a size that's out of stock even if other sizes are available."
    ],
    content: [
      {
        heading: "What are variants and when do you need them?",
        body: "A variant is a specific version of a product that differs in one or more attributes — typically size, colour, flavour, or pack quantity. Without variants, you'd need to create a separate product entry for every combination: 'Blue T-shirt Small', 'Blue T-shirt Medium', 'Blue T-shirt Large', 'Red T-shirt Small', and so on. With variants, you create one parent product ('T-shirt') and define its options. Stock is tracked separately per variant so you always know exactly how many of each size and colour you have.",
        image: "/images/training/pos-retail-inventory-list.png"
      },
      {
        heading: "Creating a variant group",
        body: "Open a product in the catalogue (Operations > Retail > Products > click a product). Scroll to the Variants section and click Add Variant Group. Give the group a name — typically the attribute being varied, such as 'Size' or 'Colour'. Then add the options within that group: Small, Medium, Large, XL for a size group; Red, Blue, Green for a colour group. Click Add Another Option to keep adding. You can have multiple variant groups on one product — for example both Size and Colour, which generates a grid of all combinations."
      },
      {
        heading: "Setting stock and prices per variant",
        body: "Once you've created the variant groups, AskBiz generates a variant grid — every combination of options as a row. For a T-shirt with 3 sizes and 3 colours, that's 9 rows. For each row, enter: Stock quantity (how many you currently have), Cost price (if it varies by variant), and Selling price (if variants are priced differently — e.g. XL costs £2 more). Variants you don't stock can be toggled inactive so they don't appear at the till. Each variant gets its own barcode field — scan individual barcodes for each SKU if your supplier provides them."
      },
      {
        heading: "Selling variants at the till",
        body: "When a cashier searches for or scans a variant product at the till, a variant picker appears before the item is added to the basket. The picker shows available options (e.g. Size: S, M, L, XL) with out-of-stock variants greyed out and unselectable. The cashier selects the customer's choice and the correct variant — with its price and stock — is added to the sale. The stock for that specific variant is decremented on completion of the sale."
      },
      {
        heading: "Reporting on variants",
        body: "In POS Reports, sales data is broken down to variant level. You can see that you sold 12 units of the Small Blue T-shirt and 3 units of the Large Red T-shirt in the same period. This granularity is essential for buying decisions — if XL consistently sells out while Small accumulates dead stock, your next purchase order should weight towards XL. The Stock Alerts section in the POS Overview also alerts per variant, so you'll know exactly which size is low, not just that 'T-shirts' are low."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "retail-categories-askbiz", "pos-inventory-management-askbiz"],
    faq: [
      { q: "Can I have a variant that's a different product entirely, not just an option?", a: "Variants are for the same product in different configurations. If the items are genuinely different products with different names or purposes, create them as separate catalogue entries." },
      { q: "How many variant options can one product have?", a: "There's no hard limit in AskBiz, but practicality matters. A product with 5 sizes × 8 colours generates 40 variants — manageable. A product with 10 attributes would become unwieldy to manage." },
      { q: "Can I bulk-upload variants via CSV?", a: "Yes — use the CSV import feature (Operations > Retail > Products > Import) with the variant columns included in your template." }
    ]
  },

  {
    slug: "retail-categories-askbiz",
    title: "Organising Products with Categories",
    description: "How to create and manage product categories in AskBiz POS — grouping your catalogue for faster till navigation, better reports, and cleaner inventory management.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["categories", "product groups", "retail", "POS", "AskBiz", "catalogue organisation", "departments"],
    keyTakeaways: [
      "Categories group products so cashiers can browse by department rather than scrolling through every item.",
      "Sales reports break down by category, showing which departments generate the most revenue and margin.",
      "A clean category structure makes stock takes faster — you can count one category at a time."
    ],
    content: [
      {
        heading: "Why categories matter",
        body: "Without categories, your product catalogue is one flat list. For a business with 50 products that's manageable; for one with 500 products it becomes a serious usability problem at the till. Categories solve this by grouping related products — Beverages, Snacks, Clothing, Electronics, or whatever fits your business. They also unlock category-level reporting: instead of scrolling through every individual product's performance, you can see at a glance that your Clothing department generated 42% of revenue last month.",
        image: "/images/training/pos-retail-menu.png"
      },
      {
        heading: "Creating a category",
        body: "Go to POS > Operations > Retail > Categories. Click Add Category. Enter a Name (e.g. 'Beverages', 'Clothing', 'Fresh Produce'). Optionally add a colour — this colour appears as the category tile background on the till screen, making it visually distinct. You can also upload a small icon or image. Click Save. The category is now available to assign to products."
      },
      {
        heading: "Assigning products to categories",
        body: "Open any product in Operations > Retail > Products. In the Category dropdown, select the appropriate category. Save the product. You can change a product's category at any time without affecting its sales history. For bulk reassignment — for example if you want to move all drinks from a 'General' category to a new 'Beverages' category — use the CSV export, update the category column in the spreadsheet, and reimport."
      },
      {
        heading: "Sub-categories",
        body: "AskBiz supports one level of sub-categories. For example, the parent category 'Clothing' could have sub-categories 'Men's', 'Women's', and 'Children's'. Create sub-categories the same way as top-level ones, then assign a Parent Category in the form. On the till screen, tapping a parent category expands to show its sub-categories. In reports, you can view totals at the parent or sub-category level."
      },
      {
        heading: "Category performance in reports",
        body: "In POS Reports, select the Category breakdown view. You'll see Revenue, Units Sold, Gross Profit, and Margin % per category for any date range. This is one of the most useful retail metrics: if your Beverages margin is 65% but your Clothing margin is 18%, that insight should influence your buying decisions, floor layout, and promotional strategy. Categories with declining sales trends may need refreshing; categories with high margin and growing sales deserve more shelf space."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "pos-reports-askbiz", "retail-stock-take-askbiz"],
    faq: [
      { q: "What happens to sales data if I delete a category?", a: "Historical sales data is preserved. The products previously in that category will show as 'Uncategorised' in reports going forward until you reassign them to a new category." },
      { q: "Can I have a product in multiple categories?", a: "Each product belongs to one primary category. For reporting and filtering purposes, if you need multi-category grouping, consider using tags or custom fields instead." },
      { q: "How many categories should I have?", a: "Enough to be meaningful, few enough to be usable. For most retail businesses, 5–15 categories is the sweet spot. More than 20 categories starts to make the till navigation cumbersome." }
    ]
  },

  {
    slug: "retail-suppliers-askbiz",
    title: "Adding and Managing Suppliers",
    description: "How to set up suppliers in AskBiz POS — adding contact details, linking suppliers to products, and using supplier data to streamline reordering.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["suppliers", "vendors", "purchase orders", "retail", "POS", "AskBiz", "reordering"],
    keyTakeaways: [
      "Suppliers are the source records for all purchase orders — you must create a supplier before you can raise a PO to them.",
      "Linking products to a preferred supplier lets AskBiz suggest the right supplier when stock falls low.",
      "Supplier lead times recorded in AskBiz inform smarter minimum stock level calculations."
    ],
    content: [
      {
        heading: "Finding the Suppliers section",
        body: "Go to POS > Operations > Retail > Suppliers. This page lists all your current suppliers. For a new account, it's empty. Click Add Supplier to create your first one.",
        image: "/images/training/pos-retail-purchase-orders.png"
      },
      {
        heading: "Creating a supplier record",
        body: "Fill in the supplier's Company Name, Contact Name, Email, Phone Number, and Address. The Payment Terms field (e.g. 'Net 30', 'COD', '7 days') documents what terms you've agreed — this is for your reference and for any purchase order documents generated by AskBiz. Add your Account Number with that supplier if you have one; it appears on purchase orders so the supplier can identify you quickly. Click Save."
      },
      {
        heading: "Linking products to a supplier",
        body: "Open any product in Operations > Retail > Products and find the Supplier field. Select the supplier from the dropdown. You can also enter a Supplier SKU — the code your supplier uses for this product (which may differ from your internal SKU). When you raise a purchase order for this supplier, AskBiz pre-fills the order with your linked products and uses the supplier's SKU on the order document. A product can have multiple linked suppliers if you source it from more than one place — mark one as the Preferred Supplier."
      },
      {
        heading: "Supplier lead times",
        body: "On the supplier record, there's a Lead Time field (in days). This is the number of days between raising a purchase order and stock arriving. If your beverages supplier takes 5 working days to deliver and you typically sell 20 units per day, you need to reorder when you have at least 100 units remaining (5 days × 20 units). Recording the lead time accurately allows AskBiz to factor it into low-stock alert recommendations — rather than alerting when you're at zero, it alerts when you're at lead-time × daily sales rate."
      },
      {
        heading: "Viewing supplier history",
        body: "On any supplier's record page, click the Purchase Orders tab to see all previous orders placed with that supplier — including amounts, dates, and statuses (pending, received, partially received). This is useful for tracking spending by supplier, identifying your most and least relied-upon sources, and reviewing if delivery times match the stated lead time. Over time, this data supports better negotiation — if you've spent £50,000 with a supplier in the past year, that's a conversation starter for better pricing."
      }
    ],
    relatedSlugs: ["retail-purchase-orders-askbiz", "retail-product-catalogue-askbiz", "pos-inventory-management-askbiz"],
    faq: [
      { q: "Can I import a supplier list via CSV?", a: "Yes — use the Import function on the Suppliers page to bulk-upload from a spreadsheet." },
      { q: "What if I buy from a marketplace (like Alibaba) rather than a fixed supplier?", a: "Create a supplier record for the marketplace or for each seller you regularly buy from. This keeps your purchase history organised even if the 'supplier' is not a traditional company." },
      { q: "Can I set a default currency for an international supplier?", a: "Yes — the supplier record has a Currency field. Purchase orders to that supplier are generated in that currency, which is useful for reconciling against your bank statements." }
    ]
  },

  {
    slug: "retail-purchase-orders-askbiz",
    title: "Creating and Managing Purchase Orders",
    description: "Step-by-step guide to raising purchase orders in AskBiz POS — adding items, setting quantities, sending to suppliers, and marking deliveries as received to update stock.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["purchase orders", "PO", "reordering", "stock", "retail", "POS", "AskBiz", "suppliers"],
    keyTakeaways: [
      "A purchase order in AskBiz updates your stock automatically when you mark it as received — no manual stock adjustment needed.",
      "You can send the PO directly to your supplier as a PDF from within AskBiz.",
      "Partial deliveries are supported — mark only the items that arrived and the PO stays open for the remainder."
    ],
    content: [
      {
        heading: "Starting a purchase order",
        body: "Go to POS > Operations > Retail > Purchase Orders. Click New Purchase Order. Select the Supplier from the dropdown — this pulls in the supplier's contact details and payment terms automatically. Set the Expected Delivery Date (useful for planning and for flagging overdue orders). Add an optional Reference number (e.g. your internal PO number or the supplier's quote number) and any Notes for the supplier.",
        image: "/images/training/pos-retail-purchase-orders.png"
      },
      {
        heading: "Adding items to the order",
        body: "Click Add Item and search for products from your catalogue. For each item, enter the quantity you're ordering and confirm the cost price — AskBiz pre-fills this from the product record but you can override it if the supplier has given you a different price for this order. The order total updates as you add lines. If you link products to suppliers (see the Suppliers article), AskBiz suggests low-stock items from that supplier automatically when you create a PO, saving you from manually checking what needs reordering."
      },
      {
        heading: "Sending the order to your supplier",
        body: "Once you're satisfied with the order, click Send to Supplier. AskBiz generates a professional PDF purchase order document with your business details, the supplier's details, all line items with quantities and prices, and the total. You can review the PDF before sending. Click Send and AskBiz emails it directly to the supplier's email address on their record. The PO status changes from Draft to Sent. Alternatively, download the PDF and send it yourself if you prefer."
      },
      {
        heading: "Receiving stock against the purchase order",
        body: "When your delivery arrives, go to the purchase order and click Receive Stock. A receiving screen shows each line item. Enter the quantity actually received — if the supplier sent 48 units but you ordered 50, enter 48. Click Confirm Receipt. AskBiz immediately adds the received quantities to your live stock counts. The PO status changes to Received (if fully delivered) or Partially Received (if some items are outstanding). Partially received POs stay open so you can receive the remaining items when they arrive."
      },
      {
        heading: "Monitoring outstanding orders",
        body: "The Purchase Orders list shows all POs with their status at a glance: Draft, Sent, Partially Received, Received, or Cancelled. Filter by status to see what's currently in transit. If a delivery is late, click the PO and check the Expected Delivery Date — orders past their expected date are highlighted. You can contact the supplier directly from the PO page using their stored contact details. For businesses with multiple branches, each branch's POs are filtered by the Branch dropdown at the top."
      }
    ],
    relatedSlugs: ["retail-suppliers-askbiz", "pos-inventory-management-askbiz", "retail-minimum-stock-levels-askbiz"],
    faq: [
      { q: "Can I cancel a purchase order after sending it?", a: "Yes — click Cancel on the PO. This doesn't automatically notify the supplier; you'll need to contact them separately if they've already begun processing the order." },
      { q: "What if I receive goods without a purchase order?", a: "You can do a stock adjustment (Operations > Retail > Stock Adjustments) to add the received quantities. However, for accountability and margin tracking, it's better practice to always create a PO first." },
      { q: "Can I duplicate a regular order so I don't have to rebuild it each time?", a: "Yes — click Duplicate on any existing PO to create an identical new draft. Edit quantities or prices as needed and send." }
    ]
  },

  {
    slug: "retail-stock-take-askbiz",
    title: "Running a Stock Take in AskBiz POS",
    description: "How to conduct a full or partial stock count in AskBiz POS — preparing for the count, entering quantities, reconciling discrepancies, and updating your live stock records.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["stock take", "stock count", "inventory count", "stocktake", "retail", "POS", "AskBiz", "reconciliation"],
    keyTakeaways: [
      "A stock take compares your physical count to what AskBiz expects — discrepancies reveal shrinkage, theft, or data entry errors.",
      "Partial stock takes by category let you count one department at a time without shutting the whole store.",
      "After confirmation, AskBiz automatically adjusts stock to match your physical count and logs the adjustment."
    ],
    content: [
      {
        heading: "When to run a stock take",
        body: "Most retailers run a full stock take monthly or quarterly. Some run category-by-category counts on a rolling basis — counting Beverages this week, Snacks next week, so every category is counted once a month without needing to close the store for a full count. Run an unplanned stock take if you suspect theft, after a major delivery, or when stock discrepancies keep appearing in the POS alerts. The key principle: count often enough that discrepancies are caught while they're small.",
        image: "/images/training/pos-retail-inventory.png"
      },
      {
        heading: "Creating a new stock take",
        body: "Go to POS > Operations > Retail > Stock Take. Click New Stock Take. Choose the scope: Full (all products in all categories) or by Category (select one or more categories to count). If you're counting a single branch, select it in the Branch dropdown. Set a Count Date — typically today's date or the date you'll physically count. AskBiz generates a count sheet listing every product in scope with columns: Product Name, SKU, System Quantity (what AskBiz thinks you have), and Counted Quantity (blank — to be filled in)."
      },
      {
        heading: "Conducting the physical count",
        body: "Either print the count sheet or use the AskBiz mobile app to count directly on a device. Go through each product physically and enter the counted quantity. For variant products, count per variant (per size and colour). Use a barcode scanner to scan items directly into the count sheet — scanning a product highlights its row automatically. If you find a product not on the list (perhaps a new product not yet in the system), note it separately and add it to the catalogue after the count."
      },
      {
        heading: "Reviewing discrepancies",
        body: "Once all quantities are entered, click Review. AskBiz shows a discrepancy report: every product where your counted quantity differs from the system quantity. A negative discrepancy (you have less than the system expects) indicates shrinkage — possibly theft, damage, or an unrecorded sale. A positive discrepancy (you have more than expected) usually indicates a receiving error or a sale that wasn't recorded. Review large discrepancies carefully before confirming — it's worth double-counting items with significant differences."
      },
      {
        heading: "Confirming and updating stock",
        body: "When you're satisfied the count is accurate, click Confirm Stock Take. AskBiz updates every product's stock level to your counted quantity. The adjustment is logged in the Audit trail with the date, the user who confirmed it, and the before/after quantities for every item. The stock take is then locked and cannot be edited. Going forward, your live stock counts reflect the physical reality you just verified. Schedule your next stock take before leaving."
      }
    ],
    relatedSlugs: ["retail-wastage-writeoffs-askbiz", "pos-inventory-management-askbiz", "pos-audit-log-askbiz"],
    faq: [
      { q: "Should I pause sales during a stock take?", a: "For a full store count, pausing sales gives the most accurate result. For rolling category counts, you can count categories when they're not being actively sold — for example counting your storeroom stock early in the morning before trading starts." },
      { q: "What if a member of staff enters the wrong number?", a: "You can edit counted quantities at any point before clicking Confirm. After confirmation, you'd need to do a manual stock adjustment to correct the error." },
      { q: "Can I export the stock take results?", a: "Yes — click Export on any completed stock take to download a CSV showing all products, system quantities, counted quantities, and discrepancies." }
    ]
  },

  {
    slug: "retail-price-lists-askbiz",
    title: "Setting Up Price Lists for Trade and Wholesale Customers",
    description: "How to create and assign price lists in AskBiz POS — setting wholesale, trade, or VIP prices that override standard retail prices for specific customers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["price lists", "wholesale", "trade pricing", "VIP", "retail", "POS", "AskBiz", "customer pricing"],
    keyTakeaways: [
      "Price lists let you offer different prices to different customer types without changing your standard retail price.",
      "Assign a price list to a customer record and it applies automatically every time that customer makes a purchase.",
      "Price lists can be percentage-based (e.g. 15% off all products) or product-specific (set a fixed price per item)."
    ],
    content: [
      {
        heading: "What price lists are for",
        body: "Most retailers sell at one price to everyone. But many businesses have tiered pricing: a standard retail price for walk-in customers, a trade price for business customers who buy regularly, and a wholesale price for bulk buyers. Price lists in AskBiz let you define these tiers. Assign a price list to a customer and every time that customer is selected at the till, their prices override the standard ones automatically. No manual discounting needed — and no risk of a cashier forgetting to apply the agreed discount.",
        image: "/images/training/pos-retail-inventory-list.png"
      },
      {
        heading: "Creating a price list",
        body: "Go to POS > Operations > Retail > Price Lists. Click New Price List. Give it a name — 'Trade', 'Wholesale', 'VIP Member', or whatever suits your tiers. Choose the pricing method: Percentage Discount (e.g. 15% off all standard prices) or Fixed Prices (set a specific price per product). Percentage discount is simpler to maintain — when you raise standard prices, the percentage automatically applies to the new price. Fixed prices give more control but require manual updates when costs change."
      },
      {
        heading: "Adding products to a fixed price list",
        body: "If you chose Fixed Prices, click Add Products and search for the items you want to include. For each product, enter the price this customer type pays. You don't need to include every product — products not listed in the price list fall back to the standard retail price. This is useful if most of your products are sold at standard prices but a handful (e.g. bulk items or own-brand products) have agreed trade rates."
      },
      {
        heading: "Assigning a price list to a customer",
        body: "Go to Operations > Retail > Customers and open a customer record. Find the Price List dropdown and select the appropriate list. Save. From now on, when a cashier selects this customer during a sale (by searching the customer's name or loyalty card), AskBiz applies the assigned price list automatically. The till shows the adjusted prices before the cashier completes the transaction, so both cashier and customer can see the correct amounts."
      },
      {
        heading: "Reviewing price list performance",
        body: "In POS Reports, you can filter sales by customer and see what margin you're achieving on trade customers vs standard customers. If your wholesale price list is eroding margin below target, you can adjust it. Open the price list and update the percentage or fixed prices — changes take effect immediately on the next transaction. For businesses where wholesale pricing is a meaningful part of revenue, reviewing price list margin monthly is a good discipline."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "pos-customers-askbiz", "pos-promotions-askbiz"],
    faq: [
      { q: "Can one customer have multiple price lists?", a: "Each customer is assigned one price list. If you need more complex pricing (e.g. different discounts on different product categories for the same customer), use the Fixed Prices method and set category-specific prices within one list." },
      { q: "Does the price list affect the VAT calculation?", a: "The price list changes the net selling price, and VAT is calculated on top at the assigned rate. The price list does not change the tax treatment of a product." },
      { q: "Can I set an expiry date on a price list?", a: "You can deactivate a price list at any time, which removes it from all customers it was assigned to. There's no automatic expiry date feature; you'd need to deactivate it manually when the agreed term ends." }
    ]
  },

  {
    slug: "retail-stock-transfers-askbiz",
    title: "Transferring Stock Between Branches",
    description: "How to create and process stock transfers in AskBiz POS — moving inventory from one branch to another, tracking transfer status, and updating both branches' stock counts automatically.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["stock transfer", "branch transfer", "inter-branch", "inventory", "retail", "POS", "AskBiz", "multi-branch"],
    keyTakeaways: [
      "Stock transfers move inventory between branches without creating a sale or purchase — stock is reduced at the sending branch and increased at the receiving branch.",
      "Both branches can see the transfer status in real time — the receiving branch knows what's coming before it arrives.",
      "Transfers are logged in the Audit trail with the sending user, receiving branch, and product quantities."
    ],
    content: [
      {
        heading: "When to use stock transfers",
        body: "Multi-branch businesses often have uneven stock distribution. Branch A might have 80 units of a product it's barely selling, while Branch B has run out of the same product. Rather than placing a new purchase order, a stock transfer moves the surplus from A to B. Transfers also handle planned resupply: a central warehouse sends weekly replenishments to retail branches. In AskBiz, every transfer is a tracked transaction — stock doesn't just appear or disappear, it moves with an audit trail.",
        image: "/images/training/pos-retail-operations.png"
      },
      {
        heading: "Creating a transfer request",
        body: "Go to POS > Operations > Retail > Stock Transfers. Click New Transfer. Select the Source Branch (where stock is coming from) and Destination Branch (where it's going). Set the Transfer Date. Add products to the transfer by searching the catalogue — for each product, enter the quantity being transferred. AskBiz checks that the source branch has sufficient stock and flags a warning if you're trying to transfer more than is available. Save the transfer as a draft or submit it immediately."
      },
      {
        heading: "Approving and dispatching",
        body: "Submitted transfers require approval from the source branch manager (if approvals are enabled in your settings). The source branch sees the pending transfer in their transfer queue. They review the quantities, adjust if necessary, and click Dispatch — this marks the stock as 'in transit', reducing it from the source branch's stock count. Both branches now see the transfer with a status of In Transit. The physical goods are loaded and sent."
      },
      {
        heading: "Receiving the transfer",
        body: "When the goods arrive at the destination branch, a manager or staff member opens the transfer in AskBiz and clicks Receive. A receiving screen lists each item and quantity. The receiver counts the physical goods and enters what actually arrived. If everything matches, confirm receipt — stock is added to the destination branch immediately. If some items are missing or damaged, mark the discrepancy and confirm the received quantities only. The transfer remains partially open until fully resolved."
      },
      {
        heading: "Viewing transfer history",
        body: "The Stock Transfers list shows all transfers with their status, date, source, destination, and total items. Filter by branch, date range, or status. Use this view to identify which branches regularly run short (they're the net receivers) and which tend to accumulate surplus stock (net senders). This pattern data informs better purchasing decisions — rather than buying equal quantities for all branches, you can weight purchases towards the branches with higher throughput."
      }
    ],
    relatedSlugs: ["pos-branches-management-askbiz", "pos-inventory-management-askbiz", "retail-purchase-orders-askbiz"],
    faq: [
      { q: "Does a stock transfer affect the profit and loss of either branch?", a: "No — a transfer is not a sale or purchase. It's a movement of assets between branches. The cost of the transferred goods remains in the business. P&L impact only occurs when the goods are eventually sold." },
      { q: "Can I transfer stock between branches in different countries?", a: "Yes, though cross-border transfers may have VAT and customs implications depending on the countries involved. AskBiz records the transfer; tax treatment is your responsibility to manage in line with local regulations." },
      { q: "What if the driver loses some stock in transit?", a: "Record the actual received quantity at the destination. The discrepancy between dispatched and received quantities is logged. Investigate and resolve with the driver or carrier. If stock is genuinely lost, a write-off or wastage entry may be needed." }
    ]
  },

  {
    slug: "retail-wastage-writeoffs-askbiz",
    title: "Recording Wastage and Stock Write-Offs",
    description: "How to record damaged, expired, or lost stock as wastage in AskBiz POS — keeping your inventory accurate without creating phantom sales or inflated stock counts.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["wastage", "write-off", "damaged stock", "expired", "shrinkage", "retail", "POS", "AskBiz", "inventory"],
    keyTakeaways: [
      "Write-offs reduce your stock count without creating a sale — the product is consumed but not revenue-generating.",
      "Recording wastage accurately is essential for true margin calculation: unrecorded waste inflates your apparent margin.",
      "All write-offs are logged in the Audit trail with the reason, quantity, and the user who recorded them."
    ],
    content: [
      {
        heading: "What counts as wastage",
        body: "Wastage covers any stock that leaves the business without generating revenue: food that expires before it's sold, products damaged in transit or on the shelf, items used for staff meals or sampling, goods lost to shoplifting, or inventory destroyed in an incident. If you don't record wastage, your stock count stays artificially high — AskBiz thinks you have 50 units when in reality you have 38 because 12 were damaged. This discrepancy compounds over time and makes your stock take comparisons meaningless.",
        image: "/images/training/pos-retail-inventory.png"
      },
      {
        heading: "Recording a write-off",
        body: "Go to POS > Operations > Retail > Wastage (or Stock Adjustments in some configurations). Click New Write-Off. Select the product from your catalogue. Enter the quantity being written off. Choose a Reason from the dropdown: Expired, Damaged, Theft, Staff Use, Sample, or Other. If Other, add a note explaining what happened. Select the Branch where the wastage occurred. Click Confirm. The quantity is immediately deducted from the branch's stock count."
      },
      {
        heading: "The cost of wastage",
        body: "AskBiz records the cost value of each write-off: quantity × cost price of the product. Over time, the Wastage Report shows your total wastage cost by product, category, reason, and date range. For food and beverage businesses, a wastage percentage of 1–5% of revenue is often considered normal; above that warrants investigation. For retail, even small amounts of regular waste — a few units of an expensive product per week — can materially erode margin. Seeing the cost in pounds rather than just units makes the problem tangible."
      },
      {
        heading: "Wastage vs. stock adjustments",
        body: "A write-off is a type of stock adjustment specifically for losses. AskBiz also supports positive stock adjustments — adding stock without a purchase order, for example when you receive a supplier credit or find miscounted goods. Go to Stock Adjustments and choose + (increase) or − (decrease). A write-off is a − adjustment with a formal reason attached. Use the Write-Off form for genuine losses to keep reporting clean; use the generic Adjustment form only for corrections to counting errors."
      },
      {
        heading: "Reviewing wastage patterns",
        body: "In POS Reports, open the Wastage section. Filter by date, branch, or category. Look for products with consistently high wastage — these might need smaller order quantities, shorter shelf lives accounted for in your ordering frequency, or different storage conditions. Products with high wastage and low margin are the most damaging to your business. Products that regularly expire before being sold are a clear sign you're over-ordering and need to revise your purchase order quantities."
      }
    ],
    relatedSlugs: ["retail-stock-take-askbiz", "pos-inventory-management-askbiz", "pos-reports-askbiz"],
    faq: [
      { q: "Does recording wastage affect my VAT?", a: "For VAT purposes, goods destroyed or disposed of may or may not require a VAT adjustment depending on whether input VAT was reclaimed on purchase. Consult your accountant for the correct treatment in your situation." },
      { q: "What if I don't know how much was stolen?", a: "Use your stock take discrepancies as the basis. If your count shows 10 fewer units than AskBiz expected, and you haven't had any other recorded losses, those 10 units are your estimated shrinkage. Write them off as Theft." },
      { q: "Can a cashier record wastage, or only managers?", a: "By default, wastage recording requires manager-level access. You can adjust role permissions in the Staff settings if you want to allow other roles to record it." }
    ]
  },

  {
    slug: "retail-barcode-scanning-askbiz",
    title: "Setting Up Barcode Scanning at Your Till",
    description: "How to configure and use barcode scanning in AskBiz POS — connecting a scanner, assigning barcodes to products, and speeding up the checkout process.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["barcode scanning", "scanner", "barcode", "checkout", "till", "retail", "POS", "AskBiz"],
    keyTakeaways: [
      "Any USB or Bluetooth HID barcode scanner works with AskBiz POS without additional drivers.",
      "Products must have a barcode assigned in the catalogue before scanning will find them.",
      "The till can also generate and print barcodes for products that don't have manufacturer-printed codes."
    ],
    content: [
      {
        heading: "Compatible scanners",
        body: "AskBiz POS works with any USB or Bluetooth barcode scanner that uses HID (Human Interface Device) mode — which covers the vast majority of retail scanners. The scanner acts like a keyboard: when it reads a barcode, it types the code into the active field. No drivers or special software are required. Plug in a USB scanner and it works immediately. For Bluetooth scanners, pair with the device running AskBiz the same way you'd pair any Bluetooth accessory. Supported barcode formats include EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, and QR codes.",
        image: "/images/training/pos-retail-inventory-list.png"
      },
      {
        heading: "Assigning barcodes to products",
        body: "Go to Operations > Retail > Products and open a product. Scroll to the Barcode field. Either type the barcode number manually or click the field and scan the product's physical barcode — the scanner populates the field instantly. Click Save. Repeat for every product. For products without a printed barcode (e.g. loose items, own-brand products), click Generate Barcode. AskBiz creates a unique Code 128 barcode that you can print on a label and stick to the product or shelf."
      },
      {
        heading: "Scanning at the till",
        body: "Open the till (POS > Open till). The product search bar is active by default. Scan a product barcode and AskBiz instantly finds and adds it to the current transaction. Scan the same barcode again to add another unit, or use the quantity field to type a number before scanning. If a barcode isn't found, the till shows a 'Product not found' message — this means the product either doesn't exist in the catalogue or doesn't have that barcode assigned. Check the product record and add the barcode."
      },
      {
        heading: "Scanning for stock takes and receiving",
        body: "Barcode scanning isn't just for the till. During a stock take, use the scanner to scan items one by one — AskBiz increments the count for each scan. During purchase order receiving, scan inbound items to confirm receipt rather than manually entering quantities. This speeds up the receiving process significantly and reduces data entry errors. Make sure the scanning field (Counted Quantity or Received Quantity) is active before scanning, otherwise the scan will go to the wrong field."
      },
      {
        heading: "Troubleshooting",
        body: "If scanning adds items to a search bar rather than the product list, the wrong field is active — click directly on the product search area in the till. If scanning produces garbled characters, the scanner's output format may not match your keyboard locale — check the scanner's manual for locale settings and adjust to match your device's keyboard layout (typically UK English). If a scan works intermittently, check the scanner's battery level or USB connection."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "retail-stock-take-askbiz", "pos-sales-transactions-askbiz"],
    faq: [
      { q: "Can I use my phone camera as a barcode scanner?", a: "The AskBiz mobile app supports camera-based scanning. Tap the camera icon in the till screen to activate it. It's slower than a dedicated scanner but works well for low-volume situations." },
      { q: "What if the same barcode is on two different products?", a: "This shouldn't happen with manufacturer barcodes — each EAN is unique globally. But if it does occur (e.g. during data import), the first product found will be selected. Clean your catalogue to ensure each barcode is assigned to only one product." },
      { q: "Can I scan directly into a purchase order?", a: "Yes — when adding items to a purchase order, the product search field accepts barcode input. Scan the product and it's added to the order." }
    ]
  },

  {
    slug: "retail-minimum-stock-levels-askbiz",
    title: "Setting Minimum Stock Levels and Reorder Points",
    description: "How to configure minimum stock levels in AskBiz POS — triggering low-stock alerts at the right time to prevent stockouts before they cost you sales.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["minimum stock", "reorder point", "low stock", "alerts", "retail", "POS", "AskBiz", "inventory"],
    keyTakeaways: [
      "The minimum stock level is the threshold below which AskBiz triggers a low-stock alert — set it at lead time × daily sales rate.",
      "Setting minimums too low means you'll stock out before the alert is useful; too high means constant alerts that lose their meaning.",
      "Minimum levels should be reviewed quarterly as your sales velocity changes."
    ],
    content: [
      {
        heading: "What minimum stock level means",
        body: "The minimum stock level (also called the reorder point) is the quantity at which AskBiz flags a product as low stock. When your on-hand quantity drops to or below this number, the product appears in the Stock Alerts section of the POS Overview with a count of remaining units. This is your signal to reorder. The right minimum level gives you enough time to place and receive a new order before you completely run out.",
        image: "/images/training/pos-retail-low-stock.png"
      },
      {
        heading: "Calculating the right minimum",
        body: "A practical formula: Minimum Stock = (Average Daily Sales × Supplier Lead Time in Days) + Safety Buffer. For example: if you sell 15 units per day and your supplier takes 5 days to deliver, you need 75 units (15 × 5) as your reorder point. Add a safety buffer of 20–30% to cover demand spikes or delivery delays: 75 × 1.25 = 94 units. Round to 90 and set that as your minimum. If you stock out, the minimum was too low. If you always have large quantities on hand when you reorder, the minimum was too high."
      },
      {
        heading: "Setting the minimum in AskBiz",
        body: "Open any product in Operations > Retail > Products. Find the Minimum Stock field. Enter your calculated minimum. Click Save. You can also set a Maximum Stock level — the target quantity to order up to. The difference between current stock and the maximum is the suggested order quantity. Setting both gives you a complete reorder trigger: 'when stock hits X, order enough to reach Y.'"
      },
      {
        heading: "Reviewing and acting on stock alerts",
        body: "Stock alerts appear on the POS Overview dashboard — the count shows how many products are at or below their minimum. Click the alert count to see the full list. Each row shows the product name, current stock, and minimum level. From this view you can go directly to the product or navigate to Purchase Orders to raise a reorder. For businesses using the Suppliers feature, AskBiz can pre-populate a purchase order with all low-stock items from a specific supplier — a major time-saver for weekly ordering."
      },
      {
        heading: "Keeping minimums up to date",
        body: "Sales velocity changes seasonally. If your summer best-seller becomes slow in winter, your minimum should drop too — otherwise you'll be reordering too frequently and tying up cash in excess stock. Review your minimums at the start of each season or whenever you run your quarterly stock take. Compare your current daily sales rate (from POS Reports > Products) to the rate you used when you last set the minimum, and adjust accordingly."
      }
    ],
    relatedSlugs: ["retail-purchase-orders-askbiz", "pos-stock-alerts-askbiz", "pos-inventory-management-askbiz"],
    faq: [
      { q: "Does AskBiz automatically create a purchase order when stock hits the minimum?", a: "Not automatically — AskBiz alerts you and you create the order. Fully automated reordering is a feature on the roadmap. For now, the alert is your prompt to act." },
      { q: "Can I set different minimum levels for the same product in different branches?", a: "Yes — minimum stock levels are set per product per branch. A high-footfall branch might need a minimum of 100 units while a smaller branch needs only 20." },
      { q: "What if a product's minimum stock is zero?", a: "Setting zero means you'll never get an alert for that product until it's completely out of stock. This is appropriate for products you don't actively manage stock for, but risky for anything you sell regularly." }
    ]
  },

  {
    slug: "retail-bulk-import-products-askbiz",
    title: "Bulk Importing Products via CSV",
    description: "How to upload your entire product catalogue to AskBiz POS using a CSV file — preparing the template, mapping columns, handling errors, and verifying the import.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["bulk import", "CSV", "product import", "catalogue upload", "retail", "POS", "AskBiz", "spreadsheet"],
    keyTakeaways: [
      "Bulk import is the fastest way to load an existing catalogue — entering 500 products one by one would take hours; a CSV upload takes minutes.",
      "Download AskBiz's CSV template first — don't create your own structure or the import will fail.",
      "Required columns are Name and Price; all others are optional but recommended for a complete setup."
    ],
    content: [
      {
        heading: "When bulk import makes sense",
        body: "If you're setting up AskBiz for the first time and already have your products in another system — a spreadsheet, an old POS, an accountancy package — bulk CSV import is far faster than adding products one by one. It's also useful for loading seasonal catalogue additions (e.g. 50 new Christmas products), updating prices across many items at once, or migrating from a competitor POS. For ongoing single-product additions, the manual form is usually quicker than creating a CSV.",
        image: "/images/training/pos-retail-inventory.png"
      },
      {
        heading: "Downloading the CSV template",
        body: "Go to POS > Operations > Retail > Products and click Import > Download Template. This gives you an AskBiz-formatted CSV with the exact column headers the system expects. The key columns are: Name (required), Category, SKU, Barcode, Cost Price, Selling Price, VAT Rate, Minimum Stock, Current Stock, Unit, and Supplier. Do not rename or reorder the columns — AskBiz maps data by column header, not by position."
      },
      {
        heading: "Filling in the template",
        body: "Open the CSV in Excel or Google Sheets. Add one product per row. For columns with specific allowed values (like VAT Rate: 'Standard', 'Reduced', or 'Zero'), use exactly those terms — not '20%' or 'VAT'. For Category, use the exact name of an existing category in your AskBiz account. If you enter a category name that doesn't exist, AskBiz creates it automatically — useful, but leads to duplicate categories if you're inconsistent with capitalisation or spacing. Set Current Stock to your opening inventory count. Leave Barcode blank for products without one."
      },
      {
        heading: "Uploading and reviewing",
        body: "Click Import > Upload CSV and select your file. AskBiz validates the file before importing. The validation screen shows: total rows found, rows with errors (highlighted red with the error description), and rows that will be skipped (duplicates by SKU). Common errors include: missing required fields, invalid VAT rate values, and SKUs that already exist in the catalogue. Fix errors in your spreadsheet and re-upload — you can re-upload as many times as needed before confirming the import."
      },
      {
        heading: "Confirming and verifying the import",
        body: "Once validation passes with zero errors (or with acceptable skipped rows), click Confirm Import. AskBiz processes each row and adds the products to your catalogue. After completion, a summary shows how many products were added and how many were skipped. Browse to Operations > Retail > Products and spot-check 5–10 random products to confirm prices, categories, and stock quantities imported correctly. Test 2–3 barcodes at the till to confirm scanning works. If anything is wrong, you can edit individual products or reimport with corrections — reimporting with the same SKU updates the existing product rather than creating a duplicate."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "retail-categories-askbiz", "retail-suppliers-askbiz"],
    faq: [
      { q: "Can I update existing product prices via CSV?", a: "Yes — include the SKU column in your import CSV. When AskBiz finds a matching SKU, it updates the existing product rather than creating a new one. This makes bulk price updates straightforward." },
      { q: "What's the maximum number of rows in one import?", a: "AskBiz handles up to 5,000 rows per import file. For larger catalogues, split into multiple files of 5,000 or fewer rows each." },
      { q: "Can I import product images via CSV?", a: "Images cannot be imported via CSV — they must be uploaded per product in the product form. However, you can add an Image URL column pointing to publicly accessible image URLs, and AskBiz will fetch and import those images." }
    ]
  },

  {
    slug: "retail-product-pricing-margins-askbiz",
    title: "Monitoring and Improving Product Margins",
    description: "How to use AskBiz POS to track gross margin per product, identify underperforming items, and make data-driven pricing decisions to improve profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["margin", "gross profit", "pricing", "cost price", "profitability", "retail", "POS", "AskBiz"],
    keyTakeaways: [
      "Gross margin = (Selling Price − Cost Price) ÷ Selling Price × 100. Every product should have a cost price set to enable this calculation.",
      "The Products report in AskBiz shows margin per product — sort by margin % to find your most and least profitable items.",
      "Increasing price is not the only way to improve margin — reducing cost through supplier negotiation or removing low-margin products achieves the same result."
    ],
    content: [
      {
        heading: "Why margin matters more than revenue",
        body: "A product that generates £10,000 in revenue but costs £9,500 to produce is almost worthless — you've tied up cash and effort for a 5% margin. A product that generates £2,000 in revenue but only costs £400 to produce gives you a 80% margin and £1,600 of gross profit. Revenue is vanity; margin is the real measure of a product's contribution to your business. AskBiz's product margin tracking makes these calculations automatic — but only if every product has a cost price set.",
        image: "/images/training/pos-retail-reports.png"
      },
      {
        heading: "Setting and maintaining cost prices",
        body: "The cost price is what you paid your supplier for one unit (excluding any costs you can't attribute per unit, like rent). Go to Operations > Retail > Products and open any product. Enter the Cost Price. If your supplier raises prices, update the cost price immediately — leaving an outdated cost price in the system means your margin data is wrong. For products with variable costs (e.g. produce priced by market rate), review monthly. You can update cost prices in bulk via CSV export/import."
      },
      {
        heading: "Viewing margin per product",
        body: "Go to POS Reports > Products. Select a date range. The table shows each product with: Units Sold, Revenue, Cost of Goods Sold (COGS), Gross Profit, and Margin %. Click the Margin % column header to sort. Your highest-margin products appear at the top; lowest at the bottom. Products with a 0% or blank margin have no cost price set — add it. Products with negative margin are being sold below cost — investigate immediately and either raise the price or stop selling at that rate."
      },
      {
        heading: "Identifying margin problems",
        body: "Three patterns to watch for in the margin report: 1) Products with high revenue but low margin — these seem important but aren't contributing much profit; consider raising prices or renegotiating with the supplier. 2) Products with high margin but low revenue — these are underappreciated; consider giving them more prominence or better placement. 3) Products where margin has declined compared to last period — this usually means your cost increased (supplier price rise) but your selling price didn't adjust to compensate."
      },
      {
        heading: "Taking action on margin data",
        body: "When you identify a product with unacceptable margin, you have three options: raise the selling price, reduce the cost price (negotiate with your supplier or find a cheaper alternative), or discontinue the product. Raising price is the fastest option but risks losing customers. For commodity products where price sensitivity is high, supplier negotiation is better. For products that are genuinely unprofitable and not driving footfall, discontinuation frees up shelf space and cash for better-performing lines. Set a target minimum margin for your business — say 30% — and flag any product that falls below it for review."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "retail-suppliers-askbiz", "pos-reports-askbiz"],
    faq: [
      { q: "Does the margin include VAT?", a: "No — margin is calculated on the ex-VAT selling price and ex-VAT cost price. VAT is collected on behalf of HMRC and is not part of your revenue or profit." },
      { q: "What's a good margin for retail?", a: "It varies significantly by product type. Fashion retail often targets 50–60%; grocery retail 20–30%; electronics retail 10–20%. Compare against industry benchmarks for your sector rather than using a single universal target." },
      { q: "Can I see the margin for a whole transaction, not just per product?", a: "Yes — in the Sales report, each transaction shows the total revenue, total COGS, and gross profit margin for that basket. This is useful for understanding basket-level profitability." }
    ]
  },

  {
    slug: "retail-product-images-askbiz",
    title: "Adding Product Images and Descriptions",
    description: "How to upload product images and write product descriptions in AskBiz POS — making it easier for cashiers to identify products at the till and improving the customer-facing experience.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: ["product images", "descriptions", "till", "cashier", "retail", "POS", "AskBiz", "product setup"],
    keyTakeaways: [
      "Product images appear on the till screen and make identification faster — especially useful for products with similar names or barcodes.",
      "A clear description helps cashiers answer customer questions without leaving the till.",
      "Images and descriptions carry through to printed receipts and customer-facing displays if your setup includes a customer screen."
    ],
    content: [
      {
        heading: "Why images matter at the till",
        body: "Imagine a clothing shop with 15 different T-shirts in similar colours. Without images, the cashier is searching by name alone — slow and prone to error. With product images, each item in the till's product grid has a visual thumbnail. The cashier can glance and confirm they've selected the right product in a second. Images also reduce training time: a new cashier can learn products visually rather than needing to memorise every name.",
        image: "/images/training/pos-retail-inventory-list.png"
      },
      {
        heading: "Uploading a product image",
        body: "Open a product in Operations > Retail > Products. Click the image placeholder at the top of the form (it shows a camera icon or the current image). Select Upload Image and choose a file from your device. Recommended image specifications: square format (1:1 ratio), at least 500×500 pixels, JPEG or PNG format under 2MB. AskBiz crops and resizes automatically. Good image sources: take a clean photo on a white background, use the supplier's product image (with permission), or download from the manufacturer's press kit."
      },
      {
        heading: "Writing a product description",
        body: "The Description field on the product form is a plain text field for internal notes about the product. Use it to capture information a cashier might need: 'Comes in pack of 6 — check customer wants the 6-pack not individual'; 'Ask customer for colour preference — not shown on barcode'; 'Age-restricted — verify ID before sale'. The description is visible to staff at the till when they tap the product tile for details. It's not shown on receipts by default — it's a staff-facing tool."
      },
      {
        heading: "Customer-facing displays",
        body: "If your till setup includes a customer-facing display (a second screen facing the customer), AskBiz shows the product image and name for each item as it's scanned. A clean, recognisable image builds trust with the customer — they can see exactly what they're buying as the cashier scans. For businesses where customer displays are standard (supermarkets, pharmacies, electronics stores), investing time in good product images pays off in fewer 'is that the right item?' questions."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "retail-categories-askbiz", "pos-sales-transactions-askbiz"],
    faq: [
      { q: "Can I use the same image for multiple products?", a: "Yes — but be careful. If two products share an image, cashiers might confuse them at the till. Use distinct images where possible." },
      { q: "Can I bulk upload images?", a: "Yes — via CSV import, include a publicly accessible Image URL for each product. AskBiz fetches and stores the image on import. This is the fastest way to set images for a large catalogue." },
      { q: "Do images appear on printed receipts?", a: "Not on standard thermal receipt printer receipts — the printer resolution is too low. Images do appear in digital receipt emails and on the till screen." }
    ]
  },

  {
    slug: "retail-tax-rates-products-askbiz",
    title: "Assigning VAT Rates to Products",
    description: "How to set the correct VAT rate on each product in AskBiz POS — standard rate, reduced rate, zero rate, and exempt — so every transaction is correctly taxed and your VAT return is accurate.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["VAT", "tax rate", "zero rated", "standard rate", "reduced rate", "retail", "POS", "AskBiz", "UK tax"],
    keyTakeaways: [
      "Every product must have a VAT rate assigned — AskBiz uses this to calculate the correct tax on every transaction.",
      "The UK has three main VAT rates: Standard (20%), Reduced (5%), and Zero (0%). Most retail goods are standard-rated.",
      "Common zero-rated categories include most food and drink, children's clothes, books, and printed materials."
    ],
    content: [
      {
        heading: "UK VAT rates at a glance",
        body: "As of 2024, the UK has three VAT rates: Standard Rate (20%) — applies to most goods and services. Reduced Rate (5%) — applies to domestic fuel and power, children's car seats, and some other categories. Zero Rate (0%) — VAT is charged but at 0%, meaning no tax is collected. Zero-rated differs from Exempt (which means VAT doesn't apply at all) in accounting terms. Common zero-rated items: most food, children's clothing and footwear, books and newspapers, prescription medicines. If you're unsure about a specific product, consult HMRC's VAT rates guide or your accountant.",
        image: "/images/training/pos-retail-inventory.png"
      },
      {
        heading: "Setting the VAT rate on a product",
        body: "Open a product in Operations > Retail > Products. Find the VAT Rate dropdown. Select Standard (20%), Reduced (5%), Zero Rated (0%), or Exempt. The selling price you enter is inclusive of VAT at the selected rate. AskBiz automatically calculates the ex-VAT price and the VAT amount for every sale. On receipts, the breakdown shows the net price and VAT amount separately, as required by UK VAT regulations."
      },
      {
        heading: "Mixed-rate baskets",
        body: "Many retail businesses sell a mix of standard and zero-rated goods. For example, a health food shop might sell supplements (standard rate) alongside food items (zero rate). AskBiz handles this automatically — each item in a transaction carries its own VAT rate. The till displays and the receipt show the VAT breakdown by rate: total at 20%, total at 0%, and so on. The MTD VAT export (POS Overview > MTD VAT) splits your output tax by rate for your VAT return."
      },
      {
        heading: "Common VAT mistakes to avoid",
        body: "1) Setting all products to Standard rate by default — food businesses often make this mistake, resulting in overcollected VAT. 2) Mixing up Zero and Exempt — technically different treatments in VAT accounting. 3) Not updating rates when HMRC changes them — check your product settings any time VAT rates change. 4) Setting the VAT rate on service items incorrectly — services you supply are usually standard-rated unless a specific exemption applies. When in doubt, check with your accountant before setting up a new product category."
      },
      {
        heading: "Bulk-updating VAT rates",
        body: "If you discover that a whole category of products has the wrong VAT rate, the fastest fix is a CSV export. Go to Operations > Retail > Products > Export. Open in Excel, filter by Category, update the VAT Rate column for all filtered rows, and reimport. AskBiz updates existing products (matched by SKU) without creating duplicates. Historical sales are not retroactively corrected — the change applies to future transactions only."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "pos-export-vat-askbiz", "pos-reports-askbiz"],
    faq: [
      { q: "What if a product's VAT treatment is unclear?", a: "Don't guess — the cost of mis-applying VAT can be significant if HMRC investigates. Consult HMRC's online VAT notice database or your accountant for a definitive answer." },
      { q: "Can AskBiz handle EU VAT for cross-border sales?", a: "AskBiz's POS VAT module is configured for UK VAT. For EU cross-border transactions (e.g. if you sell to EU customers online), consult your accountant about OSS (One Stop Shop) obligations." },
      { q: "Does the customer see the VAT on the receipt?", a: "Yes — AskBiz receipts show the product price inclusive of VAT, plus a VAT breakdown at the bottom: net amount + VAT at X% = total. This is the standard format required for a valid VAT receipt in the UK." }
    ]
  },

  {
    slug: "retail-service-items-askbiz",
    title: "Setting Up Service Items at the POS",
    description: "How to add non-physical service items to AskBiz POS — fitting fees, delivery charges, installation costs, and other services that need to appear on till receipts alongside physical goods.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["service items", "non-physical", "fitting fee", "delivery charge", "retail", "POS", "AskBiz", "services"],
    keyTakeaways: [
      "Service items are products with no physical stock — they don't trigger stock alerts or appear in stock counts.",
      "Adding a fitting fee or delivery charge as a service item keeps it on the till receipt and in your sales reports.",
      "Service items can be added manually by cashiers at any price using Open Price items."
    ],
    content: [
      {
        heading: "What is a service item?",
        body: "A service item is a non-physical product that you charge for but don't stock. Examples: a fitting fee for blinds or curtains, a delivery charge, an installation service, gift wrapping, a consultation fee, or a repair charge. In AskBiz, service items are set up almost identically to physical products, but with stock tracking disabled. This means they don't consume inventory when sold and don't appear in stock counts or low-stock alerts.",
        image: "/images/training/pos-retail-inventory-list.png"
      },
      {
        heading: "Creating a service item",
        body: "Go to Operations > Retail > Products > Add Product. Enter the service name (e.g. 'Standard Delivery', 'Blind Fitting Service', 'Gift Wrapping'). Set the price. Set VAT rate — most services in the UK are standard-rated at 20%. In the Product Type or Unit field, select Service (or the equivalent option in your AskBiz configuration). This disables stock tracking. Leave the stock quantity and minimum stock fields blank or at zero. Save. The service item is now available at the till."
      },
      {
        heading: "Open price service items",
        body: "Some services have variable pricing — a bespoke installation where the charge depends on time taken, for example. Create a service item with a price of £0.00 and enable the Allow Price Override option (sometimes called Open Price). At the till, when this item is added to a transaction, the cashier is prompted to enter the price before it's added to the basket. This is much cleaner than manually applying a discount or creating a new service item for every price point."
      },
      {
        heading: "Adding services to a sale",
        body: "Service items appear in the till's product search alongside physical products. Search by name or assign a quick-access button on the till's home screen for frequently used services. Add the service item to the basket just like any physical product. If it has an open price, enter the amount when prompted. The service appears on the receipt with its own line, price, and VAT amount — giving the customer a clear breakdown of what they paid for goods vs. services."
      },
      {
        heading: "Reporting on service revenue",
        body: "In POS Reports > Products, service items appear in the product list. Filter by category (create a 'Services' category for all your service items to make filtering easy). Service revenue often carries a higher margin than physical goods — there's no cost of goods for a fitting service except labour, which may not be tracked as a cost in AskBiz. Track service revenue separately from product revenue to understand the real contribution each stream makes to your business."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "retail-tax-rates-products-askbiz", "pos-sales-transactions-askbiz"],
    faq: [
      { q: "Can I apply a service charge as a percentage of the basket rather than a fixed amount?", a: "Not directly at product level — use the Promotions section to add a percentage-based fee if needed, though this is more typically used for discounts. For a fixed-rate service charge, the Open Price service item is the most flexible approach." },
      { q: "Does a service item appear on the invoice?", a: "Yes — service items appear as line items on AskBiz invoices and receipts, with their own description, price, and VAT breakdown." },
      { q: "Can I set a time estimate on a service item?", a: "The basic product form doesn't have a time estimate field — that's a feature of the repair/service workflow. For simple service items sold at the POS, time estimates are managed outside AskBiz (e.g. by the person performing the service)." }
    ]
  },

  {
    slug: "retail-gift-cards-askbiz",
    title: "Setting Up and Selling Gift Cards",
    description: "How to configure gift cards in AskBiz POS — creating gift card products, selling them at the till, tracking balances, and accepting gift card payments from customers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["gift cards", "vouchers", "gift vouchers", "retail", "POS", "AskBiz", "payment method"],
    keyTakeaways: [
      "Gift cards in AskBiz are sold as a product and redeemed as a payment method — the full lifecycle is tracked in the system.",
      "Unused gift card balances are a liability on your books — AskBiz helps you track outstanding balances.",
      "Gift cards are a powerful customer acquisition and retention tool; a customer who receives a gift card often spends more than the card value."
    ],
    content: [
      {
        heading: "How gift cards work in AskBiz",
        body: "Gift cards in AskBiz work in two stages: selling and redemption. Selling: a customer buys a gift card — you create a gift card product (e.g. '£25 Gift Card') and sell it at the till. The revenue is recorded but the liability is also tracked — you owe the recipient £25 of goods. Redemption: the recipient comes in and pays for goods using the gift card. The cashier selects 'Gift Card' as the payment method, enters the card number, and AskBiz deducts the amount from the card's balance. If the balance covers the full purchase, no further payment is needed. If not, the customer pays the remainder by another method.",
        image: "/images/training/pos-retail-gift-cards.png"
      },
      {
        heading: "Creating a gift card product",
        body: "Go to Operations > Retail > Products > Add Product. Name it '£25 Gift Card' (or your denomination). Set the selling price to £25. Set the VAT rate — in the UK, gift cards are zero-rated for VAT purposes at the point of sale (VAT is charged when the card is redeemed and the goods are purchased, not when the card is sold). Tick the Gift Card option in the product type settings. When this product is sold at the till, AskBiz automatically generates a unique gift card code and links it to a £25 balance. You can offer multiple denominations: £10, £25, £50."
      },
      {
        heading: "Issuing the gift card to the customer",
        body: "After the gift card sale is completed at the till, AskBiz generates a receipt that includes the unique gift card code. Print this receipt for the customer — they use this code when they come to redeem. If you have physical gift card stock (pre-printed cards with unique codes), you can link a physical card's printed code to a balance in AskBiz by activating it at the till — the physical card is scanned, AskBiz assigns the balance to that code."
      },
      {
        heading: "Accepting gift card payment",
        body: "When a customer wants to pay with a gift card, the cashier adds items to the basket as normal. At payment, select Gift Card as the payment method. A prompt asks for the card code — the customer reads it from their receipt or the cashier scans the physical card's barcode. AskBiz looks up the code, confirms the remaining balance, and applies it to the transaction. If the card covers the full amount, the sale completes. If there's a remaining amount, the cashier selects an additional payment method for the difference."
      },
      {
        heading: "Tracking outstanding balances",
        body: "In POS Operations > Gift Cards, you can view all issued gift cards, their original value, amount redeemed to date, and remaining balance. Filter for partially redeemed cards to see your outstanding liability. For accounting purposes, gift card revenue is deferred until the card is redeemed — your accountant will likely want to see total outstanding gift card balances at period end. AskBiz's gift card balance report gives you exactly this number."
      }
    ],
    relatedSlugs: ["retail-product-catalogue-askbiz", "pos-loyalty-programme-askbiz", "pos-sales-transactions-askbiz"],
    faq: [
      { q: "Do gift cards expire in AskBiz?", a: "You can set an expiry date when creating or issuing a gift card. Under UK consumer law, gift cards must not expire in less than a reasonable period — check current regulations before setting short expiry windows." },
      { q: "What happens to the value of an expired unredeemed gift card?", a: "The value becomes income for your business (breakage income). This is a recognised accounting concept. Consult your accountant on how to record this in your P&L." },
      { q: "Can a customer check their gift card balance without making a purchase?", a: "Yes — cashiers can look up any gift card code in Operations > Gift Cards and tell the customer their remaining balance, without initiating a transaction." }
    ]
  },

  {
    slug: "retail-multi-branch-inventory-askbiz",
    title: "Managing Inventory Across Multiple Branches",
    description: "How to use AskBiz POS to oversee stock levels, sales performance, and reordering across all your branches from a single dashboard — without visiting each location.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["multi-branch", "branches", "inventory", "stock levels", "retail", "POS", "AskBiz", "central management"],
    keyTakeaways: [
      "AskBiz POS gives you a consolidated view of stock across all branches — switch between Branch and 'All Branches' in any report.",
      "Each branch has its own stock count — a product at zero in Branch A doesn't affect Branch B's count.",
      "Use stock transfers to balance inventory between branches rather than placing unnecessary purchase orders."
    ],
    content: [
      {
        heading: "The multi-branch model in AskBiz",
        body: "Each branch in AskBiz has its own independent stock count, its own till sessions, its own staff, and its own performance metrics. At the same time, your product catalogue, suppliers, and price lists are shared across all branches — you define a product once and it's available everywhere. This means you manage your catalogue centrally (what products exist and at what price) while each branch manages its own inventory (how much of each product it has on hand).",
        image: "/images/training/pos-retail-operations.png"
      },
      {
        heading: "Viewing stock across all branches",
        body: "Go to Operations > Retail > Products and use the Branch dropdown at the top to switch between branches. To see a product's stock across all locations simultaneously, click the product row and look at the Branch Stock table — it lists every branch with its current stock for that product. This view quickly reveals imbalances: Branch A has 120 units of a product while Branch B has 3. Before raising a purchase order, consider a stock transfer from A to B."
      },
      {
        heading: "Consolidated reporting",
        body: "In POS Reports, the Branch filter defaults to All — showing consolidated figures across every location. Switch to a specific branch to see that branch's performance in isolation. For owner-operators managing multiple sites, the All Branches view is the daily check: you can see total revenue, total low-stock alerts, and total refunds in one number. For operations managers, the branch-by-branch view shows which locations are thriving and which need attention."
      },
      {
        heading: "Low-stock alerts by branch",
        body: "The POS Overview shows low-stock alerts for the selected branch. Switch to 'All Branches' to see a combined alert count. This is your morning operational check: scan the alerts, identify which branches need urgent restocking, and either raise a purchase order or initiate a stock transfer from a branch with surplus stock. The goal is to catch every stockout before it happens — a customer facing an empty shelf is a lost sale and often a lost customer."
      },
      {
        heading: "Setting branch-specific minimum stock levels",
        body: "Minimum stock levels can be set per product per branch. A city-centre flagship store might need a minimum of 50 units for a best-seller; a smaller satellite store might need only 15. Go to the product record, select the branch in the Branch Stock section, and set its specific minimum. This ensures low-stock alerts reflect each branch's actual sales velocity, not a one-size-fits-all number that generates false alarms at some sites and misses genuine shortages at others."
      }
    ],
    relatedSlugs: ["retail-stock-transfers-askbiz", "pos-branches-management-askbiz", "pos-map-view-askbiz"],
    faq: [
      { q: "Can staff at one branch see the stock levels of other branches?", a: "Yes, if they have the appropriate permissions. By default, branch staff see their own branch's stock. Managers can be given multi-branch view access in the Staff permissions settings." },
      { q: "Can I have different prices at different branches?", a: "Standard product prices are shared across all branches. Use price lists to set branch-specific pricing if needed — assign the price list to a 'customer' profile that represents the branch's local customer base." },
      { q: "Can I set different suppliers for different branches?", a: "You can assign preferred suppliers per product globally, but branch-level supplier assignments aren't a current feature. Purchase orders are raised at the business level and received at a specific branch." }
    ]
  },

  {
    slug: "retail-end-of-month-stock-report-askbiz",
    title: "Running Your End-of-Month Stock and Margin Report",
    description: "How to use AskBiz POS to produce a complete end-of-month inventory and profitability report — understanding your closing stock value, COGS, gross margin, and key product trends.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["end of month", "stock report", "margin report", "inventory valuation", "COGS", "retail", "POS", "AskBiz"],
    keyTakeaways: [
      "The end-of-month stock report tells you the value of your remaining inventory — a number your accountant needs for your P&L.",
      "Your monthly COGS (cost of goods sold) is opening stock + purchases received − closing stock.",
      "Comparing this month's margin to last month's reveals whether your pricing and purchasing decisions are paying off."
    ],
    content: [
      {
        heading: "Why end-of-month reporting matters",
        body: "Your monthly management accounts need three stock-related numbers: opening stock value (what you had at the start of the month), purchases received (what you bought during the month), and closing stock value (what you have left). The difference — opening stock + purchases − closing stock — is your COGS (cost of goods sold). Gross profit = Revenue − COGS. Without accurate stock data, you can't calculate accurate gross profit. AskBiz tracks all three in real time.",
        image: "/images/training/pos-retail-reports.png"
      },
      {
        heading: "Step 1 — Run a stock take on the last day of the month",
        body: "For the most accurate closing stock value, run a stock take on the last trading day of the month (see the Stock Take article for full instructions). This gives you a physical count that reconciles against AskBiz's system count. After confirming the stock take, AskBiz's stock levels reflect reality. The closing stock value is: sum of (current stock quantity × cost price) for all products. AskBiz calculates this automatically."
      },
      {
        heading: "Step 2 — Export the stock valuation report",
        body: "Go to POS Reports > Stock > Stock Valuation. Select your branch (or All Branches). Set the date to the last day of the month. The report shows every product with its closing quantity and closing value (quantity × cost price). The total at the bottom is your closing stock value — share this with your accountant. Export as CSV for their records. Compare this to last month's closing stock value to see if you're building or reducing inventory over time."
      },
      {
        heading: "Step 3 — Review the monthly sales and margin report",
        body: "Go to POS Reports > Sales and set the date range to the full month (1st to last day). The summary shows: Total Revenue, Total COGS, Gross Profit, and Gross Margin %. Below the summary is a product breakdown. Click on any product to see units sold, revenue, COGS, and margin for just that item. Sort by Gross Profit descending to see your highest-contributing products. Sort by Margin % ascending to find your most problematic items."
      },
      {
        heading: "Step 4 — Review purchase orders received",
        body: "Go to Operations > Retail > Purchase Orders and filter by Date Received: this month. This gives you the total value of stock purchased and received during the month — your purchases figure for the COGS calculation. If any orders were received but not fully processed in AskBiz, address those discrepancies now rather than at year-end. Cross-reference the purchase order total against your supplier invoices as a reconciliation check."
      },
      {
        heading: "Month-on-month comparison",
        body: "The most valuable insight comes from comparing months. If revenue is up 12% but gross profit is only up 4%, your margin is deteriorating — find out why (cost increases not passed to the customer? Product mix shift towards lower-margin items?). If revenue is flat but gross profit is up 8%, you've improved margin — perhaps through better purchasing or a pricing adjustment. Set aside 30 minutes at the start of each month to review last month's numbers using this process. Over six months, you'll develop an intuitive understanding of your business's financial rhythm."
      }
    ],
    relatedSlugs: ["retail-stock-take-askbiz", "pos-reports-askbiz", "retail-product-pricing-margins-askbiz"],
    faq: [
      { q: "My accountant uses a different stock valuation method (FIFO vs AVCO). Does AskBiz support both?", a: "AskBiz uses average cost (AVCO) by default for stock valuation. If your accountant requires FIFO, discuss with them how to reconcile AskBiz's AVCO values to a FIFO calculation. For most SMEs, AVCO is acceptable." },
      { q: "What if I forgot to run a stock take at month end?", a: "AskBiz's system stock count (based on transactions) is an approximation of your physical stock. If you trust its accuracy (no unrecorded discrepancies), use the system count for the valuation report. If you know there are discrepancies, run a stock take as soon as possible and note the date to your accountant." },
      { q: "Can I automate this monthly report?", a: "You can schedule report exports to be emailed automatically on a set date. Set this up in Reports > Scheduled Reports — configure the date range as 'Previous Month' so it runs correctly every month without adjustment." }
    ]
  }
];
