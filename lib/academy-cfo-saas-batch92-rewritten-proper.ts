import { AcademyArticle } from "@/types/academy";

export const batch92Articles: AcademyArticle[] = [
  {
    slug: "marketing-roi-attribution",
    title: "Marketing ROI and Attribution: Measuring Which Channels Drive Revenue",
    description: "Master marketing ROI: understand attribution models, calculate CAC by channel, and optimize spend for best returns.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "marketing ROI",
      "attribution",
      "channel attribution",
      "CAC by channel",
      "marketing spend",
      "channel effectiveness",
      "marketing metrics",
      "return on ad spend",
      "ROAS",
      "marketing efficiency"
    ],
    keyTakeaways: [
      "Attribution = which channel gets credit for customer acquisition; problem: customer touches multiple channels before signing up (sees ad, reads blog, attends webinar, talks to sales); which channel caused conversion? Multi-touch attribution distributes credit (first-touch 40%, last-touch 40%, middle 20%), or linear (equal credit all channels); single-touch (last-click only) oversimplifies and favors retargeting/sales over awareness",
      "CAC by channel varies 10-100x: Organic search £100-500 (lowest, earned), content marketing £300-800, paid ads £500-3K, events £1-5K, sales £5-20K (highest); allocate budget to lowest CAC channels (organic > content > ads > events); but CAC shouldn't be only metric (organic might have lower quality, higher churn); track CAC + payback + LTV by channel",
      "Marketing ROI = revenue from channel ÷ marketing spend; example: Google Ads £10K spend → £50K revenue → 5x ROI (£5 revenue per £1 spend); if payback 12 months and CAC £1K, customer LTV £10K = ROI 10x over lifetime (but 5x year 1); focus on unit economics by channel, not just short-term ROAS"
    ],
    content: [
      {
        heading: "Understanding Marketing Attribution",
        body: `Attribution answers the question: Which marketing channel gets credit for this customer acquisition?

**The Attribution Challenge**

Typical customer journey:

Day 1: Sees Google Ad → Clicks, lands on website
Day 3: Reads blog post (organic search)
Day 10: Downloads whitepaper (email nurture)
Day 15: Attends webinar
Day 20: Talks to sales rep
Day 25: Signs contract

Which channel caused the signup? All of them (at different points).

**Attribution Models**

1. **Last-Touch Attribution** (easiest, most biased)
   - Credit final touchpoint only
   - In above example: Sales gets 100% credit
   - Problem: Undervalues awareness (ads, content)
   - Common in: CRM systems (where last interaction tracked)

2. **First-Touch Attribution** (opposite problem)
   - Credit initial touchpoint only
   - In above example: Google Ads gets 100% credit
   - Problem: Undervalues nurture and sales
   - Common in: Attribution tools that track first source

3. **Linear Attribution** (fair, middle ground)
   - Equal credit to all touchpoints
   - In above example: Each of 6 touchpoints gets 16.7%
   - Problem: Assumes all channels equally valuable
   - Common in: Balanced analytics approaches

4. **Time-Decay Attribution** (middle touches matter)
   - Recent touches weighted higher
   - Example: First touch 10%, middle 20%, last touch 70%
   - In above example: Sales 70%, webinar 20%, others 10%
   - Problem: Complex, hard to explain
   - Common in: Advanced marketing analytics

5. **Custom Attribution** (org-specific)
   - Define rules specific to your business
   - Example: Awareness 30%, consideration 30%, decision 40%
   - Ad touchpoint → 30% of credit
   - Content touchpoint → 30%
   - Sales touchpoint → 40%
   - Problem: Biased toward what you think is important
   - Common in: Enterprise companies

**Recommended: Linear or Time-Decay**
- Fair to all channels
- Doesn't oversimplify (as last-touch does)
- Easier to explain than custom

**CAC by Attribution Model**

Same company, different attribution:

Marketing spend (monthly):
- Google Ads: £5,000
- Content: £2,000
- Events: £3,000
- Sales: £10,000
- Total: £20,000

Customers acquired: 10 (£10K ACV each)

**Last-Touch Attribution (biased):**
- All 10 customers credit to "sales" (last touchpoint)
- Sales CAC: £10,000 ÷ 10 = £1K per customer
- Other channels appear worthless (£0 CAC)

**Linear Attribution (fair):**
- Each touchpoint 25% credit (4 channels = 1/4 each)
- Google Ads: 2.5 customers × £5K spend = £2K CAC
- Content: 2.5 customers × £2K spend = £800 CAC
- Events: 2.5 customers × £3K spend = £1.2K CAC
- Sales: 2.5 customers × £10K spend = £4K CAC

**Insights from linear attribution:**
- Content is most efficient (£800 CAC)
- Sales is least efficient (£4K CAC)
- But sales helps close deals (necessary in cycle)

Action: Increase content budget (highest ROI), optimize sales efficiency.

**Multi-Touch Attribution Tools**

Advanced tools model customer journey:

- Google Analytics 4: First-touch, last-touch, time-decay
- Mixpanel: Custom attribution rules
- Marketo/Pardot: Lead scoring (implicit attribution)
- Salesforce: CRM touchpoint tracking
- Stripe/Churn: Revenue attribution

These tools track:
- Which source brought customer in
- All subsequent touchpoints (emails, ads, content)
- Time between touches
- Final conversion

Then distribute credit per attribution model.

**CAC Payback by Channel**

Different channels have different payback periods:

| Channel | CAC | Monthly value | Payback months |
|---------|-----|----------|----------|
| Organic search | £400 | £200 | 2 months |
| Content marketing | £600 | £200 | 3 months |
| Paid ads | £1000 | £200 | 5 months |
| Sales | £3000 | £500 | 6 months |
| Events | £2000 | £300 | 6.7 months |

**Organic search** has fastest payback (customers highly qualified).
**Events** has slowest (high CAC, but might have higher LTV).

Best strategy: Combination approach
- Organic search (base, SEO takes time to build)
- Sales (enterprise, long cycle, high value)
- Paid ads (fill gaps, scalable)

**Marketing Mix Optimization**

Goal: Allocate budget across channels for highest total ROI.

Constraint: Total budget £20K/month

Scenario 1: All into organic search (best CAC)
- Problem: Takes 12-24 months to build (not fast)
- Miss near-term revenue

Scenario 2: All into paid ads (fastest)
- Problem: Expensive (£1K CAC vs. £400 organic)
- Revenue high, but burn high
- May not be sustainable

Scenario 3: Blended (realistic)
- Organic search: £3K (long-term, build SEO)
- Paid ads: £7K (fill gaps, fast scaling)
- Events: £5K (mid-market, high ACV)
- Sales: £5K (enterprise, existing pipeline)
- Result: Balanced CAC, sustainable growth

**Measuring Marketing ROI**

ROI = (Revenue from channel − Marketing spend) ÷ Marketing spend

Example:

Google Ads:
- Spend: £10,000
- Revenue from customers acquired: £50,000 (5 customers × £10K ACV)
- ROI: (£50K − £10K) ÷ £10K = 4.0x (£4 profit per £1 spent)

Content marketing:
- Spend: £5,000
- Revenue: £40,000 (4 customers × £10K ACV)
- ROI: (£40K − £5K) ÷ £5K = 7.0x (£7 profit per £1 spent)

**Content has better ROI** (7x vs. 4x).

But ROI is year-1 only. Over customer lifetime:

If customers stay 3 years:
- Google Ads customer LTV: £30K (3 × £10K)
- ROI over lifetime: (£30K − £10K) ÷ £10K = 2.0x
- This is lower return (because customer doesn't expand)

Content marketing customer LTV: £35K (expansion revenue)
- ROI over lifetime: (£35K − £5K) ÷ £5K = 6.0x
- Higher ROI (because customer expands more)

**Best ROI channels tend to have:**
- Lower CAC (efficient acquisition)
- Higher retention/LTV (loyal customers)
- Better product-market fit (right customer)

**Avoid vanity metrics:**
- Impressions (how many people saw ad)
- Clicks (how many clicked)
- CTR (click-through rate)

Focus on:
- CAC (cost per customer)
- Payback (months to recover)
- LTV/CAC (lifetime profit per acquisition spend)
- ROI (£ returned per £ spent)

Vanity metrics look good but hide poor economics.
`
      }
    ],
    relatedSlugs: [
      "customer-acquisition-cost-optimization",
      "sales-efficiency-magic-number",
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-deep-dive",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "Which attribution model should I use?",
        a: "Linear or time-decay. Linear is fairest (equal credit all channels). Last-touch oversimplifies (favors retargeting). First-touch ignores nurture. Start with linear, evolve to time-decay."
      },
      {
        q: "How do I calculate CAC by channel?",
        a: "Spend by channel ÷ customers from that channel. Example: £10K Google Ads ÷ 10 customers = £1K CAC. Use attribution model to assign partial credit if multi-touch."
      },
      {
        q: "Which channel has best ROI?",
        a: "Typically organic search (lowest CAC, highest quality). But requires 6-12 months to build. Paid ads faster but more expensive. Balance is key."
      },
      {
        q: "How do I optimize marketing spend?",
        a: "Allocate more to lowest CAC channels (organic, content). But don't neglect awareness (ads, events) or closing (sales). Balanced portfolio = sustainable growth."
      }
    ],
    videoUrl: ""
  }
];

export default batch92Articles;
