import { test, expect } from 'bun:test';
import { insertChatSession, insertChatFeedback } from './storage.server';

const SID = '11111111-2222-3333-4444-555555555555';
test('session save calls create_chat_session with the four exact parameters and returns its UUID', async () => {
  const calls = [];
  const input = { restaurant_type: 'Café or bakery', inventory_challenge: 'Ingredients expire before use', improvement_goal: 'Food-waste reduction', recommendation: 'Exact displayed recommendation\n1. Review stock.' };
  const client = { async rpc(fn, args) { calls.push(fn, args); return { data: SID, error: null }; } };
  expect(await insertChatSession(client, input)).toEqual({ sessionId: SID, error: null });
  expect(calls).toEqual(['create_chat_session', { p_restaurant_type: input.restaurant_type, p_inventory_challenge: input.inventory_challenge, p_improvement_goal: input.improvement_goal, p_recommendation: input.recommendation }]);
});

test('RPC rejection does not produce a session ID or success', async () => {
  const client = { async rpc() { return { data: null, error: { code: '42501', message: 'permission denied' } }; } };
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