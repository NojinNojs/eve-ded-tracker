/**
 * Logic checks for the money + ledger code paths.
 * Run: bun run scripts/logic-check.ts
 */
import { parseISKInput, formatISK, formatISKSigned, formatISKShort } from '../src/lib/format';
import { sortRuns, nextSortState, ariaSort } from '../src/lib/runSort';
import { buildRunsCsv } from '../src/lib/csv';
import { computeInsights, filterByRange } from '../src/lib/stats';
import type { DedRun } from '../src/lib/types';

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures += 1;
    console.log(`FAIL ${label}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
  } else {
    console.log(`ok   ${label} → ${JSON.stringify(actual)}`);
  }
}

/* ── ISK parsing ─────────────────────────────── */
check('parse 150m', parseISKInput('150m'), 150_000_000);
check('parse 1.5b', parseISKInput('1.5b'), 1_500_000_000);
check('parse 1,5b', parseISKInput('1,5b'), 1_500_000_000);
check('parse 250k', parseISKInput('250k'), 250_000);
check('parse dotted ID', parseISKInput('150.000.000'), 150_000_000);
check('parse comma US', parseISKInput('1,234,567'), 1_234_567);
check('parse plain', parseISKInput('890000000'), 890_000_000);
check('parse empty', parseISKInput('   '), 0);
check('parse garbage', parseISKInput('abc'), 0);
check('parse 0,13b', parseISKInput('0,13b'), 130_000_000);

/* ── Formatting ──────────────────────────────── */
check('format 1.5B', formatISK(1_500_000_000), '1.50B ISK');
check('format 150M', formatISK(150_000_000), '150.00M ISK');
check('format negative', formatISK(-84_000_000), '-84.00M ISK');
check('signed negative', formatISKSigned(-84_000_000), '-84.00M ISK');
check('signed positive', formatISKSigned(2_160_000_000), '+2.16B ISK');
check('short 3B', formatISKShort(3_000_000_000), '3B');
check('short 647M', formatISKShort(647_060_000), '647.06M');

/* ── Fixture ─────────────────────────────────── */
const DAY = 86_400_000;
function run(partial: Partial<DedRun> & { id: string }): DedRun {
  return {
    character_id: 'x',
    ded_type: '10/10',
    faction: 'Guristas',
    is_purchased: false,
    capital_cost: 0,
    loot_value: 0,
    net_profit: 0,
    pricing_mode: 'split',
    pricing_percent: 100,
    janice_code: null,
    created_at: new Date(Date.now() - DAY).toISOString(),
    ...partial,
  } as DedRun;
}

const runs: DedRun[] = [
  run({ id: 'a', ded_type: '10/10', faction: 'Guristas', is_purchased: true, capital_cost: 180_000_000, loot_value: 2_340_000_000, net_profit: 2_160_000_000, created_at: new Date(Date.now() - 2 * DAY).toISOString(), janice_code: 'abc123' }),
  run({ id: 'b', ded_type: '9/10', faction: 'Serpentis', is_purchased: true, capital_cost: 240_000_000, loot_value: 156_000_000, net_profit: -84_000_000, created_at: new Date(Date.now() - 1 * DAY).toISOString() }),
  run({ id: 'c', ded_type: '6/10', faction: 'Angel Cartel', loot_value: 340_000_000, net_profit: 340_000_000, created_at: new Date().toISOString() }),
];

/* ── Sorting ─────────────────────────────────── */
check('sort by pnl desc', sortRuns(runs, { key: 'net_profit', dir: 'desc' }).map((r) => r.id), ['a', 'c', 'b']);
check('sort by pnl asc', sortRuns(runs, { key: 'net_profit', dir: 'asc' }).map((r) => r.id), ['b', 'c', 'a']);
check('sort by ded desc', sortRuns(runs, { key: 'ded_type', dir: 'desc' }).map((r) => r.id), ['a', 'b', 'c']);
check('toggle desc→asc', nextSortState({ key: 'net_profit', dir: 'desc' }, 'net_profit'), { key: 'net_profit', dir: 'asc' });
check('new key starts desc', nextSortState({ key: 'net_profit', dir: 'desc' }, 'loot_value'), { key: 'loot_value', dir: 'desc' });
check('aria-sort active', ariaSort({ key: 'loot_value', dir: 'asc' }, 'loot_value'), 'ascending');
check('aria-sort inactive', ariaSort({ key: 'loot_value', dir: 'asc' }, 'net_profit'), 'none');

/* ── Insights ────────────────────────────────── */
const ins = computeInsights(runs);
check('insight count', ins.count, 3);
check('insight total', ins.totalProfit, 2_416_000_000);
check('insight wins/losses', [ins.wins, ins.losses], [2, 1]);
check('insight win rate', Math.round(ins.winRate), 67);
check('insight capital', ins.totalCapital, 420_000_000);
check('insight best id', ins.best?.id, 'a');
check('insight worst id', ins.worst?.id, 'b');
check('insight profit factor', Number(ins.profitFactor?.toFixed(2)), 29.76);
check('insight cumulative last', ins.cumulative.at(-1)?.value, 2_416_000_000);
check('insight bought count', ins.bought.count, 2);
check('insight free count', ins.free.count, 1);
check('insight level order', ins.byLevel.map((b) => b.dedType), ['10/10', '9/10', '6/10']);
check('insight empty', computeInsights([]).best, null);
check('insight empty factor', computeInsights([]).profitFactor, null);
check('filter all time', filterByRange(runs, 'all').length, 3);
check('filter today', filterByRange(runs, 'today').length, 1);

/* ── CSV ─────────────────────────────────────── */
const csv = buildRunsCsv([runs[0]]);
const lines = csv.replace('\uFEFF', '').split('\r\n');
check('csv header', lines[0], 'date,ded_level,faction,source,capital_cost,loot_value,net_profit,pricing_mode,pricing_percent,janice_url');
check('csv row fields', lines[1].split(',').slice(1, 7), ['10/10', 'Guristas', 'purchased', '180000000', '2340000000', '2160000000']);
check('csv janice url', lines[1].includes('https://janice.e-351.com/a/abc123'), true);
check('csv has bom', csv.startsWith('\uFEFF'), true);

const tricky = buildRunsCsv([run({ id: 'q', faction: 'Angel Cartel', net_profit: 1 })]);
check('csv keeps spaced faction unquoted', tricky.split('\r\n')[1].includes('Angel Cartel'), true);
check('csv field count per row', tricky.split('\r\n')[1].split(',').length, 10);

const injection = buildRunsCsv([run({ id: 'z', janice_code: null, faction: 'Guristas' })]);
check('csv no formula leak', injection.includes('=cmd'), false);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
