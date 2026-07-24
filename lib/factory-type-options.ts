/**
 * Factory Type Options
 *
 * Small, self-contained id/label/icon list for the factory-type picker UI
 * (onboarding step + admin settings), used to populate profiles.factory_type
 * (see pos-askbiz/supabase/migrations/20260724000009_profiles_factory_type.sql
 * for the exact CHECK constraint these ids must match).
 *
 * This is a root-app-only mirror of pos-askbiz/lib/factory-templates/ —
 * the root app (this repo) and pos-askbiz/ are separate Next.js apps/
 * deployments (see the "Vercel monorepo deploy scoping" note in this
 * codebase), so nothing in pos-askbiz/lib/ is importable here at runtime.
 * pos-askbiz's per-type template files carry the rich stage guidance and
 * suggested-recipe yield data used inside the POS app itself; this file
 * only carries the id/label/icon a picker needs, copied by value and kept
 * in the same order as pos-askbiz/lib/factory-templates/index.ts.
 *
 * If pos-askbiz's factory-templates ever change label/icon/order, update
 * this file to match by hand — there is no shared import to keep them in
 * sync automatically.
 */

export interface FactoryTypeOption {
  id: string
  label: string
  icon: string
}

// Order matches pos-askbiz/lib/factory-templates/index.ts (sesame oil and
// water first, as the two real businesses this was researched against) —
// preserve this order rather than re-sorting alphabetically.
export const FACTORY_TYPE_OPTIONS: FactoryTypeOption[] = [
  {
    id: 'sesame_oil',
    label: 'Cooking Oil Pressing (Sesame / Groundnut / Sunflower / Palm)',
    icon: '🫒',
  },
  {
    id: 'water',
    label: 'Packaged Drinking Water (Sachet / Bottled)',
    icon: '💧',
  },
  {
    id: 'maize_milling',
    label: 'Maize Milling (Posho/Flour Mill)',
    icon: '🌽',
  },
  {
    id: 'cassava',
    label: 'Cassava Processing (Garri / Fufu / Starch)',
    icon: '🥔',
  },
  {
    id: 'rice_milling',
    label: 'Rice Milling / Parboiling',
    icon: '🌾',
  },
  {
    id: 'dairy',
    label: 'Dairy Processing (Yoghurt / Cheese / Ghee)',
    icon: '🥛',
  },
  {
    id: 'bakery',
    label: 'Bakery / Bread Production',
    icon: '🍞',
  },
  {
    id: 'soap',
    label: 'Soap / Detergent Making',
    icon: '🧼',
  },
  {
    id: 'concrete_blocks',
    label: 'Concrete Block / Brick Making',
    icon: '🧱',
  },
  {
    id: 'poultry',
    label: 'Poultry Processing / Abattoir',
    icon: '🐔',
  },
  {
    id: 'coffee',
    label: 'Coffee Processing (Wet/Washed)',
    icon: '☕',
  },
  {
    id: 'fish_smoking',
    label: 'Fish Smoking / Processing',
    icon: '🐟',
  },
]

// 'other' has no dedicated option above — picking this gets the generic
// factory flow with no stage guidance or suggested recipes. Kept in sync
// by hand with the CHECK constraint in
// pos-askbiz/supabase/migrations/20260724000009_profiles_factory_type.sql.
export const FACTORY_TYPE_OTHER = 'other'
