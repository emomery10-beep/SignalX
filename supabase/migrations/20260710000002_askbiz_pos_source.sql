-- ============================================================
-- Allow 'askbiz_pos' as a connected_sources.source_type
-- Lets the sync engine treat pos.askbiz.co (same Supabase project)
-- as a first-class data source, alongside Shopify/Square/etc.
-- ============================================================

alter table public.connected_sources
  drop constraint if exists connected_sources_source_type_check;

alter table public.connected_sources
  add constraint connected_sources_source_type_check
  check (source_type in (
    'shopify','square','stripe','quickbooks','google_sheets',
    'amazon_fba','woocommerce','jumia','takealot','manual_csv',
    'ebay','etsy','tiktok_shop','instagram','pinterest',
    'askbiz_pos'
  ));
