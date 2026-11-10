export const dashboardSources = [
  { table: 'inventory', title: 'Inventory', to: '/inventory', fields: ['product_name', 'quantity', 'unit', 'daily_sales', 'expiration_date', 'category'], labels: ['Product', 'Quantity', 'Unit', 'Daily sales', 'Expiration', 'Category'] },
  { table: 'predictions', title: 'Stored predictions', to: '/predictions', fields: ['id'], labels: ['Record ID'] },
  { table: 'pricing_scenarios', title: 'Saved pricing scenarios', to: '/pricing', fields: ['plan', 'monthly_price', 'restaurant_count', 'monthly_revenue', 'annual_revenue'], labels: ['Plan', 'Monthly price', 'Restaurants', 'Simulated monthly revenue', 'Simulated annual revenue'] },
  { table: 'marketing_assets', title: 'Marketing assets', to: '/marketing', fields: ['title', 'asset_type', 'platform', 'status', 'created_at'], labels: ['Title', 'Type', 'Platform', 'Status', 'Created'] },
  { table: 'chat_sessions', title: 'Chat sessions', to: '/chat', fields: ['id', 'created_at'], labels: ['Session ID', 'Created'] },
  { table: 'chat_feedback', title: 'Chat feedback', to: '/chat', fields: ['session_id', 'rating', 'created_at'], labels: ['Session ID', 'Rating', 'Created'] },
  { table: 'research_entries', title: 'Research entries', to: '/research', fields: ['name', 'type', 'market'], labels: ['Name', 'Type', 'Market'] },
] as const;

export type DashboardTable = typeof dashboardSources[number]['table'];
export function usesDashboardCount(table: DashboardTable) {
  return table !== 'inventory' && table !== 'research_entries';
}
export type DashboardRow = Record<string, string | number | boolean | null>;
export type DashboardResult = {
  table: DashboardTable;
  state: 'available' | 'empty' | 'unavailable' | 'error' | 'counted';
  rows: DashboardRow[];
  count: number | null;
};

export function rpcDashboardResult(table: DashboardTable, rows: unknown, error: { code?: string } | null): DashboardResult {
  if (error) return dashboardResult(table, null, null, error);
  if (!Array.isArray(rows)) return dashboardResult(table, null, null, { code: 'INVALID_RESPONSE' });
  const matches = rows.filter(row => row && typeof row === 'object' && row.table_name === table);
  const value: unknown = matches.length === 1 ? matches[0].total_records : undefined;
  const count = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(count) || count < 0) return dashboardResult(table, null, null, { code: 'INVALID_COUNT' });
  return { table, state: 'counted', rows: [], count };
}

export function dashboardResult(table: DashboardTable, rows: DashboardRow[] | null, count: number | null, error: { code?: string } | null): DashboardResult {
  if (error) return { table, state: error.code === '42501' ? 'unavailable' : 'error', rows: [], count: null };
  // A successful empty SELECT cannot distinguish an empty table from RLS-filtered rows.
  if (!rows?.length) return { table, state: 'empty', rows: [], count: null };
  return { table, state: 'available', rows, count };
}