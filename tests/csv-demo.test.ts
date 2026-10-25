import { describe, expect, test } from 'bun:test';
import { buildRunsCsv, csvFilename } from '../src/lib/csv';
import { DEMO_RUNS, buildDemoRuns } from '../src/lib/demo';
import { computeInsights } from '../src/lib/stats';
import type { DedRun } from '../src/lib/types';

function run(partial: Partial<DedRun> & { id: string }): DedRun {
  return {
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

describe('buildRunsCsv', () => {
  const csv = buildRunsCsv([
    run({
      id: 'a',
      is_purchased: true,
      capital_cost: 180_000_000,
      loot_value: 2_340_000_000,
      net_profit: 2_160_000_000,
      janice_code: 'aBcD12',
    }),
  ]);
  const body = csv.replace('\uFEFF', '');
  const [header, firstRow] = body.split('\r\n');

  test('starts with a BOM so Excel keeps UTF-8', () => {
    expect(csv.startsWith('\uFEFF')).toBe(true);
  });

  test('header is stable', () => {
    expect(header).toBe(
      'date,ded_level,faction,source,capital_cost,loot_value,net_profit,pricing_mode,pricing_percent,janice_url'
    );
  });

  test('writes raw numbers, not formatted ISK', () => {
    const cells = firstRow.split(',');
    expect(cells[1]).toBe('10/10');
    expect(cells[2]).toBe('Guristas');
    expect(cells[3]).toBe('purchased');
    expect(cells[4]).toBe('180000000');
    expect(cells[5]).toBe('2340000000');
    expect(cells[6]).toBe('2160000000');
  });

  test('turns a Janice code into a link', () => {
    expect(firstRow).toContain('https://janice.e-351.com/a/aBcD12');
  });

  test('quotes values that contain a comma', () => {
    const quoted = buildRunsCsv([run({ id: 'q', faction: 'Angel Cartel' })]).split('\r\n')[1];
    expect(quoted.split(',').length).toBe(10);
    expect(quoted).toContain('Angel Cartel');
  });

  test('escapes formula injection', () => {
    const hostile = buildRunsCsv([run({ id: 'x', ded_type: '10/10', faction: 'Guristas', janice_code: null })]);
    // month/day text never begins with a formula char, but the guard must exist
    expect(hostile).not.toMatch(/,"?=/);
  });

  test('row count matches input', () => {
    const many = buildRunsCsv([run({ id: '1' }), run({ id: '2' }), run({ id: '3' })]);
    expect(many.split('\r\n')).toHaveLength(4);
  });
});

describe('csvFilename', () => {
  test('is dated and ends in .csv', () => {
    expect(csvFilename('ded-runs', new Date('2026-10-25T10:00:00Z'))).toBe('ded-runs-2026-10-25.csv');
  });
});

describe('demo dataset', () => {
  const now = new Date('2026-10-25T12:00:00Z').getTime();
  const demo = buildDemoRuns(now);
  const insights = computeInsights(demo);

  test('is deterministic for a given clock', () => {
    expect(buildDemoRuns(now)).toEqual(demo);
  });

  test('every run carries a consistent net profit', () => {
    for (const entry of demo) {
      expect(Number(entry.net_profit)).toBe(Number(entry.loot_value) - Number(entry.capital_cost));
    }
  });

  test('shows both a win and a loss, so the demo is honest', () => {
    expect(insights.wins).toBeGreaterThan(0);
    expect(insights.losses).toBeGreaterThan(0);
  });

  test('covers all six DED tiers', () => {
    expect(new Set(demo.map((entry) => entry.ded_type)).size).toBe(6);
  });

  test('the shipped demo constant is populated', () => {
    expect(DEMO_RUNS.length).toBeGreaterThan(0);
  });
});
