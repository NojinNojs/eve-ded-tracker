'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, Hash, BarChart3, Trophy, Activity, Layers } from 'lucide-react';
import { formatISK, formatISKSigned } from '@/lib/format';
import { useI18n, type TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { computeInsights, filterByRange, RANGE_ORDER, type TimeRange } from '@/lib/stats';
import type { DedRun } from '@/lib/types';
import StatCard from '@/components/StatCard';
import InsightStrip from '@/components/InsightStrip';
import Sparkline from '@/components/charts/Sparkline';
import TierColumns from '@/components/charts/TierColumns';

interface Props {
  runs: DedRun[];
}

const RANGE_LABEL: Record<TimeRange, TranslationKey> = {
  today: 'stat.range.today',
  '3d': 'stat.range.3d',
  '1w': 'stat.range.1w',
  '1m': 'stat.range.1m',
  all: 'stat.range.all',
};

const CARD_COLORS = ['var(--nb-stat-cyan)', 'var(--nb-stat-lime)', 'var(--nb-stat-amber)', 'var(--nb-stat-pink)'];

export default function StatsDashboard({ runs }: Props) {
  const { t } = useI18n();
  const [range, setRange] = useState<TimeRange>('all');

  const scopedRuns = useMemo(() => filterByRange(runs, range), [runs, range]);
  const insights = useMemo(() => computeInsights(scopedRuns), [scopedRuns]);

  const cards = [
    {
      icon: TrendingUp,
      label: t('stat.net_pnl'),
      value: insights.count > 0 ? formatISKSigned(insights.totalProfit) : '—',
      sub: t('stat.net_pnl.sub'),
      compact: true,
    },
    {
      icon: Hash,
      label: t('stat.total_runs'),
      value: String(insights.count),
      sub: t('stat.total_runs.sub'),
      compact: false,
    },
    {
      icon: BarChart3,
      label: t('stat.avg_isk_per_run'),
      value: insights.count > 0 ? formatISK(insights.avgProfit) : '—',
      sub: t('stat.avg_isk_per_run.sub'),
      compact: true,
    },
    {
      icon: Trophy,
      label: t('stat.best_run'),
      value: insights.best ? formatISKSigned(Number(insights.best.net_profit)) : '—',
      sub: insights.best
        ? `${insights.best.ded_type} ${insights.best.faction}`
        : t('stat.best_run.sub'),
      compact: true,
    },
  ];

  return (
    <section className="flex flex-col gap-4" aria-label={t('stat.net_pnl')}>
      {/* ── Range control ─────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label={t('stat.range.label')}
          className="flex w-fit overflow-hidden border-3 border-[var(--nb-border)] shadow-[3px_3px_0px_var(--nb-shadow)]"
        >
          {RANGE_ORDER.map((key, i) => {
            const active = range === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                aria-pressed={active}
                className={cn(
                  'cursor-pointer px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-colors duration-150 sm:text-xs',
                  i > 0 && 'border-l-2 border-[var(--nb-border)]',
                  active
                    ? 'bg-[var(--nb-cyan)] text-[#1a1a1a]'
                    : 'bg-[var(--nb-surface)] text-[var(--nb-text-muted)] hover:bg-[var(--nb-hover-bg)] hover:text-[var(--nb-text)]'
                )}
              >
                {t(RANGE_LABEL[key])}
              </button>
            );
          })}
        </div>

        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--nb-text-faint)]">
          {insights.count} {insights.count === 1 ? t('history.run') : t('history.runs')} · Jita
        </p>
      </div>

      {/* ── Primary stat cards ────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div key={card.label} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard {...card} color={CARD_COLORS[i]} />
          </div>
        ))}
      </div>

      {/* ── Derived numbers ───────────────────────────── */}
      <InsightStrip insights={insights} />

      {insights.count === 0 ? (
        <div className="nb-card nb-card--static flex flex-col items-center gap-2 px-6 py-12 text-center">
          <Layers className="size-6 text-[var(--nb-text-faint)]" strokeWidth={2.5} />
          <p className="text-base font-black uppercase tracking-wide">{t('stat.no_data')}</p>
          <p className="max-w-sm text-xs font-medium text-[var(--nb-text-muted)]">{t('stat.no_data.sub')}</p>
        </div>
      ) : (
        <>
          {/* ── Trend + per-level split ─────────────────── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="nb-card nb-card--static flex flex-col p-4 sm:p-5">
              <div className="mb-3 flex items-baseline justify-between gap-3 border-b-3 border-[var(--nb-border)] pb-2">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                  <Activity className="size-4" strokeWidth={2.5} />
                  {t('stat.trend')}
                </h3>
                <span
                  className={cn(
                    'font-mono text-sm font-black',
                    insights.totalProfit >= 0 ? 'text-profit' : 'text-loss'
                  )}
                >
                  {formatISKSigned(insights.totalProfit)}
                </span>
              </div>
              <div className="h-[132px] w-full">
                <Sparkline values={insights.cumulative.map((p) => p.value)} label={t('stat.trend')} />
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">
                {t('stat.trend.sub')}
              </p>
            </div>

            <div className="nb-card nb-card--static flex flex-col p-4 sm:p-5">
              <h3 className="mb-3 flex items-center gap-2 border-b-3 border-[var(--nb-border)] pb-2 text-xs font-black uppercase tracking-[0.12em]">
                <BarChart3 className="size-4" strokeWidth={2.5} />
                {t('stat.by_level')}
              </h3>
              <TierColumns buckets={insights.byLevel} emptyLabel={t('stat.no_data')} />
              <div className="mt-3 grid grid-cols-2 gap-2 border-t-2 border-dashed border-[var(--nb-border)] pt-2">
                {[
                  { key: t('history.bought'), data: insights.bought },
                  { key: t('history.free'), data: insights.free },
                ].map((slot) => (
                  <div key={slot.key} className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--nb-text-muted)]">
                      {slot.key} · {slot.data.count}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-xs font-black',
                        slot.data.profit >= 0 ? 'text-profit' : 'text-loss'
                      )}
                    >
                      {formatISKSigned(slot.data.profit)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Average per site ────────────────────────── */}
          {insights.byFactionLevel.length > 0 && (
            <div className="nb-card nb-card--static p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3 border-b-3 border-[var(--nb-border)] pb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.12em]">{t('stat.by_site')}</h3>
                <span className="hidden font-mono text-xs font-bold uppercase tracking-wider text-[var(--nb-text-faint)] sm:inline">
                  {t('stat.by_site.hint')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {insights.byFactionLevel.map((bucket) => (
                  <div
                    key={`${bucket.faction}-${bucket.dedType}`}
                    className="flex flex-col border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2.5 shadow-[3px_3px_0px_var(--nb-shadow)]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-1">
                      <span className="bg-[var(--nb-text)] px-1.5 py-0.5 font-mono text-xs font-black text-[var(--nb-surface)]">
                        {bucket.dedType}
                      </span>
                      <span className="font-mono text-xs font-bold text-[var(--nb-text-muted)]">
                        ×{bucket.count}
                      </span>
                    </div>
                    <span
                      className="mb-1 truncate text-xs font-bold uppercase text-[var(--nb-text)]"
                      title={bucket.faction}
                    >
                      {bucket.faction}
                    </span>
                    <span
                      className={cn(
                        'mt-auto font-mono text-[12px] font-black',
                        bucket.avgProfit >= 0 ? 'text-profit' : 'text-loss'
                      )}
                    >
                      {formatISKSigned(bucket.avgProfit)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
