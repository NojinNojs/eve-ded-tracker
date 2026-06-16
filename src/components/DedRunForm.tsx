'use client';

import { useState } from 'react';
import {
  Send, Search, TrendingUp, TrendingDown, Package, Keyboard, AlertTriangle
} from 'lucide-react';
import { fetchJaniceAppraisal } from '@/app/actions/janice';
import { submitDedRun } from '@/app/actions/ded-runs';
import { parseISKInput, formatISK, formatISKFull } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import {
  DED_TYPES, FACTIONS, PRICING_MODES,
  type DedType, type Faction, type PricingMode,
} from '@/lib/types';
import { toast } from 'sonner';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';


type LootInputMode = 'janice' | 'manual';

const dedTypeItems = [
  { label: 'Select level', value: null },
  ...DED_TYPES.map((d) => ({ label: d.label, value: d.value })),
];
const factionItems = [
  { label: 'Select faction', value: null },
  ...FACTIONS.map((f) => ({ label: f.label, value: f.value })),
];
const pricingModeItems = [
  { label: 'Mode', value: null },
  ...PRICING_MODES.map((p) => ({ label: p.label, value: p.value })),
];

export default function DedRunForm() {
  const { t, locale } = useI18n();
  const [dedType, setDedType] = useState<DedType | null>(null);
  const [faction, setFaction] = useState<Faction | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [capitalCostRaw, setCapitalCostRaw] = useState('');
  const [rawLootText, setRawLootText] = useState('');
  const [lootValue, setLootValue] = useState<number>(0);
  const [pricingMode, setPricingMode] = useState<PricingMode>('split');
  const [pricingPercent, setPricingPercent] = useState(100);
  const [janiceLoading, setJaniceLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lootInputMode, setLootInputMode] = useState<LootInputMode>('manual');
  const [manualLootRaw, setManualLootRaw] = useState('');

  const capitalCost = isPurchased ? parseISKInput(capitalCostRaw) : 0;
  const netProfit = lootValue - capitalCost;

  async function handleFetchJanice() {
    if (!rawLootText.trim()) { toast.error('Paste your loot text first.'); return; }
    setJaniceLoading(true);
    try {
      const result = await fetchJaniceAppraisal(rawLootText, pricingMode, pricingPercent);
      setJaniceLoading(false);
      if (result.success) {
        setLootValue(result.value);
        setTimeout(() => toast.success(`Appraised: ${formatISK(result.value)}`), 50);
      } else {
        setTimeout(() => toast.error(result.error ?? 'Appraisal failed'), 50);
      }
    } catch {
      setJaniceLoading(false);
      setTimeout(() => toast.error('Network error'), 50);
    }
  }

  function handleManualLootChange(v: string) {
    v = v.replace(/[^0-9.,mbk]/gi, '');
    v = v.replace(/([.,])([.,]+)/g, '$1');
    const suffixMatch = v.match(/[mbk]/gi);
    if (suffixMatch && suffixMatch.length > 1) return;
    setManualLootRaw(v);
    setLootValue(parseISKInput(v));
  }

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit() {
    setFormError(null);
    if (!dedType || !faction) {
      setFormError(t('form.error.missing_selection') ?? 'Please select DED Level and Faction.');
      toast.error(t('form.error.missing_selection') ?? 'Please select DED Level and Faction.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitDedRun({
        ded_type: dedType, faction,
        is_purchased: isPurchased, capital_cost: capitalCost,
        loot_value: lootValue, pricing_mode: pricingMode,
        pricing_percent: pricingPercent,
      });
      
      setIsSubmitting(false); // Stop loading before toast

      if (result.success) {
        setCapitalCostRaw(''); setRawLootText('');
        setLootValue(0); setIsPurchased(false);
        setManualLootRaw('');
        setTimeout(() => toast.success('Run logged!', { description: `${dedType} ${faction}` }), 50);
      } else {
        setTimeout(() => toast.error(result.error ?? 'Failed.'), 50);
      }
    } catch {
      setIsSubmitting(false);
      setTimeout(() => toast.error('An unexpected error occurred.'), 50);
    }
  }

  return (
    <div className="nb-card p-5 sm:p-6 animate-slide-left">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[2px_2px_0px_var(--nb-shadow)] transition-transform hover:rotate-12">
          <Package className="size-5 text-black" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight">{t('form.title')}</h2>
      </div>

      <div className="flex flex-col gap-5">
        {/* DED + Faction */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--nb-text-muted)]">{t('form.ded_level')}</label>
            <Select items={dedTypeItems} value={dedType} onValueChange={(v) => v && setDedType(v as DedType)}>
              <SelectTrigger className="nb-select w-full font-mono text-sm font-bold"><SelectValue /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false} side="bottom" className="border-3 border-[var(--nb-border)] rounded-none shadow-[4px_4px_0px_var(--nb-shadow)] animate-scale-in bg-[var(--nb-surface)]">
                <SelectGroup>
                  {DED_TYPES.map((o) => <SelectItem key={o.value} value={o.value} className="font-mono font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors">{o.label}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--nb-text-muted)]">{t('form.faction')}</label>
            <Select items={factionItems} value={faction} onValueChange={(v) => v && setFaction(v as Faction)}>
              <SelectTrigger className="nb-select w-full font-mono text-sm font-bold"><SelectValue /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false} side="bottom" className="border-3 border-[var(--nb-border)] rounded-none shadow-[4px_4px_0px_var(--nb-shadow)] animate-scale-in bg-[var(--nb-surface)]">
                <SelectGroup>
                  {FACTIONS.map((o) => <SelectItem key={o.value} value={o.value} className="font-mono font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors">{o.label}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Purchase toggle & Capital Cost Group */}
        <div className="flex flex-col border-3 border-[var(--nb-border)] shadow-[3px_3px_0px_var(--nb-shadow)] bg-[var(--nb-surface)] transition-all">
          <button
            type="button"
            onClick={() => setIsPurchased(!isPurchased)}
            className={cn(
              'flex items-center justify-between p-4 transition-all duration-200',
              isPurchased ? 'bg-[var(--nb-amber)] hover:bg-[var(--nb-amber)]' : 'hover:bg-[var(--nb-hover-bg)]'
            )}
          >
            <div className="text-left">
              <p className={cn('text-sm font-black uppercase', isPurchased ? 'text-black' : '')}>
                {isPurchased ? t('form.purchased.on') : t('form.purchased.off')}
              </p>
              <p className={cn('text-xs font-medium', isPurchased ? 'text-black/50' : 'text-[var(--nb-text-muted)]')}>
                {isPurchased ? t('form.purchased.on.sub') : t('form.purchased.off.sub')}
              </p>
            </div>
            <div className={cn('nb-toggle', isPurchased && 'active')}>
              <div className="nb-toggle-knob" />
            </div>
          </button>

          {isPurchased && (
            <div className="animate-fade-down flex flex-col gap-1.5 p-4 border-t-3 border-[var(--nb-border)] bg-[var(--nb-surface)]">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--nb-text-muted)]">{t('form.capital')}</label>
              <input
                placeholder="e.g. 150m, 1.5b, 250.000.000"
                value={capitalCostRaw}
                onChange={(e) => {
                  let v = e.target.value;
                  v = v.replace(/[^0-9.,mbk]/gi, '');
                  v = v.replace(/([.,])([.,]+)/g, '$1');
                  const suffixMatch = v.match(/[mbk]/gi);
                  if (suffixMatch && suffixMatch.length > 1) return;
                  setCapitalCostRaw(v);
                }}
                onBlur={() => {
                  const v = capitalCostRaw;
                  if (!/[mbk.,]/i.test(v) && v.length > 0) {
                    setCapitalCostRaw(new Intl.NumberFormat('de-DE').format(Number(v)));
                  }
                }}
                className="nb-input nb-focus"
              />
              {capitalCost > 0 && (
                <p className="font-mono text-xs font-bold text-[var(--nb-text-muted)] animate-count-up">
                  ≈ {formatISKFull(capitalCost)} 
                  <span className="text-[var(--nb-text-faint)] font-sans font-medium ml-1">
                    ({
                      capitalCost >= 1_000_000_000 ? `${parseFloat((capitalCost / 1_000_000_000).toFixed(2))} ${locale === 'id' ? 'Miliar' : 'Billion'}` :
                      capitalCost >= 1_000_000 ? `${parseFloat((capitalCost / 1_000_000).toFixed(2))} ${locale === 'id' ? 'Juta' : 'Million'}` :
                      capitalCost >= 1_000 ? `${parseFloat((capitalCost / 1_000).toFixed(2))} ${locale === 'id' ? 'Ribu' : 'Thousand'}` : ''
                    })
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-[3px] bg-[var(--nb-border)]" />

        {/* Loot input mode tabs */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--nb-text-muted)]">{t('form.loot')}</label>
            <div className="input-mode-tabs flex gap-2">
              <button
                type="button"
                disabled
                className="opacity-50 cursor-not-allowed border-2 border-[var(--nb-border)] px-3 py-1 bg-[var(--nb-surface)]"
                title="Janice API is currently in development"
              >
                <span className="flex items-center gap-1 text-[var(--nb-text-muted)]">
                  <Search className="size-3" strokeWidth={2.5} />
                  <span className="line-through">Janice</span>
                  <span className="text-[9px] text-red-500 font-bold ml-1 uppercase bg-red-100 dark:bg-red-900/30 px-1 border border-red-500">Incoming</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => { setLootInputMode('manual'); setRawLootText(''); setLootValue(0); }}
                className={cn('border-2 border-[var(--nb-border)] px-3 py-1 transition-all', lootInputMode === 'manual' ? 'bg-[var(--nb-cyan)] text-black shadow-[2px_2px_0px_var(--nb-shadow)]' : 'bg-[var(--nb-surface)] hover:bg-[var(--nb-hover-bg)]')}
              >
                <span className="flex items-center gap-1">
                  <Keyboard className="size-3" strokeWidth={2.5} />
                  {t('form.manual')}
                </span>
              </button>
            </div>
          </div>
          
          {/* Shared Pricing Settings */}
          <div className="grid grid-cols-3 gap-3 bg-[var(--nb-hover-bg)] p-3 border-2 border-[var(--nb-border)] shadow-[2px_2px_0px_var(--nb-shadow)]">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)]">Location</label>
              <div className="border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-text)] opacity-60 w-full font-mono text-xs font-bold p-2 cursor-not-allowed shadow-[2px_2px_0px_var(--nb-shadow)]">
                Jita
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)]">{t('form.price_mode')}</label>
              <Select items={pricingModeItems} value={pricingMode} onValueChange={(v) => v && setPricingMode(v as PricingMode)}>
                <SelectTrigger className="nb-select w-full font-mono text-xs font-bold !p-2 h-auto"><SelectValue /></SelectTrigger>
                <SelectContent alignItemWithTrigger={false} side="bottom" className="border-3 border-[var(--nb-border)] rounded-none shadow-[4px_4px_0px_var(--nb-shadow)] bg-[var(--nb-surface)]">
                  <SelectGroup>
                    {PRICING_MODES.map((o) => <SelectItem key={o.value} value={o.value} className="font-mono text-xs font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors">{o.label}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)]">{t('form.percent')}</label>
              <div className="flex items-center gap-1 bg-[var(--nb-surface)] border-2 border-[var(--nb-border)] px-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pricingPercent}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    if (raw === '') { setPricingPercent(0); return; }
                    setPricingPercent(Math.min(200, Math.max(0, Number(raw))));
                  }}
                  className="w-full text-center font-bold font-mono text-xs bg-transparent outline-none py-1.5"
                />
                <span className="text-[10px] font-black text-[var(--nb-text-muted)]">%</span>
              </div>
            </div>
          </div>

          {lootInputMode === 'janice' ? (
            <>
              {/* Janice loot paste */}
              <textarea
                className={cn(
                  'min-h-[120px] w-full resize-y border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] p-3 font-mono text-sm shadow-[3px_3px_0px_var(--nb-shadow)]',
                  'placeholder:text-[var(--nb-text-faint)] outline-none focus:shadow-[5px_5px_0px_var(--nb-shadow)] transition-shadow duration-200',
                  'text-[var(--nb-text)]',
                  janiceLoading && 'opacity-50'
                )}
                placeholder={"Pith X-Type Shield Booster 1\nDread Guristas Missile Guidance Computer 2"}
                value={rawLootText}
                onChange={(e) => setRawLootText(e.target.value)}
                disabled={janiceLoading}
              />
              {janiceLoading && (
                <div className="h-1 w-full border border-[var(--nb-border)] overflow-hidden bg-[var(--nb-hover-bg)]">
                  <div className="nb-progress" />
                </div>
              )}



              {/* Janice button */}
              <button
                className="nb-btn nb-btn-secondary w-full justify-center hover-lift nb-focus group"
                onClick={handleFetchJanice}
                disabled={janiceLoading || !rawLootText.trim()}
              >
                {janiceLoading ? (
                  <><span className="nb-spinner" /> {t('form.scanning')}</>
                ) : (
                  <><Search className="size-4 transition-transform group-hover:scale-125" strokeWidth={2.5} /> {t('form.fetch')}</>
                )}
              </button>
            </>
          ) : (
            /* Manual ISK input */
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[var(--nb-text-faint)] font-medium leading-relaxed">
                {t('form.manual.hint')}
              </p>
              <input
                placeholder="e.g. 2.34b, 890m, 1.780.000.000"
                value={manualLootRaw}
                onChange={(e) => handleManualLootChange(e.target.value)}
                onBlur={() => {
                  const v = manualLootRaw;
                  if (!/[mbk.,]/i.test(v) && v.length > 0) {
                    setManualLootRaw(new Intl.NumberFormat('de-DE').format(Number(v)));
                  }
                }}
                className="nb-input nb-focus"
              />
              {lootValue > 0 && (
                <p className="font-mono text-xs font-bold text-[var(--nb-text-muted)] animate-count-up">
                  ≈ {formatISKFull(lootValue)}
                  <span className="text-[var(--nb-text-faint)] font-sans font-medium ml-1">
                    ({
                      lootValue >= 1_000_000_000 ? `${parseFloat((lootValue / 1_000_000_000).toFixed(2))} ${locale === 'id' ? 'Miliar' : 'Billion'}` :
                      lootValue >= 1_000_000 ? `${parseFloat((lootValue / 1_000_000).toFixed(2))} ${locale === 'id' ? 'Juta' : 'Million'}` :
                      lootValue >= 1_000 ? `${parseFloat((lootValue / 1_000).toFixed(2))} ${locale === 'id' ? 'Ribu' : 'Thousand'}` : ''
                    })
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loot value (shown for Janice mode) */}
        {lootInputMode === 'janice' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--nb-text-muted)]">{t('form.loot_value')}</label>
            <input
              value={lootValue > 0 ? formatISKFull(lootValue) : ''}
              readOnly
              placeholder="—"
              className="nb-input font-bold"
            />
          </div>
        )}

        {/* Net PNL preview */}
        {lootValue > 0 && (
          <div className={cn(
            'animate-scale-in flex items-center justify-between border-3 border-[var(--nb-border)] p-4 shadow-[3px_3px_0px_var(--nb-shadow)] transition-colors',
            netProfit >= 0 ? 'bg-[var(--nb-lime)]' : 'bg-[var(--nb-red)]'
          )}>
            <div className="flex items-center gap-2">
              {netProfit >= 0
                ? <TrendingUp className="size-5 text-black animate-bounce-subtle" strokeWidth={2.5} />
                : <TrendingDown className="size-5 text-black animate-wiggle" strokeWidth={2.5} />
              }
              <span className="text-sm font-black uppercase text-black">{t('form.net_pnl')}</span>
            </div>
            <span className="font-mono text-xl font-black text-black">
              {netProfit >= 0 ? '+' : ''}{formatISKFull(netProfit)}
            </span>
          </div>
        )}

        {formError && (
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-500 p-2 text-center animate-shake">
            <span className="text-red-600 dark:text-red-400 font-bold text-xs uppercase flex items-center justify-center gap-2">
              <AlertTriangle className="size-4" />
              {formError}
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          className="nb-btn nb-btn-primary w-full justify-center text-base py-3 hover-lift nb-focus group"
          onClick={handleSubmit}
          disabled={isSubmitting || lootValue === 0}
        >
          {isSubmitting ? (
            <><span className="nb-spinner" /> {t('form.submitting')}</>
          ) : (
            <><Send className="size-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} /> {t('form.submit')}</>
          )}
        </button>
      </div>
    </div>
  );
}
