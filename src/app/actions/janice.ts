/* ──────────────────────────────────────────────────────────
 *  Server Action: Janice API v2 Proxy
 * ────────────────────────────────────────────────────────── */
'use server';

import type { PricingMode } from '@/lib/types';

export interface JaniceResultItem {
  name: string;
  typeId: number;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  splitPrice: number;
  buyPriceTotal: number;
  sellPriceTotal: number;
  splitPriceTotal: number;
}

export interface JaniceResult {
  success: boolean;
  totalValue: number;
  immediateValue: number;
  janiceCode: string | null;
  items: JaniceResultItem[];
  error?: string;
}

/** Janice API v2 response shape (relevant fields only) */
interface JaniceV2Response {
  code: string;
  pricing: string;
  pricePercentage: number;
  effectivePrices: {
    totalBuyPrice: number;
    totalSplitPrice: number;
    totalSellPrice: number;
  };
  immediatePrices: {
    totalBuyPrice: number;
    totalSplitPrice: number;
    totalSellPrice: number;
  };
  items: Array<{
    amount: number;
    effectivePrices: {
      buyPrice: number;
      sellPrice: number;
      splitPrice: number;
      buyPriceTotal: number;
      sellPriceTotal: number;
      splitPriceTotal: number;
    };
    itemType: {
      eid: number;
      name: string;
    };
  }>;
}

const JANICE_V2_ENDPOINT = 'https://janice.e-351.com/api/rest/v2/appraisal';

/**
 * POST raw loot text to the Janice API v2 and return the appraised value
 * with per-item breakdown.
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
  const empty: JaniceResult = {
    success: false,
    totalValue: 0,
    immediateValue: 0,
    janiceCode: null,
    items: [],
  };

  /* ── Validation ──────────────────────────────────────── */

  const trimmedLoot = rawLootText.trim();
  if (!trimmedLoot) {
    return { ...empty, error: 'Loot text cannot be empty.' };
  }

  if (trimmedLoot.length > 20000) {
    return { ...empty, error: 'Payload too large. Limit is 20,000 characters.' };
  }

  // Clamp percent to valid range server-side
  const clampedPercent = Math.max(0, Math.min(200, Math.round(percent)));

  // Validate pricing mode
  const validModes: PricingMode[] = ['buy', 'sell', 'split'];
  if (!validModes.includes(mode)) {
    return { ...empty, error: 'Invalid pricing mode.' };
  }

  const apiKey = process.env.JANICE_API_KEY;
  if (!apiKey) {
    return { ...empty, error: 'Janice API key is not configured on the server.' };
  }

  /* ── Build request ───────────────────────────────────── */

  const pricePercentage = (clampedPercent / 100).toFixed(2);

  const params = new URLSearchParams({
    market: '2',                // Jita (The Forge)
    designation: 'appraisal',
    pricing: mode,              // buy | sell | split
    pricePercentage,            // decimal 0-2
    persist: 'true',
    compactize: 'true',
  });

  try {
    const response = await fetch(`${JANICE_V2_ENDPOINT}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        'X-ApiKey': apiKey,
      },
      body: trimmedLoot,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        ...empty,
        error: `Janice API error (${response.status}): ${errorBody}`,
      };
    }

    const data: JaniceV2Response = await response.json();

    /* ── Map items ───────────────────────────────────── */

    const items: JaniceResultItem[] = data.items.map((item) => ({
      name: item.itemType.name,
      typeId: item.itemType.eid,
      quantity: item.amount,
      buyPrice: item.effectivePrices.buyPrice,
      sellPrice: item.effectivePrices.sellPrice,
      splitPrice: item.effectivePrices.splitPrice,
      buyPriceTotal: item.effectivePrices.buyPriceTotal,
      sellPriceTotal: item.effectivePrices.sellPriceTotal,
      splitPriceTotal: item.effectivePrices.splitPriceTotal,
    }));

    /* ── Pick totals based on pricing mode ───────────── */

    let totalValue: number;
    switch (mode) {
      case 'sell':
        totalValue = data.effectivePrices.totalSellPrice ?? 0;
        break;
      case 'split':
        totalValue = data.effectivePrices.totalSplitPrice ?? 0;
        break;
      case 'buy':
      default:
        totalValue = data.effectivePrices.totalBuyPrice ?? 0;
        break;
    }

    let immediateValue: number;
    switch (mode) {
      case 'sell':
        immediateValue = data.immediatePrices.totalSellPrice ?? 0;
        break;
      case 'split':
        immediateValue = data.immediatePrices.totalSplitPrice ?? 0;
        break;
      case 'buy':
      default:
        immediateValue = data.immediatePrices.totalBuyPrice ?? 0;
        break;
    }

    // Sanitize janice code — must be alphanumeric to prevent URL injection
    const rawCode = data.code ?? null;
    const safeCode = rawCode && /^[a-zA-Z0-9]+$/.test(rawCode) ? rawCode : null;

    return {
      success: true,
      totalValue,
      immediateValue,
      janiceCode: safeCode,
      items,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      ...empty,
      error: `Failed to reach Janice API: ${message}`,
    };
  }
}
