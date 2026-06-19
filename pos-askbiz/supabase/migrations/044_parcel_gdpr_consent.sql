-- ============================================================
-- AskBiz Migration 044 — Parcel intake GDPR consent
-- Records the data-subject consent captured by the counter clerk
-- at intake (lawful basis: contract performance + consent for the
-- optional WhatsApp/SMS receipt). Pairs with pos_consent_log.
-- ============================================================

ALTER TABLE public.pos_parcels
  ADD COLUMN IF NOT EXISTS sender_consent       boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS receipt_consent      boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at           timestamptz,
  ADD COLUMN IF NOT EXISTS consent_by           uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.pos_parcels.sender_consent  IS 'Sender agreed to AskBiz storing & processing this data to fulfil the shipment (GDPR Art. 6(1)(b)).';
COMMENT ON COLUMN public.pos_parcels.receipt_consent IS 'Sender agreed to receive a WhatsApp/SMS receipt & tracking updates (GDPR Art. 6(1)(a)).';
COMMENT ON COLUMN public.pos_parcels.consent_at      IS 'Timestamp the consent was captured at the counter.';
