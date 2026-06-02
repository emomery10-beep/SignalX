-- ============================================================
-- Factory captures storage bucket
-- Migration 040 created the pos_factory_captures table but left
-- the storage bucket as a manual dashboard step (commented out).
-- This makes the bucket reproducible so photo uploads don't fall
-- back to inline base64 data URLs.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('factory-captures', 'factory-captures', false)
ON CONFLICT (id) DO NOTHING;
