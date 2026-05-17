/* ──────────────────────────────────────────────────────────
 *  Supabase – Browser-side client (via @supabase/ssr)
 *
 *  Uses createBrowserClient which internally manages
 *  cookie-based sessions with a singleton pattern.
 * ────────────────────────────────────────────────────────── */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
