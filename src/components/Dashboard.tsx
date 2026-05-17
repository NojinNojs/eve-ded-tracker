'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchDedRuns, fetchDashboardStats } from '@/app/actions/ded-runs';
import StatsDashboard from '@/components/StatsDashboard';
import DedRunForm from '@/components/DedRunForm';
import RunHistory from '@/components/RunHistory';
import type { DedRun, DashboardStats } from '@/lib/types';

const EMPTY_STATS: DashboardStats = {
  totalProfit: 0,
  totalRuns: 0,
  mostProfitable: null,
};

export default function Dashboard() {
  const [runs, setRuns] = useState<DedRun[]>([]);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [runsData, statsData] = await Promise.all([
      fetchDedRuns(),
      fetchDashboardStats(),
    ]);
    setRuns(runsData);
    setStats(statsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="nb-card bg-gray-100 h-32 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
            <div className="nb-card bg-gray-100 h-[600px] animate-pulse" />
            <div className="nb-card bg-gray-100 h-[600px] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-5">
        <StatsDashboard stats={stats} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          <DedRunForm onRunSubmitted={loadData} />
          <RunHistory runs={runs} onRunDeleted={loadData} />
        </div>
      </div>
    </div>
  );
}
