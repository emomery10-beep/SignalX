export const ACADEMY_CFO_BATCH_2 = [
  // ─── Module 3 continued — Burn Rate (articles 26–30) ───────────────────────

  {
    slug: "what-is-a-healthy-daily-burn-rate",
    title: "What a Healthy Daily Burn Rate Looks Like",
    description:
      "Learn what daily burn rate benchmarks look like across seed, growth, and profitable business stages so you can set realistic targets in AskBiz.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: [
      "healthy daily burn rate",
      "burn rate benchmarks",
      "seed stage burn rate",
      "startup cash burn",
      "AskBiz CFO dashboard",
    ],
    keyTakeaways: [
      "Burn rate health is relative to your stage — seed companies can sustain higher burn if runway is adequate.",
      "The Daily Net Gain/Burn card turns green when you are cash positive, signalling a structurally healthy operation.",
      "Comparing your burn against stage benchmarks reveals whether cost-cutting or revenue growth is the higher-leverage action.",
    ],
    content: [
      {
        heading: "Why 'Healthy' Depends on Stage",
        body: "There is no universal daily burn figure that applies to every business. A pre-revenue seed startup burning $800 per day may be perfectly on track if it has 18 months of runway, while a $300-per-day burn is a crisis for a business expected to be self-sustaining. The AskBiz Daily Net Gain/Burn card gives you your live number, but interpreting it correctly requires context about what stage your business is in. Use the Burn Rate drill-down panel to see the formula breakdown and understand which cost categories are driving the figure.",
      },
      {
        heading: "Seed Stage Benchmarks",
        body: "Seed-stage companies (pre-revenue or early revenue, typically raising a first round) commonly operate with daily burns ranging from $200 to $2,000 depending on team size and market. A solo founder with minimal overhead might burn $100 per day. A team of three with office space and SaaS tools might burn $600 to $800. The key benchmark at seed stage is not the absolute burn number but rather the runway it produces. Open the Cash Runway drill-down panel on the /intelligence page and confirm your runway reads at least 12 months if you are pre-revenue. If runway is under 6 months, seed-stage burn is likely too high regardless of the absolute figure.",
      },
      {
        heading: "Growth Stage Benchmarks",
        body: "Growth-stage companies (post-product-market fit, scaling revenue) tolerate higher burn because revenue is offsetting it. The Daily Net Gain/Burn card formula subtracts your daily revenue-side offset from gross burn. What matters here is your net burn trend. Step 1: Open the Burn Rate drill-down panel. Step 2: Look at the Best Day and Worst Day statistics at the top of the panel. Step 3: Calculate whether your best days are trending upward month-over-month. A healthy growth-stage business sees net daily burn decreasing over time as revenue rises, even if gross fixed costs stay flat. Growth-stage benchmarks vary widely but a net burn below 5 percent of monthly revenue is often considered manageable.",
      },
      {
        heading: "Profitable and Cash-Positive Stage",
        body: "When the Daily Net Gain/Burn card shows a green label reading 'Cash +', your net burn is zero or negative — meaning cash is accumulating each day. This is the structurally healthy state. Even here, the burn rate panel remains useful. Step 1: Review the Sensitivity Table in the burn panel to understand how much revenue would need to drop before you return to a net burn position. Step 2: Examine the Channel Breakdown to confirm no single revenue channel is masking burn in another. Step 3: Use the Cash Runway panel to confirm that even under pessimistic scenarios your runway is strong. A profitable business should see the Runway Status read 'Strong' with a green badge.",
      },
      {
        heading: "Using AskBiz to Track Your Burn Against Benchmarks",
        body: "Step 1: Navigate to the /intelligence page and note your Daily Net Gain/Burn card value. Step 2: Click the card to open the Burn Rate drill-down panel. Step 3: Read the burn formula breakdown — (Fixed Costs + Variable Costs) divided by 30 — to understand what is driving the number. Step 4: Cross-reference the Monthly Fixed Costs card to assess whether your fixed cost base is appropriate for your stage. Step 5: If your burn feels high relative to your stage benchmark, use the Sensitivity Table rows to model which cost category reductions would have the greatest impact on daily burn. This gives you a concrete action list rather than a vague goal.",
      },
    ],
    relatedSlugs: [
      "reading-burn-rate-formula-breakdown",
      "reading-burn-sensitivity-table",
      "how-to-read-daily-net-gain-burn-card",
    ],
    faq: [
      {
        q: "Does AskBiz compare my burn against industry benchmarks automatically?",
        a: "Not automatically — the dashboard shows your actual figures. The Ask AI button in the burn panel can provide contextual guidance when you describe your stage.",
      },
      {
        q: "What if my Daily Net Gain/Burn card shows a positive number but I still feel stressed about cash?",
        a: "A positive net gain means revenue is covering costs daily, but check the Cash Balance card to ensure reserves are adequate for unexpected events.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-cut-costs-using-burn-data",
    title: "How to Use Burn Data to Cut Costs",
    description:
      "A step-by-step guide to reading the Burn Rate Sensitivity Table in AskBiz to pinpoint the highest-impact cost reductions for your business.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: [
      "cut costs burn rate",
      "burn sensitivity table",
      "cost reduction AskBiz",
      "daily burn reduction",
      "CFO cost analysis",
    ],
    keyTakeaways: [
      "The Sensitivity Table shows exactly how much daily burn drops for each 10% reduction in a cost category.",
      "Fixed costs have a guaranteed impact on burn; variable cost reductions depend on volume.",
      "Prioritising the category with the largest sensitivity value gives you the fastest path to lower burn.",
    ],
    content: [
      {
        heading: "Opening the Burn Rate Drill-Down Panel",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Locate the Daily Net Gain/Burn card in the top row of metric cards. Step 3: Click the card. The Burn Rate drill-down panel expands below the cards row. Step 4: Scroll down within the panel until you see the Sensitivity Table section. The table lists each of your cost categories in rows with a column showing the burn impact of a 10 percent reduction in that category.",
      },
      {
        heading: "Reading the Sensitivity Table",
        body: "The Sensitivity Table in the Burn Rate panel has three key columns. The first column shows the cost category name — for example Payroll, Software/SaaS, or Marketing and Ads. The second column shows the current monthly cost assigned to that category. The third column shows how much your daily burn would fall if you cut that category by 10 percent. The row with the highest value in the third column is your highest-leverage cost target. If Payroll shows a daily burn reduction of $45 but Software/SaaS shows only $8, cutting payroll costs has roughly 5 times the impact on your daily burn rate.",
      },
      {
        heading: "Identifying High-Impact vs Low-Impact Cuts",
        body: "Not all cost categories deserve equal attention. Step 1: Sort through the Sensitivity Table rows mentally by the burn impact column. Step 2: Identify the top two or three categories with the highest impact values. Step 3: For each of those categories, open the Cost Config Drawer — accessible from the gear icon or the 'Configure Costs' button — to see how those costs are entered. Step 4: Ask yourself whether a 10 or 20 percent reduction in that category is operationally feasible. Marketing and Ads costs are often more controllable short-term than Payroll, making them a common first target even if Payroll has a higher sensitivity value.",
      },
      {
        heading: "Fixed vs Variable Cost Cutting Strategy",
        body: "The burn formula in AskBiz is (Fixed Costs + Variable Costs) divided by 30. Fixed costs appear in the Monthly Fixed Costs card and include Rent/Lease, Payroll, and Insurance. Variable costs are configured separately and scale with activity. When cutting costs to reduce burn, fixed cost cuts provide certain and immediate relief — a $500 monthly reduction in a fixed category reduces daily burn by exactly $16.67. Variable cost reductions depend on whether activity levels actually fall. Use the Channel Breakdown section of the burn panel to understand which expense channels are fixed versus volume-dependent before committing to a cut.",
      },
      {
        heading: "Modelling the Effect Before Committing",
        body: "Before making any real-world cost changes, model them in AskBiz first. Step 1: Open the Cost Config Drawer from the /intelligence page. Step 2: Temporarily lower the value of a target cost category. Step 3: Click Save. Step 4: Return to the burn panel and observe the new Daily Net Gain/Burn figure and the updated Sensitivity Table. Step 5: Check the Cash Runway card — a lower daily burn translates directly into extended runway. If the runway extension is meaningful (for example, 3 months or more), the cost cut is worth pursuing. Step 6: If you are modelling only, reverse the change in the Cost Config Drawer after noting the projected figures.",
      },
    ],
    relatedSlugs: [
      "reading-burn-sensitivity-table",
      "understanding-channel-breakdown-burn",
      "how-to-configure-fixed-costs-askbiz",
    ],
    faq: [
      {
        q: "Does the Sensitivity Table update in real time when I change cost settings?",
        a: "Yes. After saving changes in the Cost Config Drawer, all burn panel figures including the Sensitivity Table recalculate immediately.",
      },
      {
        q: "Can I add a custom cost category to the Sensitivity Table?",
        a: "Custom categories you create in the Cost Config Drawer appear in the Sensitivity Table automatically once they have a non-zero value.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "burn-rate-vs-runway-relationship",
    title: "Burn Rate vs Runway — Understanding the Relationship",
    description:
      "Understand the mathematical relationship between daily burn rate and cash runway in AskBiz, and learn how small burn reductions create disproportionate runway gains.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "burn rate vs runway",
      "cash runway formula",
      "daily burn runway relationship",
      "AskBiz runway calculation",
      "extend cash runway",
    ],
    keyTakeaways: [
      "Runway equals Cash Balance divided by Daily Burn — reducing burn extends runway without adding cash.",
      "Because runway is a division, small percentage decreases in burn produce large absolute gains in months.",
      "Both the burn panel and the runway panel must be read together for a complete cash picture.",
    ],
    content: [
      {
        heading: "The Formula That Links Burn and Runway",
        body: "Cash Runway in AskBiz is calculated as: Cash Balance divided by Daily Burn equals days of runway, then divided by 30 to convert to months. Daily Burn is itself calculated as: (Monthly Fixed Costs + Monthly Variable Costs) divided by 30. This means burn rate is embedded inside the runway formula. Changing either Cash Balance or Daily Burn will instantly update the Cash Runway card. The relationship is an inverse one — as daily burn increases, runway shrinks. As daily burn decreases, runway grows. This is visible live on the /intelligence page: make a cost change in the Cost Config Drawer, save it, and watch both the Daily Net Gain/Burn card and the Cash Runway card update simultaneously.",
      },
      {
        heading: "Why Small Burn Reductions Have Large Runway Effects",
        body: "Because runway is calculated by dividing a fixed cash balance by daily burn, reducing burn by a small percentage produces a proportionally larger gain in runway days. For example, if your cash balance is $30,000 and daily burn is $500, your runway is 60 days. Reducing daily burn by 10 percent to $450 increases runway to 66.7 days — an 11 percent improvement in runway from a 10 percent cost cut. Reducing burn by 20 percent to $400 gives 75 days — a 25 percent improvement. Open the Cash Runway drill-down panel in AskBiz and use the 4-scenario table to see this effect modelled across base, optimistic, pessimistic, and break-even scenarios.",
      },
      {
        heading: "Reading Both Panels Together",
        body: "Step 1: Open the Burn Rate drill-down panel by clicking the Daily Net Gain/Burn card on the /intelligence page. Note the current daily burn figure and the formula breakdown. Step 2: Close or minimise the burn panel and click the Cash Runway card to open the Runway drill-down panel. Step 3: The top of the Runway panel shows the same daily burn figure used in the runway calculation. Confirm these match. Step 4: In the Runway panel's 4-scenario table, the Optimistic scenario typically assumes a 15 to 20 percent burn reduction. Compare that runway figure to your current base case to quantify the benefit of cost discipline. Step 5: Return to the Burn Rate panel and use the Sensitivity Table to find which cost categories would deliver that 15 to 20 percent reduction.",
      },
      {
        heading: "Increasing Revenue vs Reducing Burn",
        body: "Both levers extend runway. On the burn side, reducing the daily burn figure extends runway by making the denominator of Cash Balance divided by Burn smaller. On the revenue side, if AskBiz is configured to factor in daily revenue as an offset, a higher revenue figure reduces net burn and therefore also extends runway. The Daily Net Gain/Burn card shows net burn, not gross burn, when revenue data is present. If your card reads 'Cash +', net burn is already zero or negative — adding cash is actually accumulating rather than depleting — and the Runway panel will reflect this with a very long or indefinite runway. In that state, focusing on burn reduction alone may be less valuable than deploying surplus cash strategically.",
      },
      {
        heading: "Practical Steps to Improve the Burn-Runway Ratio",
        body: "Step 1: On the /intelligence page, note your current Cash Runway figure in months from the Cash Runway card. Step 2: Click the Daily Net Gain/Burn card to open the Burn Rate panel. Step 3: Open the Sensitivity Table and identify the cost category where a 10 percent reduction produces the largest daily burn impact. Step 4: Open the Cost Config Drawer and reduce that category's value by 10 percent. Step 5: Save and return to the /intelligence page. Step 6: Click the Cash Runway card and note the new runway figure. This end-to-end exercise makes the burn-runway relationship tangible and gives you a concrete number to aim for.",
      },
    ],
    relatedSlugs: [
      "how-cash-runway-is-calculated",
      "reading-burn-rate-formula-breakdown",
      "reading-runway-scenario-table",
    ],
    faq: [
      {
        q: "If I add cash to the balance, does burn rate also change?",
        a: "No. Adding cash only changes the numerator of the runway formula. Daily burn is set by your cost configuration, not your balance.",
      },
      {
        q: "Which panel should I check first — burn or runway?",
        a: "Start with burn to understand why your rate is what it is, then check runway to understand how long you can sustain it.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-revenue-affects-burn-rate-card",
    title: "How Increasing Revenue Affects Your Burn Rate Card",
    description:
      "Learn how revenue functions as an offset to gross burn in AskBiz and how to track your path from net burn to a cash-positive position.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "revenue offset burn rate",
      "cash positive path",
      "net burn AskBiz",
      "reduce burn with revenue",
      "CFO daily net gain",
    ],
    keyTakeaways: [
      "Revenue reduces net daily burn — the Daily Net Gain/Burn card reflects net, not gross, burn when revenue is configured.",
      "When daily revenue equals daily gross burn, the card flips from red to green and displays 'Cash +' status.",
      "Tracking revenue growth against burn in AskBiz is the core of cash-positive planning.",
    ],
    content: [
      {
        heading: "Gross Burn vs Net Burn",
        body: "Gross burn is the total daily cost of running your business — (Fixed Costs + Variable Costs) divided by 30 — with no revenue offset. Net burn is what remains after subtracting daily revenue. The Daily Net Gain/Burn card in AskBiz shows net burn. When your daily revenue is lower than your daily gross burn, the card shows a negative figure in red — you are burning cash. When daily revenue equals gross burn, the net figure is zero. When daily revenue exceeds gross burn, the card shows a positive figure and the label changes to 'Cash +' displayed in green. Understanding this distinction is critical: two businesses can have identical gross burn but radically different net burn depending on their revenue.",
      },
      {
        heading: "How Revenue Data Enters the Calculation",
        body: "Step 1: On the /intelligence page, click the Daily Net Gain/Burn card to open the Burn Rate drill-down panel. Step 2: At the top of the panel you will see the formula section showing how daily burn is calculated. Step 3: If revenue has been entered or synced, a revenue offset line appears in the formula, reducing the net burn figure. Step 4: Navigate to the Expenses tab and confirm that any revenue-side entries or integrations are correctly categorised, as miscategorised income can understate the revenue offset. The more accurately revenue is recorded, the more reliable the net burn figure becomes.",
      },
      {
        heading: "The Path from Net Burn to Cash Positive",
        body: "The gap between your current daily net burn and zero is the revenue increase needed to reach break-even on a daily basis. Step 1: Open the Burn Rate drill-down panel and note the daily net burn figure — for example, negative $320 per day. Step 2: This means you need $320 more in daily net revenue to reach the cash-positive threshold. Step 3: Open the Cash Runway scenario table in the Runway panel and locate the Break-Even row. This row models exactly what happens to runway once revenue covers burn. Step 4: Use the Ask AI button in the burn panel to get specific suggestions on which revenue channels could close this gap fastest.",
      },
      {
        heading: "Revenue Growth Rate vs Burn Reduction Speed",
        body: "There are two paths to cash positive: grow revenue until it covers burn, or reduce burn until it falls below current revenue. Revenue growth is usually preferable strategically but slower to achieve. Burn reduction is faster but has limits — cutting too aggressively can damage the capacity to generate revenue. In AskBiz, you can model both scenarios simultaneously. Step 1: Use the Cost Config Drawer to lower costs by 10 percent and observe the new net burn. Step 2: Calculate how much less daily revenue you now need to break even. Step 3: Compare that to your current revenue trajectory. Often a combined approach — modest burn reduction plus moderate revenue growth — reaches cash positive faster than either lever alone.",
      },
      {
        heading: "Monitoring Progress in AskBiz",
        body: "Once you have set a target, use the /intelligence page as your daily check-in. Step 1: Each morning, check the Daily Net Gain/Burn card. A trending improvement (the negative figure getting smaller in absolute value) confirms you are moving toward cash positive. Step 2: Click the card to open the burn panel and verify the Channel Breakdown section. This shows which revenue or cost channels are changing. Step 3: When the card finally flips to green with a 'Cash +' label, click the Cash Runway card — you will notice runway extends significantly or shows a surplus accumulation message. Step 4: At that point, use the Ask AI button in the runway panel to get growth-oriented guidance on deploying the surplus.",
      },
    ],
    relatedSlugs: [
      "what-does-cash-positive-mean-askbiz",
      "reading-burn-rate-formula-breakdown",
      "using-ask-ai-cash-positive-growth",
    ],
    faq: [
      {
        q: "Does AskBiz automatically pull in revenue data?",
        a: "Revenue data enters through the Expenses tab entries or any connected integrations. Manual entry under income categories is also supported.",
      },
      {
        q: "Why does my card still show a burn figure even though I entered revenue?",
        a: "If gross burn exceeds the revenue offset, the card will still show a negative net figure. The card only turns green when revenue fully covers daily burn.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-use-ask-ai-burn-rate",
    title: "Using Ask AI to Interpret Your Burn Rate",
    description:
      "Learn how to use the Ask AI feature inside the AskBiz Burn Rate panel to get instant, context-aware recommendations on your daily cash burn.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "Ask AI burn rate",
      "AskBiz AI recommendations",
      "burn rate AI analysis",
      "CFO AI prompts",
      "reduce burn AI",
    ],
    keyTakeaways: [
      "The Ask AI button in the burn panel reads your live cost data and provides personalised recommendations.",
      "Framing your prompt with context — stage, goals, constraints — produces more actionable answers.",
      "Ask AI can suggest both cost-cutting and revenue strategies based on your burn breakdown.",
    ],
    content: [
      {
        heading: "Where to Find the Ask AI Button in the Burn Panel",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Click the Daily Net Gain/Burn card to open the Burn Rate drill-down panel. Step 3: Scroll to the bottom of the burn panel. You will see a button labelled 'Ask AI' or an AI chat input area. Step 4: The Ask AI feature in this panel has access to your current burn figures, cost breakdown, and formula data — you do not need to paste numbers into the prompt.",
      },
      {
        heading: "Example Prompts for Burn Rate Analysis",
        body: "Here are effective prompts to use in the Ask AI field within the burn panel. Try: 'My daily burn is higher than I expected. Which cost category should I cut first?' The AI will reference your Sensitivity Table and recommend the highest-impact category. Try: 'We are a seed-stage startup with 8 months of runway. Is our burn rate healthy?' The AI will compare your figures to stage benchmarks. Try: 'We need to extend runway by 3 months without cutting staff. What are my options?' The AI will look at your non-payroll cost categories and suggest reductions. Try: 'What daily revenue target do I need to reach cash positive?' The AI will calculate the break-even revenue using your current gross burn.",
      },
      {
        heading: "What the AI Looks at When You Ask",
        body: "The Ask AI feature inside the burn panel automatically reads your live dashboard data including daily burn value, fixed and variable cost totals, the formula breakdown, the Sensitivity Table values, and the Best Day and Worst Day statistics. This means its answers are specific to your business, not generic advice. You do not need to describe your costs in the prompt — the AI already knows them. What you should provide in your prompt is context about your goals (for example, 'I want to extend runway by 4 months') or constraints (for example, 'I cannot reduce payroll or marketing').",
      },
      {
        heading: "When to Use Ask AI vs Reading the Panels Yourself",
        body: "Use the burn panel data directly when you want to understand the mechanics — the formula, the sensitivity values, the channel breakdown. Use Ask AI when you want interpretation, prioritisation, or a recommendation. Good moments to use Ask AI include: when your burn has increased unexpectedly and you want a quick diagnosis, when you are preparing for a board meeting and need a plain-English summary of your burn situation, when you have multiple possible cost cuts and want a recommendation on which to prioritise, and when you are trying to model the path to cash positive and want step-by-step guidance. The AI is most useful when you give it a clear question tied to a specific decision.",
      },
      {
        heading: "Interpreting and Acting on AI Recommendations",
        body: "Step 1: After the AI responds, read the recommendation carefully. It will typically reference specific categories or figures from your dashboard. Step 2: If it recommends a specific cost cut, open the Cost Config Drawer to verify the current value of that category. Step 3: Before making changes, use the Cost Config Drawer to model the reduction and check the impact on your burn and runway cards. Step 4: If the AI recommends a revenue action, note it and cross-reference with the Cash Runway panel's Break-Even scenario row. Step 5: The AI does not make changes to your settings — all edits must be done manually in the Cost Config Drawer or Expenses tab.",
      },
    ],
    relatedSlugs: [
      "how-to-use-ask-ai-cfo-cards",
      "reading-burn-rate-formula-breakdown",
      "how-to-cut-costs-using-burn-data",
    ],
    faq: [
      {
        q: "Does Ask AI remember previous conversations?",
        a: "Each session with Ask AI starts fresh. For continuity, include relevant context in your prompt each time.",
      },
      {
        q: "Is Ask AI available in all drill-down panels or just burn?",
        a: "Ask AI appears in each drill-down panel and reads the data specific to that panel's context.",
      },
    ],
    videoUrl: "",
  },

  // ─── Module 4 — Cash Runway Drill-Down (articles 31–40) ───────────────────

  {
    slug: "how-to-open-cash-runway-drill-down",
    title: "How to Open the Cash Runway Drill-Down Panel",
    description:
      "Step-by-step instructions for opening the Cash Runway drill-down panel in AskBiz and an overview of what the panel contains.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "cash runway drill-down",
      "AskBiz runway panel",
      "open runway panel",
      "CFO cash runway",
      "runway drill down tutorial",
    ],
    keyTakeaways: [
      "Clicking the Cash Runway card on the /intelligence page expands the runway drill-down panel.",
      "The panel contains the formula breakdown, 4-scenario table, 12-month projection chart, and target calculator.",
      "Only one drill-down panel can be open at a time — opening runway closes any other open panel.",
    ],
    content: [
      {
        heading: "Finding the Cash Runway Card",
        body: "Step 1: Open your browser and navigate to the /intelligence page of your AskBiz CFO dashboard. Step 2: Look at the row of four metric cards at the top of the page. The four cards are Cash Balance, Daily Net Gain/Burn, Monthly Fixed Costs, and Cash Runway. Step 3: The Cash Runway card is the fourth card on the right. It displays your current runway in months along with a colour-coded status badge — green for Strong, yellow for Healthy, orange for Warning, or red for Critical.",
      },
      {
        heading: "Clicking the Card to Open the Panel",
        body: "Step 1: Click anywhere on the Cash Runway card. The card is fully clickable — you do not need to click a specific button or icon within it. Step 2: The drill-down panel expands below the row of metric cards with a smooth animation. Step 3: If another drill-down panel was already open (for example the Burn Rate panel), it will close automatically when the Runway panel opens. You can only have one panel expanded at a time. Step 4: To close the panel, click the Cash Runway card again or click the X button in the top-right corner of the panel.",
      },
      {
        heading: "What You See Inside the Panel",
        body: "The Cash Runway drill-down panel contains four main sections. The first section shows the formula breakdown: Cash Balance divided by Daily Burn equals days of runway, with the days-to-months conversion displayed below it. The second section is the 4-Scenario Table showing base, optimistic, pessimistic, and break-even runway projections. The third section is the 12-Month Cash Projection Chart, an SVG line chart showing your projected cash balance over the next 12 months. The fourth section is the Target Calculator where you can set a goal cash balance and see what burn or revenue changes are needed to reach it.",
      },
      {
        heading: "Navigating Within the Panel",
        body: "Step 1: Once the panel is open, scroll down within it to reach sections that may be below the fold. The panel height adjusts to fit all content but may extend below the visible browser window on smaller screens. Step 2: Each section has a labelled heading so you can quickly identify which part you are looking at. Step 3: The Ask AI button appears at the bottom of the panel — scroll all the way down to reach it. Step 4: All sections of the panel update in real time if you change cost settings in the Cost Config Drawer or update your cash balance.",
      },
      {
        heading: "Common Reasons to Open the Runway Panel",
        body: "Open the Cash Runway panel when you want to understand how long your current cash will last at the current burn rate. Open it when preparing for a fundraising conversation and you need the exact runway figure. Open it when you have just made cost changes and want to see the updated runway projection. Open it when your Cash Runway card badge has changed colour and you want to understand why. Open it at least once a week as part of your regular financial review to ensure your projection chart is trending in the right direction.",
      },
    ],
    relatedSlugs: [
      "how-to-read-cash-runway-card",
      "how-cash-runway-is-calculated",
      "how-to-open-cfo-drill-down-panels",
    ],
    faq: [
      {
        q: "Can I have the runway panel and the chart open at the same time?",
        a: "The 12-month projection chart is inside the runway panel itself, so they open together. The interactive daily cash chart is a separate section below the cards.",
      },
      {
        q: "The panel opened but appears empty. What should I do?",
        a: "Ensure your Cash Balance and cost settings are configured in the Cost Config Drawer. Without a cash balance and at least one cost entry, the panel has no data to display.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-cash-runway-is-calculated",
    title: "How Cash Runway Is Calculated Step by Step",
    description:
      "A clear walkthrough of the AskBiz cash runway formula — from cash balance and daily burn to months of runway — with a worked example.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "cash runway calculation",
      "runway formula AskBiz",
      "how runway is calculated",
      "cash balance divided by burn",
      "months of runway formula",
    ],
    keyTakeaways: [
      "Cash Runway = Cash Balance divided by Daily Burn, then divided by 30 to convert days to months.",
      "Daily Burn = (Monthly Fixed Costs + Monthly Variable Costs) divided by 30.",
      "Both inputs — balance and burn — can be adjusted in AskBiz to model different runway scenarios.",
    ],
    content: [
      {
        heading: "The Two Inputs You Need",
        body: "To calculate cash runway in AskBiz, the system needs two inputs: your current cash balance and your daily burn rate. The cash balance is the figure you entered or synced in the Cash Balance configuration of the Cost Config Drawer. The daily burn rate is derived automatically from your cost settings — it is not entered directly. If either of these inputs is missing or zero, the runway calculation cannot produce a meaningful result.",
      },
      {
        heading: "Step 1 — Calculating Daily Burn",
        body: "Before runway can be calculated, AskBiz calculates your daily burn. The formula is: Monthly Fixed Costs plus Monthly Variable Costs, divided by 30. Monthly Fixed Costs come from the categories you configured in the Cost Config Drawer — Rent/Lease, Payroll, Software/SaaS, Insurance, and similar recurring costs. Monthly Variable Costs come from your variable cost configuration — costs that fluctuate with activity like Supplies or Travel. For example, if your fixed costs total $9,000 per month and variable costs total $3,000 per month, your daily burn is ($9,000 + $3,000) divided by 30, which equals $400 per day.",
      },
      {
        heading: "Step 2 — Dividing Balance by Daily Burn",
        body: "With the daily burn rate known, the next step is: Cash Balance divided by Daily Burn equals Days of Runway. For example, if your cash balance is $40,000 and daily burn is $400, then $40,000 divided by $400 equals 100 days of runway. This figure — days of runway — appears in the top section of the Cash Runway drill-down panel along with the formula displayed so you can verify the inputs.",
      },
      {
        heading: "Step 3 — Converting Days to Months",
        body: "Days of runway divided by 30 gives months of runway. Continuing the example: 100 days divided by 30 equals 3.33 months of runway. This is the figure displayed on the Cash Runway card on the /intelligence page. AskBiz rounds to one decimal place for display. The runway drill-down panel shows both the days figure and the months figure so you can confirm the conversion. The Cash Runway card badge colour is then determined by the months figure — up to 1 month is Critical (red), 1 to 3 months is Warning (orange), 3 to 6 months is Healthy (yellow), and over 6 months is Strong (green).",
      },
      {
        heading: "Verifying the Calculation in the Panel",
        body: "Step 1: Navigate to the /intelligence page and click the Cash Runway card. Step 2: The panel opens with the formula displayed. Confirm the Cash Balance figure matches what you entered in your settings. Step 3: Confirm the Daily Burn figure matches what appears on the Daily Net Gain/Burn card. Step 4: Verify that Cash Balance divided by Daily Burn equals the Days figure shown. Step 5: Verify that Days divided by 30 equals the Months figure shown on the card. If any figure seems incorrect, open the Cost Config Drawer to check your cost entries and cash balance input.",
      },
    ],
    relatedSlugs: [
      "how-to-open-cash-runway-drill-down",
      "burn-rate-vs-runway-relationship",
      "how-to-read-cash-runway-card",
    ],
    faq: [
      {
        q: "Does AskBiz use a 30-day month or the actual number of days in the month?",
        a: "AskBiz normalises to a 30-day month for consistency across all burn and runway calculations.",
      },
      {
        q: "What happens to the runway calculation if daily burn is zero?",
        a: "If burn is zero (all costs are set to zero), runway would be infinite. AskBiz handles this by displaying a 'Cash +' or surplus state rather than a numeric runway.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "reading-runway-scenario-table",
    title: "Reading the Runway Scenario Table (4 Scenarios)",
    description:
      "Understand the four scenarios in the AskBiz Cash Runway Scenario Table — base, optimistic, pessimistic, and break-even — and how to use them for planning.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "runway scenario table",
      "AskBiz 4 scenarios",
      "optimistic pessimistic runway",
      "cash runway planning",
      "break-even runway scenario",
    ],
    keyTakeaways: [
      "The Base scenario is your current actual runway; the other three model what-if adjustments.",
      "The Optimistic scenario models reduced burn; Pessimistic models increased burn; Break-Even models zero net burn.",
      "Using all four scenarios together gives you a realistic range rather than a single-point forecast.",
    ],
    content: [
      {
        heading: "Opening the Scenario Table",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Click the Cash Runway card to expand the runway drill-down panel. Step 3: Scroll down past the formula breakdown section to find the 4-Scenario Table. The table has four rows — one per scenario — and columns showing the scenario name, the assumed daily burn for that scenario, and the resulting runway in months.",
      },
      {
        heading: "The Base Scenario",
        body: "The Base scenario uses your actual current daily burn and cash balance with no adjustments. The runway figure in this row matches exactly what the Cash Runway card displays. This is your starting point for all comparisons. If the Base scenario shows 4 months of runway, you know you have 4 months to either raise more capital, grow revenue, or reduce costs before cash runs out. The Base row is always highlighted differently from the others to indicate it reflects real current data rather than a model.",
      },
      {
        heading: "The Optimistic Scenario",
        body: "The Optimistic scenario models a reduction in daily burn — typically 15 to 20 percent below base, representing achievable cost cuts or a moderate revenue increase. The purpose of this scenario is to show you the runway upside if you successfully execute cost reductions. For example, if your Base runway is 4 months and the Optimistic scenario shows 5.2 months, you know that a 15 percent cost reduction adds roughly 1.2 months of runway. Use this row to set a concrete target: if 5.2 months crosses a threshold you care about (for example, enough time to close a funding round), the Optimistic scenario defines your required cost action.",
      },
      {
        heading: "The Pessimistic Scenario",
        body: "The Pessimistic scenario models an increase in daily burn — typically 15 to 20 percent above base, representing unexpected costs or revenue decline. This row answers the question: what is the worst plausible outcome if things go slightly wrong? For example, if the Pessimistic scenario shows 3.1 months and your next fundraising round is expected to close in 3.5 months, you have a timing risk. In that case, building a cash buffer or accelerating revenue becomes urgent rather than optional. The Pessimistic row is the most important row for risk management.",
      },
      {
        heading: "The Break-Even Scenario",
        body: "The Break-Even scenario models the runway when daily net burn is exactly zero — meaning daily revenue equals daily gross burn. When net burn is zero, no cash is being consumed, so runway is effectively infinite (or very long). This row shows the minimum revenue level at which your cash situation stabilises. Step 1: Note the daily burn figure in the Break-Even row. Step 2: If it equals your gross burn, that is the daily revenue required to break even. Step 3: Compare this to your current daily revenue to understand the gap. Step 4: Use the Ask AI button below the scenario table to ask how to close this gap within a specific timeframe.",
      },
    ],
    relatedSlugs: [
      "how-cash-runway-is-calculated",
      "reading-12-month-cash-projection-chart",
      "what-to-do-runway-under-3-months",
    ],
    faq: [
      {
        q: "Can I customise the percentage assumptions used in the Optimistic and Pessimistic scenarios?",
        a: "The scenario table uses fixed percentage offsets defined by the platform. For custom modelling, use the Cost Config Drawer to manually adjust cost values and observe the Base row change.",
      },
      {
        q: "Why does the Break-Even scenario show a very high runway number?",
        a: "When net burn is near zero or positive, runway extends dramatically. A very large number in the Break-Even row simply means your cash position is stable at that revenue level.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "reading-12-month-cash-projection-chart",
    title: "Reading the 12-Month Cash Projection Chart",
    description:
      "Learn how the AskBiz 12-month SVG cash projection chart is constructed and how to interpret the green line, red line, and zero crossover point.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "12-month cash projection chart",
      "AskBiz runway chart",
      "cash projection SVG",
      "runway chart zero line",
      "cash balance forecast",
    ],
    keyTakeaways: [
      "The green line represents projected cash balance under your current burn rate; a red line appears when it crosses zero.",
      "The zero line is the critical threshold — any point where the projection crosses it indicates cash-out.",
      "The chart updates in real time when you adjust cost settings, making it a live what-if planning tool.",
    ],
    content: [
      {
        heading: "Where the Chart Appears",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Click the Cash Runway card to open the runway drill-down panel. Step 3: Scroll down past the formula section and the 4-Scenario Table. Step 4: The 12-Month Cash Projection Chart appears as an SVG line chart spanning the full width of the panel. The horizontal axis represents the next 12 months and the vertical axis represents cash balance in your currency.",
      },
      {
        heading: "The Green Line — Projected Cash Balance",
        body: "The green line traces your projected cash balance over the next 12 months assuming your current daily burn rate continues unchanged. The starting point of the line is your current cash balance on the left axis. Each subsequent month's value is calculated by subtracting 30 times daily burn from the previous month's balance. When revenue offsets are present, the line slopes downward more slowly or may even slope upward if you are cash positive. A steadily descending green line that remains above zero for the full 12-month chart window indicates a Healthy or Strong runway status.",
      },
      {
        heading: "The Red Line and Zero Crossing",
        body: "When the projected cash balance is expected to reach zero before the 12-month window ends, the line colour transitions from green to red at the zero-crossing point. The zero crossing point is the most important feature of the chart — it shows exactly when cash runs out under current conditions. Step 1: Locate where the line changes from green to red on the chart. Step 2: Read the month label on the horizontal axis directly below that point. Step 3: That month is your projected cash-out date. Step 4: If no red portion appears on the chart, your runway extends beyond 12 months under current conditions.",
      },
      {
        heading: "The Zero Line",
        body: "A horizontal dashed line at y equals zero runs across the chart as a visual reference. This is the zero line — the point at which cash balance would be depleted. All projected cash balance values above this line are safe; any values below it represent a negative cash position, which is not sustainable. The area below the zero line may be shown in a different background shade to make the risk zone visually distinct. When planning, your goal is to ensure the green projection line never touches or crosses the zero line within your planning horizon.",
      },
      {
        heading: "Using the Chart as a What-If Tool",
        body: "Step 1: With the runway drill-down panel open and the chart visible, open the Cost Config Drawer (you can open it from the gear icon without closing the panel). Step 2: Reduce a major cost category by 10 or 20 percent and save. Step 3: Return to the runway panel. The chart will have updated to show the new projection. The green line will be shallower — declining more slowly — and any red portion may have shortened or disappeared. Step 4: This live feedback loop lets you directly see how cost decisions translate into projected cash outcomes. Repeat with different cost categories to find the configuration that keeps the chart green for your desired planning horizon.",
      },
    ],
    relatedSlugs: [
      "reading-runway-scenario-table",
      "how-cash-runway-is-calculated",
      "how-to-set-target-cash-balance",
    ],
    faq: [
      {
        q: "Does the projection chart account for seasonal revenue changes?",
        a: "The chart uses a constant daily burn rate assumption. It does not model seasonal fluctuations unless your cost and revenue inputs are adjusted to reflect them.",
      },
      {
        q: "Can I export the projection chart as an image?",
        a: "Chart export is not currently a built-in feature. You can take a screenshot for presentation use.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-set-target-cash-balance",
    title: "How to Set a Target Cash Balance Goal",
    description:
      "Use the Target Calculator in the AskBiz Cash Runway panel to set a cash balance goal and understand what operational changes are needed to reach it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "target cash balance",
      "AskBiz target calculator",
      "cash goal planning",
      "runway target setting",
      "CFO cash planning",
    ],
    keyTakeaways: [
      "The Target Calculator in the Runway panel lets you set a goal cash balance and shows the required daily improvement.",
      "You can set targets for both minimum safe balance and growth accumulation goals.",
      "Working backward from a target reveals the exact burn or revenue changes needed to reach it.",
    ],
    content: [
      {
        heading: "Finding the Target Calculator",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Click the Cash Runway card to open the runway drill-down panel. Step 3: Scroll to the bottom of the panel. Below the 12-Month Cash Projection Chart you will find the Target Calculator section. It contains an input field labelled 'Target Cash Balance' or similar, and a timeframe selector where you choose how many months you want to reach that target.",
      },
      {
        heading: "Setting a Minimum Safe Reserve Target",
        body: "A common use of the Target Calculator is to set a minimum safe reserve — for example, the cash balance you want to always maintain as a buffer. Step 1: Decide on your minimum safe reserve amount. A common rule of thumb is 3 months of monthly costs. Step 2: Enter that figure into the Target Cash Balance field. Step 3: Select a timeframe — if you want to always maintain this balance, set the timeframe to your current runway length. Step 4: The calculator will show you whether your current trajectory reaches this target or whether intervention is required. If your current cash position is already above the target, the calculator confirms you are on track.",
      },
      {
        heading: "Setting a Growth Accumulation Target",
        body: "If your business is cash positive, the Target Calculator can also be used to set a savings or accumulation goal. For example, if you want to accumulate $50,000 in the next 6 months for a planned equipment purchase. Step 1: Enter $50,000 as the Target Cash Balance. Step 2: Set the timeframe to 6 months. Step 3: The calculator will show the required daily net gain needed to reach that target. Step 4: Compare that required figure to your current Daily Net Gain/Burn card value to assess feasibility. Step 5: If the gap is large, use the Ask AI button to explore which revenue or cost adjustments could close it.",
      },
      {
        heading: "Reading the Calculator Output",
        body: "The Target Calculator output shows at minimum two things: whether you are on track to reach the target given current burn and cash balance, and the required daily cash improvement (net gain increase or burn reduction) to hit the target by the chosen date. If you are on track, the output typically shows a green indicator. If you are not on track, the output shows the daily shortfall in red and may suggest the required cost reduction or revenue increase as a percentage of current figures. This output feeds directly into your planning conversations with the Ask AI feature.",
      },
      {
        heading: "Using Targets to Drive Weekly Reviews",
        body: "Step 1: Set a realistic target cash balance and timeframe in the calculator. Step 2: Every week, open the runway panel and check whether the current cash balance is trending toward the target. Step 3: If cash balance is falling further from the target, open the Burn Rate panel and identify which cost category has increased. Step 4: If cash balance is improving faster than expected, update the target upward to raise the ambition. Step 5: Over time, this process of setting, tracking, and adjusting targets turns the AskBiz dashboard from a passive reporting tool into an active financial management system.",
      },
    ],
    relatedSlugs: [
      "reading-12-month-cash-projection-chart",
      "how-to-set-cash-balance-askbiz",
      "reading-runway-scenario-table",
    ],
    faq: [
      {
        q: "Can I save a target and have AskBiz alert me if I fall below it?",
        a: "The Target Calculator displays live status based on current data. Persistent alerts are not currently a built-in feature.",
      },
      {
        q: "Should my target cash balance equal 3 months of costs or 6 months?",
        a: "The right target depends on your business stage and risk tolerance. Pre-revenue startups often target 12+ months; established profitable businesses may target 2 to 3 months as an operating buffer.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "runway-status-levels-explained",
    title: "Runway Status Levels: Critical, Warning, Healthy, Strong",
    description:
      "Learn the exact thresholds for each AskBiz runway status level, what colour each badge shows, and what action each status requires.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "runway status levels",
      "critical warning healthy strong",
      "AskBiz runway badge",
      "cash runway thresholds",
      "runway colour coding",
    ],
    keyTakeaways: [
      "AskBiz uses four runway status levels: Critical (≤1 month, red), Warning (1-3 months, orange), Healthy (3-6 months, yellow), Strong (>6 months, green).",
      "The status badge appears both on the Cash Runway card and inside the runway drill-down panel.",
      "Each status level should trigger a different urgency of action from monitoring to immediate intervention.",
    ],
    content: [
      {
        heading: "Why Status Levels Exist",
        body: "The Cash Runway card in AskBiz does more than show a number — it contextualises that number with a status badge. Without context, 3 months of runway could feel either comfortable or alarming depending on your situation. The status levels translate the raw months figure into a standardised risk category so you and your team immediately understand the urgency without having to interpret the number. The badge appears in the top-right corner of the Cash Runway card on the /intelligence page and is also repeated at the top of the runway drill-down panel.",
      },
      {
        heading: "Critical Status — 1 Month or Less (Red)",
        body: "A red Critical badge appears when your cash runway is 1 month or less. This is the emergency threshold. At this level, you have approximately 30 days or fewer of operating cash remaining at the current burn rate. Action is required immediately. The card border and badge both turn red to ensure this status is impossible to miss. If you see a Critical status, open the runway panel immediately, check the formula, and confirm the cash balance and burn inputs are correct. If they are correct, escalate to the Expenses tab to identify any expenses that can be paused, and consider fundraising or revenue acceleration as an immediate priority.",
      },
      {
        heading: "Warning Status — 1 to 3 Months (Orange)",
        body: "An orange Warning badge appears when runway is between 1 and 3 months. This is a serious but not yet emergency situation. You have enough time to take deliberate action but not enough time to wait. Warning status means you should be actively working on cost reduction, revenue growth, or fundraising with a specific plan and deadline. Open the Burn Rate drill-down panel and use the Sensitivity Table to identify the highest-impact cost cuts. Use the Runway Scenario Table to model what happens if you execute a 15 percent burn reduction. Set a weekly cadence of checking the runway card to track whether the warning is deepening or improving.",
      },
      {
        heading: "Healthy Status — 3 to 6 Months (Yellow)",
        body: "A yellow Healthy badge appears when runway is between 3 and 6 months. This is a manageable position but not comfortable enough to be complacent. At Healthy status, you have time to plan and execute changes without emergency pressure. Use this window to model scenarios, set a target cash balance in the Target Calculator, and pursue both cost discipline and revenue growth. The goal is to move the badge from Healthy to Strong before it regresses to Warning.",
      },
      {
        heading: "Strong Status — More Than 6 Months (Green)",
        body: "A green Strong badge appears when runway exceeds 6 months. This is the target state for most businesses. At Strong status, you have sufficient runway to absorb unexpected setbacks, pursue growth opportunities, and negotiate from a position of strength with investors, partners, or lenders. Even at Strong status, continue monitoring the runway panel monthly. A fast-growing company with rising costs can move from Strong to Warning faster than expected if burn increases without a corresponding revenue increase. Use the 12-Month Projection Chart in the runway panel to confirm the strong trajectory continues through the end of the chart window.",
      },
    ],
    relatedSlugs: [
      "how-to-read-cash-runway-card",
      "what-to-do-runway-under-3-months",
      "what-to-do-runway-under-1-month",
    ],
    faq: [
      {
        q: "Can the status badge change between sessions without me making any changes?",
        a: "Yes. If your cash balance changes due to new expense entries or if cost settings are updated, the runway and its status will recalculate on the next page load.",
      },
      {
        q: "Is there a status above Strong?",
        a: "When net burn is zero or negative (cash positive), the card may display a surplus or Cash + indicator rather than a runway months figure, which is the best possible state.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "what-to-do-runway-under-3-months",
    title: "What to Do When Your Runway Is Under 3 Months",
    description:
      "An action checklist for AskBiz users whose Cash Runway card shows Warning status, covering cost cuts, revenue acceleration, and fundraising steps.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: [
      "runway under 3 months",
      "warning runway status",
      "extend cash runway",
      "startup runway action plan",
      "AskBiz 3 month runway",
    ],
    keyTakeaways: [
      "A Warning status (1-3 months) requires an active response plan, not just monitoring.",
      "The three parallel tracks are cost reduction, revenue acceleration, and capital raising — pursue all three simultaneously.",
      "AskBiz's Burn Rate panel and Runway Scenario Table provide the data needed to prioritise each track.",
    ],
    content: [
      {
        heading: "Confirming the Situation",
        body: "Step 1: Open the /intelligence page and confirm the Cash Runway card shows an orange Warning badge (1-3 months). Step 2: Click the card to open the runway drill-down panel. Step 3: Verify the formula inputs — confirm the Cash Balance figure is accurate and the Daily Burn figure matches your actual cost configuration. If these are stale, update them in the Cost Config Drawer before proceeding. Step 4: Note the exact months figure — 2.8 months requires faster action than 2.2 months but both need immediate attention. Step 5: Check the 4-Scenario Table and note the Pessimistic scenario. If Pessimistic is under 1.5 months, treat this as a near-Critical situation.",
      },
      {
        heading: "Track 1 — Immediate Cost Reduction",
        body: "Step 1: Click the Daily Net Gain/Burn card to open the Burn Rate drill-down panel. Step 2: Open the Sensitivity Table and identify the top two cost categories by burn impact. Step 3: For each high-impact category, ask whether a 10 to 20 percent reduction is achievable within 2 weeks. Possible quick wins include pausing non-essential SaaS subscriptions (Software/SaaS category), reducing Marketing and Ads spend, deferring non-critical travel, and renegotiating supplier terms for Supplies or Professional Services. Step 4: Make the reductions in the Cost Config Drawer and confirm the runway card improves. Step 5: If the runway does not improve meaningfully, move to Track 3 immediately.",
      },
      {
        heading: "Track 2 — Revenue Acceleration",
        body: "With under 3 months of runway, waiting for organic revenue growth is rarely sufficient. Revenue acceleration means taking actions that produce cash within the current runway window. Consider offering annual prepayment discounts to existing customers, accelerating collection of outstanding invoices, launching a promotional campaign for your highest-margin product or service, or reaching out to warm prospects who have been in consideration. Step 1: Identify your fastest revenue channel from the Channel Breakdown in the Burn Rate panel. Step 2: Set a specific weekly revenue target that, if hit, would move your net burn figure closer to zero. Step 3: Track progress by monitoring the Daily Net Gain/Burn card daily.",
      },
      {
        heading: "Track 3 — Capital Raising",
        body: "If cost cuts and revenue acceleration alone cannot extend runway beyond 6 months within a reasonable timeframe, begin capital conversations immediately. With under 3 months of runway, you have less negotiating leverage but more time than you would at Critical status. Step 1: Use the Runway Scenario Table to prepare your fundraising data — show investors the Base, Optimistic, and Break-Even scenarios to demonstrate you understand your position. Step 2: Export or screenshot the 12-Month Projection Chart to visualise the funding need. Step 3: Prepare two versions of your ask: a minimum bridge amount (enough to reach 6 months) and a full raise amount (enough to reach 12 to 18 months).",
      },
      {
        heading: "Monitoring Progress Weekly",
        body: "Step 1: Set a calendar reminder to check the /intelligence page every Monday. Step 2: Note whether the Cash Runway card has moved up or down. Step 3: If it has improved by 0.2 months or more in a week, your actions are working — continue. Step 4: If it has stayed flat or declined, review what changed in the Burn Rate panel. Step 5: Update the Target Calculator in the runway panel with a goal of reaching 6 months (Healthy status) within a specific number of weeks. This gives you a clear milestone to track toward and makes the urgency concrete for your team.",
      },
    ],
    relatedSlugs: [
      "runway-status-levels-explained",
      "what-to-do-runway-under-1-month",
      "how-to-cut-costs-using-burn-data",
    ],
    faq: [
      {
        q: "Should I be honest with my team about the Warning status?",
        a: "Yes. Teams that understand the cash situation are better positioned to help find solutions and avoid making new commitments that increase burn.",
      },
      {
        q: "Is 3 months of runway ever acceptable?",
        a: "For a business that is cash flow positive within 60 days, 3 months is manageable. For a pre-revenue startup, 3 months is urgent. Context matters.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "what-to-do-runway-under-1-month",
    title: "What to Do When Your Runway Is Under 1 Month",
    description:
      "Emergency guidance for AskBiz users whose Cash Runway card shows Critical status — a prioritised list of immediate actions when cash runs out in under 30 days.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "runway under 1 month",
      "critical runway status",
      "emergency cash plan",
      "startup cash crisis",
      "AskBiz critical runway",
    ],
    keyTakeaways: [
      "Critical status means you have 30 days or fewer — every day without action is a day closer to insolvency.",
      "Immediate priorities are: halt discretionary spending, communicate with stakeholders, and pursue emergency capital.",
      "AskBiz data provides the exact figures needed for emergency conversations with lenders, investors, and creditors.",
    ],
    content: [
      {
        heading: "Confirm the Data Is Correct",
        body: "Before taking any emergency action, verify that the Critical status is based on accurate data. Step 1: Open the /intelligence page and note the red Critical badge on the Cash Runway card. Step 2: Click the card to open the runway panel. Step 3: Confirm the Cash Balance input reflects actual current bank balance — open the Cost Config Drawer and update it if needed. Step 4: Confirm the Daily Burn figure reflects actual current costs — check for any cost categories that have changed recently. A common error is an outdated cash balance causing a false Critical reading. If after verification the Critical status persists, proceed with emergency action.",
      },
      {
        heading: "Immediate Spend Halt",
        body: "Step 1: Identify all discretionary expenses in the Burn Rate panel's Channel Breakdown and Sensitivity Table. Step 2: Pause or cancel all non-essential variable costs immediately: pause Marketing and Ads campaigns, suspend non-critical Software/SaaS subscriptions, cancel pending Supplies orders, and postpone any planned Travel. Step 3: Update the Cost Config Drawer to reflect these pauses. Step 4: Observe the Daily Net Gain/Burn card — even a 20 percent burn reduction at this stage may add 5 to 7 days of runway, which can be enough to secure an emergency bridge. Step 5: Do not cut costs that would directly prevent revenue generation — for example, do not cancel the tools customers interact with.",
      },
      {
        heading: "Communicate with Key Stakeholders",
        body: "At Critical status, proactive communication is essential. Contact your key stakeholders — investors, board members, major creditors, and key employees — before the situation becomes public or payments are missed. Use the AskBiz runway panel to prepare a clear data-driven briefing: current cash balance, daily burn, days remaining, and what the Optimistic scenario looks like if cost cuts are made. Honest early communication gives stakeholders the opportunity to help and preserves relationships. Missed payments without notice are far more damaging than a difficult but transparent conversation.",
      },
      {
        heading: "Emergency Capital Options",
        body: "With under 30 days of runway, traditional fundraising timelines are not viable. Focus on the fastest capital sources available. Revenue advances or upfront payments: contact your top 3 to 5 customers and offer a discount in exchange for annual prepayment. Invoice factoring: if you have outstanding invoices, a factoring company can advance 70 to 90 percent of their value within days. Bridge loans: existing investors may provide a short-term bridge loan rather than let the business fail — this is often faster than a new-investor round. Emergency line of credit: if you have an existing banking relationship, a short-term credit facility may be available. Present your AskBiz runway data in all these conversations to demonstrate you have a clear picture of the situation.",
      },
      {
        heading: "Using AskBiz During the Crisis",
        body: "Step 1: Check the /intelligence page at least once per day during a Critical runway period. Step 2: Update the Cash Balance in the Cost Config Drawer each morning to reflect the actual bank balance so the runway countdown is accurate. Step 3: After each cost cut or revenue event, update the relevant fields and confirm the runway card improves. Step 4: Use the Ask AI button in the runway panel to get specific suggestions for your situation — describe your constraints explicitly, for example 'We cannot cut payroll, what else can we do to extend runway by 2 weeks?' Step 5: Once you have secured emergency capital, update the cash balance immediately and confirm the status badge moves out of Critical.",
      },
    ],
    relatedSlugs: [
      "runway-status-levels-explained",
      "what-to-do-runway-under-3-months",
      "how-cash-runway-is-calculated",
    ],
    faq: [
      {
        q: "Should I consider shutting down if runway is under 1 month?",
        a: "That depends on your specific circumstances, legal obligations, and options available. A business advisor or attorney should be consulted for decisions of this magnitude.",
      },
      {
        q: "Can I use AskBiz to show potential emergency investors?",
        a: "Yes — the runway panel, scenario table, and projection chart provide clear visual data suitable for urgent investor conversations.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-adding-cash-changes-runway",
    title: "How Adding Cash Balance Changes Your Runway Instantly",
    description:
      "Learn how updating your cash balance in AskBiz triggers an immediate runway recalculation and how to use this to model new funding scenarios.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "add cash balance AskBiz",
      "runway recalculation",
      "update cash balance",
      "funding scenario runway",
      "live runway update",
    ],
    keyTakeaways: [
      "Updating the cash balance in the Cost Config Drawer immediately recalculates the Cash Runway card.",
      "You can model a funding scenario by temporarily entering a higher cash balance to see the runway impact.",
      "The 12-month projection chart and scenario table both update when the balance changes.",
    ],
    content: [
      {
        heading: "Why Cash Balance Affects Runway Immediately",
        body: "In AskBiz, the Cash Runway formula is Cash Balance divided by Daily Burn. Both inputs live in the dashboard data store. The moment you update the Cash Balance input and save, the entire /intelligence page recalculates: the Cash Runway card updates its months figure, the status badge may change colour, the runway drill-down panel updates its formula section, the 4-Scenario Table recalculates all four scenarios, and the 12-Month Projection Chart redraws. This happens instantly with no page reload required.",
      },
      {
        heading: "Updating Your Cash Balance",
        body: "Step 1: On the /intelligence page, open the Cost Config Drawer by clicking the gear icon or the 'Configure Costs' button. Step 2: Locate the Cash Balance field at the top of the drawer. Step 3: Enter your current actual bank balance. Be precise — the figure should match your current available cash, not your total assets or accounts receivable. Step 4: Click Save. Step 5: Return to the /intelligence page and observe the Cash Runway card. The months figure and status badge will have updated to reflect the new balance.",
      },
      {
        heading: "Modelling a Funding Scenario",
        body: "Before receiving funding, use the cash balance field to model what the funding would do to your runway. Step 1: Note your current cash balance and runway. Step 2: Open the Cost Config Drawer and enter your current balance plus the anticipated funding amount. For example, if your balance is $20,000 and you expect to raise $80,000, enter $100,000. Step 3: Save and observe the updated Cash Runway card and drill-down panel. Step 4: Note the new scenario table values and projection chart. Step 5: After confirming the model, reverse the cash balance to your actual current figure unless the funding has already arrived.",
      },
      {
        heading: "When to Update Cash Balance in Practice",
        body: "Update your cash balance at a consistent cadence — weekly or bi-weekly is recommended for most businesses. Update it immediately after: receiving a customer payment that significantly changes your balance, completing a funding close, making a large one-time payment such as equipment or annual software fees, or withdrawing owner distributions. Keeping the balance current ensures that all runway calculations reflect reality rather than outdated assumptions. A stale cash balance is one of the most common causes of misleading runway figures.",
      },
      {
        heading: "Tracking Balance Trends Over Time",
        body: "Step 1: Record your cash balance at the same time each week or month by noting the figure you enter into the Cost Config Drawer. Step 2: Compare this week's balance to last week's. Step 3: If the balance is rising, your business is accumulating cash — check that the Daily Net Gain/Burn card reflects this positive trend. Step 4: If the balance is declining faster than your daily burn rate predicts, there may be unrecorded expenses. Open the Expenses tab and review recent entries. Step 5: Use the runway trend (improving or worsening status badge over consecutive weeks) as your headline indicator of financial health.",
      },
    ],
    relatedSlugs: [
      "how-to-set-cash-balance-askbiz",
      "how-cash-runway-is-calculated",
      "burn-rate-vs-runway-relationship",
    ],
    faq: [
      {
        q: "What should I enter as cash balance — bank balance or available cash?",
        a: "Enter your available operating cash — typically your business bank account balance minus any committed but unpaid obligations.",
      },
      {
        q: "Does AskBiz automatically sync with my bank to update cash balance?",
        a: "Cash balance is entered manually in the Cost Config Drawer. Automatic bank syncing depends on any integrations your account has configured.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "using-ask-ai-cash-positive-growth",
    title: "Using Ask AI When Cash Positive for Growth Planning",
    description:
      "Learn how the Ask AI feature shifts from runway extension advice to growth planning recommendations when your AskBiz dashboard shows a cash-positive status.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "Ask AI cash positive",
      "growth planning AskBiz",
      "surplus cash deployment",
      "cash positive AI advice",
      "AskBiz growth strategy",
    ],
    keyTakeaways: [
      "When cash positive, Ask AI shifts from survival-mode advice to surplus deployment recommendations.",
      "Key growth questions for Ask AI include reinvestment timing, reserve adequacy, and scaling opportunities.",
      "The Target Calculator and scenario table become tools for growth modelling rather than crisis management.",
    ],
    content: [
      {
        heading: "What Cash Positive Means in AskBiz",
        body: "When the Daily Net Gain/Burn card shows a green label reading 'Cash +', your daily revenue is exceeding your daily costs. Cash is accumulating rather than depleting. The Cash Runway card may show a very long runway or a surplus accumulation state. In this context, the question is no longer 'how long until we run out?' but rather 'what should we do with the surplus?' Ask AI is designed to recognise this shift in context and provide growth-oriented guidance instead of the cost-cutting and fundraising advice it would give in a burn scenario.",
      },
      {
        heading: "Opening Ask AI in the Cash-Positive Context",
        body: "Step 1: Navigate to the /intelligence page and confirm the Daily Net Gain/Burn card shows green 'Cash +' status. Step 2: Click the Cash Runway card to open the runway drill-down panel. Step 3: Scroll to the bottom of the panel and click the Ask AI button. Step 4: The AI will read your current surplus figure, cash balance, and cost data before responding. You do not need to provide these numbers in your prompt — they are loaded automatically.",
      },
      {
        heading: "Growth-Focused Prompts to Use",
        body: "Here are effective prompts when cash positive. Try: 'We are cash positive by $400 per day. How much of this surplus should we reinvest vs hold as reserve?' The AI will suggest a split based on your runway and growth stage. Try: 'We want to hire one additional team member. Can we afford it without dropping below Healthy runway status?' The AI will calculate the burn impact of a new hire against your current surplus. Try: 'We have been cash positive for 2 months. Is this the right time to increase marketing spend?' The AI will assess whether your cash buffer is sufficient to absorb a marketing ramp. Try: 'What is the maximum monthly investment we can make in growth while maintaining 6 months of runway?'",
      },
      {
        heading: "Using the Scenario Table for Growth Modelling",
        body: "Step 1: In the runway drill-down panel, locate the 4-Scenario Table. When cash positive, the Base scenario will show a very long or indefinite runway. Step 2: The Pessimistic scenario is particularly important here — it models what happens if revenue drops 15 to 20 percent. Step 3: Ensure the Pessimistic scenario still shows at least 3 months of runway before committing to significant new spending. Step 4: Use the Target Calculator to set a minimum cash reserve — for example, $30,000 — and confirm that your planned growth investments would not bring the balance below that floor. Step 5: Ask AI can help you interpret whether a specific growth investment is prudent given these constraints.",
      },
      {
        heading: "Reinvestment vs Reserve — The Core Decision",
        body: "The fundamental tension when cash positive is between deploying surplus for growth and holding it as a resilience buffer. Ask AI can provide a framework, but the decision depends on your risk tolerance and market conditions. As a starting point, consider this approach: maintain a minimum reserve equal to 6 months of current gross burn, and deploy everything above that floor into growth activities with the highest expected return. Use the Cost Config Drawer to model the cost of each growth option — add it as a temporary cost category, save, and observe the runway impact. If the runway stays above 6 months under the Pessimistic scenario, the investment is within a conservative risk boundary.",
      },
    ],
    relatedSlugs: [
      "what-does-cash-positive-mean-askbiz",
      "how-to-use-ask-ai-cfo-cards",
      "reading-runway-scenario-table",
    ],
    faq: [
      {
        q: "Does Ask AI know that we are cash positive, or do I need to tell it?",
        a: "Ask AI reads your live dashboard data, so it knows your current net gain figure and cash status without you needing to state it in your prompt.",
      },
      {
        q: "Can Ask AI help us decide between hiring and marketing as the next growth investment?",
        a: "Yes. Prompt it with both options and your current surplus figure. It will model the burn impact of each and compare them against your runway constraints.",
      },
    ],
    videoUrl: "",
  },

  // ─── Module 5 — Interactive Daily Chart (articles 41–50) ──────────────────

  {
    slug: "how-to-use-daily-cash-chart",
    title: "How to Use the Daily Cash Chart",
    description:
      "An overview of the AskBiz daily cash chart — what each bar represents, the colour coding, and how it fits into the /intelligence page layout.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "daily cash chart AskBiz",
      "cash chart bars",
      "green red bars cash",
      "AskBiz chart overview",
      "daily cash flow chart",
    ],
    keyTakeaways: [
      "Each bar in the chart represents one day; green bars are cash-positive days and red bars are cash-negative days.",
      "The chart sits below the metric cards on the /intelligence page and updates based on your stored transaction data.",
      "Three range buttons — 7D, 30D, and 90D — control how many days the chart displays.",
    ],
    content: [
      {
        heading: "Locating the Daily Cash Chart",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Scroll down past the four metric cards (Cash Balance, Daily Net Gain/Burn, Monthly Fixed Costs, Cash Runway) and any open drill-down panels. Step 3: You will see the Daily Cash Chart section with a title such as 'Daily Cash Flow' or 'Cash Activity'. The chart occupies a wide section of the page. Step 4: Above the chart are three range buttons labelled 7D, 30D, and 90D for selecting the time window. Step 5: Below the chart is the Show/Hide Rollup Table button for accessing the full daily data table.",
      },
      {
        heading: "What Each Bar Represents",
        body: "The chart is a bar chart where each bar represents one calendar day. The height of the bar indicates the magnitude of the net cash flow for that day — a taller bar means a larger movement. Green bars represent days where cash inflow exceeded outflow (net positive days). Red bars represent days where cash outflow exceeded inflow (net negative days). The horizontal axis shows dates and the vertical axis shows the net cash amount in your currency. Days with zero net movement appear as a thin neutral line at the baseline.",
      },
      {
        heading: "How the Chart Data Is Generated",
        body: "The daily chart draws from the same data store that powers the metric cards. Each day's bar height is calculated from the total inflows minus total outflows recorded for that day in your expense and transaction data. If you have entered expenses manually through the Expenses tab or via the AI Receipt Scanner, those entries contribute to the outflow side of each day's bar. Revenue entries or positive transactions contribute to the inflow side. Days with no entries at all will appear as flat or absent bars depending on whether the period had prior data.",
      },
      {
        heading: "The Colour Coding Logic",
        body: "Green bars indicate that for that specific day, the total recorded inflow was greater than the total recorded outflow. This does not necessarily mean the business was profitable — it means more cash came in than went out on that single day. Red bars indicate the reverse: more cash went out than came in. A string of red bars signals a persistent burn period. A mix of green and red bars is normal for most businesses. The pattern of which days are green vs red can reveal useful information about payment timing, customer payment cycles, or spending patterns.",
      },
      {
        heading: "Using the Chart for a Quick Health Check",
        body: "Step 1: Open the /intelligence page and scroll to the chart. Step 2: With the default range selected (typically 30D), scan the chart visually. Step 3: Count roughly the proportion of green bars versus red bars. More green than red generally aligns with a positive net burn position. Step 4: Note whether the recent bars (rightmost, most recent) are trending greener or redder compared to older bars on the left. Step 5: Click on any specific bar that looks unusually tall or short to open the Day Detail panel for that date, which will show the inflow, outflow, and net figures.",
      },
    ],
    relatedSlugs: [
      "switching-7d-30d-90d-chart-views",
      "how-to-hover-chart-bar-tooltip",
      "how-to-click-chart-bar-day-detail",
    ],
    faq: [
      {
        q: "Why are some days missing bars entirely?",
        a: "Days with no recorded transactions in the data store will show no bar. Adding expense entries for those days will populate their bars.",
      },
      {
        q: "Does the chart update immediately when I add a new expense?",
        a: "Yes. Adding a new expense entry updates the relevant day's bar on the chart in real time.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "switching-7d-30d-90d-chart-views",
    title: "Switching Between 7-Day, 30-Day, and 90-Day Views",
    description:
      "Learn how to use the 7D, 30D, and 90D range buttons on the AskBiz daily cash chart and when each view is most useful for financial analysis.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "7D 30D 90D chart view",
      "AskBiz chart range",
      "switch chart range",
      "daily cash chart views",
      "90 day cash view",
    ],
    keyTakeaways: [
      "The 7D view is best for this week's daily detail; 30D for monthly patterns; 90D for seasonal trends.",
      "Switching range does not lose data — all three views draw from the same underlying store.",
      "The selected range also determines the period average used in the Day Detail comparison badges.",
    ],
    content: [
      {
        heading: "Finding the Range Buttons",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Scroll to the Daily Cash Chart section. Step 3: Look for the three range buttons positioned above the chart area, typically in the top-right corner of the chart section. The buttons are labelled '7D', '30D', and '90D'. Step 4: The currently active range is highlighted — it will appear with a darker background or underline compared to the inactive buttons.",
      },
      {
        heading: "The 7-Day View",
        body: "Clicking 7D switches the chart to show only the last 7 calendar days. Each of the 7 bars represents one day, and the bars are wider because there are fewer of them, making individual day detail easier to see. Use the 7D view when you want to review the current week's daily cash movements in detail, when you have just entered several new expenses and want to see the precise day-level impact, or when investigating a specific recent event such as a large payment or unexpected expense. The period average shown in Day Detail comparison badges updates to reflect the 7-day average when this view is active.",
      },
      {
        heading: "The 30-Day View",
        body: "Clicking 30D switches the chart to show the last 30 calendar days. This is the default view for most users and provides the most balanced picture of recent performance. Use the 30D view for your standard weekly financial review, when assessing whether the business is trending toward or away from cash positive over the past month, and when comparing the current month's pattern to the previous month. The 30D view is also the most useful when presenting financial performance to a co-founder, investor, or advisor — it gives enough context without being overwhelming.",
      },
      {
        heading: "The 90-Day View",
        body: "Clicking 90D switches the chart to show the last 90 calendar days (approximately 3 months). In this view individual bars are narrower due to the larger number of days displayed, but the broader pattern becomes visible. Use the 90D view to identify seasonal trends — for example, whether revenue spikes in certain months, whether there are recurring slow periods, or whether burn is gradually increasing or decreasing over the quarter. The 90D view is the best setting for quarterly reviews and for identifying structural patterns that are invisible in shorter windows.",
      },
      {
        heading: "Switching Views and What Changes",
        body: "Step 1: Click 7D, 30D, or 90D to switch the view. The chart redraws instantly. Step 2: The bars resize to fit the selected number of days in the available chart width. Step 3: The horizontal axis labels update to show the relevant date range. Step 4: If you have a Day Detail panel open from a previous bar click, it will remain open as you switch ranges, but the period average comparison badge will update to reflect the new range's average. Step 5: The range selection does not affect any other part of the /intelligence page — the metric cards and drill-down panels are not impacted by the chart range.",
      },
    ],
    relatedSlugs: [
      "how-to-use-daily-cash-chart",
      "how-to-hover-chart-bar-tooltip",
      "using-chart-patterns-seasonal-trends",
    ],
    faq: [
      {
        q: "Can I set a custom date range other than 7D, 30D, or 90D?",
        a: "Custom date ranges are not currently available. The three preset ranges cover most use cases.",
      },
      {
        q: "Does switching to 90D slow down the chart?",
        a: "No, the chart renders from data already loaded in the store and switches instantly regardless of range.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-hover-chart-bar-tooltip",
    title: "How to Hover Over a Bar to See a Day Tooltip",
    description:
      "Learn how the AskBiz daily cash chart tooltip works — what information appears on hover and how to use it without opening the full Day Detail panel.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "chart bar tooltip AskBiz",
      "hover tooltip cash chart",
      "day tooltip inflow outflow",
      "AskBiz chart hover",
      "daily chart tooltip",
    ],
    keyTakeaways: [
      "Hovering over any bar shows a tooltip with the date, inflow, outflow, and net for that day.",
      "The tooltip is a quick preview — click the bar to open the full Day Detail panel with more context.",
      "Tooltips appear on both desktop hover and on mobile tap.",
    ],
    content: [
      {
        heading: "What Is the Tooltip",
        body: "The tooltip is a small popup that appears above a chart bar when you move your mouse cursor over it. It provides a quick summary of that day's cash data without navigating away from the chart or opening additional panels. Tooltips are designed for fast scanning — you can hover across multiple bars in sequence to quickly compare days without any clicking.",
      },
      {
        heading: "How to Trigger the Tooltip",
        body: "Step 1: Navigate to the /intelligence page and scroll to the Daily Cash Chart. Step 2: Move your mouse cursor over any bar in the chart. Step 3: After a brief moment (usually less than half a second), a tooltip box appears above the bar. Step 4: The tooltip remains visible as long as your cursor is over the bar. Step 5: Move your cursor to a different bar and the tooltip updates instantly to show that bar's data. Step 6: Move the cursor off the chart entirely to dismiss the tooltip.",
      },
      {
        heading: "What the Tooltip Contains",
        body: "The tooltip contains four pieces of information. First is the date, displayed in a readable format such as 'Mon Jun 2' or '02/06'. Second is the Inflow figure — the total cash received on that day from all recorded sources. Third is the Outflow figure — the total cash paid out on that day across all expense entries. Fourth is the Net figure — Inflow minus Outflow, displayed in green if positive or red if negative. These four data points are sufficient for a quick assessment of any individual day without needing to open the Day Detail panel.",
      },
      {
        heading: "Tooltip vs Day Detail — When to Use Each",
        body: "Use the tooltip when you want a quick number for a specific day without interrupting your chart scanning. Use the Day Detail panel (accessed by clicking the bar) when you want deeper context — specifically the comparison to the period average, the 7-day rolling average comparison, and the channel proxy breakdown. For a rapid scan of the last 30 days, hover across bars sequentially to find outlier days. Once you spot a day that looks unusual, click that bar to open Day Detail and understand why it was different.",
      },
      {
        heading: "Mobile Touch Behaviour",
        body: "On a mobile device or tablet, the hover tooltip behaviour is triggered by tapping and holding on a bar rather than hovering. Step 1: Open the /intelligence page in your mobile browser. Step 2: Tap and hold on a chart bar. Step 3: The tooltip appears after a brief press. Step 4: Lift your finger to dismiss the tooltip, or tap once (without holding) to open the Day Detail panel directly. This means on mobile, a short tap opens Day Detail and a tap-and-hold shows the tooltip.",
      },
    ],
    relatedSlugs: [
      "how-to-use-daily-cash-chart",
      "how-to-click-chart-bar-day-detail",
      "reading-day-detail-inflow-outflow-net",
    ],
    faq: [
      {
        q: "Can I see the tooltip and the Day Detail panel at the same time?",
        a: "No. The tooltip dismisses when you click the bar to open Day Detail. They serve different levels of detail and are not shown simultaneously.",
      },
      {
        q: "Why does my tooltip show zero for both inflow and outflow on some days?",
        a: "Days with no expense or transaction entries in the store will show zero. Add entries for those days to populate the tooltip data.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-click-chart-bar-day-detail",
    title: "How to Click a Chart Bar to Open Day Detail",
    description:
      "Step-by-step guide to clicking an AskBiz daily cash chart bar to open the Day Detail panel, what you see inside, and how to close or reset the view.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "click chart bar AskBiz",
      "open day detail panel",
      "chart bar click tutorial",
      "AskBiz day detail",
      "cash chart interaction",
    ],
    keyTakeaways: [
      "Clicking any bar in the daily cash chart opens the Day Detail panel below the chart.",
      "Day Detail shows inflow, outflow, net, comparison to period average, and 7-day rolling average.",
      "Click the same bar again or the close button to collapse the Day Detail panel.",
    ],
    content: [
      {
        heading: "How to Click a Bar",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Scroll to the Daily Cash Chart section. Step 3: Identify the bar you want to investigate — hover to see the tooltip first if you want to confirm which day it represents. Step 4: Click the bar with a single click. Step 5: The Day Detail panel opens below the chart with information specific to the clicked day. The clicked bar may become highlighted — slightly brighter or outlined — to indicate it is the selected bar.",
      },
      {
        heading: "What Opens — The Day Detail Panel",
        body: "The Day Detail panel appears as an expanded section directly below the chart. At the top of the panel is the date of the selected day. Below that are three primary figures: Inflow (total cash received that day), Outflow (total cash paid out that day), and Net (Inflow minus Outflow). Next to or below the net figure are two comparison badges: one comparing this day to the period average and one comparing it to the 7-day rolling average. At the bottom of the panel is a Channel Proxy section showing which expense categories or revenue channels contributed to that day's figures.",
      },
      {
        heading: "Navigating Between Days",
        body: "You do not need to close the Day Detail panel to look at a different day. Step 1: While the Day Detail panel is open, click a different bar in the chart. Step 2: The Day Detail panel updates instantly to show data for the newly clicked bar. Step 3: The previously selected bar returns to its normal appearance and the new bar becomes highlighted. This makes it easy to compare adjacent days or investigate multiple outliers in sequence.",
      },
      {
        heading: "Closing and Resetting the Day Detail Panel",
        body: "Step 1: To close the Day Detail panel, click the same bar that opened it. The panel collapses and the bar returns to its default state. Step 2: Alternatively, look for a close button (typically an X icon) in the top-right corner of the Day Detail panel and click it. Step 3: You can also close the panel by clicking anywhere outside the chart area, depending on the implementation. Step 4: After closing, the chart returns to its default state with no bar highlighted and no day selected.",
      },
      {
        heading: "When to Use Day Detail",
        body: "Use Day Detail when a bar stands out visually as unusually tall or unusually short and you want to understand why. Use it when preparing for a financial review and you want to explain a specific day's performance. Use it when you notice a recurring pattern — for example, every Monday is a tall red bar — and you want to check which outflows are driving it. Use it after adding new expense entries to confirm they have registered correctly on the expected date. The Day Detail panel is the most granular view available in the chart and complements the higher-level view provided by the metric cards.",
      },
    ],
    relatedSlugs: [
      "how-to-hover-chart-bar-tooltip",
      "reading-day-detail-inflow-outflow-net",
      "comparing-day-to-period-average",
    ],
    faq: [
      {
        q: "Can I open Day Detail for multiple days at the same time?",
        a: "No. Only one day's detail is shown at a time. Clicking a new bar replaces the previous Day Detail with the new day's data.",
      },
      {
        q: "Is Day Detail available in all three chart range views (7D, 30D, 90D)?",
        a: "Yes. Clicking any bar in any range view opens the Day Detail panel for that day.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "reading-day-detail-inflow-outflow-net",
    title: "Reading Day Detail: Inflow, Outflow, and Net",
    description:
      "Understand what each figure in the AskBiz Day Detail panel means — how inflow, outflow, and net are defined and derived from your stored data.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "day detail inflow outflow",
      "AskBiz net cash day",
      "reading day detail panel",
      "inflow outflow definition AskBiz",
      "daily net cash figure",
    ],
    keyTakeaways: [
      "Inflow is total cash received on a day; Outflow is total cash paid; Net is Inflow minus Outflow.",
      "These figures are derived directly from your expense and transaction entries in the AskBiz data store.",
      "A green Net figure means the day was cash positive; a red Net figure means cash was consumed that day.",
    ],
    content: [
      {
        heading: "Opening Day Detail",
        body: "Step 1: Navigate to the /intelligence page and scroll to the Daily Cash Chart. Step 2: Click any bar in the chart to open the Day Detail panel below the chart. Step 3: The panel header displays the selected date, followed by three labelled figures: Inflow, Outflow, and Net.",
      },
      {
        heading: "Inflow — What It Means",
        body: "Inflow is the total amount of cash received on the selected day from all recorded sources. In AskBiz, inflow is captured through transaction entries that are classified as income or receipts — for example, customer payments, sales revenue, refunds received, or any positive cash event recorded in the Expenses tab or through an integration. Inflow does not include amounts owed to you (accounts receivable) unless a payment has actually been recorded. If your business received $1,500 from a customer and $200 from a refund on the same day, the inflow figure would be $1,700.",
      },
      {
        heading: "Outflow — What It Means",
        body: "Outflow is the total amount of cash paid out on the selected day across all expense entries. This includes all expense categories recorded for that day: Rent/Lease, Payroll, Software/SaaS, Marketing and Ads, Supplies, and all other categories in the 14-category system. Expenses entered manually through the Expenses tab or captured via the AI Receipt Scanner are included in outflow. For example, if a $400 payroll run and a $80 software subscription both processed on the same day, the outflow would be $480.",
      },
      {
        heading: "Net — Inflow Minus Outflow",
        body: "Net is simply Inflow minus Outflow. It represents the day's cash position change. A positive net (green) means the day added cash to your balance. A negative net (red) means the day consumed cash. For example, if inflow was $1,200 and outflow was $800, net is +$400. If inflow was $200 and outflow was $600, net is -$400. The Net figure in Day Detail is the same underlying calculation as the Daily Net Gain/Burn card, but applied specifically to the selected historical day rather than a current-period average.",
      },
      {
        heading: "How These Figures Connect to the Larger Dashboard",
        body: "The inflow, outflow, and net figures in Day Detail come from the same data store as all other /intelligence page metrics. When you add a new expense in the Expenses tab, it increases the outflow for that expense's date in the Day Detail panel and contributes to the daily burn average used by the metric cards. Step 1: Add an expense in the Expenses tab and set its date to today. Step 2: Return to the chart and click today's bar to open Day Detail. Step 3: Verify that the outflow figure has increased by the amount of the expense you just added. This confirms that the Day Detail panel is reading from live data and that your expense entries are being captured correctly.",
      },
    ],
    relatedSlugs: [
      "how-to-click-chart-bar-day-detail",
      "comparing-day-to-period-average",
      "how-to-use-daily-cash-chart",
    ],
    faq: [
      {
        q: "Why does my inflow show as zero even on days I received payments?",
        a: "Inflow only reflects payments that have been entered as transactions in AskBiz. If payments are not recorded, they will not appear in Day Detail.",
      },
      {
        q: "Is the Net figure in Day Detail the same as the bar height in the chart?",
        a: "Yes. The bar height corresponds to the Net figure for that day — taller bars have larger absolute net values.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "comparing-day-to-period-average",
    title: "Comparing a Day to Its Period Average",
    description:
      "Learn how to use the vs-period-average comparison badge in the AskBiz Day Detail panel to understand whether a day was above or below normal for the selected range.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: [
      "period average comparison AskBiz",
      "vs period average badge",
      "day detail period average",
      "AskBiz above below average",
      "daily cash period comparison",
    ],
    keyTakeaways: [
      "The vs-period-average badge compares a single day's net to the average net across the active range (7D, 30D, or 90D).",
      "A positive percentage means this day outperformed the period average; a negative means it underperformed.",
      "Changing the chart range changes the period average, so the same day can appear differently across views.",
    ],
    content: [
      {
        heading: "What Is the Period Average Comparison",
        body: "The period average comparison is a badge displayed in the Day Detail panel next to or below the Net figure. It shows how the selected day's net cash flow compares to the average net cash flow across all days in the currently selected chart range. For example, if the 30D range is active and the average daily net across the last 30 days is negative $200, a day with negative $50 net would show a badge reading something like '+75% vs period avg' — indicating the day was 75 percent better than average. A day with negative $400 net would show '-100% vs period avg'.",
      },
      {
        heading: "How the Period Average Is Calculated",
        body: "The period average is the sum of all daily net figures within the active range divided by the number of days in that range. Step 1: If 30D is the active range, AskBiz sums the net cash flow for each of the last 30 days. Step 2: It divides by 30. Step 3: The result is the period average net cash per day. Step 4: The selected day's net is then compared to this average to produce the percentage badge. Days with no data (zero entries) are included in the average as zero values, which means sparse data can skew the average downward.",
      },
      {
        heading: "Why the Range Matters",
        body: "Because the period average changes with the selected range, the same day can show different comparison badges depending on whether you are in 7D, 30D, or 90D view. Step 1: Click a bar in 7D view and note the vs-period-avg badge value. Step 2: Switch to 30D view and click the same bar. The badge value may be different because the average is now calculated over 30 days instead of 7. Step 3: Switch to 90D and repeat. This flexibility lets you benchmark a day against short-term or long-term norms depending on your analysis goal.",
      },
      {
        heading: "Interpreting the Badge Practically",
        body: "Use the vs-period-average badge to quickly categorise days as routine, good, or bad relative to your business's recent norm. A badge showing plus 50 percent or more indicates an exceptionally good day — investigate what drove it (a large customer payment, a low-expense day, or both). A badge showing minus 50 percent or more indicates a significantly worse-than-normal day — check the Channel Proxy section of Day Detail to identify the high outflow category. A badge near zero (plus or minus 10 to 15 percent) indicates a day close to normal. These categories help you focus your attention on meaningful outliers rather than normal variation.",
      },
      {
        heading: "Combining Period Average with Other Comparisons",
        body: "Step 1: When a day shows a poor vs-period-average badge, also check the vs-7-day-rolling-average badge in the same Day Detail panel. Step 2: If both badges are negative, the day was bad relative to both short-term and medium-term norms — a reliable signal of an outlier. Step 3: If only the period-average badge is negative but the 7-day rolling average badge is positive or neutral, the day may be normal for the recent week but below the longer-period average — possibly indicating a short-term improvement in performance. Step 4: Use this combination to distinguish between genuine outliers and days that are bad only relative to a strong recent run.",
      },
    ],
    relatedSlugs: [
      "reading-day-detail-inflow-outflow-net",
      "comparing-day-7-day-rolling-average",
      "how-to-click-chart-bar-day-detail",
    ],
    faq: [
      {
        q: "Is the period average the same as a moving average?",
        a: "No. The period average is a simple arithmetic mean of all days in the selected range. A moving average recalculates for each new data point. The 7-day rolling average comparison is closer to a moving average.",
      },
      {
        q: "What if the period average is zero because I have no data?",
        a: "With no data, the comparison badge cannot produce a meaningful percentage. Ensure you have expense and transaction entries covering the selected range.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "comparing-day-7-day-rolling-average",
    title: "Comparing a Day to Its 7-Day Rolling Average",
    description:
      "Learn how the 7-day rolling average comparison in AskBiz Day Detail helps smooth out volatility and identify genuine trend changes in daily cash flow.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: [
      "7-day rolling average cash",
      "AskBiz rolling average comparison",
      "smooth cash flow volatility",
      "day detail 7-day average",
      "rolling average badge",
    ],
    keyTakeaways: [
      "The 7-day rolling average comparison shows whether a day is better or worse than the 7 days surrounding it.",
      "Rolling averages reduce the impact of one-off events and reveal genuine trend direction.",
      "Use this badge alongside the period average to distinguish short-term noise from structural changes.",
    ],
    content: [
      {
        heading: "What Is a 7-Day Rolling Average",
        body: "A 7-day rolling average is calculated by averaging the net cash flow values for a 7-day window centered on (or ending at) the selected day. For example, for a day at the end of the window: it averages the net figures for that day and the 6 days before it. This rolling approach means the average moves along the timeline with you — each day has its own rolling average based on its surrounding 7-day context. Rolling averages are commonly used in financial analysis to remove day-to-day noise and reveal the underlying trend.",
      },
      {
        heading: "Finding the 7-Day Rolling Average Badge",
        body: "Step 1: Navigate to the /intelligence page and scroll to the Daily Cash Chart. Step 2: Click any bar to open the Day Detail panel. Step 3: In the Day Detail panel, look for two comparison badges. The first is labelled 'vs period avg' and the second is labelled 'vs 7-day avg' or similar. Step 4: The 7-day rolling average badge shows the percentage by which this day's net cash flow differs from its own 7-day rolling average. A positive percentage means the day outperformed its local 7-day average; negative means it underperformed.",
      },
      {
        heading: "Why Use Rolling Average Over Period Average",
        body: "The period average reflects performance relative to a fixed window (7, 30, or 90 days). The rolling average reflects performance relative to the local context around that specific day. This distinction matters when your business has been improving or declining rapidly. For example, if your business was losing $500 per day last month but is now losing only $200 per day, a day with negative $200 net would look good compared to the period average (much better than the $500 average from earlier in the period) but might look neutral or even slightly poor relative to its rolling average if the 7 nearby days also averaged negative $200. The rolling average captures the immediate local trend more sensitively.",
      },
      {
        heading: "Identifying Genuine Outliers with Rolling Average",
        body: "Step 1: Click a bar that appears unusually tall or short in the chart. Step 2: Check the vs-7-day-avg badge. If it shows a large positive or negative percentage (more than plus or minus 40 percent), the day was meaningfully different from its local context — a true outlier. Step 3: Look at the Channel Proxy section of Day Detail to identify which inflow or outflow category drove the deviation. Step 4: If a day is an outlier in both the period average and the rolling average badges simultaneously, it is very likely a significant event worth investigating. Step 5: If a day is an outlier in only one badge, use the context of both to understand whether it is a trend signal or a one-off anomaly.",
      },
      {
        heading: "Using Rolling Averages to Spot Trend Reversals",
        body: "When reviewing the 90D chart range, click several bars at weekly intervals. If the vs-7-day-avg badge for recent days is consistently positive while the same badge for earlier days was consistently negative, this signals a trend reversal — the business has shifted from below-average to above-average performance relative to its own local context. This is one of the earliest signals available in the AskBiz chart that financial performance is improving, often visible before the metric cards show a meaningful change in the monthly averages.",
      },
    ],
    relatedSlugs: [
      "comparing-day-to-period-average",
      "reading-day-detail-inflow-outflow-net",
      "identifying-best-worst-days-chart",
    ],
    faq: [
      {
        q: "Does the 7-day rolling average ever differ from the period average badge?",
        a: "Yes, frequently. They are different calculations. The rolling average is local to that day; the period average is fixed across the whole selected range.",
      },
      {
        q: "Why does the 7-day rolling average badge sometimes not appear?",
        a: "If fewer than 7 days of data exist in the store, the rolling average cannot be calculated and the badge may be hidden.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "how-to-toggle-daily-rollup-table",
    title: "How to Toggle the Full Daily Rollup Table",
    description:
      "Learn how to use the Show/Hide Rollup button in AskBiz to view the complete daily cash flow table for the selected chart range.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 2,
    keywords: [
      "daily rollup table AskBiz",
      "show hide rollup",
      "cash flow table toggle",
      "AskBiz daily table",
      "rollup table tutorial",
    ],
    keyTakeaways: [
      "The Show Rollup button below the daily chart expands a table listing every day in the selected range.",
      "Each table row shows the date, inflow, outflow, and net for that day.",
      "The rollup table is the fastest way to see all days at once without clicking individual bars.",
    ],
    content: [
      {
        heading: "Finding the Rollup Toggle Button",
        body: "Step 1: Navigate to the /intelligence page in AskBiz. Step 2: Scroll down to the Daily Cash Chart section. Step 3: Below the chart (and below any open Day Detail panel) you will see a button labelled 'Show Rollup' or 'Show Daily Table'. This button is a toggle — clicking it once shows the table and clicking it again hides it.",
      },
      {
        heading: "What the Rollup Table Shows",
        body: "When expanded, the rollup table displays a row for each day in the currently selected chart range. Each row contains four columns: Date (the calendar date), Inflow (total cash received that day), Outflow (total cash paid out that day), and Net (Inflow minus Outflow). Days where net is positive are displayed with the net value in green text; days where net is negative are shown in red. The rows are ordered from most recent date at the top to oldest at the bottom, or vice versa depending on your configuration.",
      },
      {
        heading: "How the Table Changes with Chart Range",
        body: "The rollup table always reflects the active chart range. Step 1: With 7D selected, click Show Rollup. The table shows 7 rows — one per day. Step 2: Switch to 30D. The table updates immediately to show 30 rows. Step 3: Switch to 90D. The table expands to approximately 90 rows. You may need to scroll within the table section to see all rows. Step 4: The rollup table and the chart always stay in sync — the same data appears in both views.",
      },
      {
        heading: "Reading the Table vs Using the Chart",
        body: "The chart provides a visual pattern overview — useful for spotting trends, outliers, and relative performance at a glance. The rollup table provides exact numbers for every day — useful when you need to find a specific day's figures, copy them for a report, or scan for days where outflow exceeded a threshold. Use the chart to identify interesting days visually, then use the rollup table to confirm the exact figures. You can also use the rollup table as a quick audit tool to check that all days in the range have recorded transactions and that no days have unexpectedly high outflows.",
      },
      {
        heading: "Hiding the Table",
        body: "Step 1: When you are finished reviewing the rollup table, click the button again — it will now read 'Hide Rollup' or 'Hide Daily Table'. Step 2: The table collapses and the page returns to showing only the chart and the range buttons above it. Step 3: The table state (shown or hidden) does not persist between page sessions — each time you load the /intelligence page, the table starts in the hidden state.",
      },
    ],
    relatedSlugs: [
      "how-to-use-daily-cash-chart",
      "switching-7d-30d-90d-chart-views",
      "reading-day-detail-inflow-outflow-net",
    ],
    faq: [
      {
        q: "Can I export the rollup table to a spreadsheet?",
        a: "Direct export is not currently a built-in feature. You can select and copy the table content from your browser for use in a spreadsheet.",
      },
      {
        q: "Is the rollup table sortable by column?",
        a: "Column sorting depends on the current platform version. Check the table headers for sort arrows — clicking a header column typically toggles sort order.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "identifying-best-worst-days-chart",
    title: "Identifying Best and Worst Performing Days Visually",
    description:
      "Learn how to visually identify your best and worst cash flow days in the AskBiz daily chart and how to correlate them with business events.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: [
      "best worst days cash chart",
      "identify outlier days AskBiz",
      "cash flow visual analysis",
      "tallest bar cash chart",
      "worst performing day AskBiz",
    ],
    keyTakeaways: [
      "The tallest green bar in the chart is your best net-positive day in the range; the tallest red bar is your worst.",
      "Cross-referencing best and worst days with marketing campaigns, events, or payroll cycles reveals actionable patterns.",
      "The Burn Rate panel's Best Day and Worst Day statistics confirm the chart's visual findings with precise figures.",
    ],
    content: [
      {
        heading: "Reading the Chart for Visual Outliers",
        body: "Step 1: Navigate to the /intelligence page and scroll to the Daily Cash Chart. Step 2: Select 30D for a balanced view. Step 3: Scan the chart from left to right. Your eye should naturally be drawn to the tallest bars. Step 4: The tallest green bar (upward) represents the single best net-positive day in the range — the day when inflow exceeded outflow by the greatest amount. Step 5: The tallest red bar (downward) represents the single worst net-negative day — the day when outflow exceeded inflow by the most. These two bars are your starting points for performance investigation.",
      },
      {
        heading: "Getting the Exact Figures",
        body: "Step 1: Hover over the tallest green bar to see the tooltip with the exact date, inflow, outflow, and net. Step 2: Click the bar to open Day Detail for that day. Confirm the net figure and note the Channel Proxy section to see which revenue source drove the high inflow. Step 3: Repeat for the tallest red bar — hover for the date, click for Day Detail, and check the Channel Proxy for which expense category drove the high outflow. Step 4: Cross-reference these findings with the Burn Rate panel's Best Day and Worst Day statistics at the top of the burn panel — these stats should match the chart's visual outliers.",
      },
      {
        heading: "Correlating Best Days with Business Events",
        body: "Understanding what caused your best days is just as valuable as understanding your worst. Common drivers of a best day include a large customer payment clearing, a successful promotional campaign generating multiple sales, or a day with unusually low expenses (no recurring charges). Step 1: Note the date of the best day from the chart. Step 2: Check your business records or calendar for that date — was there a marketing email sent, a product launch, a customer follow-up, or an invoice payment due? Step 3: If a specific action reliably drives high-inflow days, document it and repeat it. This is how daily cash data translates into actionable marketing and sales insights.",
      },
      {
        heading: "Correlating Worst Days with Recurring Costs",
        body: "Worst days are often driven by recurring costs that land on predictable dates — monthly payroll, quarterly insurance, annual software renewals. Step 1: Note the date of the worst day. Step 2: In the Day Detail panel, check the Channel Proxy for the dominant outflow category. Step 3: If it is Payroll, confirm that payroll always runs on this date. Step 4: Open the rollup table and look for the same date in the previous month — if another large red bar appears on the same day of the month, it confirms a recurring pattern. Step 5: Knowing these dates in advance allows you to plan — ensure your cash balance is highest just before predictable high-outflow days.",
      },
      {
        heading: "Using 90D View for a Broader Pattern",
        body: "Step 1: Switch to the 90D chart range. Step 2: Identify the top 3 green and top 3 red bars across the 90-day window. Step 3: Note whether the best and worst days cluster around specific periods — for example, end of month, beginning of month, or after weekends. Step 4: If best days cluster at month-end, this likely reflects when customers pay invoices. Step 5: If worst days cluster at the start of the month, this likely reflects when fixed costs such as rent and payroll are processed. Step 6: Understanding this monthly rhythm helps you anticipate cash position throughout the month rather than reacting to it.",
      },
    ],
    relatedSlugs: [
      "understanding-best-worst-day-statistics",
      "comparing-day-to-period-average",
      "using-chart-patterns-seasonal-trends",
    ],
    faq: [
      {
        q: "Does AskBiz automatically flag the best and worst days in the chart?",
        a: "The Best Day and Worst Day statistics in the Burn Rate panel identify these numerically. The chart itself requires visual scanning to identify them.",
      },
      {
        q: "What if all bars are roughly the same height?",
        a: "Uniform bars indicate consistent daily cash flow — which is actually a sign of stable, predictable operations. Look for the Burn Rate panel's Best Day and Worst Day stats to see the range of variation.",
      },
    ],
    videoUrl: "",
  },

  {
    slug: "using-chart-patterns-seasonal-trends",
    title: "Using Chart Patterns to Spot Seasonal Trends",
    description:
      "Learn how to use the 90-day view of the AskBiz daily cash chart to identify recurring seasonal patterns, spikes, and dips in your business cash flow.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: [
      "seasonal cash flow trends",
      "90 day chart patterns",
      "AskBiz seasonal analysis",
      "recurring cash spikes",
      "cash flow seasonality",
    ],
    keyTakeaways: [
      "The 90D chart range reveals multi-month patterns that are invisible in 7D or 30D views.",
      "Recurring spikes and dips at consistent intervals often correspond to billing cycles, payroll, or seasonal demand.",
      "Identifying seasonal patterns enables proactive cash buffer planning before predictable low-cash periods.",
    ],
    content: [
      {
        heading: "Why 90 Days Is the Right Timeframe for Seasonal Analysis",
        body: "Seasonal patterns require at least 2 to 3 months of data to become visible. A 7-day chart can tell you about this week; a 30-day chart about this month. But recurring monthly cycles, quarterly billing patterns, and seasonal demand shifts only become apparent when you can see 3 or more months side by side. The 90D view in AskBiz is the only built-in range that provides this perspective. Step 1: Navigate to the /intelligence page and scroll to the Daily Cash Chart. Step 2: Click the 90D button to switch to the 90-day view. Step 3: Allow the chart to redraw, then take a moment to scan the full width before zooming into specific bars.",
      },
      {
        heading: "Identifying Recurring Spikes",
        body: "A recurring spike is a tall green bar that appears at a consistent interval — every 7 days, every 14 days, or every 30 days. Step 1: Look for the tallest green bars in the 90D chart. Step 2: Note the dates of the top 3 or 4 tallest green bars. Step 3: Check whether these dates are evenly spaced. If they fall on or around the same day of each month (for example, the 1st, the 1st, and the 1st), it suggests monthly invoice payments are clustering on that date. Step 4: If spikes appear every 7 days, it may reflect a weekly settlement from a payment processor or a recurring weekly revenue event. Identifying this rhythm helps you predict your next high-inflow day.",
      },
      {
        heading: "Identifying Recurring Dips",
        body: "A recurring dip is a tall red bar that appears at a consistent interval, indicating predictable high-outflow days. Step 1: Note the dates of the top 3 to 4 tallest red bars in the 90D view. Step 2: Check whether they cluster at the same point in each month — for example, the 25th of each month for payroll, or the 1st of each month for rent. Step 3: If dips appear at irregular intervals, investigate whether they correspond to supplier invoices, quarterly tax payments, or insurance renewals. Step 4: Once you can predict when dips will occur, you can ensure your cash balance is highest just before those dates by accelerating collections or deferring discretionary spending.",
      },
      {
        heading: "Month-Over-Month Trend Direction",
        body: "Beyond individual spikes and dips, look for the overall trend across the 90D window. Step 1: Visually divide the chart into three roughly equal sections — the first 30 days (oldest), middle 30 days, and the last 30 days (most recent). Step 2: Compare the general height and proportion of green vs red bars in each section. Step 3: If the most recent section has more green bars or taller green bars than the oldest section, cash flow is improving over the 90-day period. Step 4: If the most recent section is redder or the bars are generally smaller, cash flow is deteriorating. Step 5: Confirm your visual assessment by checking the Daily Net Gain/Burn card trend — has the net figure been moving in the direction suggested by the chart?",
      },
      {
        heading: "Planning Ahead Using Identified Seasonal Patterns",
        body: "Step 1: Using the patterns identified in the 90D chart, create a simple calendar noting the expected high-outflow weeks or days for the next 3 months. Step 2: For each high-outflow period, ensure your cash balance goal (set in the Target Calculator of the runway panel) is calibrated to absorb the expected outflow without triggering a status badge change. Step 3: Schedule any major discretionary expenses for periods after expected high-inflow spikes — for example, plan equipment purchases for the week after your known monthly revenue spike. Step 4: Use the Ask AI button in the burn panel to describe your seasonal pattern and ask for specific timing recommendations on capital expenditure. Step 5: Update the Cost Config Drawer to temporarily increase variable cost estimates during seasonally high-expense periods so your runway projections reflect the realistic worst case.",
      },
    ],
    relatedSlugs: [
      "switching-7d-30d-90d-chart-views",
      "identifying-best-worst-days-chart",
      "reading-12-month-cash-projection-chart",
    ],
    faq: [
      {
        q: "What if I only have 30 days of data — can I still see seasonal trends?",
        a: "With only 30 days of data, seasonal trends are not yet visible. Continue recording expenses consistently and revisit the 90D view after 3 months of data has accumulated.",
      },
      {
        q: "Does AskBiz have a built-in seasonality adjustment for the runway projection?",
        a: "The 12-month projection chart uses a constant burn rate. For seasonality-adjusted projections, manually adjust your cost and cash balance inputs to reflect expected seasonal changes.",
      },
    ],
    videoUrl: "",
  },
]
