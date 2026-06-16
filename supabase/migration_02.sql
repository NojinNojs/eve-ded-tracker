-- ══════════════════════════════════════════════════════════
--  EVE DED Tracker – Supabase Migration 02
--  RPC: get_dashboard_stats
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  v_total_runs INT;
  v_total_profit NUMERIC;
  v_most_profitable JSON;
BEGIN
  -- Get total runs and total profit
  SELECT COUNT(*), COALESCE(SUM(net_profit), 0)
  INTO v_total_runs, v_total_profit
  FROM public.ded_runs
  WHERE character_id = user_uuid;

  -- Get the most profitable faction/ded_type combo
  SELECT json_build_object(
    'faction', faction,
    'dedType', ded_type,
    'profit', SUM(net_profit)
  )
  INTO v_most_profitable
  FROM public.ded_runs
  WHERE character_id = user_uuid
  GROUP BY faction, ded_type
  ORDER BY SUM(net_profit) DESC
  LIMIT 1;

  -- Return the consolidated stats
  RETURN json_build_object(
    'totalRuns', v_total_runs,
    'totalProfit', v_total_profit,
    'mostProfitable', v_most_profitable
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
