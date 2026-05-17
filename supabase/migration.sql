-- ══════════════════════════════════════════════════════════
--  EVE DED Tracker – Supabase Migration
--  Table: ded_runs
--
--  Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor)
-- ══════════════════════════════════════════════════════════

-- Enable uuid extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the ded_runs table
CREATE TABLE IF NOT EXISTS public.ded_runs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  character_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ded_type      TEXT NOT NULL CHECK (ded_type IN ('5/10','6/10','7/10','8/10','9/10','10/10')),
  faction       TEXT NOT NULL CHECK (faction IN ('Guristas','Sansha','Blood Raiders','Angel Cartel','Serpentis')),
  is_purchased  BOOLEAN NOT NULL DEFAULT false,
  capital_cost  NUMERIC NOT NULL DEFAULT 0,
  loot_value    NUMERIC NOT NULL DEFAULT 0,
  net_profit    NUMERIC NOT NULL DEFAULT 0,
  pricing_mode  TEXT NOT NULL DEFAULT 'buy' CHECK (pricing_mode IN ('buy','sell','split')),
  pricing_percent INTEGER NOT NULL DEFAULT 95 CHECK (pricing_percent >= 0 AND pricing_percent <= 200),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for per-user queries
CREATE INDEX IF NOT EXISTS idx_ded_runs_character
  ON public.ded_runs(character_id, created_at DESC);

-- ── Row Level Security ────────────────────────────────────
-- Ensures each user can ONLY access their own data.

ALTER TABLE public.ded_runs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own rows
CREATE POLICY "Users can view own runs"
  ON public.ded_runs FOR SELECT
  USING (auth.uid() = character_id);

-- Policy: Users can insert rows for themselves
CREATE POLICY "Users can insert own runs"
  ON public.ded_runs FOR INSERT
  WITH CHECK (auth.uid() = character_id);

-- Policy: Users can update their own rows
CREATE POLICY "Users can update own runs"
  ON public.ded_runs FOR UPDATE
  USING (auth.uid() = character_id)
  WITH CHECK (auth.uid() = character_id);

-- Policy: Users can delete their own rows
CREATE POLICY "Users can delete own runs"
  ON public.ded_runs FOR DELETE
  USING (auth.uid() = character_id);
