/* ──────────────────────────────────────────────────────────
 *  Server Action: DED Run CRUD operations
 * ────────────────────────────────────────────────────────── */
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { DedRun, DedRunInsert, DashboardStats } from '@/lib/types';
import { DED_TYPES, FACTIONS } from '@/lib/types';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Get the authenticated character_id from the current session.
 * Returns null if the user is not logged in.
 */
async function getCharacterId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Insert a new DED run record. Enforces auth on the server.
 */

export async function submitDedRun(data: DedRunInsert): Promise<ActionResult> {
  const characterId = await getCharacterId();
  if (!characterId) {
    return { success: false, error: 'You must be logged in to submit a run.' };
  }

  // Security Validation
  const validDedTypes = DED_TYPES.map(d => d.value);
  const validFactions = FACTIONS.map(f => f.value);
  if (!validDedTypes.includes(data.ded_type)) return { success: false, error: 'Invalid DED Type.' };
  if (!validFactions.includes(data.faction)) return { success: false, error: 'Invalid Faction.' };
  if (data.capital_cost < 0 || data.capital_cost > 1e15) return { success: false, error: 'Invalid capital cost.' };
  if (data.loot_value < 0 || data.loot_value > 1e15) return { success: false, error: 'Invalid loot value.' };

  const validModes = ['buy', 'sell', 'split'];
  if (!validModes.includes(data.pricing_mode)) return { success: false, error: 'Invalid pricing mode.' };
  if (typeof data.pricing_percent !== 'number' || data.pricing_percent < 0 || data.pricing_percent > 200) {
    return { success: false, error: 'Invalid pricing percent.' };
  }

  const netProfit = data.loot_value - data.capital_cost;

  // Sanitize janice_code — alphanumeric only
  const rawJaniceCode = data.janice_code ?? null;
  const safeJaniceCode = rawJaniceCode && /^[a-zA-Z0-9]+$/.test(rawJaniceCode) ? rawJaniceCode : null;

  const supabase = await createClient();
  const { error } = await supabase.from('ded_runs').insert({
    character_id: characterId,
    ded_type: data.ded_type,
    faction: data.faction,
    is_purchased: data.is_purchased,
    capital_cost: data.capital_cost,
    loot_value: data.loot_value,
    net_profit: netProfit,
    pricing_mode: data.pricing_mode,
    pricing_percent: data.pricing_percent,
    janice_code: safeJaniceCode,
  });

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
 * Compute aggregated dashboard statistics from the user's runs.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const characterId = await getCharacterId();
  if (!characterId) {
    return { totalProfit: 0, totalRuns: 0, mostProfitable: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ded_runs')
    .select('faction, ded_type, net_profit')
    .eq('character_id', characterId);

  if (error || !data) {
    if (error) console.error('fetchDashboardStats error:', error.message);
    return { totalProfit: 0, totalRuns: 0, mostProfitable: null };
  }

  const totalRuns = data.length;
  const totalProfit = data.reduce((sum, run) => sum + Number(run.net_profit), 0);

  const group = data.reduce((acc, run) => {
    const key = `${run.faction}|${run.ded_type}`;
    if (!acc[key]) acc[key] = { faction: run.faction as any, dedType: run.ded_type as any, profit: 0 };
    acc[key].profit += Number(run.net_profit);
    return acc;
  }, {} as Record<string, { faction: import('@/lib/types').Faction; dedType: import('@/lib/types').DedType; profit: number }>);

  let mostProfitable = null;
  for (const key in group) {
    if (!mostProfitable || group[key].profit > mostProfitable.profit) {
      mostProfitable = group[key];
    }
  }

  return { totalRuns, totalProfit, mostProfitable };
}

/**
 * Delete a specific DED run. Verifies ownership via character_id.
 */
export async function deleteDedRun(runId: string): Promise<ActionResult> {
  const characterId = await getCharacterId();
  if (!characterId) {
    return { success: false, error: 'Not authenticated.' };
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
