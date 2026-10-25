'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { formatISKFull } from '@/lib/format';
import { cn } from '@/lib/utils';

interface Props {
  isPurchased: boolean;
  onToggle: () => void;
  capitalRaw: string;
  onCapitalChange: (value: string) => void;
  onCapitalBlur: () => void;
  capitalCost: number;
}

/** Bought escalation ⇄ free drop, with the capital field revealed only when it matters. */
export default function PurchaseBlock({
  isPurchased,
  onToggle,
  capitalRaw,
  onCapitalChange,
  onCapitalBlur,
  capitalCost,
}: Props) {
  const { t, locale } = useI18n();

  const scale = capitalCost >= 1_000_000_000
    ? { value: capitalCost / 1_000_000_000, unit: locale === 'id' ? 'Miliar' : 'Billion' }
    : capitalCost >= 1_000_000
      ? { value: capitalCost / 1_000_000, unit: locale === 'id' ? 'Juta' : 'Million' }
      : capitalCost >= 1_000
        ? { value: capitalCost / 1_000, unit: locale === 'id' ? 'Ribu' : 'Thousand' }
        : null;

  return (
    <div className="flex flex-col border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[3px_3px_0px_var(--nb-shadow)]">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPurchased}
        className={cn(
          'flex items-center justify-between p-3.5 text-left transition-colors duration-200',
          isPurchased ? 'bg-[var(--nb-amber)]' : 'hover:bg-[var(--nb-hover-bg)]'
        )}
      >
        <div>
          <p className={cn('text-sm font-black uppercase', isPurchased && 'text-black')}>
            {isPurchased ? t('form.purchased.on') : t('form.purchased.off')}
          </p>
          <p
            className={cn(
              'text-[11px] font-medium',
              isPurchased ? 'text-black/60' : 'text-[var(--nb-text-muted)]'
            )}
          >
            {isPurchased ? t('form.purchased.on.sub') : t('form.purchased.off.sub')}
          </p>
        </div>
        <span className={cn('nb-toggle shrink-0', isPurchased && 'active')} aria-hidden="true">
          <span className="nb-toggle-knob" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isPurchased && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 border-t-3 border-[var(--nb-border)] p-3.5">
              <label
                htmlFor="capital-cost"
                className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]"
              >
                {t('form.capital')}
              </label>
              <input
                id="capital-cost"
                inputMode="numeric"
                placeholder={t('form.capital.placeholder')}
                value={capitalRaw}
                onChange={(event) => onCapitalChange(event.target.value)}
                onBlur={onCapitalBlur}
                className="nb-input"
              />
              {capitalCost > 0 && (
                <p className="font-mono text-[11px] font-bold text-[var(--nb-text-muted)]">
                  ≈ {formatISKFull(capitalCost)}
                  {scale && (
                    <span className="ml-1 font-sans font-medium text-[var(--nb-text-faint)]">
                      ({Number(scale.value.toFixed(2))} {scale.unit})
                    </span>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
