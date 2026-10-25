'use client';

import { MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { PRICING_MODES, type PricingMode } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

interface Props {
  pricingMode: PricingMode;
  onModeChange: (mode: PricingMode) => void;
  /** Raw text so the field can be empty while typing. */
  percent: string;
  onPercentChange: (value: string) => void;
  onPercentBlur: () => void;
}

/**
 * Pricing knobs. Jita is not a control — it is the only market Janice quotes —
 * so it reads as a chip instead of eating a whole column on narrow screens.
 */
export default function PriceSettings({
  pricingMode,
  onModeChange,
  percent,
  onPercentChange,
  onPercentBlur,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-2 border-2 border-[var(--nb-border)] bg-[var(--nb-hover-bg)] p-2.5 shadow-[2px_2px_0px_var(--nb-shadow)]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
          {t('form.pricing')}
        </span>
        <span
          className="inline-flex items-center gap-1 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider"
          title={`${t('form.location')}: Jita`}
        >
          <MapPin className="size-2.5" strokeWidth={3} aria-hidden="true" />
          Jita
        </span>
      </div>

      <div className="grid grid-cols-[1fr_5.5rem] gap-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="pricing-mode"
            className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]"
          >
            {t('form.price_mode')}
          </label>
          <Select value={pricingMode} onValueChange={(value) => value && onModeChange(value as PricingMode)}>
            <SelectTrigger
              id="pricing-mode"
              className="nb-select h-auto w-full truncate rounded-none p-1.5 pr-6 font-mono text-xs font-bold"
            >
              <span className="truncate">
                {PRICING_MODES.find((mode) => mode.value === pricingMode)?.label ?? pricingMode}
              </span>
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              className="rounded-none border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[4px_4px_0px_var(--nb-shadow)]"
            >
              <SelectGroup>
                {PRICING_MODES.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-none font-mono text-xs font-bold transition-colors hover:bg-[var(--nb-amber)]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="pricing-percent"
            className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]"
          >
            {t('form.percent')}
          </label>
          <div className="flex items-center gap-0.5 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-1.5">
            <input
              id="pricing-percent"
              type="text"
              inputMode="numeric"
              value={percent}
              onChange={(event) => onPercentChange(event.target.value.replace(/\D/g, '').slice(0, 3))}
              onBlur={onPercentBlur}
              className="w-full bg-transparent py-1.5 text-center font-mono text-xs font-bold outline-none"
            />
            <span aria-hidden="true" className="text-[10px] font-black text-[var(--nb-text-muted)]">
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
