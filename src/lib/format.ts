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

/** "1.5b" style short form for chips and tight columns. */
export function formatISKShort(value: number, locale: string = 'en-US'): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const unit = (n: number, suffix: string, div: number) =>
    `${sign}${Number((abs / div).toFixed(2)).toLocaleString(locale, { maximumFractionDigits: 2 })}${suffix}`;

  if (abs >= 1_000_000_000) return unit(abs, 'B', 1_000_000_000);
  if (abs >= 1_000_000) return unit(abs, 'M', 1_000_000);
  if (abs >= 1_000) return unit(abs, 'K', 1_000);
  return `${sign}${abs.toLocaleString(locale)}`;
}

/**
 * Parse a typed ISK amount. Accepts every shape a capsuleer actually types:
 *   "150m"  "1.5b"  "250k"  "1,5b"  "150.000.000"  "1,234,567"  "890000000"
 *
 * Rules:
 *   - A k/m/b suffix forces the separator to be read as a decimal when it is
 *     followed by 1–2 digits ("2.34b"), otherwise as a thousands separator
 *     ("1.500m" is unusual, so we treat 3 trailing digits as thousands).
 *   - Without a suffix, groups of exactly three digits after a separator are
 *     thousands separators; anything else is a decimal point.
 */
export function parseISKInput(raw: string): number {
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, '');
  if (!cleaned) return 0;

  const suffixMatch = cleaned.match(/^([\d.,]+)([kmb])$/);
  const body = suffixMatch ? suffixMatch[1] : cleaned;
  const suffix = suffixMatch?.[2] as 'k' | 'm' | 'b' | undefined;

  const amount = parseNumericBody(body, Boolean(suffix));
  if (!Number.isFinite(amount)) return 0;

  switch (suffix) {
    case 'b': return amount * 1_000_000_000;
    case 'm': return amount * 1_000_000;
    case 'k': return amount * 1_000;
    default: return amount;
  }
}

function parseNumericBody(body: string, allowDecimal: boolean): number {
  if (!body) return NaN;

  const separators = [...body.matchAll(/[.,]/g)].map((m) => m[0]);
  const digits = body.replace(/[.,]/g, '');
  if (!/^\d+$/.test(digits)) return NaN;

  if (separators.length === 0) return Number(digits);

  const lastSeparatorIndex = Math.max(body.lastIndexOf('.'), body.lastIndexOf(','));
  const decimals = body.slice(lastSeparatorIndex + 1);

  // "1.780.000" / "1,234,567" — pure thousands grouping.
  if (/^\d{1,3}([.,]\d{3})+$/.test(body)) return Number(digits);

  // Single separator: 3 trailing digits means thousands, 1–2 means decimals.
  if (separators.length === 1 && !allowDecimal && decimals.length === 3) return Number(digits);

  return Number(`${body.slice(0, lastSeparatorIndex).replace(/[.,]/g, '')}.${decimals}`);
}

/** Thousands-grouped input display, using the de-DE style the form expects. */
export function formatISKInputDisplay(value: string): string {
  if (!/[mbk]/i.test(value) && /^\d+$/.test(value.replace(/[.,]/g, ''))) {
    const digits = value.replace(/[.,]/g, '');
    return new Intl.NumberFormat('de-DE').format(Number(digits));
  }
  return value;
}

/**
 * Month + day only — for table columns where the clock time is noise.
 */
export function formatDayMonth(dateStr: string, locale: string = 'en-US'): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

/**
 * Short readable date, locale aware.
 */
export function formatDate(dateStr: string, locale: string = 'en-US'): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Percentage with one decimal, tolerating a zero base. */
export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(digits)}%`;
}
