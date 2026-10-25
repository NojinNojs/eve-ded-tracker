/* ──────────────────────────────────────────────────────────
 *  Locale constants — deliberately NOT a client module.
 *
 *  Importing a value out of a `'use client'` file into a server
 *  component gives you a client-reference proxy instead of the real
 *  value, which silently broke cookie lookups in the layout.
 * ────────────────────────────────────────────────────────── */

export type Locale = 'en' | 'id';

export const LOCALE_COOKIE = 'ded-locale';

export function normalizeLocale(value: string | null | undefined): Locale {
  return value === 'id' ? 'id' : 'en';
}
