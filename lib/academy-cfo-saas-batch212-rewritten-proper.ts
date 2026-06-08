import { AcademyArticle } from "@/types/academy";

export const batch212Articles: AcademyArticle[] = [
  {
    slug: "contract-negotiation-and-terms-optimization",
    title: "Contract Negotiation and Terms Optimization: Maximizing Deal Value",
    description: "Master contract negotiation. Optimize terms, manage risk, and close better deals.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "contract negotiation",
      "deal terms",
      "pricing negotiation",
      "payment terms",
      "customer contract",
      "vendor contract",
      "negotiation tactics",
      "terms optimization",
      "discount strategy",
      "contract management"
    ],
    keyTakeaways: [
      "Negotiation framework: BATNA (Best Alternative To Negotiated Agreement) defines walk-away point. Example: Customer wants 20% discount, your BATNA is lose deal vs keep at full price = choose best outcome. Anchor: First number sets tone. If you want £100K, ask £120K (gives room). Tactics: (1) Multiple options (show different tiers/terms), (2) Trading (give on X to get Y), (3) Silence (after proposal, let them talk), (4) Competition (mention other options). Common mistake: Discount too early (leaves money on table). Better: Offer alternatives (annual discount, longer contract, additional volume).",
      "Customer contract negotiation: Payment terms critical (upfront vs net-30 vs net-60). Upfront = cash advantage (£1200 day 1 vs £100/month cash flow). Offer incentive: \"3% discount if annual upfront\" (£1200 × 97% = £1164, you collect £1164 vs £100/mo spread). Discount strategy: Don't lead with discounts (signals desperation). Lead with value. Alternative: Volume discount (\"3% off if 2-year commitment\"), annual discount (\"10% off annual vs monthly\"), early commitment (\"lock in current price, guaranteed for 3 years\"). Document: Contract should specify price, payment terms, renewal, cancellation clause, SLA.",
      "Vendor contract negotiation: Flip the script. You're buying, have leverage if spending is large (>£50K annually). Tactics: (1) RFP (request quotes from 2-3 vendors, create competition), (2) Volume commitment (\"if we go 3-year, can you drop price 20%?\"), (3) Bundling (\"we're consolidating from 3 vendors to 1, what's your best price for package?\"), (4) Flexibility (\"we need net-60 terms, can you accommodate?\"). Win-win: Frame as long-term partnership (retention value to vendor). Avoid: Nickel-and-diming (damages relationship, vendor underserves)."
    ],
    content: [
      {
        heading: "Negotiation Framework and Tactics",
        body: `Approaching negotiations strategically.

**BATNA and walk-away point**

BATNA (Best Alternative To Negotiated Agreement):
- Your best option if deal doesn't happen
- Defines acceptable minimum (anything worse = walk)

Example (selling subscription):
- Offer: £10K annual, customer wants £7K (30% discount)
- BATNA: Keep full price, lose deal to competitor OR walk away
- Decision: Is £7K deal better than not selling? (assess competitor threat, strategic value)
- If BATNA is strong (have other deals), walk. If BATNA weak (need revenue), accept £7K.

Example (buying vendor service):
- Vendor asking: £100K annual, you want £80K (20% discount)
- BATNA: Stay with current vendor (if better) OR continue doing it internally
- If internal cost is £60K, vendor asking £100K is not worth it (walk)
- Negotiation leverage: Have BATNA (internal alternative is powerful)

**Anchoring and framing**

Anchoring effect:
- First number sets expectations
- If you ask £150K, other party anchors to that (aim for discount from £150K)
- If you ask £80K, other party anchors lower (hard to go up)
- Strategy: Anchor high (gives room to negotiate down)

Example selling:
- Your ask: £120K (anchors high)
- Customer counter: £100K (anchors off your number)
- Your response: £110K (split difference, but anchored to your original)
- vs If you'd opened at £100K, they'd counter £80K (bad outcome)

Example buying:
- Vendor ask: £150K (anchors high)
- Your counter: £60K (low anchor, shows desperation)
- Better: £100K (reasonable counter, higher than your target but shows you're serious)

**Negotiation tactics**

1. Multiple options (don't single-point negotiate):
- Don't: "Can you reduce price 20%?"
- Do: "We can do 3 options: (A) Annual upfront at current price, (B) 2-year with 10% discount, (C) Volume-based (higher usage = lower $/unit)"
- Benefit: Gives customer choice (feels less pressured), multiple paths to yes

2. Trading (give to get):
- "We can do annual upfront (your preference) if you give us net-60 payment terms (our preference)"
- Avoid: Give without getting (one-way negotiation)
- Frame: "We can offer X if you can offer Y" (exchange, not concession)

3. Silence after proposal:
- After proposing, stay quiet
- Other party feels pressure to speak (often improves offer)
- Talking too much undermines your position

4. Legitimacy and anchoring to market:
- "Market rate for this service is £80-100K, we can do £90K"
- Anchors to external standard (not your arbitrary number)
- Harder to dispute

5. Creating competition:
- "Vendor A quoted £100K, Vendor B quoted £95K"
- Creates urgency (if they don't match, you'll go elsewhere)
- Be genuine (don't bluff, but communicate alternatives)

`
      },
      {
        heading: "Customer Contract Terms",
        body: `Negotiating subscription and payment terms.

**Pricing tiers (options approach)**

Instead of single price:
- Tier 1: Monthly billing, no discount (£100/month)
- Tier 2: Annual upfront, 10% discount (£1080/year)
- Tier 3: 2-year commitment, 15% discount (£1020/year, paid upfront = £2040 total)

Customer chooses, benefits you:
- Monthly = highest price per unit (covers flexibility cost)
- Annual = moderate discount (incentivizes longer commitment)
- 2-year = larger discount (locks in customer, improves cash)

Psychology: Customer feels they chose (more satisfying than being told one price)

**Payment terms**

Upfront (ideal, but customer hesitant):
- Full year paid on day 1
- Cash advantage huge (£1200 day 1 vs £100/month spread)
- Incentive: "3% discount if paid upfront" (customer gets discount, you get cash)

Net-30 (standard):
- Invoice on day 1, payment due 30 days later
- Customer cash flow issue (their perspective)
- You cash flow issue (your perspective)
- Common for SMB

Net-60/90 (vendor concession):
- Invoice on day 1, payment due 60-90 days later
- Enterprise standard (they manage cash differently)
- Working capital cost to you (£X for 60 days = interest cost ~2%)
- Negotiate: "Net-60 only if annual commitment" (lock them in for length of payment terms)

**Discounts and incentives**

Early commitment discount:
- "Sign 2-year deal = 15% discount"
- Benefit: Locks in customer, improves retention (sunk cost = sticky)
- Psychology: Feels like they won (got discount), but you got commitment

Annual upfront discount:
- "Monthly £100 = Annual £1080 (10% discount)"
- Benefit: Improves cash, reduces churn (upfront = committed)

Volume discount:
- "Add 5 more users = 10% discount on total"
- Benefit: Incentivizes expansion, customer wins (saves money)

Loyalty discount:
- "Renew for 3 years = lock in current price (no increases)"
- Benefit: Reduces renewal churn (customer locked in price)

**Cancellation and renewal terms**

Term length:
- 1 year (standard)
- 2-3 years (if offering discount, commit)
- Month-to-month (high churn, avoid)

Cancellation clause:
- 30-day notice (customer can cancel with notice)
- No mid-term cancellation (pays for full term)
- Early termination fee (if cancel early, pay penalty)
- Strategic: 30-day notice encourages commitment (not trapped, but friction to cancel)

Renewal:
- Auto-renewal (default renew, customer must opt-out)
- Manual renewal (customer must opt-in)
- Strategic: Auto-renewal reduces churn (inertia), but may face backlash

`
      }
    ],
    relatedSlugs: [
      "pricing-strategy-and-price-optimization",
      "subscription-billing-models-and-pricing-architecture",
      "vendor-management-and-procurement-strategy",
      "negotiation-and-partnership-strategy",
      "customer-success-metrics-and-program-design"
    ],
    faq: [
      {
        q: "How do I negotiate better subscription prices?",
        a: "Strategy: Don't single-price. Offer tiers: (1) Monthly full price, (2) Annual 10% off, (3) 2-year 15% off. Customer chooses (feels less pressured). Upfront incentive: \"3% discount if paid upfront\" (improves cash). Payment terms: Use to lock commitment (\"net-60 only if 2-year\"). Don't discount for discounting (discount for commitment, volume, or payment timing)."
      },
      {
        q: "What's BATNA and why does it matter?",
        a: "BATNA = your best alternative if deal fails. Example: Customer wants 30% discount, your BATNA is lose deal or keep full price. If BATNA strong (have other deals), walk. If weak (desperate for revenue), negotiate. Knowing BATNA gives confidence (know your walk-away point). Practice: Define BATNA before negotiations start."
      },
      {
        q: "How do I negotiate with vendors?",
        a: "Tactics: (1) RFP (get 2-3 quotes, create competition), (2) Volume commitment (\"3-year = 20% off?\"), (3) Bundling (consolidate vendors, negotiate package), (4) Flexibility (\"net-60 terms?\"). Anchor: Counter at reasonable level (not lowball). Frame as partnership (vendor retention value). Avoid: Nickel-and-diming (damages relationship)."
      },
      {
        q: "Should I use annual or monthly billing?",
        a: "Annual upfront = best for cash (collect year 1 on day 1). Incentivize: 10-15% discount for annual (customer wins, you get cash). Monthly = higher price/month but customer flexibility. Strategy: Offer both (customer chooses), charge premium for monthly. Target: 50-60% of customers on annual."
      }
    ],
    videoUrl: ""
  }
];

export default batch212Articles;
