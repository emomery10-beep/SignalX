-- Each oil crop is its own factory type (pressing method, moisture and yield differ).
-- Widens the allowed profiles.factory_type ids; existing 'sesame_oil' rows are untouched.
alter table public.profiles drop constraint if exists profiles_factory_type_check;
alter table public.profiles add constraint profiles_factory_type_check
  check (factory_type is null or factory_type in (
    'sesame_oil', 'groundnut_oil', 'sunflower_oil', 'palm_oil', 'coconut_oil',
    'water', 'maize_milling', 'cassava', 'rice_milling', 'dairy', 'bakery', 'soap',
    'concrete_blocks', 'poultry', 'coffee', 'fish_smoking', 'other'
  ));
