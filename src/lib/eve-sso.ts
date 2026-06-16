/* ──────────────────────────────────────────────────────────
 *  EVE SSO Helper – Shared constants and utilities
 * ────────────────────────────────────────────────────────── */

/** EVE SSO OAuth2 endpoints */
export const EVE_SSO = {
  AUTHORIZE: 'https://login.eveonline.com/v2/oauth/authorize',
  TOKEN: 'https://login.eveonline.com/v2/oauth/token',
  VERIFY: 'https://login.eveonline.com/v2/oauth/verify',
} as const;

/** EVE character info returned by the verify endpoint */
export interface EveCharacter {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

/**
 * Generate a deterministic Supabase email from EVE character ID.
 * This avoids collisions and creates a unique identity per character.
 */
export function characterEmail(characterId: number): string {
  return `eve-${characterId}@eveonline.com`;
}

/**
 * Generate a deterministic password from EVE character owner hash.
 * The CharacterOwnerHash is stable per character-account binding.
 */
export function characterPassword(ownerHash: string): string {
  return `eve_sso_${ownerHash}`;
}
