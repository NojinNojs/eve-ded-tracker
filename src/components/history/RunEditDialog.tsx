'use client';

import { useState } from 'react';
import { Save, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { updateDedRun } from '@/app/actions/ded-runs';
import { formatISK, formatISKSigned, formatISKInputDisplay, parseISKInput } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  DED_TYPES,
  FACTIONS,
  type DedRun,
  type DedType,
  type Faction,
} from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  /** Render this dialog with `key={run.id}` so fresh state is seeded per run. */
  run: DedRun;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function sanitizeAmount(raw: string): string {
  let value = raw.replace(/[^0-9.,mbk]/gi, '').replace(/([.,])([.,]+)/g, '$1');
  const suffixes = value.match(/[mbk]/gi);
  if (suffixes && suffixes.length > 1) return value.slice(0, -1);
  // Nothing may follow the suffix once it is typed.
  value = value.replace(/([mbk])[\d.,]/gi, '$1');
  return value;
}

/** Fix a bad loot entry without deleting and re-logging the run. */
export default function RunEditDialog({ run, open, onOpenChange }: Props) {
  const { t } = useI18n();

  const [dedType, setDedType] = useState<DedType>(run.ded_type);
  const [faction, setFaction] = useState<Faction>(run.faction);
  const [isPurchased, setIsPurchased] = useState(run.is_purchased);
  const [capitalRaw, setCapitalRaw] = useState(String(Math.round(Number(run.capital_cost))));
  const [lootRaw, setLootRaw] = useState(String(Math.round(Number(run.loot_value))));
  const [saving, setSaving] = useState(false);

  const capital = isPurchased ? parseISKInput(capitalRaw) : 0;
  const loot = parseISKInput(lootRaw);
  const net = loot - capital;

  async function handleSave() {
    if (loot <= 0) {
      toast.error(t('form.hint.loot'));
      return;
    }

    setSaving(true);
    const result = await updateDedRun(run.id, {
      ded_type: dedType,
      faction,
      is_purchased: isPurchased,
      capital_cost: capital,
      loot_value: loot,
      pricing_mode: run.pricing_mode,
      pricing_percent: run.pricing_percent,
      janice_code: run.janice_code,
    });
    setSaving(false);

    if (result.success) {
      toast.success(t('history.edit.saved'));
      onOpenChange(false);
    } else {
      toast.error(result.error ?? t('history.edit.failed'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 rounded-none border-4 border-[var(--nb-border)] bg-[var(--nb-surface)] p-0 shadow-[8px_8px_0px_var(--nb-shadow)]">
        <DialogHeader className="border-b-4 border-[var(--nb-border)] bg-[var(--nb-amber)] px-5 py-4">
          <DialogTitle className="text-base font-black uppercase tracking-tight text-black">
            {t('history.edit.title')}
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-black/70">
            {t('history.edit.sub')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-ded" className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                {t('form.ded_level')}
              </label>
              <Select value={dedType} onValueChange={(v) => v && setDedType(v as DedType)}>
                <SelectTrigger id="edit-ded" className="nb-select w-full font-mono text-sm font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[4px_4px_0px_var(--nb-shadow)]">
                  <SelectGroup>
                    {DED_TYPES.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="rounded-none font-mono font-bold hover:bg-[var(--nb-amber)]">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-faction" className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                {t('form.faction')}
              </label>
              <Select value={faction} onValueChange={(v) => v && setFaction(v as Faction)}>
                <SelectTrigger id="edit-faction" className="nb-select w-full font-mono text-sm font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[4px_4px_0px_var(--nb-shadow)]">
                  <SelectGroup>
                    {FACTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="rounded-none font-mono font-bold hover:bg-[var(--nb-amber)]">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPurchased((v) => !v)}
            aria-pressed={isPurchased}
            className={cn(
              'flex items-center justify-between border-3 border-[var(--nb-border)] px-4 py-3 text-left transition-colors',
              isPurchased ? 'bg-[var(--nb-amber)] text-black' : 'bg-[var(--nb-surface)] hover:bg-[var(--nb-hover-bg)]'
            )}
          >
            <span className="text-xs font-black uppercase tracking-wider">
              {isPurchased ? t('history.bought') : t('history.free')}
            </span>
            <span className={cn('nb-toggle', isPurchased && 'active')} aria-hidden="true">
              <span className="nb-toggle-knob" />
            </span>
          </button>

          {isPurchased && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-capital" className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                {t('form.capital')}
              </label>
              <input
                id="edit-capital"
                inputMode="numeric"
                value={capitalRaw}
                onChange={(e) => setCapitalRaw(sanitizeAmount(e.target.value))}
                onBlur={() => setCapitalRaw(formatISKInputDisplay(capitalRaw))}
                className="nb-input"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-loot" className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
              {t('form.loot_value')}
            </label>
            <input
              id="edit-loot"
              inputMode="numeric"
              value={lootRaw}
              onChange={(e) => setLootRaw(sanitizeAmount(e.target.value))}
              onBlur={() => setLootRaw(formatISKInputDisplay(lootRaw))}
              className="nb-input"
            />
            <p className="font-mono text-xs font-bold text-[var(--nb-text-muted)]">
              ≈ {formatISK(loot)}
            </p>
          </div>

          <div
            className={cn(
              'flex items-center justify-between border-3 border-[var(--nb-border)] px-4 py-3',
              net >= 0 ? 'bg-[var(--nb-lime)]' : 'bg-[var(--nb-red)]'
            )}
          >
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              {net >= 0 ? <TrendingUp className="size-4" strokeWidth={2.5} /> : <TrendingDown className="size-4" strokeWidth={2.5} />}
              {t('form.net_pnl')}
            </span>
            <span className="font-mono text-sm font-black text-black">{formatISKSigned(net)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t-4 border-[var(--nb-border)] bg-[var(--nb-surface)] p-4 sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="nb-btn nb-btn-secondary px-4 py-2 text-xs"
          >
            {t('history.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="nb-btn nb-btn-primary px-5 py-2 text-xs"
          >
            {saving ? (
              <>
                <span className="nb-spinner" /> {t('history.edit.saving')}
              </>
            ) : (
              <>
                <Save className="size-3.5" strokeWidth={2.5} /> {t('history.edit.save')}
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
