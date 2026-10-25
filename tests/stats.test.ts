import { describe, expect, test } from 'bun:test';
import { computeInsights, filterByRange, rangeStart } from '../src/lib/stats';
import type { DedRun } from '../src/lib/types';

const DAY = 86_400_000;
const NOW = new Date('2026-10-25T12:00:00.000Z').getTime();

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
    created_at: new Date(NOW - DAY).toISOString(),
    ...partial,
  } as DedRun;
}

const fixture: DedRun[] = [
  run({
    id: 'win-big',
    ded_type: '10/10',
    faction: 'Guristas',
    is_purchased: true,
    capital_cost: 180_000_000,
    loot_value: 2_340_000_000,
    net_profit: 2_160_000_000,
    created_at: new Date(NOW - 3 * DAY).toISOString(),
  }),
  run({
    id: 'loss',
    ded_type: '9/10',
    faction: 'Serpentis',
    is_purchased: true,
    capital_cost: 240_000_000,
    loot_value: 156_000_000,
    net_profit: -84_000_000,
    created_at: new Date(NOW - 2 * DAY).toISOString(),
  }),
  run({
    id: 'win-free',
    ded_type: '6/10',
    faction: 'Angel Cartel',
    loot_value: 340_000_000,
    net_profit: 340_000_000,
    created_at: new Date(NOW - DAY).toISOString(),
  }),
];

describe('computeInsights', () => {
  const insights = computeInsights(fixture);

  test('totals add up', () => {
    expect(insights.count).toBe(3);
    expect(insights.totalProfit).toBe(2_416_000_000);
    expect(insights.totalLoot).toBe(2_836_000_000);
    expect(insights.totalCapital).toBe(420_000_000);
    expect(Math.round(insights.avgProfit)).toBe(805_333_333);
  });

  test('counts wins and losses', () => {
    expect(insights.wins).toBe(2);
    expect(insights.losses).toBe(1);
    expect(insights.winRate).toBeCloseTo(66.67, 1);
  });

  test('profit factor is gross profit over gross loss', () => {
    expect(insights.profitFactor).toBeCloseTo(2_500_000_000 / 84_000_000, 4);
  });

  test('profit factor is null when nothing lost money', () => {
    const winners = fixture.filter((entry) => Number(entry.net_profit) > 0);
    expect(computeInsights(winners).profitFactor).toBeNull();
  });

  test('return on bookmarks divides by capital spent', () => {
    expect(insights.roi).toBeCloseTo((2_416_000_000 / 420_000_000) * 100, 4);
    expect(computeInsights([]).roi).toBeNull();
  });

  test('best and worst are single runs, not aggregates', () => {
    expect(insights.best?.id).toBe('win-big');
    expect(insights.worst?.id).toBe('loss');
    expect(Number(insights.best?.net_profit)).toBe(2_160_000_000);
  });

  test('splits bought from free', () => {
    expect(insights.bought.count).toBe(2);
    expect(insights.bought.capital).toBe(420_000_000);
    expect(insights.bought.profit).toBe(2_076_000_000);
    expect(insights.free.count).toBe(1);
    expect(insights.free.profit).toBe(340_000_000);
  });

  test('groups per tier, highest tier first', () => {
    expect(insights.byLevel.map((bucket) => bucket.dedType)).toEqual(['10/10', '9/10', '6/10']);
    expect(insights.byLevel[0].avgProfit).toBe(2_160_000_000);
  });

  test('groups per site, best average first', () => {
    expect(insights.byFactionLevel[0].faction).toBe('Guristas');
    expect(insights.byFactionLevel.at(-1)?.faction).toBe('Serpentis');
  });

  test('cumulative series ends at the total', () => {
    expect(insights.cumulative).toHaveLength(3);
    expect(insights.cumulative.at(-1)?.value).toBe(2_416_000_000);
    // oldest first
    expect(insights.cumulative[0].value).toBe(2_160_000_000);
  });

  test('empty input does not blow up', () => {
    const empty = computeInsights([]);
    expect(empty.best).toBeNull();
    expect(empty.worst).toBeNull();
    expect(empty.winRate).toBe(0);
    expect(empty.avgProfit).toBe(0);
    expect(empty.byLevel).toEqual([]);
    expect(empty.cumulative).toEqual([]);
  });
});

describe('time range filter', () => {
  test('all time keeps everything', () => {
    expect(filterByRange(fixture, 'all')).toHaveLength(3);
  });

  test('today keeps only runs from today', () => {
    expect(filterByRange(fixture, 'today')).toHaveLength(0);
  });

  test('one week reaches back seven days', () => {
    expect(filterByRange(fixture, '1w')).toHaveLength(3);
  });

  test('ranges return a start date, all returns null', () => {
    expect(rangeStart('all')).toBeNull();
    expect(rangeStart('today')).toBeInstanceOf(Date);
  });
});
