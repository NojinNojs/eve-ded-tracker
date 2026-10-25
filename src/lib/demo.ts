/* ──────────────────────────────────────────────────────────
 *  Sample dataset for the landing page.
 *
 *  Real run shapes, real arithmetic — the demo goes through the
 *  same computeInsights() path as the signed-in dashboard, so the
 *  numbers a visitor sees are the numbers the product produces.
 * ────────────────────────────────────────────────────────── */

import type { DedRun, DedType, Faction } from '@/lib/types';

const DAY = 86_400_000;

type Seed = [DedType, Faction, boolean, number, number, number];

const SEEDS: Seed[] = [
  ['10/10', 'Guristas', true, 180_000_000, 2_340_000_000, 26],
  ['10/10', 'Guristas', false, 0, 48_900_000, 24],
  ['8/10', 'Sansha', true, 120_000_000, 890_000_000, 21],
  ['6/10', 'Angel Cartel', false, 0, 340_000_000, 19],
  ['10/10', 'Blood Raiders', true, 200_000_000, 1_780_000_000, 17],
  ['9/10', 'Serpentis', true, 240_000_000, 156_000_000, 15],
  ['7/10', 'Sansha', false, 0, 512_000_000, 13],
  ['5/10', 'Guristas', false, 0, 74_000_000, 11],
  ['10/10', 'Sansha', true, 210_000_000, 1_420_000_000, 9],
  ['8/10', 'Blood Raiders', true, 95_000_000, 610_000_000, 7],
  ['9/10', 'Angel Cartel', true, 300_000_000, 268_000_000, 5],
  ['6/10', 'Guristas', false, 0, 121_000_000, 3],
];

/** Newest first, so the demo table reads like the real ledger. */
export function buildDemoRuns(now: number = Date.now()): DedRun[] {
  return SEEDS.map(([dedType, faction, purchased, capital, loot, daysAgo], index) => ({
    id: `demo-${index}`,
    character_id: 'demo',
    ded_type: dedType,
    faction,
    is_purchased: purchased,
    capital_cost: capital,
    loot_value: loot,
    net_profit: loot - capital,
    pricing_mode: 'split' as const,
    pricing_percent: 100,
    janice_code: index % 4 === 0 ? 'demo' : null,
    created_at: new Date(now - daysAgo * DAY).toISOString(),
  }));
}

export const DEMO_RUNS = buildDemoRuns();
