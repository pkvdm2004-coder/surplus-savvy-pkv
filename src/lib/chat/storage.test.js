import { test, expect } from 'bun:test';
import { insertChatSession, insertChatFeedback } from './storage.server';

test('session insert uses exact answers and recommendation and requests only the generated ID', async () => {
  const calls = [];
  const input = { restaurant_type: 'Café or bakery', inventory_challenge: 'Ingredients expire before use', improvement_goal: 'Food-waste reduction', recommendation: 'Exact displayed recommendation\n1. Review stock.' };
  const client = { from(table) { calls.push(table); return { insert(row) { calls.push(row); return { select(columns) { calls.push(columns); return { async single() { calls.push('single'); return { data: { id: '123' }, error: null }; } }; } }; } }; } };
  expect(await insertChatSession(client, input)).toEqual({ sessionId: '123', error: null });
  expect(calls).toEqual(['chat_sessions', input, 'id', 'single']);
});

test('RLS rejection does not produce a session ID or success', async () => {
  const client = { from() { return { insert() { return { select() { return { async single() { return { data: null, error: { code: '42501', message: 'permission denied' } }; } }; } }; } }; } };
  const result = await insertChatSession(client, {});
  expect(result.sessionId).toBeNull();
  expect(result.error).not.toBeNull();
});

for (const rating of ['up', 'down']) {
  test(`feedback inserts ${rating} linked to the exact session, without SELECT`, async () => {
    const calls = [];
    const input = { session_id: '123', rating };
    const client = { from(table) { calls.push(table); return { async insert(row) { calls.push(row); return { error: null }; } }; } };
    expect(await insertChatFeedback(client, input)).toEqual({ ok: true, error: null });
    expect(calls).toEqual(['chat_feedback', input]);
  });
}

test('feedback failure is never confirmed as saved', async () => {
  const client = { from() { return { async insert() { return { error: { code: '42501', message: 'blocked' } }; } }; } };
  const result = await insertChatFeedback(client, { session_id: '123', rating: 'down' });
  expect(result.ok).toBe(false);
  expect(result.error).not.toBeNull();
});