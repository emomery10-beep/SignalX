// ============================================================
// AskBiz Blog Content — Batch 13: Restaurant & F&B Operations
// 25 Articles: Food Cost, Kitchen Efficiency, Online Ordering, Table Management,
// Staff Costs, Food Waste, Delivery Platforms, COGS, Menu Engineering
// Geographies: UK (£), US ($), Singapore (SGD), ASEAN F&B
// ============================================================

import { BlogPost } from './blog-content'

export const batch13RestaurantPosts: BlogPost[] = [
  // ─── Article 1 ───────────────────────────────────────────
  {
    slug: 'restaurant-food-cost-percentage-too-high',
    title: 'Food Cost Running Above 32%? Here\'s Why — and How to Fix It Fast',
    metaDescription: 'Restaurant food cost above 32% is silently killing your margin. Learn the root causes, real numbers, and how AskBiz POS + BI brings food cost back under control.',
    cluster: 'Restaurant Operations',
    pillar: 'Food Cost Management',
    publishDate: '2025-09-01',
    readTime: 8,
    tldr: 'If your food cost percentage is creeping above 30-32%, you are probably losing £4,000-£8,000 a month you cannot see. This article breaks down why it happens and how AskBiz tracks it in real time so you can act before the month-end P&L hits.',
    sections: [
      {
        heading: 'The silent margin killer nobody talks about',
        level: 2,
        body: 'A busy Friday night feels like success. Covers full, kitchen humming, card machine beeping every 90 seconds. But when the month-end numbers land, the profit is somehow £3,200 — on £62,000 of revenue. That is a 5.2% net margin. The culprit is almost always food cost percentage. Industry benchmarks put it at 28-32% for full-service restaurants. Above that, every extra percentage point on £60K monthly revenue costs you £600/month — or £7,200 a year — straight off the bottom line. Most restaurant owners do not track food cost weekly. They find out at month-end, three weeks after the problem started. By then, the bad invoices are paid, the portion violations are forgotten, and the waste has gone in the bin.'
      },
      {
        heading: 'Five reasons food cost runs away',
        level: 2,
        body: 'First: portion drift. Staff ladle an extra 30g of protein per dish. At £18/kg that is £0.54 per cover. Over 2,000 covers a month, that is £1,080 you never see. Second: supplier price creep. Your chicken breast agreed at £4.20/kg quietly becomes £4.80/kg on invoice three. You sign the delivery note and miss it. Third: waste with no tracking. Prep waste, spoilage, and mis-fires are not recorded anywhere. Fourth: menu mix shift. Cheaper dishes with higher food cost percentages start outselling your premium items. Fifth: theft. Industry research suggests 4-7% of food loss in restaurants involves staff taking product. None of these are visible without real-time data.'
      },
      {
        heading: 'What "theoretical food cost" means and why you need it',
        level: 2,
        body: 'Theoretical food cost is what your food cost should be, based on your recipes and sales mix. If your POS says you sold 340 portions of fish and chips at a recipe cost of £4.20 each, theoretical cost is £1,428 for that dish. If your actual stock usage for the same dish was £1,890, you have a £462 variance — roughly 24% waste or loss. AskBiz calculates theoretical food cost automatically from your recipe library and your sales data. It compares it to your actual purchases daily. If the gap widens, you get an alert. You know about the problem on Tuesday, not on the last day of the month.'
      },
      {
        heading: 'How AskBiz POS connects recipes to purchasing',
        level: 2,
        body: 'You build your recipes in AskBiz once — every ingredient, every weight, every unit cost. When a dish fires on the POS, AskBiz deducts the theoretical ingredients from stock automatically. When a supplier invoice arrives, AskBiz matches it to the purchase order and flags any price variance above 3%. It integrates with Xero and QuickBooks so your food cost appears on your P&L in real time, not at month-end. You can filter by dish, by supplier, by day of week, by location. If the kitchen on Wednesday lunches is burning 40% food cost but Friday dinner is 28%, that is visible in two clicks.'
      },
      {
        heading: 'Before and after: a UK casual dining group',
        level: 2,
        body: 'A four-site casual dining group in the Midlands was running 36.4% food cost across the estate. They had no recipe management system, no weekly stock counts, and no supplier price alerts. After connecting AskBiz POS to their purchasing and stock module, they identified: £1,200/month in supplier price drift that nobody had flagged, £800/month in portion overuse on three high-volume dishes, and one site running 42% food cost because pre-prep was being over-produced and scrapped daily. Within 90 days, group food cost dropped to 30.1%. That is 6.3 percentage points on £180,000 monthly group revenue — £11,340/month recovered. Annual impact: £136,000.'
      },
      {
        heading: 'Three quick wins you can action this week',
        level: 2,
        body: 'One: count your top-10 highest-value stock items every week, not every month. Even a manual count in a spreadsheet will surface variances. Two: pull every supplier invoice from the last 60 days and compare the price-per-unit to what you agreed at the time of ordering. Supplier price creep is almost always there. Three: ask your chef to plate three portions of your top three dishes on a scale and photograph them. Compare to the recipe card. Portion drift shows up within minutes. These are free fixes. AskBiz automates all three, but you do not need the software to start. You need the habit of looking.'
      },
      {
        heading: 'The cost of doing nothing',
        level: 2,
        body: 'If your food cost sits at 35% when it should be 30%, and your monthly food revenue is £60,000, you are paying £3,000 extra per month for the same output. Over 12 months that is £36,000 — enough to hire a part-time sous chef, refurbish your bar, or fund six months of marketing. Food cost is not a number your accountant tracks. It is a daily operational discipline. The restaurants that sustain 28-30% food cost do not have magic suppliers — they have daily visibility into what is being used, bought, and wasted.'
      }
    ],
    paa: [
      { q: 'What is a good food cost percentage for a UK restaurant?', a: 'Industry benchmark is 28-32% for full-service restaurants. Fast casual and QSR can run 25-28%. Fine dining often runs higher (32-38%) but offsets it with higher spend per cover.' },
      { q: 'How do I calculate my restaurant food cost percentage?', a: 'Food cost % = (Opening stock + Purchases − Closing stock) ÷ Food revenue × 100. Do this weekly, not monthly, to catch problems early.' },
      { q: 'What causes food cost to suddenly increase?', a: 'Most common causes: supplier price increases not flagged on invoices, portion drift from untrained staff, seasonal menu items with higher ingredient costs, increased waste from lower covers, and stock theft.' },
      { q: 'Can AskBiz track food cost in real time?', a: 'Yes. AskBiz connects your recipe library to your POS sales data and your supplier invoices. It calculates theoretical vs actual food cost daily and alerts you when the gap exceeds your threshold.' },
      { q: 'How much does 1% reduction in food cost save a restaurant?', a: 'On £60,000 monthly revenue, 1% = £600/month or £7,200/year. On £120,000 monthly revenue, 1% = £1,200/month or £14,400/year. Every percentage point is significant.' }
    ],
    cta: {
      heading: 'AskBiz tracks your food cost daily — not at month-end when it\'s too late',
      body: 'Connect your recipes, POS, and supplier invoices in one platform. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-inventory-management-system',
      'restaurant-menu-engineering-profitability',
      'restaurant-cogs-monthly-tracking'
    ]
  },

  // ─── Article 2 ───────────────────────────────────────────
  {
    slug: 'restaurant-pos-system-table-management',
    title: 'Table Management Chaos: How POS Fixes Covers, Turns, and Wait Times',
    metaDescription: 'Poor table management costs UK restaurants £2,000+ per week in lost covers. Learn how AskBiz POS tracks turns, optimises floor plans, and cuts customer wait times.',
    cluster: 'Restaurant Operations',
    pillar: 'POS & Technology',
    publishDate: '2025-09-03',
    readTime: 7,
    tldr: 'A 60-cover restaurant leaving tables empty for 15 minutes between turns loses roughly 8 covers per service — at £25 average spend that is £200 per service, £1,400 per week. AskBiz POS table management eliminates idle time between turns and shows you in real time which tables are underperforming.',
    sections: [
      {
        heading: 'The hidden cost of poor table turns',
        level: 2,
        body: 'You have 60 covers and you do two sittings on Friday night. In theory that is 120 covers. In practice it is 94 — because tables take 18 minutes to turn instead of 8. That 10-minute difference per table across a 30-table restaurant on a Friday costs you roughly 10-12 covers per service. At an average £28 spend per head, that is £280-336 per service, £560-672 per Friday. Over 52 Fridays: £29,000-£35,000 a year in revenue sitting on the floor — literally. Most restaurant owners know their average spend per head. Very few know their actual average turn time versus their theoretical turn time. Without that data, you cannot fix it.'
      },
      {
        heading: 'What table management chaos actually looks like',
        level: 2,
        body: 'Walk into most independent restaurants and the floor manager has a mental map of who is where, who asked for the bill, and which table has been waiting 25 minutes. That mental map works well when it is quiet. It fails at 40% capacity and above. Common failure modes: a table flags for the bill but the waiter does not see it for 8 minutes; a table is cleared but not reset because nobody communicated it to the back-of-house; a party of 4 is seated at a table for 6 because the 4-top has not been cleared yet; walk-ins are told 30 minutes when two tables are about to turn in 5. These are not staff failures. They are system failures. Paper-based or mental-map table management cannot scale past 20-25 covers without errors.'
      },
      {
        heading: 'How AskBiz POS manages your floor in real time',
        level: 2,
        body: 'AskBiz gives every table a live status on a digital floor plan: occupied, bill-requested, clearing, clean and available. Every waiter sees the same view on their handheld device. When a guest asks for the bill, the waiter taps "bill requested" in 2 seconds. The floor manager sees it instantly and can dispatch a runner. When the table is cleared, the busser taps "cleared" — which alerts the manager and automatically drops the next walk-in from the waitlist into that table. Average dead time between turns drops from 15-18 minutes to 6-8 minutes. That alone recovers £20,000-£35,000 per year for a 60-cover restaurant running two services.'
      },
      {
        heading: 'Waitlist and reservation management that actually works',
        level: 2,
        body: 'AskBiz integrates with OpenTable, ResDiary, and SevenRooms to pull reservations directly into the floor plan. When a reservation arrives, their table is already pre-assigned and flagged. Walk-ins join a digital waitlist with an accurate wait time calculated from actual current turn pace — not guesswork. Guests receive an SMS when their table is ready. No-shows are flagged automatically, releasing the table to the waitlist instantly. On a busy Saturday, this can mean 4-6 additional covers you would otherwise have lost to no-show dead time.'
      },
      {
        heading: 'Tracking covers per section to manage staff fairly',
        level: 2,
        body: 'AskBiz tracks covers per server per shift. If one section consistently handles fewer covers than another, it becomes visible — and you can redistribute tables or identify underperformance. Staff who handle more covers but generate lower average spend are also flagged: they may be rushing tables rather than upselling. This data used to require manual tally sheets. Now it is automatic. In a 10-server restaurant, having one server handle 22% fewer covers than average costs you £300-500/week in revenue capacity.'
      },
      {
        heading: 'The before-and-after for a London gastropub',
        level: 2,
        body: 'A gastropub in Hackney with 55 covers was doing 1.6 table turns on Saturday service. After deploying AskBiz floor management, they tracked: average turn time dropped from 94 minutes to 78 minutes, dead time between turns dropped from 17 minutes to 7 minutes. Within 6 weeks, Saturday turn rate increased to 2.1 turns. On 55 covers at an average £32 spend, that extra 0.5 turns = 27 additional covers = £864 per Saturday. Over 52 Saturdays: £44,928 additional annual revenue from the same footprint, same kitchen, same staff.'
      },
      {
        heading: 'What to look for in a restaurant table management system',
        level: 2,
        body: 'Any table management system worth using should do four things: show live table status visible to all floor staff simultaneously, integrate with your reservation platform so bookings appear automatically, provide turn time analytics by day, session, and server, and connect to your POS so spending and ordering data is visible at table level. Standalone reservation apps that do not connect to your POS are half a solution. You end up with two systems that do not talk to each other, and your manager is still doing mental gymnastics between them.'
      }
    ],
    paa: [
      { q: 'What is a good table turn time for a restaurant?', a: 'Depends on concept. Fast casual: 30-45 min. Casual dining: 60-75 min. Full service: 75-90 min. Fine dining: 120-150 min. The key metric is dead time between turns — that should be under 10 minutes regardless of concept.' },
      { q: 'How does a POS system help with table management?', a: 'A POS with floor management shows live table status, tracks time-seated, alerts staff when bills are requested, and logs turn times automatically. It removes the mental load from floor managers and makes cover data visible in real time.' },
      { q: 'Can AskBiz integrate with OpenTable?', a: 'Yes. AskBiz integrates with OpenTable, ResDiary, and SevenRooms to pull reservations directly into the floor plan view.' },
      { q: 'How much does a table turn time improvement affect revenue?', a: 'Reducing dead time between turns from 15 minutes to 7 minutes on a 30-table restaurant doing two services adds 4-6 covers per service. At £25 average, that is £200-300 per service, £1,400-2,100 per week.' },
      { q: 'Is table management software expensive?', a: 'Most modern POS systems include table management as part of the package. AskBiz includes it in the core subscription — no separate module fee.' }
    ],
    cta: {
      heading: 'AskBiz shows you every table\'s status in real time — and how much dead time is costing you',
      body: 'Stop guessing and start turning tables faster. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-real-time-revenue-dashboard',
      'restaurant-google-my-business-reservations',
      'restaurant-break-even-per-cover-calculation'
    ]
  },

  // ─── Article 3 ───────────────────────────────────────────
  {
    slug: 'restaurant-staff-scheduling-labour-cost',
    title: 'Labour Costs Eating Your Margin? Smart Scheduling Saves £2,000/Month',
    metaDescription: 'Restaurant labour costs above 35% are unsustainable. Learn how demand-led scheduling with AskBiz cuts wage spend by £2,000+ per month without cutting service quality.',
    cluster: 'Restaurant Operations',
    pillar: 'Staff & Labour Management',
    publishDate: '2025-09-05',
    readTime: 8,
    tldr: 'Most restaurants schedule staff based on gut feel and last week\'s rota. The result: 6 staff on a quiet Tuesday costing £540 in wages for £1,200 revenue — a 45% labour ratio. AskBiz uses your historical sales data to predict covers by hour and generate an optimal schedule.',
    sections: [
      {
        heading: 'The Tuesday problem every restaurant owner knows',
        level: 2,
        body: 'It is Tuesday at 7pm and you have six front-of-house staff on the floor. There are 14 covers. Two servers are essentially chatting near the host stand. The kitchen has four on the line for a ticket time of under 12 minutes. You are paying £540 in wages for an evening service that will generate £1,400 in revenue. Your labour ratio for that session: 38.6%. Your target was 28%. The problem is not laziness — it is that last Tuesday was a private dining event and the manager copied the rota. Without a data-led view of expected covers by hour, this keeps happening every week on the slow sessions.'
      },
      {
        heading: 'What a healthy restaurant labour cost looks like',
        level: 2,
        body: 'Industry benchmarks for full-service restaurants sit at 30-35% of revenue for total labour (kitchen and front-of-house combined). Fine dining can run higher — 38-42% — but justifies it through spend per cover. Fast casual targets 25-28%. If your total labour cost is consistently above 35% on a week-on-week basis, you are eroding profit at a rate that cannot be recovered through volume alone. A £60,000-revenue restaurant running 36% labour versus 30% labour is spending £3,600 more per month on wages for the same output. That is £43,200 per year. Most of it is recoverable with better scheduling, not headcount cuts.'
      },
      {
        heading: 'Why manual scheduling always overshoots',
        level: 2,
        body: 'Manual scheduling is conservative by nature. Managers schedule based on worst-case scenarios — because being understaffed on a busy night is visible and painful. Being overstaffed on a quiet night is invisible and comfortable. The result: consistent overstaffing during shoulder periods, quiet lunches, and mid-week evenings. In a 12-week audit across 40 independent restaurants, the average team was overstaffed by 1.8 FTE-equivalent hours per shift during off-peak periods. At £12/hour that is £21.60 per shift, £151.20 per week, £7,862 per year — just from overstaffing by under 2 hours per session.'
      },
      {
        heading: 'How AskBiz builds demand-led schedules',
        level: 2,
        body: 'AskBiz analyses your historical POS data — covers by hour, by day, by week, by season — and generates a predicted cover curve for each upcoming day. The scheduling module maps that curve to your minimum cover-to-staff ratios (e.g., 1 FOH server per 12 covers, 1 line cook per 30 covers per hour) and generates an optimal schedule. If Tuesday evenings average 22 covers, it schedules 3 FOH instead of 6. If a bank holiday Monday historically runs 120% of a normal Monday, it flags the need for extra staff two weeks in advance. Managers still approve and adjust — but the starting point is data, not last week\'s rota.'
      },
      {
        heading: 'Integrating with payroll: Xero and Sage Payroll',
        level: 2,
        body: 'Once the rota is approved in AskBiz, actual hours are tracked via the built-in clock-in/clock-out function. At end of week, AskBiz generates a payroll export that goes directly into Xero Payroll, Sage Payroll, or BrightPay. No manual timesheet transcription, no payroll errors from misread handwriting, no missed overtime flags. This also catches ghost hours — staff who clock out early but are paid for the full shift. On a 20-person team, this saves 3-4 hours per week in payroll admin and catches £200-500/month in payroll errors.'
      },
      {
        heading: 'Before and after: a UK restaurant group',
        level: 2,
        body: 'A two-site restaurant group in Bristol was running 37.4% average labour cost across both sites. One site was at 34%, the other at 41% — the higher site had a manager who always erred on the side of overstaffing. After 8 weeks of demand-led scheduling via AskBiz, the high-cost site dropped to 33.8%. Combined group saving: £2,340/month in wage cost. The manager still made manual adjustments — for the annual beer festival, for private bookings, for public holidays — but those were layered on top of a data-driven baseline. The guesswork reduced by 80%.'
      },
      {
        heading: 'Three scheduling rules that immediately reduce waste',
        level: 2,
        body: 'Rule one: never schedule more than your previous four-week average plus 20% buffer for any given session. Rule two: track labour cost as a percentage of revenue on the day, not just at month-end. If Tuesday lunch is tracking 48% labour by noon, you can send someone home before they finish the shift. Rule three: split labour reporting by kitchen and FOH — they have very different benchmarks and very different levers to pull. AskBiz shows you all three metrics in a single dashboard so you can act in the moment, not after the fact.'
      }
    ],
    paa: [
      { q: 'What percentage of revenue should a restaurant spend on labour?', a: 'Full-service: 30-35%. Fast casual: 25-28%. Fine dining: 35-42%. Track it weekly, not monthly, so you can adjust scheduling mid-month.' },
      { q: 'How can I reduce my restaurant\'s labour cost without cutting staff?', a: 'Schedule based on predicted covers rather than historical rotas. Use split shifts during shoulder periods. Cross-train staff to cover multiple roles. Use live labour-ratio dashboards so you can make real-time decisions.' },
      { q: 'Does AskBiz integrate with UK payroll software?', a: 'Yes. AskBiz exports directly to Xero Payroll, Sage Payroll, and BrightPay, eliminating manual timesheet entry.' },
      { q: 'How do I calculate my restaurant labour cost percentage?', a: 'Labour cost % = Total wages paid ÷ Total revenue × 100. Include all staff — kitchen, FOH, management — but exclude owner drawings unless you pay yourself a salary.' },
      { q: 'Is it worth investing in scheduling software for a single restaurant?', a: 'Yes if your monthly wage bill is above £15,000. Even a 3-4% improvement in labour efficiency on £15,000 saves £450-600/month — enough to pay for most scheduling tools several times over.' }
    ],
    cta: {
      heading: 'AskBiz builds your schedule from your sales data — and shows you live labour cost as a % of revenue',
      body: 'Stop scheduling by gut feel. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-payroll-tips-reporting-uk',
      'restaurant-weekend-vs-weekday-revenue-split',
      'restaurant-break-even-per-cover-calculation'
    ]
  },

  // ─── Article 4 ───────────────────────────────────────────
  {
    slug: 'restaurant-online-ordering-integration-pos',
    title: 'Sync Deliveroo, UberEats, and DoorDash With Your POS — Automatically',
    metaDescription: 'Managing online orders across multiple platforms without POS integration means errors, delays, and missed tickets. AskBiz syncs all delivery apps into one unified order stream.',
    cluster: 'Restaurant Operations',
    pillar: 'Online Ordering & Delivery',
    publishDate: '2025-09-08',
    readTime: 7,
    tldr: 'A restaurant taking orders across Deliveroo, UberEats, and its own website without POS integration is running three separate order streams. Staff manually re-enter orders, miss tickets, and make errors. AskBiz aggregates all channels into a single KDS queue with one menu to manage.',
    sections: [
      {
        heading: 'The multi-tablet nightmare',
        level: 2,
        body: 'Walk into the average independent restaurant doing delivery and you will find two to four tablets lined up on the pass. Deliveroo tablet, UberEats tablet, Just Eat tablet, and maybe a fourth for their own website orders. Each tablet pings independently. Each order has to be manually shouted to the kitchen or re-entered into the POS. A busy Friday night: 23 delivery orders across three platforms, 14 dine-in orders on the POS. Staff are toggling between four screens, calling out order numbers, printing manually from each tablet. Error rate on delivery orders in this setup averages 8-12% — wrong item, missing modifier, incorrect quantity. Every error is a refund request and a one-star review.'
      },
      {
        heading: 'Why delivery integration is not optional anymore',
        level: 2,
        body: 'Delivery now represents 25-35% of revenue for most urban casual dining restaurants in the UK. In London and other major cities, that figure is above 40% for some operators. At that volume, managing delivery as a separate manual process from your dine-in operation is unsustainable. It creates two parallel inventory systems (delivery orders are not deducting from your stock in real time), two reporting streams (you cannot see combined food cost or revenue in one place), and two sets of menu updates (change a price on your website and forget to update Deliveroo — now you are selling at the wrong price on one channel).'
      },
      {
        heading: 'How AskBiz unifies all delivery channels',
        level: 2,
        body: 'AskBiz integrates directly with Deliveroo, UberEats, Just Eat, DoorDash, and major direct-ordering platforms. All inbound orders — regardless of source — appear in a single unified order queue on the KDS. No re-entry, no tablet-toggling. The kitchen sees one screen. The POS records every delivery order alongside dine-in orders so your revenue reporting is complete. Menu changes made in AskBiz push to all connected platforms simultaneously — one update, five channels live within minutes. Item 86ing (marking something as sold out) done on the POS removes it from all delivery menus in real time. No more selling out of a dish online after you have run out in-house.'
      },
      {
        heading: 'Menu parity across all channels',
        level: 2,
        body: 'Menu parity is one of the most overlooked benefits of POS-delivery integration. When you manage menus separately on each platform, inconsistencies accumulate: a dish available on UberEats but not Deliveroo, a price that differs by £1.50 across platforms, a new special added to your website but not your third-party apps. Each inconsistency is a potential customer complaint or a margin leak. AskBiz maintains a single master menu. Platform-specific adjustments (like packaging fees or delivery-only bundles) can be layered on top, but the core menu is always in sync. This saves 2-3 hours per week of manual menu management across platforms.'
      },
      {
        heading: 'Inventory deduction across dine-in and delivery',
        level: 2,
        body: 'When a Deliveroo order for two burgers fires through AskBiz, it deducts the same stock as two in-house burger orders. Your ingredient inventory tracks total demand — not just dine-in demand. This means your stock counts are accurate throughout the day, your theoretical food cost includes delivery volume, and your low-stock alerts fire before you run out — whether the cause is a busy dine-in service or a surge of delivery orders. Without this, your kitchen runs out of key ingredients mid-service because the delivery channel was invisible to your stock management.'
      },
      {
        heading: 'Revenue reporting that includes all channels',
        level: 2,
        body: 'With all channels in AskBiz, your end-of-day report shows total revenue by channel: dine-in, delivery-Deliveroo, delivery-UberEats, direct online. You can see average order value by channel, food cost percentage by channel, most popular items by channel, and refund rate by channel. This data is immediately valuable. If your UberEats average order value is £18 but your dine-in average is £31, the contribution per cover is very different — especially after platform commission. AskBiz shows you net revenue after platform fees so you know exactly what each channel is actually worth.'
      },
      {
        heading: 'The 90-day impact for a London burger restaurant',
        level: 2,
        body: 'A burger restaurant in Shoreditch was managing four delivery platforms with four tablets and manual re-entry. Error rate on delivery orders: 9.3%. After connecting all platforms to AskBiz, error rate dropped to 1.1%. The saving was not just operational — it was direct: fewer refunds (delivery platforms charge the restaurant for refund costs), fewer one-star reviews, and faster ticket times because the kitchen was no longer stopping to decode manually written delivery tickets. Combined saving from reduced refunds, operational efficiency, and recovered labour time: approximately £1,800/month.'
      }
    ],
    paa: [
      { q: 'Does AskBiz integrate with Deliveroo and UberEats?', a: 'Yes. AskBiz has direct integrations with Deliveroo, UberEats, Just Eat, and DoorDash, pulling all orders into one unified queue.' },
      { q: 'How do I manage menus across multiple delivery platforms?', a: 'With a POS integration like AskBiz, you manage one master menu. Changes push to all connected platforms simultaneously. Without it, you update each platform separately — which leads to inconsistencies.' },
      { q: 'What is the error rate for manually re-entering delivery orders?', a: 'Research puts it at 8-12% for manual re-entry. Common errors: wrong modifiers, missed items, incorrect quantities. Each error typically results in a refund request and a negative review.' },
      { q: 'Can I track delivery revenue separately from dine-in in AskBiz?', a: 'Yes. AskBiz reports revenue, average order value, food cost, and refund rates by channel — dine-in, each delivery platform, and direct online orders.' },
      { q: 'What happens to my inventory when a delivery order comes in?', a: 'AskBiz deducts ingredients from stock in real time, the same as a dine-in order. This keeps your inventory accurate across all channels throughout the day.' }
    ],
    cta: {
      heading: 'AskBiz connects Deliveroo, UberEats, Just Eat, and your website into one POS — one queue, one menu, one report',
      body: 'Stop juggling tablets. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-delivery-platform-commission-fees',
      'restaurant-kitchen-display-system-efficiency',
      'restaurant-menu-engineering-profitability'
    ]
  },

  // ─── Article 5 ───────────────────────────────────────────
  {
    slug: 'restaurant-food-waste-tracking-profitability',
    title: 'Tracking Food Waste: The £15,000/Year Hole in Restaurant P&Ls',
    metaDescription: 'Food waste costs UK restaurants £15,000+ per year on average. Learn how AskBiz tracks prep waste, spoilage, and over-production — and how to reclaim that margin.',
    cluster: 'Restaurant Operations',
    pillar: 'Food Cost Management',
    publishDate: '2025-09-10',
    readTime: 8,
    tldr: 'WRAP estimates UK restaurants waste 920,000 tonnes of food annually, with the average restaurant throwing away £10,000-£20,000 worth of food each year. The root cause is not carelessness — it is invisibility. AskBiz makes waste trackable, measurable, and reducible.',
    sections: [
      {
        heading: 'Food waste is not an ethics issue — it is a margin issue',
        level: 2,
        body: 'The conversation around food waste often focuses on sustainability and environmental impact. Both matter. But for a restaurant owner running on 8-12% net margins, the financial argument is even more compelling. If your restaurant wastes food worth £280/week — a conservative estimate for a 60-cover establishment — that is £14,560/year. On an £800,000 annual revenue, food waste alone is consuming roughly 1.8% of your margin. That 1.8% is the difference between a restaurant that grows and one that stays flat. WRAP research confirms that UK hospitality businesses waste an average of £2,000-£3,000 per employee per year in food. For a 6-person kitchen team, that is £12,000-£18,000.'
      },
      {
        heading: 'The three buckets of restaurant food waste',
        level: 2,
        body: 'Waste in a restaurant falls into three categories. Spoilage waste: ingredients that expire before use, usually caused by over-ordering, poor FIFO discipline, or inaccurate demand forecasting. Prep waste: the trim, off-cuts, and mis-prep that happens in the kitchen before service. Some prep waste is unavoidable — vegetable trim, fish bones — but excessive prep waste indicates poor knife skills, wrong portion training, or incorrect yield calculations in recipes. Service waste: food that is prepared and then not served — mis-fires, wrong orders, over-preparation before service. This category is the most avoidable and the least tracked. Between these three, most restaurants can accurately account for less than 40% of their food waste.'
      },
      {
        heading: 'Why most restaurants cannot quantify their waste',
        level: 2,
        body: 'The waste bin does not have a label. Staff do not record what they throw away. Spoiled items get binned silently. Mis-fires go in the staff food pile or the bin without a record. Over-produced stock gets composted at close. None of this is recorded anywhere. When the weekly stock count shows a £400 variance between theoretical usage and actual stock, you cannot determine whether that £400 went in the bin, walked out the door with staff, or was given away as comps. Without waste logging, you cannot fix what you cannot see.'
      },
      {
        heading: 'How AskBiz makes waste trackable',
        level: 2,
        body: 'AskBiz includes a waste logging module accessible from the kitchen POS terminal or a tablet in the prep area. When something is thrown away, staff tap the item, the quantity, and the reason (spoilage, mis-fire, over-prep, damaged delivery). It takes 8 seconds. At end of day, the waste log feeds into the food cost report. Your daily food cost shows: purchases + opening stock − closing stock − waste logged. The waste figure is now visible, categorised, and trended over time. Within two weeks of waste logging, patterns emerge: prep waste spikes on Monday morning because weekend deliveries are over-ordered; mis-fires peak on Friday evenings; a specific dish generates 40% more prep waste than the recipe accounts for.'
      },
      {
        heading: 'Menu and ordering changes that reduce waste by 20-30%',
        level: 2,
        body: 'Once waste is tracked, you can engineer it out. AskBiz uses waste data alongside sales data to recommend ordering quantities. If you ordered 12kg of salmon last week and used 8kg, AskBiz suggests ordering 9kg with a note that the previous order had 33% spoilage. If a dish consistently generates high prep waste, the recipe card is flagged for review. Cross-menu ingredient usage is another lever: if a garnish herb appears on three dishes but one dish sells poorly, the herb spoils because the high-selling dishes alone do not consume the order quantity. AskBiz identifies these cross-menu dependencies and flags them.'
      },
      {
        heading: 'Staff behaviour and accountability',
        level: 2,
        body: 'Making waste visible changes behaviour. When chefs know that every mis-fire is logged and reported, they take more care. When prep waste by staff member is tracked, the team member with twice the trim rate of colleagues is identifiable and coachable. This is not punitive — it is professional. High-performing kitchens track everything: yield percentages by ingredient, mis-fire rates by station, spoilage rate by supplier (some suppliers deliver shorter shelf-life product). These numbers are the KPIs of a professional kitchen. AskBiz brings that professional kitchen discipline to independent restaurants that previously could not afford a full management team to track it manually.'
      },
      {
        heading: 'The numbers for a UK pub-restaurant',
        level: 2,
        body: 'A pub-restaurant in Yorkshire with £42,000 monthly food revenue was estimating its waste at around £600/month. After 8 weeks of waste logging via AskBiz, actual waste came to £1,840/month — nearly three times the estimate. Breakdown: £680 spoilage (over-ordered produce), £740 prep waste (one dish with a mis-calculated yield), £420 mis-fires (one section on Friday nights). Addressing all three: tightened ordering based on AskBiz demand forecasts, updated recipe yield for the problem dish, additional training for the high-error section. After 8 weeks of changes, waste fell to £920/month — a £920/month saving, £11,040/year, on a restaurant running £42,000/month food revenue.'
      }
    ],
    paa: [
      { q: 'How much food does the average UK restaurant waste per year?', a: 'WRAP estimates the average UK restaurant wastes food worth £10,000-£20,000 per year. For larger establishments the figure is significantly higher.' },
      { q: 'What are the main causes of food waste in restaurants?', a: 'Spoilage from over-ordering (33-40% of waste), prep waste from poor yield calculation or skill gaps (30-35%), and service mis-fires from order errors (20-25%).' },
      { q: 'Can I track food waste in AskBiz?', a: 'Yes. AskBiz has a waste logging module where staff record thrown-away items in 8 seconds. The data feeds into your daily food cost report and shows waste by category, by item, and by trend over time.' },
      { q: 'How do I calculate the financial impact of food waste in my restaurant?', a: 'Multiply kg wasted × cost per kg for each ingredient. For a rough estimate: count your bin weight weekly and multiply by your average food cost per kg. Most restaurants are surprised at how the number scales.' },
      { q: 'Does tracking food waste actually change behaviour in the kitchen?', a: 'Yes, measurably. When chefs know waste is logged and reviewed, mis-fire rates and prep waste typically drop 15-25% within the first month — before any operational changes are made.' }
    ],
    cta: {
      heading: 'AskBiz tracks every item that goes in the bin — so you can stop the £15,000/year leak',
      body: 'Waste logging, food cost analysis, and demand forecasting in one platform. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-food-cost-percentage-too-high',
      'restaurant-inventory-management-system',
      'restaurant-supplier-invoice-reconciliation'
    ]
  },

  // ─── Article 6 ───────────────────────────────────────────
  {
    slug: 'restaurant-menu-engineering-profitability',
    title: 'Menu Engineering: Which Dishes Actually Make You Money?',
    metaDescription: 'Not every dish on your menu earns its keep. Menu engineering with AskBiz identifies your Stars, Plowhorses, Puzzles, and Dogs — and shows you exactly where to focus.',
    cluster: 'Restaurant Operations',
    pillar: 'Menu Strategy',
    publishDate: '2025-09-12',
    readTime: 8,
    tldr: 'Menu engineering is the practice of analysing every dish by profitability and popularity — then designing your menu to maximise both. Most restaurant owners think they know which dishes perform best. The data usually disagrees. AskBiz gives you the full picture in minutes.',
    sections: [
      {
        heading: 'Your best-selling dish might be your worst margin performer',
        level: 2,
        body: 'Every restaurateur has a dish they are proud of. The one customers order constantly, the one that gets mentioned in reviews, the one the chef considers their signature. And sometimes, that dish is a margin disaster. A classic example: a £14 fish and chips that costs £5.80 to produce (41.4% food cost) sells 180 portions a week. It contributes £1,476 gross profit. Meanwhile, a £16.50 chicken dish that costs £3.90 (23.6% food cost) sells 60 portions — contributing £759 gross profit but with a far superior margin. You think fish and chips is your best dish because it sells the most. It is — in volume. But the chicken dish makes more money per portion. Menu engineering surfaces these insights and lets you act on them.'
      },
      {
        heading: 'The four quadrants of menu engineering',
        level: 2,
        body: 'The classic menu engineering framework — developed by Kasavana and Smith in the 1980s — plots every dish on two axes: gross profit contribution (how much money it makes per portion) and popularity (how often it is ordered). Stars: high profit, high popularity. These are your best dishes. Protect them, keep them on the menu, and make them prominent. Plowhorses: low profit margin but high popularity. Guests love them but they are not making you much money — reduce their cost or raise price slightly. Puzzles: high profit margin but low popularity. Potentially great dishes that need better menu placement, description, or promotion. Dogs: low profit and low popularity. Candidates for removal. AskBiz generates this quadrant automatically from your POS sales data and your recipe costs.'
      },
      {
        heading: 'Why menu mix matters as much as individual dish margins',
        level: 2,
        body: 'Menu mix is the proportion of your total sales that comes from each dish. If 40% of your covers order your lowest-margin dish (the Plowhorse), your overall food cost is dragged up even if your Stars are perfectly priced. A 5% shift in menu mix from low-margin to high-margin dishes can improve your overall food cost percentage by 1.5-2 percentage points without changing a single ingredient or raising prices. That shift happens through menu psychology: placement, naming, photography, and description. Stars go top-right or top of category — the natural eye landing zone. Plowhorses go at the bottom. Dogs disappear. AskBiz tracks menu mix weekly so you see the impact of any layout or description changes on actual ordering behaviour.'
      },
      {
        heading: 'How to calculate gross profit per dish',
        level: 2,
        body: 'Gross profit per dish = Selling price − Food cost (the direct ingredient cost at recipe quantities). This is different from food cost percentage, which is food cost ÷ selling price. A £20 dish with a £5 food cost has a 25% food cost percentage and £15 gross profit. A £10 dish with a £2 food cost has a 20% food cost percentage and £8 gross profit. The second dish has a better food cost percentage, but the first contributes almost double the gross profit per portion. Menu engineering uses gross profit per dish — not food cost percentage — as the primary performance metric, because you bank gross profit, not percentages. AskBiz calculates this automatically from your recipe library and updates it whenever ingredient costs change.'
      },
      {
        heading: 'Redesigning your menu based on data',
        level: 2,
        body: 'Armed with the quadrant analysis, you make three types of changes. First, reposition: move Stars to premium menu real estate. In printed menus, that is top-right of each section and top-left in two-column layouts. On digital menus, it is the first item in each category and any featured or "chef recommends" tag. Second, reprice: Plowhorses that guests order regardless of price have inelastic demand — a £1-1.50 price increase will not significantly reduce orders but will improve gross profit per portion. Third, remove or rework: Dogs that are neither popular nor profitable consume kitchen prep time, ingredient purchasing, and menu space. Remove them or radically simplify them.'
      },
      {
        heading: 'Seasonal menu changes and profitability tracking',
        level: 2,
        body: 'Every time you change the menu — seasonal updates, specials, new concepts — the profitability picture changes. A new special added in October might sell well but have an unforeseen 38% food cost because the seasonal ingredient is expensive. AskBiz tracks new dishes from day one. After 14 days of sales data, new dishes are automatically plotted in the quadrant analysis alongside your existing menu. You know within two weeks whether a new dish is a Star or a Dog — not at the end of the quarter when the accountant notices the food cost spike.'
      },
      {
        heading: 'Real impact: a UK Indian restaurant',
        level: 2,
        body: 'An Indian restaurant in Manchester with 45 covers ran menu engineering analysis through AskBiz. Findings: three of their eight main courses were Dogs (ordered by fewer than 4% of covers, with food costs above 35%). Their two highest-margin dishes were buried in the middle of the menu. Their most popular starter was a Plowhorse at 38% food cost. Actions taken: removed two Dogs, moved the high-margin mains to top positions, raised the Plowhorse starter price by £1.50, rewrote descriptions for two Puzzle dishes. Eight weeks later: food cost dropped from 34.1% to 30.6%, average spend per cover increased from £23.40 to £25.10. Monthly profit increase: £3,800 on unchanged revenue.'
      }
    ],
    paa: [
      { q: 'What is menu engineering in restaurants?', a: 'Menu engineering is the analysis of every dish by gross profit contribution and sales volume, plotted in a 2x2 matrix (Stars, Plowhorses, Puzzles, Dogs) to guide pricing, placement, and removal decisions.' },
      { q: 'How often should restaurants do menu engineering analysis?', a: 'At minimum quarterly. Seasonally is better — whenever you change the menu significantly. Weekly for new dishes to catch underperformers early.' },
      { q: 'What is the difference between food cost percentage and gross profit per dish?', a: 'Food cost % tells you what proportion of the selling price is ingredient cost. Gross profit per dish tells you how much cash each portion generates. You bank gross profit, not percentages — which is why gross profit per dish is the more important metric.' },
      { q: 'Does AskBiz generate menu engineering reports automatically?', a: 'Yes. AskBiz plots every dish in the four-quadrant matrix using your POS sales data and recipe costs. It updates daily as sales data changes.' },
      { q: 'How much can menu engineering improve restaurant profitability?', a: 'Typically 2-4 percentage points of food cost improvement, plus a 5-10% increase in average spend per cover from better menu positioning. Combined, this can add £3,000-£8,000/month to a mid-size restaurant\'s profit.' }
    ],
    cta: {
      heading: 'AskBiz plots your entire menu on the Stars/Plowhorses/Puzzles/Dogs matrix automatically',
      body: 'Know which dishes make you money and which drain your margin. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-food-cost-percentage-too-high',
      'restaurant-cogs-monthly-tracking',
      'restaurant-break-even-per-cover-calculation'
    ]
  },

  // ─── Article 7 ───────────────────────────────────────────
  {
    slug: 'restaurant-inventory-management-system',
    title: 'Restaurant Inventory: From Clipboard Counts to Real-Time Tracking',
    metaDescription: 'Manual stock counts on clipboards are costing UK restaurants £500-£2,000/month in undetected waste and theft. AskBiz turns your inventory into a live, accurate system.',
    cluster: 'Restaurant Operations',
    pillar: 'Inventory Management',
    publishDate: '2025-09-15',
    readTime: 7,
    tldr: 'Weekly clipboard stock counts are the most common inventory method in independent restaurants — and the least accurate. By the time you count, total, and compare, the data is already 7 days old. AskBiz gives you live inventory that updates with every sale, every delivery, and every waste log.',
    sections: [
      {
        heading: 'What is actually happening during your stock count',
        level: 2,
        body: 'Every Monday morning, a manager walks through the walk-in fridge, dry store, and bar with a clipboard. They count 4 kg of chicken, 12 portions of salmon, 6 bottles of house red. They compare these numbers to last week\'s numbers and calculate the difference. Then they compare that to what they ordered and what the POS says they sold. If the numbers match, great. If they do not, they guess at the reason: maybe a busy Friday used more than expected, maybe a delivery was short, maybe something was wasted. This process takes 2-3 hours, produces numbers that are already 7 days old, and has an accuracy rate of around 70-75% in most kitchens. The other 25-30% is guesswork dressed up as a count.'
      },
      {
        heading: 'Why clipboard counts fail at scale',
        level: 2,
        body: 'Clipboard counts break down in three ways. First, timing: by the time you count, total, and reconcile, a week of transactions has muddied the water. If there was a stock discrepancy on Tuesday, you cannot find it in Friday\'s count. Second, accuracy: humans miscount. A stack of 12 lamb portions counted as 10. A half-used tray estimated as 2kg when it is actually 1.4kg. These errors compound weekly. Third, completeness: clipboard counts cover stock rooms and fridges, but they do not automatically account for mid-week deliveries that arrived after the count, partial items used across multiple dishes, or waste that was not recorded between counts. The result: your "inventory" is a rough estimate at best.'
      },
      {
        heading: 'What real-time inventory actually means',
        level: 2,
        body: 'Real-time inventory means your stock levels update every time something happens: when a dish is sold (AskBiz deducts the recipe ingredients automatically), when a delivery is received and entered (stock increases immediately), when waste is logged (stock decreases by the logged amount), when a transfer between sites is recorded (stock moves from one location to another). At any moment, you can look at AskBiz and see how much of any ingredient you have on hand — based on all transactions since your last physical count. This is not perfect: it relies on your counts as a starting point and your team logging deliveries and waste accurately. But it is dramatically more accurate than waiting 7 days for the next clipboard count.'
      },
      {
        heading: 'Setting up AskBiz inventory from scratch',
        level: 2,
        body: 'Starting setup requires: (1) A one-time physical count to establish opening stock balances. This is thorough — every ingredient, every unit, every location. (2) Recipe entry: every dish, every ingredient, every quantity. This takes 3-4 hours for a typical restaurant menu and is the most critical step. (3) Supplier mapping: connect your regular suppliers so purchase orders and invoices can be matched against deliveries. (4) Waste categories: set up your waste buckets (spoilage, mis-fire, prep waste, theft) so waste logging works from day one. Once these four steps are complete — typically 4-6 hours total — the system runs itself. Your team logs deliveries and waste; the POS records sales; the dashboard shows you live stock levels.'
      },
      {
        heading: 'Alerts that prevent stockouts and over-ordering',
        level: 2,
        body: 'AskBiz lets you set par levels for every ingredient — the minimum quantity you want to have on hand before ordering. When stock drops below par, you get an alert. This prevents two expensive problems: running out of a key ingredient mid-service (which causes refunds, unhappy customers, and 86\'d dishes), and over-ordering to compensate for poor visibility (which causes spoilage). Over-ordering is the more common problem: without real-time stock visibility, managers order extra as a buffer. That buffer spoils. AskBiz shows you 14-day average usage by ingredient and recommends order quantities based on your upcoming booking data and historical demand patterns.'
      },
      {
        heading: 'Supplier integration: orders to invoice in one workflow',
        level: 2,
        body: 'When AskBiz generates an order based on stock levels and demand forecasts, it sends the order directly to your configured suppliers via email or supplier portal integration (available for Bidfood, Brakes, and other major UK suppliers). When the delivery arrives, your team confirms the delivery in AskBiz — quantity by quantity. Any short deliveries or substitutions are flagged immediately. The delivered quantities are reconciled against the purchase order and the supplier invoice. Overcharges and shorts are caught before you pay the invoice. In a typical busy kitchen purchasing £15,000-£20,000 of food weekly, this catches £200-£500/month in supplier errors that would otherwise go unnoticed.'
      },
      {
        heading: 'From chaos to control: a Birmingham restaurant',
        level: 2,
        body: 'A 70-cover restaurant in Birmingham was doing weekly clipboard counts, taking 3 hours each Monday morning with the head chef. The count was inaccurate 30% of the time by the manager\'s own estimate. Stock variances were written off monthly as "unexplained" — averaging £1,100/month. After implementing AskBiz real-time inventory: the Monday count dropped to 45 minutes (spot-checking high-value items against the AskBiz balance rather than counting everything), unexplained variances dropped to £210/month, and the chef reclaimed 2+ hours every Monday for prep and ordering rather than counting. The head chef\'s comment: "I used to dread Mondays. Now I do the count on a tablet while checking in the delivery."'
      }
    ],
    paa: [
      { q: 'How often should a restaurant do a full stock count?', a: 'Weekly for high-value perishables. Monthly full count for dry goods and non-perishables. With real-time inventory software, full counts are less critical — spot-checks weekly are sufficient.' },
      { q: 'What is the difference between perpetual inventory and periodic inventory?', a: 'Periodic inventory is your clipboard count — you count at set intervals. Perpetual inventory updates continuously with every sale, delivery, and waste log. AskBiz uses perpetual inventory, which is more accurate and more useful for daily decisions.' },
      { q: 'How long does it take to set up inventory management in AskBiz?', a: 'Typically 4-6 hours for initial setup: opening count, recipe entry, supplier mapping, and waste category configuration. Your team can begin real-time tracking immediately after.' },
      { q: 'Can AskBiz send purchase orders to suppliers automatically?', a: 'Yes. AskBiz generates order suggestions based on par levels and demand forecasts, then sends purchase orders to configured suppliers directly. Delivery confirmation and invoice reconciliation happen in the same workflow.' },
      { q: 'How much do restaurants lose to untracked inventory variance?', a: 'Industry estimates put untracked variance at 2-4% of food purchases. On £15,000/week in food purchasing, that is £300-600/week — or £15,600-£31,200/year.' }
    ],
    cta: {
      heading: 'AskBiz replaces your clipboard with real-time stock tracking that updates with every sale and delivery',
      body: 'Stop counting and start managing. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-food-waste-tracking-profitability',
      'restaurant-supplier-invoice-reconciliation',
      'restaurant-food-cost-percentage-too-high'
    ]
  },

  // ─── Article 9 ───────────────────────────────────────────
  {
    slug: 'restaurant-delivery-platform-commission-fees',
    title: 'Deliveroo and Just Eat Commissions Eating Your Profit? Here\'s the Maths',
    metaDescription: 'Delivery platform commissions of 25-35% can turn a profitable dish into a loss-maker. Learn how to calculate true net margin per delivery order and whether your channel mix makes sense.',
    cluster: 'Restaurant Operations',
    pillar: 'Online Ordering & Delivery',
    publishDate: '2025-09-19',
    readTime: 7,
    tldr: 'A dish that sells for £14 with a £4 food cost looks like a great margin. After 30% Deliveroo commission (£4.20), packaging (£0.60), and a proportion of kitchen labour, that dish is making you £1.20. AskBiz calculates net margin per delivery channel so you know which orders are actually worth taking.',
    sections: [
      {
        heading: 'The commission nobody models properly',
        level: 2,
        body: 'When restaurants join Deliveroo, UberEats, or Just Eat, they typically focus on the volume of new orders — not the economics of each order. A restaurant doing £8,000/month in Deliveroo orders and paying 30% commission is paying £2,400/month to Deliveroo. On top of that: packaging at £0.50-£1.00 per order, potential menu inflation to partially offset the commission (which reduces order volume), and kitchen labour that is now split between dine-in and delivery. Run the numbers properly — food cost + packaging + platform commission + allocated kitchen overhead — and your net margin on a delivery order is often half of what it is on a dine-in equivalent. That is not necessarily a reason to quit delivery. But it is a reason to understand it and price accordingly.'
      },
      {
        heading: 'Commission rates by platform',
        level: 2,
        body: 'Commission rates vary by platform, tier, and negotiation. As a rough guide for UK restaurants: Deliveroo charges 25-35% of the order value, with rates depending on order volume and geographic exclusivity. UberEats charges 25-30%. Just Eat operates a hybrid model — some operators pay per-order commission, others pay a subscription fee plus a lower commission. All platforms charge the commission on the gross order value including VAT in some configurations, which means you pay commission on tax you collect for HMRC, not for yourself. Understanding exactly what your commission is calculated on is the first financial literacy step for any restaurant on a delivery platform.'
      },
      {
        heading: 'Modelling net margin per delivery order in AskBiz',
        level: 2,
        body: 'AskBiz pulls your delivery revenue from each platform (via direct API integrations) and automatically deducts the platform commission from the reported revenue to show net delivery revenue. Combined with your food cost data from the recipe library, you get net margin per delivery order — not gross. You can filter by platform, by dish, by day, and by time period. The output is clear: your Deliveroo fish and chips order generates £1.40 net margin. Your in-house fish and chips generates £9.20 net margin. Both sell at £14. The question becomes strategic: is the Deliveroo volume filling kitchen capacity that would otherwise be idle, or is it competing with dine-in for the same kitchen resources?'
      },
      {
        heading: 'Pricing strategy: should you charge more on delivery platforms?',
        level: 2,
        body: 'Most major delivery platforms now allow restaurants to set different prices for their delivery menus versus their dine-in menu. Some operators inflate delivery prices by 10-15% to partially recover the commission. This strategy works when your target delivery customer is not also a regular dine-in customer who will notice the discrepancy. It fails when your local repeat customers compare your Deliveroo menu to your in-house menu and feel penalised. AskBiz tracks average order value and order volume by platform separately, so you can model the impact of price changes on both revenue and order count before committing.'
      },
      {
        heading: 'The direct ordering channel: commission-free economics',
        level: 2,
        body: 'An increasingly popular strategy is building a direct ordering channel — a branded website or app — and using third-party platforms primarily for customer acquisition rather than ongoing retention. The economics shift dramatically: a direct order on your own website has zero platform commission, lower packaging costs if the customer collects, and a customer relationship you own (email, phone number, loyalty data). AskBiz integrates with direct ordering platforms like Flipdish and Pepper and shows you the blended economics across all channels. Some restaurants find that moving 20-30% of repeat customers from Deliveroo to direct ordering saves £800-1,200/month in commission on the same order volume.'
      },
      {
        heading: 'When delivery is worth it and when it is not',
        level: 2,
        body: 'Delivery makes economic sense when: your kitchen has spare capacity during off-peak hours that delivery fills (marginal cost is low), your delivery menu is engineered specifically for the channel with higher margins than your dine-in menu, or delivery serves a genuinely different customer segment that does not overlap with your dine-in revenue. Delivery makes less sense when: your kitchen is at capacity during peak hours and delivery is competing with higher-margin dine-in, your delivery menu mirrors your dine-in menu without margin adjustment, or your refund rate on delivery is above 3% (which wipes margin quickly). AskBiz shows you the data to answer these questions for your specific operation.'
      },
      {
        heading: 'Negotiating better commission rates',
        level: 2,
        body: 'Commission rates are not fixed. Restaurants with high order volumes — typically above £10,000-£15,000/month on a single platform — have negotiating leverage. AskBiz gives you a clean export of your monthly order volume, average order value, and revenue by platform. Armed with this, you can approach your platform account manager and negotiate. A 2-3% commission reduction on £12,000/month delivery revenue saves £240-360/month — or £2,880-£4,320/year. That conversation pays for several years of AskBiz subscription on its own.'
      }
    ],
    paa: [
      { q: 'How much commission does Deliveroo charge?', a: 'Deliveroo charges 25-35% commission on order value for most UK restaurant partners. Rates vary by volume, location, and contract terms.' },
      { q: 'Can I charge different prices on Deliveroo versus my restaurant?', a: 'Yes. Most major delivery platforms allow different menu pricing for delivery versus dine-in. Many restaurants inflate delivery prices by 10-15% to partially offset commission.' },
      { q: 'How do I calculate net margin on delivery orders?', a: 'Net margin = Order value − Platform commission − Food cost − Packaging − Allocated labour. AskBiz calculates this automatically by pulling commission data via API and combining it with your food cost data.' },
      { q: 'Is it worth being on multiple delivery platforms?', a: 'Depends on your kitchen capacity and order economics. Multiple platforms increase reach but multiply operational complexity. Model the net margin by platform before expanding to a new one.' },
      { q: 'How can I reduce delivery platform commission costs?', a: 'Negotiate volume-based rates, build a direct ordering channel for repeat customers, optimise your delivery menu for higher-margin dishes, and remove loss-making items from your delivery menu.' }
    ],
    cta: {
      heading: 'AskBiz calculates your true net margin per delivery platform — before commission makes it a surprise',
      body: 'See exactly what each delivery channel earns you. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-online-ordering-integration-pos',
      'restaurant-menu-engineering-profitability',
      'restaurant-cogs-monthly-tracking'
    ]
  },

  // ─── Article 10 ───────────────────────────────────────────
  {
    slug: 'restaurant-loyalty-programme-repeat-customers',
    title: 'Loyalty That Works: Getting Restaurant Guests Back 40% More Often',
    metaDescription: 'Generic stamp cards do not build restaurant loyalty. Learn how AskBiz connects POS data to targeted loyalty programmes that increase visit frequency and average spend.',
    cluster: 'Restaurant Operations',
    pillar: 'Customer Retention',
    publishDate: '2025-09-22',
    readTime: 7,
    tldr: 'Acquiring a new restaurant customer costs 5-7x more than retaining an existing one. A loyalty programme that increases visit frequency from 2.1 to 2.9 times per year across your customer base can add £40,000-£60,000/year to a mid-size restaurant\'s revenue without a single new customer.',
    sections: [
      {
        heading: 'Why restaurant loyalty programmes usually fail',
        level: 2,
        body: 'The stamp card in your wallet from three restaurants ago says it all. Nine stamps. One away from a free coffee. You have not been to that restaurant in 11 months. Stamp cards and generic "10th meal free" programmes fail for two reasons: they are not personalised (everyone gets the same offer regardless of what they order or how often they visit), and they do not connect to any data about the customer. The restaurant has no idea you visited three times in January and then disappeared. There is no trigger to bring you back. Effective loyalty requires knowing who your customers are, what they order, when they lapsed, and what offer would bring them back. That requires POS-connected loyalty, not paper cards.'
      },
      {
        heading: 'What POS-connected loyalty actually enables',
        level: 2,
        body: 'When loyalty is connected to your POS, every visit and every purchase is recorded against an individual customer profile. You know that customer A visits every Tuesday for lunch, always orders the salmon salad and a glass of house white, and spends an average of £22. You know that customer B has not been in for 67 days after visiting three times in a month. You know that customer C always upgrades to dessert when prompted by the server. This data enables targeted, personalised loyalty: send customer B a "We miss you" email with a specific offer tied to their last order. Remind customer A that they are one visit from a free glass of wine. Prompt the server to offer customer C the dessert they always order.'
      },
      {
        heading: 'Structuring a loyalty programme that drives profitable behaviour',
        level: 2,
        body: 'A loyalty programme should reward the behaviour you want, not just frequency of visits. If your goal is to increase midweek covers (Tuesday-Thursday), offer double points for midweek visits. If you want to increase average spend, offer bonus rewards for orders above £30. If you want to shift menu mix towards higher-margin dishes, create a "dish of the month" bonus that rewards ordering it. AskBiz lets you configure reward triggers against any POS data point: visit day, order value, specific items ordered, time since last visit. These are not complex to set up — but they require POS integration to function. Generic stamp card apps cannot access this data.'
      },
      {
        heading: 'Lapsed customer reactivation: the highest-ROI campaign',
        level: 2,
        body: 'Lapsed customers — those who visited at least twice but have not returned in 45-60 days — are your most valuable acquisition target. They already know your restaurant, they liked it enough to come back once, and they have simply drifted. AskBiz identifies lapsed customers automatically (based on your defined lapse threshold) and triggers a reactivation sequence: Day 45 — "We have not seen you in a while" email with a simple offer. Day 60 — SMS reminder if email was not opened. Day 90 — final offer, stronger incentive. Reactivation campaigns from AskBiz typically achieve 12-18% return rates on lapsed customer segments. At an average £28 spend per visit, a 15% reactivation rate on 200 lapsed customers generates 30 additional covers — £840 in one campaign.'
      },
      {
        heading: 'Birthday and occasion marketing',
        level: 2,
        body: 'Birthday offers are one of the most consistently effective restaurant marketing tactics. A personalised birthday offer sent 5 days before a customer\'s birthday has a redemption rate of 30-45% — five to ten times higher than a generic promotional email. The offer does not need to be expensive: a complimentary dessert or a glass of Prosecco on the birthday visit costs £3-5 and generates an average cover of £28-45 as the birthday person brings a group. AskBiz captures date of birth at loyalty sign-up and automates the birthday email sequence. No manual list management, no forgotten campaigns. Every enrolled loyalty member gets their birthday offer automatically.'
      },
      {
        heading: 'Measuring loyalty ROI: the metrics that matter',
        level: 2,
        body: 'Measuring a loyalty programme requires four metrics: enrolment rate (what percentage of covers join the programme), visit frequency change (how often loyalty members visit versus non-members), average spend difference (do loyalty members spend more per visit), and reactivation rate (what percentage of lapsed members return after a campaign). AskBiz tracks all four and shows them in a loyalty dashboard. If loyalty members visit 2.8 times per year versus 1.9 times for non-members, and spend £26 versus £23 on average, the loyalty programme is delivering measurable incremental revenue. If there is no difference, the programme structure needs reviewing.'
      },
      {
        heading: 'Implementation: from zero to enrolled in 30 days',
        level: 2,
        body: 'AskBiz loyalty can be deployed in 30 days without a separate app or complex integration. Customers join via QR code on the table, via the checkout flow on your website, or by providing their phone number or email at the point of sale. Sign-up incentive (10% off next visit, or a complimentary drink) drives initial enrolment. From there, every visit is tracked automatically through the POS. Most restaurants see 15-25% of regular customers enrol in the first 60 days. That customer base becomes your most targeted, most responsive marketing audience — and your most reliable revenue foundation.'
      }
    ],
    paa: [
      { q: 'Do restaurant loyalty programmes actually increase revenue?', a: 'Yes, when they are POS-connected and data-driven. Generic stamp cards show minimal impact. Programmes that track individual customer behaviour and personalise communications show 25-40% higher visit frequency among enrolled members.' },
      { q: 'What is the best loyalty programme structure for a restaurant?', a: 'Points-based with behaviour triggers is most effective. Award points for visits, for high-value orders, and for midweek visits (if that is a business priority). Add birthday rewards and lapsed-customer reactivation triggers for maximum impact.' },
      { q: 'How do I get restaurant customers to join a loyalty programme?', a: 'Offer a tangible immediate incentive (discount on next visit or complimentary item). Make sign-up effortless — QR code at table or phone number at POS. Follow up with a personalised welcome and the promised reward within 24 hours.' },
      { q: 'Does AskBiz have a built-in loyalty programme?', a: 'Yes. AskBiz includes a POS-connected loyalty module with points tracking, automated email/SMS campaigns, birthday rewards, and lapsed customer reactivation triggers.' },
      { q: 'How much does it cost to acquire a new restaurant customer vs retain an existing one?', a: 'Industry research consistently shows customer acquisition costs 5-7x more than retention. A customer who returns twice per year is worth far more than a one-time visitor from a paid ad campaign.' }
    ],
    cta: {
      heading: 'AskBiz connects your POS to a loyalty programme that brings guests back 40% more often',
      body: 'Stop losing regulars to inaction. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-tiktok-ads-customer-acquisition',
      'restaurant-google-my-business-reservations',
      'restaurant-gift-card-revenue-recognition'
    ]
  },

  // ─── Article 11 ───────────────────────────────────────────
  {
    slug: 'restaurant-kitchen-display-system-efficiency',
    title: 'KDS vs Paper Tickets: Why Digital Kitchen Displays Reduce Errors by 60%',
    metaDescription: 'Paper kitchen tickets cause mis-fires, delays, and errors that cost restaurants £500-£1,500/month. Learn how a Kitchen Display System in AskBiz reduces errors and speeds service.',
    cluster: 'Restaurant Operations',
    pillar: 'Kitchen Operations',
    publishDate: '2025-09-24',
    readTime: 7,
    tldr: 'The kitchen printer spits out a ticket. The chef picks it up, shouts it to the line, and pins it to the rail. By the time table 14\'s main course is ready, the ticket has fallen, been covered by another, and the server has already asked twice. A KDS eliminates all of this — and reduces order errors by 50-65%.',
    sections: [
      {
        heading: 'The paper ticket problem at scale',
        level: 2,
        body: 'A 60-cover restaurant doing 120 covers on a Saturday night generates roughly 180-240 kitchen tickets: starters, mains, modifications, re-fires, delivery orders. Each ticket is a piece of paper that can be misread, covered, lost, or misordered. The average kitchen error rate with paper tickets is 6-10% — somewhere between 1 in 10 and 1 in 16 dishes prepared incorrectly, delivered late, or sent back. Each error costs money: a re-fired dish adds £3-8 in food cost, a delay causes table dissatisfaction (and potentially a refund or reduced tip), and consistent errors drive negative reviews. On 200 covers at an 8% error rate, that is 16 problematic covers per service.'
      },
      {
        heading: 'What a Kitchen Display System actually does',
        level: 2,
        body: 'A KDS is a screen (typically 15-24 inch commercial display) mounted at each kitchen station — grill, fryer, cold larder, pass — that shows orders in real time as they come from the POS. No printer, no paper, no ticket rails. When a table orders two steaks and a salmon, the grill station sees "Table 14 — 2x Fillet med, 1x Salmon" appear on screen instantly. The order has a timer. When the grill station marks it "ready," the larder station sees the signal to send up the garnish. When the pass marks all components of table 14 ready, the server is notified. Every step is visible, timed, and logged. No ticket falls off the rail. No handwriting is misread. No order is forgotten because it was buried under three others.'
      },
      {
        heading: 'Reducing errors and mis-fires',
        level: 2,
        body: 'Research from QSR Magazine puts average KDS error reduction at 50-65% versus paper ticket systems. The improvement comes from three factors: legibility (no handwriting to misinterpret), sequencing (KDS can organise orders by course, by station, and by fire time), and accountability (every order is timestamped — if table 14 waited 28 minutes for a main course, the system records it). At an 8% paper error rate reducing to 3% on KDS, on 200 covers at £28 average, that is 10 fewer errors per service. If each error costs £5 in re-fire cost and potentially £10 in comps or refunds, the saving is £150 per service — £450/week on a three-service operation, £23,400/year.'
      },
      {
        heading: 'Integration with AskBiz POS and delivery channels',
        level: 2,
        body: 'AskBiz KDS is fully integrated with the POS — dine-in orders from servers, counter orders from walk-ins, and delivery orders from Deliveroo, UberEats, and Just Eat all appear on the same KDS screen. There is no separate delivery tablet for the kitchen. All orders are in one queue, prioritised by fire time and course sequencing. The chef does not need to check multiple screens — one display shows everything. This integration also means that when a delivery order arrives during a busy service, it is slotted into the existing kitchen queue based on its required completion time, not added to a separate pile on a third-party tablet.'
      },
      {
        heading: 'Ticket timing data: knowing where your kitchen loses time',
        level: 2,
        body: 'Every order that flows through AskBiz KDS is timestamped from order-fired to dish-complete. Over time, this data surfaces patterns: starter average completion 8 minutes, main course average 14 minutes, but mains on Tuesday lunches average 22 minutes — suggesting understaffing or production bottlenecks on that session. If a specific dish consistently adds 6 minutes to its station\'s queue, it may need prep changes, a production shortcut, or adjusted menu placement to reduce order frequency at peak times. This level of kitchen performance data is entirely invisible with paper tickets. With AskBiz KDS, it is a standard report.'
      },
      {
        heading: 'Server notification and front-of-house coordination',
        level: 2,
        body: 'AskBiz KDS connects to the front-of-house through server notification on handhelds. When the pass marks a table\'s course ready, the assigned server receives a notification on their handheld POS device. They do not need to hover near the pass or check manually. The reduction in server time spent pass-checking frees them for table interaction — upselling, guest experience, additional order-taking. In a 10-server restaurant, eliminating pass-checking saves approximately 45 minutes per service per server — or 7.5 hours of productive server time per service that is redirected to the floor.'
      },
      {
        heading: 'Cost and implementation: faster than you think',
        level: 2,
        body: 'A KDS setup for a typical restaurant — two to four kitchen screens plus pass display — costs £400-£900 in hardware (commercial-grade Android or dedicated KDS displays). Software is included in AskBiz POS subscription at no additional cost. Implementation typically takes one afternoon: mount screens, connect to your AskBiz network, configure station assignments (which courses go to which display), and train the team. Most kitchens are fully operational on KDS within two days of hardware installation. The hardware cost pays for itself in error reduction within 4-6 weeks for any restaurant doing over 80 covers per service.'
      }
    ],
    paa: [
      { q: 'What is a Kitchen Display System (KDS)?', a: 'A KDS is a screen-based system that replaces paper kitchen tickets. Orders from the POS appear on screens at each kitchen station in real time, with timers, course sequencing, and completion tracking.' },
      { q: 'How much does a KDS reduce kitchen errors?', a: 'Research puts the reduction at 50-65% versus paper ticket systems. Elimination of handwriting misreads, lost tickets, and sequencing errors is the primary driver.' },
      { q: 'Does AskBiz include a KDS?', a: 'Yes. AskBiz KDS is integrated with the POS at no additional software cost. All dine-in and delivery orders appear on a single kitchen queue with timing data.' },
      { q: 'How much does KDS hardware cost?', a: 'Typically £400-£900 for a 2-4 screen setup for a mid-size restaurant. Commercial-grade displays are recommended for heat and splash resistance in a kitchen environment.' },
      { q: 'Can a KDS handle delivery orders from multiple platforms?', a: 'Yes, when integrated with AskBiz. Deliveroo, UberEats, Just Eat, and direct website orders all appear in the same KDS queue as dine-in orders — no separate delivery tablet required.' }
    ],
    cta: {
      heading: 'AskBiz KDS replaces your paper ticket system and connects dine-in and delivery into one kitchen queue',
      body: 'Cut errors. Speed tickets. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-online-ordering-integration-pos',
      'restaurant-pos-system-table-management',
      'restaurant-real-time-revenue-dashboard'
    ]
  },

  // ─── Article 12 ───────────────────────────────────────────
  {
    slug: 'restaurant-supplier-invoice-reconciliation',
    title: 'Reconcile Supplier Invoices to Deliveries: Catch Overcharges Automatically',
    metaDescription: 'UK restaurants overpay suppliers by £200-£600/month due to unreconciled invoices. AskBiz matches every invoice to its delivery note and flags overcharges before you pay.',
    cluster: 'Restaurant Operations',
    pillar: 'Procurement & Suppliers',
    publishDate: '2025-09-26',
    readTime: 7,
    tldr: 'You receive a delivery from your produce supplier. The driver hands you an invoice. You sign the delivery note and file the invoice. Four days later you pay it. At no point did you check whether the 8kg of chicken listed on the invoice matches the 7.3kg that actually arrived. AskBiz does this check automatically.',
    sections: [
      {
        heading: 'The supplier invoice problem nobody talks about',
        level: 2,
        body: 'Supplier invoice errors are endemic in the hospitality supply chain. A survey of 200 UK independent restaurants found that 73% had paid at least one incorrect supplier invoice in the previous 12 months. The average overcharge was £380 per incident. Common errors: quantity overcharges (invoice says 12 units, delivery was 10), price creep (invoice reflects a price increase not communicated in advance), duplicate invoices (same delivery invoiced twice, rare but it happens), weight discrepancies (produce sold by weight where the delivered weight differs from the invoiced weight), and substitution errors (a more expensive product substituted for the agreed one without adjustment). Most of these errors are not intentional fraud — they are supplier administration failures. But the restaurant pays for them either way.'
      },
      {
        heading: 'Why most restaurants do not catch invoice errors',
        level: 2,
        body: 'The delivery arrives at 7:30am. The head chef or sous chef is prepping for a 12pm lunch service. The driver is waiting. The chef looks at the delivery, confirms it broadly matches what was ordered, signs the delivery note, and moves on. The invoice goes in a folder. The accounts person or owner pays it on Thursday. At no point between delivery and payment is there a systematic check of quantity delivered versus quantity invoiced, or price per unit invoiced versus price per unit agreed in the purchase order. This is not negligence — it is the reality of a busy kitchen environment where a 7-minute delivery check is not a priority when service starts in 4 hours.'
      },
      {
        heading: 'How AskBiz automates invoice reconciliation',
        level: 2,
        body: 'AskBiz creates a purchase order when you order from a supplier. When the delivery arrives, the receiving team confirms delivery quantities in AskBiz (item by item, on a tablet in the delivery area) — this takes 4-6 minutes. The confirmed delivery quantities are stored. When the supplier invoice arrives (by email, upload, or direct supplier portal), AskBiz compares the invoiced quantities and prices to: (1) the original purchase order, and (2) the confirmed delivery quantities. Any discrepancy above your configured threshold (e.g., more than £5 or 2%) triggers an alert with the specific line item. The invoice goes into a "needs review" queue rather than straight to payment.'
      },
      {
        heading: 'Catching price creep before it compounds',
        level: 2,
        body: 'Price creep is the slow, often-unannounced increase in per-unit prices that suppliers apply over time. A chicken breast that was £4.20/kg in January becomes £4.40 in March, £4.65 in June, and £4.90 by October. Each increase is small enough to pass unnoticed on an individual invoice. Across a full year and across all your suppliers, price creep can add £3,000-£8,000 to your annual food costs without triggering any alarm. AskBiz stores agreed prices for every supplier and every ingredient. Every invoice is checked against the agreed price. If the invoice price differs from the stored price by more than your threshold, it flags immediately. Price changes require a positive approval in AskBiz before the new price becomes the baseline — making every increase a conscious decision.'
      },
      {
        heading: 'Short deliveries: getting credit for what did not arrive',
        level: 2,
        body: 'Short deliveries — where you ordered and were invoiced for 10 items but received 9 — are common. Fresh produce especially: a case of 12 avocados listed as ordered may arrive with 11 viable fruit and one damaged. Without a systematic delivery check, you pay for 12 and use 11. AskBiz captures this at delivery confirmation. When the chef marks "11 received, 1 damaged on arrival," AskBiz generates a discrepancy note immediately. This feeds into the invoice review — you pay for 11, not 12, and the system tracks the credit claim with the supplier. Short delivery credits across a restaurant purchasing £15,000/week in food typically amount to £80-200/week — or £4,000-10,000/year that most restaurants just absorb as unexplained variance.'
      },
      {
        heading: 'Xero and QuickBooks integration: from delivery to P&L',
        level: 2,
        body: 'Once an invoice is reconciled and approved in AskBiz, it flows automatically to Xero or QuickBooks as a bill. Your accounts payable is always up to date. No manual data entry of supplier invoices. No "where did I file that Brakes invoice from Tuesday?" Your food cost appears on your P&L within hours of delivery, not at month-end when you manually enter a pile of invoices. Your accountant sees accurate accruals, not a lump of supplier payments hitting on random payment dates. This integration alone saves 3-5 hours per week in accounts administration for most mid-size restaurants.'
      },
      {
        heading: 'Real-world impact: a London restaurant group',
        level: 2,
        body: 'A three-site restaurant group in London began using AskBiz invoice reconciliation after noticing persistent unexplained food cost variance. In the first 90 days of automated reconciliation, they caught: £1,240 in quantity overcharges across three suppliers, £860 in price creep that had not been communicated, £420 in short deliveries that had been absorbed as food variance. Total recoveries: £2,520 in 90 days — or £10,080 annualised. Beyond the financial recovery, the discipline of requiring invoice approval before payment changed the supplier relationship: two suppliers who had previously inflated prices without notice now submitted correct invoices from the start, knowing the restaurant had systematic checks.'
      }
    ],
    paa: [
      { q: 'How common are supplier invoice errors in UK restaurants?', a: 'A survey of independent UK restaurants found 73% had paid at least one incorrect invoice in the past 12 months. Average overcharge was £380 per incident.' },
      { q: 'What is the most common type of supplier invoice error?', a: 'Quantity discrepancies (invoiced for more than delivered) and price creep (per-unit price increased without advance notice) are the two most common. Both are catchable with a systematic reconciliation process.' },
      { q: 'Does AskBiz integrate with Xero for supplier invoices?', a: 'Yes. Approved invoices in AskBiz sync automatically to Xero or QuickBooks as bills. This eliminates manual invoice data entry and keeps your food cost P&L current.' },
      { q: 'How long does delivery confirmation take with AskBiz?', a: 'Typically 4-6 minutes for a standard delivery. The receiving team confirms quantities on a tablet as the delivery is checked — the same time as a manual check, but with the data captured digitally.' },
      { q: 'Can AskBiz track agreed prices with suppliers?', a: 'Yes. You enter agreed prices per unit for each supplier and ingredient. Every invoice is automatically compared to the stored agreed price and flags any discrepancy above your configured threshold.' }
    ],
    cta: {
      heading: 'AskBiz catches overcharges, short deliveries, and price creep before you pay — automatically',
      body: 'Stop absorbing supplier errors as food cost variance. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-inventory-management-system',
      'restaurant-food-cost-percentage-too-high',
      'restaurant-cogs-monthly-tracking'
    ]
  },

  // ─── Article 13 ───────────────────────────────────────────
  {
    slug: 'restaurant-multi-location-performance-comparison',
    title: 'Running 3+ Restaurants? Compare Site Performance in One Dashboard',
    metaDescription: 'Multi-site restaurant operators waste hours consolidating reports from separate systems. AskBiz gives you a single dashboard to compare revenue, food cost, and labour across all sites.',
    cluster: 'Restaurant Operations',
    pillar: 'Multi-Site Management',
    publishDate: '2025-09-29',
    readTime: 8,
    tldr: 'If you run three or more restaurants and your monthly performance review involves opening three different POS back-offices, exporting spreadsheets, and manually combining them — you are running blind. AskBiz consolidates all sites into one dashboard so you can see the underperformer in 60 seconds.',
    sections: [
      {
        heading: 'The multi-site reporting nightmare',
        level: 2,
        body: 'You run four restaurants. Monday morning performance review: open the back office of site 1, export last week\'s revenue report, save to Desktop. Open site 2 back office, export, save. Sites 3 and 4 the same. Open Excel. Paste four reports. Build a pivot table. Try to remember why the column headers are in different formats for sites 2 and 3 because they are on different POS systems. Two hours later, you have a consolidated view of last week. By which point it is Tuesday. This is the reality for the majority of multi-site independent restaurant operators in the UK. The tools they grew up on were designed for one location. At three or four sites, the administrative burden of just reading the data has become a part-time job.'
      },
      {
        heading: 'What you actually need to see across sites',
        level: 2,
        body: 'Effective multi-site oversight requires six metrics visible simultaneously for all locations: revenue (week, month, year-on-year), food cost percentage, labour cost percentage, covers and average spend per cover, food waste as percentage of revenue, and gross profit. These six numbers tell you everything relevant about each site\'s performance. If site 3 is running 38% food cost while sites 1, 2, and 4 are at 30-31%, that is an immediate investigation priority — before you even look at the revenue numbers. If site 2 is your highest-revenue location but lowest-margin, you have a cost control problem hidden behind the busyness. Without comparative data across sites in real time, these patterns are invisible until month-end.'
      },
      {
        heading: 'How AskBiz unifies multi-site data',
        level: 2,
        body: 'AskBiz is built for multi-site operation. Each restaurant operates its own POS, inventory, and ordering module. Above that, a group-level dashboard aggregates all sites in real time. Revenue by site, by hour, by day, by week — available the moment the service ends. Food cost by site, updated as deliveries are received and waste is logged. Labour percentage by site, from the scheduling module. You can view group-level totals (all four restaurants combined) or site-by-site comparisons (revenue performance ranked from highest to lowest this week). One login, one interface, every metric for every site.'
      },
      {
        heading: 'Identifying your underperformer and why it matters',
        level: 2,
        body: 'In almost every multi-site restaurant group, there is one site that consistently underperforms on margin — while not necessarily underperforming on revenue. High-revenue, low-margin sites are dangerous because they feel successful. Busy covers every night, positive reviews, a full team. But the P&L tells a different story: high labour (over-staffed due to volume pressure), high food cost (pricing not matched to local supplier costs), and compressed net margin. Without comparative data, this site is celebrated alongside the genuinely healthy sites. With AskBiz dashboards, the underperformer is visible on the first screen of your Monday morning review.'
      },
      {
        heading: 'Best practice sharing between sites',
        level: 2,
        body: 'When site 1 drops food cost from 34% to 29% in two months through a combination of waste logging, demand-based ordering, and portion enforcement, AskBiz makes that improvement visible at group level. The site director can investigate what changed and replicate the approach at sites 2, 3, and 4. Without cross-site visibility, this best practice stays at site 1 indefinitely. Multi-site operators with centralised data consistently outperform those without — because the group learns collectively rather than each site learning independently. If your best manager\'s practices are not being surfaced and spread, you are leaving operational improvement on the table at every other site.'
      },
      {
        heading: 'Central purchasing and negotiating group discounts',
        level: 2,
        body: 'Once you have four sites with consolidated purchasing data in AskBiz, your buying volume becomes negotiating leverage. Instead of each site manager ordering independently from their preferred suppliers, a central purchasing function can aggregate volumes: four sites collectively purchasing £60,000/month of food rather than four independent orders of £15,000. At that volume, supplier negotiations become a different conversation. A 3% discount on £60,000/month saves £1,800/month — or £21,600/year. AskBiz provides the consolidated purchasing data needed to have this negotiation credibly.'
      },
      {
        heading: 'Compliance and standards: the hidden multi-site risk',
        level: 2,
        body: 'Multi-site restaurant groups face compliance risk that single-site operators do not. If one site has an allergen labelling failure, the reputational damage falls on the brand — not just the individual restaurant. If one site has a hygiene issue, it affects bookings at all four. AskBiz enables centralised standards management: allergen data attached to every recipe is available at every site. Menu changes approved centrally push to all sites simultaneously. Compliance checklists can be assigned and tracked from the group dashboard. This does not replace physical audits and management presence — but it provides a data layer that makes standards monitoring systematic rather than ad hoc.'
      }
    ],
    paa: [
      { q: 'What is the best POS system for a multi-site restaurant group?', a: 'Look for a system with a true group-level dashboard — not just site-level logins. AskBiz provides consolidated real-time reporting across all sites with one login, one interface, and comparative performance metrics.' },
      { q: 'How do I compare performance across multiple restaurant locations?', a: 'You need six key metrics visible simultaneously for all sites: revenue, food cost %, labour cost %, covers and average spend, waste %, and gross profit. AskBiz provides this in a single group dashboard.' },
      { q: 'Can AskBiz manage purchasing across multiple restaurant sites?', a: 'Yes. AskBiz consolidates purchasing data across all sites, enabling centralised ordering, group-level supplier negotiations, and comparative food cost reporting.' },
      { q: 'How do I identify the underperforming site in my restaurant group?', a: 'Focus on margin metrics rather than revenue. A site can be high-revenue and low-margin — often the most dangerous pattern. Compare food cost % and net profit % across sites weekly.' },
      { q: 'How do I replicate best practices across multiple restaurants?', a: 'Make performance data visible at group level so improvements at one site can be identified and replicated. AskBiz shows what each site is doing differently and tracks the impact when changes are implemented.' }
    ],
    cta: {
      heading: 'AskBiz consolidates all your restaurant sites into one dashboard — revenue, food cost, and labour in real time',
      body: 'Stop opening four back offices every Monday. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-real-time-revenue-dashboard',
      'asean-restaurant-cross-border-franchise',
      'restaurant-food-cost-percentage-too-high'
    ]
  },

  // ─── Article 14 ───────────────────────────────────────────
  {
    slug: 'singapore-hawker-centre-digital-payments',
    title: 'Singapore Hawker Going Cashless: PayNow, NETS, and What It Means for Your Margins',
    metaDescription: 'Singapore hawker stalls adopting PayNow and NETS face new cash flow and reporting questions. AskBiz tracks digital payment reconciliation and daily margins for hawker operators.',
    cluster: 'Restaurant Operations',
    pillar: 'Payments & Cash Management',
    publishDate: '2025-10-01',
    readTime: 7,
    tldr: 'Singapore hawker stalls are going cashless faster than any other F&B segment. PayNow QR, NETS, and Grab Pay now account for 60-70% of payments at progressive hawker stalls. But digital payments bring new complexity: settlement timing, reconciliation, and GST reporting that cash never required.',
    sections: [
      {
        heading: 'The cashless hawker: faster than expected',
        level: 2,
        body: 'Three years ago, a SGD 5 plate of chicken rice at a hawker centre was paid for in coins. Today, the same plate is paid for with a PayNow QR scan. The adoption has been driven by three forces: the Singapore government\'s Hawker Digitalisation Fund (which subsidised QR payment terminals), the pandemic-era reduction in cash-handling preference among consumers, and the generational shift as younger hawkerpreneurs open stalls with digital-first operations. For established hawkers, the transition raises practical questions that were never relevant with cash: when does the money actually arrive in my bank account, how do I reconcile different payment methods at end of day, and does accepting digital payments affect my GST position?'
      },
      {
        heading: 'PayNow vs NETS vs Grab Pay: the economics',
        level: 2,
        body: 'PayNow QR: typically zero MDR (merchant discount rate) for hawkers on government-subsidised schemes. Settlement is near-instant to your registered bank account. NETS: MDR varies by bank and contract, typically 0.5-1.0% for hawkers. Settlement within 1 business day. Grab Pay / DBS PayLah: MDR of 0.5-1.5% depending on contract. Settlement within 2-3 business days. The headline is that PayNow is essentially free to accept and almost instant to settle. The consideration is that PayNow requires a smartphone or QR display and depends on the customer having a SingPass-linked bank account — which covers 95%+ of Singapore residents. For tourist-heavy locations, NETS and card acceptance remain important.'
      },
      {
        heading: 'The settlement timing problem',
        level: 2,
        body: 'Cash arrives immediately. Digital payments settle on different schedules depending on the payment method. If you accept PayNow (same-day), NETS (next-day), and Grab Pay (2-3 days), your bank account receives money from Monday\'s trading on Monday, Tuesday, Wednesday, and potentially Thursday — in separate batches with different descriptions. Reconciling which batch corresponds to which trading day\'s revenue requires matching settlement reports from each payment provider to your daily sales totals. Without a system, this becomes a weekly accounting exercise that takes 1-2 hours and is still error-prone. AskBiz pulls settlement data from all connected payment methods and matches it to your daily POS totals automatically.'
      },
      {
        heading: 'Daily reconciliation for a hawker stall',
        level: 2,
        body: 'A hawker stall running SGD 1,500-3,000 daily revenue across three payment methods needs a simple end-of-day reconciliation process. AskBiz provides this: at close, the POS shows total sales by payment method — SGD 840 cash, SGD 620 PayNow, SGD 340 NETS, SGD 200 Grab. Cash is counted against the SGD 840 expected. Digital payments are confirmed against settlement notifications. Any gap between POS total and settled amount is flagged immediately. This takes 5 minutes instead of 30, and produces a documented record for every trading day — which becomes important if IRAS ever queries your declared revenue.'
      },
      {
        heading: 'GST implications of going cashless',
        level: 2,
        body: 'Most hawker stalls operate below the SGD 1 million annual revenue threshold and are not GST-registered. But as digital payments create more transparent revenue records, some stalls may find their documented revenue approaching or exceeding the threshold for the first time. This is not a reason to avoid digital payments — it is a reason to track revenue accurately and plan for potential GST registration. If your stall generates SGD 85,000-90,000 per month, the GST registration requirement may be approaching. AskBiz tracks your monthly revenue trend and flags when you are approaching thresholds that require regulatory attention, including GST registration.'
      },
      {
        heading: 'Inventory and ordering for hawker operations',
        level: 2,
        body: 'A hawker stall buying from wet markets and wholesale suppliers has a simpler supply chain than a restaurant — but the same food cost discipline applies. If your noodle dish costs SGD 1.80 in ingredients and sells for SGD 5, your food cost is 36% — above the recommended 30-32% even for hawker-style operations. AskBiz lets you enter your recipes and ingredient costs at wet market prices, and tracks how ingredient cost changes affect your food cost percentage. When the price of pork goes up 15% at the market, you can see immediately whether your dishes remain viable at current selling prices — and by how much you would need to adjust to maintain margin.'
      },
      {
        heading: 'AskBiz for hawker: what setup looks like',
        level: 2,
        body: 'A hawker stall using AskBiz typically sets up with a tablet POS running on an iPad or Android tablet, a Bluetooth receipt printer, a connected PayNow QR display, and optional NETS terminal. The full setup costs SGD 600-900 in hardware on a one-time basis. AskBiz software is SGD 49-79/month depending on features. At a stall doing SGD 2,000 daily revenue, recovering 2% in food cost improvement (SGD 40/day) pays for the software in less than 2 days per month. The government\'s Hawker Go Digital initiative provides subsidies for eligible stalls that further reduce the setup cost.'
      }
    ],
    paa: [
      { q: 'Is PayNow free for hawker stalls in Singapore?', a: 'Yes, under most government-subsidised hawker digitalisation schemes, PayNow QR is offered at zero MDR (merchant discount rate) for hawker stalls. Check with your bank or the IMDA Hawker Go Digital programme for current terms.' },
      { q: 'How do I reconcile PayNow and NETS payments at my hawker stall?', a: 'AskBiz pulls settlement data from PayNow, NETS, and other connected payment methods and automatically matches it to your daily POS sales totals. Discrepancies are flagged before you close for the day.' },
      { q: 'Does going cashless affect my GST position as a hawker?', a: 'Not directly — GST registration is triggered by revenue crossing SGD 1 million annually, not by payment method. However, digital payments create more transparent revenue records, which makes accurate tracking more important.' },
      { q: 'What is a reasonable food cost percentage for a Singapore hawker stall?', a: 'Aim for 30-34%. Hawker dishes sold at SGD 4-6 need tight ingredient management to remain viable. AskBiz tracks food cost by dish using wet market pricing.' },
      { q: 'Is AskBiz available in Singapore?', a: 'Yes. AskBiz supports SGD, GST reporting, PayNow/NETS integration, and CPF payroll exports for Singapore-based businesses.' }
    ],
    cta: {
      heading: 'AskBiz handles PayNow, NETS, and Grab Pay reconciliation automatically for Singapore F&B operators',
      body: 'Go cashless without the admin headache. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-cogs-monthly-tracking',
      'asean-restaurant-cross-border-franchise',
      'restaurant-real-time-revenue-dashboard'
    ]
  },

  // ─── Article 15 ───────────────────────────────────────────
  {
    slug: 'restaurant-vat-margin-scheme-uk',
    title: 'UK Restaurant VAT: Flat Rate, Standard Rate, and Which Saves You More',
    metaDescription: 'UK restaurant VAT is complex — flat rate vs standard rate, hot food rules, takeaway vs eat-in. Learn which VAT scheme saves your restaurant the most money and how AskBiz automates the reporting.',
    cluster: 'Restaurant Operations',
    pillar: 'Financial Compliance',
    publishDate: '2025-10-03',
    readTime: 8,
    tldr: 'Many UK restaurants are on the wrong VAT scheme and overpaying HMRC by £3,000-£8,000 per year. The difference between standard rate and flat rate VAT for a restaurant depends on your revenue mix, your VAT-able purchases, and your margin structure. AskBiz calculates which scheme is better for your specific numbers.',
    sections: [
      {
        heading: 'UK restaurant VAT is not simple',
        level: 2,
        body: 'VAT for restaurants has several layers that catch operators out. First, the distinction between hot and cold food: hot takeaway food is standard-rated at 20%, cold takeaway food is generally zero-rated. Second, the eat-in/takeaway split: food consumed on premises is standard-rated regardless of temperature. Third, alcoholic drinks: always standard-rated at 20%, even when the food element of a meal is cold. Fourth, delivery charges: if you deliver food, the VAT treatment of the delivery charge depends on the food being delivered. For a restaurant serving hot food for consumption on premises — the most common case — virtually all revenue is standard-rated at 20%. But the scheme you use to report and remit that VAT matters enormously.'
      },
      {
        heading: 'Standard rate VAT: how it works for restaurants',
        level: 2,
        body: 'Under standard rate VAT, you charge 20% VAT on your standard-rated sales, then reclaim the VAT paid on your business purchases (ingredients, equipment, utilities, etc.). Your quarterly VAT return pays the difference to HMRC: output VAT (what you charged customers) minus input VAT (what you paid on purchases). For a restaurant with £80,000 quarterly revenue (including VAT), output VAT is £13,333. If you paid £4,000 in VAT on food purchases, equipment, and utilities, you remit £9,333. Standard rate gives you the benefit of recovering input VAT on all significant purchases — including capital equipment, kitchen refits, and technology. This makes it more beneficial for restaurants with high taxable purchases.'
      },
      {
        heading: 'Flat rate VAT scheme: the trade-off',
        level: 2,
        body: 'The flat rate scheme allows eligible businesses (generally under £150,000 VAT-exclusive annual turnover) to pay a fixed percentage of their gross (VAT-inclusive) turnover to HMRC, instead of calculating actual VAT in and out. For catering and restaurants, the flat rate is 12.5% of gross turnover. You still charge customers 20% VAT. But you pay HMRC 12.5% of the VAT-inclusive total rather than the net difference. On £96,000 gross quarterly revenue (£80,000 + £16,000 VAT), you pay 12.5% = £12,000 to HMRC instead of £13,333 under standard rate. The saving is £1,333 per quarter — £5,332 per year. The trade-off: you cannot reclaim input VAT on purchases. If your purchases carry significant VAT, standard rate may actually save more.'
      },
      {
        heading: 'When standard rate is better than flat rate',
        level: 2,
        body: 'Standard rate beats flat rate when your VAT-reclaimable purchases are high relative to turnover. Typical scenarios: you are refurbishing your kitchen (large one-off VAT-reclaimable equipment), your food purchase VAT (fresh food is zero-rated, but alcohol and some other supplies carry VAT) is substantial, you have high utility costs (20% VAT), or you use significant services from VAT-registered suppliers (marketing agencies, accountants, POS software). Calculate: if your total quarterly VAT on purchases exceeds the flat rate saving (£1,333 per quarter in the example above), standard rate is better. AskBiz can model both scenarios from your actual purchase and sales data.'
      },
      {
        heading: 'The hot food trap: getting your categories right',
        level: 2,
        body: 'Incorrectly categorising food as zero-rated when it should be standard-rated is a common source of HMRC enquiries for UK restaurants. Hot food is defined as food that is heated for the purpose of enabling it to be consumed hot — not food that happens to be warm. A cold sandwich is zero-rated. A toasted sandwich is standard-rated. A restaurant claiming zero-rating on items that should be standard-rated is underreporting VAT and is exposed to retrospective VAT assessments plus interest and penalties. AskBiz assigns VAT categories to every menu item in your POS. Hot food items are flagged as 20%, cold takeaway items as 0%, alcoholic drinks as 20%. Your VAT return is prepared from POS data with correct categorisation applied automatically.'
      },
      {
        heading: 'Making Tax Digital for VAT: what it means for restaurants',
        level: 2,
        body: 'Since April 2022, all VAT-registered businesses (above the £90,000 threshold) must use Making Tax Digital compliant software to keep digital records and submit VAT returns. Manual spreadsheets are no longer compliant for quarterly submissions. AskBiz is a HMRC-recognised MTD-compatible software. Your restaurant\'s VAT return is compiled from digital POS records (categorised correctly at point of sale), reconciled against your supplier invoice data, and submitted directly to HMRC via the Making Tax Digital API. No manual data entry, no VAT spreadsheet to maintain, no risk of submitting an incorrectly categorised return.'
      },
      {
        heading: 'Getting a VAT health check',
        level: 2,
        body: 'If you have been running on the same VAT scheme for more than two years without reviewing it, the review is overdue. Your revenue may have changed (affecting flat rate eligibility), your purchase mix may have changed (affecting whether standard rate input recovery is more valuable), or you may have made capital purchases that justify a temporary switch back to standard rate. AskBiz provides a VAT optimisation report once per quarter that compares your actual VAT paid under your current scheme to what you would have paid under the alternative. The report is exportable for review with your accountant. In most cases, the optimisation exercise either confirms you are on the right scheme or identifies a switch worth making.'
      }
    ],
    paa: [
      { q: 'Should a UK restaurant use flat rate or standard VAT?', a: 'Depends on your purchase mix. Flat rate (12.5%) is typically better for restaurants with low VAT-reclaimable purchases. Standard rate is better when you have significant VAT on purchases — alcohol, equipment, utilities, VAT-registered services.' },
      { q: 'Is hot takeaway food subject to VAT?', a: 'Yes. Hot takeaway food is standard-rated at 20% in the UK. Cold takeaway food is generally zero-rated. Food eaten on premises is standard-rated regardless of temperature.' },
      { q: 'What is the flat rate for restaurants under VAT?', a: 'The HMRC flat rate for catering and restaurants is 12.5% of gross (VAT-inclusive) turnover. Check the current HMRC flat rate schedule as rates can change.' },
      { q: 'Is AskBiz Making Tax Digital compliant for VAT?', a: 'Yes. AskBiz is HMRC-recognised MTD-compatible software. VAT returns are compiled from digital POS records and submitted directly to HMRC via the MTD API.' },
      { q: 'How do I know if I am on the wrong VAT scheme?', a: 'Compare your quarterly VAT payment under your current scheme to what you would pay under the alternative, using your actual purchase and sales data. AskBiz generates this comparison automatically each quarter.' }
    ],
    cta: {
      heading: 'AskBiz categorises every sale correctly for UK VAT and submits your return via Making Tax Digital',
      body: 'Stop guessing on VAT. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-payroll-tips-reporting-uk',
      'restaurant-allergen-tracking-compliance-uk',
      'restaurant-cogs-monthly-tracking'
    ]
  },

  // ─── Article 16 ───────────────────────────────────────────
  {
    slug: 'restaurant-tiktok-ads-customer-acquisition',
    title: 'TikTok Ads for Restaurants: £500 Spend, 120 New Covers — Real Results',
    metaDescription: 'TikTok advertising is the most cost-effective customer acquisition channel for UK restaurants in 2025. Learn how to set up campaigns and track ROI back to actual covers via AskBiz.',
    cluster: 'Restaurant Operations',
    pillar: 'Marketing & Customer Acquisition',
    publishDate: '2025-10-06',
    readTime: 7,
    tldr: 'A regional restaurant spending £500 on a TikTok campaign targeting local food-lovers drove 120 new cover bookings in 3 weeks — a cost per acquired customer of £4.17. Compared to Google Ads (£18-35 cost per click in competitive restaurant searches), TikTok is currently the best-value acquisition channel for mid-size restaurants.',
    sections: [
      {
        heading: 'Why TikTok works for restaurants',
        level: 2,
        body: 'Restaurants are one of the most naturally TikTok-native business categories. Food is visual. Service is theatrical. The experience of a great meal, a dramatic dish presentation, or a beautifully lit dining room translates perfectly to 15-60 second vertical video. TikTok\'s algorithm distributes content based on engagement rather than follower count — which means a restaurant with 400 followers can reach 40,000 local food-lovers if the video is compelling. Unlike Facebook or Instagram, where declining organic reach forces businesses to pay for every impression, TikTok organic reach remains viable for well-produced content. And when you add paid promotion (TikTok Ads) to organic content, the combination creates a flywheel: organic builds credibility, paid extends reach, the two compound.'
      },
      {
        heading: 'Setting up a TikTok Ads campaign for a restaurant',
        level: 2,
        body: 'A TikTok campaign for a restaurant starts with three decisions: objective (what do you want people to do — visit your website, make a reservation, or follow your account), audience (geographic radius, age range, interests — "food and dining," "local restaurant discovery"), and creative (the video itself). For a restaurant targeting a 5-mile radius around its location, a TikTok Local Awareness campaign with a 25-35 age target and "dining and restaurants" interest targeting is a typical starting point. Budget: £15-20/day for 30 days. Creative: a 20-30 second video of your most visual dish, ambient dining room footage, and a clear call to action — "Book on our website" or "DM us for a table." Total: £500-600 for the campaign.'
      },
      {
        heading: 'Creative that actually works',
        level: 2,
        body: 'The creative is everything. TikTok users are sophisticated ad-avoiders — they skip content that feels like an ad within 1.5 seconds. The content that drives restaurant conversions is: authentic (phone-shot, not over-produced), appetising (close-up food shots, visible steam, sauces poured), social (staff personality, table atmosphere, genuine reactions from guests), and specific (real dishes with visible quality, not generic "great food, great vibes" copy). The first 1.5 seconds must show food or a compelling visual hook. The last 3 seconds must have a clear CTA. Everything in between should make the viewer genuinely want to be there. Restaurants that spend £500 on video production and £100 on ads consistently outperform restaurants that spend £100 on production and £500 on ads.'
      },
      {
        heading: 'Tracking TikTok ROI back to actual covers',
        level: 2,
        body: 'The persistent challenge with restaurant marketing is attribution — connecting an online ad to a physical cover in the restaurant. AskBiz helps with this through two mechanisms. First, promotional code tracking: each TikTok campaign uses a unique discount code ("TIKTOK10" for 10% off). When the code is redeemed at the POS, AskBiz attributes the cover to the TikTok campaign and records the associated revenue. Second, reservation source tracking: if your online booking platform (OpenTable, ResDiary) captures how the guest found you, AskBiz ingests this data and attributes revenue to the referral source. Over 8 weeks, you can calculate genuine cost per acquired cover for your TikTok spend.'
      },
      {
        heading: 'The £500 campaign: what it actually looked like',
        level: 2,
        body: 'A Spanish restaurant in Leeds ran a TikTok campaign over 21 days with a £500 budget. Content: a 28-second video of their paella being served tableside, ending with the tagline "Book before it sells out — link in bio." The video was boosted as a TikTok Ad to a 5-mile radius, 23-40 age group, food-interest targeting. Results: 38,000 impressions, 2,100 link clicks to the booking page, 120 new reservations tracked through a campaign booking link. Cost per reservation: £4.17. Average spend per reservation group: £72 (per table, not per cover). Total attributed revenue from the campaign: £8,640. Return on ad spend: 17:1. Not every campaign delivers this return — but the channel consistently outperforms alternatives for location-based restaurant marketing.'
      },
      {
        heading: 'TikTok and Google My Business: a combined strategy',
        level: 2,
        body: 'TikTok works best when it is reinforced by what customers find when they search for you after seeing your content. If someone watches your paella video, searches "Spanish restaurant Leeds," and finds a Google My Business profile with 30 reviews, great photos, and easy booking — they convert. If they find an out-of-date GMB profile with no booking link and three-year-old photos — they go to a competitor. AskBiz integrates with Google My Business to surface your POS data (popular times, current menu) on your GMB profile and connect the booking flow directly to your POS reservation system. TikTok gets people interested. Google converts them.'
      },
      {
        heading: 'Measuring beyond the campaign: long-term retention',
        level: 2,
        body: 'A customer acquired through TikTok is worth not just their first cover — it is every subsequent visit if they become a regular. AskBiz loyalty tracking captures whether TikTok-acquired customers (identified through the promo code or campaign booking link) return within 90 days, and at what frequency. If your TikTok customers return at the same rate as walk-in customers, the £4.17 acquisition cost is excellent. If they have a higher return rate (possible if the TikTok content attracted local food enthusiasts rather than one-time visitors), the lifetime value per acquired customer makes TikTok one of your best-performing channels. This retention data is what most restaurant marketing analysis misses — because it requires connecting ad data to POS loyalty data, which AskBiz does automatically.'
      }
    ],
    paa: [
      { q: 'How much should a restaurant spend on TikTok ads?', a: 'Start with £300-500 for a 3-week test campaign. £15-20/day is a viable daily budget for local awareness campaigns. Scale based on measured cost per acquired cover.' },
      { q: 'What type of TikTok content works best for restaurants?', a: 'Authentic, appetising, and specific. Close-up food shots, tableside service moments, and genuine staff or customer reactions outperform polished corporate-style production. First 1.5 seconds must be visually compelling.' },
      { q: 'How do I track TikTok ad ROI for my restaurant?', a: 'Use unique promo codes per campaign that are redeemed at the POS. AskBiz tracks code redemption, attributed revenue, and return visit rate for TikTok-acquired customers.' },
      { q: 'Is TikTok better than Google Ads for restaurants?', a: 'Currently, TikTok delivers lower cost per acquired customer for local restaurants (£4-8 per booking vs £18-35 per click on Google). Google Ads are better for capturing high-intent searches ("best Italian restaurant London tonight"). Both have a role.' },
      { q: 'Can AskBiz connect my marketing spend to actual restaurant revenue?', a: 'Yes. AskBiz tracks promotional code redemptions, reservation source data, and loyalty enrolment from specific campaigns, connecting your marketing spend to actual covers, revenue, and return visit rate.' }
    ],
    cta: {
      heading: 'AskBiz connects your TikTok campaigns to actual cover data — so you know exactly what your marketing is worth',
      body: 'Track every campaign from click to cover. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-loyalty-programme-repeat-customers',
      'restaurant-google-my-business-reservations',
      'restaurant-weekend-vs-weekday-revenue-split'
    ]
  },

  // ─── Article 17 ───────────────────────────────────────────
  {
    slug: 'restaurant-gift-card-revenue-recognition',
    title: 'Gift Card Revenue: When to Recognise It and How to Track Redemptions',
    metaDescription: 'UK restaurants frequently mishandle gift card accounting — recognising revenue at sale rather than redemption. AskBiz tracks gift card liability, redemptions, and breakage correctly.',
    cluster: 'Restaurant Operations',
    pillar: 'Financial Compliance',
    publishDate: '2025-10-08',
    readTime: 7,
    tldr: 'A restaurant selling £8,000 in Christmas gift cards in December and recording it as December revenue is making an accounting error — and potentially overstating profit by £8,000. Gift card revenue is a liability until the card is redeemed. AskBiz tracks the full gift card lifecycle.',
    sections: [
      {
        heading: 'The accounting error most restaurants make with gift cards',
        level: 2,
        body: 'Christmas and Valentine\'s gift card sales feel like free money. A customer pays £50 for a card before they have consumed anything. The money is in your bank account. The temptation — and the very common error — is to record that £50 as revenue in the month of sale. It is not. When a customer buys a gift card, they are purchasing a liability, not a service. The restaurant owes them £50 of food and drink at a future date. Under UK GAAP and IFRS 15, revenue from gift cards is recognised only when the card is redeemed — when the meal is consumed and the service is delivered. Recording gift card sales as immediate revenue overstates your profit for the sale month and understates it in future months when the cards are redeemed.'
      },
      {
        heading: 'What breakage revenue is and when you can take it',
        level: 2,
        body: 'Not all gift cards are redeemed. Industry data suggests 10-20% of restaurant gift cards expire unredeemed — a phenomenon called "breakage." Breakage represents genuine revenue — the customer paid, never came, and has no legal right to a refund after expiry. IFRS 15 allows revenue recognition of expected breakage proportionally as other cards are redeemed, if you have reliable historical data about your redemption rates. Alternatively, breakage can be recognised when the card expires. The key is consistency and documentation. AskBiz tracks your historical redemption rates by card cohort (cards sold in December 2023, redeemed when) so you can calculate breakage accurately and document it for your accountant.'
      },
      {
        heading: 'The correct accounting treatment',
        level: 2,
        body: 'When a £50 gift card is sold: Debit Cash £50, Credit Gift Card Liability £50. No P&L impact. When the card is redeemed for a £50 meal: Debit Gift Card Liability £50, Credit Revenue £50. P&L recognises the revenue in the month of consumption. When an expired card is written off as breakage: Debit Gift Card Liability £50, Credit Breakage Revenue £50. This treatment keeps your P&L accurate and your balance sheet clean. The gift card liability balance on your balance sheet represents your obligation to future diners — which is a real financial commitment, not an accounting abstraction. If you sold £20,000 in gift cards and your balance sheet shows zero liability, your accounts are wrong.'
      },
      {
        heading: 'Tracking gift card redemptions through AskBiz POS',
        level: 2,
        body: 'AskBiz assigns a unique code to every gift card sold. When a customer presents a gift card for payment, the server scans or enters the code at the POS. AskBiz validates the card (is it active? what is the remaining balance?), deducts the payment amount, and records the redemption against the original card sale record. The gift card liability balance updates in real time. If the card has a remaining balance after partial redemption, that balance remains in the liability account until the next use or expiry. Partial redemptions are tracked fully: a £100 card used for a £60 meal shows £40 remaining, which stays as a liability until redeemed or expired.'
      },
      {
        heading: 'Gift cards and cash flow: December\'s double benefit',
        level: 2,
        body: 'While gift cards must be accounted for as liabilities, they provide a genuine cash flow benefit. You receive cash in December — your highest-revenue month — for meals that will be consumed in January-March — your lowest-revenue months. This timing naturally helps smooth your seasonal cash flow. The £8,000 in December gift card sales received as cash reduces the cash shortfall in January when those cards are spent (the P&L shows revenue in January, but the cash already arrived in December). For cash flow planning, AskBiz treats gift card sales as cash inflows in the sale month and gift card redemptions as non-cash revenue in the redemption month, giving you an accurate cash flow picture alongside the correct accrual P&L.'
      },
      {
        heading: 'Expiry policies and customer communication',
        level: 2,
        body: 'UK consumer law requires gift card expiry terms to be clearly communicated at the point of sale. Expiry periods under 12 months are rarely enforceable for high-value gift cards under the Consumer Rights Act 2015. Most restaurant gift cards carry 12-24 month expiry periods. AskBiz sends automated reminders to gift card holders when their card is approaching expiry — typically at 60 days and 30 days before the expiry date. This both serves the customer (preventing expiry frustration and a negative brand experience) and serves the restaurant (reducing the liability account as cards are redeemed before expiry, generating revenue in a more predictable pattern).'
      },
      {
        heading: 'Reporting for your accountant',
        level: 2,
        body: 'Your accountant needs three numbers at year-end: total gift cards sold in the period, total gift cards redeemed in the period, and the closing gift card liability balance. AskBiz generates a gift card reconciliation report on demand, showing all of these figures with supporting transaction detail. The report is formatted for direct use in your statutory accounts preparation — no manual reconciliation needed. For restaurants selling more than £5,000/year in gift cards, having this report ready saves 2-4 hours of accountant time per year and removes a common source of accounting errors from your year-end process.'
      }
    ],
    paa: [
      { q: 'When should a restaurant recognise gift card revenue?', a: 'At redemption, not at sale. Under IFRS 15 and UK GAAP, gift card revenue is recognised when the service is delivered (when the card is used for a meal), not when the customer buys the card.' },
      { q: 'What is breakage revenue for gift cards?', a: 'Breakage is the proportion of gift cards that expire unredeemed. This becomes genuine revenue — either proportionally as other cards are redeemed (if you have reliable breakage history) or at expiry.' },
      { q: 'Does AskBiz track gift card redemptions?', a: 'Yes. AskBiz assigns unique codes to every gift card, validates them at POS redemption, tracks partial redemptions, and maintains the gift card liability balance in real time.' },
      { q: 'Is it legal to have an expiry date on restaurant gift cards?', a: 'Yes, but expiry terms must be clearly communicated at point of sale. Expiry periods under 12 months are rarely enforceable under the Consumer Rights Act 2015. Most restaurant gift cards carry 12-24 month terms.' },
      { q: 'How do gift cards affect restaurant cash flow?', a: 'Positively for December-heavy sellers: cash arrives in December (your highest month) for meals served in January-March (your quietest period). The P&L recognises revenue at redemption, but the cash arrives earlier.' }
    ],
    cta: {
      heading: 'AskBiz tracks every gift card from sale to redemption to expiry — and keeps your liability account accurate automatically',
      body: 'Get your gift card accounting right. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-vat-margin-scheme-uk',
      'restaurant-cash-flow-seasonal-planning',
      'restaurant-cogs-monthly-tracking'
    ]
  },

  // ─── Article 18 ───────────────────────────────────────────
  {
    slug: 'restaurant-cogs-monthly-tracking',
    title: 'COGS Tracking Monthly: The Single Metric That Predicts Restaurant Failure',
    metaDescription: 'Cost of Goods Sold (COGS) is the one number that predicts restaurant financial health before a crisis hits. Learn how to track COGS monthly with AskBiz and what the warning signs look like.',
    cluster: 'Restaurant Operations',
    pillar: 'Financial Management',
    publishDate: '2025-10-10',
    readTime: 8,
    tldr: 'Restaurants that close usually had visible warning signs 4-6 months before: COGS trending up, margin trending down, cash reserves thinning. The problem is they had no system to see these signals early. AskBiz tracks COGS monthly so you know in October what will become a crisis in January.',
    sections: [
      {
        heading: 'What COGS is and why it matters more than revenue',
        level: 2,
        body: 'Revenue tells you how busy you are. COGS tells you whether being busy is actually making you money. Cost of Goods Sold in a restaurant is the direct cost of the food and beverages consumed to generate your sales — what was bought, less what was left in stock. If you started the month with £8,000 of stock, bought £22,000 more, and ended with £6,500, your COGS was £23,500. If your revenue was £72,000, your gross margin was 67.4%. If your COGS was £26,000 on the same revenue, your gross margin was 63.9% — a 3.5 percentage point difference that translates to £2,520/month in lost margin. COGS is the denominator of every restaurant financial decision. Without it, you are running blind.'
      },
      {
        heading: 'Why most restaurants do not track COGS properly',
        level: 2,
        body: 'Proper COGS calculation requires an accurate opening stock count, accurate recording of all purchases during the period, and an accurate closing stock count. Most restaurants do the middle part (they have supplier invoices), miss or approximate the stock counts, and therefore cannot calculate a true COGS figure. Instead, they use total purchases as a proxy for COGS — which is significantly less accurate because it ignores the change in stock value. A month where you stocked up for Christmas has high purchases but the stock is not consumed until December. Using purchases as COGS would overstate your costs in November and understate them in December. The distortion can be £2,000-£5,000 for a mid-size restaurant, making month-on-month comparisons meaningless.'
      },
      {
        heading: 'Monthly COGS tracking with AskBiz',
        level: 2,
        body: 'AskBiz maintains a running stock value at all times: opening balance updated by deliveries received and reduced by sales (via recipe deductions from the POS) and waste logged. At end of month, AskBiz calculates COGS automatically: opening stock + purchases − closing stock count (you do a physical count to verify the system balance). The physical count takes 30-45 minutes for a mid-size restaurant when you are using AskBiz — because the system tells you what the balance should be, and you are spot-checking the high-value items rather than counting everything from scratch. The result: an accurate COGS figure available by the 5th of the following month at the latest, not the 25th when your accountant sends the management accounts.'
      },
      {
        heading: 'Warning signs in monthly COGS trends',
        level: 2,
        body: 'The most valuable use of monthly COGS tracking is trend analysis. A single month of 35% COGS may be explainable — high wastage due to a quiet month, a one-off expensive event, a seasonal spike in ingredient prices. Three consecutive months of 35% COGS is a structural problem that needs investigation. AskBiz shows COGS percentage over the trailing 12 months as a line chart on the management dashboard. When the line starts trending up — from 30% to 31% to 32% over three months — it is visible before it reaches 35%. The early visibility allows intervention: recipe review, waste reduction initiative, supplier price negotiation. By the time month-end accounts arrive from your accountant, it is already too late to act on that month\'s COGS.'
      },
      {
        heading: 'Separating food COGS from beverage COGS',
        level: 2,
        body: 'Food and beverage have different COGS benchmarks. Food typically runs 28-35% COGS for casual dining. Beverage — particularly wine and cocktails — should run 20-28% COGS. If you track them blended, a high-beverage-revenue Saturday evening artificially improves your apparent COGS (because drinks have lower cost percentages), masking a problem on the food side. Equally, if your bar is running 35% COGS on spirits (possible with premium cocktail programmes), blending it with food hides the bar\'s underperformance. AskBiz separates food and beverage inventory and reports COGS for each category independently. You can benchmark your kitchen and bar separately and intervene where the problem actually is.'
      },
      {
        heading: 'COGS as a predictor of near-term viability',
        level: 2,
        body: 'Research on restaurant failure patterns consistently shows that rising COGS percentage is one of the earliest indicators — typically 4-6 months before cash flow becomes critical. The mechanism: rising COGS compresses gross margin, which compresses cash generation from operations, which reduces the buffer against fixed costs. A restaurant with a 68% gross margin has significant headroom to absorb a slow January. A restaurant with a 60% gross margin has very little. If COGS has been rising for three months before January, the restaurant enters the slow season with a structural disadvantage that the season itself exposes. Monthly COGS tracking through AskBiz identifies this trend while there is still time to act.'
      },
      {
        heading: 'Sharing COGS data with your accountant effectively',
        level: 2,
        body: 'The most productive conversation you can have with your accountant is one where you both have the same timely data in front of you. When you present monthly COGS data by the 5th of each following month, your accountant can provide meaningful analysis — rather than retrospective commentary on accounts prepared on day 25. AskBiz exports a management accounts pack monthly: P&L with COGS breakdown, gross margin by category, stock movement report, and trend analysis over 12 months. This pack replaces the ad hoc data requests that typically delay management account preparation by two to three weeks. Faster accounts means faster decisions.'
      }
    ],
    paa: [
      { q: 'How do I calculate COGS for my restaurant?', a: 'COGS = Opening Stock + Purchases − Closing Stock. Do this monthly with accurate stock counts. Using total purchases as a proxy overstates or understates actual COGS depending on stock movements.' },
      { q: 'What is a good COGS percentage for a restaurant?', a: 'Food: 28-35% for full-service restaurants. Beverage: 20-28%. Overall blended: 28-32%. Trending above these benchmarks for two or more consecutive months is a warning signal requiring investigation.' },
      { q: 'Does AskBiz calculate COGS automatically?', a: 'Yes. AskBiz maintains a running stock balance using sales data, deliveries, and waste logs. At month-end, a physical count is spot-checked against the system balance to produce an accurate COGS figure.' },
      { q: 'Why is tracking COGS monthly important for restaurants?', a: 'Monthly COGS reveals trends 4-6 months before they become cash flow crises. A COGS percentage rising from 30% to 34% over three months is invisible in annual accounts but actionable in monthly tracking.' },
      { q: 'Should I track food and beverage COGS separately?', a: 'Yes. Food and beverage have different cost benchmarks and different levers for improvement. Blending them hides whether the problem is in the kitchen, at the bar, or both.' }
    ],
    cta: {
      heading: 'AskBiz calculates your COGS automatically every month — and shows you the trend before it becomes a crisis',
      body: 'Know your numbers before your accountant does. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-food-cost-percentage-too-high',
      'restaurant-cash-flow-seasonal-planning',
      'restaurant-break-even-per-cover-calculation'
    ]
  },

  // ─── Article 19 ───────────────────────────────────────────
  {
    slug: 'restaurant-google-my-business-reservations',
    title: 'Google Reservations Direct to Your POS: Cut No-Shows by 35%',
    metaDescription: 'Google My Business now supports direct restaurant reservations. Connecting Google bookings to your POS reduces no-shows by 35% and eliminates manual booking entry. AskBiz makes it seamless.',
    cluster: 'Restaurant Operations',
    pillar: 'Customer Acquisition',
    publishDate: '2025-10-13',
    readTime: 7,
    tldr: 'When someone searches "restaurants near me" on Google and finds your listing, they can now book directly from the search result page. If that booking does not flow into your POS and reservation system automatically, you are creating a manual process gap that costs covers and accuracy.',
    sections: [
      {
        heading: 'Why Google My Business has become your most important reservation channel',
        level: 2,
        body: 'The customer journey for a restaurant reservation has fundamentally shifted. In 2019, a typical booking path was: see a recommendation, visit the restaurant website, find a booking form or phone number, make the reservation. Today, the path for a significant proportion of diners is: search Google, see your GMB listing with reviews and photos, tap "Reserve a Table" without leaving Google. Google\'s restaurant search features — including the "Reserve" button, menu preview, and "Popular times" data — make the GMB listing the de facto homepage for most restaurants. If your GMB profile is incomplete, your booking flow is broken, or the reservation does not connect to your POS, you are losing covers at the most critical touchpoint in the customer journey.'
      },
      {
        heading: 'How the Google reservation integration works',
        level: 2,
        body: 'Google partners with reservation platforms including OpenTable, ResDiary, SevenRooms, and others to enable the "Reserve" button on GMB listings. When a customer clicks Reserve, they are taken to a Google-hosted booking flow that pulls availability from your reservation platform in real time. The booking is confirmed by Google, sent to your reservation platform, and — when your reservation platform is connected to AskBiz — appears in your floor plan automatically. No phone call, no manual entry, no risk of double-booking. The entire flow takes the customer 45-60 seconds from Google search to confirmed reservation. Your team sees the booking on the POS floor plan before the customer has closed their browser.'
      },
      {
        heading: 'No-show reduction through deposit and pre-authorisation',
        level: 2,
        body: 'The industry average no-show rate for restaurant reservations is 10-15%. On a 60-cover restaurant doing two sittings with 20% reserved bookings (24 covers reserved), a 12% no-show rate means 2-3 covers per service that were reserved but never appeared. At £28 average, that is £56-84 per service, £390-590 per week, £20,000-£30,000 in annual lost revenue from reserved covers that did not show. Google-integrated reservation platforms can require card pre-authorisation or a deposit at booking. AskBiz integrates with Stripe to hold the deposit against the customer\'s card and release it upon arrival or process it as a no-show fee. This mechanism reduces no-show rates to 3-5% for most restaurants — a 35-60% improvement.'
      },
      {
        heading: 'Keeping your Google listing accurate',
        level: 2,
        body: 'The reservation integration only works if your GMB listing is accurate. Availability shown on Google must match your actual capacity. If you close on Mondays, Google must show no availability on Mondays. If you are fully booked for a specific session, the "Reserve" button must show no availability for that slot. AskBiz pushes your real-time availability — from the reservation module — to your connected booking platform, which updates Google. No manual GMB availability updates. No instances of customers booking through Google for a session you cannot accommodate because your GMB availability was not updated after you took phone bookings.'
      },
      {
        heading: 'Google reviews and conversion from search',
        level: 2,
        body: 'The GMB listing is not just a booking channel — it is your most visible review platform. Google reviews have a direct impact on click-through rates from search results: a listing with 4.7 stars and 140 reviews drives significantly more reservation clicks than a listing with 4.1 stars and 22 reviews. AskBiz helps drive Google review volume through post-visit email or SMS triggers: 3 hours after a confirmed reservation checkout, guests receive a "How was your visit?" message with a direct link to the Google review page. For customers who redeemed a promotional code, this trigger is automatic. Review response rates from this trigger average 18-24% — versus 2-4% from generic "please review us" requests.'
      },
      {
        heading: 'Popular times data: using Google insights for scheduling',
        level: 2,
        body: 'Google My Business shows "Popular times" data on restaurant listings — a histogram of visit frequency by hour. This data is based on aggregated, anonymised location data from Google Maps users and is visible to anyone who views your listing. It is also available to business owners in your GMB insights dashboard. AskBiz ingests this data alongside your POS revenue data to validate your own demand forecasts. If GMB shows high foot traffic on Wednesday evenings but your POS shows Wednesday evenings as consistently quiet, you may have a conversion problem — people are visiting but not ordering or not staying. This kind of cross-data insight is only possible when your marketing, booking, and POS data are connected.'
      },
      {
        heading: 'Setting up the integration in AskBiz',
        level: 2,
        body: 'Connecting Google reservations to AskBiz takes four steps. One: claim and verify your GMB listing. Two: connect your reservation platform (OpenTable, ResDiary, etc.) to your GMB profile via the GMB dashboard — this activates the Reserve button. Three: connect your reservation platform to AskBiz via the integration settings — this pulls reservations into your POS floor plan automatically. Four: configure Stripe pre-authorisation through AskBiz for deposit collection on reservations. Total setup time: 45-90 minutes. Once live, the system is fully automated — no manual steps for any reservation that comes through Google.'
      }
    ],
    paa: [
      { q: 'Can restaurants take reservations directly from Google?', a: 'Yes. Through Google\'s reserve functionality, customers can book directly from Google My Business listings. The booking goes through a connected reservation platform (OpenTable, ResDiary) and flows into your POS.' },
      { q: 'How do I reduce restaurant no-shows?', a: 'Require card pre-authorisation or a deposit at booking. This reduces no-show rates from 10-15% to 3-5%. AskBiz integrates with Stripe to collect and hold deposits from Google-linked reservation bookings.' },
      { q: 'Does AskBiz connect to Google My Business?', a: 'Yes. AskBiz integrates with GMB-connected reservation platforms to pull bookings directly into your POS floor plan and push real-time availability to your Google listing.' },
      { q: 'How do I get more Google reviews for my restaurant?', a: 'Use post-visit email or SMS triggers. AskBiz sends a review request 3 hours after a confirmed visit with a direct Google review link. Conversion rates are 18-24% versus 2-4% for generic review requests.' },
      { q: 'How much does a no-show cost a restaurant?', a: 'At 12% no-show rate on 24 reserved covers per service, a 60-cover restaurant loses £56-84 per service — or £20,000-£30,000 per year. Deposit collection reduces this loss by 60-70%.' }
    ],
    cta: {
      heading: 'AskBiz connects Google reservations to your POS floor plan automatically — and captures deposits to cut no-shows by 35%',
      body: 'Turn Google searches into confirmed, no-show-protected covers. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-pos-system-table-management',
      'restaurant-loyalty-programme-repeat-customers',
      'restaurant-tiktok-ads-customer-acquisition'
    ]
  },

  // ─── Article 20 ───────────────────────────────────────────
  {
    slug: 'restaurant-payroll-tips-reporting-uk',
    title: 'Tips, TRONC, and Payroll: Getting UK Restaurant Staff Payments Right',
    metaDescription: 'UK restaurant tip regulations changed significantly in 2024. Learn how the Employment (Allocation of Tips) Act affects your TRONC, payroll, and staff reporting — and how AskBiz automates compliance.',
    cluster: 'Restaurant Operations',
    pillar: 'Staff & Labour Management',
    publishDate: '2025-10-15',
    readTime: 8,
    tldr: 'The Employment (Allocation of Tips) Act 2023, effective October 2024, requires employers to pass 100% of tips to workers by the end of the following month. Non-compliance carries unlimited employment tribunal liability. AskBiz tracks tips at the POS and integrates with payroll to ensure compliant allocation and reporting.',
    sections: [
      {
        heading: 'The 2024 tips law that changed everything',
        level: 2,
        body: 'Before October 2024, some UK employers legally retained a proportion of card tips to cover administration costs, payment processing fees, or to subsidise lower base wages for some roles. That practice ended with the Employment (Allocation of Tips) Act 2023. From 1 October 2024, employers must pass 100% of all qualifying tips — whether cash or card — to workers, with no deductions except PAYE tax (through TRONC or payroll). The allocation must be "fair and transparent," with a written policy available to all staff on request. Failure to comply exposes employers to unlimited employment tribunal claims from individual workers. For a 20-person restaurant team where accumulated tip owed amounts to £200/month per worker, the liability exposure is significant.'
      },
      {
        heading: 'TRONC: what it is and how it works',
        level: 2,
        body: 'TRONC (from the French for a collection box) is a separate pay arrangement for distributing service charges and tips to restaurant workers. A TRONC scheme is administered by an independent TRONC master — often the head waiter, a senior staff member, or a third-party administrator. Tips paid through a properly structured TRONC are not subject to employer National Insurance contributions (a significant saving — currently 13.8% of tip value). Employee NIC and income tax still apply. The TRONC master allocates tips according to an agreed scheme: typically by hours worked and role weighting (servers receive a higher share than kitchen staff in most schemes, though this is contested by many operators). AskBiz integrates with TRONC software to pull tip data from the POS directly into the distribution calculation.'
      },
      {
        heading: 'Tracking tips at the point of sale',
        level: 2,
        body: 'Tips arrive through multiple routes: cash left on the table, card tips added at the payment terminal, and discretionary service charges (optional) added to bills. AskBiz records every tip separately from revenue at the POS: the transaction captures the tip amount, the payment method (cash or card), and the server who processed the transaction. This creates a complete, auditable record of tips received — which is a legal requirement under the Tips Act. The record supports both the TRONC master\'s distribution calculation and HMRC reporting requirements. Without this record, you cannot demonstrate fair and transparent allocation — which is a specific requirement of the Act.'
      },
      {
        heading: 'The service charge question: optional vs discretionary',
        level: 2,
        body: 'UK restaurants can add a service charge to bills. If the service charge is genuinely optional (the bill clearly states it is discretionary and it is removed on request without difficulty), it qualifies as a tip and must be allocated under the Tips Act. If the service charge is mandatory (automatically added and required), it is a contract price increase — not a tip — and the Tips Act does not apply, but VAT is charged on it. Most restaurants operate optional service charges (discretionary) that are rarely removed. These are tips. A compulsory 12.5% service charge is revenue. The distinction matters for VAT, National Insurance, and the Tips Act application. AskBiz captures service charge type at POS configuration and applies the correct tax treatment.'
      },
      {
        heading: 'Payroll integration: from tips to payslip',
        level: 2,
        body: 'Tips processed through TRONC appear on employee payslips as a separate income line. They are taxable as employment income but not subject to employer NIC (in a properly structured scheme). AskBiz exports weekly tip allocation data directly to Xero Payroll, Sage Payroll, and BrightPay for inclusion in the payroll run. The TRONC distribution — calculated from AskBiz tip records according to the scheme rules — becomes a payroll line for each eligible employee. This automation replaces a manual process that previously involved the TRONC master calculating distributions on a spreadsheet, emailing them to the payroll administrator, and manually entering them into the payroll system — a process prone to error and delay.'
      },
      {
        heading: 'Staff transparency requirements',
        level: 2,
        body: 'The Tips Act requires employers to have a written tips policy that is available to all workers on request. The policy must explain how tips are collected, how the TRONC operates, what the distribution criteria are, and how workers can query their allocation. AskBiz provides a tips summary report that each employee can access via the staff portal — showing their total tips received (by their tables), the amount allocated through the TRONC distribution, and the net amount paid in each payroll period. This transparency requirement is both legally mandated and practically valuable: tip disputes between staff are the most common source of kitchen-floor friction, and transparent data reduces this significantly.'
      },
      {
        heading: 'Common mistakes and how to avoid them',
        level: 2,
        body: 'Five most common Tips Act compliance errors: (1) Failing to allocate kitchen staff any share of tips — the Act does not specify required kitchen shares, but an allocation of zero to back-of-house is likely to be challenged as unfair. (2) Taking credit card processing fees out of tip amounts before allocation — not permitted under the Act. (3) Delaying tip payment beyond the end of the month following collection — the Act sets a one-month payment deadline. (4) Failing to document the allocation method — the written policy requirement is often overlooked. (5) Treating mandatory service charges as tips — they are not; the treatment is different. AskBiz compliance settings prompt you to address each of these before the first payroll run under the new regime.'
      }
    ],
    paa: [
      { q: 'What does the UK Employment (Allocation of Tips) Act 2023 require?', a: 'From October 2024, UK employers must pass 100% of qualifying tips to workers by the end of the month following collection. A written tips policy must be available to all staff on request.' },
      { q: 'Does a restaurant TRONC scheme save on National Insurance?', a: 'Yes. Tips distributed through a properly structured TRONC are not subject to employer NIC (currently 13.8%). Employees still pay income tax and employee NIC on tips received.' },
      { q: 'Do kitchen staff have to receive a share of restaurant tips?', a: 'The Act does not specify mandatory kitchen shares, but allocating zero to back-of-house is likely to be considered unfair and challengeable at employment tribunal.' },
      { q: 'Can restaurants deduct card processing fees from tips?', a: 'No. The Employment (Allocation of Tips) Act 2023 prohibits any deductions from tip amounts before allocation to workers, including payment processing fees.' },
      { q: 'Does AskBiz track tips for TRONC purposes?', a: 'Yes. AskBiz records every tip by amount, payment method, and server at the POS, creating an auditable record. This data exports directly to TRONC distribution software and payroll platforms.' }
    ],
    cta: {
      heading: 'AskBiz tracks every tip from the POS, allocates through TRONC, and exports to payroll — fully compliant with the 2024 Tips Act',
      body: 'Stop worrying about tip compliance. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-staff-scheduling-labour-cost',
      'restaurant-vat-margin-scheme-uk',
      'restaurant-allergen-tracking-compliance-uk'
    ]
  },

  // ─── Article 21 ───────────────────────────────────────────
  {
    slug: 'asean-restaurant-cross-border-franchise',
    title: 'Expanding Your Restaurant Brand from Singapore to KL: What Changes',
    metaDescription: 'Expanding a restaurant brand from Singapore to Malaysia involves currency, tax, supplier, and compliance changes. AskBiz supports multi-currency, multi-jurisdiction restaurant operations across ASEAN.',
    cluster: 'Restaurant Operations',
    pillar: 'Multi-Site Management',
    publishDate: '2025-10-17',
    readTime: 8,
    tldr: 'Taking a profitable Singapore restaurant concept to Kuala Lumpur seems straightforward. Same cuisine, similar culture, proximity. In practice, six operational changes hit simultaneously: currency, tax regime, supplier network, labour law, payment infrastructure, and consumer behaviour. AskBiz manages the operational complexity so you can focus on the concept.',
    sections: [
      {
        heading: 'Why Singapore-to-Malaysia expansion fails operationally',
        level: 2,
        body: 'A Singapore café brand with two successful outlets in Orchard and Tanjong Pagar opens in KL Bangsar. The food is excellent. The branding translates. The Malaysian press is interested. Three months in, the margins are 40% lower than in Singapore. The issues: food costs are tracked in two currencies without a consolidated system, the Malaysian outlet is still being managed by the Singapore team who cannot read the local POS data remotely, the tax reporting is done manually because the accounting system was not configured for Malaysian SST, and the payroll is a spreadsheet because the Singapore payroll system does not handle Malaysian EPF and SOCSO. The concept works. The operations do not.'
      },
      {
        heading: 'Currency and pricing: SGD to MYR',
        level: 2,
        body: 'A Singapore concept pricing its menu in SGD needs to localise pricing for the Malaysian market — not just convert at the exchange rate, but consider local purchasing power, local competitor pricing, and local ingredient costs. A Singapore-sourced ingredient that costs SGD 8/kg may need to be sourced locally in Malaysia at MYR 18/kg. The food cost calculation is different in both currency and absolute terms. AskBiz supports multi-currency operations: each location operates in its local currency (SGD for Singapore, MYR for Malaysia), with a group-level view that converts to a single reporting currency for consolidated performance review. Food cost percentages are calculated in local currency, so comparisons are meaningful.'
      },
      {
        heading: 'Tax compliance: GST in Singapore vs SST in Malaysia',
        level: 2,
        body: 'Singapore charges 9% GST on F&B revenue for GST-registered businesses. Malaysia operates a Sales and Services Tax (SST) regime: the Service Tax at 8% applies to F&B businesses with annual revenue above MYR 1.5 million. Both systems require digital record-keeping and periodic filing. Operating two tax regimes simultaneously requires either two separate accounting systems or a multi-jurisdiction accounting platform. AskBiz handles both: each outlet operates its own tax configuration (GST for SG, SST for MY), and reports are generated in the correct format for each jurisdiction. Group-level P&L converts both to a common reporting currency — typically USD or the owner\'s home-country currency — with local tax correctly excluded from the consolidated margin figures.'
      },
      {
        heading: 'Supplier networks and food cost management across borders',
        level: 2,
        body: 'A Singapore restaurant concept may use specific suppliers — premium proteins, branded sauces, specialty ingredients — that are not available or not affordable in Malaysia. Menu adaptation is common, but it requires careful food cost modelling for the local market. AskBiz allows separate supplier profiles and pricing by location. The Singapore outlet\'s Bidfood contract and the Malaysian outlet\'s local supplier list are managed independently. When a new dish is added to the group menu, AskBiz can calculate the food cost for each outlet based on local ingredient prices — revealing whether the dish is viable at the proposed selling price in both markets before it launches.'
      },
      {
        heading: 'Labour law differences: Singapore CPF vs Malaysian EPF/SOCSO',
        level: 2,
        body: 'Singapore employers contribute 17% of employee wages to CPF (for employees under 55). Malaysia requires employers to contribute to EPF (12-13% depending on wage level) and SOCSO (employer contribution capped at MYR 49.40/month per employee). Both are monthly statutory obligations with strict deadlines. Failing to remit on time carries financial penalties in both jurisdictions. AskBiz\'s payroll module is configured separately for each jurisdiction: Singapore employees are managed under SG CPF rules, Malaysian employees under MY EPF/SOCSO rules. The statutory contributions are calculated automatically based on the payroll data from each outlet, with remittance reports formatted for the relevant statutory body.'
      },
      {
        heading: 'Payment infrastructure and consumer behaviour differences',
        level: 2,
        body: 'Singapore\'s payment ecosystem is dominated by PayNow, DBS PayLah, and credit/debit cards. Malaysia\'s payment landscape includes DuitNow (QR-based, equivalent to PayNow), Touch \'n Go e-wallet, Boost, Maybank QRPay, and traditional card acceptance. Cash usage is higher in Malaysia than Singapore — particularly outside of KL\'s central business districts. AskBiz supports DuitNow and major Malaysian e-wallet integrations, with settlement reconciliation working the same way as for Singapore outlets. The daily reconciliation dashboard shows payments by method for each outlet, so you can see the payment mix difference between markets without building a separate reporting system.'
      },
      {
        heading: 'Remote group management: seeing KL from Singapore',
        level: 2,
        body: 'One of the critical operational requirements for a cross-border expansion is the ability to monitor the new outlet without being physically present. AskBiz group dashboard shows real-time revenue, food cost, labour, and covers for every outlet simultaneously — regardless of geography. The Singapore director can see KL\'s lunch service performance by 3pm Singapore time. If food cost at the KL outlet is running 38% in month two while Singapore is at 29%, the dashboard flags it before the month-end P&L is prepared. Remote management capability is not a nice-to-have for cross-border restaurant operations — it is a fundamental requirement, and it requires a system designed for it from the start.'
      }
    ],
    paa: [
      { q: 'What are the main operational challenges of expanding a restaurant from Singapore to Malaysia?', a: 'Currency management, tax regime differences (GST vs SST), supplier network rebuilding, labour law compliance differences (CPF vs EPF/SOCSO), payment infrastructure, and remote site management.' },
      { q: 'Does AskBiz support multi-currency restaurant operations?', a: 'Yes. Each outlet operates in its local currency with a group-level view converting to a reporting currency. Food costs, labour, and revenue are calculated in local currency for accurate local benchmarking.' },
      { q: 'How does Malaysian SST work for restaurants?', a: 'Malaysia\'s Service Tax at 8% applies to F&B businesses with revenue above MYR 1.5 million per year. It is charged on the bill and remitted to the Royal Malaysian Customs Department bimonthly.' },
      { q: 'Does AskBiz support Malaysian EPF and SOCSO payroll?', a: 'Yes. AskBiz payroll handles Singapore CPF and Malaysian EPF/SOCSO contribution calculations, with remittance reports formatted for each jurisdiction\'s statutory body.' },
      { q: 'Can AskBiz integrate with Malaysian payment platforms like DuitNow and Touch \'n Go?', a: 'Yes. AskBiz supports DuitNow and major Malaysian e-wallet integrations, with automatic daily settlement reconciliation.' }
    ],
    cta: {
      heading: 'AskBiz manages multi-currency, multi-tax, multi-jurisdiction restaurant operations across ASEAN from one dashboard',
      body: 'Expand your restaurant brand without losing operational control. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-multi-location-performance-comparison',
      'singapore-hawker-centre-digital-payments',
      'restaurant-real-time-revenue-dashboard'
    ]
  },

  // ─── Article 22 ───────────────────────────────────────────
  {
    slug: 'restaurant-weekend-vs-weekday-revenue-split',
    title: 'Weekend Dependence: UK Restaurants Earning 70% of Revenue in 2 Days',
    metaDescription: 'A UK restaurant earning 70% of its revenue on Friday and Saturday is dangerously exposed. Learn how to build weekday revenue and use AskBiz data to make the business more resilient.',
    cluster: 'Restaurant Operations',
    pillar: 'Revenue Management',
    publishDate: '2025-10-20',
    readTime: 7,
    tldr: 'If your restaurant earns 65-70% of its weekly revenue on Friday and Saturday, you have a resilience problem. One bad weekend — bad weather, a local event cancellation, a viral negative review — erases most of your weekly margin. AskBiz shows your revenue split by day and helps you build weekday demand.',
    sections: [
      {
        heading: 'The 70/30 problem: when weekends carry the restaurant',
        level: 2,
        body: 'A 60-cover restaurant in a UK town centre takes £14,000 in a good week. Friday evening: £3,800. Saturday lunch and dinner: £5,200. That is £9,000 from two days — 64% of weekly revenue from 2 out of 7 trading days. Monday to Thursday: an average of £1,250/day. Sunday: £1,500. A heavy snowfall on a February Saturday, a rail strike affecting a Friday, or a major local event competing for footfall on a crucial Saturday — any one of these costs you £3,000-5,000 in revenue in a single day. Fixed costs — rent, loan repayment, insurance, minimum staff — continue regardless. The weekend-dependent restaurant has very little buffer when weekends underperform.'
      },
      {
        heading: 'Why weekday revenue is harder to build — but more valuable',
        level: 2,
        body: 'Weekday customers are fundamentally different from weekend customers. Weekend guests are in leisure mode — they are slower to turn, spend more on drinks, and want an experience. Weekday guests want efficiency, value, and predictability. Building weekday revenue requires a different proposition: a set lunch that provides great value and gets diners back in 55 minutes, an after-work early bird that draws the 5:30-6:30 crowd before the main service, a business lunch offer that appeals to the local office community. These are all profitable — set menus and early birds can be engineered to 26-28% food cost — and they build a midweek customer base that is more routine and more resilient than the weekend leisure crowd.'
      },
      {
        heading: 'How to read your day-by-day revenue split in AskBiz',
        level: 2,
        body: 'AskBiz shows your revenue, covers, average spend, food cost, and labour cost by day of week — across any date range you choose. Running this report for the past 12 weeks gives you a clear picture of your weekday/weekend split, where the gaps are, and how the economics differ by day. Key questions the report answers: which day has the worst labour ratio (highest wages as % of revenue), which day generates the highest average spend per cover (often not Friday or Saturday), which session is the most profitable per labour hour, and how does food cost vary by day (weekend high-volume often improves food cost percentage, but not always).'
      },
      {
        heading: 'Strategies for building midweek revenue',
        level: 2,
        body: 'Four proven approaches: First, set lunch menu — a two-course, fixed-price offering at £16-22, engineered for 26% food cost. Available Tuesday-Friday, 12-3pm. High volume, fast turns, strong margin. Second, loyalty midweek bonus — double loyalty points for visits Monday-Thursday. AskBiz loyalty tracking shows you whether this is shifting regulars from weekend visits to midweek ones (displacement) or adding incremental visits (additionality). Third, business partnerships — corporate lunch accounts for local businesses, pre-agreed menus and monthly billing. This generates predictable, guaranteed covers on the weakest days. Fourth, themed evenings — a Wednesday quiz night, a Thursday supper club, a Monday wine dinner. These create a specific reason to visit on otherwise quiet evenings.'
      },
      {
        heading: 'Staffing flexibility: matching costs to midweek reality',
        level: 2,
        body: 'The economics of midweek revenue improvement only work if you match your staffing model to the revenue level. Running Friday-night staffing on a Tuesday lunch will produce a 60% labour ratio even if the midweek covers double. AskBiz scheduling generates day-specific staff allocations based on predicted covers. A Tuesday lunch that predicts 28 covers needs 2 FOH servers and 2 kitchen, not the Friday model of 4 and 4. The reduced staffing cost on midweek services is what makes midweek revenue genuinely profitable rather than just busy. Revenue without appropriate margin is activity, not profit.'
      },
      {
        heading: 'Setting a revenue resilience target',
        level: 2,
        body: 'A practical target for most UK restaurants is to have no single day contributing more than 25% of weekly revenue, and no two days contributing more than 45%. This means Friday + Saturday should be under 45% of your weekly total — a significant shift from the 65-70% that most weekend-dependent restaurants are at. Getting there in 12 months is achievable: a 10% improvement in weekday covers through targeted strategies reduces weekend dependency from 65% to around 55%. AskBiz tracks your progress against this target week-on-week, showing the trend in your weekend revenue share as midweek initiatives take effect.'
      },
      {
        heading: 'The comparison that reveals your problem',
        level: 2,
        body: 'Run this analysis in AskBiz: compare your revenue per available seat hour (RevPASH) by day. RevPASH = Revenue ÷ Available seats ÷ Hours open. If your Saturday dinner RevPASH is £18.50 and your Tuesday lunch RevPASH is £4.20, the gap is stark. The goal is not to eliminate the gap — weekends will always be stronger — but to raise Tuesday from £4.20 towards £8-10. That improvement alone, sustained across Monday-Thursday across 52 weeks, adds £25,000-£40,000 to a 60-cover restaurant\'s annual revenue. From the same premises, the same team, and the same kitchen.'
      }
    ],
    paa: [
      { q: 'What is a healthy weekend/weekday revenue split for a UK restaurant?', a: 'Aim for no single day above 25% of weekly revenue and Friday + Saturday combined below 45%. Most UK casual dining restaurants sit at 60-70% weekend dependency — a significant resilience risk.' },
      { q: 'How do I calculate revenue per available seat hour (RevPASH)?', a: 'RevPASH = Total revenue ÷ Available seats ÷ Operating hours. Compare by day and session to identify your least productive trading periods.' },
      { q: 'What is the most effective way to build weekday restaurant revenue?', a: 'Set lunch menus, midweek loyalty bonuses, corporate lunch accounts, and themed evenings are the four most effective approaches. Each requires a different proposition tailored to weekday customer motivations.' },
      { q: 'Does AskBiz show revenue split by day?', a: 'Yes. AskBiz reports revenue, covers, average spend, food cost, and labour cost by day of week across any date range — with the option to view as a percentage split or absolute figures.' },
      { q: 'Is weekend-dependent restaurant trading financially risky?', a: 'Yes. A restaurant earning 70% of revenue on two days has very limited buffer if those days underperform due to weather, local events, competition, or external disruptions. Building midweek revenue is the primary resilience strategy.' }
    ],
    cta: {
      heading: 'AskBiz shows your revenue split by day and helps you track the impact of midweek initiatives in real time',
      body: 'Build a more resilient restaurant business. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-cash-flow-seasonal-planning',
      'restaurant-staff-scheduling-labour-cost',
      'restaurant-break-even-per-cover-calculation'
    ]
  },

  // ─── Article 23 ───────────────────────────────────────────
  {
    slug: 'restaurant-allergen-tracking-compliance-uk',
    title: 'Natasha\'s Law Allergen Compliance: The POS Features That Keep You Legal',
    metaDescription: 'Natasha\'s Law requires full allergen labelling on all pre-packed for direct sale food in UK restaurants. AskBiz tracks all 14 allergens at recipe level and keeps your staff and customers safe.',
    cluster: 'Restaurant Operations',
    pillar: 'Food Safety & Compliance',
    publishDate: '2025-10-22',
    readTime: 7,
    tldr: 'Natasha\'s Law, effective October 2021, has created significant allergen compliance requirements for UK food businesses — including restaurants. Non-compliance can result in criminal prosecution, unlimited fines, and — most critically — preventable allergic reactions. AskBiz tracks all 14 mandatory allergens at recipe level and flags risks at the point of sale.',
    sections: [
      {
        heading: 'What Natasha\'s Law actually requires',
        level: 2,
        body: 'Natasha\'s Law requires full ingredient lists and allergen labelling on all food that is pre-packed for direct sale (PPDS) — food that is packaged on the same premises where it is sold. This includes: sandwiches and wraps made in a café before the customer arrives, baked goods pre-packaged on the premises, boxed salads made up before sale, any food that is wrapped before the customer orders. For food made to order (most restaurant meals), the legal requirement is to provide allergen information on request — either verbally or in writing. The critical risk point is for restaurants that also sell PPDS products: a patisserie that pre-packs pastries, a café that pre-wraps sandwiches, a restaurant that sends pre-made meals for delivery packaged in advance.'
      },
      {
        heading: 'The 14 major allergens every restaurant must track',
        level: 2,
        body: 'UK law requires restaurants to be able to identify and communicate the presence of 14 major allergens in any dish: celery, cereals containing gluten (wheat, rye, barley, oat, spelt), crustaceans, eggs, fish, lupin, milk, molluscs, mustard, peanuts, sesame, soybeans, sulphur dioxide and sulphites (above 10mg/kg), and tree nuts (almond, hazelnut, walnut, cashew, pecan, Brazil, pistachio, macadamia). Every recipe in your kitchen must have its allergen composition documented. This is not optional — it is a legal requirement, and the Environmental Health Officer will ask for it during a hygiene inspection.'
      },
      {
        heading: 'How AskBiz tracks allergens at recipe level',
        level: 2,
        body: 'When you enter a recipe in AskBiz, you assign allergen flags to each ingredient. Milk in the recipe flags as dairy. Wheat flour flags as gluten. AskBiz aggregates the allergen flags across all ingredients in a dish to produce a dish-level allergen summary. This summary is visible: at the POS when a server looks up a dish, on your printed menu if you connect AskBiz to your menu design template, and in the kitchen on the KDS when a modifier is added (e.g., "swap cream for oat milk" removes the dairy flag but adds any oat allergen). When a guest tells the server they have a nut allergy, the server can check every dish in the order for nut allergens in seconds — without going to the kitchen.'
      },
      {
        heading: 'Modifications and allergen risk at the point of service',
        level: 2,
        body: 'Allergen risk peaks at the modification point — when a customer requests a substitution that they believe removes an allergen but does not. A customer with a milk allergy asks for "no cheese" on a pasta dish. The server removes the cheese from the order. But the pasta sauce was made with cream — dairy is still present. Without allergen tracking that updates at modification level, the server cannot know this. AskBiz flags allergen implications of every modification: if removing cheese leaves other dairy ingredients in the dish, the server sees an alert: "Dish still contains: Milk (cream in sauce)." This alert has prevented allergic incidents in restaurants using the system — not just compliance ticks.'
      },
      {
        heading: 'Staff training and the digital allergen record',
        level: 2,
        body: 'Staff training on allergens is a legal requirement in the UK — not just best practice. Every food handler and front-of-house employee must understand the 14 allergens and the risk of cross-contamination. AskBiz provides a staff training module with allergen certification built in: staff complete an online allergen awareness course through the system and their completion is logged with a date stamp. During an Environmental Health inspection, you can demonstrate both the allergen record for every dish and the allergen training record for every employee. This documentation is increasingly expected by inspectors and can make the difference between a 5-star and 4-star hygiene rating.'
      },
      {
        heading: 'Cross-contamination management',
        level: 2,
        body: 'Documenting allergens in recipes addresses the intended composition of a dish. Cross-contamination — where an allergen-free dish picks up allergens through shared preparation surfaces, utensils, or cooking equipment — is a separate and equally important risk. AskBiz\'s kitchen management module allows you to document cross-contamination protocols: which preparation stations handle nut-containing ingredients (and therefore cannot be used for nut-free dishes without cleaning), which utensils are designated allergen-free, what the cleaning protocol is between allergen and allergen-free preparation. These protocols can be attached to specific dishes as kitchen notes that appear on the KDS, reminding the chef of cross-contamination requirements when a dish with allergen flags is ordered.'
      },
      {
        heading: 'The consequence of getting it wrong',
        level: 2,
        body: 'Natasha Ednan-Laperouse died in 2016 after eating a Pret a Manger baguette containing sesame, to which she was severely allergic. The baguette had no allergen label. Her death led directly to Natasha\'s Law. The consequences of allergen non-compliance are not administrative — they are human. A criminal prosecution under the Food Information Regulations can result in unlimited fines. Civil liability for an allergic reaction caused by inadequate allergen information is also unlimited. A 5-star restaurant with an untracked allergen error can face consequences that no insurance policy covers in full. The operational cost of allergen compliance through a system like AskBiz is approximately £0 on top of your existing subscription. The cost of non-compliance is incalculable.'
      }
    ],
    paa: [
      { q: 'What is Natasha\'s Law and who does it apply to?', a: 'Natasha\'s Law (effective October 2021) requires full ingredient and allergen labelling on all pre-packed for direct sale (PPDS) food in the UK. It applies to food businesses that pre-package food on the same premises where it is sold.' },
      { q: 'What are the 14 mandatory allergens in the UK?', a: 'Celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, peanuts, sesame, soybeans, sulphur dioxide/sulphites, and tree nuts. All must be identified in every recipe and communicated to customers on request.' },
      { q: 'Does AskBiz track allergens in recipes?', a: 'Yes. AskBiz tracks all 14 major allergens at ingredient and recipe level. Dish-level allergen summaries are visible at the POS and update when modifications are applied.' },
      { q: 'What happens if a restaurant fails an allergen inspection?', a: 'Consequences range from improvement notices to criminal prosecution under the Food Information Regulations. Fines are unlimited. If a customer suffers an allergic reaction due to inadequate allergen information, civil liability is also unlimited.' },
      { q: 'Do restaurant staff need allergen training?', a: 'Yes. All food handlers and FOH staff must be allergen-trained. The training must be documented. AskBiz includes an allergen training module with completion logging for inspection readiness.' }
    ],
    cta: {
      heading: 'AskBiz tracks all 14 allergens at recipe level and alerts your team at the point of service — keeping guests safe and your restaurant legal',
      body: 'Allergen compliance built into your POS. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-vat-margin-scheme-uk',
      'restaurant-payroll-tips-reporting-uk',
      'restaurant-kitchen-display-system-efficiency'
    ]
  },

  // ─── Article 24 ───────────────────────────────────────────
  {
    slug: 'restaurant-real-time-revenue-dashboard',
    title: 'Know Tonight\'s Revenue Before Close: Real-Time Restaurant Dashboard',
    metaDescription: 'Waiting until tomorrow for last night\'s sales data is too late. AskBiz gives restaurant operators a live revenue dashboard — revenue, covers, and food cost updated in real time throughout service.',
    cluster: 'Restaurant Operations',
    pillar: 'Business Intelligence',
    publishDate: '2025-10-24',
    readTime: 7,
    tldr: 'The best restaurant operators make decisions during service — not the morning after. A real-time dashboard showing live revenue, covers, food cost, and labour cost percentage lets you adjust staffing, push specials, and upsell targets while the service is happening. AskBiz puts this on your phone.',
    sections: [
      {
        heading: 'Making decisions at 8pm, not 8am',
        level: 2,
        body: 'It is Saturday evening service. 7:30pm. You are 90 covers in, an hour to go. Your revenue so far is £3,400. Your forecast for the full service was £4,200. You are trailing your target by approximately £800. Do you push the dessert upsell harder? Send a server to every table with the dessert menu description rather than just leaving them to ask? Do you offer the table of six who look like they might leave a final round of digestifs? Without live data, you do not know you are £800 behind target. With a real-time dashboard on your phone, you know at 7:30pm and have 60 minutes to close the gap. That is the difference between an average Saturday night and a great one.'
      },
      {
        heading: 'What a real-time restaurant dashboard shows',
        level: 2,
        body: 'AskBiz real-time dashboard shows six key metrics, live: revenue for the current session (compared to the same session last week and your target), covers seated and covers turned so far, average spend per cover (updated as bills are closed), food cost percentage (calculated from recipe deductions as orders fire), labour cost percentage (wages scheduled versus revenue generated so far), and table status (how many tables are occupied, clearing, or available). These six numbers tell you everything you need to know about the current service. They update every 2-3 minutes as transactions process. The dashboard is available on iPhone, Android, and any browser — you can watch it from the restaurant floor without being behind the bar.'
      },
      {
        heading: 'Identifying upsell opportunities mid-service',
        level: 2,
        body: 'The average spend per cover metric is particularly powerful during service. If you can see that your current average is £27.40 against a target of £32, you know your team is leaving revenue on the table — probably by not upselling sides, desserts, and drinks effectively. AskBiz can be configured to alert the floor manager when average spend falls below target by more than £3 per cover. The alert goes to a manager\'s handset. The action: a quick briefing to the floor team, a reminder about upsell scripts, or a targeted offer to tables that have not ordered a second drink. This kind of real-time operational adjustment is impossible without live data.'
      },
      {
        heading: 'Comparing tonight to last week and last year',
        level: 2,
        body: 'Context makes real-time data meaningful. A Saturday service at £4,100 means nothing in isolation. AskBiz shows you: the same Saturday last week (£3,890 — you are up 5.4%), the same Saturday this time last year (£3,650 — you are up 12.3%), and your target for tonight (£4,200 — you are 2.4% behind target with one hour left). Now you know whether to be pleased or concerned. Without the comparison, raw revenue numbers are hard to interpret. The dashboard shows all three simultaneously so the context is always visible.'
      },
      {
        heading: 'Real-time food cost as a management tool',
        level: 2,
        body: 'Food cost updating in real time means you can see if a service is tracking higher than expected. If by 7pm your food cost is at 35% when your target is 30%, something has gone wrong — either portion drift has been happening all evening, a high-cost special has been selling more than expected, or there was a kitchen incident (mis-fire or remake) that is not yet recorded. A mid-service food cost alert allows you to investigate before the service ends. Maybe the mis-fire from table 12 was thrown away but not logged — the system cannot know what it cannot see. Real-time food cost is an operational prompt to check and correct, not just a number to review in the morning.'
      },
      {
        heading: 'End-of-service summary: close with confidence',
        level: 2,
        body: 'At service close, AskBiz generates an end-of-session report automatically: total revenue, total covers, average spend, food cost, labour cost, tips, delivery orders, and any discounts or voids. This report is sent to the manager\'s email and is available in the dashboard. The manager reviews it in 3 minutes, signs off on the till reconciliation, and closes. No late-night manual totaling of receipts. No waiting for the POS back office to be accessible from the office computer. The report is complete, formatted, and sent before the last table has left. This saves 20-30 minutes per service per manager — and ensures no detail is missed in the manual fatigue of a late close.'
      },
      {
        heading: 'Group operators: monitoring multiple services simultaneously',
        level: 2,
        body: 'For a restaurant group owner managing three or four sites, the real-time dashboard shows all sites simultaneously. On a Friday evening, you can see Site 1 is at £2,800 (on track), Site 2 is at £1,900 (30% behind target — investigate), and Site 3 is at £3,200 (10% ahead — strong night). You call the manager at Site 2. The kitchen had a delay issue with a large table booking that is now resolved. Revenue should catch up. That conversation happens at 8pm, not at Monday morning\'s performance review where nothing can be changed. This is the difference between proactive management and retrospective reporting — and it is only possible with a real-time, multi-site dashboard.'
      }
    ],
    paa: [
      { q: 'Can I see my restaurant\'s revenue in real time?', a: 'Yes. AskBiz provides a live dashboard accessible from any browser or mobile device, showing revenue, covers, average spend, food cost, and labour cost updated throughout service.' },
      { q: 'What metrics should a restaurant dashboard show?', a: 'At minimum: live revenue (vs target and vs same period last week/year), covers, average spend per cover, food cost %, labour cost %, and table status. These six metrics are sufficient to manage a service actively.' },
      { q: 'Does AskBiz send end-of-service reports automatically?', a: 'Yes. AskBiz generates and emails an end-of-session summary report at service close: total revenue, covers, food cost, labour cost, tips, and voids.' },
      { q: 'Can I monitor multiple restaurant sites in real time with AskBiz?', a: 'Yes. The AskBiz group dashboard shows all sites simultaneously on a single screen, with revenue, food cost, and covers updating in real time for each location.' },
      { q: 'How does real-time data improve restaurant service performance?', a: 'It enables mid-service decisions: upsell prompts when average spend is below target, staffing adjustments when labour cost is running high, kitchen alerts when food cost spikes. Decisions at 8pm are actionable. Decisions at 8am are retrospective.' }
    ],
    cta: {
      heading: 'AskBiz puts your restaurant\'s live revenue, food cost, and covers on your phone — updated throughout service',
      body: 'Manage tonight\'s service with tonight\'s data. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-multi-location-performance-comparison',
      'restaurant-cogs-monthly-tracking',
      'restaurant-pos-system-table-management'
    ]
  },

  // ─── Article 25 ───────────────────────────────────────────
  {
    slug: 'restaurant-break-even-per-cover-calculation',
    title: 'Break-Even Per Cover: The Restaurant Maths Every Owner Needs',
    metaDescription: 'Every restaurant has a break-even cover number — below it, you lose money on every service. AskBiz calculates your break-even per cover automatically so you know your minimum viable trading level.',
    cluster: 'Restaurant Operations',
    pillar: 'Financial Management',
    publishDate: '2025-10-27',
    readTime: 8,
    tldr: 'If you do not know your break-even per cover, you cannot price a menu, set a target, or evaluate a quiet night. It is the foundation metric of restaurant economics. AskBiz calculates it automatically from your cost structure and shows you how many covers you need per service to pay your bills.',
    sections: [
      {
        heading: 'Why break-even per cover is the most important number in your restaurant',
        level: 2,
        body: 'There is one number that determines whether a service made money: did you take enough covers at enough average spend to exceed your break-even point? Below that point, every cover you served cost you more than it contributed. Above it, every additional cover is pure margin. Most restaurant owners know approximately how much they need to take in a week to cover their costs. Fewer know how many covers per service that translates to. Fewer still can tell you within 5 minutes of a service starting whether they are on track to hit it. The break-even per cover calculation gives you all three: a weekly revenue target, a covers-per-service target, and the awareness to track it in real time.'
      },
      {
        heading: 'How to calculate your restaurant\'s break-even per cover',
        level: 2,
        body: 'Break-even per cover requires three inputs: total fixed costs per week, your contribution margin per cover, and your average spend per cover. Contribution margin = (Selling price − Variable cost) ÷ Selling price, expressed as a percentage. If your average spend is £28 and your average variable cost (food + variable labour) is £16.80, your contribution margin is 40%. Fixed costs include rent, rates, insurance, salaried labour, loan repayments, subscriptions, and utilities — anything that does not change with your cover count. If weekly fixed costs are £12,000, and contribution margin is 40% on £28 average spend: break-even revenue = £12,000 ÷ 0.40 = £30,000/week. Break-even covers = £30,000 ÷ £28 = 1,071 covers per week. Across 14 services (two per day): 76.5 covers per service.'
      },
      {
        heading: 'The three inputs AskBiz tracks automatically',
        level: 2,
        body: 'AskBiz provides all three break-even inputs from your operational data. Fixed costs: you enter these once (rent, rates, salaried costs, fixed subscriptions) and they roll forward monthly. Variable costs: calculated from your food cost data (recipe costs × covers), waste logs, and variable labour from the scheduling module (hourly staff cost per service). Average spend per cover: calculated directly from POS sales data. When any of these inputs changes — a rent review, an ingredient price increase, a new salaried hire — AskBiz recalculates your break-even per cover automatically. You do not need to update a spreadsheet. The number is always current.'
      },
      {
        heading: 'Using break-even to evaluate services in real time',
        level: 2,
        body: 'With your break-even per cover calculated and your average spend known, you have a simple service target: 77 covers at £28 average = £2,156 to break even for this service. The AskBiz real-time dashboard shows you live covers and live revenue. At 7:30pm on a Friday, you have 42 covers seated and £1,180 in revenue with 90 minutes of service remaining. You are below the break-even pace. This is visible information that drives an operational response — push the dessert menu, hold a table of walk-ins who just arrived rather than turning them away, prompt servers to complete outstanding drink orders. Without the break-even reference point, a slow Friday at 42 covers feels vaguely bad. With it, it is a specific gap with a specific consequence.'
      },
      {
        heading: 'Menu pricing and break-even: are you charging enough?',
        level: 2,
        body: 'Break-even analysis is the most rigorous test of menu pricing. If your break-even requires 77 covers per service at £28 average spend, but your average cover is actually £23.50, your true break-even is 91 covers per service — a 18% higher cover requirement. On a 60-cover restaurant doing two sittings, 91 covers per service is physically impossible (it exceeds your maximum capacity). This means your current pricing cannot sustain your cost structure. You need either to increase menu prices (raising average spend), or to reduce fixed costs (renegotiate rent, refinance loans), or to reduce variable costs (food cost engineering, scheduling optimisation). AskBiz models all three scenarios so you can see which lever has the most impact before you commit to a change.'
      },
      {
        heading: 'Break-even and seasonal planning',
        level: 2,
        body: 'Your break-even per cover does not change seasonally — your fixed costs are constant. But your capacity to reach it does. In January, with 30% fewer covers than December, your per-service cover count may drop below break-even on every weekday service. AskBiz uses seasonal revenue forecasting to show you how many services per week will be below break-even in January, and what the cumulative below-break-even loss is. On a restaurant where Monday-Thursday January lunches each generate 45 covers against a 77-cover break-even at £28 average, each of those lunches loses approximately £896 in contribution before fixed cost absorption. Over 4 weeks × 4 lunches: £14,336 in below-break-even trading. This is the cash burn you are planning for — or not planning for.'
      },
      {
        heading: 'Communicating break-even to your team',
        level: 2,
        body: 'Break-even per cover is one of the most effective management tools when communicated to your front-of-house team. When staff understand that "we need 75 covers tonight to pay our bills — we have 52 so far," they understand why the upsell push matters, why turning tables efficiently matters, and why a slow midweek service is not a casual evening but a financial gap. AskBiz allows you to display the live service progress — current covers versus break-even target — on a staff-facing screen in the back-of-house. This transparency drives performance without requiring the manager to constantly prompt. The team self-monitors against a shared, understood target. Restaurants that share this data with their teams consistently outperform those where the financial metrics stay behind the office door.'
      }
    ],
    paa: [
      { q: 'How do I calculate break-even per cover for my restaurant?', a: 'Break-even covers per service = Fixed costs per service ÷ Contribution margin per cover. Contribution margin = Average spend − Variable cost (food + variable labour) per cover.' },
      { q: 'What is a typical contribution margin for a UK restaurant?', a: 'Typically 35-45% for casual dining. If average spend is £28 and variable cost is £15.40, contribution margin is 45%. Higher-margin menus and lower food cost percentages improve contribution margin.' },
      { q: 'Does AskBiz calculate break-even per cover automatically?', a: 'Yes. AskBiz uses your fixed costs, variable cost data from food cost and scheduling, and average spend from POS data to calculate break-even per cover. It updates automatically when costs change.' },
      { q: 'How does break-even analysis help with menu pricing?', a: 'If your current average spend cannot reach break-even within your physical cover capacity, you have a pricing problem. Break-even modelling shows whether raising menu prices, reducing costs, or changing the concept is the most viable path to viability.' },
      { q: 'Should I share break-even targets with my restaurant team?', a: 'Yes. Staff who understand the cover target and can see progress in real time perform better. Transparency about financial targets (without exposing sensitive P&L) consistently improves service performance.' }
    ],
    cta: {
      heading: 'AskBiz calculates your break-even per cover automatically — and shows you in real time whether tonight\'s service is on track to hit it',
      body: 'Know your number. Hit your target. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-cogs-monthly-tracking',
      'restaurant-menu-engineering-profitability',
      'restaurant-real-time-revenue-dashboard'
    ]
  },

  // ─── Article 8 (placed last in file, same array position as intended) ────
  {
    slug: 'restaurant-cash-flow-seasonal-planning',
    title: 'Seasonal Cash Flow for Restaurants: Survive January and August',
    metaDescription: 'January and August are the two months that break UK restaurants. Learn how to forecast seasonal cash flow, build reserves, and use AskBiz BI to plan ahead rather than react.',
    cluster: 'Restaurant Operations',
    pillar: 'Financial Planning',
    publishDate: '2025-09-17',
    readTime: 8,
    tldr: 'UK restaurants lose an average of 22-28% of revenue in January versus December. Without a cash flow plan built around this cliff, even profitable restaurants run out of operating capital. AskBiz forecasts your slow-season cash position 90 days in advance so you can act before the crisis.',
    sections: [
      {
        heading: 'The January cliff that nobody prepares for',
        level: 2,
        body: 'December is the best month for most UK restaurants. Christmas parties, festive menus, elevated average spend, gift voucher purchases. A restaurant doing £55,000/month in normal trading might hit £85,000 in December. Then January arrives. No parties. Resolution dieters avoiding restaurants. Credit card bills from Christmas dampening discretionary spending. That same restaurant drops to £38,000 in January — a £47,000 revenue decline from the previous month. Fixed costs — rent, rates, minimum staffing, loan repayments — do not fall by 55%. They barely move. The result: a restaurant that was profitable in December is now burning through its December profit to survive January. If December\'s extra profit was not ring-fenced, January becomes a crisis.'
      },
      {
        heading: 'August: the London summer problem',
        level: 2,
        body: 'For restaurants in Central London and other major urban centres with a professional clientele, August is a second cash flow cliff. Regular customers leave for holidays. Office lunches and after-work dining collapse. Tourism can partially offset this for some operators, but not for neighbourhood restaurants. A lunch-led restaurant in the City of London can see weekday covers drop 40-50% in August. For a restaurant running tight margins, a 40% revenue drop on weekday sessions while maintaining a fixed kitchen team is existential. The restaurants that survive August with their team intact planned for it six months earlier.'
      },
      {
        heading: 'Building a 12-month cash flow forecast in AskBiz',
        level: 2,
        body: 'AskBiz uses two years of POS sales data to model your seasonal revenue pattern by month, week, and day. It produces a 12-month cash flow forecast that shows: projected revenue by month based on historical patterns and current booking data, projected variable costs (food, beverages, hourly labour) tied to the revenue forecast, fixed costs (rent, rates, subscriptions, loan repayments) entered once and rolled forward, and projected closing cash balance by month. You see the January cliff coming in November. You see August in June. You can then make decisions with three to four months of lead time rather than reacting to an empty bank account in week three of January.'
      },
      {
        heading: 'Three strategies to survive lean seasons financially',
        level: 2,
        body: 'First, reserve ring-fencing: during December and other peak months, automatically set aside 15-20% of excess profit (revenue above your monthly baseline) into a dedicated reserve account. AskBiz shows you your excess against baseline so you know how much to move. Second, variable cost adjustment: use the seasonal forecast to plan reduced ordering, reduced staffing, and shorter opening hours during slow periods. AskBiz scheduling shows how many staff hours you need based on predicted covers — not last year\'s rota. Third, revenue engineering: January is a good month for set menus, loyalty promotions, and midweek event nights that create guaranteed covers. AskBiz tracks redemption of these promotions so you know which ones work.'
      },
      {
        heading: 'Supplier terms and cash flow: the conversation to have in November',
        level: 2,
        body: 'Most restaurant operators have never negotiated extended payment terms for January with their suppliers. But most suppliers will accommodate a 30-45 day payment period through January for a reliable, long-term customer. The conversation to have in November: "We have a strong December and will be in a slightly lower-revenue period in January. Can we agree 45-day terms for January invoices only?" This moves food purchases from immediate cash outflow to mid-February — when your business has recovered. AskBiz generates a cash flow projection you can share with suppliers to make this conversation credible and data-backed.'
      },
      {
        heading: 'Banking relationships: overdraft facilities before you need them',
        level: 2,
        body: 'Banks approve overdraft facilities when your accounts look healthy — not when you are calling them in January with an empty account. The time to arrange a seasonal overdraft or revolving credit facility is September or October, using your AskBiz cash flow forecast to show the bank a clear, data-backed seasonal pattern and a repayment timeline. A £20,000 overdraft facility arranged in October at 8% interest, used for 6 weeks in January, costs roughly £185 in interest. Not arranging it and missing a payroll costs infinitely more. AskBiz can export the data in a format suitable for a bank presentation.'
      },
      {
        heading: 'The restaurants that consistently survive slow seasons',
        level: 2,
        body: 'The independent restaurants that trade through their fifth, tenth, and twentieth year have one thing in common: they treat cash flow forecasting as a monthly discipline, not an annual exercise. They review their 90-day cash position at the start of every month. They know their minimum viable revenue — the number below which they are burning reserves. They have built relationships with suppliers and lenders before they needed them. AskBiz does not eliminate seasonal dips — nothing can. But it makes them visible 90 days in advance, which is enough time to act. The restaurants that fail in January usually saw it coming in October and did nothing because the data was not in front of them.'
      }
    ],
    paa: [
      { q: 'How much does restaurant revenue typically drop in January?', a: 'UK restaurants typically see a 22-30% revenue decline from December to January. In some sectors (fine dining, office-adjacent restaurants) the drop can exceed 35%.' },
      { q: 'How do I build a restaurant cash flow forecast?', a: 'Start with 24 months of historical revenue data, broken down by month. Add your fixed costs (rent, rates, loan repayments) as constants. Model variable costs (food, labour) as a percentage of forecast revenue. Project closing cash balance monthly. Review and update monthly.' },
      { q: 'Can AskBiz generate a cash flow forecast?', a: 'Yes. AskBiz uses your historical POS data to project revenue by month, combines it with your cost structure, and shows a 12-month rolling cash flow forecast updated as sales data comes in.' },
      { q: 'Should I reduce staff in January to cut costs?', a: 'Reduce hours, not necessarily headcount. Use demand-led scheduling (AskBiz predicts covers by day) to cut labour hours proportionally to reduced trade. Laying off and rehiring is more expensive than running a lighter rota through a 6-week quiet period.' },
      { q: 'What is a good cash reserve for a restaurant?', a: 'Aim for 2-3 months of fixed costs as cash reserve. On £15,000/month in fixed costs, that is £30,000-£45,000. Build it during peak trading and treat it as off-limits until genuinely needed.' }
    ],
    cta: {
      heading: 'AskBiz shows you your January cash position in October — when you can still do something about it',
      body: 'Forecast. Plan. Survive. Try AskBiz free at askbiz.co/signup'
    },
    relatedSlugs: [
      'restaurant-weekend-vs-weekday-revenue-split',
      'restaurant-break-even-per-cover-calculation',
      'restaurant-cogs-monthly-tracking'
    ]
  },
]
