import StatsDashboard from '@/components/StatsDashboard';
import DedRunForm from '@/components/DedRunForm';
import RunHistory from '@/components/RunHistory';
import ChangelogModal from '@/components/ChangelogModal';
import type { DedRun, DashboardStats } from '@/lib/types';

interface Props {
  runs: DedRun[];
  stats: DashboardStats;
}

export default function Dashboard({ runs, stats }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <ChangelogModal />
      <div className="flex flex-col gap-5">
        <StatsDashboard stats={stats} runs={runs} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          <DedRunForm />
          <RunHistory runs={runs} />
        </div>
      </div>
    </div>
  );
}
