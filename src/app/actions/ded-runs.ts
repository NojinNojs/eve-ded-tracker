/* ──────────────────────────────────────────────────────────
 *  Server Action: DED Run CRUD operations
 * ────────────────────────────────────────────────────────── */
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { DedRun, DedRunInsert } from '@/lib/types';
import { DED_TYPES, FACTIONS, PRICING_MODES } from '@/lib/types';

interface ActionResult {
  success: boolean;
  error?: string;
}

const VALID_DED_TYPES = new Set(DED_TYPES.map((d) => d.value));
const VALID_FACTIONS = new Set(FACTIONS.map((f) => f.value));
const VALID_MODES = new Set(PRICING_MODES.map((m) => m.value));

/** UUID v1–v5 shape check — stops malformed ids reaching Postgres. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_ISK = 1e15; // 1 quadrillion — far beyond any real run, still a float-safe guard

/**
 * Get the authenticated character_id from the current session.
 * Returns null if the user is not logged in.
 */
async function getCharacterId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Shared payload validation for insert and update. */
function validate(payload: DedRunInsert): string | null {
  if (!VALID_DED_TYPES.has(payload.ded_type)) return 'Invalid DED type.';
  if (!VALID_FACTIONS.has(payload.faction)) return 'Invalid faction.';
  if (!VALID_MODES.has(payload.pricing_mode)) return 'Invalid pricing mode.';

  const capital = Number(payload.capital_cost);
  const loot = Number(payload.loot_value);
  if (!Number.isFinite(capital) || capital < 0 || capital > MAX_ISK) return 'Invalid capital cost.';
  if (!Number.isFinite(loot) || loot < 0 || loot > MAX_ISK) return 'Invalid loot value.';

  const percent = payload.pricing_percent;
  if (typeof percent !== 'number' || !Number.isFinite(percent) || percent < 0 || percent > 200) {
    return 'Invalid pricing percent.';
  }

  return null;
}

/** Janice codes are alphanumeric only — anything else becomes null. */
function sanitizeJaniceCode(code: string | null | undefined): string | null {
  if (!code) return null;
  return /^[a-zA-Z0-9]{1,32}$/.test(code) ? code : null;
}

/**
 * Insert a new DED run record. Enforces auth on the server.
 */
export async function submitDedRun(data: DedRunInsert): Promise<ActionResult> {
  const characterId = await getCharacterId();
  if (!characterId) {
    return { success: false, error: 'You must be logged in to submit a run.' };
  }

  const invalid = validate(data);
  if (invalid) return { success: false, error: invalid };

  const capitalCost = Math.round(Number(data.capital_cost));
  const lootValue = Math.round(Number(data.loot_value));

  const supabase = await createClient();
  const { error } = await supabase.from('ded_runs').insert({
    character_id: characterId,
    ded_type: data.ded_type,
    faction: data.faction,
    is_purchased: Boolean(data.is_purchased),
    capital_cost: capitalCost,
    loot_value: lootValue,
    net_profit: lootValue - capitalCost,
    pricing_mode: data.pricing_mode,
    pricing_percent: Math.round(data.pricing_percent),
    janice_code: sanitizeJaniceCode(data.janice_code),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

/**
 * Update an existing run. Ownership is enforced twice: the query filters on
 * character_id, and Row Level Security does it again in Postgres.
 */
export async function updateDedRun(runId: string, data: DedRunInsert): Promise<ActionResult> {
  const characterId = await getCharacterId();
  if (!characterId) {
    return { success: false, error: 'You must be logged in to edit a run.' };
  }
  if (!UUID_RE.test(runId)) {
    return { success: false, error: 'Invalid run id.' };
  }

  const invalid = validate(data);
  if (invalid) return { success: false, error: invalid };

  const capitalCost = Math.round(Number(data.capital_cost));
  const lootValue = Math.round(Number(data.loot_value));

  const supabase = await createClient();
  const { error } = await supabase
    .from('ded_runs')
    .update({
      ded_type: data.ded_type,
      faction: data.faction,
      is_purchased: Boolean(data.is_purchased),
      capital_cost: capitalCost,
      loot_value: lootValue,
      net_profit: lootValue - capitalCost,
      pricing_mode: data.pricing_mode,
      pricing_percent: Math.round(data.pricing_percent),
      janice_code: sanitizeJaniceCode(data.janice_code),
    })
    .eq('id', runId)
    .eq('character_id', characterId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

/**
 * Fetch all DED runs for the currently authenticated user,
 * ordered by most recent first.
 */
export async function fetchDedRuns(): Promise<DedRun[]> {
  const characterId = await getCharacterId();
  if (!characterId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ded_runs')
    .select('*')
    .eq('character_id', characterId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchDedRuns error:', error.message);
    return [];
  }

  return (data ?? []) as DedRun[];
}

/**
 * Delete a specific DED run. Verifies ownership via character_id.
 */
export async function deleteDedRun(runId: string): Promise<ActionResult> {
  const characterId = await getCharacterId();
  if (!characterId) {
    return { success: false, error: 'Not authenticated.' };
  }
  if (!UUID_RE.test(runId)) {
    return { success: false, error: 'Invalid run id.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('ded_runs')
    .delete()
    .eq('id', runId)
    .eq('character_id', characterId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
