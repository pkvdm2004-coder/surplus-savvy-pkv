import type { SupabaseClient } from '@supabase/supabase-js';
import { dashboardResult, dashboardSources, rpcDashboardResult, usesDashboardCount, type DashboardRow } from './dashboard';

export async function readDashboard(client: SupabaseClient) {
  const counts = (async () => {
    try {
      const { data, error } = await client.rpc('get_dashboard_counts');
      return { data: data as unknown, error };
    } catch {
      return { data: null, error: { code: 'NETWORK' } };
    }
  })();
  return Promise.all(dashboardSources.map(async (source) => {
    if (usesDashboardCount(source.table)) {
      const { data, error } = await counts;
      return rpcDashboardResult(source.table, data, error);
    }
    try {
      const { data, error, count } = await client.from(source.table)
        .select(source.fields.join(','), { count: 'exact' }).limit(5);
      const rows: DashboardRow[] = (data ?? []).map(row => Object.fromEntries(
        source.fields.map(field => {
          const value: unknown = (row as unknown as Record<string, unknown>)[field];
          return [field, typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? value : null];
        }),
      ));
      return dashboardResult(source.table, rows, count, error);
    } catch {
      return dashboardResult(source.table, null, null, { code: 'NETWORK' });
    }
  }));
}