-- Migration 009: Add amazon_fba to connected_sources source_type
ALTER TABLE public.connected_sources
  DROP CONSTRAINT IF EXISTS connected_sources_source_type_check;

ALTER TABLE public.connected_sources
  ADD CONSTRAINT connected_sources_source_type_check
  CHECK (source_type IN (
    'shopify','square','stripe','quickbooks','google_sheets',
    'amazon_fba','woocommerce','jumia','takealot','manual_csv'
  ));
