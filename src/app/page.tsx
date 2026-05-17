'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import type { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-60px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="nb-spinner !size-10 !border-[3px]" />
          <p className="text-sm font-black uppercase tracking-wider text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LandingPage />;
  return <Dashboard />;
}
