/* ──────────────────────────────────────────────────────────
 *  Server Action: DED Run CRUD operations
 * ────────────────────────────────────────────────────────── */
'use server';

import { createClient } from '@/lib/supabase/server';
import type { DedRun, DedRunInsert, DashboardStats, Faction, DedType } from '@/lib/types';

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

  const netProfit = data.loot_value - data.capital_cost;

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
  });

  if (error) {
    return { success: false, error: error.message };
  }

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
  const runs = await fetchDedRuns();

  const totalProfit = runs.reduce((sum, r) => sum + r.net_profit, 0);
  const totalRuns = runs.length;

  // Find the most profitable faction+dedType combo
  const comboMap = new Map<string, { faction: Faction; dedType: DedType; profit: number }>();

  for (const run of runs) {
    const key = `${run.faction}|${run.ded_type}`;
    const existing = comboMap.get(key);
    if (existing) {
      existing.profit += run.net_profit;
    } else {
      comboMap.set(key, {
        faction: run.faction,
        dedType: run.ded_type,
        profit: run.net_profit,
      });
    }
  }

  let mostProfitable: DashboardStats['mostProfitable'] = null;
  let maxProfit = -Infinity;

  for (const entry of comboMap.values()) {
    if (entry.profit > maxProfit) {
      maxProfit = entry.profit;
      mostProfitable = entry;
    }
  }

  return {
    totalProfit,
    totalRuns,
    mostProfitable: totalRuns > 0 ? mostProfitable : null,
  };
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

  return { success: true };
}
