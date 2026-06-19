'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { TrendingUp, Hash, BarChart3, Trophy } from 'lucide-react';
import { formatISK, formatISKSigned } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { DashboardStats, DedRun, Faction, DedType } from '@/lib/types';
import { cn } from '@/lib/utils';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, bounce: 0.5, duration: 0.6 } }
};

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

type TimeRange = 'today' | '3d' | '1w' | '1m' | 'all';

const RANGE_OPTIONS: { key: TimeRange; i18nKey: 'stat.range.today' | 'stat.range.3d' | 'stat.range.1w' | 'stat.range.1m' | 'stat.range.all' }[] = [
  { key: 'today', i18nKey: 'stat.range.today' },
  { key: '3d',    i18nKey: 'stat.range.3d' },
  { key: '1w',    i18nKey: 'stat.range.1w' },
  { key: '1m',    i18nKey: 'stat.range.1m' },
  { key: 'all',   i18nKey: 'stat.range.all' },
];

function getCutoffDate(range: TimeRange): Date | null {
  if (range === 'all') return null;
  const now = new Date();
  switch (range) {
    case 'today': return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case '3d':    return new Date(now.getTime() - 3 * 86_400_000);
    case '1w':    return new Date(now.getTime() - 7 * 86_400_000);
    case '1m':    return new Date(now.getTime() - 30 * 86_400_000);
  }
}

export default function StatsDashboard({ stats, runs }: Props) {
  const { t } = useI18n();
  const [range, setRange] = useState<TimeRange>('all');

  // Filter runs by selected time range
  const filteredRuns = useMemo(() => {
    if (!runs) return [];
    const cutoff = getCutoffDate(range);
    if (!cutoff) return runs;
    return runs.filter(r => new Date(r.created_at) >= cutoff);
  }, [runs, range]);

  // Compute stats from filtered runs
  const { totalRuns, totalProfit, avgIsk, breakdownList, bestRun } = useMemo(() => {
    const isAllTime = range === 'all';
    const count = isAllTime && stats?.totalRuns > 0
      ? stats.totalRuns
      : filteredRuns.length;
    const profit = isAllTime && stats?.totalRuns > 0
      ? stats.totalProfit
      : filteredRuns.reduce((sum, r) => sum + r.net_profit, 0);
    const avg = count > 0 ? profit / count : 0;

    // Specific averages breakdown
    const breakdownData = filteredRuns.reduce((acc, run) => {
      const key = `${run.faction} ${run.ded_type}`;
      if (!acc[key]) acc[key] = { faction: run.faction, dedType: run.ded_type, totalProfit: 0, count: 0 };
      acc[key].totalProfit += run.net_profit;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { faction: Faction; dedType: DedType; totalProfit: number; count: number }>);

    const breakdown = Object.values(breakdownData)
      .map(b => ({ ...b, avgProfit: b.totalProfit / b.count }))
      .sort((a, b) => b.avgProfit - a.avgProfit);

    // Best run
    let best = isAllTime ? stats?.mostProfitable : undefined;
    if (!best && filteredRuns.length > 0) {
      const topRun = filteredRuns.reduce((prev, current) => {
        if (current.net_profit > prev.net_profit) return current;
        if (current.net_profit === prev.net_profit) {
          // If tied, pick the most recent
          return new Date(current.created_at) > new Date(prev.created_at) ? current : prev;
        }
        return prev;
      });
      if (topRun) {
        best = { faction: topRun.faction, dedType: topRun.ded_type, profit: topRun.net_profit };
      }
    }

    return { totalRuns: count, totalProfit: profit, avgIsk: avg, breakdownList: breakdown, bestRun: best };
  }, [filteredRuns, range, stats]);

  const cards = [
    {
      label: t('stat.net_pnl') ?? 'NET PNL', icon: TrendingUp,
      value: totalRuns > 0 ? formatISKSigned(totalProfit) : '—',
      sub: t('stat.net_pnl.sub') ?? 'Total profit across all runs',
    },
    {
      label: t('stat.total_runs') ?? 'TOTAL RUNS', icon: Hash,
      value: String(totalRuns),
      sub: t('stat.total_runs.sub') ?? 'DED escalations completed',
    },
    {
      label: t('stat.avg_isk_per_run') ?? 'AVG PROFIT / RUN', icon: BarChart3,
      value: totalRuns > 0 ? formatISK(avgIsk) : '—',
      sub: t('stat.avg_isk_per_run.sub') ?? 'Average net profit per run',
    },
    {
      label: t('stat.best_run') ?? 'BEST RUN', icon: Trophy,
      value: bestRun?.faction ?? '—',
      sub: bestRun
        ? `${bestRun.dedType} · ${formatISK(bestRun.profit)}`
        : (t('stat.best_run.sub') ?? 'No runs recorded'),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Time range filter ──────────────── */}
      <div
        className="flex items-center border-3 border-[var(--nb-border)] shadow-[3px_3px_0px_var(--nb-shadow)] overflow-hidden w-fit"
        role="group"
        aria-label="Time range filter"
      >
        {RANGE_OPTIONS.map(({ key, i18nKey }, i) => (
          <button
            key={key}
            type="button"
            onClick={() => setRange(key)}
            className={cn(
              'px-3 py-1.5 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors duration-150',
              i > 0 && 'border-l-2 border-[var(--nb-border)]',
              range === key
                ? 'bg-[var(--nb-cyan)] text-[#1a1a1a]'
                : 'bg-[var(--nb-surface)] text-[var(--nb-text-muted)] hover:bg-[var(--nb-hover-bg)] hover:text-[var(--nb-text)]',
            )}
          >
            {t(i18nKey)}
          </button>
        ))}
      </div>

      {/* ── Stat cards ─────────────────────── */}
      {/* Mobile: horizontal scroll · Tablet (sm–lg): 2-col grid · Desktop (lg+): 4-col grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sm:hidden flex w-full gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {cards.map((card, i) => (
          <motion.div variants={itemVariants} key={card.label} className="snap-start shrink-0 min-w-[240px] w-[75vw] max-w-[300px]">
            <StatCard card={card} color={cardColors[i]} />
          </motion.div>
        ))}
      </motion.div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {cards.map((card, i) => (
          <motion.div variants={itemVariants} key={card.label}>
            <StatCard card={card} color={cardColors[i]} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Specific averages breakdown ───── */}
      <AnimatePresence>
        {breakdownList.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="nb-card p-6 mt-2 bg-[var(--nb-surface)] overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-6 border-b-3 border-[var(--nb-border)] pb-4">
              <div className="flex size-8 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-lime)] shadow-[2px_2px_0px_var(--nb-shadow)]">
                <BarChart3 className="size-4 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider">{t('stat.specific_avg') ?? 'Specific Averages'}</h3>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {breakdownList.map((item, idx) => (
                <motion.div
                  variants={itemVariants}
                  key={idx}
                  className="flex flex-col border-3 border-[var(--nb-border)] p-3 shadow-[3px_3px_0px_var(--nb-shadow)] bg-[var(--nb-surface)] hover-lift transition-all"
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
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Stat card sub-component ───────────── */
interface StatCardProps {
  card: { label: string; icon: typeof TrendingUp; value: string; sub: string };
  color: string;
}

function StatCard({ card, color }: StatCardProps) {
  return (
    <div
      className="nb-card hover-lift p-5 text-black flex flex-col justify-between h-full w-full"
      style={{ background: color }}
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
  );
}
