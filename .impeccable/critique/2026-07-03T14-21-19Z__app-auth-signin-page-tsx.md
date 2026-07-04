---
target: app/(auth)/signin/page.tsx — Sign in + Create account
total_score: 24
p0_count: 1
p1_count: 2
timestamp: 2026-07-03T14-21-19Z
slug: app-auth-signin-page-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading spinner + "Please wait" on submit is good; but PIN-mismatch and other field errors only surface after submit, not live |
| 2 | Match Between System and Real World | 3 | "4-digit PIN" instead of "password" matches the informal-market mental model well; phone hint's "(not 07…)" shorthand is terse for a first-timer |
| 3 | User Control and Freedom | 2 | No password/PIN reveal toggle; passkey-nudge screen has only two forward paths, no explicit dismiss (X) |
| 4 | Consistency and Standards | 3 | Tab-pill pattern reused consistently for mode and method; CTA arrow "→" applied inconsistently across button types |
| 5 | Error Prevention | 2 | PIN + confirm-PIN exists, but nothing catches a too-short PIN until submit; no inline validation |
| 6 | Recognition Rather Than Recall | 2 | Every field is placeholder-only (no persistent `<label>`) — once text is typed, the field's purpose isn't visible anymore |
| 7 | Flexibility and Efficiency of Use | 3 | OAuth + passkey + magic link + phone-PIN covers a genuinely wide range of users/regions |
| 8 | Aesthetic and Minimalist Design | 3 | Clean and on-brand; the idle 3D tilt is the one indulgence that cuts against "minimalist" |
| 9 | Help Recognize/Diagnose/Recover from Errors | 2 | Errors render as one plain banner at the form's bottom — no per-field association or inline marking |
| 10 | Help and Documentation | 1 | One line of hint text is the only contextual help anywhere on the page |
| **Total** | | **24/40** | **Acceptable — significant improvements needed** |

#### Anti-Patterns Verdict

**LLM assessment**: Doesn't scream "AI made this" at first glance — flat elevated tab tray, single amber accent, border-only cards all track the project's own DESIGN.md system, and the worst AI tells are absent (no ghost-card double-shadow, no gradient text, radius stays within the 10-16px spec). Two things puncture it: the sign-in card idly self-animates a 3D tilt (`animate-tilt-3d`, page.tsx:342) whenever the cursor isn't on it — a "look what I can do with CSS" flourish on a transactional form nobody asked to be entertained by — and the nested pill-inside-pill tab structure (mode pill + method pill, lines 384-477) is a very familiar SaaS-auth-template composition once you've seen a few of these.

**Deterministic scan**: `detect.mjs` on the target file itself (`app/(auth)/signin/page.tsx`) came back clean — exit 0, zero findings. Run separately against `app/globals.css` it surfaced 2 warnings: `bounce-easing` at globals.css:187 (the `--ease-back` token definition, `cubic-bezier(.34,1.56,.64,1)`) and `layout-transition` at globals.css:335 (`transition: width` inside `.nav-link::after`). Both are **likely not reachable from this page** — grepping the signin page's own source turns up zero references to `ease-back` or `.nav-link`; they're real findings against the global stylesheet as a file, just not proven to fire on this specific route. Net: the detector found nothing solid tying back to the signin page — the two P1/P0 issues below (contrast, idle animation) are things the LLM review caught that a static-analysis pass structurally can't (contrast requires computed-style math against actual token values; the idle-tilt problem is a UX/brand-fit judgment, not a lint rule).

**Visual overlays**: Injection did not succeed — this app serves a strict CSP (`script-src 'self' ...`) that doesn't allowlist the live-server's origin (`localhost:8400`), so the injected detector script was blocked by the browser (confirmed via `onerror` and `window.impeccableScan` staying `undefined`). This is a genuine environment constraint, not a skipped step — DOM mutation itself worked fine, only the cross-origin script load was blocked. No live `[Human]`-tab overlay is available for this run. Screenshots of both Sign in and Create account states (desktop + mobile) were captured directly instead and fed the design review.

#### Overall Impression

The page is a workmanlike, mostly on-brand auth flow that avoids the most obvious AI tells but ships two real usability regressions introduced by this session's own recent changes: placeholder-only labels with a contrast failure, and a self-animating 3D tilt that runs opposite to the brand's own stated "speed reads as confidence" principle. Fix those two and the signup flow's field-stacking, and this jumps from "Acceptable" toward "Good."

#### What's Working

1. **Passkey nudge, deferred correctly.** It shows up only after auth succeeds, not as a blocking pre-condition, and gives a genuine escape hatch ("don't remind me again") rather than nagging every session — disciplined flow design.
2. **Sliding pill indicators.** Both the mode toggle and the method toggle animate a single absolutely-positioned div via `translateX` rather than restyling every button — cheap, smooth, and reuses the project's own `--ease` spring token.
3. **Phone+PIN copy is persona-specific, not generic.** "Use the number you run your business on. No SMS needed" speaks directly to a market-trader user without reliable SMS/data, which is exactly who PRODUCT.md says this is for.

#### Priority Issues

**[P0] Placeholder-only labels with failing contrast**
- **What**: Every input (email, password, name, phone, PIN) uses `placeholder` as its only label. Measured placeholder contrast is ~2.11:1 against the input background — well under the WCAG AA 4.5:1 floor DESIGN.md itself mandates.
- **Why it matters**: Fails low-vision users outright, fails DESIGN.md's own accessibility line, and once any value is typed the field has no persistent label at all — Recognition-Rather-Than-Recall breaks for every user, not just accessibility-dependent ones.
- **Fix**: Add visible static or floating labels above/inside each field. If placeholder text remains as a secondary hint, darken it to at least `--tx2` (`#5a5652`), which clears ~4:1 against the elevated input background.
- **Suggested command**: `$impeccable harden`

**[P1] Idle self-animating 3D tilt on the auth card**
- **What**: `animate-tilt-3d` (page.tsx:342) runs a continuous rotateX/rotateY loop whenever the cursor isn't on the card.
- **Why it matters**: Directly contradicts DESIGN.md principle 5 ("speed reads as confidence... hesitation in the motion = hesitation in the product") on the one page where a user most wants to finish fast. It's also the page's single strongest "AI flourish" tell. No evidence of a page-specific `prefers-reduced-motion` guard on this animation.
- **Fix**: Drop the idle loop; keep tilt as a hover-only micro-interaction, and confirm it's gated behind `prefers-reduced-motion: no-preference`.
- **Suggested command**: `$impeccable quieter`

**[P1] Create Account + Phone stacks too many fields with no chunking**
- **What**: Name (2 fields) + phone (2 fields) + PIN + confirm-PIN (2 fields) + consent checkbox + CTA all render in one unbroken column (page.tsx:480-546), no section break or step indicator.
- **Why it matters**: Fails the cognitive-load checklist on both "chunking ≤4 items/group" and "progressive disclosure" — for a first-time app user this reads as a wall of asks before any payoff.
- **Fix**: Either paginate into "who are you" → "how do you sign in" steps, or add a visual break (subtle divider/heading) between identity fields and credential fields.
- **Suggested command**: `$impeccable layout`

**[P2] No password/PIN visibility toggle**
- **What**: Password and both PIN fields are `type="password"` with no reveal option (lines 493, 513, 518).
- **Why it matters**: A blind 4-digit PIN typo is easy and costly to repeat across PIN + confirm-PIN; a distracted, interrupted mobile user benefits most from being able to glance-confirm before submitting.
- **Fix**: Add a reveal-toggle icon inside the field, at minimum on the two PIN inputs.
- **Suggested command**: `$impeccable polish`

**[P3] Inconsistent CTA microcopy pattern**
- **What**: Primary buttons append "→" ("Sign in →", "Create account →") but OAuth/passkey buttons don't; the arrow isn't confirmed `aria-hidden`.
- **Why it matters**: Minor visual inconsistency; possible screen-reader noise ("Sign in, right arrow").
- **Fix**: Confirm/add `aria-hidden` on the decorative arrow span.
- **Suggested command**: `$impeccable polish`

#### Persona Red Flags

**Sam (Accessibility-Dependent)**: The placeholder-contrast failure (~2.11:1) is the headline problem for low vision. Beyond that, no input has a real `<label>` or `aria-label` except the phone country `<select>` — a screen-reader user tabbing through signup will hear "textbox, blank" on at least 4 of 6 fields (first name, last name, phone, PIN, confirm PIN), since placeholder text isn't reliably announced as a label across AT/browser combinations.

**Jordan (Confused First-Timer / informal trader)**: The "phone + 4-digit PIN, no SMS" model is unfamiliar relative to every SMS-OTP app this persona already knows. The one line explaining it (page.tsx:524) sits *below* the fields it explains rather than before them, so confusion likely lands before the reassurance does. The dial-code `<select>` shows only flag + dial code, no country name — someone unsure of their own country's dial code has no way to visually confirm the right selection without opening the list.

**Riley (Deliberate Stress Tester)**: Refreshing mid-flow on Create Account + Phone silently drops all typed state (names, phone, both PINs) — no `beforeunload` guard. Typing a PIN that doesn't match `pinConfirm` is allowed silently until submit; there's no live inline validation to catch it earlier.

#### Minor Observations

- The phone-country `<select>` (page.tsx:500) is a native, un-searchable list — with 40+ currencies/countries in scope per PRODUCT.md, a searchable combobox would scale better.
- The success message concatenates a literal "✓" character into JSX text (page.tsx:550) instead of using an SVG icon, inconsistent with the rest of the page's iconography.
- "Already have an account? Sign in" (page.tsx:583-586) is hardcoded English, bypassing the `tc()` i18n function used everywhere else on the page.
- The Shopify-install banner (page.tsx:306-325) uses hardcoded hex colors (`#5A8A00`, `rgba(150,191,72,...)`) that don't exist in DESIGN.md's token palette — a third accent color has snuck onto the page.

#### Questions to Consider

- If the brand's whole pitch is "speed reads as confidence, hesitation in the motion = hesitation in the product," why does the sign-in card idle-wobble in 3D when nobody's touching it?
- The target persona is explicitly described as new to apps, with unreliable data/SMS — does placeholder-only labeling, which vanishes the instant they start typing, actually suit someone unfamiliar with standard form conventions?
- Consent and PIN-confirmation are both high-stakes, low-reversibility moments — why do they carry the same plain visual weight as low-stakes fields like first name?
