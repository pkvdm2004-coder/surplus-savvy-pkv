import type { SupabaseClient } from '@supabase/supabase-js';

export type ChatSessionInput = {
  restaurant_type: string;
  inventory_challenge: string;
  improvement_goal: string;
  recommendation: string;
};
export type ChatFeedbackInput = { session_id: string; rating: 'up' | 'down' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function insertChatSession(client: SupabaseClient, input: ChatSessionInput) {
  const { data, error } = await client.rpc('create_chat_session', {
    p_restaurant_type: input.restaurant_type,
    p_inventory_challenge: input.inventory_challenge,
    p_improvement_goal: input.improvement_goal,
    p_recommendation: input.recommendation,
  });
  if (error) {
    console.error('External chat session save failed', error.code, error.message);
    return { sessionId: null, error: error.code === '42501'
      ? 'The database permissions blocked saving the conversation. No permissions were changed.'
      : 'Could not save the conversation. Your recommendation is still available.' };
  }
  const id = Array.isArray(data) ? data[0] : data;
  if (typeof id !== 'string' || !UUID.test(id)) return { sessionId: null, error: 'The database did not return a valid session ID. Feedback cannot be linked.' };
  return { sessionId: id, error: null };
}

export async function insertChatFeedback(client: SupabaseClient, input: ChatFeedbackInput) {
  // Feedback only needs INSERT; do not require SELECT on chat_feedback.
  const { error } = await client.from('chat_feedback').insert(input);
  if (error) {
    console.error('External chat feedback save failed', error.code, error.message);
    return { ok: false, error: error.code === '42501'
      ? 'The database permissions blocked saving your feedback. No permissions were changed.'
      : 'Could not confirm your feedback save. Your recommendation is still available.' };
  }
  return { ok: true, error: null };
}
