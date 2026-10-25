import StatsDashboard from '@/components/StatsDashboard';
import DedRunForm from '@/components/DedRunForm';
import RunHistory from '@/components/RunHistory';
import ChangelogModal from '@/components/ChangelogModal';
import type { DedRun } from '@/lib/types';

interface Props {
  runs: DedRun[];
}

export default function Dashboard({ runs }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <ChangelogModal />
      <div className="flex flex-col gap-5">
        <StatsDashboard runs={runs} />
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <DedRunForm />
          <RunHistory runs={runs} />
        </div>
      </div>
    </div>
  );
}
