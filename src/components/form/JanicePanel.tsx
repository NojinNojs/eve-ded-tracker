'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, Package, Search } from 'lucide-react';
import type { JaniceResult } from '@/app/actions/janice';
import { formatISK } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { janiceUrl, type PricingMode } from '@/lib/types';

interface Props {
  text: string;
  onTextChange: (value: string) => void;
  loading: boolean;
  onFetch: () => void;
  result: JaniceResult | null;
  janiceCode: string | null;
  pricingMode: PricingMode;
  /** True when the price knobs changed after the last appraisal. */
  stale: boolean;
}

function totalFor(mode: PricingMode, item: JaniceResult['items'][number]): number {
  if (mode === 'sell') return item.sellPriceTotal;
  if (mode === 'split') return item.splitPriceTotal;
  return item.buyPriceTotal;
}

/** Paste cargo → Jita appraisal, with the per-item breakdown underneath. */
export default function JanicePanel({
  text,
  onTextChange,
  loading,
  onFetch,
  result,
  janiceCode,
  pricingMode,
  stale,
}: Props) {
  const { t } = useI18n();
  const link = janiceUrl(janiceCode);
  const items = result?.items ?? [];
  const sortedItems = [...items].sort((a, b) => totalFor(pricingMode, b) - totalFor(pricingMode, a));

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="loot-text"
        className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]"
      >
        {t('form.loot')}
      </label>
      <textarea
        id="loot-text"
        className="min-h-[112px] w-full resize-y border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2.5 font-mono text-sm text-[var(--nb-text)] shadow-[3px_3px_0px_var(--nb-shadow)] outline-none transition-shadow duration-200 placeholder:text-[var(--nb-text-faint)] focus-visible:shadow-[5px_5px_0px_var(--nb-shadow)] disabled:opacity-50"
        placeholder={t('form.loot.placeholder')}
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        disabled={loading}
      />

      {loading && (
        <div className="h-1 w-full overflow-hidden border border-[var(--nb-border)] bg-[var(--nb-hover-bg)]">
          <div className="nb-progress" />
        </div>
      )}

      <button
        type="button"
        onClick={onFetch}
        disabled={loading || !text.trim()}
        className="nb-btn nb-btn-secondary group w-full justify-center py-2.5 text-[11px]"
      >
        {loading ? (
          <>
            <span className="nb-spinner" /> {t('form.scanning')}
          </>
        ) : (
          <>
            <Search className="size-4 transition-transform group-hover:scale-110" strokeWidth={2.5} />
            {t('form.fetch')}
          </>
        )}
      </button>

      <AnimatePresence>
        {stale && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-1.5 border-2 border-[var(--nb-amber)] bg-[var(--nb-amber)]/20 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--nb-text)]"
          >
            <AlertTriangle className="mt-0.5 size-3 shrink-0" strokeWidth={2.5} aria-hidden="true" />
            {t('form.stale')}
          </motion.p>
        )}
      </AnimatePresence>

      {sortedItems.length > 0 && (
        <div className="border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[3px_3px_0px_var(--nb-shadow)]">
          <div className="flex items-center justify-between border-b-3 border-[var(--nb-border)] bg-[var(--nb-hover-bg)] px-2.5 py-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)]">
              <Package className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
              {sortedItems.length} {t('form.items')}
            </span>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:underline dark:text-blue-400"
              >
                <ExternalLink className="size-3" aria-hidden="true" />
                {t('form.janice_link')}
              </a>
            )}
          </div>
          <ul className="max-h-[180px] divide-y divide-[var(--nb-border)] overflow-y-auto">
            {sortedItems.map((item) => (
              <li
                key={`${item.typeId}-${item.name}`}
                className="flex items-center justify-between gap-2 px-2.5 py-1.5 transition-colors hover:bg-[var(--nb-hover-bg)]"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="shrink-0 font-mono text-[10px] font-black tabular-nums text-[var(--nb-text-faint)]">
                    {item.quantity}×
                  </span>
                  <span className="truncate text-[11px] font-bold text-[var(--nb-text)]">{item.name}</span>
                </div>
                <span className="shrink-0 font-mono text-[11px] font-bold text-[var(--nb-text-muted)]">
                  {formatISK(totalFor(pricingMode, item))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
