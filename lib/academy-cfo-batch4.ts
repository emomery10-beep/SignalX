import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_BATCH_4: AcademyArticle[] = [
  // ─── Module 8 continued: Rolling Cash Forecast (articles 76–80) ───────────

  {
    slug: "understanding-receivables-cash-forecast",
    title: "Understanding Receivables in the Cash Forecast",
    description:
      "Learn how outstanding invoices and unpaid orders affect your projected cash inflows inside the AskBiz Rolling Cash Forecast.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "receivables",
      "cash forecast",
      "projected inflows",
      "outstanding invoices",
      "AskBiz CFO",
      "rolling forecast",
      "accounts receivable",
    ],
    keyTakeaways: [
      "Outstanding invoices appear as projected inflows in the weeks they are expected to be paid, not the week they were issued.",
      "If receivables are delayed or unpaid, the forecast automatically reduces projected inflows for those weeks.",
      "Keeping your connected store's order and invoice data current ensures the forecast reflects real cash timing.",
    ],
    content: [
      {
        heading: "What Are Receivables in the Context of AskBiz?",
        body: "Receivables are money owed to your business — usually from customers who have placed orders but have not yet paid, or from B2B invoices you have sent and are waiting to collect. In AskBiz, receivables are pulled directly from your connected store (Shopify, WooCommerce, or other integrations). When an order is marked as pending payment or an invoice shows as unpaid, AskBiz records that amount as an expected inflow. The Rolling Cash Forecast in your CFO dashboard then places that expected inflow in the week the payment is most likely to arrive, based on your typical collection patterns.",
      },
      {
        heading: "How Receivables Appear in the Weekly Forecast Table",
        body: "To see receivables in action, open the Intelligence tab and go to the Cash Flow view. Scroll down to the Rolling Cash Forecast section. The weekly table shows three rows for each week: Projected Inflows, Projected Outflows, and Net Cash. Your receivables contribute to the Projected Inflows figure. Hover over any inflow figure and a tooltip will break it down — showing revenue from expected sales alongside any outstanding receivables due in that week. If you have a large invoice due on Wednesday of a given week, its full amount appears in that week's inflow column.",
      },
      {
        heading: "What Happens When Receivables Are Delayed",
        body: "Late-paying customers directly impact the forecast. When a payment that was expected in Week 2 does not arrive on time, AskBiz detects the outstanding status from your connected store and shifts that inflow into the next available week — or flags it as unresolved. The result is that Week 2 will show a lower projected inflow than originally forecast, and your Net Cash figure for that week shrinks accordingly. This is valuable because it warns you of a potential shortfall before the week arrives rather than after you have already missed paying a bill.",
      },
      {
        heading: "Keeping Receivables Accurate",
        body: "The accuracy of your receivables data depends on how well your connected store tracks invoice and payment status. Here is how to keep it clean: Step 1 — Make sure all customer invoices are created in your connected platform, not tracked manually on paper. Step 2 — Mark invoices as paid as soon as payment is received so AskBiz stops counting them as pending inflows. Step 3 — If a customer is reliably slow to pay, consider manually adjusting your payment terms in the store so AskBiz applies a more realistic collection window. Step 4 — Use the Ask AI button on the Rolling Cash Forecast card to get a plain-language summary of which receivables are affecting this week or next week most significantly.",
      },
      {
        heading: "Receivables vs. Expected Revenue",
        body: "It is worth distinguishing between receivables and expected revenue from new sales. Expected revenue is AskBiz's projection of what you will likely sell in upcoming weeks, based on historical performance and seasonal patterns. Receivables, by contrast, are amounts already owed — real money from real transactions. The forecast blends both into the Projected Inflows figure. When reviewing the forecast, receivables are the more certain of the two inputs, so if you see a strong inflow week, check whether it is driven by receivables (confirmed money) or projected sales (an estimate). The Ask AI button can explain the mix in simple terms.",
      },
    ],
    relatedSlugs: [
      "what-is-rolling-cash-forecast-askbiz",
      "how-to-read-weekly-forecast-table",
      "using-forecast-to-spot-cash-shortfalls",
    ],
    faq: [
      {
        q: "Does AskBiz automatically pull receivables from Shopify?",
        a: "Yes. Once your Shopify store is connected, AskBiz reads order and payment status in real time. Any order marked as payment pending or an invoice marked unpaid will appear as a projected inflow in the relevant forecast week.",
      },
      {
        q: "What if I collect payment at the point of sale and have no invoices?",
        a: "In that case, your receivables balance is zero and the Projected Inflows column is driven entirely by expected revenue from future sales. This is common for retail and food-service businesses.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "using-forecast-to-spot-cash-shortfalls",
    title: "Using the Forecast to Spot Upcoming Cash Shortfalls",
    description:
      "Step-by-step guide to reading negative net weeks in the Rolling Cash Forecast and acting before a cash shortfall hits your business.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "cash shortfall",
      "negative net week",
      "rolling forecast",
      "cash flow warning",
      "AskBiz CFO",
      "forecast alert",
      "projected outflows",
    ],
    keyTakeaways: [
      "A negative Net Cash week in the forecast means your projected outflows exceed projected inflows for that period.",
      "AskBiz can typically warn you of a shortfall up to six weeks ahead, giving you time to act.",
      "The Ask AI button on the forecast card provides a prioritised action list for avoiding or closing a projected shortfall.",
    ],
    content: [
      {
        heading: "What a Negative Net Week Means",
        body: "In the Rolling Cash Forecast table, each week has a Net Cash figure calculated as Projected Inflows minus Projected Outflows. When this number is positive, your business is expected to add cash that week. When it is negative — displayed in red — your business is projected to spend more than it takes in. A single negative week is not always a crisis: many businesses have high-cost weeks (payroll week, rent week) that are naturally negative but balanced by strong revenue weeks. The real warning signal is when the running total at the bottom of the table shows a declining cash balance over multiple consecutive weeks, or when the balance is projected to fall below a healthy buffer.",
      },
      {
        heading: "How Many Weeks Ahead Does the Forecast Warn You?",
        body: "The Rolling Cash Forecast projects six weeks into the future by default. This means that if a shortfall is brewing — for example, a large supplier payment falls in Week 4 but sales are forecast to be weak — you will see the problem as early as today. Six weeks is typically enough lead time to take action: you could accelerate collections from customers, delay a discretionary purchase, arrange a short-term credit facility, or adjust your marketing spend to boost near-term revenue.",
      },
      {
        heading: "Reading the Forecast Table Step by Step",
        body: "To spot a shortfall, follow these steps. Step 1 — Open the Intelligence tab and navigate to the Cash Flow view. Step 2 — Scroll to the Rolling Cash Forecast section. Step 3 — Scan the Net Cash row across all six weeks. Look for any week shown in red (negative). Step 4 — Look at the running cash balance row at the bottom of the table. If the balance is trending down week after week and approaches zero, that is your shortfall warning. Step 5 — Click on any negative week to expand the detail panel, which lists the specific outflows driving the deficit. Step 6 — Note how many weeks away the first negative week is — this is your action window.",
      },
      {
        heading: "Taking Action on a Projected Shortfall",
        body: "Once you identify a negative week, tap the Ask AI button on the forecast card. AskBiz AI will read your specific data and suggest actions ranked by impact. Common recommendations include: pulling forward a customer payment by offering an early-payment discount, reducing a variable cost category in the coming weeks, deferring a planned equipment purchase, or drawing on a business credit line to bridge the gap. You can also manually adjust the forecast by opening Cost Configuration and reducing planned expenditures to see how the net figure responds in real time.",
      },
      {
        heading: "The Difference Between a Warning and a Crisis",
        body: "Seeing a red week in the forecast is a warning, not a verdict. The forecast is a projection based on current data, and your actions can change it. The value of AskBiz's forecast is precisely that it converts a potential crisis into a manageable problem by surfacing it early. Business owners who check the forecast weekly report far fewer genuine cash emergencies because problems are caught at the warning stage. Make reviewing the forecast a standing part of your weekly financial check-in — it takes less than two minutes to scan the six-week table and confirm everything is on track.",
      },
    ],
    relatedSlugs: [
      "what-is-rolling-cash-forecast-askbiz",
      "how-to-read-weekly-forecast-table",
      "understanding-receivables-cash-forecast",
    ],
    faq: [
      {
        q: "Can I change the forecast horizon beyond six weeks?",
        a: "The default forecast window is six weeks. For a longer-range view, use the 12-Month Cash Projection chart on the Cash Runway drill-down panel, which extends your outlook to a full year.",
      },
      {
        q: "What if the forecast shows a shortfall but I know I have a large order incoming?",
        a: "Make sure the incoming order is recorded in your connected store as a confirmed order or invoice. Once it is in the system, AskBiz will pick it up and include the expected payment in the relevant forecast week, which should reduce or eliminate the projected shortfall.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "using-forecast-for-hiring-investment",
    title: "Using the Forecast for Hiring or Investment Decisions",
    description:
      "How to model a new hire or capital investment against your projected cash position using the AskBiz Rolling Cash Forecast and Cost Configuration tools.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: [
      "hiring decision",
      "investment decision",
      "cash forecast modelling",
      "new hire cost",
      "AskBiz CFO",
      "fixed costs",
      "cash runway",
    ],
    keyTakeaways: [
      "You can model a new hire's total cost by adding their salary and employer costs to your Fixed Costs configuration and watching the forecast update immediately.",
      "The forecast shows exactly how many weeks of runway the additional cost removes, giving you a data-driven hiring timeline.",
      "Combining the forecast with the Cash Runway card gives a complete picture of whether the business can sustain the investment over the next six to twelve months.",
    ],
    content: [
      {
        heading: "Why the Forecast Is the Right Tool for Hiring Decisions",
        body: "Hiring someone is one of the largest ongoing cost commitments you will make as a business owner. A new full-time employee does not just cost their monthly salary — it also includes employer taxes, equipment, onboarding time, and often reduced productivity during the first one to three months. The Rolling Cash Forecast lets you stress-test the decision before signing an offer letter. By adding the total cost to your configuration, you can see exactly how the hire affects your projected net cash week by week and whether your cash balance can sustain it without a shortfall.",
      },
      {
        heading: "Step 1 — Calculate the True Monthly Cost of the Hire",
        body: "Before modelling in AskBiz, work out the total monthly cost. Start with the gross salary. Add employer national insurance or payroll tax (typically 10 to 15 percent depending on your jurisdiction). Add any benefits such as pension contributions, health cover, or equipment. Include a rough onboarding allowance for the first month. For example, a hire with a $3,500 monthly salary might cost $4,200 all-in once taxes and benefits are added. This is the number you will enter into AskBiz.",
      },
      {
        heading: "Step 2 — Add the Cost to Your Fixed Cost Configuration",
        body: "Open the Intelligence tab and navigate to Cash Flow. Click the Cost Configuration button (usually a gear or settings icon near the top right of the CFO section). In the Fixed Costs panel, click Add Cost. Name it something clear such as New Hire — Sales Associate. Enter the monthly amount. Set the start date to the proposed hire date. Save the configuration. AskBiz will immediately recalculate your Projected Outflows for all future weeks from that start date onward.",
      },
      {
        heading: "Step 3 — Read the Forecast Impact",
        body: "With the new cost added, return to the Rolling Cash Forecast table. Compare the Net Cash row and running balance to what they showed before. Notice two things: first, the weekly Net Cash figures will be lower from the hire date forward; second, the running balance will decline faster. Now look at the Cash Runway card — it will have recalculated to show the new runway with the hire included. If the original runway was 14 months and the hire reduces it to 10 months, you now have a concrete number to weigh against the expected revenue the hire will generate.",
      },
      {
        heading: "Step 4 — Stress Test With the Ask AI Button",
        body: "Once you have modelled the hire, click Ask AI on the Cash Runway card. AskBiz AI will analyse the new configuration and give you a plain-language assessment: Can your current trajectory support this hire? What revenue increase would the hire need to generate within 90 days to remain cash-positive? Are there lower-priority costs you could reduce to offset the hire? This gives you a balanced, data-informed view rather than a purely intuitive one. If the numbers are close, you can also model a part-time hire first by entering 50 percent of the full cost and checking whether the forecast remains healthy.",
      },
    ],
    relatedSlugs: [
      "how-to-configure-fixed-costs-askbiz",
      "using-forecast-with-cost-configuration",
      "how-to-read-cash-runway-card",
    ],
    faq: [
      {
        q: "Does adding a test cost to Cost Configuration affect my live financial data?",
        a: "Yes — changes to Cost Configuration update the forecast in real time. If you are modelling a hypothetical hire, note the current figures before you add the cost so you can compare, then remove it if you decide not to proceed.",
      },
      {
        q: "Can I model a one-time investment like equipment instead of an ongoing salary?",
        a: "Yes. Add the equipment cost to your Variable Costs configuration with a one-time date. The forecast will show the cash impact in the specific week of purchase, and you can see how quickly the balance recovers.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-forecast-accounts-seasonal-patterns",
    title: "How the Forecast Accounts for Seasonal Patterns",
    description:
      "Understand how AskBiz uses historical seasonality and holiday period data to make your Rolling Cash Forecast more accurate across the year.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "seasonal patterns",
      "seasonality",
      "holiday periods",
      "cash forecast accuracy",
      "AskBiz CFO",
      "historical weighting",
      "rolling forecast",
    ],
    keyTakeaways: [
      "AskBiz weights projected inflows using the same weeks from prior years, so peak seasons and slow seasons are automatically reflected.",
      "Holiday periods such as Christmas, Black Friday, and Ramadan are recognised and factored into the projection if your historical data covers them.",
      "After your first year with AskBiz, seasonality accuracy improves significantly as more historical data accumulates.",
    ],
    content: [
      {
        heading: "How Seasonality Weighting Works",
        body: "When AskBiz calculates projected inflows for a future week, it does not simply use a flat average of recent revenue. Instead, it looks at the same calendar week in prior years and applies a weighting based on how that week historically performed relative to your annual average. If Week 48 (late November) has historically generated 180 percent of your average weekly revenue due to Black Friday shopping, the forecast for Week 48 this year will reflect that uplift. Conversely, if Week 6 (mid-February) is traditionally your slowest week, the forecast will project a lower inflow accordingly.",
      },
      {
        heading: "Holiday Periods and Their Effect",
        body: "Major holiday periods affect both inflows and outflows. On the inflow side, retail and e-commerce businesses typically see spikes around Christmas, Eid, Diwali, Black Friday, and Back to School periods. AskBiz recognises these periods from your sales history and elevates projected inflows during those weeks. On the outflow side, holiday periods often bring higher variable costs — extra stock, temporary staff, increased advertising spend. If these costs are logged in your expense history, the forecast will also project higher outflows in those weeks. The result is a more realistic Net Cash figure for each seasonal period.",
      },
      {
        heading: "What You Need for Accurate Seasonal Forecasting",
        body: "Seasonal accuracy depends on having at least 12 months of transaction data connected to AskBiz. In your first year, the forecast uses available data and fills gaps with industry patterns for your business type. From your second year onward, AskBiz has a full year of your specific seasonality to draw from, which makes the projections considerably more accurate. To maximise accuracy: Step 1 — Ensure your historical orders are fully imported from your connected store. Step 2 — Keep your expense records complete and up to date so past outflow patterns are available. Step 3 — If you know of an unusual spike last year that will not repeat (a one-off promotion, for example), use the Ask AI button to note this so the model is not skewed by it.",
      },
      {
        heading: "Reading Seasonal Signals in the Forecast Table",
        body: "To see seasonal effects in action, open the Rolling Cash Forecast and examine the Projected Inflows row across the six weeks. If you are approaching a known peak period, you should see the inflow figures climbing in the final weeks of the table. If you are heading into a slow season, the figures will flatten or dip. Compare these projections to your Cash Runway figure — a slow season ahead means your runway calculation is based on realistic forward revenue, not an overly optimistic flat average. This makes the runway figure more trustworthy and prevents you from being caught off-guard when revenue dips.",
      },
      {
        heading: "Preparing Your Business for Seasonal Troughs",
        body: "The most practical use of seasonal forecasting is preparing in advance for known slow periods. When the forecast shows a multi-week trough of lower inflows coming up, you have several options: build up cash reserves in the preceding strong period, reduce variable costs proactively (cut ad spend that will not convert during a slow season), delay non-urgent purchases until after the trough passes, or arrange a business credit facility before you need it rather than in the middle of a cash-tight month. The Ask AI button on the forecast card can suggest specific actions tailored to your projected trough.",
      },
    ],
    relatedSlugs: [
      "what-is-rolling-cash-forecast-askbiz",
      "using-forecast-to-spot-cash-shortfalls",
      "using-forecast-with-cost-configuration",
    ],
    faq: [
      {
        q: "My business launched three months ago — will the seasonal forecast be accurate?",
        a: "With less than 12 months of data, AskBiz relies partly on industry benchmarks for your business category. The projections are directionally useful but less precise. Accuracy improves significantly after your first full year.",
      },
      {
        q: "Can I manually override a seasonal projection if I know this year will be different?",
        a: "The best way to influence the projection is to adjust your Cost Configuration and ensure all confirmed orders are in your connected store. For revenue adjustments, use the Ask AI button and describe the change — the AI can explain how to account for it.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "using-forecast-with-cost-configuration",
    title: "Using the Forecast Alongside Your Cost Configuration",
    description:
      "See how updating your Fixed or Variable Cost Configuration in AskBiz immediately shifts the Rolling Cash Forecast, giving you a real-time view of the impact.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "cost configuration",
      "forecast update",
      "fixed costs",
      "variable costs",
      "AskBiz CFO",
      "rolling forecast",
      "cost impact",
    ],
    keyTakeaways: [
      "Any change to your Fixed or Variable Cost Configuration is reflected in the Rolling Cash Forecast within seconds.",
      "This live feedback loop lets you test cost changes before committing to them — a powerful what-if tool.",
      "Reducing a cost category in configuration immediately shows the improvement in net cash and runway.",
    ],
    content: [
      {
        heading: "The Live Connection Between Costs and the Forecast",
        body: "The Rolling Cash Forecast and your Cost Configuration are directly linked in AskBiz. When you add, edit, or remove a cost in the configuration panel, the forecast table recalculates instantly. This means you can use the forecast as a live what-if sandbox: add a potential new cost, see what it does to your runway, then remove it if the impact is unacceptable. Most business owners find this the most immediately practical feature of the CFO dashboard once they understand how it works.",
      },
      {
        heading: "How to Access Cost Configuration",
        body: "Step 1 — Open the Intelligence tab and navigate to the Cash Flow view. Step 2 — Look for the Cost Configuration button near the top of the CFO section — it may appear as a gear icon or a labelled button depending on your screen size. Step 3 — The configuration drawer opens on the right side of the screen (or as a modal on mobile). You will see two sections: Fixed Costs and Variable Costs. Step 4 — Fixed Costs are recurring monthly amounts (rent, salaries, subscriptions). Variable Costs are amounts that change with activity (shipping, packaging, ad spend). Step 5 — Click any existing cost to edit it, or click Add Cost to enter a new one.",
      },
      {
        heading: "Watching the Forecast Shift in Real Time",
        body: "After making a change in Cost Configuration, close the drawer and look at the Rolling Cash Forecast table. The Projected Outflows row will have updated to reflect your change across all future weeks. The Net Cash row and running cash balance will also have recalculated. If you increased a cost, expect to see lower net figures and a reduced runway. If you reduced a cost, you will see an improvement. The cash runway card at the top of the dashboard will also have updated its headline number. This real-time feedback is what makes cost configuration a planning tool rather than just a record-keeping exercise.",
      },
      {
        heading: "Practical Examples of the Feedback Loop",
        body: "Here are three common ways business owners use this tool. Scenario A — Lease renewal: Your landlord has increased rent by 15 percent. Open Cost Configuration, update your rent figure, and immediately see the new runway. If the runway drops below six months, that is your signal to negotiate harder or find savings elsewhere. Scenario B — Cancelling a subscription: You are considering cancelling a $400 per month SaaS tool. Remove it from Variable Costs and check whether the forecast improvement justifies the operational disruption. Scenario C — Seasonal cost reduction: Each January you reduce your ad spend by 40 percent. Update the variable cost for January in configuration and confirm the forecast shows the expected cash improvement.",
      },
      {
        heading: "Keeping Configuration Accurate Over Time",
        body: "The forecast is only as good as the cost data behind it. Make a habit of reviewing your Cost Configuration at least monthly. Check whether any fixed costs have changed — subscription prices creep up, utility bills vary with the seasons, and staff costs change when you hire or lose someone. When you review, compare your configured costs against your actual expense tab to check for discrepancies. If costs in the expense tab consistently exceed the configuration, update the configuration upward so the forecast reflects reality. The Ask AI button on the forecast card can highlight if your projected outflows appear to be consistently underestimating actuals.",
      },
    ],
    relatedSlugs: [
      "how-to-configure-fixed-costs-askbiz",
      "how-to-configure-variable-costs-askbiz",
      "what-is-rolling-cash-forecast-askbiz",
    ],
    faq: [
      {
        q: "If I delete a cost from configuration, does it delete historical expense data too?",
        a: "No. Deleting a cost from configuration only removes it from future projections. All historical expense records in the Expenses tab remain intact.",
      },
      {
        q: "Can I set a cost to only apply for certain months?",
        a: "Yes. When adding or editing a cost, you can set a start date and an end date. This is useful for seasonal costs like summer staffing or holiday advertising that only apply for part of the year.",
      },
    ],
    videoUrl: "",
  },

  // ─── Module 9: Advanced CFO Usage (articles 81–90) ───────────────────────

  {
    slug: "connecting-expenses-to-pl-askbiz",
    title: "Connecting Your Expenses to Your P&L View",
    description:
      "Understand how the expense categories you assign in AskBiz map directly to Profit and Loss line items, giving you a coherent financial picture.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "P&L",
      "profit and loss",
      "expense categories",
      "financial reporting",
      "AskBiz CFO",
      "expense mapping",
      "income statement",
    ],
    keyTakeaways: [
      "Expense categories in AskBiz correspond to standard P&L line items, so categorising expenses correctly produces an accurate income statement.",
      "Cost of Goods Sold and Operating Expenses are the two main P&L buckets — assigning expenses correctly to each gives a true gross profit figure.",
      "The Intelligence tab's broader view combines CFO cash data with P&L line items for a full financial picture.",
    ],
    content: [
      {
        heading: "Why Category Assignment Matters",
        body: "When you log an expense in AskBiz — whether manually or via the AI receipt scanner — you assign it a category. The categories available in AskBiz are structured to align with standard Profit and Loss statement line items. This means that if you consistently assign expenses to the right categories, AskBiz can automatically produce a P&L view that shows not just your cash position but your profitability. Sloppy categorisation leads to misleading reports; careful categorisation turns AskBiz into your business's financial reporting engine.",
      },
      {
        heading: "The Two Main P&L Buckets",
        body: "A standard P&L has two main expense buckets. The first is Cost of Goods Sold (COGS) — these are direct costs that only occur when you make a sale: product cost, packaging, shipping to the customer, payment processing fees. The second is Operating Expenses (OpEx) — these are costs you incur regardless of sales volume: rent, salaries, software subscriptions, marketing, utilities. In AskBiz, expense categories are grouped under these two headings. When you categorise a delivery cost as COGS, it reduces your Gross Profit. When you categorise rent as OpEx, it reduces your Operating Profit. Getting this distinction right is the foundation of accurate profitability reporting.",
      },
      {
        heading: "Mapping AskBiz Categories to P&L Lines",
        body: "Here is how common AskBiz categories map to standard P&L lines. Inventory or product cost maps to Cost of Goods Sold. Shipping and fulfilment maps to Cost of Goods Sold. Payment processing fees map to Cost of Goods Sold. Rent and premises maps to Operating Expenses, Occupancy. Salaries and wages maps to Operating Expenses, Payroll. Advertising and marketing maps to Operating Expenses, Marketing. Software and subscriptions maps to Operating Expenses, Technology. Bank charges and interest map to Operating Expenses, Finance Costs. When in doubt about where a cost belongs, a useful rule is: would this cost disappear if you made zero sales? If yes, it is likely COGS. If no, it is likely OpEx.",
      },
      {
        heading: "Reviewing Your Expense Categories",
        body: "To audit your current categorisation, open the Expenses tab in the CFO section. Filter by the last 30 days. Scan the category column for any expenses marked as Uncategorised or assigned to a vague catch-all. Click on each one to reassign it to the correct category. If you notice patterns — for example, your assistant always logs fuel as Miscellaneous when it should be Delivery under COGS — set a brief team guideline for consistent categorisation. You can also use the AI receipt scanner in the Expenses tab, which will suggest a category based on the merchant name and amount, reducing manual effort.",
      },
      {
        heading: "Seeing the P&L in the Intelligence Tab",
        body: "Once your expenses are correctly categorised, navigate to the Intelligence tab. Here you can see the broader P&L view that builds on your CFO data. The Gross Profit line is Revenue minus COGS. The Operating Profit line is Gross Profit minus OpEx. Net Profit deducts any finance costs and tax estimates. This view connects directly to the cash data from your CFO dashboard, giving you both a cash flow picture (will we have enough cash next month?) and a profitability picture (are we actually making money?). Both are necessary for a complete understanding of business financial health.",
      },
    ],
    relatedSlugs: [
      "intro-to-expenses-tab-askbiz",
      "how-expense-data-connects-burn-rate",
      "how-askbiz-cfo-connects-intelligence-tab",
    ],
    faq: [
      {
        q: "Can I customise the expense categories in AskBiz?",
        a: "AskBiz provides a standard set of categories aligned with common P&L structures. For most SMBs these cover all common cost types. If you need a custom category for a specific business cost, use the closest standard category and note the detail in the expense description field.",
      },
      {
        q: "Does AskBiz produce a formal P&L report I can share with my accountant?",
        a: "The Intelligence tab provides a P&L summary view. For a formal report to share with your accountant, take a screenshot of the P&L view or use the export function if available in your subscription tier. The article on preparing financials for your accountant covers this in detail.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "building-monthly-financial-narrative-askbiz",
    title: "Building a Monthly Financial Narrative with AskBiz",
    description:
      "How to use AskBiz CFO data to construct a clear, compelling financial story of the month — for yourself, your team, or your investors.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: [
      "financial narrative",
      "monthly review",
      "financial story",
      "AskBiz CFO",
      "business reporting",
      "cash flow summary",
      "P&L narrative",
    ],
    keyTakeaways: [
      "A financial narrative combines the four CFO metric cards, the cash flow chart, the expense breakdown, and the forecast into a single coherent story.",
      "The Ask AI button on any CFO card can generate a plain-language summary of that metric for the month, which you can use as a starting point.",
      "A good narrative explains not just what happened (the numbers) but why it happened and what you plan to do about it.",
    ],
    content: [
      {
        heading: "Why a Financial Narrative Matters",
        body: "Raw numbers tell you what happened. A financial narrative tells the story of the month: what drove the results, what surprised you, what risks or opportunities emerged, and what you are going to do next. For solo founders, building this narrative forces clarity of thinking. For teams, it aligns everyone on the financial reality. For investors or advisors, it demonstrates that you understand your numbers deeply. AskBiz CFO provides all the raw data — this guide shows you how to weave it into a narrative.",
      },
      {
        heading: "Step 1 — Gather the Four Headline Numbers",
        body: "Start with the four cards at the top of the Cash Flow tab: Cash Balance, Daily Net Gain/Burn, Monthly Fixed Costs, and Cash Runway. Screenshot or note these four numbers. For each one, answer: Is this better or worse than last month? Is it better or worse than the same month last year (if you have the data)? Is it moving in the right direction? These comparisons form the opening paragraph of your narrative — a brief statement of the overall financial health of the month.",
      },
      {
        heading: "Step 2 — Describe the Cash Flow Story",
        body: "Open the interactive cash flow chart and switch to the 30-day view. Look for the shape of the month: was revenue steady or lumpy? Were there any unusual expense spikes? Was the trend upward, downward, or flat? Hover over any notable day (a sharp dip or a strong spike) to see the day detail. Note the dates and amounts of any outliers. Your narrative's second section explains the cash flow pattern: what drove the strong days, what caused the weak ones, and whether the pattern is typical or unusual for this time of year.",
      },
      {
        heading: "Step 3 — Break Down Costs",
        body: "Go to the Expenses tab and look at the top five expense categories for the month. Did any category exceed its typical level? Did any discretionary cost feel worth it in retrospect? Are there categories trending upward that warrant investigation? Your narrative should include a one-paragraph cost commentary: total costs for the month, the largest single category, any category that changed significantly compared to last month, and your assessment of cost discipline. Use the Ask AI button on the burn rate card to get an AI-generated cost breakdown summary to start from.",
      },
      {
        heading: "Step 4 — Connect to the Forward View",
        body: "End the narrative with a forward-looking section based on the Rolling Cash Forecast. Open the forecast table and note the overall trajectory for the next six weeks. Is the running cash balance stable, growing, or declining? Is there a known shortfall coming? Are there seasonal factors that will affect the next 30 days? This section of the narrative is your planning section — state what you will do to capitalise on positive momentum or address any headwinds. The Ask AI button on the forecast card will generate a plain-language forward summary you can adapt. A good monthly financial narrative is one to two pages, covers past performance, explains the key drivers, and closes with a clear forward plan.",
      },
    ],
    relatedSlugs: [
      "monthly-financial-review-cfo-dashboard",
      "how-to-use-daily-cash-chart",
      "connecting-expenses-to-pl-askbiz",
    ],
    faq: [
      {
        q: "How long should a monthly financial narrative be?",
        a: "For internal use, one page or a short slide is sufficient. For investors or advisors, two pages with supporting screenshots from AskBiz is appropriate. The goal is clarity, not length.",
      },
      {
        q: "Can I use AskBiz AI to write the whole narrative for me?",
        a: "The Ask AI button on each CFO card generates a summary of that specific metric. You can combine these summaries and edit them into a coherent narrative. Think of AI as a first-draft assistant — you add the context, judgement, and forward plan.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-benchmark-burn-rate-by-stage",
    title: "How to Benchmark Your Burn Rate by Business Stage",
    description:
      "Compare your AskBiz burn rate against what is typical for your business stage — pre-revenue, early revenue, or actively scaling.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "burn rate benchmark",
      "business stage",
      "pre-revenue",
      "early revenue",
      "scaling",
      "AskBiz CFO",
      "cash burn comparison",
    ],
    keyTakeaways: [
      "A pre-revenue business with high burn and zero income has a fundamentally different risk profile than a scaling business burning cash to fuel growth.",
      "AskBiz's Daily Net Gain/Burn card shows your net burn — comparing this to your revenue stage reveals whether your burn is proportionate.",
      "The right burn rate benchmark depends on your business type, funding source, and growth trajectory.",
    ],
    content: [
      {
        heading: "Why Stage Matters for Burn Rate Assessment",
        body: "A burn rate of $5,000 per month means very different things depending on where your business is. For a pre-revenue startup with $30,000 in the bank, it means six months of runway and an urgent need to generate income. For a profitable retailer with $200,000 in cash and strong monthly revenue, $5,000 in net burn might be a temporary investment phase that makes complete sense. When you look at your Daily Net Gain/Burn card in AskBiz, always contextualise the number within your current stage and funding position.",
      },
      {
        heading: "Pre-Revenue Stage Benchmarks",
        body: "Pre-revenue businesses have no regular income offsetting costs. At this stage, burn rate is purely a countdown clock to zero. The entire cost base is burn. Benchmarks for this stage focus on cost discipline: monthly fixed costs should be as low as possible, ideally under $3,000 to $5,000 for a solo founder or small team, to maximise runway while working toward first revenue. In AskBiz, your Monthly Fixed Costs card should be the primary focus at this stage. The goal is to see this number as low as possible while the Cash Runway card stays above 12 months. If runway drops below six months without a clear revenue path, that is a critical signal to cut costs or accelerate revenue generation.",
      },
      {
        heading: "Early Revenue Stage Benchmarks",
        body: "Once you have consistent monthly revenue — even if not yet profitable — the picture changes. Now you have a Gross Burn (total monthly costs) and a Net Burn (costs minus revenue). AskBiz's Daily Net Gain/Burn card shows your net figure. At the early revenue stage, a net burn of 20 to 40 percent of your monthly revenue is generally considered manageable, provided you are growing. For example, if monthly revenue is $10,000 and net burn is $2,500, that is a 25 percent burn-to-revenue ratio. This is sustainable as long as revenue is growing. If revenue is flat and net burn persists at this level, investigate which costs can be reduced.",
      },
      {
        heading: "Scaling Stage Benchmarks",
        body: "Businesses actively scaling — investing in new hires, paid acquisition, or new market entry — may deliberately run a higher net burn for a defined period. The key discipline at this stage is that the burn should be an investment with a modelled return. For every $1,000 per month you add in costs (a new hire, an ad budget increase), you should be able to articulate the revenue uplift you expect within 90 days. In AskBiz, use the Cost Configuration tool to model the new cost and check the forecast. If the cash runway remains healthy throughout the scaling period and the business reaches a lower net burn or cash-positive position within the planned timeframe, the scaling investment is working.",
      },
      {
        heading: "Using AskBiz to Track Your Benchmark Over Time",
        body: "To benchmark your burn over time, use the 90-day view on the cash flow chart. This shows your daily net gain or burn over the past three months and reveals whether the trend is improving (burn reducing, gain growing) or deteriorating. Compare this trend to your stage: in pre-revenue, burn should be flat or falling. In early revenue, net burn should be shrinking as a percentage of revenue. In scaling, burn may spike temporarily but should show a clear trajectory toward improvement. Use the Ask AI button on the Daily Net Gain/Burn card to ask directly: Is my current burn rate appropriate for my stage? The AI will contextualise your number based on your data.",
      },
    ],
    relatedSlugs: [
      "burn-rate-vs-runway-relationship",
      "reading-burn-rate-formula-breakdown",
      "healthy-runway-by-funding-stage",
    ],
    faq: [
      {
        q: "What is the difference between gross burn and net burn in AskBiz?",
        a: "Gross burn is your total monthly spending before any revenue. Net burn is monthly spending minus monthly revenue. AskBiz's Daily Net Gain/Burn card shows your net figure — a positive number means you are net gaining cash, a negative number means net burning.",
      },
      {
        q: "Is there a burn rate that is objectively too high?",
        a: "Context matters, but a useful rule of thumb is that if your net burn would exhaust your cash balance within three months, that requires immediate action regardless of stage. AskBiz's Cash Runway card flags this with a red status.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "healthy-runway-by-funding-stage",
    title: "Understanding Healthy Runway by Funding Stage",
    description:
      "Learn what healthy cash runway looks like for bootstrapped businesses, seed-funded startups, and Series A companies — and how to read your AskBiz runway card accordingly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "cash runway",
      "funding stage",
      "bootstrapped",
      "seed funded",
      "Series A",
      "AskBiz CFO",
      "runway benchmark",
    ],
    keyTakeaways: [
      "Bootstrapped businesses should target at least six to nine months of runway to weather unexpected slow periods without external pressure.",
      "Seed-funded startups typically aim for 18 months of runway post-raise to give enough time to reach the next milestone.",
      "Series A companies often run with 12 to 18 months of runway by design, deliberately deploying capital to grow faster.",
    ],
    content: [
      {
        heading: "Why Funding Stage Shapes Runway Expectations",
        body: "Cash runway — visible on the Cash Runway card in your AskBiz CFO dashboard — tells you how many months your current cash balance can sustain your current spending rate. But the right runway target varies enormously depending on how your business is funded. A bootstrapped business with no investors and no external funding has different constraints than a startup that has raised $500,000. Understanding your stage helps you interpret your runway card correctly and set an appropriate target.",
      },
      {
        heading: "Bootstrapped Businesses",
        body: "Bootstrapped businesses — those funded entirely from personal savings, business revenue, or small bank loans — have no safety net if cash runs out. There is no investor to call for a bridge round. For this reason, bootstrapped businesses should maintain a conservative runway target of at least six to nine months. This buffer absorbs a bad quarter, a slow season, or an unexpected large expense without triggering an existential crisis. In AskBiz, monitor your Cash Runway card and treat anything below six months as a yellow alert requiring cost review or revenue acceleration. Below three months is a red alert requiring immediate action.",
      },
      {
        heading: "Seed-Funded Startups",
        body: "If you have raised a seed round, you have a defined amount of capital to deploy before needing to raise again or reach profitability. The standard expectation in the startup world is that a seed raise should provide 18 to 24 months of runway, giving sufficient time to reach product-market fit, build meaningful metrics, and make a credible case for a Series A. In AskBiz, when you first receive seed capital, your runway card should jump to 18 to 24 months. As you deploy capital, watch the card decline month by month. When it reaches 12 months, it is typically time to begin preparing the next fundraise — not at six months when you are under pressure.",
      },
      {
        heading: "Series A and Growth-Stage Companies",
        body: "At Series A, the dynamics shift again. You have raised a larger amount specifically to invest in growth — hiring, marketing, product development. Running a high burn rate is expected and appropriate. Most Series A companies operate with 12 to 18 months of runway deliberately, knowing they will raise a Series B before the runway expires. The key discipline is that the burn must be producing measurable growth milestones. In AskBiz, your Cash Runway card and Daily Net Burn card together tell you whether your deployment rate is tracking toward the milestones investors expected when they funded you.",
      },
      {
        heading: "Using AskBiz to Stay on Track",
        body: "Regardless of stage, the Cash Runway card is your central warning system. Set a mental (or literal) alarm at the runway level where you need to take action — for bootstrapped businesses that might be six months, for seed-funded startups it might be 12 months. Open AskBiz weekly and glance at the runway figure. If it is declining faster than expected, open the drill-down panel to understand whether it is a revenue shortfall, a cost increase, or both. Use the Ask AI button on the runway card to get a stage-contextualised assessment: given your current stage and trajectory, is your runway position healthy, manageable, or concerning?",
      },
    ],
    relatedSlugs: [
      "how-to-read-cash-runway-card",
      "how-cash-runway-is-calculated",
      "runway-status-levels-explained",
    ],
    faq: [
      {
        q: "My AskBiz runway card shows eight months — is that healthy?",
        a: "For a bootstrapped business, eight months is in the caution zone — healthy enough but not comfortable. For a seed-funded startup, eight months means fundraising should be a top priority now. The context of your funding stage matters enormously.",
      },
      {
        q: "Does AskBiz update runway in real time or once a month?",
        a: "Runway is updated continuously as your cash balance and spending rate change. Every new transaction from your connected store and every logged expense updates the calculation in real time.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "using-askbiz-cfo-data-for-fundraise",
    title: "Using AskBiz CFO Data to Prepare for a Fundraise",
    description:
      "How to extract and present AskBiz CFO metrics to investors — what they look for, how to organise the data, and how to tell a compelling financial story.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: [
      "fundraise",
      "investor data",
      "CFO metrics",
      "AskBiz export",
      "pitch preparation",
      "burn rate investors",
      "runway fundraise",
    ],
    keyTakeaways: [
      "Investors focus on four key CFO metrics: monthly burn rate, cash runway, revenue growth trajectory, and the path to profitability.",
      "AskBiz CFO provides all four of these metrics in real time, giving you investor-ready data without a finance team.",
      "Presenting clean, consistent AskBiz data in a fundraise shows operational discipline and builds investor confidence.",
    ],
    content: [
      {
        heading: "What Investors Actually Want to See",
        body: "When you walk into an investor conversation, the financial questions are predictable. How much are you spending per month? How much cash do you have left? How fast is revenue growing? When will you be profitable or cash-flow positive? These questions map directly to your AskBiz CFO cards: Daily Net Gain/Burn (monthly burn rate), Cash Runway (months of cash remaining), the 30-day and 90-day revenue trend (growth trajectory), and the Rolling Cash Forecast (projected path to sustainability). Having crisp, real-time answers to these questions — drawn from live data rather than a spreadsheet you updated last quarter — is a meaningful signal of operational maturity.",
      },
      {
        heading: "Step 1 — Compile the Four Core Metrics",
        body: "Before any investor meeting, open your AskBiz CFO dashboard and record the current state of four metrics. First: your current monthly net burn rate from the Daily Net Gain/Burn card — state it in monthly terms (multiply the daily figure by 30). Second: your current cash runway in months from the Cash Runway card. Third: your month-on-month revenue growth rate — check the cash flow chart in 90-day view and calculate the percentage change from the first month to the last month shown. Fourth: the projected date of cash-flow breakeven from the Rolling Cash Forecast, if visible. Prepare a one-page summary or a slide with these four numbers prominently displayed.",
      },
      {
        heading: "Step 2 — Build the Trend Story",
        body: "Investors care as much about trajectory as they do about the current snapshot. A business burning $8,000 per month but with burn declining 10 percent month-on-month is a more attractive investment than one burning $4,000 per month with burn increasing 20 percent. Use the 90-day cash flow chart in AskBiz to show your trend. If burn is declining, highlight that. If revenue is growing, show the month-on-month percentage. If your runway has actually extended over the past three months (meaning you are burning less than new cash coming in), that is extremely compelling to early-stage investors.",
      },
      {
        heading: "Step 3 — Present the Use of Funds",
        body: "Investors want to know exactly what you will do with the capital they provide. This is where the Cost Configuration tool in AskBiz becomes a presentation asset. Open Cost Configuration and model the new hires and investments you plan to make with the raise. Show the investor the forecast before and after funding: before, your runway might be 8 months; after the raise with the planned deployment, runway extends to 22 months and by month 14 the forecast shows cash-flow positive. This level of specificity — tied to real data rather than abstract projections — builds significant credibility.",
      },
      {
        heading: "Step 4 — Export and Present Your Data",
        body: "To share AskBiz data externally, take screenshots of the key views: the four CFO cards, the 90-day cash flow chart, the Rolling Cash Forecast table, and the P&L summary from the Intelligence tab. Annotate each screenshot with a brief caption explaining what the investor is looking at and why the number matters. Compile these into your investor data room or financial appendix. If your AskBiz subscription includes export functionality, use it to generate a clean PDF summary. The goal is to make it effortless for an investor to verify the health of your business without you needing to explain every number in a meeting.",
      },
    ],
    relatedSlugs: [
      "healthy-runway-by-funding-stage",
      "how-to-benchmark-burn-rate-by-stage",
      "building-monthly-financial-narrative-askbiz",
    ],
    faq: [
      {
        q: "Do investors trust AskBiz data or do they want audited accounts?",
        a: "Early-stage investors (angel, pre-seed, seed) typically accept management accounts and real-time dashboards as sufficient for initial due diligence. AskBiz CFO data is appropriate for this stage. Later-stage investors (Series A and beyond) will want formal accounts, but AskBiz data is still useful as supplementary real-time intelligence.",
      },
      {
        q: "What if my AskBiz data shows a difficult financial position?",
        a: "Transparency is valued by serious investors. Present the data honestly, acknowledge the challenges, and lead with the actions you are taking to improve the position. Trying to hide or obscure weak metrics in a fundraise destroys trust if discovered in due diligence.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-share-cfo-insights-with-team",
    title: "How to Share CFO Insights With Your Team",
    description:
      "Methods for sharing AskBiz CFO dashboard data with your team — from screenshots to exporting summaries and using the Intelligence tab collaboratively.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: [
      "share CFO data",
      "team financial transparency",
      "AskBiz export",
      "screenshot dashboard",
      "financial communication",
      "AskBiz CFO",
    ],
    keyTakeaways: [
      "Screenshots of the CFO cards and charts are the fastest way to share a financial snapshot with your team via message or email.",
      "The Intelligence tab provides a broader business view that is often more accessible for non-financial team members.",
      "Regular financial sharing builds team ownership and accountability around cost and revenue performance.",
    ],
    content: [
      {
        heading: "Why Financial Transparency Builds Better Teams",
        body: "Business owners who share financial data with their teams consistently report higher cost awareness, more careful spending decisions, and stronger ownership of revenue targets. When your team knows the cash runway, they understand why you are being disciplined about expenses. When they see the daily burn rate, they have context for why growth targets matter. AskBiz CFO makes it easy to share this data without giving everyone full administrative access to your account.",
      },
      {
        heading: "The Fastest Method: Screenshot and Share",
        body: "The simplest way to share a CFO insight is to take a screenshot of the relevant card or chart and share it in your team messaging tool (Slack, WhatsApp, Teams). When sharing a screenshot, always add a brief caption: what is the number, is it good or concerning, and what does the team need to know or do about it. For example: Cash Runway is now 11 months, up from 9 months last month — the cost cuts we made in October are showing. Target is 18 months by Q2.",
      },
      {
        heading: "Sharing Through the Intelligence Tab",
        body: "For a broader financial view that is appropriate for sharing with managers or senior team members, navigate to the Intelligence tab. This view combines your CFO cash data with business performance metrics such as revenue by category, customer trends, and operational efficiency. It provides a more complete picture than the cash-focused CFO tab alone. If a team member has their own AskBiz login with the appropriate permission level, they can access this tab directly. Work with your account settings to assign the Viewer role to team members you want to keep informed without granting edit access.",
      },
      {
        heading: "Setting Up a Regular Sharing Cadence",
        body: "Ad hoc sharing is less effective than a regular cadence. Consider establishing a brief weekly financial update to your team — a short message or a 60-second voice note sharing the three most important numbers from the past week: cash balance, daily burn or gain trend, and runway. For a monthly review, share a more complete summary covering all four CFO cards plus the forecast outlook. This consistency means your team always has a current financial picture and financial conversations become part of your culture rather than an occasional surprise.",
      },
    ],
    relatedSlugs: [
      "building-monthly-financial-narrative-askbiz",
      "monthly-financial-review-cfo-dashboard",
      "how-askbiz-cfo-connects-intelligence-tab",
    ],
    faq: [
      {
        q: "Can I give a team member view-only access to the CFO dashboard?",
        a: "Yes. In AskBiz settings, you can assign team members the Viewer role, which gives read-only access to the Intelligence tab including the CFO section. They cannot edit costs, add expenses, or change configuration.",
      },
      {
        q: "Should I share exact cash balance figures with all staff?",
        a: "This depends on your management style and the size of your team. Many owners share burn rate and runway with managers but keep the exact cash balance private. Share what builds accountability without creating unnecessary anxiety.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "weekly-financial-checkin-routine-askbiz",
    title: "Doing a Weekly Financial Check-In Routine",
    description:
      "A structured five-minute weekly process for reviewing your AskBiz CFO dashboard — catch issues early and stay on top of your cash position every week.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: [
      "weekly check-in",
      "financial routine",
      "CFO review",
      "AskBiz weekly",
      "cash monitoring",
      "five-minute review",
    ],
    keyTakeaways: [
      "A consistent five-minute weekly review of the CFO dashboard prevents small issues from becoming expensive surprises.",
      "The weekly routine covers four areas: cash balance trend, burn rate, forecast for next two weeks, and any new uncategorised expenses.",
      "Building the habit of weekly review is more valuable than any single in-depth analysis.",
    ],
    content: [
      {
        heading: "Why Weekly Reviews Beat Monthly Reviews",
        body: "Many business owners review their financials once a month — usually when they receive a bank statement or their accountant sends a report. The problem is that by the time a monthly report surfaces an issue, you have already lost three to four weeks of response time. A weekly five-minute check-in catches the same issues three to four times sooner, when you still have time to act. AskBiz CFO is designed for this kind of regular monitoring — all the key data is visible at a glance without needing to run reports or export anything.",
      },
      {
        heading: "The Five-Minute Weekly Review Process",
        body: "Pick a consistent day and time for your weekly review — Monday morning before the week starts or Friday afternoon to close out the week are both popular choices. Then follow this sequence. Minute 1: Open the Cash Flow tab and glance at the four CFO cards. Is cash balance up or down from last week? Is the burn rate better or worse? Has runway changed materially? Minute 2: Switch the cash flow chart to 7-day view. Scan the shape of the past seven days — any unusual spikes or dips worth investigating? Minute 3: Open the Rolling Cash Forecast and scan the next two weeks. Any red (negative) net weeks? Minute 4: Go to the Expenses tab and filter for this week. Are there any Uncategorised expenses that need to be sorted? Any unexpected large expenses? Minute 5: If anything looks concerning, press Ask AI on the relevant card and get a brief AI assessment. Note any actions needed.",
      },
      {
        heading: "What to Do When Something Looks Off",
        body: "If your weekly review surfaces a concern — for example, burn rate is up significantly or the forecast shows a negative week next week — do not panic. Use the drill-down panels available on the Burn and Runway cards to investigate the cause. Check the top expense categories in the Expenses tab for the week. Ask AI for a plain-language explanation of the change. The weekly check-in is designed to detect issues early, when they are still manageable. If you find something that needs attention, schedule 30 minutes later in the week for a deeper review rather than trying to solve everything in the five-minute slot.",
      },
      {
        heading: "Building the Habit",
        body: "The biggest obstacle to a weekly review is not time — it is consistency. Block the five minutes in your calendar as a recurring event. Name it something that reminds you of the value: CFO Pulse Check or Weekly Cash Review. Keep the routine exactly five minutes — do not let it expand into a 30-minute session or you will resist doing it. The goal is a quick, reliable signal of business financial health. Over time, you will develop an instinct for what normal looks like, which makes anomalies immediately obvious and actionable.",
      },
    ],
    relatedSlugs: [
      "monthly-financial-review-cfo-dashboard",
      "what-is-rolling-cash-forecast-askbiz",
      "understanding-4-cfo-metric-cards",
    ],
    faq: [
      {
        q: "What if I miss a week?",
        a: "AskBiz stores all your data, so a missed week just means your next review covers two weeks. The five-minute format is a guideline — even a two-minute scan of the four CFO cards is better than no review at all.",
      },
      {
        q: "Can I set up alerts so I do not need to review manually every week?",
        a: "AskBiz provides notifications for significant changes in your financial metrics. Check your notification settings in the account menu. Even with alerts enabled, a brief weekly review catches context that automated alerts may miss.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "monthly-financial-review-cfo-dashboard",
    title: "Doing a Monthly Financial Review With the CFO Dashboard",
    description:
      "A step-by-step 30-minute monthly review process using the AskBiz CFO dashboard — covering all four cards, the chart, expenses, and the rolling forecast.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: [
      "monthly financial review",
      "CFO dashboard review",
      "AskBiz monthly",
      "30-minute review",
      "financial analysis",
      "cash flow monthly",
    ],
    keyTakeaways: [
      "A structured 30-minute monthly review covers performance, cost analysis, and forward planning in a single session.",
      "Comparing this month to last month and to the same month last year reveals both short-term trends and seasonal patterns.",
      "The monthly review should end with three concrete actions to take in the coming month based on the data.",
    ],
    content: [
      {
        heading: "Preparation: Before You Open the Dashboard",
        body: "Set aside 30 uninterrupted minutes — ideally in the first few days of the new month while the previous month is still fresh. Before opening AskBiz, write down your expectations: what do you think the cash balance is, roughly? Was last month a strong or weak trading period? Were there any unusual expenses? Having expectations before you look at the data helps you assess whether the numbers make sense and catch any discrepancies quickly.",
      },
      {
        heading: "Minutes 1 to 10: The Four CFO Cards",
        body: "Open the Cash Flow tab. For each of the four cards, record the current figure and answer two questions: how does this compare to last month, and is it moving in the right direction? Cash Balance: is it higher or lower than the start of last month? Daily Net Gain/Burn: is the rate improving (burn reducing or gain growing)? Monthly Fixed Costs: did any fixed costs change unexpectedly? Cash Runway: how many months has it extended or shrunk since last month? Use the drill-down panels on the Burn and Runway cards to check the detail behind any changes that surprise you. This section should take about 10 minutes.",
      },
      {
        heading: "Minutes 10 to 20: Cash Flow Chart and Expenses",
        body: "Switch the cash flow chart to 30-day view. Look for the overall shape of the month: was revenue consistent, or were there peaks and troughs? Identify the three highest-revenue days and the three lowest — hover to see the detail. Now open the Expenses tab and filter by the previous month. Review the top five expense categories by total spend. Compare each to the month before. Did any category increase by more than 15 percent? Is that increase justified? Look specifically for any expenses marked as Uncategorised and reassign them before proceeding. This section ensures your cost data is clean and your P&L categorisation is accurate.",
      },
      {
        heading: "Minutes 20 to 25: Rolling Cash Forecast",
        body: "Navigate to the Rolling Cash Forecast section. Look at the six-week projection. Is the running cash balance stable, growing, or declining? Are any weeks projected negative? Note the forecast for the coming month specifically — are projected inflows consistent with what you expect from seasonal patterns and known orders? Are projected outflows consistent with your cost configuration? If anything looks off, use the Ask AI button to get an explanation. Check the seasonal pattern article if you are entering a known slow or peak season — the forecast should already reflect that, but it is worth verifying.",
      },
      {
        heading: "Minutes 25 to 30: Three Actions for Next Month",
        body: "The final five minutes of the monthly review are the most important. Based on everything you have seen, write down three concrete actions for the coming month. These might be: negotiate a lower rate on your insurance renewal (triggered by seeing the fixed cost figure), set up payment reminders to reduce receivables collection time (triggered by seeing projected inflows lower than expected), or cut a software subscription that you have not used in two months (triggered by reviewing the expense tab). Three specific actions — not vague intentions — ensure the monthly review produces real-world change rather than just observation. Use Ask AI on any card to help generate action ideas if you are unsure where to start.",
      },
    ],
    relatedSlugs: [
      "weekly-financial-checkin-routine-askbiz",
      "quarterly-business-review-askbiz",
      "building-monthly-financial-narrative-askbiz",
    ],
    faq: [
      {
        q: "Should I do the monthly review alone or with my team?",
        a: "The data review itself is often most efficient solo, but sharing the three action items with a key team member (operations manager, co-founder) creates accountability. For teams, consider a brief monthly all-hands where you share three key financial metrics — cash balance trend, burn rate, and runway — with appropriate context.",
      },
      {
        q: "What if I do not have 30 minutes?",
        a: "A 15-minute version covers just the four CFO cards and the forecast. It is less thorough but far better than skipping the review. The full 30-minute version once per month is the target, with weekly five-minute check-ins filling the gaps.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "quarterly-business-review-askbiz",
    title: "Doing a Quarterly Business Review With AskBiz",
    description:
      "A comprehensive quarterly business review (QBR) process using all AskBiz CFO data sources — from cash position to P&L trends to the rolling forecast.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 6,
    keywords: [
      "quarterly business review",
      "QBR",
      "AskBiz CFO quarterly",
      "quarterly financial review",
      "business strategy review",
      "financial planning",
    ],
    keyTakeaways: [
      "A quarterly review looks at three months of data to identify trends invisible in weekly or monthly snapshots.",
      "The QBR covers financial performance, cost structure, forecast accuracy, and strategic decisions for the next quarter.",
      "AskBiz provides all the data needed for a thorough QBR without requiring external reporting tools.",
    ],
    content: [
      {
        heading: "What Makes a Quarterly Review Different",
        body: "Monthly reviews catch operational issues. Quarterly reviews reveal strategic patterns. Three months of data shows you whether a trend is real or noise: is burn rate genuinely declining, or was last month just a quiet period? Is revenue growth sustained, or was last month's spike a one-off promotion? Is your cost structure changing in ways that will compound over time? The quarterly review is the right cadence to answer these bigger questions and make the larger decisions — whether to hire, which costs to cut structurally, whether the business model is working as expected.",
      },
      {
        heading: "Part 1: Financial Performance Review (30 Minutes)",
        body: "Start by pulling the 90-day view on the cash flow chart. This single view captures the entire quarter visually. Note the overall shape: is revenue trending up, flat, or down? Is the daily net gain/burn line improving? Calculate three figures manually: total revenue for the quarter (sum of monthly revenue for the three months), total costs for the quarter (from the Expenses tab), and net cash flow for the quarter (ending cash balance minus starting cash balance). Compare these three figures to the previous quarter. Are you growing, stable, or declining? By what percentage? These headline comparisons form the foundation of your QBR.",
      },
      {
        heading: "Part 2: Cost Structure Analysis (20 Minutes)",
        body: "Open the Expenses tab and filter by the full quarter. Sort expenses by category total. You are looking for three things: the largest cost categories (do they reflect your strategic priorities?), any categories that grew significantly during the quarter (are the increases intentional?), and any categories that could be reduced without impacting operations. Compare the category totals to your Cost Configuration — if actual expenses in a category consistently exceed what you have configured, update the configuration upward and ask yourself why costs are running higher than planned. The result of this section is a clean, accurate picture of where your money is actually going.",
      },
      {
        heading: "Part 3: Forecast Accuracy Review (15 Minutes)",
        body: "Pull up the Rolling Cash Forecast. Compare the current six-week projection to what the forecast showed at the start of the quarter — did it turn out to be accurate? Were there weeks where actuals significantly missed the projection? Understanding forecast accuracy helps you calibrate how much weight to place on forward projections. Common sources of forecast error include unexpected large expenses, receivables that arrived earlier or later than expected, and revenue spikes or dips from seasonal events. Note the main accuracy gaps and consider whether any Cost Configuration updates would improve future accuracy.",
      },
      {
        heading: "Part 4: Strategic Decisions for Next Quarter (15 Minutes)",
        body: "The final section of the QBR is forward-looking. Using all the data you have reviewed, make three to five strategic decisions for the coming quarter. Examples include: we will reduce our ad spend by 20 percent in Q2 because the conversion data does not justify the cost; we will hire one part-time logistics person in month two of Q2 because runway supports it and the time cost is now clear; we will implement a payment terms change requiring 50 percent deposit on orders above a set value because receivables are consistently delaying our inflow projections. Each decision should be tied directly to a data point you reviewed. Use Ask AI on any CFO card to generate decision suggestions based on your specific data.",
      },
    ],
    relatedSlugs: [
      "monthly-financial-review-cfo-dashboard",
      "using-askbiz-cfo-data-for-fundraise",
      "building-monthly-financial-narrative-askbiz",
    ],
    faq: [
      {
        q: "How long should a QBR take?",
        a: "For a solo founder or small team, 60 to 90 minutes is typical. For a team QBR where you are presenting to staff or advisors, allow two to three hours including discussion. The four-part structure above is designed to fit within 80 minutes.",
      },
      {
        q: "Should I invite my accountant to the QBR?",
        a: "Sharing QBR data with your accountant is valuable, but the QBR itself is a management exercise, not an accounting exercise. Many founders share the QBR output — the three financial headlines and the strategic decisions — with their accountant as context for their quarterly conversation.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-askbiz-cfo-connects-intelligence-tab",
    title: "How AskBiz CFO Connects to the Main Intelligence Tab",
    description:
      "Understand the relationship between the CFO Cash Flow view and the broader Intelligence tab — and how to use both together for complete business insight.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: [
      "Intelligence tab",
      "CFO dashboard",
      "AskBiz Intelligence",
      "cash flow vs intelligence",
      "business analytics",
      "AskBiz overview",
    ],
    keyTakeaways: [
      "The CFO Cash Flow tab is a focused cash and cost lens within the broader Intelligence tab.",
      "The Intelligence tab adds revenue analytics, customer data, and operational metrics to the cash picture.",
      "Using both views together gives you the complete financial and business intelligence picture that neither provides alone.",
    ],
    content: [
      {
        heading: "The Intelligence Tab as Your Business HQ",
        body: "In AskBiz, the Intelligence tab is your central hub for all business analytics and reporting. Within it, you will find multiple views depending on your subscription and connected integrations — revenue analytics, customer behaviour, product performance, operational efficiency, and the CFO financial metrics. Think of the Intelligence tab as the dashboard of a plane: many instruments, all essential, each measuring something different. The CFO Cash Flow view is one of those instruments — the most critical one for financial health, but not the only one you need.",
      },
      {
        heading: "What the CFO Tab Covers vs. What Intelligence Adds",
        body: "The CFO Cash Flow view focuses on three things: how much cash you have, how fast you are spending it, and how long it will last. It answers the survival and sustainability questions. The broader Intelligence tab answers the performance and growth questions: which products are most profitable, which customers buy most frequently, what is your average order value trend, how is your revenue by channel growing or declining? These dimensions are related to your cash position but are not the same thing. High revenue with poor cost management leads to cash crisis — the CFO tab will catch that. High cash with declining revenue could mean a long runway but a deteriorating business — the Intelligence tab will catch that.",
      },
      {
        heading: "How Data Flows Between the Two Views",
        body: "The two views share the same underlying data from your connected store. Revenue that appears in the Intelligence tab's revenue analytics is the same revenue flowing into the CFO Cash Balance and burn rate calculations. Expenses logged in the Expenses tab feed both the CFO cost metrics and the P&L line items visible in the Intelligence tab. This means that keeping your data clean — correctly categorising expenses, ensuring all orders are synced from your store — improves the accuracy of both views simultaneously. You do not need to maintain two separate data sets.",
      },
      {
        heading: "When to Use Which View",
        body: "Use the CFO Cash Flow tab for your daily and weekly financial monitoring: checking that cash is stable, burn rate is under control, and the forecast shows no imminent shortfalls. Use the broader Intelligence tab for your monthly and quarterly performance reviews: understanding what is driving revenue, which segments are growing, and how operational efficiency is trending. For investor conversations, you will typically use both: CFO data for the cash and runway narrative, Intelligence data for the growth and market traction narrative. The Ask AI button is available in both views and accesses the same underlying data, so questions about either topic can be asked from whichever tab you happen to be in.",
      },
    ],
    relatedSlugs: [
      "what-is-askbiz-cfo-dashboard",
      "connecting-expenses-to-pl-askbiz",
      "cfo-dashboard-masterclass-end-to-end",
    ],
    faq: [
      {
        q: "Can I set the Intelligence tab to open on the CFO view by default?",
        a: "AskBiz remembers your last-used tab within the Intelligence section. If you regularly use the Cash Flow view, it will typically load to that view on subsequent visits.",
      },
      {
        q: "Do I need the Intelligence tab if I already use the CFO tab daily?",
        a: "The CFO tab alone is sufficient for cash management. The Intelligence tab is valuable for growth decisions, pricing analysis, and customer retention strategy — areas beyond cash flow monitoring.",
      },
    ],
    videoUrl: "",
  },

  // ─── Module 10: Real Business Scenarios (articles 91–100) ─────────────────

  {
    slug: "scenario-burning-cash-faster-than-expected",
    title: "Scenario: You're Burning Cash Faster Than Expected",
    description:
      "Step-by-step diagnostic for when your AskBiz burn rate is higher than it should be — from opening the drill-down to identifying the top cost and using AI to act.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: [
      "high burn rate",
      "cash burn diagnostic",
      "burn rate increase",
      "AskBiz scenario",
      "cost investigation",
      "burn drill-down",
    ],
    keyTakeaways: [
      "When burn rate is higher than expected, the first step is always to open the burn rate drill-down panel to identify which cost category is responsible.",
      "Comparing this month's top expenses to last month's in the Expenses tab pinpoints the specific driver of the increase.",
      "The Ask AI button on the Burn card provides a prioritised list of reduction actions tailored to your specific cost profile.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "You open AskBiz on a Monday morning and notice that your Daily Net Burn figure is significantly higher than it was last week. Your cash runway has dropped by two months compared to last month. Something has changed, but you are not sure what. This is a common and manageable situation — the key is to diagnose it methodically rather than reacting with panic cuts that might damage the business.",
      },
      {
        heading: "Step 1 — Open the Burn Rate Drill-Down",
        body: "On the Cash Flow tab, locate the Daily Net Gain/Burn card. Click or tap the card to open the drill-down panel. Inside, you will see a breakdown of your burn by cost category — fixed costs versus variable costs, and the top categories by spend. Look for any category that has increased notably compared to prior periods. Common culprits for unexpected burn increases include: a software subscription that moved from monthly to annual and was charged in full, a supplier invoice that arrived early, payroll that processed on an unusual date, or a new cost that was added to variable expenses but not factored into your mental model of burn.",
      },
      {
        heading: "Step 2 — Cross-Check in the Expenses Tab",
        body: "Once you have a suspect category from the drill-down, open the Expenses tab. Filter by this month and sort by the category that looked elevated. Look for the specific expense entries driving the increase. Click on any entry to see the full detail: merchant name, date, amount, and category. If the expense is correctly categorised and genuinely new, you now know the cause. If the expense looks miscategorised — for example, an annual insurance renewal incorrectly logged under Advertising — correct the category and recheck the burn card. Miscategorisation is a surprisingly common cause of apparent burn spikes.",
      },
      {
        heading: "Step 3 — Assess the Severity",
        body: "Once you know the cause, assess whether it is a one-time spike or an ongoing change. A one-time annual payment this month means next month burn should return to normal — no action needed beyond noting it. A genuine ongoing increase (a new salary, a higher supplier rate, a new lease commitment) requires a response. Check the Cash Runway card: has runway dropped below your comfort threshold? If runway is still above nine months, you have time to plan a measured response. If it has dropped below six months, action is more urgent.",
      },
      {
        heading: "Step 4 — Use Ask AI to Get Reduction Options",
        body: "With the cause identified, tap the Ask AI button on the Daily Net Gain/Burn card. In the prompt field, describe what you found: My burn rate has increased because of a higher supplier cost. Runway is now 7 months. What are my options to reduce burn while maintaining operations? AskBiz AI will analyse your cost profile and revenue data to suggest specific, ranked actions. Common recommendations include negotiating a volume discount with the high-cost supplier, pausing or reducing a lower-priority variable cost to offset the increase, or setting a revenue target for the next 30 days that would bring net burn back to previous levels. Implement the highest-impact action first and monitor the burn card over the following week to confirm the intervention is working.",
      },
    ],
    relatedSlugs: [
      "how-to-open-burn-rate-drill-down",
      "reading-burn-rate-formula-breakdown",
      "how-to-cut-costs-using-burn-data",
    ],
    faq: [
      {
        q: "What if I cannot identify what caused the burn spike?",
        a: "If the drill-down and expense tab review do not reveal the cause, check your connected store for any large refunds or cost-of-goods adjustments, and review your bank account for any transactions that may not have synced to AskBiz. If data is missing from AskBiz, re-sync your store connection from the Settings menu.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-just-went-cash-positive",
    title: "Scenario: You Just Went Cash Positive",
    description:
      "Reading the cash-positive signal in AskBiz, understanding what the AI recommends next, and exploring smart options for deploying your surplus.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "cash positive",
      "surplus cash",
      "AskBiz scenario",
      "deploying surplus",
      "growth reinvestment",
      "cash positive recommendation",
    ],
    keyTakeaways: [
      "Going cash positive means your daily net gain is consistently above zero — AskBiz signals this with a green indicator on the Daily Net Gain/Burn card.",
      "The Ask AI button in this state shifts from cost-reduction advice to growth and reinvestment recommendations.",
      "Surplus cash has three smart uses: extending your runway buffer, reinvesting in growth, or distributing to founders — each with different implications.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "You open AskBiz and the Daily Net Gain/Burn card is showing a positive number — green instead of red. Your cash balance is growing. Your runway has extended from eight months to ten months over the past six weeks. This is a milestone worth pausing to understand properly, because how you respond to a cash-positive position is as important as how you respond to a cash crisis.",
      },
      {
        heading: "Step 1 — Verify It Is Structural, Not a Spike",
        body: "Before making any decisions based on the cash-positive signal, verify that it represents a genuine structural change rather than a temporary spike. Open the 30-day cash flow chart and look at the pattern. Has daily net gain been positive for most of the past two to three weeks, or did one large payment create a temporary positive blip? If the pattern shows sustained daily gain, you have crossed a real threshold. If it is driven by one or two outlier transactions, wait another two to three weeks before treating it as a new baseline.",
      },
      {
        heading: "Step 2 — Read the AI Recommendation",
        body: "Tap the Ask AI button on the Daily Net Gain/Burn card. When AskBiz detects a cash-positive position, the AI shifts its default framing from cost management to growth opportunity analysis. The AI will typically acknowledge the positive milestone, assess whether the trend is sustainable based on your forward forecast, and offer three to four recommendations for how to use the surplus productively. Read these recommendations carefully — they are tailored to your specific data, not generic advice.",
      },
      {
        heading: "Step 3 — Choose a Surplus Strategy",
        body: "There are three main uses of surplus cash in a growing business. First, extend the runway buffer — instead of drawing the surplus down, let it accumulate until your runway extends to a more comfortable 12 or 18 months. This is the most conservative choice and makes sense if your business is still in an uncertain phase or if you have a known large cost upcoming. Second, reinvest in growth — use the surplus to fund a hire, increase marketing spend, or invest in product development. Model this in Cost Configuration first to see the runway impact before committing. Third, distribute to founders — if the business is stable and the runway is already healthy, taking some of the surplus as a founder distribution is legitimate and healthy. AskBiz does not make this decision for you, but the runway card gives you the data to make it confidently.",
      },
      {
        heading: "Step 4 — Adjust the Forecast for Your New Trajectory",
        body: "With a cash-positive baseline established, open the Rolling Cash Forecast and check that it reflects your new reality. The running cash balance in the forecast should now show a growing trend over the six-week horizon. If any future week still shows negative net cash due to a known large payment, plan for it now while you have surplus to absorb it. Update your Cost Configuration if any costs have genuinely changed as part of the shift to profitability. This ensures the forecast stays accurate and continues to give you reliable forward visibility as your business grows.",
      },
    ],
    relatedSlugs: [
      "what-does-cash-positive-mean-askbiz",
      "using-ask-ai-cash-positive-growth",
      "how-to-read-cash-runway-card",
    ],
    faq: [
      {
        q: "Does going cash positive mean I am profitable?",
        a: "Not necessarily. Cash positive means your cash balance is growing. Profitable means revenue exceeds costs on an accrual basis. The two often align but can diverge due to timing of receivables, one-off payments, or capital injections. Check the P&L view in the Intelligence tab for the profitability picture.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-planning-for-slow-season",
    title: "Scenario: Planning for a Slow Season",
    description:
      "Using the AskBiz Rolling Cash Forecast to identify a coming revenue dip, adjusting your cost configuration proactively, and checking that runway remains safe through the trough.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: [
      "slow season planning",
      "seasonal cash management",
      "AskBiz scenario",
      "revenue dip",
      "cost reduction seasonal",
      "forecast trough",
    ],
    keyTakeaways: [
      "AskBiz's seasonal weighting in the forecast reveals slow-season dips weeks in advance, giving you time to prepare.",
      "Proactively reducing variable costs before the slow season begins prevents a reactive scramble mid-trough.",
      "Confirming runway through the full slow-season period before it starts is the most important financial check.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "It is late October. Your business sells outdoor furniture, and you know from experience that November through January is your slowest quarter. You want to make sure you navigate the three-month trough without a cash crisis. You open AskBiz to start planning.",
      },
      {
        heading: "Step 1 — Read the Forecast for the Coming Weeks",
        body: "Open the Rolling Cash Forecast. Because AskBiz applies historical seasonality weighting, the Projected Inflows column should already be showing lower figures in the coming weeks compared to the past month. Scan the six-week table and note the lowest projected inflow week. Also check the running cash balance row — is it projected to hold steady, decline slowly, or decline sharply? If the balance is projected to remain above your minimum comfort level (typically two to three months of fixed costs) through the end of the visible forecast window, you are in reasonable shape. If it is projected to approach or breach that floor, you need to act.",
      },
      {
        heading: "Step 2 — Identify Variable Costs You Can Reduce",
        body: "Open Cost Configuration and review your Variable Costs list. During a slow season, the costs most appropriate to reduce are those directly tied to sales volume (you will naturally spend less on fulfilment and packaging as orders decline) and discretionary marketing spend (there is little point running full-price acquisition campaigns when demand is seasonally low). Make a list of costs you can reduce for the slow season period, estimate the monthly saving for each, and calculate the total monthly saving. A 20 to 30 percent reduction in variable costs during the trough period is a realistic and achievable target for most retail businesses.",
      },
      {
        heading: "Step 3 — Update Configuration and Check the New Forecast",
        body: "In Cost Configuration, update the variable costs you identified in Step 2. Set them to their reduced amounts with a start date of November 1 and an end date of January 31 (adjust dates to match your specific slow season). Close the configuration drawer and return to the Rolling Cash Forecast. The running cash balance projection should now show a less severe decline through the trough period. Confirm that the projected balance remains above your minimum floor throughout the full slow season.",
      },
      {
        heading: "Step 4 — Check the Cash Runway Card for the Full Picture",
        body: "With the updated configuration in place, check the Cash Runway card. The runway figure now reflects your planned cost reduction during the slow season. If runway remains above six months through the entire trough period, you have managed the slow season successfully from a planning perspective. If runway still dips below six months at some point, consider one additional lever: building a larger cash buffer in October while revenue is still strong. If you have any non-essential purchases planned for November or December, defer them to February when revenue recovers. The Ask AI button on the runway card will provide a final check — asking it whether your slow-season plan is sufficient given your current trajectory.",
      },
    ],
    relatedSlugs: [
      "how-forecast-accounts-seasonal-patterns",
      "using-forecast-to-spot-cash-shortfalls",
      "how-to-configure-variable-costs-askbiz",
    ],
    faq: [
      {
        q: "What if I do not have a full year of data yet and the forecast does not show a seasonal dip?",
        a: "If AskBiz does not yet have a full year of your data, it relies partly on industry benchmarks. You may need to manually reduce the Projected Inflows estimate by adjusting your cost configuration more conservatively for the slow period as a precaution.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-best-month-ever-cfo-data",
    title: "Scenario: Your Best Month Ever — Reading the CFO Data",
    description:
      "How to use AskBiz CFO tools to analyse a peak month — understanding what drove the performance, reading the chart day by day, and capturing the lessons.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: [
      "best month",
      "peak month analysis",
      "AskBiz scenario",
      "revenue driver analysis",
      "cash flow chart day detail",
      "financial analysis peak",
    ],
    keyTakeaways: [
      "A best-ever month deserves as much analytical attention as a crisis — understanding what drove it lets you repeat and build on it.",
      "The 30-day cash flow chart's day-by-day detail reveals the specific dates and drivers of peak performance.",
      "Comparing the peak month's cost structure to a typical month shows whether the result was driven by revenue, cost discipline, or both.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "You close out the month and AskBiz shows a cash balance significantly higher than it was at the start. The Daily Net Gain figure is the strongest you have ever seen. Your Cash Runway has extended by three months in a single month. This is your best financial month to date. Before moving on to the next month, invest 30 minutes in understanding what made it work — this analysis is one of the highest-return activities a business owner can do.",
      },
      {
        heading: "Step 1 — Read the Cash Flow Chart Day by Day",
        body: "Open the 30-day cash flow chart. Switch to the detailed view that shows individual daily bars. Starting from the first of the month, hover over each day to see the breakdown: revenue in, costs out, net cash for that day. Look for the peak revenue days — when were they, and what might have driven them? Common patterns include a promotional push on a specific date, a large B2B order that landed mid-month, a viral social media moment, or simply strong weekend trading across multiple weeks. Note the top three revenue days and their amounts.",
      },
      {
        heading: "Step 2 — Analyse the Cost Side",
        body: "A record month can be driven by exceptionally high revenue, unusually low costs, or both. Open the Expenses tab and filter by the peak month. Review total costs and compare to a typical month. Were costs higher (because you invested more in inventory or marketing to capitalise on demand), lower (because you benefited from natural cost leverage), or roughly the same? If costs were similar but revenue was significantly higher, that is particularly valuable — it shows your cost base has scale leverage, meaning a 30 percent revenue increase did not require a 30 percent cost increase. This is a strong sign of business model health.",
      },
      {
        heading: "Step 3 — Attribute the Revenue Drivers",
        body: "Navigating to the Intelligence tab's revenue analytics, identify which products, categories, or channels drove the most revenue during the peak month. Was it a particular product line that outperformed? A marketing channel that converted unusually well? A customer segment that placed larger orders than usual? Cross-referencing the CFO cash data with the Intelligence revenue analytics answers the why behind the best-ever month. Once you know the driver, the strategic question becomes: was it repeatable (something you can deliberately engineer again) or situational (a one-off that you should note but not rely on)?",
      },
      {
        heading: "Step 4 — Capture the Lessons and Update the Forecast",
        body: "Write a brief note of what you learned — three to five bullet points covering what drove revenue, whether costs scaled efficiently, and what you will do to repeat or build on the performance. Share this with your team. Then open the Rolling Cash Forecast: if the peak month has improved your baseline revenue trajectory, the forecast may need to be recalibrated. The Ask AI button on the forecast card can help you assess whether the improved performance should update your forward revenue assumptions or whether the AI models it as a temporary spike that will revert to the prior baseline. Use this insight to set realistic but ambitious targets for the coming quarter.",
      },
    ],
    relatedSlugs: [
      "how-to-use-daily-cash-chart",
      "building-monthly-financial-narrative-askbiz",
      "how-revenue-affects-burn-rate-card",
    ],
    faq: [
      {
        q: "How do I compare this month to the same month last year in AskBiz?",
        a: "Use the cash flow chart date selector to set the date range to the same month in the prior year. Note the daily average revenue and total monthly cash gain, then compare to the current month's figures to see the year-on-year growth.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-runway-under-3-months-action-plan",
    title: "Scenario: Runway Under 3 Months — AskBiz Action Plan",
    description:
      "A step-by-step triage sequence using the AskBiz CFO dashboard when your cash runway drops to critical levels — three months or less.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: [
      "runway under 3 months",
      "critical runway",
      "cash crisis",
      "AskBiz action plan",
      "triage sequence",
      "emergency cash management",
    ],
    keyTakeaways: [
      "Three months or less of runway is a critical signal that requires immediate, structured action — not panic.",
      "The triage sequence is: identify largest costs, cut fastest-moving ones immediately, accelerate receivables, explore bridging options.",
      "AskBiz AI provides a personalised action list for your specific cost and revenue profile when runway is critical.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "Your Cash Runway card is showing red — two months and three weeks. This is a genuine emergency, but it is one you can manage if you act systematically. Panic responses (cutting costs randomly, desperately discounting products, making rushed financing decisions) often make the situation worse. What follows is a structured triage sequence using AskBiz CFO tools.",
      },
      {
        heading: "Step 1 — Get the Full Picture in 10 Minutes",
        body: "Before taking any action, spend 10 minutes getting a complete picture. Open the Burn Rate drill-down panel — identify your top three cost categories and their monthly amounts. Open the Rolling Cash Forecast — check whether any weeks in the next six are projected positive (meaning there is some hope in the near-term cash flow). Open the Expenses tab and check the most recent two weeks — are there any large, non-recurring expenses that inflated burn temporarily? Understanding whether you are in a structural crisis (ongoing costs exceed ongoing revenue) or a timing crisis (a temporary spike has depleted cash but normal operations are sustainable) is critical — the responses are very different.",
      },
      {
        heading: "Step 2 — Cut the Fastest-Moving Costs Today",
        body: "In a sub-three-month runway scenario, speed matters. Some costs can be cut or paused within 24 hours: software subscriptions not actively in use, advertising campaigns that are not converting, any non-essential contractor or agency retainers. Open Cost Configuration, identify every variable cost that can be reduced or paused immediately, and remove or reduce them now. Log into each service and cancel or pause the billing. Confirm the cancellations are reflected in your cost configuration. Then check the Cash Runway card — the immediate cost cuts should extend runway by at least a few weeks, buying you time for the next steps.",
      },
      {
        heading: "Step 3 — Accelerate Every Receivable",
        body: "With runway critical, every unpaid invoice or outstanding customer payment needs immediate attention. Open the Rolling Cash Forecast and check the Projected Inflows row — are there receivables expected in the coming two to three weeks? Contact each customer with an outstanding balance today. Offer a small early-payment discount (two to three percent) if needed to accelerate payment. For B2B clients, move future orders to require upfront payment or a 50 percent deposit. Each receivable collected early directly extends your runway by adding cash to the balance. Track each collected payment — watch the Cash Balance card update as payments arrive.",
      },
      {
        heading: "Step 4 — Explore Bridging Options in Parallel",
        body: "While cutting costs and accelerating receivables, simultaneously explore external bridging options. These include a business overdraft or line of credit from your bank (which takes a few days to arrange and is easiest to obtain when you are not yet in default), revenue-based financing from platforms that advance cash against future sales, or a short-term personal loan to the business from a founder. Open the Ask AI button on the Cash Runway card and describe your situation: Runway is 10 weeks. I have reduced costs and am chasing receivables. What bridging options should I consider given my revenue profile? AskBiz AI will provide options ranked by suitability for your business type and revenue level.",
      },
      {
        heading: "Step 5 — Set a Daily Monitoring Routine",
        body: "For the duration of the critical period, check the Cash Balance and Runway cards every morning. Update the Expenses tab with any new expenses the same day they are incurred. This daily discipline ensures you always know your exact position and can catch any unexpected cost or delay immediately. Set a weekly review with yourself to check whether the actions from Steps 2 and 3 are extending runway as expected. If runway is growing — even slowly — the interventions are working. If it continues to shrink despite cost cuts and collections, the bridging option from Step 4 becomes essential.",
      },
    ],
    relatedSlugs: [
      "what-to-do-runway-under-3-months",
      "runway-status-levels-explained",
      "how-to-cut-costs-using-burn-data",
    ],
    faq: [
      {
        q: "Should I tell my team that runway is critical?",
        a: "This depends on the size and nature of your team. Key managers should know so they can help identify cost savings and avoid making commitments that worsen the situation. For the wider team, consider sharing that the business is in a cost-discipline phase without disclosing exact runway figures.",
      },
      {
        q: "At what point should I consider closing the business?",
        a: "AskBiz CFO does not make that determination — it provides data. If the triage sequence fails to extend runway meaningfully and no bridging options are available, that conversation belongs with your accountant and legal advisor. AskBiz can help you clearly see what is owed, what is owned, and what the trajectory looks like.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-reviewing-costs-after-12-months",
    title: "Scenario: Reviewing Costs After 12 Months in Business",
    description:
      "A structured annual cost review using the AskBiz CFO expense data and cost configuration — identifying what has crept up and what can be negotiated or removed.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "annual cost review",
      "12 months costs",
      "cost audit",
      "AskBiz scenario",
      "subscription review",
      "fixed cost renegotiation",
    ],
    keyTakeaways: [
      "After 12 months of operation, AskBiz has a full year of expense data — enough for a meaningful annual cost audit.",
      "Cost creep — small, gradual increases across many categories — often accounts for 10 to 15 percent of unnecessary spend in a year-old business.",
      "The annual review is the right time to renegotiate fixed costs like rent, insurance, and supplier rates using AskBiz data to support your case.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "Your business has been operating for 12 months. You have a full year of transaction and expense data in AskBiz. Now is the right time to do a systematic cost review — not just looking at what you spent last month, but at patterns across the full year. This annual review typically surfaces 10 to 20 percent of spend that can be reduced, renegotiated, or eliminated without materially affecting operations.",
      },
      {
        heading: "Step 1 — Pull the Annual Expense Summary",
        body: "Open the Expenses tab and set the date range to cover your full 12-month period. Sort the results by category and note the total spend in each category for the year. Then calculate the monthly average for each category (annual total divided by 12). This gives you a clear, comparable baseline. Compare the monthly averages to what you have entered in your Cost Configuration — discrepancies (where actuals consistently exceed configuration) reveal categories that have crept above your planned budget.",
      },
      {
        heading: "Step 2 — Identify the Four Categories of Cost",
        body: "Review your annual expense list and sort each cost into one of four categories. First, Essential and optimised — costs that are necessary and already at the best available rate (leave these alone). Second, Essential but over-priced — costs you need but are paying more than necessary for (these are renegotiation targets). Third, Useful but optional — costs that provide some value but could be cut if needed (these are your first reduction candidates). Fourth, Unused or forgotten — costs you are still paying for services or subscriptions you have stopped using (these should be cut immediately). For most 12-month-old businesses, one to three software subscriptions fall into the fourth category and can be cancelled today.",
      },
      {
        heading: "Step 3 — Renegotiate Key Fixed Costs",
        body: "Armed with your annual spend data from AskBiz, approach your key fixed cost suppliers for renegotiation. For each negotiation, use AskBiz data to make your case concrete: show your landlord or insurance broker the exact annual figure you have paid, and ask for a renewal discount given your track record as a reliable paying customer. Common annual costs worth renegotiating include business insurance (typically negotiable by five to ten percent with a clean year of claims), supplier pricing (volume discounts based on a year of demonstrated purchase history), and any SaaS tools with annual billing options that are cheaper than the monthly rate you are currently paying.",
      },
      {
        heading: "Step 4 — Update Configuration and Measure the Impact",
        body: "Once you have cancelled unnecessary costs and renegotiated others, update your Cost Configuration in AskBiz to reflect the new amounts. Close the configuration drawer and check the Rolling Cash Forecast — the lower cost base should improve your projected net cash figures and extend your runway. Recalculate the annual saving: multiply the monthly saving by 12. For many businesses that go through this process, the saving is $3,000 to $8,000 annually — enough to fund a new hire, a significant product investment, or simply a more comfortable cash buffer. Document the changes and schedule a reminder to repeat this review at the 24-month mark.",
      },
    ],
    relatedSlugs: [
      "how-to-configure-fixed-costs-askbiz",
      "how-to-configure-variable-costs-askbiz",
      "using-forecast-with-cost-configuration",
    ],
    faq: [
      {
        q: "How do I export my annual expense data from AskBiz to use in a spreadsheet?",
        a: "In the Expenses tab, set the date range to the full 12-month period. Use the Export button (if available in your subscription tier) to download the data as a CSV file, which you can open in any spreadsheet tool for further analysis.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-prepare-financials-for-accountant",
    title: "Scenario: Preparing Your Financials to Talk to Your Accountant",
    description:
      "How to use AskBiz CFO data to prepare a clear, accurate financial summary before meeting your accountant — covering cash position, expenses, and P&L.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "accountant meeting",
      "financial summary",
      "AskBiz export",
      "tax preparation",
      "CFO data accountant",
      "expense summary",
    ],
    keyTakeaways: [
      "A five-minute AskBiz review before an accountant meeting ensures you arrive with accurate, current figures rather than guessing.",
      "Clean expense categorisation in AskBiz significantly reduces the time and cost of accountant-prepared reports.",
      "The Intelligence tab P&L view gives your accountant a starting-point income statement without them needing to manually compile figures.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "You have a meeting with your accountant next week — either for a quarterly review, year-end tax preparation, or a business finance conversation. Rather than arriving unprepared and spending expensive billable time gathering basic numbers, you want to walk in with a clear, accurate financial picture. AskBiz CFO provides all the key figures you need.",
      },
      {
        heading: "Step 1 — Confirm Expense Data Is Clean",
        body: "Your accountant's job is much easier — and your bill smaller — when your expense data is clean and correctly categorised. Before the meeting, open the Expenses tab in AskBiz and filter by the period your accountant is working on (typically the current financial year or the last quarter). Sort by category and look for any expenses marked Uncategorised. Recategorise each one correctly. Also check for any obvious miscategorisations — a supplier invoice in the Marketing category that should be in Cost of Goods Sold, for example. Ten minutes spent cleaning the data before the meeting saves 30 to 60 minutes of billable accountant time.",
      },
      {
        heading: "Step 2 — Capture the Four CFO Headline Numbers",
        body: "From the Cash Flow tab, note four numbers: current cash balance, monthly net gain or burn rate, monthly fixed cost total, and cash runway in months. These four figures answer the questions your accountant will likely ask in the first five minutes of the meeting: How is cash? What are you spending per month? Is the business profitable? How long can you sustain current operations? Having these numbers immediately available — rather than saying I think we have about $40,000 somewhere — signals that you are in control of your finances.",
      },
      {
        heading: "Step 3 — Pull the P&L Summary",
        body: "Navigate to the Intelligence tab and open the P&L summary view. Take a screenshot of the current P&L, which shows revenue, Cost of Goods Sold, Gross Profit, Operating Expenses, and Net Profit for the period. This screenshot gives your accountant a starting-point income statement that they can verify against your connected store data and bank records. It also makes the conversation more focused — instead of working out the numbers together during the meeting, you can spend the time discussing what the numbers mean and what to do about them.",
      },
      {
        heading: "Step 4 — Prepare Three Specific Questions",
        body: "An accountant meeting is most valuable when you arrive with specific questions, not just a request to review the numbers. Use your AskBiz review to generate these questions. For example: AskBiz shows my COGS as 34 percent of revenue — is that typical for my industry and should I be working to reduce it? My cash runway is nine months but I want to hire in three months — how do I structure the business to ensure the hire is tax-efficient? My burn rate has been declining for four months — what tax planning should I be doing in anticipation of profitability? Specific, data-grounded questions make the meeting productive for both sides.",
      },
    ],
    relatedSlugs: [
      "connecting-expenses-to-pl-askbiz",
      "building-monthly-financial-narrative-askbiz",
      "scenario-reviewing-costs-after-12-months",
    ],
    faq: [
      {
        q: "Can I give my accountant direct access to AskBiz?",
        a: "Yes. In Settings, you can invite your accountant as a team member with Viewer access. This lets them review the dashboard directly without you needing to export and share data manually.",
      },
      {
        q: "Does AskBiz replace the need for an accountant?",
        a: "No. AskBiz provides management accounts and cash intelligence — it is a day-to-day operational tool. A qualified accountant handles statutory accounts, tax filings, compliance, and strategic financial advice. The two work best in combination.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-want-to-hire-cfo-data-says",
    title: "Scenario: You Want to Hire — What the CFO Data Tells You",
    description:
      "A step-by-step process using AskBiz to check runway, model a new salary in fixed costs, and confirm whether hiring now is financially viable.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: [
      "hiring decision",
      "new hire CFO",
      "salary modelling",
      "AskBiz scenario",
      "runway hiring",
      "fixed cost new hire",
    ],
    keyTakeaways: [
      "Before committing to a hire, model the full loaded cost in Cost Configuration and check the impact on runway — the numbers should inform the decision, not make it alone.",
      "A safe hiring window requires runway to remain above nine months after adding the hire, with a realistic path to the hire paying for itself within six months.",
      "The Ask AI button on the runway card provides a personalised hire/wait recommendation based on your specific financial trajectory.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "Your business is growing and you need help — a customer service person, a warehouse operator, or a sales associate. You want to hire in the next four to six weeks, but you are not sure whether the finances support it. This is exactly the kind of decision AskBiz CFO is built to inform. Here is the step-by-step process.",
      },
      {
        heading: "Step 1 — Check Current Runway",
        body: "Start with the Cash Runway card. What is the current figure in months? As a baseline rule of thumb, hiring is generally prudent when runway is above 12 months, viable with caution when runway is 9 to 12 months, and risky when runway is below 9 months. If current runway is below 9 months, the default answer is to wait — not because hiring is impossible, but because the financial buffer to absorb a hiring mistake (a bad fit, a slower-than-expected revenue return) is not adequate. If runway is above 9 months, proceed to Step 2.",
      },
      {
        heading: "Step 2 — Calculate the Full Loaded Cost",
        body: "Resist the temptation to model only the salary. Calculate the true monthly cost of the hire: gross salary plus employer taxes and national insurance (typically 10 to 15 percent of salary), plus any benefits (pension contribution, health cover), plus equipment and onboarding costs amortised over 12 months. For a hire with a $3,200 monthly gross salary, the true loaded cost is typically $3,800 to $4,200 per month. Use this fully loaded figure in your modelling — not the headline salary.",
      },
      {
        heading: "Step 3 — Add to Cost Configuration and Re-Check Runway",
        body: "Open Cost Configuration and add a new Fixed Cost line: New Hire — [Role Name]. Enter the fully loaded monthly cost. Set the start date to your planned hire date. Save and return to the Cash Runway card. How many months has runway dropped? The impact on runway is your clearest signal. If runway was 14 months and the hire reduces it to 10 months, that is a meaningful but manageable reduction. If runway drops from 10 months to 6 months, the hire is significantly stretching the business financially and warrants careful assessment of the revenue return the hire needs to generate.",
      },
      {
        heading: "Step 4 — Assess the Revenue Return Requirement",
        body: "Every hire should either generate revenue directly or free up your time to generate more revenue. Define concretely what revenue impact you expect from this hire within 60 to 90 days. For a sales hire, this might be $5,000 per month in new deals by month three. For an operations hire, it might be freeing you up to handle 30 percent more client work. Now compare: does the expected revenue return exceed the loaded cost of the hire within a reasonable timeframe? Use the Ask AI button on the Runway card and ask: I am considering hiring a sales assistant at $4,000 per month fully loaded. Runway would drop from 14 to 10 months. Given my revenue trajectory, is this a sensible hire and how long before it pays for itself? AskBiz AI will give you a data-grounded assessment.",
      },
    ],
    relatedSlugs: [
      "using-forecast-for-hiring-investment",
      "how-to-configure-fixed-costs-askbiz",
      "healthy-runway-by-funding-stage",
    ],
    faq: [
      {
        q: "What if I hire and the person does not work out within 90 days?",
        a: "This is the financial risk of hiring. The cost configuration tool lets you model the separation cost (notice period, any redundancy payment) as a one-time variable cost to see the impact on runway. Understanding this downside scenario before hiring is part of the due diligence the CFO dashboard supports.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "scenario-increase-ad-spend-burn-rate-decision",
    title: "Scenario: You Want to Increase Ad Spend — Using Burn Rate to Decide",
    description:
      "How to use AskBiz to model an ad spend increase as a variable cost, observe the impact on burn rate and runway, and make a data-informed decision.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: [
      "ad spend decision",
      "marketing budget",
      "burn rate decision",
      "AskBiz scenario",
      "variable cost modelling",
      "paid advertising CFO",
    ],
    keyTakeaways: [
      "Modelling an ad spend increase in Cost Configuration shows the exact burn rate and runway impact before you commit a single pound or dollar.",
      "The key metric for an ad spend decision is the payback period — how quickly does the incremental revenue from the higher ad spend exceed the additional cost?",
      "If the forecast shows the ad investment paying back within 60 days and runway remains above 9 months, it is generally a sound decision.",
    ],
    content: [
      {
        heading: "The Situation",
        body: "Your current paid advertising is generating sales, and you are considering doubling your monthly ad budget — from $2,000 to $4,000 — to scale the channel. Your gut says it is the right move, but you want the data to confirm it before committing. You open AskBiz to run the analysis.",
      },
      {
        heading: "Step 1 — Record the Baseline",
        body: "Before modelling any changes, record three baseline numbers from your current AskBiz CFO dashboard: current monthly net burn or gain, current cash runway, and current average daily cash chart trend (7-day view). These numbers are your before state — you will compare against them after adding the ad spend increase to see the impact clearly.",
      },
      {
        heading: "Step 2 — Add the Incremental Ad Spend to Variable Costs",
        body: "Open Cost Configuration and find your existing advertising or paid marketing line item in Variable Costs. Increase the amount by the planned increment — in this scenario, from $2,000 to $4,000, so an additional $2,000 per month. Set a start date of next month. Save the configuration. Return to the Cash Flow tab and check the Daily Net Gain/Burn card and the Cash Runway card. How has each changed? The burn card should show a higher daily burn figure (or a lower daily gain), and the runway should have shortened. Note both new figures.",
      },
      {
        heading: "Step 3 — Calculate the Required Revenue Return",
        body: "With the additional $2,000 per month in ad spend, you need to determine how much incremental revenue the new spend must generate to justify the cost. At minimum, the additional spend should be cash-flow neutral within 30 to 60 days — meaning the incremental revenue it generates equals or exceeds $2,000 per month. To calculate the break-even, divide the additional monthly cost ($2,000) by your average contribution margin (revenue minus variable COGS as a percentage). If your margin is 50 percent, the additional ad spend needs to generate $4,000 per month in new revenue to be cash-flow neutral. Write this target number down — it becomes your 30-day success metric.",
      },
      {
        heading: "Step 4 — Confirm Runway Remains Healthy and Check Forecast",
        body: "With the ad spend increase modelled in configuration, open the Rolling Cash Forecast. Does the six-week forward projection remain stable? Does the running cash balance continue to grow, or does it begin declining? Check that runway with the increased spend still sits above your nine-month comfort threshold. If runway drops below nine months with the additional spend, that is a signal to test a smaller increment first — say $500 additional spend per week — rather than doubling the budget all at once. A test-and-scale approach is more financially prudent: start with a 25 percent budget increase, track the incremental revenue over 30 days, and if the return justifies it, scale further.",
      },
      {
        heading: "Step 5 — Monitor and Adjust",
        body: "Once you have committed to the ad spend increase, review the CFO dashboard at the end of each week for the first month. Use the 7-day chart view to monitor whether daily revenue is trending up in line with the higher spend. If after two to three weeks there is no improvement in daily revenue, pause the increase and revert the Cost Configuration — the channel may not be scaling efficiently at this budget level. If revenue is improving and the payback target looks achievable within 60 days, continue. The Ask AI button on the Daily Net Gain/Burn card will provide a weekly assessment of whether the ad investment is working given your updated data.",
      },
    ],
    relatedSlugs: [
      "how-to-configure-variable-costs-askbiz",
      "burn-rate-vs-runway-relationship",
      "using-forecast-with-cost-configuration",
    ],
    faq: [
      {
        q: "Can AskBiz calculate my return on ad spend (ROAS) directly?",
        a: "AskBiz tracks revenue from your connected store and your ad spend as a cost category. You can manually calculate ROAS by dividing the incremental revenue growth by the ad spend amount. For deeper attribution, connect AskBiz to an advertising platform integration if available for your store.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "cfo-dashboard-masterclass-end-to-end",
    title: "CFO Dashboard Masterclass: A Complete End-to-End Walkthrough",
    description:
      "A comprehensive end-to-end guide tying together all 10 modules of the AskBiz CFO series — from initial setup through to advanced scenario planning and regular review cadences.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 6,
    keywords: [
      "CFO dashboard masterclass",
      "AskBiz complete guide",
      "end-to-end CFO",
      "cash flow mastery",
      "AskBiz advanced",
      "financial dashboard complete",
    ],
    keyTakeaways: [
      "Mastery of the AskBiz CFO dashboard follows a clear progression: setup, daily monitoring, cost configuration, forecasting, and scenario planning.",
      "The four CFO cards, the cash flow chart, the expense tab, the rolling forecast, and the Ask AI button are the five core tools — used together, they cover every financial decision a growing business needs to make.",
      "A business that reviews CFO data weekly, updates costs monthly, and runs quarterly reviews is operating at the highest level of financial intelligence available to an SMB.",
    ],
    content: [
      {
        heading: "The Full Arc: From Setup to Mastery",
        body: "This masterclass is designed for founders and business owners who have been through the earlier modules and want a unified picture of how all the pieces fit together. The AskBiz CFO dashboard is not a collection of isolated tools — it is a system. Each component connects to the others: the four metric cards summarise the state of the business; the cash flow chart shows the detail; the expense tab provides the cost intelligence that drives the burn rate and runway calculations; the rolling forecast integrates all data to project the future; and Ask AI ties everything together with on-demand analysis and recommendations. Understanding how these pieces interact is the difference between reading numbers and making decisions.",
      },
      {
        heading: "Phase 1: Foundation Setup (Modules 1–3)",
        body: "Every effective use of the CFO dashboard begins with clean data. Step 1 — Connect your store (Shopify, WooCommerce, or other integration) and verify that revenue is flowing into the Cash Balance and Daily Net Gain/Burn cards correctly. Step 2 — Set your Cash Balance if needed (particularly for businesses with cash that is not yet reflected in the connected store). Step 3 — Configure your Fixed Costs: every recurring monthly expense — rent, salaries, subscriptions — should be in the Fixed Costs panel. Step 4 — Configure your Variable Costs: the costs that change with sales volume. Step 5 — Review the four cards and confirm each shows a plausible figure. If any card looks wrong, investigate the data source before proceeding. Foundation setup is not glamorous, but without it, every downstream insight is unreliable.",
      },
      {
        heading: "Phase 2: Daily and Weekly Monitoring (Modules 4–6)",
        body: "With setup complete, the CFO dashboard becomes your daily and weekly financial pulse. The daily habit is simple: glance at the four cards. Is everything directionally correct? The weekly habit (five minutes every Monday morning or Friday afternoon) is slightly more structured: check the 7-day chart, scan the forecast for the next two weeks, and review any uncategorised expenses. The burn rate and runway cards are the most important monitors. Burn rate tells you the rate of change; runway tells you the consequence. If burn is rising and runway is falling faster than expected, investigate immediately. If burn is declining and runway is extending, you are on a positive trajectory — reinforce what is working. The 12-month cash projection and scenario table in the runway drill-down panel are valuable quarterly tools: they show the long-range consequences of your current trajectory and help you prepare for distant but predictable inflection points.",
      },
      {
        heading: "Phase 3: Cost Intelligence and Expense Management (Modules 5–7)",
        body: "The expense tab and cost configuration tools transform the CFO dashboard from a passive monitor into an active management tool. The AI receipt scanner removes the friction from expense logging, ensuring every cost is captured and categorised without manual effort. Regular audits of the expense tab — at least monthly — keep categorisation clean and the P&L view accurate. The cost configuration panel is where the real management power lives: updating it keeps the forecast accurate, and using it as a what-if tool (adding a proposed hire, modelling a lease change, simulating a cost cut) gives you instant quantified feedback on any cost decision. Most owners who use cost configuration regularly report that it prevents at least one costly financial mistake per quarter — a hire made too early, an unnecessary subscription renewed, an overly aggressive ad budget that would have strained cash.",
      },
      {
        heading: "Phase 4: Forecasting and Scenario Planning (Modules 8–10)",
        body: "The Rolling Cash Forecast and the scenario planning skills from Module 10 represent the highest level of CFO dashboard usage. The forecast integrates revenue projections (weighted by your historical seasonality), receivables from your connected store, and your configured costs to produce a six-week forward view. Reading the forecast weekly and acting on its signals — cutting costs before a projected trough, accelerating collections before a negative week, modelling a hire against the forward cash position — is what separates financially disciplined businesses from reactive ones. The ten scenario articles in Module 10 cover the most common high-stakes financial situations every growing business faces: excessive burn, going cash positive, slow seasons, peak months, critical runway, annual cost reviews, accountant preparation, hiring decisions, and ad spend decisions. Each scenario uses the same tools but applies them to a different problem. The common thread across all scenarios is the same five-step discipline: understand the current position, identify the specific driver of the change, model the response before acting, act with confidence, and monitor the outcome. That discipline, applied consistently, is what the AskBiz CFO dashboard is designed to support — and it is what this entire series has been building toward.",
      },
    ],
    relatedSlugs: [
      "what-is-askbiz-cfo-dashboard",
      "cfo-dashboard-10-minute-setup",
      "how-askbiz-cfo-connects-intelligence-tab",
    ],
    faq: [
      {
        q: "I have been using AskBiz for six months but have not used the forecast or Ask AI yet — where should I start?",
        a: "Start with the Rolling Cash Forecast. Open the Intelligence tab, go to Cash Flow, and scroll to the forecast section. Spend five minutes reading the six-week projection and identifying any negative net weeks. Then tap Ask AI on the forecast card and ask: What should I be watching in my forecast right now? That single conversation will show you the value of these features better than any article.",
      },
      {
        q: "Is there a recommended order for working through the CFO series articles?",
        a: "The modules follow a logical progression: setup first (Modules 1–2), then monitoring (Modules 3–4), then cost management (Modules 5–6), then the expense tab (Module 7), then forecasting (Module 8), then advanced usage (Module 9), and finally scenario-based application (Module 10). If you are time-constrained, prioritise the setup modules, the burn rate and runway articles, and whichever Module 10 scenario is most relevant to your current business situation.",
      },
      {
        q: "How often does AskBiz update the underlying data from my connected store?",
        a: "AskBiz syncs with your connected store continuously — typically within minutes of a transaction occurring. The CFO cards, cash flow chart, and forecast all reflect near-real-time data.",
      },
    ],
    videoUrl: "",
  },
];
