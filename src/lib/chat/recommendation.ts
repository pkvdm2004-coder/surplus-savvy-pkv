import type { recommend } from './intake';

export const recommendationIntro = 'Based on your restaurant type, challenge, and first priority, consider these steps:';
export const humanCheckpoint = 'Please review this recommendation with your manager or operations team before making changes.';
export const adviceBoundary = 'General restaurant-management guidance only—not food-safety, medical, legal, or financial judgments. Consult a qualified professional for those decisions. Never serve unsafe food, ignore expiration dates, or bypass food-safety regulations. AURA will not change inventory or place orders.';

export function canSubmitFeedback(acknowledged: boolean, sessionId: string | null, pending: boolean, feedback: 'up' | 'down' | null) {
  return acknowledged && Boolean(sessionId) && !pending && feedback === null;
}

export function formatRecommendation(result: ReturnType<typeof recommend>) {
  return [result.focus, recommendationIntro, ...result.actions.map((action, i) => `${i + 1}. ${action}`), humanCheckpoint, adviceBoundary].join('\n\n');
}