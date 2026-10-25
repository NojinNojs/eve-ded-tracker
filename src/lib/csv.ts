/* ──────────────────────────────────────────────────────────
 *  CSV export for the run ledger
 * ────────────────────────────────────────────────────────── */

import type { DedRun } from '@/lib/types';

const HEADERS = [
  'date',
  'ded_level',
  'faction',
  'source',
  'capital_cost',
  'loot_value',
  'net_profit',
  'pricing_mode',
  'pricing_percent',
  'janice_url',
] as const;

/** Excel opens a plain UTF-8 CSV as mojibake; the BOM keeps non-ASCII names intact. */
const BOM = '\uFEFF';

function cell(value: string | number): string {
  const raw = String(value);
  // Guard against spreadsheet formula injection on user-controlled text.
  const guarded = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return /[",\n\r]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

export function buildRunsCsv(runs: DedRun[]): string {
  const rows = runs.map((run) =>
    [
      new Date(run.created_at).toISOString(),
      run.ded_type,
      run.faction,
      run.is_purchased ? 'purchased' : 'free',
      Math.round(Number(run.capital_cost)),
      Math.round(Number(run.loot_value)),
      Math.round(Number(run.net_profit)),
      run.pricing_mode,
      run.pricing_percent,
      run.janice_code ? `https://janice.e-351.com/a/${run.janice_code}` : '',
    ]
      .map(cell)
      .join(',')
  );

  return `${BOM}${[HEADERS.join(','), ...rows].join('\r\n')}`;
}

/** Trigger a browser download without touching the DOM tree. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function csvFilename(prefix = 'ded-runs', date: Date = new Date()): string {
  const iso = date.toISOString().slice(0, 10);
  return `${prefix}-${iso}.csv`;
}
