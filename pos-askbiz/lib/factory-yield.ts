/**
 * Per-factory-type yield evaluation.
 *
 * Both the factory Hub's "Efficiency" KPI (app/factory/page.tsx) and the
 * Production log's per-product yield summary (app/factory/production/page.tsx)
 * used to color output/intake purely on a flat 90%/70% threshold, regardless
 * of what was actually being produced. That's fine for something like
 * poultry dressing (~70-81% is normal, close to the flat thresholds anyway)
 * but actively wrong for a naturally low-yield process — sesame oil
 * pressing sits at roughly 33-63%, typically ~36% unroasted, and every one
 * of those numbers would show red/bad under the old flat check even though
 * they're completely normal. The 12 factory-type templates in
 * lib/factory-templates already carry real, sourced per-product yield
 * ranges; this file is what actually reads them.
 *
 * Deliberately reads the static template data directly rather than
 * consulting pos_factory_recipes (the DB table meant for user-editable
 * custom recipes) — nothing writes to that table today, and at least one
 * template's suggested range (soap, up to 110%) would violate that table's
 * own yield_max_pct <= 100 CHECK constraint if it were ever seeded from
 * these templates verbatim. No migration or write path needed for this fix.
 */

import { getFactoryTypeTemplate } from './factory-templates'

export type YieldStatus = 'good' | 'warn' | 'bad' | 'neutral'

export interface YieldEvaluation {
  status: YieldStatus
  // The range actually used to score this pct — from a matched recipe when
  // one exists, otherwise the generic fallback band. Either bound may be
  // null (no floor / no ceiling).
  min: number | null
  max: number | null
  expected: number | null
  matchedRecipe: boolean
  productLabel: string | null
}

const GENERIC_GOOD = 90
const GENERIC_WARN = 70

/**
 * Score an actual yield percentage (output ÷ intake, as a 0-100 number)
 * against either the matching suggestedRecipes row for this owner's
 * factory_type + product name, or a generic flat 90%/70% fallback.
 */
export function evaluateYield(
  pct: number | null,
  productName: string | null,
  factoryType: string | null | undefined
): YieldEvaluation {
  if (pct == null) {
    return { status: 'neutral', min: null, max: null, expected: null, matchedRecipe: false, productLabel: null }
  }

  const template = getFactoryTypeTemplate(factoryType)
  const recipe = template && productName
    ? template.suggestedRecipes.find(r => r.output_product_name.toLowerCase() === productName.toLowerCase().trim())
    : null

  if (recipe) {
    const min = recipe.yield_min_pct ?? null
    const max = recipe.yield_max_pct ?? null
    // Real batches vary around the documented range rather than snapping to
    // it exactly, so "moderately outside" reads as a caution (amber), and
    // only a wider miss reads as a real problem (red) — a range recipe is
    // more forgiving than a single target number by design.
    let status: YieldStatus = 'good'
    if (min != null && pct < min * 0.85) status = 'bad'
    else if (min != null && pct < min) status = 'warn'
    else if (max != null && pct > max * 1.15) status = 'bad'
    else if (max != null && pct > max) status = 'warn'
    return { status, min, max, expected: recipe.expected_yield_pct, matchedRecipe: true, productLabel: recipe.output_product_name }
  }

  // No factory_type set, factory_type is 'other', or this product doesn't
  // match any of that type's suggested recipes — fall back to exactly the
  // behaviour both screens had before this.
  const status: YieldStatus = pct >= GENERIC_GOOD ? 'good' : pct >= GENERIC_WARN ? 'warn' : 'bad'
  return { status, min: GENERIC_WARN, max: null, expected: null, matchedRecipe: false, productLabel: null }
}

export const YIELD_STATUS_COLOR: Record<YieldStatus, string> = {
  good:    '#22c55e',
  warn:    '#f59e0b',
  bad:     '#ef4444',
  neutral: '#94a3b8',
}
