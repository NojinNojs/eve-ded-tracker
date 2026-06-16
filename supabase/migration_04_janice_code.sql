-- ══════════════════════════════════════════════════════════
--  EVE DED Tracker – Supabase Migration 04
--  Add janice_code column for appraisal links
-- ══════════════════════════════════════════════════════════

ALTER TABLE public.ded_runs ADD COLUMN IF NOT EXISTS janice_code TEXT DEFAULT NULL;
