import { describe, test, expect } from 'bun:test';
import { intakeQuestions, recommend, guardrailFor } from './intake';
import { canSubmitFeedback } from './recommendation';

describe('guided assistant rules', () => {
  test('exactly three intake questions', () => { expect(intakeQuestions).toHaveLength(3); });
  test('inventory priority produces inventory guidance', () => {
    expect(recommend(['Full-service restaurant', 'Preparing more food than we sell', 'Inventory management']).focus).toBe('Inventory management');
  });
  test('waste priority produces waste guidance', () => {
    expect(recommend(['Café or bakery', 'Stock levels are hard to track', 'Food-waste reduction']).focus).toBe('Food-waste reduction');
  });
  test('operations priority produces operations guidance', () => {
    expect(recommend(['Buffet or catering', 'Ingredients expire before use', 'Operational efficiency']).focus).toBe('Operational efficiency');
  });
  test('restaurant type and challenge both change recommendations', () => {
    const base = recommend(['Café or bakery', 'Ingredients expire before use', 'Food-waste reduction']);
    expect(base.actions).not.toEqual(recommend(['Buffet or catering', 'Ingredients expire before use', 'Food-waste reduction']).actions);
    expect(base.actions).not.toEqual(recommend(['Café or bakery', 'Preparing more food than we sell', 'Food-waste reduction']).actions);
  });
  test('custom priority falls back to stated challenge', () => {
    expect(recommend(['Other', 'Stock levels are hard to track', 'Staff routines']).focus).toBe('Inventory management');
  });
  for (const request of ['medical advice', 'legal advice', 'financial advice', 'automatically change my inventory', 'place an order', 'order ingredients', 'tell me the weather', 'unsafe instructions']) {
    test(`guardrail blocks ${request}`, () => { expect(guardrailFor(request)).not.toBeNull(); });
  }
  test('ordinary restaurant answer is accepted', () => { expect(guardrailFor('A family-run pizza restaurant')).toBeNull(); });
  for (const request of ['Can I serve expired chicken?', 'Can I bypass food safety regulations?', 'What temperature makes chicken safe to serve?', 'Can I serve chicken left out overnight?', 'Can I ignore expiration dates?', 'Can I refreeze thawed fish?', 'How long can cooked rice sit on the counter?', 'How do I cool soup quickly?', 'Can I donate food after it sat out at the buffet?', 'Can I avoid cross-contact for nut-free meals?']) {
    test(`food-safety judgment is redirected: ${request}`, () => {
      const response = guardrailFor(request);
      expect(response).not.toBeNull();
      expect(response).toContain('qualified food-safety professional');
    });
  }
  for (const request of ['medical diagnosis', 'legal contract advice', 'financial investment advice']) {
    test(`professional judgment is redirected: ${request}`, () => { expect(guardrailFor(request)).toContain('qualified professional'); });
  }
  test('unsupported general question is redirected', () => { expect(guardrailFor('Who wrote Hamlet?')).not.toBeNull(); });
  for (const answer of ['Ingredients expire before use', 'Review smaller prep batches', ...intakeQuestions.flatMap(question => question.options)]) {
    test(`supported intake remains accepted: ${answer}`, () => { expect(guardrailFor(answer)).toBeNull(); });
  }
  test('feedback requires acknowledgment even with a confirmed session', () => { expect(canSubmitFeedback(false, 'confirmed-session', false, null)).toBe(false); });
  test('acknowledged confirmed session allows feedback', () => { expect(canSubmitFeedback(true, 'confirmed-session', false, null)).toBe(true); });
  test('acknowledgment without a confirmed session cannot submit feedback', () => { expect(canSubmitFeedback(true, null, false, null)).toBe(false); });
  test('pending feedback cannot be submitted twice', () => { expect(canSubmitFeedback(true, 'confirmed-session', true, null)).toBe(false); });
  for (const rating of ['up', 'down']) {
    test(`${rating} feedback cannot be submitted twice`, () => { expect(canSubmitFeedback(true, 'confirmed-session', false, rating)).toBe(false); });
  }
});