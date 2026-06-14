---
target: blog section
total_score: 24
p0_count: 0
p1_count: 2
timestamp: 2026-06-14T06-55-35Z
slug: app-blog-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No loading skeleton on index; post count jumps on hydration |
| 2 | Match System / Real World | 3 | Clear language; "Popular this month" uses proxy metric |
| 3 | User Control and Freedom | 3 | Good breadcrumbs/filters; no multi-select topics |
| 4 | Consistency and Standards | 2 | Inconsistent font fallbacks; duplicate Key Takeaways box |
| 5 | Error Prevention | 2 | No URL-based page state; refresh loses scroll position |
| 6 | Recognition Rather Than Recall | 3 | Topic sidebar always visible, badges label well |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts, no bookmark/save |
| 8 | Aesthetic and Minimalist Design | 2 | Badge overload on rows; too many article interstitials |
| 9 | Error Recovery | 3 | Empty state handled |
| 10 | Help and Documentation | 2 | No onboarding to topic taxonomy |
| **Total** | | **24/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: Warm cream bg is default AI neutral. Topic cards are identical-card-grid. Badge rows over-systematized. Side-stripe accent borders on intro paragraph and contextual links. Duplicate KEY TAKEAWAYS boxes.

**Deterministic scan**: 2 side-tab accent border findings (lines 575, 591 of [slug]/page.tsx).

## Priority Issues

**[P1] Badge overload on post rows**: 3-4 pill badges per row (cluster + type + difficulty + pillar) = 60-80 colorful pills per page. Fix: show only cluster badge on list rows.

**[P1] Duplicate Key Takeaways box**: Same section appears top and bottom of every article. Fix: remove bottom duplicate.

**[P2] Side-stripe accent borders**: borderLeft 3px solid on intro paragraph and contextual links. Fix: use font size/style instead of side border.

**[P2] Too many interstitial CTAs**: 10+ interstitials on a 7-min read. Fix: keep 2 max (contextual links + bottom CTA).

**[P2] Identical topic cards grid**: 9 identical cards with no visual hierarchy. Fix: feature top 3, compact-list the rest.

## Persona Red Flags

**Jordan (First-Timer)**: "7416 articles across 106 topics" is overwhelming. No "Start here" path.

**Riley (Stress Tester)**: Filter/scroll state lost on back navigation. URL doesn't encode pagination.

**Casey (Mobile User)**: 4-badge rows wrap awkwardly. Multiple full-width CTAs require excessive scrolling past non-content.

## Minor Observations

- Font fallback: `system-ui` vs `sans-serif` across pages
- "Popular this month" is misleading (uses cluster size, not popularity)
- Related articles grid can produce 4-5 narrow cards on wide screens
