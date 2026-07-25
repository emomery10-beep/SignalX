-- ============================================================
-- Widen connected_sources.source_type to include connectors whose OAuth
-- callbacks have been inserting/upserting these values for a while, but
-- which were never added to this whitelist. Since the check constraint
-- rejected them, and every one of these callback routes discards the
-- Supabase insert/upsert error without checking it, the connect flow has
-- likely been silently failing to save the connection at all for each of
-- these — the user is redirected to a "connected" URL regardless.
--
-- Also adds 'klaviyo' and 'meta_ads' ahead of their handlers landing, since
-- widening this constraint is a single safe, additive change either way.
-- ============================================================

alter table public.connected_sources
  drop constraint if exists connected_sources_source_type_check;

alter table public.connected_sources
  add constraint connected_sources_source_type_check
  check (source_type in (
    'shopify','square','stripe','quickbooks','google_sheets',
    'amazon_fba','woocommerce','jumia','takealot','manual_csv',
    'ebay','etsy','tiktok_shop','instagram','pinterest',
    'askbiz_pos','walmart',
    'xero','freeagent','gocardless','google_ads','google_analytics',
    'linnworks','mailchimp','meta_ads','klaviyo'
  ));
