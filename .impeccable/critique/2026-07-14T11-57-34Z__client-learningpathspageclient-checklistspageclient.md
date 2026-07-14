---
target: AskBiz Academy UI (hub, article, learning paths, checklists)
total_score: 25
p0_count: 0
p1_count: 3
timestamp: 2026-07-14T11-57-34Z
slug: client-learningpathspageclient-checklistspageclient
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Learning Paths and the article reader show zero progress feedback; Checklists shows a % but it isn't saved anywhere |
| 2 | Match System / Real World | 3 | Plain business language throughout, no jargon issues found |
| 3 | User Control and Freedom | 2 | Checklist progress is lost on refresh/navigation — no way to "keep" the state you built |
| 4 | Consistency and Standards | 2 | Ink/background/muted colors are hand-picked per file and diverge between the hub, article page, and learning paths (three near-identical but different hex sets) |
| 5 | Error Prevention | 3 | Nothing destructive to guard against; n/a mostly |
| 6 | Recognition Rather Than Recall | 2 | No "you were here" / resume affordance anywhere in a 25-category, 644-article library |
| 7 | Flexibility and Efficiency of Use | 2 | No keyboard shortcuts, no saved/bookmarked articles, no way to skip what you've already read |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, whitespace used well, no visual clutter |
| 9 | Error Recovery | 3 | "No results" state exists with a working way back |
| 10 | Help and Documentation | 3 | Cross-links to Help Centre/blog are present in the sidebar |
| **Total** | | **25/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**LLM assessment**: Doesn't read as AI slop in the visual-design sense — no gradient text, no side-stripe borders, no over-rounded cards, no eyebrow-on-every-section pattern. The bigger tell is structural: this is a flat article-browser dressed up with course-shaped labels ("Learning Paths", numbered lesson lists, difficulty badges) but none of the mechanics that make a course feel like a course — no completion state, no resume point, no sense of progress through the 644 articles. It reads like a blog with a sidebar, not a curriculum.

**Deterministic scan**: `detect.mjs` found only 2 low-severity hits, both in `ChecklistsPageClient.tsx` (lines 457, 487) — `transition: width` on progress-bar fills. Real, but minor (a 3px/8px bar animating width is standard and cheap; not worth a rewrite). No other pattern-bans triggered across the 4 files.

**Visual overlay**: Not run this pass — I verified findings via source read, computed WCAG contrast math, and the CLI detector rather than a live browser injection, to keep this a report-only pass as requested. Flagging per the skill's protocol: `Assessment independence: degraded (single-pass review, no browser overlay)`.

## Overall Impression

The Academy has good bones — categorized content, a working search, a numbered lesson list inside Learning Paths, and a genuinely nice checklist-with-progress-bar pattern already built in `ChecklistsPageClient.tsx`. The problem is that pattern doesn't travel: Learning Paths (the one section explicitly modeled as a "course") has no completion tracking at all, and the one place that *does* track progress doesn't save it. The single biggest opportunity is closing that gap — you've already invented the right UI (progress bar + checked-count), it's just stuck in one file.

## What's Working

- **The checklist progress bar** (`ChecklistsPageClient.tsx:481-488`) — segmented visually from the content, shows both a bar and a `checkedCount/totalItems (pct%)` label, celebrates 100% with a distinct color. This is the right shape for "am I done yet" feedback; it just needs to persist and to spread to the rest of Academy.
- **Mobile sidebar as an overlay, not stacked content** — unlike the Help Centre's original bug (topics list pushed the search bar below the fold on mobile), Academy's sidebar is a slide-in overlay triggered by a hamburger button, so mobile users see content first. Good instinct, worth keeping as the pattern going forward.
- **Numbered lesson list inside a Learning Path** (`LearningPathsPageClient.tsx:277-292`) — circular numbered badges per article is the correct instinct for "this is a sequence," it's just missing the completion half of that idea.

## Priority Issues

**[P1] Checklist progress isn't saved anywhere**
Why it matters: `checked` is a plain `useState<Set<string>>` (`ChecklistsPageClient.tsx:371`) with no `localStorage` read/write and no `useEffect` to persist it. A user who checks off 8 of 12 items, sees "67%", then refreshes or navigates away and back finds every box unchecked and the bar at 0%. The UI is actively showing progress it has no intention of keeping — worse than not having progress tracking at all, because it sets and breaks an expectation in the same session.
Fix: Persist `checked` to `localStorage` keyed by checklist id, hydrate on mount.
Suggested command: `$impeccable harden`

**[P1] Learning Paths — the one section modeled explicitly as a course — has zero completion tracking**
Why it matters: Every visual cue (numbered badges, "Level: Intermediate", duration estimate, "12 articles in this path") tells the user they're in a curriculum. But nothing tracks which of the 12 they've read, there's no "3/12 complete" indicator, and no way to jump back to "the one I was on." A returning user has to remember, or start scrolling and guessing.
Fix: Reuse the exact pattern already built for checklists — a `Set` of read article slugs per path, persisted to `localStorage`, rendered as a checkmark/circle-fill on each lesson number plus a path-level progress bar next to the existing article count.
Suggested command: `$impeccable onboard` (for the resume-state UX), then `$impeccable craft`

**[P1] Tertiary text color fails WCAG AA everywhere it's used, across all 4 files**
Why it matters: `TX3` (`#a39e97`) against the hub's background/cards computes to 2.51–2.66:1; the article page's `#999` against its background computes to 2.71:1 — both need 4.5:1 for body-size text. This exact class of bug (a too-light "muted" token) was just found and fixed in the Help Centre's `--hc-muted`; Academy has its own independent instances of the identical mistake, on read-time labels, article counts, breadcrumb separators, and "showing X of Y" text — i.e. exactly the metadata a returning user scans to orient themselves.
Fix: Darken `TX3` to something ≥4.5:1 (Help Centre's fix landed on `#657078` for a similar off-white background; a similar target works here) and swap `#999`/`#555` inconsistency on the article page to match.
Suggested command: `$impeccable audit`, then `$impeccable polish`

**[P2] No `:focus-visible` styling anywhere except the two search inputs**
Why it matters: Same gap just closed in the Help Centre. Every category button, article row, TOC link, related-article card, and the sidebar's expand/collapse split-button in Academy has no keyboard focus indicator. A keyboard or screen-reader user tabbing through 25 categories and their nested articles has no way to see where they are.
Fix: One global `:focus-visible` rule per Academy page (or better: extract the pattern into a shared class so it isn't re-added four separate times).
Suggested command: `$impeccable polish`

**[P2] Dead breadcrumb button — looks clickable, does nothing**
Why it matters: `AcademyClient.tsx:446` renders `<button className="ac-crumb">{currentCategory.title}</button>` with no `onClick`. The `.ac-crumb` class gives it `cursor: pointer` and an underline-on-hover, so it visually promises an action. Clicking it does nothing — no navigation, no feedback. A first-time user (or anyone testing edge cases) will click it expecting to go "up" a level and get silence.
Fix: Either wire it to `goHome()` (matching the first crumb) or render it as plain text, not a `<button>`.
Suggested command: `$impeccable clarify`

**[P3] Color-token drift between the Academy hub and the article page**
Why it matters: The hub uses `TX: #1a1916` / `BG: #f9f8f6`; the article page uses `#1a1a2e` / `#faf9f7` for the same conceptual roles (ink, background). Neither is wrong in isolation, but a user navigating hub → article → back sees a barely-perceptible but real shift in every text color on the page, and it makes future maintenance harder (two sources of truth for "what is our ink color").
Fix: Pull all of Academy's colors into one shared constants file (or the same CSS-variable approach now used in `help.css`) instead of four separate hard-coded hex blocks.
Suggested command: `$impeccable extract`

**[P3] Sidebar's category-select + expand-toggle split button likely misses the 44×44px touch target**
Why it matters: Same shape as the Help Centre chevron bug fixed last pass — `selectCategory` button (`padding: '7px 6px 7px 10px'`) and the adjacent expand toggle (`padding: '7px 10px'`) each compute to roughly 25px tall at an 11px font size, well under the 44px minimum, and this sidebar is reachable on mobile via the hamburger overlay.
Fix: Same technique as the Help Centre fix — pad the tap target with a compensating negative margin so the visual row height doesn't change.
Suggested command: `$impeccable adapt`

## Persona Red Flags

**Jordan (First-Timer)**: Clicks the current-category breadcrumb expecting it to do *something* (it looks exactly like the clickable "All Categories" crumb next to it) and gets no response — no navigation, no visual feedback, nothing. Also: opens a Learning Path, reads 4 of 12 articles, closes the tab, comes back next week, and has absolutely no way to tell which 4 they already read.

**Sam (Accessibility-Dependent)**: Tabbing through the category sidebar with a keyboard produces no visible focus indicator on any of the 25 categories or their nested article links — only the search box shows where focus is. Combined with the sub-3:1 contrast on read-time/count labels, a low-vision or keyboard-only user loses both the "where am I" and "what does this say" signals at once.

**Alex (power user / returning learner)**: Wants to resume a Learning Path exactly where they left off or skim past what they've already read. Neither is possible — no bookmark, no "continue," no visual "read" state on any article row anywhere in Academy.

## Minor Observations

- 25 categories in the sidebar (mirrors the Help Centre's 51-topic list) — fine as a browse surface, just note it's well past the "≤5 top-level nav items" guideline if it's ever treated as primary navigation.
- The `transition: width` on the two checklist progress bars is a very minor perf nit (cheap on a 3–8px-tall bar); not worth touching on its own.
- `ArticleClient`'s TOC (in the article page) has no active-section highlight on scroll, unlike the Help Centre's TOC — a small but real parity gap between the two content hubs.

## Questions to Consider

- If a returning learner can't tell what they've already read, does "Learning Paths" actually function as a *path*, or is it just a differently-labeled article list?
- The checklist progress bar already solves this exact problem one directory over — what's stopping it from being the one progress component the whole Academy shares?

---

## Udemy & Reddit: what they do that Academy doesn't

You asked me to look at how Udemy and Reddit structure their UI for inspiration. Here's what's actually transferable (not "make it look like Udemy," but the specific mechanics):

**From Udemy (verified via Udemy's own support docs on the course player):**
1. **Per-lesson completion checkmarks in the curriculum sidebar.** Every lecture row has a small checkbox; a blank square = not done, a checkmark = done. This is the single mechanic Academy is missing everywhere. It directly maps onto Learning Paths' numbered lesson list (P1 issue above) — turn the numbered circle into a checkmark once read.
2. **A visible "your progress" bar at the top of the course**, always in view, always up to date — the aggregate of the per-lesson checkmarks. Maps onto the path-level progress bar recommended above.
3. **Resources-per-lecture affordance** (a folder icon that expands to downloadable resources tied to that specific lecture) — a smaller idea, but relevant if any Academy articles have companion downloads (templates, checklists) — right now those live in a totally separate `/academy/checklists` section instead of being attached to the article that references them.
4. Udemy's course player treats "resume where you left off" as a first-class action — the platform actively invites you back to the last unfinished lecture, not just to the course homepage.

**From Reddit (well-established, stable patterns):**
1. **Visited-link dimming.** Reddit (and old-web convention generally) renders a post title in a muted/desaturated color once you've clicked into it, so scanning a long list instantly tells you what's new vs. already seen. Academy's `ArticleRow` component has no equivalent — every article looks identical whether you read it five minutes ago or never. This is a cheap, high-leverage fix: store visited slugs in `localStorage`, dim the title color on repeat visits.
2. **Sort/filter as a first-class control, not just search.** Reddit's Hot/New/Top/Rising tabs let you re-order the same content set by different criteria without typing anything. Academy only has search + category-select; there's no "show me the newest articles" or "show me what's most popular" the way the Help Centre's article rows at least show a "Popular"/"New" tag. Worth considering a lightweight sort control (Newest / Most Popular / Beginner-friendly) at the top of a category view.
3. **Flair as a fast visual filter, distinct from full-text search.** Reddit's colored flair tags let you filter a whole feed by topic with one click, without leaving the page. Academy's difficulty badges (Beginner/Intermediate/Advanced) are currently *display-only* — you can see them on each row but can't click one to filter the list to "just Beginner." That's a one-line addition (a clickable filter chip row) that would meaningfully cut down scanning effort in a 644-article library.

The common thread across both platforms: **content you've already engaged with should visually recede, and content you haven't should visually advance.** Right now every article, lesson, and category in Academy looks exactly the same on visit #1 and visit #50 — that's the single mental model shift ("read" vs "unread," "done" vs "not done") that both Udemy and Reddit are built around, and Academy currently has none of it.
