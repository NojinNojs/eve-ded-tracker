'use client';

import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from 'lucide-react';
import { formatDayMonth, formatISK, formatISKSigned } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { janiceUrl, type DedRun } from '@/lib/types';
import { ariaSort, type SortKey, type SortState } from '@/lib/runSort';
import { cn } from '@/lib/utils';
import RunActions from '@/components/history/RunActions';

interface Props {
  runs: DedRun[];
  sort: SortState;
  onSort: (key: SortKey) => void;
  onOpen: (run: DedRun) => void;
  onEdit: (run: DedRun) => void;
  onDelete: (run: DedRun) => void;
}

const headerCell =
  'text-left text-[10px] font-black uppercase tracking-[0.12em] text-[var(--nb-text-muted)] px-3 py-3';

export default function RunTable({ runs, sort, onSort, onOpen, onEdit, onDelete }: Props) {
  const { t, locale } = useI18n();
  const dateLocale = locale === 'id' ? 'id-ID' : 'en-US';

  const sortableHeader = (key: SortKey, label: string, align: 'left' | 'right' = 'left') => (
    <th
      scope="col"
      aria-sort={ariaSort(sort, key)}
      className={cn(headerCell, align === 'right' && 'text-right')}
    >
      <button
        type="button"
        onClick={() => onSort(key)}
        className={cn('nb-sort', align === 'right' && 'justify-end')}
        data-active={sort.key === key}
      >
        {label}
        {sort.key !== key ? (
          <ArrowUpDown className="size-3 text-[var(--nb-text-faint)]" aria-hidden="true" />
        ) : sort.dir === 'asc' ? (
          <ArrowUp className="size-3" aria-hidden="true" />
        ) : (
          <ArrowDown className="size-3" aria-hidden="true" />
        )}
      </button>
    </th>
  );

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-3 border-[var(--nb-border)] bg-[var(--nb-hover-bg)]">
          {sortableHeader('created_at', t('history.date'))}
          {sortableHeader('ded_type', t('history.escalation'))}
          <th scope="col" className={headerCell}>
            {t('history.source')}
          </th>
          {sortableHeader('loot_value', t('history.loot'), 'right')}
          {sortableHeader('net_profit', t('history.pnl'), 'right')}
          <th scope="col" className="w-px px-3 py-3">
            <span className="sr-only">{t('history.edit')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {runs.map((run, i) => {
          const link = janiceUrl(run.janice_code);
          const profit = Number(run.net_profit);
          return (
            <tr
              key={run.id}
              className="nb-row group animate-fade-in"
              style={{ animationDelay: `${Math.min(i, 8) * 20}ms` }}
            >
              <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] font-bold text-[var(--nb-text-faint)]">
                {formatDayMonth(run.created_at, dateLocale)}
              </td>

              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpen(run)}
                    className="group/open flex items-center gap-2 whitespace-nowrap text-left"
                    aria-label={`${t('history.expand')} — ${run.ded_type} ${run.faction}`}
                  >
                    <span className="font-mono text-sm font-black underline-offset-4 group-hover/open:underline">
                      {run.ded_type}
                    </span>
                    <span className="text-sm font-bold text-[var(--nb-text-muted)] group-hover/open:text-[var(--nb-text)]">
                      {run.faction}
                    </span>
                  </button>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('form.janice_link')}
                      className="inline-flex translate-y-px items-center text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </td>

              <td className="px-3 py-2.5">
                <span
                  className={cn(
                    'nb-badge text-[9px]',
                    run.is_purchased ? 'bg-[var(--nb-amber)]' : 'bg-[var(--nb-lime)]'
                  )}
                >
                  {run.is_purchased ? t('history.bought') : t('history.free')}
                </span>
              </td>

              <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-[12px] font-bold text-[var(--nb-text-muted)]">
                {formatISK(Number(run.loot_value))}
              </td>

              <td
                className={cn(
                  'whitespace-nowrap px-3 py-2.5 text-right font-mono text-[13px] font-black',
                  profit >= 0 ? 'text-profit' : 'text-loss'
                )}
              >
                {formatISKSigned(profit)}
              </td>

              <td className="px-3 py-2.5">
                <div className="flex justify-end opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                  <RunActions run={run} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
