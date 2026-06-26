---
target: app/(auth)/signin/page.tsx
total_score: 26
p0_count: 2
p1_count: 3
timestamp: 2026-06-26T21-05-38Z
slug: app-auth-signin-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading state is text-only ("Please wait") — no spinner; OAuth redirect gives no feedback |
| 2 | Match System / Real World | 4 | Language is plain and conventional throughout |
| 3 | User Control and Freedom | 3 | No forgot-password link; mode switch is free but no back escape during OAuth |
| 4 | Consistency and Standards | 2 | Ghost-card pattern (border + 32px shadow); borderRadius:20 on card; input focus ring uses indigo (brand violation) |
| 5 | Error Prevention | 3 | CTA disabled until required fields filled; consent checked; email enumeration protected |
| 6 | Recognition Rather Than Recall | 3 | All actions labeled; "magic link" and "passkey" are unexplained for non-technical users |
| 7 | Flexibility and Efficiency | 2 | Enter key works; no auto-focus on first field; no forgot password; passkey absent from signup |
| 8 | Aesthetic and Minimalist Design | 2 | Card ghost-card; over-rounded 20px radius; signup shows 10+ distinct elements simultaneously; legal block heavy |
| 9 | Error Recovery | 2 | Error text (#f48080 on white) fails WCAG AA (~1.4:1); error messages are Supabase internals |
| 10 | Help and Documentation | 2 | No forgot-password; "magic link" and "passkey" unexplained; no contextual help |
| **Total** | | **26/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment**: Yes, this reads as AI-generated without hesitation. The composition (centered card on gray shell, tab switcher, 2–3 social buttons, horizontal rule with "or", email/password stack, full-width pill CTA) is the #1 training-data response to "build me an auth page." Nothing reads as AskBiz specifically; the brand's "sharp, direct, confident" voice is entirely absent. Swap the logo and terracotta for any SaaS accent and nothing would feel different.

**Deterministic scan**: 0 findings from `detect.mjs` — the detector operates on CSS class names and the signin page uses inline styles exclusively, so the two confirmed ban violations (ghost-card, over-rounding) escaped it. They are real and confirmed by code review.

**Visual overlays**: Browser automation unavailable in this session — no overlay injection. Fallback: source code review.

## Overall Impression

The page works and doesn't confuse anyone. That's the ceiling, not the floor. The ghost-card and over-rounding are cosmetic but signal "template, not brand." The error text contrast failure and the indigo focus ring are real accessibility and consistency bugs. The signup form's cognitive load — 10+ distinct zones visible simultaneously — combined with a dense two-paragraph legal block will hurt conversion. The biggest opportunity: make this page feel like the product it's the gateway to.

## What's Working

1. **Consent architecture is solid.** Affirmative checkbox, explicit legal version pinning (`CONSENT_VERSION`), and the age/GDPR copy are correctly implemented. Most auth pages skip this entirely.
2. **Three auth paths coexist gracefully.** OAuth, email/password, and magic link are all visible without fighting for attention. Passkey is present but unobtrusive.
3. **Error states are structurally correct.** The container exists, the color intent is right; only the specific tint (#f48080) has a contrast failure — the bones are there.

## Priority Issues

**[P0] Ghost-card pattern — absolute ban**
- **What**: Card has `border: '1px solid var(--b)'` AND `boxShadow: '0 8px 32px rgba(0,0,0,.08)'`. The blur (32px) is double the 16px ban threshold.
- **Why it matters**: Directly violates the design system's "One-or-the-Other Rule". Creates a double-outline effect that reads as decorative noise on an already simple layout.
- **Fix**: Remove `boxShadow` from the card. The white card on `#f2f3f5` shell already has sufficient separation; the border confirms it. No shadow needed.
- **Suggested command**: `$impeccable polish`

**[P0] Card border-radius: 20 — over-rounding**
- **What**: `borderRadius: 20` on the auth card. Design system max for cards is `--r-lg: 16px`.
- **Why it matters**: 20px pushes into the "codex over-rounding tell" territory. Any value between 17–40px on a card reads as generic SaaS template.
- **Fix**: Change to `var(--r-lg)` (16px).
- **Suggested command**: `$impeccable polish`

**[P1] Input focus ring uses indigo — design system violation**
- **What**: `globals.css` sets `input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,.15) }` — that's the `--ai` indigo, reserved exclusively for the AI/Ask feature.
- **Why it matters**: Every time a user focuses an email or password field, the AI-feature color bleeds in. Breaks "The One Accent Rule." Focus rings on auth inputs must use the amber tint: `rgba(208,138,89,.15)`.
- **Fix**: Update the `input:focus` rule in `globals.css` to `box-shadow: 0 0 0 3px rgba(208,138,89,.15)`.
- **Suggested command**: `$impeccable polish`

**[P1] Error text fails WCAG AA contrast**
- **What**: `color: '#f48080'` on a near-white background (`rgba(244,128,128,.1)` on `#fff`). Computed contrast: ~1.4:1. WCAG AA requires 4.5:1 for 13px text.
- **Why it matters**: Accessibility failure. Users with low vision (and even normal-vision users in bright ambient light) can't read the error message — at exactly the moment they most need to.
- **Fix**: Change error text color to `#c0392b` (dark red, ~7:1 on white) or `#a12121`. Keep the background tint; only the text color needs to change.
- **Suggested command**: `$impeccable polish`

**[P1] Brand voice absent — page reads as template**
- **What**: "Get started free" / "Welcome back" are the most generic possible auth headings. The terracotta color is the only brand signal.
- **Why it matters**: Users converting from the marketing site expect continuity. This page feels like a different product.
- **Fix**: "Your numbers are waiting." (signup) / "Back to your numbers." (signin) — single line, direct, product-relevant. Carries the "answers not dashboards" brand voice into the first real interaction.
- **Suggested command**: `$impeccable clarify` then `$impeccable polish`

## Persona Red Flags

**Jordan (First-Timer) — auth page primary persona:**
- Sees "Sign in with passkey" — has no idea what a passkey is. No tooltip, no explanation. Will ignore it, which is fine, but the unexplained term creates hesitation.
- On signup: the "I agree to Terms" checkbox is above the CTA, but the age confirmation and consent details paragraph are BELOW the CTA. Jordan reads top-to-bottom: clicks "Create account →", wonders why it's disabled, scrolls down, finds the checkbox, re-reads. The visual hierarchy of the consent flow is inverted.
- "Send magic link" button at the bottom is unlabeled as to when/why to use it. Jordan will skip it even if it's the better option for them.

**Sam (Accessibility-Dependent):**
- Error text #f48080 on white fails 4.5:1. Critical for low-vision users.
- No `aria-live="polite"` on the error/success container — screen reader does not announce state changes. The error appears visually but is never spoken.
- `id="consent"` is correctly linked to the label — this part is right.
- The `min-height: 44px` is enforced globally in CSS — touch targets are correct.

**Casey (Distracted Mobile User):**
- On signup, the full form is: First name, Last name, Email, Password, Consent checkbox, CTA, Legal paragraph 1, Legal paragraph 2, Magic link button — 9 zones of content requiring scroll on a small screen.
- The "Create account →" CTA sits below a checkbox and above 2 legal paragraphs — not in the thumb zone on most phones.
- The `position: fixed; inset: 0; overflow-y: auto` wrapper correctly handles the page, but the form is very tall on signup mode.

## Minor Observations

- The `onKeyDown` Enter handler on password fires `triggerAuth('email')` — this works, but the email field's Enter key also fires it. If the user is in the email field and presses Enter without filling the password, the CTA fires (or attempts to) before password is entered. The disabled logic prevents submission, but the interaction is slightly odd.
- The passkey button in signin mode has no visual distinction from the Google/Microsoft buttons (same height, same border style). It should either be clearly separated or styled differently — passkey is fundamentally different from OAuth.
- `borderRadius: 20` on the main card vs `borderRadius: 9999` on the tabs and CTA — the radius contrast is jarring. Everything wants to be a pill, but the card is almost a pill too.
- The magic link button (`borderRadius: 9999`, `border: '1px solid var(--b2)'`) and the social buttons have identical visual weight, creating a 5-button stack with no hierarchy in the signin view.
