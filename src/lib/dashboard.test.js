import { test, expect } from 'bun:test';
import { dashboardResult, dashboardSources, rpcDashboardResult } from './dashboard';
import { readDashboard } from './dashboard.server';

test('permission denied produces unavailable, no rows, and no fabricated zero total', () => {
  expect(dashboardResult('inventory', [{ quantity: 12 }], 10, { code: '42501' })).toEqual({ table: 'inventory', state: 'unavailable', rows: [], count: null });
});
test('empty or RLS-filtered results do not claim zero stored records', () => {
  expect(dashboardResult('inventory', [], 0, null)).toEqual({ table: 'inventory', state: 'empty', rows: [], count: null });
});
test('available results preserve authentic quantities and visible count', () => {
  const rows = [{ product_name: 'Tomatoes', quantity: 12 }];
  expect(dashboardResult('inventory', rows, 17, null)).toEqual({ table: 'inventory', state: 'available', rows, count: 17 });
});
test('unknown count remains unknown, not the five-row sample size', () => {
  expect(dashboardResult('inventory', [{ quantity: 12 }], null, null).count).toBeNull();
});
test('dashboard calls existing counts RPC once and only queries Inventory and Research previews', async () => {
  const calls = [];
  const client = { async rpc(name) { calls.push(name); return { data: [{ table_name: 'predictions', total_records: 0 }], error: null }; }, from(table) { return { select(fields, options) { return { async limit(limit) {
    calls.push({ table, fields, options, limit });
    return { data: [{ id: 'real-id' }], count: 7, error: null };
  } }; } }; } };
  const results = await readDashboard(client);
  expect(calls).toHaveLength(3);
  expect(calls.filter(c => c === 'get_dashboard_counts')).toHaveLength(1);
  for (const source of dashboardSources.filter(s => s.table === 'inventory' || s.table === 'research_entries')) expect(calls).toContainEqual({ table: source.table, fields: source.fields.join(','), options: { count: 'exact' }, limit: 5 });
  expect(results.find(r => r.table === 'predictions')).toEqual({ table: 'predictions', state: 'counted', rows: [], count: 0 });
  expect(results.find(r => r.table === 'chat_sessions').state).toBe('error');
  expect(results.find(r => r.table === 'inventory').count).toBe(7);
});

test('RPC totals map by exact table name and never expose individual records', () => {
  expect(rpcDashboardResult('chat_sessions', [{ table_name: 'marketing_assets', total_records: 4 }, { table_name: 'chat_sessions', total_records: '5', private_field: 'hidden' }], null)).toEqual({ table: 'chat_sessions', state: 'counted', rows: [], count: 5 });
});
test('RPC zero is preserved as a confirmed total', () => {
  expect(rpcDashboardResult('predictions', [{ table_name: 'predictions', total_records: 0 }], null).count).toBe(0);
});
test('RPC failures, missing tables, invalid counts, and duplicate rows never fabricate zero', () => {
  for (const rows of [null, [], [{ table_name: 'chat_feedback', total_records: -1 }], [{ table_name: 'chat_feedback', total_records: 'invalid' }], [{ table_name: 'chat_feedback', total_records: 3 }, { table_name: 'chat_feedback', total_records: 3 }]]) expect(rpcDashboardResult('chat_feedback', rows, null).count).toBeNull();
  expect(rpcDashboardResult('chat_feedback', [], { code: '42501' }).state).toBe('unavailable');
});
test('RPC network failure leaves accessible records usable', async () => {
  const client = { async rpc() { throw new Error('offline'); }, from() { return { select() { return { async limit() { return { data: [{ name: 'Winnow' }], count: 8, error: null }; } }; } }; } };
  const results = await readDashboard(client);
  expect(results.find(r => r.table === 'chat_feedback').state).toBe('error');
  expect(results.find(r => r.table === 'research_entries').count).toBe(8);
});