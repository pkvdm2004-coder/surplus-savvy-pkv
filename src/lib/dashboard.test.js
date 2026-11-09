import { test, expect } from 'bun:test';
import { dashboardResult, dashboardSources } from './dashboard';
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
test('read-only dashboard requests only safe projected fields and five sample rows from all seven external tables', async () => {
  const calls = [];
  const client = { from(table) { return { select(fields, options) { return { async limit(limit) {
    calls.push({ table, fields, options, limit });
    if (table === 'chat_sessions') throw new Error('offline');
    return { data: [{ id: 'real-id' }], count: 7, error: null };
  } }; } }; } };
  const results = await readDashboard(client);
  expect(calls).toHaveLength(7);
  for (const source of dashboardSources) expect(calls).toContainEqual({ table: source.table, fields: source.fields.join(','), options: { count: 'exact' }, limit: 5 });
  expect(calls.find(c => c.table === 'chat_sessions').fields).toBe('id,created_at');
  expect(results.find(r => r.table === 'chat_sessions').state).toBe('error');
  expect(results.find(r => r.table === 'inventory').count).toBe(7);
});