/* ──────────────────────────────────────────────────────────
 *  Server Action: Janice API Proxy (avoids CORS)
 * ────────────────────────────────────────────────────────── */
'use server';

import type { PricingMode } from '@/lib/types';

interface JaniceResult {
  success: boolean;
  value: number;
  error?: string;
}

interface JaniceApiResponse {
  totalBuyPrice: number;
  totalBuyPrice5Pct: number;
  totalSellPrice: number;
  totalSellPrice5Pct: number;
  totalSplitPrice: number;
  totalSplitPrice5Pct: number;
}

const JANICE_ENDPOINT = 'https://janice.eveparse.com/api/v1/appraisal';

/**
 * POST raw loot text to the Janice API and return the appraised value.
 *
 * @param rawLootText - Copy-pasted loot text from the EVE client
 * @param mode        - Pricing mode: buy | sell | split
 * @param percent     - Percentage modifier (0-200), e.g. 95 = 95%
 */
export async function fetchJaniceAppraisal(
  rawLootText: string,
  mode: PricingMode = 'buy',
  percent: number = 95,
): Promise<JaniceResult> {
  const trimmedLoot = rawLootText.trim();
  if (!trimmedLoot) {
    return { success: false, value: 0, error: 'Loot text cannot be empty.' };
  }
  
  if (trimmedLoot.length > 20000) {
    return { success: false, value: 0, error: 'Payload too large. Limit is 20,000 characters.' };
  }

  try {
    const response = await fetch(JANICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        'X-Janice-Market': '2',       // Jita (The Forge)
        'X-Janice-Persist': 'false',
      },
      body: trimmedLoot,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        success: false,
        value: 0,
        error: `Janice API error (${response.status}): ${errorBody}`,
      };
    }

    const data: JaniceApiResponse = await response.json();

    // Pick the base value according to the selected pricing mode
    let baseValue: number;
    switch (mode) {
      case 'sell':
        baseValue = data.totalSellPrice ?? 0;
        break;
      case 'split':
        baseValue = data.totalSplitPrice ?? 0;
        break;
      case 'buy':
      default:
        baseValue = data.totalBuyPrice ?? 0;
        break;
    }

    // Apply the user's percentage modifier
    const adjustedValue = Math.round(baseValue * (percent / 100));

    return { success: true, value: adjustedValue };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      value: 0,
      error: `Failed to reach Janice API: ${message}`,
    };
  }
}
