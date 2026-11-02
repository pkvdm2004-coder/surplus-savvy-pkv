import type { SupabaseClient } from '@supabase/supabase-js';

export type ChatSessionInput = {
  restaurant_type: string;
  inventory_challenge: string;
  improvement_goal: string;
  recommendation: string;
};
export type ChatFeedbackInput = { session_id: string; rating: 'up' | 'down' };

export async function insertChatSession(client: SupabaseClient, input: ChatSessionInput) {
  const { data, error } = await client.from('chat_sessions').insert(input).select('id').single();
  if (error) {
    console.error('External chat session save failed', error.code, error.message);
    const restricted = error.code === '42501';
    return { sessionId: null, error: restricted
      ? 'The database permissions blocked saving the conversation or returning its session ID. INSERT and SELECT access are required for this operation. Feedback cannot be linked; no permissions were changed.'
      : 'Could not confirm the conversation save or retrieve its session ID. Your recommendation is still available. Feedback is unavailable until a session is confirmed.' };
  }
  if (!data || typeof data.id !== 'string') return { sessionId: null, error: 'The database did not return a session ID. Feedback cannot be linked.' };
  return { sessionId: data.id, error: null };
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