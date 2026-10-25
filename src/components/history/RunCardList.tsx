'use client';

import { ExternalLink } from 'lucide-react';
import { formatDate, formatISK, formatISKSigned } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { janiceUrl, type DedRun } from '@/lib/types';
import { cn } from '@/lib/utils';
import RunActions from '@/components/history/RunActions';

interface Props {
  runs: DedRun[];
  onOpen: (run: DedRun) => void;
  onEdit: (run: DedRun) => void;
  onDelete: (run: DedRun) => void;
}

/** Below `sm` the table turns into these cards — same data, thumb-sized. */
export default function RunCardList({ runs, onOpen, onEdit, onDelete }: Props) {
  const { t, locale } = useI18n();
  const dateLocale = locale === 'id' ? 'id-ID' : 'en-US';

  return (
    <ul className="flex flex-col gap-3 px-3 py-3">
      {runs.map((run, i) => {
        const link = janiceUrl(run.janice_code);
        const profit = Number(run.net_profit);
        return (
          <li
            key={run.id}
            className="animate-fade-in border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[3px_3px_0px_var(--nb-shadow)]"
            style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
          >
            <button
              type="button"
              onClick={() => onOpen(run)}
              aria-label={`${t('history.expand')} — ${run.ded_type} ${run.faction}`}
              className="w-full px-3 pt-3 text-left"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[var(--nb-text)] px-1.5 py-0.5 font-mono text-xs font-black text-[var(--nb-surface)]">
                    {run.ded_type}
                  </span>
                  <span
                    className={cn(
                      'border-2 border-[var(--nb-border)] px-1.5 py-0.5 text-xs font-black uppercase tracking-wider text-black',
                      run.is_purchased ? 'bg-[var(--nb-amber)]' : 'bg-[var(--nb-lime)]'
                    )}
                  >
                    {run.is_purchased ? t('history.bought') : t('history.free')}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[var(--nb-text-muted)]">
                  {formatDate(run.created_at, dateLocale)}
                </span>
              </div>

              <p className="text-sm font-bold uppercase">{run.faction}</p>

              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[var(--nb-text-muted)]">
                  {formatISK(Number(run.loot_value))}
                </span>
                <span
                  className={cn(
                    'font-mono text-base font-black',
                    profit >= 0 ? 'text-profit' : 'text-loss'
                  )}
                >
                  {formatISKSigned(profit)}
                </span>
              </div>
            </button>

            <div className="mt-2 flex items-center justify-between border-t-2 border-[var(--nb-border)] px-3 py-2">
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-blue-600 hover:underline dark:text-blue-400"
                >
                  <ExternalLink className="size-3" aria-hidden="true" />
                  {t('form.janice_link')}
                </a>
              ) : (
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--nb-text-muted)]">
                  {run.pricing_mode} {run.pricing_percent}%
                </span>
              )}
              <RunActions run={run} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
