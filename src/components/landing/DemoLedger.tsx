'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';
import { computeInsights } from '@/lib/stats';
import { formatISK, formatISKSigned, formatPercent } from '@/lib/format';
import { DEMO_RUNS } from '@/lib/demo';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import TierColumns from '@/components/charts/TierColumns';

/**
 * The sample ledger on the landing page. It runs the real analytics from
 * `computeInsights`, so what a visitor sees here is what they get after login.
 */
export default function DemoLedger() {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);

  const insights = useMemo(() => computeInsights(DEMO_RUNS), []);
  const active = DEMO_RUNS[activeIndex];

  const summary = [
    { label: t('stat.net_pnl'), value: formatISKSigned(insights.totalProfit), color: 'var(--nb-stat-cyan)' },
    { label: t('stat.total_runs'), value: String(insights.count), color: 'var(--nb-stat-lime)' },
    { label: t('stat.avg_isk_per_run'), value: formatISK(insights.avgProfit), color: 'var(--nb-stat-amber)' },
    { label: t('stat.best_run'), value: formatISKSigned(Number(insights.best?.net_profit ?? 0)), color: 'var(--nb-stat-pink)' },
  ];

  const metrics = [
    { label: t('stat.win_rate'), value: formatPercent(insights.winRate, 0) },
    { label: t('stat.capital'), value: formatISK(insights.totalCapital) },
    { label: t('stat.profit_factor'), value: insights.profitFactor ? `${insights.profitFactor.toFixed(2)}×` : '∞' },
    {
      label: t('stat.roi'),
      value: insights.roi === null ? '—' : formatPercent(insights.roi, 0),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* summary */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {summary.map((card) => (
          <div
            key={card.label}
            className="flex flex-col justify-between border-3 border-[var(--nb-border)] p-3 text-black shadow-[5px_5px_0px_var(--nb-shadow)] sm:p-4"
            style={{ background: card.color }}
          >
            <span className="text-xs font-black uppercase leading-tight tracking-[0.12em] opacity-70">
              {card.label}
            </span>
            <span className="mt-2 whitespace-nowrap font-mono text-base font-black leading-none sm:text-xl">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* derived metrics */}
      <dl className="grid grid-cols-2 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] sm:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              'flex flex-col gap-1 px-3 py-2',
              index % 2 === 1 && 'border-l-2',
              index >= 2 && 'border-t-2',
              'sm:border-t-0',
              index > 0 && 'sm:border-l-2',
              'border-[var(--nb-border)]'
            )}
          >
            <dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
              {metric.label}
            </dt>
            <dd className="font-mono text-sm font-black leading-none">{metric.value}</dd>
          </div>
        ))}
      </dl>

      {/* chart */}
      <div className="border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] p-4 shadow-[5px_5px_0px_var(--nb-shadow)]">
        <div className="mb-3 flex items-baseline justify-between border-b-3 border-[var(--nb-border)] pb-2">
          <h3 className="text-xs font-black uppercase tracking-[0.12em]">{t('stat.by_level')}</h3>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">
            {t('stat.by_site.hint')}
          </span>
        </div>
        <TierColumns buckets={insights.byLevel} emptyLabel={t('stat.no_data')} />
      </div>

      {/* ledger */}
      <div className="border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[7px_7px_0px_var(--nb-shadow)]">
        <div className="flex items-center justify-between gap-3 border-b-3 border-[var(--nb-border)] bg-[var(--nb-violet)] px-4 py-2.5">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-black">
            {t('demo.ledger')}
          </span>
          <span className="border-2 border-black bg-[var(--nb-cyan)] px-1.5 py-0.5 text-xs font-black uppercase tracking-[0.12em] text-black">
            {t('demo.badge')}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row">
          <ul className="w-full divide-y-2 divide-[var(--nb-border)] border-[var(--nb-border)] lg:w-3/5 lg:border-r-4">
            {DEMO_RUNS.slice(0, 5).map((run, index) => {
              const selected = index === activeIndex;
              const profit = Number(run.net_profit);
              return (
                <li key={run.id}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={selected}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors',
                      selected ? 'bg-[var(--nb-amber)]' : 'hover:bg-[var(--nb-hover-bg)]'
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="shrink-0 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-1.5 py-0.5 font-mono text-xs font-black shadow-[2px_2px_0px_var(--nb-shadow)]">
                        {run.ded_type}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-black uppercase">{run.faction}</span>
                        <span
                          className={cn(
                            'font-mono text-xs font-bold uppercase tracking-wider',
                            selected ? 'text-black/80' : 'text-[var(--nb-text-muted)]'
                          )}
                        >
                          {run.is_purchased ? t('demo.bought') : t('demo.free')}
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span
                        className={cn(
                          'font-mono text-xs font-black',
                          selected ? 'text-black' : profit >= 0 ? 'text-profit' : 'text-loss'
                        )}
                      >
                        {formatISKSigned(profit)}
                      </span>
                      <ArrowUpRight
                        className={cn('size-3.5 transition-transform', selected && 'rotate-90')}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex w-full flex-col justify-center gap-3 bg-[var(--nb-hover-bg)] p-4 lg:w-2/5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nb-text-muted)]">
                {t('history.escalation')}
              </p>
              <p className="text-lg font-black uppercase leading-tight">
                {active.ded_type} {active.faction}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                  {t('history.loot')}
                </dt>
                <dd className="font-mono text-xs font-bold">{formatISK(Number(active.loot_value))}</dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                  {t('history.capital')}
                </dt>
                <dd className="font-mono text-xs font-bold">
                  {Number(active.capital_cost) > 0 ? formatISK(Number(active.capital_cost)) : '—'}
                </dd>
              </div>
            </dl>

            <div className="border-t-2 border-dashed border-[var(--nb-border)] pt-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                {t('history.pnl')}
              </p>
              <p
                className={cn(
                  'flex items-center gap-1.5 font-mono text-xl font-black leading-none',
                  Number(active.net_profit) >= 0 ? 'text-profit' : 'text-loss'
                )}
              >
                {Number(active.net_profit) >= 0 ? (
                  <TrendingUp className="size-4" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <TrendingDown className="size-4" strokeWidth={3} aria-hidden="true" />
                )}
                {formatISKSigned(Number(active.net_profit))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
