'use client';

import { TrendingUp, Hash, BarChart3, Trophy } from 'lucide-react';
import { formatISK, formatISKSigned } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { DashboardStats, DedRun } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  stats: DashboardStats;
  runs?: DedRun[];
}

const cardColors = [
  'var(--nb-stat-cyan)',
  'var(--nb-stat-lime)',
  'var(--nb-stat-amber)',
  'var(--nb-stat-pink)',
];

export default function StatsDashboard({ stats, runs }: Props) {
  const { t } = useI18n();
  const avgIsk = stats.totalRuns > 0 ? stats.totalProfit / stats.totalRuns : 0;

  const cards = [
    {
      label: t('stat.net_pnl'), icon: TrendingUp,
      value: stats.totalRuns > 0 ? formatISKSigned(stats.totalProfit) : '—',
      sub: t('stat.net_pnl.sub'),
    },
    {
      label: t('stat.total_runs'), icon: Hash,
      value: String(stats.totalRuns),
      sub: t('stat.total_runs.sub'),
    },
    {
      label: t('stat.avg_isk_per_run') ?? 'Avg Profit / Run', icon: BarChart3,
      value: stats.totalRuns > 0 ? formatISK(avgIsk) : '—',
      sub: t('stat.avg_isk_per_run.sub') ?? 'Average net profit per run',
    },
    {
      label: t('stat.best_run'), icon: Trophy,
      value: stats.mostProfitable?.faction ?? '—',
      sub: stats.mostProfitable
        ? `${stats.mostProfitable.dedType} · ${formatISK(stats.mostProfitable.profit)}`
        : t('stat.best_run.sub'),
    },
  ];

  // Specific averages breakdown
  const breakdownData = runs?.reduce((acc, run) => {
    const key = `${run.faction} ${run.ded_type}`;
    if (!acc[key]) acc[key] = { faction: run.faction, dedType: run.ded_type, totalProfit: 0, count: 0 };
    acc[key].totalProfit += run.net_profit;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { faction: string, dedType: string, totalProfit: number, count: number }>);

  const breakdownList = breakdownData 
    ? Object.values(breakdownData)
        .map(b => ({ ...b, avgProfit: b.totalProfit / b.count }))
        .sort((a, b) => b.avgProfit - a.avgProfit)
    : [];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 stagger">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="nb-card hover-lift p-5 text-black"
          style={{ background: cardColors[i] }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider opacity-75">
              {card.label}
            </span>
            <div className="flex size-8 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-12">
              <card.icon className="size-4 text-black" strokeWidth={2.5} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black sm:text-3xl animate-count-up">
            {card.value}
          </p>
          <p className="mt-2 text-xs font-semibold opacity-60">{card.sub}</p>
        </div>
      ))}

      {breakdownList.length > 0 && (
        <div className="col-span-2 lg:col-span-4 nb-card p-6 mt-2 bg-[var(--nb-surface)]">
          <div className="flex items-center gap-3 mb-6 border-b-3 border-[var(--nb-border)] pb-4">
            <div className="flex size-8 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-lime)] shadow-[2px_2px_0px_var(--nb-shadow)]">
              <BarChart3 className="size-4 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="text-base font-black uppercase tracking-wider">{t('stat.specific_avg') ?? 'Specific Averages'}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {breakdownList.map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col border-3 border-[var(--nb-border)] p-3 shadow-[3px_3px_0px_var(--nb-shadow)] bg-[var(--nb-surface)] hover-lift transition-all animate-scale-in"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--nb-text)] text-[var(--nb-surface)] px-1.5 py-0.5">
                    {item.dedType}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--nb-text-muted)] bg-[var(--nb-hover-bg)] px-1">
                    {item.count} run{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase text-[var(--nb-text)] mb-1 truncate" title={item.faction}>
                  {item.faction}
                </span>
                <span className={cn(
                  'font-mono text-[13px] font-black mt-auto',
                  item.avgProfit >= 0 ? 'text-profit' : 'text-loss'
                )}>
                  {formatISKSigned(item.avgProfit)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
