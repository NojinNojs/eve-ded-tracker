'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, Keyboard, Package, Search, Send, TrendingDown, TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchJaniceAppraisal, type JaniceResult } from '@/app/actions/janice';
import { submitDedRun } from '@/app/actions/ded-runs';
import { formatISK, formatISKFull, formatISKInputDisplay, parseISKInput } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  DED_TYPES, FACTIONS, type DedType, type Faction, type PricingMode,
} from '@/lib/types';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import PurchaseBlock from '@/components/form/PurchaseBlock';
import PriceSettings from '@/components/form/PriceSettings';
import JanicePanel from '@/components/form/JanicePanel';

type LootInputMode = 'janice' | 'manual';

const selectContent =
  'border-3 border-[var(--nb-border)] rounded-none shadow-[4px_4px_0px_var(--nb-shadow)] bg-[var(--nb-surface)]';
const selectItem = 'font-mono font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors';
const labelClass = 'text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]';

/** Clamp to the range Janice accepts (0–200%). */
function clampPercent(raw: string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(200, Math.round(parsed)));
}

function itemsTotal(items: JaniceResult['items'], mode: PricingMode): number {
  return items.reduce((sum, item) => {
    if (mode === 'sell') return sum + item.sellPriceTotal;
    if (mode === 'split') return sum + item.splitPriceTotal;
    return sum + item.buyPriceTotal;
  }, 0);
}

function sanitizeAmount(raw: string): string {
  const value = raw.replace(/[^0-9.,mbk]/gi, '').replace(/([.,])([.,]+)/g, '$1');
  const suffixes = value.match(/[mbk]/gi);
  if (suffixes && suffixes.length > 1) return value.slice(0, -1);
  return value.replace(/([mbk])[\d.,]/gi, '$1');
}

export default function DedRunForm() {
  const { t } = useI18n();

  const [dedType, setDedType] = useState<DedType | null>(null);
  const [faction, setFaction] = useState<Faction | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [capitalRaw, setCapitalRaw] = useState('');

  const [lootMode, setLootMode] = useState<LootInputMode>('janice');
  const [rawLootText, setRawLootText] = useState('');
  const [manualRaw, setManualRaw] = useState('');

  const [pricingMode, setPricingMode] = useState<PricingMode>('split');
  const [percent, setPercent] = useState('100');
  const [appraisedPercent, setAppraisedPercent] = useState<number | null>(null);

  const [janiceResult, setJaniceResult] = useState<JaniceResult | null>(null);
  const [janiceCode, setJaniceCode] = useState<string | null>(null);
  const [janiceLoading, setJaniceLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const percentValue = clampPercent(percent);

  // Everything money-related is derived — no second copy of the truth to keep in sync.
  const lootValue = lootMode === 'janice'
    ? (janiceResult ? itemsTotal(janiceResult.items, pricingMode) : 0)
    : parseISKInput(manualRaw);
  const capitalCost = isPurchased ? parseISKInput(capitalRaw) : 0;
  const netProfit = lootValue - capitalCost;
  const stale = janiceResult !== null && appraisedPercent !== percentValue;

  async function runAppraisal(silent = false) {
    if (!rawLootText.trim()) {
      if (!silent) toast.error(t('form.toast.paste_first'));
      return;
    }
    setJaniceLoading(true);
    try {
      const result = await fetchJaniceAppraisal(rawLootText, pricingMode, percentValue);
      if (result.success) {
        setJaniceResult(result);
        setJaniceCode(result.janiceCode);
        setAppraisedPercent(percentValue);
        if (!silent) {
          toast.success(`${formatISK(result.totalValue)}`, {
            description: result.janiceCode ? `Janice ${result.janiceCode}` : undefined,
          });
        }
      } else if (!silent) {
        toast.error(result.error ?? t('form.toast.failed'));
      }
    } catch {
      if (!silent) toast.error(t('form.toast.network'));
    } finally {
      setJaniceLoading(false);
    }
  }

  // Changing the percentage re-appraises on its own, quietly, once typing settles.
  const lastPercent = useRef(percentValue);
  useEffect(() => {
    if (lastPercent.current === percentValue) return;
    lastPercent.current = percentValue;
    if (!janiceResult || !rawLootText.trim()) return;

    const timer = setTimeout(() => { void runAppraisal(true); }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentValue]);

  function resetAfterSubmit() {
    setCapitalRaw('');
    setRawLootText('');
    setManualRaw('');
    setIsPurchased(false);
    setJaniceResult(null);
    setJaniceCode(null);
    setAppraisedPercent(null);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!dedType || !faction) {
      setFormError(t('form.error.missing_selection'));
      toast.error(t('form.error.missing_selection'));
      return;
    }
    if (lootValue <= 0) {
      setFormError(t('form.hint.loot'));
      toast.error(t('form.hint.loot'));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitDedRun({
        ded_type: dedType,
        faction,
        is_purchased: isPurchased,
        capital_cost: capitalCost,
        loot_value: lootValue,
        pricing_mode: pricingMode,
        pricing_percent: percentValue,
        janice_code: lootMode === 'janice' ? janiceCode : null,
      });

      if (result.success) {
        toast.success(t('form.toast.logged'), { description: `${dedType} ${faction}` });
        resetAfterSubmit();
      } else {
        toast.error(result.error ?? t('form.toast.failed'));
      }
    } catch {
      toast.error(t('form.toast.unexpected'));
    } finally {
      setIsSubmitting(false);
    }
  }

  const hints = !dedType || !faction ? t('form.error.missing_selection') : lootValue <= 0 ? t('form.hint.loot') : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="nb-card nb-card--static flex flex-col"
    >
      <div className="flex items-center gap-2.5 border-b-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] px-4 py-3.5">
        <div className="flex size-9 items-center justify-center border-3 border-[var(--nb-border)] bg-white shadow-[2px_2px_0px_var(--nb-shadow)]">
          <Package className="size-4 text-black" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase leading-none tracking-tight text-black">
            {t('form.title')}
          </h2>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black/70">
            {t('form.header.sub')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        {/* DED level + faction */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ded-level" className={labelClass}>
              {t('form.ded_level')}
            </label>
            <Select value={dedType ?? ''} onValueChange={(value) => value && setDedType(value as DedType)}>
              <SelectTrigger id="ded-level" className="nb-select w-full truncate pr-7 font-mono text-sm font-bold">
                <SelectValue placeholder={t('form.ded_level.placeholder')} />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} side="bottom" className={selectContent}>
                <SelectGroup>
                  {DED_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value} className={selectItem}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="faction" className={labelClass}>
              {t('form.faction')}
            </label>
            <Select value={faction ?? ''} onValueChange={(value) => value && setFaction(value as Faction)}>
              <SelectTrigger id="faction" className="nb-select w-full truncate pr-7 font-mono text-sm font-bold">
                <SelectValue placeholder={t('form.faction.placeholder')} />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} side="bottom" className={selectContent}>
                <SelectGroup>
                  {FACTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className={selectItem}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <PurchaseBlock
          isPurchased={isPurchased}
          onToggle={() => setIsPurchased((value) => !value)}
          capitalRaw={capitalRaw}
          onCapitalChange={(value) => setCapitalRaw(sanitizeAmount(value))}
          onCapitalBlur={() => setCapitalRaw((value) => formatISKInputDisplay(value))}
          capitalCost={capitalCost}
        />

        <div className="h-[3px] bg-[var(--nb-border)]" aria-hidden="true" />

        {/* Loot source */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className={labelClass}>{t('form.loot_source')}</span>
            <div role="group" aria-label={t('form.loot')} className="flex gap-1.5">
              {([
                { key: 'janice' as const, icon: Search, label: 'Janice', active: 'bg-[var(--nb-cyan)]' },
                { key: 'manual' as const, icon: Keyboard, label: t('form.manual'), active: 'bg-[var(--nb-pink)]' },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  aria-pressed={lootMode === tab.key}
                  onClick={() => setLootMode(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 border-3 border-[var(--nb-border)] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all',
                    lootMode === tab.key
                      ? `${tab.active} translate-x-[2px] translate-y-[2px] text-black shadow-none`
                      : 'bg-[var(--nb-surface)] text-[var(--nb-text-muted)] shadow-[3px_3px_0px_var(--nb-shadow)] hover:text-[var(--nb-text)]'
                  )}
                >
                  <tab.icon className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <PriceSettings
            pricingMode={pricingMode}
            onModeChange={setPricingMode}
            percent={percent}
            onPercentChange={setPercent}
            onPercentBlur={() => setPercent(String(clampPercent(percent)))}
          />

          {lootMode === 'janice' ? (
            <JanicePanel
              text={rawLootText}
              onTextChange={setRawLootText}
              loading={janiceLoading}
              onFetch={() => void runAppraisal()}
              result={janiceResult}
              janiceCode={janiceCode}
              pricingMode={pricingMode}
              stale={stale}
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="manual-loot" className={labelClass}>
                {t('form.loot_value')}
              </label>
              <input
                id="manual-loot"
                inputMode="numeric"
                placeholder={t('form.manual.placeholder')}
                value={manualRaw}
                onChange={(event) => setManualRaw(sanitizeAmount(event.target.value))}
                onBlur={() => setManualRaw((value) => formatISKInputDisplay(value))}
                className="nb-input"
              />
              <p className="text-[11px] font-medium leading-relaxed text-[var(--nb-text-faint)]">
                {t('form.manual.hint')}
              </p>
            </div>
          )}

          {lootValue > 0 && (
            <div className="flex items-baseline justify-between gap-2 border-t-2 border-dashed border-[var(--nb-border)] pt-2">
              <span className={labelClass}>{t('form.loot_value')}</span>
              <span className="font-mono text-sm font-black">{formatISKFull(lootValue)}</span>
            </div>
          )}
        </div>

        {/* Net PNL */}
        <AnimatePresence initial={false}>
          {lootValue > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'flex items-center justify-between border-3 border-[var(--nb-border)] px-3.5 py-3 shadow-[3px_3px_0px_var(--nb-shadow)]',
                netProfit >= 0 ? 'bg-[var(--nb-lime)]' : 'bg-[var(--nb-red)]'
              )}
            >
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
                {netProfit >= 0 ? (
                  <TrendingUp className="size-4" strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <TrendingDown className="size-4" strokeWidth={2.5} aria-hidden="true" />
                )}
                {t('form.net_pnl')}
              </span>
              <span className="font-mono text-base font-black text-black">{formatISKFull(netProfit)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {formError && (
          <p
            role="alert"
            className="animate-shake flex items-center justify-center gap-1.5 border-2 border-red-500 bg-red-100 p-2 text-center text-[11px] font-bold uppercase text-red-700 dark:bg-red-900/30 dark:text-red-300"
          >
            <AlertTriangle className="size-3.5" aria-hidden="true" />
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || Boolean(hints)}
          className="nb-btn nb-btn-primary group w-full justify-center py-3 text-sm"
        >
          {isSubmitting ? (
            <>
              <span className="nb-spinner" /> {t('form.submitting')}
            </>
          ) : (
            <>
              <Send className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
              {t('form.submit')}
            </>
          )}
        </button>

        {hints && !isSubmitting && (
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-[var(--nb-text-muted)]">
            {hints}
          </p>
        )}
      </form>
    </motion.div>
  );
}
