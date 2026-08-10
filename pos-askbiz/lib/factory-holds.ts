/**
 * Per-factory-type "not yet sellable" hold matching.
 *
 * Cross-template audit found the same real pattern in 4 of the 12 factory
 * types (water/soap/concrete_blocks/dairy) — a batch that physically exists
 * as a capture but isn't actually releasable yet, either because it needs
 * a fixed wait (curing) or a manual regulatory clearance (a lab test). This
 * is what turns that pattern into an automatic pos_factory_capture_holds
 * row at capture-submission time, with zero extra taps for the 8/12
 * factory types (and every non-factory sector) that don't need it at all.
 *
 * Recipe-level, not template-level — dairy proves a template-wide flag
 * isn't precise enough (its Cheese recipe needs a hold, Ghee/butter from
 * the exact same factory type doesn't) — see lib/factory-templates/index.ts's
 * FactoryHoldRule for the shape.
 */

import { getFactoryTypeTemplate } from './factory-templates'
import type { FactoryHoldRule } from './factory-templates'

export interface MatchedHold {
  rule: FactoryHoldRule
  productLabel: string
}

/**
 * Case-insensitive, substring-tolerant match. A worker's free-text
 * product_name rarely matches a template's output_product_name exactly
 * (e.g. a packaging capture typed as "Water 500ml sachets" vs. water.ts's
 * recipe output "Treated water") — pos_factory_captures has no real
 * product-catalog FK to match on precisely (same free-text convention the
 * yield-summary and production-log already rely on), so this errs toward
 * catching the match rather than missing it.
 *
 * KNOWN LIMITATION, deliberately not solved here: pure substring matching
 * can collide when one recipe's name is contained in another's (e.g.
 * rice_milling.ts has both "Milled rice (no parboil)" and "Parboiled
 * milled rice" — a worker typing plain "Milled rice" would loosely match
 * both). matchHoldRule below tries an exact match across every recipe
 * first specifically to catch the common case (a name picked from the
 * inventory dropdown, or reused verbatim across captures) before ever
 * falling back to this looser check — but a short, ambiguous typed name
 * that exactly matches neither can still collide. Currently inert (no
 * template has two holdRule-carrying recipes with overlapping names), but
 * flagging precisely for whoever adds the next one.
 */
function fuzzyProductMatch(a: string, b: string): boolean {
  const x = a.toLowerCase().trim()
  const y = b.toLowerCase().trim()
  if (!x || !y) return false
  return x.includes(y) || y.includes(x)
}

function exactProductMatch(a: string, b: string): boolean {
  return a.toLowerCase().trim() === b.toLowerCase().trim()
}

/**
 * Look up whether a captured product should carry a hold, given the
 * owner's factory_type. Returns null for the 8/12 factory types with no
 * hold-carrying recipe, for 'other'/unset factory_type (see
 * matchManualHoldRule below for that case instead), or when no recipe's
 * output_product_name fuzzy-matches productName.
 */
export function matchHoldRule(
  productName: string | null | undefined,
  factoryType: string | null | undefined
): MatchedHold | null {
  if (!productName) return null
  const template = getFactoryTypeTemplate(factoryType)
  if (!template) return null

  // Exact match across EVERY recipe first (not just hold-carrying ones) —
  // this must run before the loose fallback below, so an exact match to a
  // hold-free recipe correctly wins over a loose partial match to a
  // different, hold-carrying recipe (see the collision note above).
  const exact = template.suggestedRecipes.find(r => exactProductMatch(productName, r.output_product_name))
  if (exact) return exact.holdRule ? { rule: exact.holdRule, productLabel: exact.output_product_name } : null

  for (const recipe of template.suggestedRecipes) {
    if (recipe.holdRule && fuzzyProductMatch(productName, recipe.output_product_name)) {
      return { rule: recipe.holdRule, productLabel: recipe.output_product_name }
    }
  }
  return null
}

/**
 * The self-service fallback for a factory type outside the 12-template
 * library (profiles.factory_type = 'other' or unset) — an owner running a
 * business this template library has never seen (leather tanning, candle
 * making, whatever comes next) can turn on a hold in Settings
 * (factory_hold_enabled/days/label) and it applies to every output/
 * packaging capture, since there's no recipe data available to be precise
 * about which specific product needs it the way the 4 known types are.
 */
export function matchManualHoldRule(
  holdEnabled: boolean | null | undefined,
  holdDays: number | null | undefined,
  holdLabel: string | null | undefined
): MatchedHold | null {
  if (!holdEnabled) return null
  return {
    rule: { label: holdLabel?.trim() || 'Hold', durationDays: holdDays ?? undefined },
    productLabel: '',
  }
}
