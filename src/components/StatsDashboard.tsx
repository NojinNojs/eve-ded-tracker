'use client';

import { TrendingUp, Hash, BarChart3, Trophy } from 'lucide-react';
import { formatISK, formatISKSigned } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { DashboardStats } from '@/lib/types';

interface Props {
  stats: DashboardStats;
}

const cardColors = [
  'var(--nb-stat-cyan)',
  'var(--nb-stat-lime)',
  'var(--nb-stat-amber)',
  'var(--nb-stat-pink)',
];

export default function StatsDashboard({ stats }: Props) {
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
      label: t('stat.avg_isk'), icon: BarChart3,
      value: stats.totalRuns > 0 ? formatISK(avgIsk) : '—',
      sub: t('stat.avg_isk.sub'),
    },
    {
      label: t('stat.best_run'), icon: Trophy,
      value: stats.mostProfitable?.faction ?? '—',
      sub: stats.mostProfitable
        ? `${stats.mostProfitable.dedType} · ${formatISK(stats.mostProfitable.profit)}`
        : t('stat.best_run.sub'),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 stagger">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="nb-card hover-lift p-5"
          style={{ background: cardColors[i] }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider opacity-70">
              {card.label}
            </span>
            <div className="flex size-8 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)] transition-transform hover:rotate-12">
              <card.icon className="size-4" strokeWidth={2.5} />
            </div>
          </div>
          <p className="font-mono text-2xl font-black sm:text-3xl animate-count-up">
            {card.value}
          </p>
          <p className="mt-2 text-xs font-semibold opacity-50">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
