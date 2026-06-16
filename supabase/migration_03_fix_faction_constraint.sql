-- ══════════════════════════════════════════════════════════
--  EVE DED Tracker – Supabase Migration 03
--  Fixing Constraint Check Sync Issue
-- ══════════════════════════════════════════════════════════

-- Hapus konstrain tipe DED jika ada ketidakcocokan
ALTER TABLE public.ded_runs DROP CONSTRAINT IF EXISTS ded_runs_ded_type_check;

-- Hapus konstrain faction jika ada ketidakcocokan
ALTER TABLE public.ded_runs DROP CONSTRAINT IF EXISTS ded_runs_faction_check;

-- Tambahkan kembali konstrain dengan nilai yang SANGAT PRESISI sesuai codebase
ALTER TABLE public.ded_runs 
  ADD CONSTRAINT ded_runs_ded_type_check 
  CHECK (ded_type IN ('5/10','6/10','7/10','8/10','9/10','10/10'));

ALTER TABLE public.ded_runs 
  ADD CONSTRAINT ded_runs_faction_check 
  CHECK (faction IN ('Guristas','Sansha','Blood Raiders','Angel Cartel','Serpentis'));
