import { createServerFn } from '@tanstack/react-start';
import { dashboardResult, dashboardSources } from './dashboard';

export const getDashboard = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { externalSupabase } = await import('./external-supabase.server');
    const { readDashboard } = await import('./dashboard.server');
    return await readDashboard(externalSupabase());
  } catch {
    return dashboardSources.map(source => dashboardResult(source.table, null, null, { code: 'CONFIGURATION' }));
  }
});