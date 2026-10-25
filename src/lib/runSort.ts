/* ──────────────────────────────────────────────────────────
 *  Ledger sorting, kept apart from the table so it can be reused
 *  (and reasoned about) independently.
 * ────────────────────────────────────────────────────────── */

import type { DedRun } from '@/lib/types';

export type SortKey = 'created_at' | 'ded_type' | 'net_profit' | 'loot_value';
export type SortDir = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

function value(run: DedRun, key: SortKey): number {
  switch (key) {
    case 'created_at':
      return new Date(run.created_at).getTime();
    case 'ded_type':
      return Number(run.ded_type.split('/')[0]);
    case 'loot_value':
      return Number(run.loot_value);
    case 'net_profit':
    default:
      return Number(run.net_profit);
  }
}

export function sortRuns(runs: DedRun[], { key, dir }: SortState): DedRun[] {
  const factor = dir === 'asc' ? 1 : -1;
  return [...runs].sort((a, b) => {
    const delta = value(a, key) - value(b, key);
    if (delta !== 0) return delta * factor;
    // Stable tiebreak: newest first, so equal profits do not jump around.
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

/** Clicking the active column flips direction; a new column starts descending. */
export function nextSortState(current: SortState, key: SortKey): SortState {
  if (current.key === key) {
    return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' };
  }
  return { key, dir: 'desc' };
}

export function ariaSort(state: SortState, key: SortKey): 'ascending' | 'descending' | 'none' {
  if (state.key !== key) return 'none';
  return state.dir === 'asc' ? 'ascending' : 'descending';
}
