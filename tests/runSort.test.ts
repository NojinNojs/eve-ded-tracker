import { describe, expect, test } from 'bun:test';
import { ariaSort, nextSortState, sortRuns } from '../src/lib/runSort';
import type { DedRun } from '../src/lib/types';

function run(id: string, partial: Partial<DedRun> = {}): DedRun {
  return {
    id,
    character_id: 'test',
    ded_type: '10/10',
    faction: 'Guristas',
    is_purchased: false,
    capital_cost: 0,
    loot_value: 0,
    net_profit: 0,
    pricing_mode: 'split',
    pricing_percent: 100,
    janice_code: null,
    created_at: '2026-10-20T10:00:00.000Z',
    ...partial,
  } as DedRun;
}

const runs: DedRun[] = [
  run('mid', { ded_type: '7/10', net_profit: 120_000_000, loot_value: 300_000_000, created_at: '2026-10-21T10:00:00.000Z' }),
  run('top', { ded_type: '10/10', net_profit: 2_160_000_000, loot_value: 2_340_000_000, created_at: '2026-10-20T10:00:00.000Z' }),
  run('loss', { ded_type: '9/10', net_profit: -84_000_000, loot_value: 156_000_000, created_at: '2026-10-22T10:00:00.000Z' }),
];

const ids = (list: DedRun[]) => list.map((entry) => entry.id);

describe('sortRuns', () => {
  test('sorts by net profit, both directions', () => {
    expect(ids(sortRuns(runs, { key: 'net_profit', dir: 'desc' }))).toEqual(['top', 'mid', 'loss']);
    expect(ids(sortRuns(runs, { key: 'net_profit', dir: 'asc' }))).toEqual(['loss', 'mid', 'top']);
  });

  test('sorts tier numerically, not as text', () => {
    // string order would put "10/10" before "7/10"
    expect(ids(sortRuns(runs, { key: 'ded_type', dir: 'asc' }))).toEqual(['mid', 'loss', 'top']);
  });

  test('sorts by date', () => {
    expect(ids(sortRuns(runs, { key: 'created_at', dir: 'desc' }))).toEqual(['loss', 'mid', 'top']);
  });

  test('never mutates the input array', () => {
    const before = ids(runs);
    sortRuns(runs, { key: 'net_profit', dir: 'desc' });
    expect(ids(runs)).toEqual(before);
  });

  test('ties fall back to newest first', () => {
    const tied = [
      run('old', { net_profit: 5, created_at: '2026-10-01T10:00:00.000Z' }),
      run('new', { net_profit: 5, created_at: '2026-10-09T10:00:00.000Z' }),
    ];
    expect(ids(sortRuns(tied, { key: 'net_profit', dir: 'desc' }))).toEqual(['new', 'old']);
  });
});

describe('sort header state', () => {
  test('clicking the active column flips direction', () => {
    expect(nextSortState({ key: 'net_profit', dir: 'desc' }, 'net_profit')).toEqual({ key: 'net_profit', dir: 'asc' });
    expect(nextSortState({ key: 'net_profit', dir: 'asc' }, 'net_profit')).toEqual({ key: 'net_profit', dir: 'desc' });
  });

  test('a new column starts descending', () => {
    expect(nextSortState({ key: 'net_profit', dir: 'asc' }, 'loot_value')).toEqual({ key: 'loot_value', dir: 'desc' });
  });

  test('aria-sort follows the header, not every column', () => {
    const state = { key: 'loot_value' as const, dir: 'asc' as const };
    expect(ariaSort(state, 'loot_value')).toBe('ascending');
    expect(ariaSort(state, 'net_profit')).toBe('none');
  });
});
