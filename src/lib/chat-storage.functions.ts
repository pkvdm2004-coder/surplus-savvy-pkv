import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const saveChatSession = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    restaurant_type: z.string().min(1).max(240),
    inventory_challenge: z.string().min(1).max(240),
    improvement_goal: z.string().min(1).max(240),
    recommendation: z.string().min(1).max(10000),
  }))
  .handler(async ({ data }) => {
    try {
      const { externalSupabase } = await import('./external-supabase.server');
      const { insertChatSession } = await import('./chat/storage.server');
      return await insertChatSession(externalSupabase(), data);
    } catch {
      return { sessionId: null, error: 'Could not connect to conversation storage. Your recommendation is still available; feedback cannot be linked without a confirmed session.' };
    }
  });

export const saveChatFeedback = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ session_id: z.uuid(), rating: z.enum(['up', 'down']) }))
  .handler(async ({ data }) => {
    try {
      const { externalSupabase } = await import('./external-supabase.server');
      const { insertChatFeedback } = await import('./chat/storage.server');
      return await insertChatFeedback(externalSupabase(), data);
    } catch {
      return { ok: false, error: 'Could not connect to feedback storage. Your recommendation is still available.' };
    }
  });