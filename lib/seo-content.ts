// ── PROGRAMMATIC SEO CONTENT DATABASE ────────────────────────────────────────
// 50 pages: /how-to/[slug] and /translate/[slug]

export interface SeoEntry {
  slug: string
  category: 'how-to' | 'translate'
  title: string
  metaDescription: string
  term: string
  shortDefinition: string
  simpleEnglish: string
  whyItMatters: string
  howAskBizDoesIt: string
  example: string
  formula?: string
  relatedTerms: string[]
  faqs: { q: string; a: string }[]
}

export const SEO_CONTENT: SeoEntry[] = [
  // ── HOW-TO PAGES ────────────────────────────────────────────────────────────
  {
    slug: 'calculate-profit-margin',
    category: 'how-to',
    title: 'How to Calculate Profit Margin for Your Business',
    metaDescription: 'Learn how to calculate profit margin in plain English. Step-by-step formula, worked examples, and how AskBiz calculates it automatically from your data.',
    term: 'Profit Margin',
    shortDefinition: 'The percentage of revenue that becomes actual profit after all costs.',
    simpleEnglish: 'For every £100 you bring in, profit margin tells you how much you actually keep. If you sell a product for £10 and it costs you £7 to make and sell it, your margin is 30%. The higher your margin, the more money you keep from each sale.',
    whyItMatters: 'Profit margin is the most important number in any business. Revenue can look healthy while margin is collapsing. A business with £500,000 revenue and 3% margin is less profitable than one with £100,000 revenue and 40% margin. Knowing your margin per product tells you which products are actually worth selling.',
    howAskBizDoesIt: 'Upload your sales data with cost and revenue columns. Ask "What is my profit margin per product?" AskBiz calculates gross margin for every product, ranks them from highest to lowest, flags products below a healthy threshold, and tells you exactly which ones to focus on and which to reprice.',
    example: 'A retailer uploads 6 months of sales data. AskBiz finds their margin across 200 products ranges from 4% to 67%. Three products representing 40% of their volume have margins under 8%. AskBiz recommends repricing or discontinuing them, estimating a £3,200/month margin improvement.',
    formula: 'Profit Margin % = ((Revenue − Cost of Goods Sold) ÷ Revenue) × 100',
    relatedTerms: ['gross-margin', 'net-profit', 'cogs', 'markup-percentage'],
    faqs: [
      { q: 'What is a good profit margin for a small business?', a: 'It varies by industry, but generally: retail 5–20%, ecommerce 10–30%, SaaS 60–80%, services 20–40%. The important thing is knowing your margin per product, not just overall.' },
      { q: 'What is the difference between gross margin and net margin?', a: 'Gross margin is revenue minus direct costs (COGS). Net margin deducts all expenses including operating costs, salaries, rent, and tax. Net margin is always lower than gross margin.' },
      { q: 'Can AskBiz calculate margin automatically from my spreadsheet?', a: 'Yes. Upload a CSV or Excel file with your products, selling prices, and cost prices. Ask "What is my profit margin per product?" and AskBiz returns a full ranked breakdown in seconds.' },
    ]
  },
  {
    slug: 'calculate-inventory-turnover',
    category: 'how-to',
    title: 'How to Calculate Inventory Turnover Rate',
    metaDescription: 'Step-by-step guide to calculating inventory turnover. Simple formula, worked example, and how to use it to reduce dead stock and improve cash flow.',
    term: 'Inventory Turnover',
    shortDefinition: 'How many times you sell and replace your entire stock in a given period.',
    simpleEnglish: 'Inventory turnover tells you how quickly your products are moving. If your turnover is 12, you sell and replace your entire stock roughly once a month. If it\'s 2, you\'re only cycling through stock twice a year — which means cash is sitting on shelves.',
    whyItMatters: 'Low inventory turnover means cash is locked in slow-moving stock. High turnover means products are moving fast — but if too high, you risk stockouts. The right turnover depends on your industry. Supermarkets aim for 20+. Furniture retailers might target 4.',
    howAskBizDoesIt: 'Upload your inventory and sales data. Ask "What is my inventory turnover by product?" AskBiz calculates turnover per SKU, identifies your slowest-moving items, and recommends which products to discount, discontinue, or reorder more frequently.',
    example: 'A clothing retailer finds their jeans turn over 18 times a year but their formal suits only 1.5 times. AskBiz flags the suits as tying up £8,400 in working capital and suggests a promotional clearance to free up cash for faster-moving lines.',
    formula: 'Inventory Turnover = Cost of Goods Sold ÷ Average Inventory Value',
    relatedTerms: ['slow-moving-stock', 'days-inventory-outstanding', 'reorder-point', 'sell-through-rate'],
    faqs: [
      { q: 'What is a good inventory turnover rate?', a: 'It depends heavily on your industry. Grocery/FMCG: 15–30. Fashion retail: 4–6. Electronics: 8–12. Furniture: 3–5. Compare against your industry average, not a universal benchmark.' },
      { q: 'How does low inventory turnover hurt my business?', a: 'Every unit sitting on your shelf is cash you can\'t use. Low turnover products tie up working capital, incur storage costs, and risk becoming obsolete or unsellable.' },
      { q: 'Can AskBiz identify which products have low turnover?', a: 'Yes. Upload your inventory and sales data, ask "Which products have the lowest turnover?" and AskBiz will rank every product and flag the ones draining your working capital.' },
    ]
  },
  {
    slug: 'calculate-break-even',
    category: 'how-to',
    title: 'How to Calculate Break-Even Point for Your Business',
    metaDescription: 'Calculate your break-even point in units and revenue. Simple formula with worked examples for retail, ecommerce, and service businesses.',
    term: 'Break-Even Point',
    shortDefinition: 'The exact sales volume where your revenue exactly covers all your costs — you\'re making zero profit and zero loss.',
    simpleEnglish: 'Break-even tells you the minimum you need to sell just to keep the lights on. Sell less than that, you\'re losing money. Sell more, you\'re profitable. It\'s the floor your business needs to stay above to survive.',
    whyItMatters: 'Every business decision — a new product, a new location, a price change — shifts your break-even point. Knowing it helps you understand risk before you commit. If your break-even requires 800 sales a month but you currently do 400, that new product line is a serious risk.',
    howAskBizDoesIt: 'Upload your cost and revenue data. Ask "What is my break-even point?" AskBiz calculates it in both units and revenue, shows how far above or below break-even you are today, and models what happens to your break-even if you change prices or reduce costs.',
    example: 'A food stall owner uploads their monthly cost data. AskBiz calculates they break even at 340 portions per day at their current price. They\'re averaging 280. AskBiz recommends either a 12% price increase or a reduction in ingredient cost to close the gap.',
    formula: 'Break-Even Units = Fixed Costs ÷ (Selling Price − Variable Cost per Unit)',
    relatedTerms: ['contribution-margin', 'fixed-costs', 'gross-margin', 'net-profit'],
    faqs: [
      { q: 'What is the difference between break-even in units and break-even in revenue?', a: 'Break-even in units tells you how many items you need to sell. Break-even in revenue tells you the total sales value you need. Both are useful — units helps with production planning, revenue helps with sales targets.' },
      { q: 'How does a price change affect break-even?', a: 'Raising prices lowers your break-even point (you need to sell fewer units to cover costs). Lowering prices raises it. AskBiz can model the exact impact of any price change on your break-even.' },
    ]
  },
  {
    slug: 'calculate-cash-flow-forecast',
    category: 'how-to',
    title: 'How to Forecast Cash Flow for Small Business',
    metaDescription: 'How to build a cash flow forecast from your sales data. Simple method for retail, ecommerce, and service businesses with worked examples.',
    term: 'Cash Flow Forecast',
    shortDefinition: 'A projection of money coming into and going out of your business in a future period.',
    simpleEnglish: 'A cash flow forecast is a calendar of money. It shows every payment you expect to receive and every bill you expect to pay, week by week or month by month. It tells you whether you\'ll have enough cash to pay your suppliers and staff — before you find out the hard way.',
    whyItMatters: 'Most small businesses that fail do so not because they\'re unprofitable, but because they run out of cash at the wrong moment. A forecast lets you see a cash crunch 2-3 months before it happens — giving you time to arrange a credit line, delay a purchase, or push for faster payment from customers.',
    howAskBizDoesIt: 'Upload your sales and expense data. Ask "Show me a cash flow forecast for the next 3 months." AskBiz uses your historical patterns to project inflows and outflows, flags months where cash may be tight, and suggests specific actions to prevent a shortfall.',
    example: 'A distributor uploads 12 months of data. AskBiz identifies their cash dips every March and September due to seasonal supplier payments. It forecasts a £14,000 shortfall in March and recommends either pulling forward February collections or arranging a short-term credit facility.',
    formula: 'Net Cash Flow = Total Cash Inflows − Total Cash Outflows',
    relatedTerms: ['working-capital', 'burn-rate', 'accounts-receivable', 'days-sales-outstanding'],
    faqs: [
      { q: 'How far ahead should I forecast cash flow?', a: 'A 13-week (quarterly) rolling forecast is standard for most small businesses. It\'s far enough ahead to take action on problems, but short enough to be accurate. AskBiz can generate forecasts from 1 month to 12 months.' },
      { q: 'What data do I need to create a cash flow forecast?', a: 'Historical sales data, a list of recurring expenses (rent, salaries, subscriptions), and any known upcoming large payments or receipts. Upload a CSV of your transactions and AskBiz builds the forecast automatically.' },
    ]
  },
  {
    slug: 'calculate-reorder-point',
    category: 'how-to',
    title: 'How to Calculate Reorder Point for Inventory',
    metaDescription: 'Calculate the exact stock level that should trigger a new purchase order. Formula, safety stock calculation, and worked examples for retail and wholesale.',
    term: 'Reorder Point',
    shortDefinition: 'The stock level at which you should place a new order to avoid running out before the new stock arrives.',
    simpleEnglish: 'Reorder point is the "warning light" for your stock. When a product hits this level, it\'s time to order more — not when you run out. It accounts for how long your supplier takes to deliver and how fast you sell the product.',
    whyItMatters: 'Ordering too late means stockouts — lost sales, unhappy customers, empty shelves. Ordering too early means cash tied up in inventory you don\'t need yet. The reorder point is the precise balance between both risks.',
    howAskBizDoesIt: 'Upload your inventory data including stock levels and sales velocity. Ask "What are my reorder points for each product?" AskBiz calculates a reorder point for every SKU based on your actual sales rate and flags which products are already below threshold.',
    example: 'A pharmacy uploads their stock data. AskBiz calculates that their paracetamol reorder point is 240 units (3 days sales × 4 day lead time + 50 unit safety stock). Current stock is 180 — below the threshold. AskBiz flags this as urgent.',
    formula: 'Reorder Point = (Average Daily Sales × Lead Time in Days) + Safety Stock',
    relatedTerms: ['inventory-turnover', 'safety-stock', 'days-inventory-outstanding', 'slow-moving-stock'],
    faqs: [
      { q: 'What is safety stock and how does it affect reorder point?', a: 'Safety stock is extra inventory held as a buffer against unexpected demand spikes or supplier delays. A higher safety stock raises your reorder point. AskBiz calculates safety stock based on the variability in your historical sales.' },
      { q: 'How does lead time affect my reorder point?', a: 'Longer lead times require higher reorder points. If your supplier takes 14 days to deliver and you sell 50 units per day, you need at least 700 units in stock before reordering. AskBiz adjusts reorder points automatically if you update lead time information.' },
    ]
  },
  {
    slug: 'calculate-gross-margin',
    category: 'how-to',
    title: 'How to Calculate Gross Margin',
    metaDescription: 'Simple formula for calculating gross margin with worked examples. Understand the difference between gross margin and gross profit, and why it matters for your business.',
    term: 'Gross Margin',
    shortDefinition: 'The percentage of revenue remaining after subtracting the direct cost of goods sold.',
    simpleEnglish: 'Gross margin answers: after paying for the products you sell, what percentage of the sale price is left? If you buy a product for £6 and sell it for £10, your gross margin is 40%. That 40% needs to cover your rent, staff, marketing, and everything else.',
    whyItMatters: 'Gross margin is the foundation of your business model. If your gross margin is 15%, you have very little room to absorb operating costs. If it\'s 60%, you have breathing room. Gross margin varies enormously by industry — knowing yours tells you whether your pricing model is sustainable.',
    howAskBizDoesIt: 'Upload any sales file with cost and selling price columns. Ask "What is my gross margin?" AskBiz calculates overall gross margin and breaks it down by product, category, and time period. It flags products dragging down your average and suggests pricing or sourcing improvements.',
    example: 'An ecommerce seller finds their overall gross margin is 28%. AskBiz breaks this down: their own-brand products average 52% margin while resale products average only 11%. AskBiz recommends shifting the product mix toward own-brand to improve overall margin.',
    formula: 'Gross Margin % = ((Revenue − COGS) ÷ Revenue) × 100',
    relatedTerms: ['profit-margin', 'cogs', 'net-margin', 'contribution-margin'],
    faqs: [
      { q: 'Is gross margin the same as gross profit?', a: 'No. Gross profit is a money amount (e.g. £12,000). Gross margin is a percentage (e.g. 40%). Gross profit ÷ Revenue = Gross margin. Both are useful — gross profit for absolute size, margin for comparing products or businesses.' },
    ]
  },
  {
    slug: 'calculate-average-order-value',
    category: 'how-to',
    title: 'How to Calculate and Increase Average Order Value',
    metaDescription: 'How to calculate AOV and strategies to increase it. Simple formula with examples for ecommerce, retail, and service businesses.',
    term: 'Average Order Value (AOV)',
    shortDefinition: 'The average amount a customer spends per transaction with your business.',
    simpleEnglish: 'AOV tells you how much a typical customer spends in a single visit or order. If you had £50,000 in revenue from 1,000 orders last month, your AOV is £50. Increasing AOV by 10% without increasing customer numbers grows revenue by 10%.',
    whyItMatters: 'AOV is one of the three levers of revenue growth (with customer count and purchase frequency). It\'s often the easiest to move — bundles, upsells, and minimum order thresholds can raise AOV significantly without the cost of acquiring new customers.',
    howAskBizDoesIt: 'Upload your order data. Ask "What is my average order value?" or "What is my AOV by customer segment?" AskBiz calculates overall AOV, tracks it over time, and identifies which product combinations tend to appear in higher-value orders.',
    example: 'A beauty supply retailer asks AskBiz to analyse their order data. AOV is £34. AskBiz identifies that orders containing both skincare and haircare products average £67 — double the baseline. It recommends a bundle promotion to increase cross-category purchasing.',
    formula: 'Average Order Value = Total Revenue ÷ Number of Orders',
    relatedTerms: ['customer-lifetime-value', 'revenue-per-customer', 'conversion-rate'],
    faqs: [
      { q: 'How can I increase average order value?', a: 'Common tactics: bundle complementary products, offer free shipping above a threshold, recommend frequently bought together items at checkout, and create tiered pricing with volume discounts. AskBiz can analyse which bundles would work best with your specific product mix.' },
    ]
  },
  {
    slug: 'calculate-working-capital',
    category: 'how-to',
    title: 'How to Calculate Working Capital',
    metaDescription: 'How to calculate working capital for your small business. Simple formula, what good and bad working capital looks like, and how to improve it.',
    term: 'Working Capital',
    shortDefinition: 'The money available to cover your day-to-day business operations — current assets minus current liabilities.',
    simpleEnglish: 'Working capital is the financial fuel your business runs on daily. It\'s what you have left after subtracting what you owe in the short term from what you own in the short term. Positive working capital means you can pay your bills. Negative means you\'re in trouble even if you\'re profitable.',
    whyItMatters: 'A business can be profitable on paper but cash-strapped in practice — this is a working capital problem. If your customers take 60 days to pay but your suppliers want payment in 30 days, your working capital is under strain regardless of profit.',
    howAskBizDoesIt: 'Upload your financial data. Ask "What is my working capital position?" AskBiz calculates the current ratio, identifies the components dragging it down, and recommends whether to focus on collecting receivables faster, negotiating supplier terms, or reducing inventory.',
    example: 'A wholesaler finds their working capital has declined 40% over 6 months. AskBiz identifies the cause: trade receivables have grown from 28 to 52 days average collection time. It recommends specific accounts to chase and calculates that recovering £22,000 in overdue invoices would restore healthy working capital.',
    formula: 'Working Capital = Current Assets − Current Liabilities',
    relatedTerms: ['cash-flow', 'accounts-receivable', 'accounts-payable', 'liquidity'],
    faqs: [
      { q: 'What is a healthy working capital ratio?', a: 'A current ratio (current assets ÷ current liabilities) of 1.5 to 2.0 is generally considered healthy for most businesses. Below 1.0 means you can\'t cover short-term obligations — a serious red flag.' },
    ]
  },
  // ── TRANSLATE PAGES ──────────────────────────────────────────────────────────
  {
    slug: 'what-is-ebitda',
    category: 'translate',
    title: 'What is EBITDA? Plain English Explanation',
    metaDescription: 'EBITDA explained in plain English. What it means, why analysts use it, when it\'s useful for small businesses, and its limitations.',
    term: 'EBITDA',
    shortDefinition: 'Earnings Before Interest, Taxes, Depreciation and Amortisation — a measure of core operating profit.',
    simpleEnglish: 'EBITDA strips out the accounting complexities and asks: ignoring how you\'re financed, how you\'re taxed, and how you account for your assets — is the actual business making money? It\'s what you\'d earn if you had no debt, paid no tax, and nothing wore out. Analysts use it to compare businesses fairly, regardless of their financing structure.',
    whyItMatters: 'When someone is buying or valuing a business, they often use EBITDA as the baseline. "The business is worth 5x EBITDA" means the purchase price is five times the annual EBITDA. If your EBITDA is £200,000, a buyer might offer £1,000,000. Understanding your EBITDA helps you understand what your business is worth.',
    howAskBizDoesIt: 'Ask AskBiz "What is my EBITDA this year?" and it calculates it from your financial data, compares it to previous periods, and shows you which costs are reducing your EBITDA most significantly.',
    example: 'A business has £800,000 revenue. After costs, net profit is £40,000. But after adding back depreciation (£30,000), interest (£25,000), and tax (£15,000), EBITDA is £110,000 — a much stronger picture of operating performance.',
    formula: 'EBITDA = Net Profit + Interest + Taxes + Depreciation + Amortisation',
    relatedTerms: ['net-profit', 'operating-profit', 'depreciation', 'gross-margin'],
    faqs: [
      { q: 'Is EBITDA the same as profit?', a: 'No. EBITDA adds back interest, tax, depreciation and amortisation to net profit. It\'s always higher than net profit. It\'s a measure of operating performance, not actual cash earned.' },
      { q: 'Why do investors care about EBITDA?', a: 'EBITDA allows comparison across companies with different capital structures and tax situations. Two businesses in the same industry with identical operations but different debt levels will have very different net profits — EBITDA shows what the underlying business is generating.' },
      { q: 'Is EBITDA useful for small businesses?', a: 'Yes, particularly if you\'re planning to sell or raise investment. It\'s also useful for tracking operational performance over time, separate from changes in your financing or tax situation.' },
    ]
  },
  {
    slug: 'what-is-working-capital',
    category: 'translate',
    title: 'What is Working Capital? Simple Business Explanation',
    metaDescription: 'Working capital explained simply. What it is, how to calculate it, what healthy working capital looks like, and why it matters more than profit.',
    term: 'Working Capital',
    shortDefinition: 'The money available to run your business day-to-day — what you own minus what you owe in the short term.',
    simpleEnglish: 'Working capital is your business\'s day-to-day financial cushion. Think of it as the money in your operational wallet after paying immediate obligations. Positive means you can cover bills, pay staff, and keep moving. Negative means trouble — even if your P&L looks fine.',
    whyItMatters: 'Many profitable businesses go bust because of working capital problems. If your customers pay you late but you must pay suppliers early, your working capital is being squeezed. A business can show £100,000 profit on paper while being unable to pay next month\'s rent.',
    howAskBizDoesIt: 'Upload your financial data and ask "What is my working capital position?" AskBiz calculates current assets vs current liabilities, tracks the trend, and identifies the specific drivers of any deterioration.',
    example: 'A manufacturer is profitable but keeps running out of cash. AskBiz calculates their working capital ratio is 0.8 — below the safe threshold of 1.5. The cause: customers paying on 75-day terms while they pay suppliers on 30 days. AskBiz recommends an invoice financing solution.',
    formula: 'Working Capital = Current Assets − Current Liabilities',
    relatedTerms: ['cash-flow', 'liquidity', 'accounts-receivable', 'current-ratio'],
    faqs: [
      { q: 'Can a profitable business have negative working capital?', a: 'Yes, and it\'s surprisingly common. Profit is an accounting concept. Working capital is about timing of cash flows. A business collecting revenue slowly while paying costs quickly will have working capital problems even while showing profit.' },
      { q: 'How do I improve working capital?', a: 'Four main levers: collect receivables faster, delay payables (negotiate longer terms with suppliers), reduce inventory levels, or inject cash (loan or equity). AskBiz can analyse which lever will have the biggest impact for your specific situation.' },
    ]
  },
  {
    slug: 'what-is-cash-flow',
    category: 'translate',
    title: 'What is Cash Flow? Simple Explanation for Business Owners',
    metaDescription: 'Cash flow explained simply. The difference between cash flow and profit, why cash flow kills more businesses than bad sales, and how to manage it.',
    term: 'Cash Flow',
    shortDefinition: 'The actual movement of money into and out of your business over a specific period.',
    simpleEnglish: 'Cash flow is the simple record of money arriving and money leaving. When more comes in than goes out, cash flow is positive. When more goes out than comes in, it\'s negative. Unlike profit, cash flow tracks real money movement — not invoices or promises of payment.',
    whyItMatters: 'More businesses fail from poor cash flow than from poor sales. A business can have a full order book and a healthy profit margin but still fail if customers pay slowly and suppliers demand quick payment. Cash flow is the oxygen of a business — run out and you\'re in trouble regardless of everything else.',
    howAskBizDoesIt: 'Upload your transaction data or sales and expense records. Ask "Show me my cash flow for the last 6 months." AskBiz maps your cash inflows and outflows, identifies patterns, flags high-risk months, and forecasts future cash positions.',
    example: 'A B2B services business looks profitable. But AskBiz reveals their cash flow has been negative for 3 of the last 6 months because one large client always pays 90 days late. AskBiz calculates the cost of this at £18,000 in financing charges and recommends renegotiating payment terms.',
    formula: 'Net Cash Flow = Cash Inflows − Cash Outflows',
    relatedTerms: ['working-capital', 'burn-rate', 'cash-conversion-cycle', 'accounts-receivable'],
    faqs: [
      { q: 'What is the difference between cash flow and profit?', a: 'Profit is revenue minus costs on paper — including invoices not yet paid. Cash flow tracks only actual money received and paid. You can have high profit and poor cash flow if customers pay late. You can have strong cash flow and low profit if you receive deposits before doing the work.' },
      { q: 'How often should I check my cash flow?', a: 'At minimum monthly, ideally weekly for businesses with tight margins or large seasonal swings. AskBiz can give you a cash flow snapshot on demand whenever you upload fresh transaction data.' },
    ]
  },
  {
    slug: 'what-is-burn-rate',
    category: 'translate',
    title: 'What is Burn Rate? Business Definition in Plain English',
    metaDescription: 'Burn rate explained simply for business owners. What it means, how to calculate it, and what your burn rate tells you about your business runway.',
    term: 'Burn Rate',
    shortDefinition: 'How fast your business is spending its cash reserves each month.',
    simpleEnglish: 'Burn rate is how much money you\'re "burning through" each month. If you have £60,000 in the bank and spend £10,000 more than you earn each month, your burn rate is £10,000 and your runway is 6 months. After that, you need more revenue or more funding.',
    whyItMatters: 'Burn rate and runway are the most critical numbers for any business in a growth phase or going through a difficult period. They tell you exactly how long you can operate before running out of options. Knowing your burn rate lets you make deliberate decisions — rather than discovering you\'re out of cash suddenly.',
    howAskBizDoesIt: 'Upload your financial data. Ask "What is my burn rate?" AskBiz calculates your net monthly cash consumption, projects your runway at the current rate, and identifies the largest contributors to the burn.',
    example: 'A startup uploads 8 months of financial data. AskBiz calculates gross burn (total monthly spend) of £42,000 and net burn (after revenue) of £11,000. At that rate, their current £88,000 reserves give them 8 months of runway. AskBiz flags two expense categories representing 60% of the burn.',
    formula: 'Net Burn Rate = Monthly Cash Outflows − Monthly Cash Inflows',
    relatedTerms: ['cash-flow', 'runway', 'working-capital', 'cash-conversion-cycle'],
    faqs: [
      { q: 'What is the difference between gross burn and net burn?', a: 'Gross burn is total monthly spending. Net burn subtracts revenue — it\'s how much your cash reserves actually shrink each month. Net burn is the more useful number for understanding runway.' },
      { q: 'Is burn rate only relevant for startups?', a: 'No. Any business drawing down cash reserves — whether due to seasonality, growth investment, or a difficult period — should track burn rate. It\'s useful for any business where the cash balance is changing.' },
    ]
  },
  {
    slug: 'what-is-kpi',
    category: 'translate',
    title: 'What is a KPI? Business KPIs Explained Simply',
    metaDescription: 'KPI explained in plain English. What KPIs are, examples for retail and ecommerce businesses, and how to choose the right ones for your business.',
    term: 'KPI (Key Performance Indicator)',
    shortDefinition: 'A measurable value that shows how effectively your business is achieving its key objectives.',
    simpleEnglish: 'A KPI is a number that tells you if your business is on track. Not just any number — the one that matters most for a specific goal. If your goal is to grow revenue, your KPI might be monthly sales. If it\'s to improve margins, the KPI is gross margin percentage. KPIs turn vague goals into trackable targets.',
    whyItMatters: 'Without KPIs, business decisions are based on feeling. "Things seem to be going well" is not a strategy. KPIs give you an objective measure of progress. They also create accountability — you either hit the number or you don\'t, and the data tells you why.',
    howAskBizDoesIt: 'Upload your business data. Ask "What are my key business KPIs?" AskBiz identifies the most relevant metrics from your data, tracks them over time, assigns colour-coded status (green/amber/red), and flags the ones most in need of attention.',
    example: 'A retailer asks AskBiz for their KPI dashboard. It surfaces: gross margin (42%, trending down), inventory turnover (6.2, healthy), average order value (£34, flat), and customer return rate (estimated 28%). It flags gross margin as the priority to address.',
    relatedTerms: ['gross-margin', 'average-order-value', 'inventory-turnover', 'customer-lifetime-value'],
    faqs: [
      { q: 'What KPIs should a small retail business track?', a: 'The most important are: gross margin %, inventory turnover, average transaction value, stock-to-sales ratio, and sell-through rate. AskBiz can calculate all of these from a standard sales and inventory export.' },
      { q: 'How many KPIs should I track?', a: 'Most businesses try to track too many. Focus on 4-6 KPIs that directly measure your current strategic priorities. More than 10 and nothing feels urgent.' },
    ]
  },
  {
    slug: 'what-is-gross-profit',
    category: 'translate',
    title: 'What is Gross Profit? Simple Business Explanation',
    metaDescription: 'Gross profit explained simply. The difference between gross profit and net profit, how to calculate it, and what it tells you about your business.',
    term: 'Gross Profit',
    shortDefinition: 'Revenue minus the direct cost of the goods or services you sold.',
    simpleEnglish: 'Gross profit is what you have left after paying for the things you sold — before rent, staff, marketing, or anything else. If you sell £100,000 of products that cost you £60,000 to buy, your gross profit is £40,000. That £40,000 needs to cover everything else and leave you with net profit.',
    whyItMatters: 'Gross profit is the pool of money from which all other business costs are paid. If it\'s too small, no amount of cost-cutting will save you — the fundamental economics of what you\'re selling are broken. Tracking gross profit by product tells you which lines are carrying the business and which are dragging it down.',
    howAskBizDoesIt: 'Upload your sales data. Ask "What is my gross profit this month?" or "What is gross profit by product category?" AskBiz calculates gross profit and gross margin for every dimension of your business and ranks products from most to least profitable.',
    example: 'A café owner uploads their POS data. AskBiz calculates overall gross profit of 68%. But breaking it down: hot food is 72%, cold drinks are 81%, and packaged goods are only 34%. The café shifts its display and upselling focus toward cold drinks based on this insight.',
    formula: 'Gross Profit = Revenue − Cost of Goods Sold (COGS)',
    relatedTerms: ['gross-margin', 'net-profit', 'cogs', 'contribution-margin'],
    faqs: [
      { q: 'What is the difference between gross profit and net profit?', a: 'Gross profit subtracts only direct costs (materials, production). Net profit subtracts all costs including operating expenses, interest, and tax. Gross profit is always higher than net profit.' },
    ]
  },
  {
    slug: 'what-is-mrr',
    category: 'translate',
    title: 'What is MRR? Monthly Recurring Revenue Explained',
    metaDescription: 'MRR explained in plain English. What monthly recurring revenue is, how to calculate it, and why it\'s the most important metric for subscription businesses.',
    term: 'MRR (Monthly Recurring Revenue)',
    shortDefinition: 'The predictable, recurring revenue your business generates every month from subscriptions or repeat contracts.',
    simpleEnglish: 'MRR is your guaranteed monthly income — the revenue you can count on without chasing new sales. If you have 100 customers each paying £50/month, your MRR is £5,000. Unlike one-off revenue, MRR is predictable, which makes planning and hiring decisions far easier.',
    whyItMatters: 'MRR is the foundation metric for any subscription or recurring revenue business. It tells you how stable and predictable your revenue base is. Investors value MRR-based businesses far more highly than revenue-based ones because it reduces uncertainty. MRR growth rate shows whether the business is accelerating or slowing.',
    howAskBizDoesIt: 'Upload your subscription or recurring revenue data. Ask "What is my MRR?" or "Show me MRR growth over the last 12 months." AskBiz calculates new MRR, churned MRR, expansion MRR, and net MRR movement.',
    example: 'A SaaS founder uploads 12 months of billing data. AskBiz calculates current MRR of £18,400, up from £9,200 a year ago — 100% growth. But it flags that monthly churn is running at 3.2%, meaning without new sales, MRR would decline by £590 every month.',
    formula: 'MRR = Number of Active Subscribers × Average Revenue Per User (ARPU)',
    relatedTerms: ['arr', 'churn-rate', 'customer-lifetime-value', 'cac-to-ltv-ratio'],
    faqs: [
      { q: 'What is the difference between MRR and ARR?', a: 'MRR is monthly recurring revenue. ARR is annual recurring revenue, calculated as MRR × 12. ARR is used for reporting and valuation. MRR is used for operational tracking. Both measure the same underlying thing at different time scales.' },
      { q: 'How does churn affect MRR?', a: 'Every customer who cancels reduces your MRR. If you add £2,000 in new MRR but lose £1,500 from churn, your net MRR growth is only £500. Tracking churn\'s impact on MRR is critical for understanding true growth.' },
    ]
  },
  {
    slug: 'what-is-contribution-margin',
    category: 'translate',
    title: 'What is Contribution Margin? Plain English Explanation',
    metaDescription: 'Contribution margin explained simply. How it differs from gross margin, when to use it, and how it helps you make better pricing and product decisions.',
    term: 'Contribution Margin',
    shortDefinition: 'Revenue minus variable costs — the amount each unit sold "contributes" toward covering fixed costs and generating profit.',
    simpleEnglish: 'Contribution margin tells you: after the direct variable costs of making or buying a product, how much does each sale contribute toward paying your fixed bills? If a product sells for £20 and the variable costs are £8, the contribution margin is £12. Your fixed costs (rent, salaries) need to be covered by the sum of all these contributions.',
    whyItMatters: 'Contribution margin is more useful than gross margin for pricing decisions. It shows you the minimum price you can charge before a product starts costing you money. It also reveals which products are most efficient at covering fixed costs — which isn\'t always the highest-volume ones.',
    howAskBizDoesIt: 'Upload your cost and sales data. Ask "What is the contribution margin for each product?" AskBiz separates your variable and fixed costs, calculates contribution margin per unit and as a percentage, and ranks products by their total contribution to covering fixed overhead.',
    example: 'A manufacturer has three product lines. Product A has the highest revenue but a contribution margin of only 12%. Product C has lower revenue but 58% contribution margin. AskBiz recommends shifting production capacity toward Product C to improve overall profitability.',
    formula: 'Contribution Margin = Revenue − Variable Costs',
    relatedTerms: ['gross-margin', 'break-even', 'fixed-costs', 'operating-leverage'],
    faqs: [
      { q: 'Is contribution margin the same as gross margin?', a: 'No. Gross margin uses cost of goods sold (which may include some fixed manufacturing costs). Contribution margin uses only variable costs. Contribution margin is typically higher than gross margin.' },
    ]
  },
  {
    slug: 'what-is-dead-stock',
    category: 'translate',
    title: 'What is Dead Stock? How to Identify and Manage It',
    metaDescription: 'Dead stock explained. What it is, how it damages your business, how to identify it in your inventory data, and strategies to clear it.',
    term: 'Dead Stock',
    shortDefinition: 'Inventory that has not sold and is unlikely to sell — tying up cash and warehouse space.',
    simpleEnglish: 'Dead stock is product sitting on your shelves that nobody wants to buy. It started as an investment but has become a liability. Unlike stock that\'s just selling slowly, dead stock is unlikely to sell at full price — if at all. It\'s frozen cash that should be working in your business.',
    whyItMatters: 'Dead stock is a hidden drain on business performance. It ties up working capital, occupies storage space, and often deteriorates or becomes obsolete over time. The longer it sits, the lower its eventual recovery value. Identifying dead stock early and clearing it — even at a loss — is almost always better than holding it.',
    howAskBizDoesIt: 'Upload your inventory data. Ask "Which products are dead stock or at risk of becoming dead stock?" AskBiz analyses sell-through rates, flags products with zero or minimal sales in the past 60-90 days, estimates the cash locked in each, and recommends clearance strategies.',
    example: 'A fashion retailer uploads their inventory data. AskBiz flags £23,400 in dead stock across 47 SKUs — all autumn/winter lines from 18 months ago. It calculates that clearing these at 40% discount would release £14,000 in cash and recommends a targeted promotional email to past purchasers of similar items.',
    relatedTerms: ['inventory-turnover', 'slow-moving-stock', 'sell-through-rate', 'working-capital'],
    faqs: [
      { q: 'How long before stock is considered "dead"?', a: 'It depends on your industry. For fashion, 90 days with no sales is a red flag. For industrial equipment, 12 months might be normal. AskBiz benchmarks against your own historical sales patterns to identify true anomalies.' },
      { q: 'Is it better to discount dead stock or hold it?', a: 'Almost always better to discount and clear. Every day dead stock sits, it costs you storage, ties up capital, and risks becoming worthless. A 30-40% loss on stock is painful but usually preferable to a total write-off.' },
    ]
  },
  {
    slug: 'what-is-churn-rate',
    category: 'translate',
    title: 'What is Churn Rate? Simple Explanation for Business Owners',
    metaDescription: 'Churn rate explained in plain English. How to calculate it, what a healthy churn rate looks like, and how to reduce it.',
    term: 'Churn Rate',
    shortDefinition: 'The percentage of customers who stop buying from you in a given period.',
    simpleEnglish: 'Churn rate measures how fast you\'re losing customers. If you have 200 customers at the start of the month and 10 cancel or stop buying, your monthly churn is 5%. High churn means you\'re constantly refilling a leaking bucket — spending on acquisition while losing the customers you already have.',
    whyItMatters: 'Churn is the silent killer of growth. You can acquire 100 new customers a month, but if 80 leave, you\'re treading water. A 1% monthly churn means you lose about 12% of your customer base per year. A 5% monthly churn means you lose half your customers every year — which requires enormous acquisition just to stay flat.',
    howAskBizDoesIt: 'Upload your customer or subscription data. Ask "What is my customer churn rate?" AskBiz calculates monthly and annual churn, identifies which customer segments churn most, and flags the point at which customers typically churn — giving you a target for intervention.',
    example: 'A subscription box company asks AskBiz to analyse churn. Overall monthly churn is 4.2%. But AskBiz identifies that customers acquired through paid social churn at 7.8% while word-of-mouth customers churn at only 1.9%. The company shifts acquisition budget toward referral incentives.',
    formula: 'Churn Rate % = (Customers Lost ÷ Customers at Start of Period) × 100',
    relatedTerms: ['mrr', 'customer-lifetime-value', 'cac-to-ltv-ratio', 'arr'],
    faqs: [
      { q: 'What is a good churn rate?', a: 'For SaaS and subscriptions, under 2% monthly (under 22% annually) is considered acceptable. Under 0.5% monthly is excellent. For retail, the equivalent metric is customer return rate — over 40% returning customers is healthy.' },
    ]
  },
  {
    slug: 'what-is-liquidity',
    category: 'translate',
    title: 'What is Liquidity in Business? Plain English Explanation',
    metaDescription: 'Liquidity explained simply. What it means for your business, the difference between liquid and illiquid assets, and how to measure your liquidity.',
    term: 'Liquidity',
    shortDefinition: 'How easily your business can convert assets into cash to meet immediate financial obligations.',
    simpleEnglish: 'Liquidity is your ability to pay your bills right now. Cash is perfectly liquid. Property is very illiquid — it takes months to convert to cash. A business with lots of property and equipment but little cash might look valuable on paper but struggle to pay this month\'s supplier invoices.',
    whyItMatters: 'Liquidity problems kill businesses that look healthy on paper. A profitable manufacturer with all its value tied up in machinery and slow-paying clients can fail to meet payroll. Maintaining adequate liquidity means keeping enough accessible cash (or near-cash) to handle obligations as they fall due.',
    howAskBizDoesIt: 'Upload your financial data. Ask "What is my liquidity position?" AskBiz calculates your current ratio and quick ratio, maps your near-term cash obligations against available liquid assets, and flags any liquidity risk in the next 30-90 days.',
    example: 'A distributor looks profitable but is constantly stressed about cash. AskBiz calculates a current ratio of 0.9 — meaning current liabilities exceed current assets. The primary cause: £85,000 in slow-paying trade receivables. AskBiz recommends invoice financing as an immediate solution.',
    formula: 'Current Ratio = Current Assets ÷ Current Liabilities',
    relatedTerms: ['working-capital', 'cash-flow', 'accounts-receivable', 'burn-rate'],
    faqs: [
      { q: 'What is the difference between liquidity and solvency?', a: 'Liquidity is about short-term cash availability — can you pay bills today? Solvency is about long-term viability — are your total assets greater than total liabilities? You can be solvent but illiquid (and vice versa).' },
    ]
  },
  {
    slug: 'what-is-accounts-receivable',
    category: 'translate',
    title: 'What is Accounts Receivable? Plain English Guide',
    metaDescription: 'Accounts receivable explained simply. What it is, how it differs from cash, why it matters for small business cash flow, and how to manage it.',
    term: 'Accounts Receivable',
    shortDefinition: 'Money that customers owe your business for goods or services already delivered but not yet paid for.',
    simpleEnglish: 'Accounts receivable is the pile of unpaid invoices sitting in your business. You\'ve done the work or delivered the product — now you\'re waiting for the money. Until it arrives, it sits in accounts receivable. It counts as an asset on your balance sheet, but it\'s not the same as cash in your account.',
    whyItMatters: 'Large accounts receivable figures are a warning sign. It means your revenue is real but your cash isn\'t. The bigger the gap between your revenue and your cash, the more working capital pressure you face. Slow-paying customers can force you to borrow money to cover your own costs — paying interest on cash that\'s technically already yours.',
    howAskBizDoesIt: 'Upload your sales and payment data. Ask "How is my accounts receivable performing?" AskBiz calculates average days to collect, identifies your oldest and largest unpaid invoices, and ranks your worst-paying customers by the cash they\'re holding.',
    example: 'A B2B services company has £220,000 in accounts receivable. AskBiz reveals the top 3 clients represent £140,000 of that, averaging 78 days to pay against 30-day terms. It calculates the cost of this slow payment at £8,400/year in financing and recommends immediate outreach to these accounts.',
    relatedTerms: ['accounts-payable', 'days-sales-outstanding', 'working-capital', 'cash-flow'],
    faqs: [
      { q: 'What is DSO and how does it relate to accounts receivable?', a: 'DSO (Days Sales Outstanding) is the average number of days it takes to collect payment after a sale. It\'s the speed measurement of your accounts receivable. High DSO = slow collections = cash flow pressure.' },
    ]
  },
  {
    slug: 'what-is-balance-sheet',
    category: 'translate',
    title: 'What is a Balance Sheet? Simple Explanation',
    metaDescription: 'Balance sheet explained in plain English. What the three sections mean, how to read one, and what it tells you about your business\'s financial health.',
    term: 'Balance Sheet',
    shortDefinition: 'A financial snapshot showing what your business owns (assets), what it owes (liabilities), and what\'s left for the owner (equity) at a specific point in time.',
    simpleEnglish: 'A balance sheet is a photo of your business\'s finances at one moment. On one side: everything the business owns (cash, stock, equipment, money owed to you). On the other side: everything the business owes (loans, supplier bills, tax). The difference is the owner\'s equity — what would be left if you sold everything and paid all debts.',
    whyItMatters: 'The balance sheet tells you the true financial health of your business beyond monthly profit. A business showing consistent profit might be accumulating debt at the same time. The balance sheet reveals that. It\'s required for tax, needed for loans, and essential for understanding whether your business is building or consuming value.',
    howAskBizDoesIt: 'AskBiz can analyse balance sheet data you upload and explain every line in plain English. Ask "Explain my balance sheet" and AskBiz breaks down each section, flags warning signs, and compares your ratios to healthy benchmarks.',
    example: 'A business owner uploads their accountant\'s balance sheet. AskBiz explains each section, highlights that their debt-to-equity ratio is 2.4 (considered high risk), and identifies that most of the debt is in short-term obligations — a liquidity risk requiring immediate attention.',
    relatedTerms: ['working-capital', 'liquidity', 'accounts-receivable', 'net-profit'],
    faqs: [
      { q: 'Why does the balance sheet "balance"?', a: 'Because of the fundamental accounting equation: Assets = Liabilities + Owner\'s Equity. Everything the business owns was either financed by debt (liabilities) or by owner investment and retained profits (equity). The two sides must always be equal.' },
    ]
  },
  {
    slug: 'what-is-unit-economics',
    category: 'translate',
    title: 'What is Unit Economics? Simple Business Explanation',
    metaDescription: 'Unit economics explained in plain English. What it is, why it matters more than total revenue, and how to calculate it for your business.',
    term: 'Unit Economics',
    shortDefinition: 'The revenue and cost directly associated with a single "unit" of your business — whether that\'s one product sold, one customer, or one transaction.',
    simpleEnglish: 'Unit economics asks: does your business make money on a single sale, before worrying about scale? If it costs you £80 to acquire a customer who spends £60, your unit economics are broken — you lose money on every customer regardless of how many you acquire. Good unit economics means each transaction is profitable on its own.',
    whyItMatters: 'Unit economics is the litmus test for business viability. A business with bad unit economics doesn\'t get better as it scales — it gets worse. Lots of revenue can mask terrible unit economics. The question isn\'t "are we growing?" but "are we profitable on each thing we sell?"',
    howAskBizDoesIt: 'Upload your sales and cost data. Ask "What are my unit economics?" AskBiz calculates contribution margin per unit, compares it against customer acquisition cost, and models what happens to profitability as you scale.',
    example: 'A DTC brand has strong revenue growth but keeps losing money. AskBiz calculates unit economics: average order value £45, variable costs per order £28, contribution margin £17. But average CAC is £31 — meaning they lose £14 on every customer acquired through paid channels. AskBiz identifies organic acquisition as the only viable growth channel.',
    formula: 'Unit Contribution = Revenue per Unit − Variable Costs per Unit',
    relatedTerms: ['contribution-margin', 'cac-to-ltv-ratio', 'customer-lifetime-value', 'gross-margin'],
    faqs: [
      { q: 'How do unit economics relate to LTV:CAC ratio?', a: 'LTV:CAC is a specific unit economics ratio comparing the lifetime value of a customer to the cost of acquiring them. If LTV:CAC is above 3:1, the business is generally considered economically healthy. Below 1:1, you\'re losing money on every customer.' },
    ]
  },
]

// Helper functions
export function getAllSlugs(): { category: string; slug: string }[] {
  return SEO_CONTENT.map(e => ({ category: e.category, slug: e.slug }))
}

export function getEntry(category: string, slug: string): SeoEntry | undefined {
  return SEO_CONTENT.find(e => e.category === category && e.slug === slug)
}

export function getRelatedEntries(entry: SeoEntry): SeoEntry[] {
  return entry.relatedTerms
    .map(slug => SEO_CONTENT.find(e => e.slug === slug))
    .filter(Boolean) as SeoEntry[]
}

export function getAllHowTo(): SeoEntry[] {
  return SEO_CONTENT.filter(e => e.category === 'how-to')
}

export function getAllTranslate(): SeoEntry[] {
  return SEO_CONTENT.filter(e => e.category === 'translate')
}
