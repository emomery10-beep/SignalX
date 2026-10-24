-- Four count-based workshop types join the factory-type list. Only the CHECK on profiles.factory_type needs
-- widening (pos_locations.factory_type has no constraint). Additive: every existing value stays valid.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_factory_type_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_factory_type_check
  CHECK (factory_type IS NULL OR factory_type IN (
    'sesame_oil', 'groundnut_oil', 'sunflower_oil', 'palm_oil', 'coconut_oil', 'water', 'maize_milling', 'cassava',
    'rice_milling', 'dairy', 'bakery', 'soap', 'concrete_blocks', 'poultry', 'coffee', 'fish_smoking',
    'carpentry_furniture', 'metal_fabrication', 'garments_tailoring', 'ice_making', 'other'
  ));
