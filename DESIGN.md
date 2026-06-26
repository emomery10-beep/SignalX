---
name: AskBiz
description: AI business intelligence for SME founders — precise, direct, and built for decisions.
colors:
  accent: "#d08a59"
  accent-ai: "#6366f1"
  accent-secondary: "#8c6fe0"
  bg: "#f2f3f5"
  surface: "#ffffff"
  elevated: "#e8eaed"
  overlay: "#dde0e4"
  ink: "#161412"
  ink-muted: "#5a5652"
  ink-faint: "#706b65"
typography:
  display:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, Barlow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "22px"
  pill: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#b87540"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "11px 24px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "11px 14px"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px"
  chip-default:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
---

# Design System: AskBiz

## 1. Overview

**Creative North Star: "The Founder's Terminal"**

AskBiz looks like something a CFO would have on their desk if CFOs had good taste. Data-forward without being clinical; warm without being soft. The visual vocabulary is precise: clean tokens, sharp type, a single amber accent that carries all the brand warmth while the surface stays neutral and cool. The background is blue-gray (`#f2f3f5`) — deliberately outside the warm-cream AI band that has saturated every startup interface in 2026.

Every design decision serves one master: time-to-answer. Founders open this app with a specific question and need an answer in under 60 seconds. Anything that adds delay, hesitation, or cognitive weight is eliminated. The interface does not try to be beautiful; it tries to be *right*. The beauty is a side-effect of the precision.

The tone is that of a blunt, trusted analyst: never hedges, never over-explains, always gives you the number and the action. The visual system is the voice made visible — sharp edges, precise type, no decoration that doesn't earn its place.

**Key Characteristics:**
- Cool blue-gray shell; white cards on top; terracotta (`#d08a59`) as the only accent.
- Sora (geometric sans, tight tracking) for display and headlines; DM Sans for body.
- Spacing varies for rhythm — tight within groups, generous between sections.
- Motion is spring-based (`cubic-bezier(.16,1,.3,1)`), fast and decisive.
- RTL support built in (Arabic is an active locale).

## 2. Colors: The Amber Terminal Palette

One accent. Everything else is tonal neutrals that stay out of its way.

### Primary
- **Terracotta Amber** (`#d08a59`): The brand accent. Buttons, active tab indicators, focus outlines, links, and the AskBiz logo mark. Never used decoratively — only on interactive or identity elements. Its rarity is what makes it read as intentional.

### Secondary
- **Conversational Indigo** (`#6366f1`): Reserved exclusively for the AI / Ask feature. Marks the boundary between "data tool" and "AI conversation." Never used on non-AI elements. This separation prevents the brand from being subsumed into AI-generic indigo.

### Tertiary
- **Soft Violet** (`#8c6fe0`): Secondary AI feature accent for charts, highlights, or secondary data series. Appears sparingly.

### Neutral
- **Page Shell** (`#f2f3f5`): The outer canvas. Deliberately cool-tinted to stay out of the warm-cream AI band. Blue-gray, not beige.
- **Surface White** (`#ffffff`): Cards, modals, and panels sit on this. White is a deliberate material choice, not a default.
- **Elevated** (`#e8eaed`): Input backgrounds, tab switcher trays, chip surfaces.
- **Overlay** (`#dde0e4`): Hover states on elevated surfaces.
- **Ink** (`#161412`): Primary text. Near-black with a faint warm undertone that ties it to the amber accent without reading warm.
- **Ink Muted** (`#5a5652`): Secondary labels, supporting text.
- **Ink Faint** (`#706b65`): Timestamps, metadata, fine-print text.

### Named Rules
**The One Accent Rule.** `#d08a59` is the only brand color used on interactive elements. Never place a second accent (`#6366f1`, `#8c6fe0`) on a primary button or a navigation active state. The indigo is for AI surfaces only. Mixing them dilutes both.

**The Cool Shell Rule.** The page background (`#f2f3f5`) must remain cool. Do not warm it. The amber's warmth reads stronger against a cool field. A warm shell would muddy the contrast and the page would read as cream — which is the generic 2026 AI tell.

## 3. Typography

**Display Font:** Sora (variable, system-ui fallback)
**Body Font:** DM Sans (variable, Barlow, system-ui fallbacks)

**Character:** Sora is geometric and tight — every letter lands with purpose. DM Sans is humanist, approachable, and highly legible at small sizes. The pairing works because they diverge on the warmth axis: Sora reads technical and precise; DM Sans reads friendly and clear.

### Hierarchy
- **Display** (Sora 700, `clamp(1.5rem, 3vw, 2.25rem)`, line-height 1.15, tracking `-0.03em`): Hero titles, empty-state headlines. Use rarely.
- **Headline** (Sora 700, `20px`, line-height 1.25, tracking `-0.02em`): Card titles, section headers, modal headings.
- **Body** (DM Sans 400, `15px`, line-height 1.65): All prose, descriptions, labels. Cap line length at 65–75ch.
- **Label** (DM Sans 500, `13px`, line-height 1.4): Timestamps, metadata, form labels, nav items.
- **Micro** (DM Sans 400/500, `11–12px`): Legal text, fine print, placeholders.

### Named Rules
**The Tracking Floor Rule.** Display and headline letter-spacing never exceeds `-0.03em`. Below that, letters touch and the page reads cramped, not "designed." `-0.02em` to `-0.03em` is the working range.

**The Sora-for-Identity Rule.** Sora appears on headings and the wordmark only. Body copy, form labels, and navigation always use DM Sans. Mixing them at comparable weights destroys the hierarchy.

## 4. Elevation

AskBiz uses **tonal layering** as the primary depth signal, with two shadow tiers for interactive elevation states. The default surface is flat.

- **Rest:** Surface cards sit flat (`border: 1px solid rgba(0,0,0,.08)` only — no shadow). The shell-to-card transition from `#f2f3f5` → `#ffffff` creates the perception of lift without shadows.
- **Hover / Focus lift:** `box-shadow: 0 2px 8px rgba(0,0,0,.08)` — subtle; confirms interactivity.
- **Modal / Overlay lift:** `box-shadow: 0 8px 32px rgba(0,0,0,.12)` — used only on overlaid surfaces (modals, popovers, dropdowns) that float above the page.

### Named Rules
**The One-or-the-Other Rule.** A surface element either has a border OR a shadow — never both. The ghost-card pattern (`border: 1px solid X` + `box-shadow: 0 Npx Mpx` with blur ≥ 16px) is prohibited. Pick the border for resting states, the shadow for elevated/floating states.

**The Flat-By-Default Rule.** Cards at rest are flat. Shadow appears as a response to state (hover, drag, elevation), never as decoration.

## 5. Components

### Buttons
- **Shape:** Pill (9999px) for primary CTAs; medium radius (10px, `--r-md`) for inline secondary actions.
- **Primary:** `background: #d08a59; color: #fff; padding: 12px 24px; font-family: Sora; font-weight: 600.` Hover darkens to `#b87540` with a 1px upward transform lift.
- **Ghost / Secondary:** `background: transparent; border: 1px solid rgba(0,0,0,.14); color: #5a5652; padding: 11px 24px; border-radius: 9999px.` Hover adds `background: #e8eaed`.
- **Disabled:** `opacity: 0.5; cursor: not-allowed;` — not a separate color; opacity signal only.

### Cards / Containers
- **Corner Style:** Large radius (`--r-lg: 16px`) for standalone cards; medium (`--r-md: 10px`) for nested elements.
- **Background:** Surface white (`#ffffff`) on the page shell (`#f2f3f5`).
- **Shadow Strategy:** None at rest (see Elevation). Border only: `1px solid rgba(0,0,0,.08)`.
- **Internal Padding:** `20px` standard; `14px` on mobile.

### Inputs / Fields
- **Style:** `background: #e8eaed; border: 1px solid rgba(0,0,0,.14); border-radius: 10px; padding: 11px 14px; color: #161412`.
- **Focus:** Border stays, adds `box-shadow: 0 0 0 3px rgba(208,138,89,.15)` — accent-tinted glow, not indigo.
- **Error:** Background stays; border shifts to `rgba(244,128,128,.5)` with error message below.
- **Font size 16px minimum on mobile** — prevents iOS auto-zoom.

### Navigation (app shell sidebar)
- **Sidebar:** `background: #ffffff; border-right: 1px solid rgba(0,0,0,.08); width: 240px`.
- **Nav items:** DM Sans 14px; default `color: #5a5652`; active: `color: #161412; background: #f2f3f5; border-radius: 10px`.
- **Active animation:** `verdictIn` — translateX(-8px) → 0 with scale .97 → 1, 300ms spring.
- **Mobile:** Slides in as full overlay from left, dimmed backdrop, 280px wide.

### Tab Switcher
- **Tray:** `background: #e8eaed; border-radius: 12px; padding: 4px`.
- **Active tab:** `background: #d08a59; color: #fff; border-radius: 9px; box-shadow: 0 2px 8px rgba(208,138,89,.3)`.
- **Inactive tab:** `color: #5a5652; background: transparent`.

### Logo Mark
- **Container:** 36×36px, `border-radius: 10px`, `background: #d08a59`.
- **Icon:** Three vertical bars (analytics bars) in white, with an ascending arrow on the tallest bar. Never in any other color.

## 6. Do's and Don'ts

### Do:
- **Do** use `#d08a59` as the single brand accent on all CTAs, active states, and the logo mark.
- **Do** keep the background `#f2f3f5` — cool, not warm. The amber reads stronger against a cool field.
- **Do** use Sora exclusively for headlines and the wordmark; DM Sans everywhere else.
- **Do** use tonal layering (shell → surface) as the primary depth cue; add a border on resting cards, a shadow only on floating elements.
- **Do** use the spring easing (`cubic-bezier(.16,1,.3,1)`) for state transitions. It reads decisive, not bouncy.
- **Do** use `font-size: 16px` minimum on mobile inputs to prevent iOS zoom.
- **Do** reserve `#6366f1` (indigo) for the AI / Ask conversational feature only.
- **Do** test all text against WCAG AA (≥ 4.5:1). `#5a5652` on `#ffffff` passes at 5.1:1; `#706b65` on `#ffffff` passes at 4.6:1.
- **Do** provide a `:focus-visible` ring — `2px solid #d08a59; outline-offset: 2px` — on all interactive elements.

### Don't:
- **Don't** use the warm-cream background band (`#f9f7f2`, `#faf8f4`, etc.) as a page shell. This is the 2026 AI monoculture tell. AskBiz has a cool shell on purpose.
- **Don't** use a border AND a shadow on the same card. Pick one. The ghost-card pattern is prohibited.
- **Don't** exceed `border-radius: 16px` on cards. Over-rounding (20px+) reads as generic SaaS, not precise analytics.
- **Don't** use indigo (`#6366f1`) on primary buttons, tab switchers, or navigation. It belongs to the AI surface only.
- **Don't** use gradient text (`background-clip: text`). Use a single solid color. Emphasis is weight and size, not shimmer.
- **Don't** put a side-stripe border (`border-left: 3px solid #d08a59`) on list items or cards. Use a background tint, a leading icon, or nothing.
- **Don't** use `border-radius` values from the sequence 24/28/32/40px on cards. They read as the codex over-rounding tell.
- **Don't** place gray text (`--tx3`) on the amber accent background — it looks washed out. Use white or near-white.
- **Don't** use navy-blue-white enterprise SaaS color schemes. That is the anti-reference (Salesforce/HubSpot energy — prohibited).
- **Don't** use bouncy/elastic easing (`cubic-bezier(.34,1.56,.64,1)` except on micro-interactions like logo pop-in). Main UI transitions use spring (`--ease`) or decel (`--ease-out`) only.
