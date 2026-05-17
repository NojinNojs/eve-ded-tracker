/* ──────────────────────────────────────────────────────────
 *  ISK Formatting Helpers
 * ────────────────────────────────────────────────────────── */

const localeFmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

/**
 * Compact ISK display (default everywhere):
 *   1,500,000,000 → "1.50B ISK"
 *   150,000,000   → "150.00M ISK"
 *   1,500,000     → "1.50M ISK"
 *   150,000       → "150.00K ISK"
 *   1,500         → "1,500 ISK"
 */
export function formatISK(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)}B ISK`;
  if (abs >= 1_000_000)     return `${sign}${(abs / 1_000_000).toFixed(2)}M ISK`;
  if (abs >= 1_000)         return `${sign}${(abs / 1_000).toFixed(2)}K ISK`;
  return `${sign}${abs.toLocaleString('en-US')} ISK`;
}

/**
 * Signed compact ISK with +/- prefix.
 */
export function formatISKSigned(value: number): string {
  const formatted = formatISK(value);
  if (value > 0) return `+${formatted}`;
  return formatted;
}

/**
 * Full dot-separated ISK (for input preview only):
 *   123456789 → "123.456.789 ISK"
 *   150000000 → "150.000.000 ISK"
 */
export function formatISKFull(value: number): string {
  return `${localeFmt.format(Math.round(value))} ISK`;
}

/**
 * Parse raw ISK input strings: "150m", "1.5b", "250000", "150.000.000"
 */
export function parseISKInput(raw: string): number {
  let cleaned = raw.trim().toLowerCase();

  // Suffix shortcuts: 150m, 1.5b, 250k
  const suffixMatch = cleaned.match(/^([\d.,]+)\s*([kmb])$/);
  if (suffixMatch) {
    // For suffixes like 1.5b or 0,13b, treat both . and , as decimals
    const num = parseFloat(suffixMatch[1].replace(',', '.'));
    if (isNaN(num)) return 0;
    switch (suffixMatch[2]) {
      case 'b': return num * 1_000_000_000;
      case 'm': return num * 1_000_000;
      case 'k': return num * 1_000;
    }
  }

  // Plain number or dot-separated locale string
  cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Short readable date.
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
