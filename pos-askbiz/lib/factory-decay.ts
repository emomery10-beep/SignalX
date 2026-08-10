/**
 * Per-factory-type shelf-life decay matching — the mirror image of
 * lib/factory-holds.ts. A hold is "not sellable until N days/a clearance
 * passes"; a decay rule is "not sellable AFTER N hours pass" — bakery's
 * own sourceNote: "Unsold bakery stock typically ages out within about 24
 * hours... plan alerts and markdowns around a same-day sell-through
 * window." Currently only bakery sets a decayRule; built generic (reads
 * suggestedRecipes the same way matchHoldRule does) so any future
 * short-shelf-life factory type needs no code change to use it.
 */

import { getFactoryTypeTemplate } from './factory-templates'
import type { FactoryDecayRule } from './factory-templates'

export interface MatchedDecay {
  rule: FactoryDecayRule
  productLabel: string
}

// Same exact-match-first, then loose-substring-fallback strategy as
// lib/factory-holds.ts's matchHoldRule, for the same collision-avoidance
// reason — see that file's comment for the full explanation.
function exactProductMatch(a: string, b: string): boolean {
  return a.toLowerCase().trim() === b.toLowerCase().trim()
}

function fuzzyProductMatch(a: string, b: string): boolean {
  const x = a.toLowerCase().trim()
  const y = b.toLowerCase().trim()
  if (!x || !y) return false
  return x.includes(y) || y.includes(x)
}

export function matchDecayRule(
  productName: string | null | undefined,
  factoryType: string | null | undefined
): MatchedDecay | null {
  if (!productName) return null
  const template = getFactoryTypeTemplate(factoryType)
  if (!template) return null

  const exact = template.suggestedRecipes.find(r => exactProductMatch(productName, r.output_product_name))
  if (exact) return exact.decayRule ? { rule: exact.decayRule, productLabel: exact.output_product_name } : null

  for (const recipe of template.suggestedRecipes) {
    if (recipe.decayRule && fuzzyProductMatch(productName, recipe.output_product_name)) {
      return { rule: recipe.decayRule, productLabel: recipe.output_product_name }
    }
  }
  return null
}
