import { AcademyArticle } from "./academy-types";

export const ASKBIZ_POS_REPORTS_ARTICLES: AcademyArticle[] = [

  // 1 ─── Sales Report Overview ─────────────────────────────────────────────────
  {
    slug: "pos-report-sales-overview-askbiz",
    title: "Your Sales Report Explained: Every Column and What It Means",
    description: "A plain-English guide to every metric in the AskBiz POS Sales Report — Revenue, Gross Profit, Margin, Avg Sale, and how to use each figure to make better business decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["sales report", "AskBiz POS", "revenue report", "gross profit", "margin", "average sale", "POS analytics", "business reporting"],
    keyTakeaways: [
      "The Reports hub at Operations > Reports shows Revenue, Gross Profit, Margin, and Stock Value as your four headline KPIs.",
      "Revenue is total income; Gross Profit subtracts product cost; Margin is Gross Profit as a percentage of Revenue.",
      "The Sales Report breaks down revenue by product, category, cashier, and time period.",
      "All metrics respond to the Branch and Sector filters — always set these before reading numbers."
    ],
    content: [
      {
        heading: "Your four headline numbers at a glance",
        body: "Go to Operations > Reports. Before clicking into any sub-report, the hub page shows your four most important KPIs for the current period: Revenue (KSh 55,630 in this example), Gross Profit (KSh 24,725.25), Margin (44.4%), and Stock Value (KSh 182,297.75). These four numbers answer the most common business questions — 'How much did we sell?', 'How much did we make?', 'Are our prices healthy?', and 'How much is sitting on the shelf?' — without opening a single sub-report.",
        image: "/images/training/pos-report-sales.png",
      },
      {
        heading: "Revenue: what it means and what it doesn't",
        body: "Revenue is the total value of all completed sales in the selected period. It does not subtract costs, taxes, or discounts. A high revenue number looks good but can hide a low-margin problem. Always read Revenue alongside Gross Profit Margin — if Revenue is up 20% but Margin has dropped from 44% to 35%, you are generating more turnover at lower profitability, which may not be the outcome you want. Revenue is the starting point, never the conclusion."
      },
      {
        heading: "Gross Profit: the number that actually matters",
        body: "Gross Profit = Revenue minus the cost of goods sold (COGS). AskBiz calculates this automatically using the cost price you entered for each product in Inventory. If your cost prices are accurate, your Gross Profit figure is reliable. If you imported products without entering cost prices, Gross Profit will show as equal to Revenue — which overstates your profitability. Audit your Inventory periodically to ensure cost prices are filled in for all products."
      },
      {
        heading: "Margin: your profitability health check",
        body: "Margin is Gross Profit expressed as a percentage of Revenue. A 44.4% margin means you keep KSh 44.40 of every KSh 100 sold after paying for the products. For retail, a margin above 30% is generally healthy; below 20% indicates thin margins that require high volume to sustain. Track Margin week over week — a declining trend almost always precedes a cash flow problem by 2–4 weeks."
      },
      {
        heading: "Avg Sale: the basket size indicator",
        body: "Average Sale value (visible on the Overview as KSh 412.07 for Last 30 days) is your total Revenue divided by the number of transactions. It tells you the typical value a customer brings per visit. If Avg Sale drops significantly, either customers are buying fewer items per visit, your prices have decreased, or a popular high-value product is out of stock. Monitor Avg Sale weekly alongside Revenue to distinguish volume growth from value growth."
      },
      {
        heading: "Using the Branch and Sector filters correctly",
        body: "Every metric on the Reports hub responds to the Branch dropdown (All Branches, Town, Bondeni) and Sector filter (All Sectors, Retail, etc.) at the top of the screen. Before drawing any conclusion, confirm which filters are active. A Revenue figure of KSh 55,630 for 'All Branches' over 30 days tells a very different story than the same figure for a single branch. Set your filters deliberately and note them when sharing reports with your team or accountant."
      }
    ],
    relatedSlugs: ["pos-report-gross-profit-askbiz", "pos-report-margin-trend-askbiz", "pos-report-avg-basket-askbiz"],
    faq: [
      { q: "Why does my Revenue in Reports differ from what I see on Overview?", a: "Check your date filters and Branch selection — they must match. Reports defaults to the same period as Overview, but if you changed one without the other the figures will differ." },
      { q: "Are refunds subtracted from Revenue automatically?", a: "Yes — completed refund transactions reduce the Revenue total for the period. You can see the exact refund count on the Overview metrics row." }
    ]
  },

  // 2 ─── Gross Profit Report ───────────────────────────────────────────────────
  {
    slug: "pos-report-gross-profit-askbiz",
    title: "Reading Your Gross Profit Report Without an Accountant",
    description: "How to interpret AskBiz gross profit figures, why they differ from revenue, and what to do when your margin is lower than expected — in plain English.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["gross profit", "COGS", "cost of goods", "margin", "profitability", "AskBiz reports", "POS analytics", "business health"],
    keyTakeaways: [
      "Gross Profit = Revenue minus Cost of Goods Sold — AskBiz calculates this automatically from your product cost prices.",
      "If cost prices are missing in Inventory, Gross Profit equals Revenue and appears misleadingly high.",
      "A declining Gross Profit Margin trend week-over-week is the earliest warning sign of a pricing or cost problem.",
      "Use the Sector filter to see which product category has the lowest margin and focus pricing attention there."
    ],
    content: [
      {
        heading: "Gross Profit vs Revenue: why the difference matters",
        body: "Revenue tells you how much money came in. Gross Profit tells you how much you actually kept after paying for the products you sold. A business with KSh 100,000 revenue but KSh 95,000 in product costs has only KSh 5,000 of gross profit — before paying rent, staff, or utilities. AskBiz shows both figures on the Reports hub, and the gap between them is the most important signal about your business's financial health.",
        image: "/images/training/pos-report-sales.png",
      },
      {
        heading: "How AskBiz calculates Gross Profit",
        body: "For every sale at the till, AskBiz records the selling price and looks up the cost price entered in your Inventory for that product. Gross Profit for that sale is selling price minus cost price. Across all sales in the period, AskBiz sums these to give you total Gross Profit and the overall Margin percentage. This calculation happens automatically — no manual spreadsheet required. The accuracy depends entirely on having correct cost prices in your product catalogue."
      },
      {
        heading: "What to do if your Gross Profit equals your Revenue",
        body: "If Gross Profit and Revenue show the same figure on the Reports hub, it means your product cost prices are not filled in. Go to Operations > Inventory, click 'Edit' on any product, and check whether the 'Cost' field contains a value. If it shows zero or is blank, AskBiz has no cost data and cannot calculate profit. Update cost prices for your top 20 products first — these will have the biggest impact on the accuracy of your Gross Profit figure."
      },
      {
        heading: "Reading Margin by sector to find problem areas",
        body: "Use the Sector filter on the Reports hub to check Margin by product category. Switch between Retail, Repair, Restaurant, etc. and note the margin for each. If your Retail margin is 44% but your Restaurant margin is 12%, your restaurant pricing may be too low relative to food costs, or supplier prices have risen without a menu price adjustment. This sector-level view is how you identify which part of your business needs a pricing review."
      },
      {
        heading: "Three reasons Gross Profit drops unexpectedly",
        body: "If Gross Profit margin drops from one week to the next, three causes explain 90% of cases: (1) Discounts — a promotion reduced selling prices without reducing costs. Check Operations > Reports > Discounts report for total discount value given. (2) Cost increases — a supplier raised prices but you haven't updated cost prices in Inventory, so the true margin is lower than reported. (3) Product mix shift — you sold more low-margin products than usual. The Sector filter helps diagnose which of these applies."
      },
      {
        heading: "Setting a Gross Profit target and tracking it weekly",
        body: "Decide your target Gross Profit Margin for your business type. For small retail, 35–45% is typical. Write this target on a card next to the POS screen. Every Monday, open Reports, select Last 7 days, and check if margin is at or above target. If it's below, investigate using the three-cause checklist above before the problem compounds. A weekly 2-minute check replaces a monthly accountant's visit for most operational margin problems."
      }
    ],
    relatedSlugs: ["pos-report-sales-overview-askbiz", "pos-report-margin-trend-askbiz", "pos-report-cost-vs-revenue-askbiz"],
    faq: [
      { q: "Does Gross Profit include VAT?", a: "AskBiz records revenue inclusive or exclusive of VAT depending on your tax settings. Check Operations > Settings to confirm whether your prices are VAT-inclusive. Gross Profit is calculated on the same basis as your pricing setup." },
      { q: "Can I see Gross Profit per product?", a: "Gross Profit per product is visible in the Sales Report sub-view when broken down by product. The product-level margin shows which items are most and least profitable." }
    ]
  },

  // 3 ─── Hourly Sales Chart ────────────────────────────────────────────────────
  {
    slug: "pos-report-hourly-sales-askbiz",
    title: "Use the Hourly Sales Chart to Staff Your Busiest Hours",
    description: "How to read the AskBiz Sales by Hour chart to identify your peak trading times, stagger cashier shifts, and ensure you're never understaffed during your busiest windows.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["hourly sales", "sales by hour", "shift planning", "staff scheduling", "peak hours", "AskBiz POS", "trading pattern", "cashier scheduling"],
    keyTakeaways: [
      "The Sales by Hour chart on Overview shows transaction volume for every hour of the trading day across your selected period.",
      "Switch to 'Last 30 days' to see your true hourly pattern — a single day can be misleading.",
      "The tallest bar is your peak hour: ensure you have your maximum cashier count active in that window.",
      "Hours with consistently zero or near-zero bars are candidates for shift-end times — not leaving a full team idle."
    ],
    content: [
      {
        heading: "Reading the Sales by Hour chart in 30 seconds",
        body: "Go to POS > Overview and select 'Last 30 days'. Scroll down to the 'SALES BY HOUR' bar chart. Each bar represents total transaction volume (or revenue — hover to see the value) for that hour aggregated across the past 30 days. The chart currently shows trading from 7:00 to 20:00 with a clear peak at 11:00–12:00, secondary peaks at 10:00 and 16:00, and consistently low activity before 9:00 and after 19:00. This 30-second read reveals your entire daily trading rhythm.",
        image: "/images/training/pos-report-hourly.png",
      },
      {
        heading: "Why Last 30 days gives better staffing data than Today",
        body: "Any single day can be unrepresentative — a Monday might be quiet, a payday Friday unusually busy. The 30-day view smooths out these fluctuations to show your true average hourly pattern. Use Today's chart to monitor whether today's trading matches the expected pattern (useful for spotting an unusually slow morning that might need a promotion push), but always base staffing decisions on the 30-day chart."
      },
      {
        heading: "Identifying your three staffing tiers from the chart",
        body: "From the hourly chart, categorise your hours into three tiers: Peak (the 2–3 hours with the tallest bars — in this example, 11:00–12:00 and 16:00), Moderate (hours with medium bar height — 10:00, 13:00–15:00, 17:00–18:00), and Quiet (hours with very small bars or none — before 9:00 and after 19:00). Staff your Peak hours with maximum cashiers, Moderate hours with your standard count, and Quiet hours with minimum staff. This three-tier model prevents both understaffing and paying for idle cashiers."
      },
      {
        heading: "Using the chart to set shift start and end times",
        body: "If your chart shows near-zero activity before 9:00, there is no business case for a cashier arriving at 7:30. Set the first shift to start at 8:45 — 15 minutes before the first noticeable bar — and the last shift to end 30 minutes after the final meaningful bar. This single adjustment, applied consistently, can reduce weekly cashier hours by 10–15% without impacting service during active trading hours."
      },
      {
        heading: "Comparing hourly patterns between branches",
        body: "Open Overview in two browser tabs. Set one to Branch: Town and one to Branch: Bondeni. Compare their hourly charts side by side. If Town peaks at 11:00 but Bondeni peaks at 16:00, you can move a cashier from Town to Bondeni for the afternoon shift rather than keeping both branches fully staffed all day. This branch-specific scheduling requires no extra staff — just smart redistribution based on data."
      },
      {
        heading: "What a flat hourly chart tells you",
        body: "A flat chart — where all bars are roughly the same height across the day — suggests either consistent steady trading (rare) or an issue with your trading pattern. If you expected a lunch peak and the chart is flat, check: Do customers have a reason to come in at lunchtime? Is your location accessible? Did a product outage reduce lunchtime traffic? The absence of a peak is as informative as the peak itself — it points to an opportunity to create traffic at a specific time."
      }
    ],
    relatedSlugs: ["pos-report-cashier-compare-askbiz", "pos-hack-cashier-report-filter-askbiz", "pos-report-day-of-week-askbiz"],
    faq: [
      { q: "Does the Sales by Hour chart show revenue or transaction count?", a: "The chart shows transaction count by default. Hover over each bar to see the revenue value for that hour. Both views are useful — transaction count for staffing, revenue for prioritising high-value hours." },
      { q: "Can I see the hourly chart for a specific branch?", a: "Yes — use the Branch filter at the top of the Overview before scrolling to the chart. The chart updates to show only that branch's hourly pattern." }
    ]
  },

  // 4 ─── Margin Trend ───────────────────────────────────────────────────────────
  {
    slug: "pos-report-margin-trend-askbiz",
    title: "Spot Margin Erosion Before It Hits Your Bottom Line",
    description: "How to use AskBiz POS margin data to detect declining profitability early — identifying whether the cause is pricing, discounts, supplier cost increases, or product mix shift.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["margin erosion", "profitability trend", "margin decline", "pricing review", "cost increase", "AskBiz reports", "business health", "gross margin"],
    keyTakeaways: [
      "Margin erosion — a gradual decline in Gross Profit % — is often invisible until it becomes a cash flow crisis.",
      "Compare Margin for Last 7 days vs Last 30 days each Monday to spot a downward trend early.",
      "The four root causes of margin erosion: discounts, cost increases, product mix shift, and pricing inertia.",
      "A 2-percentage-point margin drop sustained over 4 weeks requires immediate investigation."
    ],
    content: [
      {
        heading: "Why margin problems are invisible until it's too late",
        body: "Margin erosion is dangerous because revenue can stay flat or even grow while profit quietly shrinks. A business doing KSh 50,000 per month at 44% margin generates KSh 22,000 gross profit. The same revenue at 35% margin generates only KSh 17,500 — a KSh 4,500 monthly shortfall that appears nowhere in the revenue figure. AskBiz shows Margin as a percentage directly on the Reports hub, making this comparison easy — but only if you look at it regularly.",
        image: "/images/training/pos-reports.png",
      },
      {
        heading: "The Monday margin check: 2 minutes, once a week",
        body: "Every Monday, open Operations > Reports and note two figures: the Margin for Last 7 days and the Margin for Last 30 days. If the 7-day margin is lower than the 30-day margin, this week is running below your rolling average — an early warning worth investigating. If the 7-day margin is consistently lower for three weeks in a row, you have a confirmed trend. This takes 2 minutes and catches problems weeks before they appear in your bank balance."
      },
      {
        heading: "Root cause 1: discounts eroding margin",
        body: "Go to Operations > Reports > Discounts report. Check total discount value for Last 30 days. If discounts have increased as a percentage of revenue, promotions are eating your margin. The fix is not necessarily to stop discounting — it is to ensure your selling price before discount already accounts for the promotional reduction. If you need to give 15% off, your base price needs to deliver acceptable margin at a 15% discount, not just at full price."
      },
      {
        heading: "Root cause 2: supplier cost increases not passed on",
        body: "If a supplier increases their wholesale price by 10% but your retail price stays the same, your margin shrinks by the full 10% reduction in gross profit on that product. Go to Operations > Inventory and review the cost prices on your top 10 products. Compare against your most recent supplier invoices. If costs have risen without a price update in AskBiz, update both the product cost price and the selling price to restore margin. Even a KSh 10–20 price increase on high-volume products significantly impacts monthly gross profit."
      },
      {
        heading: "Root cause 3: product mix shift",
        body: "If customers start buying more of your low-margin products and fewer of your high-margin ones, overall margin drops even with no pricing or cost changes. Use the Sector filter on Reports to compare margin by category. If Margin is 44% for Retail but 22% for Restaurant, an increase in restaurant sales at the expense of retail will drag the overall margin down. The solution is either to increase restaurant prices or actively promote high-margin retail products."
      },
      {
        heading: "Root cause 4: pricing inertia",
        body: "Prices that haven't been reviewed in 12+ months almost certainly have lower margins than when they were set — because costs rise while prices stay fixed. Schedule a semi-annual price review: go to Operations > Inventory, export the product list to CSV, and calculate current margin for each product (selling price minus cost, divided by selling price). Any product below your target margin needs a price increase. Update prices in bulk using the CSV import feature."
      }
    ],
    relatedSlugs: ["pos-report-gross-profit-askbiz", "pos-report-cost-vs-revenue-askbiz", "pos-report-promotions-roi-askbiz"],
    faq: [
      { q: "What margin should I be targeting for my business type?", a: "Margin targets vary: grocery/convenience 18–28%, beauty/personal care 40–60%, food service 65–75% on food (lower after labour), general retail 30–50%. Use your industry benchmark as a starting point and track your own trend." },
      { q: "Can I see margin per transaction rather than as an overall average?", a: "The Sales Report sub-view shows margin by product and by category. Individual transaction margin can be derived from the Audit trail if needed for specific investigation." }
    ]
  },

  // 5 ─── Top Sellers ────────────────────────────────────────────────────────────
  {
    slug: "pos-report-top-sellers-askbiz",
    title: "Find Your Top 10 Products by Revenue and Volume",
    description: "How to identify your fastest-selling and highest-revenue products in AskBiz POS — and use that data to optimise stock, shelf space, and supplier negotiations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["top sellers", "best selling products", "product performance", "sales by product", "AskBiz reports", "stock optimisation", "revenue per product", "POS analytics"],
    keyTakeaways: [
      "The Sales Report in Operations > Reports breaks down revenue and volume by individual product.",
      "Distinguish between top sellers by volume (units sold) and by revenue — they are often different products.",
      "Your top 10 revenue products deserve priority stock allocation, premium shelf placement, and dedicated Quick Keys.",
      "Products in the bottom 10% by revenue for 90 days are dead stock candidates — consider clearance pricing."
    ],
    content: [
      {
        heading: "Why knowing your top sellers changes everything",
        body: "Most retail owners have an intuition about which products sell well. AskBiz replaces intuition with data. When you can see that Product A generates KSh 8,000 per month and Product B generates KSh 800, you know that a stock-out of Product A costs ten times as much as a stock-out of Product B. This single insight changes your reorder priorities, shelf allocation, cashier training, and supplier relationship — all from one report.",
        image: "/images/training/pos-report-sales.png",
      },
      {
        heading: "Step 1 — Open the Sales Report and filter by product",
        body: "Go to Operations > Reports. The Reports hub shows your top-level KPIs. The Sales Report card ('Revenue by product, category, staff & period') opens the detailed breakdown. Select Last 30 days for a meaningful sample. Sort by Revenue descending to see your highest-earning products at the top. This is your top sellers by revenue list. Note the top 10 — these are the products your business depends on most."
      },
      {
        heading: "Step 2 — Find top sellers by volume vs by revenue",
        body: "Sort the same report by Units Sold descending. The top 10 by volume may differ significantly from the top 10 by revenue. A KSh 50 product sold 200 times (KSh 10,000 revenue) might rank below a KSh 2,000 product sold 8 times (KSh 16,000 revenue) in the revenue list, but it ranks far higher by volume. Volume leaders are your high-traffic products — they drive footfall. Revenue leaders are your highest-value products — they drive profitability. You need both lists."
      },
      {
        heading: "Using the top sellers list for stock decisions",
        body: "Your top 10 revenue products should have the highest reorder thresholds in Inventory. Go to Operations > Inventory, click Edit on each of your top 10, and set their reorder level at a minimum of 2 weeks of expected sales. These are the products where a stock-out causes the most damage. For your top 10 volume products, ensure Quick Keys are assigned at the till so cashiers never need to scan or search for them."
      },
      {
        heading: "Using top seller data in supplier negotiations",
        body: "When you know your top 10 products by revenue and volume, you enter supplier conversations with leverage. 'Product X accounts for 18% of our monthly revenue — if you can offer better terms on this line, we can increase our order volume by 30%.' This kind of data-driven negotiation is impossible without a product performance report. Export the list to CSV (Operations > Reports > export) to share with your supplier as supporting evidence."
      },
      {
        heading: "Identifying dead stock using the bottom sellers",
        body: "After reviewing the top sellers, scroll to the bottom of the product revenue list — or sort ascending by revenue. Products with less than KSh 500 revenue over 30 days, consistently, are dead stock candidates. Calculate: if the product costs KSh 200, has 15 units in stock, and sells 2 per month, it will take 7.5 months to clear at current velocity. The KSh 3,000 tied up in that stock could be freed with a 20% clearance discount that clears it in 2 weeks."
      }
    ],
    relatedSlugs: ["pos-report-slow-movers-askbiz", "pos-report-category-performance-askbiz", "pos-hack-reorder-alerts-askbiz"],
    faq: [
      { q: "Can I see which products have the highest margin, not just the highest revenue?", a: "Yes — the Sales Report shows margin per product when cost prices are correctly entered in Inventory. Sort by Margin descending to find your most profitable products by percentage." },
      { q: "How far back can I look for product performance data?", a: "AskBiz retains all historical data. Use the custom date range picker to analyse product performance over any period — monthly, quarterly, or year-over-year." }
    ]
  },

  // 6 ─── Slow Movers ────────────────────────────────────────────────────────────
  {
    slug: "pos-report-slow-movers-askbiz",
    title: "Identify Dead Stock Before It Costs You Too Much",
    description: "How to use AskBiz POS inventory data to find products that aren't selling, calculate the true cost of dead stock, and clear it profitably before it becomes a write-off.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["dead stock", "slow movers", "inventory turnover", "stock clearance", "AskBiz POS", "product performance", "unsold stock", "stock management"],
    keyTakeaways: [
      "Dead stock is any product that has been in your inventory for 90+ days with minimal sales velocity.",
      "The true cost of dead stock includes tied-up cash, storage space, and eventual write-off risk.",
      "Use Operations > Inventory exported to CSV to calculate days-on-hand for each product.",
      "A 15–20% clearance discount that moves dead stock in 2 weeks is almost always better than holding for full price."
    ],
    content: [
      {
        heading: "What dead stock is really costing you",
        body: "A product that cost KSh 500 and has been sitting on your shelf for 90 days without selling isn't just unsold — it is costing you money every day. The cash tied up in that product could be invested in a fast-moving item that turns over twice a month. Additionally, dead stock occupies shelf space that fast-moving products could occupy, reducing visibility and sales of your better performers. AskBiz helps you identify dead stock before it becomes a problem that requires a painful write-off.",
        image: "/images/training/pos-inventory.png",
      },
      {
        heading: "Step 1 — Export Inventory to CSV and calculate days-on-hand",
        body: "Go to Operations > Inventory and export your product list to CSV. In the spreadsheet, add a column for 'Monthly sales velocity' (units sold per month from your Sales Report). Then calculate days-on-hand: Current Stock ÷ (Monthly Velocity ÷ 30) = days until zero. Any product showing 90+ days-on-hand at current sales velocity is a dead stock candidate. Products showing 180+ days are a priority for clearance action."
      },
      {
        heading: "Step 2 — Cross-reference with the last sale date",
        body: "A product with 90 days-on-hand might still be selling slowly — some seasonal items naturally turn slowly. The sharper test is: when was the last sale? In Operations > Reports, search by product name to see the most recent transaction date. A product that hasn't sold in 45 days (outside of its known seasonal off-period) is dead stock by most retail definitions. Flag these for a pricing or positioning review."
      },
      {
        heading: "Calculating the true cost of holding dead stock",
        body: "For each dead stock product, calculate: (Current stock × Cost price) = capital tied up. Sum this across all dead stock products. If KSh 25,000 is tied up in slow-moving products, that is KSh 25,000 that could be used to purchase fast-turning stock that generates margin every week. The opportunity cost of dead stock — not just its face value — is why clearance pricing at 20% below cost is often the correct financial decision."
      },
      {
        heading: "Three clearance strategies that work",
        body: "Strategy 1 — Bundle: pair a dead stock product with a fast-moving one at a combined discount. Customers buying the popular item get the slow mover 'almost free'. Strategy 2 — Location move: dead stock at the back of the store often sells when moved to the till counter or front display. Try repositioning before discounting. Strategy 3 — Flash discount: create a named promotion in Operations > Promotions (e.g. 'Clearance 20% off') and apply it selectively to dead stock SKUs. Run it for one week and track what moves."
      },
      {
        heading: "Building a monthly dead stock review habit",
        body: "Set a recurring first-Monday-of-the-month task: export Inventory, filter for products with stock greater than zero, and sort by last-sale date ascending. The top of this list — products not sold in the longest time — are your clearance priorities. Act on the top 5 each month: either reposition, bundle, discount, or write off. This monthly habit prevents dead stock from accumulating to the point where it requires a painful bulk clearance sale."
      }
    ],
    relatedSlugs: ["pos-report-top-sellers-askbiz", "pos-hack-reorder-alerts-askbiz", "pos-report-stock-value-askbiz"],
    faq: [
      { q: "Can AskBiz automatically flag slow-moving products?", a: "The Inventory Report sub-view includes 'dead stock' and 'slow-moving' filters. Go to Operations > Reports > Inventory Report for a pre-built slow-mover list based on your sales velocity data." },
      { q: "Should I always try to sell dead stock or can I return it to the supplier?", a: "Check your supplier's return policy first — many FMCG suppliers accept returns within 90 days. Returning unsold stock to the supplier avoids the need for clearance pricing and restores your full cost price." }
    ]
  },

  // 7 ─── Refund Rate ────────────────────────────────────────────────────────────
  {
    slug: "pos-report-refund-rate-askbiz",
    title: "What Your Refund Rate Tells You About Product Quality",
    description: "How to use the AskBiz POS Refunds metric and Returns Report to detect product quality issues, cashier errors, and customer dissatisfaction before they damage your reputation.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["refund rate", "returns report", "product quality", "customer satisfaction", "AskBiz POS", "void and returns", "return analysis", "cashier errors"],
    keyTakeaways: [
      "A refund rate above 2% of transactions warrants investigation — either a product quality issue or a cashier error pattern.",
      "The Returns Report in Operations > Reports shows return reasons, cashier attribution, and product-level return rates.",
      "Distinguish between cashier-initiated voids (errors) and customer-initiated returns (quality/satisfaction).",
      "A spike in returns on a specific product is an immediate signal to check that product's quality, expiry, or description accuracy."
    ],
    content: [
      {
        heading: "How to read your refund rate",
        body: "On the POS Overview, the 'Refunds' metric shows the count of refund transactions for the selected period. Divide this by total Sales count to get your refund rate percentage. A rate of 0–1% is excellent. 1–2% is normal for most retail. Above 2% needs investigation. Above 5% indicates a systemic problem — either a specific product is defective, cashier training is poor, or your return policy is creating incentives for frequent returns.",
        image: "/images/training/pos-void-cancel.png",
      },
      {
        heading: "The Returns Report: breaking down the why",
        body: "Go to Operations > Reports > Returns Report ('Return rates, reasons & refund totals'). This shows each return with: the product, the cashier who processed it, the return reason (if recorded), the refund method, and the date. Sort by product name to see if any single product has an unusually high return rate. A product that appears in 40% of all returns clearly has an issue — packaging, quality, description mismatch, or incorrect pricing."
      },
      {
        heading: "Distinguishing cashier voids from customer returns",
        body: "Not all returns are equal. A cashier void before payment is a till correction — the sale was never completed. A post-payment void is either a customer return or a cashier error after payment. Check the Audit Log in Operations > Audit filtered by 'Returns'. Voids processed within seconds of a sale (same cashier, same session, no gap) are likely corrections. Voids processed hours later or by a manager are likely genuine returns. Treating them as the same metric distorts your quality signal."
      },
      {
        heading: "Product-level return analysis",
        body: "If your overall refund rate is acceptable but one product has a return rate 10× the average, that product is the issue — not your overall operation. Take immediate action: (1) Pull remaining stock and inspect for quality issues. (2) Check the sell-by date — expired or near-expiry products generate returns. (3) Review the product description and price in Inventory — a mismatch between what customers expect and what they receive is a common return driver. (4) Contact the supplier if the issue is consistent across multiple deliveries."
      },
      {
        heading: "Using return data in cashier performance reviews",
        body: "If one cashier's sessions account for a disproportionate share of post-payment voids, investigate their checkout process. This can indicate: (1) charging the wrong price and correcting it after payment, (2) processing the same item twice and voiding one, or (3) a lack of confidence at the till causing mistakes. Show the cashier their void rate vs the team average and provide targeted training on the specific error pattern you can see in the Audit trail."
      },
      {
        heading: "Setting a refund rate target and acting on deviations",
        body: "Write your target refund rate on the back-office whiteboard: 'Refund rate target: under 1.5%'. Check weekly — if this week's rate is above target, open the Returns Report and identify whether it's a product issue, a cashier issue, or a one-off event (e.g. a power cut caused multiple order errors). This structured response to deviations — identify, categorise, act — prevents temporary refund spikes from becoming permanent patterns."
      }
    ],
    relatedSlugs: ["pos-void-cancel-askbiz", "pos-hack-cashier-report-filter-askbiz", "pos-hack-audit-log-shrinkage-askbiz"],
    faq: [
      { q: "Are refund amounts automatically deducted from revenue in Reports?", a: "Yes — completed refunds reduce the period's Revenue and Gross Profit totals automatically. The Refund count on Overview shows you how many such transactions occurred." },
      { q: "Can I see which refund method was used (cash vs store credit)?", a: "Yes — the Returns Report shows the refund method for each transaction. This is useful for tracking how much cash has left the till through refunds vs store credit issued." }
    ]
  },

  // 8 ─── Promotions ROI ─────────────────────────────────────────────────────────
  {
    slug: "pos-report-promotions-roi-askbiz",
    title: "Was the Discount Worth It? Measuring Promotion ROI",
    description: "How to use the AskBiz Discounts Report to calculate whether a promotion generated enough additional revenue to justify the margin reduction — in three simple steps.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["promotions ROI", "discount analysis", "promotions report", "AskBiz POS", "discount effectiveness", "margin impact", "promotional spend", "clearance analysis"],
    keyTakeaways: [
      "The Discounts Report in Operations > Reports shows total discount value given, by promotion name and period.",
      "A promotion is ROI-positive if it generates incremental revenue greater than the discount value surrendered.",
      "Compare promotion weeks to non-promotion weeks using the same date range filter.",
      "The break-even uplift formula: discount % ÷ (margin % − discount %) = minimum revenue uplift needed."
    ],
    content: [
      {
        heading: "The question every business owner should ask after a promotion",
        body: "You ran a 20% off promotion last week. Revenue was higher than the week before. But was the promotion responsible, or was it just a busier week? And did the extra revenue cover the margin you gave away? AskBiz gives you the data to answer both questions precisely — through the Discounts Report and a simple break-even calculation that takes 5 minutes.",
        image: "/images/training/pos-apply-discount.png",
      },
      {
        heading: "Step 1 — Find your total discount spend",
        body: "Go to Operations > Reports > Discounts Report ('Promotions usage & discount totals'). Select the promotion period and note: (1) Total discount value given, (2) Number of transactions that used the promotion, and (3) Which promotion name was applied. If you ran 'Summer Sale 20%' and gave away KSh 4,200 in discounts across 35 transactions, that is KSh 4,200 of revenue you surrendered. This is your promotional spend."
      },
      {
        heading: "Step 2 — Calculate the break-even uplift needed",
        body: "Use the break-even formula: Discount% ÷ (Margin% − Discount%) = minimum revenue uplift needed. At 44% margin and a 20% discount: 20 ÷ (44 − 20) = 20 ÷ 24 = 0.83. You needed at least 83% more revenue during the promotion week than a normal week just to break even. If your Revenue was up 30% from the previous week, the promotion cost you money on a net basis. If Revenue was up 120%, the promotion was clearly profitable."
      },
      {
        heading: "Step 3 — Compare promotion period to baseline",
        body: "Select Last 7 days in Reports to see the promotion week's Revenue and Gross Profit. Then change the date range to the equivalent week before the promotion (use the custom date range picker). Compare Revenue and — critically — Gross Profit (not just Revenue) between the two periods. A promotion that increases Revenue but reduces total Gross Profit has not worked. A promotion that increases both Revenue and Gross Profit has worked."
      },
      {
        heading: "Common promotions that always hurt margin",
        body: "Three promotion types consistently destroy margin without generating compensating uplift: (1) General 'everything 15% off' with no minimum spend — attracts existing customers at lower margin rather than new customers. (2) End-of-month discount right before payday — customers would have bought anyway. (3) Promotions not communicated externally — if only existing customers know about the discount, no new revenue is generated and you simply gave away margin to people who would have paid full price."
      },
      {
        heading: "Building a promotion evaluation habit",
        body: "After every promotion, complete this 5-minute review: Open Reports, compare promotion week to the same weekday baseline, check Discounts Report for total discount given, calculate whether Gross Profit increased or decreased. File the result as a note (even just in your phone) with the promotion name, discount offered, and outcome (positive/negative ROI). After 6 promotions, you'll have a clear picture of which types work for your business and which don't."
      }
    ],
    relatedSlugs: ["pos-apply-discount-askbiz", "pos-report-margin-trend-askbiz", "pos-hack-discount-presets-askbiz"],
    faq: [
      { q: "Can I see which products were discounted most during a promotion?", a: "The Discounts Report shows discount usage by promotion name. Cross-reference with the Sales Report sorted by promotion-period revenue to see which products moved during the promotion." },
      { q: "How do I stop discounts from being applied to already low-margin products?", a: "In Operations > Promotions, you can set promotions to apply only to specific product categories. Exclude your low-margin categories from automatic discounts to protect those margins." }
    ]
  },

  // 9 ─── Category Performance ───────────────────────────────────────────────────
  {
    slug: "pos-report-category-performance-askbiz",
    title: "Which Product Category Makes You the Most Money?",
    description: "How to use the AskBiz Sector filter and Sales Report to compare profitability across product categories — and decide where to expand, cut, or reprice.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["category performance", "product category", "sector analysis", "margin by category", "AskBiz reports", "retail analytics", "product mix", "profitability by category"],
    keyTakeaways: [
      "The Sector filter on Reports lets you view Revenue, Margin, and Gross Profit for each product category separately.",
      "High-revenue categories with low margins need repricing; low-revenue categories with high margins need more stock and visibility.",
      "Category-level analysis is the fastest way to decide where to expand your product range.",
      "Assign every product a sector in Inventory to make category reporting accurate and useful."
    ],
    content: [
      {
        heading: "Category reporting: the view most owners miss",
        body: "Looking at total business revenue is like looking at your business from 1,000 feet — you can see the shape but not the detail. Category-level reporting zooms in to show which product types generate the most revenue and the highest margins. In a multi-category business (grocery, beauty, household), different categories can have wildly different margins — and the mix of what sells determines your overall profitability. AskBiz's Sector filter gives you this view in seconds.",
        image: "/images/training/pos-report-sales.png",
      },
      {
        heading: "Step 1 — Set the Sector filter and read each category",
        body: "Go to Operations > Reports. Use the Sector dropdown at the top to select one category at a time: Retail, Restaurant, Salon, Repair, Factory. For each sector, note the Revenue, Gross Profit, and Margin. Keep a simple table: Category | Revenue | Margin %. Five minutes of note-taking gives you the full category breakdown for the past 30 days. This is your product portfolio view."
      },
      {
        heading: "Interpreting the category table",
        body: "Four scenarios require action: (1) High Revenue, High Margin — this is your star category. Invest in it: more stock, more variety, more shelf space. (2) High Revenue, Low Margin — your volume driver with thin profits. Reprice to improve margin or negotiate better supplier terms. (3) Low Revenue, High Margin — hidden gem. These products are profitable but underexposed. Move them to better shelf positions and add them to promotions. (4) Low Revenue, Low Margin — candidates for removal. These categories drain cash and space without compensating returns."
      },
      {
        heading: "Making category expansion decisions",
        body: "When considering whether to add a new product category, look at categories that already show High Margin in your current range. If your beauty products deliver 52% margin and your grocery products deliver 22%, adding more beauty SKUs is a better capital allocation decision than expanding grocery. AskBiz category data replaces gut feel with evidence when making these expansion decisions."
      },
      {
        heading: "Using category data with suppliers",
        body: "When a supplier pitches you on adding their products, ask yourself: what category is this? What margin does that category currently deliver in my business? If their product is in a category that consistently underperforms in your store, you have objective grounds for either declining or negotiating better terms. This is a significant negotiating advantage that most small retailers don't use."
      },
      {
        heading: "Keeping your sector assignments accurate",
        body: "Category analysis is only as good as your product sector assignments. Go to Operations > Inventory and filter by 'All Sectors'. The banner at the top shows how many products have no sector tag (in this example, 4 items). Tag all untagged products immediately — without a sector assignment, a product's sales don't appear in any category filter and your category analysis is incomplete. Run a quarterly audit to ensure new products added via 'Scan to add' have been correctly categorised."
      }
    ],
    relatedSlugs: ["pos-report-top-sellers-askbiz", "pos-report-margin-trend-askbiz", "pos-report-slow-movers-askbiz"],
    faq: [
      { q: "What's the difference between 'Sector' and 'Category' in AskBiz?", a: "Sector refers to the business type (Retail, Restaurant, Salon, etc.). Category is a sub-classification within a sector (e.g. Beverages, Snacks within Retail). Both can be used as filters in Inventory and contribute to the sector-level reporting." },
      { q: "Can I rename or customise the sectors to match my business?", a: "The core sectors (Retail, Restaurant, Salon, Repair, Factory, Logistics) reflect the supported business types. For finer category breakdown within a sector, use product categories in Inventory." }
    ]
  },

  // 10 ─── Day of Week Analysis ─────────────────────────────────────────────────
  {
    slug: "pos-report-day-of-week-askbiz",
    title: "Day-of-Week Analysis: Optimise for Your Busiest Days",
    description: "How to use AskBiz POS date filters to identify which days of the week generate the most revenue — and adjust stock, staffing, and promotions accordingly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["day of week", "busiest day", "trading pattern", "weekly analysis", "AskBiz POS", "sales pattern", "stock planning", "promotion timing"],
    keyTakeaways: [
      "Use the custom date range picker to isolate any single day of the week across 4 weeks and compare revenue.",
      "Most retail businesses have a clear best day (often Friday or Saturday) — this day needs maximum stock and staffing.",
      "Promote on your second-busiest day to lift it closer to your peak — not on your slowest day where demand is structurally low.",
      "Align deliveries to arrive the day before your busiest day so stock is at maximum heading into peak trading."
    ],
    content: [
      {
        heading: "Why day-of-week matters more than monthly totals",
        body: "A business doing KSh 12,000 per week might generate KSh 5,000 on Friday and KSh 800 on Monday. Managing both days identically — same staff, same stock levels, same display — means you're overstaffed on Monday and under-stocked on Friday. AskBiz's date filters let you isolate individual days to build a day-of-week profile in under 10 minutes. Once you know your pattern, every operational decision improves.",
        image: "/images/training/pos-report-hourly.png",
      },
      {
        heading: "Building your day-of-week profile",
        body: "Go to POS > Overview. Use the custom date range picker to select last Monday (e.g. 26 May to 26 May). Note the Revenue. Then select the Monday before that (19 May to 19 May). Average the two — this is your typical Monday revenue. Repeat for each day of the week. After 15 minutes you'll have a 7-day revenue profile: Monday KSh X, Tuesday KSh Y, etc. This is your trading calendar — the foundation for all scheduling and stock decisions."
      },
      {
        heading: "The two days that matter most: your peak and your second peak",
        body: "Your peak day deserves maximum operational attention: full stock, maximum cashiers, all promotions active, supplier delivery scheduled for the day before. Your second-peak day is where promotional investment has the highest return — it's already active, and a well-placed promotion can lift it to near-peak levels. Your slowest day is not where promotions work — low-traffic days have structural reasons for low footfall that a discount alone won't fix."
      },
      {
        heading: "Aligning supplier deliveries to the day-of-week pattern",
        body: "If Friday is your peak day, your shelves need to be fully stocked by Thursday evening. This means placing supplier orders by Tuesday (assuming 2-day delivery). Work backwards from your peak day to set your ordering schedule. For fast-moving products, check stock levels every Wednesday and place orders immediately for anything below the reorder threshold. This single scheduling habit eliminates the most common cause of stock-outs on your busiest day."
      },
      {
        heading: "Seasonal day-of-week shifts",
        body: "The day-of-week pattern can shift seasonally. A business that sees Saturday peaks in the dry season might see Friday peaks during school term times as families shop earlier in the week. Rebuild your day-of-week profile every quarter using the custom date range picker with 4-week samples. If your peak day has shifted, update your ordering schedule and staffing roster accordingly."
      }
    ],
    relatedSlugs: ["pos-report-hourly-sales-askbiz", "pos-report-mom-growth-askbiz", "pos-hack-daily-brief-routine-askbiz"],
    faq: [
      { q: "Can AskBiz show me a weekly comparison chart automatically?", a: "Use the Last 7 days filter and the Sales By Hour chart for a visual weekly overview. For day-by-day comparison, the custom date range method above gives the most precise data." },
      { q: "Is there a way to see day-of-week performance per branch?", a: "Yes — use the Branch filter alongside custom date ranges. Select a specific branch and a specific day to get that location's performance for that day of the week." }
    ]
  },

  // 11 ─── Average Basket Size ───────────────────────────────────────────────────
  {
    slug: "pos-report-avg-basket-askbiz",
    title: "Average Basket Size: The Metric That Reveals Buying Behaviour",
    description: "How to track and improve your AskBiz average sale value — the single metric that shows whether customers are buying more or less per visit without changes in footfall.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["average basket size", "average sale value", "upselling", "basket analysis", "AskBiz POS", "customer spending", "revenue per transaction", "buying behaviour"],
    keyTakeaways: [
      "Avg Sale on the Overview is total Revenue divided by total transactions — your average customer spend per visit.",
      "A declining Avg Sale with stable transaction count means customers are buying fewer items per visit.",
      "Upselling techniques — suggesting add-ons, bundles, and complementary products — are the fastest way to raise Avg Sale.",
      "Track Avg Sale weekly and set a target: a KSh 50 increase in Avg Sale across 100 weekly transactions = KSh 5,000 more revenue."
    ],
    content: [
      {
        heading: "Avg Sale: the metric hiding in plain sight",
        body: "The 'Avg sale' figure on the POS Overview — currently KSh 412.07 for the last 30 days — is one of the most actionable metrics in your business. It tells you the average amount each customer spends when they visit. If this number drops from KSh 412 to KSh 360 over a month, and your transaction count hasn't changed, your total revenue just dropped by 12.6% — without a single customer being lost. Raising Avg Sale by 10% is often easier than finding 10% more customers.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "What causes Avg Sale to change",
        body: "Avg Sale rises when: customers buy more items per visit, cashiers suggest add-ons (upselling), bundles encourage larger purchases, or high-value products are prominently displayed and well-stocked. Avg Sale falls when: a popular high-value product goes out of stock, promotions reduce item prices without increasing volume sufficiently, or cashiers stop engaging customers with add-on suggestions. The AskBiz Avg Sale metric tracks the outcome — investigating why requires looking at both product performance and cashier behaviour."
      },
      {
        heading: "Three upselling techniques that raise Avg Sale at the till",
        body: "Technique 1 — Companion suggestion: train cashiers to suggest one complement for the most common purchases. 'You've got bread — we have fresh milk just in' takes 5 seconds. Technique 2 — Bundle pricing: create a product bundle in Promotions (e.g. 'Rice + Cooking Oil combo — save KSh 30'). Customers who were buying one buy both. Technique 3 — Minimum spend upsell: 'You're KSh 80 away from free delivery / a 10% discount' — uses the cognitive bias of almost reaching a threshold."
      },
      {
        heading: "Tracking Avg Sale by cashier",
        body: "Go to Overview > Staff Performance and compare Avg Sale per cashier. If Phidisia shows KSh 412 Avg Sale but a second cashier shows KSh 280, the lower-Avg Sale cashier is either processing smaller baskets or not upselling. This is a coaching opportunity: show them their number, set a target, and review again in two weeks. A 10% improvement in one cashier's Avg Sale across 70 daily transactions adds KSh 280 per day, or KSh 8,400 per month, without a single additional customer."
      },
      {
        heading: "Setting and tracking an Avg Sale target",
        body: "Go to Operations > Reports, select Last 30 days, note the current Avg Sale. Set a target 10–15% above it. Write it on the whiteboard: 'Avg Sale target: KSh 450'. Each Monday, check this week's Avg Sale vs the target. If it's below, focus on upselling technique training that week. If it's above, celebrate and raise the target by another 5%. This progressive target-setting approach — rooted in your own data — consistently raises Avg Sale over a 3–6 month period."
      }
    ],
    relatedSlugs: ["pos-report-sales-overview-askbiz", "pos-report-top-sellers-askbiz", "pos-hack-daily-brief-routine-askbiz"],
    faq: [
      { q: "Does Avg Sale include refunded transactions?", a: "Refunds reduce the Revenue total which feeds into the Avg Sale calculation. A period with many refunds will show a lower Avg Sale. Check the Refund count alongside Avg Sale to contextualise any unexpected drops." },
      { q: "Can I see average basket size by product category?", a: "Use the Sector filter on Reports and the total Sales count for each sector to derive category-level Avg Sale. Total sector revenue ÷ sector transaction count gives the average basket for that category." }
    ]
  },

  // 12 ─── Stock Value Report ────────────────────────────────────────────────────
  {
    slug: "pos-report-stock-value-askbiz",
    title: "Understanding Your Stock Value Report",
    description: "What the AskBiz Stock Value figure means, how it's calculated, why it matters for your business finances, and how to keep it accurate as stock moves.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["stock value", "inventory valuation", "COGS", "AskBiz reports", "stock report", "asset value", "business finance", "inventory cost"],
    keyTakeaways: [
      "Stock Value (KSh 182,297.75 in this example) is the total cost price of all current inventory — not the selling price.",
      "Stock Value represents a business asset on your balance sheet — it directly affects your working capital position.",
      "Stock Value only stays accurate if cost prices are filled in for all products and stock counts are up to date.",
      "A rising Stock Value with declining Revenue indicates over-buying — money is accumulating on shelves instead of converting to cash."
    ],
    content: [
      {
        heading: "What Stock Value actually means",
        body: "The Stock Value figure on the Reports hub — KSh 182,297.75 in this example — is the total cost price of all products currently in your Inventory multiplied by their stock quantities. It represents the cash your business has invested in physical goods sitting on shelves and in storage. This is an asset on your balance sheet: it can be converted back to cash through sales. Understanding this figure helps you manage working capital and avoid over-investing in stock.",
        image: "/images/training/pos-reports.png",
      },
      {
        heading: "How AskBiz calculates Stock Value",
        body: "For each product in Inventory, AskBiz multiplies: (Current Stock Quantity) × (Cost Price per unit). It then sums this across all products and branches to produce the total Stock Value. If a product has no cost price entered, it contributes zero to the Stock Value figure — which means your actual stock value is higher than shown. This is why entering accurate cost prices in Inventory is a financial accuracy task, not just a reporting one."
      },
      {
        heading: "Stock Value and working capital",
        body: "Working capital is the money available to run your business day-to-day. Stock is a form of frozen working capital — it's value tied up in goods rather than available as cash. If your Stock Value is KSh 182,000 and your monthly Revenue is KSh 55,000, you have over 3 months of revenue sitting in stock. For some businesses this is appropriate (seasonal stock build-up). For most, 1–1.5 months of stock value is the healthy range. If Stock Value is rising while Revenue is flat, you are over-buying."
      },
      {
        heading: "What to do when Stock Value is too high",
        body: "An over-stocked position requires either accelerated selling or reduced purchasing. Step 1: identify the products contributing most to the high Stock Value (export Inventory, multiply quantity × cost, sort descending). Step 2: for products where you have 90+ days of stock on hand at current velocity, suspend new orders until stock drops. Step 3: for perishables or products at risk of obsolescence, apply clearance pricing immediately to convert stock to cash before it loses value."
      },
      {
        heading: "Tracking Stock Value weekly as a business health indicator",
        body: "Note your Stock Value every Monday alongside Revenue and Gross Profit. The ratio to watch is: Stock Value ÷ Weekly Revenue. If this ratio is rising (Stock Value growing faster than Revenue), purchasing needs to slow down. If it's falling, stock is converting to sales faster than it's being replenished — check Low Stock alerts to ensure this isn't causing stock-outs. A stable ratio, around 4–6 weeks of revenue, is the healthy operating target for most retail businesses."
      }
    ],
    relatedSlugs: ["pos-report-slow-movers-askbiz", "pos-hack-reorder-alerts-askbiz", "pos-hack-supplier-po-fast-askbiz"],
    faq: [
      { q: "Is Stock Value shown at cost price or selling price?", a: "AskBiz shows Stock Value at cost price — what you paid for the stock, not what you plan to sell it for. This is the standard accounting treatment and matches the balance sheet asset value." },
      { q: "Can I see Stock Value per branch?", a: "Yes — use the Branch filter on Operations > Reports to see Stock Value for a specific location. The Branches tab in Operations also shows stock value per branch at a glance." }
    ]
  },

  // 13 ─── Cashier Compare ───────────────────────────────────────────────────────
  {
    slug: "pos-report-cashier-compare-askbiz",
    title: "Compare Cashier Performance Side-by-Side",
    description: "How to use AskBiz Staff Performance reporting to compare cashiers objectively — sales count, revenue, Avg Sale, and void rate — and build a data-driven coaching culture.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["cashier comparison", "staff performance", "sales per cashier", "AskBiz reports", "cashier analytics", "till performance", "employee reporting", "cashier coaching"],
    keyTakeaways: [
      "The Staff Performance section on Overview shows each cashier's revenue, sales count, and Avg Sale side by side.",
      "Compare cashiers on the same shifts and date ranges to control for customer traffic differences.",
      "A cashier with lower Avg Sale than peers may need upselling coaching, not disciplinary action.",
      "Sharing performance data with cashiers directly — showing them their numbers — improves performance faster than instructions alone."
    ],
    content: [
      {
        heading: "Moving from impressions to data in staff management",
        body: "Most staff performance conversations in retail are based on impressions — who seems busy, who smiles at customers, who you like working with. AskBiz replaces impressions with comparable data: cashier A processed 47 transactions at an Avg Sale of KSh 412, cashier B processed 31 transactions at KSh 218. These numbers don't require interpretation — they show a clear performance gap that deserves a coaching conversation.",
        image: "/images/training/pos-cashier-shifts.png",
      },
      {
        heading: "Where to find the comparison data",
        body: "Go to POS > Overview, select Last 7 days (or Last 30 days for a larger sample), and scroll down to 'STAFF PERFORMANCE'. This section shows each cashier who was active in the period with their name, total revenue, and sales count. From these two numbers you can calculate Avg Sale for each cashier: Revenue ÷ Sales count. For void rate, go to Operations > Staff and click on each cashier's session history."
      },
      {
        heading: "Controlling for shift differences when comparing",
        body: "A cashier working Friday and Saturday will naturally show higher revenue than one working Monday and Tuesday, because more customers shop on weekends. To compare fairly, filter by the same date range and look at Avg Sale and void rate rather than absolute revenue. Avg Sale is independent of customer count — it reflects what each cashier does with every customer they serve. This is the most meaningful performance comparator."
      },
      {
        heading: "The three metrics that matter for cashier coaching",
        body: "Metric 1 — Avg Sale: low means missing upselling opportunities. Metric 2 — Void rate (voids ÷ total transactions): high means checkout errors or misuse of the refund function. Metric 3 — Session closure compliance: does the cashier close their session at the end of every shift? All three are visible in AskBiz within 2 minutes. These three metrics replace a 30-minute subjective performance review with a 5-minute data-driven conversation."
      },
      {
        heading: "Running a performance review conversation with data",
        body: "Bring a printed or screen-shared copy of the cashier's stats to the review conversation: 'Here are your numbers for the past 30 days. Your Avg Sale is KSh 280 — the team average is KSh 380. Here is what that gap means in revenue terms. Let's talk about what's happening at checkout.' This framing — neutral numbers, no accusation — reduces defensiveness and focuses the conversation on specific behaviours rather than general performance."
      },
      {
        heading: "Incentivising Avg Sale improvement with data transparency",
        body: "Post the team's weekly Avg Sale figures (without names if culturally sensitive, or with names if your team is competitive) on a whiteboard in the back office. When cashiers see their number relative to the team every week, most naturally improve without explicit instruction. Pairing this with a simple incentive — 'Cashier with highest Avg Sale this month gets a KSh 500 bonus' — creates a self-reinforcing improvement loop driven by data."
      }
    ],
    relatedSlugs: ["pos-hack-cashier-report-filter-askbiz", "pos-cashier-shifts-askbiz", "pos-report-hourly-sales-askbiz"],
    faq: [
      { q: "Can I set individual sales targets for each cashier in AskBiz?", a: "Individual targets are currently managed externally (whiteboard or team communication). AskBiz provides the actual performance data — set the target externally and compare to actuals in the Staff Performance view." },
      { q: "What if a cashier's revenue is low because they mostly serve small purchases?", a: "Filter by the same product category or sector for each cashier to control for product mix. If one cashier handles only snack sales and another handles electronics, raw revenue comparison is misleading — Avg Sale within the same category is more meaningful." }
    ]
  },

  // 14 ─── Customer Frequency ────────────────────────────────────────────────────
  {
    slug: "pos-report-customer-frequency-askbiz",
    title: "Customer Purchase Frequency: Who's Actually Coming Back?",
    description: "How to use the AskBiz Customer Report and loyalty data to understand repeat purchase rates, identify your most valuable customers, and reduce churn before it shows in revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["customer frequency", "repeat customers", "customer retention", "loyalty", "AskBiz reports", "customer analytics", "churn", "lifetime value"],
    keyTakeaways: [
      "The Customer Report in Operations > Reports shows retention, lifetime value, and purchase frequency per customer.",
      "Repeat customers are 5–7× cheaper to sell to than acquiring new ones — tracking frequency protects revenue.",
      "A customer who visited weekly for 3 months and then stopped is a churn signal — reach out before they're gone.",
      "Your top 20% of customers by frequency likely generate 60–70% of your revenue — protect them actively."
    ],
    content: [
      {
        heading: "Why customer frequency is more valuable than customer count",
        body: "Having 500 customers who each visit once a year is very different from having 100 customers who visit weekly. The 100 frequent visitors generate the same revenue — but they are far more predictable, more loyal, and more responsive to promotions. AskBiz's Customer Report reveals your frequency distribution: how many customers visit weekly, monthly, and rarely. This distribution tells you whether your business has a loyal core or a transactional customer base.",
        image: "/images/training/pos-customer-credit.png",
      },
      {
        heading: "Finding your most frequent customers",
        body: "Go to Operations > Customers. Sort by 'Total visits' or 'Last purchase date' to see your most active customers at the top. Your top 20 by frequency are your VIP customers — they visit most often, buy the most, and are most at risk if they have a bad experience. Review this list monthly: are the same customers appearing? Are any frequent customers missing from recent weeks? A customer who used to visit weekly but hasn't appeared in 3 weeks is a churn risk."
      },
      {
        heading: "Using the Customer Report for retention analysis",
        body: "Go to Operations > Reports > Customer Report ('Retention, lifetime value & segments'). This report shows: average visit frequency, retention rate (customers who returned in the past 30 days vs those who didn't), top customers by lifetime value, and customer segments by spending level. The retention rate is the most important single figure — if it's declining, customers are visiting once and not returning. Investigate: Is there a product they can't find? Has service quality dropped?"
      },
      {
        heading: "Identifying at-risk customers before they churn",
        body: "A customer who visited regularly for 60+ days and then stopped is not lost — they are at risk. Go to Operations > Customers, sort by 'Last purchase date' ascending. Find customers whose last visit was 14–30 days ago but who previously visited frequently. These are your 'at-risk' segment. Reach out — a WhatsApp message, a personal phone call, or a loyalty points reminder — re-engages 20–40% of at-risk customers before they fully disengage."
      },
      {
        heading: "Building customer frequency into your growth strategy",
        body: "Set a monthly target for repeat visit rate: 'Goal: 60% of customers who visited last month should visit again this month.' Track this figure in the Customer Report. The levers for improving it include: loyalty programme (every visit earns something), consistent stock (customers return when they know you have what they want), and relationship (cashiers who remember regulars create reasons to return). Each of these is measurable through AskBiz's customer and loyalty data."
      }
    ],
    relatedSlugs: ["pos-hack-loyalty-fast-lookup-askbiz", "pos-hack-customer-credit-refund-askbiz", "pos-customer-credit-askbiz"],
    faq: [
      { q: "Can I see purchase frequency for customers who don't have a loyalty card?", a: "AskBiz tracks frequency for customers attached to a sale (by phone number, loyalty card, or profile). Anonymous transactions without a customer attached cannot be attributed to an individual." },
      { q: "Can I export my customer list for email marketing?", a: "Customer data can be exported from Operations > Customers. Use the CSV export to build a marketing list — ensure your email communications comply with applicable data privacy regulations." }
    ]
  },

  // 15 ─── Branch Revenue Breakdown ─────────────────────────────────────────────
  {
    slug: "pos-report-branch-revenue-askbiz",
    title: "Branch Revenue Breakdown: Making Location Decisions with Data",
    description: "How to use AskBiz POS branch-level revenue and margin data to compare your locations objectively — and make opening, closing, and resourcing decisions based on evidence.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["branch revenue", "location performance", "multi-branch analytics", "AskBiz reports", "branch comparison", "POS analytics", "location intelligence", "branch management"],
    keyTakeaways: [
      "Use the Branch filter on Overview and Reports to see Revenue, Margin, and Avg Sale per location.",
      "Compare branches on margin %, not just revenue — a lower-revenue branch can be more profitable if margin is higher.",
      "Stock Value per branch (visible in Operations > Branches) shows whether a location is over- or under-invested in inventory.",
      "A branch that consistently underperforms on margin warrants a pricing, product mix, or cost review before any closure decision."
    ],
    content: [
      {
        heading: "The right questions to ask about each branch",
        body: "When comparing branches, most owners ask: 'Which branch makes more money?' The right question is: 'Which branch is more efficient at converting stock investment into gross profit?' A branch with KSh 30,000 revenue at 44% margin generates KSh 13,200 gross profit. A branch with KSh 45,000 revenue at 22% margin generates KSh 9,900 gross profit. The lower-revenue branch is more profitable. AskBiz gives you the data to make this distinction rather than being misled by revenue figures alone.",
        image: "/images/training/pos-multiple-tills.png",
      },
      {
        heading: "Building a branch comparison table",
        body: "Open POS Overview in two browser tabs. Set one to Branch: Town with Last 30 days. Set the other to Branch: Bondeni with Last 30 days. Create a simple table: Branch | Revenue | Gross Profit | Margin % | Avg Sale | Low Stock Count. Read each figure from the relevant tab and fill in the table. This takes 3 minutes and gives you a complete side-by-side branch comparison that would otherwise require a spreadsheet and manual data entry."
      },
      {
        heading: "Comparing margin, not just revenue",
        body: "If Town branch has higher revenue but lower margin than Bondeni, investigate why: Does Town have different product mix (more low-margin grocery, less high-margin beauty)? Does Town apply more discounts (check the Discounts Report filtered by branch)? Are Town's cost prices accurate in Inventory? The margin comparison often reveals a specific operational issue that can be fixed — rather than an inherent location weakness."
      },
      {
        heading: "Stock investment per branch",
        body: "Go to Operations > Branches. This shows each branch's Stock Value (total inventory at cost price). Compare Stock Value to each branch's monthly Revenue. The ratio (Stock Value ÷ Monthly Revenue) should be similar across branches. If one branch has significantly higher Stock Value per revenue pound, it is over-stocked relative to its trading volume — excess stock should be redistributed to the higher-performing branch rather than reordered there."
      },
      {
        heading: "Making an evidence-based branch expansion decision",
        body: "Before opening a third branch, use your existing branch data as a model. Take your best-performing branch's metrics: Revenue/sqm, Stock Value/Revenue ratio, Margin %, Avg Sale, and peak hours. These are your operational benchmarks. Model the new location against them: does the proposed location have the footfall to match your best branch's transaction count? Does the catchment area support your current product mix and pricing? Evidence-based expansion fails less often than gut-feel expansion."
      }
    ],
    relatedSlugs: ["pos-hack-branch-best-performer-askbiz", "pos-multiple-tills-askbiz", "pos-hack-multi-branch-stock-sync-askbiz"],
    faq: [
      { q: "Can I set different prices for the same product at different branches?", a: "AskBiz uses a shared product catalogue with uniform pricing by default. Branch-specific pricing, if required, should be configured through separate product entries or sector settings — contact support for guidance on your specific use case." },
      { q: "How do I allocate shared overheads (rent, utilities) to individual branches in AskBiz?", a: "AskBiz tracks Gross Profit (revenue minus product costs). Overhead allocation for net profit per branch is an accounting task best handled in Xero or QuickBooks, which can receive AskBiz data via the integrations." }
    ]
  },

  // 16 ─── Cost vs Revenue Trend ─────────────────────────────────────────────────
  {
    slug: "pos-report-cost-vs-revenue-askbiz",
    title: "Cost vs Revenue Trend: A Weekly Profitability Check",
    description: "How to track the gap between your Revenue and Cost of Goods in AskBiz over time — and spot the early signs of a profitability squeeze before it reaches your bank account.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["cost vs revenue", "profitability trend", "COGS trend", "AskBiz reports", "weekly check", "margin squeeze", "cost management", "business health"],
    keyTakeaways: [
      "Gross Profit = Revenue minus COGS — tracking this gap over consecutive weeks reveals your profitability trend.",
      "A narrowing gap (Revenue stable, Gross Profit declining) is a margin squeeze — the most dangerous slow-moving business problem.",
      "Compare Last 7 days to Last 30 days every Monday to spot a developing trend before it becomes a crisis.",
      "COGS in AskBiz is calculated from product cost prices — keep these updated for trend data to be reliable."
    ],
    content: [
      {
        heading: "The gap that matters: Revenue minus COGS",
        body: "Revenue and COGS (Cost of Goods Sold) should move in a consistent ratio over time. If Revenue grows at 10% per month and COGS also grows at 10%, your margin stays constant. The danger sign is when COGS grows faster than Revenue — the gap narrows, gross profit falls, and the business generates less per sale. AskBiz shows both Revenue and Gross Profit on the Reports hub, so you can calculate COGS (Revenue minus Gross Profit) and track the trend with a weekly note.",
        image: "/images/training/pos-reports.png",
      },
      {
        heading: "Setting up a simple weekly trend tracker",
        body: "Create a simple log — a notebook or phone note works fine: Date | Revenue (Last 7 days) | Gross Profit (Last 7 days) | Margin %. Fill this in every Monday from Operations > Reports. After 4 entries you'll see a trend. After 8 entries (2 months) you'll have reliable baseline data. A margin that has drifted from 44% to 38% over 8 weeks is not visible in any single week's data — but your trend log shows it unmistakably."
      },
      {
        heading: "Three scenarios and what they mean",
        body: "Scenario 1: Revenue up, Gross Profit up, Margin stable — healthy growth. Scenario 2: Revenue stable, Gross Profit stable, Margin stable — steady state. Scenario 3: Revenue stable or up, Gross Profit falling, Margin declining — margin squeeze. Scenario 3 is the most dangerous because it looks like a normal trading week on Revenue alone. Only tracking the full trio reveals the problem. AskBiz shows all three numbers in one place — the discipline is in checking them together."
      },
      {
        heading: "What causes the margin squeeze (and how to reverse it)",
        body: "Supplier price increases without retail price adjustments are the most common cause — COGS rises while Revenue stays constant. Check your last 3 supplier invoices against your Inventory cost prices. If costs have risen 10–15% without a price update in AskBiz, update both the cost price and the selling price immediately. A 10% COGS increase on your top 10 products, unaddressed for 60 days, can reduce monthly Gross Profit by 15–20% depending on their revenue share."
      },
      {
        heading: "Revenue growth that masks a margin problem",
        body: "Promotional revenue growth is the most common Revenue-up, Margin-down scenario. You ran a 20% discount promotion, Revenue jumped 30%, but Gross Profit increased only 5%. The discount more than offset the volume gain. This is why the cost vs revenue trend check is more important than the revenue headline. Next time you see Revenue up sharply, immediately check Gross Profit — if it hasn't moved proportionally, something in the cost or discount structure needs correcting."
      }
    ],
    relatedSlugs: ["pos-report-gross-profit-askbiz", "pos-report-margin-trend-askbiz", "pos-report-promotions-roi-askbiz"],
    faq: [
      { q: "Can I export the Revenue and Gross Profit trend to a spreadsheet?", a: "Use Operations > Reports with a custom date range and the export function. Each export gives you a snapshot — collect weekly exports into a single spreadsheet to build a trend chart automatically." },
      { q: "Does AskBiz calculate net profit (after overheads)?", a: "AskBiz calculates Gross Profit (Revenue minus COGS). Net profit after rent, utilities, salaries and other overheads is an accounting function best handled in Xero or QuickBooks connected via Operations > Integrations." }
    ]
  },

  // 17 ─── Month-over-Month Growth ───────────────────────────────────────────────
  {
    slug: "pos-report-mom-growth-askbiz",
    title: "Month-over-Month Growth: Reading the Trend Line Correctly",
    description: "How to use AskBiz custom date range comparisons to calculate month-over-month revenue and profit growth — and tell the difference between real growth and seasonal noise.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["month over month", "MoM growth", "revenue growth", "trend analysis", "AskBiz reports", "business growth", "comparison period", "seasonal adjustment"],
    keyTakeaways: [
      "Month-over-month (MoM) growth compares this month's Revenue to last month's Revenue as a percentage change.",
      "AskBiz's custom date range picker lets you select any two equal-length periods for precise comparison.",
      "Compare month to the same month last year (YoY) for seasonally adjusted growth — MoM alone can be misleading.",
      "A business growing 5% MoM is doubling in revenue roughly every 14 months — track the compound effect."
    ],
    content: [
      {
        heading: "Why MoM growth tells a different story than weekly snapshots",
        body: "A single week's revenue can be affected by a public holiday, a local event, a competitor's promotion, or simply random variation. Month-over-month growth smooths out these fluctuations and shows the underlying business trend. A business showing +8% MoM Revenue growth for four consecutive months is demonstrably growing. A business showing volatile weekly revenue with flat MoM growth is active but not expanding. AskBiz's custom date ranges make this comparison a 3-minute exercise.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "Calculating MoM growth in AskBiz",
        body: "Go to POS > Overview. Use the custom date range picker to select this month (e.g. 1 June to 30 June). Note Revenue. Then change to last month (1 May to 31 May). Note Revenue. MoM growth = (This month − Last month) ÷ Last month × 100. If May was KSh 48,000 and June is KSh 55,630, MoM growth = (55,630 − 48,000) ÷ 48,000 × 100 = +15.9%. Do the same for Gross Profit to see whether profitability grew proportionally."
      },
      {
        heading: "Distinguishing seasonal growth from real growth",
        body: "If your business naturally peaks in December, a 25% MoM Revenue jump in November vs October is not impressive — it's seasonal. A 25% jump that also exceeds last November's figure is impressive — it means you grew even after accounting for seasonal effects. Use the custom date range to compare this month vs the same month last year (Year-over-Year comparison). YoY growth that exceeds 10% is typically real, organic growth in most retail sectors."
      },
      {
        heading: "What flat or negative MoM growth means",
        body: "Flat MoM revenue (within ±3%) means volume is stable. Consistent flat growth over 3+ months is a signal to investigate new growth levers — a new product category, a new branch, a loyalty programme, or a pricing review. Negative MoM growth (this month below last month) requires immediate diagnosis: Which product category fell? Which branch? Which day-of-week? Use the Sector and Branch filters on Overview to isolate where the decline occurred."
      },
      {
        heading: "Using MoM growth in team communication",
        body: "Post a single MoM growth number in your team WhatsApp group or on the back-office whiteboard at the start of each month: 'Last month we grew +8% vs the previous month. Our target this month is +10%.' This transparent goal-sharing gives everyone in the business a number to work towards. Combined with the cashier-level Avg Sale data, it connects team behaviour (what cashiers do at the till) to business outcomes (revenue growth). This connection — visible in AskBiz data — is what motivates performance at the operational level."
      }
    ],
    relatedSlugs: ["pos-report-sales-overview-askbiz", "pos-report-cost-vs-revenue-askbiz", "pos-hack-daily-brief-routine-askbiz"],
    faq: [
      { q: "Can AskBiz show me a month-over-month chart automatically?", a: "The Overview 'vs prev' indicators show percentage change vs the equivalent previous period for the selected date range. For a full month comparison, select the current month in the custom range — the vs prev figure shows MoM change." },
      { q: "How do I account for new branch openings in MoM comparisons?", a: "When comparing months before and after a new branch opened, filter by your existing branches to get a like-for-like comparison. Then show the new branch's contribution as incremental growth separately." }
    ]
  },

  // 18 ─── Export for Accountant ─────────────────────────────────────────────────
  {
    slug: "pos-report-export-accountant-askbiz",
    title: "Export Any Report to Your Accountant in 2 Minutes",
    description: "How to export AskBiz POS sales, inventory, and transaction data for your accountant — and how the Xero/QuickBooks integration eliminates manual exports entirely.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["export report", "accountant export", "CSV export", "Xero integration", "QuickBooks", "AskBiz reports", "financial export", "bookkeeping"],
    keyTakeaways: [
      "AskBiz reports can be exported to CSV from Operations > Reports using the export icon or CSV button.",
      "The Xero and QuickBooks integrations in Operations > Integrations eliminate manual exports by syncing automatically.",
      "Always set the correct date range before exporting — your accountant needs the period to match their filing period.",
      "The Audit Trail export provides a full transaction history for any period — the most comprehensive data for accountants."
    ],
    content: [
      {
        heading: "Two ways to share AskBiz data with your accountant",
        body: "You have two options for getting AskBiz data to your accountant: manual CSV export (takes 2 minutes, produces a spreadsheet file) or automatic Xero/QuickBooks sync (takes 10 minutes to set up, then runs daily without any manual action). The integration is the better long-term solution, but the CSV export is useful for ad-hoc requests, specific date ranges your accountant needs, or if you're not yet on an accounting software platform.",
        image: "/images/training/pos-report-sales.png",
      },
      {
        heading: "Step 1 — CSV export from Operations > Reports",
        body: "Go to Operations > Reports. Set the date range to the period your accountant needs (e.g. the previous month). Click the export icon (download arrow) at the top right of the screen. AskBiz generates a CSV file containing: all transactions, payment methods, cashier attribution, product-level revenue and costs, discounts applied, and refunds. This single export gives your accountant the full picture for the period. Most CSV requests from accountants can be fulfilled in under 2 minutes."
      },
      {
        heading: "What to include in your export for quarterly VAT",
        body: "For VAT reporting, your accountant needs: total Revenue (inclusive of VAT), total VAT collected, total COGS, and a transaction-level breakdown. The AskBiz Audit Trail export (Operations > Audit > export) provides all of this. For each transaction it shows the date, amount, payment method, and VAT applied. Combined with the Revenue and Gross Profit summary from the Reports hub, this is sufficient for most UK or Kenya VAT return preparations."
      },
      {
        heading: "Setting up the Xero or QuickBooks integration",
        body: "Go to Operations > Integrations. Find Xero or QuickBooks in the list and click 'Connect →'. You'll need your accounting software login credentials. Once connected, AskBiz syncs sales, refunds, and inventory movements to Xero/QuickBooks daily — automatically, without any manual export. Your accountant can then log into Xero/QuickBooks directly and see all POS data reconciled. This integration is the single biggest time-saving feature for businesses with a bookkeeper or accountant on retainer."
      },
      {
        heading: "What your accountant actually needs vs what you think they need",
        body: "Most accountants need: (1) Total Revenue for the period, (2) Total COGS, (3) A list of any large unusual transactions (voids, refunds above a threshold), and (4) Confirmation that all transactions are recorded (no cash sales off the books). AskBiz provides all four from the Reports hub export. Before sending a large raw export, ask your accountant what format they prefer — some prefer the summary (items 1–2), others want the full transaction level (Audit Trail export). Matching the format to their need saves everyone time."
      }
    ],
    relatedSlugs: ["pos-report-sales-overview-askbiz", "pos-payment-methods-askbiz", "pos-hack-eod-reconciliation-askbiz"],
    faq: [
      { q: "Can I schedule automatic monthly report emails to my accountant?", a: "Automatic scheduled email delivery is not currently available in AskBiz for reports. Set a monthly calendar reminder to export and send the relevant CSV. The Xero/QuickBooks integration removes this need for connected businesses." },
      { q: "In what format does AskBiz export data?", a: "AskBiz exports to CSV (comma-separated values), which opens in Microsoft Excel, Google Sheets, or any accounting software import function. The Xero/QuickBooks integration uses their respective API formats." }
    ]
  },

  // 19 ─── Low Stock Cost ─────────────────────────────────────────────────────────
  {
    slug: "pos-report-low-stock-cost-askbiz",
    title: "The True Cost of Stockouts: What the Data Reveals",
    description: "How to use AskBiz low stock alerts, sales velocity data, and revenue metrics to calculate what stockouts are actually costing your business — and build a case for better reorder discipline.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["stockout cost", "lost sales", "low stock impact", "AskBiz reports", "inventory cost", "revenue impact", "stock management", "reorder discipline"],
    keyTakeaways: [
      "Every day a product is out of stock, you lose its average daily revenue — calculate this for your top 10 products.",
      "The AskBiz Low Stock filter shows you products approaching zero before they actually stock out.",
      "Customer lost sales (buying from a competitor) have a compound effect — frequent stockouts train customers to shop elsewhere.",
      "Daily revenue per product (annual revenue ÷ 365) × days out of stock = approximate cost of each stockout event."
    ],
    content: [
      {
        heading: "Putting a KSh figure on your stock-outs",
        body: "Most business owners feel the pain of a stock-out ('customers are asking for it and we don't have it') but can't quantify it precisely. AskBiz makes this calculation possible. For any product, go to the Sales Report and find its monthly revenue. Divide by 30 to get daily revenue. Multiply by the number of days it was out of stock. This is the direct revenue lost — not including the customers who went to a competitor and didn't return.",
        image: "/images/training/pos-hack-reorder.png",
      },
      {
        heading: "Case study: calculating the cost of one stockout",
        body: "Basmati Rice shows 21.5 units in stock at the LOW threshold. Assume it sells 10 units per day at KSh 100 each — KSh 1,000 daily revenue. If it runs out for 3 days before a restock arrives, direct lost revenue is KSh 3,000. At 44% margin, lost Gross Profit is KSh 1,320. Additionally, 3 days × approximately 10 customers = 30 customer interactions where you couldn't serve them. Even if only 30% of those customers go to a competitor and don't return, that's 9 customers × KSh 400 average monthly spend = KSh 3,600 in long-term revenue risk."
      },
      {
        heading: "The cumulative cost across all low-stock products",
        body: "The Overview currently shows 46 products in Low Stock status. If each of those 46 products generates only KSh 200 per day on average and each runs out for 2 days before restocking, the cumulative lost revenue is 46 × KSh 200 × 2 days = KSh 18,400. This is not a theoretical risk — it is a probable revenue impact in the next 2 weeks if no action is taken on the Low Stock list today. The Low Stock tab in Inventory is not a reporting feature — it is a revenue protection tool."
      },
      {
        heading: "Building the case for better reorder discipline",
        body: "If you have a team member responsible for stock ordering, share the stockout cost calculation with them. 'Last month we were out of Basmati Rice for 3 days — that cost approximately KSh 3,000 in lost sales and potentially 9 regular customers.' This converts an abstract 'we ran out of stock' conversation into a financial one. When the financial cost of a stockout is visible and specific, reorder discipline improves without requiring enforcement."
      },
      {
        heading: "The right reorder threshold prevents stockout costs entirely",
        body: "For your top 10 revenue products, set their reorder threshold in Inventory at 10–14 days of expected sales. At this threshold, the Low Stock alert fires while you still have time to place an order and receive stock before you run out. For products with 2-day delivery, a 3-day threshold is sufficient. For products that take 5 days from order to delivery, set the threshold at 7+ days. The investment in setting these thresholds correctly — 30 minutes per product — pays back every time a would-be stockout is avoided."
      }
    ],
    relatedSlugs: ["pos-hack-reorder-alerts-askbiz", "pos-report-stock-value-askbiz", "pos-hack-supplier-po-fast-askbiz"],
    faq: [
      { q: "Does AskBiz track how many sales were lost due to a stockout?", a: "AskBiz cannot record customer requests for out-of-stock products. Lost sales must be estimated from the product's pre-stockout sales velocity multiplied by days out of stock." },
      { q: "Can I set a low stock alert to send me a notification?", a: "The Low Stock count on the Overview and the filter in Inventory provide real-time visibility. Push notification alerts for low stock thresholds may be available depending on your AskBiz plan — check notification settings in your account." }
    ]
  },

  // 20 ─── Custom Date Range ─────────────────────────────────────────────────────
  {
    slug: "pos-report-custom-date-range-askbiz",
    title: "Custom Date Ranges: Seasonal and Campaign Analysis",
    description: "How to use the AskBiz custom date range picker for seasonal analysis, campaign measurement, and year-over-year comparisons that the preset filters can't provide.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["custom date range", "seasonal analysis", "campaign analysis", "year over year", "AskBiz reports", "date filter", "promotion measurement", "business comparison"],
    keyTakeaways: [
      "The custom date range picker on Overview and Reports lets you select any start and end date for precise analysis.",
      "Use equal-length date ranges when comparing periods — 7 days vs 7 days, not 7 days vs 30 days.",
      "Year-over-year comparison (e.g. June 2025 vs June 2024) eliminates seasonal noise from month-over-month data.",
      "Measure a specific campaign by setting the date range to exactly the campaign run period and comparing to the equivalent period before it."
    ],
    content: [
      {
        heading: "When preset filters aren't enough",
        body: "AskBiz's preset filters — Today, Yesterday, Last 7 days, Last 30 days — cover most day-to-day analysis needs. But when you want to compare Easter week to last Easter, measure the impact of a specific 10-day promotion, or analyse Ramadan trading vs the rest of the year, you need the custom date range picker. It lets you select any start and end date, giving you precision that preset filters can't provide.",
        image: "/images/training/pos-daily-brief.png",
      },
      {
        heading: "How to use the custom date range picker",
        body: "On the POS Overview or Reports page, find the two date input fields labelled 'dd/mm/yyyy to dd/mm/yyyy' on the right side of the filter row. Click the first field and type or select your start date. Click the second field and select your end date. The metrics update immediately to show data for exactly that period. Combine with the Branch and Sector filters for the most specific slice of your business data."
      },
      {
        heading: "Year-over-year comparison: the seasonal truth test",
        body: "To compare this June to last June: set the first date range to 1 June 2025 – 30 June 2025, note the Revenue and Margin. Then set it to 1 June 2024 – 30 June 2024 and note the figures. YoY growth = (2025 figure – 2024 figure) ÷ 2024 figure × 100. This comparison is immune to seasonal effects — if June is always slower than December, the YoY comparison still shows whether your June grew. A business with +15% YoY Revenue growth consistently over three months is genuinely growing, regardless of seasonal patterns."
      },
      {
        heading: "Measuring a specific promotion campaign",
        body: "Set the date range to exactly the campaign dates (e.g. 1–14 June for a two-week promotion). Note Revenue, Gross Profit, and Avg Sale. Then set the equivalent pre-campaign period (18 May – 31 May). Compare. The difference in Gross Profit — not Revenue — is the promotion's net impact. If Gross Profit increased by more than the discount value given away (visible in the Discounts Report for the same date range), the promotion was ROI-positive. If not, revise the approach for next time."
      },
      {
        heading: "Three useful custom analyses for retail",
        body: "Analysis 1 — Payday effect: compare the 25th–5th of each month vs the 6th–24th. Most retail businesses see higher Avg Sale around payday — if yours doesn't, you may be missing a payday promotion opportunity. Analysis 2 — School term vs holidays: compare school term weeks to holiday weeks. Traffic patterns shift significantly for businesses near schools or that serve families. Analysis 3 — Weather/event comparison: if a major local event occurred on a specific weekend, compare that weekend to the same weekend last year to isolate the event's impact on your trading."
      },
      {
        heading: "Sharing custom analysis with your team or investors",
        body: "When sharing analysis with an investor, bank manager, or business partner, custom date ranges let you show growth across periods that matter to your narrative. 'Over the 6 months since we opened the second branch (1 Nov 2024 – 30 Apr 2025), group Revenue grew 34% vs the equivalent 6-month period before the opening.' This precision is persuasive — it shows the impact of a specific decision rather than presenting general revenue growth that could be attributed to many factors."
      }
    ],
    relatedSlugs: ["pos-report-mom-growth-askbiz", "pos-report-promotions-roi-askbiz", "pos-report-day-of-week-askbiz"],
    faq: [
      { q: "How far back does AskBiz data go?", a: "AskBiz retains all historical data from the date you started using the platform. If you have been trading for 18 months, you can set a custom range from your first day of trading to today." },
      { q: "Can I save a custom date range as a preset?", a: "Custom date range presets are not currently saveable in AskBiz. For recurring analyses (e.g. monthly on the 1st), set a calendar reminder and manually re-enter the range each time — it takes under 30 seconds." }
    ]
  },

];
