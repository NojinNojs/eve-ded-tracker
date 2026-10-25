/* ──────────────────────────────────────────────────────────
 *  Pure run analytics — everything the dashboard shows is
 *  derived here so the numbers can never disagree between cards.
 * ────────────────────────────────────────────────────────── */

import type { DedRun, DedType, Faction } from '@/lib/types';

export type TimeRange = 'today' | '3d' | '1w' | '1m' | 'all';

export const RANGE_ORDER: TimeRange[] = ['today', '3d', '1w', '1m', 'all'];

/** Start of the selected window, or null for all time. */
export function rangeStart(range: TimeRange, now: Date = new Date()): Date | null {
  switch (range) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case '3d':
      return new Date(now.getTime() - 3 * 86_400_000);
    case '1w':
      return new Date(now.getTime() - 7 * 86_400_000);
    case '1m':
      return new Date(now.getTime() - 30 * 86_400_000);
    case 'all':
    default:
      return null;
  }
}

export function filterByRange(runs: DedRun[], range: TimeRange): DedRun[] {
  const start = rangeStart(range);
  if (!start) return runs;
  return runs.filter((run) => new Date(run.created_at) >= start);
}

export interface LevelBucket {
  dedType: DedType;
  profit: number;
  count: number;
  avgProfit: number;
}

export interface FactionBucket {
  faction: Faction;
  dedType: DedType;
  profit: number;
  count: number;
  avgProfit: number;
}

export interface Insights {
  count: number;
  totalProfit: number;
  totalLoot: number;
  totalCapital: number;
  avgProfit: number;
  /** Share of runs with a positive net profit, 0–100. */
  winRate: number;
  /** Raw win/loss tallies, so the UI can say "8W / 2L". */
  wins: number;
  losses: number;
  /** Gross profit ÷ gross loss. null when there is no losing run. */
  profitFactor: number | null;
  /** net profit ÷ capital spent, 0–100+. null when nothing was spent. */
  roi: number | null;
  best: DedRun | null;
  worst: DedRun | null;
  bought: { count: number; profit: number; capital: number };
  free: { count: number; profit: number };
  /** Oldest → newest cumulative net profit, one point per run. */
  cumulative: { label: string; value: number }[];
  byLevel: LevelBucket[];
  byFactionLevel: FactionBucket[];
}

export function computeInsights(runs: DedRun[]): Insights {
  const count = runs.length;
  let totalProfit = 0;
  let totalLoot = 0;
  let totalCapital = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let wins = 0;
  let losses = 0;

  let best: DedRun | null = null;
  let worst: DedRun | null = null;

  const bought = { count: 0, profit: 0, capital: 0 };
  const free = { count: 0, profit: 0 };

  const levelMap = new Map<DedType, LevelBucket>();
  const factionLevelMap = new Map<string, FactionBucket>();

  for (const run of runs) {
    const profit = Number(run.net_profit);
    const capital = Number(run.capital_cost);
    totalProfit += profit;
    totalLoot += Number(run.loot_value);
    totalCapital += capital;
    if (profit > 0) {
      grossProfit += profit;
      wins += 1;
    } else if (profit < 0) {
      grossLoss += Math.abs(profit);
      losses += 1;
    }

    if (!best || profit > Number(best.net_profit)) best = run;
    if (!worst || profit < Number(worst.net_profit)) worst = run;

    if (run.is_purchased) {
      bought.count += 1;
      bought.profit += profit;
      bought.capital += capital;
    } else {
      free.count += 1;
      free.profit += profit;
    }

    const level = levelMap.get(run.ded_type) ?? {
      dedType: run.ded_type,
      profit: 0,
      count: 0,
      avgProfit: 0,
    };
    level.profit += profit;
    level.count += 1;
    levelMap.set(run.ded_type, level);

    const key = `${run.faction}|${run.ded_type}`;
    const combo = factionLevelMap.get(key) ?? {
      faction: run.faction,
      dedType: run.ded_type,
      profit: 0,
      count: 0,
      avgProfit: 0,
    };
    combo.profit += profit;
    combo.count += 1;
    factionLevelMap.set(key, combo);
  }

  const byLevel = [...levelMap.values()]
    .map((bucket) => ({ ...bucket, avgProfit: bucket.profit / bucket.count }))
    .sort((a, b) => Number(b.dedType.split('/')[0]) - Number(a.dedType.split('/')[0]));

  const byFactionLevel = [...factionLevelMap.values()]
    .map((bucket) => ({ ...bucket, avgProfit: bucket.profit / bucket.count }))
    .sort((a, b) => b.avgProfit - a.avgProfit);

  // Cumulative PNL oldest → newest.
  const ordered = [...runs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  let running = 0;
  const cumulative = ordered.map((run) => {
    running += Number(run.net_profit);
    return { label: run.created_at, value: running };
  });

  return {
    count,
    totalProfit,
    totalLoot,
    totalCapital,
    avgProfit: count > 0 ? totalProfit / count : 0,
    winRate: count > 0 ? (wins / count) * 100 : 0,
    wins,
    losses,
    // No losing run at all: the factor is undefined (rendered as ∞ upstream).
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : null,
    roi: totalCapital > 0 ? (totalProfit / totalCapital) * 100 : null,
    best,
    worst,
    bought,
    free,
    cumulative,
    byLevel,
    byFactionLevel,
  };
}
