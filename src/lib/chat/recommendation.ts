import type { recommend } from './intake';

export const recommendationIntro = 'Based on your restaurant type, challenge, and first priority, consider these steps:';
export const humanCheckpoint = 'Please review these recommendations with your manager or operations team before making changes.';
export const adviceBoundary = 'General guidance only—not medical, legal, or financial advice. AURA will not change inventory or place orders.';

export function formatRecommendation(result: ReturnType<typeof recommend>) {
  return [result.focus, recommendationIntro, ...result.actions.map((action, i) => `${i + 1}. ${action}`), humanCheckpoint, adviceBoundary].join('\n\n');
}