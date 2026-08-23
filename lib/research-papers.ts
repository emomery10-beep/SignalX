// Research & writing published on /research.
//
// To add a paper: drop the PDF in /public/research/ and add an entry below.
// Newest first — the page renders them in array order. Each paper also gets its
// own detail page at /research/<slug> (see app/research/[slug]).

export interface ResearchPaper {
  slug: string
  title: string
  type: string          // e.g. "Systematic Review", "Working Paper", "Essay"
  date: string          // human-readable, e.g. "July 2026"
  length?: string       // e.g. "~11,700 words"
  summary: string       // 1–3 sentences, plain language (used on the list card)
  abstract: string      // full abstract — real on-page text for SEO + AI citation
  keyFindings: string[] // the paper's main takeaways, in plain language
  tags: string[]
  file: string          // path under /public, e.g. "/research/xxx.pdf"
  sections?: { heading: string; paragraphs: string[] }[] // optional: full paper body
  // rendered as real on-page HTML (not just abstract + key findings) for
  // maximum AI/search citability. Omit to fall back to the abstract-only
  // detail-page layout (what the first paper still uses).
}

// The author entity. `sameAs` should hold public profile URLs (LinkedIn,
// Google Scholar, ORCID, etc.) — they strengthen how strongly search engines
// and AI answer engines tie this work to Idarus specifically. Add real URLs
// only; leave the array empty rather than guessing.
export const AUTHOR = {
  name: 'Idarus Ali',
  firstName: 'Idarus',
  role: 'Founder, AskBiz',
  email: 'idarus@askbiz.co',
  image: '/images/founder.jpg',
  credentials: ['BSc Computer Science', 'MA Applied Linguistics'],
  sameAs: [] as string[],
}

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    slug: 'the-accountant-who-saw-an-empty-shop',
    title:
      'The Accountant Who Saw an Empty Shop: Separating Visibility From Control in Micro-Enterprise Software',
    type: 'Working Paper',
    date: 'August 2026',
    length: '~3,100 words',
    summary:
      'Most access-control systems assume trust is one dial: the more someone is trusted, the more they can see and the more they can do. This working paper reports what happened when a point-of-sale platform had to model a relationship that assumption has no room for — the accountant who should see everything and change nothing. For months, the honest answer was that there was nowhere to put them, and the failure was not a locked door but an unlocked one that opened onto the wrong account.',
    abstract:
      'Most access-control systems compress two different questions into one: how much can this person see, and how much can they change. For an owner-run micro-enterprise, that compression is a design defect, not a simplification. A hired accountant, a silent business partner, and a cashier are three different relationships, and a system that only offers “staff” or “owner” has nowhere to put the first two. This working paper reports what happened when a point-of-sale platform used by small businesses across East Africa and the Middle East tried to model those relationships properly, and what it found while doing so. The starting failure was not a locked door; it was an unlocked one that opened onto the wrong room. Any authenticated user of the platform was, until this year, silently treated as the full owner of their own account — so an accountant invited in good faith to review someone else’s business would sign in and see their own account instead: no products, no sales, nothing obviously broken enough to report. The fix separates two dimensions that most role systems bundle together. A business partner, established to function as a co-owner in daily practice, now receives full operational parity. An accountant or auditor receives a narrow, read-only grant into financial reporting alone, deliberately built as a separate, additive path so that a permission gap anywhere else in the product can never widen their reach. The paper places this design against three points of comparison — a read-only administrator role already established at Okta, an accountant and bookkeeper collaborator role already offered by Wave, and the apparent absence of any equivalent built-in role at Loyverse, a point-of-sale competitor serving the same small-retail market — and reports plainly on what is still unverified: the new grant has not yet been exercised by a real delegated account in production, and building it surfaced a second, older population of users who had been silently affected by the same failure for longer, in an unrelated part of the same product.',
    keyFindings: [
      'Delegated access failed silently, not loudly. Before this year, any authenticated user of this product was treated as the full owner of their own account — so an accountant invited to review a real business would sign in and see their own empty one: no products, no sales, nothing that looked like an error rather than a business that simply hadn’t started yet.',
      'Trust is not one dial. Software access control usually assumes that more trust means more of everything — more visibility and more control together. A hired accountant needs the first without the second: full sight of the numbers, no ability to touch a price, a refund, or a sale. Modelling that split turned out to be the actual work.',
      'A narrow permission is safer built twice than built wide once. Rather than loosen the product’s main authorization check to let accountants and auditors through, the fix added a second, separate check used only by the one screen they are allowed to see — so a future bug anywhere else in the product cannot accidentally hand them more than that.',
      'A business partner is not a bigger kind of employee. A partner who put in half the capital functions as a co-owner in daily practice, not a trusted senior member of staff — so the product now gives that role full parity with the owner, rather than a larger version of a permission ladder built for hired staff.',
      'Fixing the front door found an older one left open the same way. Building this surfaced a second, unrelated population of already-invited team members who had been silently shown an empty version of someone else’s business for longer than the feature described here has existed — disclosed here rather than fixed quietly.',
    ],
    tags: ['Access control', 'Financial trust', 'Point of sale', 'Micro-enterprise', 'East Africa'],
    file: '/research/the-accountant-who-saw-an-empty-shop.pdf',
    sections: [
      {
        heading: '1. Introduction',
        paragraphs: [
          'Two papers from this desk precede this one. The first, Surviving on the Margins, argued that Kenya’s micro informal enterprises need security before they need formality — a safe place for savings, a trading spot nobody can take on a bribe, income that survives a bad week. The second, The Till They Couldn’t Open, reported what it took to build software that such a business could actually use at all: a camera instead of a keyboard, a phone number and a PIN instead of a password, an offline mode that behaves as the normal case rather than an emergency one.',
          'This paper picks up after both of those. It assumes the business already exists, and that its owner has already gotten the software open. It asks a narrower question that only comes up once a business is actually running the tool day to day: who else gets to touch it, and how much of it should they be allowed to touch? An owner rarely runs a business entirely alone. There is often a hired accountant who checks the books once a month. There is sometimes a business partner who put in half the money and expects to see everything as a matter of course. There is, in family businesses especially, a relative who helps out on busy days without being on the payroll in any formal sense. None of these people is quite an employee, and none of them is the owner. Most access-control systems, including this one until recently, have nowhere to put them.',
        ],
      },
      {
        heading: '2. Employee or Owner, Nothing Between',
        paragraphs: [
          'The product already had a role in its own records literally called “accountant.” It had existed for months, in a completely different part of the system — a business-intelligence dashboard, built for a company sophisticated enough to want its own reporting stack, that let an owner invite team members under labels including analyst, accountant, and buyer. None of those labels reached the point-of-sale side of the product at all. An owner running a market stall or a small shop through the till had no way to invite anyone into anything; the only two states available were “the person logged in with the owner’s own credentials” and “a till cashier with a PIN,” and a cashier’s permissions are built for someone who rings up sales, not someone who reviews them.',
          'This gap is not a small oversight. Put simply: a hired accountant is not a stranger and not an employee. They are trusted with the most sensitive part of the business — the actual numbers — for a few hours a month, and trusted with none of the rest of it. A business partner is a different relationship again: someone who put in real capital or does real work and expects, reasonably, to see and do everything the owner can. A system built only for “owner” and “staff” has no honest slot for either of them, and the honest slot matters, because the alternative is always the same: share the owner’s own login and PIN, and hope nothing goes wrong.',
        ],
      },
      {
        heading: '3. Two Kinds of Trust',
        paragraphs: [
          'Most role-based access systems make an implicit assumption: that trust is one quantity, and a higher role simply gets more of it, in every direction at once. An “admin” role can see more and do more than a “member” role; a “manager” can see more and do more than a “cashier.” That assumption is usually harmless, because in most organisations, the person you trust to see sensitive information is also the person you would trust to act on it.',
          'That assumption breaks for the accountant relationship specifically. An owner may trust their accountant completely with the real sales and profit numbers — more than they trust some of their own staff — while trusting them with precisely nothing operational: not a price change, not a refund, not a new sale rung up on the till. This is not partial trust. It is two different kinds of trust, aimed in different directions, and a role system that can only turn one dial up or down cannot represent it. Solving the accountant problem properly meant treating financial visibility and operational control as two separate settings rather than two points on the same scale — a distinction the previous section’s role list had a name for but no working mechanism behind.',
        ],
      },
      {
        heading: '4. The Empty Shop',
        paragraphs: [
          'Here is what the product actually did, until this year, once someone accepted an invitation into any of those roles and tried to use the point-of-sale side of the business: it authenticated them normally — the invitation and the login both worked exactly as expected — and then treated them as the full owner of their own account. Not the account of the business they had just been invited into. Their own.',
          'For a genuine outside accountant, whose own account had never been used to run a shop, this meant landing on a point-of-sale dashboard with no products, no staff, no sales, and no transaction history — because there weren’t any. Nothing about that screen looks like an error. An empty dashboard on a product that legitimately supports brand-new, not-yet-stocked businesses is indistinguishable, at a glance, from a genuine new account. A conscientious accountant, invited by a real client, would have had every reason to conclude either that the business genuinely had no recorded activity yet, or that they themselves had done something wrong accepting the invitation — not that the software had quietly substituted their own account for the one they were meant to be looking at.',
          'This is a worse failure than an outright access-denied message, and it is worth naming as a general pattern beyond this one product: a permissions bug that fails by showing a plausible-looking wrong answer is far more dangerous than one that fails by refusing outright, because the first kind gives nobody a reason to report it.',
        ],
      },
      {
        heading: '5. A Grant Built Narrow, Not a Door Built Wide',
        paragraphs: [
          'The fix had two parts, and the second part is the one worth describing carefully, because it is a decision about how to build the fix, not just what the fix should do.',
          'The first part was straightforward: before treating a logged-in user as an owner, the product now checks whether that person is actually a delegated team member on someone else’s account, and if so, resolves them against the real business they were invited into rather than their own. A genuine solo owner, who has never invited anyone, is completely unaffected by this change — the check simply confirms what was already true for them.',
          'The second part is about restraint. It would have been simpler to let accountant and auditor roles through the same general-purpose check used for every other kind of access, with a permissions list attached that happened to be narrow. That was deliberately not done. Instead, the one screen accountants and auditors are allowed to see — a read-only financial and activity report — has its own separate, additive check, one that every other part of the product ignores entirely. The practical effect is that a bug introduced later, anywhere else in a large and actively developed product, cannot accidentally widen an accountant’s reach beyond that one screen, because nothing else in the product knows how to grant them anything at all. A permission is safer when it is impossible to reach from the wrong place, not merely unlikely to be reached from it.',
        ],
      },
      {
        heading: '6. The Partner Is Not a Bigger Employee',
        paragraphs: [
          'A business partner received the opposite treatment, deliberately. Where the accountant relationship called for narrowing a grant to almost nothing, the partner relationship called for granting full parity with the owner — every tab, every action, exactly as if they were the account holder themselves.',
          'The reasoning is about what a partnership actually is in practice, not about seniority. A partner who contributed half the starting capital, or who runs the counter on alternating days, is not a highly trusted employee; in every functional sense that matters to how the business is actually operated, they are a second owner who happens to log in under a different account. Treating that relationship as an elevated staff tier — more permissions than a manager, fewer than a true owner — would have modelled a hierarchy that does not exist in the real relationship it was meant to represent. The distinction between the accountant grant and the partner grant is the same distinction the rest of this paper has been making throughout: access should match the real relationship it stands in for, not a generic ladder of trust with more rungs added at the top.',
        ],
      },
      {
        heading: '7. Software That Has Solved Part of This',
        paragraphs: [
          'This problem is not new, and it is worth being honest about how much of it other software has already worked out, and where the pattern still seems to be missing entirely from products serving this specific market.',
          'Okta, an identity and access-management platform built for large organisations, has long offered a dedicated read-only administrator role: full visibility into the admin console, no ability to change anything in it, defined as its own distinct role rather than a weaker version of a higher one — the accountant and auditor distinction described here, solved years earlier for a different kind of enterprise. Wave, an accounting platform aimed at small businesses, explicitly supports inviting an accountant, bookkeeper, or business partner as a named collaborator type, which confirms that the underlying relationship this paper describes is a recognised, common one, not a quirk of this product’s own user base — though it is also worth noting, in the same spirit of honest disclosure as the rest of this series, that Wave moved collaborator access behind its paid plan in mid-2026, which is exactly the kind of barrier a genuinely cash-constrained micro-enterprise cannot always clear.',
          'The pattern looks different in software built specifically for small retail. Loyverse, a point-of-sale competitor operating in the same market as this product, ships four default roles — owner, administrator, manager, cashier — with no accountant-equivalent among them; matching this paper’s read-only financial grant there would mean an owner hand-assembling a custom role from a checklist of individual permissions themselves, correctly, with no guidance that accountant-style access is even a common enough need to have a name. That is a real gap in software built for exactly this population, and closing it without requiring the owner to get a permissions checklist right themselves was the actual point of the work described in this paper.',
        ],
      },
      {
        heading: '8. The Second Door',
        paragraphs: [
          'One finding here is reported specifically because it reflects badly on how long the underlying problem existed, in the same spirit of plain accounting the previous paper in this series committed to.',
          'The fix described in this paper was built for two new roles — accountant and auditor — that did not exist on the point-of-sale side of the product before this year. Building it required changing the general authorization check that every logged-in user passes through, and that check turned out to affect more than the two new roles. A separate, older set of team roles — analyst, buyer, viewer — invited under the product’s existing business-intelligence system, had been passing through that same check, and receiving the same silent substitution described in Section 4, for as long as that older system had existed: an invited team member with one of those roles, visiting the point-of-sale side of the product, would have quietly seen their own empty account rather than an honest refusal.',
          'The fix changes that behaviour for those roles too, and does so openly rather than quietly: a team member in one of those categories now receives a clear access-denied response instead of a misleadingly empty dashboard. This is very likely the correct outcome. It is also a visible behaviour change for anyone who had, for whatever reason, come to rely on the old response, and it is disclosed here as exactly that — a side effect discovered in the course of fixing something else, not a benefit planned from the start.',
        ],
      },
      {
        heading: '9. Discussion and Limitations',
        paragraphs: [
          'This paper carries the same caveats as the one before it, for the same reasons.',
          'The fix described here has not, as of this writing, been exercised by a real delegated account in production. It has been verified against the product’s own type system and build process, and reasoned through carefully against the code paths it touches, but no accountant or business partner has yet actually been invited, in the ordinary course of a real business’s use of the product, to confirm that the experience matches what is described here. That is the single most important open item this paper is reporting rather than resolving.',
          'The competitive comparison in Section 7 is limited to publicly documented behaviour of a small number of products, checked once, at a single point in time; software changes, and a gap observed today is not a permanent one. The claim there is about a pattern, not a permanent verdict on any named product.',
          'Finally, this paper — like the two before it — is a single company’s account of its own decisions, evaluated against its own reasoning and its own operational history, without independent replication. It is offered in that spirit: not as proof that this is the correct way to model delegated trust in small-business software, but as a specific, honestly reported account of one attempt, for others building in similar conditions.',
        ],
      },
      {
        heading: '10. Conclusion',
        paragraphs: [
          'The first paper from this desk argued that micro informal enterprises need security before they need formality. The second argued that software meant to serve them has to earn a comparable security in its own interface before any feature inside it can help anyone. This paper has argued a third, adjacent point: once that software is actually in use, trust is not a single grant an owner hands out in one size. An accountant, a business partner, and a hired cashier are three different relationships, built on three different mixes of visibility and control, and software that only offers “owner” or “staff” will eventually force one of them into a box that does not fit — usually, as this paper has shown, by quietly showing them nothing at all, rather than by refusing them honestly.',
          'The most useful evidence for that argument, again, is the least flattering: a role literally called “accountant” existed in this product’s own records for months before it granted access to anything a real accountant would need to see. Building the fix took more time thinking about which of two kinds of trust a given relationship actually called for than it took writing the code that enforces the answer. That ordering is, if this paper has a single recommendation to hand to the next person building software for this population, the one worth keeping: work out what kind of trust a relationship actually is before deciding how much of it to grant.',
        ],
      },
    ],
  },
  {
    slug: 'the-till-they-couldnt-open',
    title:
      "The Till They Couldn't Open: Designing Point-of-Sale Software for Low-Literacy, Cash-First Micro-Enterprise",
    type: 'Working Paper',
    date: 'August 2026',
    length: '~3,700 words',
    summary:
      "Most point-of-sale software assumes a user who reads comfortably, stays connected, and trusts a new login before doing anything useful. This working paper reports what changed — concretely, and with the internal data to show it — when that assumption was dropped for a product used by small businesses across East Africa. One finding is not flattering: for most of this product's early life, most of its 'active' accounts could not actually be logged into at all.",
    abstract:
      "Software for micro-enterprise in low-income markets is usually specified, designed, and tested by people who do not share their users' constraints. They can read a form without effort, they have a stable connection, and they are used to creating and remembering a password before a tool will let them do anything. This working paper reports on what changed, concretely, when a point-of-sale platform used by small retail, food, repair, and light-manufacturing businesses across East Africa and the Middle East was rebuilt around a different premise: that literacy, connectivity, and trust in a new login cannot be assumed, and so none of them can be a precondition for using the tool. Design responses are described in detail — replacing the keyboard with the camera wherever the task allows it, replacing the login form with a phone number and a short PIN, treating an offline, cash-only session as the default case rather than a degraded one, and teaching a new owner by walking them through a real first action rather than a rehearsal — alongside the operational evidence that shaped them. That evidence is reported plainly, including where it is uncomfortable: an internal review found that the substantial majority of trial accounts marked as active could not actually be logged into and used, because the till login checked a table that nothing had populated, including for the business owner. Separately, the single steepest drop-off in the entire sign-up funnel sat exactly one screen past the only place a user could ask a human for help. Both findings are used here as evidence for a broader claim: that the interfaces which exclude low-literacy, cash-first users are rarely missing a feature outright, and are far more often asking for a form of trust — a password, a document, a data connection — that the user has no reason to extend yet. The paper closes with what it cannot claim: none of this has been tested with low-literacy users under direct observation, at least one fix described here is designed but not yet deployed, and the figures reported are internal operational analysis, not independent measurement. It is offered as practitioner evidence for others building in the same conditions, not as a substitute for the research that should follow it.",
    keyFindings: [
      "A login is only as inclusive as its fallback. An internal review of every trial account that had activated the product — thirty-five, in early August 2026 — found that thirty-three, 94 percent, had no working staff login at all, including for the owner, because the till's sign-in screen checked a table that nothing had ever written a row into. The fix was not a new feature; it was making sure the account that already existed could be opened.",
      "The camera can do two jobs a form asks a literate user to do separately. On the intake and quality-control screens rebuilt this year, the same photo a worker takes to log a batch is also run through the product's own vision recognition to pre-fill the item's name — the record and the data entry happen in one action, not two.",
      "Numeracy travels further than literacy. Interaction that leads with a number — a price, a count, a percentage yield — degrades far more gracefully for a low-literacy user than one that leads with a text field, because reading and counting are different skills, and a large share of this population has the second without full confidence in the first.",
      "Help has to sit at the point of actual friction, not the point design assumes is hardest. Internal funnel analysis found the steepest single drop-off in sign-up — 15 of 34 engaged users, 44 percent — occurred at the one step with no visible way to ask a person for help, one screen past where that help link had actually been placed.",
      "A setup step that saves a value nothing downstream ever reads is a promise the product doesn't keep. The same failure — a picker or wizard collecting information that no later screen, calculation, or feature actually consumes — turned up independently in two unrelated parts of the same product, which suggests it is a structural risk of building one tool for many kinds of business, not a one-off bug.",
    ],
    tags: ['Product design', 'Low-literacy UX', 'Point of sale', 'Financial inclusion', 'East Africa'],
    file: '/research/the-till-they-couldnt-open.pdf',
    sections: [
      {
        heading: '1. Introduction',
        paragraphs: [
          'A previous paper from this desk, Surviving on the Margins, read the published evidence on Kenya’s micro informal economy and reached a specific conclusion: the jua kali artisan, the mama mboga, the kiosk owner, and the boda boda operator are not failing to grow because they lack ambition. They are managing risk in a system that offers them almost no security — of savings, of trading space, of income against a bad week. That paper was a review of published evidence. It made no claim about software.',
          'This paper does. It reports on what changed, in a real product used by small businesses across East Africa and the Middle East, when the design brief stopped assuming a user who reads comfortably, has a stable connection, and is happy to create and remember a new password before doing anything useful. Put simply: most software for small business is designed by people who do not share their users’ constraints, and it shows in decisions nobody thinks to question — a login screen, a settings form, a “connect your data” step — that quietly assume infrastructure the target user does not have.',
          'The paper is a practitioner’s account, not a controlled study. It draws on the internal record of one product’s build decisions between March and August 2026, including operational data collected in the ordinary course of running the product — sign-up funnels, activation logs, support patterns. It is offered in that spirit: not as proof that these design choices work in general, but as a specific, honestly reported record of what was built, why, and what happened next, for others building in similar conditions.',
        ],
      },
      {
        heading: '2. What "Surviving on the Margins" Leaves Open',
        paragraphs: [
          'Surviving on the Margins argued that survivalist enterprise needs security before it needs formality — a safe place to keep money, a trading spot that cannot be taken on a bribe, and something to fall back on when a shock hits. It was largely silent on a narrower, practical question: if that is what these businesses need, what does a piece of software have to look like before its target user can use it at all?',
          'That question turns out to be underestimated in a specific way. It is tempting to read “software for the informal economy” as a features problem — add inventory tracking, add mobile money, add a simple invoice, and the job is close to done. Building the product this paper describes surfaced a different problem underneath the features one. Long before a feature can help anyone, the interface around it has to ask the user to trust something: a form, a password, a login, a step that shares data with the company. For a population whose relationship with formal institutions has, per the evidence reviewed in the previous paper, mostly been extractive — county enforcement, predatory lenders, agencies that only turn up to fine or evict — that trust is not a given. It has to be earned in the interface itself, one screen at a time, before the “real” features matter at all.',
        ],
      },
      {
        heading: '3. Three Constraints, Taken as Given',
        paragraphs: [
          'Three constraints shaped every decision described in this paper. None of them is a surprising finding on its own; the contribution here is treating all three as fixed and non-negotiable, rather than as edge cases to design around later.',
          'Literacy is not evenly distributed, and it should not be assumed. Many of this product’s users can read some, but not comfortably, and not under pressure — mid-transaction, with a queue forming, in a second or third language. Some cannot read at all. A design that requires reading a paragraph before the user can do the one thing they came to do — sell something — has already lost a meaningful share of its addressable market before a single feature is evaluated.',
          'Connectivity is intermittent, not absent. Almost every user has a phone signal some of the time. Very few have it all of the time, and the moments it drops are not random — they cluster at the market, in the back of a shop with poor reception, during the exact hours a small business is busiest. Software that treats a lost connection as an error state, rather than a normal state, will fail its users at the worst possible moment: mid-sale, with a customer waiting.',
          'Trust in a new login is not free. Every additional password, every new account, every unfamiliar form is a small ask of a user who has limited reason, going in, to believe this company will treat their information any better than the last one did. This is the constraint least often named in software design generally, and the one this paper spends the most time on, because it turned out to be the one most directly responsible for the largest failure described below.',
        ],
      },
      {
        heading: '4. The Camera in Place of the Keyboard',
        paragraphs: [
          'The clearest response to the literacy constraint was to make the camera the primary way information enters the system, not a secondary convenience bolted onto a text form. Across the screens rebuilt this year — recording raw material intake at a small factory, logging output at the end of a production run, flagging a quality defect, proving a parcel was handed over intact — the default view is a live camera, not a form. A worker opens the screen and the first thing they see is a viewfinder, not a set of fields.',
          'This does more than remove typing. The same photo that becomes the permanent record of what happened is also run through the product’s own image recognition to pre-fill the item’s name wherever that is possible. One action — take the photo — produces both the evidence and the data entry. A form-first design asks a user to do these as two separate acts: describe what you did, then prove it. A camera-first design treats the description and the proof as the same object, because for a worker who reads with effort, writing a product name from memory is a real barrier that a photograph is not.',
          'The same principle governs numbers. Price and quantity are entered as digits on a large numeric keypad, not typed as free text, and, where an audio option is available, read back to the user before they confirm. This is a deliberate bet: that numeracy — the confidence to work with digits — holds up for far more of this population than reading confidence does, because counting money and haggling over a price are skills every trader already uses daily, independent of whether they read.',
        ],
      },
      {
        heading: '5. The Phone Number and the PIN in Place of a Login Form',
        paragraphs: [
          'The second response addresses the trust constraint directly. Every account on this product authenticates with a phone number and a short, self-chosen PIN — never a username invented for the occasion, never a password with rules about capital letters and symbols, and, deliberately, never an SMS one-time code that depends on a paid message actually arriving. The phone number is not a new piece of identity the user has to create and remember; it is the one they already use for everything else, including, in most of these markets, the mobile money account that already handles their cash. The PIN mirrors the exact authentication pattern that mobile money already trained an entire generation of users to trust. Nothing about signing in should feel unfamiliar to someone who has used a phone-based money agent.',
          'This choice has a second, less obvious benefit: it removes a dependency on a paid SMS provider entirely, which means authentication keeps working even in the connectivity conditions described in the previous section, and it never silently breaks because a text message got delayed or dropped — a real failure mode of one-time-code systems that this product deliberately does not have.',
        ],
      },
      {
        heading: '6. Offline as the Default, Not the Fallback',
        paragraphs: [
          'The third response treats the connectivity constraint as the normal case rather than an exception. A cashier who has once logged in on a device can go on selling for cash with no network connection at all: the login itself checks a value already saved on the device before it tries a network call, the product catalogue is mirrored locally and kept in sync whenever a connection is available, and every sale made offline is queued and written to the server the moment a signal returns, each one tagged so that a connection dropping mid-write can never turn into a duplicated or lost sale.',
          'This was scoped deliberately, not built as a blanket promise. Card and mobile-money payments still need a live connection, because they depend on a third party’s servers, not this product’s own; what works offline is the transaction type that does not need anyone else’s permission to complete — a cash sale. That is also, not coincidentally, the transaction type this population relies on most.',
        ],
      },
      {
        heading: '7. The Channel Already Trusted, Not a New One',
        paragraphs: [
          'The fourth response is about where the product shows up, not just how its own screens behave. A receipt, a repair quote, a note that an order is ready — these are sent over the messaging app the customer already has open, not through a new notification system the product would have to convince someone to trust and check. The same applies to support: when a user is stuck, the path to a real person runs through that same familiar channel, not through a ticket system or an email address they may never check.',
          'Put simply: almost every design choice described so far reduces to the same instruction — meet the user where their trust already is, and do not ask them to build a new kind of trust just to complete the task they came to do.',
        ],
      },
      {
        heading: '8. Teaching by Doing the Real Task, Not Simulating It',
        paragraphs: [
          'An earlier version of this product’s setup flow asked a new owner to walk through a simulation before they could start selling: take a practice photo, enter a practice price, add a few sample items, as a rehearsal for the real thing. It was replaced, this year, with a different approach — the new owner is taken directly to the real, live dashboard and walked through adding their first real member of staff, one small step at a time, with the interface highlighting exactly where to tap next and only advancing once that real action has actually happened, not on a timer or a “next” click.',
          'The lesson behind the change is simple to state and easy to skip in practice: a rehearsal teaches someone what the product would feel like; doing the real task the first time teaches them what it actually does, and it produces something useful — a real staff account — instead of throwaway practice data that has to be found and deleted later.',
        ],
      },
      {
        heading: '9. The Till Nobody Could Open',
        paragraphs: [
          'Two findings from this product’s own operational data motivated real changes, and are reported here in full, including where they reflect badly on earlier decisions.',
          'In early August 2026, an internal review checked every trial account that had been marked as activated for point-of-sale — thirty-five of them — against whether anyone could actually sign in and make a sale. Thirty-three of the thirty-five could not. The till’s sign-in screen checked a single staff table for a matching phone number and PIN; nothing in the sign-up flow had ever written a row to that table for the account owner. An owner could complete sign-up, see the product marked as active on their account, and have no way at all to open their own till. This was not a case of a good feature failing to be adopted. It was a login that had never been created, on an account the product’s own records called active.',
          'The fix, now live, is small and unglamorous: the moment a trial is claimed, a staff login is generated automatically for the owner, with a PIN shown once, in the same screen, at the same moment the trial activates. It closes the gap for every new account going forward. It does not, on its own, reach the roughly three dozen accounts that were already stuck before the fix shipped — those need separate, deliberate outreach, which is acknowledged here as unfinished, not solved.',
        ],
      },
      {
        heading: '10. The Cliff One Screen Past the Help Link',
        paragraphs: [
          'A separate review of the sign-up funnel — thirty-four users who had engaged with it in its first week — found the single steepest drop-off anywhere in the sequence: fifteen of the thirty-four, 44 percent, reached the step where they add their first products and never added one. No other step lost anywhere close to that share of users. The screen immediately before it had a link to ask a real person for help, on WhatsApp. The screen where people actually got stuck did not.',
          'The lesson generalises past this one screen: a help affordance placed where the design assumes the difficulty lives, rather than where users are actually observed to stop, does very little good. At the time of writing, moving that help link to the point of real friction is designed and awaiting deployment, not yet live — reported here as an in-progress finding, not a finished fix, in the same spirit of plain accounting as the previous paper’s own unfinished items.',
        ],
      },
      {
        heading: '11. The Picker With No Consumer',
        paragraphs: [
          'A third pattern surfaced twice, independently, in two unrelated parts of the same product. In one, a new business owner was asked, during sign-up, what their small factory produces, and told this would help set up the right production stages for their business. It saved the answer, and nothing downstream ever read it — every factory got an identical set of screens regardless of what it actually made, until this was found and fixed by connecting that saved answer to per-product yield targets. In the other, a repair shop was simply missing from the list of business types at sign-up, despite repair-specific tools existing elsewhere in the product; the real owner of a real repair shop, signing up in the ordinary course of business, picked “Retail” as the closest available option because there was no better one, and was then walked through a wizard built for photographing products on a shelf.',
          'Neither is a case of a missing feature. Both are a setup step that made a promise — this will help us tailor the experience for you — that nothing downstream was built to keep. Because the same shape of bug appeared twice, in different parts of the product, built by the same team, it is treated here as a structural risk rather than a coincidence: any product that asks a user to self-identify into one of many categories, early, before showing them anything, should be checked deliberately, category by category, for whether every category’s answer actually reaches a real downstream consumer. It is an easy thing to promise in a dropdown and forget to build.',
        ],
      },
      {
        heading: '12. Discussion and Limitations',
        paragraphs: [
          'This paper should not be read as more than it is. It is a single company’s account of its own product decisions, evaluated against its own operational data, without a control group, without independent replication, and without direct observation of low-literacy users actually attempting these tasks. Several limitations are worth stating plainly, in the same spirit as the caveats carried in the previous paper.',
          'No formal usability study with low-literacy participants has been conducted against any of the screens described here. The design choices are informed by the published literature on low-literacy interface design and by direct operational evidence from this product’s own users, but they have not been independently validated with users under observation, and that is the single most important piece of research this paper is missing rather than reporting.',
          'The offline design described in Section 6 has a known, accepted gap: when the same item is sold from two different offline devices before either reconnects, the system does not reconcile the two sales against each other — the server’s version simply overwrites on next sync. This is a scope decision, not an oversight, but it is a real limitation for any business selling the same stock from multiple tills.',
          'Not every fix described in this paper is deployed. Section 10’s help-relocation is designed but not yet live, and is reported as such. Readers citing this paper should not assume that every design response described here is currently running in production; where that distinction matters, it has been marked.',
          'The operational figures in Sections 9 and 10 are internal analysis on small samples — thirty-five and thirty-four accounts respectively — not independently audited statistics, and they describe one product’s early users in one period, not a general claim about micro-enterprise software adoption. They are reported because they are true and because they were the direct, specific cause of the design decisions described above, not because they are statistically powerful on their own.',
        ],
      },
      {
        heading: '13. Conclusion',
        paragraphs: [
          'The previous paper from this desk argued that Kenya’s micro informal enterprises need security before they need formality — a safe place for savings, a trading spot nobody can take on a bribe, income that survives a bad week. This paper has argued a narrower, adjacent point: a tool meant to serve that same population has to earn a comparable kind of security in its own interface, one screen at a time, before any feature inside it can help anyone. It does that by asking for less trust than software conventionally does — no new password, no form that has to be read before it can be filled in, no assumption that a connection will hold — and by putting the camera, the phone number, and the messaging app the user already relies on at the centre of the design, rather than treating them as accessibility add-ons around a conventional form-based product.',
          'The clearest evidence for this argument is also the least flattering: for most of this product’s early life, a meaningful share of the businesses it claimed to serve could not actually log in and use it. That is not a story about a missing feature. It is a story about designing for a user this project only partly understood, finding out plainly where that understanding fell short, and fixing the specific thing that was broken. The honest version of this paper’s contribution is not a set of design principles proven to work — it is a record of what one product got wrong, what changed as a result, and what is still unverified, offered so that the next person building in the same conditions starts a little further along than this one did.',
        ],
      },
    ],
  },
  {
    slug: 'surviving-on-the-margins',
    title:
      'Surviving on the Margins: A Structured Systematic Review of Micro Informal Business, Poverty, and Livelihoods in Kenya',
    type: 'Systematic Review',
    date: 'July 2026',
    length: '~11,700 words',
    summary:
      'Most Kenyans who work run a micro informal business — a stall, a kiosk, a boda boda — and most of them do not grow. They survive. This review reads the evidence through a survival-and-poverty lens and argues that what these firms need first is security of savings, of trading space, and of income, not formal registration.',
    abstract:
      "Micro informal enterprises employ the majority of Kenya's working population, yet most of them do not grow. They persist. This review asks why, and it reads the evidence through a survival-and-poverty lens rather than a growth one. Following a structured, PRISMA-informed protocol, it synthesises peer-reviewed studies, national statistics, and grey literature on Kenya's micro informal sector — the jua kali artisans, street vendors, mama mbogas, kiosk owners, and boda boda operators who make up the country's real labour market. Three findings stand out. First, the sector is defined by survivalist logic: most firms exist to smooth household consumption, not to accumulate capital, and their scale reflects risk management, not a lack of ambition. Second, the binding constraints are structural and mutually reinforcing — thin capital, unsafe savings, insecure trading space, harassment by county enforcement, and near-total exclusion from social protection. Third, the interventions promoted as solutions, from mobile money to state credit, have delivered real but uneven gains; mobile money moved households out of poverty, while flagship state credit largely financed consumption and defaulted. The review concludes that formalisation, framed as registration, misreads the problem. What survivalist enterprise needs first is security — of savings, of space, and of income against shocks. Policy that starts there will do more for the poor than policy that starts with a licence.",
    keyFindings: [
      'The sector runs on survival, not growth. Most micro informal firms exist to keep a household fed, not to build capital — so their small size reflects rational risk management, not a lack of ambition.',
      'Unsafe savings bind harder than scarce credit. A safe place to store money raises investment more than a loan does; credit pushed at a household with no buffer tends to become consumption, and then debt.',
      'Insecure trading space is economic policy, not just urban management. Harassment, eviction, and extortion by county enforcement act as a regressive tax and stop vendors investing in their own pitches.',
      'The poorest firms are the most exposed to shocks and the least insured. With only about a tenth of the population covered by any contributory social protection, the firm itself becomes the household’s only shock absorber.',
      'What works is security, not registration. Mobile money and safe savings cut poverty by making households more resilient, while flagship state credit (the Hustler Fund) largely financed consumption and defaulted.',
    ],
    tags: ['Informal economy', 'Kenya', 'Micro-enterprise', 'Poverty', 'Livelihoods'],
    file: '/research/surviving-on-the-margins.pdf',
  },
]

export function getPaper(slug: string): ResearchPaper | undefined {
  return RESEARCH_PAPERS.find((p) => p.slug === slug)
}
