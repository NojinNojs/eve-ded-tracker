/* ──────────────────────────────────────────────────────────
 *  EVE DED Tracker – Shared Type Definitions
 * ────────────────────────────────────────────────────────── */

/** Allowed DED site difficulty tiers */
export type DedType = '5/10' | '6/10' | '7/10' | '8/10' | '9/10' | '10/10';

/** Pirate factions that spawn DED sites */
export type Faction =
  | 'Guristas'
  | 'Sansha'
  | 'Blood Raiders'
  | 'Angel Cartel'
  | 'Serpentis';

/** Janice pricing mode */
export type PricingMode = 'buy' | 'sell' | 'split';

/** Row shape that matches the `ded_runs` Supabase table */
export interface DedRun {
  id: string;
  character_id: string;
  ded_type: DedType;
  faction: Faction;
  is_purchased: boolean;
  capital_cost: number;
  loot_value: number;
  net_profit: number;
  pricing_mode: PricingMode;
  pricing_percent: number;
  janice_code: string | null;
  created_at: string;
}

/** Payload sent from the form to the server action */
export interface DedRunInsert {
  ded_type: DedType;
  faction: Faction;
  is_purchased: boolean;
  capital_cost: number;
  loot_value: number;
  pricing_mode: PricingMode;
  pricing_percent: number;
  janice_code?: string | null;
}

/** Aggregated stats for the dashboard cards */
export interface DashboardStats {
  totalProfit: number;
  totalRuns: number;
  mostProfitable: {
    faction: Faction;
    dedType: DedType;
    profit: number;
  } | null;
}

/** Dropdown option helper */
export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

/** Constants */
export const DED_TYPES: SelectOption<DedType>[] = [
  { label: '5/10', value: '5/10' },
  { label: '6/10', value: '6/10' },
  { label: '7/10', value: '7/10' },
  { label: '8/10', value: '8/10' },
  { label: '9/10', value: '9/10' },
  { label: '10/10', value: '10/10' },
];

export const FACTIONS: SelectOption<Faction>[] = [
  { label: 'Guristas', value: 'Guristas' },
  { label: 'Sansha', value: 'Sansha' },
  { label: 'Blood Raiders', value: 'Blood Raiders' },
  { label: 'Angel Cartel', value: 'Angel Cartel' },
  { label: 'Serpentis', value: 'Serpentis' },
];

export const PRICING_MODES: SelectOption<PricingMode>[] = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
  { label: 'Split', value: 'split' },
];
