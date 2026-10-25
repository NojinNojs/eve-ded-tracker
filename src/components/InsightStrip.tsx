'use client';

import { useI18n } from '@/lib/i18n';
import { formatISK, formatPercent } from '@/lib/format';
import type { Insights } from '@/lib/stats';

interface Props {
  insights: Insights;
}

/**
 * The quiet tier: four derived numbers in one bordered strip.
 * Deliberately flat (no neon, no shadow) so it reads as secondary to the stat cards.
 */
export default function InsightStrip({ insights }: Props) {
  const { t } = useI18n();

  const profitFactor =
    insights.profitFactor === null
      ? insights.count === 0
        ? '—'
        : '∞'
      : `${insights.profitFactor.toFixed(2)}×`;

  const cells = [
    {
      label: t('stat.win_rate'),
      value: insights.count === 0 ? '—' : formatPercent(insights.winRate, 0),
      hint: `${insights.count} ${insights.count === 1 ? t('history.run') : t('history.runs')}`,
    },
    {
      label: t('stat.capital'),
      value: insights.totalCapital > 0 ? formatISK(insights.totalCapital) : '—',
      hint: `${insights.bought.count} ${t('history.bought').toLowerCase()}`,
    },
    {
      label: t('stat.profit_factor'),
      value: profitFactor,
      hint: `${insights.wins}W / ${insights.losses}L`,
    },
    {
      label: t('stat.roi'),
      value: insights.roi === null ? '—' : formatPercent(insights.roi, 0),
      hint: insights.profitFactor === null && insights.count > 0 ? t('stat.no_loss') : t('stat.roi.hint'),
    },
  ];

  return (
    <dl className="grid grid-cols-2 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] sm:grid-cols-4">
      {cells.map((cell, i) => (
        <div
          key={cell.label}
          className={`flex flex-col gap-1 px-4 py-3 ${
            i % 2 === 1 ? 'border-l-2' : ''
          } ${i >= 2 ? 'border-t-2' : ''} sm:border-t-0 ${
            i > 0 ? 'sm:border-l-2' : 'sm:border-l-0'
          } border-[var(--nb-border)]`}
        >
          <dt className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
            {cell.label}
          </dt>
          <dd className="font-mono text-base font-black leading-none">{cell.value}</dd>
          <dd className="hidden truncate font-mono text-[10px] font-bold text-[var(--nb-text-faint)] sm:block">
            {cell.hint}
          </dd>
        </div>
      ))}
    </dl>
  );
}
