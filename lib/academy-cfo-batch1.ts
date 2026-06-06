export const ACADEMY_CFO_BATCH1 = [
  // ===========================
  // MODULE 1 — Getting Started (articles 1–10)
  // ===========================
  {
    slug: 'what-is-askbiz-cfo-dashboard',
    title: 'What Is the CFO Dashboard on AskBiz?',
    description:
      'A plain-English overview of the AskBiz CFO dashboard — what it tracks, which metrics it surfaces, and why every small business owner should use it.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 4,
    keywords: [
      'CFO dashboard',
      'AskBiz cash flow',
      'business financial overview',
      'cash runway',
      'burn rate',
    ],
    keyTakeaways: [
      'The CFO dashboard lives inside the Intelligence tab and gives you a real-time snapshot of your financial health.',
      'Four metric cards — Cash Balance, Daily Net Gain/Burn, Monthly Fixed Costs, and Cash Runway — are the core of the dashboard.',
      'You configure your own cost data so the calculations are accurate for your specific business.',
    ],
    content: [
      {
        heading: 'What Is the AskBiz CFO Dashboard?',
        body: 'The CFO dashboard is a financial command centre built into AskBiz at askbiz.co. It is designed to answer the questions every business owner asks themselves: How much cash do I have? Am I burning money or making it? How long can I keep operating at this pace? You do not need to be a CFO or an accountant to use it. The dashboard takes information you already know — your current bank balance and your regular costs — and turns it into clear, colour-coded numbers that update as your business changes. It lives inside the Intelligence tab under the Cash Flow sub-tab and is accessible from any device.',
      },
      {
        heading: 'The Four Core Metric Cards',
        body: 'The dashboard centres on four metric cards arranged across the top of the screen. Cash Balance shows the liquid cash your business currently holds. Daily Net Gain/Burn shows whether you are earning more than you are spending each day, or burning through reserves. Monthly Fixed Costs shows the total of all predictable recurring expenses you have configured. Cash Runway tells you how many months you can keep operating at the current burn rate before cash runs out. Each card uses colour coding — green for healthy, amber for caution, red for urgency — so you can read the state of your business at a glance without doing any maths.',
      },
      {
        heading: 'The Cost Configuration Drawer',
        body: 'The numbers in the cards are only as accurate as the cost data you put in. The Cost Configuration Drawer is a slide-in panel where you enter your real business costs. It has three tabs: Cash Balance (where you enter your current bank balance), Fixed Costs (predictable monthly expenses like rent, salaries, and subscriptions), and Variable Costs (expenses that fluctuate with activity, like shipping and ad spend). You can use the preset category rows or add your own. All data is saved locally in your browser so it persists between sessions without requiring a separate account sync.',
      },
      {
        heading: 'Why It Matters for Small Business Owners',
        body: 'Most small business owners manage finances reactively — they check their bank account when something feels wrong. The CFO dashboard shifts you to a proactive mindset. When you can see your daily burn rate and runway length every morning, you make different decisions. You prioritise cash-generating activities before problems occur. You spot that a new software subscription pushed your fixed costs above a comfortable threshold. You notice that your runway dropped from 8 months to 5 months over a single quarter. These are the insights that let you act before a crisis rather than during one. The dashboard does not replace your accountant; it gives you the context to have better conversations with them.',
      },
      {
        heading: 'What the Dashboard Does Not Do',
        body: 'It is worth being clear about scope. The CFO dashboard is a planning and monitoring tool, not a full accounting system. It does not file taxes, reconcile bank accounts, or replace dedicated bookkeeping software. The calculations rely on data you enter manually, so it reflects your understanding of your costs rather than pulling live banking data. Think of it as a dynamic financial model you keep updated rather than an automated accounting ledger. When you enter your costs accurately and update your cash balance regularly, the dashboard becomes one of the most useful daily habits you can build into your business routine.',
      },
    ],
    relatedSlugs: [
      'how-to-navigate-cfo-dashboard',
      'understanding-4-cfo-metric-cards',
      'cfo-dashboard-10-minute-setup',
    ],
    faq: [
      {
        q: 'Do I need accounting experience to use the CFO dashboard?',
        a: 'No. The dashboard is designed for business owners without a finance background. You enter your cash balance and costs, and it calculates everything else automatically.',
      },
      {
        q: 'Does the CFO dashboard connect to my bank account?',
        a: 'Not directly. You enter your current cash balance manually in the Cost Configuration Drawer. This keeps your banking credentials secure while still giving you accurate runway calculations.',
      },
      {
        q: 'Where exactly is the CFO dashboard in AskBiz?',
        a: 'Navigate to askbiz.co, click the Intelligence tab in the main navigation, then select the Cash Flow sub-tab. The four metric cards appear at the top of that screen.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-navigate-cfo-dashboard',
    title: 'How to Navigate to the CFO Dashboard',
    description:
      'Step-by-step directions for reaching the AskBiz CFO dashboard from the home screen — through the Intelligence tab to the Cash Flow sub-tab.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 2,
    keywords: [
      'AskBiz navigation',
      'Intelligence tab',
      'Cash Flow tab',
      'CFO dashboard location',
      'AskBiz tutorial',
    ],
    keyTakeaways: [
      'The CFO dashboard is three clicks from the AskBiz home screen: Intelligence tab, then Cash Flow sub-tab.',
      'The Intelligence tab also contains other analytical views; Cash Flow is the specific sub-tab for the CFO cards.',
      'The URL path for the dashboard is askbiz.co/intelligence once you are logged in.',
    ],
    content: [
      {
        heading: 'Starting From the AskBiz Home Screen',
        body: 'When you log in to AskBiz at askbiz.co you land on the main dashboard. This screen shows a summary of your store activity. To reach the CFO dashboard you need to move into the analytical layer of the app. Step 1: Look at the main navigation bar. On desktop this runs along the left side of the screen; on mobile it appears as a tab bar at the bottom. Step 2: Find and tap the Intelligence tab. It is labelled "Intelligence" and typically uses a chart or brain icon depending on your app version. Step 3: Once the Intelligence section opens, look for the sub-navigation or tab strip near the top of the content area. You will see options like Overview, Cash Flow, and possibly others. Step 4: Tap or click "Cash Flow". The CFO dashboard with its four metric cards now loads.',
      },
      {
        heading: 'What You See When You Arrive',
        body: 'After completing the navigation steps, the Cash Flow sub-tab displays the CFO dashboard. At the top you will see four metric cards in a horizontal row (or stacked vertically on a narrow mobile screen): Cash Balance, Daily Net Gain/Burn, Monthly Fixed Costs, and Cash Runway. Below the cards is an interactive chart showing your financial trend over the selected time period. If this is your first visit, the cards may show zero values or placeholder states because you have not yet entered your cost configuration. That is expected and normal. The next step is to open the Cost Configuration Drawer and enter your data.',
      },
      {
        heading: 'Finding Your Way Back Quickly',
        body: 'Once you have visited the CFO dashboard for the first time, returning is fast. On most devices AskBiz remembers your last position within the Intelligence section, so clicking Intelligence often takes you straight back to Cash Flow. If you use AskBiz on a desktop browser you can also bookmark the URL directly. The path follows the pattern askbiz.co/intelligence. Saving this bookmark means a single click from your browser toolbar opens the CFO dashboard. For mobile users, adding the AskBiz progressive web app to your home screen gives you one-tap access to the entire app, and from there the two-tap path to Cash Flow remains consistent.',
      },
      {
        heading: 'Troubleshooting: Cannot Find the Intelligence Tab',
        body: 'If the Intelligence tab is not visible, there are a few common reasons. First, check your subscription plan. The CFO dashboard is available on specific AskBiz tiers; if your plan does not include Intelligence features, you will see an upgrade prompt instead of the tab. Second, if you are on mobile and the navigation is collapsed, tap the menu icon (three horizontal lines, sometimes called a hamburger menu) to expand the full navigation list. Third, make sure your browser or app is fully loaded — if you navigated to AskBiz while offline or on a slow connection, the Intelligence tab may not render until the page completes loading. A hard refresh (Ctrl+Shift+R on desktop) usually resolves rendering issues.',
      },
    ],
    relatedSlugs: [
      'what-is-askbiz-cfo-dashboard',
      'how-to-open-cost-config-drawer',
      'cfo-dashboard-10-minute-setup',
    ],
    faq: [
      {
        q: 'Is the Cash Flow sub-tab the same as the CFO dashboard?',
        a: 'Yes. The Cash Flow sub-tab within the Intelligence section is where the CFO dashboard lives. The four metric cards, Cost Configuration Drawer, and burn-rate chart all appear there.',
      },
      {
        q: 'What if I only see a blank screen on the Cash Flow tab?',
        a: "A blank screen usually means you haven't configured your costs yet. Open the Cost Configuration Drawer by tapping the settings icon on the dashboard and enter your cash balance and cost figures.",
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-open-cost-config-drawer',
    title: 'How to Open the Cost Configuration Drawer',
    description:
      'Learn how to open the Cost Configuration Drawer in AskBiz, understand its three tabs, and know what each section is used for.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'Cost Configuration Drawer',
      'AskBiz settings',
      'fixed costs setup',
      'variable costs setup',
      'CFO configuration',
    ],
    keyTakeaways: [
      'The Cost Configuration Drawer slides in from the right side of the screen when you tap the config button on the CFO dashboard.',
      'It has three tabs: Cash Balance, Fixed Costs, and Variable Costs — each covering a different part of your financial picture.',
      'Changes made in the drawer apply instantly to the metric cards as soon as you save.',
    ],
    content: [
      {
        heading: 'What Is the Cost Configuration Drawer?',
        body: 'The Cost Configuration Drawer is the control panel for the CFO dashboard. It is a panel that slides in from the right side of your screen and contains all the inputs the dashboard needs to calculate your metrics. Without entering data here, the four metric cards cannot show you anything meaningful. The drawer keeps your configuration separate from the main dashboard view so the cards stay clean and uncluttered, while still giving you a straightforward way to update your numbers whenever your costs change.',
      },
      {
        heading: 'How to Open the Drawer',
        body: 'Step 1: Navigate to the CFO dashboard by going to the Intelligence tab and selecting Cash Flow. Step 2: Look for the configuration button on the dashboard. This is typically a gear icon, a sliders icon, or a button labelled "Configure" or "Edit Costs" positioned near the top-right of the dashboard or adjacent to the metric cards. Step 3: Tap or click that button. The drawer will animate in from the right edge of your screen, overlaying the dashboard content. Step 4: The drawer opens on the Cash Balance tab by default. You will see three tab labels at the top of the drawer: Cash Balance, Fixed Costs, and Variable Costs. You can tap any tab to switch between them.',
      },
      {
        heading: 'The Three Tabs Explained',
        body: 'The Cash Balance tab is where you enter the current amount of liquid cash your business holds. This is the starting number for the Cash Runway calculation, so accuracy matters. The Fixed Costs tab lists all your predictable monthly expenses — things that stay roughly the same every month regardless of how much you sell. AskBiz provides default category rows like Rent/Lease, Salaries and Wages, and Software Subscriptions, and you can add your own. The Variable Costs tab covers expenses that change with your business activity, such as Sales Commissions, Shipping and Fulfillment, and Paid Marketing. Each tab has its own set of rows, each with a cost label and a monthly amount field.',
      },
      {
        heading: 'Closing the Drawer',
        body: 'To close the drawer without saving, tap the X button in the top-right corner of the drawer panel, or tap anywhere on the dark overlay to the left of the drawer. To close the drawer and apply your changes, tap the Save button at the bottom of the drawer. The drawer will close, and the metric cards will immediately recalculate using your new figures. If you accidentally close the drawer without saving, your unsaved changes will not persist — the drawer will re-open with the last saved values. This makes it safe to explore without worrying about accidentally overwriting your configuration.',
      },
    ],
    relatedSlugs: [
      'how-to-set-cash-balance-askbiz',
      'how-to-configure-fixed-costs-askbiz',
      'how-to-configure-variable-costs-askbiz',
    ],
    faq: [
      {
        q: 'Can I have the drawer open and still see the metric cards?',
        a: 'The drawer slides over the dashboard on mobile, partially covering the cards. On wider desktop screens the cards remain partially visible to the left of the drawer panel.',
      },
      {
        q: 'What happens if I close the browser before saving?',
        a: 'Unsaved changes are discarded. Only data you have explicitly saved by tapping the Save button is written to localStorage and retained for your next session.',
      },
      {
        q: 'Is the drawer the only way to edit my cost settings?',
        a: 'Yes, the Cost Configuration Drawer is the dedicated interface for all cost and balance inputs. There is no separate settings page for these values.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-set-cash-balance-askbiz',
    title: 'How to Set Your Cash Balance in AskBiz',
    description:
      'A step-by-step guide to entering and updating your current cash balance in the AskBiz CFO dashboard and understanding what it drives.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'cash balance AskBiz',
      'set cash balance',
      'CFO dashboard setup',
      'cash runway input',
      'AskBiz configuration',
    ],
    keyTakeaways: [
      'Your cash balance is entered in the Cash Balance tab of the Cost Configuration Drawer and is the foundation of your runway calculation.',
      'Enter the combined total of all liquid cash your business currently holds, including bank accounts and accessible reserves.',
      'Update your cash balance regularly — at least weekly — to keep runway figures accurate.',
    ],
    content: [
      {
        heading: 'Why the Cash Balance Input Matters',
        body: 'The Cash Balance card on the CFO dashboard shows a single number: how much liquid cash your business currently holds. This number is the most important input in the entire dashboard because it determines your Cash Runway — the number of months you can keep operating at your current burn rate. If your cash balance is out of date, your runway figure is misleading. A business owner who last updated their balance two months ago may believe they have eight months of runway when in reality they have four. Keeping this number current is one of the highest-value habits you can build when using AskBiz.',
      },
      {
        heading: 'How to Enter Your Cash Balance',
        body: 'Step 1: Open the Cost Configuration Drawer by tapping the configure button on the CFO dashboard (gear or sliders icon). Step 2: The drawer opens on the Cash Balance tab by default. If it opened on a different tab, tap Cash Balance at the top of the drawer. Step 3: You will see a text field labelled "Current Cash Balance" or similar. Tap the field to focus it. Step 4: Type your current cash balance using the numeric keyboard. The field uses inputMode decimal so a clean number pad appears on mobile. Do not add currency symbols; type the number only (for example: 24500). Step 5: Double-check the amount against your most recent bank statement or accounting system. Step 6: Tap Save at the bottom of the drawer. The Cash Balance card and Cash Runway card will immediately update.',
      },
      {
        heading: 'What to Include in Your Cash Balance',
        body: 'For the most accurate runway calculation, your cash balance should represent all liquid cash the business can access within a few days. This typically includes your main business current account, any secondary business savings accounts that are not locked in fixed terms, and petty cash held physically. Do not include outstanding receivables (money customers owe you but have not paid), inventory value, or equipment value. Those are assets but not liquid cash. If you have a credit line you regularly draw on, you can include the available credit amount if your business relies on it as operating cash, but be consistent in how you define this across updates.',
      },
      {
        heading: 'How Often to Update Your Cash Balance',
        body: 'AskBiz does not pull your cash balance automatically from a bank feed, so you are responsible for keeping it current. A good rhythm is to update it every Monday morning before you start your week, or every time you reconcile with your accounting system. Some business owners update it daily during tight cash periods and weekly when cash is stable. You do not need to be perfect to the dollar — an accurate figure within a few hundred dollars is close enough for meaningful runway planning. Set a recurring reminder in your calendar titled "Update AskBiz cash balance" to make this a habit rather than something you only do when things feel uncertain.',
      },
    ],
    relatedSlugs: [
      'how-to-open-cost-config-drawer',
      'how-to-read-cash-balance-card',
      'how-to-read-cash-runway-card',
    ],
    faq: [
      {
        q: 'Should I enter my personal cash or only business cash?',
        a: 'Enter only your business cash — funds held in business accounts or directly used for business operations. Personal funds should be excluded to keep your business metrics accurate.',
      },
      {
        q: 'What currency should I use?',
        a: 'Enter your cash balance in your primary operating currency. AskBiz displays the figure as-is, so be consistent with the currency you use for all other cost entries.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-configure-fixed-costs-askbiz',
    title: 'How to Configure Your Fixed Costs in AskBiz',
    description:
      'Learn what counts as a fixed cost, how to enter each category in the AskBiz Cost Configuration Drawer, and why accurate fixed costs matter for your metrics.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 4,
    keywords: [
      'fixed costs AskBiz',
      'configure fixed expenses',
      'monthly overheads',
      'CFO dashboard setup',
      'burn rate configuration',
    ],
    keyTakeaways: [
      'Fixed costs are expenses that recur every month at a predictable amount regardless of your sales volume.',
      'AskBiz provides nine default fixed cost categories — you can edit amounts, delete unused ones, and add custom rows.',
      'Accurate fixed costs feed directly into your Daily Burn calculation and Cash Runway figure.',
    ],
    content: [
      {
        heading: 'What Counts as a Fixed Cost?',
        body: 'A fixed cost is any expense your business pays every month that does not change based on how much you sell. Your office rent is the same whether you have a great month or a quiet one. Salaries for salaried employees, health insurance premiums, business insurance, software subscriptions like your accounting tool or project management platform, equipment lease payments, loan or debt repayments, phone and internet bills, and ongoing accounting or legal retainers all qualify as fixed costs. The defining characteristic is predictability: you can put a reliable monthly dollar amount against each category. If a cost varies significantly month to month based on usage or sales, it belongs in Variable Costs instead.',
      },
      {
        heading: 'How to Enter Your Fixed Costs',
        body: 'Step 1: Open the Cost Configuration Drawer from the CFO dashboard. Step 2: Tap the Fixed Costs tab at the top of the drawer. Step 3: You will see a list of default cost categories: Rent/Lease, Salaries and Wages, Health Insurance, Business Insurance, Software Subscriptions, Equipment Leases, Loan/Debt Payments, Phone and Internet, and Accounting/Legal. Each row has a label on the left and a monthly amount field on the right. Step 4: Tap the amount field next to each category that applies to your business and type in the monthly cost. Leave the amount at zero (or delete the row) for categories that do not apply. Step 5: Work through each row methodically — refer to your bank statements or accounting software to find the correct monthly figures. Step 6: Once all applicable rows are filled in, tap Save.',
      },
      {
        heading: 'Using the Default Category Rows',
        body: 'AskBiz ships with nine preset fixed cost categories that cover the most common small business overheads. You do not have to use every row. If your business does not have an equipment lease, simply leave that row at zero or delete it using the remove button (typically a trash icon or minus button) on the right side of the row. The rows you delete do not affect the dashboard — they simply no longer appear in your configuration. If your business has a cost that spans two categories (for example, a combined phone and internet and cloud hosting bill), enter it in whichever row makes most sense to you and note it consistently so future updates are easy.',
      },
      {
        heading: 'Adding Custom Fixed Cost Categories',
        body: 'If your business has fixed costs that do not fit the default categories, you can add custom rows. Scroll to the bottom of the Fixed Costs tab and tap the "+ Add row" button. A new row appears with an editable label field and an amount field. Step 1: Tap the label field and type the name of your cost category (for example, "Warehouse Storage" or "Vehicle Lease"). Step 2: Tap the amount field and enter the monthly cost. Step 3: Repeat for as many custom rows as you need. Step 4: Tap Save to apply all changes. Your custom rows will persist between sessions alongside the default categories.',
      },
      {
        heading: 'Why Getting Fixed Costs Right Matters',
        body: 'Your total monthly fixed costs feed directly into the Daily Burn calculation (fixed costs plus variable costs divided by 30) which then determines your Cash Runway. An underestimated fixed cost figure produces an overly optimistic runway number. For example, if your real fixed costs are $8,000 per month but you only entered $5,000, your runway looks 60% longer than it actually is. This false comfort can lead you to delay fundraising, skip a cost-cutting conversation, or make a hiring decision that tips the balance. Spend 20 minutes getting the fixed cost tab accurate on your first setup, and you will have a dashboard that gives you genuinely useful guidance.',
      },
    ],
    relatedSlugs: [
      'how-to-configure-variable-costs-askbiz',
      'how-to-add-custom-cost-categories-askbiz',
      'reading-burn-rate-formula-breakdown',
    ],
    faq: [
      {
        q: 'What if a cost is mostly fixed but varies slightly each month?',
        a: 'Enter a conservative monthly average — round up slightly to avoid understating your costs. For a utility bill that ranges from $200 to $280, entering $260 is a reasonable fixed-cost proxy.',
      },
      {
        q: 'Should I include owner drawings or salary in Fixed Costs?',
        a: 'Yes, if you pay yourself a regular salary from the business, include it in the Salaries and Wages row. Owner drawings that are consistent each month can also be included here.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-configure-variable-costs-askbiz',
    title: 'How to Configure Your Variable Costs in AskBiz',
    description:
      'Understand the difference between fixed and variable costs, and learn how to enter each variable cost category in the AskBiz Cost Configuration Drawer.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 4,
    keywords: [
      'variable costs AskBiz',
      'configure variable expenses',
      'cost of goods sold',
      'burn rate inputs',
      'AskBiz CFO setup',
    ],
    keyTakeaways: [
      'Variable costs change with your sales volume or business activity — they are not the same every month.',
      'AskBiz provides six default variable cost categories including sales commissions, shipping, and ad spend.',
      'Use a recent monthly average for variable costs so your burn rate reflects typical operating conditions.',
    ],
    content: [
      {
        heading: 'Fixed Costs vs Variable Costs: The Core Difference',
        body: 'Fixed costs stay flat regardless of sales. Variable costs move with your business activity. If you sell more, you typically spend more on shipping, pay more in sales commissions, and possibly run more paid ads. If sales slow down, those costs shrink. This distinction matters for the CFO dashboard because variable costs represent the spending you can influence in the short term. When you need to reduce your daily burn quickly, variable costs are where you act first — pausing an ad campaign, renegotiating commission structures, or finding a cheaper fulfilment partner all reduce variable costs without affecting your core infrastructure.',
      },
      {
        heading: 'How to Enter Your Variable Costs',
        body: 'Step 1: Open the Cost Configuration Drawer from the CFO dashboard. Step 2: Tap the Variable Costs tab at the top of the drawer. Step 3: You will see six default categories: Sales Commissions, Shipping and Fulfillment, Paid Marketing/Ad Spend, Payment Processing Fees, Packaging, and Contract Labour. Each row has a label and a monthly amount field. Step 4: For each row that applies to your business, tap the amount field and enter your typical monthly spend. Because these costs vary, use your average from the last two or three months as the input. Step 5: Leave rows at zero or delete them if they do not apply. Step 6: Tap Save to apply your variable cost configuration.',
      },
      {
        heading: 'Estimating Variable Costs Accurately',
        body: 'The key challenge with variable costs is that they change. The best approach is to use a three-month rolling average. Open your bank statements or accounting software, find the total spent in each variable category for the last three months, add them together, and divide by three. That average is your monthly variable cost for the dashboard. Revisit and update variable costs at least once a month, ideally on the same day you update your cash balance. If your business is seasonal, consider whether your current period is above or below average and adjust your entry to reflect typical operating conditions rather than a peak or trough.',
      },
      {
        heading: 'Common Variable Costs to Consider',
        body: 'Beyond the six default categories, many businesses have additional variable costs worth tracking. Merchant processing fees (if not already captured in Payment Processing Fees) typically run 1.5% to 3% of revenue. If you use freelancers or contractors on a project basis, their costs belong in Contract Labour. Businesses that do any kind of physical product fulfilment often have packaging materials that scale directly with order volume. If you run Google Ads, Meta Ads, or any performance marketing, Paid Marketing/Ad Spend is one of your most controllable variable costs. When a cost clearly fluctuates month to month based on what you are doing, it belongs in this tab rather than the Fixed Costs tab.',
      },
      {
        heading: 'How Variable Costs Affect Your Dashboard',
        body: 'Variable costs combine with your fixed costs to produce the total monthly cost figure. The dashboard divides that combined total by 30 to get your Daily Burn rate. If your fixed costs are $6,000 per month and your variable costs are $2,000 per month, your total monthly cost is $8,000 and your daily burn is approximately $267. If you increase your ad spend by $1,000 per month, your daily burn rises to approximately $300. This direct relationship means you can use the dashboard as a decision-making tool before you spend: enter a hypothetical variable cost increase, check how it changes your runway, and decide whether the trade-off is worth it.',
      },
    ],
    relatedSlugs: [
      'how-to-configure-fixed-costs-askbiz',
      'reading-burn-rate-formula-breakdown',
      'how-to-add-custom-cost-categories-askbiz',
    ],
    faq: [
      {
        q: 'What if my variable costs are zero in some months?',
        a: 'Enter zero for that month and average across a longer period. If a cost genuinely only occurs in some months, use a 6-month average to smooth out the variability.',
      },
      {
        q: 'Should cost of goods sold (COGS) be in variable costs?',
        a: 'COGS can be included in variable costs if you want the burn rate to reflect your true cost of operations including product costs. However, many business owners track COGS separately in their accounting software and only include operating costs in the dashboard.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-add-custom-cost-categories-askbiz',
    title: 'How to Add Custom Cost Categories in AskBiz',
    description:
      'Step-by-step instructions for adding your own cost category rows to the Fixed Costs and Variable Costs tabs in the AskBiz Cost Configuration Drawer.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'custom cost categories AskBiz',
      'add cost row',
      'CFO drawer customisation',
      'business expenses AskBiz',
      'cost configuration',
    ],
    keyTakeaways: [
      'Both the Fixed Costs and Variable Costs tabs have an "+ Add row" button for creating custom expense categories.',
      'Custom rows accept any label you choose and a monthly amount, giving full flexibility to match your specific business.',
      'Custom rows persist in localStorage alongside default rows and appear every time you reopen the drawer.',
    ],
    content: [
      {
        heading: 'When to Add a Custom Cost Category',
        body: 'The default categories in the Cost Configuration Drawer cover the most common small business expenses, but every business is different. A restaurant needs a Food and Beverage Supplies row. A photography studio might need a Studio Rental row. A software company might want separate rows for AWS infrastructure, Stripe fees, and Intercom subscriptions rather than grouping them all under Software Subscriptions. Whenever a significant cost in your business does not map cleanly to an existing default row, adding a custom row is the right approach. Custom rows let you keep your cost breakdown specific enough to be useful without losing accuracy by forcing everything into broad buckets.',
      },
      {
        heading: 'How to Add a Custom Row to Fixed Costs',
        body: 'Step 1: Open the Cost Configuration Drawer from the CFO dashboard. Step 2: Tap the Fixed Costs tab. Step 3: Scroll to the bottom of the fixed cost list. Step 4: Tap the "+ Add row" button. A new blank row appears below the existing categories with an empty label field on the left and an empty amount field on the right. Step 5: Tap the label field and type a name for your cost category. Keep it short and descriptive, for example "Warehouse Storage" or "Annual License Fee (monthly)". Step 6: Tap the amount field and type the monthly cost as a number. Step 7: Repeat steps 4 through 6 for any additional custom categories. Step 8: Tap Save when done.',
      },
      {
        heading: 'How to Add a Custom Row to Variable Costs',
        body: 'The process is identical in the Variable Costs tab. Step 1: While still in the Cost Configuration Drawer, tap the Variable Costs tab. Step 2: Scroll to the bottom of the variable cost list. Step 3: Tap "+ Add row". A new blank row appears. Step 4: Enter a descriptive label for your cost, such as "Influencer Partnerships" or "Event Materials". Step 5: Enter the typical monthly amount. For variable costs, use a recent three-month average as your input. Step 6: Tap Save. Your custom variable cost rows are now included in the total variable cost figure and feed into the daily burn rate calculation.',
      },
      {
        heading: 'Naming and Organising Your Custom Rows',
        body: 'Good row naming makes it easier to update costs in future sessions. Use names that are immediately recognisable when you open the drawer weeks later. Avoid overly generic names like "Other" — instead name the specific cost. If you have several small miscellaneous costs that are not worth tracking individually, you can combine them into a single row called "Miscellaneous Overheads" with a combined monthly total. The order of rows does not affect calculations, so arrange them in whatever order makes sense for your mental model of the business — perhaps largest cost at the top, or grouped by department.',
      },
    ],
    relatedSlugs: [
      'how-to-configure-fixed-costs-askbiz',
      'how-to-configure-variable-costs-askbiz',
      'how-to-save-cost-settings-askbiz',
    ],
    faq: [
      {
        q: 'Can I rename a default category row?',
        a: 'Default rows have preset labels, but you can edit the label text directly if the field is editable. If editing is not available on default rows, add a custom row with your preferred name and set the default row to zero.',
      },
      {
        q: 'Is there a limit to how many custom rows I can add?',
        a: 'There is no enforced limit. You can add as many rows as your business requires. However, keeping the list manageable (under 20 rows per tab) makes the drawer easier to use in practice.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-save-cost-settings-askbiz',
    title: 'How to Save and Update Your Cost Settings',
    description:
      'How saving works in the AskBiz Cost Configuration Drawer, where your data is stored, and best practices for keeping settings up to date over time.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'save cost settings AskBiz',
      'localStorage CFO',
      'update cost configuration',
      'AskBiz data persistence',
      'CFO dashboard maintenance',
    ],
    keyTakeaways: [
      'Tap the Save button at the bottom of the Cost Configuration Drawer to persist all changes — there is no autosave.',
      'Settings are stored in your browser\'s localStorage under the key cfo_cost_config, so they survive page refreshes but are device-specific.',
      'Revisit and update your cost settings whenever a major cost changes — at least monthly for accuracy.',
    ],
    content: [
      {
        heading: 'How Saving Works in the Drawer',
        body: 'The Cost Configuration Drawer does not autosave as you type. Changes you make to any tab — Cash Balance, Fixed Costs, or Variable Costs — are held in a temporary state until you explicitly save them. This design prevents accidental overwrites if you open the drawer to check a figure and inadvertently change a number. When you are ready to apply all your changes across all three tabs, scroll to the bottom of any tab and tap the Save button. The drawer closes, and the CFO dashboard immediately recalculates all four metric cards using your updated inputs. A confirmation may briefly appear to confirm the save was successful.',
      },
      {
        heading: 'Where Your Data Is Stored',
        body: 'AskBiz stores your cost configuration in your browser\'s localStorage under the key cfo_cost_config. localStorage is a storage mechanism built into every modern web browser that persists data between sessions without requiring a server. This means your settings survive closing the tab, closing the browser, or restarting your device — as long as you are using the same browser on the same device. It also means your configuration is not shared between devices. If you use AskBiz on both a laptop and a phone, you would need to enter and save your configuration separately on each device.',
      },
      {
        heading: 'What Happens If You Clear Your Browser Data',
        body: 'Because cost settings are stored in localStorage, clearing your browser cache, cookies, and site data will erase your AskBiz cost configuration. If you or your IT team regularly clear browser data, you will need to re-enter your cost settings afterward. To protect yourself from this, keep a simple note of your cost figures in a document or spreadsheet so you can quickly re-enter them. Some businesses copy their cost breakdown into a shared document (for example a Google Sheets tab labelled "AskBiz CFO Config") so any team member can restore the configuration quickly. This takes five minutes to set up and saves frustration later.',
      },
      {
        heading: 'How Often to Update Your Settings',
        body: 'Your configuration is only as accurate as the last time you updated it. A good maintenance schedule is: update your cash balance every Monday (or every time you check your bank balance), update variable costs once a month using the previous month\'s actuals, and update fixed costs whenever a contract, subscription, or lease changes. Business owners going through a growth phase — hiring staff, moving to a new office, adding new software tools — should update their configuration immediately after each change rather than waiting for a monthly review. Think of the Cost Configuration Drawer as a living document, not a set-and-forget form.',
      },
    ],
    relatedSlugs: [
      'how-to-open-cost-config-drawer',
      'how-to-set-cash-balance-askbiz',
      'cfo-dashboard-10-minute-setup',
    ],
    faq: [
      {
        q: 'Will my settings sync if I log in on a different device?',
        a: 'Not automatically. Cost configuration is stored in browser localStorage, which is device-specific. You need to enter your settings on each device you use AskBiz on.',
      },
      {
        q: 'Can I undo a save if I entered something wrong?',
        a: 'There is no undo button, but you can reopen the drawer immediately after saving and correct any incorrect values, then save again.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'understanding-4-cfo-metric-cards',
    title: 'Understanding the 4 CFO Metric Cards',
    description:
      'A complete overview of all four CFO dashboard metric cards in AskBiz — what each one shows, how colour coding works, and what the cards do when clicked.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 4,
    keywords: [
      'CFO metric cards AskBiz',
      'cash balance card',
      'daily burn card',
      'cash runway card',
      'AskBiz dashboard overview',
    ],
    keyTakeaways: [
      'The four cards are Cash Balance, Daily Net Gain/Burn, Monthly Fixed Costs, and Cash Runway — together they give a complete financial snapshot.',
      'Each card uses green, amber, or red colour coding to signal the health of that specific metric.',
      'Cards are clickable and open drill-down panels with more detail about that metric.',
    ],
    content: [
      {
        heading: 'Card 1: Cash Balance',
        body: 'The Cash Balance card displays the current liquid cash balance you entered in the Cost Configuration Drawer. The number itself is straightforward, but the colour coding gives context. A healthy cash balance relative to your burn rate shows in green. As your cash falls toward levels that compress your runway, the card shifts to amber and eventually red. The Cash Balance card is clickable — tapping it opens a drill-down panel where you can see more context about your cash position and how it compares to your monthly obligations. This card updates immediately whenever you change the cash balance figure in the configuration drawer.',
      },
      {
        heading: 'Card 2: Daily Net Gain/Burn',
        body: 'The Daily Net Gain/Burn card shows whether your business is net positive or net negative each day, based on your cost configuration and any connected revenue data. A positive number (shown in green) means you are earning more than you are spending daily. A negative number (shown in red) is your daily burn — the amount you are drawing down from your cash reserves each day. The formula behind this card is: daily revenue minus daily burn rate. When your costs exceed revenue, the card turns red and displays the daily burn as a negative figure. This is one of the most actionable numbers on the dashboard because it tells you the daily rate at which your financial position is changing.',
      },
      {
        heading: 'Card 3: Monthly Fixed Costs',
        body: 'The Monthly Fixed Costs card shows the total of all fixed cost rows you entered in the Fixed Costs tab of the configuration drawer. This card is useful as a quick sanity check — glancing at it tells you your minimum monthly overhead before any variable costs. It is also clickable: tapping the card opens the Cost Configuration Drawer directly to the Fixed Costs tab, giving you a shortcut to update your fixed costs without manually navigating to the config button. The card is typically displayed in a neutral colour (not colour-coded with thresholds) because the number itself is neither inherently healthy nor unhealthy — it is your baseline cost structure.',
      },
      {
        heading: 'Card 4: Cash Runway',
        body: 'The Cash Runway card shows how many months your business can continue operating at the current burn rate before running out of cash. It is calculated by dividing your cash balance by your daily burn rate, then converting the result to months. When your daily net position is positive — meaning you are earning more than you are spending — the card displays "Cash +" in green instead of a runway number, because a cash-positive business has an indefinitely positive runway under current conditions. A runway under three months typically triggers a red indicator; three to six months is amber; above six months is green. This card is the single most important number for business owners concerned about sustainability.',
      },
      {
        heading: 'How the Cards Work Together',
        body: 'The four cards are designed to be read as a set. Cash Balance tells you where you are. Daily Net Gain/Burn tells you the direction and speed you are moving. Monthly Fixed Costs tells you your unavoidable baseline obligation. Cash Runway synthesises all three into the single most important forward-looking metric. A business with a high cash balance but a high burn rate and short runway is in a different position than a business with a modest cash balance but a long runway. Reading all four cards together takes about 10 seconds and gives you a more complete picture than any single metric could. Colour coding allows you to spot problems at a glance even before reading the actual numbers.',
      },
    ],
    relatedSlugs: [
      'how-to-read-cash-balance-card',
      'how-to-read-cash-runway-card',
      'understanding-cfo-card-colour-indicators',
    ],
    faq: [
      {
        q: 'Do all four cards update in real time?',
        a: 'The cards recalculate immediately when you save changes in the Cost Configuration Drawer. Revenue-linked cards also update when connected store data refreshes.',
      },
      {
        q: 'Can I hide cards I do not want to see?',
        a: 'The current version of the dashboard displays all four cards. Each card provides complementary information, so all four are recommended for a complete picture.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'cfo-dashboard-10-minute-setup',
    title: 'Your First 10-Minute CFO Setup Walkthrough',
    description:
      'A complete end-to-end setup guide for the AskBiz CFO dashboard — from navigating to the feature to saving your first full cost configuration in under ten minutes.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 5,
    keywords: [
      'AskBiz CFO setup guide',
      'first time CFO dashboard',
      'configure AskBiz finance',
      'quick start CFO',
      'AskBiz onboarding',
    ],
    keyTakeaways: [
      'The full CFO dashboard setup — navigation, cash balance, fixed costs, and variable costs — takes under 10 minutes.',
      'Having your bank balance and a recent expense statement open before you start makes the process faster.',
      'Once configured, your four metric cards give you an accurate real-time financial snapshot you can trust.',
    ],
    content: [
      {
        heading: 'Before You Start: What to Have Ready',
        body: 'This walkthrough takes you from zero to a fully configured CFO dashboard in under ten minutes. Before you begin, have two things ready: your most recent bank account balance and a recent bank statement or expense report showing your last month of costs. You do not need exact figures for every line item — a reasonable estimate is fine for variable costs. Having the numbers in front of you means you spend your time configuring rather than hunting for figures. Open AskBiz at askbiz.co in your browser and log in to your account.',
      },
      {
        heading: 'Step 1: Navigate to the CFO Dashboard',
        body: 'Step 1: From the AskBiz home screen, click the Intelligence tab in the main navigation (left sidebar on desktop, bottom bar on mobile). Step 2: Click the Cash Flow sub-tab in the secondary navigation at the top of the Intelligence section. The CFO dashboard loads with four metric cards. They may show zero or empty states if this is your first visit. Step 3: Locate the configuration button — a gear or sliders icon near the top-right of the dashboard. You are now ready to begin entering your data.',
      },
      {
        heading: 'Step 2: Set Your Cash Balance',
        body: 'Step 4: Click the configuration button to open the Cost Configuration Drawer. It opens on the Cash Balance tab. Step 5: Click the Current Cash Balance field and type your current business bank balance (numbers only, no currency symbols). Step 6: If you have funds across multiple accounts, add them together and enter the combined total. Do not close or save yet — move to the next tab.',
      },
      {
        heading: 'Step 3: Configure Fixed and Variable Costs',
        body: 'Step 7: Tap the Fixed Costs tab at the top of the drawer. Work through each default row — Rent/Lease, Salaries and Wages, Health Insurance, Business Insurance, Software Subscriptions, Equipment Leases, Loan/Debt Payments, Phone and Internet, and Accounting/Legal — entering the monthly amount for each that applies. Set unused rows to zero. Step 8: If you have fixed costs not in the default list, scroll to the bottom and tap "+ Add row" to create custom categories. Step 9: Tap the Variable Costs tab. Enter your typical monthly amounts for Sales Commissions, Shipping and Fulfillment, Paid Marketing/Ad Spend, Payment Processing Fees, Packaging, and Contract Labour. Add custom variable rows as needed. Step 10: Tap Save.',
      },
      {
        heading: 'Step 4: Read Your First Metrics',
        body: 'After saving, the Cost Configuration Drawer closes and all four metric cards refresh immediately. Your Cash Balance card now shows your current balance. Your Monthly Fixed Costs card shows the total you entered. Your Daily Net Gain/Burn card shows your estimated daily financial position based on costs and any connected revenue data. Your Cash Runway card shows the number of months you can operate at this burn rate. Take a moment to read all four cards together. If any card shows red, click it to open the drill-down panel and understand what is driving the figure. Congratulations — your CFO dashboard is now live and giving you real financial intelligence about your business.',
      },
    ],
    relatedSlugs: [
      'how-to-navigate-cfo-dashboard',
      'how-to-open-cost-config-drawer',
      'understanding-4-cfo-metric-cards',
    ],
    faq: [
      {
        q: 'What if I make a mistake during setup?',
        a: 'Open the Cost Configuration Drawer again at any time, correct any figures, and tap Save. The cards will recalculate immediately with your corrected values.',
      },
      {
        q: 'Do I need to set up all three tabs or can I do just one?',
        a: 'You can save partial configurations. The dashboard will calculate with whatever data you have entered. However, leaving out a whole tab (such as variable costs) will make your burn rate and runway figures less accurate.',
      },
    ],
    videoUrl: '',
  },

  // ===========================
  // MODULE 2 — Reading the CFO Cards (articles 11–20)
  // ===========================
  {
    slug: 'how-to-read-cash-balance-card',
    title: 'How to Read the Cash Balance Card',
    description:
      'What the Cash Balance card on the AskBiz CFO dashboard shows, where the data comes from, and how to keep it accurate and meaningful.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'cash balance card AskBiz',
      'read CFO card',
      'liquid cash business',
      'AskBiz cash metric',
      'cash balance interpretation',
    ],
    keyTakeaways: [
      'The Cash Balance card displays the figure you entered in the Cash Balance tab of the Cost Configuration Drawer.',
      'The card\'s colour reflects how your balance relates to your burn rate — green means comfortable runway, red means urgent.',
      'Update this card regularly (ideally weekly) to ensure the runway calculation stays accurate.',
    ],
    content: [
      {
        heading: 'What the Cash Balance Card Shows',
        body: 'The Cash Balance card is the first card in the row on the CFO dashboard. It shows a single large number: the total liquid cash your business currently holds. This is the figure you entered in the Cash Balance tab of the Cost Configuration Drawer. It does not pull from a bank feed automatically, so it reflects your most recent manual update. Below the primary number you may see a secondary label or timestamp showing when the balance was last updated, helping you remember whether the figure is fresh or overdue for a refresh. The card\'s primary job is to give you immediate visibility into your financial starting point without needing to open your banking app.',
      },
      {
        heading: 'Understanding the Colour Coding on the Card',
        body: 'The Cash Balance card uses colour to contextualise the raw number. Green means your cash balance is at a level that supports a comfortable runway given your current burn rate. Amber means your balance is declining toward a threshold that warrants attention — your runway may be under six months. Red means your cash balance is at a level where the runway is critically short, typically under three months at the current burn rate. The colour thresholds are dynamic: they are not based on an absolute cash figure but on the relationship between your balance and your daily burn. A $10,000 balance might be green for a low-burn lifestyle business and red for a high-burn startup.',
      },
      {
        heading: 'What Clicking the Card Does',
        body: 'The Cash Balance card is interactive. Tapping or clicking it opens a drill-down panel that provides more context about your cash position. This panel may show a breakdown of how your cash balance relates to your monthly obligations, a comparison to previous periods if historical data is available, or a prompt to update the balance if the last update was more than a few days ago. To close the drill-down panel, tap the X button or click outside the panel area. The drill-down is a read-only view — to change your cash balance, you still need to go through the Cost Configuration Drawer.',
      },
      {
        heading: 'When to Update Your Cash Balance',
        body: 'The Cash Balance card is only as useful as its accuracy. A stale balance gives you false confidence or false alarm. The most effective update schedule depends on your cash position: when cash is healthy and stable, weekly updates are sufficient; when cash is tight or you are tracking a specific fundraising or revenue milestone, daily updates give you the most accurate picture. A good trigger for an update is any time you reconcile your bank account, receive a significant payment, make a large expense, or transfer funds between accounts. Treat the Cash Balance card as a living gauge, not a historical record.',
      },
    ],
    relatedSlugs: [
      'how-to-set-cash-balance-askbiz',
      'how-to-read-cash-runway-card',
      'understanding-cfo-card-colour-indicators',
    ],
    faq: [
      {
        q: 'Does the card automatically deduct daily burn from the cash balance?',
        a: 'No. The Cash Balance card shows the figure you manually entered. It does not automatically reduce over time. You update it manually to reflect your actual bank balance.',
      },
      {
        q: 'What if my cash is split across multiple bank accounts?',
        a: 'Add all liquid business bank balances together and enter the combined total. The card represents total accessible cash, not just one account.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-read-daily-net-gain-burn-card',
    title: 'How to Read the Daily Net Gain/Burn Card',
    description:
      'Understand what the Daily Net Gain/Burn card measures in AskBiz, how positive and negative values are presented, and what the colours signal about your business.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'daily burn rate AskBiz',
      'net gain business',
      'daily net card',
      'burn rate indicator',
      'AskBiz financial metrics',
    ],
    keyTakeaways: [
      'A positive Daily Net Gain/Burn value (green) means daily revenue exceeds daily costs — your cash position is growing.',
      'A negative value (red) is your daily burn — the rate at which your cash reserves are being depleted.',
      'The daily burn drives the Cash Runway calculation, so improving this number directly extends your runway.',
    ],
    content: [
      {
        heading: 'What the Daily Net Gain/Burn Card Measures',
        body: 'The Daily Net Gain/Burn card is the pulse rate of your business finances. It shows the net financial movement of your business per day: the difference between what you earn and what you spend, expressed as a daily figure. If the number is positive, your business is generating more cash than it consumes each day. If the number is negative, your business is spending more than it earns and drawing down from your cash reserves. This single number tells you whether your current operational setup is sustainable and at what pace your financial position is improving or deteriorating.',
      },
      {
        heading: 'The Formula Behind the Number',
        body: 'The daily burn portion of this card comes from your cost configuration: total monthly fixed costs plus total monthly variable costs, divided by 30. This gives the daily cost baseline. If AskBiz has connected store data available, daily revenue from your store is incorporated to show a true daily net figure. If no revenue data is connected, the card may show only the burn side of the equation — your daily cost run-rate — which is still valuable for understanding how quickly you are drawing on your cash reserves. The formula makes this card directly linked to your Cost Configuration Drawer: updating your costs immediately changes this figure.',
      },
      {
        heading: 'Reading Positive vs Negative Values',
        body: 'When the Daily Net Gain/Burn card shows a positive number, the card displays in green and the number represents your daily cash gain. A reading of +$450 means you are adding approximately $450 in net cash to your business each day. When the card shows a negative number, it displays in red. A reading of -$300 means you are consuming $300 of your cash reserves daily. Both readings are useful. A strongly positive number confirms your current operating model is generating cash. A negative number is not automatically alarming — many businesses operate at a planned burn during growth phases — but it tells you exactly how much runway you are consuming per day.',
      },
      {
        heading: 'Using This Card to Make Decisions',
        body: 'The power of the Daily Net Gain/Burn card is that it turns abstract financial concepts into a concrete daily action rate. If your burn is -$200 per day and you want to extend your runway by two months (approximately 60 days), you need to either generate an additional $12,000 in revenue, cut $12,000 in costs over that period, or some combination of both. You can test scenarios by changing your variable cost entries in the drawer and watching how the card responds. For example, pausing a $1,000 per month ad campaign immediately reduces your daily burn by approximately $33. These small changes compound significantly over weeks and months.',
      },
    ],
    relatedSlugs: [
      'how-to-read-cash-runway-card',
      'reading-burn-rate-formula-breakdown',
      'how-cfo-cards-update-cost-config',
    ],
    faq: [
      {
        q: 'Is the daily figure a projection or an actual measured value?',
        a: 'It is primarily a calculated projection based on your configured costs divided by 30. When connected store revenue data is available, actual daily revenue is incorporated to make it a more accurate net figure.',
      },
      {
        q: 'Can I see the daily burn broken down by cost type?',
        a: 'Click the card to open the burn rate drill-down panel, which shows a breakdown of how fixed and variable costs contribute to the daily burn figure.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-read-monthly-fixed-costs-card',
    title: 'How to Read the Monthly Fixed Costs Card',
    description:
      'What the Monthly Fixed Costs card shows on the AskBiz CFO dashboard, how to interpret the total, and how to update it when your overheads change.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'monthly fixed costs card',
      'AskBiz overhead metric',
      'fixed cost total',
      'CFO card reading',
      'business overheads dashboard',
    ],
    keyTakeaways: [
      'The Monthly Fixed Costs card shows the sum of all rows entered in the Fixed Costs tab of the Cost Configuration Drawer.',
      'Clicking the card is a shortcut to opening the Cost Configuration Drawer directly to the Fixed Costs tab.',
      'This card represents your minimum monthly overhead — the floor cost of keeping the business running regardless of sales.',
    ],
    content: [
      {
        heading: 'What the Monthly Fixed Costs Card Displays',
        body: 'The Monthly Fixed Costs card shows one number: the total of every row in your Fixed Costs configuration tab added together. If you entered $2,500 for Rent/Lease, $4,000 for Salaries and Wages, $600 for Software Subscriptions, and $300 for Phone and Internet, the card displays $7,400. This is your monthly overhead floor — the minimum amount your business must spend each month to stay operational, regardless of whether you make a single sale. This figure is particularly important for business owners evaluating whether they can afford to reduce sales activity, take a slower season, or weather an unexpected disruption.',
      },
      {
        heading: 'How to Interpret the Fixed Costs Total',
        body: 'There is no universally correct fixed cost figure — it depends entirely on your business model and stage. A solo consultant might have total fixed costs of $1,200 per month. A small retail store might have $12,000. What matters is not the absolute number but how it relates to your revenue. A fixed cost total that exceeds your typical monthly revenue is a structural problem. A fixed cost total that is well below your average monthly revenue gives you healthy operating leverage. Use the Monthly Fixed Costs card as a sanity check: if the number surprises you (either higher or lower than you expected), drill into the configuration drawer to review what is and is not being captured.',
      },
      {
        heading: 'Using the Card as a Shortcut to Edit Fixed Costs',
        body: 'The Monthly Fixed Costs card is one of the clickable cards on the CFO dashboard. When you tap or click it, the Cost Configuration Drawer opens directly to the Fixed Costs tab — skipping the step of navigating to the config button and then clicking to the right tab. This shortcut is useful when you need to make a quick update: for example, your software subscription just renewed at a higher price, or you signed a new lease. Step 1: Click the Monthly Fixed Costs card. Step 2: The drawer opens to the Fixed Costs tab. Step 3: Update the relevant row amounts. Step 4: Tap Save. The card immediately refreshes to show the new total.',
      },
      {
        heading: 'When to Review Your Fixed Cost Total',
        body: 'Fixed costs should be reviewed at least quarterly, and immediately whenever a meaningful change occurs. Triggers for an immediate review include: signing or renewing a lease, hiring a new salaried employee, adding or cancelling a software subscription, taking on new debt, or renegotiating insurance premiums. An unreviewed fixed cost figure drifts over time as business costs naturally evolve. A figure that was accurate six months ago can be off by hundreds or thousands of dollars today if you have added new recurring expenses without updating the drawer. Setting a quarterly calendar reminder to audit your fixed cost rows takes 10 minutes and keeps your dashboard reliable.',
      },
    ],
    relatedSlugs: [
      'how-to-configure-fixed-costs-askbiz',
      'how-cfo-cards-update-cost-config',
      'understanding-4-cfo-metric-cards',
    ],
    faq: [
      {
        q: 'Does the Monthly Fixed Costs card include variable costs?',
        a: 'No. It shows only the total from the Fixed Costs tab. Variable costs are a separate input and contribute to the Daily Burn rate separately.',
      },
      {
        q: 'Why is my Monthly Fixed Costs card showing zero?',
        a: 'You have not yet entered any fixed cost amounts in the Cost Configuration Drawer. Open the drawer via the card click or the config button and enter your monthly overhead figures.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-read-cash-runway-card',
    title: 'How to Read the Cash Runway Card',
    description:
      'A clear explanation of the Cash Runway card in AskBiz — how months of runway are calculated, what the status colours mean, and when "Cash +" appears.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 4,
    keywords: [
      'cash runway AskBiz',
      'runway calculation',
      'months of runway',
      'cash positive indicator',
      'business survival metric',
    ],
    keyTakeaways: [
      'Cash Runway equals your cash balance divided by your daily burn rate, expressed in months.',
      'When net daily revenue exceeds daily costs, the card shows "Cash +" in green — meaning no runway limit under current conditions.',
      'Red means under 3 months, amber means 3–6 months, and green means over 6 months of runway.',
    ],
    content: [
      {
        heading: 'What Cash Runway Means',
        body: 'Cash Runway is the number of months your business can continue operating before its cash reserves reach zero, assuming no change in revenue or costs. It is the most forward-looking metric on the CFO dashboard and the one most closely watched by investors, lenders, and founders during planning exercises. A runway of 12 months means you have a year to reach profitability or raise additional funds before cash becomes a crisis. A runway of two months is a near-term emergency. The Cash Runway card translates your raw cash balance and burn rate into a single human-readable time horizon.',
      },
      {
        heading: 'The Calculation Explained',
        body: 'The formula is: Cash Runway (in months) equals Cash Balance divided by Daily Burn Rate, with the result divided by 30 to convert days to months. Daily Burn Rate is the total monthly costs (fixed plus variable) divided by 30. For example: if your cash balance is $30,000 and your total monthly costs are $5,000, your daily burn is approximately $167. Dividing $30,000 by $167 gives approximately 180 days, or 6 months of runway. When your connected store revenue data is incorporated, the daily net figure (revenue minus burn) is used instead of burn alone, giving a more accurate picture for revenue-generating businesses.',
      },
      {
        heading: 'Understanding the Colour Thresholds',
        body: 'The Cash Runway card uses three colours to communicate urgency. Green indicates more than 6 months of runway — your cash position is comfortable and gives you strategic flexibility. Amber indicates between 3 and 6 months of runway — a zone that warrants active planning, including exploring revenue growth opportunities or cost reductions. Red indicates under 3 months of runway — this is a critical signal that immediate action is required, whether that means accelerating sales, cutting costs, or pursuing emergency funding. These thresholds are designed to give you enough lead time to act: 3 to 6 months is typically enough time to implement meaningful change if you start immediately.',
      },
      {
        heading: 'What "Cash +" Means on the Runway Card',
        body: 'When your daily revenue exceeds your daily costs — meaning your business is operationally cash-flow positive — the Cash Runway card does not show a number. Instead it displays "Cash +" in green. This indicator means the runway concept does not apply in the traditional sense: a cash-positive business is not drawing down its reserves; it is adding to them. The absence of a finite runway number is good news. "Cash +" tells you that under current operating conditions your business is self-sustaining. The card will switch back to showing a month count if revenue data drops below your daily burn threshold, which is why keeping your revenue connections active and cost configuration accurate matters.',
      },
    ],
    relatedSlugs: [
      'what-does-cash-positive-mean-askbiz',
      'how-to-read-daily-net-gain-burn-card',
      'reading-burn-rate-formula-breakdown',
    ],
    faq: [
      {
        q: 'Is runway calculated in calendar months or 30-day periods?',
        a: 'The calculation uses 30-day periods for simplicity. This means 6 months of runway represents approximately 180 days of operating costs covered by current cash.',
      },
      {
        q: 'Does the runway number decrease automatically over time?',
        a: 'No. Runway recalculates based on the cash balance you have entered. It does not automatically count down. Update your cash balance regularly to keep the figure current.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'what-does-cash-positive-mean-askbiz',
    title: "What 'Cash +' Means on Your Runway Card",
    description:
      "A plain-English explanation of the 'Cash +' indicator on the AskBiz Cash Runway card — when it appears, what it means for your business, and why it's the goal.",
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'Cash Plus AskBiz',
      'cash positive runway',
      'CFO dashboard green indicator',
      'revenue exceeds costs',
      'AskBiz financial health',
    ],
    keyTakeaways: [
      '"Cash +" appears when daily revenue exceeds the combined daily burn of all fixed and variable costs.',
      'A "Cash +" status means the business is operationally self-sustaining — cash reserves are growing, not shrinking.',
      'The indicator turns back to a month count if revenue drops below the daily burn threshold.',
    ],
    content: [
      {
        heading: 'When Does "Cash +" Appear?',
        body: '"Cash +" replaces the month count on the Cash Runway card when your business is in a net cash-positive position. This occurs when your daily revenue is greater than your daily burn rate. Daily burn is calculated from your cost configuration: the total of your fixed and variable costs divided by 30. When connected store or revenue data shows that your daily earnings consistently exceed this daily cost figure, the dashboard recognises that you are adding to your cash reserves rather than depleting them. In this state, the concept of "how many months until I run out?" does not apply, because under current conditions you will never run out.',
      },
      {
        heading: 'What "Cash +" Tells You About Your Business',
        body: '"Cash +" is the green state every business owner wants to see on their dashboard. It confirms that your current revenue model covers all of your operating costs — fixed and variable — and generates a surplus. This surplus is what funds growth, builds a safety cushion, repays debt faster, or is distributed as profit. Seeing "Cash +" does not mean you should stop monitoring your costs or revenue. Costs can creep up, revenue can dip, and a business that is marginally cash-positive today might not be tomorrow. But it does mean you are operating from a position of strength rather than necessity, which changes the tone of every business decision you make.',
      },
      {
        heading: 'How "Cash +" Interacts With Your Cash Balance Card',
        body: 'When the runway card shows "Cash +", your Cash Balance card should also be trending upward over time (assuming your cash balance entries are kept current). The Cash Balance card shows the current snapshot while the runway card confirms the trajectory. Together, they paint a picture of a healthy financial position: you have cash on hand and you are generating more. If you notice that your Cash Balance card shows a declining number while the runway card still shows "Cash +", it is worth checking whether your cost configuration is fully up to date — costs may have risen without being reflected in the drawer.',
      },
      {
        heading: 'When "Cash +" Can Disappear',
        body: 'The "Cash +" indicator is not permanent. It can revert to a month-count display if your cost configuration changes (for example, you add significant new fixed costs in the drawer), if revenue data from your connected store drops below your burn rate, or if you update your costs to reflect a real increase in spending. This is normal and expected as businesses grow and evolve. The indicator serves as a real-time signal: it shows the current state of your cost-revenue relationship, not a permanent certificate of financial health. Monitoring it regularly keeps you aware of the moment conditions change and gives you time to respond before a cash pressure builds.',
      },
    ],
    relatedSlugs: [
      'how-to-read-cash-runway-card',
      'how-to-read-daily-net-gain-burn-card',
      'understanding-cfo-card-colour-indicators',
    ],
    faq: [
      {
        q: 'Does "Cash +" mean I have no burn rate at all?',
        a: 'No. Your business still has a burn rate — it still incurs daily costs. "Cash +" means your revenue exceeds those costs, so the net effect is a positive cash flow rather than a drawdown.',
      },
      {
        q: 'If I see "Cash +" can I stop updating my cost configuration?',
        a: 'No. Keeping your configuration accurate is still important. Costs that rise without being updated in the drawer can silently erode your cash-positive status without the dashboard reflecting the change.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-cfo-cards-update-cost-config',
    title: 'How the Cards Update When You Change Your Cost Config',
    description:
      'Learn what happens to each CFO metric card in real time when you modify your cost configuration, and how to use this dynamic to model financial scenarios.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Intermediate' as const,
    readTime: 4,
    keywords: [
      'CFO card recalculation',
      'AskBiz cost update',
      'real-time dashboard',
      'scenario planning AskBiz',
      'cost config impact',
    ],
    keyTakeaways: [
      'All four metric cards recalculate instantly when you tap Save in the Cost Configuration Drawer.',
      'Changing fixed costs affects the Monthly Fixed Costs card, Daily Burn, and Cash Runway simultaneously.',
      'You can use the drawer as a scenario planning tool by testing hypothetical cost changes before committing to them.',
    ],
    content: [
      {
        heading: 'The Real-Time Relationship Between Drawer and Cards',
        body: 'The Cost Configuration Drawer and the four metric cards are directly connected. Every time you tap the Save button in the drawer, AskBiz reads the latest values from all three tabs — Cash Balance, Fixed Costs, and Variable Costs — and immediately recalculates all four cards. There is no delay, no manual refresh required, and no page reload needed. This real-time feedback loop is intentional: it allows you to see the financial impact of a configuration change the moment you apply it, rather than waiting for a batch calculation to run.',
      },
      {
        heading: 'Which Cards Change When You Edit Fixed Costs',
        body: 'When you change any amount in the Fixed Costs tab and save, three of the four cards are affected. The Monthly Fixed Costs card updates to show the new total. The Daily Net Gain/Burn card recalculates because daily burn is derived from total monthly costs divided by 30 — a change in fixed costs directly changes the burn rate. The Cash Runway card recalculates because runway depends on the updated daily burn figure. The Cash Balance card is not affected by a fixed cost change — it only changes when you update the Cash Balance tab. This cascade means that adding a single new fixed cost row (for example, a new $500/month software subscription) ripples through three cards simultaneously.',
      },
      {
        heading: 'Which Cards Change When You Edit Variable Costs',
        body: 'Changes to the Variable Costs tab follow the same cascade pattern as fixed costs. Variable costs feed into the total monthly cost figure, which drives the daily burn rate, which determines the runway. Increasing variable costs (for example, increasing your ad spend from $1,000 to $2,500 per month) immediately shows up in a higher burn rate on the Daily Gain/Burn card and a shorter runway on the Cash Runway card. Reducing variable costs has the opposite effect. This cascade makes variable costs a particularly interesting lever: because they are within your control in the short term, experimenting with different variable cost levels in the drawer before making a real spending decision is a practical form of financial modelling.',
      },
      {
        heading: 'Using the Drawer as a Scenario Planning Tool',
        body: 'Because changes take effect immediately on save, you can use the Cost Configuration Drawer as a lightweight scenario planning tool. Before making a business decision that affects costs, open the drawer, enter the hypothetical new cost, and save. Watch how the runway card responds. If hiring a new employee would add $4,000 per month in fixed costs, entering that figure shows you immediately whether your runway drops from comfortable to concerning. After evaluating the scenario, you can revert the change if it was hypothetical. This does not replace formal financial modelling, but it gives you a fast, intuitive sense of the financial trade-offs involved in any cost decision — in under a minute, without a spreadsheet.',
      },
    ],
    relatedSlugs: [
      'how-to-configure-fixed-costs-askbiz',
      'how-to-configure-variable-costs-askbiz',
      'reading-burn-rate-formula-breakdown',
    ],
    faq: [
      {
        q: 'Do the cards update if I make changes but do not tap Save?',
        a: 'No. Cards only recalculate after you tap Save. Changes you type in the drawer without saving are in a temporary state and do not affect the displayed metrics.',
      },
      {
        q: 'Can I undo a save if I want to go back to previous values?',
        a: 'There is no undo function. If you want to revert, reopen the drawer, manually enter the previous values, and save again.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'understanding-cfo-card-colour-indicators',
    title: 'Understanding Card Colour Indicators (Green / Amber / Red)',
    description:
      'A guide to the green, amber, and red colour indicators on the AskBiz CFO metric cards — what each colour means for each card and what action to take.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'CFO card colours AskBiz',
      'green amber red dashboard',
      'financial health indicators',
      'runway threshold',
      'AskBiz colour coding',
    ],
    keyTakeaways: [
      'Green means healthy and comfortable, amber means monitor and plan, red means act immediately.',
      'Colour thresholds are relative — they reflect the relationship between your cash and your burn rate, not absolute numbers.',
      'The Daily Gain/Burn card uses green for positive and red for negative, without an amber state.',
    ],
    content: [
      {
        heading: 'The Colour System Overview',
        body: 'AskBiz uses a traffic-light colour system across the CFO dashboard cards to give you an at-a-glance reading of your financial health. Green means the metric is in a healthy range and no immediate action is required. Amber means the metric is in a zone that warrants attention — you should have a plan but there is no immediate crisis. Red means the metric has crossed a threshold that requires prompt action. The colour system is designed to let you absorb the state of your business finances in seconds, without needing to read and interpret the raw numbers every time you open the dashboard.',
      },
      {
        heading: 'Colour Indicators on the Cash Runway Card',
        body: 'The Cash Runway card has the most clearly defined colour thresholds. Green indicates more than 6 months of runway — you have substantial time to make decisions and execute plans. Amber indicates between 3 and 6 months of runway — this is the planning zone: enough time to act, but not so much that you can afford to delay. Red indicates less than 3 months of runway — immediate action is required. This might mean accelerating revenue, cutting costs, or securing additional funding. The three-month threshold was chosen because meaningful cost reductions or revenue changes typically take 4–8 weeks to take full effect, giving you a small buffer to act before the situation becomes critical.',
      },
      {
        heading: 'Colour Indicators on the Daily Gain/Burn Card',
        body: 'The Daily Net Gain/Burn card uses a simpler two-state colour system. Green indicates a positive daily net gain — your business is generating cash each day. Red indicates a negative daily position — a burn state where you are drawing on cash reserves. There is no amber state for this card because the distinction is binary: you are either cash-flow positive or you are not. A business operating in the red is not necessarily in crisis — planned burn phases are normal — but the red colour signals that monitoring and time-sensitivity are required. The intensity of the red figure (a small burn vs a large one) gives you additional context beyond the colour alone.',
      },
      {
        heading: 'Colour Indicators on the Cash Balance Card',
        body: 'The Cash Balance card\'s colour is contextual rather than based on absolute thresholds. A high cash balance that still results in a short runway (due to high burn) may display amber or red rather than green. Conversely, a modest cash balance with a very low burn rate may display green. The colour reflects the adequacy of the balance relative to your operating costs. This means two businesses with identical cash balances can see different colours on their Cash Balance cards if their burn rates differ significantly. The goal is to show you whether your balance is appropriate for your cost structure, not just whether you have a large number in the account.',
      },
    ],
    relatedSlugs: [
      'understanding-4-cfo-metric-cards',
      'how-to-read-cash-runway-card',
      'what-does-cash-positive-mean-askbiz',
    ],
    faq: [
      {
        q: 'Can I customise the colour thresholds to match my business?',
        a: 'Custom threshold settings are not available in the current version. The thresholds are set based on generally accepted financial planning standards for small businesses.',
      },
      {
        q: 'What if my card is amber but I feel the business is fine?',
        a: 'Amber is a prompt to plan, not a declaration of trouble. If your revenue is predictable and you are intentionally managing costs, amber may reflect a temporary phase. Use the colour as a reminder to verify your strategy rather than an automatic alarm.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-open-cfo-drill-down-panels',
    title: 'How to Click a Card to Open Its Drill-Down Panel',
    description:
      'Learn which CFO dashboard cards are clickable in AskBiz, what each drill-down panel contains, and how to navigate within and close the panels.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'CFO drill-down panel AskBiz',
      'clickable dashboard cards',
      'card detail view',
      'AskBiz panel navigation',
      'CFO card interaction',
    ],
    keyTakeaways: [
      'All four CFO metric cards are clickable and open a drill-down panel with additional context for that metric.',
      'Drill-down panels overlay the main dashboard and can be closed by tapping the X button or clicking outside the panel.',
      'Some drill-down panels provide shortcuts to editing the underlying data — for example, the Monthly Fixed Costs panel links to the cost configuration drawer.',
    ],
    content: [
      {
        heading: 'What Are Drill-Down Panels?',
        body: 'Drill-down panels are secondary views that open when you tap or click a metric card on the CFO dashboard. They are designed to give you more context about a specific metric without leaving the main dashboard. Rather than navigating to a completely different screen, the panel slides in or appears as an overlay, keeping the dashboard visible in the background. Drill-down panels are read-focused: they explain what the metric means in context, show how it is calculated, and in some cases provide historical comparisons or actionable recommendations. They do not replace the Cost Configuration Drawer as the place to edit your data.',
      },
      {
        heading: 'Which Cards Open Drill-Down Panels?',
        body: 'All four metric cards on the CFO dashboard are interactive. Tapping the Cash Balance card opens a panel showing your cash position in context, including how many days of operating costs it covers. Tapping the Daily Net Gain/Burn card opens the burn rate drill-down, which provides the formula breakdown, best and worst day statistics, a sensitivity table, and channel breakdown. This is the most detailed drill-down panel on the dashboard. Tapping the Monthly Fixed Costs card opens the Cost Configuration Drawer directly to the Fixed Costs tab as a shortcut. Tapping the Cash Runway card opens a panel explaining your current runway and what would need to change to extend it.',
      },
      {
        heading: 'How to Navigate Within a Drill-Down Panel',
        body: 'Once a drill-down panel is open, you can scroll within it to see all the content if it extends below the visible screen area. Some panels have tabs or section headers that let you jump between different views within the same panel. To move from one panel to another (for example, from the Cash Balance panel to the Runway panel), close the current panel first and then click the next card. You cannot have two drill-down panels open simultaneously. Within a panel, tappable links or buttons may take you to related sections of the dashboard — for example, a "Review Costs" button might open the configuration drawer.',
      },
      {
        heading: 'Closing a Drill-Down Panel',
        body: 'There are two ways to close a drill-down panel. Method one: tap the X button in the top-right corner of the panel. Method two: tap or click anywhere on the dimmed overlay outside the panel boundaries. Both methods return you to the main CFO dashboard with all four metric cards visible. No data is lost or changed by closing a panel — panels are read-only views. If you made any edits within a panel that has an edit shortcut (such as the cost configuration link in the Fixed Costs panel), those changes are only persisted if you explicitly tapped Save within the drawer that opened.',
      },
    ],
    relatedSlugs: [
      'how-to-open-burn-rate-drill-down',
      'understanding-4-cfo-metric-cards',
      'how-to-read-cash-runway-card',
    ],
    faq: [
      {
        q: 'Can I open a drill-down panel on mobile?',
        a: 'Yes. All cards are tappable on mobile. The drill-down panel appears as a full-screen or near-full-screen overlay on smaller devices for easier reading.',
      },
      {
        q: 'Is there a keyboard shortcut to open drill-down panels?',
        a: 'There are no documented keyboard shortcuts for panel navigation in the current version. Use mouse click or touch tap to open panels.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-to-use-ask-ai-cfo-cards',
    title: 'Using the Ask AI Button on CFO Cards',
    description:
      'How to use the Ask AI button on AskBiz CFO cards to generate AI-powered analysis of your metrics and get actionable financial guidance.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'Ask AI AskBiz',
      'AI financial analysis',
      'CFO AI assistant',
      'AskBiz Claude AI',
      'AI business insights',
    ],
    keyTakeaways: [
      'Each CFO metric card has an Ask AI button that generates a context-aware AI analysis of that specific metric.',
      'The AI uses your configured cost data and current metric values to produce relevant, specific guidance.',
      'Ask AI is most useful when you want to understand what a metric means for your specific situation or what to do about a concerning reading.',
    ],
    content: [
      {
        heading: 'What the Ask AI Button Does',
        body: 'Each CFO metric card on the AskBiz dashboard includes an Ask AI button — a small button or icon positioned on the card itself. When you tap it, AskBiz sends the current values of your dashboard metrics — your cash balance, burn rate, runway, and cost configuration — to an AI model powered by Claude. The AI analyses this context and generates a response that is specific to your numbers. It does not give generic financial advice; it interprets your actual figures and explains what they mean, what trends are concerning, and what actions are worth considering given your current financial position.',
      },
      {
        heading: 'Example Questions the AI Addresses',
        body: 'When you tap Ask AI on the Cash Runway card, the AI might explain: "At your current burn rate of $220 per day and cash balance of $18,000, you have approximately 82 days of runway. This is in the red zone. To extend runway to 6 months without raising revenue, you would need to reduce monthly costs by approximately $1,800." When you tap Ask AI on the Daily Burn card, it might identify which cost categories are contributing most to your burn and suggest the highest-leverage areas to review. The specificity of these responses is what makes them useful — they are grounded in your data, not a generic small business finance tutorial.',
      },
      {
        heading: 'When to Use Ask AI',
        body: 'Ask AI is most valuable in three situations. First, when you see a metric in the amber or red zone and want to understand what it means in your specific context and what options you have. Second, when you have just updated your cost configuration and want a narrative interpretation of how your financial picture has changed. Third, when you want a second opinion before making a cost decision — enter the hypothetical cost change, save it, and then tap Ask AI to hear how the AI interprets the new scenario. It is not a replacement for a professional accountant or financial adviser, but it gives you an intelligent, contextual interpretation of your metrics any time you need one.',
      },
      {
        heading: 'Getting the Most From the AI Response',
        body: 'The quality of the AI response depends on the accuracy of your cost configuration. An AI analysing a cash balance of $50,000 and monthly costs of $2,000 will give very different guidance than one analysing $50,000 with $15,000 in monthly costs. Before tapping Ask AI, ensure your cost configuration is up to date and your cash balance reflects your actual position. Read the AI response fully before acting on it — it may identify cost categories you had not considered or flag a scenario you had not modelled. If the AI response raises a question you want to explore further, you can follow up within the AskBiz AI chat interface for a deeper conversation.',
      },
    ],
    relatedSlugs: [
      'understanding-4-cfo-metric-cards',
      'how-to-open-cfo-drill-down-panels',
      'how-cfo-cards-update-cost-config',
    ],
    faq: [
      {
        q: 'Does the Ask AI button use my private financial data?',
        a: 'The AI receives the metric values and cost figures you have configured in your AskBiz dashboard. It does not access external accounts or personal banking data. Review AskBiz\'s privacy policy for details on data handling.',
      },
      {
        q: 'Is the Ask AI response different each time I tap it?',
        a: 'The response may vary slightly between sessions as AI models produce probabilistic outputs, but the guidance will consistently reflect your current configured values.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'how-cfo-card-data-flows-from-store',
    title: 'How CFO Card Data Flows From Your Connected Store',
    description:
      'Understand the data pipeline from your connected Shopify or other store through the AskBiz calculations to the four CFO metric cards.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Intermediate' as const,
    readTime: 4,
    keywords: [
      'AskBiz Shopify integration',
      'store data pipeline',
      'CFO revenue data',
      'connected store AskBiz',
      'data flow dashboard',
    ],
    keyTakeaways: [
      'When a store is connected, AskBiz pulls daily revenue data that feeds the Daily Net Gain/Burn card and Cash Runway calculation.',
      'Revenue data from your store combines with your manually configured cost data to produce net financial metrics.',
      'The accuracy of your CFO cards depends on both a healthy store connection and an up-to-date cost configuration.',
    ],
    content: [
      {
        heading: 'The Two Data Sources Behind the CFO Cards',
        body: 'The CFO metric cards draw from two sources simultaneously. The first is your manually entered cost configuration — the cash balance, fixed costs, and variable costs you enter in the Cost Configuration Drawer. The second is live revenue data from your connected commerce platform, such as Shopify. When AskBiz is connected to your store, it pulls order and revenue data at regular intervals. This store data represents the income side of the equation. Your configured costs represent the expenditure side. Together they produce the net metrics — Daily Net Gain/Burn, and by extension Cash Runway — that you see on the dashboard.',
      },
      {
        heading: 'How Revenue Data Reaches the Cards',
        body: 'The data flow from a connected Shopify store to the CFO cards follows these steps. Step 1: AskBiz connects to your store using an API integration. Step 2: Order data is pulled at regular intervals — typically hourly or on a short refresh cycle. Step 3: AskBiz calculates daily revenue by summing all orders completed in each calendar day. Step 4: Daily revenue is compared against the daily burn rate derived from your cost configuration. Step 5: The difference (revenue minus burn) is displayed as the Daily Net Gain/Burn figure. Step 6: If daily revenue consistently exceeds daily burn, the Cash Runway card switches to "Cash +" status. If burn exceeds revenue, the runway calculation uses the net daily burn figure.',
      },
      {
        heading: 'What Happens When the Store Connection Is Inactive',
        body: 'If your store connection is not active — for example, if the integration was disconnected or an API credential expired — the revenue side of the equation is absent. In this state, the Daily Net Gain/Burn card shows only the cost-side burn rate derived from your configuration, without incorporating revenue. The Cash Runway card calculates runway based on burn alone. The dashboard does not stop working; it simply shows a more conservative picture based on costs only. A banner or indicator may appear on the dashboard to alert you that store data is not flowing. If you see this, navigate to your AskBiz integrations settings and reconnect your store.',
      },
      {
        heading: 'Why Cost Configuration Accuracy Still Matters',
        body: 'Even with a live store connection, the CFO cards are only as accurate as your cost configuration. Revenue data from your store is precise and automatic. But if your configured costs are significantly understated (for example, you forgot to enter a $3,000 monthly payroll cost), the net figures will show a more positive picture than reality. The data pipeline is only complete when both halves — revenue from the store connection and costs from the drawer — are accurate. Think of the dashboard as a calculator: the store connection provides one input, and your cost configuration provides the other. Inaccurate inputs produce inaccurate outputs, regardless of how sophisticated the underlying system is.',
      },
    ],
    relatedSlugs: [
      'how-to-read-daily-net-gain-burn-card',
      'how-cfo-cards-update-cost-config',
      'reading-burn-rate-formula-breakdown',
    ],
    faq: [
      {
        q: 'Which store platforms does AskBiz support for data integration?',
        a: 'AskBiz supports Shopify as a primary integration. Check the AskBiz integrations page for the current list of supported platforms, as new connections are added over time.',
      },
      {
        q: 'How often does the revenue data refresh?',
        a: 'Revenue data typically refreshes on an hourly basis, though the exact interval depends on your plan. The most recent data timestamp may appear within the dashboard to confirm freshness.',
      },
    ],
    videoUrl: '',
  },

  // ===========================
  // MODULE 3 — Burn Rate Drill-Down (articles 21–25)
  // ===========================
  {
    slug: 'how-to-open-burn-rate-drill-down',
    title: 'How to Open the Daily Burn Rate Drill-Down Panel',
    description:
      'Step-by-step instructions for opening the burn rate drill-down panel in AskBiz and a first look at what it contains.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 3,
    keywords: [
      'burn rate drill-down AskBiz',
      'open burn panel',
      'daily burn details',
      'AskBiz drill-down',
      'CFO burn analysis',
    ],
    keyTakeaways: [
      'Tap the Daily Net Gain/Burn card to open the most detailed drill-down panel on the CFO dashboard.',
      'The burn rate panel contains a formula breakdown, best and worst day statistics, a sensitivity table, and a channel breakdown.',
      'Close the panel by tapping the X button or clicking the background overlay.',
    ],
    content: [
      {
        heading: 'Opening the Burn Rate Drill-Down',
        body: 'The burn rate drill-down panel is the most information-rich detail view on the entire CFO dashboard. It opens when you tap or click the Daily Net Gain/Burn card — the second card in the row on the Cash Flow sub-tab of the Intelligence section. Step 1: Navigate to the CFO dashboard via Intelligence > Cash Flow. Step 2: Locate the Daily Net Gain/Burn card (it shows a positive or negative daily figure, typically in green or red). Step 3: Tap or click anywhere on the card. The drill-down panel slides in from the right or appears as an overlay, depending on your device. Step 4: The panel loads with several sections you can scroll through.',
      },
      {
        heading: 'What the Panel Contains',
        body: 'The burn rate drill-down panel is organised into distinct sections stacked vertically. At the top, you see a summary of your current daily net position — the same figure shown on the card, but with slightly more context about whether it represents a gain or a burn. Below that is the Formula Breakdown section, which shows exactly how the daily burn number was calculated from your cost inputs. Further down is the Best and Worst Day statistics section, the Burn Sensitivity Table, and the Channel Breakdown. Each section answers a different question about your burn rate, moving from "what is the number" at the top to "what does it mean in different scenarios" further down.',
      },
      {
        heading: 'Scrolling Through the Panel',
        body: 'Because the burn rate panel contains multiple data sections, you will need to scroll to see all of the content. On mobile, swipe upward within the panel area to scroll. On desktop, use your mouse wheel or trackpad scroll gesture while the cursor is over the panel. The panel has its own independent scroll, separate from the main dashboard page scroll. This means scrolling within the panel does not move the underlying dashboard. If you accidentally scroll the background dashboard, move your cursor or finger back into the panel area and continue scrolling there.',
      },
      {
        heading: 'Closing the Panel and Next Steps',
        body: 'To close the burn rate drill-down panel, tap the X icon in the top corner of the panel, or tap the dimmed background overlay outside the panel. You will return to the main CFO dashboard with all four metric cards visible. If you found a section of the panel particularly useful — for example, the sensitivity table showing how your runway changes at different cost levels — you can reopen the panel at any time by tapping the burn card again. The panel content refreshes each time it opens, so it always reflects your most recently saved cost configuration.',
      },
    ],
    relatedSlugs: [
      'reading-burn-rate-formula-breakdown',
      'understanding-best-worst-day-statistics',
      'reading-burn-sensitivity-table',
    ],
    faq: [
      {
        q: 'Is the burn rate drill-down available on all plan levels?',
        a: 'The detailed drill-down panel is part of the Intelligence tab feature set. Check your current plan to confirm access; some deeper analytics sections may require a higher tier.',
      },
      {
        q: 'Can I export or share the burn rate panel data?',
        a: 'Export options may be available within the drill-down panel as a download button. If not present in your version, take a screenshot or contact AskBiz support about report export options.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'reading-burn-rate-formula-breakdown',
    title: 'Reading the Burn Rate Formula Breakdown',
    description:
      'An annotated walkthrough of how AskBiz calculates your daily burn rate — from fixed and variable cost inputs through to the final per-day figure.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Beginner' as const,
    readTime: 4,
    keywords: [
      'burn rate formula AskBiz',
      'daily burn calculation',
      'fixed variable cost formula',
      'burn rate explained',
      'CFO formula breakdown',
    ],
    keyTakeaways: [
      'Daily burn equals (monthly fixed costs plus monthly variable costs) divided by 30.',
      'The formula breakdown section in the drill-down panel shows each component and its contribution to the total.',
      'Understanding the formula helps you identify which cost type has the most leverage for reducing your burn.',
    ],
    content: [
      {
        heading: 'The Core Formula',
        body: 'The daily burn rate in AskBiz is calculated using a straightforward formula: Daily Burn equals the sum of total monthly fixed costs and total monthly variable costs, divided by 30. The number 30 is used as a standard month length for simplicity. For example: if your monthly fixed costs total $6,000 and your monthly variable costs total $2,400, your combined monthly cost is $8,400. Dividing by 30 gives a daily burn rate of $280. This daily figure is what the Daily Net Gain/Burn card displays (as a negative number if costs exceed revenue), and it is what divides into your cash balance to produce the Cash Runway figure.',
      },
      {
        heading: 'The Formula Breakdown Section in the Panel',
        body: 'The burn rate drill-down panel includes a Formula Breakdown section that visually annotates each step of the calculation. When you open the drill-down by clicking the Daily Net Gain/Burn card, scroll down to the Formula Breakdown. You will see: a row for total fixed costs (drawn from your Fixed Costs tab configuration), a row for total variable costs (drawn from your Variable Costs tab configuration), a combined monthly total row that adds the two together, a daily burn rate row that divides the monthly total by 30, and — if store revenue data is connected — a daily revenue row and a net daily gain/burn row that shows the difference. Each row in the breakdown is labelled clearly so you can follow the logic step by step.',
      },
      {
        heading: 'Why the 30-Day Divisor Is Used',
        body: 'Dividing by 30 provides a consistent daily rate regardless of whether the current month has 28, 29, 30, or 31 days. This simplification makes the daily burn figure a reliable operational metric rather than one that varies by calendar month. In practice, the difference between dividing by 30 versus the actual number of days in a month is small (the maximum variation is about 3%), and for planning purposes the consistent 30-day divisor is easier to reason about. If you are doing precise cash flow forecasting for an accountant or investor, note that AskBiz uses 30-day months; for very short runway situations where every day counts, factor in the actual month lengths.',
      },
      {
        heading: 'Using the Breakdown to Identify Cost Leverage',
        body: 'Once you can see fixed and variable costs as separate line items in the breakdown, you can identify where you have the most leverage for reducing burn. Fixed costs are generally harder to reduce quickly — breaking a lease, laying off salaried staff, or cancelling a multi-year software contract all have friction and cost implications. Variable costs are more immediately adjustable: pausing an ad campaign, renegotiating a commission rate, or finding a cheaper fulfillment provider can take effect within days. If your formula breakdown shows that variable costs represent 40% or more of your total monthly burn, that is a high-leverage area for immediate cost optimisation.',
      },
    ],
    relatedSlugs: [
      'how-to-open-burn-rate-drill-down',
      'understanding-best-worst-day-statistics',
      'reading-burn-sensitivity-table',
    ],
    faq: [
      {
        q: 'Does the formula include cost of goods sold?',
        a: 'Only if you have entered COGS-related items (such as shipping, packaging, or contract labour) as variable cost rows in your configuration. The formula uses exactly the rows you have configured — no additional data sources.',
      },
      {
        q: 'Can the burn rate be zero?',
        a: 'Technically yes, if all cost rows are set to zero. In practice, a zero burn rate would mean a business with no operating expenses, which is rare. A near-zero burn is possible for very lean solo businesses.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'understanding-best-worst-day-statistics',
    title: 'Understanding Best and Worst Day Statistics in Burn Analysis',
    description:
      'What the best and worst day statistics in the AskBiz burn rate drill-down panel measure, how they are calculated, and how to act on what they show.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Intermediate' as const,
    readTime: 4,
    keywords: [
      'best worst day AskBiz',
      'burn analysis statistics',
      'daily revenue range',
      'peak day business',
      'AskBiz financial analysis',
    ],
    keyTakeaways: [
      'Best day shows the highest net daily financial performance in the selected period; worst day shows the lowest.',
      'The gap between best and worst day reveals how volatile your daily financial performance is.',
      'Identifying patterns in your best and worst days guides decisions about pricing, operations, and marketing timing.',
    ],
    content: [
      {
        heading: 'What Best Day and Worst Day Measure',
        body: 'Within the burn rate drill-down panel, the Best and Worst Day Statistics section shows two key data points for the period currently selected on the chart (7D, 30D, or 90D). Best Day is the single calendar day within that period when your net daily financial performance was highest — meaning either the largest net gain or the smallest net burn. Worst Day is the calendar day when performance was lowest — the largest net burn or the smallest net gain. These are calculated using actual daily revenue data from your connected store combined with the daily burn rate derived from your cost configuration.',
      },
      {
        heading: 'How to Read the Best/Worst Day Figures',
        body: 'Each statistic shows the date, the day of the week, and the net daily figure for that day. For example, a best day reading might show: "Tuesday, 18 March — Net Gain: +$892." A worst day reading might show: "Sunday, 9 March — Net Burn: -$280." The sign and magnitude of these figures tells you a great deal about your revenue volatility. A best day of +$892 and worst day of -$280 means your daily performance swings by over $1,100 depending on the day. This level of volatility indicates that while your average may be acceptable, there are significant low-revenue periods that could become problematic if they cluster together or extend.',
      },
      {
        heading: 'Acting on Best Day Patterns',
        body: 'Your best day patterns reveal what your business looks like when it is performing optimally. Reviewing the best day across multiple time periods (7D, 30D, 90D) can help you identify patterns. Do best days cluster on weekdays or weekends? Do they coincide with email campaigns, promotions, or seasonal events? Understanding these patterns allows you to either replicate the conditions that drive best-day performance more consistently, or at minimum to time high-effort activities (like new product launches or promotions) to periods when your business naturally performs well. This information is most useful when reviewed monthly as part of a regular operational review.',
      },
      {
        heading: 'Acting on Worst Day Patterns',
        body: 'Worst day patterns identify the conditions associated with low performance. If your worst days consistently fall on a particular day of the week (for example, Monday is always your worst day), that is worth investigating. It might reflect customer buying behaviour, shipping cut-offs, or even gaps in your marketing schedule. If your worst days are random and unpredictable, this points to volatility rather than a structural pattern — which is a different problem requiring revenue stabilisation strategies such as subscriptions, retainers, or diversification. Use the 90-day view to identify whether worst days are improving over time, worsening, or staying flat, as this trend reveals whether your business stability is changing.',
      },
    ],
    relatedSlugs: [
      'how-to-open-burn-rate-drill-down',
      'reading-burn-rate-formula-breakdown',
      'reading-burn-sensitivity-table',
    ],
    faq: [
      {
        q: 'Are best and worst day stats available without a connected store?',
        a: 'Best and worst day statistics rely on daily revenue data from your connected store. Without a store connection, only the cost-side burn rate is available, and day-level statistics cannot be calculated.',
      },
      {
        q: 'Can I click on a best or worst day to see that day\'s full detail?',
        a: "In some versions of the dashboard, clicking the date in the best/worst day section links to the daily detail view for that specific date. Check whether this is available in your current version.",
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'reading-burn-sensitivity-table',
    title: 'How to Read the Burn Sensitivity Table',
    description:
      'A guide to the burn sensitivity table in the AskBiz burn rate drill-down panel — how different cost level scenarios are presented and how to use them for decision-making.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Intermediate' as const,
    readTime: 4,
    keywords: [
      'burn sensitivity table AskBiz',
      'scenario analysis burn rate',
      'cost scenarios dashboard',
      'runway sensitivity',
      'AskBiz financial modelling',
    ],
    keyTakeaways: [
      'The sensitivity table shows how your daily burn rate and cash runway change at different total monthly cost levels.',
      'Each row in the table represents a cost scenario — from lower than current spend to higher — letting you see the runway impact without editing your configuration.',
      'Use the table to identify the cost reduction target needed to reach a specific runway milestone.',
    ],
    content: [
      {
        heading: 'What the Sensitivity Table Is',
        body: 'The Burn Sensitivity Table is a pre-calculated scenario matrix found within the burn rate drill-down panel. It answers the question: "If my total monthly costs were different, how would my runway change?" Rather than requiring you to manually edit the Cost Configuration Drawer multiple times, the table presents several cost scenarios in a single view, showing the resulting daily burn rate and cash runway for each. This allows you to quickly scan a range of possibilities and understand the financial leverage of different cost positions relative to your current setup.',
      },
      {
        heading: 'How to Read the Table',
        body: 'The table is organised in rows, each representing a different total monthly cost scenario. The columns typically include: Total Monthly Cost (the scenario cost figure), Daily Burn Rate (that scenario\'s daily cost), and Cash Runway (how many months of runway that scenario produces with your current cash balance). The row representing your current actual cost configuration is highlighted or marked with a "Current" label so you can see where you stand in the range. Rows above the current row show higher-cost scenarios (what happens if costs increase). Rows below show lower-cost scenarios (what happens if you cut costs). Each row uses the same cash balance you configured, only varying the cost side of the equation.',
      },
      {
        heading: 'Using the Table to Set Cost Reduction Targets',
        body: 'The most practical use of the sensitivity table is working backwards from a desired runway outcome. For example, suppose your current configuration shows 3.5 months of runway (amber zone). You want to reach 6 months of runway (green zone). Scan the table rows below your current line until you find a row that shows 6 months of runway. Read the Total Monthly Cost for that row — that is your cost reduction target. The difference between your current monthly cost and that target cost tells you exactly how much you need to cut each month to achieve 6 months of runway. This transforms an abstract goal ("extend runway") into a concrete operational target ("reduce monthly costs by $X").',
      },
      {
        heading: 'Scenario Planning With the Table',
        body: 'Beyond cost reduction, the sensitivity table is useful for planning cost increases. Before making a significant new expenditure — hiring a new employee, signing a new lease, committing to a new platform — find the row in the table that represents your costs after the increase. The runway figure in that row shows you what the decision will cost you in operational time. A hire that extends your monthly costs by $4,500 might drop your runway from 7 months to 5 months. That is not necessarily a reason to not hire, but it is important context for the decision. The table does not make the decision; it ensures you are making it with your eyes open to the financial trade-off.',
      },
    ],
    relatedSlugs: [
      'how-to-open-burn-rate-drill-down',
      'reading-burn-rate-formula-breakdown',
      'understanding-best-worst-day-statistics',
    ],
    faq: [
      {
        q: 'How are the cost scenario amounts in the table determined?',
        a: 'The table typically generates rows by varying your current total monthly cost by fixed percentage or dollar increments — for example, scenarios at -30%, -20%, -10%, current, +10%, +20%, and +30%. The exact increments may vary by version.',
      },
      {
        q: 'Does the table update when I change my cost configuration?',
        a: 'Yes. The table is generated dynamically from your current configuration each time the drill-down panel opens. After saving new cost settings, reopening the panel will show a refreshed table based on your updated figures.',
      },
    ],
    videoUrl: '',
  },
  {
    slug: 'understanding-channel-breakdown-burn',
    title: 'How Channel Breakdown Is Calculated in Burn Analysis',
    description:
      'Understand how AskBiz calculates and displays the channel contribution breakdown in the burn rate drill-down panel and how to interpret each channel\'s share.',
    category: 'AskBiz Tutorials',
    categorySlug: 'askbiz-tutorials',
    difficulty: 'Intermediate' as const,
    readTime: 4,
    keywords: [
      'channel breakdown AskBiz',
      'revenue channels burn',
      'channel contribution CFO',
      'Shopify channel data',
      'AskBiz revenue analysis',
    ],
    keyTakeaways: [
      'The channel breakdown shows how different revenue sources (such as direct, organic, and paid) contribute to offsetting your daily burn.',
      'Each channel\'s contribution is calculated as a proportion of total revenue, applied to the net daily burn figure.',
      'Channels with a high share of inflow but high associated variable costs (like paid ads) may have a lower net contribution than their gross revenue suggests.',
    ],
    content: [
      {
        heading: 'What the Channel Breakdown Shows',
        body: 'The Channel Breakdown is the deepest analytical section of the burn rate drill-down panel. It shows how different sales and revenue channels — such as direct website traffic, organic search, paid advertising, and social channels — each contribute to your daily revenue inflow and, by extension, to offsetting your daily burn. Rather than showing only the total net gain or burn figure, the channel breakdown reveals whether your revenue is coming from a diverse set of sources or is heavily concentrated in one channel. This distribution matters because a business dependent on a single revenue channel is more vulnerable to disruptions than one with revenue spread across multiple sources.',
      },
      {
        heading: 'How Channel Data Is Collected',
        body: 'Channel data flows from your connected commerce store (such as Shopify) into AskBiz through the integration API. When a sale is completed on your store, it carries attribution data indicating which channel referred the customer — direct URL, organic search, a specific email campaign, a paid ad, or a social media referral. AskBiz aggregates these attributions daily and groups them into channel categories. The daily revenue attributed to each channel is then presented in the breakdown. The accuracy of the channel breakdown depends on the quality of UTM tracking and attribution set up on your store; stores with clean UTM parameters produce clearer channel data.',
      },
      {
        heading: 'The Proxy Calculation Explained',
        body: 'Because precise per-channel cost data is not always available in AskBiz (the costs you enter are totals, not broken out by channel), the channel breakdown uses a proxy calculation to estimate each channel\'s net contribution to burn coverage. The calculation works as follows: each channel\'s percentage of total revenue is applied to the total daily revenue figure to determine the channel\'s gross revenue contribution. For channels with associated variable costs in your configuration (such as Paid Marketing/Ad Spend for your paid channel), those variable costs are proportionally allocated against that channel\'s contribution. The resulting net contribution per channel provides a practical, directionally accurate view of each channel\'s financial impact.',
      },
      {
        heading: 'Acting on Channel Breakdown Insights',
        body: 'The channel breakdown helps you make strategic decisions about where to invest your time and marketing budget. A channel that contributes 60% of your daily revenue but requires 80% of your variable marketing spend is less financially efficient than a channel that contributes 30% of revenue with minimal associated cost. If you see that organic search generates a high net contribution with low associated cost, that is a signal to invest in content and SEO. If paid ads generate high gross revenue but minimal net contribution after ad spend, that is a prompt to review your ad ROI before increasing the budget. These are the kinds of insights that the channel breakdown enables, turning raw attribution data into actionable financial intelligence.',
      },
    ],
    relatedSlugs: [
      'how-to-open-burn-rate-drill-down',
      'reading-burn-rate-formula-breakdown',
      'how-cfo-card-data-flows-from-store',
    ],
    faq: [
      {
        q: 'What if my store does not have UTM tracking set up?',
        a: 'Without UTM tracking, most revenue will be attributed to "Direct" or "Unknown" channels. This limits the usefulness of the channel breakdown but does not affect the accuracy of your core burn rate or runway metrics.',
      },
      {
        q: 'Can I customise how channels are grouped in the breakdown?',
        a: 'Channel groupings in the current version follow standard attribution categories. Custom channel groupings are not configurable directly in the dashboard. Contact AskBiz support for guidance on channel attribution customisation.',
      },
    ],
    videoUrl: '',
  },
]
