import type { AcademyArticle } from "./academy-types";

// Zakat Calculator + charity directory — My Business (/intelligence) > Zakat tab.
// Grounded directly in components/intelligence/ZakatCalculator.tsx, lib/zakat.ts,
// lib/zakat-price.ts, app/api/zakat/route.ts and app/api/zakat/price/route.ts —
// cross-checked against the already-reviewed Help Centre entry
// (lib/help-content.ts, slug zakat-calculator-guide) and verified against the
// live code on 2026-07-25. Academy had zero prior mentions of "zakat".
export const academyZakatCalculatorCharity: AcademyArticle[] = [
  {
    slug: "zakat-calculator-charity-askbiz",
    title: "The AskBiz Zakat Calculator: How It Works and Where to Find It",
    description:
      "How the Zakat tab in My Business calculates your business's zakat position from live inventory, cash, receivables and payables, tracks nisab and hawl automatically, and connects you to a partner charity directory — free on every plan.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: [
      "zakat calculator",
      "zakat calculator for business",
      "nisab calculator",
      "hawl tracker",
      "business zakat tool",
      "islamic finance business",
      "zakat charity directory",
      "AskBiz",
      "My Business",
    ],
    keyTakeaways: [
      "The Zakat calculator lives in My Business (/intelligence) under its own Zakat tab — direct link /intelligence?tab=zakat — and is free on every plan, including Free, with no upgrade required.",
      "It calculates zakat on trade assets only: cash + inventory (retail value) + receivables − payables, floored at zero. Any figure can be overridden for a single calculation without touching your real inventory or CFO records.",
      "Nisab is the standard weight-based threshold (87.48g gold or 612.36g silver, silver used by default) converted to your currency via a manual 'Check current price' lookup — it doesn't refresh on its own.",
      "Hawl (the 355-day lunar year) is tracked automatically: the progress bar starts the day your zakat base first crosses nisab and resets if it drops back below before the year is up.",
      "It's a calculation aid, not a fatwa — it doesn't cover madhhab-specific rulings, agricultural or livestock zakat, personally-held gold/silver, or personal wealth outside the business.",
    ],
    content: [
      {
        heading: "Where to find it",
        body: "Open My Business from the main navigation — that's the page at /intelligence — and select the Zakat tab. It sits alongside Overview, CFO, Team, Logistics, Market and Actions, so it's a first-class tab, not a hidden setting. If you want to jump straight there, the direct link is /intelligence?tab=zakat.\n\nOne thing worth knowing before you go looking for it another way: AskBiz's AI chat can't deep-link you into this tab yet, the way it can for some other parts of the app. Asking it to \"take me to zakat\" won't drop you on the tab — open My Business and click Zakat directly instead.",
      },
      {
        heading: "It's free on every plan",
        body: "The Zakat calculator isn't gated behind Growth, Business, or any other tier — it's available on Free with no upgrade needed. That's deliberate: zakat is a religious obligation tied to your actual trading position, not a premium analytics feature, so AskBiz doesn't put a paywall in front of it.",
      },
      {
        heading: "What it actually calculates: the zakat base",
        body: "Every time you open the calculator, AskBiz pulls four live figures from your business data and combines them into what it calls your zakat base:\n\n- Cash — the cash balance you've entered in your CFO cost settings. If you've never entered one, the tile shows 'Not set' rather than silently treating it as zero, so you don't accidentally understate your position.\n- Inventory — the retail value of your active stock, calculated as sale price × quantity on hand for everything you're currently carrying.\n- Receivables — money owed to you, pulled from your logged receivables.\n- Payables — money you owe, subtracted from the total. This includes any purchase orders you've received stock against but haven't fully paid your supplier for yet.\n\nThe zakat base is Cash + Inventory + Receivables − Payables, floored at zero so it never goes negative. This covers trade assets only — it's not a snapshot of your entire balance sheet, and it deliberately excludes fixed assets like equipment or premises, which aren't zakatable in the same way.\n\nEvery one of those four figures is tappable. If a number looks wrong — your cash balance is stale, or you know a receivable was just written off — tap it and enter a corrected value for this calculation. The override only affects the result in front of you: it isn't written back to your inventory or CFO records, and it won't be remembered the next time you open the tab unless you enter it again.",
      },
      {
        heading: "Nisab: the threshold that decides whether you owe anything at all",
        body: "Zakat only becomes due once your zakat base is at or above nisab, the minimum threshold of wealth. AskBiz uses the standard weight-based definition: 87.48g of gold, or 612.36g of silver. Silver is used by default because it's the lower of the two thresholds — you can switch to gold at any time if that's what you'd rather calculate against.\n\nThe calculator doesn't refresh metal prices on its own. You trigger a lookup manually with the 'Check current price' button, which runs a live price search and converts the weight threshold into your local currency. AskBiz caches that result along with the date it was checked, so it isn't looking the price up fresh every time you open the tab — and each metal remembers its own last-checked price and date separately, so flipping between gold and silver doesn't lose either value. Treat the figure as an indicative market estimate rather than an exact spot rate; if precision genuinely matters for your situation, confirm it independently before relying on it.",
      },
      {
        heading: "Hawl: why being above nisab today isn't the same as owing zakat today",
        body: "Crossing nisab doesn't mean zakat is due immediately — your zakat base needs to stay at or above nisab for a full lunar year, the hawl, before anything is actually owed. AskBiz tracks the 355-day hawl automatically, with no manual entry required:\n\n- The day your zakat base first crosses nisab, AskBiz starts the hawl clock and shows a progress bar.\n- If your zakat base drops back below nisab before the year completes, the clock resets. It starts over the next time you cross the threshold again.\n- Once a full hawl completes while you're still above nisab, the status changes to Due now, showing 2.5% of your zakat base as the amount owed.\n\nUntil hawl completes, whatever figure is shown is a running estimate based on your current numbers, not a due amount — it will keep moving as your cash, stock, and receivables change day to day. The status badge tells you exactly where you stand: Check price to begin (nisab hasn't been looked up yet), Below nisab, Above nisab (hawl running), or Due now.",
      },
      {
        heading: "Giving to charity — and why you're not limited to AskBiz's list",
        body: "Below the calculator, AskBiz lists partner charities you can give to directly, filtered to your country where AskBiz has a match. Each entry links out to the charity's own donation page — AskBiz doesn't process the payment itself, it just points you there.\n\nThe directory is a convenience, not a requirement. You're completely free to pay your zakat to any charity or recipient of your own choosing, inside or outside the list. If nothing is listed yet for your country, that's a gap in a still-growing directory, not a sign that you have nowhere to give — use whatever charity you already trust.",
      },
      {
        heading: "What this tool doesn't do",
        body: "The Zakat calculator is built as a calculation aid grounded in the standard nisab, hawl, and 2.5% methodology for zakat on business or trade assets — it isn't a fatwa, and it doesn't try to be. It doesn't account for madhhab-specific differences in how zakat is calculated, doesn't cover agricultural or livestock zakat, doesn't include personally-held gold or silver, and doesn't touch your personal wealth outside the business. If your situation needs a ruling rather than a number, that's a conversation for your own scholar or imam — AskBiz gives you the figures to bring to that conversation, not a substitute for it.",
      },
    ],
    relatedSlugs: [],
    faq: [
      {
        q: "Is the Zakat calculator really free, or does it need a paid plan?",
        a: "It's genuinely free on every plan, including Free — there's no upgrade required to use it.",
      },
      {
        q: "Why does my cash figure show 'Not set' instead of zero?",
        a: "AskBiz only knows your cash balance if you've entered one in your CFO cost settings. If you haven't, the tile shows 'Not set' rather than assuming zero, since assuming zero could understate your zakat base. Tap the tile to enter a cash figure directly for the calculation instead.",
      },
      {
        q: "If I correct a figure in the calculator, does it update my real inventory or CFO numbers?",
        a: "No. Overrides only affect the calculation you're looking at in that moment — they're never written back to your inventory, CFO, or accounting data, and they aren't remembered next time you open the tab.",
      },
      {
        q: "Does being above nisab mean I owe zakat right now?",
        a: "Not necessarily. You need to stay at or above nisab for a full lunar year (355 days, the hawl) before zakat is actually due. AskBiz tracks this with a progress bar and resets it if your zakat base drops back below nisab before the year completes.",
      },
      {
        q: "Can I give my zakat to a charity that isn't in AskBiz's directory?",
        a: "Yes. The partner charity list is a convenience for giving directly from inside AskBiz — you're free to pay your zakat to any eligible charity or recipient of your own choosing.",
      },
    ],
  },
];
