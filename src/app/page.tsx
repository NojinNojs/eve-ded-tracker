import { createClient } from '@/lib/supabase/server';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import { fetchDedRuns, fetchDashboardStats } from '@/app/actions/ded-runs';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  const [runs, stats] = await Promise.all([
    fetchDedRuns(),
    fetchDashboardStats(),
  ]);

  return <Dashboard runs={runs} stats={stats} />;
}
